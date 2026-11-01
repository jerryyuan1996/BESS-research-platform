import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STORIES,storyFor} from '../src/experience/story/registry.js';
import {storyRowsFor} from '../src/experience/storyRows.js';
import {opportunities} from '../src/experience/model.js';
import {reviewedRowsMatch} from '../src/markets/it/storyBindings.js';
import {story} from '../src/markets/it/story.js';
const row=opportunities('infraFund').find(r=>r.id==='it');
test('Italy opens for ordinary readers after G-2 approval',()=>{
 assert.equal(STORIES.it.released,true);
 assert.equal(storyFor('it',''),STORIES.it);
 assert.equal(storyFor('it','?story=preview'),STORIES.it);
});
test('the existing multi-opportunity pattern carries two independent calls and one selected case',()=>{
 const rows=storyRowsFor(row,'infraFund');
 assert.equal(rows[0],row);
 assert.deepEqual(rows.map(r=>r.play.id),['it-cap-4h','it-ltda-6h']);
 assert.deepEqual(rows.map(r=>r.call),['enter-now','opportunistic']);
 assert.equal(rows[1].investment,undefined);
 assert.equal(reviewedRowsMatch(story,row,rows,'infraFund'),true);
 assert.equal(rows.some(r=>r.play.route==='toll'),false);
});
test('the pack gates both forks before the shared shell opens and contains no model recomputation',()=>{
 const src=readFileSync(new URL('../src/markets/it/storyPack.js',import.meta.url),'utf8');
 assert.ok(src.indexOf('if(!reviewedRowsMatch')<src.indexOf('const dialog=openStory'));
 assert.ok(src.includes('renderPlayChoices'));
 assert.ok(!/runCase|runBaseCase|setLens|homeState/.test(src));
});
