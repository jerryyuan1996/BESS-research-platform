import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { story, FIELD_BINDINGS } from '../src/markets/nem/story.js';
import { storyValues, storyMatches, storyWithAvailableValues, withoutMissing } from '../src/markets/nem/storyBindings.js';
import { validateStory, fillPair, tokensIn, isStale, CHAPTERS } from '../src/experience/story/contract.js';
import { opportunities, CALLS, returnPct } from '../src/experience/model.js';
import { HOME_BRIEFING as B } from '../src/briefing/homeData.js';

const row = opportunities('infraFund').find(r => r.id === 'nem');
const values = storyValues(row, { CALLS, returnPct });
const shots = [story.opening, ...story.chapters.flatMap(c => c.shots)];
const md = readFileSync(new URL('../docs/immersive-experience-plan/nem-storyboard.md', import.meta.url), 'utf8');
const normal = s => s.replace(/‹bound: [^›]+›|\{[A-Za-z][A-Za-z0-9]*\}/g, '<v>').trim();
const block = id => {
  const start = md.indexOf(`### ${id} — `), rest = md.slice(start + 10), next = rest.search(/^## |^### nem-/m);
  const text = md.slice(start, next < 0 ? undefined : start + 10 + next);
  return Object.fromEntries(text.split('\n').filter(l => l.startsWith('| ')).map(l => l.trim().slice(2, -2).split(' | ')).filter(c => c.length === 3).map(([k, en, zh]) => [k, [en, zh]]));
};
const list = pair => pair[0].split(' · ').map((en, i) => [en, pair[1].split(' · ')[i]]);

test('NEM is a complete, valid story of thirteen shots in the six chapters, against the reviewed tuple', () => {
  assert.deepEqual(validateStory(story), { ok: true, complete: true, problems: [] });
  assert.deepEqual(story.chapters.map(c => c.id), CHAPTERS);
  assert.deepEqual(shots.map(s => s.id), Array.from({ length: 13 }, (_, i) => `nem-${String(i).padStart(2, '0')}`));
  assert.deepEqual(story.chapters.map(c => c.shots.map(s => s.id)), [['nem-01'], ['nem-02', 'nem-03', 'nem-04'], ['nem-05', 'nem-06', 'nem-07'], ['nem-08', 'nem-09'], ['nem-10'], ['nem-11', 'nem-12']]);
  assert.deepEqual(story.reviewedAgainst, { playRef: 'nem-ltda-4h', hours: 4, call: 'opportunistic', on: '2026-11-05' });
  assert.equal(storyMatches(story, row), true);
  assert.equal(isStale(story, row), false);
  for (const changed of [{ ...row, call: 'wait' }, { ...row, play: { ...row.play, hours: 6 } }, { ...row, play: { ...row.play, id: 'nem-mer-6h' } }]) {
    assert.equal(storyMatches(story, changed), false);
    assert.equal(isStale(story, changed), true);
  }
  assert.equal(storyMatches(story, row, 'strategic'), false);
});

test('one marker per shot, as the script sets them', () => {
  const strong = ['nem-01', 'nem-02', 'nem-04', 'nem-05', 'nem-06'];
  for (const shot of shots) assert.equal(shot.marker.level, shot.id === 'nem-00' ? 'play' : strong.includes(shot.id) ? 'strong' : 'fair', shot.id);
  for (const shot of shots) for (const c of shot.claims) if (story.claims[c].candidate) assert.notEqual(shot.marker.level, 'strong', `${shot.id} rests on candidate ${c}`);
});

test('question, copy, meaning, marker, controls, labels and captions are the signed script text', () => {
  for (const shot of shots) {
    const f = block(shot.id);
    for (const [field, title] of [['question', 'Question'], ['copy', 'Copy'], ['meaning', 'Meaning']]) {
      if (shot[field] === null) continue;
      let expected = f[title];
      if (shot.id === 'nem-00' && field === 'copy') expected = expected.map(s => s.replace('‹bound: play›', '{play}'));
      assert.deepEqual(shot[field].map(normal), expected.map(normal), `${shot.id}.${field}`);
    }
    if (shot.marker.level !== 'play') assert.deepEqual(shot.marker.change.map(normal), [f.Marker[0].split('What would change it: ')[1], f.Marker[1].split('会改变判断的证据：')[1]].map(normal), `${shot.id}.marker`);
    assert.deepEqual(shot.controls.map(p => p.map(normal)), list(f.Controls).map(p => p.map(normal)), `${shot.id}.controls`);
    if (f.Caption) assert.deepEqual(shot.caption.map(normal), f.Caption.map(normal), `${shot.id}.caption`);
    if (f.Labels) {
      /* nem-03's teaching label binds the Example power instead of typing it. */
      const expected = list(f.Labels).map(p => p.map(s => s.replace('100 MW', '<v> MW').replace('100MW', '<v>MW')));
      assert.deepEqual(Object.values(shot.labels).map(p => p.map(normal)), expected.map(p => p.map(normal)), `${shot.id}.labels`);
    }
  }
  const nodes = story.chapters[1].shots[0].extra.historyNodes;
  assert.equal(nodes.length, 6);
  assert.equal(nodes.at(-1).style, 'plan');
  /* G-2 change, CL-NEM-19 sourced (SRC-NEM-20): the "to be confirmed" label is removed. */
  assert.deepEqual(nodes[1].effect, ["The first batteries' revenue came largely from fast services.", '第一批电池的收入主要来自快速调频服务。']);
  assert.ok(story.claims['CL-NEM-19'].sources.includes('SRC-NEM-20'));
});

test('every figure is a token: no typed digits in copy, en and zh share tokens, and all resolve on the live row', () => {
  for (const shot of shots) {
    for (const pair of [shot.question, shot.copy, shot.meaning, shot.marker.change].filter(Boolean)) {
      for (const s of pair) assert.equal(/\d/.test(s.replace(/\{[A-Za-z][A-Za-z0-9]*\}/g, '').replace(/(19|20)\d{2}年\d{1,2}月(\d{1,2}日)?|(19|20)\d{2}|\d{1,2} (September|December)/g, '')), false, `${shot.id}: ${s}`);
      assert.deepEqual(tokensIn(pair[0]).sort(), tokensIn(pair[1]).sort(), shot.id);
      for (const t of tokensIn(pair[0])) assert.ok(FIELD_BINDINGS[t], t);
    }
  }
  const withheld = ['spreadLatest', 'spreadTwoYearsBefore', 'spreadNswLatest'];
  for (const token of story.tokens) if (!withheld.includes(token)) assert.ok(values[token] !== null && values[token] !== undefined, token);
  for (const token of withheld) assert.equal(values[token], null, `${token} stays withheld while the rights switch is off`);
  assert.equal(values.holdReturn, returnPct(row.econ.hold));
  assert.equal(values.targetReturn, returnPct(row.econ.test.target));
  assert.equal(values.securedShare, `${Math.round(row.econ.secured * 100)}%`);
  assert.equal(values.securedTenor, String(row.econ.securedYears));
  assert.equal(values.bestDuration, String(B.grids.nem.byRoute.ltda.best));
  assert.equal(values.merchantBest, String(B.grids.nem.byRoute.mer.best));
  assert.deepEqual(values.designLine, B.build.find(x => x.market === 'nem').line);
  assert.deepEqual(values.nextTrigger[0].split(' · ')[0], B.triggers[row.next].label[0]);
  assert.deepEqual(values.awardedBatteriesOperating, ['none', '无']);
  const shown = storyWithAvailableValues(story, values);
  for (const shot of [shown.opening, ...shown.chapters.flatMap(c => c.shots)])
    for (const pair of [shot.question, shot.copy, shot.meaning, ...Object.values(shot.labels || {})].filter(Boolean))
      for (const s of fillPair(pair, values)) assert.equal(/undefined|NaN|—|\{[A-Za-z]|\b0%|\$0\b/.test(s), false, `${shot.id}: ${s}`);
});

test('a missing value hides its sentence in both languages rather than printing zero', () => {
  const copy = story.chapters[2].shots[1].copy;
  const hidden = withoutMissing(copy, values);
  assert.equal(hidden[0].includes('Over two years'), false);
  assert.equal(hidden[1].includes('两年间'), false);
  assert.ok(hidden[0].startsWith('Because batteries are closing the gap'));
  assert.ok(hidden[0].includes('{batteryPriceSettingShare}'));
  const full = withoutMissing(copy, { ...values, spreadLatest: ['$59/MWh', '59澳元/MWh'], spreadTwoYearsBefore: ['$339/MWh', '339澳元/MWh'] });
  assert.deepEqual(full, copy);
  const gone = withoutMissing(['{spreadLatest}.', '{spreadLatest}。'], values, ['fallback', '后备']);
  assert.deepEqual(gone, ['fallback', '后备']);
  const one = storyValues({ ...row, play: { ...row.play, action: undefined } }, { CALLS, returnPct });
  assert.equal(one.nextAction, null);
  assert.equal(fillPair(withoutMissing(story.chapters[5].shots[1].copy, one), one)[0].includes('Next:'), false);
});
