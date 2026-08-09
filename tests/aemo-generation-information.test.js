/* ---------------------------------------------------------------------------
   AEMO Generation Information → canonical project records.

   The fixture is shaped like the real workbook: a notes tab with no data
   columns, every fuel type mixed together, both markets in one sheet, the four
   commitment classes, a footnote marker on a status, pumped hydro alongside
   batteries, and a battery whose energy capacity is simply blank.

   The expensive mistakes here are all quiet ones. Carrying "Proposed" multiplies
   Australia's pipeline out of announcements. Counting Snowy 2.0 as a battery adds
   2.2 GW and 350 GWh of pumped hydro to a storage fleet. Reading "Committed*" as
   an unknown class drops a real project. None of them throw.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  readAemoWorkbook, normalizeAemo, stageOf, isBattery, LICENCE, SOURCE_ID, MARKET_REGIONS,
} from '../etl/sources/aemo-generation-information.mjs';
import { validateProjects, PROJECT_STAGE, energyMWh } from '../src/projects/schema.js';
import { AUTHORITY } from '../etl/lib/provenance.mjs';

const FIXTURE = resolve(fileURLToPath(new URL('.', import.meta.url)),
  'fixtures/workbooks/aemo-generation-information-sample.xlsx');
const read = (marketId) =>
  readAemoWorkbook(FIXTURE, { marketId, publishedAt:'2026-07-31', ingestedAt:'2026-08-09' });
const byName = (projects, part) => projects.find(p => p.name.includes(part));

test('a notes tab is skipped and the data sheet is found without being named', async () => {
  /* AEMO renames its tabs between vintages, so every sheet is tried and the ones
     that cannot resolve the required columns are passed over. */
  const nem = await read('nem');
  assert.ok(nem.length, 'the data sheet was found among the tabs');
});

test('a restructured workbook is an error, not an empty fleet', async () => {
  /* If NO sheet resolves, the file has changed shape. Returning zero projects
     would silently empty a market that has 850 MW under construction. */
  await assert.rejects(
    () => readAemoWorkbook(FIXTURE, { marketId:'nem', ingestedAt:'2026-08-09', sheets:['Notes'] }),
    /no sheet in the workbook resolved the required columns/);
});

test('regions decide the market, not the filename', async () => {
  assert.deepEqual([...MARKET_REGIONS.wa], ['WEM', 'SWIS', 'WA']);
  const nem = (await read('nem')).map(p => p.name);
  const wem = (await read('wa')).map(p => p.name);

  assert.ok(nem.some(n => n.includes('Victorian Big Battery')));
  assert.ok(!nem.some(n => n.includes('Kwinana')), 'a WEM battery is not the NEM’s');
  assert.deepEqual(wem, ['Kwinana BESS']);
});

test('only existing and committed are carried; the queue is not', async () => {
  const names = (await read('nem')).map(p => p.name);
  assert.ok(names.some(n => n.includes('Waratah')), 'committed is a filtered pipeline');
  assert.ok(!names.some(n => n.includes('Big Announcement')), 'proposed is an announcement');
  assert.ok(!names.some(n => n.includes('Maybe')), 'anticipated missed AEMO’s own criteria');

  assert.equal(stageOf('Existing'), PROJECT_STAGE.OPERATING);
  assert.equal(stageOf('Committed'), PROJECT_STAGE.UNDER_CONSTRUCTION);
  assert.equal(stageOf('Proposed'), null);
  assert.equal(stageOf('Anticipated'), null);
  assert.equal(stageOf(''), null);
});

test('a footnote marker on a status does not drop the project', async () => {
  // "Committed*" is committed. Matching on equality would lose it silently.
  assert.equal(stageOf('Committed*'), PROJECT_STAGE.UNDER_CONSTRUCTION);
  const star = byName(await read('nem'), 'Committed Star');
  assert.ok(star, 'the starred row survives');
  assert.equal(star.stage, PROJECT_STAGE.UNDER_CONSTRUCTION);
});

test('pumped hydro is storage but is not a battery', async () => {
  /* Snowy 2.0 is 2,200 MW and 350,000 MWh. Counting it would swamp every real
     battery figure in the NEM. */
  assert.equal(isBattery('Battery Storage'), true);
  assert.equal(isBattery('BESS'), true);
  assert.equal(isBattery('Pump Storage'), false);
  assert.equal(isBattery('Hydro'), false);
  assert.equal(isBattery('Black Coal'), false);

  const names = (await read('nem')).map(p => p.name);
  assert.ok(!names.some(n => n.includes('Snowy')));
  assert.ok(!names.some(n => n.includes('Loy Yang')));
});

test('energy capacity is used where published and null where blank', async () => {
  const vbb = byName(await read('nem'), 'Victorian Big Battery');
  assert.equal(vbb.capacityMW, 300);
  assert.equal(energyMWh(vbb), 450);
  assert.equal(vbb.durationHours, 1.5);

  const blank = byName(await read('nem'), 'No Energy');
  assert.equal(blank.capacityMW, 50);
  assert.equal(blank.durationHours, null, 'a blank MWh is unknown, not zero');
});

test('a DUID is the record id where AEMO has issued one', async () => {
  const vbb = byName(await read('nem'), 'Victorian Big Battery');
  assert.equal(vbb.provenance.sourceRecordId, 'VBBG1');
  assert.equal(vbb.id, 'nem-aemo-vbbg1');
  assert.equal(vbb.sourceRef.duid, 'VBBG1');
});

test('a project with no DUID gets a deterministic id but claims no publisher id', async () => {
  /* Committed plant has no DUID until it registers. The id must still be stable
     across runs, and `sourceRecordId` must stay null rather than pretending the
     platform's own slug is AEMO's identifier. */
  const waratah = byName(await read('nem'), 'Waratah');
  assert.equal(waratah.provenance.sourceRecordId, null);
  assert.equal(waratah.id, 'nem-aemo-nsw1-waratah-super-battery');
  assert.deepEqual(await read('nem'), await read('nem'), 'ids are stable across runs');
});

test('a committed project with no stated date gets null, not a guess', async () => {
  const star = byName(await read('nem'), 'Committed Star');
  assert.equal(star.expectedCod, null);

  const waratah = byName(await read('nem'), 'Waratah');
  assert.equal(waratah.expectedCod, '2025-08-01', 'and a stated one is carried as published');
});

test('records validate and carry operator provenance', async () => {
  const projects = await read('nem');
  assert.deepEqual(validateProjects(projects), []);

  for (const project of projects){
    /* AEMO is a system operator publishing about its own system — a different
       claim from a statutory register, and the record says which. */
    assert.equal(project.provenance.authority, AUTHORITY.OPERATOR);
    assert.equal(project.provenance.publisher, 'AEMO');
    assert.equal(project.provenance.dataset, 'AEMO Generation Information — NEM');
    assert.equal(project.provenance.publishedAt, '2026-07-31');
    assert.deepEqual(project.sourceIds, [SOURCE_ID]);
  }

  const wem = await read('wa');
  assert.equal(wem[0].provenance.dataset, 'AEMO Generation Information — WEM');
});

test('coordinates are absent rather than invented', async () => {
  // The Generation Information workbook publishes no position in this vintage.
  for (const project of await read('nem')){
    assert.equal(project.lat, null);
    assert.equal(project.lon, null);
  }
});

test('an unmapped market is refused rather than silently empty', () => {
  assert.throws(() => normalizeAemo([], { marketId:'gb', columns:{}, ingestedAt:'2026-08-09' }),
    /no region mapping/);
});

test('the AEMO attribution travels with the data', () => {
  assert.match(LICENCE.attribution, /AEMO/);
  assert.ok(LICENCE.url.startsWith('https://'));
});
