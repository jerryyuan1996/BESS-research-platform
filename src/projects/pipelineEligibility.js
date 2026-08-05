/* A project register can inform saturation only when its coverage is auditable.
   Illustrative rows remain useful product-development artefacts, but the
   decision model treats them as excluded rather than as zero competition. */

export const PIPELINE_REQUIRED_FIELDS = [
  'coverageBoundary',
  'sources',
  'lastUpdated',
  'stableIdMethod',
  'deduplicationMethod',
  'stageDefinition',
  'durationCoverage',
  'componentTreatment',
  'inclusionRules',
  'limitations',
];

export function validatePipelineDataset(dataset){
  const problems = [];
  for (const field of PIPELINE_REQUIRED_FIELDS){
    const value = dataset?.[field];
    if (value == null || value === '' || (Array.isArray(value) && value.length === 0)){
      problems.push(field + ' is required');
    }
  }
  if (dataset?.lastUpdated && Number.isNaN(Date.parse(dataset.lastUpdated))){
    problems.push('lastUpdated must be a date');
  }
  if (dataset?.illustrative === true) problems.push('illustrative datasets are not decision-eligible');
  if (dataset?.namedProjects === false) problems.push('unnamed projects are not decision-eligible');
  return problems;
}

export function pipelineEligibility(dataset){
  const problems = validatePipelineDataset(dataset);
  return {
    eligible: problems.length === 0,
    problems,
    status: problems.length === 0 ? 'included' : 'excluded',
  };
}

