/* Registry integrity.

   This is the test that protects the "how do I add Japan?" property: if a market
   is registered with a malformed manifest or an incomplete comparison interface,
   the failure shows up here rather than as a wrong number on the home page. */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  markets, byId, bySlug, marketIds, comparableMarkets,
  ALLOCATION_MARKETS, DETAIL_DASHBOARDS, hasDashboard, resolveDashboard,
} from '../src/markets/registry.js';
import { validateMarket, validateRegistry } from '../src/utils/validation.js';
import { REQUIRED_MANIFEST_FIELDS, METADATA_FIELDS } from '../src/markets/schema.js';
import { FX } from '../src/comparison/assumptions.js';
import { supportedStrategies, baseStrategy, STRATEGIES } from '../src/comparison/strategies.js';
import { merchantVintage, firstUncoveredMerchantYear } from '../src/comparison/vintage.js';

test('the registry contains every allocation market', () => {
  assert.deepEqual(marketIds(), ['wa', 'nem', 'gb', 'de', 'it', 'ie', 'ro', 'pl', 'jp_tokyo', 'jp_kyushu', 'jp_hokkaido', 'pjm', 'ercot', 'caiso']);
});

test('allocation markets and detail dashboards are counted separately', () => {
  // Three Japan allocation points share one research dashboard.
  assert.equal(ALLOCATION_MARKETS().length, 14);
  assert.equal(DETAIL_DASHBOARDS().length, 12);
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

/* The default is still capacity-backed wherever a capacity mechanism exists, and
   merchant otherwise — Romania remains the one market with no capacity leg. What
   changed on 2026-07-30 is that Japan now declares `baseStrategy: 'ltda'`
   explicitly, because the annual Capacity Market auction stopped being the route
   a Japanese battery is financed on: LTDA Round 3 set a hard six-hour minimum
   and a 20-year agreement, and the main auction secures one delivery year. The
   override exists precisely so a market can say so. */
test('base strategies: capacity-backed by default, overridden where a market says otherwise', () => {
  /* Italy declares NO override despite having a long-term award, and that is the
     point of the default: 95% of new de-rated capacity in the DY2027 auction went
     to BESS on 15-year contracts in every zone, so `cap` really is the route it
     is financed on. MACSE is the interesting route, not the base one. */
  /* PJM takes the default rather than an override, and unlike Italy it does not
     even have a competing route to decline: no PJM tolling agreement exists at
     any price and no long-term award scheme does either. `cap` is not a choice
     there, it is the only contracted route the market has. */
  /* ERCOT declares `toll`, and it is the third override on this list for the
     third distinct reason. Japan overrides because a four-hour battery cannot
     bid into the annual auction at all; the NEM overrides because the CIS is how
     a project reaching financial close is actually contracted; ERCOT overrides
     because it has no capacity market, so the engine's merchant fallback would
     otherwise publish the uncontracted case as the mainstream one — against
     twelve known tolled batteries, five of them already operating. */
  assert.deepEqual(markets.map(m => baseStrategy(m)),
    ['cap', 'ltda', 'cap', 'mer', 'cap', 'cap', 'mer', 'mer', 'ltda', 'ltda', 'ltda', 'cap', 'toll', 'cap']);

  // An override is only honoured when the market actually supports the route.
  for (const m of markets){
    const explicit = m.comparison.baseStrategy;
    if (!explicit) continue;
    assert.equal(baseStrategy(m), explicit,
      `${m.manifest.id}: declared base strategy is not supported by its capabilities`);
  }
});

/* ---------------------------------------------------------------------------
   THE MERCHANT VINTAGE.

   The first US build priced ERCOT's arbitrage leg at calendar 2025 actual and
   its ancillary leg at a 2030-saturated level, and did the same in PJM. That is
   not conservatism — it describes a year that will never happen, pricing one leg
   in a world where the queue has arrived and the other in a world where it has
   not. These tests exist so it cannot recur silently.
   --------------------------------------------------------------------------- */
test('every market prices both merchant legs at the same declared year', () => {
  for (const m of markets){
    if (!m.comparison.capabilities?.merchant) continue;
    const v = m.comparison.merchantVintage;
    assert.ok(v, `${m.manifest.id}: no merchant vintage declared`);
    assert.equal(v.year, firstUncoveredMerchantYear(m, baseStrategy(m)),
      `${m.manifest.id}: vintage year disagrees with what its base route leaves exposed`);
    // The seed is the base case, in both legs. Otherwise the declaration is decoration.
    assert.equal(v.cases.base.merchGross, m.comparison.economics.merchGross, `${m.manifest.id}: arbitrage seed`);
    assert.equal(v.cases.base.services, m.comparison.economics.services, `${m.manifest.id}: ancillary seed`);
  }
});

test('a toll-led market prices merchant from the year the toll stops paying', () => {
  /* ERCOT is the case the rule was written for: seven tolled years pay a fixed
     fee and no merchant revenue, so year 1 merchant is a cash flow the owner
     never sees. Anywhere the contracted revenue is ADDITIVE to merchant rather
     than a substitute for it, exposure starts at commissioning and the vintage
     is year 1 — which is every other market here. */
  const ercot = byId('ercot');
  assert.equal(baseStrategy(ercot), 'toll');
  assert.equal(ercot.comparison.merchantVintage.year, ercot.comparison.economics.tollYears + 1);

  for (const m of markets){
    if (m.manifest.id === 'ercot' || !m.comparison.capabilities?.merchant) continue;
    assert.equal(m.comparison.merchantVintage.year, 1,
      `${m.manifest.id}: contracted revenue is additive, so merchant is exposed from year 1`);
  }
});

test('forward saturation is a curve, never folded into the seed', () => {
  /* A seed is a level at a stated year and a curve is what happens after it.
     PJM's Regulation line is the worked example: $32,000 in 2029 falling on a
     published fleet projection, rather than one number standing for both. */
  const pjm = byId('pjm').comparison.economics;
  assert.ok(Array.isArray(pjm.servicesCurve), 'PJM carries a Regulation saturation curve');
  assert.equal(pjm.servicesCurve.length, 15, 'a curve covers the whole modelled life');
  assert.equal(pjm.servicesCurve[0], 1, 'the curve starts at the vintage year, so year 1 is unscaled');
  assert.ok(pjm.servicesCurve[14] < pjm.servicesCurve[0], 'and Regulation saturates rather than holding');

  // Every market carrying a curve must start it at 1, or the seed is not a level.
  for (const m of markets){
    const c = m.comparison.economics.servicesCurve;
    if (!Array.isArray(c)) continue;
    assert.equal(c[0], 1, `${m.manifest.id}: a services curve must start at its vintage year`);
    assert.equal(c.length, 15, `${m.manifest.id}: a services curve must cover the modelled life`);
  }
});

test('every market exposes the full module surface', () => {
  for (const m of markets){
    const id = m.manifest.id;
    /* A dashboard may be in the main bundle or in its own chunk. Both are a
       dashboard; the difference is only when the code arrives. What is NOT
       acceptable is declaring both, because then which one renders depends on
       resolution order — src/utils/validation.js rejects that. */
    assert.ok(hasDashboard(m), `${id}: no dashboard, eager or lazy`);
    assert.ok(!(m.dashboard && m.loadDashboard),
      `${id}: declares both dashboard and loadDashboard`);
    assert.ok(Array.isArray(m.tabs) && m.tabs.length > 0, `${id}: no tabs`);
    assert.ok(m.sources && Object.keys(m.sources).length > 0, `${id}: empty source register`);
  }
});

test('a lazy dashboard resolves to a renderer, and Japan shares one chunk', async () => {
  /* The delegation is the part worth asserting. Three allocation points share
     one dashboard module, so resolveDashboard must key on the OWNER: keyed on
     the allocation point it would import the same bytes three times, which is
     the naive split this test exists to catch. */
  const lazy = markets.filter(m => typeof m.loadDashboard === 'function');
  assert.ok(lazy.length > 0, 'expected at least one market to load its dashboard on demand');

  for (const m of lazy){
    const fn = await resolveDashboard(m);
    assert.equal(typeof fn, 'function', `${m.manifest.id}: did not resolve to a renderer`);
  }

  const jp = ['jp_tokyo', 'jp_kyushu', 'jp_hokkaido'].map(byId).filter(Boolean);
  assert.equal(jp.length, 3, 'the three Japan allocation points should be registered');
  const resolved = await Promise.all(jp.map(resolveDashboard));
  assert.equal(new Set(resolved).size, 1,
    'the three Japan markets must resolve to the SAME renderer — one chunk, not three');
});

/* Thirteen since 2026-07-30, when Project Debt was added next to the revenue
   tabs. The count is asserted rather than left free because the dashboards are
   meant to mirror one another — a market that quietly gains or loses a tab has
   stopped being comparable, which is the whole premise of the shared engine. */
test('every dashboard has the same ten non-comparison tabs', () => {
  for (const m of markets){
    const ids = m.tabs.map(([id]) => id);
    assert.equal(m.tabs.length, 10, `${m.manifest.id} tab count`);
    assert.ok(!ids.includes('benchmark'), `${m.manifest.id}: comparison tab must be absent`);
  }
});

/* Project debt and the Investment Lab moved to the home page, where one model
   serves every market instead of six dashboards each carrying their own. A
   dashboard that reintroduced either tab would be re-forking the model, which is
   the thing the move exists to prevent. */
test('no dashboard carries a project-debt or investment-lab tab', () => {
  for (const m of markets){
    const ids = m.tabs.map(([id]) => id);
    assert.ok(!ids.includes('debt'),
      `${m.manifest.id}: project debt belongs to the dedicated Investment Lab`);
    assert.ok(!ids.includes('lab'),
      `${m.manifest.id}: the Investment Lab belongs on its dedicated page`);
  }
});

/* This used to assert that a renewal curve declined monotonically and sat
   entirely below its secured year. That was Japan's shape mistaken for a rule.

   PJM broke it, correctly. Its renewal path RISES above the secured year before
   falling below it, because two published forces run in opposite directions: the
   FERC-approved price collar ends after 2029/2030 and the cap reverts from
   $325/MW-day toward a Net CONE figure PJM estimates near $550, while four-hour
   storage ELCC erodes as 67 GW of queued storage arrives. A rule forcing decline
   would have made the most investable feature of that market unstateable.

   What replaces the shape constraint is an EVIDENCE constraint, which is what the
   old rule was really reaching for. Every year that has not cleared must be
   declared as an analyst scenario with its own clearing-price and accreditation
   assumptions, and the payment must reconcile to them — so a curve can be any
   shape at all, provided every point in it says what it is made of. The
   arithmetic is enforced by validateMarket; this test enforces the vocabulary. */
test('auction-renewal markets separate secured revenue from assumed renewals', () => {
  const renewal = markets.filter(m => m.comparison.economics.riskClass === 'auction-renewal');
  assert.deepEqual(renewal.map(m => m.manifest.id),
    ['jp_tokyo', 'jp_kyushu', 'jp_hokkaido', 'pjm'],
    'the three Japan markets and PJM win capacity one delivery period at a time');

  for (const m of renewal){
    const e = m.comparison.economics;
    const id = m.manifest.id;
    assert.equal(e.contracted, undefined, `${id}: must not carry a legacy contracted field`);
    assert.ok(e.securedContracted > 0, `${id}: needs a positive secured payment`);
    assert.equal(e.securedContractYears, 1, `${id}: the auction secures one delivery year`);
    assert.ok(Array.isArray(e.auctionRenewalCurve) && e.auctionRenewalCurve.length === 14,
      `${id}: renewal curve must cover years 2-15`);

    const s = e.auctionRenewalScenario;
    assert.ok(s, `${id}: a renewal curve must declare what its years are made of`);
    assert.equal(s.years.length, e.auctionRenewalCurve.length,
      `${id}: one declared scenario year per renewal year`);

    // The cleared year is the only one allowed to claim it cleared.
    assert.equal(s.securedYear.cleared, true, `${id}: the secured year is a cleared auction`);
    assert.equal(s.securedYear.paymentPerMWYr, e.securedContracted,
      `${id}: the secured year must reconcile to securedContracted`);

    for (const [i, y] of s.years.entries()){
      assert.equal(y.cleared, false,
        `${id} year ${i + 2}: an uncleared year must be marked as an analyst scenario`);
      // Price and accreditation are declared separately so a reader can disagree
      // with either one alone. A blended payment hides which half is the claim.
      assert.ok(y.price > 0, `${id} year ${i + 2}: needs an assumed clearing price`);
      assert.ok(y.accreditation > 0 && y.accreditation <= 1,
        `${id} year ${i + 2}: needs an assumed accreditation factor in (0, 1]`);
      assert.equal(y.paymentPerMWYr, e.auctionRenewalCurve[i],
        `${id} year ${i + 2}: payment must reconcile to the curve`);
    }
  }
});

/* The shape is deliberately unconstrained, so this test records that the two
   markets actually carrying renewal curves have DIFFERENT shapes — and that the
   platform can express both. If a future edit quietly re-imposed a decline rule,
   this is what would catch it. */
test('a renewal curve may rise above its secured year where the evidence says so', () => {
  const jp = byId('jp_tokyo').comparison.economics;
  const pjm = byId('pjm').comparison.economics;

  // Japan: a taper on the area clearing price, every year below the secured one.
  assert.ok(jp.auctionRenewalCurve.every(v => v < jp.securedContracted),
    'Japan tapers, and nothing here forces it to');

  // PJM: the collar lifts before accreditation erodes, so the curve peaks above.
  assert.ok(Math.max(...pjm.auctionRenewalCurve) > pjm.securedContracted,
    'PJM must be able to state a renewal year worth more than its secured year');
  assert.ok(pjm.auctionRenewalCurve[13] < pjm.securedContracted,
    'and must still fall below it by the end of the window');
});

/* This used to assert `longTermAward === false` — that LTDA stayed out of the
   market base case entirely, because an award is project-specific and showing it
   by default would imply every project wins one.

   That reasoning has not been abandoned; it has been overtaken. LTDA Round 3
   abolished the 3-6 hour bracket, so the long-term award is now the ONLY route
   in Japan with a product a six-hour battery can bid into, and excluding it
   stopped being conservative — the model was publishing the residual case as if
   it were the mainstream one.

   What survives is the guard, not the exclusion. If the route is going to be
   shown by default, the three things that make it project-specific rather than
   market-wide have to be modelled explicitly and cannot be quietly dropped. */
test('a long-term award is modelled with its constraints, never as free contracted revenue', () => {
  const awarded = markets.filter(m => m.comparison.capabilities.longTermAward);
  assert.ok(awarded.length > 0, 'no market enables the long-term award route');

  for (const m of awarded){
    const id = m.manifest.id;
    const a = m.comparison.economics.ltda;
    assert.ok(a, `${id}: declares longTermAward but carries no award scenario`);
    assert.ok(a.payment > 0, `${id}: award payment must be positive`);
    assert.ok(a.years > 0, `${id}: award tenor must be positive`);

    // The clawback is the whole reason this route is not additive with merchant.
    // Modelling the award while ignoring it would overstate Japan badly.
    assert.ok(a.merchantRetention > 0 && a.merchantRetention < 1,
      `${id}: other-market revenue sharing must be modelled, not assumed away`);

    // Never shown bare: the case carries prose saying what it is.
    assert.ok(Array.isArray(a.note) && a.note.length === 2,
      `${id}: an award case must carry a bilingual note`);

    /* Where the scheme sets an eligibility floor, the archetype has to clear it.
       Japan's LTDA Round 3 abolished the 3-6h bracket; the NEM's Capacity
       Investment Scheme sets no duration minimum, so it declares none. */
    if (a.minDurationHours != null){
      assert.ok(m.comparison.archetype.durationHours >= a.minDurationHours,
        `${id}: the award requires ${a.minDurationHours}h — a shorter archetype cannot bid`);
    }
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
      /* One more line than the original fixture, and it is the merchant vintage:
         a market that publishes two merchant legs has to say which year both are
         priced at. `merchantVintage()` derives the three cases from the economics
         and ranges the market already has, so this stays a one-liner — the cost of
         the rule is a declaration, not a dataset. */
      merchantVintage: merchantVintage(1, {
        capexPerMW: 800000, opexPerMW: 9000,
        contracted: 40000, contractYears: 12, postFactor: 0.5,
        merchGross: 60000, feePct: 9, services: 8000, grantPct: 0, degr: 2,
      }, null, ['Year 1 — capacity revenue is additive to merchant.', '第1年 — 容量收入与市场化收入并存。']),
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
      merchantVintage: {
        year: 1, basis: ['Year 1.', '第1年。'],
        cases: {
          downside: { merchGross: 1, services: 0 },
          base: { merchGross: 1, services: 0 },
          upside: { merchGross: 1, services: 0 },
        },
      },
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
