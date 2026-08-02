/* ---------------------------------------------------------------------------
   Global comparison engine.

   One currency (USD), one model, one 15-year life, unlevered. Inputs are each
   market's reference-archetype economics in native currency, taken from that
   market's comparison interface — never from its dashboard, its DOM or its
   internal data files.

        market/comparison.js  ──►  engine.js  ──►  home page
                                (this file)

   The arithmetic below is the prototype's runCase() (lines 769-809) with no
   formula changes. The only structural difference: strategy availability is read
   from declared capabilities instead of inferred from a zero, and an unavailable
   strategy returns { na } rather than a number. See docs/comparison-methodology.md.

   Never substitute zero for "not applicable" — callers must branch on `.na`.
   --------------------------------------------------------------------------- */
import { irrOf, pvTail } from '../utils/finance.js';
import {
  FX, LIFE, EXIT_Y_CONTRACTED, EXIT_Y_MERCHANT, EXIT_Y_OPEX, EXIT_Y_AUCTION,
} from './assumptions.js';
import { servicesFactor } from './capacityLine.js';
import { strategyById, supports, baseStrategy } from './strategies.js';

/**
 * Capital grant, after the caps a scheme actually imposes.
 *
 * A grant expressed as a percentage of capex is an approximation of a scheme
 * that is really a competitive award with hard ceilings. Romania's is capped at
 * €69,000/MWh installed and €15m per company; at our archetype neither binds, but
 * they bind immediately if capex rises or the duration is changed, and a
 * percentage alone would silently sail past both.
 */
function grantForMW(e, archetype, capexPerMW){
  let g = capexPerMW * (e.grantPct || 0) / 100;
  if (e.grantCapPerMWh && archetype?.durationHours){
    g = Math.min(g, e.grantCapPerMWh * archetype.durationHours);
  }
  if (e.grantCapAbsolute && archetype?.powerMW){
    g = Math.min(g, e.grantCapAbsolute / archetype.powerMW);
  }
  return g;
}

/**
 * Runs one market under one route to market.
 *
 * Dispatches on the market's declared risk class. Markets with no risk class use
 * the original two-stream model unchanged; markets that separate secured capacity
 * revenue from assumed auction renewals use runAuctionRenewalCase().
 *
 * @param {object} market      registry entry ({ manifest, comparison, ... })
 * @param {string} strategyId  'cap' | 'mer' | 'toll'
 * @param {number} exitYear    5 | 7 | 10
 * @returns {object} either { na:[en,zh] } or the full per-MW USD case
 */
export function runCase(market, strategyId, exitYear){
  const cmp = market && market.comparison;
  if (!cmp || !cmp.economics) return { na: ['Economics unavailable', '经济性数据不可用'] };

  // A market may be registered before its normalized inputs are complete. It still
  // gets a card and a dashboard; it stays out of the numeric comparison until the
  // inputs pass their quality gates.
  if (cmp.engineReady === false){
    return { na: ['Normalized inputs pending', '归一化输入待补'] };
  }

  const strat = strategyById(strategyId);
  if (!strat) return { na: ['Unknown strategy', '未知策略'] };
  if (!supports(market, strategyId)) return { na: strat.na };

  if (cmp.economics.riskClass === 'auction-renewal'){
    return runAuctionRenewalCase(market, strategyId, exitYear);
  }
  return runLegacyCase(market, strategyId, exitYear);
}

/* The original model, unchanged. Two revenue streams: a contracted line that runs
   for contractYears then steps down by postFactor, and a degrading merchant line.
   Every pre-Japan market uses this path and its outputs are pinned by
   tests/baseline.test.js against the legacy prototype. */
function runLegacyCase(market, strategyId, exitYear){
  const e = market.comparison.economics;
  const fx = FX[market.manifest.currency];
  if (fx == null) return { na: ['No FX rate for ' + market.manifest.currency, '缺少' + market.manifest.currency + '汇率'] };

  /* Network-access haircut. Where a market grants dispatch priority to incumbents
     — or takes it away in exchange for price certainty, as WA's fixed-price
     election does — what is lost is headroom to earn energy revenue, not the
     capacity payment itself. So it lands here, on the market streams, which is
     also where it can later be checked against a constraint dataset. */
  const access = e.naqFactor ?? 1;

  let cap = 0, cy = 0, post = 0, note = null;
  let capB = 0, cyB = 0;          // a second contracted stream, retained alongside the first
  let marketFrom = 1;             // first year the asset earns market revenue
  let merch = e.merchGross * (1 - (e.feePct || 0) / 100) * fx * access;
  let svc = (e.services || 0) * fx * access;
  let grant = grantForMW(e, market.comparison.archetype, e.capexPerMW) * fx;
  const capexG = e.capexPerMW * fx, opex = e.opexPerMW * fx;

  if (strategyId === 'cap'){
    cap = e.contracted * fx; cy = Math.min(e.contractYears, LIFE); post = e.postFactor || 0;
    note = e.capNote || e.grantNote || null;
  } else if (strategyId === 'mer'){
    note = e.grantNote || null;
  } else if (strategyId === 'toll'){
    grant = 0;
    cap = e.toll * fx; cy = Math.min(e.tollYears || LIFE, LIFE); post = 0;
    /* GB's tolling precedent (Drax/Fidra) pays a fixed fee for dispatch control
       while the OWNER keeps Capacity Market revenue. Modelling the two as
       alternatives — which is what a single `cap` slot forces — understated the
       structure by the whole capacity line. */
    if (e.tollAdditiveWithCapacity){
      capB = (e.contracted || 0) * fx;
      cyB = Math.min(e.contractYears || 0, LIFE);
    }
    /* The toll ends before the asset does: ten years of precedent against a
       fifteen-year window. Those five years are a merchant tail, and pretending
       they are empty is as wrong as pretending they are contracted. */
    marketFrom = e.tollRevertsToMerchant ? cy + 1 : LIFE + 1;
    if (!e.tollRevertsToMerchant){ merch = 0; svc = 0; }
    note = e.tollNote || null;
  } else if (strategyId === 'ltda'){
    /* A long-term award on a market whose capacity is NOT re-auctioned annually.

       Japan reaches this route through runAuctionRenewalCase, because there the
       award sits alongside a capacity market that clears one delivery year at a
       time. Italy's MACSE and the NEM's Capacity Investment Scheme do not: the
       award is the whole contracted position for its term, and the market it
       displaces is the ordinary merchant stack. Forcing those two into the
       auction-renewal risk class to reach this route would have published a
       renewal curve neither scheme has.

       The structure is the same in both places and is what `merchantRetention`
       encodes: a fixed payment, plus whatever fraction of market revenue the
       scheme lets the owner keep. At retention 1 the award simply stacks; at 0.1
       it is very nearly an alternative to trading rather than an addition to it. */
    const award = e.ltda;
    if (!award) return { na: ['No representative award scenario loaded', '未载入代表性中标情景'] };
    cap = (award.payment || 0) * fx;
    cy = Math.min(award.years || LIFE, LIFE);
    post = award.postFactor ?? 0;
    const retention = award.merchantRetention ?? 1;
    merch *= retention;
    svc *= retention;
    /* An award is competitively bid against the bidder's own costs. Stacking a
       capital grant on top would let a market claim support twice. */
    if (award.excludesGrant) grant = 0;
    note = award.note || null;
  }

  const net = capexG - grant;
  const capY = [], mchY = [], eb = [];
  for (let y = 1; y <= LIFE; y++){
    const c = (y <= cy ? cap : cap * post) + (y <= cyB ? capB : 0);
    const d = Math.pow(1 - (e.degr || 2) / 100, y - 1);
    const mm = y >= marketFrom
      ? (merch + svc * servicesFactor(e.servicesCurve, y)) * d
      : 0;
    capY.push(c); mchY.push(mm); eb.push(c + mm - opex);
  }

  const irrHold = irrOf([-net].concat(eb));
  let cum = -net, payback = null;
  for (let y = 1; y <= LIFE; y++){ cum += eb[y - 1]; if (cum >= 0 && payback == null) payback = y; }

  const X = exitYear;
  const exitVal = pvTail(capY, EXIT_Y_CONTRACTED, X) + pvTail(mchY, EXIT_Y_MERCHANT, X)
    - pvTail(Array(LIFE - X).fill(opex), EXIT_Y_OPEX, 0);
  const exFlows = [-net].concat(eb.slice(0, X)); exFlows[X] += exitVal;
  const irrExit = irrOf(exFlows);
  const cumOp = eb.slice(0, X).reduce((a, b) => a + b, 0);
  const moic = (cumOp + exitVal) / net;
  const contractedShare = eb[0] > 0 ? capY[0] / (capY[0] + mchY[0]) : 0;

  return {
    marketId: market.manifest.id, strategyId, exitYear: X,
    net, grant, capexG, eb1: eb[0], yield1: eb[0] / net, capY, mchY, eb,
    irrHold, payback, exitVal, irrExit, moic, cumOp, contractedShare,
    // In the legacy model every contracted unit is secured for its full tenor, so
    // secured share and secured tenor are just the contracted figures renamed.
    securedShare: contractedShare,
    securedYears: strategyId === 'cap' ? Math.min(e.contractYears || 0, LIFE)
      : strategyId === 'toll' ? Math.min(e.tollYears || LIFE, LIFE)
      : strategyId === 'ltda' ? Math.min(e.ltda?.years || 0, LIFE) : 0,
    aucY: Array(LIFE).fill(0),
    kwPerM: 1e6 / (net / 1000), note,
  };
}

/* ---------------------------------------------------------------------------
   Auction-renewal model.

   For markets where capacity revenue is won one delivery year at a time and must
   be re-won thereafter — Japan's Capacity Market main auction is the case this
   was built for. Three revenue classes instead of two:

     secured        an executed award covering the modelled year
     auctionRenewal future clearings assumed but not secured — market risk
     merchant       energy + incremental balancing

   The distinction is not cosmetic. It changes two published numbers: the secured
   share of year-1 revenue (a 1-year award is not a 15-year contract), and the exit
   value (renewal years are discounted at the auction/market yield, not the
   contracted yield). Collapsing them into `contracted` would have overstated both.
   --------------------------------------------------------------------------- */
function runAuctionRenewalCase(market, strategyId, exitYear){
  const e = market.comparison.economics;
  const fx = FX[market.manifest.currency];
  if (fx == null) return { na: ['No FX rate for ' + market.manifest.currency, '缺少' + market.manifest.currency + '汇率'] };

  const capexG = e.capexPerMW * fx;
  const opex = e.opexPerMW * fx;
  const grant = grantForMW(e, market.comparison.archetype, e.capexPerMW) * fx;
  const net = capexG - grant;

  /* The long-term award is a different animal from the annual capacity auction
     that this function was originally written for, and the difference is not the
     tenor — it is the clawback. Japan's LTDA returns ~90% of net profit earned in
     other markets to OCCTO for the whole 20-year term, so the award and the
     merchant stack are very nearly alternatives rather than a stack. Retention
     expresses that: it is the fraction of market revenue the owner keeps. */
  const isLtda = strategyId === 'ltda';
  const award = e.ltda || null;
  if (isLtda && !award) return { na: ['No representative award scenario loaded', '未载入代表性中标情景'] };
  const retention = isLtda ? (award.merchantRetention ?? 1) : 1;
  const access = e.naqFactor ?? 1;

  /* merchGross may already be net of the optimiser fee — the Japan dashboard
     reports it that way. merchantNetOfFee guards against deducting it twice. */
  const feeMult = e.merchantNetOfFee ? 1 : (1 - (e.feePct || 0) / 100);
  const merch = e.merchGross * feeMult * fx * retention * access;
  const svc = (e.services || 0) * fx * retention * access;   // incremental balancing value only

  let securedYears = 0, secured = 0, curve = [];
  if (isLtda){
    securedYears = Math.min(award.years || 0, LIFE);
    secured = (award.payment || 0) * fx;
    /* No renewal curve by construction: a 20-year Capacity Reserve Agreement does
       not roll off inside a 15-year window. There is nothing to re-win. */
  } else if (strategyId === 'cap'){
    securedYears = Math.min(e.securedContractYears || 0, LIFE);
    secured = (e.securedContracted || 0) * fx;
    /* Renewal curve: entry i is the assumed payment for the year at index
       securedYears + i, in native currency per MW per year. A short curve simply
       ends — no payment is assumed beyond what the market stated. */
    if (Array.isArray(e.auctionRenewalCurve)) curve = e.auctionRenewalCurve;
  }

  const secY = [], aucY = [], mchY = [], eb = [];
  for (let y = 1; y <= LIFE; y++){
    const s = y <= securedYears ? secured : 0;
    const a = y > securedYears ? ((curve[y - securedYears - 1] ?? 0) * fx) : 0;
    const d = Math.pow(1 - (e.degr || 2) / 100, y - 1);
    const m = (merch + svc * servicesFactor(e.servicesCurve, y)) * d;
    secY.push(s); aucY.push(a); mchY.push(m);
    eb.push(s + a + m - opex);
  }

  const irrHold = irrOf([-net].concat(eb));
  let cum = -net, payback = null;
  for (let y = 1; y <= LIFE; y++){ cum += eb[y - 1]; if (cum >= 0 && payback == null) payback = y; }

  const X = exitYear;
  const exitVal = pvTail(secY, EXIT_Y_CONTRACTED, X)
    + pvTail(aucY, EXIT_Y_AUCTION, X)
    + pvTail(mchY, EXIT_Y_MERCHANT, X)
    - pvTail(Array(LIFE - X).fill(opex), EXIT_Y_OPEX, 0);
  const exFlows = [-net].concat(eb.slice(0, X)); exFlows[X] += exitVal;
  const irrExit = irrOf(exFlows);
  const cumOp = eb.slice(0, X).reduce((a, b) => a + b, 0);
  const moic = (cumOp + exitVal) / net;

  const rev1 = secY[0] + aucY[0] + mchY[0];
  const securedShare = rev1 > 0 ? secY[0] / rev1 : 0;

  return {
    marketId: market.manifest.id, strategyId, exitYear: X, riskClass: 'auction-renewal',
    net, grant, capexG, eb1: eb[0], yield1: eb[0] / net,
    // capY is the union of secured + auction-renewal so charts that stack
    // "capacity vs merchant" keep working; secY/aucY expose the split.
    capY: secY.map((v, i) => v + aucY[i]), secY, aucY, mchY, eb,
    irrHold, payback, exitVal, irrExit, moic, cumOp,
    securedShare, securedYears,
    // Deliberately equal to securedShare: only executed cash flow counts as
    // contracted. Future auction clearings are market risk.
    contractedShare: securedShare,
    kwPerM: 1e6 / (net / 1000),
    note: (isLtda ? award.note : null) || e.capNote || e.grantNote || null,
  };
}

/** Runs a market under its default route to market. */
export function runBaseCase(market, exitYear){
  return runCase(market, baseStrategy(market), exitYear);
}

/**
 * Runs every market under its base strategy.
 * @returns {Map<string, object>} keyed by market id
 */
export function runAll(marketList, exitYear){
  const out = new Map();
  for (const m of marketList) out.set(m.manifest.id, runBaseCase(m, exitYear));
  return out;
}

/**
 * The full market × strategy matrix, unavailable routes flagged rather than dropped.
 * @returns {Array<{market, strategy, result}>}
 */
export function runMatrix(marketList, strategyList, exitYear){
  const rows = [];
  for (const market of marketList){
    for (const strategy of strategyList){
      rows.push({ market, strategy, result: runCase(market, strategy.id, exitYear) });
    }
  }
  return rows;
}
