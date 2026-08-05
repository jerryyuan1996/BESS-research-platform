import { runCase, runBaseCase } from './engine.js';
import { withOverrides } from './scenario.js';
import { baseStrategy } from './strategies.js';
import { evidenceForStream, REVENUE_EVIDENCE_CLASS } from '../governance/revenueEvidence.js';

export const OWNER_SCENARIO = Object.freeze({ BEAR:'bear', BASE:'base', BULL:'bull' });

const COST_FIELDS = new Set([
  'capexPerMW', 'opexPerMW', 'feePct', 'degr', 'devCostPct', 'rtbPremiumPct',
  'constructionMonths', 'taxTariffPct', 'gridContributionPerMW',
]);
const REVENUE_FIELDS = new Set([
  'contracted', 'contractYears', 'postFactor', 'securedContracted', 'toll', 'tollYears',
  'ltda.payment', 'ltda.years', 'merchGross', 'services', 'grantPct', 'naqFactor',
]);

function scenarioOverrides(market, caseId){
  if (caseId === OWNER_SCENARIO.BASE) return {};
  const out = {};
  for (const [field, range] of Object.entries(market.comparison.ranges || {})){
    if (!Number.isFinite(range?.min) || !Number.isFinite(range?.max)) continue;
    if (COST_FIELDS.has(field)) out[field] = caseId === OWNER_SCENARIO.BEAR ? range.max : range.min;
    else if (REVENUE_FIELDS.has(field)) out[field] = caseId === OWNER_SCENARIO.BEAR ? range.min : range.max;
  }
  return out;
}

export function runScenarioCase(market, strategyId, exitYear, caseId, options = {}){
  const overrides = scenarioOverrides(market, caseId);
  const scenarioMarket = withOverrides(market, overrides);
  const result = runCase(scenarioMarket, strategyId, exitYear, options);
  return { caseId, overrides, result };
}

export function runScenarioSet(market, strategyId = baseStrategy(market), exitYear = 5, options = {}){
  const bear = runScenarioCase(market, strategyId, exitYear, OWNER_SCENARIO.BEAR, options);
  const base = { caseId:OWNER_SCENARIO.BASE, overrides:{}, result:runCase(market, strategyId, exitYear, options) };
  const bull = runScenarioCase(market, strategyId, exitYear, OWNER_SCENARIO.BULL, options);
  return { marketId:market.manifest.id, strategyId, exitYear, bear, base, bull };
}

function fixedStream(strategyId){
  return strategyId === 'cap' ? 'cap' : strategyId === 'toll' ? 'toll' : strategyId === 'ltda' ? 'ltda' : null;
}

export function runEvidenceOnlyCase(market, strategyId = baseStrategy(market), exitYear = 5, options = {}){
  const stream = fixedStream(strategyId);
  const evidence = stream ? evidenceForStream(market, stream) : null;
  const overrides = {};
  if (evidence?.evidenceClass === REVENUE_EVIDENCE_CLASS.DERIVED_PRIVATE_PROXY){
    if (strategyId === 'cap'){
      if (market.comparison.economics.riskClass === 'auction-renewal') overrides.securedContracted = 0;
      else overrides.contracted = 0;
    }
    if (strategyId === 'toll') overrides.toll = 0;
    if (strategyId === 'ltda') overrides['ltda.payment'] = 0;
  }
  const scenarioMarket = withOverrides(market, overrides);
  return { overrides, result:runCase(scenarioMarket, strategyId, exitYear, options) };
}

export function runCurrentRunRateCase(market, exitYear = 5){
  const factor = market.comparison.refinement?.currentRunRateFactor ?? 1;
  const merchantFactors = Array.from({ length:15 }, (_, i) => i < 3 ? factor : 1);
  return runCase(market, baseStrategy(market), exitYear, { merchantFactors, auctionFactors:merchantFactors });
}

export function runDemandShockCase(market, exitYear = 5){
  const factor = market.comparison.refinement?.demandShockFactor;
  if (!Number.isFinite(factor)) return null;
  const merchantFactors = Array.from({ length:15 }, (_, i) => i < 2 ? 1 : factor);
  return runCase(market, baseStrategy(market), exitYear, { merchantFactors, auctionFactors:merchantFactors });
}

export function runExitSensitivity(market, exitYear = 5){
  const strategyId = baseStrategy(market);
  return {
    lowYield: runCase(market, strategyId, exitYear, {
      exitYContracted:0.06, exitYMerchant:0.10, exitYAuction:0.10,
    }),
    base: runBaseCase(market, exitYear),
    highYield: runCase(market, strategyId, exitYear, {
      exitYContracted:0.09, exitYMerchant:0.14, exitYAuction:0.14,
    }),
  };
}

