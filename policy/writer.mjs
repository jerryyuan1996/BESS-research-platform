/** Separate policy-only boundary. No investment writer or model access. */
import { lstat, realpath, mkdir, readFile, open, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { validatePolicySnapshot } from './schema.mjs';
import { digest, verifyEvidenceHashes } from './integrity.mjs';

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
/** An immutable version is installed before the index pointer. Orphan versions are safe after a crash. */
export async function publishPolicySnapshot({repo,snapshot,context,bodies,expectedParent,enabled=false}){
  if(!enabled)throw new Error('Policy publication is disabled');
  const errors=validatePolicySnapshot(snapshot,{...context,evidenceBodies:bodies});
  // Candidate JSON cannot approve its own legal meaning or translation. These
  // attestations must arrive through the independent validator/reviewer channel,
  // never copied from model fields. A body containing a word proves no legal state.
  for(const claim of snapshot.claims||[]){
    const attestation=context?.attestations?.get(claim.id);
    if(!attestation||attestation.claimHash!==digest(claim)||attestation.supported!==true||attestation.translationEquivalent!==true)
      errors.push(`${claim.id}: independent evidence/translation attestation missing`);
  }
  if(!(bodies instanceof Map))errors.push('Verified source bodies required');
  else errors.push(...verifyEvidenceHashes(snapshot,bodies));
  for(const source of snapshot.sources||[]){
    const review=context?.sourceReviews?.get(source.id);
    const quoted=(snapshot.claims||[]).flatMap(c=>c.evidence||[]).filter(e=>e.source===source.id).reduce((n,e)=>n+(e.quote?.length||0),0);
    if(!review||review.sourceHash!==digest(source)||!Number.isInteger(review.maxQuoteChars)||review.maxQuoteChars<0||quoted>review.maxQuoteChars)
      errors.push(`${source.id}: independent source/rights review missing or quotation allowance exceeded`);
  }
  for(const link of snapshot.links||[]){
    if(link.state!=='unmapped'&&context?.resolver?.resolve(link)?.state==='unmapped')errors.push(`${link.id}: unresolved investment dependency`);
    if(link.state!=='unmapped'&&!context?.resolver)errors.push(`${link.id}: independent public investment resolver required`);
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
    const temp=indexPath+'.'+randomUUID()+'.tmp';
    const handle=await open(temp,'wx');try{await handle.writeFile(JSON.stringify({schemaVersion:1,head:hash,versions:[...(current?.versions||[]),hash],publishedAt:snapshot.createdAt},null,2)+'\n');await handle.sync();}finally{await handle.close();}
    await rename(temp,indexPath);
    return {changed:true,head:hash};
  }finally{await lock.close();await unlink(indexPath+'.lock');}
}
