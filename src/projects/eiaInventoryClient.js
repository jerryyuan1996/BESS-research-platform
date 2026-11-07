import { EIA_DATASET_ID, EIA_MARKETS, validateEiaInventory } from './eiaInventorySchema.js';
import { replaceProjectsForSource } from './registry.js';
import { snapshotPath } from '../governance/datasets.js';
import { isLiveDataEnabled } from '../live/client.js';

const MAX_BYTES=12*1024*1024, TIMEOUT_MS=20000;
let pending=null,lastGood=null,registeredChecksum=null;
function canonical(value){
  if(value===null||typeof value!=='object')return value;
  if(Array.isArray(value))return value.map(canonical);
  return Object.fromEntries(Object.keys(value).sort().filter(k=>value[k]!==undefined).map(k=>[k,canonical(value[k])]));
}
async function checksum(value){
  const bytes=new TextEncoder().encode(JSON.stringify(canonical(value)));
  const hash=await crypto.subtle.digest('SHA-256',bytes);
  return 'sha256:'+Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join('');
}
export async function verifyEiaInventory(snapshot){
  const errors=validateEiaInventory(snapshot);
  if(errors.length)throw new Error('EIA inventory schema validation failed');
  const {envelopeChecksum,...envelope}=snapshot;
  if(await checksum(envelope)!==envelopeChecksum)throw new Error('EIA envelope checksum mismatch');
  const content={datasetId:snapshot.datasetId,marketId:snapshot.marketId,coverage:snapshot.coverage,units:snapshot.units,series:snapshot.series,derived:snapshot.derived};
  if(await checksum(content)!==snapshot.contentChecksum)throw new Error('EIA content checksum mismatch');
  if(await checksum(snapshot.series)!==snapshot.derived.inventory.revisions.at(-1).observationsChecksum)throw new Error('EIA revision observations mismatch');
  return snapshot;
}
function register(snapshot){
  if(registeredChecksum===snapshot.contentChecksum)return;
  const sources=snapshot.derived.inventory.sources;
  for(const market of Object.keys(EIA_MARKETS))replaceProjectsForSource(market,{
    sourceKey:EIA_DATASET_ID,projects:snapshot.series.filter(p=>p.marketId===market),
    dataset:'EIA-860M / EIA-860 storage',publishedAt:sources.monthly.publishedAt,
    licence:{id:'us-gov-public-domain',name:'EIA statistics — US public domain',attribution:snapshot.source.notice,url:snapshot.source.url},
  });
  registeredChecksum=snapshot.contentChecksum;
}
async function read(fetchImpl,timeoutMs){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
  let rejectAbort;
  const aborted=new Promise((_,reject)=>{rejectAbort=()=>reject(new Error('EIA inventory response deadline'));controller.signal.addEventListener('abort',rejectAbort,{once:true});});
  let reader,response;
  try{
    response=await Promise.race([fetchImpl(snapshotPath(EIA_DATASET_ID),{signal:controller.signal,cache:'no-cache'}),aborted]);
    if(!response.ok||!response.body||!/application\/json/i.test(response.headers.get('content-type')||''))throw new Error('EIA inventory unavailable');
    const declared=response.headers.get('content-length');
    if(declared&&(!/^\d+$/.test(declared)||Number(declared)>MAX_BYTES))throw new Error('EIA inventory size limit');
    reader=response.body.getReader();const chunks=[];let size=0;
    for(;;){const next=await Promise.race([reader.read(),aborted]);if(next.done)break;size+=next.value.byteLength;if(size>MAX_BYTES)throw new Error('EIA inventory size limit');chunks.push(next.value);}
    const bytes=new Uint8Array(size);let at=0;for(const chunk of chunks){bytes.set(chunk,at);at+=chunk.length;}
    return await verifyEiaInventory(JSON.parse(new TextDecoder('utf8',{fatal:true}).decode(bytes)));
  }catch(error){try{const cancelled=reader?reader.cancel():response?.body?.cancel();cancelled?.catch(()=>{});}catch{}throw error;}
  finally{clearTimeout(timer);controller.signal.removeEventListener('abort',rejectAbort);}
}
/** One lazy request across all three maps. Failure never removes last-good data. */
export function loadEiaInventory({force=false,fetchImpl=globalThis.fetch,timeoutMs=TIMEOUT_MS}={}){
  if(!isLiveDataEnabled())return Promise.resolve(null);
  if(pending)return pending;
  if(lastGood&&!force){register(lastGood);return Promise.resolve(lastGood);}
  pending=read(fetchImpl,timeoutMs).then(snapshot=>{lastGood=snapshot;register(snapshot);return snapshot;}).finally(()=>{pending=null;});
  return pending;
}
export function __resetEiaInventoryClient(){pending=null;lastGood=null;registeredChecksum=null;}
