/* Chart-GB-FILL. Only service totals leave the API; no participant or site names.
   SQL groups accepted unit MW by technology, then CALC-GB-TECH runs locally.
   Source locators and queries travel with the snapshot. No earnings estimate. */
import {httpGetJson} from '../lib/fetch.mjs';
import {buildSnapshot, sha256} from '../lib/envelope.mjs';

const API = 'https://api.neso.energy/api/3/action/';
export const SERVICES = ['DCL', 'DCH', 'DRL', 'DRH', 'DML', 'DMH'];
const IN = "('DCL','DCH','DRL','DRH','DML','DMH')";
const PAGE = 10000;
const FIXED = 'gb-dynamic-response';
const ids = {
  master: '0b8dbc3c-e05e-44a4-b855-7dd1aa079c68',
  summary: '888e5029-f786-41d2-bc15-cbfd1d285e96',
  units: 'ddc4afde-d2bd-424d-891c-56ad49c13d1a',
};
export const technologyClass = value => /^(battery|batteries)$/i.test(String(value ?? '').trim()) ? 'battery' : 'other-or-unlabelled';
const numeric = value => value === null || value === undefined || value === '' ? NaN : Number(value);
const instant = value => {
  const text = String(value);
  const date = new Date(/[zZ]|[+-]\d\d:\d\d$/.test(text) ? text : text + 'Z');
  if (!Number.isFinite(+date)) throw new Error('NESO returned an invalid delivery instant');
  return date.toISOString();
};
const key = row => row.t + '/' + row.service;
const order = (a,b) => a.t.localeCompare(b.t) || a.service.localeCompare(b.service);
const table = id => {
  if (!/^[a-f\d-]{36}$/i.test(id)) throw new Error('Invalid NESO resource id');
  return '"' + id + '"';
};
const utc = field => `"${field}" AT TIME ZONE 'Europe/London' AT TIME ZONE 'UTC'`;

export function queries(summaryId, unitId, historical = false){
  const service = historical ? '"Service"' : '"auctionProduct"';
  const start = historical ? utc('Delivery Start') : '"deliveryStart"';
  const end = historical ? utc('Delivery End') : '"deliveryEnd"';
  const mw = historical ? '"Cleared Volume"' : '"clearedVolume"';
  const price = historical ? '"Clearing Price"' : '"clearingPrice"';
  const quantity = historical ? '"Cleared Volume"' : '"executedQuantity"';
  const tech = historical ? '"Technology Type"' : '"technologyType"';
  return {
    summary: `SELECT ${service} AS service,${start} AS t,${end} AS e,${mw} AS mw,${price} AS price FROM ${table(summaryId)} WHERE ${service} IN ${IN}`,
    units: `SELECT ${service} AS service,${start} AS t,${tech} AS technology${historical ? ',"Cancelled" AS cancelled' : ''},SUM(${quantity}) AS mw FROM ${table(unitId)} WHERE ${service} IN ${IN} GROUP BY ${service},${start},${tech}${historical ? ',"Cancelled"' : ''}`,
  };
}

async function action(name, params, request, log){
  const url = API + name + '?' + new URLSearchParams(params);
  // A body interrupted after headers must be retried too. The shared helper
  // already bounds transport retries, response size and each request's time.
  let error;
  for (let attempt=0;attempt<3;attempt++){
    try {
      const json = await request(url, {log, timeoutMs:60000});
      if (!json.success || !json.result) throw new Error('NESO action did not succeed');
      return json.result;
    } catch (err){ error=err; }
  }
  throw error;
}

async function rows(sql, request, log, sort='t,service'){
  const result=[];
  // Stable pagination avoids the API's default/truncated result window.
  for (let offset=0;offset<200000;offset+=PAGE){
    const page=await action('datastore_search_sql',{sql:sql+` ORDER BY ${sort} LIMIT ${PAGE} OFFSET ${offset}`},request,log);
    if(!Array.isArray(page.records))throw new Error('NESO returned no records array');
    result.push(...page.records);
    if(page.records.length<PAGE)return result;
  }
  throw new Error('NESO response query exceeded its bounded page count');
}

export function combine(summary, units, origin){
  const byBlock=new Map();
  for(const row of units){
    const cancelled=String(row.cancelled??'').trim();
    if(/^(yes|true|y|cancelled)$/i.test(cancelled))continue;
    if(cancelled&&!/^(no|false|n)$/i.test(cancelled))throw new Error('Unknown source cancellation flag');
    const t=instant(row.t),service=row.service,mw=numeric(row.mw);
    if(!SERVICES.includes(service)||!Number.isFinite(mw)||mw<0)throw new Error('Invalid technology MW');
    const k=key({t,service}),v=byBlock.get(k)||{total:0,battery:0};
    v.total+=mw;
    if(technologyClass(row.technology)==='battery')v.battery+=mw;
    byBlock.set(k,v);
  }
  const seen=new Set();
  return summary.map(row=>{
    const t=instant(row.t),e=instant(row.e),service=row.service,mw=numeric(row.mw),v=numeric(row.price);
    const k=key({t,service});
    if(seen.has(k))throw new Error('Duplicate NESO service / delivery block');
    seen.add(k);
    const unit=byBlock.get(k);
    const matched=(mw===0&&!unit)||(unit&&Math.abs(unit.total-mw)<=Math.max(.1,mw*.001));
    // A mismatched by-unit file cannot claim a battery share. Keep the valid
    // summary observation, and expose the missing technology layer in QA.
    const batteryMW=matched?Math.min(mw,unit?.battery||0):null;
    return {t,e,service,v,clearedMW:mw,batteryMW,otherMW:batteryMW===null?null:mw-batteryMW,origin};
  });
}

export function validateServiceSeries(series){
  const seen=new Set();let previous='';
  for(const p of series){
    if(!SERVICES.includes(p.service)||!Number.isFinite(Date.parse(p.t))||!Number.isFinite(Date.parse(p.e))||p.e<=p.t||!Number.isFinite(p.v)||!Number.isFinite(p.clearedMW)||p.clearedMW<0)throw new Error('Invalid response auction observation');
    if(p.t<previous||seen.has(key(p)))throw new Error('Unordered or duplicate response observations');
    previous=p.t;seen.add(key(p));
    if(p.batteryMW===null){if(p.otherMW!==null)throw new Error('Incomplete technology layer');}
    else if(!Number.isFinite(p.batteryMW)||p.batteryMW<0||p.otherMW<0||Math.abs(p.batteryMW+p.otherMW-p.clearedMW)>.00001)throw new Error('Technology totals do not reconcile');
  }
  if(!series.length)throw new Error('No response observations');
  return true;
}

/** EFA date is the date on which its 23:00-to-23:00 local day ends. */
export function efaMonth(t){
  return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(Date.parse(t)+3600000)).slice(0,7);
}

export function monthly(series){
  const groups=new Map();
  for(const p of series){
    const month=efaMonth(p.t),k=month+'/'+p.service+'/'+(p.origin==='master'?'accepted-bid':'clearing');
    const g=groups.get(k)||{month,service:p.service,basis:p.origin==='master'?'accepted-bid':'clearing',n:0,weight:0,cost:0,mw:0,battery:0,other:0,missingTechnology:0,from:p.t,to:p.e};
    // The pre-EFA daily procurement period represents six EFA blocks. Weight
    // it by its represented blocks; ordinary auction blocks each count once.
    const blocks=p.origin==='master'?6:1;
    g.n+=blocks;g.weight+=p.clearedMW*blocks;g.cost+=p.v*p.clearedMW*blocks;g.mw+=p.clearedMW*blocks;
    if(p.batteryMW===null)g.missingTechnology+=blocks;
    else {g.battery+=p.batteryMW*blocks;g.other+=p.otherMW*blocks;}
    if(p.t<g.from)g.from=p.t;if(p.e>g.to)g.to=p.e;
    groups.set(k,g);
  }
  return [...groups.values()].map(g=>({month:g.month,service:g.service,basis:g.basis,blocks:g.n,price:g.weight?g.cost/g.weight:null,clearedMW:g.mw/g.n,batteryMW:g.missingTechnology?null:g.battery/g.n,otherMW:g.missingTechnology?null:g.other/g.n,missingTechnology:g.missingTechnology,from:g.from,to:g.to})).sort((a,b)=>a.month.localeCompare(b.month)||a.service.localeCompare(b.service)||a.basis.localeCompare(b.basis));
}

export async function fetchDataset({dataset,previous,log=()=>{},now,request=httpGetJson}){
  if(!dataset.republishable)return {skipped:true,reason:'Publication rights are blocked'};
  if(dataset.id===FIXED&&previous)return {skipped:true,reason:'Fixed 2020–2023 vintage already registered; no scheduled refresh'};
  const provenance=[];const fetched=[];
  const readPair=async(summaryId,unitId,origin,historical=false)=>{
    const q=queries(summaryId,unitId,historical);
    log(`  NESO ${origin}: summary and technology totals`);
    const summary=await rows(q.summary,request,log),units=await rows(q.units,request,log,historical?'t,service,technology,cancelled':'t,service,technology');
    provenance.push({origin,summaryResource:summaryId,technologyResource:unitId,summaryLocator:q.summary,technologyLocator:q.units});
    fetched.push(...combine(summary,units,origin));
  };
  let series;
  if(dataset.id===FIXED){
    await readPair(ids.summary,ids.units,'dynamic',true);
    const first=fetched.filter(p=>p.service==='DCL'&&p.clearedMW>0).sort(order)[0]?.t;
    if(!first)throw new Error('Dynamic-service overlap boundary is missing');
    const sql=`SELECT "Delivery Start UTC" AS t,"Delivery End UTC" AS e,'DCL' AS service,"Technology Type" AS technology,SUM("Volume Accepted") AS mw,SUM("Volume Accepted"*"Availability Fee") AS cost FROM ${table(ids.master)} WHERE "Volume Accepted">0 GROUP BY "Delivery Start UTC","Delivery End UTC","Technology Type"`;
    const master=await rows(sql,request,log,'t,service,technology');
    const grouped=new Map();
    for(const r of master){
      const t=instant(r.t);if(t>=first)continue;
      const e=instant(r.e),mw=numeric(r.mw),cost=numeric(r.cost);
      if(!Number.isFinite(mw)||mw<=0||!Number.isFinite(cost))throw new Error('Invalid accepted-bid record');
      const g=grouped.get(t)||{t,e,service:'DCL',mw:0,cost:0,battery:0};
      g.mw+=mw;g.cost+=cost;if(technologyClass(r.technology)==='battery')g.battery+=mw;grouped.set(t,g);
    }
    for(const g of grouped.values())fetched.push({t:g.t,e:g.e,service:g.service,v:g.cost/g.mw,clearedMW:g.mw,batteryMW:g.battery,otherMW:g.mw-g.battery,origin:'master'});
    provenance.push({origin:'master',summaryResource:ids.master,summaryLocator:sql,spliceBefore:first});
    series=fetched.sort(order);
    if(series.some(p=>p.t<'2020-01-01'||p.t>='2024-01-01'))throw new Error('Fixed vintage escaped 2020–2023');
  } else if(dataset.id==='gb-eac-response'){
    const pkg=await action('package_show',{id:'eac-auction-results'},request,log);
    const resources=pkg.resources||[];
    const summaries=resources.filter(r=>/Response-Reserve Results Summary/i.test(r.name)&&!/Daily/i.test(r.name));
    const loaded=new Set(previous?.derived?.resources?.map(r=>r.summaryResource)||[]);
    for(const s of summaries.sort((a,b)=>a.name.localeCompare(b.name))){
      const year=s.name.match(/FY(\d{4})/i)?.[1];
      if(year&&Number(year)<2023)continue;
      if(year&&loaded.has(s.id))continue;
      const unit=resources.find(r=>/Response-Reserve Results By Unit/i.test(r.name)&&!/Daily/i.test(r.name)&&(year?r.name.includes('FY'+year):!/FY\d{4}/i.test(r.name)));
      if(!unit)throw new Error('Missing EAC technology archive');
      await readPair(s.id,unit.id,year?'eac-fy'+year:'eac-current');
    }
    for(const year of ['2023','2024','2025'])if(![...(previous?.derived?.resources||[]),...provenance].some(r=>r.origin==='eac-fy'+year))throw new Error('Missing approved EAC FY'+year+' archive');
    const merged=new Map((previous?.series||[]).map(p=>[key(p),p]));
    // Current results win at an overlapping archive boundary, never add twice.
    for(const p of fetched.filter(p=>p.origin!=='eac-current'))merged.set(key(p),p);
    for(const p of fetched.filter(p=>p.origin==='eac-current'))merged.set(key(p),p);
    series=[...merged.values()].sort(order);
  } else throw new Error('Unknown NESO response dataset');
  validateServiceSeries(series);
  const resources=[...new Map([...(previous?.derived?.resources||[]),...provenance].map(r=>[r.origin,r])).values()];
  const snapshot=buildSnapshot({dataset,series,coverage:{from:series[0].t,to:series.reduce((end,p)=>p.e>end?p.e:end,series[0].e),resolution:'EFA-block',points:series.length},units:{price:'GBP/MW/h',power:'MW'},fetchedAt:now,
    derived:{authority:'derived',resources,monthly:monthly(series),missingTechnologyBlocks:series.filter(p=>p.batteryMW===null).length},
    notes:['CALC-GB-TECH: case-insensitive Battery/Batteries; every other label, NA and blank is other or unlabelled.', 'Chart-GB-FILL: monthly volume-weighted availability prices; mean cleared MW per EFA block. Pre-EFA daily accepted bids are volume-weighted, represent six blocks and use a separate method.', 'Historical Delivery Start/End are London wall time, converted to UTC by the source SQL. Masterdata UTC and EAC delivery instants are retained as UTC.', 'No provider identities, offered-MW line, service maxima sum, requirement series, wholesale price or captured-revenue estimate.']});
  return {snapshot};
}

/** Auction summary avoids the generic daily price/spread/arbitrage path. */
export function summarize(snapshot){
  const {series,derived,contentChecksum,...envelope}=snapshot;
  const summary={...envelope,summarySchemaVersion:1,derived:{authority:'derived',missingTechnologyBlocks:derived.missingTechnologyBlocks,resources:derived.resources},monthly:monthly(series),daily:[],arbitrage:null,
    sourceSnapshot:{file:snapshot.datasetId+'.json',contentChecksum,points:series.length}};
  delete summary.envelopeChecksum;
  // Stable content identity prevents a fetchedAt-only six-hour commit.
  summary.contentChecksum=sha256({summarySchemaVersion:summary.summarySchemaVersion,sourceSnapshot:summary.sourceSnapshot,monthly:summary.monthly,units:summary.units,derived:summary.derived});
  summary.summaryChecksum=sha256(summary);
  return summary;
}
