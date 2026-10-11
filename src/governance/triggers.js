/* ---------------------------------------------------------------------------
   TRIGGERS — a dated or measurable event that would move a verdict or a grade.

   The platform already knew about these. Nine of them were written as prose
   inside decisionProfiles.js — a grant call closing, an auction date, a
   long-stop — where nothing could list them, sort them or act on them. A
   knowledge base records that an event is coming. A decision tool has to be
   able to say WHICH call it would change, and when to look again.

   So a trigger is a record, not a sentence:

       what       the event, in one bilingual line
       when       expected, to the month — a day where one is published
       watches    the dimensions it would move
       direction  which way the grade would go, as the scale reads (up = more
                  open to a new entrant, see investability.js)
       source     where the date came from

   Triggers feed three things: the "changes if" line under a verdict, a
   cross-market calendar, and — not yet — a rules engine.

   `effect` IS RESERVED AND MUST BE NULL. The plan (§7.3) lets a trigger carry a
   pre-written change that a rule applies when the event lands. That is
   automation writing judgement, it belongs to a later phase, and until the
   governance rewrite that permits it has happened a trigger with an effect is
   refused here rather than stored and ignored.

   Layering: imports the dimension vocabulary and nothing else. No DOM, no
   market module, no ETL code.
   --------------------------------------------------------------------------- */

import { DIMENSION_IDS } from './investability.js';

/**
 * EVENT: something happens on a date — an act passes, an auction runs. No feed
 * reports it; somebody has to establish that it happened.
 * DATA:  a published series crosses a line. A snapshot can be tested for it.
 */
export const TRIGGER_KIND = { EVENT: 'event', DATA: 'data' };

/** Which way the watched grade would move if the trigger lands as expected. */
export const TRIGGER_DIRECTION = { UP: 'up', DOWN: 'down', EITHER: 'either' };

export const TRIGGER_DIRECTION_LABEL = {
  up:     ['Would open the market further', '将使市场更为开放'],
  down:   ['Would close it further', '将使市场进一步收紧'],
  either: ['Outcome decides the direction', '方向取决于结果'],
};

/**
 * A trigger migrated out of decisionProfiles.js cites that record, whose own
 * `sources` list stands behind the date. It is a weaker citation than a
 * source-register key and is named so it can be found and replaced.
 */
export const SOURCE_DECISION_PROFILE = 'decision-profile';

/** How a source that is not in a market's register was reached. */
export const ACCESS = { OPENED: 'opened', SEARCH_SUMMARY: 'search-summary' };

const isPair = (v) => Array.isArray(v) && v.length === 2
  && v.every(s => typeof s === 'string' && s.trim().length > 0);

/* YYYY-MM or YYYY-MM-DD, and a real one. */
const isWhen = (v) => {
  if (typeof v !== 'string') return false;
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(v);
  if (!m) return false;
  const month = Number(m[2]);
  if (month < 1 || month > 12) return false;
  if (!m[3]) return true;
  const t = Date.parse(`${v}T00:00:00Z`);
  return Number.isFinite(t) && new Date(t).toISOString().slice(0, 10) === v;
};

/**
 * A source is a key in the market's own source register, the decision-profile
 * marker, or — for something no register holds yet — a located page with an
 * honest statement of how it was reached. A search summary is not evidence
 * under the claim pilot's rule; it is recorded so a person knows what to open.
 */
export function sourceProblems(source){
  if (typeof source === 'string') return source.trim() ? [] : ['source is empty'];
  if (!source || typeof source !== 'object') return ['source must be a register key or a located page'];
  const problems = [];
  if (typeof source.publisher !== 'string' || !source.publisher.trim()) problems.push('source.publisher is missing');
  if (typeof source.url !== 'string' || !/^https:\/\//.test(source.url)) problems.push('source.url must be an https link');
  if (!Object.values(ACCESS).includes(source.access)) problems.push(`source.access must be one of ${Object.values(ACCESS).join(', ')}`);
  return problems;
}

/** Problems with one trigger. Empty array means valid. */
export function validateTrigger(trigger){
  if (!trigger || typeof trigger !== 'object') return ['trigger is missing'];
  const problems = [];
  const at = (m) => problems.push(`${trigger.id || '?'}: ${m}`);

  if (typeof trigger.id !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)+$/.test(trigger.id)) at('id must be a kebab-case slug');
  if (typeof trigger.market !== 'string' || !trigger.market) at('market is missing');
  if (!Object.values(TRIGGER_KIND).includes(trigger.kind)) at(`kind must be one of ${Object.values(TRIGGER_KIND).join(', ')}`);
  if (!isPair(trigger.label)) at('label must be an [en, zh] pair saying what the event is');
  /* Null is allowed and means "announced, undated". An event with no date is
     still worth listing; an invented date is not. */
  if (trigger.expected !== null && !isWhen(trigger.expected)) at('expected must be null, YYYY-MM or YYYY-MM-DD');

  if (!Array.isArray(trigger.watches) || !trigger.watches.length) at('watches must name at least one dimension');
  else for (const d of trigger.watches) if (!DIMENSION_IDS.includes(d)) at(`watches an unknown dimension "${d}"`);

  if (!Object.values(TRIGGER_DIRECTION).includes(trigger.direction)) at(`direction must be one of ${Object.values(TRIGGER_DIRECTION).join(', ')}`);
  for (const p of sourceProblems(trigger.source)) at(p);
  if (trigger.effect !== null) at('effect must be null — a trigger that changes a verdict by itself is not permitted yet');
  return problems;
}

/* Month-precision dates sort at the END of their month: "by end of 2026-12"
   should not appear ahead of something dated the 3rd. Undated sorts last. */
const sortKey = (when) => when === null ? '9999-12-31' : (when.length === 7 ? `${when}-31` : when);

/** Triggers in the order they are expected, soonest first, undated last. */
export function byExpected(triggers){
  return [...triggers].sort((a, b) => sortKey(a.expected).localeCompare(sortKey(b.expected)) || a.id.localeCompare(b.id));
}

/** Triggers that would move a given dimension. */
export function triggersWatching(triggers, dimensionId){
  return triggers.filter(t => t.watches.includes(dimensionId));
}

/**
 * Triggers whose expected date has passed as of `today` (YYYY-MM-DD). A
 * month-precision date is overdue only once its month has ended. These are the
 * ones somebody has to go and look at.
 */
export function overdue(triggers, today){
  return byExpected(triggers).filter(t => t.expected !== null && sortKey(t.expected) < today);
}
