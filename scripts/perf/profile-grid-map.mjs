#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   WHERE THE GRID MAP SPENDS ITS TIME.

   `measure.mjs` answers "how long until the route is ready"; this answers
   "which operation inside the map is that time in". Phase A1 of the SVG
   performance work needed the second question, and it needed the answer without
   adding a timing hook to the component: the market-shared chunk has under a
   kilobyte of budget headroom, so instrumentation that ships is instrumentation
   this repository cannot afford.

   So nothing is instrumented. Two things do the measuring:

     1. A CDP CPU profile of a window the harness opens and closes around one
        named interaction. Self time is attributed to a function; a function's
        inclusive time is the sum of its samples and its descendants'. Idle time
        is the window's wall time minus the sampled time, which is how network
        latency is separated from main-thread cost rather than guessed at.
     2. A MutationObserver installed before any page script runs, which records
        when each layer first appears and — the number that mattered most in
        A1 — how many times the transmission layer is emptied and rebuilt.

   Profiling the minified build gives reliable totals but unusable attribution:
   every function is called `t` or `n`. `--unminified` therefore builds a copy
   into `dist-profile/` and profiles that instead. Same modules, same control
   flow, readable names. Absolute milliseconds come from the minified build via
   `npm run perf:browser`; this file is for ratios and for the rebuild count.

   Usage
     node scripts/perf/profile-grid-map.mjs --unminified   # build + profile
     node scripts/perf/profile-grid-map.mjs                # profile existing dist/

   Options
     --routes <ids>   comma-separated: gb,de,it,wa,ro (default gb)
     --runs <n>       repetitions per route (default 3, medians reported)
     --out <file>     default perf/p1-profile.json
     --port <n>       default 4189
     --unminified     build dist-profile/ with `--minify false` first
     --keep           leave the preview server running after the run

   A host that intercepts recursive deletes — the WorkBuddy sandbox — needs
   CODEBUDDY_SAFE_DELETE_ENABLED=0 for Vite to empty the output directory.
   --------------------------------------------------------------------------- */
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const UNMINIFIED = flag('--unminified');
const KEEP = flag('--keep');
const OUT = path.resolve(REPO, option('--out', 'perf/p1-profile.json'));
const PORT = Number(option('--port', 4189));
const RUNS = Math.max(1, Number(option('--runs', 3)));
const ROUTES = option('--routes', 'gb').split(',').map(s => s.trim()).filter(Boolean);
const DIR = UNMINIFIED ? 'dist-profile' : 'dist';

const SLUG = {
  gb: 'great-britain', de: 'germany', it: 'italy', wa: 'western-australia',
  ro: 'romania', es: 'spain', ie: 'ireland', pl: 'poland',
};

const round = (value, places = 1) => Math.round(value * 10 ** places) / 10 ** places;

/* ---------------------------------------------------------------------------
   The observation script, installed before any page module runs.
   --------------------------------------------------------------------------- */

const INIT = `
  window.__probe = { marks: {}, rebuilds: 0, transmissions: [], longTasks: [] };
  const stamp = (key) => {
    if (!(key in window.__probe.marks)) window.__probe.marks[key] = performance.now();
  };
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__probe.longTasks.push({ start: e.startTime, duration: e.duration });
    }).observe({ type: 'longtask', buffered: true });
  } catch {}

  /* Watch for the layers as they are created. childList on the transmission
     group, not subtree: a rebuild replaces its children, and that is the event
     this measures. */
  const watch = () => {
    const transmission = document.querySelector('.geo-transmission-layer');
    if (transmission && !transmission.__watched) {
      transmission.__watched = true;
      stamp('transmissionLayer');
      new MutationObserver((records) => {
        for (const record of records) {
          if (!record.removedNodes.length) continue;
          window.__probe.rebuilds += 1;
          window.__probe.transmissions.push({
            at: Math.round(performance.now()),
            removed: record.removedNodes.length,
            kept: record.target.childElementCount,
          });
        }
      }).observe(transmission, { childList: true });
    }
    if (document.querySelector('.geo-country')) stamp('baseMap');
    if (document.querySelector('.geo-transmission-line')) stamp('firstTransmission');
    if (document.querySelector('.geo-point-label')) stamp('firstPointLabel');
  };

  const start = () => {
    new MutationObserver(watch).observe(document.documentElement, { childList: true, subtree: true });
    watch();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
`;

const PROBE = () => ({
  marks: window.__probe.marks,
  rebuilds: window.__probe.rebuilds,
  transmissions: window.__probe.transmissions,
  longTasks: window.__probe.longTasks,
  nodes: {
    svg: document.querySelectorAll('.geo-grid-map svg *').length,
    transmission: document.querySelectorAll('.geo-transmission-layer *').length,
    points: document.querySelectorAll('.geo-point-layer *').length,
    projects: document.querySelectorAll('.geo-project-layer *').length,
    labels: document.querySelectorAll('.geo-label-layer *').length,
  },
  zoom: document.querySelector('.geo-grid-map svg')?.getAttribute('data-zoom') ?? null,
  gridRequests: performance.getEntriesByType('resource')
    .filter(r => r.name.includes('/data/grid/'))
    .map(r => ({ file: r.name.split('/').pop(), durationMs: Math.round(r.duration), bytes: r.transferSize })),
});

/* ---------------------------------------------------------------------------
   Profile parsing
   --------------------------------------------------------------------------- */

const NATIVE_DOM = new Set([
  'appendChild', 'insertBefore', 'replaceChildren', 'removeChild', 'append', 'prepend',
  'createElementNS', 'createElement', 'createTextNode', 'setAttribute', 'removeAttribute',
  'setAttributeNS', 'querySelector', 'querySelectorAll', 'getBBox', 'getBoundingClientRect',
  'cloneNode', 'insertAdjacentHTML',
]);
const LAYOUT = new Set([
  'Layout', 'UpdateLayoutTree', 'Recalculate Style', 'PrePaint', 'Paint', 'Layerize',
  'Commit', 'UpdateLayerTree', 'IntersectionObserverController::computeIntersections',
  'ParseHTML', 'RunMicrotasks', 'FunctionCall', 'EventDispatch', 'TimerFire', 'FireAnimationFrame',
]);
const GC = new Set(['GarbageCollection', 'MinorGC', 'MajorGC', 'BlinkGC.AtomicPhase', '(garbage collector)']);

/** A file path short enough to read in a report. */
const shortUrl = (url) => {
  if (!url) return '';
  const clean = url.replace(/^https?:\/\/[^/]+\//, '');
  const asset = /assets\/([^/?#]+)/.exec(clean);
  if (asset) return 'assets/' + asset[1].replace(/-[A-Za-z0-9_]{8}\.js$/, '.js');
  return clean.replace(/^.*\/src\//, 'src/');
};

function categoryOf(frame){
  const { functionName: fn, url } = frame;
  if (!url && GC.has(fn)) return 'garbage collection';
  if (!url && LAYOUT.has(fn)) return 'style & layout';
  if (!url && NATIVE_DOM.has(fn)) return 'DOM calls';
  if (!url) return 'engine';
  if (/d3-geo/.test(url)) return 'projection (d3-geo)';
  if (/node_modules/.test(url)) return 'other libraries';
  if (/(^|\/)src\//.test(url) || /assets\//.test(url)) return 'app code';
  return 'other';
}

/**
 * Turn a CDP profile into the four things the report needs: wall time, sampled
 * (busy) time, self time by function, and inclusive time for the functions the
 * map's draw path is named after.
 */
function summarise(profile, wallMs){
  const byId = new Map(profile.nodes.map(n => [n.id, n]));
  const self = new Map();
  const samples = profile.samples || [];
  const deltas = profile.timeDeltas || [];
  let busyUs = 0;
  let idleUs = 0;

  for (let i = 0; i < samples.length; i += 1){
    const node = byId.get(samples[i]);
    const us = deltas[i] || 0;
    /* (idle) is the page waiting — on the network, on a timer, on nothing. It is
       the difference between wall time and main-thread cost, so it is counted
       separately rather than folded into the total. */
    if (node?.callFrame?.functionName === '(idle)'){ idleUs += us; continue; }
    busyUs += us;
    if (!node) continue;
    const frame = node.callFrame;
    const key = `${frame.functionName || '(anonymous)'}\u0000${shortUrl(frame.url)}\u0000${frame.lineNumber}`;
    const entry = self.get(key) || {
      fn: frame.functionName || '(anonymous)',
      url: shortUrl(frame.url),
      line: frame.lineNumber + 1,
      category: categoryOf(frame),
      selfMs: 0,
      samples: 0,
    };
    entry.selfMs += us / 1000;
    entry.samples += 1;
    self.set(key, entry);
  }

  /* Inclusive time: a named function's own samples plus every sample whose
     ancestor chain passes through it. Enough to attribute "the 900 ms is
     renderTransmission, of which 600 ms is geometry". */
  const parentOf = new Map();
  for (const node of profile.nodes){
    for (const child of node.children || []) parentOf.set(child, node.id);
  }
  const inclusive = new Map();
  for (let i = 0; i < samples.length; i += 1){
    const us = deltas[i] || 0;
    const seen = new Set();
    for (let id = samples[i]; id != null; id = parentOf.get(id)){
      const node = byId.get(id);
      const fn = node?.callFrame?.functionName;
      if (!fn || seen.has(fn)) continue;
      seen.add(fn);
      inclusive.set(fn, (inclusive.get(fn) || 0) + us / 1000);
    }
  }

  const byCategory = new Map();
  for (const entry of self.values()){
    byCategory.set(entry.category, (byCategory.get(entry.category) || 0) + entry.selfMs);
  }

  const rows = [...self.values()].sort((a, b) => b.selfMs - a.selfMs);
  return {
    wallMs: Math.round(wallMs),
    busyMs: Math.round(busyUs / 1000),
    idleMs: Math.round(idleUs / 1000),
    selfMs: rows.slice(0, 24).map(r => ({ ...r, selfMs: round(r.selfMs) })),
    categories: [...byCategory.entries()]
      .map(([category, ms]) => ({ category, ms: Math.round(ms), share: Math.round(ms / (busyUs / 1000) * 100) }))
      .sort((a, b) => b.ms - a.ms),
    inclusive: Object.fromEntries(
      [...inclusive.entries()]
        .filter(([fn]) => /^(render|update|setView|applyView|placeLabels|clusterProjects|loadPendingBands|shouldLoad|projection|path|fitExtent|geoPath)/.test(fn))
        .map(([fn, ms]) => [fn, Math.round(ms)])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 24)),
  };
}

/* ---------------------------------------------------------------------------
   Browser
   --------------------------------------------------------------------------- */

const ROUTE_READY = '.geo-grid-map svg';

async function withProfile(context, page, action, waitAfter){
  const client = await context.newCDPSession(page);
  await client.send('Profiler.enable');
  await client.send('Profiler.setSamplingInterval', { interval: 200 });
  await client.send('Profiler.start');
  const started = Date.now();
  await action();
  if (waitAfter) await waitAfter();
  const { profile } = await client.send('Profiler.stop');
  const wallMs = Date.now() - started;
  await client.detach().catch(() => {});
  return summarise(profile, wallMs);
}

/** No new grid request and two quiet frames — the map has stopped drawing. */
async function settle(page, quietMs = 350){
  const deadline = Date.now() + 20000;
  let lastName = '';
  let lastChange = Date.now();
  while (Date.now() < deadline){
    const name = await page.evaluate(() => {
      const grid = performance.getEntriesByType('resource').filter(r => r.name.includes('/data/grid/'));
      return `${grid.length}:${document.querySelectorAll('.geo-transmission-layer *').length}`;
    });
    if (name !== lastName){ lastName = name; lastChange = Date.now(); }
    if (Date.now() - lastChange > quietMs) break;
    await page.waitForTimeout(50);
  }
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
}

async function zoomIn(page, steps){
  const button = page.locator('.geo-zoom-btn').nth(1);
  for (let i = 0; i < steps; i += 1) await button.click();
}

async function panBy(page, dx, dy, steps = 24){
  const box = await page.locator('.geo-map-pane svg').boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  for (let i = 1; i <= steps; i += 1){
    await page.mouse.move(x + (dx * i) / steps, y + (dy * i) / steps);
  }
  await page.mouse.up();
}

async function profileRoute(browser, baseURL, id){
  const slug = SLUG[id];
  if (!slug) throw new Error(`unknown route id: ${id}`);
  const url = `${baseURL}markets/${slug}/grid`;
  const cold = [];
  const warm = [];
  const interactions = [];
  const probes = [];

  for (let run = 0; run < RUNS; run += 1){
    const context = await browser.newContext({ viewport:{ width:1440, height:1000 } });
    await context.addInitScript(INIT);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    /* COLD */
    cold.push(await withProfile(context, page, async () => {
      await page.goto(url, { waitUntil:'load', timeout:60000 });
      await page.waitForSelector(ROUTE_READY, { state:'visible', timeout:60000 });
    }, () => settle(page)));

    /* WARM — same context, so the chunk and the band files are cached. */
    await page.goto('about:blank');
    warm.push(await withProfile(context, page, async () => {
      await page.goto(url, { waitUntil:'load', timeout:60000 });
      await page.waitForSelector(ROUTE_READY, { state:'visible', timeout:60000 });
    }, () => settle(page)));

    /* INTERACTIONS — one profile each, from the settled state. */
    const before = await page.evaluate(PROBE);
    const zoom = await withProfile(context, page, () => zoomIn(page, 3), () => settle(page));
    const afterZoom = await page.evaluate(PROBE);
    const pan = await withProfile(context, page,
      () => panBy(page, 140, 70), () => page.waitForTimeout(60));
    const toggle = await withProfile(context, page, async () => {
      await page.locator('.geo-layer-toggle.route input').click();
      await page.waitForTimeout(40);
      await page.locator('.geo-layer-toggle.route input').click();
    }, () => page.waitForTimeout(40));
    const selectTarget = page.locator('.geo-marker, .geo-project').first();
    const select = await page.locator('.geo-marker, .geo-project').count()
      ? await withProfile(context, page, async () => {
        await selectTarget.click({ force:true, timeout:5000 });
      }, () => page.waitForTimeout(60))
      : { wallMs:0, busyMs:0, idleMs:0, categories:[], skipped:'no selectable marker on this map' };

    interactions.push({
      route:id,
      run,
      zoom:{ ...zoom, zoomAfter:afterZoom.zoom, transmissionNodes:afterZoom.nodes.transmission },
      pan,
      toggle,
      select,
      rebuilds:{ before:before.rebuilds, after:afterZoom.rebuilds },
    });
    probes.push({ run, before, after:afterZoom, errors });
    await context.close();
  }

  /* The median run is reported whole, so a single slow repetition cannot be
     assembled into a flattering blend of the others. */
  const median = (list) => {
    const sorted = [...list].sort((a, b) => a.wallMs - b.wallMs);
    return sorted[Math.floor(sorted.length / 2)];
  };
  const strip = ({ selfMs, categories, ...rest }) => rest;

  return {
    id,
    url,
    cold:{ ...median(cold), sample:{ cold:cold.map(strip), warm:warm.map(strip) } },
    warm:median(warm),
    interactions:interactions.map(i => ({
      run:i.run,
      zoom:{ ...strip(i.zoom), zoomAfter:i.zoom.zoomAfter, transmissionNodes:i.zoom.transmissionNodes, categories:i.zoom.categories },
      pan:{ ...strip(i.pan), categories:i.pan.categories },
      toggle:{ ...strip(i.toggle), categories:i.toggle.categories },
      select:{ ...strip(i.select), categories:i.select.categories },
      rebuilds:i.rebuilds,
    })),
    medianInteractions:{
      zoom:median(interactions.map(i => i.zoom)),
      pan:median(interactions.map(i => i.pan)),
      toggle:median(interactions.map(i => i.toggle)),
      select:median(interactions.map(i => i.select)),
    },
    probe:probes[0],
    errors:[...new Set(probes.flatMap(p => p.errors))],
    selfProfile:median(cold).selfMs,
    categories:median(cold).categories,
  };
}

/* ---------------------------------------------------------------------------
   Server
   --------------------------------------------------------------------------- */

function build(outDir){
  return new Promise((resolve, reject) => {
    const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx',
      ['vite', 'build', '--minify', 'false', '--outDir', outDir, '--emptyOutDir'],
      { cwd:REPO, shell:process.platform === 'win32', stdio:['ignore', 'pipe', 'pipe'], env:process.env });
    let log = '';
    child.stdout.on('data', d => { log += d; process.stdout.write('.'); });
    child.stderr.on('data', d => { log += d; });
    child.on('close', code => {
      process.stdout.write('\n');
      if (code === 0) resolve(log);
      else reject(new Error(`build failed (${code})\n${log.slice(-2000)}`));
    });
  });
}

function startPreview(port, outDir){
  const child = spawn(NPM, ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(port),
    '--strictPort', '--outDir', outDir],
  { cwd:REPO, shell:process.platform === 'win32', stdio:['ignore', 'pipe', 'pipe'], env:process.env });
  let log = '';
  child.stdout.on('data', d => { log += d; });
  child.stderr.on('data', d => { log += d; });
  return { child, url:`http://127.0.0.1:${port}/`, log:() => log };
}

function stopPreview(server){
  if (!server?.child || server.child.killed) return;
  if (process.platform === 'win32'){
    spawn('taskkill', ['/pid', String(server.child.pid), '/T', '/F'], { stdio:'ignore' });
  } else {
    server.child.kill('SIGTERM');
  }
}

async function waitForServer(url, timeoutMs = 90000){
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline){
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch { /* not listening yet */ }
    await new Promise(r => setTimeout(r, 250));
  }
  throw new Error(`preview server did not answer at ${url}`);
}

/* ---------------------------------------------------------------------------
   Main
   --------------------------------------------------------------------------- */

async function main(){
  if (UNMINIFIED){
    process.stdout.write(`building ${DIR}/ unminified `);
    await build(DIR);
  }
  const server = startPreview(PORT, DIR);
  let browser;
  try {
    await waitForServer(server.url);
    const { chromium } = await import('@playwright/test');
    browser = await chromium.launch({ channel:'chromium' });
    const routes = [];
    for (const id of ROUTES){
      process.stdout.write(`  ${id} … `);
      const result = await profileRoute(browser, server.url, id);
      routes.push(result);
      process.stdout.write(`cold ${result.cold.wallMs} ms wall / ${result.cold.busyMs} ms busy, `
        + `${result.interactions[0].rebuilds.after} rebuild(s)\n`);
    }

    const report = {
      schema:1,
      generatedAt:new Date().toISOString(),
      commit:process.env.GITHUB_SHA || null,
      environment:{
        node:process.version,
        platform:`${process.platform} ${process.arch}`,
        cpus:os.cpus().length,
        cpuModel:os.cpus()[0]?.model,
        totalMemoryGB:Math.round(os.totalmem() / 1e9 * 10) / 10,
      },
      build:UNMINIFIED ? `${DIR} (minify:false, attribution only)` : DIR,
      browser:`chromium ${browser.version()}`,
      viewport:{ width:1440, height:1000 },
      runs:RUNS,
      routes,
    };
    await mkdir(path.dirname(OUT), { recursive:true });
    await writeFile(OUT, JSON.stringify(report, null, 2));
    console.log(`\nwrote ${path.relative(REPO, OUT)}`);
    for (const route of routes){
      console.log(`\n${route.id}  cold ${route.cold.wallMs} ms wall, ${route.cold.busyMs} ms busy `
        + `(${Math.round(route.cold.busyMs / route.cold.wallMs * 100)}%)`);
      console.log(`  rebuilds on load: ${route.probe.before.rebuilds}`);
      for (const row of route.categories) console.log(`    ${String(row.ms).padStart(6)} ms  ${row.share}%  ${row.category}`);
      console.log('  top self time:');
      for (const row of route.selfProfile.slice(0, 10)){
        console.log(`    ${String(row.selfMs).padStart(7)} ms  ${row.fn}  ${row.url ? row.url + ':' + row.line : ''}`);
      }
      console.log(`  zoom wall ${route.medianInteractions.zoom.wallMs} ms / pan ${route.medianInteractions.pan.wallMs} ms`
        + ` / toggle ${route.medianInteractions.toggle.wallMs} ms / select ${route.medianInteractions.select.wallMs} ms`);
    }
  } finally {
    if (!KEEP) stopPreview(server);
    await browser?.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
