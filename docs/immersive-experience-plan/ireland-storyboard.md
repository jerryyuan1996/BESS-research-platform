# Ireland: Six-Chapter Storyboard

Pack: BESS-IX-2026-10-30; Ireland script researched 31 October 2026; shot layout v1.2
Status: `proposed` script and bilingual page-text draft; **G-1 analyst sign-off pending**; steps 1 and 2 only. Markdown only; no implementation, dataset registration or publication approval.
Navigation: [Master plan](README.md) | [Ireland card](market-narratives.md#3-eighteen-market-candidate-story-cards) | [Evidence specification](evidence-and-content-specification.md) | [Sources and claims](#11-sources-and-claims) | [WA format](western-australia-storyboard.md)

## 1. Scope, argument and reading route

**Explain the current fund call: build a position in ready-to-build four-hour batteries that hold a capacity contract.** Ireland and Northern Ireland run one small power system on one island, linked to Great Britain only by direct-current cables. To run that system on a very high share of wind, the operators created the DS3 programme and paid for fast system services; those payments built the island's first battery fleet. The regulators have now set a long-stop on the DS3 tariffs, with competitive daily auctions to follow and no confirmed start date. The capacity auction, which pays for firm megawatts years ahead and credits storage by duration, is what carries the case. The play prices a project on capacity and wholesale income, with no system-services line after the long-stop.

Allocation: `ie`; physical boundary: the all-island system of Ireland and Northern Ireland (the SEM). Default lens: `infraFund`. `reviewedAgainst`: **REPO-IE-LIVE**, `main` at commit `edcb39ca0d69397f3683dffc9af5ffb49473c98c`, briefing evaluated for 2026-10-31: call `build-position`, displayed **Build position / 提前布局**, tier `prepare`, play **`ie-cap-4h`**, route `cap`, entry `ready-to-build`, row evidence `strong`, next trigger `ie-ds3-long-stop`, review by 2027-03-31. This matches the market card (PR #83). `docs/briefing-content-2026-10.md` is stale and was not used.

The published view's thesis, `play.why` and grade reasons contain typed figures and dates. They are not copied; every figure on the page binds to a result field or a dated evidence record (§9).

**Competing explanation.** The services line may not vanish: the successor daily auction (DASSA) could start, pay well for scarce fast response, and give a four-hour battery a second income. Wholesale spreads on a wind-led island could also carry more of the case than the model assumes. Both would be upside to this play, not reasons to change it.

**Disconfirming condition.** The case weakens if the capacity auction is redesigned so that new four-hour storage earns less credit or a shorter contract, if de-rating factors for storage fall, or if a project cannot deliver by its contract date. A different live call, play or duration needs re-sign-off; research does not re-grade it.

| Chapter / page heading EN · 简体中文 | Shots | What the reader can explain afterwards |
| --- | --- | --- |
| Opening · 先看投资判断 | ie-00 | The live call, the four-hour play, the capacity contract it needs and the next action |
| Origins · 系统起点 | ie-01 | A small island that holds its own frequency, linked by DC cables |
| Historical choices · 历史选择 | ie-02–04 | One market for two jurisdictions; DS3 and high wind; fast services that built the first batteries |
| Today's tensions · 当下矛盾 | ie-05–06 | The services line ends at a long-stop; the capacity auction pays, and its contracts are scarce |
| Add a battery · 加入电池 | ie-07–08 | Seconds versus hours; why the play is four hours under duration de-rating |
| Who pays · 谁来付钱 | ie-09–10 | What the capacity contract secures and what it costs; who pays for energy and services |
| The investment · 回到投资 | ie-11–12 | What could weaken the case; where to inspect it on the market page |

Thirteen shots, about five minutes; scroll and chapter links work without animation. Shared fixed-view isometric SVG symbol kit, off-white and deep green, plain HTML copy and accessible 2D equivalents. The island map is schematic; cable routes, landing points and site geography are not asserted. No model execution, dispatch engine or underwriting controls inside the story.

### Rules for every shot

- **Figures:** every page figure, date, tick, tooltip and accessibility value is a named `‹bound: …›` token. Financial tokens resolve to the existing market-card and section fields; historical and auction tokens resolve to the dated evidence records in §11. No literal number or financial sentence is copied from the view's thesis or `play.why`.
- **Controls:** only era, service, teaching battery preset, evidence drawer and hotspot. Preserve navigation, language, selection and evidence state through Back and refresh, as in the WA plan. No control changes the investment case.
- **Evidence:** each shot has one marker using the site's fixed strings (Strong evidence 证据充分 / Fair evidence 证据尚可 / Thin evidence 证据单薄), followed by "What would change it:" / "会改变判断的证据：". The opening inherits the card's marker. Fair is the ceiling for sourced material awaiting the analyst's review; see §10 for why no shot is Strong yet.
- **Time:** observations solid, future dates and plans dashed, teaching values tagged **Example / 示例**. The DS3 long-stop is a decided date and is drawn as a dated marker; the DASSA start has no confirmed date and is drawn as an undated dashed band.
- **Money:** capacity payments (EUR per de-rated MW per year) and energy prices (EUR/MWh) never share an unlabelled axis. A de-rated MW is not a nameplate MW, and every capacity label says which.
- **Secured revenue:** wherever the story mentions it, name its tenor and what follows it (rule 7). A model assumption is never shown as a signed contract.

## 2. Opening

### ie-00 — The call · 先看投资判断

| Item | Shot specification |
| --- | --- |
| Scene | Small schematic island thumbnail beside the existing play card; no animation |
| Feedback | Conclusion readable at once; a text alternative carries the same card fields and copy |
| Evidence and chart | REPO-IE-LIVE, CL-IE-14; current briefing row, published play and investment summary, with the card's own basis labels. No new chart |
| Authoring check | Reuse the card, not `view.thesis` or `play.why`, which hold typed figures. Preserve lens, return basis, stage and tenor. The opening says the play needs a project that already holds a capacity contract; it never implies the reader's project has one<br>The card bridge shows no services line; the engine still folds a small decaying DS3/FASS tail into trading (CF-IE-01). The copy says what the play's action says, "priced without them", and does not claim the model holds zero<br>Existing market play card: **‹bound: call› · ‹bound: play name› · ‹bound: card figures› · ‹bound: next action›**<br>Second link: `#bankable` on the market page |
| Mobile | Full-width card, short paragraph and buttons; no scene before the conclusion |
| Status | `sourced` / `model-assumes-route`; G-1 pending |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What is the call here, and what carries it? | 这里的投资判断是什么，靠什么支撑？ |
| Copy | **‹bound: call› · ‹bound: play name› · ‹bound: card figures› · ‹bound: next action›**. A capacity contract carries this case: it secures part of revenue for ‹bound: secured tenor› years, with merchant exposure after it ends unless a new contract is won. The system services that paid Ireland's first batteries end at a long-stop, so the play prices the project without them. Follow the story from a small island grid to the contract. | **‹bound: call› · ‹bound: play name› · ‹bound: card figures› · ‹bound: next action›**。这项投资靠容量合同支撑：合同在‹bound: secured tenor›年内锁定部分收入；到期后若未赢得新合同，则承担市场风险。曾为爱尔兰首批电池付费的系统服务将在最终截止日结束，因此本方案定价时不计这部分收入。沿着故事，从一个小型岛屿电网看到这份合同。 |
| Marker | The play's own marker, already on the card | 沿用方案卡上该方案自身的证据标记 |
| Controls | Start the story · Go to the investment case | 开始阅读 · 查看投资方案 |

## 3. Origins

### ie-01 — An island that holds its own frequency · 自守频率的岛屿

| Item | Shot specification |
| --- | --- |
| Scene | Fixed schematic of the island with one all-island system boundary across both jurisdictions; DC links to Great Britain drawn as DC; the Celtic link to France dashed as planned. No flow arrows, no cable routes |
| Feedback | EN: "One power system, two jurisdictions"; "Power transfer by DC"; "Planned". ZH: "一个电力系统，两个司法辖区"；"直流输电"；"规划中"。 Boundary stays fixed |
| Evidence and chart | CL-IE-01, CL-IE-12; SRC-IE-01, SRC-IE-03 (introduction, to extract), SRC-IE-19, SRC-IE-20. No interconnector MW on the page until the analyst reviews the list (GAP-IE-LINKS) |
| Authoring check | Do not draw the island as synchronous with Great Britain or Europe. Do not print interconnector counts or capacities from news reports. Celtic is a planned project with an expected year, never drawn as built<br>A small synchronous island must cover both a sudden loss of a large unit and firm evening supply from its own resources; that is why both fast services and capacity have been paid for here |
| Mobile | Same labelled schematic, stacked legend, both toggles; description readable without the map |
| Status | `sourced` for the market boundary; synchronous-island wording `proposed` pending SRC-IE-03 extract; geography and rights review pending |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What kind of grid is this? | 这是一个怎样的电网？ |
| Copy | Ireland and Northern Ireland run one power system on one island. Its links to Great Britain are direct-current cables: they trade power but do not share frequency. When a large plant trips, the island must catch the fall on its own. | 爱尔兰与北爱尔兰在同一座岛上运行同一个电力系统。它与英国之间以直流海缆相连：可以交易电力，但不共享频率。大型机组跳闸时，岛上电网必须自行稳住频率下跌。 |
| Meaning | A small island buys both fast response and firm evening capacity; this play is paid for the second. | 小型岛屿电网既要采购快速响应，也要采购晚高峰的可靠容量；本方案靠后者获得收入。 |
| Marker | Fair evidence. What would change it: the analyst's review of the interconnector list and an operator statement of the synchronous boundary. | 证据尚可。会改变判断的证据：分析师复核互联线路清单，以及运营商对同步区边界的正式表述。 |
| Controls | One system · Trading links | 同一系统 · 交易联系 |
| Labels | One power system, two jurisdictions · Power transfer by DC · Planned · Ireland · Northern Ireland · Great Britain · France | 一个电力系统，两个司法辖区 · 直流输电 · 规划中 · 爱尔兰 · 北爱尔兰 · 英国 · 法国 |

## 4. Historical choices

### ie-02 — One market for two jurisdictions · 两个司法辖区，一个市场

| Item | Shot specification |
| --- | --- |
| Scene | Timeline nodes H-IE-01 and H-IE-03 over the island thumbnail; the two jurisdictions' markets join, then the redesign adds a capacity auction drawn as a separate, forward-dated layer |
| Feedback | EN: "Wholesale market"; "Capacity auction"; "Years ahead of delivery". ZH: "批发市场"；"容量拍卖"；"提前数年采购"。 Node dates read through ‹bound: history node› |
| Evidence and chart | CL-IE-01, CL-IE-09; SRC-IE-01, SRC-IE-02, SRC-IE-16. Constraint, decision, inherited feature and present implication separated in the evidence drawer |
| Authoring check | The SEM start and the I-SEM go-live are events. "Built into the design, not added for batteries" is an interpretation; keep it in Meaning only. Do not state the first capacity auction's date until it is extracted (GAP-IE-CRM)<br>A forward capacity auction was part of the market's design from the 2018 redesign, so the contract this play relies on is a standing feature, subject to redesign (ie-11) |
| Mobile | Vertical dated nodes, text first, small diagram below |
| Status | Events `sourced` (search extract; primary page not opened, see §10); causal reading `proposed` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why does a battery here sell capacity years ahead? | 为什么这里的电池要提前数年出售容量？ |
| Copy | In ‹bound: history node H-IE-01› the two jurisdictions merged their wholesale markets into one all-island market. Its redesign, live from ‹bound: history node H-IE-03›, added a capacity auction that buys firm megawatts years before they are needed. | ‹bound: history node H-IE-01›，两个司法辖区将各自的批发市场合并为一个全岛市场。自‹bound: history node H-IE-03›起实施的新市场设计，增加了容量拍卖，在实际需要之前数年采购可靠容量。 |
| Meaning | The capacity auction this play relies on is part of the market's design, not a scheme added for batteries. | 本方案所依赖的容量拍卖是市场设计的组成部分，并非专为电池设立的机制。 |
| Marker | Fair evidence. What would change it: reviewed locators in the SEM Committee's market-design decisions for the capacity mechanism and its first auction. | 证据尚可。会改变判断的证据：在单一电力市场委员会的市场设计决定中，核实容量机制及其首次拍卖的具体出处。 |
| Controls | Wholesale market · Capacity auction · Open source | 批发市场 · 容量拍卖 · 查看来源 |
| Labels | Wholesale market · Capacity auction · Years ahead of delivery | 批发市场 · 容量拍卖 · 提前数年采购 |

### ie-03 — Running the grid on wind · 让电网靠风电运行

| Item | Shot specification |
| --- | --- |
| Scene | Wind farms, a gas unit and a battery on the island; a stepped SNSP gauge rises node by node (H-IE-02, H-IE-05). As it rises, a "fast reserve needed" layer lights; no invented frequency trace |
| Feedback | EN: "Share of non-synchronous power allowed"; "Fast reserve"; "Inertia". ZH: "允许的非同步电源占比"；"快速备用"；"转动惯量"。 Gauge values ‹bound: SNSP level› with their dates |
| Evidence and chart | CL-IE-02; SRC-IE-03 (programme launch), SRC-IE-04 (SNSP steps). Intermediate steps drawn only where SRC-IE-04 dates them |
| Authoring check | SNSP is an operating limit, not the annual renewable share. The programme start is not the date any service was first paid. Do not claim DS3 alone raised the limit; it combined rule changes, trials and services<br>DS3 paid for capabilities the grid needed to run at high wind. That made fast batteries bankable for a time, under a programme with an end, not a long-term contract |
| Mobile | Gauge as a vertical stepped list with dates; legend stacked |
| Status | `sourced` (search extract); SNSP step dates beyond the target to extract |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why did this grid start paying for speed? | 这个电网为什么开始为"快速"付费？ |
| Copy | To use more of its wind, the operators set out in ‹bound: history node H-IE-02› to let more non-synchronous power run at once. They raised the limit step by step, reaching ‹bound: SNSP level› in ‹bound: history node H-IE-05›. Each step needed fast reserve and stability from other sources; DS3 system services paid for them. | 为了用上更多风电，运营商自‹bound: history node H-IE-02›起逐步提高同时运行的非同步电源占比上限，并于‹bound: history node H-IE-05›达到‹bound: SNSP level›。每提高一步，都需要其他资源提供快速备用和系统稳定支撑；DS3系统服务为此付费。 |
| Meaning | DS3 paid batteries for speed under a programme with an end; this play does not rely on it. | DS3在一个有终点的计划下为电池的快速响应付费；本方案不依赖这部分收入。 |
| Marker | Fair evidence. What would change it: reviewed extracts from the operators' DS3 pages dating each SNSP step. | 证据尚可。会改变判断的证据：经复核的运营商DS3资料，列明每次上调非同步电源占比的日期。 |
| Controls | Raise the limit · Show what it needs | 提高上限 · 显示所需支撑 |
| Labels | Share of non-synchronous power allowed · Fast reserve · Inertia | 允许的非同步电源占比 · 快速备用 · 转动惯量 |

### ie-04 — Fast services built the first fleet · 快速服务带来首批电池

| Item | Shot specification |
| --- | --- |
| Scene | Generic battery station with a service ladder from fastest to slowest; the fixed-term competition (H-IE-04) drawn as a contract card, the regulated tariffs as a separate rate card |
| Feedback | Service selector EN: "FFR"; "POR"; "SOR"; "TOR1"; "TOR2", each with a plain purpose, "Fixed-term contract"; "Regulated tariff". ZH: "FFR"；"POR"；"SOR"；"TOR1"；"TOR2"；"固定期限合同"；"监管费率"。 Award volume ‹bound: VC awarded MW›, winners ‹bound: VC winners› |
| Evidence and chart | CL-IE-03; SRC-IE-05 (outcome note), SRC-IE-06 (five services, same contracted volume). No service response times on the page until extracted from the DS3 protocol (GAP-IE-DS3-TERMS) |
| Authoring check | The competition's contract term is unresolved between sources (six or up to eight years); do not state it. Do not name the winning projects or their owners. Do not imply every later battery held a fixed-term contract; later units were paid tariffs<br>The first batteries were built and sized for seconds-to-minutes services; that design does not answer a capacity auction that credits hours |
| Mobile | Vertical service list with purpose text; contract and tariff cards below |
| Status | `sourced` (search extract); term `conflict` (CF-IE-04) |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What paid for Ireland's first batteries? | 是什么为爱尔兰首批电池付费？ |
| Copy | In ‹bound: history node H-IE-04›, the operators ran a competition for fixed-term contracts to provide five fast reserve services at a capped volume. Every winner was a battery. Batteries that followed were paid the regulated DS3 tariffs. | ‹bound: history node H-IE-04›，运营商就五项快速备用服务举行竞争性采购，以限定总量授予固定期限合同，中标者全部是电池项目。此后建成的电池则按DS3监管费率获得报酬。 |
| Meaning | The first batteries were sized for fast services; this play is sized for the capacity auction instead. | 首批电池按快速服务的需要设计；本方案则按容量拍卖的要求设计。 |
| Marker | Fair evidence. What would change it: the regulators' outcome note read in full, with the contract term and the services' technical terms extracted. | 证据尚可。会改变判断的证据：完整核读监管机构的采购结果说明，并摘录合同期限及各项服务的技术条款。 |
| Controls | FFR · POR · SOR · TOR1 · TOR2 · Contract · Tariff | FFR · POR · SOR · TOR1 · TOR2 · 合同 · 费率 |
| Labels | Fixed-term contract · Regulated tariff | 固定期限合同 · 监管费率 |

## 5. Today's tensions

### ie-05 — The services line ends · 系统服务收入走到尽头

| Item | Shot specification |
| --- | --- |
| Scene | Timeline from H-IE-06 to the long-stop. The tariff line runs solid to a dated marker ‹bound: DS3 long-stop date›; the daily auction (DASSA) is an undated dashed band that may start before it; a "backstop" note sits after it. The battery's services slice fades at the marker |
| Feedback | EN: "Tariffs end: the earlier of the new auction's start or the long-stop"; "No further extension"; "New auction: start date not confirmed"; "Backstop procurement". ZH: "费率终止：以新拍卖启动或最终截止日中较早者为准"；"不再延期"；"新拍卖：启动日期未确定"；"后备采购"。 |
| Evidence and chart | CL-IE-04, CL-IE-05, CL-IE-06; SRC-IE-07 (decision), SRC-IE-08, SRC-IE-09 (programme dates), SRC-IE-10 (DASSA design); REPO-IE-DP for the June 2026 position (CF-IE-02) |
| Authoring check | The long-stop and "no further extension" are SEM Committee decisions (SRC-IE-07). The DASSA start has moved before (SRC-IE-08); the repository's record that the TSOs called the May 2027 target not feasible in June 2026 is not verified from a primary source here (CF-IE-02), so the page says only "not confirmed". Do not say services "end" for good: competitive procurement replaces tariffs<br>Any income from the new auction would be upside to this play, not its underwriting. The regulators describe reserve products as over-procured, which is a reason to expect thin prices for a new entrant |
| Mobile | Vertical timeline; marker and dashed band labelled in text; services slice as a short bar pair (before / after) |
| Status | Long-stop `sourced` (decision paper, search extract); DASSA date `official-plan`, unconfirmed; June 2026 status `blocked` pending source |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why is the services income ending? | 系统服务收入为什么要结束？ |
| Copy | The regulators extended the DS3 tariffs only until a new daily auction starts, or ‹bound: DS3 long-stop date› at the latest, and ruled out any further extension. The new auction's start date is not confirmed. After that, fast services are bought competitively, in a market the regulators already describe as over-procured. | 监管机构将DS3费率延期至新的日前系统服务拍卖启动为止，最迟不超过‹bound: DS3 long-stop date›，并明确不再延期。新拍卖的启动日期尚未确定。此后，快速服务将以竞争方式采购；监管机构已指出，这类备用目前采购过量。 |
| Meaning | The play counts no services income after the long-stop; anything the new auction pays would be upside. | 本方案在最终截止日之后不计系统服务收入；新拍卖带来的任何收入都属于额外收益。 |
| Marker | Fair evidence. What would change it: a published go-live date and first results for the new auction, or a SEM Committee decision changing the long-stop. | 证据尚可。会改变判断的证据：新拍卖公布上线日期及首批结果，或单一电力市场委员会作出变更最终截止日的决定。 |
| Controls | Tariffs · New auction · After the long-stop | 监管费率 · 新拍卖 · 截止日之后 |
| Labels | Tariffs end: the earlier of the new auction's start or the long-stop · No further extension · New auction: start date not confirmed · Backstop procurement | 费率终止：以新拍卖启动或最终截止日中较早者为准 · 不再延期 · 新拍卖：启动日期未确定 · 后备采购 |

### ie-06 — What the capacity auction pays (signature chart) · 容量拍卖付的是什么（核心图表）

| Item | Shot specification |
| --- | --- |
| Scene | **Signature chart Chart-IE-CRM**, full width, with a small island thumbnail. Two stacked panels on one shared delivery-year axis: top, T-4 clearing price (EUR per de-rated MW per year); bottom, battery storage awarded (de-rated MW), new and existing stacked. A vertical dated marker at the end of the capacity year that contains the DS3 long-stop. A side note binds the data-centre share |
| Feedback | EN: "Clearing price · EUR per de-rated MW per year"; "Battery storage awarded · de-rated MW"; "New"; "Existing"; "Provisional"; "DS3 tariffs end by here". ZH: "出清价 · 欧元/折减MW/年"；"中标电池储能 · 折减MW"；"新建"；"既有"；"临时结果"；"DS3费率最迟于此结束"。 Values from ‹bound: CRM auction series›; data centres ‹bound: data-centre share› in ‹bound: data-centre year› |
| Evidence and chart | CL-IE-07, CL-IE-08, CL-IE-11; SRC-IE-11, SRC-IE-12, SRC-IE-13, SRC-IE-18; CALC-IE-CRM; GAP-IE-CRM. Full specification in §11 |
| Authoring check | Every MW is de-rated, labelled as such; nameplate equivalents only where a source gives them (SRC-IE-13). A provisional result is drawn hollow and labelled until the final report is read. Do not join auctions of different types (T-1 and T-4) on one line. The two panels never share a y-axis. Capacity year boundary for the long-stop marker to be checked against the Capacity Market Code<br>The auction pays a high price per credited MW, but awards to new batteries vary sharply between auctions: a contract is scarce, so the play starts from projects that already hold one |
| Mobile | Two panels stacked, data table beneath, keyboard and tap crosshair. If CALC-IE-CRM is not approved, a qualitative two-bar sketch tagged Example / 示例 with no numbers |
| Status | Two auctions' figures identified (one provisional); full series `blocked` pending GAP-IE-CRM. G-1 reviews the chart design; nothing is built |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What does the capacity auction pay, and who wins it? | 容量拍卖付多少钱，谁能中标？ |
| Copy | Each year the auction buys firm megawatts years ahead, to cover demand that keeps rising: data centres alone used ‹bound: data-centre share› of metered electricity in ‹bound: data-centre year›. The chart shows what recent auctions paid per credited megawatt and how much new battery storage won. Awards to new batteries vary widely, so the play starts from projects that already hold a contract. | 容量拍卖每年提前数年采购可靠容量，以满足持续增长的需求：仅数据中心在‹bound: data-centre year›就占计量用电量的‹bound: data-centre share›。图表显示近几轮拍卖对每折减MW的出清价格，以及新建电池储能的中标量。新建电池的中标量波动很大，因此本方案从已持有合同的项目入手。 |
| Meaning | The capacity contract sets the price and is scarce; holding one is the entry ticket for this play. | 容量合同决定价格且十分稀缺；持有合同是进入本方案的前提。 |
| Marker | Fair evidence. What would change it: final results for the latest auction and the analyst's review of the full auction series. | 证据尚可。会改变判断的证据：最新一轮拍卖的最终结果，以及分析师对完整拍卖序列的复核。 |
| Controls | Clearing price · Batteries awarded · Show definitions | 出清价 · 电池中标量 · 查看口径 |
| Labels | Clearing price · EUR per de-rated MW per year · Battery storage awarded · de-rated MW · New · Existing · Provisional · DS3 tariffs end by here | 出清价 · 欧元/折减MW/年 · 中标电池储能 · 折减MW · 新建 · 既有 · 临时结果 · DS3费率最迟于此结束 |
| Caption | Delivery years; de-rated megawatts, not nameplate. Source: SEMO auction results | 按交付年度；折减MW，非铭牌容量。来源：SEMO拍卖结果 |

## 6. Add a battery

### ie-07 — Seconds and hours · 秒级与小时级

| Item | Shot specification |
| --- | --- |
| Scene | One battery, inverter and connection with a qualitative state-of-charge bar. Two teaching cases: a frequency fall (a short power burst, little energy used) and the evening peak (a long discharge from a full battery) |
| Feedback | EN: "Fast response: power for seconds"; "Evening peak: energy for hours"; "Same megawatts, promised once"; "Example". ZH: "快速响应：数秒的功率"；"晚高峰：数小时的电量"；"同一份功率，只能承诺一次"；"示例"。 Starting duration ‹bound: play duration› |
| Evidence and chart | CL-IE-09; SRC-IE-06 for service purposes; SRC-IE-16 for the capacity obligation. Qualitative physics only; no dispatch calculation |
| Authoring check | Nominal hours are not usable energy. Do not claim a battery can hold its full capacity obligation and its full reserve offer at once. No financial effect from controls<br>A four-hour battery can answer both jobs, but the capacity contract needs it charged and available when scarcity comes |
| Mobile | Two static cards (seconds / hours) with the SOC bar; controls below |
| Status | `teaching-example`; `sourced` mechanism |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What does a battery do here? | 电池在这里起什么作用？ |
| Copy | The same battery can answer a frequency fall within seconds, or deliver its stored energy across the evening peak. Fast response uses little energy; the evening needs the battery full. A ‹bound: play duration›-hour battery can do both jobs, but it cannot promise the same megawatts twice. | 同一组电池既能在数秒内响应频率下跌，也能在晚高峰期间持续放出储存的电量。快速响应耗电很少；晚高峰则需要电池充满待命。‹bound: play duration›小时电池两项任务都能承担，但同一份功率不能重复承诺。 |
| Meaning | This play sizes the battery for the evening hours the auction pays for; fast response is not underwritten. | 本方案按容量拍卖所付费的晚高峰时段设计电池；快速响应收入不计入承保。 |
| Marker | Fair evidence. What would change it: the asset's tested usable energy and the capacity contract's availability and performance terms. | 证据尚可。会改变判断的证据：项目经测试的可用电量，以及容量合同中的可用性与履约条款。 |
| Controls | Frequency fall · Evening peak · Reset example | 频率下跌 · 晚高峰 · 重置示例 |
| Labels | Fast response: power for seconds · Evening peak: energy for hours · Same megawatts, promised once · Example | 快速响应：数秒的功率 · 晚高峰：数小时的电量 · 同一份功率，只能承诺一次 · 示例 |

### ie-08 — Why this duration? · 为什么选择这个时长？

| Item | Shot specification |
| --- | --- |
| Scene | The same battery at the teaching presets from ‹bound: duration grid›; a credited-MW bar beside the built-MW bar grows with duration and flattens; a capital layer grows steadily |
| Feedback | EN: "Built megawatts"; "Credited megawatts"; "More capital"; "Example". ZH: "建成功率"；"计入容量"；"更多资本投入"；"示例"。 Factor values only from ‹bound: storage de-rating factor› once extracted; until then the bars are qualitative and tagged Example |
| Evidence and chart | CL-IE-10, CL-IE-14; SRC-IE-14 (Other Storage de-rating curve, Table 3), SRC-IE-15 (method); REPO-IE-LIVE design grid and best duration |
| Authoring check | The model's 4-hour factor is a seed marked "verify auction vintage" in `src/markets/ie/data.js`; never show it as the auction's published factor (GAP-IE-DERATE). The duration result is the model's design-fit sweep, not a rule. A longer battery is a teaching comparison, not a priced alternative<br>Duration is a capital choice: each extra hour earns more credited MW at a falling rate, and the model finds the best balance at the play's duration |
| Mobile | Current-play duration card first, teaching alternative beneath; link to the existing design evidence |
| Status | `sourced` mechanism; factor values `blocked` pending extract; `model-assumption` for the best duration |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why is this play ‹bound: play duration› hours? | 为什么本方案选择‹bound: play duration›小时？ |
| Copy | The auction does not credit a battery's full power. It de-rates storage by how long it can run, so a longer battery earns more credited megawatts for each megawatt built, but each extra hour adds less and costs as much. On today's costs and prices the model finds ‹bound: play duration› hours the best balance. | 容量拍卖不会按电池的全部功率计入容量，而是按其可持续放电的时长折减。时长越长，每MW建成功率可计入的容量越多，但每多一小时的增量递减，成本却不减。按当前成本与价格，模型认为‹bound: play duration›小时最为均衡。 |
| Meaning | The ‹bound: play duration›-hour design follows today's de-rating; a change in the factors would move it. | 本方案的‹bound: play duration›小时设计取决于现行折减规则；折减系数一旦变化，最佳时长也会随之改变。 |
| Marker | Fair evidence. What would change it: the storage de-rating factors in the current auction's final information pack, or a changed duration result. | 证据尚可。会改变判断的证据：本轮拍卖最终信息包中的储能折减系数，或时长测算结果发生变化。 |
| Controls | Current play · Shorter teaching battery · Longer teaching battery · Open duration evidence | 当前方案 · 更短时长示例 · 更长时长示例 · 查看时长依据 |
| Labels | Built megawatts · Credited megawatts · More capital · Example | 建成功率 · 计入容量 · 更多资本投入 · 示例 |

## 7. Who pays

### ie-09 — What the contract secures · 合同锁定了什么

| Item | Shot specification |
| --- | --- |
| Scene | Qualitative revenue band: a capacity floor across ‹bound: secured tenor› years, merchant tail afterwards; a strike line with a scarcity spike above it, the difference flowing back. Contract evidence beside the band |
| Feedback | EN: "Capacity payment"; "Strike price"; "Difference paid back"; "Merchant after expiry"; "Project contract not verified". ZH: "容量付款"；"执行价"；"超额部分返还"；"到期后承担市场风险"；"项目合同尚未核验"。 Tenor and share only from bound fields |
| Evidence and chart | CL-IE-09, CL-IE-14; SRC-IE-16 (reliability option and term), SRC-IE-17 (strike description); REPO-IE-LIVE card share and tenor; Bankable case contract-evidence field |
| Authoring check | Bind the share to the card's `row.investment.secured`, never `play.econ.secured` or the acquisition reference's share, which use other denominators (CF-IE-03). Do not call the model's contract "awarded" or "signed". The contract pays for availability, not energy. Difference payments apply in scarcity; their size is not modelled on this page<br>The analyst counts an awarded capacity payment as secured revenue for its term. Its value still depends on delivering on time, staying available in scarcity and the contract's termination terms |
| Mobile | Two stacked panels: during the contract / after expiry; the strike example below; evidence adjacent, not in a hover |
| Status | `sourced` mechanism; `model-assumes-route`; project contract `eligibility-unverified` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What does the capacity contract secure, and until when? | 容量合同锁定了什么，锁定到什么时候？ |
| Copy | A new project that wins can fix its capacity payment for up to ‹bound: RO max years› years. In return it sells a reliability option: when market prices rise above a strike price, it pays the difference back on its credited megawatts, so it must be charged and available when prices spike. The contract pays for being there; energy is sold separately. | 新建项目中标后，最长可将容量付款锁定‹bound: RO max years›年。作为交换，它出售一份可靠性期权：当市场价格高于执行价时，须按计入容量返还差价，因此价格飙升时电池必须充满并可用。合同付费的是"随时可用"，电量另行出售。 |
| Meaning | The capacity payment secures ‹bound: secured share› of first-year revenue for ‹bound: secured tenor› years; after that, revenue is merchant unless a new contract is won. | 容量付款在‹bound: secured tenor›年内锁定首年收入的‹bound: secured share›；此后若未赢得新合同，收入将承担市场风险。 |
| Marker | Fair evidence. What would change it: the project's signed capacity agreement, its de-rated quantity and its delivery milestones. | 证据尚可。会改变判断的证据：项目已签署的容量协议、其折减容量及交付里程碑。 |
| Controls | During the contract · Scarcity example · After expiry · Contract evidence | 合同期内 · 稀缺时段示例 · 到期以后 · 合同证据 |
| Labels | Capacity payment · Strike price · Difference paid back · Merchant after expiry · Project contract not verified | 容量付款 · 执行价 · 超额部分返还 · 到期后承担市场风险 · 项目合同尚未核验 |

### ie-10 — Who pays for what · 谁为何种服务付钱

| Item | Shot specification |
| --- | --- |
| Scene | Three separate 2D paths: capacity (suppliers → market operator → owner); energy (day-ahead, intraday and balancing counterparties ↔ owner); system services (grid operators → owner, tariff path ending at the long-stop marker, auction path dashed). The services path is greyed in the play view |
| Feedback | EN: "Capacity · EUR per de-rated MW per year"; "Energy · EUR/MWh"; "System services: not counted in this play". ZH: "容量 · 欧元/折减MW/年"；"电量 · 欧元/MWh"；"系统服务：本方案不计入"。 Selected path shows its obligation and settlement steps |
| Evidence and chart | CL-IE-04, CL-IE-09; SRC-IE-07, SRC-IE-16 (settlement, to extract); `ie-day-ahead` dataset for the energy path's existing chart; model revenue detail stays in `#revenue` |
| Authoring check | Capacity is funded by suppliers through the market operator's capacity charge; confirm the locator before publishing the payer wording (GAP-IE-SETTLE). Energy and capacity units never share an axis. Do not say the model carries zero services: the card bridge shows none, the engine keeps a small tail inside trading (CF-IE-01)<br>The case rests on capacity and wholesale income; a modelled contract is not a signed one |
| Mobile | Select a path; vertical payer, obligation and settlement steps; units visible |
| Status | `sourced` mechanism; settlement locator pending; `model-assumes-route` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Who pays the battery, and for what? | 谁向电池付钱，为什么付？ |
| Copy | Three buyers. Suppliers fund capacity payments through the market operator. Energy is sold in the day-ahead, intraday and balancing markets. System services are paid by the grid operators, on tariffs until the long-stop and by auction after. The play is priced on the first two. | 共有三类买方。售电商通过市场运营商为容量付款出资；电量在日前、日内和平衡市场出售；系统服务由电网运营商付费，最终截止日前按费率支付，此后通过拍卖采购。本方案仅按前两项定价。 |
| Meaning | The case rests on capacity and wholesale income, and the capacity line is modelled until the project's contract is verified. | 投资逻辑建立在容量与批发收入之上；在项目合同核实之前，容量收入仍是模型假设。 |
| Marker | Fair evidence. What would change it: verified settlement terms for the project, and the new auction's rules and first results. | 证据尚可。会改变判断的证据：核实项目的结算条款，以及新拍卖的规则与首批结果。 |
| Controls | Capacity · Energy · System services | 容量 · 电量 · 系统服务 |
| Labels | Capacity · EUR per de-rated MW per year · Energy · EUR/MWh · System services: not counted in this play | 容量 · 欧元/折减MW/年 · 电量 · 欧元/MWh · 系统服务：本方案不计入 |

## 8. The investment

### ie-11 — What could weaken it · 什么会削弱投资逻辑

| Item | Shot specification |
| --- | --- |
| Scene | Calm overview with factor cards; the auction redesign and the Celtic link dashed as future; no model simulation |
| Feedback | Factors open §9's short text and the matching section: redesign and de-rating → `#bankable`; competition for the evening → `#revenue`; delivery against the contract date → `#execution`; scarcity payback and expiry → `#downside`. No slider or probability |
| Evidence and chart | CL-IE-10, CL-IE-12, CL-IE-13; SRC-IE-17 (consultation), SRC-IE-14, SRC-IE-20; current Downside and Execution fields from REPO-IE-LIVE |
| Authoring check | The redesign is a consultation, not a decision; do not describe its options as adopted. Celtic has an expected year, not a commissioning date. The new services auction is an upside, never listed as a weakness of an unpriced line<br>The investment action is to verify the contract a project holds and its delivery date at the offered price; system need does not protect an owner's return |
| Mobile | Factor cards, each with its section link; all four destinations visible at the end |
| Status | `sourced`, future design `official-plan` (consultation); G-1 pending |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What would make this play less attractive? | 什么变化会让本方案失去吸引力？ |
| Copy | Four things could weaken the case: a redesign of the capacity auction, now under consultation; less credit for storage of this duration; more batteries and new interconnection competing for the evening; and a delay that puts the contract at risk. Check the project's contract and delivery date before pricing. Then ‹bound: next action›. | 有四类变化可能削弱投资逻辑：容量拍卖机制改革（目前正在征询意见）；该时长储能可计入的容量下降；更多电池和新增互联线路争夺晚高峰；以及工程延误危及容量合同。定价前，先核实项目合同与交付日期。随后：‹bound: next action›。 |
| Meaning | The entry price must work on the contract the project holds, its delivery date and the downside. | 进入价格须与项目所持合同、交付日期及下行情景相匹配。 |
| Marker | Fair evidence. What would change it: the SEM Committee's decision on the redesign, the next auction's de-rating factors, or the project's signed agreement and milestones. | 证据尚可。会改变判断的证据：单一电力市场委员会就机制改革作出的决定、下一轮拍卖的折减系数，或项目已签协议及里程碑。 |
| Controls | Auction redesign · Less credit · More competition · Delivery delay | 拍卖改革 · 计入容量下降 · 竞争加剧 · 交付延误 |

### ie-12 — Into the case · 进入投资方案

| Item | Shot specification |
| --- | --- |
| Scene | The island thumbnail settles beside four section links; no new figures |
| Feedback | Links: "Bankable case / 可融资方案" → `#bankable`; "Revenue / 收益拆解" → `#revenue`; "Execution / 执行步骤" → `#execution`; "Downside / 下行风险" → `#downside` |
| Evidence and chart | REPO-IE-LIVE; existing market-page sections only |
| Authoring check | No second financial view. If the call, play or lens differs at implementation, flag the story through `reviewedAgainst` instead of showing it beside another play |
| Mobile | Four full-width links |
| Status | Uses existing sections; G-1 pending. Stop at the market page |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Where do I check the numbers? | 在哪里核对具体数字？ |
| Copy | The story stops here. The market page shows the bankable case, the revenue split, the execution steps and the downside for the same play. | 故事到此结束。市场页面针对同一方案，列出可融资方案、收益拆解、执行步骤和下行风险。 |
| Meaning | Every figure in those sections comes from the same model result as the card. | 这些部分的每个数字都与方案卡来自同一模型结果。 |
| Marker | Fair evidence. What would change it: a changed call, play or model result in the briefing. | 证据尚可。会改变判断的证据：简报中的投资判断、方案或模型结果发生变化。 |
| Controls | Bankable case · Revenue · Execution · Downside | 可融资方案 · 收益拆解 · 执行步骤 · 下行风险 |

## 9. Copy, evidence and binding registers

### Financial bindings that already exist

Authoring references, not a new adapter. `row` is the selected-lens Ireland row the market page uses, after the investment-summary projection (`src/experience/model.js`).

| Token | Existing owner / exact field and display convention | Uses |
| --- | --- | --- |
| ‹bound: call› | `CALLS[row.call]` in `src/experience/model.js`; `build-position` renders Build position / 提前布局 | ie-00 |
| ‹bound: play name› | `playTitle(row.play, row.stage)`, as in `src/experience/pages.js` | ie-00 |
| ‹bound: card figures› | The card's existing fields: `row.investment.holdIRR`, `row.investment.secured`, `row.investment.securedYears` and their basis labels; same formats as the card | ie-00 |
| ‹bound: next action› | `row.play.action.text`, bilingual | ie-00, ie-11 |
| ‹bound: play evidence› | Briefing row `evidence` (`strong` at check) through the existing labels; one marker | ie-00 |
| ‹bound: play duration› | `row.play.hours`; fallback `market.comparison.archetype.durationHours`; if neither, hide the sentence and queue review | ie-07, ie-08 |
| ‹bound: duration grid› | Briefing `grids.ie.hours` and cells, only to name teaching presets | ie-08 |
| ‹bound: secured share› | **`row.investment.secured`**, same denominator and `share()` format as the card. Not `play.econ.secured` and not the acquisition reference's `securedRevenueShare` (CF-IE-03) | ie-09 |
| ‹bound: secured tenor› | `row.investment.securedYears` | ie-00, ie-09 |

### Evidence bindings proposed for later implementation

Explicit references to the dated records in §11, **not existing runtime fields**. Missing values hide the numeric label; they never become zero.

| Token | Source record / field | Units / limit |
| --- | --- | --- |
| ‹bound: history node H-IE-nn› | H-IE-01 to H-IE-06, event date and label | Event date, not publication date |
| ‹bound: SNSP level› | SRC-IE-04, the level reached at H-IE-05 | Percent; an operating limit |
| ‹bound: VC awarded MW› / ‹bound: VC winners› | SRC-IE-05 total contracted volume / number of successful units | MW; count |
| ‹bound: DS3 long-stop date› | SRC-IE-07 long-stop date | Locale date |
| ‹bound: CRM auction series› | CALC-IE-CRM rows: delivery year, auction type, status, clearing price, battery storage awarded new / existing (de-rated MW) | EUR per de-rated MW per year; de-rated MW |
| ‹bound: data-centre share› / ‹bound: data-centre year› | SRC-IE-18 latest annual share and its year | Percent of metered consumption, CSO estimate |
| ‹bound: storage de-rating factor› | SRC-IE-14 Table 3 (or the final pack once read), by duration | Factor; auction vintage named |
| ‹bound: RO max years› | SRC-IE-16 maximum reliability-option term for new capacity | Years |
| ‹bound: source checked date› | Selected record's check date | Locale date |

### Remaining visible text EN / 简体中文

| Context | English | 简体中文 |
| --- | --- | --- |
| Common navigation | Previous; Next; Chapters; Open evidence; Close evidence; Back to market | 上一节；下一节；章节；查看证据；关闭证据；返回市场 |
| Evidence drawer | Source; Locator; Checked on ‹bound: source checked date›; Definition | 来源；具体位置；核查时间：‹bound: source checked date›；统计口径 |
| Marker line | What would change it: | 会改变判断的证据： |
| Diagram / history legend | Schematic; Observed event; Decided date; Announced plan; Example | 示意；已发生事件；已定日期；已公布计划；示例 |
| H-IE-01 | ‹bound: history node H-IE-01›: the all-island Single Electricity Market goes live | ‹bound: history node H-IE-01›：全岛单一电力市场上线 |
| H-IE-02 | ‹bound: history node H-IE-02›: the operators start the DS3 programme | ‹bound: history node H-IE-02›：运营商启动DS3计划 |
| H-IE-03 | ‹bound: history node H-IE-03›: the redesigned market goes live, with capacity auctions | ‹bound: history node H-IE-03›：新市场设计上线，引入容量拍卖 |
| H-IE-04 | ‹bound: history node H-IE-04›: fixed-term fast-services contracts awarded; all winners are batteries | ‹bound: history node H-IE-04›：授予快速服务固定期限合同，中标者均为电池 |
| H-IE-05 | ‹bound: history node H-IE-05›: the non-synchronous limit reaches ‹bound: SNSP level› | ‹bound: history node H-IE-05›：非同步电源占比上限达到‹bound: SNSP level› |
| H-IE-06 | ‹bound: history node H-IE-06›: regulators set the DS3 long-stop and rule out further extension | ‹bound: history node H-IE-06›：监管机构设定DS3最终截止日，并明确不再延期 |
| Future: long-stop | DS3 tariffs end by ‹bound: DS3 long-stop date› | DS3费率最迟于‹bound: DS3 long-stop date›结束 |
| Future: new auction | Daily services auction: start date not confirmed | 日前系统服务拍卖：启动日期未确定 |
| Future: Celtic | Celtic link to France: planned | 通往法国的Celtic互联线：规划中 |
| Signature chart axes | Delivery year; Clearing price · EUR per de-rated MW per year; Battery storage awarded · de-rated MW | 交付年度；出清价 · 欧元/折减MW/年；中标电池储能 · 折减MW |
| Signature chart definition | De-rated megawatts count what the auction credits, not what is built | 折减MW是拍卖计入的容量，并非建成容量 |
| Signature chart accessible summary | T-4 auction results by delivery year: clearing price and battery storage awarded, new and existing. Provisional results are marked | 按交付年度列示T-4拍卖结果：出清价及新建、既有电池储能中标量。临时结果已标注 |
| Battery / station | Battery modules; Inverter; Transformer; Controls; Connection; Usable energy; Charge; Discharge | 电池模块；逆变器；变压器；控制系统；并网接入；可用电量；充电；放电 |
| Redesign factor | A new auction design could change contract length, credit or price for new storage | 新的拍卖设计可能改变新建储能的合同期限、计入容量或价格 |
| De-rating factor | Less credit per megawatt built means less capacity income for the same battery | 每MW建成功率可计入的容量减少，同一电池的容量收入随之下降 |
| Competition factor | More batteries and interconnection can narrow evening prices and the trading line | 更多电池和互联线路可能压低晚高峰价格及交易收入 |
| Delivery factor | A project that misses its delivery date can lose or forfeit its contract | 未能按期交付的项目可能失去合同 |
| Loading / retry | Loading source data…; Could not load data; Retry; Auction history not yet available | 正在载入来源数据…；数据未能载入；重试；拍卖历史暂不可用 |
| Missing financial binding | Current case unavailable; review the market case | 当前情景暂不可用；请查看市场方案 |
| Reduced motion / text alternative | Read the explanation; the selected state is shown without animation | 阅读文字说明；当前选择直接显示，无需动画 |

### Source-to-shot mapping

| Shot | Claims → sources | Chart / binding owner | Misreading prevented |
| --- | --- | --- | --- |
| ie-00 | CL-IE-14 → REPO-IE-LIVE | Existing market card | Thesis figures read as live; a modelled contract read as held |
| ie-01 | CL-IE-01, CL-IE-12 → SRC-IE-01/03/19/20 | Own schematic | The island shares frequency with Great Britain; planned link drawn as built |
| ie-02 | CL-IE-01, CL-IE-09 → SRC-IE-01/02/16 | H-IE-01, H-IE-03 | Capacity auction seen as a battery subsidy |
| ie-03 | CL-IE-02 → SRC-IE-03/04 | H-IE-02, H-IE-05 | SNSP read as the renewable share; DS3 read as a permanent contract |
| ie-04 | CL-IE-03 → SRC-IE-05/06 | H-IE-04 | Every battery held a fixed contract; fast sizing fits the capacity auction |
| ie-05 | CL-IE-04/05/06 → SRC-IE-07/08/09/10; REPO-IE-DP | Long-stop marker | Services end for good; an unconfirmed date shown as set |
| ie-06 | CL-IE-07/08/11 → SRC-IE-11/12/13/18 | Chart-IE-CRM from CALC-IE-CRM | De-rated MW read as nameplate; provisional read as final; a contract assumed easy to win |
| ie-07 | CL-IE-09 → SRC-IE-06/16 | Teaching state; play duration | One battery promises both jobs in full |
| ie-08 | CL-IE-10, CL-IE-14 → SRC-IE-14/15; REPO-IE-LIVE | Design grid; de-rating extract | The seed factor read as the auction's; four hours read as a rule |
| ie-09 | CL-IE-09, CL-IE-14 → SRC-IE-16/17; REPO-IE-LIVE | Card share and tenor | The contract pays for energy; secured share read on another denominator |
| ie-10 | CL-IE-04, CL-IE-09 → SRC-IE-07/16 | Existing Revenue section | Services counted in the play; payers confused |
| ie-11 | CL-IE-10/12/13 → SRC-IE-14/17/20 | Existing Downside and Execution | Consultation read as decided; services auction read as a weakness |
| ie-12 | REPO-IE-LIVE | Existing sections | A second financial view in the story |

Reverse mapping: each SRC-IE record in §11 lists the claims it supports; each claim lists its shots. A replaced source queues a finite set of shots, translations and labels for review.

## 10. G-1 record

**How the research was done.** Sources were found by web search on 31 October 2026. The session's network policy blocked direct fetches from semcommittee.com, sem-o.com and eirgridgroup.com, so most primary documents were read through search-result extracts of their own text, not opened in full. Each record in §11 says which. That is why every shot is Fair at most: the mechanism is sourced, but no locator has been read in full and none has the analyst's review. Opening the documents (or allowing those domains) is the first step towards Strong.

**Does the research contradict the call?** No. It supports the argument and sharpens two points the analyst should see: (1) new batteries won little in the latest T-4 auction (provisional), which makes a held contract the scarce asset and supports the play's "shortlist projects holding a capacity contract"; (2) the repository's June 2026 "May 2027 not feasible" record could not be traced to a public primary source in this session (CF-IE-02). Neither changes the call.

| Analyst pass | Decision required |
| --- | --- |
| Electricity mechanics | Accept the island-boundary wording (ie-01); the DS3 history and SNSP framing (ie-03, ie-04); the long-stop wording "earlier of the new auction or the long-stop, no further extension" with the DASSA date shown as unconfirmed (ie-05); seconds-versus-hours teaching (ie-07); reliability-option wording (ie-09); payer wording pending GAP-IE-SETTLE (ie-10) |
| Investment meaning | Accept the anchor on `ie-cap-4h` / Build position; "priced without services" while the engine keeps a small decaying services tail inside trading (CF-IE-01); the secured-share binding to the card's denominator (CF-IE-03); the signature chart and its fixed-vintage, analyst-entered data (GAP-IE-CRM); scarcity of new battery awards as the reason to buy a contracted project |
| English / Chinese | Confirm equal meaning of long-stop, reliability option, strike price, de-rated and credited megawatts, and "priced without" |
| G-1 | **Pending. Analyst: sign off ie-00 to ie-12, the markers and the open points in the PR, or identify changes.** |
| Build boundary | Stop here. No code, dataset registration, snapshot, model change, rendering, build, deployment or G-2 work |

Checks for this draft: thirteen shots, each with the six specification rows and the Question / Copy / Meaning / Marker / Controls rows in both languages (`ie-00` has no Meaning, as the conclusion); one marker per shot in the fixed wording; page copy carries no figure outside a `‹bound›` token; every token has a register entry. The marker list (`local-data/markers.json`) is not on this machine, so the confidentiality scan could not run here; no project, developer or deal is named, and no company appears except public infrastructure already named in tracked market files. No tests, build or baseline regeneration were run, and no code, data or fixtures changed.

## 11. Sources and claims

New records for this market only. A later PR folds them into `source-register.md`. Check date for every record: **31 October 2026**. "Read via search extract" means the document's own text was seen in search results; the full document was not opened because the host was blocked.

### Repository evidence

| ID | Record | Locator | Use |
| --- | --- | --- | --- |
| REPO-IE-LIVE | Published view and live briefing row | `view/markets/ie.json` (`verdicts.infraFund`, `plays.ie-cap-4h`, `triggers`); briefing built 2026-10-31 from `main` at `edcb39c`: call `build-position`, tier `prepare`, play `ie-cap-4h`, evidence `strong`, `next` `ie-ds3-long-stop` | ie-00, ie-08, ie-09, ie-12 |
| REPO-IE-CMP | Comparison economics | `src/markets/ie/comparison.js`: capacity line from the 2029/30 T-4 price at a seeded 4-hour de-rating; `services` seed with `servicesCurve` `DS3_TO_FASS` | CF-IE-01, GAP-IE-DERATE |
| REPO-IE-DP | Decision profile | `src/markets/decisionProfiles.js`, `ie.consensus` and `ie.currentUpdate`: June 2026 TSO statement that May 2027 DASSA go-live is not feasible | CF-IE-02 |
| REPO-IE-SUM | Investment summary | `src/opportunities/summaryData.js` → `OPPORTUNITY_SUMMARY.infraFund.markets.ie`: `secured`, `securedYears`, `bridge.service` (zero) | CF-IE-01, CF-IE-03 |

### External sources

| ID | Publisher and title | Locator / URL | How read | Supports |
| --- | --- | --- | --- | --- |
| SRC-IE-01 | SEM Committee, "The SEM" | https://www.semcommittee.com/sem — opening paragraphs | Search extract | CL-IE-01 |
| SRC-IE-02 | SEM Committee, "SEM arrangements (2007–2018)" | https://www.semcommittee.com/node/2844 | Search listing only | CL-IE-01 |
| SRC-IE-03 | EirGrid and SONI, DS3 Programme Overview 2011 | https://cms.eirgrid.ie/sites/default/files/publications/DS3-Programme-Overview-2011.pdf — introduction | Search extract | CL-IE-02; island wording to extract (CL-IE-01) |
| SRC-IE-04 | EirGrid Group, "DS3 Programme" | https://www.eirgridgroup.com/how-the-grid-works/ds3-programme/ — SNSP history | Search extract | CL-IE-02 |
| SRC-IE-05 | SEM Committee, SEM-19-062 System Services Fixed Contracts Procurement Outcomes – Information note | https://www.semcommittee.com/files/semcommittee/media-files/SEM-19-062%20-%20System%20Services%20Fixed%20Contracts%20Procurement%20Outcomes%20-%20Information%20note.pdf | Search extract | CL-IE-03 |
| SRC-IE-06 | EirGrid and SONI, DS3 System Services Recommendations Paper (volume-capped) | https://cms.eirgrid.ie/sites/default/files/publications/DS3-System-Services-Recommendations-Paper-website.pdf | Search extract | CL-IE-03, ie-07 |
| SRC-IE-07 | SEM Committee, SEM-25-031 System Services Regulated Arrangements to FASS – "The Gap" – Decision Paper (June 2025) | https://www.semcommittee.com/files/semcommittee/2025-06/SEM-25-031%20System%20Services%20Regulated%20Arrangements%20to%20FASS%20-%20The%20Gap%20-%20Decision%20Paper.pdf — decision section | Search extract | CL-IE-04, CL-IE-06 |
| SRC-IE-08 | EirGrid and SONI, FASS Programme Phased Implementation Roadmap V3.0 (June 2025) | https://cms.soni.ltd.uk/sites/default/files/publications/FASS-TSOs-PIR-June%202025-SONI.pdf | Search extract | CL-IE-05 |
| SRC-IE-09 | Future Power Markets Design Authority Update, Issues 26 (Nov 2025) and 27 (Dec 2025) | https://www.eirgrid.ie/sites/default/files/publications/Future_Power_Markets_Design_Authority_Newsletter-Issue_26-November_2025.pdf ; https://cms.soni.ltd.uk/sites/default/files/publications/Future%20Power%20Markets%20Design%20Authority%20Newsletter%20-%20Issue%2027-%20December%202025.pdf | Search extract | CL-IE-05 |
| SRC-IE-10 | SEM Committee, SEM-24-066 FASS DASSA Design Decision Paper | https://www.semcommittee.com/files/semcommittee/2024-09/SEM-24-066%20-%20SEMC%20FASS%20DASSA%20Design%20Decision%20Paper.pdf | Search listing only | CL-IE-05 |
| SRC-IE-11 | SEMO, Provisional Capacity Auction Results PCAR2930T-4 (14 April 2026) | https://www.sem-o.com/sites/semo/files/2026-04/PCAR2930T-4%20report.pdf — clearing price; results by technology | Search extract | CL-IE-08 |
| SRC-IE-12 | SEMO, Final Capacity Auction Results FCAR2829T-4 | https://www.sem-o.com/sites/semo/files/documents/general-publications/20282029-T-4-Final-Capacity-Auction-Results-Report-FCAR2829T-4.pdf — clearing price; results by technology | Search extract | CL-IE-07 |
| SRC-IE-13 | SEM Committee, SEM-25-019 2028/29 T-4 Volumes Information Paper | https://www.semcommittee.com/files/semcommittee/2025-06/2028%2029%20T-4%20Volumes%20Information%20Paper%20SEM-25-019%20for%20publication.pdf | Search extract | CL-IE-07 |
| SRC-IE-14 | SEMO, Initial Auction Information Pack IAIP2930T-4 | https://www.sem-o.com/sites/semo/files/2025-08/IAIP2930T-4.pdf — Table 3, Other Storage de-rating curve | Search extract; values not seen | CL-IE-10 |
| SRC-IE-15 | SEM Committee, SEM-16-082 CRM Capacity Requirement and De-rating Methodology Decision | https://www.semcommittee.com/files/semcommittee/media-files/SEM-16-082%20CRM%20Capacity%20Requirement%20%20De-rating%20Methodology%20Decision%20Paper.pdf | Search extract | CL-IE-10 |
| SRC-IE-16 | SEM Committee, SEM-16-073 CRM Parameters Consultation; SEMO, Capacity Market Settlement training (2017) | https://www.semcommittee.com/files/semcommittee/media-files/SEM-16-073%20CRM%20Parameters%20Consultation%20.pdf ; https://www.sem-o.com/sites/semo/files/documents/training/Capacity-Market-Settlement.pdf | Search extract | CL-IE-09 |
| SRC-IE-17 | SEM Committee, SEM-26-037 High-level design options for CRM 2.0, consultation (July 2026) | https://www.semcommittee.com/files/semcommittee/2026-07/sem-26-037-consultation-crm-design-options_v200.pdf | Search extract | CL-IE-09 (strike), CL-IE-13 |
| SRC-IE-18 | CSO, Data Centres Metered Electricity Consumption 2024 and 2025, key findings | https://www.cso.ie/en/releasesandpublications/ep/p-dcmec/datacentresmeteredelectricityconsumption2025/keyfindings/ | Search extract | CL-IE-11 |
| SRC-IE-19 | Department of Climate, Energy and the Environment, press release on the Greenlink interconnector | https://www.gov.ie/en/department-of-climate-energy-and-the-environment/press-releases/minister-obrien-welcomes-new-electricity-interconnector-as-it-begins-powering-irelands-and-the-uks-energy-grids | Search listing only | CL-IE-12 |
| SRC-IE-20 | EirGrid, Celtic Interconnector programme (`celtic` in `src/markets/ie/sources.js`) | https://www.eirgrid.ie/celticinterconnector | Repository record | CL-IE-12 |

Licence-restricted reports are not sources here. The commercial analysis cited in `comparison.js` comments is not used.

### Historical nodes

| ID | Event | Date or period | Source | Interpretation (separate) |
| --- | --- | --- | --- | --- |
| H-IE-01 | All-island Single Electricity Market goes live | 1 November 2007 | SRC-IE-01 | One market for two jurisdictions |
| H-IE-02 | EirGrid and SONI establish the DS3 programme | 2011 | SRC-IE-03 | High wind needs paid system capability |
| H-IE-03 | Revised market arrangements (I-SEM) go live, including the capacity mechanism | 1 October 2018 | SRC-IE-01 | Capacity bought years ahead becomes standing design |
| H-IE-04 | Volume-capped fixed-term DS3 contracts awarded; all successful units are batteries | 2019 (award notice dated 1 October 2019; date to confirm in SRC-IE-05) | SRC-IE-05 | Fast services built the first fleet |
| H-IE-05 | SNSP limit reaches 75% | March 2022 | SRC-IE-04 | The DS3 goal is met |
| H-IE-06 | SEM-25-031: tariffs to the earlier of DASSA go-live or the long-stop; no further extension | June 2025 | SRC-IE-07 | Services income gets an end date |

Future (dashed): DS3 long-stop 30 September 2027 (SRC-IE-07); DASSA go-live, no confirmed date (SRC-IE-08/09, CF-IE-02); Celtic interconnector, expected year per SRC-IE-20.

### Claim ledger

| ID | Claim | Type / scope | Source and locator | Limit | Shots | Status |
| --- | --- | --- | --- | --- | --- | --- |
| CL-IE-01 | Ireland and Northern Ireland trade wholesale power in one all-island market, live since 1 November 2007; the island's links to Great Britain are DC | `historical-fact`, `market-rule` | SRC-IE-01; SRC-IE-03 for the island/DC wording | The synchronous-island wording needs an operator extract | ie-01, ie-02 | `sourced` (event); wording `proposed` |
| CL-IE-02 | DS3 was established in 2011 to integrate renewables; the SNSP limit rose from 50% in trials to 75% in March 2022 | `historical-fact` | SRC-IE-03 opening; SRC-IE-04 SNSP history | Intermediate step dates not extracted | ie-03 | `sourced` |
| CL-IE-03 | The 2019 volume-capped competition awarded 110 MW to three successful providers, all battery storage, each to provide FFR, POR, SOR, TOR1 and TOR2 at the same contracted volume; later units were paid regulated tariffs | `historical-fact` | SRC-IE-05; SRC-IE-06 | Contract term conflicts (CF-IE-04); uncapped-tariff locator to extract | ie-04 | `sourced` |
| CL-IE-04 | Regulated arrangements for all system services continue until the earlier of DASSA go-live or 30 September 2027; no further tariff extension; the TSOs must have a backstop from 1 October 2027 | `market-rule` | SRC-IE-07, decision section | A later SEMC decision could change it | ie-05, ie-10 | `sourced` |
| CL-IE-05 | DASSA go-live has moved: December 2026 was declared no longer viable in PIR V3.0, which set May 2027; PIR V4.0 was still pending in December 2025 | `official-plan` | SRC-IE-08; SRC-IE-09 | No 2026 primary source for the current date was reached (CF-IE-02) | ie-05 | `sourced` to Dec 2025 |
| CL-IE-06 | The SEM Committee cited ongoing over-procurement of reserve products in its decision | `market-observation` | SRC-IE-07 | Product-level volumes not extracted | ie-05 | `sourced` |
| CL-IE-07 | The 2028/29 T-4 auction cleared at €149,960 per MW per year; new battery storage won 132.462 de-rated MW, which SEMC equates to 627 MW rated, all of at least two hours | `observed-data` | SRC-IE-12 results by technology; SRC-IE-13 | De-rated MW | ie-06 | `sourced` |
| CL-IE-08 | The 2029/30 T-4 auction (provisional, 14 April 2026) cleared at €135,499.99 per MW per year; battery storage won 38.752 de-rated MW, of which 25.594 new | `observed-data` | SRC-IE-11 | Provisional; final report not read (GAP-IE-CRM) | ie-06 | `sourced`, provisional |
| CL-IE-09 | New capacity can fix its reliability option for up to ten years; holders pay back the difference between the market price and the strike price; the strike sits near the estimated highest marginal cost of a unit | `market-rule` | SRC-IE-16; SRC-IE-17 | Current Capacity Market Code clauses not read; payer chain to extract (GAP-IE-SETTLE) | ie-02, ie-07, ie-09, ie-10 | `sourced` (original design) |
| CL-IE-10 | Storage is de-rated by duration on a separate "Other Storage" curve derived from the existing pumped-storage reference | `market-rule` | SRC-IE-14 Table 3; SRC-IE-15 | Factor values not seen; model's 4-hour factor is a seed (GAP-IE-DERATE) | ie-08, ie-11 | `sourced` mechanism |
| CL-IE-11 | Data centres used about 22% of metered electricity in 2024 and 23% in 2025 (CSO estimates) | `observed-data` | SRC-IE-18 key findings | CSO identifies data centres by method, not a category | ie-06 | `sourced` |
| CL-IE-12 | Greenlink entered commercial operation in 2025; Celtic is planned | `historical-fact`, `official-plan` | SRC-IE-19; SRC-IE-20 | Commercial-operation date differs between reports; capacities withheld (GAP-IE-LINKS) | ie-01, ie-11 | `sourced` (event) |
| CL-IE-13 | The SEM Committee is consulting on a redesign of the capacity mechanism ("CRM 2.0"), including how batteries fit a new auction structure | `official-plan` | SRC-IE-17 | Consultation, not a decision | ie-11 | `sourced` |
| CL-IE-14 | The fund's call is Build position on `ie-cap-4h`, ready-to-build, four hours, priced on capacity and wholesale with no services line after the long-stop | `model-assumption` | REPO-IE-LIVE | Engine keeps a services tail (CF-IE-01) | ie-00, ie-08, ie-09 | `sourced` |

### Signature chart: Chart-IE-CRM and CALC-IE-CRM

| Field | Entry |
| --- | --- |
| Question | What does the capacity auction pay per credited MW, and how much new battery storage wins it? |
| Inputs | One row per T-4 auction: delivery year, auction ID, status (final or provisional), clearing price (EUR per MW per year), battery storage successful MW new and existing (de-rated), report URL and page. Seeded from SRC-IE-11 and SRC-IE-12; other T-4 auctions from their SEMO FCAR reports |
| Method | No calculation: values as published. T-1 auctions excluded from this chart. Provisional rows replaced when the final report is read |
| Dataset | **Not registered.** `src/governance/datasets.js` lists only `ie-day-ahead` for Ireland and deliberately excludes capacity-market results ("analyst-entered until a connector exists"). Proposed for the build: a fixed-vintage, analyst-entered table with its own record (like CALC-WA-DAY), refreshed after each auction, not an ETL feed. Gap: GAP-IE-CRM |
| Rights | SEMO publications; link and cite, original drawing |

### Gaps and conflicts

| ID | Issue | Shots | Temporary treatment | Next action |
| --- | --- | --- | --- | --- |
| GAP-IE-CRM | Full T-4 series not assembled; 2029/30 final results not read | ie-06 | Two-bar sketch tagged Example | Analyst: approve CALC-IE-CRM; build enters the table from SEMO FCAR reports |
| GAP-IE-DERATE | Storage de-rating factors for the current auction not extracted; model uses a seed | ie-08, ie-11 | Qualitative bars, Example | Read FAIP2930T-4 (or 2030/31) Table 3 |
| GAP-IE-SETTLE | Capacity payer and settlement chain not extracted from the current Code | ie-10 | Wording held at G-1 | Read Capacity Market Code settlement sections |
| GAP-IE-DS3-TERMS | DS3 service response times and terms not extracted | ie-04 | Purposes only, no times | Read the DS3 protocol |
| GAP-IE-LINKS | Interconnector list and capacities not reviewed | ie-01 | No MW on the map | Analyst review against operator pages |
| CF-IE-01 | The play says no services line after the long-stop; the card bridge shows none, but the engine folds `services` × `DS3_TO_FASS` (tail floor) into trading for every year | ie-00, ie-10 | Copy says "priced without them" | Analyst: accept the copy, or open separate model work |
| CF-IE-02 | The June 2026 "May 2027 not feasible" record (REPO-IE-DP) was not traced to a public primary source here | ie-05 | Page says "start date not confirmed" | Find the TSO notice or PIR V4.0 |
| CF-IE-03 | Secured share differs by denominator: card investment summary vs acquisition reference | ie-09 | Bind the card field only | Analyst: confirm the card field |
| CF-IE-04 | Volume-capped contract term: six years in an industry report, up to eight in the contract notice | ie-04 | Term not stated | Read SRC-IE-05 in full |
