/* The market-story shell's pure parts (WP-03): which markets open a story,
   and how timeline dates read in both languages. The dialog itself is
   exercised on the built site in e2e/story.spec.js. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { STORIES, storyFor } from '../src/experience/story/registry.js';
import { whenLabel } from '../src/experience/story/shell.js';
import { markets } from '../src/markets/registry.js';

test('an unreleased story opens only with ?story=preview', () => {
  assert.equal(STORIES.wa.released, false, 'released by the WP-10 release PR, not before');
  assert.equal(storyFor('wa', ''), null);
  assert.equal(storyFor('wa', '?story=other'), null);
  assert.equal(storyFor('wa', '?story=preview'), STORIES.wa);
});

test('markets without a story keep the research dialog', () => {
  for (const m of markets){
    if (STORIES[m.manifest.id]) continue;
    assert.equal(storyFor(m.manifest.id, '?story=preview'), null, m.manifest.id);
  }
});

test('every story id is a registered market', () => {
  const ids = new Set(markets.map(m => m.manifest.id));
  for (const id of Object.keys(STORIES)) assert.ok(ids.has(id), id);
});

test('timeline dates read in both languages', () => {
  assert.deepEqual(whenLabel('2006'), ['2006', '2006年']);
  assert.deepEqual(whenLabel('2022-06'), ['June 2022', '2022年6月']);
  assert.deepEqual(whenLabel('2023-10-01'), ['1 October 2023', '2023年10月1日']);
  assert.deepEqual(whenLabel('2025/2026'), ['2025–2026', '2025—2026年']);
  assert.deepEqual(whenLabel('outlook'), ['Outlook', '展望']);
});

test('the shell imports nothing from the market page’s own chunk', () => {
  /* An import from pages.js's chunk makes Rollup export from it and drop the
     chunk's name (vite.config.js); the page passes its helpers in instead. */
  const src = readFileSync(new URL('../src/experience/story/shell.js', import.meta.url), 'utf8');
  const imports = [...src.matchAll(/^import .* from '([^']+)';/gm)].map(m => m[1]);
  assert.deepEqual(imports.sort(), ['../../app/i18n.js', '../../app/state.js', '../../utils/dom.js', './contract.js', './place.js'].sort());
});
