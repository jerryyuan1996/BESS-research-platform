/* ---------------------------------------------------------------------------
   AUTOMATION — how far one machine run may move the view.

   Rules and an agent may write the view store. These are the limits on a
   single run: how many changes, how big a step, how much evidence. They do not
   add an approval step; they bound what a bad run can do before a person
   notices it.

   THIS FILE IS METHODOLOGY. It sits in src/, which no machine author can
   write, and it is named in METHODOLOGY_SURFACES in authority.js. A machine
   that could raise its own cap would have no cap.

   Each constant is one of the guardrails of the revision plan §7.6, by letter.

   Layering: imports the verdict vocabulary and nothing else. No DOM, no market
   module, no ETL code.
   --------------------------------------------------------------------------- */

import { VERDICT } from './investability.js';

/**
 * E — a run that would make more changes than this, across all markets,
 * writes none of them. A bad source rewriting ten markets is stopped whole.
 */
export const MAX_MACHINE_CHANGES_PER_RUN = 3;

/**
 * C — the most an agent may move a grade in one run. A rule moves what the
 * analyst wrote in its effect, which is the "unless a rule you wrote says
 * otherwise".
 */
export const AGENT_MAX_GRADE_STEP = 1;

/**
 * C — the verdict words as a scale, least open first. An agent moves a call
 * one place along it.
 *
 * NOT_ACCESSIBLE is not on the scale. It says a knock-out applies, which is a
 * reading of a limit and not a step from "avoid"; no machine author writes it
 * or moves a call away from it.
 */
export const VERDICT_SCALE = [
  VERDICT.AVOID, VERDICT.WAIT, VERDICT.OPPORTUNISTIC, VERDICT.BUILD_POSITION, VERDICT.ENTER_NOW,
];

/**
 * F — a price-derived figure is tested only when it covers at least this many
 * complete trading days. Spreads are seasonal in every market here, and a rule
 * that fired on a winter is a rule that fired on the calendar.
 */
export const MIN_WINDOW_DAYS = 300;

/** A — the longest quotation an evidence record may carry. */
export const MAX_QUOTE_CHARS = 300;

/**
 * G — what a source is. A verdict moves on one OFFICIAL source or on two
 * independent ones. A dataset's class is the hand-set `official` flag in
 * datasets.js; a fetched page's class comes from the market's source register.
 */
export const EVIDENCE_CLASS = { OFFICIAL: 'official', THIRD_PARTY: 'third-party' };

/** H — the digest covers machine changes over this many days: the longest month,
    so a monthly digest leaves no day uncovered. */
export const DIGEST_DAYS = 31;

/** The agent's monthly pass looks at markets with a trigger due inside this many days, or overdue. */
export const AGENT_TRIGGER_HORIZON_DAYS = 30;
