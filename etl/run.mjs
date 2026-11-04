#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   THE ETL RUN.

       for each dataset in the catalogue
         load the snapshot currently on disk
         fetch from the source
         validate the result
         write it, or keep the old one and say why
       detect drift against the approved assumptions
       write the drift report
       emit a pull-request body if anything is material

   Failure policy, which is the part worth reading: a dataset that fails does not
   fail the run, and never causes a bad snapshot to be published. The previous
   snapshot stays exactly where it is. A stale number that is clearly labelled
   stale is recoverable; a fresh wrong number that looks authoritative is not.

   The process exits non-zero only when something is wrong with the PIPELINE —
   a boundary violation, an unhandled crash. It exits zero when a source is
   merely down, because that is a normal Tuesday and a red cron every time an
   upstream regulator reboots trains everyone to ignore the alerts.

   Usage:
     node etl/run.mjs                 all datasets
     node etl/run.mjs --only gb-day-ahead,fx-ecb
     node etl/run.mjs --dry-run       fetch and validate, write nothing
   --------------------------------------------------------------------------- */
import { writeFile, mkdir } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import path from 'node:path';

import { DATASETS, snapshotFile, summaryFile } from '../src/governance/datasets.js';
import { markets } from '../src/markets/registry.js';
import { writeSnapshot, readSnapshot, REPO_ROOT } from './lib/boundary.mjs';
import { validateSnapshot } from './lib/validate.mjs';
import { buildSummary } from './lib/summarize.mjs';
import { derivePriceMetrics } from '../src/derive/priceMetrics.js';
import { arbitrageRevenuePerMW } from '../src/derive/merchantBridge.js';
import { MIN_WINDOW_DAYS } from '../src/governance/automation.js';
import { detectDrift } from './drift/detect.mjs';
import { renderDriftReport, renderPullRequestBody } from './drift/report.mjs';

/* Connectors are imported statically so that a typo in a catalogue entry is a
   startup error rather than a runtime surprise three hours into a cron run. */
import * as ecb from './sources/ecb.mjs';
import * as entsoe from './sources/entsoe.mjs';
import * as pse from './sources/pse.mjs';
import * as jepx from './sources/jepx.mjs';
import * as aemoWem from './sources/aemo-wem.mjs';
import * as news from './sources/news.mjs';
import * as fingrid from './sources/fingrid.mjs';
import * as nesoResponse from './sources/neso-response.mjs';

const CONNECTORS = {
  ecb,
  entsoe,
  pse,
  jepx,
  'aemo-wem': aemoWem,
  fingrid,
  'neso-response': nesoResponse,
  /* News used to run from its own entrypoint, outside this orchestrator and
     outside the envelope. That is how it ended up unverifiable. It is an
     ordinary connector now — `npm run etl` covers it, and there is no second
     command that writes into public/data/. */
  news,
};

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes('--dry-run');
const ONLY = (() => {
  const i = argv.indexOf('--only');
  return i >= 0 && argv[i + 1] ? new Set(argv[i + 1].split(',').map(s => s.trim())) : null;
})();

const log = (msg) => process.stdout.write(msg + '\n');

async function runDataset(dataset, now){
  const connector = CONNECTORS[dataset.connector];
  if (!connector?.fetchDataset){
    return { dataset, status: 'error', error: `no connector "${dataset.connector}"` };
  }

  const file = snapshotFile(dataset.id);
  const previous = await readSnapshot(file);

  let result;
  try {
    result = await connector.fetchDataset({ dataset, previous, log, now });
  } catch (err){
    return { dataset, status: 'fetch-failed', error: err.message, snapshot: previous };
  }

  if (result?.skipped){
    return { dataset, status: 'skipped', error: result.reason, snapshot: previous };
  }

  const { snapshot, observations } = result;
  const v = validateSnapshot(snapshot, dataset, previous);

  for (const w of v.warnings) log(`  warn: ${w}`);

  if (!v.ok){
    for (const e of v.errors) log(`  INVALID: ${e}`);
    // The previous snapshot is returned so drift still runs against the last
    // known-good data rather than dropping the market from the report.
    return { dataset, status: 'invalid', errors: v.errors, snapshot: previous };
  }

  /* Derived metrics are computed here rather than inside each connector: they
     are identical for every price series and depend on the market's archetype,
     which is registry knowledge a connector has no business reaching for. */
  const market = dataset.marketId ? markets.find(m => m.manifest.id === dataset.marketId) : null;
  let summary = null;

  /* Spread metrics describe an energy price. A dataset that does not bear on the
     merchant line (Finland's reserve capacity prices, EUR/MW/h) gets the plain
     summary the site loads, never an arbitrage figure read off the wrong unit. */
  const energyPrice = dataset.bearsOn?.includes('economics.merchGross');
  if (connector.summarize){
    summary = connector.summarize(snapshot);
  } else if (market && !energyPrice){
    summary = buildSummary(snapshot, null, { timezone: snapshot.units?.power ? market.manifest.timezone : undefined });
  } else if (market && Array.isArray(snapshot.series) && snapshot.series.length > 0){
    const timezone = market.manifest.timezone;
    const durationHours = market.comparison?.archetype?.durationHours;
    if (timezone && durationHours){
      const metrics = derivePriceMetrics(snapshot.series, { timezone, durationHours });
      const arbitrage = arbitrageRevenuePerMW(metrics);
      summary = buildSummary(snapshot, metrics, { timezone, durationHours, arbitrage });
    }
  } else if (!dataset.marketId){
    // Global datasets (FX) carry no price metrics, but the site still wants the
    // small file rather than the full one.
    summary = buildSummary(snapshot, null, {});
  }

  if (DRY_RUN){
    return { dataset, status: 'dry-run', snapshot, summary, observations };
  }

  const w = await writeSnapshot(file, snapshot);
  const ws = summary ? await writeSnapshot(summaryFile(dataset.id), summary) : { written: false };

  /* Either file changing counts as an update. Reporting only the full snapshot
     would say "unchanged" on a run that rewrote the summary — and the summary is
     the file the site actually loads. */
  const written = w.written || ws.written;

  return {
    dataset,
    status: written ? 'written' : 'unchanged',
    detail: written
      ? [w.written ? 'series' : null, ws.written ? 'summary' : null].filter(Boolean).join(' + ')
      : w.reason,
    snapshot,
    summary,
    observations,
  };
}

async function main(){
  const now = new Date().toISOString();
  const runStarted = performance.now();
  const selected = DATASETS.filter(d => !ONLY || ONLY.has(d.id));

  log(`ETL run — ${now}`);
  log(`${selected.length} dataset(s)${DRY_RUN ? ' — DRY RUN, nothing will be written' : ''}`);
  log('');

  const results = [];
  for (const dataset of selected){
    log(`▸ ${dataset.id}`);
    const datasetStarted = performance.now();
    const r = await runDataset(dataset, now);
    /* Wall time for this dataset, including the fetch. It is recorded rather
       than guessed: the slowest source is an operational fact, and the six-
       hourly schedule has a budget it can only be measured against. */
    r.durationMs = Math.round(performance.now() - datasetStarted);
    results.push(r);

    const points = r.snapshot?.series?.length ?? 0;
    switch (r.status){
      case 'written':   log(`  ${r.detail} — ${points} points`); break;
      case 'unchanged': log(`  unchanged (${r.detail}) — ${points} points`); break;
      case 'dry-run':   log(`  validated, not written — ${points} points`); break;
      case 'skipped':   log(`  skipped: ${r.error}`); break;
      case 'invalid':   log(`  NOT PUBLISHED — previous snapshot retained`); break;
      default:          log(`  failed: ${r.error}`); break;
    }
    log(`  ${r.durationMs} ms`);
    log('');
  }

  // ---- drift ---------------------------------------------------------------
  log('Detecting drift against approved assumptions…');
  const drift = detectDrift({ results: results.filter(r => r.snapshot), markets });

  log(`  material     ${drift.material.length}`);
  log(`  reportable   ${drift.reportable.length}`);
  log(`  informational ${drift.informational.length}`);
  log('');

  // Anchor bootstrap: the number an analyst needs in order to start measuring.
  for (const f of drift.informational){
    if (f.anchorMissing){
      log(`  ${f.marketId}: arbitrage index = ${Math.round(f.currentIndex).toLocaleString('en-US')} per MW/yr` +
          `  windowDays: ${f.metrics.spreadDays}`);
      log(`      record both in src/governance/anchors.js to begin drift tracking` +
          (f.metrics.spreadDays < MIN_WINDOW_DAYS
            ? ` — but wait for the window to fill; ${f.metrics.spreadDays} days is seasonally biased`
            : ''));
    }
  }
  if (drift.informational.some(f => f.anchorMissing)) log('');

  // ---- outputs -------------------------------------------------------------
  const outDir = path.join(REPO_ROOT, 'etl', 'out');
  await mkdir(outDir, { recursive: true });

  const report = renderDriftReport({
    ...drift, runAt: now, datasets: selected.length,
  });
  await writeFile(path.join(outDir, 'drift-report.md'), report + '\n', 'utf8');
  log(`Drift report → etl/out/drift-report.md`);

  if (drift.material.length > 0){
    const body = renderPullRequestBody({ material: drift.material, runAt: now });
    await writeFile(path.join(outDir, 'pr-body.md'), body + '\n', 'utf8');

    /* The machine-readable half of the proposal. etl/propose.mjs reads this to
       produce the actual diff — deliberately a SEPARATE program, run only by the
       pull-request workflow on a branch. This run does not and cannot apply it. */
    const proposals = drift.material.map(f => ({
      marketId: f.marketId,
      path: f.path,
      approved: f.approved,
      proposed: f.observed,
      pct: f.pct,
      reason: f.reason?.[0] ?? '',
    }));
    await writeFile(path.join(outDir, 'proposals.json'), JSON.stringify(proposals, null, 2) + '\n', 'utf8');

    log(`Pull-request body → etl/out/pr-body.md (${drift.material.length} material finding(s))`);
    log(`Proposals        → etl/out/proposals.json`);
  }

  // ---- summary -------------------------------------------------------------
  const failed = results.filter(r => r.status === 'fetch-failed' || r.status === 'invalid' || r.status === 'error');
  const written = results.filter(r => r.status === 'written');

  log('');
  log(`Done. ${written.length} snapshot(s) updated, ${failed.length} dataset(s) unavailable.`);

  /* Exit zero even with failed sources — see the failure policy above. A summary
     line is written for the workflow to surface without failing the job.

     The `datasets` array is the timing record: one row per dataset with its
     connector, outcome, point count and wall time. Ids and counts only — no
     snapshot payload, no URL, no credential — so the file can be kept as an
     artifact and diffed between runs. */
  const summary = {
    runAt: now,
    durationMs: Math.round(performance.now() - runStarted),
    updated: written.map(r => r.dataset.id),
    /* Every dataset this run fetched AND validated, whether or not the file
       changed. The rules engine tests a snapshot only if its id is here: a
       source that was skipped or failed leaves an older snapshot on disk, and
       nothing in the view moves on one this run did not check. */
    fetched: results.filter(r => ['written', 'unchanged', 'dry-run'].includes(r.status)).map(r => r.dataset.id),
    failed: failed.map(r => ({ id: r.dataset.id, status: r.status, error: r.error ?? r.errors?.[0] })),
    material: drift.material.length,
    reportable: drift.reportable.length,
    datasets: results.map(r => ({
      id: r.dataset.id,
      connector: r.dataset.connector,
      status: r.status,
      durationMs: r.durationMs,
      points: r.snapshot?.series?.length ?? 0,
    })),
  };
  await writeFile(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n', 'utf8');
  log(`Run time ${(summary.durationMs / 1000).toFixed(1)} s — per-dataset timings in etl/out/summary.json`);
}

main().catch(err => {
  // Only a pipeline fault reaches here. Sources failing are handled above.
  console.error('\nETL run aborted:', err?.stack || err);
  process.exit(1);
});
