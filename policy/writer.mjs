/** Separate policy-only boundary. No investment writer or model access. */
import { lstat, realpath, mkdir, readFile, open, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { validatePolicySnapshot } from './schema.mjs';
import { digest, verifyEvidenceHashes,policyContentDigest } from './integrity.mjs';
import { retainedProofs } from './retained.mjs';
import { quotationRightsProblems } from './quotation-rights.mjs';
import { pendingReviewIndex } from './review-index.mjs';

export const POLICY_RELATIVE_ROOT='public/data/public/policy';
const FILE=/^(?:index\.json|snapshots\/[a-f0-9]{64}\.json)$/;
export async function assertPolicyWritable(repo,relative){
  if(typeof relative!=='string'||!FILE.test(relative))throw new Error('Policy write rejected: path outside explicit allowlist');
  const root=await realpath(repo);let target=root;
  for(const part of [...POLICY_RELATIVE_ROOT.split('/'),...relative.split('/')]){
    target=path.join(target,part);
    try{if((await lstat(target)).isSymbolicLink())throw new Error('Policy write rejected: symbolic path');}catch(e){if(e.code!=='ENOENT')throw e;}
  }
  return target;
}
async function readJSON(file){try{return JSON.parse(await readFile(file,'utf8'));}catch(e){if(e.code==='ENOENT')return null;throw e;}}
/** Prior committed, hash-verified approval may be retained only for byte-identical
 * records. This avoids refetching lost historical bodies or fabricating checks.
 * Candidates cannot supply this proof: it is read from the existing store. */
export async function retainedVerification(repo,snapshot,expectedParent){
  const index=await readJSON(await assertPolicyWritable(repo,'index.json'));
  if(!index)return retainedProofs(null,null,snapshot);if(index.head!==expectedParent)throw new Error('Policy rejected: concurrent parent');
  const previous=await readJSON(await assertPolicyWritable(repo,`snapshots/${index.head}.json`));if(!previous||digest(previous)!==index.head)throw new Error('Policy rejected: corrupt retained history');
  return retainedProofs(index,previous,snapshot);
}
/** An immutable version is installed before the index pointer. Orphan versions are safe after a crash. */
export async function publishPolicySnapshot({repo,snapshot,context,bodies,expectedParent,enabled=false}){
  if(!enabled)throw new Error('Policy publication is disabled');
  if(Buffer.byteLength(JSON.stringify(snapshot),'utf8')>4_000_000)throw new Error('Policy snapshot exceeds the reader size budget');
  const already=await readJSON(await assertPolicyWritable(repo,'index.json'));const candidateHash=digest(snapshot);
  if(already?.head===candidateHash)return {changed:false,head:candidateHash};
  if(already){const previous=await readJSON(await assertPolicyWritable(repo,`snapshots/${already.head}.json`));if(!previous||digest(previous)!==already.head)throw new Error('Policy rejected: corrupt prior version');if(policyContentDigest(previous)===policyContentDigest(snapshot)){if(expectedParent!==already.head||snapshot.parent!==already.head)throw new Error('Policy rejected: concurrent parent');return {changed:false,head:already.head};}}
  const retained=await retainedVerification(repo,snapshot,expectedParent);
  const trusted={...context,attestations:new Map([...retained.attestations,...(context?.attestations||[])]),sourceReviews:new Map([...retained.sourceReviews,...(context?.sourceReviews||[])]),storyReviews:new Map([...retained.storyReviews,...(context?.storyReviews||[])]),humanReviewDecisions:new Map([...retained.humanReviewDecisions,...(context?.humanReviewDecisions||[])])};
  const errors=validatePolicySnapshot(snapshot,{...trusted,evidenceBodies:bodies,retainedClaimIds:retained.claimIds});
  if(context?.publicationReviewHash!==candidateHash)errors.push('Independent complete-record publication review missing');
  // Candidate JSON cannot approve its own legal meaning or translation. These
  // attestations must arrive through the independent validator/reviewer channel,
  // never copied from model fields. A body containing a word proves no legal state.
  for(const claim of snapshot.claims||[]){
    const attestation=trusted.attestations.get(claim.id);
    if(!attestation||attestation.claimHash!==digest(claim)||attestation.supported!==true||attestation.translationEquivalent!==true)
      errors.push(`${claim.id}: independent evidence/translation attestation missing`);
  }
  if(!(bodies instanceof Map))errors.push('Verified source bodies required');
  else errors.push(...verifyEvidenceHashes(snapshot,bodies,{quoteProofs:trusted.quoteProofs,retainedSourceIds:retained.sourceIds,retainedClaimIds:retained.claimIds}));
  errors.push(...quotationRightsProblems(snapshot,trusted.sourceReviews));
  for(const link of snapshot.links||[]){
    if(link.state!=='unmapped'&&context?.resolver?.resolve(link)?.state==='unmapped')errors.push(`${link.id}: unresolved investment dependency`);
    if(link.state!=='unmapped'&&!context?.resolver)errors.push(`${link.id}: independent public investment resolver required`);
  }
  for(const story of snapshot.stories||[]){
    const review=trusted.storyReviews.get(story.id);
    if(!review||review.storyHash!==digest(story)||review.supported!==true||review.translationEquivalent!==true)errors.push(`${story.id}: independent narrative/translation review missing`);
  }
  for(const review of snapshot.reviews||[]){
    if(review.status!=='pending_reassessment'&&trusted.humanReviewDecisions.get(review.id)?.reviewHash!==digest(review))errors.push(`${review.id}: only an independent analyst decision may resolve or defer an investment review`);
  }
  if(errors.length)throw new Error(`Policy rejected: ${errors.join('; ')}`);
  const indexPath=await assertPolicyWritable(repo,'index.json');await mkdir(path.dirname(indexPath),{recursive:true});
  const lock=await open(indexPath+'.lock','wx');
  try{
    const current=await readJSON(indexPath);const parent=current?.head??null;
    const hash=digest(snapshot);
    if(parent===hash)return {changed:false,head:hash};
    if(parent!==expectedParent||snapshot.parent!==parent)throw new Error('Policy rejected: concurrent or missing parent');
    if(current){
      const previous=await readJSON(await assertPolicyWritable(repo,`snapshots/${parent}.json`));
      if(!previous||digest(previous)!==parent)throw new Error('Policy rejected: corrupt parent history');
      for(const event of previous.events)if(digest(snapshot.events.find(x=>x.id===event.id)??null)!==digest(event))throw new Error('Policy rejected: historical event mutation; append a correction');
      for(const source of previous.sources){
        const next=snapshot.sources.find(x=>x.id===source.id);
        if(!next||['contentHash','url','locator','language','authority'].some(k=>next[k]!==source[k]))throw new Error('Policy rejected: source history removed or mutated; use a new source revision');
      }
    }
    const versionPath=await assertPolicyWritable(repo,`snapshots/${hash}.json`);await mkdir(path.dirname(versionPath),{recursive:true});
    const existing=await readJSON(versionPath);
    if(existing&&digest(existing)!==hash)throw new Error('Policy rejected: immutable version collision');
    if(!existing){const handle=await open(versionPath,'wx');try{await handle.writeFile(JSON.stringify(snapshot,null,2)+'\n');await handle.sync();}finally{await handle.close();}}
    const pendingReviews=pendingReviewIndex(snapshot);
    const verification={sources:Object.fromEntries(snapshot.sources.map(s=>{const p=trusted.sourceReviews.get(s.id);return [s.id,{sourceHash:p.sourceHash,maxQuoteChars:p.maxQuoteChars}];})),claims:Object.fromEntries(snapshot.claims.map(c=>[c.id,{claimHash:digest(c),supported:true,translationEquivalent:true}])),stories:Object.fromEntries(snapshot.stories.map(s=>[s.id,{storyHash:digest(s),supported:true,translationEquivalent:true}])),reviewDecisions:Object.fromEntries(snapshot.reviews.filter(r=>trusted.humanReviewDecisions.has(r.id)).map(r=>[r.id,{reviewHash:digest(r)}]))};
    verification.records=Object.fromEntries(['instruments','events','impacts','stories','links','reviews'].map(kind=>[kind,Object.fromEntries(snapshot[kind].map(r=>[r.id,digest(r)]))]));
    const index={schemaVersion:1,head:hash,versions:[...(current?.versions||[]),hash],publishedAt:snapshot.createdAt,pendingReviews,verification};
    if(index.versions.length>10000||Buffer.byteLength(JSON.stringify(index),'utf8')>1_000_000)throw new Error('Policy index exceeds the reader history budget');
    const temp=indexPath+'.'+randomUUID()+'.tmp';
    const handle=await open(temp,'wx');try{await handle.writeFile(JSON.stringify(index,null,2)+'\n');await handle.sync();}finally{await handle.close();}
    await rename(temp,indexPath);
    return {changed:true,head:hash};
  }finally{await lock.close();await unlink(indexPath+'.lock');}
}
