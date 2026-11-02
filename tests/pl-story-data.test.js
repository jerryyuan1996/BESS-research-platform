/* ---------------------------------------------------------------------------
   The Poland story's data layer (pl-build-evidence.md §3).

   Four claims, in the order that matters:

     1. THE ELEVEN ROWS ARE THE RECORD. Price, factor and the calculated
        contract for each of the eleven notices, transcribed from the decision
        record's arithmetic table. The calculated value is recomputed here from
        price x factor / 100 with decimal half-up, so a typo in either field
        fails rather than passing as a pair of matching mistakes.

     2. EVERY VALUE CARRIES A LOCATOR. A row names its price document, its
        factor document and the page or clause of each; a source cites a
        document, a locator and a reuse decision. Values that were never
        supplied are null and say so.

     3. NOTHING IS INVENTED DOWNSTREAM. No successor value, no project-level
        grant, no terminal date for the quarterly product, no technology split
        for the last three auctions. A null is a gap, never a zero.

     4. THE QUANTITATIVE LAYER IS STILL GATED. `quantitativeReady` is false and
        the catalogue holds only this set: the page draws the Example form
        until the analyst accepts the rendering at G-2.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PL_STORY_META, PL_STORY_SOURCES, PL_STORY_EVIDENCE, PL_STORY_DATASETS,
  PL_AUCTIONS, PL_RULES, PL_HISTORY, PL_GRANT, PL_SUCCESSOR, PL_CHART,
  auctionSeries, deliveryYears,
} from '../src/markets/pl/data/capacityAuctions.js';

/* The decision record's table, §3.2: (id, delivery, price, factor, contract). */
const RECORD = [
  ['main-2021', 2021, 240.32, 96.11, 230.97],
  ['main-2022', 2022, 198.00, 96.11, 190.30],
  ['main-2023', 2023, 202.99, 96.11, 195.09],
  ['main-2024', 2024, 259.87, 96.11, 249.76],
  ['main-2025', 2025, 172.85, 96.11, 166.13],
  ['main-2026', 2026, 400.39, 96.11, 384.81],
  ['main-2027', 2027, 406.35, 95.00, 386.03],
  ['main-2028', 2028, 244.90, 95.00, 232.66],
  ['main-2029', 2029, 264.90, 61.30, 162.38],
  ['catch-up-2029', 2029, 534.09, 12.33, 65.85],
  ['main-2030', 2030, 465.02, 13.39, 62.27],
];

/** CALC-PL-01's rounding, stated once so the fixture and the module agree. */
const halfUp2 = (n) => Number((Math.round((n + Number.EPSILON) * 100) / 100).toFixed(2));

const byId = Object.fromEntries(PL_AUCTIONS.map(row => [row.id, row]));

/* ---- 1. the rows --------------------------------------------------------- */

test('eleven notices, keyed by kind and delivery year', () => {
  assert.deepEqual(PL_AUCTIONS.map(row => row.id), RECORD.map(([id]) => id));
  assert.equal(new Set(PL_AUCTIONS.map(row => `${row.kind}:${row.deliveryYear}`)).size, 11);
  assert.deepEqual(deliveryYears(), [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]);
});

test('every price, factor and calculated contract is the record, and the arithmetic reproduces', () => {
  for (const [id, deliveryYear, price, factor, contract] of RECORD){
    const row = byId[id];
    assert.equal(row.deliveryYear, deliveryYear, `${id}: delivery year`);
    assert.equal(row.pricePLNPerKWYear, price, `${id}: price`);
    assert.equal(row.batteryFactorPct, factor, `${id}: factor`);
    assert.equal(row.contractPLNPerCertifiedKWYear, contract, `${id}: contract`);
    assert.equal(halfUp2(price * factor / 100), contract, `${id}: price x factor / 100, half-up`);
    assert.match(row.arithmetic, new RegExp(price.toFixed(2).replace('.', '\\.')), `${id}: the arithmetic names its price`);
  }
});

test('the two 2029 products stay separate, and the catch-up price is never averaged in', () => {
  assert.equal(byId['main-2029'].kind, 'main');
  assert.equal(byId['catch-up-2029'].kind, 'catch-up');
  assert.equal(byId['main-2029'].deliveryYear, byId['catch-up-2029'].deliveryYear);
  assert.notEqual(byId['main-2029'].batteryFactorPct, byId['catch-up-2029'].batteryFactorPct);
  const main = PL_AUCTIONS.filter(row => row.kind === 'main').map(row => row.pricePLNPerKWYear);
  assert.equal(Math.max(...main), byId['main-2030'].pricePLNPerKWYear);
  assert.ok(byId['catch-up-2029'].auctionOn > byId['main-2029'].auctionOn);
});

test('the 2018 regulation’s battery row is item 8, and later regulations item 9', () => {
  for (const id of ['main-2021', 'main-2022', 'main-2023']){
    assert.equal(byId[id].factorLocator.clause, '§ 10 item 8', `${id}: the 2018 row`);
    assert.equal(byId[id].factorLocator.document, 'Dz.U. 2018 poz. 1632', `${id}: one regulation covers 2021-2023`);
  }
  assert.match(byId['main-2024'].factorLocator.clause, /item 9/);
  assert.match(byId['catch-up-2029'].factorLocator.clause, /§ 9 item 9/);
  assert.match(PL_STORY_SOURCES['SRC-PL-10'].locator.clause, /item 8/);
});

test('battery volumes are published only where URE splits them', () => {
  const reported = PL_AUCTIONS.filter(row => row.technologyStatus === 'reported');
  assert.deepEqual(reported.map(row => row.id), ['main-2027', 'main-2028']);
  assert.equal(byId['main-2027'].batteryObligationMW, 165);
  assert.equal(byId['main-2027'].batteryUnits, null, 'no first-cohort unit count is published');
  assert.equal(byId['main-2028'].batteryObligationMW, 1734);
  assert.equal(byId['main-2028'].batteryUnits, 33);
  for (const id of ['main-2021', 'main-2022', 'main-2023', 'main-2024', 'main-2025', 'main-2026']){
    assert.equal(byId[id].technologyStatus, 'none-reported', `${id}: missing is not zero`);
    assert.equal(byId[id].batteryObligationMW, null);
  }
  for (const id of ['main-2029', 'catch-up-2029', 'main-2030']){
    assert.equal(byId[id].technologyStatus, 'pending', `${id}: GAP-PL-TECH`);
    assert.equal(byId[id].batteryObligationMW, null);
    assert.equal(byId[id].technologySource, null, `${id}: no unit list stands in for a split`);
  }
  /* 165 + 1734 is the report's cumulative figure, not an award. */
  assert.equal(byId['main-2028'].batteryObligationMW, 1734);
});

/* ---- 2. locators and reuse ---------------------------------------------- */

test('every value in every row has a locator that names a document and a place', () => {
  for (const row of PL_AUCTIONS){
    for (const [label, locator] of [['priceLocator', row.priceLocator], ['factorLocator', row.factorLocator]]){
      assert.ok(locator?.document, `${row.id}: ${label} document`);
      assert.ok(locator.clause || locator.printedPage, `${row.id}: ${label} names a page or clause`);
    }
    if (row.technologyStatus === 'reported') assert.ok(row.technologyLocator?.printedPage, `${row.id}: volume locator`);
    assert.ok(PL_STORY_SOURCES[row.priceSource], `${row.id}: price source exists`);
    assert.ok(PL_STORY_SOURCES[row.factorSource], `${row.id}: factor source exists`);
    if (row.technologySource) assert.ok(PL_STORY_SOURCES[row.technologySource], `${row.id}: technology source exists`);
  }
});

test('every source carries its envelope and an explicit reuse decision', () => {
  const pages = { 5: [13, 10, 9, 9, 6] };
  void pages;
  for (const [id, source] of Object.entries(PL_STORY_SOURCES)){
    for (const key of ['publisher', 'title', 'url', 'publishedOn', 'effectiveOn', 'coverage', 'language', 'access', 'checkedOn']){
      assert.ok(key in source, `${id}: ${key}`);
    }
    for (const key of ['document', 'printedPage', 'table', 'row', 'column', 'clause']){
      assert.ok(key in source.locator, `${id}: locator.${key}`);
    }
    for (const key of ['status', 'permitsNumericPublication', 'basisUrl', 'basisLocator', 'attribution', 'constraints']){
      assert.ok(key in source.reuse, `${id}: reuse.${key}`);
    }
    if (/^https?:/.test(source.url)) assert.ok(source.url.startsWith('https://') || source.url.startsWith('http://'), `${id}: link`);
    assert.ok(source.reuse.status, `${id}: a disposition is recorded`);
  }
});

test('the reuse basis is recorded per source, and the report keeps its open review', () => {
  const numeric = Object.entries(PL_STORY_SOURCES).filter(([, s]) => s.reuse.permitsNumericPublication).map(([id]) => id);
  for (const id of numeric){
    assert.ok(PL_STORY_SOURCES[id].reuse.basisLocator, `${id}: a numeric basis names its clause`);
    /* Official acts and documents rest on Copyright Act art. 4; the operator's
       rules rest on their own clause and are link-only, so they name no act. */
    if (PL_STORY_SOURCES[id].reuse.status === 'limited-factual-summary'){
      assert.equal(PL_STORY_SOURCES[id].reuse.basisUrl, null, `${id}: no act is claimed for operator rules`);
    } else {
      assert.equal(PL_STORY_SOURCES[id].reuse.basisUrl, 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf', `${id}: art. 4 basis`);
    }
  }
  assert.equal(PL_STORY_SOURCES['SRC-PL-24'].reuse.permitsNumericPublication, false, 'the basis itself publishes no figure');
  assert.equal(PL_STORY_SOURCES['SRC-PL-16'].reuse.status, 'pending-review', 'B-PL-RIGHTS closes at G-2');
  assert.match(PL_STORY_SOURCES['SRC-PL-16'].reuse.constraints, /no report image/);
  assert.equal(PL_STORY_SOURCES['SRC-PL-15'].reuse.status, 'limited-factual-summary');
  assert.match(PL_STORY_SOURCES['SRC-PL-15'].reuse.constraints, /Link only/);
});

test('no participant, project or customer name is stored', () => {
  /* The set names publishers, statutes and institutions only. A recipient of a
     grant is never a stored field, so this cannot drift in with a locator. */
  for (const [id, source] of Object.entries(PL_STORY_SOURCES)) assert.ok(source.publisher, id);
  const text = JSON.stringify(PL_STORY_EVIDENCE);
  assert.equal(/sp\. z o\.o\.|S\.A\.|spółka|Beneficiary|beneficiary name/i.test(text), false);
});

/* ---- 3. what is not there ------------------------------------------------ */

test('the successor is a boundary and nothing else', () => {
  assert.equal(PL_SUCCESSOR.firstUnscheduledDeliveryYear, 2031);
  for (const key of ['legislatedOn', 'auctionOn', 'pricePLNPerKWYear', 'batteryFactorPct', 'batteryObligationMW', 'batteryUnits']){
    assert.equal(PL_SUCCESSOR[key], null, key);
  }
  assert.equal(PL_SUCCESSOR.open.gate, 'legislation');
});

test('the grant keeps its aggregates, withholds every project-level value, and never types a flat cut', () => {
  assert.equal(PL_GRANT.recommendedCount, 172);
  assert.equal(PL_GRANT.recommendedPLN, '3734999999.99');
  assert.equal(PL_GRANT.correspondingCostPLN, '10003742317.00');
  assert.equal(PL_GRANT.signedGrants, 170);
  assert.equal(PL_GRANT.signedCheckedOn, '2026-11-02');
  for (const key of ['individualAwardPLN', 'cashReceivedPLN', 'transferVerified']) assert.equal(PL_GRANT[key], null, key);
  /* The audit ratio reproduces the approved 37.3 but does not move the input. */
  const ratio = 100 * Number(PL_GRANT.recommendedPLN) / Number(PL_GRANT.correspondingCostPLN);
  assert.equal(Math.round(ratio * 10) / 10, 37.3);
  assert.match(PL_GRANT.locator.clause, /§ 6\(1\)-\(3\)/, 'the delay bands are statutory');
  assert.ok(PL_GRANT.delayBandStartMonths < PL_GRANT.delayBandEndMonths);
  assert.equal(PL_GRANT.delayPctPerMonth, 5);
  assert.equal(PL_GRANT.laterDelayPctPerMonth, 10);
});

test('the quarterly product has no terminal date, which is the pl-06 scope correction', () => {
  assert.equal(PL_RULES.supplementaryEndsOn, '2028-12-31');
  assert.equal(PL_RULES.additionalEndsOn, null, 'no general terminal additional-auction date is established');
  assert.equal(PL_RULES.supplementaryPeriodYears, 1);
  assert.equal(PL_RULES.additionalPeriodMonths, 3);
});

test('terms are maxima, and the two long ones are their base plus the extension', () => {
  assert.equal(PL_RULES.existingMaxYears, 1);
  assert.equal(PL_RULES.modernisedMaxYears, PL_RULES.modernisedBaseYears + PL_RULES.lowEmissionExtraYears);
  assert.equal(PL_RULES.newMaxYears, PL_RULES.newBaseYears + PL_RULES.lowEmissionExtraYears);
  assert.equal(PL_RULES.newMaxYears, 17);
  assert.equal(PL_RULES.certificationHours, 4);
  assert.equal(PL_RULES.milestoneDeliveryYear, 3);
  assert.equal(PL_RULES.capacitySettlementMonths, 1);
});

test('history stores the two years the page prints, extracted rather than derived', () => {
  assert.equal(PL_HISTORY.h01Year, 2015);
  assert.equal(PL_HISTORY.h02ActOn, '2017-12-08');
  assert.match(PL_HISTORY.locator.clause, /recital \(6\)/);
});

/* ---- 4. the gate and the catalogue -------------------------------------- */

test('the set is one fixed vintage outside the automated catalogue', () => {
  assert.equal(PL_STORY_META.id, 'pl-capacity-auctions');
  assert.equal(PL_STORY_META.kind, 'fixed-vintage-table');
  assert.equal(PL_STORY_META.entry, 'analyst-entered');
  assert.deepEqual(PL_STORY_META.bearsOn, [], 'it writes no model input');
  assert.equal(PL_STORY_META.reviewedOn, '2026-11-02');
  assert.equal(PL_STORY_META.legalCheckedOn, '2026-10-31', 'the complete absence check keeps its date');
  assert.deepEqual(Object.keys(PL_STORY_DATASETS), ['pl-capacity-auctions']);
  assert.equal(PL_STORY_DATASETS['pl-capacity-auctions'], PL_STORY_EVIDENCE);
});

test('the quantitative layer stays gated until G-2, and the Example wording is the approved one', () => {
  assert.equal(PL_CHART.quantitativeReady, false);
  assert.deepEqual(PL_CHART.fallback, ['Example: auction price × correction factor', '示例：拍卖价格×修正系数']);
  assert.equal(PL_CHART.referenceKW, 1);
  assert.match(PL_CHART.open.gate, /G-2/);
});

test('the records the page reads are the records the set exports', () => {
  for (const key of ['meta', 'sources', 'auctions', 'rules', 'history', 'grant', 'successor', 'chart']){
    assert.ok(key in PL_STORY_EVIDENCE, key);
  }
  assert.equal(PL_STORY_EVIDENCE.auctions, PL_AUCTIONS);
  assert.equal(auctionSeries().length, 11);
  assert.deepEqual(auctionSeries().map(row => row.deliveryYear), [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2029, 2030]);
  assert.equal(auctionSeries().find(row => row.deliveryYear === 2029).kind, 'main', 'main sits before its catch-up');
});
