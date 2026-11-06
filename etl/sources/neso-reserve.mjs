/* EAC reserve clearing observations, separate from the existing DC/DM/DR feed.
   One small official daily CSV per existing run; no DataStore query or account.
   Complete London EFA days only. Awarded MW is not delivered energy or income. */
import {createHash} from 'node:crypto';
import {httpGetText} from '../lib/fetch.mjs';
import {buildSnapshot, sha256} from '../lib/envelope.mjs';
import {WINDOW_DAYS} from '../lib/series.mjs';
import {settlementBounds} from './elexon-system-prices.mjs';

export const RESOURCE_ID = '3c51a666-1c33-450e-a6eb-c9b4a0c91584';
export const DAILY_URL = `https://api.neso.energy/dataset/291e3c28-75f2-4a8f-b5f5-008bebaac368/resource/${RESOURCE_ID}/download/neso-response-reserve-daily-results-summary.csv`;
export const PRODUCTS = {
  NBR: {serviceType:'Balancing Reserve', direction:'negative'},
  NQR: {serviceType:'Quick Reserve', direction:'negative'},
  NSR: {serviceType:'Slow Reserve', direction:'negative'},
  PBR: {serviceType:'Balancing Reserve', direction:'positive'},
  PQR: {serviceType:'Quick Reserve', direction:'positive'},
  PSR: {serviceType:'Slow Reserve', direction:'positive'},
};
const RESPONSE = new Set(['DCH','DCL','DMH','DML','DRH','DRL']);
const COLUMNS = ['auctionID','auctionProduct','serviceType','deliveryStart','deliveryEnd','clearedVolume','clearingPrice','linkedServiceWindowID'];
const HALF_HOUR = 1_800_000, HOUR = 3_600_000, DAY = 86_400_000;
const MAX_BYTES = 1024 * 1024;
const londonDate = new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'});
const key = p => p.t + '/' + p.service;
const order = (a,b) => a.t.localeCompare(b.t) || a.service.localeCompare(b.service);
const fail = message => {throw new Error('NESO reserve: ' + message);};
const dayBounds = new Map();

/** An EFA day is 23:00 local on the previous date to 23:00 on this date. */
export function efaBounds(day){
  if(!dayBounds.has(day)){
    const {from,to,periods} = settlementBounds(day);
    dayBounds.set(day,Object.freeze({from:from-HOUR, to:to-HOUR, periods}));
  }
  return dayBounds.get(day);
}
const efaDate = t => londonDate.format(new Date(Date.parse(t)+HOUR));

/** The source explicitly declares UTC, including timestamps without a suffix. */
function utcInstant(value){
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})?$/i.test(value)) fail('invalid UTC delivery instant');
  const text = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value) ? value : value+'Z';
  const ms = Date.parse(text);
  // Reject calendar normalization, e.g. February 30, as well as invalid dates.
  const day = value.slice(0,10);
  if (!Number.isFinite(ms) || new Date(day+'T00:00:00Z').toISOString().slice(0,10)!==day || ms%HALF_HOUR) fail('invalid UTC delivery instant');
  return new Date(ms).toISOString();
}
function numeric(value, name){
  if (typeof value !== 'string' || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim())) fail('invalid '+name);
  const number = Number(value);
  if (!Number.isFinite(number)) fail('invalid '+name);
  return number;
}

/** Small RFC4180 reader: quoted/reordered fields and BOM are valid; truncation is not. */
function csvRows(text){
  if (typeof text!=='string' || !text.trim() || Buffer.byteLength(text,'utf8')>MAX_BYTES) fail('empty or oversized CSV');
  const rows=[]; let row=[], field='', quoted=false, closed=false;
  const input=text.replace(/^\uFEFF/,'');
  const push=()=>{row.push(field); field=''; closed=false;};
  for(let i=0;i<input.length;i++){
    const c=input[i];
    if(quoted){
      if(c==='"' && input[i+1]==='"'){field+='"';i++;}
      else if(c==='"'){quoted=false;closed=true;}
      else field+=c;
    } else if(c==='"'){
      if(field || closed) fail('malformed CSV quoting');
      quoted=true;
    } else if(c===','){push();}
    else if(c==='\n' || c==='\r'){
      if(c==='\r' && input[i+1]==='\n')i++;
      push(); if(row.some(v=>v!==''))rows.push(row); row=[];
    } else {if(closed)fail('malformed CSV quoting');field+=c;}
  }
  if(quoted)fail('unterminated CSV field');
  if(field || row.length || closed){push();rows.push(row);}
  const header=rows.shift();
  if(!header || new Set(header).size!==header.length || COLUMNS.some(c=>!header.includes(c)))fail('missing or duplicate CSV columns');
  return rows.map(values=>{
    if(values.length!==header.length)fail('truncated CSV row');
    return Object.fromEntries(header.map((name,i)=>[name,values[i]]));
  });
}

/** Complete per-product calendars keep missing rows distinct from observed zero MW. */
export function validateReserveSeries(series){
  if(!Array.isArray(series) || !series.length)fail('no reserve observations');
  const groups=new Map(), auctionByDay=new Map(), seen=new Set(); let last='';
  for(const p of series){
    const product=PRODUCTS[p?.service], t=Date.parse(p?.t), e=Date.parse(p?.e);
    if(!product || !Number.isFinite(t) || !Number.isFinite(e) || p.t!==new Date(t).toISOString() || p.e!==new Date(e).toISOString() || e-t!==HALF_HOUR
        || t%HALF_HOUR || typeof p.auctionDay!=='string' || p.serviceType!==product.serviceType || p.direction!==product.direction
        || !Number.isSafeInteger(p.auctionID) || p.auctionID<1 || !Number.isFinite(p.v) || p.v< -100000 || p.v>1000000
        || !Number.isFinite(p.clearedMW) || p.clearedMW<0 || p.clearedMW>100000
        || (p.linkedServiceWindowID!==null && (!Number.isSafeInteger(p.linkedServiceWindowID)||p.linkedServiceWindowID<1)))fail('invalid reserve observation');
    if(seen.has(key(p)) || p.t<last)fail('duplicate or unordered reserve observations');
    seen.add(key(p));last=p.t;
    const bounds=efaBounds(p.auctionDay), period=(t-bounds.from)/HALF_HOUR+1;
    if(p.efaPeriod!==period || period<1 || period>bounds.periods || t<bounds.from || t>=bounds.to)fail('invalid EFA period');
    if(auctionByDay.has(p.auctionDay) && auctionByDay.get(p.auctionDay)!==p.auctionID)fail('multiple auction versions within an EFA day');
    auctionByDay.set(p.auctionDay,p.auctionID);
    const groupKey=p.auctionDay+'/'+p.service;
    const group=groups.get(groupKey)||[];group.push(p);groups.set(groupKey,group);
  }
  for(const day of auctionByDay.keys()){
    const bounds=efaBounds(day);
    for(const service of Object.keys(PRODUCTS)){
      const group=groups.get(day+'/'+service)||[];
      if(group.length!==bounds.periods || group.some((p,i)=>Date.parse(p.t)!==bounds.from+i*HALF_HOUR))fail(`incomplete ${day} ${service}: ${group.length}/${bounds.periods} intervals`);
    }
  }
  return true;
}

export function parseDaily(text){
  const points=new Map();
  for(const row of csvRows(text)){
    if(RESPONSE.has(row.auctionProduct))continue;
    const product=PRODUCTS[row.auctionProduct];
    if(!product)fail('unknown auction product');
    const t=utcInstant(row.deliveryStart), e=utcInstant(row.deliveryEnd), day=efaDate(t);
    const linked=row.linkedServiceWindowID.trim();
    const point={t,e,service:row.auctionProduct,serviceType:row.serviceType,direction:product.direction,
      v:numeric(row.clearingPrice,'GBP/MW/h price'),clearedMW:numeric(row.clearedVolume,'cleared MW'),
      auctionID:numeric(row.auctionID,'auction ID'),auctionDay:day,efaPeriod:(Date.parse(t)-efaBounds(day).from)/HALF_HOUR+1,
      linkedServiceWindowID:linked===''?null:numeric(linked,'linked service window ID')};
    const prior=points.get(key(point));
    if(prior && JSON.stringify(prior)!==JSON.stringify(point))fail('conflicting duplicate reserve interval');
    points.set(key(point),point);
  }
  const series=[...points.values()].sort(order);
  validateReserveSeries(series);
  if(new Set(series.map(p=>p.auctionDay)).size!==1 || new Set(series.map(p=>p.auctionID)).size!==1)fail('daily file contains more than the latest auction day');
  return series;
}

/** Every product and direction stays separate; zero accepted MW has no weighted price. */
export function aggregate(series, byDay=false){
  const groups=new Map();
  for(const p of series){
    const period=byDay?p.auctionDay:p.auctionDay.slice(0,7), k=period+'/'+p.service;
    const g=groups.get(k)||{period,service:p.service,serviceType:p.serviceType,direction:p.direction,intervals:0,hours:0,weight:0,cost:0,from:p.t,to:p.e};
    const hours=(Date.parse(p.e)-Date.parse(p.t))/HOUR;
    g.intervals++;g.hours+=hours;g.weight+=p.clearedMW*hours;g.cost+=p.v*p.clearedMW*hours;
    if(p.t<g.from)g.from=p.t;if(p.e>g.to)g.to=p.e;
    groups.set(k,g);
  }
  return [...groups.values()].map(g=>({period:g.period,service:g.service,serviceType:g.serviceType,direction:g.direction,
    intervals:g.intervals,hours:g.hours,meanClearedMW:g.weight/g.hours,volumeWeightedPrice:g.weight?g.cost/g.weight:null,from:g.from,to:g.to}))
    .sort((a,b)=>a.period.localeCompare(b.period)||a.service.localeCompare(b.service));
}

function coverageAudit(series){
  const days=[...new Set(series.map(p=>p.auctionDay))].sort(), missingDays=[];
  for(let ms=Date.parse(days[0]+'T00:00:00Z');ms<=Date.parse(days.at(-1)+'T00:00:00Z');ms+=DAY){
    const day=new Date(ms).toISOString().slice(0,10);if(!days.includes(day))missingDays.push(day);
  }
  return {completeObservedEfaDays:days.length,firstEfaDay:days[0],lastEfaDay:days.at(-1),missingDays,
    intervalsPerProduct:series.length/Object.keys(PRODUCTS).length,products:Object.keys(PRODUCTS),windowDays:WINDOW_DAYS,historicalBackfill:false};
}

export function createConnector({request=httpGetText, requestTimeoutMs=20000}={}){
  if(!Number.isInteger(requestTimeoutMs)||requestTimeoutMs<1||requestTimeoutMs>20000)fail('invalid request timeout');
  async function fetchDataset({dataset,previous,now=new Date().toISOString(),log=()=>{}}){
    if(dataset.id!=='gb-eac-reserve')fail('unsupported dataset');
    if(!dataset.republishable)return {skipped:true,reason:'Publication rights are blocked'};
    if(!Number.isFinite(Date.parse(now)))fail('invalid run clock');
    // One attempt; 401/403/429 and all other failures defer to the next existing
    // run. The signal remains live while reading the entire response body.
    const text=await request(DAILY_URL,{log,retries:1,timeoutMs:requestTimeoutMs,signal:AbortSignal.timeout(requestTimeoutMs)});
    const incoming=parseDaily(text), lastDay=incoming[0].auctionDay;
    if(efaBounds(lastDay).from>Date.parse(now)+2*DAY)fail('auction day is implausibly far ahead');
    const old=previous?.series||[];
    if(old.length){
      validateReserveSeries(old);
      const oldLast=old.at(-1).auctionDay;
      if(lastDay<oldLast)fail('daily file is older than the last-good auction');
      const sameDay=old.find(p=>p.auctionDay===lastDay);
      if(sameDay && incoming[0].auctionID<sameDay.auctionID)fail('older auction version');
    }
    // Replace a whole revised auction atomically; never blend versions or trim
    // half an EFA day. No existing connector or global window is changed.
    const cutoff=Date.parse(now)-WINDOW_DAYS*DAY;
    const series=[...old.filter(p=>p.auctionDay!==lastDay),...incoming]
      .filter(p=>efaBounds(p.auctionDay).from>=cutoff).sort(order);
    validateReserveSeries(series);
    const snapshot=buildSnapshot({dataset:{...dataset,source:{...dataset.source,resourceId:RESOURCE_ID,downloadUrl:DAILY_URL,
      inputSha256:createHash('sha256').update(text).digest('hex')}},series,
      coverage:{from:series[0].t,to:series.at(-1).e,resolution:'PT30M',points:series.length},
      units:{price:'GBP/MW/h',power:'MW'},fetchedAt:now,
      derived:{authority:'derived',basis:'auction-clearing',coverageAudit:coverageAudit(series)},
      notes:['Latest-auction daily CSV, accumulated prospectively; earlier archives are not backfilled.',
        'Source delivery timestamps are UTC, including source strings without Z. EFA days end at 23:00 Europe/London and contain 46/48/50 half-hours.',
        'Coverage to is the exclusive delivery end. Future delivery awards are observed auction results, not measured outturn.',
        'Cleared MW is accepted capacity; zero is retained only when explicitly observed. No requirement, offered-volume, battery-share, activation-energy or captured-income estimate.',
        'Directions and BR/QR/SR remain separate. No simultaneous-service maxima sum, energy-price substitution or financial-model input.']});
    log(`  NESO reserve: ${incoming.length} complete latest-auction intervals; ${series.length} retained`);
    return {snapshot};
  }
  return {fetchDataset};
}
export const fetchDataset=createConnector().fetchDataset;

/** A capacity-price summary never enters the generic energy/spread/arbitrage path. */
export function summarize(snapshot){
  const {series,derived,contentChecksum,envelopeChecksum,...envelope}=snapshot;
  const latestDay=derived.coverageAudit.lastEfaDay;
  // /data's generic derived table is for wholesale spreads. Reserve metadata
  // uses its own field, so it cannot create an undefined-duration energy row.
  const summary={...envelope,summarySchemaVersion:1,derived:null,reserve:derived,
    monthly:aggregate(series),latest:aggregate(series.filter(p=>p.auctionDay===latestDay),true),daily:[],arbitrage:null,
    sourceSnapshot:{file:snapshot.datasetId+'.json',contentChecksum,points:series.length}};
  summary.contentChecksum=sha256({summarySchemaVersion:1,sourceSnapshot:summary.sourceSnapshot,units:summary.units,reserve:summary.reserve,monthly:summary.monthly,latest:summary.latest});
  summary.summaryChecksum=sha256(summary);
  return summary;
}
