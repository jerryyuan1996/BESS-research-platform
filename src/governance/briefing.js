/* ---------------------------------------------------------------------------
   THE BRIEFING'S RULES — methodology for the guided experience.

   The guided-experience plan (docs/guided-experience-plan.md, approved
   2026-10-16) puts a briefing at the top of the site and in a weekly digest.
   Everything it decides on its own is decided here: which tier a call belongs
   to, when a call and the economics disagree, how strong the evidence behind a
   play is, and the windows and thresholds that make something "a change" or
   "coming". It is methodology (plan decision 3): the analyst's alone, listed in
   METHODOLOGY_SURFACES, and no automation may write or propose it.

   Nothing here reads a market. These are definitions; src/briefing/ applies
   them.

   Layering: no DOM, no import beyond the vocabulary it is defined in.
   --------------------------------------------------------------------------- */

import { VERDICT, BASIS } from './investability.js';

/* ---- tiers: what a call asks the investor to do --------------------------------- */

/** Five tiers, in shortlist order. "Selective" is retired vocabulary and is not one of them. */
export const TIER = {
  PURSUE: 'pursue',
  PREPARE: 'prepare',
  SITUATIONAL: 'situational',
  WATCH: 'watch',
  PARK: 'park',
};

export const TIER_ORDER = [TIER.PURSUE, TIER.PREPARE, TIER.SITUATIONAL, TIER.WATCH, TIER.PARK];

export const TIER_LABEL = {
  [TIER.PURSUE]:      ['Pursue', '推进'],
  [TIER.PREPARE]:     ['Prepare', '布局'],
  [TIER.SITUATIONAL]: ['Situational', '择机'],
  [TIER.WATCH]:       ['Watch', '观望'],
  [TIER.PARK]:        ['Park', '搁置'],
};

/** What each tier asks for, in one line. */
export const TIER_MEANING = {
  [TIER.PURSUE]:      ['Clears the bar today: work on it now', '今天就达到门槛：立即推进'],
  [TIER.PREPARE]:     ['Secure sites, partners or capacity now; commit capital on the named trigger', '现在锁定场址、伙伴或容量；待指定触发条件出现再投入资本'],
  [TIER.SITUATIONAL]: ['Act only on a named asset, contract or seller', '只针对指定的资产、合同或卖方行动'],
  [TIER.WATCH]:       ['Not now: watch the named trigger', '现在不做：关注指定的触发条件'],
  [TIER.PARK]:        ['Closed to this investor, or a structural mismatch', '对这类投资者不开放，或存在结构性不匹配'],
};

/** The tier a call belongs to. A call the vocabulary does not know is parked, not promoted. */
export const CALL_TIER = {
  [VERDICT.ENTER_NOW]: TIER.PURSUE,
  [VERDICT.BUILD_POSITION]: TIER.PREPARE,
  [VERDICT.OPPORTUNISTIC]: TIER.SITUATIONAL,
  [VERDICT.WAIT]: TIER.WATCH,
  [VERDICT.AVOID]: TIER.PARK,
  [VERDICT.NOT_ACCESSIBLE]: TIER.PARK,
};

export const tierOf = (call) => CALL_TIER[call] ?? TIER.PARK;

/** How a sentence names the investor reading: "clears a fund's bar". */
export const LENS_NOUN = {
  infraFund:         ['a fund', '基金'],
  strategic:         ['a strategic investor', '战略投资者'],
  foreignFirstTimer: ['a first-time foreign investor', '首次进入的外国投资者'],
  developer:         ['a developer', '开发商'],
};

/* ---- when the call and the economics disagree ------------------------------------- */

export const DISAGREEMENT = {
  /** Enter now or build position, and no design of this play is both compliant and worth building. */
  AHEAD: 'ahead',
  /** Wait or avoid, while the play is in the top third of the platform's designs by value. */
  BEHIND: 'behind',
};

/** The share of priced designs, from the top by value, that a waiting call counts as "behind". */
export const BEHIND_TOP_SHARE = 1 / 3;

/**
 * The disagreement on one shortlist row, or null.
 *
 * @param call     the row's call
 * @param econ     { priced, eligible, value } for the row's play
 * @param rankShare  the play's position among priced, eligible designs: 0 is the
 *                   most valuable, 1 the least; null when it is not ranked
 */
export function disagreementOf(call, econ, rankShare){
  /* A market the engine withholds has no economics to disagree with. */
  if (econ?.withheld) return null;
  const tier = tierOf(call);
  if (tier === TIER.PURSUE || tier === TIER.PREPARE){
    if (!econ?.priced || econ.eligible === false || !(econ.value >= 0)) return DISAGREEMENT.AHEAD;
  }
  if (tier === TIER.WATCH || (call === VERDICT.AVOID)){
    if (econ?.priced && econ.eligible !== false && econ.value > 0 && rankShare !== null && rankShare < BEHIND_TOP_SHARE){
      return DISAGREEMENT.BEHIND;
    }
  }
  return null;
}

/* ---- evidence strength: one marker per play ----------------------------------------- */

export const EVIDENCE = { STRONG: 'strong', FAIR: 'fair', THIN: 'thin' };

export const EVIDENCE_LABEL = {
  [EVIDENCE.STRONG]: ['Strong evidence', '证据充分'],
  [EVIDENCE.FAIR]:   ['Fair evidence', '证据尚可'],
  [EVIDENCE.THIN]:   ['Thin evidence', '证据单薄'],
};

/** A design input on one of these bases is a placeholder, not an observation. */
export const WEAK_INPUT_BASIS = ['seed', 'fill'];

/* ---- merchant-line coverage (approved 2026-10-23) ----------------------------------

   The marker used to read only a play's design inputs and the bases of its grades,
   never how its revenue line is sourced: Italy's fund play showed Strong while 71% of
   its first-year revenue rested on one forecast the market had paid 63% of
   (docs/merchant-lines-plan-2026-10.md §5). A market that declares
   `comparison.merchantEvidence` — an observed day-ahead value at a stated year — now
   has its merchant line marked by coverage:

       coverage = observed ÷ (merchGross ÷ restateFactor)

   the restate factor carrying the line back from year 1 to the observed year along
   its dated path. A market that declares no observed series is not marked by this
   rule yet; the January refresh moves the observed value, the thresholds are here. */

/** Coverage bands. Strong also needs the line inside the observed range and an own-market path. */
export const COVERAGE_STRONG = [0.90, 1.10];
export const COVERAGE_FAIR = [0.75, 1.25];
/** A play whose merchant revenue is more than this share of year 1 takes the line's marker. */
export const MERCHANT_CAP_SHARE = 0.5;

const within = (x, [lo, hi]) => x >= lo && x <= hi;

/**
 * The merchant line's marker, or null when the market declares no observed series.
 * @param cmp a market's comparison interface
 */
export function merchantCoverage(cmp){
  const ev = cmp?.merchantEvidence, line = cmp?.economics?.merchGross;
  if (!ev || !(ev.observedPerMW > 0) || !(line > 0)) return null;
  const restated = line / (ev.restateFactor || 1);
  const coverage = ev.observedPerMW / restated;
  const inRange = Array.isArray(ev.range) && restated >= ev.range[0] && restated <= ev.range[1];
  const marker = within(coverage, COVERAGE_STRONG) && inRange && ev.pathFit === 'own' ? EVIDENCE.STRONG
    : within(coverage, COVERAGE_FAIR) ? EVIDENCE.FAIR
    : EVIDENCE.THIN;
  return { coverage, marker };
}

const ORDER = [EVIDENCE.THIN, EVIDENCE.FAIR, EVIDENCE.STRONG];
const weaker = (a, b) => (ORDER.indexOf(a) <= ORDER.indexOf(b) ? a : b);

/**
 * How strong the evidence behind a play is. One marker, replacing the
 * "Illustrative — not official" chips, "Evidence confidence N/10" and
 * "Screening only" (plan decision 4).
 *
 *   thin    the engine withholds the market, a design input of the play is a
 *           placeholder, or every reason the call gives rests on practitioner
 *           judgement
 *   strong  the play is priced and compliant, no design input is a
 *           placeholder, and every reason the call gives rests on a source
 *   fair    anything between
 *
 * Then capped by the merchant line: a play whose merchant revenue is more than
 * half of its first year is marked no stronger than that line (econ.merchantLine,
 * from merchantCoverage and the play's own first-year split).
 *
 * @param econ         { priced, eligible, weakInputs: [], merchantLine?: { marker, share } }
 * @param becauseBases the bases of the grades the call's reasons name
 */
export function evidenceOf(econ, becauseBases){
  const bases = becauseBases.filter(Boolean);
  let marker;
  if (!econ?.priced || (econ.weakInputs || []).length) marker = EVIDENCE.THIN;
  else if (bases.length && bases.every(b => b === BASIS.PRACTITIONER)) marker = EVIDENCE.THIN;
  else if (econ.eligible !== false && bases.length && bases.every(b => b !== BASIS.PRACTITIONER)) marker = EVIDENCE.STRONG;
  else marker = EVIDENCE.FAIR;
  const line = econ?.merchantLine;
  if (line?.marker && line.share > MERCHANT_CAP_SHARE) marker = weaker(marker, line.marker);
  return marker;
}

/* ---- windows and thresholds ------------------------------------------------------- */

/** Changelog lines before this day are the view being written for the first time, not changes to it. */
export const SETUP_UNTIL = '2026-10-13';

/** How far back the briefing carries changes, so "since your last visit" can reach that far. */
export const CHANGE_WINDOW_DAYS = 45;

/** How many changes the briefing shows; the rest are on /changes. */
export const MAX_CHANGES = 6;

/** "What's coming": dated catalysts inside this many days. */
export const CATALYST_WINDOW_DAYS = 90;

/** How many investor actions the briefing shows. */
export const MAX_ACTIONS = 5;

/** A trigger this close is in the analyst's queue, to be ready to record its outcome. */
export const DUE_SOON_DAYS = 14;

/** A review date this close is in the analyst's queue. */
export const REVIEW_SOON_DAYS = 30;

/** A price series counts as having moved when its last week departs this far from its 90-day mean. */
export const DATA_MOVE_SHARE = 0.2;
export const DATA_SHORT_DAYS = 7;
export const DATA_LONG_DAYS = 90;

/** A rule is "near" when its tested figure is within this share of its line. */
export const RULE_NEAR_SHARE = 0.1;

/** "Since your last visit" falls back to this many days on a first visit. */
export const FIRST_VISIT_DAYS = 7;

/** A visit is a new one after this long away, so a reload does not reset "since". */
export const VISIT_GAP_MINUTES = 30;

/* ---- what a change is -------------------------------------------------------------- */

/**
 * Classes of change, in the order the briefing gives them room.
 *
 *   call       a verdict's call, way in or play moved; a play's own call moved;
 *              a play added, dropped or redesigned
 *   catalyst   a trigger added, re-dated, passed, or its outcome recorded
 *   data       a published price series moved past DATA_MOVE_SHARE
 *   news       a headline tagged to a market
 *   view       a thesis or a play's line rewritten
 *
 * A grade's number, basis or reason is evidence and stays on /changes: it is
 * how the call is argued, not the call.
 */
export const CHANGE_CLASS = { CALL: 'call', CATALYST: 'catalyst', DATA: 'data', NEWS: 'news', VIEW: 'view' };
export const CHANGE_CLASS_ORDER = [CHANGE_CLASS.CALL, CHANGE_CLASS.CATALYST, CHANGE_CLASS.DATA, CHANGE_CLASS.NEWS, CHANGE_CLASS.VIEW];

/** English words a computed sentence must not use: the briefing states, it does not hedge. */
export const HEDGE_WORDS = ['may', 'might', 'could', 'perhaps', 'possibly', 'potentially', 'illustrative', 'arguably', 'somewhat'];
