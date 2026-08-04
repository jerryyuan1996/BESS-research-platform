# Architecture

A public static site. Vite, vanilla JavaScript, ES modules, HTML, CSS. No framework, no backend,
no database, no authentication, no server-side rendering.

---

## The shape

```
                            index.html
                                │
                            src/main.js          styles, in cascade order
                                │
                          src/app/app.js         route → page, single render entry
                       ┌────────┴────────┐
                       │                 │
              src/home/homePage.js   src/markets/marketPage.js
                       │                 │
                       │                 └── market.dashboard(container, { tabId, basePath })
                       │
                       └── every section receives a market list
                                │
                    src/comparison/engine.js
                                │
                    src/markets/registry.js
                       ├── wa            hand-written sections
                       ├── nem   ┐
                       ├── gb    │
                       ├── de    │
                       ├── it    ├─ src/markets/_shared/  (declarative block engine)
                       ├── ie    │
                       ├── ro    │
                       ├── pl    │
                       ├── pjm   │
                       ├── ercot │
                       ├── caiso ┘
                       ├── jp_tokyo    ┐
                       ├── jp_kyushu   ├─ one Japan dashboard, three regional lenses
                       └── jp_hokkaido ┘

        14 allocation markets · 12 detail dashboards
        all expose the same module contract:
            { manifest, comparison, sources, tabs, dashboard }

        shared, used by all of the above:
            src/components/   card badge chip kpi meter table tooltip why
                              header navigation footer marketCard sourceDrawer
            src/charts/       line bar waterfall band scatter axes utils
            src/utils/        dom formatting finance storage validation
            src/styles/       tokens global layout components charts market cockpit
```

## The one rule that shapes everything

**The registry is the only place the application learns that a market exists.**

There is no `if (market === 'wa')` anywhere in the codebase. Every count, column, row, nav item,
route, chart series and caption is derived. If you are about to write a branch on market id, add a
capability flag or a manifest field instead.

## Layers, and what may depend on what

| Layer | May import | Must not import |
|---|---|---|
| `utils/` | nothing but `utils/` and `app/i18n` | components, charts, markets, home |
| `charts/` | `utils/`, `app/i18n`, `components/tooltip` | markets, home, comparison |
| `components/` | `utils/`, `app/`, other components | markets, home, comparison logic |
| `comparison/` | `utils/finance` | any DOM, any market module, any component |
| `markets/_shared/` | `utils/`, `charts/`, `components/`, `app/` | a specific market, `home/` |
| `markets/<id>/` | the above, plus `markets/_shared/` | another market, `home/` |
| `home/` | everything shared, plus `markets/registry` | a specific market by name |
| `app/` | everything | — |

Two consequences worth stating explicitly:

- **`comparison/` touches no DOM.** It is pure arithmetic over a data contract, which is why
  `tests/baseline.test.js` can run it in Node with no browser.
- **No market imports another market.** Cross-market work happens only in `comparison/` and `home/`.

## The market-module contract

Five keys. That is the entire surface the application sees.

```javascript
export default { manifest, comparison, sources, tabs, dashboard };
```

`manifest` and `comparison` are required. The rest are optional; a market with only the first two
participates in every home-page comparison and renders a pending-migration page at its route.

### Allocation markets vs detail dashboards

These are different counts and the codebase keeps them apart.

```javascript
ALLOCATION_MARKETS()   // 14 — exposures a portfolio can hold
DETAIL_DASHBOARDS()    // 12 — research documents
```

Tokyo, Kyushu and Hokkaido are three allocation markets and one dashboard. For a portfolio they are
three different exposures: different price formation, different grid, different saturation. For
research they are one national rulebook, and duplicating the Capacity Market and balancing rules
three times would be wrong.

A market declares this with two manifest fields:

```javascript
dashboardId: 'jp',    // which dashboard renders this market
region: 'kyushu',     // which regional lens it opens in
```

`renderMarketPage` resolves the owner and passes the region through. The URL still names the
allocation point the visitor asked for, so links, the back button and the market nav stay
consistent. `?region=compare` shows all three side by side without inventing a market that does not
exist as an allocation point.

Use `ALLOCATION_MARKETS()` for every finance comparison. Use `DETAIL_DASHBOARDS()` only for counting
documents.

### Two lineages behind one contract

All five markets expose the identical five-key surface, but they are built two different ways —
because the prototype itself contained two generations of code.

| | WA | GB · IE · RO · PL |
|---|---|---|
| Origin | hand-written, earlier | generated from a common engine |
| A tab is | a `render<Tab>(main)` function | a declarative block spec |
| Market ships | `sections/*.js`, `lib/*.js`, `data/*.js` | `mkt`, `tabs`, `sources`, `data`, `sections` |
| Rendering code in the market | yes | **none** |
| `dashboard.js` | ~120 lines | ~20 lines |

The four later markets share `src/markets/_shared/` — a block engine proven to be **1,039 lines
byte-identical across all four prototype payloads**. It was extracted once, not copied four times.
See [`../src/markets/_shared/README.md`](../src/markets/_shared/README.md) and
[`migration-notes.md`](migration-notes.md) §11.

This is the point of having a contract rather than a base class: the shell calls
`market.dashboard(container, route)` and does not care which lineage answers. A sixth market may use
the block engine, hand-write its sections, or do something else entirely.

**For a new market, prefer the block engine.** It is less code, and the behaviour of every
interactive widget comes for free and stays consistent with the other markets.

### Dashboard content is separated from comparison inputs

This is the most important boundary in the codebase.

```
Market dashboard                          Market comparison interface
    ├── detailed research                          │
    ├── sources                                    ↓
    ├── market-specific calculations       Global comparison engine
    └── investment lab                             │
                                                   ↓
                                               Home page
```

A market dashboard holds far more than the comparison needs. WA ships an RCM forecasting engine, a
dispatch co-optimiser and a project underwriting layer; none of it is visible to the home page. The
home page reads `comparison.js` and nothing else — it never scrapes dashboard DOM, never reads a
market's internal data modules, and never calls into a market's render functions.

`tests/baseline.test.js` asserts this: a market stripped to `{ manifest, comparison }` produces
numbers identical to the full module.

### Do not force one universal market schema

Markets are structurally different. WA's Reserve Capacity Mechanism, Ireland's Reliability Option and
Poland's 17-year contract do not share a shape, and flattening them into one dataset would lose the
detail that makes each dashboard worth reading.

**Standardized:** identity, routing, common metadata, the comparison interface, the sources
interface, shared component contracts.

**Market-specific:** detailed sections, market mechanisms, regulations, revenue structures,
investment labs, country-specific metrics.

## Capability-based comparison

Not every market has every mechanism. Capabilities are declared, not inferred:

```javascript
capabilities: { capacityMarket: true, merchant: true, ancillaryServices: true, tolling: false }
```

The engine includes applicable strategies, returns `{ na: [en, zh] }` for the rest, and **never
substitutes zero for "not applicable"**. Callers branch on `.na`; the league table prints `N/A` and
the `$1M` engine omits the row.

The prototype inferred availability from whether a number happened to be zero
(`if (!e.contracted) return na`). Same outcome, same message strings — but a market now says what it
is rather than being guessed at.

## Routing

```
/                        home / global cockpit
/data                    data status — feeds, freshness, and automation's limits
/markets/:slug           a market dashboard, default tab
/markets/:slug/:tab      a market dashboard, deep-linked tab
```

`/data` was added with the live-data layer. A site that fetches automatically owes its reader a page
saying what it fetched, how stale it is, and what the automation was permitted to touch.

History API, resolved by slug from the registry. The `:tab` segment is an addition beyond the
required routes: it makes every market tab linkable, which the prototype's overlay could not do. An
unrecognised tab falls back to the market's default rather than 404ing.

`/compare`, `/methodology` and `/portfolio` are named as future routes and are deliberately not
built. Adding one is a single entry in `parseRoute`.

`public/_redirects` covers these too — the SPA fallback is a wildcard, so no new rule was needed.

Deployment needs a rewrite so a direct visit to `/markets/wa` returns `index.html`.
`public/_redirects` does this on Cloudflare Pages; Vite's dev server does it natively.

## State

| State | Lives in | Scope |
|---|---|---|
| `lang`, `theme` | `src/app/state.js` | application-wide, persisted (`hub_lang`, `hub_theme`) |
| `exitYear`, `wfMarket` | `src/home/state.js` | home page only |
| tab, scenario, lab inputs, … | `src/markets/<id>/state.js` | that market only |

Components mutate state then call `requestRender()`. They never reach for the router or a page
function. `requestRender()` deliberately does not touch scroll position, because the prototype's call
sites differ: a language toggle lets the browser keep `scrollY`, a tab switch follows with
`scrollTo(0, 0)`, and the exit-year selector captures and restores `scrollY` explicitly. Each call
site keeps its own behaviour.

**A market must not implement its own theme or language system.** WA's local state exposes `lang` and
`theme` as getters onto application state, which is what allowed its migrated section code to read
`state.lang` unchanged while the value comes from one shared source.

## Charts and components

One implementation of each, used by every market and the home page.

The prototype carried six byte-identical copies of the chart library — one in the shell and one
inside each embedded dashboard. A line-by-line diff of the shell against WA returned only three
reworded comments. `src/charts/` is that single copy, moved with no statement edits.

Similarly `src/styles/`: the shell's 307 CSS lines were a strict superset of WA's 262, so the split
into shared files plus `cockpit.css` was mechanical. The recombination is verified lossless.

## CSS

```
tokens → global → layout → components → charts → market → cockpit
```

Import order in `main.js` is the cascade order of the prototype's single `<style>` block. Responsive
and print media queries live in the file that owns the majority of their selectors, always after
those selectors' base rules.

Design tokens (`--bg`, `--surface`, `--ink`, `--ink2`, `--muted`, `--grid`, `--baseline`, `--border`,
`--s1`…`--s8`, status ramp and translucent backgrounds) are unchanged, as is every colour semantic.

## Live data

The site fetches nothing at build time and holds no secrets. A scheduled GitHub Actions job runs the
ETL, writes JSON snapshots into `public/data/public/`, and commits them; Cloudflare Pages rebuilds on
the push. The browser loads those snapshots at runtime, after first render, and shows them **beside**
the analyst's approved values rather than in place of them.

```
etl/                        Node, runs in CI only — never in the browser
├── run.mjs                 orchestrator: fetch → validate → publish → detect drift
├── propose.mjs             the only program that edits an analyst file; branch-only
├── verify.mjs              CI gate: every snapshot matches its checksum
├── lib/                    boundary envelope fetch validate series summarize zip
├── sources/                ecb entsoe jepx aemo-wem
└── drift/                  detect report

src/governance/             the authority model — imported by both the app and the ETL
├── authority.js            who may change what
├── materiality.js          when drift is worth a human's attention
├── datasets.js             the dataset catalogue
├── derivation.js           approved bridge parameters
└── anchors.js              analyst-recorded observation anchors

src/derive/                 pure metric functions, no DOM   (priceMetrics merchantBridge)
src/live/                   runtime loader and provenance UI (client freshness liveValue dataStatusPage)
```

Two layering rules extend the table above:

| Layer | May import | Must not import |
|---|---|---|
| `governance/` | `markets/schema`, `comparison/assumptions` | any DOM, any market module, `etl/` |
| `derive/` | `governance/` | any DOM, any market module |
| `live/` | everything shared, `governance/`, `derive/` | `etl/` |
| `etl/` | `src/` freely | — (but may only *write* to `public/data/`) |

`governance/` and `derive/` touch no DOM, for the same reason `comparison/` does not: the ETL runs
them in Node, and the tests pin them there.

**The registry rule has a counterpart.** `src/governance/datasets.js` is the only place the platform
learns that a dataset exists — the ETL iterates it, the runtime loads from it, and the drift detector
reads it to know which assumption an observation bears on.

Full detail: [`live-data.md`](live-data.md) and [`governance.md`](governance.md).

## What is deliberately absent

No login, no accounts, no permissions, no investor authentication, no private API, no user database,
no admin panel, no backend, no CMS. Every file in the production build is public — see
`docs/data-policy.md`.

Live data does not change that. The pipeline runs in CI, not in the browser; credentials are Actions
secrets and never reach the bundle; and the site remains a folder of static files that works
completely with zero snapshots present.

**And no automated judgement.** Automation observes, computes and proposes. Every assumption, score,
thesis and market status on this site was set by a person and can only be changed by a person. That
boundary is enforced in code and asserted by `tests/governance.test.js` — see
[`governance.md`](governance.md).

## Related documents

- [`migration-notes.md`](migration-notes.md) — what the prototype was, what changed, bugs found
- [`adding-a-market.md`](adding-a-market.md) — the workflow, and how to migrate GB/IE/RO/PL
- [`comparison-methodology.md`](comparison-methodology.md) — the normalized model
- [`data-policy.md`](data-policy.md) — public vs confidential
