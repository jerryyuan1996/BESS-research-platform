#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   WHAT A FIRST VISIT TO A MARKET DASHBOARD ACTUALLY DOWNLOADS.

     node scripts/perf/measure-market-sections.mjs --dist dist --markets gb,ie,pl,ro
     node scripts/perf/measure-market-sections.mjs --dist tmp/p1c-before-dist \
          --out perf/p1c-sections-before.json

   This reads the built output, not the source. The numbers are gzip bytes,
   computed the same way as tests/bundle-budget.test.js (gzipSync default level,
   1 KiB = 1024 bytes), so a figure here and a figure in that test mean the same
   thing.

   "first load" is the STATIC graph: the market chunk plus everything it imports
   without a dynamic boundary. The entry chunk is counted separately, because a
   deep link to /markets/<slug>/<tab> loads the entry first and the market's
   static graph second. Sections reached through import() are NOT in either:
   they are fetched when a reader opens the tab that draws them, and are
   reported as section chunks instead.

   A diagnostic only. It is never imported by the site and writes nothing into
   the published build.
   --------------------------------------------------------------------------- */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const DIST = option('--dist', 'dist');
const MARKETS = (option('--markets', 'gb,ie,pl,ro,nem') || '').split(',').map(s => s.trim()).filter(Boolean);
const OUT = option('--out', null);
/* Prints every chunk in one market's static graph, largest first. This is the
   C4 view: what is still eagerly imported after the split, and what a reader
   pays before a single section can be read. */
const CLOSURE_MARKET = option('--closure', null);

const kB = (bytes) => +(bytes / 1024).toFixed(2);

async function chunks(){
  const dir = path.join(DIST, 'assets');
  const files = (await readdir(dir)).filter(f => f.endsWith('.js'));
  const html = await readFile(path.join(DIST, 'index.html'), 'utf8');
  const entryName = /<script[^>]+src="\/assets\/([^"]+\.js)"/.exec(html)?.[1] ?? null;

  const byName = new Map();
  const markets = new Map();
  for (const name of files){
    const buf = await readFile(path.join(dir, name));
    const text = buf.toString('utf8');
    const imports = new Set(
      [...text.matchAll(/(?:^|[;}\n])import(?:\s*\{[^}]*\}\s*from|\s*[\w$]+\s*from|)\s*"\.\/([^"]+\.js)"/g)].map(m => m[1]));
    const dynamics = new Set(
      [...text.matchAll(/import\("\.\/([^"]+\.js)"\)/g)].map(m => m[1]));
    const chunk = { name, raw: buf.length, gzip: gzipSync(buf).length, imports, dynamics, text };
    byName.set(name, chunk);
    const market = /^market-(.+?)-[A-Za-z0-9_-]{8}\.js$/.exec(name);
    if (market) markets.set(market[1], chunk);
  }
  return { byName, markets, entry: byName.get(entryName) || null, entryName };
}

function closure(chunk, byName, seen = new Set()){
  if (!chunk || seen.has(chunk)) return seen;
  seen.add(chunk);
  for (const name of chunk.imports) closure(byName.get(name), byName, seen);
  return seen;
}

const sumGzip = (set) => [...set].reduce((n, c) => n + c.gzip, 0);

function measure(graph, id){
  const { byName, markets, entry } = graph;
  const market = markets.get(id);
  if (!market) return { id, error: 'no market chunk in this build' };

  const marketClosure = closure(market, byName);
  const entryClosure = closure(entry, byName);
  const firstVisit = new Set([...marketClosure, ...entryClosure]);

  const sectionPrefix = `section-${id}-`;
  const sections = [...byName.values()].filter(c => c.name.startsWith(sectionPrefix));
  const sectionTotal = sections.reduce((n, c) => n + c.gzip, 0);
  const largest = sections.slice().sort((a, b) => b.gzip - a.gzip)[0];
  const dynamicSectionNames = [...market.dynamics].filter(n => n.startsWith(sectionPrefix));

  /* A market story that is independently lazy-loaded must not end up in the
     first load when sections are split. Report the chunk names, not a boolean
     alone, so a regression says which payload drifted. */
  const storyInFirstLoad = [...firstVisit].filter(c => c.name.startsWith(`story-${id}-`)).map(c => c.name);
  const sectionsInFirstLoad = [...marketClosure].filter(c => c.name.startsWith(sectionPrefix)).map(c => c.name);
  const eagerGridMap = [...marketClosure].filter(c => /grid-map-data/.test(c.name)).map(c => c.name);

  return {
    id,
    marketChunk: { name: market.name, kB: kB(market.gzip), rawKB: kB(market.raw) },
    marketStaticClosureKB: kB(sumGzip(marketClosure)),
    entryChunkKB: kB(entry?.gzip ?? 0),
    firstVisitJSKB: kB(sumGzip(firstVisit)),
    staticChunkCount: marketClosure.size,
    sectionChunks: {
      count: sections.length,
      totalKB: kB(sectionTotal),
      largestKB: largest ? kB(largest.gzip) : 0,
      largestName: largest?.name ?? null,
      dynamicFromMarketChunk: dynamicSectionNames.length,
      inFirstLoad: sectionsInFirstLoad,
    },
    storyChunksInFirstLoad: storyInFirstLoad,
    eagerGridMapChunks: eagerGridMap,
  };
}

async function main(){
  const graph = await chunks();
  const report = {
    dist: DIST,
    markets: Object.fromEntries(MARKETS.map(id => [id, measure(graph, id)])),
    globals: {
      entryChunkKB: kB(graph.entry?.gzip ?? 0),
      entryStaticClosureKB: kB(sumGzip(closure(graph.entry, graph.byName))),
      allMarketChunksKB: kB([...graph.markets.values()].reduce((n, c) => n + c.gzip, 0)),
      chunkCount: graph.byName.size,
    },
  };

  console.log(`\n${DIST}  (gzip KiB, static import graph)\n`);
  console.log('market   chunk    static closure   first visit   sections (n / total / largest)   in first load');
  for (const [id, m] of Object.entries(report.markets)){
    if (m.error){ console.log(`${id.padEnd(8)} ${m.error}`); continue; }
    const s = m.sectionChunks;
    console.log(
      id.padEnd(8),
      String(m.marketChunk.kB).padStart(7),
      String(m.marketStaticClosureKB).padStart(16),
      String(m.firstVisitJSKB).padStart(13),
      `${String(s.count).padStart(14)} / ${String(s.totalKB).padStart(6)} / ${String(s.largestKB).padStart(7)}`,
      `   ${s.inFirstLoad.length}`);
  }
  console.log(`\nentry ${report.globals.entryChunkKB} kB, all market chunks ${report.globals.allMarketChunksKB} kB, ${report.globals.chunkCount} JS chunks.`);
  for (const [id, m] of Object.entries(report.markets)){
    if (m.error) continue;
    if (m.storyChunksInFirstLoad.length) console.log(`  WARNING ${id}: story chunk in first load → ${m.storyChunksInFirstLoad.join(', ')}`);
    if (m.sectionChunks.inFirstLoad.length) console.log(`  WARNING ${id}: section chunk in first load → ${m.sectionChunks.inFirstLoad.join(', ')}`);
  }
  if (CLOSURE_MARKET){
    const market = graph.markets.get(CLOSURE_MARKET);
    if (!market) throw new Error(`no market chunk for ${CLOSURE_MARKET}`);
    const members = [...closure(market, graph.byName)].sort((a, b) => b.gzip - a.gzip);
    console.log(`\n${CLOSURE_MARKET} static graph (${members.length} chunks, ${kB(sumGzip(new Set(members)))} KiB gzip):`);
    for (const c of members) console.log(`  ${String(kB(c.gzip)).padStart(8)} KiB  ${c.name}`);
  }
  if (OUT){
    await writeFile(OUT, JSON.stringify(report, null, 2) + '\n');
    console.log(`\nwrote ${OUT}`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
