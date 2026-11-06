import test from 'node:test';
import assert from 'node:assert/strict';
import {assertOwnerIsolation} from './helpers/bundle-ownership.mjs';

test('a transitive foreign dataset cannot hide behind the owner/shared budget partition',()=>{
  const gb={name:'market-gb-12345678.js',gzip:2,imports:new Set(['engine-12345678.js'])};
  const common={name:'engine-12345678.js',gzip:3,imports:new Set(['research-data-gb-12345678.js','research-data-jp-12345678.js'])};
  const own={name:'research-data-gb-12345678.js',gzip:4,imports:new Set()};
  const foreign={name:'research-data-jp-12345678.js',gzip:999,imports:new Set()};
  const graph=new Map([gb,common,own,foreign].map(c=>[c.name,c]));
  // The incomplete former partition would charge GB only 2+4 and shared only 3,
  // leaving the 999 foreign bytes invisible to both GB and the shared ceiling.
  assert.equal(gb.gzip+own.gzip,6);assert.equal(common.gzip,3);
  assert.throws(()=>assertOwnerIsolation(gb,'gb',graph),/gb imports foreign owner jp:.*engine-.*research-data-jp-/);
  common.imports.delete(foreign.name);
  assert.deepEqual([...assertOwnerIsolation(gb,'gb',graph)].map(c=>c.name),[gb.name,common.name,own.name]);
});
