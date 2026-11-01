# PJM: Six-Chapter Storyboard

Pack: BESS-IX-2026-10-30; PJM research and script, 31 October 2026; shot layout v1.2  
Status: G-1 signed off 1 November 2026 and reconciled to the approved model/function changes. This is a G-1 script; G-2 construction, dataset and rights gates remain explicit. Merge only after dependency and exact-head checks pass.
Navigation: [Master plan](README.md) | [Narrative card](market-narratives.md#3-eighteen-market-candidate-story-cards) | [Evidence specification](evidence-and-content-specification.md) | [WA format](western-australia-storyboard.md) | [Sources and claims](#11-sources-and-claims)

## 1. Scope, argument and reading route

The story covers **PJM's regional capacity market**, the Reliability Pricing Model (RPM), as it pays a battery inside the PJM region. It argues for one conclusion: the platform's PJM call and play as the view store publishes them, read on `main` at `edcb39c` on 31 October 2026 (REPO-PJM-LIVE). For the infrastructure fund that is call **`wait`**, shown on the site as **Watch / 保持观察**, on **`pjm-cap-4h`** ("Capacity auction · 4h"), entered at ready-to-build, watching `pjm-capacity-auction-2029-30` and `pjm-backstop-filing-suspension-ends`. The content contract's anchor is `reviewedAgainst: { playRef: 'pjm-cap-4h', hours: 4, call: 'wait', on: '2026-10-31' }`. Other investor lenses carry other calls; this script explains the fund's.

The published thesis, in substance: the best-published capacity price on the platform, but secured one year at a time on a low reference return; four hours is the best design as accreditation erodes; wait for the next auction before pricing anything. The research supports that chain, with one correction to how "accreditation erodes" may be drawn (CL-PJM-16, CF-PJM-06):

1. PJM grew from the world's first continuing power pool, formed in 1927, into one grid and one regional capacity auction (CL-PJM-14).
2. Since the 2007-08 delivery year it has bought capacity in a forward auction, and each Base Residual Auction commits a single delivery year, June to May (CL-PJM-02).
3. Cold-weather failures turned capacity into a performance obligation: Capacity Performance from 2016, first used at scale in Winter Storm Elliott in December 2022. Since the 2025-26 auction PJM credits each resource only for what it adds in the riskiest hours (CL-PJM-07, CL-PJM-08).
4. Data-centre demand outran new supply. Every auction since 2026-27 has cleared at an administered price cap, and the 2027-28 and 2028-29 auctions fell short of the reliability requirement (CL-PJM-03 to CL-PJM-06).
5. A four-hour battery is credited for only part of its power, and that part is falling: lower for the December 2026 auction, and much lower in PJM's own indicative ratings for the first auctions after the cap ends (CL-PJM-16, CL-PJM-08, CL-PJM-09).
6. So the high price is secured one delivery year at a time, at a cap that ends after the 2029-30 auction, on a falling credit, and the reference return sits below the fund's target. On the platform's design test four hours is still the best capacity design (CL-PJM-10). Price nothing before the December auction. A multi-year backstop commitment open to batteries is what could change the case; it is accepted but suspended (CL-PJM-11).

Comprehension check: from the story alone, the user can say why a four-hour PJM capacity battery is a Watch. The price is high and fully published, but it is held at a cap and secured one delivery year at a time, and the credit for four-hour storage is falling. The December auction and the backstop ruling decide whether anything longer is on offer.

**Alternative explanation to keep in view.** The shortfall could close faster than the call assumes: 715 projects, storage the most numerous, entered PJM's first reformed study cycle in August 2026; PJM's backstop and bilateral deals target new supply; and PJM trimmed its near-term load forecast in January 2026. Ratings also rose between the 2026-27 and 2028-29 auctions, because they follow PJM's modelled risk, not storage volume alone. The analyst's own counterpoint is on the card: scarce deliverable rights in a system short of capacity can be worth more than the reference case shows.

**Disconfirming condition.** A multi-year commitment open to a four-hour battery at a price that clears the fund's target, or official ratings for 2030-31 and later that hold well above PJM's indicative path.

Scenes are fixed-view isometric SVG from the shared symbol kit, with 2D charts where the argument needs a chart. They show simplified topology, not a power-flow model, a site layout or project advice. Thirteen shots (`pjm-00` to `pjm-12`) make about five minutes of reading. Chapter links and ordinary scrolling work throughout, and nothing waits for an animation.

| Chapter | 章节 | Shots | What the reader can explain afterwards |
| --- | --- | --- | --- |
| Opening | 开篇 | pjm-00 | The call and the play, in one line |
| Origins | 起源 | pjm-01 | One regional grid and one capacity auction, and why the capacity price does not depend on the site |
| Historical choices | 历史选择 | pjm-02, pjm-03, pjm-04 | Capacity bought a year at a time; paid only if it performs in emergencies; credited only for what it adds |
| Today's tensions | 当下的矛盾 | pjm-05, pjm-06, pjm-07 | Demand outran supply; the price is held at a cap until 2029-30; a high price on a falling credit (signature chart) |
| Add a battery | 加入电池 | pjm-08, pjm-09 | Why four hours on the design test, and why the credit moves with winter risk |
| Who pays | 谁来付费 | pjm-10, pjm-11 | Capacity first, secured for one year; the backstop could lengthen that but is on hold |
| The investment | 投资 | pjm-12, then links | Why Watch, the two events that could change it, and where the numbers live (Bankable case, Revenue, Execution, Downside) |

### Bound fields

Every model figure on the page comes through one of these tokens. Values are given only so the analyst can review the script against the live case; they are never typed into copy. If the call or play changes, the play card updates itself and `reviewedAgainst` flags this script for review. The build names in brackets follow `src/markets/wa/storyBindings.js`.

| Token | Field the market page or briefing already reads | At check, 31 Oct 2026 |
| --- | --- | --- |
| ‹bound: call› (`call`) | `row.call` through `CALLS` in `src/experience/model.js`, shown by the call tag in `src/experience/pages.js` | `wait`, shown as Watch / 保持观察 |
| ‹bound: play› (`play`) | `playTitle(row.play, row.stage)` (`routeName` in `pages.js`) | Capacity auction · 4h · ready-to-build / 容量拍卖 · 4小时 · 具备开工条件 |
| ‹bound: play duration› (`playDuration`) | `row.play.hours` (also the market intro's "· 4H") | 4 |
| ‹bound: next action› (`nextAction`) | `row.play.action.text` (the Overview's next action) | Read the 2029/30 capacity auction in December 2026 for its price and four-hour accreditation; re-price nothing before it. |
| ‹bound: play evidence marker› | `row.evidence` (the card's marker) | Strong |
| ‹bound: hold return› (`holdReturn`) | `row.econ.hold`, which `opportunities()` sets from `row.investment.holdIRR` ("Base all-equity IRR") | 4.7% |
| ‹bound: target return› (`targetReturn`) | `row.econ.test.target` ("Investor target") | 12.1% |
| ‹bound: secured share› (`securedShare`) | `row.econ.secured`, from `row.investment.secured` ("Modelled fixed revenue") | 46.7%; the card's `share()` shows 47% |
| ‹bound: secured tenor› (`securedTenor`) | `row.econ.securedYears` ("Fixed revenue tenor") | 1 |
| ‹bound: decision reason› | `row.decision.reason` ("Why this priority") | The capacity market's design beyond the current price collar is not settled. |
| ‹bound: counterpoint› (`counterpoint`) | `row.decision.counterpoint` ("What limits conviction") | Scarce deliverable rights in a system short of capacity can be worth more than the reference case shows. |
| ‹bound: auction trigger› | Trigger `pjm-capacity-auction-2029-30`: `label` and `expected` in `HOME_BRIEFING.triggers` | Capacity auction for the 2029/30 delivery year · 2026-12 |
| ‹bound: backstop trigger date› (`backstopEnds`) | Trigger `pjm-backstop-filing-suspension-ends`: `expected` (label in the evidence drawer) | 2027-02-28 · FERC suspension of the Reliability Backstop filing ends |
| ‹bound: best duration› (`bestDuration`) | `HOME_BRIEFING.grids.pjm.byRoute.cap.best` | 4 |
| ‹bound: design durations› (`designDurations`) | `HOME_BRIEFING.grids.pjm.hours` | 4, 6, 8, 10 |
| ‹bound: design line› (`designLine`) | `HOME_BRIEFING.build`, PJM's `line` | PJM: nothing clears the platform's yields; capacity auction at 4h comes closest, at −$464k/MW. |

Evidence tokens such as ‹bound: class rating next auction›, ‹bound: indicative rating 2030-31› and ‹bound: backstop term› read dated source records, not model results. They are listed in [§9](#9-binding-chart-and-traceability).

The teaching battery is 100 MW at the play's duration, tagged "Example"; its presets are teaching values and never change the case (evidence specification §4).

### Rules for every shot

- **Figures.** Calls, durations, shares, returns and ratings in page copy come through bound tokens. Historical dates are sourced facts. Delivery years are written with a hyphen (2029-30), because the content contract reads a slash as a stray figure; the bound next action keeps the briefing's own spelling. In Chinese, a month without a day is written in characters (十二月), for the same reason.
- **Controls.** Teaching controls change only teaching state: era, auction year, duration preset, route or factor. The story has no underwriting controls. "Go to the investment case" links to the market page, which already hands the case to the Investment Lab.
- **Navigation.** Chapter and shot changes are history entries. Back, refresh, a language switch and opening or closing evidence keep the reader's place (`WP-04`).
- **Evidence.** Each shot shows one marker and one "What would change it" line, using the site's labels: Strong evidence (证据充分), Fair evidence (证据尚可), Thin evidence (证据单薄). A Strong marker assumes the analyst's review at G-1. The Authoring check row is for writers and reviewers and never appears on the page. Official forecasts and scenarios are dashed and labelled; teaching values are tagged "Example" (示例).
- **Two languages.** All page text is drafted below in English and Simplified Chinese with the same meaning. Source titles keep their original language.

Shared story strings:

| String | English | 简体中文 |
| --- | --- | --- |
| Story button | Story | 故事 |
| Navigation | Previous · Next · Chapters · Sources | 上一节 · 下一节 · 章节 · 来源 |
| Marker line | What would change it: | 会改变判断的证据： |
| Teaching tag | Example | 示例 |
| Forecast tag | Indicative (PJM, non-binding) | 指示性（PJM，不具约束力） |
| Scenario tag | Scenario | 情景 |
| Exit | Go to the investment case | 前往投资方案 |
| Stale call | This story was last reviewed against the call of ‹date›. | 本故事最近一次依据‹date›的投资判断复核。 |

## 2. Opening

### pjm-00 — The call

| Item | Shot specification |
| --- | --- |
| Scene | Small isometric thumbnail: a grid with a June-to-May delivery-year strip beneath it; no animation |
| Feedback | None; this shot is the conclusion |
| Evidence and chart | Play card fields from the view store through the briefing model (REPO-PJM-LIVE); CL-PJM-02 for "a single delivery year"; CL-PJM-08 and CL-PJM-09 for "a credit that is falling" |
| Authoring check | Never restate the call or a figure in prose. The view's thesis and `play.why` type a reference return that is not the card's headline (CF-PJM-01): copy neither. `wait` displays as Watch. A changed call or play updates the card and flags the story |
| Mobile | Play card full width; two buttons |
| Status | Proposed 31 Oct 2026; `sourced`; uses the existing play card; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What is the call here, and why should I read on? | 这里的投资判断是什么？为什么值得读下去？ |
| Copy | The existing play card: ‹bound: call›, ‹bound: play›, the figures the card already shows, ‹bound: next action›. Beneath it: "Why: the best-published capacity price on the platform, but secured a single delivery year at a time, on a credit that is falling." | 沿用现有投资方案卡：‹bound: call›、‹bound: play›、卡片已显示的各项数据、‹bound: next action›。卡片下方一行：“原因在于：这是本平台公开最充分的容量价格，但每次只能锁定一个交付年度，而计入的认证系数正在下降。” |
| Marker | The play's own marker, already on the card | 沿用方案卡上该方案自身的证据标记 |
| Controls | Start the story · Go to the investment case | 开始阅读 · 前往投资方案 |

## 3. Origins

### pjm-01 — One grid, one auction

| Item | Shot specification |
| --- | --- |
| Scene | The eastern United States from Natural Earth: the states PJM serves in whole or in part shaded and labelled approximate (ASSET-PJM-FOOTPRINT); one price tag across the region; the two import-limited zones of the 2029-30 parameters, in Virginia and northern Illinois, outlined faintly; fixed view |
| Feedback | "One price" lights the whole region with a single tag. "Zones that can split" outlines the zones PJM models separately and recalls the 2025-26 auction, when two zones cleared above the rest |
| Evidence and chart | CL-PJM-14 (SRC-PJM-22, paragraphs 1–4; SRC-PJM-23, p. 1); CL-PJM-03 (SRC-PJM-01, printed pp. 3 and 6; SRC-PJM-03, printed p. 3); SRC-PJM-04, printed p. 3, for the 2025-26 zone prices; SRC-PJM-13, printed p. 1, for the import limits |
| Authoring check | The single price holds because every auction since 2026-27 cleared at the cap; separate zone prices return when import limits bind. Shade "all or part" states and label the shading approximate. No sites, and no lines drawn as power flows. Investment meaning only: the capacity price is regional, energy revenue is nodal |
| Mobile | Same map; two large buttons; caption below |
| Status | Proposed; `sourced`; map asset not built (ASSET-PJM-FOOTPRINT) |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Which market is this, and what does a battery sell into? | 这是哪个市场？电池在这里向谁出售服务？ |
| Copy | PJM began in 1927 as the world's first continuing power pool. It now runs one grid, one energy market and one capacity auction from New Jersey to Illinois and North Carolina. Since the 2026-27 auction, the whole region has cleared at a single capacity price. | PJM始于1927年，是世界上第一个持续运作的电力联营体。如今，它在从新泽西到伊利诺伊、再到北卡罗来纳的广大区域内，运营一张电网、一个电能量市场和一场容量拍卖。自2026-27交付年度拍卖以来，整个区域均以统一的容量价格出清。 |
| Meaning | Capacity revenue here comes from one regional auction, not from the site; the site still decides energy revenue and the connection. | 这里的容量收入来自统一的区域拍卖，而非具体站址；但电能量收入和并网条件仍取决于站址。 |
| Marker | Strong evidence. What would change it: an auction in which an import-limited zone, such as Virginia or northern Illinois, clears above the rest of the region. | 证据充分。会改变判断的证据：某次拍卖中，弗吉尼亚或伊利诺伊北部等受输入能力限制的区域，出清价格高于区域其他部分。 |
| Controls | One price · Zones that can split | 统一价格 · 可能单独定价的区域 |
| Labels | PJM region (approximate) · Zones modelled separately · One clearing price | PJM区域（近似） · 单独建模的区域 · 统一出清价格 |
| Caption | Approximate. Outline: Natural Earth. Region: PJM. | 近似范围。轮廓：Natural Earth。区域：PJM。 |

## 4. Historical choices

### pjm-02 — Bought ahead, a year at a time

| Item | Shot specification |
| --- | --- |
| Scene | The same frame with a six-node timeline (H-PJM-01 to H-PJM-06) and a calendar strip: each auction a dot, each delivery year a June-to-May block; selecting a node changes one layer |
| Feedback | Only the selected layer changes; the outlook node is dashed. The gap between auction and delivery shrinks for the compressed auctions and widens again for 2030-31 |
| Evidence and chart | Event: CL-PJM-02 (SRC-PJM-17, p. 2; SRC-PJM-05, Table 1; SRC-PJM-01, printed p. 5, note on the compressed schedule; SRC-PJM-14). Interpretation: H-PJM-02, proposed. Nodes: H-PJM-01 to H-PJM-06 |
| Authoring check | Keep the event (first delivery year 2007-08; one delivery year per auction) apart from the interpretation (bought ahead because new plants take years). A cleared commitment is not a contract with a tenor; incremental auctions adjust the same year and never extend it. No invented dates; the outlook node is dashed |
| Mobile | Vertical node list; one calendar strip |
| Status | Event `sourced`; interpretation `proposed`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | How does PJM pay for reliability? | PJM如何为可靠性付费？ |
| Copy | Through an auction held ahead of time. Since the 2007-08 delivery year, PJM has bought capacity in a Base Residual Auction, and each auction buys a single delivery year, from June to May. The next year has to clear again in the next auction. | 通过提前举行的拍卖。自2007-08交付年度起，PJM通过基础剩余容量拍卖采购容量，每次拍卖只采购一个交付年度，即当年六月至次年五月。下一年的容量必须在下一次拍卖中重新出清。 |
| Meaning | A cleared battery holds its capacity price for that year only, which is why this play counts capacity as secured for ‹bound: secured tenor› year and treats later years as scenarios. | 出清的电池只在该年度内锁定容量价格；因此本方案仅把‹bound: secured tenor›年的容量收入计为锁定收入，其后各年均按情景处理。 |
| Marker | Strong evidence. What would change it: a rule that commits auction capacity for more than one delivery year, such as the backstop taking effect for the project. | 证据充分。会改变判断的证据：出现把拍卖容量承诺延长至多个交付年度的规则，例如兜底采购对该项目生效。 |
| Controls | Select a node · Constraint · Choice · What remains · Effect today | 选择节点 · 约束 · 选择 · 遗留 · 今日影响 |

Timeline nodes (page text):

| Node | Field | English | 简体中文 |
| --- | --- | --- | --- |
| 1927 · A power pool | Constraint | Neighbouring utilities wanted to share their power plants. | 相邻的电力公司希望共享各自的发电厂。 |
| | Choice | Join their systems in a pool. | 把各自的系统联成一个联营体。 |
| | What remains | One operator for a large region spanning many states. | 一个统一调度、横跨多个州的大区域运营机构。 |
| | Effect today | One capacity auction, and lately one capacity price, across the region. | 全区域只有一场容量拍卖，近来也只有一个容量价格。 |
| 2007 · Capacity bought ahead | Constraint | New plants take years to build, so reliability has to be bought before it is needed. | 新电厂建设需要数年，可靠性必须提前买下。 |
| | Choice | A forward auction for each delivery year: the Reliability Pricing Model. | 按交付年度举行远期拍卖，即可靠性定价模型。 |
| | What remains | The Base Residual Auction. | 基础剩余容量拍卖。 |
| | Effect today | Secured capacity revenue lasts a single delivery year. | 锁定的容量收入只覆盖一个交付年度。 |
| 2016 · Paid to perform | Constraint | Many plants failed in the 2014 Polar Vortex. | 2014年极地涡旋期间大量机组失灵。 |
| | Choice | Capacity Performance: a charge for any resource that falls short in an emergency. | 容量绩效规则：紧急状态下未能履约的资源须缴纳罚款。 |
| | What remains | Performance Assessment Intervals and their charges. | 绩效评估时段及相应罚款。 |
| | Effect today | A cleared battery must deliver in emergencies, including long winter ones. | 出清的电池必须在紧急状态下履约，包括持续较长的冬季紧急状态。 |
| 2022 to 2024 · Winter risk sets the credit | Constraint | In Winter Storm Elliott, in December 2022, generators failed in the cold on a large scale. | 2022年末的冬季风暴Elliott期间，大量机组在严寒中失灵。 |
| | Choice | Credit every resource for what it adds in the riskiest hours, approved by FERC in January 2024. | 按每种资源在风险最高时段的边际贡献核定认证系数，于2024年一月获FERC批准。 |
| | What remains | A class rating set before each auction. | 每次拍卖前核定的类别核定值。 |
| | Effect today | Storage is judged on long winter events, and its credit is falling. | 储能按持续较长的冬季事件接受评估，其认证系数正在下降。 |
| 2025 to 2026 · Demand outruns supply | Constraint | Data-centre load grew faster than new supply. | 数据中心负荷增长快于新增供给。 |
| | Choice | Cap and floor the price through the 2029-30 auction, and propose a backstop procurement. | 为截至2029-30交付年度的拍卖设定价格上下限，并提出兜底采购。 |
| | What remains | A capped price, and auctions that fell short of the reliability requirement. | 受上限约束的价格，以及低于可靠性需求的拍卖结果。 |
| | Effect today | The high price is a ceiling, secured a single year at a time. | 高价是上限，且每次只能锁定一年。 |
| Outlook (dashed) · After the cap | Constraint | No cap or floor is approved after the 2029-30 auction. | 2029-30交付年度拍卖之后，尚无获批的价格上下限。 |
| | Choice | None yet: an outlook, not a decision. The backstop is suspended, and the rules for later auctions are open. | 尚无决定：这是展望，而非决策。兜底采购被中止，此后拍卖的规则仍未确定。 |
| | Effect today | The case waits for the December auction and the backstop ruling. | 投资方案须等待十二月的拍卖结果和兜底采购的裁定。 |

### pjm-03 — Paid to perform in the cold

| Item | Shot specification |
| --- | --- |
| Scene | The same grid at night in winter: plants with outage markers, the Example battery with a state-of-charge bar, and an emergency flag |
| Feedback | "2014 Polar Vortex" and "Winter Storm Elliott" each show the outage layer and the rule that followed; "Show the obligation" marks the Performance Assessment Interval and the charge |
| Evidence and chart | CL-PJM-07 (SRC-PJM-21, Executive Summary, "Market Outcomes", PDF p. 9); the scale of the Elliott charges stays in the evidence drawer |
| Authoring check | Charges apply only in Performance Assessment Intervals, which PJM's emergency actions trigger; do not imply daily penalties or a bonus a battery would earn. The 2014 link is PJM's own reading (SRC-PJM-21). The state-of-charge bar is Example; no event trace is drawn as observed |
| Mobile | Two panels (2014, 2022) and the obligation card |
| Status | `historical-fact`, `market-rule`; `sourced`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What does a capacity resource promise in PJM? | 在PJM，容量资源承诺了什么？ |
| Copy | To deliver when the grid is in trouble. After many plants failed in the 2014 Polar Vortex, PJM brought in Capacity Performance rules in 2016: a resource that falls short during an emergency pays a charge. Winter Storm Elliott, in December 2022, was their first wide-scale use. | 在电网告急时如约供电。2014年极地涡旋期间大量机组失灵，PJM随后于2016年推出“容量绩效”规则：紧急状态下未能履约的资源须缴纳罚款。2022年末的冬季风暴Elliott是这套规则首次大范围实施。 |
| Meaning | For a battery the obligation falls in winter emergencies that can last for days, so its value depends on how long it can keep delivering. | 对电池而言，这项义务集中在可能持续数日的冬季紧急状态，因此其价值取决于它能持续供电多久。 |
| Marker | Strong evidence. What would change it: a change to the Capacity Performance charges, or to the emergencies that trigger them. | 证据充分。会改变判断的证据：容量绩效罚款规则，或触发罚款的紧急状态规则发生变化。 |
| Controls | 2014 Polar Vortex · Winter Storm Elliott · Show the obligation | 2014年极地涡旋 · 冬季风暴Elliott · 显示履约义务 |
| Labels | Forced outage · Emergency (Performance Assessment Interval) · Example: battery state of charge | 强迫停运 · 紧急状态（绩效评估时段） · 示例：电池荷电状态 |

### pjm-04 — Credited for what it adds

| Item | Shot specification |
| --- | --- |
| Scene | Physical layer fixed: an Example 100 MW battery at the play's duration. An overlay splits nameplate into credited and uncredited power; a small bar set shows the storage classes by duration at the next auction |
| Feedback | "Nameplate · Credited" redraws the bar from the Example size times ‹bound: class rating next auction›; "By duration" shows the class ratings for the next auction |
| Evidence and chart | CL-PJM-08 (SRC-PJM-04, printed pp. 3–4; SRC-PJM-12, on FERC's approval of 30 January 2024 in ER24-99; SRC-PJM-06, table); SRC-PJM-09 for a final delivery-year rating that differed from the auction rating |
| Authoring check | An ELCC class rating is PJM's model result, not a test of the battery. Ratings before 2025-26 used another method (SRC-PJM-12) and stay off this shot. A rating is set for each auction and can be revised for the delivery year. Credited MW equals nameplate times rating only as a teaching calculation on the Example battery |
| Mobile | Two bars, then a duration list |
| Status | `market-rule`; `sourced`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | If I own a ‹bound: play duration›-hour battery, how much of it is paid for capacity? | 如果我拥有一台‹bound: play duration›小时电池，其中多少容量能获得付费？ |
| Copy | Only part of its power. Since the 2025-26 auction, PJM credits every resource for what it adds in the hours of greatest risk. For the next auction a ‹bound: play duration›-hour battery is credited ‹bound: class rating next auction› of its power; longer batteries are credited more. | 只有部分功率。自2025-26交付年度拍卖起，PJM按每种资源在风险最高时段的边际贡献核定认证系数。在下一次拍卖中，‹bound: play duration›小时电池按其功率的‹bound: class rating next auction›计入；时长更长的电池计入比例更高。 |
| Meaning | A battery is paid the auction price on its credited power only, so a lower credit cuts revenue even when the price holds. | 电池只能按计入的功率获得拍卖价格，因此即使价格不变，认证系数下降也会减少收入。 |
| Marker | Strong evidence. What would change it: a FERC-approved change to how PJM accredits storage. | 证据充分。会改变判断的证据：经FERC批准的PJM储能认证方法变更。 |
| Controls | Nameplate · Credited · By duration | 铭牌功率 · 计入功率 · 按时长 |
| Labels | Example: 100 MW battery · Credited MW · Class rating, next auction · ‹bound: play duration›-hour storage | 示例：100MW电池 · 计入的MW · 下一次拍卖的类别核定值 · ‹bound: play duration›小时储能 |

## 5. Today's tensions

### pjm-05 — Demand outran supply

| Item | Shot specification |
| --- | --- |
| Scene | Daylight grid with data-centre blocks arriving at substations and small supply additions; a two-bar panel for each auction, requirement against cleared, the gap shaded; projects waiting at a gate for the connection queue |
| Feedback | "2027-28 auction" and "2028-29 auction" switch the bars (bound MW). "Where the demand comes from" opens PJM's and the Market Monitor's attribution as bound shares. The queue layer reads its bound labels |
| Evidence and chart | Event: CL-PJM-04 (SRC-PJM-02, printed p. 3; SRC-PJM-01, printed pp. 3–4; SRC-PJM-17, p. 2). Interpretation: CL-PJM-05 (SRC-PJM-17, pp. 2–3; SRC-PJM-19; SRC-PJM-20, slides 4 and 6; SRC-PJM-24; SRC-PJM-25). Queue: CL-PJM-15 (SRC-PJM-25) |
| Authoring check | The event (cleared short, at the cap) and the interpretation (data-centre load as the driver, in PJM's and the Market Monitor's reading) stay separate claims. PJM says a shortage "does not necessarily mean" it cannot serve load: no blackout imagery. PJM trimmed its near-term forecast in January 2026, so growth is a forecast, not an observation. Queue projects are applications, not supply |
| Mobile | Bars stacked; attribution and queue as two cards |
| Status | Event `sourced`; interpretation `sourced` as attributed; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why is the capacity price so high? | 为什么容量价格这么高？ |
| Copy | Demand is growing faster than new supply, led by data centres. In December 2025, for the first time, an auction cleared well short of PJM's reliability requirement; the July 2026 auction fell short again. Both cleared at the price cap. | 需求增长快于新增供给，数据中心是主要推手。2025年底，拍卖出清量首次明显低于PJM的可靠性需求；2026年七月的拍卖再次出现缺口。两次拍卖均以价格上限出清。 |
| Meaning | The scarcity is real, but the price a battery sees is a ceiling, not what the auction would otherwise have cleared. | 稀缺是真实的，但电池看到的价格是上限，而不是拍卖本来会出清的价格。 |
| Marker | Strong evidence. What would change it: an auction that meets the full reliability requirement below the cap. | 证据充分。会改变判断的证据：某次拍卖在上限以下出清并满足全部可靠性需求。 |
| Controls | 2027-28 auction · 2028-29 auction · Where the demand comes from | 2027-28拍卖 · 2028-29拍卖 · 需求从何而来 |
| Labels | Reliability requirement · Cleared · Shortfall · Price cap · New supply waiting to connect | 可靠性需求 · 已出清 · 缺口 · 价格上限 · 等待并网的新增供给 |
| Caption | Sources: PJM Base Residual Auction reports for 2027-28 and 2028-29; data-centre attribution from PJM and PJM's Independent Market Monitor. | 来源：PJM 2027-28与2028-29交付年度基础剩余容量拍卖报告；数据中心的影响分析来自PJM及其独立市场监察机构。 |

### pjm-06 — A price held at a cap

| Item | Shot specification |
| --- | --- |
| Scene | The scene recedes into a 2D teaching diagram: the auction's sloping demand curve with the cap–floor band, and the supply stack meeting the cap; a dashed curve for PJM's simulation without the cap and floor |
| Feedback | "With the cap" and "Without it" switch the clearing point; the simulated price is a bound label tagged as PJM's simulation |
| Evidence and chart | CL-PJM-06 (SRC-PJM-15, paragraphs 1–2 and pp. 7–8; SRC-PJM-16; SRC-PJM-13, printed pp. 1 and 4); CL-PJM-03 (SRC-PJM-01, printed p. 3 and Appendix, printed p. 17) |
| Authoring check | The curve is schematic: no axis values except bound labels. The cap and floor cover four auctions, 2026-27 to 2029-30; none is approved after that at check, so later years are dashed with no price. PJM's simulation estimates one auction without the cap; it is not a forecast for 2030-31. The 2029-30 curve may still be adjusted before the auction (SRC-PJM-13, printed p. 1) |
| Mobile | Diagram full width; two buttons |
| Status | `market-rule`; `sourced`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Is that a market price? | 这是市场形成的价格吗？ |
| Copy | Only partly. Since the 2026-27 auction, a cap and floor have held the price in a band. PJM proposed them to settle a complaint by Pennsylvania; FERC approved them in April 2025, and in April 2026 approved their extension through the 2029-30 auction. PJM's own simulation of the July 2026 auction without them cleared far higher. | 只能算部分是。自2026-27交付年度拍卖起，价格上下限把价格限定在一个区间内。这一上下限是PJM为解决宾夕法尼亚州的申诉而提出的，2025年四月获FERC批准；2026年四月，FERC又批准将其延长至2029-30交付年度拍卖。PJM对2026年七月拍卖的模拟显示，若没有上下限，出清价格将远高于此。 |
| Meaning | Today's price is a ceiling set by settlement. No cap or floor is approved after the 2029-30 auction, so the price for later years could move either way. | 当前价格是和解协议设定的上限。2029-30交付年度拍卖之后尚无获批的上下限，因此此后各年的价格可能上行，也可能下行。 |
| Marker | Strong evidence. What would change it: a FERC-approved cap, floor or other price rule for the 2030-31 auction. | 证据充分。会改变判断的证据：FERC批准适用于2030-31交付年度拍卖的价格上限、下限或其他价格规则。 |
| Controls | With the cap · Without it (PJM simulation) | 有上下限 · 无上下限（PJM模拟） |
| Labels | Demand curve · Cap · Floor · Cleared at the cap · Simulation without cap and floor | 需求曲线 · 上限 · 下限 · 以上限出清 · 无上下限模拟 |

### pjm-07 — A high price on a falling credit (signature chart)

| Item | Shot specification |
| --- | --- |
| Scene | The same grid at dusk; the chart takes the frame |
| Feedback | Signature chart Chart-PJM-PRICE-ELCC ([§9](#chart-pjm-price-elcc--signature-chart-contract)). Upper panel: the RTO clearing price by delivery year, the cap–floor band for capped years, the 2029-30 band marked "Auction pending", and later years empty and labelled "No cap approved". Lower panel: the rating of the play's storage class, solid for auction ratings from 2025-26, dashed for PJM's indicative ratings from 2030-31. A bracket under each bar reads "One delivery year" |
| Evidence and chart | CL-PJM-16 (corrected), CL-PJM-03, CL-PJM-08, CL-PJM-09; SRC-PJM-01 to SRC-PJM-11, SRC-PJM-13, SRC-PJM-14; GAP-PJM-BRA |
| Authoring check | Two panels, two units, one shared axis: no dual axis, and no price-times-rating line past the cleared years. Indicative ratings are PJM's and non-binding: label them. No rating points before 2025-26 (the method changed). Do not draw the platform's renewal path here; it differs from PJM's (CF-PJM-03). The next price is unknown until its results date |
| Mobile | Panels stacked on the shared axis; a table view with the same values |
| Status | Chart method `proposed`; data `sourced`, not registered (GAP-PJM-BRA); price series `rights-unresolved`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | If the price is so high, why wait? | 既然价格这么高，为什么还要等待？ |
| Copy | Because the price is set a single delivery year at a time, and the credit is falling. For the next auction a ‹bound: play duration›-hour battery is credited ‹bound: class rating next auction›. PJM's indicative ratings put it at ‹bound: indicative rating 2030-31› for 2030-31, the first auction with no cap approved, and lower again in later years. | 因为价格每次只锁定一个交付年度，而认证系数正在下降。在下一次拍卖中，‹bound: play duration›小时电池按‹bound: class rating next auction›计入；按PJM的指示性核定值，2030-31交付年度（首个尚无获批价格上限的拍卖）将降至‹bound: indicative rating 2030-31›，此后还会继续走低。 |
| Meaning | The credited power a battery can sell is set to shrink just as the cap ends, so the next auctions, not today's price, decide its value. | 恰在价格上限到期之际，电池可出售的计入功率却将缩水；因此决定其价值的是接下来的几次拍卖，而非当前价格。 |
| Marker | Fair evidence. What would change it: ratings for the 2030-31 auction, which PJM is due to post in January 2027, well above PJM's indicative value. | 证据尚可。会改变判断的证据：PJM预计于2027年一月公布的2030-31交付年度拍卖核定值明显高于其指示性数值。 |
| Controls | Price · Credit · Show PJM's indicative ratings | 价格 · 认证系数 · 显示PJM指示性核定值 |
| Labels | Clearing price, $/MW-day · Cap and floor · ‹bound: play duration›-hour storage rating · Indicative (PJM, non-binding) · Auction pending · No cap approved · One delivery year | 出清价格（美元/MW·日） · 价格上下限 · ‹bound: play duration›小时储能核定值 · 指示性（PJM，不具约束力） · 拍卖待举行 · 尚无获批上限 · 一个交付年度 |
| Caption | Prices: PJM Base Residual Auction reports. Ratings: PJM's ELCC class ratings for each auction; later years from PJM's preliminary ratings of 4 September 2026, which are non-binding. | 价格：PJM基础剩余容量拍卖报告。核定值：PJM各次拍卖的ELCC类别核定值；后续年度取自PJM于2026年9月4日发布的初步核定值，不具约束力。 |

## 6. Add a battery

### pjm-08 — Why this duration

| Item | Shot specification |
| --- | --- |
| Scene | Station cutaway: the same power equipment with energy blocks for each duration in the design grid; beside it, each class's credited share at the next auction and a qualitative capital stack |
| Feedback | Each duration preset grows the energy blocks and the capital stack and shows its class rating; "Show the design test" highlights the grid's best cell and its bound line |
| Evidence and chart | CL-PJM-10 (SRC-PJM-06, table; REPO-PJM-LIVE: `HOME_BRIEFING.grids.pjm`, the `build` line, `comparison.durationResponse`); CF-PJM-03 |
| Authoring check | Best is by value per MW, not by return; every capacity design is below the platform's yields, which the bound design line says. The model prices the 2028-29 class ratings and scales one renewal path for every duration, while PJM's indicative path widens the gap between short and long classes (CF-PJM-03): the copy claims only what the grid says today. If ‹bound: best duration› ever differs from the play's duration, the "so" in the copy no longer holds and the shot is queued for review. Never say the extra hours are unpaid |
| Mobile | Duration cards, then the design line |
| Status | `model-assumption`; `sourced`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why this duration? | 为什么是这个时长？ |
| Copy | Longer batteries receive more capacity credit but cost more to build. The design test compares each duration’s own indicative renewal credit at the model’s unchanged price scenario. Its best capacity duration is ‹bound: best duration› hours; the current play is ‹bound: play duration› hours. Every displayed design still needs to pass the fund’s target test. | 更长时长可以获得更多计入容量，但建设成本更高。设计测试在模型既定价格情景下，分别采用各时长自身的参考续期计入比例。容量路径的最优时长为‹bound: best duration›小时，当前方案为‹bound: play duration›小时。所有展示的设计仍须通过基金目标回报检验。 |
| Meaning | A higher credited share is valuable only relative to its extra capital cost; indicative credit remains non-binding. | 更高计入比例的价值须与额外资本投入比较；参考计入比例仍不具约束力。 |
| Marker | Fair evidence. What would change it: a design test run on PJM's indicative ratings, or a battery price, that moves the best duration. | 证据尚可。会改变判断的证据：以PJM指示性核定值重新运行的设计测试，或电池价格变化，使最优时长改变。 |
| Controls | One option for each duration in ‹bound: design durations› · Show the design test | 按‹bound: design durations›逐一设置时长选项 · 显示设计测试 |
| Labels | Credited share, next auction · More energy · More capital · Design test: ‹bound: design line› | 下一次拍卖的计入比例 · 更多电量 · 更多资本 · 设计测试：‹bound: design line› |

### pjm-09 — The credit follows the risk

| Item | Shot specification |
| --- | --- |
| Scene | A cold, two-day event on the same grid: the Example battery discharges on the first evening, cannot recharge overnight and is empty on the second day. Beneath it, a year selector shows the Example battery's credited MW for the next auction and for PJM's indicative years |
| Feedback | Year buttons redraw the credited MW from the Example size times the bound rating; indicative years are dashed. Under reduced motion the event shows as two still frames |
| Evidence and chart | CL-PJM-09 (SRC-PJM-11, discussion pp. 1–2 and 7–8, and the table); CL-PJM-08 (SRC-PJM-09, final 2026-27 ratings above the auction ratings); SRC-PJM-17, p. 13 (accredited value may change from year to year) |
| Authoring check | Ratings can rise as well as fall: they rose from the 2026-27 to the 2028-29 auction. The indicative path rests on a vendor's resource forecast, and PJM says it will likely differ from the official ratings. The two-day event is an Example of PJM's explanation, not a modelled dispatch. Do not state what happens to a committed battery whose rating falls; those deficiency rules are not sourced here |
| Mobile | Two still frames, then the year list |
| Status | `official-plan` (indicative); `sourced`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why is the credit falling? | 为什么认证系数在下降？ |
| Copy | Because PJM's riskiest hours have moved into winter, and winter emergencies can last for days. A battery that empties on the first cold evening cannot recharge if demand stays high through the night. PJM's indicative ratings show the credit for every storage class falling over the period to 2042-43, the shortest batteries most. | 因为PJM风险最高的时段已转向冬季，而冬季紧急状态可能持续数日。电池若在第一个寒冷的傍晚放空，而夜间需求居高不下，就无法再充电。PJM的指示性核定值显示，截至2042-43交付年度，各类储能的认证系数都将下降，时长最短的电池降幅最大。 |
| Meaning | A credit set for each auction makes long-run capacity revenue an assumption, not a fact. | 认证系数按每次拍卖重新核定，因此长期容量收入只是假设，而非事实。 |
| Marker | Fair evidence. What would change it: official ratings for later auctions that stop falling, or a change in how PJM models winter risk. | 证据尚可。会改变判断的证据：后续拍卖的正式核定值不再下降，或PJM对冬季风险的建模方式改变。 |
| Controls | Next auction · 2030-31 (indicative) · 2035-36 (indicative) · Example battery | 下一次拍卖 · 2030-31（指示性） · 2035-36（指示性） · 示例电池 |
| Labels | Example: 100 MW battery · Credited MW · Indicative (PJM, non-binding) · Winter emergency · Cannot recharge | 示例：100MW电池 · 计入的MW · 指示性（PJM，不具约束力） · 冬季紧急状态 · 无法充电 |

## 7. Who pays

### pjm-10 — Capacity first, one year at a time

| Item | Shot specification |
| --- | --- |
| Scene | The scene recedes; 2D payment paths for capacity (cleared, committed for the delivery year, deliver in emergencies, paid per day), energy (offered, dispatched, paid at the node) and Regulation (offered, assigned, paid) |
| Feedback | The selected route's steps, then how it is paid, its obligation and its evidence status |
| Evidence and chart | Capacity: CL-PJM-13 (SRC-PJM-26, slide 2; SRC-PJM-17, pp. 2 and 8), CL-PJM-02, CL-PJM-07. Share and tenor: REPO-PJM-LIVE (`row.econ.secured`, `row.econ.securedYears`). Energy and Regulation: settlement clauses not extracted |
| Authoring check | Name the secured tenor and what follows it. The secured share is the model's, on first-year revenue, and the project has no commitment until it clears. Do not show the current fleet's Regulation earnings; the platform treats them as unavailable to a new entrant (REPO-PJM-LIVE, `src/markets/pjm/comparison.js`). Capacity is paid on credited MW, not nameplate. A cleared commitment is not a contract with a tenor |
| Mobile | One route at a time as stacked steps |
| Status | Capacity route `sourced`; energy and Regulation `mechanism-exists`, clauses pending; `model-assumes-route`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Who pays this battery, and for what? | 谁为这台电池付费？为什么付费？ |
| Copy | Capacity first. Electricity suppliers pay through PJM, day by day through the delivery year, for capacity that cleared the auction, and the battery must deliver in emergencies. In this play capacity is ‹bound: secured share› of first-year modelled revenue. The model counts it as secured for ‹bound: secured tenor› year and unsecured after; a real project holds that year only once it has cleared an auction. Energy trading and Regulation, both merchant, make up the rest. | 容量收入优先。售电主体通过PJM，在整个交付年度内按日为拍卖中出清的容量付费；电池须在紧急状态下履约。在本方案中，容量收入占首年模型收入的‹bound: secured share›。模型仅将其在‹bound: secured tenor›年内计为锁定收入，此后为非锁定收入；实际项目只有在拍卖中出清后，才真正拥有这一年的收入。其余收入来自电能量交易和调频，均为市场化收入。 |
| Meaning | The secured part of this play lasts a single delivery year; everything after it depends on auctions not yet held. | 本方案的锁定收入只覆盖一个交付年度；此后的一切都取决于尚未举行的拍卖。 |
| Marker | Fair evidence. What would change it: the settlement clauses for the energy and Regulation routes; the capacity route is already sourced. | 证据尚可。会改变判断的证据：电能量和调频两条路径的结算条款；容量路径已有出处。 |
| Controls | Capacity · Energy · Regulation | 容量 · 电能量 · 调频 |
| Labels | Paid · Obligation · Evidence | 计价 · 义务 · 证据 |
| Capacity route | Cleared in the auction → Committed for the delivery year → Deliver in emergencies → Paid per day. Paid: the auction price, per MW of credited capacity, per day. Obligation: deliver during emergencies, or pay a charge. Evidence: rules sourced | 拍卖出清 → 承诺该交付年度 → 紧急状态下履约 → 按日付费。计价：按拍卖价格，每MW计入容量、每日计。义务：紧急状态下履约，否则缴纳罚款。证据：规则已有出处 |
| Energy route | Offered → Dispatched → Paid at the node. Paid: per MWh at the nodal price. Obligation: deliver what is dispatched. Evidence: settlement clauses pending | 报价 → 获得调度 → 按节点电价结算。计价：按节点电价、每MWh计。义务：按调度指令出力。证据：结算条款待核 |
| Regulation route | Offered → Assigned → Paid for regulation provided. Paid: per MW of regulation, per hour. Obligation: follow PJM's regulation signal. Evidence: product terms pending | 报价 → 获得分配 → 按所提供的调频付费。计价：按每MW调频、每小时计。义务：跟随PJM的调频信号。证据：产品条款待核 |

### pjm-11 — A longer commitment, on hold

| Item | Shot specification |
| --- | --- |
| Scene | A timeline from the July 2026 shortfall to the backstop: accepted on 29 September 2026, suspended to ‹bound: backstop trigger date›, amended filing on 29 October 2026, proposed bid window in March 2027 (dashed); beside the one-year auction block, a long dashed commitment bar of up to ‹bound: backstop term› years |
| Feedback | "With the backstop (scenario)" adds the dashed long bar for the Example battery; "Auction only" leaves the one-year block |
| Evidence and chart | CL-PJM-11 (SRC-PJM-17, pp. 1, 7–8, 14 and 19, and ordering paragraph (A), p. 85; SRC-PJM-18, slides 2 and 16; SRC-PJM-19) |
| Authoring check | The backstop is accepted but suspended and the amended filing is pending: draw it dashed. Batteries are eligible as new storage resources, but no project holds a commitment. Payment would be a contract-for-difference around the auction credits, on accredited MW that are committed and available; the platform does not model it. Keep this one-time procurement apart from the backstop auction already in PJM's tariff (pjm-12) |
| Mobile | Vertical timeline; the scenario bar beneath |
| Status | `official-plan`; `sourced`; the battery branch is an `analyst-scenario`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Could a battery lock in more than one year? | 电池能否锁定超过一年的收入？ |
| Copy | Possibly, through PJM's backstop. To fill the shortfall, PJM proposed a one-time procurement of new capacity, batteries included, with commitments of up to ‹bound: backstop term› years. FERC accepted it on 29 September 2026 but suspended it until ‹bound: backstop trigger date› while it settles who pays, and PJM filed an amended plan on 29 October 2026. | 有可能，途径是PJM的兜底采购。为弥补缺口，PJM提出一次性采购新增容量（包括电池），承诺期最长‹bound: backstop term›年。FERC于2026年9月29日接受了这一方案，但在确定由谁付费期间，将其中止至‹bound: backstop trigger date›；PJM已于2026年10月29日提交修订方案。 |
| Meaning | A multi-year commitment would change this play's secured revenue, but none is on offer yet, and the platform does not model one. | 多年期承诺将改变本方案的锁定收入，但目前尚无此类承诺可供签订，本平台也未对其建模。 |
| Marker | Fair evidence. What would change it: FERC's ruling on PJM's amended filing, and backstop results that show whether batteries win commitments. | 证据尚可。会改变判断的证据：FERC对PJM修订申请的裁定，以及显示电池能否获得承诺的兜底采购结果。 |
| Controls | Auction only · With the backstop (scenario) | 仅拍卖 · 含兜底采购（情景） |
| Labels | Accepted · Suspended · Proposed bid window · Commitment of up to ‹bound: backstop term› years · Scenario | 已接受 · 已中止 · 拟议投标窗口 · 最长‹bound: backstop term›年的承诺 · 情景 |

## 8. The investment

### pjm-12 — Why wait, and what to watch

| Item | Shot specification |
| --- | --- |
| Scene | Calm overview with a strip of the two watched dates (the December auction and the end of the backstop's suspension); factor cards; competing supply drawn dashed |
| Feedback | Each factor names the line it affects and links to the matching section or downside input: auction price to the fixed-payment input, the backstop to the fixed-term input, connection to the delay input, return to Bankable case. Credit has no matching input yet and says so |
| Evidence and chart | REPO-PJM-LIVE (triggers, decision reason, counterpoint, return fields); CL-PJM-04 (SRC-PJM-02, printed p. 3; SRC-PJM-01, printed p. 3, note 1); CL-PJM-11; CL-PJM-12 (SRC-PJM-14); CL-PJM-15; downside definitions (`src/experience/downsideNarrative.js`) |
| Authoring check | Name only the two triggers the call watches; the January 2027 ratings are context (CF-PJM-02). "Third large shortfall" means a third auction running more than one percentage point below the reserve target, and PJM must file at FERC before running that auction. Do not predict the December price. The counterpoint is the analyst's: bind it, never paraphrase it |
| Mobile | Factor cards, then the four links |
| Status | `sourced`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What would make this play worth pricing, and what would make it worse? | 什么会让这个方案值得定价？什么会让它更糟？ |
| Copy | Two events could change the case. The December auction sets the 2029-30 price, and a third large shortfall in a row would also trigger the backstop auction already in PJM's rules. The suspension of PJM's new backstop ends on ‹bound: backstop trigger date›; it could offer batteries longer commitments, or add competing supply. Until then the reference return is ‹bound: hold return› against the fund's target of ‹bound: target return›. Next: ‹bound: next action› | 有两件事可能改变投资方案。十二月的拍卖将确定2029-30交付年度的价格；若连续第三次出现较大缺口，还会触发PJM现行规则中的兜底拍卖。PJM新兜底采购的中止期于‹bound: backstop trigger date›结束；它可能为电池提供更长期的承诺，也可能带来更多竞争性供给。在此之前，参考回报为‹bound: hold return›，而基金的目标为‹bound: target return›。下一步：‹bound: next action› |
| Meaning | Price nothing before the December auction; a longer commitment or a steadier credit is what would move this ‹bound: call› call. | 十二月拍卖之前不对任何资产定价；能改变“‹bound: call›”这一判断的，是更长期的承诺或更稳定的认证系数。 |
| Marker | Strong evidence. What would change it: a change to the auction schedule or to the backstop's timetable. | 证据充分。会改变判断的证据：拍卖时间表或兜底采购时间表发生变化。 |
| Controls | Auction price · Credit · Backstop · Return · Connection | 拍卖价格 · 认证系数 · 兜底采购 · 回报 · 并网 |
| Factor cards | Affects capacity income; see the fixed-payment input · Affects credited MW; no matching downside input yet · Could lengthen secured revenue or add competition; see the fixed-term input · Below the fund's target; see Bankable case · A new request waits for the reformed study cycles; see the delay input · The other side: ‹bound: counterpoint› | 影响容量收入；见固定收入输入项 · 影响计入的MW；下行测试暂无对应输入项 · 可能延长锁定收入，也可能加剧竞争；见固定期限输入项 · 低于基金目标；见可融资方案 · 新申请须等待改革后的研究周期；见投运延误输入项 · 另一面：‹bound: counterpoint› |
| Exits | Bankable case · Revenue · Execution · Downside | 可融资方案 · 收益拆解 · 执行步骤 · 下行风险 |

## 9. Binding, chart and traceability

### Evidence bindings proposed for the build

These read dated source records, not model results, and are **not existing runtime fields**. The build creates them with GAP-PJM-BRA; until then the copy hides the number rather than inserting zero or a constant. Values are given for review only.

| Token | Source record / field to bind | At check, 31 Oct 2026 |
| --- | --- | --- |
| ‹bound: class rating next auction› | GAP-PJM-BRA: rating of the storage class matching `row.play.hours` for the next auction not yet held whose ratings are published (SRC-PJM-06) | 57% (2029-30). Resolves to the 2030-31 rating once posted; empty between the December results and that posting |
| ‹bound: indicative rating 2030-31› | SRC-PJM-11 table, 2030/31 column, class matching `row.play.hours` | 42% |
| ‹bound: backstop term› | SRC-PJM-17, p. 7: maximum commitment term | 15 years |
| Chart and label values | GAP-PJM-BRA rows (below): price, cap and floor, rating, shortfall, simulated uncapped price, auction and results dates, queue counts | Not stored here; see SRC-PJM-01 to SRC-PJM-14 and SRC-PJM-25 |
| ‹bound: history node› | H-PJM-01 to H-PJM-06 dates | See [Historical nodes](source-register.md#g1-pjm-history) |

### Chart-PJM-PRICE-ELCC — signature chart contract

| Field | Specification / limit |
| --- | --- |
| Question | Why is a high capacity price still a Watch? |
| Inputs | GAP-PJM-BRA, one row per delivery year. Cleared years 2025-26 to 2028-29: RTO Resource Clearing Price, $/MW-day UCAP (SRC-PJM-01 to SRC-PJM-04); cap and floor where they applied (SRC-PJM-01 to SRC-PJM-03); auction rating of the storage class matching the play's duration (SRC-PJM-07 to SRC-PJM-10). 2029-30: cap and floor (SRC-PJM-13), rating (SRC-PJM-06), auction window and results date (SRC-PJM-14). 2030-31 to 2042-43: PJM's indicative ratings only (SRC-PJM-11). No 2024-25 context bar; old-method years stay outside this chart |
| Upper panel | Bars for cleared prices; a cap–floor band for capped years; 2029-30 as a band only, labelled "Auction pending" with the bound results date; 2030-31 onward empty, labelled "No cap approved". A bracket under each bar: "One delivery year" |
| Lower panel | The play-duration class rating: solid from 2025-26 to 2029-30 (auction ratings), dashed from 2030-31 (indicative, non-binding). A break before 2025-26, with no earlier points: the method changed (SRC-PJM-04, SRC-PJM-12). Longer classes appear only in `pjm-08`'s duration view |
| Not drawn | No price after 2029-30; no dual axis; no product line beyond cleared years; no platform renewal scenario; no ratings from the old method (83% for 2023-24, 92% for 2024-25); no final delivery-year ratings mixed with auction ratings |
| Economic meaning | Price times rating is what one installed MW of the class earns per day in a cleared year. The chart shows the two factors apart; the product appears only in the evidence drawer, for cleared years |
| Reconciliation | The 2028-29 price times the 2028-29 four-hour rating times 365 days equals the model's `securedContracted` in `src/markets/pjm/comparison.js`: a reproducible check at build |
| Fallback | Until GAP-PJM-BRA is built and its rights cleared: an unscaled Example with the same shapes (bars stopping at a band, a solid then dashed falling line), no numeric axes |
| Rights | The upper panel is a market price series (PJM capacity auction clearing prices): `rights-unresolved` pending the analyst's price-data review (GAP-PJM-BRA) |

### GAP-PJM-BRA — the chart's data, not registered

| Field | Entry |
| --- | --- |
| Status | **Identified, not registered.** No PJM dataset exists in `src/governance/datasets.js`, and the catalogue deliberately keeps capacity-market results out: "They stay analyst-entered until a connector exists that can assert the vintage it read." The market module already holds two cleared years (`src/markets/pjm/data.js` `official`; `src/markets/pjm/comparison.js`) |
| Proposal for the build | An analyst-entered data module beside the PJM market, on the pattern of `src/markets/wa/data/esrRequirement.js`: one row per delivery year with price, cap, floor, class ratings, shortfall, auction dates, results date and the locator and check date of each value. Not a catalogue dataset, no connector, no ETL. Not created in this PR |
| Source and terms | PJM's Base Residual Auction reports, ELCC class-rating documents, planning parameters and RPM schedule, all PDFs or workbooks marked "For Public Use". PJM's site notice says access "does not confer any license or ownership interest in either the form or content of the website" (SRC-PJM-27). The Data Miner 2 licence lets members republish data and "specifically" prohibits non-members from doing so (SRC-PJM-27); the chart's values come from the reports, not Data Miner, but no reuse licence covers the reports either |
| Rights flag | The price panel needs exchange-style market price data (capacity auction clearing prices). The analyst is reviewing price-data rights separately; until that review, the observed layer stays `rights-unresolved` and the Example fallback applies. The platform already shows two of these prices on its PJM pages |
| Refresh | After each Base Residual Auction and each class-rating posting: the 2029-30 results (SRC-PJM-14) and the 2030-31 ratings |

ASSET-PJM-FOOTPRINT (for `pjm-01`): the states PJM serves in whole or in part, drawn from Natural Earth's public-domain admin-1 boundaries, shaded whole and labelled approximate, since many states are served only in part (SRC-PJM-23). The repository's `src/markets/pjm/us-boundary.json` holds only the national outline (Natural Earth 110m via world-atlas). Built in the build step, with its size checked against the story-chunk budget.

### Source-to-shot mapping

| Shot | Claims → sources | Chart / binding owner | Likely misreading prevented |
| --- | --- | --- | --- |
| pjm-00 | REPO-PJM-LIVE; CL-PJM-02, CL-PJM-08, CL-PJM-09 | Existing play card | A typed thesis return shown beside the card's different headline |
| pjm-01 | CL-PJM-14 → SRC-PJM-22/23; CL-PJM-03 → SRC-PJM-01/03/04/13 | ASSET-PJM-FOOTPRINT | The single price is permanent, or the site does not matter at all |
| pjm-02 | CL-PJM-02 → SRC-PJM-05/14/17; H-PJM-01 to H-PJM-06 | History bindings | A cleared year read as a multi-year contract |
| pjm-03 | CL-PJM-07 → SRC-PJM-21 | Teaching state | Capacity paid for owning, not for performing |
| pjm-04 | CL-PJM-08 → SRC-PJM-04/06/09/12 | Class-rating token | Paid on nameplate |
| pjm-05 | CL-PJM-04 → SRC-PJM-01/02/17; CL-PJM-05 → SRC-PJM-17/19/20/24/25; CL-PJM-15 → SRC-PJM-25 | GAP-PJM-BRA labels | The high price as a free-market signal, or the shortfall as an outage |
| pjm-06 | CL-PJM-06 → SRC-PJM-13/15/16; CL-PJM-03 → SRC-PJM-01 | Simulation label | The cap's level as the price after 2029-30 |
| pjm-07 | CL-PJM-16, -03, -08, -09 → SRC-PJM-01 to -11, -13, -14 | Chart-PJM-PRICE-ELCC | "Credited MW fell auction by auction"; old-method ratings joined to new ones |
| pjm-08 | CL-PJM-10 → SRC-PJM-06; REPO-PJM-LIVE | Design grid | Longer is always better because it is credited more |
| pjm-09 | CL-PJM-09 → SRC-PJM-11; CL-PJM-08 → SRC-PJM-09; SRC-PJM-17 | Indicative token | Indicative ratings read as official, or ratings as one-way |
| pjm-10 | CL-PJM-13 → SRC-PJM-26/17; CL-PJM-02, CL-PJM-07; REPO-PJM-LIVE | Existing share and tenor fields | A model's secured year read as a held commitment |
| pjm-11 | CL-PJM-11 → SRC-PJM-17/18/19 | Backstop-term token | The backstop as the play's route, or as already running |
| pjm-12 | REPO-PJM-LIVE; CL-PJM-04, -11, -12, -15 | Triggers, counterpoint, returns | A Watch read as a Pass, or the December price as a forecast |

Reverse traceability: each SRC-PJM record below names its claims, and each claim names its shots, so a superseded source queues a finite set of shots, translations and labels for review.

## 10. G-1 record

Research found nothing that changes the published call. It strengthens the Wait: the four-hour rating falls for the next auction, and PJM's own indicative ratings fall much further for the years after the cap. Several findings are for the analyst rather than the story; none was acted on.

| Review | Status / required analyst judgement |
| --- | --- |
| Electricity mechanics | Pending: one delivery year per auction; Capacity Performance; marginal accreditation and its winter-risk explanation; the cap and floor and their end; the tariff's existing backstop trigger against the new one-time backstop |
| Investment meaning | Pending: Watch as a high price that is capped, short-dated and falling in credit; four hours as best on the design test; the backstop as the event that could lengthen secured revenue; the counterpoint left bound |
| English and Chinese | Pending: same meaning for capacity, credit (认证系数), class rating (类别核定值), delivery year (交付年度), cap and floor (价格上下限) and backstop (兜底采购); all model figures bound |
| Script decision | **G-1 reviewed 1 November 2026; G-2 conditions retained. Analyst: sign off `pjm-00` to `pjm-12`, or identify changes.** |
| Build boundary | Stop here. No application code, dataset registration, data module, snapshot, model or view change, rendering, build or deployment in this task |

At G-1 the analyst is asked to decide:

1. The argument in §1, including reading "accreditation erodes" through the next auction's rating and PJM's indicative ratings rather than an auction-by-auction fall (CL-PJM-16).
2. The signature chart as specified: cleared prices from 2025-26, rating solid from 2025-26 and dashed from 2030-31, no old-method ratings; and whether to include the 2024-25 price as a context bar.
3. Showing PJM's indicative ratings on the page, dashed and labelled non-binding, as the main evidence that the credit is falling.
4. CF-PJM-01: the thesis and `play.why` type a reference return that differs from the card's headline.
5. CF-PJM-02: the next action waits for the December auction's "four-hour accreditation", which PJM has already published; the next new rating is 2030-31's, due on 11 January 2027. Whether to adjust the action's wording or add that posting as a trigger.
6. CF-PJM-03: the model's renewal path holds four-hour accreditation above PJM's indicative ratings from 2030-31, and scales longer durations by fixed ratios. Whether to refresh it as a separate single-market data change and re-run the design grid before the story says more than `pjm-08` does.
7. Rights for the chart's price series (GAP-PJM-BRA), in the separate price-data review, and the analyst-entered data module as the build's route.
8. Each shot's marker and "What would change it" line. Strong markers assume this review; `pjm-07` to `pjm-11` stay Fair because they rest on indicative ratings, the model, unextracted clauses or a pending ruling.
9. The Chinese drafts.
10. A minor wording check on the view's queue figure, outside the story (CF-PJM-05). CF-PJM-04 is resolved and recorded only so the build labels each shortfall's basis.

## 11. Sources and claims

Canonical [sources, history, calculations and G-2 gaps](source-register.md#g1-pjm-evidence) and [claim ledger](market-narratives.md#g1-pjm-claims). IDs in the shots resolve there. The script owns scene and bilingual page copy; the registers own the evidence records.

## Analyst decisions — 1 November 2026

Authority: the analyst signed off the Chinese recommendations in this chat and authorised updates to the existing eight PRs. The numerical plan was approved for PJM, Poland and Italy. After a separate duration review, the analyst also approved Ireland’s six-hour candidate and Wait call, retaining assumed services revenue and appending the learning to history. The original research findings remain as evidence; the approved disposition governs the revised shot copy and closes the G-1 decision requests.

| Item | Approved disposition / retained gate |
| --- | --- |
| Argument / chart | Approve Wait; observed ratings rose and fell. Subsequent indicative ratings are dashed and labelled non-binding; no 2024/25 context bar or old-method accreditation points. |
| CF-PJM-03 | Closed: each duration now has its own approved indicative renewal curve, with the existing price scenario retained | pjm-08 and design grid | Best-duration and financial labels bind current results; no fixed-ratio extrapolation of the secured year |
| Data / rights | Approve manual source-located records. Price-data rights stay parked; unresolved price panel uses Example, not a public observed price series. |
| Markers / Chinese | Approve the proposed evidence markers and bilingual drafts subject to the above corrections. #101 action/return/queue dispositions remain settled. |

**Common build conditions.** Model labels bind existing result fields; no financial constants are typed into page copy. Observations, non-binding plans, model paths and teaching Examples remain visually distinct. A rights block is withheld or replaced by an unscaled Example, not downgraded to Thin observed data. Manual chart records retain primary URL, locator, vintage, units and arithmetic; no dataset is registered by this documentation PR. “Strong” assesses evidence, not investment quality. Shared source/claim consolidation follows the script merges.

**Final reconciliation:** shot copy, bindings, scopes and model dependencies have been reconciled to the approved separate changes. Exact-head validation and dependency merges remain release gates. Approval of an editorial choice does not close an unresolved source, contract, rights or numerical dependency.

**Financial basis.** Investment-summary IRRs use the existing after-tax nominal cash-flow layer, including its inflation convention. The design-grid comparison is a separate basis. Do not add inflation again to the investment return or treat assumed contract escalation as verified contractual entitlement.
