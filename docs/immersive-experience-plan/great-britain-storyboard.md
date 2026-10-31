# Great Britain: Six-Chapter Storyboard

Pack: BESS-IX-2026-10-30; Great Britain script researched 31 October 2026; shot layout v1.2
Status: `proposed` script and bilingual page-text draft; **G-1 analyst sign-off pending**; steps 1 and 2 only. Markdown only; nothing built, registered or published
Navigation: [Master plan](README.md) | [Story card](market-narratives.md#3-eighteen-market-candidate-story-cards) | [Evidence specification](evidence-and-content-specification.md) | [Sources and claims](#10-sources-and-claims) | [WA format](western-australia-storyboard.md)

## 1. Scope, argument and reading route

The story explains the **current infrastructure-fund call and play**, read from the view store and briefing model on `main`, not from the 16 October content document, which is stale. `reviewedAgainst`: **REPO-GB-LIVE**, commit `edcb39ca0d69397f3683dffc9af5ffb49473c98c`, briefing evaluated for 2026-10-31. At that check: call `opportunistic`, displayed **Situational / 择机投入**; route `operating`; play **`gb-toll-4h`**, route `toll`, four hours, stage `operating`; evidence `fair`; call dated 2026-10-16, review by 2027-03-31. Other lenses have other calls (`build-position` for the strategic investor, `wait` for the developer); this script does not generalise the fund call to them.

**Argument: saturation.** Great Britain keeps its own frequency, so it has bought fast response for years. Each service batteries entered then filled in turn: the 2016 Enhanced Frequency Response tender, then the Dynamic services from 2020, until value moved into wholesale trading and the Balancing Mechanism. Those earnings are uncontracted, and the Capacity Market secures only a de-rated slice. In the reference case without a toll, little revenue is secured. A toll fixes most of it for its term. New build also faces queue rules that are still being set. So a fund buys operating assets that already carry a toll, at a price that clears its yield.

1. GB is its own synchronous area, linked to its neighbours by direct current (CL-GB-03).
2. Bilateral trading replaced the Pool in 2001; the Balancing Mechanism settles the residual (CL-GB-04).
3. The first battery wave came for a small, fast tender (CL-GB-07). The Capacity Market pays for de-rated MW, and storage is de-rated by duration (CL-GB-05, CL-GB-06).
4. The Dynamic services drew more MW than each requirement, and clearing prices fell far below their launch levels; since 2023 they have moved with requirements, some below zero (CL-GB-08, CL-GB-09). This is the signature chart.
5. Batteries moved into trading and balancing, which pay energy spreads and secure nothing (CL-GB-10, CL-GB-18).
6. The reformed queue still holds more batteries than the 2030 plan needs; a new commitment fee is pending (CL-GB-12, CL-GB-13, CL-GB-14).
7. A toll secures most first-year revenue for its tenor, with merchant exposure after; an operating asset avoids the queue. The entry price decides the case (CL-GB-15, CL-GB-16).

Comprehension check: from the story alone, the user can say why the play is a four-hour operating battery with a toll: the services filled, trading secures nothing, the toll and the capacity agreement secure the revenue for a term, and new build waits on queue rules.

**Competing explanation.** Falling service prices also reflect NESO's procurement design: steadier requirements, a co-optimising auction from late 2023 and more participants of every kind, not batteries alone (CL-GB-09). Trading spreads move with gas prices, interconnector flows and wind, and can widen again. A toll transfers price risk but adds counterparty, availability, dispatch and expiry risk.

**Disconfirming condition.** NESO buying materially more response or reserve than offered supply can meet; durably wider spreads captured by operating batteries; or operating-asset prices settling above the card's operating price. Any of these would reopen the script. A different live call, play or duration requires re-sign-off; research does not re-grade the call.

| Chapter / page heading EN · 简体中文 | Shots | What the reader can explain afterwards |
| --- | --- | --- |
| Opening · 先看投资判断 | gb-00 | The live call, play and next action |
| Origins · 系统起点 | gb-01 | An island grid that holds its own frequency buys fast response |
| Historical choices · 历史选择 | gb-02–gb-04 | Trading by contract; a fast tender drew the first batteries; capacity paid by duration |
| Today's tensions · 当下矛盾 | gb-05–gb-07 | Each service filled; value moved to trading; the queue is full of batteries |
| Add a battery · 加入电池 | gb-08–gb-09 | Why four hours; one set of MW cannot be promised twice |
| Who pays · 谁来付钱 | gb-10–gb-11 | Who pays for what; what a toll secures and until when |
| The investment · 回到投资 | gb-12 | Why buy it operating, what lowers the price, and where to check |

Thirteen shots, about five minutes. Fixed-view isometric SVG from the shared symbol kit, off-white and deep green, plain HTML copy and an accessible 2D equivalent for every scene. Maps are schematic: no interconnector count, capacity, route or flow is asserted. No model execution, dispatch engine or underwriting control inside the story.

### Rules for every shot

- **Figures.** Every page-facing amount, share, duration, date and plotted label is a `‹bound: …›` token. §9 names its existing result field or its dated evidence record. No literal figure is copied from the view's `thesis`, `play.why`, grade reasons or scoreNote, which carry typed numbers. A missing value hides the sentence's figure and shows the missing-value text; it never shows zero.
- **Units.** Response and reserve prices are availability prices, **£/MW/h**. Trading and balancing earn energy spreads, **£/MWh**. The Capacity Market clears in **£/kW/year**. The three never share an axis, a sum or a sentence that converts one into another. A clearing price is never shown as captured revenue.
- **Stacking.** Services are never shown as stackable at their individual maxima. One battery's MW and energy can be committed once (gb-09).
- **Contracts.** The toll is a model assumption until the asset's contract is checked. It is never shown as a signed contract. Wherever secured revenue appears, its tenor and the merchant exposure after it appear with it.
- **Controls.** Teaching controls change only teaching state: era, service, unit view, battery preset, hotspot. No scenario changes the investment case. "Go to the investment case" links to the market page.
- **Evidence.** One marker per shot in the site's fixed wording, Strong evidence (证据充分), Fair evidence (证据尚可) or Thin evidence (证据单薄), followed by "What would change it:" / "会改变判断的证据：". The opening inherits the card's marker. The Authoring check row never appears on the page.
- **Time.** Observations solid; official plans and pending decisions dashed; teaching values tagged **Example / 示例**. Decision, effective and completion dates stay distinct.
- **Language.** All page text below is drafted in English and Simplified Chinese with the same meaning. Scene, Authoring check, Mobile and Status rows are English authoring metadata.

## 2. Opening

### gb-00 — The call · 先看投资判断

| Item | Shot specification |
| --- | --- |
| Scene | Small static GB thumbnail from the shared kit beside the existing play card; no animation |
| Feedback | None; this shot is the conclusion. A text alternative carries the same card fields |
| Evidence and chart | REPO-GB-LIVE; CL-GB-16. Existing card fields only, including its marker ‹bound: play evidence›. No new chart |
| Authoring check | Reuse the card, never `view.thesis` or `play.why`, which carry typed figures. The card's headline return is the shared new-build case, and the card says so; the operating-asset price beside it is the operating figure (§9). Keep the call even where its score crosses a band (the view's scoreNote explains why). If call, play or lens differs at build, queue review |
| Mobile | Card full width, one line beneath, two buttons; no scene before the conclusion |
| Status | `sourced`; `model-assumes-route`, not `contract-verified`; G-1 pending |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What is the call here, and why should I read on? | 这里的投资判断是什么？为什么值得读下去？ |
| Copy | The existing play card: **‹bound: call› · ‹bound: play name› · ‹bound: card figures› · ‹bound: next action›**. Beneath it: "Why: each service Britain's batteries entered has filled, so little revenue is secured. A toll on an operating asset fixes most of it for the toll's term." | 沿用现有方案卡：**‹bound: call› · ‹bound: play name› · ‹bound: card figures› · ‹bound: next action›**。卡片下方一行：“原因在于：英国电池进入的每一项服务都已饱和，能锁定的收入很少。在运资产附带的租赁合同，可在合同期内锁定大部分收入。” |
| Marker | The play's own marker, already on the card | 沿用方案卡上该方案自身的证据标记 |
| Controls | Start the story · [Go to the investment case](/markets/great-britain#bankable) | 开始阅读 · [前往投资方案](/markets/great-britain#bankable) |

## 3. Origins

### gb-01 — An island that keeps its own frequency · 自守频率的岛屿电网

| Item | Shot specification |
| --- | --- |
| Scene | Fixed GB schematic; synchronous boundary drawn round Great Britain only; generic direct-current links to the island of Ireland, Norway and continental Europe drawn as converter-to-converter connectors, visibly different from AC lines; no flow arrows |
| Feedback | EN: "One frequency inside the boundary"; "Direct-current link: trades power, not frequency". ZH: "边界内共用一个频率"；"直流联络线：交易电力，不共享频率" |
| Evidence and chart | CL-GB-03; SRC-GB-01 (GB synchronous area methodology), SRC-GB-02 (interconnector list) |
| Authoring check | Do not draw or count links from memory; take any link shown from SRC-GB-02 or a newer NESO register, and check the Denmark link before drawing it. Interconnectors can be required to respond to low frequency; "trades power, not frequency" means they are not synchronous, not that they never help. No claim that GB holds every MW of response alone |
| Mobile | Same schematic, stacked legend, both toggles; description readable without the map |
| Status | `sourced` (SRC-GB-01 opened; interconnector list SRC-GB-02 not opened); `market-rule`; geography review pending |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why does Britain buy so much fast response? | 英国为什么需要采购大量快速响应？ |
| Copy | Great Britain runs its own frequency. Its links to the island of Ireland, Norway and the continent are direct-current cables: they trade power but do not share the grid's frequency. When a large unit trips, Britain must cover most of the response within its own system. | 英国电网独立维持自身频率。它与爱尔兰岛、挪威和欧洲大陆的连接都是直流海缆：可以交易电力，但不共享电网频率。大型机组跳闸时，英国须主要依靠本系统内的资源提供响应。 |
| Meaning | A grid that holds its own frequency created the first paid market for fast batteries. | 自守频率的电网，为快速响应电池创造了第一个付费市场。 |
| Marker | Fair evidence. What would change it: the analyst's reading of NESO's GB synchronous-area methodology and the current interconnector frequency obligations. | 证据尚可。会改变判断的证据：分析师核读NESO关于英国同步区的运行方法，以及现行互联线路的频率义务。 |
| Controls | Own frequency · Trading links | 自身频率 · 交易联系 |
| Labels | Great Britain · GB synchronous area · Direct-current link · Island of Ireland · Norway · Continental Europe | 英国 · 英国同步区 · 直流联络线 · 爱尔兰岛 · 挪威 · 欧洲大陆 |

## 4. Historical choices

### gb-02 — Trading by contract · 以合同交易，由平衡机制收尾

| Item | Shot specification |
| --- | --- |
| Scene | H-GB-01. Two states of the same schematic: a central Pool box setting one price, then bilateral contracts between generators and suppliers with a small Balancing Mechanism box at gate closure |
| Feedback | EN: "Contracted ahead"; "Self-dispatched"; "Balanced at the end". ZH: "提前签约"；"自行调度"；"最后平衡" |
| Evidence and chart | CL-GB-04; SRC-GB-03 (NETA go-live), SRC-GB-04 (BETTA). H-GB-01 |
| Authoring check | NETA covered England and Wales; BETTA extended it to Great Britain. Keep the two dates separate (CF-GB-04). "Energy-only" holds until the Capacity Market (gb-04); do not imply GB never paid for capacity |
| Mobile | Two stacked cards, Pool then bilateral; labels beneath |
| Status | Event `historical-fact / sourced`; BETTA date `current-at-check` from a secondary government record; causal reading `proposed` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | How does Britain trade electricity? | 英国如何交易电力？ |
| Copy | In ‹bound: H-GB-01 NETA date›, bilateral trading replaced the central Pool in England and Wales; from ‹bound: H-GB-01 BETTA date› it covered all of Great Britain. Generators and suppliers contract ahead and dispatch themselves. The system operator balances what is left in the Balancing Mechanism. | ‹bound: H-GB-01 NETA date›，双边交易在英格兰和威尔士取代了集中式电力库（Pool）；自‹bound: H-GB-01 BETTA date›起覆盖整个大不列颠。发电商与售电商提前签约并自行调度，剩余的不平衡由系统运营商在平衡机制中处理。 |
| Meaning | This play's trading and balancing value is what a toll counterparty buys. | 本方案的交易与平衡价值，正是租赁对手方所购买的。 |
| Marker | Fair evidence. What would change it: Ofgem's NETA and BETTA implementation records, opened at their exact pages. | 证据尚可。会改变判断的证据：打开Ofgem关于NETA与BETTA实施的原始记录，并核对具体页码。 |
| Controls | Pool · Bilateral trading · Balancing Mechanism | 电力库 · 双边交易 · 平衡机制 |
| Labels | Contracted ahead · Self-dispatched · Balanced at the end | 提前签约 · 自行调度 · 最后平衡 |

### gb-03 — The first battery wave · 第一波电池

| Item | Shot specification |
| --- | --- |
| Scene | H-GB-03. A tender board with many battery sites queuing at one small box; a few pass and receive a multi-year contract bar; the rest stay outside |
| Feedback | EN: "Tendered sites: ‹bound: EFR tendered sites›"; "Accepted: ‹bound: EFR accepted tenders› tenders, ‹bound: EFR accepted MW›"; "Average price: ‹bound: EFR average price›". ZH: "投标场址：‹bound: EFR tendered sites›"；"中标：‹bound: EFR accepted tenders›个标书，‹bound: EFR accepted MW›"；"平均价格：‹bound: EFR average price›" |
| Evidence and chart | CL-GB-07; SRC-GB-05 (results), SRC-GB-06 (site technology), SRC-GB-07 (requirement and cap). H-GB-03. The EFR point also appears, separately styled, on the signature chart |
| Authoring check | The event is the tender and its result; "first wave" is the interpretation. Battery count is of tendered sites, not winners, unless the winners' list is extracted. The average price is £/MW/h availability, not revenue. Name no provider |
| Mobile | Tender board as three stacked figures with the contract bar below |
| Status | Event `historical-fact / sourced`: terms confirmed in the opened ITT, result figures from the moved report (CF-GB-12); interpretation `proposed`; GAP-GB-EFR |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What first brought large batteries onto Britain's grid? | 是什么最早把大型电池带上英国电网？ |
| Copy | In ‹bound: H-GB-03 date›, National Grid published the results of its first Enhanced Frequency Response tender, a service for very fast response. Almost every tendered site was a battery. ‹bound: EFR accepted tenders› tenders won ‹bound: EFR accepted MW› on multi-year contracts, priced per MW per hour. Far more sites bid than the tender accepted. | ‹bound: H-GB-03 date›，National Grid公布首次增强型频率响应（EFR）招标结果，这是一项要求极快响应的服务。几乎所有投标场址都是电池。‹bound: EFR accepted tenders›个标书中标，合计‹bound: EFR accepted MW›，签订多年期合同，按每MW每小时计价。投标场址远多于最终中标数量。 |
| Meaning | A small, fast service drew the first wave and showed how quickly battery supply can outgrow a fixed need. | 一项规模小、速度快的服务吸引了第一波电池，也显示出电池供给超过固定需求的速度之快。 |
| Marker | Fair evidence. What would change it: the opened tender report and site list, confirming accepted MW, price and technology. | 证据尚可。会改变判断的证据：打开招标报告及场址清单，核实中标MW、价格和技术类型。 |
| Controls | Tendered sites · Accepted · Contract term | 投标场址 · 中标 · 合同期限 |
| Labels | Enhanced Frequency Response · Tendered sites · Accepted tenders · Availability price · £/MW/h | 增强型频率响应 · 投标场址 · 中标标书 · 可用容量价格 · 英镑/MW/小时 |

### gb-04 — Capacity, paid by duration · 容量按时长计价

| Item | Shot specification |
| --- | --- |
| Scene | H-GB-02 and H-GB-04. One battery's nameplate MW bar beside its de-rated MW bar; a duration preset lengthens the energy block and the de-rated bar grows along ‹bound: de-rating curve› |
| Feedback | EN: "Nameplate"; "Counted for capacity"; "De-rating factor: ‹bound: de-rating curve›"; "Example". ZH: "铭牌容量"；"计入容量"；"折减系数：‹bound: de-rating curve›"；"示例" |
| Evidence and chart | CL-GB-05, CL-GB-06; SRC-GB-18 (first auction), SRC-GB-19 (Schedule 3B), SRC-GB-20 (T-4 2029/30 table and results), REPO-GB-01 (the published curve the model holds). H-GB-02, H-GB-04 |
| Authoring check | De-rated MW, never nameplate. The curve is the vintage of the auction the model prices (T-4 2029/30), held in the model with basis `published`; recheck it against the opened table. The 2017 assessment is secondary-sourced (CF-GB-09): date the node by the 2018 rules if the report is not found. The capacity price is £/kW/year; it never appears beside a £/MW/h price |
| Mobile | Two bars and the preset selector stacked; factor shown as text |
| Status | Mechanism `market-rule / sourced`; 2017 origin `secondary`; teaching preset `teaching-example` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | How does Britain pay for capacity, and why does duration matter? | 英国如何为容量付费？时长为何重要？ |
| Copy | The Capacity Market held its first auction in ‹bound: H-GB-02 date›. Suppliers fund it. A battery is credited with only part of its power, a share set by how long it can keep discharging; storage has been de-rated by duration since ‹bound: H-GB-04 date›. The longer the battery, the larger the share. | 容量市场于‹bound: H-GB-02 date›举行首次拍卖，资金来自售电商。电池只有部分功率被计入，比例取决于它能持续放电多久；自‹bound: H-GB-04 date›起，储能按时长折减。电池时长越长，计入比例越高。 |
| Meaning | The capacity agreement is the main long contract a battery can win here, and it rewards the hours this play builds. | 容量协议是电池在这里能赢得的主要长期合同，并为本方案配置的时长带来回报。 |
| Marker | Fair evidence. What would change it: the T-4 auction guidelines' storage table and Schedule 3B, opened and checked against the model's factors. | 证据尚可。会改变判断的证据：打开T-4拍卖指引中的储能折减表及《容量市场规则》附表3B，并与模型系数核对。 |
| Controls | Nameplate MW · Counted MW · Longer battery (Example) | 铭牌MW · 计入MW · 更长时长（示例） |
| Labels | Nameplate · Counted for capacity · De-rating factor: ‹bound: de-rating curve› · Example | 铭牌容量 · 计入容量 · 折减系数：‹bound: de-rating curve› · 示例 |

## 5. Today's tensions

### gb-05 — Each service filled in turn · 各项服务依次被填满 (signature chart / 核心图表)

| Item | Shot specification |
| --- | --- |
| Scene | **Signature chart Chart-GB-FILL**, full width, with a small calm grid thumbnail. Upper panel: clearing price by service, £/MW/h. Lower panel: cleared MW by service on the same dates. EFR 2016 as one separately styled tender point. Platform changes as labelled event lines |
| Feedback | EN: "Clearing price · £/MW/h"; "Cleared MW"; "Offered MW" (where sell orders exist); "EFR tender, ‹bound: H-GB-03 date›: a different procurement"; "Platform change". ZH: "出清价格 · 英镑/MW/小时"；"出清MW"；"报价MW"；"‹bound: H-GB-03 date› EFR招标：另一种采购方式"；"平台变更"。 Values, dates and ticks from ‹bound: service series› and the H-GB nodes |
| Evidence and chart | CL-GB-08, CL-GB-09; SRC-GB-08–13; GAP-GB-SERVICES, GAP-GB-TECH; calculation contract in §10 |
| Authoring check | Prices are availability prices, never revenue and never £/MWh, even where a NESO report prints the unit that way (CF-GB-03). Do not join lines across the move to the co-optimising auction without the event marker. "Of which battery" uses the files' technology field after the label clean-up in CALC-GB-TECH; unlabelled MW stays "other or unlabelled". NESO attributes the falls to more participants, steadier requirements and the auction design; the word "saturation" is the platform's reading. No requirement line unless a NESO requirement series is sourced. The price axis must allow negative values (CF-GB-11) |
| Mobile | Panels stacked with a shared date selector; units persistent; accessible monthly table. Until the data is registered, a qualitative Example with no numeric axes |
| Status | Series opened and checked (CALC-GB-TECH, CALC-GB-PRICE); licence confirmed; numeric production `blocked` only on registration and QA; G-1 reviews the chart design; nothing built |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What happened to prices as batteries filled each service? | 电池逐一进入各项服务后，价格发生了什么变化？ |
| Copy | Dynamic Containment opened in ‹bound: H-GB-05 DC date›; Dynamic Regulation and Moderation followed in ‹bound: H-GB-05 DR/DM date›. As more MW competed for each requirement, clearing prices fell far below their opening levels; NESO attributes the falls to more participants and more offered volume. Since then some prices have risen with requirements, and some clear below zero. A clearing price is what the auction paid to hold response ready, not what a battery earned. | 动态遏制（DC）于‹bound: H-GB-05 DC date›开放，动态调节（DR）和动态缓和（DM）于‹bound: H-GB-05 DR/DM date›相继推出。随着更多MW竞争每项需求量，出清价格降至远低于开放之初的水平；NESO将价格下降归因于参与者和报价量增加。此后，部分价格随需求量上升而回升，部分则以负价出清。出清价格是拍卖为待命响应支付的价格，不是电池的实际收入。 |
| Meaning | The services that drew batteries now pay little, so this play does not rest on them. | 曾经吸引电池的服务如今回报很低，因此本方案不依靠这些服务。 |
| Marker | Fair evidence. What would change it: the NESO auction results registered, plotted and reviewed by the analyst. | 证据尚可。会改变判断的证据：登记NESO拍卖结果数据，绘图并经分析师复核。 |
| Controls | Dynamic Containment · Dynamic Regulation · Dynamic Moderation · All services · How measured | 动态遏制 · 动态调节 · 动态缓和 · 全部服务 · 计算口径 |
| Labels | Clearing price · £/MW/h · Cleared MW · Offered MW · EFR tender, ‹bound: H-GB-03 date›: a different procurement · Platform change | 出清价格 · 英镑/MW/小时 · 出清MW · 报价MW · ‹bound: H-GB-03 date› EFR招标：另一种采购方式 · 平台变更 |
| Caption | Auction prices for holding response ready; not battery earnings. | 这是待命响应的拍卖价格，不是电池收入。 |

### gb-06 — From services to trading · 从辅助服务转向交易

| Item | Shot specification |
| --- | --- |
| Scene | H-GB-06. The same battery; its arrows move from a response box to a Balancing Mechanism box and a wholesale box. Two unit badges, kept apart: "£/MW/h" on response, "£/MWh" on trading |
| Feedback | EN: "Capacity held ready · £/MW/h"; "Energy traded · £/MWh"; "Different units; never added". ZH: "待命容量 · 英镑/MW/小时"；"交易电量 · 英镑/MWh"；"单位不同，不可相加" |
| Evidence and chart | CL-GB-10, CL-GB-18; SRC-GB-15 (Open Balancing Platform), SRC-GB-16 (skip rates), SRC-GB-17 (Elexon data terms). GAP-GB-REVSPLIT. No price chart; no exchange day-ahead prices |
| Authoring check | The event is NESO's bulk dispatch for batteries and the rise in battery instructions. "Trading is now most of a battery's revenue" has no primary source in this pack: the market page's existing revenue-share figures rest on a subscription index and must not be cited here. Keep the shot Thin until GAP-GB-REVSPLIT closes. No spread figure |
| Mobile | One battery card, three route cards beneath, unit badges on each |
| Status | Event `historical-fact / sourced`; revenue shift `research-hypothesis` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Where did the batteries go next? | 电池接下来转向了哪里？ |
| Copy | From ‹bound: H-GB-06 OBP date›, NESO's control room could instruct many batteries at once in the Balancing Mechanism, and battery instructions rose. Batteries now trade ahead in the wholesale market and offer into balancing. Those earnings are energy spreads, per MWh, and they move with prices; no contract fixes them. | 自‹bound: H-GB-06 OBP date›起，NESO调度室可在平衡机制中一次性向大批电池发出指令，电池接到的调度指令随之增加。如今电池在批发市场提前交易，并在平衡机制中报价。这些收入是按MWh计算的电能量价差，随价格波动，没有合同加以锁定。 |
| Meaning | This asset's value now sits mainly in trading, and that is the value a toll counterparty takes on. | 资产价值如今主要来自交易，而租赁对手方承接的正是这部分价值。 |
| Marker | Thin evidence. What would change it: a revenue split by route, computed from Elexon settlement data and NESO service results. | 证据单薄。会改变判断的证据：基于Elexon结算数据与NESO服务结果，按收入渠道计算的收入构成。 |
| Controls | Response · Balancing Mechanism · Wholesale · Units | 响应服务 · 平衡机制 · 批发市场 · 单位 |
| Labels | Capacity held ready · £/MW/h · Energy traded · £/MWh · Different units; never added | 待命容量 · 英镑/MW/小时 · 交易电量 · 英镑/MWh · 单位不同，不可相加 |

### gb-07 — A queue full of batteries · 排满电池的并网队列

| Item | Shot specification |
| --- | --- |
| Scene | H-GB-07 and H-GB-08. Substation icons with a line of battery projects waiting; the reformed Gate 2 line is shorter but still longer than a dashed 2030 range band. A dashed card for the pending commitment fee |
| Feedback | EN: "Operating"; "Gate 2 queue: ‹bound: Gate 2 battery MW›"; "Government range for ‹bound: CP2030 horizon›: ‹bound: CP2030 battery range›"; "Decision pending". ZH: "在运"；"Gate 2队列：‹bound: Gate 2 battery MW›"；"政府‹bound: CP2030 horizon›年规划区间：‹bound: CP2030 battery range›"；"待决定" |
| Evidence and chart | CL-GB-11–CL-GB-14; SRC-GB-22–SRC-GB-26. H-GB-07, H-GB-08 |
| Authoring check | Queue and fleet figures come from one dated record with its definition (CF-GB-06); never mix a transmission-register count with Ofgem's Gate 2 figure. The fee is a minded-to proposal, not a decision; the protection change for batteries without revenue support is a consultation. The view's trigger cites a subscription article (CF-GB-07); the story cites SRC-GB-24/25 instead. National pricing is secondary here: one sentence, no zonal map |
| Mobile | Queue bars stacked, then the pending card with its date |
| Status | Reform and letter `official-plan / sourced`; fee `official-plan`, decision `missing`; G-1 pending |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why not build a new battery instead? | 为什么不新建一座电池？ |
| Copy | Ofgem approved a reordered connection queue in ‹bound: H-GB-07 Gate 2 date›: projects that pass Gate 2 get a confirmed date and connection point. Batteries in the reformed queue still exceed the government's range for ‹bound: CP2030 horizon›, ‹bound: CP2030 battery range›. In ‹bound: H-GB-08 fee consultation date›, Ofgem proposed an extra commitment fee for oversubscribed technologies; its decision is pending. Britain keeps one national price: zonal pricing was rejected in ‹bound: H-GB-07 REMA date›. | Ofgem于‹bound: H-GB-07 Gate 2 date›批准重新排序的并网队列：通过Gate 2的项目获得确定的并网日期和接入点。改革后队列中的电池仍超过政府‹bound: CP2030 horizon›年的规划区间（‹bound: CP2030 battery range›）。‹bound: H-GB-08 fee consultation date›，Ofgem提议对超额申请的技术加收承诺费，决定尚未作出。英国维持全国统一电价：分区电价方案已于‹bound: H-GB-07 REMA date›被否决。 |
| Meaning | New-build batteries face queue rules still being set; an operating asset already holds its connection. | 新建电池面临仍在制定中的排队规则；在运资产已握有并网条件。 |
| Marker | Fair evidence. What would change it: Ofgem's decision on the commitment fee and NESO's final rule on queue protections for batteries. | 证据尚可。会改变判断的证据：Ofgem对承诺费的决定，以及NESO关于电池排队保护的最终规则。 |
| Controls | Before reform · Gate 2 queue · Proposed fee (pending) | 改革前 · Gate 2队列 · 拟议收费（待定） |
| Labels | Operating · Gate 2 queue: ‹bound: Gate 2 battery MW› · Government range for ‹bound: CP2030 horizon›: ‹bound: CP2030 battery range› · Decision pending | 在运 · Gate 2队列：‹bound: Gate 2 battery MW› · 政府‹bound: CP2030 horizon›年规划区间：‹bound: CP2030 battery range› · 待决定 |

## 6. Add a battery

### gb-08 — Why four hours · 为什么是四小时

| Item | Shot specification |
| --- | --- |
| Scene | Teaching battery, power and energy labelled apart; presets shorter, current play and longer. The counted-capacity bar from gb-04 grows with duration; a capital layer grows too |
| Feedback | EN: "Power · MW"; "Energy · MWh"; "Counted for capacity"; "More capital"; "Example". ZH: "功率 · MW"；"电量 · MWh"；"计入容量"；"更多资本"；"示例"。 Presets never reprice the case |
| Evidence and chart | CL-GB-06, CL-GB-16; REPO-GB-LIVE design grid (`HOME_BRIEFING.grids.gb`), REPO-GB-01 (`routeRules.toll.quotedHours`, de-rating curve). The Bankable case owns cost and return |
| Authoring check | The toll is priced at one quoted duration only; other toll cells are unpriced, not worthless. On the capacity route the engine's best band sits at a shorter duration than the play; do not claim four hours wins on every route. The comparison-engine hold for a grid cell and the card's investment-summary hold are different bases; never place them side by side |
| Mobile | Current-play card first, presets beneath; link to the design evidence |
| Status | `sourced`, `model-assumption`; duration from the live play |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why is this play ‹bound: play duration› hours? | 为什么本方案选择‹bound: play duration›小时？ |
| Copy | Two things set it. The toll the model prices is quoted at ‹bound: toll quoted hours› hours, the only toll duration it prices. Capacity credit rises with duration, so the play's battery counts for more capacity than a shorter Example battery. A longer battery counts for more again but needs more capital; the model weighs both. | 原因有二。模型定价的租赁按‹bound: toll quoted hours›小时报价，这也是模型唯一定价的租赁时长。容量信用随时长提高，因此本方案的电池比较短的示例电池计入更多容量。更长的电池计入更多，但需要更多资本，模型对两者加以权衡。 |
| Meaning | ‹bound: play duration› hours matches the toll on offer and keeps the capacity credit beside it. | ‹bound: play duration›小时既匹配现有的租赁报价，也保住与之并存的容量信用。 |
| Marker | Fair evidence. What would change it: a toll quoted at another duration, or a changed de-rating table or design-fit result. | 证据尚可。会改变判断的证据：出现其他时长的租赁报价，或折减系数表、设计匹配结果发生变化。 |
| Controls | Current play · Shorter battery (Example) · Longer battery (Example) | 当前方案 · 较短时长（示例） · 较长时长（示例） |
| Labels | Power · MW · Energy · MWh · Counted for capacity · More capital · Example | 功率 · MW · 电量 · MWh · 计入容量 · 更多资本 · 示例 |

### gb-09 — One set of megawatts · 同一组兆瓦，不能重复承诺

| Item | Shot specification |
| --- | --- |
| Scene | One battery with its MW and stored energy as a single block; selecting a route fills part of it and greys out what is already committed. A capacity-duty band runs alongside |
| Feedback | EN: "Headroom already committed"; "Stress-event duty"; "Offtaker dispatches". ZH: "余量已被占用"；"紧张事件义务"；"承租方调度" |
| Evidence and chart | CL-GB-15, CL-GB-16; SRC-GB-10 (auction splitting and co-optimisation), SRC-GB-21 (capacity obligation). No revenue figures |
| Authoring check | Never sum service maxima. The co-optimising auction lets one unit split MW across services; it does not let the same MW be sold twice. The capacity obligation coexists with other uses but requires delivery in a stress event. Under the toll the offtaker controls dispatch; the owner's remaining duties depend on the contract |
| Mobile | Static block with the route list below; committed share as text |
| Status | `market-rule / sourced`; contract allocation `missing` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Can one battery earn every service at once? | 一座电池能同时赚取所有服务的收入吗？ |
| Copy | No. The same MW and stored energy can be held for response, offered into balancing or traded ahead, but never promised twice. The capacity agreement sits alongside them, with a duty to deliver when the system is stressed. Under a toll, the offtaker decides how the battery is used. | 不能。同一组MW和储存电量，可用于待命响应、在平衡机制中报价或提前交易，但绝不能重复承诺。容量协议与这些用途并存，但在系统紧张时必须履约。在租赁期内，由承租方决定电池如何使用。 |
| Meaning | Revenue lines share one battery, so this play never adds services at their individual maxima. | 各收入项共用同一座电池，因此本方案从不按各项服务的单项最高值叠加收入。 |
| Marker | Fair evidence. What would change it: the toll's dispatch and availability terms, and NESO's current rules on splitting service bids. | 证据尚可。会改变判断的证据：租赁合同的调度与可用率条款，以及NESO现行的服务报价拆分规则。 |
| Controls | Response · Balancing · Trading · Capacity duty | 响应 · 平衡 · 交易 · 容量义务 |
| Labels | Headroom already committed · Stress-event duty · Offtaker dispatches | 余量已被占用 · 紧张事件义务 · 承租方调度 |

## 7. Who pays

### gb-10 — Who pays for what · 谁为何付费

| Item | Shot specification |
| --- | --- |
| Scene | Separate 2D payment paths, each with its own unit badge: NESO → response availability (£/MW/h); Elexon settlement → balancing actions and imbalance (£/MWh); market counterparties → trading (£/MWh); suppliers → Electricity Settlements Company → capacity agreement (£/kW/year). Only the capacity path carries a term bar |
| Feedback | Selecting a path shows payer, obligation and term. Reference-case line: EN "Secured without a toll: ‹bound: reference secured share›"; ZH "不含租赁时的锁定比例：‹bound: reference secured share›" |
| Evidence and chart | CL-GB-15, CL-GB-17, CL-GB-18; SRC-GB-12/13 (service results), SRC-GB-17 (settlement data), SRC-GB-20/21 (capacity results and settlement). REPO-GB-LIVE reference case; GAP-GB-REFSECURED |
| Authoring check | A response award is a short delivery obligation, not a floor. Balancing settlement can charge as well as pay. The capacity agreement's term for an operating asset is whatever it holds, not the new-build term the model uses; check it in the Capacity Market Register. The reference share is the engine's capacity-route case without a toll; do not mix it with the card's toll share |
| Mobile | Choose a path; vertical payer → obligation → settlement steps; unit stays visible |
| Status | Payment routes `mechanism-exists / sourced`; reference share `model-assumption`; binding gap open |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Who pays a British battery, and what is fixed? | 谁向英国电池付钱？哪些收入是固定的？ |
| Copy | NESO pays for response held ready, per MW per hour, in short auctions. Balancing actions and imbalance are settled through Elexon; trading earns the price spread. Suppliers fund the Capacity Market, paid through the Electricity Settlements Company for the agreement's term. In the reference case without a toll, only ‹bound: reference secured share› of revenue is secured. | NESO在短期拍卖中为待命响应付费，按每MW每小时计价。平衡操作与不平衡电量通过Elexon结算；交易赚取价差。容量市场资金来自售电商，由电力结算公司（ESC）在协议期内支付。在不含租赁的参考情景中，仅有‹bound: reference secured share›的收入被锁定。 |
| Meaning | Only the capacity agreement is fixed, and it is a small share, so this play needs a toll. | 只有容量协议是固定收入，且占比很小，因此本方案需要租赁合同。 |
| Marker | Fair evidence. What would change it: payment terms checked in the EMR Settlement guidance and in the asset's own capacity agreement. | 证据尚可。会改变判断的证据：核对EMR结算指引中的付款条款，以及资产自身的容量协议。 |
| Controls | Response · Balancing and imbalance · Trading · Capacity | 响应 · 平衡与不平衡 · 交易 · 容量 |
| Labels | NESO · Elexon settlement · Market counterparties · Electricity Settlements Company · Suppliers · £/MW/h · £/MWh · £/kW/year | NESO · Elexon结算 · 市场交易对手 · 电力结算公司 · 售电商 · 英镑/MW/小时 · 英镑/MWh · 英镑/kW/年 |

### gb-11 — What a toll secures, and until when · 租赁锁定什么，锁到何时

| Item | Shot specification |
| --- | --- |
| Scene | Qualitative revenue band over the hold: a fixed toll layer and a capacity layer during the toll's tenor, then a dashed merchant tail. A two-line text card compares the reference share with the play's share; no new chart |
| Feedback | EN: "Fixed toll fee"; "Capacity agreement"; "Merchant after the toll"; "Model assumption, not a signed contract"; "Reference case: ‹bound: reference secured share›"; "This play: ‹bound: secured share›". ZH: "固定租赁费"；"容量协议"；"租赁期后承担市场风险"；"模型假设，并非已签合同"；"参考情景：‹bound: reference secured share›"；"本方案：‹bound: secured share›" |
| Evidence and chart | CL-GB-16; REPO-GB-LIVE card share and tenor; REPO-GB-01 (`tollAdditiveWithCapacity`, `tollRevertsToMerchant`, `contractYears`); GAP-GB-TOLL. The market page's Revenue section owns the numbers |
| Authoring check | The toll's level and tenor come from a reported precedent with no public primary source; never name it. The capacity agreement in the model outlasts the toll (‹bound: capacity agreement years›); after the toll the secured share falls to the capacity line, then to nothing. Contract indexation follows the settled 2.5% convention inside the model; never state it as a term of an actual toll. No renewal assumed |
| Mobile | Two stacked panels, during the toll and after; contract checks listed beneath, not in a hover |
| Status | `model-assumes-route`; project contract `missing`, not `contract-verified` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What does the toll secure, and until when? | 租赁锁定了什么？锁定到什么时候？ |
| Copy | In this play an offtaker pays a fixed annual fee and dispatches the battery, while the owner keeps its capacity agreement. Together they secure ‹bound: secured share› of first-year modelled revenue, for ‹bound: secured tenor› years. After the toll, revenue returns to merchant unless a new toll is signed. Until the asset's contract is checked, the toll is a model assumption. | 在本方案中，承租方支付固定年费并调度电池，业主保留容量协议。二者合计锁定首年模型收入的‹bound: secured share›，期限‹bound: secured tenor›年。租赁到期后，若未签新租赁，收入回归市场化。在核实资产合同之前，租赁只是模型假设。 |
| Meaning | For a fixed term, the toll turns the market's small secured slice into most of the revenue. | 在固定期限内，租赁把市场中很小的锁定部分变为收入的大部分。 |
| Marker | Fair evidence. What would change it: a signed toll, with its counterparty, tenor, dispatch rights, availability deductions and termination terms checked. | 证据尚可。会改变判断的证据：已签署的租赁合同，并核实对手方、期限、调度权、可用率扣款和终止条款。 |
| Controls | During the toll · After the toll · Contract checks | 租赁期内 · 租赁期后 · 合同核查 |
| Labels | Fixed toll fee · Capacity agreement · Merchant after the toll · Model assumption, not a signed contract · Reference case: ‹bound: reference secured share› · This play: ‹bound: secured share› | 固定租赁费 · 容量协议 · 租赁期后承担市场风险 · 模型假设，并非已签合同 · 参考情景：‹bound: reference secured share› · 本方案：‹bound: secured share› |

## 8. The investment

### gb-12 — Why buy it operating · 为什么收购在运资产

| Item | Shot specification |
| --- | --- |
| Scene | Calm overview: one operating battery, connected, with toll and capacity layers; beside it, the waiting queue from gb-07, dashed. Four factor cards; no return gauge |
| Feedback | Factor cards open their section: toll tenor and counterparty → `#bankable`; spreads and services → `#revenue`; queue rules and connection → `#execution`; more batteries, lower spreads, toll expiry → `#downside`. Links keep the market and lens |
| Evidence and chart | CL-GB-09, CL-GB-13, CL-GB-16; REPO-GB-LIVE (`operatingPrice`, next action, trigger); SRC-GB-24/25. No new financial figure |
| Authoring check | The headline return on the card is the new-build case; the operating-asset price is the operating figure, and the story points to it, not to the headline. The live next action names Gate 2; the story adds the commitment-fee consultation from primary sources but does not edit the action. Risk cards explain direction only; no probability or slider |
| Mobile | Factor cards stacked, each with its section link; all four destinations visible at the end |
| Status | Investment reading `proposed`; sources `sourced`; G-1 pending. The story stops at the market page |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why buy an operating battery rather than build one? | 为什么收购在运电池，而不是新建？ |
| Copy | An operating asset already holds its connection and may hold a capacity agreement, so the open queue rules fall on new build. The price decides the case. The card states the entry test: ‹bound: operating price›. More batteries, narrower spreads, a shorter toll or a weaker counterparty would lower what a fund can pay. Then: ‹bound: next action›. | 在运资产已握有并网条件，并可能持有容量协议，因此悬而未决的排队规则主要影响新建项目。价格决定投资是否成立。方案卡列明进入条件：‹bound: operating price›。更多电池、价差收窄、租赁期缩短或对手方信用减弱，都会压低基金可支付的价格。随后：‹bound: next action›。 |
| Meaning | The call holds only at an entry price that clears the yield with the toll as signed. | 只有在按已签租赁条款仍能达到收益率要求的价格进入，这一判断才成立。 |
| Marker | Fair evidence. What would change it: the asset's signed toll and capacity agreement, Ofgem's fee decision, or a changed operating-asset price on the card. | 证据尚可。会改变判断的证据：资产已签的租赁合同与容量协议、Ofgem的收费决定，或方案卡上在运资产价格的变化。 |
| Controls | More batteries · Narrower spreads · Shorter toll · Queue rules · [Bankable case](/markets/great-britain#bankable) · [Revenue](/markets/great-britain#revenue) · [Execution](/markets/great-britain#execution) · [Downside](/markets/great-britain#downside) | 更多电池 · 价差收窄 · 租赁期缩短 · 排队规则 · [可融资方案](/markets/great-britain#bankable) · [收益拆解](/markets/great-britain#revenue) · [执行步骤](/markets/great-britain#execution) · [下行风险](/markets/great-britain#downside) |
| Labels | More batteries · Narrower spreads · Shorter toll · Queue rules | 更多电池 · 价差收窄 · 租赁期缩短 · 排队规则 |

## 9. Binding, chart and traceability contract

### Financial bindings that already exist

Authoring references, not code. `row` is the selected-lens GB row from `opportunities('infraFund')` in `src/experience/model.js`, after the investment-summary projection. Values at check are for the analyst's review only and are never typed into copy.

| Token | Existing owner / field | At check, 31 Oct 2026 | Uses |
| --- | --- | --- | --- |
| ‹bound: call› | `CALLS[row.call]` | Situational (`opportunistic`) | gb-00 |
| ‹bound: play name› | `playTitle(row.play, row.stage)` (`src/governance/playTitle.js`) | Toll · 4h · operating | gb-00 |
| ‹bound: card figures› | The existing card's fields: `row.investment.holdIRR`, `row.investment.secured`, `row.investment.securedYears`, with the card's own basis labels | Hold IRR 5.0% (new-build case); 100% secured for 10 years | gb-00 |
| ‹bound: next action› | `row.play.action.text` | "Buy only operating assets that carry a toll; read the Gate 2 policy before any greenfield exposure." | gb-00, gb-12 |
| ‹bound: play evidence› | `row.evidence`, through the existing evidence labels | `fair` | gb-00 |
| ‹bound: play duration› | `row.play.hours` | 4 | gb-08 |
| ‹bound: secured share› | `row.investment.secured` (same as `row.econ.secured` after projection), card format `share()` | 100% | gb-11 |
| ‹bound: secured tenor› | `row.investment.securedYears` | 10 | gb-11 |
| ‹bound: operating price› | `operatingPrice(row.investment)` in `src/experience/projectFacts.js`, reading `row.investment.operatingPurchase` | Priced, at a 9.9% target; render exactly as the card does | gb-12 |
| ‹bound: toll quoted hours› | `market.comparison.durationResponse.routeRules.toll.quotedHours` (`src/markets/gb/comparison.js`) | 4 | gb-08 |
| ‹bound: capacity agreement years› | `market.comparison.economics.contractYears` | 15 | gb-11 (authoring) |
| ‹bound: de-rating curve› | `market.comparison.durationResponse.hours` with `.capacityDerating`, basis `published` (T-4 2029/30, Table 3) | 1h 10.99% · 2h 21.98% · 4h 43.96% · 6h 66.08% · 8h 87.77% | gb-04, gb-08 |
| ‹bound: reference secured share› | **Gap.** `runBaseCase(byId('gb'), 5).securedShare`, base route `cap`, four hours; computed as `engine[id].secured` in `src/briefing/model.js` but not exported or shown on the card (GAP-GB-REFSECURED) | 11.7%, for 15 years | gb-10, gb-11 |

The view's `thesis` and `play.why` describe the reference share as "a tenth"; the grade reason says 12%. Both are typed strings. The story binds the engine result, never those strings.

### Evidence bindings proposed for later implementation

References to the dated records in §10, **not existing runtime fields**. This PR wires nothing. Missing values hide the figure.

| Token | Record / field | Units and limit |
| --- | --- | --- |
| ‹bound: H-GB-01 NETA date› / ‹bound: H-GB-01 BETTA date› | H-GB-01 sub-dates | Go-live dates; England and Wales, then Great Britain |
| ‹bound: H-GB-02 date› | H-GB-02, first T-4 auction | Auction date, not delivery year |
| ‹bound: H-GB-03 date› | H-GB-03, results publication | Publication date; tender close kept in the drawer |
| ‹bound: H-GB-04 date› | H-GB-04, duration de-rating origin | Assessment date, or the 2018 rules if the report stays unlocated |
| ‹bound: H-GB-05 DC date› / ‹bound: H-GB-05 DR/DM date› | H-GB-05 sub-dates | First delivery or first auction, named |
| ‹bound: H-GB-06 OBP date› | H-GB-06 | Release date |
| ‹bound: H-GB-07 Gate 2 date› / ‹bound: H-GB-07 REMA date› | H-GB-07 sub-dates | Decision date; effective date in the drawer |
| ‹bound: H-GB-08 fee consultation date› | H-GB-08 | Consultation date; decision dashed until made |
| ‹bound: EFR tendered sites›, ‹bound: EFR accepted tenders›, ‹bound: EFR accepted MW›, ‹bound: EFR average price› | SRC-GB-05/06 extract (GAP-GB-EFR) | Counts; MW; £/MW/h availability |
| ‹bound: Gate 2 battery MW› | SRC-GB-24 or SRC-GB-25, one dated figure with its definition | MW in the reformed queue; not built capacity |
| ‹bound: CP2030 battery range› / ‹bound: CP2030 horizon› | SRC-GB-26 | GW range and its target year; an official plan, never shown as built |
| ‹bound: service series› | Chart-GB-FILL output (GAP-GB-SERVICES) | £/MW/h; MW; coverage and fetchedAt |
| ‹bound: source checked date› | Each record's check date | Not a publication or event date |

### Remaining visible text EN / 简体中文

| Context | English | 简体中文 |
| --- | --- | --- |
| Market and lens | Great Britain · Infrastructure fund | 英国 · 基础设施基金 |
| Story entry | Grid, history and full research context | 电网、历史与完整研究背景 |
| Navigation | Previous · Next · Chapters · Open evidence · Close evidence · Back to market | 上一节 · 下一节 · 章节 · 查看证据 · 关闭证据 · 返回市场 |
| Evidence drawer | Source · Locator · Checked on ‹bound: source checked date› · Definition · Event and source · Why it matters | 来源 · 具体位置 · 核查时间：‹bound: source checked date› · 统计口径 · 事件与来源 · 投资含义 |
| Marker strings | Strong evidence. · Fair evidence. · Thin evidence. · What would change it: | 证据充分。 · 证据尚可。 · 证据单薄。 · 会改变判断的证据： |
| Legends | Schematic · Observed event · Official plan · Decision pending · Example · Model assumption | 示意图 · 已发生事件 · 官方计划 · 待决定 · 示例 · 模型假设 |
| Chart axes | Date · Clearing price · £/MW/h · Cleared MW · Offered MW · All technologies | 日期 · 出清价格 · 英镑/MW/小时 · 出清MW · 报价MW · 全部技术类型 |
| Chart notes | Availability prices for holding response ready; not earnings · Auction platform changed here · Tender with multi-year contracts; not a daily auction | 待命响应的可用容量价格，并非收入 · 拍卖平台在此变更 · 多年期合同招标，并非日度拍卖 |
| Chart accessible summary | ‹bound: service series› clearing prices and cleared MW by month, ‹bound: service series› coverage. Auction observations, not battery earnings | ‹bound: service series›各月出清价格与出清MW，覆盖期‹bound: service series›。这是拍卖观测，不是电池收入 |
| Station | Battery modules · Inverter · Transformer · Controls · Connection · Usable energy · Charge · Discharge | 电池模块 · 逆变器 · 变压器 · 控制系统 · 并网接入 · 可用电量 · 充电 · 放电 |
| History node labels (IDs are keys, not page text) | H-GB-01 Bilateral trading replaces the Pool · H-GB-02 First capacity auction · H-GB-03 First fast-response tender · H-GB-04 Storage de-rated by duration · H-GB-05 Dynamic services open · H-GB-06 Batteries dispatched in bulk · H-GB-07 Queue reformed; national price kept · H-GB-08 Battery commitment fee proposed | H-GB-01 双边交易取代电力库 · H-GB-02 首次容量拍卖 · H-GB-03 首次快速响应招标 · H-GB-04 储能按时长折减 · H-GB-05 动态类服务开放 · H-GB-06 电池批量调度 · H-GB-07 并网队列改革；保留全国统一电价 · H-GB-08 提议电池承诺费 |
| Factor cards | More batteries can lower the price of every remaining service and spread · Narrower spreads reduce merchant value after the toll · A shorter toll leaves more of the hold merchant · Queue rules change the value of new connections, not of one already held | 更多电池会压低剩余各项服务的价格与价差 · 价差收窄会降低租赁期后的市场化价值 · 租赁期缩短会使持有期内更多时间承担市场风险 · 排队规则改变的是新并网的价值，而非已握有的并网 |
| Missing values | Current case unavailable; review the market case · Quantitative history not yet available · Loading source data… · Could not load data; retry | 当前情景暂不可用；请查看市场方案 · 量化历史暂不可用 · 正在载入来源数据… · 数据未能载入，重试 |
| Stale call | This story was last reviewed against the call of ‹date›. | 本故事最近一次依据‹date›的投资判断复核。 |
| Reduced motion | You can read the full story without motion | 无需动画也可阅读完整内容 |

### Source-to-shot mapping

| Shot | Claims → sources | Chart / binding owner | Misreading prevented |
| --- | --- | --- | --- |
| gb-00 | CL-GB-16 → REPO-GB-LIVE | Existing play card | Typed thesis figures, or the new-build return read as the operating price |
| gb-01 | CL-GB-03 → SRC-GB-01/02 | Own schematic | Interconnectors share GB's frequency |
| gb-02 | CL-GB-04 → SRC-GB-03/04, H-GB-01 | History bindings | One central price pays batteries |
| gb-03 | CL-GB-07 → SRC-GB-05–07, H-GB-03 | EFR extract | Tender price read as revenue; tendered sites read as winners |
| gb-04 | CL-GB-05/06 → SRC-GB-18–20, REPO-GB-01, H-GB-02/04 | De-rating curve | Capacity paid on nameplate MW |
| gb-05 | CL-GB-08/09 → SRC-GB-08–13 | Chart-GB-FILL | Clearing price read as earnings; all MW read as batteries |
| gb-06 | CL-GB-10/18 → SRC-GB-15–17 | None (no price chart) | £/MW/h added to £/MWh; trading read as secured |
| gb-07 | CL-GB-11–14 → SRC-GB-22–26, H-GB-07/08 | Dated queue records | A proposed fee read as decided; mixed queue definitions |
| gb-08 | CL-GB-06/16 → REPO-GB-LIVE, REPO-GB-01 | Design grid; quoted toll duration | Four hours wins on every route |
| gb-09 | CL-GB-15/16 → SRC-GB-10/21 | None | Services stacked at their maxima |
| gb-10 | CL-GB-15/17/18 → SRC-GB-12/13/17/20/21 | Reference share (gap) | A response award read as a floor |
| gb-11 | CL-GB-16 → REPO-GB-LIVE, REPO-GB-01 | Card share and tenor | Model toll read as a signed contract; no merchant tail |
| gb-12 | CL-GB-09/13/16 → REPO-GB-LIVE, SRC-GB-24/25 | `operatingPrice`; four sections | Call read as "buy at any price" |

Reverse mapping: each SRC-GB record in §10 lists its claims, and each claim lists its shots, so replacing a source queues a finite set of shots, translations and numeric labels for review.

## 10. Sources and claims

New records for this market. They are not yet folded into `source-register.md`; a later PR does that. All checked **31 October 2026**. The first draft could only locate sources by web search. After network access was opened the same day, the documents and datasets were downloaded and read; the access table after the source list says which were opened and which were not.

### Repository records

| ID | Record | Locator |
| --- | --- | --- |
| REPO-GB-LIVE | Live fund call and play | `view/markets/gb.json` (`verdicts.infraFund`, `plays.gb-toll-4h`, `triggers`); `view/index.json`; `src/experience/model.js` `opportunities('infraFund')`; commit `edcb39c`, briefing date 2026-10-31 |
| REPO-GB-01 | Model inputs the story binds or must not cite | `src/markets/gb/comparison.js`: published de-rating curve (gate G1, closed 2026-10-15); toll assumption (`toll`, `tollYears`, `tollAdditiveWithCapacity`, `tollRevertsToMerchant`); `merchGross` labelled ASSUMPTION from a subscription index, not citable |
| REPO-GB-02 | Registered GB datasets | `src/governance/datasets.js`: only `gb-day-ahead` (ENTSO-E). No NESO service, EAC or Elexon dataset registered |

### Primary-source records

| ID | Publisher · title | URL | Locator found | Claims |
| --- | --- | --- | --- | --- |
| SRC-GB-01 | NESO · GB Synchronous Area operational methodology (SOGL) and supporting document | https://www.neso.energy/document/299176/download · https://www.neso.energy/document/127206/download | Scope: GB as its own synchronous area; standard frequency range | CL-GB-03 |
| SRC-GB-02 | NESO · National Electricity Transmission System Performance Report | https://www.neso.energy/document/267701/download | Interconnector list (HVDC links) | CL-GB-03 |
| SRC-GB-03 | Ofgem · NETA: a review of the first three months (Aug 2001); NETA factsheet (Feb 2002) | https://www.ofgem.gov.uk/sites/default/files/docs/2001/08/a-review-of-the-first-three-months-31-08_0.pdf · https://www.ofgem.gov.uk/sites/default/files/docs/2002/03/1098-factsheet0502_27feb_0.pdf | Factsheet: NETA "introduced in England and Wales on Tuesday 27 March 2001" | CL-GB-04 |
| SRC-GB-04 | Ofgem · What is BETTA? (Apr 2002); Energy Act 2004 explanatory notes; HMRC VFUP3300 | https://www.ofgem.gov.uk/sites/default/files/docs/2002/04/1105-factsheet0702_15april_0.pdf · https://www.legislation.gov.uk/ukpga/2004/20/notes/division/6/2/1 · https://www.gov.uk/hmrc-internal-manuals/vat-fuel-and-power/vfup3300 | BETTA user guide (Feb 2005): go-live "anticipated to be 1 April 2005", https://www.ofgem.gov.uk/sites/default/files/docs/2005/02/9549-2605.pdf; Ofgem July 2005 consultation: NETA "extended GB wide under BETTA in April 2005", https://www.ofgem.gov.uk/sites/default/files/docs/2005/07/11190-17805.pdf | CL-GB-04 |
| SRC-GB-05 | National Grid · Enhanced Frequency Response Market Information Report (26 Aug 2016) | https://www.nationalgrid.com/sites/default/files/documents/EFR%20Market%20Information%20Report%20v1%20(1)_1.pdf | Tender closed 15 Jul 2016; 37 providers, 64 sites; 8 tenders accepted, 201 MW, total £65.95m, average £9.44/MW/h | CL-GB-07 |
| SRC-GB-06 | National Grid · Enhanced Frequency Response 2016 (presentation) | https://www.nationalgrid.com/sites/default/files/documents/8589937157-06_EFR.pdf | Tendered sites by technology: 61 of 64 battery | CL-GB-07 |
| SRC-GB-07 | National Grid · EFR Invitation to Tender v2.2 | https://www.nationalgrid.com/sites/default/files/documents/Enhanced%20Frequency%20Response%20ITT%20v2_2%20compare.pdf | NESO copy: https://www.neso.energy/document/101541/download. §3.4: contracts of up to four years; 50 MW cap per applicant (§3.4, §7.17); results due 26 Aug 2016 | CL-GB-07 |
| SRC-GB-08 | NESO · "National Grid ESO debuts Dynamic Containment frequency response service"; ESO Annual Report 2020 | https://www.neso.energy/news/national-grid-eso-debuts-dynamic-containment-frequency-response-service · https://www.neso.energy/document/217826/download | News dated 30 Sep 2020: goes live in the control room at 11pm; first round accepted two battery units for 90 MW; tenders seven days a week | CL-GB-08 |
| SRC-GB-09 | Ofgem · DR and DM Article 18 decision letters (Mar 2022); decision on DR, DM and DC terms (Feb 2023); NESO Dynamic Services page; ESO news on DM | https://www.ofgem.gov.uk/sites/default/files/2022-03/DR%20Art18%20decision%20letter.pdf · https://www.ofgem.gov.uk/sites/default/files/2022-03/DM%20Art18%20decision%20letter.pdf · https://www.ofgem.gov.uk/sites/default/files/2023-02/Decision%20on%20Dynamic%20Regulation%2C%20Dynamic%20Moderation%20and%20Dynamic%20Containment%20in%20relation%20to%20an%20update%20to%20the%20Terms%20and%20Conditions%20related%20to%20Balancing.pdf · https://www.neso.energy/industry-information/balancing-services/frequency-response-services/dynamic-services-dcdmdr · https://nationalgrideso.com/news/new-service-added-esos-frequency-response-line | DC high launched October 2021 (Ofgem 2023); DM added 21 Apr 2022 (ESO news). First cleared deliveries in SRC-GB-12: DC high 4 Nov 2021, DR 9 Apr 2022, DM 7 May 2022 (CF-GB-05) | CL-GB-08 |
| SRC-GB-10 | NESO · Enduring Auction Capability platform (news); May 2024 Balancing Costs technical report | https://www.neso.energy/news/enduring-auction-capability-platform-new-and-improved-platform-procuring-frequency-response-services · https://www.neso.energy/document/318666/download | News dated 24 Nov 2023: bids for several services at once; first EAC round, average clearing price 35% below the previous seven days, cleared volume stable. May 2024 report: "In November 2023 the procurement of DC, DM and DR was moved to the Enduring Auction Capability (EAC) platform" | CL-GB-08, CL-GB-09, CL-GB-15 |
| SRC-GB-11 | NESO · Balancing Cost Winter Report (May 2024); Monthly Balancing Cost Reports, July and August 2026 | https://www.neso.energy/document/318696/download · https://www.neso.energy/document/386501/download · https://www.neso.energy/document/388201/download | Falls attributed to more participants, requirement certainty and auction design; 2026 moves to liquidity and offered volume against a firm requirement | CL-GB-09 |
| SRC-GB-12 | NESO data portal · Dynamic Containment, Regulation and Moderation auction results | https://www.neso.energy/data-portal/dynamic-containment-data | Rights: NESO Open Data Licence; "This dataset will no longer be updated". CKAN package `dynamic-containment-data` (api.neso.energy): DC masterdata 2020–21 (fields incl. Volume Accepted, Availability Fee, Technology Type); results summary 2021–2023 (Service, EFA Date, Cleared Volume, Clearing Price); results by unit 2021–2023 (incl. Technology Type); linear and block orders | CL-GB-08, CL-GB-09 |
| SRC-GB-13 | NESO data portal · EAC auction results | https://www.neso.energy/data-portal/eac-auction-results | Rights: NESO Open Data Licence; daily update. CKAN package `eac-auction-results`: Response-Reserve results summary (auctionProduct, deliveryStart, clearedVolume, clearingPrice), current year plus FY2023, FY2024 and FY2025 archives; results by unit (incl. technologyType); sell orders (quantity, executedQuantity) | CL-GB-09 |
| SRC-GB-14 | NESO · NESO Open Licence | https://www.neso.energy/data-portal/neso-open-licence | Licence v1.0, "based on version 3.0 of the Open Government Licence"; free to "exploit the Information commercially and non-commercially"; attribution "Supported by National Energy SO Open Data"; applies dataset by dataset | Chart terms |
| SRC-GB-15 | NESO · "First stages of Open Balancing Platform go live"; "The start of the balancing mechanism revolution"; RIIO-2 BP2 2023-24 incentives report | https://www.neso.energy/news/first-stages-open-balancing-platform-go-live · https://www.neso.energy/news/start-balancing-mechanism-revolution · https://www.neso.energy/document/318646/download | News dated 13 Dec 2023: first stage goes live "this week" for bulk dispatch of battery storage and small units. Incentives report: Release 1 in December 2023; average daily volume instructed for batteries up 220% after early fixes | CL-GB-10 |
| SRC-GB-16 | NESO · Skip rates page and methodology guide | https://www.neso.energy/industry-information/balancing-services/skip-rates · https://www.neso.energy/document/350061/download | Two skip-rate datasets; by-technology reporting since June 2025 | CL-GB-10 |
| SRC-GB-17 | Elexon · Licence to use BMRS open data; BMRS API terms | https://www.elexon.co.uk/bsc/data/balancing-mechanism-reporting-agent/copyright-licence-bmrs-data/ · https://www.elexon.co.uk/bsc/data/balancing-mechanism-reporting-agent/copyright-licence-use-bmrs-api/ | Licence page: free to "exploit the BMRS Data, including commercially", with attribution; API terms separate; conflicting general copyright page (CF-GB-08) | CL-GB-18, GAP-GB-REVSPLIT |
| SRC-GB-18 | DECC via GOV.UK · "First Capacity Market auction guarantees security of supply at low cost"; T-4 2014 provisional results | https://www.gov.uk/government/news/first-capacity-market-auction-guarantees-security-of-supply-at-low-cost · https://assets.publishing.service.gov.uk/media/5a7dd9bde5274a5eb14e7913/Provisional_Results_Report-Ammendment.pdf | "The T-4 Capacity Auction for delivery in 2018 concluded on 18th December 2014" | CL-GB-05 |
| SRC-GB-19 | DESNZ · Capacity Market Rules, informal consolidation July 2026, Schedule 3B; Capacity Market (Amendment) Rules 2018 | https://assets.publishing.service.gov.uk/media/6a68894dcc35a9471da4c18f/capacity-market-rules-consolidation-2026.pdf · https://www.ofgem.gov.uk/sites/default/files/docs/2018/07/the_capacity_market_amendment_rules_2018_-_presented_to_parliament.pdf | 2026 consolidation opened: Schedule 3B, methodology for determining de-rating; rule 2.3.5B (EFC under Schedule 3B). 2018 amendment not reopened; the Dec 2017 National Grid assessment not located (CF-GB-09) | CL-GB-06 |
| SRC-GB-20 | NESO and DESNZ · T-4 2029/30 results and auction monitor report; Capacity Market Register | https://www.neso.energy/news/delivering-reliability-gb-consumers-capacity-market-action · https://assets.publishing.service.gov.uk/media/69b44fd2cf4af9cad362b41c/t-4-2025-delivery-year-2029-2030-auction-monitor-report.pdf · https://www.neso.energy/data-portal/capacity-market-register | NESO news: concluded 11 Mar 2026 at £27.10/kW/year, against £60–65 in the previous three T-4s; 40.1 GW for 2029/30. Monitor report confirms the price. Register holds agreements and a de-rating CSV. Table 3 of the T-4 2029/30 guidelines per REPO-GB-01 (not reopened) | CL-GB-06, CL-GB-17 |
| SRC-GB-21 | EMR Settlement and legislation.gov.uk · Capacity Market scheme page; G15 supplier payments; Electricity Capacity (Supplier Payment etc.) Regulations 2014 | https://www.emrsettlement.co.uk/schemes/capacity-market/ · https://www.emrsettlement.co.uk/document/guidance/g15-cm-supplier-payments/ · https://www.legislation.gov.uk/uksi/2014/3354 | Suppliers pay the Capacity Market Supplier Charge; the Electricity Settlements Company pays providers; stress-event penalties | CL-GB-15 |
| SRC-GB-22 | DESNZ · REMA summer update 2025 | https://www.gov.uk/government/publications/review-of-electricity-market-arrangements-rema-summer-update-2025/review-of-electricity-market-arrangements-rema-summer-update-2025-accessible-webpage | 10 Jul 2025: "retain a single national GB-wide wholesale market"; "We have therefore decided not to implement zonal pricing" | CL-GB-11 |
| SRC-GB-23 | Ofgem · TMO4+ summary decision; Gate 2 Criteria Methodology decision (OFG1164); extension decision | https://www.ofgem.gov.uk/sites/default/files/2025-04/Summary-Decision-Document-TMO4-package.pdf · https://www.ofgem.gov.uk/sites/default/files/2025-04/Gate-2-Criteria-Methodology-Final-Decision.pdf · https://www.ofgem.gov.uk/sites/default/files/2025-05/Decision%20on%20Extension%20to%20Transition%20to%20Connections%20Reform-20250520112644.pdf | Summary decision, publication date 15 Apr 2025; extension decision: implementation on 10 Jun 2025. Gate 2 wording (confirmed date, point, queue position) from the methodology decision, not reopened | CL-GB-12 |
| SRC-GB-24 | DESNZ and Ofgem · Open letter, "Connections Reform: delivery update and battery capacity" (Apr 2026) | https://www.gov.uk/government/publications/connections-reform-delivery-update-and-battery-capacity/open-letter-from-desnz-and-ofgem-on-connections-reform-delivery · https://www.ofgem.gov.uk/transparency-document/connections-reform-and-battery-capacity-update | Letter dated 16 Apr 2026: "14.8 GW above the top of the Action Plan battery capacity range for 2030 and 61.7 GW above the projected battery system need in 2035"; NESO's consultation raises disapplying protections 3a/3b so only batteries with a revenue support scheme qualify in the next window | CL-GB-13 |
| SRC-GB-25 | Ofgem and NESO · CMP470 Oversubscribed Technologies Commitment Fee: urgency decision, workgroup report, minded-to consultation (17 Sep 2026), press release | https://www.ofgem.gov.uk/sites/default/files/2026-09/CMP470-Minded-to-Consultation.pdf · https://www.ofgem.gov.uk/consultation/connection-and-use-system-code-cusc-cmp470-introducing-oversubscribed-technologies-commitment-fee-otcf · https://www.ofgem.gov.uk/press-release/ofgem-moves-free-grid-capacity-tackling-excess-battery-projects · https://www.neso.energy/document/383006/download | Minded-to consultation, response deadline 1 Oct 2026; press release 17 Sep 2026: about 90 GW of batteries operational or in the reformed queue (83 GW prioritised plus 7 GW operating) against about 29 GW needed by 2035. Decision awaited (CF-GB-10) | CL-GB-13 |
| SRC-GB-26 | DESNZ · Clean Power 2030 Action Plan main report (Dec 2024); Clean Flexibility Roadmap (Jul 2025) | https://www.gov.uk/government/publications/clean-power-2030-action-plan/clean-power-2030-action-plan-a-new-era-of-clean-electricity-main-report · https://www.gov.uk/government/publications/clean-flexibility-roadmap/clean-flexibility-roadmap | "23-27 GW" of batteries by 2030 (opened); separate long-duration category | CL-GB-14 |
| SRC-GB-27 | NESO · "NESO to launch new Quick Reserve service"; Slow Reserve page | https://www.neso.energy/news/neso-launch-new-quick-reserve-service · https://www.neso.energy/industry-information/balancing-services/reserve-services/slow-reserve | Quick Reserve launch on 3 Dec 2024 (opened); Slow Reserve go-live notice, intended 31 Mar 2026 (not opened) | CL-GB-09 (later services) |

No licence-restricted report is cited. Subscription indices and trade press were used only to find primary documents; where a fact rests on trade press alone, it is marked as a conflict or gap.

### Access at check

| Opened and read, 31 Oct 2026 | Not opened |
| --- | --- |
| SRC-GB-01 (methodology, document 299176); SRC-GB-03 (factsheet); SRC-GB-04 (all three Ofgem documents); SRC-GB-07 (NESO copy of the ITT); SRC-GB-08 (news); SRC-GB-09 (Ofgem 2023 decision; ESO DM news); SRC-GB-10; SRC-GB-11 (winter 2024 and August 2026 reports); SRC-GB-12 and SRC-GB-13 (dataset pages and CSV files through the NESO API); SRC-GB-14; SRC-GB-15 (news; incentives report); SRC-GB-17 (licence page); SRC-GB-18 (provisional results); SRC-GB-19 (2026 consolidation); SRC-GB-20 (news; monitor report); SRC-GB-22; SRC-GB-23 (summary and extension decisions); SRC-GB-24; SRC-GB-25 (minded-to consultation; press release); SRC-GB-26 (main report); SRC-GB-27 (Quick Reserve news) | SRC-GB-05 and SRC-GB-06: the National Grid URLs now return 404 and no archive copy could be reached (CF-GB-12). SRC-GB-02; the DR and DM decision letters; the July 2026 monthly report; SRC-GB-16; the 2018 amendment rules; the T-4 2029/30 guidelines (Table 3, held in REPO-GB-01); SRC-GB-21 (EMRS page opened but holds no payment wording; the 2014 Regulations not opened); the Gate 2 methodology decision; the CMP470 urgency decision and workgroup report; the Clean Flexibility Roadmap; the Slow Reserve page |

### CALC-GB-TECH: battery share of accepted MW, check only

Computed on 31 Oct 2026 from the files in SRC-GB-12/13 to test GAP-GB-TECH. These values are for the analyst's review; they are never typed into page copy, and the build recomputes them.

| File | MW basis | Battery share | Notes |
| --- | --- | --- | --- |
| DC masterdata 2020–21 | Volume Accepted | 100% | One label, "Battery" |
| DC/DR/DM results by unit 2021–2023 | Cleared Volume | About 95% | Labels vary ("Batteries", "Battery", "BATTERIES", "BATTERY"); about 4% "NA" |
| EAC Response-Reserve results by unit (current file), response services only | executedQuantity | About 97.5% | "Batteries"; the rest "Other", blank or thermal |

Rule for the build: normalise battery labels case-insensitively; keep "NA" and blank as "other or unlabelled", never as battery.

### CALC-GB-PRICE: clearing-price check, check only

Volume-weighted mean clearing price by service and calendar year, £/MW/h, from the DC masterdata (accepted bids), the 2021–2023 results summary and the current EAC results summary (from 31 Mar 2026 only; the FY2023–FY2025 archives were not added in this check). For review, not for copy.

| Service | Launch period | 2023 | 2026 (Apr–Oct) |
| --- | --- | --- | --- |
| DC low | About 17 (2020–21) | About 3.1 | About 3.6 |
| DC high | About 6.0 (2021) | About 3.8 | About 2.4 |
| DR low / high | About 21.7 / 12.1 (2022) | About 10.0 / 1.7 | About 17.0 / −9.5 |
| DM low / high | About 4.4 / 7.2 (2022) | About 4.0 / 3.2 | About 8.1 / 0.0 |

Reading: from launch to 2023 every product fell, most of them steeply. In 2026, with larger requirements, low-frequency Regulation and Moderation have risen again, while high-frequency Regulation clears below zero. The saturation argument holds for the services' early value, not as a one-way decline in every product (CF-GB-11).

### Claim ledger

CL-GB-01 and CL-GB-02 are the candidates added in v1.3 (PR #83); their results are below. New claims start at CL-GB-03.

| ID | Statement | Event / interpretation | Sources | Result | Shots |
| --- | --- | --- | --- | --- | --- |
| CL-GB-01 | Fast-frequency tenders drew Great Britain's first battery wave, and each service batteries entered later filled in turn | Event: a battery-dominated 2016 tender, then Dynamic services whose prices fell as participation grew. Interpretation: "first wave" and "filled" | See CL-GB-07–09 | **Corrected and split** into CL-GB-07, 08 and 09. "Filled" restated as NESO's own wording: more MW competing for a firm requirement | gb-03, gb-05 |
| CL-GB-02 | The Capacity Market de-rates storage by duration, and Gate 2 may limit progression for batteries with revenue support | Event: Schedule 3B de-rating; 2026 queue measures. Interpretation: effect on new build | See CL-GB-06, 13 | **First half confirmed** (CL-GB-06). **Second half corrected:** the primary record is an April 2026 open letter, a NESO consultation on protections for batteries without revenue support, and a pending commitment fee (CL-GB-13) | gb-04, gb-07 |
| CL-GB-03 | GB is its own synchronous area, joined to its neighbours only by direct current, so it holds most of its frequency response itself | Event: synchronous-area definition. Interpretation: why GB buys fast response | SRC-GB-01/02 | Sourced: SRC-GB-01 opened ("GB Synchronous Area" methodology); link list not opened | gb-01 |
| CL-GB-04 | Bilateral trading replaced the Pool on 27 Mar 2001 in England and Wales and covered GB from 2005; the Balancing Mechanism settles the residual | Event | SRC-GB-03/04 | Sourced; BETTA date secondary (CF-GB-04) | gb-02 |
| CL-GB-05 | The Capacity Market's first T-4 auction concluded in Dec 2014 for 2018/19; suppliers fund it | Event | SRC-GB-18, SRC-GB-21 | Sourced | gb-04, gb-10 |
| CL-GB-06 | Storage is de-rated by duration (Schedule 3B, from the 2018 rules); factors rise with duration in the T-4 2029/30 table | Event; table values per REPO-GB-01 | SRC-GB-19/20, REPO-GB-01 | Sourced; 2017 assessment secondary (CF-GB-09) | gb-04, gb-08 |
| CL-GB-07 | The first EFR tender (results 26 Aug 2016) drew mostly battery sites; few tenders were accepted, on contracts of up to four years | Event: results. Interpretation: it started the battery wave | SRC-GB-05–07 | Terms confirmed in the opened ITT; result figures from a report that has since moved (CF-GB-12); interpretation proposed | gb-03, gb-05 |
| CL-GB-08 | DC opened in Oct 2020 (low) and 2021 (high); DR and DM followed in Apr and May 2022; procurement moved to a co-optimising auction in late 2023 | Event | SRC-GB-08–10, SRC-GB-12 | Confirmed: opened NESO news, Ofgem decision and first cleared deliveries in the dataset (CF-GB-01 and CF-GB-02 resolved; CF-GB-05 recorded) | gb-05 |
| CL-GB-09 | Dynamic-service clearing prices fell far below launch levels as participants and offered volume grew; NESO attributes the falls to that and to auction design. Since 2023 prices have moved with requirements, and some clear below zero | Event: prices; NESO's interpretation. Platform interpretation: saturation | SRC-GB-10–13, SRC-GB-27; CALC-GB-PRICE | **Corrected:** confirmed to 2023; the 2026 data show a mixed picture by direction (CF-GB-11). Numeric chart still needs registration (GAP-GB-SERVICES) | gb-05, gb-12 |
| CL-GB-10 | From 12 Dec 2023 NESO could bulk-dispatch batteries in the Balancing Mechanism, and battery instructions rose | Event. Interpretation: value moved to trading and balancing | SRC-GB-15/16 | Event sourced; revenue shift unsourced (GAP-GB-REVSPLIT) | gb-06 |
| CL-GB-11 | On 10 Jul 2025 the government kept a single national wholesale price and rejected zonal pricing | Event | SRC-GB-22 | Sourced | gb-07 |
| CL-GB-12 | Ofgem approved the reordered connection queue (TMO4+, Gate 2) on 15 Apr 2025, effective 10 Jun 2025 | Event | SRC-GB-23 | Sourced | gb-07 |
| CL-GB-13 | Batteries in the reformed queue exceed the 2030 plan; Ofgem is minded to approve a commitment fee for oversubscribed technologies, decision pending; protections for batteries without revenue support are under consultation | Event: letter, consultation. Interpretation: rules fall on new build, not on operating assets | SRC-GB-24/25 | Sourced; decision `missing` | gb-07, gb-12 |
| CL-GB-14 | The government plans 23–27 GW of batteries by 2030 | Official plan | SRC-GB-26 | Sourced | gb-07 |
| CL-GB-15 | Response is paid per MW per hour by NESO; one unit's MW can be split across services but not sold twice; the capacity obligation requires delivery in stress events | Market rule | SRC-GB-10, SRC-GB-21 | Sourced; splitting rules to extract | gb-09, gb-10 |
| CL-GB-16 | The play assumes a ten-year toll with offtaker dispatch, the owner keeping its capacity agreement, and merchant exposure after; it secures the card's share for the card's tenor | Model assumption | REPO-GB-LIVE, REPO-GB-01 | Confirmed as the model's route; no public primary source for toll terms (GAP-GB-TOLL) | gb-00, gb-08, gb-09, gb-11, gb-12 |
| CL-GB-17 | The T-4 2029/30 auction cleared below the three previous T-4 clears | Event | SRC-GB-20 | Sourced; not used in copy (Revenue section owns it) | gb-10 (authoring) |
| CL-GB-18 | Response prices (£/MW/h), energy spreads (£/MWh) and capacity prices (£/kW/year) are different units; a clearing price is not captured revenue | Method | SRC-GB-12, SRC-GB-17, SRC-GB-21 | Sourced | gb-05, gb-06, gb-10 |

### Historical nodes, events separate from interpretation

| Node | Event and date | Interpretation ("Why it matters") | Sources |
| --- | --- | --- | --- |
| H-GB-01 | NETA go-live 27 Mar 2001 (England and Wales); BETTA, GB-wide, April 2005 (planned for 1 April) | Value comes from trading and balancing, not a central price | SRC-GB-03/04 |
| H-GB-02 | First T-4 capacity auction concluded 18 Dec 2014 (provisional), delivery 2018/19 | A supplier-funded capacity line exists beside energy-only trading | SRC-GB-18 |
| H-GB-03 | EFR tender results published 26 Aug 2016 | A small fast service drew the first batteries | SRC-GB-05–07 |
| H-GB-04 | Storage de-rated by duration: National Grid assessment Dec 2017 (secondary); Schedule 3B in the 2018 rules | Hours earn capacity credit | SRC-GB-19 |
| H-GB-05 | DC live 30 Sep 2020 at 11pm, first delivery 1 Oct; DC high October 2021 (first cleared 4 Nov 2021); DR first delivery 9 Apr 2022; DM first delivery 7 May 2022; co-optimising auction November 2023 | Each service filled as battery supply grew | SRC-GB-08–10 |
| H-GB-06 | Open Balancing Platform release 1 with battery bulk dispatch, December 2023 (week of 13 Dec) | Batteries moved into balancing and trading | SRC-GB-15 |
| H-GB-07 | TMO4+ approved 15 Apr 2025, effective 10 Jun 2025; REMA kept national pricing 10 Jul 2025 | Connection order and a national price shape new build | SRC-GB-22/23 |
| H-GB-08 | DESNZ/Ofgem letter Apr 2026; CMP470 minded-to 17 Sep 2026; decision pending (dashed) | New-build batteries face a fee still being set | SRC-GB-24/25 |

### Conflicts and dispositions

| ID | Conflict | Disposition |
| --- | --- | --- |
| CF-GB-01 | Move to the co-optimising auction: October in some accounts | **Resolved:** November 2023 (NESO news of 24 Nov 2023; May 2024 report) |
| CF-GB-02 | T-4 2029/30 concluded 10 March (NESO page summary) or 11 March 2026 | **Resolved:** 11 March 2026 (NESO news, opened). Not in copy |
| CF-GB-03 | NESO's August 2026 report prints response clearing prices in £/MWh (for example DR "at £1.73/MWh"); these are availability prices | Confirmed in the opened report. Use the dataset's units, £/MW/h; never copy the report's label |
| CF-GB-04 | BETTA go-live date first found only in an HMRC manual | **Resolved:** Ofgem's February 2005 guide (planned 1 April 2005) and July 2005 consultation ("in April 2005") |
| CF-GB-05 | DC high: Ofgem says it launched in October 2021; the first cleared delivery in the 2021–2023 results is 4 Nov 2021. DR and DM dates come from the dataset's first deliveries (9 Apr and 7 May 2022), a day after the trade-press auction dates | Bind each node to the named measure (launch or first delivery) |
| CF-GB-06 | Fleet and queue figures differ by scope and date: the Action Plan's Q4 2024 baseline, the Roadmap's 2024 table, Ofgem's Sept 2026 figures, and the view's transmission-register grade | One dated record per figure, definition shown; the story does not reuse the view's grade reason |
| CF-GB-07 | The view's Gate 2 trigger cites a subscription news article (`access: search-summary`) | Story cites SRC-GB-24/25; repointing the trigger is view-store work for the analyst |
| CF-GB-08 | Elexon's BMRS licence allows commercial reuse; its general copyright page says commercial use is prohibited | Not needed for the signature chart; confirm before any Elexon dataset |
| CF-GB-09 | The Dec 2017 storage de-rating assessment is known from secondary sources only | Date H-GB-04 by the 2018 rules unless the report is found |
| CF-GB-10 | CMP470 decision date: 12 Nov 2026 in a NESO table, earlier 14 Oct 2026 | Show "decision pending"; no date in copy |
| CF-GB-11 | "Each service filled" against the 2026 data: low-frequency DR and DM prices are higher in 2026 than in 2023, while DR high clears below zero (CALC-GB-PRICE) | Copy says prices fell far below launch levels and have since moved with requirements; the chart shows both directions and negative values. Does not contradict the call |
| CF-GB-12 | The EFR results report and presentation have moved: the National Grid URLs return 404 | Figures stay from the search record; find the NESO copy before G-2, or show the tender as a qualitative node |

### Gaps for the build

| ID | Gap | Needed |
| --- | --- | --- |
| GAP-GB-OPEN | **Mostly closed.** Most sources opened after network access changed; the rest are listed in the access table | Open the remaining records before G-2 |
| GAP-GB-SERVICES | Signature chart data not registered in `src/governance/datasets.js` | Register the NESO DC/DR/DM results (fixed vintage, 2020–2023) and EAC results (live, with the FY2023–FY2025 archives) as new GB datasets at build. Both carry the NESO Open Data Licence, which permits commercial and non-commercial reuse with attribution. Then `npm run etl:verify` |
| GAP-GB-TECH | **Closed for the method.** The files carry a technology field (CALC-GB-TECH) | Normalise labels at build; unlabelled MW stays "other or unlabelled" |
| GAP-GB-EFR | EFR result figures are in a document that has moved (CF-GB-12); the terms are confirmed in the ITT | Static evidence record from SRC-GB-05/06 once a copy is found |
| GAP-GB-REFSECURED | The reference-case secured share is an engine result not on the card | A read-only binding to the existing engine result; no model change |
| GAP-GB-REVSPLIT | No primary-source revenue split by route | Elexon settlement plus NESO results; would need exchange day-ahead prices for the wholesale leg, so it waits on the price-data rights review. gb-06 stays Thin until then |
| GAP-GB-TOLL | Toll terms have no public primary source | Verify on the asset; the model stays an assumption |

### Chart-GB-FILL: calculation contract, proposed not executed

- **Question it answers:** as more MW competed for each fast service, what happened to its clearing price?
- **Inputs:** SRC-GB-12 (DC masterdata 2020–21; DC/DR/DM results 2021–2023) and SRC-GB-13 (EAC results summary from November 2023: FY2023, FY2024 and FY2025 archives plus the current file). Exchange day-ahead prices are **not** needed.
- **Upper panel:** clearing price, £/MW/h, by service and direction (DC low/high, DR low/high, DM low/high); monthly mean of EFA-block clearing prices, volume-weighted where cleared volume is given. The axis runs below zero. Method shown in "How measured". The 2020–21 masterdata holds per-bid availability fees, not block clearing prices: use accepted bids, volume-weighted, and label the method.
- **Lower panel:** cleared MW by service, monthly mean per EFA block; offered MW (sum of sell-order quantities) only where order files exist. "Of which battery" from the technology field, cleaned as in CALC-GB-TECH.
- **EFR 2016:** one point per panel (average accepted price; accepted MW), styled as a tender with multi-year contracts and not joined to any line.
- **Events:** H-GB-05 and H-GB-06 as labelled vertical lines. Lines break at the auction-platform change; no smoothing across it.
- **Never:** £/MWh, annualised revenue, a price-to-earnings bridge, a requirement line without a NESO series, or a fitted trend.
- **Terms:** NESO Open Data Licence (SRC-GB-14), confirmed on both dataset pages; commercial and non-commercial reuse permitted with the attribution "Supported by National Energy SO Open Data". Publication boundary `public-and-reusable`. The by-unit files name companies; the chart shows service totals only and names no company.
- **Accessible equivalent:** monthly table, same units and coverage.

The v1.3 story card proposed a different signature chart: the reference project's revenue by route, the small secured slice against the share a toll fixes. This script uses that comparison as a two-line text card in gb-11 instead, and proposes Chart-GB-FILL as the one signature chart. The analyst chooses at G-1.

## 11. G-1 record and stopping point

| Review | Status and decision required |
| --- | --- |
| Electricity mechanics | Pending: GB as its own synchronous area; NETA and BETTA; EFR as the first battery wave; de-rating by duration; Dynamic services filling and NESO's attribution; bulk dispatch; Gate 2, the queue letter and the pending fee |
| Investment meaning | Pending: the live `gb-toll-4h` / Situational anchor; saturation as the argument; toll plus capacity agreement as the secured revenue, with tenor and merchant tail; the operating-asset price as the entry test; no service price shown as revenue |
| English / Chinese | Pending: same meaning for availability price, energy spread, de-rated capacity, toll, offtaker, commitment fee and pending decision; all figures bound |
| Script decision | **G-1 pending. Analyst: sign off gb-00 to gb-12, or name changes.** |
| Build boundary | Stop here. No code, dataset registration, snapshot, model or view change, rendering, build, deployment or G-2 work in this task |

Points for the analyst at G-1:

1. The argument in §1 and the live anchor: Situational, `gb-toll-4h`, operating, read from `main` at `edcb39c`.
2. The signature chart: Chart-GB-FILL (service prices against cleared MW, from NESO results) or the card's original revenue-by-route chart.
3. The reference secured share in gb-10 and gb-11: approve a read-only binding to the engine's capacity-route result (GAP-GB-REFSECURED), or drop the comparison.
4. gb-06 at Thin: accept it, or drop the revenue-shift sentence until GAP-GB-REVSPLIT closes.
5. The gb-12 entry test: point to the card's operating-asset price, not the headline new-build return.
6. CF-GB-07: whether to repoint the view's Gate 2 trigger to the primary records (separate view-store work).
7. Each shot's marker and "What would change it" line, and the Chinese drafts.
8. CF-GB-11: accept the corrected gb-05 copy, which says prices fell far below launch levels and have since moved with requirements, some below zero.
9. Whether the EFR tender figures may stay on a search record (CF-GB-12) or must wait for a copy of the moved report.

Checks run for this script: the live call, play, card fields and engine results were read from `main` at `edcb39c` by running the existing model functions, with no change; thirteen shots each have the six specification rows and the five page-text rows in both languages (gb-00 without a Meaning line, as in the templates); every `‹bound›` token in page text has a register entry in §9; page text carries no figure outside a bound token except unit names and the service name Gate 2. After network access changed, the sources in the access table were opened and the NESO datasets downloaded to a scratch folder outside the repository for CALC-GB-TECH and CALC-GB-PRICE; nothing from them was added to the repository. The existing test suite passed 1,023 tests (15 skipped) and the current-model checks passed 84, with no fixture regeneration. No build, budget, browser or ETL check was run: only this Markdown file changed, under the task's "build nothing" scope. The local confidentiality guard could not scan, because this session has no marker list; CI repeats it with the secrets.
