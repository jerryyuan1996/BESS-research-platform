/* ---------------------------------------------------------------------------
   THE BRIEFING CONTENT, AS A SHEET AND AS CHANGES.

   scripts/view/content/briefing-2026-10.mjs holds the first theses, plays and
   ruled fund calls of the guided-experience plan. This lays them out for the
   analyst to read, checks them against the store without writing, and — only
   when he says so — applies them through his own door to the writer, in one
   batch that is written whole or not at all.

     node scripts/view/draft-briefing-content.mjs --sheet           print the sheet (Markdown)
     node scripts/view/draft-briefing-content.mjs --check           validate every change, write nothing
     node scripts/view/draft-briefing-content.mjs --changes <file>  write the change array, for writer.mjs apply
     node scripts/view/draft-briefing-content.mjs --apply           apply the whole batch to the store

   The sheet's figures are worked out here, from the engine, on the day it is
   run. The content's sentences quote the figures of 2026-10-16; a difference
   between the two is the thing to look at before signing.
   --------------------------------------------------------------------------- */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createViewStore } from './writer.mjs';
import { byId } from '../../src/markets/registry.js';
import { runCase } from '../../src/comparison/engine.js';
import { marketAt, sweepDesign } from '../../src/comparison/designFit.js';
import { setObservedFxSummary } from '../../src/comparison/fx.js';
import { VERDICT_LABEL, ROUTE_LABEL } from '../../src/governance/investability.js';
import {
  AS_OF, THESES, PLAYS, RULED_FUND_CALLS, POINTED_FUND_CALLS, NEW_TRIGGERS, REASONS,
} from './content/briefing-2026-10.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const analyst = { kind: 'analyst' };

/** The markets in the order the sheet reads them: the registry's. */
const ORDER = ['wa', 'nem', 'gb', 'de', 'it', 'ie', 'ro', 'pl', 'jp_tokyo', 'jp_kyushu', 'jp_hokkaido', 'pjm', 'ercot', 'caiso', 'fi'];

/** Every change, in the order the store can take them: triggers, plays, calls, theses. */
export async function briefingChanges(store){
  const changes = [];
  for (const [market, triggers] of Object.entries(NEW_TRIGGERS)){
    for (const t of triggers) changes.push({ market, path: `triggers.${t.id}`, to: t, reason: REASONS.trigger[t.id], author: analyst });
  }
  for (const market of ORDER){
    for (const p of PLAYS[market] || []) changes.push({ market, path: `plays.${p.id}`, to: p, reason: REASONS.play, author: analyst });
  }
  for (const [market, call] of Object.entries(RULED_FUND_CALLS)){
    changes.push({ market, path: 'verdicts.infraFund', to: call, reason: REASONS.verdict[market], author: analyst });
  }
  for (const [market, playId] of Object.entries(POINTED_FUND_CALLS)){
    const current = (await store.read(market)).verdicts.infraFund;
    changes.push({ market, path: 'verdicts.infraFund', to: { ...current, play: playId }, reason: REASONS.pointer, author: analyst });
  }
  for (const market of ORDER){
    if (THESES[market]) changes.push({ market, path: 'thesis', to: THESES[market], reason: REASONS.thesis, author: analyst });
  }
  return changes;
}

/* ---- the sheet ------------------------------------------------------------------- */

const pct = (x) => (x == null || !Number.isFinite(x)) ? '—' : `${(100 * x).toFixed(1)}%`;
const usdk = (x) => (x == null || !Number.isFinite(x)) ? '—' : `${x >= 0 ? '+' : '−'}$${Math.round(Math.abs(x) / 1000)}k`;

/** What the engine says of a play today: value per MW, hold and exit IRR, secured share. */
export function playFigures(marketId, p){
  const market = byId(marketId);
  if (market.comparison.engineReady === false) return { note: 'not priced: the engine withholds this market' };
  const sweep = sweepDesign(market);
  const point = (sweep.points || []).find(x => x.route === p.route && x.hours === p.hours);
  const variant = marketAt(market, p.route, p.hours);
  const r = variant.na ? null : runCase(variant, p.route, 5);
  return {
    value: point?.priced ? point.value : null,
    eligible: point ? point.eligible !== false : null,
    reason: point && point.eligible === false ? point.reason?.[0] : null,
    hold: r?.irrHold, exit: r?.irrExit, secured: r?.securedShare, years: r?.securedYears,
  };
}

const pair = (p) => `${p[0]}<br>${p[1]}`;
const call = (v) => VERDICT_LABEL[v.call]?.[0] || v.call;
const nameOf = (id) => { const n = byId(id).manifest.name; return Array.isArray(n) ? n[0] : (n || id); };

export async function renderSheet(store){
  const lines = [
    '# Briefing content, October 2026 — for sign-off', '',
    `Drafted ${AS_OF} for PR 2 of the guided-experience plan ([\`docs/guided-experience-plan.md\`](guided-experience-plan.md)).`,
    'Nothing here is in the view store yet. Read it, mark what to change, and say "apply" when it is right.', '',
    'Each market has a **thesis** (the brief\'s lead), its **plays** (route · hours · stage, why, the next action) and, for the',
    'fund lens, the **call** with the play it names. Engine figures are worked out when this sheet is generated: unlevered,',
    'exit year 5, value per MW at the platform\'s yields (7.5% secured, 11.5% merchant).', '',
    'Generate again: `node scripts/view/draft-briefing-content.mjs --sheet > docs/briefing-content-2026-10.md`', '',
    '## The rulings of 2026-10-16', '',
    '| Market | Fund call before | After | Play |', '|---|---|---|---|',
  ];
  for (const [market, v] of Object.entries(RULED_FUND_CALLS)){
    const before = (await store.read(market)).verdicts.infraFund;
    const label = (PLAYS[market] || []).find(p => p.id === v.play)?.label[0] || v.play;
    lines.push(`| ${nameOf(market)} | ${call(before)} · ${ROUTE_LABEL[before.route][0]} | **${call(v)}** · ${ROUTE_LABEL[v.route][0]} | ${label} |`);
  }
  lines.push('| Italy, second play | — | **Opportunistic** (its own call) | MACSE · 6–7h · awarded, ready-to-build |', '');

  for (const market of ORDER){
    const view = await store.read(market);
    lines.push(`## ${nameOf(market)}`, '', `**Thesis.** ${THESES[market][0]}`, '', `> ${THESES[market][1]}`, '');
    lines.push('| Play | Value/MW | Hold | Exit | Secured | Why | Next action |', '|---|---|---|---|---|---|---|');
    for (const p of PLAYS[market] || []){
      const f = playFigures(market, p);
      const value = f.note ? f.note : f.eligible === false ? `not compliant: ${f.reason}` : usdk(f.value);
      const secured = f.secured == null ? '—' : `${pct(f.secured)}${f.years ? ` / ${f.years}y` : ''}`;
      const due = p.action.due ? ` (by ${p.action.due})` : '';
      lines.push(`| ${pair(p.label)} | ${value} | ${pct(f.hold)} | ${pct(f.exit)} | ${secured} | ${pair(p.why)} | ${p.action.text[0]}${due}<br>${p.action.text[1]} |`);
    }
    lines.push('');
    const ruledCall = RULED_FUND_CALLS[market];
    if (ruledCall){
      lines.push(`**Fund call, ruled:** ${call(view.verdicts.infraFund)} → **${call(ruledCall)}**, ${ROUTE_LABEL[ruledCall.route][0].toLowerCase()}${ruledCall.where ? `: ${ruledCall.where[0]}` : ''}.`, '');
      for (const b of ruledCall.because) lines.push(`- Because (${b.dimension}): ${b.text[0]} / ${b.text[1]}`);
      lines.push(`- Despite: ${ruledCall.despite[0]} / ${ruledCall.despite[1]}`);
      lines.push(`- Changes if: ${ruledCall.changesIf.join(', ')} · review by ${ruledCall.reviewBy}`, '');
    } else if (POINTED_FUND_CALLS[market]){
      lines.push(`**Fund call:** ${call(view.verdicts.infraFund)}, unchanged; it now names \`${POINTED_FUND_CALLS[market]}\`.`, '');
    }
    for (const p of PLAYS[market] || []){
      for (const [archetype, own] of Object.entries(p.calls || {})){
        lines.push(`**Own call on ${p.label[0]}** (${archetype}): **${call(own)}**.`, '');
        for (const b of own.because) lines.push(`- Because (${b.dimension}): ${b.text[0]} / ${b.text[1]}`);
        lines.push(`- Despite: ${own.despite[0]} / ${own.despite[1]}`);
        lines.push(`- Changes if: ${own.changesIf.join(', ')} · review by ${own.reviewBy}`, '');
      }
    }
    for (const t of NEW_TRIGGERS[market] || []){
      lines.push(`**New trigger** \`${t.id}\`: ${t.label[0]} / ${t.label[1]} (${t.expected ?? 'undated'}, ${t.direction}, source \`${typeof t.source === 'string' ? t.source : t.source.publisher}\`).`, '');
    }
  }

  const changes = await briefingChanges(store);
  const count = (kind) => changes.filter(c => c.path.startsWith(kind)).length;
  lines.push('## What applying writes', '',
    `${changes.length} changes through the writer, each with its own changelog line: ${count('triggers.')} triggers, ${count('plays.')} plays,`,
    `${count('verdicts.')} fund verdicts (${Object.keys(RULED_FUND_CALLS).length} ruled, ${Object.keys(POINTED_FUND_CALLS).length} naming their play) and ${count('thesis')} theses.`,
    'No engine input, weight or anchor moves, so no published return changes.', '',
    '## Research gates opened with the rulings', '',
    '- **G40 and G41: NEM and CAISO seeds.** Re-source both markets\' revenue and capex seeds; re-rule the fund calls if they move (`docs/external-view.md`).',
    '- **Japan\'s floor-holding build.** The 8.8h design is priced in its own methodology PR (plan, PR 8).', '');
  return lines.join('\n');
}

/* ---- the command line ---------------------------------------------------------------- */

async function withObservedFx(){
  /* The same rule as the page: the committed ECB snapshot when it is current, else the seed. */
  try {
    const summary = JSON.parse(await readFile(path.join(ROOT, 'public', 'data', 'public', 'fx-ecb.summary.json'), 'utf8'));
    setObservedFxSummary(summary);
  } catch { /* the seed stands */ }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)){
  const [command, argument] = process.argv.slice(2);
  const store = createViewStore();
  await withObservedFx();
  if (command === '--sheet'){
    process.stdout.write(await renderSheet(store));
  } else if (command === '--check'){
    const changes = await briefingChanges(store);
    const prepared = await store.prepareBatch(changes, new Date());
    console.log(`All ${prepared.length} changes pass the writer's gate. Nothing was written.`);
  } else if (command === '--changes' && argument){
    await writeFile(argument, JSON.stringify(await briefingChanges(store), null, 2) + '\n', 'utf8');
    console.log(`Wrote the change array to ${argument}. Apply it with: node scripts/view/writer.mjs apply ${argument}`);
  } else if (command === '--apply'){
    const entries = await store.applyBatch(await briefingChanges(store), new Date());
    console.log(`Applied ${entries.length} changes. See view/changelog.jsonl.`);
  } else {
    console.error('usage: node scripts/view/draft-briefing-content.mjs --sheet | --check | --changes <file> | --apply');
    process.exitCode = 1;
  }
}
