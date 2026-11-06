#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   VERIFY — every published snapshot is intact and machine-written.

   Runs in CI on every push and pull request. It answers one question: does each
   file under public/data/ still hash to the checksum it carries?

   A mismatch means the file was edited by hand after the pipeline wrote it. That
   is worth failing a build over, because the whole value of labelling something
   "observed" on the page is that a reader can trust nobody adjusted it. An
   observed value that someone tuned is worse than an honest assumption — it
   carries more authority and less scrutiny.

   Exits non-zero on any failure.
   --------------------------------------------------------------------------- */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { REPO_ROOT, listSnapshots } from './lib/boundary.mjs';
import { verifyContentChecksum, sha256 } from './lib/envelope.mjs';
import { DATASETS, datasetById } from '../src/governance/datasets.js';
import { validateOntarioSnapshot, summarize as summarizeOntario } from './sources/ieso-ontario-zonal.mjs';

const log = (m) => process.stdout.write(m + '\n');

async function main(){
  const files = await listSnapshots();
  const dataFiles = files.filter(f => !f.endsWith('.summary.json'));

  if (dataFiles.length === 0){
    log('No snapshots published yet — nothing to verify.');
    log(`(${DATASETS.length} dataset(s) are configured. Run "npm run etl" to populate them.)`);
    return;
  }

  const problems = [];
  log(`Verifying ${dataFiles.length} snapshot(s)…`);

  for (const name of dataFiles){
    const id = name.replace(/\.json$/, '');
    const file = path.join(REPO_ROOT, 'public', 'data', 'public', name);

    let snapshot;
    try {
      snapshot = JSON.parse(await readFile(file, 'utf8'));
    } catch (err){
      problems.push(`${name}: not valid JSON — ${err.message}`);
      continue;
    }

    const dataset = datasetById(id);
    if (!dataset){
      // A file with no catalogue entry is either a stale artefact from a removed
      // dataset or something that should not be there at all. Either way a human
      // should look.
      problems.push(`${name}: no dataset "${id}" in the catalogue — orphaned snapshot`);
      continue;
    }

    if (dataset.connector === 'ieso-ontario-zonal'){
      try {
        validateOntarioSnapshot(snapshot);
        const summary = JSON.parse(await readFile(path.join(REPO_ROOT, 'public', 'data', 'public', id + '.summary.json'), 'utf8'));
        if (sha256(summary) !== sha256(summarizeOntario(snapshot))) throw new Error('Ontario summary does not match its source snapshot');
      }
      catch (error){ problems.push(name + ': ' + error.message); continue; }
    }

    if (snapshot.authority !== 'observed'){
      problems.push(`${name}: authority is "${snapshot.authority}", expected "observed"`);
    }

    if (!verifyContentChecksum(snapshot)){
      problems.push(
        `${name}: content checksum does not match the payload.\n` +
        `      The file was modified after the pipeline wrote it. Observed data must not\n` +
        `      be hand-edited — re-run the ETL, or if the change is intentional, make it\n` +
        `      in the connector so it is reproducible.`);
      continue;
    }

    log(`  ok  ${name}  (${snapshot.series?.length ?? 0} points, fetched ${String(snapshot.fetchedAt).slice(0, 10)})`);
  }

  if (problems.length){
    log('');
    log(`${problems.length} problem(s):`);
    for (const p of problems) log(`  - ${p}`);
    process.exit(1);
  }

  log('');
  log('All snapshots verified.');
}

main().catch(err => {
  console.error('verify failed:', err?.stack || err);
  process.exit(1);
});
