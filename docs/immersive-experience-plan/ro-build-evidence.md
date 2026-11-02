# Romania story build evidence and decisions

Decision date: **2 November 2026, Australia/Perth**. Documentation only. The approved call and bilingual argument stand; quantitative construction still has source, reuse and calculation gates. This file authorises no implementation or release.

Read: [AGENTS.md](../../AGENTS.md), [master plan](README.md), [WP-02 through WP-10](engineering-work-packages.md#wp-02-establish-the-story-content-and-evidence-contract), [Romania storyboard](romania-storyboard.md), its [canonical evidence register](source-register.md#g1-ro-evidence), the claim ledger, the dated merchant-lines and open-calls rulings, and the reuse evidence identified in section 6.

## 1. Rule 11 verdict

**PASS: no changed call, play, duration or lens.** This permits the present decision record; it is not a G-2 build approval. Master-plan rule 11 also covers a changed thesis. The 1 November script reconciliation remains the editorial authority; this review does not reopen or edit the view's thesis.

Preconditions were checked before authoring:

| Precondition | Evidence | Result |
| --- | --- | --- |
| Required changes on `main` | Local `main` / HEAD `7e00c1a0abac88d9bb4355624febb0bb571ff381`. Ancestry checks passed for #108 `ef47bb9`, #109 `e47adea`, #110 `4ec1cf2`, #111 `6a5062c`, #112 `fba750c`, #113 `bbe4070` (`codex/ie-six-hour-review-20261101`), and script #94 `9ae59fd`. | Pass |
| Current remote corroboration | GitHub `main` was `3126ff0ea0ad3dee5b87eed7aa6eb370c223cc7c`. Its comparison with local HEAD is ahead, with no changes to the Romania view, storyboard, comparison inputs, briefing calculations or investment-summary calculations. Later ETL snapshots and other market stories do not change these four anchor fields. No pull or checkout was performed. | Pass |
| Live anchor versus script | Read `view/markets/ro.json`; evaluated `briefingFromDisk` with evaluation date `2026-11-02`, then the existing home and investment-summary projections. Compared with storyboard section 1, the `reviewedAgainst` authoring record. | Pass |
| Clean working tree | `git status --porcelain=v1` was empty before this file. The checkout was on `main`; the user's express instruction to write only this document and open no branch governs this session. | Pass |

| Anchor | Live view / computed row, evaluated for 2 November | Script's `reviewedAgainst` record | Verdict |
| --- | --- | --- | --- |
| Call | `verdicts.infraFund.call: "opportunistic"`; displayed **"Situational" / "择机投入"**, tier `situational` | **"opportunistic", "Situational / 择机投入", tier "situational"** | Match |
| Play | `verdicts.infraFund.play: "ro-mer-2h"`; **"Merchant · 2h" / "市场化 · 2小时"** | **"ro-mer-2h"**, **"Merchant · 2h" / "市场化 · 2小时"** | Match |
| Duration | `plays["ro-mer-2h"].hours: 2` | **"two hours"** | Match |
| Lens | Selected briefing lens **`infraFund`** | **"Default lens: infraFund"** | Match |

The script records repository anchor `edcb39ca0d69397f3683dffc9af5ffb49473c98c`, evaluated for 31 October, followed by its approved 1 November reconciliation. The newer commit alone does not mean the narrative is stale. Additional checks also agree: revenue route `mer`, entry `operating`, evidence `fair`, next event `ro-grant-status-review`, and the floor-qualified entry condition. There is no executable Romania story module yet: the script record is Markdown, not a newly invented runtime object.

**Stop rule for the eventual build:** re-read the live row at its actual candidate SHA. A changed call or play returns to editorial review; a changed duration, lens or thesis also requires reconciliation. Do not silently revise `reviewedAgainst` to make a build pass. Today's grant check in section 7 changes none of these fields.

## 2. Gaps

All four open Romania `GAP-*` entries are included below. “Non-blocking” means the already approved qualitative or Example treatment can carry the shot; it does not clear a missing observation.

| Open gap | Blocking? | Exact page wording / figure it settles | What closes it |
| --- | --- | --- | --- |
| **GAP-RO-FLEET** | **Yes, numeric Chart-RO-FLEET.** Optional missing dates remain null and may be omitted; they cannot be filled from press summaries. | ro-06: “Transelectrica counted ‹bound: fleet count› on ‹bound: fleet count date› and expects about ‹bound: fleet year-end additions› more by the end of the year, which would pass the national plan's 2030 level.” Also the MW axis, dated points, year-end estimate and plan line. | Open the primary for every displayed count, record its population and vintage, settle reuse, authenticate the plan reference, resolve the estimate baseline below and sign CALC-RO-FLEET. Fixed-vintage format is already decided; a new ETL dataset kind is unnecessary. |
| **GAP-RO-PRICES / MR-4** | **Yes for any observed price layer; no for the approved unscaled Example, model-labelled design comparison or index-only path.** | ro-04: “Example: the shape of a day, not observed prices.” ro-05: “This story has not established how often the border binds or how large the price effect is.” Any proposed observed spread, day-ahead value, duration capture or same-price share would replace these treatments. | Obtain Romanian and Bulgarian primary series with applicable publication rights; recompute on documented clocks, intervals, missing-data rules and methods; validate and obtain analyst acceptance. An API token, a monthly mean or a generic ENTSO-E licence line does not close it. |
| **GAP-RO-RESERVES** | Non-blocking with Thin and an explicit model assumption. **Blocks observed procurement, price and saturation claims.** | ro-07: “That curve was calibrated on Britain, not on a Romanian reserve-price series. Local procurement results are needed to test it.” ro-10 balancing evidence: “Thin: results not yet located.” | Open product-specific 2025–2026 procurement volumes and capacity prices, with units, coverage, qualification boundary and reuse settled. Keep capacity payment and activation-energy settlement separate. |
| **GAP-RO-HISTORY** | Non-blocking for the signed generation-type schematic. **Blocks generation shares, ranks and quantitative historical layers.** | ro-01: “Romania's power comes mostly from hydro, nuclear, gas and lignite, with wind and solar a fast-growing share.” | Open dated ANRE or operator generation data, distinguish output from installed capacity, and settle reuse. Until then retain named types only; no pie chart, percentages or scale encoded by icon counts. |

Other retained gates must not disappear behind a green Rule 11 result:

| Gate / blocker | Precisely what is blocked | Treatment / closure |
| --- | --- | --- |
| **CALC-RO-FLEET: estimate baseline** | A numeric year-end total plotted as if explicitly forecast by the operator. | The release is dated 20 August; its count is for 1 August. It does not explicitly align the remaining additions with that count. The tempting addition `989 + 1,000 = 1,989 MW` is conditional arithmetic, not an authenticated official total. Keep total null until the forecast baseline is established or the analyst accepts a separately labelled derived estimate. |
| **SRC-RO-03: official guide comparison and reuse** | Production plan line and grant-obligation numbers sourced only from the third-party guide copy. | Compare the copy with the ministry's or Gazette's applicable annex, establish version and reuse. It contains the candidate locators and values in section 3; it is not the primary-host comparison required by G-1. |
| **Reuse clearance for new external records** | Numerical publication from the operator fleet release, Bulgarian yearbook and other proposed evidence records without a recorded permission/basis-of-use decision. | Opening a document establishes access, not permission. Section 8 records the source-specific outcomes. No permission is invented here; the applicable quantitative layers remain gated. |
| **OC-RO-GRANT** | Asserting a verified close/extension, award, beneficiary, receipt, or categorical absence of publication after today's failed access. | Keep outcome unresolved. “No published result”, “Award not published” and “The grant call's result is not yet published” are the affected ro-03/10/12 strings. Today's defensible authoring status is **outcome not verified**; see section 7. Retain the approved unresolved-call treatment, with both languages aligned. |
| **OC-RO-FLOOR** | Actual entry, any floor amount, target-asset tenor, secured share attributable to the floor, or floor-inclusive price. | Obtain and assess complete asset-specific terms and credit support, then make a separate priced proposal. Does not block the qualitative entry-condition story. |
| **CF-RO-08** | Treating reported Order 16/2026 as having resolved `ro-connection-guarantee-order`. | Read the formal order and establish its licensing/connection/guarantee scope, then obtain the analyst's trigger decision. The opened Orders 53/2024, 79/2025 and 15/2026 do not resolve this separate question. |

No currently unmapped figure is accepted for construction. Proposed evidence fields below are named interfaces, not existing runtime fields. The later data/content PR must actually supply them and reject or suppress unresolved bindings; a typed fallback number is a build blocker.

## 3. Field list

**Decision:** the later data PR should define a market-local, manual, fixed-vintage record, provisionally **`RO_STORY_RECORDS`** in **`src/markets/ro/data/storyEvidence.js`**. That path and export are a proposal only; neither exists as a result of this session. Use Finland's publication-only record pattern, not a fabricated price time series. No scheduled refresh, new dataset kind, model input binding or change to `src/governance/datasets.js` is needed for these records.

Below, `R` means that proposed record; `C` means the existing `comparison` export in `src/markets/ro/comparison.js`; `B` means the existing home briefing; `row` is its selected Romania fund opportunity after investment-summary projection; `I = row.investment`. “Candidate” is evidence for review. A candidate blocked by source, reuse or calculation gates has an **eligible public value of null**, not zero, until its gate closes. The numeric candidates written in this decision file must not be pasted into page copy.

Primary locators used in the manifest:

| Key | Document / locator | Opened in this review |
| --- | --- | --- |
| **S01 / SRC-RO-01** | [Operator release, 20 August 2026](https://web.transelectrica.ro/noutati/noutati/734_2026.08.20_19-51-16.pdf). PDF p. 1, final paragraph for the 1 August total; p. 2, paragraph beginning “Până la sfârșitul anului 2026” for further storage connections. No table. | Yes; two pages. |
| **S02 / SRC-RO-02** | Reported counts listed in the canonical register; exact primary releases/tables/rows have not been located. | **No primary locator established.** These rows cannot be observed points. |
| **S03 / SRC-RO-03** | [Applicant-guide copy](https://startupcafe.ro/wp-content/uploads/2026/08/Ghidul_solicitantului_instalatii_stocare_autonama_FM.pdf), annex to Order 915/14.08.2026. PDF/printed p. 4, opening PNIESC paragraph; p. 10, final paragraph before section 1.2; p. 33, section 3.1.2, sustainability paragraph. No table. | Copy reopened, 43 pages. Ministry/Gazette comparison remains open. |
| **S13a** | [Order 53/2024](https://licitatii.transelectrica.ro/pages/legislatie/1780468203_Ordinul_ANRE_nr._53_din_2024.pdf), Annex 1, PDF p. 6 / Gazette p. 7: Art. 1(a)–(c), Art. 2(2), Art. 3(2)(e). | Yes. Threshold, storage scope and allocation lag read. |
| **S13b** | [Order 79/2025](https://licitatii.transelectrica.ro/pages/legislatie/1780468203_Ordinul_ANRE_nr._79_din_2025.pdf), PDF p. 2 / Gazette p. 14, Art. II(f). | Yes. Published 2026 session timetable; not evidence an auction actually occurred. |
| **S15 / SRC-RO-15** | [Bulgarian operator statistical yearbook 2025](https://www.eso.bg/fileObj.php?oid=5908), PDF p. 3, installed-capacity table, row `ОСЕЕ*`, column `MW`; battery definition in the footnote. | Yes; table and page image requested. |
| **S17 / SRC-RO-17** | Counterparty announcement already linked in the canonical register and `src/markets/ro/sources.js`, dated 4 February 2026; opening three paragraphs describing an optimisation agreement and minimum revenue guarantee. | Yes. Only an announcement's existence is used; no parties or project are reproduced in this file. |

The complete proposed numeric/date content manifest is:

| Proposed field | Unit / definition | Locator and source-to-value arithmetic | Candidate / eligible public value now |
| --- | --- | --- | --- |
| `R.fleet.observations[period="start-2025"].mw` | MW; reported start-of-year point, exact date null | S02; primary document/page/row missing. No accepted extraction or arithmetic. Do not invent a 1 January observation date. | Reported 137; **null** |
| `R.fleet.observations[period="start-2025"].mwh` | MWh | No source value. Do not multiply MW by the play's hours. | **null** |
| `R.fleet.observations[date="2026-04-01"].mw` / `.mwh` | MW / MWh | S02; primary document/page/row missing. | Reported 599 / 1,130; **null / null** |
| `R.fleet.observations[date="2026-06-20"].mw` / `.mwh` | MW / MWh | S02; primary document/page/row missing. | Reported 878 / 1,630; **null / null** |
| `R.fleet.observations[date="2026-08-01"].mw` | MW; national stand-alone plus hybrid-plant storage, using the release's connection/testing boundary | S01 p. 1, final paragraph: direct numeric transcription, no scale conversion. | 989; **null pending reuse** |
| `R.fleet.observations[date="2026-08-01"].mwh` | MWh | S01 gives no aggregate energy value. The reported value in S02 is not a primary extraction. | Reported approximately 1,975; **null** |
| `R.fleet.observations[date="2026-09-01"].mw` / `.mwh` | MW / MWh | S02; primary document/page/row missing. Secondary reports also disagree on the power figure. | Register reports 1,094 / 2,310; **null / null** |
| `R.fleet.observations[date="2026-10-01"].mw` / `.mwh` | MW / MWh | S02; primary document/page/row missing. The nearly flat energy total despite increased MW requires source reconciliation. | Reported 1,162 / 2,312; **null / null** |
| `R.fleet.yearEnd.additionsMW` | MW; approximate future additions | S01 p. 2, forecast paragraph: Romanian `1.000` means 1,000, not 1.0. | Approximately 1,000; **null pending reuse** |
| `R.fleet.yearEnd.forecastPublishedOn` / `.forDate` / `.baselineDate` | ISO date; publication / forecast horizon / aggregation base | S01 dateline → `2026-08-20`; end-2026 → `2026-12-31` with end-year precision; no explicit aligned baseline. | First two dates identified; **baselineDate null** |
| `R.fleet.yearEnd.totalMW` | MW; derived estimate, never a counted total | Conditional method: matched baseline MW + forecast additions. `989 + 1,000 = 1,989` only if the baseline is accepted. No direct official total located. | **null**; estimate-baseline gate |
| `R.plan2030.mw` / `.mwh` / `.year` | MW / MWh / plan year; not connected capacity | S03 p. 4 opening paragraph: parse `1.200` → 1,200 and `2.400` → 2,400; retain both published units, do not infer an operating duration. | 1,200 / 2,400 / 2030; **numeric levels null pending official comparison and reuse** |
| `R.bgEnd2025.mw` / `.year` / `.mwh` | MW / observation year / MWh; installed batteries, a different definition from the Romanian series | S15 p. 3, `ОСЕЕ*` × `MW`: remove the thousands separator from `1 382` → 1,382; year from table heading. Energy not supplied. | 1,382 / 2025 / null; **MW null pending reuse** |
| `R.connection.auctionThresholdMW` | MW of site installed power; inclusive threshold | S13a Annex 1 Art. 1(a)–(c), Art. 2(2): `>= 5 MW` → scalar 5 plus comparator `gte`. | 5; rule verified; source-use record required before registration |
| `R.connection.allocationLagYears` | Calendar years, not construction time | S13a Annex 1 Art. 3(2)(e): allocation begins in the second year after auction year → 2; 2026 + 2 = 2028. | 2; rule verified; source-use record required |
| `R.connection.auctionSessionsFrom` | ISO date; scheduled rule date | S13b Art. II(f): 30 October 2026 → `2026-10-30`. This does not establish an actual completed auction. | Scheduled date verified; no actual-auction field |
| `R.grantRules.commissionWithinMonths` | Months after grant award; maximum | S03 p. 10, final paragraph before 1.2: 48 months → 48. No conversion to a promised COD date. | 48; **null pending official comparison and reuse** |
| `R.grantRules.operateAtLeastYears` | Years after commissioning; minimum | S03 p. 33, section 3.1.2: at least 5 years → 5. This is an operating obligation, not revenue tenor. | 5; **null pending official comparison and reuse** |
| `R.floorAnnouncement.verifiedCount` | Count of announcements verified in this research record, not all floors in the country | S17 opening paragraphs → one examined announcement. It cannot establish exclusivity, an operating fleet count or the target asset's contract. | 1; source opened; source-use record required for a numerical label |

No unsupported unit count, Bulgarian 2026 fleet, generation share, solar MW statistic, scheme budget, aid cap, grant-cohort size or reserve price is added to this data manifest. They are not new chart figures in the signed script. The existing grant note remains a **model** binding, described below, rather than a new observation.

Every proposed record also requires these metadata fields; these are the full common wrapper, not optional footnotes:

| Fields | Unit / source and treatment |
| --- | --- |
| `R.id`, `R.marketId`, `R.schemaVersion`, `R.vintage`, `R.checkedOn` | Authoring identity: `ro-story-evidence`, `ro`, schema 1, fixed review vintage `2026-11-02`, check date `2026-11-02`. A schema number is not a chart figure. |
| Each record's `id`, `sourceIds`, `date` or `year`, `datePrecision`, `measure`, `scope`, `unit`, `status`, `approximate` | Dated identity and definition. Copy source dates; explicitly distinguish day, month, end-year and calendar-year precision. Status separates observed, estimate, plan, reported, missing and authored. Missing precision is not silently upgraded to a day. |
| Each source's `publisher`, `title`, `url`, `locator.document`, `.pdfPage`, `.printedPage`, `.table`, `.row`, `.column`, `.clause` | Canonical source and exact location. Use `null` for not applicable, and an explicit unresolved flag for missing locators. A source home page cannot substitute for an unlocated numeric row. |
| Each source's `publishedOn`, `effectiveOn`, `coverage`, `checkedOn`, `lastAttemptOn`, `access`, `language` | Publication, rule effect, measurement period and retrieval are separate. Unknown publication dates stay null; a PDF creation date is not substituted. A failed attempt on 2 November does not overwrite an earlier successful check as if reverified. |
| Each source's `reuse.status`, `.basisUrl`, `.basisLocator`, `.attribution`, `.constraints` | No blanket “public means reusable”. Pending permission/basis URL is null and blocks the numerical layer. Attribute owner, source date, definition and calculation. Do not commit source PDFs, screenshots or full tables. |
| Each derived record's `calculation.inputs`, `.formula`, `.rounding`, `.reviewStatus` | Exact input references and arithmetic from the tables above. Preserve full precision; round display only. No smoothing or inferred missing energy. |
| `R.history[H-RO-01..06].dates`, `.sourceIds`, `.locators`, `.kind` | Event metadata from the six canonical history records. H-RO-01: 30 June 2005, SRC-RO-08 pp. 4/19; H-RO-02: November 2014, SRC-RO-09 (retain month precision unless the launch notice opens); H-RO-03: 17 June and 27 October 2021, SRC-RO-10/-11; H-RO-04: 8 July 2025, SRC-RO-12; H-RO-05: 2026, S13a/b; H-RO-06: approval 6 March 2026, SRC-RO-07. Retain event versus first-delivery dates separately. |

Other values belong to existing results or to teaching configuration, **not** the data PR:

| Owner / exact fields | Unit and arithmetic / reviewed value |
| --- | --- |
| `C.merchantEvidence.year`, `.restateFactor`; `C.economics.merchantCurve`; `.merchantCurveBasis.yearOne` | Basis year 2025; scalar 0.827; relative factors `[1, 0.955, 0.934]`; first model operating year 2027. Read these public assumption fields at build. Do not export `observedPerMW`, `range`, the private-mirror basis level or an absolute euro series as story evidence. |
| Derived binding `valueIndexPath` | Dimensionless, basis 100: 2025 = 100; 2026 = null; 2027 = `100 × .827 × 1 = 82.7`; 2028 = `100 × .827 × .955 = 78.9785`; 2029 = `100 × .827 × .934 = 77.2418`; 2030 holds 77.2418. Display 82.7 / 79.0 / 77.2. No 2026 point from a private module constant. |
| `B.grids.ro.byRoute.mer.best`; merchant cells selected by route and hours, `.hours`, `.value` | Best = 2 hours; longer = the existing 4-hour merchant cell; USD/MW values 67,988 and 47,782. Difference `67,988 − 47,782 = 20,206` is a model-value difference, not observed spread compression; it is not an additional required label. |
| `C.economics.feePct` | Percentage points: 10 → 10%, **not** 1,000%. No observed realised capture field is created. Full realisation is the settled MR-1 assumption described in the merchant-lines plan. |
| `C.economics.grantNote` | Existing bilingual model note, including assumed 20% and caps. Bind the returned string only, label it as the new-build assumption; do not treat its figures as verified award or receipt data. |
| `I.holdIRR`, `I.bearHoldIRR`, `I.peakEquityPerMW`, `I.powerMW`, `I.maxPricePerMW`, `I.operatingPurchase` | Existing investment-summary fields; exact card bindings in section 4. Preserve null ceilings. These are after-tax nominal investment results, distinct from design-grid economics. |
| Proposed `RO_TEACHING.powerMW` | Authored Example = 100 MW, from the shared evidence specification's teaching-unit rule. Optional energy label = `100 × selected play/grid hours` MWh; never a measured asset. The selected duration reads existing fields. No source observation or model input is registered. |
| Proposed `RO_TOPOLOGY.priceZoneCount`, `RO_HISTORY.neighbours2014` | Authored configuration of the signed topology: count 1 price zone; three named coupled neighbours from H-RO-02. Use the canonical source records, not icon counts as measured system data. The latter count is `neighbours2014.length`. No numeric generation or border-capacity claim is added. |

## 4. Bound-field map

This is the complete shot map, including figures embedded in controls, labels, accessible text and the shared source drawer. Proposed fields have the section 3 definitions and gates; naming them does not make them available today. All financial labels must resolve against the actual selected row, in both languages.

| Shot | Every figure / numerical statement in scope | Exact binding and missing-state rule |
| --- | --- | --- |
| **ro-00** | Call; play and its two-hour duration; entry stage; base IRR and target margin; downside IRR; peak pre-COD equity/project; project-rights ceiling; operating purchase ceiling and target; modelled fixed share; next action; evidence. | `CALLS[row.call]`; `playTitle(row.play,row.stage)`; `row.play.hours`; `I.holdIRR`; `(row.econ.hold − row.econ.test.target) × 100` pp via `marginText(row)`; `I.bearHoldIRR`; `I.peakEquityPerMW × I.powerMW`; `I.maxPricePerMW`; `I.operatingPurchase.maxPricePerMW` and `.targetReturn` via `operatingPrice(I)`; `share(row.econ.secured)` / `I.secured`; `row.play.action.text`; `row.evidence`. Reuse the existing card/decision components. No substitutes from `play.why`, thesis or acquisition reference cases. |
| **ro-01** | One price zone; no capacity-payment mechanism; qualitative generation types. | Proposed `RO_TOPOLOGY.priceZoneCount` = 1 from the signed topology; `C.capabilities.capacityMarket === false` supplies the model's no-capacity route boundary. No generation-share, MW, plant-count or flow field is rendered. Schematic icons are not proportional. |
| **ro-02** | 2005, 2014, 2021 events and any more precise event/delivery dates; three coupled neighbours; a single shared calculation. | `R.history[H-RO-01..03].dates` and source locators; `RO_HISTORY.neighbours2014.length` with its named members. Dates are the allowed sourced-event exception to bound numeric prose, still owned by these records. No observed coupling rate or price equality percentage. |
| **ro-03** | July 2025 tariff event; inclusive auction threshold; 2026 applicability and scheduled 30 October sessions; two-year allocation lag; 6 March scheme approval; Checked date. | `R.history[H-RO-04..06].dates`; `R.connection.auctionThresholdMW` with comparator `gte`; `.auctionSessionsFrom`; `.allocationLagYears`; `R.checkedOn`. Do not imply scheduled auctions actually ran. Scheme dates remain facts; award date and replacement grant closing date stay null. |
| **ro-04** | Unscaled daily price shape and qualitative spread; no observed price numbers. | Proposed scene configuration `RO_TEACHING.dayShape` supplies authored geometry, tagged **Example / 示例**; no currency axis, ticks, tooltip prices or hidden observed array. `observedDailyShape`, `tb2`, `dayAheadValue` and annual evening-over-midday gap bindings remain null under MR-4. Solar build stays qualitative. |
| **ro-05** | Bulgaria's end-2025 fleet MW and date; relative cross-border schematic. | `R.bgEnd2025.mw` and `.year` in both the label and text equivalent. With unresolved reuse, suppress the numeric label. No 2026 reported-count label is added. `samePriceShare`, evening price difference, border MW and measured-flow bindings stay null. |
| **ro-06** | Each fleet MW/date and optional MWh; fleet count/date in copy; approximate additions; conditional year-end total; 2030 plan MW/MWh; basis 100; first operating year and each index value/year; check/forecast dates. | `R.fleet.observations[].mw/.mwh/.date`; latest **eligible fixed-vintage** observation for `fleet count` / `fleet count date`; `R.fleet.yearEnd.additionsMW/.totalMW/.forDate/.forecastPublishedOn`; `R.plan2030.mw/.mwh/.year`; `valueIndexPath` from section 3 and `C.economics.merchantCurveBasis.yearOne`. Nulls remain gaps, not zeros. Follow section 5's Example fallback until the required records and calculation are signed. |
| **ro-07** | Qualitative seconds/minutes/hours response ladder and shrinking reserve-income illustration. | Shot labels and local teaching state only; `C.economics.servicesCurve` is the cited assumption behind the qualitative direction, not an observed Romanian series. No numeric response thresholds, procurement MW, reserve prices, cash amounts or fitted local saturation date are rendered. Capacity-price and energy-spread axes are never combined. |
| **ro-08** | Play duration; best and longer merchant durations, including presets; both optional USD/MW value labels; Example 100 MW; optional teaching energy. | `row.play.hours`; `B.grids.ro.byRoute.mer.best`; `.cells.find(route="mer",hours=4).hours`; the corresponding cells' `.value`, existing per-MW formatter; `RO_TEACHING.powerMW`; `RO_TEACHING.powerMW × selected hours`. Every occurrence of “two hours” or “four hours” must use the same duration owner. Presets do not reprice or select a different live play. |
| **ro-09** | Optimiser fee; shared MW/MWh capacity; full hindsight capture described as an assumption. | `C.economics.feePct` formatted as percentage points. Shared-capacity drawings are qualitative local state. No numerical lane capacities or realised-capture percentage is introduced; “all” describes the settled MR-1 assumption, not a measured result. If a future numeric realisation label is wanted, it first needs an exposed assumption field; no typed 100% fallback. |
| **ro-10** | Modelled fixed share; optional grant note with its percentage/caps; commissioning-month maximum and minimum operating years; settlement units. | `share(row.econ.secured)` / `I.secured`; `C.economics.grantNote` under **New-build case: assumes a grant**; `R.grantRules.commissionWithinMonths` and `.operateAtLeastYears`. EUR/MWh trading, capacity payment per MW held and activation payment per MWh are unit labels, not prices. Grant award/receipt/recipient amount fields remain null. |
| **ro-11** | One verified floor announcement; priced case versus entry-condition bracket. No floor amount, tenor bar or secured shading. | `R.floorAnnouncement.verifiedCount` only if the numerical “one” label is retained and its source-use gate clears; otherwise the qualitative announced-route sentence. Target-asset `floorAmount`, `floorTenorYears`, `floorSecuredShare`, `floorPriceUplift` all remain null. The only case secured share, if repeated, is `I.secured`. The announcement does not supply target-asset terms. |
| **ro-12** | Next trigger label/date; next action; any sourced future rule or grant date; Checked boundary. | `row.next` → `B.triggers[row.next].label/.expected`; `row.play.action.text`; `R.checkedOn`; source-owned verified event dates only. Historical `ro-grant-call-close.expected` remains 30 October and unresolved; it is not the current verified deadline. No invented outcome or dated Order-16 resolution. |

The current card review reproduces base hold IRR **11.202699%**, downside **2.481589%**, target **13.75%**, hence **−2.547301 pp**; peak equity `4,304,494.985557733 × 50 = RON 215,224,749.27788666`; project-rights ceiling **null**; operating ceiling **RON 2,692,025.845927098/MW** at target **13.25%**; fixed share **0%**. These are audit readings, not copy constants. Existing formatters produce 11.2%, 2.5%, −2.55 pp, RON 215.22m, “No supported price” and RON 2.69m/MW at 13.3%. The script's older `0.0%` example must not override the current `share()` formatter.

The design grid's 13.70%/12.20% hold returns and its two value cells are on another calculation basis. They cannot replace the opening's investment-summary return. No extra design-grid IRR label is required by the shot.

Shared bindings: **research check date** → `R.checkedOn`; **source checked date** → the selected source record's `.checkedOn`; **play evidence** → `row.evidence`; **source dates and units** → that record, including tooltips and accessible tables. “Checked” never means “published”, “commissioned” or “delivered”. A future non-zero fixed share returns to G-1 for tenor and post-expiry wording.

Exact script-token aliases, to prevent a later implementation from treating a prose description as an unnamed binding:

| Script token | Exact owner / selection |
| --- | --- |
| ‹bound: call› | `CALLS[row.call]` |
| ‹bound: play title› | `playTitle(row.play, row.stage)` |
| ‹bound: card figures› | The individually enumerated ro-00 `I` fields and existing components above; never one pasted summary string |
| ‹bound: next action› | `row.play.action.text` |
| ‹bound: play evidence› | `row.evidence` |
| ‹bound: secured share› | `share(row.econ.secured)`, equal to projected `I.secured` |
| ‹bound: play duration› | `row.play.hours` |
| ‹bound: best merchant duration› | `B.grids.ro.byRoute.mer.best` |
| ‹bound: longer merchant duration› | `B.grids.ro.cells` selected by `route === "mer" && hours === 4`, then `.hours` |
| ‹bound: merchant value at best› / ‹bound: merchant value longer› | The same best and longer cells' `.value` |
| ‹bound: value index path› | `valueIndexPath` derived only from the four public model field owners in section 3 |
| ‹bound: curve first year› | `C.economics.merchantCurveBasis.yearOne` |
| ‹bound: optimiser fee› | `C.economics.feePct` |
| ‹bound: grant note› | `C.economics.grantNote` |
| ‹bound: next trigger› | `B.triggers[row.next].label` and `.expected` |
| ‹bound: fleet count› / ‹bound: fleet count date› | Latest eligible `R.fleet.observations` record's `.mw` / `.date`, with precision retained |
| ‹bound: fleet observations› | Eligible `R.fleet.observations` records, with their dates, `.mw` and nullable `.mwh` |
| ‹bound: fleet year-end additions› | `R.fleet.yearEnd.additionsMW` |
| ‹bound: plan 2030 level› | `R.plan2030.mw`, `.mwh` and `.year` |
| ‹bound: Bulgaria fleet end-2025› | `R.bgEnd2025.mw` and `.year` |
| ‹bound: auction threshold› | `R.connection.auctionThresholdMW`, inclusive comparator |
| ‹bound: grant build deadline› | `R.grantRules.commissionWithinMonths` |
| ‹bound: grant operation years› | `R.grantRules.operateAtLeastYears` |
| ‹bound: research check date› / ‹bound: source checked date› | `R.checkedOn` / selected source's `.checkedOn` |

## 5. Chart contract for Chart-RO-FLEET

**One signature chart, two panels, independent labelled units and a shared calendar axis.** Its upper panel is fleet MW; its lower panel is a model-value index. Neither panel measures realised battery revenue.

| Layer | Required treatment |
| --- | --- |
| Verified dated counts | Solid points at the source dates; each retains its own population definition. No line interpolates connected MW, and no missing date is a zero. MWh is supplementary table/tooltip information only where explicitly published. |
| Operator estimate | Dashed, approximate and attributed, with forecast publication date and horizon. A total point requires an accepted baseline calculation. Further additions cannot masquerade as the total stock. |
| National-plan reference | Dashed, labelled as the specified guide/plan vintage and 2030 horizon. It is neither a need requirement nor an observed fleet or latest national forecast. |
| Model index | Entirely dashed, including the normalization anchor. Basis 100 is a definition, not an observed value. 2026 stays null; no inferred intermediate point or tooltip. The basis-to-2027 segment may show the signed model transition, with no asserted annual interpolation. The model's 2027–2029 points follow the public factors; the tail is flat at the last factor through 2030. |
| Comparison | No shared ordinate, crossover, break-even date, fitted MW-to-price coefficient or implied measured causal response. No four-hour line, floor line or euro level. |
| Example fallback | If required fleet/plan records, reuse or CALC-RO-FLEET are unavailable, use the approved **qualitative chart tagged Example / 示例**, without numeric axes, numeric points or numerical tooltips. The accessible version must say the same. The ro-04 daily shape independently retains its own Example tag. |

Always-null while the relevant gate is open: reported-only fleet MW/MWh; missing energy; unaligned year-end total; observed daily prices and spreads; shared-price percentages; absolute basis-year euro value; euro model path; observed reserve series; target-asset floor amount/tenor/secured revenue. Do not fetch an unlicensed series into the browser and merely hide it.

**Retiring the fleet Example:** the analyst accepts CALC-RO-FLEET's displayed record set, primary locators, definitions, arithmetic and reuse; the plan's official text is compared; the estimate baseline is resolved or the unsupported total is explicitly omitted under an approved revision; every displayed binding resolves in both languages; and the dated table/labels match. Optional unverified points may remain omitted and null. Retiring this Example does **not** require MR-4, because the approved chart uses official capacity facts and public model multipliers, not exchange prices.

**Retiring the daily-shape Example is a separate decision:** clear MR-4 and price rights, recompute a specified primary series and review the observed replacement in both languages. A working fleet chart does not retire the daily Example. No Example is retired by this documentation session.

## 6. Reuse extract

Evidence read: [#107](https://github.com/jerryyuan1996/BESS-research-platform/pull/107); Germany [#90](https://github.com/jerryyuan1996/BESS-research-platform/pull/90), [#99](https://github.com/jerryyuan1996/BESS-research-platform/pull/99), [#100](https://github.com/jerryyuan1996/BESS-research-platform/pull/100), [#102](https://github.com/jerryyuan1996/BESS-research-platform/pull/102); Finland [#89](https://github.com/jerryyuan1996/BESS-research-platform/pull/89), [#103](https://github.com/jerryyuan1996/BESS-research-platform/pull/103), [#104](https://github.com/jerryyuan1996/BESS-research-platform/pull/104), [#105](https://github.com/jerryyuan1996/BESS-research-platform/pull/105). The Germany/Finland reuse reports were checked against their live market bindings, packs and chart/data modules. Research/script PRs #86/#85 precede those build stacks.

| Layer | Configured / reused | Written new for Romania later |
| --- | --- | --- |
| Data | Finland's dated publication-record pattern and source envelope; Germany's explicit rights withholding. The Finnish quantity feed is not needed for static publications. | The fixed-vintage source/definition/rights records in section 3 and narrowly scoped extraction/arithmetic verification; no price connector or six-hour job. |
| Content and bindings | Shared WP-02 contract, thirteen approved bilingual shots, marker vocabulary, existing live result fields and formatters. | Romania content configuration and read-only bindings, index derivation, missing-value handling and script-parity checks; no financial engine inside the story. |
| Topology, history and scenes | Shared fixed-view SVG/isometric symbols, cutaway, colours, controls and accessible shell; Germany's local scene composition pattern. | Local Romania/Bulgaria schematic, six history nodes, local teaching state and grant/floor payment compositions. Maps carry no measured flows or engineering location claims. |
| Signature chart | Shared SVG/axes/table primitives; Finland's calendar-time approach and separation of definitions. The shared intraday day chart is unsuitable for this multi-year chart. | Two-panel fleet/index renderer and accessible table, estimate/plan/model styles, source-vintage labels and qualitative Example state. |
| Opening and opportunity ownership | #107 lets the shared shell receive `ctx.rows`; each play row owns its own call/action, while the selected row alone owns the financial summary. | Configure Romania with its **single** reviewed `ro-mer-2h` row; retain the separate operating-price line and entry-floor copy. No Polish cohort, grant economics or second opportunity card is imported. |
| Wiring and acceptance | Existing research button, lazy pack entry, shell, navigator, focus/history, language handling, marker component and four investment-section exits; WP-04/10 checks. | A market-local pack and actual lens/call/play/duration guard, later lazy registry configuration and Romania browser/width/budget checks. No shared-shell fork or new global design system. |

The old PR timings are evidence of their work, not a Romania estimate or a fresh approval. WP-05 remains retired; WP-08 remains folded into WP-06. Reuse does not waive source gates, exact-candidate validation or G-2.

## 7. Grant-status check — 2 November 2026

**Result: call unchanged; the timetable, reported extension and beneficiary outcome remain unverified in primary evidence.** This section is today's execution of the research check named `ro-grant-status-review`; it is not a claim that a separate completed 2 November review already existed in the repository.

Read the live trigger and its note now: expected **2026-11-02**, direction `either`, `effect: null`, no recorded outcome. Its note records failed access on 31 October and the unverified extension. The original `ro-grant-call-close` remains expected **2026-10-30** without an outcome. The checked view/changelog contains no later resolution of these events. The review date is analyst-owned, not a ministry deadline.

| Check performed now | Result / inference permitted |
| --- | --- |
| [Ministry's stand-alone call page](https://energie.gov.ro/lansare-apel-sprijinirea-investitiilor-in-dezvoltarea-instalatiilor-autonome-stand-alone-de-stocare-in-baterii-a-energiei-electrice-cu-finantare-din-fondul-pentru-modernizare-p/) and ministry home | Call page inaccessible through the reader; home fetch timed out. No amendment, ranking or final beneficiary list was opened. **Access failure is not evidence of non-publication.** |
| [EU-funds portal](https://oportunitati-ue.gov.ro/) and targeted amendment/extension searches | Portal fetch timed out. No authoritative amendment was opened. |
| Secondary discovery lead dated 30 October | A report says the period was extended to 15 November, 23:59. It is a lead to the ministry amendment, not a verified replacement closing trigger; it also conflicts with a stale original-date listing on the same site. No new deadline is adopted. |
| SRC-RO-05 [EIB confirmation](https://www.modernisationfund.eu/wp-content/uploads/2026/07/MF-2026-1-RO-0-006-%E2%80%93-Supporting-investments-in-the-development-of-stand-alone-battery-storage-installations-of-electricity.pdf), pp. 1–3 | Reopened: programme priority confirmation. It does not name selected batteries or verify this call's current timetable. |
| SRC-RO-06 [2 July joint release](https://www.modernisationfund.eu/joint-press-release-e2-5-billion-of-eu-ets-revenues-invested-in-cleaner-energy-systems-in-11-eu-countries/), investment list | Reopened: programme/state funding, not project awards or receipt by a battery owner. |
| SRC-RO-07 Commission press-corner page | The public URL opened without readable text. G-1's scheme-approval record is retained; no new outcome verification is claimed. |

The secondary extension lead is [the 30 October report](https://fonduri-structurale.ro/stiri/41650/fm-s-a-prelungit-apelul-pentru-sprijinirea-investitiilor-in-dezvoltarea-instalatiilor-autonome-de-stocare-in-baterii-a-energiei-electrice), used for discovery only.

Authoring wording supported today: **“The grant call's timetable and outcome remain unverified at the latest check.” / “截至最近一次核查，补贴申报的时间表与结果仍未核实。”** This preserves the approved unresolved-call meaning without claiming an inaccessible source contains no result. It is a decision recorded here, not a silent edit of the signed storyboard. The ro-03/10/12 production strings must undergo that evidence-wording reconciliation before release if primary access still fails.

The live fund call before and after this read-only review is **`opportunistic`**, play **`ro-mer-2h`**, two hours, `infraFund`. No trigger was fired or replaced, and no view or model was written. If a later primary review leads the analyst to change the call/play, stop for **Rule 11 editorial review**, not a build. A confirmed extension alone requires the separate trigger/history treatment in open-calls plan section 3G; it does not mechanically change an investment call.

## 8. Market judgement calls

**Optimiser floor / OC-RO-FLOOR.** Use this entry-test wording with bound values:

> **EN:** The case is merchant. Modelled fixed revenue is ‹bound: secured share›, and the displayed price includes no optimiser floor. The fund can enter only after the seller provides agreed floor terms that pass the floor check: payment, term, indexation, upside share, fees, availability, transferability and credit support. Without acceptable terms, the entry test fails. The announced route is not income for this case.
>
> **简体中文：** 本情景按市场化收入测算。模型固定收入占比为‹bound: secured share›，所示价格未计入优化商保底。只有卖方提供已谈定且通过保底核查的条款，基金才可进入：付费金额、期限、指数化、超额收益分成、费用、可用率、可转让性及信用支持。条款不合格，便不满足进入条件。已公布的保底路径不构成本情景的收入。

The quoted wording is an explicit decision draft for the later copy, not a newly priced contract. Retain the approved Fair evidence marker and what-would-change-it line. No horizontal floor level, tenor bar, shaded secured area, Finland term/price or uplift is drawn. Before terms pass, the merchant price is only a screening reference; it is not an invitation to buy without the entry condition. Even once terms arrive, this story cannot count or price them without the separate reviewed proposal.

**Fleet records and index-only scope.** Commit a reviewed vintage of isolated official records with the story, each carrying its URL, locator, units, date and arithmetic. The permitted model display is the **relative two-hour day-ahead-value assumption path** normalized to its basis year. It may show the published multipliers, model years and their relative declines, including the flat tail. It may not show an absolute euro level, observed price/spread, realised capture, cash revenue, secured payment, causal elasticity against fleet MW, estimated domestic build in MW, four-hour compression curve or floor. No price observation is laundered into publication through normalization. The daily shape remains an unscaled Example. Existing financial result bindings stay labelled as model results.

**Source opening and reuse before quantitative construction.** The practical decisions from opening the actual sources are:

| Source / scope | What was established now | Reuse / construction decision |
| --- | --- | --- |
| S01 operator fleet release | Count and additions text opened; aggregate energy absent; forecast/count dates differ. | Explicit reusable-data permission was not found in the release or checked site material. **Numerical registration/publication remains blocked** until the use basis is recorded. Source link and qualitative Example may proceed. This is a project publication gate, not an assertion that every isolated fact is copyright-protected. |
| S02 remaining operator counts | Targeted primary-host searches did not establish the release locators. | Keep every unlocated numeric value null. Do not obtain “observed” records by transcribing a news report. |
| S03 guide | Copy and exact numeric paragraphs reopened. | **Block numeric plan/grant fields** until official-version comparison and source-use decision. Link to the source record; do not ship the copy PDF. |
| S15 Bulgarian yearbook | Battery-capacity row opened. | No affirmative reuse basis located in the yearbook or checked site material. **Block its new numerical label** pending a recorded basis; do not borrow a licence from Romanian sources. |
| S13a/b, Order 15/2026 and operator allocation procedure | Formal orders opened. The procedure's **cover, p. 1**, expressly requires management's written agreement for partial or full multiplication/use. | **Do not reproduce the procedure, its diagrams or tables.** Source the threshold, allocation lag and scheduled session date to the formal order clauses in section 3; record the limited factual-summary basis before data registration. Reading permission does not equal a blanket reuse grant. |
| Historical releases and tariff notice | The 8 July 2025 ANRE notice reopened and confirms the exemption's boundary. Attempts to reopen SRC-RO-08/-09/-10/-11 failed (inaccessible/cache miss); G-1's dated records remain the earlier evidence. | No copied report graphics or tables. Preserve earlier successful-check dates and today's failed attempts separately. Reopen any primary needed for a new quantitative historical label and complete its source-use record before construction. The approved qualitative history is not re-graded because a retry failed. |
| S17 floor announcement | Existence of a minimum-revenue guarantee announcement reopened; no target-asset price evidence supplied. | Qualitative route precedent only. A numerical “one” label needs its source-use record; no project/party names, target floor level or imported tenor. |

Thus **MR-4 blocks** observed Romanian/Bulgarian hourly price layers and derivatives: daily shapes, annual spreads/TB2, absolute day-ahead value, observed duration-capture curves, same-price-hour share and measured border price effects. Existing generic ENTSO-E attribution is not price-owner permission. It also blocks presenting mirror-derived inputs as observed evidence anywhere, including tooltips and downloads.

**Without MR-4**, the approved qualitative grid/history/payment story, unscaled daily Example, merchant-only card/result bindings, model-labelled duration comparison, floor entry checklist and index-only path can be prepared. The numeric fleet/plan chart can proceed only after its **independent** primary, reuse and calculation gates close. Local reserve procurement, an executed floor and grant beneficiaries have their own gates; MR-4 supplies none of them. No quantitative build takes place in this session.

**Competing explanations and language meaning.** Preserve the approved causal route as an interpretation: more solar can lower midday prices and batteries can narrow the evening gap. Water availability and hydro conditions, gas prices and demand also move that gap; interconnection, demand response, pumped storage and other flexibility compete to narrow it. Do not turn the border drawing into proof that most neighbouring output stays home, nor a Britain-calibrated reserve curve into a Romanian observation. Keep ro-05 and ro-07 Thin, ro-02 Strong under its reviewed historical record, Fair elsewhere and the opening's inherited marker. The two languages must convey the same distinction between mechanism, interpretation, assumption, award, receipt and cash. The existing investment calls remain unchanged.

**Least-confident decision:** treating the year-end additions forecast as comparable with the 1 August stock. The common release makes that a plausible reading, but its publication date and reference dates do not prove an aligned stock baseline. The defensible decision is to retain the additions as an attributed estimate candidate and keep the total null. An operator clarification or an explicitly accepted derived-estimate method would settle it; neither is manufactured here.

**Stopping point:** only this evidence file is written. No branch, source/module edit, data registration, snapshot, view change, application build, PR, commit, push or deployment is part of this session. Before a later PR, the repository's required checks and the exact-candidate G-2 review still apply; this document does not claim they ran.

At final document verification, a separate untracked `ie-build-evidence.md` appeared after the initially clean precondition check. It was neither created nor edited by this session and is preserved. The initial clean-check result is not a claim that the working tree remains clean after writing this file or concurrent work.
