# Global BESS Dashboard Architecture Audit

Audit date: 2026-07-29  
Scope: repository inspection and upgrade planning only; no production implementation

## Executive finding

The repository is already a publishable, governed, multi-market research application. It is not a loose HTML prototype. Its strongest foundations are the canonical market registry, declarative shared dashboard engine, normalized global comparison engine, reusable chart/component library, and a deliberately conservative public-data ETL boundary.

The main gap is analytical rather than cosmetic: the application moves from current/historical market facts to investment outputs without a common, traceable system-planning and scenario layer. Most forward values outside Western Australia are analyst seed curves, several project pipelines are explicit placeholders, and the global comparison engine and local debt models are not yet one underwriting system. The target should therefore be an evidence and forecast architecture upgrade, not a redesign.

## 1. Current architecture

### Runtime and deployment

- The app is a Vite 5 vanilla JavaScript application using ES modules. The entry point is `src/main.js`.
- `src/app/app.js` boots the router, chooses the homepage or a market dashboard, and renders not-found states.
- `src/app/router.js` implements client-side routes:
  - `/`
  - `/data`
  - `/markets/:slug`
  - `/markets/:slug/:tab`
- `src/app/state.js`, `src/app/i18n.js`, and `src/app/theme.js` provide application state, English/Chinese rendering, and theme switching.
- There is no application framework, backend, database, authentication, server-side rendering, or private production data store.
- The deployment target is a static Cloudflare site. Public data snapshots live under `public/data/public/`.

### High-level flow

```text
src/main.js
  -> src/app/app.js
     -> src/home/homePage.js
     -> src/live/dataStatusPage.js
     -> src/markets/registry.js
        -> hand-written WA dashboard
        -> shared declarative market engine for GB, Ireland, Romania, Poland, Japan

etl/
  -> official public connectors
  -> governed validation and drift review
  -> public/data/public/*.json
  -> live data/status and merchant evidence views
```

### Architectural assessment

| Area | Current approach | Assessment |
|---|---|---|
| Routing | Small custom router in `src/app/router.js` | Appropriate for the present static app |
| Market discovery | Canonical `src/markets/registry.js` | Strong; one place controls global allocation markets and detail routes |
| Detail dashboards | WA-specific renderer plus `createMarketEngine()` for five market modules | Strong reuse, but WA and shared markets now have divergent model logic |
| State | Module-level mutable state and rerender callbacks | Simple and effective; forecast state will need a typed/validated contract |
| Charts | Native SVG modules in `src/charts/` | Lightweight and reusable; adequate for the proposed first phases |
| Data | Market-local hard-coded modules plus governed public snapshots | Good separation, but source metadata and metric provenance are incomplete |
| ETL | Node scripts with write boundaries and proposal-only analyst changes | Excellent control foundation |
| Finance | Global unlevered engine plus separate local levered labs | Valuable but inconsistent; requires reconciliation |
| Delivery | Static bundle with eager market imports | Operationally simple; bundle size and initial load are known debt |

## 2. Existing pages

### Homepage

`src/home/homePage.js` composes:

- header, disclaimer, and navigation;
- allocation-market cards through `src/home/marketGrid.js`;
- the Japan regional comparison strip through `src/home/regionalStrip.js`;
- a cross-market league table through `src/home/marketComparison.js`;
- a normalized revenue stack through `src/home/normalizationView.js`;
- the `$1M` capital-allocation engine through `src/home/allocationMatrix.js`;
- synthesized findings through `src/home/findings.js`.

The homepage is already more than navigation. It calculates normalized outcomes and compares capital efficiency, return, secured tenure, connection risk, and pipeline pressure. However, it gives all eight allocation markets a similar visual confidence even though their underlying evidence varies materially.

### Public data status page

`src/live/dataStatusPage.js` exposes:

- dataset freshness;
- live snapshot availability;
- observed and derived values;
- authority classes;
- ETL health and data limitations.

This page is a good governance surface. It should remain operational and should not be asked to carry investor-facing forecast provenance by itself.

### Market detail pages

There are six detail dashboards:

1. Western Australia WEM
2. Great Britain
3. Ireland
4. Romania
5. Poland
6. Japan, with Tokyo, Kyushu, Hokkaido, and regional-comparison lenses

There are eight allocation entries because the Japan regions are distinct capital-allocation choices.

All detail dashboards expose 12 tabs. The WA tab set is implemented as separate files under `src/markets/wa/sections/`; the other dashboards build declarative section specifications in their respective `sections.js` files.

### Responsive and print behaviour

- CSS grid layouts use auto-fit/minmax patterns across the homepage and market cards.
- Two-column layouts collapse at the defined mobile breakpoints.
- Market tabs remain sticky and wrap on smaller viewports.
- Print styles remove controls, tabs, and transient live-data indicators.
- Table wrappers support horizontal overflow, though the wide global league and several market tables remain dense on narrow screens.

The responsive baseline is sound. A full responsive redesign is not an immediate upgrade requirement.

## 3. Existing market modules

### Canonical contract

`src/markets/schema.js` documents the module shape:

```text
manifest
comparison
sources
tabs
dashboard
```

`src/markets/registry.js` imports the modules and exports both detail-market and allocation-market views. This is the correct place to preserve market identity and regional relationships.

### Western Australia

WA is a custom implementation:

- `src/markets/wa/dashboard.js` owns page composition.
- `src/markets/wa/tabs.js` defines 12 tabs.
- `src/markets/wa/sections/*.js` renders home, story, RCM, energy, FCESS, duration, pipeline, grid, benchmark, lab, portfolio, and data views.
- `src/markets/wa/lib/brcpEngine.js` contains a dedicated Benchmark Reserve Capacity Price forecast.
- `src/markets/wa/lib/optimizer.js` contains reserve-capacity and dispatch-strategy scenarios.
- `src/markets/wa/lib/lab.js`, scoring, export, and formatting utilities are market-specific.

WA is the most forward-looking dashboard and the closest to the target architecture. It has explicit high/base/low inputs, duration and cost paths, and a confidence series. Its weakness is that its forecast conventions and model interfaces are not reusable by other markets.

### Great Britain, Ireland, Romania, Poland, and Japan

These modules use `src/markets/_shared/engine.js#createMarketEngine()`:

- market-local `manifest.js`, `comparison.js`, `sources.js`, `tabs.js`, `data.js`, and `sections.js`;
- shared formatting in `src/markets/_shared/format.js`;
- shared computation in `src/markets/_shared/compute.js`;
- shared financial lab in `src/markets/_shared/lab.js`;
- reusable block rendering in `src/markets/_shared/blocks.js`;
- exports through `src/markets/_shared/exports.js`.

This is a productive architecture. The main maintenance issue is not the engine itself but very large, data-heavy `sections.js` files that mix:

- copy;
- chart definitions;
- investor conclusions;
- assumptions;
- source claims;
- forecast series.

Approximate file sizes observed during the audit were over 900 lines for several country section files and over 1,100 lines for Great Britain. This makes metric-level provenance and forecast replacement brittle.

### Japan regional model

The Japan dashboard is one detail module with three regional allocation entries. `src/markets/jp/` applies a regional lens to shared content and comparisons, while `src/markets/jp-tokyo/`, `src/markets/jp-kyushu/`, and `src/markets/jp-hokkaido/` provide the allocation-market adapters. This is preferable to three copied dashboards, but the common national and region-specific assumptions need explicit separation.

The repository already acknowledges the evidence limitation in `docs/japan-etl-gates.md`: most material investment inputs are seed assumptions. The regional ordering is currently more defensible than the point return outputs.

## 4. Existing data architecture

### Market-local analytical data

Each market has hard-coded local modules that supply:

- current system facts;
- market price/revenue observations;
- policy and rule facts;
- pipeline rows;
- forward curves and scenarios;
- project economics;
- source-register entries.

This approach makes the site self-contained and deterministic, but it currently conflates four authority types:

1. observed official data;
2. derived values;
3. official forecasts;
4. analyst assumptions or illustrative seeds.

Badges help distinguish some of these classes, but the distinction is not guaranteed at the metric and series level.

### Public data catalogue

`src/governance/datasets.js` defines nine governed datasets:

- ECB foreign exchange rates;
- ENTSO-E day-ahead prices for Great Britain, Ireland, Romania, and Poland;
- AEMO WEM prices;
- JEPX spot prices for Tokyo, Kyushu, and Hokkaido.

The catalogue provides IDs, market relationships, URLs, refresh expectations, snapshot locations, and the paths on which each dataset bears. It is an automated-feed catalogue, not yet a comprehensive source registry.

### ETL and snapshots

The official connectors are under `etl/sources/`:

- ECB XML;
- ENTSO-E API/XML;
- AEMO WEM JSON;
- JEPX CSV.

The ETL:

- writes only observed snapshots and derived summaries under `public/data/public/`;
- validates inputs and checksums;
- derives price metrics;
- compares live evidence with approved analyst anchors;
- emits drift proposals instead of overwriting approved economics.

This governance boundary is a major strength and should be extended, not bypassed.

### Derived price and merchant metrics

`src/derive/priceMetrics.js#derivePriceMetrics()` calculates:

- mean, median, standard deviation;
- percentiles;
- negative-price share;
- storage-duration daily spreads based on the average highest and lowest settlement periods within each local calendar day.

`src/derive/merchantBridge.js#arbitrageRevenuePerMW()` annualizes the observable spread using governed round-trip efficiency, cycles, availability, and realization assumptions from `src/governance/derivation.js`.

This is appropriately described as an evidence bridge, not a dispatch model. It should remain a historical/observed input to forward scenarios.

### Source display

`src/components/sourceDrawer.js` provides:

- `sourceDrawer()`;
- `sourceStatusBadge()`;
- `sourceRegister()`.

Market source registers are useful but currently operate mainly at source or narrative-block level. They do not guarantee that every chart series or calculated output resolves to:

- metric ID;
- source and vintage;
- unit and transformation;
- observed/official-forecast/analyst status;
- update time;
- confidence and caveat.

### Local/private data

`src/local/loader.js` is an interface stub for future confidential data. No private production dataset was found. The public dashboard does not depend on the stub.

## 5. Existing forecast logic

### Global normalized investment engine

`src/comparison/engine.js#runCase()` is the canonical global comparison engine.

It:

- converts native-currency inputs using fixed FX seeds in `src/comparison/assumptions.js`;
- applies a 15-year unlevered life;
- supports capacity, merchant, toll, and auction-renewal structures;
- separates secured and merchant exit yields;
- calculates investment cost, annual revenue/EBITDA, payback, IRR, MOIC, and exit value;
- supports exit years 5, 7, and 10;
- handles Japan’s one-year secured capacity payment followed by an assumed renewal curve.

`src/comparison/metrics.js` defines and ranks the global league metrics. `src/comparison/strategies.js` defines supported strategies by market.

The engine is useful for apples-to-apples screening, but it is not yet a forecast engine. Most revenue inputs are fixed seed values or static renewal curves rather than outputs of system, grid, and competition drivers.

### Shared market investment lab

`src/markets/_shared/lab.js#createLab()` is used by Great Britain, Ireland, Romania, Poland, and Japan.

It includes:

- capex and grant;
- de-rating;
- capacity, merchant, and service revenue;
- EBITDA;
- unlevered and levered IRR;
- NPV;
- DSCR;
- simple payback;
- a fixed lender-downside case.

The downside case applies fixed haircuts rather than a causal scenario. Debt terms are local lab inputs, and the outputs do not feed the homepage comparison.

### WA investment logic

WA has separate project-lab and optimizer logic in `src/markets/wa/lib/`. This provides greater market specificity but creates:

- duplicate finance calculations;
- different model shapes;
- a different IRR search range;
- separate downside/scenario terminology;
- no single cross-market audit trail.

### Market forecasts

- WA: structured BRCP high/base/low forecasts through the reserve-capacity horizon and optimizer scenarios.
- Great Britain: illustrative build, compression, and duration paths.
- Ireland: illustrative COD and revenue-compression fans.
- Romania: illustrative COD and market-development cases.
- Poland: illustrative COD and capacity/merchant assumptions.
- Japan: assumed post-award capacity-renewal and regional merchant/service curves.

The non-WA forward curves are generally useful hypotheses, but they are not yet tied to a standard driver manifest, official planning vintages, a backtest, or deterministic confidence rules. Their horizons also vary and often stop before 2035.

## 6. Strengths

1. **A real market architecture exists.** The registry and module contract make market additions and cross-market analysis tractable.
2. **The homepage already contains institutional screening logic.** Capital efficiency, revenue structure, exit sensitivity, and risk are not afterthoughts.
3. **The ETL is intentionally governed.** Machine-written evidence cannot silently overwrite analyst-authorized economics.
4. **Observed and derived data are separated.** The price-to-merchant bridge is transparent and deliberately limited.
5. **The shared dashboard engine is reusable.** Most proposed modules can be implemented as new block types or data contracts instead of new pages.
6. **The component library is adequate.** Line, bar, band, waterfall, scatter, cards, tables, badges, and source drawers cover most P0/P1 visuals.
7. **The app is deterministic and testable.** Existing structural and engine tests protect route, registry, model, and governance behavior.
8. **WA demonstrates the intended direction.** It proves that scenario controls and market-specific investment logic can coexist with the rest of the application.
9. **Bilingual, theme, print, and responsive behavior are already present.**
10. **Limitations are often honestly documented.** Japan ETL gates and the public/private data boundary are examples worth preserving.

## 7. Weaknesses

### 7.1 Missing common causal forecast layer

The application does not consistently connect:

```text
system change
-> physical imbalance
-> market revenue
-> competing BESS deployment
-> revenue compression
-> EBITDA
-> debt and equity returns
```

System plans, grid facts, project pipelines, revenue curves, and investment models live beside one another, but the dependency graph is implicit.

### 7.2 Uneven and sometimes unsupported forward evidence

- Great Britain, Ireland, Romania, and Poland contain explicit seed-example project rows.
- Several revenue and COD curves are analyst seeds without a driver table.
- Japan’s economics depend heavily on seed assumptions and a one-year-to-renewal construct.
- The Poland capacity-price normalization includes a seed conversion/correction that requires source-level revalidation.
- Forecast endpoints differ by market and rarely provide a consistent Today/2030/2035 view.

### 7.3 Fragmented underwriting logic

The homepage uses a standardized unlevered engine, while detail dashboards use separate levered models. Consequences include:

- different IRR solvers/ranges;
- different downside definitions;
- no common debt-sizing method;
- no common equity-return and valuation attribution;
- global screening outputs that cannot be reconciled directly to local labs.

### 7.4 Incomplete source and metric registry

`src/governance/datasets.js` is limited to recurring automated feeds. Market `sources.js` files lack a common schema for:

- metric ID;
- units;
- historical and forecast coverage;
- source vintage;
- transformation;
- forecast ownership;
- ingestion method;
- confidence.

### 7.5 Competition is weaker than system need

The application often has credible top-down need indicators but weak bottom-up competitive supply:

- placeholder project rows in four markets;
- inconsistent project-stage definitions;
- limited stage-transition and COD-delay evidence;
- announced MW shown alongside more mature MW without a fully standardized funnel.

### 7.6 Local context scores are not forecast confidence

The displayed market scores combine contextual judgments. They do not tell investors whether a particular forecast is supported by multiple official sources, whether the source has been accurate historically, or how sensitive the result is to assumptions.

### 7.7 Wide files mix content, data, and logic

Large `sections.js` files make it difficult to:

- replace one metric safely;
- enforce provenance;
- reuse forecast structures;
- test causal links;
- audit English/Chinese numerical consistency.

### 7.8 Chart relevance and forward conclusions

No chart family is inherently dead or unsuitable, but several current uses carry more visual precision than investment evidence:

- pipeline/funnel charts for Great Britain, Ireland, Romania, and Poland are partly driven by seed-example project arrays;
- non-WA forecast fans and compression curves show analyst outputs without a visible official driver manifest or backtest;
- historical price and market-activity charts establish what happened but generally do not show how system plans and competing MW change the future capture rate;
- grid charts and narratives describe constraints without consistently separating system-value upside from project connection/delivery downside;
- the homepage league and IRR views rank point outputs whose source coverage and forecast confidence differ materially.

The existing chart modules should be retained. The upgrade is to add driver, vintage, competition, range, confidence, and investment-bridge context around them.

## 8. Missing investment logic

The following are either absent or not consistently comparable:

1. Driver-linked Base/Bear/Bull scenarios for every market.
2. Explicit project-delivery risk separate from market-value scenarios.
3. Historical forecast bias and COD-delay distributions.
4. Competition-adjusted revenue compression.
5. Common definitions for secured, quasi-secured, and merchant revenue.
6. Common debt sizing using contracted and merchant cash-flow haircuts.
7. Equity cash flows, equity IRR, MOIC, and distribution timing on a common basis.
8. Exit-value attribution by secured and merchant cash-flow component.
9. Financing availability and exit-liquidity evidence.
10. Thesis invalidation conditions attached to scenarios.
11. Metric-level source lineage and official-vs-analyst forecast ownership.
12. Evidence-adjusted capital-allocation ranking.

## 9. Technical debt

### P0/P1 debt affecting analytical credibility

- Seed and official values are co-located in market data modules without a universal metric authority contract.
- Finance logic is duplicated between `src/comparison/`, `src/markets/_shared/lab.js`, and `src/markets/wa/lib/`.
- Pipeline stage probabilities and stage labels are not one governed global taxonomy.
- Forecast labels mix `low/central/high`, `base/lender downside`, and `HIGH/BASE/LOW`.
- Units and price bases vary by market, and a canonical unit dictionary is absent.
- Some source-register URLs point to agency homepages instead of stable dataset pages.
- Some source statuses still say that current availability requires verification.

### P2/P3 engineering debt

- `src/markets/registry.js` statically imports every dashboard, so the initial bundle eagerly includes all markets.
- Several section files are very large.
- Custom SVG charts have no shared accessibility contract beyond surrounding text.
- There is no map component or small geospatial data pipeline.
- Table density on mobile could be improved with priority columns or card fallbacks.

### Dead or intentionally dormant code

No material dead chart family or abandoned production page was found. `src/local/loader.js` is intentionally dormant and should remain so until a private-data product requirement exists.

## 10. Reusable components

### Reuse without change

- `src/charts/lineChart.js`: system evolution and historical/forecast series.
- `src/charts/barChart.js`: mix, pipeline stages, and market size.
- `src/charts/bandChart.js`: Base/Bear/Bull bands and backtest ranges.
- `src/charts/waterfallChart.js`: revenue-to-EBITDA and policy-to-cash-flow bridges.
- `src/charts/scatterChart.js`: confidence/return, competition/need, and capital-allocation frontiers.
- `src/components/card.js`, `metricCard.js`, `badge.js`, `chip.js`, `table.js`.
- `src/components/sourceDrawer.js`: retain as the visible source entry point.
- `src/markets/_shared/blocks.js`: extend with new block specifications.
- `src/governance/authority.js`, `materiality.js`, and `derivation.js`.
- Existing ETL validation, snapshot, proposal, and checksum boundaries.

### Reuse with extension

- `src/governance/datasets.js`: keep as the automated-dataset catalogue and link each entry to a comprehensive source registry.
- `src/markets/_shared/lab.js`: reuse UI and output layout after extracting finance primitives.
- `src/comparison/engine.js`: retain standardized unlevered comparison and feed it governed forecast outputs.
- `src/home/marketComparison.js`: add evidence and confidence dimensions only after metric definitions are common.
- `src/home/allocationMatrix.js`: reuse the matrix/frontier/waterfall pattern for evidence-adjusted allocation.
- `src/components/sourceDrawer.js`: resolve metric lineage and transformations, not just top-level sources.

### New components required

1. A metric/source provenance panel.
2. Common scenario controls and scenario explanation panel.
3. Causal driver tree/bridge.
4. Forecast confidence badge with score decomposition.
5. Backtest chart/table.
6. Competition funnel with stage and vintage.
7. A lightweight SVG grid-value profile/map for markets with sufficient public location data.

No third-party GIS system is required for the first implementation.

## 11. Immediate issues

### Issue 1: clearly label every forward value

Every market series should resolve to one of:

- `observed`;
- `derived-observed`;
- `official-forecast`;
- `analyst-scenario`;
- `illustrative-seed`.

This should be enforced before more forecast charts are added.

### Issue 2: remove placeholder projects from decision metrics

Seed-example projects in Great Britain, Ireland, Romania, and Poland should not feed pipeline MW, COD distributions, stage probabilities, or homepage competition scores. Until official rows are ingested, show the official aggregate and an explicit project-level coverage gap.

### Issue 3: correct stale acquisition assumptions

The existing data commentary should be rechecked before implementation. For example, NESO now publishes a weekly Capacity Market Register as structured CSV resources with a catalogue/API interface. It should no longer be treated as inherently PDF-only.

### Issue 4: validate Poland’s contracted-revenue basis

The capacity-payment unit, currency conversion, de-rating, contract duration, and any correction factor in `src/markets/pl/comparison.js` and its source data must be independently reconstructed from PSE/URE results before the number is used in further forecast or debt logic.

### Issue 5: reconcile model definitions

Document one canonical set of:

- project life;
- inflation basis;
- revenue timing;
- degradation;
- augmentation;
- tax treatment;
- debt draw and repayment;
- DSCR;
- exit timing and yields;
- IRR solver bounds.

The global and local engines can retain different purposes, but identical terms must produce reconcilable cash flows.

### Issue 6: preserve the machine-write boundary

Official planning forecasts and project-register extracts may be machine-written as evidence. Analyst-selected scenarios, financing assumptions, revenue realization, and investment conclusions must remain proposal-only or human-approved, following `src/governance/authority.js`.

### Issue 7: do not expand routes first

The existing tabs already map well to the target framework. The first implementation should add governed data and causal explanations inside the existing story, grid, pipeline, market/revenue, lab, and data tabs before creating new pages.

## Audit conclusion

The repository does not need a new frontend architecture. It needs a common evidence contract between its official data, its forecasts, and its investment calculations. The most effective sequence is:

```text
metric/source registry
-> Today/2030/2035 official system view
-> real competitive pipeline
-> explicit scenario drivers
-> backtest and confidence
-> reconciled underwriting
-> evidence-adjusted global allocation
```

That sequence preserves the strongest existing work while fixing the points where the current dashboard can overstate forecast and return precision.
