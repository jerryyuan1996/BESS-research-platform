/* ---------------------------------------------------------------------------
   Marktstammdatenregister → canonical project records.

   The fixture is shaped like the real export: German headers with umlauts and
   bracketed units, kW and kWh rather than MW and MWh, a European decimal comma,
   a planning entry, a decommissioned unit, a home battery, and a grid-scale unit
   whose energy capacity is simply not filled in.

   Each of those is a way to publish a wrong German fleet without anything
   throwing — a unit-conversion slip turns 103,500 kW into 103,500 MW, a planning
   entry inflates the operating fleet by a quarter of a gigawatt, and a missing
   kWh read as zero gives a battery a duration of nothing.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  readMastrWorkbook, normalizeMastr, stageOf, COLUMNS, LICENCE, MIN_MW, SOURCE_ID,
} from '../etl/sources/mastr.mjs';
import { readSheet, resolveColumns } from '../etl/lib/workbook.mjs';
import { validateProjects, PROJECT_STAGE, energyMWh } from '../src/projects/schema.js';
import { AUTHORITY, stalenessDays } from '../etl/lib/provenance.mjs';

const FIXTURE = resolve(
  fileURLToPath(new URL('.', import.meta.url)), 'fixtures/workbooks/mastr-sample.xlsx');
const read = () => readMastrWorkbook(FIXTURE, { publishedAt:'2026-08-01', ingestedAt:'2026-08-09' });
const byName = (projects, part) => projects.find(p => p.name.includes(part));

test('German headers with umlauts and bracketed units resolve', async () => {
  const { headers } = await readSheet(FIXTURE, { headerRow:1 });
  assert.ok(headers.includes('nutzbare_speicherkapazitat'), 'ä folds to a rather than to an underscore');
  assert.ok(headers.includes('koordinate_breitengrad'), '"(WGS84)" is dropped from the key');

  const columns = resolveColumns(headers, COLUMNS, 'mastr');
  assert.equal(columns.unitId, 'mastr_nr_der_einheit');
  assert.equal(columns.energyKWh, 'nutzbare_speicherkapazitat');
  assert.equal(columns.lon, 'koordinate_langengrad');
});

test('a renamed required column stops the run rather than yielding nulls', () => {
  assert.throws(
    () => resolveColumns(['anzeige_name_der_einheit'], COLUMNS, 'mastr'),
    /could not resolve required column\(s\)[\s\S]*unitId/,
    'the error must name the field and the aliases it tried');
});

test('kW and kWh become MW and MWh exactly once', async () => {
  /* The failure this guards is silent and enormous: 103,500 kW read as MW is a
     103 GW battery, which would dwarf every other market on the platform. */
  const bollingstedt = byName(await read(), 'Bollingstedt');
  assert.equal(bollingstedt.capacityMW, 103.5);
  assert.equal(energyMWh(bollingstedt), 238);
  assert.equal(bollingstedt.durationHours, 238 / 103.5);
});

test('a European decimal comma survives the conversion', async () => {
  const pause = byName(await read(), 'Pause');
  assert.equal(pause.capacityMW, 12.5005, '"12500,5" kW is 12.5005 MW');
});

test('missing energy leaves duration null instead of zero', async () => {
  /* A blank kWh read as 0 gives a real battery a duration of nothing, and it
     would then be summed into cluster labels as an observed figure. */
  const wunsiedel = byName(await read(), 'Wunsiedel');
  assert.equal(wunsiedel.capacityMW, 8.5);
  assert.equal(wunsiedel.durationHours, null);
  assert.equal(energyMWh(wunsiedel), null);
});

test('register statuses map only where the platform has a meaning for them', () => {
  assert.equal(stageOf('In Betrieb'), PROJECT_STAGE.OPERATING);
  assert.equal(stageOf('In Bau'), PROJECT_STAGE.UNDER_CONSTRUCTION);
  // Built and connected, temporarily out — still part of the operating fleet.
  assert.equal(stageOf('Vorübergehend stillgelegt'), PROJECT_STAGE.OPERATING);
  // A queue entry and a retirement are neither of the two mapped stages.
  assert.equal(stageOf('In Planung'), null);
  assert.equal(stageOf('Endgültig stillgelegt'), null);
  assert.equal(stageOf(''), null);
});

test('planning entries and retired units never reach the fleet', async () => {
  const names = (await read()).map(p => p.name);
  assert.ok(!names.some(n => n.includes('Zukunft')), 'a planning entry is a queue row');
  assert.ok(!names.some(n => n.includes('Alter Speicher')), 'a retired unit is not operating');
});

test('home batteries are excluded by a stated floor, not a hidden filter', async () => {
  assert.equal(MIN_MW, 1);
  const names = (await read()).map(p => p.name);
  assert.ok(!names.some(n => n.includes('Heimspeicher')));

  // The floor is a scoping decision and must be overridable rather than baked in.
  const all = await readMastrWorkbook(FIXTURE, { ingestedAt:'2026-08-09', minMW: 0 });
  assert.ok(all.some(p => p.name.includes('Heimspeicher')));
});

test('a unit with no coordinates is carried without a position, not dropped', async () => {
  /* It belongs in the pipeline table; it simply cannot be plotted. Half a
     position would put it on the null island, so both or neither. */
  const pause = byName(await read(), 'Pause');
  assert.equal(pause.lat, null);
  assert.equal(pause.lon, null);

  const bollingstedt = byName(await read(), 'Bollingstedt');
  assert.equal(bollingstedt.lat, 54.5321);
  assert.equal(bollingstedt.lon, 9.3891);
});

test('records validate and carry statutory provenance', async () => {
  const projects = await read();
  assert.deepEqual(validateProjects(projects), []);
  /* Bollingstedt, Wunsiedel and the temporarily-out Pause are all operating
     fleet; Alfeld is under construction. The planning entry, the retired unit
     and the home battery are all correctly absent. */
  assert.equal(projects.length, 4);
  assert.equal(projects.filter(p => p.stage === PROJECT_STAGE.OPERATING).length, 3);
  assert.equal(projects.filter(p => p.stage === PROJECT_STAGE.UNDER_CONSTRUCTION).length, 1);

  for (const project of projects){
    assert.equal(project.provenance.authority, AUTHORITY.STATUTORY, 'a legal filing, not a survey');
    assert.equal(project.provenance.publisher, 'Bundesnetzagentur');
    assert.match(project.provenance.sourceRecordId, /^SEE\d+$/, 'the register’s own unit id');
    assert.equal(project.provenance.publishedAt, '2026-08-01');
    assert.equal(project.provenance.ingestedAt, '2026-08-09');
    assert.equal(stalenessDays(project.provenance), 8);
    assert.deepEqual(project.sourceIds, [SOURCE_ID]);
  }
});

test('ids are stable and derived from the register, not from row order', async () => {
  const first = await read();
  const second = await read();
  assert.deepEqual(first, second, 'an unchanged export must not churn the snapshot');
  assert.ok(first.every(p => p.id === `de-mastr-${p.provenance.sourceRecordId.toLowerCase()}`));
});

test('the German data licence travels with the data', () => {
  assert.match(LICENCE.attribution, /Bundesnetzagentur/);
  assert.equal(LICENCE.shareAlike, false);
  assert.ok(LICENCE.url.startsWith('https://'));
});

test('a row with no unit id is dropped rather than given a synthetic one', () => {
  /* A fabricated key looks joinable and would silently match the wrong record in
     a companion dataset. */
  const columns = { unitId:'id', name:'n', status:'s', grossPowerKW:'p' };
  const projects = normalizeMastr(
    [{ id:'', n:'Nameless', s:'In Betrieb', p: 5000 },
     { id:'SEE1', n:'Real', s:'In Betrieb', p: 5000 }],
    { columns, ingestedAt:'2026-08-09' });
  assert.equal(projects.length, 1);
  assert.equal(projects[0].provenance.sourceRecordId, 'SEE1');
});
