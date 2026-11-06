#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   PIN THE BRIEFING'S DESIGN ANSWER AT THE VINTAGE THE SECTION FIXTURES SAW.

     node scripts/pin-section-design.mjs                 (re-pin at the recorded vintage)
     node scripts/pin-section-design.mjs --data-commit <sha> --now <ISO time>

   Some sections (GB's home, duration and portfolio) read the Brief's design
   answer, src/briefing/designData.js, which builds the whole briefing from the
   committed view store and the ETL's public snapshots, on the wall clock. The
   ETL commits new snapshots every day, so that answer moves (a new ECB
   GBP rate moves GB's "comes closest, at −$277k/MW"). The parity test checks
   that splitting a sections.js did not change what it says, not what the
   briefing says, so it renders against this pin instead
   (tests/helpers/pin-design.mjs).

   The pin is not taken from today's data. It is rebuilt from the data commit
   and clock the fixtures were taken at, read out of git into a temporary
   folder, with today's code. Re-pin only when the design projection's shape
   changes (the parity test's shape check says so); a re-pin must leave every
   section fingerprint passing.

   A dev tool, never imported by the site.
   --------------------------------------------------------------------------- */
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { briefingFromDisk } from '../src/briefing/disk.js';
import { designProjection } from '../src/briefing/model.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(REPO, 'tests/fixtures/sections-design-vintage.json');

const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : null;
};
const recorded = JSON.parse(await readFile(OUT, 'utf8').catch(() => '{}'));
const dataCommit = option('--data-commit') || recorded.dataCommit;
const now = option('--now') || recorded.now;
if (!dataCommit || !now) throw new Error('give --data-commit and --now (no recorded vintage to reuse)');

const git = (...a) => execFileSync('git', a, { cwd: REPO, maxBuffer: 256 * 1024 * 1024 });
const files = git('ls-tree', '-r', '--name-only', dataCommit, '--', 'view', 'public/data/public')
  .toString('utf8').split('\n').filter(Boolean);

const root = await mkdtemp(path.join(tmpdir(), 'bess-design-pin-'));
try {
  for (const file of files){
    const target = path.join(root, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, git('show', `${dataCommit}:${file}`));
  }
  const design = designProjection(await briefingFromDisk({ root, now: new Date(now) }));
  const pin = {
    dataCommit,
    now,
    note: 'The briefing design answer (src/briefing/designData.js) as the section fixtures saw it: view/ and public/data/public/ at dataCommit, briefing clock at now. Written by scripts/pin-section-design.mjs; read by tests/helpers/pin-design.mjs.',
    design,
  };
  await writeFile(OUT, JSON.stringify(pin, null, 2) + '\n');
  console.log(`pinned ${design.build.length} markets' design answers at ${dataCommit} / ${now} → ${path.relative(REPO, OUT)}`);
} finally {
  await rm(root, { recursive: true, force: true });
}
