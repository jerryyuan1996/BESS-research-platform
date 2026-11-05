# NEM: Six-Chapter Storyboard

Pack: BESS-IX-2026-10-30; NEM research and script, 5 November 2026; shot layout v1.2
Status: **G-1 draft for the analyst's review; not signed off.** This is a G-1 script only. Data registration, the content module, scenes, wiring and release are later work packages, and their gates stay open.
Navigation: [Master plan](README.md) | [Narrative card](market-narratives.md#3-eighteen-market-candidate-story-cards) | [Evidence specification](evidence-and-content-specification.md) | [WA format](western-australia-storyboard.md) | [Sources and claims](#11-sources-and-claims)

## 1. Scope, argument and reading route

The story covers the **National Electricity Market (NEM)**: the interconnected east-coast grid and wholesale market that AEMO operates across Queensland, New South Wales (with the ACT), Victoria, South Australia and Tasmania. It does not cover Western Australia's WEM, which has its own story, or the Northern Territory. It argues for one conclusion: the platform's NEM call and play as the view store publishes them, read from `view/markets/nem.json` and the briefing model on `main` at `e7eda6f`, evaluated read-only for 5 November 2026 (REPO-NEM-LIVE).

| Anchor | Field read | At check, 5 Nov 2026 |
| --- | --- | --- |
| Lens | `DEFAULT_LENS` | `infraFund`, Infrastructure fund / 基础设施基金 |
| Call | `verdicts.infraFund.call` → `row.call` | `opportunistic`, shown as **Situational / 择机投入** |
| Play | `verdicts.infraFund.play` → `row.play` | **`nem-ltda-4h`**, "Tender award · 4h" / 容量投资计划中标 · 4小时 |
| Route and entry | `row.play.route`, `row.play.stage` | `ltda` (the Capacity Investment Scheme), **operating** |
| Duration | `row.play.hours` | 4 |
| Where | `verdicts.infraFund.where` | "An operating asset with an executed tender award, bought at a price that clears the hurdle" |
| Next action | `row.play.action.text` | "Screen operating assets holding a tender award; pay no more than build cost, because the margin over a fund's yields is thin and rests on assumed CIS terms." |
| Evidence | `row.evidence` | Fair |
| Trigger watched | `row.next` → `HOME_BRIEFING.triggers` | `nem-successor-scheme-first-round`, "First procurement round under the successor to the Capacity Investment Scheme, indicatively late 2027", expected 2027-12, direction either |
| Review by | `verdicts.infraFund.reviewBy` | 31 March 2027 |

The content contract's anchor is `reviewedAgainst: { playRef: 'nem-ltda-4h', hours: 4, call: 'opportunistic', on: '2026-11-05' }`. Other lenses carry other calls (`strategic` and `developer`: Build position, greenfield; `foreignFirstTimer`: Not accessible); this script explains the fund's. The call stays at Opportunistic under the analyst's ruling of 16 October, which holds it until the research gate on the NEM seeds closes (the verdict's `scoreNote`); this script does not reopen it.

The published thesis, in substance: the deepest storage build on the platform on the thinnest secured revenue; no capacity market, a tender floor whose level is unpublished, and compressed merchant spreads; at build cost the reference project only just clears the platform's yields, on modelled CIS terms, and falls short of the fund's target; four hours, on a tender award or a toll. The research supports that chain and sharpens two parts of it (CF-NEM-02, CF-NEM-03):

1. The NEM is one long interconnected grid on the east coast, with a separate price in each region every five minutes. Western Australia and the Northern Territory are not connected to it (CL-NEM-02).
2. When it opened in December 1998 it chose to pay only for energy. WA chose the opposite in 2006. The December 2025 review of the market's settings kept the energy-only spot market, so no capacity payment is coming (CL-NEM-03, CL-WA-06).
3. Batteries entered through fast services and five-minute prices, then moved into shifting energy from midday to evening. The fast services filled first (CL-NEM-05, CL-NEM-06).
4. Governments now underwrite new storage by tender. A Capacity Investment Scheme agreement tops up revenue below a floor the bidder names and shares revenue above a ceiling, for up to fifteen years once the battery is fully operating. The floor of each award is not published (CL-NEM-07, CL-NEM-08).
5. Batteries are now closing the spread they earn. In two years their average output rose several-fold while the NEM-wide battery price spread fell to a fraction of its level; batteries now set the price in about half of all dispatch intervals. WA's batteries saw the same squeeze, but in WA capacity pays most of a battery's revenue, and in the NEM nothing does except an award (CL-NEM-10 to CL-NEM-13).
6. So the play holds the one secured line on offer: an operating battery with an executed award, at four hours, the size the tenders buy. On the platform's design test only the award design clears the platform's yields. But at build cost even that design falls short of the fund's target, so what the fund pays, not what the battery cost to build, decides the case. Few awarded batteries are operating yet, and many buyers want them (CL-NEM-09, CL-NEM-15, CL-NEM-16).

Comprehension check: from the story alone, the user can say why a NEM battery needs an award to have secured revenue at all, why the merchant spread is not a base to underwrite, why the play is four hours, and why the fund buys an operating awarded asset at a price rather than building one.

**Alternative explanation to keep in view.** The squeeze may be partly cyclical: the June quarter of 2025 was unusually volatile, and spreads were higher in summer 2026 than in the quarters either side. Coal closures, data-centre load in Victoria and the market price cap's rise could widen evening spreads again, and the Capacity Investment Scheme floor may bind less than the model assumes. The analyst's own counterpoint is on the card: lenders finance storage here without recourse and assets trade often, so a fund waiting for a cheap entry competes with many buyers.

**Disconfirming condition.** A run of quarters in which the NEM-wide battery spread recovers while battery output keeps rising; or a disclosed award, or a sale of an awarded operating battery, priced at or below the platform's operating ceiling (which would make the play actionable sooner); or a successor scheme whose contracts change what an award is worth.

Scenes are fixed-view isometric SVG from the shared symbol kit, with 2D charts where the argument needs one. They show simplified topology, not a power-flow model, a site layout or project advice. Thirteen shots (`nem-00` to `nem-12`) make about five minutes of reading. Chapter links and ordinary scrolling work throughout, and nothing waits for an animation. Where the kit allows, the NEM story reuses the WA story's Australia map and symbols, so the two Australian markets read side by side.

| Chapter | 章节 | Shots | What the reader can explain afterwards |
| --- | --- | --- | --- |
| Opening | 开篇 | nem-00 | The call and the play, in one line |
| Origins | 起源 | nem-01 | One long interconnected grid with a price for each region; the WA island beside it |
| Historical choices | 历史选择 | nem-02, nem-03, nem-04 | Energy only, the opposite of WA; batteries came in through fast services; governments underwrite by tender |
| Today's tensions | 当下的矛盾 | nem-05, nem-06, nem-07 | Batteries flatten the day; the spread they earn is closing (signature chart, with WA beside it); location still moves the merchant line |
| Add a battery | 加入电池 | nem-08, nem-09 | Why four hours; what an award does to the battery's revenue |
| Who pays | 谁来付费 | nem-10 | The award first, for its term; the market for the rest; a toll as the other route |
| The investment | 投资 | nem-11, nem-12, then links | Why buy an operating awarded asset at a price; what could weaken it and what to watch |

### Bound fields

Every model figure on the page comes through one of these tokens. Values are given only so the analyst can review the script against the live case; they are never typed into copy. If the call or play changes, the play card updates itself and `reviewedAgainst` flags this script for review. The build names in brackets follow `src/markets/wa/storyBindings.js`.

| Token | Field the market page or briefing already reads | At check, 5 Nov 2026 |
| --- | --- | --- |
| ‹bound: call› (`call`) | `row.call` through `CALLS` in `src/experience/model.js`, shown by the call tag in `src/experience/pages.js` | `opportunistic`, shown as Situational / 择机投入 |
| ‹bound: play› (`play`) | `playTitle(row.play, row.stage)` (`routeName` in `pages.js`) | Tender award · 4h · operating / 容量投资计划中标 · 4小时 · 在运资产 |
| ‹bound: play duration› (`playDuration`) | `row.play.hours` (also the market intro's "· 4H") | 4 |
| ‹bound: entry route› (`entryRoute`) | `STAGE_WORD[row.play.stage]` in `src/governance/playTitle.js` | operating / 在运资产 |
| ‹bound: where› (`where`) | `row.where` (`verdicts.infraFund.where`) | An operating asset with an executed tender award, bought at a price that clears the hurdle |
| ‹bound: next action› (`nextAction`) | `row.play.action.text` (the Overview's next action) | Screen operating assets holding a tender award; pay no more than build cost, because the margin over a fund's yields is thin and rests on assumed CIS terms. |
| ‹bound: play evidence marker› | `row.evidence` (the card's marker) | Fair |
| ‹bound: hold return› (`holdReturn`) | `row.econ.hold`, from `row.investment.holdIRR` ("Base all-equity IRR"): the return for building new | 7.4% |
| ‹bound: target return› (`targetReturn`) | `row.econ.test.target` (`row.investment.targetReturn`, "Investor target") | 10.6% |
| ‹bound: secured share› (`securedShare`) | `row.econ.secured`, from `row.investment.secured` ("Modelled fixed revenue") | 60.5%; the card's `share()` shows 60% |
| ‹bound: secured tenor› (`securedTenor`) | `row.econ.securedYears` ("Fixed revenue tenor") | 15 |
| ‹bound: build capex› (`buildCapex`) | `row.investment.capexPerMW`, as `projectFacts` prints it | AUD 1.33m per MW |
| ‹bound: operating price ceiling› (`operatingCeiling`) | `row.investment.operatingPurchase.maxPricePerMW`, as `operatingPrice()` prints it | AUD 1.08m per MW |
| ‹bound: operating target› (`operatingTarget`) | `row.investment.operatingPurchase.targetReturn` | 10.1% |
| ‹bound: decision reason› | `row.decision.reason` ("Why this priority") | Operating assets and platforms change hands regularly. |
| ‹bound: counterpoint› (`counterpoint`) | `row.decision.counterpoint` ("What limits conviction") | Lenders finance storage here without recourse and assets trade often, so a fund waiting for a cheap entry competes with many buyers. |
| ‹bound: next trigger› (`nextTrigger`) | `HOME_BRIEFING.triggers[row.next]`: `label` and `expected` | First procurement round under the successor to the Capacity Investment Scheme, indicatively late 2027 · 2027-12 |
| ‹bound: best duration› (`bestDuration`) | `HOME_BRIEFING.grids.nem.byRoute.ltda.best` | 4 |
| ‹bound: merchant best duration› (`merchantBest`) | `HOME_BRIEFING.grids.nem.byRoute.mer.best` | 6 |
| ‹bound: design durations› (`designDurations`) | `HOME_BRIEFING.grids.nem.hours` | 1, 2, 4, 6, 8 |
| ‹bound: build line› (`designLine`) | `HOME_BRIEFING.build`, the NEM entry's `line` (a computed sentence) | the NEM: Tender award at 4h, +$36k/MW. |

Evidence tokens such as ‹bound: spread latest›, ‹bound: floor support share› and ‹bound: awarded batteries operating› read dated source records, not model results. They are listed in [§9](#9-binding-chart-and-traceability).

The teaching battery is 100 MW at the play's duration, tagged "Example"; its presets are teaching values and never change the case (evidence specification §4).

### Rules for every shot

- **Figures.** Calls, durations, shares, returns, prices and fleet sizes in page copy come through bound tokens. Historical dates are sourced facts. Quarters are written as Australian quarters in words ("the September quarter of 2026"; 2026年第三季度), because the content contract reads "Q3" as a stray figure. In Chinese, a month without a day is written in characters (十二月) where the contract's date pattern would not catch it.
- **Controls.** Teaching controls change only teaching state: era, time of day, quarter, market (NEM or WA), duration preset, route or factor. The story has no underwriting controls. "Go to the investment case" links to the market page, which already hands the case to the Investment Lab.
- **Navigation.** Chapter and shot changes are history entries. Back, refresh, a language switch and opening or closing evidence keep the reader's place (`WP-04`).
- **Evidence.** Each shot shows one marker and one "What would change it" line, using the site's labels: Strong evidence (证据充分), Fair evidence (证据尚可), Thin evidence (证据单薄). A Strong marker assumes the analyst's review at G-1. The Authoring check row is for writers and reviewers and never appears on the page. Official plans and scenarios are dashed and labelled; teaching values are tagged "Example" (示例); the award's floor and ceiling are never drawn at a value, because none is published.
- **Contract terms.** The award's floor and ceiling are bid as fixed nominal amounts, or a fixed nominal schedule (SRC-NEM-08). The platform's financing convention indexes contracted lines (the analyst's ruling of 29 October); the story never says an award rises with inflation.
- **Two languages.** All page text is drafted below in English and Simplified Chinese with the same meaning. Source titles keep their original language.

Shared story strings:

| String | English | 简体中文 |
| --- | --- | --- |
| Story button | Story | 故事 |
| Navigation | Previous · Next · Chapters · Sources | 上一节 · 下一节 · 章节 · 来源 |
| Marker line | What would change it: | 会改变判断的证据： |
| Teaching tag | Example | 示例 |
| Observed tag | Observed (AEMO) | 实测（AEMO） |
| Plan tag | Proposed (not yet law) | 拟议（尚未立法） |
| Scenario tag | Scenario | 情景 |
| Exit | Go to the investment case | 前往投资方案 |
| Stale call | This story was last reviewed against the call of ‹date›. | 本故事最近一次依据‹date›的投资判断复核。 |

## 2. Opening

### nem-00 — The call

| Item | Shot specification |
| --- | --- |
| Scene | Small isometric thumbnail: an operating battery holding one document (the award), beside a fading price trace; no animation |
| Feedback | None; this shot is the conclusion |
| Evidence and chart | Play card fields from the view store through the briefing model (REPO-NEM-LIVE); CL-NEM-03 for "no capacity payment"; CL-NEM-07 for "an award"; CL-NEM-11 for "a spread batteries are closing" |
| Authoring check | Never restate the call or a figure in prose. The view's thesis types a fleet size and a "record low" that no longer match AEMO's latest report (CF-NEM-03), and a grade reason types a secured share that differs from the card's (CF-NEM-04): copy none of them. `opportunistic` displays as Situational. A changed call or play updates the card and flags the story |
| Mobile | Play card full width; two buttons |
| Status | Proposed 5 Nov 2026; `sourced`; uses the existing play card |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What is the call here, and why should I read on? | 这里的投资判断是什么？为什么值得读下去？ |
| Copy | The existing play card: ‹bound: call›, ‹bound: play›, the figures the card already shows, ‹bound: next action›. Beneath it: "Why: the NEM pays batteries only for energy, and batteries are closing the spread they earn. The secured revenue on offer is an award, and only the price paid for an awarded asset makes the case." | 沿用现有投资方案卡：‹bound: call›、‹bound: play›、卡片已显示的各项数据、‹bound: next action›。卡片下方一行：“原因在于：NEM只为电能量付费，而电池正在收窄自己赖以获利的价差。可供锁定的收入只有中标合同，而成败取决于收购中标资产时支付的价格。” |
| Marker | The play's own marker, already on the card | 沿用方案卡上该方案自身的证据标记 |
| Controls | Start the story · Go to the investment case | 开始阅读 · 前往投资方案 |

## 3. Origins

### nem-01 — One long grid, a price for each region

| Item | Shot specification |
| --- | --- |
| Scene | Australia from Natural Earth's coastline (SRC-NE-01), reusing the WA story's map (`WA_ISLAND_MAP`): the NEM's states shaded and divided into its five regions (ASSET-NEM-REGIONS, approximate), with the interconnectors drawn as schematic links between neighbouring regions; the SWIS outlined in the west with the WA story's "No link" line; a price tag on each NEM region; fixed view |
| Feedback | "One grid" lights the whole east coast; "A price for each region" puts a separate tag on each region and narrows the links between them; "WA beside it" brings up the SWIS island and its label |
| Evidence and chart | CL-NEM-02 (SRC-NEM-03, paragraphs 1–4; SRC-NEM-04, p. 1; SRC-NEM-01); CL-WA-05 for the island; SRC-NEM-19 for regional boundaries and losses |
| Authoring check | The NEM's regions follow state borders but do not cover every part of each state; label the shading approximate. Interconnectors are drawn as schematic links, not routes or capacities, and no arrow is a power flow. No battery sites. Investment meaning only: the spot price a battery earns is set for its region, every five minutes |
| Mobile | Same map; three large buttons; caption below |
| Status | Proposed; `sourced`; region asset not built (ASSET-NEM-REGIONS); WA map reused |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Which market is this, and how is it different from WA's? | 这是哪个市场？它与西澳市场有何不同？ |
| Copy | The NEM is one of the world's longest interconnected power systems, running down the east coast from Queensland to South Australia and across to Tasmania. Each of its regions has its own spot price, set every five minutes, and the regions trade through links of limited size. Western Australia's grid, on the other side of the continent, is not connected to it. | NEM是世界上最长的互联电力系统之一，沿东海岸从昆士兰一路延伸至南澳大利亚，并跨海连接塔斯马尼亚。每个价区都有自己的现货价格，每五分钟出清一次；各价区之间通过容量有限的联络线互相交易。位于大陆另一侧的西澳电网与之并不相连。 |
| Meaning | A NEM battery earns its region's price; the links decide how often neighbouring regions share one. | NEM的电池按所在价区的价格获利；联络线决定相邻价区多常共享同一价格。 |
| Marker | Strong evidence. What would change it: a rule change that replaced regional prices with a single price or with prices at each connection point. | 证据充分。会改变判断的证据：规则修改，以全网统一价格或逐个并网点定价取代分价区定价。 |
| Controls | One grid · A price for each region · WA beside it | 一张电网 · 各价区各有价格 · 西澳在旁 |
| Labels | National Electricity Market (approximate) · Queensland · New South Wales and the ACT · Victoria · South Australia · Tasmania · Interconnector (schematic) · SWIS, Western Australia · No link | 全国电力市场（近似） · 昆士兰 · 新南威尔士及首都领地 · 维多利亚 · 南澳大利亚 · 塔斯马尼亚 · 联络线（示意） · 西澳西南互联系统 · 无联络 |
| Caption | Approximate. Coast: Natural Earth. Regions: AEMO. | 近似范围。海岸线：Natural Earth。价区：AEMO。 |

## 4. Historical choices

### nem-02 — Paid only for energy

| Item | Shot specification |
| --- | --- |
| Scene | The same east-coast frame with a six-node timeline (H-NEM-01 to H-NEM-06) and a WA marker at 2006; selecting a node changes one layer |
| Feedback | Only the selected layer changes; the outlook node is dashed. Selecting the WA marker shows the WA story's 2006 node beside the NEM's 1998 node, as two choices on one strip |
| Evidence and chart | Event: CL-NEM-03 (SRC-NEM-02, App. A.2.1 p. 62; SRC-NEM-14, Recommendation 1, p. 21; SRC-NEM-15). Contrast: CL-WA-06. Interpretation: CL-NEM-04, proposed. Nodes: H-NEM-01 to H-NEM-06 |
| Authoring check | Keep the event (an energy-only market since 1998, kept in December 2025) apart from the interpretation (so secured revenue must be bought by contract). The review was agreed in principle by every NEM jurisdiction except Queensland; its law is still a draft (SRC-NEM-15): say "the review recommended", never "the law now says". Do not describe the market price cap's level or claim it is the reliability mechanism; the story does not need it. No invented dates; the outlook node is dashed |
| Mobile | Vertical node list; one strip with the WA marker |
| Status | Event `sourced`; interpretation `proposed` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why is a NEM battery not paid for capacity, when a WA battery is? | 为什么NEM的电池拿不到容量收入，而西澳的电池可以？ |
| Copy | Because the NEM chose to pay only for energy. When it opened in December 1998, generators were paid for the electricity they sent out and nothing for standing ready. Western Australia chose the opposite in 2006. In December 2025 a review of the NEM's market settings recommended keeping the energy-only spot market at its core. | 因为NEM选择只为电能量付费。1998年12月开市时，发电方只按送出的电量获得收入，随时待命不付费。西澳则在2006年作出了相反的选择。2025年12月，一项针对NEM市场机制的评估建议继续以单一电能量现货市场为核心。 |
| Meaning | No payment for standing ready means a battery here has no secured revenue unless it signs a contract for it. | 不为待命付费，意味着这里的电池除非签订合同，否则没有任何锁定收入。 |
| Marker | Strong evidence. What would change it: Energy Ministers adopting a payment for capacity in the reforms they are due to consider in December 2026. | 证据充分。会改变判断的证据：能源部长们在预计于2026年12月审议的改革方案中采纳容量付费。 |
| Controls | Select a node · Constraint · Choice · What remains · Effect today · WA in 2006 | 选择节点 · 约束 · 选择 · 遗留 · 今日影响 · 2006年的西澳 |

Timeline nodes (page text):

| Node | Field | English | 简体中文 |
| --- | --- | --- | --- |
| 1998 · One market for the east coast | Constraint | Each state ran its own electricity system. | 各州原本各自运营电力系统。 |
| | Choice | Join them in one wholesale market that pays only for energy, set by the last offer needed. | 把它们并入一个只为电能量付费、由所需最后一笔报价定价的批发市场。 |
| | What remains | Regional spot prices, every five minutes. | 每五分钟出清的分价区现货价格。 |
| | Effect today | A battery earns the spot price, not a payment for standing ready. | 电池赚的是现货价格，而不是待命费用。 |
| 2016 · South Australia goes dark | Constraint | On 28 September 2016 the whole of South Australia lost supply. | 2016年9月28日，南澳大利亚全州停电。 |
| | Choice | Tighten system security and pay more attention to fast frequency control. | 加强系统安全，更加重视快速调频。 |
| | What remains | Markets for fast frequency services. | 快速调频服务市场。 |
| | Effect today | The first batteries' revenue came largely from fast services (to be confirmed). | 第一批电池的收入主要来自快速调频服务（待核实）。 |
| 2017 to 2021 · Priced by the five minutes | Constraint | Prices were settled over half an hour, blunting the reward for a fast response. | 价格原按半小时结算，削弱了对快速响应的回报。 |
| | Choice | Settle every five minutes, decided in 2017 and started in 2021. | 改为每五分钟结算：2017年决定，2021年实施。 |
| | What remains | Five-minute settlement. | 五分钟结算。 |
| | Effect today | A battery is paid for the exact minutes it responds. | 电池按实际响应的时段获得结算。 |
| 2021 · Storage gets its own place in the rules | Constraint | A battery had to register as both a generator and a load. | 电池必须同时注册为发电方和用电方。 |
| | Choice | A single registration category for storage and hybrids, decided on 2 December 2021. | 2021年12月2日决定，为储能和混合电站设立单一注册类别。 |
| | What remains | The Integrated Resource Provider category. | “综合资源提供方”注册类别。 |
| | Effect today | Storage is a participant in its own right. | 储能成为独立的市场参与者。 |
| 2023 to 2027 · Governments underwrite new capacity | Constraint | The market alone was not bringing in enough firmed capacity before coal closes. | 仅靠市场，无法在燃煤机组退役前引入足够的可调度容量。 |
| | Choice | The Capacity Investment Scheme: tenders that underwrite new projects' revenue, from a pilot in 2023 to its last rounds in 2027. | 容量投资计划：以招标为新项目提供收入托底，从2023年的试点到2027年的最后几轮。 |
| | What remains | Awards held by a minority of projects. | 只有少数项目持有中标合同。 |
| | Effect today | The only long secured revenue for a battery comes from winning an award. | 电池唯一的长期锁定收入来自中标。 |
| Outlook (dashed) · After the scheme | Constraint | The last dispatchable tender closed in August 2026; a successor is a draft. | 最后一轮可调度容量招标已于2026年8月截止；后继机制仍是草案。 |
| | Choice | None yet: an outlook, not a decision. Energy Ministers are due to consider the draft law in December 2026. | 尚无决定：这是展望，而非决策。能源部长们预计于2026年12月审议法律草案。 |
| | Effect today | What later awards are worth waits for the successor's design. | 后续中标合同的价值，取决于后继机制的设计。 |

### nem-03 — Batteries came in through fast services

| Item | Shot specification |
| --- | --- |
| Scene | The grid at the instant of a fault: a frequency trace dipping; the Example battery responding in seconds beside slower plant; then the same battery through a day, charging at midday and discharging in the evening. A small two-part strip below shows which share of battery revenue came from fast services in the latest quarter (bound) |
| Feedback | "Seconds" shows the fault response; "Hours" switches to the daily cycle. "Who supplies the fast services now" shows batteries' share of the volume (bound) |
| Evidence and chart | Events: CL-NEM-05 (SRC-NEM-18, pp. 4–6; SRC-NEM-16; SRC-NEM-17). Present: CL-NEM-06 (SRC-NEM-05, §2.4.1 p. 38; SRC-NEM-06, Figures 55 and 71). Battery entry through fast services: CL-NEM-19, candidate |
| Authoring check | AEMO's report on 2016 does not say batteries were the answer; the link from the black system to battery entry is an editorial reading until CL-NEM-19 is sourced. The September quarter of 2025 had unusually high fast-service revenue because of planned interconnector outages (SRC-NEM-05, p. 38): do not draw a single-quarter fall as a trend. Not every inverter provides every service. The frequency trace is Example, not an event record |
| Mobile | Two still frames (seconds, hours), then the share strip |
| Status | Events `sourced`; the entry reading `proposed`; present shares `sourced` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What were batteries first used for here, and what changed? | 电池在这里最初用来做什么？后来发生了什么变化？ |
| Copy | First, for fast response. After South Australia's black system in 2016, keeping frequency steady became a paid priority, and from 2021 five-minute settlement rewarded resources that respond within minutes. As the fleet grew, batteries took over most of those services and earned less from them: in the September quarter of 2026 they supplied ‹bound: battery service volume share› of the volume but earned only ‹bound: service revenue share› of their revenue there. The rest came from shifting energy. | 起初是做快速响应。2016年南澳大利亚全州停电之后，维持频率稳定成为需要付费的优先事项；2021年起，五分钟结算又奖励能在几分钟内响应的资源。随着电池规模扩大，电池承担了这些服务的大部分，从中获得的收入却越来越少：2026年第三季度，电池提供了‹bound: battery service volume share›的服务量，但这部分收入只占其总收入的‹bound: service revenue share›。其余收入来自电能量转移。 |
| Meaning | Fast services filled first; a battery's revenue now rests on moving energy across the day. | 快速调频服务最先饱和；如今电池的收入依赖于在一天之内转移电能量。 |
| Marker | Fair evidence. What would change it: a primary record of how the first batteries earned their revenue after 2016. | 证据尚可。会改变判断的证据：关于2016年后第一批电池收入来源的一手记录。 |
| Controls | Seconds · Hours · Who supplies the fast services now | 秒级 · 小时级 · 如今谁在提供快速调频服务 |
| Labels | Frequency (Example) · Example: 100 MW battery · Fast services · Energy shifting · Observed (AEMO) | 频率（示例） · 示例：100MW电池 · 快速调频服务 · 电能量转移 · 实测（AEMO） |
| Caption | Shares: AEMO, Quarterly Energy Dynamics, September quarter of 2026. | 占比：AEMO《Quarterly Energy Dynamics》，2026年第三季度。 |

### nem-04 — A safety net, bought by tender

| Item | Shot specification |
| --- | --- |
| Scene | A tender table beside the grid: rounds as stacked cards along a strip from 2023 to 2027 (the pilots, then each dispatchable round), each card showing its awarded MWh as a bound label; the round still being assessed is open; the strip ends at a dashed edge after the last round |
| Feedback | Each round card opens its date and awarded size (bound). "What an award is" opens the three terms a bidder names (floor, ceiling, payment cap) with no values, and the rule that support starts only once the battery is fully operating |
| Evidence and chart | CL-NEM-07 (SRC-NEM-08, pp. 12–13 and Table 5; SRC-NEM-12, "How bidding works"); CL-NEM-08 (SRC-NEM-10; SRC-NEM-11; SRC-NEM-09) |
| Authoring check | An announced project is "subject to signing" a CISA (SRC-NEM-11): a result is not a contract. Do not total the rounds into a fleet: some awards are withdrawn and retendered (SRC-NEM-12). The floor, ceiling and payment cap are bid variables kept commercial-in-confidence; never draw them at a value. The round still being assessed has no result to show |
| Mobile | Round cards as a vertical list; one "What an award is" card |
| Status | `market-rule`, `historical-fact`; `sourced` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | If the market pays only for energy, how does any battery here get secured revenue? | 既然市场只为电能量付费，这里的电池如何获得锁定收入？ |
| Copy | By winning a government tender. Under the Capacity Investment Scheme, each bidder names a yearly revenue floor, a ceiling and a payment cap. If the battery's revenue falls below the floor, the Commonwealth pays ‹bound: floor support share› of the gap; above the ceiling, the battery pays back ‹bound: ceiling sharing share› of the excess. Support starts only once the battery is fully operating and lasts up to ‹bound: support term max› years. The floors are not published. | 靠赢得政府招标。在容量投资计划下，每个投标方自行报出年度收入下限、上限和支付上限。电池收入低于下限时，联邦政府补足差额的‹bound: floor support share›；高于上限时，电池须返还超出部分的‹bound: ceiling sharing share›。托底只在电池全面投运后才开始，最长‹bound: support term max›年。各项目的下限均不公开。 |
| Meaning | An award turns most of a battery's revenue into a contract for its term, at a level only its holder knows. | 中标合同在合同期内把电池的大部分收入变成合同收入，而其水平只有持有人知道。 |
| Marker | Strong evidence. What would change it: a change to the agreement's terms in the remaining tenders, or a successor with different contracts. | 证据充分。会改变判断的证据：剩余招标轮次中协议条款发生变化，或后继机制采用不同的合同。 |
| Controls | Each tender round · What an award is | 各轮招标 · 中标合同是什么 |
| Labels | Pilot · Dispatchable round · Being assessed · Floor (not published) · Ceiling (not published) · Payment cap (not published) · Support starts at full operation | 试点 · 可调度容量招标 · 评审中 · 下限（未公开） · 上限（未公开） · 支付上限（未公开） · 全面投运后开始托底 |
| Caption | Terms: AusEnergy Services Limited, CIS Tender 10 Tender Guidelines, Table 5. Rounds: DCCEEW. | 条款：AusEnergy Services Limited《CIS Tender 10 Tender Guidelines》表5。各轮结果：澳大利亚气候变化、能源、环境和水资源部（DCCEEW）。 |

## 5. Today's tensions

### nem-05 — Batteries flatten the day

| Item | Shot specification |
| --- | --- |
| Scene | The grid through one day: rooftops and solar farms lit at midday, batteries charging; evening, batteries discharging. Chart-NEM-DAY beside it: the NEM average spot price by time of day for the September quarter of 2026 against the same quarter of 2025, two solid lines on one $/MWh axis |
| Feedback | "Midday" and "Evening" move the scene and highlight the matching hours on the chart; "A year earlier" brings up the 2025 line. A bound label gives the energy batteries shifted each day in each year |
| Evidence and chart | CL-NEM-10 (SRC-NEM-05, Executive summary p. 4 and §2.4.1 pp. 37–38; SRC-NEM-06, Figures 15 and 53); GAP-NEM-QED |
| Authoring check | The lines are quarterly averages by time of day across the whole NEM, not one day and not one region's price. Lower prices have several causes in AEMO's reading (lower evening demand, more battery output, less volatility): do not credit batteries alone. Low midday prices are not free charging; they are the price a battery pays. No forecast |
| Mobile | Chart full width; midday and evening buttons; the year toggle below |
| Status | `observed-data`; `sourced`; data not registered (GAP-NEM-QED) |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What do batteries do to a NEM day? | 电池给NEM的一天带来了什么变化？ |
| Copy | They buy at midday and sell in the evening, and in doing so they pull the two prices together. In the September quarter of 2026 batteries charged ‹bound: daytime charge latest› a day on average and discharged ‹bound: evening discharge latest› in the evening peak, against ‹bound: daytime charge year before› and ‹bound: evening discharge year before› a year earlier. Evening prices fell well below the year before. | 电池在中午买入、傍晚卖出，这样做的同时也把两个时段的价格拉近了。2026年第三季度，电池平均每天在白天充电‹bound: daytime charge latest›，在傍晚高峰放电‹bound: evening discharge latest›；一年前分别为‹bound: daytime charge year before›和‹bound: evening discharge year before›。傍晚电价明显低于一年前。 |
| Meaning | Every battery added shifts more energy, and narrows the gap it is paid for. | 每增加一台电池，转移的电量更多，赖以获利的价差也更窄。 |
| Marker | Strong evidence. What would change it: AEMO's next quarterly reports showing evening prices pulling away from midday again as the fleet grows. | 证据充分。会改变判断的证据：AEMO后续季度报告显示，随着电池规模扩大，傍晚电价再次与中午拉开差距。 |
| Controls | Midday · Evening · A year earlier | 中午 · 傍晚 · 一年前 |
| Labels | NEM average spot price by time of day · September quarter of 2026 · September quarter of 2025 · Batteries charging · Batteries discharging · $/MWh · Observed (AEMO) | NEM分时段平均现货价格 · 2026年第三季度 · 2025年第三季度 · 电池充电 · 电池放电 · 澳元/MWh · 实测（AEMO） |
| Caption | AEMO, Quarterly Energy Dynamics, September quarter of 2026, Figure 15. Market time. | AEMO《Quarterly Energy Dynamics》2026年第三季度，图15。市场时间。 |

### nem-06 — Closing the spread they earn (signature chart)

| Item | Shot specification |
| --- | --- |
| Scene | The same grid at dusk; the chart takes the frame. A small WA island inset from the WA story sits in the corner |
| Feedback | Signature chart Chart-NEM-SPREAD ([§9](#chart-nem-spread--signature-chart-contract)). Upper panel: AEMO's NEM-wide battery price spread by quarter, the September quarter of 2024 to the September quarter of 2026, as bars. Lower panel: average battery discharge, MW, on the same quarter axis. "WA beside it" adds AEMO's same two measures for the WEM as thin lines, and a caption line on what pays a battery in each market |
| Evidence and chart | CL-NEM-11 and CL-NEM-12 (SRC-NEM-05, §2.4.1 pp. 38–39; SRC-NEM-06, Figure 56; SRC-NEM-07, §2.4.1 pp. 37–38); CL-NEM-13 (SRC-NEM-06, Figure 107; SRC-NEM-05, p. 69); CL-WA-06 and CL-WA-11 for what pays in WA; GAP-NEM-QED |
| Authoring check | Two panels, two units, one shared axis: no dual axis. AEMO's spread is the difference between the prices at which batteries charge and discharge, volume-weighted (SRC-NEM-05, footnote 28): never relabel it a four-hour spread or a revenue per MW. The series is seasonal and the June quarter of 2025 was unusually volatile; the claim is the two-year shape, not one quarter's fall. Do not say "record low": AEMO does not. No forecast line, no model line, no award floor drawn on the $/MWh axis. WA lines come from the WEM's own market and are not comparable in level, only in shape |
| Mobile | Panels stacked on the shared axis; a table view with the same values; the WA toggle below |
| Status | Chart method `proposed`; data `sourced`, not registered (GAP-NEM-QED); rights for the analyst's price-data review |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | If the evening still pays more than midday, why is merchant revenue not enough? | 既然傍晚电价仍高于中午，为什么市场化收入还不够？ |
| Copy | Because batteries are closing the gap they are paid for. Over two years their average output rose from ‹bound: discharge two years before› to ‹bound: discharge latest›, while the spread between the prices they charge and discharge at fell from ‹bound: spread two years before› to ‹bound: spread latest›. Batteries now set the NEM price in ‹bound: battery price-setting share› of dispatch intervals. WA's batteries have seen the same squeeze; there, capacity pays most of a battery's revenue. In the NEM, nothing does except an award. | 因为电池正在收窄自己赖以获利的价差。两年间，电池的平均出力从‹bound: discharge two years before›增至‹bound: discharge latest›，而电池充放电价格之间的价差从‹bound: spread two years before›降至‹bound: spread latest›。如今，电池在‹bound: battery price-setting share›的调度时段中决定NEM的电价。西澳的电池也经历了同样的挤压，但在那里，容量收入占电池收入的大部分；在NEM，除了中标合同，没有任何东西能起到这个作用。 |
| Meaning | The merchant spread is shrinking because of batteries themselves, so it is not a base to underwrite; the award is. | 市场化价差的收窄正是电池自身造成的，因此它不能作为承销的基础；能作为基础的是中标合同。 |
| Marker | Strong evidence. What would change it: a run of quarters in which the spread widens again while battery output keeps rising. | 证据充分。会改变判断的证据：连续几个季度中，电池出力持续上升而价差重新扩大。 |
| Controls | Spread · Battery output · WA beside it | 价差 · 电池出力 · 西澳对照 |
| Labels | NEM-wide battery price spread, $/MWh · Average battery discharge, MW · WEM (WA), same measures · Observed (AEMO) · Capacity pays most of a WA battery's revenue · In the NEM, only an award secures revenue | NEM全网电池价差（澳元/MWh） · 电池平均放电（MW） · 西澳电力批发市场（同口径） · 实测（AEMO） · 在西澳，容量收入占电池收入的大部分 · 在NEM，只有中标合同能锁定收入 |
| Caption | AEMO, Quarterly Energy Dynamics, September quarter of 2026, Figures 56 and 107 (workbook). The spread is the difference between the prices at which batteries charge and discharge. | AEMO《Quarterly Energy Dynamics》2026年第三季度，图56与图107（数据表）。价差指电池充电与放电价格之间的差额。 |

### nem-07 — Where the battery sits still matters

| Item | Shot specification |
| --- | --- |
| Scene | The region map from `nem-01` at a smaller scale, each region carrying its latest spread as a bound tag; one Example battery at a connection point with a loss-factor dial and a curtailment flag |
| Feedback | "By region" shows each region's spread for the latest quarter and the year before (bound). "At the connection point" turns the dial: the same energy, settled at a loss factor set each financial year |
| Evidence and chart | CL-NEM-14 (SRC-NEM-05, p. 39; SRC-NEM-19); the model's haircut for loss factors and curtailment (REPO-NEM-LIVE: `naqFactor` in `src/markets/nem/comparison.js`, a model input, not shown as a figure); the platform's reference region (NSW1, `src/markets/nem/comparison.js`) |
| Authoring check | Regional spreads move from quarter to quarter and region rankings change; the latest quarter is not a ranking for site selection. Loss factors are published per connection point and are fixed for each financial year; the story shows the mechanism, not any site's factor. The model's haircut is an assumption across the fleet, not a measured value for an asset: keep it off the page as a number. NSW1 is the model's reference region, chosen for depth of data, not a recommendation |
| Mobile | Region list with spread tags; one dial card |
| Status | Spreads and loss-factor rule `sourced`; model treatment `model-assumption` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Does it matter where in the NEM the battery is? | 电池位于NEM的哪个位置重要吗？ |
| Copy | Yes, for the merchant part. Spreads fell in every region over the past year, but not by the same amount: in the September quarter of 2026, New South Wales had the narrowest at ‹bound: spread NSW latest›. And at its own connection point a battery's energy is settled through a loss factor that AEMO fixes for each financial year, so two batteries in one region can earn different amounts for the same output. | 对市场化收入而言，重要。过去一年各价区的价差都在收窄，但幅度不同：2026年第三季度，新南威尔士的价差最窄，为‹bound: spread NSW latest›。在电池自身的并网点上，其电量还要乘以AEMO每个财年确定一次的网损系数结算，因此同一价区的两台电池，相同出力也可能收入不同。 |
| Meaning | The award secures the core; region and connection point decide the merchant remainder. | 中标合同锁定核心收入；价区与并网点决定其余的市场化收入。 |
| Marker | Fair evidence. What would change it: the loss factor and curtailment record at the asset's own connection point. | 证据尚可。会改变判断的证据：资产所在并网点自身的网损系数与弃电记录。 |
| Controls | By region · At the connection point | 按价区 · 在并网点 |
| Labels | Spread by region, latest quarter · A year earlier · Example: connection point · Loss factor, set each financial year · Curtailment · Observed (AEMO) | 各价区价差（最新季度） · 一年前 · 示例：并网点 · 网损系数（每财年确定） · 弃电 · 实测（AEMO） |
| Caption | Spreads: AEMO, Quarterly Energy Dynamics, September quarter of 2026. Loss factors: AEMO. | 价差：AEMO《Quarterly Energy Dynamics》2026年第三季度。网损系数：AEMO。 |

## 6. Add a battery

### nem-08 — Why four hours

| Item | Shot specification |
| --- | --- |
| Scene | Station cutaway: the same power equipment with energy blocks for each duration in the design grid; beside it, a three-row route strip (award, merchant, toll) showing which durations the platform prices for each route and whether any clears the platform's yields |
| Feedback | Each duration preset grows the energy blocks; "Show the design test" highlights the grid's best award cell and the bound build line; "Merchant only" shows the best merchant duration (bound) and that it does not clear |
| Evidence and chart | CL-NEM-15 (REPO-NEM-LIVE: `HOME_BRIEFING.grids.nem`, the `build` line); CL-NEM-08 for the four-hour-equivalent tender target (SRC-NEM-09); CF-NEM-08 |
| Authoring check | The platform prices the award route only at four hours, so "best" for the award is four by construction (CF-NEM-08); the reason the play is four hours is that tenders buy capacity in four-hour equivalents and awards are sized to it. Say that, not "four hours beats six for an award". Merchant designs lose value at every duration on the grid; never say longer batteries are unpaid. Best is by value per MW, not by return. If ‹bound: best duration› ever differs from the play's duration, the shot is queued for review |
| Mobile | Duration cards; then the three route rows; then the build line |
| Status | `model-assumption`; `sourced` to the model |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why ‹bound: play duration› hours? | 为什么是‹bound: play duration›小时？ |
| Copy | Because that is the size the tenders buy. The Capacity Investment Scheme counts storage in ‹bound: play duration›-hour equivalents, and the platform prices an award at that duration: ‹bound: best duration› hours is its best award design. On the merchant market alone, a longer battery does better, ‹bound: merchant best duration› hours on the design test, but no merchant design clears the platform's yields. Design test: ‹bound: build line› | 因为这是招标采购的规格。容量投资计划按‹bound: play duration›小时当量计算储能，本平台也按这一时长为中标合同定价：中标路径的最优设计为‹bound: best duration›小时。若只依靠市场化收入，时长更长的电池表现更好，设计测试中最优为‹bound: merchant best duration›小时，但没有任何纯市场化设计能达到本平台的收益率要求。设计测试：‹bound: build line› |
| Meaning | The award sets the duration; without one, no duration makes the case. | 时长由中标合同决定；没有中标合同，任何时长都撑不起投资逻辑。 |
| Marker | Fair evidence. What would change it: an award route priced at other durations, or a merchant design that clears the platform's yields. | 证据尚可。会改变判断的证据：为其他时长的中标路径定价，或出现能达到平台收益率要求的纯市场化设计。 |
| Controls | One option for each duration in ‹bound: design durations› · Show the design test · Merchant only | 按‹bound: design durations›逐一设置时长选项 · 显示设计测试 · 仅市场化 |
| Labels | Award · Merchant · Toll · Priced · Not priced · More energy · More capital · Design test: ‹bound: build line› | 中标合同 · 市场化 · 租赁 · 已定价 · 未定价 · 更多电量 · 更多资本 · 设计测试：‹bound: build line› |

### nem-09 — What an award does to the revenue

| Item | Shot specification |
| --- | --- |
| Scene | The scene recedes into a 2D teaching diagram: market revenue on the horizontal axis, what the owner receives on the vertical, a 45-degree line for "no award", and the award's collar: a floor segment that rises gently, a full-share middle, and a shallower segment above the ceiling. Unscaled, tagged Example. A band marks "where recent merchant revenue sits" without values |
| Feedback | "No award" shows the 45-degree line alone; "With an award" adds the collar; "Low market year" drops a point to the floor segment and shows the top-up arrow; "High market year" shows the share paid back above the ceiling |
| Evidence and chart | CL-NEM-07 (SRC-NEM-08, pp. 12–13, Table 5); the model's treatment (REPO-NEM-LIVE: `ltda` in `src/markets/nem/comparison.js`, which models the floor-binding regime as a fixed payment plus a share of market revenue); CL-NEM-16 |
| Authoring check | No axis values: floors, ceilings and caps are not published (SRC-NEM-12). The collar's slopes come from the published percentages, which bind; everything else is Example. The model's floor is the platform's estimate, built from two public bounds; never draw it or call it an award's floor. The payment cap limits both payments; show it as a cap symbol, unscaled. Payments start only at full operation |
| Mobile | Diagram full width; four buttons in two rows |
| Status | Rule `sourced`; diagram Example; model treatment `model-assumption` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What does an award change about the battery's revenue? | 中标合同让电池收入发生了什么变化？ |
| Copy | It cuts off the bad years and shares the good ones. In a year when market revenue falls below the floor, the Commonwealth tops up ‹bound: floor support share› of the gap, so the owner's revenue barely moves with the market. Above the ceiling, the owner pays back ‹bound: ceiling sharing share› of the excess. At recent merchant levels the floor is what matters, which is why most of this play's first-year modelled revenue, ‹bound: secured share›, counts as secured for ‹bound: secured tenor› years. The platform has to estimate the floor, because no award publishes one. | 它去掉了坏年景，并分享好年景。市场收入低于下限的年份，联邦政府补足差额的‹bound: floor support share›，因此所有者的收入几乎不随市场波动。高于上限时，所有者须返还超出部分的‹bound: ceiling sharing share›。按近期的市场化收入水平，起作用的是下限；这也是本方案首年模型收入中有‹bound: secured share›在‹bound: secured tenor›年内计为锁定收入的原因。由于没有任何中标合同公开下限，本平台只能自行估算。 |
| Meaning | An award's value is its floor, and only the holder knows it: that is why this play buys an executed award, not a forecast. | 中标合同的价值在于其下限，而下限只有持有人知道：因此本方案购买的是已签署的中标合同，而不是一份预测。 |
| Marker | Fair evidence. What would change it: an award's floor disclosed in a sale, or a published floor in the successor scheme. | 证据尚可。会改变判断的证据：交易中披露某份中标合同的下限，或后继机制公开下限水平。 |
| Controls | No award · With an award · Low market year · High market year | 无中标合同 · 有中标合同 · 市场低迷年 · 市场景气年 |
| Labels | Market revenue · Owner receives · Floor (not published) · Ceiling (not published) · Payment cap · Top-up · Paid back · Example · Where recent merchant revenue sits | 市场收入 · 所有者实收 · 下限（未公开） · 上限（未公开） · 支付上限 · 补足 · 返还 · 示例 · 近期市场化收入所在区间 |

## 7. Who pays

### nem-10 — The award first, for its term

| Item | Shot specification |
| --- | --- |
| Scene | The scene recedes; 2D payment paths for the award (awarded, agreement signed, fully operating, annual top-up or payback), energy (offered, dispatched, settled at the regional price through the loss factor) and fast services (enabled, paid); a fourth path for a toll, drawn dashed, as the other contract route |
| Feedback | The selected route's steps, then how it is paid, its obligation and its evidence status. The award path ends at a bound tenor, after which the energy path carries the battery alone |
| Evidence and chart | Award: CL-NEM-07 (SRC-NEM-08; SRC-NEM-12). Energy: CL-NEM-02, CL-NEM-14 (SRC-NEM-03; SRC-NEM-19). Services: CL-NEM-06. Toll: CL-NEM-18, candidate (no price published; the platform's coverage gap `contractPriceGap` in `src/markets/nem/sources.js`). Share and tenor: REPO-NEM-LIVE (`row.econ.secured`, `row.econ.securedYears`) |
| Authoring check | Name the secured tenor and what follows it: the merchant line alone. The secured share is the model's, on first-year revenue, priced on the platform's estimated floor; a real asset's share depends on its own floor. The award's payments are annual and settled after the fact against the year's revenue, not a fixed monthly fee; the settlement clauses are in the proforma agreement, not extracted here. A toll is a route the thesis names, but no Australian toll price is public, and on the design grid the toll design does not clear the platform's yields: show it as a route, not as this play |
| Mobile | One route at a time as stacked steps |
| Status | Award route `sourced` at the rule level; settlement clauses pending; energy and services `mechanism-exists`; toll `candidate` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Who pays this battery, and for how long? | 谁为这台电池付费？付多久？ |
| Copy | The award comes first. Once the battery is fully operating, the Commonwealth settles each year against the floor and ceiling in its agreement. In this play that covers ‹bound: secured share› of first-year modelled revenue, counted as secured for ‹bound: secured tenor› years; after that the battery earns only what the market pays. The market pays through AEMO, at the regional price adjusted for the connection point's loss factor, plus a small and shrinking amount for fast services. A toll, where a buyer pays a fixed fee for the battery's output, is the other contract route; no Australian toll price has been published. | 中标合同优先。电池全面投运后，联邦政府每年按协议中的下限和上限进行结算。在本方案中，这部分覆盖首年模型收入的‹bound: secured share›，在‹bound: secured tenor›年内计为锁定收入；此后电池只能获得市场支付的收入。市场收入经由AEMO结算，按所在价区电价并乘以并网点网损系数计算，另有一小部分且正在缩小的快速调频服务收入。租赁是另一条合同路径，由买方为电池的出力支付固定费用；但澳大利亚尚无任何租赁价格公开。 |
| Meaning | The secured part of this play lasts for the award's term; everything after it is merchant. | 本方案的锁定收入只覆盖中标合同期；此后的一切都是市场化收入。 |
| Marker | Fair evidence. What would change it: the settlement clauses of an executed agreement, and the floor of the asset being bought. | 证据尚可。会改变判断的证据：已签署协议的结算条款，以及拟收购资产的下限。 |
| Controls | Award · Energy · Fast services · Toll | 中标合同 · 电能量 · 快速调频服务 · 租赁 |
| Labels | Paid · Obligation · Evidence · After the term: merchant only | 计价 · 义务 · 证据 · 合同期后：仅市场化收入 |
| Award route | Awarded → Agreement signed → Fully operating → Yearly top-up or payback. Paid: a yearly top-up when revenue is below the floor, a payback above the ceiling, both capped. Obligation: the agreement's terms; support only once fully operating. Evidence: rule sourced, clauses pending | 中标 → 签署协议 → 全面投运 → 按年补足或返还。计价：收入低于下限时按年补足，高于上限时返还，二者均有上限。义务：遵守协议条款；全面投运后方可获得托底。证据：规则已有出处，条款待核 |
| Energy route | Offered → Dispatched → Settled at the regional price. Paid: per MWh at the regional price times the loss factor. Obligation: follow dispatch. Evidence: mechanism sourced | 报价 → 获得调度 → 按价区电价结算。计价：按价区电价乘以网损系数、每MWh计。义务：按调度指令运行。证据：机制已有出处 |
| Services route | Offered → Enabled → Paid for being ready. Paid: per MW enabled. Obligation: respond within the service's time. Evidence: product terms pending | 报价 → 获得启用 → 按待命付费。计价：按启用的MW计。义务：在服务规定时间内响应。证据：产品条款待核 |
| Toll route (dashed) | Signed with a buyer → The buyer dispatches → Fixed fee. Paid: a fixed fee for the term. Obligation: availability. Evidence: no price published | 与买方签约 → 买方调度 → 固定费用。计价：合同期内固定费用。义务：保证可用率。证据：无公开价格 |

## 8. The investment

### nem-11 — Bought at a price, not built

| Item | Shot specification |
| --- | --- |
| Scene | Two stations side by side: a new build under a crane (dashed) and an operating station holding its signed agreement, with a price tag; behind them, a short queue of awarded projects still under construction, drawn dashed |
| Feedback | "Build new" shows ‹bound: hold return› against ‹bound: target return›; "Buy operating" shows ‹bound: operating price ceiling› against ‹bound: build capex›. "How many are operating" opens the bound register count. All are values the market page already prints, or dated source records |
| Evidence and chart | CL-NEM-16 (REPO-NEM-LIVE: `row.econ.hold`, `row.investment.targetReturn`, `row.investment.capexPerMW`, `row.investment.operatingPurchase`); CL-NEM-09 (SRC-NEM-12; SRC-NEM-13); CF-NEM-01, CF-NEM-02 |
| Authoring check | The ceiling is the model's highest price for an operating asset at the operating target, on the platform's estimated floor: an upper bound to re-run against the asset's own floor, never a market price or a seller's ask. Reuse `projectFacts`' wording ("The return shown is for building it new"). The next action says "no more than build cost"; the ceiling is below build cost (CF-NEM-01): bind both, and let the analyst settle the wording. Few awarded batteries are operating yet (CL-NEM-09): say so as a dated count, not as a judgement. No new figures |
| Mobile | Two cards stacked; the queue as a third card |
| Status | `model-assumption` and `observed-data`; `sourced` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why buy an operating battery with an award, rather than build one? | 为什么收购持有中标合同的在运电池，而不是新建？ |
| Copy | Because at build cost the numbers do not reach the fund's target. A new ‹bound: play duration›-hour project with an award returns ‹bound: hold return›, against the fund's target of ‹bound: target return›. An operating asset that already holds a signed agreement meets the fund's operating target of ‹bound: operating target› only if bought for no more than ‹bound: operating price ceiling›, against ‹bound: build capex› to build new. Few such assets exist yet: on ‹bound: register date›, ‹bound: awarded batteries operating› of the ‹bound: awarded battery agreements› battery agreements on the Government's register were operating. | 因为按建设成本测算，数字达不到基金的目标。一个持有中标合同、新建的‹bound: play duration›小时项目，回报为‹bound: hold return›，而基金的目标为‹bound: target return›。已签署协议的在运资产，只有在买入价不高于‹bound: operating price ceiling›时，才能达到基金‹bound: operating target›的在运资产目标回报；相比之下，新建成本为‹bound: build capex›。这样的资产目前还很少：截至‹bound: register date›，政府登记册上的‹bound: awarded battery agreements›份电池协议中，有‹bound: awarded batteries operating›份已投运。 |
| Meaning | The price paid sets the return; the pool of assets to buy is still forming. | 买入价格决定回报；可供收购的资产池仍在形成之中。 |
| Marker | Fair evidence. What would change it: the first sales of operating batteries holding awards, at prices set against their build cost. | 证据尚可。会改变判断的证据：首批持有中标合同的在运电池的交易，以及其相对于建设成本的成交价格。 |
| Controls | Build new · Buy operating · How many are operating | 新建 · 收购在运资产 · 已投运多少 |
| Labels | The return shown is for building it new · Most the fund can pay for an operating asset · Awarded, under construction | 所示回报为新建项目情景 · 基金收购在运资产的最高价格 · 已中标，建设中 |

### nem-12 — What could weaken it, and what to watch

| Item | Shot specification |
| --- | --- |
| Scene | Calm overview with a strip of dated steps: Energy Ministers' consideration of the successor's draft law (December 2026), the results of the last dispatchable tender (indicatively December 2026), and the watched trigger (‹bound: next trigger›); more batteries drawn dashed along the evening; five factor cards |
| Feedback | Each factor names the line it affects and links to the matching section or downside input: more batteries to the trading input, the award's real floor to the fixed-payment input, the term to the fixed-term input, the price paid to Bankable case, delay to the delay input. The successor has no matching input and says so |
| Evidence and chart | REPO-NEM-LIVE (trigger, decision reason, counterpoint, return fields); CL-NEM-08 (Tender 10, SRC-NEM-09); CL-NEM-11; CL-NEM-17 (SRC-NEM-14, Recommendation 10 and pp. 178, 189–190; SRC-NEM-15); downside definitions (`src/experience/downsideNarrative.js`) |
| Authoring check | Name only the one trigger the call watches; the December 2026 steps are context (CF-NEM-07). The successor is a recommendation and a draft law: draw it dashed, and say "proposed". Its contracts would be standardised financial contracts for later years of a project's life, not a revenue floor; do not say how they would value an existing award. Do not predict spreads or the tender's results. The counterpoint is the analyst's: bind it, never paraphrase it |
| Mobile | Dated strip; factor cards; then the four links |
| Status | `sourced`; successor `official-plan` (proposed) |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What would make this play less attractive, and what should I watch? | 什么会削弱这个方案？应该关注什么？ |
| Copy | More batteries, a lower real floor than the platform assumes, and paying too much. Every round of awards adds batteries that compete for the same evening, and the last dispatchable round's results are due around December 2026. An asset's own floor may be below the platform's estimate, and the term ends with merchant revenue only. The scheme's proposed successor would offer standardised contracts instead of floors; Energy Ministers are due to consider its draft law in December 2026, and the first round is the event this call watches: ‹bound: next trigger›. Next: ‹bound: next action› | 更多的电池、低于平台假设的实际下限，以及买贵了。每一轮中标都会增加争夺同一个傍晚的电池，最后一轮可调度容量招标的结果预计在2026年12月前后公布。资产自身的下限可能低于平台的估算，而合同期满后只剩市场化收入。该计划拟议中的后继机制将以标准化合同取代收入下限；能源部长们预计于2026年12月审议其法律草案，而后继机制的首轮采购正是本判断所关注的事件：‹bound: next trigger›。下一步：‹bound: next action› |
| Meaning | Watch the successor's first round and the floor of the asset on offer; then the price. | 要盯住的是后继机制的首轮采购和待售资产的下限，其次是价格。 |
| Marker | Fair evidence. What would change it: Energy Ministers' decision on the successor in December 2026, and the last dispatchable round's results. | 证据尚可。会改变判断的证据：能源部长们2026年12月对后继机制的决定，以及最后一轮可调度容量招标的结果。 |
| Controls | More batteries · The real floor · After the term · Price paid · Delay | 电池增多 · 实际下限 · 合同期后 · 买入价格 · 投运延误 |
| Factor cards | Affects merchant revenue and the award's top-up; see the trading input · Affects secured revenue; see the fixed-payment input · Affects revenue after the term; see the fixed-term input · Affects the return directly; see Bankable case · Delays first support, which starts only at full operation; see the delay input · The other side: ‹bound: counterpoint› | 影响市场化收入及中标合同的补足金额；见交易收入输入项 · 影响锁定收入；见固定收入输入项 · 影响合同期满后的收入；见固定期限输入项 · 直接影响回报；见可融资方案 · 推迟首笔托底（全面投运后才开始）；见投运延误输入项 · 另一面：‹bound: counterpoint› |
| Exits | Bankable case · Revenue · Execution · Downside · Compare with WA | 可融资方案 · 收益拆解 · 执行步骤 · 下行风险 · 对比西澳 |

## 9. Binding, chart and traceability

### Evidence bindings proposed for the build

These read dated source records, not model results, and are **not existing runtime fields**. The build creates them with GAP-NEM-QED and GAP-NEM-CIS; until then the copy hides the number rather than inserting zero or a constant. Values are given for review only, in the source's own units (AUD).

| Token | Source record / field to bind | At check, 5 Nov 2026 |
| --- | --- | --- |
| ‹bound: spread latest› | GAP-NEM-QED: SRC-NEM-06, Figure 56, latest quarter | $59/MWh (September quarter of 2026) |
| ‹bound: spread two years before› | Same row, eight quarters earlier | $339/MWh (September quarter of 2024) |
| ‹bound: discharge latest› · ‹bound: discharge two years before› | SRC-NEM-06, Figure 56, average discharge | 680 MW · 86 MW |
| ‹bound: battery price-setting share› | SRC-NEM-05, Executive summary p. 4 (Figure 23 in the workbook) | 48% of dispatch intervals (18% a year earlier) |
| ‹bound: daytime charge latest› · ‹bound: evening discharge latest› | SRC-NEM-05, p. 4 and p. 37 | 13.4 GWh · 10.9 GWh a day |
| ‹bound: daytime charge year before› · ‹bound: evening discharge year before› | Same locator | 3.7 GWh · 3.2 GWh a day |
| ‹bound: spread NSW latest› | SRC-NEM-05, p. 39 | $51/MWh |
| ‹bound: service revenue share› | SRC-NEM-05, p. 38 | 2.3% of battery revenue |
| ‹bound: battery service volume share› | SRC-NEM-06, Figure 71 (title) | 75% of FCAS volume |
| ‹bound: floor support share› · ‹bound: ceiling sharing share› | SRC-NEM-08, Table 5 | 90% · 50% |
| ‹bound: support term max› | SRC-NEM-08, Table 5, Final Expiry Date | 15 years after the Support Start Date |
| ‹bound: awarded battery agreements› · ‹bound: awarded batteries operating› · ‹bound: register date› | GAP-NEM-CIS: SRC-NEM-13, dispatchable entries by stage | 17 · none · 23 October 2026 (copy must render "none" in words, 无, when the count is zero) |
| Round labels for `nem-04` | GAP-NEM-CIS: SRC-NEM-11 per round: date, MW, MWh, projects | See SRC-NEM-11; Tender 10 has no result yet |
| Chart and label values | GAP-NEM-QED rows (below) | Not stored here |
| ‹bound: history node› | H-NEM-01 to H-NEM-06 dates | See [Historical nodes](source-register.md#g1-nem-history) |

### Chart-NEM-SPREAD — signature chart contract

| Field | Specification / limit |
| --- | --- |
| Question | Why is the NEM's merchant spread not a base to underwrite? |
| Inputs | GAP-NEM-QED, one row per quarter from the September quarter of 2024 to the latest: NEM-wide battery price spread ($/MWh) and average battery discharge (MW) from the latest QED workbook's Figure 56 (SRC-NEM-06), which AEMO restates for nine quarters; the WEM's spread and discharge from Figure 107 of the same workbook, for the WA layer only. Each value carries its workbook vintage and figure number |
| Upper panel | Bars for the NEM spread by quarter, solid (observed). The WA layer, when on, adds the WEM spread as a thin line on the same axis, labelled "WEM (WA), same measure" |
| Lower panel | Average battery discharge, MW, NEM as bars or a solid line; the WA layer adds the WEM line, thin |
| Not drawn | No dual axis; no forecast; no model merchant path; no award floor or ceiling; no revenue per MW (AEMO's revenue figures are fleet totals, and the fleet's MW changes each quarter); no "record" label; no quarters before AEMO's restated window mixed with it without a vintage note |
| Economic meaning | As batteries discharge more, the difference between the prices they charge and discharge at falls. The two panels show the cause and the effect on one axis of time; the caption names what pays a battery in each market |
| Reconciliation | The latest and year-earlier spreads in the workbook equal the report's text (SRC-NEM-05, p. 39: $123 to $59); the June quarter of 2026 equals SRC-NEM-07's $51. A unit test at build checks both |
| Fallback | Until GAP-NEM-QED is built and its rights confirmed: an unscaled Example with the same shapes (bars falling while a line rises), no numeric axes |
| Rights | AEMO material may be used under AEMO's copyright permissions with attribution (as SRC-WA-13 records, and as the repository already does for WEM prices). The spread is a price-derived measure, so the analyst confirms it in the price-data review before the observed layer ships |

### Chart-NEM-DAY — the teaching chart for `nem-05`

| Field | Specification / limit |
| --- | --- |
| Question | What do batteries do to the shape of a NEM day? |
| Inputs | GAP-NEM-QED: SRC-NEM-06, Figure 15, the NEM average spot price for each five-minute interval of the day, September quarter of the latest year and of the year before, market time |
| Layers | Two solid lines on one $/MWh axis; the daylight charging hours and the evening peak shaded as AEMO defines them (10:00–16:00 and 16:00–21:00, SRC-NEM-05 p. 4) |
| Not drawn | No battery dispatch on the price axis; no forecast; no single day; no regional line |
| Fallback | An unscaled Example with the same shapes until GAP-NEM-QED is built and its rights confirmed |

### GAP-NEM-QED — the chart's data, not registered

| Field | Entry |
| --- | --- |
| Status | **Identified, not registered.** No NEM dataset exists in `src/governance/datasets.js`. The market module holds a few QED points as seeds (`src/markets/nem/data.js`: the June-quarter 2026 spread and its fall), not a series |
| Proposal for the build | An analyst-entered data module beside the NEM market, on the pattern of `src/markets/wa/data/esrRequirement.js`: one row per quarter with the NEM and WEM spreads and discharge, plus the time-of-day price lines for `nem-05` (Figure 15) and the regional spreads for `nem-07`, each with workbook URL, figure, vintage and check date. Not a catalogue dataset, no connector, no ETL. Not created in this PR |
| Source and terms | AEMO's QED report and workbook, published each quarter (SRC-NEM-05, SRC-NEM-06). AEMO's copyright permissions allow use with accurate attribution |
| Refresh | After each QED (next: the December quarter of 2026, due about late January 2027). Keep earlier vintages; AEMO restates the window each quarter |

### GAP-NEM-CIS — the tender and register records, not registered

| Field | Entry |
| --- | --- |
| Status | **Identified, not registered.** The market module holds two tender totals as seeds (`t8MW`, `t8MWh`, `t10MW`, `t10MWh` in `src/markets/nem/data.js`) |
| Proposal for the build | Analyst-entered rows: each dispatchable round's date, awarded MW, MWh and project count (SRC-NEM-11), and the register's dispatchable count by stage with its "correct as at" date (SRC-NEM-13). No project names on the page |
| Refresh | After each round's results and each quarterly register update (next: Tender 10, indicatively December 2026) |

ASSET-NEM-REGIONS (for `nem-01` and `nem-07`): the NEM regions drawn from Natural Earth's public-domain admin-1 boundaries for Queensland, New South Wales with the ACT, Victoria, South Australia and Tasmania, joined to the WA story's `WA_ISLAND_MAP` (`src/markets/wa/story/geo.js`), which already carries an `nem` outline and an Adelaide anchor. Shaded and labelled approximate. The repository's `src/markets/nem/au-boundary.json` holds only the national outline, and `src/markets/nem/nem-zones.json` holds the grid tab's zones; neither is redrawn. Built in the build step, with its size checked against the story-chunk budget.

### Source-to-shot mapping

| Shot | Claims → sources | Chart / binding owner | Likely misreading prevented |
| --- | --- | --- | --- |
| nem-00 | REPO-NEM-LIVE; CL-NEM-03, -07, -11 | Existing play card | A typed fleet size or secured share beside the card's different figures |
| nem-01 | CL-NEM-02 → SRC-NEM-01/03/04/19; CL-WA-05 | ASSET-NEM-REGIONS; WA map | One national price, or the NEM and WA as one grid |
| nem-02 | CL-NEM-03 → SRC-NEM-02/14/15; CL-WA-06; H-NEM-01 to -06 | History bindings | A capacity payment arriving with the reforms |
| nem-03 | CL-NEM-05 → SRC-NEM-16/17/18; CL-NEM-06 → SRC-NEM-05/06; CL-NEM-19 (candidate) | Service-share tokens | Fast services as a growing line |
| nem-04 | CL-NEM-07 → SRC-NEM-08/12; CL-NEM-08 → SRC-NEM-09/10/11 | GAP-NEM-CIS | A tender result read as a signed contract, or a published floor |
| nem-05 | CL-NEM-10 → SRC-NEM-05/06 | Chart-NEM-DAY (GAP-NEM-QED) | Midday power as free, or batteries as the only cause of lower prices |
| nem-06 | CL-NEM-11/12 → SRC-NEM-05/06/07; CL-NEM-13 → SRC-NEM-05/06; CL-WA-06/11 | Chart-NEM-SPREAD | "Record low"; the spread read as revenue per MW; WA levels compared with the NEM's |
| nem-07 | CL-NEM-14 → SRC-NEM-05/19; REPO-NEM-LIVE (`naqFactor`) | Regional tokens | One region's spread as a site ranking |
| nem-08 | CL-NEM-15 → REPO-NEM-LIVE; CL-NEM-08 → SRC-NEM-09 | Design grid | Four hours as best on the award route by comparison, when it is the only priced award design |
| nem-09 | CL-NEM-07 → SRC-NEM-08; CL-NEM-16 → REPO-NEM-LIVE | Teaching diagram; percentage tokens | The model's estimated floor read as an award's floor |
| nem-10 | CL-NEM-07, -02, -06, -14, -18; REPO-NEM-LIVE | Share and tenor fields | The award as a fixed fee, or as lasting the asset's life |
| nem-11 | CL-NEM-16 → REPO-NEM-LIVE; CL-NEM-09 → SRC-NEM-12/13 | Return, capex and ceiling fields; register tokens | The ceiling read as a market price; awarded assets assumed to be for sale now |
| nem-12 | REPO-NEM-LIVE; CL-NEM-08, -11, -17 → SRC-NEM-09/14/15 | Trigger, counterpoint, returns | The successor as law, or as a guaranteed improvement |

Reverse traceability: each SRC-NEM record in the register names its claims, and each claim names its shots, so a superseded source queues a finite set of shots, translations and labels for review.

## 10. G-1 record

Research found nothing that changes the published call. It strengthens the case for buying an awarded asset rather than building one, and it corrects two typed details in the view's text. Several findings are for the analyst rather than the story; none was acted on.

| Review | Status / required analyst judgement |
| --- | --- |
| Electricity mechanics | Pending: regional five-minute prices; energy only since 1998, kept by the December 2025 review; the award's collar; AEMO's battery spread and its definition; loss factors fixed by financial year |
| Investment meaning | Pending: an award as the only secured line; four hours as the tender's unit; buying an operating awarded asset at a price below the operating ceiling; the pool of such assets still forming; the counterpoint left bound |
| English and Chinese | Pending: same meaning for award (中标合同), floor and ceiling (下限、上限), spread (价差), fast services (快速调频服务), loss factor (网损系数), region (价区) and toll (租赁); all model figures bound |
| Script decision | **Analyst: sign off `nem-00` to `nem-12`, or identify changes.** |
| Build boundary | Stop here. No application code, dataset registration, data module, snapshot, model or view change, rendering, build or deployment in this task |

Open questions for the analyst at G-1:

1. **The argument in §1**, including the reading that batteries are closing the spread they earn (AEMO's attribution) and the WA contrast in `nem-06`: same squeeze, different cushion.
2. **The signature chart**: Chart-NEM-SPREAD as specified, AEMO's NEM battery spread and discharge from the September quarter of 2024, with the WEM's same measures as an optional layer. Keep the WA layer, or move the contrast to the caption only?
3. **CF-NEM-01, the next action against the operating ceiling.** The action says "pay no more than build cost". At build cost the return is below the fund's target, and the model's highest price that meets the operating target is below build cost. Should the action name the ceiling, or keep build cost as an outer limit?
4. **CF-NEM-02, the operating pool.** The play buys operating assets with an executed award. On DCCEEW's register (23 October 2026) none of the 17 battery agreements is yet operating; most awarded projects target operation in 2028 and 2029. Does the play's timing, `where` or next action need to say so? And do batteries holding a NSW Roadmap agreement from the 2023 pilot count as "holding a tender award" (CL-NEM-18)?
5. **CF-NEM-03, the thesis's typed details.** It says the fleet "neared 8,000 MW" and the spread is "at a record low". AEMO reports more than 10 GW / 23 GWh installed including commissioning at the end of September 2026, and does not call any quarter a record low. Revise the thesis wording? (No view edit here.)
6. **CF-NEM-04, the secured share in the grade reason.** The revenue-certainty reason types a share from the 12 October design grid; the card shows the investment layer's share. Update the reason, or confirm the basis?
7. **CF-NEM-05, nominal floors.** Awards are bid as fixed nominal amounts or a fixed schedule; the platform's convention indexes contracted lines. The convention is settled; confirm the story's rule never to say an award rises with inflation.
8. **CF-NEM-06, the NEM source register.** Two links in `src/markets/nem/sources.js` return 404 (`nelson`, `mlf`), and `contractPriceGap` says the review recommends publishing the successor's clearing prices, which the final report does not say. A separate data change; not made here.
9. **CF-NEM-07, earlier dated steps.** Energy Ministers' December 2026 consideration of the successor's law and Tender 10's results both fall before the watched trigger. Context only, or add either as a trigger?
10. **The toll route.** The thesis says "on a tender award or a toll". This script shows the toll as a dashed route in `nem-10` and the design grid in `nem-08`. Is that enough, or does the toll need its own shot?
11. **The 2016 node.** Keep South Australia's black system as the start of the battery history, with the entry-through-fast-services reading marked "to be confirmed" until CL-NEM-19 is sourced, or drop the node?
12. **Each shot's marker and "What would change it" line.** Strong markers assume this review; `nem-03`, `nem-07` to `nem-12` stay Fair because they rest on the model, unextracted clauses, a candidate claim or a draft law.
13. **The Chinese drafts.**
14. **Rights** for the observed layers of `nem-05`, `nem-06` and `nem-07` (AEMO QED workbook), in the separate price-data review.

## 11. Sources and claims

Canonical [sources, history, gaps and conflicts](source-register.md#g1-nem-evidence) and [claim ledger](market-narratives.md#g1-nem-claims). IDs in the shots resolve there. The script owns scene and bilingual page copy; the registers own the evidence records.
