# Japan G-2 build evidence

Checked 5 November 2026. Authority: [signed storyboard](japan-storyboard.md), especially §§2, 8, 9 and 12. This is build evidence, not a release decision. All three stories remain `released: false`; the analyst's joint walkthrough and a separate release PR are still required.

## 1. Rule 11: passed

Read current `origin/main`, fetched on 5 November 2026, at **`13dacf0e1e3874bd888452f694fc7c90240a97aa`**, containing G-1 PR #160. Read `HOME_BRIEFING` through the repository's ordinary Node entry, the three market modules and the three published views. The isolated checkout has its own Git directory and does not share another worktree's index or hooks.

| Area | Lens | Call | Play | Hours | Route / stage | Obligation / term | Evidence | Trigger / expected |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `jp_tokyo` | `infraFund` | `opportunistic` | `jp-tokyo-ltda-6h` | 9 | `ltda` / `operating` | 6 h / 20 years | `fair` | `jp-tokyo-ltda-round-4-bids` / 2027-02-03 |
| `jp_kyushu` | `infraFund` | `opportunistic` | `jp-kyushu-ltda-6h` | 9 | `ltda` / `operating` | 6 h / 20 years | `fair` | `jp-kyushu-ltda-round-4-bids` / 2027-02-03 |
| `jp_hokkaido` | `infraFund` | `opportunistic` | `jp-hokkaido-ltda-6h` | 9 | `ltda` / `operating` | 6 h / 20 years | `fair` | `jp-hokkaido-ltda-round-4-bids` / 2027-02-03 |

All stop-rule fields match storyboard §2. The shared-pack fallback is not triggered. Review tuples keep `on: '2026-11-05'`, with independent per-area guards. Financial results are read afresh: the design values below differ slightly from G-1's authoring reference, without any call, route, stage or duration change. They are never transcribed into page prose.

Confidentiality inputs `local-data/markers.json` and `fingerprint-key.txt` were restored only to the ignored local directory. `npm run guard:install` and `npm run guard:staged` ran successfully before the first commit. Public publisher labels and all proposed branch names were checked against the marker list; no marker contents are reproduced here.

## 2. Gaps and build treatment

| ID | Result at this build | Treatment |
| --- | --- | --- |
| BUILD-JP-02 | **Unresolved.** `designEconomics()` returns value, returns, coverage and term, but no design build cost in local currency. The operating acquisition reference has `workableBuildPerMW: null`; its construction budget is zero for an operating case and is not the design's build cost. | Bind build cost to `null`; withhold the build-cost bar and discount band. Never reconstruct cost or repurpose an operating-case zero. See §7. |
| GAP-JP-FUNDING | **Funding mechanism located.** [OCCTO's LTDA explanation][FUNDING] explicitly connects the auction to retailers' capacity contributions and consumers. [Contribution briefing][CONTRIBUTIONS], printed pp. 5, 39–41, explains the flow and includes LTDA in contribution calculations. The accompanying FY2027 manual was still described as a consultation draft in that briefing. | The source envelope cites both; the funding leg may be solid for the mechanism. No assertion about a particular award's receipts, or the finality of the draft manual. Keep the approved Fair marker and exact copy. |
| GAP-JP-FC | SRC-JP-14 reopened: [reinforcement paper][FC], printed p. 4, shows converter expansion from 2.1 to 3.0 GW, completion end-FY2027. [OCCTO annual report][FREQUENCY], printed pp. 37 and 40 (PDF pp. 41 and 44), explicitly gives east 50 / west 60 Hz. | Fixed-vintage rules and plan; planned layer dashed. Frequency boundary remains an approximate band. No site locations. |
| GAP-JP-FC2011 | METI's reform / white-paper pages returned HTTP 403; no newly opened transfer record for March 2011. | Qualitative outage pattern, no lost-supply or transfer quantity. CL-JP-18 remains a labelled interpretation. |
| GAP-JP-RETURN | Both [the cited METI PDF][RETURN] and its [meeting index][RETURN-INDEX] returned HTTP 403 on 5 November 2026. | Retain the signed Fair marker and qualitative regulated-return wording; show no numeric regulated-return value. |
| GAP-JP-CHARGECTRL | The [notice][CHARGING] and [original operator attachment][CHARGING-TERMS] were opened. Printed p. 4 says estimated restriction hours/rates are supplied in each connection-study answer; pp. 7–8 describe control. This does not supply an asset's charging window. | Hokkaido strip remains an unscaled Example. No system names, sites or asset-specific hours; actual connection answer still required. |
| GAP-JP-REFORM-WHY | METI reform policy page and 2024 white-paper reform page returned 403. | Preserve G-1's OCCTO rationale and accepted interpretation; do not add the Cabinet decision to page copy. |
| GAP-JP-CERT | METI battery certification index returned 403. | No public confirmation claimed. Supplier record stays authoring-only; no supplier identity or certification count enters story data or the page. |
| GAP-JP-HOLDERS | Not investigated by naming or counting holders. | No names, counts, sites or unit list. SRC-JP-02 does not enter runtime data. |
| GAP-JP-CURTAIL | Daily workbook deliberately not opened for page use. | Only the repository's anchored monthly days and each area's own window. No hours, MW, revenue conversion or cross-area ranking. |
| GAP-JP-TERM | Actual operating awards' terms remain diligence. | Keep twenty years in principle, as ruled at G-1. No optional longer term or model change. |

Reopened 5 November 2026: SRC-JP-03 (PDF **and** meeting index: 403); SRC-JP-12 (all three registered notice URLs); SRC-JP-13 (the three cap pages, Tokyo deposit page, Kyushu contribution flow and Hokkaido access index); SRC-JP-14 (PDF p. 4); SRC-JP-15 (operator page and expansion PDF p. 1); SRC-JP-17 (index and linked main-auction results, printed p. 10, area table). [New-link operator page][LINK] confirms operation began in March 2019, rather than merely repeating the 2018 report's expectation. Source locators below are retained per value; no downloaded source document is shipped.

## 3. Fixed-vintage field inventory

`N` denotes `src/markets/jp/data/storyEvidenceValues.js` national values; `R` denotes its regional values keyed `tokyo`, `kyushu`, `hokkaido`. Provenance is separate in `storyEvidenceProvenance.js`, loaded only when a reader opens a source disclosure. Every leaf has source ID, primary URL, precise locator, unit, date semantics, check date **2026-11-05**, statement type, and public-reuse basis. Only small factual records and links are reused, not a report, image, table facsimile or daily dataset. Source titles retain their original language.

| Field / storyboard token | Value at check | Source and primary locator | Unit / date semantics / statement type |
| --- | --- | --- | --- |
| `N.eastFrequency`, `N.westFrequency` | 50; 60 | SRC-JP-14, [annual report][FREQUENCY], printed pp. 37, 40, frequency summary / standard table | Hz; report-vintage system standard; rule |
| `N.converterYear` | 2027 | SRC-JP-14, [reinforcement paper][FC] p. 4, Tokyo–Chubu row | fiscal year-end, **not calendar-year end**; official plan |
| `N.converterCurrentMW`, `N.converterPlannedMW` | 2100; 3000 | SRC-JP-14, same row, 210 / 300 ten-thousand kW, normalized to MW | MW; existing rating / official plan |
| `N.h01Year` | 2016 | SRC-JP-05, [About OCCTO][REFORM], full retail liberalisation | year; event |
| `N.earthquakeDate` | 2011-03-11 | H-JP-02; SRC-JP-06 [white paper][OUTAGES], Great East Japan Earthquake context | calendar day; event |
| `N.outageDate` | 2011-03-14 | SRC-JP-06, §2(1), first planned outage | calendar day; event |
| `N.earthquakeMonth`, `N.earthquakeYear` | 2011-03; 2011 | Same event, precision-preserving projections | month / year; event |
| `N.reformStep1`, `N.reformStep2`, `N.reformStep3` | 2015-04; 2016-04; 2020-04 | SRC-JP-05, [About OCCTO][REFORM], three reform steps | month; event |
| `N.capacityMarketYear`, `N.ltdaYear` | 2020; 2023 | SRC-JP-01 [guidelines][GUIDELINES] pp. 4–5, introduction | fiscal year; event, OCCTO's account |
| `N.supplyCrunchDate`, `N.supplyCrunchYear` | 2022-03; 2022 | SRC-JP-01 p. 4, eastern supply tightness | month / year; event |
| `N.awardTerm` | 20 | SRC-JP-01 p. 10, application period; p. 68, battery form | years in principle; rule; independently equals model term |
| `N.obligationHours` | 6 | SRC-JP-01 p. 13, continuous battery operation | hours; rule; independently equals all three model floors |
| `N.clawbackShare` | nine-tenths / 九成 | SRC-JP-01 p. 46, actual other-market profit | bilingual word pair; rule, **not** model retention |
| `N.nextRound` | Round 4 / 第四轮 | SRC-JP-01 pp. 9–10 | round identifier; official plan |
| `N.lithiumIonPoolMW` | 400 | SRC-JP-01 p. 10 and pp. 35–36 | MW lithium-ion pool, no awards beyond cap; rule |
| `N.bidOpenDate`, `N.bidCloseDate` | 2027-01-27; 2027-02-03 | SRC-JP-01 p. 9, schedule | planned calendar days; official plan; close date agrees with trigger |
| `N.fitDate` | 2012-07 | SRC-JP-08 [operator history][KY-HISTORY], FIT start | month; event |
| `N.suspensionDate` | 2014-09-25 | SRC-JP-08, paused mainland connection replies | calendar day; event |
| `N.firstCurtailmentDate` | 2018-10-13 | SRC-JP-08, first output control **on the Kyushu mainland** | calendar day; event |
| `N.transferTripDate` | 2026-04-01 | SRC-JP-10 [operator notice][TRANSFER], operation start | calendar day; event, no transfer MW |
| `N.blackoutDate`, `N.blackoutMonth` | 2018-09-06; 2018-09 | SRC-JP-07 [blackout report][BLACKOUT] pp. 25, 59 | day / month; event, no plant count |
| `N.newKitahonYear` | 2019 | SRC-JP-15 [operator page][LINK], March 2019 operation start | calendar year; event, confirmed commissioning |
| `N.linkYear` | 2027 | SRC-JP-15 [expansion summary][LINK-PLAN] p. 1, March 2028; SRC-JP-14 p. 4, end-FY2027 | fiscal year-end; official plan |
| `N.linkCurrentMW`, `N.linkPlannedMW` | 900; 1200 | SRC-JP-15 operator page and expansion summary; existing total plus planned additional 300 MW | MW; existing / official plan; never an award or study cap |
| `N.chargingControlSystems`, `N.chargingControlNotice` | 27; 2026-04-10 | SRC-JP-11 [notice][CHARGING], before/after table and notice date; **no individual system strings** | count / notice day; rule |
| `R.*.studyCap`, `R.*.studyCapDate` | Tokyo 11; Kyushu 8; Hokkaido 5; each 2026-08-01 | SRC-JP-13: [Tokyo][TK-CAP] article body; [Kyushu][KY-CAP] application / cap notice; [Hokkaido][HK-CAP] article body | concurrent studies per applicant / effective day; rule, **not available capacity** |
| `R.tokyo.outputControl.window`, `.months[*].month/.days` | 2026-03–2026-05; March 5, April 6, May 9 | SRC-JP-12, [March][TK-MARCH], [April][TK-APRIL], [May][TK-CURTAIL], §1 event-day lists, independently matching `JP_REGIONS.tokyo.curtailment.months` | month / days; observed; own window |
| `R.kyushu.outputControl.window`, `.months[*].month/.days` | 2026-01–2026-03; January 12, February 14, March 24 | SRC-JP-12, [Kyushu notice][KY-CURTAIL], §1, monthly breakdown | month / days; observed; own window |
| `R.hokkaido.outputControl.window`, `.months[*].month/.days` | 2026-03–2026-05; March 7, April 11, May 18 | SRC-JP-12, [March][HK-MARCH], [April][HK-APRIL], [May][HK-CURTAIL], §1 event-day lists, independently matching `JP_REGIONS.hokkaido.curtailment.months` | month / days; observed; own window |
| `N.researchCheckDate`; source-envelope `checkedOn` | 2026-11-05 | This build's check / each source's recorded check; never a publication or effective date | check day; observed metadata |
| H-JP-01–06 and regional node dates | The fields above, with H-JP-06's future bid window dashed | SRC-JP-01/05/06/07/08/10/11/13, as individually listed | event versus official-plan dates; interpretation remains separate |

The national source of an event is stored once; multiple date precisions are explicit projections of that event. A missing or unchecked record resolves to `null`, not zero or NaN. Neither the raw zone notes nor company/project source entries are imported into fixed-vintage story data.

## 4. Bound-field map

`b = HOME_BRIEFING`, `m = row.market`, `key = row.id + '/' + row.play.id`. Acquisition rows are found by **both** market id and play id, then decoded with existing `expandReferences(b.acquisitions.infraFund, b.acquisitionReferenceData)`. The projection's compact arrays are never treated as objects or recomputed by the story.

| Token / owner | Formatter | Missing behaviour | Tokyo / Kyushu / Hokkaido at check |
| --- | --- | --- | --- |
| `call`: `ui.CALLS[row.call]` | Existing bilingual call pair | Hide affected sentence; current-case copy | Situational / 择机投入, all three |
| `playName`: `ui.playTitle(row.play,row.stage)` | Existing play-title function | Same | Each area's LTDA play, nine-hour build / six-hour obligation, operating |
| `cardFigures`: decision-panel metrics for `row`, **`row.investment.holdIRR`**, not the legacy design-grid return | `ui.returnPct`, `ui.marginText`; opening uses the existing shell card | Same; no substituted engine case | Base all-equity IRR as the decision panel prints it: **4.0% / 4.1% / 3.8%**; margins **−3.15 / −3.08 / −3.34 pp** from the same UI helper. Owner rechecked during the content binding; this corrects the initial design-grid reference in the evidence layer |
| `nextAction`: `row.play.action.text` | Existing pair, unchanged | Hide affected sentence | Each area's Round 4 action; no holder names inserted |
| `playEvidence`: `row.evidence` | Shared `MARKERS` | No fabricated marker | `fair` / `fair` / `fair` |
| `areaName`, `areaSlug`: `m.manifest.name/slug` | Existing pair / slug | Hide affected sentence or link | `japan-tokyo` / `japan-kyushu` / `japan-hokkaido` |
| `regionalSentence`: content table keyed by id | Exact approved pair | Hide affected sentence | Storyboard §5.1, each area's own |
| `playDuration`: `row.play.hours` | Integer hours | Refuse pack if tuple mismatch | 9 / 9 / 9 |
| `obligationHours`: `m.comparison.economics.ltda.minDurationHours` | Integer hours | Hide sentence; consistency test fails on disagreement | 6 / 6 / 6 |
| `awardTerm`: same `.years` | Integer years | Same | 20 / 20 / 20 |
| `retainedShare`: `JP_LTDA_MERCHANT_RETENTION` | Percentage | Hide affected sentence | 10% / 10% / 10%; model input, separate from clawback rule |
| `securedShare`: `b.plays[key].econ.secured` | Percent, one decimal | Hide affected sentence | 95.3% / 94.8% / 95.3% |
| `securedYears`: same `.securedYears` | Integer years | Same | 15 / 15 / 15 |
| `designValue`: same `.value` | Existing `fmtUSD`; separate USD-per-MW label | Hide affected sentence and label | −386,417 / −376,477 / −413,765 USD per MW |
| `purchaseCeiling`: decoded acquisition `.referenceCases.find(key==='base').pricePerMW` | JPY, million per MW; accessible table retains exact bound value | Hide sentence / chart tick; never zero | 247,154,469 / 249,148,416 / 241,979,702 JPY per MW |
| Cautious tick: same, `key==='cautious'` | Same | Omit missing tick and table value | 140,494,133 / 141,665,182 / 136,996,814 JPY per MW |
| Favourable tick: same, `key==='favourable'` | Same | Same | 254,940,357 / 259,323,875 / 249,449,090 JPY per MW |
| `purchaseTarget`: each matching reference case `.targetReturn` | Percent; own case tooltip and table | Omit target; no inferred hurdle | Base 6.619% / 6.633% / 6.620%; cautious 6.598% / 6.609% / 6.598%; favourable 6.763% / 6.791% / 6.764% |
| `buildCostPerMW`: BUILD-JP-02, no eligible public result field | JPY per MW if model owner later exposes it | **null for all three; bar and band withheld** | null / null / null |
| `triggerDate`: `b.triggers[row.next].expected` | Calendar day, precision-preserving pair; only date, never label | Hide affected sentence | 2027-02-03 / 2027-02-03 / 2027-02-03 |
| Other evidence tokens | Their §3 records; calendar, month, fiscal-year-end, unit or word-pair formatter | Hide only affected sentences; signed missing-evidence copy | §3 |

No `thesis`, `why`, `because`, `despite` or trigger-label text is copied. No view, rate, weight, fixture, snapshot, model result or acquisition assumption is changed.

## 5. Chart-JP-PRICE contract

One parameterised chart, three independently bound area rows. JPY per MW is its only numeric axis. Cautious, reference and favourable ticks use their own case price, target return and basis. The new-build design value remains a separate USD-per-MW label, outside the JPY drawing and table columns. No award price, press range or observed transaction is plotted.

If the model owner later exposes a valid positive design build cost, the render-time difference is `buildCostPerMW - base.pricePerMW`, explicitly a price difference, not a return. Until then, both the bar and band are absent and the approved missing-financial copy is shown. Missing acquisition values suppress their own rows/ticks; no zero fills. The accessible table carries area, case, JPY price, target return and build cost / missing state. Comparison is a local teaching toggle only, with one JPY scale and the reader's area highlighted.

## 6. Reuse extract

Reuse Poland's per-row guards, missing-state approach and ordinary story contract; PJM's separate value/provenance modules and disclosure-time import; GB/CAISO's complete additional-static-graph plus lazy-CSS budget. Reuse shared SVG, symbol and control primitives without editing them. Compose eleven identical shared shots and three area shots into each ordinary fourteen-shot contract. Only the registry and budget test may change outside Japan's own story files and new Japan tests.

Map source: `src/markets/jp/jp-zones.json`, Natural Earth admin-1, public domain. The scenes layer records its exact Git blob and screen-space simplification. Ignore narrative zone notes, draw no sites, and outline the reader's area. Observations solid; plans dashed; teaching paths tagged Example. Each output-control panel keeps its own window and never ranks areas.

## 7. Judgement calls and validation handoff

1. **BUILD-JP-02:** propose a separate model-owner change exposing an existing run's gross design build capex in local currency and its basis alongside `designEconomics` (for example a nullable `buildCostPerMW` plus currency/basis), using the same variant and hours. That change is outside this build; no conversion or reconstruction belongs in the story. The analyst can walk through the withheld chart state now.
   The content-layer owner audit also inspected `row.investment.capexPerMW`: it is **317,937,817.132634 JPY per MW for all three** at this check, a **ready-to-build reference budget** (`investmentMetrics` → `reference.assumptions.buildBudget`), not an exposed gross design build-cost field. `referenceInputs()` includes contingency and grid allowance in that budget; `referenceTerms().buildPerMW` is zero for the operating acquisition cases. Neither is silently substituted for the §8 design-cost owner. An analyst could separately choose a reference-budget comparison, but that would change the signed chart's basis.
2. Funding mechanism evidence is stronger than at G-1; keep signed copy and Fair marker. The manual consultation status is not silently promoted to final rules.
3. Charging-control mechanism is now located, but actual restriction hours remain asset-specific. Keep the signed unscaled Example, not a quantitative availability claim.
4. Primary capacity results support Tokyo as largest by **contracted capacity**, rather than a demand time series. Preserve the approved wording and this recorded limit; no new demand quantity is displayed.
5. Layer checks and exact-head counts/timings are recorded in the local validation ledger and final reuse report when actually run. This memo does not assert build, budget or browser success in advance. No PR, push, release or deployment is authorised by this handoff.

[GUIDELINES]: https://www.occto.or.jp/assets/260902_boshuyoukou_long_2026.pdf
[REFORM]: https://www.occto.or.jp/en/about_occto/about_occto.html
[OUTAGES]: https://www.fdma.go.jp/publication/hakusho/h23/cat-2/5/579.html
[BLACKOUT]: https://www.occto.or.jp/assets/iinkai/hokkaido_kensho/files/181219_hokkaido_saishu_honbun.pdf
[KY-HISTORY]: https://www.kyuden.co.jp/company/history/energy/renewableenergy/supply.html
[TRANSFER]: https://www.kyuden.co.jp/td/news/notice/260401.html
[CHARGING]: https://www.hepco.co.jp/network/info/info2026/1253068_2078.html
[CHARGING-TERMS]: https://www.hepco.co.jp/network/info/info2022/__icsFiles/afieldfile/2022/12/09/cc_grid_storage_battery.pdf
[TK-CAP]: https://www.tepco.co.jp/pg/consignment/workshop/information/renewable/adjustment/20260724_01.html
[KY-CAP]: https://www.kyuden.co.jp/td/application/electric-power-generation-business/application.html
[HK-CAP]: https://www.hepco.co.jp/network/info/info2026/1253145_2078.html
[TK-CURTAIL]: https://www.occto.or.jp/news/012583.html
[KY-CURTAIL]: https://www.occto.or.jp/news/012277.html
[HK-CURTAIL]: https://www.occto.or.jp/news/012578.html
[TK-MARCH]: https://www.occto.or.jp/news/012041.html
[TK-APRIL]: https://www.occto.or.jp/news/012254.html
[HK-MARCH]: https://www.occto.or.jp/news/012035.html
[HK-APRIL]: https://www.occto.or.jp/news/012240.html
[FC]: https://www.occto.or.jp/assets/iinkai/kouikikeitouseibi/cost/2024/files/cost_40_01_01.pdf
[FREQUENCY]: https://www.occto.or.jp/en/assets/information_disclosure/annual_report/files/2023_annualreport_240131.pdf
[LINK]: https://www.hepco.co.jp/network/stable_supply/efforts/north_reinforcement/index.html
[LINK-PLAN]: https://www.hepco.co.jp/network/info/2023/__icsFiles/afieldfile/2023/09/01/230901.pdf
[RETURN]: https://www.meti.go.jp/shingikai/enecho/denryoku_gas/jisedai_kiban/stable_power_supply_wg/pdf/006_s02_00.pdf
[RETURN-INDEX]: https://www.meti.go.jp/shingikai/enecho/denryoku_gas/jisedai_kiban/stable_power_supply_wg/006.html
[FUNDING]: https://www.occto.or.jp/capacity-market/decarbonation_know/
[CONTRIBUTIONS]: https://www.occto.or.jp/assets/news/capacity-market/261021_youryou_kyoshutsukin_setsumeikai.pdf
