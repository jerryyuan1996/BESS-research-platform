import {policyModelRequest} from '../policy/model-contract.mjs';
import {manualRequest} from './helpers/policy-manual-request.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import path from 'node:path';import os from 'node:os';
import {executeManualEvaluation} from '../scripts/policy/manual-command.mjs';
import {sourceDigest} from '../policy/integrity.mjs';
import {fixture,modelFixture,BODY} from './helpers/policy-fixture.mjs';
const source=fixture().sources[0];
const cases=Array.from({length:12},(_,i)=>({id:`case-${i}`,market:['de','gb','nem','wa'][i%4],reviewer:'synthetic-independent-reviewer',sourceReviewed:true,rightsReviewed:true,translationReviewed:true,expectedReview:false,source,locator:'section 1',body:BODY,originalByteHash:source.contentHash,mediaType:'text/html'}));
const raw=JSON.stringify({schemaVersion:1,cases});
const config={manualOnly:true,enabled:true,manualEvaluationApproved:true,approvalId:'synthetic-approval',approvedCorpusHash:sourceDigest(raw),provider:'anthropic',model:'synthetic-model',maxSerializedInputBytes:16000,maxInputTokens:12000,maxOutputTokens:3000,wallTimeMs:1000,maxDailyUSD:0.03,inputUSDPerMTokens:1,outputUSDPerMTokens:2,priceSource:'https://www.anthropic.com/pricing'};
const profiles=[{reviewed:true,rightsReviewed:true,host:'official.example',sourceIds:['test-source'],maxQuoteChars:300,validate:()=>({sourceSupported:true,supportedClaimIds:['test-claim']}),translationEquivalent:()=>true,validatePublicRecord:()=>true}];
async function corpusRepo(){const repo=await mkdtemp(path.join(os.tmpdir(),'policy-manual-command-'));await mkdir(path.join(repo,'etl/out/policy-review'),{recursive:true});await writeFile(path.join(repo,'etl/out/policy-review/approved-corpus.json'),raw);await writeFile(path.join(repo,'etl/out/policy-review/manual-request.json'),JSON.stringify(await manualRequest({cases,caseId:'case-0',config})));return repo;}
async function cleanup(repo){assert.equal(path.dirname(repo),path.resolve(os.tmpdir()));await rm(repo,{recursive:true,force:true});}

test('manual command refuses OFF, unpinned, unreviewed and changed corpora before constructing transport',async()=>{
  let factories=0;const makeInvoke=()=>{factories++;return async()=>{};};
  const repo=await corpusRepo();try{
    assert.equal((await executeManualEvaluation({repo,caseId:'case-0',config:{},profiles,makeInvoke})).status,'disabled');
    assert.equal((await executeManualEvaluation({repo,caseId:'../escape',config,profiles,makeInvoke})).status,'disabled');
    assert.equal((await executeManualEvaluation({repo,caseId:'case-0',config,profiles:[{...profiles[0],validatePublicRecord:null}],makeInvoke})).status,'disabled');
    await writeFile(path.join(repo,'etl/out/policy-review/approved-corpus.json'),raw+' ');
    await assert.rejects(executeManualEvaluation({repo,caseId:'case-0',config,profiles,makeInvoke}),/checksum/);
    assert.equal(factories,0);
  }finally{await cleanup(repo);}
});
test('full manual chain separates >12,000 UTF-8 bytes from 12,000 provider tokens and audits one mock call',async()=>{
  const repo=await corpusRepo();let requests=0;
  const body=BODY+'汉'.repeat(700),expandedCases=structuredClone(cases),expandedSource={...source,contentHash:sourceDigest(body)};
  for(const c of expandedCases){c.body=body;c.source=expandedSource;c.originalByteHash=expandedSource.contentHash;}
  const expandedRaw=JSON.stringify({schemaVersion:1,cases:expandedCases});
  const cfg={...config,approvedCorpusHash:sourceDigest(expandedRaw),outputUSDPerMTokens:5};
  const candidate=modelFixture();candidate.sources[0].contentHash=expandedSource.contentHash;
  try{
    await writeFile(path.join(repo,'etl/out/policy-review/approved-corpus.json'),expandedRaw);
    await writeFile(path.join(repo,'etl/out/policy-review/manual-request.json'),JSON.stringify(await manualRequest({cases:expandedCases,caseId:'case-0',config:cfg})));
    const args={repo,caseId:'case-0',requestId:'synthetic-request',config:cfg,profiles,now:new Date('2026-11-05T07:00:00Z'),makeInvoke:()=>Object.assign(async input=>{
      requests++;const bytes=Buffer.byteLength(JSON.stringify(policyModelRequest(input)),'utf8')+1024;
      assert.ok(bytes>12000&&bytes<=16000,`serialized admission: ${bytes}`);
      assert.doesNotMatch(JSON.stringify(input),/expectedReview|synthetic-independent-reviewer/);
      return {text:JSON.stringify(candidate),inputTokens:12000,outputTokens:200};
    },{countInputTokens:async()=>12000})};
    const result=await executeManualEvaluation(args);assert.equal(result.status,'evaluated');assert.equal(result.canPublish,false);assert.equal(requests,1);
    const audit=await readFile(path.join(repo,'etl/out/policy-evaluation-ledger/2026-11-05.result.json'),'utf8');
    const row=JSON.parse(audit);assert.equal(row.providerRequests,1);assert.equal(row.usage.inputTokens,12000);assert.equal(row.usage.reservedUSD,0.027);assert.equal(row.matched,true);assert.equal(row.sourceHash,expandedSource.contentHash);assert.doesNotMatch(audit,/Synthetic test record|synthetic-independent-reviewer/);
    assert.equal(row.tokenCountRequests,1);assert.equal(row.preflightInputTokens,12000);assert.equal(row.requestId,'synthetic-request');assert.match(row.binding.inputHash,/^[a-f0-9]{64}$/);assert.match(row.binding.versionHash,/^[a-f0-9]{64}$/);
    assert.equal(row.originalSourceHash,expandedSource.contentHash);assert.equal(row.authorization.model,'synthetic-model');assert.equal(row.authorization.corpusHash,cfg.approvedCorpusHash);assert.match(row.authorization.settingsHash,/^[a-f0-9]{64}$/);
    await assert.rejects(executeManualEvaluation(args),/limit/);assert.equal(requests,1);
  }finally{await cleanup(repo);}
});

for(const [name,change]of [
  ['missing request',r=>null],
  ['not explicit',r=>({...r,explicitRequest:false})],
  ['wrong request identity',r=>({...r,id:'other-request'})],
  ['different case',r=>({...r,caseId:'case-1'})],
  ['different corpus',r=>({...r,corpusHash:'sha256:'+'0'.repeat(64)})],
  ['different input',r=>({...r,inputHash:'0'.repeat(64)})],
  ['different version',r=>({...r,versionHash:'0'.repeat(64)})],
  ['different settings',r=>({...r,settingsHash:'0'.repeat(64)})],
  ['expired request',r=>({...r,expiresAt:'2026-11-05T06:59:59Z'})],
  ['future request',r=>({...r,requestedAt:'2026-11-05T08:00:00Z'})],
  ['indefinite authorization',r=>({...r,expiresAt:'2026-11-07T08:00:00Z'})],
])test(`manual command refuses ${name} before credential construction or reservation`,async()=>{
  const repo=await corpusRepo();let factories=0;
  try{
    const record=change(await manualRequest({cases,caseId:'case-0',config}));
    await writeFile(path.join(repo,'etl/out/policy-review/manual-request.json'),JSON.stringify(record));
    const result=await executeManualEvaluation({repo,caseId:'case-0',requestId:'synthetic-request',config,profiles,now:new Date('2026-11-05T07:00:00Z'),makeInvoke:()=>{factories++;throw Error('must not construct');}});
    assert.equal(result.status,'disabled');assert.equal(result.providerRequests,0);assert.equal(factories,0);
    await assert.rejects(readFile(path.join(repo,'etl/out/policy-evaluation-ledger/2026-11-05.json')),/ENOENT/);
  }finally{await cleanup(repo);}
});

test('manual command requires the explicit CLI request identity even with an otherwise matching private record',async()=>{
 const repo=await corpusRepo();let factories=0;
 try{
  const result=await executeManualEvaluation({repo,caseId:'case-0',config,profiles,now:new Date('2026-11-05T07:00:00Z'),makeInvoke:()=>{factories++;}});
  assert.equal(result.status,'disabled');assert.equal(result.providerRequests,0);assert.equal(factories,0);
 }finally{await cleanup(repo);}
});
