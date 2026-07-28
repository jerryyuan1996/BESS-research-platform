/* Registry integrity.

   This is the test that protects the "how do I add Japan?" property: if a market
   is registered with a malformed manifest or an incomplete comparison interface,
   the failure shows up here rather than as a wrong number on the home page. */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  markets, byId, bySlug, marketIds, comparableMarkets,
  ALLOCATION_MARKETS, DETAIL_DASHBOARDS,
} from '../src/markets/registry.js';
import { validateMarket, validateRegistry } from '../src/utils/validation.js';
import { REQUIRED_MANIFEST_FIELDS, METADATA_FIELDS } from '../src/markets/schema.js';
import { FX } from '../src/comparison/assumptions.js';
import { supportedStrategies, baseStrategy, STRATEGIES } from '../src/comparison/strategies.js';

test('the registry contains every allocation market', () => {
  assert.deepEqual(marketIds(), ['wa', 'gb', 'ie', 'ro', 'pl', 'jp_tokyo', 'jp_kyushu', 'jp_hokkaido']);
});

test('allocation markets and detail dashboards are counted separately', () => {
  // Three Japan allocation points share one research dashboard.
  assert.equal(ALLOCATION_MARKETS().length, 8);
  assert.equal(DETAIL_DASHBOARDS().length, 6);
  const jp = ALLOCATION_MARKETS().filter(m => m.manifest.dashboardId === 'jp');
  assert.equal(jp.length, 3);
  assert.deepEqual(jp.map(m => m.manifest.region), ['tokyo', 'kyushu', 'hokkaido']);
  // All three resolve to the same dashboard function.
  assert.equal(new Set(jp.map(m => m.dashboard)).size, 1);
});

test('the whole registry validates', () => {
  const problems = validateRegistry(markets);
  assert.deepEqual(problems, [], problems.join('\n'));
});

test('market ids and slugs are unique', () => {
  assert.equal(new Set(markets.map(m => m.manifest.id)).size, markets.length);
  assert.equal(new Set(markets.map(m => m.manifest.slug)).size, markets.length);
});

test('every market has all required manifest fields', () => {
  for (const m of markets){
    for (const f of REQUIRED_MANIFEST_FIELDS){
      assert.ok(m.manifest[f] !== undefined && m.manifest[f] !== null && m.manifest[f] !== '',
        `${m.manifest.id}: manifest.${f} missing`);
    }
  }
});

test('freshness metadata keys are present, even when the value is null', () => {
  for (const m of markets){
    for (const f of METADATA_FIELDS){
      assert.ok(f in m.manifest, `${m.manifest.id}: manifest.${f} key absent`);
    }
  }
});

test('every market currency has an FX rate, so every market can be normalized', () => {
  for (const m of markets){
    assert.ok(FX[m.manifest.currency] > 0, `${m.manifest.id}: no FX rate for ${m.manifest.currency}`);
  }
});

test('byId and bySlug resolve, and miss cleanly', () => {
  assert.equal(byId('wa').manifest.slug, 'western-australia');
  assert.equal(bySlug('western-australia').manifest.id, 'wa');
  assert.equal(byId('nope'), null);
  assert.equal(bySlug('nope'), null);
});

test('every registered market is comparable', () => {
  assert.equal(comparableMarkets().length, markets.length);
});

test('capability flags match the economics that back them', () => {
  // Prototype: `if (!e.contracted) return na` for capacity, `if (!e.toll)` for tolling.
  // An auction-renewal market backs the same flag with securedContracted instead.
  for (const m of markets){
    const e = m.comparison.economics, c = m.comparison.capabilities;
    const capBacking = e.riskClass === 'auction-renewal' ? e.securedContracted : e.contracted;
    assert.equal(Boolean(c.capacityMarket), Boolean(capBacking),
      `${m.manifest.id}: capacityMarket flag disagrees with its backing revenue field`);
    assert.equal(Boolean(c.tolling), Boolean(e.toll),
      `${m.manifest.id}: tolling flag disagrees with the presence of a toll`);
  }
});

test('supported strategies match the prototype: RO has no capacity, only GB has a toll', () => {
  const ids = (m) => supportedStrategies(m).map(s => s.id);
  assert.deepEqual(ids(byId('wa')), ['cap', 'mer']);
  assert.deepEqual(ids(byId('gb')), ['cap', 'mer', 'toll']);
  assert.deepEqual(ids(byId('ie')), ['cap', 'mer']);
  assert.deepEqual(ids(byId('ro')), ['mer']);
  assert.deepEqual(ids(byId('pl')), ['cap', 'mer']);
});

test('base strategies: capacity-backed everywhere a capacity mechanism exists', () => {
  assert.deepEqual(markets.map(m => baseStrategy(m)),
    ['cap', 'cap', 'cap', 'mer', 'cap', 'cap', 'cap', 'cap']);
});

test('every market exposes the full module surface', () => {
  for (const m of markets){
    const id = m.manifest.id;
    assert.equal(typeof m.dashboard, 'function', `${id}: no dashboard`);
    assert.ok(Array.isArray(m.tabs) && m.tabs.length > 0, `${id}: no tabs`);
    assert.ok(m.sources && Object.keys(m.sources).length > 0, `${id}: empty source register`);
  }
});

test('every dashboard has twelve tabs', () => {
  for (const m of markets){
    assert.equal(m.tabs.length, 12, `${m.manifest.id} tab count`);
  }
});

test('auction-renewal markets separate secured revenue from assumed renewals', () => {
  const jp = markets.filter(m => m.comparison.economics.riskClass === 'auction-renewal');
  assert.equal(jp.length, 3, 'the three Japan markets use the auction-renewal class');
  for (const m of jp){
    const e = m.comparison.economics;
    const id = m.manifest.id;
    assert.equal(e.contracted, undefined, `${id}: must not carry a legacy contracted field`);
    assert.ok(e.securedContracted > 0, `${id}: needs a positive secured payment`);
    assert.equal(e.securedContractYears, 1, `${id}: the main auction secures one delivery year`);
    assert.ok(Array.isArray(e.auctionRenewalCurve) && e.auctionRenewalCurve.length === 14,
      `${id}: renewal curve must cover years 2-15`);
    // Renewal must be a haircut to the secured level, never an escalation.
    assert.ok(e.auctionRenewalCurve.every(v => v < e.securedContracted),
      `${id}: renewal payments must sit below the secured payment`);
    assert.ok(e.auctionRenewalCurve[13] < e.auctionRenewalCurve[0],
      `${id}: renewal curve must decline`);
    // LTDA is a project award, not a market benchmark.
    assert.equal(m.comparison.capabilities.longTermAward, false,
      `${id}: LTDA must stay out of the market base case`);
  }
});

test('tab ids are URL-safe and unique within a market', () => {
  for (const m of markets){
    const ids = m.tabs.map(([id]) => id);
    assert.equal(new Set(ids).size, ids.length, `${m.manifest.id}: duplicate tab id`);
    for (const id of ids){
      assert.match(id, /^[a-z0-9-]+$/, `${m.manifest.id}: tab id "${id}" is not URL-safe`);
    }
  }
});

test('freshness metadata is populated now that every dashboard is migrated', () => {
  for (const m of markets){
    for (const f of ['asOf', 'dataDate', 'modelVersion', 'lastVerified']){
      assert.ok(m.manifest[f], `${m.manifest.id}: manifest.${f} is still null`);
    }
    assert.match(m.manifest.asOf, /^\d{4}-\d{2}-\d{2}$/, `${m.manifest.id}: asOf format`);
  }
});

test('every market keeps its source register next to the market', () => {
  for (const m of markets){
    for (const [key, s] of Object.entries(m.sources)){
      const at = `${m.manifest.id}.sources.${key}`;
      assert.ok(s.file, `${at}: no file name`);
      assert.ok(Array.isArray(s.status) && s.status.length === 2, `${at}: status is not an [en, zh] pair`);
      assert.ok(s.date, `${at}: no source date`);
      assert.ok('url' in s, `${at}: url key absent (use '' for a source with no public link)`);
    }
  }
});

// ---- the scalability acceptance test ------------------------------------------

test('a brand-new market participates with only a manifest and a comparison interface', () => {
  const japan = {
    manifest: {
      id: 'jp', slug: 'japan', flag: '🇯🇵',
      shortName: ['JP', '日本'], name: ['Japan', '日本'],
      currency: 'EUR', currencySymbol: '€', locale: 'ja-JP', timezone: 'Asia/Tokyo',
      status: ['Watch', '观察'], color: 'var(--s7)',
      asOf: null, dataDate: null, modelVersion: null, lastVerified: null, sourceHealth: null,
    },
    comparison: {
      archetype: { powerMW: 100, durationHours: 4 },
      score: { composite: 55, connectionRisk: 40 },
      capabilities: { capacityMarket: true, merchant: true, ancillaryServices: true, tolling: false },
      economics: {
        capexPerMW: 800000, opexPerMW: 9000,
        contracted: 40000, contractYears: 12, postFactor: 0.5,
        merchGross: 60000, feePct: 9, services: 8000, grantPct: 0, degr: 2,
      },
      narrative: { archetype: ['100 MW · 4h', '100MW · 4小时'], thesis: ['Test.', '测试。'], pipelineRatio: '~1×' },
    },
  };

  assert.deepEqual(validateMarket(japan), [], 'a minimal market must validate');
  assert.deepEqual(supportedStrategies(japan).map(s => s.id), ['cap', 'mer']);
  assert.equal(baseStrategy(japan), 'cap');
  assert.equal(validateRegistry([...markets, japan]).length, 0, 'and must not break the registry');
});

test('validation rejects the mistakes a new market is most likely to make', () => {
  const base = () => JSON.parse(JSON.stringify({
    manifest: {
      id: 'xx', slug: 'xx-market', flag: '🏳️', shortName: ['XX', '简称'], name: ['X', 'X'],
      currency: 'EUR', locale: 'en-GB', status: ['Watch', '观察'], color: 'var(--s8)',
    },
    comparison: {
      archetype: { powerMW: 10, durationHours: 2 },
      score: { composite: 1, connectionRisk: 1 },
      capabilities: { merchant: true },
      economics: { capexPerMW: 1, opexPerMW: 1, merchGross: 1, feePct: 1, services: 0, grantPct: 0, degr: 2 },
      narrative: { archetype: ['a', 'b'], thesis: ['a', 'b'], pipelineRatio: '~1×' },
    },
  }));

  assert.deepEqual(validateMarket(base()), [], 'the control case is valid');

  // A currency with no rate in comparison/assumptions.js cannot be normalized.
  const noFx = base(); noFx.manifest.currency = 'CHF';
  assert.match(validateMarket(noFx).join(' '), /no FX rate/);

  const badSlug = base(); badSlug.manifest.slug = 'Not A Slug';
  assert.match(validateMarket(badSlug).join(' '), /URL-safe/);

  const claimsCapacity = base(); claimsCapacity.comparison.capabilities.capacityMarket = true;
  assert.match(validateMarket(claimsCapacity).join(' '), /economics\.contracted is required/);

  const claimsToll = base(); claimsToll.comparison.capabilities.tolling = true;
  assert.match(validateMarket(claimsToll).join(' '), /economics\.toll is required/);

  const unknownCap = base(); unknownCap.comparison.capabilities.timeTravel = true;
  assert.match(validateMarket(unknownCap).join(' '), /unknown capability/);

  const dupe = [base(), base()];
  assert.match(validateRegistry(dupe).join(' '), /duplicate market id/);
});

test('every strategy declares the capability it needs and a not-applicable message', () => {
  for (const s of STRATEGIES){
    assert.ok(typeof s.requires === 'string' && s.requires.length > 0, `${s.id} declares no capability`);
    assert.ok(Array.isArray(s.na) && s.na.length === 2, `${s.id} has no bilingual N/A message`);
  }
});
