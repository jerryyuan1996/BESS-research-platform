# Migration notes — Phase A analysis

Source of truth: `legacy/global-cockpit-0727-v1.html`
(copied verbatim from `reference/Global BESS Dashboard Cockpit_0727_v1.html`, 1,461,482 chars / 16,000 lines).

This document records what the prototype actually *is*, before any code was moved. It is the
reference for verifying that the refactor preserved behaviour.

---

## 1. Current architecture

The prototype is one HTML document containing six independent JavaScript programs.

```
Global BESS Dashboard Cockpit_0727_v1.html
│
├── lines    1–314   <head> + 307 lines of CSS          ← the entire design system
├── lines  315–317   <body>: <div id="app">, <div id="tip">
├── lines  318–1212  <script>   the global cockpit      ← home page, ~894 lines
│
├── lines 1213–5570  <script type="text/plain" id="dash-wa">   full HTML document
├── lines 5571–8308  <script type="text/plain" id="dash-gb">   full HTML document
├── lines 8309–10994 <script type="text/plain" id="dash-ie">   full HTML document
├── lines 10995–13482<script type="text/plain" id="dash-ro">   full HTML document
└── lines 13483–15998<script type="text/plain" id="dash-pl">   full HTML document
```

### The embedded-dashboard mechanism

Each market dashboard is a complete, standalone `<!DOCTYPE html>` document stored as **escaped
text** inside a `<script type="text/plain">` block. At build time every `</` inside the payload was
rewritten to `<\/` so the embedded HTML cannot terminate its own `<script>` element. At runtime:

```js
function dashDoc(id){
  const el = document.getElementById('dash-' + id);
  return el.textContent.split('<\\/').join('</');   // undo the escaping
}
```

…and the result is assigned to `iframe.srcdoc` inside a fixed-position overlay (`.dash-overlay`).

The comment in the prototype states the reason explicitly:

> every JS context stays isolated (the dashboards all declare top-level `state`, `M`, `render`
> and would collide if concatenated into one document)

**This is the single most important fact about the prototype.** The iframe is not a design choice;
it is a workaround for six programs that all declare the same global names. ES-module scope removes
the need for it entirely, which is exactly what the refactor does.

### Consequences of the iframe approach (all now resolved)

| Problem | Cause |
|---|---|
| No deep links — a market cannot be bookmarked | Overlay is DOM state, no URL |
| Language and theme do not propagate into a dashboard | Separate JS context, separate `localStorage` keys |
| `localStorage` throws inside an opaque `srcdoc` iframe | Guarded by the `LS` shim in the shell only |
| ~1.65 MB is downloaded to view the home page | All five dashboards are inlined |
| Browser back button does not close the overlay | No history integration |

---

## 2. Duplicated code

Measured by diffing the extracted payloads against the shell.

### The chart library is duplicated six times, byte-identical

`S()`, `niceTicks()`, `axisText()`, `roundTopRect()`, `roundBotRect()`, `legendRow()`,
`lineChart()`, `barChart()`, `waterfall()`, `bandChart()` appear once in the shell (lines 366–644)
and once inside each of the five dashboards.

A line-by-line diff of shell vs WA returns **only comment-text differences** — three comment lines
reworded. Every statement is identical. `scatterChart()` exists only in the shell.

### CSS is duplicated six times, and WA's copy is an exact subset

Diffing the shell's 307 CSS lines against WA's 262 returns *zero* lines present in WA but absent
from the shell. The shell CSS is precisely `WA CSS + hub-only additions`:

- hub-only: `.hero`, `.mgrid`, `.mcard*`, `.hm td.*`, `.seg`, `.fxrow`, `.eng*`, `.dash-overlay`,
  `.dash-bar`, `.dash-frame`
- everything else — tokens, `.card`, `.kpi`, `.chip`, `.badge`, tables, `.why`, `.timeline`,
  `.threshold`, `.waterfall-list`, `.player`, `.exit`, `.cmp`, meters, forms — is shared.

This is why the split into `tokens / global / layout / components / charts / market` (shared) plus
`cockpit.css` (home only) is a mechanical, zero-risk operation.

### Also duplicated

`h()`, `$id()`, `tipShow()`, `tipHide()`, `card()`, `chip()`, `why()`, `applyTheme()`,
`npvOf()`, `irrOf()`, and the `L()` bilingual accessor.

---

## 3. Global variables and the collision set

Every one of the six programs declares these at top level:

| Name | Shell | WA |
|---|---|---|
| `state` | `{lang, theme, exitYear, wfMarket}` | `{lang, theme, tab, codYear, …}` |
| `L` | identical implementation | identical implementation |
| `T` | hub copy strings | WA copy strings |
| `render` | renders the cockpit | renders the active WA tab |
| `applyTheme` | identical | identical |
| `$id`, `h`, `S`, `tip*`, chart fns | identical | identical |
| `NF0`, `NF1`, `fmtN`, `fmtPct` | `en-US` locale | `en-AU` locale |
| `badge` | `badge(cls, textPair)` | `badge(type)` — looks the pair up in `T` |
| `card` | appends `marginTop:14px` | no margin |
| `fmtX` | `NF2` + `'×'` | `NF1` + `'x'` |
| `npvOf`, `irrOf` | identical bisection IRR | identical bisection IRR |

Note the two signature divergences (`badge`, `card`) and the three formatting divergences
(`NF*` locale, `fmtX`). These are the only places where "the same name means different things",
and each is preserved rather than unified — see §7.

---

## 4. Market interfaces in the prototype

The cockpit's `MARKETS` array (lines 689–748) is the *de facto* market interface. Each entry:

```js
{ id, flag, short:[en,zh], name:[en,zh], href, color,
  status:[en,zh], composite, connRisk, satNote,
  arch:[en,zh], thesis:[en,zh], cur, sym,
  econ:{ hours, capexPerMW, opexPerMW,
         contracted, contractYears, postFactor,
         merchGross, feePct, services, grantPct, degr,
         toll?, tollYears?,                      // GB only
         capNote?, tollNote?, grantNote? } }
```

Crucially, these values are **hand-transcribed** from each market dashboard, not read from it. The
cockpit never touches dashboard DOM or dashboard globals — the iframe made that impossible. So the
"comparison interface" the target architecture asks for already exists conceptually; the refactor
only moves each market's slice of it into that market's own directory and gives it a name.

`href` pointed at sibling files (`../WA%20Dashboard/WA_BESS_Dashboard_v3.html`) that do not exist
in the bundle. It was used purely as a lookup key:

```js
const m = MARKETS.find(x => a.getAttribute('href') === x.href);
```

In the refactor `href` is replaced by a route derived from `manifest.slug`.

### Capability signalling was implicit

The prototype infers availability from truthiness of data fields:

- `if (!e.contracted) return { na: ['No capacity mechanism', '无容量机制'] }`
- `if (!e.toll) return { na: ['No market precedent', '无市场先例'] }`

Romania (`contracted: 0`) therefore has no capacity row; GB is the only market with `toll`. The
refactor makes this explicit as a `capabilities` block **and preserves the same `na` strings**.

---

## 5. Comparison / normalization logic

Lines 677–811 of the shell. Extracted verbatim into `src/comparison/`.

Constants:

```js
const FX   = { AUD: 0.66, GBP: 1.27, EUR: 1.08 };  // USD per unit
const LIFE = 15;                                   // years
const EXIT_Y_CONTRACTED = 0.075;
const EXIT_Y_MERCHANT   = 0.115;
const EXIT_Y_OPEX       = 0.08;
```

`runCase(m, strat, exitYear)` computes, per MW, in USD: `net`, `grant`, `capexG`, `eb1`, `yield1`,
`capY[]`, `mchY[]`, `eb[]`, `irrHold`, `payback`, `exitVal`, `irrExit`, `moic`, `cumOp`,
`contractedShare`, `kwPerM`, `note`.

`irrOf()` is an 80-iteration bisection on `[-0.9, 2.0]` returning `null` when the bracket does not
straddle zero. `pvTail(arr, r, from)` discounts `arr[from..]` back to `from`.

Three strategies: `cap` (capacity-backed), `mer` (merchant), `toll` (tolled/floor).
`baseStrat(m) = m.econ.contracted ? 'cap' : 'mer'`.

**No formula was changed.** The engine now takes a normalized comparison object instead of reaching
into `MARKETS`, but the arithmetic is line-for-line the original.

---

## 6. Hardcoded five-market assumptions found on the home page

These are what "make every comparison N-market" had to fix. All are now registry-driven:

| Location | Was | Now |
|---|---|---|
| Header kicker | literal `'WA · GB · IE · RO · PL'` | joined from registry short names |
| League caption | "best of five", "Green = best of five" | "best of N" / count from registry |
| League `best/worst` | `MARKETS.map` over the fixed array | over the passed market list |
| `$1M` engine | `MARKETS.forEach` | over the passed market list |
| Title strings | "five markets", "one dollar, five markets" | count interpolated |
| Findings text | prose naming all five | left as authored prose (see §7) |
| `state.wfMarket` | hardcoded `'pl'` | defaults to registry order, falls back if absent |

---

## 7. Deliberate non-changes

Per the brief, the following were **not** touched even where they look improvable:

1. **Authored prose is verbatim.** The `why(...)` decision-logic footnotes and the "Key readings"
   section name specific markets and quote specific numbers ("WA 10.4%", "1.06× MOIC", "five
   markets"). Rewording them to be N-market-generic would change investment commentary, which is
   out of scope. They are stored as market-agnostic *content* that the home page renders; when a
   sixth market is added the prose does not auto-update, and that is intended — commentary is
   editorial, not derived. This is documented in `docs/comparison-methodology.md`.
2. **`fmtX` differs** between hub (`1.55×`) and WA (`1.5x`). Preserved separately.
3. **`NF0`/`NF1` locale** differs (`en-US` vs `en-AU`). Preserved separately. For grouped integers
   and 1-decimal values the two locales emit identical strings, so this is invisible in output; it
   is preserved anyway rather than silently unified.
4. **`card()` margin.** The hub's `card()` sets `marginTop:14px` inline; WA's does not. The shared
   `card()` takes an options argument and each caller keeps its original behaviour.
5. **All financial assumptions, scores, IRRs, MOICs, capex, FX, durations, exit yields, wording,
   source labels, quality badges and investment conclusions** are byte-identical.

---

## 8. Probable bugs found (documented, NOT fixed)

Per §1 of the brief these are recorded rather than changed.

### B1 — `renderStack` computes `tot` but the min/max quoted in its own footnote can drift
`renderStack()` builds `tot = capMWh + mchMWh` and interpolates `fmtUSDk(Math.min(...tot))` into the
decision-logic text, but the same paragraph also hardcodes "0% (RO) to ~77% (WA)". If seed values
change, half the sentence updates and half does not. Low severity, cosmetic.

### B2 — `best.irr` in `renderEngine` compares floats with `===`
```js
const best = { irr: Math.max(...MARKETS.flatMap(...)) };
...
h('td', { class:'num' + (r.irrHold === best.irr ? ' best' : '') })
```
`runCase` is called twice for the same inputs, so the two doubles are bit-identical today and the
comparison works. It is nonetheless an exact-equality test on computed floats, and would silently
stop highlighting any cell if either call path were ever memoised or reordered.

### B3 — `renderEngine`'s IRR chart substitutes `0` for "not applicable"
```js
vals: MARKETS.map(m => { const r = runCase(m, s.id, X); return r.na ? 0 : r.irrHold * 100; })
```
The caption says "A missing bar means the strategy has no basis in that market", but the value
passed is `0`, not `null`. `barChart` renders a zero-height bar at the baseline, which reads as
"0% IRR" rather than "N/A". The brief's §10 explicitly asks that a comparison engine
"never silently substitute zero for not applicable". **Preserved as-is** to avoid a visual change;
the engine layer now exposes `na` properly so this can be fixed as a one-line change later.

### B4 — `scatterChart` y-domain can clip negative points
`niceTicks(Math.min(...ys) * 0.85, ...)` — multiplying a *negative* minimum by 0.85 moves it
*up*, toward zero, so a negative y-value ends up below the axis floor. The function has a clamp
(`Math.max(padT, Math.min(...))`) that pins such a point to the plot edge, so it never escapes the
viewBox, but it would be drawn at the wrong height. Not reachable with current seed values (all
exit IRRs are positive).

### B5 — `state.wfMarket` is hardcoded to `'pl'`
If Poland were removed from the registry the waterfall card would render `undefined`. Fixed in the
refactor by falling back to the first registered market — this is a scalability requirement, not a
behaviour change, and with the current five markets the default is still Poland.

---

## 9. Migration risks and how each was mitigated

| Risk | Mitigation |
|---|---|
| Chart output changes | Chart library moved with zero statement edits; verified by diff |
| CSS cascade changes | CSS moved verbatim, split only at comment boundaries; same import order |
| Financial output changes | `tests/baseline.test.js` asserts all 5 markets × 3 strategies × 3 exit years against values captured from the prototype |
| `L()` resolving against the wrong language | Single `i18n.js` owns `lang`; `L` imported everywhere, never redeclared |
| WA's `state.lang` reads | WA's local state exposes `lang`/`theme` as getters onto app state, so sliced WA code is unmodified |
| Sliced code drifting from source | WA sections were extracted by line range programmatically, not retyped |
| `localStorage` key collisions | Keys preserved exactly (`hub_lang`, `hub_theme`, `wa_lang`, `wa_cod`, `wa_snaps`) |
| Direct navigation to `/markets/wa` 404s on deploy | `public/_redirects` SPA fallback for Cloudflare Pages |

---

## 10. Migration status — complete

All five dashboards are migrated. 60 tabs (5 markets × 12) render with zero console errors.

| Market | Payload | Lineage | Tabs |
|---|---|---|---|
| WA | 4,356 lines | hand-written per tab | 12 |
| GB | 2,736 lines | shared block engine | 12 |
| IE | 2,684 lines | shared block engine | 12 |
| RO | 2,486 lines | shared block engine | 12 |
| PL | 2,514 lines | shared block engine | 12 |

---

## 11. The second lineage — GB / IE / RO / PL

The most consequential finding of the second migration phase, and it was not visible from the
cockpit.

**WA is a different generation of the codebase from the other four.** WA is hand-written: twelve
`render<Tab>(main)` functions building DOM directly. GB, IE, RO and PL are *generated from a common
engine* — one that WA predates.

### The proof

Diffing the four payloads against each other over the region from the shared-primitives comment to
`const TABS`:

```
IE: 5 differing lines of 1039
RO: 5 differing lines of 1039
PL: 5 differing lines of 1039
```

**1,039 lines, byte-identical in all four.** The five differing lines are a single
`Object.assign(T, { srcHealth: … })` override that GB carries and the others do not — and its
wording is identical to the default it overrides.

The four CSS blocks are likewise identical to WA's, which was already proven to be a strict subset
of the shared stylesheets. Zero new CSS was needed for any of them.

### What that engine is

A declarative block renderer. A market describes each tab as a list of blocks and `B()` draws them:

```javascript
{ t:'card', title:['Revenue stack','收入结构'], badges:['calc'], live:false, blocks:[
  { t:'kpis', items:[ … ] },
  { t:'bar', cfg:{ … } },
  { t:'why', text:[ … ], sig:[ … ] },
]}
```

Around 40 block types cover layout, content, narrative structures, charts and interactive widgets.
Because behaviour lives in the engine rather than in each market, the four dashboards mirror one
another exactly — the same scorecard, the same augmentation grid, the same Investment Lab, the same
pipeline table.

So the migration for these four was **not** four repeats of the WA procedure. It was:

1. extract the engine once into `src/markets/_shared/`
2. give each market its five data modules (`mkt`, `tabs`, `sources`, `data`, `sections`)
3. write a ~20-line `dashboard.js` per market

The four markets contribute **no rendering code at all**.

### Consequences for the shared layer

The engine overlapped heavily with what WA had already forced out into `src/`. Rather than keep two
near-copies, the shared components were widened into supersets — every change additive, so WA's
output is unaffected:

| Component | Widened by |
|---|---|
| `badge` | four label keys (`policy`, `verify`, `consult`, `peer`); unknown type falls back to `illus` |
| `statusBadge` | optional `seedTag` parameter (WA's `SEED_JSON_V1` stays the default) |
| `card`, `kpi` | accept badge *keys* as well as badge nodes |
| `sourceDrawer` | renders a source with no public URL as text instead of a dead link |
| `sourceStatusBadge` | recognises `Consultation` status |

### Divergences preserved, not unified

- **`irrOf` brackets differ.** This lineage searches `[-0.9, 1.5]`; the cockpit and WA search
  `[-0.9, 2.0]`. `_shared/lab.js` therefore keeps its own copy rather than importing
  `utils/finance.js`. Unifying them would change published IRRs.
- **`fmtX`** renders `1.5x` here and `1.55×` on the cockpit — already noted in §7.
- **Locale** comes from `MKT.locale` per market (`en-GB`, `en-IE`, `ro-RO`, `pl-PL`), which is how
  one factory serves four markets.

### One design decision worth recording

Migrated section code contains `state.tab = 'grid'; render();`. Tabs are now URL segments, so a
plain field assignment would mutate state the router knows nothing about and the next render would
overwrite it from the URL.

`state.tab` is therefore an **accessor**: the setter records the intent and `render()` turns it into
a navigation. Deep links and the back button work, and not one line of migrated section code needed
editing. Verified: clicking a walkthrough step moves the URL to `/markets/great-britain/capacity`,
and the back button returns to the previous tab.

---

## 12. Two traps found during migration

Both cost real debugging time and are worth knowing before migrating anything else.

### T1 — object property keys shadow the single-letter helpers

Resolving imports by scanning for bare identifiers matches `{ h: 4 }` — a data field named `h` — as
a call to `h()`. Seed data is full of `{ n, mw, h, cod, st }` records. Resolve from actual call
sites (`name(`), not word matches.

### T2 — the spread operator looks like property access

`...KEMERTON.configHistory` is a reference to `KEMERTON`. A rule that rejects a preceding `.` to
avoid matching `obj.name` also rejects the third dot of a spread, so the import is silently omitted
and exactly one tab throws `ReferenceError` at runtime. Strip `...` before matching.

A third, milder one: unresolved references inside function bodies are **runtime** errors, not build
errors. Rollup will happily build a module that calls an undefined local. The only reliable check is
to exercise every tab in a browser and watch the console — which is how the missing `waterfall`
import in `_shared/lab.js` surfaced, on the Investment Lab tab of all four markets at once.
