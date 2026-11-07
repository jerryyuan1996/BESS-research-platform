import { canonical } from '../../policy/canonical.mjs';
import { validatePolicySnapshot,isTime } from '../../policy/schema.mjs';
const HASH=/^[a-f0-9]{64}$/;
const cache=new Map();
let knownIndex=null;
async function json(response,limit=4_000_000){
  const reader=response.body.getReader();const decoder=new TextDecoder();let bytes=0,text='';
  while(true){const part=await reader.read();if(part.done)break;bytes+=part.value.byteLength;if(bytes>limit){await reader.cancel();throw new Error('Policy response exceeds size limit');}text+=decoder.decode(part.value,{stream:true});}
  text+=decoder.decode();return JSON.parse(text);
}
export async function contentDigest(value){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(canonical(value))));return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');}
export async function loadPolicyIndex({fetcher=fetch}={}){
  const response=await fetcher('/data/public/policy/index.json',{cache:'no-cache'});
  if(response.status===404)return null;
  if(!response.ok)throw new Error('Policy index unavailable');
  // An unpublished JSON path receives the static SPA's HTML fallback. It is
  // never evidence. After a valid index was seen, HTML is an availability fault.
  if((response.headers.get('content-type')||'').includes('text/html')){await response.body?.cancel();if(knownIndex)throw new Error('Policy index unexpectedly returned HTML');return null;}
  const index=await json(response,1_000_000);
  if(index.schemaVersion!==1||!HASH.test(index.head)||!Array.isArray(index.versions)||index.versions.length>10000||index.versions.some(x=>!HASH.test(x))||new Set(index.versions).size!==index.versions.length||!index.versions.includes(index.head)||!isTime(index.publishedAt))throw new Error('Invalid policy index');
  knownIndex=index;return index;
}
export async function loadPolicySnapshot(index,{version=index?.head,marketIds=[],fetcher=fetch}={}){
  if(!index)return null;
  if(!HASH.test(version||'')||!index.versions.includes(version))throw new Error('Unknown policy version');
  if(cache.has(version))return cache.get(version);
  const response=await fetcher(`/data/public/policy/snapshots/${version}.json`,{cache:'no-cache'});if(!response.ok)throw new Error('Policy snapshot unavailable');
  const snapshot=await json(response);
  if(await contentDigest(snapshot)!==version)throw new Error('Policy content checksum mismatch');
  // The browser checks structure/safe links and transport integrity. Source
  // approval is enforced independently by the Node publisher and release gate;
  // deriving these hosts does not grant authority to a model or source.
  const hosts=snapshot.sources?.map(s=>{try{return new URL(s.url).hostname;}catch{return '';}})||[];
  if(validatePolicySnapshot(snapshot,{marketIds,allowedHosts:hosts}).length)throw new Error('Invalid policy snapshot');
  cache.set(version,snapshot);return snapshot;
}
export function policyDiff(before,after){
  const changes=[];
  for(const kind of ['instruments','events','claims','impacts','stories','links','reviews']){
    const a=new Map((before?.[kind]||[]).map(x=>[x.id,x]));const b=new Map((after?.[kind]||[]).map(x=>[x.id,x]));
    for(const id of new Set([...a.keys(),...b.keys()]))if(JSON.stringify(canonical(a.get(id)??null))!==JSON.stringify(canonical(b.get(id)??null)))changes.push({kind,id,before:a.get(id)??null,after:b.get(id)??null});
  }
  return changes;
}
