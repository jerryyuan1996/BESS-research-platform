import {evaluationCorpusProblems,runManualShadowCase} from '../../policy/manual-evaluation.mjs';
import {reserveManualCall} from '../../policy/manual-reservation.mjs';
import {authorizationProblems} from '../../policy/authorization.mjs';
import {scanManualEvidence,manualSemanticValidator} from './manual-evaluation-guards.mjs';

/** Trusted, explicitly approved runner only. Production activation remains
 * independent; no output here has a publisher or investment-writer handle. */
export async function runReservedManualCase({repo,cases,caseId,config,profiles,invoke,now=new Date()}){
  const selected=cases?.find(c=>c.id===caseId);
  const errors=evaluationCorpusProblems(cases);
  errors.push(...authorizationProblems({...config,validatedGoldCases:12}));
  if(config?.manualEvaluationApproved!==true)errors.push('Separate manual evaluation approval missing');
  if(!selected||!profiles?.some(p=>p.reviewed&&p.rightsReviewed&&p.sourceIds?.includes(selected.source.id)))errors.push('Independent reviewed source profile missing');
  if(typeof invoke!=='function')errors.push('Approved transport missing');
  if(errors.length)return {status:'disabled',canPublish:false,problems:errors};
  if(!await scanManualEvidence({body:selected.body,source:selected.source}))return {status:'quarantined',canPublish:false};
  const ledger=await reserveManualCall({repo,caseId,config,now});
  const marketIds=['de','gb','nem','wa'];const context={marketIds,allowedHosts:profiles.filter(p=>p.reviewed&&p.rightsReviewed).map(p=>p.host)};
  return runManualShadowCase({cases,caseId,config,ledger,invoke,context,now,scanEvidence:scanManualEvidence,independentCheck:manualSemanticValidator({profiles,marketIds,publicReferences:{}})});
}
