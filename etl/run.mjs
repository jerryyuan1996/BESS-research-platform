#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   THE ETL RUN.

       for each dataset in the catalogue, a few at a time
         load the snapshot currently on disk
         fetch from the source
         validate the result
         write it, or keep the old one and say why
       detect drift against the approved assumptions
       write the drift report
       emit a pull-request body if anything is material

   A few at a time, not all at once. The pool is bounded globally and again per
   provider — see etl/lib/concurrency.mjs for why both limits exist and what the
   two pinned providers are. The rule that matters here is that concurrency is
   an execution detail: results come back in catalogue order, so the report, the
   drift findings and the published files are identical to a sequential run.
   Nothing downstream may depend on which dataset finished first.

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

   Concurrency:
     ETL_CONCURRENCY=3                datasets in flight (default 3, max 8)
     ETL_PROVIDER_CONCURRENCY=jepx=2  per-provider overrides
   --------------------------------------------------------------------------- */
import { writeFile, mkdir } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

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
import { readConcurrencyConfig, runWithConcurrency, providerLimit } from './lib/concurrency.mjs';

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
import * as nesoReserve from './sources/neso-reserve.mjs';
import * as elexonSystemPrices from './sources/elexon-system-prices.mjs';
import * as iesoOntarioZonal from './sources/ieso-ontario-zonal.mjs';

const CONNECTORS = {
  ecb,
  entsoe,
  pse,
  jepx,
  'aemo-wem': aemoWem,
  fingrid,
  'neso-response': nesoResponse,
  'neso-reserve': nesoReserve,
  'elexon-system-prices': elexonSystemPrices,
  'ieso-ontario-zonal': iesoOntarioZonal,
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
  return i >= 0 && argv[i + 1] ? argv[i + 1] : null;
})();

/**
 * Apply `--only`.
 *
 * A blank value means the whole catalogue, as the workflow's dispatch input
 * documents. An id that matches nothing selects nothing: a typo in a dispatch
 * input must fail visibly as an empty run, never fall back to fetching
 * everything.
 */
export function selectDatasets(datasets, only = null){
  const wanted = new Set(String(only ?? '').split(',').map(s => s.trim()).filter(Boolean));
  if (wanted.size === 0) return datasets.slice();
  return datasets.filter(d => wanted.has(d.id));
}

const stdout = (msg) => process.stdout.write(msg + '\n');
const log = stdout;

/** One duration, in the unit a reader can scan. Exact milliseconds stay in summary.json. */
const formatDuration = (ms) => ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${Math.round(ms)} ms`;

/**
 * Print a dataset's outcome, then anything its connector logged while fetching.
 *
 * Connector messages are buffered per dataset rather than written straight to
 * stdout: three datasets run at once, and an unbuffered retry line would land in
 * the middle of another dataset's status block. Each block is emitted
 * synchronously when that dataset settles, so a block is never interleaved —
 * the blocks themselves arrive in completion order, which is why the run also
 * prints the catalogue-ordered table at the end.
 */
function reportResult(result, lines, write){
  const { dataset } = result;
  write(`▸ ${dataset.id} · ${dataset.connector} · ${formatDuration(result.durationMs ?? 0)}`);

  const points = result.snapshot?.series?.length ?? 0;
  switch (result.status){
    case 'written':   write(`  ${result.detail} — ${points} points`); break;
    case 'unchanged': write(`  unchanged (${result.detail}) — ${points} points`); break;
    case 'dry-run':   write(`  validated, not written — ${points} points`); break;
    case 'skipped':   write(`  skipped: ${result.error}`); break;
    case 'invalid':   write(`  NOT PUBLISHED — previous snapshot retained`); break;
    default:          write(`  failed: ${result.error}`); break;
  }
  for (const line of lines) write(`    ${line}`);
  write('');
}

async function runDataset(dataset, now, { connectors = CONNECTORS, log = stdout, dryRun = DRY_RUN } = {}){
  const connector = connectors[dataset.connector];
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

  if (dryRun){
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

/**
 * Run a set of datasets through the pool.
 *
 * Exported so the tests can drive the real executor with fake connectors and a
 * fixed clock. Everything that decides what is published — validation, summary
 * derivation, the write boundary, the failure policy — is the same code path the
 * scheduled run uses; only the connectors and the concurrency setting differ.
 *
 * @param {object}   args
 * @param {Array}    args.datasets
 * @param {object}   [args.connectors]  connector id → module
 * @param {boolean}  [args.dryRun]
 * @param {string}   [args.now]         ISO instant, injected for reproducible tests
 * @param {object}   [args.env]
 * @param {Function} [args.log]
 * @returns {Promise<{results:Array, config:object, maxObserved:number}>}
 */
export async function runSelection({
  datasets, connectors = CONNECTORS, dryRun = DRY_RUN, now = new Date().toISOString(),
  env = process.env, log = stdout,
} = {}){
  const config = readConcurrencyConfig(env, { knownProviders: Object.keys(connectors) });
  /* A typo in a repository variable must not stop the day's data. It is
     reported, the default is used, and the run continues. */
  for (const warning of config.warnings) log(`  warn: ${warning}`);
  if (config.warnings.length > 0) log('');

  const tasks = datasets.map(dataset => ({
    provider: dataset.connector,
    run: async () => {
      const startedAt = performance.now();
      const lines = [];
      const buffered = (msg) => lines.push(String(msg));

      let result;
      try {
        result = await runDataset(dataset, now, { connectors, log: buffered, dryRun });
      } catch (err){
        /* runDataset handles source failures itself; reaching here means a bug
           or a boundary violation. Record it against this dataset and let the
           others finish — one bad dataset must not cancel the run. */
        result = { dataset, status: 'error', error: err?.message ?? String(err) };
      }

      /* Wall time for this dataset, including the fetch. It is recorded rather
         than guessed: the slowest source is an operational fact, and the six-
         hourly schedule has a budget it can only be measured against. The clock
         starts when the pool starts this task, so queue time is not attributed
         to the source. */
      result.durationMs = Math.round(performance.now() - startedAt);
      reportResult(result, lines, log);
      return result;
    },
  }));

  const { results, maxObserved } = await runWithConcurrency(tasks, config);

  return {
    config,
    maxObserved,
    /* Catalogue order, not completion order. A dataset that failed to run at
       all still occupies its slot, so the report has one row per selected
       dataset and downstream code can index results against `datasets`. */
    results: results.map((outcome, i) => outcome.ok
      ? outcome.value
      : { dataset: datasets[i], status: 'error', error: outcome.error.message, durationMs: 0 }),
  };
}

/** The deterministic recap: one row per dataset, in catalogue order. */
function printOrderedResults(results){
  const idWidth = Math.max(...results.map(r => r.dataset.id.length), 7);
  const connectorWidth = Math.max(...results.map(r => r.dataset.connector.length), 9);

  log('Result, in catalogue order:');
  for (const r of results){
    const points = `${r.snapshot?.series?.length ?? 0} pts`.padStart(8);
    log(`  ${r.dataset.id.padEnd(idWidth)}  ${r.dataset.connector.padEnd(connectorWidth)}` +
        `  ${r.status.padEnd(10)}${points}  ${formatDuration(r.durationMs ?? 0).padStart(7)}`);
  }
  log('');
}

async function main(){
  const now = new Date().toISOString();
  const runStarted = performance.now();
  const selected = selectDatasets(DATASETS, ONLY);

  log(`ETL run — ${now}`);
  log(`${selected.length} dataset(s)${DRY_RUN ? ' — DRY RUN, nothing will be written' : ''}`);
  log('');

  const { results, config, maxObserved } = await runSelection({ datasets: selected, dryRun: DRY_RUN, now });

  printOrderedResults(results);

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
    /* What the pool was allowed to do and what it actually did. `maxObserved`
       is the load-bearing one: a configured limit of 3 proves nothing if every
       provider is capped at 1, and this is the number that distinguishes the
       two. Configuration values only — no URL, no credential. */
    concurrency: {
      global: config.global,
      maxObserved,
      /* The limits that actually applied, defaults included — a summary that
         listed only the environment overrides would hide the two provider
         rules that matter most. */
      providers: Object.fromEntries(
        [...new Set(selected.map(d => d.connector))].sort()
          .map(id => [id, providerLimit(id, config.providers)])),
    },
  };
  await writeFile(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n', 'utf8');
  log(`Run time ${(summary.durationMs / 1000).toFixed(1)} s — concurrency ` +
      `${summary.concurrency.global} global, ${maxObserved} observed — per-dataset timings in etl/out/summary.json`);
}

/* Only run when executed, not when imported. The tests import runSelection()
   to drive the real executor; without this guard, importing the module would
   start a live ETL run over the network. */
const invokedDirectly = process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (invokedDirectly){
  main().catch(err => {
    // Only a pipeline fault reaches here. Sources failing are handled above.
    console.error('\nETL run aborted:', err?.stack || err);
    process.exit(1);
  });
}
