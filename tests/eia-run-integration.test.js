import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { runSelection } from '../etl/run.mjs';
import { datasetById,snapshotFile,summaryFile } from '../src/governance/datasets.js';
import { createHash } from 'node:crypto';
import { summarize } from '../etl/sources/eia-generator-inventory.mjs';

const inventory=datasetById('us-eia-storage-projects'),fx=datasetById('fx-ecb');
const files=[snapshotFile(inventory.id),summaryFile(inventory.id),snapshotFile(fx.id),summaryFile(fx.id)];
const fingerprint=()=>Promise.all(files.map(async file=>({file,hash:createHash('sha256').update(await readFile(file)).digest('hex'),mtime:(await stat(file)).mtimeMs})));
const accepted=JSON.parse(await readFile(snapshotFile(inventory.id),'utf8'));
const fxAccepted=JSON.parse(await readFile(snapshotFile(fx.id),'utf8'));
const fxSummary=JSON.parse(await readFile(summaryFile(fx.id),'utf8'));

for(const failure of ['refused','invalid'])test(`EIA ${failure} retains accepted files while an independent source completes`,async()=>{
  const before=await fingerprint();let fxRan=false;
  const connectors={
    [inventory.connector]:{fetchDataset:async()=>{
      if(failure==='refused')throw new Error('HTTP 429');
      return {snapshot:{...accepted,series:[]}};
    },summarize},
    [fx.connector]:{fetchDataset:async()=>{fxRan=true;return {snapshot:fxAccepted};},summarize:()=>fxSummary},
  };
  const {results}=await runSelection({datasets:[inventory,fx],connectors,dryRun:false,env:{},log:()=>{}});
  assert.equal(results[0].status,failure==='refused'?'fetch-failed':'invalid');
  assert.deepEqual(results[0].snapshot,accepted);
  assert.equal(fxRan,true);assert.equal(results[1].status,'unchanged');
  assert.deepEqual(await fingerprint(),before,'last-good series/summary and independent unchanged source retain their bytes and mtimes');
});

test('the real runner forwards dry verification and keeps the project summary out of price derivation',async()=>{
  const before=await fingerprint();let forwarded=false;
  const {results}=await runSelection({datasets:[inventory],connectors:{[inventory.connector]:{
    fetchDataset:async context=>{forwarded=context.dryRun;return {snapshot:accepted};},summarize,
  }},dryRun:true,env:{},log:()=>{}});
  assert.equal(forwarded,true);assert.equal(results[0].status,'dry-run');
  assert.deepEqual(results[0].summary,summarize(accepted));
  assert.equal(results[0].summary.derived,null);assert.equal(results[0].summary.arbitrage,null);
  assert.deepEqual(await fingerprint(),before);
});
