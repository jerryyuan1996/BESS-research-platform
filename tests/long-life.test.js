/* ---------------------------------------------------------------------------
   THE LONG-LIFE VIEW — beside the engine, never inside it.

   src/longlife/longLife.js extends the engine's asset past fifteen years
   (gate G12). Held here:

     1. THE ENGINE IS UNMOVED. A base case before and after the module is used
        is the same numbers, and LIFE is still 15.
     2. THE ARITHMETIC IS THE DERIVATION in the module's header, recomputed by
        hand.
     3. NOTHING IS ADDED AT THE END. No residual, and no secured revenue the
        engine did not already have in year 15.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import { markets, byId } from '../src/markets/registry.js';
import { runBaseCase, serviceCostPerMW, opexSeedPerMW } from '../src/comparison/engine.js';
import { LIFE, LONG_LIFE_YEARS, MAINTAINED_FOM_SHARE } from '../src/comparison/assumptions.js';
import { irrOf } from '../src/utils/finance.js';
import { longLife, longLifeIrr, extendedOperatingLine } from '../src/longlife/longLife.js';

const near = (a, b, tol, label) => assert.ok(Math.abs(a - b) <= tol, `${label}: got ${a}, expected ${b} ± ${tol}`);
const priced = markets.filter(m => !runBaseCase(m, 5).na);
/* Where a market carries the supplier's quoted package, years 16–25 pay its own
   price instead of year 15's: the warranty block for 16–20, then 21–25 with
   preventive maintenance and no guarantees. Zero for a market without one. */
const svcStep = (r, e, y) => y > 15 ? (serviceCostPerMW(e, y) - serviceCostPerMW(e, 15)) * r.fxRate : 0;

const KEYS = ['irrHold', 'irrExit', 'net', 'moic', 'payback', 'securedShare', 'securedYears', 'exitVal'];
const snapshot = () => Object.fromEntries(markets.map(m => {
  const r = runBaseCase(m, 5);
  return [m.manifest.id, r.na ? { na: r.na } : Object.fromEntries(KEYS.map(k => [k, r[k]]).concat([['holdFlows', [...r.holdFlows]], ['eb', [...r.eb]]]))];
}));

test('the engine\'s base case is the same before and after the long-life view is computed', () => {
  const before = snapshot();
  for (const m of markets) longLife(m);
  assert.deepEqual(snapshot(), before, 'the long-life view moved a number the comparison engine publishes');
  assert.equal(LIFE, 15, 'the comparison window is not the long-life view\'s to change');
});

test('the windows are the analyst\'s: twenty-five years, with twenty beside it', () => {
  assert.deepEqual(LONG_LIFE_YEARS, [20, 25]);
  for (const m of priced){
    assert.deepEqual(longLife(m).windows.map(w => w.years), [15, 20, 25], m.manifest.id);
  }
});

test('on fifteen years, fading, it is the engine\'s hold IRR exactly', () => {
  for (const m of priced){
    const r = runBaseCase(m, 5);
    const v = longLife(m);
    assert.equal(v.assetIrr, r.irrHold, m.manifest.id);
    assert.equal(v.windows[0].fading, r.irrHold, m.manifest.id);
    near(longLifeIrr(r, m.comparison.economics, LIFE, false), r.irrHold, 1e-9, `${m.manifest.id}: the extension with nothing to extend`);
  }
});

test('the fading years are the engine\'s year 15 carried on, by hand', () => {
  for (const m of priced){
    const r = runBaseCase(m, 5), e = m.comparison.economics;
    const g = (e.degr || 2) / 100;
    const cost15 = r.secY[14] + r.aucY[14] + r.mchY[14] - r.eb[14];
    const line = extendedOperatingLine(r, e, 25, false);
    assert.equal(line.length, 25);
    for (let y = 1; y <= 15; y++) near(line[y - 1], r.eb[y - 1], 1e-6, `${m.manifest.id} year ${y}`);
    for (let y = 16; y <= 25; y++){
      const byHand = r.secY[14] + r.aucY[14] + r.mchY[14] * (1 - g) ** (y - 15) - cost15 - svcStep(r, e, y);
      near(line[y - 1], byHand, 1e-6, `${m.manifest.id} year ${y}`);
    }
    const capital = r.holdFlows.slice(0, r.holdFlows.length - 15);
    near(longLife(m).windows[2].fading, irrOf(capital.concat(line)), 1e-12, `${m.manifest.id}: 25-year IRR`);
  }
});

test('the maintained case holds the market line at its rating and charges for it every year', () => {
  for (const m of priced){
    const r = runBaseCase(m, 5), e = m.comparison.economics;
    const g = (e.degr || 2) / 100;
    const upkeep = Math.max(0, MAINTAINED_FOM_SHARE * r.capexG - opexSeedPerMW(e) * r.fxRate);
    near(longLife(m).upkeepPerMW, upkeep, 1e-9, `${m.manifest.id}: the yearly charge`);
    const line = extendedOperatingLine(r, e, 25, true);
    for (const y of [1, 8, 15, 16, 25]){
      const i = Math.min(y, 15) - 1;
      const cost = r.secY[i] + r.aucY[i] + r.mchY[i] - r.eb[i];
      const byHand = r.secY[i] + r.aucY[i] + r.mchY[i] / (1 - g) ** i - cost - upkeep - svcStep(r, e, y);
      near(line[y - 1], byHand, 1e-6, `${m.manifest.id} year ${y}`);
    }
  }
});

test('nothing is added at the end: no residual, and no year is worth more than a year the engine priced', () => {
  for (const m of priced){
    const r = runBaseCase(m, 5), e = m.comparison.economics;
    const line = extendedOperatingLine(r, e, 25, false);
    for (let y = 16; y <= 25; y++){
      assert.ok(line[y - 1] <= r.eb[14] + 1e-6, `${m.manifest.id} year ${y}: a later year out-earns year 15`);
    }
    /* A longer window can only add the years it adds. */
    if (r.eb[14] > 0){
      const w = longLife(m).windows;
      assert.ok(w[1].fading >= w[0].fading - 1e-9 && w[2].fading >= w[1].fading - 1e-9, `${m.manifest.id}: a longer life with positive years lowered the IRR`);
    }
  }
});

test('a market the engine does not price, or whose degradation is a curve, is not extended', () => {
  for (const m of markets){
    if (runBaseCase(m, 5).na) assert.equal(longLife(m).withheld, true, m.manifest.id);
  }
  const ro = byId('ro');
  const curved = { ...ro, comparison: { ...ro.comparison, economics: { ...ro.comparison.economics, warrantyDegradationCurve: Array(15).fill(1) } } };
  assert.equal(longLife(curved).withheld, true);
});

test('the module holds no number of its own', async () => {
  const { readFile } = await import('node:fs/promises');
  const src = (await readFile(new URL('../src/longlife/longLife.js', import.meta.url), 'utf8'))
    .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.ok(!/\b0\.\d+\b/.test(src), 'a decimal constant in the module: a rate nobody signed off');
  assert.ok(!/\b(20|25)\b/.test(src), 'a life written into the module and not read from the assumptions');
  assert.ok(!/document|window\b|new Date\(|Date\.now/.test(src), 'no DOM and no clock');
});
