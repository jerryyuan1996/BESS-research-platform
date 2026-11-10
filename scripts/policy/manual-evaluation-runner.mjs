import {manualRequestProblems} from './manual-request.mjs';
import {evaluationCorpusProblems,runManualShadowCase} from '../../policy/manual-evaluation.mjs';
import {reserveManualCall,recordManualOutcome} from '../../policy/manual-reservation.mjs';
import {digest} from '../../policy/integrity.mjs';
import {authorizationProblems} from '../../policy/authorization.mjs';
import {sourceTransmissionProblems} from '../../policy/source-use.mjs';
import {scanManualEvidence,manualSemanticValidator} from './manual-evaluation-guards.mjs';

/** Trusted, explicitly approved runner only. Production activation remains
 * independent; no output here has a publisher or investment-writer handle. */
export async function runReservedManualCase({repo,cases,caseId,config,profiles,invoke,makeInvoke,request,requestId,now=new Date(),evidenceProofs}){
  const selected=cases?.find(c=>c.id===caseId);
  const errors=evaluationCorpusProblems(cases,{evidenceProofs});
  errors.push(...authorizationProblems({...config,validatedGoldCases:12}));
  if(config?.manualEvaluationApproved!==true)errors.push('Separate manual evaluation approval missing');
  if(!selected||!profiles?.some(p=>p.reviewed&&p.rightsReviewed&&p.sourceIds?.includes(selected.source.id)))errors.push('Independent reviewed source profile missing');
  errors.push(...await manualRequestProblems({request,requestId,cases,caseId,config,now}));
  if(typeof invoke!=='function'&&typeof makeInvoke!=='function')errors.push('Approved transport missing');
  const sourceUseReviews=new Map();
  if(selected){const profile=profiles?.find(p=>p.reviewed&&p.rightsReviewed&&p.sourceIds?.includes(selected.source.id)),review=profile?.sourceUseReviews?.get(selected.source.id);if(review)sourceUseReviews.set(selected.source.id,review);errors.push(...sourceTransmissionProblems([{source:selected.source}],sourceUseReviews));}
  if(errors.length)return {status:'disabled',canPublish:false,providerRequests:0,problems:errors};
  if(!await scanManualEvidence({body:selected.body,source:selected.source}))return {status:'quarantined',canPublish:false,providerRequests:0};
  const ledger=await reserveManualCall({repo,caseId,config,now,request});
  const marketIds=['de','gb','nem','wa'];const context={marketIds,sourceUseReviews,allowedHosts:profiles.filter(p=>p.reviewed&&p.rightsReviewed).map(p=>p.host)};
  let providerRequests=0,tokenCountRequests=0,transport;
  const getTransport=()=>transport??=(invoke??makeInvoke(config));
  const countInputTokens=async input=>{if(tokenCountRequests)throw Error('Manual token count already requested');tokenCountRequests++;const approved=getTransport();if(typeof approved.countInputTokens!=='function')throw Error('Approved provider token-count preflight missing');return approved.countInputTokens(input);};
  const counted=async input=>{if(providerRequests)throw Error('Manual request already invoked');providerRequests++;return getTransport()(input);};
  const result=await runManualShadowCase({cases,caseId,config,ledger,invoke:counted,countInputTokens,context,now,scanEvidence:scanManualEvidence,independentCheck:manualSemanticValidator({profiles,marketIds,publicReferences:{}}),evidenceProofs});
  result.providerRequests=providerRequests;result.tokenCountRequests=tokenCountRequests;
  await recordManualOutcome({repo,reservation:ledger.reservation,result,caseHash:digest(selected),sourceHash:selected.source.contentHash,originalSourceHash:selected.originalByteHash,config});
  return result;
}
