import test from 'node:test';
import assert from 'node:assert/strict';
import {BATTERY_CAPACITY as data} from '../src/experience/story/public/data/batteryCapacity.js';

test('storage research covers thirteen countries and every plotted number has a date and public source',()=>{
  assert.equal(data.review.length,13);
  assert.deepEqual(data.review.map(r=>r.id).sort(),['it','de','uk','ie','fi','pl','ro','es','jp','au','sa','us','ca'].sort());
  for(const r of data.rows){
    assert.equal(r.name.length,2);assert.equal(r.scope.length,2);assert.equal(r.note.length,2);
    assert.ok(r.sources.length);r.sources.forEach(s=>assert.equal(new URL(s.url).protocol,'https:'));
    for(const v of [r.current,r.outlook].filter(Boolean)){
      assert.ok(v.date);assert.ok(v.kind);
      for(const unit of ['gw','gwh'])if(v[unit]!=null){
        const values=Array.isArray(v[unit])?v[unit]:[v[unit]];
        values.forEach(n=>assert.ok(Number.isFinite(n)&&n>0));
        if(values.length===2)assert.ok(values[0]<=values[1]);
      }
    }
    for(const unit of r.comparable||[])assert.ok(r.current[unit]!=null&&r.outlook[unit]!=null);
  }
});

test('queues, mixed technologies and differing model inventories never become observed paired batteries',()=>{
  const row=id=>data.rows.find(r=>r.id===id);
  assert.equal(row('it').outlook,undefined,'mixed future storage is not battery-only');
  assert.equal(row('es').outlook,undefined,'22.5 GW mixed storage must not be a battery forecast');
  assert.equal(row('sa').current.gw,undefined);assert.equal(row('sa').outlook.gw,undefined);
  assert.equal(row('sa').current.gwh,8);assert.equal(row('sa').outlook.gwh,48);
  assert.equal(row('jp').outlook.gw[0],row('jp').outlook.gwh[0]/3);
  assert.equal(row('jp').outlook.gw[1],row('jp').outlook.gwh[1]/3);
  assert.equal(row('au-nem').outlook.gw,32.5,'exclude hydro and the connection pipeline');
  assert.equal(row('au-wem').outlook,undefined,'accredited reliability supply is not rated power');
  assert.equal(row('us-model').current.kind,'model');assert.equal(row('ca-model').current.kind,'model');
  assert.equal(row('us').outlook,undefined);assert.equal(row('ca').outlook,undefined);
  assert.ok(Math.abs(row('ca').current.gw-376.4/1000)<1e-12,'exclude pumped hydro, compressed air and later COD');
  assert.ok(Math.abs(row('us-energy').current.gwh-(7465.6+66419.1+18)/1000)<1e-12);
  assert.ok(Math.abs(row('ie').current.gw-837.1/1000)<1e-12);
  assert.deepEqual(row('uk').outlook.gw,[23,27]);assert.equal(row('uk').outlook.kind,'target');
});
