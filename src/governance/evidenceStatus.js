import { AUTHORITY } from './authority.js';
import { sourceById } from './sourceRegistry.js';

/**
 * Evidence status answers "what supports this displayed value?" Authority
 * continues to answer the separate question "who may change it?".
 */
export const EVIDENCE_STATUS = Object.freeze({
  VERIFIED: 'verified',
  DERIVED: 'derived',
  PROXY: 'proxy',
  TO_BUILD: 'to-build',
});

export const EVIDENCE_STATUS_LABEL = Object.freeze({
  [EVIDENCE_STATUS.VERIFIED]: ['Verified', '已核验'],
  [EVIDENCE_STATUS.DERIVED]: ['Derived', '衍生计算'],
  [EVIDENCE_STATUS.PROXY]: ['Proxy', '代理指标'],
  [EVIDENCE_STATUS.TO_BUILD]: ['To build', '待建设'],
});

export const EVIDENCE_CONFIDENCE = Object.freeze({
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  NOT_ASSESSED: 'not-assessed',
});

export const EVIDENCE_CONFIDENCE_LABEL = Object.freeze({
  [EVIDENCE_CONFIDENCE.HIGH]: ['High confidence', '高置信度'],
  [EVIDENCE_CONFIDENCE.MEDIUM]: ['Medium confidence', '中等置信度'],
  [EVIDENCE_CONFIDENCE.LOW]: ['Low confidence', '低置信度'],
  [EVIDENCE_CONFIDENCE.NOT_ASSESSED]: ['Not yet assessed', '尚未评估'],
});

const STATUS_AUTHORITIES = Object.freeze({
  [EVIDENCE_STATUS.VERIFIED]: new Set([
    AUTHORITY.OBSERVED,
    AUTHORITY.OFFICIAL_FORECAST,
  ]),
  [EVIDENCE_STATUS.DERIVED]: new Set([
    AUTHORITY.DERIVED,
    AUTHORITY.DERIVED_OBSERVED,
  ]),
  [EVIDENCE_STATUS.PROXY]: new Set([
    AUTHORITY.DERIVED,
    AUTHORITY.DERIVED_OBSERVED,
    AUTHORITY.ANALYST_SCENARIO,
    AUTHORITY.ANALYST,
  ]),
  [EVIDENCE_STATUS.TO_BUILD]: new Set([
    AUTHORITY.METHODOLOGY,
    AUTHORITY.CONFIG,
  ]),
});

const bilingual = value =>
  Array.isArray(value) && value.length === 2 && value.every(part => typeof part === 'string' && part.trim());

export function allowedAuthoritiesForEvidence(status){
  return STATUS_AUTHORITIES[status] || new Set();
}

export function isEvidenceAuthorityCompatible(status, authority){
  return allowedAuthoritiesForEvidence(status).has(authority);
}

/**
 * Validate a metric evidence envelope. The validator intentionally fails
 * closed: a populated value needs lineage, while a build gap must remain null.
 */
export function validateEvidence(record){
  const problems = [];
  const status = record?.status;

  for (const key of ['id', 'marketId', 'metricId', 'status', 'authority', 'confidence']){
    if (record?.[key] === undefined || record[key] === null || record[key] === ''){
      problems.push(key + ' is required');
    }
  }
  if (!/^[a-z0-9-]+$/.test(record?.id || '')) problems.push('id must be URL-safe');
  if (!bilingual(record?.label)) problems.push('label must be [en, zh]');
  if (!Object.values(EVIDENCE_STATUS).includes(status)) problems.push('unknown evidence status "' + status + '"');
  if (!Object.values(EVIDENCE_CONFIDENCE).includes(record?.confidence)){
    problems.push('unknown confidence "' + record?.confidence + '"');
  }
  if (!Object.values(AUTHORITY).includes(record?.authority)){
    problems.push('unknown authority "' + record?.authority + '"');
  } else if (Object.values(EVIDENCE_STATUS).includes(status)
      && !isEvidenceAuthorityCompatible(status, record.authority)){
    problems.push('authority "' + record.authority + '" is incompatible with status "' + status + '"');
  }

  const sourceIds = Array.isArray(record?.sourceIds) ? record.sourceIds : [];
  const inputMetricIds = Array.isArray(record?.inputMetricIds) ? record.inputMetricIds : [];

  if (status === EVIDENCE_STATUS.TO_BUILD){
    if (record?.value !== null) problems.push('to-build value must be null');
    if (record?.confidence !== EVIDENCE_CONFIDENCE.NOT_ASSESSED){
      problems.push('to-build confidence must be not-assessed');
    }
    if (!bilingual(record?.gap)) problems.push('to-build gap must be [en, zh]');
    if (!bilingual(record?.buildPlan)) problems.push('to-build buildPlan must be [en, zh]');
  } else {
    if (record?.value === null || record?.value === undefined){
      problems.push(status + ' value must not be null');
    } else if (typeof record.value === 'number' && !Number.isFinite(record.value)){
      problems.push('numeric value must be finite');
    }
    if (sourceIds.length === 0) problems.push(status + ' evidence requires sourceIds');
    if (!record?.asOf || Number.isNaN(Date.parse(record.asOf))){
      problems.push(status + ' evidence requires a valid asOf date');
    }
  }

  if (status === EVIDENCE_STATUS.DERIVED){
    if (!bilingual(record?.method)) problems.push('derived method must be [en, zh]');
    if (inputMetricIds.length === 0 && sourceIds.length === 0){
      problems.push('derived evidence requires inputMetricIds or sourceIds');
    }
  }
  if (status === EVIDENCE_STATUS.PROXY){
    if (!bilingual(record?.proxyFor)) problems.push('proxyFor must be [en, zh]');
    if (!bilingual(record?.method)) problems.push('proxy method must be [en, zh]');
  }

  for (const sourceId of sourceIds){
    if (!sourceById(sourceId)) problems.push('unknown source "' + sourceId + '"');
  }
  return problems;
}

export function validateEvidenceCollection(records){
  const problems = [];
  const ids = new Set();
  for (const record of records || []){
    if (ids.has(record?.id)) problems.push(record.id + ': duplicate id');
    ids.add(record?.id);
    problems.push(...validateEvidence(record).map(problem => (record?.id || '(missing id)') + ': ' + problem));
  }
  return problems;
}

export function toBuildEvidence({
  id,
  marketId,
  metricId,
  label,
  gap,
  buildPlan,
  unit = null,
}){
  return {
    id,
    marketId,
    metricId,
    label,
    status: EVIDENCE_STATUS.TO_BUILD,
    authority: AUTHORITY.METHODOLOGY,
    confidence: EVIDENCE_CONFIDENCE.NOT_ASSESSED,
    value: null,
    unit,
    sourceIds: [],
    gap,
    buildPlan,
  };
}

