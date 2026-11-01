/* ---------------------------------------------------------------------------
   DESIGN FIT — the route and the duration a market pays for.

   src/comparison/designFit.js, Part A of docs/duration-and-route-fit-plan.md
   (approved 2026-10-15). Held here:

     1. IT IS THE ENGINE. At the archetype every rescaling factor is exactly 1,
        so every route reproduces runCase to the bit, at every exit year, in
        every market. And running the sweep moves no number the engine publishes.
     2. THE RULES OF THE SWEEP. A toll is priced only where it was quoted; an
        award follows its payment basis; a binary floor closes a route below it;
        a linear floor de-rates as the battery fades; capex follows the stack.
     3. DECISION 6. A floor is tested at the end of the term unless the caller
        asks for COD only, and the duration that would hold it is reported.
     4. THE BAND IS CAPITAL. Every design in it is within the tolerance of the
        best, measured against the archetype's net capital.

   No fit is pinned. These are mechanics; what each market's fit IS moves with
   its inputs, which is the point of computing it.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import { markets, byId } from '../src/markets/registry.js';
import { runCase, runBaseCase, degradationFactor } from '../src/comparison/engine.js';
import { supportedStrategies, baseStrategy } from '../src/comparison/strategies.js';
import { buildCapex } from '../src/comparison/capex.js';
import { DESIGN_FIT_TOLERANCE } from '../src/comparison/assumptions.js';
import {
  sweepDesign, fitOf, marketAt, floorOf, termCheck, validateDurationResponse, FLOOR_KIND,
} from '../src/comparison/designFit.js';
import {
  AUTHORITY, comparisonAuthority, canMachineWrite, canMachinePropose,
} from '../src/governance/authority.js';

const priced = markets.filter(m => !runBaseCase(m, 5).na);
const near = (a, b, tol, label) => assert.ok(Math.abs(a - b) <= tol, `${label}: got ${a}, expected ${b} ± ${tol}`);

const KEYS = ['irrHold', 'irrExit', 'net', 'moic', 'payback', 'securedShare', 'securedYears', 'exitVal', 'capexG', 'grant'];
const picked = (r) => r.na ? { na: r.na }
  : Object.fromEntries(KEYS.map(k => [k, r[k]]).concat([['holdFlows', [...r.holdFlows]], ['eb', [...r.eb]]]));

test('every market\'s duration response is well formed, and every priced market declares one', () => {
  const problems = markets.flatMap(validateDurationResponse);
  assert.deepEqual(problems, []);
  for (const m of priced){
    assert.ok(m.comparison.durationResponse, `${m.manifest.id}: a priced market must say how it pays for the next hour`);
  }
});

test('at the archetype, every route reproduces the engine to the bit, at every exit year', () => {
  for (const m of priced){
    const h0 = m.comparison.archetype.durationHours;
    for (const s of supportedStrategies(m)){
      const variant = marketAt(m, s.id, h0);
      assert.ok(!variant.na, `${m.manifest.id}/${s.id}: the archetype must always be priceable`);
      for (const X of [0, 5, 7, 10]){
        assert.deepEqual(picked(runCase(variant, s.id, X)), picked(runCase(m, s.id, X)),
          `${m.manifest.id}/${s.id} at exit year ${X}: the sweep is not the engine at the archetype`);
      }
    }
  }
});

test('the archetype point is the engine\'s own value when floors are tested at COD only', () => {
  for (const m of priced){
    const sweep = sweepDesign(m, { termTest: false });
    const base = baseStrategy(m);
    const point = sweep.points.find(p => p.route === base && p.archetype);
    const r = runCase(m, base, 0);
    assert.equal(point.priced, true, `${m.manifest.id}: the base design must be priced`);
    assert.equal(point.value, r.exitVal - r.net, `${m.manifest.id}: value is the exit value at COD less net capital`);
  }
});

test('running the sweep moves no number the engine publishes', () => {
  const snap = () => Object.fromEntries(markets.map(m => [m.manifest.id, picked(runBaseCase(m, 5))]));
  const before = snap();
  for (const m of markets){ sweepDesign(m); fitOf(m); }
  assert.deepEqual(snap(), before);
});

test('a toll is priced only at the duration its price was quoted at', () => {
  for (const m of priced){
    if (!supportedStrategies(m).some(s => s.id === 'toll')) continue;
    const quoted = m.comparison.durationResponse.routeRules?.toll?.quotedHours ?? m.comparison.archetype.durationHours;
    for (const p of sweepDesign(m).points.filter(p => p.route === 'toll')){
      if (p.hours === quoted) assert.equal(p.priced, true, `${m.manifest.id}: toll at its quoted ${quoted}h`);
      else {
        assert.equal(p.priced, false, `${m.manifest.id}: a toll at ${p.hours}h would be an invented price`);
        assert.match(p.reason[0], /quoted/);
      }
    }
  }
});

test('an award paid per MWh scales with energy; one paid per kW does not', () => {
  const it = byId('it');
  const at8 = marketAt(it, 'ltda', 8);
  assert.equal(at8.comparison.economics.ltda.payment, it.comparison.economics.ltda.payment * 2,
    'MACSE pays per MWh of storage, so eight hours earns twice the four-hour award');
  const jp = byId('jp_tokyo');
  assert.equal(marketAt(jp, 'ltda', 8).comparison.economics.ltda.payment, jp.comparison.economics.ltda.payment,
    'the LTDA pays per kW, so a longer battery earns the same award');
  const nem = byId('nem');
  const cis = sweepDesign(nem).points.filter(p => p.route === 'ltda');
  assert.deepEqual(cis.filter(p => p.priced).map(p => p.hours), [4], 'the CIS floor is estimated for four hours only');
});

test('a binary floor closes the route below it, and decision 6 tests it at the end of the term', () => {
  const jp = byId('jp_tokyo');
  const floor = floorOf(jp, 'ltda');
  assert.deepEqual([floor.hours, floor.termYears, floor.kind, floor.holdForTerm], [6, 20, FLOOR_KIND.BINARY, true]);

  const strict = sweepDesign(jp).points.filter(p => p.route === 'ltda');
  const at = (h) => strict.find(p => p.hours === h);
  assert.equal(at(4).priced, false, 'a four-hour battery cannot bid below the six-hour floor');
  assert.equal(at(6).priced, true);
  assert.equal(at(6).eligible, false, 'six hours at COD fades below six long before year 20');
  near(at(6).term.usableAtTermEnd, 6 * Math.pow(0.98, 19), 1e-9, 'usable hours in year 20');
  near(at(6).term.requiredHours, 6 / Math.pow(0.98, 19), 1e-9, 'the build that would hold the floor');
  assert.equal(at(6).term.usableAtTermEnd, 6 * degradationFactor(jp.comparison.economics, 20),
    'the floor test uses the engine\'s own fade');

  const lenient = sweepDesign(jp, { termTest: false }).points.find(p => p.route === 'ltda' && p.hours === 6);
  assert.equal(lenient.eligible, true, 'tested at COD only, six hours clears a six-hour floor');
  assert.equal(lenient.value, at(6).value, 'a binary floor changes eligibility, never the cash flows');

  const fit = fitOf(jp);
  /* Since 2026-10-16 the archetype is the 9h build that holds the floor
     (docs/japan-ltda-repricing-plan.md, decision 5), so it is eligible and is
     the route's best: nothing longer earns more award. */
  assert.equal(jp.comparison.archetype.durationHours, 9);
  assert.equal(fit.archetype.eligible, true);
  /* Since PR 8 the grid reaches nine hours, the smallest declared build that holds
     the floor to year 20, so the route prices a design instead of reporting only the
     hours that would hold (docs/japan-ltda-floor-plan.md). */
  assert.equal(at(8).eligible, false, 'eight hours still fades below six before year 20');
  assert.equal(at(9).eligible, true, 'nine hours holds 6.13h in year 20');
  near(at(9).term.usableAtTermEnd, 9 * Math.pow(0.98, 19), 1e-9);
  assert.equal(fit.byRoute.ltda.best.hours, 9, 'the cheapest build that holds the floor is the route\'s best');
  assert.equal(marketAt(jp, 'ltda', 9).comparison.economics.ltda.payment, jp.comparison.economics.ltda.payment,
    'at the archetype the award is its own bid');
  assert.equal(marketAt(jp, 'ltda', 10).comparison.economics.ltda.payment, jp.comparison.economics.ltda.payment,
    'a longer build earns the same award: it is paid per kW (the market reading of 2026-10-16)');
});

test('a linear floor de-rates WA\'s credits with duration, and year by year as the battery fades', () => {
  const wa = byId('wa');
  const floor = floorOf(wa, 'cap');
  assert.deepEqual([floor.hours, floor.termYears, floor.kind], [7, 10, FLOOR_KIND.LINEAR]);

  const e = wa.comparison.economics;
  near(marketAt(wa, 'cap', 4).comparison.economics.contracted, e.contracted * 4 / 7, 1e-6, '4h earns 4/7 of the credits');
  assert.equal(marketAt(wa, 'cap', 8).comparison.economics.contracted, e.contracted, 'credits stop growing at the requirement');

  const strict = sweepDesign(wa).points.find(p => p.route === 'cap' && p.hours === 7);
  const lenient = sweepDesign(wa, { termTest: false }).points.find(p => p.route === 'cap' && p.hours === 7);
  assert.ok(strict.value < lenient.value, 'fading below seven hours costs credits under decision 6');
  assert.equal(strict.eligible, true, 'a linear floor de-rates; it never closes the route');
  near(termCheck(wa, floor, 7).usableAtTermEnd, 7 * Math.pow(0.98, 9), 1e-9, 'usable hours at the end of the election');

  /* The year-10 capacity line, recomputed by hand: credits in proportion to
     usable duration below seven hours. */
  const r = runCase(wa, 'cap', 0, { capacityFactors: Array.from({ length: 15 }, (_, i) =>
    Math.min(1, 7 * Math.pow(0.98, i) / 7)) });
  near(r.capY[9], runCase(wa, 'cap', 0).capY[9] * Math.pow(0.98, 9), 1e-6, 'year-10 credits');
});

test('the engine\'s capacity factor is exactly neutral when absent', () => {
  for (const m of priced){
    for (const s of supportedStrategies(m)){
      const ones = { capacityFactors: Array(15).fill(1) };
      assert.deepEqual(picked(runCase(m, s.id, 5, ones)), picked(runCase(m, s.id, 5)),
        `${m.manifest.id}/${s.id}: a factor of one must change nothing`);
    }
  }
});

test('capex follows the component stack and stays the authority at the archetype', () => {
  const gb = byId('gb');
  const e = gb.comparison.economics;
  const expected = e.capexPerMW * buildCapex(e.capexStack, 8).total / buildCapex(e.capexStack, 4).total;
  assert.equal(marketAt(gb, 'mer', 8).comparison.economics.capexPerMW, expected);
  assert.ok(expected < 2 * e.capexPerMW, 'the power side is bought once, so doubling the energy costs less than double');
  assert.equal(marketAt(gb, 'mer', 4).comparison.economics.capexPerMW, e.capexPerMW);
});

test('Poland\'s capacity line scales to four hours and no further (gate DG-1, 2026-10-15)', () => {
  /* One 13.39% factor for every duration, applied to certified capacity, which
     must be deliverable for four uninterrupted hours: a shorter battery
     certifies MWh ÷ 4. */
  const pl = byId('pl');
  const e = pl.comparison.economics;
  for (const h of pl.comparison.durationResponse.hours){
    near(marketAt(pl, 'cap', h).comparison.economics.contracted, e.contracted * Math.min(1, h / 4), 1e-6,
      `${h}h: 13.39% of certified capacity, min(MW, MWh ÷ 4)`);
  }
});

test('GB\'s capacity line carries NESO\'s published 4h factor, and its shape is the same table', () => {
  const gb = byId('gb');
  const c = gb.comparison.economics.capacity;
  assert.equal(c.derating, 0.4396, 'T-4 2029/30, Capacity Auction Guidelines Table 3 (gate G1)');
  near(gb.comparison.economics.contracted, 27.10 * 1000 * 0.4396, 1e-6, 'capacity line per MW');
  const dr = gb.comparison.durationResponse;
  assert.equal(dr.capacityDerating[dr.hours.indexOf(4)], c.derating, 'shape and level agree at the archetype');
});

test('services do not scale with duration; merchant revenue follows the capture curve', () => {
  const de = byId('de');
  const e = de.comparison.economics;
  const at8 = marketAt(de, 'mer', 8).comparison.economics;
  assert.equal(at8.services, e.services, 'services are bought in MW');
  near(at8.merchGross, e.merchGross * 2 * (0.55 / 0.75), 1e-6, 'twice the energy at 0.55/0.75 of the 4h rate');
});

test('PJM renewals use each duration’s own non-binding credit, not the secured-year ratio', () => {
  const pjm = byId('pjm');
  const four = marketAt(pjm, 'cap', 4).comparison.economics;
  const six = marketAt(pjm, 'cap', 6).comparison.economics;
  const ten = marketAt(pjm, 'cap', 10).comparison.economics;
  assert.equal(four.auctionRenewalCurve[1], 500 * 365 * .42, '2030/31 4h');
  assert.equal(six.auctionRenewalCurve[1], 500 * 365 * .52, '2030/31 6h');
  assert.equal(ten.auctionRenewalCurve[1], 500 * 365 * .66, '2030/31 10h');
  near(six.securedContracted, pjm.comparison.economics.securedContracted * .68 / .59, 1e-6, 'secured year retains its published duration ratio');
  assert.deepEqual(four.auctionRenewalCurve, pjm.comparison.economics.auctionRenewalCurve);
  assert.deepEqual(validateDurationResponse(pjm), []);
  const incomplete = { ...pjm, comparison: { ...pjm.comparison, durationResponse: {
    ...pjm.comparison.durationResponse, auctionRenewalCurves: { 4: four.auctionRenewalCurve },
  } } };
  assert.ok(validateDurationResponse(incomplete).some(x => x.includes('auctionRenewalCurves.6')));
  assert.ok(marketAt(incomplete, 'cap', 6).na, 'missing duration must not silently use fixed-ratio scaling');
});

test('the band is measured in capital, and holds the best design', () => {
  for (const m of priced){
    const sweep = sweepDesign(m);
    const fit = fitOf(m, { sweep });
    if (!fit.best) continue;
    const base = sweep.points.find(p => p.route === sweep.baseRoute && p.archetype);
    near(fit.tolerance, DESIGN_FIT_TOLERANCE * base.net, 1e-6, `${m.manifest.id}: tolerance`);
    assert.ok(fit.band.some(b => b.route === fit.best.route && b.hours === fit.best.hours), `${m.manifest.id}: best is in its band`);
    for (const b of fit.band) assert.ok(b.value >= fit.best.value - fit.tolerance - 1e-9, `${m.manifest.id}: band member`);
    if (fit.archetype?.inBand && fit.best.route === fit.archetype.route && fit.best.hours === fit.archetype.hours){
      assert.deepEqual(fit.restsOnWeakInput, [], `${m.manifest.id}: the archetype rests on the engine's own lines`);
    }
  }
});

test('a market whose inputs are pending is not swept', () => {
  /* Finland was the case until 2026-10-17; it is priced now, so the rule is
     held on Finland as it was, unready. */
  const fi = byId('fi');
  const pending = { ...fi, comparison: { ...fi.comparison, engineReady: false } };
  assert.ok(sweepDesign(pending).na, 'an unready market must not acquire a fit by the back door');
  assert.ok(!sweepDesign(fi).na, 'Finland, engine-ready since 2026-10-17, is swept');
});

test('who may change the duration response: curves are proposable, the grid and the readings are not', () => {
  for (const path of ['durationResponse.capacityDerating', 'durationResponse.merchantCapture', 'durationResponse.opexEnergyShare',
                      'durationResponse.routeRules.ltda.quotedHours', 'durationResponse.routeRules.cap.floorHours']){
    assert.equal(comparisonAuthority(path), AUTHORITY.ANALYST, path);
    assert.ok(canMachinePropose(comparisonAuthority(path)) && !canMachineWrite(comparisonAuthority(path)), path);
  }
  for (const path of ['durationResponse.hours', 'durationResponse.merchantCaptureBasis',
                      'durationResponse.routeRules.ltda.paymentBasis', 'durationResponse.routeRules.cap.floorKind',
                      'durationResponse.routeRules.ltda.holdForTerm', 'durationResponse.routeRules.toll.unknownLeaf']){
    assert.equal(comparisonAuthority(path), AUTHORITY.METHODOLOGY, path);
    assert.ok(!canMachinePropose(comparisonAuthority(path)), path);
  }
});
