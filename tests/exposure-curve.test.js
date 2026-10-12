/* ---------------------------------------------------------------------------
   THE EXPOSURE CURVE — a ledger laid along time, and nothing added to it.

   src/entry/exposureCurve.js draws a market's capital-at-risk ledger against
   months from site control. Four things are held here:

     1. THE LINE IS THE LEDGER'S ARITHMETIC. Both curves that exist are
        recomputed below by hand, from the amounts in the two ledgers and the
        conversion seeds, step by step.
     2. THE MONTHS ARE THE STATED CONVENTION AND NOTHING ELSE. One seventh of
        the months to ready-to-build for each of seven stages; posted at a
        stage's start, returned at its end; the build after the decision.
     3. NOTHING IS BUILT ON A GAP. A ledger with no stated timing has no curve.
        An item with no amount moves the line by nothing and marks it a lower
        bound.
     4. THE CONVENTION DOES NOT CONTRADICT WHAT A MARKET PUBLISHES. Where a
        pathway declares that one stage's artefact gates another's instrument,
        the slot order must agree. Finland's does not, and it has no curve.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import { FX } from '../src/comparison/assumptions.js';
import { STAGES } from '../src/governance/buildPathway.js';
import { allLedgers, ledgerFor } from '../src/entry/ledgerRegistry.js';
import { ledgerTotals } from '../src/entry/ledger.js';
import { buildPathwayFor } from '../src/markets/buildPathwayRegistry.js';
import {
  exposureCurve, stageMonths, slotProblems, markers, SLOTS, AFTER_DECISION, TIMED_LEDGERS,
} from '../src/entry/exposureCurve.js';

const near = (a, b, label, tol = 1e-6) => assert.ok(Math.abs(a - b) <= tol, `${label}: got ${a}, expected ${b}`);
const steps = (curve) => curve.events.map(e => [e.type, e.id]);

test('every stage of the vocabulary has a place, and only once', () => {
  assert.deepEqual([...SLOTS, ...AFTER_DECISION].sort(), [...STAGES].sort());
  assert.equal(SLOTS.length, 7);
});

test('a stage is one seventh of the months to ready-to-build, and the build follows the decision', () => {
  const timing = { monthsToRtb: [35, 49], buildMonths: [10, 20] };
  assert.deepEqual(stageMonths('site', timing, 'fast'), { start: 0, end: 5 });
  assert.deepEqual(stageMonths('site', timing, 'slow'), { start: 0, end: 7 });
  assert.deepEqual(stageMonths('procurement', timing, 'central'), { start: 36, end: 42 });
  assert.deepEqual(stageMonths('construction', timing, 'central'), { start: 42, end: 57 });
  assert.deepEqual(stageMonths('entry', timing, 'slow'), { start: 69, end: 69 });
});

test('Western Australia, by hand', () => {
  const curve = exposureCurve(ledgerFor('wa'), FX);
  const aud = FX.AUD, mw = 200;

  /* Five fees, then the security at 25% of the benchmark price per MW. */
  const application = 5000 / mw * aud;
  const studies = [25000, 125000, 75000, 55000].map(v => v / mw * aud);
  const security = 488500 * 0.25 * aud;
  const spent = application + studies.reduce((a, b) => a + b, 0);

  assert.deepEqual(steps(curve), [
    ['post', 'connection-application-fee'],
    ['post', 'options-assessment-fee'], ['post', 'initiation-studies'], ['post', 'project-scoping'], ['post', 'offer-preparation-fee'],
    ['post', 'reserve-capacity-security'],
    ['post', 'network-works-security'],
    ['release', 'reserve-capacity-security'], ['release', 'network-works-security'],
  ]);

  let level = application;
  near(curve.events[0].after, level, 'after the application fee');
  studies.forEach((s, i) => { level += s; near(curve.events[1 + i].after, level, `after study fee ${i + 1}`); });
  near(level, spent, 'spend');
  near(curve.events[5].before, spent, 'before the security');
  near(curve.events[5].after, spent + security, 'after the security');
  /* The works security has no amount: the line does not move, and is a lower bound. */
  assert.equal(curve.events[6].usdPerMW, null);
  near(curve.events[6].after, spent + security, 'after the unquantified security');
  assert.deepEqual(curve.events.map(e => e.lowerBound), [false, false, false, false, false, false, true, true, false]);
  near(curve.events[7].after, spent, 'after the security is returned');
  near(curve.end, spent, 'what is never returned');
  assert.equal(curve.endLowerBound, false, 'both unquantified items are returned');

  near(curve.peak.usdPerMW, spent + security, 'peak');
  assert.equal(curve.peak.lowerBound, true);
  /* The peak is the ledger's own total, because nothing is returned before it. */
  near(curve.peak.usdPerMW * mw, ledgerTotals(ledgerFor('wa'), FX).preFid.usd, 'peak against the ledger total', 1e-3);

  /* Months: 37 to 43 to ready-to-build, 12 to 18 to build. */
  const month = (i) => curve.events[i].month;
  near(month(0).central, 40 / 7, 'application, central');
  near(month(1).fast, 2 * 37 / 7, 'studies, fast');
  near(month(5).central, 5 * 40 / 7, 'revenue qualification, central');
  near(month(5).slow, 5 * 43 / 7, 'revenue qualification, slow');
  near(month(6).central, 6 * 40 / 7, 'procurement, central');
  assert.deepEqual(month(7), { fast: 49, central: 55, slow: 61 });
  assert.deepEqual(curve.decision, { fast: 37, central: 40, slow: 43 });
  assert.deepEqual(curve.firstRevenue, { fast: 49, central: 55, slow: 61 });

  assert.deepEqual(markers(curve).map(m => m.events.length), [1, 4, 1, 1, 2]);
});

test('Romania, by hand', () => {
  const curve = exposureCurve(ledgerFor('ro'), FX);
  const eur = FX.EUR;
  const auction = 20000 * eur;        // per MW
  const establishment = 30 * 1000 * eur; // per kW, so a thousand times per MW

  assert.deepEqual(steps(curve), [
    ['post', 'auction-guarantee'], ['post', 'allocation-payment-guarantee'], ['post', 'allocation-price'],
    /* The application stage ends where studies begin: what is returned comes
       back before the next guarantee is posted. */
    ['release', 'auction-guarantee'], ['release', 'allocation-payment-guarantee'],
    ['post', 'connection-tariff-guarantee'],
    ['post', 'establishment-guarantee'],
    ['release', 'establishment-guarantee'], ['release', 'connection-tariff-guarantee'],
  ]);

  const after = curve.events.map(e => e.after);
  near(after[0], auction, 'after the auction guarantee');
  near(after[2], auction, 'two unquantified items move nothing');
  near(after[3], 0, 'the auction guarantee is returned');
  near(after[5], 0, 'the connection guarantee has no amount');
  near(after[6], establishment, 'after the establishment guarantee');
  near(after[7], 0, 'returned at the end of the works');
  near(curve.end, 0, 'nothing quantified is spent');
  assert.equal(curve.endLowerBound, true, 'the price of the capacity is spent and has no amount');

  /* The price of the capacity has no amount and is never returned, so every
     stretch after the first posting is a lower bound. */
  assert.ok(curve.events.slice(1).every(e => e.lowerBound));
  assert.equal(curve.lowerBound, true);

  /* The two quantified guarantees are never outstanding together, which the
     ledger's own limit says and its total cannot show. */
  near(curve.peak.usdPerMW, establishment, 'peak');
  const total = ledgerTotals(ledgerFor('ro'), FX).preFid.usd / 50;
  near(total, auction + establishment, 'the ledger total, per MW');
  assert.ok(curve.peak.usdPerMW < total);

  /* Months: 35 to 41 to ready-to-build, 9 to 15 to build. */
  const month = (i) => curve.events[i].month;
  near(month(0).central, 38 / 7, 'application starts');
  near(month(3).central, 2 * 38 / 7, 'application ends');
  near(month(5).central, 2 * 38 / 7, 'studies start');
  near(month(6).fast, 3 * 35 / 7, 'consent, fast');
  near(month(6).slow, 3 * 41 / 7, 'consent, slow');
  assert.deepEqual(month(7), { fast: 44, central: 50, slow: 56 });
  near(curve.peak.month.central, 3 * 38 / 7, 'the peak is at consent');

  assert.deepEqual(markers(curve).map(m => m.events.length), [3, 3, 1, 2]);
});

test('a ledger with no stated timing has no curve', () => {
  const timed = allLedgers().filter(l => l.timing).map(l => l.marketId).sort();
  assert.deepEqual(timed, ['ro', 'wa'], 'a ledger gained or lost a timing block: recompute its curve by hand above');
  for (const ledger of allLedgers()){
    if (ledger.timing) continue;
    assert.equal(exposureCurve(ledger, FX), null, `${ledger.marketId}: a curve was drawn with no stated time axis`);
  }
  assert.equal(exposureCurve(null, FX), null);
  /* And none is drawn from a timing with nothing to draw. */
  assert.equal(exposureCurve({ ...ledgerFor('wa'), items: [] }, FX), null);
});

test('the ledgers fetched for comparison are exactly those with a timing', async () => {
  assert.deepEqual(Object.keys(TIMED_LEDGERS).sort(), allLedgers().filter(l => l.timing).map(l => l.marketId).sort());
  for (const [id, load] of Object.entries(TIMED_LEDGERS)) assert.equal(await load(), ledgerFor(id), id);
});

test('the slot order agrees with every prerequisite a market with a curve has published', () => {
  for (const ledger of allLedgers().filter(l => l.timing)){
    const pathway = buildPathwayFor(ledger.marketId);
    assert.ok(pathway, `${ledger.marketId}: a curve needs a pathway to check its order against`);
    assert.deepEqual(slotProblems(pathway), []);
  }
  /* Finland gates its letter of intent on consent evidence, which the slot
     order draws the other way round. It states no timing, so nothing is drawn;
     if it ever does, the assertion above is what stops the curve. */
  assert.ok(slotProblems(buildPathwayFor('fi')).length > 0);
});

test('the curve leaves the ledger as it found it', () => {
  for (const id of ['wa', 'ro']){
    const before = JSON.stringify(ledgerFor(id));
    exposureCurve(ledgerFor(id), FX);
    assert.equal(JSON.stringify(ledgerFor(id)), before);
  }
});
