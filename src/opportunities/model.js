import { referenceInputs } from '../acquisition/reference.js';
import { valueAcquisition, returnAtAcquisitionPrice, acquisitionCashFlows } from '../acquisition/valuation.js';
import { FEES } from '../acquisition/parameters.js';
import { baseStrategy, supports } from '../comparison/strategies.js';
import { ARCHETYPES } from '../governance/archetypes.js';
import { referenceInvestment, evaluateInvestment, pricingOptions } from './investment.js';

const pv = (flows, rate) => flows.reduce((sum, c) => sum + c.amount / (1 + rate) ** c.at, 0);
const routes = input => input.stage === 'operating' ? ['hold'] : ['hold','sale'];
const baseReference = (market, stage, options) => referenceInputs(market, stage, options).find(c => c.key === 'base');
/* The signed network line comes in two parts. Fixed access and demand charges
   do not follow throughput, so they stay flat. Energy-band charges and credits
   follow throughput, so the engine degrades them like the reserve line. */
const distributionBounds = { lossFactor:[.80,1.10], servicesShare:[0,1], routeFeePct:[0,30],
  networkFlatPerMW:[-200000,200000], networkDispatchPerMW:[-200000,200000] };
/** Why a comparison could not be priced, in English and Simplified Chinese.
 * `unavailable` stays the English text; `field` names an out-of-range input. */
const fail = (en, zh, field = null) => ({ unavailable:en, reason:[en, zh], ...(field ? { field } : {}) });

function monthsToCod(opportunity, stage, conventionalMonths) {
  if (opportunity.kind === 'award') return conventionalMonths;
  if (opportunity.kind === 'small' && stage === 'ready-to-build') {
    return opportunity.rtbTiming === 'same' ? conventionalMonths : opportunity.rtbToCodMonths ?? conventionalMonths;
  }
  const [first,last] = opportunity.siteControlMonths ?? opportunity.months;
  return (first + last) / 2;
}
export function defaultOpportunityStage(investor) {
  return 'ready-to-build';
}

/** A common clock, local cash-flow currency, nominal after-tax convention,
 * operating life, investor target and ownership policy. The conventional play
 * is replayed through the existing acquisition engine, not its COD-only IRR.
 * No published market economics or analyst play is mutated. */
export function compareOpportunity(market, opportunity, investor, play = null, values = {}) {
  const reader = values;
  const screening = opportunity.screeningByInvestor?.[investor];
  values = { ...screening, ...values };
  const stage = values.stage || defaultOpportunityStage(investor);
  if (!ARCHETYPES[investor]?.entersAt.includes(stage) || stage === 'operating')
    return fail('Choose an eligible pre-operation entry stage.', '请选择符合条件的投运前进入阶段。');
  if (opportunity.market !== market.manifest.id) return fail('Market mismatch.', '市场不匹配。');
  if (opportunity.kind === 'small' && !(Number.isFinite(opportunity.hours) && opportunity.hours > 0))
    return fail('A small route must declare its own duration', '小型路径须声明自身的储能时长');
  const distribution = opportunity.distribution && Object.fromEntries(
    Object.keys(distributionBounds).filter(key => key in values || key in opportunity.distribution)
      .map(key => [key, values[key] ?? opportunity.distribution[key]]));
  const bounds = {
    baselineMonths:[0,240], specialMonths:[0,240], purchasePricePerMW:[0,1e12],
    nodePremiumPerMW:[0,1e12], buildPremiumPct:[-100,300], opexPremiumPct:[-100,300],
    retrofitPerMW:[0,1e12], avoidedGridPerMW:[0,1e12], revenueHaircutPct:[0,100],
    baselineQualificationMonths:[0,120], specialQualificationMonths:[0,120],
    targetPercent:[.01,100], lifeYears:[6,35], ...distributionBounds,
  };
  for (const [key, value] of Object.entries({ ...distribution, ...values })) {
    const b = bounds[key];
    if (b && (!Number.isFinite(value) || value < b[0] || value > b[1]))
      return fail('Invalid comparison input: ' + key, '比较输入无效：' + key, key);
  }
  if (values.lifeYears != null && !Number.isInteger(values.lifeYears))
    return fail('Operating life must be whole years.', '运营寿命须为整年。');
  const standardCase=referenceInvestment(market,investor,play,{...values,stage});
  if(!standardCase)return fail('The conventional design has no eligible financial model.', '常规设计没有适用的财务模型。');
  const conventionalPlay=standardCase.play,shared=standardCase.options,baseline=standardCase.result;
  const targetReturn=standardCase.target;
  if (!Number.isFinite(targetReturn)) return fail('The common target could not be established.', '无法确定统一目标回报。');
  const specialRoute = opportunity.route || conventionalPlay.route;
  if (!supports(market, specialRoute))
    return fail('This special route is not supported by the market model.', '该市场模型不支持这条特殊收入路径。');
  const buildPremiumPct = values.buildPremiumPct ?? opportunity.buildPremiumPct ?? 0;
  const opexPremiumPct = values.opexPremiumPct ?? opportunity.opexPremiumPct ?? 0;
  const retrofit = values.retrofitPerMW ?? 0;
  const readerAvoided = reader.avoidedGridPerMW;
  const seedAvoided = screening?.avoidedGridPerMW ?? opportunity.avoidedConnectionPerMW ?? 0;
  const avoided = readerAvoided ?? seedAvoided;
  const conventionalConnection = (shared.economicOverrides?.['capexStack.connectionFeePerMW']
    ?? market.comparison.economics.capexStack?.connectionFeePerMW ?? 0) * baseline.economicInputToCash;
  /* The card's own avoided-works seed is credited only against an explicit
     conventional connection cost, or the saving would be counted twice. A
     reader's value is their scenario and prices against the whole build budget. */
  if (distribution && readerAvoided == null && seedAvoided > conventionalConnection)
    return fail('Avoided works exceed the explicit conventional connection cost.', '节省的电网工程超过常规方案单列的接入费用。');
  const avoidedScenario = distribution && readerAvoided > 0 && readerAvoided > conventionalConnection
    ? { perMW:readerAvoided, conventionalConnectionPerMW:conventionalConnection } : null;
  const specialMonths = values.specialMonths ?? monthsToCod(opportunity,stage,baseline.assumptions.codYears*12);
  const specialPlay = { ...conventionalPlay, route:specialRoute, hours:opportunity.hours ?? conventionalPlay.hours,
    ...(opportunity.kind === 'small' ? { grantPct:0 } : {}) };
  const power = opportunity.powerMW ?? market.comparison.archetype.powerMW;
  const specialMarket = { ...market, comparison:{ ...market.comparison,
    archetype:{ ...market.comparison.archetype, powerMW:power } } };
  const economicOverrides = { ...shared.economicOverrides };
  if (distribution?.lossFactor != null) economicOverrides.naqFactor = distribution.lossFactor;
  if (distribution?.routeFeePct != null) economicOverrides.feePct = distribution.routeFeePct;
  if (distribution?.servicesShare != null) {
    const services = economicOverrides.services ?? specialMarket.comparison.economics.services ?? 0;
    economicOverrides.services = services * distribution.servicesShare;
  }
  const specialOptions={...shared,play:specialPlay,strategyId:specialRoute,economicOverrides,
    networkFlatNetPerMW:distribution?.networkFlatPerMW,networkDispatchNetPerMW:distribution?.networkDispatchPerMW,
    runOptions:pricingOptions(specialMarket,specialPlay)};
  const unmodifiedSpecial=baseReference(specialMarket,stage,specialOptions);
  if(!unmodifiedSpecial)return fail('The special design cannot be priced.', '特殊设计无法定价。');
  const budget=unmodifiedSpecial.assumptions.buildBudget*(1+buildPremiumPct/100)+retrofit-avoided;
  if(!(budget>=0))return fail('Avoided works exceed the remaining construction budget.', '节省的电网工程超过剩余建设预算。');
  const special = baseReference(specialMarket, stage, {
    ...specialOptions, monthsToOperation:specialMonths,
    remainingBuildPerMW:budget, unfixedConstructionPerMW:0,
    // Same credit basis as the conventional case, moved by the build premium
    // and retrofit works; avoided grid works were never credit-eligible.
    creditBuildPerMW:Math.max(0,unmodifiedSpecial.assumptions.creditBuildPerMW*(1+buildPremiumPct/100)+retrofit),
    developmentPerMW:unmodifiedSpecial.assumptions.development, fixedFeesPerMW:unmodifiedSpecial.input.fixedFeesPerMW,
    decommissioningPerMW:unmodifiedSpecial.input.decommissioningPerMW,
    operatingCostFactor:baseline.assumptions.opexFactor * (1 + opexPremiumPct / 100),
    unsecuredRevenueFactor:baseline.assumptions.revenueFactor * (1 - (values.revenueHaircutPct ?? 0) / 100),
    ...(opportunity.kind === 'small' ? { capitalSupportPerMW:0, supportCase:'none', usSupply:'chinese' } : {}),
  });
  if (!special) return fail('The special design fails the route or duration eligibility checks.', '特殊设计未通过收入路径或时长的适用性检查。');
  // Preserve development success/delay/failure weights. A smaller project is
  // not silently awarded a higher probability of success.
  special.input.scenarios.forEach((s,i) => { s.probability = baseline.input.scenarios[i].probability; });
  baseline.input.targetReturn = special.input.targetReturn = targetReturn;
  baseline.input.revenueQualificationMonths = values.baselineQualificationMonths ?? 0;
  special.input.revenueQualificationMonths = values.specialQualificationMonths ?? 0;
  const commonPrice = values.purchasePricePerMW ?? 0, premium = values.nodePremiumPerMW ?? 0;
  const evaluate = (reference, price) => evaluateInvestment(reference,investor,price,targetReturn);
  const standard = evaluate(baseline, commonPrice), alternative = evaluate(special, commonPrice + premium);
  const baselinePVs = routes(baseline.input).map(route =>
    pv(acquisitionCashFlows(baseline.input, investor, route, commonPrice).flows, targetReturn));
  const relativeHeadroom = additional => Math.min(...routes(special.input).map((route,i) =>
    pv(acquisitionCashFlows(special.input, investor, route, commonPrice + additional).flows, targetReturn) - baselinePVs[i]));
  let relativeCeiling = null;
  if (relativeHeadroom(0) >= -1e-7) {
    let low = 0, high = 1e4;
    while (relativeHeadroom(high) > 0 && high < 1e12) high *= 2;
    for (let i=0;i<65;i++) { const mid=(low+high)/2; if(relativeHeadroom(mid)>=0)low=mid;else high=mid; }
    relativeCeiling = (low + high) / 2;
  }
  const targetHeadroom = alternative.ceiling.status === 'priced'
    ? alternative.ceiling.pricePerMW - commonPrice : null;
  const safePremium = targetHeadroom != null && targetHeadroom >= 0 && relativeCeiling != null
    ? Math.min(targetHeadroom, relativeCeiling) : null;
  return { standard, alternative, investor, stage, opportunity, conventionalPlay, specialPlay,
    currency:baseline.input.currency, fxToUSD:baseline.input.fxToUSD,
    targetReturn, commonPrice, premium, relativeCeiling, targetHeadroom, safePremium,
    safePremiumPerMWh:safePremium == null ? null : safePremium / special.input.durationHours,
    comparable:safePremium != null && premium <= safePremium + 1e-6,
    monthsSaved:standard.qualifiedMonths - alternative.qualifiedMonths,
    ...(distribution ? {distribution} : {}),
    ...(avoidedScenario ? {avoidedScenario} : {}),
    inputs:{ ...values, ...distribution, stage, baselineMonths:standard.codMonths, specialMonths,
      targetPercent:targetReturn*100, lifeYears:baseline.input.annual.length, purchasePricePerMW:commonPrice,
      nodePremiumPerMW:premium, buildPremiumPct, opexPremiumPct, retrofitPerMW:retrofit,
      avoidedGridPerMW:avoided, revenueHaircutPct:values.revenueHaircutPct ?? 0,
      baselineQualificationMonths:baseline.input.revenueQualificationMonths,
      specialQualificationMonths:special.input.revenueQualificationMonths },
    acquisitionFee:FEES.acquisition,
  };
}

/** All-equity hold IRR of each side at the same price. A special opportunity
 * is worth showing only when its IRR beats the conventional play in the same
 * market; an equal IRR is no advantage (analyst, 29 Oct 2026). */
export function opportunityIRRs(c) {
  if (!c || c.unavailable) return null;
  const conventional = c.standard?.holdReturn?.annualReturn, special = c.alternative?.holdReturn?.annualReturn;
  return { conventional: Number.isFinite(conventional) ? conventional : null, special: Number.isFinite(special) ? special : null };
}
export function beatsConventional(c) {
  const r = opportunityIRRs(c);
  return !!r && r.special != null && r.conventional != null && r.special > r.conventional + 1e-4;
}
