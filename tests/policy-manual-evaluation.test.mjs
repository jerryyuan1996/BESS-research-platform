import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluationCorpusProblems,runManualShadowCase} from '../policy/manual-evaluation.mjs';
import {fixture,modelFixture,BODY,CONTEXT,NOW} from './helpers/policy-fixture.mjs';
const source=fixture().sources[0];
const cases=Array.from({length:12},(_,i)=>({id:`case-${i}`,market:['de','gb','nem','wa'][i%4],reviewer:'independent-reviewer',sourceReviewed:true,rightsReviewed:true,translationReviewed:true,expectedReview:false,source,locator:'section 1',body:BODY,originalByteHash:source.contentHash,mediaType:'text/html'}));
test('manual corpus requires twelve reviewed cases across four markets and byte-matching sources',()=>{
  assert.deepEqual(evaluationCorpusProblems(cases),[]);
  assert.ok(evaluationCorpusProblems(cases.slice(1)).length);
  assert.ok(evaluationCorpusProblems(cases.map(c=>({...c,market:'gb'}))).length);
  assert.ok(evaluationCorpusProblems(cases.map(c=>({...c,rightsReviewed:false}))).length);
  assert.ok(evaluationCorpusProblems(cases.map(c=>({...c,body:'tampered'}))).length);
  assert.ok(evaluationCorpusProblems(cases.map(c=>({...c,mediaType:'application/pdf'}))).length);
  assert.ok(evaluationCorpusProblems(cases.map(c=>({...c,originalByteHash:'sha256:fake'}))).length);
});
test('mock transport sees no labels and independent semantic rejection quarantines output',async()=>{
  const config={enabled:true,approvalId:'synthetic',provider:'anthropic',model:'test',maxSerializedInputBytes:16000,maxInputTokens:12000,maxOutputTokens:3000,maxDailyUSD:0.1,wallTimeMs:1000,inputUSDPerMTokens:1,outputUSDPerMTokens:2,priceSource:'https://www.anthropic.com/pricing'};
  let seen;const invoke=async input=>{seen=JSON.stringify(input);return {text:JSON.stringify(modelFixture()),inputTokens:500,outputTokens:200};};
  const args={countInputTokens:async()=>500,cases,caseId:'case-0',config,ledger:{reservedUSD:0,worstCaseCallUSD:0.018,completed:false},context:CONTEXT,now:NOW,invoke,scanEvidence:async()=>true,independentCheck:async()=>false};
  const result=await runManualShadowCase(args);assert.equal(result.status,'quarantined');assert.equal(result.canPublish,false);assert.doesNotMatch(seen,/expectedReview|independent-reviewer/);
  const accepted=await runManualShadowCase({countInputTokens:async()=>500,...args,independentCheck:async()=>true});assert.equal(accepted.status,'evaluated');assert.equal(accepted.canPublish,false);
});
test('missing corpus or authorization cannot invoke a model or publish',async()=>{
  let calls=0;const invoke=async()=>{calls++;};
  const missing=await runManualShadowCase({countInputTokens:async()=>500,cases:[],caseId:'case-0',invoke});assert.equal(missing.status,'disabled');
  const disabled=await runManualShadowCase({countInputTokens:async()=>500,cases,caseId:'case-0',config:{},ledger:{},context:{},invoke});assert.equal(disabled.status,'disabled');assert.equal(disabled.canPublish,false);assert.equal(calls,0);
});
test('manual evaluation preserves source-use fields and blocks protected originals before transport',async()=>{
 const restricted=structuredClone(cases);for(const c of restricted)c.source.rights.reproduction='facts_only';
 const config={enabled:true,approvalId:'synthetic',provider:'anthropic',model:'test',maxSerializedInputBytes:16000,maxInputTokens:12000,maxOutputTokens:3000,maxDailyUSD:0.1,wallTimeMs:1000,inputUSDPerMTokens:1,outputUSDPerMTokens:2,priceSource:'https://www.anthropic.com/pricing'};
 let calls=0;const result=await runManualShadowCase({countInputTokens:async()=>500,cases:restricted,caseId:'case-0',config,ledger:{reservedUSD:0,worstCaseCallUSD:0.018,completed:false},context:CONTEXT,now:NOW,invoke:async()=>{calls++;},scanEvidence:async()=>true,independentCheck:async()=>true});
 assert.equal(result.status,'disabled');assert.equal(calls,0);
});
