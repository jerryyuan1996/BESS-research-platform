import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateMarketView, validateChangelogEntry } from '../view/schema/view.mjs';
import { isRule } from '../src/governance/triggers.js';
import { playCall } from '../src/governance/plays.js';

const json = async relative => JSON.parse(await readFile(new URL(relative, import.meta.url), 'utf8'));
const views = Object.fromEntries(await Promise.all(['pl', 'ro', 'pjm'].map(async id =>
  [id, await json(`../view/markets/${id}.json`)])));
const history = (await readFile(new URL('../view/changelog.jsonl', import.meta.url), 'utf8'))
  .trim().split('\n').map(line => JSON.parse(line));
const approved = history.filter(entry => entry.reason?.[0]?.startsWith(
  'Analyst approved six bounded Watch decisions on 15 November 2026:'));
const refinements = history.filter(entry => entry.reason?.[0] ===
  'Shorten approved Watch wording without changing scope, evidence requirements, dates or authority.');
const scopeNotes = history.filter(entry => entry.reason?.[0] ===
  'Clarify that shared play actions apply only to the approved investors.');
const summaries = history.filter(entry => entry.reason?.[0] ===
  'Condense Watch summaries; retain full evidence and exit conditions in the approved records.');
const calls = [
  ['F1', views.pl.plays['pl-grant-4h'].calls.infraFund, '2027-01-31'],
  ['S1', views.pl.verdicts.strategic, '2027-01-31'],
  ['S2', views.ro.verdicts.strategic, '2027-01-31'],
  ['F6', views.pjm.verdicts.infraFund, '2027-03-31'],
  ['S5', views.pjm.verdicts.strategic, '2027-03-31'],
  ['N6', views.pjm.verdicts.foreignFirstTimer, '2027-03-31'],
];

test('six analyst-approved calls are bounded Watch, with complete bilingual evidence tasks', () => {
  for (const view of Object.values(views)) assert.deepEqual(validateMarketView(view), []);
  for (const [code, call, reviewBy] of calls) {
    assert.equal(call.call, 'wait', code);
    assert.equal(call.reviewBy, reviewBy, code);
    assert.equal(call.author, 'analyst', code);
    assert.equal(call.asOf, '2026-11-15', code);
    assert.ok(call.changesIf.length > 0, code);
    assert.equal(call.where.length, 2, code);
    assert.ok(call.because.some(reason => reason.dimension === 'assetReturn'), code);
  }
});

test('the grant-play approval does not overwrite the distinct Polish fund capacity decision', () => {
  const pl = views.pl;
  const grant = playCall(pl, pl.plays['pl-grant-4h'], 'infraFund');
  const capacity = playCall(pl, pl.plays['pl-cap-4h'], 'infraFund');
  assert.equal(grant.own, true);
  assert.equal(grant.verdict.reviewBy, '2027-01-31');
  assert.equal(capacity.own, false);
  assert.equal(capacity.verdict.play, 'pl-cap-4h');
  assert.equal(capacity.verdict.asOf, '2026-10-31');
  assert.equal(capacity.verdict.reviewBy, '2027-03-31');
  assert.equal(pl.verdicts.foreignFirstTimer.call, 'opportunistic');
  assert.equal(views.ro.verdicts.foreignFirstTimer.asOf, '2026-10-10');
  for (const view of Object.values(views)) {
    assert.equal(view.verdicts.developer.call, 'opportunistic');
    assert.notEqual(view.verdicts.developer.asOf, '2026-11-15');
  }
});

test('internal checkpoints and proposed external results remain separate and cannot auto-apply a call', () => {
  const trigger = (market, id) => views[market].triggers.find(item => item.id === id);
  for (const [market, id] of [
    ['pl', 'pl-grant-project-terms-review'], ['ro', 'ro-grant-status-review'],
  ]) {
    const item = trigger(market, id);
    assert.equal(item.expected, '2026-11-30');
    assert.match(item.label[0], /Analyst checkpoint/);
    assert.match(item.note[0], /not an official/i);
  }
  assert.equal(trigger('ro', 'ro-grant-call-close').expected, null);
  const review = trigger('pjm', 'pjm-rbp-participation-review');
  const results = trigger('pjm', 'pjm-rbp-proposed-results');
  assert.equal(review.expected, '2027-03-31');
  assert.match(review.note[0], /not an award deadline/);
  assert.match(review.note[0], /analyst-approved continuation/);
  assert.equal(results.expected, '2027-05-10');
  assert.match(results.label[0], /Proposed/);
  assert.match(results.note[0], /not a confirmed target award date/);
  assert.match(results.note[0], /automatically/);
  for (const entry of approved.filter(entry => entry.path.startsWith('triggers.'))) {
    assert.equal(entry.to.effect, null);
    assert.equal(isRule(entry.to), false);
  }
});

test('the writer audit contains only the approved calls and supporting factual records', () => {
  assert.equal(approved.length, 15);
  const verdicts = approved.filter(entry => entry.path.startsWith('verdicts.'));
  assert.deepEqual(verdicts.map(entry => `${entry.market}/${entry.path}`).sort(), [
    'pjm/verdicts.foreignFirstTimer', 'pjm/verdicts.infraFund', 'pjm/verdicts.strategic',
    'pl/verdicts.strategic', 'ro/verdicts.strategic',
  ]);
  assert.ok(approved.every(entry => !entry.path.startsWith('grades.')));
  for (const entry of approved) {
    assert.equal(entry.author.kind, 'analyst');
    assert.deepEqual(validateChangelogEntry(entry), []);
    assert.ok(entry.evidence.length > 0);
    if (!entry.path.startsWith('plays.')) continue;
    for (const key of ['route', 'hours', 'stage', 'grantPct']) {
      assert.deepEqual(entry.to[key], entry.from[key], `${entry.market}/${key}`);
    }
    if (entry.market === 'pl') {
      assert.deepEqual(Object.keys(entry.to.calls), ['infraFund']);
      assert.equal(entry.to.calls.infraFund.call, 'wait');
    } else assert.deepEqual(entry.to.calls, entry.from.calls);
  }
});

test('wording refinements preserve the approved decision and trigger controls', () => {
  assert.equal(refinements.length, 7);
  assert.equal(scopeNotes.length, 2);
  assert.equal(summaries.length, 7);
  assert.match(views.pl.plays['pl-grant-4h'].action.text[0], /^Fund\/strategic Watch:/);
  assert.match(views.pjm.plays['pjm-cap-4h'].action.text[0], /^Fund, strategic and new-entrant Watch:/);
  for (const entry of [...refinements, ...scopeNotes, ...summaries]) {
    assert.equal(entry.author.kind, 'analyst');
    assert.deepEqual(validateChangelogEntry(entry), []);
    assert.ok(approved.some(original => original.market === entry.market && original.path === entry.path));
    for (const key of ['call', 'route', 'hours', 'stage', 'grantPct', 'calls', 'play',
      'changesIf', 'reviewBy', 'expected', 'source', 'effect', 'author', 'asOf']) {
      assert.deepEqual(entry.to[key], entry.from[key], `${entry.path}/${key}`);
    }
    if (entry.path.startsWith('plays.')) assert.equal(entry.to.action.due, entry.from.action.due);
  }
});
