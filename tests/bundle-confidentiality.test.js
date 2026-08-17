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
import {
  loadMarkers, loadFingerprintKey, scanText, fingerprintOf, MARKER_FINGERPRINT,
} from '../scripts/lib/markers.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const git = (args) => execFileSync('git', args, { cwd: REPO, maxBuffer: 1 << 28 });

/** Paths with staged content. Empty when the index is clean. */
function stagedPaths(){
  try {
    return git(['diff', '--cached', '--name-only', '-z', '--diff-filter=ACMR'])
      .toString().split('\0').filter(Boolean);
  } catch {
    /* No git, or no HEAD to diff against in a fresh repository. The tracked-tree
       scan above already fails loudly when git is unusable, so staying quiet
       here avoids reporting the same broken checkout twice. */
    return [];
  }
}

/**
 * One staged blob.
 *
 * Three outcomes, not two. "Binary" and "could not read" are different: the
 * first is a known limit, the second means a staged file went unscanned, and
 * collapsing them into a single null let an unreadable blob be counted as clean.
 *
 * @returns {{text: string}|{binary: true}|{error: Error}}
 */
function stagedBlob(rel){
  let buf;
  try {
    buf = git(['show', `:${rel}`]);
  } catch (err){
    return { error: err };
  }
  return buf.includes(0) ? { binary: true } : { text: buf.toString('utf8') };
}

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
 * The marker set is no longer written here.
 *
 * It used to be: a plaintext array in this file, which exempted itself from its
 * own scan. So the detection rule was also a published copy of the confidential
 * values — every marker written into tracked source in order to be banned
 * everywhere else. That is backwards, and with a second live deal arriving it
 * stopped being survivable.
 *
 * The values now come from a repository secret in CI, or local-data/markers.json
 * on a developer's machine, and a committed fingerprint proves the set has not
 * been altered. See scripts/lib/markers.mjs, which carries the full reasoning
 * and the structural patterns that legitimately stay in the open.
 *
 * What that file's header explains and this one should not repeat: why absence
 * is a skip locally and a failure in CI, and why the fingerprint exists on top
 * of fail-closed.
 *
 * One judgement worth keeping visible here, because it decides what belongs in
 * the set at all. "Kemerton" on its own is deliberately NOT a marker. It is a
 * real WA place — the Kemerton Strategic Industrial Area, Kemerton Terminal, the
 * KEM–MRR constraint — and that geography is public and discussed freely in the
 * grid and RCM tabs. What is confidential is a particular fund's asset at that
 * location. A marker list that banned the place name would either fail
 * constantly or push someone into deleting legitimate public analysis.
 */
const REQUIRE_MARKERS = process.env.REQUIRE_MARKERS === '1';

/**
 * Loads the marker set, or reports why the test cannot run.
 *
 * Under REQUIRE_MARKERS this throws rather than returning null, so CI without a
 * secret goes red instead of scanning for nothing.
 */
function markerSet(){
  const loaded = loadMarkers({ required: REQUIRE_MARKERS });
  return loaded;
}

/** True when no marker set is available and the test should bail out early. */
function skipWithoutMarkers(t, loaded){
  if (loaded) return false;
  t.skip('no marker set available — place local-data/markers.json to scan locally');
  return true;
}

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
  const loaded = markerSet();
  if (skipWithoutMarkers(t, loaded)) return;

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
    /* Markers are reported redacted. An assertion message ends up in CI logs,
       which on a public build log is a more accessible publication channel than
       the repository ever was — printing the marker to report finding it would
       leak it in the course of complaining about the leak. */
    for (const hit of scanText(text, loaded.markers)){
      hits.push(`${path.relative(REPO, file)} contains ${hit}`);
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

/* THERE ARE NO LONGER ANY EXEMPTIONS, and that is the point of the redesign.
   `MARKER_DECLARATION_SITES` used to exempt this file and docs/data-policy.md,
   because both named markers in order to explain them. Both have stopped doing
   so — the values live outside the repository now, and the policy document
   describes the third-party report by role rather than by name — so the scan
   covers every tracked TEXT file with no path carved out.

   "Text" is load-bearing, not hedging: the loop below skips anything containing
   a NUL byte, because a marker inside a compressed container is not plaintext
   and a substring scan reads past it. That is an acknowledged limit of scanning
   the tree, and it is why scripts/scan-staged.mjs REFUSES staged document
   containers rather than skipping them — the gap is closed at the point where a
   file becomes committable, not here.

   An exemption is a hole with a comment over it. The previous design needed two
   and had to test that each was still telling the truth; this one needs none. */

test('no confidential marker appears in any tracked file', (t) => {
  const loaded = markerSet();
  if (skipWithoutMarkers(t, loaded)) return;

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
    for (const hit of scanText(text, loaded.markers)) hits.push(`${rel} contains ${hit}`);
  }

  /* THIS LOOP READ THE WORKING TREE, and the paths came from the index. Those
     are different contents whenever the two disagree — stage a confidential
     file, revert the working copy, and everything above reads clean bytes while
     the blob sits in the index ready to commit.

     In CI they cannot disagree: a fresh checkout has index, HEAD and working
     tree identical, which is why the gap was invisible there. Locally they
     disagree constantly, and locally is where commits are made.

     So anything staged is scanned again, as the blob itself. The pre-commit
     hook (scripts/scan-staged.mjs) is the real answer and runs before the
     commit exists; this closes the same hole for anyone running `npm test` with
     a dirty index, and costs nothing when the index is clean. */
  for (const rel of stagedPaths()){
    const result = stagedBlob(rel);
    /* Unreadable is not clean. A blob git would not hand over is unscanned, and
       counting it as a pass is the vacuous-pass failure in miniature. */
    assert.ok(!result.error,
      `${rel} is staged but its blob could not be read, so it was not scanned.\n` +
      `git show failed: ${result.error?.message}\n` +
      'Do not convert this to a skip.');
    if (result.binary) continue;
    scanned++;
    for (const hit of scanText(result.text, loaded.markers)){
      hits.push(`${rel} (STAGED CONTENT) contains ${hit}`);
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

test('the marker set matches its committed fingerprint', (t) => {
  /* The failure mode this exists for actually happened. The August 2026 history
     purge redacted markers by CONTENT, which rewrote this file's own marker list
     into '[REDACTED-PROJECT]' — leaving a guard that scanned for a string no
     bundle would ever contain and passed against anything. It was caught by
     inspection, not by a test, which is the part worth fixing.

     Fail-closed catches a MISSING set. It cannot catch one that has been quietly
     shortened, because a set of thirteen scans perfectly happily. The fingerprint
     can: it is a hash over the sorted set, committed in scripts/lib/markers.mjs,
     so any change to the set is a visible diff someone has to justify and any
     unintended change is a red run. The hash cannot be reversed into the
     markers, so nothing is published by asserting on it. */
  const loaded = markerSet();
  if (skipWithoutMarkers(t, loaded)) return;

  /* The key is a second secret and can legitimately be absent when the marker
     set is not — a developer may hold the set for scanning and not the key for
     verifying. Under REQUIRE_MARKERS both are required. */
  const keyed = loadFingerprintKey({ required: REQUIRE_MARKERS });
  if (!keyed){
    t.skip('no fingerprint key available — place local-data/fingerprint-key.txt to verify');
    return;
  }

  const actual = fingerprintOf(loaded.markers, keyed.key);
  assert.equal(actual.count, MARKER_FINGERPRINT.count,
    `the marker set has ${actual.count} entries, the committed fingerprint expects ` +
    `${MARKER_FINGERPRINT.count}. If this change is deliberate, regenerate with ` +
    '"npm run guard:fingerprint" and justify the diff in review.');
  assert.equal(actual.hmacSha256, MARKER_FINGERPRINT.hmacSha256,
    'the marker set does not match the committed fingerprint.\n' +
    'Either it was altered without updating scripts/lib/markers.mjs, or it was\n' +
    'altered without anyone intending it — which is exactly the case this catches.\n' +
    'A mismatch can also mean the wrong fingerprint KEY: the digest is keyed, so\n' +
    'the right set under the wrong key fails identically to the wrong set.');
});

test('every CI step that requires markers is given both secrets', () => {
  /* This test exists because the omission happened. The HMAC key was added to
     the loader and to the local key file, and never wired into ci.yml — so the
     first pull-request run passed REQUIRE_MARKERS=1 with the marker set and no
     key, and went red on the fingerprint check.

     The guard behaved correctly: it refused to report a set verified when it
     had no key to verify it with. But the failure surfaced in CI, minutes after
     a push, for a defect that is visible in a file sitting in the repository.

     REQUIRE_MARKERS is a promise that the run will actually scan and verify.
     Both secrets are what it takes to keep that promise, so the pairing is
     asserted rather than remembered. Parsed with indentation-aware matching
     rather than a YAML library: the workflow is the only consumer, and adding a
     dependency to this file — which is the last line of defence — is a worse
     trade than a regex over a file whose shape is fixed. */
  const yml = readFileSync(path.join(REPO, '.github/workflows/ci.yml'), 'utf8');

  /* Each `env:` block, as the lines indented under it. */
  const blocks = [...yml.matchAll(/^(\s+)env:\n((?:\1\s+\S.*\n?)*)/gm)].map(m => m[2]);
  const requiring = blocks.filter(b => /REQUIRE_MARKERS:\s*'?1'?/.test(b));

  assert.ok(requiring.length >= 3,
    `expected at least 3 CI steps to set REQUIRE_MARKERS, found ${requiring.length}. ` +
    'If a step was removed, confirm that was intended — each one is a scan that no longer runs.');

  for (const block of requiring){
    const first = block.trim().split('\n')[0].trim();
    for (const secret of ['GUARD_MARKER_SET', 'GUARD_FINGERPRINT_KEY']){
      assert.match(block, new RegExp(`${secret}:\\s*\\$\\{\\{\\s*secrets\\.${secret}\\s*\\}\\}`),
        `A CI step sets REQUIRE_MARKERS but does not pass ${secret}.\n` +
        `The env block begins: ${first}\n` +
        'REQUIRE_MARKERS promises the run will scan AND verify. Without the marker\n' +
        'set it cannot scan; without the fingerprint key it cannot verify, and it\n' +
        'will fail closed in CI rather than here.');
    }
  }
});

test('no marker is readable in tracked source', (t) => {
  /* The inverse assertion, and the one that makes the redesign real rather than
     merely tidy. Everything else here asks "did confidential content leak into
     a file that should not have it". This asks whether the GUARD is once again
     publishing what it protects — the defect the previous design shipped with,
     which would come straight back the moment someone finds it convenient to
     paste the list into a constant "just for local testing".

     It is the tracked-tree scan pointed at itself, with no exemption to hide
     behind, so it is nearly free: if any marker were readable in tracked source,
     the test above would already be red. Stated separately because the intent is
     different and a future reader should not have to infer it. */
  const loaded = markerSet();
  if (skipWithoutMarkers(t, loaded)) return;

  for (const rel of ['tests/bundle-confidentiality.test.js', 'scripts/lib/markers.mjs',
                     'scripts/scan-staged.mjs', 'docs/data-policy.md']){
    const text = readFileSync(path.join(REPO, rel), 'utf8');
    assert.deepEqual(scanText(text, loaded.markers), [],
      `${rel} contains a confidential marker.\n` +
      'The guard must not republish what it protects. Marker VALUES belong in\n' +
      'local-data/markers.json or the GUARD_MARKER_SET secret; only patterns\n' +
      'and logic belong in tracked source. See scripts/lib/markers.mjs.');
  }
});
