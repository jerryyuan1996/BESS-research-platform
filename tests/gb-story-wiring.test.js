import test from 'node:test';
import assert from 'node:assert/strict';
import {canOpen,reviewedContent} from '../src/markets/gb/story/availability.js';
import {story} from '../src/markets/gb/story.js';
import {storyValues} from '../src/markets/gb/storyBindings.js';
import {opportunities} from '../src/experience/model.js';
import {storyFor,STORIES} from '../src/experience/story/registry.js';
import {validateStory} from '../src/experience/story/contract.js';
const row=opportunities('infraFund').find(r=>r.id==='gb');

test('only the reviewed fund, operating route and play can open the GB story',()=>{
  assert.equal(canOpen(row,'infraFund'),true);
  for(const lens of ['strategic','developer','foreignFirstTimer'])assert.equal(canOpen(row,lens),false);
  assert.equal(canOpen({...row,id:'other'},'infraFund'),false);
});

test('a changed call, play, duration, route or entry stage falls back to research',()=>{
  for(const changed of [{...row,call:'wait'},{...row,play:{...row.play,id:'changed'}},{...row,play:{...row.play,hours:6}},{...row,play:{...row.play,route:'capacity'}},{...row,stage:'rtb'}])assert.equal(canOpen(changed,'infraFund'),false);
  assert.equal(canOpen(null,'infraFund'),false);
});

test('the four bilingual investment exits use the shared shell without mutating approved content',()=>{
  const before=JSON.stringify(story),configured=reviewedContent(storyValues(row));
  assert.equal(validateStory(configured).complete,true);
  const closing=configured.chapters.at(-1).shots[0];
  assert.deepEqual(closing.extra.exits.map(e=>e.anchor),['bankable','revenue','execution','downside']);
  assert.deepEqual(closing.extra.exits.map(e=>e.label),closing.controls.slice(4));
  assert.equal(JSON.stringify(story),before);
});

test('the candidate registers a lazy GB entry for the existing research button',()=>{
  assert.equal(STORIES.gb.released,true);assert.equal(typeof STORIES.gb.load,'function');
  assert.equal(storyFor('gb',''),STORIES.gb);assert.equal(storyFor('gb','?story=preview'),STORIES.gb);
});
