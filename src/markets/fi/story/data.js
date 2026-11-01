/* Committed public observations only. No API key, forecast fill or revenue bridge. */
import {snapshotPath} from '../../../governance/datasets.js';
import {FI_PRICE_SERIES} from '../data/storyEvidence.js';
const allowed=new Set(['fi-storage-capacity',...FI_PRICE_SERIES.map(p=>p.id)]);
const cache=new Map();
export function validSnapshot(json,id){
  if(!allowed.has(id)||json?.datasetId!==id||json.schemaVersion!==1||json.authority!=='observed'||!Array.isArray(json.series)||!json.series.length)return false;
  if(id==='fi-storage-capacity'?(json.units?.power!=='MW'||json.units?.price):(json.units?.price!=='EUR/MW/h'||json.units?.power))return false;
  let last=-Infinity;
  for(const p of json.series){const t=Date.parse(p.t);if(!Number.isFinite(t)||t<=last||!Number.isFinite(p.v)||(id==='fi-storage-capacity'&&p.v<0))return false;last=t;}
  return true;
}
export function loadSnapshot(id,{reload=false}={}){
  if(!allowed.has(id))return Promise.resolve(null);
  if(reload)cache.delete(id);
  if(!cache.has(id))cache.set(id,fetch(snapshotPath(id),{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(json=>validSnapshot(json,id)?json:null).catch(()=>null));
  return cache.get(id);
}
