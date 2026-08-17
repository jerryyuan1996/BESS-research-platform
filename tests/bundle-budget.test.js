/* ---------------------------------------------------------------------------
   BUNDLE BUDGETS.

   Code splitting is not a change you make once. It is a property that decays:
   one ordinary-looking import from a market module into a shared one pulls that
   market's whole graph back into the entry chunk, the site still works, every
   other test still passes, and the only visible symptom is that the first page
   view got slower. Nobody notices that in review.

   So the property is asserted. Three claims, in increasing order of strength:

     1. The entry chunk fits its budget. This is what a visitor downloads before
        anything renders, and it is the number that matters.
     2. Each split market has its own chunk, within its own budget.
     3. THE SPLIT IS REAL. Market-specific payloads must be absent from the entry
        chunk — not merely also present in a market chunk. A duplicated module
        satisfies (1) and (2) while shipping the bytes twice, and this is the
        assertion that catches it.

   MEASURED IN GZIP, because that is what crosses the network. Raw size is a
   diagnostic; it is not what the reader waits for. Both are reported on failure
   so a regression can be understood without a rebuild.

   Budgets are set a little above current so ordinary growth does not fail the
   build, and are meant to be RATCHETED DOWN as more markets are split. A budget
   that is never tightened stops being a budget. When one has to go up, that is a
   decision with a reason, and the reason belongs in the commit message.

   Skips without dist/, for the same reason and with the same escape hatch as
   the confidentiality guard: `npm test` must not require a build, and CI sets
   REQUIRE_OUTPUT=1 after building so the skip is unreachable there.
   --------------------------------------------------------------------------- */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCAN_REL = process.env.SCAN_DIR || 'dist';
const DIST = path.resolve(REPO, SCAN_REL);
const REQUIRE_OUTPUT = process.env.REQUIRE_OUTPUT === '1';

const kB = (bytes) => Math.round(bytes / 1024 * 100) / 100;

/**
 * Budgets in gzipped kB, as Vite reports them (1 kB = 1000 bytes).
 *
 * `entry` is the whole first-load cost: the application shell, the home cockpit,
 * and every market's manifest and comparison interface. It does NOT include any
 * market's dashboard, sections, data or grid map — all fourteen load on demand.
 *
 * Ratcheted from 1290 to 320 when the remaining ten markets were split. Measured
 * 296.52; the headroom is for ordinary growth in the shell and the comparison
 * interfaces, not for a market leaking back in.
 */
const BUDGET = {
  entry: 320,

  /* Per-market chunks, ~12% above measured. Roughly proportional to how much
     analysis each market carries: WA is the largest because it is the one
     hand-written dashboard, with its own optimiser, BRCP engine and export
     layer that the shared block engine does not have. */
  markets: {
    caiso: 44, ercot: 59, de: 64, pjm: 65, it: 75, ro: 95,
    pl: 101, jp: 127, nem: 132, gb: 144, ie: 149, wa: 207,
  },

  /* Chunks Rollup factors out because several market chunks share them. They
     are NOT part of the first load — a visitor who never opens a market page
     never fetches them — but the first market visit pays for whichever it
     needs, so they belong in the accounting. */
  shared: { engine: 15, metrics: 12, sourceDrawer: 17 },
};

/** Every registered market must have its own chunk. Twelve dashboards, three of
 *  which Japan shares across its three allocation points. */
const EXPECTED_MARKET_CHUNKS = 12;

/**
 * Strings that must NOT appear in the entry chunk.
 *
 * One per split market, chosen to be specific to the part that should have
 * moved — a grid map id rather than a market name, because the name legitimately
 * appears in the manifest and comparison interface, which are eager on purpose.
 * A false positive here would push someone into loosening the test, so the probe
 * has to be something with exactly one home.
 */
const MUST_NOT_BE_IN_ENTRY = {
  wa: 'wa-grid-map',
  nem: 'nem-grid-map',
  gb: 'gb-grid-map',
  de: 'de-grid-map',
  it: 'it-grid-map',
  ie: 'ie-grid-map',
  ro: 'ro-grid-map',
  pl: 'pl-grid-map',
  jp: 'jp-tokyo-grid-map',
  pjm: 'pjm-grid-map',
  ercot: 'ercot-grid-map',
  caiso: 'caiso-grid-map',
};

function skipWithoutDist(t){
  if (existsSync(DIST)) return false;
  assert.ok(!REQUIRE_OUTPUT,
    `REQUIRE_OUTPUT=1 but ${SCAN_REL}/ is absent, so no budget was checked.`);
  t.skip(`${SCAN_REL}/ not present — run "npm run build" first`);
  return true;
}

/** The JavaScript in the output directory, by role. */
async function chunks(){
  const dir = path.join(DIST, 'assets');
  const files = (await readdir(dir)).filter(f => f.endsWith('.js'));

  const out = { entry: null, markets: new Map(), other: [] };
  for (const name of files){
    const buf = await readFile(path.join(dir, name));
    const entry = { name, raw: buf.length, gzip: gzipSync(buf).length, text: buf.toString('utf8') };

    /* NON-GREEDY, and the hash is matched by length rather than by charset.
       Vite's hash alphabet includes `-`, so a chunk can be emitted as
       `market-ro--LSUnJfT.js` — market id, separator, then a hash whose first
       character is another dash. A greedy `[a-z0-9-]+` captures `ro-` from that
       and the market silently goes missing from this accounting, which is how
       this test first reported twelve chunks as ten. */
    const market = /^market-(.+?)-[A-Za-z0-9_-]{8}\.js$/.exec(name);
    if (market) out.markets.set(market[1], entry);
    else if (/^index-[^.]+\.js$/.test(name)) out.entry = entry;
    else out.other.push(entry);
  }
  return out;
}

test('the entry chunk is within its budget', async (t) => {
  if (skipWithoutDist(t)) return;
  const { entry } = await chunks();

  assert.ok(entry, `no index-*.js in ${SCAN_REL}/assets — the entry chunk was not found`);
  assert.ok(kB(entry.gzip) <= BUDGET.entry,
    `the entry chunk is ${kB(entry.gzip)} kB gzipped (${kB(entry.raw)} kB raw), over its ` +
    `${BUDGET.entry} kB budget.\n` +
    'This is what every visitor downloads before anything renders. The usual cause\n' +
    'is a new static import from a market module into something the shell already\n' +
    'loads, which pulls that market\'s whole graph back in. Check what changed in\n' +
    'src/markets/registry.js, gridMapRegistry.js or congestionRegistry.js first.');
});

test('every market loads its dashboard on demand', async (t) => {
  if (skipWithoutDist(t)) return;
  const { markets } = await chunks();

  /* Not "at least one" — all of them. A market quietly reverted to a static
     import still renders correctly and still passes every other test; the only
     evidence is that its chunk stopped being emitted and the entry grew. */
  assert.equal(markets.size, EXPECTED_MARKET_CHUNKS,
    `expected ${EXPECTED_MARKET_CHUNKS} market chunks, found ${markets.size}: ` +
    `${[...markets.keys()].sort().join(', ') || 'none'}.\n` +
    'A missing chunk means that market went back to shipping in the entry bundle.\n' +
    'Check its index.js still exports loadDashboard and that nothing imports its\n' +
    'dashboard.js statically.');
});

test('the shared chunks stay out of the first load', async (t) => {
  if (skipWithoutDist(t)) return;
  const { entry, other } = await chunks();

  /* Rollup factors out what several market chunks share — the block engine, the
     source drawer, the metrics helpers. That is the right outcome: they are
     fetched once, by whichever market page is opened first, and reused. What
     would NOT be right is any of them being pulled into the entry, which is what
     happens the moment the home page imports one of them directly. */
  for (const [name, budget] of Object.entries(BUDGET.shared)){
    const chunk = other.find(c => c.name.startsWith(`${name}-`));
    assert.ok(chunk,
      `no ${name}-*.js chunk. It was either inlined into the entry — check whether\n` +
      'a home-page module started importing it — or into a single market chunk,\n' +
      'which means the markets that shared it no longer do.');
    assert.ok(kB(chunk.gzip) <= budget,
      `${chunk.name} is ${kB(chunk.gzip)} kB gzipped, over its ${budget} kB budget.`);
  }
  assert.ok(entry, 'no entry chunk');
});

test('each split market has its own chunk, within budget', async (t) => {
  if (skipWithoutDist(t)) return;
  const { markets } = await chunks();

  for (const [id, budget] of Object.entries(BUDGET.markets)){
    const chunk = markets.get(id);
    assert.ok(chunk,
      `no market-${id}-*.js chunk in ${SCAN_REL}/assets.\n` +
      `Either ${id} stopped loading its dashboard on demand — check its index.js\n` +
      'still exports loadDashboard — or something now imports its dashboard\n' +
      'statically, which merges the chunk back into the entry.');
    assert.ok(kB(chunk.gzip) <= budget,
      `market-${id} is ${kB(chunk.gzip)} kB gzipped (${kB(chunk.raw)} kB raw), over its ` +
      `${budget} kB budget.`);
  }
});

test('market payloads are absent from the entry chunk, not merely duplicated', async (t) => {
  if (skipWithoutDist(t)) return;
  const { entry, markets } = await chunks();
  assert.ok(entry, 'no entry chunk to check');

  for (const [id, probe] of Object.entries(MUST_NOT_BE_IN_ENTRY)){
    assert.ok(!entry.text.includes(probe),
      `"${probe}" is in the entry chunk, so ${id}'s payload ships to every visitor.\n` +
      'A market chunk existing is not the same as the split working: a module\n' +
      'reachable from BOTH the shell and a lazy import is emitted in both places,\n' +
      'which costs more than not splitting at all. Find the static import path\n' +
      `from the shell to src/markets/${id}/.`);

    const chunk = markets.get(id);
    assert.ok(chunk?.text.includes(probe),
      `"${probe}" is in neither the entry chunk nor market-${id}. It has not moved,\n` +
      'it has disappeared — which means this probe is stale and the test is no\n' +
      'longer checking anything. Pick a new one from what the market actually ships.');
  }
});
