#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   WHAT IT COSTS TO OPEN A DEEPER SECTION, BEFORE AND AFTER THE SPLIT.

     node scripts/perf/measure-sections-nav.mjs --a tmp/p1c-before-dist --b dist \
          --markets gb,ie,pl,ro --runs 6 --out perf/p1c-sections-nav.json

   ab-compare.mjs measures whole page loads. This measures the other movement:
   a reader who has the brief open and CLICKS into the Market Story tab. Before
   a split the two sections are already parsed; after it, the loader fetches
   their chunks. That is the cost the split adds, and it is the number a
   first-load measurement alone cannot show.

   Both builds are served by the same static-server code with no-store, and the
   same browser runs them alternately, rep by rep, so a machine that warms up
   over the run warms both equally. Identity encoding: transfer sizes are an
   upper bound and are only compared between builds.

   A diagnostic. It is never imported by the site.
   --------------------------------------------------------------------------- */
import { createServer } from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const A_DIR = option('--a', null);
const B_DIR = option('--b', 'dist');
const RUNS = Math.max(1, Number(option('--runs', 6)));
const MARKETS = (option('--markets', 'gb,ie,pl,ro') || '').split(',').map(s => s.trim()).filter(Boolean);
const OUT = option('--out', null);
const PORT_A = Number(option('--port-a', 4201));
const PORT_B = Number(option('--port-b', 4202));
const SLUGS = { gb:'great-britain', ie:'ireland', pl:'poland', ro:'romania', nem:'nem' };

if (!A_DIR){ console.error('usage: node scripts/perf/measure-sections-nav.mjs --a <baseline-dist> [--b dist]'); process.exit(1); }

const MIME = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.woff2':'font/woff2', '.ico':'image/x-icon' };

function serve(root, port){
  const server = createServer(async (request, response) => {
    const url = decodeURIComponent(request.url.split('?')[0]);
    let file = path.join(root, url);
    try {
      const info = await stat(file).catch(() => null);
      if (!info || info.isDirectory()) file = path.join(root, 'index.html');
      const body = await readFile(file);
      response.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store' });
      response.end(body);
    } catch { response.writeHead(404); response.end('not found'); }
  });
  return new Promise(resolve => server.listen(port, '127.0.0.1', () => resolve(server)));
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

/** One brief-to-Market-Story navigation, on a cold context. */
async function sample(browser, origin, slug, id){
  const context = await browser.newContext({ viewport:{ width:1440, height:1000 } });
  const page = await context.newPage();
  const asked = [];
  page.on('request', request => {
    const m = new RegExp(`/assets/section-${id}-([a-z]+)-[^/]+\\.js$`).exec(request.url());
    if (m) asked.push(m[1]);
  });

  const started = Date.now();
  await page.goto(`${origin}/markets/${slug}/case`, { waitUntil:'load', timeout:60000 });
  await page.waitForSelector('.tab-section[data-section="case"] .sect', { state:'visible', timeout:60000 });
  const briefReadyMs = Date.now() - started;
  const onBrief = [...asked];

  const clicked = Date.now();
  await page.locator('a.tab-btn', { hasText: 'Market Story' }).first().click();
  await page.waitForSelector('[data-section="home"]', { state:'visible', timeout:60000 });
  await page.waitForSelector('[data-section="story"]', { state:'visible', timeout:60000 });
  const deepSectionMs = Date.now() - clicked;
  const onDeep = asked.slice(onBrief.length);

  await context.close();
  return {
    briefReadyMs, deepSectionMs,
    briefRequests: onBrief.length, deepRequests: onDeep.length,
    totalRequests: asked.length,
    deepIds: [...new Set(onDeep)].sort(),
  };
}

async function main(){
  const servers = [await serve(A_DIR, PORT_A), await serve(B_DIR, PORT_B)];
  const browser = await chromium.launch({ channel:'chromium' });
  const results = {};
  try {
    for (const id of MARKETS){
      const slug = SLUGS[id];
      if (!slug) throw new Error(`no slug for ${id}`);
      results[id] = { a:[], b:[] };
      for (let run = 0; run < RUNS; run++){
        results[id].a.push(await sample(browser, `http://127.0.0.1:${PORT_A}`, slug, id));
        results[id].b.push(await sample(browser, `http://127.0.0.1:${PORT_B}`, slug, id));
      }
      process.stdout.write(`  ${id} … done\n`);
    }
  } finally {
    await browser.close();
    servers.forEach(server => server.close());
  }

  const take = (samples, key) => samples.map(s => s[key]);
  const report = {};
  console.log(`\nA: ${A_DIR}\nB: ${B_DIR}\n${RUNS} cold repetitions each, alternating, identity encoding\n`);
  console.log('market  build   brief ready   deep section   section reqs (brief / deep / total)');
  for (const [id, { a, b }] of Object.entries(results)){
    report[id] = {};
    for (const [label, samples] of [['A', a], ['B', b]]){
      const entry = {
        briefReadyMs: median(take(samples, 'briefReadyMs')),
        deepSectionMs: median(take(samples, 'deepSectionMs')),
        briefRequests: median(take(samples, 'briefRequests')),
        deepRequests: median(take(samples, 'deepRequests')),
        totalRequests: median(take(samples, 'totalRequests')),
        deepIds: samples[samples.length - 1].deepIds,
      };
      report[id][label === 'A' ? 'before' : 'after'] = entry;
      console.log(
        id.padEnd(7), label.padEnd(6),
        String(entry.briefReadyMs).padStart(11),
        String(entry.deepSectionMs).padStart(14),
        `${String(entry.briefRequests).padStart(19)} / ${String(entry.deepRequests).padStart(4)} / ${String(entry.totalRequests).padStart(5)}`);
    }
    const delta = report[id].after.deepSectionMs - report[id].before.deepSectionMs;
    console.log(`        Δ deep section ${delta > 0 ? '+' : ''}${delta} ms, ` +
      `Δ brief ready ${report[id].after.briefReadyMs - report[id].before.briefReadyMs > 0 ? '+' : ''}` +
      `${report[id].after.briefReadyMs - report[id].before.briefReadyMs} ms\n`);
  }
  console.log('Wall-clock on an unthrottled localhost is precise to about ±150 ms; read the request counts and the build sizes for the durable claim.');
  if (OUT){
    await writeFile(OUT, JSON.stringify({ a:A_DIR, b:B_DIR, runs:RUNS, markets:report }, null, 2) + '\n');
    console.log(`\nwrote ${OUT}`);
  }
}

main().catch(err => { console.error('navigation measurement failed:', err?.message ?? err); process.exit(1); });
