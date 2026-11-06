import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm } from 'node:fs/promises';
import { DATASETS, snapshotFile } from '../src/governance/datasets.js';
import { SERIES, settlementBounds, parseDay, requestDays, createConnector, summarize } from '../etl/sources/elexon-system-prices.mjs';
import { buildSnapshot, verifyContentChecksum } from '../etl/lib/envelope.mjs';
import { writeSnapshot, REPO_ROOT } from '../etl/lib/boundary.mjs';
import { validateSnapshot } from '../etl/lib/validate.mjs';
import { runSelection } from '../etl/run.mjs';
import { detectDrift } from '../etl/drift/detect.mjs';
import { markets } from '../src/markets/registry.js';
import path from 'node:path';

const buy = DATASETS.find(d => d.id === 'gb-imbalance-buy');
const volume = DATASETS.find(d => d.id === 'gb-net-imbalance-volume');
const now = '2026-11-06T12:00:00.000Z';
const quiet = () => {};
function dayPayload(day, value = 50){
  const { from, periods } = settlementBounds(day);
  return { metadata: { datasets: ['DISEBSP'] }, data: Array.from({ length: periods }, (_, i) => ({
    settlementDate: day, settlementPeriod: i + 1,
    startTime: new Date(from + i * 1_800_000).toISOString(),
    createdDateTime: '2026-11-06T01:00:00Z',
    systemBuyPrice: value, systemSellPrice: value, netImbalanceVolume: i % 2 ? -100 : 120,
    bsadDefaulted: false, priceDerivationCode: 'N',
  })) };
}
const dayFromUrl = url => new URL(url).pathname.split('/').at(-1);
const request = async url => dayPayload(dayFromUrl(url));

test('Elexon identities are additive and carry no model or view authority', () => {
  const datasets = DATASETS.filter(d => d.connector === 'elexon-system-prices');
  assert.deepEqual(datasets.map(d => d.id).sort(), Object.keys(SERIES).sort());
  for (const d of datasets){
    assert.equal(d.marketId, 'gb');
    assert.deepEqual(d.bearsOn, []);
    assert.equal(d.requiresKey, false);
    assert.equal(d.republishable, true);
    assert.match(d.source.licence, /BMRS Open Data/);
    assert.match(d.source.attribution, /Contains BMRS data/);
  }
  assert.equal(DATASETS.find(d => d.id === 'gb-day-ahead').connector, 'entsoe');
});

test('London day bounds preserve the 46/48/50 settlement-period contract', () => {
  assert.deepEqual(settlementBounds('2025-10-26'), {
    from: Date.parse('2025-10-25T23:00:00Z'), to: Date.parse('2025-10-27T00:00:00Z'), periods: 50,
  });
  assert.deepEqual(settlementBounds('2026-03-29'), {
    from: Date.parse('2026-03-29T00:00:00Z'), to: Date.parse('2026-03-29T23:00:00Z'), periods: 46,
  });
  assert.equal(settlementBounds('2026-07-01').from, Date.parse('2026-06-30T23:00:00Z'));
  assert.equal(settlementBounds('2026-11-04').periods, 48);
  assert.throws(() => settlementBounds('2026-02-30'), /invalid settlement date/);
});

test('prices and signed MWh remain separate; default and derivation flags survive', () => {
  const payload = dayPayload('2025-10-26', -35);
  payload.data[0].bsadDefaulted = true;
  const prices = parseDay(payload, '2025-10-26', SERIES[buy.id]);
  const energy = parseDay(payload, '2025-10-26', SERIES[volume.id]);
  assert.equal(prices.length, 50);
  assert.equal(prices[0].v, -35);
  assert.equal(energy[1].v, -100);
  assert.equal(prices[0].bsadDefaulted, true);
  assert.equal(prices[0].priceDerivationCode, 'N');
  assert.equal(prices[0].t, '2025-10-25T23:00:00.000Z');
});

test('null, strings, non-finite and implausible metric values fail without zero filling', () => {
  for (const value of [null, '', '4', Infinity, 1_000_001]){
    const payload = dayPayload('2026-11-04');
    payload.data[0].systemBuyPrice = value;
    assert.throws(() => parseDay(payload, '2026-11-04', SERIES[buy.id]), /invalid systemBuyPrice/);
  }
  const payload = dayPayload('2026-11-04');
  payload.data[0].netImbalanceVolume = 100_001;
  assert.throws(() => parseDay(payload, '2026-11-04', SERIES[volume.id]), /invalid netImbalanceVolume/);
});

test('partial days, naive instants, wrong date/period or unexpected payloads fail closed', () => {
  const mutations = [
    p => p.data.pop(),
    p => { p.data[0].startTime = '2026-11-04T00:00:00'; },
    p => { p.data[0].settlementPeriod = 2; },
    p => { p.data[0].settlementDate = '2026-11-03'; },
    p => { p.metadata.datasets = ['OTHER']; },
    p => { p.data = []; },
  ];
  for (const mutate of mutations){
    const payload = dayPayload('2026-11-04'); mutate(payload);
    assert.throws(() => parseDay(payload, '2026-11-04', SERIES[buy.id]), /Elexon:/);
  }
});

test('duplicate revisions use source version order and reject same-version conflicts', () => {
  const payload = dayPayload('2026-11-04');
  const newer = { ...payload.data[0], createdDateTime: '2026-11-06T02:00:00Z', systemBuyPrice: 70 };
  payload.data.unshift(newer);
  payload.data.push({ ...newer });
  assert.equal(parseDay(payload, '2026-11-04', SERIES[buy.id])[0].v, 70);
  payload.data.push({ ...newer, systemBuyPrice: 80 });
  assert.throws(() => parseDay(payload, '2026-11-04', SERIES[buy.id]), /same-version/);
});

test('the request budget overlaps D+1 days and detects intra-day holes', () => {
  const complete = parseDay(dayPayload('2026-11-03'), '2026-11-03', SERIES[buy.id]);
  const wanted = requestDays({ series: complete }, now);
  assert.equal(wanted.length, 6);
  assert.deepEqual(wanted.slice(0, 2), ['2026-11-05', '2026-11-04']);
  assert.ok(!wanted.includes('2026-11-03'));
  const incomplete = requestDays({ series: complete.slice(1) }, now);
  assert.ok(incomplete.includes('2026-11-03'));
  assert.equal(incomplete.length, 6);
});

test('three metrics share anonymous day requests, with bounded size/time/retry policy', async () => {
  const calls = [];
  const connector = createConnector({ request: async (url, opts) => {
    calls.push(url); assert.equal(opts.retries, 1); assert.equal(opts.timeoutMs, 20_000);
    return request(url);
  } });
  for (const dataset of DATASETS.filter(d => d.connector === 'elexon-system-prices')){
    const { snapshot } = await connector.fetchDataset({ dataset, now, log: quiet });
    assert.equal(snapshot.series.length, 288);
    assert.equal(verifyContentChecksum(snapshot), true);
    assert.equal(validateSnapshot(snapshot, dataset).ok, true);
    assert.deepEqual(snapshot.units, dataset.id === volume.id ? { energy: 'MWh' } : { price: 'GBP/MWh' });
  }
  assert.equal(calls.length, 6, 'not 18 requests for three copies of DISEBSP');
  await connector.fetchDataset({ dataset: buy, now: '2026-11-06T18:00:00Z', log: quiet });
  assert.equal(calls.length, 12, 'a later run must not reuse stale in-memory responses');
});

test('a 403 or 429 stops new requests across all three metrics in the same run', async () => {
  for (const status of [403, 429]){
    let calls = 0;
    const connector = createConnector({ request: async () => { calls++; throw Object.assign(new Error('unavailable'), { status }); } });
    for (const dataset of [buy, volume]){
      await assert.rejects(connector.fetchDataset({ dataset, now, log: quiet }), /keep last-good/);
    }
    assert.equal(calls, 1);
  }
});

test('the Elexon deadline aborts a stalled body after successful headers', { timeout: 3000 }, async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0, bodyAborts = 0;
  globalThis.fetch = async (url, { signal }) => {
    calls++;
    const body = new ReadableStream({ start(controller){
      signal.addEventListener('abort', () => {
        bodyAborts++;
        controller.error(new DOMException('body cancelled', 'AbortError'));
      }, { once: true });
    } });
    return new Response(body, { status: 200 });
  };
  try {
    const connector = createConnector({ requestTimeoutMs: 10 });
    await assert.rejects(connector.fetchDataset({ dataset: buy, now, log: quiet }), /keep last-good/);
    assert.equal(calls, 6);
    assert.equal(bodyAborts, 6, 'all received-header responses were cancelled, not left hanging');
  } finally { globalThis.fetch = originalFetch; }
});

test('divergent metric histories still share a maximum of six source requests', async () => {
  let calls = 0;
  const connector = createConnector({ request: async url => { calls++; return request(url); } });
  const previous = { series: ['2026-11-03', '2026-11-02', '2026-11-01', '2026-10-31'].flatMap(
    day => parseDay(dayPayload(day), day, SERIES[buy.id])) };
  await connector.fetchDataset({ dataset: buy, previous, now, log: quiet });
  const { snapshot } = await connector.fetchDataset({ dataset: volume, now, log: quiet });
  assert.equal(calls, 6);
  assert.equal(snapshot.series.length, 96, 'cached revision days remain usable; extra backfill waits');
});

test('signed MWh uses strict metric validation without applying a price median ratio', async () => {
  const { snapshot } = await createConnector({ request }).fetchDataset({ dataset: volume, now, log: quiet });
  assert.equal(volume.kind, 'metric');
  const previous = { ...snapshot, series: snapshot.series.map(p => ({ ...p, v: 2 })) };
  const moved = { ...snapshot, series: snapshot.series.map(p => ({ ...p, v: 500 })) };
  assert.equal(validateSnapshot(moved, volume, previous).ok, true);
  for (const bad of [
    { ...snapshot, units: { power: 'MW' } },
    { ...snapshot, series: [...snapshot.series, snapshot.series[0]] },
    { ...snapshot, series: snapshot.series.map((p, i) => i ? p : { ...p, v: null }) },
    { ...snapshot, coverage: { ...snapshot.coverage, resolution: 'PT60M' } },
  ]) assert.equal(validateSnapshot(bad, volume).ok, false);
  assert.equal(validateSnapshot(snapshot, { ...volume, metric: undefined }).ok, false);
  const price = { ...snapshot, datasetId: buy.id, units: { price: 'GBP/MWh' } };
  const priorPrice = { ...price, series: price.series.map(p => ({ ...p, v: 2 })) };
  const priceMove = { ...price, series: price.series.map(p => ({ ...p, v: 500 })) };
  assert.equal(validateSnapshot(priceMove, buy, priorPrice).ok, false, 'old price unit-shift guard is still enforced');
});

test('a partial day does not replace its prior points while other days can advance', async () => {
  const previous = { series: parseDay(dayPayload('2026-11-04', 42), '2026-11-04', SERIES[buy.id]) };
  const connector = createConnector({ request: async url => {
    const payload = dayPayload(dayFromUrl(url));
    if (dayFromUrl(url) === '2026-11-04') payload.data.pop();
    return payload;
  } });
  const { snapshot } = await connector.fetchDataset({ dataset: buy, previous, now, log: quiet });
  assert.equal(snapshot.series.filter(p => p.settlementDate === '2026-11-04').length, 48);
  assert.ok(snapshot.series.filter(p => p.settlementDate === '2026-11-04').every(p => p.v === 42));
  assert.ok(snapshot.series.some(p => p.settlementDate === '2026-11-05'));
});

test('older upstream revisions cannot overwrite newer stored observations', async () => {
  const previous = { series: parseDay(dayPayload('2026-11-04', 42), '2026-11-04', SERIES[buy.id]) };
  previous.series[0].publishedAt = '2026-11-06T02:00:00.000Z';
  const { snapshot } = await createConnector({ request }).fetchDataset({ dataset: buy, previous, now, log: quiet });
  assert.equal(snapshot.series.find(p => p.t === previous.series[0].t).v, 42);
});

test('custom metric summaries label MWh and make no spread/arbitrage claim', async () => {
  const { snapshot } = await createConnector({ request }).fetchDataset({ dataset: volume, now, log: quiet });
  const summary = summarize(snapshot);
  assert.equal(summary.metric.unit, 'MWh');
  assert.equal(summary.metric.quantity, 'energy');
  assert.equal(summary.derived, null);
  assert.equal(summary.arbitrage, null);
  assert.equal(summary.dailyTimezone, 'Europe/London');
  assert.equal(summary.daily[0].netMWh, 480);
  assert.equal(summary.daily[0].expected, 48);
  assert.equal('spread' in summary.daily[0], false);
  assert.throws(() => summarize({ ...snapshot, units: { power: 'MW' } }), /unit mismatch/);
  assert.deepEqual(detectDrift({ results: [{ dataset: volume, snapshot }], markets }).findings, []);
});

test('a later check of identical data does not rewrite the snapshot or custom summary', async () => {
  const connector = createConnector({ request });
  const first = (await connector.fetchDataset({ dataset: volume, now, log: quiet })).snapshot;
  const second = (await connector.fetchDataset({ dataset: volume, now: '2026-11-06T18:00:00.000Z', log: quiet })).snapshot;
  const files = ['gb-elexon-determinism-fixture.json', 'gb-elexon-determinism-fixture.summary.json'].map(f => 'public/data/public/' + f);
  try {
    for (const [i, file] of files.entries()){
      await writeSnapshot(file, i ? summarize(first) : first);
      const bytes = await readFile(path.join(REPO_ROOT, file));
      const result = await writeSnapshot(file, i ? summarize(second) : second);
      assert.equal(result.written, false);
      assert.deepEqual(await readFile(path.join(REPO_ROOT, file)), bytes);
    }
  } finally { for (const file of files) await rm(path.join(REPO_ROOT, file), { force: true }); }
});

test('real executor retains last-good bytes on total source failure and completes another source', async () => {
  const dataset = { ...buy, id: 'gb-elexon-retention-fixture', connector: 'elexon-failure-fixture' };
  const file = snapshotFile(dataset.id);
  const connector = createConnector({ request: async () => { throw new Error('source offline'); } });
  const series = parseDay(dayPayload('2026-11-04'), '2026-11-04', SERIES[buy.id]);
  const previous = buildSnapshot({ dataset, series, units: { price: 'GBP/MWh' }, coverage: { from: series[0].t, to: series.at(-1).t, points: 48, resolution: 'PT30M' }, fetchedAt: now });
  const other = { ...dataset, id: 'gb-elexon-healthy-fixture', connector: 'healthy-fixture', marketId: null };
  try {
    await writeSnapshot(file, previous);
    const bytes = await readFile(path.join(REPO_ROOT, file));
    const { results } = await runSelection({ datasets: [dataset, other], now, dryRun: true, env: {}, log: quiet,
      connectors: {
        'elexon-failure-fixture': { fetchDataset: args => connector.fetchDataset({ ...args, dataset: buy }) },
        'healthy-fixture': { fetchDataset: async () => ({ snapshot: buildSnapshot({ dataset: other, series,
          units: { price: 'GBP/MWh' }, coverage: previous.coverage, fetchedAt: now }) }) },
      },
    });
    assert.deepEqual(results.map(r => r.status), ['fetch-failed', 'dry-run']);
    assert.equal(results[0].snapshot.contentChecksum, previous.contentChecksum);
    assert.deepEqual(await readFile(path.join(REPO_ROOT, file)), bytes);
  } finally { await rm(path.join(REPO_ROOT, file), { force: true }); }
});
