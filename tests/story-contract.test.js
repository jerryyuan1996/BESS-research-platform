/* The market-story content contract (immersive-experience plan, WP-02). */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { validateStory, isStale, fillPair, tokensIn, CHAPTERS } from '../src/experience/story/contract.js';
import { story } from '../src/markets/wa/story.js';
import { storyValues } from '../src/markets/wa/storyBindings.js';
import { opportunities } from '../src/experience/model.js';

const clone = (o) => JSON.parse(JSON.stringify(o));
const waRow = () => opportunities('infraFund').find(r => r.id === 'wa');
const allShots = (s) => [s.opening, ...s.chapters.flatMap(c => c.shots)];

test('the WA story validates and is complete', () => {
  const result = validateStory(story);
  assert.deepEqual(result.problems, []);
  assert.equal(result.complete, true);
});

test('the WA story has the 13 active shots, with wa-12 and wa-13 retired', () => {
  const ids = allShots(story).map(s => s.id);
  assert.equal(ids.length, 13);
  assert.ok(!ids.includes('wa-12') && !ids.includes('wa-13'));
  assert.deepEqual(story.chapters.map(c => c.id), CHAPTERS);
});

test('every token resolves on the live WA row, and the story is not stale', () => {
  const row = waRow();
  assert.ok(row, 'the infrastructure-fund lens lists WA');
  const values = storyValues(row);
  for (const t of story.tokens) assert.ok(values[t] !== null && values[t] !== undefined, `token ${t} resolves`);
  assert.equal(isStale(story, row), false, 'the live play is the one signed off');
  const filled = fillPair(story.chapters[3].shots[0].copy, values);
  assert.ok(!filled[0].includes('{') && !filled[1].includes('{'));
  assert.ok(filled[0].includes(`${row.play.hours} hours`), 'the play duration is read, not typed');
});

test('content files import nothing, so no drawing code or model reaches them', () => {
  const text = readFileSync(new URL('../src/markets/wa/story.js', import.meta.url), 'utf8');
  assert.equal(/^\s*import\s/m.test(text), false);
});

test('a missing reference is caught', () => {
  const s = clone(story);
  s.chapters[0].shots[0].claims.push('CL-WA-99');
  assert.match(validateStory(s).problems.join('\n'), /unknown claim CL-WA-99/);
  const t = clone(story);
  t.claims['CL-WA-01'].sources.push('SRC-NOPE');
  assert.match(validateStory(t).problems.join('\n'), /unknown source SRC-NOPE/);
});

test('a duplicate shot id is caught', () => {
  const s = clone(story);
  s.chapters[1].shots[1].id = 'wa-03';
  assert.match(validateStory(s).problems.join('\n'), /wa-03: duplicate id/);
});

test('an unresolved token is caught, in either language', () => {
  const s = clone(story);
  s.chapters[0].shots[0].copy = ['Built in {nowhere} years.', '建于{nowhere}年。'];
  assert.match(validateStory(s).problems.join('\n'), /unresolved token \{nowhere\}/);
  const t = clone(story);
  t.chapters[0].shots[0].meaning[1] += '{playDuration}';
  assert.match(validateStory(t).problems.join('\n'), /en and zh use different tokens/);
});

test('a typed figure in page copy is caught; dates and Example values pass', () => {
  const s = clone(story);
  s.chapters[2].shots[1].copy = ['Batteries need 7 hours here.', '这里的电池需要7小时。'];
  assert.match(validateStory(s).problems.join('\n'), /typed figure/);
  const t = clone(story);
  t.chapters[3].shots[0].controls[0] = ['4 hours', '4小时'];
  assert.match(validateStory(t).problems.join('\n'), /typed figure/);
});

test('a missing locale string is caught', () => {
  const s = clone(story);
  s.chapters[0].shots[0].question = ['Which system is this?', ''];
  assert.match(validateStory(s).problems.join('\n'), /\[en, zh\] pair/);
});

test('a stale reviewedAgainst flags the story', () => {
  const row = waRow();
  assert.equal(isStale({ ...story, reviewedAgainst: { ...story.reviewedAgainst, hours: 7 } }, row), true);
  assert.equal(isStale({ ...story, reviewedAgainst: { ...story.reviewedAgainst, playRef: 'wa-cap-7h' } }, row), true);
  assert.equal(isStale(story, { ...row, call: 'enter-now' }), true);
});

test('an incomplete draft validates but is not complete', () => {
  const s = clone(story);
  s.chapters[4] = { id: 'payment', title: ['Who pays', '谁来付费'], unavailable: true, shots: [] };
  const result = validateStory(s);
  assert.deepEqual(result.problems, []);
  assert.equal(result.complete, false);
});

test('one marker per shot, each Strong, Fair or Thin with a line, except the play card', () => {
  for (const shot of allShots(story)){
    if (shot.id === 'wa-00'){ assert.equal(shot.marker.level, 'play'); continue; }
    assert.ok(['strong', 'fair', 'thin'].includes(shot.marker.level), shot.id);
    assert.equal(tokensIn(shot.marker.change[0]).length, 0, `${shot.id}: the marker line binds nothing`);
  }
});

/* The date allowance: a sourced event date may be typed, including the
   Chinese month-precision form the scripts use ("2014年11月"). A four-digit
   amount outside a token is still a typed figure. */
test('a typed event date passes, a typed amount does not', () => {
  const dated = clone(story);
  dated.chapters[1].shots[0].copy = [
    'In November 2014 it coupled; the Chinese says 2014年11月 and 2005年6月30日.',
    '2014年11月，该市场与三个邻国耦合；2005年6月30日开始竞价。',
  ];
  assert.deepEqual(validateStory(dated).problems, []);

  const amount = clone(story);
  amount.chapters[1].shots[0].copy = ['The fleet reached 3000 MW.', '储能规模达到3000MW。'];
  assert.match(validateStory(amount).problems.join('\n'), /typed figure/);
});
