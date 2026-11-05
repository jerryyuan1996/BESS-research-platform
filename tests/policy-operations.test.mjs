import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareCycle,publishCycleOnce} from '../policy/cycle.mjs';
import {dailyModelSlot} from '../policy/daily-slot.mjs';
import {evaluateHistoricalCases} from '../policy/evaluation.mjs';
import {independentlyValidate} from '../policy/validation.mjs';
import {fixture,bodies,CONTEXT,attestedContext} from './helpers/policy-fixture.mjs';
import {activationProblems} from '../policy/activation.mjs';
import {candidateEnvelopeProblems} from '../policy/candidate-envelope.mjs';
import {pendingDocuments} from '../policy/recovery.mjs';
import {POLICY_AUTHORIZATION} from '../policy/authorization.mjs';
import {digest} from '../policy/integrity.mjs';
import {publishPolicySnapshot} from '../policy/writer.mjs';
import {mkdtemp,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const market=(changed=true)=>({status:'validated',changed});
const policy=(changed=true)=>({status:'independently_verified',changed});
async function run(m,p,existingMarketValid=true){
  const calls=[];const prepared=prepareCycle({cycle:'2026-11-05',expectedMain:'base',market:m,policy:p,existingMarketValid});
  const result=await publishCycleOnce(prepared,{currentMain:async()=> 'base',commit:async value=>{calls.push(['commit',value.streams]);return 'exact-sha';},push:async sha=>calls.push(['push',sha]),runCI:async sha=>calls.push(['ci',sha])});
  return {result,calls,prepared};
}
test('two changed streams aggregate one commit, push and exact-SHA CI callback',async()=>{
  const {calls,result}=await run(market(),policy());assert.deepEqual(calls,[['commit',{market:true,policy:true}],['push','exact-sha'],['ci','exact-sha']]);assert.equal(result.ciInvocations,1);
});
test('unchanged cycle has no publisher or CI invocation',async()=>{assert.deepEqual((await run(market(false),policy(false))).calls,[]);});
test('either stream failure retains last-known-good and permits the valid stream',async()=>{
  assert.deepEqual((await run(market(),{status:'quarantined',changed:true})).prepared.streams,{market:true,policy:false});
  assert.deepEqual((await run({status:'failed',changed:true},policy())).prepared.streams,{market:false,policy:true});
  assert.equal((await run({status:'failed'},policy(),false)).result.published,false);
});
test('concurrent main update aborts before commit and a failed push never starts CI',async()=>{
  const prepared=prepareCycle({expectedMain:'base',market:market(),policy:policy(),existingMarketValid:true});let writes=0;
  await assert.rejects(publishCycleOnce(prepared,{currentMain:async()=> 'new',commit:async()=>writes++}),/Concurrent/);assert.equal(writes,0);
  await assert.rejects(publishCycleOnce(prepared,{currentMain:async()=> 'base',commit:async()=> 'sha',push:async()=>{throw Error('push failed');},runCI:async()=>writes++}),/push failed/);assert.equal(writes,0);
});
const slot={repository:'owner/repo',runId:123,attempt:1,token:'synthetic-read-token',now:new Date('2026-11-05T07:00:00Z')};
const response=value=>({ok:true,json:async()=>value});
test('daily model audit permits an unused day and ignores the current run',async()=>{
  const value=await dailyModelSlot({...slot,fetcher:async()=>response({workflow_runs:[{id:123}]})});assert.equal(value.allowed,true);
});
test('a prior started model job consumes the day even when its outcome is unknown',async()=>{
  let calls=0;const value=await dailyModelSlot({...slot,fetcher:async()=>++calls===1?response({workflow_runs:[{id:99}]}):response({total_count:1,jobs:[{name:'Policy research, gated shadow',runner_id:7,started_at:'2026-11-05T06:30:00Z',conclusion:null}]})});assert.equal(value.allowed,false);
});
test('rerun, API outage and incomplete audit all deny paid invocation',async()=>{
  assert.equal((await dailyModelSlot({...slot,attempt:2,fetcher:()=>{throw Error('should not fetch');}})).allowed,false);
  assert.equal((await dailyModelSlot({...slot,fetcher:async()=>({ok:false})})).allowed,false);
  assert.equal((await dailyModelSlot({...slot,fetcher:async()=>response({})})).allowed,false);
  let calls=0;assert.equal((await dailyModelSlot({...slot,fetcher:async()=>++calls===1?response({workflow_runs:[{id:99}]}):response({total_count:101,jobs:[]})})).allowed,false);
});
test('synthetic contract cases cannot be reported as empirical historical accuracy',()=>{
  const result=evaluateHistoricalCases([]);assert.equal(result.eligible,false);assert.equal(result.precision,null);
  assert.equal(evaluateHistoricalCases(Array.from({length:12},(_,i)=>({id:String(i),market:['de','gb','nem','wa'][i%4],synthetic:true}))).eligible,false);
});
test('candidate flags cannot grant source, translation or complete-record approval',()=>{
  const snapshot=fixture();const result=independentlyValidate({snapshot,bodies:bodies(),profiles:[],marketIds:CONTEXT.marketIds});assert.equal(result.valid,false);assert.equal(result.context.publicationReviewHash,undefined);assert.ok(result.errors.some(e=>e.includes('complete-record')));
});
test('trusted source semantics and every public record must pass independent review',()=>{
  const snapshot=fixture();const profile={reviewed:true,rightsReviewed:true,host:'official.example',sourceIds:['test-source'],maxQuoteChars:300,validate:()=>({sourceSupported:true,supportedClaimIds:['test-claim']}),translationEquivalent:()=>true,validatePublicRecord:()=>true};
  const result=independentlyValidate({snapshot,bodies:bodies(),profiles:[profile],marketIds:CONTEXT.marketIds});assert.deepEqual(result.errors,[]);assert.equal(result.valid,true);
  const denied=independentlyValidate({snapshot,bodies:bodies(),profiles:[{...profile,validatePublicRecord:()=>false}],marketIds:CONTEXT.marketIds});assert.equal(denied.valid,false);
});

test('manual and workflow activation share fail-closed source/evaluation/cost requirements',()=>{
  const result=activationProblems({config:POLICY_AUTHORIZATION,sources:[],profiles:[],evaluation:{approved:false,cases:[]}});
  assert.ok(result.some(e=>e.includes('activation is OFF')));assert.ok(result.some(e=>e.includes('independently approved')));assert.ok(result.some(e=>e.includes('validators missing')));
});

test('publisher requires exact candidate bytes from the current shadow run and attempt',()=>{
  const snapshot=fixture(),now=new Date('2026-11-05T07:00:00Z');
  const report={status:'shadow_valid',canPublish:false,published:false,candidateHash:digest(snapshot),workflowRunId:'123',workflowAttempt:1,reportedAt:'2026-11-05T06:59:00Z',cycle:'2026-11-05'};
  const verify=patch=>candidateEnvelopeProblems({snapshot,report:{...report,...patch},runId:123,attempt:1,now});
  assert.deepEqual(verify({}),[]);
  for(const patch of [{candidateHash:'0'.repeat(64)},{workflowRunId:'124'},{workflowAttempt:2},{reportedAt:'2026-11-04T06:59:00Z'},{reportedAt:'2026-11-05T08:00:00Z'},{canPublish:true},{status:'unchanged'}])assert.ok(verify(patch).length);
  assert.ok(candidateEnvelopeProblems({snapshot,report,runId:null,attempt:1,now}).length);
});

test('quarantined and expired candidates stay retryable regardless of legacy attempt ledger',()=>{
  const record={id:'source',status:'unchanged',lastKnownGood:{url:'https://official.example/a',contentHash:'new'}};
  const published={sources:[{url:record.lastKnownGood.url,contentHash:'old'}]};
  assert.deepEqual(pendingDocuments([record],published),[record]);
  assert.deepEqual(pendingDocuments([record],null),[record]);
  published.sources.push({url:record.lastKnownGood.url,contentHash:'new'});
  assert.deepEqual(pendingDocuments([record],published),[]);
  published.sources.push({url:record.lastKnownGood.url,contentHash:'later'});
  assert.deepEqual(pendingDocuments([record],published),[record],'a return to an older version requires new review');
  assert.deepEqual(pendingDocuments([{...record,status:'failed'}],published),[]);
});

test('byte-identical verified history survives source outages but changed claims cannot borrow approval',async()=>{
  const repo=await mkdtemp(path.join(os.tmpdir(),'policy-retained-'));
  try{
    const initial=fixture();const first=await publishPolicySnapshot({repo,snapshot:initial,context:attestedContext(initial),bodies:bodies(),enabled:true,expectedParent:null});
    const candidate=structuredClone(initial);candidate.parent=first.head;candidate.id='retained-revision';candidate.createdAt='2026-11-06T06:17:00Z';
    candidate.events.push({...structuredClone(initial.events[0]),id:'retained-correction',kind:'correction',from:'consultation',to:'consultation',corrects:'test-event',verifiedAt:candidate.createdAt,summary:['Synthetic correction with retained evidence','Synthetic correction with retained evidence']});
    const second=await publishPolicySnapshot({repo,snapshot:candidate,context:{...CONTEXT,publicationReviewHash:digest(candidate)},bodies:new Map(),enabled:true,expectedParent:first.head});assert.equal(second.changed,true);
    const changed=structuredClone(candidate);changed.parent=second.head;changed.claims[0].text=['Invented revision','Invented revision'];
    await assert.rejects(publishPolicySnapshot({repo,snapshot:changed,context:{...CONTEXT,publicationReviewHash:digest(changed)},bodies:new Map(),enabled:true,expectedParent:second.head}),/attestation missing|body missing|source body/);
  }finally{await rm(repo,{recursive:true,force:true});}
});
