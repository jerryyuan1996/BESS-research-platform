# Forecast and Investment Intelligence Upgrade Plan

Plan date: 2026-07-29  
Objective: evolve the existing research dashboard into a traceable, scenario-driven BESS underwriting and capital-allocation system without building a dispatch, power-flow, or production-cost model

## Executive summary

The highest-value upgrade is not another set of charts. It is a common chain of evidence that makes every investment result explainable:

```text
official system plan
-> physical grid/adequacy condition
-> addressable revenue pool
-> competing BESS supply
-> revenue per MW
-> project EBITDA
-> debt/equity cash flow
-> valuation and allocation decision
```

The repository has most of the required presentation and governance foundations. The upgrade should add:

1. a comprehensive metric/source registry and strict forecast labels;
2. official Today/2030/2035 system views;
3. official, stage-weighted competition funnels;
4. driver-based Base/Bear/Bull scenarios;
5. historical backtesting and deterministic forecast confidence;
6. a reconciled underwriting layer;
7. an evidence-adjusted global allocation cockpit.

The first release should not attempt hourly forward prices, nodal dispatch, power flow, or fully automated project-finance conclusions. Official operator plans should anchor the system outlook; proprietary value should come from causal synthesis, competitive adjustment, transparent sensitivities, and investment interpretation.

## Design principles

1. **Traceability before precision.** A range with sources and drivers is more useful than an unsupported point estimate.
2. **Separate market value from project execution.** A delayed transmission project can increase system scarcity while also delaying a BESS connection.
3. **Separate source quality from forecast confidence.** An official source may still publish a highly uncertain forecast.
4. **Observed evidence never silently changes approved underwriting.** Preserve the authority rules in `src/governance/authority.js`.
5. **Use native units locally and governed normalization globally.**
6. **Do not count placeholder projects.**
7. **Use existing routes and components first.**
8. **Make invalidation conditions visible.**

## Current -> target analytical architecture

| Layer | Current implementation | Gap | Target implementation | Principal code surface |
|---|---|---|---|---|
| System | Market-specific fact cards and selected planning values | No common Today/2030/2035 schema; inconsistent horizons | Official demand, peak, generation, retirement, interconnection, storage and flexibility snapshots by planning vintage | Market `data.js`/`sections.js`; new `src/forecast/` schema |
| Grid | Narrative grid tabs, queue ratios, WA grid facts | Limited location consistency and weak link to cash flow | Grid-value profile that links constraint, timing, price/revenue signal, connection risk, and project implication | Existing grid sections; new lightweight `gridValue` block |
| Market | Revenue stacks, historical prices, rules, live day-ahead evidence | Forward revenue assumptions are not derived from addressable pools and competition | Revenue mechanism cards with market size, access rules, contractability, saturation driver, and scenario output | Market revenue sections; `src/derive/`; forecast engine |
| Competition | Pipeline tables and stage probabilities | Four countries contain placeholder rows; stages differ | Official project funnel, deduplication, probability, duration, location, COD vintage and delay | Pipeline sections; new canonical project schema |
| Forecast | WA scenarios; seed curves elsewhere | No common driver manifest or scenario semantics | Driver-based Base/Bear/Bull with market-value scenario plus project-delivery overlay | New `src/forecast/scenarios.js`; reuse `bandChart` |
| Evidence | Source drawers, data status, governance checks | No metric lineage, backtest, or deterministic confidence | Click-through provenance, forecast-vintage archive, error metrics and confidence decomposition | `sourceDrawer.js`; new provenance/backtest modules |
| Investment | Homepage unlevered engine and local levered labs | Engines and downside logic diverge | Reconciled revenue-to-equity cash flow, debt sizing, exit attribution and thesis conditions | `src/comparison/`; shared/WA labs; new finance primitives |

## Canonical forecast driver tree

The common data model should support this graph without forcing identical economics:

```text
SYSTEM DRIVERS
demand + renewable deployment + thermal/nuclear changes + interconnection
        |
        v
PHYSICAL OUTCOMES
adequacy + congestion + curtailment + volatility + reserve need
        |
        v
MARKET MECHANISMS
energy + balancing + ancillary + capacity + toll/floor
        |
        v
COMPETITION
operating BESS + credible COD funnel + duration + market access
        |
        v
REVENUE OUTLOOK
addressable pool / effective competing MW, adjusted for capture and contract
        |
        v
INVESTMENT
EBITDA -> debt capacity -> equity cash flow -> IRR/MOIC -> exit value
```

Every arrow should contain:

- driver ID;
- direction;
- lag;
- source or assumption;
- formula or qualitative rule;
- scenario sensitivity;
- confidence;
- invalidation threshold.

## Market-by-market gap analysis

### Western Australia WEM

**Current thesis:** capacity/adequacy-led, with duration value, energy volatility, and FCESS as secondary revenues.

**Existing strengths**

- `src/markets/wa/lib/brcpEngine.js` already has high/base/low BRCP and duration/cost paths.
- `src/markets/wa/lib/optimizer.js` connects RCM scenarios and dispatch strategies.
- WA data contains reserve-capacity history, ESOO adequacy, queue/fleet, duration, and cost information.
- The dashboard already treats BRCP, RCP, de-rating, and dispatch as distinct concepts.

**Causal chain to implement**

```text
electrification and industrial load
+ thermal retirement
+ reserve-standard duration changes
+ transmission delivery
-> capacity requirement and BRCP/RCP
+ renewable-driven intraday volatility
-> BESS revenue
-> certified BESS entry and duration migration
-> capacity/merchant dilution
-> EBITDA, DSCR and returns
```

**Gaps**

- The BRCP engine is WA-only and does not emit the common forecast/provenance contract.
- Current system planning should be displayed as Today/2030/2035 rather than dispersed facts.
- Public project-level queue and connection maturity are incomplete; do not imply an exact funnel.
- The digitized confidential forward material must remain display-only and must not become a public recurring dependency.

**Official-data-backed upgrade**

- AEMO WEM ESOO and forecasting workbooks for demand, peak, adequacy and capacity requirements.
- AEMO Market Data Site for prices and reserve-capacity results.
- ERA BRCP decisions.
- AEMO EOI/REOI, RCM timetable, QED workbooks, and WA rules archives.
- Transmission delivery should remain milestone-based/manual until an exact repeatable Western Power dataset is confirmed.

**Grid Value Map feasibility:** Medium. Build a regional/network value profile first; public granular queue and substation data are insufficient for a comprehensive project siting map.

### Great Britain

**Current thesis:** diversified merchant/ancillary/capacity economics with tollability, but exposed to connection delays, rapid BESS entry, and service saturation.

**Existing strengths**

- Current CM, CP2030, fleet, pipeline, toll, and compression concepts are present.
- The dashboard already distinguishes capacity, merchant, and toll strategies.
- `src/markets/gb/sections.js` has visuals that can accept official planning and competition series.

**Causal chain to implement**

```text
electrification and data-centre load
+ wind build
+ thermal/nuclear availability
+ transmission boundary constraints
-> volatility, balancing actions and capacity need
-> energy/BM/ancillary/CM/toll value
-> BESS and LDES connection/award funnel
-> service and spread compression
-> contracted share, EBITDA, debt and exit value
```

**Gaps**

- Illustrative project rows and build curves are not adequate for competition or COD forecasting.
- The current data catalogue understates the availability of structured official CM and connection data.
- No historic FES-versus-actual or TEC/REPD COD-delay backtest.
- No explicit map from ETYS boundary needs to storage revenue relevance.

**Official-data-backed upgrade**

- NESO weekly Capacity Market Register CSV/API resources.
- NESO TEC Register CSV/API, deduplicated with DESNZ REPD.
- NESO FES data workbook/API tables through 2035.
- NESO ETYS and Beyond 2030 workbooks for boundary needs and reinforcement timing.
- Elexon BMRS open API for price, imbalance, balancing, and system data.
- DESNZ CP2030, REPD, and Ofgem LDES publications/model.

**Grid Value Map feasibility:** High for a decision-support map, not a power-flow map. Use transmission boundaries, connection site/region, REPD location, reinforcement milestones, and regional FES. Avoid claiming nodal revenue.

### Ireland

**Current thesis:** capacity/adequacy and flexibility value in a small island system, offset by a very large connection pipeline and expected ancillary compression.

**Existing strengths**

- CRM, DS3/FASS transition, SNSP, constraints, interconnection, and demand drivers are already discussed.
- Four-hour economics align with the capacity/flexibility thesis.

**Causal chain to implement**

```text
data-centre and economic load
+ renewable build and SNSP
+ interconnector and network delivery
-> adequacy, dispatch-down, constraints and reserve need
-> CRM + FASS/ancillary + energy value
-> ECP/connection-batch BESS funnel
-> ancillary saturation and merchant compression
-> EBITDA, debt headroom and downside
```

**Gaps**

- Project register rows are explicit examples.
- Current forecast curves stop before a consistent 2035 horizon.
- CRM, network, constraint, and demand evidence are not connected to one driver model.
- No official-plan vintage backtest.

**Official-data-backed upgrade**

- EirGrid/SONI Generation Capacity Statement/AIRAA and data workbooks.
- Ten-Year Transmission Forecast Statement and Shaping Our Electricity Future.
- Network Delivery Portfolio/TID reports and ECP constraint forecasts.
- Constraint and curtailment reports/datasets.
- SEMO market and CRM publications.
- CRU connection-policy decisions.
- CSO PxStat data-centre electricity consumption.

**Grid Value Map feasibility:** Medium-high. Use constraint groups, network-delivery regions, ECP information, and interconnectors. Exact substation/project economics require caution.

### Romania

**Current thesis:** merchant energy and balancing opportunity amplified by renewables and grid development, with grant support but weak contracted revenue visibility.

**Existing strengths**

- Negative pricing, balancing, grant, fleet, pipeline, and connection risk are recognized.
- The local lab already models grant and merchant/service splits.

**Causal chain to implement**

```text
renewable additions
+ coal/lignite and thermal changes
+ demand/electrification
+ interconnection and RET reinforcement
-> negative prices, balancing need and zonal connection scarcity
-> merchant energy + balancing revenue
-> grant-supported BESS and connection-auction pipeline
-> competition and price capture compression
-> EBITDA, leverage constraint and valuation
```

**Gaps**

- Seed projects and short COD horizon.
- No contracted national storage revenue mechanism; the investment case is more merchant than the current global score presentation implies.
- Public pipeline data is fragmented across connection allocation, authorizations, and announcements.
- Source links should point to exact Transelectrica/OPCOM datasets, not generic pages.

**Official-data-backed upgrade**

- Transelectrica 2026-2035 development plan.
- Transelectrica connection-capacity allocation centralizers and indicative connection map.
- Transelectrica daily Excel and balancing-market reports.
- OPCOM results and reports.
- ANRE authorizations/decisions where sufficiently structured.
- ENTSO-E Transparency for day-ahead and system observations.

**Grid Value Map feasibility:** Medium-high. The connection-capacity zones, centralizer, official map, RET plan, and reinforcement schedule can support a zonal grid-value map. Project completeness remains a caveat.

### Poland

**Current thesis:** capacity-market-backed four-hour storage with merchant upside, substantial renewables and adequacy need, but a crowded future pipeline.

**Existing strengths**

- Capacity contract, duration, de-rating, grant, energy spread, and pipeline pressure are represented.
- Four-hour investment lab and cross-market strategy support are already present.

**Causal chain to implement**

```text
coal retirement and thermal availability
+ demand/electrification
+ renewable and offshore-wind build
+ transmission development
-> adequacy, capacity-market need, balancing and spreads
-> capacity + merchant + ancillary value
-> certified/connected BESS pipeline
-> auction competition, de-rating and merchant compression
-> secured/merchant EBITDA, debt and equity returns
```

**Gaps**

- The capacity-payment seed and correction factor must be reconstructed and revalidated.
- Project rows are placeholders.
- Forecast horizon ends too early.
- Official development-plan spatial information is not yet used.
- Capacity auction results are public but not a simple recurring project registry; unit-level extraction requires transformation/manual review.

**Official-data-backed upgrade**

- Poland’s June 2026 adopted NECP to 2040 and scenario/method attachments.
- PSE Transmission Network Development Plan 2025-2034, including spatial demand/generation, storage connection projects, and adequacy.
- PSE Market Data API/site for operational market observations.
- PSE capacity-market and URE final auction results.
- ENTSO-E Transparency for standardized price/system history.

**Grid Value Map feasibility:** Medium. The PSE plan supports spatial system and reinforcement layers and named storage-related investments. A complete live storage queue/location feed was not verified; this must be shown as partial coverage.

### Japan — common national layer

**Current thesis:** regional merchant/curtailment differences plus national capacity-market participation; returns depend heavily on one-year award and uncertain renewal/capture assumptions.

**Existing strengths**

- One shared dashboard avoids duplicated national rules.
- Tokyo, Kyushu, and Hokkaido are distinct allocation markets.
- The comparison engine correctly classifies the capacity payment as auction-renewal risk rather than a 15-year secured contract.
- `docs/japan-etl-gates.md` is candid about seed coverage.

**Common causal chain**

```text
regional demand and new industrial/data-centre load
+ regional renewable build
+ thermal/nuclear availability
+ cross-regional reinforcement
-> regional adequacy, curtailment, basis and reserve need
-> JEPX + balancing + capacity/LDCA value
-> grid-scale battery applications and awards
-> regional saturation and auction renewal risk
-> EBITDA, debtability and exit value
```

**Common gaps**

- Eight of the principal investment inputs are seed-level according to the repository’s own ETL gate review.
- No public complete project-level storage queue was verified.
- Capacity-market award, contract-status, and long-term decarbonized auction data are public but require Japanese-language transformation.
- A national official 2035 point should not be invented; OCCTO’s current ten-year plan reaches FY2034, while METI provides 2040 policy/outlook.

**Official-data-backed upgrade**

- OCCTO Electricity Supply Plans and supply-demand/interconnector outlook archives.
- OCCTO capacity auction files, contract-status files, and long-term decarbonized capacity auction award lists.
- OCCTO cross-regional grid master plan.
- JEPX day-ahead regional downloads.
- Regional TSO curtailment outlook/results and balancing-operation files.
- METI Seventh Strategic Energy Plan and 2040 outlook.

### Japan — Tokyo

**Distinct thesis:** large load center, data-center growth and adequacy pressure, with lower renewable-surplus charging value than Kyushu but potentially stronger scarcity and toll/contract demand.

**Target drivers**

- Tokyo demand, data centers, supply adequacy, thermal/nuclear availability;
- Tokyo-Chubu and Tohoku-Tokyo reinforcement;
- JEPX Tokyo spread and price separation;
- TEPCO grid/non-firm connection and curtailment outlook;
- credible capacity/LDCA awards and storage applications where public.

**Grid Value Map feasibility:** Medium. Use regional boundaries, interconnectors, demand concentrations, reinforcement, and published connection/curtailment information. Do not imply a complete project queue.

### Japan — Kyushu

**Distinct thesis:** solar surplus and curtailment create charging and balancing opportunity, while heavy storage entry, interconnection, nuclear output, and transmission expansion can rapidly compress value.

**Target drivers**

- solar capacity and curtailment days/energy;
- minimum demand and nuclear availability;
- Kanmon/interregional transfers;
- JEPX Kyushu spread/negative-price frequency;
- Kyushu T&D curtailment forecasts/results;
- storage connection and auction award evidence.

**Grid Value Map feasibility:** Medium-high at region/subregion level. Kyushu T&D publishes operational curtailment evidence and network/capacity maps, but the available “welcome zone” maps must not be mistaken for a complete generator connection queue.

### Japan — Hokkaido

**Distinct thesis:** wind/solar surplus, small local load, interconnector constraints and balancing need create high structural value, but connection saturation and transmission timing create the highest development risk.

**Target drivers**

- regional demand and new industrial/data-center loads;
- wind/solar deployment and curtailment;
- Hokkaido-Honshu reinforcement;
- JEPX Hokkaido basis/spread;
- Hokkaido T&D curtailment and balancing CSV history;
- project and auction maturity.

**Grid Value Map feasibility:** Medium. Regional and interconnector value are supportable; a complete substation-level storage investment map is not.

## Recommended new modules

### Module 1 — Metric and source provenance registry

- **Purpose:** make each number traceable.
- **Investor question:** What is this number, who produced it, when, and how was it transformed?
- **Required data:** registry fields defined in `PUBLIC_DATA_SOURCE_REGISTRY.md`; metric-to-source and metric-to-series relationships.
- **Proposed visual:** expand the existing source drawer into a metric provenance panel.
- **Forecast logic:** none; distinguish observed, official forecast, analyst scenario, and seed.
- **Investment takeaway:** exposes evidence gaps before they become return precision.
- **Implementation:** add `src/governance/sourceRegistry.js` and `src/governance/metrics.js`; link `src/governance/datasets.js` by `sourceId`; extend `src/components/sourceDrawer.js`.

### Module 2 — System 2030/2035 view

- **Purpose:** create a common official planning foundation.
- **Investor question:** What system change creates or removes storage need?
- **Required data:** demand/peak, generation mix, renewables, thermal/nuclear change, storage, interconnector, adequacy, and planning vintage.
- **Proposed visual:** Today/2030/2035 KPI rail plus capacity/mix line or bars and a causal commentary card.
- **Forecast logic:** official values only; when 2035 is unavailable, show the nearest official year and label it. Never interpolate silently.
- **Investment takeaway:** system need, timing, and the driver most likely to invalidate the thesis.
- **Implementation:** new reusable block in `src/markets/_shared/blocks.js`; WA adapter; reuse `barChart.js` and `lineChart.js`.

### Module 3 — Grid value profile/map

- **Purpose:** connect physical constraints to revenue and connection risk.
- **Investor question:** Where is storage structurally valuable, and can a project connect in time?
- **Required data:** region/boundary, constraint/curtailment, planned reinforcement, interconnection, demand/renewable zones, connection information.
- **Proposed visual:** market-dependent SVG map or ranked regional profile with layers and milestone timeline.
- **Forecast logic:** current constraint plus committed/planned reinforcement scenarios; no power-flow simulation.
- **Investment takeaway:** market-value uplift and project-delivery risk shown separately.
- **Implementation:** `src/maps/gridValueMap.js` and a declarative `gridValue` block; use preprocessed GeoJSON/SVG only where licensed and stable.

### Module 4 — Revenue mechanism outlook

- **Purpose:** turn physical need into a revenue thesis.
- **Investor question:** Which revenue pool remains scalable and bankable?
- **Required data:** historical market size/prices, qualification/de-rating, contracted tenure, competing qualified MW, official rule changes.
- **Proposed visual:** revenue stack waterfall plus direction, volatility, scalability, cannibalization, contractability, and bankability scorecards.
- **Forecast logic:** addressable pool and effective competition drivers; use ranges and sensitivities.
- **Investment takeaway:** secured share, merchant exposure, and the revenue source that sets debt capacity.
- **Implementation:** reuse `waterfallChart.js`, cards, and score rows; add a shared revenue-mechanism schema.

### Module 5 — Official competition funnel

- **Purpose:** replace headline/placeholder pipeline with execution-weighted supply.
- **Investor question:** How much credible storage will compete by each COD year?
- **Required data:** project ID, name, owner, MW/MWh, duration, location, stage, stage date, expected COD, connection/permit/contract/finance/construction evidence, source.
- **Proposed visual:** stage funnel, annual COD band, duration distribution, and vintage slippage.
- **Forecast logic:** deterministic stage probabilities initially; later calibrate probabilities from historical transitions.
- **Investment takeaway:** effective competing MW, time to saturation, and pipeline evidence coverage.
- **Implementation:** new canonical project schema and ETL adapters; reuse bar/pipe/stage-probability blocks after replacing local taxonomies.

### Module 6 — Scenario driver lab

- **Purpose:** construct comparable but market-specific scenarios.
- **Investor question:** Which assumptions drive the return range?
- **Required data:** driver manifests, official base values, scenario deltas, lags, sensitivities, evidence, invalidation thresholds.
- **Proposed visual:** Base/Bear/Bull selector, driver bridge, forecast band, and delta-to-return tornado.
- **Forecast logic:** described in the Forecast Methodology section.
- **Investment takeaway:** return range and the small number of variables that matter.
- **Implementation:** new pure modules under `src/forecast/`; reuse `bandChart.js`, `waterfallChart.js`, and existing state/rerender patterns.

### Module 7 — Historical backtest

- **Purpose:** calibrate scenario widths and delivery assumptions.
- **Investor question:** How wrong have official plans and project COD claims been?
- **Required data:** archived planning vintages, realized series, project stage/COD snapshots.
- **Proposed visual:** forecast-vintage fan vs actual, error table, bias badge, COD survival/delay distribution.
- **Forecast logic:** calculate bias, MAE/MAPE where valid, coverage, and delay percentiles.
- **Investment takeaway:** an evidence-based rather than arbitrary scenario range.
- **Implementation:** ETL archive manifests plus `src/forecast/backtest.js`; do not rewrite source archives.

### Module 8 — Forecast confidence

- **Purpose:** express confidence consistently.
- **Investor question:** How much weight should be placed on this forecast?
- **Required data:** evidence count/independence, execution maturity, backtest, sensitivity, freshness/machine-readability.
- **Proposed visual:** High/Medium/Low badge with five-part decomposition and caveat.
- **Forecast logic:** deterministic 0-10 rubric below.
- **Investment takeaway:** confidence-adjusted allocation, not a cosmetic score.
- **Implementation:** `src/forecast/confidence.js` plus new component; keep separate from market attractiveness scores.

### Module 9 — Reconciled underwriting engine

- **Purpose:** connect market scenarios to capital structure and valuation.
- **Investor question:** What are project and equity returns, debt capacity, and exit sensitivity under the same drivers?
- **Required data:** common finance assumptions, scenario revenue outputs, contracted/merchant classifications, capex/opex, degradation, augmentation, debt terms, taxes where included, exit rules.
- **Proposed visual:** revenue-to-EBITDA waterfall, debt sizing bridge, equity cash-flow table, IRR/MOIC range, valuation sensitivity.
- **Forecast logic:** common cash-flow primitives; country-specific terms remain explicit adapters.
- **Investment takeaway:** bankability, downside protection, and valuation attribution.
- **Implementation:** extract pure finance primitives from `src/comparison/engine.js`, `src/markets/_shared/lab.js`, and WA lab; preserve exact baseline outputs with tests before changing assumptions.

### Module 10 — Policy-to-cash-flow bridge

- **Purpose:** keep policy analysis investment-relevant.
- **Investor question:** Does a rule change affect revenue, bankability, development risk, competition, or capex?
- **Required data:** official policy/rule, effective date, affected mechanism, cash-flow mapping, implementation status.
- **Proposed visual:** compact impact matrix and waterfall where quantifiable.
- **Forecast logic:** rules alter explicit model inputs; qualitative effects remain arrows with rationale.
- **Investment takeaway:** cash-flow consequence and timing.
- **Implementation:** extend existing policy/story cards; no standalone policy library.

## Forecast methodology

### Two-dimensional scenario design

Use two separate scenario dimensions:

1. **Market-value scenario:** Base, Bear, Bull from the BESS revenue/return perspective.
2. **Project-delivery overlay:** On time, delayed, failed/downsized connection or construction.

This avoids treating a grid delay as unconditionally bullish. A delay may increase system scarcity but prevent the project from reaching COD.

### Base case

- Uses the latest approved official central or reference planning trajectory.
- Applies the visible, de-duplicated project funnel with stage probabilities.
- Applies historically calibrated transmission and COD slippage where available.
- Uses observed revenue capture and governed realization assumptions.
- Uses approved financing and capex assumptions.

### Bear case for BESS returns

Typical drivers:

- BESS deployment and connection faster than Base;
- reinforcement/interconnector delivered on time or early;
- slower load and renewable growth;
- slower thermal retirement or higher flexible supply;
- faster ancillary saturation and lower spread capture;
- tighter de-rating or auction competition;
- higher capex/financing cost or weaker exit yield.

### Bull case for BESS returns

Typical drivers:

- faster demand/renewable growth or thermal retirement;
- slower competing BESS commissioning;
- delayed network reinforcement that increases physical imbalance;
- stronger scarcity, curtailment or balancing need;
- better contract/toll availability;
- lower capex or stronger financing/exit conditions.

Project-delivery overlays must still penalize a project whose own grid route is delayed.

### Driver manifest

Each scenario input should have:

```text
driver_id
market_id
driver_name
layer
unit
base_value
bear_value
bull_value
value_year
source_metric_id
source_vintage
scenario_owner
relationship
lag_years
sensitivity_or_formula
confidence_id
invalidation_threshold
notes
```

### Outputs

Output only what the drivers support:

- installed BESS MW/MWh and duration;
- effective competing MW;
- addressable revenue pool or price/spread range;
- revenue/MW and revenue/MWh;
- EBITDA/MW;
- secured revenue share/tenor;
- debt capacity;
- project and equity IRR;
- MOIC;
- valuation range.

Do not publish an annual point forecast where the available data only supports a directional or range conclusion.

### Cross-market scenario semantics

`Bear` and `Bull` always refer to BESS investment returns, not high/low demand or high/low system cost. UI text must show the specific driver direction because, for example, high storage deployment is usually Bear for incumbent revenue.

## Backtesting framework

### Backtestable official archives

| Market | Priority archives | Initial comparison |
|---|---|---|
| WA | WEM ESOO, BRCP decisions, QED, historical ESM rules | demand/peak/adequacy forecast error; BRCP/RCP difference; rule/delivery timing |
| GB | FES, ETYS, CM Register/results, REPD/TEC vintages | demand/storage/wind forecast error; connection/COD slippage; CM procurement/price |
| Ireland | GCS/AIRAA, transmission plans, constraint reports, connection batches | demand/adequacy forecast error; network milestone delay; dispatch-down |
| Romania | Transelectrica development-plan vintages and connection allocation releases | demand/generation plan error; reinforcement and connection milestone delay |
| Poland | PSE development-plan vintages, capacity auctions, market data | demand/renewables forecast error; capacity price/procurement; project milestones |
| Japan | OCCTO supply plans/outlooks, capacity auction and contract-status archives, TSO curtailment archives | regional demand/adequacy error; award/contract change; curtailment forecast vs actual |

### Metrics

- forecast error = realized minus forecast;
- percentage error only where denominator is meaningful;
- mean absolute error and directional bias;
- scenario coverage rate;
- project COD delay in months;
- stage-transition probability;
- transmission milestone delay;
- source revision magnitude.

### Vintage rules

- Store the original source URL, publication date, retrieval date, checksum, target year, and parsed value.
- Never overwrite a vintage.
- Compare only values with consistent definitions/units.
- Show missing historical coverage explicitly.
- Use at least three independent vintages before claiming systematic bias.

### How the backtest affects forecasts

- Scenario width should be at least the relevant historic error/delay percentile unless a documented structural change justifies otherwise.
- Stage probabilities should migrate from analyst priors to observed transition rates.
- A systematic optimistic bias in official delivery plans should reduce Base-case milestone probability, not cause the official source to be discarded.

## Forecast confidence framework

Confidence is calculated per driver or output, not assigned to an entire market.

### Rubric

Score each dimension 0-2:

| Dimension | 0 | 1 | 2 |
|---|---|---|---|
| Evidence strength | assumption or single weak signal | one authoritative signal or several dependent signals | multiple independent official signals |
| Execution maturity | aspiration/uncommitted | approved/contracted but material execution remains | operating, under construction, or legally committed with clear funding |
| Backtest reliability | no archive or poor history | limited/mixed history | adequate archive and acceptable calibrated error |
| Sensitivity | output changes materially under small input changes | moderate sensitivity | low sensitivity or bounded contractual outcome |
| Freshness/repeatability | stale/unrepeatable | current but manual/complex | current and repeatable machine-readable feed |

Total:

- 8-10: High;
- 5-7: Medium;
- 0-4: Low.

Always display:

- score and label;
- strongest evidence;
- largest uncertainty;
- last evaluated date;
- invalidation condition.

An official forecast is not automatically High. A fresh API does not automatically make a behavior-dependent revenue forecast reliable.

## Case study framework

Case studies are P2 evidence modules, not decorative project profiles.

### Eligibility

A case study should have public documentation for at least four of:

- original project thesis or award basis;
- size/duration and COD;
- contract or revenue mechanism;
- connection/construction milestones;
- financing/refinancing;
- operating outcome or material change;
- sale/valuation;
- augmentation or degradation event.

### Template

```text
Investment question
-> Original thesis
-> Original assumptions and evidence date
-> Actual outcome
-> Forecast error
-> Root cause
-> Investment lesson
-> Dashboard model change
```

### Candidate themes

- WA reserve-capacity timing/duration and augmentation;
- GB ancillary saturation, tolling, or connection-delay evidence;
- Ireland CRM/DS3-to-FASS transition and constraint exposure;
- Romania grant-to-COD and merchant capture;
- Poland capacity-contract/de-rating and delivery;
- Japan LDCA/capacity contract status, curtailment capture, or grid-delay evidence.

Select named projects only after verifying the required public documentation. Corporate announcements alone should be Tier 2 enrichment, not the recurring core dataset.

## Policy-to-cash-flow framework

For each material rule:

| Field | Required interpretation |
|---|---|
| Policy/rule | Exact official decision and effective date |
| Market mechanism | Capacity, balancing, energy, connection, grant, toll, etc. |
| Revenue | Up / Neutral / Down with logic |
| Bankability | Up / Neutral / Down |
| Development risk | Up / Neutral / Down |
| Competition | Up / Neutral / Down |
| Capex | Up / Neutral / Down |
| Debt | Up / Neutral / Down |
| Long-term IRR | Up / Neutral / Down |
| Model mapping | Exact input/formula affected |
| Confidence | Evidence-based label |

Do not quantify an effect when only the direction is supportable.

## Homepage upgrade: Global BESS Capital Allocation Cockpit

### Common comparable indicators

These require governed definitions across all markets:

- official system-need signal;
- revenue visibility: secured share and tenor, with contract quality;
- merchant opportunity;
- effective competition/need ratio;
- connection and delivery risk;
- forecast confidence;
- unlevered project IRR and MOIC;
- debt capacity/indicative leverage;
- equity IRR;
- exit liquidity evidence;
- thesis invalidation status.

### Market-specific indicators

- WA: reserve-capacity price, duration/de-rating, RCM timing.
- GB: toll availability, CM/LDES access, boundary and connection reform.
- Ireland: CRM/FASS exposure, SNSP/dispatch-down, ECP/connection pressure.
- Romania: grant status, balancing capture, connection-capacity auction/zone.
- Poland: CM contract/de-rating, coal/adequacy transition, auction competition.
- Tokyo: adequacy/load growth and interregional reinforcement.
- Kyushu: curtailment/solar surplus and saturation.
- Hokkaido: interconnector/curtailment value and extreme connection risk.

### Presentation

1. Top allocation cards: return range, evidence confidence, revenue visibility, and one market-specific driver.
2. Need-vs-competition matrix: official system need on one axis, effective competing BESS on the other.
3. Confidence-return frontier: replace false-ranking precision with return range and confidence.
4. Common underwriting table: base/bear/bull project and equity returns with secured revenue.
5. Thesis monitor: catalysts, invalidation conditions, and material source updates.

Do not combine attractiveness and confidence into one opaque score. A high-return, low-confidence market should remain visibly different from a moderate-return, high-confidence market.

## Implementation priority and scoring

Scores are 1 (low) to 5 (high). For Complexity and Maintenance, 5 means harder/more burdensome.

| Enhancement | Investment Decision Value | Forecast Credibility | Data Availability | Automation Feasibility | Implementation Complexity | Maintenance Burden | Priority |
|---|---:|---:|---:|---:|---:|---:|---|
| Metric/source registry and forecast authority labels | 5 | 5 | 5 | 5 | 2 | 2 | P0 |
| Remove placeholder projects from decision metrics and show coverage | 5 | 5 | 4 | 3 | 2 | 3 | P0 |
| Official Today/2030/2035 system views | 5 | 5 | 5 | 3 | 3 | 3 | P0 |
| Canonical competition funnel and project schema | 5 | 5 | 3 | 3 | 4 | 4 | P0 |
| Revalidate contracted-revenue bases, especially Poland | 5 | 5 | 4 | 2 | 3 | 3 | P0 |
| Common scenario driver manifest and semantics | 5 | 5 | 4 | 4 | 3 | 3 | P0 |
| Revenue mechanism outlook linked to competition | 5 | 5 | 4 | 3 | 4 | 4 | P1 |
| Historical planning and COD backtesting | 4 | 5 | 4 | 3 | 3 | 3 | P1 |
| Deterministic forecast confidence | 4 | 5 | 5 | 5 | 3 | 2 | P1 |
| Reconciled underwriting and debt/equity engine | 5 | 4 | 3 | 4 | 5 | 4 | P1 |
| Evidence-adjusted global allocation cockpit | 5 | 4 | 4 | 4 | 4 | 3 | P1 |
| Grid value profiles/maps | 5 | 4 | 3 | 2 | 4 | 4 | P1 by market |
| Policy-to-cash-flow bridge | 4 | 4 | 5 | 2 | 2 | 3 | P2 |
| Publicly evidenced case studies | 3 | 4 | 2 | 1 | 3 | 5 | P2 |
| Mobile priority-column/card views | 3 | 2 | 5 | 5 | 2 | 2 | P2 |
| Lazy-load market dashboards | 2 | 1 | 5 | 5 | 3 | 1 | P2 |
| Full GIS/nodal map | 2 | 2 | 1 | 1 | 5 | 5 | P3 / avoid |
| Hourly forward dispatch or production-cost model | 3 | 2 | 1 | 1 | 5 | 5 | P3 / avoid |

## First implementation recommendation

Implement one vertical evidence slice before expanding the entire UI:

1. add the comprehensive source and metric registries;
2. define observed/official-forecast/analyst-scenario/seed labels;
3. ingest the structured NESO Capacity Market Register and TEC Register;
4. replace GB placeholder competition rows;
5. add a GB Today/2030/2035 system view from FES/ETYS/CP2030;
6. feed those drivers into one transparent GB Base/Bear/Bull revenue-to-IRR bridge;
7. add provenance and confidence to every output.

Great Britain is the best pilot because official public data is unusually structured, the dashboard already has the necessary market concepts, and the current placeholder pipeline creates an obvious credibility gain. Once the contract works, apply it to WA and Ireland, then Romania, Poland, and Japan according to source feasibility.
