import { createHash } from 'node:crypto';
import { boundedDownload } from '../lib/bounded-download.mjs';
import { inspectZip, extractZipMember } from '../lib/bounded-zip.mjs';
import { readSheets, resolveColumns, requireColumns } from '../lib/workbook.mjs';
import { buildSnapshot, sha256, verifyContentChecksum } from '../lib/envelope.mjs';
import { eiaProjectsFromSheets } from './eia-860m.mjs';
import { buildPlantIndex, enrichProjects, COLUMNS } from './eia-860-enrichment.mjs';
import { buildStorageIndex, attachStorageEvidence } from './eia-storage-evidence.mjs';
import { EIA_DATASET_ID, EIA_MARKETS, EIA_MAX_REVISIONS, inventoryCoverage, isOfficialEiaURL, validateEiaInventory } from '../../src/projects/eiaInventorySchema.js';

export const PARSER_VERSION = 1;
export const MONTHLY_INDEX = 'https://www.eia.gov/electricity/data/eia860m/';
export const ANNUAL_INDEX = 'https://www.eia.gov/electricity/data/eia860/';
export const LIMITS = Object.freeze({ indexBytes:512*1024, monthlyBytes:24*1024*1024, annualBytes:40*1024*1024,
  snapshotBytes:12*1024*1024, indexTimeoutMs:20000, monthlyTimeoutMs:45000, annualTimeoutMs:60000, totalTimeoutMs:180000 });
const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'];
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const clean = html => String(html).replace(/<!--[\s\S]*?-->/g,'');
const links = html => [...clean(html).matchAll(/href\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]);
const requireOk = (ok, text) => { if (!ok) throw new Error('eia inventory: '+text); };

function calendarDate(text){
  const match = text?.match(/^([A-Za-z]+) (\d{1,2}),? (20\d{2})$/);
  requireOk(match,'publication date absent/invalid');
  const month = MONTHS.indexOf(match[1].toLowerCase()), day = Number(match[2]), year = Number(match[3]);
  const date = new Date(Date.UTC(year,month,day));
  requireOk(month>=0 && date.getUTCMonth()===month && date.getUTCDate()===day,'publication date outside calendar');
  return date.toISOString().slice(0,10);
}

export function discoverMonthly(html, now){
  const plain = clean(html).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
  const publishedAt = calendarDate(plain.match(/Release Date:\s*([A-Za-z]+ \d{1,2},? 20\d{2})/)?.[1]);
  requireOk(publishedAt<=String(now).slice(0,10),'future publication date');
  const choices = [];
  for (const href of links(html)){
    let url; try { url = new URL(href,MONTHLY_INDEX).href; } catch { continue; }
    if (!isOfficialEiaURL(url,'monthly')) continue;
    const [,month,year] = new URL(url).pathname.match(/\/([a-z]+)_generator(20\d{2})\.xlsx$/);
    const number = MONTHS.indexOf(month)+1, end = new Date(Date.UTC(Number(year),number,0)).toISOString().slice(0,10);
    if (end>publishedAt) continue; // EIA includes future placeholder links.
    choices.push({url,period:`${year}-${String(number).padStart(2,'0')}`,publishedAt});
  }
  choices.sort((a,b)=>b.period.localeCompare(a.period));
  requireOk(choices.length,'no released monthly workbook');
  return choices[0];
}

export function discoverAnnual(html, now){
  const choices = [];
  for (const href of links(html)){
    let url; try { url = new URL(href,ANNUAL_INDEX).href; } catch { continue; }
    if (!isOfficialEiaURL(url,'annual')) continue;
    const reportingYear = Number(new URL(url).pathname.match(/eia860(20\d{2})\.zip$/)[1]);
    if (reportingYear>=new Date(now).getUTCFullYear()) continue;
    choices.push({url,reportingYear});
  }
  choices.sort((a,b)=>b.reportingYear-a.reportingYear);
  requireOk(choices.length,'no completed annual reporting year');
  return choices[0];
}

function verifyWorkbook(bytes, maxExpandedBytes){
  const zip=inspectZip(bytes,{maxBytes:LIMITS.monthlyBytes,maxEntries:500,maxExpandedBytes,maxMemberBytes:96*1024*1024});
  for(const entry of zip.entries){
    const exact=new RegExp('^'+entry.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$');
    extractZipMember(bytes,zip,exact,96*1024*1024);
  }
  return zip;
}
function checkUnit(sheet, column, unit){
  requireOk(new RegExp('\\(\\s*'+unit+'\\s*\\)','i').test(sheet.headerLabels?.[column]||''),'missing/changed '+unit+' header '+column);
}
const request = (sheet,headerRow,textColumns) => ({sheet,headerRow,textColumns,exactSheet:true,rejectDuplicateHeaders:true,includeHeaderLabels:true,includeTitleRows:true});
const sourceMeta = (version, downloaded) => ({...version,sha256:digest(downloaded.bytes),bytes:downloaded.bytes.length,etag:downloaded.etag||null,lastModified:downloaded.lastModified||null});

/** Full official bytes -> a validated candidate; no filesystem writes. */
export async function buildInventorySnapshot({ dataset, monthlyBytes, annualBytes, monthly, annual, previous=null, now }){
  requireOk(dataset?.id===EIA_DATASET_ID,'wrong catalogue identity');
  requireOk(digest(monthlyBytes)===monthly.sha256 && monthlyBytes.length===monthly.bytes && digest(annualBytes)===annual.sha256 && annualBytes.length===annual.bytes,'input hash/size provenance mismatch');
  verifyWorkbook(monthlyBytes,192*1024*1024);
  const outer=inspectZip(annualBytes,{maxBytes:LIMITS.annualBytes,maxEntries:100,maxExpandedBytes:64*1024*1024,maxMemberBytes:12*1024*1024});
  const year=annual.reportingYear;
  const storage=extractZipMember(annualBytes,outer,new RegExp('(?:^|/)3_4_Energy_Storage_Y'+year+'\\.xlsx$','i'),8*1024*1024);
  const plant=extractZipMember(annualBytes,outer,new RegExp('(?:^|/)2_+Plant_Y'+year+'\\.xlsx$','i'),8*1024*1024);
  verifyWorkbook(storage.bytes,16*1024*1024); verifyWorkbook(plant.bytes,64*1024*1024);
  const monthlyReads=await readSheets(monthlyBytes,[request('Operating',3,['plant_id','generator_id']),request('Planned',3,['plant_id','generator_id'])]);
  const [storageSheet]=await readSheets(storage.bytes,[request('Operable',2,['plant_code','generator_id'])]);
  const [plantSheet]=await readSheets(plant.bytes,[request('Plant',2,['plant_code'])]);
  const [py,pm]=monthly.period.split('-').map(Number), periodTitle=MONTHS[pm-1]+' '+py;
  for(const sheet of monthlyReads){
    requireOk(sheet.rows.length>0 && sheet.rows.length<=60000,'monthly sheet empty/oversized');
    requireOk(sheet.titleRows.join(' ').toLowerCase().includes(periodTitle),'monthly workbook title/period mismatch');
    checkUnit(sheet,'nameplate_capacity','MW');
  }
  requireColumns(monthlyReads[0].headers,['nameplate_energy_capacity','latitude','longitude'],'eia inventory Operating');
  checkUnit(monthlyReads[0],'nameplate_energy_capacity','MWh');
  requireColumns(storageSheet.headers,['plant_code','generator_id','status','technology','prime_mover','nameplate_capacity','nameplate_energy_capacity','maximum_charge_rate','maximum_discharge_rate','operating_year','operating_month'],'annual storage');
  for(const sheet of [storageSheet,plantSheet]) requireOk(sheet.titleRows.join(' ').includes(String(year)),'annual workbook title/year mismatch');
  for(const field of ['nameplate_capacity','maximum_charge_rate','maximum_discharge_rate']) checkUnit(storageSheet,field,'MW');
  checkUnit(storageSheet,'nameplate_energy_capacity','MWh');
  requireOk(storageSheet.rows.length>0 && storageSheet.rows.length<=10000 && plantSheet.rows.length>0 && plantSheet.rows.length<=40000,'annual row limits');
  const plantColumns=resolveColumns(plantSheet.headers,COLUMNS,'annual Plant');
  const plantIndex=buildPlantIndex(plantSheet.rows,plantColumns);
  const storageIndex=buildStorageIndex(storageSheet.rows,plantSheet.rows,year);
  const raw=[];
  for(const marketId of Object.keys(EIA_MARKETS)) raw.push(...eiaProjectsFromSheets(monthlyReads,{marketId,evidenceDate:now.slice(0,10),publishedAt:monthly.publishedAt,reportingPeriod:monthly.period,includeObservations:true}));
  const coordinateRows=enrichProjects(raw,plantIndex);
  const coordinateById=new Map(coordinateRows.map(p=>[p.id,p]));
  const projects=attachStorageEvidence(raw,storageIndex,monthly.period).map(p=>{
    const coords=coordinateById.get(p.id), monthlyLocation=p.coordinateEvidence.basis==='monthly-reported';
    const fallback=coords.enrichment.confidence;
    return {...p,enrichment:coords.enrichment,
      sourceIds:[...new Set([...p.sourceIds,...coords.sourceIds])],
      lat:monthlyLocation?p.lat:coords.lat,lon:monthlyLocation?p.lon:coords.lon,
      coordinateEvidence:monthlyLocation?p.coordinateEvidence:{sourceId:fallback==='none'?null:'us-eia-860-annual',basis:fallback==='exact'?'annual-plant-code':fallback==='name-state'?'annual-name-state':'missing',confidence:fallback,reportingYear:year},
    };
  }).sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
  const sources={monthly,annual:{...annual,storage:{name:storage.name,sha256:digest(storage.bytes),bytes:storage.bytes.length},plant:{name:plant.name,sha256:digest(plant.bytes),bytes:plant.bytes.length}}};
  const observationsChecksum=sha256(projects);
  const contentId=sha256({parserVersion:PARSER_VERSION,monthly,annual:sources.annual});
  const previousInventory=previous?.derived?.inventory;
  if(previousInventory?.parserVersion===PARSER_VERSION && previousInventory.revisions.at(-1)?.contentId===contentId) return previous;
  const before=new Map((previous?.series||[]).map(p=>[p.id,p])), after=new Map(projects.map(p=>[p.id,p]));
  const ignored=new Set(['evidenceDate','provenance']);
  const changes={added:projects.filter(p=>!before.has(p.id)).map(p=>p.id),removed:[...before.keys()].filter(id=>!after.has(id)).sort(),changed:[]};
  for(const p of projects){
    const old=before.get(p.id);if(!old)continue;
    const fields=[...new Set([...Object.keys(old),...Object.keys(p)])].filter(k=>!ignored.has(k)&&sha256(old[k]??null)!==sha256(p[k]??null)).sort();
    if(fields.length)changes.changed.push({id:p.id,fields});
  }
  const revisions=[...(previousInventory?.revisions||[])];
  requireOk(revisions.length<EIA_MAX_REVISIONS,'revision ledger limit; last-good retained');
  revisions.push({sequence:revisions.length+1,contentId,observationsChecksum,observedAt:now,period:monthly.period,annualYear:year,monthlySha256:monthly.sha256,annualSha256:annual.sha256,changes});
  const inventory={parserVersion:PARSER_VERSION,sources,markets:inventoryCoverage(projects),annualInputAudit:storageIndex.audit,revisions};
  const notice=`Source: U.S. Energy Information Administration. EIA-860M ${monthly.period}, published ${monthly.publishedAt}; EIA-860 reporting year ${year}, file Last-Modified ${annual.lastModified||'not supplied'} (publication date not stated).`;
  const effectiveDataset={...dataset,source:{...dataset.source,notice}};
  const lastDay=new Date(Date.UTC(py,pm,0)).getUTCDate();
  const snapshot=buildSnapshot({dataset:effectiveDataset,series:projects,coverage:{from:monthly.period+'-01',to:monthly.period+'-'+String(lastDay).padStart(2,'0'),resolution:'monthly-generator-inventory',points:projects.length},units:{power:'MW',energy:'MWh',duration:'h'},derived:{inventory},fetchedAt:now,
    notes:['Generator inventory, not a complete interconnection queue or a capacity commitment. Monthly nameplate MWh and coordinates are reported for the stated month. Annual MWh, maximum charge/discharge MW and discharge hours remain separate historical evidence. Full previously accepted revisions persist in Git history.']});
  const errors=validateEiaInventory(snapshot);requireOk(!errors.length,errors.slice(0,4).join('; '));
  requireOk(Buffer.byteLength(JSON.stringify(snapshot,null,2)+'\n')<=LIMITS.snapshotBytes,'snapshot size limit');
  return snapshot;
}

export function summarize(snapshot){
  const inventory=snapshot.derived.inventory;
  const result={schemaVersion:1,kind:'projects',datasetId:snapshot.datasetId,marketId:null,title:snapshot.title,authority:snapshot.authority,source:snapshot.source,
    fetchedAt:snapshot.fetchedAt,freshnessAt:inventory.sources.monthly.publishedAt,publicationCadenceHours:30*24,
    coverage:snapshot.coverage,units:snapshot.units,refreshHours:snapshot.refreshHours,staleAfterHours:snapshot.staleAfterHours,
    derived:null,daily:[],monthly:[],arbitrage:null,
    inventory:{parserVersion:inventory.parserVersion,sources:inventory.sources,markets:inventory.markets,revisionsObserved:inventory.revisions.length,lastRevision:inventory.revisions.at(-1)},
    sourceSnapshot:{contentChecksum:snapshot.contentChecksum,envelopeChecksum:snapshot.envelopeChecksum,points:snapshot.series.length}};
  result.summaryChecksum=sha256(result);return result;
}

export async function fetchDataset({dataset,previous,now=new Date().toISOString(),log=()=>{},fetchImpl=globalThis.fetch,dryRun=false}){
  if(previous){
    const errors=validateEiaInventory(previous),{envelopeChecksum,...envelope}=previous;
    requireOk(!errors.length && verifyContentChecksum(previous) && envelopeChecksum===sha256(envelope),'last-good inventory failed integrity schema/checksum');
  }
  const signal=AbortSignal.timeout(LIMITS.totalTimeoutMs);
  const download=(url,opts)=>boundedDownload(url,{...opts,signal,fetchImpl});
  const mi=await download(MONTHLY_INDEX,{maxBytes:LIMITS.indexBytes,timeoutMs:LIMITS.indexTimeoutMs,contentType:/text\/html/i});
  const ai=await download(ANNUAL_INDEX,{maxBytes:LIMITS.indexBytes,timeoutMs:LIMITS.indexTimeoutMs,contentType:/text\/html/i});
  const monthly=discoverMonthly(mi.bytes.toString('utf8'),now),annual=discoverAnnual(ai.bytes.toString('utf8'),now);
  const old=previous?.derived?.inventory, prior=old?.sources;
  const sameMonthly=prior?.monthly.url===monthly.url&&prior.monthly.period===monthly.period&&prior.monthly.publishedAt===monthly.publishedAt;
  const sameAnnual=prior?.annual.url===annual.url&&prior.annual.reportingYear===annual.reportingYear;
  const date=new Date(now), parserChanged=old?.parserVersion!==PARSER_VERSION;
  const monthlyDue=dryRun||!sameMonthly||parserChanged||date.getUTCDay()===1;
  const annualDue=dryRun||!sameAnnual||parserChanged||date.getUTCDate()===1;
  if(previous&&!monthlyDue&&!annualDue){log('official release indices unchanged; binary checks not due');return {snapshot:previous};}
  let m=null,a=null;
  const conditional=meta=>meta?.etag?{'If-None-Match':meta.etag}:meta?.lastModified?{'If-Modified-Since':meta.lastModified}:{};
  if(monthlyDue){
    m=await download(monthly.url,{maxBytes:LIMITS.monthlyBytes,timeoutMs:LIMITS.monthlyTimeoutMs,headers:!dryRun&&sameMonthly?conditional(prior.monthly):{},allowNotModified:!!previous&&!dryRun&&sameMonthly,contentType:/spreadsheetml|octet-stream|zip/i});
  }
  const changedMonthly=m?.bytes&&digest(m.bytes)!==prior?.monthly.sha256;
  if(annualDue||changedMonthly){
    a=await download(annual.url,{maxBytes:LIMITS.annualBytes,timeoutMs:LIMITS.annualTimeoutMs,headers:!dryRun&&!changedMonthly&&sameAnnual?conditional(prior.annual):{},allowNotModified:!!previous&&!dryRun&&!changedMonthly&&sameAnnual,contentType:/zip|octet-stream/i});
  }
  const changedAnnual=a?.bytes&&digest(a.bytes)!==prior?.annual.sha256;
  if(previous&&!parserChanged&&!changedMonthly&&!changedAnnual&&sameMonthly&&sameAnnual){log('official workbook verification content-identical; last-good bytes retained');return {snapshot:previous};}
  // An annual revision needs the original monthly rows; a monthly revision
  // needs the annual Plant/storage rows for newly appearing generator IDs.
  if(!m?.bytes)m=await download(monthly.url,{maxBytes:LIMITS.monthlyBytes,timeoutMs:LIMITS.monthlyTimeoutMs,contentType:/spreadsheetml|octet-stream|zip/i});
  if(!a?.bytes)a=await download(annual.url,{maxBytes:LIMITS.annualBytes,timeoutMs:LIMITS.annualTimeoutMs,contentType:/zip|octet-stream/i});
  const snapshot=await buildInventorySnapshot({dataset,monthlyBytes:m.bytes,annualBytes:a.bytes,monthly:sourceMeta(monthly,m),annual:sourceMeta(annual,a),previous,now});
  log(`validated ${snapshot.series.length} generator records; monthly ${monthly.period}, annual ${annual.reportingYear}`);
  return {snapshot};
}
