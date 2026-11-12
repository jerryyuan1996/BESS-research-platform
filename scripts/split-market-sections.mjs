#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   CUT ONE MARKET'S SINGLE-FILE sections.js INTO ONE MODULE PER SECTION.

     node scripts/split-market-sections.mjs --market gb
     node scripts/split-market-sections.mjs --market ie --dry

   This is a mechanical extraction, not a rewrite. Every section body is copied
   by LINE RANGE from the original file and re-indented nowhere: the text that
   produced a number or a Chinese sentence before the split is the text that
   produces it afterwards. The pilot did the same by hand for the NEM; doing it
   here by script is what makes four markets one abstraction instead of four
   slightly different refactors.

   What it emits for market <id>:

     sections/<sectionId>.js   the verbatim SEC_B.<id> assignments, inside
                               create(api), returning that section's factory
     sections/shared.js        the prelude's constants and helpers, built from
                               api (never from data.js), via createShared(api)
     sections/registry.js      one thunk per section id; the only place a
                               section module is named
     sections.js               a synchronous facade over the loaded ids
     dashboard.js              prepareSections + an async researchSummary

   WHAT IT DELIBERATELY DOES NOT DO:
     - It does not change a string, a number, an order or a source reference.
     - It does not import data.js, sources.js or another section from a section.
     - It does not touch the market story, which remains independently lazy.
     - It does not delete a section that no tab routes. Some of these files
       assign SEC_B.grid or SEC_B.pipeline twice; the LAST assignment wins, so
       both are kept in that id's module, in order. Deleting dead content is
       not what a loader refactor is for.

   Run scripts/generate-section-fixtures.mjs for the market BEFORE running
   this. tests/market-sections-parity.test.js is what proves the copy is exact.
   --------------------------------------------------------------------------- */
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAst } from 'rollup/parseAst';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const MARKET = option('--market', null);
const DRY = args.includes('--dry');
if (!MARKET){ console.error('usage: node scripts/split-market-sections.mjs --market <id> [--dry]'); process.exit(1); }

const ROOT = path.join(REPO, 'src/markets', MARKET);
const FILE = path.join(ROOT, 'sections.js');
const OUT = path.join(ROOT, 'sections');
const DASHBOARD = path.join(ROOT, 'dashboard.js');
const TABS = path.join(ROOT, 'tabs.js');
const NAME = { gb:'Great Britain', ie:'Ireland', pl:'Poland', ro:'Romania', jp:'Japan' }[MARKET] || MARKET;

/** A word-boundary test that works for one-letter helpers such as `O`. */
const hasWord = (text, word) => new RegExp(`\\b${word.replace(/[$]/g, '\\$')}\\b`).test(text);
const stripComments = (text) => text
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/^\s*\/\/.*$/gm, ' ');

async function main(){
  const source = await readFile(FILE, 'utf8');
  const lines = source.split('\n');
  const registryFile = path.join(OUT, 'registry.js');
  if (await stat(registryFile).then(() => true, () => false))
    throw new Error(`${MARKET}: sections/registry.js already exists — this market is split`);

  /* ---- locate the pieces ------------------------------------------------ */
  const exportIdx = lines.findIndex(l => /^export function buildSections\(api\)\s*\{/.test(l));
  if (exportIdx < 0) throw new Error('no `export function buildSections(api){` — not the single-file shape');

  const destructureStart = lines.findIndex((l, i) => i > exportIdx && /^\s*const\s*\{/.test(l));
  let destructureEnd = destructureStart;
  while (destructureEnd < lines.length && !/= api\s*;/.test(lines[destructureEnd])) destructureEnd++;
  if (destructureStart < 0 || destructureEnd >= lines.length) throw new Error('cannot find the api destructure');
  const destructureText = lines.slice(destructureStart, destructureEnd + 1).join('\n');

  const assignRe = /^\s*SEC_B\.([A-Za-z_$][\w$]*)\s*=/;
  const firstAssign = lines.findIndex((l, i) => i > destructureEnd && assignRe.test(l));
  const returnIdx = lines.findIndex((l, i) => i > firstAssign && /^\s*return SECTIONS\s*;?\s*$/.test(l));
  if (firstAssign < 0 || returnIdx < 0) throw new Error('cannot find the SEC_B assignments or `return SECTIONS;`');

  const starts = [];
  for (let i = firstAssign; i < returnIdx; i++) if (assignRe.test(lines[i])) starts.push({ i, id: assignRe.exec(lines[i])[1] });
  if (!starts.length) throw new Error('no sections');

  const blocks = new Map();
  for (let k = 0; k < starts.length; k++){
    const { i, id } = starts[k];
    const end = k + 1 < starts.length ? starts[k + 1].i : returnIdx;
    const text = lines.slice(i, end).join('\n');
    if (!blocks.has(id)) blocks.set(id, []);
    blocks.get(id).push(text);
  }

  let preludeText = lines.slice(destructureEnd + 1, firstAssign).join('\n');
  /* Lexical scope, not indentation: Japan indents its outer helpers and puts
     casePerRegion between sections. Move only declarations directly inside
     buildSections; never capture a nested helper's local variable. */
  const factory = parseAst(source).body.find(node =>
    node.type === 'ExportNamedDeclaration' && node.declaration?.id?.name === 'buildSections').declaration;
  const firstOffset = lines.slice(0, firstAssign).join('\n').length;
  const declarations = factory.body.body.filter(node =>
    ['VariableDeclaration', 'FunctionDeclaration'].includes(node.type));
  const lateHelpers = declarations.filter(node => node.start > firstOffset);
  for (const helper of lateHelpers){
    const text = source.slice(helper.start, helper.end);
    preludeText += '\n' + text;
    for (const [id, parts] of blocks) blocks.set(id, parts.map(body => body.replace(text, '')));
  }
  const preludeNames = declarations.flatMap(node => node.type === 'VariableDeclaration'
    ? node.declarations.filter(decl => decl.id.type === 'Identifier').map(decl => decl.id.name)
    : [node.id.name]).filter(name => name !== 'SEC_B' && name !== 'SECTIONS');

  /* ---- the header's imports, kept only by the modules that name them ---- */
  const imports = [];
  for (const line of lines.slice(0, exportIdx)){
    if (!/^import\s/.test(line)) continue;
    const named = /^import\s+(.+?)\s+from\s+['"]([^'"]+)['"]\s*;?\s*$/.exec(line);
    const bare = /^import\s+['"]([^'"]+)['"]\s*;?\s*$/.exec(line);
    if (bare){ imports.push({ line, names: [], specifier: bare[1] }); continue; }
    if (!named) throw new Error(`unparsed import: ${line}`);
    const names = named[1].replace(/[{}]/g, ' ').split(',')
      .map(s => { const p = s.trim().split(/\s+as\s+/); return (p[1] || p[0]).trim(); })
      .filter(Boolean);
    imports.push({ line, names, specifier: named[2] });
  }
  /* The original imports were written for src/markets/<id>/sections.js. The
     generated modules live one level down, in sections/, so every relative
     specifier gains one `..`. Normalising keeps `../_shared/x.js` readable
     instead of producing `.././../_shared/x.js`. */
  const rebase = (line) => line.replace(/(['"])(\.[^'"]+)(['"])/g,
    (_all, open, spec, close) => open + path.posix.normalize('../' + spec) + close);
  const importsFor = (bodyText) => imports
    .filter(imp => imp.names.length === 0 || imp.names.some(n => hasWord(stripComments(bodyText), n)))
    .map(imp => rebase(imp.line));

  /* ---- section order: the tab strip first, then anything unrouted -------- */
  const tabsSource = await readFile(TABS, 'utf8');
  const tabIds = [...tabsSource.matchAll(/\[\s*'([A-Za-z_$][\w$]*)'\s*,/g)].map(m => m[1]);
  const ids = [...tabIds.filter(id => blocks.has(id)), ...[...blocks.keys()].filter(id => !tabIds.includes(id))];
  const missing = [...blocks.keys()].filter(id => !ids.includes(id));
  if (missing.length) throw new Error(`section ids missing from the registry: ${missing.join(', ')}`);

  if (!DRY) await mkdir(OUT, { recursive: true });
  const written = [];
  const put = async (rel, content) => {
    written.push(rel);
    if (!DRY) await writeFile(path.join(REPO, rel), content, 'utf8');
  };

  /* ---- shared.js --------------------------------------------------------- */
  const sharedComment = `/* ---------------------------------------------------------------------------
   ${NAME} — the constants and helpers every section reads.

   Lifted verbatim from the prelude of the single-file sections.js. BUILT FROM
   \`api\`, NOT IMPORTED: \`O\` is \`M.official\` and \`M\` is the market dataset,
   which the engine already holds. Importing data.js here would put 20+ kB into
   every section chunk, or hoist it into a chunk the landing tab also pays for.

   \`SEC_B\` and \`SECTIONS()\` are kept in the copied text because they are part
   of the prelude, but they are unused here: the facade owns the section map,
   and each section module owns its own local \`SEC_B\`.
   --------------------------------------------------------------------------- */`;
  const sharedBody = [
    sharedComment,
    ...importsFor(preludeText),
    '',
    '/**',
    ' * @param {object} api  supplied by src/markets/_shared/engine.js',
    ` * @returns {object} ${preludeNames.join(', ')}`,
    ' */',
    'export function createShared(api){',
    destructureText,
    preludeText,
    `  return { ${preludeNames.join(', ')} };`,
    '}',
    '',
  ].join('\n');
  await put(`src/markets/${MARKET}/sections/shared.js`, sharedBody);

  /* ---- one module per section -------------------------------------------- */
  for (const id of ids){
    const body = blocks.get(id).join('\n');
    const usedShared = preludeNames.filter(n => hasWord(stripComments(body), n));
    const sectionImports = importsFor(body);
    if (usedShared.length) sectionImports.push("import { createShared } from './shared.js';");
    const moduleText = [
      `/* ${NAME} — the \`${id}\` section.`,
      `   Cut by line range from the single-file sections.js; the body below is verbatim.`,
      `   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */`,
      ...sectionImports,
      '',
      '/** @param {object} api  supplied by src/markets/_shared/engine.js */',
      'export function create(api){',
      destructureText,
      ...(usedShared.length ? [`  const { ${usedShared.join(', ')} } = createShared(api);`] : []),
      '  const SEC_B = {};',
      '',
      body,
      '',
      `  return SEC_B.${id};`,
      '}',
      '',
    ].join('\n');
    await put(`src/markets/${MARKET}/sections/${id}.js`, moduleText);
  }

  /* ---- registry.js: literal thunks, nothing imported statically ---------- */
  const width = Math.max(...ids.map(id => id.length));
  const loaders = ids.map(id => `  ${(id + ':').padEnd(width + 1)} () => import('./${id}.js'),`).join('\n');
  const registryText = `/* ---------------------------------------------------------------------------
   ${NAME.toUpperCase()} SECTIONS, FETCHED ONE AT A TIME.

   One entry per section id, every value a thunk around a LITERAL specifier.
   That is the only shape Vite can analyse into one chunk per section; an object
   of imported modules would read the same here and ship every section to a
   reader who opened the brief.

   NOTHING IN THIS FILE IMPORTS A SECTION. The only edges are these thunks.
   The market's dashboard chunk reaches section code only through loadSections.

   This registry is generated by scripts/split-market-sections.mjs and has the
   same shape for every market in the rollout. The LOADERS map below is the
   market-specific data; everything below it is the shared loading contract.
   --------------------------------------------------------------------------- */

/** Section id → the module that builds it. Order is tabs.js, then unrouted ids. */
const LOADERS = {
${loaders}
};

/** id → the section's factory, created once the module has arrived. */
const FACTORIES = new Map();

/** Every section id this market can draw, loaded or not. */
export const SECTION_IDS = Object.keys(LOADERS);

export const isLoaded = (id) => FACTORIES.has(id);

export const loadedIds = () => [...FACTORIES.keys()];

/** The spec for a loaded section. Re-evaluated on every read, as SEC_B was. */
export const sectionSpec = (id) => FACTORIES.get(id)();

/**
 * Fetch and build the sections named, skipping the ones already here.
 * Resolves when every requested section can be drawn; rejects if a chunk 404s.
 * The engine decides what a reader sees in that gap — loading, failure and
 * stale-render states all live in markets/_shared/engine.js.
 */
export async function loadSections(api, ids){
  const wanted = [...new Set(ids)].filter(id => LOADERS[id] && !FACTORIES.has(id));
  await Promise.all(wanted.map(async (id) => {
    const module = await LOADERS[id]();
    /* Two ids could share one module later; this keeps that from building the
       same section twice if they resolve together. */
    if (!FACTORIES.has(id)) FACTORIES.set(id, module.create(api));
  }));
}

/** Every section, loaded. The engine never calls this; it is the test seam. */
export const loadAllSections = (api) => loadSections(api, SECTION_IDS);
`;
  await put(`src/markets/${MARKET}/sections/registry.js`, registryText);

  /* ---- the synchronous facade -------------------------------------------- */
  const facadeText = `/* ---------------------------------------------------------------------------
   ${NAME} — the section contract the engine reads.

   The content lives in src/markets/${MARKET}/sections/, one module per domain.
   This file is what the shared engine sees, and it is deliberately small.

   IT IS STILL SYNCHRONOUS. \`buildSections(api)\` returns \`SECTIONS()\`, whose
   entries are getters that re-evaluate the spec, so every string re-evaluates
   when the language changes. What changed is the set of entries: the map holds
   only the sections loaded for the route being drawn.

   THE ASYNC HALF IS ELSEWHERE. \`loadSections(api, ids)\` fetches a section, and
   the engine calls it through \`prepareSections\` — the async boundary in
   markets/_shared/engine.js. A synchronous caller (a test, the Investment
   Case's research summary) still gets an object it can read.

   See docs/p1-sections-rollout.md for the contract and the measurements.
   --------------------------------------------------------------------------- */
import {
  SECTION_IDS, loadSections, loadAllSections, isLoaded, sectionSpec,
} from './sections/registry.js';

/**
 * @param {object} _api  accepted for the shared engine's signature and not
 *   used here: each section module is handed the api by \`loadSections\`.
 * @returns {() => object} SECTIONS(), the map the engine draws from
 */
export function buildSections(_api){
  return function SECTIONS(){
    const o = {};
    for (const id of SECTION_IDS){
      if (!isLoaded(id)) continue;
      Object.defineProperty(o, id, { get: () => sectionSpec(id), enumerable: true });
    }
    return o;
  };
}

export { SECTION_IDS, loadSections, loadAllSections };
`;
  await put(`src/markets/${MARKET}/sections.js`, facadeText);

  /* ---- dashboard: the one cfg key and the async summariser --------------- */
  let dash = await readFile(DASHBOARD, 'utf8');
  const before = dash;
  dash = dash.replace("import { buildSections } from './sections.js';",
    "import { buildSections, loadSections } from './sections.js';");
  dash = dash.replace(/const engine = createMarketEngine\(\{([\s\S]*?)\n\}\);/, (whole, inner) => {
    if (/prepareSections/.test(inner)) return whole;
    return `const engine = createMarketEngine({${inner}\n  prepareSections: (api, ids) => loadSections(api, ids),\n});`;
  });
  dash = dash.replace(
    /export function researchSummary\(container, route\) \{\n  engine\.researchSummary\(container, route, markets\);\n\}/,
    `/* The house view and the one-minute orientation are sections now, so they
   must be fetched before the summary reads them. A failure leaves the summary
   short rather than breaking the dialog. */
export async function researchSummary(container, route) {
  await loadSections(engine.api, ['home', 'story']).catch(() => {});
  engine.researchSummary(container, route, markets);
}`);
  dash = dash.replace(/  engine\.dashboard\(container, route, markets\);/, '  return engine.dashboard(container, route, markets);');
  if (dash === before) throw new Error('dashboard.js did not change — check its shape');
  if (!/prepareSections:/.test(dash) || !/export async function researchSummary/.test(dash))
    throw new Error('dashboard.js wiring incomplete');
  await put(`src/markets/${MARKET}/dashboard.js`, dash);

  console.log(`${DRY ? '[dry] ' : ''}${MARKET}: ${ids.length} sections → ${ids.join(', ')}`);
  console.log(`  prelude helpers: ${preludeNames.join(', ') || '(none)'}`);
  console.log(`  files: ${written.length}`);
  for (const rel of written) console.log(`    ${rel}`);
}

main().catch(err => { console.error(`split failed: ${err.message}`); process.exit(1); });
