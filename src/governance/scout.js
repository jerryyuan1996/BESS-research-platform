/* ---------------------------------------------------------------------------
   THE SCOUTING TIER — which markets get a card, and the limits a card lives
   under.

   A scout market has no dashboard and no comparison file. It gets a card: a
   handful of sourced facts, a grade on each dimension a public page can speak
   to, a verdict for each investor, and nothing about what the asset earns.
   The tier exists so the platform can screen about thirty markets instead of
   going deep on fifteen (revision plan §6.4).

   THIS FILE IS METHODOLOGY. The agent may write a card. It may not decide
   which markets have one, what a card may hold, how far one run may go, or
   when the tier has earned anything. All of that is here, in src/, which no
   machine author can write, and the file is named in METHODOLOGY_SURFACES.

   The pages the agent may read for each market are in src/scout/sources.js,
   behind the same wall.

   Layering: imports the dimension and verdict vocabulary and nothing else. No
   DOM, no market module, no ETL code.
   --------------------------------------------------------------------------- */

import { DIMENSIONS, VERDICT } from './investability.js';

/** The three regions the analyst chose to scout. Not the registry's regions. */
export const SCOUT_REGIONS = {
  'nordics-baltics':         { id: 'nordics-baltics',         label: ['Nordics and Baltics', '北欧与波罗的海'] },
  'southern-eastern-europe': { id: 'southern-eastern-europe', label: ['Southern and Eastern Europe', '南欧与东欧'] },
  'americas-middle-east':    { id: 'americas-middle-east',    label: ['Americas and Middle East', '美洲与中东'] },
};

export const SCOUT_REGION_IDS = Object.keys(SCOUT_REGIONS);

/**
 * The roster: every market that may have a card. Three a region, the first
 * batch of plan §6.4. An id that is not here has no file name the view writer
 * will accept, so adding a market is an edit to this list and to nothing else.
 *
 * No id here is a registered market: tests/scout.test.js asserts it. The tier
 * of a change is decided by which of the two sets its id is in.
 */
export const SCOUT_ROSTER = [
  { id: 'se',    name: ['Sweden', '瑞典'],            region: 'nordics-baltics',         flag: 'se' },
  { id: 'ee',    name: ['Estonia', '爱沙尼亚'],       region: 'nordics-baltics',         flag: 'ee' },
  { id: 'lt',    name: ['Lithuania', '立陶宛'],       region: 'nordics-baltics',         flag: 'lt' },
  { id: 'es',    name: ['Spain', '西班牙'],           region: 'southern-eastern-europe', flag: 'es' },
  { id: 'nl',    name: ['Netherlands', '荷兰'],       region: 'southern-eastern-europe', flag: 'nl' },
  { id: 'bg',    name: ['Bulgaria', '保加利亚'],      region: 'southern-eastern-europe', flag: 'bg' },
  { id: 'cl',    name: ['Chile', '智利'],             region: 'americas-middle-east',    flag: 'cl' },
  { id: 'ca_on', name: ['Ontario', '安大略省'],       region: 'americas-middle-east',    flag: 'ca' },
  { id: 'sa',    name: ['Saudi Arabia', '沙特阿拉伯'], region: 'americas-middle-east',    flag: 'sa' },
];

export const SCOUT_IDS = SCOUT_ROSTER.map(m => m.id);

const BY_ID = new Map(SCOUT_ROSTER.map(m => [m.id, m]));

export const scoutMarket = (id) => BY_ID.get(id) || null;

/** True when an id names a scout market. This is what decides a change's tier. */
export const isScoutId = (id) => typeof id === 'string' && BY_ID.has(id);

export const scoutIdsIn = (region) => SCOUT_ROSTER.filter(m => m.region === region).map(m => m.id);

/**
 * The dimensions a card may be graded on: every one outside the Return pillar.
 *
 * NO RETURN IS MODELLED. Asset return is the quintile of the engine's IRR and
 * revenue certainty is read from the engine's reference project. A scout
 * market has neither, so neither can be graded, and a card that printed an IRR
 * would be publishing the number the plan calls the least informative. The
 * Return pillar on a card is a third-party signal or nothing.
 */
export const SCOUT_DIMENSION_IDS = DIMENSIONS.filter(d => d.pillar !== 'return').map(d => d.id);

/** The pillars a card can score. Never blended: a card has no single number. */
export const SCOUT_PILLARS = ['entry', 'durability', 'capital'];

/** A card holds at most this many facts. */
export const MAX_SCOUT_FACTS = 10;

/** What a return signal may be. One kind today: a third party's published index. */
export const RETURN_SIGNAL_KINDS = ['third-party-index'];

export const RETURN_SIGNAL_LABEL = {
  'third-party-index': ['A third party\'s published index', '第三方公布的指数'],
};

/**
 * Text that names a modelled return. No text on a card may match: not a fact,
 * a reason, a verdict's wording, a trigger's label, the signal or a quotation.
 */
export const RETURN_WORDS = /\bIRR\b|\bMOIC\b|\bpayback\b|internal rate of return|内部收益率|回收期|回报率|收益率\s*[约为达]?\s*\d|\b\d+(?:\.\d+)?\s*%\s*(?:equity\s+|project\s+|annual\s+|unlevered\s+|levered\s+)?(?:returns?|yields?)\b|\b(?:returns?|yields?)\s+of\s+(?:about\s+|around\s+)?\d+(?:\.\d+)?\s*%/i;

/**
 * A revenue rate: money per megawatt or kilowatt per year. A third party's
 * index is quoted in these terms, so it is allowed in the return signal and
 * nowhere else on a card.
 */
export const REVENUE_RATE = /\/\s*(?:MW|kW)\s*(?:\/|\s+per\s+|[-·])\s*(?:yr|year|a)\b|per\s+(?:MW|kW)\s+(?:per|a)\s+year|每(?:兆瓦|千瓦)·?每?年/i;

/**
 * C, for a verdict the agent CREATES. There is no previous call to step from
 * and no score to check it, so a first call sits within one place of "wait",
 * the neutral word. The two stronger calls are reached one place a run.
 */
export const SCOUT_FIRST_CALLS = [VERDICT.AVOID, VERDICT.WAIT, VERDICT.OPPORTUNISTIC];

/**
 * Where a grade on the card is one the investor cannot accept, the most a
 * machine may call is "wait". It never writes "not accessible": the card
 * shows the barrier from the grade.
 */
export const SCOUT_KNOCKED_OUT_CALLS = [VERDICT.AVOID, VERDICT.WAIT];

/**
 * C, for a grade the agent CREATES. Any of 1 to 5, because the anchor decides
 * and a forced middle grade would be a false one. But a 1 or a 5 trips a
 * knock-out or headlines a card, so it needs the evidence a verdict needs:
 * one official source or two independent ones.
 */
export const SCOUT_EXTREME_GRADES = [1, 5];

/**
 * E, for a scout run. It touches at most this many cards. Replacing a record
 * that exists is still bounded by MAX_MACHINE_CHANGES_PER_RUN in
 * automation.js, unchanged; creating a record overwrites nothing and is
 * bounded by the shape of a card.
 */
export const MAX_SCOUT_CARDS_PER_RUN = 3;

/**
 * The cadence: each card once a month, as three runs of one region, because a
 * run touches three cards. Keyed by day of the month.
 */
export const SCOUT_SCHEDULE = { 1: 'nordics-baltics', 11: 'southern-eastern-europe', 21: 'americas-middle-east' };

/** The most text of one fetched page the model is given. */
export const SCOUT_MAX_PAGE_CHARS = 60000;

/**
 * THE EXIT CONDITION of plan §8, phase 4: this many consecutive clean live
 * passes before the agent is considered for core markets. Six is every card
 * created once and reviewed once. Reaching it changes nothing by itself.
 */
export const SCOUT_EXIT_STREAK = 6;

/**
 * A pass counts toward the streak only if every card in it last had a clean
 * pass at least this many days earlier, or never. Six passes in an afternoon
 * would show nothing about a review.
 */
export const SCOUT_REVIEW_MIN_DAYS = 25;

/**
 * GRADUATION. A scout market earns a full dashboard when one investor reads
 * one of these calls across this many consecutive passes, and the inputs a
 * comparison file needs exist. The second half is the analyst's judgement and
 * is not computed.
 */
export const GRADUATION = { calls: [VERDICT.BUILD_POSITION, VERDICT.ENTER_NOW], passes: 2 };

export const GRADUATION_RULE = [
  'A scout market earns a full dashboard when one investor reads Build position or Enter now across two consecutive reviews, and the inputs a comparison file needs exist.',
  '当某一类投资者连续两次复核均为“建立仓位”或“现在进入”，且比较模型所需的输入齐备时，观察市场升级为完整看板。',
];

/** What a terms page was found to say. `unread` is a candidate nobody has checked. */
export const TERMS_STATUS = { PERMITS: 'permits', SILENT: 'silent', REFUSED: 'refused', UNREAD: 'unread' };

/** The statuses that admit a page to the agent's reading list. */
export const ADMITTED_TERMS = [TERMS_STATUS.PERMITS, TERMS_STATUS.SILENT];
