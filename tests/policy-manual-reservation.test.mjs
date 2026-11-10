import {manualRequest} from './helpers/policy-manual-request.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,symlink,mkdir} from 'node:fs/promises';
import os from 'node:os';import path from 'node:path';
import {reserveManualCall} from '../policy/manual-reservation.mjs';
import {runReservedManualCase} from '../scripts/policy/manual-evaluation-runner.mjs';
import {fixture,modelFixture,BODY} from './helpers/policy-fixture.mjs';
const config={approvedCorpusHash:'sha256:'+ 'a'.repeat(64),maxDailyUSD:0.03,maxSerializedInputBytes:16000,maxInputTokens:12000,maxOutputTokens:3000,wallTimeMs:120000,inputUSDPerMTokens:1,outputUSDPerMTokens:5};
const request=caseId=>({id:'request-'+caseId,caseId,corpusHash:config.approvedCorpusHash,caseHash:'a'.repeat(64),inputHash:'b'.repeat(64),versionHash:'c'.repeat(64),settingsHash:'d'.repeat(64)});
test('reservation survives uncertain outcome, rejects replay and serializes concurrent calls',async()=>{
 const repo=await mkdtemp(path.join(os.tmpdir(),'evaluation-reservation-'));try{
  const now=new Date('2026-11-05T07:00:00Z');const attempts=await Promise.allSettled(['a','b'].map(caseId=>reserveManualCall({repo,caseId,config,now,request:request(caseId)})));
  assert.equal(attempts.filter(x=>x.status==='fulfilled').length,1);const winner=attempts.findIndex(x=>x.status==='fulfilled')===0?'a':'b';
  await assert.rejects(reserveManualCall({repo,caseId:'c',config,now,request:request('c')}),/limit/);
  await assert.rejects(reserveManualCall({repo,caseId:winner,config,request:request(winner),now:new Date('2026-11-06T07:00:00Z')}),/already reserved/);
  assert.ok(await reserveManualCall({repo,caseId:'c',config,request:request('c'),now:new Date('2026-11-06T07:00:00Z')}));
 }finally{await rm(repo,{recursive:true,force:true});}
});
test('unapproved corpus never reserves or invokes a model',async()=>{
 const repo=await mkdtemp(path.join(os.tmpdir(),'evaluation-disabled-'));let calls=0;try{
  const result=await runReservedManualCase({repo,cases:[],caseId:'a',config:{},profiles:[],invoke:async()=>calls++});assert.equal(result.status,'disabled');assert.equal(calls,0);
 }finally{await rm(repo,{recursive:true,force:true});}
});
test('twelve reserved cases exhaust the bounded evaluation and excess per-call cost is refused',async()=>{
 const repo=await mkdtemp(path.join(os.tmpdir(),'evaluation-limit-'));try{
  await assert.rejects(reserveManualCall({repo,caseId:'over',request:request('over'),config:{...config,maxDailyUSD:0.02},now:new Date('2026-11-01T07:00:00Z')}),/budget/);
  for(let i=1;i<=12;i++)await reserveManualCall({repo,caseId:`case-${i}`,request:request(`case-${i}`),config,now:new Date(`2026-11-${String(i).padStart(2,'0')}T07:00:00Z`)});
  await assert.rejects(reserveManualCall({repo,caseId:'case-13',request:request('case-13'),config,now:new Date('2026-11-13T07:00:00Z')}),/limit/);
 }finally{await rm(repo,{recursive:true,force:true});}
});
test('wired runner checks original guard and independent semantics using a fake transport',async()=>{
 const repo=await mkdtemp(path.join(os.tmpdir(),'evaluation-wired-'));const source=fixture().sources[0];
 const cases=Array.from({length:12},(_,i)=>({id:`case-${i}`,market:['de','gb','nem','wa'][i%4],reviewer:'test-reviewer',sourceReviewed:true,rightsReviewed:true,translationReviewed:true,expectedReview:false,source,locator:'section 1',body:BODY,originalByteHash:source.contentHash,mediaType:'text/html'}));
 const profiles=[{reviewed:true,rightsReviewed:true,host:'official.example',sourceIds:['test-source'],maxQuoteChars:300,validate:()=>({sourceSupported:true,supportedClaimIds:['test-claim']}),translationEquivalent:()=>true,validatePublicRecord:()=>true}];
 const cfg={...config,manualOnly:true,enabled:true,manualEvaluationApproved:true,approvalId:'synthetic',provider:'anthropic',model:'test',inputUSDPerMTokens:1,outputUSDPerMTokens:2,priceSource:'https://www.anthropic.com/pricing'};let calls=0;
 const bound=await manualRequest({cases,caseId:'case-0',config:cfg});
 try{const result=await runReservedManualCase({repo,cases,caseId:'case-0',request:bound,requestId:bound.id,config:cfg,profiles,now:new Date('2026-11-05T07:00:00Z'),invoke:Object.assign(async()=>{calls++;return {text:JSON.stringify(modelFixture()),inputTokens:500,outputTokens:200};},{countInputTokens:async()=>500})});assert.equal(result.status,'evaluated');assert.equal(result.canPublish,false);assert.equal(calls,1);await assert.rejects(runReservedManualCase({repo,cases,caseId:'case-0',request:bound,requestId:bound.id,config:cfg,profiles,now:new Date('2026-11-05T07:00:00Z'),invoke:async()=>calls++}),/limit/);assert.equal(calls,1);
 }finally{await rm(repo,{recursive:true,force:true});}
});
test('request identity cannot replay for a different case on a later day',async()=>{
 const repo=await mkdtemp(path.join(os.tmpdir(),'evaluation-request-replay-'));
 try{
  const first=request('first');await reserveManualCall({repo,caseId:'first',request:first,config,now:new Date('2026-11-05')});
  await assert.rejects(reserveManualCall({repo,caseId:'second',request:{...request('second'),id:first.id},config,now:new Date('2026-11-06')}),/request already reserved/);
 }finally{await rm(repo,{recursive:true,force:true});}
});
test('byte admission cannot enlarge token, per-call, daily or aggregate cost ceilings',async()=>{
 const repo=await mkdtemp(path.join(os.tmpdir(),'evaluation-budget-dimensions-'));
 try{
  for(const change of [{maxSerializedInputBytes:16001},{maxInputTokens:16000},{maxOutputTokens:3001},{maxDailyUSD:0.031},{inputUSDPerMTokens:100},{wallTimeMs:120001}])
   await assert.rejects(reserveManualCall({repo,caseId:'test',request:request('test'),config:{...config,...change},now:new Date('2026-11-05')}),/budget/);
 }finally{await rm(repo,{recursive:true,force:true});}
});
