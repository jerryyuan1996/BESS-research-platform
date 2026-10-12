/* ---------------------------------------------------------------------------
   EVERY GRADING SHEET ON ONE PAGE — for the analyst's review.

   Reads each docs/grading/<id>.draft.json, and for a market already graded the
   store itself, and prints one table of grades and one of calls as
   docs/grading/overview.md. A grade is marked by where it came from:

       plain     written to the store on the analyst's answer
       d         a draft, resting on a source that was opened
       r         a recommendation, the drafting agent's estimate with no source

   The calls are arithmetic: the band each investor's fit falls in on those
   grades, or "not accessible" where a knock-out or a breached limit applies.

   IT WRITES NO VIEW. Like draft-sheet.mjs, it has no path to the store's
   writer.

   Run:  node scripts/view/draft-overview.mjs
   --------------------------------------------------------------------------- */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { DIMENSIONS, ARCHETYPE_IDS, VERDICT_LABEL } from '../../src/governance/investability.js';
import { ARCHETYPES, assess, NOT_ACCESSIBLE } from '../../src/governance/archetypes.js';
import { markets } from '../../src/markets/registry.js';
import { ledgerFor } from '../../src/entry/ledgerRegistry.js';
import { ledgerTotals, referenceProject, limitInputs } from '../../src/entry/ledger.js';
import { FX } from '../../src/comparison/assumptions.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIR = path.join(ROOT, 'docs', 'grading');
const ON = new Date().toISOString().slice(0, 10);

const drafts = {};
for (const file of (await readdir(DIR)).filter(f => f.endsWith('.draft.json'))){
  const d = JSON.parse(await readFile(path.join(DIR, file), 'utf8'));
  drafts[d.market] = d;
}
const store = async (id) => JSON.parse(await readFile(path.join(ROOT, 'view', 'markets', `${id}.json`), 'utf8').catch(() => '{"grades":{},"verdicts":{}}'));

const SHORT = {
  assetReturn: 'Ret', revenueCertainty: 'Cert', capitalAtRisk: 'CaR', approvalTransparency: 'Appr', timeToRevenue: 'Time',
  gridScarcity: 'Grid', foreignEntry: 'FDI', supplyChainOrigin: 'Orig', policyStability: 'Pol', demandGrowth: 'Dem',
  saturation: 'Sat', debtAvailability: 'Debt', exitLiquidity: 'Exit', scaleRepeatability: 'Scale',
};

const out = [];
out.push('# Grading overview — every market on one page', '');
out.push(`Generated ${ON}. **Plain** numbers are in the view store, written on your answers. **d** marks a draft that rests on a source I opened. **r** marks my recommendation with no source: an estimate from general knowledge and from how the graded markets compare. Nothing marked d or r has been written.`, '');
out.push(`| Market | ${DIMENSIONS.map(d => SHORT[d.id]).join(' | ')} |`);
out.push(`|---|${DIMENSIONS.map(() => '---').join('|')}|`);

const calls = [];
for (const market of markets){
  const id = market.manifest.id;
  const view = await store(id);
  const draft = drafts[id];
  const written = Object.keys(view.grades).length > 0;
  const grades = {}, marks = {};
  for (const d of DIMENSIONS){
    if (written && view.grades[d.id]){ grades[d.id] = view.grades[d.id]; marks[d.id] = String(view.grades[d.id].held?.grade ?? view.grades[d.id].grade); }
    else if (draft?.drafted?.[d.id]){ grades[d.id] = draft.drafted[d.id].grade; marks[d.id] = `${grades[d.id]}d`; }
    else if (draft?.recommended?.[d.id]){ grades[d.id] = draft.recommended[d.id].grade; marks[d.id] = `${grades[d.id]}r`; }
    else marks[d.id] = '–';
  }
  out.push(`| ${id} | ${DIMENSIONS.map(d => marks[d.id]).join(' | ')} |`);

  const project = referenceProject(market.comparison, FX[market.manifest.currency]);
  const ledger = ledgerFor(id);
  const inputs = limitInputs(ledger ? ledgerTotals(ledger, FX, project?.costUSD ?? null) : { empty: true, projectCostUSD: project?.costUSD ?? null });
  const row = [id];
  for (const a of ARCHETYPE_IDS){
    const set = view.verdicts?.[a];
    const r = assess(ARCHETYPES[a], grades, inputs.metrics, null, inputs.incomplete, ON);
    const band = r.fit === null ? 'not scored' : r.ceiling === NOT_ACCESSIBLE ? 'Not accessible' : VERDICT_LABEL[r.band][0];
    const why = r.ceiling === NOT_ACCESSIBLE ? ` (${[...r.knockOuts, ...r.limitsBreached].join(', ')})` : '';
    row.push(set ? `**${VERDICT_LABEL[set.call][0]}** · fit ${r.fit?.toFixed(0)}` : `${band}${why} · fit ${r.fit === null ? '–' : r.fit.toFixed(0)}`);
  }
  calls.push(row);
}

out.push('', '## Calls', '');
out.push('**Bold** is a verdict you have set. Everything else is the band the fit falls in on the grades above, or not accessible where a knock-out or a breached limit applies, with the dimension or limit named. It is arithmetic, offered as a recommendation; the call is yours.', '');
out.push(`| Market | ${ARCHETYPE_IDS.map(a => ARCHETYPES[a].label[0]).join(' | ')} |`, '|---|---|---|---|---|');
for (const row of calls) out.push(`| ${row.join(' | ')} |`);
out.push('', 'Routes are each investor\'s default: greenfield for the strategic and the developer, ready-to-build for the fund and the first-timer. A limit is checked on that route.', '');

await writeFile(path.join(DIR, 'overview.md'), out.join('\n'), 'utf8');
console.log(`  docs/grading/overview.md  (${Object.keys(drafts).length} drafts)`);
