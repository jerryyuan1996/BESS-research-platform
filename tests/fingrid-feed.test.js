/* Finland's Fingrid reserve-price feed (gate FI-2), 2026-10-30.
   Offline: no network, no key. The live endpoint was checked by hand. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { SERIES, toPoints, toCapacityPoints, requestWindow, fetchDataset } from '../etl/sources/fingrid.mjs';
import { DATASETS } from '../src/governance/datasets.js';
import { detectDrift } from '../etl/drift/detect.mjs';
import { markets } from '../src/markets/registry.js';

const DAY = 86_400_000;

test('every Fingrid catalogue dataset maps to a Fingrid series, and nothing else does', () => {
  const catalogue = DATASETS.filter(d => d.connector === 'fingrid').map(d => d.id).sort();
  assert.deepEqual(catalogue, Object.keys(SERIES).sort());
  for (const d of DATASETS.filter(x => x.connector === 'fingrid')){
    assert.equal(d.marketId, 'fi');
    assert.deepEqual(d.bearsOn, d.id === 'fi-storage-capacity' ? [] : ['economics.services'], `${d.id}: a reserve price never bears on the merchant line`);
    assert.match(d.source.licence, /CC BY 4\.0/);
  }
});

test('Fingrid rows become sorted hourly points, restated hours replace, junk is dropped', () => {
  const rows = [
    { startTime: '2026-10-28T01:00:00.000Z', value: 2 },
    { startTime: '2026-10-28T00:00:00.000Z', value: 2.2 },
    { startTime: '2026-10-28T01:00:00.000Z', value: 2.5 },
    { startTime: 'not a time', value: 9 },
    { startTime: '2026-10-28T02:00:00.000Z', value: null },
  ];
  assert.deepEqual(toPoints(rows), [
    { t: '2026-10-28T00:00:00.000Z', v: 2.2 },
    { t: '2026-10-28T01:00:00.000Z', v: 2.5 },
  ]);
  assert.deepEqual(toPoints(undefined), []);
});

test('a cold start asks for the full window; a warm one overlaps the last day held', () => {
  const end = Date.parse('2026-10-30T12:00:00Z');
  const cold = requestWindow(null, end);
  assert.equal(Date.parse(cold.from), end - 365 * DAY);
  assert.equal(Date.parse(cold.to), end + DAY);

  const warm = requestWindow({ series: [{ t: '2026-10-29T23:00:00.000Z', v: 1 }] }, end);
  assert.equal(warm.from, '2026-10-28T23:00:00.000Z');
});

test('without a key the dataset is skipped, never fetched or emptied', async () => {
  const saved = process.env.FINGRID_API_KEY;
  delete process.env.FINGRID_API_KEY;
  try {
    const r = await fetchDataset({ dataset: DATASETS.find(d => d.id === 'fi-fcr-n'), previous: null, log: () => {} });
    assert.equal(r.skipped, true);
    assert.match(r.reason, /FINGRID_API_KEY/);
  } finally {
    if (saved !== undefined) process.env.FINGRID_API_KEY = saved;
  }
});

test('a reserve price series never reaches the merchant drift detector', () => {
  const series = Array.from({ length: 24 * 60 }, (_, i) => ({ t: new Date(Date.parse('2026-08-01T00:00:00Z') + i * 3_600_000).toISOString(), v: i % 24 < 12 ? 0 : 400 }));
  const dataset = DATASETS.find(d => d.id === 'fi-fcr-d-up');
  const { findings } = detectDrift({ results: [{ dataset, snapshot: { series } }], markets });
  assert.deepEqual(findings, [], 'a EUR/MW/h reserve price was read as an energy spread');
});

test('storage technical capacity stays non-negative MW and cannot imply an earnings index', () => {
  const d = DATASETS.find(x => x.id === 'fi-storage-capacity');
  assert.deepEqual(d.bearsOn, []);
  assert.deepEqual(SERIES[d.id].units, { power: 'MW' });
  assert.equal(SERIES[d.id].id, 424);
  const rows = [{ startTime: '2026-10-30T00:00:00Z', endTime: '2026-10-30T01:00:00Z', value: 1800 }];
  assert.deepEqual(toCapacityPoints(rows), [{ t: '2026-10-30T00:00:00.000Z', v: 1800 }]);
  assert.throws(() => toCapacityPoints([{ ...rows[0], value: -1 }]), /non-negative MW/);
  assert.throws(() => toCapacityPoints([{ ...rows[0], endTime: '2026-10-30T02:00:00Z' }]), /hourly interval/);
  const { findings } = detectDrift({ results: [{ dataset: d, snapshot: { series: toCapacityPoints(rows) } }], markets });
  assert.deepEqual(findings, []);
});
