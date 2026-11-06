import { createHash } from 'node:crypto';
import { canonical } from './canonical.mjs';
export { canonical } from './canonical.mjs';
export const digest = value => createHash('sha256').update(typeof value==='string'?value:JSON.stringify(canonical(value))).digest('hex');
export const sourceDigest = text => `sha256:${digest(text)}`;
export function policyContentDigest(snapshot){
  return digest(Object.fromEntries(['sources','instruments','events','claims','impacts','stories','links','reviews'].map(kind=>[kind,(snapshot[kind]||[]).map(record=>{
    const copy={...record};if(kind==='sources')delete copy.checkedAt;if(kind==='events')delete copy.verifiedAt;return copy;
  })])));
}
export function snapshotDiff(before,after){
  const changes=[];
  for(const kind of ['sources','instruments','events','claims','impacts','stories','links','reviews']){
    const old=new Map((before?.[kind]||[]).map(x=>[x.id,x]));const next=new Map((after?.[kind]||[]).map(x=>[x.id,x]));
    for(const id of new Set([...old.keys(),...next.keys()]))if(digest(old.get(id)??null)!==digest(next.get(id)??null))changes.push({kind,id,before:old.get(id)??null,after:next.get(id)??null});
  }
  return changes;
}
export function verifyEvidenceHashes(snapshot,bodies,{retainedSourceIds=new Set(),retainedClaimIds=new Set(),quoteProofs=new Map()}={}){
  const errors=snapshot.sources.flatMap(s=>!bodies.has(s.id)&&retainedSourceIds.has(s.id)?[]:typeof bodies.get(s.id)!=='string'||sourceDigest(bodies.get(s.id))!==s.contentHash?[`${s.id}: source body hash mismatch`]:[]);
  for(const claim of snapshot.claims)for(const e of claim.evidence||[]){
    if(e.reproduction!=='withheld'||retainedClaimIds.has(claim.id))continue;
    const quote=quoteProofs.get(e.source+':'+e.quoteHash),body=bodies.get(e.source);
    if(typeof quote!=='string'||!quote||quote.length>300||sourceDigest(quote)!==e.quoteHash||typeof body!=='string'||!body.includes(quote))errors.push(`${claim.id}: withheld quotation proof hash or original span mismatch`);
  }
  return errors;
}

const COLLECTIONS=['sources','instruments','events','claims','impacts','stories','links','reviews'];
/** A replay packet includes metadata and ordering: reorders cannot disappear. */
export function versionDelta(before,after){
  const metadata=s=>Object.fromEntries(Object.entries(s).filter(([k])=>!COLLECTIONS.includes(k)));
  return {fromHash:digest(before),toHash:digest(after),beforeMetadata:metadata(before),afterMetadata:metadata(after),order:Object.fromEntries(COLLECTIONS.map(k=>[k,after[k].map(x=>x.id)])),changes:snapshotDiff(before,after)};
}
export function replayVersion(before,delta){
  if(digest(before)!==delta.fromHash)throw new Error('Replay parent does not match');
  const output=structuredClone(delta.afterMetadata);
  for(const kind of COLLECTIONS){
    const records=new Map(before[kind].map(x=>[x.id,structuredClone(x)]));
    for(const change of delta.changes.filter(x=>x.kind===kind)){
      if(digest(records.get(change.id)??null)!==digest(change.before))throw new Error('Replay before-value does not match');
      if(change.after===null)records.delete(change.id);else records.set(change.id,structuredClone(change.after));
    }
    if(new Set(delta.order[kind]).size!==records.size)throw new Error('Replay order does not match records');
    output[kind]=delta.order[kind].map(id=>{if(!records.has(id))throw new Error('Replay has unknown identity');return records.get(id);});
  }
  if(digest(output)!==delta.toHash)throw new Error('Replay result checksum does not match');
  return output;
}
