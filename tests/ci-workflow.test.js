/* ---------------------------------------------------------------------------
   WHAT THE CHEAPER PIPELINE MUST STILL GUARANTEE (7 Nov 2026).

   Pull requests run lighter browser checks, main skips commits it has already
   moved past, and the data bot rebases before it pushes. Each saves minutes,
   and each would be a defect if it reached a publish. These tests pin the
   lines that keep them away from one:

     · every run that can deploy runs the full browser suite first;
     · nothing on main is cancelled by arrival order, and the release lock is
       unchanged (tests/production-release.test.js pins the lock itself);
     · a skipped commit is one the release script would refuse anyway;
     · the bot pushes only through the rebase-and-retry script.

   Matched with regexes over the workflow text, like the other workflow tests:
   the files' shape is fixed and a YAML dependency here would be a worse trade.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { supersededCheck, DEPLOYING_EVENTS } from '../scripts/ci/superseded.mjs';
import { billedMinutes, minutesUsed, renderMinutes } from '../scripts/ci/minutes.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(path.join(REPO, rel), 'utf8');
const code = (text) => text.split('\n').filter(line => !/^\s*#/.test(line)).join('\n');
const ci = read('.github/workflows/ci.yml');
const etl = read('.github/workflows/etl.yml');
const fullCheck = read('.github/workflows/full-check.yml');

/* One step of a job, from its `- name:` to the next step. */
const step = (yml, name) => {
  const start = yml.indexOf(`- name: ${name}\n`);
  assert.ok(start > 0, `no step named "${name}"`);
  const next = yml.indexOf('\n      - ', start + 1);
  return yml.slice(start, next > 0 ? next : undefined);
};

/* ---- every publish is preceded by the full suite ------------------------------ */

test('the full browser suite runs on every event the deploy job accepts', () => {
  const deployIf = code(ci).match(/\n  deploy:[\s\S]*?\n    if: >-\n([\s\S]*?)\n    runs-on/)[1];
  assert.match(deployIf, /github\.ref == 'refs\/heads\/main'/);
  assert.match(deployIf, /contains\(fromJSON\('\["push", "schedule", "workflow_dispatch"\]'\), github\.event_name\)/);
  assert.ok(!/pull_request/.test(deployIf), 'a pull request must never reach the deploy job');
  assert.deepEqual(DEPLOYING_EVENTS, ['push', 'schedule', 'workflow_dispatch'], 'superseded.mjs and the deploy job must agree on which runs deploy');

  /* The full suite's only condition besides SUPERSEDED is "not a pull request",
     so it runs on all three events above. */
  const full = step(ci, 'Check desktop, mobile, both languages and saved cases');
  assert.match(full, /if: env\.SUPERSEDED != 'true' && github\.event_name != 'pull_request'\n/);
  assert.match(full, /npm run test:e2e/);
  const smoke = step(ci, 'Check the key pages of the built site (pull request)');
  assert.match(smoke, /if: env\.SUPERSEDED != 'true' && github\.event_name == 'pull_request'\n/);
  assert.match(smoke, /npm run test:smoke/);
  assert.ok(!/PLATFORM_TEST_BASE_URL/.test(smoke), 'the pull-request smoke run must test its own build, not production');
});

test('a deploy never starts for a commit the test job found superseded', () => {
  assert.match(code(ci), /needs\.test\.outputs\.superseded != 'true'/);
  assert.match(ci, /superseded: \$\{\{ steps\.check\.outputs\.superseded == 'true' \|\| steps\.recheck\.outputs\.superseded == 'true' \}\}/);
  /* Every gate after the check is skipped together, or not at all. */
  const test = ci.slice(ci.indexOf('\n  test:\n'), ci.indexOf('\n  deploy:\n'));
  const steps = test.split('\n      - ').slice(1);
  const afterCheck = steps.slice(steps.findIndex(s => s.startsWith('name: Check this commit is still the head of main')) + 1);
  for (const s of afterCheck){
    const label = s.split('\n')[0];
    assert.match(s, /\n {8}if: (env\.SUPERSEDED != 'true'|always\(\))/, `step "${label}" is not gated on SUPERSEDED`);
  }
});

/* ---- nothing on main is cancelled ---------------------------------------------- */

test('only a pull request\'s own run is ever cancelled', () => {
  const executable = code(ci);
  const cancels = [...executable.matchAll(/cancel-in-progress: (.*)/g)].map(m => m[1].trim());
  assert.deepEqual(cancels.sort(), ['${{ github.event_name == \'pull_request\' }}', 'false'].sort());
  assert.match(executable, /group: \$\{\{ github\.event_name == 'pull_request' && format\('ci-pr-\{0\}', github\.event\.pull_request\.number\) \|\| format\('ci-run-\{0\}-\{1\}', github\.run_id, inputs\.ref \|\| github\.sha\) \}\}/,
    'outside pull requests every run must get a group of its own');
});

test('a draft runs nothing, and an unrelated label starts nothing in CI', () => {
  assert.match(ci, /pull_request:\n    types: \[opened, synchronize, reopened, ready_for_review\]/);
  assert.ok(!/labeled/.test(code(ci).split('\njobs:')[0]), 'ci.yml must not run on labels');
  assert.match(ci, /\n  test:\n    name: .*\n    if: github\.event_name != 'pull_request' \|\| github\.event\.pull_request\.draft == false\n/);
});

test('the full-check workflow runs only for its own label and reads no secret', () => {
  assert.match(fullCheck, /contains\(github\.event\.pull_request\.labels\.\*\.name, 'full-check'\)/);
  assert.match(fullCheck, /github\.event\.action != 'labeled' \|\| github\.event\.label\.name == 'full-check'/);
  assert.match(fullCheck, /npm run test:e2e/);
  assert.ok(!/secrets\./.test(fullCheck), 'full-check.yml must not read a secret');
  assert.ok(!/\n {2}push:|workflow_call|vercel/i.test(code(fullCheck)), 'full-check.yml must not be able to publish');
});

/* ---- superseded: the same question the release script asks, asked earlier ---- */

const SHA = (c) => c.repeat(40);

test('a commit main has moved past is skipped; anything that cannot deploy never is', async () => {
  const main = async () => SHA('b');
  assert.equal((await supersededCheck({ candidate: SHA('a'), ref: 'refs/heads/main', event: 'push', readMain: main })).superseded, true);
  assert.equal((await supersededCheck({ candidate: SHA('a'), ref: 'refs/heads/main', event: 'schedule', readMain: main })).superseded, true);
  assert.equal((await supersededCheck({ candidate: SHA('b'), ref: 'refs/heads/main', event: 'push', readMain: main })).superseded, false);
  for (const [ref, event] of [['refs/pull/7/merge', 'pull_request'], ['refs/heads/main', 'pull_request'], ['refs/heads/feature', 'workflow_dispatch']]){
    const result = await supersededCheck({ candidate: SHA('a'), ref, event, readMain: async () => { throw new Error('must not be asked'); } });
    assert.equal(result.superseded, false, `${event} on ${ref}`);
  }
});

test('when main cannot be read, every gate runs', async () => {
  for (const readMain of [async () => { throw new Error('HTTP 502'); }, async () => undefined, async () => 'not-a-sha']){
    const result = await supersededCheck({ candidate: SHA('a'), ref: 'refs/heads/main', event: 'push', readMain });
    assert.equal(result.superseded, false);
  }
  assert.equal((await supersededCheck({ candidate: 'short', ref: 'refs/heads/main', event: 'push', readMain: async () => SHA('b') })).superseded, false);
});

/* ---- the data bot pushes through the rebase-and-retry script ------------------- */

test('the bot pushes to main only through push-main.sh, which never force-pushes', () => {
  const executable = code(etl);
  const pushes = [...executable.matchAll(/^\s*(git push.*|bash scripts\/ci\/push-main\.sh)$/gm)].map(m => m[1].trim());
  assert.deepEqual(pushes, ['bash scripts/ci/push-main.sh', 'bash scripts/ci/push-main.sh', 'git push -u origin "$BRANCH"', 'bash scripts/ci/push-main.sh'],
    'a bare `git push` to main fails whenever a merge lands during the run');
  const script = read('scripts/ci/push-main.sh');
  assert.ok(!/--force|\s-f\b|\+HEAD/.test(code(script)), 'push-main.sh must never force-push');
  assert.match(script, /git rebase --abort/, 'a conflicting rebase must be abandoned, not resolved');
  assert.match(script, /git push origin HEAD:main/);
});

/* ---- the minutes line ------------------------------------------------------------ */

test('minutes are counted per job, rounded up, inside each window', () => {
  const now = Date.parse('2026-11-09T00:00:00Z');
  const job = (endDaysAgo, seconds, workflow = 'CI') => {
    const end = now - endDaysAgo * 86_400_000;
    return { started_at: new Date(end - seconds * 1000).toISOString(), completed_at: new Date(end).toISOString(), workflow_name: workflow };
  };
  assert.equal(billedMinutes(job(1, 61)), 2);
  assert.equal(billedMinutes(job(1, 60)), 1);
  assert.equal(billedMinutes({ started_at: '2026-11-01T00:00:00Z', completed_at: '2026-11-01T00:00:00Z' }), 0, 'a skipped job costs nothing');
  assert.equal(billedMinutes({ started_at: null, completed_at: null }), 0);
  const used = minutesUsed([job(1, 61), job(6, 600, 'Live data'), job(8, 120), job(29, 30), job(31, 600)], now);
  assert.deepEqual(used, { d7: 12, d30: 15, byWorkflow: { CI: 5, 'Live data': 10 } });
  const text = renderMinutes(used);
  assert.match(text, /^## Automation minutes\n/);
  assert.match(text, /\*\*12\*\* in the last 7 days, \*\*15\*\* in the last 30/);
  assert.match(text, /Live data 10 · CI 5/);
});

test('the weekly briefing appends the minutes, can read runs, and still writes nothing', () => {
  const job = code(etl.slice(etl.indexOf('\n  weekly-briefing:\n')));
  assert.match(job, /permissions:\s*\n\s*contents: read\s*\n\s*issues: write\s*\n\s*actions: read/);
  assert.match(job, /node scripts\/ci\/minutes\.mjs > minutes\.md/);
  assert.ok(!/actions: write/.test(job));
});
