import { evidenceForStream, isSecuredEligibleEvidence,
  REVENUE_EVIDENCE_CLASS, VALUE_EVIDENCE_CLASS } from '../governance/revenueEvidence.js';
import { evaluateRevenueStackFeasibility } from '../economics/revenueStackFeasibility.js';

const streamForStrategy = strategyId => strategyId === 'cap' ? 'cap'
  : strategyId === 'toll' ? 'toll'
    : strategyId === 'ltda' ? 'ltda' : null;

const pv = (values, rate = 0.08) => (values || []).reduce((sum, value, i) =>
  sum + Math.max(0, value || 0) / Math.pow(1 + rate, i + 1), 0);

function splitMerchantServices(market, result){
  const e = market.comparison.economics;
  const merchantSeed = Math.max(0, e.merchGross || 0) * (e.merchantNetOfFee ? 1 : 1 - (e.feePct || 0) / 100);
  const servicesSeed = Math.max(0, e.services || 0);
  const total = merchantSeed + servicesSeed;
  const serviceShare = total > 0 ? servicesSeed / total : 0;
  return {
    merchant: (result.mchY || []).map(value => value * (1 - serviceShare)),
    services: (result.mchY || []).map(value => value * serviceShare),
  };
}

function evidenceComposition(market, strategyId, result){
  const totals = Object.fromEntries(Object.values(VALUE_EVIDENCE_CLASS).map(key => [key, 0]));
  const add = (record, amount) => { totals[record.valueClass] = (totals[record.valueClass] || 0) + amount; };
  const fixedStream = streamForStrategy(strategyId);
  if (fixedStream) add(evidenceForStream(market, fixedStream), pv(result.secY || result.capY));
  if (result.aucY?.some(Boolean)) add({ valueClass:VALUE_EVIDENCE_CLASS.PROXY }, pv(result.aucY));
  const split = splitMerchantServices(market, result);
  add(evidenceForStream(market, 'merchant'), pv(split.merchant));
  add(evidenceForStream(market, 'services'), pv(split.services));
  const total = Object.values(totals).reduce((sum, value) => sum + value, 0);
  return {
    amounts: totals,
    shares: Object.fromEntries(Object.entries(totals).map(([key, value]) => [key, total > 0 ? value / total : 0])),
    total,
  };
}

function capexCompleteness(e){
  const checks = {
    developmentCost: Number.isFinite(e.devCostPct) && e.devCostPct > 0,
    rtbPremium: Number.isFinite(e.rtbPremiumPct) && e.rtbPremiumPct > 0,
    gridContribution: Number.isFinite(e.gridContributionPerMW),
    taxTariff: Number.isFinite(e.taxTariffPct),
    constructionTiming: Number.isFinite(e.constructionMonths) && e.constructionMonths >= 24,
    /* Lifecycle treatment declared. The analyst's default is a warranty
       extension with an LTSA and no augmentation, so a priced service package
       is the declaration; an augmentation schedule is the alternative. */
    augmentation: (Array.isArray(e.augmentationSchedule) && e.augmentationSchedule.length > 0)
      || (Array.isArray(e.serviceSchedulePerMW) && e.serviceSchedulePerMW.length > 0),
    decommissioning: Number.isFinite(e.decommissioningPerMW),
    warrantyDegradation: Array.isArray(e.warrantyDegradationCurve) && e.warrantyDegradationCurve.length > 0,
  };
  const complete = Object.values(checks).filter(Boolean).length;
  return {
    checks,
    complete,
    total: Object.keys(checks).length,
    score: complete / Object.keys(checks).length,
    missing: Object.entries(checks).filter(([, ok]) => !ok).map(([key]) => key),
  };
}

export function decorateDecisionResult(market, strategyId, result){
  if (!result || result.na) return result;
  const fixedStream = streamForStrategy(strategyId);
  const evidence = fixedStream ? evidenceForStream(market, fixedStream) : null;
  const fixedShare = result.securedShare ?? result.contractedShare ?? 0;
  const eligible = evidence ? isSecuredEligibleEvidence(evidence.evidenceClass) : false;
  const executed = evidence?.evidenceClass === REVENUE_EVIDENCE_CLASS.EXECUTED_OBSERVED_AWARD
    && evidence.projectBinding;
  const composition = evidenceComposition(market, strategyId, result);
  const feasibility = evaluateRevenueStackFeasibility(market.comparison.economics.revenueStackConstraints);
  const capital = capexCompleteness(market.comparison.economics);
  const profile = market.comparison.refinement || {};

  return {
    ...result,
    modelledFixedShare: fixedShare,
    modelledFixedYears: result.securedYears || 0,
    evidenceSecuredShare: eligible ? fixedShare : 0,
    evidenceSecuredYears: eligible ? (result.securedYears || 0) : 0,
    securedShare: result.securedShare ?? result.contractedShare ?? 0,
    securedYears: result.securedYears || 0,
    executedShare: executed ? fixedShare : 0,
    proxyShare: evidence?.evidenceClass === REVENUE_EVIDENCE_CLASS.DERIVED_PRIVATE_PROXY ? fixedShare : 0,
    fixedRevenueEvidence: evidence,
    evidenceNpv: composition,
    evidenceConfidenceScore: profile.confidenceScore ?? 0,
    consensus: profile.consensus || null,
    investmentGate: profile.investmentGate || [],
    pipelineEligibility: profile.pipeline || { eligible:false },
    feasibility,
    capexCompleteness: capital,
    allocationReady: feasibility.status === 'pass' && capital.score === 1
      && (profile.investmentGate || []).length === 0,
  };
}

