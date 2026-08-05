import { irrOf } from '../utils/finance.js';
import { runCase, runBaseCase } from './engine.js';
import { baseStrategy } from './strategies.js';
import { runEvidenceOnlyCase } from './refinement.js';

function combineEqualCapital(results, flowKey = 'holdFlows'){
  const live = results.filter(result => result && !result.na && Array.isArray(result[flowKey]) && result.net > 0);
  if (!live.length) return { irr:null, flows:[], markets:0 };
  const length = Math.max(...live.map(result => result[flowKey].length));
  const flows = new Array(length).fill(0);
  for (const result of live){
    const scale = 1 / result.net / live.length;
    result[flowKey].forEach((value, index) => { flows[index] += value * scale; });
  }
  return { irr:irrOf(flows), flows, markets:live.length };
}

export function runPortfolioScenarios(markets, exitYear = 5){
  const baseResults = markets.map(market => runBaseCase(market, exitYear));
  const correlatedResults = markets.map(market => runCase(market, baseStrategy(market), exitYear, {
    merchantFactor:0.65,
    auctionFactor:0.65,
  }));
  const evidenceResults = markets.map(market => runEvidenceOnlyCase(market, baseStrategy(market), exitYear).result);
  const currentRunRateResults = markets.map(market => {
    const factor = market.comparison.refinement?.currentRunRateFactor ?? 1;
    const merchantFactors = Array.from({ length:15 }, (_, i) => i < 3 ? factor : 1);
    return runCase(market, baseStrategy(market), exitYear, { merchantFactors, auctionFactors:merchantFactors });
  });

  const merchantExposure = baseResults.reduce((sum, result) => {
    const revenue = (result?.capY?.[0] || 0) + (result?.mchY?.[0] || 0);
    return sum + (revenue > 0 ? (result.mchY[0] || 0) / revenue : 0);
  }, 0) / Math.max(1, baseResults.length);

  return {
    allocation:'equal-capital',
    merchantExposure,
    base:combineEqualCapital(baseResults),
    correlatedMerchant:combineEqualCapital(correlatedResults),
    evidenceOnly:combineEqualCapital(evidenceResults),
    currentRunRate:combineEqualCapital(currentRunRateResults),
  };
}

