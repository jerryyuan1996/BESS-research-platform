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
  LIFE, EXIT_Y_CONTRACTED, EXIT_Y_MERCHANT, EXIT_Y_OPEX, EXIT_Y_AUCTION,
} from './assumptions.js';
import { servicesFactor } from './capacityLine.js';
import { strategyById, supports, baseStrategy } from './strategies.js';
import { buildCapex, rtbEntry, capitalFlows } from './capex.js';
import { activeFxRate } from './fx.js';
import { decorateDecisionResult } from './decisionResult.js';
import { investmentFlows } from '../economics/cashFlowCalendar.js';
import { cisRevenue } from '../economics/revenueSupport.js';

/* ---------------------------------------------------------------------------
   WHY AN IRR IS ABSENT.

   `irrOf` returns null in two situations that mean completely different things,
   and until ERCOT arrived the platform rendered both as an em dash.

     NOT APPLICABLE   the route does not exist in this market. Callers already
                      branch on `.na` for this and must keep doing so.
     NO SOLUTION      the route exists, the case was computed in full, and there
                      is no discount rate at which the cash flows return the
                      capital. That is not missing data — it is a result, and it
                      is the most important thing the model can say about a
                      project whose lifetime receipts never reach its cost.

   A dash implies the first. Publishing it for the second hides a finding behind
   what looks like a gap in the data, so the engine says which one it is and the
   formatter prints "N/M — no positive IRR solution" rather than nothing.

   The condition is diagnosed from the cash flows rather than guessed: an IRR
   exists only where the undiscounted flows change sign, so a case whose total
   receipts fall short of its capital has no root to find. Where the shortfall is
   compounded by an operating loss late in life — merchant revenue below fixed
   opex once a toll expires, which is exactly the ERCOT case — the bisection
   cannot bracket a root at all, because both ends of the interval are negative.
   MOIC survives in every one of these cases and is the number to read instead.
   --------------------------------------------------------------------------- */
function irrDiagnosis(irr, flows, netCapital){
  if (irr != null) return null;
  const receipts = flows.reduce((a, v) => a + v, 0);
  const lossYears = flows.reduce((n, v) => n + (v < 0 ? 1 : 0), 0);
  return {
    reason: 'no-solution',
    /* Stated as multiples rather than currency so the note reads the same in
       every market and needs no FX. */
    recovered: netCapital > 0 ? receipts / netCapital : null,
    operatingLossYears: lossYears,
    note: [
      lossYears > 0
        ? 'Lifetime receipts do not return the capital, and ' + lossYears + ' of the modelled years run an operating loss — merchant revenue below fixed opex. No discount rate solves the cash flows, so no IRR exists to report. Read MOIC instead.'
        : 'Lifetime receipts do not return the capital, so no discount rate solves the cash flows and no IRR exists to report. Read MOIC instead.',
      lossYears > 0
        ? '全生命周期现金流入不足以收回投资，且其中' + lossYears + '个建模年度出现经营亏损 — 市场化收入低于固定运维成本。不存在可使现金流平衡的折现率，因此无IRR可供列示。请改看MOIC。'
        : '全生命周期现金流入不足以收回投资，因此不存在可使现金流平衡的折现率，无IRR可供列示。请改看MOIC。',
    ],
  };
}

/**
 * The capital side of a case: what is spent, when, and what the ratios divide by.
 *
 * Shared by both engine paths because they price capital identically — only the
 * revenue model differs between them. Returns the legacy single-outflow shape
 * unless the market declares a stack, an RTB premium or a construction period.
 */
function capitalOf(market, e, fx){
  const hours = market.comparison.archetype?.durationHours;
  const raw = buildCapex(e.capexStack, hours);

  /* `capexPerMW` stays the authority and the stack describes its composition,
     never replaces it. That ordering matters for more than tidiness: the
     Investment Lab reprices a scenario by overriding `capexPerMW`, and a market's
     grant ceilings are tested against a deliberately dearer build. If the stack
     won, both would silently stop working — a cheaper capex would produce the
     same IRR, which is exactly the bug this comment exists to prevent.

     Where the two disagree the parts are scaled to the authoritative total, so a
     component breakdown always sums to the number on the card. */
  const buildPerMW = e.capexPerMW != null ? e.capexPerMW : (raw ? raw.total : 0);
  const k = raw && raw.total > 0 ? buildPerMW / raw.total : 1;
  const stack = raw
    ? { total: buildPerMW, parts: Object.fromEntries(Object.entries(raw.parts).map(([n, v]) => [n, v * k])) }
    : null;

  /* A capital grant is a contribution to the project's construction cost, so it
     is taken against build capex and never against the price paid for the
     development — a grant does not subsidise a developer's margin. */
  const grant = grantForMW(e, market.comparison.archetype, buildPerMW) * fx;
  const entry = rtbEntry(e, buildPerMW);
  const gridContribution = e.gridContributionPerMW || 0;
  const taxTariff = buildPerMW * (e.taxTariffPct || 0) / 100;
  const addedCapital = gridContribution + taxTariff;
  if (stack){
    stack.parts.gridContribution = gridContribution;
    stack.parts.taxTariff = taxTariff;
    stack.total += addedCapital;
  }
  const capexG = (buildPerMW + addedCapital + entry.rtbPrice) * fx;
  const entryNet = capexG - grant;

  /* VAT is charged on the construction supply. The RTB price is excluded: an RTB
     project changes hands as a company far more often than as an asset, and the
     two are taxed differently — assuming the asset case would overstate the
     charge in most trades. */
  const { flows, codOffset, vatDrag } = capitalFlows(e, entryNet, (buildPerMW + addedCapital) * fx);

  return {
    flows, codOffset, grant, capexG, stack,
    devCost: entry.devCost * fx,
    rtbPrice: entry.rtbPrice * fx,
    buildCapexG: (buildPerMW + addedCapital) * fx,
    net: entryNet + vatDrag,
  };
}


/* `merchantCurve` is the arbitrage line's dated path, as `servicesCurve` is the
   services line's: multipliers by operating year, index 0 = year 1, holding
   the last value. The seed is the year-1 level and the curve is what the
   fleet does to it afterwards (src/comparison/vintage.js). Absent, it is 1,
   so every market without one is unchanged and the baseline stays pinned.
   Romania and Poland carry one (docs/merchant-lines-plan-2026-10.md). */
const yearFactor = (options, name, year, fallback = 1) => {
  const curve = options?.[name + 'Factors'];
  if (Array.isArray(curve) && Number.isFinite(curve[year - 1])) return curve[year - 1];
  const flat = options?.[name + 'Factor'];
  return Number.isFinite(flat) ? flat : fallback;
};

/* Exported for the design-fit sweep (src/comparison/designFit.js), which tests a
   scheme's duration floor against the same fade the revenue line already takes.
   One definition, so the floor test and the cash flows can never disagree about
   how fast a battery loses energy. */
export const degradationFactor = (e, year) => {
  const curve = e.warrantyDegradationCurve;
  if (Array.isArray(curve) && Number.isFinite(curve[year - 1])){
    const value = curve[year - 1];
    return value > 1 ? value / 100 : Math.max(0, value);
  }
  return Math.pow(1 - (e.degr || 2) / 100, year - 1);
};

/* ---------------------------------------------------------------------------
   The service package — warranty extension, preventive maintenance and the RTE
   and availability guarantees, paid yearly (the analyst's 2026-10-12 default).

   A market that declares `serviceSchedulePerMW` carries it as its own line,
   year by year, in native currency per MW in real terms; `opexPerMW` is then
   the rest of fixed opex. The schedule is back-loaded — the warranty starts in
   year 6 and steps up every five years — so a flat seed of the same fifteen-
   year sum would have charged it too early. Absent, the line is zero and every
   pinned case is unchanged.
   --------------------------------------------------------------------------- */
export function serviceCostPerMW(e, year){
  const s = e.serviceSchedulePerMW;
  if (!Array.isArray(s) || !s.length) return 0;
  const v = s[Math.min(year, s.length) - 1];
  return Number.isFinite(v) ? v : 0;
}

/** Fixed opex as a flat seed would state it: the rest of opex plus the package's LIFE-year mean. */
export function opexSeedPerMW(e){
  let sum = 0;
  for (let y = 1; y <= LIFE; y++) sum += serviceCostPerMW(e, y);
  return (e.opexPerMW || 0) + sum / LIFE;
}

function lifecycleCost(e, capexG, fx, year){
  let cost = 0;
  for (const item of e.augmentationSchedule || []){
    if (item?.year !== year) continue;
    if (Number.isFinite(item.amountPerMW)) cost += item.amountPerMW * fx;
    if (Number.isFinite(item.pctOfCapex)) cost += capexG * item.pctOfCapex / 100;
  }
  if (year === LIFE && Number.isFinite(e.decommissioningPerMW)){
    cost += e.decommissioningPerMW * fx;
  }
  return cost;
}
/**
 * Lay operating cash flow after the build, and return the full vector.
 *
 * With no construction period `codOffset` is 0 and this reproduces
 * `[-net].concat(op)` exactly, which is what the pinned baseline asserts.
 */
/**
 * Re-price capital once the strategy has settled the grant.
 *
 * Tolls and competitively-bid awards zero the grant — support counted twice
 * otherwise — and that changes the amount financed, so the spend profile has to
 * be rebuilt rather than scaled.
 */
function capitalWithGrant(cap, grant, e){
  const entryNet = cap.capexG - grant;
  const { flows, codOffset, vatDrag } = capitalFlows(e, entryNet, cap.buildCapexG);
  return { ...cap, grant, flows, codOffset, net: entryNet + vatDrag };
}

function withCapital(cap, op, tail){
  return investmentFlows(cap.flows, cap.codOffset, op, tail);
}

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
export function runCase(market, strategyId, exitYear, options = {}){
  const cmp = market && market.comparison;
  if (!cmp || !cmp.economics) return { na: ['Economics unavailable', '经济性数据不可用'] };

  // A market may be registered before its normalized inputs are complete. It still
  // gets a card and a dashboard; it stays out of the numeric comparison until the
  // inputs pass their quality gates.
  if (cmp.engineReady === false){
    return { na: ['Normalized inputs pending', '归一化输入待补'] };
  }

  // Recompute the duration credit when a downside case changes degradation.
  // The saved design context retains the rule as well as its annual factors.
  if(options.capacityFloor){
    const {hours,requiredHours}=options.capacityFloor;
    const atCod=Math.min(1,hours/requiredHours);
    if(!(hours>0 && requiredHours>0 && atCod>0))return {na:['Invalid capacity duration floor','容量时长下限无效']};
    options={...options,capacityFactors:Array.from({length:LIFE},(_,i)=>
      Math.min(1,hours*degradationFactor(cmp.economics,i+1)/requiredHours)/atCod)};
  }

  const strat = strategyById(strategyId);
  if (!strat) return { na: ['Unknown strategy', '未知策略'] };
  if (!supports(market, strategyId)) return { na: strat.na };

  const raw = cmp.economics.riskClass === 'auction-renewal'
    ? runAuctionRenewalCase(market, strategyId, exitYear, options)
    : runLegacyCase(market, strategyId, exitYear, options);
  return decorateDecisionResult(market, strategyId, raw);
}

/* The original model, unchanged. Two revenue streams: a contracted line that runs
   for contractYears then steps down by postFactor, and a degrading merchant line.
   Every pre-Japan market uses this path and its outputs are pinned by
   tests/baseline.test.js against the legacy prototype. */
function runLegacyCase(market, strategyId, exitYear, options){
  const e = market.comparison.economics;
  const fx = activeFxRate(market.manifest.currency, options.fxRates);
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
  const cap0 = capitalOf(market, e, fx);
  let grant = cap0.grant;
  const capexG = cap0.capexG, opex = e.opexPerMW * fx;

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
    /* A FLOOR, not a toll (`tollIsFloor`). An optimiser or offtaker floor pays
       the owner at least `toll` a year for its tenor and leaves the market
       revenue above it with the owner, so the year's revenue is the larger of
       the two. The floor is the secured line and only the excess is market
       revenue — which is how the secured share counts a floor at its own level
       (the analyst's ruling of 2026-10-10, src/governance/investability.js).
       A grant is not zeroed: a floor is a hedge bought from an optimiser, not
       support from the state. */
    if (e.tollIsFloor){ marketFrom = 1; grant = cap0.grant; }
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
    const retention = award.cis ? 1 : (award.merchantRetention ?? 1);
    merch *= retention;
    svc *= retention;
    /* An award is competitively bid against the bidder's own costs. Stacking a
       capital grant on top would let a market claim support twice. */
    if (award.excludesGrant) grant = 0;
    note = award.note || null;
  }

  const capital = capitalWithGrant(cap0, grant, e);
  const net = capital.net;
  const capY = [], secY = [], aucY = [], mchY = [], svcY = [], eb = [];
  for (let y = 1; y <= LIFE; y++){
    /* `capacityFactors` is how the design-fit sweep carries a duration floor that
       de-rates linearly as the battery fades (WA's ESR requirement). Absent, the
       factor is exactly 1 and the line is the one the baseline pins. */
    let c = ((y <= cy ? cap : cap * post) + (y <= cyB ? capB : 0)) * yearFactor(options, 'capacity', y);
    let secured = ((y <= cy ? cap : 0) + (y <= cyB ? capB : 0)) * yearFactor(options, 'capacity', y);
    const d = degradationFactor(e, y);
    let mm = y >= marketFrom
      ? (merch * servicesFactor(e.merchantCurve, y) + svc * servicesFactor(e.servicesCurve, y)) * d * yearFactor(options, 'merchant', y)
      : 0;
    if (strategyId === 'toll' && e.tollIsFloor && y <= cy) mm = Math.max(0, mm - c);
    if(strategyId==='ltda' && e.ltda?.cis){
      // CIS is a contingent top-up and revenue share, not a fixed fee plus 10%.
      const terms=e.ltda.cis;
      if(y<=cy){
        const settled=cisRevenue(mm/fx,terms);
        c=secured=settled.secured*fx;
        mm=settled.total*fx-c;
      }else c=secured=0;
    }
    secY.push(secured);aucY.push(c-secured);
    const sv = serviceCostPerMW(e, y) * fx;
    capY.push(c); mchY.push(mm); svcY.push(sv); eb.push(c + mm - opex - sv - lifecycleCost(e, capexG, fx, y));
  }

  const holdFlows = withCapital(capital, eb);
  const irrHold = irrOf(holdFlows);
  let cum = -net, payback = null;
  for (let y = 1; y <= LIFE; y++){ cum += eb[y - 1]; if (cum >= 0 && payback == null) payback = y; }

  const X = exitYear;
  const yContracted = options.exitYContracted ?? EXIT_Y_CONTRACTED;
  const yAuction = options.exitYAuction ?? options.exitYMerchant ?? EXIT_Y_AUCTION;
  const yMerchant = options.exitYMerchant ?? EXIT_Y_MERCHANT;
  const yOpex = options.exitYOpex ?? EXIT_Y_OPEX;
  const exitVal = pvTail(secY, yContracted, X) + pvTail(aucY, yAuction, X) + pvTail(mchY, yMerchant, X)
    - pvTail(Array(LIFE - X).fill(opex), yOpex, 0) - pvTail(svcY, yOpex, X);
  const exitFlows = withCapital(capital, eb.slice(0, X), { at: X, value: exitVal });
  const irrExit = irrOf(exitFlows);
  const cumOp = eb.slice(0, X).reduce((a, b) => a + b, 0);
  const moic = (cumOp + exitVal) / net;
  const contractedShare = eb[0] > 0 ? capY[0] / (capY[0] + mchY[0]) : 0;

  return {
    marketId: market.manifest.id, strategyId, exitYear: X,
    net, grant: capital.grant, capexG, eb1: eb[0], yield1: eb[0] / net, capY, secY, aucY, mchY, svcY, eb,
    irrHold, payback, exitVal, irrExit, moic, cumOp, contractedShare,
    irrHoldAbsent: irrDiagnosis(irrHold, eb, net),
    irrExitAbsent: irrDiagnosis(irrExit, eb.slice(0, X).concat(exitVal), net),
    // Capital detail, for the Lab and the capex waterfall. Null-safe: a market
    // with no stack reports no parts rather than a fabricated split.
    capexParts: capital.stack ? capital.stack.parts : null,
    buildCapexG: capital.buildCapexG, devCost: capital.devCost, rtbPrice: capital.rtbPrice,
    constructionMonths: e.constructionMonths || 0, codOffset: capital.codOffset,
    holdFlows, exitFlows, capitalFlows:capital.flows.slice(), fxRate:fx, currency:market.manifest.currency,
    valuationRates: { secured:yContracted, renewal:yAuction, merchant:yMerchant, opex:yOpex },
    exitClock:'operating-years', renewalEvidence:'unawarded-assumption',
    // In the legacy model every contracted unit is secured for its full tenor, so
    // secured share and secured tenor are just the contracted figures renamed.
    securedShare: contractedShare,
    securedYears: strategyId === 'cap' ? Math.min(e.contractYears || 0, LIFE)
      : strategyId === 'toll' ? cy
      : strategyId === 'ltda' ? Math.min(e.ltda?.years || 0, LIFE) : 0,
    kwPerM: 1e6 / (net / 1000), note,
    streamTenors: { primary:cy, additionalCapacity:cyB },
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
function runAuctionRenewalCase(market, strategyId, exitYear, options){
  const e = market.comparison.economics;
  const fx = activeFxRate(market.manifest.currency, options.fxRates);
  if (fx == null) return { na: ['No FX rate for ' + market.manifest.currency, '缺少' + market.manifest.currency + '汇率'] };

  const capital = capitalOf(market, e, fx);
  const capexG = capital.capexG;
  const opex = e.opexPerMW * fx;
  const grant = capital.grant;
  const net = capital.net;

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

  const secY = [], aucY = [], mchY = [], svcY = [], eb = [];
  for (let y = 1; y <= LIFE; y++){
    const capF = yearFactor(options, 'capacity', y);    // 1 unless the design-fit sweep sets it
    const s = (y <= securedYears ? secured : 0) * capF;
    const a = y > securedYears
      ? ((curve[y - securedYears - 1] ?? 0) * fx * yearFactor(options, 'auction', y,
        yearFactor(options, 'merchant', y))) * capF : 0;
    const d = degradationFactor(e, y);
    const m = (merch * servicesFactor(e.merchantCurve, y) + svc * servicesFactor(e.servicesCurve, y)) * d * yearFactor(options, 'merchant', y);
    const sv = serviceCostPerMW(e, y) * fx;
    secY.push(s); aucY.push(a); mchY.push(m); svcY.push(sv);
    eb.push(s + a + m - opex - sv - lifecycleCost(e, capexG, fx, y));
  }

  const holdFlows = withCapital(capital, eb);
  const irrHold = irrOf(holdFlows);
  let cum = -net, payback = null;
  for (let y = 1; y <= LIFE; y++){ cum += eb[y - 1]; if (cum >= 0 && payback == null) payback = y; }

  const X = exitYear;
  const yContracted = options.exitYContracted ?? EXIT_Y_CONTRACTED;
  const yAuction = options.exitYAuction ?? options.exitYMerchant ?? EXIT_Y_AUCTION;
  const yMerchant = options.exitYMerchant ?? EXIT_Y_MERCHANT;
  const yOpex = options.exitYOpex ?? EXIT_Y_OPEX;
  const exitVal = pvTail(secY, yContracted, X)
    + pvTail(aucY, yAuction, X)
    + pvTail(mchY, yMerchant, X)
    - pvTail(Array(LIFE - X).fill(opex), yOpex, 0)
    - pvTail(svcY, yOpex, X);
  const exitFlows = withCapital(capital, eb.slice(0, X), { at: X, value: exitVal });
  const irrExit = irrOf(exitFlows);
  const cumOp = eb.slice(0, X).reduce((a, b) => a + b, 0);
  const moic = (cumOp + exitVal) / net;

  const rev1 = secY[0] + aucY[0] + mchY[0];
  const securedShare = rev1 > 0 ? secY[0] / rev1 : 0;

  return {
    marketId: market.manifest.id, strategyId, exitYear: X, riskClass: 'auction-renewal',
    net, grant, capexG, eb1: eb[0], yield1: eb[0] / net,
    // capY is the union of secured + auction-renewal so charts that stack
    // "capacity vs merchant" keep working; secY/aucY expose the split.
    capY: secY.map((v, i) => v + aucY[i]), secY, aucY, mchY, svcY, eb,
    irrHold, payback, exitVal, irrExit, moic, cumOp,
    irrHoldAbsent: irrDiagnosis(irrHold, eb, net),
    irrExitAbsent: irrDiagnosis(irrExit, eb.slice(0, X).concat(exitVal), net),
    securedShare, securedYears,
    // Deliberately equal to securedShare: only executed cash flow counts as
    // contracted. Future auction clearings are market risk.
    contractedShare: securedShare,
    capexParts: capital.stack ? capital.stack.parts : null,
    buildCapexG: capital.buildCapexG, devCost: capital.devCost, rtbPrice: capital.rtbPrice,
    constructionMonths: e.constructionMonths || 0, codOffset: capital.codOffset,
    holdFlows, exitFlows, capitalFlows:capital.flows.slice(), fxRate:fx, currency:market.manifest.currency,
    valuationRates: { secured:yContracted, renewal:yAuction, merchant:yMerchant, opex:yOpex },
    exitClock:'operating-years', renewalEvidence:'unawarded-assumption',
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
