import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { story } from '../src/markets/de/story.js';
import { storyBindings } from '../src/markets/de/storyBindings.js';
import { HISTORY, PRICE_PUBLICATION_BLOCKED } from '../src/markets/de/story/history.js';
import { validateStory, isStale, fillPair } from '../src/experience/story/contract.js';
import { opportunities, caseFor, CALLS } from '../src/experience/model.js';
import { HOME_BRIEFING } from '../src/briefing/homeData.js';

const shots = [story.opening, ...story.chapters.flatMap(c => c.shots)];
const row = opportunities('infraFund').find(r => r.id === 'de');
const result = caseFor(row);
const bound = storyBindings(row, { CALLS, result });

test('Germany is a complete signed-off story under the shared contract', () => {
  assert.deepEqual(validateStory(story), { ok: true, complete: true, problems: [] });
  assert.deepEqual(shots.map(s => s.id), Array.from({ length: 13 }, (_, i) => 'de-' + String(i).padStart(2, '0')));
  assert.equal(isStale(story, row), false);
  assert.equal(story.reviewedAgainst.on, '2026-10-31');
  assert.equal(story.playRef, row.play.id);
  assert.equal(story.opening.meaning, null);
  assert.equal(story.opening.marker.level, 'play');
  assert.ok(shots.slice(1).every(s => s.marker.level === 'fair'));
  assert.equal(PRICE_PUBLICATION_BLOCKED, true);
});

const normal = t => t.replace(/‹bound: [^›]+›|\{[a-zA-Z][a-zA-Z0-9]*\}/g, '<bound>');
const doc = readFileSync(new URL('../docs/immersive-experience-plan/germany-storyboard.md', import.meta.url), 'utf8');
const headings = [...doc.matchAll(/^### (de-\d{2}) — .+$/gm)];
const draft = Object.fromEntries(headings.map((m, i) => {
  const section = doc.slice(m.index, headings[i + 1]?.index ?? doc.indexOf('### Shared page vocabulary'));
  const table = section.match(/^\| Page text \|[\s\S]*?(?=\n\r?\n)/m)[0];
  const rows = Object.fromEntries(table.split(/\r?\n/).slice(2).map(l => { const r = l.split('|').slice(1, -1).map(x => x.trim()); return [r[0], r.slice(1)]; }));
  return [m[1], rows];
}));
test('English and Chinese page text agree with the signed-off Markdown', () => {
  for (const shot of shots) {
    const d = draft[shot.id];
    assert.deepEqual(shot.question.map(normal), d.Question.map(normal), shot.id + ' question');
    if (shot !== story.opening) {
      assert.deepEqual(shot.copy.map(normal), d.Copy.map(normal), shot.id + ' copy');
      assert.deepEqual(shot.meaning.map(normal), d.Meaning.map(normal), shot.id + ' meaning');
      assert.deepEqual(shot.marker.change.map(normal), d.Marker.map((t, i) => normal(t.replace(i ? '证据尚可。会改变判断的证据：' : 'Fair evidence. What would change it: ', ''))));
    } else {
      assert.equal(shot.copy[0], d.Copy[0].match(/Beneath: “(.*)”$/)[1]);
      assert.equal(shot.copy[1], d.Copy[1].match(/下接：“(.*)”$/)[1]);
    }
    if (d.Caption) assert.deepEqual(shot.caption.map(normal), d.Caption.map(normal));
    if (d.Labels) assert.deepEqual(shot.labels.all.map(normal), d.Labels.map(normal));
    assert.deepEqual(shot.extra.controlText.map(normal), d.Controls.map(s => normal(s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1'))));
  }
});

test('financial tokens and chart facts read the existing result without repricing', () => {
  const before = JSON.stringify(row);
  assert.equal(bound.chart.fee, result.base.secY[0]);
  assert.equal(bound.chart.tenor, result.base.securedYears);
  assert.equal(bound.chart.expiry, result.base.codOffset + result.base.securedYears);
  const best = HOME_BRIEFING.grids.de.cells.find(c => c.route === 'mer' && c.best);
  assert.equal(bound.duration.value, best.value);
  assert.equal(bound.duration.preferred, best.hours);
  assert.equal(bound.values.call, CALLS[row.call]);
  for (const token of story.tokens.filter(t => !['spreadChartLabels', 'observedRange', 'observedInterval'].includes(t))) assert.notEqual(bound.values[token], null, token);
  assert.equal(bound.values.spreadChartLabels, null);
  assert.equal(JSON.stringify(row), before);
  assert.equal(storyBindings(row, { CALLS }).values.annualFeeLabel, null, 'missing is not a zero fee');
});

test('all six dated history nodes retain their source identities', () => {
  assert.deepEqual(Object.keys(HISTORY), Array.from({ length: 6 }, (_, i) => 'H-DE-0' + (i + 1)));
  for (const node of Object.values(HISTORY)) for (const id of node.sources) assert.ok(story.sources[id], id);
  const source = readFileSync(new URL('../src/markets/de/story.js', import.meta.url), 'utf8');
  assert.equal(/^\s*import\s/m.test(source), false);
});

test('the observed chart marker names both analyst-specified permission unlocks', () => {
  const change = fillPair(shots.find(s => s.id === 'de-09').marker.change, bound.values);
  assert.match(change[0], /owner permission from EPEX SPOT, or SMARD/);
  for (const text of change) assert.match(text, /CC BY 4\.0.*HEDWIG|HEDWIG.*CC BY 4\.0/);
  assert.match(change[1], /数据所有者许可/);
});
