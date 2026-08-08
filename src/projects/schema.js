/* Canonical project evidence contract. Unknown is never coerced to Announced,
   and duration is explicitly nullable because official connection registers
   usually publish MW without MWh.

   The map and the pipeline section read THIS record and nothing else, so the two
   cannot disagree about a project. Coordinates and technology are optional for
   the same reason duration is: NESO's TEC register publishes neither a location
   nor an energy capacity, and a project that cannot be plotted still belongs in
   the pipeline table. A record without coordinates is omitted from the map; it is
   never given a guessed one. */

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

/* What the asset is. Storage is what the platform underwrites; solar and wind
   are carried because they shape the price a battery captures, not because the
   platform has a view on them. */
export const PROJECT_TECHNOLOGY = {
  STORAGE: 'storage',
  SOLAR: 'solar',
  WIND: 'wind',
};

const TECHNOLOGIES = new Set(Object.values(PROJECT_TECHNOLOGY));

/** The two stages the map renders. A queue entry is not a pipeline entry. */
export const MAPPED_STAGES = [PROJECT_STAGE.OPERATING, PROJECT_STAGE.UNDER_CONSTRUCTION];

/** True when a project has a real position and may be drawn. */
export function isPlottable(project){
  return Number.isFinite(project?.lat) && Number.isFinite(project?.lon)
    && Math.abs(project.lat) <= 90 && Math.abs(project.lon) <= 180;
}

/**
 * Energy capacity in MWh, or null where the source does not publish it.
 *
 * Derived from duration rather than stored, so a record can never carry an MWh
 * that disagrees with its own hours. GB returns null here for every project.
 */
export function energyMWh(project){
  if (!Number.isFinite(project?.durationHours) || !Number.isFinite(project?.capacityMW)) return null;
  return project.capacityMW * project.durationHours;
}

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

  /* Optional, but wrong is worse than absent. A half-declared position would put
     a project on the null island off Ghana rather than leaving it off the map. */
  const hasLat = project?.lat !== undefined && project?.lat !== null;
  const hasLon = project?.lon !== undefined && project?.lon !== null;
  if (hasLat !== hasLon) problems.push('lat and lon must be declared together or not at all');
  if (hasLat && hasLon && !isPlottable(project)) problems.push('lat/lon are out of range');
  if (project?.technology !== undefined && !TECHNOLOGIES.has(project.technology)){
    problems.push(`unknown technology "${project.technology}"`);
  }
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

