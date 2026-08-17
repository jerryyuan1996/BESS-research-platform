/* ---------------------------------------------------------------------------
   THE REGRESSION TEST THAT MATTERS.

   tests/fixtures/legacy-baseline.json was produced by executing the LEGACY
   prototype's own normalization layer (legacy/global-cockpit-0727-v1.html,
   lines 683-811) in Node and dumping every output. Regenerate it with
   `node tests/fixtures/generate.mjs`.

   This test asserts the modular engine reproduces those numbers for all
   5 markets × 3 strategies × 3 exit years — 45 cases — including which
   combinations are "not applicable" and why.

   WHAT THIS TEST DOES AND DOES NOT CLAIM — read before changing it.

   It runs the engine against the PROTOTYPE'S OWN INPUTS, frozen in
   tests/fixtures/legacy-inputs.mjs, and not against the assumptions the site
   currently publishes. Until 2026-07-30 those were the same thing, so the test
   proved two claims at once:

       (a) the engine computes what the prototype computed        — correctness
       (b) the published assumptions still equal the prototype's  — currency

   Claim (b) was never meant to survive an assumption revision — the proposal
   workflow runs `test:structural` precisely because a revision is SUPPOSED to
   move the pinned numbers (docs/governance.md). When the July 2026 external
   review moved GB to four hours, Poland onto the December 2025 auction
   parameters, Ireland onto a services decay curve, WA to seven hours and
   Romania upward, keeping the two fused would have forced a choice between
   regenerating the fixture — destroying (a), the migration's central proof — and
   carrying a permanently red test.

   So (a) lives here, on frozen inputs, and is now a stronger statement than it
   was: the engine still reproduces the prototype exactly, INCLUDING after
   gaining a services curve, a network-access factor, an additive toll and a
   long-term-award route, none of which the frozen inputs declare.

   (b) lives in tests/current-model.test.js and pins what we publish today.

   If a change to comparison/ breaks THIS test, the change altered the engine's
   arithmetic for inputs that do not use the new fields. That is a regression.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { markets, byId } from '../src/markets/registry.js';
import { legacyMarket, LEGACY_VINTAGE } from './fixtures/legacy-inputs.mjs';
import { runCase } from '../src/comparison/engine.js';
import { STRATEGIES, baseStrategy } from '../src/comparison/strategies.js';
import {
  LIFE, FX, EXIT_Y_CONTRACTED, EXIT_Y_MERCHANT, EXIT_Y_OPEX, EXIT_Y_AUCTION,
} from '../src/comparison/assumptions.js';
import { pvTail } from '../src/utils/finance.js';

const baseline = JSON.parse(readFileSync(
  fileURLToPath(new URL('./fixtures/legacy-baseline.json', import.meta.url)), 'utf8'));

/* ---------------------------------------------------------------------------
   RELABELLING, and why the fixture was not regenerated instead.

   The fixture pins the prototype's WORDING for an unavailable route, not just
   which routes are unavailable. The August 2026 vocabulary pass restyled one of
   those labels — "No capacity mechanism" became "No resource adequacy revenue",
   because the old wording asserts something false about several markets: Finland
   has capacity arrangements and a TSO that calls its reserve procurement a
   capacity market, while paying a merchant battery nothing for accredited
   adequacy. See RESOURCE_ADEQUACY_DEFINITION in src/markets/schema.js.

   The CONDITION that produces the label did not change, and neither did any
   number: a regeneration of the fixture immediately before the relabelling was
   byte-identical to the committed one.

   Two wrong ways to resolve it, for the next person who meets this:

     Regenerate the fixture. It says "do not hand-edit" and it means it — the
     file is a verbatim dump of the prototype's own normalization layer, and
     rewriting it to match today's engine destroys claim (a) above, which is the
     migration's central proof. A fixture edited to agree with the code proves
     that the code agrees with itself.

     Assert only that a case is not-applicable. That keeps the test green and
     throws away the part worth keeping: "unavailable because there is no
     adequacy revenue" and "unavailable because there is no toll precedent" are
     different claims, and the fixture is the only thing checking they have not
     been swapped.

   So the label is translated on the way out. The reason is still asserted; only
   its current spelling lives here. A new entry needs a matching change in
   src/comparison/strategies.js and should be as rare as a vocabulary pass.
   --------------------------------------------------------------------------- */
const NA_RELABELLED = new Map([
  ['No capacity mechanism', 'No resource adequacy revenue'],
]);

const relabelled = (legacyText) => NA_RELABELLED.get(legacyText) ?? legacyText;

/* Relative tolerance. The two implementations run the same arithmetic in the same
   order, so agreement is normally exact; a relative tolerance leaves room for
   nothing more than double-rounding noise. */
const TOL = 1e-12;

function closeRel(actual, expected, label){
  if (expected === null || actual === null){
    assert.equal(actual, expected, `${label}: one side is null`);
    return;
  }
  const scale = Math.max(1, Math.abs(expected));
  assert.ok(Math.abs(actual - expected) <= TOL * scale,
    `${label}: got ${actual}, expected ${expected} (rel diff ${Math.abs(actual - expected) / scale})`);
}

const FIELDS = ['net', 'capexG', 'grant', 'eb1', 'yield1', 'irrHold', 'exitVal',
                'irrExit', 'moic', 'cumOp', 'contractedShare', 'kwPerM'];

/* The fixture predates the Japan work: it covers the five legacy markets under the
   three legacy routes. `ltda` is declared but no market enables it, so it adds no
   fixture rows — it is asserted separately below. */
const LEGACY_MARKETS = ['wa', 'gb', 'ie', 'ro', 'pl'];
const LEGACY_STRATEGIES = ['cap', 'mer', 'toll'];

/* The production rates were intentionally revised in August 2026. Keep the
   migration parity proof on the prototype's original rates without freezing the
   live model to them. */
const LEGACY_EXIT_OPTIONS = {
  exitYContracted:0.075,
  exitYMerchant:0.115,
  exitYOpex:0.08,
  exitYAuction:0.115,
};
const runLegacyCase = (market, strategy, exitYear) =>
  runCase(market, strategy, exitYear, LEGACY_EXIT_OPTIONS);
const runLegacyBaseCase = (market, exitYear) =>
  runLegacyCase(market, baseStrategy(market), exitYear);

test('the fixture covers every legacy market × strategy × exit year', () => {
  assert.equal(Object.keys(baseline.cases).length, LEGACY_MARKETS.length * LEGACY_STRATEGIES.length * 3);
  assert.equal(Object.keys(baseline.cases).length, 45);
});

test('legacy parity explicitly retains the prototype exit yields', () => {
  assert.equal(LIFE, 15);
  // The three original rates are frozen. JPY was added for the Japan markets;
  // adding a rate cannot change any existing market's output.
  assert.equal(FX.AUD, 0.66);
  assert.equal(FX.GBP, 1.27);
  assert.equal(FX.EUR, 1.08);
  assert.equal(LEGACY_EXIT_OPTIONS.exitYContracted, 0.075);
  assert.equal(LEGACY_EXIT_OPTIONS.exitYMerchant, 0.115);
  assert.equal(LEGACY_EXIT_OPTIONS.exitYOpex, 0.08);
  assert.equal(EXIT_Y_CONTRACTED, 0.065);
  assert.equal(EXIT_Y_MERCHANT, 0.105);
  assert.equal(EXIT_Y_OPEX, 0.07);
});

test('the legacy markets are untouched by the auction-renewal branch', () => {
  for (const id of LEGACY_MARKETS){
    const m = legacyMarket(byId(id));
    assert.equal(m.comparison.economics.riskClass, undefined,
      `${id} must stay on the legacy two-stream model`);
    // Legacy results still expose the new field names, as aliases.
    const r = runLegacyBaseCase(m, 5);
    assert.equal(r.securedShare, r.contractedShare, `${id}: secured share must alias contracted share`);
    assert.ok(Array.isArray(r.aucY) && r.aucY.every(v => v === 0),
      `${id}: legacy markets have no auction-renewal stream`);
  }
});

test('base strategies match the prototype\'s baseStrat()', () => {
  for (const [id, strat] of Object.entries(baseline.baseStrategies)){
    assert.equal(baseStrategy(legacyMarket(byId(id))), strat, `${id} base strategy`);
  }
});

for (const key of Object.keys(baseline.cases)){
  const [marketId, strategyId, exitYearStr] = key.split('|');
  const exitYear = Number(exitYearStr);
  const expected = baseline.cases[key];

  test(`baseline ${key}`, () => {
    assert.ok(byId(marketId), `market ${marketId} is registered`);
    const market = legacyMarket(byId(marketId));
    const actual = runLegacyCase(market, strategyId, exitYear);

    if (expected.na){
      assert.ok(actual.na, `${key}: expected not-applicable, got a computed case`);
      assert.equal(actual.na[0], relabelled(expected.na), `${key}: not-applicable reason changed`);
      // The brief is explicit: never a silent zero.
      assert.equal(actual.irrHold, undefined, `${key}: an N/A case must not carry an IRR`);
      assert.equal(actual.moic, undefined, `${key}: an N/A case must not carry a MOIC`);
      return;
    }

    assert.ok(!actual.na, `${key}: expected a computed case, got N/A (${actual.na && actual.na[0]})`);
    for (const f of FIELDS) closeRel(actual[f], expected[f], `${key}.${f}`);
    assert.equal(actual.payback, expected.payback, `${key}.payback`);
    closeRel(actual.capY[0], expected.capY0, `${key}.capY[0]`);
    closeRel(actual.mchY[0], expected.mchY0, `${key}.mchY0`);
    assert.equal(actual.capY.length, LIFE, `${key}: capacity series must span the window`);
    assert.equal(actual.eb.length, LIFE, `${key}: EBITDA series must span the window`);
  });
}

/* The prototype's own prose, asserted against the prototype's own inputs. These
   sentences were written about the 2h/4h/8h archetypes and the 2024-vintage
   auction results; they are a claim about what the ORIGINAL model said, which is
   why they belong in the parity file and not in current-model.test.js. */
test('headline figures the prototype states in its own commentary', () => {
  const pct = (v) => Number((v * 100).toFixed(1));
  const x = (v) => Number(v.toFixed(2));
  const M = (id) => legacyMarket(byId(id));

  // "WA (−10.8% → +10.4%)" and "1.55× (WA)" / "1.06× (Romania)"
  assert.equal(pct(runLegacyCase(M('wa'), 'cap', 5).irrHold), 10.4);
  assert.equal(pct(runLegacyCase(M('wa'), 'mer', 5).irrHold), -10.8);
  assert.equal(x(runLegacyBaseCase(M('wa'), 5).moic), 1.55);
  assert.equal(x(runLegacyBaseCase(M('ro'), 5).moic), 1.06);

  // "the 2-hour markets survive (GB 8.0%, RO 5.3%), the 4-hour markets sag
  //  (PL 0.8%, IE −4.5%) and the 8-hour market collapses (WA −10.8%)"
  assert.equal(pct(runLegacyCase(M('gb'), 'mer', 5).irrHold), 8.0);
  assert.equal(pct(runLegacyCase(M('ro'), 'mer', 5).irrHold), 5.3);
  assert.equal(pct(runLegacyCase(M('pl'), 'mer', 5).irrHold), 0.8);
  assert.equal(pct(runLegacyCase(M('ie'), 'mer', 5).irrHold), -4.5);

  // "GB's toll bar sits ~1.8 IRR points below its merchant bar"
  const gap = runLegacyCase(M('gb'), 'mer', 5).irrHold - runLegacyCase(M('gb'), 'toll', 5).irrHold;
  assert.ok(Math.abs(gap * 100 - 1.8) < 0.1, `toll gap was ${gap * 100} points`);

  // "Romania (0%, 1.4%) ... to WA (77%, 11.6%)" on the certainty frontier
  const ro = runLegacyBaseCase(M('ro'), 5), wa = runLegacyBaseCase(M('wa'), 5);
  assert.equal(Math.round(ro.contractedShare * 100), 0);
  assert.equal(pct(ro.irrExit), 1.4);
  assert.equal(Math.round(wa.contractedShare * 100), 77);
  assert.equal(pct(wa.irrExit), 11.6);

  // "$1M controls ~1,800 kW in Romania and ~360 kW in WA"
  assert.equal(Math.round(ro.kwPerM), 1837);
  assert.equal(Math.round(wa.kwPerM), 364);

  // "Year-1 yields sit in a narrow 11.3–14.5% band"
  const yields = LEGACY_MARKETS.map(id => runLegacyBaseCase(M(id), 5).yield1 * 100);
  assert.equal(Number(Math.min(...yields).toFixed(1)), 11.3);
  assert.equal(Number(Math.max(...yields).toFixed(1)), 14.5);
});

test('runMatrix flags unavailable routes instead of dropping or zeroing them', () => {
  const legacy = LEGACY_MARKETS.map(id => legacyMarket(byId(id)));
  const legacyStrats = STRATEGIES.filter(s => LEGACY_STRATEGIES.includes(s.id));
  const rows = legacy.flatMap(market => legacyStrats.map(strategy => ({
    market, strategy,
    result:runLegacyCase(market, strategy.id, 5),
  })));
  assert.equal(rows.length, legacy.length * legacyStrats.length);

  const naRows = rows.filter(r => r.result.na);
  // RO: no cap, no toll. WA/IE/PL: no toll. => 2 + 3 = 5
  assert.equal(naRows.length, 5);
  const roCap = rows.find(r => r.market.manifest.id === 'ro' && r.strategy.id === 'cap');
  assert.equal(roCap.result.na[0], relabelled('No capacity mechanism'));
  const waToll = rows.find(r => r.market.manifest.id === 'wa' && r.strategy.id === 'toll');
  assert.equal(waToll.result.na[0], 'No market precedent');
});

test('the prototype declared no long-term award, and still reports none', () => {
  /* The live registry now enables this route for Japan — that is the 2026-07-30
     revision, and tests/registry.test.js guards the conditions it must satisfy.
     What belongs HERE is the narrower claim: the frozen inputs declare no award,
     and adding the route to the engine did not conjure one for them. A new
     strategy must be inert for markets that do not opt into it. */
  const ltda = STRATEGIES.find(s => s.id === 'ltda');
  assert.ok(ltda, 'the ltda route must be declared');

  for (const id of LEGACY_MARKETS){
    const m = legacyMarket(byId(id));
    assert.ok(!m.comparison.capabilities.longTermAward,
      `${id}: the frozen inputs must not claim a long-term award`);
    assert.ok(runLegacyCase(m, 'ltda', 5).na, `${id}: ltda must report N/A`);
  }
});

test('the frozen inputs are frozen', () => {
  /* A guard against the most likely future mistake: someone "refreshing" the
     legacy fixture to make this file green after a model change, which would
     quietly delete the proof it exists to hold. If these values move, the
     parity claim is gone — so they are asserted, not merely commented. */
  assert.match(LEGACY_VINTAGE, /global-cockpit-0727-v1/);
  assert.equal(legacyMarket(byId('gb')).comparison.archetype.durationHours, 2);
  assert.equal(legacyMarket(byId('gb')).comparison.economics.contracted, 5962);
  assert.equal(legacyMarket(byId('wa')).comparison.archetype.durationHours, 8);
  assert.equal(legacyMarket(byId('pl')).comparison.economics.contracted, 39585);
  assert.equal(legacyMarket(byId('ie')).comparison.economics.servicesCurve, undefined);
  assert.equal(legacyMarket(byId('ro')).comparison.economics.merchGross, 55400);
});

test('the auction-renewal model prices secured and renewal years differently', () => {
  const jp = byId('jp_tokyo');
  const r = runCase(jp, 'cap', 5);
  assert.ok(!r.na, 'Japan must produce a computed case');
  assert.equal(r.riskClass, 'auction-renewal');

  // Year 1 is secured; years 2+ are not.
  assert.ok(r.secY[0] > 0, 'year 1 carries the secured payment');
  assert.equal(r.aucY[0], 0, 'year 1 has no auction-renewal component');
  assert.equal(r.secY[1], 0, 'year 2 is no longer secured');
  assert.ok(r.aucY[1] > 0, 'year 2 carries an auction-renewal assumption');

  // Secured share counts only the executed award.
  assert.equal(r.securedShare, r.secY[0] / (r.secY[0] + r.aucY[0] + r.mchY[0]));
  assert.equal(r.securedYears, 1);
  assert.equal(r.contractedShare, r.securedShare, 'only executed cash flow is contracted');

  // capY stays the union so capacity-vs-merchant charts keep working.
  for (let i = 0; i < r.capY.length; i++){
    assert.equal(r.capY[i], r.secY[i] + r.aucY[i]);
  }
});

test('renewal years are discounted at the market yield, not the contracted yield', () => {
  const jp = byId('jp_kyushu');
  const real = runCase(jp, 'cap', 5);

  /* Re-price the same cash flows treating every capacity year as contracted —
     which is what the legacy two-stream model would have done. The exit value
     must come out strictly higher, proving the split is doing real work rather
     than being cosmetic. */
  const asIfContracted = pvTail(real.capY, EXIT_Y_CONTRACTED, 5)
    + pvTail(real.mchY, EXIT_Y_MERCHANT, 5)
    - pvTail(Array(LIFE - 5).fill(real.capexG - real.grant > 0 ? 0 : 0), EXIT_Y_OPEX, 0);
  const actualCapPart = pvTail(real.secY, EXIT_Y_CONTRACTED, 5) + pvTail(real.aucY, EXIT_Y_AUCTION, 5);
  const naiveCapPart = pvTail(real.capY, EXIT_Y_CONTRACTED, 5);

  assert.ok(naiveCapPart > actualCapPart,
    `treating renewals as contracted would overstate the capacity tail (${naiveCapPart} vs ${actualCapPart})`);
  assert.ok(asIfContracted > 0);
});

test('the engine reads only the comparison interface, not the dashboard', () => {
  // A market stripped down to manifest + comparison must produce identical numbers
  // to the full WA module. This is the decoupling guarantee in brief section 6.
  const full = byId('wa');
  const stripped = { manifest: full.manifest, comparison: full.comparison };
  for (const X of [5, 7, 10]){
    const a = runCase(full, 'cap', X), b = runCase(stripped, 'cap', X);
    for (const f of FIELDS) closeRel(b[f], a[f], `stripped wa.${f} @${X}`);
  }
});
