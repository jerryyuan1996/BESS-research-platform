import {evaluationCorpusProblems,runManualShadowCase} from '../../policy/manual-evaluation.mjs';
import {reserveManualCall,recordManualOutcome} from '../../policy/manual-reservation.mjs';
import {digest} from '../../policy/integrity.mjs';
import {authorizationProblems} from '../../policy/authorization.mjs';
import {scanManualEvidence,manualSemanticValidator} from './manual-evaluation-guards.mjs';

/** Trusted, explicitly approved runner only. Production activation remains
 * independent; no output here has a publisher or investment-writer handle. */
export async function runReservedManualCase({repo,cases,caseId,config,profiles,invoke,now=new Date(),evidenceProofs}){
  const selected=cases?.find(c=>c.id===caseId);
  const errors=evaluationCorpusProblems(cases,{evidenceProofs});
  errors.push(...authorizationProblems({...config,validatedGoldCases:12}));
  if(config?.manualEvaluationApproved!==true)errors.push('Separate manual evaluation approval missing');
  if(!selected||!profiles?.some(p=>p.reviewed&&p.rightsReviewed&&p.sourceIds?.includes(selected.source.id)))errors.push('Independent reviewed source profile missing');
  if(typeof invoke!=='function')errors.push('Approved transport missing');
  if(errors.length)return {status:'disabled',canPublish:false,providerRequests:0,problems:errors};
  if(!await scanManualEvidence({body:selected.body,source:selected.source}))return {status:'quarantined',canPublish:false,providerRequests:0};
  const ledger=await reserveManualCall({repo,caseId,config,now});
  const marketIds=['de','gb','nem','wa'];const context={marketIds,allowedHosts:profiles.filter(p=>p.reviewed&&p.rightsReviewed).map(p=>p.host)};
  let providerRequests=0;const counted=async input=>{providerRequests++;return invoke(input);};
  const result=await runManualShadowCase({cases,caseId,config,ledger,invoke:counted,context,now,scanEvidence:scanManualEvidence,independentCheck:manualSemanticValidator({profiles,marketIds,publicReferences:{}}),evidenceProofs});
  result.providerRequests=providerRequests;
  await recordManualOutcome({repo,reservation:ledger.reservation,result,caseHash:digest(selected),sourceHash:selected.source.contentHash,originalSourceHash:selected.originalByteHash,config});
  return result;
}
