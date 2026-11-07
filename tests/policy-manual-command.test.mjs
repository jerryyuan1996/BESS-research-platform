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
const config={enabled:true,manualEvaluationApproved:true,approvalId:'synthetic-approval',approvedCorpusHash:sourceDigest(raw),provider:'anthropic',model:'synthetic-model',maxInputTokens:12000,maxOutputTokens:3000,wallTimeMs:1000,maxDailyUSD:0.03,inputUSDPerMTokens:1,outputUSDPerMTokens:2,priceSource:'https://www.anthropic.com/pricing'};
const profiles=[{reviewed:true,rightsReviewed:true,host:'official.example',sourceIds:['test-source'],maxQuoteChars:300,validate:()=>({sourceSupported:true,supportedClaimIds:['test-claim']}),translationEquivalent:()=>true,validatePublicRecord:()=>true}];
async function corpusRepo(){const repo=await mkdtemp(path.join(os.tmpdir(),'policy-manual-command-'));await mkdir(path.join(repo,'etl/out/policy-review'),{recursive:true});await writeFile(path.join(repo,'etl/out/policy-review/approved-corpus.json'),raw);return repo;}
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
test('manual command scans and reserves one fake request then appends content-free durable outcome',async()=>{
  const repo=await corpusRepo();let requests=0;try{
    const args={repo,caseId:'case-0',config,profiles,now:new Date('2026-11-05T07:00:00Z'),makeInvoke:()=>async()=>{requests++;return {text:JSON.stringify(modelFixture()),inputTokens:500,outputTokens:200};}};
    const result=await executeManualEvaluation(args);assert.equal(result.status,'evaluated');assert.equal(result.canPublish,false);assert.equal(requests,1);
    const audit=await readFile(path.join(repo,'etl/out/policy-evaluation-ledger/2026-11-05.result.json'),'utf8');
    const row=JSON.parse(audit);assert.equal(row.providerRequests,1);assert.equal(row.usage.inputTokens,500);assert.equal(row.matched,true);assert.equal(row.sourceHash,source.contentHash);assert.doesNotMatch(audit,/Synthetic test record|synthetic-independent-reviewer/);
    assert.equal(row.originalSourceHash,source.contentHash);assert.equal(row.authorization.model,'synthetic-model');assert.equal(row.authorization.corpusHash,config.approvedCorpusHash);assert.match(row.authorization.settingsHash,/^[a-f0-9]{64}$/);
    await assert.rejects(executeManualEvaluation(args),/limit/);assert.equal(requests,1);
  }finally{await cleanup(repo);}
});
