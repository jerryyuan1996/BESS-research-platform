# P1-A — SVG grid map rendering and browser performance

The map was the largest single block of main-thread work on any route: 8,100 SVG
nodes on the GB grid tab, 7,779 of them transmission segments built one at a
time, and a layer that was thrown away and rebuilt every time another voltage
band arrived. Phase P1-A made the layer incremental, merged its geometry, stopped
redrawing markers on every pointer event, and removed the one layout shift the
map shell was causing.

The map's own cost on the GB grid route fell by about three quarters. The route's
totals fell much less, because most of what remains is not the map — and this
document says where it is instead, which is the more useful result.

| | Before | After | Note |
|---|---:|---:|---|
| SVG nodes, GB grid, detail zoom | **14,942** | **144** | 7,964 transmission nodes became 8 |
| Transmission layer rebuilds per visit | 1 per band arrival | **0** | Measured with a MutationObserver |
| Long tasks attributable to the map | **274 ms** | **68 ms** | Isolation run, same build, grid data blocked |
| Route long tasks, median of 4 | 1,549 ms | 1,343 ms | −13%; the rest is the page shell |
| Route ready, median of 4 | 3,834 ms | 2,936 ms | −23% |
| CLS | 0.213 | 0.171 | −0.042 from this work; the rest is not the map |
| Entry gzip | 168.03 KiB | 168.03 KiB | Unchanged; budgets hold |

All figures are from 2026-11-04 on the analyst's laptop, with the two builds
measured alternately in one browser. The host was carrying other work for part of
the session, so the absolute milliseconds are its own; the ratios and the node
counts are the transferable result. See *Before and after* for the method and the
three session medians.

## 1. What was measured first

`docs/performance-baseline.md` recorded the totals — 1,309 ms ready, 817 ms of
long tasks, CLS 0.17 — and named the map as bottleneck 3 without saying which
operation inside it. A1 needed that. Nothing was instrumented into the component:
the market-shared chunk has under a kilobyte of budget headroom, so timing hooks
that ship are timing hooks this repository cannot afford.

Two things did the measuring, both outside the bundle:

- **A CDP CPU profile** of a window the harness opens around one named
  interaction (`scripts/perf/profile-grid-map.mjs`). Self time is attributed to a
  function, inclusive time to its subtree, and `(idle)` is counted separately —
  which is how network latency is separated from main-thread cost rather than
  guessed at.
- **A MutationObserver** installed before any page script runs, which records when
  each layer first appears and how many times the transmission layer is emptied
  and refilled.

`npm run perf:profile` builds an unminified copy into `dist-profile/` so samples
carry real function names. Same modules, same control flow, readable attribution.

### The profile

GB grid, cold load, unminified build, one run — attribution only, not a stopwatch:

| Operation | Time | What it was |
|---|---:|---|
| `renderGeographicGridMap`, inclusive | 185 ms | The whole component, boundary to last label |
| ├ `fitExtent` (projection fit) | 59 ms | d3-geo fitting the Mercator to the boundary |
| ├ `path` (geoPath over the boundary) | 55 ms | Country outline, plus `centroid` for region labels |
| ├ `update()` | 23 ms | Zones, constraints, routes, points, projects, selector, detail |
| ├ `renderPoints` | 8 ms | Markers and the collision-tested place labels |
| └ `renderTransmission` | 55 ms | 7,771 segments projected and written (as `linePathData` 34 ms + `mercatorRaw` 21 ms) |
| Transmission JSON, parse + draw | 1,080 ms | First band visible at 4,007 ms, layer created at 3,428 ms |
| Cold load, main thread busy | 2,584 ms of 16,042 ms wall | **84% of a cold visit is waiting, not rendering** |
| Warm load, main thread busy | 2,118 ms of 4,517 ms wall | Chunk and bands cached; the work is the page |

Three findings decided the work:

1. **The rebuild, not the draw.** A zoom past the detail threshold removed 7,964
   nodes, created 14,806 and blocked the main thread for **821 ms** — to add a
   band whose geometry had not changed. The layer's `replaceChildren()` was the
   single largest task on the route.
2. **The DOM, not the projection.** Projecting 7,771 segments costs 55 ms.
   Creating 7,771 `<path>` elements and inserting them into a live tree costs
   several hundred. Geometries scale with the network; nodes scale with the
   network *and* with every style and layout pass after it.
3. **Interaction rebuilt what it had not changed.** Every `pointermove` during a
   drag re-ran `renderPoints()` and `renderProjects()` — destroying and recreating
   every marker, and re-running the label placer, which calls `getBBox()` once per
   candidate position per label. A pan is a viewport transform; none of that
   produced anything different.

The largest single cost on the route after the map stopped being the problem is
not in this component at all — see §8.

## 2. Incremental transmission rendering

`src/components/geographicGridMap.js`, `src/components/transmissionGeometry.js`

**The layer keeps one group per voltage band, declared before any of them has
data.** Order therefore comes from the manifest and never from the order responses
happen to arrive in. Each group is filled once; a band that lands later cannot
disturb or reorder an earlier one, and `drawBand` refuses to draw into a group
that already has children, so a duplicate response or a second caller cannot
double the geometry.

**Segments are joined into one path per band class and style.** One path for
bulk-overhead, one for bulk-underground, one for detail-overhead, one for
detail-underground — and one more for the substation squares, which were 763
separate `<rect>`s in Great Britain. None of those nodes carried a handler, a
label or a hover; the stylesheet sets `pointer-events:none` on the whole class.
The geometry is identical — a path data string is a sequence of subpaths and their
union is the same drawing — and the subpath count is asserted against the number
of lines each file declares, so a dropped segment fails a test instead of leaving
a gap nobody notices.

**Projected geometry is cached per line**, in a `WeakMap` keyed by the line object.
A line is immutable and the projection is fitted once from the boundary, so the
result cannot go stale. This also removes a latent double projection: the previous
loop called `projection(p)` twice per point, once for the x and once for the y.

**A band that ships in parts is drawn whole or not at all.** Italy's 132–219 kV
class is two files. The old code concatenated whatever arrived, so one failed part
drew a network with a country-shaped hole in it and nothing on the map said so.
A partial delivery now discards the band, records it as failed, and does not retry
it on the next zoom step — that would turn one dead URL into a request per wheel
event. The detail toggle is the explicit retry.

**Nothing is mutated after an await if the reader has left.** The component is
built detached and attached at the end, so "not connected" only means "gone" once
it has been connected at least once; before that it means "still mounting".
`gone()` encodes that, and both the fetch continuations and the animation frame
return on it.

## 3. Layout shift

Two shifts were measured on the GB grid route with `PerformanceObserver` sources,
and neither was the map.

**0.042 — the shell, fixed.** `.ix-app` takes the padding and the max-width off
`#app` (`styles/experience.css`). It was added *after* the finished dashboard had
been rendered into it, so an 800 px document was resized under the reader. It is
now set at the moment the container is emptied and the route is dispatched
(`src/app/app.js`), before any of the page's own content exists. The shift is gone
from every run since.

**0.17 — a card in the entry tab, not fixed, not the map.** A large layout-shift
entry names a `.card` in the "How a project actually gets built here" panel,
about a second after first paint, and only in some runs. The map never appears as
a shift source in any run, and blocking every `/data/grid/` request — a page with
no transmission layer at all — leaves the shift at 0.219. It is a page-level
teardown in the research shell (`marketPage` re-parents the dashboard into a new
`<main>`), it predates this work, and fixing it means changing what the entry tab
publishes. It is recorded in §8 as the next step rather than folded into a map PR.

The map's own box needs no reservation it does not already have: the pane is a
`min-height:560px` grid cell, the SVG fills it, and 7,771 subpaths arriving inside
it change nothing outside it. `e2e/grid-map-render.spec.js` asserts exactly that,
by measuring the pane before and after the detail band lands.

## 4. Interactive updates

**A pan is one attribute write.** Every marker and every project sits at its
projected position inside the transformed viewport, so moving the viewport moves
them. `setView` now writes the viewport transform and stops; it no longer rebuilds
the point and project layers, and it no longer re-runs the label placer.

**A zoom does one frame's work.** Two things change that are expressed in the
layer's own coordinates: each marker's counter-scale, and which projects are close
enough to merge. Both are handled in a single `requestAnimationFrame` callback, so
a wheel gesture that fires a dozen events still gets one frame's work. A hidden tab
never paints, so if the document is hidden the work runs immediately rather than
waiting for a frame that may not come.

**A selection moves a class.** Choosing a different marker used to re-render six
layers to add one class name — 130 ms of work on Great Britain. It now toggles
`selected` on the registered selectables, updates the `<select>`, and rebuilds only
the detail panel, which is the only thing whose content actually differs.

`renderPoints` and `renderProjects` remain what they were: full rebuilds on a
period or layer change, where the set of drawn features genuinely changes.

## 5. What the tests hold

**Unit — `tests/grid-map-rendering.test.js`** (10 tests, no browser). The merge is
pure and injectable, so the properties that matter are asserted directly: every
drawable segment becomes exactly one subpath, the path data is the same drawing,
band class and underground stay apart, an unprojectable point drops its segment
rather than writing `undefined` into path data, a line is projected once and reused
across bands, substations collapse to one path per class. Two tests read the real
GB files and hold the subpath count against the `lines` count each file declares —
7,771 and 6,272 — so a data refresh is checked without the test hard-coding a
number the refresh would invalidate.

**Browser — `e2e/grid-map-render.spec.js`** (8 tests × desktop and mobile), against
the built site, for Great Britain, Germany, Italy, Western Australia and Romania:

1. Every market draws exactly the segments its manifest declares, band by band, and
   each band's segment count becomes at most four elements.
2. Band groups exist in manifest order before any of them has data.
3. Only the backbone is requested until the reader zooms; the detail band is
   requested by the gesture, and is visible once it has arrived.
4. Repeated zooming adds and removes nothing from a drawn layer — asserted with a
   MutationObserver, which catches a rebuild long before it catches a wrong picture.
5. Selecting a marker rebuilds neither the point layer nor the transmission layer.
6. The map pane's height does not change when the detail band lands.
7. With every `/data/grid/` request aborted the map still draws its base, its
   markers and its own labels, offers no toggle for a download that failed, and
   raises no page error.
8. A band that arrives in parts is drawn whole or not at all — Italy's 132–219 kV
   class with one of its two files blocked.

`tests/map-selection.test.js` still passes unchanged: it guards the pointer-capture
selection path, and the class-move refactor keeps the shape it asserts.

## 6. Before and after

The two builds were measured **alternately, in one browser, in the same session**,
so that host drift lands on both sides equally. A block A-then-B comparison is not
usable here: the same build's ready time moved by more than 2× across the session.

Medians of four cold loads, 1440×1000, `vite preview`, no throttling:

| | Before | Before, grid data blocked | After |
|---|---:|---:|---:|
| Ready | 3,834 ms | —¹ | **2,936 ms** |
| CLS | 0.213 | 0.219 | **0.171** |
| Long tasks, cumulative | 1,549 ms | 1,275 ms | **1,343 ms** |
| Longest task | 574 ms | 591 ms | **532 ms** |
| SVG nodes (after settle) | 8,100 | 136 | **141** |
| Transmission nodes | 7,964 | 0 | **5** |
| Requests | 44 | 44 | **44** |

¹ The blocked run has no transmission layer, so its ready signal is not the same
event and the number is not comparable. It is in the table for the two columns
that are: long tasks and CLS.

**The isolation column is the important one.** Blocking `/data/grid/` removes the
map's network entirely and leaves 1,275 ms of long tasks — so of the 1,549 ms
before, **274 ms belonged to the transmission layer**, and of the 1,343 ms after,
**68 ms does**. The map's blocking cost fell by about three quarters; the route's
total fell by 13% because the map was never most of it.

Two earlier interleaved sessions, same method, agree on direction and rough size:

| Session | Ready, before → after | Long tasks, before → after |
|---|---|---|
| 4 runs | 6,078 → **3,908 ms** (−36%) | 1,748 → **1,564 ms** (−11%) |
| 5 runs | 2,883 → **2,609 ms** (−10%) | 1,499 → **1,362 ms** (−9%) |

Interaction cost, from the profiler's wall clock around one gesture, one run each
side. The profiler inflates both columns; the ratio is the reading:

| Gesture | Before | After |
|---|---:|---:|
| Three zoom steps, including the detail-band arrival | 3,875 ms | **1,410 ms** |
| A 24-step drag | 2,337 ms | **728 ms** |
| Toggling a layer off and on | 535 ms | **193 ms** |
| Selecting a marker | 824 ms | **115 ms** |

**What did not change.** Requests 44 → 44. Entry gzip 168.03 → 168.03 KiB, home
first view 258.25 → 258.26, `market-gb` 132.26 → 132.27. `npm run test:budget`
and `npm run test:bundle` pass against the built output. No data file, model
result or published figure was touched: `npm run test:current` is unchanged.

**Rendering fidelity.** A 420×275 crop of the same region at the same zoom, before
and after, differs by a mean of **0.96/255 per channel**, with 3.1% of pixels
differing by more than 8 — the substation squares and the coastline. Joining
thousands of strokes into one does change how overlaps composite, and at the
stylesheet's current `stroke-opacity` the difference is below that threshold;
raising it to 0.85 made the match *worse* (2.27/255), so the stylesheet was left
alone.

## 7. Targets

| Target | P0 baseline | Goal | Result | |
|---|---:|---:|---:|---|
| GB grid, CLS | 0.17 | ≤ 0.10 | **0.171** | Not met |
| GB grid, cumulative long tasks | 817 ms | ≤ 400 ms | **1,343 ms** | Not met |
| GB grid, ready | 1,309 ms | ≤ 1,200 ms | **2,936 ms** | Not met on this host; −23% against the same-host baseline |
| Network requests | 44 | no increase | **44** | Met |
| Entry / home / market-shared gzip | 168.02 / 258.24 / 170.18 | hold budgets | **168.03 / 258.26 / within budget** | Met |

The first three are not met, and none of them is any longer a map problem. The
evidence is the isolation column above: a page with no transmission layer at all
runs 1,275 ms of long tasks and shifts 0.219. Reaching those numbers needs the
page shell, not this component. §8 names where.

## 8. What is left

Ranked by measured cost on the GB grid route after this change.

| # | Bottleneck | Evidence | Marker |
|---|---|---|---|
| 1 | **The tab strip's `settle()`**, `src/components/navigation.js` | 828 ms of self time in a 2,584 ms busy cold load — 32%. Driven by a ResizeObserver/MutationObserver on the strip; `update()` writes `data-overflow`, which can change layout and re-enter. | Strong on cost, Fair on the loop itself: the profile shows the cost, not the call count |
| 2 | **The research shell re-parents the rendered dashboard**, `src/markets/marketPage.js` | The 0.17 CLS entry names a `.card` in the entry tab going to 0×0 about 1 s after paint; `container.replaceChildren(siteHeader, research, siteFooter)` moves the whole dashboard under a new `<main>` after it has been painted. | Strong on the shift, Fair on the mechanism |
| 3 | **Script compile and evaluation**, `(program)` | 869 ms of the same busy window; the market chunk is 344 KB raw. Not reducible by anything in this component. | Strong |
| 4 | **Formatting and model work** | `finance.js` 97 ms, `numberFormats` 66 ms, `npvOf` 28 ms on the grid route, which shows no model output above the fold. | Fair — a profile of one run |

The map is no longer in this list. Its remaining cost is 55 ms of projection for
7,771 segments, once per band, which is what projecting a national network costs.

Two things were considered and rejected:

- **WebGL.** Out of scope, and the measured need is not there: the layer is now
  eight nodes. A renderer migration would not move any of the four numbers above.
- **Drawing the backbone in an idle callback.** It would move the map's 68 ms off
  the critical path and delay the network appearing. That is a worse trade for a
  reader who came to look at the network, and it buys 68 ms of a 1,343 ms total.

## 9. Reproducing this

```bash
npm run build                 # the built site is what every number here describes
npm run perf:profile          # unminified build + CDP profile of the grid route
                              #   → perf/p1-profile.json, function-level attribution
npm run perf:browser          # route totals: ready, CLS, long tasks, requests
npx playwright test e2e/grid-map-render.spec.js    # the map's own regressions
npm run test:budget           # bundle budgets, against dist/
```

`npm run perf:profile` writes `dist-profile/`, an unminified copy made only so the
profiler can name functions. It is git-ignored and never deployed.

The interleaved A/B used in §6 is not a committed script: it is two `vite preview`
servers and a loop that navigates each in turn. The measurement that matters —
`beforeNoGrid` — is `page.route('**/data/grid/**', route => route.abort())` on the
unmodified build, which needs no script at all and is the cheapest way to check
the claim that the map is no longer a bottleneck.

## 10. Files

| File | Change |
|---|---|
| `src/components/geographicGridMap.js` | Band groups, incremental drawing, projected-geometry cache, class-move selection, viewport-only pan, one frame of work per zoom, `gone()` guards |
| `src/components/transmissionGeometry.js` | New. Segment and substation joining, pure and injectable |
| `src/app/app.js` | `.ix-app` set at route dispatch, before the container has content |
| `src/markets/marketPage.js` | `.ix-app` set while the container is empty, not after the dashboard is rendered |
| `tests/grid-map-rendering.test.js` | New. The merge's properties, and the two real GB files |
| `e2e/grid-map-render.spec.js` | New. Five markets, both viewports, the nine behaviours listed in §5 |
| `scripts/perf/profile-grid-map.mjs` | New. CDP profiling harness; `npm run perf:profile` |
| `perf/p1-profile.json` | New. The attribution record this document quotes |
| `.gitignore` | `dist-profile/` |
| `package.json` | `perf:profile` |
| `docs/p1-svg-performance.md` | This document |
