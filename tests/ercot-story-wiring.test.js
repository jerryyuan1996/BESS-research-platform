/* The ERCOT G-2 pack is registered unreleased: it opens only behind
   ?story=preview, for the fund lens and the reviewed call, play and duration. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { STORIES, storyFor } from '../src/experience/story/registry.js';
import { story } from '../src/markets/ercot/story.js';
import { storyMatches } from '../src/markets/ercot/storyBindings.js';
import { opportunities } from '../src/experience/model.js';

test('ERCOT is registered but unreleased, so only ?story=preview opens it', () => {
  assert.equal(STORIES.ercot.released, false);
  assert.equal(typeof STORIES.ercot.load, 'function');
  assert.equal(storyFor('ercot', ''), null);
  assert.equal(storyFor('ercot', '?view=story'), null);
  assert.equal(storyFor('ercot', '?story=other'), null);
  assert.equal(storyFor('ercot', '?story=preview'), STORIES.ercot);
});

test('a changed call, play, duration or lens falls back to the research dialog', () => {
  const row = opportunities('infraFund').find(r => r.id === 'ercot');
  assert.equal(storyMatches(story, row, 'infraFund'), true);
  for (const changed of [{ ...row, call: 'avoid' }, { ...row, play: { ...row.play, id: 'other' } }, { ...row, play: { ...row.play, hours: 4 } }])
    assert.equal(storyMatches(story, changed, 'infraFund'), false);
  for (const lens of ['strategic', 'developer', 'foreignFirstTimer']) assert.equal(storyMatches(story, row, lens), false);
  assert.equal(storyMatches(story, opportunities('infraFund').find(r => r.id === 'pjm'), 'infraFund'), false);
});

test('the pack loads only through its own dynamic import and guards before opening', () => {
  const registry = readFileSync(new URL('../src/experience/story/registry.js', import.meta.url), 'utf8');
  assert.match(registry, /ercot: \{ released: false, load: \(\) => import\('\.\.\/\.\.\/markets\/ercot\/storyPack\.js'\) \}/);
  const pack = readFileSync(new URL('../src/markets/ercot/storyPack.js', import.meta.url), 'utf8');
  assert.match(pack, /isStale\(story, ctx\.row\) \|\| !storyMatches\(story, ctx\.row, lens\)/);
  assert.match(pack, /ctx\.lens \?\? app\.lens \?\? 'infraFund'/);
});
