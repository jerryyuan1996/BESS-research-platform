# BESS Investment Intelligence Implementation Roadmap

Roadmap date: 2026-07-29  
Planning baseline: `DASHBOARD_ARCHITECTURE_AUDIT.md`, `FORECAST_UPGRADE_PLAN.md`, and `PUBLIC_DATA_SOURCE_REGISTRY.md`

## Outcome

The implementation should convert the dashboard’s existing market facts and seed economics into a governed chain from official system planning to capital allocation. It should preserve the current routes, visual language, bilingual behavior, and machine-write boundary.

The recommended delivery path is an end-to-end Great Britain pilot followed by market rollout. GB has the strongest combination of structured official system, connection, capacity, planning, and operational data, and it currently contains placeholder pipeline rows that can be replaced with a material credibility gain.

## Delivery rules

1. No chart is accepted without a metric ID, unit, authority, source/vintage, and transformation.
2. No illustrative project may contribute to a pipeline total or investment score.
3. No official source may automatically change analyst-approved finance or return assumptions.
4. `Bear` and `Bull` always refer to BESS investment returns.
5. Market-value scenarios and project-delivery risk are separate.
6. Existing finance outputs must be locked in tests before any refactor.
7. A missing official 2035 point remains missing or uses the nearest official year with a visible label.
8. Each phase must add user-visible investment value; infrastructure-only work is kept minimal.

## Phase 0 — Baseline and analytical contracts

**Priority:** P0  
**Complexity:** 2/5  
**Expected investment value:** 4/5  
**Purpose:** prevent new evidence and forecast modules from multiplying the current definition inconsistencies.

### Work

- Freeze current global and local finance outputs in additional fixtures.
- Define canonical authority values:
  - observed;
  - derived-observed;
  - official-forecast;
  - analyst-scenario;
  - illustrative-seed.
- Define unit and basis contracts:
  - currency and currency year;
  - power/energy;
  - local price basis;
  - per-MW/per-MWh;
  - gross/net revenue;
  - nominal/real;
  - calendar/fiscal/delivery year.
- Define the scenario, source, metric, project, and forecast-confidence schemas.
- Document common finance terms and the intentional difference between global screening and country underwriting.

### Files affected

- Existing:
  - `src/markets/schema.js`
  - `src/governance/authority.js`
  - `src/governance/datasets.js`
  - `src/comparison/assumptions.js`
  - `src/comparison/engine.js`
  - `src/markets/_shared/lab.js`
  - `src/markets/wa/lib/lab.js`
  - `tests/baseline.test.js`
  - `tests/finance.test.js`
  - `tests/governance.test.js`
- Proposed:
  - `src/governance/sourceRegistry.js`
  - `src/governance/metrics.js`
  - `src/governance/units.js`
  - `src/forecast/schema.js`
  - `src/projects/schema.js`

### Dependencies

- Agreement on canonical units and finance definitions.
- No new external data dependency.

### Exit criteria

- Existing tests and build pass unchanged.
- Every existing global comparison input is classified by authority.
- Schema validators fail closed for missing market, unit, authority, or source relationship.
- Current baseline IRR/MOIC/NPV/DSCR values are recorded before refactoring.

## Phase 1 — Data credibility and metric provenance

**Priority:** P0  
**Complexity:** 3/5  
**Expected investment value:** 5/5  
**Purpose:** make every displayed observation, official forecast, scenario, and seed traceable.

### Work

1. Implement the comprehensive official source registry from `PUBLIC_DATA_SOURCE_REGISTRY.md`.
2. Keep `src/governance/datasets.js` as the automated-feed catalogue; link entries to `source_id`.
3. Register existing market metrics and series.
4. Extend source display from source-level to metric-level lineage.
5. Add consistent authority badges and forecast-vintage labels.
6. Add stale-source and unresolved-source states.
7. Prevent unregistered metrics from entering new comparison or forecast modules.
8. Revalidate Poland capacity revenue before it is allowed into the upgraded model.

### Components affected

- `src/components/sourceDrawer.js`
- `src/components/badge.js`
- `src/live/dataStatusPage.js`
- `src/markets/_shared/blocks.js`
- `src/markets/wa/sections/data.js`
- each market’s `sources.js` and data tab
- homepage result detail/source access

### Data requirements

- Source records, exact source locators, publication/retrieval dates, checksums.
- Metric authority, unit, transformation, and forecast ownership.

### Reuse

- Reuse source drawer, badges, data-status presentation, ETL checksums, and governance authority functions.
- Add one provenance panel; do not create a second data-status page.

### Tests

- Every new chart series resolves to a metric record.
- Official-forecast and analyst-scenario values cannot share an unlabeled series.
- Missing or unclassified sources fail closed.
- English and Chinese values resolve to the same metric IDs.

### Exit criteria

- An investor can open any upgraded metric and see source, vintage, authority, unit, transformation, and update date.
- No seed pipeline row contributes to a headline metric.

## Phase 2 — Official forward system view

**Priority:** P0  
**Complexity:** 3/5  
**Expected investment value:** 5/5  
**Purpose:** establish the physical reason for storage need using official Today/2030/2035 or nearest-year planning evidence.

### Pilot: Great Britain

#### Data connectors/manifests

- NESO FES structured data table and workbook.
- NESO ETYS/Beyond 2030 planning data.
- DESNZ CP2030 official targets.

#### Proposed files

- `etl/sources/neso-fes.mjs`
- `etl/sources/neso-etys.mjs` or a controlled manual-report parser
- `src/markets/gb/forecast.js`
- official snapshots under `public/data/public/`

#### UI

- Add a reusable `systemEvolution` block to `src/markets/_shared/blocks.js`.
- Render Today/2030/2035 in the existing GB story/home sections.
- Add a causal explanation:
  - demand/load;
  - renewables;
  - thermal/nuclear availability;
  - network/interconnector;
  - adequacy/flexibility;
  - BESS implication.

### Market rollout

| Market | Primary data | Display years |
|---|---|---|
| WA | AEMO WEM ESOO workbooks | current, 2030, 2035 or official delivery-year equivalents |
| GB | NESO FES/ETYS/CP2030 | current, 2030, 2035 |
| Ireland | GCS/AIRAA, TYTFS, SOEF | current, 2030, 2034; label 2034 |
| Romania | Transelectrica Development Plan 2026-2035 | current, 2030, 2035 |
| Poland | 2026 NECP and PSE Development Plan 2025-2034 | current, 2030, 2034; use 2040 only as policy context |
| Japan regions | OCCTO supply plans/outlook and METI 2040 | current, 2030, 2034; 2040 context |

### Existing files affected

- `src/markets/wa/data/` and relevant story/grid sections.
- `src/markets/gb/data.js` and `sections.js`.
- `src/markets/ie/data.js` and `sections.js`.
- `src/markets/ro/data.js` and `sections.js`.
- `src/markets/pl/data.js` and `sections.js`.
- `src/markets/jp/data.js` and `sections.js`.
- `src/markets/jp-tokyo/`, `jp-kyushu/`, and `jp-hokkaido/` regional comparison adapters.

### Dependencies

- Phase 1 metric/source contracts.
- A snapshot policy for large official workbooks and manual planning sources.

### Tests

- Official values preserve original year, unit, scenario name, and vintage.
- A missing 2035 source does not trigger hidden interpolation.
- System cards link to the driver and investment interpretation.

### Exit criteria

- Every allocation market has a visible official system transition.
- Each transition identifies one storage-value driver and one thesis-invalidating condition.

## Phase 3 — Competition and grid value

**Priority:** P0 for competition; P1 for grid maps  
**Complexity:** 4/5  
**Expected investment value:** 5/5  
**Purpose:** distinguish system need from investable scarcity after credible BESS supply and connection risk.

### 3A — Canonical competition funnel

#### Stage taxonomy

```text
announced
-> grid_application
-> grid_secured
-> permitted
-> contracted
-> financed
-> under_construction
-> operating
```

Rows may skip stages only with explicit evidence. Unknown is not equivalent to Announced.

#### GB pilot connectors

- `etl/sources/neso-capacity-register.mjs`
- `etl/sources/neso-tec-register.mjs`
- `etl/sources/desnz-repd.mjs`
- `etl/projects/entity-resolution.mjs`

#### Required transformations

- stable project/entity key;
- duplicate and component handling;
- storage technology filtering;
- capacity and duration basis;
- location;
- stage and evidence date;
- expected COD and prior COD vintages;
- CM/LDES contract status;
- source coverage.

#### UI

- Replace placeholder GB project rows.
- Reuse the current pipeline, stage-probability, and bar blocks.
- Add a funnel, COD band, duration mix, coverage badge, and slippage indicator.

### 3B — Other markets

- WA: use AEMO EOI/REOI and RCM/CIS evidence at aggregate/award level; display incomplete grid-stage coverage.
- Ireland: combine official connection/constraint/policy evidence; do not manufacture finance stages.
- Romania: combine connection-capacity centralizers, Transelectrica map/plan, and ANRE evidence.
- Poland: combine PSE plan storage projects and PSE/URE auction results; mark incomplete queue coverage.
- Japan: use OCCTO main/LDCA auction awards and contract-status files; show the complete-queue gap.

### 3C — Grid value profile/map

#### Proposed files

- `src/maps/gridValueMap.js`
- `src/maps/schema.js`
- market-specific preprocessed layer data
- a `gridValue` block in `src/markets/_shared/blocks.js`
- WA adapter in its grid section

#### Market release order

1. GB — boundaries, TEC/REPD, ETYS/Beyond 2030.
2. Romania — capacity-allocation zones, map, development plan.
3. Ireland — constraint regions and network portfolio.
4. Poland — PSE spatial plan and storage-related projects.
5. Japan regions — regional/interconnector profiles.
6. WA — regional/network profile pending exact transmission data.

### Dependencies

- Phase 1 provenance.
- Phase 2 system drivers.
- Agreed project entity and stage rules.

### Tests

- Placeholder projects cannot pass schema validation as official projects.
- Project totals are reproducible from source records and deduplication logs.
- Funnel totals expose source coverage.
- Map layers cannot claim price or revenue precision not present in the source.

### Exit criteria

- GB has a fully official, repeatable competition view.
- Every other market shows either a supported funnel or a conspicuous coverage gap.
- Grid views link constraint and reinforcement to both market value and connection risk.

## Phase 4 — Scenario forecast engine

**Priority:** P0/P1  
**Complexity:** 4/5  
**Expected investment value:** 5/5  
**Purpose:** replace unsupported point curves with explicit, falsifiable Base/Bear/Bull logic.

### Architecture

Proposed pure modules:

- `src/forecast/scenarios.js`
- `src/forecast/driverTree.js`
- `src/forecast/revenue.js`
- `src/forecast/confidence.js`
- `src/forecast/invalidation.js`

Each market adds `forecast.js` containing:

- driver definitions;
- official Base anchors;
- Bear/Bull direction and range;
- lags/relationships;
- market-specific outputs;
- invalidation conditions.

### Great Britain pilot

Connect:

```text
FES demand/wind/storage
+ ETYS boundary/reinforcement
+ CM/LDES award and TEC/REPD funnel
+ BMRS historical evidence
-> energy/BM/ancillary/CM/toll outlook
-> revenue/MW range
-> global and local investment inputs
```

Do not generate hourly forward prices. The first model should use transparent sensitivities such as:

- effective competing MW;
- addressable ancillary/capacity pool;
- observed spread/capture anchor;
- reinforcement timing;
- contracted share/tenor.

### UI components

- scenario selector;
- driver table/tree;
- forecast band;
- sensitivity waterfall/tornado;
- invalidation panel;
- confidence badge.

Reuse:

- `src/charts/bandChart.js`
- `src/charts/lineChart.js`
- `src/charts/waterfallChart.js`
- `src/components/decisionLogic.js`
- existing market state/rerender patterns.

### Dependencies

- Official system view.
- Competition funnel.
- Metric provenance.
- Approved scenario semantics.

### Tests

- Bear/Base/Bull ordering is tested on investment outputs, not every physical driver.
- Scenario values remain within defined bounds.
- All outputs retain driver attribution.
- Market and project-delivery scenarios can be combined without double counting.
- Missing drivers produce “not modeled,” not zero.

### Exit criteria

- Each published forecast output can answer:
  - what changed;
  - why;
  - based on which evidence;
  - how sensitive it is;
  - what invalidates it.

## Phase 5 — Evidence, backtesting, and confidence

**Priority:** P1  
**Complexity:** 3/5  
**Expected investment value:** 4/5  
**Purpose:** calibrate scenario ranges and make forecast trust explicit.

### Work

1. Add immutable planning-vintage manifests and parsed observations.
2. Implement `src/forecast/backtest.js`.
3. Compare official forecasts with realized outcomes.
4. Build project COD/stage slippage from successive official snapshots.
5. Implement the deterministic confidence rubric in `FORECAST_UPGRADE_PLAN.md`.
6. Use backtest error and delay percentiles to calibrate scenario width.
7. Add only publicly evidenced case studies that change model assumptions.

### Initial backtests

- WA ESOO demand/peak and BRCP/RCP.
- GB FES demand/storage/wind and TEC/REPD COD.
- Ireland GCS demand/adequacy and network milestones.
- Romania/Poland TSO planning vintages where definitions align.
- Japan OCCTO demand/adequacy and regional curtailment outlook vs actual.

### Proposed files/components

- `etl/vintages/manifest.mjs`
- `src/forecast/backtest.js`
- `src/components/forecastConfidence.js`
- `src/components/backtestView.js`
- `src/components/caseStudy.js`
- `public/data/public/vintages/` or an equivalent governed immutable path

### Data requirements

- At least three comparable vintages before a systematic-bias label.
- Definition/unit reconciliation.
- Project snapshot dates and stable identifiers.

### Dependencies

- Phases 1-4.

### Tests

- No comparison across inconsistent definitions.
- Bias/MAE/MAPE calculations handle zeros and missing years.
- Confidence output is deterministic from its five sub-scores.
- Source confidence and forecast confidence remain separate.

### Exit criteria

- Scenario bands cite historical error or a documented substitute.
- Every forecast confidence badge shows its decomposition and uncertainty.
- Case studies produce a recorded dashboard model implication.

## Phase 6 — Reconciled investment underwriting

**Priority:** P1  
**Complexity:** 5/5  
**Expected investment value:** 5/5  
**Purpose:** connect the causal forecast to debt, equity return, MOIC, and valuation on reconcilable definitions.

### Work

1. Extract shared pure finance primitives without changing baseline outputs.
2. Define one cash-flow timeline and timing convention.
3. Classify each revenue stream:
   - secured;
   - quasi-secured/auction renewal;
   - merchant.
4. Size debt using explicit DSCR/haircut rules by revenue class.
5. Produce project and equity cash flows.
6. Add equity IRR/MOIC and cash-yield timing.
7. Attribute exit value by cash-flow class.
8. Add capex, augmentation, refinancing, and exit-yield sensitivities.
9. Feed approved scenario outputs into the model; live evidence remains proposal-only.

### Files affected

- `src/comparison/engine.js`
- `src/comparison/assumptions.js`
- `src/comparison/metrics.js`
- `src/markets/_shared/lab.js`
- `src/markets/wa/lib/lab.js`
- `src/markets/wa/lib/optimizer.js`
- all market `comparison.js` and finance assumption data
- `tests/finance.test.js`
- `tests/baseline.test.js`

### Proposed files

- `src/finance/cashflows.js`
- `src/finance/irr.js`
- `src/finance/debt.js`
- `src/finance/valuation.js`
- `src/finance/schema.js`

### Dependencies

- Stable scenario output contract.
- Revalidated market revenue bases.
- Approved financing assumptions.

### Migration strategy

1. Move the existing IRR calculation to a shared primitive while preserving exact outputs.
2. Adapt the global engine.
3. Adapt the shared market lab.
4. Adapt WA.
5. Add new debt/equity features only after equivalence passes.

### Tests

- Exact baseline parity before assumption changes.
- Cash-flow identities and timing.
- Debt repayment and DSCR constraints.
- Project/equity IRR and MOIC consistency.
- Exit value uses the correct secured/merchant yield.
- Japan one-year capacity award cannot be misclassified as a 15-year secured contract.

### Exit criteria

- A market detail case reconciles to global screening under the same assumptions.
- Investors can see which driver changes debt capacity, equity return, and valuation.
- Downside is scenario-driven rather than fixed unexplained haircuts.

## Phase 7 — Global capital allocation cockpit

**Priority:** P1  
**Complexity:** 4/5  
**Expected investment value:** 5/5  
**Purpose:** turn the homepage into an evidence-aware portfolio decision surface.

### Work

- Add official system need and effective competition.
- Add revenue visibility and contract quality.
- Add Base/Bear/Bull project/equity return ranges.
- Add forecast confidence as a separate dimension.
- Add connection/project-delivery risk.
- Add exit-liquidity evidence and data-coverage state.
- Add catalysts and invalidation conditions.
- Preserve market-specific indicators in each card.

### Files affected

- `src/home/homePage.js`
- `src/home/marketGrid.js`
- `src/home/marketComparison.js`
- `src/home/normalizationView.js`
- `src/home/allocationMatrix.js`
- `src/home/findings.js`
- `src/comparison/metrics.js`
- `src/components/marketCard.js`
- responsive/print CSS

### Reuse

- Existing league table.
- Normalized revenue stack.
- `$1M` allocation matrix.
- IRR chart.
- certainty frontier.
- waterfall.

### Required changes

- Rename “certainty” concepts to evidence-defined confidence where appropriate.
- Do not collapse attractiveness and confidence into one score.
- Add market-specific driver/catalyst to each card.
- Add coverage status so incomplete pipeline data cannot appear equivalent to a complete register.
- On mobile, show priority columns and expand details rather than forcing the full table.

### Dependencies

- Phases 1-6.

### Tests

- Common metrics have identical definitions across markets.
- Unsupported strategies display N/A, not zero.
- Low source coverage reduces confidence presentation but does not silently alter returns.
- Regional Japan values inherit national evidence only where applicable.

### Exit criteria

- The homepage answers:
  - where capital is most attractive;
  - why;
  - under which scenario;
  - with what evidence;
  - with what downside;
  - what would change the ranking.

## Phase 8 — Performance and maintainability

**Priority:** P2  
**Complexity:** 3/5  
**Expected investment value:** 2/5 direct; 4/5 operational  
**Purpose:** address engineering debt after analytical credibility is in place.

### Work

- Lazy-load market dashboards from the registry/router boundary.
- Split large country `sections.js` files into data/spec modules.
- Add accessible chart summaries and keyboard behavior.
- Add mobile priority-column/card fallbacks.
- Version source schemas and ETL transformations.
- Add runbook pages for manual C-class sources.

### Files affected

- `src/markets/registry.js`
- `src/app/app.js`
- market `sections.js`
- `src/charts/`
- CSS
- `docs/`

### Dependencies

- Stable analytical modules and routes.

### Exit criteria

- Initial bundle materially decreases without route regressions.
- Manual source updates are reproducible by a maintainer other than the original author.
- No large section file remains the sole owner of copy, data, source, and forecast logic.

## Market rollout order

| Order | Market | Reason |
|---:|---|---|
| 1 | Great Britain | Best structured public data; placeholder pipeline; diverse revenue mechanisms make a strong vertical pilot |
| 2 | Western Australia | Most mature existing forecast logic; strong official planning and capacity evidence |
| 3 | Ireland | Strong official system/constraint evidence and clear competition/ancillary thesis |
| 4 | Romania | New 2026-2035 plan and connection-allocation data support a useful zonal model |
| 5 | Poland | Strong planning/CM evidence but contracted-revenue basis and project completeness need care |
| 6 | Japan regions | Strong system/capacity/curtailment sources but weak complete project queue and heavy seed economics |

Japan Tokyo, Kyushu, and Hokkaido should be released together under one national schema with distinct regional drivers.

## Delivery increments

### Increment 1 — GB evidence slice

- Source/metric registry.
- FES system view.
- CM/TEC/REPD project pipeline.
- Provenance and coverage.
- No new investment model yet.

### Increment 2 — GB scenario slice

- Driver manifest.
- Base/Bear/Bull.
- Revenue mechanism outlook.
- Forecast confidence.
- Existing model adapter.

### Increment 3 — GB underwriting slice

- Reconciled debt/equity model.
- Backtest calibration.
- Homepage evidence-aware GB output.

### Increment 4 — market rollout

- WA and Ireland.
- Romania and Poland.
- Japan regions.

This minimizes the risk of building seven partially connected layers across every market at once.

## Verification plan

Every implementation increment should run:

- unit tests for schemas, transformations, finance, backtesting, and scenarios;
- structural tests for all routes, tabs, source links, and registry relationships;
- snapshot checksum and freshness tests;
- bilingual numeric-consistency tests;
- Vite production build;
- visual review at desktop, tablet, mobile, dark/light, English/Chinese, and print;
- source spot checks against the exact official table/API response;
- baseline comparison against the approved current investment outputs.

## Release gates

### Data gate

- Exact official URL verified.
- Access/registration/terms recorded.
- Historical/forecast coverage recorded.
- Transformation versioned and tested.
- Freshness and failure behavior defined.

### Forecast gate

- Base source and vintage recorded.
- Bear/Bull drivers explicit.
- Historical error or range rationale present.
- Confidence computed.
- Invalidation condition present.

### Investment gate

- Revenue class and timing defined.
- Debt logic visible.
- Project and equity cash flows reconcile.
- Exit value attributed.
- No seed input is presented as observed or official.

### UI gate

- Investor question and takeaway visible.
- Provenance accessible from the chart/output.
- Missing data shows N/A or coverage state.
- Mobile and print views remain usable.

## Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Official source changes URL/layout | Broken ingestion | Source manifests, schema validation, last-good snapshot, freshness warning |
| Project duplicates inflate pipeline | False saturation | Stable entity resolution, component rules, dedupe log, cross-source precedence |
| Official planning scenarios are treated as truth | False confidence | Backtest, scenario ranges, explicit official-vs-analyst authority |
| Market scarcity and project delay are conflated | Wrong investment signal | Separate market-value scenario and project-delivery overlay |
| Finance refactor changes outputs silently | Loss of trust | Exact baseline fixtures and staged adapter migration |
| Manual reports create maintenance burden | Stale strategic data | Use C-class sources only for slow-moving assumptions; publish last-updated status |
| Complete project/financing data is unavailable | Overstated precision | Coverage labels, public-known subset, no inferred finance stage |
| Cross-market score hides structural differences | Misallocation | Common metrics plus market-specific drivers; confidence remains separate |

## Explicit non-goals

- No PLEXOS/Aurora-style production-cost model.
- No full power-flow or transmission engineering model.
- No fabricated hourly forward prices.
- No proprietary-data dependency for a core recurring view.
- No automated changes to analyst-authorized investment conclusions.
- No full GIS platform before public-data and investor-value evidence justify it.
- No large standalone policy library.

## Recommended first implementation

Begin with Phase 0 and the GB portion of Phases 1-3:

1. freeze baseline finance outputs;
2. implement source, metric, unit, and authority contracts;
3. ingest NESO FES, Capacity Market Register, TEC Register, and DESNZ REPD;
4. remove GB placeholder projects from all decision metrics;
5. render a sourced current/2030/2035 system view and competition funnel;
6. expose source lineage and coverage.

This creates an immediately more credible investor product and proves the data contract before scenario and finance complexity is added.
