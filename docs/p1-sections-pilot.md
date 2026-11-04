# P1-B — the NEM's sections, measured and split

**The call.** The National Electricity Market's dashboard no longer ships its
thirteen sections in one chunk. A reader who opens the brief now downloads
**24.55 kB gzipped** of this market's code instead of **117.42** — a 79%
reduction, and 93 kB of JavaScript that is no longer parsed and evaluated before
anything on the tab can be read. A reader who opens every tab costs **19.72 kB
more** than before, because thirteen files compress worse than one. Nothing a
reader sees, and no number the market publishes, changed.

**Recommendation.** Adopt the same pattern for **Great Britain** and **Ireland**
next, then **Poland** and **Romania** in a second change. Do not extend it to
markets whose section file is under about 40 kB gzipped — the request the split
adds costs more than the bytes it saves. The reasoning, and the threshold, are
in the last section.

Confidence: **Strong** on the bytes, which are measured from the build output;
**Fair** on wall-clock timings, which are from a laptop and are noisy in the way
that section explains. What would change it: a Lighthouse run against the
published site on a throttled connection, which would move the wall-clock claim
from Fair to Strong without touching the architecture.

---

## 1. What it cost before (B1)

Measured on `main` at `b41648e`, 4 November 2026, from `dist/` built by
`vite build`.

| | |
|---|---|
| `market-nem-*.js` | **117.42 kB gzipped** (535 kB minified) |
| What a first NEM visit paid | **229.51 kB gzipped** — the market chunk plus the shared chunks it statically imports (`congestionRegistry` alone is 52.08) |
| `src/markets/nem/sections.js` | 199,464 bytes of source, 1,173 lines, **73.13 kB gzipped** |
| …as a share of the chunk | 62% of the gzipped bytes, and the largest single item in it |
| Everything else in the chunk | `data.js` 22.43, the grid map 20.29, the view and ledger 6.00, the source register 3.21 |
| Entry chunk / home first view | 168.04 / 258.26 kB gzipped — unaffected by this work |

The landing tab is the brief: **one** section (`case`, 0.44 kB gzipped after the
split), plus the shared investment-case component it mounts lazily. Twelve of the
thirteen sections were downloaded, parsed and evaluated on every visit to it, and
never drawn.

Route timings from `scripts/perf/measure.mjs` (three cold and three warm
navigations per route, `vite preview`, no throttling) are in
`perf/p1-nem-before.json`. They are recorded rather than relied on: repeating
the same build minutes later moved the median by up to 700 ms, which is why the
comparison in §5 alternates the two builds instead.

## 2. What was built (B2)

`src/markets/nem/sections.js` is now a 53-line facade. The content is one module
per domain, cut from the original file by line range so that the body of every
section is the same text it was, re-indented:

| Module | Section id | Drawn on | Lines | kB gzipped |
|---|---|---|---|---|
| `sections/overview.js` | `home` | Story | 148 | 11.35 |
| `sections/story.js` | `story` | Story | 159 | 12.35 |
| `sections/capacity.js` | `capacity` | Revenue | 128 | 8.85 |
| `sections/energy.js` | `energy` | Revenue | 93 | 6.94 |
| `sections/services.js` | `services` | Revenue | 64 | 4.76 |
| `sections/duration.js` | `duration` | Revenue | 105 | 7.56 |
| `sections/pipeline.js` | `pipeline` | Competition | 81 | 4.63 |
| `sections/grid.js` | `grid` | Entry | 133 | 10.37 |
| `sections/portfolio.js` | `portfolio` | Capital | 85 | 5.07 |
| `sections/methodology.js` | `data` | Evidence | 73 | 4.18 |
| `sections/case.js` | `case` | Brief | 11 | 0.44 |
| `sections/entry.js` | `entry` | Entry | 10 | 0.39 |
| `sections/benchmark.js` | `benchmark` | — | 130 | 8.82 |
| `sections/shared.js` | | | 33 | 0.18 |

Three decisions in that table:

**`benchmark` is registered but unrouted**, and was unrouted before the split:
`nem/tabs.js` has no entry for it and `markets/tabGroups.js` groups the twelve
that exist. It is kept as its own module rather than deleted — deleting content
is not what a loader refactor is for — and it costs one chunk that is emitted and
never requested, which is zero bytes on the wire.

**`sections/shared.js` is built from `api`, not imported.** `O` is `M.official`
and the market dataset is already in the dashboard chunk. A shared module that
imported `data.js` would either duplicate 22 kB into every section or hoist it
into a chunk the landing tab also pays for. The five constants moved here
unchanged; the engine still hands the dataset over exactly as before.

**The grid map left the dashboard chunk.** It used to be a side-effect import in
`dashboard.js`, 20.29 kB gzipped, drawn only on the grid tab and paired with the
overview. It now registers itself from `overview.js` and `grid.js`, the only two
sections that draw it, and reaches the page as `nem-grid-map-data-*.js` (27.96 kB
with the zone and boundary files beside it) when one of those tabs opens.

Layering: no section imports another section, no section imports `data.js` or
`sources.js`, and no file in the market imports a section statically. All three
are asserted in `tests/nem-sections-lazy.test.js` — a single static import would
put the 199 kB file back and every other test would still pass.

## 3. How the loading works (B3)

`src/markets/nem/sections/registry.js` holds one thunk per section id:

```js
grid: () => import('./grid.js'),
```

Literal specifiers inside thunks, because that is the only shape Vite can
analyse into one chunk per entry. An object of imported modules would read the
same and ship everything to a reader who opened the brief.

The shared engine gained **one optional cfg key**, and no change to any existing
behaviour:

```js
createMarketEngine({ MKT, TABS, SRC, M, buildSections,
  prepareSections: (api, ids) => loadSections(api, ids) });
```

`dashboard()` draws the chrome first — header, market nav, tab strip, regional
lens — then, **only when `prepareSections` is present**, awaits the loader and
draws the sections. A market that omits the key takes no await: the function is
`async`, but with no `await` in its path the body runs straight through, which is
why GB, IE, RO, PL, WA and Japan behave exactly as they did.

Three states live in the gap, and each is handled deliberately:

- **loading.** A skeleton of the same `.dash-skeleton` bars the market page
  already uses, appended only after 120 ms. A section already in memory resolves
  in a microtask, and a skeleton that flashes is worse than none.
- **failure.** A chunk that 404s is a real production case — a redeploy replaces
  hashed names, and a tab open across one asks for bytes that no longer exist.
  That renders a warning and a reload button in place, not a console error over
  an empty half-page.
- **stale.** A counter per engine invalidates any resolve that arrives after the
  reader changed tab, changed language, pressed back or opened another market.
  `marketPage.js` has the same guard for the dashboard chunk; this is the same
  idea one level down, and it is what stops the previous route's sections being
  drawn under the current address.

`summaryPicks()` was the contract that could not survive naively, so its
asynchronous lifecycle is explicit. It extracts the house view, the one-minute
orientation and the history timeline from `home` and `story`, and it is read in
two places:

- **`dashboard()`** reads `picks.ic` to strip the brief's one-line summary out of
  the section that also carries it. For the NEM that block does not exist outside
  `home`, and `home` is only drawn on the tab that loads it, so computing picks
  from the loaded sections is exact. `tests/nem-section-parity.test.js` holds the
  content; `e2e/nem-sections.spec.js` holds the rendering.
- **`researchSummary()`** needs `home` and `story` wherever it is shown, so the
  market loads them before asking, and `experience/researchSummary.js` awaits it.
  Awaiting a market that returns nothing defers the caption by one microtask and
  changes no pixel.

Language changes need nothing new: `SECTIONS()` still defines a getter per id, so
every string re-evaluates on every read, exactly as `SEC_B`'s getters did.

## 4. Nothing a reader sees has changed (B4)

`tests/fixtures/nem-sections-content.json` is a digest of all thirteen section
specifications — every block, every number, every bilingual pair, every source
reference, with functions serialised by their own source — taken from the
single-file implementation immediately before it was split, using the same
harness (`tests/helpers/nem-sections.mjs`) against the market's real dataset,
formatters, compute layer and sponsor assumptions.

All thirteen match: **260,334 bytes of specification, unchanged**, 13/13 digests
equal. A section that lost a Chinese sentence, a block or a decimal would fail
`tests/nem-section-parity.test.js`.

The rendering checks the digest cannot make are in `e2e/nem-sections.spec.js`,
which runs on both viewports: the brief loads one section and no other; a pasted
`/markets/nem/grid` opens the grid, draws the map and rewrites the address to
`/entry/grid`; a section already in memory is fetched once and never drawn
twice; a language change rebuilds a fetched section in Chinese; and a chunk that
arrives 1.5 s after the reader moved on is discarded rather than drawn under the
new address.

Frozen financial baselines are untouched: `npm run test:current` passes, and no
fixture was regenerated.

## 5. What it measures now (B5)

From the build output:

| | before | after |
|---|---|---|
| `market-nem-*.js` | 117.42 kB gz | **23.93** |
| what the brief loads of this market | 117.42 | **24.55** (chunk + `case` 0.44 + `sections/shared` 0.18) |
| thirteen section chunks | — | 85.72 total, largest 12.35 |
| grid map | 20.29, inside the chunk | 27.31, its own chunk, only on Story or Entry |
| **every tab opened** | **117.42** | **137.14** (+19.72, +16.8%) |
| entry chunk | 168.03 | 168.03 |
| home first view | 258.26 | 258.26 |
| market-shared total (all markets) | 170.19 | 170.75 |

The first-load win is real and the total cost of opening everything is real:
19.72 kB more, because gzip cannot share a dictionary across thirteen files. The
split trades a cost paid by every reader for a cost paid only by the ones who
read on.

**No section is in the first load.** `tests/bundle-budget.test.js` asserts that
the NEM's thirteen section chunks are absent from the dashboard chunk's static
graph, that the loader is genuinely wired to the brief, that the grid map is not
in the first load either, that no section is shipped twice, and that the whole
set stays inside a 100 kB budget with no chunk over 15 kB. `market-nem`'s budget
was ratcheted **132 → 30**. `sharedTotal` was **left at 171**: measured 170.19
before and 170.75 after, the 0.56 being the async boundary in `_shared/engine.js`
that every market now carries, and inside a cap with 0.25 kB to spare.

**Navigation does not become slower, and that is all the timing rig can say.**
The comparison runs both builds in one process, alternating, against the same
static server with `no-store` and the same selectors, 15 cold repetitions each
(`scripts/perf/ab-compare.mjs`). One complete run, medians:

| route | ready, before → after | first paint | LCP | long tasks | JS decoded |
|---|---|---|---|---|---|
| brief | 1438 → 1479 ms | 888 → **852** | 896 → **864** | 718 → **663** | 1574 → **1326 kB** |
| story | 1646 → 1673 ms | 1364 → **808** | 1376 → 1484 | 1108 → **661** | 1105 → **984 kB** |
| entry | 1787 → 1784 ms | 1308 → **804** | 1344 → 1396 | 1168 → **833** | 1574 → **1425 kB** |
| evidence | 1406 → 1427 ms | 1072 → **792** | 1144 → **876** | 819 → **556** | 1105 → **863 kB** |

Read this honestly. **Ready time does not move** — +41, +27, −3 and +21 ms, and
a second run of the same pair put the brief at −142 ms, so the instrument's
precision is about ±150 ms on this laptop. What did move consistently:

- **First paint is 36–556 ms earlier**, because the header, the tab strip and the
  market nav no longer wait for 199 kB of section code to parse.
- **Main-thread long tasks fall 8–40%** on every route, which is the cost that
  does not appear in a localhost timing but does on a phone.
- **Decoded JavaScript falls 121–249 kB per route** (10–22%), and that is the
  part that compounds on a real network, where the bytes are the constraint.

So the claim this PR supports is: **no regression in time-to-content, a
measurable drop in bytes and main-thread work, and a much cheaper first visit on
a connection that is not localhost.** A Lighthouse run against the published site
on a throttled profile is the measurement that would turn "cheaper on paper" into
"faster for a reader", and it belongs in the follow-up rather than here.

For completeness, the standard harness (`scripts/perf/measure.mjs`, three cold
and three warm navigations per route) reported 1485 → 1394 ms on the brief but
1432 → 1672 ms on the story in the same period, on a machine that was also
building. That is the noise the paired design exists to remove; both records are
committed (`perf/p1-nem-before.json`, `perf/p1-nem-after.json`,
`perf/p1-nem-ab.txt`).

## 6. What was considered and not done

- **A prefetch on idle.** Loading the other twelve sections after the brief
  paints would make later tabs instant and every visit more expensive. The point
  of the change is the opposite, and a reader who came for one section should not
  pay for eleven.
- **Splitting the dataset.** `data.js` is 22.43 kB gzipped and every section
  reads it. Per-section extracts would duplicate it or fragment a single source
  of truth for the market's numbers.
- **Passing `gridMapById` through `api` instead of importing the registry from
  the two sections that draw the map.** It would add a member to the shared
  engine's api for one market's benefit. The registry is loaded on demand with
  the section, so it stayed out of every market's static closure and the
  market-shared budget did not move because of it.
- **A general `import.meta.glob` loader.** It would have made registering a new
  section a one-line change and made the registry unreadable — and, more
  importantly, it is the pattern that quietly turns into an eager registry under
  a refactor. Thirteen explicit lines are the cost of the property the test
  asserts.
- **Migrating a second market in this PR.** The pattern's cost is per market and
  its risks are per market; one pilot that is fully verified is worth more than
  two that are half verified.

## 7. Should GB, IE, PL and RO follow?

The pattern pays where a market's sections are most of its chunk and its landing
tab is one small section. All four are graded, so all four have a `case` landing
tab and meet the second condition.

| market | `sections.js` gzipped | market chunk | section share | verdict |
|---|---|---|---|---|
| Great Britain | 68.80 | 129.17 | 53% | **next**, with Ireland, in one PR |
| Ireland | 63.77 | 132.13 | 48% | **next**, with Great Britain |
| Poland | 50.74 | 91.34 | 56% | **after**, same pattern, own PR |
| Romania | 50.53 | 84.12 | 60% | **after**, same pattern, own PR |
| Italy | 34.80 | 69.99 | 50% | not yet |
| Germany | 28.95 | 61.22 | 47% | not yet |
| Japan | 32.96 | 117.21 | 28% | not yet — its chunk is large for other reasons |

The rule of thumb: **adopt when `sections.js` exceeds about 40 kB gzipped.** Below
that, the landing tab saves less than 40 kB and pays an extra request for it,
which is the trade the Entry tab shows is not worth making on its own. GB and IE
clear it by half again; PL and RO clear it narrowly, and their PRs should say so
rather than inherit this one's conclusion.

What each follow-up inherits, and what it must redo:

- **Inherits:** the engine's `prepareSections` hook, the loader shape, the three
  states, `scripts/perf/ab-compare.mjs`, and the four assertions in
  `tests/bundle-budget.test.js` (generalise them by market id rather than adding
  a second copy).
- **Must redo:** its own parity fixture, taken from its own pre-split file before
  anything moves, and its own e2e deep-link spec. GB, IE, PL and RO already have
  `gridSection.js` files, so their extraction is more mechanical than the NEM's
  was — and their `grid` section already lives apart, so the grid-map move that
  bought 20 kB here may not apply.
- **Must not:** raise a budget to accommodate a section that drifted back into
  the dashboard chunk. The ratchet is the alarm.

## 8. Reproducing this

```bash
npm run build                       # dist/ for the current tree
node scripts/perf/measure.mjs --browser --routes nem,nem-brief,nem-story,nem-entry,nem-data
node scripts/perf/ab-compare.mjs --a <baseline-dist> --b dist --runs 15
npm test && npm run test:budget && npm run test:e2e
```

`perf/p1-nem-before.json` and `perf/p1-nem-after.json` are the standard harness's
record of both builds; `ab-compare.mjs` is the controlled comparison, and the one
to trust when the two disagree.

## 9. Open risks

- **A slow chunk on a slow connection is now visible.** Before, the section
  arrived with the page or not at all; now a 404 or a stalled request shows a
  skeleton and then a reload prompt. The prompt is a real recovery path, but it
  is a new one, and only a production smoke run on a throttled connection
  exercises it.
- **`summaryPicks` is now route-scoped.** That is exact for the NEM. A future
  market whose `ic` block lives in a section its landing tab does not draw would
  silently lose the strip; the engine comment says so, and the follow-up PRs must
  check it rather than assume.
- **Thirteen chunks is thirteen requests.** HTTP/2 makes that cheap on the
  published site and localhost does not, which is the largest single reason the
  wall-clock numbers here understate the change.
