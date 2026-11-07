import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,rm,writeFile,readFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {verifyPolicyStore} from '../policy/verify-store.mjs';
import {POLICY_AUTHORIZATION} from '../policy/authorization.mjs';
import {TRUSTED_POLICY_PROFILES,APPROVED_HISTORICAL_EVALUATION} from '../policy/validation-profiles.mjs';
import {publishPolicySnapshot} from '../policy/writer.mjs';
import {digest} from '../policy/integrity.mjs';
import {fixture,bodies,CONTEXT,attestedContext} from './helpers/policy-fixture.mjs';
const options={config:POLICY_AUTHORIZATION,profiles:TRUSTED_POLICY_PROFILES,evaluation:APPROVED_HISTORICAL_EVALUATION};
test('actual public policy store passes only as unpublished while approval gates are OFF',async()=>{
  assert.deepEqual(await verifyPolicyStore({repo:fileURLToPath(new URL('..',import.meta.url)),...options}),{versions:0,status:'unpublished'});
});
test('unapproved and orphan policy JSON cannot enter a release even without a public index',async()=>{
  const repo=await mkdtemp(path.join(os.tmpdir(),'policy-store-gate-'));try{
    const target=path.join(repo,'public/data/public/policy/snapshots');await mkdir(target,{recursive:true});await writeFile(path.join(target,'draft.json'),'{}');
    await assert.rejects(verifyPolicyStore({repo,...options}),/publication is OFF/);
  }finally{await rm(repo,{recursive:true,force:true});}
});

// Synthetic authority-boundary tests; these are not an approved real corpus.
async function manualFixture(){
  const repo=await mkdtemp(path.join(os.tmpdir(),'policy-manual-store-')),snapshot=fixture();
  const first=await publishPolicySnapshot({repo,snapshot,context:attestedContext(snapshot),bodies:bodies(),enabled:true,expectedParent:null});
  const cases=Array.from({length:12},(_,i)=>({id:`synthetic-${i}`,market:['de','gb','nem','wa'][i%4],synthetic:false,originalSourceVerified:true,reviewedBy:'synthetic-test-reviewer',sourceLocator:'section 1',sourceURL:snapshot.sources[0].url,sourceHash:snapshot.sources[0].contentHash,expectedReview:false,actualReview:false,criticalAssertions:1,unsupportedAssertions:0}));
  return {repo,snapshot,first,options:{repo,config:POLICY_AUTHORIZATION,marketIds:CONTEXT.marketIds,manualPublication:{enabled:true,approvalId:'synthetic-manual-decision',approvedHeads:[first.head]},evaluation:{approved:true,method:'deterministic_source_regression',model:null,cases},profiles:[{host:'official.example',sourceIds:['test-source'],maxQuoteChars:300,reviewed:true,rightsReviewed:true,verifyStoredSnapshot:()=>true}]}};
}
async function cleanManual(repo){assert.equal(path.dirname(repo),path.resolve(os.tmpdir()));await rm(repo,{recursive:true,force:true});}

test('exact manual snapshot approval is independent of model activation but preserves source and historical gates',async()=>{
  const {repo,options}=await manualFixture();try{
    assert.equal(options.config.enabled,false);
    assert.equal((await verifyPolicyStore(options)).authorization,'exact_manual_snapshots');
    await assert.rejects(verifyPolicyStore({...options,manualPublication:{...options.manualPublication,approvedHeads:['0'.repeat(64)]}}),/exact manual release approval/);
    await assert.rejects(verifyPolicyStore({...options,evaluation:{approved:true,cases:[]}}),/Fewer than 12|No actual critical/);
    await assert.rejects(verifyPolicyStore({...options,profiles:[{...options.profiles[0],rightsReviewed:false}]}),/offline source validators/);
    await assert.rejects(verifyPolicyStore({...options,profiles:[{...options.profiles[0],maxQuoteChars:1}]}),/quotation rights/);
  }finally{await cleanManual(repo);}
});
test('manual approval cannot authorize a forged investment-review sidecar outside the snapshot',async()=>{
  const {repo,options}=await manualFixture();try{
    const file=path.join(repo,'public/data/public/policy/index.json'),index=JSON.parse(await readFile(file,'utf8'));
    const original=JSON.stringify(index);
    index.pendingReviews=[{id:'forged-review',market:'gb',instrument:'test-instrument',claim:'test-claim'}];await writeFile(file,JSON.stringify(index));
    await assert.rejects(verifyPolicyStore(options),/index does not match/);
    const extra=JSON.parse(original);extra.notes='Unapproved private draft';await writeFile(file,JSON.stringify(extra));await assert.rejects(verifyPolicyStore(options),/Invalid policy version index/);
    delete extra.notes;extra.verification.notes='Unapproved private draft';await writeFile(file,JSON.stringify(extra));await assert.rejects(verifyPolicyStore(options),/unapproved proof fields/);
    delete extra.verification.notes;extra.verification.sources['test-source'].maxQuoteChars=999;await writeFile(file,JSON.stringify(extra));await assert.rejects(verifyPolicyStore(options),/exceeds independent approval/);
  }finally{await cleanManual(repo);}
});
test('manual approvals cannot omit ancestors or permit rewritten historical events',async()=>{
  const {repo,snapshot,first,options}=await manualFixture();try{
    const next=structuredClone(snapshot);next.id='synthetic-later';next.parent=first.head;next.createdAt='2026-11-06T06:17:00Z';next.events[0].summary=['Silently changed history','静默修改历史'];
    const hash=digest(next),directory=path.join(repo,'public/data/public/policy');
    await writeFile(path.join(directory,'snapshots',hash+'.json'),JSON.stringify(next));
    const index=JSON.parse(await readFile(path.join(directory,'index.json'),'utf8'));index.head=hash;index.versions.push(hash);index.publishedAt=next.createdAt;await writeFile(path.join(directory,'index.json'),JSON.stringify(index));
    await assert.rejects(verifyPolicyStore({...options,manualPublication:{...options.manualPublication,approvedHeads:[hash]}}),/exact manual release approval/);
    await assert.rejects(verifyPolicyStore({...options,manualPublication:{...options.manualPublication,approvedHeads:[first.head,hash]}}),/immutable event history/);
  }finally{await cleanManual(repo);}
});
