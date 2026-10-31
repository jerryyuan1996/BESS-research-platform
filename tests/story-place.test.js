/* Story URLs (immersive-experience plan, WP-04): the router reads only the
   whitelisted story parameters, the story resolves them against its content,
   and the address keeps every other parameter. Back, Forward and direct links
   are exercised on the built site in e2e/story.spec.js. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { parseRoute, STORY_PARAMS } from '../src/app/router.js';
import { resolvePlace, placeSearch, placeOf, shotsOf } from '../src/experience/story/place.js';
import { story } from '../src/markets/wa/story.js';

test('a market route carries the story place only with view=story', () => {
  assert.equal(parseRoute('/markets/western-australia').story, null);
  assert.equal(parseRoute('/markets/western-australia', '?chapter=tensions&shot=wa-06').story, null);
  assert.deepEqual(parseRoute('/markets/western-australia', '?view=story&chapter=tensions&shot=wa-06').story,
    { chapter: 'tensions', shot: 'wa-06' });
  assert.deepEqual(parseRoute('/markets/western-australia', '?view=story').story, { chapter: null, shot: null });
  assert.equal(parseRoute('/markets/western-australia', '?view=other').story, null);
});

test('story parameters are whitelisted ids, and other routes keep their shape', () => {
  assert.deepEqual(parseRoute('/markets/western-australia', '?view=story&chapter=<script>&shot=wa-06%20x').story,
    { chapter: null, shot: null });
  assert.deepEqual(STORY_PARAMS, ['view', 'chapter', 'shot']);
  // region still rides alongside, and non-market routes gain nothing
  const r = parseRoute('/markets/japan-tokyo', '?region=compare&view=story&shot=wa-01');
  assert.equal(r.region, 'compare');
  assert.deepEqual(parseRoute('/returns', '?view=story'), { name: 'returns', region: null });
  // the research tab paths are untouched: /story is a tab, ?view=story is the dialog
  assert.equal(parseRoute('/markets/western-australia/story').tab, 'story');
});

test('a known shot wins, an unknown shot falls back to its chapter, anything else to the start', () => {
  assert.equal(resolvePlace(story, { chapter: 'tensions', shot: 'wa-06' }), 'wa-06');
  assert.equal(resolvePlace(story, { chapter: 'origins', shot: 'wa-06' }), 'wa-06', 'the shot names its own chapter');
  assert.equal(resolvePlace(story, { chapter: 'tensions', shot: 'wa-99' }), 'wa-05');
  assert.equal(resolvePlace(story, { chapter: 'tensions', shot: 'wa-12' }), 'wa-05', 'a retired shot is unknown');
  assert.equal(resolvePlace(story, { chapter: 'payment', shot: null }), 'wa-10');
  assert.equal(resolvePlace(story, { chapter: 'opening', shot: null }), 'wa-00');
  assert.equal(resolvePlace(story, { chapter: 'nowhere', shot: 'nothing' }), 'wa-00');
  assert.equal(resolvePlace(story, null), 'wa-00');
  assert.equal(resolvePlace(story, undefined), 'wa-00');
});

test('every shot has a place that resolves back to it', () => {
  for (const shot of shotsOf(story)){
    const place = placeOf(story, shot.id);
    assert.equal(resolvePlace(story, place), shot.id);
  }
  assert.deepEqual(placeOf(story, 'wa-00'), { chapter: 'opening', shot: 'wa-00' });
  assert.equal(placeOf(story, 'wa-99'), null);
});

test('the address keeps every other parameter and drops the place when the story closes', () => {
  const place = { chapter: 'tensions', shot: 'wa-06' };
  assert.equal(placeSearch('', place), '?view=story&chapter=tensions&shot=wa-06');
  assert.equal(placeSearch('?story=preview', place), '?story=preview&view=story&chapter=tensions&shot=wa-06');
  assert.equal(placeSearch('?story=preview&view=story&chapter=origins&shot=wa-01', place), '?story=preview&view=story&chapter=tensions&shot=wa-06');
  assert.equal(placeSearch('?region=compare&view=story&chapter=origins&shot=wa-01', null), '?region=compare');
  assert.equal(placeSearch('?view=story&chapter=origins&shot=wa-01', null), '');
});

test('the address carries no part of the investment case', () => {
  const src = readFileSync(new URL('../src/experience/story/place.js', import.meta.url), 'utf8');
  for (const word of ['irr', 'lens', 'capex', 'econ', 'investment.']) assert.ok(!src.toLowerCase().includes(`params.set('${word}`), word);
  const keys = [...new URLSearchParams(placeSearch('?story=preview', { chapter: 'payment', shot: 'wa-10' })).keys()];
  assert.deepEqual(keys, ['story', ...STORY_PARAMS]);
});
