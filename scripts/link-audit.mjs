/* ---------------------------------------------------------------------------
   SCHEDULED LINK-HEALTH AUDIT — reports, never blocks.

   Run on a schedule, not in a pull request. A live fetch fails for reasons that
   have nothing to do with the change under review: a publisher rate-limits, a
   runner has no egress, a government site blocks automation outright. A gate
   that goes red for reasons the author cannot fix is a gate people learn to
   ignore.

   The deterministic half — syntax, placeholders, exemptions, publisher changes —
   runs on every change in tests/source-urls.test.js. This half asks whether the
   address still resolves, and writes down what it found.

   ---------------------------------------------------------------------------
   403 IS NOT 404

   The distinction this whole script exists to preserve. Every aemo.com.au URL
   returns 403 to an automated fetch and every one of those documents is fine —
   a human opens them normally. Recording that as "missing" would send someone
   to replace a working source. A 404 or 410 means the publisher removed it,
   which is the only thing worth acting on quickly.

   ---------------------------------------------------------------------------
   LINK HEALTH IS NOT FRESHNESS

   A page can return 200 while announcing its own data is stale — the PJM serial
   queue page does exactly that, and no status code reveals it. Freshness is
   tracked in source metadata and the review records, by a person.

   ---------------------------------------------------------------------------
   ESCALATION NEEDS HISTORY, WHICH THIS DOES NOT YET KEEP

   A single failure means very little. The first real run from a restricted
   environment timed out on 128 of 185 addresses — including two that a manual
   fetch had already proved were 404 — so a one-shot result is not a health
   picture, it is a snapshot of one network. Acting on it would replace working
   sources.

   Escalation therefore requires the same address failing the same way across
   runs, and that needs a stored history this script does not have. Until it
   does, every result is informational and the report says so. Wiring a hard
   failure before the history exists would be building the alarm before the
   sensor.

     node scripts/link-audit.mjs [--json] [--only=marketId]
   --------------------------------------------------------------------------- */
import { markets } from '../src/markets/registry.js';
import { evidenceRecords } from '../src/governance/claims.js';
import { URL_EXEMPT } from '../src/governance/sourceUrls.js';

export const HEALTH = {
  HEALTHY: 'healthy',
  REDIRECTED: 'redirected',
  MISSING: 'missing',
  AUTOMATION_BLOCKED: 'automation-blocked',
  TIMEOUT: 'timeout',
  MANUAL_REVIEW: 'manual-review',
};

const TIMEOUT_MS = 10_000;
const PER_DOMAIN_DELAY_MS = 1_500;
const MAX_REDIRECTS = 5;

/** Classify one HTTP outcome. Exported so the mapping is testable without a network. */
export function classify({ status, redirected, error }){
  if (error === 'timeout') return HEALTH.TIMEOUT;
  if (error) return HEALTH.MANUAL_REVIEW;
  if (status === 404 || status === 410) return HEALTH.MISSING;
  /* 403 and 429 are the shapes of a publisher refusing a robot, not of a
     document that has gone. 401 means it is behind a login, which is also not
     removal. */
  if (status === 403 || status === 429 || status === 401) return HEALTH.AUTOMATION_BLOCKED;
  if (status >= 500) return HEALTH.MANUAL_REVIEW;
  if (status >= 200 && status < 300) return redirected ? HEALTH.REDIRECTED : HEALTH.HEALTHY;
  return HEALTH.MANUAL_REVIEW;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/** HEAD first, then a small ranged GET — some publishers refuse HEAD outright. */
async function probe(url){
  for (const method of ['HEAD', 'GET']){
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method, redirect: 'follow', signal: ac.signal,
        headers: method === 'GET' ? { Range: 'bytes=0-2047' } : {},
      });
      clearTimeout(timer);
      /* A HEAD that is refused with 405 tells us nothing; fall through to GET. */
      if (method === 'HEAD' && (res.status === 405 || res.status === 501)) continue;
      return { status: res.status, finalUrl: res.url, redirected: res.url !== url };
    } catch (err){
      clearTimeout(timer);
      if (err.name === 'AbortError') return { error: 'timeout' };
      if (method === 'GET') return { error: String(err.message || err) };
    }
  }
  return { error: 'no response' };
}

/** Every distinct URL in the platform, with the records that use it. */
export function collectUrls(only){
  const seen = new Map();
  const registers = [...new Map(markets.map(m => [m.sources, m])).values()];
  for (const m of registers){
    if (only && m.manifest.id !== only) continue;
    for (const [id, rec] of Object.entries(evidenceRecords(m))){
      const key = `${m.manifest.id}:${id}`;
      if (!rec.url){
        if (!URL_EXEMPT[key]) seen.set(key, { key, url: null });
        continue;
      }
      const entry = seen.get(rec.url) || { url: rec.url, keys: [] };
      entry.keys = entry.keys || [];
      entry.keys.push(key);
      seen.set(rec.url, entry);
    }
  }
  return [...seen.values()].filter(e => e.url);
}

async function main(){
  const args = process.argv.slice(2);
  const asJson = args.includes('--json');
  const only = (args.find(a => a.startsWith('--only=')) || '').split('=')[1];

  const targets = collectUrls(only);
  const byDomain = new Map();
  for (const t of targets){
    const d = new URL(t.url).hostname;
    if (!byDomain.has(d)) byDomain.set(d, []);
    byDomain.get(d).push(t);
  }

  const results = [];
  /* Domains are processed in parallel, URLs within a domain in series with a
     delay. One publisher is never hit faster than that regardless of how many
     records point at it. */
  await Promise.all([...byDomain.entries()].map(async ([domain, list]) => {
    for (const [i, t] of list.entries()){
      if (i) await sleep(PER_DOMAIN_DELAY_MS);
      const out = await probe(t.url);
      results.push({
        keys: t.keys, url: t.url, domain,
        health: classify(out),
        status: out.status ?? null,
        finalUrl: out.finalUrl && out.finalUrl !== t.url ? out.finalUrl : null,
        checkedAt: new Date().toISOString().slice(0, 10),
        note: out.error || null,
      });
    }
  }));

  const counts = results.reduce((a, r) => ({ ...a, [r.health]: (a[r.health] || 0) + 1 }), {});

  if (asJson){ console.log(JSON.stringify({ counts, results }, null, 2)); return; }

  console.log('link health, ' + new Date().toISOString().slice(0, 10) +
              ' — informational, no build depends on this');
  for (const [k, v] of Object.entries(counts)) console.log('  ' + k.padEnd(20) + v);

  /* A run that mostly timed out is a report about the network, not the links.
     Saying so is the difference between a useful audit and a misleading one. */
  const timeouts = counts[HEALTH.TIMEOUT] || 0;
  if (timeouts > results.length / 3){
    console.log(['',
      '  NOTE: ' + timeouts + ' of ' + results.length + ' timed out. This run reflects',
      '  the network it ran from more than the state of the links.',
      '  Treat only the definite results below as findings.',
    ].join(String.fromCharCode(10)));
  }

  /* Only removal is worth a reader's attention at the top. */
  const gone = results.filter(r => r.health === HEALTH.MISSING);
  if (gone.length){
    console.log('\nREMOVED BY THE PUBLISHER (404/410) — these need a decision:');
    for (const r of gone) console.log('  ' + r.keys.join(', ') + '  ' + r.url);
  }
  const moved = results.filter(r => r.health === HEALTH.REDIRECTED);
  if (moved.length){
    console.log('\nREDIRECTED — the address in the register is no longer canonical:');
    for (const r of moved) console.log('  ' + r.keys.join(', ') + '\n      -> ' + r.finalUrl);
  }
  const blocked = results.filter(r => r.health === HEALTH.AUTOMATION_BLOCKED);
  if (blocked.length){
    console.log('\nAUTOMATION-BLOCKED — almost certainly fine for a human, do NOT replace:');
    for (const r of blocked) console.log('  ' + r.keys.join(', ') + '  (' + r.status + ')');
  }
}

if (import.meta.url === `file://${process.argv[1]}` ||
    process.argv[1]?.endsWith('link-audit.mjs')){
  main().catch(err => { console.error('link audit failed:', err.message); process.exit(0); });
}
