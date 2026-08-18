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
 * 296.52 then, 304.35 after Finland registered — a fifteenth market costs about
 * 8 kB on the home page instead of the ~100 kB it would have before the split,
 * which is the clearest single measure of what the split bought. The headroom is
 * for that kind of growth, not for a market leaking back in.
 */
const BUDGET = {
  entry: 320,

  /* Per-market chunks, ~12% above measured. Roughly proportional to how much
     analysis each market carries: WA is the largest because it is the one
     hand-written dashboard, with its own optimiser, BRCP engine and export
     layer that the shared block engine does not have. */
  markets: {
    fi: 18, caiso: 44, ercot: 59, de: 64, pjm: 65, it: 75, ro: 95,
    pl: 101, jp: 127, nem: 132, gb: 144, ie: 149, wa: 207,
  },

  /* Chunks Rollup factors out because several market chunks share them. They
     are NOT part of the first load — a visitor who never opens a market page
     never fetches them — but the first market visit pays for whichever it
     needs, so they belong in the accounting.

     A COMBINED BUDGET, NOT PER-CHUNK NAMES. The first version listed
     `sourceDrawer` by name and broke the moment the build-pathway panel was
     added: Rollup regrouped the same modules under a different chunk name, and
     the test failed while the property it cared about was still true. Chunk
     names are Rollup's business. What matters is that the shared code exists
     outside the entry and stays within a total. */
  sharedTotal: 55,
};

/** Every registered market must have its own chunk. Thirteen dashboards for
 *  fifteen allocation points — Japan shares one across its three. */
const EXPECTED_MARKET_CHUNKS = 13;

/**
 * Shared modules that must live OUTSIDE the entry chunk, identified by a marker
 * in their own output rather than by the chunk that happens to hold them.
 *
 * This is the assertion the per-chunk-name version was really trying to make:
 * a home-page import of any of these pulls it into the first load, which is the
 * regression worth catching. Which shared chunk it lands in is not.
 */
const SHARED_OUT_OF_ENTRY = {
  /* Markers must be STRING LITERALS, not identifiers. `createMarketEngine` was
     the first attempt and it fails for a reason worth remembering: minification
     renames functions, so an identifier-based probe silently matches nothing and
     the assertion below is what catches that rather than a false pass. */
  'source drawer': 'source-drawer',
  'block engine': 'Model version: ',
  'build pathway': 'How a project actually gets built here',
};

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
  fi: 'fi-grid-map',
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
  assert.ok(entry, 'no entry chunk');

  /* Rollup factors out what several market chunks share — the block engine, the
     source drawer, the pathway panel. That is the right outcome: fetched once by
     whichever market page is opened first, then reused. What would NOT be right
     is any of them being pulled into the entry, which is what happens the moment
     a home-page module imports one directly. */
  for (const [what, marker] of Object.entries(SHARED_OUT_OF_ENTRY)){
    assert.ok(!entry.text.includes(marker),
      `the ${what} is in the entry chunk, so every visitor downloads it. ` +
      'Something on the home page now imports it directly; shared market code ' +
      'belongs in a shared chunk, fetched on the first market visit.');
    assert.ok(other.some(c => c.text.includes(marker)),
      `the ${what} is in neither the entry nor a shared chunk — the marker ` +
      `"${marker}" has gone stale and this assertion no longer checks anything.`);
  }

  assert.ok(other.length > 0, 'no shared chunks at all — the split has collapsed');
  const sharedGzip = other.reduce((a, c) => a + c.gzip, 0);
  assert.ok(kB(sharedGzip) <= BUDGET.sharedTotal,
    `shared chunks total ${kB(sharedGzip)} kB gzipped across ${other.length} files, ` +
    `over the ${BUDGET.sharedTotal} kB budget. This is what a first market visit ` +
    'pays on top of its own market chunk.');
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
