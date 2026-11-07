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

/* What the asset is. Storage is what the platform underwrites; solar and wind
   are carried because they shape the price a battery captures, not because the
   platform has a view on them. */
export const PROJECT_TECHNOLOGY = {
  STORAGE: 'storage',
  SOLAR: 'solar',
  WIND: 'wind',
};

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
 * Explicitly sourced monthly energy is distinct from a duration observation.
 * Legacy records retain their power-times-duration rule. Annual discharge hours
 * never feed this helper; their MW denominator is different.
 */
export function energyMWh(project){
  if (Object.hasOwn(project || {}, 'energyObservation')){
    return validateEnergyObservation(project).length === 0 && project.energyObservation ? project.energyObservation.value : null;
  }
  if (!Number.isFinite(project?.durationHours) || !Number.isFinite(project?.capacityMW)) return null;
  return project.capacityMW * project.durationHours;
}

/** Explicit observed energy has its own period and source, never an inferred MW. */
export function validateEnergyObservation(project){
  const observation = project?.energyObservation;
  if (observation == null) return [];
  const key = `${project?.sourceRef?.plantId}:${project?.sourceRef?.generatorId}`;
  return observation.unit === 'MWh' && observation.basis === 'monthly-nameplate'
    && observation.sourceId === 'us-eia-860m' && Array.isArray(project.sourceIds) && project.sourceIds.includes(observation.sourceId)
    && observation.sourceRecordId === key && /^\d{4}-(0[1-9]|1[0-2])$/.test(observation.reportingPeriod)
    && Number.isFinite(observation.value) && observation.value > 0
    ? [] : ['energyObservation must be a positive, sourced monthly MWh observation'];
}
