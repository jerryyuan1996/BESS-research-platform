import { AUTHORITY } from '../governance/authority.js';
import { SCENARIO_CASE, SCENARIO_LENS } from './scenarioSemantics.js';

export const FORECAST_AUTHORITY = new Set([
  AUTHORITY.OFFICIAL_FORECAST,
  AUTHORITY.ANALYST_SCENARIO,
]);

export function validateForecastSeries(series){
  const problems = [];
  if (!series?.id) problems.push('id is required');
  if (!series?.metricId) problems.push('metricId is required');
  if (!FORECAST_AUTHORITY.has(series?.authority)) problems.push('authority must be official-forecast or analyst-scenario');
  if (!series?.vintage) problems.push('vintage is required');
  if (!Array.isArray(series?.values) || series.values.length === 0) problems.push('values must be non-empty');
  if (series?.authority === AUTHORITY.ANALYST_SCENARIO){
    if (!Object.values(SCENARIO_LENS).includes(series?.scenarioLens)) problems.push('analyst scenario requires a valid scenarioLens');
    if (!Object.values(SCENARIO_CASE).includes(series?.caseId)) problems.push('analyst scenario requires a valid caseId');
  }
  return problems;
}

