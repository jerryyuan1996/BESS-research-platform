# Poland: Six-Chapter Storyboard

Pack: BESS-IX-2026-10-30; Poland script researched 31 October 2026; shot layout v1.2
Status: editorial decisions signed off by the analyst on **1 November 2026**, with the revisions recorded below. Final dependency reconciliation and exact-head checks required before merge. G-1 documentation only; G-2 implementation and publication gates remain separate.
Navigation: [Master plan](README.md) | [Narrative card](market-narratives.md#3-eighteen-market-candidate-story-cards) | [Evidence specification](evidence-and-content-specification.md) | [WA format](western-australia-storyboard.md) | [Sources and claims](#11-sources-and-claims)

## 1. Scope, argument and reading route

The story explains **two published infrastructure-fund calls that the platform keeps separate**, read from `view/markets/pl.json` and the briefing model on `main` at `edcb39c` (REPO-PL-LIVE), not from the stale October content document. At the 31 October check:

| Call | Where it lives | Call ID, rendered | Play, entry | Shortlist position |
| --- | --- | --- | --- | --- |
| The market's verdict | `verdicts.infraFund` | `wait`, **Watch / 保持观察** | `pl-cap-4h`, Capacity market · 4h, ready-to-build | 16th of 17 fund rows |
| The grant cohort's own call | `plays.pl-grant-4h.calls.infraFund` | `opportunistic`, **Situational / 择机投入** | `pl-grant-4h`, Grant-funded merchant · 4h, ready-to-build | 4th of 17; the first Polish row |

Both rows carry evidence `fair` and watch the same undated trigger, `pl-capacity-successor-framework`. The thesis is the 31 October ruling 2A text: no new-entry capacity route while the capacity framework is unsettled, so new entrants rely on day-ahead revenue and every ungranted design loses value at the platform's yields; a project in the 2025 grant cohort is the exception with its own call; an asset holding an earlier seventeen-year contract is worth pricing only below replacement cost. The story never copies the thesis, `why`, `because` or `despite` strings, all of which carry typed figures.

**Which card opens the story (CF-PL-01).** The market page passes the story one row: `opportunities(lens)` keeps the first Polish row of the shortlist, which under the fund lens is `pl-grant-4h`. The page's play card, decision panel, next action and the story's `row` therefore all show the grant cohort's Situational call. The market verdict, Watch on `pl-cap-4h`, appears on none of the home, comparison or market pages. pl-00 opens on the card the page passes and adds the market verdict as a second card bound to the briefing's verdict row; the analyst decides this at G-1.

Allocation: `pl`; physical boundary: Poland's national system, one bidding zone, operated by PSE. Default lens: `infraFund`. `reviewedAgainst`: **REPO-PL-LIVE**.

**Argument**, in the order the story tells it:

1. Poland pays for capacity because adequacy was the problem it set out to fix: an ageing coal fleet, units due to close, and supply to industry limited in the summer of 2015 (CL-PL-04, CL-PL-05).
2. The capacity market, approved in 2018, offered new plant agreements of up to seventeen years. Batteries entered while their correction factor was near full and won such agreements in the auctions for 2027 and 2028 delivery (CL-PL-03, CL-PL-06, CL-PL-08).
3. The scheme had an end date. The law schedules no main auction after the one held in December 2025 for 2030 delivery, and in its last auctions the factor for batteries fell to a fraction of its earlier level. The auctions that remain are for units already running, a quarter or a year at a time, until 2028 (CL-PL-06, CL-PL-10, CL-PL-11).
4. So a new battery has no capacity contract to win. It must trade, and on the platform's model every ungranted design loses value at the platform's yields. The market's verdict waits for a successor. Meanwhile an asset holding an earlier agreement is worth buying only below replacement cost, and what that agreement is worth depends on the auction it came from (CL-PL-18, CALC-PL-01).
5. The grant cohort is the exception. NFOŚiGW's programme pays part of a project's build cost, with completion and durability conditions. The trading case is unchanged, the capital at risk is smaller, and the cohort's own call follows (CL-PL-13 to CL-PL-15).
6. The two cohorts are separate investments: different payers, different obligations. A project holding both has its capacity price reduced by the grant (CL-PL-02).

Comprehension check: from the story alone, the reader can say why the market's verdict waits, why an earlier capacity agreement is priced only below replacement cost, and why a project in the grant cohort carries its own call, and can say that a grant is conditional capital support, not income.

**Competing explanation:** the battery factor fell because the statute ties it to each technology's forecast share in security of supply (Act art. 18(2)), so the cut may reflect a growing fleet's smaller marginal contribution rather than a judgement against storage. Trading spreads may also hold up better than the model's transferred compression curve. A successor that rewards duration could reopen a new-entry route.

**Disconfirming condition:** a legislated successor with a route for new storage (the watched trigger); realised Polish trading results well below the model; grant conditions that do not survive a sale to a fund; or cohort projects that miss their completion window. Any of these changes the investment meaning and needs re-sign-off; research does not re-grade the market.

| Chapter / page heading EN · 简体中文 | Shots | What the reader can explain afterwards |
| --- | --- | --- |
| Opening · 开篇 | pl-00 | The two calls, their plays and next actions |
| Origins · 系统起点 | pl-01 | Why adequacy, not price, is the problem Poland pays to solve |
| Historical choices · 历史选择 | pl-02–04 | Long agreements for new plant; batteries entering at near-full credit; a scheme with an end date |
| Today's tensions · 当下矛盾 | pl-05–07 | The same battery contracts a fraction; no new-entry route; trading alone does not clear the yields |
| Add a battery · 加入电池 | pl-08–09 | Why four hours; what a fund buys in a ready-to-build project |
| Who pays · 谁来付钱 | pl-10–11 | Two cohorts, two payers; how a grant changes the return |
| The investment · 回到投资 | pl-12 | What weakens each call, and where to check it |

Thirteen shots, about five minutes. Shared fixed-view isometric SVG kit, off-white and deep green, plain HTML copy and accessible 2D equivalents. The outline of Poland reuses the boundary already in the repository (`src/markets/pl/pl-boundary-2024.json`, Eurostat GISCO); plant and site positions are never drawn. No model execution, dispatch engine or underwriting control inside the story.

### Rules for every shot

- **Figures.** Every page-facing amount, percentage, duration, count, date and plotted label is a named `‹bound: …›` token. Financial tokens resolve to fields the market page and briefing already compute (§9). Historical and observed tokens resolve to the dated records in §11. No figure from `thesis`, `why`, `because` or `despite` is copied.
- **Two calls, never blended.** Each shot's Meaning line says which cohort it serves. The two plays are never summed, averaged or shown as one recommendation. A grant is never shown as recurring income, and an award or a list place is never shown as a receipt.
- **Controls.** Only era, cohort, route, teaching battery preset, evidence drawer and hotspot. Nothing changes the investment case. Back, refresh and a language switch keep the reader's place, as in `WP-04`.
- **Evidence.** One marker per shot in the site's fixed strings, Strong evidence (证据充分), Fair evidence (证据尚可) or Thin evidence (证据单薄), followed by "What would change it:" / "会改变判断的证据：". A Strong marker assumes the analyst's review at G-1. pl-00 keeps each card's own marker. Authoring checks and status never reach the page.
- **Time and rights.** Observations solid, plans and absent schedules dashed, teaching values tagged **Example / 示例**. Capacity prices (PLN/kW/year) never share an unlabelled axis with energy prices (EUR or PLN/MWh). No exchange day-ahead price series is plotted anywhere in this story.
- **Language.** All page text is drafted in English and Simplified Chinese with the same meaning. Source titles keep their original language.

## 2. Opening

### pl-00 — The two calls · 两个投资判断

| Item | Shot specification |
| --- | --- |
| Scene | Small static outline of Poland beside two cards, the grant cohort's card first because the page passes it; no animation |
| Feedback | None; this shot is the conclusion. A text alternative carries both cards' fields in the same order |
| Evidence and chart | REPO-PL-LIVE; CL-PL-18. Card 1: the existing market-page play card for `row` (`pl-grant-4h` at check). Card 2: the briefing's verdict row for the same lens (`pl-cap-4h` at check). No new chart |
| Authoring check | The page passes only the first Polish shortlist row; card 2 needs the story shell to receive the verdict row as well (BUILD-PL-01, CF-PL-01). Card 1's figures are the investment-summary fields the decision panel shows; card 2 shows call, play, evidence and next action only, because no investment summary is computed for a second row. Never copy the 17.1%, 9.8%, 7.4%, 37.9% or "about $200k per MW" in the view's strings (CF-PL-04). If either call or play changes, the card updates itself and `reviewedAgainst` flags the story |
| Mobile | Card 1 full width, card 2 beneath, then two buttons; no scene before the conclusion |
| Status | `sourced` / `model-assumes-route`; card source flagged for G-1 (CF-PL-01) |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What are the calls here, and why are there two? | 这里的投资判断是什么？为什么有两个？ |
| Copy | **Grant cohort · own call:** ‹bound: call› · ‹bound: play name› · ‹bound: card figures› · ‹bound: next action›. **Market verdict:** ‹bound: market call› · ‹bound: market play name› · ‹bound: market next action›. Poland holds two cohorts that are separate investments: projects in the grant cohort, and assets holding an earlier capacity agreement. Without a grant, every design loses value at the platform's yields. | **补贴批次 · 独立判断：** ‹bound: call› · ‹bound: play name› · ‹bound: card figures› · ‹bound: next action›。**市场判断：** ‹bound: market call› · ‹bound: market play name› · ‹bound: market next action›。波兰有两个批次，属于不同的投资：补贴批次中的项目，以及持有早期容量合同的资产。没有补贴，每种设计按本平台收益率都会损失价值。 |
| Marker | Each card keeps its play's own marker | 两张卡片各自沿用方案自身的证据标记 |
| Controls | Start the story · [Go to the investment case](/markets/poland#bankable) | 开始阅读 · [查看投资方案](/markets/poland#bankable) |

## 3. Origins

### pl-01 — A system built to keep its own lights on · 为保障供电而建的系统

| Item | Shot specification |
| --- | --- |
| Scene | The Poland outline with generic coal-unit symbols spread schematically, transmission lines and industrial loads; the second toggle dims the industrial loads. No measured values or flows |
| Feedback | Labels change with the toggle; the caption stays outside the drawing |
| Evidence and chart | CL-PL-04 (event), CL-PL-05 (interpretation); SRC-PL-02 recitals (5)–(6) and (140); H-PL-01 |
| Authoring check | The Commission records the 2015 shortages as the Polish authorities' stated concern; keep the event apart from the causal reading. No coal share or unit count: no observed primary generation-mix series was opened (GAP-PL-2015). Do not draw plant locations |
| Mobile | Same outline, text first, two buttons |
| Status | Event `sourced` through the Commission's decision; PSE's own record not opened; causal reading `proposed` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What kind of system is this? | 这是一个怎样的电力系统？ |
| Copy | Poland's power system was built around coal. Many units were old and due to close, and in the summer of ‹bound: H-PL-01 year› supply to large industrial users had to be limited. | 波兰的电力系统围绕煤电建成。许多机组已经老化、即将关停；‹bound: H-PL-01 year›年夏天，大型工业用户的供电不得不受到限制。 |
| Meaning | Poland pays for capacity to keep the system adequate; that payment is the route the market's verdict watches. | 波兰为容量付费，是为了保证系统供电充足；该市场的判断所关注的，正是这条付费路径。 |
| Marker | Fair evidence. What would change it: PSE's dated record of the ‹bound: H-PL-01 year› supply limits and a primary generation-mix series. | 证据尚可。会改变判断的证据：PSE关于‹bound: H-PL-01 year›年限电的带日期记录，以及一手的发电结构数据。 |
| Controls | The coal fleet · Summer ‹bound: H-PL-01 year› | 燃煤机组 · ‹bound: H-PL-01 year›年夏季 |
| Labels | Coal-fired units (schematic) · Large industrial users · Supply limited | 燃煤机组（示意） · 大型工业用户 · 供电受限 |
| Caption | Schematic. Plant locations are not shown. | 示意图，不显示电厂位置。 |

## 4. Historical choices

### pl-02 — Paying for capacity · 为容量付费

| Item | Shot specification |
| --- | --- |
| Scene | The shared timeline H-PL-01–06 under the outline; a central auction feeds contract bars by unit type: one year for existing units, longer for modernised units, longest for new units that meet the emission standard |
| Feedback | Selecting a node changes one layer; node text is in §9. Bars carry bound terms |
| Evidence and chart | CL-PL-03; SRC-PL-01 arts. 25(4)–(5) and 29(3); SRC-PL-02 recitals (4), (43), (49)–(50), (109)–(110); SRC-PL-05 for the first auctions; H-PL-02 |
| Authoring check | Terms are maxima a certificate allows; the longest is the fifteen-year new-build maximum plus the two-year low-emission extension. Batteries meet the emission standard; in the auction for 2028 delivery all 33 battery units hold the longest term (SRC-PL-07 cross-check). A capacity agreement is a delivery obligation with penalties, financed by a charge on electricity users; do not call it a storage subsidy |
| Mobile | Vertical timeline, then the three bars |
| Status | `sourced` (Act and Commission decision opened 31 Oct 2026) |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why does Poland pay for capacity? | 波兰为什么为容量付费？ |
| Copy | To keep enough capacity, Poland created a capacity market in ‹bound: H-PL-02 act year›. The grid operator, PSE, runs the auctions; winners are paid for being available and penalised if they fail to deliver. New plant meeting an emission standard could win agreements of up to ‹bound: new-build term› years, and batteries meet it. | 为保证足够的容量，波兰于‹bound: H-PL-02 act year›年建立容量市场。由电网运营商PSE组织拍卖；中标者因保持可用而获得付费，未能履约则受罚。满足排放标准的新建机组，可获得最长‹bound: new-build term›年的合同，电池符合这一标准。 |
| Meaning | An earlier capacity agreement is long, fixed income; an asset holding one is a different investment from a new entrant. | 早期容量合同是一笔长期、固定的收入；持有此类合同的资产，与新进入者是不同的投资。 |
| Marker | Strong evidence. What would change it: an amendment changing the terms of agreements already signed. | 证据充分。会改变判断的证据：修改已签合同条款的法律修订。 |
| Controls | Existing units · Modernised units · New units · Select a node | 既有机组 · 改造机组 · 新建机组 · 选择节点 |
| Labels | Up to ‹bound: existing term› year · Up to ‹bound: modernised term› years · Up to ‹bound: new-build term› years · Paid for availability · Penalty for failing to deliver | 最长‹bound: existing term›年 · 最长‹bound: modernised term›年 · 最长‹bound: new-build term›年 · 因保持可用而付费 · 未履约受罚 |

### pl-03 — Batteries enter at near-full credit · 电池以接近全额的折算进入

| Item | Shot specification |
| --- | --- |
| Scene | Timeline node H-PL-03; battery symbols join the contracted fleet as long bars; a gauge shows certified power × correction factor = capacity obligation |
| Feedback | The gauge and two bars change with the delivery-year toggle |
| Evidence and chart | CL-PL-06, CL-PL-08, CL-PL-17; SRC-PL-10 and SRC-PL-11 (factor); SRC-PL-16, pp. 5–6 and Figure 1 (battery volumes); SRC-PL-06 and SRC-PL-07 (term cross-check); H-PL-03 |
| Authoring check | Obligations are de-rated MW, not nameplate. The first battery volume is batteries only, not the auction's seventeen-year total, which includes other new plant (CF-PL-06). "Near-full" means the factor applied to certified power; certification itself needs four uninterrupted hours (pl-08). Never "won a subsidy" |
| Mobile | Two bars with factor labels; text first |
| Status | `sourced` (opened); battery split for the later auctions pending (GAP-PL-TECH) |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why did the earlier auctions build a contracted battery fleet? | 为什么早期拍卖催生了一批签约电池？ |
| Copy | Because a battery could commit almost all of its power. In the auctions for delivery in ‹bound: first battery delivery year› and ‹bound: second battery delivery year›, the correction factor for batteries was ‹bound: battery factor, early auctions›, so a battery could commit nearly its full output for ‹bound: new-build term› years. Battery obligations grew from ‹bound: battery obligation, first auction› to ‹bound: battery obligation, second auction›, across ‹bound: battery units, second auction› units. | 因为电池几乎可以把全部功率签进合同。在交付年为‹bound: first battery delivery year›和‹bound: second battery delivery year›的拍卖中，电池的可用性修正系数为‹bound: battery factor, early auctions›，电池几乎能以全部出力签订‹bound: new-build term›年的合同。电池的容量义务由‹bound: battery obligation, first auction›增至‹bound: battery obligation, second auction›，涉及‹bound: battery units, second auction›个机组。 |
| Meaning | Those agreements keep the terms of the auction that awarded them; this is the cohort the market's verdict prices, and only below replacement cost. | 这些合同沿用授予时那一轮拍卖的条款；该市场的判断所定价的正是这一批次，且仅以低于重置成本的价格。 |
| Marker | Strong evidence. What would change it: URE revising the battery volumes in its storage report. | 证据充分。会改变判断的证据：URE修订其储能报告中的电池签约量。 |
| Controls | Delivery ‹bound: first battery delivery year› · Delivery ‹bound: second battery delivery year› · How the obligation is counted | 交付年‹bound: first battery delivery year› · 交付年‹bound: second battery delivery year› · 容量义务如何计算 |
| Labels | Certified power · Correction factor · Capacity obligation · Battery agreements | 认证功率 · 可用性修正系数 · 容量义务 · 电池合同 |

### pl-04 — A scheme with an end date · 有截止日期的机制

| Item | Shot specification |
| --- | --- |
| Scene | Timeline nodes H-PL-04 and H-PL-05; the auction calendar ends at the last scheduled main auction; after it a dashed band reads "No main auction scheduled"; coal units fade into one-year bars that stop at the end of the supplementary period |
| Feedback | The band and the bars change with the toggle; the research check date is shown beside the dashed band |
| Evidence and chart | CL-PL-10, CL-PL-11; SRC-PL-01 arts. 2(1)(3a), 29(3) and 39a(1)–(4); SRC-PL-02 recital (109) and conclusion; SRC-PL-03 arts. 2–3 and recital (73); SRC-PL-04 (no later act); H-PL-04, H-PL-05 |
| Authoring check | The mechanism has not ended: signed agreements run their full terms and one-year auctions continue for existing units. What ended is the route to a new long agreement. The successor is absent from the consolidated Act of 2 October 2026 and from its list of implementing acts; ministry intentions reported in the press are not page facts (§11, discovery leads). Future items dashed |
| Mobile | Vertical calendar with the dashed end band |
| Status | `sourced`; successor `missing`, trigger undated |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why did the long contracts stop? | 长期合同为什么停了？ |
| Copy | The capacity market was approved for a fixed period. The law schedules main auctions only up to the one held in ‹bound: last main auction year›, for delivery in ‹bound: last main delivery year›. EU emission rules also ended coal's long contracts: coal may stay only in one-year auctions until ‹bound: supplementary end year›. | 容量市场只获批固定期限。法律排定的主拍卖到‹bound: last main auction year›年那一轮为止，对应交付年为‹bound: last main delivery year›年。欧盟排放规则也终止了煤电的长期合同：煤电只能在‹bound: supplementary end year›年前参加一年期拍卖。 |
| Meaning | Signed agreements run their full term; what has ended is the route to a new one, which is the event the market's verdict watches. | 已签合同照常履行至期满；终止的是取得新合同的路径，这正是该市场的判断所关注的事件。 |
| Marker | Strong evidence. What would change it: ‹bound: watched event›. | 证据充分。会改变判断的证据：‹bound: watched event›。 |
| Controls | Main auctions · One-year auctions · After ‹bound: last main delivery year› | 主拍卖 · 一年期拍卖 · ‹bound: last main delivery year›年以后 |
| Labels | Scheduled main auction · No main auction scheduled · One-year auctions for existing units · Coal derogation ends | 已排期主拍卖 · 无主拍卖排期 · 既有机组一年期拍卖 · 煤电豁免到期 |
| Caption | Dashed: not scheduled in law at ‹bound: research check date›. | 虚线：截至‹bound: research check date›，法律未作排期。 |

## 5. Today's tensions

### pl-05 — The same battery, a fraction of the contract · 同一台电池，合同只剩零头 (signature chart / 核心图表)

| Item | Shot specification |
| --- | --- |
| Scene | **Signature chart Chart-PL-AUCTIONS**, full width, with a calm thumbnail. Two aligned panels on one delivery-year axis: the upper shows the main-auction clearing price and, as labels, the battery correction factor; the lower shows what one kW of a battery of at least four hours could contract (price × factor, CALC-PL-01). A dashed band after the last scheduled main auction |
| Feedback | Hover or tap gives the auction date, URE notice, price, factor and contract value from the record. Battery obligations appear as small markers only where URE publishes a battery split; the later auctions read "Technology split pending" |
| Evidence and chart | CL-PL-06, CL-PL-07, CL-PL-08, CL-PL-09; SRC-PL-05 to SRC-PL-12 and SRC-PL-16; CALC-PL-01; GAP-PL-AUCTIONS (dataset not registered), GAP-PL-TECH. Full contract in §11 |
| Authoring check | Price and factor come from separate documents for each auction. The contract value is gross capacity revenue per kW of certified power before any aid deduction and before indexation: not cash received, not a return. Nominal PLN by auction vintage; no forecast after the last auction. The catch-up auction is a separate product, shown as a distinct marker. Never infer battery volumes from contract length |
| Mobile | Panels stacked, data table beneath, crosshair by keyboard or tap |
| Status | Data `sourced` and opened; CALC-PL-01 `proposed`; dataset unregistered; G-1 reviews the chart design. Nothing is built |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What could one battery contract, auction by auction? | 同一台电池，在各轮拍卖中能签下多少合同？ |
| Copy | A battery's contract is the clearing price times its correction factor. In the auction for delivery in ‹bound: first battery delivery year›, that came to ‹bound: contract value, first battery auction› per kW. By the auction for ‹bound: last main delivery year›, the factor had fallen to ‹bound: battery factor, last main auction›, and the same battery could contract ‹bound: contract value, last main auction›. No main auction is scheduled after it. | 电池能签下的合同，等于出清价乘以其可用性修正系数。在交付年为‹bound: first battery delivery year›的拍卖中，这一数值为每千瓦‹bound: contract value, first battery auction›。到交付年为‹bound: last main delivery year›的拍卖，修正系数已降至‹bound: battery factor, last main auction›，同一台电池只能签下‹bound: contract value, last main auction›。此后再无主拍卖排期。 |
| Meaning | What an earlier agreement is worth depends on the auction that awarded it, so an asset holding one is priced one by one, below replacement cost. | 早期合同的价值取决于授予它的那一轮拍卖，因此持有此类合同的资产须逐一定价，且须低于重置成本。 |
| Marker | Fair evidence. What would change it: the analyst's sign-off of the contract-value calculation and URE's technology split for the last two auctions. | 证据尚可。会改变判断的证据：分析师确认合同价值的计算方法，以及URE公布最近两轮拍卖的技术构成。 |
| Controls | Clearing price · Correction factor · Contract per kW · How measured | 出清价 · 修正系数 · 每千瓦合同额 · 计算方法 |
| Labels | Delivery year · Clearing price, PLN/kW/year · Battery correction factor · Contract per kW of battery, PLN/kW/year · Battery obligations awarded, MW · Technology split pending · Catch-up auction · No main auction scheduled | 交付年 · 出清价（兹罗提/千瓦/年） · 电池修正系数 · 每千瓦电池合同额（兹罗提/千瓦/年） · 电池获授容量义务（MW） · 技术构成待公布 · 追加拍卖 · 无主拍卖排期 |
| Caption | Sources: URE final auction results; auction-parameter regulations in Dziennik Ustaw; URE storage report. Contract per kW is price × factor, before any aid deduction. | 来源：URE拍卖最终结果；《法律公报》所载拍卖参数条例；URE储能报告。每千瓦合同额＝出清价×修正系数，未扣除任何补贴抵减。 |

### pl-06 — No new-entry route · 新进入者没有容量路径

| Item | Shot specification |
| --- | --- |
| Scene | A new battery at a connection point and four doors: the main auction (closed after the last scheduled one), quarterly additional auctions and one-year supplementary auctions (both open only to units already running), and a dashed door for the successor (not legislated) |
| Feedback | Selecting a door shows who may enter and for how long |
| Evidence and chart | CL-PL-10, CL-PL-11, CL-PL-12; SRC-PL-01 arts. 2(1)(1), (3a), (9), 25(2), 25(4)(3)–(4), 29(3)–(6), 39a(4); SRC-PL-03; SRC-PL-13 and SRC-PL-14; REPO-PL-LIVE trigger |
| Authoring check | A unit counts as existing only if connected and commissioned before certification. The one-year auction for 2027 delivery cleared at its own price for existing units; do not present it as a contract a new entrant can plan on. The window for a catch-up auction for 2030 delivery closed on 30 April 2026 with no regulation (CL-PL-10) |
| Mobile | Four door cards stacked |
| Status | `sourced`; successor `missing` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Can a new battery still win a capacity contract? | 新建电池还能拿到容量合同吗？ |
| Copy | Not a long one. No main auction is scheduled after the one for ‹bound: last main delivery year›. The auctions that remain buy capacity a quarter or a year at a time, only from units already connected and commissioned, and only until ‹bound: supplementary end year›. A successor framework is not yet law. | 拿不到长期合同。交付年‹bound: last main delivery year›之后不再有主拍卖排期。剩下的拍卖每次只采购一个季度或一年的容量，只向已并网投运的机组采购，并且只持续到‹bound: supplementary end year›年。接续机制尚未立法。 |
| Meaning | Until a successor exists, a new capacity battery has no contract to underwrite, so the market's verdict waits for one. | 在接续机制出现之前，新建的容量型电池没有可承保的合同，因此该市场的判断是等待。 |
| Marker | Strong evidence. What would change it: a legislated successor framework with a route for new storage. | 证据充分。会改变判断的证据：完成立法的接续机制，并为新建储能提供参与路径。 |
| Controls | Main auction · Quarterly auctions · One-year auctions · Successor | 主拍卖 · 季度拍卖 · 一年期拍卖 · 接续机制 |
| Labels | Closed after ‹bound: last main delivery year› · Existing units only · A quarter at a time · A year at a time, until ‹bound: supplementary end year› · Not legislated | ‹bound: last main delivery year›年后关闭 · 仅限既有机组 · 每次一个季度 · 每次一年，至‹bound: supplementary end year›年 · 尚未立法 |

### pl-07 — Without a contract or a grant · 既无合同也无补贴

| Item | Shot specification |
| --- | --- |
| Scene | A teaching day: an unscaled price shape, the battery charging in the cheap hours and discharging in the dear ones, tagged Example; two value cards from the existing design grid beneath |
| Feedback | Charge and discharge controls move the Example only; "Show model values" opens the two cards |
| Evidence and chart | CL-PL-18; REPO-PL-LIVE: `grids.pl` cells and the merchant line's basis (`merchantEvidence`, `merchantCurveBasis`). No observed price chart |
| Authoring check | No exchange day-ahead series here: price-data rights are under the analyst's separate review (§11). Values are the design engine's value per MW at the platform's yields, in USD, a different basis from card 1's IRR (CF-PL-04). "Loses value" means negative value at those yields, not an operating loss. The compression curve is fitted on another market, which the grant call names as its own limit |
| Mobile | Example shape, then the two value cards |
| Status | `model-assumption`; `sourced` from the live briefing; observed price layer withheld |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What does a new battery earn without a contract or a grant? | 既无合同又无补贴的新建电池，靠什么赚钱？ |
| Copy | Trading. It charges when day-ahead prices are low and sells when they are high. On the platform's model that is not enough: at the platform's yields, the same battery is worth ‹bound: ungranted merchant value› per MW, and even the best ungranted design, which holds a capacity agreement, is worth ‹bound: ungranted best value›. | 靠交易。日前电价低时充电，高时售电。按本平台模型，这还不够：按本平台收益率，同样的电池每MW价值为‹bound: ungranted merchant value›；即便是持有容量合同的最优无补贴设计，每MW价值也只有‹bound: ungranted best value›。 |
| Meaning | A new entrant's case rests on trading alone and does not clear the yields; an asset holding an earlier agreement clears them only if bought below replacement cost. | 新进入者的投资逻辑只能依靠交易，达不到收益率要求；持有早期合同的资产，只有以低于重置成本的价格买入才能达到。 |
| Marker | Fair evidence. What would change it: realised Polish trading results and a compression curve fitted on Poland's own fleet. | 证据尚可。会改变判断的证据：波兰电池的实际交易收益，以及按波兰自身储能规模拟合的价差压缩曲线。 |
| Controls | Charge · Discharge · Show model values | 充电 · 放电 · 显示模型价值 |
| Labels | Example · Day-ahead price (unscaled) · Model value per MW at the platform's yields | 示例 · 日前电价（无刻度） · 按本平台收益率计的每MW模型价值 |

## 6. Add a battery

### pl-08 — Why this duration? · 为什么是这个时长？

| Item | Shot specification |
| --- | --- |
| Scene | Station cutaway with energy blocks; a certification gauge holds full power across the test hours; a shorter Example battery is certified as a smaller one |
| Feedback | The preset changes the energy blocks and the certified-power readout; no financial effect |
| Evidence and chart | CL-PL-17; SRC-PL-15 pkt 6.3.2.5 and 7.4.2.1(8); REPO-DG1 (shorter batteries certify MWh ÷ test hours); REPO-PL-LIVE `grids.pl.byRoute.mer.band` and `row.play.hours`; SRC-PL-19 and SRC-PL-20 (grant minimum size) |
| Authoring check | The four-hour test is a capacity certification rule, not a trading requirement. The grant programme requires at least 2 MW and 4 MWh, which a two-hour unit can meet, so it does not set the play's duration. Do not quote a cohort average duration: no primary figure exists. MWh ÷ test hours is the platform's reading of the rules, which PSE has not confirmed |
| Mobile | Cutaway and two presets; the readout below |
| Status | `sourced`, `model-assumption` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why are both plays ‹bound: play duration› hours? | 为什么两条路线都是‹bound: play duration›小时？ |
| Copy | For capacity, the test sets it: a battery is certified only for the power it can hold for ‹bound: certification hours› uninterrupted hours, so a shorter battery is credited as a smaller one. For trading, the platform's model cannot separate ‹bound: merchant band› hours by value. Both plays use ‹bound: play duration› hours. | 对容量而言，认证测试决定时长：电池只按其能连续保持‹bound: certification hours›小时的功率获得认证，时长较短的电池只能按更小的电池计入。对交易而言，平台模型在价值上无法区分‹bound: merchant band›小时。两条路线都采用‹bound: play duration›小时。 |
| Meaning | This duration keeps a battery fully creditable for capacity and inside the model's best band for trading, so it fits both cohorts. | 这一时长既能让电池获得全额容量认证，又处于模型交易价值的最优区间，因此适用于两个批次。 |
| Marker | Fair evidence. What would change it: PSE confirming how a battery shorter than the test is certified, or a design result that moves the trading band. | 证据尚可。会改变判断的证据：PSE确认时长不足的电池如何认证，或设计测算结果改变交易最优区间。 |
| Controls | Shorter battery (Example) · ‹bound: play duration› hours · Certification test | 较短电池（示例） · ‹bound: play duration›小时 · 认证测试 |
| Labels | Certified power · Hours held at full power · Example | 认证功率 · 满功率持续小时数 · 示例 |

### pl-09 — What the investor buys · 投资者买到的是什么

| Item | Shot specification |
| --- | --- |
| Scene | Exploded cutaway as SVG layers with rights-and-obligations hotspots: connection, permits, capacity agreement with its milestones, grant agreement with its conditions |
| Feedback | The selected hotspot shows its function, obligation and evidence status; project documents read "not verified" |
| Evidence and chart | CL-PL-03 (SRC-PL-01 arts. 44(4)–(5), 46(1)(2), 52(1)–(2)); CL-PL-13 (SRC-PL-19 §§6–7 and SRC-PL-20); SRC-PL-22 §§12–13 (general grant agreement); GAP-PL-TRANSFER |
| Authoring check | Ready-to-build means rights plus obligations. A capacity agreement pays from the first delivery period only after the operational milestone, and a new unit's agreement terminates if the milestone is missed by the end of its third delivery year. A grant is cut for late completion, repayable with interest on termination, and secured until its durability period ends; whether its conditions pass to a buyer of the project company is not verified. Generic geometry only |
| Mobile | Static cutaway and a vertical hotspot list |
| Status | Rules `sourced`; project documents `missing`; `eligibility-unverified` for any asset |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What does a fund actually buy in a ready-to-build project here? | 在这里，基金买下一个具备开工条件的项目，究竟买到什么？ |
| Copy | Rights with obligations attached. A capacity agreement pays only once the battery passes its delivery test, and lapses if a new unit has not passed by the end of its ‹bound: milestone delivery year› delivery year. A grant is paid against eligible costs, is cut for late completion and must be repaid if its conditions are broken. | 权利，附带义务。容量合同只有在电池通过交付测试后才开始付费；新建机组若在第‹bound: milestone delivery year›个交付年结束前仍未通过，合同即告终止。补贴按合格成本拨付，延期完工会被扣减，违反条件则须返还。 |
| Meaning | The entry price must carry every condition: the capacity cohort's delivery test and term, and the grant cohort's completion deadline and repayment terms. | 进入价格必须涵盖每一项条件：容量批次的交付测试与合同期限，补贴批次的完工期限与返还条款。 |
| Marker | Fair evidence. What would change it: the target project's capacity agreement, milestone records and signed grant agreement. | 证据尚可。会改变判断的证据：目标项目的容量合同、里程碑记录及已签补贴协议。 |
| Controls | Equipment · Rights and obligations | 设备 · 权利与义务 |
| Hotspots | Grid connection: the right to export and import at this point · Capacity agreement: paid for availability, after the delivery test · Grant agreement: capital support with completion and durability conditions · Battery and power conversion · Project documents not verified | 并网接入：在该接入点送电和受电的权利 · 容量合同：通过交付测试后，因保持可用而获付费 · 补贴协议：附完工与存续条件的资本支持 · 电池与功率变换 · 项目文件尚未核验 |

## 7. Who pays

### pl-10 — Two cohorts, two payers · 两个批次，两类付款方

| Item | Shot specification |
| --- | --- |
| Scene | Three 2D payment paths: capacity (electricity users → capacity charge → settlement manager → capacity provider, monthly, for the agreement's term); grant (Modernisation Fund via NFOŚiGW → payments against eligible costs during construction → nothing recurring); trading (market counterparties → margin) |
| Feedback | The selected route shows its steps, its payer, whether it recurs, and its evidence status |
| Evidence and chart | CL-PL-03 (SRC-PL-01 arts. 44(4), 60–61; SRC-PL-02 recital (4)); CL-PL-13, CL-PL-14 (SRC-PL-17, SRC-PL-18, SRC-PL-19, SRC-PL-21, SRC-PL-22 §3) |
| Authoring check | The capacity payment recurs for the agreement's term on that auction's terms; the grant is capital support paid in tranches against costs, never an annual line. A list place is not a commitment; a signed agreement is the award; neither is a receipt until paid. The cohort count the play's text uses differs from NFOŚiGW's documents (CF-PL-03): bind the signed count from the record, never the play's text |
| Mobile | Route selector with stacked steps; no crossing arrows needed |
| Status | `sourced`; project-level award and receipt unverified |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Who pays each cohort, and how? | 谁为每个批次付钱？怎么付？ |
| Copy | An earlier capacity agreement is paid every month, through a charge on electricity users, for as long as it runs. The grant cohort's money arrives during construction, not every year: NFOŚiGW pays part of the build cost as eligible costs are incurred. It ranked the applications in ‹bound: cohort list date› and lists ‹bound: cohort signed grants› signed grant agreements. Both cohorts earn the rest by trading. | 早期容量合同按月付款，资金来自向电力用户收取的容量费，在合同期内持续支付。补贴批次的资金在建设期间拨付，而不是每年支付：国家环保基金在合格成本发生时承担部分建设成本。该基金于‹bound: cohort list date›对申请排序，并列出‹bound: cohort signed grants›份已签补贴协议。两个批次其余的收入都来自交易。 |
| Meaning | The capacity cohort holds a recurring payment; the grant cohort holds a smaller capital bill. That is why they are separate investments. | 容量批次持有的是持续性付款；补贴批次持有的是更低的资本支出。这正是二者属于不同投资的原因。 |
| Marker | Fair evidence. What would change it: reconciling the cohort count the play uses with NFOŚiGW's list and signed agreements. | 证据尚可。会改变判断的证据：将该方案所用的批次数量与国家环保基金的排名清单及已签协议核对一致。 |
| Controls | Capacity cohort · Grant cohort · Trading | 容量批次 · 补贴批次 · 交易 |
| Labels | Paid monthly for the agreement's term · Paid during construction, against eligible costs · Market margin · Recurring · Not recurring | 合同期内按月支付 · 建设期间按合格成本拨付 · 市场价差 · 持续性 · 非持续性 |

### pl-11 — How a grant changes the return · 补贴如何改变回报

| Item | Shot specification |
| --- | --- |
| Scene | A capital stack: build cost, the grant share removed, the capital at risk beneath; the revenue line beside it unchanged. An overlay, "Also holds a capacity agreement", shows the capacity price reduced by the grant across the agreement |
| Feedback | Presets switch between without grant, with grant and holding both; value cards from the design engine on one basis |
| Evidence and chart | CL-PL-15, CL-PL-02; SRC-PL-01 art. 62(1)–(3); SRC-PL-19 §§10–11; REPO-PL-LIVE `row.play.grantPct`, play `econ.value`, `grids.pl` cells |
| Authoring check | The play prices the cohort's average grant share, not any project's award; it is the analyst's stored input and differs slightly from NFOŚiGW's documents (CF-PL-03). The two values share one basis (design engine, value per MW at the platform's yields). Art. 62 spreads the grant as a price reduction over the agreement; the platform does not price that stack (MR-5). Never type the grant percentage or a value |
| Mobile | Two stacked bars, then the deduction card |
| Status | `model-assumption`; mechanism `sourced`; capacity-plus-grant stack `unpriced` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why does the grant cohort carry its own call? | 为什么补贴批次有自己的投资判断？ |
| Copy | Because the grant pays part of the build cost before the battery earns anything. The revenue is the same trading case; the capital at risk is smaller. The play prices the cohort's average grant, ‹bound: grant share› of the build cost, and the same design moves from ‹bound: ungranted merchant value› to ‹bound: grant play value› per MW at the platform's yields. If a project also holds a capacity agreement, the law deducts the grant from that payment. | 因为补贴在电池产生任何收入之前，就承担了部分建设成本。收入仍是同样的交易逻辑，承担风险的资本却更少。该方案按批次平均补贴定价，即建设成本的‹bound: grant share›；按本平台收益率，同一设计的每MW价值由‹bound: ungranted merchant value›变为‹bound: grant play value›。若项目同时持有容量合同，法律规定须从该合同付款中扣减补贴。 |
| Meaning | The grant cohort clears the platform's yields only with its grant in place and its conditions met. | 补贴批次只有在补贴到位、且满足所附条件时，才能达到本平台收益率。 |
| Marker | Fair evidence. What would change it: the target project's signed grant amount, and URE's practice for deducting a grant from a capacity payment. | 证据尚可。会改变判断的证据：目标项目已签署的补贴金额，以及URE从容量付款中扣减补贴的实际做法。 |
| Controls | Without the grant · With the grant · Also holds a capacity agreement | 无补贴 · 有补贴 · 同时持有容量合同 |
| Labels | Build cost · Grant · Capital at risk · Same trading revenue · Capacity price reduced by the grant over the agreement · Model value per MW at the platform's yields | 建设成本 · 补贴 · 承担风险的资本 · 同样的交易收入 · 在合同期内按补贴扣减容量价格 · 按本平台收益率计的每MW模型价值 |

## 8. The investment

### pl-12 — What could weaken it · 什么会削弱投资逻辑

| Item | Shot specification |
| --- | --- |
| Scene | Calm overview with factor cards grouped by cohort; future battery fleet drawn dashed; no simulation |
| Feedback | Each card links to its section: trading margins → `#revenue` and `#downside`; late completion → `#execution`; price paid against replacement cost → `#bankable`; connection → `#execution`. Links keep the current lens |
| Evidence and chart | CL-PL-13, CL-PL-16, CL-PL-18; REPO-PL-LIVE (the grant call's own limit, `merchantCurveBasis`); SRC-PL-19 §6; SRC-PL-23 |
| Authoring check | Direction only: no new model number, probability or input slider. Refusal statistics overstate unmet demand because applicants resubmit (SRC-PL-23). The story stops at the market page; it creates no second Bankable case |
| Mobile | Factor cards, then the four section links |
| Status | `sourced`; pending G-1. Stop at the existing market page |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What would make these plays less attractive? | 什么变化会让这两条路线失去吸引力？ |
| Copy | For the grant cohort: trading margins squeezed as both cohorts' batteries arrive, and late completion that cuts the grant. For the capacity cohort: paying more than replacement cost for an earlier agreement. For both: connection, where refusals are common. Next, for each: ‹bound: next action› · ‹bound: market next action› | 对补贴批次：两个批次的电池陆续投运会压缩交易价差，延期完工则会扣减补贴。对容量批次：为早期合同支付高于重置成本的价格。对两者：并网，申请被拒的情况很常见。下一步，分别是：‹bound: next action› · ‹bound: market next action› |
| Meaning | The grant cohort's case is a trading case with a smaller capital bill; the capacity cohort's case is the price paid for an agreement. Test each on its own terms. | 补贴批次的投资逻辑，是资本支出更低的交易逻辑；容量批次的投资逻辑，是为一份合同所付的价格。两者须各按自身条件检验。 |
| Marker | Fair evidence. What would change it: realised Polish trading results, the target projects' completion records, and a legislated successor framework. | 证据尚可。会改变判断的证据：波兰电池的实际交易收益、目标项目的完工记录，以及完成立法的接续机制。 |
| Controls | Trading margins · Late completion · Price paid · Connection · [Bankable case](/markets/poland#bankable) · [Revenue](/markets/poland#revenue) · [Execution](/markets/poland#execution) · [Downside](/markets/poland#downside) | 交易价差 · 延期完工 · 支付价格 · 并网 · [可融资方案](/markets/poland#bankable) · [收益拆解](/markets/poland#revenue) · [执行步骤](/markets/poland#execution) · [下行风险](/markets/poland#downside) |
| Factor cards | Trading margins: more batteries trading the same hours; see Revenue and Downside · Late completion: the grant shrinks for each month late; see Execution · Price paid: an earlier agreement is worth only its vintage; see Bankable case · Connection: refusals are common and slow projects; see Execution | 交易价差：更多电池在同一时段交易；见收益拆解与下行风险 · 延期完工：每延迟一个月，补贴都会缩减；见执行步骤 · 支付价格：早期合同的价值取决于其签约年份；见可融资方案 · 并网：申请常被拒绝，拖慢项目；见执行步骤 |

## 9. Copy, evidence and binding registers

### Financial bindings that already exist

Authoring references, not a new adapter. `row` is the Poland row the market page passes for the selected lens, after the investment-summary projection (`src/experience/model.js`). `v` is the briefing's Poland shortlist row whose play the market verdict names (`HOME_BRIEFING.lenses[lens].rows`, `market: 'pl'`, `play: view.verdicts[lens].play`); reading it is the one shell change this script needs (BUILD-PL-01). The at-check column lets the analyst review the script against the live case; it never becomes page copy.

| Token | Existing owner and field | At check, 31 Oct 2026 (reviewer reference only) | Uses |
| --- | --- | --- | --- |
| ‹bound: call› | `CALLS[row.call]` | Situational / 择机投入 (`opportunistic`, the grant play's own call) | pl-00 |
| ‹bound: play name› | `playTitle(row.play, row.stage)` | Grant-funded merchant · 4h · ready-to-build | pl-00 |
| ‹bound: card figures› | The decision panel's metrics: `row.investment.holdIRR` with `marginText(row)`, `bearHoldIRR`, peak pre-COD equity, `maxPricePerMW` | All-equity hold 11.51%, −1.74 pp against the 13.25% target; declared downside 2.45%; "No supported price" | pl-00 |
| ‹bound: next action› | `row.play.action.text` | List cohort projects whose owners might sell before the end-2028 completion deadline; check which also hold a capacity contract | pl-00, pl-12 |
| ‹bound: play evidence› | `row.evidence`, through the existing evidence labels | Fair | pl-00 |
| ‹bound: play duration› | `row.play.hours` | 4 | pl-08 |
| ‹bound: grant share› | `row.play.grantPct`, formatted as a percentage | 37.9% | pl-11 |
| ‹bound: market call› | `CALLS[v.call]` | Watch / 保持观察 (`wait`) | pl-00 |
| ‹bound: market play name› | `playTitle(HOME_BRIEFING.plays['pl/' + v.play], v.stage)` | Capacity market · 4h · ready-to-build | pl-00 |
| ‹bound: market next action› | `HOME_BRIEFING.plays['pl/' + v.play].action.text` | Wait for a successor to the main auctions; until then, price only assets holding an earlier seventeen-year contract, and only below replacement cost | pl-00, pl-12 |
| ‹bound: market evidence› | `v.evidence` | Fair | pl-00 |
| ‹bound: watched event› | Trigger label for `v.next` (`HOME_BRIEFING.triggers`) | A successor to the capacity market's main auctions is legislated (undated) | pl-04 |
| ‹bound: ungranted merchant value› | `HOME_BRIEFING.grids.pl` cell, route `mer`, hours = `row.play.hours` | −$175,754 per MW | pl-07, pl-11 |
| ‹bound: ungranted best value› | `HOME_BRIEFING.grids.pl` cell flagged `best` | cap/4h, −$23,641 per MW | pl-07 |
| ‹bound: grant play value› | `HOME_BRIEFING.plays['pl/' + row.play.id].econ.value` | +$209,165 per MW | pl-11 |
| ‹bound: merchant band› | `HOME_BRIEFING.grids.pl.byRoute.mer.band` | 2 and 4 | pl-08 |

The design-engine values are value per MW of connection at the platform's yields, USD, at COD; card 1's figures are the investment summary's all-equity returns, PLN, RTB closing, twenty operating years. The two bases are labelled wherever they appear and are never swapped (CF-PL-04). A missing value hides its sentence and shows the missing-state copy below; it never prints zero.

### Evidence bindings proposed for later implementation

References to the dated records in §11, **not runtime fields**. The build creates and validates them; this PR wires nothing. Each token names one record field; a missing value suppresses its label.

| Token | Record and field | Units / limit |
| --- | --- | --- |
| ‹bound: H-PL-01 year› | H-PL-01, event year (SRC-PL-02 recital (6)) | Year of the shortages as the Commission records them |
| ‹bound: H-PL-02 act year› | H-PL-02, Act adoption year (SRC-PL-01 title) | Adoption year, distinct from entry into force and approval |
| ‹bound: existing term› · ‹bound: modernised term› · ‹bound: new-build term› | SRC-PL-01 art. 25(4)–(5); SRC-PL-02 recitals (43), (49) | Maximum delivery years: existing units; modernised units with the low-emission extension; new units with the extension |
| ‹bound: first battery delivery year› · ‹bound: second battery delivery year› | Chart-PL-AUCTIONS records for the first two auctions with battery agreements (SRC-PL-16) | Delivery years, not auction dates |
| ‹bound: battery factor, early auctions› | SRC-PL-10, SRC-PL-11, main-auction factor for batteries | Percentage; one value for both auctions |
| ‹bound: battery obligation, first auction› · ‹bound: battery obligation, second auction› · ‹bound: battery units, second auction› | SRC-PL-16, pp. 5–6 and Figure 1 | De-rated MW; units counted by URE |
| ‹bound: last main auction year› · ‹bound: last main delivery year› | SRC-PL-01 art. 29(3) item 7; SRC-PL-12 | Year held; delivery year |
| ‹bound: supplementary end year› | SRC-PL-01 art. 2(1)(3a)(d); SRC-PL-03 art. 3 | Last delivery year for one-year auctions |
| ‹bound: battery factor, last main auction› | SRC-PL-12, §10 item 9 | Percentage |
| ‹bound: contract value, first battery auction› · ‹bound: contract value, last main auction› | CALC-PL-01 | PLN per kW of certified power per year, before aid deduction and indexation |
| ‹bound: certification hours› | SRC-PL-15 pkt 7.4.2.1(8) | Uninterrupted hours at net achievable capacity |
| ‹bound: milestone delivery year› | SRC-PL-01 art. 46(1)(2) | Ordinal delivery year by which a new unit must pass |
| ‹bound: cohort list date› | SRC-PL-17 notice dates | List of 8 December 2025, updated 12 December 2025 |
| ‹bound: cohort signed grants› | SRC-PL-21, storage-programme table, grant rows | Count of signed grant agreements on the check date |
| ‹bound: research check date› · ‹bound: source checked date› | §11 check date and each record's check date | Locale date; not a publication or delivery date |
| ‹bound: auction series› | Chart-PL-AUCTIONS rows in §11 | All chart ticks, tooltips and the accessible table |

### Timeline nodes (page text)

| Node | Field | English | 简体中文 |
| --- | --- | --- | --- |
| ‹bound: H-PL-01 year› · Supply limited | Constraint | Old units were closing faster than new ones were built. | 老机组关停的速度快于新机组的建设。 |
| | Choice | Pay for capacity as well as energy. | 在电能量之外，同时为容量付费。 |
| | What remains | The concern that shaped the capacity market. | 塑造了容量市场的供电充足性关切。 |
| | Effect today | Capacity is paid for; a battery can earn it only through an agreement. | 容量是要付费的；电池只能通过合同获得这笔收入。 |
| ‹bound: H-PL-02 act year› · The capacity market | Constraint | Prices alone were not expected to keep enough plant open or built. | 预计仅靠电价无法让足够的机组继续运行或得以新建。 |
| | Choice | Central auctions with long agreements for new plant, open to every technology. | 由中央组织拍卖，向所有技术开放，并为新建机组提供长期合同。 |
| | What remains | Agreements signed in each auction, running their full terms. | 各轮拍卖签下的合同，履行至期满。 |
| | Effect today | An asset holding an earlier agreement is its own investment. | 持有早期合同的资产是一项独立的投资。 |
| ‹bound: first battery delivery year›–‹bound: second battery delivery year› · Batteries enter | Constraint | Batteries could hold their power for the test hours. | 电池能够在测试时长内保持功率。 |
| | Choice | Credit them almost in full. | 几乎全额计入其容量。 |
| | What remains | A cohort of batteries on long agreements. | 一批持有长期合同的电池。 |
| | Effect today | The cohort the market's verdict prices, below replacement cost. | 该市场的判断所定价的批次，价格须低于重置成本。 |
| ‹bound: last main delivery year› · The last main auction | Constraint | The approval ran for a fixed period, and storage's factor was cut. | 获批期限是固定的，储能的修正系数也被下调。 |
| | Choice | Hold the last scheduled main auction. | 举行最后一轮已排期的主拍卖。 |
| | What remains | No main auction scheduled after it. | 此后没有主拍卖排期。 |
| | Effect today | No long contract for a new battery to win. | 新建电池没有可争取的长期合同。 |
| ‹bound: supplementary end year› · Coal's last auctions | Constraint | EU emission rules ended coal's long contracts. | 欧盟排放规则终止了煤电的长期合同。 |
| | Choice | Let coal bid only in one-year auctions, for a few years. | 只允许煤电在若干年内参加一年期拍卖。 |
| | What remains | One-year auctions for existing units until the derogation ends. | 豁免到期前，面向既有机组的一年期拍卖。 |
| | Effect today | A short bridge, not a route for new storage. | 这只是短期过渡，并非新建储能的路径。 |
| ‹bound: cohort list date› · The grant cohort | Constraint | Storage was needed faster than the market would fund it. | 储能的需求快于市场愿意出资的速度。 |
| | Choice | Pay part of the build cost of new storage, with conditions. | 承担新建储能的部分建设成本，并附带条件。 |
| | What remains | Signed grant agreements due for completion. | 已签补贴协议的项目须按期完工。 |
| | Effect today | A cohort with its own call. | 一个拥有独立投资判断的批次。 |
| Successor (dashed) · Not legislated | Choice | None yet: no successor is law at ‹bound: research check date›. | 尚无决定：截至‹bound: research check date›，接续机制尚未立法。 |

### Remaining visible text EN / 简体中文

| Context | English | 简体中文 |
| --- | --- | --- |
| Story button and navigation | Story · Previous · Next · Chapters · Sources | 故事 · 上一节 · 下一节 · 章节 · 来源 |
| Card headings | Grant cohort · own call · Market verdict | 补贴批次 · 独立判断 · 市场判断 |
| Evidence drawer | Source · Locator · Checked on ‹bound: source checked date› · Definition | 来源 · 具体位置 · 核查时间：‹bound: source checked date› · 统计口径 |
| Marker strings | Strong evidence. · Fair evidence. · Thin evidence. · What would change it: | 证据充分。 · 证据尚可。 · 证据单薄。 · 会改变判断的证据： |
| Legend | Schematic · Observed event · Not scheduled · Example · Model assumption | 示意 · 已发生事件 · 未作排期 · 示例 · 模型假设 |
| Map | Poland · Coal-fired units (schematic) | 波兰 · 燃煤机组（示意） |
| Chart accessible summary | Main-auction clearing price and battery correction factor by delivery year, with the contract one kW of battery could win; ‹bound: auction series›. Contract values before aid deduction | 按交付年列示主拍卖出清价与电池修正系数，以及每千瓦电池可签下的合同额；‹bound: auction series›。合同额未扣除补贴抵减 |
| Chart definitions | Clearing price: the auction's closing price for units in Poland · Correction factor: the share of certified power a battery may commit · Contract per kW: price × factor | 出清价：波兰境内机组的拍卖收盘价 · 修正系数：电池可承诺的认证功率比例 · 每千瓦合同额：出清价×修正系数 |
| Exits | Go to the investment case · Back to the play | 前往投资方案 · 返回方案卡 |
| Stale call | This story was last reviewed against the calls of ‹bound: research check date›. | 本故事最近一次依据‹bound: research check date›的投资判断复核。 |
| Loading / retry | Loading source data… · Could not load data · Retry | 正在载入来源数据… · 数据未能载入 · 重试 |
| Missing financial binding | Current case unavailable; review the market case | 当前情景暂不可用；请查看市场方案 |
| Missing evidence binding | Figure withheld until its source is checked | 来源核实前暂不显示该数值 |
| Reduced motion | Read the explanation; the selected state is shown without animation | 阅读文字说明；当前选择直接显示，无需动画 |

### Source-to-shot mapping

| Shot | Claims → sources | Chart / binding owner | Likely misreading prevented |
| --- | --- | --- | --- |
| pl-00 | CL-PL-18 → REPO-PL-LIVE | Existing play card plus the verdict row (BUILD-PL-01) | One blended recommendation; the view's typed figures shown as current |
| pl-01 | CL-PL-04/05 → SRC-PL-02 | Own schematic | The 2015 event alone created the market; plant locations implied |
| pl-02 | CL-PL-03 → SRC-PL-01/02/05 | Term records | A capacity agreement read as a storage subsidy |
| pl-03 | CL-PL-06/08/17 → SRC-PL-06/07/10/11/16 | Battery records | Contract length read as technology; nameplate read as obligation |
| pl-04 | CL-PL-10/11 → SRC-PL-01/02/03/04 | Calendar records | Signed agreements ended; press plans read as law |
| pl-05 | CL-PL-06/07/08/09 → SRC-PL-05 to SRC-PL-12, SRC-PL-16 | Chart-PL-AUCTIONS, CALC-PL-01 | Contract value read as cash or return; volumes inferred from term |
| pl-06 | CL-PL-10/11/12 → SRC-PL-01/03/13/14 | Door records; trigger | A one-year price read as a new-entry contract |
| pl-07 | CL-PL-18 → REPO-PL-LIVE | Design grid | Negative value read as an operating loss; observed prices implied |
| pl-08 | CL-PL-17 → SRC-PL-15, REPO-DG1, SRC-PL-19/20 | Play duration; merchant band | Four hours read as a trading rule or a grant requirement |
| pl-09 | CL-PL-03/13 → SRC-PL-01/19/20/22 | None; rules only | Ready-to-build read as free of obligations |
| pl-10 | CL-PL-03/13/14 → SRC-PL-01/02/17/18/19/21/22 | Cohort records | A grant read as income; a list place read as an award |
| pl-11 | CL-PL-02/15 → SRC-PL-01/19, REPO-PL-LIVE | Grant share; design values | Grant and capacity payment stacked in full |
| pl-12 | CL-PL-13/16/18 → SRC-PL-19/23, REPO-PL-LIVE | Existing Bankable case, Revenue, Execution, Downside | A second financial view; a probability implied |

Reverse traceability: SRC-PL-02 → CL-PL-04/05 → H-PL-01 → pl-01; SRC-PL-01/02 → CL-PL-03 → H-PL-02 → pl-02/09/10; SRC-PL-10/11/16 → CL-PL-06/08 → H-PL-03 → pl-03/05; SRC-PL-01/02/03/04/12 → CL-PL-10/11 → H-PL-04/05 → pl-04/06; SRC-PL-05 to SRC-PL-12 → CL-PL-07/09 → CALC-PL-01 → Chart-PL-AUCTIONS → pl-05; SRC-PL-13/14 → CL-PL-12 → pl-06; SRC-PL-15 → CL-PL-17 → pl-08; SRC-PL-17 to SRC-PL-22 → CL-PL-13/14/15 → H-PL-06 → pl-09/10/11; SRC-PL-01 art. 62 → CL-PL-02 → pl-11; SRC-PL-23 → CL-PL-16 → pl-12; REPO-PL-LIVE → CL-PL-18 → pl-00/07/08/11/12. A replaced source therefore queues a finite set of shots, translations and labels.

## 10. G-1 record

| Analyst pass | Decision required |
| --- | --- |
| Electricity mechanics | Accept the reading of the capacity market: long agreements for new plant, the battery factor by auction, the four-hour certification test, the end of the main-auction schedule, one-year auctions for existing units only, and art. 62's deduction of investment aid |
| Investment meaning | Accept two separate calls on one page: the market verdict waiting for a successor, an earlier agreement priced only below replacement cost, and the grant cohort's own call; the grant as conditional capital support; values shown only on labelled bases |
| English / Chinese | Confirm equal meaning for capacity obligation, correction factor, catch-up, supplementary and additional auctions, grant, cohort, award, receipt and replacement cost; every visible string is drafted |
| Script decision | **G-1 reviewed 1 November 2026; G-2 conditions retained. Analyst: sign off pl-00 to pl-12, or name the changes.** No build, dataset registration, view edit or model change follows from this script |

Points for the analyst to decide at G-1:

1. **pl-00's card (CF-PL-01).** (a) Recommended: open on the card the page passes and add the market verdict as a second card, which needs the story shell to read the verdict row (BUILD-PL-01). (b) Open on the grant card only and introduce the verdict at pl-04. (c) Treat the market page's single Polish card as a separate issue outside the story.
2. **"Ranks first" (CF-PL-02).** The brief says the grant play ranks first on the shortlist. Live, it is the first Polish row and fourth overall. The script says neither.
3. **Signature chart.** Accept Chart-PL-AUCTIONS and CALC-PL-01 (price × factor), the context years before batteries entered, and battery volumes shown only where URE publishes a split.
4. **Dataset.** Approve an analyst-entered auction-history module for the build (GAP-PL-AUCTIONS), outside the automated catalogue as `src/governance/datasets.js` prescribes for capacity results.
5. **Causal readings.** CL-PL-05 (adequacy, not price, drove the mechanism), CL-PL-09 (near-full credit built the battery cohort) and the reading of the factor cut under art. 18(2).
6. **Design values beside card figures (CF-PL-04).** Whether pl-07 and pl-11 may show design-engine values per MW on the same page as card 1's investment-basis returns, labelled, or text only.
7. **Cohort figures (CF-PL-03).** The play's text and stored grant share use a cohort basis that NFOŚiGW's documents do not reproduce. No figure moves in this task; any change is the analyst's.
8. **Vintage (CF-PL-05).** `pl-cap-4h` prices the last auction's terms; earlier battery agreements carry several times more capacity revenue per kW. The script says value depends on vintage and binds no vintage value.
9. **Markers.** Strong on pl-02, pl-03, pl-04 and pl-06 (opened legal and official records, assuming your review); Fair elsewhere; pl-00 keeps each card's marker.
10. **The Chinese drafts.**

Checks run for this PR on 31 October 2026: all thirteen shots carry the six specification rows; every shot except pl-00 carries Question, Copy, Meaning, Marker and Controls in both languages, and pl-00 carries the four rows the openings use; a scan found no digit in any Copy, Meaning, Marker or Controls cell outside a `‹bound›` token; every token has a register entry; local links and anchors resolve. No company, developer or project is named; the confidential marker list is not present in this environment, so the guard could not be run, and only public institutions and laws are named. `npm test` passed 1,023 of 1,038 tests with 15 skipped and none failing, and `npm run test:current` passed 84 of 84, with no fixture regenerated. Build, budget and browser checks were not run under the build-nothing scope. Only this Markdown file was added: no code, data, view, fixture or shared document changed.

## 11. Sources and claims

All sources below were opened and read as text on **31 October 2026** unless marked otherwise; downloaded documents were read from the publisher's own URL. EUR-Lex refused automated access, so two EU texts were read from the Official Journal reproduction named in the record and should be rechecked on EUR-Lex. Search summaries and press reports are discovery leads only and support no claim. No licence-restricted report or subscription index is used.

### Repository evidence

| ID | Evidence | Locator | Supports |
| --- | --- | --- | --- |
| REPO-PL-LIVE | Published view and briefing, `main` at `edcb39c`, briefing evaluated for 2026-10-31 | `view/markets/pl.json`; `src/briefing/plays.js` (`lensRows`, `orderRows`); `src/experience/model.js` (`opportunities`); `src/opportunities/summary.js`; computed in memory with no file written | Both calls, plays, triggers, positions, evidence, card fields and design values; CF-PL-01 to CF-PL-05 |
| REPO-DG1 | Duration gate DG-1, opened 15 October 2026 | `docs/duration-and-route-fit-research-gates.md`, §DG-1 | The four-hour certification reading for shorter batteries (MWh ÷ test hours) |

### Source records

| ID | Publisher, title | Locator | Dates | Access, reuse | Supports |
| --- | --- | --- | --- | --- | --- |
| SRC-PL-01 | Sejm: *Ustawa z dnia 8 grudnia 2017 r. o rynku mocy* (Capacity Market Act), consolidated text | Dz.U. 2026 poz. 1400, https://api.sejm.gov.pl/eli/acts/DU/2026/1400/text.pdf ; arts. 2(1)(1), (1a), (2), (3a), (9), (10); 18(1)–(3); 19(1)(1); 25(1)–(5); 29(3)–(6); 39a(1)–(4); 44(4)–(5); 46(1); 52(1)–(2); 60–62 | Act 8 Dec 2017, in force 18 Jan 2018; consolidated text announced 2 Oct 2026 | Opened; normative act, outside copyright (SRC-PL-24 art. 4) | CL-PL-02, 03, 10, 11, 12 |
| SRC-PL-02 | European Commission: Decision C(2018) 601 final, State aid SA.46100 (2017/N), *Planned Polish capacity mechanism* | https://ec.europa.eu/competition/state_aid/cases/272253/272253_1977790_162_2.pdf ; recitals (4)–(8), (43), (49)–(50), (109)–(110), (140); conclusion | 7 Feb 2018 | Opened; Commission document, reuse with attribution | CL-PL-03, 04, 05, 10 |
| SRC-PL-03 | European Commission: Decision (EU) 2026/341 granting Poland a derogation from art. 22(4)(b) of Regulation (EU) 2019/943 | ELI http://data.europa.eu/eli/dec/2026/341/oj ; arts. 1–3; recitals (1)–(8), (27)–(28), (73). Read from the Polish-language OJ reproduction at https://www.inforlex.pl/download/akty_pdf,E0L,2026,55,341.pdf | Adopted 11 Aug 2025 (C(2025) 5575); OJ L 24 Feb 2026 | Opened (reproduction); recheck on EUR-Lex | CL-PL-11 |
| SRC-PL-04 | Sejm ELI act record for the Capacity Market Act: amending acts, implementing acts, consolidated texts | https://api.sejm.gov.pl/eli/acts/DU/2018/9 | Record changed 28 Oct 2026 | Opened | CL-PL-10 (no successor act; no catch-up regulation for 2030 delivery) |
| SRC-PL-05 | URE: final results of the main auctions for 2021–2025 delivery (Informacje nr 99/2018, 103/2018, 10/2019, 106/2019, 2/2021) | Index https://www.ure.gov.pl/pl/energia-elektryczna/rynek-mocy/informcjepure ; each notice, point (c) | Notices 27 Nov 2018 to 5 Jan 2021 | Opened; official documents | CL-PL-07 |
| SRC-PL-06 | URE: Informacja nr 2/2022, final results of the main auction for 2026 delivery | https://ure.gov.pl/download/9/12529/Ostatecznewynikiaukcjiglownejnarokdostaw2026.pdf ; points (b)–(e), (l) | 7 Jan 2022; auction 16 Dec 2021 | Opened | CL-PL-07 |
| SRC-PL-07 | URE: Informacja nr 2/2023 and nr 2/2024, final results of the main auctions for 2027 and 2028 delivery | https://www.ure.gov.pl/download/9/13461/20230109INFOPUREwynikiaukcjiglownejnarokdostaw2027.pdf ; https://www.ure.gov.pl/download/9/14266/Ostateczneogloszeniewynikowaukcjiglownejna2028.pdf ; point (c) and the unit list | 9 Jan 2023 and 5 Jan 2024; auctions 15 Dec 2022 and 14 Dec 2023 | Opened | CL-PL-07, 08 (term cross-check) |
| SRC-PL-08 | URE: Informacja nr 02/2025, final results of the main auction for 2029 delivery | https://www.ure.gov.pl/download/9/15112/Ostateczneogloszeniewynikowaukcjiglownejna2029.pdf ; points (b)–(f), (m)–(n) and the unit list | 3 Jan 2025; auction 12 Dec 2024 | Opened | CL-PL-07, 08 |
| SRC-PL-09 | URE: Informacja nr 44/2025, final results of the catch-up auction for 2029 delivery | https://www.ure.gov.pl/download/9/15656/Ogloszenieostatecznychwynikowaukcjidogrywkowejna2029.pdf ; points (c), (e)–(h) | 8 Aug 2025; auction 17 Jul 2025 | Opened | CL-PL-06, 07 |
| SRC-PL-10 | Minister of Climate and Environment: parameters of the main auction for 2027 delivery, and earlier years | Dz.U. 2022 poz. 1690, chapter 1 factor list, item 9; for 2021–2026 delivery: Dz.U. 2018 poz. 1632, 2019 poz. 1457, 2020 poz. 1355, 2021 poz. 1480, same item | 2018–2022 | Opened; normative acts | CL-PL-06 |
| SRC-PL-11 | Minister of Climate and Environment: parameters of the main auctions for 2028 and 2029 delivery, and of the 2029 catch-up auction | Dz.U. 2023 poz. 1561 and 2024 poz. 1154, chapter 1 factor list, item 9; Dz.U. 2025 poz. 571, § 9 item 9 | 4 Aug 2023; 26 Jul 2024; 29 Apr 2025 | Opened | CL-PL-06 |
| SRC-PL-12 | Minister of Energy: parameters of the main auction for 2030 delivery and of additional auctions for 2027 | Dz.U. 2025 poz. 1066, §§ 1–2, 8, 10 item 9 (13.39 %, pumped storage grouped with batteries); additional-auction list, item 9 | 1 Aug 2025, published 5 Aug 2025 | Opened | CL-PL-06, 10 |
| SRC-PL-13 | Minister of Energy: parameters of the supplementary auction for 2027 delivery | M.P. 2026 poz. 542, items 1–8 (battery factor item 8(i)) | 28 May 2026 | Opened | CL-PL-12 |
| SRC-PL-14 | URE: Informacja nr 43/2026, final results of the supplementary auction for 2027 delivery | https://www.ure.gov.pl/download/9/16483/Informacjanr43-2026.pdf ; points 3–5 | 24 Sep 2026; auction 3 Sep 2026 | Opened | CL-PL-12 |
| SRC-PL-15 | PSE: *Regulamin Rynku Mocy* (capacity market rules), text with update card RRM/Z/16/2026 | https://pse.pl/documents/20182/51490/RRM_Z_16_2026.pdf ; pkt 6.3.2.5, 7.4.2.1(8) | Text dated 4 Aug 2026 | Opened; PSE terms not checked, so link only | CL-PL-17 |
| SRC-PL-16 | URE: *Magazynowanie energii elektrycznej – Raport 2024* | https://www.ure.gov.pl/download/9/14751/Raportmagazynyenergii.pdf ; pp. 5–6, Figure 1 | Published 8 Jul 2024 | Opened; official material | CL-PL-08 |
| SRC-PL-17 | NFOŚiGW (Modernisation Fund portal): programme page, *Magazyny energii elektrycznej i związana z nimi infrastruktura…*, with the 8 Dec 2025 results notice and the 12 Dec 2025 update | https://www.gov.pl/web/funduszmodernizacyjny/magazyny-energii-elektrycznej-i-zwiazana-z-nimi-infrastruktura-dla-poprawy-stabilnosci-polskiej-sieci-elektroenergetycznej2 | Notices 8 and 12 Dec 2025 | Opened | CL-PL-14 (list place is no commitment; aid basis SA.112460) |
| SRC-PL-18 | NFOŚiGW: ranking lists, original and updated | https://www.gov.pl/attachment/2f26965d-d748-4623-95f2-fc893ad349c4 (8 Dec 2025); https://www.gov.pl/attachment/20702c51-561a-418d-898e-e84139263bfb (file dated 11 Dec 2025, posted 12 Dec 2025) | Dec 2025 | Opened; totals computed from rows, no names copied | CL-PL-14 |
| SRC-PL-19 | Minister of Climate and Environment: regulation on NFOŚiGW state aid for electricity storage | Dz.U. 2025 poz. 280, https://api.sejm.gov.pl/eli/acts/DU/2025/280/text.pdf ; §§ 4–7, 9–11, 13 | 5 Mar 2025, in force 8 Mar 2025 | Opened; normative act | CL-PL-02, 13 |
| SRC-PL-20 | NFOŚiGW: programme text, *Program FM Magazyny energii z infrastrukturą* | https://www.gov.pl/attachment/e8a27407-5de8-4b60-897b-6f494d0000ea ; aims, budget, period, intensity, durability sections | March 2025 call documents | Opened | CL-PL-13 |
| SRC-PL-21 | Modernisation Fund portal: signed agreements, storage-programme table | https://www.gov.pl/web/funduszmodernizacyjny/zawarte-umowy | Retrieved 31 Oct 2026 | Opened; counts and sums only | CL-PL-14 |
| SRC-PL-22 | NFOŚiGW: general Modernisation Fund grant agreement template 2025 | https://www.gov.pl/attachment/a9b7fc19-0672-4cb7-b1d3-3eb0a2a1839b (archive), grant template §§ 3, 12–13 | 2025 | Opened; general template, programme-specific conditions not read | CL-PL-13 |
| SRC-PL-23 | URE: *Summary of URE activities in 2024* | https://ure.gov.pl/en/communication/news/436%2CSummary-of-URE-activities-in-2024-deregulation-demands-and-new-competences-of-th.html ; connection section and its caveat | Published 9 Jun 2025 | Opened | CL-PL-16 |
| SRC-PL-24 | Sejm: *Ustawa o prawie autorskim i prawach pokrewnych*, consolidated text | Dz.U. 2025 poz. 24, art. 4 | 2025 | Opened | Reuse terms for the chart's data |
| SRC-PL-25 | European Commission: SA.112460, *TCTF/RRF – Poland: Support for electricity storage and related infrastructure* | OJ C/2024/6473 (29 Oct 2024); decision of 3 Oct 2024 as cited by SRC-PL-17 and SRC-PL-20 | 3 Oct 2024 | Not opened (EUR-Lex refused automated access); reference confirmed through SRC-PL-17 | CL-PL-13 |
| SRC-PL-26 | URE: Informacja nr 1/2026, final results of the main auction for 2030 delivery | https://www.ure.gov.pl/download/9/15928/InformacjaPrezesaUrzeduRegulacjiEnergetykiNr12026.pdf ; points (b)–(g) and the unit list | 2 Jan 2026; auction 11 Dec 2025 | Opened; official document | CL-PL-07, 08, 10 |

### Claim ledger

Each claim is split into event and interpretation where they need different evidence. Status `sourced` means opened today and awaiting the analyst's review.

| Claim ID | Exact claim | Type / scope | Source and locator | Supported inference / limit | Shots | Status |
| --- | --- | --- | --- | --- | --- | --- |
| CL-PL-03 | The capacity market buys capacity through central auctions run by PSE, open to new and existing generation, demand response and storage. New units may take agreements of up to fifteen delivery years, plus two for units at or below 450 kg CO2/MWh; existing units take one year. Winners are paid for availability and penalised for failing to deliver; payment starts after a new unit's operational milestone, and a new unit's agreement terminates if that milestone is missed by the end of its third delivery year. Users fund it through a capacity charge | historical-fact, market-rule | SRC-PL-01 arts. 25(4)–(5), 44(4)–(5), 46(1), 52(1)–(2), 60–61; SRC-PL-02 recitals (4), (43), (49) | Establishes the instrument and its obligations, not any project's agreement | pl-02, pl-09, pl-10 | sourced |
| CL-PL-04 | Poland experienced shortages in the summer of 2015 that limited supply to numerous industrial customers; the Polish authorities also expected substantial retirement of old units by 2020 | historical-fact as recorded by the Commission | SRC-PL-02 recitals (5)–(6) | The Commission reports the Polish authorities' account; PSE's own record not opened (GAP-PL-2015) | pl-01 | sourced |
| CL-PL-05 | Interpretation: the mechanism was built to keep an ageing, largely coal-fired fleet adequate; storage entered later as one technology among many | interpretation | SRC-PL-02 recitals (6)–(8), (140) | A causal reading for the analyst; no generation-mix number | pl-01 | proposed |
| CL-PL-06 | The main-auction correction factor for batteries was 96.11 % for 2021–2026 delivery, 95.00 % for 2027 and 2028, 61.30 % for 2029, 12.33 % in the 2029 catch-up auction, and 13.39 % for 2030, when pumped storage joined the battery group | market-rule | SRC-PL-10, SRC-PL-11, SRC-PL-12 | Factors apply to certified power at the auction; agreements keep their auction's obligation | pl-03, pl-05 | sourced |
| CL-PL-07 | Main-auction clearing prices for units in Poland, PLN/kW/year: 240.32 (2021), 198.00 (2022), 202.99 (2023), 259.87 (2024), 172.85 (2025), 400.39 (2026), 406.35 (2027), 244.90 (2028), 264.90 (2029), 465.02 (2030); the 2029 catch-up auction cleared at 534.09 | observed-data | SRC-PL-05 to SRC-PL-09 and SRC-PL-26, point (c) of each notice | Nominal, by auction vintage | pl-05 | sourced |
| CL-PL-08 | Battery agreements in main auctions: 165 MW of obligation from the auction for 2027 delivery, and 1,734 MW from 33 battery units in the auction for 2028 delivery, about a quarter of that auction's 7,070.951 MW. URE's lists show new units on seventeen-year agreements of 2,572.838 MW (81 units) for 2029 and 684.701 MW (57 units) for 2030, without technology | observed-data | SRC-PL-16 pp. 5–6 and Figure 1; SRC-PL-07 list (33 units, 1,733.952 MW on seventeen-year agreements); SRC-PL-08 list; URE Informacja nr 1/2026 list (SRC-PL-26) | Battery volumes for 2029 and 2030 need URE's technology split (GAP-PL-TECH); the 2027 auction's seventeen-year total also includes non-battery plant | pl-03, pl-05 | sourced |
| CL-PL-09 | Interpretation: the earlier auctions built a contracted battery cohort because a battery could commit almost all its certified power into a seventeen-year agreement; the contract one kW could win fell by about five-sixths between the auctions for 2027 and 2030 delivery | interpretation; calculation | CL-PL-06, CL-PL-07, CALC-PL-01 | The fall is arithmetic; the causal reading is proposed | pl-03, pl-05 | proposed |
| CL-PL-10 | The Act schedules main auctions only through the 2025 auction for 2030 delivery; the Commission approved the mechanism for ten years from the first auction and was told the last main auction would be held in 2025. A catch-up auction for 2030 delivery needed a regulation by 30 April 2026, and none was issued. No successor framework is legislated at 31 October 2026 | market-rule; observed absence | SRC-PL-01 arts. 29(3), 39a(4); SRC-PL-02 recitals (109)–(110), conclusion; SRC-PL-04 implementing and amending acts | An absence checked against the consolidated text and the act record; ministry plans are not evidence of law | pl-04, pl-06 | sourced |
| CL-PL-11 | Additional (quarterly) and supplementary (one-year) auctions give one-period agreements to existing units only, meaning units connected and commissioned before certification; supplementary auctions are defined only for the second half of 2025 to 2028. Coal units above the emission limit may take part only in supplementary auctions, under an EU derogation that applies until 31 December 2028; after it they can no longer compete in the existing mechanism | market-rule | SRC-PL-01 arts. 2(1)(1), (3a), (9), 25(2), 25(4)(4), 29(4)–(6); SRC-PL-03 arts. 2–3, recitals (27)–(28), (73) | A route for running units, not for new build | pl-04, pl-06 | sourced |
| CL-PL-12 | The supplementary auction for 2027 delivery, held 3 September 2026, closed in round 5 at PLN 325.55/kW/year, with 7,480.733 MW of one-year obligations; batteries carried a 95.00 % factor in it | observed-data | SRC-PL-13 item 8(i); SRC-PL-14 points 3–5 | One-year income for existing units; URE's list carries no technology, so no battery volume is claimed (CF-PL-06) | pl-06 | sourced |
| CL-PL-13 | NFOŚiGW's Modernisation Fund programme supports new storage of at least 2 MW and 4 MWh with grants of up to 45 % of total cost (plus 20 points for small and 10 for medium firms) and loans; budget up to PLN 3.735 billion of grants and PLN 0.415 billion of loans; aid granted by 31 December 2025 under scheme SA.112460; completion within 36 months of award, with the aid cut by 5 % a month for delays of three to six months and 10 % a month after; costs eligible to 31 December 2028; five-year durability with no disposal of financed assets; repayable with interest on termination, secured until durability ends; combinable only with capacity-market remuneration | market-rule; programme terms | SRC-PL-19 §§ 4–7, 9–11, 13; SRC-PL-20; SRC-PL-22 §§ 12–13; SRC-PL-25 | Programme terms; a project's own agreement may add conditions (GAP-PL-TRANSFER) | pl-08, pl-09, pl-10, pl-12 | sourced |
| CL-PL-14 | The ranking list of 8 December 2025, updated 12 December 2025, recommends 172 grant applications for PLN 3.735 billion on PLN 10.004 billion of total cost (37.3 %) and ten loans for PLN 0.415 billion on the same projects; a list place is not a commitment. On 31 October 2026 NFOŚiGW lists 170 signed grant agreements for PLN 3.687 billion and nine loans | observed-data | SRC-PL-17; SRC-PL-18 (computed from rows); SRC-PL-21 | Award evidence, not receipt; differs from the play's text (CF-PL-03) | pl-10, pl-11 | sourced |
| CL-PL-15 | Interpretation: a grant raises the return because it pays part of the build cost up front while trading revenue is unchanged; the platform prices the cohort's average share through the play's grant percentage | interpretation; model | REPO-PL-LIVE (`designEconomics` grant override); CL-PL-13 | A model treatment, not a project award | pl-11 | proposed |
| CL-PL-16 | Grid-connection refusals rose by almost 5 % in number in 2024; the refused capacity, about 73.6 GW, sums all refused applications and overstates unmet demand because applicants resubmit | observed-data | SRC-PL-23 | Context for connection risk; no storage-specific count | pl-12 | sourced |
| CL-PL-17 | Certification requires net achievable capacity deliverable for at least four uninterrupted hours | market-rule | SRC-PL-15 pkt 7.4.2.1(8), 6.3.2.5; REPO-DG1 | That a shorter battery certifies MWh ÷ test hours is the platform's reading, not PSE's statement | pl-08 | sourced |
| CL-PL-18 | On the live model, the best ungranted design is the capacity route at four hours, with negative value at the platform's yields; the ungranted merchant design at four hours is lower; the grant play at four hours is positive. The market page shows only the grant play's row | model fact | REPO-PL-LIVE | Values move with the model; bound, never typed | pl-00, pl-07, pl-11, pl-12 | sourced |

**Results for the existing candidate claims** (recorded here; `source-register.md` is unchanged):

| Claim | Result | Where |
| --- | --- | --- |
| CL-PL-01 | **Confirmed and split.** Batteries won long agreements (CL-PL-08), their factor was cut (CL-PL-06) and no successor is legislated (CL-PL-10) | pl-03 to pl-06 |
| CL-PL-02 | **Confirmed in law.** Investment aid granted before a new unit's first delivery period is deducted from its capacity remuneration, as a price reduction spread over the whole agreement (SRC-PL-01 art. 62(1)–(3)); the storage aid regulation permits combination only with that remuneration (SRC-PL-19 § 11). URE's calculation practice is still open (MR-5) | pl-11 |

### Historical nodes

| Node | Date or period | Event (source) | Constraint → choice → inheritance → present effect | Interpretation status |
| --- | --- | --- | --- | --- |
| H-PL-01 | Summer 2015 | Shortages limit supply to industrial customers (SRC-PL-02 recital (6)) | Ageing fleet → pay for capacity → the adequacy concern → capacity is paid for | Event via the Commission; causal link proposed (CL-PL-05) |
| H-PL-02 | Act 8 Dec 2017; in force 18 Jan 2018; approval 7 Feb 2018; first auctions 15 Nov–21 Dec 2018 | Capacity market created and approved (SRC-PL-01, SRC-PL-02, SRC-PL-05) | Missing money → long agreements for new plant → contract cohorts → earlier agreements still running | Events sourced |
| H-PL-03 | Auctions 15 Dec 2022 and 14 Dec 2023 | Batteries win seventeen-year agreements at a 95.00 % factor (SRC-PL-07, SRC-PL-11, SRC-PL-16) | Batteries certify → near-full credit → a battery cohort → the cohort the verdict prices | Events sourced; CL-PL-09 proposed |
| H-PL-04 | 12 Dec 2024 to 11 Dec 2025 | Battery factor 61.30 %, then 12.33 % (catch-up, 17 Jul 2025), then 13.39 % in the last scheduled main auction (SRC-PL-08, SRC-PL-09, SRC-PL-11, SRC-PL-12) | Fixed approval and a falling factor → last auction held → no schedule after it → no new-entry route | Events sourced; factor-cut cause proposed (GAP-PL-KWD-WHY) |
| H-PL-05 | Decision 11 Aug 2025; published 24 Feb 2026 | Coal limited to one-year supplementary auctions until 31 Dec 2028 (SRC-PL-03) | Emission limit → derogation → one-year auctions → a bridge, not a route | Event sourced |
| H-PL-06 | 3 Oct 2024 to 31 Oct 2026 | Scheme approved; regulation and call; ranking list 8 Dec, updated 12 Dec 2025; aid granted by 31 Dec 2025; 170 grants signed by the check date (SRC-PL-17 to SRC-PL-22, SRC-PL-25) | Storage needed fast → capital grants with conditions → a grant cohort → its own call | Events sourced |

The timeline boundary sits after H-PL-06; the successor is drawn dashed and labelled not legislated.

### CALC-PL-01 — what one kW of battery could contract, by auction

| Field | Entry |
| --- | --- |
| Question | How much capacity revenue could one kW of certified battery power win in each main auction, and how did that change? |
| Inputs | Clearing price for units in Poland, PLN/kW/year, from each URE final notice (SRC-PL-05 to SRC-PL-09, SRC-PL-26); battery correction factor from that auction's parameter regulation (SRC-PL-10 to SRC-PL-12) |
| Method | Contract value = price × factor ÷ 100, rounded half-up to PLN 0.01. One row per auction; the catch-up auction kept as its own row |
| Economic meaning | Gross annual capacity revenue per kW of certified power for a battery of at least four hours, in nominal PLN of its auction, before the art. 62 aid deduction and before any indexation. Not cash received, not equity cash, not a return |
| Outputs | See the chart table below; the auction for 2030 delivery gives 16.1 % of the 2027 value (62.27 ÷ 386.03), and 26.8 % of the 2028 value |
| Limits | No forecast; no technology split; shorter batteries certify less (CL-PL-17); the value of a held agreement also depends on its indexation, which is not computed here |
| Review | Proposed; the analyst accepts or changes the method at G-1 |

### Chart-PL-AUCTIONS — data and contract (proposed, not built)

Reviewer copy of the evidence the chart would plot. Every value binds through ‹bound: auction series›; none is typed into page copy.

| Delivery year | Auction | URE notice | Round | Price, PLN/kW/yr | Battery factor | Contract per kW (CALC-PL-01) | Battery obligation awarded |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2021 | 15 Nov 2018 | 99/2018, 27 Nov 2018 | 5 | 240.32 | 96.11 % | 230.97 | None reported |
| 2022 | 5 Dec 2018 | 103/2018, 14 Dec 2018 | 7 | 198.00 | 96.11 % | 190.30 | None reported |
| 2023 | 21 Dec 2018 | 10/2019, 14 Jan 2019 | 8 | 202.99 | 96.11 % | 195.09 | None reported |
| 2024 | 6 Dec 2019 | 106/2019, 30 Dec 2019 | 5 | 259.87 | 96.11 % | 249.76 | None reported |
| 2025 | 14 Dec 2020 | 2/2021, 5 Jan 2021 | 7 | 172.85 | 96.11 % | 166.13 | None reported |
| 2026 | 16 Dec 2021 | 2/2022, 7 Jan 2022 | 1 | 400.39 | 96.11 % | 384.81 | None reported |
| 2027 | 15 Dec 2022 | 2/2023, 9 Jan 2023 | 1 | 406.35 | 95.00 % | 386.03 | 165 MW |
| 2028 | 14 Dec 2023 | 2/2024, 5 Jan 2024 | 6 | 244.90 | 95.00 % | 232.66 | 1,734 MW, 33 units |
| 2029 | 12 Dec 2024 | 02/2025, 3 Jan 2025 | 7 | 264.90 | 61.30 % | 162.38 | Split pending |
| 2029, catch-up | 17 Jul 2025 | 44/2025, 8 Aug 2025 | 1 | 534.09 | 12.33 % | 65.85 | Split pending |
| 2030 | 11 Dec 2025 | 1/2026, 2 Jan 2026 | 2 | 465.02 | 13.39 % | 62.27 | Split pending |
| 2031 onwards | None scheduled | — | — | — | — | — | — |

"None reported" means URE's storage report shows only pumped storage before the 2027 auction (SRC-PL-16, Figure 1). Price and contract value use the same left-hand unit; factors are labels, not a second axis.

**Dataset.** The chart needs an analyst-entered, versioned record of these rows (proposed `src/markets/pl/data/capacityAuctions.js`, on the pattern of `src/markets/wa/data/rcmHistory.js`), each row carrying its URE notice and regulation locator. **It is not registered in `src/governance/datasets.js`, and that catalogue deliberately keeps capacity-market results out of automation** ("They stay analyst-entered until a connector exists that can assert the vintage it read"). This is a gap for the build (GAP-PL-AUCTIONS); nothing is registered now. **Terms:** the parameter regulations are normative acts and URE's notices are official documents, both outside copyright under SRC-PL-24 art. 4; URE's storage report is official material on the same basis, to confirm at the build's rights review. Attribution: "URE; Dziennik Ustaw". **No exchange day-ahead prices are needed**; the merchant line the story mentions in pl-07 is the model's existing field, built on PSE's day-ahead series, which is under the analyst's separate price-data rights review.

### Gaps and review queue

| Issue ID | Missing evidence or conflict | Affected | Temporary treatment | Next action |
| --- | --- | --- | --- | --- |
| GAP-PL-AUCTIONS | Auction-history dataset not registered | pl-05 | Chart reviewed as a design; nothing built | Build: create the analyst-entered module with locators; analyst approves |
| GAP-PL-TECH | No technology split for battery obligations in the 2029 and 2030 auctions; contract length is not technology | pl-03, pl-05 | "Technology split pending" | Research: URE annual report or PSE certification statistics |
| GAP-PL-2015 | PSE's own dated record of the 2015 supply limits; no primary generation-mix series opened | pl-01 | Fair marker; no coal share | Research: PSE announcement archive; a primary generation statistic |
| GAP-PL-KWD-WHY | The regulation's stated reason for the battery factor cut not opened | pl-03 to pl-05 | Cause kept as interpretation under art. 18(2) | Research: the justification of Dz.U. 2024 poz. 1154 and 2025 poz. 1066 |
| GAP-PL-TRANSFER | Whether grant conditions pass to a buyer of the project company, and whether a share sale needs NFOŚiGW's consent | pl-09, pl-12 | Stated as not verified | Diligence: the programme's specific grant conditions |
| MR-5 (existing gate) | How URE computes the art. 62 deduction for a project holding both a grant and a capacity agreement | pl-11 | Mechanism only; the stack stays unpriced | Research: URE practice |
| GAP-PL-SUCCESSOR | No public draft of a successor framework | pl-04, pl-06 | Dashed, "not legislated" | Watch the trigger; Sejm and government legislative records |

### Conflicts and flags

| ID | Finding | Disposition |
| --- | --- | --- |
| CF-PL-01 | The market page and the story receive only the grant play's row (`opportunities` keeps the first Polish row); the market verdict on `pl-cap-4h` appears on none of the home, comparison or market pages | Flagged at the top of the PR; G-1 point 1 |
| CF-PL-02 | The brief says the grant play "ranks first on the shortlist"; live it is fourth of seventeen and the first Polish row | Flagged; the script says neither |
| CF-PL-03 | The play's text says 169 projects with PLN 3.735 billion of grants on PLN 9.847 billion of cost (37.9 %). NFOŚiGW's lists give 172 recommended grants on PLN 10.004 billion (37.3 %); its signed list shows 170 grants for PLN 3.687 billion; the 161 signed grants matched to the list by amount give 37.3 %. The grant total matches the list; the count and cost do not | Flagged; no figure moves; the story binds the signed count from the record and the play's own grant share from the model |
| CF-PL-04 | The grant call's text cites a 17.1 % hold return (design engine); the market page's card shows an all-equity hold of 11.51 %, 1.74 points below the 13.25 % target, with "No supported price" (investment summary) | Flagged; the story binds the card and labels any design value's basis |
| CF-PL-05 | `pl-cap-4h` prices the capacity line on the last auction's terms (13.39 % × PLN 465.02); agreements from the auctions for 2027 and 2028 carry about 6.2 and 3.7 times that per kW (CALC-PL-01) | Observation for the analyst; the story says value depends on vintage and binds no vintage value |
| CF-PL-06 | Contract length is not technology: the 2026 auction's seventeen-year agreements were not batteries, and the 2027 auction's seventeen-year total exceeds its 165 MW of batteries. A code comment's battery volume for the 2027 supplementary auction rests on a third party | Story uses URE's battery split only |

### Discovery leads not used as sources

Press reports were used only to find primary documents: Gramwzielone, WysokieNapiecie, wnp.pl, e-magazyny, Globenergia, Parkiet and ISBnews items on the 2028–2030 auctions, the catch-up auction, PSE's advice against a catch-up auction for 2030, and the Ministry of Energy's reported plan to present a new capacity market to the Commission in the second quarter of 2026. None supports a claim above. The ministry's plan is the lead to follow for GAP-PL-SUCCESSOR.

## Analyst decisions — 1 November 2026

Authority: the analyst signed off the Chinese recommendations in this chat and authorised updates to the existing eight PRs. The numerical plan was approved for PJM, Poland and Italy. After a separate duration review, the analyst also approved Ireland’s six-hour candidate and Wait call, retaining assumed services revenue and appending the learning to history. The original G-1 checklists above are retained as historical questions and are superseded by this disposition.

| Item | Approved disposition / retained gate |
| --- | --- |
| CF-PL-01 / BUILD-PL-01 | Approve two cards: grant cohort Situational and ordinary capacity Wait, with distinct actions. Selected grant financial summary is not attached to the capacity card. Separate feature PR supplies the context rows. |
| CF-PL-03 / 05 | Approve 37.3% grant-cohort assumption after primary aggregate verification in a separate data PR. Keep award, recommendation and cash receipt distinct. Prior contract vintages are compared by payment per kW, never by a claimed IRR multiple. |
| Chart / design values | Approve Chart-PL-AUCTIONS and CALC-PL-01, manual official records, labelled design values distinct from investment returns, and battery volumes only where the official technology split exists. |
| Interpretation / markers | Accept capacity-adequacy and early-credit causal readings as interpretations; open the statutory explanation before attributing a motive to the factor cut. Proposed markers and bilingual copy approved. |

**Common build conditions.** Model labels bind existing result fields; no financial constants are typed into page copy. Observations, non-binding plans, model paths and teaching Examples remain visually distinct. A rights block is withheld or replaced by an unscaled Example, not downgraded to Thin observed data. Manual chart records retain primary URL, locator, vintage, units and arithmetic; no dataset is registered by this documentation PR. “Strong” assesses evidence, not investment quality. Shared source/claim consolidation follows the script merges.

**Final reconciliation:** pending the referenced independent PRs and exact-head validation. Approval of an editorial choice does not close an unresolved source, contract, rights or numerical dependency.
