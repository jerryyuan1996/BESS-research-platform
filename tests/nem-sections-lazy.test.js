/* ---------------------------------------------------------------------------
   THE NEM'S SECTIONS ARE ACTUALLY SPLIT — AND STILL EVERY ONE OF THEM IS HERE.

   Two properties, and neither is visible from a passing page:

     1. NOTHING IN THE MARKET'S OWN FILES IMPORTS A SECTION. A single static
        import of sections/overview.js from sections.js would put all 199 kB
        back into the dashboard chunk. The page would render identically, every
        other test would pass, and the only symptom would be the bundle this
        pilot existed to shrink. The scan below is the assertion.

     2. A SECTION MODULE IMPORTS NOTHING BUT SHARED HELPERS. No section imports
        another section (a cycle, and the reason a "split" can quietly become
        one file again), no section imports the market dataset or the source
        register (the engine hands both over, and a section that imported them
        would drag data.js into every chunk or duplicate it), and no section
        reaches into the dashboard.

   The loading itself — that a route fetches only what it draws, and that a
   stale resolve does not draw over a new route — is in tests/bundle-budget.test.js
   for the bytes and e2e/nem-sections.spec.js for the browser.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(REPO, 'src/markets/nem');
const SECTIONS = path.join(DIR, 'sections');

/** Every `import … from 'x'` and every bare `import 'x'` in a module.
 *  The lookahead stops a multi-line import from swallowing the next one. */
function importsOf(source){
  const specifiers = [];
  for (const m of source.matchAll(/^import\s+(?:[^;'"]*?\bfrom\s+)?['"]([^'"]+)['"]/gm)) specifiers.push(m[1]);
  for (const m of source.matchAll(/^import\s+['"]([^'"]+)['"]/gm)) specifiers.push(m[1]);
  return specifiers;
}

test('every section a tab names has a module, and every module a tab could name', async () => {
  const { SECTION_IDS } = await import('../src/markets/nem/sections.js');
  const { TABS } = await import('../src/markets/nem/tabs.js');

  const routed = TABS.map(([id]) => id);
  assert.deepEqual(SECTION_IDS.filter(id => !routed.includes(id)), ['benchmark'],
    'the peer benchmark is the one section with no tab — as it was before the split');
  assert.deepEqual(routed.filter(id => !SECTION_IDS.includes(id)), [],
    'a tab names a section the loader cannot fetch: the tab would render an empty wrapper');

  /* One module per id, and the id's module is what the registry fetches. */
  const files = (await readdir(SECTIONS)).filter(f => f.endsWith('.js') && f !== 'shared.js' && f !== 'registry.js');
  assert.equal(files.length, SECTION_IDS.length, 'a section has no module, or a module has no section');
});

test('no market file imports a section statically', async () => {
  const marketFiles = (await readdir(DIR)).filter(f => f.endsWith('.js'));
  const offenders = [];
  for (const file of marketFiles){
    const source = await readFile(path.join(DIR, file), 'utf8');
    for (const spec of importsOf(source)){
      /* The registry is the loader and is meant to be imported; a section
         module is not. */
      if (/^(\.\/)?sections\/(?!registry\.js)[\w-]+\.js$/.test(spec)) offenders.push(`${file} → ${spec}`);
    }
  }
  assert.deepEqual(offenders, [],
    'a static import of a section module puts it back in the dashboard chunk. ' +
    'The loader is src/markets/nem/sections/registry.js and its entries are dynamic imports.');

  /* The registry is the only place a section may be named, and only through a
     thunk: `import('./x.js')` inside a function. */
  const registry = await readFile(path.join(SECTIONS, 'registry.js'), 'utf8');
  const dynamic = [...registry.matchAll(/import\('\.\/([\w-]+)\.js'\)/g)].map(m => m[1]);
  assert.equal(dynamic.length, 13, 'the loader has lost an entry');
  assert.deepEqual(importsOf(registry).filter(s => s !== './shared.js' && !s.startsWith('./')), [],
    'the loader imports something from outside the market');
});

test('a section module imports shared helpers and nothing else', async () => {
  /* What a section may reach for: the constants module, and — for the two that
     draw the map — the two registries it is joined through and the side-effect
     import that registers it. Nothing else, in particular not data.js, not
     sources.js, not another section and not the dashboard. */
  const ALLOWED = new Set([
    './shared.js',
    '../gridMapData.js',
    '../../gridMapRegistry.js',
    '../../congestionRegistry.js',
  ]);
  const files = (await readdir(SECTIONS)).filter(f => f.endsWith('.js') && f !== 'registry.js');
  const offenders = [];
  for (const file of files){
    if (file === 'shared.js') continue;
    const source = await readFile(path.join(SECTIONS, file), 'utf8');
    for (const spec of importsOf(source)){
      if (!ALLOWED.has(spec)) offenders.push(`${file} → ${spec}`);
    }
  }
  assert.deepEqual(offenders, [],
    'a section may not depend on another section (a cycle), on the market dataset ' +
    'or sources (the engine passes both through api), or on the dashboard');
});

test('only loaded sections are in the map the engine reads', async () => {
  /* A fresh instance, so the assertion does not depend on what another test in
     this process has already loaded. */
  const registry = await import('../src/markets/nem/sections/registry.js?fresh=1');

  assert.deepEqual(registry.loadedIds(), [], 'nothing is loaded before a route asks for it');

  await registry.loadSections({}, ['case']);
  assert.deepEqual(registry.loadedIds(), ['case'],
    'loading one section must not build the others: that is the whole of the split');

  const spec = registry.sectionSpec('case');
  assert.ok(Array.isArray(spec?.head) && spec.head.length === 2 && typeof spec.head[1] === 'string',
    'a loaded section still returns its bilingual head');
  assert.ok(spec.blocks.some(b => b.t === 'investment-case'),
    'the case section still mounts the shared investment-case block');

  /* And asking again is free — no second module evaluation, no reset. */
  const first = registry.sectionSpec('case');
  await registry.loadSections({}, ['case']);
  assert.ok(registry.sectionSpec('case') !== first,
    'the spec is rebuilt on every read, which is what re-evaluates a language change');
});

test('the facade is synchronous, and says so', async () => {
  const facade = await readFile(path.join(DIR, 'sections.js'), 'utf8');
  assert.match(facade, /export function buildSections/,
    'the engine still builds its section map from buildSections(api)');
  assert.doesNotMatch(facade, /\bawait\b/,
    'buildSections must not await: callers other than the dashboard read it synchronously');
  /* The summariser the market page uses is the one async caller, and it is
     explicit about it. */
  const dashboard = await readFile(path.join(DIR, 'dashboard.js'), 'utf8');
  assert.match(dashboard, /prepareSections:/,
    'the market must tell the engine how to load a route before it draws');
  assert.match(dashboard, /export async function researchSummary/,
    'the market page summary reads two sections, so it loads them first');
});
