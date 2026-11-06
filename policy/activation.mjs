import {authorizationProblems,worstCaseModelUSD} from './authorization.mjs';
import {evaluateHistoricalCases,approvedEvaluationProblems} from './evaluation.mjs';
/** One trusted preflight for workflow and manual entry points alike. */
export function activationProblems({config,sources,profiles,evaluation}){
  const errors=authorizationProblems(config);
  if(!sources.length||sources.some(s=>!s.reviewed||!s.rightsReviewed))errors.push('Source authority and rights approval incomplete');
  if(!profiles.length||profiles.some(p=>!p.reviewed||!p.rightsReviewed||typeof p.verifyStoredSnapshot!=='function'))errors.push('Independent source and stored-snapshot validators missing');
  errors.push(...approvedEvaluationProblems(evaluation,{requireModel:true,model:config.model}));
  errors.push(...evaluateHistoricalCases(evaluation.cases).blockers);
  if(Number.isFinite(config.maxDailyUSD)&&worstCaseModelUSD(config)>config.maxDailyUSD)errors.push('Worst-case single request exceeds the daily cost cap');
  return errors;
}
