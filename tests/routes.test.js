/* ---------------------------------------------------------------------------
   Routes to market: the engine's handling of them, and the frontier's.

   A market is not one position. It is a menu of contracts over the same asset,
   and two things on this platform depend on that being modelled honestly:

     the ENGINE      must price a long-term award on a market whose capacity is
                     not re-auctioned annually, without forcing that market into
                     the auction-renewal risk class to reach the route

     the FRONTIER    must plot one point per ROUTE, because the spread between
                     contracts inside a single market is usually wider than the
                     spread between markets, and a single dot per market hides it
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import { markets, comparableMarkets } from '../src/markets/registry.js';
import { runCase, runBaseCase } from '../src/comparison/engine.js';
import { parseRoute } from '../src/app/router.js';
import { STRATEGIES, supportedStrategies, baseStrategy, securedTenor } from '../src/comparison/strategies.js';

test('the Investment Lab has its own route', () => {
  assert.deepEqual(parseRoute('/investment-lab'), { name:'investmentLab', region:null });
});

import { LIFE } from '../src/comparison/assumptions.js';

/* ---- the engine ---------------------------------------------------------- */

test('a long-term award prices on the legacy path without an auction-renewal class', () => {
  /* Build a market that has a long-term award and an ORDINARY risk class — the
     shape Italy's MACSE and the NEM's Capacity Investment Scheme have, and the
     one the engine could not price before. */
  const base = comparableMarkets().find(m => m.comparison.economics.contracted > 0);
  const e = base.comparison.economics;
  const probe = {
    ...base,
    comparison: {
      ...base.comparison,
      capabilities: { ...base.comparison.capabilities, longTermAward: true },
      economics: {
        ...e,
        riskClass: undefined,
        ltda: { payment: e.contracted * 1.4, years: 15, merchantRetention: 0.5 },
      },
    },
  };

  const r = runCase(probe, 'ltda', 5);
  assert.ok(!r.na, 'the award route must be available: ' + JSON.stringify(r.na));
  assert.equal(r.strategyId, 'ltda');
  assert.ok(Number.isFinite(r.irrHold) && Number.isFinite(r.irrExit));
  assert.equal(r.securedYears, 15, 'the award tenor is the secured tenor');
  assert.ok(r.aucY.every(v => v === 0),
    'the legacy path must not invent a renewal curve for a scheme that has none');
});

test('merchantRetention scales the market legs and nothing else', () => {
  const base = comparableMarkets().find(m => m.comparison.economics.contracted > 0);
  const e = base.comparison.economics;
  const withRetention = (retention) => runCase({
    ...base,
    comparison: {
      ...base.comparison,
      capabilities: { ...base.comparison.capabilities, longTermAward: true },
      economics: { ...e, riskClass: undefined, ltda: { payment: 100000, years: 15, merchantRetention: retention } },
    },
  }, 'ltda', 5);

  const full = withRetention(1);
  const half = withRetention(0.5);
  const none = withRetention(0);

  assert.equal(full.capY[0], half.capY[0], 'the award itself does not move with retention');
  assert.ok(Math.abs(half.mchY[0] - full.mchY[0] / 2) < 1e-6, 'half retention halves the market leg');
  assert.equal(none.mchY[0], 0, 'zero retention leaves the award as the only revenue');
  assert.ok(full.irrHold > none.irrHold, 'keeping market revenue must be worth something');
});

test('an award with no scenario loaded is unavailable rather than zero', () => {
  const base = comparableMarkets()[0];
  const probe = {
    ...base,
    comparison: {
      ...base.comparison,
      capabilities: { ...base.comparison.capabilities, longTermAward: true },
      economics: { ...base.comparison.economics, riskClass: undefined, ltda: undefined },
    },
  };
  const r = runCase(probe, 'ltda', 5);
  assert.ok(r.na, 'a missing award must report unavailable, never a zero-revenue case');
});

test('Japan keeps the auction-renewal path for its award', () => {
  const jp = markets.find(m => m.manifest.id === 'jp_tokyo');
  const r = runCase(jp, 'ltda', 5);
  assert.ok(!r.na);
  assert.equal(r.riskClass, 'auction-renewal',
    'the legacy branch must not capture a market that declares the auction-renewal class');
});

/* ---- what each market offers -------------------------------------------- */

test('every market supports at least one route, and declares why others are absent', () => {
  for (const m of comparableMarkets()){
    const routes = supportedStrategies(m);
    assert.ok(routes.length >= 1, `${m.manifest.id}: no route to market at all`);

    const baseId = baseStrategy(m);
    assert.ok(routes.some(s => s.id === baseId),
      `${m.manifest.id}: base route ${baseId} is not in its own supported set`);

    // Every unsupported strategy must return a reason, never a number.
    for (const s of STRATEGIES){
      if (routes.some(x => x.id === s.id)) continue;
      const r = runCase(m, s.id, 5);
      assert.ok(r.na, `${m.manifest.id}/${s.id}: unsupported route returned a case instead of a reason`);
    }
  }
});

test('secured tenor never exceeds the comparison window and matches the engine', () => {
  for (const m of comparableMarkets()){
    for (const s of supportedStrategies(m)){
      const r = runCase(m, s.id, 5);
      if (r.na) continue;
      assert.ok(r.securedYears <= LIFE,
        `${m.manifest.id}/${s.id}: secured tenor ${r.securedYears} exceeds the ${LIFE}-year window`);
      assert.equal(r.securedYears, Math.min(securedTenor(m, s.id), LIFE),
        `${m.manifest.id}/${s.id}: engine and strategies disagree on the secured tenor`);
    }
  }
});

/* ---- the frontier -------------------------------------------------------- */

test('the frontier plots one point per route, not one per market', () => {
  const list = comparableMarkets();

  let points = 0;
  let alternatives = 0;
  for (const m of list){
    const baseId = baseStrategy(m);
    for (const s of supportedStrategies(m)){
      const r = runCase(m, s.id, 5);
      if (r.na || !Number.isFinite(r.irrExit)) continue;
      points++;
      if (s.id !== baseId) alternatives++;
    }
  }

  assert.ok(points > list.length,
    'the frontier must carry more points than markets, or the multi-route view adds nothing');
  assert.ok(alternatives > 0, 'no market offers an alternative route — check the capability flags');
});

test('a secured share is always a fraction, on every route', () => {
  /* The x-axis is capped at 100%. A route that produced a share above 1 would be
     silently clamped onto the axis edge and read as fully contracted. */
  for (const m of comparableMarkets()){
    for (const s of supportedStrategies(m)){
      const r = runCase(m, s.id, 5);
      if (r.na) continue;
      const share = r.securedShare ?? r.contractedShare;
      assert.ok(share >= 0 && share <= 1,
        `${m.manifest.id}/${s.id}: secured share ${share} is not a fraction`);
    }
  }
});

test('the base route is the one every other section reports', () => {
  for (const m of comparableMarkets()){
    const base = runBaseCase(m, 5);
    const explicit = runCase(m, baseStrategy(m), 5);
    assert.deepEqual(base.na, explicit.na);
    if (base.na) continue;
    assert.equal(base.irrExit, explicit.irrExit);
    assert.equal(base.strategyId, explicit.strategyId);
  }
});
