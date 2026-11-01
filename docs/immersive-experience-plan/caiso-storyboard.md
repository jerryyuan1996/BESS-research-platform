# CAISO (California): Six-Chapter Storyboard

Pack: BESS-IX-2026-10-30; CAISO script researched 31 October 2026; shot layout v1.2  
Status: G-1 signed off 1 November 2026 and reconciled to the approved model/function changes. This is a G-1 script; G-2 construction, dataset and rights gates remain explicit. Merge only after dependency and exact-head checks pass.
Navigation: [Master plan](README.md) | [Narrative card](market-narratives.md#3-eighteen-market-candidate-story-cards) | [Evidence specification](evidence-and-content-specification.md) | [WA format](western-australia-storyboard.md) | [Sources and claims](#11-sources-and-claims)

## 1. Scope, argument and reading route

The story covers the **CAISO balancing area**: most of California, run by the California Independent System Operator. Some Californian utilities run their own balancing areas outside it, so the map is labelled approximate. Allocation `caiso`; default lens `infraFund`.

It argues for one conclusion: the platform's CAISO call and play as the view store publishes them. `reviewedAgainst` (REPO-CAISO-LIVE): `main` at `edcb39c`, checked 31 October 2026. The infrastructure-fund call is `opportunistic`, shown as **Situational / 择机投入**. The play is **`caiso-cap-4h`**, "Resource adequacy · 4h", entered at the operating stage. The next trigger is `caiso-storage-capacity-foldback`, "Storage qualifying capacity is cut for foldback from 2027", expected January 2027, direction down. Review by 31 March 2027. The analyst's ruling of 16 October holds the call at Opportunistic until the research gate on CAISO's model seeds (G41) closes, so no seed is presented as observed.

**What the trigger is.** Foldback is the fall in a battery's power as it nears empty or full. CPUC decision D.26-07-008 of 2 July 2026 counts storage, from the 2027 RA compliance year, only at the output it can hold for four continuous hours without foldback. It also moves gas and storage to unit-specific UCAP, based on outage records, from 2028 (CL-CAISO-11). The size of the cut for any battery is not yet published (GAP-CAISO-FOLDBACK).

The argument:

1. After the 2000–01 electricity crisis, the CPUC made every electricity retailer it regulates contract its own capacity ahead of time. The legislature confirmed it in 2005, and the first system requirements took effect on 1 June 2006. Capacity is bought bilaterally, with no clearing price (CL-CAISO-02, CL-CAISO-03).
2. Solar moved the hardest hours into the early evening, when demand minus wind and solar peaks. The August 2020 outages came in that net peak (CL-CAISO-04).
3. RA counts a battery at the output it can hold for four hours, and gives a longer one no more. After 2020 the CPUC ordered new capacity on contracts of at least ten years. So California built a four-hour fleet (CL-CAISO-05, CL-CAISO-06).
4. That fleet now supplies a significant share of the evening, and at the system level four-hour RA is largely met: summer surpluses, RA scarcest in spring, adequacy observations (CL-CAISO-07, CL-CAISO-08, CL-CAISO-16); RA-price direction is withheld pending the parked rights review.
5. The rules now count by the hour (slice of day, from 2025) and, from 2027, without the foldback tail. From 2028 each unit's outage record counts too (CL-CAISO-10 to CL-CAISO-12).
6. RA carries most of the play's modelled revenue, counted as secured for a term. At build cost the reference project returns less than the fund's target. An operating asset that already holds deliverability and an RA contract clears it only up to a price. So the fund buys operating RA-contracted assets at that price, once the foldback cut shows how many MW they can still sell (CL-CAISO-13, CL-CAISO-15).

Comprehension check: from the story alone, the user can say why the play is four hours (RA counts four), why the entry is an operating asset bought at a price rather than a new build (four-hour RA is largely met, and a new build does not clear the target), and why it waits for 2027 (the foldback cut).

**Competing explanation, kept.** RA prices could stay firm as load grows (the CPUC now requires large new loads to be reported), as thermal plants retire and as local areas stay tight; spring scarcity may move value between months rather than reduce it. **Disconfirming condition:** RA contract prices for 2027 to 2029 deliveries rising again in the CPUC's data, or a negligible foldback cut, would weaken the case for buying only operating assets. The analyst decides whether either moves the call; this script does not.

Fourteen shots (`caiso-00` to `caiso-13`) make about five to six minutes of reading on the shared fixed-view isometric SVG kit. Scenes show a real system with simplified topology, not a load-flow model or a project design. Chapter links and ordinary scrolling work throughout, and nothing waits for an animation.

| Chapter | 章节 | Shots | What the reader can explain afterwards |
| --- | --- | --- | --- |
| Opening | 开篇 | caiso-00 | The call and the play, in one line |
| Origins | 起源 | caiso-01, caiso-02 | Why California buys reliability by contract, and why its hardest hours moved to the evening |
| Historical choices | 历史选择 | caiso-03, caiso-04 | Why the fleet is four hours long, and how the 2020 outages made it a fleet |
| Today's tensions | 当下的矛盾 | caiso-05, caiso-06, caiso-07 | The evening batteries now serve, why four-hour RA is largely met, and what slice of day and foldback change |
| Add a battery | 加入电池 | caiso-08, caiso-09 | Why four hours, and what the investor owns |
| Who pays | 谁来付费 | caiso-10, caiso-11 | RA first, for a term; one battery cannot promise everything |
| The investment | 投资 | caiso-12, caiso-13, then links | Why an operating asset bought at a price, what could weaken it, and where the numbers live |

### Bound fields

Every figure on the page comes through one of these tokens. The values are given only so the analyst can review the script against the live case; they are never typed into copy. If the play changes, the play card updates itself and `reviewedAgainst` flags this script for review.

| Token | Field the market page already reads | At check, 31 Oct 2026 |
| --- | --- | --- |
| ‹bound: call› | `row.call`, shown through `CALLS` in `src/experience/model.js` | Situational / 择机投入 (`opportunistic`) |
| ‹bound: play› | `playTitle(row.play, row.stage)` (`routeName` in `pages.js`) | Resource adequacy · 4h · operating / 资源充裕度 · 4小时 · 在运资产 |
| ‹bound: card figures› | The card's existing metrics: `row.econ.hold`, `row.econ.levered`, `row.econ.secured`, `row.econ.securedYears` | 6.4% hold, 6.2% levered, 78% fixed, 10 years |
| ‹bound: next action› | `row.play.action.text` | "After the January 2027 foldback cut, price operating assets with RA contracts; buy only where the price clears the hurdle." |
| ‹bound: play evidence› | `row.evidence`, through the existing evidence labels | strong |
| ‹bound: play duration› | `row.play.hours` | 4 |
| ‹bound: entry route› | `STAGE_WORD[row.play.stage]` in `src/governance/playTitle.js` | operating / 在运资产 |
| ‹bound: secured share› | `row.econ.secured` ("Modelled fixed revenue") | 78% |
| ‹bound: secured tenor› | `row.econ.securedYears` ("Fixed revenue tenor") | 10 |
| ‹bound: hold return› | `row.econ.hold`: the card's all-equity hold return for building new | 6.4% |
| ‹bound: target return› | `row.econ.test.target` (`row.investment.targetReturn`) | 10.6% |
| ‹bound: build capex› | `row.investment.capexPerMW`, per MW, as `projectFacts` prints it | USD 1.48m per MW |
| ‹bound: operating price ceiling› | `row.investment.operatingPurchase.maxPricePerMW`, per MW, as `operatingPrice()` prints it | USD 888.1k per MW |
| ‹bound: operating target› | `row.investment.operatingPurchase.targetReturn` | 10.1% |
| ‹bound: build line› | `HOME_BRIEFING.build`, the CAISO entry's `line` (a computed sentence) | "CAISO: nothing clears the platform's yields; resource adequacy at 4h comes closest, at −$333k/MW." |
| ‹bound: best duration› | `HOME_BRIEFING.grids.caiso.byRoute.cap.best` | 4 |
| ‹bound: next trigger› | `HOME_BRIEFING.triggers[row.next]`: `label` and `expected` | "Storage qualifying capacity is cut for foldback from 2027", 2027-01 |

The thesis and `play.why` type a build-cost return on a different basis from the card's headline (CF-CAISO-01). Bind the card's field; never copy a figure from the thesis, `why` or a grade reason.

Evidence bindings, proposed for the build and not yet runtime fields:

| Token | Source record and field | Units and limit |
| --- | --- | --- |
| ‹bound: fleet 2020› · ‹bound: fleet Dec 2024› | SRC-CAISO-11, key findings, p. 4 | MW, CAISO balancing area, "about" |
| ‹bound: fleet latest› | SRC-CAISO-12, p. 23 | MW, CAISO area, end of 2025, "over" |
| ‹bound: MTR NQC› · ‹bound: MTR minimum term› | SRC-CAISO-08, p. 2 and p. 70 | MW of September net qualifying capacity; years |
| ‹bound: LDES threshold› | SRC-CAISO-10, p. 49 | Hours at maximum capacity |
| ‹bound: chart series› | CALC-CAISO-DAY outputs | MW by hour, CAISO clock; unavailable until GAP-CAISO-DAY closes |
| ‹bound: research check date› | This register | 31 October 2026 |

The teaching battery is 100 MW and tagged "Example"; its presets are teaching values and never change the case (evidence specification §4).

### Rules for every shot

- **Figures.** Calls, durations, returns, prices and shares come through the bound fields above, and observed quantities through the evidence bindings. Dates are sourced historical facts, not figures to bind.
- **Controls.** Teaching controls change only teaching state: era, season, time of day, battery preset, counting rule, hotspot or route. The story has no underwriting controls. "Go to the investment case" links to the market page, which hands the case to the Investment Lab.
- **Navigation.** Chapter and shot changes are history entries. Back, refresh, a language switch and opening or closing evidence keep the reader's place (`WP-04`).
- **Evidence.** Each shot shows one marker and one "What would change it" line, in the site's fixed wording: Strong evidence (证据充分), Fair evidence (证据尚可), Thin evidence (证据单薄). A Strong marker assumes the analyst's review at G-1. The Authoring check row is for writers and reviewers and never appears on the page. Adopted rules whose effects start after the check date are drawn dashed; teaching values are tagged "Example" (示例).
- **History.** Each timeline node keeps the event and its interpretation apart, and keeps a decision, its effective date and its effect apart.
- **Names.** No project, developer or counterparty is named anywhere in the story.
- **Two languages.** All page text is drafted below in English and Simplified Chinese with the same meaning. Source titles keep their original language.

Shared story strings:

| String | English | 简体中文 |
| --- | --- | --- |
| Story button | Story | 故事 |
| Navigation | Previous · Next · Chapters · Sources | 上一节 · 下一节 · 章节 · 来源 |
| Marker line | What would change it: | 会改变判断的证据： |
| Teaching tag | Example | 示例 |
| Exit | Go to the investment case | 前往投资方案 |
| Stale call | This story was last reviewed against the call of ‹date›. | 本故事最近一次依据‹date›的投资判断复核。 |
| Chart fallback | Observed series awaiting registration; showing an Example | 观察序列尚待登记；当前展示示例 |

## 2. Opening

### caiso-00 — The call · 投资判断

| Item | Shot specification |
| --- | --- |
| Scene | Small isometric California thumbnail with the CAISO area labelled approximate; no animation |
| Feedback | None; this shot is the conclusion |
| Evidence and chart | REPO-CAISO-LIVE: play card fields from the view store through the briefing model; CL-CAISO-15 |
| Authoring check | Never restate the call or a figure in prose. The thesis and `play.why` carry a typed return on a different basis from the card (CF-CAISO-01): show the card, never the thesis. The call is held at Opportunistic by the 16 October ruling while research gate G41 is open; the page does not mention the gate. A changed call or play updates the card and flags the story |
| Mobile | Play card full width; two buttons |
| Status | `model-assumption`; `sourced`; `model-assumes-route`, not `contract-verified`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What is the call here, and why should I read on? | 这里的投资判断是什么？为什么值得读下去？ |
| Copy | The existing play card: ‹bound: call›, ‹bound: play›, ‹bound: card figures›, ‹bound: next action›. Beneath it: "Why: a capacity rule that counts four hours, an evening that solar created, and a battery fleet that now carries a large part of it." | 沿用现有投资方案卡：‹bound: call›、‹bound: play›、‹bound: card figures›、‹bound: next action›。卡片下方一行：“原因在于：一条按四小时计量容量的规则、一个由光伏造就的傍晚，以及如今已承担其中很大一部分的电池机组。” |
| Marker | The play's own marker, already on the card | 沿用方案卡上该方案自身的证据标记 |
| Controls | Start the story · Go to the investment case | 开始阅读 · 前往投资方案 |

## 3. Origins

### caiso-01 — Reliability bought by contract · 以合同买下可靠性

| Item | Shot specification |
| --- | --- |
| Scene | California from Natural Earth's outline, as the CAISO dashboard map already uses it (`src/markets/caiso/ca-boundary.json`), with the CAISO area shaded and labelled approximate. Retailer symbols each hold a contract card; no auction hammer anywhere |
| Feedback | "Before 2006" shows retailers without cards; "From 2006" adds a card to each; the caption sits outside the drawing |
| Evidence and chart | CL-CAISO-02 (SRC-CAISO-01, §2.1; SRC-CAISO-02, §1; SRC-CAISO-03); CL-CAISO-03 (SRC-CAISO-01, §2.1, policies (1) to (3); SRC-CAISO-12, pp. 13–14) |
| Authoring check | The crisis link is the CPUC's own framing: RA requirements were developed "in the aftermath of the electricity crisis of 2000-2001". Keep any wider account of the crisis off the page. System RA is contracted by each retailer; local RA in two utility areas is now bought by a central procurement entity, still by contract. Do not write that every MW is bought by each retailer. No comparison with other markets on the page beyond "not by auction" |
| Mobile | Same map; two large buttons |
| Status | `historical-fact` and `market-rule`; `sourced`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | How does California pay for reliability? | 加州如何为可靠性付费？ |
| Copy | By contract, not by auction. After the 2000–01 electricity crisis, the CPUC required every electricity retailer it regulates to secure its own capacity ahead of time. The legislature confirmed the rule in 2005, and the first system requirements took effect on 1 June 2006. | 靠合同，而不是靠拍卖。2000–01年电力危机之后，加州公用事业委员会（CPUC）要求其监管的每一家售电主体提前自行落实所需容量。州议会于2005年以立法确认这一规则，首批系统容量要求于2006年6月1日生效。 |
| Meaning | There is no clearing price: a battery's capacity income is whatever its contract with a retailer says. | 这里没有统一的出清价格：电池的容量收入取决于它与售电主体签订的合同。 |
| Marker | Strong evidence. What would change it: a CPUC decision that replaces retailer-by-retailer contracting with a central capacity auction. | 证据充分。会改变判断的证据：CPUC作出决定，以集中容量拍卖取代各售电主体分别签约。 |
| Controls | Before 2006 · From 2006 | 2006年之前 · 2006年起 |
| Labels | CAISO area (approximate) · Retailer · Capacity contract · No central auction | CAISO覆盖范围（近似） · 售电主体 · 容量合同 · 无集中拍卖 |
| Caption | Approximate. Outline: Natural Earth. | 近似范围。轮廓：Natural Earth。 |

### caiso-02 — Solar moved the hard hours · 光伏把难关推到了傍晚

| Item | Shot specification |
| --- | --- |
| Scene | The same grid at noon, then at dusk: utility-scale solar and rooftops lit at noon, homes lit and solar dark at dusk; a marker for the tightest hours moves from the afternoon to after sunset |
| Feedback | Scene and marker change together; no measured curve here, because the signature chart in caiso-05 carries the data |
| Evidence and chart | CL-CAISO-04 (SRC-CAISO-04, p. 1; SRC-CAISO-05, Executive Summary, p. 4) |
| Authoring check | Net load is demand minus wind and solar, CAISO's own definition. The duck chart began as CAISO scenarios for 2012 to 2020; cite it for the idea, not as data. The 2020 outage report places both outages in the net demand peak and names three causes; do not say solar caused them |
| Mobile | Two aligned panels with the same labels |
| Status | `historical-fact` and `market-observation`; `sourced`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | When is California's grid hardest to run? | 加州电网什么时候最难运行？ |
| Copy | After sunset. Solar carries the middle of the day, then fades while homes and offices still draw power. What the rest of the system must serve, demand minus wind and solar, peaks in the early evening. CAISO calls the shape the duck curve. | 在日落之后。光伏撑起白天，但在住户和办公楼仍在用电时逐渐退场。其余电源需要承担的负荷——即需求减去风电和光伏——在傍晚早些时候达到峰值。CAISO把这条曲线称为“鸭子曲线”。 |
| Meaning | The value of capacity moved to the evening: the hours a battery can fill with midday solar. | 容量的价值转移到了傍晚，而这正是电池可以用午间光伏电量来填补的时段。 |
| Marker | Strong evidence. What would change it: a CAISO assessment showing the tightest hours moving back into the afternoon. | 证据充分。会改变判断的证据：CAISO的评估显示最紧张的时段重新回到午后。 |
| Controls | Midday · Evening | 中午 · 傍晚 |
| Labels | Demand · Wind and solar · Net load: demand minus wind and solar · Tightest hours | 需求 · 风电与光伏 · 净负荷：需求减去风电和光伏 · 最紧张的时段 |

## 4. Historical choices

### caiso-03 — Four hours became the unit · 四小时成为计量单位

| Item | Shot specification |
| --- | --- |
| Scene | Same grid frame with the six-node timeline below; a battery drawn as four stacked hour-bars at full power. Selecting a node changes one layer |
| Feedback | Only the selected layer changes; effects of adopted rules after the check date (2027, 2028) are dashed |
| Evidence and chart | Event: CL-CAISO-05 (SRC-CAISO-07, Appendix B §13.1, p. B-9; SRC-CAISO-11, §2.10.1, p. 28; SRC-CAISO-10, §4.4.1, p. 19). Procurement: SRC-CAISO-06, p. 2. Fleet shape: REPO-CAISO-DG2 (EIA-860M, an average close to four hours, never typed). Nodes: H-CAISO-01 to H-CAISO-06 |
| Authoring check | The four-hour test predates storage: all RA resources had to run four or more consecutive hours, and D.14-06-050 applied it to storage as PmaxRA. Keep the rule (the event) apart from the reading that it shaped the fleet (an interpretation: cost and procurement also mattered). Under slice of day a battery is shown for its own duration, and from 2027 storage of eight hours or more has its own rules (SRC-CAISO-10, pp. 28 and 48–51): write that a longer battery gets no extra credit, not that it earns nothing. No invented dates; adopted effects after the check date stay dashed |
| Mobile | Vertical node list; one diagram |
| Status | Events `sourced`; interpretation `proposed`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why are California's batteries four hours long? | 为什么加州的电池是四小时的？ |
| Copy | Because that is what RA counts. Since 2014 the CPUC has credited a battery at the output it can hold for four hours without a break. A shorter battery is counted as a smaller one; a longer one gets no extra credit. Utilities were already under orders to buy storage, so the fleet was built to the rule. | 因为资源充裕度（RA）就是这样计量的。自2014年起，CPUC按电池能够不间断持续四小时的出力给予信用。时长较短的电池只能按一台更小的电池计算，时长更长的电池也拿不到额外信用。当时公用事业公司已被要求采购储能，于是整个机组群就按这条规则来建设。 |
| Meaning | The rule sets this play's ‹bound: play duration› hours: the market rewards meeting it, not beating it. | 这条规则决定了本方案的‹bound: play duration›小时时长：市场奖励的是达到这一标准，而不是超越它。 |
| Marker | Strong evidence. What would change it: a CPUC decision changing the four-hour basis of storage credit, which the current RA proceeding has left open. | 证据充分。会改变判断的证据：CPUC作出改变储能信用四小时基准的决定——当前的RA程序仍把这一问题留待处理。 |
| Controls | Select a node · Constraint · Choice · What remains · Effect today | 选择节点 · 约束 · 选择 · 遗留 · 今日影响 |

Timeline nodes (page text):

| Node | Field | English | 简体中文 |
| --- | --- | --- | --- |
| 2004–2006 · Retailers must hold capacity | Constraint | After the 2000–01 crisis, no rule made retailers hold capacity ahead of time. | 2000–01年危机之后，并没有规则要求售电主体提前持有容量。 |
| | Choice | Each retailer must contract its own capacity, with a reserve margin, and most of its summer needs a year ahead. | 每一家售电主体都须自行签约落实容量并留有备用裕度，夏季所需的大部分须提前一年落实。 |
| | What remains | Year-ahead and month-ahead RA showings. | 年度和月度RA容量申报。 |
| | Effect today | A battery's capacity income comes from a contract with a retailer. | 电池的容量收入来自与售电主体签订的合同。 |
| 2013–2014 · Storage ordered, and counted at four hours | Constraint | A grid adding solar needed flexible capacity. | 光伏不断增加的电网需要灵活容量。 |
| | Choice | The CPUC set the large utilities a storage target in 2013, and in 2014 credited storage at the output it can hold for four hours. | CPUC于2013年为几家大型公用事业公司设定储能采购目标，并于2014年按储能可持续四小时的出力给予信用。 |
| | What remains | The four-hour rule, still in force. | 四小时规则，至今有效。 |
| | Effect today | The fleet is built around four hours. | 整个机组群以四小时为中心建设。 |
| August 2020 – June 2021 · The evening runs short | Constraint | Planning targets had not kept pace with the early evening; rotating outages followed on 14 and 15 August 2020. | 规划目标未能跟上傍晚时段的需要；2020年8月14日和15日随之实施了轮流停电。 |
| | Choice | In June 2021 the CPUC ordered new capacity, on contracts of at least ‹bound: MTR minimum term› years. | 2021年6月，CPUC下令采购新增容量，合同期至少‹bound: MTR minimum term›年。 |
| | What remains | Long contracts on the plants that order brought. | 该命令所带来电站签下的长期合同。 |
| | Effect today | Operating batteries from that wave can come with long RA contracts. | 这一轮建成的在运电池可能附带长期RA合同。 |
| 2022–2025 · Slice of day | Constraint | One peak hour no longer described the risk. | 单一峰值小时已不足以描述风险。 |
| | Choice | Show capacity for every hour of each month's worst day, with spare energy to charge the batteries: adopted in 2022, binding from 2025. | 按每月“最严峻日”的每一个小时申报容量，并留足为电池充电的富余电量：2022年通过，2025年起执行。 |
| | What remains | The 24-hour showing. | 24小时申报。 |
| | Effect today | A battery counts only in the hours it can really cover. | 电池只在它真正能覆盖的时段计入。 |
| July 2026 · Foldback and outage records | Constraint | Batteries lose power as they near empty, so the old count could include power they cannot hold. | 电池接近放空时出力下降，旧的计量方式可能把电池无法维持的那部分功率也计算在内。 |
| | Choice | From 2027, count only the power a battery holds for four hours without that fall; from 2028, judge each unit on its outage record. | 自2027年起，只计算电池在不出现这种回落的情况下可持续四小时的出力；自2028年起，再按每台机组的停运记录核定。 |
| | What remains | Adopted rules; their effects from 2027 are drawn dashed. | 规则已经通过；其2027年起的影响以虚线表示。 |
| | Effect today | The MW an operating battery can sell may fall in 2027, by an amount not yet published. | 在运电池可出售的MW可能在2027年下降，降幅尚未公布。 |
| From 2027 (dashed) · The next step is eight hours | Constraint | Four-hour storage already serves much of the evening. | 四小时储能已承担傍晚的很大一部分需求。 |
| | Choice | From 2027, storage that can run ‹bound: LDES threshold› hours or more at full power may count across the whole day. | 自2027年起，能以满功率持续运行‹bound: LDES threshold›小时及以上的储能，可在全天各时段计入。 |
| | What remains | Adopted, not yet in effect: drawn dashed. | 已经通过、尚未生效：以虚线表示。 |
| | Effect today | Storage meant to cover more of the day must be built long; this play is not. | 想覆盖一天中更多时段的储能必须建得更长；本方案并不走这条路。 |

### caiso-04 — August 2020, and the build that followed · 2020年8月，以及随后的建设潮

| Item | Shot specification |
| --- | --- |
| Scene | Dusk in a heat wave: evening demand drawn above the available supply (schematic); then battery yards appearing year by year, sized from the bound fleet values |
| Feedback | "August 2020" shows the shortfall at the net peak; "After the orders" grows the battery layer |
| Evidence and chart | CL-CAISO-04 (SRC-CAISO-05, p. 4); CL-CAISO-06 (SRC-CAISO-08, p. 2 and p. 70); CL-CAISO-07 (SRC-CAISO-11, p. 4) |
| Authoring check | The outage report names three causes (weather, RA and planning, market practices); use only the planning finding and never call it the sole cause. That the 2021 order became mostly batteries is an interpretation: no CPUC count of its procurement by technology was located (GAP-CAISO-MTR). Fleet values carry their source's scope, the CAISO balancing area |
| Mobile | Two panels, then the fleet blocks as a short list |
| Status | Events `sourced`; the procurement-to-fleet link `proposed`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What turned four-hour batteries from a pilot into a fleet? | 是什么让四小时电池从试点变成了规模化的机组群？ |
| Copy | The evening of August 2020. The rotating outages of 14 and 15 August came after the afternoon peak, during the net peak, and the state's review found that planning had not kept pace with the early evening. In 2021 the CPUC ordered ‹bound: MTR NQC› MW of new capacity on contracts of at least ‹bound: MTR minimum term› years. The battery fleet grew from about ‹bound: fleet 2020› MW in 2020 to about ‹bound: fleet Dec 2024› MW by the end of 2024. | 是2020年8月的那个傍晚。8月14日和15日的轮流停电发生在午后用电高峰之后、净负荷峰值期间；州政府的复盘认定，规划未能跟上傍晚时段的需要。2021年，CPUC下令采购‹bound: MTR NQC›MW新增容量，合同期至少‹bound: MTR minimum term›年。电池机组规模从2020年的约‹bound: fleet 2020›MW，增长到2024年底的约‹bound: fleet Dec 2024›MW。 |
| Meaning | Batteries built in that wave can carry long RA contracts: the kind of asset this play buys. | 这一轮建成的电池可能附带长期RA合同，而这正是本方案要收购的资产类型。 |
| Marker | Fair evidence. What would change it: a CPUC count of the 2021 order's procurement by technology. | 证据尚可。会改变判断的证据：CPUC按技术类型统计的2021年采购命令落实情况。 |
| Controls | August 2020 · After the orders | 2020年8月 · 采购命令之后 |
| Labels | Net peak · Rotating outages · Battery fleet, CAISO balancing area | 净负荷峰值 · 轮流停电 · 电池机组（CAISO平衡区） |

## 5. Today's tensions

### caiso-05 — The evening, now carried by batteries · 如今由电池分担的傍晚 (signature chart · 核心图表)

| Item | Shot specification |
| --- | --- |
| Scene | Same grid at dusk; battery yards discharging |
| Feedback | Signature chart **Chart-CAISO-EVENING** (§9): the median summer business-day net load for 2020 (thin line) and 2025 (solid line), with 2025 battery output shaded where it charges and discharges, and a band over the four highest net-load hours tagged Example. Until GAP-CAISO-DAY closes, an unscaled Example with no numeric axes and the chart-fallback string |
| Evidence and chart | CL-CAISO-07 (SRC-CAISO-11, p. 4; SRC-CAISO-12, pp. 2, 23 and 82); CL-CAISO-16 and CALC-CAISO-DAY (SRC-CAISO-18, rights SRC-CAISO-19); GAP-CAISO-DAY |
| Authoring check | A median day, labelled as such; not a stress day. Net load is demand minus wind and solar and does not include battery output. The four-hour band is an Example derived from the bound play duration, not a dispatch, a schedule or an RA showing. CAISO's clock, not EIA-930's (CF-CAISO-06). No typed MW in the copy; the trough-and-peak sentence rests on CALC-CAISO-DAY and is withheld if the record is not signed off |
| Mobile | Chart full width; era buttons above it |
| Status | Chart method `proposed`; observed layer `blocked` until registration and the rights decision; G-1 reviews the design |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Who carries California's evening now? | 如今由谁来分担加州的傍晚？ |
| Copy | More and more, batteries. They charge on midday solar and discharge into the evening, when net load is highest, and now supply a significant share of it; by the end of 2025 the CAISO area had over ‹bound: fleet latest› MW of them. Since 2020 the midday trough has deepened while the evening peak has held. | 越来越多地由电池分担。电池在中午用光伏电量充电，在净负荷最高的傍晚放电，如今已提供其中相当大的一部分；截至2025年底，CAISO区域的电池规模已超过‹bound: fleet latest›MW。与2020年相比，午间低谷大幅加深，而傍晚峰值基本不变。 |
| Meaning | The evening that made four-hour batteries valuable is now shared by a large fleet of them, so each new one competes for the same hours. | 让四小时电池变得有价值的傍晚，如今已由一大批电池共同分担，因此每一台新电池都在争夺同样的时段。 |
| Marker | Fair evidence. What would change it: a registered hourly series from CAISO, showing the median summer day for each year. | 证据尚可。会改变判断的证据：完成登记的CAISO小时数据序列，逐年展示夏季中位日。 |
| Controls | Summer 2020 · Summer 2025 · Show the four hours RA counts | 2020年夏季 · 2025年夏季 · 显示RA计入的四个小时 |
| Labels | Net load, median summer weekday · Battery output · Charging · Example: the four hours a battery is credited for · MW · Pacific time | 净负荷（夏季工作日中位值） · 电池出力 · 充电 · 示例：电池获得信用的四个小时 · MW · 太平洋时间 |
| Caption | Median business day, July to September. Source: California ISO, Today's Outlook data. | 7月至9月工作日中位日。来源：加州独立系统运营机构（California ISO）Today's Outlook数据。 |

### caiso-06 — Four-hour RA is largely met · 四小时RA需求已基本满足

| Item | Shot specification |
| --- | --- |
| Scene | A summer evening with the supply stack well above demand plus reserve; a spring evening with a thinner margin |
| Feedback | Summer and spring show the sourced adequacy observations. No RA benchmark-price direction or price drawer is displayed. |
| Evidence and chart | CL-CAISO-08 (SRC-CAISO-12, pp. 13–14; SRC-CAISO-13, Executive Summary, p. 1; SRC-CAISO-14); CL-CAISO-09 (SRC-CAISO-15, Tables 1 and 2; SRC-CAISO-16, §4.1; CF-CAISO-03) |
| Authoring check | "Largely met" is the analyst's reading of three observations (a summer 2026 surplus above the one-in-ten standard, RA capacity well above the 2025 peak, RA scarcest in spring), not a CPUC finding. The benchmark is a volume-weighted average of all RA trades for a delivery year, on a single method since D.25-06-049: never put earlier system, local or flexible values on the same axis. It is regulator-published price data, so the drawer gives direction only, pending the analyst's price-data review. Local areas can still be tight (local requirements rise for 2027 to 2029); the claim here is system-wide |
| Mobile | Two season cards, then the drawer |
| Status | Observations `sourced`; interpretation `proposed`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Is California still short of evening capacity? | 加州傍晚的容量还短缺吗？ |
| Copy | The platform reads four-hour RA as largely met at system level: the 2025 peak was covered, scarcity shifted towards spring, and the 2026 summer assessment showed a surplus above the reliability standard. This is an interpretation of those observations, not a CPUC finding that every location or month has enough capacity. | 平台判断，全系统层面的四小时RA需求已大体满足：2025年峰值获得覆盖，紧张时段向春季转移，2026年夏季评估也显示高于可靠性标准的容量盈余。这是对上述事实的解释，并非CPUC认定每个地点、每个月份都已容量充足。 |
| Meaning | An operating asset’s deliverability, contract and purchase price decide the case even where the system has surplus capacity. | 即使全系统容量有盈余，在运资产的可交付能力、合同和买入价格仍决定投资是否成立。 |
| Marker | Fair evidence. What would change it: RA contract prices for 2027 to 2029 deliveries rising again in the CPUC's data. | 证据尚可。会改变判断的证据：CPUC数据显示2027至2029年交付的RA合同价格重新上涨。 |
| Controls | Summer evening · Spring evening · Local constraints | 夏季傍晚 · 春季傍晚 · 本地约束 |
| Labels | RA capacity shown · Demand plus reserve · Margin · Benchmark for RA trades, by delivery year | 申报的RA容量 · 需求加备用 · 裕度 · RA交易基准价格（按交付年份） |

### caiso-07 — Counted by the hour, then without the tail · 按小时计量，再剔除出力回落

| Item | Shot specification |
| --- | --- |
| Scene | A 24-hour strip for the month's worst day: four battery hour-blocks placed in the evening and a charging strip at midday. The third step trims the last stretch of each block (foldback, tagged Example) and stamps "From 2027" and "Outage record from 2028", both dashed |
| Feedback | Three steps: before 2025 (one peak hour), slice of day (24 hours plus charging), foldback (the trimmed block) |
| Evidence and chart | CL-CAISO-10 (SRC-CAISO-09, Appendix A, A and B.2; SRC-CAISO-11, p. 28); CL-CAISO-11 (SRC-CAISO-10, §4.4.1 pp. 19–21, §4.4.1.3 pp. 26–28, p. 177, Ordering Paragraph 6 p. 197, fact sheet pp. 1–2; SRC-CAISO-22, p. 12); CL-CAISO-12 (SRC-CAISO-10, §4.4.3.3 pp. 48–51) |
| Authoring check | The foldback change is adopted for the 2027 RA year, but its size is unknown: the decision leaves the default value open, and by mid-October 2026 the CPUC's resource database had not yet been changed to calculate it (SRC-CAISO-22). Never draw a number for the cut; the trim is an Example. UCAP from 2028 replaces QC for batteries and carries foldback through outage rates: keep the two steps distinct. Slice of day changed how storage is shown (hour by hour, with charging), not its four-hour QC. The eight-hour rule stays in the evidence drawer |
| Mobile | Three stacked panels with the same labels |
| Status | Rules `sourced`, `current-at-check`; size of the cut `missing`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What do the new counting rules change? | 新的计量规则改变了什么？ |
| Copy | Two things. Since 2025, retailers must show capacity for every hour of each month's worst day, plus spare energy to charge their batteries, so a battery counts only in the hours it can really cover. From 2027, a battery is credited only for the power it can hold for four hours before its output folds back as it nears empty; from 2028, each unit is also judged on its outage record. | 有两点。自2025年起，售电主体须为每月“最严峻日”的每一个小时申报容量，并留足为电池充电的富余电量，因此电池只在它真正能覆盖的时段计入。自2027年起，电池只能按其在接近放空、出力回落之前可持续四小时的功率获得信用；自2028年起，每台机组还要按其停运记录核定。 |
| Meaning | The same battery may sell fewer MW of RA from 2027, by an amount not yet known. That is why the play waits. | 同一台电池自2027年起可出售的RA容量可能减少，减少多少尚不可知。这正是本方案选择等待的原因。 |
| Marker | Strong evidence. What would change it: a CPUC decision that delays or reverses the 2027 change. | 证据充分。会改变判断的证据：CPUC作出推迟或撤销2027年变更的决定。 |
| Controls | Before 2025 · Slice of day (2025) · Foldback (2027) | 2025年之前 · 分时段（2025年） · 出力回落（2027年） |
| Labels | Worst day of the month · Hours shown · Energy to charge · Foldback (Example) · From 2027 · Outage record from 2028 | 当月最严峻日 · 申报时段 · 充电所需电量 · 出力回落（示例） · 2027年起 · 2028年起计入停运记录 |

## 6. Add a battery

### caiso-08 — Why four hours · 为什么是四小时

| Item | Shot specification |
| --- | --- |
| Scene | Stored energy, in hours at full power, drawn against the four hours RA counts; the credited power reads out in HTML below the drawing |
| Feedback | Presets change the energy bands and the credited power: an Example two-hour battery is credited at half power, the play's duration at full power, an Example eight-hour battery at the same full power with more hours covered. "After foldback" trims every preset's credited power by an Example amount |
| Evidence and chart | CL-CAISO-05 and CL-CAISO-11 (rule); REPO-CAISO-LIVE design grid (‹bound: best duration›, ‹bound: build line›); REPO-CAISO-MODEL (`durationResponse.capacityDerating` flat from four hours) |
| Authoring check | The arithmetic applies the CPUC rule to an Example battery; it is not a project QC, and the foldback trim is not a modelled value. Under slice of day a longer battery can be shown for more hours, and buyers may value that; the model pays nothing for it. Write "comes closest", never "clears": every design is below the platform's yields at build cost. No drag-to-improve-return control |
| Mobile | The same toggles, wrapped; credited MW in the readout |
| Status | Rule `sourced`; design result `model-assumption`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why does this play build exactly four hours? | 为什么本方案恰好建设四小时？ |
| Copy | Below four hours, RA counts the battery as a smaller one. Above four, RA credits the same power, and the platform's model pays nothing more for the extra hours. On the platform's design test, ‹bound: best duration› hours is the best design here: ‹bound: build line› | 低于四小时，RA只按一台更小的电池计算；高于四小时，RA计入的功率不变，本平台的模型也不为额外的小时付费。按本平台的设计测试，‹bound: best duration›小时是这里的最佳设计：‹bound: build line› |
| Meaning | Four hours earns the full RA credit, and even that does not clear the platform's yields at build cost. | 四小时即可获得全额RA信用；即便如此，按建设成本测算仍达不到本平台的收益率要求。 |
| Marker | Fair evidence. What would change it: buyers paying more for hours beyond four under slice of day, or a battery price that moves the design grid's best duration. | 证据尚可。会改变判断的证据：在分时段机制下，买方愿为四小时以上的时长额外付费，或电池价格变化使设计表中的最优时长改变。 |
| Controls | 2 hours (Example) · ‹bound: play duration› hours · 8 hours (Example) · New · After foldback (Example) | 2小时（示例） · ‹bound: play duration›小时 · 8小时（示例） · 新电池 · 出力回落后（示例） |
| Labels | Stored energy, in hours at full power · Hours RA counts · Credited power · Full credit · Below full credit · Same credit, more hours · Example: 100 MW battery | 储存电能（满功率小时数） · RA计入的小时数 · 计入信用的功率 · 全额信用 · 低于全额信用 · 信用不变、可覆盖时段更多 · 示例：100MW电池 |

### caiso-09 — What the investor owns · 投资人买到的是什么

| Item | Shot specification |
| --- | --- |
| Scene | Exploded isometric cutaway as SVG layers, with fixed hotspots: battery, power conversion, transformer, grid connection, controls and safety, plus two document hotspots, deliverability status and RA contract |
| Feedback | The selected part is highlighted with its function and evidence status; cost categories only where the model exposes them, otherwise "Breakdown not available" |
| Evidence and chart | CL-CAISO-13 (SRC-CAISO-07, Appendix B, p. B-9; SRC-CAISO-17, §8.9); REPO-CAISO-MODEL (`evidenceLadder` in `src/markets/caiso/data.js`) |
| Authoring check | Generic geometry, not a site drawing, fire design or equipment list. A battery without deliverability has no net qualifying capacity to sell. Deliverability is allocated after the cluster studies, from what the transmission plan makes available; promise no timeline. The RA contract hotspot shows what to verify, never a tenor or price |
| Mobile | Static cutaway with a vertical hotspot list |
| Status | `market-rule`; `sourced`; asset evidence `missing`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What sits behind the word "battery" here? | 在这里，“电池”二字背后是什么？ |
| Copy | Equipment, and two documents that matter more. Battery modules, power conversion, a transformer, controls and the grid connection make the plant. Its RA value rests on a deliverability status from CAISO, allocated through its cluster studies, and on an RA contract with a retailer. Without deliverability, a battery cannot sell RA. | 设备之外，还有两份更要紧的文件。电池模组、功率变换系统、变压器、控制系统和并网连接构成电站本身；它的RA价值则取决于CAISO通过集群研究分配的可交付性资格，以及与售电主体签订的RA合同。没有可交付性资格，电池就无法出售RA。 |
| Meaning | An operating asset already holds both, which a new build must still win; this play enters as an ‹bound: entry route› asset. | 在运资产已经持有这两样东西，而新建项目仍须争取；本方案以‹bound: entry route›的形式进入。 |
| Marker | Fair evidence. What would change it: the asset's entry in CAISO's qualifying capacity list and its deliverability status, mapped to these parts. | 证据尚可。会改变判断的证据：在CAISO净合格容量清单中查到该资产的记录及其可交付性状态，并与各部件逐一对应。 |
| Controls | Equipment · Rights and obligations | 设备 · 权利与义务 |
| Hotspots | Battery modules: store energy as DC · Power conversion: turns DC into grid AC and back, and sets the MW · Transformer: steps the voltage up to the network · Grid connection: the right to export and import at this point · Deliverability status: what lets the MW count for RA · RA contract: who pays, for how many MW, and until when · Controls and safety: dispatch, protection and fire safety · Breakdown not available | 电池模组：以直流形式储存电能 · 功率变换系统：在直流与电网交流之间转换，决定MW规模 · 变压器：把电压升至电网电压 · 并网连接：在该接入点送电和受电的权利 · 可交付性资格：让这些MW得以计入RA的前提 · RA合同：谁付费、按多少MW付费、付到何时 · 控制与安全：调度、保护和消防 · 暂无分项数据 |

## 7. Who pays

### caiso-10 — Resource adequacy first · RA收入优先

| Item | Shot specification |
| --- | --- |
| Scene | The scene recedes; 2D payment paths for resource adequacy (retailer, contract, RA showing, offer into CAISO, monthly payment), energy (bid, dispatch, nodal settlement) and regulation (qualification, award, payment for capacity held) |
| Feedback | The selected route's steps, then how it is paid, its obligation and its evidence status |
| Evidence and chart | RA route: CL-CAISO-03, CL-CAISO-15 (REPO-CAISO-LIVE; SRC-CAISO-08, p. 70 for long contracts). Energy and regulation: CL-CAISO-14 (SRC-CAISO-11, p. 4; SRC-CAISO-12, p. 3). Shares from the market page (REPO-05, REPO-13) |
| Authoring check | The secured share and tenor are the model's, from a contract it assumes and nobody has verified; the RA price and tenor seeds sit under the open research gate (G41), so never call them observed. Name the tenor and what follows it. RA contracts are bilateral and private; there is no published clearing price. Energy is most of a battery's market revenue in DMM's observations, and regulation is crowded: never stack services at their individual maxima |
| Mobile | One route at a time, as stacked steps |
| Status | `model-assumption`; `model-assumes-route`, not `contract-verified`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Who pays this battery, and for what? | 谁为这台电池付费？为什么付费？ |
| Copy | A retailer pays first, under an RA contract: a monthly price for each kilowatt of qualifying capacity, with a duty to offer that capacity into CAISO's market. In the platform's model that contract is ‹bound: secured share› of revenue, counted as secured for ‹bound: secured tenor› years and unsecured after. Trading energy makes up most of the rest; regulation is small and crowded. | 首先付费的是售电主体，依据RA合同：按每千瓦合格容量每月付费，电池则有义务把这部分容量报入CAISO市场。在本平台模型中，这份合同占收入的‹bound: secured share›，前‹bound: secured tenor›年计为锁定收入，此后计为非锁定收入。其余收入大部分来自电能量交易；调频服务规模小且竞争拥挤。 |
| Meaning | The RA contract carries this play; a model assumption is not a signed contract, so the asset's own contract decides the case. | 支撑本方案的是RA合同；模型假设并不等于已签合同，因此决定投资逻辑的是资产自身的合同。 |
| Marker | Fair evidence. What would change it: the asset's executed RA contract, with its price, MW, term and counterparty. | 证据尚可。会改变判断的证据：资产已签署的RA合同及其价格、MW、期限和交易对手。 |
| Controls | Resource adequacy · Energy · Regulation | 资源充裕度 · 电能量 · 调频 |
| Labels | Paid · Obligation · Evidence | 计价 · 义务 · 证据 |
| RA route | Contract with a retailer → Shown for RA → Offered into CAISO → Paid monthly. Paid: per kilowatt of qualifying capacity, per month, at the contract price. Obligation: offer the capacity into CAISO's market. Evidence: Fair: the model's contract, not a signed one | 与售电主体签约 → 申报为RA → 报入CAISO市场 → 按月付费。计价：按每千瓦合格容量、每月计，价格依合同。义务：将这部分容量报入CAISO市场。证据：证据尚可：属模型假设的合同，并非已签合同 |
| Energy route | Bid → Dispatched → Paid per MWh at the node. Paid: per MWh at the nodal price. Obligation: deliver what is dispatched. Evidence: Fair: market rules sourced, capture modelled | 报价 → 获得调度 → 按节点电价以MWh结算。计价：按节点电价、每MWh计。义务：按调度指令出力。证据：证据尚可：市场规则已有出处，收入捕获为模型估算 |
| Regulation route | Qualified → Awarded → Paid for capacity held. Paid: per MW held ready. Obligation: follow the regulation signal. Evidence: Fair: batteries already supply most of it | 获得资质 → 中标 → 按预留容量付费。计价：按每MW待命计。义务：跟随调频信号。证据：证据尚可：电池已提供其中大部分 |

### caiso-11 — One battery, one set of megawatts · 一台电池，只有一份MW

| Item | Shot specification |
| --- | --- |
| Scene | A 2D allocation board linked to the station, with time across and power and energy up: RA capacity offered in the evening, charging at midday, trading and regulation in what is left |
| Feedback | The teaching board shows each conflict; project feasibility shows "unknown" unless constraints exist |
| Evidence and chart | SRC-CAISO-11, p. 28 (must-offer and charging rules) and p. 4 (regulation share); SRC-CAISO-09, Appendix A (spare capacity to charge storage); REPO-06 (stack feasibility) |
| Authoring check | Never add standalone maxima. Must-offer terms differ by RA type; keep the copy at "offer its RA capacity". The charging duty sits with the buyer's showing, not the battery. Teaching values need a calculation record |
| Mobile | Commitment cards and a short conflict explanation |
| Status | Kept from the WA pattern; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Can the battery sell RA, trade and provide services, all at full size? | 电池能否同时以满额出售RA、参与交易并提供辅助服务？ |
| Copy | No. The MW it sells as RA must be offered into the market, and its buyer must show spare energy to recharge it. Trading and regulation use what is left, and batteries already supply most of the regulation CAISO buys. | 不能。作为RA出售的那部分MW必须报入市场，买方还须申报足以为其充电的富余电量。交易和调频只能使用剩余部分，而CAISO采购的调频服务大部分已由电池提供。 |
| Meaning | Only compatible revenue belongs in the cash flow, which is how the model treats it. | 只有彼此兼容的收入才能计入现金流，模型正是这样处理的。 |
| Marker | Fair evidence. What would change it: a calculation record behind the teaching board's values. | 证据尚可。会改变判断的证据：教学示意板数值的计算记录。 |
| Controls | RA in the evening · Charging at midday · Trading · Regulation | 傍晚RA · 中午充电 · 交易 · 调频 |
| Labels | Headroom left · Conflict · Project constraints: unknown | 剩余余量 · 冲突 · 项目约束：未知 |

## 8. The investment

### caiso-12 — Bought at a price, not built · 按价格买入，而非新建

| Item | Shot specification |
| --- | --- |
| Scene | Two stations side by side: a new build under a crane (dashed) and an operating station holding its two documents, with a price tag |
| Feedback | "Build new" shows ‹bound: hold return› against ‹bound: target return›; "Buy operating" shows ‹bound: operating price ceiling› against ‹bound: build capex›. Both are values the market page already prints |
| Evidence and chart | CL-CAISO-15 (REPO-CAISO-LIVE: `row.econ.hold`, `row.investment.targetReturn`, `row.investment.capexPerMW`, `row.investment.operatingPurchase`); CL-CAISO-11 (the foldback cut is not in the model: REPO-CAISO-MODEL); CL-CAISO-08 and CL-CAISO-09 |
| Authoring check | The ceiling is the model's highest price for an operating asset at the operating target, before the foldback cut, which the model does not price: an upper bound to re-run once the cut is known. Never call it a market price or a seller's ask. The card's return and the thesis's typed return differ in basis (CF-CAISO-01). Reuse `projectFacts`' wording ("The return shown is for building it new"). No new figures |
| Mobile | Two cards stacked |
| Status | `model-assumption`; `sourced`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why buy an operating battery rather than build one? | 为什么收购在运电池，而不是新建？ |
| Copy | Because at build cost the numbers do not clear. A new four-hour project returns ‹bound: hold return›, below the fund's target of ‹bound: target return›. An operating asset that already holds deliverability and an RA contract meets the fund's operating target of ‹bound: operating target› only if bought for no more than ‹bound: operating price ceiling›, against ‹bound: build capex› to build new. The fund waits until the foldback cut shows how many MW that asset can still sell, then prices it. | 因为按建设成本测算，数字达不到要求。新建一个四小时项目的回报为‹bound: hold return›，低于基金‹bound: target return›的目标。已持有可交付性资格和RA合同的在运资产，只有在买入价不高于‹bound: operating price ceiling›时，才能达到基金‹bound: operating target›的在运资产目标回报；相比之下，新建成本为‹bound: build capex›。基金会等到出力回落下调落地、看清该资产还能出售多少MW之后，再为它定价。 |
| Meaning | The price paid sets the return: below the ceiling the asset clears the target; above it, it does not. | 买入价格决定回报：低于这一上限，资产可以达到目标回报；高于上限则不能。 |
| Marker | Fair evidence. What would change it: the asset's qualifying capacity after the 2027 cut, priced in the model. | 证据尚可。会改变判断的证据：资产在2027年下调后的合格容量，并已计入模型定价。 |
| Controls | Build new · Buy operating | 新建 · 收购在运资产 |
| Labels | The return shown is for building it new · Most the fund can pay for an operating asset | 所示回报为新建项目情景 · 基金收购在运资产的最高价格 |

### caiso-13 — What could weaken it · 什么会削弱它

| Item | Shot specification |
| --- | --- |
| Scene | Calm overview; further batteries drawn dashed along the evening; four factor cards |
| Feedback | Each factor names the line it affects and links to the matching Downside input, using the market page's existing inputs: fewer MW to the fixed-payment input (which approximates it, and says so), a softer RA price to the fixed-payment and trading inputs, contract expiry to the fixed-price term input, the price paid to the Bankable case |
| Evidence and chart | CL-CAISO-08, CL-CAISO-09, CL-CAISO-11, CL-CAISO-12, CL-CAISO-15; Downside definitions (REPO-05, `src/experience/downsideNarrative.js`) |
| Authoring check | A need for capacity does not guarantee this asset; a downside case is not a probability. Do not quote the RA benchmark values on the page. The trigger binds by label and month; its timing may slip (CF-CAISO-05), which goes to the analyst, not the page |
| Mobile | Four factor cards, then the links |
| Status | `proposed`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What would make this play less attractive? | 什么会削弱这个方案？ |
| Copy | Fewer MW to sell, a lower price for them, and paying too much. The foldback cut and, from 2028, accreditation on outage records can lower the MW an asset sells; more storage can keep RA prices soft; the contract ends and must be signed again; and the purchase price can take the margin. Next: ‹bound: next action› | 可出售的MW减少、这些MW的价格下降，以及买贵了。出力回落下调以及2028年起按停运记录核定容量，可能减少资产可出售的MW；更多储能可能让RA价格持续疲软；合同到期后需要重新签订；收购价格则可能吃掉利润空间。下一步：‹bound: next action› |
| Meaning | Watch the 2027 qualifying capacity and the RA price, then the price paid. | 要盯住的是2027年的合格容量和RA价格，其次是买入价格。 |
| Marker | Fair evidence. What would change it: the published 2027 qualifying capacity values and the CPUC's next RA price benchmark. | 证据尚可。会改变判断的证据：公布的2027年合格容量数值，以及CPUC下一期RA价格基准。 |
| Controls | Fewer MW · Softer RA price · Contract expiry · Price paid | MW减少 · RA价格走软 · 合同到期 · 买入价格 |
| Factor cards | Affects RA income; the fixed-payment input approximates it · Affects RA income before contracting; see the fixed-payment and trading inputs · Affects revenue after the term; see the fixed-price term input · Affects the return directly; see the Bankable case | 影响RA收入；固定收入输入项可近似反映 · 影响签约前的RA收入；见固定收入与交易输入项 · 影响合同期满后的收入；见固定价期限输入项 · 直接影响回报；见可融资方案 |
| Exits | Bankable case · Revenue · Execution · Downside · Compare with PJM and ERCOT | 可融资方案 · 收益拆解 · 执行步骤 · 下行风险 · 对比PJM与ERCOT |

## 9. Signature chart, binding and traceability

### Chart-CAISO-EVENING — the evening net peak against the battery fleet

| Field | Specification |
| --- | --- |
| Question | Where in the day does California now need capacity, and how much of that evening do batteries already carry? |
| Shot | caiso-05 (its thumbnail may recur in caiso-06 and caiso-08; never a second financial chart) |
| Layers | Median net load (demand minus wind and solar) on July–September business days: 2020 as a thin solid line and 2025 as a solid line, both observed. Median 2025 battery output on the same MW axis: discharge shaded above zero, charging lighter below. An Example band over the four highest 2025 net-load hours, labelled "the four hours a battery is credited for". The fleet label from ‹bound: fleet latest› |
| Axes | Hour of day, hour beginning, Pacific prevailing time on CAISO's clock; MW. Battery output and net load share one unit, so one axis |
| Data | SRC-CAISO-18: CAISO Today's Outlook history, daily `netdemand.csv` (Current demand, Net demand) and `fuelsource.csv` (Batteries, Solar). Method and results: CALC-CAISO-DAY in §11 |
| Registration | Not registered. `src/governance/datasets.js` has no CAISO dataset. The ETL's EIA-860M connector (`etl/sources/eia-860m.mjs`, public domain) feeds the project pipeline, not a time series. GAP-CAISO-DAY: a fixed-vintage profile like CALC-WA-DAY, refreshed after each summer with earlier vintages kept |
| Terms | CAISO's Terms of Use let website materials be used if notices are kept and the California ISO is credited (SRC-CAISO-19); CAISO's separate API terms claim ownership of CAISO data, so the analyst confirms that a derived public chart sits within the website terms. Fallback: EIA-930 (public domain, SRC-CAISO-20 and SRC-CAISO-21), only after its clock is corrected (CF-CAISO-06) |
| Price data | None. The chart needs no exchange or market price series. The RA benchmark in caiso-06 is regulator-published price data, shown as direction in text only |
| Misreading control | A median day, not a stress day; net load excludes battery output; the band is an Example, not a schedule or an RA showing; the 2020 line is observed, not a scenario |
| Fallback | Until GAP-CAISO-DAY closes: an unscaled Example with no numeric axes, tagged "Example", with the chart-fallback string |

### Source-to-shot mapping

| Shot | Claims → sources and locators | Chart or binding owner | Likely misreading prevented |
| --- | --- | --- | --- |
| caiso-00 | CL-CAISO-15 → REPO-CAISO-LIVE | Existing play card | The thesis's typed return shown beside the card's different headline |
| caiso-01 | CL-CAISO-02, CL-CAISO-03 → SRC-CAISO-01 §2.1, SRC-CAISO-02 §1, SRC-CAISO-03, SRC-CAISO-12 pp. 13–14 | Own map; no new figures | A cleared capacity price exists |
| caiso-02 | CL-CAISO-04 → SRC-CAISO-04 p. 1, SRC-CAISO-05 p. 4 | Scene only | Solar caused the 2020 outages |
| caiso-03 | CL-CAISO-05 → SRC-CAISO-07 p. B-9, SRC-CAISO-11 p. 28, SRC-CAISO-10 p. 19; SRC-CAISO-06 p. 2; H-CAISO-01 to H-CAISO-06 | Timeline bindings | A longer battery earns nothing at all; adopted 2027 effects shown as done |
| caiso-04 | CL-CAISO-04, CL-CAISO-06, CL-CAISO-07 → SRC-CAISO-05 p. 4, SRC-CAISO-08 pp. 2 and 70, SRC-CAISO-11 p. 4 | Evidence bindings | One cause for the outages; the order's technology mix taken as known |
| caiso-05 | CL-CAISO-07, CL-CAISO-16 → SRC-CAISO-11, SRC-CAISO-12, SRC-CAISO-18; CALC-CAISO-DAY | Chart-CAISO-EVENING | A median day read as a stress day; the Example band read as a dispatch |
| caiso-06 | CL-CAISO-08, CL-CAISO-09 → SRC-CAISO-12 pp. 13–14, SRC-CAISO-13 p. 1, SRC-CAISO-14, SRC-CAISO-15, SRC-CAISO-16 | Text drawer, no chart | "Largely met" read as a CPUC finding; benchmark read as a project price |
| caiso-07 | CL-CAISO-10 to CL-CAISO-12 → SRC-CAISO-09 App. A, SRC-CAISO-10 pp. 19–28, 48–51, 177, 197, SRC-CAISO-22 p. 12 | Teaching strip | A number for the cut; slice of day read as a change to the four-hour QC |
| caiso-08 | CL-CAISO-05, CL-CAISO-11 → rule sources; REPO-CAISO-LIVE design grid | Design result | Four hours "clears" at build cost |
| caiso-09 | CL-CAISO-13 → SRC-CAISO-07 p. B-9, SRC-CAISO-17 §8.9 | Cutaway | An energy-only connection can sell RA |
| caiso-10 | CL-CAISO-03, CL-CAISO-14, CL-CAISO-15 → SRC-CAISO-08 p. 70, SRC-CAISO-11 p. 4, SRC-CAISO-12 p. 3, REPO-CAISO-LIVE | Existing Revenue destination | The model's contract read as a signed one |
| caiso-11 | SRC-CAISO-11 pp. 4 and 28, SRC-CAISO-09 App. A, REPO-06 | Existing feasibility boundary | Services stacked at their maxima |
| caiso-12 | CL-CAISO-15, CL-CAISO-11 → REPO-CAISO-LIVE, REPO-CAISO-MODEL | `projectFacts` values | The ceiling read as a market price, or as already allowing for foldback |
| caiso-13 | CL-CAISO-08, CL-CAISO-09, CL-CAISO-11, CL-CAISO-12, CL-CAISO-15 → REPO-05 | Existing Bankable, Revenue, Execution and Downside | A downside read as a probability |

Reverse traceability: SRC-CAISO-01 to SRC-CAISO-03 → CL-CAISO-02/03 → H-CAISO-01 → caiso-01, caiso-03. SRC-CAISO-04/05 → CL-CAISO-04 → H-CAISO-03 → caiso-02, caiso-04. SRC-CAISO-06/07 → CL-CAISO-05 → H-CAISO-02 → caiso-03, caiso-08. SRC-CAISO-08 → CL-CAISO-06 → H-CAISO-03 → caiso-04, caiso-10. SRC-CAISO-09 → CL-CAISO-10 → H-CAISO-04 → caiso-07, caiso-11. SRC-CAISO-10/22 → CL-CAISO-11/12 → H-CAISO-05/06 → caiso-03, caiso-07, caiso-08, caiso-12, caiso-13. SRC-CAISO-11/12 → CL-CAISO-07/14 → caiso-04, caiso-05, caiso-10, caiso-11. SRC-CAISO-12 to SRC-CAISO-16 → CL-CAISO-08/09 → caiso-06, caiso-13. SRC-CAISO-17 → CL-CAISO-13 → caiso-09. SRC-CAISO-18 to SRC-CAISO-21 → CALC-CAISO-DAY → CL-CAISO-16 → Chart-CAISO-EVENING → caiso-05. REPO-CAISO-LIVE → CL-CAISO-15 → caiso-00, caiso-08, caiso-10, caiso-12, caiso-13. A replaced source therefore queues a finite set of shots, translations and labels.

## 10. G-1 record

| Review | Status and the analyst's judgement |
| --- | --- |
| Electricity mechanics | Pending: the four-hour QC and its slice-of-day showing; the reading of "largely met" from system observations; the foldback change and UCAP as two steps; deliverability as a condition of RA |
| Investment meaning | Pending: four hours by rule and by the design grid; the operating entry at the model's ceiling, before the cut is priced; the model's contract kept apart from a signed one; tenor and what follows it |
| English and Chinese | Pending: same meaning for qualifying capacity, deliverability, foldback, slice of day, must-offer and the operating target; all figures stay bound tokens |
| Signature chart | Pending: CALC-CAISO-DAY as the chart's method, CAISO's own data under its terms (or EIA-930 after a clock fix), and the Example fallback until registration |
| Script decision | **G-1 reviewed 1 November 2026; G-2 conditions retained. Analyst: sign off caiso-00 to caiso-13, or identify changes.** |
| Build boundary | Stop here. No application code, dataset registration, snapshot, model change, rendering, build, deployment or G-2 work in this task |

At G-1 the analyst is asked to confirm, in both languages:

1. The argument in §1, including the reading of the foldback trigger and that four-hour RA is "largely met" at the system level (CL-CAISO-08, an interpretation of observed facts).
2. The causal readings the story rests on: the four-hour rule shaped the fleet (caiso-03) and the 2021 order became mostly batteries (caiso-04, kept at Fair until the CPUC's count by technology is found).
3. Chart-CAISO-EVENING and CALC-CAISO-DAY: the method, the July–September business-day window, CAISO's Today's Outlook as the feed and whether its terms cover a derived public chart, or EIA-930 instead after its clock is corrected.
4. Each shot's marker and "What would change it" line: Strong for caiso-01, caiso-02, caiso-03 and caiso-07; Fair elsewhere; caiso-00 inherits the card's marker.
5. Whether caiso-06 may show the direction of the CPUC's RA benchmark in text, given the separate price-data review.
6. The Chinese drafts.

Found on the way, for the analyst rather than the story (no call, model, view or data is changed here):

- **CF-CAISO-01.** The thesis and `play.why` type a build-cost return from the design sweep, with the tax credit seeded at zero. The card's headline `row.econ.hold` is the investment summary's all-equity return with the US supply case and its credit. Both are below the target. The story binds the card.
- **CF-CAISO-05.** The play's next action and trigger say January 2027, but D.26-07-008 leaves the foldback default open, says QC changes may first appear in the 2027 RA year, and by 16 October 2026 the CPUC's resource database had not been changed to calculate the cut (SRC-CAISO-22). The cut may not be visible in January.
- **CF-CAISO-02.** The CAISO research tab says nothing published proposes moving the four-hour test. D.26-07-008 has since modified storage QC, flagged the four-hour eligibility requirement for its next track, and adopted counting across the day for storage of eight hours or more. "Credits exactly four hours" still holds for QC; the model's flat RA line above four hours is a modelling choice that slice of day does not fully mirror.
- **CF-CAISO-07.** The view's policy-stability reason says signed contracts keep their terms. The 2027 QC change applies to all storage, so an existing contract's sellable MW may fall even though its terms do not change. What each contract does then is a diligence item (GAP-CAISO-CONTRACT).
- **Research gate G41.** Public primary sources exist for the seeds it covers: the CPUC's RA price benchmark (SRC-CAISO-15), RA contract prices in the CPUC's RA Report (SRC-CAISO-16), DMM's observed battery revenues (SRC-CAISO-12, p. 3) and the at-least-ten-year contracts required by D.21-06-035 (SRC-CAISO-08, p. 70). These are leads for the separate model work, not inputs to this story; the price items fall under the analyst's price-data review.

Checks on this file, 31 October 2026: fourteen shots, each with the six specification rows and the five page-text rows in English and Simplified Chinese (caiso-00 has no Meaning line, as the conclusion); page text carries no figure outside a ‹bound› token except dates, source table and section numbers and values tagged Example; every ‹bound› token is listed in §1; no project, developer or counterparty is named; only this file changed.

## 11. Sources and claims

Canonical [sources, history, calculations and G-2 gaps](source-register.md#g1-caiso-evidence) and [claim ledger](market-narratives.md#g1-caiso-claims). IDs in the shots resolve there. The script owns scene and bilingual page copy; the registers own the evidence records.

## Analyst decisions — 1 November 2026

Authority: the analyst signed off the Chinese recommendations in this chat and authorised updates to the existing eight PRs. The numerical plan was approved for PJM, Poland and Italy. After a separate duration review, the analyst also approved Ireland’s six-hour candidate and Wait call, retaining assumed services revenue and appending the learning to history. The original research findings remain as evidence; the approved disposition governs the revised shot copy and closes the G-1 decision requests.

| Item | Approved disposition / retained gate |
| --- | --- |
| Argument / markers | Accept largely-met four-hour RA only as platform interpretation at Fair; the 2021 order becoming mainly batteries remains Fair. |
| Chart | Approve CALC-CAISO-DAY: same-season business-day medians, correct clocks and missing intervals. CAISO reuse must be cleared; EIA fallback needs the documented clock fix. Use an Example until those gates pass. |
| caiso-06 / CF-CAISO-02 | Withhold RA benchmark-price direction while rights are parked. Fix the stale research-tab claim that nothing proposes changing the four-hour test in a separate content PR. |
| Contract / Chinese | Signed contract wording does not freeze qualifying MW. Preserve #101’s corrected timing. Revised markers and bilingual copy approved. |

**Common build conditions.** Model labels bind existing result fields; no financial constants are typed into page copy. Observations, non-binding plans, model paths and teaching Examples remain visually distinct. A rights block is withheld or replaced by an unscaled Example, not downgraded to Thin observed data. Manual chart records retain primary URL, locator, vintage, units and arithmetic; no dataset is registered by this documentation PR. “Strong” assesses evidence, not investment quality. Shared source/claim consolidation follows the script merges.

**Final reconciliation:** shot copy, bindings, scopes and model dependencies have been reconciled to the approved separate changes. Exact-head validation and dependency merges remain release gates. Approval of an editorial choice does not close an unresolved source, contract, rights or numerical dependency.

**Financial basis.** Investment-summary IRRs use the existing after-tax nominal cash-flow layer, including its inflation convention. The design-grid comparison is a separate basis. Do not add inflation again to the investment return or treat assumed contract escalation as verified contractual entitlement.
