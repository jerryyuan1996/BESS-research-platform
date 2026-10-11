#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   WHERE THE SCOUTING TIER STANDS.

   Two questions, answered from the store and nothing else:

     · how many consecutive clean passes has the agent completed, against the
       number the exit condition asks for
     · which cards exist, when each was last covered by a pass, and whether
       the analyst has spot-checked it since the agent last wrote to it

   Reaching the streak changes nothing by itself. Pointing the agent at core
   markets is a later decision with its own plan.

   Read-only. Usage:  node scripts/view/scout-status.mjs
   --------------------------------------------------------------------------- */
import { pathToFileURL } from 'node:url';

import { createViewStore } from './writer.mjs';
import { cleanStreak, cardIsEmpty, graduationProgress, SCOUT_LIVE_AUTHORS } from '../../view/schema/scout.mjs';
import { SCOUT_ROSTER, SCOUT_EXIT_STREAK, SCOUT_DIMENSION_IDS } from '../../src/governance/scout.js';

/**
 * Has the analyst checked this card since a machine last wrote to it?
 * 'never' | 'stale' (written since) | the date of the check.
 */
export function checkState(card, changelog){
  if (!card.checked) return 'never';
  const mine = changelog.filter(e => e.market === card.id);
  const lastMachine = mine.filter(e => e.author.kind !== 'analyst').map(e => e.at).pop() ?? '';
  const checkedAt = mine.filter(e => e.path === 'checked' && e.to).map(e => e.at).pop() ?? '';
  return lastMachine > checkedAt ? 'stale' : card.checked.asOf;
}

/** The status as data: the streak and one row a roster market. */
export async function scoutStatus(store){
  const [passes, changelog] = [await store.passes(), await store.changelog()];
  const rows = [];
  for (const market of SCOUT_ROSTER){
    const card = await store.readCard(market.id);
    const covered = passes.filter(p => p.cards.includes(market.id)).map(p => p.run).sort();
    rows.push({
      id: market.id, name: market.name[0], written: !cardIsEmpty(card),
      graded: Object.keys(card.grades).length, verdicts: Object.keys(card.verdicts).length,
      lastPass: covered.pop() ?? null, check: checkState(card, changelog),
      graduation: graduationProgress(card, passes, changelog),
    });
  }
  return {
    live: SCOUT_LIVE_AUTHORS.includes('agent'), streak: cleanStreak(passes), needed: SCOUT_EXIT_STREAK,
    passes: passes.length, lastPass: passes.map(p => p.run).sort().pop() ?? null, rows,
  };
}

export function renderScoutStatus(status){
  const lines = [
    `Agent on scout cards: ${status.live ? 'live' : 'dry — it reports and writes nothing'}`,
    `Consecutive clean passes: ${status.streak} of ${status.needed}  (${status.passes} live ${status.passes === 1 ? 'pass' : 'passes'} recorded${status.lastPass ? `, the last on ${status.lastPass.slice(0, 10)}` : ''})`,
    '',
  ];
  for (const r of status.rows){
    lines.push(r.written
      ? `  ${r.id.padEnd(6)} ${r.name.padEnd(14)} ${String(r.graded).padStart(2)}/${SCOUT_DIMENSION_IDS.length} graded  ${r.verdicts}/4 verdicts  last pass ${r.lastPass?.slice(0, 10) ?? 'none'}  spot-check: ${r.check === 'stale' ? 'written since the last check' : r.check}  graduation ${r.graduation.passes}/${r.graduation.needed}`
      : `  ${r.id.padEnd(6)} ${r.name.padEnd(14)} no card written yet`);
  }
  const unchecked = status.rows.filter(r => r.written && (r.check === 'never' || r.check === 'stale')).length;
  lines.push('', status.streak >= status.needed && !unchecked && status.rows.every(r => r.written)
    ? 'The exit condition is met: the streak is reached and every card is written and spot-checked. Nothing changes until the analyst decides it does.'
    : 'The exit condition is not met.');
  return lines.join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href){
  console.log(renderScoutStatus(await scoutStatus(createViewStore())));
}
