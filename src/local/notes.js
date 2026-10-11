/* ---------------------------------------------------------------------------
   The private overlay — the analyst's own reasons and figures, beside the
   public view.

   The published page shows what public sources support and, where the analyst
   holds a different view, that he does. It never shows WHY: the reason is deal
   experience, often with a number from a transaction in it. That lives here,
   in local-data/view-notes.json, which is git-ignored and reaches the
   development server only.

   What the overlay holds, per market:

       grades    a private reason behind a public grade — typically one whose
                 basis is practitioner judgement
       held      the private reason behind a HELD view (see investability.js).
                 Required: a held grade with no reason here cannot be written.
       verdicts  a private note on a verdict
       metrics   deal-derived figures an investor's limit can be checked
                 against, keyed as archetypes.js keys them

   The same contract as every other local dataset: ABSENCE IS THE NORMAL CASE.
   In a build there is no file, every lookup returns null, and the page is
   complete without it.

   A NOTE CAN NEVER CHANGE A GRADE OR A SCORE. Reasons are words. `metrics` are
   numbers, and they are used for one thing only: on the analyst's own screen, a
   limit that the public page reports as "not yet checked" is checked against
   his figure and marked confidential. The figure is never written to view/,
   never enters a build, and no public result depends on it.

   The file's shape:

       { "<marketId>": {
           "grades":   { "<dimension>": { "reason": ["…", "…"] } },
           "held":     { "<dimension>": { "reason": ["…", "…"] } },
           "verdicts": { "<archetype>": { "note":   ["…", "…"] } },
           "metrics":  { "preFidCapitalUSD": 0, "securityBeforeConsentUSD": 0,
                         "monthsToReadyToBuild": 0 } } }
   --------------------------------------------------------------------------- */
import { loadLocal } from './loader.js';
import { DIMENSION_IDS, ARCHETYPE_IDS } from '../governance/investability.js';
import { METRIC } from '../governance/archetypes.js';

export const NOTES_KEY = 'view-notes';

const SECTIONS = ['grades', 'held', 'verdicts', 'metrics'];

/* Project cost is deliberately not overridable: it comes from the comparison
   engine and is public. A private figure for it would be a second reference
   project, which is a different market view and not a note. */
export const PRIVATE_METRICS = [METRIC.PRE_FID_CAPITAL_USD, METRIC.SECURITY_BEFORE_CONSENT_USD, METRIC.MONTHS_TO_RTB];

const isPair = (v) => Array.isArray(v) && v.length === 2
  && v.every(s => typeof s === 'string' && s.trim().length > 0);

/** Problems with a notes file. Empty array means valid. A malformed local file should fail loudly. */
export function validateNotes(notes){
  if (!notes || typeof notes !== 'object' || Array.isArray(notes)) return ['notes must be an object keyed by market'];
  const problems = [];
  for (const [marketId, entry] of Object.entries(notes)){
    const at = (m) => problems.push(`${marketId}: ${m}`);
    for (const key of Object.keys(entry || {})) if (!SECTIONS.includes(key)) at(`"${key}" is not a section of the notes`);
    for (const section of ['grades', 'held']){
      for (const [id, note] of Object.entries(entry?.[section] || {})){
        if (!DIMENSION_IDS.includes(id)) at(`${section} holds an unknown dimension "${id}"`);
        if (!isPair(note?.reason)) at(`${section}.${id}.reason must be an [en, zh] pair`);
      }
    }
    for (const [id, note] of Object.entries(entry?.verdicts || {})){
      if (!ARCHETYPE_IDS.includes(id)) at(`verdicts holds an unknown archetype "${id}"`);
      if (!isPair(note?.note)) at(`verdicts.${id}.note must be an [en, zh] pair`);
    }
    for (const [key, value] of Object.entries(entry?.metrics || {})){
      if (!PRIVATE_METRICS.includes(key)) at(`metrics holds "${key}", which is not a figure a limit is checked against`);
      else if (!(typeof value === 'number' && Number.isFinite(value) && value >= 0)) at(`metrics.${key} must be a non-negative number`);
    }
  }
  return problems;
}

/* Read once and checked once. `source` lets a caller hand in a file's contents:
   a test, or the view writer, which reads the file from disk because it runs
   under plain Node where the loader has nothing to return. */
function notes(source){
  const loaded = source === undefined ? loadLocal(NOTES_KEY) : source;
  if (!loaded) return null;
  const problems = validateNotes(loaded);
  if (problems.length) throw new Error(`local-data/${NOTES_KEY}.json is malformed:\n  ${problems.join('\n  ')}`);
  return loaded;
}

/** True when the overlay is present at all. Always false in a build. */
export const hasNotes = (source) => notes(source) !== null;

/** The private reason behind a public grade, or null. Always null in a build. */
export function gradeNote(marketId, dimensionId, source){
  return notes(source)?.[marketId]?.grades?.[dimensionId]?.reason ?? null;
}

/** The private reason behind a held view, or null. Always null in a build. */
export function heldNote(marketId, dimensionId, source){
  return notes(source)?.[marketId]?.held?.[dimensionId]?.reason ?? null;
}

/** The private note on a verdict, or null. Always null in a build. */
export function verdictNote(marketId, archetypeId, source){
  return notes(source)?.[marketId]?.verdicts?.[archetypeId]?.note ?? null;
}

/**
 * Deal-derived figures for a market's limit checks, or an empty object. Always
 * empty in a build, so a limit the public data cannot check stays unchecked
 * there whatever the analyst's own screen shows.
 */
export function privateMetrics(marketId, source){
  return { ...(notes(source)?.[marketId]?.metrics ?? {}) };
}

/**
 * Held views in a set of market views that have no private reason. Used by the
 * local check and by the dev page; meaningless without the overlay, so it
 * returns an empty list when there is none rather than reporting everything.
 */
export function heldWithoutReason(views, source){
  if (!hasNotes(source)) return [];
  const missing = [];
  for (const view of views){
    for (const [id, record] of Object.entries(view.grades || {})){
      if (record.held && !heldNote(view.marketId, id, source)) missing.push({ marketId: view.marketId, dimension: id });
    }
  }
  return missing;
}
