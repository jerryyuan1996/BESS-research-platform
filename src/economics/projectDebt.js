/* ---------------------------------------------------------------------------
   PROJECT DEBT — what a route to market is actually worth.

   The cross-market cockpit is deliberately unlevered, and stays that way: debt
   capacity differs by market for exactly the reasons that page measures, so
   assuming a capital structure would assume the answer. See
   docs/comparison-methodology.md.

   But that leaves half the question unasked. What a capacity contract or a toll
   principally buys is *debt* — and a comparison that prices certainty only
   through a 400bp exit-yield spread understates every contracted route in the
   set. This module closes that gap at the market level, where a capital
   structure is a legitimate thing to state, rather than at the cockpit level,
   where it is not.

   The structure modelled is the one lenders described through 2026, not an
   idealised one: two tranches with different coverage tests, a legal maturity
   shorter than the asset life, and amortisation capped by the battery warranty.

       Tranche A   sized on SECURED cash flow          DSCR 1.15x
                   fully amortising
                   tenor = min(secured tenor + rollover, warranty, legal cap)

       Tranche B   sized on MARKET cash flow           DSCR 2.00x
                   mini-perm: 7-year legal maturity, 15-year notional profile,
                   balloon at maturity

   Three things this makes visible that the unlevered model cannot:

     1. ROLLOVER RISK IS NOT SYMMETRIC. `rolloverAllowance` is zero for
        auction-renewal revenue — you cannot lend against an auction nobody has
        won yet — and small even for a contract. A one-year Japanese capacity
        award and a seventeen-year Polish contract do not support the same debt,
        however similar their year-one secured share looks.

     2. TENOR MISMATCH IS A NUMBER, NOT A CAVEAT. GB's tolling precedent is ten
        years against a fifteen-year life. The refinancing point is reported,
        with the balloon outstanding at it.

     3. DEBT PER UNIT OF CONTRACTED REVENUE turns "certainty" into a metric.

   Every convention below is sourced. Margins are the weakest input and are
   flagged as such — see docs/external-view.md, gate G10.
   --------------------------------------------------------------------------- */
import { annuity, irrOf } from '../utils/finance.js';
import { LIFE } from '../comparison/assumptions.js';

/* ---------------------------------------------------------------------------
   Market conventions, 2026 vintage.

   Sourced from the BBDF 2026 finance panel, Modo's European BESS Capital
   Markets report (Q1 2026), and Société Générale's BESS financing commentary.
   Recorded in docs/external-view.md §2.4 with links.
   --------------------------------------------------------------------------- */
export const DEBT_CONVENTIONS = {
  /* Coverage. The two-tranche split with materially different tests is the
     structure the BBDF 2026 panel described: a tolled portion at ~1.15x and a
     merchant portion needing "a much larger cushion, often 2.0x". */
  dscrSecured: 1.15,
  dscrMarket: 2.00,

  /* Reported alongside, not used to size: lenders quote a P90 DSCR of 1.20-1.35x
     for well-contracted storage and materially higher for merchant. Our sizing
     runs on the P50 cash flows the engine produces, so quoting a P90 test
     against them would be a category error. */
  p90Band: [1.20, 1.35],

  /* Tenor. "7-to-10-year legal tenor hard mini-perms with an underlying notional
     tenor constrained by battery supplier warranty duration." */
  legalTenorCap: 10,
  miniPermTenor: 7,
  warrantyTenor: 10,
  notionalProfile: 15,

  /* Gearing ceilings: 60-75% contracted, 50-60% merchant. Rarely the 80-85% of
     mature solar and wind. We take the top of each band as the ceiling and let
     coverage bind first, which it usually does. */
  maxGearingSecured: 0.75,
  maxGearingMarket: 0.60,

  /* Cost of debt. SOFR was 3.65% in January 2026, down 69bp from 4.34% the
     previous August. The margin is the weakest number in this file: BESS-specific
     senior margins are not publicly quoted, and 225bp is the midpoint of a
     200-250bp assumption band, not an observation. Gate G10. */
  baseRate: 0.0365,
  margin: 0.0225,

  /* How far past the end of secured revenue a lender will lend.

     Zero for auction-renewal is the whole point: a capacity payment won one
     delivery year at a time secures one year, and no lender sizes a term loan
     against auctions that have not happened. A contracted stream gets two years
     of tail on the strength of the asset and the residual market, and a toll gets
     none — the toll IS the security, and it stops when it stops. */
  rolloverAllowance: {
    contracted: 2,
    'auction-renewal': 0,
    toll: 0,
    ltda: 2,
    merchant: 0,
  },
};

export const allInRate = (c = DEBT_CONVENTIONS) => c.baseRate + c.margin;

/** Level-payment amortisation schedule: [{ year, opening, interest, principal, service, closing }] */
function amortise(principal, rate, termYears, profileYears = termYears){
  const pmt = principal > 0 ? annuity(principal, rate, profileYears) : 0;
  const rows = [];
  let bal = principal;
  for (let y = 1; y <= termYears; y++){
    const interest = bal * rate;
    const repay = Math.min(pmt - interest, bal);
    const closing = Math.max(0, bal - repay);
    rows.push({ year: y, opening: bal, interest, principal: repay, service: pmt, closing });
    bal = closing;
  }
  return { rows, payment: pmt, balloon: bal };
}

/**
 * The debt a route to market can carry, and what it costs.
 *
 * @param {object} result   a case from comparison/engine.js (runCase output)
 * @param {object} opts
 * @param {number} opts.exitYear
 * @param {string} [opts.riskClass]  'contracted' | 'auction-renewal' | 'toll' | 'ltda' | 'merchant'
 * @param {number} [opts.securedYears]  overrides result.securedYears
 * @param {object} [opts.conventions]
 * @returns {object|null} null when the case is unavailable
 */
export function sizeProjectDebt(result, opts = {}){
  if (!result || result.na) return null;
  const c = { ...DEBT_CONVENTIONS, ...(opts.conventions || {}) };
  const r = allInRate(c);

  const life = result.eb?.length || LIFE;
  const securedYears = Math.max(0, Math.min(opts.securedYears ?? result.securedYears ?? 0, life));
  const riskClass = opts.riskClass || (securedYears > 0 ? 'contracted' : 'merchant');
  const rollover = c.rolloverAllowance[riskClass] ?? 0;

  /* Split each year's cash flow into the part a lender will treat as secured and
     the part it will not.

     Opex is allocated PRO RATA to revenue rather than charged wholly against the
     secured leg. Charging it all to the secured leg is the stricter test — it
     asks whether contracted revenue alone would service the asset — but it is
     the wrong test for a two-tranche structure on a single asset, and it
     produces an artefact: a market whose capacity payment is a small share of
     revenue has its entire contracted tranche wiped out by an allocation choice
     rather than by anything about the contract. GB, where the Capacity Market is
     roughly a tenth of the stack, is exactly that case. */
  const secY = result.secY || result.capY || [];
  const mchY = result.mchY || [];
  const opexY = (result.eb || []).map((_, i) =>
    (secY[i] || 0) + (mchY[i] || 0) - (result.eb[i] || 0));

  const securedCfads = [], marketCfads = [];
  for (let i = 0; i < life; i++){
    const isSecured = i < securedYears;
    const sec = isSecured ? (secY[i] || 0) : 0;
    const gross = (secY[i] || 0) + (mchY[i] || 0);
    const share = gross > 0 ? sec / gross : 0;
    const opex = opexY[i] || 0;
    securedCfads.push(Math.max(0, sec - opex * share));
    marketCfads.push(Math.max(0, (result.eb[i] || 0) - (sec - opex * share)));
  }

  /* ---- Tranche A: against secured cash flow ------------------------------ */
  const tenorA = Math.min(
    securedYears + rollover,
    c.warrantyTenor,
    c.legalTenorCap,
    life);
  let amountA = 0;
  if (tenorA > 0){
    const window = securedCfads.slice(0, tenorA).filter(v => v > 0);
    const binding = window.length === tenorA ? Math.min(...window) : 0;
    const capacity = binding / c.dscrSecured;
    amountA = capacity > 0 ? capacity * (1 - Math.pow(1 + r, -tenorA)) / r : 0;
  }

  /* ---- Tranche B: mini-perm against market cash flow --------------------- */
  const tenorB = Math.min(c.miniPermTenor, life);
  const windowB = marketCfads.slice(0, tenorB);
  const bindingB = windowB.length ? Math.min(...windowB) : 0;
  const capacityB = Math.max(0, bindingB) / c.dscrMarket;
  const amountB = capacityB > 0
    ? capacityB * (1 - Math.pow(1 + r, -c.notionalProfile)) / r
    : 0;

  /* ---- Gearing ceiling --------------------------------------------------- */
  const net = result.net;
  const ceiling = (securedYears > 0 ? c.maxGearingSecured : c.maxGearingMarket) * net;
  let debtA = amountA, debtB = amountB;
  let ceilingBinds = false;
  if (debtA + debtB > ceiling){
    ceilingBinds = true;
    const scale = ceiling / (debtA + debtB);
    debtA *= scale; debtB *= scale;
  }

  const schedA = amortise(debtA, r, tenorA, tenorA);
  const schedB = amortise(debtB, r, tenorB, c.notionalProfile);

  /* ---- Combined service, coverage and equity ----------------------------- */
  const service = [], dscr = [], outstanding = [];
  for (let y = 1; y <= life; y++){
    const a = schedA.rows[y - 1]?.service || 0;
    const b = schedB.rows[y - 1]?.service || 0;
    const s = a + b;
    service.push(s);
    dscr.push(s > 0 ? (result.eb[y - 1] || 0) / s : null);
    outstanding.push((schedA.rows[y - 1]?.closing ?? 0) + (schedB.rows[y - 1]?.closing ?? 0));
  }

  const totalDebt = debtA + debtB;
  const equity = net - totalDebt;
  const X = Math.min(opts.exitYear ?? life, life);

  const equityFlows = [-equity];
  for (let y = 1; y <= X; y++) equityFlows.push((result.eb[y - 1] || 0) - service[y - 1]);
  equityFlows[X] += (result.exitVal || 0) - (outstanding[X - 1] || 0);
  const irrLevered = equity > 0 ? irrOf(equityFlows) : null;

  const holdFlows = [-equity];
  for (let y = 1; y <= life; y++) holdFlows.push((result.eb[y - 1] || 0) - service[y - 1]);
  const irrLeveredHold = equity > 0 ? irrOf(holdFlows) : null;

  const covered = dscr.filter(v => v != null);
  const rev1 = (result.eb?.[0] ?? 0) + (opexY[0] || 0);

  return {
    riskClass, rate: r, baseRate: c.baseRate, margin: c.margin,
    securedYears, rolloverAllowance: rollover,

    trancheA: {
      amount: debtA, tenor: tenorA, dscr: c.dscrSecured,
      payment: schedA.payment, balloon: 0, amortising: true,
    },
    trancheB: {
      amount: debtB, tenor: tenorB, dscr: c.dscrMarket,
      payment: schedB.payment, balloon: schedB.balloon,
      amortising: false, profile: c.notionalProfile,
    },

    totalDebt, equity, gearing: net > 0 ? totalDebt / net : 0,
    ceilingBinds,
    coverageBinds: !ceilingBinds && totalDebt > 0,

    service, dscr, outstanding,
    minDSCR: covered.length ? Math.min(...covered) : null,

    /* Where the structure has to be refinanced, and how much is outstanding
       there. A balloon at year 7 against a toll that runs to year 10 is a
       different risk from a balloon at year 7 against merchant revenue. */
    refinanceYear: schedB.balloon > 0 ? tenorB : null,
    balloon: schedB.balloon,
    merchantTailFrom: securedYears > 0 && securedYears < life ? securedYears + 1 : null,

    irrLevered, irrLeveredHold,
    irrUnlevered: result.irrExit, irrUnleveredHold: result.irrHold,

    /* THE METRIC THE UNLEVERED COMPARISON CANNOT PRODUCE.

       `securedDebtShare` is the fraction of senior debt standing on contracted
       cash flow rather than on a merchant forecast. It is what "certainty"
       actually buys, stated as a number, and it separates markets that the
       year-one secured share cannot: two assets can both look 40% contracted
       and finance completely differently once tenor and coverage are applied.

       `debtPerSecuredUnit` is the multiple of year-one secured revenue the
       contracted tranche advances — largely the annuity factor at the coverage
       test, so it varies far less across markets. Kept because it is the
       intuitive form of the question, but read the share first. */
    securedDebtShare: totalDebt > 0 ? debtA / totalDebt : 0,
    debtPerSecuredUnit: (secY[0] || 0) > 0 ? debtA / secY[0] : null,
    debtYearsOfRevenue: rev1 > 0 ? totalDebt / rev1 : null,
    securedShareOfRevenue: rev1 > 0 ? (secY[0] || 0) / rev1 : 0,
  };
}

/**
 * Sizing for one market under one route, ready for display.
 * Resolves the risk class from the market's declared economics rather than
 * guessing it from whether a number happens to be non-zero.
 */
export function riskClassFor(market, strategyId){
  const e = market?.comparison?.economics || {};
  if (strategyId === 'toll') return 'toll';
  if (strategyId === 'ltda') return 'ltda';
  if (strategyId === 'mer') return 'merchant';
  if (e.riskClass === 'auction-renewal') return 'auction-renewal';
  return e.contracted ? 'contracted' : 'merchant';
}
