# ERCOT build evidence — decisions only

Decision record, **2 November 2026, Australia/Perth**. **Rule 11 passes for the infrastructure-fund story.** Historical content, the labelled Texas schematic and unscaled Examples can be prepared in a separately authorised build. Observed chart publication, operator-rule verification and project toll underwriting retain the distinct gates below. This record registers no data and authorises no implementation or release.

Read: [AGENTS.md](../../AGENTS.md), [master plan](README.md), [WP-02 through WP-10](engineering-work-packages.md), the complete [ERCOT script](ercot-storyboard.md), [canonical evidence/history/gaps](source-register.md#g1-ercot-evidence), [claim ledger](market-narratives.md#g1-ercot-claims), [ruling 5A](../open-calls-plan-2026-10-31.md#5-ercot-add-a-real-dated-review-leave-toll-underwriting-gated), and the reuse evidence in section 6. The script's **Analyst decisions — 1 November 2026** and **Final reconciliation** govern over its earlier unresolved G-1 questions and stale authoring notes.

## 1. Rule 11 verdict

All shared inputs were read from the immutable committed main snapshot **`474766e07ff78a20a57e0a999a3da05c0a62dbf3`**. GitHub main, local main and origin/main matched that SHA at the opening and pre-write checks. The shared checkout itself remained detached at `7e00c1a0abac88d9bb4355624febb0bb571ff381`; it was not switched or updated. A separate committed-source snapshot supplied the calculation, excluding other sessions' uncommitted files and all confidential material.

| Precondition | Evidence | Verdict |
| --- | --- | --- |
| Required 1 November stack on main | Ancestor checks passed for #108 `ef47bb9`, #109 `e47adea`, #110 `4ec1cf2`, #111 `6a5062c`, #112 `fba750c`, #113 / `codex/ie-six-hour-review-20261101` `bbe4070`; function/test-clock follow-up #114 `f29c207` is also an ancestor. | Pass |
| Script #95 on main | [#95](https://github.com/jerryyuan1996/BESS-research-platform/pull/95) merged 1 November, merge `2ffe213eccb04b402336c8906dc763eff930584c`; ancestor check passed. Its approved reconciliation explicitly depends on #112. | Pass |
| Live view versus reviewed script | Read committed `view/markets/ercot.json`; evaluated `briefingFromDisk` for `2026-11-02`, `homeProjection` and `opportunitySummary`, without an overlay or writes. Compared with the script's reviewed record and final approval. | Pass; anchors below |
| Parallel-work ownership, replacing the original global-clean requirement | Full status captured. Tracked/index diffs were empty against the detached checkout. Existing untracked work comprised `.workbuddy/memory/2026-11-02.md`, the IE/PL/RO evidence files, eight publisher-test scratch files, IE story/binding modules and its content test. They were preserved and not used as evidence. The ERCOT output did not exist; its dependencies were isolated in the committed snapshot. | Pass under the user's parallel-work revision; **not a claim that global status was clean** |

| Anchor | Live view / computed row at the recorded SHA | Script's reviewed record, section 1 | Result |
| --- | --- | --- | --- |
| Call | `verdicts.infraFund.call = "opportunistic"`; projected `row.call = "opportunistic"`, tier `situational`; display **“Situational / 择机投入”** | “verdict `opportunistic`, displayed **Situational / 择机投入**” | Match |
| Play | `verdicts.infraFund.play` and projected row select **`ercot-toll-2h`**; route `toll`; label **“Toll · 2h / 租赁 · 2小时”** | “play **`ercot-toll-2h`** (‘Toll · 2h’), route `toll`” | Match |
| Duration | `plays.ercot-toll-2h.hours = 2`; investment summary `hours = 2` | “two hours” | Match |
| Lens | View verdict key and computed lens **`infraFund`**, Infrastructure fund / 基础设施基金 | “Default lens `infraFund`” | Match |

The historical `REPO-ERCOT-LIVE` observation remains `edcb39c`, checked 31 October; this document does not relabel it as today's observation. #112 changed the thesis to public monitoring evidence, and #95's **1 November approved final reconciliation** follows that change. The current thesis still argues: fast connection, no capacity payment, reserve/battery revenue pressure, a reference return below target and an executed toll at a known price as the condition of entry. No new, unreviewed thesis drift was found. The old CF-ERCOT-04 note is not a reason to restore the subscription comparator: today's action already names the public monitor's 2025 battery revenue.

Read-only financial reconciliation: investment-summary `holdIRR = 0.005268082502971727` formats to **0.5%**; target `0.10136239339819082`, so `(holdIRR − target) × 100 = −9.60943108952191` percentage points, displayed **−9.61 pp**. `secured = 1`, `securedYears = 7` are **model assumptions**. The separate design-grid toll-2h hold return is `−0.0587`; it must not replace the investment-summary return. No figure in this paragraph is a new page constant.

**Verdict: PASS for this evidence record, not a build or release approval.** At the actual construction candidate, recheck call, play, duration, lens **and thesis**. A changed call/play or unreviewed thesis goes to editorial review. The shared `isStale()` checks call/play/hours only; it does not supply the required lens or thesis check.

## 2. Gaps

These are all five open ERCOT `GAP-*` records in the canonical register. “Blocking” names the affected activity; an investment gate is not silently turned into a blanket story-construction stop.

| Gap | Blocking or not | Exact page wording / element it settles | Closure evidence |
| --- | --- | --- | --- |
| **GAP-ERCOT-AS** | **Blocks observed numeric chart publication and associated numerical copy.** Does not block the unscaled Example. | ercot-05: “Battery capacity on ERCOT's grid grew from ‹bound: battery MW start› at the end of 2021 to ‹bound: battery MW latest› at the end of 2025”; ercot-06: “the average price of responsive reserve fell from ‹bound: RRS price 2023› to ‹bound: RRS price 2025›”; product/year controls, tooltips, accessible rows and source caption. | Open primary records; exact locators, units and arithmetic; a consistent commercial-operation upper series and resolved cross-check; verified lower-table transcription; source-specific publication-rights disposition; separately reviewed records/registration and G-2 acceptance. |
| **GAP-ERCOT-TOLL** | **Blocks executable project underwriting.** Non-blocking for an expressly assumed toll with no displayed price. | ercot-00/-11: “only a toll already signed at a known price can make a case”; ercot-10 payment route; ercot-11 share/tenor and its contract-price box; ercot-12 contract factor. | Executed or primary-disclosed price **and complete terms**, including tenor, indexation, market-tail allocation, dispatch/charging rights, availability deductions, termination, eligibility and counterparty credit/support. MORA cannot close it. |
| **GAP-ERCOT-OPEN** | **Blocks G-2 acceptance of claims dependent on the unopened records.** Decisions and static/Example preparation can proceed. | ercot-01–08 event/rule/definition labels; ercot-12: “ERCOT's next adequacy outlook, due on ‹bound: next event date›” and “the regulator's decision on next year's reserve quantities”; competing operator interpretation. | Analyst completes section 8's hand-opening list, recording exact document/locator, version, publication/effective/coverage dates, checked date and disposition. Successful HTML access alone does not close workbook, rule or rights review. |
| **GAP-ERCOT-RULE** | **Blocks treating the current connection-cost explanation as verified operator/regulator rule text.** A clearly dated, attributed laboratory finding can remain pending review. | ercot-03: “connect without first paying for wider network upgrades” and “Its requests reached a signed interconnection agreement in ‹bound: ERCOT months to agreement› on average”. | Current Planning Guide §5 and applicable PUCT rules read together; distinguish network upgrades from direct connection facilities, studies, deposits, allowance conditions and above-allowance costs; preserve agreement versus commercial-operation distinction. |
| **GAP-ERCOT-MAP** | **Non-blocking under the approved schematic treatment.** It blocks any claimed geographic ERCOT footprint. | ercot-00/-01: **“ERCOT's grid (schematic) / ERCOT电网（示意）”**. | Reuse the existing Texas outline with a labelled internal schematic, no ERCOT footprint boundary or whole-state ERCOT fill. A later actual footprint requires a verified public boundary and its reuse rights. |

Additional retained acceptance conditions, without inventing new GAP IDs:

| Condition | What remains blocked |
| --- | --- |
| Five capacity observations lack verified sheet/row/year-cell locators and current definition | Numeric upper panel, numerical endpoint copy and any claim that its source-to-stored arithmetic has been reproduced. |
| Price-data rights **and** visual/table verification remain incomplete | Numeric lower panel, RRS endpoint prose, price tooltips and accessible price tables together. “Strong” is not a rights waiver. |
| Current operator rule/terms and ownership-law checks | Final acceptance of affected current-rule claims at G-2; no finding about an actual investor or supplier is made here. |
| Recorded wording reconciliation | The overbroad toll-price absence claim must use section 8's scoped bilingual wording. Use the approved “expanded opportunities” ercot-04 copy, not its stale “created the first revenue pool” authoring note. Say **Reg-Up**, not every regulation product, when listing upward-reserve durations. The Example-state numerical sentences need the explicit alternatives in section 5. |
| Field and lens acceptance | The later pack must implement all eligible bindings and an explicit `infraFund` guard; an unbound visible figure blocks acceptance. Merely naming a proposed field is not a completed binding. |
| Future January MORA / analyst disposition | New January-outlook conclusions, trigger resolution/replacement and any resulting investment judgement wait for the actual evidence and review; see section 7. |
| OC-ER-TOLL | A priced, executable investment case remains blocked independently of any completed story. |

## 3. Field list

**This is the contract for a later data PR, not a registration performed here.** At the reviewed SHA, `src/governance/datasets.js` contains no ERCOT dataset and there is no ERCOT story evidence module. Proposed owner: **`ERCOT_STORY_RECORDS`** in `src/markets/ercot/data/storyEvidence.js`, following Finland's fixed-vintage publication-record pattern. Below, **`R`** means that proposed interface. `fleet[2021]` means the record whose `year` is 2021, not a positional array index. Existing financial outputs and teaching configuration are listed separately in section 4.

Fixed-vintage manual records need no new scheduled feed. A later switch to direct operator price ingestion is a separately reviewed route with its own method, rights and registration. While publication is blocked, proposed browser-facing values are **null**; do not hide a full price array behind an Example renderer. Review candidates below remain research-document values, not permission to ship them.

### Provenance, controls and metadata — every record

| Fields to register | Unit / locator / source-to-stored operation |
| --- | --- |
| `R.id`, `R.marketId`, `R.schemaVersion`, `R.vintage`, `R.checkedOn` | Identifiers/version/date; authored module metadata. `marketId = ercot`. Vintage identifies the selected fixed source releases, not an automatic “latest” series. Module consolidation date is separate from each source's successful check date. |
| Datum `id`, `sourceIds`, `year` or `period`, `datePrecision`, `measure`, `scope`, `unit`, `status`, `approximate`, `comparator`, `qualifier` | Metadata attached to each field below; copy the source's measure, population and precision. Preserve `gt`, `lt`, “almost” and rounded values; null is not zero. Dates/years come from their named observation or event, never the download timestamp. |
| `R.sources[sourceKey].publisher`, `.title`, `.url`, `.language` | Source identity, verbatim document identity and primary URL from the canonical SRC record or the opened workbook. A new workbook source key is proposed, not already registered. No company/deal/project material is introduced. |
| Source `.locator.document`, `.pdfPage`, `.printedPage`, `.section`, `.table`, `.row`, `.column`, `.sheet`, `.cell`, `.clause` | Exact primary locator, as applicable. PDF page is **one-based**; printed page is retained, including Roman/appendix numbering. An XLSX has no printed page: `printedPage = null`, with real sheet/table/row/year-cell required. Unknown cells/clauses stay null with unresolved status. |
| Source `.publishedOn`, `.effectiveOn`, `.coverage.from`, `.coverage.to`, `.checkedOn`, `.lastAttemptOn`, `.access` | Source publication, legal/operational effective date, coverage, successful check, attempted access and outcome respectively. Identity transcription; no substitution of one date for another. A failed retry changes `lastAttemptOn/access`, not the last successful `checkedOn`. |
| Source `.reuse.status`, `.reuse.basisUrl`, `.reuse.basisLocator`, `.reuse.attribution`, `.reuse.constraints` | Source-specific rights ruling, supporting term/clause, attribution and restrictions; authored from the actual reviewed rights record. Public accessibility is not a clearance field. Unknown basis stays null and unresolved. |
| Datum `.calculation.inputs`, `.calculation.formula`, `.calculation.rounding`, `.calculation.reviewStatus` | The exact transcription/conversion/derivation below. Preserve raw source precision; round only at display. “Pending” is retained where primary cells have not been read. |
| `R.fleet[].definition`, `.sourceVintage`, `.comparatorSourceId`, `.differenceMW`, `.differencePct`, `.comparisonStatus`, `.disposition` | Commercial-operation definition, fixed workbook version and separate monitor comparison. When comparable exact values exist: `differenceMW = operatorMW − monitorMW`; `differencePct = 100 × differenceMW / monitorMW`. For bounded/rounded, missing or non-comparable values, a misleading exact delta stays null; record the qualitative comparison and resolution. |
| `R.fleet.publicationReady`, `R.prices.publicationReady` | Independent authored gate flags, currently **false**. They require the evidence/rights/registration conditions in section 5; one flag cannot unlock the other. |

Successful 2 November checks reopened the monitor's 2025/2024/2023/2022 reports and several operator HTML pages. Current attempts to reopen SRC-ERCOT-06 returned HTTP 402 and SRC-ERCOT-10 exceeded the reader's size limit; their prior 31 October checks are retained. RTC/NPRR access and XLSX extraction remain incomplete. No blanket `checkedOn = 2026-11-02` is assigned to all records.

### Physical, policy and connection fields

| Proposed field | Unit | Exact primary locator | Source → stored arithmetic / current disposition |
| --- | --- | --- | --- |
| `R.dcTies.spp.count`, `.transferMW` | Count; MW transfer capability | SRC-ERCOT-01, 2025 report, printed p.36 / PDF p.58, §II.H opening paragraph, SPP ties | Direct `2`, `820`; transfer capability, not observed flow. |
| `R.dcTies.mexico.count`, `.transferMW` | Count; MW transfer capability | Same paragraph, Mexico ties | Direct `2`, `400`. |
| `R.dcTies.totalCount`, `.totalTransferMW` | Count; MW | Same two source groups | `2 + 2 = 4`; `820 + 400 = 1,220 MW`. |
| `R.offerCap.currentUSDPerMWh`, `.priorUSDPerMWh` | USD/MWh | SRC-ERCOT-06, PUCT Project 52631 Item 47 adopting order, p.1 and pp.4–5, cap amendment | Direct `5,000`, `9,000`; no scale conversion. Reopen the current rule/notice before presenting this as the current cap rather than the historical amendment. |
| `R.offerCap.adoptedOn`, `.effectiveOn` | Dates | Same order, adoption; ERCOT notice M-A120721-01 for commencement | Adoption `2021-12-02`; candidate effective day `2022-01-01` remains unverified by this session. Use effective **year 2022** until the notice is read; do not invent day precision. |
| `R.connection.meanRequestToAgreementMonths` | Months | SRC-ERCOT-10, *Queued Up: 2026 Edition*, slide 47, ERCOT request-to-agreement row | Direct `24`; not COD time or a project promise. |
| `R.connection.requestCohortFromYear`, `.dataThroughYear` | Years | Same edition, slides 44/47 and data-coverage statement | Direct `2010`, `2025`; preserve the cohort alongside the mean. No numeric “elsewhere” comparator is registered. |

### Upper panel — exact operator values are still blocked

Candidate documents opened only to the link/HTML level: [December 2025 workbook](https://www.ercot.com/files/docs/2026/01/08/Capacity-Changes-by-Fuel-Type-Charts_December_2025.xlsx) and [September 2026 workbook](https://www.ercot.com/files/docs/2026/10/06/Capacity-Changes-by-Fuel-Type-Charts_September_2026.xlsx). The former is a natural end-2025 candidate; the latter must be checked for revisions and definition changes before freezing a vintage. **Neither workbook's contents were read.** The web reader rejected XLSX and a direct in-memory download was denied socket access. A link is not a sheet/cell locator.

| Field | Unit and intended exact source row | Required arithmetic | Current eligible value / locator |
| --- | --- | --- | --- |
| `R.fleet[2021].installedMW` | Year-end MW, December 2021, battery storage, **commercial operation approved** | Source MW → same MW; if the actual source uses GW, `× 1,000`. No sum of additions. | **null**; selected document/vintage, sheet, table, row and year cell unresolved. |
| `R.fleet[2022].installedMW` | Same definition, December 2022 | Same; pending actual unit/cell | **null**, same locator blocker. |
| `R.fleet[2023].installedMW` | Same definition, December 2023 | Same; pending actual unit/cell | **null**, same locator blocker. |
| `R.fleet[2024].installedMW` | Same definition, December 2024 | Same; pending actual unit/cell | **null**, same locator blocker. |
| `R.fleet[2025].installedMW` | Same definition, December 2025 | Same; pending actual unit/cell | **null**, same locator blocker. |

Each row also owns `year`, `period`, `datePrecision = end-year`, `definition`, `sourceId`, `sourceVintage` and the metadata above. Do not fabricate 31 December day precision if the workbook supplies only a December/end-year observation. A single selected workbook must be checked for all five years; if it lacks the history, archive extraction needs a documented consistent-definition reconciliation before use. No exact operator value or completed source-to-value calculation is asserted here.

### Independent monitor cross-checks, not replacement upper-series points

| Fields | Source document / exact locator | Arithmetic and precision |
| --- | --- | --- |
| `R.monitorChecks[2021].mw`, `.qualifier` | SRC-ERCOT-01 printed p.21 / PDF p.43, “2. ESR Capacity Trends”, 2021 stock statement | `1,600 MW`, rounded narrative comparator. The earlier report's `820 MW added` is a different measure, not a year-end stock. |
| `R.monitorChecks[2022].mw`, `.qualifier` | SRC-ERCOT-05, 2022 report, printed p.ii / PDF p.8, generation-portfolio bullet | `2.7 GW × 1,000 = 2,700 MW`; preserve rounded precision. |
| `R.monitorChecks[2023].mw`, `.qualifier` | SRC-ERCOT-03, 2023 report, printed p.v / PDF p.11, “Supply in 2023” | `4.4 GW × 1,000 = 4,400 MW`; preserve rounded precision. Do not reconstruct stock as `2,700 + 1,900 = 4,600`. |
| `R.monitorChecks[2024].mw`, `.qualifier` | SRC-ERCOT-02, 2024 report, printed p.22 / PDF p.60, §2 first paragraph | Direct `9,505 MW`, as printed. |
| `R.monitorChecks[2025].mw`, `.comparator` | SRC-ERCOT-01 printed pp.ii,21–22 / PDF pp.12,43–44, year-end capacity statements | `17,000 MW` with **`gt`**; it means **more than**, not exactly 17,000. |
| `R.fleetDuration2025.hours`, `.year` | SRC-ERCOT-01 printed p.21 / PDF p.43, ESR fundamentals bullet | Direct `1.83 hours`, `2025`. **Do not** derive it as `31,500 ÷ 17,000`; those fleet totals are rounded/bounded. |

The cross-check policy and disagreement treatment are binding decisions in section 8. These records retain each report's own vintage and successful check date.

### Lower panel — one report vintage, rights-unresolved

All five product rows refer to **SRC-ERCOT-01, *2025 State of the Market Report*, May 2026, printed p.40 / PDF p.62, in-body Figure 25, “Ancillary Service Prices”, inset table, named product row × year column**. The contents list misnumbers it Figure 26. The current PDF text did not reliably reproduce the table's cells; the numbers below are the signed script's **candidates awaiting visual primary-table check**, not a fresh verified transcription.

| Proposed value field | 2021 | 2022 | 2023 | 2024 | 2025 |
| --- | ---: | ---: | ---: | ---: | ---: |
| `R.prices.products.rrs.annual[year].usdPerMWPerHour` | 300.87 | 20.79 | 21.04 | 5.52 | 2.74 |
| `R.prices.products.nonSpin.annual[year].usdPerMWPerHour` | 81.56 | 23.24 | 15.53 | 7.13 | 3.65 |
| `R.prices.products.regUp.annual[year].usdPerMWPerHour` | 282.56 | 25.62 | 34.88 | 7.36 | 2.97 |
| `R.prices.products.regDown.annual[year].usdPerMWPerHour` | 116.16 | 9.64 | 15.19 | 3.90 | 1.79 |
| `R.prices.products.ecrs.annual[year].usdPerMWPerHour` | null | null | 73.18 | 9.56 | 2.65 |

**Eligible browser-facing values are currently null for every numeric candidate above.** ECRS 2021/2022 are structural pre-launch nulls, which remain null even after rights clearance. Each record also owns `year`, `productId`, `sourceId`, `sourceVintage`, `unit`, `sourcePrintedUnit`, `coverageNote` and `locator`.

Arithmetic for the selected transcription route is **identity, not recomputation of annual averages**. Preserve the table's printed `$/MWh` unit in metadata; the chart explains its reserve-capacity meaning as **USD per MW held ready per hour**. There is no numerical scale conversion and no multiplication by annual hours to fabricate captured revenue. ECRS's 2023 observation starts with its June launch; 2025 contains only one month after real-time co-optimisation. Never substitute the different 2024-report values into this vintage.

### Other observed statistics and duration rules

| Proposed fields | Unit / exact locator | Arithmetic and wording constraint |
| --- | --- | --- |
| `R.revenuePerKW2025.declineMagnitudePct`, `.qualifier`, `.comparisonYear`, `.year` | Percent; SRC-ERCOT-01 printed p.22 / PDF p.44, §3 “ESR Revenue Trends”, paragraph before Figure 17 | Direct `37`, **`almost`**, `2024`, `2025`; format **almost 37%**, not an exact −37.000% series. No chart digitisation or subscription index. |
| `R.ordc2025.activeHours`, `.year` | Hours/year; SRC-ERCOT-01 printed p.8 / PDF p.30, paragraph before Figure 5 | Direct `57`, `2025`; historical ORDC result. |
| `R.ordc2025.averagePriceAdderUpperBoundUSDPerMWh`, `.comparator` | USD/MWh; same paragraph; executive-summary corroboration p.iii | Direct `0.02`, **`lt`**; display **less than $0.02/MWh**, never exactly $0.02 or zero. |
| `R.reserveRules.regUp.durationMinutes` | Minutes; SRC-ERCOT-01 Table A1, printed A-3 / PDF p.161, **Reg-Up** row × duration | Direct `30`; if displayed in hours, `30 ÷ 60 = 0.5`. |
| `R.reserveRules.rrs.durationMinutes` | Minutes; same table, RRS row | Direct `30`; `30 ÷ 60 = 0.5 hours`. |
| `R.reserveRules.ecrs.durationMinutes` | Minutes; same table, ECRS row | `1 hour × 60 = 60 minutes`. |
| `R.reserveRules.nonSpin.durationMinutes` | Minutes; same table, NSRS row | `4 hours × 60 = 240 minutes`. |
| `R.reserveRules.regDown.durationMinutes` | No accepted duration row established | **null**. Do not infer symmetry with Reg-Up; the signed shot says “Each upward reserve”. |
| `R.reserveRules.effectiveOn` | Date; SRC-ERCOT-14 operator go-live/implemented rule, monitor Table A1 context | Candidate `2025-12-05`; operator clause/effective-text verification remains in the manual list. A price-product record does not itself prove a duration obligation. |

### History/date records

Every `R.history[H-ERCOT-01..06]` owns `id`, `dates`, `datePrecision`, `sources`, `locators`, `kind`, and separate adopted/effective/closed dates where relevant. Event facts and the approved interpretative `[en, zh]` content remain separate; source publication dates are not event dates.

| Record | Source and row/clause | Stored event dates / precision |
| --- | --- | --- |
| H-ERCOT-01 | SRC-ERCOT-01 p.2; SRC-ERCOT-19 start-date notice pending | `2014`, year precision. Candidate `2014-06-01` is withheld until the start notice is read. |
| H-ERCOT-02 | SRC-ERCOT-04 p.iv, EEA3 account | `2021-02-15` through `2021-02-19`, event range. |
| H-ERCOT-03 | SRC-ERCOT-06 p.1; effective-date notice pending | Adopted `2021-12-02`; effective year `2022` until exact day verified. Cap values bind the cap fields above. |
| H-ERCOT-04 | SRC-ERCOT-07 adoption release; SRC-ERCOT-08 meeting minutes, 19 December 2024, item 17 | Adopted `2023-01-19`; closed branch `2024-12-19`. Not a prospective credit. |
| H-ERCOT-05 | SRC-ERCOT-03 p.ix; SRC-ERCOT-14 ECRS notice | First procurement/operating day `2023-06-10`; distinguish notice/system implementation on 9 June. |
| H-ERCOT-06 | SRC-ERCOT-01 pp.2,7; SRC-ERCOT-14 RTC notice pending | `2025-12-05`, real-time co-optimisation and retirement of the ORDC adder. |

No subscription revenue index, “85%” figure, toll proxy price, outage/casualty count, reserve-procurement MW series, 2030 load GW, energy-price series or new project-contract price is registered by this proposed manifest. January 2027 MORA results have **no stored observation yet**. Existing result and trigger fields are reused, not copied into this manual evidence module.

## 4. Bound-field map

Notation: `I = row.investment`; `B = HOME_BRIEFING`; `R` is the **proposed** record contract in section 3. Financial formatters are the existing page/shell formatters (`CALLS`, `playTitle`, `returnPct`, `share`, `marginText`, existing design-grid value formatter), passed through the pack context. No new financial calculation is placed in the story.

Proposed local teaching configuration is `ERCOT_TEACHING.powerMW = 100`, labelled **Example / 示例**; duration comes from `row.play.hours`. It is independent of investment-case sizing. The signed page needs no numerical energy label; if a later authorised scene adds one, it must bind `powerMW × row.play.hours` MWh and remain Example, not a new case input.

| Shot | Every figure / named token | Exact binding / treatment |
| --- | --- | --- |
| **ercot-00** | `call`, `play`, `card figures`, `next action`, `play evidence`; duration embedded in play title | `CALLS[row.call]`; `playTitle(row.play,row.stage)` and `row.play.hours`; shell metric from `returnPct(I.holdIRR)` and `marginText(row)`; `row.play.action.text`; `row.evidence` through fixed marker labels. Card retains the investment-summary basis. Thumbnail uses the existing Texas asset and schematic topology; no toll fee. |
| **ercot-01** | `DC tie capacity`; four connector symbols, two ties per neighbour group; any group-capability tooltip | `R.dcTies.totalTransferMW`; `R.dcTies.totalCount`, `.spp.count`, `.mexico.count`; group `.transferMW`. The named asset is `src/markets/ercot/tx-boundary.json`. Connectors are link symbols, not flow, footprint or planned-asset claims. |
| **ercot-02** | `offer cap`, `old offer cap`, `history node`; all six timeline dates and cap labels in accessible text | `R.offerCap.currentUSDPerMWh`, `.priorUSDPerMWh`; selected `R.history[H-ERCOT-01..06]` event/precision and approved event-versus-reading content. Current shot highlights H-01/-03/-04/-06. No calibrated numerical scarcity curve. |
| **ercot-03** | `ERCOT months to agreement`; cohort/coverage qualifiers | `R.connection.meanRequestToAgreementMonths`, `.requestCohortFromYear`, `.dataThroughYear`. Elsewhere is “longer on average”, with no invented comparator. No COD countdown, cost or queue-count figure. |
| **ercot-04** | H-02/H-05 timeline dates; reserve/outage blocks | `R.history[H-ERCOT-02]`, `[H-ERCOT-05]`. Blocks and supplier symbols are qualitative local geometry, not quantities/shares. No outage, casualty or reserve-MW labels. Approved copy says “expanded opportunities”; no sole-cause claim. |
| **ercot-05** | `battery MW start`, `battery MW latest`, `battery MW by year`; year control, all point labels/tooltips/table rows; `fleet average duration` | `R.fleet[2021].installedMW`, `[2025].installedMW`, selected-year `.installedMW` and `.year`; `R.fleetDuration2025.hours` and `.year`. Do not substitute monitor comparator values. With the workbook gate open, numeric MW sentences/plot use section 5's figure-free Example treatment. Battery symbols do not encode an invented MW-per-site conversion. |
| **ercot-06** | `battery MW by year`, `reserve price by year`, `RRS price 2023`, `RRS price 2025`, `revenue per kW change`; selector, axes, clipped 2021 marker, crosshair, accessible table and caption | Upper: same `R.fleet` records. Lower: `R.prices.products[selected].annual[year].usdPerMWPerHour`; both RRS prose endpoints select the **same** RRS records, not separate constants. Revenue change: `R.revenuePerKW2025.declineMagnitudePct` plus `.qualifier`. Years/units/source vintage come from those records. Numeric lower values in **all** render surfaces remain withheld while rights/checks are unresolved. |
| **ercot-07** | `ORDC hours`, `ORDC adder`; historical 2025/year-since-2014 labels; tight-year preset | `R.ordc2025.activeHours`, `.averagePriceAdderUpperBoundUSDPerMWh` with `.comparator = lt`, `.year`; H-ERCOT-01 date. Tight-year curve/gauge is an unscaled Example with no invented probabilities or prices. These are pre-retirement historical ORDC results, not a post-RTC performance series. |
| **ercot-08** | `play duration` in question/scene; Example 100 MW battery; `reserve duration rules` | `row.play.hours`; `ERCOT_TEACHING.powerMW`; `R.reserveRules.{regUp,rrs,ecrs,nonSpin}.durationMinutes`, formatted consistently as minutes/hours. Reg-Down duration stays null. No numerical SOC, dispatch curve or stacked revenue maxima. Any optional energy label uses the explicitly labelled teaching derivation above. |
| **ercot-09** | `duration grid`, `design cell value`, every repeated `play duration`; hour headers, least-loss/best and not-priced states | `B.grids.ercot.hours`; route/hour-selected `B.grids.ercot.cells[].value`, `.best`, `.priced`, `.eligible`; `row.play.hours`. If an existing grid tooltip shows hold IRR, it reads the same cell's `.hold`, never `I.holdIRR`. Toll 1h/4h/8h value/hold remain null and render “Not priced / 未定价”. Optional fleet comparator only from `R.fleetDuration2025.hours`. |
| **ercot-10** | Payment-unit labels, no amounts | Energy MWh and reserve MW/hour are source-owned unit definitions from SRC-ERCOT-01 pp.38,100. “No capacity payment” is a mechanism statement, not a missing price filled with zero. Toll/counterparty arrow remains qualitative and unpriced; market receipts are not added on top of assumed toll receipts. |
| **ercot-11** | `secured share`, `secured tenor`, `hold IRR`, `margin to target`; expiry boundary | `share(I.secured)`; `I.securedYears`; `returnPct(I.holdIRR)`; `marginText(row) = 100 × (row.econ.hold − row.econ.test.target)` pp. Tenor defines the categorical period, then merchant. The toll lane has no price-height/axis/fee/range; actual contract terms are unverified. Use section 8's wording. |
| **ercot-12** | `next event`, `next event date`, `next action`; factor cards | `row.decision.event.label`, `.expected`; `row.play.action.text`. Underlying unresolved trigger is `ercot-january-2027-mora`. Future factors are qualitative/dashed, without reserve MW, shortage probabilities, queue GW or toll prices. Existing exits: `#bankable`, `#revenue`, `#execution`, `#downside`. |
| **Shared surfaces** | `source checked date`; historical/source dates and units; review-banner `‹date›`; all repeated figures in captions/controls/tooltips/accessible text | Selected `R.sources[sourceKey].checkedOn` and exact locator/units; selected history record; actual `story.reviewedAgainst.on`, proposed to preserve the **1 November G-1 approval** rather than pretending today's computation is a new script sign-off. Source date, review date and current calculation date remain separate. |

Model values stay live: at this check `I.secured = 1` and `I.securedYears = 7`, but no story constant should contain those values. Grid `requiredHours` stays null where the engine has no requirement. Null financial data invokes the approved figure-free current-case state; no substitution from thesis prose, the design return or a private quote is permitted.

**No unbound visible figure is accepted.** The map names an owner for every required figure and date, including hidden/accessibility surfaces. It does not claim those proposed bindings exist. Where the source field is still null or ineligible, publishing its numerical sentence is blocked; the explicit Example/figure-free treatment is required instead. A new scene label outside this map requires its own eligible field before acceptance.

## 5. Chart contract

| Layer/state | Required appearance and meaning |
| --- | --- |
| **Cleared observations** | Solid observed year-end installed battery MW above; solid annual day-ahead reserve prices by product below. Shared year axis only when both are actual annual observations; independent y-axes, no overlay or implied crossing. Installed MW is neither MWh nor available/qualified reserve. Prices are not captured battery revenue. |
| **Historical events** | Actual dated events stay historical. The performance-credit branch is closed: “Adopted, then not taken forward / 已通过，后未推进”; it is not a dashed future payment. |
| **Dashed conditional/future states** | Pending reserve requirements, unsettled battery participation in DRRS, future fleet/load scenarios and the qualitative post-toll merchant tail. The dashed DC-connector glyph is a separately labelled **physical link convention**, not a claim that the existing ties are future plans. |
| **Chart Example — current default** | Unscaled fleet-up/prices-down teaching picture labelled **“Example / 示例”**. No numerical axes, points, values, crosshair, observed-value table, observed-price caption or hidden numeric payload. Do not style rights-blocked values as Thin observed data. |
| **Partial clearance** | An independently cleared upper series may become solid and numeric while the lower remains its own clearly separated unscaled Example. The lower then has **no calibrated year/price axis or alignment suggesting observed annual points**. Clearing upper records does not clear lower prices. Until an explicit mixed-state rendering meets this contract, retain the whole-chart Example. |
| **Other Examples** | ercot-07's tight-year schematic and ercot-08's teaching battery carry Example labels. The 100 MW preset is authored teaching configuration; its duration comes from the live play. It never changes underwriting. |
| **Toll depiction** | No toll price line, fee band, range or proxy in Chart-ERCOT-AS. ercot-11 is a categorical, unscaled payment-period diagram labelled **“Modelled toll (assumption) / 模型租赁（假设）”**, with contract price unverified, followed by dashed merchant exposure. Its rectangle is not a quantitative revenue band. |
| **After price clearance** | Default product Responsive Reserve. ECRS begins in 2023, with 2021/2022 null. Use original annual table values after verification, one vintage. 2021 is clipped with **“2021 off scale: Winter Storm Uri / 2021年超出刻度：Uri冬季风暴”** and the exact permitted value in the accessible table; no log scale. Tick values are derived from eligible data/presentation configuration, never invented observations. |

Nulls retained: all unverified operator MW; all lower-price public values until clearance; ECRS pre-launch values; unpriced toll 1h/4h/8h design cells; unverified actual contract price/counterparty/terms; unestablished Reg-Down duration; future January MORA observations; unresolved trigger `effect`. None becomes zero, a smooth interpolation or an implied market price.

**Exact condition that retires the lower Example:** the analyst has accepted the **actual selected source route** and its publication-rights disposition; the primary Figure 25 table has been visually checked and transcribed reproducibly (or a separately approved operator route reproduces the agreed annual-average definition); permitted records and provenance are registered in a later data PR; all product/year units, vintages, launch gaps and corrections are checked; all price figures in copy, chart, tooltip and accessible text bind those same eligible fields; Rule 11 still passes on the actual candidate; and the numeric presentation is accepted at G-2. Registration alone, successful fetching, attribution alone or rights for another publisher do not retire it. Upper Example retirement independently requires its exact workbook extraction, definition, cross-check, rights and binding gates.

The signed numerical sentences cannot survive beside a rights-blocked Example. Proposed bilingual state copy, recorded here for the later content pass:

- **ercot-05 while upper is blocked — EN:** “Public monitoring reports rapid battery growth. The installed-capacity series is awaiting source verification; the picture is an unscaled Example.” **ZH:** “公开监测报告记载电池装机快速增长。装机序列仍待来源核验；图中展示未按比例绘制的示例。”
- **ercot-06 while lower is blocked — EN:** “The market monitor reports that reserve prices fell as batteries entered. The price series is awaiting publication clearance; the picture is an unscaled Example. Prices are not captured revenue.” **ZH:** “市场监测报告记载，随着电池进入，备用价格下跌。价格序列仍待确认发布权限；图中展示未按比例绘制的示例。价格不等于实际取得的收入。”

Any separately cleared textual statistic, such as the monitor's qualified revenue-per-kW change, must still bind its own checked record and retain its qualifier. It cannot be used to reconstruct the blocked price series. These states use the shot's one evidence marker and its “what would change it” line, without adding disclaimer bands.

## 6. Reuse extract

Merged work, not the engineering document's proposal-era “all not started” sentence, is the implementation evidence. #107 is specifically the **two-opportunity-card** change; it is not a general ERCOT sign-off. Historical phase timings are not ERCOT estimates or new authority.

| Layer | Configured / reused | Written new for ERCOT | Merged evidence |
| --- | --- | --- | --- |
| Opportunity selection / financial ownership | Selected `ctx.row`, `ctx.result` and shared play card; `ctx.rows` only where distinct opportunities exist | Single ERCOT play configuration; no duplicate opportunity card or second financial engine | [#107](https://github.com/jerryyuan1996/BESS-research-platform/pull/107), `35fe5ea`: `storyRows.js`, `playChoices.js`, `pages.js`, shell/tests |
| Dataset/publication boundary | Catalogue/envelope contracts, blocked-publication pattern, feed versus publication-record distinction | Fixed-vintage ERCOT records, exact locators/arithmetic and source-specific rights gates; separate ingestion only if that route is later selected | DE [#90](https://github.com/jerryyuan1996/BESS-research-platform/pull/90), `bb4b880`; FI [#89](https://github.com/jerryyuan1996/BESS-research-platform/pull/89), `b8648ad` |
| Dated evidence / history | Separate identity, publication/coverage/check dates, event fact and interpretation; signed historical supplement pattern | ERCOT chronology, six history records and local claim/source links | DE [#99](https://github.com/jerryyuan1996/BESS-research-platform/pull/99), `story/history.js`; FI [#103](https://github.com/jerryyuan1996/BESS-research-platform/pull/103), `data/storyEvidence.js`; [#106](https://github.com/jerryyuan1996/BESS-research-platform/pull/106), `5e4d390` |
| Bilingual content contract | Six chapters, opening, thirteen shots, token/claim/source validation, fixed markers and locale pairs | ERCOT content configuration, every label/control/caption and approved state-copy reconciliation | DE #99 `ee893a0`; FI #103 `f995610`; shared `story/contract.js` |
| Financial/evidence bindings | Existing computed row/result and UI formatters; null/figure-free handling | ERCOT token adapter, source metadata and publication-eligible selection. Do not render obsolete/index-based text merely because it is present in a view field | DE #99/[#102](https://github.com/jerryyuan1996/BESS-research-platform/pull/102); FI #103; market `storyBindings.js` files |
| SVG kit, geography and scenes | Native SVG/isometric primitives, controls, tokens, themes and reduced-motion behavior | Texas schematic composition, local timeline/battery/payment scenes and local styling | DE [#100](https://github.com/jerryyuan1996/BESS-research-platform/pull/100), `23f98e5`; FI [#104](https://github.com/jerryyuan1996/BESS-research-platform/pull/104), `8a408ce` |
| Signature chart | Shared low-level SVG/axis/accessibility patterns; Germany's blocked observed renderer and Finland's explicit missing-data behavior | Annual two-panel chart, independent units, product selector, clipped 2021 values, permitted table and independent Example gates | DE #100/#102; FI #104. Shared `kit/chart.js` is a **48-bin intraday** helper, not this annual chart |
| Lazy pack, navigation and guards | Research button, shell, chapter/history/place handling, focus restoration, locale, research fallback and four investment exits | Local pack/registry configuration and explicit actual-lens/call/play/duration guard; preserve all other markets' registrations in a later wiring PR | DE #102 `7f8245d`; FI [#105](https://github.com/jerryyuan1996/BESS-research-platform/pull/105), `9342602` |
| Acceptance / release | Existing model, confidentiality, budgets, ETL and browser checks; controlled pipeline; analyst G-2 | ERCOT parity, field/null/rights/scene/browser checks and exact-candidate screenshots/evidence | DE #102, FI #105 and WP-10; prior checks are not a pass for a future ERCOT candidate |

At this SHA, `pages.js` passes `row`, `rows`, `result`, `name`, `trigger`, `openResearch`, `place` and `ui`, **not an explicit lens**. The eventual pack must enforce `infraFund` through an actual compatible context/state check; `isStale()` alone is insufficient. Unsupported context returns to the existing research fallback. Shared `renderPlayChoices` also renders `play.why`; reuse must not accidentally introduce an absolute price-absence/index claim through that path.

**WP-05 remains retired; WP-08 remains folded into WP-06; WP-11 remains deferred.** This session ran no build, preview, model-baseline test, ETL verification, budget or browser suite. Those checks belong to the separately authorised exact-candidate build; none is represented here as passed.

## 7. Timing gate

**There is no published 6 November 2026 ruling in the reviewed repository.** The existing **5A ruling was recorded and applied on 31 October 2026**. **6 November 2026** is the expected January 2027 MORA publication/review date; the requested later analyst disposition remains pending, with that date as the review expectation, not an assumed outcome.

| Item | Verified state / implication |
| --- | --- |
| Live trigger | `ercot-january-2027-mora`; `kind = event`; `expected = 2026-11-06`; `watches = [demandGrowth, saturation]`; `direction = either`; **`effect = null`**. Fund `changesIf` names it; play action is due the same date. |
| Ruling already in force | [Open-calls plan 5A](../open-calls-plan-2026-10-31.md#5-ercot-add-a-real-dated-review-leave-toll-underwriting-gated) adds a dated research action, with no toll-price, financial, call or grade change. |
| Primary schedule checked 2 November | [ERCOT resource-adequacy page](https://www.ercot.com/gridinfo/resource): targeted first-Friday releases, two months before the reporting month. First Friday of November 2026 = **6 November**; two months ahead = **January 2027**. The page listed December 2026, posted 2 October; January 2027 was not listed at the check. This is an expected date, not evidence that the January report or a later ruling exists. |
| Date that must not be confused with it | [M-A121925-01](https://www.ercot.com/services/comm/mkt_notices/M-A121925-01) describes PUCT approval of the **2026 AS methodology on 6 November 2025**. That historical approval is neither the January 2027 MORA nor a 6 November 2026 ruling. |

| May proceed in a separately authorised build before the review | Must wait for actual publication / analyst disposition |
| --- | --- |
| Historical content and sources, the labelled schematic map, shared shell/navigation/bindings, teaching scenes, null/error states and unscaled Examples | Any claimed January-outlook observation, winter evening adequacy/battery-availability conclusion or MORA-derived probability |
| Workbook/table verification, rights work and independently cleared **historical** numerical layers, subject to their own gates | Trigger resolution/replacement, marking the 6 November action completed, changing its source/status/date without evidence, or a revised market call/play/thesis |
| Showing the current trigger as an explicitly **expected/pending** event with its current action | Updating judgement in response to the report; if anchors change, Rule 11 editorial review before the story is built against them |

This date is not a blanket construction freeze. It does not waive any other G-2 gate or authorise release here. A story accepted before the date can only show it as pending. At or after the due date, the actual operator publication and analyst disposition must be rechecked before accepting that action as current or completed. If publication slips, record the missing release and seek the analyst's dated disposition; do not synthesize findings or auto-resolve the trigger. **MORA cannot disclose a private toll price or close OC-ER-TOLL.**

## 8. Market judgement calls

### Toll assumption: exact proposed page wording

Replace ercot-11's universal “no price for any toll in ERCOT has been made public” claim with the scoped evidence statement below. The same assumption/contract distinction applies to ercot-00, -10 and -12. Keep the return/margin sentence bound to the existing card.

**EN:** “The reference case assumes a toll covering ‹bound: secured share› of first-year revenue for ‹bound: secured tenor› years, followed by merchant revenue. These are model assumptions; no executed toll or toll price has been verified for this reference investment. Even with that assumption, its all-equity return is ‹bound: hold IRR›, ‹bound: margin to target›. Only an executed agreement with a readable price, full terms and acceptable counterparty credit can be underwritten.”

**简体中文：**“参考情景假设一份租赁，覆盖首年收入的‹bound: secured share›，期限为‹bound: secured tenor›年，此后转为市场化收入。这些都是模型假设；本参考投资尚未核验已签租赁及其价格。即便采用这一假设，其全股权回报仍为‹bound: hold IRR›，‹bound: margin to target›。只有价格可读取、条款完整且交易对手信用可接受的已签协议，才可用于投资承销。”

The lane/price-box labels are **“Modelled toll (assumption) / 模型租赁（假设）”** and **“Contract price unverified / 合同价格未核验”**. First-year share is not the proportion of cash flow already contracted, and does not describe every year. The assumed tenor does not establish executed duration, indexation or entitlement. No fee, inferred fee, range or proxy appears; merchant exposure follows expiry. The one marker remains **Fair**, with the condition: executed price/full terms, availability deductions and credit support. An executed agreement still needs testing against the fund target; signature alone does not establish investment quality.

### Upper-panel cross-check and disagreement rule

Use **December year-end battery MW, 2021–2025, commercial operation approved**, from a frozen version of ERCOT's monthly **Capacity Changes by Fuel Type** workbook. The source definition must distinguish commercial operation from synchronization, plans, requests and reserve qualification. Preserve the original unrounded values, source units, footnote and actual sheet/row/year-cell locators. An older [2019 archive revision note](https://www.ercot.com/gridinfo/resource/2019) explains commercial-operation treatment; it does **not** prove the current workbook's definition, especially where newer charts also show synchronization-approved capacity.

Cross-check each year against the separately preserved monitor records in section 3. Compare **measure, boundary, December timestamp, commercial-operation versus synchronization status, revisions and printed precision first**. Rounded GW values and a “more than” threshold are not exact comparator measurements. Do not invent an error tolerance from “about”; record the precision-limited comparison. Where both are exact and comparable, retain the arithmetic difference as well as the underlying values.

If they disagree, retain both source records and explain the cause if established. **Do not average, splice monitor points into missing workbook years, reconstruct stock from additions or silently choose the larger number.** A substantive unresolved discrepancy keeps that numerical point and its endpoint sentence null/Example and returns the definition/claim/marker to the analyst. The narrative can still use the public, qualitative finding of rapid fleet growth. A revised, documented common series can close the gate; a source hyperlink cannot.

### Lower-panel rights and verification decision

The chosen script route is the **2025 monitor report's Figure 25 table**, not a price strategy, energy spread, revenue index or captured-return model. Its observed public values remain withheld until all section 5 conditions pass. A public report prepared for a regulator does not by itself establish republication rights.

The [ERCOT website agreement, §5](https://www.ercot.com/help/terms), opened 2 November, contains public raw-data/chart-compilation provisions; its displayed version date is 20 July 2023. That is relevant to an **ERCOT-origin** route. It is not a licence for another publisher's table and does not replace the analyst's separate price-data rights disposition. The [API/Data Portal terms](https://www.ercot.com/help/terms/data-portal) must match the actual route used. Clearance must name the source, allowed transcription/redistribution/chart use, attribution, restrictions and accepted access conditions. Do not create an account or accept new terms in this decision task.

If the later data PR proposes direct ERCOT reserve prices instead, it must document and obtain acceptance of the changed route, annual-average method, product launch treatment, corrections and vintage before replacing the signed table route. No mixing of vintages or claiming that an unscaled Example has validated the numerical data.

### Hand-opening list for the analyst before G-2

This is the complete outstanding operator/source-location checklist, including records that now open as HTML but whose manual/content disposition remains outstanding. At each item retain URL, title, exact locator, version/publication date, effective/observation date, checked date, access outcome and whether it confirms or changes the signed claim. A failed fetch is not evidence that nothing was published.

| Record that must be opened | What the analyst reads and records |
| --- | --- |
| **SRC-ERCOT-11:** [resource-adequacy page](https://www.ercot.com/gridinfo/resource) | MORA cadence, current listing/publication/version and January status; resource-capacity index. HTML opened this session; the hand-check remains. |
| [December 2026 MORA PDF](https://www.ercot.com/files/docs/2026/10/02/MORA_December2026.pdf) **and paired XLSX** linked on that page | Reporting month versus publication date, existing scenario/resource/battery definitions; not January evidence. |
| **January 2027 MORA PDF and XLSX**, once actually linked there | Actual publication/vintage, winter evening demand/supply, battery energy/availability and scenario assumptions, uncertainty and evidence for the pending analyst disposition. No guessed future filename or prefilled finding. |
| [December 2025 Capacity Changes workbook](https://www.ercot.com/files/docs/2026/01/08/Capacity-Changes-by-Fuel-Type-Charts_December_2025.xlsx) | Battery row, commercial-operation versus synchronization footnotes, units and all five December 2021–2025 observations, exact sheet/table/row/year cells and arithmetic. Link resolved; contents not read. |
| [September 2026 Capacity Changes workbook](https://www.ercot.com/files/docs/2026/10/06/Capacity-Changes-by-Fuel-Type-Charts_September_2026.xlsx) | Latest listed revisions/definition and whether it supplies the required historical series; freeze a documented vintage, not a current/planned total. Link resolved; contents not read. |
| Capacity archives [2021](https://www.ercot.com/gridinfo/resource/2021), [2022](https://www.ercot.com/gridinfo/resource/2022), [2023](https://www.ercot.com/gridinfo/resource/2023), [2024](https://www.ercot.com/gridinfo/resource/2024), **if needed** | The respective December observations usually released the following January; exact actual files and revisions. Reconcile a consistent definition before combining files. |
| **SRC-ERCOT-16:** [website agreement](https://www.ercot.com/help/terms) and [Data Portal/API terms](https://www.ercot.com/help/terms/data-portal) | Current §5/raw-data/chart provisions, attribution, access/registration, download/caching/redistribution restrictions and route-specific applicability. HTML now opens; no price-table clearance was inferred. |
| **SRC-ERCOT-14:** [ECRS notice M-D050523-01](https://www.ercot.com/services/comm/mkt_notices/M-D050523-01) and ERCOT release of **12 June 2023** | Distinguish 9 June system implementation from 10 June first procurement/operating day; product scope. Notice now opens. |
| **SRC-ERCOT-14:** [RTC notice M-F110525-04](https://www.ercot.com/services/comm/mkt_notices/M-F110525-04) and **5 December 2025** release | Go-live boundary, co-optimised clearing, ORDC retirement and affected rules; notice still returned HTTP 403. |
| **SRC-ERCOT-14:** [NPRR1282](https://www.ercot.com/mktrules/issues/NPRR1282), its **31 July 2025 PUCT report** and implemented text | Product duration obligations, approval/effective dates and exact current clauses. Page still returned HTTP 403. Do not assign a Reg-Down duration by analogy. |
| **Current reserve-duration protocols/binding document**, [2026 methodology notice M-A121925-01](https://www.ercot.com/services/comm/mkt_notices/M-A121925-01), actual methodology/requirements report named there; **EMIL NP3-783-M / Report 13036** | Binding duration requirements versus procurement quantities; precise operative clause and effective version; the 2026 methodology's historical approval date and any later changes. The current clause locator still requires completion. |
| **2027 reserve methodology:** [September 2026 board meeting](https://www.ercot.com/calendar/09142026-Board-of-Directors-Meeting), **Item 18**, then actual PUCT disposition, if published | Proposal/recommendation versus final approval, quantities and effective date. Do not infer the final ruling or conflate it with MORA. |
| **SRC-ERCOT-17:** *ERCOT Monthly, June 2026*, from [Helpful Resources](https://www.ercot.com/news/presentations/index); [June board meeting](https://www.ercot.com/calendar/06012026-Board-of-Directors-Meeting), **2 June** actions on **NPRR1309/NOGRR283** | DRRS adoption versus operating start; separate storage-participation requests and current status. A Monthly posted in July is not the June adoption date. |
| **SRC-ERCOT-18:** same June meeting, **Item 9.1, Preliminary Response to the IMM 2025 State of the Market Report**; September meeting **Item 11.1** for any later response | Operator's competing net-revenue/resource-adequacy interpretation and exact locator. Do not assume the preliminary response is the latest. |
| **SRC-ERCOT-19:** **30 May 2014**, *Operating Reserve Demand Curve and Wholesale Electric Prices*, via [2014 publications](https://www.ercot.com/news/presentations/2014) | Actual ORDC start date versus notice publication; whether H-01 can move from year to day precision. |
| [Offer-cap notice M-A120721-01](https://www.ercot.com/services/comm/mkt_notices/M-A120721-01); **SRC-ERCOT-06**, Project 52631 Item 47 adopting order | Approval 2 December 2021 versus effective 1 January 2022; cap values and subsequent current-rule status. Current order fetch failed with HTTP 402; this is not a successful recheck. |
| [Current Planning Guide](https://www.ercot.com/mktrules/guides/planning/current), **§5, Generator Interconnection or Modification**, version listed effective **1 August 2026** | Actual process, study/fee obligations, wider-network treatment and exact operative text. Index opened; its DOCX was not read. |
| Applicable current **PUCT 16 TAC §25.195, especially (f), and §25.198**, official current rule text | Network-upgrade versus direct facilities, SGIA/allowance conditions and timing. The [2025 agency report](https://ftp.puc.texas.gov/public/puct-info/agency/resources/reports/leg/2025_Biennial_Agency_Report.pdf) is an amendment locator, **not** a substitute for current rule text. Exact current rule version/clause must be retained. |
| **SRC-ERCOT-10:** [*Queued Up: 2026 Edition*](https://eta-publications.lbl.gov/sites/default/files/2026-06/queued_up_2026_edition.pdf), slides **26–27, 44, 47** | Network-upgrade description and the 24-month request-to-agreement cohort/coverage. Current automated reopening failed for document size; prior 31 October check is not relabelled as current verification. |
| **SRC-ERCOT-12:** [FERC ERCOT page](https://www.ferc.gov/industries-data/electric/electric-power-markets/ercot); **SRC-ERCOT-13** monitor ERCOT description | Non-synchronous grid, DC links and precise wholesale-market jurisdiction. FERC HTML now opens. No “no federal oversight” or whole-Texas claim. |
| **SRC-ERCOT-15:** current **Texas Business & Commerce Code §113.002 and amendments**, starting from the [enrolled 2021 act](https://capitol.texas.gov/tlodocs/87R/billtext/html/SB02116F.htm) | Current legal test, amendments, access/control scope and applicability to the relevant ownership/operator/supplier chain. The old act alone is not a current-law check; no actual investor or supplier is assessed here. |
| **SRC-ERCOT-01**, printed **p.40 inset table**, **pp.21–23, 36, 8, A-3**; **SRC-ERCOT-02 p.22**, **SRC-ERCOT-03 p.v**, **SRC-ERCOT-05 p.ii** | Visual price-table/product/year check, year-end comparator definitions and precision, normalized revenue wording, DC capability, ORDC facts and upward-product duration rows. Do not digitise Figure 17 or substitute an extracted garbled table for the visual check. |

### Map and public saturation reasoning

Use the existing **Texas outline**, sourced in `src/markets/ercot/tx-boundary.json` as **Natural Earth 50m admin-1**, plus an original labelled schematic network. No ERCOT footprint line, whole-state ERCOT fill, plant-coordinate claim or solved power flow. DC links represent existing connections; their dashed symbol has an explicit legend. This is the approved GAP-ERCOT-MAP treatment, not a newly sourced boundary.

The pinned view's `grades.saturation.reason`, dated **1 November**, already says that public 2025 monitoring evidence reports rapid battery entry, lower reserve prices and lower battery revenue per kW. Its evidence key is `imm-som`. The thesis and action also already use the public monitor. **No saturation edit remains to be implemented by this session.** Use SRC-ERCOT-01 pp.21–23/40, with SRC-ERCOT-02's prior-year revenue discussion where needed; retain the narrower causal reading that entry, procurement and other changes jointly shaped income. Do not copy the subscription index, its percentage, a private source's figure or the old card's toll band. Facts and interpretation remain separate, with the tight-year/load-growth counter-explanation visible.

**Least-confident decision:** whether one selected current/frozen capacity workbook can reproduce all five commercial-operation year-end observations on a consistent definition. The links are established; the sheet, cells, definition footnote and revision history are not. Therefore the upper quantitative layer remains blocked rather than being filled with mixed-vintage monitor approximations.

**Completion boundary:** this record contains the Rule 11 pass, all open ERCOT gaps, proposed field and binding contracts, chart states, reuse, timing and market decisions. Only this evidence file is written in the repository. No branch, `src/`, view, dataset, fixture, shared register, PR or release is changed.
