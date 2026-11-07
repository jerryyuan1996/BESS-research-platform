/** Static source regression and actual model evaluation have different scope.
 * Neither method is accepted by labels alone or by this preparation tool. */
export function approvedEvaluationProblems(evaluation,{requireModel=false,model=null}={}){
  const errors=[];
  if(evaluation?.approved!==true)errors.push('Historical evaluation is not independently approved');
  if(!['deterministic_source_regression','model_shadow'].includes(evaluation?.method))errors.push('Historical evaluation method is not recorded');
  if(evaluation?.method==='model_shadow'&&(!evaluation.model||typeof evaluation.model!=='string'))errors.push('Historical model identity is missing');
  if(requireModel&&(evaluation?.method!=='model_shadow'||evaluation.model!==model))errors.push('Production model requires an independently approved evaluation of the configured model');
  return errors;
}
/** Source-reviewed measurements are distinct from synthetic contract fixtures.
 * The enclosing method identifies whether actual results concern static rules
 * or a named model; these counts alone never establish model accuracy. */
export function evaluateHistoricalCases(cases){
  const blockers=[];const ids=new Set();const markets=new Set();let tp=0,fp=0,fn=0,critical=0,unsupported=0;
  for(const row of cases){
    if(!row.id||ids.has(row.id))blockers.push('Duplicate or missing historical case identity');ids.add(row.id);markets.add(row.market);
    if(row.synthetic!==false||row.originalSourceVerified!==true||!row.reviewedBy||!row.sourceLocator||!/^https:\/\//.test(row.sourceURL||'')||!/^sha256:[a-f0-9]{64}$/.test(row.sourceHash||''))blockers.push(`${row.id}: source-reviewed historical provenance missing`);
    if(typeof row.expectedReview!=='boolean'||typeof row.actualReview!=='boolean'||!Number.isInteger(row.criticalAssertions)||!Number.isInteger(row.unsupportedAssertions)||row.criticalAssertions<0||row.unsupportedAssertions<0||row.unsupportedAssertions>row.criticalAssertions)blockers.push(`${row.id}: actual evaluation measurements missing`);
    else{critical+=row.criticalAssertions;unsupported+=row.unsupportedAssertions;if(row.expectedReview&&row.actualReview)tp++;if(!row.expectedReview&&row.actualReview)fp++;if(row.expectedReview&&!row.actualReview)fn++;}
  }
  if(cases.length<12)blockers.push('Fewer than 12 historical cases');for(const market of ['de','gb','nem','wa'])if(!markets.has(market))blockers.push(`No independent ${market} historical cases`);
  if(!critical)blockers.push('No actual critical assertion evaluation');if(unsupported)blockers.push('Unsupported critical assertions detected');
  return {cases:cases.length,eligible:blockers.length===0,blockers,criticalAssertions:critical,unsupportedAssertions:unsupported,precision:critical?(critical-unsupported)/critical:null,falseReviewPositives:fp,falseReviewNegatives:fn,reviewPrecision:tp+fp?tp/(tp+fp):null,reviewRecall:tp+fn?tp/(tp+fn):null};
}
