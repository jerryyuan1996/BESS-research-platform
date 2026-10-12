/* ---------------------------------------------------------------------------
   A GRADING SHEET — one market's draft, laid out for the analyst to answer.

   A grade and a verdict are the analyst's judgement. What can be prepared for
   him is the reading a source supports, set beside the anchor it was read
   against, and the arithmetic that follows from the grades as they stand. This
   prints that, from docs/grading/<id>.draft.json, as docs/grading/<id>.md.

   IT WRITES NO VIEW. It does not import the view writer and has no path to the
   store. A draft becomes a record only when the analyst has answered the sheet
   and the change is applied through scripts/view/writer.mjs.

   THREE THINGS IT WILL NOT DO, each on purpose:

     - fill in a call. The verdict rows show the score, the band it falls in
       and the ceiling, and the call column is empty;
     - draft a grade where no source was opened. Those rows say "yours" and
       show the anchors, and whatever was found;
     - score around a gap. A pillar with an open dimension has no score, so
       the sheet shows the range the fit can take and says which open grades
       would close the market to which investor.

   The sheet and the draft cannot differ: every drafted record is validated
   with the store's own validator before a line is printed, and the same record
   is what the change file will carry.

   Run:  node scripts/view/draft-sheet.mjs <market-id>
   --------------------------------------------------------------------------- */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  PILLARS, PILLAR_LABEL, DIMENSIONS, dimension, dimensionsIn, validateGrade, BASIS_LABEL, VERDICT_LABEL,
  ARCHETYPE_IDS, ROUTE_LABEL,
} from '../../src/governance/investability.js';
import { ARCHETYPES, KNOCK_OUT, pillarScore, bandOf, limitCheck, METRIC } from '../../src/governance/archetypes.js';
import { INTERNAL_EVIDENCE } from '../../view/schema/view.mjs';
import { byId } from '../../src/markets/registry.js';
import { ledgerFor } from '../../src/entry/ledgerRegistry.js';
import { ledgerTotals, referenceProject, limitInputs } from '../../src/entry/ledger.js';
import { FX } from '../../src/comparison/assumptions.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');

const id = process.argv[2];
if (!id){ console.error('usage: node scripts/view/draft-sheet.mjs <market-id>'); process.exit(2); }

const market = byId(id);
if (!market){ console.error(`"${id}" is not a registered market`); process.exit(1); }

const draft = JSON.parse(await readFile(path.join(ROOT, 'docs', 'grading', `${id}.draft.json`), 'utf8'));
const dir = id.startsWith('jp_') ? 'jp' : id;
const { SRC } = await import(`../../src/markets/${dir}/sources.js`);

/* ---- the drafted records are held to the store's own rules ------------------ */

const records = {};
const problems = [];
for (const [key, body] of Object.entries(draft.drafted)){
  const record = { ...body, asOf: draft.preparedOn, author: 'analyst', lockedUntil: null };
  records[key] = record;
  if (record.dimension !== key) problems.push(`${key}: filed under the wrong dimension`);
  problems.push(...validateGrade(record));
  for (const e of record.evidence){
    if (!SRC[e] && !INTERNAL_EVIDENCE[e]) problems.push(`${key}: cites "${e}", which is in neither the source register nor the internal list`);
  }
}
if (problems.length){ console.error(problems.join('\n')); process.exit(1); }

const open = DIMENSIONS.filter(d => !records[d.id]).map(d => d.id);
const bare = Object.fromEntries(Object.entries(records).map(([k, r]) => [k, r.grade]));

/* ---- money ------------------------------------------------------------------ */

const usd = (v) => v >= 1e6 ? `USD ${(v / 1e6).toFixed(v >= 1e8 ? 0 : 2)}m` : `USD ${Math.round(v / 1e3)}k`;
const project = referenceProject(market.comparison, FX[market.manifest.currency]);
const ledger = ledgerFor(id);
const totals = ledger ? ledgerTotals(ledger, FX, project?.costUSD ?? null) : null;
const inputs = limitInputs(totals ?? { empty: true, projectCostUSD: project?.costUSD ?? null });

/* ---- the sheet ---------------------------------------------------------------- */

const out = [];
const line = (s = '') => out.push(s);
const cell = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const evidenceName = (e) => INTERNAL_EVIDENCE[e] ? INTERNAL_EVIDENCE[e][0] : `${SRC[e].file} (${SRC[e].date})`;

line(`# Grading sheet — ${market.manifest.name?.[0] ?? id}`);
line();
line(`Prepared ${draft.preparedOn}. **A draft for your decision. Nothing here is a grade until you answer it, and nothing has been written to the view store.**`);
line();
line(`Reference project: ${project.powerMW} MW · ${project.durationHours}h, ${usd(project.costUSD)}. ${Object.keys(records).length} of ${DIMENSIONS.length} dimensions carry a draft; ${open.length} are yours.`);
line();
line('How to answer, in the session: `accept` the rows you agree with, give a number for any you change or that are yours, or say a dimension `waits`. Then the four calls, each with its route. A practitioner grade needs only its number here; its reason stays in your private notes and I do not read or write it.');
line();

for (const pillar of PILLARS){
  line(`## ${PILLAR_LABEL[pillar][0]}`);
  line();
  for (const d of dimensionsIn(pillar)){
    const r = records[d.id];
    line(`### ${d.label[0]}${r ? ` — draft ${r.grade}` : ' — yours'}`);
    line();
    line(`*${d.measure[0]}*`);
    line();
    const shown = r ? [r.grade + 1, r.grade, r.grade - 1].filter(g => g >= 1 && g <= 5) : [5, 4, 3, 2, 1];
    line('| Grade | Anchor |');
    line('|---|---|');
    for (const g of shown) line(`| ${r && g === r.grade ? `**${g}**` : g} | ${cell(d.anchors[g][0])} |`);
    line();
    if (r){
      line(`- **Draft:** ${r.grade}, ${BASIS_LABEL[r.basis][0].toLowerCase()}, trend ${r.trend}${r.trendCause ? ` (${r.trendCause[0]})` : ''}.`);
      line(`- **Reason that would be published:** ${r.reason[0]}`);
      line(`- **中文：** ${r.reason[1]}`);
      line(`- **Evidence:** ${r.evidence.map(evidenceName).join('; ')}.`);
      if (r.metric) line(`- **Metric beside the grade:** ${usd(r.metric.perProject)} on the project, ${(100 * r.metric.shareOfCost).toFixed(2)}% of its cost.`);
    } else {
      line('- **No draft.** If you grade it with no public source, it is a practitioner grade.');
    }
    for (const note of draft.found?.[d.id] ?? []) line(`- **What I found:** ${note}`);
    for (const seed of draft.seeds?.[d.id] ?? []) line(`- **Seed line from the dashboard's own table:** ${seed}`);
    line(`- **Your answer:**`);
    line();
  }
}

/* ---- the arithmetic for each investor ---------------------------------------- */

line('## The four investors');
line();
line('The call column is yours. The rest is arithmetic on the grades above as they stand, and it moves when you change one.');
line();

/* What an open dimension can add to a pillar, at its worst and best reading. */
function pillarRange(arch, pillar){
  let lo = 0, hi = 0, weights = 0;
  for (const d of dimensionsIn(pillar)){
    const w = arch.weight[d.id];
    weights += w;
    const table = arch.reads[d.id];
    if (bare[d.id] !== undefined){
      const u = table[bare[d.id]] === KNOCK_OUT ? 0 : table[bare[d.id]];
      lo += w * u; hi += w * u;
    } else {
      const values = [1, 2, 3, 4, 5].map(g => table[g] === KNOCK_OUT ? 0 : table[g]);
      lo += w * Math.min(...values); hi += w * Math.max(...values);
    }
  }
  return [lo / weights, hi / weights];
}

line('| Investor | Call | Route | Fit | Band the fit falls in | Closed by | Limits not checked |');
line('|---|---|---|---|---|---|---|');
const detail = [];
for (const a of ARCHETYPE_IDS){
  const arch = ARCHETYPES[a];
  const knocked = Object.keys(bare).filter(k => arch.reads[k][bare[k]] === KNOCK_OUT);
  const limits = limitCheck(arch, inputs.metrics, arch.defaultRoute, inputs.incomplete);
  let lo = 0, hi = 0, complete = true;
  for (const p of PILLARS){
    const [l, h] = pillarRange(arch, p);
    lo += arch.pillarWeight[p] * l; hi += arch.pillarWeight[p] * h;
    if (pillarScore(arch, p, bare) === null) complete = false;
  }
  const fit = complete ? lo.toFixed(0) : `${lo.toFixed(0)} to ${hi.toFixed(0)}`;
  const band = complete ? VERDICT_LABEL[bandOf(lo)][0]
    : bandOf(lo) === bandOf(hi) ? VERDICT_LABEL[bandOf(lo)][0] : `${VERDICT_LABEL[bandOf(lo)][0]} to ${VERDICT_LABEL[bandOf(hi)][0]}`;
  const closed = [
    ...knocked.map(k => `${dimension(k).label[0]} at ${bare[k]}`),
    ...limits.breached.map(l => arch.limits.find(x => x.id === l).label[0]),
  ];
  const label = (l) => arch.limits.find(x => x.id === l).label[0];
  line(`| ${arch.label[0]} |  | default: ${ROUTE_LABEL[arch.defaultRoute][0].toLowerCase()} | ${fit} | ${band} | ${closed.length ? cell(closed.join('; ')) : 'nothing so far'} | ${limits.unchecked.length ? cell(limits.unchecked.map(label).join('; ')) : 'none'} |`);

  const risks = open.filter(k => [1, 2, 3, 4, 5].some(g => arch.reads[k][g] === KNOCK_OUT))
    .map(k => `${dimension(k).label[0]} at ${[1, 2, 3, 4, 5].filter(g => arch.reads[k][g] === KNOCK_OUT).join(' or ')}`);
  const pillars = PILLARS.map(p => {
    const s = pillarScore(arch, p, bare);
    const [l, h] = pillarRange(arch, p);
    return `${PILLAR_LABEL[p][0]} ${s === null ? `${l.toFixed(0)} to ${h.toFixed(0)}` : s.toFixed(0)}`;
  });
  const moves = Object.keys(bare)
    .map(k => ({ k, part: arch.pillarWeight[dimension(k).pillar] * arch.weight[k] / dimensionsIn(dimension(k).pillar).reduce((s, d) => s + arch.weight[d.id], 0), u: arch.reads[k][bare[k]] }))
    .filter(x => x.u !== KNOCK_OUT)
    .sort((x, y) => y.part * Math.abs(y.u - 50) - x.part * Math.abs(x.u - 50));
  const fors = moves.filter(x => x.u >= 60).slice(0, 3).map(x => `${dimension(x.k).label[0]} (${bare[x.k]}, reads ${x.u})`);
  const against = moves.filter(x => x.u < 50).slice(0, 1).map(x => `${dimension(x.k).label[0]} (${bare[x.k]}, reads ${x.u})`);
  detail.push(`- **${arch.label[0]}.** Pillars: ${pillars.join(' · ')}. Among the drafted grades, what lifts the score most: ${fors.join('; ') || 'nothing reads above 60'}. Strongest against: ${against.join('; ') || 'nothing reads below 50'}.${risks.length ? ` An open grade would close the market to it: ${risks.join('; ')}.` : ''}`);
}
line();
line(...[detail.join('\n')]);
line();
line(`A range means a pillar has an open dimension: the low end takes every open grade at its worst reading for that investor and the high end at its best. A knock-out counts as zero inside a score and closes the market whatever the score says.`);
line();

line('## Money and limits');
line();
line(`- Project cost ${usd(project.costUSD)}. Cheques: ${ARCHETYPE_IDS.filter(a => ARCHETYPES[a].chequeUSD).map(a => `${ARCHETYPES[a].label[0].toLowerCase()} ${usd(ARCHETYPES[a].chequeUSD[0])} to ${usd(ARCHETYPES[a].chequeUSD[1])}`).join('; ')}.`);
if (totals && !totals.empty && totals.preFid.usd === 0){
  line('- Capital before the decision: no figure. Nothing in the ledger has an amount that converts to dollars, so every limit on it is unchecked.');
  line(`- Not quantified in the ledger: ${totals.unquantified.map(i => ledger.items.find(x => x.id === i).label[0]).join('; ')}.`);
} else if (totals && !totals.empty){
  line(`- Capital before the decision: ${totals.preFid.lowerBound ? 'at least ' : ''}${usd(totals.preFid.usd)}, ${(100 * totals.shareOfCost).toFixed(2)}% of project cost. Security before consent: ${totals.securityBeforeConsent.lowerBound ? 'not established; at least ' : ''}${usd(totals.securityBeforeConsent.usd)}.`);
  line(`- Not quantified in the ledger: ${totals.unquantified.map(i => ledger.items.find(x => x.id === i).label[0]).join('; ') || 'nothing'}.`);
}
if (ledger) line(`- What the ledger does not know: ${ledger.limit[0]}`);
line(`- Months to ready-to-build: no figure. The developer's ${ARCHETYPES.developer.limits.find(l => l.metric === METRIC.MONTHS_TO_RTB).max}-month limit is unchecked.`);
line();

line('## Triggers a verdict could name');
line();
const view = JSON.parse(await readFile(path.join(ROOT, 'view', 'markets', `${id}.json`), 'utf8').catch(() => '{"triggers":[]}'));
for (const t of view.triggers) line(`- \`${t.id}\` — ${t.label[0]} (${t.expected ?? 'undated'}; watches ${t.watches.join(', ')})`);
if (!view.triggers.length) line('- None in the store yet. A wait needs one, so it would be written first.');
line();
line('Each verdict also needs, from you: `because` (up to three dimensions, a sentence each), `despite` (the strongest argument against the call), a review date, and for a wait the trigger it waits on. I will draft the wording from your answer for you to correct; I will not choose the arguments.');
line();

const target = path.join(ROOT, 'docs', 'grading', `${id}.md`);
await writeFile(target, out.join('\n'), 'utf8');
console.log(`  ${path.relative(ROOT, target)}  (${Object.keys(records).length} drafted, ${open.length} open)`);
