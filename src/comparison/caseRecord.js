import { runCase } from './engine.js';
import { withOverrides } from './scenario.js';
import { activeFxState } from './fx.js';
import { sizeProjectDebt, riskClassFor } from '../economics/projectDebt.js';
import { projectEvidenceStatus } from './projectEvidence.js';

const clone = value => JSON.parse(JSON.stringify(value));

/** Snapshot inputs preserve a research case after later data updates. */
export function createCaseRecord({ market, strategyId, exitYear, overrides = {}, runOptions = {}, conventions = null,
  modelCommit, dataVintages = null, entryStage = 'ready-to-build', projectEvidence = {}, savedAt = new Date().toISOString() }){
  const snapshot = clone({manifest:market.manifest,comparison:market.comparison});
  const variant = withOverrides(snapshot,overrides);
  const initial = runCase(variant,strategyId,exitYear,runOptions);
  if (initial.na) throw new Error('An unpriced case cannot be saved as a priced investment case.');
  const resolvedOptions = clone({...runOptions,fxRates:{...(runOptions.fxRates || {}),[market.manifest.currency]:initial.fxRate}});
  const result = runCase(variant,strategyId,exitYear,resolvedOptions);
  const debt = conventions ? sizeProjectDebt(result,{exitYear,riskClass:riskClassFor(variant,strategyId),conventions}) : null;
  return clone({schemaVersion:1,savedAt,modelCommit:modelCommit || 'unavailable',dataVintages,
    marketId:market.manifest.id,strategyId,durationHours:variant.comparison.archetype.durationHours,entryStage,
    exitYear,exitClock:'operating-years',fx:{...activeFxState(),
      ...(runOptions.fxRates ? {kind:'override'} : {}),usedRate:initial.fxRate,currency:market.manifest.currency},
    snapshot,overrides,runOptions:resolvedOptions,conventions,
    result,debt,unresolvedGates:result.investmentGate || [],projectEvidence:projectEvidenceStatus(projectEvidence),
    limitations:['Illustrative operating-cash-flow proxy; no project-specific tax, reserve accounts, cash traps or lender P90 coverage.',
      'No assumed refinancing; any maturity funding gap is an additional equity contribution.'],
  });
}

/** Recompute from saved inputs, never today's registry or FX. */
export function replayCaseRecord(record){
  if (record.schemaVersion !== 1) throw new Error('Unsupported investment-case format.');
  const market=withOverrides(record.snapshot,record.overrides);
  const result=runCase(market,record.strategyId,record.exitYear,record.runOptions);
  const debt=record.conventions ? sizeProjectDebt(result,{exitYear:record.exitYear,
    riskClass:riskClassFor(market,record.strategyId),conventions:record.conventions}) : null;
  return {result,debt};
}

/** Additional upfront premium at t=0 giving zero NPV at a user-set hurdle.
 * Negative means a discount to modelled cost is required. USD/MW, unlevered.
 */
export function entryPriceAtHurdle(result,hurdle){
  if (!Number.isFinite(hurdle) || hurdle <= -1) return null;
  const premium=result.exitFlows.reduce((sum,cash,t)=>sum+cash/(1+hurdle)**t,0);
  const inflows=result.cumOp+result.exitVal;
  return {hurdle,entryPremiumPerMW:premium,modelledNetCapitalPerMW:result.net,
    totalCommitmentPerMW:result.net+premium,
    exitProceedsShare:inflows>0?result.exitVal/inflows:null};
}
