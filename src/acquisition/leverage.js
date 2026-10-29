import { LEVERAGE, LEVERED_PREMIUM, RATE_SNAPSHOT, FEES } from './parameters.js';
import { nominalAnnual, taxSchedule } from './cashflows.js';
import { acquisitionCashFlows } from './valuation.js';

/* ---------------------------------------------------------------------------
   LEVERED EQUITY RETURN, beside the all-cash one.

   The headline acquisition case stays all-cash: the validation rule that keeps
   pre-operation debt out of it is untouched. This module takes that case's own
   hold cash flows and adds one project loan drawn at COD, sized the way lenders
   sized storage in 2026 (parameters.js LEVERAGE):

     service_t = contracted cash_t / DSCR(contract) + merchant cash_t / 2.00

   Contracted cash is the after-tax operating cash in proportion to the year's
   secured revenue, inside the contract's term. The legal maturity is the
   contract tenor where it runs seven years or more (max 18), else a 7-year
   mini-perm. The notional profile is the longest (up to 15 years, or the
   contract tenor if longer) that still repays 60% by legal maturity. Equity
   repays any balloon (the platform's approved policy). Interest is deducted
   inside the same tax account as the all-cash case.
   --------------------------------------------------------------------------- */

const cashOf = y => y.secured + y.renewal + y.merchant - y.opex - y.capex - y.tax;

/** Contracted coverage by contract quality. Null for no contracted cash. */
export function contractedDSCR(kind, years){
  if (kind === 'merchant' || !(years > 0)) return null;
  if (years < LEVERAGE.shortContractYears || kind === 'floor' || kind === 'collar') return LEVERAGE.dscr.floor;
  if (kind === 'fixed') return LEVERAGE.dscr.toll;
  return LEVERAGE.dscr.state;
}

/** Debt sized at COD on the operating scenario's after-tax cash. Per MW, cash-flow currency. */
export function sizeLeverage(input, buildBudget, terms, price = 0){
  const s = input.scenarios.find(x => x.operates);
  if (!s || !(buildBudget > 0)) return null;
  // Lenders size on the project's own tax: a sponsor's group relief is not CFADS.
  const own = input.taxPolicy?.groupRelief ? { ...input, taxPolicy:{ ...input.taxPolicy, groupRelief:false } } : input;
  const pre = taxSchedule(own, nominalAnnual(own, s), s, price).annual, life = pre.length;
  const base = RATE_SNAPSHOT[input.currency].rate;
  const dscrC = contractedDSCR(terms?.kind, terms?.remainingContractYears);
  const contractYears = Math.min(terms?.remainingContractYears || 0, LEVERAGE.maxLegalYears);
  const legal = Math.min(Math.max(LEVERAGE.miniPermYears, dscrC ? contractYears : 0), life - 2);
  if (!(legal > 0)) return null;
  const service = [], contractedWeight = [];
  for (let t = 0; t < life; t++){
    const y = pre[t], revenue = y.secured + y.renewal + y.merchant, cash = Math.max(0, cashOf(y));
    const share = revenue > 0 && dscrC && t < contractYears ? y.secured / revenue : 0;
    const c = dscrC ? cash * share / dscrC : 0, m = cash * (1 - share) / LEVERAGE.dscr.merchant;
    service.push(c + m); contractedWeight.push(c + m > 0 ? c / (c + m) : 0);
  }
  const rate = t => base + LEVERAGE.margin.contracted * contractedWeight[t] + LEVERAGE.margin.merchant * (1 - contractedWeight[t]);
  let best = null;
  for (let n = Math.min(Math.max(legal, LEVERAGE.notionalYears), life - 2); n >= legal && !best; n--){
    let loan = 0, discount = 1;
    for (let t = 0; t < n; t++){ discount /= 1 + rate(t); loan += service[t] * discount; }
    let balance = loan;
    for (let t = 0; t < legal; t++) balance = balance * (1 + rate(t)) - service[t];
    if (balance <= (1 - LEVERAGE.minRepaid) * loan + 1e-9) best = { notional:n, loan };
  }
  if (!best || !(best.loan > 0)) return null;
  const y1 = pre[0], r1 = y1.secured + y1.renewal + y1.merchant;
  const contracted = r1 > 0 && y1.secured / r1 >= .5;
  const capShare = contracted ? LEVERAGE.gearingCap.contracted : LEVERAGE.gearingCap.merchant;
  const k = best.loan > capShare * buildBudget ? capShare * buildBudget / best.loan : 1;
  const loan = best.loan * k, payments = [], balloons = [], interest = [];
  let balance = loan;
  for (let t = 0; t < life; t++){
    const i = t < legal ? balance * rate(t) : 0, pay = t < legal ? Math.min(service[t] * k, balance + i) : 0;
    balance = Math.max(0, balance + i - pay);
    const balloon = t === legal - 1 ? balance : 0;
    if (balloon) balance = 0;
    payments.push(pay); balloons.push(balloon); interest.push(i);
  }
  const covered = pre.map((y, t) => payments[t] > 0 ? cashOf(y) / payments[t] : null).filter(Number.isFinite);
  return { loanPerMW:loan, gearing:loan / buildBudget, contractedDSCR:dscrC, merchantDSCR:LEVERAGE.dscr.merchant,
    legalYears:legal, notionalYears:best.notional, rate:rate(0), capShare, capBinds:k < 1,
    minCover:covered.length ? Math.min(...covered) : null, balloonShare:balloons[legal - 1] / loan,
    payments, balloons, interest, fee:loan * FEES.financing, reserve:(payments[0] ?? 0) * FEES.reserveMonths / 12 };
}

function fallingRoot(flows){
  const f = r => flows.reduce((sum, c) => sum + c.amount / (1 + r) ** c.at, 0);
  const brackets = []; let a = -.9, fa = f(a);
  for (let step = 1; step <= 180; step++){
    const b = -.9 + step * .025, fb = f(b);
    if (Number.isFinite(fa) && Number.isFinite(fb) && fa >= 0 && fb < 0) brackets.push([a, b]);
    a = b; fa = fb;
  }
  if (brackets.length !== 1) return null;
  let [lo, hi] = brackets[0], fl = f(lo);
  for (let i = 0; i < 65; i++){ const mid = (lo + hi) / 2, fm = f(mid); if ((fl >= 0) === (fm >= 0)){ lo = mid; fl = fm; } else hi = mid; }
  return (lo + hi) / 2;
}

/** Levered equity IRR on the hold route at a supplied price, with the debt facts beside it. */
export function leveredReturn(input, investor, price, { buildBudget, terms }){
  // One operating outcome only (RTB). Weighted development outcomes are not levered.
  if (input?.stage === 'operating' || input?.scenarios?.filter(x => x.operates).length !== 1) return null;
  const debt = sizeLeverage(input, buildBudget, terms, price);
  if (!debt) return null;
  const s = input.scenarios.find(x => x.operates), cod = s.codYears;
  const flows = acquisitionCashFlows(input, investor, 'hold', price).flows.map(f => ({ ...f }));
  const unlevered = taxSchedule(input, nominalAnnual(input, s), s, price).annual;
  const levered = taxSchedule(input, nominalAnnual(input, s), s, price, debt.interest).annual;
  const weight = s.probability;
  flows.push({ at:cod, amount:(debt.loanPerMW - debt.fee - debt.reserve) * weight });
  levered.forEach((y, t) => flows.push({ at:cod + t + 1, amount:weight * (cashOf(y) - cashOf(unlevered[t])
    - debt.payments[t] - debt.balloons[t] + (t === debt.legalYears - 1 ? debt.reserve : 0)) }));
  const { payments, balloons, interest, ...facts } = debt;
  return { annualReturn:fallingRoot(flows), ...facts };
}

/** Two layers: all-equity against all-equity, levered against levered. */
export function targetTest(allEquity, levered, target){
  const leveredTarget = Number.isFinite(target) ? target + LEVERED_PREMIUM : null;
  const basis = Number.isFinite(allEquity) && allEquity >= target ? 'all-equity'
    : Number.isFinite(levered) && levered >= leveredTarget ? 'levered' : 'neither';
  return { basis, meets:basis !== 'neither', target, leveredTarget };
}
