import test from 'node:test';
import assert from 'node:assert/strict';
import {policySceneProblems} from '../policy/scene-contract.mjs';
import {policyUIFixture} from './helpers/policy-ui-fixture.mjs';
const data=()=>policyUIFixture().snapshot;

test('relationship scenes require bounded cited endpoints inside the story graph',()=>{
  const snapshot=data(),ids=['gb-consultation','gb-adopted'];
  const spec={template:'causal',claimIds:ids,impactIds:[],relations:[{from:ids[0],to:ids[1],evidenceClaim:ids[1]}]};
  assert.deepEqual(policySceneProblems(spec,snapshot,{storyClaimIds:ids}),[]);
  assert.ok(policySceneProblems({...spec,relations:[]},snapshot).length);
  assert.ok(policySceneProblems(spec,snapshot,{storyClaimIds:[ids[0]]}).length);
  assert.ok(policySceneProblems({...spec,relations:[{from:ids[0],to:ids[0],evidenceClaim:ids[1]}]},snapshot).length);
  assert.ok(policySceneProblems({...spec,relations:[null]},snapshot).length);
  assert.ok(policySceneProblems({...spec,html:'<script>'},snapshot).length);
  assert.ok(policySceneProblems({...spec,claimIds:Array(25).fill(ids[0])},snapshot).length);
});
test('sourced values require compatible dates, contracts, market definitions, locations and numeric lanes',()=>{
  const snapshot=data(),first=snapshot.impacts.find(i=>i.id==='gb-scenario'),second={...first,id:'second-value'};
  snapshot.impacts.push(second);const spec={template:'sourced_range',claimIds:[],impactIds:[first.id,second.id]};
  assert.deepEqual(policySceneProblems(spec,snapshot),[]);
  for(const field of ['currency','asOf','taxTreatment','contract','marketDefinition','location']){
    const old=second[field];second[field]='different';assert.ok(policySceneProblems(spec,snapshot).length,field);second[field]=old;
  }
  second.value=NaN;assert.ok(policySceneProblems(spec,snapshot).length);
});
test('waterfalls reproduce canonical additive inputs, bound SVG size and reject fake totals',()=>{
  const snapshot=data(),impact=snapshot.impacts.find(i=>i.id==='gb-scenario'),spec={template:'impact_waterfall',claimIds:[],impactIds:[impact.id]};
  assert.deepEqual(policySceneProblems(spec,snapshot,{storyClaimIds:['gb-test-number']}),[]);
  assert.ok(policySceneProblems(spec,snapshot,{storyClaimIds:['gb-adopted']}).length);
  impact.value=19;assert.ok(policySceneProblems(spec,snapshot).length);
  impact.value=20;impact.inputs=Array(25).fill('gb-test-number');assert.ok(policySceneProblems(spec,snapshot).length);
  impact.inputs=['gb-test-number','gb-test-number'];impact.formula='eval(20)';assert.ok(policySceneProblems(spec,snapshot).length);
});
