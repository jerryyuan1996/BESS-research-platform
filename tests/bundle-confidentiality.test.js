/* ---------------------------------------------------------------------------
   BUNDLE CONFIDENTIALITY.

   Scans a built dist/ for markers that must never be published, and fails if it
   finds one.

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

   Skips with a clear message when dist/ is absent — `npm test` must not require
   a build. CI runs the build first, so it is enforced there.
   --------------------------------------------------------------------------- */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(REPO, 'dist');

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
  '[REDACTED-PROJECT]',
  '[REDACTED-SITE]',
  '[REDACTED-SITE]',

  // Confidential third-party report and the sites in it
  '[REDACTED-ADVISER]',
  '[REDACTED-REPORT]',
  '[REDACTED-SITE]',
  '[REDACTED-SITE]',
  '[REDACTED-SITE]',

  // Project technical specification
  '[REDACTED-SPEC]',

  // Financial-model figures and document names
  '[REDACTED-FIGURE]',
  '[REDACTED-FIGURE]',
  '[REDACTED-FIGURE]',
  '[REDACTED-DOCUMENT]',
  '[REDACTED-DOCUMENT]',
  '[REDACTED-DOCUMENT]',

  // Links to the confidential document store
  '[REDACTED-LINK]',
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
  if (!existsSync(DIST)){
    t.skip('dist/ not present — run "npm run build" first (CI always does)');
    return;
  }

  /* Source maps are included. vite.config.js sets sourcemap:true, which
     publishes readable source, so they are scanned exactly like the code — a
     marker reachable through a .map is as published as one in the bundle. */
  const files = (await walk(DIST)).filter(f => /\.(js|css|html|map|json)$/.test(f));
  assert.ok(files.length > 0, 'dist/ contains no scannable files');

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

test('the confidential local-data directory is never copied into dist', async (t) => {
  if (!existsSync(DIST)){
    t.skip('dist/ not present');
    return;
  }
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
