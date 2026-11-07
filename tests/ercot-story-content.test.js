/* The ERCOT G-2 story pack's content: the signed G-1 script transcribed,
   every figure bound, and the build-evidence wordings where they govern. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { story, FIELD_BINDINGS } from '../src/markets/ercot/story.js';
import { storyValues, storyMatches, storyWithAvailableValues, withoutMissing, durationRules, historyWhen } from '../src/markets/ercot/storyBindings.js';
import { validateStory, fillPair, tokensIn, isStale, CHAPTERS } from '../src/experience/story/contract.js';
import { opportunities, CALLS, returnPct } from '../src/experience/model.js';
import { marginText } from '../src/experience/decision.js';
import { ERCOT_STORY_RECORDS as R } from '../src/markets/ercot/data/storyEvidence.js';

const row = opportunities('infraFund').find(r => r.id === 'ercot');
const ui = { CALLS, returnPct, marginText };
const values = storyValues(row, ui);
const shots = [story.opening, ...story.chapters.flatMap(c => c.shots)];
const md = readFileSync(new URL('../docs/immersive-experience-plan/ercot-storyboard.md', import.meta.url), 'utf8');
const evidence = readFileSync(new URL('../docs/immersive-experience-plan/ercot-build-evidence.md', import.meta.url), 'utf8');
const normal = s => s.replace(/‹bound: [^›]+›|\{[A-Za-z][A-Za-z0-9]*\}/g, '<v>').replace(/[“”"]/g, '"').trim();
const block = id => {
  const start = md.indexOf(`### ${id} — `), rest = md.slice(start + 10), next = rest.search(/^## |^### ercot-|^### Shared/m);
  const text = md.slice(start, next < 0 ? undefined : start + 10 + next);
  return Object.fromEntries(text.split('\n').filter(l => l.startsWith('| ')).map(l => l.trim().slice(2, -2).split(' | ')).filter(c => c.length === 3).map(([k, en, zh]) => [k, [en, zh]]));
};
const list = pair => pair[0].split(' · ').map((en, i) => [en, pair[1].split(' · ')[i]]);
const strings = node => node == null ? [] : typeof node === 'string' ? [node] : Array.isArray(node) ? node.flatMap(strings) : typeof node === 'object' ? Object.values(node).flatMap(strings) : [];

test('ERCOT is a complete, valid story of thirteen shots in the six chapters, against the reviewed tuple', () => {
  assert.deepEqual(validateStory(story), { ok: true, complete: true, problems: [] });
  assert.deepEqual(story.chapters.map(c => c.id), CHAPTERS);
  assert.deepEqual(shots.map(s => s.id), Array.from({ length: 13 }, (_, i) => `ercot-${String(i).padStart(2, '0')}`));
  assert.deepEqual(story.chapters.map(c => c.shots.map(s => s.id)), [['ercot-01'], ['ercot-02', 'ercot-03', 'ercot-04'], ['ercot-05', 'ercot-06', 'ercot-07'], ['ercot-08', 'ercot-09'], ['ercot-10', 'ercot-11'], ['ercot-12']]);
  assert.deepEqual(story.reviewedAgainst, { playRef: 'ercot-toll-2h', hours: 2, call: 'opportunistic', on: '2026-11-01' });
  assert.equal(storyMatches(story, row), true);
  assert.equal(isStale(story, row), false);
  for (const changed of [{ ...row, call: 'wait' }, { ...row, play: { ...row.play, hours: 4 } }, { ...row, play: { ...row.play, id: 'ercot-mer-2h' } }]) {
    assert.equal(storyMatches(story, changed), false);
    assert.equal(isStale(story, changed), true);
  }
  for (const lens of ['strategic', 'developer', 'foreignFirstTimer']) assert.equal(storyMatches(story, row, lens), false);
});

test('one marker per shot, as the script sets them', () => {
  const strong = ['ercot-01', 'ercot-02', 'ercot-05', 'ercot-06', 'ercot-07'];
  for (const shot of shots) assert.equal(shot.marker.level, shot.id === 'ercot-00' ? 'play' : strong.includes(shot.id) ? 'strong' : 'fair', shot.id);
});

test('page text is the signed script, except where the build-evidence record governs', () => {
  /* Build evidence §5 (Example state) and §8 (scoped toll wording) replace the
     draft copy of these three shots; the rest is the script verbatim. */
  const governed = { 'ercot-05': 'copy', 'ercot-06': 'copy', 'ercot-11': 'copy' };
  for (const shot of shots) {
    const f = block(shot.id);
    for (const [field, title] of [['question', 'Question'], ['copy', 'Copy'], ['meaning', 'Meaning']]) {
      if (shot[field] === null || governed[shot.id] === field) continue;
      let expected = f[title];
      if (shot.id === 'ercot-00') expected = expected.map(s => s.replace('‹bound: next action›.', '<v>.').replace('‹bound: next action›。', '<v>。'));
      assert.deepEqual(shot[field].map(normal), expected.map(normal), `${shot.id}.${field}`);
    }
    if (shot.marker.level !== 'play') assert.deepEqual(shot.marker.change.map(normal), [f.Marker[0].split('What would change it: ')[1], f.Marker[1].split('会改变判断的证据：')[1]].map(normal), `${shot.id}.marker`);
    assert.deepEqual(shot.controls.map(p => p.map(normal)), list(f.Controls).map(p => p.map(normal)), `${shot.id}.controls`);
  }
  /* Labels as signed, where the script lists them and no record changed them. */
  for (const id of ['ercot-01', 'ercot-03', 'ercot-04', 'ercot-07', 'ercot-08', 'ercot-09', 'ercot-10']) {
    const shot = shots.find(s => s.id === id);
    const expected = list(block(id).Labels).map(p => p.map(s => s.replace('100 MW', '<v> MW').replace('100MW', '<v>MW')));
    assert.deepEqual(Object.values(shot.labels).map(p => p.map(normal)), expected.map(p => p.map(normal)), `${id}.labels`);
  }
  const nodes = story.chapters[1].shots[0].extra.historyNodes;
  assert.deepEqual(nodes.map(n => n.id), ['H-ERCOT-01', 'H-ERCOT-02', 'H-ERCOT-03', 'H-ERCOT-04', 'H-ERCOT-05', 'H-ERCOT-06']);
  assert.equal(nodes[3].style, 'closed', 'the credit is a closed branch, not a dashed future');
  const asScript = t => t.replace('{oldOfferCap}', '‹bound: old offer cap›').replace('{offerCap}', '‹bound: offer cap›');
  for (const n of nodes) for (const field of ['constraint', 'choice', 'remains', 'effect'])
    for (const side of n[field]) assert.ok(md.includes(asScript(side)), `${n.id}.${field}: ${side}`);
});

test('the governed wordings are the build-evidence record verbatim', () => {
  const quote = s => evidence.includes(s.replace(/\{[a-zA-Z]+\}/g, m => ({ '{securedShare}': '‹bound: secured share›', '{securedTenor}': '‹bound: secured tenor›', '{holdIrr}': '‹bound: hold IRR›', '{marginToTarget}': '‹bound: margin to target›' })[m] || m));
  const [e05, e06, e11] = ['ercot-05', 'ercot-06', 'ercot-11'].map(id => shots.find(s => s.id === id).copy);
  assert.ok(quote(e05[0]) && quote(e05[1]), 'ercot-05 Example copy, §5');
  const [en06, zh06] = e06;
  assert.ok(quote(en06.split(' Revenue per kilowatt')[0]) && quote(zh06.split('仅2025年')[0]), 'ercot-06 Example copy, §5');
  assert.ok(quote(e11[0]) && quote(e11[1]), 'ercot-11 scoped toll wording, §8');
  assert.deepEqual(shots.find(s => s.id === 'ercot-11').labels.price, ['Contract price unverified', '合同价格未核验']);
});

test('every figure is a token: no typed digits in copy, en and zh share tokens, and all resolve on the live row', () => {
  for (const shot of shots) {
    for (const pair of [shot.question, shot.copy, shot.meaning, shot.marker.change].filter(Boolean)) {
      for (const s of pair) assert.equal(/\d/.test(s.replace(/\{[A-Za-z][A-Za-z0-9]*\}/g, '').replace(/(19|20)\d{2}年\d{1,2}月(\d{1,2}日)?|(19|20)\d{2}|\d{1,2} (December)/g, '')), false, `${shot.id}: ${s}`);
      assert.deepEqual(tokensIn(pair[0]).sort(), tokensIn(pair[1]).sort(), shot.id);
      for (const t of tokensIn(pair[0])) assert.ok(FIELD_BINDINGS[t], t);
    }
  }
  for (const token of story.tokens) assert.ok(values[token] !== null && values[token] !== undefined, token);
  assert.deepEqual(values.call, CALLS[row.call]);
  assert.equal(values.holdIrr, returnPct(row.investment.holdIRR));
  assert.deepEqual(values.marginToTarget, marginText(row));
  assert.equal(values.securedShare, `${Math.round(row.investment.secured * 100)}%`);
  assert.equal(values.securedTenor, String(row.investment.securedYears));
  assert.equal(values.playDuration, String(row.play.hours));
  assert.deepEqual(values.nextAction, row.play.action.text);
  assert.deepEqual(values.nextEvent, row.decision.event.label);
  assert.ok(values.nextEventDate[0].endsWith(row.decision.event.expected.slice(0, 4)));
  assert.equal(values.dcTieCapacity, `${R.dcTies.totalTransferMW.toLocaleString('en-US')} MW`);
  assert.deepEqual(values.offerCap, [`$${R.offerCap.currentUSDPerMWh.toLocaleString('en-US')}/MWh`, `${R.offerCap.currentUSDPerMWh.toLocaleString('en-US')}美元/MWh`]);
  assert.deepEqual(values.revenuePerKwChange, [`almost ${R.revenuePerKW2025.declineMagnitudePct}%`, `近${R.revenuePerKW2025.declineMagnitudePct}%`]);
  assert.match(values.ordcAdder[0], /^less than \$/);
  assert.equal(fillPair(['{nextActionClause}.', '{nextActionClause}。'], values).some(s => /[.。]{2}$/.test(s)), false);
  const shown = storyWithAvailableValues(story, values);
  for (const shot of [shown.opening, ...shown.chapters.flatMap(c => c.shots)])
    for (const pair of [shot.question, shot.copy, shot.meaning, ...Object.values(shot.labels || {})].filter(Boolean))
      for (const s of fillPair(pair, values)) assert.equal(/undefined|NaN|—|\{[A-Za-z]|\b0%|\$0(?![.\d])/.test(s), false, `${shot.id}: ${s}`);
});

test('duration rules name Reg-Up, never infer Reg-Down, and history dates keep their recorded precision', () => {
  assert.deepEqual(values.reserveDurationRules, ['Reg-Up and Responsive Reserve, 30 minutes; ECRS, 1 hour; Non-Spin, 4 hours', '上调调频与响应备用30分钟；ECRS 1小时；非旋转备用4小时']);
  assert.equal(R.reserveRules.regDown.durationMinutes, null);
  assert.equal(durationRules({ ...R.reserveRules, ecrs: { durationMinutes: null } }), null);
  assert.deepEqual(historyWhen('H-ERCOT-01'), ['2014', '2014年']);
  assert.deepEqual(historyWhen('H-ERCOT-03'), ['December 2021', '2021年12月']);
  assert.deepEqual(historyWhen('H-ERCOT-04'), ['January 2023 – 19 December 2024', '2023年1月至2024年12月19日']);
  assert.deepEqual(historyWhen('H-ERCOT-06'), ['5 December 2025', '2025年12月5日']);
});

test('no toll price, fee, range or proxy, and no gated candidate value, reaches the story', () => {
  const text = [...strings(story), ...Object.values(values).flatMap(strings)].join('\n');
  assert.doesNotMatch(text, /\/kW-(month|mo|yr|year)|per kW-month|toll price of|toll fee of/i);
  const fee = row.investment.bridge?.fixed;
  if (Number.isFinite(fee)) for (const shape of [String(Math.round(fee)), Math.round(fee).toLocaleString('en-US'), `${Math.round(fee / 1000)}k`]) assert.equal(text.includes(shape), false, shape);
  /* The signed script's candidate reserve prices and the monitor's fleet
     statements stay out of every story module while their gates are closed. */
  for (const file of ['story.js', 'storyBindings.js', 'storyPack.js', 'story/scenes.js', 'story/chart.js', 'story/geo.js', 'story/evidence.js']) {
    const src = readFileSync(new URL(`../src/markets/ercot/${file}`, import.meta.url), 'utf8');
    for (const candidate of ['21.04', '2.74', '300.87', '73.18', '9,505', '9505', '17,000', '31,500', '1,600']) assert.equal(src.includes(candidate), false, `${file}: ${candidate}`);
  }
});

test('a missing value hides its sentence in both languages rather than printing zero', () => {
  const copy = story.chapters[2].shots[2].copy;
  const off = { ...values, ordcHours: null };
  const hidden = withoutMissing(copy, off);
  assert.equal(hidden[0].includes('In 2025'), false);
  assert.equal(hidden[1].includes('2025年，稀缺定价'), false);
  assert.ok(hidden[0].startsWith('Rarely.'));
  assert.deepEqual(withoutMissing(copy, values), copy);
  const none = storyValues({ ...row, play: { ...row.play, action: undefined } }, ui);
  assert.equal(none.nextAction, null);
  assert.equal(fillPair(withoutMissing(story.chapters[5].shots[0].copy, none), none)[0].includes('Next:'), false);
  const noIrr = storyValues({ ...row, investment: { ...row.investment, holdIRR: null } }, ui);
  const shown = storyWithAvailableValues(story, noIrr).chapters[4].shots[1].copy;
  assert.equal(fillPair(shown, noIrr)[0].includes('all-equity return'), false);
});
