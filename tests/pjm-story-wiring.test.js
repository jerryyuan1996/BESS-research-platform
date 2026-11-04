import test from 'node:test';
import assert from 'node:assert/strict';
import {STORIES,storyFor} from '../src/experience/story/registry.js';
import {story} from '../src/markets/pjm/story.js';
import {storyMatches} from '../src/markets/pjm/storyBindings.js';
import {opportunities} from '../src/experience/model.js';

test('PJM remains unreleased and lazy, with the reviewed tuple falling back to research',()=>{
  assert.equal(STORIES.pjm.released,false);
  assert.equal(storyFor('pjm',''),null);
  assert.equal(storyFor('pjm','?story=preview'),STORIES.pjm);
  const row=opportunities('infraFund').find(r=>r.id==='pjm');
  assert.equal(storyMatches(story,row,'infraFund'),true);
  for(const changed of [{...row,call:'avoid'},{...row,play:{...row.play,id:'other'}},{...row,play:{...row.play,hours:6}}])assert.equal(storyMatches(story,changed,'infraFund'),false);
  assert.equal(storyMatches(story,row,'strategic'),false);
});

