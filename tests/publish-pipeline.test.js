/* ---------------------------------------------------------------------------
   Reconciliation and atomic publication.

   The scenario every test here circles: a register renames a column, the parser
   reads nothing, the transform produces an empty-but-valid dataset, and the run
   publishes it over a good file. Nothing throws. The tests pass. A market
   silently loses its pipeline.

   Reconciliation is what notices. Atomicity is what makes noticing useful — a
   run that cannot prove it has something better must leave the previous artifact
   exactly as it was.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { reconcile, summarise, SEVERITY, DRIFT } from '../etl/lib/reconcile.mjs';
import { publishDataset, lastAccepted, runPipeline } from '../etl/lib/publish.mjs';
import { PROJECT_STAGE } from '../src/projects/schema.js';

let seq = 0;
const project = (over = {}) => ({
  id: `p-${++seq}`,
  marketId: 'ercot',
  name: `Project ${seq}`,
  stage: PROJECT_STAGE.OPERATING,
  statusRaw: '(OP) Operating',
  evidenceDate: '2026-08-09',
  expectedCod: '2025-06-01',
  capacityMW: 100,
  durationHours: 2,
  operator: 'Someone',
  lat: 31.0,
  lon: -99.0,
  sourceIds: ['us-eia-860m'],
  ...over,
});
const fleet = (n, over) => Array.from({ length: n }, () => project(over));
/* The publisher writes through etl/lib/boundary.mjs, which confines every write
   to public/data/public/. Tests therefore publish INSIDE that root rather than
   into an OS temp directory — exercising the real path instead of a sandbox the
   production code could never reach. Everything written here is removed after. */
const REPO = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const SANDBOX = 'public/data/public/__test__';
let run = 0;
const paths = [];

const tmp = () => {
  const rel = `${SANDBOX}/run-${++run}`;
  mkdirSync(resolve(REPO, rel), { recursive: true });
  paths.push(rel);
  return rel;
};
/** Repo-relative for the publisher; absolute for the assertions. */
const abs = (rel) => resolve(REPO, rel);

test.after(() => rmSync(resolve(REPO, SANDBOX), { recursive: true, force: true }));
const META = { label:'ercot storage', marketId:'ercot', source:'us-eia-860m' };
const codes = (findings) => findings.map(f => f.code);

/* ---- reconciliation ----------------------------------------------------- */

test('an empty dataset is an error, never a publishable state', () => {
  const { ok, findings } = reconcile([]);
  assert.equal(ok, false);
  assert.ok(codes(findings).includes('empty'));
});

test('duplicate ids are caught — a join that fanned out', () => {
  const one = project({ id:'dup' });
  const { ok, findings } = reconcile([one, { ...one }]);
  assert.equal(ok, false);
  assert.ok(codes(findings).includes('duplicate-ids'));
});

test('null island is caught rather than plotted off Africa', () => {
  const { ok, findings } = reconcile([project({ lat:0, lon:0 })]);
  assert.equal(ok, false);
  assert.ok(codes(findings).includes('null-island'));
});

test('a half-declared position is caught', () => {
  const { findings } = reconcile([project({ lat:31, lon:null })]);
  assert.ok(codes(findings).includes('invalid-coordinates'));
});

test('an Excel serial read as a year is caught', () => {
  // 1899-12-31 is the Excel epoch, not a commissioning date.
  const { findings } = reconcile([project({ expectedCod:'1899-12-31' })]);
  assert.ok(codes(findings).includes('impossible-dates'));
});

test('an implausible duration is caught', () => {
  const { findings } = reconcile([project({ durationHours: 240 })]);
  assert.ok(codes(findings).includes('implausible-duration'));
});

test('a register that halves overnight is held, not published', () => {
  const previous = summarise(fleet(100));
  const { ok, findings } = reconcile(fleet(10), { previous });
  assert.equal(ok, false);
  assert.ok(codes(findings).includes('record-count-drop'));
});

test('a 1,000x capacity jump names the unit conversion', () => {
  /* The kW/MW slip. Every record stays individually valid and the fleet grows by
     three orders of magnitude. */
  const previous = summarise(fleet(10, { capacityMW: 100 }));
  const { findings } = reconcile(fleet(10, { capacityMW: 100_000 }), { previous });
  const jump = findings.find(f => f.code === 'capacity-jump');
  assert.ok(jump);
  assert.match(jump.message, /1,000×/, 'the message should point at the likely cause');
});

test('a status map that stopped matching is caught', () => {
  const previous = summarise([
    ...fleet(10, { stage: PROJECT_STAGE.OPERATING }),
    ...fleet(10, { stage: PROJECT_STAGE.UNDER_CONSTRUCTION }),
  ]);
  const { findings } = reconcile(fleet(20, { stage: PROJECT_STAGE.OPERATING }), { previous });
  assert.ok(codes(findings).includes('stage-vanished'));
});

test('a column that disappeared shows up as a null-rate jump', () => {
  const previous = summarise(fleet(20, { operator:'Someone' }));
  const { findings } = reconcile(fleet(20, { operator:null }), { previous });
  assert.ok(codes(findings).includes('null-rate-jump'));
});

test('ordinary growth is not flagged', () => {
  const previous = summarise(fleet(100));
  const { ok, findings } = reconcile(fleet(120), { previous });
  assert.equal(ok, true, `unexpected findings: ${codes(findings)}`);
});

test('a fleet energy total is only summed when every record publishes one', () => {
  const mixed = [project({ durationHours: 2 }), project({ durationHours: null })];
  const summary = summarise(mixed);
  assert.equal(summary.withEnergy, 1);
  assert.equal(summary.records, 2);
  // The total covers only the records that have one, and the count says so.
  assert.equal(summary.totalMWh, 200);
});

/* ---- atomic publication ------------------------------------------------- */

test('a first publish writes the artifact and its summary', async () => {
  const dir = tmp();
  const file = `${dir}/ercot.json`;
  const result = await publishDataset({ file, projects: fleet(10), meta: META });

  assert.equal(result.published, true);
  assert.ok(existsSync(abs(file)));
  const artifact = JSON.parse(readFileSync(abs(file), 'utf8'));
  assert.equal(artifact.projects.length, 10);
  assert.equal(artifact.summary.records, 10);
  assert.equal((await lastAccepted(file)).records, 10, 'the next run has a baseline');
});

test('a suspicious run leaves the good artifact untouched', async () => {
  const dir = tmp();
  const file = `${dir}/ercot.json`;
  await publishDataset({ file, projects: fleet(100), meta: META });
  const good = readFileSync(abs(file), 'utf8');

  const result = await publishDataset({ file, projects: fleet(5), meta: META });

  assert.equal(result.published, false);
  assert.equal(readFileSync(abs(file), 'utf8'), good, 'the previous artifact is byte-identical');
  assert.ok(existsSync(abs(`${file}.diagnostic.json`)), 'and the reason sits beside it');

  const diagnostic = JSON.parse(readFileSync(abs(`${file}.diagnostic.json`), 'utf8'));
  assert.equal(diagnostic.previousArtifactPreserved, true);
  assert.ok(codes(diagnostic.findings).includes('record-count-drop'));
});

test('an invalid record never reaches the artifact', async () => {
  const dir = tmp();
  const file = `${dir}/ercot.json`;
  await publishDataset({ file, projects: fleet(10), meta: META });
  const good = readFileSync(abs(file), 'utf8');

  const result = await publishDataset({
    file, meta: META,
    projects: [project({ capacityMW: -5 })],
  });

  assert.equal(result.published, false);
  assert.equal(readFileSync(abs(file), 'utf8'), good);
});

test('drift can be accepted deliberately, and the acceptance is recorded', async () => {
  const dir = tmp();
  const file = `${dir}/ercot.json`;
  await publishDataset({ file, projects: fleet(100), meta: META });

  const held = await publishDataset({ file, projects: fleet(5), meta: META });
  assert.equal(held.published, false);

  const accepted = await publishDataset({ file, projects: fleet(5), meta: META, acceptDrift: true });
  assert.equal(accepted.published, true);

  const artifact = JSON.parse(readFileSync(abs(file), 'utf8'));
  assert.equal(artifact.reconciliation.acceptedDrift, true, 'the record says a human accepted it');
  assert.ok(artifact.reconciliation.findings.some(f => f.code === 'record-count-drop'));
  assert.ok(!existsSync(abs(`${file}.diagnostic.json`)), 'a successful publish clears the diagnostic');
});

test('the previous version is kept so a bad acceptance can be reversed', async () => {
  const dir = tmp();
  const file = `${dir}/ercot.json`;
  await publishDataset({ file, projects: fleet(10), meta: META });
  await publishDataset({ file, projects: fleet(11), meta: META });

  const previous = JSON.parse(readFileSync(abs(`${file}.previous.json`), 'utf8'));
  assert.equal(previous.summary.records, 10, 'without a re-fetch');
});

test('a download failure preserves the artifact and names the stage', async () => {
  const dir = tmp();
  const file = `${dir}/ercot.json`;
  await publishDataset({ file, projects: fleet(10), meta: META });
  const good = readFileSync(abs(file), 'utf8');

  const result = await runPipeline({
    label:'ercot', file, meta: META,
    steps: {
      download: () => { throw new Error('HTTP 503'); },
      parse: () => { throw new Error('should never run'); },
      normalize: () => [],
    },
  });

  assert.equal(result.published, false);
  assert.equal(readFileSync(abs(file), 'utf8'), good);
  const diagnostic = JSON.parse(readFileSync(abs(`${file}.diagnostic.json`), 'utf8'));
  assert.equal(diagnostic.findings[0].code, 'download',
    'a network failure is not reported as a parse failure');
  assert.match(diagnostic.findings[0].detail, /503/);
});

test('a parse failure is distinguished from a download failure', async () => {
  const dir = tmp();
  const file = `${dir}/ercot.json`;
  const result = await runPipeline({
    label:'ercot', file, meta: META,
    steps: {
      download: () => 'bytes',
      parse: () => { throw new Error('no sheet resolved the required columns'); },
      normalize: () => [],
    },
  });

  assert.equal(result.published, false);
  const diagnostic = JSON.parse(readFileSync(abs(`${file}.diagnostic.json`), 'utf8'));
  assert.equal(diagnostic.findings[0].code, 'parse',
    'the file changed shape — a different problem from the endpoint being down');
});

test('a full run publishes through every stage', async () => {
  const dir = tmp();
  const file = `${dir}/ercot.json`;
  const result = await runPipeline({
    label:'ercot', file, meta: META,
    steps: {
      download: () => 'bytes',
      parse: (bytes) => ({ rows: bytes.length }),
      normalize: () => fleet(12),
    },
  });

  assert.equal(result.published, true);
  assert.equal(JSON.parse(readFileSync(abs(file), 'utf8')).projects.length, 12);
});

test('a corrupt existing artifact is not treated as a baseline', async () => {
  /* Publishing over corruption is an improvement, and refusing to would leave a
     dataset permanently stuck behind an unreadable file. */
  const dir = tmp();
  const file = `${dir}/ercot.json`;
  writeFileSync(abs(file), '{ not json');
  assert.equal(await lastAccepted(file), null);
  assert.equal((await publishDataset({ file, projects: fleet(10), meta: META })).published, true);
});

test('drift thresholds are wide enough not to police a growing market', () => {
  // These exist to catch a broken ingestion, not a market that added batteries.
  assert.ok(DRIFT.recordCountDrop <= 0.25);
  assert.ok(DRIFT.recordCountJump >= 1.5);
  assert.equal(SEVERITY.ERROR, 'error');
});
