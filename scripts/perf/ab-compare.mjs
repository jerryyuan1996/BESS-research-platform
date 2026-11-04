#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   A/B TWO BUILDS OF THE SITE.

     node scripts/perf/ab-compare.mjs --a ../baseline/dist --b dist --runs 15

   `measure.mjs` measures one build against one server and writes a baseline.
   That is the right tool for "how fast is the site", and the wrong tool for
   "did this change make it faster": two runs of the SAME build minutes apart on
   a laptop move the median by several hundred milliseconds, which is the same
   order as the change being judged. This script removes that variable by
   measuring both builds in one process, alternating them rep by rep, so a
   machine that slows down over the run slows both equally.

   Three details that make the comparison fair rather than merely paired:

     the same static server   both builds are served by the same code, with
                              `Cache-Control: no-store`, so every repetition is
                              a cold load for both
     the same selectors       a route is "ready" when the same element is
                              visible in both builds
     the same session         a fresh browser context per sample, so no HTTP
                              cache, no service worker, no warm module graph

   Server: identity encoding. That makes transfer sizes an upper bound and puts
   both builds on the same footing; compressed sizes come from the build output
   and are what a reader actually downloads. The report says so.

   This is a diagnostic. It is not imported by the site, adds no request to a
   production page, and reads nothing but file names and timings.
   --------------------------------------------------------------------------- */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const A_DIR = option('--a', null);
const B_DIR = option('--b', 'dist');
const RUNS = Math.max(1, Number(option('--runs', 7)));
const PORT_A = Number(option('--port-a', 4191));
const PORT_B = Number(option('--port-b', 4192));
const ONLY = option('--routes', null)?.split(',').map(s => s.trim()).filter(Boolean) ?? null;

if (!A_DIR){
  console.error('usage: node scripts/perf/ab-compare.mjs --a <baseline-dist> [--b dist] [--runs 15]');
  process.exit(1);
}

/** Every route a market dashboard can be entered by, and what "ready" means. */
const ALL_ROUTES = [
  { id:'nem-brief', path:'/markets/nem/case', ready:'.tab-section[data-section="case"] .sect',
    note:'the NEM landing tab — one small section' },
  { id:'nem-story', path:'/markets/nem/story', ready:'.tab-section[data-section="home"] .card',
    note:'overview and market story — the largest sections' },
  { id:'nem-entry', path:'/markets/nem/entry', ready:'.tab-section[data-section="grid"] .geo-grid-map svg',
    note:'the ledger and the grid map' },
  { id:'nem-data', path:'/markets/nem/data', ready:'.tab-section[data-section="data"] .sect',
    note:'an old address, resolved to the evidence tab' },
];
const ROUTES = ALL_ROUTES.filter(r => !ONLY || ONLY.includes(r.id));

const MIME = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.json':'application/json',
  '.svg':'image/svg+xml', '.png':'image/png', '.woff2':'font/woff2', '.ico':'image/x-icon', '.txt':'text/plain',
};

/** A static server with the SPA fallback both builds are published behind. */
function serve(root, port){
  const server = createServer(async (request, response) => {
    const url = decodeURIComponent(request.url.split('?')[0]);
    let file = path.join(root, url);
    try {
      const info = await stat(file).catch(() => null);
      if (!info || info.isDirectory()) file = path.join(root, 'index.html');
      const body = await readFile(file);
      response.writeHead(200, {
        'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end('not found');
    }
  });
  return new Promise(resolve => server.listen(port, '127.0.0.1', () => resolve(server)));
}

/* LCP and long tasks come from observers that must be attached before any page
   script runs; the paint entries a page reports afterwards are too late. */
const INIT = `
  window.__perf = { lcp: null, longTasks: [] };
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__perf.lcp = e.startTime; })
    .observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__perf.longTasks.push(e.duration); })
    .observe({ type: 'longtask', buffered: true }); } catch {}
`;

const COLLECT = () => {
  const nav = performance.getEntriesByType('navigation')[0] ?? {};
  const resources = performance.getEntriesByType('resource');
  const script = resources.filter(r => /\.js$/.test(r.name));
  return {
    ttfbMs: Math.round(nav.responseStart ?? 0),
    fcpMs: Math.round((performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint') || {}).startTime ?? 0),
    lcpMs: window.__perf.lcp == null ? null : Math.round(window.__perf.lcp),
    longTaskMs: Math.round(window.__perf.longTasks.reduce((total, ms) => total + ms, 0)),
    requests: resources.length,
    transferBytes: resources.reduce((total, r) => total + (r.transferSize || 0), 0),
    scriptBytes: script.reduce((total, r) => total + (r.decodedBodySize || 0), 0),
  };
};

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};
const min = (values) => Math.min(...values);
const percentile = (values, p) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
};

async function sample(browser, origin, route){
  const context = await browser.newContext({ viewport:{ width:1440, height:1000 } });
  await context.addInitScript(INIT);
  const page = await context.newPage();
  const started = Date.now();
  await page.goto(origin + route.path, { waitUntil:'load', timeout:60000 });
  await page.waitForSelector(route.ready, { state:'visible', timeout:60000 });
  /* `visible` means a layout box exists, not that a frame has been painted. */
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  const readyMs = Date.now() - started;
  const metrics = await page.evaluate(COLLECT);
  await context.close();
  return { readyMs, ...metrics };
}

const kilobyte = (bytes) => (bytes / 1024).toFixed(0);
const ms = (value) => Math.round(value ?? 0);

async function main(){
  const servers = [await serve(A_DIR, PORT_A), await serve(B_DIR, PORT_B)];
  const browser = await chromium.launch({ channel:'chromium' });
  const results = {};
  try {
    for (const route of ROUTES){
      results[route.id] = { a:[], b:[] };
      for (let run = 0; run < RUNS; run++){
        results[route.id].a.push(await sample(browser, `http://127.0.0.1:${PORT_A}`, route));
        results[route.id].b.push(await sample(browser, `http://127.0.0.1:${PORT_B}`, route));
      }
      process.stdout.write(`  ${route.id} … done\n`);
    }
  } finally {
    await browser.close();
    servers.forEach(server => server.close());
  }

  console.log(`\nA: ${A_DIR}\nB: ${B_DIR}\n${RUNS} cold repetitions each, alternating, identity encoding\n`);
  console.log('route        build   ready med (p25–p75)   LCP   FCP   long tasks   req   JS decoded');
  for (const [id, { a, b }] of Object.entries(results)){
    for (const [label, samples] of [['A', a], ['B', b]]){
      const take = (key) => samples.map(s => s[key]);
      console.log(
        id.padEnd(12), label.padEnd(6),
        `${String(ms(median(take('readyMs')))).padStart(5)} (${percentile(take('readyMs'), 0.25)}–${percentile(take('readyMs'), 0.75)})`.padEnd(16),
        String(ms(median(take('lcpMs')))).padStart(6),
        String(ms(median(take('fcpMs')))).padStart(5),
        String(ms(median(take('longTaskMs')))).padStart(11),
        String(median(take('requests'))).padStart(5),
        String(kilobyte(median(take('scriptBytes')))).padStart(11) + ' kB');
    }
    const delta = ms(median(b.map(s => s.readyMs))) - ms(median(a.map(s => s.readyMs)));
    console.log(`             Δ ready ${delta > 0 ? '+' : ''}${delta} ms, ` +
      `Δ JS ${kilobyte(median(b.map(s => s.scriptBytes)) - median(a.map(s => s.scriptBytes)))} kB\n`);
  }
  console.log('Transfer sizes are uncompressed: compare them between builds, not with the network tab.');
}

main().catch(error => {
  console.error('A/B failed:', error?.message ?? error);
  process.exit(1);
});
