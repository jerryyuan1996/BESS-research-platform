import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,symlink,mkdir} from 'node:fs/promises';
import os from 'node:os';import path from 'node:path';
import {reserveManualCall} from '../policy/manual-reservation.mjs';
import {runReservedManualCase} from '../scripts/policy/manual-evaluation-runner.mjs';
import {fixture,BODY} from './helpers/policy-fixture.mjs';
const config={maxDailyUSD:0.03,maxInputTokens:12000,maxOutputTokens:3000,wallTimeMs:120000,inputUSDPerMTokens:1,outputUSDPerMTokens:5};
test('reservation survives uncertain outcome, rejects replay and serializes concurrent calls',async()=>{
 const repo=await mkdtemp(path.join(os.tmpdir(),'evaluation-reservation-'));try{
  const now=new Date('2026-11-05T07:00:00Z');const attempts=await Promise.allSettled(['a','b'].map(caseId=>reserveManualCall({repo,caseId,config,now})));
  assert.equal(attempts.filter(x=>x.status==='fulfilled').length,1);const winner=attempts.findIndex(x=>x.status==='fulfilled')===0?'a':'b';
  await assert.rejects(reserveManualCall({repo,caseId:'c',config,now}),/limit/);
  await assert.rejects(reserveManualCall({repo,caseId:winner,config,now:new Date('2026-11-06T07:00:00Z')}),/already reserved/);
  assert.ok(await reserveManualCall({repo,caseId:'c',config,now:new Date('2026-11-06T07:00:00Z')}));
 }finally{await rm(repo,{recursive:true,force:true});}
});
test('unapproved corpus never reserves or invokes a model',async()=>{
 const repo=await mkdtemp(path.join(os.tmpdir(),'evaluation-disabled-'));let calls=0;try{
  const result=await runReservedManualCase({repo,cases:[],caseId:'a',config:{},profiles:[],invoke:async()=>calls++});assert.equal(result.status,'disabled');assert.equal(calls,0);
 }finally{await rm(repo,{recursive:true,force:true});}
});
test('twelve reserved cases exhaust the bounded evaluation and excess per-call cost is refused',async()=>{
 const repo=await mkdtemp(path.join(os.tmpdir(),'evaluation-limit-'));try{
  await assert.rejects(reserveManualCall({repo,caseId:'over',config:{...config,maxDailyUSD:0.02},now:new Date('2026-11-01T07:00:00Z')}),/budget/);
  for(let i=1;i<=12;i++)await reserveManualCall({repo,caseId:`case-${i}`,config,now:new Date(`2026-11-${String(i).padStart(2,'0')}T07:00:00Z`)});
  await assert.rejects(reserveManualCall({repo,caseId:'case-13',config,now:new Date('2026-11-13T07:00:00Z')}),/limit/);
 }finally{await rm(repo,{recursive:true,force:true});}
});
test('wired runner checks original guard and independent semantics using a fake transport',async()=>{
 const repo=await mkdtemp(path.join(os.tmpdir(),'evaluation-wired-'));const source=fixture().sources[0];
 const cases=Array.from({length:12},(_,i)=>({id:`case-${i}`,market:['de','gb','nem','wa'][i%4],reviewer:'test-reviewer',sourceReviewed:true,rightsReviewed:true,translationReviewed:true,expectedReview:false,source,locator:'section 1',body:BODY}));
 const profiles=[{reviewed:true,rightsReviewed:true,host:'official.example',sourceIds:['test-source'],maxQuoteChars:300,validate:()=>({sourceSupported:true,supportedClaimIds:['test-claim']}),translationEquivalent:()=>true,validatePublicRecord:()=>true}];
 const cfg={...config,enabled:true,manualEvaluationApproved:true,approvalId:'synthetic',provider:'anthropic',model:'test',inputUSDPerMTokens:1,outputUSDPerMTokens:2,priceSource:'https://www.anthropic.com/pricing'};let calls=0;
 try{const result=await runReservedManualCase({repo,cases,caseId:'case-0',config:cfg,profiles,now:new Date('2026-11-05T07:00:00Z'),invoke:async()=>{calls++;return {text:JSON.stringify(fixture()),inputTokens:500,outputTokens:200};}});assert.equal(result.status,'evaluated');assert.equal(result.canPublish,false);assert.equal(calls,1);await assert.rejects(runReservedManualCase({repo,cases,caseId:'case-0',config:cfg,profiles,now:new Date('2026-11-05T07:00:00Z'),invoke:async()=>calls++}),/limit/);assert.equal(calls,1);
 }finally{await rm(repo,{recursive:true,force:true});}
});
