#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   PERFORMANCE BASELINE.

   Three measurements, one file, no service:

     bundle    what the build actually emits — every chunk's raw and gzipped
               size, the entry's static closure, each market's visit cost and
               the largest static JSON. Pure filesystem work; runs in a second.
     build     wall-clock time for `vite build`, measured around the child
               process rather than read from Vite's own "built in" line.
     browser   cold and warm navigations of five representative routes, using
               the browser's own Performance API through Playwright.

   This is a DIAGNOSTIC. It runs at the analyst's desk or in CI, writes a JSON
   file, and changes nothing. It is not imported by the site, adds no request
   to a production page, and reads no credential: only file names, sizes and
   timings reach the output.

   Usage
     node scripts/perf/measure.mjs                  # bundle only, existing dist/
     node scripts/perf/measure.mjs --build          # rebuild first
     node scripts/perf/measure.mjs --browser        # bundle + browser routes
     node scripts/perf/measure.mjs --all            # build + bundle + browser

   Options
     --out <file>    where to write the JSON (default perf/performance-baseline.json)
     --port <n>      preview server port (default 4188)
     --runs <n>      cold/warm repetitions per route (default 3; the median
                     repetition is reported, with min/max alongside it)
     --routes <ids>  comma-separated subset of home,gb,wa,gb-grid,returns,
                     nem,nem-story,nem-entry,nem-data

   On a host that intercepts recursive deletes (the WorkBuddy sandbox does),
   Vite cannot empty dist/. Prefix the command with
   CODEBUDDY_SAFE_DELETE_ENABLED=0 — nothing else about the build changes.

   The JSON is the comparison record. Re-run after a change and diff the file:
   that is the whole feedback loop this establishes.
   --------------------------------------------------------------------------- */
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { spawn } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(REPO, 'dist');
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const BUILD = flag('--build') || flag('--all');
const BROWSER = flag('--browser') || flag('--all');
const OUT = path.resolve(REPO, option('--out', 'perf/performance-baseline.json'));
const PORT = Number(option('--port', 4188));
const RUNS = Math.max(1, Number(option('--runs', 3)));
const ONLY_ROUTES = option('--routes', null)?.split(',').map(s => s.trim()).filter(Boolean) ?? null;

const kB = (bytes) => Math.round(bytes / 1024 * 100) / 100;
const seconds = (ms) => Math.round(ms / 100) / 10;

/* ---------------------------------------------------------------------------
   BUNDLE
   --------------------------------------------------------------------------- */

async function walk(dir, out = []){
  for (const entry of await readdir(dir, { withFileTypes:true })){
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

/** What a chunk is for. Market and story chunks are named by vite.config.js;
 *  everything else is counted as shared or feature payload. */
function roleOf(name){
  const market = /^market-(.+?)-[A-Za-z0-9_-]{8}\.js$/.exec(name);
  if (market) return { role:'market', id:market[1] };
  const story = /^story-(.+?)-[A-Za-z0-9_-]{8}\.js$/.exec(name);
  if (story) return { role:'story', id:story[1] };
  const delivery = /^delivery-(.+?)-[A-Za-z0-9_-]{8}\.js$/.exec(name);
  if (delivery) return { role:'delivery', id:delivery[1] };
  return { role:'shared' };
}

/** A chunk and everything it statically imports: what must already be on the
 *  wire before it can run. Dynamic imports are deliberately excluded. */
function closure(chunk, byName, seen = new Set()){
  if (!chunk || seen.has(chunk)) return seen;
  seen.add(chunk);
  for (const name of chunk.imports) closure(byName.get(name), byName, seen);
  return seen;
}

const gzipOf = (set) => [...set].reduce((sum, chunk) => sum + chunk.gzip, 0);

async function analyseBundle(){
  if (!existsSync(DIST)) throw new Error('dist/ is absent — run with --build or `npm run build` first');

  const html = await readFile(path.join(DIST, 'index.html'), 'utf8');
  const entryName = /<script[^>]+src="\/assets\/([^"]+\.js)"/.exec(html)?.[1] ?? null;
  const cssNames = [...html.matchAll(/href="\/assets\/([^"]+\.css)"/g)].map(m => m[1]);

  const assetDir = path.join(DIST, 'assets');
  const assetFiles = await readdir(assetDir);
  const byName = new Map();
  let jsRaw = 0;
  let jsGzip = 0;

  for (const name of assetFiles.filter(f => f.endsWith('.js'))){
    const buf = await readFile(path.join(assetDir, name));
    const text = buf.toString('utf8');
    const imports = new Set(
      [...text.matchAll(/(?:^|[;}\n])import(?:\s*\{[^}]*\}\s*from|\s*[\w$]+\s*from|)\s*"\.\/([^"]+\.js)"/g)]
        .map(m => m[1]));
    const chunk = { name, raw:buf.length, gzip:gzipSync(buf).length, text, imports, ...roleOf(name) };
    byName.set(name, chunk);
    jsRaw += chunk.raw;
    jsGzip += chunk.gzip;
  }

  const entry = byName.get(entryName) ?? null;
  if (!entry) throw new Error(`index.html names ${entryName ?? 'no script'}, which is not in dist/assets`);
  /* The entry is named by index.html, not by its filename shape: Rollup could
     emit another `index-*` chunk. Label it so the top-chunk table says what it
     is rather than calling the first load "shared". */
  entry.role = 'entry';

  const first = closure(entry, byName);
  const entryClosure = new Set(first);

  const markets = [...byName.values()]
    .filter(c => c.role === 'market')
    .map(c => {
      const own = [...closure(c, byName)].filter(x => !entryClosure.has(x) && x !== c);
      return {
        id:c.id, name:c.name, rawBytes:c.raw, gzipBytes:c.gzip,
        visitCostGzipBytes:c.gzip + gzipOf(own),
      };
    })
    .sort((a, b) => b.gzipBytes - a.gzipBytes);

  /* The home page's first view, by the same rule tests/bundle-budget.test.js
     applies: the entry closure, the investor-experience chunk's closure, and
     the largest of the four awaited investor-data chunks. Reported here so the
     baseline states the number the budget is actually about, not the entry
     chunk alone. */
  const feature = (prefix) => [...byName.values()].find(c => c.name.startsWith(prefix + '-'));
  const briefingChunk = feature('investor-experience');
  const investorChunks = ['infraFund', 'strategic', 'foreignFirstTimer', 'developer']
    .map(feature).filter(Boolean);
  let homeFirstView = null;
  if (briefingChunk && investorChunks.length === 4){
    const common = closure(briefingChunk, byName, new Set(entryClosure));
    const largest = investorChunks
      .map(c => closure(c, byName, new Set(common)))
      .sort((a, b) => gzipOf(b) - gzipOf(a))[0];
    homeFirstView = { gzipBytes:gzipOf(largest), files:largest.size };
  }

  const topChunks = [...byName.values()]
    .sort((a, b) => b.gzip - a.gzip)
    .slice(0, 15)
    .map(c => ({ name:c.name, role:c.role, id:c.id ?? null, rawBytes:c.raw, gzipBytes:c.gzip }));

  /* CSS: the entry stylesheet is first load; the rest travels with a lazy
     chunk. Counted separately because the bundle budget only asserts JS. */
  let cssRaw = 0;
  let cssGzip = 0;
  const entryCss = [];
  for (const name of assetFiles.filter(f => f.endsWith('.css'))){
    const buf = await readFile(path.join(assetDir, name));
    cssRaw += buf.length;
    cssGzip += gzipSync(buf).length;
    if (cssNames.includes(name)){
      entryCss.push({ name, rawBytes:buf.length, gzipBytes:gzipSync(buf).length });
    }
  }

  /* Static data travels as JSON, not JS, and is fetched at runtime. The grid
     registers and the largest price series are the ones that dominate a slow
     market page, so they belong in the baseline. */
  const dataDir = path.join(DIST, 'data');
  const dataAssets = [];
  if (existsSync(dataDir)){
    for (const file of await walk(dataDir)){
      if (!file.endsWith('.json')) continue;
      const buf = await readFile(file);
      dataAssets.push({
        path:path.relative(DIST, file).replace(/\\/g, '/'),
        bytes:buf.length, gzipBytes:gzipSync(buf).length,
      });
    }
  }
  dataAssets.sort((a, b) => b.bytes - a.bytes);
  const dataBytes = dataAssets.reduce((sum, a) => sum + a.bytes, 0);

  return {
    dir:'dist',
    totals:{
      js:{ files:byName.size, rawBytes:jsRaw, gzipBytes:jsGzip },
      css:{ files:assetFiles.filter(f => f.endsWith('.css')).length, rawBytes:cssRaw, gzipBytes:cssGzip },
      jsonAssets:{ files:dataAssets.length, bytes:dataBytes },
    },
    firstLoad:{
      entry:{ name:entry.name, rawBytes:entry.raw, gzipBytes:entry.gzip },
      staticClosure:{
        files:first.size,
        rawBytes:[...first].reduce((sum, c) => sum + c.raw, 0),
        gzipBytes:gzipOf(first),
        names:[...first].map(c => c.name),
      },
      css:entryCss,
      cssGzipBytes:entryCss.reduce((sum, c) => sum + c.gzipBytes, 0),
      homeFirstView,
    },
    markets,
    topChunks,
    largestJson:dataAssets.slice(0, 15),
  };
}

/* ---------------------------------------------------------------------------
   BUILD
   --------------------------------------------------------------------------- */

function runBuild(){
  return new Promise((resolve) => {
    const started = performance.now();
    const child = spawn(NPM, ['run', 'build'], {
      cwd:REPO, shell:process.platform === 'win32',
      stdio:['ignore', 'pipe', 'pipe'],
      env:process.env,
    });
    let output = '';
    const keep = (d) => {
      output += d;
      if (output.length > 20000) output = output.slice(-12000);
    };
    child.stdout.on('data', keep);
    child.stderr.on('data', keep);
    child.on('close', (exitCode) => {
      const durationMs = performance.now() - started;
      /* Vite prints "built in 47.6s" and, past a minute, "built in 1m 1s".
         Strip the colour codes first: the check mark is wrapped in them and a
         plain regex against the raw stream silently returns null. */
      const clean = output.replace(/\x1B\[[0-9;]*m/g, '');
      const vite = /built in (?:(\d+)m )?([\d.]+)s/.exec(clean);
      resolve({
        exitCode,
        durationMs:Math.round(durationMs),
        viteReportedSeconds:vite ? Number(vite[1] ?? 0) * 60 + Number(vite[2]) : null,
        tail:clean.trim().split(/\r?\n/).slice(-8),
      });
    });
  });
}

/* ---------------------------------------------------------------------------
   BROWSER
   --------------------------------------------------------------------------- */

const ROUTES = [
  { id:'home', path:'/', ready:'#app select[aria-label="Investor profile"]',
    note:'the briefing and its investor selector' },
  { id:'gb', path:'/markets/great-britain', ready:'#bankable',
    note:'a block-engine dashboard, default tab' },
  { id:'wa', path:'/markets/western-australia', ready:'#bankable',
    note:'the largest market chunk and hand-written dashboard' },
  { id:'gb-grid', path:'/markets/great-britain/grid', ready:'.geo-grid-map svg',
    note:'the GB transmission map, the largest SVG network' },
  { id:'returns', path:'/returns', ready:'.ix-results tbody tr',
    note:'the comparison engine and league table' },
  /* The National Electricity Market, measured section by section (P1 pilot,
     docs/p1-sections-pilot.md). A bare /markets/<slug> is the investment-case
     experience, not the dashboard; the dashboard's landing tab is /case. Both
     are measured, because both are ways a reader arrives. Deep links are typed
     in rather than clicked, which is the case the section loader must get right. */
  { id:'nem', path:'/markets/nem', ready:'.ix-decision-panel',
    note:'the investment-case experience, the address a reader usually lands on' },
  { id:'nem-brief', path:'/markets/nem/case', ready:'.tab-section[data-section="case"] .sect',
    note:'the dashboard landing tab — the brief alone' },
  { id:'nem-story', path:'/markets/nem/story', ready:'.tab-section[data-section="home"] .card',
    note:'overview and market story, stacked' },
  { id:'nem-entry', path:'/markets/nem/entry', ready:'.tab-section[data-section="grid"] .geo-grid-map svg',
    note:'entry and delivery: the ledger, then the grid map' },
  { id:'nem-data', path:'/markets/nem/data', ready:'.tab-section[data-section="data"] .sect',
    note:'an old address, resolved to the evidence tab' },
];

/* Registered before any page script runs: LCP, CLS and long tasks are only
   observable through PerformanceObserver, and a buffered observer is the only
   way to see entries emitted before the script attached. */
const INIT_SCRIPT = `
  window.__perf = { lcp: null, cls: 0, longTasks: [] };
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__perf.lcp = entry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {}
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__perf.cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  } catch {}
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__perf.longTasks.push({ start: entry.startTime, duration: entry.duration });
      }
    }).observe({ type: 'longtask', buffered: true });
  } catch {}
`;

const COLLECT = () => {
  const nav = performance.getEntriesByType('navigation')[0] ?? {};
  const paint = Object.fromEntries(performance.getEntriesByType('paint').map(p => [p.name, p.startTime]));
  const resources = performance.getEntriesByType('resource');
  const sum = (pick) => resources.reduce((total, r) => total + (pick(r) || 0), 0);
  const byInitiator = {};
  for (const r of resources){
    const key = r.initiatorType || 'other';
    byInitiator[key] = (byInitiator[key] || 0) + (r.transferSize || 0);
  }
  const longTasks = window.__perf?.longTasks ?? [];
  return {
    readyMs:Math.round(performance.now()),
    ttfbMs:Math.round(nav.responseStart ?? 0),
    dclMs:Math.round(nav.domContentLoadedEventEnd ?? 0),
    loadMs:Math.round(nav.loadEventEnd ?? 0),
    fpMs:paint['first-paint'] ?? null,
    fcpMs:paint['first-contentful-paint'] ?? null,
    lcpMs:window.__perf?.lcp != null ? Math.round(window.__perf.lcp) : null,
    cls:Math.round((window.__perf?.cls ?? 0) * 1000) / 1000,
    longTasks:{
      count:longTasks.length,
      totalMs:Math.round(longTasks.reduce((t, e) => t + e.duration, 0)),
      maxMs:longTasks.length ? Math.round(Math.max(...longTasks.map(e => e.duration))) : 0,
    },
    resources:{
      count:resources.length,
      transferBytes:sum(r => r.transferSize),
      decodedBytes:sum(r => r.decodedBodySize),
      byInitiator,
    },
    dom:{
      elements:document.getElementsByTagName('*').length,
      svgElements:document.querySelectorAll('svg *').length,
      mapSvgElements:document.querySelectorAll('.geo-grid-map svg *').length,
    },
  };
};

async function waitForServer(url, timeoutMs = 45000){
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline){
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch { /* not listening yet */ }
    await new Promise(r => setTimeout(r, 250));
  }
  throw new Error(`preview server did not answer at ${url} within ${timeoutMs} ms`);
}

function startPreview(port){
  const url = `http://127.0.0.1:${port}/`;
  const child = spawn(NPM, ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd:REPO, shell:process.platform === 'win32', stdio:['ignore', 'pipe', 'pipe'],
    env:process.env,
  });
  let log = '';
  child.stdout.on('data', d => { log += d; });
  child.stderr.on('data', d => { log += d; });
  return { child, url, log:() => log };
}

function stopPreview(server){
  if (!server?.child || server.child.killed) return;
  if (process.platform === 'win32'){
    spawn('taskkill', ['/pid', String(server.child.pid), '/T', '/F'], { stdio:'ignore' });
  } else {
    server.child.kill('SIGTERM');
  }
}

/** The repetition with the median ready time, kept whole so its LCP, long-task
 *  and request figures describe the same visit rather than a field-wise blend. */
function medianOf(samples){
  const sorted = [...samples].sort((a, b) => a.readyMs - b.readyMs);
  return sorted[Math.floor(sorted.length / 2)];
}

const spreadOf = (samples) => ({
  min:Math.min(...samples.map(s => s.readyMs)),
  max:Math.max(...samples.map(s => s.readyMs)),
});

const brief = (s) => ({
  readyMs:s.readyMs, dclMs:s.dclMs, loadMs:s.loadMs, fcpMs:s.fcpMs, lcpMs:s.lcpMs,
  cls:s.cls, longTaskMs:s.longTasks.totalMs, requests:s.resources.count,
});

async function measureRoute(browser, baseURL, route){
  const errors = new Set();
  const coldSamples = [];
  const warmSamples = [];

  for (let run = 0; run < RUNS; run++){
    const context = await browser.newContext({ viewport:{ width:1440, height:1000 } });
    await context.addInitScript(INIT_SCRIPT);
    const page = await context.newPage();
    page.on('pageerror', e => { if (errors.size < 5) errors.add(e.message); });

    const navigate = async () => {
      const started = Date.now();
      await page.goto(baseURL + route.path, { waitUntil:'load', timeout:60000 });
      await page.waitForSelector(route.ready, { state:'visible', timeout:60000 });
      /* Two frames: `visible` means a layout box exists, not that a frame has
         been painted. Without this the paint and LCP entries can still be
         absent, and CLS reads zero on a page that has not drawn yet. */
      await page.evaluate(() => new Promise(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const wallMs = Date.now() - started;
      const metrics = await page.evaluate(COLLECT);
      return { wallMs, ...metrics };
    };

    coldSamples.push(await navigate());
    /* One repeat visit in the same context. The first load has populated the
       HTTP cache; what this measures is a reader coming back to the page, not
       a first-time visitor. */
    await page.goto('about:blank');
    warmSamples.push(await navigate());

    await context.close();
  }

  return {
    errors:[...errors],
    cold:medianOf(coldSamples),
    warm:medianOf(warmSamples),
    spread:{ cold:spreadOf(coldSamples), warm:spreadOf(warmSamples) },
    samples:{ cold:coldSamples.map(brief), warm:warmSamples.map(brief) },
  };
}

async function analyseBrowser(){
  const { chromium } = await import('@playwright/test');
  const server = startPreview(PORT);
  let browser;
  try {
    await waitForServer(server.url);
    /* The full Chromium build, not the headless shell: the page-check suite
       runs `channel: 'chromium'`, and a baseline taken on a different binary
       is not comparable with the suite's own timings. */
    browser = await chromium.launch({ channel:'chromium' });
    const version = browser.version();
    const routes = ROUTES.filter(r => !ONLY_ROUTES || ONLY_ROUTES.includes(r.id));
    const results = [];
    for (const route of routes){
      process.stdout.write(`  ${route.id} … `);
      const measured = await measureRoute(browser, server.url, route);
      results.push({ ...route, ...measured });
      process.stdout.write(`${measured.cold.readyMs} ms ready\n`);
    }
    return {
      baseURL:server.url,
      browser:`chromium ${version}`,
      viewport:{ width:1440, height:1000 },
      runs:RUNS,
      throttling:'none',
      routes:results,
      caveat:'vite preview serves identity encoding and revalidates hashed assets; transfer sizes are an upper bound and warm visits are not production cache hits.',
    };
  } finally {
    await browser?.close();
    stopPreview(server);
  }
}

/* ---------------------------------------------------------------------------
   MAIN
   --------------------------------------------------------------------------- */

function printSummary(report){
  const { bundle, build, browser } = report;
  console.log('');
  if (build) console.log(`Build            ${seconds(build.durationMs)} s wall` +
    (build.viteReportedSeconds ? ` (vite ${build.viteReportedSeconds} s)` : '') +
    (build.exitCode ? ` — EXIT ${build.exitCode}` : ''));
  if (bundle){
    const f = bundle.firstLoad;
    console.log(`Entry            ${kB(f.entry.rawBytes)} KiB raw / ${kB(f.entry.gzipBytes)} KiB gzip`);
    console.log(`First-load JS    ${kB(f.staticClosure.gzipBytes)} KiB gzip across ${f.staticClosure.files} file(s)`);
    if (f.homeFirstView) console.log(`Home first view  ${kB(f.homeFirstView.gzipBytes)} KiB gzip across ${f.homeFirstView.files} file(s)`);
    console.log(`First-load CSS   ${kB(f.cssGzipBytes)} KiB gzip`);
    console.log(`Largest chunk    ${bundle.topChunks[0].name} ${kB(bundle.topChunks[0].gzipBytes)} KiB gzip`);
    console.log(`Largest JSON     ${bundle.largestJson[0]?.path ?? 'none'} ${kB(bundle.largestJson[0]?.bytes ?? 0)} KiB`);
  }
  if (browser){
    console.log('');
    for (const r of browser.routes){
      const map = r.cold.mapSvgElements ? `, map ${r.cold.mapSvgElements} nodes` : '';
      console.log(`${r.id.padEnd(8)} cold ${String(r.cold.readyMs).padStart(5)} ms ready ` +
        `(${r.spread.cold.min}–${r.spread.cold.max}), ` +
        `LCP ${String(r.cold.lcpMs ?? '—').padStart(5)} ms, ${r.cold.resources.count} requests${map}`);
    }
  }
  console.log(`\nWrote ${path.relative(REPO, OUT).replace(/\\/g, '/')}`);
}

async function main(){
  const report = {
    schema:1,
    generatedAt:new Date().toISOString(),
    commit:await gitHead(),
    environment:{
      node:process.version,
      platform:`${process.platform} ${process.arch}`,
      cpus:os.cpus().length,
      cpuModel:os.cpus()[0]?.model?.trim() ?? 'unknown',
      totalMemoryGB:Math.round(os.totalmem() / 1024 ** 3 * 10) / 10,
    },
    build:null,
    bundle:null,
    browser:null,
  };

  if (BUILD){
    console.log('Building …');
    report.build = await runBuild();
    if (report.build.exitCode !== 0){
      console.error(report.build.tail.join('\n'));
      throw new Error('the production build failed; no baseline was written');
    }
  }

  console.log('Analysing dist/ …');
  report.bundle = await analyseBundle();

  if (BROWSER){
    console.log('Measuring routes …');
    report.browser = await analyseBrowser();
  }

  await mkdir(path.dirname(OUT), { recursive:true });
  await writeFile(OUT, JSON.stringify(report, null, 2) + '\n', 'utf8');
  printSummary(report);
}

function gitHead(){
  return new Promise((resolve) => {
    const child = spawn('git', ['rev-parse', '--short', 'HEAD'], { cwd:REPO, stdio:['ignore', 'pipe', 'ignore'] });
    let out = '';
    child.stdout.on('data', d => { out += d; });
    child.on('close', () => resolve(out.trim() || null));
  });
}

main().catch(err => {
  console.error('\nPerf baseline failed:', err?.message ?? err);
  process.exit(1);
});
