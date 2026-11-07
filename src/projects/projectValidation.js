/* Complete-record checks belong to source readers, separate from map helpers. */
import { PROJECT_STAGE, PROJECT_TECHNOLOGY, isPlottable, validateEnergyObservation } from './projectValues.js';
const STAGES = new Set(Object.values(PROJECT_STAGE));
const TECHNOLOGIES = new Set(Object.values(PROJECT_TECHNOLOGY));

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
  problems.push(...validateProvenanceBlock(project?.provenance));
  problems.push(...validateEnergyObservation(project));
  return problems;
}

/* Provenance shape, checked here rather than only in the ETL so a record cannot
   reach the application claiming an authority it does not have. Kept as a plain
   check rather than an import: src/ must not depend on etl/, and this file is
   read by the browser. See etl/lib/provenance.mjs for the writer. */
const AUTHORITIES = new Set(['statutory', 'operator', 'community']);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function validateProvenanceBlock(block){
  /* Optional for now: the OSM connectors predate provenance and are migrated
     separately. A block that is PRESENT must be complete — a half-filled one is
     worse than none, because it looks like an answer. */
  if (block === undefined) return [];
  if (!block || typeof block !== 'object') return ['provenance must be an object'];

  const problems = [];
  if (!AUTHORITIES.has(block.authority)) problems.push(`provenance: unknown authority "${block.authority}"`);
  if (!block.dataset) problems.push('provenance: dataset is required');
  if (!block.publisher) problems.push('provenance: publisher is required');
  if (!ISO_DATE.test(String(block.ingestedAt || ''))) problems.push('provenance: ingestedAt must be an ISO date');
  if (block.publishedAt != null && !ISO_DATE.test(String(block.publishedAt))){
    problems.push('provenance: publishedAt must be an ISO date or null');
  }
  if (block.publishedAt && block.ingestedAt && block.publishedAt > block.ingestedAt){
    problems.push('provenance: publishedAt is after ingestedAt');
  }
  if (!('sourceRecordId' in block)) problems.push('provenance: sourceRecordId must be present, null where none exists');
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
