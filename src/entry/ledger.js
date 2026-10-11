/* ---------------------------------------------------------------------------
   THE CAPITAL-AT-RISK LEDGER — what a sponsor spends or pledges before the
   investment decision, in one shape.

   The comparison engine prices a project that arrives ready to build, having
   cost nothing to get there. Every one of its markets carries the same seed:
   twelve months to build, no development cost. This layer sits BESIDE the
   engine and never inside it. Nothing here feeds an IRR, and the frozen
   formulas and tests/baseline.test.js are untouched by all of it.

   The facts already existed, in five shapes in five places: a full guarantee
   card in Romania, a deposit noted as "not modelled" in Japan, one weighted
   line in a Polish risk score. One schema, so that two markets can be read
   side by side:

       what      fee · study · land · consent · security · deposit
       how much  per MW, per kW or a fixed sum, in its own currency
       when      the build-pathway stage at which it is paid or posted
       how lost  the event that forfeits it

   ---------------------------------------------------------------------------
   TWO FLAGS ARE STATED, NOT DERIVED

   `beforeFid` and `beforeConsent` are fields on every item, set by a person.
   They cannot be read off the stage, because the pathway model has no sequence:
   buildPathway.js fixes nine stages and deliberately not their order, and a
   ledger that inferred "application comes before consent" would be reinventing
   the total order that model took two attempts to remove. `beforeConsent` may
   be null, meaning nobody has established it.

   ---------------------------------------------------------------------------
   AN UNQUANTIFIED ITEM IS LISTED, AND MAKES THE TOTAL A LOWER BOUND

   "Twenty per cent of a connection tariff nobody has published" is a real
   exposure with no number. Dropping it would understate the total; inventing a
   number would be worse. So the item stays, with `amount: null`, and every
   total it would have entered is reported as a lower bound. A lower bound that
   already breaches an investor's limit is a breach. One that does not is
   UNCHECKED, never a pass — see limitInputs.

   Layering: imports the pathway stage vocabulary and the archetype metric keys.
   No DOM, no market module. Conversion rates and project cost are handed in by
   the caller; this module looks nothing up.
   --------------------------------------------------------------------------- */

import { STAGES } from '../governance/buildPathway.js';
import { METRIC } from '../governance/archetypes.js';
import { sourceProblems, ACCESS } from '../governance/triggers.js';

export const ITEM_KIND = ['fee', 'study', 'land', 'consent', 'security', 'deposit'];

export const ITEM_KIND_LABEL = {
  fee:      ['Fee', '费用'],
  study:    ['Study', '研究费用'],
  land:     ['Land', '土地'],
  consent:  ['Consenting cost', '许可相关费用'],
  security: ['Security', '保函/担保'],
  deposit:  ['Deposit', '押金'],
};

/** Kinds that are pledged rather than spent. These are what a limit on "security" counts. */
const PLEDGED = new Set(['security', 'deposit']);

/**
 * How far an item can be relied on.
 * VERIFIED:  a person opened the source and it says this.
 * VERIFY:    held in the repository or found by search, not yet opened and
 *            checked against the instrument in force.
 * UNSOURCED: known to exist, with no source at all.
 */
export const ITEM_STATUS = ['verified', 'verify', 'unsourced'];

export const ITEM_STATUS_LABEL = {
  verified:  ['Verified', '已核实'],
  verify:    ['To be verified', '待核实'],
  unsourced: ['Not yet sourced', '尚无来源'],
};

const isPair = (v) => Array.isArray(v) && v.length === 2
  && v.every(s => typeof s === 'string' && s.trim().length > 0);

const AMOUNT_BASES = ['perMW', 'perKW', 'fixed'];

function amountProblems(amount){
  if (amount === null) return [];
  if (!amount || typeof amount !== 'object') return ['amount must be null or an object'];
  const problems = [];
  const bases = AMOUNT_BASES.filter(k => amount[k] !== undefined);
  if (bases.length !== 1) problems.push(`amount needs exactly one of ${AMOUNT_BASES.join(', ')}`);
  else if (!(typeof amount[bases[0]] === 'number' && Number.isFinite(amount[bases[0]]) && amount[bases[0]] >= 0)){
    problems.push(`amount.${bases[0]} must be a non-negative number`);
  }
  if (typeof amount.currency !== 'string' || !/^[A-Z]{3}$/.test(amount.currency)) problems.push('amount.currency must be a three-letter code');
  return problems;
}

/**
 * Problems with one market's ledger. Empty array means valid.
 *
 * `limit` is required, as it is on a pathway: what the ledger does NOT know is
 * not optional. A ledger with no items is valid and common — it says nobody has
 * sourced this market yet — but it must still say so in `limit`.
 */
export function validateLedger(ledger){
  if (!ledger || !ledger.marketId) return ['ledger has no marketId'];
  const problems = [];
  const at = (m) => problems.push(`${ledger.marketId}: ${m}`);

  if (!(ledger.basis && ledger.basis.powerMW > 0 && ledger.basis.durationHours > 0)){
    at('basis must give the reference project as { powerMW, durationHours }');
  }
  if (!isPair(ledger.summary)) at('summary must be an [en, zh] pair');
  if (!isPair(ledger.limit)) at('limit must be an [en, zh] pair — what the ledger does not know');
  if (!Array.isArray(ledger.items)) return [...problems, `${ledger.marketId}: items must be an array`];

  const seen = new Set();
  for (const item of ledger.items){
    const on = (m) => at(`${item.id || '?'}: ${m}`);
    if (!item.id || seen.has(item.id)) on('id is missing or repeats');
    seen.add(item.id);
    if (!ITEM_KIND.includes(item.kind)) on(`kind must be one of ${ITEM_KIND.join(', ')}`);
    if (!isPair(item.label)) on('label must be an [en, zh] pair');
    for (const p of amountProblems(item.amount)) on(p);
    if (item.amount === null && !isPair(item.amountNote)) on('an unquantified item says why in amountNote');

    if (!STAGES.includes(item.postedAt)) on(`postedAt must be a pathway stage, not "${item.postedAt}"`);
    if (item.releasedAt !== null && !STAGES.includes(item.releasedAt)) on('releasedAt must be a pathway stage, or null when it is never returned');
    if (typeof item.beforeFid !== 'boolean') on('beforeFid must be stated as true or false');
    if (item.beforeConsent !== null && typeof item.beforeConsent !== 'boolean') on('beforeConsent must be true, false, or null when not established');
    if (typeof item.refundable !== 'boolean') on('refundable must be stated');
    if (!item.refundable && item.releasedAt !== null) on('a non-refundable item has no release stage');

    if (!isPair(item.form)) on('form must be an [en, zh] pair — cash, bank guarantee, bond');
    /* Only what is pledged can be forfeited; a fee is simply spent. */
    if (PLEDGED.has(item.kind) && !isPair(item.lostIf)) on('security and deposits say how they are lost');

    if (!ITEM_STATUS.includes(item.status)) on(`status must be one of ${ITEM_STATUS.join(', ')}`);
    if (!Array.isArray(item.evidence)) on('evidence must be an array');
    else {
      if (!item.evidence.length && item.status !== 'unsourced') on('no evidence — only an unsourced item may stand without one');
      for (const source of item.evidence){
        for (const p of sourceProblems(source)) on(p);
        /* A page reached only through a search summary establishes nothing. */
        if (item.status === 'verified' && source?.access === ACCESS.SEARCH_SUMMARY) on('a search summary cannot verify an item');
      }
    }
  }
  return problems;
}

/**
 * The reference project in USD: power × installed cost × conversion rate.
 * `comparison` is a market's comparison interface; `usdPer` is USD per unit of
 * the market's currency. Null when anything is missing — never a zero.
 */
export function referenceProject(comparison, usdPer){
  const powerMW = comparison?.archetype?.powerMW;
  const capexPerMW = comparison?.economics?.capexPerMW;
  if (![powerMW, capexPerMW, usdPer].every(v => typeof v === 'number' && Number.isFinite(v) && v > 0)) return null;
  return {
    powerMW,
    durationHours: comparison.archetype.durationHours,
    costUSD: powerMW * capexPerMW * usdPer,
  };
}

/** One item in USD for the reference project, or null when it has no amount or no rate. */
export function itemUSD(item, basis, usdPerByCurrency){
  if (!item.amount) return null;
  const rate = usdPerByCurrency?.[item.amount.currency];
  if (!(typeof rate === 'number' && Number.isFinite(rate) && rate > 0)) return null;
  const local = item.amount.perMW !== undefined ? item.amount.perMW * basis.powerMW
    : item.amount.perKW !== undefined ? item.amount.perKW * basis.powerMW * 1000
    : item.amount.fixed;
  return local * rate;
}

const WEAKNESS = { verified: 0, verify: 1, unsourced: 2 };

/**
 * What the ledger adds up to for the reference project.
 *
 * Each total is `{ usd, lowerBound }`. `lowerBound` is true when an item that
 * belongs in the total has no amount — or, for security before consent, when an
 * item's position relative to consent has not been established. The figure is
 * then the least it can be, and must be shown as "at least".
 *
 * `shareOfCost` is the number the capital-at-risk anchors are written against;
 * `preFid.usd` is the number an archetype's limit is written against. Both are
 * kept because they rank markets in opposite orders (plan §5.3).
 */
export function ledgerTotals(ledger, usdPerByCurrency, projectCostUSD = null){
  const total = () => ({ usd: 0, lowerBound: false });
  const preFid = total(), security = total(), securityBeforeConsent = total();
  const byStage = {};
  const unquantified = [];
  let weakest = 'verified';

  for (const item of ledger.items){
    if (WEAKNESS[item.status] > WEAKNESS[weakest]) weakest = item.status;
    const usd = itemUSD(item, ledger.basis, usdPerByCurrency);
    if (usd === null) unquantified.push(item.id);
    const add = (bucket) => { if (usd === null) bucket.lowerBound = true; else bucket.usd += usd; };

    if (item.beforeFid){
      add(preFid);
      if (usd !== null) byStage[item.postedAt] = (byStage[item.postedAt] || 0) + usd;
    }
    if (PLEDGED.has(item.kind) && item.beforeFid){
      add(security);
      if (item.beforeConsent === true) add(securityBeforeConsent);
      else if (item.beforeConsent === null) securityBeforeConsent.lowerBound = true;
    }
  }

  const hasCost = typeof projectCostUSD === 'number' && projectCostUSD > 0;
  const empty = ledger.items.length === 0;
  return {
    marketId: ledger.marketId,
    empty,
    preFid, security, securityBeforeConsent,
    /* Null on an empty ledger: zero would say the market asks for nothing. */
    perMWUSD: empty ? null : preFid.usd / ledger.basis.powerMW,
    shareOfCost: hasCost && !empty ? preFid.usd / projectCostUSD : null,
    projectCostUSD: hasCost ? projectCostUSD : null,
    byStage,
    unquantified,
    weakestStatus: ledger.items.length ? weakest : 'unsourced',
  };
}

/**
 * The totals in the shape archetypes.limitCheck takes: figures keyed by METRIC,
 * and the keys whose figure is only a lower bound.
 *
 * An empty ledger supplies NO figure for capital or security, on purpose. Zero
 * would read as "this market asks for nothing", which is a claim nobody has
 * made; absent reads as unchecked, which is the truth.
 */
export function limitInputs(totals){
  const metrics = {}, incomplete = [];
  if (totals.projectCostUSD !== null) metrics[METRIC.PROJECT_COST_USD] = totals.projectCostUSD;
  if (!totals.empty){
    metrics[METRIC.PRE_FID_CAPITAL_USD] = totals.preFid.usd;
    metrics[METRIC.SECURITY_BEFORE_CONSENT_USD] = totals.securityBeforeConsent.usd;
    if (totals.preFid.lowerBound) incomplete.push(METRIC.PRE_FID_CAPITAL_USD);
    if (totals.securityBeforeConsent.lowerBound) incomplete.push(METRIC.SECURITY_BEFORE_CONSENT_USD);
  }
  return { metrics, incomplete };
}

/**
 * What it costs to keep pledged capital outstanding: amount × rate × years.
 * `annualRate` is the caller's, because a cost of capital is methodology and
 * this layer holds none. `months` is how long the security stays posted.
 */
export function carryingCostUSD(amountUSD, annualRate, months){
  if (![amountUSD, annualRate, months].every(v => typeof v === 'number' && Number.isFinite(v) && v >= 0)) return null;
  return amountUSD * annualRate * (months / 12);
}
