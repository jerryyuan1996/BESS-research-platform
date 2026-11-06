import test from 'node:test';
import assert from 'node:assert/strict';
import {policyTransport} from '../policy/transport.mjs';
import {policyModelRequest} from '../policy/model-contract.mjs';

test('policy transport fixes its approved endpoint and cannot inherit another agent bearer credential',async()=>{
  const fetch=globalThis.fetch,prior=Object.fromEntries(['ANTHROPIC_BASE_URL','ANTHROPIC_AUTH_TOKEN','ANTHROPIC_CUSTOM_HEADERS'].map(key=>[key,process.env[key]]));
  let calls=0;
  try{
    process.env.ANTHROPIC_BASE_URL='https://unapproved.example';process.env.ANTHROPIC_AUTH_TOKEN='synthetic-unrelated-token';delete process.env.ANTHROPIC_CUSTOM_HEADERS;
    globalThis.fetch=async(input,init)=>{
      calls++;const url=new URL(typeof input==='string'?input:input.url);assert.equal(url.origin,'https://api.anthropic.com');assert.equal(url.pathname,'/v1/messages');
      const headers=new Headers(init.headers);assert.equal(headers.get('x-api-key'),'synthetic-policy-key');assert.equal(headers.has('authorization'),false);
      assert.deepEqual(JSON.parse(init.body),policyModelRequest({system:'Synthetic test',evidence:'Synthetic public fixture',previousPolicy:null,model:'synthetic-model',maxOutputTokens:10}));
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
