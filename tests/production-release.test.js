import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publishProduction, waitForLiveStamp } from '../scripts/lib/production-release.mjs';
const setup = () => {
  const calls=[];
  return { calls, args:{candidate:'new',readMain:async()=>'new',
    readProject:async()=>({ssoProtection:{deploymentType:'all'},targets:{production:{id:'rollback'}}}),
    scan:async()=>{calls.push('scan');return 'hash';}, upload:async()=>{calls.push('upload');return 'url';},
    verifyCandidate:async()=>{calls.push('verified');},promote:async()=>{calls.push('promote');},record:async()=>{calls.push('record');} } };
};
test('B6: a deliberately delayed older test cannot replace a newer publication',async()=>{
  const {args,calls}=setup();
  await publishProduction(args);
  const late=await publishProduction({...args,candidate:'old'});
  assert.equal(late.published,false);
  assert.equal(calls.filter(x=>x==='promote').length,1);
});
test('B6: a data commit arriving during upload withholds the stale candidate',async()=>{
  const {args,calls}=setup();let n=0;
  const result=await publishProduction({...args,readMain:async()=>n++?'data-commit':'new'});
  assert.equal(result.published,false);
  assert.ok(!calls.includes('promote'));
});
test('failed deployment identity or readiness blocks promotion',async()=>{
  const {args,calls}=setup();
  await assert.rejects(publishProduction({...args,verifyCandidate:async()=>{throw new Error('wrong commit');}}),/wrong commit/);
  assert.ok(!calls.includes('promote'));
});
test('the owner can retain Standard Protection without changing hosting settings',async()=>{
  const {args}=setup();
  const result=await publishProduction({...args,readProject:async()=>({ssoProtection:{deploymentType:'prod_deployment_urls_and_all_previews'},targets:{production:{id:'rollback'}}})});
  assert.equal(result.published,true);
});
test('a missing rollback target blocks upload',async()=>{
  const {args,calls}=setup();
  await assert.rejects(publishProduction({...args,readProject:async()=>({ssoProtection:{deploymentType:'all'}})}),/rollback/);
  assert.deepEqual(calls,[]);
});
test('the release lock never cancels a newer run; all pending jobs remain queued',()=>{
  const workflow=readFileSync(new URL('../.github/workflows/ci.yml',import.meta.url),'utf8');
  assert.match(workflow,/group: vercel-production\s+cancel-in-progress: false\s+queue: max/);
  assert.match(workflow,/RELEASE_SHA: \$\{\{ inputs.ref \|\| github.sha \}\}/);
});
test('a manual release verification refreshes data without running the analyst agent',()=>{
  const workflow=readFileSync(new URL('../.github/workflows/etl.yml',import.meta.url),'utf8');
  assert.match(workflow,/verify_release:[\s\S]*?type: boolean/);
  const agent=workflow.slice(workflow.indexOf('\n  agent:'));
  assert.match(agent,/inputs\.verify_release != true/);
});
test('the live stamp is polled until the promoted alias answers',async()=>{
  let calls=0;
  const body=await waitForLiveStamp({url:'https://example.test',candidate:'new',attempts:3,intervalMs:0,sleepImpl:async()=>{},
    fetchImpl:async url=>{calls++;assert.match(String(url),/\?ts=\d+/);
      return calls===1?{ok:false,status:503}:{ok:true,status:200,json:async()=>({commit:'new'})};}});
  assert.equal(body.commit,'new');
  assert.equal(calls,2);
});
test('a stale live stamp fails after the bounded attempts and names what it saw',async()=>{
  let calls=0;
  await assert.rejects(waitForLiveStamp({url:'https://example.test',candidate:'new',attempts:2,intervalMs:0,sleepImpl:async()=>{},
    fetchImpl:async()=>{calls++;return{ok:true,status:200,json:async()=>({commit:'old'})};}}),/last saw old/);
  assert.equal(calls,2);
});
test('a live stamp that is not JSON is reported, not thrown as a parse error',async()=>{
  await assert.rejects(waitForLiveStamp({url:'https://example.test',candidate:'new',attempts:1,intervalMs:0,sleepImpl:async()=>{},
    fetchImpl:async()=>({ok:true,status:200,json:async()=>{throw new SyntaxError('not json');}})}),/no commit field/);
});
