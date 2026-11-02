/* No request occurs on import. Only the opened story asks for these summaries. */
import {datasetById,summaryPath} from '../../../governance/datasets.js';
export const RESPONSE_DATASETS=['gb-dynamic-response','gb-eac-response'];
const services=new Set(['DCL','DCH','DRL','DRH','DML','DMH']);
const cache=new Map();
const finite=Number.isFinite;
const canonical=value=>{
  if(value===null||typeof value!=='object')return value;
  if(Array.isArray(value))return value.map(canonical);
  return Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])]));
};
async function checksum(body){
  if(!globalThis.crypto?.subtle)return null;
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(canonical(body))));
  return 'sha256:'+Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
}
export async function validSummary(json,id){
  if(!RESPONSE_DATASETS.includes(id)||!datasetById(id)?.republishable||json?.datasetId!==id||json.schemaVersion!==1||json.summarySchemaVersion!==1||json.authority!=='observed')return false;
  if(json.units?.price!=='GBP/MW/h'||json.units?.power!=='MW'||!Array.isArray(json.monthly)||!json.monthly.length)return false;
  const registered=datasetById(id);
  if(json.source?.attribution!==registered.source.attribution||json.source?.licence!==registered.source.licence||json.source?.url!==registered.source.url||!json.sourceSnapshot?.contentChecksum||!finite(Date.parse(json.fetchedAt)))return false;
  const seen=new Set();let last='';
  for(const r of json.monthly){
    const key=r.month+'/'+r.service+'/'+r.basis;
    if(!/^\d{4}-\d\d$/.test(r.month)||!services.has(r.service)||!['accepted-bid','clearing'].includes(r.basis)||seen.has(key)||r.month<last)return false;
    if(!(r.price===null||finite(r.price))||!finite(r.clearedMW)||r.clearedMW<0||!Number.isInteger(r.blocks)||r.blocks<=0||!finite(Date.parse(r.from))||!finite(Date.parse(r.to))||r.from>=r.to)return false;
    if(r.batteryMW===null){if(r.otherMW!==null||!r.missingTechnology)return false;}
    else if(!finite(r.batteryMW)||!finite(r.otherMW)||r.batteryMW<0||r.otherMW<0||Math.abs(r.batteryMW+r.otherMW-r.clearedMW)>.00001)return false;
    seen.add(key);last=r.month;
  }
  const {summaryChecksum,...body}=json;
  return summaryChecksum===await checksum(body);
}
export function loadSummary(id,{reload=false,fetcher=globalThis.fetch}={}){
  if(!RESPONSE_DATASETS.includes(id)||!datasetById(id)?.republishable)return Promise.resolve(null);
  if(reload)cache.delete(id);
  if(!cache.has(id))cache.set(id,Promise.resolve().then(()=>fetcher(summaryPath(id),{cache:'no-cache'})).then(r=>r.ok?r.json():null).then(async j=>await validSummary(j,id)?j:null).catch(()=>null));
  return cache.get(id);
}
export async function loadResponseData(options){
  const all=await Promise.all(RESPONSE_DATASETS.map(id=>loadSummary(id,options)));
  if(all.some(d=>!d))return null;
  return {sources:all,rows:all.flatMap(d=>d.monthly.map(r=>({...r,platform:d.datasetId==='gb-dynamic-response'?'dynamic':'eac'})))};
}
