import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,rm} from 'node:fs/promises';
import {datasetById,snapshotFile,summaryFile} from '../src/governance/datasets.js';
import {IESO_NOTICE} from '../src/governance/dataNotices.js';
import {INDEX_URL,MAX_REPORTS_PER_RUN,XML_LIMIT,discover,parseReport,rollingSeries,createConnector,validateOntarioSnapshot,summarize} from '../etl/sources/ieso-ontario-zonal.mjs';
import {buildSnapshot,verifyContentChecksum,sha256} from '../etl/lib/envelope.mjs';
import {validateSnapshot} from '../etl/lib/validate.mjs';
import {writeSnapshot,REPO_ROOT} from '../etl/lib/boundary.mjs';
import {FetchError} from '../etl/lib/fetch.mjs';
import {runSelection} from '../etl/run.mjs';
import {WINDOW_DAYS} from '../etl/lib/series.mjs';

const dataset=datasetById('ca-on-da-zonal'),now='2026-11-06T22:00:00Z';
const file=(day='2026-11-07',version=1)=>'PUB_DAHourlyOntarioZonalPrice_'+day.replaceAll('-','')+'_v'+version+'.xml';
function xml(day='2026-11-07',value=25){
  const hours=Array.from({length:24},(_,i)=>'<HourlyPriceComponents><PricingHour>'+(i+1)+'</PricingHour><ZonalPrice>'+value+'</ZonalPrice><LossPriceCapped>-0.12</LossPriceCapped><CongestionPriceCapped>0</CongestionPriceCapped><Flag>DSO-RD</Flag></HourlyPriceComponents>').join('');
  return '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="https://reports-public.ieso.ca/docrefs/stylesheet/DAHourlyOntarioZonalPrice_HTML_t1-1.xsl" ?>'
    +'<Document docID="DAHourlyOntarioZonalPrice" xmlns="http://www.ieso.ca/schema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.ieso.ca/schema https://reports-public.ieso.ca/docrefs/schema/DAHourlyOntarioZonalPrice_r1.xsd">'
    +'<DocHeader><DocTitle>Day Ahead Hourly Ontario Zonal Energy Price Report</DocTitle><DocRevision>1</DocRevision><DocConfidentiality><DocConfClass>PUB</DocConfClass></DocConfidentiality><CreatedAt>2026-11-06T13:31:17</CreatedAt></DocHeader><DocBody><DeliveryDate>'+day+'</DeliveryDate>'+hours+'</DocBody></Document>';
}
const index=files=>'<html><body>'+files.map(f=>'<a href="'+f+'">'+f+'</a>').join('')+'</body></html>';
function fake(files=[file()],bodies={}){
  const calls=[],pauses=[];
  const connector=createConnector({pause:async ms=>{pauses.push(ms);},request:async(url,opts)=>{
    calls.push({url,opts});
    if(url===INDEX_URL)return index(files);
    const name=url.slice(INDEX_URL.length);
    if(!files.includes(name))throw new Error('Unexpected source URL');
    return bodies[name]??xml(discover(index([name]))[0].deliveryDate);
  }});
  return {...connector,calls,pauses};
}
async function snapshot(connector=fake(),previous,clock=now){
  return (await connector.fetchDataset({dataset,previous,now:clock})).snapshot;
}

test('Ontario identity is licensed evidence; daily cadence, authority and old source identities remain intact',()=>{
  assert.equal(dataset.connector,'ieso-ontario-zonal');assert.equal(dataset.marketId,'ca_on');
  assert.equal(dataset.republishable,true);assert.equal(dataset.requiresKey,false);assert.deepEqual(dataset.bearsOn,[]);
  assert.equal(dataset.source.noticeId,'ieso');assert.equal(dataset.source.licenceUrl,'https://www.ieso.ca/Terms-of-Use');
  assert.doesNotMatch(dataset.source.licence,/CC|OGL/);assert.equal(dataset.refreshHours,24);
  assert.equal(datasetById('gb-day-ahead').connector,'entsoe');
  assert.equal(datasetById('gb-eac-response').connector,'neso-response');
  assert.equal(datasetById('wa-wem-prices').connector,'aemo-wem');assert.equal(WINDOW_DAYS,365);
});
test('discovery accepts only exact local versioned filenames, deduplicates and orders numeric revisions',()=>{
  const files=[file('2026-11-06',2),file('2026-11-06',10),file('2026-11-06'),file('2026-11-06'),file()];
  const result=discover(index([...files,'../'+file(),'https://other.invalid/'+file(),'PUB_DAHourlyOntarioZonalPrice.xml','PUB_DAHourlyOntarioZonalPrice_20261107.xml']));
  assert.deepEqual(result.map(r=>r.version),[1,2,10,1]);assert.equal(result.length,4);
  for(const value of ['', '<html>login</html>', index([file('2026-02-30')]),'x'.repeat(1048577)])assert.throws(()=>discover(value),/IESO Ontario/);
});
test('report version comes from vN while DocRevision identifies schema; all source fields and flags remain separate',()=>{
  const report=parseReport(xml().replace('<Flag>DSO-RD</Flag>','<Flag>ADMIN</Flag>'),file('2026-11-07',3));
  assert.equal(report.version,3);assert.equal(report.schemaRevision,1);assert.equal(report.rows.length,24);
  assert.deepEqual(report.rows[0],{hourEnding:1,v:25,lossPrice:-0.12,congestionPrice:0,flag:'ADMIN'});
  assert.equal(report.createdAtSourceText,'2026-11-06T13:31:17');assert.match(report.sourceSha256,/^[a-f0-9]{64}$/);
});
test('fixed EST delivery has 24 hours even on civil DST dates; no Toronto wall-time conversion',async()=>{
  for(const day of ['2026-03-08','2026-07-01','2026-11-01']){
    const s=await snapshot(fake([file(day)]));
    assert.equal(s.series.length,24);assert.equal(s.series[0].t,day+'T05:00:00.000Z');
    assert.equal(s.series[0].hourEnding,1);assert.equal(s.series.at(-1).hourEnding,24);
    assert.equal(Date.parse(s.coverage.to)-Date.parse(s.coverage.from),86400000);
  }
});
test('missing, duplicate, empty, non-numeric and wrongly dated hours reject the complete file',()=>{
  const source=xml();
  for(const body of [
    source.replace(/<HourlyPriceComponents>[\s\S]*?<\/HourlyPriceComponents>/,''),
    source.replace('<PricingHour>2</PricingHour>','<PricingHour>1</PricingHour>'),
    source.replace('<ZonalPrice>25</ZonalPrice>','<ZonalPrice/>'),
    source.replace('<ZonalPrice>25</ZonalPrice>','<ZonalPrice>NaN</ZonalPrice>'),
    source.replace('<ZonalPrice>25</ZonalPrice>','<ZonalPrice>1000001</ZonalPrice>'),
    source.replace('<DeliveryDate>2026-11-07</DeliveryDate>','<DeliveryDate>2026-11-06</DeliveryDate>'),
  ])assert.throws(()=>parseReport(body,file()),/IESO Ontario/);
  assert.equal(parseReport(xml('2026-11-07',0),file()).rows[0].v,0);
  assert.equal(parseReport(xml('2026-11-07',-20.35),file()).rows[0].v,-20.35);
});
test('malformed XML, entity/DTD, namespace, confidential class and supplemental conditions fail closed',()=>{
  for(const body of [
    '<!DOCTYPE Document [<!ENTITY x SYSTEM "file:///invalid">]>'+xml(),
    xml().replace('<ZonalPrice>25</ZonalPrice>','<ZonalPrice>&x;</ZonalPrice>'),
    xml().replace('xmlns="http://www.ieso.ca/schema"','xmlns="https://other.invalid/schema"'),
    xml().replace('<DocConfClass>PUB</DocConfClass>','<DocConfClass>CNF</DocConfClass>'),
    xml().replace('</CreatedAt>','</CreatedAt><Disclaimer>Additional conditions</Disclaimer>'),
    xml().replace('<DocBody>','<DocBody xmlns="https://other.invalid/">'),
    xml().replace('</DocBody>','</DocHeader>'),
    xml().replace('13:31:17','25:31:17'),
    xml().replace('<DocRevision>1</DocRevision>','<DocRevision>2</DocRevision>'),
    'x'.repeat(XML_LIMIT+1),
  ])assert.throws(()=>parseReport(body,file()),/IESO Ontario/);
  assert.deepEqual(parseReport('\uFEFF'+xml(),file()).rows,parseReport(xml(),file()).rows);
});
test('new revisions append atomically, old versions survive, rolling view selects the newest version',async()=>{
  const first=await snapshot(fake([file('2026-11-07',1)]));
  const revised=await snapshot(fake([file('2026-11-07',1),file('2026-11-07',2)],{[file('2026-11-07',2)]:xml('2026-11-07',30)}),first);
  assert.equal(revised.archive.reports.length,2);
  assert.equal(first.archive.reports[0].rows[0].v,25);assert.equal(revised.archive.reports[0].rows[0].v,25);
  assert.ok(revised.series.every(p=>p.reportVersion===2&&p.v===30));assert.equal(revised.series.length,24);
  assert.equal(validateOntarioSnapshot(revised),true);assert.equal(verifyContentChecksum(revised),true);
  const olderListing=await snapshot(fake([file()]),revised);
  assert.ok(olderListing.series.every(p=>p.reportVersion===2));assert.equal(olderListing.archive.reports.length,2);
});
test('a changed immutable version rejects the run and leaves caller last-good archive intact',async()=>{
  const first=await snapshot(),before=JSON.stringify(first);
  await assert.rejects(snapshot(fake([file()],{[file()]:xml('2026-11-07',26)}),first),/changed without a new version/);
  assert.equal(JSON.stringify(first),before);
});
test('archive survives the 365-day rolling cutoff without changing other datasets retention',async()=>{
  const first=await snapshot(fake([file('2026-07-01')]));
  const next=await snapshot(fake([file('2028-01-01')]),first,'2027-12-31T22:00:00Z');
  assert.equal(next.archive.reports.length,2);assert.equal(next.series.length,24);
  assert.ok(next.series.every(p=>p.deliveryDate==='2028-01-01'));
  assert.equal(next.archive.reports[0].deliveryDate,'2026-07-01');assert.equal(WINDOW_DAYS,365);
});
test('checksums bind archives to rolling values; tampered archives, units and notice fail verification',async()=>{
  const first=await snapshot();
  for(const edit of [
    s=>s.archive.reports[0].rows[0].v++,
    s=>s.series[0].v++,
    s=>s.archive.reports[0].rows[0].extra='unreviewed',
    s=>s.units.price='USD/MWh',
    s=>s.source.notice='',
    s=>s.source.name='changed after publication',
    s=>s.archive.reports[0].createdAtSourceText='2026-02-30T13:00:00',
  ]){
    const bad=structuredClone(first);edit(bad);assert.throws(()=>validateOntarioSnapshot(bad),/IESO Ontario/);
  }
});
test('bounded batches protect earliest missing files and newest day, disclose actual gaps and pending work',async()=>{
  const files=Array.from({length:20},(_,i)=>file('2026-10-'+String(i+1).padStart(2,'0')));
  const c=fake(files),s=await snapshot(c);
  assert.equal(c.calls.length,MAX_REPORTS_PER_RUN+1);assert.equal(s.archive.reports.length,MAX_REPORTS_PER_RUN);
  assert.equal(s.archive.reports[0].deliveryDate,'2026-10-01');assert.equal(s.archive.reports.at(-1).deliveryDate,'2026-10-20');
  assert.equal(s.derived.coverageAudit.pendingReportFiles.length,8);assert.equal(s.derived.coverageAudit.missingDays.length,8);
  assert.equal(s.derived.coverageAudit.actualIntervals,12*24);assert.equal(s.derived.coverageAudit.expectedIntervalsBetweenObservedEndpoints,20*24);
  assert.ok(c.calls.every(x=>x.opts.retries===1&&x.opts.redirect==='error'&&x.opts.signal instanceof AbortSignal));
  assert.ok(c.pauses.every(ms=>ms===1000));
});
test('cached complete versions need only directory plus latest recheck; clock-only refresh is content-identical',async()=>{
  const first=await snapshot(),c=fake(),next=await snapshot(c,first,'2026-11-06T23:00:00Z');
  assert.equal(c.calls.length,2);assert.equal(next.contentChecksum,first.contentChecksum);
  assert.equal(next.archive.reports[0].retrievedAt,first.archive.reports[0].retrievedAt);
  assert.equal(summarize(next).contentChecksum,summarize(first).contentChecksum);
});
test('summary is small and licensed, has source-day prices and flags but no archive payload or arbitrage',async()=>{
  const s=await snapshot(),summary=summarize(s);
  assert.equal(summary.source.notice,IESO_NOTICE);assert.equal(summary.derived,null);assert.equal(summary.arbitrage,null);
  assert.deepEqual(summary.daily,[]);assert.equal(summary.archive,undefined);
  assert.equal(summary.zonal.latest.hours,24);assert.equal(summary.zonal.latest.meanPrice,25);
  assert.equal(summary.zonal.latest.flags['DSO-RD'],24);
  assert.equal(summary.sourceSnapshot.archiveChecksum,sha256(s.archive));assert.equal(summary.sourceSnapshot.points,24);
  const {summaryChecksum,...body}=summary;assert.equal(summaryChecksum,sha256(body));
  assert.equal(validateSnapshot(s,dataset).ok,true);
});
test('rights block makes no requests; invalid configuration, empty directory and future data reject',async()=>{
  const c=fake();assert.equal((await c.fetchDataset({dataset:{...dataset,republishable:false},now})).skipped,true);
  assert.equal(c.calls.length,0);
  for(const opts of [{spacingMs:-1},{timeoutMs:20001},{timeoutMs:NaN},{runTimeoutMs:90001}])assert.throws(()=>createConnector(opts),/budget/);
  await assert.rejects(snapshot(fake([file('2030-01-01')])),/future/);
  await assert.rejects(snapshot(createConnector({request:async()=>''})),/directory/);
});
test('401/403/429, failed and partial reports stop without retries or another URL',async()=>{
  for(const status of [401,403,429]){
    const calls=[];const connector=createConnector({pause:async()=>{},request:async url=>{
      calls.push(url);if(url===INDEX_URL)return index([file('2026-11-06'),file()]);
      throw new FetchError('source denied',{status});
    }});
    await assert.rejects(snapshot(connector),/source denied/);assert.equal(calls.length,2);
  }
  await assert.rejects(snapshot(fake([file()],{[file()]:xml().replace('<PricingHour>24</PricingHour>','<PricingHour>23</PricingHour>')})),/duplicate/);
});
test('whole-body caller signal and run budget terminate a stalled source',async()=>{
  const c=createConnector({timeoutMs:8,runTimeoutMs:30,request:async(_url,{signal})=>new Promise((resolve,reject)=>{
    const keepAlive=setTimeout(()=>resolve('unexpected'),200);
    signal.addEventListener('abort',()=>{clearTimeout(keepAlive);reject(new Error('bounded timeout'));},{once:true});
  })});
  await assert.rejects(snapshot(c),/timeout/);
});
test('real writer skips clock-only content and real executor preserves last-good while another provider succeeds',async()=>{
  const id='__test-ieso-retention',otherId='__test-ieso-independent';
  const fakeDataset={...dataset,id},other={...dataset,id:otherId,connector:'independent'};
  const base=buildSnapshot({dataset:fakeDataset,coverage:{from:'2026-11-01T05:00:00Z',to:'2026-11-01T05:00:00Z',points:1},units:{price:'CAD/MWh'},series:[{t:'2026-11-01T05:00:00Z',v:25}],fetchedAt:now});
  const paths=[snapshotFile(id),summaryFile(id),snapshotFile(otherId),summaryFile(otherId)];
  try{
    await writeSnapshot(paths[0],base);
    const before=await readFile(REPO_ROOT+'/'+paths[0],'utf8');
    assert.equal((await writeSnapshot(paths[0],{...base,fetchedAt:'2026-11-06T23:00:00Z'})).written,false);
    const result=await runSelection({datasets:[fakeDataset,other],now,log:()=>{},dryRun:false,connectors:{
      'ieso-ontario-zonal':{fetchDataset:async()=>{throw new FetchError('HTTP 403',{status:403});}},
      independent:{fetchDataset:async()=>({snapshot:buildSnapshot({dataset:other,coverage:base.coverage,units:base.units,series:base.series,fetchedAt:now})})},
    }});
    assert.equal(result.results[0].status,'fetch-failed');assert.equal(result.results[1].status,'written');
    assert.equal(await readFile(REPO_ROOT+'/'+paths[0],'utf8'),before);
  }finally{await Promise.all(paths.map(p=>rm(REPO_ROOT+'/'+p,{force:true})));}
});
