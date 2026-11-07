import test from 'node:test';
import assert from 'node:assert/strict';
import {datasetById} from '../src/governance/datasets.js';
import {technologyClass,combine,monthly,efaMonth,validateServiceSeries,fetchDataset,summarize,queries} from '../etl/sources/neso-response.mjs';
import {buildSnapshot,verifyContentChecksum} from '../etl/lib/envelope.mjs';
import {sha256} from '../etl/lib/envelope.mjs';
import {readFileSync} from 'node:fs';
import {validateSnapshot} from '../etl/lib/validate.mjs';
import {RECORDS,HISTORY,GAPS} from '../src/markets/gb/story/evidence.js';

const dataset=datasetById('gb-eac-response');
const p=(t,v,mw,extra={})=>({t,e:new Date(Date.parse(t)+14400000).toISOString(),service:'DRH',v,clearedMW:mw,batteryMW:mw,otherMW:0,origin:'eac-current',...extra});

test('both NESO registrations are licensed context and carry no financial drift authority',()=>{
  for(const id of ['gb-dynamic-response','gb-eac-response']){
    const d=datasetById(id);assert.equal(d.connector,'neso-response');assert.deepEqual(d.bearsOn,[]);
    assert.equal(d.republishable,true);assert.equal(d.requiresKey,false);
    assert.equal(d.source.attribution,'Supported by National Energy SO Open Data');
  }
  assert.equal(dataset.refreshHours,24);
});

test('CALC-GB-TECH recognises only battery labels and preserves NA/blank/other',()=>{
  for(const label of ['Battery','Batteries','BATTERY',' batteries '])assert.equal(technologyClass(label),'battery');
  for(const label of ['NA','',null,'Other','Thermal','Load Response','battery-like'])assert.equal(technologyClass(label),'other-or-unlabelled');
});

test('technology categories reconcile to cleared MW and never claim unidentified MW as batteries',()=>{
  const t='2026-04-01T02:00:00',e='2026-04-01T06:00:00';
  const [row]=combine([{t,e,service:'DRH',price:-9,mw:100}],['Battery','NA',''].map((technology,i)=>({t,service:'DRH',technology,mw:[80,15,5][i]})),'eac-current');
  assert.equal(row.batteryMW,80);assert.equal(row.otherMW,20);assert.equal(row.v,-9);
  const missing=combine([{t,e,service:'DRH',price:-9,mw:100}],[{t,service:'DRH',technology:'Batteries',mw:60}],'eac-current')[0];
  assert.equal(missing.batteryMW,null);assert.equal(missing.otherMW,null);
});

test('monthly availability prices are volume-weighted and MW is an average, never maxima summed',()=>{
  const rows=[p('2026-04-01T02:00:00Z',10,10),p('2026-04-01T06:00:00Z',-10,30)];
  const [m]=monthly(rows);assert.equal(m.price,-5);assert.equal(m.clearedMW,20);assert.equal(m.batteryMW,20);assert.equal(m.blocks,2);
  const [empty]=monthly([p('2026-04-01T02:00:00Z',0,0)]);assert.equal(empty.price,null);assert.equal(empty.clearedMW,0);
});

test('pre-EFA accepted-bid prices keep their method and do not blend with clearing-price observations',()=>{
  const m=monthly([p('2021-09-01T22:00:00Z',17,100,{origin:'master'}),p('2021-09-16T02:00:00Z',5,200,{origin:'dynamic'})]);
  assert.equal(m.length,2);assert.deepEqual(new Set(m.map(r=>r.basis)),new Set(['accepted-bid','clearing']));
  assert.equal(m.find(r=>r.basis==='accepted-bid').blocks,6);
});

test('monthly bucketing uses the London EFA day across BST and the year boundary',()=>{
  assert.equal(efaMonth('2026-03-31T22:00:00Z'),'2026-04');
  assert.equal(efaMonth('2026-12-31T23:00:00Z'),'2027-01');
  const q=queries('888e5029-f786-41d2-bc15-cbfd1d285e96','ddc4afde-d2bd-424d-891c-56ad49c13d1a',true);
  assert.match(q.summary,/AT TIME ZONE 'Europe\/London' AT TIME ZONE 'UTC'/);
  assert.doesNotMatch(q.units,/"Company"|"Unit Name"|"Location"/);
});

test('duplicate blocks, inconsistent technologies and invalid quantities fail the response gate',()=>{
  const row=p('2026-04-01T02:00:00Z',-9,100);
  assert.equal(validateServiceSeries([row]),true);
  assert.throws(()=>validateServiceSeries([row,row]),/duplicate/);
  assert.throws(()=>validateServiceSeries([{...row,batteryMW:120}]),/reconcile/);
  assert.throws(()=>validateServiceSeries([{...row,clearedMW:-1}]),/Invalid/);
});

test('auction summaries retain negative prices, provenance and no spread/arbitrage metric',()=>{
  const series=[p('2026-04-01T02:00:00Z',-9,100)];
  const make=fetchedAt=>buildSnapshot({dataset,series,coverage:{from:series[0].t,to:series[0].e,points:1},units:{price:'GBP/MW/h',power:'MW'},derived:{resources:[],missingTechnologyBlocks:0},fetchedAt});
  const a=make('2026-04-02T00:00:00Z'),b=make('2026-04-02T06:00:00Z');
  assert.equal(verifyContentChecksum(a),true);assert.equal(validateSnapshot(a,dataset).ok,true);
  const s=summarize(a);assert.equal(s.monthly[0].price,-9);assert.deepEqual(s.daily,[]);assert.equal(s.arbitrage,null);
  assert.equal(s.contentChecksum,summarize(b).contentChecksum,'timestamp-only six-hour runs produce no data commit');
  assert.equal(s.sourceSnapshot.contentChecksum,a.contentChecksum);
  const {summaryChecksum,...body}=s;assert.equal(summaryChecksum,sha256(body));
});

test('registered observations cover all approved archives, reconcile technologies and reproduce the monthly chart',()=>{
  for(const id of ['gb-dynamic-response','gb-eac-response']){
    const data=JSON.parse(readFileSync(new URL('../public/data/public/'+id+'.json',import.meta.url),'utf8'));
    const {summaryChecksum,...summary}=JSON.parse(readFileSync(new URL('../public/data/public/'+id+'.summary.json',import.meta.url),'utf8'));
    assert.equal(summaryChecksum,sha256(summary));assert.equal(summary.sourceSnapshot.contentChecksum,data.contentChecksum);
    assert.equal(verifyContentChecksum(data),true);assert.equal(validateServiceSeries(data.series),true);
    assert.deepEqual(data.derived.monthly,monthly(data.series));
    assert.equal(data.derived.missingTechnologyBlocks,0);
    for(const r of data.derived.resources)assert.ok(r.summaryResource&&r.summaryLocator);
    for(const row of data.series)assert.deepEqual(Object.keys(row).sort(),['t','e','service','v','clearedMW','batteryMW','otherMW','origin'].sort());
    if(id==='gb-eac-response')for(const y of ['2023','2024','2025'])assert.ok(data.derived.resources.some(r=>r.origin==='eac-fy'+y));
    else {
      const first=data.series.find(p=>p.origin==='dynamic').t;
      assert.ok(data.series.filter(p=>p.origin==='master').every(p=>p.e<=first));
      assert.ok(data.series.every(p=>p.t>='2020-01-01'&&p.t<'2024-01-01'));
    }
  }
});

test('rights blocks and an existing fixed vintage skip before any network request',async()=>{
  const request=()=>{throw new Error('network must not run');};
  assert.equal((await fetchDataset({dataset:{...dataset,republishable:false},request})).skipped,true);
  assert.equal((await fetchDataset({dataset:datasetById('gb-dynamic-response'),previous:{},request})).skipped,true);
});

test('manual values each carry a primary locator, vintage and units; unresolved EFR figures stay absent',()=>{
  for(const value of Object.values(RECORDS))for(const field of ['value','sourceId','url','locator','units','authority','checkedOn','vintage'])assert.notEqual(value[field],undefined,field);
  assert.equal(GAPS.efr.value,null);assert.deepEqual(HISTORY.find(h=>h.id==='H-GB-03').records,[]);
  assert.equal(RECORDS.feeConsultation.authority,'official-proposal');assert.equal(GAPS.feeDecision.value,null);
  assert.equal(RECORDS.queueMW.value,83000);assert.equal(RECORDS.cpBatteryRange.authority,'official-plan');
});
