#!/usr/bin/env node
/*
 * Read-only reachability check for the public sources behind the interactive
 * grid maps. It never publishes data and never writes into src/. Run it before
 * a research refresh to find moved, retired or access-controlled URLs.
 */
import { GRID_MAPS } from '../src/markets/gridMapRegistry.js';

const timeoutMs = Number(process.env.GRID_SOURCE_TIMEOUT_MS || 15000);
const marketArg = process.argv.find(arg => arg.startsWith('--market='));
const marketId = marketArg?.split('=')[1] || null;
const json = process.argv.includes('--json');

const maps = marketId
  ? GRID_MAPS.filter(map => map.id === marketId || map.id.startsWith(`${marketId}-`))
  : GRID_MAPS;

if (!maps.length){
  console.error(`No grid map matched "${marketId}".`);
  process.exit(2);
}

async function request(url, method){
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method,
      redirect:'follow',
      headers:{
        'user-agent':'Mozilla/5.0 (compatible; BESS-Research-Platform/1.0; public-source-verifier)',
        accept:'text/html,application/pdf,application/json;q=0.9,*/*;q=0.8',
      },
      signal:controller.signal,
    });
    await response.body?.cancel();
    return { status:response.status, finalUrl:response.url };
  } finally {
    clearTimeout(timer);
  }
}

async function check(source, mapId){
  const started = Date.now();
  try {
    let result;
    try {
      result = await request(source.url, 'HEAD');
    } catch {
      result = await request(source.url, 'GET');
    }
    if (result.status >= 400) result = await request(source.url, 'GET');
    const reachable = result.status >= 200 && result.status < 400;
    const manualReview = !reachable
      && source.automation !== 'A'
      && [403, 405, 406, 429, 501].includes(result.status);
    const gate = reachable ? 'pass' : manualReview ? 'warn' : 'fail';
    return {
      mapId, sourceId:source.id, owner:source.owner, automation:source.automation,
      url:source.url, finalUrl:result.finalUrl, status:result.status,
      reachable, manualReview, gate, ok:gate !== 'fail',
      elapsedMs:Date.now() - started,
      error:reachable ? null : `HTTP ${result.status}`,
    };
  } catch (error){
    const timedOut = error?.name === 'AbortError';
    const manualReview = source.automation !== 'A'
      && (timedOut || error?.message === 'fetch failed');
    return {
      mapId, sourceId:source.id, owner:source.owner, automation:source.automation,
      url:source.url, finalUrl:null, status:null,
      reachable:false, manualReview, gate:manualReview ? 'warn' : 'fail',
      ok:manualReview,
      elapsedMs:Date.now() - started,
      error:timedOut ? `timeout after ${timeoutMs} ms` : error.message,
    };
  }
}

const queue = maps.flatMap(map => map.sourceCatalog.map(source => ({ mapId:map.id, source })));
const results = [];
const concurrency = Math.min(4, queue.length);
let cursor = 0;

async function worker(){
  while (cursor < queue.length){
    const job = queue[cursor++];
    results.push(await check(job.source, job.mapId));
  }
}

await Promise.all(Array.from({ length:concurrency }, worker));
results.sort((a, b) => a.mapId.localeCompare(b.mapId) || a.sourceId.localeCompare(b.sourceId));

if (json){
  process.stdout.write(`${JSON.stringify({
    checkedAt:new Date().toISOString(), timeoutMs, results,
  }, null, 2)}\n`);
} else {
  for (const result of results){
    const mark = result.gate === 'pass' ? 'ok  ' : result.gate === 'warn' ? 'WARN' : 'FAIL';
    const status = result.status ?? result.error;
    process.stdout.write(
      `${mark} ${result.mapId.padEnd(20)} ${result.automation} ${String(status).padEnd(8)} ` +
      `${result.sourceId} (${result.elapsedMs} ms)\n`,
    );
  }
  const passed = results.filter(result => result.gate === 'pass').length;
  const warnings = results.filter(result => result.gate === 'warn').length;
  const failed = results.filter(result => result.gate === 'fail').length;
  process.stdout.write(
    `\n${passed}/${results.length} public grid-map sources automatically reachable; ` +
    `${warnings} manual-public warnings; ${failed} failures.\n`,
  );
}

if (results.some(result => result.gate === 'fail')) process.exit(1);
