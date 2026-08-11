/* ---------------------------------------------------------------------------
   CONFIDENTIALITY.

   Two scopes, and the second exists because the first was not enough:

     the built artefact  — what gets published. Which artefact is SCAN_DIR's
                           business; see below.
     the tracked tree    — what is in git at all, bundled or not. See the
                           section at the foot of this file.

   The file is still named bundle-confidentiality because ci.yml, package.json
   and the history-purge notes all reference that path, and a rename buys
   nothing the header does not already say.

   Scans for markers that must never be published, and fails if it finds one.

   This test exists because every other safeguard in this repository turned out
   to be insufficient on its own, and the failures were only visible here:

     - Moving the values into local-data/ left the section PROSE behind. The
       project name, site address and capital structure were string literals in
       portfolio.js.
     - Gating the render did not help. A bundler ships a function's string
       literals whether or not the function is ever called.
     - Gating a CSV export block did not help either, for the same reason: the
       row labels named the project and its financial model.
     - A reconstruction helper had the third-party report's figures hardcoded in
       its body rather than reading them from the data module it sat next to.

   Each of those looked fixed by inspection and was caught by scanning the actual
   artefact. That is the argument for asserting on the build output rather than on
   the source: the bundle is what gets published, and it is the only thing whose
   contents are the whole truth.

   Skips with a clear message when the output directory is absent — `npm test`
   must not require a build.

   THAT SKIP IS ONLY SAFE BECAUSE SOMETHING ELSE INSISTS ON THE BUILD. It did not
   used to be. CI ran `npm test` BEFORE `npm run build` and never re-ran it, so
   dist/ never existed while these tests ran and both of them skipped on every
   single CI run — this file, the last line of defence, was inert for as long as
   that ordering stood. It looked green. Locally it was masked by whatever stale
   dist/ happened to be lying around, which is worse than nothing: it made the
   guard appear to work while it was scanning a months-old artefact.

   So enforcement is now explicit rather than assumed. `.github/workflows/ci.yml`
   runs this file again after the build with REQUIRE_OUTPUT=1, and under that
   flag an absent directory is a failure instead of a skip. A vacuous pass is no
   longer reachable: either the artefact was scanned, or the run went red.

   WHICH DIRECTORY IS SCANNED IS A PARAMETER, and that matters more than it looks.
   The publishable artefact is no longer `dist/`. Deployment is Vercel prebuilt,
   so what is uploaded is `.vercel/output` — produced by `vercel build`, which
   runs the Vite build and then copies, rewrites and adds to its result. Scanning
   `dist/` and shipping `.vercel/output` would put a transformation between the
   check and the thing checked, which is the same defect as scanning before
   building, just harder to see.

   So SCAN_DIR selects the target:

     unset        dist/            — a developer's local `npm run build`
     dist         same, explicitly — the pull-request gate, where no Vercel
                                     token exists and `vercel build` cannot run
     .vercel/output                — the deploy job, on the exact bytes
                                     `vercel deploy --prebuilt` is about to
                                     upload. This is the authoritative scan.
   --------------------------------------------------------------------------- */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Relative to the repository root, so a caller cannot be tricked into scanning
   some unrelated directory that happens to be clean. */
const SCAN_REL = process.env.SCAN_DIR || 'dist';
const DIST = path.resolve(REPO, SCAN_REL);

/* Set by the post-build CI steps. Without it an absent output directory is a
   legitimate skip (a developer running `npm test` has not necessarily built);
   with it, an absent directory means the step that was supposed to scan the
   artefact found nothing to scan, which is the exact failure this file exists to
   make impossible. */
const REQUIRE_OUTPUT = process.env.REQUIRE_OUTPUT === '1';

/**
 * True when the output directory is missing and the test should bail out early.
 *
 * Under REQUIRE_OUTPUT this never returns — it throws instead, so a missing
 * build cannot be mistaken for a clean one.
 */
function skipWithoutDist(t, message){
  if (existsSync(DIST)) return false;
  assert.ok(!REQUIRE_OUTPUT,
    `REQUIRE_OUTPUT=1 but ${SCAN_REL}/ is absent, so nothing was scanned.\n` +
    'This step runs after the build precisely so the artefact exists. Either the\n' +
    `build did not run, it wrote somewhere other than ${SCAN_REL}/, or the step\n` +
    'order in .github/workflows/ci.yml regressed. Do not relax this assertion: a\n' +
    'skip here is what let the confidentiality guard sit inert through every CI\n' +
    'run before.');
  t.skip(message);
  return true;
}

/**
 * Strings that must not appear in a published artefact.
 *
 * Note what is deliberately NOT here: "Kemerton" on its own. It is a real WA
 * place — the Kemerton Strategic Industrial Area, Kemerton Terminal, the KEM–MRR
 * constraint — and that geography is public and discussed freely in the grid and
 * RCM tabs. What is confidential is THIS fund's asset at that location. A marker
 * list that banned the place name would either fail constantly or push someone
 * into deleting legitimate public analysis.
 */
const FORBIDDEN = [
  // The fund's named asset and its site
  'Project Kemerton',
  'Wellesley',
  'Lot 5',

  // Confidential third-party report and the sites in it
  'Marsden Jacob',
  'CONFIDENTIAL_THIRD_PARTY',
  'Baldivis',
  'Hopeland',
  'Mimegarra',

  // Project technical specification
  'SCS4600',

  // Financial-model figures and document names
  '242234000',
  '254517000',
  '249026000',
  'Kemerton Financial Model',
  'Kemerton GPS report',
  'Kemerton BESS Schedule',

  // Links to the confidential document store
  'drive.google.com',
];

async function walk(dir){
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })){
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

test('no confidential marker appears in the built bundle', async (t) => {
  if (skipWithoutDist(t, `${SCAN_REL}/ not present — run "npm run build" first`)) return;

  /* `.map` is in the filter even though vite.config.js sets sourcemap:FALSE and
     no .map file is currently emitted. That is deliberate, and the reason is in
     the config's own comment: a dist/ scan once found confidential names
     reachable through a .map long after the bundle itself was clean, which is
     why production sourcemaps were turned off. Keeping the extension here means
     that if anyone ever turns them back on, the maps are scanned like the code
     rather than becoming an unscanned publication channel. A marker reachable
     through a .map is as published as one in the bundle. */
  const files = (await walk(DIST)).filter(f => /\.(js|css|html|map|json)$/.test(f));
  assert.ok(files.length > 0, `${SCAN_REL}/ contains no scannable files`);

  const hits = [];
  for (const file of files){
    const text = await readFile(file, 'utf8');
    for (const marker of FORBIDDEN){
      if (text.includes(marker)){
        hits.push(`${path.relative(REPO, file)} contains "${marker}"`);
      }
    }
  }

  assert.deepEqual(hits, [],
    'Confidential content reached the build artefact.\n' +
    'Gating a render is not enough — a bundler ships string literals from code it\n' +
    'never calls. Move the text itself into local-data/, as portfolio.js was.\n' +
    'See docs/data-policy.md.');
});

test('the confidential local-data directory is never copied into the artefact', async (t) => {
  if (skipWithoutDist(t, `${SCAN_REL}/ not present`)) return;
  const files = await walk(DIST);
  const leaked = files.filter(f => /local-data/.test(f)).map(f => path.relative(REPO, f));
  assert.deepEqual(leaked, [], 'local-data/ must never be copied into the build output');
});

test('the local-data payloads are git-ignored', async () => {
  const gitignore = await readFile(path.join(REPO, '.gitignore'), 'utf8');
  // The pattern that keeps confidential payloads out of the repository entirely.
  assert.match(gitignore, /^local-data\/\*$/m,
    '.gitignore must exclude local-data/* or the confidential layer will be committed');
  assert.match(gitignore, /^!local-data\/README\.md$/m,
    'local-data/README.md is the one file that should be tracked');
});

/* ===========================================================================
   THE TRACKED TREE.

   Everything above asserts on the BUILD. That was the whole guard, and it had a
   hole the size of the incident it was written for: a confidential file that is
   tracked but never bundled is invisible to it.

   Two such files existed for eleven days.
   `legacy/global-cockpit-0727-v1.html` and its byte-identical twin
   `reference/Global BESS Dashboard Cockpit_0727_v1.html` sat tracked on main,
   carrying every marker in the list below, while the bundle scan ran green on
   every single CI run — correctly, because neither file is under public/ and
   neither reached dist/. They were purged from all history on 10 August 2026.

   Nothing stopped an equivalent file being committed tomorrow. This does.

   Publishing is not the only way to leak: the repository is cloned, forked and
   granted to collaborators, and `git show <sha>:<path>` does not care whether a
   bundler ever touched the file. So the question this asks is not "did it
   ship?" but "is it in the repository at all?".
   =========================================================================== */

/**
 * Files allowed to contain markers, because naming them is their job.
 *
 * Deliberately exact paths rather than patterns. `tests/*` would have exempted
 * the whole suite, and a fixture quietly carrying real project figures is
 * precisely the thing worth catching.
 */
const MARKER_DECLARATION_SITES = [
  // This file. The FORBIDDEN list above is the detection rule itself.
  'tests/bundle-confidentiality.test.js',
  // Explains which markers are withheld and why "Kemerton" alone is not one.
  'docs/data-policy.md',
];

test('no confidential marker appears in any tracked file', () => {
  /* `git ls-files` rather than a directory walk, because TRACKED is the exact
     boundary that matters. It excludes local-data/ and every other ignored
     path — which are supposed to hold this material — and it includes anything
     staged for a commit, which is the moment a leak becomes permanent. */
  let listing;
  try {
    listing = execFileSync('git', ['ls-files', '-z'], { cwd: REPO, maxBuffer: 1 << 28 }).toString();
  } catch (err){
    /* Not a skip. A skip here is what let the bundle guard sit inert for months,
       and the same reasoning applies: if this check cannot run, the run must go
       red rather than quietly assert nothing. */
    assert.fail(
      'Could not enumerate tracked files with git, so nothing was scanned.\n' +
      `git ls-files failed: ${err.message}\n` +
      'This test needs a real checkout. Do not convert it to a skip.');
  }

  const tracked = listing.split('\0').filter(Boolean);
  assert.ok(tracked.length > 100,
    `git ls-files returned only ${tracked.length} paths — that is not this repository`);

  const hits = [];
  let scanned = 0;

  for (const rel of tracked){
    if (MARKER_DECLARATION_SITES.includes(rel)) continue;

    let text;
    try {
      text = readFileSync(path.join(REPO, rel), 'utf8');
    } catch {
      // Deleted-but-staged, or unreadable. Not something this test can judge.
      continue;
    }
    /* Binary files cannot be substring-matched meaningfully, and the ones here
       (.xlsx fixtures, images) are compressed containers where a marker would
       not appear as plaintext anyway. Skipping them is a real and acknowledged
       limit of this check, not an oversight. */
    if (text.includes('\0')) continue;

    scanned++;
    for (const marker of FORBIDDEN){
      if (text.includes(marker)) hits.push(`${rel} contains "${marker}"`);
    }
  }

  assert.ok(scanned > 100, `only ${scanned} text files were scanned — the enumeration is wrong`);

  assert.deepEqual(hits, [],
    'Confidential content is tracked in this repository.\n' +
    'It does not matter whether it reaches the bundle: a clone, a fork or a\n' +
    'collaborator grant reads it straight out of git. Move the text into\n' +
    'local-data/, which is ignored, and remove it from the index.\n' +
    'If it has already been pushed, removing it at HEAD is not enough — the\n' +
    'object stays reachable by SHA. See docs/data-policy.md.');
});

test('the marker list itself has not been redacted away', () => {
  /* The failure mode this exists for actually happened. The August 2026 history
     purge redacted markers by CONTENT, which rewrote this file's own FORBIDDEN
     list into '[REDACTED-PROJECT]' — leaving a guard that scanned for a string
     no bundle would ever contain and passed against anything. It was caught and
     both files were restored byte-for-byte.

     So the exemptions above are asserted, not assumed: each declaration site
     must still contain what it is exempt for. An exemption that has stopped
     being true is a hole with a comment over it. */
  for (const rel of MARKER_DECLARATION_SITES){
    const text = readFileSync(path.join(REPO, rel), 'utf8');
    const present = FORBIDDEN.filter(m => text.includes(m));
    assert.ok(present.length > 0,
      `${rel} is exempt from the marker scan but no longer contains any marker.\n` +
      'Either it was redacted — in which case the guard is now inert and must be\n' +
      'restored — or it genuinely stopped declaring markers, in which case drop\n' +
      'it from MARKER_DECLARATION_SITES so it gets scanned like everything else.');
  }

  // The guard cannot detect what it does not name.
  const self = readFileSync(path.join(REPO, 'tests/bundle-confidentiality.test.js'), 'utf8');
  const missing = FORBIDDEN.filter(m => !self.includes(m));
  assert.deepEqual(missing, [], 'every FORBIDDEN entry must be literally present in this file');
});
