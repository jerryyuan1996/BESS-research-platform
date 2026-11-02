# Romania: Six-Chapter Storyboard

Pack: BESS-IX-2026-10-30; Romania script researched 31 October 2026; shot layout v1.2  
Status: G-1 signed off 1 November 2026 and reconciled to the approved model/function changes. This is a G-1 script; G-2 construction, dataset and rights gates remain explicit. Merge only after dependency and exact-head checks pass.
Navigation: [Master plan](README.md) | [Narrative method](market-narratives.md) | [Evidence specification](evidence-and-content-specification.md) | [Sources and claims](#10-sources-and-claims) | [Finland format](finland-storyboard.md)

## 1. Scope, argument and reading route

**Explain the current fund call: Situational, buying an operating two-hour merchant battery, and only once an optimiser floor has been negotiated.** The priced case is merchant. The floor is a condition of entry and a diligence gate (OC-RO-FLOOR), never priced or secured revenue in this story (open-calls ruling 3A, 31 October 2026).

Allocation: `ro`; physical boundary: Romania's national power system and its single bidding zone, coupled into the European day-ahead market. Default lens: `infraFund`. `reviewedAgainst`: **REPO-RO-LIVE**, `main` at `edcb39ca0d69397f3683dffc9af5ffb49473c98c`, evaluated for 2026-10-31: verdict `opportunistic`, displayed **Situational / 择机投入**, tier `situational`; play **`ro-mer-2h`**, label "Merchant · 2h" / "市场化 · 2小时", route `mer`, two hours, stage `operating`; evidence `fair`; next trigger `ro-grant-status-review` (2 November 2026); `changesIf`: `ro-grant-call-close`, `ro-connection-guarantee-order`, `ro-grant-status-review`. The fund verdict's `where` reads "An operating two-hour asset with an optimiser floor". All page figures bind to results or dated records; none is copied from the view's thesis or `play.why`, which carry typed figures (CF-RO-03).

The argument, in order:

1. Romania is one price zone. Its two-sided day-ahead auction has run since 2005 and has been coupled with Europe's since 2021. There is no capacity payment, so a battery earns only what it trades (CL-RO-03, CL-RO-04).
2. Spreads are wide because solar is being built fast and fills the midday, while the evening is left to scarcer, dearer supply (CL-RO-11). The size of the spread is not shown as observed: the platform's Romanian statistics were computed on a private-use price mirror and wait on gate MR-4.
3. Bulgaria built a much larger battery fleet first, but coupled prices separate once the interconnector is full, so the neighbour's batteries trim Romania's evening price only up to the border's limit. The platform reads Romania's own build as the larger risk (CL-RO-09, CL-RO-10; Thin until MR-4).
4. Romania's own fleet is growing fast. The transmission operator counted 989 MW on 1 August 2026 and expects about 1,000 MW more by year-end, which would pass the national plan's 2030 level. The model takes a dated path off the two-hour value, most of it before its first operating year (CL-RO-07, CL-RO-08, CL-RO-12).
5. On merchant revenue alone, two hours gives the most value per MW: four hours earns more per MW, but its extra hours earn less than they cost on the model's compressing spread (CL-RO-13).
6. Nothing is secured, and reserves are a fading top-up (CL-RO-14, CL-RO-15). A capital grant lowers what a new battery costs to build, never what it earns. The current call is unresolved (CL-RO-16, CL-RO-17, CL-RO-19). So a fund buys an operating asset, which already holds its connection, and only with an optimiser floor whose terms pass OC-RO-FLOOR (CL-RO-18).

Comprehension check: from the story alone, the reader can say why the play is a two-hour merchant battery bought operating, why the priced case secures nothing, and why the fund still requires a negotiated floor before it enters.

**Competing explanation.** Romanian evening prices also rose with the 2025 drought and low Danube flows in 2026, gas prices and demand; part of today's spread may fade without any battery build, or widen. More interconnection, demand response (the regulator approved a consumption-flexibility service in August 2026) and pumped hydro compete for the same evening.

**Disconfirming condition.** A publishable day-ahead series (MR-4) showing a much narrower evening-over-midday gap; Romanian builds running far above the model's fleet path; a capacity mechanism; or no seller able to offer a floor on terms that pass OC-RO-FLOOR. A different call, play or best duration requires re-sign-off; research does not re-grade the call.

| Chapter / page heading EN · 简体中文 | Shots | What the reader can explain afterwards |
| --- | --- | --- |
| Opening · 先看投资判断 | ro-00 | The call, the play, what is priced and what must be in hand |
| Origins · 系统起点 | ro-01 | One price zone, coupled with neighbours, with no capacity payment |
| Historical choices · 历史选择 | ro-02–ro-03 | A traded price shared with Europe; rules that cut storage costs and ration connections |
| Today's tensions · 当下矛盾 | ro-04–ro-07 | Why the spread is wide; why Romania's own batteries matter more than the neighbour's; why reserves fade |
| Add a battery · 加入电池 | ro-08–ro-09 | Why two hours; who trades the battery |
| Who pays · 谁来付钱 | ro-10–ro-11 | Market revenue only; the grant is capital; the floor comes first |
| The investment · 回到投资 | ro-12 | What could weaken the call, and where to check it |

Thirteen shots, about five minutes. Shared fixed-view isometric SVG kit, off-white and deep green, plain HTML copy and accessible 2D equivalents. Maps are schematic: no interconnector counts, capacities, plant locations or measured flows. No model execution, dispatch engine or underwriting control inside the story.

### Rules for every shot

- **Figures.** Every amount, share, duration and count in page text is a ‹bound› token. Financial tokens resolve to fields the card, the design grid or the market model already carry; evidence tokens resolve to the dated records in §10 ([bindings](#9-binding-chart-and-traceability-contract)). Event dates are sourced facts and may be typed.
- **Prices.** No Romanian or Bulgarian day-ahead statistic appears as observed until it is recomputed from a publishable primary series (MR-4). Price-data rights are under the analyst's separate review. The one daily price shape in the story (ro-04) is tagged Example; the signature chart uses no price series.
- **The floor.** A condition of entry and a diligence gate, never drawn as a level, a secured share or modelled revenue (ruling 3A, OC-RO-FLOOR).
- **The grant.** Capital, paid once against build cost, competitively awarded; never income, and an award is never a receipt. The current call is unresolved (OC-RO-GRANT).
- **Controls.** Teaching state only: era, time of day, battery preset, market lane or hotspot. Nothing changes the case; "Go to the investment case" links to the market page.
- **Evidence.** One marker per shot in the fixed wording (Strong evidence / 证据充分, Fair evidence / 证据尚可, Thin evidence / 证据单薄), then "What would change it:" / "会改变判断的证据：". The opening inherits its card's marker. A Strong marker assumes the analyst's review at G-1. Example is a teaching tag, not a marker. A blocked observation is withheld, not relabelled Thin. No caveat paragraphs; gate IDs stay in authoring rows.
- **Time.** Observations solid; plans, estimates and the model path dashed; a "Checked" boundary precedes future items.
- **Two languages.** All page text is drafted below in English and Simplified Chinese with the same meaning. The Chinese is a draft for G-1. Scene, authoring, status and mobile rows are English authoring notes.

## 2. Opening

### ro-00 — The call · 先看投资判断

| Item | Shot specification |
| --- | --- |
| Scene | Small schematic Romania thumbnail (Carpathian arc, Danube border) beside the existing card; no animation |
| Feedback | None; this shot is the conclusion. A text alternative carries the same card fields and copy |
| Evidence and chart | REPO-RO-LIVE; CL-RO-04, CL-RO-18. Existing card fields only: call, play title, decision-panel metrics, the operating-purchase line, next action. No new chart |
| Authoring check | Reuse the card; never paste the view thesis or `play.why` figures. The card's headline return is the shared new-build case and the operating-purchase line beside it is the fund's entry price; neither is the design grid's build return (ro-08). The floor is a condition of entry, never secured or priced. If call, play or lens differ at build, `reviewedAgainst` queues review |
| Mobile | Card full width, short paragraph, two buttons; no scene before the conclusion |
| Status | `sourced` / `model-assumes-route`; floor `eligibility-unverified`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What is the call here, and what must be in hand before entry? | 这里的投资判断是什么？进入前必须先拿到什么？ |
| Copy | Existing play card: ‹bound: call› · ‹bound: play title› · ‹bound: card figures› · ‹bound: next action›. Beneath it: "The case on the card is merchant: modelled fixed revenue is ‹bound: secured share›. A fund buys in only once an optimiser has agreed a minimum-revenue floor, and those terms are not priced here. The story shows why the spread is wide, why Romania's own batteries compress it, why two hours, and why the floor comes first." | 现有方案卡：‹bound: call› · ‹bound: play title› · ‹bound: card figures› · ‹bound: next action›。卡片下方：“卡片上的情景为市场化情景：模型固定收入占比为‹bound: secured share›。只有在优化商同意提供最低收入保底之后，基金才会买入，而这些条款在此尚未定价。本故事说明：价差为何宽，罗马尼亚自身的电池为何压缩价差，为何选择两小时，以及为何必须先谈定保底。” |
| Marker | The play's own marker, already on the card | 沿用方案卡上该方案自身的证据标记 |
| Controls | Start the story · Go to the investment case | 开始阅读 · 前往投资方案 |

## 3. Origins

### ro-01 — One price zone, no capacity payment · 一个价区，没有容量付费

| Item | Shot specification |
| --- | --- |
| Scene | Fixed schematic of Romania: the Carpathian arc, the Danube along the southern border, the Black Sea coast. Generic symbols for hydro, nuclear, gas, lignite, wind and solar; generic interconnection symbols at the borders, with Bulgaria and Hungary labelled; one shaded national price zone |
| Feedback | "One price zone" shades the zone; "Coupled with neighbours" lights the border symbols. Caption outside the drawing: "Schematic" |
| Evidence and chart | CL-RO-03 (SRC-RO-10, SRC-RO-11); CL-RO-04 (REPO-RO-MODEL `capabilities`; no capacity-mechanism proposal located on 31 October 2026); generation types only, GAP-RO-HISTORY |
| Authoring check | No plant locations, line counts, capacities or flows. Generation is drawn by type with no shares until GAP-RO-HISTORY closes from a primary source. "No capacity payment" describes the current rules; a later mechanism would reopen the play |
| Mobile | Same schematic with a stacked legend and both toggles; the description reads without the map |
| Status | Coupling `sourced`; no-capacity rule from the model's capability flags; generation history qualitative; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What kind of market does a Romanian battery sell into? | 罗马尼亚的电池在什么样的市场中出售电力？ |
| Copy | Romania's power comes mostly from hydro, nuclear, gas and lignite, with wind and solar a fast-growing share. The whole country is one price zone, coupled with its neighbours' day-ahead markets. Nobody pays for capacity, so a battery earns only what it trades. | 罗马尼亚的电力主要来自水电、核电、天然气和褐煤，风电和光伏的占比正快速上升。全国是一个价区，与邻国的日前市场相耦合。这里没有人为容量付费，电池只能靠交易获得收入。 |
| Meaning | With no capacity payment, this play's revenue is merchant from the first day. | 没有容量付费，本方案的收入从投运第一天起就是市场化收入。 |
| Marker | Fair evidence. What would change it: a capacity or long-term flexibility mechanism approved for Romania. | 证据尚可。会改变判断的证据：罗马尼亚获批容量机制或长期灵活性机制。 |
| Controls | One price zone · Coupled with neighbours | 一个价区 · 与邻国耦合 |
| Labels | Romania · Bulgaria · Hungary · Danube · Carpathians · Black Sea · Hydro · Nuclear · Gas · Lignite · Wind · Solar · Price zone | 罗马尼亚 · 保加利亚 · 匈牙利 · 多瑙河 · 喀尔巴阡山脉 · 黑海 · 水电 · 核电 · 天然气 · 褐煤 · 风电 · 光伏 · 价区 |
| Caption | Schematic | 示意图 |

## 4. Historical choices

### ro-02 — A traded price, shared with Europe · 可交易的价格，与欧洲共享

| Item | Shot specification |
| --- | --- |
| Scene | Same Romania frame with a three-node timeline (H-RO-01–03); selecting a node lights one layer: the exchange, then three coupled neighbours, then the European coupling with the Bulgarian border |
| Feedback | Only the selected layer changes; event and interpretation sit in separate blocks |
| Evidence and chart | CL-RO-03: H-RO-01 (SRC-RO-08, pp. 4, 19), H-RO-02 (SRC-RO-09), H-RO-03 (SRC-RO-10; SRC-RO-11) |
| Authoring check | Coupling shares one price only while cross-border capacity is free; when an interconnector is full, prices separate. Do not say coupling makes Romanian prices equal to its neighbours'. No price series drawn (MR-4) |
| Mobile | Vertical node list; one diagram |
| Status | Events `historical-fact`, `sourced`; interpretation `proposed`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why does a Romanian battery start from a traded price? | 为什么罗马尼亚电池的收入从可交易的价格出发？ |
| Copy | Since 30 June 2005, Romania's exchange has run a day-ahead auction in which buyers and sellers both bid. In November 2014 it was coupled with the Czech, Slovak and Hungarian markets, and in 2021 with the European day-ahead coupling, including the border with Bulgaria. Coupled markets share one price until the interconnector between them is full. | 自2005年6月30日起，罗马尼亚电力交易所开始运行买卖双方共同报价的日前竞价市场。2014年11月，该市场与捷克、斯洛伐克和匈牙利市场耦合；2021年又并入欧洲日前耦合，其中包括与保加利亚的边境。相互耦合的市场共享同一价格，直到彼此之间的联络线满载为止。 |
| Meaning | The battery earns from Romania's own price, which separates from its neighbours' when the wires fill. | 电池的收入来自罗马尼亚本国电价；联络线满载时，这一电价就会与邻国电价分离。 |
| Marker | Strong evidence. What would change it: a change to Romania's single price zone or to its coupling with neighbouring markets. | 证据充分。会改变判断的证据：罗马尼亚单一价区或其与邻国市场的耦合方式发生变化。 |
| Controls | Select a node · Event and source · Why it matters | 选择节点 · 事件与来源 · 投资含义 |

Timeline nodes (page text):

| Node | Field | English | 简体中文 |
| --- | --- | --- | --- |
| 30 June 2005 · A two-sided day-ahead auction | Constraint | The next day's power needed a transparent, traded price. | 次日的电力需要一个透明、可交易的价格。 |
| | Choice | New rules for the market operator's day-ahead auction, with buyers and sellers both bidding. | 市场运营机构的日前竞价采用新规则，买卖双方共同报价。 |
| | What remains | A price for every hour of every day. | 每天每小时都有一个价格。 |
| | Effect today | A battery's revenue starts from this price. | 电池的收入从这一价格出发。 |
| November 2014 · Coupled with three neighbours | Constraint | Separate national auctions used cross-border capacity poorly. | 各国分别竞价，跨境容量未能得到有效利用。 |
| | Choice | One price calculation with the Czech, Slovak and Hungarian markets. | 与捷克、斯洛伐克和匈牙利市场统一计算价格。 |
| | What remains | Prices converge whenever cross-border capacity allows. | 只要跨境容量允许，价格就会趋于一致。 |
| | Effect today | Neighbouring supply can narrow Romania's spread, up to the border's limit. | 邻国的供给可以收窄罗马尼亚的价差，但以边境容量为限。 |
| 2021 · Into the European coupling, then the Bulgarian border | Constraint | The Romania–Bulgaria border sat outside the common day-ahead calculation. | 罗马尼亚与保加利亚的边境未纳入统一的日前计算。 |
| | Choice | Romania joins the single day-ahead coupling on 17 June 2021; the Bulgarian border follows on 27 October 2021. | 罗马尼亚于2021年6月17日加入单一日前耦合；与保加利亚的边境于2021年10月27日随后并入。 |
| | What remains | Prices and cross-border flows are calculated together across the region. | 区域内的价格与跨境潮流同时计算。 |
| | Effect today | Bulgaria's batteries reach Romania only as far as the interconnector allows. | 保加利亚的电池只能在联络线容量范围内影响罗马尼亚。 |

### ro-03 — Rules that made room for storage · 为储能腾出空间的规则

| Item | Shot specification |
| --- | --- |
| Scene | Same frame; a rule overlay with three dated cards (H-RO-04–06): tariffs, connection, grant. The grant card's outcome is dashed beyond a "Checked" boundary |
| Feedback | Selecting a card shows what it changed and what it does not do |
| Evidence and chart | H-RO-04: CL-RO-05 (SRC-RO-12). H-RO-05: CL-RO-06 (SRC-RO-13; SRC-RO-14 flagged, CF-RO-08). H-RO-06: CL-RO-16, CL-RO-19 (SRC-RO-03, -04, -05, -06, -07) |
| Authoring check | The tariff exemption covers only energy stored and fed back; the battery's own consumption and losses still pay. Connection auctions ration access and cost the developer guarantees; they pay nothing. A scheme budget is not an award, programme funding confirmed or disbursed to the state is not a beneficiary list, and an award is not a receipt. Never describe the call as closed or awarded (OC-RO-GRANT) |
| Mobile | Three stacked cards; the dashed-outcome legend stays visible |
| Status | H-RO-04 and the scheme `sourced`; H-RO-05 from repository records; grant outcome `missing`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What changed for storage, and what did not? | 储能的规则改变了什么，又有什么没有变？ |
| Copy | In July 2025 the regulator stopped charging network tariffs twice on energy that is stored and fed back. Since 2026, grid connections of ‹bound: auction threshold› and more are allocated by auction, against guarantees. An EU-approved scheme now offers grants towards building new stand-alone batteries; the timetable and outcome of its first call remain unverified. None of these pays a battery for what it does. | 2025年7月，监管机构不再对储存后回送电网的电量重复收取电网费。自2026年起，‹bound: auction threshold›及以上的并网容量须通过拍卖分配，并须提交保函。经欧盟批准的计划如今为新建独立电池提供建设补贴，其首轮申报的时间表与结果仍未核实。这些规则都不为电池提供的服务付费。 |
| Meaning | These rules cut a cost or ration access; the play's revenue still comes from the market. | 这些规则降低了成本或限制了准入；本方案的收入仍来自市场。 |
| Marker | Fair evidence. What would change it: the regulator's text of any 2026 order on licences or guarantees, read against the auction rules, and the ministry's published grant lists. | 证据尚可。会改变判断的证据：监管机构2026年关于许可或保函的法令文本（对照拍卖规则核读），以及能源部公布的补贴名单。 |
| Controls | Tariffs · Connection · Grant · Checked boundary | 电网费 · 并网 · 补贴 · 核查截止线 |
| Labels | Network tariffs · Connection auction · Guarantees · Grant scheme · Outcome unverified · Checked: ‹bound: research check date› | 电网费 · 并网拍卖 · 保函 · 补贴计划 · 结果尚未核实 · 核查截至：‹bound: research check date› |

Timeline nodes (page text):

| Node | Field | English | 简体中文 |
| --- | --- | --- | --- |
| 8 July 2025 · Storage stops paying network tariffs twice | Constraint | Stored energy paid network tariffs when it was taken in and again when it was used. | 储存的电量在充电时缴一次电网费，使用时又缴一次。 |
| | Choice | Exempt energy stored and fed back from transmission, distribution and system-service tariffs and from green certificates. | 储存后回送电网的电量，免缴输电、配电和系统服务费用，并免于绿证义务。 |
| | What remains | The battery's own consumption and losses still pay. | 电池自身的用电和损耗仍须缴费。 |
| | Effect today | Each cycle costs less to run. | 每次充放电循环的运行成本降低。 |
| 2026 · Connection by auction | Constraint | Requests to connect far exceeded what the grid could take. | 并网申请远超电网的承载能力。 |
| | Choice | Allocate capacity of ‹bound: auction threshold› and more by annual auction, with participation and connection guarantees. | ‹bound: auction threshold›及以上的并网容量按年度拍卖分配，并须提交参与保函和并网保函。 |
| | What remains | Auctions run from 30 October 2026, for capacity that becomes available two years after the auction year. | 拍卖自2026年10月30日起进行，所分配的容量在拍卖年份两年之后才可使用。 |
| | Effect today | New projects wait longer and post more security; an operating battery already holds its connection. | 新项目等待更久、须提交更多担保；在运电池已持有并网权。 |
| 2026 · Grants for stand-alone batteries (outcome dashed) | Constraint | Variable renewables need more storage to join the grid smoothly. | 波动性可再生能源需要更多储能才能顺利并网。 |
| | Choice | Direct grants for new stand-alone batteries, awarded by tender on aid per MWh, approved by the European Commission on 6 March 2026. | 以直接补贴支持新建独立电池，按每MWh补贴额竞标授予；欧盟委员会于2026年3月6日批准该计划。 |
| | What remains | The first call's timetable and outcome remain unverified at the latest check. | 截至最近一次核查，首轮申报的时间表与结果仍未核实。 |
| | Effect today | Grant-funded batteries will add to the home fleet; a grant cuts what a battery costs to build, not what it earns. | 获补贴的电池将增加本国储能规模；补贴降低的是电池的建设成本，而非其收入。 |

## 5. Today's tensions

### ro-04 — Why the spread is wide · 价差为何宽

| Item | Shot specification |
| --- | --- |
| Scene | Same Romania frame across one Example day: midday with solar lit and the exchange price low; evening with solar dark, demand high and the remaining supply symbols (hydro, gas, imports) lit |
| Feedback | An unscaled Example price shape, low at midday and high in the evening, with the gap labelled "Spread". The Example tag is always visible; no axis values |
| Evidence and chart | CL-RO-11: solar build SRC-RO-01, p. 1 (solar connected in 2026); SRC-RO-20 (prosumers, reported); GAP-RO-PRICES and MR-4 for any observed spread; REPO-RO-MODEL `merchantEvidence` (basis, not shown) |
| Authoring check | No observed Romanian day-ahead figure: the platform's Romanian spread statistics were computed on a private-use mirror and stay withheld until recomputed from a publishable primary series (MR-4). Price-data rights are under separate review. Draw the Example shape only. Drought, gas and demand also move prices; the shot names the main mechanism, not the only cause. A spread is a price opportunity, not captured cash |
| Mobile | Two stacked panels (midday, evening) sharing the Example shape; text first |
| Status | Mechanism `sourced` / `proposed`; observed layer `blocked` (MR-4, `rights-unresolved`); G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why is the gap between cheap and dear hours so wide? | 便宜时段与高价时段之间的差距为何这么大？ |
| Copy | Solar is being built fast, on rooftops and in large parks, so midday power is cheap. After sunset the solar is gone while demand stays high, so the evening price is set by the scarcer, dearer supply that is left: hydro, gas and imports. A battery buys at midday and sells in the evening. | 屋顶光伏和大型光伏电站都在快速建设，因此中午的电价低廉。日落后光伏出力消失，需求却依然很高，傍晚电价便由剩余的、更稀缺也更昂贵的供给决定：水电、天然气和进口电力。电池在中午买电，在傍晚卖电。 |
| Meaning | The spread carries this play's revenue; it is a price opportunity, not cash. | 本方案的收入靠价差支撑；价差是价格机会，并非现金。 |
| Marker | Fair evidence. What would change it: Romanian day-ahead prices recomputed from a publishable primary source, giving the evening-over-midday gap by year. | 证据尚可。会改变判断的证据：基于可公开发布的一手来源重新计算罗马尼亚日前电价，按年份给出傍晚与中午之间的价差。 |
| Controls | Midday · Evening · Show the spread | 中午 · 傍晚 · 显示价差 |
| Labels | Example · Cheap hours · Dear hours · Spread · Hydro · Gas · Imports | 示例 · 低价时段 · 高价时段 · 价差 · 水电 · 天然气 · 进口电力 |
| Caption | Example: the shape of a day, not observed prices. | 示例：一天中的电价形态，并非实际观测价格。 |

### ro-05 — The neighbour's batteries stay behind the border · 邻国的电池被边境挡住

| Item | Shot specification |
| --- | --- |
| Scene | Romania and Bulgaria side by side, the Danube border between them with one generic interconnector symbol. Bulgaria shows more battery symbols than Romania (qualitative). In the evening, Bulgarian output flows north until the interconnector symbol fills, then stops |
| Feedback | "Evening" fills the interconnector and shows "Border full: prices separate". The Bulgarian fleet reads ‹bound: Bulgaria fleet end-2025› with its date; no price figures |
| Evidence and chart | CL-RO-09 (SRC-RO-15, p. 3; 2026 counts reported); CL-RO-10 (merchant-lines plan §1, mirror-derived and withheld under MR-4); SRC-RO-11 (implicit allocation of the border) |
| Authoring check | Do not show the share of hours the two zones clear together, or the evening price gap: both were computed on the private-use mirror (MR-4). Bulgarian 2026 counts differ by source; use the Bulgarian operator's end-2025 figure as the dated observation and label later counts "Reported". Interconnector capacity is not quantified here |
| Mobile | Two stacked country panels with the border card between them |
| Status | Fleet `sourced` (end-2025); decoupling `blocked` (MR-4); interpretation `proposed`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | How can neighbouring batteries affect Romania? | 邻国电池如何影响罗马尼亚？ |
| Copy | Coupled markets can transmit part of a neighbouring battery fleet’s effect through cross-border trade. The interconnector limits that effect when it is constrained. This story has not established how often the border binds or how large the price effect is. | 耦合市场可以通过跨境交易传递邻国电池的部分影响。联络线拥塞时，传递会受到限制。本故事尚未证实边境有多频繁受到约束，也未证实对价格的影响有多大。 |
| Meaning | Cross-border competition remains relevant; compare it with domestic additions once publishable price evidence is available. | 跨境竞争仍然相关；取得可公开发布的价格证据后，再与本国新增储能的影响比较。 |
| Marker | Thin evidence. What would change it: the share of hours Romania and Bulgaria clear at the same day-ahead price, recomputed from a publishable primary source. | 证据单薄。会改变判断的证据：基于可公开发布的一手来源，重新计算罗马尼亚与保加利亚日前同价出清的小时占比。 |
| Controls | Midday · Evening · Border | 中午 · 傍晚 · 边境 |
| Labels | Bulgaria's batteries · Romania's batteries · Interconnector · Border full: prices separate · Reported | 保加利亚的电池 · 罗马尼亚的电池 · 联络线 · 边境满载：价格分离 · 报道数据 |

### ro-06 — Romania's own batteries · 罗马尼亚自己的电池 （signature chart / 核心图表）

| Item | Shot specification |
| --- | --- |
| Scene | **Signature chart Chart-RO-FLEET**, full width, with a small dusk thumbnail. Upper panel: connected battery storage in MW; Transelectrica's dated counts as solid points, its year-end estimate as a dashed point, the national plan's 2030 level as a dashed reference line. Lower panel, same calendar axis: the model's two-hour day-ahead value as an index of its basis year, dashed from the basis year to the model's first operating year and flat after the curve's last step |
| Feedback | EN: "Connected storage, MW (Transelectrica)"; "Transelectrica estimate, year-end"; "National plan, 2030"; "Model: two-hour value, as an index of its basis year". ZH as in Labels. Values only from ‹bound: fleet observations›, ‹bound: fleet year-end additions›, ‹bound: plan 2030 level› and ‹bound: value index path›; dates from the same records |
| Evidence and chart | CL-RO-07 (SRC-RO-01, pp. 1–2; SRC-RO-02); CL-RO-08 (SRC-RO-03, p. 4); CL-RO-12 (REPO-RO-MODEL: `merchantEvidence.year`, `merchantEvidence.restateFactor`, `economics.merchantCurve`, `economics.merchantCurveBasis`); CALC-RO-FLEET, CALC-RO-PATH, GAP-RO-FLEET |
| Authoring check | Two panels, two units, no shared ordinate and no crossing claim. The index is a model path, never "observed": its basis year's level was computed on the private-use mirror (MR-4) and is not shown. No four-hour line: the model applies one curve to every duration (CF-RO-01). No floor line: the floor is unpriced. The year-end point is Transelectrica's estimate, not a count; the plan level is a target. Counts mix stand-alone and hybrid-plant storage, as Transelectrica reports them |
| Mobile | Panels stacked with a shared date selection and a readable table of the dated points. If the fleet record is unavailable, a qualitative version tagged Example with no numeric axis |
| Status | One fleet point and the estimate opened in the primary; other points reported (GAP-RO-FLEET); path `model-assumption`; numeric production `blocked` until CALC-RO-FLEET is signed off. G-1 reviews the chart design; nothing is built |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What happens to the spread as Romania builds its own batteries? | 罗马尼亚自建电池之后，价差会怎样？ |
| Copy | Romania's battery fleet is growing fast. Transelectrica counted ‹bound: fleet count› on ‹bound: fleet count date› and expects about ‹bound: fleet year-end additions› more by the end of the year, which would pass the national plan's 2030 level. Each battery buys the cheap hours and sells the dear ones, so the spread narrows. The model takes its largest step off the two-hour value before its first operating year, ‹bound: curve first year›, then smaller steps as the curve flattens. | 罗马尼亚的电池规模增长很快。Transelectrica统计‹bound: fleet count date›为‹bound: fleet count›，并预计年底前再增加约‹bound: fleet year-end additions›，届时将超过国家规划的2030年水平。每台电池都在低价时段买电、在高价时段卖电，价差因此收窄。模型在其首个运营年（‹bound: curve first year›）之前对两小时价值作出最大的一次下调，此后曲线趋平，下调幅度逐步变小。 |
| Meaning | Most of the compression is already in the model before its first year; the open question is how far the fleet runs ahead of the model's path. | 模型在首个运营年之前已计入大部分价差压缩；尚待回答的是本国储能规模会比模型路径超前多少。 |
| Marker | Fair evidence. What would change it: Transelectrica's counts running ahead of the build the model assumes, or the curve re-fitted on Romania's own prices after the 2027 season. | 证据尚可。会改变判断的证据：Transelectrica的统计持续高于模型假设的建设规模，或在2027年运行季之后以罗马尼亚本国电价重新拟合曲线。 |
| Controls | Fleet · Model path · Show definitions | 储能规模 · 模型路径 · 查看口径 |
| Labels | Connected storage, MW (Transelectrica) · Transelectrica estimate, year-end · National plan, 2030 · Model: two-hour value, as an index of its basis year · Model path, not observed | 已并网储能（MW，Transelectrica） · Transelectrica年底估计 · 国家规划（2030年） · 模型：两小时价值（以基准年为基数的指数） · 模型路径，非观测值 |
| Caption | Fleet: Transelectrica, stand-alone and hybrid-plant storage. Index: the platform's model, fitted on Bulgaria's 2026 experience. | 储能规模：Transelectrica，含独立储能与混合电站内的储能。指数：本平台模型，依据保加利亚2026年的经验拟合。 |

### ro-07 — Reserves fill first · 备用市场先饱和

| Item | Shot specification |
| --- | --- |
| Scene | Response ladder (seconds, minutes, hours) beside the battery; the reserve the grid operator buys drawn as a small fixed block that a growing number of battery symbols compete for |
| Feedback | "More batteries" adds symbols against the same block; the "Reserve income" bar shortens qualitatively, tagged "Model assumption". No prices or MW |
| Evidence and chart | CL-RO-14: REPO-RO-MODEL `services`, `servicesCurve` (saturation calibrated on Great Britain); SRC-RO-03, p. 10 (grant winners must seek balancing qualification); GAP-RO-RESERVES |
| Authoring check | Reserve capacity prices (per MW per hour) are not energy spreads; never share an axis. The saturation is the model's assumption, calibrated on Great Britain, not a Romanian observation; the verdict's "saturating" rests on it (CF-RO-07). Not every battery qualifies for every product |
| Mobile | Static ladder with the qualitative bar beneath |
| Status | `model-assumption`; research hypothesis; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Can reserve payments carry the case instead? | 备用服务收入能否转而支撑这项投资？ |
| Copy | The model assumes reserve income fades as more batteries compete for a limited procurement volume. That curve was calibrated on Britain, not on a Romanian reserve-price series. Local procurement results are needed to test it. | 模型假设，更多电池争夺有限采购量时，备用收入会逐步减少。这条曲线以英国经验标定，并非根据罗马尼亚备用价格序列得出；需要本地采购结果来检验。 |
| Meaning | Treat fading reserve revenue as a model assumption; trading carries the priced case. | 备用收入递减属于模型假设；已定价情景依靠电力交易。 |
| Marker | Thin evidence. What would change it: Transelectrica's frequency-reserve procurement results for 2025–2026, by product. | 证据单薄。会改变判断的证据：Transelectrica按品种公布的2025–2026年频率备用采购结果。 |
| Controls | Seconds · Minutes · Hours · More batteries | 秒级 · 分钟级 · 小时级 · 更多电池 |
| Labels | Frequency containment · Frequency restoration · Trading · Reserve income · Model assumption | 频率遏制 · 频率恢复 · 电力交易 · 备用收入 · 模型假设 |

## 6. Add a battery

### ro-08 — Why two hours · 为什么是两小时

| Item | Shot specification |
| --- | --- |
| Scene | Shared station cutaway; the same power block, energy blocks changing with the preset; a small qualitative bar shows the extra hours' cost against what they add |
| Feedback | Highlights the design grid's best cell; optional labels "Model value: ‹bound: merchant value at best›" and "‹bound: merchant value longer›" from the grid. The preset never changes the case |
| Evidence and chart | CL-RO-13: REPO-RO-LIVE `grids.ro` (`byRoute.mer.best`; the two- and four-hour merchant cells); REPO-RO-MODEL `durationResponse.merchantCapture`, `capexStack`; merchant-lines plan §1 (Checks: in Bulgaria four-hour value compressed slightly less than two-hour) |
| Authoring check | Best is by value per MW, not by highest return. Never say four hours "falls faster" in spread terms: the model applies one curve to every duration, and Bulgaria's four-hour value compressed slightly less (CF-RO-01). The duration capture curve was derived on the private-use mirror; call it the model's, not observed (MR-4). The teaching battery is 100 MW, tagged Example. Do not set the grid's build return beside the card's new-build return as one figure |
| Mobile | Cutaway with two presets; the grid's preferred cell in text below |
| Status | `model-assumption`, `sourced`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why ‹bound: play duration› hours rather than ‹bound: longer merchant duration›? | 为什么是‹bound: play duration›小时，而不是‹bound: longer merchant duration›小时？ |
| Copy | On merchant revenue alone, the design grid's best value is at ‹bound: best merchant duration› hours. A ‹bound: longer merchant duration›-hour battery earns more per MW, but its extra hours sell into a narrower part of the evening, and each costs a full block of storage. On the model's compressing spread, those hours earn less than they cost. | 仅按市场化收入测算，设计矩阵的最优价值出现在‹bound: best merchant duration›小时。‹bound: longer merchant duration›小时电池每MW的收入更高，但多出的时长只能卖在傍晚更窄的价差上，而每多一小时都要多建一整组储能。在模型不断收窄的价差下，这些时长赚回的钱低于其成本。 |
| Meaning | ‹bound: play duration› hours is a capital choice, the most value per MW on the model's merchant path; no rule requires it. | ‹bound: play duration›小时是资本决策：在模型的市场化路径下每MW价值最高；并没有规则要求这一时长。 |
| Marker | Fair evidence. What would change it: a battery cost, duration capture or fleet path that moves the design grid's best cell. | 证据尚可。会改变判断的证据：电池成本、时长收益捕获或储能增长路径发生变化，使设计矩阵的最优单元改变。 |
| Controls | ‹bound: best merchant duration› h (Example) · ‹bound: longer merchant duration› h (Example) · Open the design grid | ‹bound: best merchant duration›小时（示例） · ‹bound: longer merchant duration›小时（示例） · 查看设计矩阵 |
| Labels | Power block · Energy block · Extra hours · Model value per MW · Example: 100 MW battery | 功率模块 · 储能模块 · 新增时长 · 模型每MW价值 · 示例：100MW电池 |

### ro-09 — Who trades the battery · 谁来交易这台电池

| Item | Shot specification |
| --- | --- |
| Scene | Battery and an optimiser's desk; three lanes (day-ahead, intraday, balancing) drawing on one shared stack of MW and MWh; a fee slice |
| Feedback | Selecting a lane shows what it uses; committing MW to reserves shrinks what trading can use ("Already committed"). The fee reads ‹bound: optimiser fee› |
| Evidence and chart | CL-RO-15 (SRC-RO-03, p. 10: markets directly or through an aggregator); REPO-RO-MODEL `feePct`, `merchantEvidence` (full realisation, MR-1); REPO-06 stack feasibility |
| Authoring check | Never add lane maxima; one MW is sold once. Full capture of perfect-foresight day-ahead value is the model's assumption, with quarter-hour and intraday trading taken to offset imperfect foresight (MR-1); say so. No optimiser or project named |
| Mobile | Three stacked lane cards and the shared-capacity bar |
| Status | Routes `sourced`; realisation `model-assumption`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Who actually sells the battery's power? | 实际上由谁来出售电池的电力？ |
| Copy | Usually an optimiser. It bids the battery into the day-ahead and intraday markets and into balancing, and takes a fee. The same megawatts cannot be sold twice. The model assumes the battery captures all the day-ahead value it could have scheduled with hindsight, with quarter-hour and intraday trading making up for imperfect forecasts. | 通常由优化商负责。它把电池报入日前市场、日内市场和平衡市场，并收取费用。同一份兆瓦不能重复出售。模型假设电池能获得事后看来可安排的全部日前价值，并以一刻钟交易和日内交易弥补预测误差。 |
| Meaning | The optimiser decides what the battery earns, so its terms matter to a buyer. | 电池能赚多少由优化商决定，因此其合同条款对买方至关重要。 |
| Marker | Fair evidence. What would change it: an optimiser's realised monthly book for a Romanian battery, across day-ahead, intraday and balancing. | 证据尚可。会改变判断的证据：优化商提供的罗马尼亚电池月度实际收益账簿，涵盖日前、日内和平衡市场。 |
| Controls | Day-ahead · Intraday · Balancing · Optimiser fee | 日前 · 日内 · 平衡 · 优化商费用 |
| Labels | Shared megawatts · Already committed · Fee: ‹bound: optimiser fee› · Model assumption | 共用兆瓦 · 已被占用 · 费用：‹bound: optimiser fee› · 模型假设 |

## 7. Who pays

### ro-10 — Who pays, and what is not income · 谁付钱，哪些不是收入

| Item | Shot specification |
| --- | --- |
| Scene | The scene recedes; three 2D paths. Trading: exchange counterparties, settled per MWh. Balancing: the grid operator, per MW held ready and per MWh activated. Capital grant: the ministry, from the Modernisation Fund, paid once against build cost and drawn on a separate capital track, never in the revenue column |
| Feedback | The selected path shows payer, unit, obligation and evidence. The grant path carries "Capital, not income" and "Award unverified" |
| Evidence and chart | CL-RO-15 (SRC-RO-03, p. 10; SRC-RO-11); CL-RO-16 (SRC-RO-03, -05, -06, -07); CL-RO-17 (REPO-RO-MODEL: engine `grantForMW` and `capitalWithGrant`; `src/acquisition/reference.js`, operating stage); CL-RO-04. Revenue detail stays in `#revenue` |
| Authoring check | Never place the grant in a revenue line or the secured share. The modelled new-build case assumes a capital grant (‹bound: grant note›); the operating-purchase price on the card carries none. An award is not a receipt; the call's outcome is unverified. Name units: per MWh for trading, per MW held for reserve. If the secured share ever becomes non-zero, the copy must name its tenor and what follows it (plan rule 7) and return to G-1 |
| Mobile | One route at a time as stacked steps |
| Status | Routes and scheme `sourced`; grant in the build case `model-assumption`; award `missing`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Who pays this battery, and for what? | 谁为这台电池付钱？为什么付钱？ |
| Copy | Buyers on the exchange pay for the energy it sells, and the grid operator pays for reserve it holds ready. Nothing is contracted in advance: modelled fixed revenue is ‹bound: secured share›. The state's grant is different: a one-off payment towards building a new battery, won in a tender, and not income. For an operating asset, any grant was spent on its construction. | 交易所中的买方为电池售出的电量付费，电网运营商为电池随时待命的备用付费。没有任何收入事先签约：模型固定收入占比为‹bound: secured share›。国家补贴则不同：它是对新建电池的一次性建设资助，须通过竞标获得，并非收入。对在运资产而言，若曾获得补贴，也早已用于建设。 |
| Meaning | This play's revenue is all market revenue; a grant lowers what a battery costs to build, never what it earns. | 本方案的收入全部来自市场；补贴降低的是电池的建设成本，绝不是其收入。 |
| Marker | Fair evidence. What would change it: the ministry's published grant lists, or a signed contract that secures part of the revenue. | 证据尚可。会改变判断的证据：能源部公布的补贴名单，或已签署并锁定部分收入的合同。 |
| Controls | Trading · Balancing · Capital grant | 电力交易 · 平衡服务 · 资本补贴 |
| Labels | Paid by · Unit · Obligation · Evidence · Capital, not income · Award unverified · New-build case: assumes a grant · Operating purchase: no grant | 付费方 · 计价单位 · 义务 · 证据 · 属于资本，并非收入 · 中标结果未核实 · 新建情景：假设获得补贴 · 收购在运资产：不含补贴 |
| Trading route | Offered → Cleared → Delivered → Settled. Paid by: the exchange's counterparties, per MWh at the cleared price. Obligation: deliver what clears. Evidence: Fair: the price series awaits a publishable source | 报价 → 出清 → 交付 → 结算。付费方：交易所的交易对手，按出清价、每MWh结算。义务：按出清结果交付。证据：证据尚可：价格序列尚待可公开发布的来源 |
| Balancing route | Qualified → Bid → Held ready or activated → Paid. Paid by: the grid operator, per MW held ready and per MWh activated. Obligation: respond when called. Evidence: Thin: results not yet located | 获得资格 → 报价 → 待命或被调用 → 付费。付费方：电网运营商，按每MW待命及每MWh调用电量付费。义务：接到指令即响应。证据：证据单薄：尚未找到采购结果 |
| Grant route | Tender → Provisional ranking → Final list → Contract → Paid against build costs. Paid by: the Ministry of Energy, from the Modernisation Fund, once. Obligation: commission within ‹bound: grant build deadline› months and operate for at least ‹bound: grant operation years› years. Evidence: Strong for the rules; award unverified | 竞标 → 初步排名 → 最终名单 → 签约 → 按建设成本拨付。付费方：能源部，资金来自现代化基金，一次性拨付。义务：在‹bound: grant build deadline›个月内投运，并至少运营‹bound: grant operation years›年。证据：证据充分（规则）；中标结果尚未核实 |

### ro-11 — The floor comes first · 先谈定保底

| Item | Shot specification |
| --- | --- |
| Scene | Qualitative revenue band over time, merchant throughout; a dashed bracket labelled "Floor: condition of entry, not priced", drawn with no level or tenor bar; a checklist card beside it |
| Feedback | EN: "Merchant case (priced)"; "Floor: condition of entry, not priced"; "Announced in this market: one floor, level not disclosed". ZH as in Labels. No floor height, tenor bar or secured shading |
| Evidence and chart | CL-RO-18: REPO-RO-LIVE (`verdicts.infraFund.where`, `because`, `despite`; `plays.ro-mer-2h.action`); open-calls plan §3 (3A; OC-RO-FLOOR); SRC-RO-17 (the repository's counterparty record behind the `revenueCertainty` grade); the engine's `tollIsFloor` rule, for authoring only |
| Authoring check | The floor never appears as secured, priced or modelled revenue; the secured share stays bound to the card. Do not transplant Finland's floor price or tenor. Do not name the announced floor's parties or project. Once a floor is negotiated and priced, the platform counts it as secured at its own level, for its stated term (the settled ruling); that is a later proposal through OC-RO-FLOOR, not this story |
| Mobile | Two stacked panels: the priced merchant case, then the floor checklist |
| Status | Condition `sourced` (analyst ruling); floor terms `missing`; `eligibility-unverified`; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | If nothing is secured, why would a fund buy in? | 如果没有任何锁定收入，基金为何还会买入？ |
| Copy | Only with a floor. An optimiser can agree to pay the owner a minimum each year and share what the battery earns above it; such a floor has been announced in Romania, with its level undisclosed. The fund enters only once a seller can show those terms: the payment, how long it lasts, indexation, the share above the floor, fees, availability conditions and who stands behind it. Until then the price paid rests on merchant revenue alone. | 只有在有保底的情况下才会。优化商可以同意每年向业主支付一个最低金额，并分享电池在此之上的收益；罗马尼亚已公布过此类保底，但未披露金额。只有当卖方能拿出以下条款时，基金才会进入：付费金额、期限、指数化、保底以上的分成、费用、可用率条件以及担保方。在此之前，收购价只能以市场化收入为依据。 |
| Meaning | The floor is a condition of entry and a diligence gate, not part of the price. | 保底是进入条件和尽职调查关口，而非定价的一部分。 |
| Marker | Fair evidence. What would change it: a floor term sheet, with credit support, that passes the platform's floor check. | 证据尚可。会改变判断的证据：附带信用支持并通过本平台保底核查的保底条款清单。 |
| Controls | The priced case · The floor checklist | 已定价情景 · 保底核查清单 |
| Labels | Merchant case (priced) · Floor: condition of entry, not priced · Announced in this market: one floor, level not disclosed · Payment · Tenor · Indexation · Share above the floor · Fees · Availability · Credit support | 市场化情景（已定价） · 保底：进入条件，未定价 · 本市场已公布：一项保底，金额未披露 · 付费 · 期限 · 指数化 · 保底以上分成 · 费用 · 可用率 · 信用支持 |

## 8. The investment

### ro-12 — What could weaken it · 什么会削弱投资逻辑

| Item | Shot specification |
| --- | --- |
| Scene | Calm overview with factor cards; the future fleet dashed; the grant outcome and new regulatory orders as dated cards beyond the "Checked" boundary |
| Feedback | Each factor opens short text and links to its section: home fleet and spread → `#revenue` and `#downside`; reserves → `#revenue`; floor → `#bankable`; connection rules and the grant timetable → `#execution`; grant-funded fleet → `#downside`. The next trigger reads ‹bound: next trigger› with its date |
| Evidence and chart | CL-RO-06, -07, -12, -14, -16, -18, -19; REPO-RO-LIVE triggers (`ro-grant-call-close`, `ro-grant-status-review`, `ro-connection-guarantee-order`) and `changesIf`; SRC-RO-04; SRC-RO-14 |
| Authoring check | No grant outcome: the call is unresolved at check (OC-RO-GRANT), and 2 November is the analyst's review date, not a closing date. ANRE Order 16/2026 is flagged to the analyst, not treated as having fired a trigger (CF-RO-08). A downside case is not a probability. Stop at the market page; no second financial view |
| Mobile | Factor cards, each with its section link; the four destinations visible at the end |
| Status | `sourced`; triggers bound; G-1 reviewed 1 November 2026; G-2 conditions retained |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What would make this play less attractive? | 什么会让本方案失去吸引力？ |
| Copy | Romania's own build running ahead of the model's path; reserves fading faster; a floor that is short, low or not on offer; a new order on connections or guarantees; and grant-funded batteries joining the fleet. The grant call's timetable and outcome remain unverified at the latest check. Next: ‹bound: next trigger›, then ‹bound: next action›. | 罗马尼亚自身的建设快于模型路径；备用收入消退更快；保底期限短、金额低或根本无法取得；出台新的并网或保函法令；以及获补贴的电池加入储能队伍。补贴申报结果尚未核实。下一步：‹bound: next trigger›，然后是‹bound: next action›。 |
| Meaning | The entry price must work on merchant revenue alone, with the floor's terms in hand before signing. | 进入价格必须在仅有市场化收入时也能成立，并须在签约前取得保底条款。 |
| Marker | Fair evidence. What would change it: the ministry's published grant lists, Transelectrica's fleet counts set against the model's path, or a priced floor. | 证据尚可。会改变判断的证据：能源部公布的补贴名单、Transelectrica储能统计与模型路径的对比，或已定价的保底。 |
| Controls | Home fleet · Reserves · Floor · Connection rules · Grant-funded fleet · Bankable case · Revenue · Execution · Downside | 本国储能 · 备用收入 · 保底 · 并网规则 · 获补贴储能 · 可融资方案 · 收益拆解 · 执行步骤 · 下行风险 |
| Factor cards | Narrows the spread; see Revenue and Downside · Shrinks the early top-up; see Revenue · Decides whether a fund can enter; see the Bankable case · Changes cost and timing for new projects; see Execution · Adds subsidised competition; see Downside | 收窄价差；见收益拆解与下行风险 · 缩减早期补充收入；见收益拆解 · 决定基金能否进入；见可融资方案 · 改变新项目的成本与时间；见执行步骤 · 增加获补贴的竞争；见下行风险 |

### Shared page vocabulary and states

| String | English | 简体中文 |
| --- | --- | --- |
| Story button | Story | 故事 |
| Navigation | Previous · Next · Chapters · Sources · Back to market | 上一节 · 下一节 · 章节 · 来源 · 返回市场 |
| Markers | Strong evidence. · Fair evidence. · Thin evidence. | 证据充分。 · 证据尚可。 · 证据单薄。 |
| Marker line | What would change it: | 会改变判断的证据： |
| Teaching and drawing tags | Example · Schematic · Model assumption · Model path, not observed | 示例 · 示意图 · 模型假设 · 模型路径，非观测值 |
| History legend | Observed event · Official plan · Estimate · Checked: ‹bound: research check date› | 已发生事件 · 官方规划 · 估计值 · 核查截至：‹bound: research check date› |
| Evidence drawer | Source · Locator · Checked on ‹bound: source checked date› · Definition | 来源 · 具体位置 · 核查时间：‹bound: source checked date› · 统计口径 |
| Exit | Go to the investment case | 前往投资方案 |
| Stale call | This story was last reviewed against the call of ‹date›. | 本故事最近一次依据‹date›的投资判断复核。 |
| Withheld observation | Observed prices await a publishable source; showing an Example | 实际价格尚待可公开发布的来源；当前展示示例 |
| Loading / retry | Loading source data… · Could not load data · Retry | 正在载入来源数据… · 数据未能载入 · 重试 |
| Missing financial binding | Current case unavailable; review the market case | 当前情景暂不可用；请查看市场方案 |
| Reduced motion | You can read the full story without motion | 无需动画也可阅读完整内容 |

## 9. Binding, chart and traceability contract

### Financial bindings that already exist

Authoring references, not a new adapter. `row` is the Romania row of `opportunities('infraFund')` (`src/experience/model.js`), after the investment-summary projection. The "At check" column is for the analyst's review against the live case only; no value is typed into page text.

| Token | Existing owner / exact field and display convention | At check, 31 Oct 2026 | Uses |
| --- | --- | --- | --- |
| ‹bound: call› | `CALLS[row.call]` (`src/experience/model.js`) | Situational / 择机投入 | ro-00 |
| ‹bound: play title› | `playTitle(row.play, row.stage)` (`src/governance/playTitle.js`), as `routeName` in `src/experience/pages.js` | Merchant · 2h · operating / 市场化 · 2小时 · 在运资产 | ro-00 |
| ‹bound: card figures› | `decisionPanel(row)` metrics (`src/experience/decision.js`): `row.investment.holdIRR` with `marginText(row)`, `bearHoldIRR`, peak pre-COD equity, `maxPricePerMW`; and `operatingPrice(row.investment)` (`src/experience/projectFacts.js`), which carries "The return shown is for building it new". Bind the card's operating line, not the acquisition screen's reference cases (a different calculation) | Base all-equity IRR 11.2%, −2.55 pp vs target; declared downside IRR 2.5%; project-rights ceiling "No supported price"; "RON 2.69m/MW for an operating asset at 13.3%" | ro-00 |
| ‹bound: next action› | `row.play.action.text`, bilingual | "Find operating two-hour assets whose seller has, or will sign, an optimiser floor…" | ro-00, ro-12 |
| ‹bound: play evidence› | `row.evidence` through the existing evidence labels | `fair` | ro-00 |
| ‹bound: secured share› | `row.econ.secured` (= `row.investment.secured` after projection), card `share()` format | 0.0% | ro-00, ro-10 |
| ‹bound: play duration› | `row.play.hours` | 2 | ro-08 |
| ‹bound: best merchant duration› | `HOME_BRIEFING.grids.ro.byRoute.mer.best` | 2 | ro-08 |
| ‹bound: longer merchant duration› | The grid's four-hour merchant cell (`grids.ro.cells`, route `mer`, hours 4) | 4 | ro-08 |
| ‹bound: merchant value at best› / ‹bound: merchant value longer› | `grids.ro.cells[].value` for those two cells, existing USD/MW formatter | $67,988 / $47,782 per MW (hold 13.70% / 12.20%) | ro-08 labels |
| ‹bound: value index path› | CALC-RO-PATH from `comparison.merchantEvidence.year` and `.restateFactor`, `economics.merchantCurve` and `economics.merchantCurveBasis.yearOne` (`src/markets/ro/comparison.js`) | basis 2025 · 82.7 (2027) · 79.0 (2028) · 77.2 (2029 on), basis = 100 | ro-06 chart |
| ‹bound: curve first year› | `economics.merchantCurveBasis.yearOne` | 2027 | ro-06 |
| ‹bound: optimiser fee› | `economics.feePct`, as a percentage | 10% | ro-09 |
| ‹bound: grant note› | `economics.grantNote`, bilingual, as the engine already returns it | "20% capital grant — competitive award, capped at €69k/MWh and €15m per company" | ro-10 authoring and labels |
| ‹bound: next trigger› | `row.next` → `HOME_BRIEFING.triggers[row.next]`, label and `expected` | `ro-grant-status-review`, 2026-11-02 | ro-12 |

### Evidence bindings proposed for later implementation

Explicit references to the dated records in §10, **not existing runtime fields**. A missing value suppresses the label; it never becomes zero or a constant. Dates, units, ticks, accessible summaries and tooltips use the same record.

| Token | Source record / field | Units / limit | Uses |
| --- | --- | --- | --- |
| ‹bound: fleet count› / ‹bound: fleet count date› | Latest point of CALC-RO-FLEET opened in a Transelectrica primary publication; at check SRC-RO-01, p. 1 (1 August 2026) | MW; stand-alone and hybrid-plant storage | ro-06 |
| ‹bound: fleet year-end additions› | SRC-RO-01, p. 2 | MW; Transelectrica estimate, not a count | ro-06 |
| ‹bound: fleet observations› | CALC-RO-FLEET points | Date, MW, MWh where published | ro-06 chart |
| ‹bound: plan 2030 level› | SRC-RO-03, p. 4 | MW and MWh; a plan, dashed | ro-06 chart |
| ‹bound: Bulgaria fleet end-2025› | SRC-RO-15, p. 3 | MW of battery storage at end-2025 | ro-05 |
| ‹bound: auction threshold› | SRC-RO-13 (Order 53/2024 as recorded in `src/markets/ro/sources.js`) | MW site size | ro-03 |
| ‹bound: grant build deadline› | SRC-RO-03, p. 10 | Months from the award | ro-10 |
| ‹bound: grant operation years› | SRC-RO-03, p. 33 | Years after commissioning | ro-10 |
| ‹bound: research check date› / ‹bound: source checked date› | Story content metadata; each record's check date | Locale date; not a publication or delivery date | ro-03, drawer |

### Source-to-shot mapping

| Shot | Claims → sources | Chart / binding owner | Likely misreading prevented |
| --- | --- | --- | --- |
| ro-00 | CL-RO-04, CL-RO-18 → REPO-RO-LIVE | Existing card | The floor read as priced or secured; the card's new-build return read as the operating entry price |
| ro-01 | CL-RO-03, CL-RO-04 → SRC-RO-10, -11; REPO-RO-MODEL | Own schematic | Coupling read as "no Romanian price risk"; a capacity line assumed |
| ro-02 | CL-RO-03 → SRC-RO-08, -09, -10, -11; H-RO-01–03 | Timeline records | Coupling read as permanently equal prices |
| ro-03 | CL-RO-05, -06, -16, -19 → SRC-RO-03 to -07, -12 to -14; H-RO-04–06 | Timeline records | A tariff exemption, an auction or a scheme budget read as revenue; the call read as closed or awarded |
| ro-04 | CL-RO-11 → SRC-RO-01, -20; GAP-RO-PRICES | Example shape only | Mirror-derived spreads presented as observed; a spread read as cash |
| ro-05 | CL-RO-09, -10 → SRC-RO-15, -11 | Bulgarian fleet record | Mirror-derived coupling statistics presented as observed |
| ro-06 | CL-RO-07, -08, -12 → SRC-RO-01, -02, -03; REPO-RO-MODEL | Chart-RO-FLEET, CALC-RO-FLEET, CALC-RO-PATH | A model path read as observed value; a four-hour line falling faster; a floor drawn as a level |
| ro-07 | CL-RO-14 → REPO-RO-MODEL; SRC-RO-03 | Qualitative bar | A GB-calibrated assumption read as a Romanian observation; reserve prices read as spreads |
| ro-08 | CL-RO-13 → REPO-RO-LIVE grid; REPO-RO-MODEL | Existing grid cells | "Four hours compresses faster"; best by return rather than value |
| ro-09 | CL-RO-15 → SRC-RO-03; REPO-RO-MODEL | Optimiser fee | Full capture read as a measured result; lane maxima added |
| ro-10 | CL-RO-04, -15, -16, -17 → SRC-RO-03, -05, -06, -07; REPO-RO-MODEL | Card secured share; grant note | A grant read as income; an award read as a receipt |
| ro-11 | CL-RO-18 → REPO-RO-LIVE; SRC-RO-17 | None (no level drawn) | The floor priced, secured or borrowed from Finland |
| ro-12 | CL-RO-06, -07, -12, -14, -16, -18, -19 → SRC-RO-04, -14; triggers | Existing sections and triggers | A grant outcome invented; a reported order treated as having fired a trigger |

Reverse traceability: SRC-RO-08/-09/-10/-11 → CL-RO-03 → H-RO-01–03 → ro-01, ro-02; SRC-RO-12 → CL-RO-05 → H-RO-04 → ro-03; SRC-RO-13/-14 → CL-RO-06 → H-RO-05 → ro-03, ro-12; SRC-RO-03 to -07 → CL-RO-16/-19 → H-RO-06 → ro-03, ro-10, ro-12; SRC-RO-01/-02/-03 → CL-RO-07/-08 → CALC-RO-FLEET → ro-06; REPO-RO-MODEL → CL-RO-12 → CALC-RO-PATH → ro-06; REPO-RO-MODEL → CL-RO-13/-14/-17 → ro-07, ro-08, ro-10; SRC-RO-15 → CL-RO-09 → ro-05; SRC-RO-17 and REPO-RO-LIVE → CL-RO-18 → ro-11. A replaced source queues a finite set of shots, translations and labels.

## 10. Sources and claims

Canonical [sources, history, calculations and G-2 gaps](source-register.md#g1-ro-evidence) and [claim ledger](market-narratives.md#g1-ro-claims). IDs in the shots resolve there. The script owns scene and bilingual page copy; the registers own the evidence records.

## 11. G-1 record and stopping point

| Analyst pass | Decision required |
| --- | --- |
| Electricity mechanics | Accept: one price zone, coupled until the border fills; solar-led spread mechanism; the border reading held Thin; fleet counts with their definitions; reserves as a GB-calibrated assumption; connection by auction; stored-energy tariff exemption |
| Investment meaning | Accept: Situational on `ro-mer-2h`; merchant priced case with nothing secured; two hours by value on the model's path; grant as capital, never income, with no outcome; the floor as a condition of entry and diligence gate, unpriced |
| English / Chinese | Confirm equal meaning of floor, condition of entry, grant, award, receipt, spread and estimate; one marker per shot in the fixed wording |
| G-1 | **Approved 1 November 2026.** The dated disposition below supersedes the original research questions; the actual shot copy incorporates the approved choices. G-2 evidence and rights gates remain open where identified. |

Points for the analyst to decide at G-1:

1. The argument in §1 and the reading route, including the competing explanation.
2. Chart-RO-FLEET as the signature chart, replacing the v1.3 card's proposal (CF-RO-01): fleet counts against the model's two-hour index; no four-hour line; no floor line; no price series.
3. How the fleet data enters the build (GAP-RO-FLEET): a fixed-vintage record committed with the story, like CALC-WA-DAY, or a dataset registered in `src/governance/datasets.js` under a new kind. Either way, each count is first opened in a Transelectrica primary publication and the reuse terms are confirmed.
4. Whether to show the index only (as scripted) or add the euro level once MR-4 closes.
5. The Example fallback for ro-04's daily price shape until MR-4 and the price-rights review clear a Romanian series.
6. The markers: Strong for ro-02 (assumes your review); Thin for ro-05 and ro-07; Fair elsewhere; ro-00 inherits the card.
7. The grant call: the story calls it unresolved (CF-RO-02). After the 2 November review, decide what to record if the extension is confirmed (a replacement closing trigger, per §3G of the open-calls plan).
8. ANRE Order 16/2026: whether it bears on `ro-connection-guarantee-order` (CF-RO-08).
9. The thesis's border statement and typed figures (CF-RO-03): whether a later content change is wanted. Nothing is edited here.
10. Reserve saturation (CF-RO-07): accept as a labelled model assumption or commission sourcing.
11. The `ro-day-ahead` licence line (CF-RO-06), for the separate rights review.
12. The Chinese drafts.

Script checks, 31 October 2026: thirteen shots, each with its specification rows (scene, feedback, evidence and chart, authoring check, mobile, status) and its page-text rows (question, copy, meaning, marker, controls) in English and Simplified Chinese; ro-00 has no meaning line, because it is the conclusion. Page copy carries no figure outside a ‹bound› token except dates and values tagged Example. No project, developer or deal is named. No application test, build or preview was run: only this Markdown file is added.

Stop here. No application code, dataset registration, snapshot, model or view change, rendering, build, deployment or G-2 work in this task.

## Analyst decisions — 1 November 2026

Authority: the analyst signed off the Chinese recommendations in this chat and authorised updates to the existing eight PRs. The numerical plan was approved for PJM, Poland and Italy. After a separate duration review, the analyst also approved Ireland’s six-hour candidate and Wait call, retaining assumed services revenue and appending the learning to history. The original research findings remain as evidence; the approved disposition governs the revised shot copy and closes the G-1 decision requests.

| Item | Approved disposition / retained gate |
| --- | --- |
| Chart / data | Approve fleet-growth chart, fixed-vintage official records, index-only model path and unscaled Example daily shape. Open each primary release and settle reuse before quantitative build. MR-4 stays open. |
| Grant / order | Grant outcome and reported extension remain unverified; 2 November 2026 is the review date, not a grant deadline. Do not fire the order trigger until the formal text and its connection/guarantee scope are established. |
| ro-05/07 | Keep cross-border effect and reserve saturation at Thin. The reserve curve is explicitly a Britain-calibrated model assumption; source Romanian procurement before calling saturation observed. |
| Interpretation / Chinese | Approve the route with competing water, gas, demand and other-flexibility explanations. Preserve existing calls and both-language meaning. |

**Common build conditions.** Model labels bind existing result fields; no financial constants are typed into page copy. Observations, non-binding plans, model paths and teaching Examples remain visually distinct. A rights block is withheld or replaced by an unscaled Example, not downgraded to Thin observed data. Manual chart records retain primary URL, locator, vintage, units and arithmetic; no dataset is registered by this documentation PR. “Strong” assesses evidence, not investment quality. Shared source/claim consolidation follows the script merges.

**Final reconciliation:** shot copy, bindings, scopes and model dependencies have been reconciled to the approved separate changes. Exact-head validation and dependency merges remain release gates. Approval of an editorial choice does not close an unresolved source, contract, rights or numerical dependency.

**Financial basis.** Investment-summary IRRs use the existing after-tax nominal cash-flow layer, including its inflation convention. The design-grid comparison is a separate basis. Do not add inflation again to the investment return or treat assumed contract escalation as verified contractual entitlement.

## G-2 release — 2 November 2026

The analyst signed off G-2 and authorised merge and publication. Grant wording now records an unverified timetable/outcome rather than inferring non-publication from failed access; the floor precedent is qualitative. Both languages retain the same meaning, existing call, play and financial bindings. All source/reuse gates and Example treatments remain in place.
