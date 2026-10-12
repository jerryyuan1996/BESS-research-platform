/* ---------------------------------------------------------------------------
   THE ENTRY-ADJUSTED RETURN — beside the engine, never inside it.

   src/entry/entryReturn.js adds four lines to a market's Entry tab. Three
   things are held here:

     1. THE ENGINE IS UNMOVED. The module calls the comparison engine and reads
        its result. A base case run before the module is used, and one run
        after it has been called for every market, are the same numbers.
        tests/baseline.test.js and tests/current-model.test.js are untouched by
        this feature and this is the check that says why.
     2. THE ARITHMETIC IS THE DERIVATION. The plan gives each line as a formula
        (docs/investability-phase-5-plan.md section 4.3). Each is recomputed
        here by hand and compared.
     3. NOTHING IS BUILT ON A GAP. No stated timing means no entry-adjusted
        figure; an incomplete ledger means "at most"; a ledger with nothing
        costed means no break-even at all.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import { markets, byId } from '../src/markets/registry.js';
import { runBaseCase } from '../src/comparison/engine.js';
import { EXIT_Y_CONTRACTED, EXIT_Y_MERCHANT, EXIT_Y_OPEX, FX } from '../src/comparison/assumptions.js';
import { irrOf } from '../src/utils/finance.js';
import { allLedgers, ledgerFor } from '../src/entry/ledgerRegistry.js';
import { validateLedger } from '../src/entry/ledger.js';
import { entryReturn, entryCosts, impliedRtbValue, breakEvenAttrition } from '../src/entry/entryReturn.js';

const near = (a, b, tol, label) => assert.ok(Math.abs(a - b) <= tol, `${label}: got ${a}, expected ${b} ± ${tol}`);

const KEYS = ['irrHold', 'irrExit', 'net', 'moic', 'payback', 'securedShare', 'securedYears', 'exitVal'];
const snapshot = () => Object.fromEntries(markets.map(m => {
  const r = runBaseCase(m, 5);
  return [m.manifest.id, r.na ? { na: r.na } : Object.fromEntries(KEYS.map(k => [k, r[k]]).concat([['holdFlows', [...r.holdFlows]]]))];
}));

test('the engine\'s base case is the same before and after the entry return is computed', () => {
  const before = snapshot();
  for (const m of markets) entryReturn(m, ledgerFor(m.manifest.id), FX);
  assert.deepEqual(snapshot(), before, 'the entry return moved a number the comparison engine publishes');

  /* And the registered market objects themselves are not edited: a longer
     build is priced on a copy. */
  for (const m of markets){
    if (m.comparison.engineReady === false) continue;
    assert.ok((m.comparison.economics.constructionMonths ?? 12) <= 12, `${m.manifest.id}: the seed build period was changed`);
  }
});

test('line 1 is the engine\'s hold IRR, exactly', () => {
  for (const m of markets){
    const r = entryReturn(m, ledgerFor(m.manifest.id), FX);
    const engine = runBaseCase(m, 5);
    if (engine.na){ assert.equal(r.withheld, true, `${m.manifest.id}: a market the engine does not price has no return to adjust`); continue; }
    assert.equal(r.assetIrr, engine.irrHold, m.manifest.id);
  }
});

test('line 4 is the asset\'s value at the engine\'s exit yields, less its build cost', () => {
  /* Recomputed without the module's helpers:
       V = Σ sec/(1+yC)^y + Σ (auc + mch)/(1+yM)^y − Σ cost/(1+yO)^y − net */
  for (const m of markets){
    const e = runBaseCase(m, 5);
    if (e.na) continue;
    let v = -e.net;
    for (let y = 1; y <= e.eb.length; y++){
      const sec = e.secY[y - 1], auc = e.aucY[y - 1], mch = e.mchY[y - 1];
      const cost = sec + auc + mch - e.eb[y - 1];
      v += sec / (1 + EXIT_Y_CONTRACTED) ** y + (auc + mch) / (1 + EXIT_Y_MERCHANT) ** y - cost / (1 + EXIT_Y_OPEX) ** y;
    }
    near(impliedRtbValue(e), v, 1e-6, `${m.manifest.id}: implied ready-to-build value`);
  }
  /* A negative value is reported as negative, never floored. */
  assert.ok(impliedRtbValue(runBaseCase(byId('ercot'), 5)) < 0, 'ERCOT\'s reference project loses money and its value must say so');
});

test('line 3 is (V − S) / (V + G), and the plan\'s worked example comes out', () => {
  /* V = 100, S = 10, G = 30, all forfeited: of thirteen attempts four succeed
     and earn 4 × 90 = 360, and nine fail and lose 9 × 40 = 360. */
  near(breakEvenAttrition(100, 10, 30), 90 / 130, 1e-12, 'the worked example');
  assert.equal(Math.round(13 * breakEvenAttrition(100, 10, 30)), 9);
  near(breakEvenAttrition(100, 10, 0), 0.9, 1e-12, 'with no security at risk');
  assert.equal(breakEvenAttrition(10, 10, 5), 0, 'a success that only covers its own spend pays for no failures');
  assert.equal(breakEvenAttrition(-50, 0, 0), 0, 'a negative value pays for none');
  assert.equal(breakEvenAttrition(null, 0, 0), null);
});

test('line 2 with no development, no cost and a twelve-month build is the asset IRR', () => {
  /* The check that the adjustment adds nothing of its own: take away
     everything it adjusts for and the engine's figure must come back. */
  const market = byId('ro');
  const empty = { marketId: 'ro', basis: market.comparison.archetype, items: [],
    timing: { monthsToRtb: [0, 0], buildMonths: [12, 12], basis: 'convention', note: ['x', '测'] } };
  const r = entryReturn(market, empty, FX);
  near(r.entryAdjusted.low, r.assetIrr, 1e-9, 'slow case');
  near(r.entryAdjusted.high, r.assetIrr, 1e-9, 'fast case');
});

test('line 2 is the IRR of development, then the engine\'s own flows', () => {
  /* Two years of development, 100 of spend and 500 of security per MW, the
     security back at the decision. Built by hand from the engine's vector. */
  const market = byId('ro');
  const mw = market.comparison.archetype.powerMW;
  const ledger = { marketId: 'ro', basis: market.comparison.archetype,
    timing: { monthsToRtb: [24, 24], buildMonths: [12, 12], basis: 'convention', note: ['x', '测'] },
    items: [
      { id: 'fee', kind: 'fee', amount: { fixed: 100 * mw, currency: 'USD' }, postedAt: 'application', releasedAt: null, beforeFid: true, beforeConsent: null, refundable: false },
      { id: 'sec', kind: 'security', amount: { perMW: 500, currency: 'USD' }, postedAt: 'application', releasedAt: 'studies', beforeFid: true, beforeConsent: null, refundable: true, lostIf: ['x', '测'] },
    ] };
  const engine = runBaseCase(market, 5);
  const byHand = [0, 0, ...engine.holdFlows];
  byHand[0] -= 50; byHand[1] -= 50;      // spend, spread over two years
  byHand[0] -= 500; byHand[2] += 500;    // security out on day one, back at the decision
  const r = entryReturn(market, ledger, FX);
  near(r.entryAdjusted.central, irrOf(byHand), 1e-9, 'entry-adjusted IRR');
  assert.ok(r.entryAdjusted.central < r.assetIrr, 'two years of waiting and a posted security must cost something');
  assert.equal(r.atMost, false);
});

test('the slow case is never better than the fast one', () => {
  for (const ledger of allLedgers().filter(l => l.timing)){
    const r = entryReturn(byId(ledger.marketId), ledger, FX);
    assert.ok(r.entryAdjusted.low <= r.entryAdjusted.high, `${ledger.marketId}: the range is upside down`);
    assert.ok(r.entryAdjusted.high < r.assetIrr, `${ledger.marketId}: a real development period cannot improve on arriving ready to build`);
  }
});

test('no stated timing means no entry-adjusted figure, and never one built on the seed', () => {
  const stated = allLedgers().filter(l => l.timing).map(l => l.marketId).sort();
  /* The two markets whose pathway was read for a total. A market joins this
     list when somebody states its range, and for no other reason. */
  assert.deepEqual(stated, ['ro', 'wa']);
  for (const m of markets){
    const ledger = ledgerFor(m.manifest.id);
    const r = entryReturn(m, ledger, FX);
    if (r.withheld) continue;
    assert.equal(r.entryAdjusted === null, !ledger?.timing, `${m.manifest.id}: an entry-adjusted return with no timing behind it`);
  }
});

test('an incomplete ledger makes the figures "at most", and one with nothing costed gives no break-even', () => {
  for (const m of markets){
    const ledger = ledgerFor(m.manifest.id);
    const r = entryReturn(m, ledger, FX);
    if (r.withheld) continue;
    const costs = entryCosts(ledger, FX);
    assert.equal(r.atMost, costs.incomplete, m.manifest.id);
    if (costs.incomplete && costs.spendPerMW === 0 && costs.pledgedPerMW === 0){
      assert.equal(r.attrition, null, `${m.manifest.id}: nothing is costed, so a break-even would be "at most 100%" and say nothing`);
    }
  }
  /* Poland's amounts are in złoty. They could not be counted until the rate
     table gained a złoty seed; they are counted now, and the ledger is still
     incomplete because development spend has no source. */
  const pl = entryCosts(ledgerFor('pl'), FX);
  assert.equal(pl.incomplete, true);
  assert.ok(pl.spendPerMW > 0 && pl.pledgedPerMW > 0, 'the statutory payments convert');
});

test('a ledger\'s timing is a stated range with a basis and a note, or it is refused', () => {
  const base = { marketId: 'x', basis: { powerMW: 10, durationHours: 2 }, summary: ['a', '甲'], limit: ['b', '乙'], items: [] };
  const good = { monthsToRtb: [24, 36], buildMonths: [12, 18], basis: 'convention', note: ['Where it comes from.', '来源说明。'] };
  assert.deepEqual(validateLedger({ ...base, timing: good }), []);
  assert.deepEqual(validateLedger(base), [], 'timing is optional');
  const bad = (patch, pattern) => {
    const problems = validateLedger({ ...base, timing: { ...good, ...patch } });
    assert.ok(problems.some(p => pattern.test(p)), `expected ${pattern}, got ${JSON.stringify(problems)}`);
  };
  bad({ monthsToRtb: [36, 24] }, /monthsToRtb must be a \[min, max\] range/);
  bad({ buildMonths: 12 }, /buildMonths must be a \[min, max\] range/);
  bad({ basis: 'guess' }, /basis must be one of/);
  bad({ note: 'in one language' }, /note must be an \[en, zh\] pair/);
  bad({ discountRate: 0.08 }, /"discountRate" is not a field of timing/);
});

test('the module holds no rate of its own', async () => {
  /* A discount rate, a hurdle or a guarantee fee is methodology. The lines are
     computed on the engine's exit yields and on cash, and on nothing else. */
  const { readFile } = await import('node:fs/promises');
  const src = (await readFile(new URL('../src/entry/entryReturn.js', import.meta.url), 'utf8'))
    .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.ok(!/\b0\.\d+\b/.test(src), 'a decimal constant in the module: a rate nobody signed off');
  assert.ok(!/document|window|new Date\(|Date\.now/.test(src), 'no DOM and no clock');
});
