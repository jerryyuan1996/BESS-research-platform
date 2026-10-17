import test from 'node:test';
import assert from 'node:assert/strict';
import { byId } from '../src/markets/registry.js';
import { runCase, runBaseCase } from '../src/comparison/engine.js';
import { contractAwareLife,extendedOperatingLine,longLife } from '../src/longlife/longLife.js';
test('a 20-year award stops at year 20 in the expiry case and is not extended to year 25',()=>{
  const m=byId('jp_tokyo'),r=runCase(m,'ltda',5);
  const expiry=contractAwareLife(r,m.comparison.economics,25);
  assert.ok(expiry.secY[19]>0);
  assert.equal(expiry.secY[20],0);
  assert.equal(expiry.aucY[20],0);
  const merchant=contractAwareLife(r,m.comparison.economics,25,true);
  assert.equal(merchant.secY[15],0);
  assert.ok(expiry.flows.reduce((a,b)=>a+b,0)>merchant.flows.reduce((a,b)=>a+b,0));
  assert.equal(expiry.irr,expiry.irrRoots.length===1?expiry.irrRoots[0]:null);
});
test('expiry sensitivity leaves the 15-year result and analyst continuation intact',()=>{
  for(const id of ['wa','gb','jp_tokyo']) {
    const m=byId(id),r=runBaseCase(m,5);
    if(r.na)continue;
    const before=structuredClone(r);
    contractAwareLife(r,m.comparison.economics,25);
    assert.deepEqual(r,before);
    const view=longLife(m);
    assert.ok(view.windows.every(w=>'contractExpiry' in w && 'merchantOnly' in w));
    assert.equal(extendedOperatingLine(r,m.comparison.economics,15,false).length,15);
  }
});
