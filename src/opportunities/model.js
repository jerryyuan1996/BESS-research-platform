import { referenceInputs } from '../acquisition/reference.js';
import { valueAcquisition, returnAtAcquisitionPrice, acquisitionCashFlows } from '../acquisition/valuation.js';
import { FEES } from '../acquisition/parameters.js';
import { baseStrategy, supports } from '../comparison/strategies.js';
import { ARCHETYPES } from '../governance/archetypes.js';
import { referenceInvestment, evaluateInvestment, pricingOptions } from './investment.js';

const pv = (flows, rate) => flows.reduce((sum, c) => sum + c.amount / (1 + rate) ** c.at, 0);
const routes = input => input.stage === 'operating' ? ['hold'] : ['hold','sale'];
const baseReference = (market, stage, options) => referenceInputs(market, stage, options).find(c => c.key === 'base');
export function defaultOpportunityStage(investor) {
  return 'ready-to-build';
}

/** A common clock, local cash-flow currency, nominal after-tax convention,
 * operating life, investor target and ownership policy. The conventional play
 * is replayed through the existing acquisition engine, not its COD-only IRR.
 * No published market economics or analyst play is mutated. */
export function compareOpportunity(market, opportunity, investor, play = null, values = {}) {
  values = { ...opportunity.screeningByInvestor?.[investor], ...values };
  const stage = values.stage || defaultOpportunityStage(investor);
  if (!ARCHETYPES[investor]?.entersAt.includes(stage) || stage === 'operating')
    return { unavailable:'Choose an eligible pre-operation entry stage.' };
  if (opportunity.market !== market.manifest.id) return { unavailable:'Market mismatch.' };
  const bounds = {
    baselineMonths:[0,240], specialMonths:[0,240], purchasePricePerMW:[0,1e12],
    nodePremiumPerMW:[0,1e12], buildPremiumPct:[-100,300], opexPremiumPct:[-100,300],
    retrofitPerMW:[0,1e12], avoidedGridPerMW:[0,1e12], revenueHaircutPct:[0,100],
    baselineQualificationMonths:[0,120], specialQualificationMonths:[0,120],
    targetPercent:[.01,100], lifeYears:[6,35],
  };
  for (const [key, value] of Object.entries(values)) {
    const b = bounds[key];
    if (b && (!Number.isFinite(value) || value < b[0] || value > b[1])) return { unavailable:'Invalid comparison input: ' + key };
  }
  if (values.lifeYears != null && !Number.isInteger(values.lifeYears)) return { unavailable:'Operating life must be whole years.' };
  const standardCase=referenceInvestment(market,investor,play,{...values,stage});
  if(!standardCase)return {unavailable:'The conventional design has no eligible financial model.'};
  const conventionalPlay=standardCase.play,shared=standardCase.options,baseline=standardCase.result;
  const targetReturn=standardCase.target;
  if (!Number.isFinite(targetReturn)) return { unavailable:'The common target could not be established.' };
  const specialRoute = opportunity.route || conventionalPlay.route;
  if (!supports(market, specialRoute)) return { unavailable:'This special route is not supported by the market model.' };
  const buildPremiumPct = values.buildPremiumPct ?? opportunity.buildPremiumPct ?? 0;
  const opexPremiumPct = values.opexPremiumPct ?? opportunity.opexPremiumPct ?? 0;
  const retrofit = values.retrofitPerMW ?? 0, avoided = values.avoidedGridPerMW ?? 0;
  const specialMonths = values.specialMonths ?? (opportunity.kind === 'award'
    ? baseline.assumptions.codYears * 12 : (opportunity.months[0] + opportunity.months[1]) / 2);
  const specialPlay = { ...conventionalPlay, route:specialRoute, hours:opportunity.hours ?? conventionalPlay.hours,
    ...(opportunity.kind === 'small' ? { grantPct:0 } : {}) };
  const power = opportunity.powerMW ?? market.comparison.archetype.powerMW;
  const specialMarket = { ...market, comparison:{ ...market.comparison,
    archetype:{ ...market.comparison.archetype, powerMW:power } } };
  const specialOptions={...shared,play:specialPlay,strategyId:specialRoute,
    runOptions:pricingOptions(specialMarket,specialPlay)};
  const unmodifiedSpecial=baseReference(specialMarket,stage,specialOptions);
  if(!unmodifiedSpecial)return {unavailable:'The special design cannot be priced.'};
  const budget=unmodifiedSpecial.assumptions.buildBudget*(1+buildPremiumPct/100)+retrofit-avoided;
  if(!(budget>=0))return {unavailable:'Avoided works exceed the remaining construction budget.'};
  const special = baseReference(specialMarket, stage, {
    ...specialOptions, monthsToOperation:specialMonths,
    remainingBuildPerMW:budget, unfixedConstructionPerMW:0,
    developmentPerMW:unmodifiedSpecial.assumptions.development, fixedFeesPerMW:unmodifiedSpecial.input.fixedFeesPerMW,
    decommissioningPerMW:unmodifiedSpecial.input.decommissioningPerMW,
    operatingCostFactor:baseline.assumptions.opexFactor * (1 + opexPremiumPct / 100),
    unsecuredRevenueFactor:baseline.assumptions.revenueFactor * (1 - (values.revenueHaircutPct ?? 0) / 100),
    ...(opportunity.kind === 'small' ? { capitalSupportPerMW:0, supportCase:'none' } : {}),
  });
  if (!special) return { unavailable:'The special design fails the route or duration eligibility checks.' };
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
    inputs:{ ...values, stage, baselineMonths:standard.codMonths, specialMonths,
      targetPercent:targetReturn*100, lifeYears:baseline.input.annual.length, purchasePricePerMW:commonPrice,
      nodePremiumPerMW:premium, buildPremiumPct, opexPremiumPct, retrofitPerMW:retrofit,
      avoidedGridPerMW:avoided, revenueHaircutPct:values.revenueHaircutPct ?? 0,
      baselineQualificationMonths:baseline.input.revenueQualificationMonths,
      specialQualificationMonths:special.input.revenueQualificationMonths },
    acquisitionFee:FEES.acquisition,
  };
}
