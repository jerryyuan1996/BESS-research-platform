/* ---------------------------------------------------------------------------
   WHAT THE SITE PUBLISHES TODAY.

   The companion to tests/baseline.test.js, which proves the ENGINE reproduces
   the prototype on the prototype's own inputs. This file pins the ASSUMPTIONS —
   the 2026-07-30 revision that followed the external review in
   docs/external-view.md — and the structural behaviour those assumptions rely on.

   The two files fail for opposite reasons, and that is the point:

     baseline.test.js fails      → the engine's arithmetic changed. A regression.
     current-model.test.js fails → an assumption moved. Possibly correct, and
                                   the diff is the evidence a reviewer reads.

   A failure here is therefore never automatically a bug. It is a prompt to check
   the number against its source, and to update this file in the same commit that
   updates the assumption — which is what makes the change reviewable.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import { byId } from '../src/markets/registry.js';
import { runCase, runBaseCase } from '../src/comparison/engine.js';
import { baseStrategy, securedTenor } from '../src/comparison/strategies.js';
import { capacityRevenuePerMW, servicesFactor } from '../src/comparison/capacityLine.js';
import { OEM_CAPEX_MULTIPLIER } from '../src/comparison/sponsorAssumptions.js';
import { LIFE } from '../src/comparison/assumptions.js';
import { sizeProjectDebt, riskClassFor, DEBT_CONVENTIONS } from '../src/economics/projectDebt.js';

const near = (a, b, tol, label) =>
  assert.ok(Math.abs(a - b) <= tol, `${label}: got ${a}, expected ${b} ± ${tol}`);

/* ---------------------------------------------------------------------------
   1 · The capacity line is derived, and the derivation is the published number
   --------------------------------------------------------------------------- */

test('every capacity line equals price × de-rating, computed not asserted', () => {
  for (const id of ['wa', 'gb', 'ie', 'pl']){
    const e = byId(id).comparison.economics;
    assert.ok(e.capacity, `${id}: must declare its capacity components`);
    assert.equal(e.contracted, capacityRevenuePerMW(e.capacity),
      `${id}: contracted revenue must be derived from the declared components`);
  }
});

test('Poland carries the December 2025 auction, not the December 2024 one', () => {
  const c = byId('pl').comparison.economics.capacity;
  assert.equal(c.price, 465.02, 'PLN/kW/yr, 2030 delivery');
  assert.equal(c.derating, 0.1339, 'KWD availability correction factor for BESS');
  assert.equal(c.deliveryYear, 2030);
  // ≈€14,481/MW/yr — down 63% from the €39,585 the prototype carried.
  near(byId('pl').comparison.economics.contracted, 14481, 1, 'PL contracted');
});

test('Ireland carries the 2029/30 auction, not the 2028/29 one', () => {
  const c = byId('ie').comparison.economics.capacity;
  assert.equal(c.price, 135.50, '€/kW/yr — supersedes €149.96 for 2028/29');
  near(byId('ie').comparison.economics.contracted, 89430, 1, 'IE contracted');
});

test('WA prices the surplus-adjusted RCP, not the benchmark', () => {
  const c = byId('wa').comparison.economics.capacity;
  assert.equal(c.unit, 'MW', 'the RCM pays against capacity credits, not per kW');
  assert.equal(c.price, 422372, 'A$/MW/yr — BRCP is A$488,500 (ERA final), but AEMO forecasts a surplus');
  // Corroborated independently: the 10-yr fixed election is ~A$844.7m for 200 MW.
  near(844.7e6 / 200 / 10, c.price, 100, 'fixed-election implied RCP');
});

/* ---------------------------------------------------------------------------
   2 · Duration is a position, and each one has a reason
   --------------------------------------------------------------------------- */

test('archetype durations match the products each market actually pays for', () => {
  // GB: 4h+5h won more de-rated capacity than 2h in T-4 2029/30.
  assert.equal(byId('gb').comparison.archetype.durationHours, 4);
  // WA: the ERA benchmark facility is 6h; the 7th hour is the buffer.
  assert.equal(byId('wa').comparison.archetype.durationHours, 7);
  // Japan: LTDA Round 3 abolished the 3-6h bracket. Below 6h you cannot bid.
  for (const id of ['jp_tokyo', 'jp_kyushu', 'jp_hokkaido']){
    assert.ok(byId(id).comparison.archetype.durationHours >= 6, `${id} must be LTDA-eligible`);
  }
});

test('every allocation market carries the 10% sponsor capex reduction', () => {
  const expected = {
    wa:3276000,
    nem:1386000,
    gb:810000,
    de:841500,
    it:792000,
    ie:1044000,
    ro:567000,
    pl:873000,
    jp_tokyo:324000000,
    jp_kyushu:324000000,
    jp_hokkaido:324000000,
    pjm:1202400,
    ercot:865728,
    caiso:1202400,
  };

  assert.equal(OEM_CAPEX_MULTIPLIER, 0.90);
  for (const [id, capex] of Object.entries(expected)){
    const cmp = byId(id).comparison;
    assert.equal(cmp.economics.capexPerMW, capex, `${id}: sponsor capex`);
    assert.equal(cmp.ranges.capexPerMW.seed, capex, `${id}: Lab seed`);
  }
});

test('WA applies the sponsor OEM buying position to the ERA unit cost', () => {
  const cmp = byId('wa').comparison;
  const perKWh = cmp.economics.capexPerMW / (cmp.archetype.durationHours * 1000);
  near(perKWh, 520 * OEM_CAPEX_MULTIPLIER, 0.5, 'A$/kWh after sponsor adjustment');
});

test('GB applies the sponsor OEM buying position to its unit cost', () => {
  const cmp = byId('gb').comparison;
  const perKWh = cmp.economics.capexPerMW / (cmp.archetype.durationHours * 1000);
  near(perKWh, 225 * OEM_CAPEX_MULTIPLIER, 1, 'GBP/kWh after sponsor adjustment');
});

/* ---------------------------------------------------------------------------
   3 · Services curves model a regime change, not a trend
   --------------------------------------------------------------------------- */

test('Ireland’s services line steps at FASS rather than drifting', () => {
  const curve = byId('ie').comparison.economics.servicesCurve;
  assert.ok(Array.isArray(curve) && curve.length === LIFE);
  assert.equal(curve[0], 1.00, 'yr 1 — DS3 runs to end-2026');
  // The step: FASS competitive auctions replace a fixed tariff in year 3.
  assert.ok(curve[1] - curve[2] > 0.3, 'the yr2→yr3 fall must be a step, not a drift');
  assert.ok(curve[LIFE - 1] < 0.25, 'the tail settles at a competitive floor');
  // Monotone: a saturating market does not recover inside the window.
  for (let i = 1; i < curve.length; i++){
    assert.ok(curve[i] <= curve[i - 1], `curve must not rise at index ${i}`);
  }
});

test('Romania’s ancillary leg decays while its merchant leg does not', () => {
  const e = byId('ro').comparison.economics;
  assert.ok(Array.isArray(e.servicesCurve));
  near(e.services * e.servicesCurve[4], 10000, 500, 'yr-5 services after saturation');
  // €110k merchant + €30k services = the €140/kW/yr external assessment.
  assert.equal(e.merchGross + e.services, 140000);
});

test('a services curve reaches the engine and moves the answer', () => {
  const ie = byId('ie');
  const withCurve = runCase(ie, 'cap', 10);

  const flat = {
    manifest: ie.manifest,
    comparison: {
      ...ie.comparison,
      economics: { ...ie.comparison.economics, servicesCurve: undefined },
    },
  };
  const withoutCurve = runCase(flat, 'cap', 10);

  assert.ok(withCurve.mchY[0] === withoutCurve.mchY[0],
    'year 1 is unaffected — the curve starts at 1.00');
  assert.ok(withCurve.mchY[5] < withoutCurve.mchY[5],
    'later years must be lower with the curve applied');
  assert.ok(withCurve.irrHold < withoutCurve.irrHold,
    'modelling the DS3 cliff must reduce the return, not decorate it');
});

test('servicesFactor holds its last value rather than falling to zero', () => {
  assert.equal(servicesFactor([1, 0.5, 0.3], 99), 0.3);
  assert.equal(servicesFactor(undefined, 5), 1, 'no curve means no adjustment');
  assert.equal(servicesFactor([], 5), 1);
});

/* ---------------------------------------------------------------------------
   4 · The toll is modelled as the precedent reads
   --------------------------------------------------------------------------- */

test('GB’s toll runs ten years, keeps the CM, and leaves a merchant tail', () => {
  const e = byId('gb').comparison.economics;
  assert.equal(e.tollYears, 10, 'Drax/Fidra precedent');
  assert.equal(e.tollAdditiveWithCapacity, true, 'the owner retains CM revenue');
  assert.equal(e.tollRevertsToMerchant, true);

  const r = runCase(byId('gb'), 'toll', 10);
  const fx = 1.27;

  // Years 1-10 carry the toll AND the capacity payment, not one or the other.
  near(r.capY[0], (e.toll + e.contracted) * fx, 1, 'yr-1 contracted stream');
  assert.equal(r.mchY[0], 0, 'no merchant revenue while the toll runs');

  // Year 11 onward: the toll is gone, the CM continues, the asset is merchant.
  assert.ok(r.capY[10] > 0 && r.capY[10] < r.capY[9], 'the toll drops out at yr 11');
  assert.ok(r.mchY[10] > 0, 'the asset reverts to merchant, not to nothing');

  assert.equal(securedTenor(byId('gb'), 'toll'), 10,
    'secured tenor is the toll’s own, never the modelled life');
});

/* ---------------------------------------------------------------------------
   5 · Japan is underwritten on the award, with the clawback modelled
   --------------------------------------------------------------------------- */

test('Japan’s base route is the long-term award', () => {
  for (const id of ['jp_tokyo', 'jp_kyushu', 'jp_hokkaido']){
    assert.equal(baseStrategy(byId(id)), 'ltda', `${id}`);
  }
});

test('the award secures the whole window and never re-auctions inside it', () => {
  const r = runCase(byId('jp_tokyo'), 'ltda', 5);
  assert.ok(!r.na);
  assert.equal(r.securedYears, LIFE, 'a 20-yr CRA does not roll off inside 15 years');
  assert.ok(r.aucY.every(v => v === 0), 'an award has no auction-renewal component');
  assert.ok(r.securedShare > 0.9, 'the award dominates the stack, by construction');
});

test('the clawback is applied, and is what makes the award non-additive', () => {
  const jp = byId('jp_tokyo');
  const withClawback = runCase(jp, 'ltda', 5);

  const noClawback = {
    manifest: jp.manifest,
    comparison: {
      ...jp.comparison,
      economics: {
        ...jp.comparison.economics,
        ltda: { ...jp.comparison.economics.ltda, merchantRetention: 1 },
      },
    },
  };
  const naive = runCase(noClawback, 'ltda', 5);

  assert.ok(withClawback.mchY[0] < naive.mchY[0] * 0.2,
    'roughly 90% of other-market revenue must be returned');
  assert.ok(withClawback.irrHold < naive.irrHold,
    'ignoring the clawback would overstate Japan');
});

test('the award is priced off cost, not off the published bid ceiling', () => {
  const payment = byId('jp_tokyo').comparison.economics.ltda.payment;
  const perKW = payment / 1000;
  // The FY2026 (Round 4) battery ceiling is ¥70,675-74,417/kW/yr. A bid at the
  // cap would model a bidder with no competitors; Round 3 rejected over half the
  // bid capacity.
  assert.ok(perKW < 70675 * 0.6,
    `a competitive pay-as-bid clearing must sit well below the ceiling (got ¥${perKW}/kW)`);
  assert.ok(perKW > 20000, 'and must still cover annuitised Japanese capex');
});

test('the award does not differentiate the three Japanese regions', () => {
  // It is cost-reflective and costs are national — the same reason the Capacity
  // Market area prices sit within 0.9% of each other. Regional differentiation
  // has to be earned in the market legs, which is the premise of the split.
  const p = ['jp_tokyo', 'jp_kyushu', 'jp_hokkaido']
    .map(id => byId(id).comparison.economics.ltda.payment);
  assert.equal(new Set(p).size, 1);

  // …and the regions still separate on the full case.
  const irrs = ['jp_tokyo', 'jp_kyushu', 'jp_hokkaido']
    .map(id => runBaseCase(byId(id), 5).irrHold);
  assert.ok(new Set(irrs.map(v => v.toFixed(4))).size > 1,
    'the regional lenses must still produce different answers');
});

/* ---------------------------------------------------------------------------
   6 · WA's access haircut
   --------------------------------------------------------------------------- */

test('WA’s fixed-price election is charged against energy revenue, not capacity', () => {
  const wa = byId('wa');
  assert.equal(wa.comparison.economics.naqFactor, 0.90);

  const r = runCase(wa, 'cap', 5);
  const free = {
    manifest: wa.manifest,
    comparison: {
      ...wa.comparison,
      economics: { ...wa.comparison.economics, naqFactor: 1 },
    },
  };
  const rFree = runCase(free, 'cap', 5);

  assert.equal(r.capY[0], rFree.capY[0], 'the capacity payment is untouched');
  near(r.mchY[0], rFree.mchY[0] * 0.9, 1, 'the market legs carry the haircut');
});

/* ---------------------------------------------------------------------------
   7 · Grant caps bind on the scheme's terms, not on a percentage
   --------------------------------------------------------------------------- */

test('Romania’s grant respects the scheme’s ceilings', () => {
  const ro = byId('ro');
  const e = ro.comparison.economics;
  assert.equal(e.grantCapPerMWh, 69000);
  assert.equal(e.grantCapAbsolute, 15000000);

  // At this archetype the percentage binds: 20% of €630k = €126k/MW against a
  // €138k/MW ceiling (€69k/MWh × 2h).
  const r = runCase(ro, 'mer', 5);
  near(r.grant, 630000 * OEM_CAPEX_MULTIPLIER * 0.20 * 1.08, 1, 'grant in USD per MW');

  // Lengthen the duration and the per-MWh cap stops binding; raise capex and it
  // starts to. The point is that it binds at all rather than being decorative.
  const dear = {
    manifest: ro.manifest,
    comparison: {
      ...ro.comparison,
      economics: { ...e, capexPerMW: 1400000 },
    },
  };
  const rDear = runCase(dear, 'mer', 5);
  near(rDear.grant, 69000 * 2 * 1.08, 1, 'the per-MWh cap must bind on a dearer build');
  assert.ok(rDear.grant < 1400000 * 0.20 * 1.08, 'a bare percentage would have sailed past it');
});

/* ---------------------------------------------------------------------------
   8 · Published outcomes — the snapshot
   --------------------------------------------------------------------------- */

test('published base-case outcomes', () => {
  const pct = (v) => Number((v * 100).toFixed(1));
  const expected = {
    //            route    yr-1 yield   15-yr IRR
    wa:          ['cap',   16.2,        13.1],
    // GB moved 2026-10-15: 4h de-rating 0.38 → 0.4396, NESO's published T-4
    // 2029/30 factor (gate G1); capacity line £10,298 → £11,913/MW-yr.
    gb:          ['cap',   10.9,         5.1],
    ie:          ['cap',   14.6,         9.6],
    ro:          ['mer',   26.7,        20.8],
    pl:          ['mer',    8.2,         0.8],
    jp_tokyo:    ['ltda',  11.3,         7.4],
    jp_kyushu:   ['ltda',  11.4,         7.5],
    jp_hokkaido: ['ltda',  11.3,         7.4],
  };

  for (const [id, [route, yield1, irr]] of Object.entries(expected)){
    const m = byId(id);
    assert.equal(baseStrategy(m), route, `${id}: base route`);
    const r = runBaseCase(m, 5);
    assert.equal(pct(r.yield1), yield1, `${id}: year-1 yield`);
    assert.equal(pct(r.irrHold), irr, `${id}: 15-year hold IRR`);
  }
});

test('the ordering the cockpit asks readers to use', () => {
  const irr = (id) => runBaseCase(byId(id), 5).irrHold;

  // Romania leads on the merchant case and Poland no longer leads on certainty —
  // the two headline consequences of this revision.
  assert.ok(irr('ro') > irr('wa'), 'Romania’s revised revenue puts it top');
  assert.ok(irr('wa') > irr('ie'), 'WA’s 7h build beats Ireland');
  assert.ok(irr('pl') < irr('ie'), 'Poland falls below Ireland on the KWD cut');

  // Poland's new-entry screen no longer inherits the final main-auction award.
  // The legacy route remains available for vintage analysis, but is not the
  // replicable default presented to a new entrant.
  const pl = runBaseCase(byId('pl'), 5);
  assert.equal(pl.securedYears, 0, 'new-entry base has no secured capacity tenor');
  const legacyPl = runCase(byId('pl'), 'cap', 5);
  assert.equal(legacyPl.securedYears, 15, 'legacy 17-yr award remains a vintage scenario');
  assert.ok(legacyPl.securedShare < 0.20, 'legacy route secures under a fifth of revenue');
});

/* ---------------------------------------------------------------------------
   9 · Project debt
   --------------------------------------------------------------------------- */

test('debt sizing is bounded by coverage or by the gearing ceiling, never neither', () => {
  for (const id of ['wa', 'gb', 'ie', 'ro', 'pl', 'jp_tokyo']){
    const m = byId(id);
    const s = baseStrategy(m);
    const d = sizeProjectDebt(runCase(m, s, 5), { exitYear: 5, riskClass: riskClassFor(m, s) });
    assert.ok(d, `${id}: sizing must produce a result`);
    assert.ok(d.gearing > 0 && d.gearing <= DEBT_CONVENTIONS.maxGearingSecured + 1e-9,
      `${id}: gearing ${d.gearing} out of range`);
    assert.ok(d.ceilingBinds || d.coverageBinds, `${id}: nothing bound the sizing`);
    assert.ok(d.minDSCR >= DEBT_CONVENTIONS.dscrSecured - 1e-9,
      `${id}: minimum DSCR ${d.minDSCR} breaches the contracted test`);
  }
});

test('an auction-renewal stream supports no term debt beyond the year it secured', () => {
  // The rule that separates a one-year Japanese capacity award from a
  // seventeen-year Polish contract, however similar their secured share looks.
  assert.equal(DEBT_CONVENTIONS.rolloverAllowance['auction-renewal'], 0);

  const jp = byId('jp_tokyo');
  const cap = sizeProjectDebt(runCase(jp, 'cap', 5),
    { exitYear: 5, riskClass: 'auction-renewal' });
  const award = sizeProjectDebt(runCase(jp, 'ltda', 5),
    { exitYear: 5, riskClass: 'ltda' });

  assert.equal(cap.trancheA.tenor, 1, 'one delivery year secured, no rollover allowed');
  assert.ok(award.trancheA.tenor >= 10, 'a 20-year award funds a full-tenor tranche');
  assert.ok(award.securedDebtShare > cap.securedDebtShare,
    'the award must carry more of its debt on contracted cash flow');
});

test('a toll never funds debt past its own tenor', () => {
  const gb = byId('gb');
  const d = sizeProjectDebt(runCase(gb, 'toll', 10), { exitYear: 10, riskClass: 'toll' });
  assert.equal(DEBT_CONVENTIONS.rolloverAllowance.toll, 0);
  assert.ok(d.trancheA.tenor <= gb.comparison.economics.tollYears,
    'tranche A must amortise inside the toll');
  assert.equal(d.merchantTailFrom, 11, 'the merchant tail is reported, not hidden');
});

test('leverage is not automatically accretive, and the model says so', () => {
  // The sponsor capex position makes the base Japan award accretive. A stressed
  // cost case still dilutes equity, proving the debt model responds to the
  // return-vs-cost spread instead of forcing a positive leverage effect.
  const jp = byId('jp_tokyo');
  const d = sizeProjectDebt(runCase(jp, 'ltda', 5), { exitYear: 5, riskClass: 'ltda' });
  assert.ok(d.irrLevered > d.irrUnlevered,
    'Japan: the sponsor cost case now earns above the debt cost');

  const stressed = {
    ...jp,
    comparison:{
      ...jp.comparison,
      economics:{ ...jp.comparison.economics, capexPerMW:jp.comparison.economics.capexPerMW * 1.25 },
    },
  };
  const ds = sizeProjectDebt(runCase(stressed, 'ltda', 5), { exitYear: 5, riskClass: 'ltda' });
  assert.ok(ds.irrLevered < ds.irrUnlevered, 'a stressed cost case must still show dilution');

  const wa = byId('wa');
  const dw = sizeProjectDebt(runCase(wa, 'cap', 5), { exitYear: 5, riskClass: 'contracted' });
  assert.ok(dw.irrLevered > dw.irrUnlevered, 'WA: a contract above the debt rate must accrete');
});

test('a merchant-only project funds no contracted tranche at all', () => {
  const ro = byId('ro');
  const d = sizeProjectDebt(runCase(ro, 'mer', 5), { exitYear: 5, riskClass: 'merchant' });
  assert.equal(d.trancheA.amount, 0);
  assert.equal(d.securedDebtShare, 0);
  assert.ok(d.gearing <= DEBT_CONVENTIONS.maxGearingMarket + 1e-9,
    'and is held to the merchant gearing ceiling');
  assert.ok(d.minDSCR >= DEBT_CONVENTIONS.dscrMarket - 1e-9,
    'against the merchant coverage test, not the contracted one');
});

test('debt conventions stay inside the bands the market reported', () => {
  const c = DEBT_CONVENTIONS;
  assert.equal(c.dscrSecured, 1.15);
  assert.equal(c.dscrMarket, 2.00);
  assert.ok(c.legalTenorCap >= 7 && c.legalTenorCap <= 10, '7-10 year hard mini-perm');
  assert.ok(c.maxGearingSecured <= 0.75 && c.maxGearingMarket <= 0.60);
  assert.ok(c.baseRate > 0 && c.margin > 0);
  // Amortisation cannot outrun the battery warranty.
  assert.ok(c.warrantyTenor <= c.notionalProfile);
});
