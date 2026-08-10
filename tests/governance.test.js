/* ---------------------------------------------------------------------------
   GOVERNANCE TESTS.

   These assert the property the whole live-data design rests on: automation can
   observe, compute and propose, but cannot change a judgement.

   Documentation cannot enforce that. A test can. Each of these fails the build
   on the specific way the guarantee could be eroded by an ordinary,
   well-intentioned change — a new field nobody classified, a connector that
   reaches for fs directly, a threshold quietly widened to nothing.
   --------------------------------------------------------------------------- */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { markets } from '../src/markets/registry.js';
import {
  AUTHORITY, COMPARISON_AUTHORITY, MANIFEST_AUTHORITY, ASSUMPTION_AUTHORITY,
  comparisonAuthority, manifestAuthority, assumptionAuthority,
  canMachineWrite, canMachinePropose, AUTHORITY_LABEL, isClassified,
} from '../src/governance/authority.js';
import { DATASETS, DATASET_KINDS, datasetById, snapshotFile, summaryFile } from '../src/governance/datasets.js';
import {
  classifyDrift, BAND, DRIFT_THRESHOLDS, IMPACT_THRESHOLDS, relativeDelta, impactOf,
} from '../src/governance/materiality.js';
import { ANCHORS, anchorFor } from '../src/governance/anchors.js';
import { derivePriceMetrics, dailySpreadDetail, inferPointsPerHour } from '../src/derive/priceMetrics.js';
import { arbitrageRevenuePerMW, bridgeAgainstAnchor } from '../src/derive/merchantBridge.js';
import { assertWritable, ALLOWED_WRITE_ROOT, BoundaryViolation } from '../etl/lib/boundary.mjs';
import { buildSnapshot, verifyContentChecksum, canonicalize, sha256 } from '../etl/lib/envelope.mjs';
import { validateSnapshot } from '../etl/lib/validate.mjs';
import { mergeSeries, missingDays } from '../etl/lib/series.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');

/* =====================================================================
   1. The wall — automation cannot write outside published data
   ===================================================================== */

test('the ETL write boundary rejects every path outside public/data/public', () => {
  const forbidden = [
    'src/comparison/assumptions.js',
    'src/markets/gb/comparison.js',
    'src/governance/anchors.js',
    'docs/data-policy.md',
    'package.json',
    'public/data/../../src/main.js',
    'public/data/public/../../../src/app/app.js',
  ];

  for (const p of forbidden){
    assert.throws(() => assertWritable(p), BoundaryViolation,
      `expected the boundary to reject "${p}"`);
  }
});

test('the ETL write boundary accepts published-data paths', () => {
  assert.ok(assertWritable('public/data/public/fx-ecb.json').startsWith(ALLOWED_WRITE_ROOT));
  assert.ok(assertWritable(snapshotFile('gb-day-ahead')).startsWith(ALLOWED_WRITE_ROOT));
  assert.ok(assertWritable(summaryFile('gb-day-ahead')).startsWith(ALLOWED_WRITE_ROOT));
});

test('no ETL module writes to the filesystem except through the boundary', async () => {
  /* The boundary is only a boundary if it is the sole exit. A connector that
     imports node:fs directly bypasses every check in this file, so the import
     itself is what is forbidden.

     etl/propose.mjs is the documented exception: it edits analyst files, runs
     only on a branch, and refuses to run on main. See its header. */
  const EXEMPT = new Set(['lib/boundary.mjs', 'propose.mjs', 'run.mjs', 'verify.mjs']);
  const WRITE_APIS = /\b(writeFileSync|writeFile|appendFile|appendFileSync|rmSync|unlinkSync|createWriteStream)\b/;

  const offenders = [];
  for (const rel of await walk(path.join(REPO, 'etl'))){
    const key = path.relative(path.join(REPO, 'etl'), rel).replace(/\\/g, '/');
    if (EXEMPT.has(key)) continue;

    const src = await readFile(rel, 'utf8');
    if (WRITE_APIS.test(src)) offenders.push(key);
  }

  assert.deepEqual(offenders, [],
    'these ETL modules call a filesystem write API directly instead of using etl/lib/boundary.mjs');
});

test('run.mjs and verify.mjs write only to etl/out, never to src/', async () => {
  /* run.mjs legitimately writes the drift report and summary, which live outside
     the snapshot directory. Those writes must stay pointed at etl/out. */
  for (const file of ['run.mjs', 'verify.mjs']){
    const src = await readFile(path.join(REPO, 'etl', file), 'utf8');
    for (const m of src.matchAll(/writeFile\(\s*path\.join\(([^)]*)\)/g)){
      assert.match(m[1], /outDir|REPO_ROOT, 'etl'/,
        `${file}: a writeFile target does not resolve into etl/out — ${m[1]}`);
    }
    assert.ok(!/path\.join\(REPO_ROOT,\s*'src'/.test(src),
      `${file} constructs a path into src/`);
  }
});

test('propose.mjs refuses to run on the default branch', async () => {
  const src = await readFile(path.join(REPO, 'etl', 'propose.mjs'), 'utf8');
  assert.match(src, /assertNotOnDefaultBranch/, 'the guard function must exist');
  assert.match(src, /branch === 'main' \|\| branch === 'master'/, 'both default branch names must be refused');
  assert.match(src, /assertNotOnDefaultBranch\(\);/, 'the guard must actually be called');
});

test('the scheduled workflow never enables auto-merge', async () => {
  const wf = await readFile(path.join(REPO, '.github', 'workflows', 'etl.yml'), 'utf8');

  /* Match the mechanisms, not the words. The file talks about auto-merge at
     length in order to forbid it, so a plain string search finds its own
     documentation and fails — which is how this test failed when first written. */
  const executable = wf
    .split('\n')
    .filter(line => !/^\s*#/.test(line))
    .join('\n');

  const mechanisms = [
    /gh\s+pr\s+merge/,                              // merging from the CLI
    /--auto\b/,                                     // gh pr create/merge --auto
    /enable-pull-request-automerge/,                // the common marketplace action
    /enablePullRequestAutoMerge/,                   // the GraphQL mutation
    /merge_method/,                                 // REST merge via the API
  ];

  for (const m of mechanisms){
    assert.ok(!m.test(executable),
      `the live-data workflow must never merge a proposal itself — found ${m}`);
  }

  assert.match(wf, /needs-analyst-review/, 'proposals must be labelled for review');
});

/* =====================================================================
   2. Classification is exhaustive — nothing reaches production unclassified
   ===================================================================== */

/* Walks to every LEAF, however deep, rather than stopping at the second level.

   The depth matters. A capacity line is declared as its components — a clearing
   price, a de-rating factor, an FX rate, and the prose describing which auction
   they came from — and those do not share an authority class: the first three
   are observations the ETL should notice, the last is analyst prose it must
   never touch. Classifying the CONTAINER would hand the whole object to
   whichever class the container carried, which for `economics.capacity` would
   have meant automation could rewrite the source citation.

   Arrays are leaves. A bilingual label and a fifteen-element decay curve are
   each one decision, not fifteen. */
function leafPaths(obj, prefix, out){
  for (const [key, value] of Object.entries(obj)){
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)){
      leafPaths(value, path, out);
    } else {
      out.push(path);
    }
  }
  return out;
}

test('every field of every market comparison interface is classified', () => {
  const unclassified = [];

  for (const m of markets){
    if (!m.comparison) continue;
    for (const p of leafPaths(m.comparison, '', [])){
      // Classified by an explicit entry OR by a declared rule (assumption-range
      // leaves) — never by falling through to the fail-closed default.
      if (!isClassified(p)) unclassified.push(`${m.manifest.id}: ${p}`);
    }
  }

  assert.deepEqual(unclassified, [],
    'add these to COMPARISON_AUTHORITY in src/governance/authority.js and decide who owns them');
});

test('an assumption range is never classified more permissively than the value it bounds', () => {
  for (const m of markets){
    for (const field of Object.keys(m.comparison.ranges || {})){
      const bounded = comparisonAuthority(`economics.${field}`);
      assert.equal(comparisonAuthority(`ranges.${field}.seed`), bounded,
        `${m.manifest.id}: ranges.${field}.seed must inherit from economics.${field}`);
      // A citation stays out of automation's reach whatever it cites.
      assert.ok(!canMachinePropose(comparisonAuthority(`ranges.${field}.source`)),
        `${m.manifest.id}: ranges.${field}.source must not be proposable`);
      assert.ok(!canMachinePropose(comparisonAuthority(`ranges.${field}.basis`)),
        `${m.manifest.id}: ranges.${field}.basis must not be proposable`);
    }
  }
});

test('a nested field is classified in its own right, not by its container', () => {
  // The container itself is deliberately absent, so a caller asking about it
  // fails closed at METHODOLOGY rather than inheriting a permissive child.
  assert.equal('economics.capacity' in COMPARISON_AUTHORITY, false);
  assert.equal(comparisonAuthority('economics.capacity'), AUTHORITY.METHODOLOGY);

  // …while the components carry genuinely different classes.
  assert.equal(comparisonAuthority('economics.capacity.price'), AUTHORITY.ANALYST);
  assert.equal(comparisonAuthority('economics.capacity.derating'), AUTHORITY.ANALYST);
  assert.equal(comparisonAuthority('economics.capacity.source'), AUTHORITY.METHODOLOGY);
  assert.ok(!canMachinePropose(comparisonAuthority('economics.capacity.source')),
    'automation must not be able to propose a change to a source citation');
});

test('every manifest field in use is classified', () => {
  const unclassified = new Set();
  for (const m of markets){
    for (const field of Object.keys(m.manifest)){
      if (!(field in MANIFEST_AUTHORITY)) unclassified.add(field);
    }
  }
  assert.deepEqual([...unclassified], []);
});

test('an unclassified path fails closed, at the most restrictive class', () => {
  // The default must be METHODOLOGY: unknown means untouchable, not writable.
  assert.equal(comparisonAuthority('economics.somethingBrandNew'), AUTHORITY.METHODOLOGY);
  assert.equal(manifestAuthority('newField'), AUTHORITY.METHODOLOGY);
  assert.equal(assumptionAuthority('NEW_CONSTANT'), AUTHORITY.METHODOLOGY);

  assert.equal(canMachineWrite(AUTHORITY.METHODOLOGY), false);
  assert.equal(canMachinePropose(AUTHORITY.METHODOLOGY), false);
});

test('the judgement fields the analyst reserved are methodology, not analyst', () => {
  /* These are the specific things automation must never touch, not even as a
     proposal: scoring, thesis, market status, house view. */
  assert.equal(comparisonAuthority('score.composite'), AUTHORITY.METHODOLOGY);
  assert.equal(comparisonAuthority('score.connectionRisk'), AUTHORITY.METHODOLOGY);
  assert.equal(comparisonAuthority('narrative.thesis'), AUTHORITY.METHODOLOGY);
  assert.equal(comparisonAuthority('narrative.archetype'), AUTHORITY.METHODOLOGY);
  assert.equal(manifestAuthority('status'), AUTHORITY.METHODOLOGY);
  assert.equal(comparisonAuthority('economics.auctionRenewalCurve'), AUTHORITY.METHODOLOGY);

  for (const p of ['score.composite', 'narrative.thesis', 'economics.auctionRenewalCurve']){
    assert.equal(canMachinePropose(comparisonAuthority(p)), false, `${p} must not be proposable`);
  }
  assert.equal(canMachinePropose(manifestAuthority('status')), false);
});

test('discount rates and the comparison window are beyond even proposal', () => {
  for (const k of ['LIFE', 'EXIT_Y_CONTRACTED', 'EXIT_Y_MERCHANT', 'EXIT_Y_OPEX', 'EXIT_Y_AUCTION', 'UNLEVERED']){
    assert.equal(assumptionAuthority(k), AUTHORITY.METHODOLOGY, `${k} must be methodology`);
    assert.equal(canMachinePropose(assumptionAuthority(k)), false);
  }
});

/* The sponsor position is not an observation. It reaches every published return
   on the platform, so it is classified explicitly rather than falling through
   assumptionAuthority()'s METHODOLOGY default — an entry that is present can be
   reviewed, and a default cannot be. */
test('the sponsor underwriting position is declared, not defaulted', () => {
  for (const k of ['OEM_CAPEX_MULTIPLIER', 'SPONSOR_DISCOUNT_DELTA_PP']){
    assert.ok(Object.hasOwn(ASSUMPTION_AUTHORITY, k), `${k} must be declared in ASSUMPTION_AUTHORITY`);
    assert.equal(assumptionAuthority(k), AUTHORITY.METHODOLOGY, `${k} must be methodology`);
    assert.equal(canMachinePropose(assumptionAuthority(k)), false);
  }
});

test('nothing anywhere is machine-writable except observed and derived', () => {
  const all = [
    ...Object.values(COMPARISON_AUTHORITY),
    ...Object.values(MANIFEST_AUTHORITY),
    ...Object.values(ASSUMPTION_AUTHORITY),
  ];
  for (const a of all){
    assert.equal(canMachineWrite(a), false,
      `no configured field may be machine-writable — found ${a}`);
  }
});

test('every authority class has a bilingual label', () => {
  for (const a of Object.values(AUTHORITY)){
    const label = AUTHORITY_LABEL[a];
    assert.ok(Array.isArray(label) && label.length === 2 && label[0] && label[1],
      `authority "${a}" needs an [en, zh] label`);
  }
});

/* =====================================================================
   3. The dataset catalogue
   ===================================================================== */

test('every dataset is well formed and points at a real market', () => {
  const ids = new Set();
  for (const d of DATASETS){
    assert.ok(/^[a-z0-9-]+$/.test(d.id), `dataset id "${d.id}" must be URL-safe`);
    assert.ok(!ids.has(d.id), `duplicate dataset id "${d.id}"`);
    ids.add(d.id);

    assert.ok(Array.isArray(d.title) && d.title.length === 2, `${d.id}: title must be [en, zh]`);
    assert.ok(d.source?.name && d.source?.url, `${d.id}: source needs a name and a URL`);
    assert.ok(d.source.licence, `${d.id}: an unlicensed source cannot be republished`);
    assert.ok(d.refreshHours > 0 && d.staleAfterHours >= d.refreshHours,
      `${d.id}: staleAfterHours must be at least refreshHours`);
    assert.equal(datasetById(d.id), d);

    if (d.marketId){
      assert.ok(markets.some(m => m.manifest.id === d.marketId),
        `${d.id}: marketId "${d.marketId}" is not in the registry`);
    }
  }
});

test('every path a dataset claims to bear on is a classified, proposable field', () => {
  for (const d of DATASETS){
    for (const p of d.bearsOn){
      const authority = p.startsWith('FX.') ? assumptionAuthority(p) : comparisonAuthority(p);
      assert.notEqual(authority, undefined);
      assert.ok(canMachinePropose(authority),
        `${d.id} claims to bear on "${p}", which is ${authority} — automation could never act on it`);
    }
  }
});

test('a non-republishable dataset cannot carry a raw series', () => {
  const licensed = {
    id: 'licensed-test', marketId: null, title: ['t', 't'], connector: 'x',
    source: { name: 'n', url: 'u', licence: 'restricted' },
    refreshHours: 24, staleAfterHours: 96, bearsOn: [], republishable: false, requiresKey: false,
  };
  assert.throws(
    () => buildSnapshot({
      dataset: licensed,
      coverage: { from: null, to: null, resolution: 'P1D', points: 1 },
      units: { price: 'X' },
      series: [{ t: '2026-01-01T00:00:00Z', v: 1 }],
    }),
    /republishable:false/);
});

/* =====================================================================
   4. Materiality — the escalation rule
   ===================================================================== */

test('drift inside the noise floor is not reported at all', () => {
  const d = classifyDrift('FX.GBP', 1.27, 1.28, null);   // +0.8%, floor 2%
  assert.equal(d.band, BAND.NOISE);
});

test('drift above the ceiling is material even with no modelled impact', () => {
  const d = classifyDrift('FX.GBP', 1.27, 1.45, null);   // +14%, ceiling 8%
  assert.equal(d.band, BAND.MATERIAL);
});

test('drift between floor and ceiling escalates only on downstream impact', () => {
  const between = classifyDrift('economics.merchGross', 100000, 108000, null);
  assert.equal(between.band, BAND.REPORTABLE, 'no impact supplied → must not escalate');

  const withImpact = classifyDrift('economics.merchGross', 100000, 108000, {
    breached: true,
    moves: [{ metric: 'irrExit', approved: 0.12, proposed: 0.131, delta: 0.011, threshold: 0.005 }],
  });
  assert.equal(withImpact.band, BAND.MATERIAL);

  const belowImpact = classifyDrift('economics.merchGross', 100000, 108000, { breached: false, moves: [] });
  assert.equal(belowImpact.band, BAND.REPORTABLE);
});

test('a zero or non-numeric approved value never produces an infinite drift', () => {
  assert.equal(relativeDelta(0, 5), null);
  assert.equal(relativeDelta(NaN, 5), null);
  assert.equal(relativeDelta(1, Infinity), null);
  assert.equal(relativeDelta(1, 'x'), null);

  const d = classifyDrift('economics.merchGross', 0, 5000, null);
  assert.equal(d.band, BAND.REPORTABLE, 'incomparable values are reported, never escalated');
});

test('every declared threshold is a sane, non-vacuous band', () => {
  for (const [path, t] of Object.entries(DRIFT_THRESHOLDS)){
    assert.ok(t.floor > 0, `${path}: a zero floor would report every rounding difference`);
    assert.ok(t.ceiling >= t.floor, `${path}: ceiling must not sit below the floor`);
    assert.ok(t.ceiling <= 1, `${path}: a ceiling above 100% would never fire`);
  }
  for (const [metric, v] of Object.entries(IMPACT_THRESHOLDS)){
    assert.ok(v > 0, `${metric}: a zero impact threshold escalates everything`);
  }
});

test('impact comparison ignores unavailable cases rather than inventing a move', () => {
  assert.equal(impactOf(null, {}).breached, false);
  assert.equal(impactOf({ na: ['x', 'x'] }, { irrExit: 0.5 }).breached, false);
  assert.equal(impactOf({ irrExit: 0.1 }, { irrExit: 0.1002 }).breached, false);
  assert.equal(impactOf({ irrExit: 0.1 }, { irrExit: 0.12 }).breached, true);
});

/* =====================================================================
   5. The envelope and validation
   ===================================================================== */

const testDataset = () => ({
  id: 'test-set', kind: 'timeseries', marketId: 'gb', title: ['T', 'T'], connector: 'x',
  source: { name: 'Src', url: 'https://example.invalid/', licence: 'open', attribution: 'a' },
  refreshHours: 6, staleAfterHours: 48, bearsOn: [], republishable: true, requiresKey: false,
});

const testFeedDataset = () => ({
  id: 'test-feed', kind: 'feed', marketId: null, title: ['T', 'T'], connector: 'x',
  source: { name: 'Src', url: 'https://example.invalid/', licence: 'open', attribution: 'a' },
  refreshHours: 24, staleAfterHours: 168, bearsOn: [], republishable: true, requiresKey: false,
});

const feedItems = (n) => Array.from({ length: n }, (_, i) => ({
  t: new Date(Date.UTC(2026, 0, 1) + i * 3600_000).toISOString(),
  id: `Publisher:https://example.invalid/${i}`,
  source: 'Publisher',
  title: `Headline ${i}`,
  url: `https://example.invalid/${i}`,
  category: 'grid',
  categoryLabel: 'Grid & markets',
  summary: 'excerpt',
}));

const feedSnapshot = (items, dataset = testFeedDataset()) => buildSnapshot({
  dataset,
  coverage: { from: items[0]?.t ?? null, to: items.at(-1)?.t ?? null, resolution: 'event', points: items.length },
  units: { record: 'published article metadata' },
  series: items,
});

const series = (n, base = 50) => Array.from({ length: n }, (_, i) => ({
  t: new Date(Date.UTC(2026, 0, 1) + i * 3600_000).toISOString(),
  v: base + Math.sin(i / 3) * 20,
}));

test('a snapshot verifies against its own content checksum', () => {
  const s = buildSnapshot({
    dataset: testDataset(),
    coverage: { from: null, to: null, resolution: 'PT60M', points: 24 },
    units: { price: 'GBP/MWh' },
    series: series(24),
  });
  assert.ok(verifyContentChecksum(s));
});

test('editing a published value breaks the checksum', () => {
  const s = buildSnapshot({
    dataset: testDataset(),
    coverage: { from: null, to: null, resolution: 'PT60M', points: 24 },
    units: { price: 'GBP/MWh' },
    series: series(24),
  });
  s.series[5].v = 999;
  assert.equal(verifyContentChecksum(s), false,
    'a hand-edited observed value must not survive verification');
});

test('the content checksum ignores fetch time, so an unchanged run is not a change', () => {
  const args = {
    dataset: testDataset(),
    coverage: { from: null, to: null, resolution: 'PT60M', points: 24 },
    units: { price: 'GBP/MWh' },
    series: series(24),
  };
  const a = buildSnapshot({ ...args, fetchedAt: '2026-01-01T00:00:00.000Z' });
  const b = buildSnapshot({ ...args, fetchedAt: '2026-06-01T12:00:00.000Z' });

  assert.equal(a.contentChecksum, b.contentChecksum, 'same data must hash the same');
  assert.notEqual(a.envelopeChecksum, b.envelopeChecksum, 'the envelope hash should still differ');
});

test('canonicalization makes key order irrelevant to the hash', () => {
  assert.equal(sha256({ a: 1, b: { c: 2, d: 3 } }), sha256({ b: { d: 3, c: 2 }, a: 1 }));
  assert.deepEqual(canonicalize({ b: 1, a: 2 }), { a: 2, b: 1 });
});

test('validation refuses an empty series rather than publishing a zero', () => {
  const d = testDataset();
  const s = buildSnapshot({
    dataset: d, coverage: { from: null, to: null, resolution: 'PT60M', points: 0 },
    units: { price: 'GBP/MWh' }, series: [],
  });
  const r = validateSnapshot(s, d, null);
  assert.equal(r.ok, false);
  assert.match(r.errors.join(' '), /empty/);
});

test('validation catches an upstream unit change disguised as a price move', () => {
  const d = testDataset();
  const cov = (n) => ({ from: null, to: null, resolution: 'PT60M', points: n });

  const previous = buildSnapshot({ dataset: d, coverage: cov(24), units: { price: 'GBP/MWh' }, series: series(24, 50) });
  // Same shape, same units label, values 100x larger — the classic p/kWh switch.
  const next = buildSnapshot({ dataset: d, coverage: cov(24), units: { price: 'GBP/MWh' }, series: series(24, 5000) });

  const r = validateSnapshot(next, d, previous);
  assert.equal(r.ok, false);
  assert.match(r.errors.join(' '), /unit change/);
});

test('validation refuses a silent change of declared units', () => {
  const d = testDataset();
  const cov = (n) => ({ from: null, to: null, resolution: 'PT60M', points: n });
  const previous = buildSnapshot({ dataset: d, coverage: cov(24), units: { price: 'GBP/MWh' }, series: series(24) });
  const next = buildSnapshot({ dataset: d, coverage: cov(24), units: { price: 'GBp/kWh' }, series: series(24) });

  const r = validateSnapshot(next, d, previous);
  assert.equal(r.ok, false);
  assert.match(r.errors.join(' '), /units changed/);
});

test('validation rejects an out-of-order or malformed series', () => {
  const d = testDataset();
  const bad = buildSnapshot({
    dataset: d, coverage: { from: null, to: null, resolution: 'PT60M', points: 3 },
    units: { price: 'GBP/MWh' },
    series: [
      { t: '2026-01-01T02:00:00Z', v: 10 },
      { t: '2026-01-01T01:00:00Z', v: 11 },
      { t: '2026-01-01T03:00:00Z', v: 12 },
    ],
  });
  const r = validateSnapshot(bad, d, null);
  assert.equal(r.ok, false);
  assert.match(r.errors.join(' '), /chronologically/);
});

/* ---- feed datasets ------------------------------------------------------
   industry-news was published for weeks in a shape no catalogue entry
   described, so etl:verify called it an orphan on every run and the failure
   became background noise. These pin the contract that replaced it. */

test('every dataset declares a kind the validator knows how to check', () => {
  for (const d of DATASETS){
    assert.ok(DATASET_KINDS.includes(d.kind),
      `${d.id}: kind "${d.kind}" is not one of ${DATASET_KINDS.join(', ')}. ` +
      'An undeclared kind is how a snapshot ends up unverifiable.');
  }
});

test('a feed bears on nothing — a headline is context, never evidence', () => {
  for (const d of DATASETS.filter(x => x.kind === 'feed')){
    assert.deepEqual(d.bearsOn, [],
      `${d.id}: a feed cannot inform an approved assumption. Non-empty bearsOn would ` +
      'let trade press open a drift proposal against the model.');
  }
});

test('a well-formed feed passes the checks that reject a price series', () => {
  const r = validateSnapshot(feedSnapshot(feedItems(5)), testFeedDataset(), null);
  assert.deepEqual(r.errors, []);
  assert.equal(r.ok, true);
});

test('feed validation rejects a relative link, a missing title and a duplicate id', () => {
  const items = feedItems(4);
  items[0].url = '/relative/path';
  items[1].title = '';
  items[3].id = items[2].id;

  const r = validateSnapshot(feedSnapshot(items), testFeedDataset(), null);
  assert.equal(r.ok, false);
  const text = r.errors.join(' ');
  assert.match(text, /absolute source URL/);
  assert.match(text, /no title/);
  assert.match(text, /repeats id/);
});

test('feed validation rejects an item dated in the future', () => {
  const items = feedItems(3);
  items[2].t = new Date(Date.now() + 7 * 24 * 3600_000).toISOString();

  const r = validateSnapshot(feedSnapshot(items), testFeedDataset(), null);
  assert.equal(r.ok, false);
  assert.match(r.errors.join(' '), /dated in the future/);
});

test('feed validation still enforces chronological order', () => {
  const items = feedItems(3);
  [items[0].t, items[1].t] = [items[1].t, items[0].t];

  const r = validateSnapshot(feedSnapshot(items), testFeedDataset(), null);
  assert.equal(r.ok, false);
  assert.match(r.errors.join(' '), /chronologically/);
});

test('the price checks never run against a feed', () => {
  /* The regression this guards: feed items have no numeric `v`, so the
     timeseries path would reject all of them as malformed points. */
  const r = validateSnapshot(feedSnapshot(feedItems(5)), testFeedDataset(), null);
  assert.doesNotMatch(r.errors.join(' '), /finite number|plausible bounds/);
});

/* =====================================================================
   6. Derived calculations — deterministic and honest about absence
   ===================================================================== */

test('the same input always produces the same derived metrics', () => {
  const s = series(24 * 40);
  const a = derivePriceMetrics(s, { timezone: 'Europe/London', durationHours: 2 });
  const b = derivePriceMetrics(s, { timezone: 'Europe/London', durationHours: 2 });
  assert.deepEqual(a, b);
});

test('the duration spread uses the mean of the best hours, not the single peak', () => {
  // Four hourly points: 10, 20, 80, 90. A 1h battery captures 90-10 = 80.
  // A 2h battery captures mean(80,90) - mean(10,20) = 85 - 15 = 70.
  const day = [10, 20, 80, 90].map((v, i) => ({ t: `2026-01-01T0${i}:00:00Z`, v, ms: i }));
  assert.equal(dailySpreadDetail(day, 1, 1).spread, 80);
  assert.equal(dailySpreadDetail(day, 2, 1).spread, 70);
  // Cannot both charge and discharge for 3h out of 4 hourly points.
  assert.equal(dailySpreadDetail(day, 3, 1), null);
});

test('resolution is inferred from the data, not assumed', () => {
  const halfHourly = Array.from({ length: 10 }, (_, i) => ({ ms: i * 1800_000 }));
  const hourly = Array.from({ length: 10 }, (_, i) => ({ ms: i * 3600_000 }));
  assert.equal(inferPointsPerHour(halfHourly), 2);
  assert.equal(inferPointsPerHour(hourly), 1);
});

test('an empty or unusable series yields nulls, never zeros', () => {
  const m = derivePriceMetrics([], { timezone: 'Europe/London', durationHours: 2 });
  assert.equal(m.mean, null);
  assert.equal(m.spreadMean, null);
  assert.equal(m.points, 0);
  assert.equal(arbitrageRevenuePerMW(m), null);
});

test('the arbitrage bridge refuses too short a window', () => {
  const short = derivePriceMetrics(series(24 * 10), { timezone: 'UTC', durationHours: 2 });
  assert.equal(arbitrageRevenuePerMW(short), null, 'ten days must not produce an annualised figure');

  const long = derivePriceMetrics(series(24 * 60), { timezone: 'UTC', durationHours: 2 });
  assert.ok(arbitrageRevenuePerMW(long), 'sixty days should be enough');
});

test('the arbitrage bridge charges the efficiency loss on the charge leg', () => {
  const m = { chargeMean: 20, dischargeMean: 100, durationHours: 2, spreadDays: 60 };
  const arb = arbitrageRevenuePerMW(m);
  // 2 x (100 - 20/0.85) = 2 x (100 - 23.529…) = 152.94…, NOT 2 x 80 x 0.85 = 136.
  assert.ok(Math.abs(arb.marginPerCycle - 152.94) < 0.1,
    `expected ~152.94 per cycle, got ${arb.marginPerCycle}`);
});

test('a negative arbitrage margin is reported, not floored at zero', () => {
  // Spread narrower than round-trip losses: a real and important market state.
  const arb = arbitrageRevenuePerMW({ chargeMean: 100, dischargeMean: 105, durationHours: 2, spreadDays: 60 });
  assert.ok(arb.revenuePerMW < 0, 'a loss-making spread must show as negative');
});

test('the bridge proposes nothing without an analyst-set anchor', () => {
  const r = bridgeAgainstAnchor(50000, null, 73145);
  assert.equal(r.computable, false);
  assert.equal(r.impliedMerchGross, null);
  assert.match(r.reason[0], /anchor/i);
});

test('the bridge applies anchor movement as a ratio, not as a level', () => {
  const r = bridgeAgainstAnchor(48600, { value: 41200, asOf: '2026-01-01', windowDays: 365 }, 73145);
  assert.equal(r.computable, true);
  assert.ok(Math.abs(r.ratio - 1.1796) < 0.001);
  // The proposal scales the analyst's own figure; it never substitutes the index.
  assert.ok(Math.abs(r.impliedMerchGross - 73145 * r.ratio) < 0.01);
  assert.ok(r.impliedMerchGross > 73145);
});

/* =====================================================================
   7. Rolling window maintenance
   ===================================================================== */

test('merging is idempotent and lets a restated value win', () => {
  const a = [{ t: '2026-01-01T00:00:00.000Z', v: 1 }, { t: '2026-01-01T01:00:00.000Z', v: 2 }];
  const now = '2026-01-02T00:00:00.000Z';

  assert.deepEqual(mergeSeries(a, a, { now }), a, 'merging a series with itself must not duplicate');

  const restated = [{ t: '2026-01-01T01:00:00.000Z', v: 99 }];
  const merged = mergeSeries(a, restated, { now });
  assert.equal(merged.length, 2);
  assert.equal(merged[1].v, 99, 'the newer value must replace the older');
});

test('merging trims to the trailing window and keeps chronological order', () => {
  const now = '2026-06-01T00:00:00.000Z';
  const old = [{ t: '2024-01-01T00:00:00.000Z', v: 1 }];
  const recent = [
    { t: '2026-05-30T00:00:00.000Z', v: 3 },
    { t: '2026-05-29T00:00:00.000Z', v: 2 },
  ];
  const merged = mergeSeries(old, recent, { windowDays: 365, now });

  assert.equal(merged.length, 2, 'the two-year-old point must be trimmed');
  assert.ok(Date.parse(merged[0].t) < Date.parse(merged[1].t), 'result must be sorted');
});

test('backfill asks for the most recent missing days first, within the cap', () => {
  const now = '2026-06-10T00:00:00.000Z';
  const days = missingDays([], { windowDays: 365, maxDays: 5, now });
  assert.equal(days.length, 5);
  assert.deepEqual(days, ['2026-06-09', '2026-06-08', '2026-06-07', '2026-06-06', '2026-06-05']);
});

/* =====================================================================
   8. Anchors
   ===================================================================== */

test('anchors are analyst-shaped and complete when present', () => {
  for (const [marketId, byPath] of Object.entries(ANCHORS)){
    assert.ok(markets.some(m => m.manifest.id === marketId), `anchor for unknown market "${marketId}"`);
    for (const [p, anchor] of Object.entries(byPath)){
      assert.equal(typeof anchor.value, 'number', `${marketId}/${p}: value must be a number`);
      assert.ok(Number.isFinite(anchor.value) && anchor.value !== 0, `${marketId}/${p}: value must be non-zero and finite`);
      assert.match(anchor.asOf, /^\d{4}-\d{2}-\d{2}$/, `${marketId}/${p}: asOf must be an ISO date`);
      assert.ok(anchor.note, `${marketId}/${p}: an anchor without a note cannot be reviewed later`);
      assert.ok(anchor.windowDays > 0, `${marketId}/${p}: windowDays is needed for the seasonality guard`);
      assert.equal(anchorFor(marketId, p), anchor);
    }
  }
});

test('an absent anchor resolves to null rather than throwing', () => {
  assert.equal(anchorFor('gb', 'economics.nonexistent'), null);
  assert.equal(anchorFor('not-a-market', 'economics.merchGross'), null);
});

/* ---- helpers ------------------------------------------------------------- */

async function walk(dir){
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })){
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()){
      if (entry.name === 'out' || entry.name === 'node_modules') continue;
      out.push(...await walk(full));
    } else if (/\.m?js$/.test(entry.name)){
      out.push(full);
    }
  }
  return out;
}
