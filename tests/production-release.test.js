import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publishProduction } from '../scripts/lib/production-release.mjs';
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
