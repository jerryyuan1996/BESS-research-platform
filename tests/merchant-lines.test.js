/* ---------------------------------------------------------------------------
   docs/merchant-lines-plan-2026-10.md, approved 2026-10-23: the merchant curve,
   the merchant-line evidence rule, and a play's own grant.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import { byId, markets } from '../src/markets/registry.js';
import { runCase } from '../src/comparison/engine.js';
import { validateMerchantVintage } from '../src/comparison/vintage.js';
import { baseStrategy } from '../src/comparison/strategies.js';
import { merchantCoverage, evidenceOf, EVIDENCE } from '../src/governance/briefing.js';
import { validatePlay } from '../src/governance/plays.js';
import { marketDesign, designEconomics } from '../src/briefing/plays.js';

const without = (m, key) => ({ ...m, comparison: { ...m.comparison, economics: { ...m.comparison.economics, [key]: undefined } } });

test('a market with no merchant curve is priced exactly as before', () => {
  for (const m of markets){
    if (!m.comparison?.economics || m.comparison.engineReady === false) continue;
    if (m.comparison.economics.merchantCurve !== undefined) continue;
    const a = runCase(m, baseStrategy(m), 5), b = runCase(without(m, 'merchantCurve'), baseStrategy(m), 5);
    if (a.na) continue;
    assert.deepEqual(a.eb, b.eb, `${m.manifest.id}: cash flows moved without a curve`);
  }
});

test('the merchant curve scales the arbitrage leg only, from year 2', () => {
  const ro = byId('ro');
  const withCurve = runCase(ro, 'mer', 5), flat = runCase(without(ro, 'merchantCurve'), 'mer', 5);
  assert.equal(withCurve.mchY[0], flat.mchY[0], 'year 1 is the seed: the curve starts at 1.00');
  const e = ro.comparison.economics;
  const merch1 = e.merchGross * (1 - e.feePct / 100);
  /* Year 3: the gap between the two runs is the arbitrage leg's 6.6% fall, degraded. */
  const fx = withCurve.fxRate, d3 = Math.pow(1 - e.degr / 100, 2);
  assert.ok(Math.abs((flat.mchY[2] - withCurve.mchY[2]) - merch1 * (1 - 0.934) * fx * d3) < 1, 'only the arbitrage leg moves');
  assert.ok(withCurve.irrHold < flat.irrHold);
});

test('Romania and Poland carry valid dated curves; a bad curve is refused', () => {
  for (const id of ['ro', 'pl']) assert.deepEqual(validateMerchantVintage(byId(id), 'mer'), []);
  const ro = byId('ro');
  const bad = { ...ro, comparison: { ...ro.comparison, economics: { ...ro.comparison.economics, merchantCurve: [0.9, 0.8] } } };
  assert.ok(validateMerchantVintage(bad, 'mer').some(p => /start at 1\.00/.test(p)));
});

test('merchant-line coverage marks the four lines as the plan does', () => {
  const marker = (id) => merchantCoverage(byId(id).comparison);
  assert.equal(marker('ro').marker, EVIDENCE.FAIR, 'observed level, path fitted on another market');
  assert.equal(marker('pl').marker, EVIDENCE.FAIR);
  assert.equal(marker('de').marker, EVIDENCE.THIN, 'day-ahead paid 73% of the line');
  assert.equal(marker('it').marker, EVIDENCE.THIN, 'day-ahead paid 63% of the line');
  assert.ok(Math.abs(marker('de').coverage - 0.733) < 0.001);
  assert.ok(Math.abs(marker('it').coverage - 0.626) < 0.001);
  assert.equal(merchantCoverage(byId('gb').comparison), null, 'no observed series declared: not marked by this rule');
});

test('a play is marked no stronger than a merchant line that carries most of its revenue', () => {
  const econ = (share, marker) => ({ priced: true, eligible: true, weakInputs: [], merchantLine: { marker, share } });
  assert.equal(evidenceOf(econ(0.8, EVIDENCE.THIN), ['official', 'derived']), EVIDENCE.THIN);
  assert.equal(evidenceOf(econ(0.3, EVIDENCE.THIN), ['official', 'derived']), EVIDENCE.STRONG, 'a mostly secured play is not capped');
  assert.equal(evidenceOf(econ(0.8, EVIDENCE.STRONG), ['practitioner']), EVIDENCE.THIN, 'the cap never lifts a marker');
});

test('a play may carry its own grant, and the briefing prices it', () => {
  const pl = byId('pl'), design = marketDesign(pl);
  const plain = designEconomics(pl, design, 'mer', 4);
  const awarded = designEconomics(pl, design, 'mer', 4, { grantPct: 37.9 });
  assert.ok(awarded.hold > plain.hold + 0.05, 'a 37.9% grant moves the hold IRR materially');
  assert.ok(awarded.value > 0 && plain.value < 0);
  const play = { id: 'pl-grant-4h', label: ['a', 'b'], route: 'mer', hours: 4, stage: 'ready-to-build', grantPct: 37.9,
    why: ['a', 'b'], action: { text: ['a', 'b'], due: null }, author: 'analyst', asOf: '2026-10-23', lockedUntil: null };
  assert.deepEqual(validatePlay(play, 'pl-grant-4h'), []);
  assert.ok(validatePlay({ ...play, grantPct: 90 }, 'pl-grant-4h').some(p => /grantPct/.test(p)));
});
