/* ---------------------------------------------------------------------------
   BUNDLE CONFIDENTIALITY.

   Scans a built artefact for markers that must never be published, and fails if
   it finds one. Which artefact is SCAN_DIR's business — see below.

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
import { existsSync } from 'node:fs';
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

  /* Source maps are included. vite.config.js sets sourcemap:true, which
     publishes readable source, so they are scanned exactly like the code — a
     marker reachable through a .map is as published as one in the bundle. */
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
