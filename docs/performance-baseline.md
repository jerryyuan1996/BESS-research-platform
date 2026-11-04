# Performance baseline — 2026-11-04

The measured state of the platform before any optimisation, at commit `d02f26d`, on the
analyst's Windows laptop. The machine-readable record is
[`perf/performance-baseline.json`](../perf/performance-baseline.json); this document explains
what it means and what to change first.

All gzip figures are KiB (1 KiB = 1024 bytes), matching the convention
`tests/bundle-budget.test.js` uses. CI figures are minutes from the GitHub Actions API.

## The call

The build is not the problem, and the ETL's wall time is real but contained. The cost is in
checks that run twice and in one map that blocks the main thread.

| Cost | Measured | Where |
|---|---|---|
| CI, one push to `main` | **20.3 min** | test job 10.3, publish job 9.7 |
| E2E suite, twice per publish | **6.3 min** built + **8.4 min** live | `npm run test:e2e` in both jobs |
| Unit and governance suite | **3.3–4.4 min** (1,290 tests) | `npm test` |
| First load, every visitor | **196.1 KiB gzip** (168.0 JS + 28.1 CSS) | entry chunk + entry stylesheet |
| Home first view | **258.24 KiB gzip** against a 265 budget | 12 chunks |
| GB grid map | **0.82 s of long tasks**, CLS **0.17** | `/markets/great-britain/grid` |
| ETL, 22 datasets | **158.4 s local**, 58.2 s CI | 7 datasets are 78% of it |

Two numbers deserve emphasis because they constrain what can be optimised next:

- **The first-load budgets are nearly full.** Entry 168.02 of 170 KiB (1.2% headroom), home
  258.24 of 265 (2.5%), market-shared 170.18 of 171 (0.5%). Any new eager import fails CI;
  the next change to the shell has to remove bytes somewhere else.
- **The publish job runs the whole browser suite again against production** — 8.4 min of the
  publish job's 9.7. That is the single largest avoidable CI cost, and it buys the same 168
  assertions the test job has just made against the same build.

## What was measured, and on what

| | |
|---|---|
| Commit | `d02f26d` (merge of #153, after the #141 data merge) |
| Host | Windows, 8 × Intel i7-8650U @ 1.90 GHz, 15.9 GB RAM |
| Runtime | Node v22.22.2, npm 10.9.7, Vite 7.3.6 |
| Browser | Chromium 156.0.8078.4 via Playwright 1.64.1, viewport 1440×1000 |
| Build | six timed runs, `vite build` |
| Browser routes | five, three cold and three warm navigations each; median reported with min–max |
| CI | two successful runs read with `gh run view`: `41772728916` (push) and `41786731783` (Live data) |

Reproduce the frontend half with:

```bash
npm run perf:report      # build + bundle + five browser routes, writes perf/performance-baseline.json
npm run perf:bundle      # bundle only, reads an existing dist/
npm run perf:browser     # routes only, against a preview server the script starts and stops
```

`npm run perf:report` needs Playwright's Chromium (`npx playwright install chromium`). On a host
that intercepts recursive deletes — the WorkBuddy sandbox used here does — prefix it with
`CODEBUDDY_SAFE_DELETE_ENABLED=0`, because Vite empties `dist/` before building.

## 1. Build and bundle

**Build time.** 51.0, 56.4, 65.9, 66.5, 67.0 and 80.3 s wall across six runs; Vite's own line
read 48.4 s on the first and 75 s on the slowest. The spread is this host under sustained load,
not the code: the same commit builds in **13.2–18.0 s** on the GitHub runner (0.22–0.30 min).
Observed fact, Strong. What would change it: a release build with a cold module cache, or a
runner with fewer cores.

**Output.** 139 JavaScript chunks (7.4 MB raw, 2.37 MiB gzip), 10 stylesheets (181.3 KiB raw,
39.6 KiB gzip), 57 static JSON assets (34.7 MiB raw).

| First load | Raw | Gzip | Budget | Headroom |
|---|---:|---:|---:|---:|
| Entry `index-*.js` | 535,630 B | **168.02 KiB** | 170 | 1.2% |
| Entry `index-*.css` | 146,817 B | **28.05 KiB** | not budgeted | — |
| **Total** | | **196.1 KiB** | | |
| Home first view (entry + briefing + largest investor data) | | **258.24 KiB** | 265 | 2.5% |
| Market-shared chunks (26 files) | | **170.18 KiB** | 171 | 0.5% |

The home first view includes `briefing-data` at 42.8 KiB gzip — the largest feature chunk after
the market payloads. `congestionRegistry` alone is 52.1 KiB of the market-shared total.

**Largest JavaScript chunks**, by gzip:

| Chunk | Gzip | Budget | Role |
|---|---:|---:|---|
| `market-wa` | 177.36 | 207 | Western Australia dashboard |
| `index` (entry) | 168.02 | 170 | shell, registry, comparison interfaces |
| `market-ie` | 132.13 | 149 | Ireland dashboard |
| `market-gb` | 129.17 | 144 | Great Britain dashboard |
| `market-nem` | 117.42 | 132 | NEM dashboard |
| `market-jp` | 117.21 | 127 | Japan, three regions |
| `returns` | 71.69 | 74 | `/returns` |
| `market-it` | 69.99 | 75 | Italy dashboard |

**What a market visit actually costs** — its own chunk plus the shared chunks it statically
imports, which is the number a reader waits for and the one a per-chunk budget does not show:

| Market | Own chunk | Visit cost |
|---|---:|---:|
| WA | 177.36 | **276.5** |
| JP | 117.21 | **274.4** |
| GB | 129.17 | **259.6** |
| IE | 132.13 | **244.2** |
| NEM | 117.42 | **229.5** |
| PL | 91.34 | 203.4 |

**Largest static JSON.** `gb-eac-response.json` 8.77 MiB raw and `gb-dynamic-response.json`
5.13 MiB raw dominate; then the grid registers (`it` 1.49 MiB, `gb` 1.42 + 1.37 MiB, `de`
1.21 MiB).

> They are **not** a browser bottleneck, and the baseline should not be read as saying they are.
> The GB story fetches the 56 KiB and 84 KiB `.summary.json` files
> (`src/markets/gb/story/data.js`); the full snapshots are never requested by a page. They cost
> build copy time and deploy artefact size, not first load. Observed fact, Strong. What would
> change it: a page importing the full snapshot instead of its summary.

## 2. Tests

| Suite | Result | Local wall | CI |
|---|---|---|---|
| `npm test` (unit, governance, ETL) | 1,290 pass, 0 fail | **251 s and 364 s** (two runs) | 3.32–4.42 min |
| `npm run test:current` | 84 pass | 0.93 s | included above |
| `node --test tests/governance.test.js` | 56 pass | 2.97 s | included above |
| `npm run test:budget` (with `SCAN_DIR=dist`) | 15 pass | 12.1 s | 0.05 min |
| `npm run test:bundle` (with `SCAN_DIR=dist`) | 7 pass | 6.7 s | 0.02 min |
| `npm run etl:verify` | all snapshots verified | 3.7 s | 0.02 min |
| `npm run test:e2e` | **168 pass** (84 tests × desktop + mobile) | **19.4 min** | 6.25–8.33 min |

**E2E is the dominant local cost and, counted with its live repeat, the largest CI cost.**
Playwright's own slow-file report names `e2e/story.spec.js` on desktop at **6.1 min**, roughly a
third of the local wall time. The two projects run at `workers: 2`; the suite is 168 tests.

Desktop versus mobile, measured by running each project alone on the same build:

| Project | Tests | Result | Wall |
|---|---:|---|---:|
| desktop | 84 | 83 passed, 1 failed (not identified) | **13.1 min** |
| mobile | 84 | 83 passed, 1 teardown timeout | **12.2 min** |

Each isolated run had one failure. The mobile one is recorded: `Tearing down "context" exceeded
the test timeout` on `italy-story.spec.js`. The desktop artefact was overwritten by the mobile
run, so its test is not identified. The full suite, run before them, passed all 168, and the
Italy test passed alone in 1.2 min afterwards — the observed failure mode is teardown, not an
assertion. The wall times stand; the pass counts are the honest result of the isolated runs.
Running the projects separately is also slower than the combined suite (25.3 min against 19.4),
because the slow desktop story file no longer overlaps with mobile work.

**Browser setup.** CI installs Chromium in 0.23–0.37 min per job (`npx playwright install
--with-deps --no-shell chromium`), twice per publish — once for the test job, once for the live
check. On this laptop the browser was already installed, so local install time was not measured.

**CI step timings**, from `gh run view 41772728916` (push, success, 20.3 min total):

| Job / step | Minutes |
|---|---:|
| Test job, total | 10.3 |
| — `npm test` | 3.32 |
| — `npm run build` | 0.22 |
| — bundle scan + budget | 0.07 |
| — install Chromium | 0.23 |
| — `npm run test:e2e` | **6.25** |
| Publish job, total | 9.7 |
| — `vercel build` + scan + deploy | 0.64 |
| — CLI install, `npm ci`, checkout, environment pull | 0.66 |
| — live page checks (`test:e2e` against production) | **8.40** |

The Live data run (`41786731783`, 21.8 min total) shows the same shape with more variance:
ETL 0.97 min, test job 13.8 min (unit 4.42, E2E 8.33), publish job 6.7 min (live 5.68).

## 3. ETL

`node etl/run.mjs --dry-run`, all 22 datasets, nothing written: **158.4 s** locally (CI: 58.2 s).
Eight datasets were fetched and validated; fourteen were skipped before any request — eight
Fingrid series with no local API key, five ENTSO-E series with no token, and Germany's prices
withheld for unresolved publication rights. None failed. A dry run writes nothing, so
"unchanged" is not a status it reports; the published run's four outcomes are written, unchanged,
skipped and failed.

| Dataset | Connector | Duration | Points | Status |
|---|---|---:|---:|---|
| `gb-eac-response` | neso-response | **31.7 s** | 39,528 | validated |
| `jp-hokkaido-jepx` | jepx | **28.5 s** | 17,582 | validated |
| `jp-tokyo-jepx` | jepx | **18.7 s** | 17,582 | validated |
| `jp-kyushu-jepx` | jepx | **15.3 s** | 17,582 | validated |
| `wa-wem-prices` | aemo-wem | **13.9 s** | 17,455 | validated |
| `industry-news` | news | 8.5 s | 41 | validated |
| `pl-day-ahead` | pse | 7.5 s | 8,775 | validated |
| `fx-ecb` | ecb | 1.0 s | 5 | validated |
| `gb-dynamic-response` | neso-response | 0.5 s | 23,773 | skipped |
| 8 × Fingrid reserve series | fingrid | 0.03–0.04 s each | — | skipped, no key |
| 5 × ENTSO-E day-ahead | entsoe | ≤ 0.002 s each | — | skipped, no token |

The three JEPX areas are **62.5 s, 39.5% of the run**, and they are fetched one after another by
a `for` loop. `gb-eac-response` is another 20%. JEPX, GB EAC, WA, news and Poland — seven
datasets — account for 124.1 s, **78%** of elapsed time.

**Rate limits.** Fingrid's starter key allows about one request every two seconds and answers 429
beyond it; the connector spaces requests and backs off (`etl/sources/fingrid.mjs`). ENTSO-E is
protected by the 45-day incremental backfill rather than by pacing (`docs/live-data.md`), which
keeps a run to tens of requests instead of the ~1,500 a full rebuild would make. Neither source
showed a 429 in this run, but the eight Fingrid series were skipped here, so this baseline does
not observe their real cost. Observed fact for the eight timed datasets; estimate for Fingrid.

**Instrumentation added.** Every dataset now records `durationMs` in `etl/out/summary.json`,
alongside its connector, status and point count, and the run records its own total. Ids, counts
and timings only — no payload, URL or credential — so the file can be kept as a CI artefact.
The per-dataset table above is that record, not a reconstruction.

## 4. Browser

Five routes, three cold and three warm navigations each. "Ready" is the route's own signal — the
investor selector on the home page, `#bankable` on a market, the map's `<svg>` on the grid tab,
the league table's first row on `/returns`. Median of three, with the range in brackets.

| Route | Cold ready | FCP | LCP | CLS | Long tasks | Requests |
|---|---:|---:|---:|---:|---:|---:|
| `/` | **850 ms** (774–1,780) | 264 | 780 | 0.042 | 1, 73 ms | 18 |
| `/markets/great-britain` | **936 ms** (704–991) | 240 | 892 | 0.004 | 4, 408 ms | 24 |
| `/markets/western-australia` | **964 ms** (888–1,123) | 228 | 644 | 0.004 | 5, 505 ms | 25 |
| `/markets/great-britain/grid` | **1,309 ms** (1,273–1,353) | 1,068 | — | **0.17** | **5, 817 ms** | **44** |
| `/returns` | **630 ms** (580–739) | 228 | 596 | 0.042 | 1, 55 ms | 15 |

Warm repeat visits in the same browser context: 263 ms (`/`), 281 ms (GB), 444 ms (WA),
651 ms (grid), 225 ms (`/returns`).

Three findings:

- **The grid tab is the expensive one.** 0.82 s of main-thread long tasks, the longest 364 ms,
  and CLS 0.17 — above the 0.1 "needs improvement" line. It draws 136 SVG nodes and makes 44
  requests, 589 KiB identity-encoded. The map is drawn after the page shell, so content shifts
  when it lands. Observed fact, Strong. What would change it: reserving the map's height before
  data arrives, or drawing the static layers in an idle callback.
- **Market pages spend 0.41–0.51 s in long tasks**, the largest single-blocking cost after the
  map. GB: 4 tasks, max 203 ms. WA: 5 tasks, max 166 ms. This is render work, not downloads —
  the transfer is 376–388 KiB identity, against roughly a third of that if the preview server
  gzipped it as production does.
- **The home page is not CPU-bound.** 73 ms of long tasks, but 850 ms to ready and 780 ms LCP.
  It is waiting — on the briefing module and the investor data — not calculating. Observed
  fact, Fair: a trace with network and main-thread timelines would separate the two; this
  baseline records only the totals.

**Limits of these browser numbers.** `vite preview` serves identity encoding and revalidates
hashed assets, so transfer sizes are an upper bound and warm visits are not production cache
hits. There is no CPU or network throttling, no mobile device, and no field data — these are
desktop, localhost, unthrottled. The grid tab's LCP is absent in the median sample: its largest
paint is the SVG map, which the LCP API does not report reliably. Treat the absolute
milliseconds as this host's, and the ratios between routes as the transferable result.

## 5. Bottleneck ranking

| # | Bottleneck | Evidence | Marker | What would change the ranking |
|---|---|---|---|---|
| 1 | Full E2E run repeated against production after every publish | 8.40 min of a 9.7 min publish job; 5.68 min on the data run | Strong | A five-route smoke check replacing it, measured over five publishes |
| 2 | E2E suite size | 6.25–8.33 min CI; 19.4 min local; `story.spec.js` alone 6.1 min | Strong | Parallelising the story file, or workers: 4 |
| 3 | GB grid map render | 817 ms long tasks, 364 ms max, CLS 0.17 | Strong | A profile of the map's draw path; a height reservation test |
| 4 | Unit suite | 3.32–4.42 min CI; 251–364 s local; 1,290 tests | Strong on cost, Thin on where | Per-file timings, which this baseline does not capture |
| 5 | ETL wall time | 158.4 s local; JEPX 62.5 s, GB EAC 31.7 s | Strong | Parallel JEPX fetch; an unchanged-content check on GB EAC |
| 6 | First-load budgets nearly full | entry 1.2%, home 2.5%, shared 0.5% headroom | Strong | Any new eager import; the next market added |
| 7 | Local build loop | 51–80 s locally against 13–18 s in CI | Fair | A second host; it does not affect CI or readers |

The build is deliberately last: it is slow only on this laptop, and no reader waits for it.

## 6. What to change first

### ETL

1. **Fetch the three JEPX areas concurrently.** They are independent series from one provider;
   the loop is sequential. The measured 62.5 s should fall to roughly the slowest single area
   (28.5 s) — an estimate, not a measurement. Re-run `node etl/run.mjs --dry-run --only
   jp-tokyo-jepx,jp-kyushu-jepx,jp-hokkaido-jepx` afterwards and compare `summary.json`.
2. **Stop refetching an unchanged GB EAC archive.** `gb-eac-response` takes 31.7 s and produces
   39,528 points every run. Its snapshot already carries a content checksum; a conditional
   request or a checksum comparison before parsing would remove most of that when the archive
   has not moved. This needs a source-behaviour check first, not a guess.
3. **Leave the 45-day backfill cap alone.** It is the mechanism that keeps ENTSO-E from being
   hammered; shortening the run by raising it would trade one faster run for a blocked IP.

### CI and E2E

4. **Replace the live full suite with a five-route smoke check.** The publish job already scans
   the exact artefact, and the test job has already run all 168 assertions on it. What the live
   step uniquely proves is that production serves the routes and the release stamp matches.
   Five navigations — the same five this baseline measures — would prove that in well under a
   minute. Expected saving 6–8 min per publish; verify over five publishes before deleting the
   old step.
5. **Run four Playwright workers, or parallelise `story.spec.js`.** The runner has four cores and
   the config pins two workers. The story file is 6.1 min on desktop alone; Playwright's own
   report suggests parallelising within it. Measure before and after with `npm run test:e2e`;
   do not assume the speed-up is linear.
6. **Cache the Chromium download.** 0.23–0.37 min twice per publish. Small, but it is free once
   the cache key is the Playwright version.

### Frontend

7. **Reserve the grid map's height and defer its first draw.** CLS 0.17 is the only metric here
   outside a "good" band, and the 364 ms longest task is the largest single block on any route.
   A fixed aspect-ratio container removes the shift; drawing the static boundary first and the
   interactive layers on idle should cut the blocking time. Target: CLS ≤ 0.1, long tasks
   ≤ 400 ms, ready ≤ 1.2 s.
8. **Do not add to the first load without removing something.** Entry has 1.98 KiB of headroom,
   shared 0.82 KiB, home 6.76 KiB. The next market, or the next shell import, will almost
   certainly breach one of them. The cheapest known reduction is `congestionRegistry` (52.1 KiB
   of the 170.18 shared): it is only needed by markets with a congestion register.
9. **Leave the large JSON alone.** It is not on any page's critical path; moving or compressing
   it changes deploy size, not reader latency.

## 7. Targets

Set from the measured baseline, not from a generic ideal. Each is a number a later run of
`npm run perf:report` can check.

| Target | Now | Goal | Why this number |
|---|---:|---:|---|
| CI push, total | 20.3 min | **≤ 14 min** | Remove the duplicate live suite; keep every gate |
| E2E, CI | 6.3–8.3 min | **≤ 5 min** | Four workers or a parallel story file |
| E2E, local | 19.4 min | **≤ 12 min** | Same change, measured on this host |
| GB grid, long tasks | 817 ms | **≤ 400 ms** | Below the current market-page range |
| GB grid, CLS | 0.17 | **≤ 0.10** | "Good" threshold |
| GB grid, ready | 1,309 ms | **≤ 1,200 ms** | Within the other market pages' range |
| ETL, local dry run | 158.4 s | **≤ 110 s** | Parallel JEPX plus an unchanged EAC check |
| Entry gzip | 168.02 KiB | **≤ 170 KiB** | Hold the budget; do not raise it |
| Home first view | 258.24 KiB | **≤ 265 KiB** | Hold the budget |
| WA visit cost | 276.5 KiB | **≤ 260 KiB** | Moves it below GB's current 259.6 |

## 8. What this baseline does not cover

- **No field data.** No CrUX, no real-user percentiles, no mobile network. Every browser number
  is desktop Chromium on localhost, unthrottled.
- **One host.** The build and E2E numbers are this laptop's; CI is about 4× faster on the build
  and 2–3× faster on E2E. Use CI figures for capacity planning, local figures for the development
  loop.
- **Host variance is large.** Six build runs spanned 51–80 s, and browser sessions on the same
  build moved route medians by up to 77% (home 850–1,503 ms, grid 1,309–1,871 ms) — this laptop
  throttles under sustained load. The ranking did not change between sessions; the absolute
  numbers did.
- **Two CI runs, not a trend.** Step timings were read from two successful runs on 2026-11-04.
  The workflow API is reachable; a longer history was not pulled.
- **No per-file unit timings.** The suite total is measured; which of the 1,290 tests cost the
  most was not. A TAP capture would answer it.
- **No Fingrid or ENTSO-E timings.** The local run had no keys, so fourteen datasets skipped in
  milliseconds. CI has `FINGRID_API`; its ETL step is 58.2 s, but per-dataset timings for those
  series only exist from the first run after this branch deploys.
- **No production RUM.** The site makes no analytics request beyond Vercel's own, and this work
  added none. There is no per-page timing in the field, by design.

## 9. Files

| File | Change |
|---|---|
| `scripts/perf/measure.mjs` | The measurement utility: bundle inventory, timed build, five browser routes, JSON output |
| `perf/performance-baseline.json` | The machine-readable record this document describes |
| `etl/run.mjs` | Per-dataset and total wall time, in the log and in `etl/out/summary.json` |
| `package.json` | `perf:bundle`, `perf:browser`, `perf:report` |
| `docs/performance-baseline.md` | This document |
