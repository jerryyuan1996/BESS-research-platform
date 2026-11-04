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
 *
 * RAISED 222 TO 232 for Ontario (2026-10-23): its comparison interface, source
 * register, congestion register and decision profile. Measured 219.36 at
 * 9549dd6 and 229.60 with Ontario, +10.24 — Finland's entry cost about 8.
 */
const BUDGET = {
  // 2026-10-17: Investment Lab now loads on its route. Move 67 kB of
  // allowance from the entry to shared dependencies, keeping the combined
  // entry + shared cap at 326 kB. Measured entry 145.8, shared 162.45.
  // 2026-10-23: Ontario registered as the sixteenth market. Measured 156.75 after
  // merging main (its comparison, source, congestion and decision-profile modules).
  // 2026-10-29: Saudi Arabia and Spain registered. Measured 156.63 at b56738e and
  // 167.98 with both, +11.35 for two markets (Ontario alone was +10.24).
  entry: 170,

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
  // 2026-10-19: buyer reference prices, timing and paired return targets for
  // 15 markets × investor/stage. Pooling assumptions halves the new payload
  // (25.1 -> 12.5 kB gzip); allow 15 kB for this additional first-view content.
  // 213.9 KiB measured with the third reference case, its provenance and
  // actionable construction conditions; calculator/engine remain lazy.
  // 2026-10-23: 227.23 measured after merging main, with Ontario and the merchant-
  // lines plays in the briefing.
  // 23 Oct: the play-specific investor action sheet, inline cost/contract
  // explanations and local comparison add ~1.1 KiB over the previous 230 cap.
  // Measured 231.02 KiB; keep a small, explicit allowance for the new UI.
  // 2026-10-28: 238.94 kB measured with the shared 20-year after-tax
  // projections, project Capex/RTB facts and country-watermark presentation.
  // 2026-10-29: 245.00 kB measured with the levered equity return, its debt
  // sizing (src/acquisition/leverage.js), the two-layer target test, the second
  // US supply case and Japan's core-CPI path. Small explicit allowance.
  // 2026-10-29: 245.68 kB at b56738e and 254.88 with Saudi Arabia and Spain,
  // +9.20, most of it their entry-chunk cost above.
  // PR68 investor review: baseline measured 254.88; worst investor first view
  // measured 262.41 after per-investor data splitting (including awaited data).
  home: 265,

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
     65.

     FINLAND 28 TO 40 (2026-10-17), for content it did not have: brought to
     parity with the other dashboards when it entered the engine — signal
     cards, the timeline, the reserve derivation, the design answer, the grid
     map and congestion register on its tab, the transactions, the Lab and the
     committee gates. Measured 36.7, still the smallest market chunk.

     ONTARIO 28 (2026-10-23), the sixteenth market, ungraded: measured 22.8.

     SAUDI ARABIA 16 AND SPAIN 20 (2026-10-29), ungraded: measured 13.79 and
     17.57. Saudi Arabia carries no Lab and no merchant derivation. */
  markets: {
    /* A market that fetches its sections per tab (docs/p1-sections-pilot.md)
       holds only its data, its source register, its view and its ledger. The
       NEM's thirteen sections left this chunk on 2026-11-04: measured 117.42
       before the pilot and 23.93 after, with the sections in chunks of their
       own under `sections` below. Ratcheted from 132 to 30 in the same change —
       the room is for the dataset, not for analysis that has drifted back in. */
    sa: 16, es: 20, ca_on: 28, fi: 40, caiso: 44, ercot: 59, de: 64, pjm: 65, it: 75, ro: 100,
    pl: 101, jp: 127, nem: 30, gb: 144, ie: 149, wa: 207,
  },

  /* A market's sections, when it fetches them one at a time.

     This is the OTHER side of the split, and it is here so the pilot cannot
     claim a first-load win by making every visit slower: the whole of a
     market's analysis is capped, per market, at what it cost when it shipped
     in one chunk plus the cost of being in pieces. Gzip has no cross-file
     dictionary, so thirteen files compress worse than one — that overhead is
     expected, and it is the price of not sending eleven sections to a reader
     who opened the brief.

     MEASURED for the NEM on 2026-11-04: 85.73 kB across thirteen chunks, with
     the largest (the market story) at 12.35. Before the split the same content
     measured 73.13 kB inside market-nem, so opening every section costs about
     12.6 kB more than it used to and opening the landing tab costs 93 kB less.
     `section-nem-case` and `section-nem-entry` are two short pointers to the shared
     investment-case component and are not held to the floor. */
  sections: {
    nem: { total: 100, largest: 15, count: 13 },
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
     so the worst market visit (Japan) went from 464 to 401 kB in total.

     RAISED FROM 98 TO 102 for bytes that were ADDED: the design-fit sweep
     (src/comparison/designFit.js) and the duration card that reads it
     (src/markets/_shared/designFitBlock.js), decision 2 of
     docs/duration-and-route-fit-plan.md. About 3.3 kB gzipped, used by the six
     dashboards that draw a duration card. Measured 101.28 after.

     RAISED FROM 102 TO 104 for bytes that were ADDED: the design projection of
     the briefing (src/briefing/designData.js, read through
     src/markets/_shared/designAnswer.js), so the GB, WA and Japan tabs that name
     a duration say what the Brief says (guided-experience plan, PR 7). Its
     chunk is 1.63 kB gzipped. Measured 102.2 after, with the cards the page
     used to delete at runtime now gone from source.

     HELD AT 171 for the NEM section pilot (2026-11-04). Measured 170.19 before
     the change and 170.75 after: +0.56, all of it the async boundary in
     src/markets/_shared/engine.js (skeleton, failure panel, stale-render token),
     which every market that loads the engine now carries. The grid-map registry
     did not move into this budget — the NEM's section chunks load it on demand,
     so it is not in any market's static closure. The cap holds with 0.25 kB to
     spare, and that is worth knowing before the next change here.
     See docs/p1-sections-pilot.md. */
  sharedTotal: 171,

  /* Chunks belonging to one feature, fetched only on that feature's route. */
  features: {
    // Shared three-page experience, loaded after the shell. Local delivery prose
    // is charged separately after extraction from the existing market chunks.
    // 2026-10-28: direct strategy cards and overview summary loader add ~3 kB;
    // the paired model remains lazy and the total first-view budget is unchanged.
    'investor-experience': 26,
    // Independently fetched pricing data: only the active investor is awaited.
    infraFund:17, strategic:17, foreignFirstTimer:17, developer:17,
    'delivery-wa': 8,
    /* The Western Australia market story (immersive-experience plan, WP-03):
       the story shell, the isometric kit and the WA content in two languages,
       fetched only when a reader opens the story from the market page. The
       plan's ceiling for shell, content and kit together is about 40 KiB. */
    'story-wa': 40,
    'story-fi': 40,
    'story-de': 40,
    'story-gb': 40,
    'story-it': 40,
    'story-ie': 40,
    /* The Romania story: shell, kit, the fixed-vintage records, thirteen
       bilingual shots, their scenes and the signature chart. Registered but
       unreleased, so it is fetched only behind ?story=preview. */
    'story-ro': 40,
    'story-caiso': 40,
    'delivery-gb': 8,
    'delivery-fi': 6,
    'delivery-ro': 7,
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
       two languages. Measured 8.36 from 5.32. No market data is in it.

       RAISED FROM 10 TO 15 for the exposure curve (plan section 6.2): the
       module that lays a ledger along time, the chart that draws it, and the
       card that states the convention behind its time axis and lists each
       step, in two languages. Measured 13.31 from 9.62, which had already
       taken the long-life card inside the room it had. No market data is in
       it: another market's ledger is fetched as its own chunk.

       RAISED FROM 15 TO 20 for the market brief (guided-experience plan,
       PR 5): the renderer of the landing tab's brief and its labels in two
       languages. Measured 17.61 from 13.31. The briefing's figures are not in
       it: they are the shared `briefing-data` chunk below. */
    'investment-case': 20,
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
       beside fourteen others of the same shape than the first four suggested.

       RAISED FROM 19 TO 23 when the briefing content was applied (guided-
       experience plan, 2026-10-16): eighteen plays, fifteen theses and the ruled
       calls now ride in every market's projection. Measured 21.63.

       RAISED FROM 23 TO 24 (2026-10-17) with the supplier quotation and
       Finland: two score notes, restated theses and plays, Finland's priced
       play and the WA and Poland plays moved to the engine's best design.
       Measured 23.23. */
    /* 25 from 24 (2026-10-23): 24.24 at 9549dd6, already over from the
       merchant-lines work, and 24.36 with Ontario's row (+0.13). */
    'verdict-board': 26,   // 2026-10-23: 25.01 after merging main and the two regrades
    /* The briefing that opens the home page since the guided-experience plan
       (PR 4): the six answers and the home projection of the briefing — every
       investor's shortlist, the plays priced by the engine at build time, the
       catalysts, the build lines and the dated changes, in two languages. No
       engine and no market data: the build writes the briefing as a literal.
       Measured 14.44 before the first plays were written; the plays, their
       lines and actions add roughly 4. */
    'briefing-home': 20,
    /* The home projection of the briefing itself — every investor's rows, the
       plays priced at build time, the design grids, the catalysts, the build
       lines and the dated changes — shared by the home page and every market's
       brief. Measured 12.54 before the first plays were written.

       RAISED FROM 18 TO 22 when the plays were applied: measured 18.74, and
       the briefing grows with each play written, which is what it is for. */
    // The same 165 market/investor/stage references are shared by the home,
    // market brief and digest. Numeric outputs are rounded only for display.
    // Three 15/20/25-year references replace two: includes tax/lifetime
    // provenance and reverse construction limits. Packed tuples and rounded
    // display money reduce 40.61 to 36.80 KiB; no engine is loaded on home.
    'briefing-data': 42,   // 2026-10-23: 40.62 after merging main, with Ontario's rows and the new plays
    /* The analyst desk with the briefing's queue. Rollup keeps only the fields
       the desk reads. Measured 3.44. */
    'desk': 6,
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
       about 0.13 kB a line.

       RAISED FROM 48 TO 64 when the briefing content was applied: 52 analyst
       lines, each carrying a whole play, call or thesis, took it to 57.87.

       RAISED FROM 64 TO 72 with the supplier quotation (2026-10-17): 30 analyst
       lines — fourteen re-derived asset-return grades, two score notes and
       fourteen restated plays, calls and theses — took it to 68.8.

       RAISED FROM 72 TO 76 with Finland's entry to the engine: the grades
       re-ranked over fifteen, Finland's thesis and floor play, and the WA and
       Poland play moves, 441 lines in all. Measured 73.43.

       RAISED FROM 76 TO 88 (2026-10-23): 84.14 at 9549dd6 — the merchant-lines
       and Japan Round 4 changelog lines — and 84.29 with Ontario's two re-graded
       asset returns (Tokyo, the NEM). */
    // PR54's seven NEM thesis/verdict rewrites take the existing full history
    // to 89.04 KiB, independently of the new homepage. History stays intact.
    // RAISED FROM 90 TO 98 (2026-10-29): the 19 play-label lines, each carrying
    // a whole play before and after, took it to 95.48.
    // RAISED FROM 98 TO 106 (2026-10-31): the open-calls plan's 15 lines
    // (Poland, Romania, Japan and ERCOT theses, plays, calls and two triggers)
    // took it to 102.57.
    // RAISED FROM 106 TO 124 (2026-10-31): the view-text plan's 68 lines
    // (typed returns out of prose in twelve markets, dated grade reasons, ten
    // source fixes, each carrying a whole play, call or grade) took it to 120.79.
    'changes': 124,
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
const EXPECTED_MARKET_CHUNKS = 16;   // 16 since Saudi Arabia and Spain, 2026-10-29

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
  /* The NEM's probe moved from its grid-map id to a phrase from one of its
     sections when the sections were split out (docs/p1-sections-pilot.md): the
     map's id now appears in the dashboard chunk as a FILENAME in Vite's
     preload manifest, which would make the assertion below pass on a string
     that carries no payload. */
  nem: 'CIS shortfall share below the floor',
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
  ca_on: 'ca_on-grid-map',
  sa: 'sa-grid-map',
  es: 'es-grid-map',
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
    /* What this chunk fetches LATER, on demand. Not part of what a reader waits
       for, which is why it is a separate set: a market's sections live here. */
    const dynamics = new Set(
      [...text.matchAll(/import\("\.\/([^"]+\.js)"\)/g)].map(m => m[1]));
    const entry = { name, raw: buf.length, gzip: gzipSync(buf).length, text, imports, dynamics };
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

/** Everything a chunk can reach, static and on demand. Used only to prove that
 *  a payload MOVED rather than vanished; a first-load assertion always uses
 *  `closure`, which stops at the dynamic boundary. */
function reachable(chunk, byName, seen = new Set()){
  if (!chunk || seen.has(chunk)) return seen;
  seen.add(chunk);
  for (const name of [...chunk.imports, ...(chunk.dynamics || [])]) reachable(byName.get(name), byName, seen);
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
  /* The three-page investment experience is now the first view. Measure its
     complete dependency closure; specialist dashboards remain on demand. */
  const briefing = features.get('investor-experience');
  const board = features.get('verdict-board');
  assert.ok(entry && briefing && board, 'no entry chunk, no investor-experience chunk or no verdict-board chunk');

  const common = closure(briefing, byName, closure(entry, byName));
  const investorData=['infraFund','strategic','foreignFirstTimer','developer'].map(id=>features.get(id));
  assert.ok(investorData.every(Boolean),'one pricing-data chunk per investor is required');
  // Count the largest awaited investor chunk even though it is dynamically loaded.
  const first=investorData.map(chunk=>closure(chunk,byName,new Set(common)))
    .sort((a,b)=>gzipOf(b)-gzipOf(a))[0];
  assert.ok(!first.has(board), 'the verdict board is being loaded with the briefing: it belongs behind the fold');
  assert.ok(kB(gzipOf(first)) <= BUDGET.home,
    `the home page's first view is ${kB(gzipOf(first))} kB gzipped across ${first.size} chunks ` +
    `(${[...first].map(c => c.name).join(', ')}), over its ${BUDGET.home} kB budget.\n` +
    'This is what a reader arriving at / waits for: the shell, the briefing and the\n' +
    'method vocabulary it labels with. It grows with plays and with markets graded;\n' +
    'anything else that grows it is a module the briefing should not be importing.');

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
  /* The third marker was REE's terms page until Spain left the roster (2026-10-29). */
  for (const marker of ['What a scouting card is', 'svk.se/en/', 'acm.nl/en/about-site']){
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
    /* In the market's chunk or one it statically imports. Romania's ledger is
       a chunk of its own beside its dashboard since the exposure curve: the
       Entry tab of another market fetches it to draw the two on shared axes.
       A Romania visit still loads it with the dashboard, and the home page
       still must not, which is the assertion after this one. */
    const own = [...closure(markets.get(id), byName)].filter(c => !first.has(c));
    assert.ok(own.some(c => c.text.includes(marker)), `the marker "${marker}" has gone stale, or ${id} no longer carries its own view and ledger`);
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
  const deliveryChunks = new Set([...features].filter(([name]) => name.startsWith('delivery-')).map(([, chunk]) => chunk));
  for (const chunk of marketChunks){
    for (const dep of closure(chunk, byName)){
      if (!first.has(dep) && !marketChunks.has(dep) && !deliveryChunks.has(dep)) shared.add(dep);
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
  const { entry, markets, byName } = await chunks();
  assert.ok(entry, 'no entry chunk to check');

  for (const [id, probe] of Object.entries(MUST_NOT_BE_IN_ENTRY)){
    assert.ok(!entry.text.includes(probe),
      `"${probe}" is in the entry chunk, so ${id}'s payload ships to every visitor.\n` +
      'A market chunk existing is not the same as the split working: a module\n' +
      'reachable from BOTH the shell and a lazy import is emitted in both places,\n' +
      'which costs more than not splitting at all. Find the static import path\n' +
      `from the shell to src/markets/${id}/.`);

    const chunk = markets.get(id);
    assert.ok(chunk, `no market-${id}-*.js chunk`);
    /* In the market chunk, or in something it fetches on demand — a market
       that splits its own sections keeps the grid map in a section chunk. What
       this must never do is pass because the probe was deleted. */
    assert.ok([...reachable(chunk, byName)].some(c => c.text.includes(probe)),
      `"${probe}" is in neither the entry chunk nor anything market-${id} loads.\n` +
      'It has not moved, it has disappeared — which means this probe is stale and\n' +
      'the test is no longer checking anything. Pick a new one from what the market\n' +
      'actually ships.');
  }
});

/* ---------------------------------------------------------------------------
   A MARKET THAT FETCHES ITS SECTIONS PER TAB.

   The NEM pilot (docs/p1-sections-pilot.md) cut one 199 kB sections.js into
   thirteen modules behind a loader. The three assertions below are what stop
   that from being a story rather than a property:

     the split is real      no section is in the landing tab's static graph, and
                            the loader is genuinely wired to the brief
     it is bounded          the whole of the market's analysis fits a budget,
                            so a reader who opens everything does not pay an
                            unbounded premium for other readers' first load
     nothing is duplicated  a section lives in exactly one chunk; a module
                            reachable from two places is emitted twice, which
                            costs more than not splitting it at all
   --------------------------------------------------------------------------- */
test('the NEM\'s sections are fetched per tab and absent from its first load', async (t) => {
  if (skipWithoutDist(t)) return;
  const { markets, byName } = await chunks();
  const nem = markets.get('nem');
  assert.ok(nem, 'no market-nem chunk');

  const first = closure(nem, byName);
  const sections = [...byName.values()].filter(c => /^section-nem-/.test(c.name));

  const { count } = BUDGET.sections.nem;
  assert.equal(sections.length, count,
    `expected ${count} section-nem-*.js chunks, found ${sections.length}. ` +
    'One missing means a section went back into the dashboard chunk; one extra ' +
    'means a section file was added without registering it in sections/registry.js.');

  for (const section of sections){
    assert.ok(!first.has(section),
      `${section.name} is in the NEM's static graph, so the landing tab downloads it. ` +
      'Check sections/registry.js: every entry must be `() => import(...)`, and ' +
      'nothing else in the market may import a section module.');
  }

  /* The other half: a split that sent nothing would also pass the loop above.
     The brief is what a reader lands on, and its chunk has to be reachable
     from the dashboard. */
  const onDemand = new Set([...nem.dynamics].map(name => byName.get(name)).filter(Boolean));
  assert.ok([...onDemand].some(c => /^section-nem-case-/.test(c.name)),
    'the dashboard does not load the brief: /markets/<slug>/case would render an empty tab');

  /* The grid map moved out of the dashboard chunk in the same change. It must
     not have moved into the first load by another route.
     BY CHUNK NAME, not by text: the dashboard chunk legitimately carries the
     map chunk's FILENAME in Vite's preload manifest (`__vite__mapDeps`), so a
     string probe would report a payload that is not there. */
  assert.ok(![...first].some(c => /^nem-grid-map-data-/.test(c.name)),
    'the NEM grid map is in the first load again: it is imported by overview.js ' +
    'and grid.js, and by nothing the dashboard imports at load time');
});

test('the NEM\'s whole analysis stays within its section budget', async (t) => {
  if (skipWithoutDist(t)) return;
  const { byName } = await chunks();
  const { total, largest } = BUDGET.sections.nem;
  const sections = [...byName.values()].filter(c => /^section-nem-/.test(c.name));
  assert.ok(sections.length, 'no section chunks to measure');

  const sum = sections.reduce((n, c) => n + c.gzip, 0);
  assert.ok(kB(sum) <= total,
    `the NEM's ${sections.length} section chunks total ${kB(sum)} kB gzipped, over ` +
    `the ${total} kB budget. Opening every tab costs about 12.6 kB more than the ` +
    'single chunk did, and that is expected; growth beyond it is content.');

  const biggest = sections.slice().sort((a, b) => b.gzip - a.gzip)[0];
  assert.ok(kB(biggest.gzip) <= largest,
    `${biggest.name} is ${kB(biggest.gzip)} kB gzipped, over the ${largest} kB per-section ` +
    'budget. A section that grows past it should be split by domain, not re-budgeted.');
});

test('no NEM section is shipped twice', async (t) => {
  if (skipWithoutDist(t)) return;
  const { byName } = await chunks();
  /* A phrase that belongs to one NEM section and to no other market — the
     lineage shares headings like "Revenue Driver Bridge" across five
     dashboards, so a heading would report six carriers and mean nothing. Two
     carriers of a NEM-only phrase would mean Rollup emitted the module both
     statically and dynamically, which costs more than not splitting it. */
  const PROBE = 'Project EnergyConnect Stage 1';
  const holders = [...byName.values()].filter(c => c.text.includes(PROBE)).map(c => c.name);
  assert.equal(holders.length, 1,
    `"${PROBE}" is in ${holders.length} chunks: ${holders.join(', ') || 'none'}. ` +
    'A section reachable from two places is shipped twice; the fix is to remove ' +
    'the static path, not to raise a budget.');
  assert.match(holders[0] || '', /^section-nem-grid-/, 'the grid section carries its own evidence');
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

test('the Finland story remains lazy and its complete additional graph fits the story cap',async t=>{
  if(skipWithoutDist(t))return;
  const {entry,features,byName}=await chunks();
  const first=closure(features.get('investor-experience'),byName,closure(entry,byName));
  const own=features.get('story-fi');assert.ok(own,'the Finland lazy story chunk exists');
  assert.ok(!first.has(own),'the story is absent from home and entry-page dependencies');
  const probe='What is actually secured, and until when?';
  assert.ok(own.text.includes(probe),'the story-content probe still exists');
  for(const chunk of first)assert.ok(!chunk.text.includes(probe),'no story content in '+chunk.name);
  const extra=new Set([...closure(own,byName)].filter(chunk=>!first.has(chunk)));
  assert.ok(kB(gzipOf(extra))<=BUDGET.features['story-fi'],
    'Finland story, shell, kit and additional dependencies: '+kB(gzipOf(extra))+' KiB gzip, cap '+BUDGET.features['story-fi']);
});

test('the GB story, additional static graph and lazy styles stay below 40 KiB gzip',async t=>{
  if(skipWithoutDist(t))return;
  const {entry,features,byName}=await chunks();
  const first=closure(features.get('investor-experience'),byName,closure(entry,byName));
  const own=features.get('story-gb');assert.ok(own,'the GB lazy story chunk exists');
  assert.ok(!first.has(own),'the story is absent before it opens');
  const probe='What happened to prices as batteries filled each service?';
  assert.ok(own.text.includes(probe),'the GB content probe still exists');
  for(const chunk of first)assert.ok(!chunk.text.includes(probe),'no GB story content in '+chunk.name);
  const extra=new Set([...closure(own,byName)].filter(chunk=>!first.has(chunk)));
  const css=await styles();
  assert.ok(!css.main.text.includes('.gb-scene'),'GB styles do not load on home');
  const storyStyles=css.lazy.filter(c=>c.text.includes('.gb-scene')||c.text.includes('.ix-story-dialog'));
  assert.ok(storyStyles.some(c=>c.text.includes('.gb-scene')),'the local story stylesheet exists');
  const cssBytes=storyStyles.reduce((sum,c)=>sum+gzipSync(c.text).length,0);
  const total=gzipOf(extra)+cssBytes;
  assert.ok(total<=40*1024,'GB story and additional static closure including CSS: '+kB(total)+' KiB gzip; cap 40');
});

test('the Italy story and its entire additional static graph stay lazy and below 40 KiB gzip',async t=>{
  if(skipWithoutDist(t))return;
  const {entry,features,byName}=await chunks();
  const first=closure(features.get('investor-experience'),byName,closure(entry,byName));
  const own=features.get('story-it');assert.ok(own,'the Italy lazy story chunk exists');
  assert.ok(!first.has(own));
  const probe='What is the call here, and what is the alternative?';
  assert.ok(own.text.includes(probe));
  for(const chunk of first)assert.ok(!chunk.text.includes(probe),'no Italy story content in '+chunk.name);
  const extra=new Set([...closure(own,byName)].filter(chunk=>!first.has(chunk)));
  const css=(await styles()).lazy.filter(c=>c.text.includes('.it-scene')||c.text.includes('.ix-story-dialog'));
  const extraCss=css.reduce((sum,c)=>sum+gzipSync(c.text).length,0);
  assert.ok(css.some(c=>c.text.includes('.it-scene')),'Italy styles remain lazy');
  assert.ok(kB(gzipOf(extra)+extraCss)<=40,'Italy story complete additional static graph and styles: '+kB(gzipOf(extra)+extraCss)+' KiB gzip');
});

test('the Romania story stays out of the first load and its additional graph fits the story cap',async t=>{
  if(skipWithoutDist(t))return;
  const {entry,features,byName}=await chunks();
  /* Nothing fetches a story before one opens: not the shell, not the home
     page, not a market chunk. */
  const first=closure(features.get('investor-experience'),byName,closure(entry,byName));
  const own=features.get('story-ro');assert.ok(own,'the Romania lazy story chunk exists');
  assert.ok(!first.has(own),'the story is absent from the home page and entry dependencies');
  /* A phrase only the Romania script carries, held to exist in its chunk and in
     no other: a story that quietly rejoined the entry would fail here. */
  const probe='What is the call here, and what must be in hand before entry?';
  assert.ok(own.text.includes(probe),'the story-content probe still exists');
  for(const chunk of first)assert.ok(!chunk.text.includes(probe),'no story content in '+chunk.name);
  /* What the story adds on top of what the reader already has. */
  const extra=new Set([...closure(own,byName)].filter(chunk=>!first.has(chunk)));
  assert.ok(kB(gzipOf(extra))<=BUDGET.features['story-ro'],
    'Romania story, shell, kit, records, content and scenes: '+kB(gzipOf(extra))+' KiB gzip, cap '+BUDGET.features['story-ro']);
});

test('the complete initial PJM static closure and styles fit 40 KiB without preloading locators',async t=>{
  const {readFileSync,readdirSync,existsSync}=await import('node:fs');
  const {gzipSync}=await import('node:zlib');
  const dist=new URL('../dist/',import.meta.url);
  const assets=new URL('assets/',dist);
  if(!existsSync(assets)){assert.notEqual(process.env.REQUIRE_OUTPUT,'1');t.skip('build output absent');return;}
  const files=readdirSync(assets),chunks=new Map(files.filter(f=>f.endsWith('.js')).map(file=>{
    const buf=readFileSync(new URL(file,assets)),text=buf.toString('utf8');
    const imports=[...text.matchAll(/(?:^|[;}\n])import(?:\s*\{[^}]*\}\s*from|\s*[\w$]+\s*from|)\s*"\.\/([^"]+\.js)"/g)].map(m=>m[1]);
    return [file,{file,text,bytes:gzipSync(buf).length,imports}];
  }));
  const pack=[...chunks.values()].find(c=>c.file.startsWith('story-pjm-'));
  assert.ok(pack,'missing lazy pack');
  const entryName=/<script[^>]+src="\/assets\/([^"]+\.js)"/.exec(readFileSync(new URL('index.html',dist),'utf8'))?.[1];
  const visit=(file,set)=>{if(set.has(file)||!chunks.has(file))return;set.add(file);for(const dep of chunks.get(file).imports)visit(dep,set);};
  const closure=new Set(),before=new Set();visit(pack.file,closure);visit(entryName,before);
  for(const c of chunks.values())if(c.file.startsWith('briefing-data-'))visit(c.file,before);
  assert.ok(!before.has(pack.file),'story loads before opening');
  let bytes=[...closure].filter(file=>!before.has(file)).reduce((n,file)=>n+chunks.get(file).bytes,0);
  const initialCss=new Set([...readFileSync(new URL('index.html',dist),'utf8').matchAll(/href="\/assets\/([^"]+\.css)"/g)].map(m=>m[1]));
  for(const file of files.filter(f=>f.endsWith('.css')&&!initialCss.has(f))){
    const buf=readFileSync(new URL(file,assets)),css=buf.toString('utf8');
    if(css.includes('.pjm-')||css.includes('.k-world')||css.includes('.ix-story-dialog'))bytes+=gzipSync(buf).length;
  }
  assert.ok(bytes<40*1024,`PJM static closure ${bytes} bytes exceeds 40960`);
  assert.ok(files.some(f=>f.startsWith('storyEvidenceProvenance-')),'missing demand-loaded provenance');
  for(const file of closure)assert.equal(chunks.get(file).text.includes('Withheld: no analyst rights clearance'),false,`${file} preloads provenance`);
  t.diagnostic(`PJM static closure including styles: ${bytes} bytes gzip`);
 });

test('the CAISO story, complete additional static closure and lazy styles fit 40 KiB gzip',async t=>{
  if(skipWithoutDist(t))return;
  const {entry,features,byName}=await chunks();
  const first=closure(features.get('investor-experience'),byName,closure(entry,byName));
  const own=features.get('story-caiso');assert.ok(own,'the CAISO story has its own lazy chunk');
  assert.ok(!first.has(own),'no CAISO story bytes before opening');
  const probe='What is the call here, and why should I read on?';
  assert.ok(own.text.includes(probe));
  for(const chunk of first)assert.ok(!chunk.text.includes(probe),'no story content in '+chunk.name);
  const extra=new Set([...closure(own,byName)].filter(chunk=>!first.has(chunk)));
  const css=await styles();assert.ok(!css.main.text.includes('.caiso-scene'));
  const lazyCss=css.lazy.filter(c=>c.text.includes('.caiso-scene')||c.text.includes('.ix-story-dialog'));
  assert.ok(lazyCss.some(c=>c.text.includes('.caiso-scene')));
  const total=gzipOf(extra)+lazyCss.reduce((sum,c)=>sum+gzipSync(c.text).length,0);
  t.diagnostic('CAISO complete additional static graph including CSS: '+kB(total)+' KiB gzip');
  assert.ok(total<=40*1024,'CAISO complete static graph including CSS: '+kB(total)+' KiB gzip, cap 40');
});
