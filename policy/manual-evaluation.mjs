import {researchShadow} from './shadow.mjs';
import {sourceDigest} from './integrity.mjs';
import {hasVerifiedExtraction} from './extracted-evidence.mjs';

/** Trusted analyst-owned cases, never candidate-supplied labels. This library
 * has no filesystem, provider credential, publisher or investment writer. */
export function evaluationCorpusProblems(cases,{evidenceProofs=new Map()}={}){
  const errors=[];const ids=new Set(),markets=new Set();
  if(!Array.isArray(cases)||cases.length<12)return ['At least 12 independently labelled cases required'];
  for(const c of cases){
    if(!c.id||ids.has(c.id))errors.push('Duplicate or missing case identity');ids.add(c.id);markets.add(c.market);
    if(!c.reviewer||c.sourceReviewed!==true||c.rightsReviewed!==true||c.translationReviewed!==true||typeof c.expectedReview!=='boolean')errors.push(`${c.id}: independent labels, rights or translation review missing`);
    const verifiedOriginal=c.mediaType==='application/pdf'?hasVerifiedExtraction(c,evidenceProofs.get(c.id)):['text/html','text/plain'].includes(c.mediaType)&&c.originalByteHash===c.source?.contentHash;
    if(!c.source?.url?.startsWith('https://')||!c.locator||typeof c.body!=='string'||sourceDigest(c.body)!==c.source.contentHash||!verifiedOriginal)errors.push(`${c.id}: original source bytes, reproducible text provenance or locator missing`);
  }
  for(const market of ['de','gb','nem','wa'])if(!markets.has(market))errors.push(`${market}: case coverage missing`);
  return errors;
}

/** One externally reserved invocation. Expected labels are never passed to the
 * transport. The returned summary cannot grant live publication authority. */
export async function runManualShadowCase({cases,caseId,config,ledger,invoke,context,now,scanEvidence,independentCheck,evidenceProofs}){
  const problems=evaluationCorpusProblems(cases,{evidenceProofs});
  const selected=cases?.find(c=>c.id===caseId);
  if(problems.length||!selected)return {status:'disabled',problems,canPublish:false};
  const body=selected.body;const source=Object.fromEntries(['id','url','publisher','title','language','authority','locator','contentHash','issuedAt','checkedAt','rights'].filter(key=>key in selected.source).map(key=>[key,selected.source[key]]));
  if(source.rights)source.rights=Object.fromEntries(['metadata','termsURL','reviewed'].filter(key=>key in source.rights).map(key=>[key,source.rights[key]]));
  if(typeof scanEvidence!=='function'||await scanEvidence({body,source})!==true||typeof independentCheck!=='function')return {status:'disabled',problems:['Independent confidentiality and semantic validators required'],canPublish:false};
  const result=await researchShadow({changedDocuments:[{sourceId:source.id,source,excerpt:body}],invoke,config:{...config,validatedGoldCases:12},ledger,context,bodies:new Map([[source.id,body]]),now});
  if(result.status!=='shadow_valid')return {status:result.status,canPublish:false,usage:result.usage??null};
  if(await independentCheck({candidate:result.candidate,source,body})!==true)return {status:'quarantined',canPublish:false,usage:result.usage};
  const actualReview=result.reviews.length>0;
  return {status:'evaluated',caseId,expectedReview:selected.expectedReview,actualReview,matched:actualReview===selected.expectedReview,usage:result.usage,canPublish:false};
}
