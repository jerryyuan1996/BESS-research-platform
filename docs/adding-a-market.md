# Adding a market

The whole architecture is built around making this cheap — but "cheap" has a specific meaning
here, and this page used to overstate it.

**Wiring a market touches one new directory and two lines.** Nothing else in the application needs
to change: the cards, the nav, the routes, the league table and the $1M engine all derive from the
registry.

**Registering one requires considerably more**, because the structural tests hold every registered
market to the same contract. Finland was added in August 2026 and failed seventeen assertions on
first attempt, every one of them naming something real. The full list is in
[Step 6](#step-6--the-registration-contract). Read it before estimating the work.

---

## The short answer: how do I add Japan?

```bash
cp -r src/markets/_template src/markets/jp
```

1. Fill in `src/markets/jp/manifest.js` — identity, currency, locale, colour, metadata.
2. Fill in `src/markets/jp/comparison.js` — the archetype, scores, capabilities, economics.
3. Register it in `src/markets/registry.js`:

```javascript
import jp from './jp/index.js';

export const markets = [wa, gb, ie, ro, pl, jp];
```

4. `npm test` — registry validation tells you if anything is missing or inconsistent.

Japan is now live. With no other edits it appears in:

| Surface | Comes from |
|---|---|
| Market universe cards | `home/marketGrid.js` iterating the registry |
| Application navigation | `components/navigation.js` iterating the registry |
| Route `/markets/japan` | `app/router.js` + `manifest.slug` |
| League table column | `home/marketComparison.js` iterating the passed market list |
| Revenue-anatomy stacked bar | `home/normalizationView.js` |
| `$1M` engine matrix rows | `home/allocationMatrix.js` — one row per *applicable* route |
| Hold-IRR grouped bar chart | same |
| Certainty-frontier scatter point | same |
| `$1M` waterfall market selector | same |
| Header kicker, market counts, captions | derived, never literal |

**The dashboard is NOT optional.** This page said it was, and the delivery note for the Japan
round repeated it. The tests disagree: `every market exposes the full module surface` requires a
`dashboard` or a `loadDashboard`, and `every dashboard has the same ten non-comparison tabs`
requires the tab strip to match every other market's.

What is true is the weaker statement: a market can be *built* before it is *registered*, and the
pending-migration page exists for a market whose module is present but not yet in the registry
array. That is a real intermediate state and it is worth using — Finland sat in it for a day.

---

## Step 6 — the registration contract

Adding the import and the array entry makes the market real to every surface at once, so the tests
insist it can answer every question those surfaces ask. All of these are required:

| Required | Where | What fails without it |
|---|---|---|
| congestion register | `<market>/congestion.js`, joined in `congestionRegistry.js` | `no congestion register — it would be absent from the home comparison` |
| grid map | `<market>/gridMapData.js`, self-registering, plus a boundary | `no grid map resolves for this market` |
| transmission voltage row | `governance/transmissionVoltage.js` | `no transmission voltage definition` |
| bounding box | `etl/sources/osm-grid.mjs` | `no bounding box` |
| pipeline source declaration | `governance/projectPipelineSources.js` — `NO_SOURCE` counts, silence does not | `no pipeline source declaration` |
| dashboard | `<market>/dashboard.js` + the standard ten tabs | `no dashboard, eager or lazy` |
| non-null `modelVersion` | `manifest.js` | `manifest.modelVersion is still null` |
| decision profile | `markets/decisionProfiles.js` | an unclassified `refinement` field |
| authority classification | `governance/authority.js` for any new field | `add these to COMPARISON_AUTHORITY` |
| `source` on every range, symmetric dispersed bands | `<market>/comparison.js` | `needs a source`, `a computed dispersed band must be symmetric` |
| country flag | `components/navigation.js` **and** `styles/flags.css` | silent UN placeholder, no test |

Several hardcoded lists also need the new market appended: the expected market ids and counts in
`tests/registry.test.js`, the grid-map id list in `tests/grid-maps.test.js`, and the chunk count and
per-market budget in `tests/bundle-budget.test.js`. Those are deliberate — a market appearing in a
count without anyone noticing is exactly what they prevent.

### A market that is not ready for the engine

`comparison.engineReady: false` registers a market while keeping it out of the league table, the
$1M engine and the certainty frontier. Use it when the structure is evidenced and a revenue line is
not.

An unevidenced required field is `null`, never `0`, and the market declares why in
`economics.unavailable` — see `UNAVAILABLE_REQUIRES_UNREADY` in `markets/schema.js`. Zero is a
claim that the market earns nothing; null is the absence of a claim. Validation refuses a null
required field on an engine-ready market, and `tests/registry.test.js` asserts that nothing computes
on an unready market's economics.

---

## Step 1 — `manifest.js`

Required (validation fails without them): `id`, `slug`, `flag`, `shortName`, `name`, `currency`,
`locale`, `status`, `color`.

Two constraints worth knowing before you start:

- **`currency` must have an FX rate** in `src/comparison/assumptions.js`. Without one the market
  cannot be normalized into USD and validation rejects it. Adding a rate is a one-line change, but
  it is a change to a *frozen assumption* — do it deliberately.
- **`color` should be an unused `--s1` … `--s14`** token. Two markets sharing a colour makes the
  grouped charts unreadable. Fourteen is the practical ceiling for a categorical ramp — a fifteenth
  market should reach for a second visual channel (dash pattern, marker shape) rather than a
  fifteenth hue.
- **Add the market's flag to two places, not one.** `COUNTRY_FLAGS` in
  `src/components/navigation.js` maps a market id to a country code, and `src/styles/flags.css`
  vendors that one flag. Miss either and the market silently renders the UN placeholder — which is
  exactly what Germany, Italy and the NEM did between the 2026-08 round and the US round.

Freshness metadata — `asOf`, `dataDate`, `modelVersion`, `lastVerified`, `sourceHealth` — should be
present as keys even when you do not yet have the value. **Leave them `null` rather than guessing.**
GB, IE, RO and PL currently carry `null` for `dataDate` and `modelVersion` for exactly this reason.

## Step 2 — `comparison.js`

This is the only thing the global comparison engine reads. It never touches your dashboard, your
data files or the DOM.

```
market/comparison.js  ──►  comparison/engine.js  ──►  home page
```

All economics are **per MW, per year, in the market's own currency**. The engine converts.

### Capabilities decide which routes apply

```javascript
capabilities: {
  capacityMarket: true,      // an auction / CRM / RCM that pays for availability
  merchant: true,            // wholesale spread exposure
  ancillaryServices: true,   // system-service revenue
  tolling: false,            // a tolling or floor structure with market precedent
}
```

A `false` flag means the route is **genuinely unavailable**, not zero-valued. The engine returns
`{ na: [...] }`, the `$1M` engine omits the row, and the league table prints `N/A`. It never
substitutes a zero. Romania is the worked example: no capacity mechanism, so it has one row in the
matrix rather than a 0% capacity row.

Set a capability `true` only if you have populated its economics fields — validation enforces the
pairing:

| Capability | Requires |
|---|---|
| `capacityMarket` | `contracted`, `contractYears`, `postFactor` |
| `tolling` | `toll`, `tollYears` |
| `merchant` | `merchGross`, `feePct` |
| `ancillaryServices` | `services` |

### Obligation notes

High capacity pay always comes with an obligation. Record it:

```javascript
capNote: ['RCM refund exposure; 10-yr fixed-price election', 'RCM退款敞口；10年固定价选择权'],
```

It renders under the route name in the `$1M` engine. This is a substantive disclosure, not decoration.

## Step 3 — register it

Two lines in `src/markets/registry.js`. Registry order is display order everywhere, and it is the
tie-break order for best/worst highlighting in the league table.

## Step 4 — validate

```bash
npm test
```

`tests/registry.test.js` checks unique ids and slugs, required manifest fields, metadata keys, FX
coverage, capability/economics consistency, and that the strategy resolution is what you expect.

---

## Building the dashboard

There are two ways, because the prototype contained two generations of code. Both expose the same
module contract, so the application cannot tell them apart.

### Path A — the shared block engine (recommended)

This is how GB, IE, RO and PL work. You describe each tab as data; `src/markets/_shared/` draws it.
You write **no rendering code at all**.

```
markets/japan/
├── mkt.js        locale, currency, timezone, COD years, seed tag
├── tabs.js       [[id, [en, zh]], …]
├── sources.js    source register
├── data.js       M — the market dataset
├── sections.js   buildSections(api) — one block spec per tab
└── dashboard.js  ~20 lines; copy one of GB/IE/RO/PL verbatim and change the imports
```

A section is a spec:

```javascript
SEC_B.capacity = function (){
  return { blocks: [
    { t:'card', title:['Capacity mechanism','容量机制'], badges:['calc'], live:false, blocks:[
      { t:'kpis', items:[{ l:['Clearing price','出清价'], v: fmtC(O.price) }] },
      { t:'bar', cfg:{ xs:[…], series:[…] } },
      { t:'why', text:[…], sig:[…] },
    ] },
  ] };
};
```

You get ~40 block types, and every interactive widget — scorecards, augmentation grids, the pipeline
table, the duration sweep — behaves identically to the other markets for free. Block types and
the full list are in [`../src/markets/_shared/README.md`](../src/markets/_shared/README.md).

Take this path unless you have a specific reason not to.

### Path B — hand-written sections

This is how WA works, and it predates the engine. Choose it only when a market needs rendering the
block engine genuinely cannot express — WA's RCM forecast engine and dispatch co-optimiser are the
real examples.

1. **`tabs.js`** — `[[tabId, [en, zh]], …]`. Each `tabId` becomes a URL segment. First is the default.
2. **`state.js`** — market-local state only. **Never** language or theme; those are application
   state and a market must not own them. Expose `lang`/`theme` as getters if section code needs to
   read them.
3. **`sections/`** — one module per tab, exporting `render<Tab>(main)`.
4. **`sources.js`** — the source register, kept next to the market.
5. **`dashboard.js`** — `(container, { tabId, basePath }) => void`. Composes header, nav, the active
   section and the footer from shared components.
6. Add `tabs` and `dashboard` to the object in `index.js`.

Even here, a market-specific *composite* chart is fine — WA's `dispatchChart` is one. Build it from
the shared primitives (`S`, `axisText`, `niceTicks`, `tipShow`) and keep it in the market's `lib/`.

### What you must not do

- **Do not copy a chart implementation.** There is one `src/charts/`. The prototype carried six
  byte-identical copies of the same library; that is the duplication this refactor removed.
- **Do not copy `card`, `badge`, `chip`, `why`, `kpi`, tables or meters.** They are in
  `src/components/`.
- **Do not build a theme system.** `src/app/theme.js` owns it.
- **Do not redeclare `L()`.** `src/app/i18n.js` owns it.
- **Do not add market CSS unless it is genuinely market-specific.** The shared tokens and components
  cover the cockpit's entire visual vocabulary. If you find yourself needing a new component, it
  probably belongs in `src/components/` where the next market can use it too.

A market-specific composite chart *is* legitimate — WA's `dispatchChart` is one. Build it from the
shared primitives (`S`, `axisText`, `niceTicks`, `tipShow`) rather than reimplementing them, and keep
it in the market's `lib/`.

---

## Migrating a market from the legacy bundle

All five prototype dashboards are already migrated. This section records the procedure, because it
is what you would repeat if another dashboard arrives in the same single-file form.

**Check for a shared lineage first.** GB, IE, RO and PL turned out to be four instances of one
generated engine — 1,039 byte-identical lines. Migrating them one at a time in the WA style would
have produced four copies of that engine. Diff the payloads against each other *before* deciding the
unit of work:

```bash
# extract each payload, then diff the region between the shared-primitives comment
# and `const TABS` — if it is identical, extract it once
```

The per-market procedure:

1. **Extract the payload.** Read the `<script type="text/plain" id="dash-XX">` block and undo the
   build-time escaping: replace `<\/` with `</`. You now have a standalone HTML document.

2. **Diff its CSS against `src/styles/`.** For WA this returned zero lines that were not already in
   the shared stylesheets. Expect the same; anything genuinely new goes in a market-local `.css`.

3. **Diff its chart library against `src/charts/`.** For WA the only differences were three reworded
   comments. Do not migrate a chart library.

4. **Map the module boundaries by line range** — data blocks, computation helpers, one range per
   tab render function. Note the internal call graph first: WA's `renderRcm` tail-calls
   `renderBrcp`, `renderLab` tail-calls `renderOptimizer`, and `renderPortfolio` calls four
   `kemerton*Card` helpers that live in other tabs' modules.

5. **Slice by line range rather than retyping.** This is the important one. The bodies are thousands
   of lines of authored prose, seed values and formulas; retyping them invites silent drift. Cut the
   ranges out programmatically and add only an import header and an export footer. WA's section
   bodies are byte-identical to the prototype.

6. **Split the market's `state`.** `lang` and `theme` move to application state; everything else
   stays market-local. Exposing `lang`/`theme` as getters on the market state object means the
   sliced section code needs no edits at all.

7. **Replace `renderHeader` / `renderNav` / `renderFooter` / `render`** with the shared components
   and a `dashboard.js`. Keep the market's own metadata and its page-specific header control.

8. **Run every tab and assert zero console errors**, then compare each tab against the legacy file
   open side by side.

Three traps worth knowing in advance, all of which bit during the migration:

- **Object property keys shadow the single-letter helpers.** `{ h: 4 }` is data, not a call to
  `h()`. Seed records look like `{ n, mw, h, cod, st }`. Resolve imports from actual call sites
  (`name(`), not bare word matches.
- **The spread operator looks like property access.** `...KEMERTON.configHistory` is a reference to
  `KEMERTON`; a naive "not preceded by a dot" rule misses it and you get a `ReferenceError` on one
  tab only. Strip `...` before matching.
- **A clean build proves nothing about function bodies.** Rollup will happily build a module that
  calls an undefined local — the failure is a runtime `ReferenceError`. Exercise every tab in a
  browser and watch the console. That is how a missing `waterfall` import surfaced, on the
  Investment Lab tab of four markets at once, after a build that reported no errors.
