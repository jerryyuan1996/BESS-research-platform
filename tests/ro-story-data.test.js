/* ---------------------------------------------------------------------------
   The Romania story's data layer (ro-build-evidence.md §3).

   Three claims, in the order that matters:

     1. NOTHING GATED IS PUBLISHED. Every value the page may print is null
        while its gate is open, and the only non-null numbers are the three
        connection rules the decision record clears. This test reads the
        module's own source text, because a value is published by being in the
        file, not by being rendered (docs/data-policy.md).

     2. EVERY VALUE HAS A LOCATOR. A record names its document, page, table,
        row or clause, and the sources it cites exist. A record whose primary
        was never located says so rather than pointing at a home page.

     3. THE FIELD LIST IS THE INTERFACE. Every path the decision record's
        manifest names exists in the module, and every value-bearing field the
        module carries is named there. A field invented on one side only is
        exactly the drift this test is for.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  RO_STORY_META, RO_STORY_SOURCES, RO_STORY_RECORDS, RO_FLEET, RO_PLAN_2030,
  RO_BG_END_2025, RO_CONNECTION, RO_GRANT_RULES, RO_FLOOR_ANNOUNCEMENT, RO_HISTORY,
  eligibleFleetPoints, latestFleetPoint,
} from '../src/markets/ro/data/storyEvidence.js';

const SOURCE = readFileSync(new URL('../src/markets/ro/data/storyEvidence.js', import.meta.url), 'utf8');

/* The gates, transcribed from the decision record's field list. A record whose
   gate moves is a decision, so it has to be moved here too — and that edit is
   what a reviewer sees. The published values are the two whitelists below. */
const APPROVED_GATES = {
  'fleet-2025-start': 'source',
  'fleet-2026-04-01': 'source',
  'fleet-2026-06-20': 'source',
  'fleet-2026-08-01': 'reuse',
  'fleet-2026-09-01': 'source',
  'fleet-2026-10-01': 'source',
  'fleet-year-end': 'reuse + calculation',
  'plan-2030': 'reuse + official comparison',
  'bg-end-2025': 'reuse',
  'grant-rules': 'reuse + official comparison',
  'floor-announcement': 'reuse',
};

/* ---- the published values ------------------------------------------------ */

test('the set is one fixed vintage with one check date', () => {
  assert.equal(RO_STORY_META.id, 'ro-story-evidence');
  assert.equal(RO_STORY_META.marketId, 'ro');
  assert.equal(RO_STORY_META.schemaVersion, 1);
  assert.equal(RO_STORY_META.vintage, '2026-11-02');
  assert.equal(RO_STORY_META.checkedOn, '2026-11-02');
  assert.equal(RO_STORY_RECORDS.meta, RO_STORY_META);
});

test('every fleet point is withheld, and no point invents a date or an energy value', () => {
  assert.equal(RO_FLEET.observations.length, 6);
  for (const point of RO_FLEET.observations){
    assert.equal(point.mw, null, `${point.id}: power`);
    assert.equal(point.mwh, null, `${point.id}: energy`);
    assert.ok(point.open?.gate, `${point.id}: names the gate it waits on`);
    assert.ok(point.datePrecision, `${point.id}: keeps a precision`);
    if (point.id === 'fleet-2025-start'){
      assert.equal(point.date, null, 'no 1 January observation date is invented');
      assert.match(point.datePrecision, /start-of-year/);
    }
    if (point.date) assert.match(point.date, /^\d{4}-\d{2}-\d{2}$/);
  }
  assert.deepEqual(eligibleFleetPoints(), []);
  assert.equal(latestFleetPoint(), null);
});

test('the estimate, the plan, the neighbour fleet and the grant rules stay null with their gates', () => {
  assert.equal(RO_FLEET.yearEnd.additionsMW, null);
  assert.equal(RO_FLEET.yearEnd.totalMW, null);
  assert.equal(RO_FLEET.yearEnd.baselineDate, null, 'no baseline is manufactured to make a total add up');
  assert.equal(RO_FLEET.yearEnd.forecastPublishedOn, '2026-08-20');
  assert.equal(RO_FLEET.yearEnd.forDate, '2026-12-31');
  assert.equal(RO_FLEET.yearEnd.forDatePrecision, 'end-year');
  assert.match(RO_FLEET.yearEnd.open.gate, /reuse/);
  assert.match(RO_FLEET.yearEnd.open.gate, /calculation/);

  assert.equal(RO_PLAN_2030.mw, null);
  assert.equal(RO_PLAN_2030.mwh, null);
  assert.equal(RO_PLAN_2030.year, 2030);
  assert.equal(RO_PLAN_2030.status, 'plan');

  assert.equal(RO_BG_END_2025.mw, null);
  assert.equal(RO_BG_END_2025.mwh, null);
  assert.equal(RO_BG_END_2025.year, 2025);

  assert.equal(RO_GRANT_RULES.commissionWithinMonths, null);
  assert.equal(RO_GRANT_RULES.operateAtLeastYears, null);

  assert.equal(RO_FLOOR_ANNOUNCEMENT.verifiedCount, null);
  assert.equal(RO_FLOOR_ANNOUNCEMENT.levelDisclosed, false);
  for (const key of ['tenorYears', 'securedShare', 'priceUplift']) assert.equal(RO_FLOOR_ANNOUNCEMENT[key], null, key);
});

test('the three connection rules are the only published numbers, and they are rules', () => {
  assert.equal(RO_CONNECTION.auctionThresholdMW, 5);
  assert.equal(RO_CONNECTION.auctionThresholdComparator, 'gte');
  assert.equal(RO_CONNECTION.allocationLagYears, 2);
  assert.equal(RO_CONNECTION.auctionSessionsFrom, '2026-10-30');
  assert.equal(RO_CONNECTION.open, null);

  const numbers = [];
  const walk = (node, path) => {
    if (node === null || node === undefined) return;
    if (typeof node === 'number') return numbers.push([path, node]);
    if (typeof node === 'string') return;
    if (Array.isArray(node)) return node.forEach(n => walk(n, path));
    if (typeof node === 'object') for (const [k, v] of Object.entries(node)){
      /* A locator's page numbers are citation coordinates, not values. */
      if (k === 'locator' || k === 'locators') continue;
      walk(v, `${path}.${k}`);
    }
  };
  for (const [key, value] of Object.entries({ fleet: RO_FLEET, plan2030: RO_PLAN_2030, bgEnd2025: RO_BG_END_2025, connection: RO_CONNECTION, grantRules: RO_GRANT_RULES, floorAnnouncement: RO_FLOOR_ANNOUNCEMENT, history: RO_HISTORY })) walk(value, key);
  const published = numbers.filter(([, v]) => v !== 0).map(([p, v]) => `${p}=${v}`).sort();
  assert.deepEqual(published, [
    'connection.allocationLagYears=2',
    'connection.auctionThresholdMW=5',
    'plan2030.year=2030',
    'bgEnd2025.year=2025',
  ].sort(), 'a new number in a record is a decision, not an edit');
});

test('no reviewed candidate is carried in the file, even unseen', () => {
  /* The decision record's candidate values are the ones a later vintage may
     publish once its gate closes. Until then they must not be in a bundle. */
  const gated = ['989', '1,000', '1000', '1,200', '1200', '2,400', '2400', '1,382', '1382',
    '137', '599', '1,130', '1130', '878', '1,630', '1630', '1,094', '1094', '2,310', '2310',
    '1,162', '1162', '2,312', '2312', '1,975', '1975'];
  for (const value of gated) assert.equal(SOURCE.includes(value), false, `"${value}" must not appear in a public file`);
});

/* ---- the envelope -------------------------------------------------------- */

test('every source carries the full envelope and an explicit reuse decision', () => {
  for (const [id, source] of Object.entries(RO_STORY_SOURCES)){
    for (const key of ['publisher', 'title', 'url', 'publishedOn', 'effectiveOn', 'coverage', 'language', 'access', 'checkedOn', 'lastAttemptOn']){
      assert.ok(key in source, `${id}: ${key}`);
    }
    for (const key of ['document', 'pdfPage', 'printedPage', 'table', 'row', 'column', 'clause']){
      assert.ok(key in source.locator, `${id}: locator.${key}`);
    }
    for (const key of ['status', 'permitsNumericPublication', 'basisUrl', 'basisLocator', 'attribution', 'constraints']){
      assert.ok(key in source.reuse, `${id}: reuse.${key}`);
    }
    if (!source.locator.document) assert.equal(source.unresolved, true, `${id}: an unlocated source says so`);
    if (source.reuse.permitsNumericPublication) assert.ok(source.reuse.basisLocator, `${id}: a numeric basis names its clause`);
    else assert.equal(source.reuse.basisUrl, null, `${id}: no invented permission URL`);
  }
});

test('every record cites a source that exists and carries a locator of its own', () => {
  const known = new Set(Object.keys(RO_STORY_SOURCES));
  const records = [...RO_FLEET.observations, RO_FLEET.yearEnd, RO_PLAN_2030, RO_BG_END_2025, RO_CONNECTION, RO_GRANT_RULES, RO_FLOOR_ANNOUNCEMENT, ...RO_HISTORY];
  for (const record of records){
    assert.ok(record.sourceIds?.length, `${record.id}: cites a source`);
    for (const id of record.sourceIds) assert.ok(known.has(id), `${record.id}: unknown source ${id}`);
    const locators = record.locators || [record.locator];
    for (const locator of locators){
      assert.ok(locator, `${record.id}: has a locator`);
      /* A record whose primary was never located says so, and its source says
         so too; it does not point at a publisher's home page instead. */
      if (locator.document) assert.ok(locator.clause || locator.table || locator.pdfPage, `${record.id}: names a page, table or clause`);
      else {
        assert.equal(record.unresolved, true, `${record.id}: an unlocated value is flagged`);
        for (const id of record.sourceIds) assert.equal(RO_STORY_SOURCES[id].unresolved, true, `${record.id}: ${id} is unresolved`);
      }
    }
  }
});

test('a numeric record rests on a source cleared for numeric publication', () => {
  const cleared = Object.entries(RO_STORY_SOURCES).filter(([, s]) => s.reuse.permitsNumericPublication).map(([id]) => id).sort();
  assert.deepEqual(cleared, ['SRC-RO-13a', 'SRC-RO-13b'], 'only the connection rules are cleared');
  assert.deepEqual(RO_CONNECTION.sourceIds.slice().sort(), cleared);
  for (const id of cleared) assert.equal(RO_STORY_SOURCES[id].reuse.status, 'limited-factual-summary');
});

test('history keeps event dates, precision and locators separate', () => {
  assert.deepEqual(RO_HISTORY.map(h => h.id), ['H-RO-01', 'H-RO-02', 'H-RO-03', 'H-RO-04', 'H-RO-05', 'H-RO-06']);
  const byId = Object.fromEntries(RO_HISTORY.map(h => [h.id, h]));
  assert.deepEqual(byId['H-RO-01'].dates, ['2005-06-30']);
  assert.deepEqual(byId['H-RO-02'].dates, ['2014-11']);
  assert.equal(byId['H-RO-02'].precision, 'month', 'month precision is retained, not upgraded to a day');
  assert.deepEqual(byId['H-RO-03'].dates, ['2021-06-17', '2021-10-27']);
  assert.deepEqual(byId['H-RO-04'].dates, ['2025-07-08']);
  assert.deepEqual(byId['H-RO-05'].dates, ['2026']);
  assert.deepEqual(byId['H-RO-06'].dates, ['2026-03-06']);
  for (const node of RO_HISTORY){
    assert.equal(node.kind, 'event');
    /* Several documents can sit behind one dated node; each locator still has
       to name where in its document the event date is stated. */
    assert.ok(node.locators.length >= 1, `${node.id}: locates its event`);
    assert.ok(node.locators.length <= node.sourceIds.length, `${node.id}: no locator without a source`);
    for (const locator of node.locators) assert.ok(locator.document && (locator.clause || locator.pdfPage), `${node.id}: ${JSON.stringify(locator)}`);
    for (const date of node.dates){
      const shape = node.precision === 'day' ? /^\d{4}-\d{2}-\d{2}$/ : node.precision === 'month' ? /^\d{4}-\d{2}$/ : /^\d{4}$/;
      assert.match(date, shape, `${node.id}: ${date} matches its precision`);
    }
  }
});

/* ---- the field list is the interface ------------------------------------ */

test('every record waits on the gate the field list gives it, and nothing else moved', () => {
  const gates = Object.fromEntries([
    ...RO_FLEET.observations.map(o => [o.id, o.open?.gate]),
    ['fleet-year-end', RO_FLEET.yearEnd.open?.gate],
    ['plan-2030', RO_PLAN_2030.open?.gate],
    ['bg-end-2025', RO_BG_END_2025.open?.gate],
    ['grant-rules', RO_GRANT_RULES.open?.gate],
    ['floor-announcement', RO_FLOOR_ANNOUNCEMENT.open?.gate],
  ]);
  assert.deepEqual(gates, APPROVED_GATES);
  assert.equal(RO_CONNECTION.open, null, 'the connection rules are the cleared record');
});

test('the records the page reads are the records the set exports', () => {
  /* A binding may only read a record through this object, so a field cannot be
     reached while its gate is open by reaching around the set. */
  for (const key of ['meta', 'sources', 'fleet', 'plan2030', 'bgEnd2025', 'connection', 'grantRules', 'floorAnnouncement', 'history']){
    assert.ok(key in RO_STORY_RECORDS, key);
  }
  assert.equal(RO_STORY_RECORDS.fleet, RO_FLEET);
  assert.equal(RO_STORY_RECORDS.history.length, 6);
  assert.equal(RO_STORY_RECORDS.fleet.observations.every(o => 'mw' in o && 'mwh' in o), true, 'power and energy are separate fields');
});
