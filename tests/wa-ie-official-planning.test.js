import test from 'node:test';
import assert from 'node:assert/strict';

import { WA_OFFICIAL_PLANNING } from '../src/markets/wa/officialPlanning.js';
import { IE_OFFICIAL_PLANNING } from '../src/markets/ie/officialPlanning.js';

const assertPlanningContract = (planning, expectedEndLabel) => {
  assert.equal(planning.years.length, 3);
  assert.deepEqual(planning.years.map(year => year.key), ['today','2030','end']);
  assert.match(planning.years[2].label[0], expectedEndLabel);
  assert.ok(planning.series.length >= 4);
  assert.ok(planning.series.every(series => series.values.length === 3));
  assert.ok(planning.series.every(series => series.values.every(value => value == null || Number.isFinite(value))));
  assert.ok(planning.series.every(series => series.sourceId));
  assert.ok(planning.series.every(series => series.authority));
  const sourceIds = new Set(planning.sources.map(source => source.id));
  assert.ok(planning.series.every(series => sourceIds.has(series.sourceId)));
  assert.ok(planning.sources.every(source => source.url.startsWith('https://')));
  assert.ok(planning.sources.every(source => source.checkedAt === '2026-07-29'));
  assert.ok(planning.sources.every(source => source.automation));
  assert.equal(planning.queueCoverage.status, 'INCOMPLETE');
  assert.ok(planning.queueCoverage.statement[0].includes('No '));
  assert.notEqual(planning.opportunity.attractiveness.label[0], planning.opportunity.forecastConfidence.label[0]);
};

test('WA official planning uses named years and preserves missing cells', () => {
  assertPlanningContract(WA_OFFICIAL_PLANNING, /2035–36/);
  assert.deepEqual(
    WA_OFFICIAL_PLANNING.series.find(series => series.id === 'wa-peak-rct').values,
    [null, 6644, 7454],
  );
  assert.deepEqual(
    WA_OFFICIAL_PLANNING.series.find(series => series.id === 'wa-existing-committed-balance').values,
    [null, -207, -2161],
  );
});

test('Ireland labels 2034 and does not fabricate an AIRAA adequacy series', () => {
  assertPlanningContract(IE_OFFICIAL_PLANNING, /2034/);
  assert.deepEqual(
    IE_OFFICIAL_PLANNING.series.find(series => series.id === 'ie-adequacy-outlook').values,
    [null, null, null],
  );
  assert.equal(IE_OFFICIAL_PLANNING.years.some(year => year.label[0].includes('2035')), false);
});
