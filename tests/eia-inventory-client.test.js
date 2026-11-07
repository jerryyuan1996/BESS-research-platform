import test,{beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {datasetById} from '../src/governance/datasets.js';
import {buildInventorySnapshot} from '../etl/sources/eia-generator-inventory.mjs';
import {loadEiaInventory,verifyEiaInventory,__resetEiaInventoryClient} from '../src/projects/eiaInventoryClient.js';
import {__resetRegistry,projectsFor,registerProjects,sourcesFor} from '../src/projects/registry.js';
import {inventoryCoverage} from '../src/projects/eiaInventorySchema.js';
import {setLiveDataEnabled} from '../src/live/client.js';
import {freshnessOf as classifyFreshness} from '../src/live/freshness.js';
import {makeInventoryInputs} from './helpers/eia-inventory-fixture.mjs';

const dataset=datasetById('us-eia-storage-projects'),now='2026-11-07T04:37:10.165Z';
const inputs=await makeInventoryInputs(),snapshot=await buildInventorySnapshot({dataset,...inputs,now});
const good=()=>new Response(JSON.stringify(snapshot),{headers:{'content-type':'application/json'}});
beforeEach(()=>{__resetEiaInventoryClient();__resetRegistry();setLiveDataEnabled(true);});
test('concurrent map requests share one validated download and register all three markets',async()=>{
  let calls=0;const fetchImpl=async()=>{calls++;return good();};
  const a=loadEiaInventory({fetchImpl}),b=loadEiaInventory({fetchImpl});assert.strictEqual(a,b);
  const loaded=await a;assert.equal(calls,1);assert.equal(loaded.series.length,6);
  for(const market of ['pjm','ercot','caiso']){assert.equal(projectsFor(market).length,2);assert.equal(sourcesFor(market).length,1);}
});
test('valid-looking numeric changes cannot bypass the committed content/envelope checksums',async()=>{
  const changed=structuredClone(snapshot);changed.series[0].capacityMW+=1;changed.derived.inventory.markets=inventoryCoverage(changed.series);
  await assert.rejects(()=>verifyEiaInventory(changed),/checksum/);
});
test('a failed first read can be retried; a later failure retains the prior accepted registry',async()=>{
  await assert.rejects(()=>loadEiaInventory({fetchImpl:async()=>new Response(null,{status:404})}),/unavailable/);
  const accepted=await loadEiaInventory({fetchImpl:async()=>good()});
  await assert.rejects(()=>loadEiaInventory({force:true,fetchImpl:async()=>new Response(null,{status:503})}),/unavailable/);
  const retained=await loadEiaInventory({fetchImpl:()=>{throw new Error('must use last-good cache');}});
  assert.strictEqual(retained,accepted);assert.equal(projectsFor('pjm').length,2);
});
test('a source revision removes obsolete IDs, keeps unrelated sources and avoids duplicate attribution',async()=>{
  await loadEiaInventory({fetchImpl:async()=>good()});
  registerProjects('pjm',{projects:[{id:'pjm-independent',name:'Synthetic independent',capacityMW:5,stage:'operating',durationHours:null,sourceIds:['synthetic-other']}],dataset:'Synthetic independent source'});
  const input=await makeInventoryInputs({omitOperatingId:'1'});
  const revised=await buildInventorySnapshot({dataset,...input,now:'2026-11-08T06:17:00Z',previous:snapshot});
  await loadEiaInventory({force:true,fetchImpl:async()=>new Response(JSON.stringify(revised),{headers:{'content-type':'application/json'}})});
  assert.deepEqual(projectsFor('pjm').map(p=>p.id),['pjm-eia-4-p1','pjm-independent']);assert.equal(sourcesFor('pjm').length,2);
});
test('disabled live reads cannot be bypassed by the inventory retry path',async()=>{
  setLiveDataEnabled(false);let calls=0;
  assert.equal(await loadEiaInventory({force:true,fetchImpl:async()=>{calls++;return good();}}),null);assert.equal(calls,0);
});
test('the browser reader bounds the complete body and releases a rejected response',async()=>{
  let cancelled=false;const body=new ReadableStream({start(c){c.enqueue(new TextEncoder().encode('{'));},cancel(){cancelled=true;}});
  await assert.rejects(()=>loadEiaInventory({timeoutMs:15,fetchImpl:async()=>new Response(body,{headers:{'content-type':'application/json'}})}),/deadline/);assert.equal(cancelled,true);
  await assert.rejects(()=>loadEiaInventory({fetchImpl:async()=>new Response('{}',{headers:{'content-type':'application/json','content-length':String(12*1024*1024+1)}})}),/size limit/);
});
test('freshness ages from the source publication while preserving the actual acquisition timestamp',async()=>{
  const {summarize}=await import('../etl/sources/eia-generator-inventory.mjs');const summary=summarize(snapshot);
  const freshness=classifyFreshness(summary,Date.parse(now));assert.ok(freshness.ageHours>14*24);assert.equal(freshness.fetchedAt,now);
  assert.equal(summary.inventory.sources.monthly.period,'2026-09');
});
