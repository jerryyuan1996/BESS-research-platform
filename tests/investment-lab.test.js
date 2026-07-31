/* ---------------------------------------------------------------------------
   The Investment Lab's contract with the rest of the page.

   The Lab is only defensible if two things hold. It must RECONCILE — reset every
   input and it reproduces the league table and the $1M engine exactly, because a
   lab whose base case disagrees with the page it sits on is worse than no lab.
   And it must be BOUNDED — every editable field carries a band, every band
   contains the value it bounds, and every band says where it came from.

   Both are asserted here over every registered market, so a new market cannot
   join the Lab with an unbounded input or an uncited range.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import { markets, comparableMarkets } from '../src/markets/registry.js';
import { runCase, runBaseCase } from '../src/comparison/engine.js';
import { baseStrategy, supportedStrategies } from '../src/comparison/strategies.js';
import { withOverrides, conventionsWith, movedFields } from '../src/comparison/scenario.js';
import {
  labFieldsFor, readPath, clampToRange, isMoved, DEBT_RANGES, LAB_FIELDS, DISPERSION,
} from '../src/comparison/ranges.js';
import { DEBT_CONVENTIONS, sizeProjectDebt, riskClassFor } from '../src/economics/projectDebt.js';

const EXIT_YEARS = [5, 7, 10];

/* ---- reconciliation ----------------------------------------------------- */

test('with no overrides the Lab reproduces the comparison engine exactly', () => {
  for (const m of comparableMarkets()){
    for (const X of EXIT_YEARS){
      const seed = runBaseCase(m, X);
      const lab = runCase(withOverrides(m, {}), baseStrategy(m), X);
      if (seed.na){ assert.deepEqual(lab.na, seed.na, m.manifest.id); continue; }
      for (const k of ['irrHold', 'irrExit', 'moic', 'payback', 'net', 'eb1', 'kwPerM', 'exitVal', 'cumOp']){
        assert.equal(lab[k], seed[k], `${m.manifest.id} yr${X}: ${k} must match the engine`);
      }
    }
  }
});

test('an override reprices the scenario without touching the registered market', () => {
  const m = comparableMarkets().find(x => x.comparison.ranges?.capexPerMW);
  const before = m.comparison.economics.capexPerMW;
  const floor = m.comparison.ranges.capexPerMW.min;

  const scenario = withOverrides(m, { capexPerMW: floor });
  assert.equal(scenario.comparison.economics.capexPerMW, floor, 'the scenario carries the override');
  assert.equal(m.comparison.economics.capexPerMW, before, 'the registry entry is untouched');
  assert.notEqual(scenario.comparison.economics, m.comparison.economics, 'economics is copied, not mutated');

  // Cheaper capex, same revenue — the return must improve.
  const base = runBaseCase(m, 5);
  const cheap = runCase(scenario, baseStrategy(m), 5);
  assert.ok(cheap.irrHold > base.irrHold, 'a lower capex must raise the hold IRR');
});

test('a dotted override reaches a nested economics field', () => {
  const jp = markets.find(m => m.comparison.economics.ltda);
  assert.ok(jp, 'expected at least one market with a long-term award');
  const raised = withOverrides(jp, { 'ltda.payment': 50_000_000 });
  assert.equal(raised.comparison.economics.ltda.payment, 50_000_000);
  assert.equal(raised.comparison.economics.ltda.years, jp.comparison.economics.ltda.years,
    'siblings of the overridden key survive the copy');
  assert.notEqual(jp.comparison.economics.ltda.payment, 50_000_000, 'the registry entry is untouched');
});

test('movedFields reports only the inputs that actually differ from their seed', () => {
  const m = comparableMarkets()[0];
  const seed = m.comparison.economics.capexPerMW;
  assert.deepEqual(movedFields(m, {}), []);
  assert.deepEqual(movedFields(m, { capexPerMW: seed }), [], 'a value equal to its seed is not "moved"');
  assert.deepEqual(movedFields(m, { capexPerMW: seed * 0.9 }), ['capexPerMW']);
});

/* ---- the bands ---------------------------------------------------------- */

test('every market declares a bounded, cited range for every field the Lab exposes', () => {
  const known = new Set(LAB_FIELDS.map(f => f.key));

  for (const m of comparableMarkets()){
    const ranges = m.comparison.ranges;
    assert.ok(ranges && Object.keys(ranges).length,
      `${m.manifest.id}: no assumption ranges declared — the Lab would render no form`);

    for (const [key, r] of Object.entries(ranges)){
      const id = `${m.manifest.id}.${key}`;
      assert.ok(known.has(key), `${id}: not a field the Lab knows how to render`);

      const value = readPath(m.comparison.economics, key);
      assert.ok(Number.isFinite(value), `${id}: bounds a field this market does not declare`);
      assert.equal(r.seed, value, `${id}: the band's seed must be the value it bounds`);

      assert.ok(r.min <= r.seed && r.seed <= r.max,
        `${id}: the seed must sit inside its own band (${r.min} … ${r.seed} … ${r.max})`);
      assert.ok(r.max > r.min, `${id}: an empty band is not a band`);

      assert.ok(Array.isArray(r.basis) && r.basis.length === 2 && r.basis[0] && r.basis[1],
        `${id}: needs a bilingual basis — a bound with no argument is a guess`);
      assert.ok(typeof r.source === 'string' && r.source.length > 0,
        `${id}: needs a source`);
      assert.ok(['sourced', 'part-sourced', 'dispersed', 'limit'].includes(r.kind),
        `${id}: unknown band kind ${r.kind}`);
    }
  }
});

test('a dispersed band is exactly the stated dispersion, so one number explains all of them', () => {
  for (const m of comparableMarkets()){
    for (const [key, r] of Object.entries(m.comparison.ranges)){
      if (r.kind !== 'dispersed') continue;
      // `limits()` bands are also labelled dispersed where their endpoints are an
      // analyst judgement rather than a rule; those are declared, not computed.
      if (r.min !== r.seed * (1 - DISPERSION)) continue;
      assert.ok(Math.abs(r.max - r.seed * (1 + DISPERSION)) < 1e-6,
        `${m.manifest.id}.${key}: a computed dispersed band must be symmetric`);
    }
  }
});

test('a band marked sourced is narrower than dispersion would have made it, or wider on evidence', () => {
  // The point of the distinction: a sourced band reports what two observations
  // say, never a fixed percentage dressed up as evidence.
  for (const m of comparableMarkets()){
    for (const [key, r] of Object.entries(m.comparison.ranges)){
      if (r.kind !== 'sourced') continue;
      const symmetric = Math.abs((r.seed - r.min) - (r.max - r.seed)) < 1e-6;
      const isDispersionWidth = Math.abs((r.seed - r.min) - r.seed * DISPERSION) < 1e-6;
      assert.ok(!(symmetric && isDispersionWidth),
        `${m.manifest.id}.${key}: labelled sourced but is exactly ±${DISPERSION * 100}% of the seed`);
    }
  }
});

test('the Lab exposes a market only through fields that market declares', () => {
  for (const m of comparableMarkets()){
    for (const f of labFieldsFor(m)){
      assert.ok(Number.isFinite(f.value), `${m.manifest.id}.${f.key}: rendered with no value`);
      assert.ok(f.range, `${m.manifest.id}.${f.key}: rendered with no range`);
    }
  }

  // Romania has no capacity mechanism, so there is nothing contracted to move.
  const ro = markets.find(x => x.manifest.id === 'ro');
  const roKeys = labFieldsFor(ro).map(f => f.key);
  assert.ok(!roKeys.includes('contracted'),
    'Romania must not offer a contracted-revenue input: it has no capacity mechanism');
  assert.ok(roKeys.includes('grantPct'), 'Romania must offer the grant, which is its structural lever');

  // A one-delivery-year auction award is not a tenor a reader gets to choose.
  for (const jp of markets.filter(x => x.comparison.economics.riskClass === 'auction-renewal')){
    assert.ok(!labFieldsFor(jp).map(f => f.key).includes('securedContractYears'),
      `${jp.manifest.id}: the main auction secures one delivery year — not an input`);
  }
});

test('clamping keeps a typed value inside its band and falls back to the seed', () => {
  const m = comparableMarkets()[0];
  const r = m.comparison.ranges.capexPerMW;
  assert.equal(clampToRange(r.min - 1e9, r), r.min);
  assert.equal(clampToRange(r.max + 1e9, r), r.max);
  assert.equal(clampToRange(NaN, r), r.seed, 'an unparseable entry falls back to the seed');
  assert.equal(clampToRange(r.seed, r), r.seed);
  assert.equal(isMoved(r.seed, r), false);
  assert.equal(isMoved(r.min, r), true);
});

/* ---- financing ---------------------------------------------------------- */

test('only the four priced financing terms are reachable from the Lab', () => {
  const priced = Object.keys(DEBT_RANGES);
  assert.deepEqual(priced.sort(), ['baseRate', 'margin', 'maxGearingMarket', 'maxGearingSecured']);

  // Coverage tests, tranche split, tenor caps and rollover are methodology.
  const applied = conventionsWith({
    baseRate: 0.04,
    dscrSecured: 99, dscrMarket: 99, legalTenorCap: 99, miniPermTenor: 99,
    warrantyTenor: 99, notionalProfile: 99, rolloverAllowance: { contracted: 99 },
  });
  assert.equal(applied.baseRate, 0.04, 'a priced term moves');
  for (const k of ['dscrSecured', 'dscrMarket', 'legalTenorCap', 'miniPermTenor',
                   'warrantyTenor', 'notionalProfile', 'rolloverAllowance']){
    assert.deepEqual(applied[k], DEBT_CONVENTIONS[k], `${k} must not be reachable from the UI`);
  }
});

test('a financing override is clamped to its governed band', () => {
  assert.equal(conventionsWith({ margin: 0.10 }).margin, DEBT_RANGES.margin.max);
  assert.equal(conventionsWith({ margin: 0 }).margin, DEBT_RANGES.margin.min);
  assert.equal(conventionsWith({}).margin, DEBT_CONVENTIONS.margin, 'no override leaves the seed');
});

test('every market can be levered under every route it supports', () => {
  for (const m of comparableMarkets()){
    for (const s of supportedStrategies(m)){
      const result = runCase(m, s.id, 5);
      if (result.na) continue;
      const debt = sizeProjectDebt(result, {
        exitYear: 5, riskClass: riskClassFor(m, s.id), conventions: conventionsWith({}),
      });
      assert.ok(debt, `${m.manifest.id}/${s.id}: project debt could not be sized`);
      assert.ok(debt.gearing >= 0 && debt.gearing <= 1,
        `${m.manifest.id}/${s.id}: gearing ${debt.gearing} is not a fraction`);
      assert.ok(debt.totalDebt + debt.equity - result.net < 1e-6,
        `${m.manifest.id}/${s.id}: debt and equity must fund exactly the net capex`);
    }
  }
});

test('a cheaper base rate never reduces the debt a route can carry', () => {
  for (const m of comparableMarkets()){
    const result = runBaseCase(m, 5);
    if (result.na) continue;
    const opts = { exitYear: 5, riskClass: riskClassFor(m, baseStrategy(m)) };
    const dear = sizeProjectDebt(result, { ...opts, conventions: conventionsWith({ baseRate: DEBT_RANGES.baseRate.max }) });
    const cheap = sizeProjectDebt(result, { ...opts, conventions: conventionsWith({ baseRate: DEBT_RANGES.baseRate.min }) });
    assert.ok(cheap.totalDebt >= dear.totalDebt - 1e-6,
      `${m.manifest.id}: a lower cost of debt must not shrink debt capacity`);
  }
});
