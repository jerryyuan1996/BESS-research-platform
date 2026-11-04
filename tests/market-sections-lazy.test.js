/* ---------------------------------------------------------------------------
   THE SECTION LOADING CONTRACT, FOR EVERY MARKET THAT USES IT.

   A split that is not asserted is a split that quietly disappears: one
   ordinary-looking `import './sections/home.js'` from a market file puts the
   whole analysis back in the dashboard chunk, the page still renders, every
   other test still passes, and the only symptom is a slower first load.

   This test is the pilot's tests/nem-sections-lazy.test.js generalised by
   market id, as docs/p1-sections-pilot.md §7 asked. It covers the NEM and
   every market the P1-C rollout migrates, from the same assertions:

     1. one module per section id, and the registry fetches exactly those;
     2. nothing in the market imports a section statically;
     3. a section imports neither another section, nor the dataset/sources
        (the engine hands both over), nor the market story — story assets stay
        independently lazy;
     4. loading one section builds no other, and a spec is rebuilt per read;
     5. the facade stays synchronous, and the dashboard wires prepareSections
        and awaits the two sections the research summary reads.

   Browser behaviour — deep links, revisiting, language, staleness — is in
   e2e/market-sections.spec.js; the bytes and the absence of sections from the
   first load are in tests/bundle-budget.test.js.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MARKETS = ['nem', 'gb', 'ie', 'pl', 'ro'];

/** Every specifier in an import statement, including multi-line ones. */
function importsOf(source){
  const out = [];
  for (const statement of source.matchAll(/^import\s[\s\S]*?;/gm))
    for (const quoted of statement[0].matchAll(/['"]([^'"]+)['"]/g)) out.push(quoted[1]);
  return out;
}

const exists = async (file) => stat(file).then(() => true, () => false);
const splitMarkets = [];
for (const id of MARKETS){
  if (await exists(path.join(REPO, 'src/markets', id, 'sections/registry.js'))) splitMarkets.push(id);
}

test('the rollout has at least the pilot and one migrated market', () => {
  assert.ok(splitMarkets.includes('nem'), 'the NEM pilot is missing its loader');
  assert.ok(splitMarkets.length >= 2, `only ${splitMarkets.join(', ')} load sections on demand`);
});

for (const id of MARKETS){
  const dir = path.join(REPO, 'src/markets', id);
  const sectionsDir = path.join(dir, 'sections');
  const isSplit = splitMarkets.includes(id);

  test(`${id}: every section a tab names has a module`, async (t) => {
    if (!isSplit) return t.skip(`${id} is not migrated yet`);
    const { SECTION_IDS } = await import(`../src/markets/${id}/sections.js`);
    const { TABS } = await import(`../src/markets/${id}/tabs.js`);
    const routed = TABS.map(([sectionId]) => sectionId);

    assert.deepEqual(routed.filter(sectionId => !SECTION_IDS.includes(sectionId)), [],
      `${id}: a tab names a section the loader cannot fetch — it would render an empty wrapper`);
    /* Every market in this lineage wrote a peer benchmark section that no tab
       routes. It is kept, not deleted: deleting content is not a loader refactor. */
    assert.deepEqual(SECTION_IDS.filter(sectionId => !routed.includes(sectionId)), ['benchmark'],
      `${id}: the peer benchmark is the one section with no tab, as before the split`);

    const files = (await readdir(sectionsDir)).filter(f => f.endsWith('.js') && !['shared.js', 'registry.js'].includes(f));
    assert.equal(files.length, SECTION_IDS.length, `${id}: a section has no module, or a module has no section`);
    /* A module's filename need not equal its section id: the NEM named `home`
       overview.js and `data` methodology.js when it was split by hand. What
       matters is that the registry's thunks name exactly the files that exist. */
    const registry = await readFile(path.join(sectionsDir, 'registry.js'), 'utf8');
    const modules = [...registry.matchAll(/import\('\.\/([\w-]+)\.js'\)/g)].map(m => `${m[1]}.js`);
    assert.deepEqual([...modules].sort(), [...files].sort(),
      `${id}: the loader names a module that does not exist, or a module no thunk fetches`);
  });

  test(`${id}: no market file imports a section statically`, async (t) => {
    if (!isSplit) return t.skip(`${id} is not migrated yet`);
    const marketFiles = (await readdir(dir)).filter(f => f.endsWith('.js'));
    const offenders = [];
    for (const file of marketFiles){
      const source = await readFile(path.join(dir, file), 'utf8');
      for (const spec of importsOf(source)){
        /* The registry is the loader and is meant to be imported; a section
           module is not. */
        if (/^(\.\/)?sections\/(?!registry\.js)[\w-]+\.js$/.test(spec)) offenders.push(`${file} → ${spec}`);
      }
    }
    assert.deepEqual(offenders, [],
      `${id}: a static import of a section module puts it back in the dashboard chunk`);

    const registry = await readFile(path.join(sectionsDir, 'registry.js'), 'utf8');
    const dynamic = [...registry.matchAll(/import\('\.\/([\w-]+)\.js'\)/g)].map(m => m[1]);
    const { SECTION_IDS } = await import(`../src/markets/${id}/sections.js`);
    assert.equal(dynamic.length, SECTION_IDS.length,
      `${id}: the loader has ${dynamic.length} entries for ${SECTION_IDS.length} sections`);
    assert.equal(new Set(dynamic).size, dynamic.length,
      `${id}: two section ids fetch the same module — one of them would render the wrong section`);
    assert.deepEqual(importsOf(registry).filter(s => s !== './shared.js' && !s.startsWith('./')), [],
      `${id}: the loader imports something from outside the market's sections`);
  });

  test(`${id}: a section imports no other section, no dataset and no story asset`, async (t) => {
    if (!isSplit) return t.skip(`${id} is not migrated yet`);
    const { SECTION_IDS } = await import(`../src/markets/${id}/sections.js`);
    const files = (await readdir(sectionsDir)).filter(f => f.endsWith('.js') && f !== 'registry.js');
    const offenders = [];
    for (const file of files){
      if (file === 'shared.js') continue;
      const source = await readFile(path.join(sectionsDir, file), 'utf8');
      for (const spec of importsOf(source)){
        const name = path.posix.basename(spec);
        /* A section may import its market's own helper modules (gridSection.js,
           economicsP0Section.js, buildPathway.js, the shared design answer) and
           the small sections/shared.js. It may not reach for another section,
           the dataset or source register the engine already holds, the
           dashboard, or anything in the independently lazy-loaded story. */
        if (/^\.\/[\w-]+\.js$/.test(spec) && spec !== './shared.js' && SECTION_IDS.some(s => `${s}.js` === name))
          offenders.push(`${file} → ${spec} (another section)`);
        if (/\b(data|sources|dashboard)\.js$/.test(name)) offenders.push(`${file} → ${spec} (the engine passes this through api)`);
        if (/^(story|storyPack|storyBindings)\.js$/.test(name) || spec.includes('/story/'))
          offenders.push(`${file} → ${spec} (story assets must stay independently lazy)`);
        if (/^\.\.\/\.\.\/[a-z_]+\//.test(spec) && !spec.startsWith('../../_shared/') && !spec.startsWith('../../components/')
            && !/^\.\.\/\.\.\/(gridMapRegistry|congestionRegistry|caseRegistry)\.js$/.test(spec))
          offenders.push(`${file} → ${spec} (another market's module)`);
      }
    }
    assert.deepEqual(offenders, [], `${id}: a section module reached outside its contract`);
  });

  test(`${id}: loading one section builds no other, and specs re-evaluate`, async (t) => {
    if (!isSplit) return t.skip(`${id} is not migrated yet`);
    /* A fresh instance, so the assertion does not depend on what another test
       in this process has already loaded. */
    const registry = await import(`../src/markets/${id}/sections/registry.js?fresh=${id}`);
    const { marketApi } = await import('./helpers/market-sections.mjs');
    const api = await marketApi(id);

    assert.deepEqual(registry.loadedIds(), [], `${id}: nothing is loaded before a route asks for it`);
    await registry.loadSections(api, ['case']);
    assert.deepEqual(registry.loadedIds(), ['case'],
      `${id}: loading one section must not build the others — that is the whole of the split`);

    const spec = registry.sectionSpec('case');
    assert.ok(Array.isArray(spec?.head) && spec.head.length === 2 && typeof spec.head[1] === 'string',
      `${id}: a loaded section still returns its bilingual head`);
    assert.ok(spec.blocks.some(b => b.t === 'investment-case'),
      `${id}: the case section still mounts the shared investment-case block`);

    const first = registry.sectionSpec('case');
    await registry.loadSections(api, ['case']);
    assert.ok(registry.sectionSpec('case') !== first,
      `${id}: the spec is rebuilt on every read, which is what re-evaluates a language change`);
    assert.deepEqual(registry.loadedIds(), ['case'], `${id}: asking twice fetched the module twice`);
  });

  test(`${id}: the facade is synchronous and the dashboard wires the loader`, async (t) => {
    if (!isSplit) return t.skip(`${id} is not migrated yet`);
    const facade = await readFile(path.join(dir, 'sections.js'), 'utf8');
    assert.match(facade, /export function buildSections/, `${id}: the engine still builds its section map from buildSections(api)`);
    assert.doesNotMatch(facade, /\bawait\b/, `${id}: buildSections must not await — callers other than the dashboard read it synchronously`);

    const dashboard = await readFile(path.join(dir, 'dashboard.js'), 'utf8');
    assert.match(dashboard, /prepareSections:/, `${id}: the market must tell the engine how to load a route before it draws`);
    assert.match(dashboard, /export async function researchSummary/, `${id}: the market page summary reads two sections, so it loads them first`);
    assert.match(dashboard, /await loadSections\(engine\.api, \['home', 'story'\]\)/, `${id}: the summariser must fetch home and story`);
    assert.match(dashboard, /return engine\.dashboard\(/, `${id}: dashboard must return the engine's promise so a failed chunk is not swallowed`);
  });
}
