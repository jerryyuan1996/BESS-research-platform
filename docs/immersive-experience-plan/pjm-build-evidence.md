# PJM build evidence and decisions

Prepared: 2 November 2026, Australia/Perth. Decisions and research only.
Baseline: main at 474766e07ff78a20a57e0a999a3da05c0a62dbf3.
Script: [PJM storyboard](pjm-storyboard.md), merged [#96](https://github.com/jerryyuan1996/BESS-research-platform/pull/96).
Authority: the original request, with its clean-status condition amended by the analyst's request to support parallel market sessions. This file authorises no implementation.

**Result: Rule 11 passes. Four hours remains the preferred capacity design; the current investment-card hold return is 2.7%, against 12.1%. The price illustration remains an unscaled Example.** The missing manual evidence records, price rights and the scoped gates in section 2 remain open.

The [master plan](README.md), [WP-02 through WP-10](engineering-work-packages.md), script, canonical [source/history records](source-register.md#g1-pjm-evidence), [claim ledger](market-narratives.md#g1-pjm-claims), approved numerical plan and merged changes govern this memo. WP-05 is retired; WP-08 is folded into WP-06. Historical “pending” rows in the script do not reverse the analyst's later 1 November sign-off.

## 1. Rule 11 verdict

**PASS at this baseline for the infrastructure-fund lens.** This is permission to finish the evidence review, not permission to build. The live view means the committed view store and the page's existing model, evaluated read-only; no claim is made here about a production deployment.

| Anchor | Live view / existing page model | Reviewed script | Verdict |
| --- | --- | --- | --- |
| Call | view/markets/pjm.json → verdicts.infraFund.call = `wait`; CALLS.wait = “Watch / 保持观察” | §1 reviewedAgainst.call = `wait`; “Watch / 保持观察” | Match |
| Play | verdicts.infraFund.play = `pjm-cap-4h` | reviewedAgainst.playRef = `pjm-cap-4h` | Match |
| Duration | plays['pjm-cap-4h'].hours = `4` hours | reviewedAgainst.hours = `4` | Match |
| Lens | verdicts.`infraFund`; evaluation uses HOME_BRIEFING.lenses.`infraFund` | §1: “For the infrastructure fund”; reviewedAgainst itself has no lens member | Match by explicit script scope; do not infer a different lens |
| Stage | `ready-to-build` | §1: “entered at ready-to-build” | Match |

The script's exact record is `reviewedAgainst: { playRef: 'pjm-cap-4h', hours: 4, call: 'wait', on: '2026-10-31' }`. Its subsequent G-1 sign-off is 1 November. Keep the anchor date and approval date distinct. Bind the live play's current action; do not copy the older action in the script's review-value column.

Precondition (1) passes: Git ancestry checks against the pinned main confirmed every merge below.

| Required change | Merge on main |
| --- | --- |
| #108 — loading / change pages | ef47bb941d08e32e60f8fb343b8d2de3b2615afc |
| #109 — duration-specific PJM credit | e47adea68ba1399a839629d0ba11927f0f641498 |
| #110 — approved grant refresh | 4ec1cf2 (ancestor confirmed) |
| #111 — awarded-entry reconciliation | 6a5062c (ancestor confirmed) |
| #112 — public evidence / function changes | fba750c (ancestor confirmed) |
| #113 — codex/ie-six-hour-review-20261101 | bbe40703bb3214089525966f2a4a54465e74e999 |
| #96 — signed PJM script | 6288e860a6117e5e20f8b938fb23fc4f1ff5bce2 |

Precondition (3), revised for parallel work: **scoped input and output ownership passes; the whole checkout is not clean.** Existing unrelated untracked files were preserved. The PJM output did not exist. Reads of the required PJM inputs and shared financial inputs matched the pinned main; financial calculations ran from an archive of committed public files in temporary storage, without checking out a branch or consuming another session's untracked files. The existing working HEAD was 7e00c1a; it was not moved to main. The different main reference was handled by pinning its committed contents.

Each market session owns only docs/immersive-experience-plan/<market>-build-evidence.md. A second writer to that path, a relevant input change, or a changed anchor requires stopping that market. Unrelated edits are not a stop condition. No checkout, staging, commit, push, build or PR was performed for this memo.

## 2. Gaps and blockers

There is **one open GAP-PJM-* identifier** in the canonical PJM material. Do not invent an ETL dependency to close it.

| Open gap | Blocking? | Exact page wording / graphic it settles | Closure evidence |
| --- | --- | --- | --- |
| GAP-PJM-BRA | Yes for the observed price layer and unresolved quantitative source bindings. The approved Example permits a limited price illustration while rights remain open. | pjm-04: “For the next auction a ‹bound: play duration›-hour battery is credited ‹bound: class rating next auction› of its power”; pjm-05: “Reliability requirement · Cleared · Shortfall”; pjm-06: “Simulation without cap and floor”; pjm-07: “Auction pending · No cap approved · One delivery year”; pjm-09's credited-MW selector. | A manual, fixed-vintage evidence module with the complete field/locator/arithmetic contract in section 3; basis checks for the shortfall graphic; source validation. An independent, recorded analyst rights clearance is additionally required for numeric prices, simulations and derived price products. Registration alone does not clear rights. |

These are the distinct remaining gates within or alongside that gap. “Blocking” names the affected content, not a reason to abandon this memo.

| Gate | Blocking scope | Exact wording / figure affected | What closes it / permitted fallback |
| --- | --- | --- | --- |
| B-PJM-DATA | Quantitative evidence bindings in the content PR | “Class rating, next auction”, “Credited MW”, chart ratings, dates, queue and attribution figures | Implement and validate the proposed manual records in a separately authorised data PR. No such module exists on this baseline. Until a field exists, withhold its number; never insert a constant or zero. |
| B-PJM-RIGHTS | All new numeric price observations, price-derived values and the simulated-price comparison | “Clearing price, $/MW-day”, “Cap and floor”, “Simulation without cap and floor” | Analyst records the actual permission/basis and its scope, then the data and observed renderer pass review. Meanwhile the upper panel is the unscaled Example specified in section 5; affected public price fields remain null. Existing prices elsewhere in the model are not permission to publish a new series. |
| B-PJM-BASIS | Quantitative requirement-versus-cleared bars in pjm-05 | “Reliability requirement · Cleared · Shortfall” | Pair requirement and procurement on one documented UCAP basis, including FRR and PRD treatment. The published shortfall can be recorded separately; do not manufacture its companion bar from a differently based total. Retain a qualitative comparison until this pairing is verified. |
| B-PJM-TERMS | Claims that energy and Regulation settlement details have been verified | “Paid: per MWh at the nodal price”; “Paid: per MW of regulation, per hour” | Extract current governing energy and Regulation settlement/product clauses with revision, section and page. Approved mechanism schematics may retain “settlement clauses pending” / “product terms pending” and Fair; those labels do not verify the clauses. No penalty or earnings number is added. |
| B-PJM-MAP | The geographic asset in pjm-01 | “PJM region (approximate) · Zones modelled separately” | Build ASSET-PJM-FOOTPRINT from the public-domain admin-1 source, record the source/version and approximate whole-state treatment, identify DOM/COMED from the parameters, and check the lazy asset budget. Do not use the existing national outline as a precise service territory. |
| B-PJM-LOCATORS | The affected data fields' entry/revalidation | Historical auction dates, 2026-27 / 2027-28 ratings, 2028-29 report detail and workbook cell locators | Reopen the exact primary files when entering those rows. The 2 November attempts returned timeouts/403s for several files; the retained 31 October checks are not redated. **Schedule part closed 3 November 2026:** SRC-PJM-14 was reopened (sha256 `b769a1ea789da451b7fca1d502ce215e94d2f724bb53205717415aa8033e4e2e`, retrieved via `https://www.pjm.com/-/media/DotCom/markets-ops/rpm/rpm-auction-info/rpm-auction-schedule.xlsx`, `access: opened`, `checkedOn: 2026-11-03`) and its exact worksheet/cell addresses are recorded in section 3, with every value unchanged from the retained 31 October check. The 2028-29 procurement pair remains open under B-PJM-BASIS. This blocks claiming fresh verification, not the approved dated narrative or Example. |
| B-PJM-COPY | Importing superseded authoring instructions into the content PR | pjm-08's old fixed-ratio authoring note; pjm-12's “Two events could change the case” / “Price nothing before the December auction” | Apply the already approved #101 / #109 reconciliation in section 7: three watched trigger records, both price and January rating before repricing, duration-specific renewal credit, and current bound figures. This does not change the matching call or play. |

The governing [legal notice](https://www.pjm.com/about-pjm/legal) was reopened on 2 November; access is not a redistribution licence. Price-data rights remain an analyst decision. The earlier Data Miner agreement is not treated as a licence for these separate reports.

## 3. Field list for the future data PR

**Route: analyst-entered, fixed-vintage local evidence, following the WA requirement-table pattern.** The proposed owner is src/markets/pjm/data/storyEvidence.js, export **PJM_STORY_EVIDENCE**, abbreviated **E** below. These are proposed field names, not claims that the fields already exist. No catalogue dataset, connector, scheduled feed or ETL registration is proposed. Financial results stay in their existing model fields.

For tables below, **y** is a delivery-year key, formatted YYYY-YY, and **h** is exactly one of 4, 6, 8, 10. The matrices enumerate every supported y/h value. They are private authoring targets in this memo. A blocked numeric price target must not be copied into an imported module, an unlinked public file, an evidence drawer or a browser bundle.

### Record and provenance fields

| Field, for every applicable value | Unit / type | Locator and source-to-stored rule |
| --- | --- | --- |
| E.marketId | ID | `pjm`, from view.marketId; direct identity, no arithmetic |
| E.geography | text | PJM region; retain a named zone only for a zone-specific record. Do not average RTO and zone prices |
| E.pricePublication.status | enum | `rights-unresolved`, from the signed script §9 and 1 November disposition |
| E.pricePublication.clearanceRef | reference or null | null until the analyst's separate rights decision exists; no inferred clearance |
| E.pricePublication.mode | enum | `example`; observed mode requires the retirement conditions in section 5 |
| E.sources[id].url | primary URL | Exact SRC-PJM record; corrected working URLs below are used without changing source IDs |
| E.sources[id].publishedOn | date / bounded date / null | Document date or posting date, with their meanings distinguished; do not use a PDF creation date as an auction date |
| E.sources[id].checkedOn | date | Last successful primary reading: 2 November for files actually reopened, otherwise the retained original check date |
| E.sources[id].lastAttemptOn | date | 2026-11-02 for attempted retrievals; not a substitute for checkedOn |
| E.sources[id].access | enum | opened or unavailable for this attempt; an access failure does not mean no document was published |
| E.provenance[valuePath].sourceRef | SRC ID | One source identity per scalar/series segment; no unsourced parent-level catch-all |
| E.provenance[valuePath].locator | structured text | Document, printed/PDF page, table or heading, row/class and delivery-year column; workbook sheet, row label and cell when verified |
| E.provenance[valuePath].unit | unit string | Original denominator retained: UCAP MW versus nameplate MW, $/MW-day versus MWh |
| E.provenance[valuePath].arithmetic | text | Identity, percentage ÷ 100, GW × 1,000, or the stated calculation; retain rounding and all operands |
| E.provenance[valuePath].kind | enum | observed auction result, auction rating, non-binding indicative rating, rule parameter, attributed interpretation, teaching Example, or derived check |
| E.provenance[valuePath].rights | enum / decision ref | Price family remains rights-unresolved; a citation or “For Public Use” stamp does not clear it |

### Delivery-year fields

| Field | Unit | Primary locator and arithmetic / null rule |
| --- | --- | --- |
| E.years[y].deliveryYear | year pair | Report/ELCC table column; normalize slash to hyphen only |
| E.years[y].deliveryStart | ISO date | First year + June 1; SRC-PJM-17, printed/PDF p.2, Background, BRA delivery-year paragraph |
| E.years[y].deliveryEnd | ISO date | Second year + May 31; same locator; preserve the June–May year |
| E.years[y].auctionStatus | enum | cleared for 2025-26 through 2028-29; pending for 2029-30; not-held for later chart years. Re-evaluate against results, never the calendar alone |
| E.years[y].clearingPriceUSDPerUCAPMWDay | USD / UCAP MW / day | RTO Resource Clearing Price: SRC-PJM-04 printed pp.3–4; SRC-PJM-03 printed p.3/Table 1; SRC-PJM-02 printed p.4/Table 1; SRC-PJM-01 printed p.5/Table 2, row y. Identity, no FX. **Public stored value null for every year while rights remain unresolved** |
| E.years[y].collarCapUSDPerUCAPMWDay | USD / UCAP MW / day | SRC-PJM-03 printed p.4, VRR bullet; SRC-PJM-02 printed p.4, VRR bullet; SRC-PJM-13 printed p.4, VRR section, current and comparison years. Copy published UCAP parameter, not an approximate ICAP cap. Public price-layer value null under the retained gate |
| E.years[y].collarFloorUSDPerUCAPMWDay | USD / UCAP MW / day | Same locators, floor entry. Identity; no assumed common floor across auctions. Same publication gate |
| E.years[y].auctionRatingByHours[h] | fraction of nameplate power | SRC-PJM-10 slide/PDF p.6, table “2025/26 ELCC Class Ratings”, four storage rows; SRC-PJM-09/08/07/06 p.1, row h-hr Storage, BRA column. Printed percent ÷ 100 |
| E.years[y].indicativeRatingByHours[h] | fraction of nameplate power | SRC-PJM-11 p.1, four storage rows, delivery-year column. Printed percent ÷ 100; populated only from 2030-31, never substituted for an official BRA rating |
| E.years[y].indicativeRatingSourceVintageOn | ISO date or null | SRC-PJM-11's registered document vintage: both preliminary-ratings PDFs created 4 September 2026 (source-register entry for SRC-PJM-11, checked 2 November 2026). Populated only for indicative years (2030-31 onward); null otherwise. This is the source record's own creation date, shown only as the indicative segment's source-vintage label. It is not a market observation, not a rating posting date, and must never be conflated with `ratingPostedDate` or presented as an official result date |
| E.years[y].ratingKind | enum | auction for 2025-26 to 2029-30; indicative-non-binding from 2030-31; method boundary at 2025-26 |
| E.years[y].auctionWindowOpens | ISO date or null | SRC-PJM-14, worksheet “29-30 BRA Post” cell F59, row label D59 (2026-12-09); worksheet “30-31 BRA Post” cell F58, row label D58 (2027-05-12). Workbook reopened 3 November 2026. Earlier windows stay null unless separately located |
| E.years[y].auctionWindowCloses | ISO date or null | Same worksheets, “Auction window closes”: “29-30 BRA Post” F60 (2026-12-15), “30-31 BRA Post” F59 (2027-05-18); do not use results-posted date |
| E.years[y].resultsPostedDate | ISO date or null | Respective report date / workbook row “Auction results posted”: “29-30 BRA Post” F61 (2026-12-22), “30-31 BRA Post” F60 (2027-05-25); known targets below. A planned date remains a plan |
| E.years[y].resultsNotBefore | local time + zone or null | SRC-PJM-14 worksheet header, “29-30 BRA Post” A5: “All Results will be posted no earlier than 4:00 PM EPT” (= 16:00 EPT). Do not convert a date-only label into an invented timestamp |
| E.years[y].ratingPostedDate | ISO date or null | ELCC page's BRA posting row and SRC-PJM-14 “Preliminary ELCC Class Rating”: “29-30 BRA Post” F24 (planned 2026-08-06), “30-31 BRA Post” F24 (planned 2027-01-11). Keep the workbook's planned date distinct from the actual posting |
| E.years[y].shortfallUCAPMW | UCAP MW or null | SRC-PJM-02 printed p.3, Executive Summary, 6,516.6 below the RTO requirement; SRC-PJM-01 printed p.3, same proposition, 6,831.3. Copy the reported amount, not an ICAP reserve-margin conversion |
| E.years[y].shortfallBasis | text or null | Name the report's RTO requirement / FRR / PRD basis. SRC-PJM-02 p.4's 6,623.2 is a different RPM/IRM comparison and is not substituted |
| E.years[y].comparisonRequirementUCAPMW | UCAP MW or null | Exact matched report/planning-table row still to be verified under B-PJM-BASIS; null until then |
| E.years[y].comparisonClearedUCAPMW | UCAP MW or null | Matched procurement total on the same basis; null until then. Do not subtract a BRA-only total from a whole-region requirement |
| E.years[y].comparisonBasis | text or null | Explicit inclusion of RPM, FRR and PRD, with the two source locators and the subtraction. Must satisfy requirement − procurement = shortfall within declared rounding |
| E.years[y].uncappedSimulationRTOUSDPerUCAPMWDay | USD / UCAP MW / day or null | SRC-PJM-01 printed p.17, Appendix “BRA Clearing Simulation Without Cap and Floor”, RTO row: 554.72. A PJM counterfactual simulation, not an observation. Public value null while the price gate is unresolved |

The [2029-30 planning report](https://www.pjm.com/-/media/DotCom/markets-ops/rpm/rpm-auction-info/2029-2030/2029-2030-planning-period-parameters-for-base-residual-auction-report.pdf), printed pp.1 and 4, was reopened. It confirms the last collared year's UCAP parameters and their reference-factor explanation. Use its printed values; 325 × 79/76 ≈ 337.83 and 175 × 79/76 ≈ 181.91 explain the change, without reconstructing a different rounded price.

Authoring targets for the upper panel are below. **Every numeric public price-layer field above remains null in the Example build.** “No collar” and “no approved later collar” describe policy status, not a zero price.

| Delivery year | RTO clearing price | Collar cap | Collar floor | Result / source locator |
| --- | ---: | ---: | ---: | --- |
| 2025-26 | 269.92 | null | null | Cleared; SRC-PJM-04 pp.3–4, RTO row. No temporary collar; old 2024-25 bar excluded |
| 2026-27 | 329.17 | 329.17 | 177.24 | Cleared; SRC-PJM-03 pp.3–4, Table 1 and VRR bullet; reopened 2 November |
| 2027-28 | 333.44 | 333.44 | 179.55 | Cleared; SRC-PJM-02 p.4, Table 1 / VRR bullet; reopened 2 November |
| 2028-29 | 325.00 | 325.00 | 175.00 | SRC-PJM-01 p.5/Table 2 and SRC-PJM-13 p.4 comparison; report detail retained from 31 October, current report retrieval timed out |
| 2029-30 | null | 337.83 | 181.91 | SRC-PJM-13 pp.1,4; no clearing result yet |
| 2030-31 to 2042-43 | null | null | null | No forecast or renewal scenario in this chart; no approved later collar asserted |

The [2026-27 report](https://www.pjm.com/-/media/DotCom/markets-ops/rpm/rpm-auction-info/2026-2027/2026-2027-bra-report.pdf) p.4 and [2027-28 report](https://www.pjm.com/-/media/DotCom/markets-ops/rpm/rpm-auction-info/2027-2028/2027-2028-bra-report.pdf) p.4 give different UCAP floors. Do not carry 175 across all capped years.

Every auction-rating field is enumerated here; values shown as percentages are stored ÷ 100.

| y | h=4 | h=6 | h=8 | h=10 | Exact table locator |
| --- | ---: | ---: | ---: | ---: | --- |
| 2025-26 | 59 | 67 | 68 | 78 | SRC-PJM-10, 20 March 2024 presentation, slide/PDF p.6, “Final Rating” column; four storage rows. “Final” here means that BRA presentation's rating, not a later 3IA delivery-year rating |
| 2026-27 | 50 | 58 | 62 | 72 | SRC-PJM-09, BRA document p.1; not its 3IA companion |
| 2027-28 | 58 | 67 | 70 | 78 | SRC-PJM-08 p.1 |
| 2028-29 | 59 | 68 | 71 | 78 | SRC-PJM-07 p.1 |
| 2029-30 | 57 | 66 | 69 | 76 | SRC-PJM-06 p.1 |

The working [SRC-PJM-10 PDF](https://www.pjm.com/-/media/DotCom/committees-groups/committees/mc/2024/20240320/20240320-item-01---irm-fpr-and-elcc-for-25-26-bra---presentation.pdf) resolves the former unnumbered slide locator to p.6. [2028-29 ratings](https://www.pjm.com/-/media/DotCom/planning/res-adeq/elcc/28-29-bra-elcc-class-ratings.pdf) and [2029-30 ratings](https://www.pjm.com/-/media/DotCom/planning/res-adeq/elcc/29-30-bra-elcc-class-ratings.pdf) were reopened. The 2026-27 and 2027-28 BRA PDF retrievals returned 403; retain their original check date.

For SRC-PJM-11 the original backstop-postings URL failed; the official ELCC landing page links this working [preliminary rating table](https://www.pjm.com/-/media/DotCom/planning/res-adeq/elcc/preliminary-elcc-class-ratings-for-period-dy28-dy42-elcc.pdf). Its p.1 is the exact locator for every cell below: year column and h-hr Storage row. It was reopened on 2 November. These are **PJM non-binding indicative values**, each divided by 100 for storage.

| y | h=4 | h=6 | h=8 | h=10 |
| --- | ---: | ---: | ---: | ---: |
| 2030-31 | 42 | 52 | 56 | 66 |
| 2031-32 | 34 | 44 | 50 | 60 |
| 2032-33 | 30 | 40 | 47 | 56 |
| 2033-34 | 26 | 36 | 44 | 54 |
| 2034-35 | 24 | 34 | 41 | 52 |
| 2035-36 | 23 | 33 | 41 | 51 |
| 2036-37 | 22 | 31 | 39 | 50 |
| 2037-38 | 22 | 32 | 40 | 51 |
| 2038-39 | 22 | 32 | 41 | 52 |
| 2039-40 | 21 | 32 | 40 | 51 |
| 2040-41 | 20 | 30 | 39 | 49 |
| 2041-42 | 20 | 30 | 38 | 48 |
| 2042-43 | 19 | 28 | 37 | 47 |

Historical results-date targets for E.years[y].resultsPostedDate are 2025-26 → 2024-07-30 (SRC-PJM-04 cover/report date), 2026-27 → 2025-07-22 (SRC-PJM-03 cover), 2027-28 → 2025-12-17 (SRC-PJM-02 cover), and 2028-29 → 2026-07-14 (SRC-PJM-01 cover). Later document creation/revision dates do not move an auction's results date. Earlier bid-window dates and unlocated posting dates remain null. Calendar dots must use the named date type.

### Other scalar, history, map and teaching fields

| Field | Unit / target | Locator and arithmetic |
| --- | --- | --- |
| E.auctionTerm.deliveryYears | years: 1 | SRC-PJM-17 p.2, BRA buys a June–May delivery year; identity. This rule fact does not duplicate the financial securedYears binding |
| E.years['2029-30'].auctionWindowOpens / auctionWindowCloses | 2026-12-09 / 2026-12-15 | SRC-PJM-14, worksheet “29-30 BRA Post”, D59/F59 and D60/F60; revalidated 3 November 2026, values unchanged from the retained check; source-date transcription, no arithmetic |
| E.years['2029-30'].resultsPostedDate / resultsNotBefore | 2026-12-22 / 16:00 EPT | Same worksheet, D61/F61 “Auction results posted”; no-earlier-than time from worksheet header A5; revalidated 3 November 2026 |
| E.years['2029-30'].ratingPostedDate | 2026-08-07 actual posting | SRC-PJM-06 and official ELCC landing page, 2029/2030 BRA row. Workbook F24 planned 6 August is not the actual 7 August posting |
| E.years['2030-31'].ratingPostedDate | 2027-01-11, planned | SRC-PJM-14, worksheet “30-31 BRA Post”, D24/F24 “Preliminary ELCC Class Rating”; revalidated 3 November 2026; also the live rating trigger. Actual posting date remains unknown |
| E.years['2030-31'].auctionWindowOpens / auctionWindowCloses / resultsPostedDate | 2027-05-12 / 2027-05-18 / 2027-05-25, planned | Same worksheet, D58/F58, D59/F59 and D60/F60; revalidated 3 November 2026, values unchanged |
| E.queue.acceptedProjects | projects: 715 | SRC-PJM-25 p.1, project-count bullet; identity |
| E.queue.acceptedNameplateMW | MW: 201500 | SRC-PJM-25 p.1, capacity bullet: 201.5 GW × 1,000 |
| E.queue.storageProjects | projects: 314 | Same project-count bullet, storage entry; identity |
| E.queue.storageNameplateMW | MW: 60000 | Same capacity bullet: 60.0 GW × 1,000; not qualified or built supply |
| E.queue.studyYearsMin / studyYearsMax | years: 1 / 2 | SRC-PJM-25 p.1, study-process paragraph; preserve the stated range |
| E.attribution.loadGrowthMW / dataCentreLoadGrowthApproxMW | MW: 5250 / approximately 5100 | SRC-PJM-17 pp.2–3, load-growth paragraph; identity; retain “nearly” for the latter |
| E.attribution.dataCentreLoadGrowthShareApprox | fraction: approximately 0.9714 | 5100 ÷ 5250; derived check only, not a precise measured share; numerator is approximate |
| E.attribution.monitorDataCentreCostBillionUSD / monitorAuctionCostBillionUSD / monitorReportedShare | USD billion: 6.3 / 16.4; fraction: 0.382 | SRC-PJM-20 slide 4; copy the Monitor's separately reported share. 6.3 ÷ 16.4 ≈ 0.384 is a rounded-input check, not a reason to overwrite 38.2% |
| E.attribution.monitorFourAuctionCostBillionUSD / monitorFourAuctionReportedShare | USD billion: 29.4; fraction: 0.462 | SRC-PJM-20 slide 6; identity and 46.2 ÷ 100; attributed cost allocation, not share of all demand growth |
| E.backstop.existingTariffShortfallThresholdPP | percentage point: 1 | SRC-PJM-02 printed p.3, Executive Summary, OATT Attachment DD §16 paragraph; identity; not a percentage of MW |
| E.backstop.existingTariffConsecutiveAuctions | auction count: 3 | Same paragraph: initial qualifying shortfall plus two additional BRAs = 3; identity of the tariff condition |
| E.backstop.maxTermYears | years: 15 | SRC-PJM-17 p.7, RBP term paragraph; maximum, not a signed commitment |
| E.backstop.acceptedOn / amendedFiledOn | 2026-09-29 / 2026-10-29 | SRC-PJM-17 p.1 and SRC-PJM-19 date/header/first paragraph; identity |
| E.backstop.proposedBidsOpen / proposedBidsClose / proposedTargetDate / proposedResultsDate | 2027-03-01 / 2027-03-28 / 2027-04-28 / 2027-05-10 | SRC-PJM-19, “New Procurement Dates”; planned dates, dashed. No implication of a completed procurement |
| E.history['H-PJM-01'].when / eventDates | 1927; energy market 1997-04-01; RTO year 2002 | SRC-PJM-22, History paragraphs 1–5; preserve each date's precision |
| E.history['H-PJM-02'].when / firstDeliveryYear | 2007; 2007-08 | SRC-PJM-05 Table 1, PDF p.5, first delivery-year row; period-to-label only |
| E.history['H-PJM-03'].when / polarVortexYear / performanceYear | 2016 / 2014 / 2016 | SRC-PJM-21 PDF p.9, “Market Outcomes”; chronology, not a calculated causal coefficient |
| E.history['H-PJM-04'].when / elliottMonth / marginalApprovalDate / firstMarginalYear | 2022–2024 / 2022-12 / 2024-01-30 / 2025-26 | SRC-PJM-21 PDF p.9; SRC-PJM-12 opening methodology note; SRC-PJM-04 pp.3–4 |
| E.history['H-PJM-05'].when / complaintOn / collarApprovedOn / extensionApprovedOn | 2025–2026 / 2024-12-30 / 2025-04-21 / 2026-04-28 | SRC-PJM-15 opening and paragraphs 1–2,13; SRC-PJM-16 opening paragraphs; no inference from publication month to auction outcome |
| E.history['H-PJM-06'].when / style / eventRefs | Outlook / dashed / the dated auction, rating and backstop records | Future event references, not invented historical observations |
| E.footprint.admin1Source / servedStateIds / approximate | Natural Earth admin-1 version+URL / DE, IL, IN, KY, MD, MI, NJ, NC, OH, PA, TN, VA, WV and DC / true | ASSET-PJM-FOOTPRINT; SRC-PJM-23 p.1 and SRC-PJM-25 p.2. Whole-state shading is approximate; source/version must be recorded when asset is built |
| E.footprint.importLimitedZoneIds | DOM, COMED | SRC-PJM-13 p.1, import-ratio paragraph; named-zone schematic, not a generated power-flow boundary |
| E.teaching.powerMW | nameplate MW: 100 | Script §1 and evidence specification §4; explicitly Example, no primary observation |
| E.teaching.winterEventDays | days: 2 | pjm-09 approved teaching scene; explicitly Example, not an Elliott dispatch trace |
| E.teaching.priceSketch | unscaled layout record | Four cleared-year bar positions, a pending-year band and later empty slots, as approved in pjm-07; no numeric price scale and no geometry derived from blocked price observations |

The [queue release](https://www.pjm.com/-/media/DotCom/about-pjm/newsroom/2026-releases/20260803-over-700-new-generation-projects-accepted-into-first-cycle-of-reformed-interconnection-process.pdf), pp.1–2, and the [29 October amended-backstop notice](https://insidelines.pjm.com/pjm-files-amended-reliability-backstop-proposal/), “New Procurement Dates”, were reopened. Backstop term/status locators were also checked in the [29 September order](https://www.pjm.com/pjmfiles/directory/etariff/FercOrders/9154/20260929-er26-3380-000.pdf), pp.1–2,7 and ordering paragraph (A), p.85. SRC-PJM-14 was reopened on **3 November 2026** after the 2 November failure: the workbook download succeeded (24,876 bytes, sha256 `b769a1ea789da451b7fca1d502ce215e94d2f724bb53205717415aa8033e4e2e`), and its four worksheets are “29-30 BRA Post”, “27-28 3rd IA Post”, “30-31 BRA Post” and “Future Schedule Post”. Every date transcribed from it matches the retained 31 October check; only the cell locators are newly recorded. Other historical source locators retain the canonical register's dated check; they are not represented as freshly reopened.

**Derived display values, not additional stored financial inputs:** Example energyMWh = E.teaching.powerMW × R.play.hours; Example creditedMW(y,h) = E.teaching.powerMW × the selected non-null rating; cleared-year gross daily capacity per installed MW = price × auction rating, gated with the price family; annual comparison = daily product × 365, then the model's stated rounding. No future product is shown. Unknown values propagate null.

The 2027-28 report gives 145,777.1 UCAP MW total procurement and a 6,516.6 MW shortfall on p.3, while its p.4 uses a different RPM/IRM shortfall. Its rounded 152,400 MW headline requirement cannot simply be paired with 145,777.1 to reproduce 6,516.6; FRR/PRD and rounding matter. Both comparison-bar fields therefore remain null. The 2028-29 report's 156,013 MW headline requirement is likewise not silently paired with a BRA-only cleared total. B-PJM-BASIS closes only with matched locators and subtraction.

## 4. Bound-field map: every shot pjm-00 to pjm-12

Aliases: **R** = the selected infrastructure-fund opportunity row produced by src/experience/model.js; **B** = HOME_BRIEFING; **E** = the proposed manual export in section 3. E paths are future bindings and remain blocked by B-PJM-DATA until implemented. Missing values resolve null / an approved figure-free state, never a copied review value.

| Shot | Every figure or dated/numeric graphic | Exact binding / missing-state decision |
| --- | --- | --- |
| pjm-00 | Call, play, four-hour design, entry stage, opening-card hold return and target margin, next-action dates; marker | CALLS[R.call]; playTitle(R.play,R.stage); R.play.hours; R.investment.holdIRR (= R.econ.hold); R.econ.test.target and the existing margin formatter; R.play.action.text; R.evidence. Shared opening card is reused: it does not acquire a second financial calculation. Review date binds the script's reviewedAgainst.on |
| pjm-01 | 1927 origin, unified-price period from 2026-27, named state/zone geography; any regional price tag | E.history['H-PJM-01']; E.years['2026-27'].deliveryYear plus auctionStatus; E.footprint.*. The unresolved numeric price tag is null; use “One clearing price” qualitatively. No transmission mileage or population number is introduced |
| pjm-02 | Six historical-node dates, 2007-08 start, June–May blocks, auction/result dots and outlook dates; secured tenor | E.history['H-PJM-01' through 'H-PJM-06']; E.years[y].deliveryStart/deliveryEnd/resultsPostedDate; E.auctionTerm.deliveryYears; R.econ.securedYears. Label result-date dots as such; missing auction windows are not invented. H-PJM-06 refers to the live auction/rating/backstop dates |
| pjm-03 | 2014, 2016, December 2022; Example state of charge and event sequence; optional Elliott charge scale in evidence | E.history['H-PJM-03'].polarVortexYear/performanceYear and E.history['H-PJM-04'].elliottMonth; E.teaching plus local teaching state. No event trace or numeric state-of-charge value is observed. No Elliott dollar total is registered for display: the evidence drawer links SRC-PJM-21 rather than typing a charge number |
| pjm-04 | Example 100 MW, four-hour duration, nominal energy, next-auction class percentage, credited MW, all duration-class bars, method-change year | E.teaching.powerMW; R.play.hours; powerMW × hours (400 MWh today); E.years[nextPublishedAuction].auctionRatingByHours[R.play.hours] (0.57 today); powerMW × rating (57 MW today); same year's ratings for h=4,6,8,10; E.history['H-PJM-04'].firstMarginalYear. These values remain Example calculations on class ratings, not unit certification |
| pjm-05 | 2027-28 and 2028-29 requirement/cleared/shortfall bars, price cap, demand attribution, queue counts/capacity and study years | E.years[y].comparisonRequirementUCAPMW / comparisonClearedUCAPMW / shortfallUCAPMW / comparisonBasis; E.years[y].collarCapUSDPerUCAPMWDay is publicly null while gated; E.attribution.* with explicit PJM/FERC or Monitor attribution; E.queue.*. Bar pair is null under B-PJM-BASIS; no incompatible bars or fabricated difference. Rounded cost inputs do not override the Monitor's reported shares |
| pjm-06 | 2026-27 through 2029-30 collar years, April 2025 and April 2026 approvals, cap/floor and July 2026 uncapped comparison | E.years[y].deliveryYear and collar fields; E.history['H-PJM-05'].collarApprovedOn/extensionApprovedOn; E.years['2028-29'].uncappedSimulationRTOUSDPerUCAPMWDay. All numeric price labels are null while rights unresolved; “With the cap / Without it (PJM simulation)” may explain the mechanism with an unscaled Example |
| pjm-07 | All chart years, prices, bands, pending results date, observed and indicative class percentages, one-year brackets, four-hour label; caption's source-vintage date for the indicative segment | E.years[y].deliveryYear; all price fields through E.pricePublication gate; E.years['2029-30'].resultsPostedDate; auctionRatingByHours[R.play.hours] and indicativeRatingByHours[R.play.hours]; E.years[y].indicativeRatingSourceVintageOn for the caption's “4 September 2026” preliminary-ratings vintage (SRC-PJM-11's registered document vintage; a source label, not a posting date); E.auctionTerm.deliveryYears; R.play.hours. Render exactly section 5, including accessible table states; do not expose blocked data through a table |
| pjm-08 | 4/6/8/10-hour choices, each next-auction credited share, Example power/energy, best duration, design cell value/return and design line; capital-stack shape | B.grids.pjm.hours; E.years[nextPublishedAuction].auctionRatingByHours[h]; E.teaching.powerMW × h; B.grids.pjm.byRoute.cap.best; B.grids.pjm.cells.find(c => c.route==='cap' && c.hours===h).value / hold; B.build.find(x => x.market==='pjm').line. Capital drawing stays qualitative; no new capex amount. Controls never reprice R |
| pjm-09 | Two-day Example, 100 MW, next-auction year, 2030-31/2035-36/2042-43, their class percentages and credited MW | E.teaching.winterEventDays/powerMW; selected E.years[y] and its matching h rating; powerMW × rating. At four hours: 2030-31 42% → 42 MW; 2035-36 23% → 23 MW; 2042-43 19% → 19 MW. All future indicative values dashed and labelled non-binding; no fabricated hourly dispatch |
| pjm-10 | First-year secured share, one-year secured tenor, capacity price denominator/day, energy and Regulation settlement units | R.econ.secured (= R.investment.secured), using the page's share() formatter; R.econ.securedYears; E.auctionTerm.deliveryYears. Unit-only mechanism labels are the approved bilingual route copy. No energy price, Regulation price or merchant-revenue number is introduced. Governing-clause fields are absent: verified settlement detail is blocked by B-PJM-TERMS |
| pjm-11 | One-year auction block versus maximum 15-year backstop, acceptance/amendment/suspension/proposed-window dates | R.econ.securedYears; E.backstop.maxTermYears; E.backstop.acceptedOn/amendedFiledOn/proposedBidsOpen/proposedBidsClose; B.triggers['pjm-backstop-filing-suspension-ends'].expected. Future bars dashed and “Scenario”; no award, cash flow or extended model tenor |
| pjm-12 | Hold/target returns, live action, 2029-30 auction window/results date, backstop date, 2030-31 rating date, third-shortfall threshold, counterpoint | R.econ.hold; R.econ.test.target; R.play.action.text; E.years['2029-30'].auctionWindowOpens/Closes/resultsPostedDate; B.triggers['pjm-backstop-filing-suspension-ends'].expected; B.triggers['pjm-elcc-2030-31-rating'].expected; the sourced tariff threshold described below; R.decision.counterpoint and R.decision.reason. Three watched records replace the old two-event presentation under B-PJM-COPY. Investment detail remains links to Bankable case, Revenue, Execution and Downside |

For the threshold in pjm-12, the section 3 fields are **E.backstop.existingTariffShortfallThresholdPP = 1** (percentage point) and **E.backstop.existingTariffConsecutiveAuctions = 3** (auction count), from SRC-PJM-02 printed p.3, Executive Summary, OATT Attachment DD §16 paragraph. Identity: initial shortfall plus two further qualifying auctions = three. These are the existing tariff's Reliability Backstop Auction, not the new one-time RBP's 15-year terms. A FERC filing is required before that auction runs.

**Coverage verdict:** all thirteen shots have explicit field owners. The table does not turn proposed E fields into live runtime bindings. Quantitative bars lacking a verified source pair and verified settlement terms lacking fields remain scoped blockers; they must not be filled from prose or a scene constant. Historical years may retain the content contract's dated-fact exception, with the same source records.

The next-auction selector must use the earliest not-yet-held auction with a successfully published official BRA rating for the selected duration. Once December's auction results have actually been published and the next official rating is not yet posted, the “next auction” rating and derived credited-MW display become null. Do not carry 57% forward or promote the 42% indicative value to an official rating.

## 5. Chart-PJM-PRICE-ELCC contract

| Layer / condition | Required treatment |
| --- | --- |
| Upper panel now | **Unscaled Example / 示例.** Four illustrative cleared-year bars stop at a schematic band. No numeric price axis, numeric price tooltip, observed-price table, source-derived relative bar heights, or price-times-rating output. The Example geometry cannot be reconstructed from the blocked price series |
| 2029-30 upper slot | Band only, “Auction pending / 拍卖待举行”, with the bound planned results date. No bar and no predicted clearing value |
| Later upper slots | Empty, “No cap approved / 尚无获批上限”. This means no approved later temporary collar in the reviewed record; it does not mean zero price or absence of normal tariff demand-curve rules |
| Lower observed segment | Solid official **BRA class ratings**, 2025-26 through 2029-30, for R.play.hours. Published ratings for a future auction are observed publications, not realised battery performance. Do not substitute final delivery-year/3IA ratings |
| Lower indicative segment | Dashed from 2030-31 through 2042-43, labelled **“Indicative (PJM, non-binding) / 指示性（PJM，不具约束力）”**. Preserve year-by-year values, including plateaus and rises; no manufactured monotonic fall |
| Boundary / axes | Shared delivery-year x-axis; distinct panel units. Lower axis may show percentage ratings once their records validate; that does not give the upper Example a numeric price scale. No dual-axis overlay, no earlier rating points, no 2024/25 context bar |
| Example labels elsewhere | Example battery size, energy, credited-MW teaching arithmetic, state-of-charge scene and two-day winter scene all retain “Example”. Dashed backstop commitments retain “Scenario”, not “awarded” |
| Fields staying null | Every public upper-panel numeric price/collar/simulation field while rights are unresolved; the 2029-30 clearing result until publication; all later price results/scenarios and unapproved collar values; nonexistent auction-rating cells; missing source observations; unknown procurement pairs. A null is not zero |
| Cleared-year product | After price clearance only: clearingPrice × matching BRA class rating in an evidence drawer, for cleared years only, labelled gross reference capacity payment per installed MW/day. Annual model reconciliation uses ×365 and explicit rounding. No future product line or merchant capture implication |
| What retires the price Example | **All** of: recorded analyst rights clearance covering the intended series, transformations and public payload; validated source-located manual records; paired year/vintage/UCAP units; reviewed observed renderer and bilingual table; exact-candidate G-2 checks. A manual data PR, a new auction result, an accessible PDF or an existing model price alone does not retire it |

Price mode must gate the payload as well as the drawing. No blocked values in a lazily loaded bundle, unlinked asset or accessible table. The previously published model's existing source figures remain outside this session's change scope.

## 6. Reuse extract: configuration and new work

The actual reuse records are [#102](https://github.com/jerryyuan1996/BESS-research-platform/pull/102) for Germany and [#105](https://github.com/jerryyuan1996/BESS-research-platform/pull/105) for Finland, with data/content/scenes in #90/#99/#100 and #89/#103/#104. [#106](https://github.com/jerryyuan1996/BESS-research-platform/pull/106) supplies the approved historical-copy supplement. [#107](https://github.com/jerryyuan1996/BESS-research-platform/pull/107) passes distinct opportunity rows to the shared story; it is not a new drawing framework.

| Layer | Configured / reused | Written new for PJM |
| --- | --- | --- |
| Data / publication | Shared manual-record/provenance pattern and a blocked observed-price mode; Germany proves a registered feed need not publish observations, Finland proves units/vintages remain explicit | Local fixed-vintage BRA/ELCC/evidence records and validation; no connector, catalogue entry or ETL |
| Content / bindings | WP-02 contract, reviewedAgainst, bilingual strings, markers, selected live row, existing return/share formatters; Finland's null/figure-free handling | Thirteen signed PJM shots, source bindings and mechanical reconciliation in section 7; no model execution in content |
| Opportunity selection | #107's distinct selected-row context and existing opening card; each opportunity owns its own economics | One PJM fund play configuration and an explicit lens boundary; no fork or second financial view |
| Scenes / map | Shared SVG/isometric symbols, stage, controls and theme/reduced-motion conventions | PJM scene compositions, approximate footprint and payment/credit teaching states; no new shared kit |
| Signature chart | Shared SVG/axis primitives; Germany's Example discipline and Finland's calendar-time chart approach | Two-panel price/ELCC renderer, null-aware table, independent rights gate and auction/indicative styles; the intraday chart is not repurposed as annual evidence |
| History / sources | Existing timeline/four-field expansion and source drawer; #106 keeps facts and interpretation separate | PJM history configuration, source selectors and the corrected primary URL/locators; no shared-register mutation in this memo |
| Wiring / QA / release | Existing research button, lazy pack, shell, URL/history/focus/language handling, section handoffs and controlled pipeline | Later market-local pack, additive registry entry and PJM coverage/budget checks; preserve every concurrently added market entry. No wiring or release now |

No new duration algorithm, financing convention, discount rate, shared shell, global store, framework or deployment route is required. Actual shared-file edits, if later needed, belong to a separately authorised integration step; evidence sessions never edit the shared registry. Old PR timing and byte measurements are precedent, not a new PJM budget result.

## 7. CF-PJM-03 reconciliation list

**Closed numerical dependency; open mechanical content work.** The duration-specific refresh in [#109](https://github.com/jerryyuan1996/BESS-research-platform/pull/109) is merged. Computations were repeated read-only from (a) pinned main and (b) the exact #109 merge e47adea68ba1399a839629d0ba11927f0f641498, both at the explicit evaluation clock 2026-11-02T00:00:00Z. Their PJM results below agree. No fixture, snapshot or model input was rewritten.

R is assembled exactly as the market page assembles it: B.lenses.infraFund.rows + B.plays + opportunitySummary(B, views). R.econ.hold is the investment-summary holdIRR, not B.plays['pjm/pjm-cap-4h'].econ.hold. The card's after-tax nominal calculation already includes its existing inflation convention.

| Binding / exact field | Older script review value | Current main value | Required by merged #109 / content treatment |
| --- | --- | --- | --- |
| playDuration → R.play.hours | 4 hours | 4 | 4; unchanged |
| bestDuration → B.grids.pjm.byRoute.cap.best | 4 hours | 4 | 4; maximum value per MW, not the highest percentage return |
| designDurations → B.grids.pjm.hours | 4,6,8,10 | [4,6,8,10] | Same four durations; all capacity designs remain below the platform's yields |
| holdReturn → R.econ.hold = R.investment.holdIRR | 4.7% | 0.02702690163060739 | Same value; page formatter displays **2.7%** |
| targetReturn → R.econ.test.target | 12.1% | 0.12076053043246304 | Same; **12.1%** |
| Opening target margin → existing margin formatter on R | Not separately recorded | hold − target = −0.09373362880185565 | Same; approximately **9.4 percentage points below target**, through the existing formatter |
| securedShare → R.econ.secured = R.investment.secured | 46.7%, card 47% | 0.4671907145269752 | Same; **47%** with share(), or 46.7% only where the existing detailed formatter uses one decimal |
| securedTenor → R.econ.securedYears | 1 year | 1 | 1; no backstop tenor substituted |
| Existing adjacent-card levered return → R.econ.levered = R.investment.leveredIRR | Not recorded | 0.015485315563341318 | Same; **1.5%** if the existing card shows it; no new story finance panel |
| Existing adjacent-card lower-of-hold/sale → R.econ.lowerOf = R.investment.irr | Not recorded | −0.02328878982780841 | Same; **−2.3%**; not the headline hold return |
| Existing target test → R.econ.test | Below target | basis=neither; meets=false; leveredTarget=0.14076053043246303 | Same; **below target both ways**, levered target 14.1% |
| Existing adjacent-card gearing → R.investment.leverage.gearing | Not recorded | 0.2696852284749002 | Same; **27%** with share(); not an assumed financing percentage |
| Design hold → B.plays['pjm/pjm-cap-4h'].econ.hold | 0.0237 ≈ 2.37% in the earlier design check | −0.0031 | Same; **−0.31%** on the separate design basis; never put this in holdReturn |
| Design exit → B.plays['pjm/pjm-cap-4h'].econ.exit | Not recorded | −0.0682 | Same; −6.82% on the design basis only |
| Design value → B.build.find(x=>x.market==='pjm').best.value; matching cap/4h cell.value | Approximately −$464k/MW in script | −576796 USD/MW | Same; display through the existing per-MW formatter, **−$577k/MW** in the bound build line |
| Design MOIC / payback → B.plays['pjm/pjm-cap-4h'].econ.moic / payback | Not recorded | 0.77 / null | Same; null is not a zero-year payback; do not add either as new story copy |
| Secured annual reference → market.comparison.economics.securedContracted | Existing 2028-29 reference | 69989 USD/MW/year | Same: round(325 × 365 × 0.59) = round(69988.75) = **69989**. A stale inline comment says 69,994; the executable value and arithmetic govern |

The full final capacity comparison is mechanical:

| Duration | Exact cell selector in B.grids.pjm.cells | Current value USD/MW | Required value after #109 | Current / required design hold |
| --- | --- | ---: | ---: | ---: |
| 4h | route=cap, hours=4 | −576796 | −576796 | −0.0031 / −0.0031 |
| 6h | route=cap, hours=6 | −824133 | −824133 | −0.0115 / −0.0115 |
| 8h | route=cap, hours=8 | −1129224 | −1129224 | −0.0240 / −0.0240 |
| 10h | route=cap, hours=10 | −1412243 | −1412243 | −0.0302 / −0.0302 |

The existing bilingual build line is bound wholesale:
“PJM: nothing clears the platform's yields; capacity auction at 4h comes closest, at −$577k/MW.”
“PJM：没有设计能达到平台收益率；容量拍卖4小时最为接近，每MW −57.7万美元。”

For every h, the approved renewal arithmetic is **round(priceScenario[y] × 365 × durationSpecificCredit[y,h])**. The price-scenario sequence for 2029-30 through 2042-43 remains [337.83,500,520,470,430,400,380,380,380,380,380,380,380,380]. Only its first element is aligned to the last collared auction's cap; none is a cleared future price. This sequence stays in the model, outside Chart-PJM-PRICE-ELCC. The section 3 rating matrix supplies the duration-specific credits, with 2029-30's auction values preceding the indicative years. The four-hour resulting renewal array is [70286,76650,64532,51465,40807,35040,31901,30514,30514,30514,29127,27740,27740,26353], matching comparison.durationResponse.auctionRenewalCurves[4]. No longer duration inherits a fixed 2028-29 ratio.

Required content reconciliations, all within the earlier approved rulings:

- **CF-PJM-01 / #101:** financial figures come only from the bindings above. Do not copy the old typed return in a thesis or confuse operating/design hold with after-tax nominal investment hold. Do not add inflation again.
- **CF-PJM-02 / #101:** bind the current action exactly: “Read the 2029/30 capacity auction in December 2026 for its price, and the 2030/31 four-hour rating due 11 January 2027; re-price nothing before both.” Use its existing Chinese pair from R.play.action.text. The current changesIf list contains pjm-capacity-auction-2029-30, pjm-backstop-filing-suspension-ends **and pjm-elcc-2030-31-rating**. Thus pjm-12's old “Two events” and “Name only the two triggers” cannot be copied. Use three trigger records, or group price and next rating without hiding either. The January release is no longer merely untracked context.
- **CF-PJM-03 / #109:** retain the revised pjm-08 page copy describing each duration's own renewal credit; discard its obsolete authoring sentence about scaling one common path.
- **CF-PJM-04:** retain the named shortfall basis; do not substitute 6,623.2 for 6,516.6.
- **CF-PJM-05 / #101:** if the queue figure is shown, bind the 60.0 GW accepted-Cycle-1 source record. Do not reinstate “67 GW in the reopened queue”.
- **CF-PJM-06:** observed four-hour ratings are 59%,50%,58%,59%,57%; they did not fall auction by auction. Indicative class paths also need their actual annual shapes.

The current counterpoint and decision reason bind R.decision.counterpoint and R.decision.reason unchanged. The fund's rating trigger expected date is 2027-01-11; backstop expected date is 2027-02-28; auction expected month remains 2026-12 in the live view. The precise auction window belongs to the evidence record, not an unauthorised view-store edit.

No application tests or build were run for this documentation-only output. Validation consisted of dependency ancestry, scoped-input comparisons, independent read-only current and #109 model evaluations, source checks with explicit retrieval failures, binding coverage and prospective-document checks. This is not a G-2 test pass or release record.

## 8. Market judgement calls

**Chart decision retained.** The upper price layer stays rights-unresolved and is the **unscaled Example**, with cleared-year bars stopping at a band, the 2029-30 band labelled **“Auction pending”**, and later years empty with **“No cap approved”**. The lower panel's published BRA class ratings are **solid**; future indicative values are **dashed**, labelled **“Indicative (PJM, non-binding)”**. There is **no 2024/25 context bar and no old-method point**. A newly posted official rating can replace an indicative point only with its own source/vintage and any needed editorial review.

**A reader must not conclude** that an illustrative price height is an observed price, that the two panels form a forecast revenue curve, or that prices will rise enough to offset falling credit. The panels establish neither causation nor a guaranteed inverse relationship. A class rating is not project qualification; price × rating is not net earnings, debt capacity or a multi-year commitment. Later “No cap approved” does not mean an unbounded price. Publication of a future auction's rating does not turn its pending price into an observation.

**Auction decision retained.** The 2029-30 auction window is **9–15 December 2026**; the retained schedule record expects results on **22 December 2026**, not during the bidding window. Those dates were **revalidated on 3 November 2026** against the reopened official [RPM auction schedule](https://www.pjm.com/-/media/DotCom/markets-ops/rpm/rpm-auction-info/rpm-auction-schedule.xlsx) — worksheet “29-30 BRA Post” rows 59–61 and worksheet “30-31 BRA Post” rows 58–60, sha256 `b769a1ea789da451b7fca1d502ce215e94d2f724bb53205717415aa8033e4e2e` — with every value unchanged. The new official 2030-31 rating is separately due on 11 January 2027. Reprice nothing before both events under the live action.

**If the auction outcome changes the call or play, the story stops for Rule 11 editorial review; it is not rebuilt.** A changed duration, lens or thesis also requires the corresponding anchor review. Do not refresh reviewedAgainst to clear the warning automatically. An unchanged anchor permits a separately authorised, source-validated data update, with the rights gate still enforced.

**Least-confident decision:** whether pjm-05's two quantitative bars can be made directly comparable from the currently identified report totals. Confidence is **Thin** for that pairing: the FRR/PRD and rounding bridge has not been verified, and the 2028-29 report could not be reopened. What would change it: exact matched requirement/procurement locators and reproducible subtraction on the same UCAP basis. Until then both bar inputs stay null and the qualitative explanation carries the point. This uncertainty does not reopen the approved four-hour Wait judgement.
