# Five open model points — decision plan, 2026-10-31

| Point | Finding from current code | Ruling — 31 October 2026 | Markets moved |
| --- | --- | --- | --- |
| 1. Ontario, Saudi Arabia, Spain | Registered and deliberately ungraded; absent analyst calls are a coverage gap, not lost records. The acquisition screen separately creates research assumptions. | **1A:** retain the ungraded state; require a sourced initial view pack before publishing calls. Preserve the three proposed play specifications. | No financial figures, grades or ranks move. |
| 2. Poland | The two calls are intended: the grant play has its own fund call. “Every design” in the thesis incorrectly includes the grant exception. | **2A:** retain both calls and narrow the bilingual thesis to ungranted designs. | Poland text only; no figures move. |
| 3. Romania | The floor is a condition of the fund call, but is absent from priced cash flows; the label conflates the two. The grant trigger is unresolved. | **3A:** label the priced case as merchant, keep the floor as a diligence gate; add a **2 November 2026** primary-source status review, preserving the unresolved historical deadline. | Romania text, dates and queue only; no financial figures move. |
| 4. Japan | Six hours names the obligation; nine hours is the approved build. The thesis omits the reason for buying an operating award holder. | **4A:** keep IDs and installed hours; explain obligation versus build and lead each thesis with the acquisition call and capped bid return. | Three Japan regions' text only; no figures move. |
| 5. ERCOT | An empty trigger list and empty fund `changesIf` explain `next: null`; there is no date fallback from `reviewBy`. | **5A:** add a **6 November 2026** trigger for the January 2027 resource-adequacy outlook, linked to ERCOT's publication schedule. | ERCOT date and queue only; no financial figures move. |

**The analyst selected the recommended package on 31 October 2026.** Preserve the intentional cohort and duration distinctions, clarify the text and use the selected dated research checkpoints. The ruling is recorded below; alternative options remain as decision history. Implementation still needs a separate request; this ruling does not authorize a code, view-store, play, trigger or input edit.

## Ruled (2026-10-31)

The analyst answered **“四项都选A”** — A on all four grouped questions. The second question covered both Poland and Japan, so the selected plan options are **1A, 2A, 3A, 4A and 5A**.

| Grouped ruling | Selected direction | Research checkpoint / effect |
| --- | --- | --- |
| **1 — A / plan 1A** | Keep Ontario, Saudi Arabia and Spain ungraded while completing the sourced research gates; preserve their candidate play specifications. | Review by **30 November 2026**. No initial call or grade is approved for publication. |
| **2 — A / plans 2A + 4A** | Preserve Poland's separate capacity and grant-cohort calls. Preserve Japan's six-hour-obligation play IDs and nine-hour installed designs. Clarify theses and labels along those distinctions. | Text direction approved for a later separately requested content change. No financial figure or ranking moves. |
| **3 — A / plan 3A** | Retain Romania's conditional opportunistic call: execution requires a floor, while the displayed economics remain merchant. Keep the historical grant deadline unresolved until a primary outcome is verified. | Primary-source grant-status review on **2 November 2026**. Floor terms remain the OC-RO-FLOOR research gate; no floor price or grant outcome is approved. |
| **4 — A / plan 5A** | Use the expected January 2027 MORA release as ERCOT's next public research event; a private toll still needs separate underwriting. | **6 November 2026**, derived from the operator's publication cadence. No toll price, tenor or revenue assumption changes. |

**Status: ruled, not implemented.** This update records the analyst's choices in this memo only. The selected dates are research checkpoints; no live trigger or scheduled job has been created. All model figures remain as documented at the research snapshot.

## Basis and current numbers

- **Code snapshot:** `origin/main` was fetched on 31 October 2026. An isolated `codex/open-model-decisions` branch was fast-forwarded from `1fbdff5` to `288233b`, then to `dbd81c24aecaa6462f420cf2654f374e5fa7590c` when a documentation-only update arrived during research. Both updates used `git merge --ff-only origin/main`. The model/data inputs are identical at those last two commits; the other checkout's unfinished work was preserved.
- **Review:** [merged PR #83, “For you to decide”](https://github.com/jerryyuan1996/BESS-research-platform/pull/83), merged **31 October 2026, 04:41:59 UTC**. Its check was at `bd62af1`; this plan reads the fetched code and data rather than treating that earlier check as current evidence.
- **Authority:** [governance](governance.md), [registration contract](adding-a-market.md), current `view/markets/`, `src/briefing/`, market definitions, play schema and trigger schema. The dated registration and Japan plans establish analyst rulings only. `docs/briefing-content-2026-10.md` was not used as a source of current facts or numbers.
- **Engine run:** external scratch scripts imported the fetched registry, its sponsor-adjusted inputs, `readBriefingInputs`, `buildBriefing`, the public entry ledgers and dataset catalogue; then `runBaseCase`, `marketDesign` and `designEconomics`. The reproducible evaluation clock was **31 October 2026, 04:45 UTC / 12:45 Perth**. FX is the committed ECB observation for **30 October 2026**, not an older plan's seed: EUR/USD **1.1172**, CAD/USD **0.71587851**, JPY/USD **0.0063592896**.

These are the **design engine's unlevered build economics** over its approved comparison window, with exit in operating year five. “Value” is incremental value per MW of connection at the platform's yields, not a purchase price. IRRs below are the briefing's rounded result fields, multiplied by 100; value is rounded to whole USD/MW. Secured years are capped by the engine window and need not equal the legal contract term.

| Market / play, including proposed designs | Hold IRR | Year-five exit IRR | Value / MW | Modelled secured share / years |
| --- | ---: | ---: | ---: | ---: |
| Ontario · `on-cap-8h` | 5.30% | 3.78% | −$156,444 | 67.8% / 15 years |
| Saudi Arabia · `sa-sppc-4h` | withheld | withheld | withheld | withheld |
| Spain · `es-merchant-4h` | 2.58% | -2.51% | −$365,371 | 0.0% / 0 years |
| Poland · `pl-cap-4h` | 9.78% | 9.52% | −$23,641 | 10.1% / 15 years |
| Poland · `pl-grant-4h` | 17.11% | 20.01% | +$209,165 | 0.0% / 0 years |
| Romania · `ro-mer-2h` | 13.70% | 14.94% | +$67,988 | 0.0% / 0 years |
| Finland · `fi-toll-2h` | 11.38% | 11.47% | +$30,961 | 50.0% / 7 years |
| Tokyo · `jp-tokyo-ltda-6h` | 2.82% | 0.28% | −$388,873 | 95.3% / 15 years |
| Kyushu · `jp-kyushu-ltda-6h` | 2.94% | 0.48% | −$378,870 | 94.8% / 15 years |
| Hokkaido · `jp-hokkaido-ltda-6h` | 2.54% | -0.20% | −$416,395 | 95.3% / 15 years |
| ERCOT · `ercot-toll-2h` | -5.87% | -12.30% | −$461,588 | 100.0% / 7 years |

**The current acquisition screen is a separate calculation.** `src/acquisition/opportunities.js` prices entry at the play's stage and retains the tax, financing, life and construction conventions already approved. It does not turn the design values above into bid prices. The following are its current cautious / reference / favourable price ceilings and corresponding targets, taken from `briefing.acquisitions.infraFund[].referenceCases`; all stay unchanged under the recommended package.

| Operating acquisition | Currency / MW | Cautious / reference / favourable ceiling | Corresponding equity-return target |
| --- | --- | ---: | ---: |
| `ro` | RON | 1,365,479 / 2,528,248 / 2,869,270 | 13.25% / 13.25% / 13.25% |
| `jp_tokyo` | JPY | 140,503,593 / 247,167,289 / 254,952,294 | 6.60% / 6.62% / 6.76% |
| `jp_kyushu` | JPY | 141,676,847 / 249,148,490 / 259,327,225 | 6.61% / 6.63% / 6.79% |
| `jp_hokkaido` | JPY | 137,011,870 / 241,993,856 / 249,457,593 | 6.60% / 6.62% / 6.76% |

For `pl-grant-4h`, `pl-cap-4h`, `ercot-toll-2h`, `ca_on-reference` and `es-reference`, all three acquisition cases currently return **`no-positive-price`**. The public renderer says to improve cost or income terms; its internal zero is not a free-asset bid. Saudi Arabia has no acquisition reference because the engine is withheld. Correcting a thesis cannot turn any of those statuses into an executable investment.

### Arithmetic and scope of the options

- Design figures come from `designEconomics(market, marketDesign(market), route, hours, { grantPct })`. Its grant case reruns the engine with that play's grant. Ordinary value is the design sweep's COD `exitVal - net`; the grant case recomputes that difference at COD after the grant override.
- Cash-flow equations, duration capture, grants, fees, lifecycle costs, horizon and yield conventions stay as loaded. The valuation fields used here are secured **6.5%**, renewal / merchant **10.5%**, and opex **7.0%**. No option proposes changing them or scoring weights.
- **Every recommended numerical delta is zero** for capex, revenue, grants, IRRs, MOIC, payback, secured share, price ceilings, targets and grades in every market. Dates, overdue counts and text change where specified. The only alternative below that changes ordering is **3B**; its complete ordinal impact is listed there.
- Every eventual judgement write uses the analyst writer, which updates the named `view/markets/<id>.json`, derives `view/index.json` where relevant and appends `view/changelog.jsonl`. No past changelog or ETL snapshot is rewritten. These are proposed future surfaces, not files changed by this memo.

## 1. Missing published calls: a deliberate ungraded state

**Keep the ungraded state until the analyst has a sourced view pack to rule on.** Registration is not grading. There are eighteen registered allocation markets and fifteen market-view files. None of `view/markets/ca_on.json`, `sa.json` or `es.json` exists. `buildBriefing` skips a market without a nonempty `grades` section; adding a play or a verdict alone would not make it a briefing row. `src/home/boardModel.js` expressly returns “not yet graded” rather than guessing a verdict. This is intended, with unfinished coverage.

The newer acquisition screen does create `ca_on-reference` and `es-reference` as `researchAssumed: true` at the fund's default ready-to-build stage, with a synthetic `opportunistic` tag. Those are not analyst verdicts. There is no Saudi equivalent while `engineReady: false` and `economics.contracted: null`. Do not describe the absence of a published call as absence of all engine analysis.

**Current design checks that a first view must use:**

- **Ontario:** `on-cap-8h`, `route: cap`, `hours: 8`. The simple base case is **6.81% hold / 6.31% exit**; the proposed play is **5.30% / 3.78%**, because the duration sweep applies linear tested-capacity factors `0.98^(year−1)` to the capacity line. The **1.51 percentage-point** difference is an existing difference between calculations, not a proposed revision. At year twenty the retained duration is **5.45 hours**, and a constant eight-hour obligation would require **11.74 hours** at COD. The current linear route marks the design eligible; it does **not** model the contract's repeated-test default. Gate **OC-ON** must resolve that before a bankability call. The existing grant remains **30%**, not an award inferred by this plan.
- **Spain:** `es-merchant-4h`, `route: mer`, `hours: 4`, at **2.58% hold** and **−$365,371/MW**. The engine's most valuable design is actually **two hours**, **−$304,566/MW**, while four hours has the higher hold IRR. Therefore “four hours” is an analyst choice about the entry product and future firmness, not the present value optimum. Capacity income and a project grant remain zero.
- **Saudi Arabia:** proposed `sa-sppc-4h`, `route: cap`, `hours: 4`; all returns remain **withheld**. Fifteen contract years and a four-hour configuration do not supply a payment price. No contract price may be inferred from disclosed capital cost.

| Option | Exact proposed change | Numbers / published markets |
| --- | --- | --- |
| **1A — recommended: confirm ungraded, research before calling** | Leave the three absent view files absent. Preserve the above candidate IDs/specifications in this plan. Commission gates **OC-VIEW**, **OC-ON**, **OC-SA**, **OC-ES**, with an analyst review on **30 November 2026**. The review date is a research deadline, not a procurement milestone. | No file in `src/`, `view/` or `public/data/` changes. No new shortlist rows; every published financial figure and ordinal stays fixed. |
| **1B — commission initial calls now, publication gated** | Prepare a separate initial-view proposal for `view/markets/{ca_on,sa,es}.json`: `thesis`, sourced `grades`, `verdicts.infraFund`, `triggers`, `plays`; candidates are `wait` on the three IDs above, with Ontario/Spain at `ready-to-build` and Saudi entry stage to be supported by the procurement rules. Submit every grade and its evidence for analyst ruling before writing the store. Keep other investor verdicts absent until separately ruled. | This option authorizes a **research pack**, not unknown grade numbers or publication. No present numerical change. If later approved, Ontario and Spain would expose the existing play figures in the first table, Saudi would stay withheld, and new fit scores / shortlist positions would need an explicit impact table in that pack. No effect is silently approved here. |

**Evidence: Strong** for the intentional code path; **Thin** for initial investment calls. **What would change it:** the gate-complete, separately reviewable view pack. An empty grade shell is not a substitute.

## 2. Poland: preserve the cohort split, fix “every design”

**The call split is intended and already settled by the platform.** In `view/markets/pl.json`, `verdicts.infraFund` is `wait` on `pl-cap-4h`; `plays.pl-grant-4h.calls.infraFund` explicitly says `opportunistic`. `playCall` in `src/governance/plays.js` uses a play's own call first and otherwise inherits the market verdict. `lensRows` emits own calls plus the named market play; `orderRows` sorts by call, then value. There are therefore two intentional Polish fund rows, not one contradictory row: grant **fourth overall**, capacity **sixteenth**. The grant is the first **Polish** row, not first overall.

The error is the thesis's unqualified “every design”. The ungranted sweep's best is `cap/4h` at **−$23,641/MW**. The grant cohort's merchant play is **+$209,165/MW**. Its input is **37.9%** (stored play basis; the public [NFOŚiGW programme / ranking-list page](https://www.gov.pl/web/funduszmodernizacyjny/magazyny-energii-elektrycznej-i-zwiazana-z-nimi-infrastruktura-dla-poprawy-stabilnosci-polskiej-sieci-elektroenergetycznej2) is the entitlement-verification gate), the rounded ratio **PLN 3.735bn ÷ PLN 9.847bn × 100 = 37.9303%** already approved for the cohort. That field is not added to the market's new-entry case. A capacity-plus-grant stack remains unpriced pending existing gate **MR-5**; a successor capacity framework is not evidence that a particular grant transfers to a purchaser.

The current acquisition screen's `no-positive-price` result also means that a positive build IRR is not a finding that a seller can be paid a premium after all entry costs. That further work should use the current acquisition model, not change the inherited-call rule.

| Option | Exact proposed change | Numbers / published markets |
| --- | --- | --- |
| **2A — recommended: keep both calls** | Change only the bilingual `thesis` in `view/markets/pl.json`: restrict negative-value language to **ungranted** designs and name the grant-awardee cohort as the exception. Keep `verdicts.infraFund`, `plays.pl-cap-4h`, `plays.pl-grant-4h.calls.infraFund`, `grantPct` and `pl-capacity-successor-framework` unchanged. | All figures in both engine and acquisition tables stay fixed; both rows retain their calls, positions and economics. Poland text only. |
| **2B — make the grant play the market's headline** | In the same file, move the existing grant fund call into `verdicts.infraFund` with `play: pl-grant-4h`; remove that play's duplicate own fund call. Move the old capacity fund verdict, minus its `play` pointer, into `plays.pl-cap-4h.calls.infraFund` as `wait`. Narrow the thesis as in 2A. Preserve both stages and all economics. | In-memory replay gives the same two rows, same ordering and all the same figures; only which call is inherited changes. The verdict board and `view/index.json` would show `opportunistic` instead of `wait` for Poland. Other markets' figures and ranks do not move. |

Proposed thesis direction, with no fixed engine figures embedded:

> **EN:** New entrants rely on merchant revenue while the capacity framework is unsettled. Earlier capacity-contract holders and grant awardees are separate investment cohorts: ungranted designs lose value at the platform's yields, while the grant-funded merchant play is the exception. Price the entry terms of each cohort separately.
>
> **简中：** 容量机制尚未确定时，新进入者依靠市场化收入。持有早期容量合同的资产与获补贴项目属于不同投资批次：无补贴设计按平台收益率计算损失价值，获补贴的市场化方案则是例外。应分别评估各批次的进入条件与价格。

**Evidence: Strong** for call inheritance and the current engine comparison; the grant play's live revenue evidence marker is **Fair**. **What would change it:** public cohort/project grant entitlement and transferability, plus MR-5 before combining support with a capacity contract. No new grant observation is proposed.

## 3. Romania: distinguish the condition from the priced route

**Retain the conditional fund call, but make the priced label honest.** `ro-mer-2h` has `route: mer`, `hours: 2`, `stage: operating`; the market declares `capabilities.tolling: false` and has no `economics.toll` or `tollYears`. The engine therefore models **0% secured revenue**. The fund's `where` and action require an optimiser floor, while its label reads “with an optimiser floor”. That is a real mismatch between the priced product and its label. It does not establish that the current engine has miscalculated a floor.

Finland is structurally different: `fi-toll-2h` uses `route: toll`, `tollIsFloor: true`, `tollRevertsToMerchant: true`, **seven years** and **€42,640/MW-year**. Its amount is an existing practitioner assumption, not a Romanian quotation. The engine's rule is `revenue = max(floor, net merchant + services)` during the term; only the excess belongs to the unsecured line. Changing a route string, or transplanting Finland's price/tenor, would not provide a Romanian contract.

The operating acquisition reference remains merchant too: `src/acquisition/scenarios.js` only creates a conditional floor when that scenario is explicitly selected. The current stored play does not select it. Its RON price ceilings above consequently buy the merchant cash flows under the existing reference assumptions.

| Option | Exact proposed change | Numbers / published markets |
| --- | --- | --- |
| **3A — recommended: merchant baseline, floor gate, prompt grant review** | In `view/markets/ro.json`, set `plays.ro-mer-2h.label` to **[“Merchant · 2h”, “市场化 · 2小时”]**. Rewrite `thesis`, that play's `why` and `action.text`, and `verdicts.infraFund.because/despite` to say the displayed case excludes a floor and execution requires terms passing **OC-RO-FLOOR**. Preserve `route`, `hours`, `stage`, fund `call: opportunistic` and its floor-qualified `where`. Set `action.due: 2026-11-30` (already its date); use the immediate grant-status review detailed in §3G rather than “check which projects won”. Include `ro-grant-status-review` due **2 November** as specified there. | Hold **13.70%**, exit **14.94%**, value **+$67,988/MW**, secured **0%**, market grant **20%**, all three acquisition ceilings and every target stay fixed. Only Romanian text changes, plus the immediate grant-review trigger below. |
| **3B — wait until a floor can be underwritten** | Apply 3A's label/text clarification and immediate grant review; change `verdicts.infraFund.call: opportunistic → wait`, with the reason being the missing priced downside contract. Keep the operating merchant play and all inputs. Gate **OC-RO-FLOOR** must close before a separate sourced floor proposal can add `capabilities.tolling`, `economics.toll/tollYears/tollIsFloor/tollRevertsToMerchant` in `src/markets/ro/comparison.js` and a `ro-toll-2h` play. No floor amount or economics is approved by 3B. | Financial deltas remain zero in every market; Romania's fund acquisition decision becomes `watch`. The shortlist reorders as listed below, and the engine flags the wait call as `behind` its unprotected economics. This flag is expected: it cannot price the missing contract condition. |
| **3C — retain the conditional call, defer the grant check** | Apply 3A's merchant label and text clarification but retain the original grant trigger alone; rewrite the play action to verify the ministry timetable and any outcome at its existing **30 November 2026** due date. Add no grant-review trigger. | No financial, grade or rank changes. `next` remains the unresolved **30 October** event; no new dated grant review enters the calendar. Less timely than 3A. |

3B's ordinal changes, replayed against the same model (all unlisted rows unchanged):

| Fund shortlist row | Position before → after |
| --- | ---: |
| `nem/nem-ltda-4h` | 7 → 6 |
| `fi/fi-toll-2h` | 8 → 7 |
| `gb/gb-toll-4h` | 9 → 8 |
| `caiso/caiso-cap-4h` | 10 → 9 |
| `it/it-ltda-6h` | 11 → 10 |
| `jp_kyushu/jp-kyushu-ltda-6h` | 12 → 11 |
| `jp_tokyo/jp-tokyo-ltda-6h` | 13 → 12 |
| `jp_hokkaido/jp-hokkaido-ltda-6h` | 14 → 13 |
| `ercot/ercot-toll-2h` | 15 → 14 |
| `ro/ro-mer-2h` | 6 → 15 |

The acquisition-reference ordering also changes, without moving a price or target: `nem/nem-ltda-4h` 5→4; `fi/fi-toll-2h` 6→5; `gb/gb-toll-4h` 7→6; `caiso/caiso-cap-4h` 8→7; `jp_kyushu/jp-kyushu-ltda-6h` 9→8; `jp_tokyo/jp-tokyo-ltda-6h` 10→9; `jp_hokkaido/jp-hokkaido-ltda-6h` 11→10; `ie/ie-cap-4h` 12→11; `pl/pl-grant-4h` 13→12; `it/it-ltda-6h` 14→13; `ercot/ercot-toll-2h` 15→14; `ca_on/ca_on-reference` 16→15; `es/es-reference` 17→16; `ro/ro-mer-2h` 4→17. `pl-cap-4h` and `pjm-cap-4h` stay in positions 18 and 19 there. These are order changes, not changes to their market economics.

**Evidence: Fair** for current merchant economics; **Thin** for a Romanian floor price. **What would change it:** **OC-RO-FLOOR**, a public primary term disclosure or analyst-reviewed contract specifying annual net payment, tenor, indexation, profit share above the floor, fee treatment, dispatch/availability conditions, credit support and transferability. Until then a floor's return and secured share are **unpriced**, not estimated from Finland. A later floor proposal must calculate the complete impact on Romania, acquisition ceilings and any changed comparison ordering before approval.

### 3G. The grant-call outcome: not verified, retain the audit trail

**No award list or verified closing outcome was found in the public primary material retrieved as of 31 October 2026. Do not close `ro-grant-call-close` as “awarded” or assume that passage of its expected date proves closure.**

| Primary search / read | Dated finding | What it settles |
| --- | --- | --- |
| [EIB confirmation, MF 2026-1 RO 0-006](https://www.modernisationfund.eu/wp-content/uploads/2026/07/MF-2026-1-RO-0-006-%E2%80%93-Supporting-investments-in-the-development-of-stand-alone-battery-storage-installations-of-electricity.pdf), pp. 1–3 | **11 March 2026** confirmation; proposal submitted **12 February 2026**. Total intended funding **€150m**, first requested disbursement **€60m**, minimum **2,174 MWh**, scheme **2026–2030**. | Identifies the stand-alone scheme; a programme confirmation is not a beneficiary award list or a closing notice. |
| [Modernisation Fund / Commission / EIB release](https://www.modernisationfund.eu/joint-press-release-e2-5-billion-of-eu-ets-revenues-invested-in-cleaner-energy-systems-in-11-eu-countries/) | **2 July 2026** release includes Romanian stand-alone storage among supported investments. | Confirms the programme's funding context, not the outcome of the national competitive call. |
| [Ministry of Energy call page](https://energie.gov.ro/lansare-apel-sprijinirea-investitiilor-in-dezvoltarea-instalatiilor-autonome-stand-alone-de-stocare-in-baterii-a-energiei-electrice-cu-finantare-din-fondul-pentru-modernizare-p/) and [applicant guide](https://energie.gov.ro/wp-content/uploads/2026/08/OME_915_2026_Ghid-solicitant_stand-alone_publicat_M-Of_680_17.08.2026.pdf) | Call launch and guide identified as **14–18 August 2026** documents. On **31 October 2026**, web retrieval timed out and a direct ministry request returned **HTTP 503**. | No primary closure, extension or selection outcome could be verified from these pages in this run. Publication absence cannot be inferred from a failed read. |
| Ministry / PNRR and Modernisation Fund searches | Searched storage, results, award/list, extension, **30 October 2026**, and PNRR variants on **31 October 2026**. A discovery lead reports a **22 October** extension to **15 November 2026**, but the ministry notice itself was not retrievable. | **OC-RO-GRANT**: verify that extension before treating any new date as observed. PNRR payment stories and the separate behind-the-meter/public-entity schemes do not settle this stand-alone call. |

The model already assumes `economics.grantPct: 20` and an existing per-MWh grant limit. Neither is evidence that the current asset won this call. Leave those approved assumptions unchanged; a no-result search does not imply either a new grant or a zero grant.

| Option | Exact proposed trigger / text fields | Numerical and publication effect |
| --- | --- | --- |
| **3A / 3B detail — immediate source review** | Keep `ro-grant-call-close.expected: 2026-10-30` and its `outcome` absent. Add `ro-grant-status-review` in `view/markets/ro.json`: `kind: event`, `market: ro`, `expected: 2026-11-02`, `watches: [assetReturn, policyStability]`, `direction: either`, `effect: null`; label **[“Verify the ministry's stand-alone storage-call timetable and any published outcome”, “核验能源部独立储能申报时间表及已公布结果”]**. Cite the ministry call page with `publisher: Ministry of Energy`, `access: search-summary` until opened; put the failed-access / extension-verification gate in bilingual `note`. Append its ID to every Romanian verdict `changesIf` that names the original call. | The fund row's `next` becomes `ro-grant-status-review` due **2 November 2026**. The original trigger stays overdue and contributes **one** unresolved overdue item; a new dated review is added. All revenue, grant, return and price figures remain fixed. **2 November is the analyst's review date**, not a claimed closing date. |
| **3C detail — follow up at the play-action date** | Keep both the original trigger and all `changesIf` lists; do not add a trigger. Rewrite `plays.ro-mer-2h.action.text` to verify closure/extension and any list at its existing `action.due: 2026-11-30`. | No financial delta or new trigger. `next` continues to name the overdue **30 October** event; follow-up stays **30 November**. Later and less visible than the 3A / 3B review. |

On a successful primary read: if the extension is confirmed, the original closing expectation was superseded, not awarded. Record the published amendment date and its text as the old trigger's outcome, and submit the replacement closing trigger with the observed new date. If a selection list is found, record its actual publication/event date and distinguish provisional ranking, final selection and signed grants. That later update is gated; this memo does not invent an `outcome.on`.

## 4. Japan: preserve obligation IDs, lead with the purchase decision

**The nine-hour builds are the approved implementation, not a mistaken interpretation of the IDs.** The 16 October [floor ruling](japan-ltda-floor-plan.md) required the smallest priced build that sustains the delivery obligation through the award term. The later same-day [repricing ruling](japan-ltda-repricing-plan.md) approved the operating, awarded fund call. Current `src/markets/jp/regions.js`, the three allocation modules and view files implement those decisions: nine-hour archetype and plays, six-hour minimum, a twenty-year award, no augmentation, and the regulated bid-return constant.

Current arithmetic from `termCheck`: `fade = (1 − degr/100)^(termYears−1)`; with the live inputs, `6 / 0.98^19 = 8.807564` hours, while `9 × 0.98^19 = 6.131094` hours at year twenty. Nine is the first compliant point on the declared grid. `LTDA_BID_RETURN = 4.5%` is a **pre-tax allowed bid-return input**, not the fund's equity target or a promised achieved IRR. `JP_LTDA_MERCHANT_RETENTION = 0.10` keeps only a sliver of other-market profit. The rule is already in the live code; this plan does not reopen its economics.

The ID may reasonably name that obligation. The real editorial gap is that all three current theses lead with build/area economics while the fund verdict and play say to buy an operating award holder at a workable price. The current acquisition engine already prices that purchase separately; its ceilings and targets are in the earlier table. Do not reuse the old build-plan IRRs or compare a regulated pre-tax bid return directly with a levered equity target.

| Option | Exact proposed change | Numbers / published markets |
| --- | --- | --- |
| **4A — recommended: preserve IDs, clarify both quantities** | In `view/markets/jp_tokyo.json`, `jp_kyushu.json`, `jp_hokkaido.json`, change bilingual `thesis` to lead with an operating award bought at a price clearing the fund target; explain the capped bid return and clawback, then the region's differentiator. Set each `plays.<existing-id>.label` to **[“Long-term auction award · 9h build / 6h obligation”, “长期拍卖中标 · 9小时装机／6小时义务”]** and clarify `why`. Retain `jp-tokyo-ltda-6h`, `jp-kyushu-ltda-6h`, `jp-hokkaido-ltda-6h`, `hours: 9`, `route: ltda`, `stage: operating`, calls and Round 4 trigger IDs/dates. | All three build returns, values, secured shares and acquisition ceiling/target cases stay fixed. No other market moves; no re-ranking. |
| **4B — name IDs for installed hours** | Make the same text change, but replace the three keys and record `id` fields with `jp-tokyo-ltda-9h`, `jp-kyushu-ltda-9h`, `jp-hokkaido-ltda-9h`; update each `verdicts.infraFund.play` and derive the index through the writer. Keep both quantities in labels. Do not rewrite past changelog entries or historical content scripts; an old seeding script must not be replayed as a new view update. Links/consumers naming old play keys need a migration review; story-plan edits remain a separate owner's work. | **Identifiers only**, alongside the text edits. Hours remain nine; obligation remains six. Every numerical field and ordering is unchanged. No investment benefit from this extra migration work. |

Proposed thesis directions, to be delivered in English and Simplified Chinese in a later content change:

- **Tokyo:** an operating award holder at a workable price; capped bid economics and clawback explain why price matters; connection quality and local price capture differentiate the asset.
- **Kyushu:** the same acquisition discipline; charging access in curtailed hours and transmission access determine usable upside after clawback.
- **Hokkaido:** the same acquisition discipline; non-firm connection and the route to Honshu determine delivery and capture.

Primary rule references: [OCCTO institutional detail, September 2025](https://www.occto.or.jp/assets/market-board/market/files/202509_youryou_syousaisetsumei_long.pdf), and [METI Round 4 paper](https://www.meti.go.jp/shingikai/enecho/denryoku_gas/jisedai_kiban/stable_power_supply_wg/pdf/006_s02_00.pdf), as registered in `src/markets/jp/sources.js`. The former was reopened; the latter returned HTTP 403 in this run, so the cap statement here is the verified **current code and approved-ruling** position, not a claim of a newly verified rule change.

**Evidence: Strong** for the obligation/build distinction and current implementation. **What would change it:** new primary auction terms or measured fade/augmentation evidence requiring the analyst to reopen the design; existing **G44** still gates winners' actual build cost. No such reopening is recommended.

## 5. ERCOT: add a real dated review, leave toll underwriting gated

**The missing next event is a data gap, not a rendering defect.** `view/markets/ercot.json` has `triggers: []` and the fund verdict has `changesIf: []`; `ercot-toll-2h` has no own fund call. `nextTrigger` uses unresolved IDs in that call's `changesIf`, not `reviewBy` or `action.due`. A review date alone cannot populate `next`.

The current toll input is **$90,240/MW-year for seven years**, a proxy rather than an executed price; the play requires an executed toll. Hold **-5.87%**, exit **-12.30%**, value **−$461,588/MW** and `no-positive-price` in all acquisition reference cases make a dated underwriting action useful. A public adequacy report can inform demand, saturation and tail risk; it cannot establish the price of a private toll.

**Public date:** [ERCOT's resource-adequacy page](https://www.ercot.com/gridinfo/resource), read **31 October 2026**, states that MORA is issued on the first Friday each month, two months ahead of the reporting month. The first Friday of November 2026 is **6 November**, so the scheduled report is **January 2027**. This is a calendar derivation from the operator's stated cadence, not an already-published January report. October's release for December is dated **2 October 2026** on the same page. RTC+B is not a future catalyst: [ERCOT's implementation notice](https://www.ercot.com/services/comm/mkt_notices/M-F110525-04) confirms it went live on **5 December 2025**.

| Option | Exact proposed change | Numbers / published markets |
| --- | --- | --- |
| **5A — recommended: dated MORA trigger** | Add `ercot-january-2027-mora` to `view/markets/ercot.json.triggers`: `kind: event`, `market: ercot`, `expected: 2026-11-06`, `watches: [demandGrowth, saturation]`, `direction: either`, `effect: null`; label **[“January 2027 MORA: review winter evening adequacy and battery availability”, “2027年1月资源充裕度月报：复核冬季晚高峰供需与电池可用性”]**. Source `{publisher: ERCOT, url: https://www.ercot.com/gridinfo/resource, access: opened}`; bilingual note records the schedule arithmetic and that it is not toll-price evidence. Set fund `changesIf: [ercot-january-2027-mora]` and `plays.ercot-toll-2h.action.due: 2026-11-06`, with an action to read the report and underwrite the executed toll separately. Preserve `reviewBy: 2027-03-31`. | Fund `next: null → ercot-january-2027-mora`; one dated event and one dated action enter the briefing. No automatic effect. No toll price, tenor, income, return, price ceiling, target, grade or rank moves in ERCOT or any peer. |
| **5B — an earlier analyst review of the published winter outlook** | Instead add `ercot-winter-2026-adequacy-review` with the same kind, market, watches, direction, source and null effect, `expected: 2026-11-02`; label it explicitly as the **analyst's review of the already published December MORA**, not a new publication. Use its ID in the fund `changesIf` and set the play action to **2 November**. | Same zero financial impact; `next` becomes that review ID with the earlier analyst date. It does not await new evidence, so 5A is preferred. |

**Evidence: Strong** for the missing link and official publication cadence; **Thin** for toll price. **What would change it:** **OC-ER-TOLL**, a primary disclosed two-hour toll's price/tenor or analyst-reviewed executed agreement, including indexation, toll/market-tail allocation, availability deductions, credit support and eligibility. No revenue revision is authorized from MORA alone.

## Research gates and recorded rulings

| Gate | Required evidence / next action | Decision it can change |
| --- | --- | --- |
| **OC-VIEW** | Separately propose sourced grades, any knock-outs, fund verdict, play, trigger and full numeric/ranking impact for each ungraded registration. Analyst review **30 November 2026**. | Whether the three missing analyst calls should be published; current absence is intentional. |
| **OC-ON** | Read the actual LT2 tested-capacity/default provisions against the no-augmentation design and entry window; reconcile simple base versus duration-tested play, and project-specific tax-credit eligibility. Public sources: IESO contract, RFP and test schedules. Retain existing ON research gates. | A bankability call on `on-cap-8h`; no approved model assumption is changed here. |
| **OC-SA** | Existing SA-1: a public primary SSA payment price and complete terms; do not infer from investment value. Entry rights/stage must be sourced too. | Engine-withheld status and whether `sa-sppc-4h` can be underwritten. |
| **OC-ES** | Existing ES-1/ES-5: primary capacity-auction firmness, price and term, or grant entitlement per awarded project; distinguish a four-hour product choice from the two-hour value optimum. | A contracted/grant call rather than an uncontracted screen. |
| **OC-RO-FLOOR** | Complete floor term sheet and credit support, publicly disclosed or analyst-reviewed; prevent double counting gross trading and floor payment. | Whether to submit a separate priced `ro-toll-2h` proposal. |
| **OC-RO-GRANT** | Read the ministry amendment and any provisional/final beneficiary list. Selected next review: **2 November 2026** under 3A. Keep programme funding, closing and signed awards distinct. | Trigger resolution/replacement and any future project grant claim. |
| **OC-ER-TOLL** | Executed or primary disclosed price and complete terms; read the scheduled MORA on **6 November 2026** for tail/saturation risk. | Whether `ercot-toll-2h` has an executable case; public adequacy data alone cannot close it. |

**Four grouped rulings — all A, recorded 31 October 2026:**

1. **Coverage — 1A:** retain the three ungraded registrations and research gates; review by **30 November 2026**.
2. **Editorial corrections — 2A + 4A:** preserve Poland's cohort split and Japan's obligation IDs; clarify their theses and labels.
3. **Romania — 3A:** retain a conditional opportunistic call with explicitly merchant economics; verify primary grant notices on **2 November 2026**.
4. **ERCOT — 5A:** use the January MORA release expected on **6 November 2026** as the next public research event.

These directions are settled for this plan. The alternatives above are retained for the decision record. Implementation remains outside the current request.

## Validation and hand-off

Only this dated plan is added in the isolated research branch. The scratch scripts and their JSON outputs are outside the repository. The current model and the two numerical call alternatives were run in memory; no input, view, trigger, play, fixture or ETL snapshot was written. No commit, push or PR was made. Nothing in `docs/immersive-experience-plan/` was edited.

Before writing the plan, its full text was checked against the main checkout's confidential-marker file without emitting or copying any marker. The protected supplier-quote customer and quote identifier are not used. No licence-restricted report was used as a publishable source. The final check is `git diff --check` plus the branch diff/status and confirmation that the final fast-forward changed no model/data inputs; application tests and baseline regeneration are not needed for a research-only Markdown addition.