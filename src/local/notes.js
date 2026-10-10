/* ---------------------------------------------------------------------------
   The private overlay — the analyst's own reasons, beside the public view.

   A grade that rests on deal experience is published as a grade, with its basis
   shown as practitioner judgement. The REASON is not published: it is the
   experience itself, and often a number from a transaction. It lives here, in
   local-data/view-notes.json, which is git-ignored and reaches the development
   server only.

   This is how "public verdicts, private notes" works at the level of one cell.
   The published page shows the grade and says it is practitioner judgement. The
   analyst's own screen shows the same grade with the reason under it, marked
   confidential.

   The same contract as every other local dataset: ABSENCE IS THE NORMAL CASE.
   In a build there is no file, every lookup returns null, and the page is
   complete without it. Nothing here is an input to a score — a note explains a
   grade and can never change one.

   The file's shape:

       { "<marketId>": {
           "grades":   { "<dimension>": { "reason": ["…", "…"] } },
           "verdicts": { "<archetype>": { "note":   ["…", "…"] } } } }
   --------------------------------------------------------------------------- */
import { loadLocal } from './loader.js';
import { DIMENSION_IDS, ARCHETYPE_IDS } from '../governance/investability.js';

export const NOTES_KEY = 'view-notes';

const isPair = (v) => Array.isArray(v) && v.length === 2
  && v.every(s => typeof s === 'string' && s.trim().length > 0);

/** Problems with a notes file. Empty array means valid. A malformed local file should fail loudly. */
export function validateNotes(notes){
  if (!notes || typeof notes !== 'object' || Array.isArray(notes)) return ['notes must be an object keyed by market'];
  const problems = [];
  for (const [marketId, entry] of Object.entries(notes)){
    const at = (m) => problems.push(`${marketId}: ${m}`);
    for (const key of Object.keys(entry || {})) if (!['grades', 'verdicts'].includes(key)) at(`"${key}" is not a section of the notes`);
    for (const [id, note] of Object.entries(entry?.grades || {})){
      if (!DIMENSION_IDS.includes(id)) at(`grades holds an unknown dimension "${id}"`);
      if (!isPair(note?.reason)) at(`grades.${id}.reason must be an [en, zh] pair`);
    }
    for (const [id, note] of Object.entries(entry?.verdicts || {})){
      if (!ARCHETYPE_IDS.includes(id)) at(`verdicts holds an unknown archetype "${id}"`);
      if (!isPair(note?.note)) at(`verdicts.${id}.note must be an [en, zh] pair`);
    }
  }
  return problems;
}

/* Read once and checked once. `source` lets a test hand in a file's contents. */
function notes(source){
  const loaded = source === undefined ? loadLocal(NOTES_KEY) : source;
  if (!loaded) return null;
  const problems = validateNotes(loaded);
  if (problems.length) throw new Error(`local-data/${NOTES_KEY}.json is malformed:\n  ${problems.join('\n  ')}`);
  return loaded;
}

/** The private reason behind a grade, or null. Always null in a build. */
export function gradeNote(marketId, dimensionId, source){
  return notes(source)?.[marketId]?.grades?.[dimensionId]?.reason ?? null;
}

/** The private note on a verdict, or null. Always null in a build. */
export function verdictNote(marketId, archetypeId, source){
  return notes(source)?.[marketId]?.verdicts?.[archetypeId]?.note ?? null;
}
