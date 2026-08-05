/* Revenue observability and cash-flow durability are deliberately separate.

   Evidence answers: how do we know the price and tenor?
   Risk answers: how long does the cash flow remain insulated from the market?

   A private proxy may still be useful in an illustrative scenario, but it is
   never allowed to become secured revenue or secured debt by presentation. */

export const REVENUE_EVIDENCE_CLASS = Object.freeze({
  EXECUTED_OBSERVED_AWARD: 'executed_observed_award',
  PUBLISHED_MARKET_CLEARING: 'published_market_clearing',
  DISCLOSED_TRANSACTION_BENCHMARK: 'disclosed_transaction_benchmark',
  DERIVED_PRIVATE_PROXY: 'derived_private_proxy',
});

export const REVENUE_EVIDENCE_LABEL = Object.freeze({
  [REVENUE_EVIDENCE_CLASS.EXECUTED_OBSERVED_AWARD]: ['Executed observed award', '已执行且可观测的中标'],
  [REVENUE_EVIDENCE_CLASS.PUBLISHED_MARKET_CLEARING]: ['Published market clearing', '已公布的市场出清'],
  [REVENUE_EVIDENCE_CLASS.DISCLOSED_TRANSACTION_BENCHMARK]: ['Disclosed transaction benchmark', '已披露的交易基准'],
  [REVENUE_EVIDENCE_CLASS.DERIVED_PRIVATE_PROXY]: ['Derived / private-price proxy', '衍生/私有价格代理'],
});

export const VALUE_EVIDENCE_CLASS = Object.freeze({
  OBSERVED_DISCLOSED: 'observed_disclosed',
  DERIVED: 'derived',
  PROXY: 'proxy',
  PLACEHOLDER: 'placeholder',
});

export const VALUE_EVIDENCE_LABEL = Object.freeze({
  [VALUE_EVIDENCE_CLASS.OBSERVED_DISCLOSED]: ['Observed / disclosed', '已观测/已披露'],
  [VALUE_EVIDENCE_CLASS.DERIVED]: ['Derived', '衍生计算'],
  [VALUE_EVIDENCE_CLASS.PROXY]: ['Proxy', '代理值'],
  [VALUE_EVIDENCE_CLASS.PLACEHOLDER]: ['Placeholder', '占位值'],
});

export const SECURED_ELIGIBLE_EVIDENCE = new Set([
  REVENUE_EVIDENCE_CLASS.EXECUTED_OBSERVED_AWARD,
  REVENUE_EVIDENCE_CLASS.PUBLISHED_MARKET_CLEARING,
  REVENUE_EVIDENCE_CLASS.DISCLOSED_TRANSACTION_BENCHMARK,
]);

const bilingual = value => Array.isArray(value) && value.length === 2
  && value.every(part => typeof part === 'string' && part.trim());

export function isSecuredEligibleEvidence(evidenceClass){
  return SECURED_ELIGIBLE_EVIDENCE.has(evidenceClass);
}

export function validateRevenueEvidence(record){
  const problems = [];
  if (!record || typeof record !== 'object') return ['record is required'];
  if (!Object.values(REVENUE_EVIDENCE_CLASS).includes(record.evidenceClass)){
    problems.push('unknown evidenceClass "' + record.evidenceClass + '"');
  }
  if (!Object.values(VALUE_EVIDENCE_CLASS).includes(record.valueClass)){
    problems.push('unknown valueClass "' + record.valueClass + '"');
  }
  if (typeof record.projectBinding !== 'boolean') problems.push('projectBinding must be boolean');
  if (!bilingual(record.basis)) problems.push('basis must be [en, zh]');
  if (!record.asOf || Number.isNaN(Date.parse(record.asOf))) problems.push('valid asOf date is required');
  if (!Array.isArray(record.sources) || record.sources.length === 0) problems.push('sources must be non-empty');
  if (record.projectBinding && record.evidenceClass !== REVENUE_EVIDENCE_CLASS.EXECUTED_OBSERVED_AWARD){
    problems.push('projectBinding requires executed_observed_award evidence');
  }
  return problems;
}

export function validateRevenueEvidenceSet(set){
  const problems = [];
  for (const [stream, record] of Object.entries(set || {})){
    problems.push(...validateRevenueEvidence(record).map(problem => stream + ': ' + problem));
  }
  return problems;
}

/** Evidence record for a stream, falling back to a fail-closed proxy. */
export function evidenceForStream(market, stream){
  const record = market?.comparison?.refinement?.revenueEvidence?.[stream];
  if (record) return record;
  return {
    evidenceClass: REVENUE_EVIDENCE_CLASS.DERIVED_PRIVATE_PROXY,
    valueClass: VALUE_EVIDENCE_CLASS.PLACEHOLDER,
    projectBinding: false,
    basis: ['Evidence classification not supplied; excluded from secured revenue.',
            '未提供证据分类；不计入已锁定收入。'],
    asOf: market?.manifest?.asOf || '1970-01-01',
    sources: ['Unclassified — fail closed'],
  };
}

