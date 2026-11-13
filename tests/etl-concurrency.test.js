/* ---------------------------------------------------------------------------
   THE ETL POOL.

   These tests exist because concurrency is the kind of change that passes every
   data test and still breaks the pipeline: an unbounded pool floods a
   regulator, a provider limit that is not enforced corrupts Fingrid's spacing
   clock, and a result array assembled in completion order silently reorders the
   drift report. None of those show up in a snapshot diff.

   So the assertions are about the scheduler's contract, then about the executor
   that uses it: bounded in two dimensions, one row per selected dataset in
   catalogue order, a failed dataset that does not take the run down with it, and
   a dry run that writes nothing.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DEFAULT_GLOBAL_LIMIT, MAX_GLOBAL_LIMIT, PROVIDER_LIMITS, PINNED_PROVIDER_LIMITS,
  providerLimit, readConcurrencyConfig, runWithConcurrency,
} from '../etl/lib/concurrency.mjs';
import { runSelection, selectDatasets } from '../etl/run.mjs';
import { buildSnapshot, verifyContentChecksum } from '../etl/lib/envelope.mjs';
import { coverageOf } from '../etl/lib/series.mjs';
import { detectDrift } from '../etl/drift/detect.mjs';
import { markets } from '../src/markets/registry.js';
import { DATASETS, snapshotFile } from '../src/governance/datasets.js';

const REPO = fileURLToPath(new URL('..', import.meta.url));
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/* ---- the pool ------------------------------------------------------------ */

test('the pool never runs more than the global limit, and reaches it', async () => {
  let active = 0, peak = 0;
  const tasks = Array.from({ length: 12 }, (_, i) => ({
    provider: `provider-${i}`,
    run: async () => {
      active += 1;
      peak = Math.max(peak, active);
      await sleep(20);
      active -= 1;
      return i;
    },
  }));

  const { results, maxObserved } = await runWithConcurrency(tasks, { global: 3 });

  assert.equal(peak, 3, 'peak concurrency should equal the limit, not merely stay under it');
  assert.equal(maxObserved, 3, 'the reported high-water mark must be the observed one');
  assert.deepEqual(results.map(r => r.value), tasks.map((_, i) => i), 'results stay in task order');
});

test('a provider limit binds independently of the global limit', async () => {
  let jepxActive = 0, jepxPeak = 0, allActive = 0, allPeak = 0;
  const tasks = Array.from({ length: 6 }, () => ({
    provider: 'jepx',
    run: async () => {
      jepxActive += 1; allActive += 1;
      jepxPeak = Math.max(jepxPeak, jepxActive);
      allPeak = Math.max(allPeak, allActive);
      await sleep(20);
      jepxActive -= 1; allActive -= 1;
    },
  }));

  await runWithConcurrency(tasks, { global: 8, providers: { jepx: 2 } });

  assert.equal(jepxPeak, 2, 'two of six may be in flight for one provider');
  assert.equal(allPeak, 2, 'the provider cap, not the global cap, is the binding limit here');
});

test('a saturated provider does not block a different one', { timeout: 5000 }, async () => {
  const order = [];
  let releaseProvider;
  const providerGate = new Promise(resolve => { releaseProvider = resolve; });
  const slow = provider => ({
    provider,
    run: async () => { await providerGate; order.push(provider); },
  });
  const quick = { provider: 'ecb', run: async () => { order.push('ecb'); releaseProvider(); } };

  /* Three JEPX datasets with a provider cap of one: the naive scheduler would
     block ECB behind the gated provider and fail the test timeout. Explicitly
     release the provider from ECB instead of relying on millisecond timer
     ordering, which is not guaranteed when the event loop is delayed. */
  await runWithConcurrency([slow('jepx'), slow('jepx'), slow('jepx'), quick],
    { global: 4, providers: { jepx: 1 } });

  assert.equal(order[0], 'ecb', `the unblocked provider must finish first, got ${order.join(', ')}`);
  assert.equal(order.length, 4);
});

test('a task that throws is recorded, and the rest still settle', async () => {
  const tasks = [
    { provider: 'a', run: async () => 'ok-1' },
    { provider: 'b', run: async () => { throw new Error('upstream is down'); } },
    { provider: 'c', run: async () => 'ok-2' },
  ];

  const { results } = await runWithConcurrency(tasks, { global: 2 });

  assert.equal(results.length, 3);
  assert.equal(results[0].ok, true);
  assert.equal(results[1].ok, false);
  assert.match(results[1].error.message, /upstream is down/);
  assert.equal(results[2].ok, true);
});

test('an empty task list settles immediately', async () => {
  const { results, maxObserved } = await runWithConcurrency([], { global: 3 });
  assert.deepEqual(results, []);
  assert.equal(maxObserved, 0);
});

/* ---- configuration ------------------------------------------------------- */

test('concurrency defaults are the documented ones', () => {
  assert.equal(DEFAULT_GLOBAL_LIMIT, 3);

  const config = readConcurrencyConfig({});
  assert.equal(config.global, DEFAULT_GLOBAL_LIMIT);
  assert.deepEqual(config.providers, {});
  assert.deepEqual(config.warnings, []);

  /* Provider defaults: one per provider unless a connector documents otherwise. */
  assert.equal(providerLimit('entsoe', {}), 1);
  assert.equal(providerLimit('neso-response', {}), 1);
  assert.equal(providerLimit('jepx', {}), PROVIDER_LIMITS.jepx);
});

test('the environment can raise the global limit, within a ceiling', () => {
  assert.equal(readConcurrencyConfig({ ETL_CONCURRENCY: '5' }).global, 5);
  assert.equal(readConcurrencyConfig({ ETL_CONCURRENCY: '99' }).global, MAX_GLOBAL_LIMIT);

  const capped = readConcurrencyConfig({ ETL_CONCURRENCY: '99' });
  assert.equal(capped.warnings.length, 1, 'a clamped value must be reported');
  assert.match(capped.warnings[0], /ceiling/);
});

test('an invalid setting falls back to the default and says so', () => {
  for (const raw of ['0', '-2', 'three', '1.5']){
    const config = readConcurrencyConfig({ ETL_CONCURRENCY: raw });
    assert.equal(config.global, DEFAULT_GLOBAL_LIMIT, `"${raw}" should not change the limit`);
    assert.equal(config.warnings.length, 1, `"${raw}" should be reported`);
  }
});

test('per-provider overrides are parsed, validated and bounded by the pinned list', () => {
  const config = readConcurrencyConfig(
    { ETL_PROVIDER_CONCURRENCY: 'jepx=2, entsoe=2' },
    { knownProviders: ['jepx', 'entsoe', 'fingrid'] });
  assert.equal(config.providers.jepx, 2);
  assert.equal(config.providers.entsoe, 2);
  assert.deepEqual(config.warnings, []);

  /* Fingrid's limit is a property of the source, not a preference. */
  const pinned = readConcurrencyConfig(
    { ETL_PROVIDER_CONCURRENCY: 'fingrid=6' }, { knownProviders: ['fingrid'] });
  assert.equal(pinned.providers.fingrid, undefined, 'the pinned provider must not be overridden');
  assert.equal(providerLimit('fingrid', pinned.providers), PINNED_PROVIDER_LIMITS.fingrid);
  assert.match(pinned.warnings.join('\n'), /cannot change "fingrid"/);
});

test('an unknown connector or a malformed entry is ignored with a warning', () => {
  const config = readConcurrencyConfig(
    { ETL_PROVIDER_CONCURRENCY: 'nope=2,jepx,entsoe=0,jepx=2=3' },
    { knownProviders: ['jepx', 'entsoe'] });
  assert.deepEqual(config.providers, {});
  assert.equal(config.warnings.length, 4, config.warnings.join('\n'));
});

/* ---- --only -------------------------------------------------------------- */

test('--only selects exactly what it names, in catalogue order', () => {
  const catalogue = DATASETS.slice(0, 4);
  const [a, b, c] = catalogue;

  assert.deepEqual(selectDatasets(catalogue, null).map(d => d.id), catalogue.map(d => d.id));
  assert.deepEqual(selectDatasets(catalogue, `${c.id},${a.id}`).map(d => d.id), [a.id, c.id]);
  assert.deepEqual(selectDatasets(catalogue, ` ${b.id} , `).map(d => d.id), [b.id]);
  assert.deepEqual(selectDatasets(catalogue, 'not-a-dataset'), []);
  assert.deepEqual(selectDatasets(catalogue, '  ').map(d => d.id), catalogue.map(d => d.id),
    'a blank value means everything, as the workflow input documents');
});

/* ---- the executor -------------------------------------------------------- */

const fixtureDataset = (overrides = {}) => ({
  id: 'fx-fixture',
  kind: 'timeseries',
  marketId: null,
  title: ['Fixture', '夹具'],
  connector: 'fixture',
  source: { name: 'Fixture source', url: 'https://example.invalid/fixture', licence: 'test', attribution: 'test' },
  refreshHours: 24,
  staleAfterHours: 96,
  bearsOn: [],
  republishable: true,
  requiresKey: false,
  official: false,
  ...overrides,
});

function fixtureSnapshot(dataset, { points = 48, value = 50, fetchedAt = '2026-11-04T00:00:00.000Z' } = {}){
  const series = Array.from({ length: points }, (_, i) => ({
    t: new Date(Date.UTC(2026, 10, 1, 0, i * 30)).toISOString(),
    v: value + (i % 4),
  }));
  return buildSnapshot({ dataset, series, units: { price: 'EUR/MWh' }, coverage: coverageOf(series, 'PT30M'), fetchedAt });
}

/** A connector that returns a valid snapshot after `delayMs`. */
const okConnector = (delayMs = 0) => ({
  fetchDataset: async ({ dataset }) => {
    if (delayMs) await sleep(delayMs);
    return { snapshot: fixtureSnapshot(dataset) };
  },
});

test('the executor keeps catalogue order when completion order is reversed', async () => {
  /* Distinct connectors, so the three may run at once: sharing one connector
     would be one provider, and the default provider limit of one would settle
     them in catalogue order and prove nothing about ordering. */
  const names = ['a', 'b', 'c'];
  const datasets = names.map(n => fixtureDataset({ id: `fx-${n}`, connector: `fixture-${n}` }));
  const connectors = Object.fromEntries(names.map(n => [`fixture-${n}`, {
    fetchDataset: async ({ dataset }) => {
      /* A finishes last, C first: completion order is the reverse of the
         catalogue, which is exactly the case a completion-ordered array
         would expose. */
      const delay = { 'fx-a': 30, 'fx-b': 15, 'fx-c': 0 }[dataset.id];
      if (delay) await sleep(delay);
      return { snapshot: fixtureSnapshot(dataset) };
    },
  }]));

  const { results, maxObserved } = await runSelection({ datasets, connectors, dryRun: true, env: {} });

  assert.deepEqual(results.map(r => r.dataset.id), ['fx-a', 'fx-b', 'fx-c']);
  assert.deepEqual(results.map(r => r.status), ['dry-run', 'dry-run', 'dry-run']);
  assert.equal(maxObserved, 3, 'the three datasets were genuinely in flight together');
});

test('a dry run validates and writes nothing', async () => {
  const dataset = fixtureDataset({ id: 'fx-dry-run-fixture' });
  const file = path.join(REPO, snapshotFile(dataset.id));
  const summary = path.join(REPO, snapshotFile(dataset.id).replace(/\.json$/, '.summary.json'));

  try {
    const { results } = await runSelection({
      datasets: [dataset], connectors: { fixture: okConnector() }, dryRun: true, env: {},
    });

    assert.equal(results.length, 1);
    assert.equal(results[0].status, 'dry-run');
    assert.ok(results[0].snapshot, 'the validated snapshot is still produced for drift detection');
    assert.equal(existsSync(file), false, 'a dry run must not create a snapshot');
    assert.equal(existsSync(summary), false, 'a dry run must not create a summary');
  } finally {
    rmSync(file, { force: true });
    rmSync(summary, { force: true });
  }
});

test('a failed dataset does not stop the others, and keeps its previous snapshot slot', async () => {
  const datasets = [fixtureDataset({ id: 'fx-ok-1' }), fixtureDataset({ id: 'fx-broken' }), fixtureDataset({ id: 'fx-ok-2' })];
  const connectors = {
    fixture: {
      fetchDataset: async ({ dataset }) => {
        if (dataset.id === 'fx-broken') throw new Error('the source answered 503');
        return { snapshot: fixtureSnapshot(dataset) };
      },
    },
  };

  const { results } = await runSelection({ datasets, connectors, dryRun: true, env: {} });

  assert.deepEqual(results.map(r => r.status), ['dry-run', 'fetch-failed', 'dry-run']);
  assert.match(results[1].error, /503/);
  assert.equal(results[1].snapshot, null, 'no previous file exists, so nothing is carried forward');
});

test('an invalid snapshot is rejected rather than published', async () => {
  const dataset = fixtureDataset({ id: 'fx-invalid' });
  const connectors = {
    fixture: {
      fetchDataset: async ({ dataset }) => {
        const snapshot = fixtureSnapshot(dataset, { points: 4 });
        snapshot.series[2].v = 'not a number';
        snapshot.series[3].v = 'also not a number';
        return { snapshot };
      },
    },
  };

  const { results } = await runSelection({ datasets: [dataset], connectors, dryRun: true, env: {} });

  assert.equal(results[0].status, 'invalid');
  assert.ok(results[0].errors.length >= 1);
  assert.equal(results[0].snapshot, null, 'the previous snapshot is what would be retained');
});

test('the envelope checksum still detects a hand-edited series', () => {
  const dataset = fixtureDataset();
  const snapshot = fixtureSnapshot(dataset);
  assert.equal(verifyContentChecksum(snapshot), true);

  const tampered = { ...snapshot, series: [...snapshot.series.slice(0, -1)] };
  assert.equal(verifyContentChecksum(tampered), false);
});

test('equivalent fixtures produce identical drift input, whatever the timing', async () => {
  /* Two connectors again, so the two runs can genuinely complete in opposite
     orders rather than being serialised by the provider default. */
  const datasets = [
    fixtureDataset({ id: 'fx-drift-a', connector: 'fixture-drift-a', marketId: 'pl', bearsOn: ['economics.merchGross'] }),
    fixtureDataset({ id: 'fx-drift-b', connector: 'fixture-drift-b' }),
  ];

  const runOnce = async (delays) => {
    const fetchDataset = async ({ dataset }) => {
      const delay = delays[dataset.id] ?? 0;
      if (delay) await sleep(delay);
      return { snapshot: fixtureSnapshot(dataset, { points: 48, value: dataset.id.endsWith('a') ? 60 : 40 }) };
    };
    const connectors = { 'fixture-drift-a': { fetchDataset }, 'fixture-drift-b': { fetchDataset } };
    return runSelection({ datasets, connectors, dryRun: true, env: {}, now: '2026-11-04T00:00:00.000Z' });
  };

  const first = await runOnce({ 'fx-drift-a': 25, 'fx-drift-b': 0 });
  const second = await runOnce({ 'fx-drift-a': 0, 'fx-drift-b': 25 });

  assert.deepEqual(
    first.results.map(r => [r.dataset.id, r.status]),
    second.results.map(r => [r.dataset.id, r.status]));

  const driftA = detectDrift({ results: first.results.filter(r => r.snapshot), markets });
  const driftB = detectDrift({ results: second.results.filter(r => r.snapshot), markets });

  assert.equal(JSON.stringify(driftA.findings), JSON.stringify(driftB.findings),
    'drift findings must not depend on which dataset finished first');
});
