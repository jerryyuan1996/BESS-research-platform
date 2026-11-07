/* ---------------------------------------------------------------------------
   EIA-860 annual → coordinates for EIA-860M records.

   A join is where a dataset acquires facts it did not have, so it is where wrong
   facts enter most cheaply. The tests below are about the ways a match can be
   wrong while looking right: matching the wrong plant because two share a name,
   placing a project at 0°,0° because an empty cell read as a number, or letting
   a weak name-based match sit indistinguishably beside an exact code match.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  readPlantIndex, enrichProjects, enrichmentSummary, nameKey, MATCH, SOURCE_ID,
} from '../etl/sources/eia-860-enrichment.mjs';
import { readEiaWorkbook } from '../etl/sources/eia-860m.mjs';
import { validateProjects } from '../src/projects/schema.js';

const here = fileURLToPath(new URL('.', import.meta.url));
const MONTHLY = resolve(here, 'fixtures/workbooks/eia-860m-sample.xlsx');
const ANNUAL = resolve(here, 'fixtures/workbooks/eia-860-annual-sample.xlsx');

const index = () => readPlantIndex(ANNUAL, { sheet:'Plant', headerRow:2 });
const monthly = (marketId) => readEiaWorkbook(MONTHLY, { marketId, evidenceDate:'2026-08-09' });
const enriched = async (marketId, options) => enrichProjects(await monthly(marketId), await index(), options);
const byName = (projects, part) => projects.find(p => p.name.includes(part));

test('an official plant code is an exact match', async () => {
  const batCave = byName(await enriched('ercot'), 'Bat Cave');
  assert.equal(batCave.enrichment.confidence, MATCH.EXACT);
  assert.equal(batCave.enrichment.matchedOn, 'plant_code');
  assert.equal(batCave.enrichment.matchedPlantId, '58002');
  assert.equal(batCave.lat, 29.4);
  assert.equal(batCave.lon, -98.5);
});

test('the fallback is name within state, and is labelled as weaker', async () => {
  /* Gateway Storage is absent from the annual file by plant code. Name alone
     would match across four states; name plus state is deterministic. */
  const gateway = byName(await enriched('ercot'), 'Gateway');
  assert.equal(gateway.enrichment.confidence, MATCH.NAME_STATE);
  assert.equal(gateway.enrichment.matchedOn, 'plant_name+state');
  assert.equal(gateway.lat, 31.86);
});

test('the fallback can be switched off without losing exact matches', async () => {
  const strict = await enriched('ercot', { allowNameFallback: false });
  assert.equal(byName(strict, 'Bat Cave').enrichment.confidence, MATCH.EXACT);
  assert.equal(byName(strict, 'Gateway').enrichment.confidence, MATCH.NONE);
  assert.equal(byName(strict, 'Gateway').lat, null, 'no position rather than a guessed one');
});

test('an ambiguous name is left unmatched, never resolved by picking one', async () => {
  /* Two Texas plants normalise to "twin peaks". Choosing either would place the
     project at the wrong one half the time, and nothing downstream would know. */
  const { ambiguous, byNameState } = await index();
  assert.ok(ambiguous.has('TX|twin peaks'), 'the collision is detected');
  assert.ok(!byNameState.has('TX|twin peaks'), 'and removed from the lookup');
});

test('a zero coordinate pair is rejected rather than plotted off Africa', async () => {
  /* 0°,0° is the Gulf of Guinea and the classic signature of an empty cell read
     as a number. No US plant is there. */
  const { byId } = await index();
  assert.ok(!byId.has('99200'), 'the null-island row never enters the index');
});

test('the join adds position and metadata but never energy capacity', async () => {
  /* This Plant-only join reads no generator storage schedule. It cannot infer
     MWh or discharge duration from a coordinate match. */
  const before = byName(await monthly('ercot'), 'Bat Cave');
  const after = byName(await enriched('ercot'), 'Bat Cave');

  assert.equal(before.durationHours, null);
  assert.equal(after.durationHours, null);
  assert.equal(after.capacityMW, before.capacityMW, 'capacity is unchanged by the join');
  assert.equal(after.sourceRef.county, 'Bexar');
  assert.equal(after.sourceRef.utilityName, 'Broad Reach');
});

test('an enriched record cites both forms', async () => {
  const batCave = byName(await enriched('ercot'), 'Bat Cave');
  assert.deepEqual(batCave.sourceIds, ['us-eia-860m', SOURCE_ID]);
  // The monthly filing is still the record's provenance; the annual one enriched it.
  assert.equal(batCave.provenance.dataset, 'EIA-860M');
});

test('an unmatched record keeps its shape and says so', async () => {
  const pjm = await enriched('pjm');
  for (const project of pjm){
    assert.ok(project.enrichment, 'every record reports how it matched');
    assert.ok([MATCH.EXACT, MATCH.NAME_STATE, MATCH.NONE].includes(project.enrichment.confidence));
  }
  assert.deepEqual(validateProjects(pjm), [], 'enrichment does not break the schema');
});

test('name normalisation is documented, deterministic and reversible to reason about', () => {
  assert.equal(nameKey('Gateway Storage Project'), 'gateway');
  assert.equal(nameKey('Bat Cave BESS'), 'bat cave');
  assert.equal(nameKey('Twin Peaks Storage LLC'), 'twin peaks');
  assert.equal(nameKey('Twin Peaks BESS'), 'twin peaks', 'which is exactly why it is ambiguous');
  // Same input, same output — a fuzzy scorer would not guarantee this.
  assert.equal(nameKey('Moss  Landing '), nameKey('MOSS LANDING'));
});

test('the summary counts what a reconciliation check needs', async () => {
  const summary = enrichmentSummary(await enriched('ercot'));
  assert.equal(summary.total, 2);
  assert.equal(summary.exact, 1);
  assert.equal(summary.nameState, 1);
  assert.equal(summary.none, 0);
  assert.equal(summary.located, 2);
  assert.equal(summary.exact + summary.nameState + summary.none, summary.total);
});
