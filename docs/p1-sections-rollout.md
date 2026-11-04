# P1-C — Controlled rollout of per-tab section loading

**The call.** Four more dashboards now fetch their thirteen sections one tab at
a time. A reader opening the brief downloads **53.21 / 64.88 / 33.93 / 28.40
KiB gzipped** of Great Britain's / Ireland's / Poland's / Romania's own chunk
instead of **129.17 / 132.13 / 91.34 / 84.12** — a combined **256.33 KiB less**
JavaScript held in the four market chunks, and **55–85 KiB less** in the static
graph a first visit to any one of them waits for. Nothing a reader sees, and no
number a market publishes, changed: **52 of 52 section digests** match the
single-file implementation taken before the split.

All four migrations are **retained**. Even the two narrow cases clear the
pilot's 40 KiB threshold by their own measurement (−57.43 and −62.36 KiB of
first-load JavaScript), and each pays one extra request on the landing tab for
it. Germany, Italy and Japan were inspected and not migrated; Western
Australia's hand-written dashboard was left alone.

Confidence: **Strong** on bytes and request counts, which come from the build
output and a paired browser rig; **Fair** on wall-clock timings, from one laptop
whose ready-time precision is about ±150 ms. What would change it: a Lighthouse
run against the published site on a throttled connection.

---

## 1. C1 — the pilot was worth expanding

Read `docs/p1-sections-pilot.md` first. Each of the five checks was confirmed
against this tree before any code was written:

| Check | Evidence | Verdict |
|---|---|---|
| Initial payload actually decreased | `market-nem` **117.42 → 23.93 KiB gz**; thirteen `section-nem-*.js` chunks absent from the dashboard's static graph (`perf/p1c-sections-before.json`); `npm run test:budget` 18/18 | **Yes** |
| Deep-link behaviour correct | `e2e/nem-sections.spec.js` on both viewports: a pasted `/markets/nem/grid` opens the grid and rewrites the address; a delayed chunk is discarded rather than drawn under a new URL | **Yes** |
| No financial or research content changed | `tests/fixtures/nem-sections-content.json` 13/13 digests equal; `npm run test:current` 84/84 frozen baselines; no fixture regenerated | **Yes** |
| Shared-engine changes compatible | The engine gained **one optional cfg key**; `PREPARE` is null for every market that omits it, so no await is taken. Full suite at baseline **1331/1331** | **Yes** |
| Maintainable, not more complex | Thirteen explicit thunks, one 53-line facade, one 33-line shared helper, one `prepareSections` hook. No new engine abstraction, no generic section schema | **Yes** |

The pilot's own §7 recommended GB and IE next, then PL and RO, and named a
~40 KiB threshold. Expansion is justified. The one change made to the pilot's
tests here is a **generalisation by market id**, which §7 explicitly asked for
instead of a second copy.

## 2. The final section-loading contract

Five markets use it: `nem` (pilot), `gb`, `ie`, `pl`, `ro`. The shape is
generated once by `scripts/split-market-sections.mjs`; **only the section map
and the prelude helpers are market-specific**. No market's research or economic
logic was normalised to fit a schema.

```
markets/<id>/
├── sections.js            synchronous facade: buildSections(api) → SECTIONS()
├── sections/
│   ├── registry.js        LOADERS: one literal import() thunk per section id
│   │                      + FACTORIES, loadSections, loadAllSections, sectionSpec
│   ├── shared.js          createShared(api): the prelude's constants/helpers
│   └── <sectionId>.js     create(api) → the section's factory, body verbatim
└── dashboard.js           prepareSections + an async researchSummary
```

**Layering.** No section imports another section, the market dataset, the
source register, the dashboard or anything in the independently lazy-loaded
story pack. No file in the market imports a section statically — the only
edges into `sections/` are the registry's thunks. A section's helpers are built
from `api` (`createShared`) rather than imported from `data.js`, so the 20–30
KiB dataset is never duplicated into a section chunk or hoisted into one the
landing tab pays for. Each market's registry is self-contained: a shared
runtime loader module would have been factored into a chunk every market
statically imports, adding a request and consuming the tight `sharedTotal`
budget for no benefit.

**The engine.** `createMarketEngine` takes one optional key:

```js
prepareSections: (api, ids) => loadSections(api, ids),
```

`dashboard()` draws the chrome first, then — only when `PREPARE` is present —
awaits the loader for `where.sections` and draws. Three states live in the gap:
a skeleton after 120 ms, a reload panel for a chunk that 404s, and a token that
discards any resolve arriving after the reader changed tab, language or market.
A market without the key takes no await and is untouched.

**Synchronous facade.** `buildSections(api)` returns a getter-based map over
only the loaded ids, so a language change re-evaluates every bilingual string
and a synchronous caller (a test, the Investment Case summary) still reads an
object. `researchSummary()` is the one async caller: it awaits `home` and
`story` before asking, because the house view and one-minute orientation live
in those sections. `marketResearchSummary()` already awaits it.

**Story assets.** `story.js`, `storyPack.js`, `storyBindings.js` and `story/`
are not referenced by any section module and are absent from every market's
static graph. Section loading did not make them eager.

**Adding a section** is one line in `registry.js` plus one module exporting
`create(api)`. **Verifying a split** is a fixture taken from the single file
before it moves (`scripts/generate-section-fixtures.mjs`) and compared
afterwards (`tests/market-sections-parity.test.js`).

## 3. What changed, market by market

Sizes are **KiB gzipped** (1 KiB = 1024 bytes), measured from `dist/` with
`scripts/perf/measure-market-sections.mjs` on the same static import graph as
`tests/bundle-budget.test.js`. "Initial load" is the market chunk plus every
chunk it imports without a dynamic boundary — what a reader waits for on a
deep link. "Brief ready" is the median of eight cold, alternating A/B page
loads (`scripts/perf/ab-compare.mjs`); "Deep-section load" is the median of six
client-side brief → Market Story navigations, timed from the tab click until
both sections are visible (`scripts/perf/measure-sections-nav.mjs`). Both run
on one unthrottled laptop with identity encoding.

| Market | Initial JS before | Initial JS after | Brief ready (before → after) | Deep-section load | Dynamic section requests | Tests | Verdict |
|---|---|---|---|---|---|---|---|
| Great Britain | 428.98 | **344.31** (−84.67) | 1365 → 1432 ms (+67) | 484 → 546 ms (+62) | 0 → **1** brief, **2** on a stacked tab | 13/13 digests, lazy 5/5, budget 4/4, e2e 6×2 | **Retained** |
| Ireland | 413.59 | **346.31** (−67.28) | 886 → 908 ms (+22) | 456 → 588 ms (+132) | 0 → **1** / **2** | 13/13, 5/5, 4/4, 6×2 | **Retained** |
| Poland | 372.80 | **315.37** (−57.43) | 1002 → 1042 ms (+40) | 385 → 382 ms (−3) | 0 → **1** / **2** | 13/13, 5/5, 4/4, 6×2 | **Retained** |
| Romania | 375.65 | **313.29** (−62.36) | 821 → 810 ms (−11) | 421 → 397 ms (−24) | 0 → **1** / **2** | 13/13, 5/5, 4/4, 6×2 | **Retained** |

The market's own chunk, which is the number a budget caps:

| Market | `market-*.js` before | after | Section chunks (n / total / largest) | Cap before → after |
|---|---|---|---|---|
| gb | 129.17 | **53.21** | 13 / 94.96 / 22.37 | 144 → **62** |
| ie | 132.13 | **64.88** | 13 / 82.41 / 20.17 | 149 → **75** |
| pl | 91.34 | **33.93** | 13 / 76.24 / 17.42 | 101 → **40** |
| ro | 84.12 | **28.40** | 13 / 74.26 / 16.51 | 100 → **34** |

Every cap was **lowered**, never raised. `sharedTotal` (173), `entry` (170) and
`home` (265) are untouched; the entry chunk measured 168.05 before and 168.00
after, so home and the global comparison pay nothing for this change. All
market chunks together: **1137.18 → 880.85 KiB**.

**Read the timings honestly.** Ready time moved by −36 to +178 ms across sixteen
routes, inside the instrument's ±150 ms precision; there is no time-to-content
regression to claim and none to hide. What moved consistently: **decoded
JavaScript fell 90–213 kB per route**, first paint was earlier on the heavy
routes (GB story 1192 → 768 ms, IE entry 1020 → 664 ms), and main-thread long
tasks fell on most routes. On a real network, where bytes are the constraint,
that is the part that compounds. The rig's full record is
`perf/p1c-sections-ab.txt`; the client-side brief → Market Story navigation is
`perf/p1c-sections-nav.json`.

## 4. C4 — bundle composition

Inspected rather than assumed, from the built chunk graph:

- **No duplicate section payloads.** A unique phrase from each market's story
  section is in exactly one chunk (`tests/bundle-budget.test.js`, generalised
  from the NEM's single probe). The `Card A — Capacity Market Signal` copy that
  appears in two chunks is pre-existing shared research copy in two different
  markets, not one module emitted twice.
- **Small shared chunks, one per market.** `sections/shared.js` is factored out
  at 0.18–0.45 KiB and named `<id>-sections-shared-*.js` by `vite.config.js`.
  That is small enough to be cheaper as a shared chunk than as thirteen copies.
- **No new shared runtime chunk.** A common loader module in `_shared/` would
  have been hoisted into a chunk all five markets statically import. Each
  registry is generated from the same template instead; the duplication is
  ~60 lines of loader per market and adds no request.
- **Fragmentation accepted where it is inherent.** `case` (0.60–0.63 KiB) and
  `entry` (0.69–0.85 KiB) are short pointers to the shared Investment Case
  component and the market's build pathway. They are separate because a
  section is the unit a tab draws, a claim attaches to and a deep link names —
  merging them would make the brief download the Entry section. The pilot made
  the same call. The unrouted `benchmark` section remains registered: its chunk
  is emitted and never requested, which is zero bytes on the wire.
- **Largest chunks are single domains**, not fragmentation: the four story
  sections (16.51–22.37 KiB). They were not split further; a per-market
  `largest` cap (18–24 KiB) bounds their growth instead.
- **Eager imports that were left eager.** `gridMapData.js` is a side-effect
  import in each of these four dashboards, so it stays in the market chunk.
  The pilot moved the NEM's map into its two map-drawing sections because that
  market's map was 20 KiB of the dashboard chunk and its overview drew it; here
  the grid section already lives in `gridSection.js` (or inline for Ireland),
  and `researchSummary()` needs the registry before any section chunk is
  fetched. Moving it would trade a small first-load saving for a map that can
  be missing on the investment-case experience. `congestionRegistry` (52.08
  KiB) and `buildPathwayPanel` (14.79 KiB) are shared engine chunks every
  market already paid for; this change did not add them.

## 5. C5 — regression and compatibility

| Check | Result |
|---|---|
| `npm test` (full unit suite, final tree) | **1377 / 1377**, 0 skipped, 0 failed |
| `npm run test:current` (frozen financial baselines) | 84 / 84, no fixture regenerated |
| `npm run test:budget` | 30 / 30, including all five markets' section assertions |
| `npm run test:bundle` (confidentiality) | 7 / 7; pre-commit guard clean on every commit |
| `npm run test:e2e` (full suite, 244 tests, desktop + mobile) | **244 / 244 passed** (29.1 min) |
| `npm run etl:verify` | all snapshots verified |
| `npm run build` | clean, 211 JS chunks |
| Home, global comparison, investment returns | unchanged: entry 168.05 → 168.00 KiB, `test:current` green, no model or dataset file touched |
| Deep links | `e2e/market-sections.spec.js`: a pasted `/<slug>/grid` opens the grid and rewrites to `/entry/grid` on all four markets |
| Desktop and mobile navigation | both Playwright projects; the tab strip overflows on a phone and is exercised there |
| Language switching | a fetched section is rebuilt in Chinese; the spec is re-evaluated per read, not cached as text |
| Market Story pages | story chunks absent from every market's first load; existing story e2e suite unchanged |
| SVG maps and source drawers | `.geo-grid-map svg` visible on the grid tab; the first `.source-drawer` opens and closes on all four markets; the evidence tab's source registry table renders |
| Stale content after rapid navigation | a section chunk held 1.5 s and delivered after two tab changes is discarded by the engine's token |
| Confidentiality | no `local-data/` content copied; guard scanned every staged file |

The first full e2e run reported **236 passed / 8 failed**, all eight being the
new spec's source-drawer check on four markets × two viewports. It looked for
drawers inside the evidence section, where none are rendered (drawers attach to
cards carrying a `src` binding, on the grid and story tabs), and used a table
locator matching five elements — a strict-mode violation. The spec was
corrected to check the grid route and `.first()`; the full suite was re-run and
passed 244/244. This was a defect in the new test, not in the migration.

## 6. What was considered and not done

- **Germany, Italy, Japan.** The pilot graded them at 28.95, 34.80 and 32.96
  KiB of `sections.js` — below the ~40 KiB threshold at which one added request
  costs more than the bytes saved. Japan's chunk is large for other reasons.
  Not migrated.
- **Western Australia.** A separate hand-written dashboard architecture, not
  on the shared block engine. Excluded by the brief and by the pattern.
- **A prefetch on idle, a split dataset, or `import.meta.glob`.** All three
  were rejected in the pilot for reasons that still hold: they make every visit
  more expensive, duplicate the one source of truth for a market's numbers, or
  turn an explicit registry into an eager one under a later refactor.
- **Raising a budget.** Not done. Four caps were ratcheted down; new section
  caps were added above measured, not loosened.
- **Moving the market story into a section.** The story is an independently
  lazy-loaded experience with its own assets; it is not a tab section.

## 7. Reproducing

```bash
npm run build
node scripts/perf/measure-market-sections.mjs --dist dist --markets gb,ie,pl,ro,nem --closure gb
node scripts/perf/ab-compare.mjs --a <baseline-dist> --b dist --markets gb,ie,pl,ro --runs 8
node scripts/perf/measure-sections-nav.mjs --a <baseline-dist> --b dist --markets gb,ie,pl,ro --runs 6
npm test && npm run test:current && npm run test:budget && npm run test:bundle
npm run test:e2e && npm run etl:verify
```

Records: `perf/p1c-sections-before.json`, `perf/p1c-sections-after.json`,
`perf/p1c-sections-ab.txt`, `perf/p1c-sections-nav.json`. Fixtures:
`tests/fixtures/{gb,ie,pl,ro}-sections-content.json`.

## 8. Open risks

- **A slow chunk on a slow connection is visible now**, as it was in the pilot:
  a 404 or a stalled request shows a skeleton and then a reload prompt. The
  prompt is a real recovery path, but only a production smoke run on a
  throttled connection exercises it.
- **`summaryPicks` is route-scoped.** The engine strips the one-line summary
  from the section that carries it. For all four markets the `ic` block lives in
  `home`, which is loaded on the tab that draws it, so this is exact here too —
  checked rather than assumed. A future market whose `ic` block lives in a
  section its landing tab does not draw would lose the strip.
- **Thirteen chunks is thirteen requests** if a reader opens every tab. On
  HTTP/2 that is cheap; on a throttled connection the wall-clock cost is the
  thing the Fair confidence above is about.
- **The generated registries are five copies of one shape.** The generator is
  the single source of truth for that shape, but a future hand edit to one
  registry will not be reflected in the others. `tests/market-sections-lazy.test.js`
  holds the properties, not the text.
- **Measurement environment.** This checkout was shared with another workstream
  whose uncommitted SVG-profiling files were present in the working tree. Its
  source edits are already on `main` (PR #156), so the built output and CI's
  merge build agree, and none of those files are in any P1-C commit. Both the
  before and after builds were taken from the same working tree, so the A/B
  comparison cancels whatever it contributes.
