import test from 'node:test';
import assert from 'node:assert/strict';
import { datasetById } from '../../src/governance/datasets.js';
import { fetchDataset } from '../sources/entsoe.mjs';

test('DE-LU is registered through ENTSO-E with publication blocked', () => {
  const d = datasetById('de-day-ahead');
  assert.equal(d.marketId, 'de');
  assert.equal(d.connector, 'entsoe');
  assert.equal(d.republishable, false);
  assert.match(d.source.licence, /rights unresolved/);
  assert.deepEqual(d.bearsOn, ['economics.merchGross']);
});

test('the rights gate stops before any token or price request', async () => {
  const previous = { contentChecksum: 'unchanged' };
  const oldFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = () => { calls++; throw new Error('must not request prices'); };
  try {
    const result = await fetchDataset({ dataset: datasetById('de-day-ahead'), previous, log: () => {} });
    assert.equal(result.skipped, true);
    assert.match(result.reason, /GAP-DE-PRICES/);
    assert.equal(result.snapshot, undefined);
    assert.equal(calls, 0);
    assert.equal(previous.contentChecksum, 'unchanged');
  } finally { globalThis.fetch = oldFetch; }
});
