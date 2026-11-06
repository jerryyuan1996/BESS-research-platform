/* Ontario DA zonal prices: bounded public XML discovery, immutable-version
   archive, separate rolling view. Neither HOEP nor nodal LMP nor project income. */
import {httpGet} from '../lib/fetch.mjs';
import {buildSnapshot, sha256, verifyContentChecksum} from '../lib/envelope.mjs';
import {WINDOW_DAYS} from '../lib/series.mjs';
import {setTimeout as delay} from 'node:timers/promises';
import {createHash} from 'node:crypto';
import {IESO_NOTICE} from '../../src/governance/dataNotices.js';

export const INDEX_URL = 'https://reports-public.ieso.ca/public/DAHourlyOntarioZonalPrice/';
export const MAX_REPORTS_PER_RUN = 12;
export const XML_LIMIT = 65536, INDEX_LIMIT = 1024*1024;
const HOUR=3600000, DAY=24*HOUR, MAX_ARCHIVE_BYTES=16*1024*1024;
const FILE=/^PUB_DAHourlyOntarioZonalPrice_(\d{8})_v([1-9]\d{0,5})\.xml$/;
const fail=message=>{throw new Error('IESO Ontario: '+message);};
const hash=text=>createHash('sha256').update(text).digest('hex');
const equal=(a,b)=>sha256(a)===sha256(b);
const price=value=>typeof value==='number' && Number.isFinite(value) && value>=-100000 && value<=1000000;
const dayStart=day=>Date.parse(day+'T00:00:00-05:00');
function validDay(day){
  return typeof day==='string' && /^\d{4}-\d{2}-\d{2}$/.test(day)
    && Number.isFinite(Date.parse(day)) && new Date(day+'T00:00:00Z').toISOString().slice(0,10)===day;
}
function fileIdentity(file){
  const m=FILE.exec(file||'');if(!m)fail('invalid report filename');
  const day=m[1].slice(0,4)+'-'+m[1].slice(4,6)+'-'+m[1].slice(6);
  if(!validDay(day))fail('invalid report delivery date');
  return {file,deliveryDate:day,version:Number(m[2])};
}
export function discover(text){
  if(typeof text!=='string' || !text.trim() || Buffer.byteLength(text)>INDEX_LIMIT)fail('empty or oversized directory');
  const files=new Set();
  for(const m of text.matchAll(/href\s*=\s*["']([^"']+)["']/gi)){
    if(FILE.test(m[1]))files.add(m[1]);
  }
  if(!files.size || files.size>128)fail('unexpected directory report count');
  return [...files].map(fileIdentity).sort((a,b)=>a.deliveryDate.localeCompare(b.deliveryDate)||a.version-b.version);
}

/* Deliberately a strict reader for this small known XML contract. No DTD,
   entities beyond XML's five literals, CDATA, external loads or stylesheet use.
   Unknown structure fails closed rather than being silently skipped. */
function xmlTree(text){
  if(typeof text!=='string' || !text.trim() || Buffer.byteLength(text)>XML_LIMIT
      || /<!|[\u0000\uFFFD]/.test(text))fail('invalid or oversized XML');
  const input=text.replace(/^\uFEFF/,'').trim(), stack=[], roots=[];let offset=0,nodes=0;
  const decode=value=>{
    if(/&(?!(?:amp|lt|gt|quot|apos);)/.test(value))fail('unsupported XML entity');
    return value.replace(/&(amp|lt|gt|quot|apos);/g,(_,k)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[k]));
  };
  for(const token of input.matchAll(/<[^>]*>|[^<]+/g)){
    if(token.index!==offset)fail('malformed XML');const t=token[0];offset+=t.length;
    if(t.startsWith('<?')){
      if(!/^<\?xml(?:-stylesheet)?\s[^?]*\?>$/.test(t) || stack.length)fail('unexpected XML instruction');
      continue;
    }
    if(t.startsWith('</')){
      const m=/^<\/([A-Za-z][\w:-]*)\s*>$/.exec(t);
      if(!m || stack.pop()?.name!==m[1])fail('unbalanced XML');continue;
    }
    if(t.startsWith('<')){
      const m=/^<([A-Za-z][\w:-]*)([\s\S]*?)(\/?)>$/.exec(t);
      if(!m || ++nodes>400 || stack.length>6)fail('invalid XML element');
      const attrs=Object.create(null), rest=m[2];let at=0;
      for(const a of rest.matchAll(/\s+([A-Za-z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)){
        if(a.index!==at || Object.hasOwn(attrs,a[1]))fail('invalid XML attributes');
        attrs[a[1]]=decode(a[2]??a[3]);at=a.index+a[0].length;
      }
      if(rest.slice(at).trim())fail('invalid XML attributes');
      const node={name:m[1],attrs,children:[],text:''};
      if(stack.length)stack.at(-1).children.push(node);else roots.push(node);
      if(!m[3])stack.push(node);
    }else if(stack.length)stack.at(-1).text+=decode(t);
    else if(t.trim())fail('text outside XML document');
  }
  if(offset!==input.length || stack.length || roots.length!==1)fail('incomplete XML');
  return roots[0];
}
const children=(node,names)=>{
  if(node.text.trim() || (node.name!=='Document' && Object.keys(node.attrs).length)
      || !equal(node.children.map(n=>n.name),names))fail('unexpected '+node.name+' structure');
  return node.children;
};
const scalar=node=>{
  if(!node || node.children.length || Object.keys(node.attrs).length)fail('invalid scalar element');
  return node.text.trim();
};
function decimal(node){
  const text=scalar(node);if(!/^[+-]?\d+(?:\.\d{1,2})?$/.test(text))fail('missing or invalid price');
  const value=Number(text);if(!price(value))fail('price outside source-specific bounds');return value;
}
export function parseReport(text,file){
  const identity=fileIdentity(file), root=xmlTree(text);
  if(root.name!=='Document' || root.attrs.docID!=='DAHourlyOntarioZonalPrice'
      || root.attrs.xmlns!=='http://www.ieso.ca/schema'
      || root.attrs['xmlns:xsi']!=='http://www.w3.org/2001/XMLSchema-instance'
      || root.attrs['xsi:schemaLocation']!=='http://www.ieso.ca/schema https://reports-public.ieso.ca/docrefs/schema/DAHourlyOntarioZonalPrice_r1.xsd'
      || Object.keys(root.attrs).length!==4)fail('unknown report identity/schema');
  const [header,body]=children(root,['DocHeader','DocBody']);
  const [title,revision,confidentiality,created]=children(header,['DocTitle','DocRevision','DocConfidentiality','CreatedAt']);
  if(scalar(title)!=='Day Ahead Hourly Ontario Zonal Energy Price Report' || scalar(revision)!=='1'
      || scalar(children(confidentiality,['DocConfClass'])[0])!=='PUB')fail('unreviewed or non-public document');
  const createdAtSourceText=scalar(created);
  if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(createdAtSourceText)
      || !validDay(createdAtSourceText.slice(0,10))
      || !Number.isFinite(Date.parse(createdAtSourceText+'Z'))
      || new Date(createdAtSourceText+'Z').toISOString().slice(0,19)!==createdAtSourceText)fail('invalid source creation timestamp');
  const entries=children(body,['DeliveryDate',...Array(24).fill('HourlyPriceComponents')]);
  if(scalar(entries[0])!==identity.deliveryDate)fail('filename/delivery-date mismatch');
  const seen=new Set(), rows=entries.slice(1).map(node=>{
    const [hour,zonal,loss,congestion,flag]=children(node,['PricingHour','ZonalPrice','LossPriceCapped','CongestionPriceCapped','Flag']);
    const h=scalar(hour), f=scalar(flag);
    if(!/^(?:[1-9]|1\d|2[0-4])$/.test(h) || seen.has(Number(h)))fail('invalid or duplicate hour ending');
    if(!/^[A-Z][A-Z0-9_-]{0,31}$/.test(f))fail('unknown source flag format');
    seen.add(Number(h));
    return {hourEnding:Number(h),v:decimal(zonal),lossPrice:decimal(loss),congestionPrice:decimal(congestion),flag:f};
  }).sort((a,b)=>a.hourEnding-b.hourEnding);
  return {...identity,schemaRevision:1,createdAtSourceText,sourceSha256:hash(text),rows};
}
function validateArchive(archive){
  if(archive?.schemaVersion!==1 || !Array.isArray(archive.reports) || !archive.reports.length
      || archive.reports.length>6000 || Buffer.byteLength(JSON.stringify(archive))>MAX_ARCHIVE_BYTES)fail('invalid or oversized archive');
  const files=new Set();let last='';
  for(const report of archive.reports){
    const id=fileIdentity(report?.file);
    if(!equal(Object.keys(report).sort(),['file','deliveryDate','version','schemaRevision','createdAtSourceText','sourceSha256','rows','retrievedAt'].sort())
        || report.deliveryDate!==id.deliveryDate || report.version!==id.version || report.schemaRevision!==1
        || !/^[a-f0-9]{64}$/.test(report.sourceSha256||'') || !Number.isFinite(Date.parse(report.retrievedAt))
        || typeof report.createdAtSourceText!=='string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d$/.test(report.createdAtSourceText)
        || !validDay(report.createdAtSourceText.slice(0,10)) || !Number.isFinite(Date.parse(report.createdAtSourceText+'Z'))
        || new Date(report.createdAtSourceText+'Z').toISOString().slice(0,19)!==report.createdAtSourceText
        || !Array.isArray(report.rows) || report.rows.length!==24 || files.has(report.file) || report.file<last)fail('invalid archived report');
    files.add(report.file);last=report.file;
    for(const [i,row] of report.rows.entries()){
      if(!equal(Object.keys(row).sort(),['hourEnding','v','lossPrice','congestionPrice','flag'].sort())
          || row.hourEnding!==i+1 || !price(row.v) || !price(row.lossPrice) || !price(row.congestionPrice)
          || !/^[A-Z][A-Z0-9_-]{0,31}$/.test(row.flag||''))fail('invalid archived hour');
    }
  }
}
function latestReports(archive){
  const byDay=new Map();
  for(const r of archive.reports)if(!byDay.has(r.deliveryDate) || byDay.get(r.deliveryDate).version<r.version)byDay.set(r.deliveryDate,r);
  return [...byDay.values()].sort((a,b)=>a.deliveryDate.localeCompare(b.deliveryDate));
}
export function rollingSeries(archive,now){
  const cutoff=Date.parse(now)-WINDOW_DAYS*DAY;
  return latestReports(archive).filter(r=>dayStart(r.deliveryDate)>=cutoff).flatMap(r=>r.rows.map(p=>({
    t:new Date(dayStart(r.deliveryDate)+(p.hourEnding-1)*HOUR).toISOString(),
    e:new Date(dayStart(r.deliveryDate)+p.hourEnding*HOUR).toISOString(),
    ...p,deliveryDate:r.deliveryDate,reportVersion:r.version,
  })));
}
function audit(archive,listing,series){
  const latest=latestReports(archive), days=new Set(latest.map(r=>r.deliveryDate));
  const availableDays=new Set(listing.map(r=>r.deliveryDate)), files=new Set(archive.reports.map(r=>r.file));
  const observed=[...new Set(series.map(p=>p.deliveryDate))], missingDays=[];
  for(let t=dayStart(observed[0]);t<=dayStart(observed.at(-1));t+=DAY){
    const day=new Date(t-5*HOUR).toISOString().slice(0,10);if(!observed.includes(day))missingDays.push(day);
  }
  return {archiveReports:archive.reports.length,archiveDeliveryDays:days.size,archiveFirst:latest[0].deliveryDate,archiveLast:latest.at(-1).deliveryDate,
    availableDeliveryDays:availableDays.size,archivedAvailableDeliveryDays:[...availableDays].filter(d=>days.has(d)).length,
    pendingReportFiles:listing.filter(r=>!files.has(r.file)).map(r=>r.file),
    completeRollingDays:observed.length,expectedIntervalsBetweenObservedEndpoints:(observed.length+missingDays.length)*24,
    actualIntervals:series.length,missingDays,windowDays:WINDOW_DAYS};
}
export function validateOntarioSnapshot(snapshot){
  if(snapshot?.datasetId!=='ca-on-da-zonal' || !equal(snapshot.units,{price:'CAD/MWh'})
      || snapshot.source?.notice!==IESO_NOTICE || snapshot.source?.licenceUrl!=='https://www.ieso.ca/Terms-of-Use')fail('snapshot identity, units or reproduction notice changed');
  const {envelopeChecksum,...envelope}=snapshot;
  if(envelopeChecksum!==sha256(envelope))fail('provenance envelope checksum mismatch');
  validateArchive(snapshot.archive);
  if(snapshot.derived?.archiveChecksum!==sha256(snapshot.archive) || !verifyContentChecksum(snapshot)
      || !equal(snapshot.series,rollingSeries(snapshot.archive,snapshot.fetchedAt))
      || snapshot.coverage?.from!==snapshot.series[0]?.t || snapshot.coverage?.to!==snapshot.series.at(-1)?.e
      || snapshot.coverage?.points!==snapshot.series.length || snapshot.coverage?.resolution!=='PT1H')fail('archive/rolling snapshot integrity mismatch');
  return true;
}
async function boundedText(url,opts){
  const response=await httpGet(url,{...opts,redirect:'error'});
  const reader=response.body.getReader(), chunks=[];let size=0;
  try{
    for(;;){
      const {done,value}=await reader.read();if(done)break;
      size+=value.length;if(size>opts.limit)fail('response exceeds byte budget');chunks.push(Buffer.from(value));
    }
  }finally{await reader.cancel().catch(()=>{});}
  return new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(Buffer.concat(chunks));
}
export function createConnector({request=boundedText,pause=delay,spacingMs=1000,timeoutMs=20000,runTimeoutMs=90000}={}){
  if(!Number.isInteger(spacingMs)||spacingMs<0||spacingMs>5000 || !Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>20000
      || !Number.isInteger(runTimeoutMs)||runTimeoutMs<1||runTimeoutMs>90000)fail('invalid request budget');
  async function fetchDataset({dataset,previous,now=new Date().toISOString(),log=()=>{}}){
    if(dataset.id!=='ca-on-da-zonal')fail('unsupported dataset');
    if(!dataset.republishable)return {skipped:true,reason:'Publication rights are blocked'};
    if(!Number.isFinite(Date.parse(now)))fail('invalid run clock');
    if(previous)validateOntarioSnapshot(previous);
    const runSignal=AbortSignal.timeout(runTimeoutMs);let requests=0;
    const get=async(url,limit)=>{
      if(requests++)await pause(spacingMs,undefined,{signal:runSignal});
      const signal=AbortSignal.any([runSignal,AbortSignal.timeout(timeoutMs)]);
      const text=await request(url,{limit,signal,timeoutMs,retries:1,redirect:'error',log});
      if(signal.aborted)fail('request deadline exceeded');
      if(typeof text!=='string'||Buffer.byteLength(text)>limit)fail('response exceeds byte budget');
      return text;
    };
    const listing=discover(await get(INDEX_URL,INDEX_LIMIT));
    if(dayStart(listing.at(-1).deliveryDate)>Date.parse(now)+2*DAY)fail('implausible future delivery date');
    const reports=new Map((previous?.archive?.reports||[]).map(r=>[r.file,r]));
    // Recheck the newest version; then protect the oldest unarchived files first.
    const newest=listing.at(-1), missing=listing.filter(r=>!reports.has(r.file)&&r.file!==newest.file);
    const selected=[newest,...missing.slice(0,MAX_REPORTS_PER_RUN-1)];
    for(const identity of selected){
      const report=parseReport(await get(INDEX_URL+identity.file,XML_LIMIT),identity.file);
      const old=reports.get(report.file);
      if(old){
        const {retrievedAt,sourceSha256,...prior}=old;
        const {sourceSha256:inputHash,...incoming}=report;
        if(!equal(prior,incoming))fail('a versioned report changed without a new version');
        continue;
      }
      reports.set(report.file,{...report,retrievedAt:now});
    }
    const archive={schemaVersion:1,reports:[...reports.values()].sort((a,b)=>a.file.localeCompare(b.file))};
    validateArchive(archive);
    const series=rollingSeries(archive,now);if(!series.length)fail('no complete rolling days');
    const coverageAudit=audit(archive,listing,series);
    const {noticeId,...source}=dataset.source;
    const observedDataset={...dataset,source:{...source,notice:IESO_NOTICE}};
    const snapshot=buildSnapshot({dataset:observedDataset,series,coverage:{from:series[0].t,to:series.at(-1).e,resolution:'PT1H',points:series.length},
      units:{price:'CAD/MWh'},fetchedAt:now,derived:{authority:'derived',basis:'coverage-and-archive-integrity',archiveChecksum:sha256(archive),coverageAudit},
      notes:['Ontario day-ahead zonal energy price and capped loss/congestion components; not OEMP, nodal LMP, HOEP or project settlement.',
        'Delivery hours are hour-ending 1–24 in fixed EST (UTC-05:00), including civil clock-change days. Coverage to is exclusive.',
        'Source CreatedAt has no offset: it is retained verbatim, without claiming a UTC conversion. Filename vN is the report version; DocRevision is the schema revision.',
        'Archive retains every acquired version independently of the 365-day rolling series. Discovery is not a download-coverage claim. Missing/empty hours are never zero-filled.',
        'No price-to-income, annualisation, dispatch, model-input or investment-view authority.']});
    snapshot.archive=archive;
    const {envelopeChecksum,...body}=snapshot;snapshot.envelopeChecksum=sha256(body);
    validateOntarioSnapshot(snapshot);
    log('  IESO Ontario: '+selected.length+' reports checked; '+archive.reports.length+' versions archived; '+series.length+' hourly points; '+coverageAudit.pendingReportFiles.length+' files pending');
    return {snapshot};
  }
  return {fetchDataset};
}
export const fetchDataset=createConnector().fetchDataset;
export function summarize(snapshot){
  validateOntarioSnapshot(snapshot);
  const {archive,series,derived,contentChecksum,envelopeChecksum,...envelope}=snapshot;
  const byDay=new Map();
  for(const p of series){
    const g=byDay.get(p.deliveryDate)||{date:p.deliveryDate,hours:0,sum:0,min:Infinity,max:-Infinity,flags:{}};
    g.hours++;g.sum+=p.v;g.min=Math.min(g.min,p.v);g.max=Math.max(g.max,p.v);g.flags[p.flag]=(g.flags[p.flag]||0)+1;byDay.set(p.deliveryDate,g);
  }
  const days=[...byDay.values()].map(({sum,...g})=>({...g,meanPrice:sum/g.hours}));
  const summary={...envelope,summarySchemaVersion:1,derived:null,daily:[],arbitrage:null,
    zonal:{coverageAudit:derived.coverageAudit,deliveryTimezone:'EST (UTC-05:00)',daily:days,latest:days.at(-1)},
    sourceSnapshot:{file:snapshot.datasetId+'.json',contentChecksum,archiveChecksum:derived.archiveChecksum,points:series.length}};
  summary.contentChecksum=sha256({sourceSnapshot:summary.sourceSnapshot,units:summary.units,zonal:summary.zonal});
  summary.summaryChecksum=sha256(summary);
  return summary;
}
