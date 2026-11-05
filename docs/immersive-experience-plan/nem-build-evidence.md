# NEM build evidence and decisions

Prepared: 5 November 2026, for the analyst's G-2 review.
Branch: `claude/nem-story-g2-dc1e93`, cut from `claude/nem-storyboard-65e619` at `2926e71` (the signed-off G-1 script; not yet on `main`).
Script: [NEM storyboard](nem-storyboard.md), signed off at G-1 on 5 November 2026 as drafted.
Authority: the G-2 build brief. This file authorises no release: `released` stays `false`.

**Result: Rule 11 passes, the story is built and unreleased, and the rights switch is off.** All thirteen shots render in both languages from live case fields and dated records. AEMO's price-derived layers (`nem-05`, `nem-06`, `nem-07`) draw the unscaled Example; the observed records exist in the repository but no runtime module imports them, so none reaches the browser. The story chunk is 26.8 KiB gzip, and its additional JavaScript graph is 38.96 KiB of the 40 KiB cap (43.92 KiB with lazy styles; see §6).

## 1. Rule 11 verdict

**PASS** for the infrastructure-fund lens. The live view is the committed view store and the briefing model at `2926e71`, evaluated read-only on 5 November 2026 (`opportunities('infraFund')`).

| Anchor | Live value | Script (`reviewedAgainst` and §1) | Verdict |
| --- | --- | --- | --- |
| Lens | `infraFund` (default) | `infraFund` | Match |
| Call | `opportunistic`, Situational / 择机投入 | `opportunistic` | Match |
| Play | `nem-ltda-4h`, Tender award · 4h · operating | `nem-ltda-4h` | Match |
| Route, stage | `ltda`, `operating` | `ltda`, operating | Match |
| Duration | 4 | 4 | Match |
| Evidence | `fair` | Fair | Match |
| Next trigger | `nem-successor-scheme-first-round`, expected 2027-12 | same | Match |
| Next action | "Screen operating assets holding a tender award; pay no more than build cost, …" | same (bound, CF-NEM-01 open) | Match |

The content contract carries `reviewedAgainst: { playRef: 'nem-ltda-4h', hours: 4, call: 'opportunistic', on: '2026-11-05' }`. A changed call, play or duration flags the story as stale and the pack falls back to the research dialog (`storyMatches`, `isStale`; tested).

## 2. Gaps and blockers

| Item | State at G-2 | Effect on the page |
| --- | --- | --- |
| GAP-NEM-QED | Built as an analyst-entered, fixed-vintage module (`src/markets/nem/data/`), QED Q3 2026 vintage. No catalogue dataset, connector or ETL | Volumes, shares and counts bind now; price-derived values wait for rights |
| GAP-NEM-CIS | Built: four announced dispatchable rounds plus Tender 10 (being assessed), and the register count by stage | `nem-04` round cards; `nem-11` dated count |
| **Price-data rights** (G-2 condition) | **Open. Switch off** (`rights.mode: 'example'`) | `nem-05` and `nem-06` charts draw the unscaled Example; `nem-07` region tags read "Example"; the copy sentences that would print a spread are hidden (§8) |
| CL-NEM-19 | **Sourced for its revenue fact** (SRC-NEM-20, AEMO QED Q4 2019 §1.4.6 p. 19: energy arbitrage was 12% of battery market revenue in Q4 2019; FCAS drove 2019 revenue). The 2016-to-entry link stays an editorial reading | The "to be confirmed" label is removed from the 2016 node (§8). `nem-03` stays Fair |
| GAP-NEM-CLAUSES | Open (proforma CISA settlement clauses not extracted) | `nem-10` keeps "clauses pending"; Fair |
| GAP-NEM-OPERATING, GAP-NEM-TOLL | Open (analyst items) | Bound count and dashed toll route only |
| Register scope | New finding: the register's 17 battery agreements include **2 in the WEM** (15 in the NEM) | `nem-11` prints the register-wide 17, as signed; G-2 question |

The one attempt at CL-NEM-19: a search of AEMO and AEMC sources, then the QED Q4 2019 report read in the browser. The script's alternative (keep the label or drop the line) is therefore not needed; the analyst may still prefer to keep the label (G-2 question).

## 3. Data module fields

Owner: `src/markets/nem/data/`. Three files, so the switch can hold price data out of the bundle:

| File | Imported by | Holds |
| --- | --- | --- |
| `storyEvidenceValues.js` (`NEM_STORY_VALUES`) | story, bindings, scenes (runtime) | `rights` switch; source list (title, URL, check date); `qed` volumes and shares; `cisa` terms; `tenders`; `register`; `history` node dates; `teaching.powerMW`. Price-derived `qed` fields are `null` |
| `storyEvidenceProvenance.js` | lazy, on opening a source disclosure | Per-value source, locator, unit, vintage, check date, arithmetic, kind, rights. Quotes no price value |
| `storyEvidenceObserved.js` (`NEM_STORY_OBSERVED`) | **tests only** | NEM and WEM spreads (Figures 56, 107), report text values, regional spreads, Figure 15 time-of-day prices (288 × 2), and their own locators |
| `storyEvidence.js` | tests only | All three combined, for validation |

Every stored value was re-read in the browser on 5 November 2026 from aemo.com.au, asl.org.au and dcceew.gov.au (workbook unzipped and PDFs parsed in the page; no browser navigation to a PDF). All matched the G-1 records. Workbook sha256 `160155d2…f778e5`.

| Field | Value | Locator |
| --- | --- | --- |
| `qed.quarters` | 2024-Q3 … 2026-Q3 (nine) | Fig. 56 col I |
| `qed.nemDischargeMW` | 85.7, 89.8, 97.8, 161.6, 214.5, 267.9, 359.4, 475.6, 680.0 | Fig. 56 col J |
| `qed.wemDischargeMW` | 13.4, 34.8, 35.2, 53.0, 80.3, 104.6, 142.6, 128.9, 160.0 | Fig. 107 col L |
| `qed.dailyChargeGWh` / `eveningDischargeGWh` | 13.4 / 10.9 (3.7 / 3.2 a year before) | Report p. 4 |
| `qed.priceSettingShare` | 0.48 (0.18) | Report p. 4; Fig. 23 sum 23.6% + 24.3% |
| `qed.fcasRevenueShare` / `fcasVolumeShare` | 0.023 / 0.75 | Report p. 38; Fig. 71 |
| `cisa` | 0.9, 0.5, 15 years | Guidelines Table 5, p. 13 |
| `tenders` | NSW pilot 22 Nov 2023, 6, 1,075 MW, MWh not stated; SA–VIC pilot 4 Sep 2024, 6, 995 MW / 3,626 MWh; Tender 3 16 Sep 2025, 16, 4,130 MW / 15,370 MWh; Tender 8 24 Jun 2026, 15, 4,200 MW / 16,100 MWh; Tender 10 bids closed 18 Aug 2026, results indicatively Dec 2026 | DCCEEW closed tenders; ASL; DCCEEW CIS page |
| `register` | correct as at 23 Oct 2026: 17 battery agreements, 0 operating, 9 construction, 7 development, 1 no stage, 2 in the WEM | Register, all five pages, every entry read |
| Observed (withheld) | NEM spread 339.01 … 59.16; WEM 72.26 … 2.18; regional latest NSW 51, QLD 68, VIC 58, SA 65; year before NSW 84, SA 147; Figure 15 two 288-point series | Fig. 56 col K; Fig. 107 col M; report p. 39; Fig. 15 rows 11–12 |

## 4. Bound-field map, every shot

Financial tokens read `R` (the market row), `B` (`HOME_BRIEFING`) or `E` (the evidence values). Values at check, 5 November 2026.

| Shot | Token → field | Value at check |
| --- | --- | --- |
| nem-00 | `call` → `R.call` via `CALLS`; `play` → `playTitle(R.play, R.stage)`; `nextAction` → `R.play.action.text`; marker → `R.evidence` | Situational; Tender award · 4h · operating; the action text; Fair |
| nem-01 | none (map: ASSET-NEM-REGIONS) | — |
| nem-02 | node dates → `E.history.H-NEM-0n.when` | 1998; 2016; 2017–2021; 2021; 2023–2027; Outlook |
| nem-03 | `batteryServiceVolumeShare` → `E.qed.fcasVolumeShare`; `serviceRevenueShare` → `E.qed.fcasRevenueShare`; `teachingPower` → `E.teaching.powerMW` | 75%; 2.3%; 100 |
| nem-04 | `floorSupportShare`, `ceilingSharingShare`, `supportTermMax` → `E.cisa.*`; round cards → `E.tenders` | 90%; 50%; 15 |
| nem-05 | `daytimeChargeLatest`, `eveningDischargeLatest`, `…YearBefore` → `E.qed.dailyChargeGWh`, `eveningDischargeGWh` | 13.4 GWh; 10.9 GWh; 3.7 GWh; 3.2 GWh |
| nem-06 | `dischargeTwoYearsBefore`, `dischargeLatest` → `E.qed.nemDischargeMW[0]`, `[8]`; `spreadTwoYearsBefore`, `spreadLatest` → `E.qed.nemSpreadAUDPerMWh` (**null, switch off**); `batteryPriceSettingShare` → `E.qed.priceSettingShare.latest` | 86 MW; 680 MW; withheld ($339/MWh; $59/MWh when on); 48% |
| nem-07 | `spreadNswLatest` → `E.qed.regionalSpreadAUDPerMWh.latest.NSW1` (**null, switch off**) | withheld ($51/MWh when on) |
| nem-08 | `playDuration` → `R.play.hours`; `bestDuration` → `B.grids.nem.byRoute.ltda.best`; `merchantBest` → `…mer.best`; `designDurations` → `B.grids.nem.hours`; `designLine` → `B.build[nem].line`; route rows → `B.grids.nem.cells` | 4; 4; 6; 1 / 2 / 4 / 6 / 8; "the NEM: Tender award at 4h, +$36k/MW." |
| nem-09 | `floorSupportShare`, `ceilingSharingShare` → `E.cisa.*` (and the collar's two slopes); `securedShare` → `R.econ.secured`; `securedTenor` → `R.econ.securedYears` | 90%; 50%; 60%; 15 |
| nem-10 | `securedShare`, `securedTenor` | 60%; 15 |
| nem-11 | `playDuration`; `holdReturn` → `R.econ.hold`; `targetReturn` → `R.econ.test.target`; `operatingTarget` → `R.investment.operatingPurchase.targetReturn`; `operatingCeiling` → `…maxPricePerMW`; `buildCapex` → `R.investment.capexPerMW`; `registerDate`, `awardedBatteryAgreements`, `awardedBatteriesOperating` → `E.register.*` | 4; 7.4%; 10.6%; 10.1%; AUD 1.08m/MW; AUD 1.33m/MW; 23 October 2026; 17; none / 无 |
| nem-12 | `nextTrigger` → `B.triggers[R.next]` label · expected; `nextAction`; `counterpoint` → `R.decision.counterpoint`; dated steps → `E.tenders` Tender 10 and H-NEM-06 | "First procurement round under the successor …, indicatively late 2027 · December 2027"; action; counterpoint |

Also bound but not printed in copy: `entryRoute` (`STAGE_WORD`), `where`, `decisionReason`, `playEvidence`. A missing value hides the sentence that would print it, in both languages; a zero operating count renders "none" / 无.

## 5. Chart contracts as built

**Chart-NEM-SPREAD** (`src/markets/nem/story/chart.js`, `spreadChart`). Two panels on one shared quarter axis, no dual axis: bars for the NEM spread above, a line for average discharge below. "Spread" and "Battery output" set the focused panel; "WA beside it" is a separate switch adding thin WEM lines to both panels and the caption line on what pays a battery in each market. Observed mode adds $ and MW ticks and a table view (`<details>`, for phones). Example mode (now): generic falling bars and a rising line, no ticks, no values, no table; tagged "Example · unscaled; the observed layer waits for the price-data review". Not drawn in either mode: forecast, model path, award floor or ceiling, revenue per MW, any "record" label.

**Chart-NEM-DAY** (`dayChart`). Two solid lines on one $/MWh axis (observed: 288 five-minute points per quarter, market time); daylight-charging (10:00–16:00) and evening-peak (16:00–21:00) bands from SRC-NEM-05 p. 4; "Midday" / "Evening" highlight a band, "A year earlier" switches on the 2025 line. Example now: two hand-drawn hourly shapes, no price axis.

**nem-09 collar** (`collarDiagram`). Unscaled, tagged Example; no axis values in any state (tested). The below-floor slope is 1 − 0.9 and the above-ceiling slope 1 − 0.5, the only bound inputs. Floor, ceiling and payment cap are labelled "(not published)" and sit at Example positions.

**Turning the observed layers on** (only after the analyst's price-data review): in `storyEvidenceValues.js` set `rights.mode: 'observed'` and `clearanceRef`; fill the four `qed` price fields from `NEM_STORY_OBSERVED`; in `storyPack.js` build scenes with `makeScenes({ observed: NEM_STORY_OBSERVED })`; move the observed locators into the shipped provenance; update the data test's "switch off" assertions. The renderers are tested with the observed records today (`tests/nem-story-scenes.test.js`).

## 6. Reuse extract

| Reused unchanged | From |
| --- | --- |
| Contract, shell, place, registry pattern, kit (`isoStage`, `toggleGroup`, `s`) | `src/experience/story/` |
| `WA_ISLAND_MAP` (coast, WA, NT, SWIS outlines, Perth and Adelaide anchors), `k-map` styles, "No link" treatment | `src/markets/wa/story/geo.js`, `src/styles/story.css` |
| WA's 2006 timeline node text | `src/markets/wa/story.js` (copied verbatim as `waNode`) |
| Pack, bindings, evidence-drawer, scenes-test patterns | PJM (`storyPack.js`, `storyBindings.js`, `story/evidence.js`) |
| Operating-price card fields and wording | CAISO precedent; `projectFacts` |

New: the region asset (Natural Earth admin-1, 2 KB of paths), the two-file rights split (observed records never bundled), sentence-level hiding of missing values, the three charts, and the scene compositions. No shared kit, shell or contract change was needed.

Bundle (exact-head build, §7): `story-nem` chunk 26.8 KiB gzip. Additional JavaScript graph (pack + shell + kit symbols + WA geo + playTitle) 38.96 KiB against the 40 KiB cap, measured as Romania and Finland are. With the lazy story styles counted, as CAISO and PJM are, it is 43.92 KiB: over 40. The NEM content is about 17% longer than PJM's.

## 7. Checks

Recorded in [the G-2 checklist](nem-g2-checklist.md) with the exact head SHA.

## 8. Page-text changes made during the build

| # | Where | Before (script) | After (built) | Why |
| --- | --- | --- | --- | --- |
| 1 | nem-02, 2016 node, Effect today | "The first batteries' revenue came largely from fast services (to be confirmed)." / "第一批电池的收入主要来自快速调频服务（待核实）。" | "The first batteries' revenue came largely from fast services." / "第一批电池的收入主要来自快速调频服务。" | CL-NEM-19 sourced (SRC-NEM-20); the G-1 ruling removes the label once sourced |
| 2 | nem-02, node titles (Chinese) | English only in the script | 东海岸的统一市场 · 南澳大利亚全州停电 · 按五分钟定价 · 储能在规则中有了自己的位置 · 政府为新增容量托底 · 计划之后 | The script gives no Chinese node titles; new text for review |
| 3 | nem-06 copy, while the switch is off | Full paragraph | The sentence "Over two years their average output rose … fell from ‹spread› to ‹spread›." is hidden (zh: "两年间……降至‹spread›。") | Spread values withheld; the sentence returns unchanged when the switch is on |
| 4 | nem-07 copy, while the switch is off | Full paragraph | The sentence "Spreads fell in every region … at ‹spread NSW latest›." is hidden (zh: "过去一年……为‹spread›。") | As 3 |
| 5 | nem-12 dated strip (scene labels) | Described in the Scene row | "Energy Ministers consider the successor's draft law" / "能源部长们审议后继机制的法律草案"; "The last dispatchable round's results (indicative)" / "最后一轮可调度容量招标结果（暂定）" | Scene labels authored from the Scene row |
| 6 | nem-12 exit "Compare with WA" | Named in Exits | Links to `/returns?compare=nem,wa` | The shell's exits only scroll within the NEM page |
| 7 | Scene-only strings | Not in the script | Readout and legend words in `story/scenes.js` and `story/chart.js` (`T` tables), all bilingual; no figures except Example-tagged teaching values and observed-mode axis ticks | Needed to draw the scenes |

No approved copy, question, meaning, marker, control or caption was reworded; the content test compares each against the script.

## 9. CF-NEM-01 to CF-NEM-07

Open with the analyst; the build resolves none and edits no view, model, fixture or `src/markets/nem/sources.js`. The page binds live fields, so each outcome flows through: a revised next action (CF-NEM-01, CF-NEM-02) changes the card, `nem-00` and `nem-12` text, and flags the story only if the call, play or duration changes; thesis and grade-reason edits (CF-NEM-03, CF-NEM-04) are not read by the story; the nominal-floor rule (CF-NEM-05) is held in copy (no "rises with inflation"); source-link fixes (CF-NEM-06) do not touch the story's own source list; adding Tender 10 or the ministerial decision as a trigger (CF-NEM-07) would change `nem-12`'s watched line through `R.next`, while the two December steps stay context.
