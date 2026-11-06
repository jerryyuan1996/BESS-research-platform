import test from 'node:test';
import assert from 'node:assert/strict';
import {validatePolicySnapshot} from '../policy/schema.mjs';
import {sourceDigest} from '../policy/integrity.mjs';
import {fixture,CONTEXT,NOW} from './helpers/policy-fixture.mjs';

function staged(){
  const s=fixture('adopted','wa');const body='Synthetic adopted rule; schedule effective 2026-09-30T16:00:00Z; later adopted schedule effective 2027-09-30T16:00:00Z.';
  s.sources[0].contentHash=sourceDigest(body);
  for(const [n,state,date]of [[3,'effective','2026-09-30T16:00:00Z'],[4,'adopted','2027-09-30T16:00:00Z']]){
    const id=`schedule-${n}`,claim=`schedule-${n}-state`,dateClaim=`schedule-${n}-date`;
    s.instruments.push({...structuredClone(s.instruments[0]),id,state,provision:{parent:'test-instrument',locator:`Schedule ${n}`}});
    s.claims.push({...structuredClone(s.claims[0]),id:claim,instrument:id,value:state,evidence:[{source:'test-source',locator:'section 1',quote:state,supports:'legal_status'}]},
      {...structuredClone(s.claims[0]),id:dateClaim,instrument:id,kind:'date',predicate:'effective_at',value:date,evidence:[{source:'test-source',locator:'section 1',quote:date,supports:'date'}]});
    s.events.push({...structuredClone(s.events[0]),id:`event-${n}`,instrument:id,to:state,effectiveAt:date,verifiedAt:NOW,claimIds:[claim,dateClaim]});
  }
  return {s,options:{...CONTEXT,evidenceBodies:new Map([['test-source',body]])}};
}
test('one adopted instrument can retain separately effective and future provision branches',()=>{
  const {s,options}=staged();assert.deepEqual(validatePolicySnapshot(s,options),[]);
  assert.equal(s.instruments[0].state,'adopted');assert.equal(s.instruments[1].state,'effective');assert.equal(s.instruments[2].state,'adopted');
});
test('provision branches reject cycles, duplicate locators and cross-jurisdiction authority',()=>{
  for(const mutate of [s=>s.instruments[1].provision.parent='schedule-3',s=>s.instruments[2].provision.locator='Schedule 3',s=>s.instruments[1].jurisdiction='nem',s=>s.instruments[1].officialId='OTHER',s=>s.instruments[1].provision.locator='']){
    const {s,options}=staged();mutate(s);assert.ok(validatePolicySnapshot(s,options).length);
  }
});
