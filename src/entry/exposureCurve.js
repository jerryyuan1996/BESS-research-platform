/* ---------------------------------------------------------------------------
   THE EXPOSURE CURVE — a ledger laid along time (plan section 6.2).

   Months from site control on one axis, capital at risk on the other, with a
   step up where something is paid or posted and a step down where a security
   is returned. It adds no number: every amount is the ledger's own, converted
   by itemUSD exactly as the totals are.

   ---------------------------------------------------------------------------
   WHERE A STAGE FALLS IN TIME IS A CONVENTION, AND ONLY THAT

   A ledger says at which pathway STAGE an item is posted and released. Nothing
   on this platform says in which MONTH a stage falls: the pathway model is a
   partial order with no critical path, and its per-stage durations overlap and
   mostly rest on sector convention. What a ledger may state is two ranges,
   `timing.monthsToRtb` and `timing.buildMonths`. So:

     1  Seven stages are taken to precede the decision, in the order SLOTS
        lists them. Each gets one seventh of the months to ready-to-build.
     2  Construction runs from the decision to first revenue, and market entry
        is first revenue.
     3  An item is posted at the START of its stage and released at the END.
     4  Each month is worked out three times: on the short end of both ranges
        (fast), the long end (slow) and the midpoint (central). The page draws
        the central line and a band from fast to slow at every step.

   SLOTS is this module's own drawing order. It happens to list the stages as
   the pathway vocabulary does, and that vocabulary is explicit that its order
   is not a claim; neither is this one. `slotProblems` checks the order against
   the prerequisite edges a market has actually published, and
   tests/exposure-curve.test.js holds every market with a curve to it.

   The entry-adjusted return (entryReturn.js) posts all security on day one,
   which is its worst case. This is a different convention for the same gap,
   chosen because a curve with every step at month zero shows nothing.

   ---------------------------------------------------------------------------
   WHAT IT REFUSES

   No stated timing, no curve: a ledger without a `timing` block returns null
   and the page says why. A duration is never invented and the engine's
   twelve-month seed is never used.

   An item with no amount is still an event. It moves the line by nothing and
   marks everything after it, until it is released, as a LOWER BOUND.

   Layering: imports the ledger arithmetic. No DOM, no market module.
   --------------------------------------------------------------------------- */

import { itemUSD } from './ledger.js';

/** The stages drawn before the decision, in the order they are given a slot. */
export const SLOTS = ['site', 'application', 'studies', 'consent', 'compliance', 'revenue', 'procurement'];

/** The stages drawn after it: the build, then first revenue. */
export const AFTER_DECISION = ['construction', 'entry'];

export const CASES = ['fast', 'central', 'slow'];

const pick = (range, which) => which === 'fast' ? range[0] : which === 'slow' ? range[1] : (range[0] + range[1]) / 2;

/**
 * The months, from site control, at which a stage starts and ends in one case.
 *
 *   slot k of seven    [k/7 · rtb, (k+1)/7 · rtb]
 *   construction       [rtb, rtb + build]
 *   entry              [rtb + build, rtb + build]
 */
export function stageMonths(stage, timing, which = 'central'){
  const rtb = pick(timing.monthsToRtb, which), build = pick(timing.buildMonths, which);
  const k = SLOTS.indexOf(stage);
  if (k >= 0) return { start: k / SLOTS.length * rtb, end: (k + 1) / SLOTS.length * rtb };
  if (stage === 'construction') return { start: rtb, end: rtb + build };
  if (stage === 'entry') return { start: rtb + build, end: rtb + build };
  return null;
}

const inAllCases = (fn) => Object.fromEntries(CASES.map(which => [which, fn(which)]));

/**
 * Where the slot order contradicts what a market has published. Empty means it
 * does not. An edge says an artefact from `requiresFrom` must be in hand
 * before the instrument at `before`; the convention draws stages one after
 * another, so `requiresFrom` has to come first.
 */
export function slotProblems(pathway){
  const order = [...SLOTS, ...AFTER_DECISION];
  return (pathway?.prerequisites || [])
    .filter(edge => !(order.indexOf(edge.requiresFrom) < order.indexOf(edge.before)))
    .map(edge => `${pathway.marketId}: the slot order draws "${edge.before}" no later than "${edge.requiresFrom}", against ${edge.id}`);
}

/**
 * One market's curve, per MW of its reference project, or null when its
 * ledger states no timing or lists nothing before the decision.
 *
 * `events` are in the order they are drawn: by central month, and at the same
 * month a release before a posting, since the stage that ended is over before
 * the next begins. Each carries
 *
 *   type          'post' or 'release'
 *   month         { fast, central, slow }
 *   usdPerMW      the step, or null when the item has no amount
 *   before/after  the line either side of the step, USD per MW
 *   lowerBound    true when an unquantified item is outstanding after it
 *
 * `peak` is the highest the quantified line reaches. `lowerBound` is true when
 * an unquantified item is outstanding at any point: the true peak is then at
 * least this, and may be later than the month given.
 */
export function exposureCurve(ledger, usdPerByCurrency){
  const timing = ledger?.timing;
  if (!timing) return null;
  const items = ledger.items.filter(item => item.beforeFid);
  if (!items.length) return null;

  const raw = [];
  for (const item of items){
    const usd = itemUSD(item, ledger.basis, usdPerByCurrency);
    const usdPerMW = usd === null ? null : usd / ledger.basis.powerMW;
    const event = (type, stage, edge) => raw.push({
      type, stage, item, usdPerMW,
      month: inAllCases(which => stageMonths(stage, timing, which)[edge]),
    });
    event('post', item.postedAt, 'start');
    if (item.refundable && item.releasedAt) event('release', item.releasedAt, 'end');
  }
  /* Array.sort is stable, so items posted in the same month keep ledger order. */
  raw.sort((a, b) => a.month.central - b.month.central || (a.type === b.type ? 0 : a.type === 'release' ? -1 : 1));

  let level = 0, open = 0, everOpen = false;
  const peak = { usdPerMW: 0, month: null, lowerBound: false };
  const events = raw.map(e => {
    const before = level;
    const sign = e.type === 'post' ? 1 : -1;
    if (e.usdPerMW === null) open += sign; else level += sign * e.usdPerMW;
    if (open > 0) everOpen = true;
    if (level > peak.usdPerMW){ peak.usdPerMW = level; peak.month = e.month; }
    return {
      id: e.item.id, type: e.type, stage: e.stage, kind: e.item.kind,
      label: e.item.label, lostIf: e.item.lostIf ?? null, amountNote: e.item.amountNote ?? null,
      month: e.month, usdPerMW: e.usdPerMW, before, after: level, lowerBound: open > 0,
    };
  });
  peak.lowerBound = everOpen;

  return {
    marketId: ledger.marketId,
    powerMW: ledger.basis.powerMW,
    timing,
    events,
    peak,
    lowerBound: everOpen,
    decision: inAllCases(which => stageMonths('construction', timing, which).start),
    firstRevenue: inAllCases(which => stageMonths('entry', timing, which).end),
    /* What is still outstanding at first revenue: spend, which never comes
       back. A lower bound when a fee with no amount is among it. */
    end: level,
    endLowerBound: open > 0,
  };
}

/**
 * Events that fall in the same central month, as one numbered marker: the
 * unit the chart draws and the table beneath it lists.
 */
export function markers(curve){
  const out = [];
  for (const e of curve.events){
    const last = out[out.length - 1];
    if (last && last.month.central === e.month.central) last.events.push(e);
    else out.push({ month: e.month, events: [e] });
  }
  return out.map((m, i) => ({ ...m, n: i + 1, after: m.events[m.events.length - 1].after, lowerBound: m.events[m.events.length - 1].lowerBound }));
}

/**
 * The ledgers that state a timing, each fetched on demand, so that one
 * market's Entry tab can draw another's curve on the same axes without every
 * ledger riding in a shared chunk. tests/exposure-curve.test.js holds this
 * list to the ledgers themselves.
 */
export const TIMED_LEDGERS = {
  wa: () => import('../markets/wa/entryLedger.js').then(m => m.ENTRY_LEDGER),
  ro: () => import('../markets/ro/entryLedger.js').then(m => m.ENTRY_LEDGER),
};
