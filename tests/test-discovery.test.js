/* ---------------------------------------------------------------------------
   WHAT `npm test` DISCOVERS.

   `node --test` with no arguments searches the whole working tree. That is
   green on a clean CI checkout and red on a working copy, because tmp/, .tmp/
   and .claude/worktrees/ keep archived copies of older branches. Those copies
   import modules that have since been deleted, so the suite reports module
   failures for code the branch never touched — 269 subtests of noise in front
   of the 1245 real ones, and a red gate that says nothing about this branch.

   The `test` script therefore names its globs. These tests keep it that way,
   in both directions: discovery must not reach into an archived copy, and a
   real test file must not land somewhere the globs miss. The second failure is
   the quieter one — a test that exists and never runs looks exactly like a
   test that passes.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

/* Directories that hold copies of this repository rather than this repository
   itself: scratch space, archived worktrees, the confidential overlay, build
   output. Nothing in them is versioned as a test of the current tree. */
const ARCHIVED = new Set([
  'tmp', '.tmp', '.claude', '.git', 'local-data', 'dist', 'node_modules',
  'deliverables', 'legacy', 'test-results', 'playwright-report', 'release-records',
]);

/* Where the versioned suites live. A new location has to be added to both this
   set and the `test` script, deliberately, in the same change. */
const SUITE_ROOTS = ['tests', 'etl/tests'];

const TEST_FILE = /\.test\.(?:js|mjs|cjs)$/;

function suiteScript(){
  const pkg = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  return pkg.scripts?.test ?? '';
}

/* The positional arguments of the test command, with the surrounding quotes
   npm strips on the way to the shell. Flags are not discovery targets. */
function discoveryArgs(cmd){
  return (cmd.match(/"[^"]+"|'[^']+'|\S+/g) ?? [])
    .map(token => token.replace(/^["']|["']$/g, ''))
    .filter(token => token !== 'node' && token !== '--test' && !token.startsWith('--'));
}

function underSuiteRoot(relativePath){
  return SUITE_ROOTS.some(root => relativePath === root || relativePath.startsWith(`${root}/`));
}

function firstSegment(relativePath){
  return relativePath.split('/')[0];
}

/* Walk the versioned part of the tree — skipping the archives wholesale, which
   is also what makes this cheap — and collect every file the runner would pick
   up if it were pointed at a directory. */
function walk(dir, depth = 0){
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })){
    const absolute = path.join(dir, entry.name);
    const relative = path.relative(ROOT, absolute).split(path.sep).join('/');
    if (entry.isDirectory()){
      if (ARCHIVED.has(path.relative(ROOT, absolute).split(path.sep)[0])) continue;
      if (depth >= 4) continue;
      found.push(...walk(absolute, depth + 1));
    } else if (TEST_FILE.test(entry.name)){
      found.push(relative);
    }
  }
  return found;
}

test('the test script names its globs instead of searching the tree', () => {
  /* A bare `node --test` is the bug this file exists for. It cannot be spotted
     by reading a failing assertion, because it produces plausible-looking
     failures inside files the branch never edited. */
  const args = discoveryArgs(suiteScript());
  assert.ok(args.length > 0, 'npm test must pass at least one path or glob to node --test');
  for (const arg of args)
    assert.ok(!/^\.?\/?$/.test(arg), 'npm test must not search the repository root');
});

test('no glob points at an archived copy of the repository', () => {
  for (const arg of discoveryArgs(suiteScript())){
    const root = arg.replace(/^\.\//, '');
    assert.ok(!ARCHIVED.has(firstSegment(root)),
      `${root} is an archive or a build artefact, not a suite of this tree`);
    assert.ok(underSuiteRoot(root),
      `${root} is outside the versioned suite roots ${SUITE_ROOTS.join(', ')}`);
  }
});

test('a test file outside the suite roots would not be silently skipped', () => {
  /* Discovery is scoped, so a test written into a new directory runs nowhere.
     Every discovered file therefore has to sit under tests/ or etl/tests/. */
  const stray = walk(ROOT).filter(relative => !underSuiteRoot(relative));
  assert.deepEqual(stray, [], 'these test files are outside the scoped globs and never run');
});

test('the scoped globs still reach both suites', () => {
  /* The failure mode on the other side: an over-tight glob that skips the ETL
     suite quietly, leaving 1245 green assertions and one directory untested. */
  const discovered = walk(ROOT);
  for (const root of SUITE_ROOTS)
    assert.ok(discovered.some(relative => relative.startsWith(`${root}/`)),
      `${root} has no test file the globs would reach`);
});
