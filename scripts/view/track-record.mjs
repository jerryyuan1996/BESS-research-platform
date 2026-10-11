/* ---------------------------------------------------------------------------
   THE TRACK RECORD — how often the public record moved to meet the analyst.

   Every change to a sourced grade that sits under a held view records, on its
   changelog line, which way the gap moved: toward the held grade, onto it,
   away from it, or not at all. This counts those lines by dimension.

   A held view is a claim that the analyst knows something the sources do not
   yet show. If the sources later move to meet it, the claim was early and
   right; if they move away, it was wrong. Over time the tally says on which
   dimensions his judgement has been worth holding against the public reading.

   It reads the changelog and nothing private.

   Run:  npm run view:track-record
   --------------------------------------------------------------------------- */
import { pathToFileURL } from 'node:url';

import { createViewStore } from './writer.mjs';
import { DIMENSIONS } from '../../src/governance/investability.js';

/** Count gap movements by dimension. Pure, so a test can hand it entries. */
export function trackRecord(entries){
  const tally = {};
  for (const entry of entries){
    const gap = entry.gap;
    if (!gap) continue;
    const row = tally[gap.dimension] ||= { toward: 0, met: 0, away: 0, none: 0, opened: 0, revised: 0, withdrawn: 0 };
    row[gap.movement]++;
  }
  return tally;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href){
  const tally = trackRecord(await createViewStore().changelog());
  const rows = DIMENSIONS.filter(d => tally[d.id]);
  if (!rows.length){
    console.log('  No held view has been written yet, so there is no track record.');
  } else {
    console.log('  Sourced grade moved, under a held view:      toward   met   away   none   | held views: opened  revised  withdrawn');
    for (const d of rows){
      const r = tally[d.id];
      console.log(`  ${d.label[0].padEnd(42)} ${String(r.toward).padStart(6)} ${String(r.met).padStart(5)} ${String(r.away).padStart(6)} ${String(r.none).padStart(6)}   | ${String(r.opened).padStart(18)} ${String(r.revised).padStart(8)} ${String(r.withdrawn).padStart(10)}`);
    }
  }
}
