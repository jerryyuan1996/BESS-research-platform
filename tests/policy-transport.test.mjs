import test from 'node:test';
import assert from 'node:assert/strict';
import {policyTransport} from '../policy/transport.mjs';
import {policyModelRequest} from '../policy/model-contract.mjs';
import {researchShadow} from '../policy/shadow.mjs';
import {modelFixture,bodies,CONTEXT,NOW} from './helpers/policy-fixture.mjs';

test('policy transport fixes its approved endpoint and cannot inherit another agent bearer credential',async()=>{
  const fetch=globalThis.fetch,prior=Object.fromEntries(['ANTHROPIC_BASE_URL','ANTHROPIC_AUTH_TOKEN','ANTHROPIC_CUSTOM_HEADERS'].map(key=>[key,process.env[key]]));
  let calls=0;
  try{
    process.env.ANTHROPIC_BASE_URL='https://unapproved.example';process.env.ANTHROPIC_AUTH_TOKEN='synthetic-unrelated-token';delete process.env.ANTHROPIC_CUSTOM_HEADERS;
    globalThis.fetch=async(input,init)=>{
      calls++;const url=new URL(typeof input==='string'?input:input.url);assert.equal(url.origin,'https://api.anthropic.com');assert.equal(url.pathname,'/v1/messages');
      const headers=new Headers(init.headers);assert.equal(headers.get('x-api-key'),'synthetic-policy-key');assert.equal(headers.has('authorization'),false);
      assert.deepEqual(JSON.parse(init.body),policyModelRequest({system:'Synthetic test',evidence:'Synthetic public fixture',previousPolicy:null,model:'synthetic-model',maxOutputTokens:10}));
      // Inspect actual SDK serialization independently of the shared builder.
      const sent=JSON.parse(init.body),schema=sent.output_config.format.schema;
      assert.equal(sent.output_config.format.type,'json_schema');
      assert.deepEqual(schema.properties.claims.items.properties.text,{type:'array',items:{type:'string'},description:'Locally enforced: minItems: 2, maxItems: 2.'});
      assert.deepEqual(schema.properties.claims.items.properties.evidence.items.anyOf[0].properties.quote,{type:'string',description:'Locally enforced: maxLength: 300.'});
      assert.equal(schema.properties.sources.items.additionalProperties,false);
      assert.ok(schema.properties.claims.items.required.includes('predicate'));
      assert.deepEqual(schema.properties.parent,{$ref:'#/definitions/nullableText'});
      assert.deepEqual(schema.definitions.nullableText,{anyOf:[{type:'string'},{type:'null'}]});
      return new Response(JSON.stringify({id:'test-message',type:'message',role:'assistant',model:'synthetic-model',content:[{type:'text',text:'{}'}],stop_reason:'end_turn',usage:{input_tokens:10,output_tokens:2}}),{status:200,headers:{'content-type':'application/json'}});
    };
    const invoke=policyTransport({key:'synthetic-policy-key',config:{provider:'anthropic',model:'synthetic-model',wallTimeMs:1000}});
    const result=await invoke({system:'Synthetic test',evidence:'Synthetic public fixture',previousPolicy:null,model:'synthetic-model',maxOutputTokens:10,signal:new AbortController().signal});
    assert.equal(result.text,'{}');assert.equal(calls,1);
    process.env.ANTHROPIC_CUSTOM_HEADERS='Authorization: synthetic-unrelated-token';
    assert.throws(()=>policyTransport({key:'synthetic-policy-key',config:{provider:'anthropic',model:'synthetic-model'}}),/shared API headers/);
  }finally{
    globalThis.fetch=fetch;for(const [key,value]of Object.entries(prior))if(value===undefined)delete process.env[key];else process.env[key]=value;
  }
});

test('mocked SDK responses still pass the independent local contract before leaving shadow mode',async()=>{
  const fetch=globalThis.fetch,headers=process.env.ANTHROPIC_CUSTOM_HEADERS;
  const config={enabled:true,publicationEnabled:false,approvalId:'synthetic',provider:'anthropic',model:'synthetic-model',maxSerializedInputBytes:16000,maxInputTokens:12000,maxOutputTokens:3000,maxDailyUSD:0.1,wallTimeMs:1000,validatedGoldCases:12,inputUSDPerMTokens:1,outputUSDPerMTokens:2,priceSource:'https://www.anthropic.com/pricing'};
  let calls=0;
  try{
    delete process.env.ANTHROPIC_CUSTOM_HEADERS;
    for(const [mutate,expected]of [
      [()=>{},'shadow_valid'],
      [s=>s.claims[0].text.pop(),'quarantined'],
      [s=>delete s.claims[0].predicate,'quarantined'],
      [s=>s.claims[0].evidence[0].source='unknown-source','quarantined'],
    ]){
      const candidate=modelFixture();mutate(candidate);
      globalThis.fetch=async(input,init)=>{
        calls++;assert.equal(new URL(typeof input==='string'?input:input.url).href,'https://api.anthropic.com/v1/messages');
        const schema=JSON.parse(init.body).output_config.format.schema;
        assert.equal('minItems' in schema.properties.claims.items.properties.text,false);
        assert.equal('maxLength' in schema.properties.claims.items.properties.evidence.items.anyOf[0].properties.quote,false);
        return new Response(JSON.stringify({id:'synthetic-response',type:'message',role:'assistant',model:'synthetic-model',content:[{type:'text',text:JSON.stringify(candidate)}],stop_reason:'end_turn',usage:{input_tokens:500,output_tokens:200}}),{status:200,headers:{'content-type':'application/json'}});
      };
      const result=await researchShadow({countInputTokens:async()=>500,changedDocuments:[{sourceId:'test-source'}],invoke:policyTransport({key:'synthetic-policy-key',config}),config,ledger:{reservedUSD:0,worstCaseCallUSD:0.018},context:CONTEXT,bodies:bodies(),now:NOW});
      assert.equal(result.status,expected);assert.equal(result.canPublish,false);assert.equal(result.published,false);
    }
    assert.equal(calls,4);
  }finally{
    globalThis.fetch=fetch;if(headers===undefined)delete process.env.ANTHROPIC_CUSTOM_HEADERS;else process.env.ANTHROPIC_CUSTOM_HEADERS=headers;
  }
});

test('dedicated token-count preflight sends the identical model/system/messages/schema without generation',async()=>{
  const fetch=globalThis.fetch,headers=process.env.ANTHROPIC_CUSTOM_HEADERS;
  let calls=0;
  try{
    delete process.env.ANTHROPIC_CUSTOM_HEADERS;
    const input={system:'Synthetic token boundary',evidence:'Synthetic UTF-8 汉',previousPolicy:null,model:'synthetic-model',maxOutputTokens:3000};
    const {max_tokens,...expected}=policyModelRequest(input);
    globalThis.fetch=async(url,init)=>{
      calls++;assert.equal(new URL(typeof url==='string'?url:url.url).href,'https://api.anthropic.com/v1/messages/count_tokens');
      assert.deepEqual(JSON.parse(init.body),expected);assert.equal(new Headers(init.headers).get('x-api-key'),'synthetic-policy-key');
      return new Response(JSON.stringify({input_tokens:12000}),{status:200,headers:{'content-type':'application/json'}});
    };
    const invoke=policyTransport({key:'synthetic-policy-key',config:{provider:'anthropic',model:'synthetic-model',wallTimeMs:1000}});
    assert.equal(await invoke.countInputTokens({...input,signal:new AbortController().signal}),12000);assert.equal(calls,1);
  }finally{globalThis.fetch=fetch;if(headers===undefined)delete process.env.ANTHROPIC_CUSTOM_HEADERS;else process.env.ANTHROPIC_CUSTOM_HEADERS=headers;}
});
