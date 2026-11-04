#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   TIME ONE CI STEP.

   GitHub Actions does not hand a workflow its own per-step durations. The P0-1
   baseline was assembled by reading them off the API after the fact with
   `gh run view`, which is fine once and not a habit: it answers "how long did
   the last run take" but not "which step cost the extra minute today".

   So each measured step runs through this wrapper. It records a label, a
   duration and the exit code into CI_TIMINGS_FILE, which the job summary
   renders at the end. It is a wrapper and nothing else: stdio is inherited, the
   exit code is passed through unchanged, and the command is spawned without a
   shell so quoting in the workflow stays ordinary.

   Without CI_TIMINGS_FILE it still runs the command and records nothing — a
   developer timing a suite locally gets their suite, not an error about a file
   that only CI sets.

     node scripts/ci/timed.mjs "unit tests" -- npm test
   --------------------------------------------------------------------------- */
import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import { timingsFile } from './timings-file.mjs';

const argv = process.argv.slice(2);
const separator = argv.indexOf('--');

if (separator < 1 || separator === argv.length - 1){
  console.error('usage: node scripts/ci/timed.mjs <label> -- <command> [args...]');
  process.exit(2);
}

const label = argv.slice(0, separator).join(' ').trim();
const [command, ...args] = argv.slice(separator + 1);

/* npm and npx are shell shims on Windows, not executables. Resolving them here
   keeps the spawn shell-free on every platform. */
const isWindows = process.platform === 'win32';
const executable = isWindows && ['npm', 'npx'].includes(command) ? `${command}.cmd` : command;

const startedAt = process.hrtime.bigint();
const result = spawnSync(executable, args, { stdio: 'inherit' });
const seconds = Number(process.hrtime.bigint() - startedAt) / 1e9;

if (result.error){
  console.error(`timed: could not run ${executable}: ${result.error.message}`);
  record(seconds, 127);
  process.exit(127);
}

const status = result.status ?? 1;
record(seconds, status);
process.exit(status);

function record(durationSeconds, exitCode){
  const file = timingsFile();
  if (!file) return;
  try {
    mkdirSync(path.dirname(file), { recursive: true });
    /* Tab-separated: a label with spaces stays one field, and the file is read
       only by summary.mjs, so it needs no quoting rules. */
    appendFileSync(file, `${label}\t${durationSeconds.toFixed(1)}\t${exitCode}\n`, 'utf8');
  } catch (err){
    /* Failing to write a timing must never fail the step it was timing. */
    console.error(`timed: could not record "${label}": ${err.message}`);
  }
}
