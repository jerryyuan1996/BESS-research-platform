# Italy: Six-Chapter Storyboard

Pack: BESS-IX-2026-10-30; Italy script researched 31 October 2026; shot layout v1.2
Status: `proposed` script and bilingual page-text draft; **G-1 analyst sign-off pending**; steps 1 and 2 only. Markdown only; nothing is built, registered or published.
Navigation: [Master plan](README.md) | [Narrative card](market-narratives.md#3-eighteen-market-candidate-story-cards) | [Evidence specification](evidence-and-content-specification.md) | [Source register](source-register.md) (SRC-IT-01 to 04, CL-IT-01 to 03) | [Finland format](finland-storyboard.md)

## 0. Read first: the research meets the call's own trigger

The infrastructure-fund call watches `it-capacity-derating-dy2028`: "Terna decides the four-hour de-rating for 2028 delivery; it has proposed cutting it from 0.67 to 0.53". The research for this script found that the decision has been taken, and that it differs from the proposal the call and its next action price against (CF-IT-01):

- ARERA found Terna's revised technical rules compliant (resolution 370/2026/R/eel, 14 October 2026), and the ministry approved them by decree 327 of 16 October 2026, published on its site on 19 October (SRC-IT-08, SRC-IT-09).
- As reported, the new factors differ by zone and apply only to new storage. A four-hour battery counts for about 40% of its power in the North and Centre-North, 51% in the Centre-South, and 21% in the South, Calabria, Sicily and Sardinia. Existing capacity, capacity contracted in earlier auctions and the lithium batteries awarded in the first MACSE auction keep the delivery-2027 factors.
- Terna has set the delivery-2028 auction for 21 December 2026, with applications from 20 October to 3 November (SRC-IT-10).

The play's next action reads: "Screen ready-to-build capacity-market projects in the south and the islands; price them at a four-hour de-rating of 0.53 as well as 0.67." The south and islands now carry the lowest factor for new storage. A project that already holds a delivery-2027 contract keeps the old factor.

**This script does not change the call.** It argues for `it-cap-4h` as published, binds every figure to the card, and states the decided rule as a dated event in it-05. Whether the call, the play's zone, or its entry route (for example, ready-to-build projects already holding a delivery-2027 contract) should change is the analyst's decision. It is listed first in §11. Under rule 11 of the master plan, the story cannot go to build until the analyst has either re-confirmed the call against the decided factors or re-graded it.

These figures come from trade-press reports of the decree. This session could not open any Terna, ARERA, MASE or GME page, because the session's network policy blocks those hosts. Every primary locator below was found by search, but none was opened (GAP-IT-OPEN). The marker ceiling is therefore Fair.

## 1. Scope, argument and reading route

**Explain the current fund call: advance on the capacity market at four hours, with MACSE as a separate, lower-return route.** Italy is long, priced in zones, and its new solar, wind and storage requests sit mostly in the south and on the islands. It has two storage contracts that never stack. The capacity market pays a premium per credited MW for fifteen years and leaves the trading margin with the owner. MACSE pays a fixed premium per MWh of storage and takes the battery's time-shifting use for the system. The platform's model finds the capacity route at four hours worth more than the MACSE design at six. The capacity route is therefore the call, mostly merchant and graded Thin on that line. MACSE remains the alternative that a cheaper marginal MWh could reopen.

Allocation: `it`; physical boundary: the Italian transmission system, mainland and the two large islands, priced in day-ahead zones. Default lens: `infraFund`. `reviewedAgainst`: **REPO-IT-LIVE**, `main` at `edcb39ca0d69397f3683dffc9af5ffb49473c98c`, briefing built for 2026-10-31.

| Field at check | Fork A, the call | Fork B, the alternative |
| --- | --- | --- |
| Play | `it-cap-4h`, Capacity market · 4h | `it-ltda-6h`, MACSE · 6–7h · awarded |
| Call (infraFund) | `enter-now`, displayed **Advance / 优先推进**, tier `pursue` | `opportunistic`, displayed **Situational / 择机投入**, tier `situational` (the play's own call) |
| Route and entry | `cap`, ready-to-build | `ltda`, ready-to-build |
| Briefing evidence | `thin` | `thin` |
| Watches | `it-capacity-derating-dy2028`, `it-first-toll-price` | `it-macse-second-auction` (expected 24 Nov 2026) |
| Shown on the market page | Yes: the market page takes the first row per market | No: the story reads this row from the briefing |

The view's thesis, `play.why`, `because` and `despite` strings carry typed figures (a hold return, 0.67 to 0.53, a turnkey price). They are not copied. The opening reuses the existing card, whose headline return comes from the investment summary and differs from the briefing's design-grid return in `play.why` (CF-IT-02). The two must not be swapped.

**Competing explanation.** The capacity route's lead may owe more to its merchant line than to the contract. The capacity premium is about a fifth of first-year revenue, and the merchant line, graded Thin, carries the rest. On observed 2025 southern prices the capacity play returns much less than its headline (`docs/merchant-lines-plan-2026-10.md`). MACSE's lower modelled return may also reflect the published turnkey cost rather than what the first auction's winners actually paid for extra hours.

**Disconfirming condition.** The capacity play loses its lead if the decided delivery-2028 factor in the project's zone, or an observed year of zonal trading margin, takes its value below the MACSE design. MACSE overtakes it if the marginal MWh is priced well below the turnkey figure, or the second auction clears higher. A different call, play or best duration needs re-sign-off; research does not re-grade it silently.

| Chapter / page heading EN · 简体中文 | Shots | What the reader can explain afterwards |
| --- | --- | --- |
| Opening · 先看投资判断 | it-00 | The call, the play, the alternative and the next action |
| Origins · 系统起点 | it-01 | Why Italy is priced in zones, and why the zone matters to a battery |
| Historical choices · 历史选择 | it-02, it-03 | Two storage contracts: a capacity premium that keeps the trading margin, and MACSE |
| Today's tensions · 当下矛盾 | it-04, it-05 | Sun and queues in the south, demand in the north; the de-rating decision |
| Add a battery · 加入电池 | it-06, it-07 | Why the capacity route builds four hours and MACSE winners build long |
| Who pays · 谁来付钱 | it-08, it-09, it-10 | What each contract pays and takes; what is secured, for how long; why MACSE is the alternative |
| The investment · 回到投资 | it-11 | What could weaken the call, and where to inspect it |

Twelve shots, about five minutes. Fixed-view isometric SVG from the shared kit, off-white and deep green; ordinary scroll, chapter links, keyboard and reduced motion carry the same content. The map is schematic: zone boundaries are labelled approximate and no power flow is solved.

### Rules for every shot

- **Figures.** Every page-facing amount, share, factor, duration, tenor and plotted label is a `‹bound: …›` token (§9). Financial tokens resolve to existing card or briefing result fields; rule and auction tokens resolve to the dated evidence records in §10. Delivery years and event dates may appear as dates. No figure is copied from the view's prose.
- **Two forks, never stacked.** The capacity market and MACSE appear as a route switch. No chart, sum or sentence adds their payments together. The switch changes emphasis only; it never changes the published call or the market page's case.
- **Controls.** Era, zone, route, teaching battery preset, evidence drawer and hotspot only. No underwriting controls; "Go to the investment case" links to the market page.
- **Evidence.** One marker per shot, using the site's fixed strings: Strong evidence (证据充分), Fair evidence (证据尚可), Thin evidence (证据单薄). It is followed by "What would change it:" / "会改变判断的证据：". The opening inherits the card's marker. No shot is Strong: no primary document was opened in this session (GAP-IT-OPEN).
- **Time.** Observations solid; decided rules solid with their decision date; announced auctions and planned cables dashed beyond the "Checked" line; teaching values tagged **Example / 示例**.
- **Language.** All page text is drafted below in English and Simplified Chinese with the same meaning. Scene, Authoring check, Status and Mobile rows are authoring notes and never appear on the page.

## 2. Opening

### it-00 — The call · 先看投资判断

| Item | Shot specification |
| --- | --- |
| Scene | Small schematic Italy thumbnail with the zones outlined; no animation |
| Feedback | None; this shot is the conclusion. A text alternative carries the same card fields |
| Evidence and chart | REPO-IT-LIVE; CL-IT-13. Existing market play card only; a one-line fork note reads the MACSE row from the briefing. No new chart |
| Authoring check | Reuse the card, never `view.thesis` or `play.why`, which type a return and the superseded 0.53. The card's headline return (investment summary) and the briefing play's return (design grid) differ; the card's is shown here (CF-IT-02). Flag CF-IT-01 beside the build ticket: the bound next action names the south and islands at 0.53, which the decided factors overtake. Do not edit the action from the story |
| Mobile | Full-width card, fork line and two buttons; no scene before the conclusion |
| Status | `sourced` / `model-assumes-route`; G-1 pending; build blocked until the analyst rules on CF-IT-01 |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What is the call here, and what is the alternative? | 这里的投资判断是什么？备选路径又是什么？ |
| Copy | **‹bound: call› · ‹bound: play name› · ‹bound: card figures› · ‹bound: next action›**. Italy offers two storage contracts that never stack. This play takes the capacity market at ‹bound: play duration› hours; MACSE is a separate route, rated ‹bound: MACSE call›. The story explains why. | **‹bound: call› · ‹bound: play name› · ‹bound: card figures› · ‹bound: next action›**。意大利有两种储能合同，二者不能叠加。本方案选择‹bound: play duration›小时的容量市场；MACSE是另一条路径，评级为‹bound: MACSE call›。下面说明原因。 |
| Marker | The play's own marker, already on the card | 沿用方案卡上该方案自身的证据标记 |
| Controls | Start the story · Go to the investment case | 开始阅读 · 前往投资方案 |

## 3. Origins

### it-01 — One country, several prices · 一个国家，多个价格

| Item | Shot specification |
| --- | --- |
| Scene | Fixed isometric Italy: peninsula, Sicily and Sardinia; zone outlines labelled approximate; generic corridor symbols at zone boundaries; no measured flows |
| Feedback | Selecting a zone highlights it and shows its name only. EN: “Day-ahead price zone”; “Transfer limit between zones”. ZH: “日前价格区”；“区间输电限额” |
| Evidence and chart | CL-IT-04; SRC-IT-05 (zone configuration from 1 January 2021), SRC-IT-06 (GME clears the day-ahead market by zone). Zone names bind ‹bound: zone list› |
| Authoring check | The repository says six zones (`src/markets/it/data.js`, `zoneCount`); the configuration ARERA set for 2021 is understood to have seven mainland and island zones, with Calabria separate. Not confirmed in this session (GAP-IT-ZONES). Bind the list; never type a count. Foreign virtual zones are not drawn. Do not imply the single national purchase price is what a battery earns |
| Mobile | Same schematic, zone list as text beneath |
| Status | `sourced` by locator, not opened; `market-rule` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why is one country priced in several places? | 为什么一个国家要分区定价？ |
| Copy | Italy is long and narrow, with two large islands. Power moves along a few corridors, so the day-ahead market clears a separate price for each zone (‹bound: zone list›) within the limits between them. Where a battery sits decides which price it trades. | 意大利国土狭长，另有两大岛屿。电力只能沿少数通道输送，因此日前市场在区间输电限额内按区域分别出清价格（‹bound: zone list›）。电池建在哪里，就交易哪个区域的价格。 |
| Meaning | This play earns its trading margin at its own zone's price, so the zone is the first thing to check. | 本方案的交易收益按所在区域的价格实现，因此所属区域是首要核查项。 |
| Marker | Fair evidence. What would change it: the zone list confirmed in ARERA resolution 103/2019/R/eel and Terna's current zone configuration. | 证据尚可。会改变判断的证据：在ARERA第103/2019/R/eel号决议及Terna现行分区配置中核实区域清单。 |
| Controls | Zones · Corridors | 价格区 · 输电通道 |
| Labels | Day-ahead price zone · Transfer limit between zones · Approximate boundaries | 日前价格区 · 区间输电限额 · 边界为示意 |

## 4. Historical choices

### it-02 — Paying for capacity that will be there · 为“到时可用”的容量付费

| Item | Shot specification |
| --- | --- |
| Scene | A battery and a gas plant side by side; a contract card from Terna above each, showing "premium per credited MW" and "pay back above the strike price". Timeline nodes H-IT-01 and H-IT-04 |
| Feedback | EN: “Annual premium per credited MW”; “Pay back when prices exceed the strike”; “Trading margin stays with the owner”. ZH: “按计入MW支付的年度溢价”；“价格高于执行价时返还差额”；“交易收益归业主” |
| Evidence and chart | CL-IT-02 (existing, now located), CL-IT-05, CL-IT-06; SRC-IT-01, SRC-IT-07, SRC-IT-11, SRC-IT-12 |
| Authoring check | A reliability option, not a payment for energy. New build holds a multi-year contract; existing plant one year. The delivery-2027 premium was reported as uniform for existing and new capacity; bind it, never type it. Storage won most of the new capacity in that auction (reported range; bind the figure only once Terna's notice is opened). The strike-price level and the stress-hour obligation are not yet extracted (GAP-IT-STRIKE) |
| Mobile | Two stacked contract cards, then the three labels as a list |
| Status | Mechanism `sourced` by locator; clause-level terms `missing` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What does Italy's capacity market buy? | 意大利的容量市场买的是什么？ |
| Copy | Terna auctions, years ahead, capacity that must be available when the system is tight. A winner earns an annual premium for each credited MW and pays back the difference when market prices rise above a strike price. New plant can hold the contract for ‹bound: CM new-build term› years, and the trading margin stays with the owner. In the delivery-2027 auction, batteries won most of the new capacity. | Terna提前数年拍卖系统紧张时必须可用的容量。中标者按每个计入的MW获得年度溢价；市场价格高于执行价时，须返还差额。新建机组的合同期可达‹bound: CM new-build term›年，交易收益仍归业主。在2027交付年度的拍卖中，新增容量大部分由电池获得。 |
| Meaning | The capacity contract secures a premium on credited MW and leaves the battery free to trade; this play is built on that pairing. | 容量合同对计入的MW锁定溢价，同时让电池保留交易自由；本方案正是建立在这一组合之上。 |
| Marker | Fair evidence. What would change it: the auction rules for delivery 2028 opened, with the strike-price, availability and contract-term clauses extracted. | 证据尚可。会改变判断的证据：打开2028交付年度拍卖规则，提取执行价、可用性及合同期限条款。 |
| Controls | Premium · Strike-price repayment · Open timeline | 溢价 · 执行价返还 · 查看时间线 |
| Labels | Annual premium per credited MW · Pay back when prices exceed the strike · Trading margin stays with the owner | 按计入MW支付的年度溢价 · 价格高于执行价时返还差额 · 交易收益归业主 |

### it-03 — A second contract, only for storage · 第二种合同，只为储能而设

| Item | Shot specification |
| --- | --- |
| Scene | Timeline H-IT-03 and H-IT-05: the 2021 decree, ARERA's criteria, the ministry's approval of Terna's rules, the first auction. A second contract card from Terna marked "per MWh of storage"; the four awarded areas lit on the thumbnail map, the north grey |
| Feedback | EN: “Law”; “Regulator's criteria”; “Approved rules”; “First auction”; “Areas with a requirement”. ZH: “法令”；“监管标准”；“规则获批”；“首轮拍卖”；“设有需求的区域” |
| Evidence and chart | CL-IT-03 (existing, now located), CL-IT-07; SRC-IT-13, SRC-IT-14, SRC-IT-15, SRC-IT-16, SRC-IT-17 |
| Authoring check | The event chain is sourced; the causal reading ("the capacity market pays for reliability, not for shifting solar") is the script's interpretation, shown under "Why it matters", not as the decree's stated purpose. The press reports the north outside the eligible perimeter; bind areas from the results record. Do not state that MACSE and the capacity market are legally exclusive until the rules are opened: the view treats them as alternatives, and the delivery-2028 decree mentions MACSE winners keeping their delivery-2027 de-rating, which needs reading (GAP-IT-STACK) |
| Mobile | Vertical dated nodes, text first; map below |
| Status | Events `sourced` by locator; interpretation `proposed` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why did Italy create a second storage contract? | 意大利为何另设一种储能合同？ |
| Copy | The capacity market pays for being available at tight moments, not for moving midday power into the evening. A 2021 decree called for storage bought centrally; ARERA set the criteria, the ministry approved Terna's rules, and the first MACSE auction on ‹bound: MACSE auction 1 date› awarded ‹bound: MACSE term›-year contracts in ‹bound: MACSE areas›. None went to the north. | 容量市场为紧张时段的可用性付费，而不是为把午间电力挪到傍晚付费。2021年的一项法令要求集中采购储能；ARERA制定标准，主管部门批准Terna的规则；‹bound: MACSE auction 1 date›举行的首轮MACSE拍卖在‹bound: MACSE areas›授予了期限为‹bound: MACSE term›年的合同，北部没有获配。 |
| Meaning | MACSE is a separate route with its own payer and obligations; this play holds a capacity contract, not a MACSE one. | MACSE是另一条路径，付款方与义务各不相同；本方案持有的是容量合同，而非MACSE合同。 |
| Marker | Fair evidence. What would change it: Terna's results notice and the MACSE rules opened, confirming the areas, the term and the energy rights. | 证据尚可。会改变判断的证据：打开Terna结果公告与MACSE规则，核实区域、期限及电量权利。 |
| Controls | Open timeline · Areas · Why it matters | 查看时间线 · 区域 · 投资含义 |
| Labels | Law · Regulator's criteria · Approved rules · First auction · Areas with a requirement | 法令 · 监管标准 · 规则获批 · 首轮拍卖 · 设有需求的区域 |

## 5. Today's tensions

### it-04 — Sun and queues in the south, demand in the north · 南部阳光与排队，北部用电

| Item | Shot specification |
| --- | --- |
| Scene | Same map at midday: solar and wind symbols and a queue of battery symbols in the south and on the islands; demand symbols in the north. Planned cables dashed with their bound commissioning dates; corridor symbols at the zone boundaries |
| Feedback | EN: “Connection requests (stacked symbols, not to scale)”; “Planned link, not yet built”; “Midday”; “Evening”. ZH: “并网申请（堆叠符号，不按比例）”；“规划线路，尚未建成”；“午间”；“傍晚” |
| Evidence and chart | CL-IT-09; SRC-IT-21 (regional connection requests), SRC-IT-22 (named links); SRC-IT-06 for zonal prices. No quantity drawn until GAP-IT-QUEUE closes |
| Authoring check | Connection requests are applications, not projects or capacity. Do not draw a solved midday flow. The development plan's dates are plans; draw them dashed with their source date. The queue explains competition for the zone's spread; it does not show the play's own site |
| Mobile | Midday and evening states as two stacked panels |
| Status | Location of requests `sourced` qualitatively by locator; quantities `missing` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Where is the tension today? | 今天的矛盾在哪里？ |
| Copy | Most new solar and wind, and most battery connection requests, sit in the south and on the islands; much of the demand is in the north. At midday the southern zones can make more power than the corridors north can carry, so their prices fall. Terna plans new links; until they run, zone prices keep diverging. | 新增光伏、风电以及大部分储能并网申请集中在南部和岛屿，而大量用电需求在北部。午间，南部区域的发电可能超出北送通道的输送能力，当地价格随之走低。Terna规划了新的输电工程；在其投运之前，各区域价格仍会分化。 |
| Meaning | A southern battery can buy cheap midday power and sell in the evening, and so can the many batteries queued beside it. | 南部电池可以在午间低价充电、傍晚放电；排在它旁边的大量电池同样可以。 |
| Marker | Fair evidence. What would change it: Terna's connection-request data by region and the current development plan's dated links. | 证据尚可。会改变判断的证据：Terna按区域公布的并网申请数据，以及现行电网发展规划中注明日期的输电工程。 |
| Controls | Midday · Evening · Planned links | 午间 · 傍晚 · 规划线路 |
| Labels | Connection requests (stacked symbols, not to scale) · Planned link, not yet built | 并网申请（堆叠符号，不按比例） · 规划线路，尚未建成 |

### it-05 — How much of a battery the capacity market counts · 容量市场把电池算作多少

| Item | Shot specification |
| --- | --- |
| Scene | Panel A of the signature chart (Chart-IT-FORK, §10) as a full-width 2D panel beside a small battery: credited share of one nameplate MW at the play's duration, delivery 2027 (one national bar) against delivery 2028 for new storage (one bar per zone group). A "Contracts already awarded keep their factor" tag on the 2027 bar |
| Feedback | EN: “Credited share of nameplate power”; “Delivery 2027, all zones”; “Delivery 2028, new storage”; “Decided ‹bound: DY2028 decision date›”. ZH: “计入容量占铭牌功率比例”；“2027交付年度，全国统一”；“2028交付年度，新增储能”；“‹bound: DY2028 decision date›确定” |
| Evidence and chart | CL-IT-10 (event) and CL-IT-10i (interpretation); SRC-IT-07, SRC-IT-08, SRC-IT-09; CF-IT-01. Values bind ‹bound: DY2027 de-rating› and ‹bound: DY2028 de-rating by zone› from the decree's annex record |
| Authoring check | State the event, not a verdict: the play's re-pricing is the analyst's. Do not show the superseded single-figure proposal as current; if shown at all, it is a ghosted "Proposed earlier" mark with its own date. Apply the 2028 factors only to new storage; existing and contracted capacity, and MACSE winners, keep the 2027 factor. The 2028 premium is set at the 21 December auction and is unknown; never multiply the 2027 premium by a 2028 factor on this panel |
| Mobile | Bars stacked vertically, zone names as row labels, values in text |
| Status | Event `sourced` by locator (trade press consistent across four outlets; decree not opened); interpretation `proposed`; G-1 pending, analyst ruling on CF-IT-01 required |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | How much of a four-hour battery does the capacity market count? | 容量市场把四小时电池算作多少容量？ |
| Copy | Terna credits a battery only for the share of its power it can hold through the hours of stress. In the delivery-2027 auction a four-hour battery counted for ‹bound: DY2027 de-rating› of its power in every zone. On ‹bound: DY2028 decision date› the ministry approved factors for delivery 2028 that differ by zone, ‹bound: DY2028 de-rating by zone›, for new storage only. Contracts already awarded keep their factor. | Terna只按电池能在系统紧张时段持续提供的功率比例计入容量。在2027交付年度拍卖中，四小时电池在各区域均按其功率的‹bound: DY2027 de-rating›计入。‹bound: DY2028 decision date›，主管部门批准了2028交付年度按区域区分的系数（‹bound: DY2028 de-rating by zone›），仅适用于新增储能；已授予的合同保留原有系数。 |
| Meaning | The capacity line now depends on the project's zone and on whether it already holds a contract; the play must be priced at the factor that applies to it. | 容量收入现在取决于项目所在区域，以及项目是否已持有合同；本方案须按适用于自身的系数定价。 |
| Marker | Fair evidence. What would change it: the decree's annex opened to confirm the zonal factors, and the analyst's re-pricing of the play at them. | 证据尚可。会改变判断的证据：打开部令附件核实分区系数，以及分析师按这些系数对本方案重新定价。 |
| Controls | Delivery 2027 · Delivery 2028 · By zone · Contracts already awarded | 2027交付年度 · 2028交付年度 · 按区域 · 已授予合同 |
| Labels | Credited share of nameplate power · Delivery 2027, all zones · Delivery 2028, new storage · Decided ‹bound: DY2028 decision date› | 计入容量占铭牌功率比例 · 2027交付年度，全国统一 · 2028交付年度，新增储能 · ‹bound: DY2028 decision date›确定 |

## 6. Add a battery

### it-06 — Why four hours for the capacity route · 容量路径为何选四小时

| Item | Shot specification |
| --- | --- |
| Scene | One battery with power and energy layers; a teaching preset steps two, four, six and eight hours (Example). Each step shows credited share rising and energy capital growing; no money values |
| Feedback | EN: “More hours, more of the power credited”; “More hours, more capital”; “Thinner trading margin per MWh”; “Example”. ZH: “时长越长，计入的功率越多”；“时长越长，资本投入越多”；“每MWh交易收益摊薄”；“示例” |
| Evidence and chart | CL-IT-13; REPO-IT-LIVE design grid (`grids.it`, route `cap`, best duration) and `src/markets/it/comparison.js` `durationResponse` (published factors at four and eight hours, others filled) |
| Authoring check | The design grid was priced on the delivery-2027 curve; it has not been re-run at the decided 2028 factors. Say "on the platform's design test", never "the rules require four hours". The teaching preset never re-prices the case. Unpriced cells stay unavailable |
| Mobile | Current-play card first; teaching steps beneath |
| Status | `model-assumption`; `sourced`; re-run pending (CF-IT-01) |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why does this play build ‹bound: play duration› hours? | 本方案为何选择‹bound: play duration›小时？ |
| Copy | A longer battery is credited for more of its power, but every extra hour costs capital and spreads the trading margin thinner. On the platform's design test, ‹bound: play duration› hours gives the capacity route the most value per MW. | 电池越长，计入的功率比例越高；但每增加一小时都要投入资本，交易收益也会摊薄。在平台的时长测试中，容量路径在‹bound: play duration›小时时每MW价值最高。 |
| Meaning | This duration balances credited capacity, trading value and capital cost under the factors the model uses; a lower factor can move that balance. | 在模型采用的系数下，这一时长在计入容量、交易价值与资本成本之间取得平衡；系数降低可能改变这一平衡。 |
| Marker | Fair evidence. What would change it: the design test re-run at the decided delivery-2028 factors, or a different cost per MWh. | 证据尚可。会改变判断的证据：按已确定的2028交付年度系数重新进行时长测试，或每MWh成本发生变化。 |
| Controls | Current play · Teaching battery: two, six, eight hours · Open duration evidence | 当前方案 · 示例电池：二、六、八小时 · 查看时长依据 |
| Labels | More hours, more of the power credited · More hours, more capital · Thinner trading margin per MWh · Example | 时长越长，计入的功率越多 · 时长越长，资本投入越多 · 每MWh交易收益摊薄 · 示例 |

### it-07 — Why MACSE winners build long · MACSE中标者为何建长时电池

| Item | Shot specification |
| --- | --- |
| Scene | Same battery switched to the MACSE route: each added hour adds a contracted block of equal height; beside it a "marginal MWh" layer on a shared power block, its cost shown as an open question mark |
| Feedback | EN: “Paid per MWh of storage”; “First-auction average: ‹bound: MACSE awarded hours› h”; “Cost of the next MWh?”. ZH: “按每MWh储能付费”；“首轮中标平均：‹bound: MACSE awarded hours›小时”；“下一MWh的成本是多少？” |
| Evidence and chart | CL-IT-07, CL-IT-13; SRC-IT-16 (awarded MWh and MW, from which the average is computed in CALC-IT-FORK); REPO-IT-LIVE MACSE play `why` and `action` (bound, not copied) |
| Authoring check | The average is awarded MWh divided by awarded MW from the results record, not a typed figure. Do not state what winners paid for capex: it is not public. The turnkey figure in the play's action is bound through ‹bound: MACSE next action›, never typed. An oversizing obligation exists in the rules as reported; its level is not yet confirmed from ARERA 332/2026 (GAP-IT-STACK) |
| Mobile | Stacked blocks with labels; question card beneath |
| Status | Award facts `sourced` by locator (repository record opened 2 Aug 2026); capex `missing` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why did MACSE winners build longer batteries? | MACSE中标者为何建造更长时的电池？ |
| Copy | MACSE pays per MWh of storage a year, so each extra hour adds contracted income. The first auction's winners averaged ‹bound: MACSE awarded hours› hours. Whether that pays depends on what the extra hours cost: the price of a marginal MWh added to a shared power block. | MACSE按每年每MWh储能付费，因此每多一小时都会增加合同收入。首轮中标项目平均时长为‹bound: MACSE awarded hours›小时。这是否划算，取决于额外时长的成本，即在共享功率模块上增加一个边际MWh的价格。 |
| Meaning | The MACSE route's return turns on the cost of the marginal MWh, which the published turnkey price does not show. | MACSE路径的回报取决于边际MWh成本，而公开的交钥匙价格无法反映这一成本。 |
| Marker | Thin evidence. What would change it: an EPC price for a marginal MWh on a shared power block, obtained before ‹bound: MACSE auction 2 date›. | 证据单薄。会改变判断的证据：在‹bound: MACSE auction 2 date›之前，取得共享功率模块上边际MWh的EPC报价。 |
| Controls | Four hours · Six hours · Eight hours (Example) · Open first-auction results | 四小时 · 六小时 · 八小时（示例） · 查看首轮拍卖结果 |
| Labels | Paid per MWh of storage · First-auction average: ‹bound: MACSE awarded hours› h · Cost of the next MWh? · Example | 按每MWh储能付费 · 首轮中标平均：‹bound: MACSE awarded hours›小时 · 下一MWh的成本是多少？ · 示例 |

## 7. Who pays

### it-08 — Two contracts for one battery · 一台电池，两种合同（signature chart / 核心图表）

| Item | Shot specification |
| --- | --- |
| Scene | Physical battery fixed; a route switch, Capacity market / MACSE, moves the contract layer. **Chart-IT-FORK**, full width, two panels with separate units and a shared zone selector. Panel A: credited share of nameplate power (as it-05). Panel B: contracted payment per nameplate MW per year from published auction results: the capacity bar is the delivery-2027 premium times its four-hour factor; the MACSE bar is the selected area's first-auction clearing price times the MACSE play's duration. Each bar carries its rights tag. The delivery-2028 capacity premium appears as a dashed empty outline, "Set at the auction on ‹bound: CM DY2028 auction date›", until the result exists |
| Feedback | EN: “Contracted payment · EUR per nameplate MW per year”; “Owner keeps the trading margin”; “Time-shifting use passes to Terna”; “Never added together”. ZH: “合同付款·欧元／铭牌MW／年”；“交易收益归业主”；“时移使用权转交Terna”；“二者绝不相加” |
| Evidence and chart | CL-IT-06, CL-IT-07, CL-IT-08; SRC-IT-11, SRC-IT-16, SRC-IT-02; CALC-IT-FORK; GAP-IT-AUCTIONS (no registered dataset). Current fallback: “Example: two contract shapes” with no numeric axis |
| Authoring check | Contracted payment only; it is not revenue, value or return, and the chart says so. The two bars are alternatives, drawn side by side with a gap, never stacked or summed. The capacity bar uses delivery-2027 terms that a new 2028 project cannot get; label it "Delivery 2027 contract". The MACSE bar is gross of the share of market proceeds the owner may keep or return; that split is not drawn until the contract is opened (GAP-IT-STACK). No crossing lines, no IRR |
| Mobile | Panels stacked; zone selector above; units on every panel; accessible table once the dataset passes review |
| Status | Chart method `proposed`; data `blocked` until GAP-IT-AUCTIONS closes; G-1 reviews the design only |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Who pays, and what does the owner give up? | 谁来付钱？业主让出了什么？ |
| Copy | In the capacity market, Terna pays a premium for each credited MW, and the owner keeps the trading margin with its risk. Under MACSE, Terna pays a fixed premium for each MWh of storage, and the time-shifting use of the contracted energy passes to Terna, which offers it to the market. The chart shows what each contract pays one nameplate MW, from published auction results. | 在容量市场中，Terna为每个计入的MW支付溢价，交易收益及其风险仍归业主。在MACSE下，Terna为每MWh储能支付固定溢价，已签约电量的时移使用权转交Terna，由其向市场提供。图表依据已公布的拍卖结果，显示每种合同为一个铭牌MW支付多少。 |
| Meaning | The capacity route secures less and keeps the trading upside; MACSE secures more and hands that upside over. | 容量路径锁定的收入较少，但保留交易上行空间；MACSE锁定更多收入，却让出了这部分空间。 |
| Marker | Fair evidence. What would change it: Terna's two results notices and the MACSE contract's energy-rights clauses opened and entered in the chart's record. | 证据尚可。会改变判断的证据：打开Terna的两份结果公告及MACSE合同的电量权利条款，并录入图表记录。 |
| Controls | Capacity market · MACSE · Zone · How measured | 容量市场 · MACSE · 区域 · 计算方法 |
| Labels | Credited share of nameplate power · Contracted payment · EUR per nameplate MW per year · Delivery 2027 contract · First MACSE auction, by area · Owner keeps the trading margin · Time-shifting use passes to Terna · Never added together · Set at the auction on ‹bound: CM DY2028 auction date› | 计入容量占铭牌功率比例 · 合同付款 · 欧元／铭牌MW／年 · 2027交付年度合同 · 首轮MACSE拍卖（按区域） · 交易收益归业主 · 时移使用权转交Terna · 二者绝不相加 · 于‹bound: CM DY2028 auction date›拍卖确定 |
| Caption | Example: two contract shapes | 示例：两种合同形态 |

### it-09 — What the capacity contract secures, and until when · 容量合同锁定什么，锁定到何时

| Item | Shot specification |
| --- | --- |
| Scene | Qualitative revenue band for the capacity play: a contracted floor block for the bound tenor, a larger merchant band above it, a dashed "re-auction" band after expiry. Panel B of Chart-IT-FORK as a thumbnail |
| Feedback | EN: “Capacity premium, contracted”; “Trading: day-ahead, intraday, balancing”; “After the contract: re-auctioned”; “Strike-price repayment caps the highest prices”. ZH: “容量溢价（合同锁定）”；“交易：日前、日内、平衡市场”；“合同到期后：重新拍卖”；“执行价返还使最高价格封顶” |
| Evidence and chart | CL-IT-05, CL-IT-14; REPO-IT-LIVE card (`row.investment.secured`, `.securedYears`) and play `econ.merchantLine` (marker `thin`, share); `docs/merchant-lines-plan-2026-10.md` |
| Authoring check | Bind the card's secured share and tenor; never type "a fifth" or "four-fifths". The merchant marker is the analyst's settled grading (Thin); do not upgrade it. Name the tenor and what follows it (master plan rule 7). The strike repayment cuts scarcity upside on the merchant band; show it qualitatively only |
| Mobile | Two stacked panels: during the contract, after the contract |
| Status | `model-assumes-route`; `sourced`; no award or contract verified for any project |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What does the capacity contract secure, and for how long? | 容量合同锁定了什么，锁定多久？ |
| Copy | The capacity premium secures ‹bound: secured share› of first-year revenue for ‹bound: secured tenor› years. The rest, ‹bound: merchant share›, is trading in the zone's day-ahead, intraday and balancing markets, and stays merchant. When prices spike above the strike, part of that gain goes back. After the contract, the capacity line has to be won again at a later auction. | 容量溢价锁定首年收入的‹bound: secured share›，期限为‹bound: secured tenor›年。其余‹bound: merchant share›来自所在区域的日前、日内和平衡市场交易，仍属市场化收入。价格高于执行价时，部分收益须返还。合同到期后，容量收入须在后续拍卖中重新竞得。 |
| Meaning | Most of this play's revenue is merchant, and the evidence for that line is thin. | 本方案的大部分收入属于市场化收入，而这部分收入的证据单薄。 |
| Marker | Thin evidence. What would change it: a full year of observed zonal prices that pays the model's merchant line, or a signed floor or toll on the trading margin. | 证据单薄。会改变判断的证据：全年区域价格观测达到模型的市场化收入假设，或就交易收益签订保底或租赁合同。 |
| Controls | During the contract · After the contract · Merchant evidence | 合同期内 · 合同到期后 · 市场化收入依据 |
| Labels | Capacity premium, contracted · Trading: day-ahead, intraday, balancing · After the contract: re-auctioned · Strike-price repayment caps the highest prices | 容量溢价（合同锁定） · 交易：日前、日内、平衡市场 · 合同到期后：重新拍卖 · 执行价返还使最高价格封顶 |

### it-10 — Why MACSE is the alternative, not the call · MACSE为何是备选，而非首选

| Item | Shot specification |
| --- | --- |
| Scene | Route switch on MACSE: the battery grows to the MACSE play's duration; a large contracted block, a small merchant band; a fork sign back to the capacity route. Two result cards side by side, labelled "Design comparison, same basis" |
| Feedback | EN: “Secured share”; “Hold return, design comparison”; “Not the market page's headline basis”. ZH: “锁定收入占比”；“持有期回报（设计对比口径）”；“与市场页标题回报口径不同” |
| Evidence and chart | CL-IT-13; REPO-IT-LIVE `plays['it/it-ltda-6h'].econ` and `plays['it/it-cap-4h'].econ` (same design-economics basis); the MACSE play's own call; CF-IT-02 |
| Authoring check | Compare the two forks only on the briefing's design basis, both from `plays[...].econ`; never set the card's investment-summary return beside the MACSE design return. The MACSE row carries a seeded capture input (`weakInputs`); its marker is Thin. Do not say MACSE "loses money"; say it returns less. The second-auction cap is higher than its consultation proposed and lower than the first auction's; bind it, never characterise its effect on returns |
| Mobile | Two result cards stacked, basis note between them |
| Status | `model-assumption`; `sourced`; G-1 to accept the comparison basis |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | If MACSE secures more, why is it not the call? | MACSE锁定的收入更多，为何不是首选？ |
| Copy | Because here, security costs return. On the platform's design comparison, the MACSE play secures ‹bound: MACSE secured share› of revenue and returns ‹bound: MACSE design hold›, against ‹bound: capacity design hold› for the capacity play on the same basis. The fund rates MACSE ‹bound: MACSE call›: it pays only if the marginal MWh costs well below the published turnkey price. Next for MACSE: ‹bound: MACSE next action› | 原因在于，在这里，确定性要以回报为代价。在平台的设计对比中，MACSE方案锁定‹bound: MACSE secured share›的收入，回报为‹bound: MACSE design hold›；同一口径下，容量方案为‹bound: capacity design hold›。基金对MACSE的评级为‹bound: MACSE call›：只有边际MWh成本远低于公开的交钥匙价格，它才划算。MACSE的下一步：‹bound: MACSE next action› |
| Meaning | MACSE is the lower-return route, and a cheaper marginal MWh or a higher second-auction clear could reopen it; the call stays with the capacity market. | MACSE是回报较低的路径；若边际MWh更便宜或第二轮拍卖出清价更高，判断可能重新打开；投资首选仍是容量市场。 |
| Marker | Thin evidence. What would change it: the second auction's clearing prices by area, and an EPC price for the marginal MWh. | 证据单薄。会改变判断的证据：第二轮拍卖各区域的出清价格，以及边际MWh的EPC报价。 |
| Controls | Capacity market · MACSE · About the basis | 容量市场 · MACSE · 口径说明 |
| Labels | Secured share · Hold return, design comparison · Not the market page's headline basis | 锁定收入占比 · 持有期回报（设计对比口径） · 与市场页标题回报口径不同 |

## 8. The investment

### it-11 — What could weaken it · 什么会削弱投资逻辑

| Item | Shot specification |
| --- | --- |
| Scene | Calm map with four factor cards; competing southern batteries dashed; the two dated auctions dashed beyond the "Checked" line |
| Feedback | Each card names the line it affects and links to its section: de-rating → `#bankable` and `#downside`; merchant margin → `#revenue` and `#downside`; competition → `#downside`; authorisation and delay → `#execution`. A fifth, smaller card: "A disclosed Italian toll price could reopen the route choice" (trigger `it-first-toll-price`), linked to `#revenue` |
| Evidence and chart | CL-IT-10, CL-IT-11, CL-IT-12, CL-IT-14; triggers in REPO-IT-LIVE; Downside definitions in `src/experience/downsideNarrative.js` |
| Authoring check | A risk card shows direction only, no probability or new number. Do not tell the reader to avoid the south; the analyst rules on CF-IT-01. Keep "no toll play" as settled: the toll card is a watch, not a third route. Exits to the market page; no second financial view |
| Mobile | Factor cards stacked, then four large section links |
| Status | `sourced` by locator; future auctions `official-plan`; G-1 pending |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What would make this play less attractive? | 什么会让这条投资路线失去吸引力？ |
| Copy | Four things. The factor decided for new storage in delivery 2028, where it applies to the project. A zone whose prices do not pay the merchant line. More batteries competing for the same spread and the same auctions. Authorisation or construction that misses a delivery year. The next capacity auction is on ‹bound: CM DY2028 auction date› and the next MACSE auction on ‹bound: MACSE auction 2 date›. Then: ‹bound: next action› | 有四个因素：适用于项目的2028交付年度新增储能系数；所在区域价格不足以支撑市场化收入假设；更多电池争夺同一价差和同一拍卖；许可或建设延误错过交付年度。下一轮容量拍卖定于‹bound: CM DY2028 auction date›，下一轮MACSE拍卖定于‹bound: MACSE auction 2 date›。随后：‹bound: next action› |
| Meaning | Price the project at its own zone's factor and an observed trading margin before committing. | 承诺投资前，按项目所在区域适用的系数和实际观测的交易收益定价。 |
| Marker | Thin evidence. What would change it: the analyst's re-pricing at the decided factors, the delivery-2028 auction result, and a year of observed zonal margin. | 证据单薄。会改变判断的证据：分析师按已确定系数重新定价、2028交付年度拍卖结果，以及一整年的区域交易收益观测。 |
| Controls | De-rating · Merchant margin · Competition · Delay · Bankable case · Revenue · Execution · Downside | 折减系数 · 市场化收益 · 竞争 · 延误 · 可融资方案 · 收益拆解 · 执行步骤 · 下行风险 |
| Factor cards | Affects capacity income; see the Bankable case and Downside · Affects most of revenue; see Revenue and Downside · Affects spreads and auction prices; see Downside · Affects first revenue; see Execution · A disclosed Italian toll price could reopen the route choice | 影响容量收入；见可融资方案与下行风险 · 影响大部分收入；见收益拆解与下行风险 · 影响价差与拍卖价格；见下行风险 · 影响首笔收入；见执行步骤 · 意大利租赁价格一旦公开，路径选择可能重新打开 |
| Exits | Bankable case · Revenue · Execution · Downside · Back to the play | 可融资方案 · 收益拆解 · 执行步骤 · 下行风险 · 返回方案卡 |

### Shared page vocabulary and states

| Context | English | 简体中文 |
| --- | --- | --- |
| Market and lens | Italy · Infrastructure fund | 意大利 · 基础设施基金 |
| Entry button | Grid, history and full research context | 电网、历史与完整研究背景 |
| Navigation | Previous · Next · Chapters · Sources | 上一节 · 下一节 · 章节 · 来源 |
| Evidence drawer | Source · Locator · Checked on ‹bound: source checked date› · Event and source · Why it matters | 来源 · 具体位置 · 核查时间：‹bound: source checked date› · 事件与来源 · 投资含义 |
| Marker line | What would change it: | 会改变判断的证据： |
| Legend | Schematic · Observed · Decided rule · Announced auction · Planned link · Example | 示意 · 已观测 · 已确定规则 · 已公布拍卖 · 规划线路 · 示例 |
| Route switch | Capacity market · MACSE · The two are alternatives and are never added together | 容量市场 · MACSE · 二者互为替代，绝不相加 |
| Exit | Go to the investment case | 前往投资方案 |
| Stale call | This story was last reviewed against the call of ‹date›. | 本故事最近一次依据‹date›的投资判断复核。 |
| Missing value | Value unavailable; see the market case | 数值暂缺；请查看市场方案 |
| Chart fallback | Auction results awaiting review; showing an Example | 拍卖结果待审核；当前展示示例 |
| Loading | Loading evidence… · Could not load; retry | 正在载入证据… · 未能载入，重试 |
| Reduced motion | You can read the full story without motion | 无需动画也可阅读完整内容 |
| H-IT-01 | ‹bound: history node›: first capacity-market auctions | ‹bound: history node›：首批容量市场拍卖 |
| H-IT-02 | ‹bound: history node›: new zone configuration takes effect | ‹bound: history node›：新的价格分区配置生效 |
| H-IT-03 | ‹bound: history node›: decree calls for central storage procurement | ‹bound: history node›：法令要求集中采购储能 |
| H-IT-04 | ‹bound: history node›: capacity auction for delivery 2027; batteries win most new capacity | ‹bound: history node›：2027交付年度容量拍卖，电池获得大部分新增容量 |
| H-IT-05 | ‹bound: history node›: first MACSE auction | ‹bound: history node›：首轮MACSE拍卖 |
| H-IT-06 | ‹bound: history node›: delivery-2028 de-rating decided by zone | ‹bound: history node›：2028交付年度折减系数按区域确定 |
| Future (dashed) | ‹bound: MACSE auction 2 date›: second MACSE auction · ‹bound: CM DY2028 auction date›: capacity auction for delivery 2028 | ‹bound: MACSE auction 2 date›：第二轮MACSE拍卖 · ‹bound: CM DY2028 auction date›：2028交付年度容量拍卖 |

## 9. Financial bindings that already exist

Authoring references, not code. `row` is the infraFund Italy row the market page uses (`opportunities('infraFund')`, first row for `it`, which is `it-cap-4h`). The MACSE fork reads the briefing directly: `HOME_BRIEFING.plays['it/it-ltda-6h']` and the second `it` row in `HOME_BRIEFING.lenses.infraFund.rows`. Values at check are given only so the analyst can review the script; they never enter copy.

| Token | Field | At check, 31 Oct 2026 |
| --- | --- | --- |
| ‹bound: call› | `CALLS[row.call]` | Advance (`enter-now`) |
| ‹bound: play name› | `playTitle(row.play, row.stage)` | Capacity market · 4h, ready-to-build |
| ‹bound: card figures› | The card's existing fields: `row.econ.hold` (from `row.investment.holdIRR`), `row.econ.levered`, `row.econ.secured`, `row.econ.securedYears`, with the card's all-equity basis note | Hold 11.6%; secured 20.0%; 15 years |
| ‹bound: next action› | `row.play.action.text` | "Screen ready-to-build capacity-market projects in the south and the islands; price them at a four-hour de-rating of 0.53 as well as 0.67." (see CF-IT-01) |
| ‹bound: play evidence› | `row.evidence` through the existing labels | Thin |
| ‹bound: play duration› | `row.play.hours` | 4 |
| ‹bound: secured share› | `row.econ.secured` after the investment-summary projection, `share()` format as the card | 20.0% |
| ‹bound: secured tenor› | `row.econ.securedYears` | 15 |
| ‹bound: merchant share› | `HOME_BRIEFING.plays['it/it-cap-4h'].econ.merchantLine.share` | 80% |
| ‹bound: capacity design hold› | `HOME_BRIEFING.plays['it/it-cap-4h'].econ.hold` (design basis) | 14.6% |
| ‹bound: MACSE call› | `CALLS[...]` of the second `it` row in `HOME_BRIEFING.lenses.infraFund.rows` (`it-ltda-6h`) | Situational (`opportunistic`) |
| ‹bound: MACSE secured share› | `HOME_BRIEFING.plays['it/it-ltda-6h'].econ.secured` | 71.8% |
| ‹bound: MACSE design hold› | `HOME_BRIEFING.plays['it/it-ltda-6h'].econ.hold` | 2.6% |
| ‹bound: MACSE play duration› | `HOME_BRIEFING.plays['it/it-ltda-6h'].hours` | 6 |
| ‹bound: MACSE next action› | `HOME_BRIEFING.plays['it/it-ltda-6h'].action.text` | "Get an EPC price for a marginal MWh on a shared power block before the second auction; …" |
| ‹bound: best cap duration› | `HOME_BRIEFING.grids.it.byRoute.cap.best` (authoring check only) | 4 |

If the selected lens, call or play differs at build, the stale-call line shows and the story is queued for review.

## 10. Evidence bindings, signature chart and traceability

### Evidence tokens proposed for the build

Explicit references to the records in §12, not runtime fields. A missing value hides the label; it never shows zero.

| Token | Record and field | Units / limit |
| --- | --- | --- |
| ‹bound: zone list› | SRC-IT-05 zone configuration, localised zone names | Names only; no count typed |
| ‹bound: CM new-build term› | SRC-IT-07 / SRC-IT-11 new-capacity contract term | Years |
| ‹bound: DY2027 de-rating› | SRC-IT-11 / repository `durationResponse` published point at four hours | Share of nameplate power |
| ‹bound: DY2028 decision date› | SRC-IT-08 decree date | Date |
| ‹bound: DY2028 de-rating by zone› | SRC-IT-08 annex, four-hour storage, by zone group | Share; new storage only |
| ‹bound: CM DY2028 auction date› | SRC-IT-10 auction date | Date; announced |
| ‹bound: MACSE auction 1 date› / ‹bound: MACSE areas› / ‹bound: MACSE term› | SRC-IT-16 | Date; area names; years |
| ‹bound: MACSE awarded hours› | CALC-IT-FORK step 3 from SRC-IT-16 | Hours, one decimal |
| ‹bound: MACSE auction 2 date› | SRC-IT-19 / trigger `it-macse-second-auction.expected` | Date; announced |
| ‹bound: history node› | H-IT-01 to 06, event date | Event date, not publication date |
| ‹bound: source checked date› | The selected record's check date | Date |

### Chart-IT-FORK — calculation contract (proposed, not executed)

| Field | Entry |
| --- | --- |
| Question | What does each contract pay one nameplate MW a year, and what does each credit or take? It explains why the capacity route keeps upside and MACSE secures more |
| Inputs | (1) Capacity market, delivery 2027: clearing premium, EUR/MW of credited capacity/year (SRC-IT-11); four-hour de-rating (SRC-IT-11 or the DTF annex in force). (2) Capacity market, delivery 2028: four-hour storage factor by zone (SRC-IT-08); premium after the 21 December auction (SRC-IT-10). (3) MACSE first auction: clearing price by area, EUR/MWh/year; awarded MWh and MW (SRC-IT-16). (4) The MACSE play's duration, ‹bound: MACSE play duration› |
| Method | Panel A: factor × 1 MW, per zone group and delivery year. Panel B: capacity bar = premium × factor; MACSE bar = area price × play hours. Step 3: average awarded hours = awarded MWh ÷ awarded MW. No discounting, indexation, FX or tax; nominal EUR in the delivery year's terms |
| Interpretation | Contracted gross payment per nameplate MW, before strike repayment, penalties, retained-proceeds sharing and costs. Not revenue, value or return |
| Outputs | Bars with formatted labels; an accessible table; each value carries its record ID and check date |
| Limits | Delivery-2027 terms are not available to a new 2028 project; the 2028 premium is unknown until the auction; the MACSE bar omits the owner's share of resold proceeds. Never stacked |
| Dataset | **Not registered.** No Italian dataset exists in `src/governance/datasets.js`. Gap for the build: a static, fixed-vintage `it-auction-results` record (capacity results by delivery year, de-rating tables by delivery year, zone and duration, MACSE results by area), extracted by hand from the Terna, ARERA and MASE documents and refreshed after each auction. Do not register it in this task (GAP-IT-AUCTIONS) |
| Approval | G-1 reviews the design; numbers wait for GAP-IT-OPEN and GAP-IT-AUCTIONS |

### Source-to-shot mapping

| Shot | Claims → sources | Chart / binding owner | Misreading prevented |
| --- | --- | --- | --- |
| it-00 | CL-IT-13 → REPO-IT-LIVE | Existing card; briefing MACSE row | Stale typed returns; MACSE read as the call |
| it-01 | CL-IT-04 → SRC-IT-05/06 | Schematic; zone list | National price read as the battery's price |
| it-02 | CL-IT-02/05/06 → SRC-IT-01/07/11/12 | Contract card; H-IT-01/04 | Capacity premium read as energy income or a floor on trading |
| it-03 | CL-IT-03/07 → SRC-IT-13–17 | Timeline H-IT-03/05 | MACSE read as part of the capacity market, or stackable |
| it-04 | CL-IT-09 → SRC-IT-21/22/06 | Map; dashed links | Requests read as built capacity; planned links read as built |
| it-05 | CL-IT-10/10i → SRC-IT-07/08/09 | Chart-IT-FORK panel A | Superseded proposal shown as current; 2028 factor applied to awarded contracts |
| it-06 | CL-IT-13 → REPO-IT-LIVE | Design grid | Four hours read as a regulatory requirement |
| it-07 | CL-IT-07/13 → SRC-IT-16 | CALC-IT-FORK step 3 | Winners' capex assumed known |
| it-08 | CL-IT-06/07/08 → SRC-IT-11/16/02 | Chart-IT-FORK | Contracted payment read as value; the forks summed |
| it-09 | CL-IT-05/14 → REPO-IT-LIVE | Card share and tenor | Secured share read as the whole revenue; no tenor |
| it-10 | CL-IT-13 → REPO-IT-LIVE | Briefing design economics, both forks | Card headline compared with a design-basis return |
| it-11 | CL-IT-10/11/12/14 → SRC-IT-08/10/19 | Existing market sections | Risk read as probability; toll read as a third route |

Reverse traceability: each source in §12 names its claims; each claim names its shots. A superseded source queues a finite set of shots, labels and translations.

## 11. G-1 record and stopping point

| Review | Analyst decision required |
| --- | --- |
| 1. The trigger | CF-IT-01: `it-capacity-derating-dy2028` appears resolved (MASE decree 327/2026, 16 Oct), with new four-hour storage in the south and islands credited below the 0.53 the play prices. Re-confirm, re-grade or re-scope the call, its zone and its next action, or tell the script to wait. The story cannot be built on the current next action without this ruling |
| 2. A possible entry refinement | Ready-to-build projects that already hold a delivery-2027 capacity contract keep the old factor. Is that the intended entry, and should the play's action say so? Analyst's call; no change made |
| 3. Comparison basis | CF-IT-02: the card shows the investment-summary hold return; it-10 compares the forks on the briefing's design basis. Accept two labelled bases, or ask for an investment-summary MACSE figure (separate model work) |
| 4. Signature chart | Accept Chart-IT-FORK (panel A credited share; panel B contracted payment from auction results) and the `it-auction-results` dataset as a build gap |
| 5. Stacking | The view treats MACSE and the capacity market as alternatives. Confirm this from the rules (GAP-IT-STACK) before build; the decree's note that MACSE winners keep the 2027 de-rating needs reading |
| 6. Markers | Accept each shot's marker and "What would change it" line, with no Strong marker until the primary documents are opened |
| 7. Interpretations | The it-03 reading (MACSE exists because the capacity market does not pay for shifting energy) and CL-IT-10i |
| 8. Zone count | GAP-IT-ZONES: the repository's "six zones" against the 2021 configuration |
| 9. Stale prose | CF-IT-03: the view thesis, `despite` and the trigger label type 0.67 to 0.53; `docs/briefing-content-2026-10.md` is stale. Not edited here |
| 10. Chinese | Equal meaning for credited capacity, strike-price repayment, time-shifting use and "never added together" |

Build boundary: stop here. No application code, dataset registration, snapshot, model or view change, rendering, build, deployment or G-2 work in this task.

## 12. Sources and claims

Check date for every record: **31 October 2026**. Access in this session: the Terna, ARERA, MASE, GME, Normattiva and trade-press hosts were blocked by the session's network policy, so no document was opened. "Located" means the locator and its content were found by web search on the check date. "Repository record" means the platform's own register (`src/markets/it/sources.js`), which records an earlier opening. Licence-restricted reports are not used. Trade press (pv magazine Italia, 16, 19, 20 and 26 Oct 2026; ESS News, 19 and 20 Oct 2026; QualEnergia; Rinnovabili; ecoblog, 20 and 27 Oct 2026) served only to find primary documents and is not cited as a source.

### Sources

Existing records SRC-IT-01 to 04 are in the [source register](source-register.md); this file adds:

| ID | Publisher · title | Locator | Supports (event) | Access / status |
| --- | --- | --- | --- | --- |
| SRC-IT-05 | ARERA · Deliberazione 103/2019/R/eel, 19 Mar 2019: zone configuration from 1 Jan 2021 | https://www.arera.it/atti-e-provvedimenti/dettaglio/19/103-19 | The zone configuration that applies from 1 January 2021, completing the review begun with 22/2018/R/eel | Located; zone list not seen (GAP-IT-ZONES) |
| SRC-IT-06 | GME · MGP results by zone | https://www.mercatoelettrico.org/en/ (repository record `gme`) | Day-ahead prices cleared by zone; the 2025 South series behind the merchant evidence | Repository record; not reopened |
| SRC-IT-07 | MASE · Decree 259 of 6 Aug 2026, capacity-market rules for delivery 2028 | MASE "Mercato elettrico" page, https://www.mase.gov.it/portale/mercato-elettrico | Rules for the delivery-2028 auction; asked Terna to reassess storage de-rating | Located; exact PDF locator not found |
| SRC-IT-08 | MASE · Decree 327 of 16 Oct 2026 approving amendments to the capacity market's technical provisions (DTF 2) and Annex 4 | Same MASE page; text on the site from 19 Oct 2026; notice in the Gazzetta Ufficiale no. 252 of 29 Oct 2026 | Zonal de-rating for new storage, delivery 2028: four-hour about 40% North and Centre-North, 51% Centre-South, 21% South, Calabria, Sicily and Sardinia; existing, contracted and MACSE-awarded storage keep delivery-2027 factors | Located; values from consistent reports; annex not opened |
| SRC-IT-09 | ARERA · Deliberazione 370/2026/R/eel, 14 Oct 2026 | Expected at https://www.arera.it/atti-e-provvedimenti/dettaglio/26/370-26 (from ARERA's numbering; confirm) | Positive compliance check of Terna's revised DTF 2, limited to the delivery-2028 procedure; de-rating raised for storage as expected authorised capacity grew | Located by citation; URL to confirm |
| SRC-IT-10 | Terna · Capacity market, delivery-2028 auction notice | Under SRC-IT-01, https://www.terna.it/it/sistema-elettrico/mercato-capacita | Auction on 21 Dec 2026; applications 20 Oct to 3 Nov 2026 | Located |
| SRC-IT-11 | Terna · Results of the main auction for delivery 2027 (26–27 Feb 2025) | Under SRC-IT-01; repository record `capacityMarket` | A uniform clearing premium for existing and new capacity; new capacity mostly batteries on fifteen-year contracts | Located; reported new-capacity totals differ (about 500 to 600 MW); bind only after opening |
| SRC-IT-12 | Terna · First capacity-market auctions, delivery 2022 and 2023 (Nov 2019); discipline approved by ministerial decree of 28 Jun 2019 | Under SRC-IT-01 | Reliability-option design: premium per MW, repayment above a strike price set by ARERA from peaking-plant variable cost, fifteen-year contracts for new capacity | Located through reports; decree date to confirm |
| SRC-IT-13 | Legislative Decree 210/2021, Art. 18 | https://www.normattiva.it/ (search "decreto legislativo 8 novembre 2021, n. 210") | Introduces forward procurement of electricity storage capacity | Located by citation in ARERA 247/2023 |
| SRC-IT-14 | ARERA · Deliberazione 247/2023/R/eel, 6 Jun 2023 | https://arera.it/atti-e-provvedimenti/dettaglio/23/247-23 | Criteria and conditions for the storage-capacity procurement system (MACSE) | Located |
| SRC-IT-15 | MASE · Decree 346 of 10 Oct 2024 approving the MACSE rules | https://mase.gov.it/sites/default/files/Archivio_Energia/Archivio_Normativa/dm_346_10.10.2024.pdf (repository record `dm346`) | Ministerial approval of Terna's MACSE rules | Repository record, opened 12 Oct 2026 |
| SRC-IT-16 | Terna · Completed first MACSE auction, 30 Sep 2025 (rev. 10 Oct 2025) | https://www.terna.it/en/media/press-releases/detail/completed-first-macse-auction (repository record `macse`) | Awarded MWh and MW, fourteen projects, clearing prices by area, delivery 2028, fifteen-year term; areas Centro-Sud, Sud e Calabria, Sicilia, Sardegna; bids above four times demand | Repository record, checked 2 Aug 2026 |
| SRC-IT-17 | ARERA · Deliberazione 362/2025/R/eel, 30 Jul 2025 | https://arera.it/atti-e-provvedimenti/dettaglio/25/362-25 | Maximum premium for the first MACSE auction | Located |
| SRC-IT-18 | ARERA · Consultation 283/2026/R/eel, 30 Jul 2026 | https://www.arera.it/fileadmin/allegati/docs/26/283-2026-R-eel.pdf (repository record `arera283`) | Proposed maximum premium for the delivery-2029 auction | Repository record, opened 12 Oct 2026 |
| SRC-IT-19 | ARERA · Deliberazione 332/2026/R/eel, 24 Sep 2026 | https://www.arera.it/fileadmin/allegati/docs/26/332-2026-R-eel.pdf | Maximum premium for the delivery-2029 auction, above the consultation proposal and below the first auction's cap; auction on 24 Nov 2026; oversizing coefficient confirmed | Located; the repository calls it a "reserve premium", the reports "maximum premium" (CF-IT-04) |
| SRC-IT-20 | MASE · Decree of 27 Mar 2026 approving the MACSE rules for delivery 2029; approval of a 16 GWh requirement | MASE page as SRC-IT-07; Terna MACSE FAQ of 7 Jul 2026 | Requirement and area limits for the second auction; the North outside the eligible perimeter | Located through reports only |
| SRC-IT-21 | Terna · Econnextion connection-request data; Terna 2025 Development Plan consultation presentation (hosted by ARERA) | https://www.arera.it/fileadmin/allegati/operatori/pds/25/Presentazione_della_consultazione_pubblica_sul_Piano_di_sviluppo_2025.pdf | Renewable connection requests mainly in the south and the islands; standalone storage the largest share of requests | Located; regional quantities not seen (GAP-IT-QUEUE) |
| SRC-IT-22 | Terna · Tyrrhenian Link and Adriatic Link project pages | Repository records `tyrrhenian`, `adriatic` | Named links and their planned dates | Repository records, checked 2026 |
| REPO-IT-LIVE | This repository at `edcb39c` | `view/markets/it.json`; the briefing built for 2026-10-31; `src/opportunities/summaryData.js`; `src/markets/it/comparison.js` | The live calls, plays, triggers, card and design results | Read in this session |

### Historical nodes (event separate from interpretation)

| Node | Event and date | Source | Why it matters (interpretation) |
| --- | --- | --- | --- |
| H-IT-01 | First capacity-market auctions, November 2019, for delivery 2022 and 2023 | SRC-IT-12 | Italy chose to pay for available capacity years ahead; storage later competes in that market |
| H-IT-02 | New zone configuration in force, 1 Jan 2021 | SRC-IT-05 | A battery's trading price is its zone's |
| H-IT-03 | Legislative Decree 210/2021, Art. 18, 8 Nov 2021 | SRC-IT-13 | A storage-only contract is created beside the capacity market |
| H-IT-04 | Capacity auction for delivery 2027, 26–27 Feb 2025 | SRC-IT-11 | Batteries win most new capacity on fifteen-year contracts |
| H-IT-05 | First MACSE auction, 30 Sep 2025 | SRC-IT-16 | Long batteries in the south and islands on fifteen-year, per-MWh contracts |
| H-IT-06 | Delivery-2028 de-rating decided by zone, 16 Oct 2026 | SRC-IT-08/09 | The capacity line of a new battery now depends on its zone |

### Claims

Existing claims CL-IT-01 to 03 stay in the source register; this script now gives them locators (SRC-IT-11/12 for CL-IT-02; SRC-IT-14/16 for CL-IT-03).

| ID | Claim | Type / scope | Source and locator | Limit | Shots | Status |
| --- | --- | --- | --- | --- | --- | --- |
| CL-IT-04 | Italy's day-ahead market clears a price per zone; the configuration in force since 1 Jan 2021 was set by ARERA 103/2019 | `historical-fact`, `market-rule` | SRC-IT-05; SRC-IT-06 | Zone list not seen | it-01 | Located |
| CL-IT-05 | The capacity market is a reliability option: a premium per credited MW, repayment when prices exceed a strike price, multi-year contracts for new capacity | `market-rule` | SRC-IT-01, SRC-IT-07, SRC-IT-12 | Strike level and stress-hour obligations not extracted | it-02, it-09 | Located |
| CL-IT-06 | The delivery-2027 auction cleared a uniform premium, and new capacity was mostly batteries | `historical-fact` | SRC-IT-11 | New-capacity total differs between reports | it-02, it-08 | Located |
| CL-IT-07 | MACSE follows Art. 18 of D.Lgs. 210/2021, ARERA 247/2023 and DM 346/2024; its first auction on 30 Sep 2025 awarded fifteen-year contracts, delivery 2028, in four southern and island areas | `historical-fact`, `market-rule` | SRC-IT-13 to 16 | Rules not opened | it-03, it-07, it-08 | Located; results in repository record |
| CL-IT-08 | Under MACSE the time-shifting use of contracted energy passes to Terna, which offers it to the market; the owner keeps operating and availability duties | `market-rule` | SRC-IT-02, SRC-IT-14, SRC-IT-15 | Share of proceeds the owner keeps not confirmed | it-08 | Located; clause pending |
| CL-IT-09 | Most renewable and storage connection requests are in the south and the islands | `observed-data` | SRC-IT-21 | Requests are not projects | it-04 | Located; quantities pending |
| CL-IT-10 | On 16 Oct 2026 MASE approved delivery-2028 storage de-rating that differs by zone and applies only to new storage; ARERA had found it compliant on 14 Oct | `historical-fact`, `market-rule` | SRC-IT-07, 08, 09 | Values from reports; annex not opened | it-05, it-11 | Located |
| CL-IT-10i | The decided factor for new four-hour storage in the south and islands is below the 0.53 the play prices, so the call's watched trigger has been met against it | `research-hypothesis` | CL-IT-10; REPO-IT-LIVE | The analyst's reading decides; a contracted project keeps 0.67 | it-05; §0 | Proposed |
| CL-IT-11 | The second MACSE auction is on 24 Nov 2026 for delivery 2029, with a maximum premium set by ARERA 332/2026 | `official-plan` | SRC-IT-19, SRC-IT-20 | Volume and areas reported, not opened | it-07, it-10, it-11 | Located |
| CL-IT-12 | The delivery-2028 capacity auction is on 21 Dec 2026 | `official-plan` | SRC-IT-10 | Announced | it-08, it-11 | Located |
| CL-IT-13 | On the platform's model the capacity route is best at four hours and the MACSE design returns less than the capacity play on the same basis | `model-assumption` | REPO-IT-LIVE | Priced on the delivery-2027 curve; MACSE capture seeded | it-00, it-06, it-07, it-10 | Read |
| CL-IT-14 | The capacity play's merchant line carries most of its revenue and is graded Thin | `model-assumption` | REPO-IT-LIVE; `docs/merchant-lines-plan-2026-10.md` | Settled ruling | it-09, it-11 | Read |

### Conflicts, gaps and the dataset needed

| ID | Item | Affects | Treatment |
| --- | --- | --- | --- |
| CF-IT-01 | The call's trigger appears resolved, with factors differing from the 0.53 the play and its action price; the south and islands are lowest for new storage | it-00, it-05, it-06, it-11; the call | Flag at the top of the PR; analyst rules at G-1; no call change |
| CF-IT-02 | Two return bases: the card's investment-summary hold against the briefing's design-grid hold (typed in `play.why` and the thesis) | it-00, it-10 | Bind each to its own field with a basis label; never mix |
| CF-IT-03 | Typed figures in the view thesis, `despite` and trigger label are now stale against the decision | Copy only | Not copied; flagged |
| CF-IT-04 | `src/markets/it/data.js` calls the delivery-2029 figure a "reserve premium"; ARERA 332/2026 is reported as setting the maximum premium | it-10 | Use "maximum premium" until the resolution is opened |
| GAP-IT-OPEN | No primary document could be opened in this session (network policy) | All shots | Ceiling Fair; open each locator before G-2 |
| GAP-IT-AUCTIONS | No Italian dataset is registered; Chart-IT-FORK needs `it-auction-results` | it-05, it-08 | Build gap; Example fallback |
| GAP-IT-ZONES | Zone count: six in the repository, seven expected under the 2021 configuration | it-01 | Bind names; confirm |
| GAP-IT-STACK | Exclusivity of MACSE and the capacity market, the owner's retained share of MACSE proceeds and the oversizing coefficient, from the rules | it-03, it-07, it-08 | Qualitative until opened |
| GAP-IT-STRIKE | Strike-price level and stress-hour obligations | it-02, it-09 | Qualitative |
| GAP-IT-QUEUE | Regional connection-request quantities | it-04 | Stacked symbols, not to scale |
