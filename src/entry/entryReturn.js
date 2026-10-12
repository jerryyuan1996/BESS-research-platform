/* ---------------------------------------------------------------------------
   ENTRY-ADJUSTED RETURN — what the asset pays once getting in is counted.

   The comparison engine prices a project that arrives ready to build, having
   cost nothing to get there, and builds in twelve months. That is the ASSET
   IRR, and it stays exactly as it is. This module sits BESIDE the engine: it
   calls it and reads its result. It changes no formula and no assumption, and
   tests/entry-return.test.js asserts that a base case run before and after
   this module is used is the same object.

   Four lines, shown together (plan section 4.4):

     1  asset IRR                   the engine's figure, untouched
     2  entry-adjusted IRR          the same asset with development time in
                                    front of it, the ledger's spend and
                                    security on that time, and the build the
                                    market actually takes
     3  break-even attrition        the share of development attempts that can
                                    fail before the programme stops paying
     4  implied ready-to-build      what a buyer pricing on the engine's own
        value                       exit yields could pay for a consented,
                                    connected megawatt

   ---------------------------------------------------------------------------
   THREE CHOICES, EACH THE ANALYST'S (plan phase 5, decision 7)

   SECURITY IS TREATED AS CASH. Out when posted, back when released. A bank
   guarantee costs a fee and not the principal, so this OVERSTATES the drag and
   is labelled an upper bound on the cost of security. The alternative is a
   guarantee fee rate, which is a methodology number nobody has set.

   THE BUYER IS PRICED ON THE ENGINE'S OWN EXIT YIELDS. Line 4 is the engine's
   exit valuation taken at year 0, so it introduces no new rate. It inherits
   the fifteen-year window, so it is an ORDERING until gate G12 closes. A
   negative value is reported as negative: at those yields a buyer would not
   pay for the project at all.

   FORFEITURE IS TOTAL WHERE THE LEDGER DESCRIBES IT. A pledged item that says
   how it is lost is counted as wholly lost on a failed attempt.

   ---------------------------------------------------------------------------
   WHAT IT DOES NOT KNOW, AND SAYS

   There is no critical path on this platform, so development spend is spread
   evenly over the development years and security is posted on day one: the
   worst case for timing. And the ledger holds only what somebody sourced.
   Development cost in full is gate G36. So where a ledger has an unquantified
   item before the decision, line 2 is AT MOST the figure shown and line 3 is
   AT MOST the share shown, because the true cost can only be higher.

   A market with no stated timing gets no line 2. It never gets a number built
   on the engine's twelve-month seed.

   Layering: imports the engine and the ledger arithmetic. No DOM, no market
   module, no clock.
   --------------------------------------------------------------------------- */

import { runBaseCase } from '../comparison/engine.js';
import { withOverrides } from '../comparison/scenario.js';
import { EXIT_Y_CONTRACTED, EXIT_Y_MERCHANT, EXIT_Y_AUCTION, EXIT_Y_OPEX } from '../comparison/assumptions.js';
import { irrOf, pvTail } from '../utils/finance.js';
import { itemUSD } from './ledger.js';

/** Kinds that are pledged rather than spent, as in ledger.js. */
const PLEDGED = new Set(['security', 'deposit']);

const finite = (v) => typeof v === 'number' && Number.isFinite(v);
const mid = (range) => (range[0] + range[1]) / 2;

/**
 * What the ledger adds up to per MW before the decision, split the way the
 * arithmetic below needs it.
 *
 *   spendPerMW     non-refundable spend: fees, studies, land, consent
 *   pledgedPerMW   security and deposits, at face value
 *   forfeitPerMW   the part of that which the ledger says can be lost
 *   incomplete     true when an item before the decision has no amount, or an
 *                  amount no rate converts: every figure is then a lower bound
 */
export function entryCosts(ledger, usdPerByCurrency){
  const out = { spendPerMW: 0, pledgedPerMW: 0, forfeitPerMW: 0, incomplete: false, releaseAtEntry: 0, releaseEarlier: 0 };
  if (!ledger) return { ...out, incomplete: true };
  for (const item of ledger.items){
    if (!item.beforeFid) continue;
    const usd = itemUSD(item, ledger.basis, usdPerByCurrency);
    if (usd === null){ out.incomplete = true; continue; }
    const perMW = usd / ledger.basis.powerMW;
    if (PLEDGED.has(item.kind)){
      out.pledgedPerMW += perMW;
      if (item.lostIf) out.forfeitPerMW += perMW;
      /* Released at market entry is held through the build; anything released
         earlier is taken to come back at the decision. */
      if (item.releasedAt === 'entry') out.releaseAtEntry += perMW; else out.releaseEarlier += perMW;
    } else {
      out.spendPerMW += perMW;
    }
  }
  return out;
}

/**
 * Line 4. What a buyer at the engine's exit yields could pay at the decision
 * for one consented, connected MW: the asset's value less what it costs to
 * build.
 *
 *   V = Σ sec[y]/(1+yC)^y + Σ auc[y]/(1+yA)^y + Σ mch[y]/(1+yM)^y
 *       − Σ cost[y]/(1+yO)^y − net                         y = 1 … 15
 *
 * `cost[y]` is read back off the engine's own operating line, so anything the
 * engine netted in a year is netted here.
 */
export function impliedRtbValue(result){
  if (!result || result.na) return null;
  const sec = result.secY, auc = result.aucY, mch = result.mchY;
  const cost = result.eb.map((e, i) => sec[i] + auc[i] + mch[i] - e);
  return pvTail(sec, EXIT_Y_CONTRACTED, 0) + pvTail(auc, EXIT_Y_AUCTION, 0) + pvTail(mch, EXIT_Y_MERCHANT, 0)
    - pvTail(cost, EXIT_Y_OPEX, 0) - result.net;
}

/**
 * Line 3. A developer spends S and risks G on each attempt and sells a
 * success at V. With p the share of attempts that fail:
 *
 *   expected value = (1 − p)·(V − S) − p·(S + G)
 *   break-even  p* = (V − S) / (V + G)
 *
 * Zero when a success does not cover its own spend: the programme does not
 * pay even if nothing fails. Time value inside the development period is
 * ignored; counting it would lower the figure slightly.
 */
export function breakEvenAttrition(valuePerMW, spendPerMW, forfeitPerMW){
  if (![valuePerMW, spendPerMW, forfeitPerMW].every(finite)) return null;
  const margin = valuePerMW - spendPerMW;
  if (margin <= 0) return 0;
  return margin / (valuePerMW + forfeitPerMW);
}

/**
 * Line 2, for one pair of months: development first, then the engine's own
 * vector for a build of `buildMonths`.
 *
 *   t = −d … −1    −S/d          spend, spread evenly
 *   t = −d         −G            security, posted on day one
 *   t = 0          +G released before the build
 *   t = first operating year     +G released at market entry
 *   t = 0 …        the engine's flows with constructionMonths = buildMonths
 */
function adjustedIrr(market, costs, monthsToRtb, buildMonths){
  const result = runBaseCase(withOverrides(market, { constructionMonths: buildMonths }), 5);
  if (result.na) return null;
  const d = Math.max(0, Math.round(monthsToRtb / 12));
  const flows = new Array(d).fill(0).concat(result.holdFlows);
  if (d === 0){
    /* No development period to spread over: the spend falls at the decision. */
    flows[0] -= costs.spendPerMW;
  } else {
    for (let i = 0; i < d; i++) flows[i] -= costs.spendPerMW / d;
    flows[0] -= costs.pledgedPerMW;
    flows[d] += costs.releaseEarlier;
    flows[d + result.codOffset + 1] += costs.releaseAtEntry;
  }
  return irrOf(flows);
}

/**
 * The four lines for one market.
 *
 * @param market   the registered market: { manifest, comparison }
 * @param ledger   its capital-at-risk ledger, or null
 * @param usdPer   USD per unit, keyed by currency code
 * @returns
 *   withheld        true when the engine does not price this market
 *   assetIrr        line 1
 *   entryAdjusted   line 2: { low, high, basis } or null when no timing is stated
 *   attrition       line 3, 0–1, or null
 *   rtbValuePerMW   line 4, USD per MW
 *   atMost          true when the ledger is incomplete, so lines 2 and 3 are
 *                   upper bounds
 *   costs           what the ledger supplied, per MW
 */
export function entryReturn(market, ledger, usdPer){
  const base = runBaseCase(market, 5);
  if (!market?.comparison || base.na) return { withheld: true, reason: base.na ?? null };

  const costs = entryCosts(ledger, usdPer);
  const value = impliedRtbValue(base);
  const timing = ledger?.timing ?? null;

  let entryAdjusted = null;
  if (timing){
    /* The slow case is the long development AND the long build, and the fast
       case the short of each, so the pair brackets the range. */
    const slow = adjustedIrr(market, costs, timing.monthsToRtb[1], timing.buildMonths[1]);
    const fast = adjustedIrr(market, costs, timing.monthsToRtb[0], timing.buildMonths[0]);
    const central = adjustedIrr(market, costs, mid(timing.monthsToRtb), mid(timing.buildMonths));
    entryAdjusted = { low: slow, high: fast, central, basis: timing.basis };
  }

  /* A ledger with nothing quantified before the decision says nothing about
     what an attempt costs. A break-even of "at most 100%" would be true and
     useless, so the line is left unchecked. */
  const nothingCosted = costs.incomplete && costs.spendPerMW === 0 && costs.pledgedPerMW === 0;

  return {
    withheld: false,
    assetIrr: base.irrHold,
    entryAdjusted,
    attrition: nothingCosted ? null : breakEvenAttrition(value, costs.spendPerMW, costs.forfeitPerMW),
    rtbValuePerMW: value,
    atMost: costs.incomplete,
    costs,
    timing,
  };
}
