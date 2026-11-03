import test from 'node:test';
import assert from 'node:assert/strict';
import {STORIES,storyFor} from '../src/experience/story/registry.js';
import {storyMatches} from '../src/markets/caiso/story/guard.js';
import {opportunities} from '../src/experience/model.js';
const row=opportunities('infraFund').find(r=>r.id==='caiso');

test('CAISO stays unreleased and its registry entry loads only on demand in preview',()=>{
 assert.equal(STORIES.caiso.released,false);assert.equal(typeof STORIES.caiso.load,'function');
 assert.equal(storyFor('caiso',''),null);assert.equal(storyFor('caiso','?story=other'),null);
 assert.equal(storyFor('caiso','?story=preview'),STORIES.caiso);
});

test('CAISO identity drift falls back to research rather than silently retelling another case',()=>{
 assert.equal(storyMatches(row,'infraFund'),true);
 for(const changed of [{...row,call:'wait'},{...row,play:{...row.play,id:'other'}},{...row,play:{...row.play,hours:row.play.hours+1}},{...row,id:'other'},{...row,play:null}])assert.equal(storyMatches(changed,'infraFund'),false);
 assert.equal(storyMatches(row,'developer'),false);assert.equal(storyMatches(null,'infraFund'),false);
});
