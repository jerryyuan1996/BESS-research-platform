/* Canonical project evidence contract. Unknown is never coerced to Announced,
   and duration is explicitly nullable because official connection registers
   usually publish MW without MWh. */

export const PROJECT_STAGE = {
  ANNOUNCED: 'announced',
  GRID_APPLICATION: 'grid_application',
  GRID_SECURED: 'grid_secured',
  PERMITTED: 'permitted',
  CONTRACTED: 'contracted',
  FINANCED: 'financed',
  UNDER_CONSTRUCTION: 'under_construction',
  OPERATING: 'operating',
  UNKNOWN: 'unknown',
};

const STAGES = new Set(Object.values(PROJECT_STAGE));

export function validateProject(project){
  const problems = [];
  for (const key of ['id', 'marketId', 'name', 'stage', 'statusRaw', 'evidenceDate']){
    if (project?.[key] === undefined || project[key] === null || project[key] === '') problems.push(`${key} is required`);
  }
  if (!/^[a-z0-9-]+$/.test(project?.id || '')) problems.push('id must be URL-safe');
  if (!STAGES.has(project?.stage)) problems.push(`unknown stage "${project?.stage}"`);
  if (!Number.isFinite(project?.capacityMW) || project.capacityMW <= 0) problems.push('capacityMW must be positive');
  if (project?.durationHours !== null && (!Number.isFinite(project?.durationHours) || project.durationHours <= 0)){
    problems.push('durationHours must be positive or null');
  }
  if (!Array.isArray(project?.sourceIds) || project.sourceIds.length === 0) problems.push('sourceIds must be non-empty');
  if (Number.isNaN(Date.parse(project?.evidenceDate))) problems.push('evidenceDate must be a date');
  if (project?.expectedCod !== null && Number.isNaN(Date.parse(project?.expectedCod))) problems.push('expectedCod must be a date or null');
  return problems;
}

export function validateProjects(projects){
  const problems = [];
  const ids = new Set();
  for (const project of projects){
    if (ids.has(project.id)) problems.push(`${project.id}: duplicate id`);
    ids.add(project.id);
    problems.push(...validateProject(project).map(problem => `${project.id || '(missing id)'}: ${problem}`));
  }
  return problems;
}

