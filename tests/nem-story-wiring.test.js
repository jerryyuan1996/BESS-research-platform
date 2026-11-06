import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { STORIES, storyFor } from '../src/experience/story/registry.js';
import { story } from '../src/markets/nem/story.js';
import { storyMatches } from '../src/markets/nem/storyBindings.js';
import { opportunities } from '../src/experience/model.js';

test('NEM is registered unreleased: it opens only behind ?story=preview', () => {
  assert.equal(STORIES.nem.released, false);
  assert.equal(typeof STORIES.nem.load, 'function');
  assert.equal(storyFor('nem', ''), null);
  assert.equal(storyFor('nem', '?view=story'), null);
  assert.equal(storyFor('nem', '?story=preview'), STORIES.nem);
});

test('a changed call, play, duration or lens falls back to the research dialog', () => {
  const row = opportunities('infraFund').find(r => r.id === 'nem');
  assert.equal(storyMatches(story, row, 'infraFund'), true);
  for (const changed of [{ ...row, call: 'avoid' }, { ...row, play: { ...row.play, id: 'other' } }, { ...row, play: { ...row.play, hours: 2 } }])
    assert.equal(storyMatches(story, changed, 'infraFund'), false);
  for (const lens of ['strategic', 'developer', 'foreignFirstTimer']) assert.equal(storyMatches(story, row, lens), false);
  assert.equal(storyMatches(story, opportunities('infraFund').find(r => r.id === 'wa'), 'infraFund'), false);
});

test('the pack is loaded only through its own dynamic import, and imports no observed records', () => {
  const registry = readFileSync(new URL('../src/experience/story/registry.js', import.meta.url), 'utf8');
  assert.match(registry, /nem: \{ released: false, load: \(\) => import\('\.\.\/\.\.\/markets\/nem\/storyPack\.js'\) \}/);
  const pack = readFileSync(new URL('../src/markets/nem/storyPack.js', import.meta.url), 'utf8');
  assert.equal(/storyEvidenceObserved|storyEvidence\.js/.test(pack), false);
  assert.match(pack, /isStale\(story, ctx\.row\) \|\| !storyMatches/);
});
