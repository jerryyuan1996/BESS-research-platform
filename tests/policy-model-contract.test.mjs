import test from 'node:test';
import assert from 'node:assert/strict';
import {POLICY_OUTPUT_SCHEMA,POLICY_PROVIDER_OUTPUT_SCHEMA,policyModelRequest,policyModelOutputProblems} from '../policy/model-contract.mjs';
import {researchShadow,POLICY_SYSTEM} from '../policy/shadow.mjs';
import {sourceDigest,digest} from '../policy/integrity.mjs';
import {priorPolicySummary} from '../policy/merge.mjs';
import {POLICY_AUTHORIZATION} from '../policy/authorization.mjs';
import {MANUAL_EVALUATION_AUTHORIZATION} from '../policy/manual-authorization.mjs';
import {modelFixture,bodies,BODY,CONTEXT,NOW} from './helpers/policy-fixture.mjs';

const config={enabled:true,publicationEnabled:false,approvalId:'synthetic',provider:'anthropic',model:'synthetic-model',maxInputTokens:12000,maxOutputTokens:3000,maxDailyUSD:0.1,wallTimeMs:1000,validatedGoldCases:12,inputUSDPerMTokens:1,outputUSDPerMTokens:2,priceSource:'https://www.anthropic.com/pricing'};
const run=(candidate,body=BODY)=>researchShadow({changedDocuments:[{sourceId:'test-source'}],invoke:async()=>({text:JSON.stringify(candidate),inputTokens:500,outputTokens:200}),config,ledger:{reservedUSD:0,worstCaseCallUSD:0.018},context:CONTEXT,bodies:new Map([['test-source',body]]),now:NOW});
function visit(schema,callback){
  callback(schema);
  for(const child of Object.values(schema.properties||{}))visit(child,callback);
  if(schema.items)visit(schema.items,callback);
  for(const child of schema.anyOf||[])visit(child,callback);
  for(const child of Object.values(schema.definitions||{}))visit(child,callback);
}

test('wire schema retains record fields and supported constraints without mutating the strict local contract',()=>{
  const wire=POLICY_PROVIDER_OUTPUT_SCHEMA;
  const supported=new Set(['type','enum','anyOf','properties','required','additionalProperties','items','description','definitions','$ref']);
  let unions=0,optional=0;
  visit(wire,node=>{
    for(const keyword of Object.keys(node))assert.ok(supported.has(keyword),keyword);
    assert.equal('minItems' in node||'maxItems' in node||'maxLength' in node,false);
    if(node.anyOf)unions++;
    if(node.$ref)assert.equal(node.$ref,'#/definitions/nullableText');
    if(node.type==='object'){
      assert.equal(node.additionalProperties,false);
      optional+=Object.keys(node.properties).filter(key=>!node.required.includes(key)).length;
    }
  });
  assert.equal(unions,5);assert.ok(optional<=24);
  for(const collection of ['sources','instruments','events','claims','impacts','stories','links','reviews']){
    assert.deepEqual(wire.properties[collection].items.required,POLICY_OUTPUT_SCHEMA.properties[collection].items.required);
    assert.deepEqual(Object.keys(wire.properties[collection].items.properties),Object.keys(POLICY_OUTPUT_SCHEMA.properties[collection].items.properties));
  }
  const localPair=POLICY_OUTPUT_SCHEMA.properties.claims.items.properties.text;
  assert.equal(localPair.minItems,2);assert.equal(localPair.maxItems,2);
  assert.equal(POLICY_OUTPUT_SCHEMA.properties.claims.items.properties.evidence.items.anyOf[0].properties.quote.maxLength,300);
  assert.match(wire.properties.claims.items.properties.text.description,/minItems: 2, maxItems: 2/);
  assert.equal(policyModelRequest({system:'Synthetic',evidence:'Synthetic',previousPolicy:null,model:'synthetic',maxOutputTokens:10}).output_config.format.schema,wire);
});

test('a complete synthetic model response passes strict local structure and remains shadow only',async()=>{
  assert.deepEqual(policyModelOutputProblems(modelFixture()),[]);
  const result=await run(modelFixture());assert.equal(result.status,'shadow_valid');assert.equal(result.canPublish,false);assert.equal(result.published,false);
});

for(const [name,mutate]of [
  ['one language',s=>s.claims[0].text.pop()],
  ['three languages',s=>s.instruments[0].title.push('Synthetic extra')],
  ['empty language',s=>s.events[0].summary[1]=''],
  ['missing required nullable field',s=>delete s.claims[0].predicate],
  ['missing required collection',s=>delete s.reviews],
  ['unknown property',s=>s.claims[0].unexpected='synthetic'],
  ['unsupported enum',s=>s.sources[0].authority='unverified'],
  ['unresolved source',s=>s.claims[0].evidence[0].source='unknown-source'],
  ['unsupported evidence reference',s=>s.claims[0].evidence[0].supports='number'],
  ['missing locator',s=>delete s.sources[0].locator],
])test(`independent local rejection after mocked response: ${name}`,async()=>{
  const candidate=modelFixture();mutate(candidate);const result=await run(candidate);
  assert.equal(result.status,'quarantined');assert.equal(result.canPublish,false);assert.equal(result.published,false);
});

test('local quote boundary is exactly 300 even when the original contains the longer quote',async()=>{
  for(const length of [300,301]){
    const candidate=modelFixture(),quote='consultation'+'.'.repeat(length-'consultation'.length),body=BODY+quote;
    candidate.claims[0].evidence[0].quote=quote;candidate.sources[0].contentHash=sourceDigest(body);
    const result=await run(candidate,body);
    assert.equal(result.status,length===300?'shadow_valid':'quarantined');assert.equal(result.canPublish,false);
  }
});

test('facts-only originals cannot reach even an injected mock transport',async()=>{
  const candidate=modelFixture();candidate.sources[0].rights.reproduction='facts_only';let calls=0;
  const result=await researchShadow({changedDocuments:[{sourceId:'test-source',source:candidate.sources[0],excerpt:BODY}],invoke:async()=>{calls++;},config,ledger:{reservedUSD:0,worstCaseCallUSD:0.018},context:CONTEXT,bodies:new Map([['test-source',BODY]]),now:NOW});
  assert.equal(result.status,'disabled');assert.equal(calls,0);
});

function priorWithEighteenInstruments(){
  const prior=modelFixture(),instrument=prior.instruments[0],event=prior.events[0],claim=prior.claims[0];
  prior.instruments=[];prior.events=[];prior.claims=[];
  for(let i=0;i<18;i++){
    const suffix=String(i).padStart(2,'0'),instrumentId='synthetic-prior-instrument-'+suffix,claimId='synthetic-prior-claim-'+suffix;
    prior.instruments.push({...structuredClone(instrument),id:instrumentId,officialId:'SYNTHETIC-REFERENCE-'+suffix});
    prior.claims.push({...structuredClone(claim),id:claimId,instrument:instrumentId});
    prior.events.push({...structuredClone(event),id:'synthetic-prior-event-'+suffix,instrument:instrumentId,claimIds:[claimId]});
  }
  return prior;
}

test('16,000 input ceiling admits a bounded synthetic prior/evidence request without enabling model operation',async()=>{
  assert.equal(POLICY_AUTHORIZATION.maxInputTokens,16000);assert.equal(MANUAL_EVALUATION_AUTHORIZATION.maxInputTokens,16000);
  assert.equal(POLICY_AUTHORIZATION.enabled,false);assert.equal(MANUAL_EVALUATION_AUTHORIZATION.enabled,false);
  assert.equal(POLICY_AUTHORIZATION.maxOutputTokens,3000);assert.equal(POLICY_AUTHORIZATION.wallTimeMs,120000);assert.equal(POLICY_AUTHORIZATION.maxDailyUSD,null);
  const before=priorWithEighteenInstruments(),source=before.sources[0],changedDocuments=[{sourceId:source.id,source,excerpt:BODY}];
  const evidence=JSON.stringify([{sourceId:source.id,source,evidence:BODY}]);
  const request=policyModelRequest({system:POLICY_SYSTEM,evidence,previousPolicy:priorPolicySummary(before),model:config.model,maxOutputTokens:config.maxOutputTokens});
  const bytes=Buffer.byteLength(JSON.stringify(request),'utf8')+1024;assert.ok(bytes>12000&&bytes<=16000,`Synthetic request bound ${bytes}`);
  const delta={schemaVersion:1,id:'synthetic-delta',createdAt:NOW,parent:digest(before),sources:[],instruments:[],events:[],claims:[],impacts:[],stories:[],links:[],reviews:[]};
  let calls=0;const args={before,changedDocuments,invoke:async()=>{calls++;return {text:JSON.stringify(delta),inputTokens:500,outputTokens:200};},ledger:{reservedUSD:0,worstCaseCallUSD:0.022},context:CONTEXT,bodies:bodies(),now:NOW};
  assert.equal((await researchShadow({...args,config})).status,'input_cap');assert.equal(calls,0);
  const result=await researchShadow({...args,config:{...config,maxInputTokens:16000}});
  assert.equal(result.status,'shadow_valid');assert.equal(calls,1);assert.equal(result.canPublish,false);assert.equal(result.published,false);
});

test('raising input capacity preserves pre-call cost and reservation refusals',async()=>{
  let calls=0;const args={changedDocuments:[{sourceId:'test-source'}],invoke:async()=>{calls++;},config:{...config,maxInputTokens:16000},context:CONTEXT,bodies:bodies(),now:NOW};
  assert.equal((await researchShadow({...args,ledger:{reservedUSD:0,worstCaseCallUSD:0.018}})).status,'cost_cap');
  assert.equal((await researchShadow({...args,config:{...args.config,maxDailyUSD:0.02},ledger:{reservedUSD:0,worstCaseCallUSD:0.022}})).status,'cost_cap');
  assert.equal(calls,0);
});
