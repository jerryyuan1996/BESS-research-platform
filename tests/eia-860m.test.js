/* ---------------------------------------------------------------------------
   EIA-860M → canonical project records.

   The fixture is shaped like the real file: two title rows above the header,
   generators of every technology mixed together, four balancing authorities in
   one sheet, a thousands separator in a capacity, and a planned unit whose
   capacity is blank. Every one of those is a way to publish a wrong pipeline
   without anything throwing.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  readEiaWorkbook, normalizeEia, eiaProjectsFromSheets, stageOf, codOf, MARKET_BA, LICENCE, REQUIRED_COLUMNS,
} from '../etl/sources/eia-860m.mjs';
import { validateProjects, PROJECT_STAGE } from '../src/projects/schema.js';
import { readSheet } from '../etl/lib/workbook.mjs';

const FIXTURE = resolve(
  fileURLToPath(new URL('.', import.meta.url)), 'fixtures/workbooks/eia-860m-sample.xlsx');
const read = (marketId) => readEiaWorkbook(FIXTURE, { marketId, evidenceDate:'2026-08-09' });

test('a market takes its own balancing authority, not its state', () => {
  /* ERCOT is not Texas and CAISO is not California. Filtering by state would
     put west-Texas SPP batteries into ERCOT and hand CAISO the whole of LADWP. */
  assert.deepEqual(MARKET_BA, { pjm:'PJM', ercot:'ERCO', caiso:'CISO' });
});

test('only the market’s own batteries survive the filter', async () => {
  const ercot = await read('ercot');
  const names = ercot.map(p => p.name);

  assert.ok(names.some(n => n.includes('Bat Cave')), 'an ERCO battery belongs to ERCOT');
  assert.ok(names.some(n => n.includes('Gateway Storage')), 'and so does one under construction');
  assert.ok(!names.some(n => n.includes('Solar Farm')), 'solar is not storage');
  assert.ok(!names.some(n => n.includes('Ohio')), 'a PJM battery is not ERCOT’s');
  assert.ok(!names.some(n => n.includes('Alberta')), 'an unmapped BA belongs to no market here');
  assert.ok(!names.some(n => n.includes('Moss Landing')), 'a CAISO battery is not ERCOT’s');
});

test('each market gets exactly the batteries in its footprint', async () => {
  assert.equal((await read('caiso')).length, 1);
  assert.equal((await read('pjm')).length, 1);
  assert.equal((await read('ercot')).length, 2, 'one operating, one under construction');
});

test('a queue entry is never carried as pipeline', async () => {
  /* "(P) Planned — permits pending" is a queue row. Most of a queue never gets
     built, and carrying it would overstate every market it appears in. */
  const ercot = await read('ercot');
  assert.ok(!ercot.some(p => p.name.includes('Queue Only')));
  assert.equal(stageOf('(P) Planned — permits pending'), null);
  assert.equal(stageOf('(OP) Operating'), PROJECT_STAGE.OPERATING);
  assert.equal(stageOf('(V) Under construction'), PROJECT_STAGE.UNDER_CONSTRUCTION);
  assert.equal(stageOf('(TS) Construction complete, in testing'), PROJECT_STAGE.UNDER_CONSTRUCTION);
  assert.equal(stageOf(''), null, 'an unlabelled status is not a guess');
});

test('a unit with no published capacity is dropped, not zeroed', async () => {
  /* A 0 MW battery in a pipeline table sums into a fleet total and makes it
     wrong by an unknown amount, which is worse than a visibly missing row. */
  const ercot = await read('ercot');
  assert.ok(!ercot.some(p => p.name.includes('Unknown Size')));
  assert.ok(ercot.every(p => p.capacityMW > 0));
});

test('a thousands separator does not become a decimal point', async () => {
  // "1,340" read carelessly is 1.34 MW — a 1,000x understatement that looks fine.
  const batCave = (await read('ercot')).find(p => p.name.includes('Bat Cave'));
  assert.equal(batCave.capacityMW, 1340);
});

test('EIA’s split month and year columns become one COD', () => {
  assert.equal(codOf({ planned_operation_year:2027, planned_operation_month:9 }), '2027-09-01');
  assert.equal(codOf({ operating_year:2021, operating_month:4 }), '2021-04-01');
  assert.equal(codOf({ operating_year:2024 }), '2024-01-01', 'a year with no month is January');
  assert.equal(codOf({}), null, 'no year is no date, not this year');
  assert.equal(codOf({ operating_year:2024, operating_month:99 }), '2024-12-01', 'a bad month is clamped');
});

test('the legacy transform does not invent a duration', async () => {
  /* Assuming two hours would flow into every cluster label and fleet total as
     though it had been observed. */
  for (const project of await read('ercot')){
    assert.equal(project.durationHours, null);
  }
});

test('records are valid, stable and stamped with their source', async () => {
  const projects = await read('ercot');
  assert.deepEqual(validateProjects(projects), []);

  for (const project of projects){
    assert.deepEqual(project.sourceIds, ['us-eia-860m']);
    assert.equal(project.evidenceDate, '2026-08-09');
    assert.ok(project.sourceRef.plantId, 'the annual-860 join needs a plant id');
    assert.equal(project.lat, null, 'coordinates come from the annual file, not this one');
  }

  // Same input, same output — an unchanged release must not churn the snapshot.
  assert.deepEqual(projects, await read('ercot'));
});

test('a renamed column stops the run instead of publishing nulls', async () => {
  const { headers } = await readSheet(FIXTURE, { sheet:'Operating', headerRow:3 });
  for (const column of REQUIRED_COLUMNS){
    assert.ok(headers.includes(column), `the fixture must exercise ${column}`);
  }
  await assert.rejects(
    () => readEiaWorkbook(FIXTURE, { marketId:'ercot', evidenceDate:'2026-08-09', sheets:['Formulas'] }),
    /sheet.*not found/, 'a required missing sheet must fail rather than silently publish partial data');
});

test('an unmapped market is refused rather than silently empty', () => {
  assert.throws(() => normalizeEia([], { marketId:'gb', evidenceDate:'2026-08-09' }),
    /no balancing authority mapping/);
});

test('the public-domain terms travel with the data', () => {
  assert.match(LICENCE.attribution, /Energy Information Administration/);
  assert.equal(LICENCE.shareAlike, false);
  assert.ok(LICENCE.url.startsWith('https://'));
});

test('Operating wins a cross-sheet transition in either worksheet order',()=>{
  const base={plant_id:'100',generator_id:'001',plant_name:'Synthetic transition',entity_name:'Synthetic operator',balancing_authority_code:'PJM',prime_mover_code:'BA',nameplate_capacity:10,status:'(OP) Operating'};
  const op={sheetName:'Operating',headers:REQUIRED_COLUMNS,rows:[base]};
  const plan={sheetName:'Planned',headers:REQUIRED_COLUMNS,rows:[{...base,status:'(V) Under construction',nameplate_capacity:20}]};
  for(const reads of [[op,plan],[plan,op]]){
    const result=eiaProjectsFromSheets(reads,{marketId:'pjm',evidenceDate:'2026-11-07'});
    assert.equal(result.length,1);assert.equal(result[0].stage,'operating');assert.equal(result[0].capacityMW,10);assert.equal(result[0].id,'pjm-eia-100-001');
  }
});
test('contradictory duplicate IDs and slug collisions are never silently overwritten',()=>{
  const base={plant_id:'100',generator_id:'A_1',plant_name:'Synthetic collision',entity_name:'Synthetic operator',balancing_authority_code:'PJM',prime_mover_code:'BA',nameplate_capacity:10,status:'(OP) Operating'};
  const read=rows=>eiaProjectsFromSheets([{sheetName:'Operating',headers:REQUIRED_COLUMNS,rows}],{marketId:'pjm',evidenceDate:'2026-11-07'});
  assert.throws(()=>read([base,{...base,nameplate_capacity:11}]),/conflicting duplicate/);
  assert.throws(()=>read([base,{...base,generator_id:'A-1'}]),/ID collision/);
  assert.equal(normalizeEia([{...base,prime_mover_code:'PS',technology:'Batteries'}],{marketId:'pjm',evidenceDate:'2026-11-07'}).length,0);
});
