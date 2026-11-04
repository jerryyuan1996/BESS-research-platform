#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   THE CI SUMMARY.

   Reads the timings that scripts/ci/timed.mjs recorded for this job and writes
   one table to the GitHub job summary: what each gate cost, whether it passed,
   and where the evidence is. It answers the question a red run actually raises
   — "what got slower, and what do I look at" — without a dashboard or a service.

   Deliberately not a pass/fail gate. A failed step already fails the job; this
   only reports. A summary step that can itself fail the build is a way to lose
   the report at the moment it is most needed.

     node scripts/ci/summary.mjs --artifacts page-check-evidence
     node scripts/ci/summary.mjs --extra "$RUNNER_TEMP/test-job/ci-timings.tsv"
   --------------------------------------------------------------------------- */
import { appendFileSync, existsSync, readFileSync } from 'node:fs';

import { timingsFile } from './timings-file.mjs';

const argv = process.argv.slice(2);
const option = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : null;
};

const mainFile = timingsFile();
const extraFile = option('--extra');
const artifacts = (option('--artifacts') ?? '').split(',').map(s => s.trim()).filter(Boolean);
const title = option('--title') ?? 'CI timings';

function readTimings(file){
  if (!file || !existsSync(file)) return [];
  return readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .filter(line => line.trim() !== '')
    .map(line => {
      const [label, seconds, status] = line.split('\t');
      const value = Number(seconds);
      return {
        label: label ?? '(unlabelled)',
        seconds: Number.isFinite(value) ? value : 0,
        status: Number(status ?? 1),
      };
    });
}

const rows = [
  ...readTimings(mainFile),
  ...readTimings(extraFile).map(r => ({ ...r, label: `pre-deploy · ${r.label}` })),
];

function duration(seconds){
  return seconds >= 60 ? `${(seconds / 60).toFixed(1)} min` : `${seconds.toFixed(1)} s`;
}

function runUrl(){
  const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;
  if (!GITHUB_SERVER_URL || !GITHUB_REPOSITORY || !GITHUB_RUN_ID) return null;
  return `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`;
}

const lines = [];
lines.push(`## ${title}`, '');

if (rows.length === 0){
  lines.push('No step timings were recorded for this job.', '');
} else {
  const total = rows.reduce((sum, r) => sum + r.seconds, 0);
  const failed = rows.filter(r => r.status !== 0);

  lines.push('| Step | Duration | Result |', '| --- | ---: | --- |');
  for (const row of rows){
    const result = row.status === 0 ? 'pass' : `**failed (${row.status})**`;
    lines.push(`| ${row.label} | ${duration(row.seconds)} | ${result} |`);
  }
  lines.push(`| **Total (timed steps)** | **${duration(total)}** | ${failed.length === 0 ? 'all passed' : `${failed.length} failed`} |`);
  lines.push('');

  if (failed.length > 0){
    lines.push('Failed: ' + failed.map(r => `\`${r.label}\``).join(', ') + '.', '');
  }
}

const url = runUrl();
if (artifacts.length > 0){
  const names = artifacts.map(a => `\`${a}\``).join(', ');
  lines.push(url ? `Evidence: ${names} — [open the run](${url}).` : `Evidence: ${names}.`, '');
} else if (url){
  lines.push(`[Open the run](${url}).`, '');
}

const markdown = lines.join('\n');
process.stdout.write(markdown + '\n');

if (process.env.GITHUB_STEP_SUMMARY){
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown + '\n', 'utf8');
}
