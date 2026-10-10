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

  /* Chunks Rollup factors out because several MARKET chunks share them. Not
     part of the first load — a visitor who never opens a market page never
     fetches them — but the first market visit pays for whichever it needs, so
     they belong in that accounting.

     A COMBINED BUDGET, NOT PER-CHUNK NAMES. The first version listed
     `sourceDrawer` by name and broke the moment the build-pathway panel was
     added: Rollup regrouped the same modules under a different chunk name and
     the test failed while the property it cared about was still true.

     FEATURE CHUNKS ARE EXCLUDED, and getting that wrong is what this comment is
     for. The dossier shell is not shared by market chunks — it is fetched only
     by /projects/*, which in a published build is a typo. Counting it here made
     the failure message ("what a first market visit pays") untrue, and would
     have pushed someone into raising a budget to accommodate bytes no market
     visitor downloads.

     RAISED FROM 55 TO 65 when Great Britain and Romania gained build pathways.
     The pathway registry is static, so its chunk carries all four markets'
     pathways — 19.7 kB gzipped, up from about 10 — and the total measured
     62.4 kB. The bytes are real and three quarters of them are another market's
     text; see the note in src/markets/buildPathwayRegistry.js for the
     alternative that was tried and why it was not taken. */
  sharedTotal: 65,

  /* Chunks belonging to one feature, fetched only on that feature's route. */
  features: {
    'dossier-shell': 8,
    /* The Investment Case and Entry sections: anchors, archetype tables, the
       view store and the ledgers. Fetched only when one of those two tabs is
       opened, on the four markets that have them. It grows with every market
       graded, so expect to raise it — but only for that reason. */
    'investment-case': 34,
  },
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
  /* The dossier shell exists only to render a 404 in a published build.
     Shipping it to every visitor so an unreachable route can say "not found"
     would be the worst version of eager loading there is. */
  'dossier shell': 'No project page exists at that address',
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

  const out = { entry: null, markets: new Map(), other: [], features: new Map() };
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
    const feature = Object.keys(BUDGET.features).find(f => name.startsWith(f + '-'));
    if (market) out.markets.set(market[1], entry);
    else if (/^index-[^.]+\.js$/.test(name)) out.entry = entry;
    else if (feature) out.features.set(feature, entry);
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
  const { entry, other, features, markets } = await chunks();
  assert.ok(entry, 'no entry chunk');

  /* Search EVERY non-entry chunk, not just the market-shared ones. The first
     version searched `other` alone and broke the moment the dossier shell was
     reclassified into its own bucket — the staleness assertion below caught it,
     which is the assertion earning its keep on its author. */
  const elsewhere = [...other, ...features.values(), ...markets.values()];

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
    assert.ok(elsewhere.some(c => c.text.includes(marker)),
      `the ${what} is in neither the entry nor any other chunk — the marker ` +
      `"${marker}" has gone stale and this assertion no longer checks anything.`);
  }

  assert.ok(other.length > 0, 'no shared chunks at all — the split has collapsed');
  const sharedGzip = other.reduce((a, c) => a + c.gzip, 0);
  assert.ok(kB(sharedGzip) <= BUDGET.sharedTotal,
    `market-shared chunks total ${kB(sharedGzip)} kB gzipped across ${other.length} files, ` +
    `over the ${BUDGET.sharedTotal} kB budget. This is what a first market visit ` +
    'pays on top of its own market chunk. Feature chunks are counted separately.');
});

test('feature chunks exist, stay out of the entry, and stay small', async (t) => {
  if (skipWithoutDist(t)) return;
  const { features } = await chunks();

  /* A feature chunk is fetched only on its own route. The dossier shell's route
     is unreachable in a published build, so every byte here is paid by a typo —
     which is the argument for keeping it tiny rather than for deleting it. */
  for (const [name, budget] of Object.entries(BUDGET.features)){
    const chunk = features.get(name);
    assert.ok(chunk,
      `no ${name}-*.js chunk. Either the feature stopped loading on demand — ` +
      'check its dynamic import — or it was inlined into the entry.');
    assert.ok(kB(chunk.gzip) <= budget,
      `${chunk.name} is ${kB(chunk.gzip)} kB gzipped, over its ${budget} kB budget.`);
  }
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

/* ---------------------------------------------------------------------------
   CSS CROSSES THE LAZY BOUNDARY TOO, AND IT IS EASIER TO MISS.

   A dynamic import splits JavaScript automatically, so a lazily-loaded module
   is obviously lazy. Its stylesheet is not: CSS reaches the bundle through
   whichever module imports it, and the natural place to put a rule — the shared
   components stylesheet — is imported eagerly from main.js. That is how the
   dossier and model-panel rules ended up in the main stylesheet: every reader
   of every market page downloaded them in order to render nothing, because the
   dossier JS is lazy and a published build contains no dossiers at all.

   Nothing about the page looked wrong, which is why this is a test rather than
   a convention.
   --------------------------------------------------------------------------- */

/** The stylesheets in the output directory, by role. */
async function styles(){
  const dir = path.join(DIST, 'assets');
  const files = (await readdir(dir)).filter(f => f.endsWith('.css'));
  const out = { main: null, lazy: [] };
  for (const name of files){
    const text = await readFile(path.join(dir, name), 'utf8');
    const entry = { name, bytes: Buffer.byteLength(text), text };
    if (/^index-[^.]+\.css$/.test(name)) out.main = entry;
    else out.lazy.push(entry);
  }
  return out;
}

/* Selectors that may appear ONLY in a lazily-loaded stylesheet. Chosen to be
   distinctive: `.ds-node` and `.dc-name` exist nowhere else, so a match is
   evidence rather than a coincidence. */
const DOSSIER_ONLY = ['.ds-node', '.ds-role', '.dc-name', '.dossier-card', '.sens-base'];

test('dossier styling stays out of the main stylesheet', async (t) => {
  if (skipWithoutDist(t)) return;
  const css = await styles();
  assert.ok(css.main, `no index-*.css in ${SCAN_REL}/assets — the main stylesheet was not found`);

  const leaked = DOSSIER_ONLY.filter(sel => css.main.text.includes(sel));
  assert.deepEqual(leaked, [],
    'these selectors are in the eagerly-loaded stylesheet and should travel with ' +
    'the dossier chunk instead. Import the rule from a module inside the lazy ' +
    'boundary — src/projects/dossier/ — rather than from src/styles/components.css.');
});

test('the dossier stylesheet exists as its own chunk', async (t) => {
  if (skipWithoutDist(t)) return;
  const css = await styles();

  /* The complement of the test above. Without this, deleting the rules
     altogether would also pass, and the styling would be silently gone. */
  const carrier = css.lazy.find(f => DOSSIER_ONLY.every(sel => f.text.includes(sel)));
  assert.ok(carrier,
    'no lazily-loaded stylesheet carries the dossier rules. They are either ' +
    'missing entirely or split across chunks; both are worse than the leak.');
  assert.ok(carrier.bytes < 8 * 1024,
    `the dossier stylesheet is ${(carrier.bytes / 1024).toFixed(1)} kB, over its 8 kB budget`);
});
