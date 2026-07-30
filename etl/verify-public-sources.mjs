#!/usr/bin/env node
/*
 * Read-only reachability check for the governed public-data source registry.
 * It never publishes data and never writes to src/. Automation A failures are
 * release failures; B/C access controls or timeouts remain visible warnings
 * because many official portals intentionally block generic clients.
 */
import { SOURCE_REGISTRY } from '../src/governance/sourceRegistry.js';

const timeoutMs = Number(process.env.PUBLIC_SOURCE_TIMEOUT_MS || 15000);
const marketArg = process.argv.find(arg => arg.startsWith('--market='));
const marketId = marketArg?.split('=')[1] || null;
const json = process.argv.includes('--json');
const sources = marketId
  ? SOURCE_REGISTRY.filter(source => source.marketId === marketId)
  : SOURCE_REGISTRY;

if (!sources.length){
  console.error(`No governed public source matched "${marketId}".`);
  process.exit(2);
}

async function request(url, method){
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method,
      redirect: 'follow',
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; BESS-Research-Platform/1.0; public-source-verifier)',
        accept: 'text/html,application/pdf,application/json,text/csv;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
    });
    await response.body?.cancel();
    return { status: response.status, finalUrl: response.url };
  } finally {
    clearTimeout(timer);
  }
}

async function check(source){
  const started = Date.now();
  try {
    let result;
    try {
      result = await request(source.canonicalUrl, 'HEAD');
    } catch {
      result = await request(source.canonicalUrl, 'GET');
    }
    if (result.status >= 400) result = await request(source.canonicalUrl, 'GET');
    const reachable = result.status >= 200 && result.status < 400;
    const manualReview = !reachable && source.automation !== 'A'
      && [401, 403, 405, 406, 429, 501].includes(result.status);
    const gate = reachable ? 'pass' : manualReview ? 'warn' : 'fail';
    return {
      sourceId: source.id, marketId: source.marketId, automation: source.automation,
      url: source.canonicalUrl, finalUrl: result.finalUrl, status: result.status,
      reachable, manualReview, gate, elapsedMs: Date.now() - started,
      error: reachable ? null : `HTTP ${result.status}`,
    };
  } catch (error){
    const timedOut = error?.name === 'AbortError';
    const manualReview = source.automation !== 'A'
      && (timedOut || error?.message === 'fetch failed');
    return {
      sourceId: source.id, marketId: source.marketId, automation: source.automation,
      url: source.canonicalUrl, finalUrl: null, status: null,
      reachable: false, manualReview, gate: manualReview ? 'warn' : 'fail',
      elapsedMs: Date.now() - started,
      error: timedOut ? `timeout after ${timeoutMs} ms` : error.message,
    };
  }
}

const results = [];
let cursor = 0;
const concurrency = Math.min(4, sources.length);
async function worker(){
  while (cursor < sources.length) results.push(await check(sources[cursor++]));
}
await Promise.all(Array.from({ length: concurrency }, worker));
results.sort((a, b) => a.marketId.localeCompare(b.marketId) || a.sourceId.localeCompare(b.sourceId));

if (json){
  process.stdout.write(`${JSON.stringify({ checkedAt: new Date().toISOString(), timeoutMs, results }, null, 2)}\n`);
} else {
  for (const result of results){
    const mark = result.gate === 'pass' ? 'ok  ' : result.gate === 'warn' ? 'WARN' : 'FAIL';
    process.stdout.write(
      `${mark} ${result.marketId.padEnd(4)} ${result.automation} ` +
      `${String(result.status ?? result.error).padEnd(12)} ${result.sourceId} (${result.elapsedMs} ms)\n`,
    );
  }
  const passed = results.filter(result => result.gate === 'pass').length;
  const warnings = results.filter(result => result.gate === 'warn').length;
  const failed = results.filter(result => result.gate === 'fail').length;
  process.stdout.write(`\n${passed}/${results.length} automatically reachable; ${warnings} manual-public warnings; ${failed} failures.\n`);
}

if (results.some(result => result.gate === 'fail')) process.exit(1);
