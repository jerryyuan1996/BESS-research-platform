import {lstat,readdir,readFile} from 'node:fs/promises';
import path from 'node:path';
import {digest} from './integrity.mjs';
import {authorizationProblems} from './authorization.mjs';
import {evaluateHistoricalCases,approvedEvaluationProblems} from './evaluation.mjs';
import {validatePolicySnapshot} from './schema.mjs';
import {quotationRightsProblems} from './quotation-rights.mjs';
import {pendingReviewIndex} from './review-index.mjs';
/** Offline release gate. Index approval flags alone never authorize public data.
 * Trusted, reviewed source validators must also recognize the stored assertions. */
export async function verifyPolicyStore({repo,config,profiles,evaluation,marketIds=[],manualPublication={enabled:false}}){
  const directory=path.join(repo,'public/data/public/policy');
  let info;try{info=await lstat(directory);}catch(e){if(e.code==='ENOENT')return {versions:0,status:'unpublished'};throw e;}
  if(info.isSymbolicLink()||!info.isDirectory())throw Error('Invalid policy store boundary');
  const manual=manualPublication.enabled===true&&typeof manualPublication.approvalId==='string'&&manualPublication.approvalId.trim()&&Array.isArray(manualPublication.approvedHeads)&&manualPublication.approvedHeads.length>0&&manualPublication.approvedHeads.length<=10000&&new Set(manualPublication.approvedHeads).size===manualPublication.approvedHeads.length&&manualPublication.approvedHeads.every(hash=>/^[a-f0-9]{64}$/.test(hash));
  const modelErrors=authorizationProblems(config);
  if(config.publicationEnabled!==true)modelErrors.push('Policy publication is OFF');
  const automatic=modelErrors.length===0;
  const errors=manual?[]:modelErrors;
  errors.push(...approvedEvaluationProblems(evaluation,{requireModel:automatic,model:config.model}));
  errors.push(...evaluateHistoricalCases(evaluation.cases).blockers);
  if(!profiles.length||profiles.some(p=>!p.reviewed||!p.rightsReviewed||!p.host||!Array.isArray(p.sourceIds)||!Number.isInteger(p.maxQuoteChars)||p.maxQuoteChars<0||typeof p.verifyStoredSnapshot!=='function'))errors.push('Independent offline source validators missing');
  if(errors.length)throw Error(`Public policy release blocked: ${errors.join('; ')}`);
  async function json(relative,limit){const target=path.join(directory,relative);const stat=await lstat(target);if(stat.isSymbolicLink()||!stat.isFile()||stat.size>limit)throw Error('Invalid policy store file');return JSON.parse(await readFile(target,'utf8'));}
  const index=await json('index.json',1_000_000);
  if(Object.keys(index).some(key=>!['schemaVersion','head','versions','publishedAt','pendingReviews','verification'].includes(key))||index.schemaVersion!==1||!Array.isArray(index.versions)||!index.versions.length||index.versions.length>10000||new Set(index.versions).size!==index.versions.length||index.versions.at(-1)!==index.head)throw Error('Invalid policy version index');
  const snapshots=path.join(directory,'snapshots');if((await lstat(snapshots)).isSymbolicLink())throw Error('Symbolic policy versions rejected');
  let parent=null,previous=null,lastSourceReviews=null;
  for(const hash of index.versions){
    if(!/^[a-f0-9]{64}$/.test(hash))throw Error('Invalid policy version identity');
    const snapshot=await json(`snapshots/${hash}.json`,4_000_000);
    if(digest(snapshot)!==hash||snapshot.parent!==parent)throw Error('Broken policy history checksum or chain');
    if(!automatic&&!manualPublication.approvedHeads.includes(hash))throw Error('Policy snapshot lacks exact manual release approval');
    const schemaErrors=validatePolicySnapshot(snapshot,{marketIds,allowedHosts:profiles.map(p=>p.host)});
    if(schemaErrors.length)throw Error('Stored policy violates the canonical evidence schema');
    const sourceReviews=new Map(snapshot.sources.map(source=>{
      const profile=profiles.find(p=>p.host===new URL(source.url).hostname&&p.sourceIds.includes(source.id));
      if(!profile)throw Error('Stored source lacks its reviewed identity');
      return [source.id,{sourceHash:digest(source),maxQuoteChars:profile.maxQuoteChars}];
    }));
    if(quotationRightsProblems(snapshot,sourceReviews).length)throw Error('Stored policy exceeds reviewed document quotation rights');
    if(previous){
      for(const event of previous.events)if(digest(snapshot.events.find(e=>e.id===event.id)??null)!==digest(event))throw Error('Stored policy rewrites immutable event history');
      for(const source of previous.sources){const next=snapshot.sources.find(s=>s.id===source.id);if(!next||['contentHash','url','locator','language','authority'].some(key=>source[key]!==next[key]))throw Error('Stored policy rewrites original source history');}
    }
    if(!profiles.some(profile=>profile.verifyStoredSnapshot({snapshot,index})===true))throw Error('Stored policy assertions lack independent source validation');
    parent=hash;previous=snapshot;lastSourceReviews=sourceReviews;
  }
  if(index.publishedAt!==previous.createdAt||digest(index.pendingReviews)!==digest(pendingReviewIndex(previous)))throw Error('Public policy index does not match the approved snapshot');
  const proofs=new Map(previous.sources.map(source=>{
    const cap=index.verification?.sources?.[source.id]?.maxQuoteChars;
    if(!Number.isInteger(cap)||cap<0||cap>lastSourceReviews.get(source.id).maxQuoteChars)throw Error('Policy index rights proof exceeds independent approval');
    return [source.id,{sourceHash:digest(source),maxQuoteChars:cap}];
  }));
  const verification={sources:Object.fromEntries(proofs),claims:Object.fromEntries(previous.claims.map(c=>[c.id,{claimHash:digest(c),supported:true,translationEquivalent:true}])),stories:Object.fromEntries(previous.stories.map(s=>[s.id,{storyHash:digest(s),supported:true,translationEquivalent:true}])),reviewDecisions:{},records:Object.fromEntries(['instruments','events','impacts','stories','links','reviews'].map(kind=>[kind,Object.fromEntries(previous[kind].map(r=>[r.id,digest(r)]))]))};
  for(const [id,proof]of Object.entries(index.verification?.reviewDecisions||{})){
    const review=previous.reviews.find(r=>r.id===id);if(!review||proof.reviewHash!==digest(review))throw Error('Policy index has an unbound analyst decision');verification.reviewDecisions[id]={reviewHash:digest(review)};
  }
  if(previous.reviews.some(review=>review.status!=='pending_reassessment'&&!verification.reviewDecisions[review.id]))throw Error('Resolved policy review lacks an analyst decision');
  if(digest(index.verification)!==digest(verification)||quotationRightsProblems(previous,proofs).length)throw Error('Policy index contains unapproved proof fields or quotation rights');
  const files=await readdir(snapshots);if(files.some(file=>!index.versions.includes(file.replace(/\.json$/,''))||!file.endsWith('.json')))throw Error('Unindexed policy snapshot cannot ship');
  if((await readdir(directory)).some(file=>!['index.json','snapshots'].includes(file)))throw Error('Unexpected public policy asset');
  return {status:'verified',versions:index.versions.length,head:index.head,authorization:automatic?'validated_model':'exact_manual_snapshots'};
}
