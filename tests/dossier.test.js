/* ---------------------------------------------------------------------------
   PROJECT DOSSIERS — the public half.

   Every dossier is confidential in its entirety and none live in this
   repository. So what these tests can check is not the content but the SHELL:
   that it is complete with nothing present, that it cannot become an oracle,
   and that no path exists by which a dossier could reach a build.

   This suite runs under plain Node, where the local-data plugin does not exist —
   which is exactly the state a production build is in. If these pass here, the
   published site behaves the same way.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

import {
  DOSSIER_TABS, validateDossier, hasDossiers, allDossiers,
  dossierBySlug, dossiersForMarket, dossierPath,
} from '../src/projects/dossier/registry.js';
import { DOSSIERS, AVAILABLE } from '../src/local/dossiers.js';
import { parseRoute } from '../src/app/router.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('the public stub is empty, and that is the production state', () => {
  /* Under Node the plugin has not run, so this is what a build sees. If this
     ever returns a dossier, the confidential layer has reached the public tree. */
  assert.deepEqual(DOSSIERS, []);
  assert.equal(AVAILABLE, false);
  assert.equal(hasDossiers(), false);
  assert.deepEqual(allDossiers(), []);
});

test('every slug resolves to nothing, including plausible ones', () => {
  /* The oracle test. A "withheld" page rendered only for REAL slugs would
     confirm which deal codenames exist to anyone who guessed one, so the
     registry must answer identically for every input. */
  for (const slug of ['', 'anything', 'a-real-looking-codename', '../etc/passwd', 'wa']){
    assert.equal(dossierBySlug(slug), null, `${slug}: resolved to something`);
  }
  for (const marketId of ['wa', 'fi', 'gb', 'nope']){
    assert.deepEqual(dossiersForMarket(marketId), []);
  }
});

test('the route parses but the page will not find anything', () => {
  /* The route exists so a link from a development build is not a dead URL
     shape; resolution is what refuses. Both halves matter: a router that did
     not know the shape would 404 differently for /projects/x and /projects/x/y,
     which is itself a signal. */
  const bare = parseRoute('/projects/some-codename');
  assert.equal(bare.name, 'dossier');
  assert.equal(bare.slug, 'some-codename');
  assert.equal(bare.tab, null);

  const deep = parseRoute('/projects/some-codename/model');
  assert.equal(deep.name, 'dossier');
  assert.equal(deep.tab, 'model');

  /* Same answer for both, in this build. */
  assert.equal(dossierBySlug(bare.slug), null);
  assert.equal(dossierBySlug(deep.slug), null);

  // /projects alone is not a dossier route and must not become a listing.
  assert.equal(parseRoute('/projects').name, 'notFound');
});

test('the shape validator rejects what the shell cannot render', () => {
  const ok = {
    slug: 'a-project', name: ['A', '甲'], marketId: 'wa',
    sections: { overview: { blocks: [] } },
  };
  assert.deepEqual(validateDossier(ok), []);

  assert.ok(validateDossier({ ...ok, slug: 'Not A Slug' }).length,
    'a slug with spaces would break the URL it becomes');
  assert.ok(validateDossier({ ...ok, name: 'string' }).length,
    'name must be a bilingual pair like every other label here');
  assert.ok(validateDossier({ ...ok, sections: { nope: {} } }).length,
    'an unknown section id would render as a missing tab');
  assert.ok(validateDossier({ ...ok, sections: { transaction: {} } }).length,
    'overview is the landing tab and cannot be absent');
  assert.ok(validateDossier(null).length);
});

test('the dossier tab vocabulary is fixed and complete', () => {
  const ids = DOSSIER_TABS.map(([id]) => id);
  assert.equal(ids.length, new Set(ids).size, 'tab ids must be unique');
  assert.ok(ids.includes('overview'), 'overview is the landing tab');
  for (const [, label] of DOSSIER_TABS){
    assert.ok(Array.isArray(label) && label.length === 2, 'every tab needs an [en, zh] label');
  }

  /* A transcribed model is not one tab's worth of material: the outputs, the
     sensitivity grids and the annual roll-up are separate reading surfaces, and
     a section id the vocabulary does not know is DROPPED rather than shown.
     That failure is silent by design, so the vocabulary is asserted here. */
  for (const id of ['model', 'sensitivity', 'annual']){
    assert.ok(ids.includes(id), `${id} must be a known section id`);
  }
});

test('a dossier may carry the full analysis without tripping validation', () => {
  /* The real dossiers are git-ignored, so what can be checked here is that the
     shell accepts the SHAPE they use. Without this, adding a section to a local
     dossier would fail only on the author's machine, at console.warn volume. */
  const analysis = {
    slug: 'shape-check', marketId: 'fi', name: ['N', 'N'],
    sections: {
      overview: { blocks: [] }, model: { blocks: [] },
      sensitivity: { blocks: [] }, annual: { blocks: [] },
    },
  };
  assert.deepEqual(validateDossier(analysis), []);
});

test('dossierPath builds the route the router parses', () => {
  const p = dossierPath({ slug: 'x-1' });
  assert.equal(p, '/projects/x-1');
  assert.equal(parseRoute(p).slug, 'x-1');
});

test('no tracked file imports a confidential dossier module', () => {
  /* The structural guarantee. src/local/dossiers.js is a real, empty module and
     the ONLY door; anything importing local-data/ directly would bypass the
     plugin's build-time substitution and put a dossier in the bundle.

     Checked against the tracked tree rather than a directory walk, for the same
     reason the confidentiality guard is: tracked is the boundary that matters. */
  const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: REPO, maxBuffer: 1 << 28 })
    .toString().split('\0').filter(Boolean)
    .filter(f => f.startsWith('src/') && f.endsWith('.js'));

  assert.ok(tracked.length > 50, 'that is not this repository');

  for (const rel of tracked){
    const text = readFileSync(path.join(REPO, rel), 'utf8');
    assert.ok(!/from\s+['"][^'"]*local-data\//.test(text),
      `${rel} imports from local-data/ directly — the only door is src/local/, ` +
      'and bypassing it would put confidential content in the bundle');
  }
});
