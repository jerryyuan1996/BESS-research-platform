# Ireland build evidence and decisions

Decision record: 2 November 2026, Australia/Perth. Scope: the later Ireland data, content, scenes and wiring work. This file records the build contract; it registers no dataset and authorises no model change or publication.

## 1. Rule 11 verdict

**PASS for the reviewed call, play, duration and lens. The numerical chart is not cleared for publication.** The three session preconditions passed before this document was written.

| Precondition | Checked evidence | Result |
| --- | --- | --- |
| The 1 November stack and script are on main | Local `main` and `origin/main` both resolve to `7e00c1a0abac88d9bb4355624febb0bb571ff381`. Main contains merges #108 `ef47bb9`, #109 `e47adea`, #110 `4ec1cf2`, #111 `6a5062c`, #112 `fba750c`, #113 `bbe4070`, and script #91 `61fdc0f`. Both `codex/ie-six-hour-review-20261101` (`9289f321`) and the #91 merge are verified ancestors of main. GitHub confirms #91, #108 and #113 merged. | Pass |
| Rule 11 anchor still agrees | The checked view, the current read-only briefing projection and the signed script reconciliation agree in the table below. | Pass |
| Initial working tree is clean | `git status --porcelain=v1` returned no entries, checked again before drafting. Checkout remains `main`; the user's instruction expressly requires no new branch for this document. | Pass |

The Markdown script has no literal `reviewedAgainst` object. Its signed **“Current reconciliation, 1 November 2026”** paragraph in §1 is its review record. The following is a transcription of that record, not a claim that an Ireland runtime content object already exists. The later content record must materialise this tuple, with `on: 2026-11-01`, and explicitly constrain the investor lens.

| Review dimension | Live view / current projected row | Signed script review record | Verdict |
| --- | --- | --- | --- |
| Call | `view/markets/ie.json → verdicts.infraFund.call`: **`wait`**; `CALLS[row.call]`: **“Watch / 保持观察”** | §1: **“`infraFund` call `wait` (**Watch / 保持观察**)”** | Match |
| Play | `verdicts.infraFund.play`: **`ie-cap-6h`**; active `plays.ie-cap-6h.id` agrees | §1: **“play `ie-cap-6h`”** | Match |
| Duration | `plays.ie-cap-6h.hours` and projected `row.play.hours`: **`6` hours** | §1 opening: **“six-hour capacity candidate”**; approved disposition: **“six-hour research candidate”** | Match |
| Lens | Selected view branch **`verdicts.infraFund`**; projection inspected with **`opportunities('infraFund')`** | §1: **“`infraFund`”** | Match |

Route `cap` and entry `ready-to-build` also agree. The four-hour comparison archetype is a scaling anchor, not the active play duration. The live thesis retains assumed declining, uncontracted services within trading and denies an extension of DS3 tariff rights. It supports the script's dated approved disposition.

At the checked projection (`HOME_BRIEFING.on = 2026-11-01`), `row.evidence` is **`thin`**, not the script §9's older “strong at check”. The opening must inherit the current marker. The other shots retain their approved Fair marker and change condition. These markers do not supply publication rights.

Rule 11 still applies at the later build head: a changed call, play, duration, lens or substantive thesis returns the script for editorial review. It does not trigger a build against the old narrative. Shared `isStale()` currently compares call, play and hours; it does **not** enforce the lens. The Ireland pack must also check the selected lens using the existing application state, and return to research when unsupported.

Read for this decision: `AGENTS.md`, the plan README, WP-02 through WP-10 in `engineering-work-packages.md` (including retired WP-05 and folded WP-08), the complete Ireland storyboard, the canonical Ireland source/claim records, and the approved duration review and learning. No build or application test was required for this Markdown-only session.

## 2. Gaps and blockers

There are **three open Ireland GAP records** in the canonical register. None blocks the limited treatment below. Closing a gap is required before adding its excluded numerical content.

| Open gap | Blocking? | Exact page wording / treatment it settles | What closes it |
| --- | --- | --- | --- |
| `GAP-IE-CRM` | No for the price/credit chart and four recent awarded-volume rows. Yes for an older-awards extension. | ie-06 selector: **“Batteries awarded — four recent auctions only / 电池中标量——仅最近四轮拍卖”**. It covers delivery 2026/27, 2027/28, 2028/29 and 2029/30. Earlier new/existing battery quantities remain null. ie-02 prints no first-auction date. | A reviewed calculation summing the earlier final reports' unit tables, with technology/cohort classification, primary locators and arithmetic. The first-auction date, if wanted, needs its own direct dated locator; the recent-volume extraction does not establish it. |
| `GAP-IE-DS3-TERMS` | No for service purposes. Yes for response-time, duration, availability or tariff specifications. | ie-04 purposes: **“FFR: arrest the frequency fall; POR: replace the immediate response; SOR: sustain reserve; TOR1 and TOR2: continue reserve cover / FFR：遏制频率下跌；POR：接替即时响应；SOR：维持备用；TOR1和TOR2：继续提供备用支撑”**. No seconds, minutes, response thresholds or service rates. | Extract the applicable DS3 protocol with version, clause, page, service row and technical definitions; analyst checks both languages before quantitative terms are added. Generic “seconds versus hours” in ie-07 remains qualitative physics, not a service compliance promise. |
| `GAP-IE-LINKS` | No for the schematic boundary and trading links. Yes for quantitative interconnection labels. | ie-01 labels: **“Power transfer by DC / 直流输电”** and **“Planned / 规划中”**; Celtic remains a dashed planned link. **No interconnector MW, count, landing coordinates or cable-route claim.** | Analyst review of the operator's complete link list, operational/planned state, capacity definition and dated primary pages. No capacity is inferred from auction de-rated interconnector MW. |

**Remaining build blockers and their scope** follow. These are separate from the three GAP fallbacks; investment underwriting gates are not silently converted into story-wide blockers.

| ID | Blocks | Evidence and required disposition |
| --- | --- | --- |
| `B-IE-COPY` | Publishing contradictory content or scene states | ie-00 still says “the play prices the project without them”; ie-03 Meaning says “this play does not rely on it”; ie-10 Feedback/Labels say “System services: not counted in this play”, and its Scene greys that path. These conflict with the 1 November disposition and live model. Use the exact services wording in §7 throughout, including drawings and accessibility text. ie-11's “upside … of an unpriced line” authoring note and the old ie-08 CF-IE-05 blocked status/marker also require reconciliation to the approved, already implemented decision. This is copy reconciliation, not permission to reopen the model. |
| `B-IE-BIND` | Numeric ie-06 or an assertion that all current script bindings resolve | `‹bound: CRM context duration›` occurs in ie-06 but has no §9 register entry; the old `CRM auction series` entry and accessible summary still say the play's duration. Bind the proposed `crm.contextHours` field and replace those descriptions with the fixed-context wording in §7. All proposed paths in §§3–4 must resolve in the later data/content PR; a remaining figure without a field blocks that figure/shot, never defaults to zero. |
| `B-IE-RIGHTS` | Shipping the observed CRM numeric layer, including an unlinked bundled table | The checked final-report copyright notice (FCAR2930T-4, PDF p.2) and IAIP2930T-4/IAIP3031T-4 notices (PDF p.3) reserve reproduction rights and refer to prior written permission. The register's “link and cite, original drawing” is not documented clearance. Keep numeric CRM records out of the browser until a documented permission or applicable reuse basis is reviewed. Use the unscaled Example in §5 meanwhile. This does not reopen the approved model inputs. |
| `B-IE-PARTICIPATION` | Publishing the ambiguous “most qualified new batteries did not bid” sentence | 2029/30 Table 5 concerns **new de-rated MW**: 42.514 offered / 210.663 qualified. Table 6 concerns **all battery projects**: 27 qualified, 14 offered, 13 successful. The latter does not show most projects declining to bid. Use **“Only ‹bound: new battery offered share› of qualified new battery capacity was offered / 已获资格的新建电池容量中，仅‹bound: new battery offered share›提交了报价”**. Do not infer why capacity was withheld. |

`CF-IE-02` remains an evidence conflict, not a blocker to “start date not confirmed”: the repository's stronger May-2027-infeasibility statement needs the stakeholder email or PIR v4.0. Do not publish that stronger statement from the repository alone. `CF-IE-01`, `CF-IE-03`, `CF-IE-05`, `GAP-IE-DERATE`, `GAP-IE-SETTLE` and `CF-IE-04` retain their recorded closed dispositions; stale shot notes do not reopen them.

An actual project's award, quantity, price, tenor, transferability, payment start, milestones, indexation and reliability-option liability remain **underwriting gates**. Conditional reference-case wording permits the story; it does not turn these assumptions into verified rights.

## 3. Field list for the later data PR

**Decision:** fixed-vintage, analyst-entered market-local records, like the publication-only Finland records and the Italy manual catalogue. No six-hour CRM feed, fabricated price snapshot or financial-input binding. Proposed catalogue IDs are `ie-crm-auctions` and `ie-story-evidence`; `bearsOn: []`. In this document, **`crm`** and **`ev`** are exact proposed record roots, not existing runtime exports. Every field below is a decision for later registration. Rights-blocked numbers may remain in this private documentation, but must not be embedded in a public module or asset merely because its loader is lazy.

Each numeric/date observation carries its own `source` record. The following metadata fields apply to **each** observation, including both the price and credit within the same auction row.

| Field | Unit / stored meaning | Locator and source-to-storage rule |
| --- | --- | --- |
| `id`, `kind`, `entry`, `refresh`, `bearsOn` at each root | Identifier; `fixed-vintage-table`; `analyst-entered`; review after a new result/pack; empty financial binding list | Authoring metadata, not source measurements. Never claim scheduled ingestion. |
| `vintage` | ISO review date | Date this fixed release is assembled; distinct from each document's publication and each event's date. This memo is dated 2026-11-02. |
| `source.id` | Existing `SRC-IE-*` identity, or an explicitly proposed source supplement | Resolve to canonical source register; no participant, unit or owner identities copied from result tables. |
| `source.document`, `source.version`, `source.publishedOn` | Document ID/title; printed version; ISO publication date with precision | Cover/revision history of the linked document. Do not use a website's upload path or “last updated” date as the event date. |
| `source.url` | Primary document URL | Direct PDF/page links below, not a search result or third-party analysis. |
| `source.locator.page`, `.table`, `.row`, `.column` | Printed page plus PDF page where they differ; table/section; exact source row/column | Required per numeric field. Web sources use named heading/paragraph, with page/table “not applicable”, rather than an invented PDF page. |
| `source.checkedOn` | ISO access/check date | 2026-10-31 for inherited extraction until reopened; 2026-11-02 for the primary items explicitly checked here. Do not relabel an inherited check as a fresh full-document review. |
| `unit`, `authority`, `arithmetic` | Explicit units; observed fact / decided rule / initial pack / model assumption; transformation | Source value × 1 unless a conversion below says otherwise. Distinguish a published rule from a realised payment. |
| `rights.status`, `rights.basisUrl`, `rights.checkedOn` | `unresolved` or reviewed clearance; supporting reference/date or null | Copyright/reuse notice or written permission. For CRM here: unresolved; basis/clearance date null. A citation is not a licence. |
| `gapIds` | Open gap IDs relevant to that field, or empty list | Canonical register; no numerical fill for a missing observation. |

**CRM record fields and arithmetic**

| Exact field | Unit / value or rule | Primary locator and arithmetic |
| --- | --- | --- |
| `crm.contextHours` | Hours; 4 | CALC-IE-CRM's fixed 4-hour column and each IAIP Table 3 column header. Store 4, independent of `row.play.hours`. |
| `crm.initialCapacityBand.lowerExclusiveMW` | Rated MW; 40 | Each IAIP Table 3, Other Storage, `40 < IC ≤ 50 MW` row: parse lower bound, × 1. |
| `crm.initialCapacityBand.upperInclusiveMW` | Rated MW; 50 | Same row: parse upper bound, × 1. The archetype's 50 MW belongs in this band. |
| `crm.rows[year].deliveryYear` | Capacity-year string, 2022/23 through 2030/31 | Each report/pack cover and §1. Preserve a capacity year; do not turn it into calendar-year observed revenue. |
| `crm.rows[year].auctionDate` | ISO date or null | Final report executive summary, separately from its cover date; dates in the vintage table below. For 2030/31, null: not yet held. |
| `crm.rows[year].status` | `final-results` or `initial-pack` | FCAR/IAIP identity. The 2030/31 factor is published initial-pack context, not an auction result. |
| `crm.rows[year].price.value` | EUR per de-rated MW/year | Each final report Table 1, auction-clearing-price EUR row; strip currency and grouping separators, retain precision, × 1. Never substitute the average awarded price or an individual unit's price. |
| `crm.rows[year].credit2h.value` | Dimensionless factor | That auction's IAIP Table 3, specified size row, 2-hour column; × 1. Retained for provenance to CALC-IE-CRM, not drawn as another play series. |
| `crm.rows[year].credit4h.value` | Dimensionless factor | Same row, 4-hour column; × 1. Display percent only by × 100. No interpolation or averaging for these exact-duration points. |
| `crm.rows[year].batteryNewMW.value` | De-rated MW or null | Recent final reports' technology breakdown, Battery Storage row, successful-new column; × 1. Earlier four rows null under GAP-IE-CRM. |
| `crm.rows[year].batteryExistingMW.value` | De-rated MW or null | Same row, successful-existing column; × 1. This is not built nameplate capacity or a qualified fleet. |
| `crm.rows[year].batteryTotalMW.value` | De-rated MW or null | New + existing only when both exist: 108.963, 34.679, 146.977, 38.752 for the four recent years. Earlier/2030 rows null. Record the sum even where the source also supplies a total. |
| `crm.rows['2029/30'].participation.qualifiedNewMW.value` | De-rated MW; 210.663 | FCAR2930T-4 PDF/printed p.10, Table 5, Battery Storage row, qualified column; × 1. |
| `crm.rows['2029/30'].participation.offeredNewMW.value` | De-rated MW; 42.514 | Same table/row, offered column; × 1. |
| `crm.rows['2029/30'].participation.offeredNewShare.value` | Share; 0.2018104745493988 | 42.514 / 210.663; display 20% using whole-percent rounding. Denominator is qualified **new de-rated MW**, not project count. |
| `crm.rows['2029/30'].participation.qualifiedProjects.value` | All-battery CMU count; 27 | FCAR2930T-4 p.10, Table 6, Battery Storage row, qualified column; × 1. |
| `crm.rows['2029/30'].participation.offeredProjects.value` | All-battery CMU count; 14 | Same table/row, offered column; × 1. |
| `crm.rows['2029/30'].participation.successfulProjects.value` | All-battery CMU count; 13 | Same table/row, successful column; × 1. These counts support the evidence drawer, not a new-project-only claim. |

**Exact CRM vintages.** Price and credit in a row refer to the **same delivery auction**, while retaining their **separate publication documents, dates and versions**. All values below are direct transcriptions, except the total sums specified above. `N/E` means new/existing de-rated MW. All three 2030/31 result fields (price, new and existing awards) stay null.

| Delivery / auction held | Final price source: version, publication, locator → `price.value` | Credit source: version, publication, locator → 2h / 4h | Awards source: locator → N / E |
| --- | --- | --- | --- |
| 2022/23 / 2019-03-28 | [FCAR2223T-4](https://www.sem-o.com/sites/semo/files/documents/general-publications/T-4-2022-2023-Final-Capacity-Auction-Results-Report.pdf), v1.2, 2022-04-20; p.4 Table 1 EUR clearing-price row → 46150 | [IAIP2223T-4](https://www.sem-o.com/documents/general-publications/Initial-Auction-Information-Pack_IAIP2223T-4.pdf), v1.1, 2018-10-02; p.7 Table 3, specified size row, 2h/4h → .554 / .721 | null / null; GAP-IE-CRM |
| 2023/24 / 2020-04-27 | [FCAR2324T-4](https://www.sem-o.com/documents/general-publications/T-4-2023-2024-Final-Capacity-Auction-Results-Report.pdf), v1.3, 2022-04-20; p.4 Table 1 EUR clearing-price row → 46149.00 | [IAIP2324T-4](https://www.sem-o.com/sites/semo/files/documents/general-publications/Initial-Auction-Information-Pack_IAIP2324T-4.pdf), v1.0, 2019-09-13; p.8 Table 3, specified row, 2h/4h → .597 / .745 | null / null; GAP-IE-CRM |
| 2024/25 / 2021-01-21 | [FCAR2425T-4](https://www.sem-o.com/sites/semo/files/documents/general-publications/T-4-2024-2025-Final-Capacity-Auction-Results-Report.pdf), v1.2, 2022-04-20; p.4 Table 1 EUR clearing-price row → 47820.00 | [IAIP2425T-4](https://www.sem-o.com/sites/semo/files/documents/general-publications/Initial-Auction-Information-Pack_IAIP2425T-4.pdf), v1.0, 2020-06-03; p.7 Table 3, specified row, 2h/4h → .376 / .585 | null / null; GAP-IE-CRM |
| 2025/26 / 2022-03-24 | [FCAR2526T-4](https://www.sem-o.com/sites/semo/files/documents/general-publications/T-4-2025-26-Final-Capacity-Auction-Results-Report.pdf), v1.0, 2022-05-06; p.4 Table 1 EUR clearing-price row → 46000.00 | [IAIP2526T-4](https://www.sem-o.com/sites/semo/files/documents/general-publications/Initial-Auction-Information-Pack_IAIP2526T-4.pdf), v1.0, 2021-10-01; p.7 Table 3, specified row, 2h/4h → .376 / .585 | null / null; GAP-IE-CRM |
| 2026/27 / 2023-03-23 | [FCAR2627T-4](https://www.sem-o.com/sites/semo/files/2025-02/FCAR2627T-4-report.pdf), v1.0, 2023-05-04; p.4 Table 1 EUR clearing-price row → 83050 | [IAIP2627T-4](https://www.sem-o.com/sites/semo/files/documents/general-publications/Initial-Auction-Information-Pack_IAIP2627T-4.pdf), v1.0, 2022-09-08; p.7 Table 3, specified row, 2h/4h → .376 / .585 | FCAR p.14 Table 8, Battery Storage, successful new/existing → 105.245 / 3.718 |
| 2027/28 / 2023-10-26 | [FCAR2728T-4](https://www.sem-o.com/documents/general-publications/FCAR2728T-4-report-v1.0.pdf), v1.0, 2023-12-05; p.4 Table 1 EUR clearing-price row → 106666.67 | [IAIP2728T-4](https://www.sem-o.com/sites/semo/files/documents/general-publications/IAIP2728T-4.pdf), v1.1, 2023-03-14; p.7 Table 3, specified row, 2h/4h → .190 / .291 | FCAR p.14 Table 7, Battery Storage, successful new/existing → 18.553 / 16.126 |
| 2028/29 / 2024-12-17 | [FCAR2829T-4](https://www.sem-o.com/sites/semo/files/documents/general-publications/20282029-T-4-Final-Capacity-Auction-Results-Report-FCAR2829T-4.pdf), v1.0, 2025-01-16; p.4 Table 1 / p.9 §4.1 clearing-price sentence → 149960.00 | [IAIP2829T-4](https://www.sem-o.com/sites/semo/files/documents/general-publications/IAIP2829T-4.pdf), v1.1, 2024-10-16; p.7 Table 3, specified row, 2h/4h → .145 / .268 | FCAR p.18 Table 7, Battery Storage, successful new/existing → 132.462 / 14.515 |
| 2029/30 / 2026-03-26 | [FCAR2930T-4](https://www.sem-o.com/sites/semo/files/2026-05/2029_2030%20T-4%20Final%20Capacity%20Auction%20Results%20Report%20FCAR2930T-4.pdf), v1, 2026-05-05; p.5 Table 1 EUR clearing-price row; held date p.4 → 135499.99 | [IAIP2930T-4](https://www.sem-o.com/sites/semo/files/2025-08/IAIP2930T-4.pdf), v1.1, 2025-08-13; p.7 Table 3, specified row, 2h/4h → .143 / .277 | FCAR p.9 Table 3, Battery Storage, successful new/existing → 25.594 / 13.158 |
| 2030/31 / null | No final result; price null | [IAIP3031T-4](https://www.sem-o.com/sites/semo/files/2026-08/IAIP3031T-4.pdf), v1.0, 2026-08-04; p.7 Table 3, specified row, 2h/4h → .081 / .151 | null / null; auction not held |

IAIP2324T-4's cover confirms v1.0 and 13 September 2019; its numerical row and PDF p.8 locator are also checked. The 2028/29 held date comes from the final report (17 December), not the overview table's older 5 December entry. The public overview now lists 25 March 2027 for 2030/31, but this memo adds no new event-date binding: the script's expected-quarter plan is sufficient and the held-date field remains null.

**Other evidence fields.** For dates, retain `value`, `precision` and, where needed, `qualifier`; there is no invented first day for a year/month-only event. Each `history[id].label` is the signed bilingual event sentence, separate from causal interpretation.

| Exact field | Unit / stored value | Document, page/heading, row and arithmetic |
| --- | --- | --- |
| `ev.history['H-IE-01'].eventDate` | Day; 2007-11-01 | [SRC-IE-01 SEM page](https://www.semcommittee.com/sem), opening paragraph; web page, no table. Parse the SEM go-live date, no arithmetic. |
| `ev.history['H-IE-02'].eventDate` | Year; 2011 | [SRC-IE-03 DS3 Programme Overview 2011](https://cms.eirgrid.ie/sites/default/files/publications/DS3-Programme-Overview-2011.pdf), p.2 §1, programme-established paragraph, with the dated document; store year precision only. |
| `ev.history['H-IE-03'].eventDate` | Day; 2018-10-01 | SRC-IE-01, new-market-arrangements paragraph; parse the event date. No first-capacity-auction date inferred. |
| `ev.history['H-IE-04'].eventDate` | Year; 2019 | [SRC-IE-05 SEM-19-062](https://www.semcommittee.com/files/semcommittee/media-files/SEM-19-062%20-%20System%20Services%20Fixed%20Contracts%20Procurement%20Outcomes%20-%20Information%20note.pdf), cover publication 2019-11-13 and p.4 §3 outcomes; award year 2019, not an assertion that awards occurred on the publication day. |
| `ev.history['H-IE-05'].eventDate` | Month; 2022-03 | [SRC-IE-04, What DS3 Achieved](https://www.eirgrid.ie/ds3-programme-delivering-secure-sustainable-electricity-system), milestone paragraph; preserve month precision. |
| `ev.history['H-IE-06'].eventDate` | Day; 2025-06-23 | [SRC-IE-07 SEM-25-031](https://www.semcommittee.com/files/semcommittee/2025-06/SEM-25-031%20System%20Services%20Regulated%20Arrangements%20to%20FASS%20-%20The%20Gap%20-%20Decision%20Paper.pdf), cover decision date; not the future long-stop. |
| `ev.snsp.steps[].date` | 2018 / 2021 / 2022-03; qualifiers `by` / `in` / `in` | SRC-IE-04, What DS3 Achieved, two milestone paragraphs; no intermediate dates added. |
| `ev.snsp.steps[].limitShare` | Shares .65 / .70 / .75 | Same paragraphs: 65 / 100, 70 / 100, 75 / 100. Operating limit, not annual renewable output. The final step supplies `‹bound: SNSP level›`. |
| `ev.vc.awardedMW.value` | Contracted MW; 110 | SRC-IE-05 p.4 §3 outcome, aggregate paragraph (and contract-size table); 110 × 1. Five services share the same contracted MW; do not multiply by five. |
| `ev.vc.winnerCount.value` | Count; 3 | Same aggregate paragraph; 3 × 1, without copying winners' names. |
| `ev.vc.serviceCodes` | Identifier list FFR, POR, SOR, TOR1, TOR2 | SRC-IE-05 p.3 §2, five-services paragraph; identifiers, not response-time measurements. |
| `ev.vc.serviceCount.value` | Count; 5 | Count that source's five named services; length of `serviceCodes` = 5. Bind the word “five/五项” if printed. |
| `ev.ds3.longStopDate.value` | Day; 2027-09-30 | SRC-IE-07, Decision 1: **PDF p.10 / printed p.9**; date parsed directly. The earlier register's bare p.9 needs this page convention. |
| `ev.ds3.successorStartDate.value` | null | SRC-IE-24 October 2026 workshop, FASS Summary Status; inherited checked-through date 2026-10-21. No confirmed date in that evidence; do not populate from a target or operating-year decay. |
| `ev.ro.maxYears.value` | Years; 10, conditional on qualifying/approval | Primary supplement: [SEM-17-022 CRM Parameters Decision](https://www.semcommittee.com/files/semcommittee/media-files/SEM-17-022%20CRM%20Parameters%20Decision%20Paper_1.pdf), printed p.93 §§7.1.1, 7.2.1, maximum multi-year RO term; 10 × 1. The source supplement must be registered explicitly in the later data PR. It supports the signed mechanism wording, not a claim that an asset holds ten years. |
| `ev.dataCentres.year.value` | Calendar year; 2025 | [SRC-IE-18 CSO 2025 release](https://www.cso.ie/en/releasesandpublications/ep/p-dcmec/datacentresmeteredelectricityconsumption2025/index.html), infographic transcript, data-centre row. Release dated 2026-07-07; observation year remains 2025. |
| `ev.dataCentres.share.value` | Share; .23 | Same transcript, data-centre row, 2025 column: 23 / 100. Republic of Ireland metered electricity; not all-island demand. The script's direct Key Findings URL failed this tool; the primary release's transcript was opened and verifies the required share/year. |
| `ev.crmRedesign.mainLeadYears.value`, `.topUpLeadYears.value` | Years; 5 / 1; proposal | [SRC-IE-17 SEM-26-037](https://www.semcommittee.com/files/semcommittee/2026-07/sem-26-037-consultation-crm-design-options_v200.pdf), §2.1, PDF p.9 / printed p.8, proposed T-5 and T-1 bullets; parse lead times, no adopted-rule claim. Only bind if these labels are printed. |
| `ev.map.interconnectorMW`, `.interconnectorCount`, `.celticExpectedYear` | null / null / null | GAP-IE-LINKS; no capacity/count label and no unverified year. Planned status is a qualitative source-backed label. |
| `ev.ds3.responseTimes`, `.serviceTariffs`, `ev.firstCapacityAuctionDate` | null / null / null | Excluded numerical scope under GAP-IE-DS3-TERMS and the first-auction-date gate. Do not populate from an Example. |

No new stored model-result fields belong in this data PR. The approved 2029/30 duration curve already lives in `row.market.comparison.durationResponse`: `hours = [1,2,4,6,8]`, `capacityDerating = [.072,.143,.277,.425,.549]`. Its source is IAIP2930T-4 p.7 Table 3, specified size row and corresponding columns. Multiplying nameplate MW by a factor produces illustrative credited MW; it does not establish a project's qualified or awarded quantity. The chart's FCAR price precision (135499.99 EUR/de-rated-MW/year) is preserved separately from the approved model's rounded 135.50 EUR/kW/year. This documentation changes neither.

## 4. Bound-field map: ie-00 through ie-12

`row` is the current Ireland row **after** the investment-summary projection in `src/experience/model.js`. `grid` is `HOME_BRIEFING.grids.ie`. Evidence roots are the proposed records in §3. Every number in copy, diagrams, ticks, captions, tooltips, tables and accessibility text uses these same fields. Dates are not typed a second time. Missing required financial fields produce the signed figure-free fallback and a review flag.

| Shot | Every quantitative/date figure or result shown | Exact binding / disposition |
| --- | --- | --- |
| `ie-00` | Call, play, card return, secured share and its tenor, next action, opening marker; any basis duration/life label | `CALLS[row.call]`; `playTitle(row.play,row.stage)`; `row.investment.holdIRR` with `returnPct()`; `row.investment.secured` with `share()`; **`row.investment.securedYears`**; `row.play.action.text`; `row.evidence`; `row.play.hours` / `row.investment.lifeYears`. If a target is shown, `row.investment.test.target`; no copied number from thesis or `play.why`. |
| `ie-01` | No numerical map figure | `ev.map.interconnectorMW` and `.interconnectorCount` remain null; no capacity/count/year labels. Planned Celtic is qualitative and dashed. |
| `ie-02` | SEM and redesign go-live dates | `ev.history['H-IE-01'].eventDate`; `ev.history['H-IE-03'].eventDate`, with their labels and precision. No first-auction date. “Years ahead” remains qualitative. |
| `ie-03` | Programme year, intermediate SNSP steps, final level and milestone date | `ev.history['H-IE-02'].eventDate`; `ev.snsp.steps[].date` and `.limitShare × 100`; final step / `ev.history['H-IE-05'].eventDate`. No invented frequency trace or annual renewable percentage. |
| `ie-04` | Award year, optional awarded MW/winner count, the five service purposes | `ev.history['H-IE-04'].eventDate`; `ev.vc.awardedMW.value`; `ev.vc.winnerCount.value`; `ev.vc.serviceCount.value` and `serviceCodes`. No response-time, six-year-term or tariff figure is required on the page; do not add one without a registered field and locator. |
| `ie-05` | Decision date, tariff long-stop; successor date intentionally absent | `ev.history['H-IE-06'].eventDate`; `ev.ds3.longStopDate.value`; `ev.ds3.successorStartDate.value = null`. The decided deadline is a dated marker; the successor is an undated dashed band. The fading slice represents tariff rights, not all modelled services income. |
| `ie-06` | Delivery-year axis; all price points; fixed context duration and size-band label; all 4h factors; award toggle values; CSO share/year; new-battery offered share; optional project-count evidence; long-stop annotation | `crm.rows[].deliveryYear`, `.price.value`, `.credit4h.value`; **`crm.contextHours`** and `crm.initialCapacityBand.*`; `.batteryNewMW.value`, `.batteryExistingMW.value`, `.batteryTotalMW.value`; `ev.dataCentres.share.value × 100` and `.year.value`; `crm.rows['2029/30'].participation.offeredNewShare.value × 100`; the three `.participation.*Projects.value` fields, with all-project scope; `ev.ds3.longStopDate.value`. Ticks are derived from the selected field's scale, not an extra factual series. Rights unresolved → unscaled Example, with no numeric CRM axis/data. |
| `ie-07` | Current teaching duration; no scaled power, energy, SOC or response-time values | **`row.play.hours`**, checked against the reviewed six hours. SOC and power bursts are qualitative and tagged Example. If numeric MWh/MW is later wanted, it needs an explicit sourced/model field; the present decision omits it. Do not fall back to the four-hour archetype while claiming to explain the active play. |
| `ie-08` | Current/shorter/longer durations; built and illustrative credited MW; current hold IRR/target; current construction budget; separate design value per MW | Current `row.play.hours`; alternatives from `grid.hours` with `grid.cells` filtered to `route === 'cap' && priced && eligible`, restricted to the reviewed 4/6/8h comparison where claiming highest investment IRR. Power `row.investment.powerMW`; credit from matching index of `row.market.comparison.durationResponse.hours` / `.capacityDerating`; derived credited MW = power × factor, tagged Example. IRR/target: `row.investment.holdIRR` / `.test.target`. Construction: `.capexTotal`, `.capexPerMW`, `.currency`, `.powerMW`. Design value: selected capacity cell `.value`, USD/nameplate-MW, existing `perMW()` formatter. Optional design IRR uses cell `.hold`, explicitly a separate 15-year basis. The existing grid does not expose 4h/8h investment-summary IRRs or construction budgets: keep those alternatives qualitative/link to duration evidence unless separately exposed and reviewed; never invent `row.investment.alternatives`. |
| `ie-09` | RO maximum term; current reference secured share and own tenor | `ev.ro.maxYears.value`; **`row.investment.secured`**, **`row.investment.securedYears`**. No `play.econ.secured`, acquisition `securedRevenueShare`, actual-asset term or fixed scarcity price substituted. Scarcity spike/payback is an unscaled Example. |
| `ie-10` | Capacity and energy unit labels; repeated long-stop if shown; no second revenue split | Unit metadata `crm.rows[].price.unit = EUR/de-rated-MW/year`; existing `ie-day-ahead` catalogue unit EUR/MWh for the energy path; `ev.ds3.longStopDate.value`. The actual financial split remains the existing `#revenue` section for this row. No ancillary-service number is inferred from `bridge.service = 0`. |
| `ie-11` | Repeated de-rating evidence; optional T-5/T-1 proposal labels; next action; no risk probability or link MW | `crm.rows[].credit4h.value` only if the context is repeated, with the same rights gate; `ev.crmRedesign.mainLeadYears.value` / `.topUpLeadYears.value`, clearly proposed; `row.play.action.text`. No new simulated loss, probability, capacity income or Celtic MW. |
| `ie-12` | No new figure | Links to `#bankable`, `#revenue`, `#execution`, `#downside`, all for the same row/play. No duplicate financial result. |

Common drawer check date is the **selected observation's** `source.checkedOn`. History labels come from `ev.history[id].label`, not a publication-date formatter. Legends and Example tags are bilingual content, not observations. `FFR`, `POR`, `SOR`, `TOR1`, `TOR2`, `DS3` and `T-4` identify mechanisms; a digit inside an identifier is not a response-time datum.

**Unresolved-field rule:** the missing script context-duration token is explicitly assigned above, but the future data/content registration must implement that assignment. Any additional numeric label, including a capital comparison or annual payment, without an exact resolved field and basis is a blocker. No alternative-return series is authorised by a qualitative drawing.

## 5. Chart-IE-CRM contract

| Layer / state | Required contract |
| --- | --- |
| Solid history | When publication is cleared: final auction price points for delivery 2022/23–2029/30; fixed four-hour storage-credit history from each corresponding auction's pack; recent observed awarded-volume bars. Separate panels/scales retain each point's source, publication date and status. Solid means published historical evidence, not realised project income. |
| Dashed future | The 2030/31 initial-pack credit point/connection is dashed and labelled **“Initial pack; auction not yet held / 初步信息包；拍卖尚未举行”**. A published factor is not a cleared auction price. DASSA and other future plans are dashed; the DS3 decided deadline uses its own dated marker, not an invented start date for DASSA. |
| Price axis | **“Clearing price · EUR per de-rated MW per year / 出清价 · 欧元/折减MW/年”**. Horizontal title: **“Delivery year / 交付年度”**. Final report vintage is shown in the selected point's source details. |
| Credit axis | **“Four-hour storage credit · de-rating factor · 40 < IC ≤ 50 MW / 四小时储能计入比例 · 折减系数 · 40 < IC ≤ 50 MW”**. Render four and band limits through the §3 bindings. Pack vintage is shown separately; factors are ratios, not EUR or nameplate MW. Mobile stacks the panels; it never overlays an unlabelled monetary axis. |
| Awarded-volume mode | Own title **“Battery storage awarded · de-rated MW / 中标电池储能 · 折减MW”**, new/existing legend, and only the four recent delivery auctions in §2. Do not join absent older bars to zero. This is an alternate mode of the same signature chart, not an energy-price series. |
| What carries Example | With missing approval, provenance, data integrity or rights, the entire CRM numeric drawing/table is replaced by **“Example: price and storage credit / 示例：价格与储能计入比例”**, unscaled, with no observed values, numeric ticks, numeric tooltips or synthetic auction dates. The separate ie-07 physical teaching and ie-09 scarcity sketch also carry Example. A published, cleared historical point is not called Example to excuse uncertain provenance. |
| What stays null | 2030/31 clearing price and all battery awards; four earlier new/existing battery totals; unconfirmed DASSA start; excluded link MW and technical service times. The initial pack's suspicious repeated 8h/12h columns are not imported into a current six-hour play or extrapolated return. A null label is hidden/identified as unavailable; it is never zero, an estimate or a dashed invented result. |
| Condition retiring the chart Example | **All** displayed fields have primary URLs, precise locators, publication/version, units, checks and arithmetic; the fixed-vintage record passes validation; the analyst approves the extracted series and bilingual chart labels; CRM publication rights/reuse basis are documented and cleared; every displayed figure resolves to the §4 map. Only then can the observed chart replace the Example in a separately authorised build, followed by G-2 review. GAP-IE-CRM may remain open because the toggle excludes earlier totals. A 2030/31 final result is not required to publish its correctly dashed initial-pack factor. |

The chart does **not** calculate revenue per built MW by silently multiplying a price by a factor from a different auction. It does not convert awarded de-rated MW into a built fleet, compare procurement price with energy prices on one axis, or rename the historical credit column when the play duration changes.

The rights assessment here is a **publication gate, not a legal conclusion that factual extraction is categorically prohibited**. The [FCAR2930T-4 notice](https://www.sem-o.com/sites/semo/files/2026-05/2029_2030%20T-4%20Final%20Capacity%20Auction%20Results%20Report%20FCAR2930T-4.pdf#page=2) and [IAIP2930T-4 notice](https://www.sem-o.com/sites/semo/files/2025-08/IAIP2930T-4.pdf#page=3) do not establish permission for the proposed republication. A rights block is not downgraded to Thin observed data.

## 6. Reuse extract

Read once for this record: [#107](https://github.com/jerryyuan1996/BESS-research-platform/pull/107), Germany [#90](https://github.com/jerryyuan1996/BESS-research-platform/pull/90), [#99](https://github.com/jerryyuan1996/BESS-research-platform/pull/99), [#100](https://github.com/jerryyuan1996/BESS-research-platform/pull/100), [#102](https://github.com/jerryyuan1996/BESS-research-platform/pull/102); Finland [#89](https://github.com/jerryyuan1996/BESS-research-platform/pull/89), [#103](https://github.com/jerryyuan1996/BESS-research-platform/pull/103), [#104](https://github.com/jerryyuan1996/BESS-research-platform/pull/104), [#105](https://github.com/jerryyuan1996/BESS-research-platform/pull/105), [#106](https://github.com/jerryyuan1996/BESS-research-platform/pull/106). Merged metadata, the #107 patch and current implementations were inspected; old PR statements that they were unmerged are historical.

| Layer | Configure / reuse | Write new for Ireland |
| --- | --- | --- |
| Data | DE #90 demonstrates rights-blocked registration without publishing a series; FI #89 distinguishes an existing licensed feed from dated publication-only records. Reuse source/unit/locator/rights conventions and existing `ie-day-ahead`; CRM is a manual local table, not a new connector. | The two §3 evidence records/catalogue entries, exact extraction provenance, null semantics and rights gate. No ETL snapshot, model-input bridge or restricted price payload. |
| Content | DE #99 and FI #103 reuse `story/contract.js`, the six chapter IDs, bilingual pairs, live card/result formatters and read-only bindings; FI #106 adds historical explanation in the local drawer without changing shared structure. #107 keeps each opportunity's call/action distinct and only the selected row's financial result. | Thirteen Ireland shots, exact approved reconciliations in §§2/7, Ireland history/source/claim records, `reviewedAgainst` tuple plus lens constraint, and a field-complete local binding map. Ireland has one reviewed fund play, so configure one row; do not inherit another cohort's investment data or copy Poland's fork UI. |
| Scenes | DE #100 and FI #104 reuse fixed-view SVG/isometric symbols, controls, themes, HTML labels, local teaching state and accessible tables. The shared intraday chart cannot represent calendar auction history; FI wrote a local calendar chart using shared SVG/axis primitives. | Island schematic, SNSP/history composition, DS3/payer and duration scenes; a local two-scale auction-history chart/alternate awards mode and its Example fallback. Local scene composition and styles, not a fork of the kit, shell, navigator or marker. |
| Wiring | DE #102 and FI #105 reuse lazy `storyPack`, registry entry, research-button fallback, shell, focus, story URL/Back/refresh and the four investment exits. #107 passes `rows` plus the selected `row`/already-computed `result`; #108 moved the market renderer from `pages.js` to current `marketPage.js`. | One lazy Ireland pack/registry entry, explicit fund-lens and stale-tuple guard, local scene/binding configuration, and Ireland acceptance coverage in the later build. No new global store or home import. Keep other markets' entries/checks; retain current budgets and normal publishing pipeline. |

This four-row extract is the future reuse reference; there is no need to reread those PRs to discover the layer boundaries. Their passed tests do not validate a future Ireland head or supply its G-2 editorial approval.

## 7. Market judgement calls

**Four-hour historical context and six-hour candidate.** Exact chart label:

> **Historical context: ‹bound: CRM context duration›-hour storage, 40 < IC ≤ 50 MW; each point uses that delivery auction's pack. This is not the ‹bound: play duration›-hour candidate's credit.**
>
> **历史背景：‹bound: CRM context duration›小时储能，40 < IC ≤ 50 MW；各点采用对应交付年度拍卖的信息包。这不是‹bound: play duration›小时候选方案的计入比例。**

The rendered band limits also bind `crm.initialCapacityBand.*`. The chart's accessible summary must repeat this distinction instead of §9's old “battery of the play's duration” sentence. CALC-IE-CRM retains historical prices and the four-hour context column **within each auction vintage**; the current duration comparison uses the approved 2029/30 curve. It never pairs a high old price with a different auction's high credit.

**Separate axes and document vintages.** The two titles are exactly those in §5: “Clearing price · EUR per de-rated MW per year” and “Four-hour storage credit · de-rating factor · 40 < IC ≤ 50 MW”, with their Chinese equivalents. Price uses the final-results publication; credit uses the separately dated/versioned pack. Both documents must resolve for the named delivery auction. A single generic “source date” cannot replace them.

**IRR, required capital and value per MW.** The duration view uses three separate labelled blocks, with no composite winner badge or shared numeric axis:

| Measure | Basis and exact display label | Consequence |
| --- | --- | --- |
| Investment IRR | `row.investment.holdIRR`, `.lifeYears`, `.stage`, `.test.target`; **“All-equity hold IRR · after-tax nominal · from RTB closing / 全股权长持IRR · 项目税后名义 · 自RTB交割起算”**. Existing projection uses 20 operating years. | No additional inflation multiplier. The approved 4/6/8h review identifies six hours as the highest investment IRR among those three; the current card binds only its own result. A 15-year design return does not replace it. |
| Capital required | `row.investment.capexTotal`, `.capexPerMW`, `.currency`, `.powerMW`; **“Construction budget including reserves · current prices / 含储备的建设预算 · 当期价格”**. | This is the construction budget still payable, with the project size and currency attached. It is not entry price, peak equity, value or an annual return. Shorter/longer alternatives grow qualitatively unless their own existing investment fields are exposed and reviewed. |
| Value per MW | Capacity-route `grid.cells[].value`, existing USD/nameplate-MW formatter; **“Design value less net capital at COD · USD per nameplate MW / 设计口径投运时价值减净投入 · 美元/铭牌MW”**. | This is the separate 15-year design valuation objective, not the 20-year after-tax nominal investment IRR or the EUR construction budget. The checked grid's one-hour `best` flag means least-negative value in that grid. All capacity values remain negative. It supplies no claim that one hour is best to buy, or that six hours is a value-per-MW optimum. |

No twelve-hour IRR is extrapolated from a published factor. The teaching presets never alter the case, ranking, URL or investment result. Missing alternative figures lead to the existing duration-evidence link, not stored copies of the review memo's rounded numbers.

**Auction toggle.** The awarded-battery toggle covers **only 2026/27–2029/30**, the four recent auctions with source totals. Price and credit history can span the longer series when cleared. No zero-valued older bars and no extrapolated 2030/31 awards. GAP-IE-CRM stays open without blocking this scoped design.

**Secured binding and services.** Use `row.investment.secured` with **its own** `row.investment.securedYears`, first-year-gross-revenue denominator and the card's `share()` formatter. Exact accompanying wording:

> **Conditional on obtaining and performing the modelled capacity award, capacity secures ‹bound: secured share› of first-year revenue for ‹bound: secured tenor› years. After expiry, revenue is merchant unless a new contract is won; renewal is an assumption.**
>
> **以取得并履行模型中的容量授标为条件，容量付款在‹bound: secured tenor›年内锁定首年收入的‹bound: secured share›。到期后，若未赢得新合同，则承担市场风险；续期仍是假设。**

The checked share is 0.3830370177 and tenor is 10 years; these are audit observations, never page constants. The separate mechanism maximum in `ev.ro.maxYears` does not overwrite the reference's own tenor. Show indexation and operating start as model assumptions until contract evidence verifies them.

Exact services label for ie-00/03/05/07/10, legends and accessibility text:

> **System services: assumed, declining and uncontracted income included within trading; DS3 tariff rights end by ‹bound: DS3 long-stop date›.**
>
> **辅助服务：交易收入中计入假设递减、未锁定的收入；DS3费率权利最迟于‹bound: DS3 long-stop date›结束。**

Use that label to replace zero-services implications, with the earlier-of-DASSA-or-long-stop wording retained where the timeline explains the rule. The zero separate services slice in the summary bridge is not zero ancillary revenue. The model's services seed and relative-operating-year decay do not date FASS commencement. Service selectors explain purposes only; GAP-IE-DS3-TERMS still excludes response times and quantitative compliance promises.

**Map.** No interconnector MW. DC links illustrate trading without shared frequency; the planned link is dashed. GAP-IE-LINKS is not closed by this schematic decision.

**Least-confident decision:** the precise route by which the CRM factual numeric extraction can obtain publication clearance. The primary notices are restrictive, and no permission/reuse instrument was found in the reviewed records. Keeping the chart at an unscaled Example is supported by the signed build conditions; whether a documented facts-only reuse basis can replace written permission requires a specific rights review. That uncertainty does not justify changing the fund call or the approved model.

Session boundary: this document is the sole intended file change. No branch, application/data/model edit, fixture regeneration, build, commit, push, PR or deployment is part of this session.
