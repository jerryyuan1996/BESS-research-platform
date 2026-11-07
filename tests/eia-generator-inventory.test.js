import test from 'node:test';
import assert from 'node:assert/strict';
import { datasetById,globalDatasets,datasetsBearingOn } from '../src/governance/datasets.js';
import { buildInventorySnapshot,discoverMonthly,discoverAnnual,fetchDataset,summarize,MONTHLY_INDEX,ANNUAL_INDEX } from '../etl/sources/eia-generator-inventory.mjs';
import { validateEiaInventory } from '../src/projects/eiaInventorySchema.js';
import { energyMWh } from '../src/projects/schema.js';
import { validateSnapshot } from '../etl/lib/validate.mjs';
import { verifyContentChecksum,sha256 } from '../etl/lib/envelope.mjs';
import { makeInventoryInputs,MONTHLY_HTML,ANNUAL_HTML } from './helpers/eia-inventory-fixture.mjs';

const dataset=datasetById('us-eia-storage-projects'),now='2026-11-07T04:37:10.165Z';
const inputs=await makeInventoryInputs();
const build=(extra={})=>buildInventorySnapshot({dataset,...inputs,now,...extra});
const previous=await build();
const response=(body,type,status=200)=>new Response(status===304?null:body,{status,headers:{'content-type':type}});
function fakeTransport({monthlyStatus=200,annualStatus=200,fail=null}={}){
  const calls=[];
  const fetchImpl=async(url,opts)=>{
    calls.push({url,opts});if(url===fail)throw new Error('synthetic download failure');
    if(url===MONTHLY_INDEX)return response(MONTHLY_HTML,'text/html');
    if(url===ANNUAL_INDEX)return response(ANNUAL_HTML,'text/html');
    if(url===inputs.monthly.url)return response(inputs.monthlyBytes,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',monthlyStatus);
    if(url===inputs.annual.url)return response(inputs.annualBytes,'application/zip',annualStatus);
    throw new Error('Unexpected request');
  };
  return {calls,fetchImpl};
}
test('source is independently registered and never supplies a financial/global price input',()=>{
  assert.equal(dataset.kind,'projects');assert.equal(dataset.requiresKey,false);assert.equal(dataset.republishable,true);assert.deepEqual(dataset.bearsOn,[]);
  assert.deepEqual(dataset.marketIds,['pjm','ercot','caiso']);assert.ok(!globalDatasets().includes(dataset));assert.ok(!datasetsBearingOn('economics.merchGross').includes(dataset));
});
test('discovery ignores comment/future links and pins the published month and exact official host',()=>{
  assert.equal(discoverMonthly(MONTHLY_HTML,now).period,'2026-09');assert.equal(discoverAnnual(ANNUAL_HTML,now).reportingYear,2025);
  assert.throws(()=>discoverMonthly(MONTHLY_HTML.replace('October 23, 2026','December 23, 2027'),now),/future publication/);
  assert.throws(()=>discoverMonthly('<a href="https://elsewhere.test/september_generator2026.xlsx">X</a>',now),/publication date/);
  assert.throws(()=>discoverMonthly(MONTHLY_HTML.replaceAll('xls/','https://elsewhere.test/'),now),/no released/);
});
test('real parser path produces current monthly energy and separate annual discharge evidence',()=>{
  assert.deepEqual(validateEiaInventory(previous),[]);assert.equal(validateSnapshot(previous,dataset).ok,true);assert.equal(verifyContentChecksum(previous),true);
  assert.equal(previous.series.length,6);
  const p=previous.series.find(p=>p.id==='pjm-eia-1-01');
  assert.equal(p.capacityMW,100);assert.equal(p.durationHours,null);assert.equal(energyMWh(p),320);
  assert.equal(p.storageEvidence.maximumDischargeMW,80);assert.equal(p.storageEvidence.durationHours,4);
  assert.notEqual(p.capacityMW*p.storageEvidence.durationHours,energyMWh(p),'monthly nameplate is not the annual discharge denominator');
  assert.equal(p.inventoryPeriod,'2026-09');assert.equal(p.storageEvidence.reportingYear,2025);
  assert.equal(previous.derived.inventory.markets.pjm.annualPowerDiffersFromMonthly,1);
});
test('construction units retain missing MWh, explicit monthly coordinates and no invented duration',()=>{
  const p=previous.series.find(p=>p.stage==='under_construction');
  assert.equal(p.energyObservation,null);assert.equal(energyMWh(p),null);assert.equal(p.durationHours,null);assert.equal(p.storageEvidence.energyMWh,null);
  assert.equal(p.coordinateEvidence.basis,'monthly-reported');assert.equal(p.storageEvidence.reason,'annual-key-absent');
});
test('summary is deterministic and has no price/arbitrage output',()=>{
  const s=summarize(previous);assert.deepEqual(s,summarize(previous));assert.equal(s.derived,null);assert.equal(s.arbitrage,null);assert.deepEqual(s.daily,[]);
  assert.equal(s.freshnessAt,'2026-10-23');assert.equal(s.inventory.markets.caiso.units,2);assert.match(s.source.notice,/2026-09.*2026-10-23.*2025/);
});
for(const [name,options,pattern] of [['missing planned sheet',{missingPlanned:true},/sheet.*not found/],['renamed compound ID',{missingGenerator:true},/generator_id/],['monthly unit change',{monthlyUnits:'kW'},/MW header/],['annual unit change',{annualUnits:'kW'},/MW header/],['wrong workbook month',{wrongTitle:true},/title\/period/]]){
  test(name+' fails closed',async()=>{const changed=await makeInventoryInputs(options);await assert.rejects(()=>build({...changed}),pattern);});
}
test('input hashes cannot claim provenance for different bytes',async()=>{
  await assert.rejects(()=>build({monthly:{...inputs.monthly,sha256:'0'.repeat(64)}}),/hash\/size/);
});
test('routine cached cycle checks only release indices and preserves exact accepted bytes/timestamps',async()=>{
  const f=fakeTransport();const result=await fetchDataset({dataset,previous,now,fetchImpl:f.fetchImpl});
  assert.strictEqual(result.snapshot,previous);assert.equal(f.calls.length,2);assert.equal(result.snapshot.fetchedAt,now);
});
test('weekly conditional monthly verification accepts 304 without an annual ZIP',async()=>{
  const f=fakeTransport({monthlyStatus:304});const result=await fetchDataset({dataset,previous,now:'2026-11-09T06:17:00Z',fetchImpl:f.fetchImpl});
  assert.strictEqual(result.snapshot,previous);assert.equal(f.calls.length,3);assert.equal(f.calls[2].opts.headers['If-None-Match'],inputs.monthly.etag);
});
test('monthly conditional annual verification accepts 304 without rereading monthly bytes',async()=>{
  const f=fakeTransport({annualStatus:304});const result=await fetchDataset({dataset,previous,now:'2026-12-01T06:17:00Z',fetchImpl:f.fetchImpl});
  assert.strictEqual(result.snapshot,previous);assert.equal(f.calls.length,3);assert.equal(f.calls[2].url,inputs.annual.url);
});
test('an explicit dry verification reads both actual workbooks but never refreshes unchanged timestamps',async()=>{
  const f=fakeTransport();const result=await fetchDataset({dataset,previous,now:'2026-11-08T06:17:00Z',fetchImpl:f.fetchImpl,dryRun:true});
  assert.strictEqual(result.snapshot,previous);assert.equal(f.calls.length,4);assert.ok(!f.calls[2].opts.headers['If-None-Match']);
});
test('failed provider leaves the caller last-good object intact and never retries a refusal',async()=>{
  for(const status of [401,403,429]){
    const f=fakeTransport({monthlyStatus:status});const before=sha256(previous);
    await assert.rejects(()=>fetchDataset({dataset,previous,now,fetchImpl:f.fetchImpl,dryRun:true}),new RegExp('HTTP '+status));
    assert.equal(f.calls.filter(c=>c.url===inputs.monthly.url).length,1);assert.equal(sha256(previous),before);assert.equal(f.calls.filter(c=>c.url===inputs.annual.url).length,0);
  }
});
test('malformed and empty project candidates are rejected without touching price schema',()=>{
  for(const series of [[],[null],[{}]]){const bad={...previous,series};assert.equal(validateSnapshot(bad,dataset).ok,false);}
  const bad=structuredClone(previous);bad.series[0].storageEvidence.durationHours=999;assert.ok(validateEiaInventory(bad).some(e=>e.includes('duration identity')));
});
test('same accepted release is not rewritten by the builder at a later clock',async()=>{
  const result=await build({previous,now:'2026-11-08T06:17:00Z'});assert.strictEqual(result,previous);assert.equal(result.derived.inventory.revisions.length,1);
});
test('a same-month revision preserves the old record and records actual field differences',async()=>{
  const revised=await makeInventoryInputs({powerShift:1});
  const result=await build({...revised,previous,now:'2026-11-08T06:17:00Z'});
  assert.equal(previous.series.find(p=>p.id==='pjm-eia-1-01').capacityMW,100);
  assert.equal(result.series.find(p=>p.id==='pjm-eia-1-01').capacityMW,101);
  assert.equal(result.derived.inventory.revisions.length,2);
  assert.deepEqual(result.derived.inventory.revisions[0],previous.derived.inventory.revisions[0]);
  assert.deepEqual(result.derived.inventory.revisions[1].changes.changed,[{id:'pjm-eia-1-01',fields:['capacityMW']}]);
  assert.equal(result.derived.inventory.revisions[1].period,'2026-09');
});
test('a new report month retains old revision metadata without widening any price window',async()=>{
  const next=await makeInventoryInputs({period:'2026-10',publishedAt:'2026-11-24'});
  const result=await build({...next,previous,now:'2026-11-25T06:17:00Z'});
  assert.equal(result.coverage.from,'2026-10-01');assert.equal(result.coverage.to,'2026-10-31');
  assert.deepEqual(result.derived.inventory.revisions.map(r=>r.period),['2026-09','2026-10']);
  assert.ok(result.series.every(p=>p.inventoryPeriod==='2026-10'));
});
test('a generator removed from a later inventory is recorded, not kept in the current fleet',async()=>{
  const next=await makeInventoryInputs({omitOperatingId:'1'});
  const result=await build({...next,previous,now:'2026-11-08T06:17:00Z'});
  assert.equal(result.series.length,5);assert.ok(!result.series.some(p=>p.id==='pjm-eia-1-01'));
  assert.deepEqual(result.derived.inventory.revisions.at(-1).changes.removed,['pjm-eia-1-01']);
});
test('zero-padded numeric generator cells retain their official display identity',async()=>{
  const numeric=await makeInventoryInputs({numericGenerator:true});const result=await build({...numeric});
  const p=result.series.find(p=>p.id==='pjm-eia-1-01');assert.ok(p);assert.equal(p.sourceRef.generatorId,'01');assert.equal(p.storageEvidence.energyMWh,320);
});
