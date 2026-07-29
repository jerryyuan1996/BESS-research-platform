/* ---------------------------------------------------------------------------
   DRIFT REPORTING.

   Two outputs, for two audiences.

   The DRIFT REPORT is written on every run and shows everything the pipeline
   noticed, including the things it decided not to act on. Showing the
   non-material findings is the point: a governance process that only surfaces
   what it already escalated gives its reader no way to check whether the
   thresholds are set sensibly.

   The PULL REQUEST BODY is written only for material findings. It has to answer,
   without the reader opening anything else: what changed, according to whom,
   over what period, what it does to the published numbers, and what specifically
   they are being asked to approve. A proposal that cannot be reviewed on its own
   terms will be either rubber-stamped or ignored, and both defeat the gate.
   --------------------------------------------------------------------------- */
import { BAND } from '../../src/governance/materiality.js';
import { AUTHORITY_LABEL } from '../../src/governance/authority.js';

const pct = (v, dp = 1) => (typeof v === 'number' && Number.isFinite(v))
  ? `${v >= 0 ? '+' : ''}${(v * 100).toFixed(dp)}%` : '—';

const num = (v, dp = 0) => (typeof v === 'number' && Number.isFinite(v))
  ? v.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp }) : '—';

const en = (pair) => Array.isArray(pair) ? pair[0] : String(pair ?? '');

/* --------------------------------------------------------------------------
   The drift report
   -------------------------------------------------------------------------- */

export function renderDriftReport({ findings, material, reportable, informational, runAt, datasets }){
  const L = [];

  L.push('# Drift report');
  L.push('');
  L.push(`Run at ${runAt}`);
  L.push('');
  L.push(`Automation compared ${datasets} dataset(s) against the approved assumptions.`);
  L.push('');
  L.push('| | |');
  L.push('|---|---|');
  L.push(`| Material — pull request opened | ${material.length} |`);
  L.push(`| Reportable — noted, no action | ${reportable.length} |`);
  L.push(`| Informational | ${informational.length} |`);
  L.push(`| Within noise floor | ${findings.filter(f => f.band === BAND.NOISE && !f.informational).length} |`);
  L.push('');
  L.push('> Automation cannot change any value listed here. Every row is either an');
  L.push('> observation or a proposal awaiting a human decision.');
  L.push('');

  if (material.length > 0){
    L.push('## Material — a pull request has been opened');
    L.push('');
    for (const f of material) L.push(...findingRows(f));
  }

  if (reportable.length > 0){
    L.push('## Reportable — real, but moves nothing published');
    L.push('');
    L.push('| Market | Field | Approved | Observed | Delta | Why not escalated |');
    L.push('|---|---|---:|---:|---:|---|');
    for (const f of reportable){
      L.push(`| ${f.marketId ?? 'global'} | \`${f.path}\` | ${num(f.approved, 4)} | ${num(f.observed, 4)} | ${pct(f.pct)} | ${en(f.reason)} |`);
    }
    L.push('');
  }

  if (informational.length > 0){
    L.push('## Informational');
    L.push('');
    for (const f of informational){
      if (f.anchorMissing){
        L.push(`- **${f.marketId}** \`${f.path}\` — no approved anchor recorded.`);
        L.push(`  Current arbitrage index: **${num(f.currentIndex)}** per MW/yr` +
               ` (${f.metrics.spreadDays} trading days, mean spread ${num(f.metrics.spreadMean, 2)}).`);
        L.push('  To begin measuring drift, record this value in `src/governance/anchors.js`.');
      } else {
        L.push(`- **${f.marketId ?? 'global'}** \`${f.path}\` — ${en(f.reason)}`);
      }
    }
    L.push('');
  }

  if (findings.length === 0){
    L.push('No drift detected. Every approved assumption is consistent with what the sources report.');
    L.push('');
  }

  return L.join('\n');
}

function findingRows(f){
  const L = [];
  L.push(`### \`${f.path}\`${f.marketId ? ` — ${f.marketId}` : ' — global'}`);
  L.push('');
  L.push(`${en(f.reason)}`);
  L.push('');
  L.push('| | Approved | Proposed | Delta |');
  L.push('|---|---:|---:|---:|');
  L.push(`| Value | ${num(f.approved, 4)} | ${num(f.observed, 4)} | ${pct(f.pct)} |`);
  L.push('');
  if (f.impact?.moves?.length){
    L.push(`Downstream impact at exit year ${f.impact.exitYear}:`);
    L.push('');
    L.push('| Metric | Approved | Proposed | Move |');
    L.push('|---|---:|---:|---:|');
    for (const m of f.impact.moves){
      const fmt = m.metric === 'moic' ? (v) => `${v.toFixed(3)}x` : (v) => `${(v * 100).toFixed(2)}%`;
      L.push(`| ${m.metric} | ${fmt(m.approved)} | ${fmt(m.proposed)} | ${m.delta >= 0 ? '+' : ''}${m.metric === 'moic' ? m.delta.toFixed(3) : (m.delta * 100).toFixed(2) + ' pp'} |`);
    }
    L.push('');
  }
  return L;
}

/* --------------------------------------------------------------------------
   The pull-request body
   -------------------------------------------------------------------------- */

export function renderPullRequestBody({ material, runAt }){
  const L = [];

  L.push('## Proposed assumption changes');
  L.push('');
  L.push('Automation detected material drift between public sources and the approved');
  L.push('assumptions in this repository. **This pull request changes nothing on its own.**');
  L.push('It proposes changes for an analyst to accept, amend or reject.');
  L.push('');
  L.push(`Detected ${runAt}.`);
  L.push('');
  L.push('---');
  L.push('');

  for (const f of material){
    L.push(`### ${f.marketId ? `${f.marketId} — ` : ''}\`${f.path}\``);
    L.push('');
    L.push(`**Authority:** ${en(AUTHORITY_LABEL[f.authority])}`);
    L.push('');
    L.push(`**Finding:** ${en(f.reason)}`);
    L.push('');
    L.push('| | Value |');
    L.push('|---|---:|');
    L.push(`| Currently approved | ${num(f.approved, 4)} |`);
    L.push(`| Proposed | ${num(f.observed, 4)} |`);
    L.push(`| Change | ${pct(f.pct)} |`);
    L.push('');

    if (f.evidence){
      L.push('**Evidence**');
      L.push('');
      if (f.evidence.source) L.push(`- Source: ${f.evidence.source}${f.evidence.url ? ` — ${f.evidence.url}` : ''}`);
      if (f.evidence.coverage?.from) L.push(`- Window: ${f.evidence.coverage.from.slice(0, 10)} to ${f.evidence.coverage.to.slice(0, 10)} (${f.evidence.coverage.points} points)`);
      if (f.evidence.spreadDays != null) L.push(`- Complete trading days analysed: ${f.evidence.spreadDays}`);
      if (f.evidence.spreadMean != null) L.push(`- Mean daily spread: ${num(f.evidence.spreadMean, 2)} per MWh`);
      if (f.evidence.anchorAsOf) L.push(`- Compared against the anchor recorded ${f.evidence.anchorAsOf}`);
      if (f.evidence.anchorNote) L.push(`- Anchor note: _${f.evidence.anchorNote}_`);
      if (f.evidence.approvedAsOf) L.push(`- Approved value dated ${f.evidence.approvedAsOf}`);
      if (f.evidence.affectedMarkets?.length) L.push(`- Markets repriced by this rate: ${f.evidence.affectedMarkets.join(', ')}`);
      L.push('');
    }

    if (f.impact?.moves?.length){
      L.push(`**Downstream model impact** (exit year ${f.impact.exitYear}, base strategy)`);
      L.push('');
      L.push('| Metric | Approved | Proposed | Move |');
      L.push('|---|---:|---:|---:|');
      for (const m of f.impact.moves){
        const fmt = m.metric === 'moic' ? (v) => `${v.toFixed(3)}x` : (v) => `${(v * 100).toFixed(2)}%`;
        const mv = m.metric === 'moic' ? `${m.delta >= 0 ? '+' : ''}${m.delta.toFixed(3)}x`
          : `${m.delta >= 0 ? '+' : ''}${(m.delta * 100).toFixed(2)} pp`;
        L.push(`| \`${m.metric}\` | ${fmt(m.approved)} | ${fmt(m.proposed)} | ${mv} |`);
      }
      L.push('');
    } else {
      L.push('**Downstream model impact:** not computed for this field — see the note in');
      L.push('`etl/drift/detect.mjs` on why FX impact is not measured through the engine.');
      L.push('');
    }

    if (f.bridge){
      L.push('<details><summary>How the proposed value was derived</summary>');
      L.push('');
      L.push('The observed price series does not measure `merchGross` directly — it cannot,');
      L.push('because `merchGross` bundles balancing and intraday revenue that a day-ahead');
      L.push('series does not contain. The pipeline computes a wholesale-arbitrage index and');
      L.push('applies its **movement** against the analyst-recorded anchor:');
      L.push('');
      L.push('```');
      L.push(`arbitrage index now        ${num(f.currentIndex)}`);
      L.push(`anchor (${f.anchor?.asOf ?? '—'})           ${num(f.anchor?.value)}`);
      L.push(`ratio                      ${f.bridge.ratio?.toFixed(4) ?? '—'}`);
      L.push(`approved merchGross        ${num(f.approved)}`);
      L.push(`proposed = approved x ratio ${num(f.observed)}`);
      L.push('```');
      L.push('');
      L.push('Bridge parameters are in `src/governance/derivation.js`. Because the comparison');
      L.push('is a ratio against an anchor computed the same way, an error in those parameters');
      L.push('largely cancels rather than propagating into the proposal.');
      L.push('');
      L.push('</details>');
      L.push('');
    }

    L.push('---');
    L.push('');
  }

  L.push('### Reviewing this');
  L.push('');
  L.push('- [ ] The source and window are the ones you would have used');
  L.push('- [ ] The proposed value is consistent with your view, not merely with the data');
  L.push('- [ ] The downstream impact is acceptable and does not misorder the league table');
  L.push('- [ ] If you accept a `merchGross` change, **re-anchor** in `src/governance/anchors.js`');
  L.push('      so the pipeline stops proposing the change you just made');
  L.push('');
  L.push('If you reject this, close the pull request. The pipeline will raise it again on the');
  L.push('next run while the drift persists — either adjust the assumption, re-anchor, or');
  L.push('widen the threshold in `src/governance/materiality.js`.');
  L.push('');
  L.push('_Opened automatically. Auto-merge is disabled for this branch by policy._');

  return L.join('\n');
}
