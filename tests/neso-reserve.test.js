import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,rm} from 'node:fs/promises';
import {setTimeout as delay} from 'node:timers/promises';
import {datasetById,snapshotFile,summaryFile} from '../src/governance/datasets.js';
import {DAILY_URL,PRODUCTS,efaBounds,parseDaily,validateReserveSeries,aggregate,createConnector,summarize} from '../etl/sources/neso-reserve.mjs';
import {SERVICES,queries} from '../etl/sources/neso-response.mjs';
import {buildSnapshot,verifyContentChecksum,sha256} from '../etl/lib/envelope.mjs';
import {writeSnapshot,REPO_ROOT} from '../etl/lib/boundary.mjs';
import {validateSnapshot} from '../etl/lib/validate.mjs';
import {FetchError} from '../etl/lib/fetch.mjs';
import {runSelection} from '../etl/run.mjs';
import {WINDOW_DAYS} from '../etl/lib/series.mjs';

const dataset=datasetById('gb-eac-reserve'),now='2026-11-06T16:00:00Z';
const columns=['auctionID','auctionProduct','serviceType','deliveryStart','deliveryEnd','clearedVolume','clearingPrice','linkedServiceWindowID'];
function rows(day='2026-11-07',auctionID=2972){
  const {from,periods}=efaBounds(day);
  return Object.entries(PRODUCTS).flatMap(([service,p])=>Array.from({length:periods},(_,i)=>({
    auctionID,auctionProduct:service,serviceType:p.serviceType,
    deliveryStart:new Date(from+i*1800000).toISOString().replace('.000Z',''),
    deliveryEnd:new Date(from+(i+1)*1800000).toISOString().replace('.000Z',''),
    clearedVolume:service==='NSR'?0:100+i,clearingPrice:service==='NSR'?0:5,
    linkedServiceWindowID:service.endsWith('QR')?123:'',
  })));
}
const csv=(values,header=columns)=>header.join(',')+'\n'+values.map(row=>header.map(c=>String(row[c]??'')).join(',')).join('\n')+'\n';
const body=(day,auctionID)=>csv(rows(day,auctionID));
const fetchBody=text=>createConnector({request:async()=>text});

test('new reserve identity is licensed context; old response filter and dataset stay intact',()=>{
  assert.equal(dataset.connector,'neso-reserve');assert.equal(dataset.kind,'timeseries');
  assert.equal(dataset.republishable,true);assert.equal(dataset.requiresKey,false);assert.deepEqual(dataset.bearsOn,[]);
  assert.equal(dataset.source.attribution,'Supported by National Energy SO Open Data');
  assert.match(dataset.source.licenceUrl,/neso-open-licence/);assert.equal(dataset.refreshHours,6);
  assert.deepEqual(SERVICES,['DCL','DCH','DRL','DRH','DML','DMH']);
  assert.equal(datasetById('gb-eac-response').connector,'neso-response');
  const q=queries('888e5029-f786-41d2-bc15-cbfd1d285e96','ddc4afde-d2bd-424d-891c-56ad49c13d1a');
  assert.doesNotMatch(q.summary,/NBR|PBR|NQR|PQR|NSR|PSR/);
  assert.equal(datasetById('gb-day-ahead').connector,'entsoe');assert.equal(WINDOW_DAYS,365);
});

test('EFA 23:00 London boundaries retain 46/48/50 half-hours across BST changes',()=>{
  for(const [day,periods,from,to] of [
    ['2026-03-29',46,'2026-03-28T23:00:00Z','2026-03-29T22:00:00Z'],
    ['2026-07-01',48,'2026-06-30T22:00:00Z','2026-07-01T22:00:00Z'],
    ['2026-10-25',50,'2026-10-24T22:00:00Z','2026-10-25T23:00:00Z'],
  ]){
    assert.deepEqual(efaBounds(day),{from:Date.parse(from),to:Date.parse(to),periods});
    const series=parseDaily(body(day));assert.equal(series.length,6*periods);
    assert.equal(series[0].t,new Date(from).toISOString());assert.equal(series.at(-1).e,new Date(to).toISOString());
    assert.ok(series.every(p=>p.auctionDay===day));
  }
});

test('source-naive UTC is not London wall time; response rows do not change reserve outputs',()=>{
  const input=rows('2026-07-01');
  input.push({...input[0],auctionProduct:'DCL',serviceType:'Response',clearedVolume:1000});
  const series=parseDaily(csv(input));assert.equal(series.length,288);
  assert.equal(series[0].t,'2026-06-30T22:00:00.000Z');
  assert.equal(series[0].linkedServiceWindowID,null);
  assert.equal(series.find(p=>p.service==='NQR').linkedServiceWindowID,123);
});

test('quoted and reordered CSV, BOM and CRLF remain deterministic; extra fields never escape',()=>{
  const input=rows(),header=[...columns].reverse().concat('unused');
  const quoted='\uFEFF'+header.map(c=>'"'+c+'"').join(',')+'\r\n'+input.map(r=>header.map(c=>'"'+String(r[c]??'').replaceAll('"','""')+'"').join(',')).join('\r\n')+'\r\n';
  assert.deepEqual(parseDaily(quoted),parseDaily(csv([...input].reverse())));
  assert.ok(parseDaily(quoted).every(p=>!Object.hasOwn(p,'unused')));
});

test('negative prices and observed zero MW survive without missing-to-zero conversion',()=>{
  const input=rows();input[0].clearingPrice=-15;
  const series=parseDaily(csv(input));assert.equal(series[0].v,-15);
  assert.equal(series.find(p=>p.service==='NSR').clearedMW,0);
  for(const value of ['',null,'NaN','Infinity','1e999',-1,100001]){
    const bad=rows();bad[0].clearedVolume=value;assert.throws(()=>parseDaily(csv(bad)),/NESO reserve:/);
  }
});

test('invalid prices, IDs, service types, calendar dates or interval lengths fail closed',()=>{
  const changes=[
    {clearingPrice:''},{clearingPrice:1000001},{clearingPrice:-100001},{auctionID:0},{auctionID:1.5},
    {linkedServiceWindowID:0},{serviceType:'Response'},{deliveryStart:'2026-02-30T23:00:00'},
    {deliveryStart:'2026-11-06T23:15:00'},{deliveryEnd:'2026-11-07T00:00:00'},
  ];
  for(const change of changes){const bad=rows();Object.assign(bad[0],change);assert.throws(()=>parseDaily(csv(bad)));}
});

test('partial days, absent zero-MW products, empty/HTML/oversized and truncated CSV fail',()=>{
  const incomplete=rows();incomplete.pop();assert.throws(()=>parseDaily(csv(incomplete)),/incomplete/);
  assert.throws(()=>parseDaily(csv(rows().filter(r=>r.auctionProduct!=='NSR'))),/incomplete/);
  for(const text of ['', '<html>not data</html>', 'x'.repeat(1024*1024+1), body().trimEnd()+',', '"unterminated'])assert.throws(()=>parseDaily(text));
  assert.throws(()=>parseDaily(csv(rows(),columns.filter(c=>c!=='clearingPrice'))),/columns/);
});

test('identical duplicates deduplicate; conflicts, unknown products and mixed auctions fail',()=>{
  const input=rows();assert.deepEqual(parseDaily(csv([...input,input[0]])),parseDaily(csv(input)));
  assert.throws(()=>parseDaily(csv([...input,{...input[0],clearedVolume:200}])),/conflicting duplicate/);
  for(const change of [{auctionProduct:'UNKNOWN'},{auctionID:2973}]){
    const bad=rows();Object.assign(bad[0],change);assert.throws(()=>parseDaily(csv(bad)));
  }
  assert.throws(()=>parseDaily(csv([...rows(),...rows('2026-11-08',2973)])),/latest auction day/);
});

test('capacity summaries keep all six directions separate and never sum service maxima',()=>{
  const [point]=parseDaily(body());
  const two=[{...point,v:10,clearedMW:10},{...point,t:'2026-11-06T23:30:00Z',e:'2026-11-07T00:00:00Z',v:-10,clearedMW:30}];
  const [m]=aggregate(two);assert.equal(m.meanClearedMW,20);assert.equal(m.volumeWeightedPrice,-5);assert.equal(m.hours,1);
  const zero=aggregate([{...point,clearedMW:0}])[0];assert.equal(zero.volumeWeightedPrice,null);assert.equal(zero.meanClearedMW,0);
  assert.equal(aggregate(parseDaily(body())).length,6);
});

test('one request and complete-body deadline are explicit; rights blocks read nothing',async()=>{
  let calls=0;
  const connector=createConnector({request:async(url,opts)=>{
    calls++;assert.equal(url,DAILY_URL);assert.equal(opts.retries,1);assert.equal(opts.timeoutMs,20000);assert.ok(opts.signal instanceof AbortSignal);return body();
  }});
  assert.equal((await connector.fetchDataset({dataset:{...dataset,republishable:false},now})).skipped,true);assert.equal(calls,0);
  await connector.fetchDataset({dataset,now});assert.equal(calls,1);
  assert.throws(()=>createConnector({requestTimeoutMs:0}));assert.throws(()=>createConnector({requestTimeoutMs:20001}));
});

test('body interrupted after headers is bounded by the connector signal',async()=>{
  const realFetch=globalThis.fetch;let calls=0;
  globalThis.fetch=async(url,opts)=>{
    calls++;return {ok:true,headers:new Headers(),text:async()=>{await delay(30);opts.signal.throwIfAborted();return body();}};
  };
  try{await assert.rejects(()=>createConnector({requestTimeoutMs:10}).fetchDataset({dataset,now}),/aborted|timeout/i);assert.equal(calls,1);}
  finally{globalThis.fetch=realFetch;}
});

test('only the latest auction is added; missing EFA days stay visible and unfilled',async()=>{
  const first=(await fetchBody(body()).fetchDataset({dataset,now})).snapshot;
  const next=(await fetchBody(body('2026-11-09',2974)).fetchDataset({dataset,previous:first,now:'2026-11-08T16:00:00Z'})).snapshot;
  assert.equal(next.series.length,576);assert.deepEqual(next.derived.coverageAudit.missingDays,['2026-11-08']);
  assert.equal(next.derived.coverageAudit.historicalBackfill,false);
  assert.equal(verifyContentChecksum(next),true);assert.equal(validateSnapshot(next,dataset,first).ok,true);
});

test('revised auctions replace a whole day; stale versions and implausible future files fail',async()=>{
  const first=(await fetchBody(body()).fetchDataset({dataset,now})).snapshot;
  const revised=rows('2026-11-07',2973);revised[0].clearingPrice=7;
  const next=(await fetchBody(csv(revised)).fetchDataset({dataset,previous:first,now})).snapshot;
  assert.equal(next.series.length,288);assert.equal(next.series[0].v,7);assert.ok(next.series.every(p=>p.auctionID===2973));
  await assert.rejects(()=>fetchBody(body()).fetchDataset({dataset,previous:next,now}),/older auction version/);
  await assert.rejects(()=>fetchBody(body('2026-11-06')).fetchDataset({dataset,previous:first,now}),/older than/);
  await assert.rejects(()=>fetchBody(body('2026-11-12')).fetchDataset({dataset,now}),/far ahead/);
});

test('365-day retention removes complete EFA days rather than leaving half a calendar',async()=>{
  const first=(await fetchBody(body('2025-11-07',2000)).fetchDataset({dataset,now:'2025-11-06T16:00:00Z'})).snapshot;
  const next=(await fetchBody(body()).fetchDataset({dataset,previous:first,now:'2026-11-07T12:00:00Z'})).snapshot;
  assert.equal(next.series.length,288);assert.ok(next.series.every(p=>p.auctionDay==='2026-11-07'));
  assert.equal(validateReserveSeries(next.series),true);
});

test('summaries retain units, provenance, observed inputs and stable content without arbitrage',async()=>{
  const connector=fetchBody(body()),a=(await connector.fetchDataset({dataset,now})).snapshot;
  const b=(await connector.fetchDataset({dataset,previous:a,now:'2026-11-06T22:00:00Z'})).snapshot;
  const one=summarize(a),two=summarize(b);
  assert.equal(a.contentChecksum,b.contentChecksum);assert.equal(one.contentChecksum,two.contentChecksum);
  assert.deepEqual(a.units,{price:'GBP/MW/h',power:'MW'});assert.equal(one.latest.length,6);assert.deepEqual(one.daily,[]);assert.equal(one.arbitrage,null);
  assert.equal(one.sourceSnapshot.contentChecksum,a.contentChecksum);assert.equal(verifyContentChecksum(a),true);
  const {summaryChecksum,...envelope}=one;assert.equal(summaryChecksum,sha256(envelope));
  assert.match(one.source.inputSha256,/^[a-f0-9]{64}$/);assert.equal(one.reserve.basis,'auction-clearing');assert.equal(one.derived,null);
});

test('changed response rows and download hashes cannot create reserve-content-only writes',async()=>{
  const input=rows(),response={...input[0],auctionProduct:'DCL',serviceType:'Response'};
  const a=(await fetchBody(csv([...input,response])).fetchDataset({dataset,now})).snapshot;
  const b=(await fetchBody(csv([...input,{...response,clearingPrice:99}])).fetchDataset({dataset,previous:a,now})).snapshot;
  assert.notEqual(a.source.inputSha256,b.source.inputSha256);assert.equal(a.contentChecksum,b.contentChecksum);
  assert.equal(summarize(a).contentChecksum,summarize(b).contentChecksum);
});

test('real executor keeps last-good bytes on 401/403/429, runs other providers, and writes nothing on unchanged content',async()=>{
  const id='test-neso-reserve-'+process.pid,otherId=id+'-other';
  const fake={...dataset,id,connector:'test-reserve'},other={...dataset,id:otherId,connector:'test-other'};
  let fault=null;
  const connectors={
    'test-reserve':{summarize,fetchDataset:async args=>{
      if(fault)throw new FetchError('HTTP '+fault,{status:fault});
      const {snapshot}=await fetchBody(body()).fetchDataset({...args,dataset});
      return {snapshot:buildSnapshot({...snapshot,dataset:fake})};
    }},
    'test-other':{summarize,fetchDataset:async()=>{
      const {snapshot}=await fetchBody(body()).fetchDataset({dataset,now});
      return {snapshot:buildSnapshot({...snapshot,dataset:other})};
    }},
  };
  const files=[snapshotFile(id),summaryFile(id),snapshotFile(otherId),summaryFile(otherId)];
  try{
    let result=await runSelection({datasets:[fake],connectors,now,log:()=>{},dryRun:false});assert.equal(result.results[0].status,'written');
    const before=await Promise.all(files.slice(0,2).map(f=>readFile(REPO_ROOT+'/'+f,'utf8')));
    result=await runSelection({datasets:[fake],connectors,now:'2026-11-06T22:00:00Z',log:()=>{},dryRun:false});assert.equal(result.results[0].status,'unchanged');
    for(const code of [401,403,429]){
      fault=code;result=await runSelection({datasets:[fake,other],connectors,now,log:()=>{},dryRun:false});
      assert.equal(result.results[0].status,'fetch-failed');assert.ok(['written','unchanged'].includes(result.results[1].status));
      assert.deepEqual(await Promise.all(files.slice(0,2).map(f=>readFile(REPO_ROOT+'/'+f,'utf8'))),before);
    }
    fault=null;const candidate=(await connectors['test-reserve'].fetchDataset({now})).snapshot;
    assert.equal((await writeSnapshot(snapshotFile(id),candidate)).written,false);
  }finally{await Promise.all(files.map(f=>rm(REPO_ROOT+'/'+f,{force:true})));}
});

test('source rejection is attempted once and does not consume credentials or fallback URLs',async()=>{
  for(const status of [401,403,429]){
    let calls=0;const connector=createConnector({request:async()=>{calls++;throw new FetchError('HTTP '+status,{status});}});
    await assert.rejects(()=>connector.fetchDataset({dataset,now}),new RegExp(String(status)));assert.equal(calls,1);
  }
});
