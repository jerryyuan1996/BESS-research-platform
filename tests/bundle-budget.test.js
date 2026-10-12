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
 *
 * RATCHETED FROM 320 TO 222 when the home page was inverted (investment-view
 * plan, phase 2). The home page now opens on verdicts and the old home content
 * — league table, globe, revenue stack, $1M engine — moved to /returns, which
 * is fetched on demand. Measured 312.00 before and 206.16 after. `entry` is
 * now the shell, the registry and what the Investment Lab imports, and is no
 * longer "the home cockpit": what the home page costs is `home`, below.
 *
 * MEASURED 207.18 after automation (plan phase 3): the authority table's new
 * class and its named list of methodology, the /changes route's shell and the
 * /data page's statement of the new rule. The changelog itself is not here.
 *
 * MEASURED 207.64 after the scouting tier (plan phase 4), from 207.16: the
 * /scout route's shell, one navigation link, and the /data page's statement of
 * who writes a scout card.
 */
const BUDGET = {
  entry: 222,

  /* THE HOME PAGE'S FIRST VIEW: the entry chunk plus everything the verdict
     board loads — the board itself and the method layer (anchors, investor
     tables, the view store, the ledgers). This is the number a reader arriving
     at / actually waits for, and it is the one that replaced the old `entry`
     figure of 312. Measured 252.89. It grows with every market graded.

     MEASURED 256.67 after automation (plan phase 3), from 252.94: the trigger
     validator learned `when` and `effect`, and the first rule is a record in
     Western Australia's view. The budget is unchanged.

     MEASURED 259.05 after the scouting tier (plan phase 4), from 256.66: the
     roster of nine markets, the board's scouting rows and each card's four
     calls. A card itself is not here: see `scout-page` below. The budget is
     unchanged.

     LOWERED FROM 268 TO 258 (plan phase 5), measured 243.04 from 259.06. The
     board was calling the assessment on every graded market's whole view and
     whole ledger, so the home page carried a reason in two languages for each
     grade and the forfeiture terms of each ledger item, and printed none of
     them: about five kilobytes a market, with room for one more market and
     eleven to come. It now reads a projection made at build time (grades as
     numbers, calls, amounts; see src/markets/boardProjection.js), about 0.75
     kB a market, and the whole records travel with each market's own
     dashboard. With all fifteen graded this should measure about 251; the
     budget leaves that and a little over. It still grows with every market
     graded, by the projection and no longer by the prose.

     MEASURED 249.67 WITH ALL FIFTEEN GRADED. Of the rise from 243.04, 6.2 is
     the entry chunk, which carries every market's source register and gained
     the sources opened for the ledgers and grades; the projection itself
     added 0.4. */
  home: 258,

  /* Per-market chunks, ~12% above measured. Roughly proportional to how much
     analysis each market carries: WA is the largest because it is the one
     hand-written dashboard, with its own optimiser, BRCP engine and export
     layer that the shared block engine does not have.

     FINLAND ROSE FROM 18 TO 23 when its build pathway moved into this chunk
     from the shared one. A Finland visitor downloads less overall as a result:
     the shared chunk used to carry every market's pathway, and now none.

     FINLAND 23 TO 28 AND ROMANIA 95 TO 100 (plan phase 5), for bytes that
     MOVED: a graded market's whole view and ledger now ride in its own chunk,
     registered from its dashboard, where they used to ride in a chunk the
     home page fetched. Finland measured 25.39 from 22.02 and Romania 94.00
     from 89.05. Great Britain (136.79 from 131.75) and Western Australia
     (192.68 from 186.37) took the same move inside the room they had. A
     market graded later brings about five kilobytes with it, and that is the
     one reason to raise its line.

     ALL FIFTEEN ARE GRADED NOW and no other line needed raising: each of the
     ten markets graded in phase 5 took its view and ledger inside the room it
     had. Three are close: caiso 41.81 of 44, de 61.25 of 64, pjm 61.29 of
     65. */
  markets: {
    fi: 28, caiso: 44, ercot: 59, de: 64, pjm: 65, it: 75, ro: 100,
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

     COUNTED FROM THE IMPORT GRAPH SINCE THE HOME INVERSION, not as "every chunk
     nobody named". Once /returns and the verdict board became lazy, Rollup began
     factoring out chunks that no market fetches (the method layer, shared by
     the board and the Investment Case tab), and the leftover bucket stopped
     meaning "what a market visit pays". It is now exactly that: every chunk a
     market chunk statically imports, beyond the entry.

     RAISED FROM 55 TO 98 in the same change, and the reason is bytes that
     MOVED, not bytes that were added. The chart library and three boundary
     files (Japan's zones, 34 kB, and two US state outlines) used to ride in the
     entry chunk because the home page's globe and charts needed them. The home
     page no longer does, so markets now fetch them as shared chunks. Measured
     42.85 before and 89.96 after; over the same change the entry fell by 106,
     so the worst market visit (Japan) went from 464 to 401 kB in total. */
  sharedTotal: 98,

  /* Chunks belonging to one feature, fetched only on that feature's route. */
  features: {
    'dossier-shell': 8,
    /* The Investment Case and Entry sections: anchors, archetype tables, the
       view store and the ledgers. Fetched only when one of those two tabs is
       opened, on the four markets that have them. It grows with every market
       graded, so expect to raise it — but only for that reason.

       RAISED FROM 34 TO 36 when the Great Britain and Romania ledgers were
       filled: seven new items, each with its release and forfeiture terms in
       two languages. Measured 34.63 on CI, which builds the merge with the
       base branch, and 33.68 locally.

       RAISED FROM 36 TO 39 for the held layer: the effective-grade function,
       its validator and the page text that prints a practitioner view beside
       the sourced grade. Measured 36.55 locally. No market data was added.

       LOWERED FROM 39 TO 8 at the home inversion, because the chunk split in
       two. The home page's verdict board needs the same method layer, so Rollup
       moved it into a chunk both share, named `investment-method` below. What
       is left here is the two panels' own rendering. Measured 5.20.

       RAISED FROM 8 TO 10 (plan phase 5) for the entry-adjusted return: the
       module that computes its four lines and the card that prints them, in
       two languages. Measured 8.36 from 5.32. No market data is in it. */
    'investment-case': 10,
    /* The method layer itself: anchors, the four investors' tables, the view
       store and the ledgers. Fetched by the home page's board and by the
       Investment Case and Entry tabs, whichever comes first. This is where the
       old `investment-case` budget went, and it is the one that grows with
       every market graded. Measured 33.93 — the remainder of the 37.35 that
       chunk measured before the split, less the panels and the chart helpers.

       LOWERED FROM 37 TO 17 (plan phase 5). It measures 14.68 and holds no
       market at all: the views and ledgers had already been factored into a
       chunk of their own beside it, which no line here named, and have now
       left the home page altogether. What remains is method, anchors and
       investor tables, and it grows only when the method does. */
    'investment-method': 17,
    /* The home page's board, map, calendar and changes panel. Measured 11.35.

       RAISED FROM 14 TO 27 (plan phase 5), and the home budget above fell by
       more in the same change. The board projection lives here now: every
       graded market's grades, calls and ledger amounts, and every trigger.
       Measured 15.36 with four markets graded, from 12.05 with none of it;
       about 0.75 kB a market, so about 24 at fifteen. Raise it for a market
       graded and for nothing else.

       LOWERED FROM 27 TO 19 once all fifteen were graded: it measures 15.80,
       not the 24 estimated. A market's grades and calls compress far better
       beside fourteen others of the same shape than the first four suggested. */
    'verdict-board': 19,
    /* The old home page, now at /returns: market cards, globe, league table,
       revenue stack, $1M engine, congestion, plus the two sections that were
       written and never mounted. Measured 67.95. Fetched only on that route. */
    'returns': 74,
    /* The /changes page with the whole changelog: every line, with the record
       before and after it. Fetched only on that route — the home page carries
       ten lines of five fields each and nothing else of it. Measured 20.63 at
       102 lines, about 0.2 kB a line, so this is the one budget here that
       grows by design: raise it as the changelog grows, and for no other
       reason. tests/changes.test.js asserts the changelog is in no other chunk.

       RAISED FROM 27 TO 48 (plan phase 5), for that reason: grading the other
       eleven markets took the changelog from 102 lines to 304. Measured 40.67,
       about 0.13 kB a line. */
    'changes': 48,
    /* The /scout page with every scout card whole: facts with their
       quotations, a reason in two languages for each grade, four verdicts.
       Fetched only on that route — the home page carries each card's four
       calls and nothing else of it.

       MEASURED 4.92 WITH NO CARD WRITTEN, which is the page alone. The budget
       is set for nine full cards and not for today, on purpose: a card is
       written by the agent in CI and published by the commit that writes it,
       so a budget that had to be raised by hand as cards arrived would fail
       the very build that publishes one. A full card is about 13 kB raw
       (twelve grades, four verdicts and ten facts, each in two languages),
       so nine are about 120 kB raw and 35 gzipped, plus the page. */
    'scout-page': 45,
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
  /* The home inversion's three lazy pieces. The first two are what the home
     page fetches after the shell; the third is the old home page, which a
     reader who came for a verdict or a market never needs. Any of them in the
     entry means homePage.js or app.js has grown a static import it must not
     have. */
  'verdict board': 'Not yet graded — ',
  'method layer': 'Utility, major IPP, state-backed sponsor',
  'returns page': 'Apples-to-apples league',
  /* The scouting page and the cards it brings. The home board prints each
     card's four calls from a digest; a card itself in the entry would mean
     the shell has grown a static import of the page. */
  'scouting page': 'What a scouting card is',
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

  /* THE ENTRY IS WHATEVER index.html LOADS, not whatever is named index-*.
     Rollup names a factored-out chunk after one of its modules, and a module
     called index.js would produce a second `index-[hash].js` beside the real
     entry. The page's own script tag is the only statement of which one a
     reader downloads first. */
  const html = await readFile(path.join(DIST, 'index.html'), 'utf8');
  const entryName = /<script[^>]+src="\/assets\/([^"]+\.js)"/.exec(html)?.[1] ?? null;

  const out = { entry: null, markets: new Map(), other: [], features: new Map(), byName: new Map() };
  for (const name of files){
    const buf = await readFile(path.join(dir, name));
    const text = buf.toString('utf8');
    /* What this chunk imports STATICALLY, and so cannot run without. A dynamic
       `import("./x.js")` is deliberately not matched: that is a chunk fetched
       later, on demand, which is the whole point of the split. */
    const imports = new Set(
      [...text.matchAll(/(?:^|[;}\n])import(?:\s*\{[^}]*\}\s*from|\s*[\w$]+\s*from|)\s*"\.\/([^"]+\.js)"/g)].map(m => m[1]));
    const entry = { name, raw: buf.length, gzip: gzipSync(buf).length, text, imports };
    out.byName.set(name, entry);

    /* NON-GREEDY, and the hash is matched by length rather than by charset.
       Vite's hash alphabet includes `-`, so a chunk can be emitted as
       `market-ro--LSUnJfT.js` — market id, separator, then a hash whose first
       character is another dash. A greedy `[a-z0-9-]+` captures `ro-` from that
       and the market silently goes missing from this accounting, which is how
       this test first reported twelve chunks as ten. */
    const market = /^market-(.+?)-[A-Za-z0-9_-]{8}\.js$/.exec(name);
    const feature = Object.keys(BUDGET.features).find(f => name.startsWith(f + '-'));
    if (market) out.markets.set(market[1], entry);
    else if (name === entryName) out.entry = entry;
    else if (feature) out.features.set(feature, entry);
    else out.other.push(entry);
  }
  return out;
}

/** A chunk and everything it statically imports, transitively: what a reader
 *  must have downloaded before that chunk can run. */
function closure(chunk, byName, seen = new Set()){
  if (!chunk || seen.has(chunk)) return seen;
  seen.add(chunk);
  for (const name of chunk.imports) closure(byName.get(name), byName, seen);
  return seen;
}

const gzipOf = (set) => [...set].reduce((a, c) => a + c.gzip, 0);

test('the entry chunk is within its budget', async (t) => {
  if (skipWithoutDist(t)) return;
  const { entry, byName } = await chunks();

  assert.ok(entry, `index.html in ${SCAN_REL}/ names no script in assets — the entry chunk was not found`);
  /* The entry and anything it statically imports. Today that is the entry
     alone; measuring the closure means a chunk Rollup later hoists out of it
     is still counted as part of the first load. */
  const first = closure(entry, byName);
  assert.ok(kB(gzipOf(first)) <= BUDGET.entry,
    `the entry chunk is ${kB(gzipOf(first))} kB gzipped (${kB(entry.raw)} kB raw), over its ` +
    `${BUDGET.entry} kB budget.\n` +
    'This is what every visitor downloads before anything renders. The usual cause\n' +
    'is a new static import from a market module into something the shell already\n' +
    'loads, which pulls that market\'s whole graph back in. Check what changed in\n' +
    'src/markets/registry.js, gridMapRegistry.js or congestionRegistry.js first.');
});

test('the home page\'s first view is within its budget', async (t) => {
  if (skipWithoutDist(t)) return;
  const { entry, features, byName } = await chunks();
  const board = features.get('verdict-board');
  assert.ok(entry && board, 'no entry chunk or no verdict-board chunk');

  const first = closure(board, byName, closure(entry, byName));
  assert.ok(kB(gzipOf(first)) <= BUDGET.home,
    `the home page's first view is ${kB(gzipOf(first))} kB gzipped across ${first.size} chunks ` +
    `(${[...first].map(c => c.name).join(', ')}), over its ${BUDGET.home} kB budget.\n` +
    'This is what a reader arriving at / waits for: the shell, the verdict board and\n' +
    'the method layer behind it. It grows when a market is graded; anything else\n' +
    'that grows it is a module the board should not be importing.');

  /* The old home page must not ride along. If the board ever imports a module
     the Returns page owns, Rollup makes the Returns chunk a static dependency
     and the inversion has quietly been undone. */
  const returns = features.get('returns');
  assert.ok(returns, 'no returns chunk');
  assert.ok(!first.has(returns), 'the Returns page is being loaded with the home page');

  /* Nor may the scout cards. The board prints nine scouting rows from each
     card's four calls; the cards, their quotations and the source list stay
     in the /scout chunk. A marker from each, so this cannot pass by the page
     having been renamed. */
  const scout = features.get('scout-page');
  assert.ok(scout, 'no scout-page chunk');
  assert.ok(!first.has(scout), 'the scouting page is being loaded with the home page');
  for (const marker of ['What a scouting card is', 'svk.se/en/', 'legal-notice-privacy-policy']){
    assert.ok(scout.text.includes(marker), `the marker "${marker}" has gone stale`);
    for (const chunk of first) assert.ok(!chunk.text.includes(marker), `${chunk.name}: carries "${marker}", which belongs to the scouting page`);
  }

  /* Nor may a market's words. The board reads a projection (grades as
     numbers, calls, amounts), and the reason behind a grade and the terms on
     which a security is lost stay in that market's own chunk. One marker of
     each kind, held to exist there so this cannot pass by a sentence having
     been reworded. */
  const { markets } = await chunks();
  const WORDS = {
    gb: 'Zonal pricing was rejected in 2025',
    ro: 'does not return the signed allocation contract',
  };
  for (const [id, marker] of Object.entries(WORDS)){
    assert.ok(markets.get(id)?.text.includes(marker), `the marker "${marker}" has gone stale, or ${id} no longer carries its own view and ledger`);
    for (const chunk of first) assert.ok(!chunk.text.includes(marker), `${chunk.name}: carries "${marker}", which belongs to ${id}'s dashboard: a home-page module is importing whole views or ledgers again`);
  }
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
  const { entry, other, features, markets, byName } = await chunks();
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
  /* What market chunks statically import, beyond the entry and beyond the
     market chunks themselves. Read from the import graph, so a chunk that only
     the home page or the Returns page fetches is not charged to a market
     visit. */
  const first = closure(entry, byName);
  const marketChunks = new Set(markets.values());
  const shared = new Set();
  for (const chunk of marketChunks){
    for (const dep of closure(chunk, byName)){
      if (!first.has(dep) && !marketChunks.has(dep)) shared.add(dep);
    }
  }
  assert.ok(shared.size > 0, 'no market imports a shared chunk — the split has collapsed');
  const sharedGzip = gzipOf(shared);
  assert.ok(kB(sharedGzip) <= BUDGET.sharedTotal,
    `market-shared chunks total ${kB(sharedGzip)} kB gzipped across ${shared.size} files ` +
    `(${[...shared].map(c => c.name).join(', ')}), ` +
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
