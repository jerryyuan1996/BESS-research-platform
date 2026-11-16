# Return-model alignment: sign-off plan, 2026-11-15

Status: **regrade and three ERCOT Pass calls signed off and applied on 16 November 2026; six bounded Watch calls approved on 15 November are live.** On 16 November the analyst signed off the regrade "as recommended" (decisions 1–8 and 12), approved Pass for ERCOT for the fund, the strategic investor and the new entrant (F4, S4, N4), and chose to re-sign the ERCOT market story against the Pass call. On the same instruction the reviewer's other recommendations that move no number were applied (decisions 9, 13, 14, the header in 15, and 17). Section 4.8 is the controlling record for 16 November; section 4.7 for 15 November. Still unsigned: eight Ready call recommendations, the seven developer cases, the sixteen Build position cases and full endorsement of the weights. No model input, weight, financing rule or fixture changed.

**当前决定（11月16日更新）：分析师已签批按投资模型重新评级（决定1–8及12）及ERCOT三项“暂缓投入”（F4、S4、N4），并已落实；11月15日批准的6项有期限Watch继续有效。其余8项仅为可签建议，7项开发商案例继续暂缓。** 这次批准只落实六项判断及必要的理由、来源、触发条件和复核日期，不批准其余评级迁移、模型规则、权重或投资支出。

**15 November review and sign-off history / 复核与签字记录：** 13项续审后曾为7项可签、6项附条件；分析师随后明确接受六项剩余案例采用有期限的Watch。24项当前合计为 **6已批准 / 11可签待签 / 7暂缓**。F1、S1、S2、S5转Watch，F6、N6保留并收窄Watch；PJM的依据是新增长期可靠性采购证据，不能再把已计入模型的年度拍卖上限当作新增收益。详见[审批与执行](#47-analyst-decision-and-authorised-implementation)。

The numerical baseline is the repository at full commit `06ec0cc530473ff98347ed8853644d1fc5381fb4`, evaluated on 15 November 2026. Independent review reproduced **204 return/rank/grade cells and 144 case return/target/gap cells with no differences**. The five stored-grade moves and the two score-disagreement changes were also reproduced; `npm run test:current` passed 84/84. The original author's separate claim of 340 built-site figures matching exactly is retained as a historical report, not a newly verified browser result. Section 10 contains a self-contained read-only reproduction command and its limits.

## Sign-off sheet

Use the original decision numbers and the case codes in section 4. A decision should state its scope and any remaining conditions. Approval of this document's editing does not approve these proposed changes. Do not use an undifferentiated approval of all 17 items or all 24 cases.

| # | Decision | Review status | Recommendation and sign-off boundary |
| --- | --- | --- | --- |
| 1 | Regrade asset return on the headline model | **已批准并实施 / Approved and applied, 16 Nov** | On the basis in items 2–3, accept Poland 3→4, Ireland 1→2, Germany 5→4, NEM 4→3 and Tokyo 2→1. This approves a relative asset grade, not a market call or a change to return assumptions. |
| 2 | Which case is graded | **已批准 / Approved: A, 16 Nov** | Use the card's recommended play at its hours, with zero price for RTB project rights and construction still payable. Show the recommended entry separately; the reference return is not an actual operating-asset purchase return. Standard-design alternative B is retained in section 2.1. |
| 3 | Which return is ranked | **已批准 / Approved: A, 16 Nov, condition kept** | Use all-equity hold for the asset-return grade. Retain the investor's sale, leverage, target and acquisition-price checks for their existing purposes. Do not silently redefine every investor's economic objective or remove its exit discipline. |
| 4 | Developer | **已批准 / Approved for the common asset grade, 16 Nov; 暂缓 / Deferred for developer economics** | It may share the asset benchmark, explicitly labelled as such. A developer conclusion requires a separate choice of develop-to-RTB, build-and-sell, or hold, with capital at risk, timing, success risk and profit/MOIC. Negative build-and-sell returns do not prove develop-to-RTB is unprofitable. |
| 5 | One stored grade per market | **已批准 / Approved, 16 Nov, condition enforced by a test and a queue check** | Retain one record while all four computed grades agree. Show each investor's own play/return/rank. A later divergence blocks an unqualified common-grade update and requires analyst review; never silently choose a default investor. |
| 6 | Ontario and Spain in the ranked population | **已批准 / Approved, 16 Nov** | Keep all 17 priced markets ranked. Ontario and Spain stay ungraded; Saudi Arabia remains unpriced and excluded. |
| 7 | Finland | **已批准 / Approved, 16 Nov** | Keep practitioner grade 4 and distinguish it from computed grade 5. No automatic conversion or mismatch error against the practitioner judgement. |
| 8 | Germany | **已批准并实施 / Approved and applied, 16 Nov** | Accept 5→4 on the new basis; retire the now-inapplicable fund score note from current display while preserving history. |
| 9 | Comparison engine afterwards | **已实施 / Applied 16 Nov on the analyst's instruction** | Retain design comparison, value sorting, secured-share and downside calculations with their basis named. Its ahead/behind flag is diagnostic, not a veto over the headline target test or the analyst's call. It stops supplying the asset-return grade and investment-call return sentence. |
| 10 | The 24 call cases | **部分批准 / Part approved: 9 of 24** | Decide case by case using section 4: **9 approved** (6 bounded Watch on 15 November; ERCOT Pass for F4, S4 and N4 on 16 November), 8 recommendations ready but unsigned, and 7 developer cases deferred. Sections 4.6–4.7 record the evidence, six explicit approvals and implementation boundary. The original 4 Pass / 8 Watch / 12 kept package is superseded. |
| 11 | Score notes | **已实施 / Applied for F4, S4, N4; others conditional** | Use the revised scoped drafts only after the associated call is approved and its conditions are closed. D3/D5 remain deferred. Recompute flags for the final selected subset. |
| 12 | Grade reasons | **已批准并实施 / Approved and applied, 16 Nov** | Replace 14 derived reasons without hard-coded current returns. Make Poland's wording investor-specific: grant cohort for fund/strategic/developer asset benchmarks, capacity case for the new entrant. Preserve historical reasons. |
| 13 | Stale-reason check | **已实施 / Applied 16 Nov on the analyst's instruction** | Replace the asset-return text comparison with a derived-grade consistency check. Respect practitioner records, valid held views, pins and missing/ungraded records; detect per-investor divergence separately. |
| 14 | Readiness flag | **已实施 / Applied 16 Nov on the analyst's instruction: A** | Remove the unused aggregate field after confirming its consumers. Keep underlying project checks. Clearing a return target is not proof of investment readiness. |
| 15 | Investor weights and score readings | **表头已更正 / Header corrected 16 Nov; 暂缓 / full endorsement deferred** | Acknowledge the current working set and correct its misleading header during authorised implementation. Arithmetic is sound; suitability, developer treatment and cheque-size conventions remain for review. Do not mark the entire methodology signed off. |
| 16 | Score bands | **可签 / Ready to leave unchanged** | Current scored cases span 47.1–82.9. That describes this snapshot, not every possible score. Do not change bands merely to suppress disagreement flags. |
| 17 | Legacy fixture | **已确认 / Confirmed: no refresh** | No refresh. Neither comparison-engine numbers nor `legacy-baseline.json` should change. Never use `test:baseline` as a check. |

“Approved” means the analyst explicitly accepted the specified case and scope; “Ready” remains a recommendation awaiting approval; “Conditional” requires the stated choice/evidence; “Deferred” recommends no new approval. Only the six Approved Watch cases in section 4.7 may be applied in this release. Dates do not automatically change calls or grant a spending budget.

## 1. The regrade

**Conclusion.** Ranking the return the reader sees on the card, instead of the comparison engine's return, moves five stored grades and leaves nine where they are. Finland's own-basis grade is not overridden.

**The rule, unchanged.** Markets are ranked from the highest return to the lowest. Grade = 6 − (rank × 5 ÷ number of markets, rounded up). With 17 priced markets: ranks 1–3 are grade 5, ranks 4–6 grade 4, ranks 7–10 grade 3, ranks 11–13 grade 2, ranks 14–17 grade 1. Example: Germany is 6th of 17; 6 × 5 ÷ 17 = 1.76, rounded up to 2; 6 − 2 = 4.

**What is ranked today.** The comparison engine: before tax, no debt, 15 years, in US dollars. The strategic investor reads its hold return. The fund and the new entrant read its exit return, so their grade already differs from the stored one in three markets (Kyushu, Hokkaido, CAISO). The developer's own measure is not computed, so it reads the stored grade.

**What is proposed.** The headline model: after tax, nominal, 20 years, local currency. The figure is the all-equity hold return of the case on the investor's card: the recommended play at its hours, bought ready-to-build at zero price for the project rights, with construction still to pay. US cases use non-FEOC supply with the 30% credit. Germany's case assumes 36 months to operation. The "recommended entry" column shows how the investor is advised to enter; the return is always the ready-to-build case, as on the site.

**Stored record.** "Derived" records are overridden by the computed grade. "Practitioner" records (Finland) are not. Ontario, Saudi Arabia and Spain have no record and stay ungraded (ruling of 31 October).

### Infrastructure fund (the default view)

| Market | Stored grade | Today: engine exit return · rank · grade | Grade used today | Case graded | Recommended entry | All-equity hold return | Rank | Computed grade | Move |
| --- | --- | --- | ---: | --- | --- | ---: | ---: | ---: | --- |
| Western Australia | 5 (derived, 2026-11-10) | 27.40% · 1 of 17 · 5 | 5 | Reserve Capacity Mechanism · 8h | co-investment | 14.35% | 1 of 17 | 5 | unchanged |
| Finland | 4 (practitioner, 2026-10-12) | 11.47% · 5 of 17 · 4 | 4 | Trading and reserves under a negotiated floor · 2h | ready-to-build | 13.41% | 2 of 17 | 5 | stays 4 (own basis); computed 5 |
| Italy | 5 (derived, 2026-10-23) | 17.17% · 2 of 17 · 5 | 5 | Capacity market · 4h | ready-to-build | 11.61% | 3 of 17 | 5 | unchanged |
| Poland | 3 (derived, 2026-10-23) | 5.45% · 8 of 17 · 3 | 3 | Grant-funded merchant · 4h · 37.3% grant | ready-to-build | 11.44% | 4 of 17 | 4 | 3 → 4 ▲ |
| Romania | 4 (derived, 2026-10-23) | 14.94% · 4 of 17 · 4 | 4 | Merchant · 2h | operating | 11.20% | 5 of 17 | 4 | unchanged |
| Germany | 5 (derived, 2026-10-30) | 15.25% · 3 of 17 · 5 | 5 | Toll · 4h · 36 months to operation | ready-to-build | 9.15% | 6 of 17 | 4 | 5 → 4 ▼ |
| NEM (Australia) | 4 (derived, 2026-11-01) | 8.66% · 6 of 17 · 4 | 4 | Tender award · 4h | operating | 7.37% | 7 of 17 | 3 | 4 → 3 ▼ |
| CAISO | 3 (derived, 2026-11-01) | −0.54% · 13 of 17 · 2 | 2 | Resource adequacy · 4h · non-FEOC supply with the 30% credit | operating | 6.39% | 8 of 17 | 3 | 2 → 3 ▲ |
| Great Britain | 3 (derived, 2026-10-29) | 1.01% · 9 of 17 · 3 | 3 | Toll · 4h | operating | 4.99% | 9 of 17 | 3 | unchanged |
| Ontario | no record | 6.31% · 7 of 17 · 3 | — | Capacity contract · 8h (standard design; no play written) | — | 4.72% | 10 of 17 | 3 | ranked, not graded |
| Ireland | 1 (derived, 2026-11-01) | −3.22% · 15 of 17 · 1 | 1 | Capacity market · 6h candidate | ready-to-build | 4.43% | 11 of 17 | 2 | 1 → 2 ▲ |
| Kyushu | 2 (derived, 2026-10-23) | 0.48% · 10 of 17 · 3 | 3 | Long-term auction award · 9h build / 6h obligation | operating | 4.07% | 12 of 17 | 2 | 3 → 2 ▼ |
| Spain | no record | −2.51% · 14 of 17 · 1 | — | Merchant · 4h (standard design; no play written) | — | 4.06% | 13 of 17 | 2 | ranked, not graded |
| Tokyo | 2 (derived, 2026-10-29) | 0.28% · 11 of 17 · 2 | 2 | Long-term auction award · 9h build / 6h obligation | operating | 3.99% | 14 of 17 | 1 | 2 → 1 ▼ |
| Hokkaido | 1 (derived, 2026-10-23) | −0.20% · 12 of 17 · 2 | 2 | Long-term auction award · 9h build / 6h obligation | operating | 3.80% | 15 of 17 | 1 | 2 → 1 ▼ |
| PJM | 1 (derived, 2026-11-10) | −6.82% · 16 of 17 · 1 | 1 | Capacity auction · 4h · non-FEOC supply with the 30% credit | ready-to-build | 2.70% | 16 of 17 | 1 | unchanged |
| ERCOT | 1 (derived, 2026-10-17) | −12.30% · 17 of 17 · 1 | 1 | Toll · 2h · non-FEOC supply with the 30% credit | ready-to-build | 0.53% | 17 of 17 | 1 | unchanged |
| Saudi Arabia | no record | withheld | — | Return withheld | — | — | — | — | — |

### Strategic investor

| Market | Stored grade | Today: engine hold return · rank · grade | Grade used today | Case graded | Recommended entry | All-equity hold return | Rank | Computed grade | Move |
| --- | --- | --- | ---: | --- | --- | ---: | ---: | ---: | --- |
| Western Australia | 5 (derived, 2026-11-10) | 21.55% · 1 of 17 · 5 | 5 | Reserve Capacity Mechanism · 8h | greenfield | 14.35% | 1 of 17 | 5 | unchanged |
| Finland | 4 (practitioner, 2026-10-12) | 11.38% · 5 of 17 · 4 | 4 | Trading and reserves under a negotiated floor · 2h | greenfield | 13.41% | 2 of 17 | 5 | stays 4 (own basis); computed 5 |
| Italy | 5 (derived, 2026-10-23) | 14.60% · 2 of 17 · 5 | 5 | Capacity market · 4h | greenfield | 11.61% | 3 of 17 | 5 | unchanged |
| Poland | 3 (derived, 2026-10-23) | 7.42% · 7 of 17 · 3 | 3 | Grant-funded merchant · 4h · 37.3% grant | greenfield | 11.44% | 4 of 17 | 4 | 3 → 4 ▲ |
| Romania | 4 (derived, 2026-10-23) | 13.70% · 4 of 17 · 4 | 4 | Merchant · 2h | greenfield | 11.20% | 5 of 17 | 4 | unchanged |
| Germany | 5 (derived, 2026-10-30) | 13.86% · 3 of 17 · 5 | 5 | Merchant · 4h · 36 months to operation | greenfield | 10.01% | 6 of 17 | 4 | 5 → 4 ▼ |
| NEM (Australia) | 4 (derived, 2026-11-01) | 8.15% · 6 of 17 · 4 | 4 | Tender award · 4h | greenfield | 7.37% | 7 of 17 | 3 | 4 → 3 ▼ |
| CAISO | 3 (derived, 2026-11-01) | 3.21% · 10 of 17 · 3 | 3 | Resource adequacy · 4h · non-FEOC supply with the 30% credit | greenfield | 6.39% | 8 of 17 | 3 | unchanged |
| Great Britain | 3 (derived, 2026-10-29) | 4.54% · 9 of 17 · 3 | 3 | Capacity Market · 4h | greenfield | 5.81% | 9 of 17 | 3 | unchanged |
| Ontario | no record | 6.81% · 8 of 17 · 3 | — | Capacity contract · 8h (standard design; no play written) | — | 4.72% | 10 of 17 | 3 | ranked, not graded |
| Ireland | 1 (derived, 2026-11-01) | 1.73% · 15 of 17 · 1 | 1 | Capacity market · 6h candidate | greenfield | 4.43% | 11 of 17 | 2 | 1 → 2 ▲ |
| Kyushu | 2 (derived, 2026-10-23) | 2.94% · 11 of 17 · 2 | 2 | Long-term auction award · 9h build / 6h obligation | greenfield | 4.07% | 12 of 17 | 2 | unchanged |
| Spain | no record | 2.58% · 13 of 17 · 2 | — | Merchant · 4h (standard design; no play written) | — | 4.06% | 13 of 17 | 2 | ranked, not graded |
| Tokyo | 2 (derived, 2026-10-29) | 2.82% · 12 of 17 · 2 | 2 | Long-term auction award · 9h build / 6h obligation | greenfield | 3.99% | 14 of 17 | 1 | 2 → 1 ▼ |
| Hokkaido | 1 (derived, 2026-10-23) | 2.54% · 14 of 17 · 1 | 1 | Long-term auction award · 9h build / 6h obligation | greenfield | 3.80% | 15 of 17 | 1 | unchanged |
| PJM | 1 (derived, 2026-11-10) | −0.31% · 16 of 17 · 1 | 1 | Capacity auction · 4h · non-FEOC supply with the 30% credit | greenfield | 2.70% | 16 of 17 | 1 | unchanged |
| ERCOT | 1 (derived, 2026-10-17) | −5.87% · 17 of 17 · 1 | 1 | Toll · 2h · non-FEOC supply with the 30% credit | greenfield | 0.53% | 17 of 17 | 1 | unchanged |
| Saudi Arabia | no record | withheld | — | Return withheld | — | — | — | — | — |

### New market entrant

| Market | Stored grade | Today: engine exit return · rank · grade | Grade used today | Case graded | Recommended entry | All-equity hold return | Rank | Computed grade | Move |
| --- | --- | --- | ---: | --- | --- | ---: | ---: | ---: | --- |
| Western Australia | 5 (derived, 2026-11-10) | 27.40% · 1 of 17 · 5 | 5 | Reserve Capacity Mechanism · 8h | ready-to-build | 14.35% | 1 of 17 | 5 | unchanged |
| Finland | 4 (practitioner, 2026-10-12) | 11.47% · 5 of 17 · 4 | 4 | Trading and reserves under a negotiated floor · 2h | ready-to-build | 13.41% | 2 of 17 | 5 | stays 4 (own basis); computed 5 |
| Italy | 5 (derived, 2026-10-23) | 17.17% · 2 of 17 · 5 | 5 | Capacity market · 4h | ready-to-build | 11.61% | 3 of 17 | 5 | unchanged |
| Romania | 4 (derived, 2026-10-23) | 14.94% · 4 of 17 · 4 | 4 | Merchant · 2h | ready-to-build | 11.20% | 4 of 17 | 4 | unchanged |
| Poland | 3 (derived, 2026-10-23) | 5.45% · 8 of 17 · 3 | 3 | Capacity market · 4h | ready-to-build | 9.31% | 5 of 17 | 4 | 3 → 4 ▲ |
| Germany | 5 (derived, 2026-10-30) | 15.25% · 3 of 17 · 5 | 5 | Toll · 4h · 36 months to operation | ready-to-build | 9.15% | 6 of 17 | 4 | 5 → 4 ▼ |
| NEM (Australia) | 4 (derived, 2026-11-01) | 8.66% · 6 of 17 · 4 | 4 | Tender award · 4h | ready-to-build | 7.37% | 7 of 17 | 3 | 4 → 3 ▼ |
| CAISO | 3 (derived, 2026-11-01) | −0.54% · 13 of 17 · 2 | 2 | Resource adequacy · 4h · non-FEOC supply with the 30% credit | ready-to-build | 6.39% | 8 of 17 | 3 | 2 → 3 ▲ |
| Great Britain | 3 (derived, 2026-10-29) | 1.01% · 9 of 17 · 3 | 3 | Toll · 4h | operating | 4.99% | 9 of 17 | 3 | unchanged |
| Ontario | no record | 6.31% · 7 of 17 · 3 | — | Capacity contract · 8h (standard design; no play written) | — | 4.72% | 10 of 17 | 3 | ranked, not graded |
| Ireland | 1 (derived, 2026-11-01) | −3.22% · 15 of 17 · 1 | 1 | Capacity market · 6h candidate | ready-to-build | 4.43% | 11 of 17 | 2 | 1 → 2 ▲ |
| Kyushu | 2 (derived, 2026-10-23) | 0.48% · 10 of 17 · 3 | 3 | Long-term auction award · 9h build / 6h obligation | ready-to-build | 4.07% | 12 of 17 | 2 | 3 → 2 ▼ |
| Spain | no record | −2.51% · 14 of 17 · 1 | — | Merchant · 4h (standard design; no play written) | — | 4.06% | 13 of 17 | 2 | ranked, not graded |
| Tokyo | 2 (derived, 2026-10-29) | 0.28% · 11 of 17 · 2 | 2 | Long-term auction award · 9h build / 6h obligation | ready-to-build | 3.99% | 14 of 17 | 1 | 2 → 1 ▼ |
| Hokkaido | 1 (derived, 2026-10-23) | −0.20% · 12 of 17 · 2 | 2 | Long-term auction award · 9h build / 6h obligation | ready-to-build | 3.80% | 15 of 17 | 1 | 2 → 1 ▼ |
| PJM | 1 (derived, 2026-11-10) | −6.82% · 16 of 17 · 1 | 1 | Capacity auction · 4h · non-FEOC supply with the 30% credit | ready-to-build | 2.70% | 16 of 17 | 1 | unchanged |
| ERCOT | 1 (derived, 2026-10-17) | −12.30% · 17 of 17 · 1 | 1 | Toll · 2h · non-FEOC supply with the 30% credit | ready-to-build | 0.53% | 17 of 17 | 1 | unchanged |
| Saudi Arabia | no record | withheld | — | Return withheld | — | — | — | — | — |

### Developer

The developer's stated basis is a development multiple, which the current scoring path does not compute. Today it therefore reads the stored grade. The table below tests the proposed common **asset** benchmark only. It does not grade develop-to-RTB profit, risk-adjusted development MOIC or developer capital turnover. Approval of this benchmark does not approve any developer call in section 4.

| Market | Stored grade | Today: engine figure | Grade used today | Case graded | Recommended entry | All-equity hold return | Rank | Computed grade | Move |
| --- | --- | --- | ---: | --- | --- | ---: | ---: | ---: | --- |
| Western Australia | 5 (derived, 2026-11-10) | none computed | 5 | Reserve Capacity Mechanism · 8h | greenfield | 14.35% | 1 of 17 | 5 | unchanged |
| Finland | 4 (practitioner, 2026-10-12) | none computed | 4 | Trading and reserves under a negotiated floor · 2h | greenfield | 13.41% | 2 of 17 | 5 | stays 4 (own basis); computed 5 |
| Italy | 5 (derived, 2026-10-23) | none computed | 5 | Capacity market · 4h | greenfield | 11.61% | 3 of 17 | 5 | unchanged |
| Poland | 3 (derived, 2026-10-23) | none computed | 3 | Grant-funded merchant · 4h · 37.3% grant | greenfield | 11.44% | 4 of 17 | 4 | 3 → 4 ▲ |
| Romania | 4 (derived, 2026-10-23) | none computed | 4 | Merchant · 2h | greenfield | 11.20% | 5 of 17 | 4 | unchanged |
| Germany | 5 (derived, 2026-10-30) | none computed | 5 | Merchant · 4h · 36 months to operation | greenfield | 10.01% | 6 of 17 | 4 | 5 → 4 ▼ |
| NEM (Australia) | 4 (derived, 2026-11-01) | none computed | 4 | Tender award · 4h | greenfield | 7.37% | 7 of 17 | 3 | 4 → 3 ▼ |
| CAISO | 3 (derived, 2026-11-01) | none computed | 3 | Resource adequacy · 4h · non-FEOC supply with the 30% credit | greenfield | 6.39% | 8 of 17 | 3 | unchanged |
| Great Britain | 3 (derived, 2026-10-29) | none computed | 3 | Capacity Market · 4h | greenfield | 5.81% | 9 of 17 | 3 | unchanged |
| Ontario | no record | none computed | — | Capacity contract · 8h (standard design; no play written) | — | 4.72% | 10 of 17 | 3 | ranked, not graded |
| Ireland | 1 (derived, 2026-11-01) | none computed | 1 | Capacity market · 6h candidate | greenfield | 4.43% | 11 of 17 | 2 | 1 → 2 ▲ |
| Kyushu | 2 (derived, 2026-10-23) | none computed | 2 | Long-term auction award · 9h build / 6h obligation | greenfield | 4.07% | 12 of 17 | 2 | unchanged |
| Spain | no record | none computed | — | Merchant · 4h (standard design; no play written) | — | 4.06% | 13 of 17 | 2 | ranked, not graded |
| Tokyo | 2 (derived, 2026-10-29) | none computed | 2 | Long-term auction award · 9h build / 6h obligation | greenfield | 3.99% | 14 of 17 | 1 | 2 → 1 ▼ |
| Hokkaido | 1 (derived, 2026-10-23) | none computed | 1 | Long-term auction award · 9h build / 6h obligation | greenfield | 3.80% | 15 of 17 | 1 | unchanged |
| PJM | 1 (derived, 2026-11-10) | none computed | 1 | Capacity auction · 4h · non-FEOC supply with the 30% credit | greenfield | 2.70% | 16 of 17 | 1 | unchanged |
| ERCOT | 1 (derived, 2026-10-17) | none computed | 1 | Toll · 2h · non-FEOC supply with the 30% credit | greenfield | 0.53% | 17 of 17 | 1 | unchanged |
| Saudi Arabia | no record | withheld | — | Return withheld | — | — | — | — | — |

### Ties and near-ties

Grade boundaries sit after ranks 3, 6, 10 and 13. On the recommended basis, for the fund:

| Boundary | Just above | Just below | Gap | Risk |
| --- | --- | --- | ---: | --- |
| 5 / 4 | Italy 11.606% | Poland 11.438% | 0.17 points | A small input revision swaps them: Italy to 4, Poland to 5 |
| 4 / 3 | Germany 9.146% | NEM 7.371% | 1.78 points | Stable |
| 3 / 2 | Ontario 4.719% | Ireland 4.433% | 0.29 points | Ireland could reach 3 |
| 2 / 1 | Spain 4.063% | Tokyo 3.988% | 0.08 points | **Near-tie.** Tokyo's fall to 1 rests on this gap, and on Spain being counted (decision 6). Kyushu (4.067%) is 0.004 points above Spain |

No two markets tie exactly. For the new entrant the 5 / 4 gap is wider (Italy over Romania by 0.40 points); the other three boundaries are the same. These figures move only when a market's inputs are revised in a pull request, never on the daily data refresh: the headline model does not read live prices or live exchange rates. Today's engine ranking has the same weakness (Spain over Hokkaido by 0.05 points at the 2 / 1 boundary).

## 2. Design choices inside the ruling

**2.1 Recommended case or standard design (decision 2).** Recommended: grade the case on the card. The reason for the ruling is that Italy's grade quoted 14.6% beside a card showing 11.6%; ranking a different figure recreates that mismatch. The dimension's definition would become "the investor's recommended case on the investment model". It depends on the recommended play, not solely on the market. Poland uses the grant-funded cohort for the fund, strategic investor and developer asset benchmark, but the capacity case for the new entrant. The common grade happens to agree; the return, rank and reason need not. The alternative keeps the standard-design definition and swaps only the model:

| Market | Recommended case (fund): hold · rank · grade | Standard reference design | Standard design: hold · rank · grade | Recommended case, 15 graded markets only |
| --- | --- | --- | --- | --- |
| Western Australia | 14.35% · 1 · **5** | Capacity contract · 7h | 14.45% · 1 · **5** | 1 of 15 · **5** |
| Finland | 13.41% · 2 · **5** | Toll or floor · 2h | 13.41% · 2 · **5** | 2 of 15 · **5** |
| Italy | 11.61% · 3 · **5** | Capacity contract · 4h | 11.61% · 3 · **5** | 3 of 15 · **5** |
| Poland | 11.44% · 4 · **4** | Merchant · 4h | 7.73% · 6 · **4** | 4 of 15 · **4** |
| Romania | 11.20% · 5 · **4** | Merchant · 2h | 11.20% · 4 · **4** | 5 of 15 · **4** |
| Germany | 9.15% · 6 · **4** | Merchant · 4h | 10.01% · 5 · **4** | 6 of 15 · **4** |
| NEM (Australia) | 7.37% · 7 · **3** | Long-term auction award · 4h | 7.37% · 7 · **3** | 7 of 15 · **3** |
| CAISO | 6.39% · 8 · **3** | Capacity contract · 4h | 6.39% · 8 · **3** | 8 of 15 · **3** |
| Great Britain | 4.99% · 9 · **3** | Capacity contract · 4h | 5.81% · 9 · **3** | 9 of 15 · **3** |
| Ontario | 4.72% · 10 · **3** | Capacity contract · 8h | 4.72% · 10 · **3** | not in the set |
| Ireland | 4.43% · 11 · **2** | Capacity contract · 4h | 3.98% · 14 · **1** | 10 of 15 · **2** |
| Kyushu | 4.07% · 12 · **2** | Long-term auction award · 9h | 4.07% · 11 · **2** | 11 of 15 · **2** |
| Spain | 4.06% · 13 · **2** | Merchant · 4h | 4.06% · 12 · **2** | not in the set |
| Tokyo | 3.99% · 14 · **1** | Long-term auction award · 9h | 3.99% · 13 · **2** | 12 of 15 · **2** |
| Hokkaido | 3.80% · 15 · **1** | Long-term auction award · 9h | 3.80% · 15 · **1** | 13 of 15 · **1** |
| PJM | 2.70% · 16 · **1** | Capacity contract · 4h | 2.70% · 16 · **1** | 14 of 15 · **1** |
| ERCOT | 0.53% · 17 · **1** | Toll or floor · 2h | 0.53% · 17 · **1** | 15 of 15 · **1** |

**2.2 Which return (decisions 3 and 4).** Recommend all-equity hold as the common asset-return grading basis. The existing target qualifier tests all-equity hold and levered hold; the sale route remains part of acquisition valuation/price-ceiling discipline, not a third input to that qualifier. Preserve those distinctions. A common asset grade does not make a fund a perpetual holder or measure a developer's own business return. The alternative 5-year sale ranking depends on the buyer's assumed yield and would move Great Britain from 3 to 1; that sensitivity is useful exit evidence, not a reason to suppress the sale test. No target premium, discount rate or exit yield is changed by this recommendation.

For the developer, distinguish three cash-flow paths before judging its opportunity: development to RTB sale, construction to operating sale, and hold. A separate proposal must state sunk and contingent development costs, failure probability, security release, peak capital, sale proceeds and timing. The build-and-sell column below is one modelled path; its negative results cannot settle the economics of an earlier RTB sale. Until that work is reviewed, developer verdict changes are deferred.

| Market | Recommended: hold return · grade (fund case) | Fund: 5-year sale return · rank · grade | New entrant: 5-year sale return · rank · grade | Fund: lower of hold and sale · rank · grade | Developer: build-and-sell return · rank · grade |
| --- | --- | --- | --- | --- | --- |
| Western Australia | 14.35% · 5 | 14.13% · 1 · **5** | 14.13% · 1 · **5** | 14.13% · 1 · **5** | 39.19% · 1 · **5** |
| Finland | 13.41% · 5 | 13.89% · 2 · **5** | 13.89% · 2 · **5** | 13.41% · 2 · **5** | 34.59% · 2 · **5** |
| Italy | 11.61% · 5 | 10.88% · 3 · **5** | 10.88% · 3 · **5** | 10.88% · 3 · **5** | 18.23% · 3 · **5** |
| Poland | 11.44% · 4 | 9.70% · 4 · **4** | 6.45% · 6 · **4** | 9.70% · 4 · **4** | −7.54% · 5 · **4** |
| Romania | 11.20% · 4 | 9.22% · 5 · **4** | 9.22% · 4 · **4** | 9.22% · 5 · **4** | −14.12% · 6 · **4** |
| Germany | 9.15% · 4 | 6.87% · 6 · **4** | 6.87% · 5 · **4** | 6.87% · 6 · **4** | 4.81% · 4 · **4** |
| NEM (Australia) | 7.37% · 3 | 4.40% · 7 · **3** | 4.40% · 7 · **3** | 4.40% · 7 · **3** | −18.51% · 10 · **3** |
| CAISO | 6.39% · 3 | 1.74% · 9 · **3** | 1.74% · 9 · **3** | 1.74% · 9 · **3** | −17.73% · 9 · **3** |
| Great Britain | 4.99% · 3 | −1.02% · 15 · **1** | −1.02% · 15 · **1** | −1.02% · 15 · **1** | −30.71% · 13 · **2** |
| Ontario | 4.72% · 3 | 2.21% · 8 · **3** | 2.21% · 8 · **3** | 2.21% · 8 · **3** | −21.71% · 12 · **2** |
| Ireland | 4.43% · 2 | 0.58% · 13 · **2** | 0.58% · 13 · **2** | 0.58% · 13 · **2** | −31.62% · 14 · **1** |
| Kyushu | 4.07% · 2 | 1.51% · 10 · **3** | 1.51% · 10 · **3** | 1.51% · 10 · **3** | −16.91% · 7 · **3** |
| Spain | 4.06% · 2 | −0.36% · 14 · **1** | −0.36% · 14 · **1** | −0.36% · 14 · **1** | −38.36% · 17 · **1** |
| Tokyo | 3.99% · 1 | 1.39% · 11 · **2** | 1.39% · 11 · **2** | 1.39% · 11 · **2** | −17.52% · 8 · **3** |
| Hokkaido | 3.80% · 1 | 1.10% · 12 · **2** | 1.10% · 12 · **2** | 1.10% · 12 · **2** | −19.27% · 11 · **2** |
| PJM | 2.70% · 1 | −2.33% · 16 · **1** | −2.33% · 16 · **1** | −2.33% · 16 · **1** | −37.99% · 16 · **1** |
| ERCOT | 0.53% · 1 | −2.86% · 17 · **1** | −2.86% · 17 · **1** | −2.86% · 17 · **1** | −35.16% · 15 · **1** |

**2.3 One grade per market or per investor (decision 5).** The four proposed grades agree in all 17 priced markets at this snapshot. One stored grade can therefore be retained now, without claiming that the four cases or their ranks are identical. Test the complete investor-specific ranking on every relevant model/view change. If the grades diverge, stop the common-grade update and obtain a ruling on separate grades or a declared common reference case. Do not select the fund's result silently or overwrite a held/practitioner judgement. Exact ties also need an explicit, deterministic treatment before implementation; near-ties remain visible as in section 1 and are not evidence of a material economic difference.

**2.4 The ranked set (decision 6).** Ontario and Spain are priced and are counted today; Saudi Arabia is not priced and is not counted. Keeping them changes nothing in the method. Dropping them changes one grade: Tokyo stays 2 (last column of the table in 2.1).

**2.5 What the comparison engine is still for (decision 9).** Retain the design grid, route/duration comparison, value per MW, current shortlist value sorting, secured-share calculation and downside/debt-cover outputs. Name their comparison-engine basis wherever they could be confused with the investment card. The ahead/behind flag remains a diagnostic for review; it cannot justify retaining a call merely to avoid a flag, as the original D1/D2 proposals did. Its rank stops supplying the asset-return grade; the corresponding column must use the headline model and state the selected case. The briefing's computed investment-call sentence must also use that source. Do not claim the engine has only a design-selection role while continuing to use its values for cross-market shortlist sorting. Any later change to that sorting is a separate explicit decision.

## 3. Knock-on effects

**Conclusion.** In the grade-only overlay, two score-disagreement flags change, both for the fund: Germany's clears and CAISO's appears. The original analysis reported no shortlist, tier or home-pick changes for that overlay; the later call changes in section 4 require their own selected-subset simulation.

- Infrastructure fund · Germany: flag clears
- Infrastructure fund · CAISO: flag appears

- Germany (fund): the score falls from 76.8 to 74.8 and now reads Build position, one step from the stored Situational, so the flag clears. The score sits 0.2 below the next band. The score note written on 30 October explains a flag that no longer exists.
- CAISO (fund): the fund's grade rises from 2 to 3 because the stored grade of 3 was being overridden by the engine's exit rank. The score rises from 73.3 to 77.4 and reads Advance, two steps from Situational. The record already carries a score note for this.

The original grade-only simulation compared all four shortlists row by row and reported identical order, featured picks and a 16-item queue. Shortlists are ordered by call and design value, with score used for remaining ties; tiers follow the stored call. These findings concern that specific overlay and date. They do not establish that correcting triggers, changing calls or selecting different plays leaves the queue and page picks unchanged.

Across the actual moves in this plan, scores change by **1.875 to 4.5 points**. The effect is the investor's asset-return score weight multiplied by the difference between the two grade readings; it is not constant across grade steps. For example, Germany's fund score changes by 13.5% × (85 − 100) = −2.025 points; the new entrant changes by 12.5% × (85 − 100) = −1.875 points. Asset return contributes 12.5%–18% of the composite, so a high composite score alone does not establish that a project clears its absolute return target.

### Infrastructure fund

| Market | Baseline stored call | Return grade used | Score (of 100) | Score reads as | Disagreement flag |
| --- | --- | ---: | ---: | --- | --- |
| Western Australia | Situational | 5 | 65.7 | Build position | — |
| NEM (Australia) | Situational | 4 → 3 | 81.9 → 78.5 | Advance | flagged |
| Great Britain | Situational | 3 | 75.3 | Advance | flagged |
| Germany | Situational | 5 → 4 | 76.8 → 74.8 | Advance → Build position | **flagged → —** |
| Italy | Advance | 5 | 81.4 | Advance | — |
| Ireland | Watch | 1 → 2 | 60.6 → 64.0 | Build position | flagged |
| Romania | Situational | 4 | 50.9 | Situational | — |
| Poland | Watch | 3 → 4 | 49.1 → 52.5 | Situational | — |
| Tokyo | Situational | 2 → 1 | 73.2 → 69.9 | Build position | — |
| Kyushu | Situational | 3 → 2 | 73.0 → 69.0 | Build position | — |
| Hokkaido | Situational | 2 → 1 | 65.5 → 62.1 | Build position | — |
| PJM | Watch | 1 | 53.0 | Situational | — |
| ERCOT | Situational | 1 | 65.3 | Build position | — |
| CAISO | Situational | 2 → 3 | 73.3 → 77.4 | Build position → Advance | **— → flagged** |
| Finland | Situational | 4 | 66.7 | Build position | — |

### Strategic investor

| Market | Baseline stored call | Return grade used | Score (of 100) | Score reads as | Disagreement flag |
| --- | --- | ---: | ---: | --- | --- |
| Western Australia | Build position | 5 | 70.6 | Build position | — |
| NEM (Australia) | Build position | 4 → 3 | 80.8 → 76.3 | Advance | — |
| Great Britain | Build position | 3 | 73.8 | Build position | — |
| Germany | Build position | 5 → 4 | 79.9 → 77.2 | Advance | — |
| Italy | Build position | 5 | 82.9 | Advance | — |
| Ireland | Build position | 1 → 2 | 60.7 → 65.2 | Build position | — |
| Romania | Situational | 4 | 61.7 | Build position | — |
| Poland | Situational | 3 → 4 | 60.1 → 64.6 | Build position | — |
| Tokyo | Build position | 2 → 1 | 72.8 → 68.3 | Build position | — |
| Kyushu | Build position | 2 | 65.2 | Build position | — |
| Hokkaido | Build position | 1 | 54.6 | Situational | — |
| PJM | Situational | 1 | 59.7 | Situational | — |
| ERCOT | Situational | 1 | 61.5 | Build position | — |
| CAISO | Situational | 3 | 70.4 | Build position | — |
| Finland | Build position | 4 | 76.0 | Advance | — |

### New market entrant

| Market | Baseline stored call | Return grade used | Score (of 100) | Score reads as | Disagreement flag |
| --- | --- | ---: | ---: | --- | --- |
| Western Australia | Not accessible | 5 | 62.1 | Build position | — |
| NEM (Australia) | Not accessible | 4 → 3 | 76.0 → 72.8 | Advance → Build position | — |
| Great Britain | Situational | 3 | 72.0 | Build position | — |
| Germany | Build position | 5 → 4 | 69.7 → 67.8 | Build position | — |
| Italy | Build position | 5 | 72.5 | Build position | — |
| Ireland | Build position | 1 → 2 | 62.7 → 65.8 | Build position | — |
| Romania | Watch | 4 | 47.1 | Situational | — |
| Poland | Situational | 3 → 4 | 51.1 → 54.2 | Situational | — |
| Tokyo | Build position | 2 → 1 | 68.2 → 65.1 | Build position | — |
| Kyushu | Build position | 3 → 2 | 68.9 → 65.2 | Build position | — |
| Hokkaido | Situational | 2 → 1 | 62.9 → 59.8 | Build position → Situational | — |
| PJM | Watch | 1 | 52.2 | Situational | — |
| ERCOT | Situational | 1 | 60.3 | Build position | — |
| CAISO | Situational | 2 → 3 | 65.9 → 69.7 | Build position | — |
| Finland | Build position | 4 | 70.7 | Build position | — |

### Developer

| Market | Baseline stored call | Return grade used | Score (of 100) | Score reads as | Disagreement flag |
| --- | --- | ---: | ---: | --- | --- |
| Western Australia | Not accessible | 5 | 54.9 | Situational | — |
| NEM (Australia) | Build position | 4 → 3 | 81.4 → 77.9 | Advance | — |
| Great Britain | Watch | 3 | 72.5 | Build position | flagged |
| Germany | Build position | 5 → 4 | 72.5 → 70.4 | Build position | — |
| Italy | Build position | 5 | 65.8 | Build position | — |
| Ireland | Build position | 1 → 2 | 60.1 → 63.6 | Build position | — |
| Romania | Situational | 4 | 50.4 | Situational | — |
| Poland | Situational | 3 → 4 | 52.3 → 55.8 | Situational | — |
| Tokyo | Build position | 2 → 1 | 66.0 → 62.5 | Build position | — |
| Kyushu | Build position | 2 | 63.1 | Build position | — |
| Hokkaido | Situational | 1 | 54.5 | Situational | — |
| PJM | Situational | 1 | 51.3 | Situational | — |
| ERCOT | Situational | 1 | 64.0 | Build position | — |
| CAISO | Situational | 3 | 64.4 | Build position | — |
| Finland | Build position | 4 | 68.5 | Build position | — |

## 4. Case-by-case call review

**Updated 16 November 2026.** F4, S4 and N4 (ERCOT Pass) are approved and applied; see section 4.8. The count is now 9 approved, 8 ready but unsigned and 7 deferred.

**Conclusion as of 15 November.** The 24 cases remain in scope. The earlier 11 ready / 6 conditional / 7 deferred review is superseded by the analyst decision in section 4.7: **6 approved bounded Watch cases, 11 ready but unsigned recommendations, and 7 deferred developer cases**. The six approvals are F1/S1/S2/F6/S5/N6 only. The other 18 cases, all grade/methodology decisions and the separate Build position review are not approved by this instruction.

### 4.1 Corrected decision rules

The existing [verdict meanings](../src/governance/investability.js) distinguish a specific opportunity (Situational), a named trigger plus review date (Watch), a structural mismatch without a credible trigger inside the investment horizon (Pass), and an access knockout (Not accessible). Apply them as follows:

1. **Situational needs an identifiable investable situation.** Name the cohort/contract/entry route and what price or terms would make it investable. A return shortfall under two percentage points is not an approved tolerance and is removed as a decision rule. A near miss remains below target.
2. **Watch needs a named information or decision trigger, a causal link and a review date.** An official event date may be unknown. Record that uncertainty and the evidence to seek; do not invent a date. On the review date, assess the outcome, credibility, materiality and horizon, then retain, amend or propose Pass. Absence of an official date alone does not require Pass.
3. **Separate event date, result date, effective period and analyst review date.** A bid deadline does not reveal the award price; a compliance year does not promise a publication date; a long-stop does not price successor revenue. An adverse change may justify Watch while an asset is revalued, but is not itself a mechanism for closing the return gap.
4. **Pass must specify its scope and reopening conditions.** For F4/S4/N4, the reviewed scope is the current reference new-build/RTB strategy at modelled terms. The monthly adequacy outlook does not supply toll pricing. Reconsider only on verifiable changes to executable contract terms, eligible costs/support or acquisition economics sufficient to rerun the target test. This does not conclude that every operating asset or development-rights transaction in the market is uninvestable.
5. **Scores and comparison-engine flags inform review; they do not decide a call.** Do not retain Situational solely because Watch would trigger an ahead/behind warning. D1/D2 need their own economic case. Do not change score bands to make warnings disappear.
6. **Developer calls require developer economics.** The hold and levered figures below remain reference-asset diagnostics. They do not measure development-to-RTB margins or risk-adjusted returns on development capital. Decision 4 must be resolved before a new developer call is applied.
7. **Separate readiness to approve Watch from readiness to invest.** A verified reason to wait, a precise evidence request, a bounded review horizon and a stopping/reclassification rule can close the review of a Watch recommendation. The future evidence being watched need not already exist. This does not close asset diligence, prove an upside catalyst, approve spending or make an adverse rule change improve returns. If an event is already priced into the reference case, do not count it again as the mechanism for closing the gap; explain any remaining reason to allocate attention to it.

### 4.2 Date and evidence corrections

| Cases | Correct fact and source | Consequence for the decision |
| --- | --- | --- |
| N3, D4; related Japan trigger records | Bidding runs **19–26 January 2027**. Capacity-calculation particulars are registered **27 January–3 February 2027**. Results are expected roughly three months after bidding ends, in the following fiscal year; the publication timing is indicative. [Official schedule, published 9 October 2026](https://www.occto.or.jp/news/013615.html), schedule (4), (5) and results note. | Replace the record's incorrect 3 February “bidding closes” wording in a later authorised content change. Keep 31 March 2027 as a progress checkpoint only. Indicative results timing is around April 2027, not a confirmed date; review results when published and record a fresh checkpoint if delayed. |
| S3, N2, D3; fund CAISO wording consistency | The storage foldback adjustment applies to the **2027 RA compliance year**; unit-specific outage accreditation is a separate **2028** change. This establishes no January 2027 publication date for a project's applicable reduction. [Official reliability report](https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/energy-division/documents/summer-2021-reliability/tracking-energy-development/tn271805_20260803t154342_2026-third-quarterly-joint-reliability-planning-assessment-report.pdf), printed p.21; [existing evidence record](immersive-experience-plan/caiso-build-evidence.md), current-action correction. | Watch for applicable qualifying MW and the executed contract's allocation of the impact; then rerun valuation. Review progress by 31 March 2027. Do not assume an average reduction, guaranteed disclosure date or automatic recovery of the return shortfall. |
| F5 Ireland | **30 September 2027** is the long-stop in the extension of existing DS3 arrangements, not an auction result or a commitment to publish successor prices. [Regulatory decision SEM-25-031](https://www.semcommittee.com/files/semcommittee/2025-06/SEM-25-031%20System%20Services%20Regulated%20Arrangements%20to%20FASS%20-%20The%20Gap%20-%20Decision%20Paper.pdf), section 3. | Retain a time-bounded Watch only with a defined evidence task: confirm the latest transition arrangements, eligibility and payable services, then quantify the effect. Keep the existing 31 March 2027 analyst checkpoint; do not infer a successor go-live date from the long-stop. |
| F6, S5, N6, D6 PJM | The **December 2026** 2029/30 capacity auction is a scheduled pricing event. [Operator's auction report](https://insidelines.pjm.com/pjm-capacity-auction-procures-138318-mw-of-generation-resources-as-work-continues-to-address-growing-electricity-demand/). The record's **11 January 2027** rating-posting plan and **28 February 2027** backstop suspension/end-date are separate accreditation/regulatory milestones, not three price announcements. [Repository evidence](immersive-experience-plan/pjm-build-evidence.md). | Verify current schedules and actual outcomes separately. Link price and eligible capacity to a quantified return/price-ceiling sensitivity. A future auction alone does not establish that the large gap can close. Keep 31 March 2027 as the review checkpoint. |
| S2 and N5 Romania | **30 October 2026** is the stored original closing date, now requiring verification against an amendment. **2 November 2026 is explicitly the analyst's internal review date**, not an official result date: see `ro-grant-status-review.note` in `view/markets/ro.json`. The ministry call page and linked amendment/guide endpoints could not be read on 15 November; the reported extension to 15 November remains unverified here. See E-RO-2 in section 4.6. | Correct the event semantics; do not describe both dates as external events or infer an award from an expired checkpoint. Record official amended timetable/status when accessible. N5's Watch can be justified by the defined contract/eligibility task without falsely closing this grant evidence gap. |

Official date corrections above change this plan only. The corresponding live view records remain unchanged and are explicitly listed for follow-up in section 11.

### 4.3 Individual recommendations

Gaps are percentage points: return minus target. Targets are model outputs from the government-rate snapshot, investor/stage premium and merchant-risk component; the levered target is two points higher. The financial columns below are unchanged from the independently checked baseline. “Conditional” and “Deferred” are review statuses, not new platform verdict labels.

The Romanian “Merchant” reference rows include the existing 20% capital-grant assumption and no negotiated floor. The Polish grant rows include the selected 37.3% grant assumption. Neither percentage establishes a target asset's award; section 4.6 separates these baselines from the no-grant counterfactuals.

### Infrastructure fund

| # | Market | Baseline stored call | Case | All-equity return | Levered return | Target (all-equity / levered) | Gap in points (all-equity / levered) | Trigger / timing | Review status and proposal | Required rationale or follow-up | Record in scope |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| F1 | Poland | Situational · below target | Grant-funded merchant · 4h | 11.44% | 11.97% | 13.25% / 15.25% | −1.81 / −3.28 | Existing eligible grant cohort; internal first review 30 November 2026, stop review 31 January 2027 | **Approved — bounded Watch** | Verify the target grant, payment, transfer consent, executable cost/contract terms, fund financing and exit. No identifiable project and executable terms by the stop review: propose Pass for this route. No duplicated grant upside; section 4.7. | `view/markets/pl.json` → plays.pl-grant-4h.calls.infraFund |
| F2 | Poland | Watch | Capacity market · 4h | 9.31% | 9.61% | 12.93% / 14.93% | −3.62 / −5.31 | Successor terms; official date unverified | **Ready — retain bounded Watch** | E-PL-3 supports the need to verify the new long-term route. Seek enacted framework, storage eligibility, tenor, factor and price; review by 31 March 2027. Existing awarded contracts and shorter auctions are separate routes, not assumed unavailable. | `view/markets/pl.json` → verdicts.infraFund |
| F3 | Germany | Situational · below target | Toll · 4h | 9.15% | 10.45% | 9.54% / 11.54% | −0.39 / −1.09 | Record includes May 2027; contract/price evidence governs the case | **Ready — retain Situational** | Retain the named signed-toll/floor situation and requirement for executable terms/price to clear target. The current reference case still misses; this does not approve an actual investment or rely on proximity to target. | `view/markets/de.json` → verdicts.infraFund |
| F4 | ERCOT | Situational · below target | Toll · 2h | 0.53% | −2.63% | 10.14% / 12.14% | −9.61 / −14.76 | Adequacy outlook: 4 December 2026; no toll price supplied | **Approved 16 Nov — Pass current reference strategy** | Scope to the modelled new-build/RTB strategy. Record verifiable contract/cost/price reopening conditions and the scoped score note; an adequacy report alone cannot reprice a toll. | `view/markets/ercot.json` → verdicts.infraFund |
| F5 | Ireland | Watch | Capacity market · 6h candidate | 4.43% | 3.65% | 9.67% / 11.67% | −5.24 / −8.03 | FASS revised plan and payable terms; no confirmed go-live date here | **Ready — retain bounded Watch** | E-IE-1/2 confirm unresolved programme dependencies and a separate DS3 long-stop. Watch for revised roadmap, final rules and accessible revenue terms; review by 31 March 2027. No uplift or new six-hour award is assumed. | `view/markets/ie.json` → verdicts.infraFund |
| F6 | PJM | Watch | Capacity auction · 4h | 2.70% | 1.55% | 12.08% / 14.08% | −9.37 / −12.53 | Long-term RBP eligibility/terms; analyst participation-path review 31 March 2027 | **Approved — bounded Watch** | E-PJM-4/5 supply the additional reason to wait. Verify target qualification, actual payment term, lender and exit treatment. Only an established participation path justifies following proposed May results; otherwise propose scoped Pass. | `view/markets/pjm.json` → verdicts.infraFund |

### Strategic investor

| # | Market | Baseline stored call | Case | All-equity return | Levered return | Target (all-equity / levered) | Gap in points (all-equity / levered) | Trigger / timing | Review status and proposal | Required rationale or follow-up | Record in scope |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| S1 | Poland | Situational · below target | Grant-funded merchant · 4h | 11.44% | 11.97% | 12.25% / 14.25% | −0.81 / −2.28 | Existing eligible grant cohort; internal first review 30 November 2026, stop review 31 January 2027 | **Approved — bounded Watch** | Watch cooperation on existing eligible grant projects. Quantify any net strategic synergy separately; current greenfield/reference assumptions are unchanged. Same stop review as F1; section 4.7. | `view/markets/pl.json` → verdicts.strategic |
| S2 | Romania | Situational · below target | Merchant · 2h | 11.20% | 11.45% | 12.75% / 14.75% | −1.55 / −3.30 | Grant eligibility plus priced floor; internal first review 30 November 2026, stop review 31 January 2027 | **Approved — bounded Watch** | Verify the target grant and complete floor/fee/share/credit/termination terms; retain the no-grant check. No target and executable terms by the stop review: propose scoped Pass. Section 4.7. | `view/markets/ro.json` → verdicts.strategic |
| S3 | CAISO | Situational · below target | Resource adequacy · 4h | 6.39% | 6.23% | 9.59% / 11.59% | −3.20 / −5.37 | 2027 compliance rule; asset-specific evidence date unknown | **Ready — move to bounded Watch** | E-CA-1 closes the rule/timing basis for waiting. Seek applicable MW, deliverability and contract allocation before valuation. Proposed early checkpoint 30 November 2026; retain 31 March 2027 outer review. This approves an evidence task, not an assumed recovery. | `view/markets/caiso.json` → verdicts.strategic |
| S4 | ERCOT | Situational · below target | Toll · 2h | 0.53% | −2.63% | 9.14% / 11.14% | −8.61 / −13.76 | No investment-changing condition evidenced in this record | **Approved 16 Nov — Pass current reference strategy** | Apply the same new-build/RTB scope and verifiable reopening conditions as F4. Do not turn absence of a dated event into proof against every possible transaction. | `view/markets/ercot.json` → verdicts.strategic |
| S5 | PJM | Situational · below target | Capacity auction · 4h | 2.70% | 1.55% | 11.08% / 13.08% | −8.37 / −11.53 | Long-term RBP eligibility/buildability; analyst participation-path review 31 March 2027 | **Approved — bounded Watch** | Verify project rights, site, delivery schedule, construction cost and net strategic benefit alongside RBP terms. No executable path: propose scoped Pass. Ordinary auction upside is already priced. | `view/markets/pjm.json` → verdicts.strategic |

### New market entrant

| # | Market | Baseline stored call | Case | All-equity return | Levered return | Target (all-equity / levered) | Gap in points (all-equity / levered) | Trigger / timing | Review status and proposal | Required rationale or follow-up | Record in scope |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| N1 | Poland | Situational · below target | Capacity market · 4h | 9.31% | 9.61% | 13.93% / 15.93% | −4.62 / −6.31 | Successor terms; official date unverified | **Ready — move to bounded Watch** | E-PL-3 and the same bounded evidence task as F2; review by 31 March 2027. Establish a new entrant's accessible route and contract terms. Do not apply the grant cohort's eligibility or assume historic long-term awards are available to a fresh project. | `view/markets/pl.json` → verdicts.foreignFirstTimer |
| N2 | CAISO | Situational · below target | Resource adequacy · 4h | 6.39% | 6.23% | 11.59% / 13.59% | −5.20 / −7.37 | 2027 compliance rule; asset-specific evidence date unknown | **Ready — move to bounded Watch** | Same E-CA-1 evidence task and proposed early checkpoint as S3, with this investor's own return/access requirements. No assumed January publication, reduction factor or favourable entry price. | `view/markets/caiso.json` → verdicts.foreignFirstTimer |
| N3 | Hokkaido | Situational · below target | Long-term auction award · 9h build / 6h obligation | 3.80% | 2.75% | 8.14% / 10.14% | −4.34 / −7.39 | 26 January bid close; results indicative around April 2027 | **Ready — move to bounded Watch** | E-JP-1/2: October registration windows have passed. Limit the task to verified eligible registered assets or a separately diligenced acquisition route; do not promise fresh entry to this round. Keep 31 March progress review; proposed result-status check 30 April is internal, not a promised publication. | `view/markets/jp_hokkaido.json` → verdicts.foreignFirstTimer |
| N4 | ERCOT | Situational · below target | Toll · 2h | 0.53% | −2.63% | 11.14% / 13.14% | −10.61 / −15.76 | No investment-changing condition evidenced in this record | **Approved 16 Nov — Pass current reference strategy** | Use F4's scope and reopening conditions. Keep investor-access restrictions separate from the economic Pass conclusion. | `view/markets/ercot.json` → verdicts.foreignFirstTimer |
| N5 | Romania | Watch | Merchant · 2h | 11.20% | 11.45% | 14.75% / 16.75% | −3.55 / −5.30 | Executable floor/entry terms and verified grant status sought | **Ready — retain bounded Watch** | E-RO-1 supports seeking a floor contract; E-RO-2 remains open. Review by 31 January 2027, with a proposed 30 November status check. Explicitly test no grant and avoid adding an assumed award twice. The existing return is not a grant-free merchant case. | `view/markets/ro.json` → verdicts.foreignFirstTimer |
| N6 | PJM | Watch | Capacity auction · 4h | 2.70% | 1.55% | 13.08% / 15.08% | −10.37 / −13.53 | Low-priority eligible partnership/acquisition route; analyst review 31 March 2027 | **Approved — bounded Watch** | First verify identifiable target/partner, eligibility transfer, entry price, governance and execution. No concrete access route: stop this investigation and propose scoped Pass; no automatic extension. | `view/markets/pjm.json` → verdicts.foreignFirstTimer |

### Developer

All seven decisions are **Deferred**. Their asset returns remain useful diagnostics; the pending business model determines whether developing to RTB, building to sell, or holding is appropriate. Preserve the existing records while completing the review; preservation is not a fresh endorsement of their economic merits.

| # | Market | Baseline stored call | Case | All-equity return | Levered return | Target (all-equity / levered) | Gap in points (all-equity / levered) | Trigger / timing | Review status and proposal | Evidence needed to resolve deferral | Record in scope |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| D1 | Poland | Situational · below target | Grant-funded merchant · 4h | 11.44% | 11.97% | 15.25% / 17.25% | −3.81 / −5.28 | Named, undated | **Deferred — reconsider Situational** | Development cash flows, grant eligibility/transfer and buyer terms. Being in the comparison engine's top third, or avoiding a warning, is not sufficient. | `view/markets/pl.json` → verdicts.developer |
| D2 | Romania | Situational · below target | Merchant · 2h | 11.20% | 11.45% | 15.75% / 17.75% | −4.55 / −6.30 | Named, undated; outcomes outstanding | **Deferred — reconsider Situational** | Development margin, capital at risk, buyer price and resolved event evidence. Remove the original flag-avoidance rationale. | `view/markets/ro.json` → verdicts.developer |
| D3 | CAISO | Situational · below target | Resource adequacy · 4h | 6.39% | 6.23% | 12.59% / 14.59% | −6.20 / −8.37 | 2027 compliance rule; disclosure date unknown | **Deferred — Watch direction only** | Developer exit economics plus applicable qualifying MW and contract risk allocation. Review progress by 31 March 2027; do not apply the generic asset score note yet. | `view/markets/caiso.json` → verdicts.developer |
| D4 | Hokkaido | Situational · below target | Long-term auction award · 9h build / 6h obligation | 3.80% | 2.75% | 9.12% / 11.12% | −5.32 / −8.37 | 26 January 2027 bid close; results indicative around April | **Deferred — Watch direction only** | Correct the trigger, establish developer eligibility and exit economics, and distinguish the 31 March progress review from later award evidence. | `view/markets/jp_hokkaido.json` → verdicts.developer |
| D5 | ERCOT | Situational · below target | Toll · 2h | 0.53% | −2.63% | 12.14% / 14.14% | −11.61 / −16.76 | No priced development exit established | **Deferred — asset Pass signal only** | Test develop-to-RTB separately from build-and-sell. A common hold benchmark does not establish the developer's return; do not copy F4/S4/N4 automatically. | `view/markets/ercot.json` → verdicts.developer |
| D6 | PJM | Situational · below target | Capacity auction · 4h | 2.70% | 1.55% | 14.08% / 16.08% | −11.37 / −14.53 | December 2026 auction; separate accreditation evidence | **Deferred — Watch direction only** | Price the development route, rights, cost and time to sale; test capacity-price/accreditation effects on the buyer and developer. Progress review by 31 March 2027. | `view/markets/pjm.json` → verdicts.developer |
| D7 | Great Britain | Watch | Capacity Market · 4h | 5.81% | 5.02% | 14.16% / 16.16% | −8.34 / −11.14 | Named trigger, official date unknown | **Deferred — existing Watch remains** | Specify the development exit and missing evidence, keeping the 31 March 2027 review date. No automatic Pass for an undated trigger and no fresh economic endorsement yet. | `view/markets/gb.json` → verdicts.developer |

### 4.4 Additional Build position cases to review

The scope also includes **16 Build position cases whose selected all-equity hold return is below its target**, with zero entered RTB-rights price rather than a quoted transaction price. **Fifteen fail both current return tests; Italy for the developer clears the levered test while missing the all-equity test.** That distinction is independently reproduced in section 10. The Italian case remains in the developer-business-model review, but must not be described as failing both tests. These cases must not be lost because section 4.3 starts with Situational/Watch:

| Investor | Markets | Required follow-up before reaffirming the call |
| --- | --- | --- |
| Infrastructure fund | None | No additional case in this category. |
| Strategic investor | NEM, Great Britain, Kyushu, Tokyo, Hokkaido, Ireland (6) | For each, distinguish low-cost preparation from capital commitment; document why preparing now creates value, allowed pre-commitment spend, named trigger, review date and stopping condition. Quantify any claimed strategic benefit separately. |
| New entrant | Germany, Kyushu, Tokyo, Ireland (4) | For each, document the accessible entry route, costs before commitment, executable price/contract conditions, trigger and stopping condition. A high composite score does not prove the target is met. |
| Developer | Italy, Germany, NEM, Kyushu, Tokyo, Ireland (6) | First resolve the developer return path; then document development capital, success risk, time to sale, buyer terms, preparation budget and stopping condition. Italy passes the current levered-hold test, which still does not establish development-to-RTB profit. |

This is a required review inventory, not an instruction to downgrade all 16. Build position can rationally preserve an option while entry takes time, but the option, permitted cost and future commitment condition must be explicit. Do not invent an investment budget in this document.

### 4.5 Score notes and application boundary

The original all-24 simulation is superseded as an approval package. It reported seven score disagreements among twelve moves (F4, S3, S4, N2, N4, D3, D5). That is historical analysis, not a forecast for the revised subset. After actual case selection, recompute shortlist order, featured picks, queue items, score flags and play selection together. All current Pass candidates still have composite scores above the Pass band; explain the difference between market fit and absolute project economics rather than suppressing the flag.

Draft notes for later case-specific approval, with no hard-coded model results:

- **ERCOT F4/S4/N4, scoped Pass.** EN: "The composite score describes market fit across several dimensions. Pass applies to the current reference new-build/ready-to-build strategy: the modelled case falls short of this investor's return tests. The adequacy outlook does not establish executable toll pricing. Reopen the case when verified contract, cost or acquisition terms justify a fresh target test." 中文："综合评分描述市场在多个维度的适配程度。回避结论适用于当前参考新建／可开工策略：模型情景未达到该类投资者的回报测试要求。供需充裕度展望不能证明可执行的租赁价格。取得可核验的合同、成本或收购条件，且足以支持重新测算时，再复核是否达标。" Do not reuse this note for D5 until developer economics is resolved.
- **CAISO S3/N2, Watch.** EN: "The composite score describes market fit. This call waits for the asset's applicable qualifying capacity and contractual allocation of the rule change to be established, then for valuation at executable terms. The reference case is below target; the compliance-year change alone establishes neither a disclosure date nor an improvement in returns." 中文："综合评分描述市场适配程度。本结论等待明确项目适用的合格容量及合同对规则变化的风险分配，再按可执行条件重新估值。参考情景低于目标；适用年度的变化本身既不能确定数据公布日期，也不能证明回报会改善。" D3 remains deferred; separately check whether the existing fund note still explains the current basis.

Any later content change must update the relevant `because`, `where`, `despite`, action, trigger and review-date text as well as the call and score note. For example, a positive all-equity hold return below target should not be described without qualification as “losing money”. The briefing must say Pass rather than “closed”, which belongs to Not accessible. Ensure that a Pass scoped to a reference strategy is not rendered as a blanket market prohibition; if the existing market-record/UI contract cannot preserve that scope, resolve the play-level representation before applying the call.

For any implementation, prepare one inspectable view-writer batch for the explicitly approved subset, with check mode, before/after records, bilingual reasons, exact record paths and the relevant conditions marked complete. Preserve changelog authorship and revert identifiers. Section 4.7 records the analyst-authorised application of the six Watch cases; all other proposed applications remain unsigned.

### 4.6 Evidence follow-up of the 13 conditional cases

**Review date: 15 November 2026, Australia/Perth.** This follow-up changes review recommendations only. It does not close investment diligence or authorise model/view edits. A source's publication date, this review date and a proposed future analyst checkpoint are different fields. A failed retrieval is recorded as an access limitation, not proof that a document or award does not exist.

#### Evidence register and limits

The following primary materials were read during this follow-up unless explicitly marked otherwise. Evidence strength refers to the stated fact, not to an entire market or project. Local records are traceability aids; their earlier checks are not relabelled as newly verified.

| Evidence | Publication / locator and source | Established fact | Boundary / what remains open |
| --- | --- | --- | --- |
| E-PL-1 | NFOŚiGW, **8 December 2025**, [programme-selection announcement](https://redakcja.www.gov.pl/web/nfosigw/magazyny-energii-elektrycznej-z-dofinansowaniem-z-funduszu-modernizacyjnego), paragraphs on ranking, approval and support | **Strong.** Ranking is not a binding grant commitment. The announcement describes subsequent approvals and planned signing, not completed signing for every listed project. | The 12 December updated list and 170 signed-grant count retain their **2 November repository check**, not a fresh recount: [existing audit, section 3.1](immersive-experience-plan/pl-build-evidence.md). The recorded arithmetic is `3,734,999,999.99 / 10,003,742,317.00 × 100 = 37.3360%`; 37.3% is a cohort ratio/model assumption, not the target's award. The programme/list and signed-register endpoints failed to reopen in this follow-up. |
| E-PL-2 | [Grant regulation of 5 March 2025](https://api.sejm.gov.pl/eli/acts/DU/2025/280/text.pdf), §§6, 9, 13, pp.2–3; [capacity-market consolidated Act](https://eli.gov.pl/api/acts/DU/2026/1400/text/T/D20261400L.pdf), art.62, p.37 | **Strong.** The grant regulation links completion/operation to 36 months after aid award; end-2028 is an outer bound, not every project's own deadline. Article 62 requires investment-aid deductions for the covered new/modernised capacity units and spreads the deduction across the contract. | Obtain the actual award date, amount, eligible-cost basis, disbursement, delay/clawback exposure and change-of-control/transfer terms. Do not add gross capacity revenue to a grant case without the applicable deduction. Current F1/S1 are merchant grant cases; this is a diligence condition for any proposed capacity stacking, not a finding that their baseline already double-counts it. |
| E-PL-3 | [Consolidated capacity-market Act, October 2026 text](https://eli.gov.pl/api/acts/DU/2026/1400/text/T/D20261400L.pdf), art.29(3)–(4), p.19; art.25, p.17 | **Strong for the cited text; Fair for current route completeness.** The listed main-auction timetable ends at delivery 2030. A fresh long-term 2031+ route is not established by that text. | No new executable successor package was located in this review. This is not proof that no proposal exists, nor that existing awards, secondary transactions or quarterly/additional routes are closed. Seek enactment, storage eligibility, tenor, accreditation and payment terms before underwriting a new award. |
| E-IE-1 | SEM Committee, **23 June 2025**, [SEM-25-031](https://www.semcommittee.com/files/semcommittee/2025-06/SEM-25-031%20System%20Services%20Regulated%20Arrangements%20to%20FASS%20-%20The%20Gap%20-%20Decision%20Paper.pdf), Decisions 1–2, printed pp.9–10 | **Strong.** The DS3 tariff extension ends at the earlier relevant DASSA transition or 30 September 2027; TSOs must arrange procurement beyond the regulated arrangements. | This does not set a successor price, prove an award for a new six-hour asset, or remove service-volume/performance risk. |
| E-IE-2 | EirGrid/SONI, **21 October 2026**, [workshop presentation](https://cms.eirgrid.ie/sites/default/files/publications/FM-Industry-Workshop-Presentation-October-2026.pdf.pdf), slides 17–18; [October newsletter](https://www.eirgrid.ie/sites/default/files/publications/Future-Markets-Newsletter-Issue-37-October-2026.pdf), p.3 | **Strong.** The workshop reports unresolved critical dependencies and PIR4.0 preparation; detailed dates await re-planning. The newsletter identifies continuing code/platform work and a forthcoming performance/price-cap consultation. | These are concrete evidence tasks for F5, not confirmed commencement or payable prices. Check subsequent final publications; a consultation, workshop or price cap is not a contracted revenue floor. The existing trading line already contains assumed services income; do not add a separate services uplift without reconciling it. |
| E-CA-1 | California agencies, **August 2026**, [Third Quarterly Joint Reliability Planning Assessment](https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/energy-division/documents/summer-2021-reliability/tracking-energy-development/tn271805_20260803t154342_2026-third-quarterly-joint-reliability-planning-assessment-report.pdf), printed p.21 / PDF p.28 | **Strong.** The report distinguishes 2027 storage qualifying-capacity refinement from 2028 UCAP. Neither identifies a January publication date or a uniform project reduction. | Verify that the asset and buyer fall within the applicable RA regime, then reconcile tested capability, qualifying MW, deliverability and contract risk allocation. Missing asset evidence is the object of Watch, not a reason to pretend an investable valuation has already been established. |
| E-JP-1 | OCCTO, **9 October 2026**, [FY2026 auction schedule](https://www.occto.or.jp/news/013615.html), items (1)–(5) and results note | **Strong.** Company registration was 13–16 October and resource registration 19–23 October. The later bid window does not reopen those steps. Section 4.2 records the bid/particulars/result distinctions. | N3 can watch eligible registered assets or a separately checked acquisition route. Registration, eligibility and transferability of a particular asset remain unproven. There is no new-round entry promise for an unregistered project. |
| E-JP-2 | OCCTO, **2 September 2026**, [FY2026 auction guidelines](https://www.occto.or.jp/assets/260902_boshuyoukou_long_2026.pdf), pp.10, 27–28 | **Strong.** The lithium-ion category has a 400 MW procurement cap. The rules require connection-study evidence and identify cell-manufacturer certification documentation and change restrictions. | Check the target's exact category, accepted registration, cell eligibility, charging constraints, award price and remaining obligations. The 9h-build/6h-obligation case is the existing model design, not proof that every asset qualifies. |
| E-PJM-1 | PJM, **3 September 2026**, [2029/30 planning parameters](https://www.pjm.com/-/media/DotCom/markets-ops/rpm/rpm-auction-info/2029-2030/2029-2030-planning-period-parameters-for-base-residual-auction-report.pdf), printed pp.1,4 | **Strong.** The published 2029/30 collar is USD337.83/UCAP-MW-day cap and USD181.91 floor; the report places the auction in December 2026. | A cap is not a clearing price, a multi-year contract or a future minimum. Confirm subsequent orders/parameters before using it in an actual transaction. |
| E-PJM-2 | PJM, **30 October 2026**, [2026 ELCC/RRS](https://www.pjm.com/-/media/DotCom/planning/res-adeq/elcc/2026-pjm-elcc-rrs.pdf), p.60 Table 36, four-hour row, **2029/2030 ELCC Class Rating** column | **Strong.** The four-hour class rating is 57%. This is distinct from simulated hourly performance, longer-duration classes and future-year indicative ratings. | This supports the cap × class-rating arithmetic below, not certification of a particular unit. The model already uses 57% for the first renewal and a duration-specific indicative path afterwards; a new rating must be mapped to the right delivery year. |
| E-PJM-3 | [Official RPM schedule workbook](https://www.pjm.com/-/media/DotCom/markets-ops/rpm/rpm-auction-info/rpm-auction-schedule.xlsx); [repository audit, sections 4 and 7](immersive-experience-plan/pjm-build-evidence.md) | **Dated check retained.** The 3 November audit records bids 9–15 December, planned results 22 December 2026, and the separate 2030/31 rating checkpoint 11 January 2027. | The web reader could not parse the workbook on 15 November, so those exact dates are not presented as freshly revalidated. Keep them labelled scheduled and recheck at use. The 28 February backstop milestone is a separate regulatory status check; it does not establish an accepted final design, a procurement award or a price. |
| E-PJM-4 | PJM, **9 November 2026**, [RBP amendment filing, ER27-454-000](https://www.pjm.com/pjmfiles/directory/etariff/FercDockets/9977/20261109%20er27-454-000.pdf), pp.2–4, section 18.5(b), and affidavit paragraph 6 | **Strong for the filed framework; target eligibility remains open.** Eligible new storage can participate; commitments can extend up to 15 years. The submission updates the previously accepted/suspended framework. | A filing is not a target award or complete implementation clearance. Verify final rules, project rights/qualification, actual payment, credit, performance and transfer terms. The procurement-wide weighted price constraint is not a guaranteed project payment. |
| E-PJM-5 | PJM, **29 October 2026**, [amended procurement announcement](https://insidelines.pjm.com/pjm-files-amended-reliability-backstop-proposal/), “New Procurement Dates” | **Strong for the proposal.** Proposed launch 1 March, bid close 28 March, quantity determination 28 April and results 10 May **2027**. | These dates remain proposed. The 31 March analyst review checks rules and an actionable target participation path, not published results. Continuing to the result stage requires a fresh analyst decision on that evidence. |
| E-RO-1 | Contract counterparty, **4 February 2026**, [public optimisation-agreement announcement](https://www.gen-igroup.com/news/gen-i-and-rpower-sign-long-term-optimisation-agreement-for-one-of-romania-s-largest-battery-energy-storage-projects/), agreement paragraphs | **Fair.** The counterparty reports a two-hour battery agreement combining revenue sharing with a minimum guarantee, from commercial operation to the fifth anniversary of full revenue activation. | This establishes a commercial precedent, not an offer to the reference asset. Guarantee amount, revenue share and full credit/termination terms are undisclosed. A floor can alter revenue risk, debt sizing and target, but cannot be added on top of gross merchant income without the contract waterfall. |
| E-RO-2 | [Ministry call page](https://energie.gov.ro/lansare-apel-sprijinirea-investitiilor-in-dezvoltarea-instalatiilor-autonome-stand-alone-de-stocare-in-baterii-a-energiei-electrice-cu-finantare-din-fondul-pentru-modernizare-p/); [government amendment pointer](https://oportunitati-ue.gov.ro/fondul-pentru-modernizare-a-fost-modificat-apelul-sprijinirea-investitiilor-in-dezvoltarea-instalatiilor-autonome-standalone-de-stocare-in-baterii-a-energiei-electrice-cu-finantare-din/); [ministry guide pointer](https://energie.gov.ro/wp-content/uploads/2026/08/Anexa_OME_915_2026_Ghid-solicitant_stand-alone_publicat_M-Of_680-Bis.pdf) | **Thin / access unresolved.** All three returned timeouts in this follow-up. The official legal-portal pointers for the guide/scheme also returned errors. The identified extension to 15 November is a lead, not a verified amendment in this review. | The amended closing time, evaluation status, awards, target eligibility and payment remain unverified. Do not write “no award published”, “grant secured” or “call definitely closed”. The 2 November item is an internal review checkpoint. Obtain the official amended notice and target evidence before relying on support. |

#### What changes in each case, and what the analyst still decides

“可签” below remains an unsigned recommendation for seven cases. The six formerly conditional cases were subsequently approved as bounded Watch in section 4.7; their investment diligence remains open. The approval does not establish a transaction, grant or investment return.

| Case | 本轮结论 | 已关闭的复核问题 / 判断理由 | 待办、复核期限与停止条件 |
| --- | --- | --- | --- |
| **F1** — Poland fund | **已批准：转Watch** | 有效补贴、可交易项目及基金经济条件尚待核实；补贴已计入参考测算。 | 30 November 2026首次复核，31 January 2027停止条件复核；无具体项目和可执行条款时提交该路线Pass建议。 |
| **F2** — Poland fund capacity | **可签：保留有期限的Watch** | E-PL-3支持等待新长期容量路径的具体条款；事件未定日期不构成Pass理由。 | 31 March 2027前取得框架/准入/期限/容量因子/支付条款并判断其经济重要性。仍无可识别路径时，提交缩小范围或Pass建议，延长Watch须另写理由。 |
| **F5** — Ireland fund | **可签：保留有期限的Watch** | E-IE-1/2把旧费率截止与新机制定价分开，并明确实际尚待完成的事项。 | 观察修订路线图、最终服务规则和可获得收入条款，按六小时资产重算。31 March 2027复核；无可获得的收入路径时，不凭long-stop日期继续承诺回报。 |
| **F6** — PJM fund | **已批准：保留并收窄Watch** | E-PJM-4/5提供长期采购调查路径，年度拍卖上限不能重复计入。 | 31 March 2027核查规则和具体目标参与路径；仅路径成立才提交继续跟进拟议5月结果的决定，否则提交当前策略Pass建议。 |
| **S1** — Poland strategic | **已批准：转Watch** | 优先既有获补贴项目合作开发；战略协同须单独量化。 | 期限同F1；未证明协同不得进入收入，不适用于自动认可新绿地项目补贴。 |
| **S2** — Romania strategic | **已批准：转Watch** | 优先核实补贴资格及保底合同；保留无补贴检验。 | 30 November 2026首次、31 January 2027截止复核；无目标和可执行条款时提交该路线Pass建议。 |
| **S3** — CAISO strategic | **可签：转为有期限的Watch** | E-CA-1足以说明应等待项目容量与合同风险分配的核验；并不证明有回报改善。 | 建议30 November 2026先查2027交付影响，保留31 March 2027外层复核。取得项目MW/合同/价格后再估值；无可执行路径时提交Pass或缩小范围的建议。 |
| **S5** — PJM strategic | **已批准：转Watch** | 同F6，并核实并网、场地、投运和建设成本；未量化战略价值不支持Situational。 | 31 March 2027复核，继续或退出条件同F6；不自动升级或顺延。 |
| **N1** — Poland new entrant | **可签：转为有期限的Watch** | 新进入者使用容量情景；E-PL-3支持等待准入和条款，不能借用既有补贴批次证明可进入。 | 31 March 2027复核可进入路径、权利转移和支付条款；既有中标资产另行尽调。没有路径时重新判断范围与期限。 |
| **N2** — CAISO new entrant | **可签：转为有期限的Watch** | E-CA-1与S3相同，使用新进入者自己的门槛和准入条件。 | 同S3的早期/外层复核；项目MW、风险承担和购入价均未获认可，不能由战略投资者的测算代替。 |
| **N3** — Hokkaido new entrant | **可签：限定合资格资产的Watch** | E-JP-1/2解决日期混淆，并补充已过注册窗口、类别上限和项目资格约束。 | 不承诺未注册项目参加本轮。先核实目标资格及可转移权利，再看中标合同与购入条件；31 March查进度，建议30 April 2027查结果状态。若目标无资格且无合法收购路径，应退出该目标，不自动否定全市场。 |
| **N5** — Romania new entrant | **可签：保留有期限的Watch** | E-RO-1提供可调查的合同路径；把E-RO-2的缺口明确保留，不再依赖过期“事件”证明收益。 | 建议30 November 2026补查官方状态，31 January 2027复核保底/准入/购入价。单独测试无补贴；届时仍无可执行报价或可核实资格时，提交范围调整或Pass建议，不自动顺延。 |
| **N6** — PJM new entrant | **已批准：保留低优先级Watch** | 限定合资格项目合作、共同投资或收购路线，先证明准入。 | 31 March 2027前取得目标/伙伴、资格转移及进入条款；无明确路径时优先停止并提交范围限定的Pass建议。 |

The 30 November and 30 April checkpoints above are **new reviewer proposals**, not official events or stored review dates. Existing March/January checkpoints remain as labelled. All later record changes must update the bilingual rationale, action, trigger semantics and review date together. None is applied by this Markdown edit. No Watch approval grants a development or diligence spending budget.

#### Additional read-only economic checks

**Grant inclusion matters.** The name “Merchant” describes Romania's revenue route; it does not mean an unsubsidised capital stack. [Current Romania inputs](../src/markets/ro/comparison.js) include `grantPct: 20`; the selected Polish grant play supplies 37.3%. The RTB adapter also applies support timing and tax treatment. These inputs are preserved for reconciliation, not newly endorsed. The following counterfactual changes only `grantPct` to zero **in memory** through the existing API; the existing rates, operating path, taxes and debt method remain in use and results are recalculated. It is a sensitivity, not a proposed published input update.

| Case | Baseline all-equity / levered IRR | No-grant all-equity / levered IRR | Existing target, all-equity / levered | Result |
| --- | ---: | ---: | ---: | --- |
| F1 — Poland fund | 11.44% / 11.97% | **7.73% / 7.48%** | 13.25% / 15.25% | Both fail with or without the assumed grant. |
| S1 — Poland strategic | 11.44% / 11.97% | **7.73% / 7.48%** | 12.25% / 14.25% | A small baseline gap is not a grant-independent investment case. |
| S2 — Romania strategic | 11.20% / 11.45% | **9.04% / 8.81%** | 12.75% / 14.75% | The model does not support adding a prospective 20% award as fresh upside. |
| N5 — Romania new entrant | 11.20% / 11.45% | **9.04% / 8.81%** | 14.75% / 16.75% | Supports waiting for executable terms, not commitment at the reference terms. |

**A lower positive RTB-rights price alone cannot repair these reference cases:** that price is already zero. For F1/S1/S2, summing the existing after-tax hold cash flows at the existing all-equity target gives the following present-value shortfalls, per MW, at the model's acquisition time. These are net cash-flow improvements required **if that hurdle and all other cash flows are held fixed**; they are not literal EPC discounts, grant top-ups, negative transaction-price offers or the model's acquisition-price ceiling. A real change in costs, grant timing, tax basis, contract risk or entry stage requires a full rerun, including leverage and exit discipline.

| Case | Model currency | Present-value shortfall per MW | Evidence needed to turn the gap into an executable condition |
| --- | --- | ---: | --- |
| F1 — Poland fund | PLN | **383,174** | Grant agreement and timing, verified cost savings or contract improvement with at least equivalent net present value; rights-transfer and construction risk also checked. |
| S1 — Poland strategic | PLN | **181,151** | Same project evidence at the strategic hurdle; any separately claimed synergy must be identified and valued by the analyst. |
| S2 — Romania strategic | RON | **275,823** | Actual grant treatment and a priced floor/entry structure. For an operating-asset acquisition, rerun the operating case at the seller's price rather than transplanting the zero-rights-price RTB result. |

**PJM materiality check.** At the published class ratings, `325 × 365 × 0.59 = USD69,988.75/MW-year` for the current cleared-vintage benchmark, while `337.83 × 365 × 0.57 = USD70,285.5315/MW-year` at the next auction's cap: only **USD296.78/MW-year, or 0.424%**, before any unit-specific adjustment. The current [renewal scenario](../src/markets/pjm/comparison.js) already rounds the latter to **70,286** in the first renewal year, then uses analyst price assumptions and duration-specific indicative credits. Therefore, **under the unchanged cap/rating pair, a cap-clearing December result adds zero price upside to that already assumed renewal year**. A lower clearing result would reduce it. This does not bound all later prices or all operating-asset values, and it is not an IRR change calculation. It closes the earlier request to check whether merely waiting for that auction supplies an unpriced upside catalyst; it does not settle whether monitoring later ratings, regulatory outcomes or acquisition terms is worth an additional Watch cycle.

**Analyst choices recorded.** The analyst selected bounded Watch for F1/S1/S2/F6/S5/N6 on 15 November 2026, after reviewing E-PJM-4/5 and the six Chinese recommendations in chat. Section 4.7 controls their scope and dates. No Situational or investment approval, additional model income, grade change, developer decision or spending authority follows from this choice.

### 4.7 Analyst decision and authorised implementation

**Decision date: 15 November 2026 (Australia/Perth).** The analyst explicitly approved: “同意这6项按你的建议采用有期限的 Watch”, requested this same document be updated, and authorised implementation, tests, commit, push and merge to **main**. The earlier broad implementation plan remains unapproved outside this six-case subset.

| Approved case | Applied decision / investigation scope | Internal review dates | Exit or continuation condition |
| --- | --- | --- | --- |
| **F1** Poland fund | Change the grant play call to Watch; existing valid-grant, transferable projects only | First 2026-11-30; stop review 2027-01-31 | Require target grant/payment/transfer evidence and executable costs/contracts plus financing/exit. Otherwise submit Pass for this route. |
| **S1** Poland strategic | Change to Watch; cooperation on existing eligible grant projects | First 2026-11-30; stop review 2027-01-31 | Same grant evidence; separately quantify net synergy and delivery costs. No target and executable terms: submit scoped Pass. |
| **S2** Romania strategic | Change to Watch; verify grant eligibility plus priced floor; keep no-grant sensitivity | First 2026-11-30; stop review 2027-01-31 | Obtain target grant and complete floor/share/fee/credit/termination terms. No target and executable terms: submit scoped Pass. |
| **F6** PJM fund | Retain Watch, focused on eligible long-term RBP projects | Participation-path review 2027-03-31 | Require actual eligible target and actionable participation path, payment/finance/exit terms. Only then seek analyst approval to follow results; otherwise submit Pass for current strategy. |
| **S5** PJM strategic | Change to Watch; eligible RBP project plus executable construction and delivery | Participation-path review 2027-03-31 | Verify site/interconnection, costs, schedule and any net synergy. Continuation rule as F6. |
| **N6** PJM new entrant | Retain low-priority Watch; eligible partnership, co-investment or acquisition path | Participation-path review 2027-03-31 | Identify partner/target, transferable eligibility, entry terms, governance and execution. Without access, prioritise stopping and submit scoped Pass. |

**Date semantics and authority.** November/January/March dates above are analyst checkpoints, not official awards. RBP dates in E-PJM-5 are proposed external milestones. March review must not be treated as a results deadline: May results can be followed only after the participation-path condition is met and the analyst records continuation. No automatic deadline extension, Pass conversion, investment commitment or spending budget is authorised. A future Pass or Situational decision requires analyst application and a fresh valuation on executable terms.

**Implementation boundary.** Use the analyst view writer for the six records, their bilingual rationale and necessary trigger/action records. Preserve all economic inputs, durations, model entry-stage assumptions, grants, financing conventions, weights, grades, fixtures and the other 18 case decisions. Keep historical changelog entries append-only. F1 is the grant-play override, not Poland’s separate fund capacity verdict. Shared factual trigger/action wording may be corrected for these approved investigations without re-signing other investors’ calls. No RBP award, multi-year payment or prospective grant is added to model cash flows. Poland’s historical story remains signed against the earlier Situational call: its existing guard must reject the new Watch tuple and fall back to research. Do not relabel that old story as newly approved; a later content review must reconcile its comparative-yield wording with the current investment judgement before reopening that entry. The current investment page reads the approved view normally.

**Concurrent work.** Continue the existing return-model worktree. The experience-format task owns experience formatting/package configuration; the chart-library task owns charts, callers and its documentation. Keep this release in the decision document, view records, focused acceptance tests and the necessary history-build pagination adjustment; use a separate built-preview port and recheck main/PR drift before merge. The implementation integrated the daily snapshot and chart-library PR #199 through main commit `986188a50bc40dc44bd8f19bdc6d7de5dbf16a39`, without conflicts or edits to those task-owned areas. Local browser checks use built-preview port 4775.

**History loading.** The added audit records exceeded the existing history first-load limit. The build plugin now pages eight records rather than sixteen, retaining every record and the unchanged 128 kB limit. The rebuilt archive passed the completeness and every market/author first-load budget checks in `tests/changes.test.js`; this adjustment changes loading granularity only.

**Execution record:** the analyst writer applied 15 audited supporting records at `2026-11-15T14:00:13.277Z`: five market verdict records, three play records (including F1’s grant-play override), and seven trigger records. Sixteen wording-only refinements followed through `2026-11-15T14:35:41.498Z`, retaining every decision, date and evidence requirement, explicitly scoping shared actions to approved investors, and reducing public payload size. These 31 append-only entries cover the same 15 record paths; each is identified as `<timestamp>-<market>-<path>`. A read-only before/after comparison reproduced identical design selection, entry stage, hold/levered returns, hurdles and capex across all 60 graded-market/investor reference rows (15 markets × 4 investors). The fund shortlist’s third row moves from the Polish grant play to the German toll play; the other three investors’ top three are unchanged.

**Implementation verification — 16 November 2026, Australia/Perth.** Approval and evidence review remain dated 15 November. After integrating main through `986188a`, the build, 97 targeted unit/view/prose/history/chart checks, 84 numerical baseline checks, 37 bundle-budget checks and all seven required confidentiality checks passed, with no skipped scan. Snapshot integrity and policy-publication approval verification passed. The 31-entry before/after reconstruction again confirmed identical economics across all 60 reference rows. The earlier focused desktop/mobile bilingual browser run passed 16/16. The full 870-case browser suite was also started locally on the integrated build, on the isolated port above.

**Release gate and local limitations.** The complete local unit run was attempted and stopped after extended Windows temporary-repository test times and an existing 100 ms policy-workflow VM timeout; it is not recorded as a full pass. Its history-budget failure was corrected and the rebuilt archive rechecked as described above. Full unit/governance CI and the PR's full-browser `full-check` job must both pass on the submitted version before merge. The PR is the release record for final local-run outcomes, exact commits, CI and merge evidence; CI's ordinary main pipeline remains the only deployment path. No baseline fixture was regenerated or test timeout relaxed.

**Unified-reader correction — 16 November 2026, Australia/Perth.** PR #200's first complete browser CI found two failures, both the Polish detailed-reference reader (desktop/mobile); the other 853 cases passed and 15 duplicate iPad cases were skipped. The existing tuple guard correctly refused the old script, but the unified reader treated that refusal as a network failure and offered a futile retry. The Poland-owned story adapter now supplies a bilingual review-status notice and a working current-research action for that exact Watch tuple. It exposes no historical investment story or figures and leaves legacy-link rejection intact. The shared reader and formatting-owned files are untouched. The revised acceptance case checks all five chapters, both languages, absence of old story content/retry buttons, and the research action. A fresh green CI on the corrected commit is required; the earlier failed run is retained in the PR record.

Correction validation passed locally: build; 100 targeted checks; 84 numerical baseline checks; 37 bundle budgets; seven required confidentiality checks with zero skips; and all ten Polish desktop/mobile browser cases. The Polish story adds 39.86 kB gzip against the unchanged 40 kB allowance. Desktop Chinese and mobile English screenshots were inspected. The correction changes availability messaging only; all six decisions, evidence tasks, dates and financial inputs remain as approved.

### 4.8 Analyst decision of 16 November 2026 and what was applied

**Decision date: 16 November 2026 (Australia/Perth).** After PR 200 the analyst asked for the reviewer's comments and recommendations to be applied and committed. Because the regrade moves grades in five markets, he was asked three explicit questions before any code was written:

| Question put | Answer |
| --- | --- |
| Sign off the regrade as recommended: the card's case, the all-equity hold return for all four investors, all 17 priced markets, Finland keeps 4, Germany 5→4, the 14 derived reasons replaced? | **"Yes, as recommended"** |
| Approve Pass for ERCOT for the fund, the strategic investor and the new entrant (the developer stays deferred)? | **"Yes, three Pass calls"** |
| The ERCOT market story is signed against the fund's Situational call, so a fund Pass closes it. Hold the fund call, retire the story, or re-sign it? | **"Pass, re-sign the story"** |

**What changed on the site.**

| Change | Detail |
| --- | --- |
| Asset-return grade | Ranked on the investment model. Five stored grades moved: Poland 3→4, Ireland 1→2 up; Germany 5→4, NEM 4→3, Tokyo 2→1 down. Nine derived grades are unchanged. Finland keeps its practitioner 4 (the model would give 5). For the fund and the new entrant, whose grade used to follow the engine's exit ranking, Kyushu 3→2, Hokkaido 2→1 and CAISO 2→3 also move. |
| Grade reasons | All 14 derived asset-return reasons now carry the date, name the investment model and type no figure. Italy no longer reads "14.6%" beside a card showing 11.6%. |
| ERCOT | Pass for the fund, the strategic investor and the new entrant, scoped to the current reference new-build case, each with a score note and a named reopening condition: verified executable toll, cost or acquisition terms. The developer call is unchanged. The fund keeps the February adequacy outlook named beside it. |
| ERCOT story | Re-signed against the Pass call, dated 16 November 2026, on the analyst's instruction and without a line-by-line re-read. Its text already says the case falls short of the fund's target even with a toll. |
| Score notes | Germany's fund note explained a flag the regrade removed and is retired. CAISO's fund note now names the basis that moved its score. |
| PJM | The December 2026 capacity auction is named again on the three Watch calls approved on 15 November. It is already priced at its cap, so it can only lower the case. It is now the next dated event on those cards. |
| Japan | The Round 4 bid close is corrected from 3 February 2027 to 26 January 2027 in Tokyo, Kyushu and Hokkaido: the three triggers, the three play actions, the decision profile and the story's evidence record. Two sentences in the Japan research tabs still say "27 January–3 February": correcting them changes the protected Japan content fingerprint, which is not regenerated without the analyst's approval. Both the organiser's schedule of 9 October 2026 and the 2 September guidelines (printed p. 9) give bids as 19–26 January; 27 January–3 February is the later registration of particulars, which had been read as the bid window. Both sources were opened on 16 November. |
| Briefing sentence | Quotes the card's return ("11.6% all-equity hold return") in place of the engine's exit return, and says "Pass on ERCOT" where it used to say a parked market "is closed". |

**What it did to scores and flags** (recomputed after the change against main before it):

- No return or target on any card moved: the hold, sale, levered and lower-of returns and the target were compared for every investor and market, with both comparison-engine returns per market, and none differ.
- Four score-disagreement flags appear, each with a note: CAISO for the fund, and ERCOT for the fund, the strategic investor and the new entrant. One clears: Germany for the fund.
- ERCOT moves to the bottom of three shortlists. Nothing else changes order. Special-opportunity picks are unchanged.
- The analyst queue keeps 15 disagreement items. The two extra "soon" items are the 30 November checkpoints set on 15 November, now inside fourteen days.

**What was built.**

| Area | Change |
| --- | --- |
| Grading | The fifths rule stands alone (`src/comparison/returnGrades.js`); the figure ranked comes from the investment model (`src/opportunities/returnGrades.js`). The briefing computes the grades once and every page reads them. |
| Definition | Asset return is defined as a common asset benchmark on one basis for all four investors. Each investor's own return objective, sale test, levered test and target are untouched. |
| Safeguards | A stored derived grade must equal the computed one, or the test suite fails and the analyst queue lists it. If the four investors' cards ever give different grades, that is reported and no default investor is chosen. A practitioner grade, a pinned grade and a held view are left alone. Equal returns keep their given order. |
| Stale-reason check | Its asset-return half is removed; the secured-share half stays. |
| Readiness flag | Removed. It could never be true and nothing read it. |
| File headers | The weights file and the vocabulary file no longer say nothing uses them. Both still say the tables are a draft awaiting the analyst's edit. No weight changed. |
| Size budgets | Three caps raised under the standing rule of 5 November (raise the cap, never cut content): the shared briefing 45→47 KiB, ERCOT 61.6→62.5 KiB, Japan 121→121.5 KiB. |

The 29 record changes were applied through the view writer by `scripts/view/content/return-model-2026-11.mjs`, authored as the analyst, one audit line each, in two batches on 16 November (26, then the three Japan play actions). Each can be undone by its id with `node scripts/view/writer.mjs revert <id>`.

**Not applied, and why.**

| Item | Why it was left |
| --- | --- |
| Romania's 2 November review | It was re-dated to 30 November on 15 November without an outcome. Only the analyst can say what that review found, so no outcome was written. |
| Analyst checkpoints stored as market events | They are labelled "Analyst checkpoint" and the 15 November approval set them that way. Separating them needs a new record type, which is a design decision. |
| Three new "call runs behind the economics" items (Poland fund and strategic, Romania strategic) | They follow from the 15 November Watch calls and the rule that this flag informs and does not decide. They stay in the queue for the analyst. |
| S3, N1, N2, N3, F2, F3, F5, N5 | Ready but unsigned. Not asked on 16 November. |
| CAISO and Romania date wording in section 4.2 | Not part of the 16 November instruction. |
| Two Japan research-tab sentences giving the bid window as 27 January–3 February | They sit inside the protected content fingerprint (`tests/fixtures/jp-sections-content.json`). The correction is ready and needs the analyst's approval to update that fingerprint. |
| Developer cases, Build position review, weights endorsement | Deferred, as before. |

**Expected and observed fixture effect.** `npm run test:current` is 84 of 84 before and after. `tests/fixtures/legacy-baseline.json` was not regenerated and does not differ.

**Checks run locally on 16 November 2026, on the built site.** Full unit suite: 1,919 of 1,920 passed; the one failure was the Japan content fingerprint, caused by correcting two research-tab sentences, which were then restored (the fingerprint test passes, 2 of 2). Numerical baseline 84 of 84. Bundle budgets 37 of 37 after the three cap raises. Built-output confidentiality scan passed with no skip. Browser tests: 294 of 294 on the pages this release touches (ERCOT, Japan and PJM stories, the shared story reader, decision, investment, opportunity and change pages, desktop and mobile), then 86 of 86 on the final build for the Japan and ERCOT stories and the approved Watch cases. The complete 870-case browser suite was not run locally; it runs in CI on a pull request with the `full-check` label and on main before a deploy.

## 5. Grade reasons that quote old figures

**Conclusion.** 68 grade texts contain a typed number (28 contain a percentage). 9 asset-return reasons quote an engine return that still matches the engine but not the card; they must be replaced because the grade's basis changes. The other figures are not part of this package.

### Asset return: replace all 14 derived reasons

| Market | Stored grade · date | What the reason says today | Comparison engine now | Headline model now (fund case) |
| --- | --- | --- | --- | --- |
| Germany | 5 · 2026-10-30 | Third of seventeen markets on the design grid's hold IRR, 13.9% (30 October 2026). | 13.9% · rank 3/17 · grade 5 | 9.1% · rank 6/17 · grade 4 |
| ERCOT | 1 · 2026-10-17 | Fifteenth of fifteen markets on the design grid's hold IRR, −5.9% (17 October 2026). | -5.9% · rank 17/17 · grade 1 | 0.5% · rank 17/17 · grade 1 |
| Great Britain | 3 · 2026-10-29 | Tenth of seventeen markets on the design grid's hold IRR, 4.5% (29 October 2026). | 4.5% · rank 9/17 · grade 3 | 5.0% · rank 9/17 · grade 3 |
| Italy | 5 · 2026-10-23 | Second of fifteen markets on hold IRR, 14.6%. | 14.6% · rank 2/17 · grade 5 | 11.6% · rank 3/17 · grade 5 |
| Hokkaido | 1 · 2026-10-23 | Thirteenth of fifteen markets on the design grid's hold IRR, 2.5% (23 October 2026). | 2.5% · rank 14/17 · grade 1 | 3.8% · rank 15/17 · grade 1 |
| Kyushu | 2 · 2026-10-23 | Eleventh of fifteen markets on the design grid's hold IRR, 2.9% (23 October 2026). | 2.9% · rank 11/17 · grade 2 | 4.1% · rank 12/17 · grade 2 |
| Tokyo | 2 · 2026-10-29 | Thirteenth of seventeen markets on the design grid's hold IRR, 2.8% (29 October 2026). | 2.8% · rank 12/17 · grade 2 | 4.0% · rank 14/17 · grade 1 |
| PJM | 1 · 2026-11-10 | 2026-11-10: Retain the current grade and Wait call. Fair evidence: the existing hold-return fifth rule uses… | -0.3% · rank 16/17 · grade 1 | 2.7% · rank 16/17 · grade 1 |
| Poland | 3 · 2026-10-23 | Seventh of fifteen markets on the design grid's hold IRR, 7.4% (23 October 2026). | 7.4% · rank 7/17 · grade 3 | 11.4% · rank 4/17 · grade 4 |
| Romania | 4 · 2026-10-23 | Fifth of fifteen markets on the design grid's hold IRR, 13.7% (23 October 2026). | 13.7% · rank 4/17 · grade 4 | 11.2% · rank 5/17 · grade 4 |
| Western Australia | 5 · 2026-11-10 | 2026-11-10: Retain the current grade. Fair evidence: the existing hold-return fifth rule ranks the base ope… | 21.5% · rank 1/17 · grade 5 | 14.3% · rank 1/17 · grade 5 |

Caiso, Ireland and NEM carry no figure but say the grade "follows the existing hold-return fifth rule" on "the engine ordering", which stops being true. Finland has no public reason (practitioner).

Replacement wording, dated on the day it is applied, naming its basis and typing no model result (the 31 October ruling, and the site rule that a model figure is read from the model, never typed):

- Grade unchanged (Western Australia, Italy, Romania, Great Britain, Kyushu, Hokkaido, PJM, ERCOT, CAISO). EN: "[date]: Graded on the investment model: the all-equity hold return of the selected investor's recommended ready-to-build reference case, ranked among the priced markets and graded by fifths. Project rights are priced at zero and construction is still payable. The selected case, return and rank are shown from the model; the earlier dated rationale remains in history." 中文："[日期]：按投资模型评级：以当前投资者推荐的可开工参考情景全股权长持回报，在已定价市场中排序并按五分位评级。项目权利价格设为零，建设支出仍需支付。所选情景、回报与排名由模型结果给出；原有日期的依据保留在历史中。"
- Grade moved (Germany, NEM, Poland, Ireland, Tokyo): the same, plus EN: "On this basis the grade moves from [old] to [new]; the market's own inputs did not change." 中文："按此口径，评级由[原评级]调整为[新评级]；本市场自身输入未变。"
- Poland's shared stored reason adds EN: "The fund, strategic investor and developer asset benchmark use the grant-funded cohort; the new entrant uses the capacity-market case. The selected investor's case and rank apply." 中文："基金、战略投资者及开发商的资产基准采用获补贴批次；新进入者采用容量市场情景。应读取当前投资者对应的情景与排名。" An investor-specific display may show just its applicable sentence. Never label the new entrant's capacity case as grant-funded.

Keep case labels, rank, count, return, supply scenario and effective grade bound to the selected investor's results. A shared stored reason must not imply identical cases merely because their grades match. Historical old/new grades are dated record facts; any current displayed grade comes from the result/record. Do not rewrite historical entries to look as if they used the new model all along.

The earlier alternative of retaining a typed return with basis/date remains a historical option, not the revised recommendation. Preserve dated figures in the changelog; remove hard-coded current model results from the active reason so the page cannot drift at the next approved model change.

The evidence label on these records is "The comparison engine". It needs a new label, "The investment model", added to the list the view writer accepts.

### Other model-derived figures: no change in this package

| Market | Dimension | Typed figure | Model or ledger now |
| --- | --- | --- | --- |
| CAISO | Revenue certainty | 78% | engine: secured 78% for 10 years; headline case: secured 78% for 10 years |
| CAISO | Capital at risk before FID | 0.4%, 5% | ledger pre-decision capital 0.38% of project cost (at least); project cost USD 120.2m |
| Germany | Capital at risk before FID | 0.24% | ledger pre-decision capital 0.23% of project cost (at least); project cost USD 94.8m |
| Finland | Capital at risk before FID | 5% | ledger pre-decision capital 4.83% of project cost; project cost USD 22.4m |
| Great Britain | Revenue certainty | 12% | engine: secured 12% for 15 years; headline case: secured 100% for 10 years |
| Ireland | Capital at risk before FID | 0.3% | ledger pre-decision capital 0.29% of project cost (at least); project cost USD 58.3m |
| Italy | Revenue certainty | 20% | engine: secured 20% for 15 years; headline case: secured 20% for 15 years |
| Hokkaido | Revenue certainty | 96% | engine: secured 95% for 15 years; headline case: secured 95% for 20 years |
| Kyushu | Revenue certainty | 96% | engine: secured 95% for 15 years; headline case: secured 95% for 20 years |
| Tokyo | Revenue certainty | 96% | engine: secured 95% for 15 years; headline case: secured 95% for 20 years |
| PJM | Revenue certainty | 47% | engine: secured 47% for 1 years; headline case: secured 47% for 1 years |
| Romania | Capital at risk before FID | 8.8% | ledger pre-decision capital 8.55% of project cost (at least); project cost USD 31.6m |
| Romania | Time to first revenue | (no percentage) 50 months | pathway midpoint — see ledger/pathway (not a return-model figure) |
| Western Australia | Revenue certainty | 77%, 39% | engine: secured 78% for 10 years; headline case: secured 79% for 10 years |
| Western Australia | Capital at risk before FID | 3.7% | ledger pre-decision capital 5.07% of project cost (at least); project cost USD 322.0m |
| Western Australia | Time to first revenue | (no percentage) 55 months | pathway midpoint — see ledger/pathway (not a return-model figure) |

The secured shares already state their basis and date and still match the engine (Japan's 96% is now 95%), and the engine remains their source. Italy's alone lacks a basis and date. Western Australia's and Romania's capital-at-risk shares have drifted but stay inside their grade's band (3–6%, and over 6%). All are for the next grade review.

### Sourced facts: no change

41 texts quote dates, capacities, thresholds or periods from external sources:

- CAISO: Foreign-entry barriers; Supply-chain and origin rules; Policy stability
- Germany: Revenue certainty; Approval transparency (trend cause); Grid-connection scarcity (trend cause); Foreign-entry barriers; Policy stability
- ERCOT: Grid-connection scarcity; Supply-chain and origin rules; Saturation
- Finland: Grid-connection scarcity; Foreign-entry barriers; Demand growth; Saturation
- Great Britain: Grid-connection scarcity; Policy stability; Saturation; Debt availability
- Ireland: Revenue certainty; Foreign-entry barriers; Policy stability
- Italy: Policy stability
- Hokkaido: Supply-chain and origin rules
- Kyushu: Grid-connection scarcity; Supply-chain and origin rules
- Tokyo: Grid-connection scarcity; Supply-chain and origin rules
- NEM (Australia): Revenue certainty
- PJM: Grid-connection scarcity; Foreign-entry barriers; Supply-chain and origin rules; Policy stability
- Poland: Approval transparency; Foreign-entry barriers; Policy stability; Policy stability (trend cause)
- Romania: Revenue certainty; Approval transparency
- Western Australia: Grid-connection scarcity; Foreign-entry barriers

### The stale-reason check (decision 13)

Today the check reads a grade reason for "hold IRR, x%" and compares it with the comparison engine. That can miss a mismatch with the card. After removing typed current returns from active reasons, replace this half with a derived-grade consistency check and retain the secured-share check. Required behaviour:

- Compare the stored **derived** baseline with the proposed headline grade under its declared case/population, and separately report investor divergence. Never update the stored grade automatically.
- Keep Finland's practitioner grade distinct from its computed comparator. Do not report that deliberate difference as an error or overwrite it.
- Respect the existing precedence and review dates of held views and pins; distinguish the underlying model comparison from the effective analyst view. Expiry belongs in the existing review process, not an automatic removal of judgement.
- Ontario/Spain/Saudi Arabia remain without grade records. Missing or non-finite returns are not zero, and an ungraded market does not acquire a record merely by appearing in the ranking.
- Include play, stage, supply case, source commit and rank population in review output. A numerical grade match alone does not prove that the accompanying reason uses the correct case.

## 6. The unused aggregate readiness flag

**Conclusion.** Recommend option A: remove the aggregate comparison-result field. In this snapshot its prerequisites are not met in any priced market and no consumer of that aggregate field was found. This is a current-state finding, not a mathematical claim that it could never become true. Confirm consumers during implementation; the feasibility module's similarly named field and its tests are separate and must remain intact.

Where it is: one field on every comparison-engine result. What the reader sees today: nothing. The project checks it counts are shown directly, as the "Before committing" list on each market page and decision strip.

| Market | Project operating limits | Cost items declared | Open project checks | Flag today |
| --- | --- | ---: | ---: | --- |
| Western Australia | not supplied | 1 of 8 | 3 | no |
| NEM (Australia) | not supplied | 1 of 8 | 4 | no |
| Great Britain | not supplied | 1 of 8 | 4 | no |
| Germany | not supplied | 1 of 8 | 4 | no |
| Italy | not supplied | 1 of 8 | 4 | no |
| Ireland | not supplied | 1 of 8 | 4 | no |
| Romania | not supplied | 1 of 8 | 4 | no |
| Poland | not supplied | 1 of 8 | 4 | no |
| Tokyo | not supplied | 1 of 8 | 4 | no |
| Kyushu | not supplied | 1 of 8 | 4 | no |
| Hokkaido | not supplied | 1 of 8 | 4 | no |
| PJM | not supplied | 0 of 8 | 4 | no |
| ERCOT | not supplied | 0 of 8 | 4 | no |
| CAISO | not supplied | 0 of 8 | 4 | no |
| Finland | not supplied | 2 of 8 | 4 | no |
| Ontario | not supplied | 1 of 8 | 4 | no |
| Saudi Arabia | return withheld | — | — | no |
| Spain | not supplied | 1 of 8 | 4 | no |

| Option | Definition | Markets it would mark ready today |
| --- | --- | --- |
| **A (recommended)** | Remove the flag | — |
| B | The card clears target on either test and the evidence marker is not Thin, per investor | Fund: Western Australia, Finland. Strategic: Western Australia, Finland. New entrant: Finland. Developer: Finland. (Italy clears target for all four but its evidence is Thin; Germany the same for the strategic investor) |
| C | Every project check is recorded as cleared | None. It needs a new analyst record per project, and stays false on a public site that holds no project documents |

## 7. Investor weights: current working set, full endorsement deferred

These are the values in use. The file's header says they are a draft that nothing imports; in fact scores on the market pages use them. The revised recommendation is to acknowledge their interim use and, only when code work is authorised, correct that factual header. Do not describe the complete methodology as newly signed off. Share of the score = weight inside the pillar × pillar weight. "Shut out" means that grade closes the market to that investor whatever the score. No weight, reading, knockout, limit or target is changed here.

### Infrastructure fund

| Dimension | Pillar | Weight inside the pillar | Pillar weight | Share of the score | What grades 1 · 2 · 3 · 4 · 5 are worth (0–100) |
| --- | --- | ---: | ---: | ---: | --- |
| Asset return | Return | 45% | 30% | 13.5% | 5 · 30 · 60 · 85 · 100 |
| Revenue certainty | Return | 55% | 30% | 16.5% | shut out · 35 · 65 · 90 · 100 |
| Capital at risk before FID | Entry | 5% | 10% | 0.5% | 40 · 60 · 80 · 95 · 100 |
| Approval transparency | Entry | 15% | 10% | 1.5% | 25 · 50 · 75 · 90 · 100 |
| Time to first revenue | Entry | 10% | 10% | 1.0% | 40 · 60 · 80 · 90 · 100 |
| Grid-connection scarcity | Entry | 30% | 10% | 3.0% | 70 · 90 · 100 · 70 · 45 |
| Foreign-entry barriers | Entry | 20% | 10% | 2.0% | 5 · 40 · 75 · 92 · 100 |
| Supply-chain and origin rules | Entry | 20% | 10% | 2.0% | 15 · 45 · 70 · 90 · 100 |
| Policy stability | Durability | 40% | 25% | 10.0% | 5 · 30 · 65 · 90 · 100 |
| Demand growth | Durability | 20% | 25% | 5.0% | 20 · 45 · 65 · 85 · 100 |
| Saturation | Durability | 40% | 25% | 10.0% | 5 · 30 · 60 · 85 · 100 |
| Debt availability | Capital | 45% | 35% | 15.8% | shut out · 25 · 60 · 85 · 100 |
| Exit liquidity | Capital | 40% | 35% | 14.0% | 5 · 30 · 60 · 85 · 100 |
| Scale and repeatability | Capital | 15% | 35% | 5.3% | 30 · 50 · 70 · 85 · 100 |

Limits: Capital risked before the investment decision: USD 5m (greenfield); Largest single project it will fund: USD 300m (greenfield, ready-to-build, operating). Stated cheque: USD 30m to 300m. Return it reads, as written: "Exit IRR and a levered check".

### Strategic investor

| Dimension | Pillar | Weight inside the pillar | Pillar weight | Share of the score | What grades 1 · 2 · 3 · 4 · 5 are worth (0–100) |
| --- | --- | ---: | ---: | ---: | --- |
| Asset return | Return | 60% | 30% | 18.0% | 10 · 35 · 60 · 85 · 100 |
| Revenue certainty | Return | 40% | 30% | 12.0% | 30 · 50 · 70 · 90 · 100 |
| Capital at risk before FID | Entry | 5% | 20% | 1.0% | 50 · 70 · 85 · 95 · 100 |
| Approval transparency | Entry | 15% | 20% | 3.0% | 20 · 50 · 75 · 90 · 100 |
| Time to first revenue | Entry | 15% | 20% | 3.0% | 30 · 55 · 75 · 90 · 100 |
| Grid-connection scarcity | Entry | 30% | 20% | 6.0% | 20 · 70 · 100 · 80 · 55 |
| Foreign-entry barriers | Entry | 15% | 20% | 3.0% | shut out · 45 · 75 · 90 · 100 |
| Supply-chain and origin rules | Entry | 20% | 20% | 4.0% | shut out · 40 · 70 · 90 · 100 |
| Policy stability | Durability | 40% | 30% | 12.0% | 10 · 40 · 70 · 90 · 100 |
| Demand growth | Durability | 35% | 30% | 10.5% | 15 · 40 · 65 · 85 · 100 |
| Saturation | Durability | 25% | 30% | 7.5% | 10 · 35 · 65 · 85 · 100 |
| Debt availability | Capital | 15% | 20% | 3.0% | 50 · 65 · 80 · 90 · 100 |
| Exit liquidity | Capital | 15% | 20% | 3.0% | 60 · 70 · 80 · 90 · 100 |
| Scale and repeatability | Capital | 70% | 20% | 14.0% | 5 · 30 · 60 · 85 · 100 |

Limits: Capital risked before the investment decision: USD 50m (greenfield); Largest single project it will fund: USD 1000m (greenfield, ready-to-build, operating). Stated cheque: USD 100m to 1000m. Return it reads, as written: "Hold IRR".

### New market entrant

| Dimension | Pillar | Weight inside the pillar | Pillar weight | Share of the score | What grades 1 · 2 · 3 · 4 · 5 are worth (0–100) |
| --- | --- | ---: | ---: | ---: | --- |
| Asset return | Return | 50% | 25% | 12.5% | 5 · 30 · 60 · 85 · 100 |
| Revenue certainty | Return | 50% | 25% | 12.5% | 15 · 40 · 65 · 88 · 100 |
| Capital at risk before FID | Entry | 15% | 35% | 5.3% | 5 · 30 · 60 · 88 · 100 |
| Approval transparency | Entry | 25% | 35% | 8.8% | shut out · 20 · 55 · 85 · 100 |
| Time to first revenue | Entry | 10% | 35% | 3.5% | 15 · 40 · 65 · 88 · 100 |
| Grid-connection scarcity | Entry | 15% | 35% | 5.3% | 5 · 30 · 60 · 85 · 100 |
| Foreign-entry barriers | Entry | 25% | 35% | 8.8% | shut out · 15 · 55 · 85 · 100 |
| Supply-chain and origin rules | Entry | 10% | 35% | 3.5% | 10 · 40 · 70 · 90 · 100 |
| Policy stability | Durability | 45% | 20% | 9.0% | 5 · 30 · 60 · 88 · 100 |
| Demand growth | Durability | 20% | 20% | 4.0% | 20 · 45 · 65 · 85 · 100 |
| Saturation | Durability | 35% | 20% | 7.0% | 10 · 35 · 60 · 85 · 100 |
| Debt availability | Capital | 35% | 20% | 7.0% | 10 · 35 · 65 · 88 · 100 |
| Exit liquidity | Capital | 50% | 20% | 10.0% | 5 · 30 · 60 · 85 · 100 |
| Scale and repeatability | Capital | 15% | 20% | 3.0% | 40 · 55 · 70 · 85 · 100 |

Limits: Capital risked before the investment decision: USD 3m (greenfield); Largest single project it will fund: USD 150m (greenfield, ready-to-build, operating). Stated cheque: USD 20m to 150m. Return it reads, as written: "Exit IRR".

### Developer

| Dimension | Pillar | Weight inside the pillar | Pillar weight | Share of the score | What grades 1 · 2 · 3 · 4 · 5 are worth (0–100) |
| --- | --- | ---: | ---: | ---: | --- |
| Asset return | Return | 70% | 20% | 14.0% | 10 · 35 · 60 · 85 · 100 |
| Revenue certainty | Return | 30% | 20% | 6.0% | 20 · 45 · 65 · 85 · 100 |
| Capital at risk before FID | Entry | 25% | 45% | 11.3% | 5 · 20 · 60 · 90 · 100 |
| Approval transparency | Entry | 20% | 45% | 9.0% | 5 · 35 · 65 · 90 · 100 |
| Time to first revenue | Entry | 20% | 45% | 9.0% | 5 · 30 · 60 · 88 · 100 |
| Grid-connection scarcity | Entry | 25% | 45% | 11.3% | shut out · 60 · 100 · 70 · 40 |
| Foreign-entry barriers | Entry | 5% | 45% | 2.3% | 30 · 50 · 75 · 90 · 100 |
| Supply-chain and origin rules | Entry | 5% | 45% | 2.3% | 30 · 55 · 75 · 90 · 100 |
| Policy stability | Durability | 40% | 10% | 4.0% | 10 · 35 · 65 · 88 · 100 |
| Demand growth | Durability | 30% | 10% | 3.0% | 20 · 45 · 65 · 85 · 100 |
| Saturation | Durability | 30% | 10% | 3.0% | 15 · 40 · 65 · 85 · 100 |
| Debt availability | Capital | 10% | 25% | 2.5% | 20 · 45 · 65 · 85 · 100 |
| Exit liquidity | Capital | 60% | 25% | 15.0% | 5 · 25 · 60 · 88 · 100 |
| Scale and repeatability | Capital | 30% | 25% | 7.5% | 10 · 35 · 65 · 88 · 100 |

Limits: Capital risked on one project before the investment decision: USD 3m (greenfield); Most security it will post before consent: USD 3m (greenfield); Longest it will wait to reach ready-to-build: 48 months (greenfield). Stated cheque: none stated. Return it reads, as written: "Build-to-operation return and time to operation".

**Score bands, all investors:** 0–30 Pass, 30–45 Watch, 45–60 Situational, 60–75 Build position, 75+ Advance. A call more than one band from its score is flagged.

**What looks inconsistent, and why:**

1. **This snapshot** has scores from 47.1 to 82.9 across all 60 scored market-investor pairs. It produces no score-derived Watch/Pass, but other grade combinations could. Current Pass proposals and many Watch proposals will disagree with the composite; that difference needs an explanation, not an automatic band change.
2. The fund's return is described as "Exit IRR and a levered check". No levered figure enters the score; the levered return acts only in the target test.
3. The developer puts the heaviest weight inside its return pillar on asset return (70%), yet development-to-RTB economics is not measured by that grade. Full endorsement waits for decision 4's business-model definition and evidence.
4. Stated cheque minimums are shown and never tested. Finland's reference project (about USD 22m) is under the fund's USD 30m minimum; twelve of the eighteen reference projects are under the strategic investor's USD 100m minimum.
5. All pillar weights and all weights inside each pillar sum to 100%. No arithmetic fault found.

Further review must distinguish an appropriate market from an investable transaction. Retain explicit target, price, access and execution checks outside the weighted average. For cheque-size review, first define whether the limit refers to equity committed, enterprise/project cost, a single asset, co-investment or a portfolio; comparing project capex with an equity-cheque minimum can be misleading. The analyst sets any new convention or weight after seeing its effect across all investors and markets.

## 8. Implementation boundary and later acceptance checks

**Implemented on 16 November 2026 for the signed-off subset; see section 4.8 for what was built and what was not.** The steps below were the checklist before that sign-off and are kept as the record of intent. Before implementation, record the analyst's actual decisions by number/case, the conditions closed, and the source snapshot. A reviewer status must never be written as the analyst's approval. Keep the approved release in one pull request; do not implement deferred verdicts or treat interim weights as permanently endorsed.

After explicit implementation authorisation, the planned areas are:

1. `src/comparison/returnGrades.js`: rank the selected headline-model all-equity hold case per investor, with the approved fifths rule and population. Obtain the case from a shared deterministic resolver; avoid a circular dependency in which grading requires the completed briefing while the briefing itself requires grades.
2. `src/governance/archetypes.js`: distinguish the common asset-grade basis from investor-specific exit/developer objectives. Audit every `returnBasis` consumer, including `src/home/boardModel.js` and `src/briefing/plays.js`; do not silently change comparison displays or treat a new basis string as an old exit/hold enum. Correct the header to describe actual use and only the decisions explicitly approved.
3. `src/governance/investability.js`: reword the asset-return definition (decision 2).
4. `src/entry/assessment.js`, `src/briefing/model.js`, `src/components/investmentCase.js`: pass the new grades and investor-specific case metadata; relabel the "Return rank / grade" column. Preserve held/practitioner precedence and ungraded status.
5. `src/briefing/queue.js` and `src/desk/deskPage.js`: decision 13. `src/briefing/sentences.js`: say "Pass", not "closed", and quote the headline return.
6. `src/comparison/decisionResult.js`: decision 14.
7. `view/schema/view.mjs`: accept "The investment model" as evidence.
8. `scripts/review/packet.mjs`, `scripts/view/review-investment-evidence.mjs`: report the headline grade.
9. Prepare reviewable content changes for the approved grade records/reasons and separately selected case records, including date corrections. Use the existing view-writer approval/apply workflow. Do not apply all 24 cases or alter grades merely to make a check pass.

Later acceptance checks must cover the headline ranking and all four investors, the five stored moves, four boundaries, declared tie handling, non-finite/unpriced cases, practitioner/held/pinned precedence, and a deliberate investor-divergence scenario. Verify Poland's two different cases, zero-rights-price RTB labelling, continued sale/levered/acquisition checks, case-scoped Pass rendering, event/result/review-date distinctions, and bilingual reasons. Relevant existing suites are `tests/view.test.js`, `tests/investment-review-evidence.test.mjs`, `tests/briefing.test.js` and `tests/view-prose.test.js`. These changes are planned, not made in this document revision.

**Expected difference in `npm run test:current`: none.** It ran 84 of 84 green today. Both files in it test the comparison engine's arithmetic and inputs, which this plan does not touch.

**Expected difference in `tests/fixtures/legacy-baseline.json`: none, line by line.** The fixture holds the legacy prototype's outputs for five markets, three strategies and three exit years on frozen inputs. It contains no grade, score or headline-model figure. It is not regenerated, and no approval to refresh it is needed. If it ever shows a difference in this work, the change has altered the engine by mistake and must be stopped.

For a future implementation PR, run `npm test`, `npm run test:current`, `npm run build`, `npm run test:budget` and `npm run test:e2e`, plus `npm run etl:verify` if that final scope changes data/datasets. Run the required confidentiality scans with a valid marker set; a skipped scan is not a pass. Reconcile the exact approved subset against the built output and both languages before the normal release pipeline. No build, browser release verification or deployment is implied by this Markdown edit.

Rollback must coordinate code and records: preserve the release's complete list of judgement changelog ids, use the writer's revert mechanism for approved record reversals, and restore the matching code basis through the normal reviewed pipeline. Revalidate grades, reasons and calls together. The two mechanisms are separate, but reverting only one can leave the displayed basis inconsistent with the stored rationale; do not claim the states are interchangeable.

## 9. What is computed, what is assumed, what could not be verified

**Independently reproduced:** section 1's 204 headline return/rank/grade cells, section 4's 144 return/target/gap cells, section 3's 120 before/after score cells, agreement of the four proposed grades, the five stored moves, and the Germany/CAISO fund score-flag changes. The 16 all-equity-below-target Build position cases include 15 that fail both tests; Italy/developer is the levered-test exception. The follow-up rerun checks the revised **11/6/7** status split, four no-grant sensitivities, three hold-NPV gaps and the PJM payment arithmetic. The existing numerical baseline suite passed 84/84 in the preceding documentation review; it was not rerun merely to edit prose. Section 10 records a self-contained numerical check.

**Original analysis retained with its limits:** the alternative ranking tables, stale-reason inventory, original shortlist/pick/queue simulations and the reported 340-figure built-site comparison. Only the six-case subset in section 4.7 is now approved; its release validation is recorded there. Do not reuse the original assertion that the queue or first three shortlist rows will be unchanged for a different subset.

**Assumptions removed as decision rules:** a two-percentage-point Situational tolerance; a requirement that every Watch trigger have an official event date; retaining a verdict to avoid an engine warning. Their removal does not change model targets. The six bounded Watch choices in section 4.7 are approved; all other case recommendations and methodology items retain their pending status.

**Currency boundary:** the tables report local-currency nominal returns under the pinned model assumptions. This is not a common-currency hedged return ranking and does not resolve FX risk for an overseas investor. The original author reported unchanged comparison-engine IRRs under the approved seed and 13 November observed FX rates; that does not establish immunity to every future FX/cost assumption change.

**Outstanding evidence and validation:**
- The earlier count of 27 stale grade reasons was not reproduced by the original author, who reported 28 percentage-bearing texts and 9 engine-return quotations. Treat this as an inventory to recheck when replacing reasons, not an implementation success criterion.
- Section 4.6 distinguishes newly read primary evidence, earlier dated checks and failed retrievals. Project-level eligibility, executed pricing, capacity reductions, development economics and the amended Romanian grant timetable/outcome remain open. Romania's 2 November checkpoint is internal; it is not an overdue official award date.
- The original worktree lacked its own marker set, so its confidentiality-test failures cannot be called passes. This documentation revision uses the existing checkout's marker guard for a targeted text check without copying private content. This is not a staged-file scan, built-bundle scan or release clearance.
- The original search found no page printing the briefing's computed call sentence. Confirm consumers and built output during implementation; search alone is not a browser test.
- At the earlier documentation-only review, no implementation, full browser suite or deployment had been performed. See section 4.7 for the separately authorised six-case release. The 468 baseline table checks and additional economic checks demonstrate reproducibility, not bankability of the assumptions or approval of the calls.

## 10. Reproducing the figures

The original `01-compute.mjs` through `12-assemble.mjs` were named without a durable location or attached content. They are not required by the command below and must not be cited as a reproducible deliverable. This replacement is included in the same decision document to avoid an additional report or model-code edit.

This is a historical-baseline command. Use PowerShell in a clean checkout of the pinned commit with this decision document available, with the project's supported Node runtime and dependencies already available. It deliberately refuses an implementation tree whose view records have changed; do not weaken that guard or rewrite its baseline figures. The command verifies the exact baseline commit and checks that the tracked model/public-input areas match it, including the absence of untracked inputs in those areas. It reads public model/view files, computes in memory, prints a public-input tree fingerprint and reconciliation summary, and writes no files. It makes no network calls, does not read confidential material, does not invoke a view writer, and never regenerates fixtures. The caller's later use of a view-writer apply command is outside this procedure.

Pinned source: `06ec0cc530473ff98347ed8853644d1fc5381fb4`. Evaluation time: `2026-11-15T00:00:00Z`. Expected checks: **204 ranking cells, 144 case cells, 120 before/after score cells, 5 stored moves, 2 changed score flags, 16 Build position cases below the all-equity target (15 below both targets), and 6 approved / 11 ready but unsigned / 7 deferred case statuses**. The additional section 4.6 checks cover four grant sensitivities, three hold-NPV gaps and the PJM payment calculation. These are distinct from the original author's 340 built-site checks.

**Recorded local follow-up run, 15 November 2026:** the command below returned `result: "matched"` under Node `v26.2.0`. All **468** ranking/case/score cells matched the tables, along with the additional economic checks and **11/6/7** case statuses. The public-input tree fingerprint remains `cd307cd41ecede6d4950c6479a31416bdfad17a2f0401621066867cd208ca7e4`; grade moves and score flags are unchanged. Document structure, relative links and the targeted confidential-marker scan also passed. This records a read-only documentation check, not implementation, release validation or analyst sign-off.

```powershell
@'
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { briefingFromDisk, readBriefingInputs } from './src/briefing/disk.js';
import { homeProjection } from './src/briefing/model.js';
import { opportunitySummary } from './src/opportunities/summary.js';
import { referenceInvestment, investmentMetrics, investmentPV } from './src/opportunities/investment.js';
import { acquisitionCashFlows } from './src/acquisition/valuation.js';
import { markets, byId } from './src/markets/registry.js';
import { ledgerFor } from './src/entry/ledgerRegistry.js';
import { assessMarket } from './src/entry/assessment.js';
import { returnGradesFor } from './src/comparison/returnGrades.js';
import { FX } from './src/comparison/assumptions.js';

const pinned = '06ec0cc530473ff98347ed8853644d1fc5381fb4';
const git = args => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 16 << 20 });
assert.equal(git(['rev-parse', 'HEAD']).trim(), pinned, 'Source changed: review drift first');
const scope = ['src', 'view', 'public/data/public', 'docs/strategy-reviews'];
git(['diff', '--quiet', 'HEAD', '--', ...scope]);
assert.equal(git(['ls-files', '--others', '--exclude-standard', '--', ...scope]).trim(), '',
  'Untracked public inputs require review');
const inputTree = git(['ls-tree', '-r', '--full-tree', pinned, '--', ...scope]);
const inputTreeSha256 = createHash('sha256').update(inputTree).digest('hex');
const now = new Date('2026-11-15T00:00:00Z');
const briefing = await briefingFromDisk({ now });
const { views } = await readBriefingInputs();
const projection = homeProjection(briefing);
const summary = opportunitySummary(projection, views);
const doc = fs.readFileSync('docs/return-model-alignment-plan-2026-11-15.md', 'utf8');
const section = n => doc.split(new RegExp('^## ' + n + '\\.', 'm'))[1]
  .split(/^## /m)[0];
const names = {
  'Western Australia': 'wa', Finland: 'fi', Italy: 'it', Poland: 'pl', Romania: 'ro',
  Germany: 'de', 'NEM (Australia)': 'nem', CAISO: 'caiso', 'Great Britain': 'gb',
  Ontario: 'ca_on', Ireland: 'ie', Kyushu: 'jp_kyushu', Spain: 'es', Tokyo: 'jp_tokyo',
  Hokkaido: 'jp_hokkaido', PJM: 'pjm', ERCOT: 'ercot',
};
const titles = {
  'Infrastructure fund (the default view)': 'infraFund',
  'Infrastructure fund': 'infraFund', 'Strategic investor': 'strategic',
  'New market entrant': 'foreignFirstTimer', Developer: 'developer',
};
const investors = ['infraFund', 'strategic', 'foreignFirstTimer', 'developer'];
const columns = line => line.split('|').slice(1, -1).map(s => s.trim());
const numeric = s => Number(s.replace(/[%*]/g, '').replace(/−/g, '-').trim());
const round = (v, digits = 2) => Number(v.toFixed(digits));
const ranked = Object.fromEntries(investors.map(investor => [investor,
  Object.entries(summary[investor].markets).filter(([, m]) => Number.isFinite(m?.holdIRR))
    .sort((a, b) => b[1].holdIRR - a[1].holdIRR)
    .map(([id, m], i, rows) => ({ id, hold: m.holdIRR, rank: i + 1,
      count: rows.length, grade: 6 - Math.ceil((i + 1) * 5 / rows.length) }))
]));
for (const investor of investors) assert.equal(ranked[investor].length, 17);

let investor, rankingCells = 0;
for (const line of section(1).split(/\r?\n/)) {
  if (line.startsWith('### ')) investor = titles[line.slice(4)];
  if (!investor || !line.startsWith('| ')) continue;
  const c = columns(line), id = names[c[0]];
  if (!id) continue;
  const actual = ranked[investor].find(r => r.id === id);
  assert.deepEqual([round(actual.hold * 100), actual.rank, actual.grade],
    [numeric(c[6]), Number(c[7].split(' ')[0]), numeric(c[8])], investor + '/' + id);
  rankingCells += 3;
}
assert.equal(rankingCells, 204);
for (const row of ranked.infraFund) for (const lens of investors) {
  assert.equal(ranked[lens].find(r => r.id === row.id).grade, row.grade,
    'Common-grade divergence: ' + lens + '/' + row.id);
}
const storedMoves = ranked.infraFund.flatMap(row => {
  const stored = views.find(v => v.marketId === row.id)?.grades?.assetReturn;
  return stored?.basis === 'derived' && stored.grade !== row.grade
    ? [{ id: row.id, before: stored.grade, after: row.grade }] : [];
}).sort((a, b) => a.id.localeCompare(b.id));
assert.deepEqual(storedMoves, [
  { id: 'de', before: 5, after: 4 }, { id: 'ie', before: 1, after: 2 },
  { id: 'jp_tokyo', before: 2, after: 1 }, { id: 'nem', before: 4, after: 3 },
  { id: 'pl', before: 3, after: 4 },
]);

const caseLens = { F: 'infraFund', S: 'strategic', N: 'foreignFirstTimer', D: 'developer' };
let caseCells = 0;
const caseStatuses = { Approved: 0, Ready: 0, Conditional: 0, Deferred: 0 };
const caseCodes = new Set();
for (const line of section(4).split(/\r?\n/).filter(l => /^\| [FSND]\d+ \|/.test(l))) {
  const c = columns(line), code = c[0], lens = caseLens[code[0]], id = names[c[1]];
  assert.ok(!caseCodes.has(code), 'Duplicate case: ' + code);
  caseCodes.add(code);
  let card = summary[lens].markets[id];
  // The fund's second Polish row is the capacity case, not its headline grant play.
  if (code === 'F2') card = investmentMetrics(
    referenceInvestment(byId('pl'), lens, { route: 'cap', hours: 4 })?.result);
  const actual = [card.holdIRR, card.leveredIRR, card.test.target, card.test.leveredTarget,
    card.holdIRR - card.test.target, card.leveredIRR - card.test.leveredTarget]
    .map(v => round(v * 100));
  const expected = [numeric(c[4]), numeric(c[5]), ...c[6].split('/').map(numeric),
    ...c[7].split('/').map(numeric)];
  assert.deepEqual(actual, expected, code);
  caseCells += 6;
  const status = Object.keys(caseStatuses).find(key => c[9].startsWith('**' + key + ' —'));
  assert.ok(status, 'Missing review status: ' + code);
  caseStatuses[status]++;
}
assert.equal(caseCodes.size, 24);
assert.equal(caseCells, 144);
assert.deepEqual(caseStatuses, { Approved: 6, Ready: 11, Conditional: 0, Deferred: 7 });

// Adapt the proposed common grade in memory to the current assessment API.
// No record, investor objective or runtime implementation is changed.
const proposedGrades = Object.fromEntries(ranked.infraFund.map(row => [row.id,
  Object.fromEntries(['hold-irr', 'exit-irr', 'development-multiple'].map(basis =>
    [basis, { ...row, value: row.hold, basis }]))
]));
const oldGrades = returnGradesFor(markets), scores = {}, flagChanges = [], deltas = [];
for (const view of views) {
  const market = byId(view.marketId);
  if (!market) continue;
  const assessWith = grades => assessMarket(view, market, ledgerFor(view.marketId), FX,
    { on: '2026-11-15', returnGrades: grades }).byArchetype;
  const old = assessWith(oldGrades), next = assessWith(proposedGrades);
  for (const lens of investors) {
    if (!view.verdicts?.[lens]) continue;
    const a = old[lens], b = next[lens], key = lens + '/' + view.marketId;
    scores[key] = { before: a.fit, after: b.fit };
    if (a.fit !== b.fit) deltas.push(Math.abs(b.fit - a.fit));
    if (a.check?.disagrees !== b.check?.disagrees) flagChanges.push({
      key, before: a.check?.disagrees, after: b.check?.disagrees,
    });
  }
}
let scoreCells = 0;
for (const line of section(3).split(/\r?\n/)) {
  if (line.startsWith('### ')) investor = titles[line.slice(4)];
  if (!investor || !line.startsWith('| ')) continue;
  const c = columns(line), id = names[c[0]];
  if (!id) continue;
  const shown = c[3].split('→').map(numeric), actual = scores[investor + '/' + id];
  assert.deepEqual([round(actual.before, 1), round(actual.after, 1)],
    [shown[0], shown.at(-1)], 'Score: ' + investor + '/' + id);
  scoreCells += 2;
}
assert.equal(scoreCells, 120);
flagChanges.sort((a, b) => a.key.localeCompare(b.key));
assert.deepEqual(flagChanges, [
  { key: 'infraFund/caiso', before: false, after: true },
  { key: 'infraFund/de', before: true, after: false },
]);
assert.ok(Math.abs(Math.min(...deltas) - 1.875) < 1e-9);
assert.ok(Math.abs(Math.max(...deltas) - 4.5) < 1e-9);

const buildPosition = Object.fromEntries(investors.map(lens => [lens,
  [...new Set(projection.lenses[lens].rows.filter(row => row.call === 'build-position'
    && Number.isFinite(summary[lens].markets[row.market]?.holdIRR)
    && summary[lens].markets[row.market].holdIRR < summary[lens].markets[row.market].test.target
    && summary[lens].markets[row.market]?.purchasePricePerMW === 0)
    .map(row => row.market))].sort()
]));
assert.deepEqual(buildPosition, {
  infraFund: [],
  strategic: ['gb', 'ie', 'jp_hokkaido', 'jp_kyushu', 'jp_tokyo', 'nem'],
  foreignFirstTimer: ['de', 'ie', 'jp_kyushu', 'jp_tokyo'],
  developer: ['de', 'ie', 'it', 'jp_kyushu', 'jp_tokyo', 'nem'],
});
const bothBelow = Object.fromEntries(investors.map(lens => [lens,
  buildPosition[lens].filter(id => summary[lens].markets[id].test.meets === false)
]));
assert.equal(Object.values(bothBelow).flat().length, 15);
const italyDeveloper = summary.developer.markets.it;
assert.ok(italyDeveloper.holdIRR < italyDeveloper.test.target);
assert.ok(italyDeveloper.leveredIRR >= italyDeveloper.test.leveredTarget);
assert.equal(italyDeveloper.test.meets, true);

// Documentation-only counterfactuals: existing API, no files or records written.
const followUpTables = section(4).split(/\r?\n/).filter(l => l.startsWith('| ')).map(columns);
const grantSensitivity = [], valueGaps = [];
for (const [code, id, lens] of [
  ['F1', 'pl', 'infraFund'], ['S1', 'pl', 'strategic'],
  ['S2', 'ro', 'strategic'], ['N5', 'ro', 'foreignFirstTimer'],
]) {
  const row = projection.lenses[lens].rows.find(r => r.market === id);
  const play = projection.plays[id + '/' + row.play];
  const baseline = referenceInvestment(byId(id), lens, play);
  const noGrant = referenceInvestment(byId(id), lens, play, { economicOverrides: { grantPct: 0 } });
  const base = investmentMetrics(baseline.result), zero = investmentMetrics(noGrant.result);
  assert.equal(noGrant.result.assumptions.terms.grantPerMW, 0, code + ' grant removed');
  assert.equal(zero.test.target, base.test.target, code + ' hurdle unchanged');
  const c = followUpTables.find(c => c.length === 5 && c[0].startsWith(code + ' —'));
  assert.ok(c, code + ' sensitivity row');
  const actual = [base.holdIRR, base.leveredIRR, zero.holdIRR, zero.leveredIRR,
    base.test.target, base.test.leveredTarget].map(v => round(v * 100));
  const expected = [...c[1].split('/'), ...c[2].split('/'), ...c[3].split('/')].map(numeric);
  assert.deepEqual(actual, expected, code + ' grant sensitivity');
  grantSensitivity.push({ code, percentages: actual });
  if (code !== 'N5') {
    const flows = acquisitionCashFlows(baseline.result.input, lens, 'hold', 0).flows;
    const shortfall = Math.round(-investmentPV(flows, baseline.target));
    const gapRow = followUpTables.find(c => c.length === 4 && c[0].startsWith(code + ' —'));
    assert.ok(gapRow, code + ' value-gap row');
    assert.equal(base.currency, gapRow[1]);
    assert.equal(shortfall, numeric(gapRow[2].replaceAll(',', '')), code + ' hold-NPV gap');
    valueGaps.push({ code, currency: base.currency, shortfallPerMW: shortfall });
  }
}
const currentPjmPayment = 325 * 365 * 0.59;
const nextPjmCapPayment = 337.83 * 365 * 0.57;
assert.equal(round(currentPjmPayment), 69988.75);
assert.equal(round(nextPjmCapPayment), 70285.53);
assert.equal(round(nextPjmCapPayment - currentPjmPayment), 296.78);
assert.equal(round((nextPjmCapPayment / currentPjmPayment - 1) * 100, 3), 0.424);
assert.equal(byId('pjm').comparison.durationResponse.auctionRenewalCurves[4][0],
  Math.round(nextPjmCapPayment), 'PJM next cap is already assumed');
console.log(JSON.stringify({ sourceCommit: pinned, evaluatedAt: now.toISOString(),
  inputTreeSha256, rankingCells, caseCells, scoreCells, storedMoves, flagChanges,
  scoreChangeRange: [round(Math.min(...deltas), 3), round(Math.max(...deltas), 3)],
  buildPosition, bothBelow, caseStatuses, grantSensitivity, valueGaps,
  pjmPayments: { currentPjmPayment, nextPjmCapPayment }, result: 'matched' }, null, 2));
'@ | node --input-type=module
if ($LASTEXITCODE -ne 0) { throw 'Read-only reconciliation failed.' }
```

For a separately authorised implementation, run the existing numerical baseline check with `npm run test:current`. Its preceding documentation-review result was 84/84; this follow-up reruns the command above. Do not run `npm run test:baseline`.

The source-tree fingerprint identifies the pinned tracked public inputs, not analyst approval or independent validation of their assumptions. On another commit, stop and inspect drift rather than updating expected numbers to make this command pass. Before an implementation release, repeat against the approved new snapshot, inspect the selected case overlay, and reconcile the built site. The command above does not validate external event dates, every alternative table in section 2, all historical prose, a prospective call batch or browser rendering.

## 11. Further review and closure checklist

Maintain this checklist in place. “Open” means evidence or a decision is still needed; it is not a request to apply code or judgement changes now. Close each row with its source/date, affected cases, analyst decision and, only after a release, its verified release reference. A closed arithmetic check does not close an investment-evidence item. Conditions apply to the relevant selected scope; unrelated deferred developer work need not block an otherwise approved common asset benchmark.

| Item | Scope and current status | Evidence / work needed | Closure requirement |
| --- | --- | --- | --- |
| Developer economics | **Open** — decision 4; D1–D7; six developer Build position cases | Define develop-to-RTB, build-and-sell or hold. Show development spend, securities and release, failures, timing, peak capital, buyer valuation and profit/MOIC; distinguish model assumptions from executable evidence. | Analyst approves the path and assumptions, then reviews each developer call. No generic asset-grade shortcut. |
| Investable situations | **Bounded Watch approved; project terms open** — F1, S1, S2 | E-PL-1/2 and E-RO-1 distinguish programme/contract precedent from executable target terms. Section 4.6 gives no-grant returns and hold-NPV gaps. Obtain grant amount, cost basis, timing, transferability, construction/connection costs and priced contract/entry terms. | Watch selected in section 4.7. Obtain evidence by the approved checkpoints; any later Situational/Pass requires analyst review. No presumed award, duplicated subsidy, unpriced strategic benefit or two-point tolerance. |
| Japan dates and award evidence | **Trigger dates corrected in the three live records on 16 November 2026 (bid close 26 January 2027, source opened); N3 recommendation still unsigned; asset follow-up open**. Earlier status: N3 bounded Watch recommendation ready; asset/record follow-up open — N3, D4 and related Japan triggers | E-JP-1/2 confirm registration/bid/result distinctions and eligibility requirements. Verify registered target/transfer route, cell and grid conditions, award terms and pricing. March is a progress review; 30 April is a proposed internal result-status check. | Analyst approves N3's scope and later record correction. Asset entry still requires diligence and rerun. D4 still requires developer economics. |
| CAISO valuation evidence | **S3/N2 Watch recommendations ready; transaction evidence open** — S3, N2, D3; fund-note consistency | E-CA-1 closes the rule/timing rationale. Obtain applicable qualifying MW, executed RA terms, deliverability and contract allocation. Proposed early checkpoint 30 November 2026; March outer review retained. | A Watch approval closes the decision to wait only. An actionable transaction needs an asset-level rerun; D3 and the fund-note consistency review remain open. |
| Ireland transition | **F5 Watch recommendation ready; future terms open** — F5 and affected Build position cases | E-IE-1/2 revalidate the long-stop and October programme dependencies. Seek revised roadmap/final service eligibility, payments and volume/performance conditions, without double-counting services already inside trading. | Analyst may approve bounded F5 Watch to 31 March 2027. Actual income and six-hour award assumptions need their own evidence; Build position cases are not closed here. |
| PJM triggers and materiality | **Three bounded Watch choices approved; project evidence open** — F6, S5, N6; D6 still deferred | E-PJM-1/2 show that the December cap is already assumed; E-PJM-3 preserves the earlier exact schedule check with its date. Obtain actual results, appropriate future-year rating and regulatory/transaction terms, then rerun material changes. | Apply the three approved Watch scopes and 31 March participation-path review using E-PJM-4/5. Follow proposed May results only after explicit continuation; otherwise submit scoped Pass. D6 remains deferred. |
| Romania outcomes and grant assumption | **Internal-date error resolved; official amended timetable/award unresolved** — S2, N5, D2 and related active records | E-RO-2 records access failures and exact official pointers. Obtain amended call notice, evaluation/award status and target agreement/payment evidence. The baseline already assumes a grant; the no-grant sensitivity is separately reproduced. | Do not relabel 2 November as an official event or infer non-publication from a timeout. N5 Watch remains unsigned; S2 Watch is approved with target evidence open; D2 remains deferred. |
| Undated Watch cases | **F2/N1/N5 recommendations ready with bounded tasks; actual approvals pending** — D7 remains deferred | Section 4.6 supplies evidence sought, causal link, review date and reclassification rule. Monitor the named task; do not assume an executable path from a missing date or automatically renew it. | Analyst approves the scoped Watch recommendations and later reassesses them. Undated does not mechanically mean Pass; developer deferral still applies to D7. |
| Sixteen Build position cases | **Open** — complete inventory in section 4.4; 16 below all-equity target, 15 below both targets | Prepare one review row per market/investor: which return test fails, preparatory action, maximum pre-commitment exposure for analyst approval, why starting now has value, target/price condition, trigger, review date and stop condition. | Analyst reaffirms or revises each call. Keep Italy's levered-test pass visible. No new budget is assumed, and no automatic downgrade is prescribed. |
| Weight and cheque-size suitability | **Open for full endorsement** — decision 15 | Separate asset quality from transaction return; examine whether weak economics is being offset by access/depth. Define equity-cheque versus project-cost/portfolio limits and developer interpretation; show impacts before proposing changes. | Explicit methodology decision. Interim continuation and a factual header correction do not imply full endorsement. |
| Grade semantics and safeguards | **Implemented 16 November 2026 (section 4.8); tie rule declared; practitioner, held, pinned and ungraded states tested**. Earlier status: Arithmetic verified; implementation open — decisions 1–9, 12–13 | Bind each investor's actual play/rank, preserve practitioner/held/pinned/ungraded states, decide tie treatment, handle non-finite returns and block unqualified common-grade updates on divergence. Audit shared return-basis consumers and grade/briefing dependency direction. | Demonstrated consistency of case, figure, grade and reason without silently changing investor objectives or comparison outputs. |
| Approved call subset and notes | **Nine decisions approved and applied: six Watch (15 November) and ERCOT Pass for F4, S4, N4 with score notes (16 November)**. Earlier status: Six Watch decisions approved and implemented; release verification required — decisions 10–11; other 11 ready / 7 deferred cases remain unsigned | Section 4.7 records the six approvals, conditions, writer audit and checks. Market/play scope, rationale, actions and triggers were updated together; the reference economics are unchanged and the fund shortlist effect is recorded. | Full CI and merge evidence belong in the release PR. Deferred cases remain absent from the applied batch; historical rationale and author identity are preserved. No 24-case package approval is inferred. |
| Historical Polish story | **Separate content review remains open** — F1 | The current Watch is approved; the earlier story is still bound to its 1 November Situational tuple. Its existing guard returns saved story links to research, while the current investment page shows Watch. The unified reader marks the detailed reference as awaiting review and provides a current-research action. | Reconcile the historical comparative-yield conclusions, grant evidence and current investor target before separately approving that story tuple. Do not bypass its guard in this release. |
| Reproducibility and release evidence | **Baseline and added read-only economic checks verified; release open** | Use section 10's pinned command for 468 existing cells, four grant sensitivities, three hold-NPV gaps, PJM payment arithmetic and updated status counts. Run release checks and confidentiality scans only on the later authorised implementation. | No regenerated legacy fixture, no skipped scan reported as pass, and no deployment outside the approved pipeline. |

Analyst decision record: **six bounded Watch decisions approved on 15 November 2026**, with implementation, tests, commit, push and merge to main expressly authorised. Section 4.7 is the controlling record. The other 11 Ready recommendations remain unsigned; D1–D7 remain deferred. No other numerical methodology, weight, spending or case approval is inferred.

Analyst decision record, 16 November 2026: **regrade signed off as recommended; ERCOT Pass approved for the fund, the strategic investor and the new entrant; the ERCOT story re-signed against Pass**, with implementation and a commit expressly requested. Section 4.8 is the controlling record. Eight Ready call recommendations, the developer cases, the Build position review and the weights remain unsigned.
