/* ---------------------------------------------------------------------------
   The workbook adapter.

   Every failure mode here was chosen because it produces a file that VALIDATES.
   A renamed column read through optional chaining gives a register full of
   nulls; a formula cell read as its expression gives every project a capacity of
   "=SUM(D4:F4)"; a European decimal comma parsed by Number() gives NaN, and a
   thousands separator parsed carelessly turns 1,340 MW into 1.34 MW. None of
   those crash. All of them publish a wrong number.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  readSheet, num, isoDate, defaultHeader, requireColumns,
} from '../etl/lib/workbook.mjs';

const FIXTURE = resolve(
  fileURLToPath(new URL('.', import.meta.url)), 'fixtures/workbooks/sample-generator.xlsx');

test('a sheet reads as records keyed by normalised header', async () => {
  const { rows, sheetName, headers } = await readSheet(FIXTURE, { sheet:'Operating', headerRow:3 });

  assert.equal(sheetName, 'Operating');
  assert.ok(headers.includes('nameplate_capacity'), 'unit annotations are stripped from headers');
  assert.ok(headers.includes('plant_id'));

  assert.equal(rows.length, 3, 'the spacer row is not data');
  assert.equal(rows[0].plant_name, 'Gateway BESS');
  assert.equal(rows[0].nameplate_capacity, 250.5);
});

test('a sheet is found despite the trailing spaces registers add', async () => {
  // EIA renames tabs between releases; a contains-match saves a connector.
  const { sheetName } = await readSheet(FIXTURE, { sheet:'operating', headerRow:3 });
  assert.equal(sheetName, 'Operating');
});

test('the wrong header row fails loudly instead of returning nulls', async () => {
  /* Row 1 is a title. Reading it as the header would produce records keyed by
     "preliminary_monthly_electric_generator_inventory" and every field null —
     a file that parses, validates and is wrong. */
  const { rows } = await readSheet(FIXTURE, { sheet:'Operating', headerRow:1 });
  assert.ok(!rows.some(r => r.plant_name), 'proves the wrong header row yields no usable fields');

  const { headers } = await readSheet(FIXTURE, { sheet:'Operating', headerRow:3 });
  assert.throws(() => requireColumns(headers, ['plant_id', 'commissioning_date'], 'eia-860m'),
    /missing column\(s\) commissioning_date/,
    'a renamed or absent column must stop the run');
  assert.doesNotThrow(() => requireColumns(headers, ['plant_id', 'plant_name'], 'eia-860m'));
});

test('a formula cell reads as its result, not its expression', async () => {
  // AEMO's capacity columns are computed; the expression is not a capacity.
  const { rows } = await readSheet(FIXTURE, { sheet:'Formulas', headerRow:1 });
  assert.equal(rows[0].mw, 30);
});

test('numbers survive the separators registers actually use', () => {
  assert.equal(num(250.5), 250.5);
  assert.equal(num('1,340.0'), 1340, 'a thousands separator must not become a decimal point');
  assert.equal(num('1 234'), 1234);
  assert.equal(num('1234,5'), 1234.5, 'European decimal comma');
  assert.equal(num('≈120 MW'), 120);
  assert.equal(num('-15'), -15);
});

test('an unreadable number is null, never zero and never NaN', () => {
  /* Zero is a capacity. Null is the absence of one, and the pipeline table
     prints an em dash for it rather than claiming a 0 MW battery. */
  for (const value of [null, undefined, '', 'n/a', 'TBC', '—']){
    assert.equal(num(value), null, `${JSON.stringify(value)} must be null`);
  }
  assert.equal(num('0'), 0, 'a real zero is still a zero');
});

test('dates normalise from every shape a register publishes', () => {
  assert.equal(isoDate(new Date(Date.UTC(2028, 5, 1))), '2028-06-01');
  assert.equal(isoDate('2028-06-01'), '2028-06-01');
  assert.equal(isoDate('2028-06'), '2028-06-01', 'a month is the first of it');
  assert.equal(isoDate('1 June 2028'), '2028-06-01');
  assert.equal(isoDate('not a date'), null);
  assert.equal(isoDate(null), null);
});

test('header normalisation is stable and collision-free on real headers', () => {
  assert.equal(defaultHeader('Nameplate Capacity (MW)'), 'nameplate_capacity');
  assert.equal(defaultHeader('  Plant ID  '), 'plant_id');
  assert.equal(defaultHeader('Energy Storage Capacity (MWh)'), 'energy_storage_capacity');
  // Distinct source headers must not collapse onto one key.
  assert.notEqual(defaultHeader('Operating Year'), defaultHeader('Operating Month'));
});
