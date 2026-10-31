# ERCOT (Texas): Six-Chapter Storyboard

Pack: BESS-IX-2026-10-30; ERCOT research and script, 31 October 2026; shot layout v1.2
Status: `proposed` script and bilingual page-text draft; **G-1 analyst sign-off pending**; steps 1 and 2 only; build nothing
Navigation: [Master plan](README.md) | [ERCOT story card](market-narratives.md#3-eighteen-market-candidate-story-cards) | [Evidence specification](evidence-and-content-specification.md) | [Sources and claims](#10-sources-and-claims) | [Ruling 5A](../open-calls-plan-2026-10-31.md#5-ercot-add-a-real-dated-review-leave-toll-underwriting-gated) | [Germany format](germany-storyboard.md)

## 1. Scope, argument and reading route

**Explain the current fund call: Situational, and only through a toll that is already signed at a known price.** ERCOT is the easiest market on the platform to connect to, and it pays no battery for capacity. The reserve and scarcity revenue that paid the first batteries has been competed away as the fleet grew. A toll is the only secured route, the model's toll is an assumption, and even with it the reference case falls short of the fund's target. So the price of a signed toll decides the case.

Allocation `ercot`; physical boundary: the ERCOT grid, which serves most of Texas and is not synchronously connected to the rest of the US grid. Default lens `infraFund`. `reviewedAgainst`: REPO-ERCOT-LIVE, `main` at `edcb39c` (PR #88, the 31 October rulings), evaluated 31 October 2026: verdict `opportunistic`, displayed **Situational / 择机投入**; play **`ercot-toll-2h`** ("Toll · 2h"), route `toll`, two hours, entry `ready-to-build`; play evidence `strong`; next event `ercot-january-2027-mora`, expected 6 November 2026 under ruling 5A. The view's thesis is the anchor, not `docs/briefing-content-2026-10.md`: fastest to connect, hardest to get paid.

The argument, in order:

1. ERCOT is a grid of its own. Small direct-current ties are its only links to neighbours, and Texas regulates it, so it could choose its own market design (CL-ERCOT-02).
2. It chose to pay for energy and reserves, not capacity. Reliability is meant to be paid through scarcity prices under a cap, which was lowered after Winter Storm Uri. The one capacity-style credit the regulator adopted was set aside in December 2024 (CL-ERCOT-03).
3. Connect-and-manage lets plants connect without first paying for wider network upgrades, so entry is fast for everyone (CL-ERCOT-04).
4. After Uri, ERCOT bought far more reserves, and batteries earned mainly by selling them until 2024 (CL-ERCOT-06).
5. Batteries flooded in; reserve prices, revenue per kilowatt and scarcity hours all fell. The market monitor says so in terms (CL-ERCOT-05, CL-ERCOT-07 to CL-ERCOT-09).
6. Nothing pays a battery to be available, and the market revenue left is shrinking and lumpy. The model's toll is an assumption that still falls short of the fund's target. Only a toll already signed, at a price that can be read and tested, can make the case (CL-ERCOT-11).

Comprehension check: from the story alone, the reader can say why the play is a two-hour battery bought only with an executed toll. ERCOT pays no one for capacity and lets competitors in fast; reserve and scarcity revenue has been competed away; the modelled toll is an assumption that still falls short; so the signed toll's price decides.

**Competing explanation, kept on the page as "what would change it":** 2024 and 2025 were years of ample reserves. The market monitor says such years "occur often" and that tighter years, such as 2021 and 2023, pay well above the cost of new entry; load growth, mostly data centres, could tighten the market again (CL-ERCOT-10). ERCOT's preliminary response disputes parts of the monitor's view of net revenue (SRC-ERCOT-18). This explains why merchant revenue cannot be ruled out. It does not make it underwritable.

**Disconfirming condition:** a run of tight years, a capacity or reliability payment a battery can earn (storage's role in the new reliability reserve is unsettled), or an executed toll whose disclosed price clears the fund's target. Any of these reopens the call. Research does not re-grade it.

Flags for the analyst, detailed in §10 and the PR; none changes the call: CF-ERCOT-03 (the verdict says the model "loses money", while the card's all-equity IRR is slightly positive and far below target), CF-ERCOT-04 (the thesis's percentage and the play action's comparator rest on a subscription index), CF-ERCOT-05 (a grade reason's data-centre pause was not found in a primary source) and CF-ERCOT-06 (the story card's signature chart is replaced).

| Chapter / page heading EN · 简体中文 | Shots | What the reader can explain afterwards |
| --- | --- | --- |
| Opening · 先看投资判断 | ercot-00 | The live call, the play and the next action |
| Origins · 系统起点 | ercot-01 | Why a grid apart could choose its own market design |
| Historical choices · 历史选择 | ercot-02–04 | Pricing only energy and reserves; connect-and-manage; why reserves paid the first batteries |
| Today's tensions · 当下矛盾 | ercot-05–07 | The battery influx, collapsing reserve prices (signature chart) and rare scarcity |
| Add a battery · 加入电池 | ercot-08–09 | What a battery of the play's duration sells, and why the play is a toll at that duration |
| Who pays · 谁来付钱 | ercot-10–11 | Market payment routes against one private contract; why only an executed toll at a known price counts |
| The investment · 回到投资 | ercot-12 | What could weaken the case, the next public event, and where the numbers live |

Thirteen shots, about five minutes. Shared fixed-view isometric SVG kit, off-white and deep green, plain HTML copy and accessible 2D equivalents. Maps are schematic. Scroll and chapter links work without animation. No model execution, dispatch engine or underwriting control sits inside the story.

### Rules for every shot

- **Figures:** every page figure uses a named `‹bound›` token. Financial tokens resolve to fields the story card and market page already read; observed and historical tokens resolve to the dated records in §10. Page text may type years and dates, never another figure. The view's `thesis` and the play's `why` are never copied: both carry a figure from a subscription index (CF-ERCOT-04).
- **Toll:** never show, imply or range a toll price. The modelled toll is the model's assumed route, priced from a proxy, not a signed contract and not a disclosed ERCOT price. Wherever secured revenue appears, name its tenor and that merchant revenue follows.
- **Controls:** only era, year, product, teaching preset, evidence drawer and hotspot. Teaching controls never change the case. Back, refresh and a language switch keep the reader's place, as in the WA build.
- **Evidence:** one marker per shot, in the site's fixed strings, followed by "What would change it:" / "会改变判断的证据：". The opening inherits its card's marker. Authoring checks and status never reach the page.
- **Time and rights:** observations solid, adopted plans and pending rules dashed, teaching values tagged **Example / 示例**. Original diagrams only; link documents rather than redistributing their figures. Reserve prices (per MW held ready, per hour) and energy prices (per MWh) never share an axis.
- **Two languages:** all page text below is drafted in English and Simplified Chinese with the same meaning. Source titles keep their original language.

### Bound fields

Values at check are given only so the analyst can review the script against the live case. They are never typed into page text; if the play changes, the card updates itself and `reviewedAgainst` flags the story.

| Token | Field the story card or market page already reads | At check, 31 Oct 2026 (review only) |
| --- | --- | --- |
| ‹bound: call› | `CALLS[row.call]`, the call tag in the story shell's `playCard` (`src/experience/story/shell.js`) | Situational / 择机投入 (`opportunistic`) |
| ‹bound: play› | `playTitle(row.play, row.stage)` | Toll · 2h · ready-to-build / 租赁 · 2小时 · 具备开工条件 |
| ‹bound: card figures› | The shell card's `metric(T.baseIrr, returnPct(row.investment.holdIRR), marginText(row))` | Base all-equity IRR 0.5% · −9.61 pp vs target |
| ‹bound: hold IRR› | `returnPct(row.investment.holdIRR)`: all-equity, nominal after project tax, as the Overview's `currentThesis` states | 0.5% |
| ‹bound: margin to target› | `marginText(row)` in `src/experience/decision.js` | −9.61 pp vs target / 较目标-9.61个百分点 |
| ‹bound: next action› | `row.play.action.text` | Read the January 2027 MORA on 6 November…; engage only with an executed toll… (bilingual) |
| ‹bound: play evidence› | `row.evidence`, through the site's marker labels | Strong evidence / 证据充分 |
| ‹bound: play duration› | `row.play.hours` | 2 |
| ‹bound: secured share› | `share(row.investment.secured)`, the first-year denominator the Overview uses | 100% |
| ‹bound: secured tenor› | `row.investment.securedYears` | 7 |
| ‹bound: next event› / ‹bound: next event date› | `row.decision.event.label` / `.expected`: the trigger in the fund verdict's `changesIf` | January 2027 MORA: review winter evening adequacy and battery availability · 2026-11-06 |
| ‹bound: duration grid› | `HOME_BRIEFING.grids.ercot.hours` | 1, 2, 4, 8 |
| ‹bound: design cell value› | `HOME_BRIEFING.grids.ercot.cells[].value` and `best`, with the grid's existing formatter | Toll 2h best; merchant cells lower at every duration; toll 1h, 4h and 8h not priced |

## 2. Opening

### ercot-00 — The call · 投资判断

| Item | Shot specification |
| --- | --- |
| Scene | Small static thumbnail: the shared kit's Texas outline with the grid drawn as a closed island and short dashed DC links; no animation |
| Feedback | None; this shot is the conclusion. A text alternative carries the same card fields and copy |
| Evidence and chart | REPO-ERCOT-LIVE; CL-ERCOT-11. The story shell's existing play card, with its marker ‹bound: play evidence›; no new chart |
| Authoring check | Reuse the card. Never paste the view's `thesis` or the play's `why` (CF-ERCOT-04). The card's IRR is slightly positive and far below target while the thesis says the model "loses money"; the line beneath says "falls short of the fund's target", which is true on every basis the card shows (CF-ERCOT-03). The toll is the model's assumed route, never a signed contract, and no toll price, range or proxy appears anywhere in the story. Second button opens `/markets/ercot#bankable` |
| Mobile | Full-width card, one line beneath, two buttons; no scene before the conclusion |
| Status | `sourced` / `model-assumes-route`, not `contract-verified`; G-1 pending |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What is the call here, and what would make it investable? | 这里的投资判断是什么？怎样才值得投资？ |
| Copy | The existing play card: ‹bound: call› · ‹bound: play› · ‹bound: card figures› · ‹bound: next action›. Beneath it: "Fastest to connect, hardest to get paid. Even with a toll, the reference case falls short of the fund's target, so only a toll already signed at a known price can make a case." | 沿用现有方案卡：‹bound: call› · ‹bound: play› · ‹bound: card figures› · ‹bound: next action›。卡片下方一行：“并网最快，回款最难。即便有租赁，参考情景仍达不到基金的目标回报；只有已经签署、价格明确的租赁，才可能让投资成立。” |
| Marker | The play's own marker, already on the card | 沿用方案卡上该方案自身的证据标记 |
| Controls | Start the story · Go to the investment case | 开始阅读 · 前往投资方案 |

## 3. Origins

### ercot-01 — A grid of its own · 自成一体的电网

| Item | Shot specification |
| --- | --- |
| Scene | The platform's existing Texas outline (Natural Earth admin-1, `src/markets/ercot/tx-boundary.json`, ASSET-TX-OUTLINE) with the ERCOT grid drawn inside it as a schematic network and no footprint line. Neighbouring grids to the north and south-west in a neutral tone; two DC ties to the Southwest Power Pool and two to Mexico as short dashed connectors; no AC line crosses the edge; fixed view |
| Feedback | "Links to neighbours" highlights the four ties and their combined ‹bound: DC tie capacity›. "Who sets the rules" labels the Public Utility Commission of Texas. The outline stays fixed; no flow arrows |
| Evidence and chart | CL-ERCOT-02; SRC-ERCOT-01 §II.H p. 36 (the ties and their transfer capability; average net flow small); SRC-ERCOT-12 (FERC: not synchronously interconnected; search result, not opened); SRC-ERCOT-13 (the market monitor: ERCOT is regulated by the PUCT) |
| Authoring check | ERCOT serves most, not all, of Texas: never colour the whole state as ERCOT and draw no footprint line (GAP-ERCOT-MAP). "Not synchronously connected" is not "no connection": the DC ties exist. Do not say "no federal oversight": national reliability standards still apply; the claim is about who regulates the market. Tie capacity only through its token |
| Mobile | Same schematic; stacked legend; both toggles; the text reads without the map |
| Status | `sourced`, `market-rule`; map reuse and the no-footprint treatment pending G-1 |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Which grid is this, and what sets it apart? | 这是哪张电网？它有何与众不同？ |
| Copy | ERCOT runs most of Texas as a grid of its own. It is not synchronously connected to the rest of the US grid: a few direct-current ties, ‹bound: DC tie capacity› in all, link it to its neighbours. Texas, through its Public Utility Commission, regulates ERCOT and its market. | ERCOT将得州大部分地区作为一张独立电网运行。它与美国其他电网没有同步连接，仅靠几条直流联络线与邻近电网相连，总容量为‹bound: DC tie capacity›。ERCOT及其市场由得州通过公用事业委员会监管。 |
| Meaning | A grid with its own regulator could choose its own market design: pay only for energy and reserves, and connect new plants fast. | 拥有自己监管机构的电网，可以自行选择市场设计：只为电能量和备用付费，并让新电源快速并网。 |
| Marker | Strong evidence. What would change it: a new synchronous link to a neighbouring grid, or a change in who regulates ERCOT's wholesale market. | 证据充分。会改变判断的证据：与邻近电网新建同步联络，或ERCOT批发市场的监管归属发生变化。 |
| Controls | ERCOT's grid · Links to neighbours · Who sets the rules | ERCOT电网 · 与邻近电网的联络 · 谁制定规则 |
| Labels | Texas · ERCOT's grid (schematic) · Direct-current tie · Southwest Power Pool · Mexico · Public Utility Commission of Texas | 得克萨斯州 · ERCOT电网（示意） · 直流联络线 · 西南电力联营 · 墨西哥 · 得州公用事业委员会 |

## 4. Historical choices

### ercot-02 — Paid for energy, not for capacity · 只为电能量付费，不为容量付费

| Item | Shot specification |
| --- | --- |
| Scene | Same frame with the shared six-node timeline (H-ERCOT-01–06); this shot highlights H-ERCOT-01, -03, -04 and -06. A schematic price lid (the offer cap) and a scarcity curve rising toward it sit above the grid; selecting a node changes one layer |
| Feedback | Each node opens Constraint · Choice · What remains · Effect today, with event lines and reading lines in separate blocks. H-ERCOT-04 is drawn as a closed branch, "Adopted, then not taken forward", not as a dashed future |
| Evidence and chart | CL-ERCOT-03; SRC-ERCOT-01 pp. 2, 7–8, 48, 99–100; SRC-ERCOT-06 pp. 1, 4–5; SRC-ERCOT-07; SRC-ERCOT-08 (Items 47 and 48; minutes of 19 December 2024, item 17); SRC-ERCOT-19 for the ORDC's start month (search result) |
| Authoring check | "Energy and reserves only" means no payment for capacity, not no reliability policy: ERCOT buys reserves, runs emergency programmes and is adding a reliability reserve (ercot-12). The credit was adopted in January 2023 and set aside by the regulator on 19 December 2024, not rejected by the legislature. The ORDC adder ended in December 2025 and reserve demand curves now price scarcity, so the copy says "scarcity prices", not "the ORDC". Cap values only through tokens |
| Mobile | Vertical node list, text first, one small diagram; dates as text |
| Status | Events `historical-fact`, `sourced` (primary, opened); readings `proposed`; G-1 pending |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | How does a market without capacity payments pay for reliability? | 没有容量付费的市场，如何为可靠性付费？ |
| Copy | ERCOT pays for energy and reserves, not for capacity. Reliability is meant to be paid through scarcity prices, which rise when reserves run short, up to a cap of ‹bound: offer cap›. The regulator adopted a reliability credit in 2023, then decided on 19 December 2024 not to take it forward. | ERCOT为电能量和备用付费，不为容量付费。可靠性本应通过稀缺电价获得回报：备用不足时电价上升，上限为‹bound: offer cap›。监管机构曾于2023年通过一项可靠性信用机制，又于2024年12月19日决定不再推进。 |
| Meaning | Nothing in this market pays the play's battery for being available; it earns only when it sells energy or reserves. | 这个市场不会因本方案的电池“随时可用”而付钱；它只有在出售电能量或备用时才有收入。 |
| Marker | Strong evidence. What would change it: the regulator adopting a capacity or reliability payment that a battery can earn. | 证据充分。会改变判断的证据：监管机构推出电池能够获得的容量或可靠性付费。 |
| Controls | Select a node · Constraint · Choice · What remains · Effect today | 选择节点 · 约束 · 选择 · 遗留 · 今日影响 |

Timeline nodes (page text, shared with ercot-04). Each node's date displays through ‹bound: history node›; dates and sources are in [the node records](#historical-nodes--events-separate-from-interpretation).

| Node | Field | English | 简体中文 |
| --- | --- | --- | --- |
| H-ERCOT-01 · 2014 · Scarcity priced through a reserve curve | Constraint | A market without capacity payments had to pay enough in tight hours to keep and attract plants. | 没有容量付费的市场，必须在供应紧张时付出足够高的价格，才能留住并吸引电厂。 |
| | Choice | Add a price adder that rises automatically as operating reserves fall. | 引入随运行备用下降而自动上升的价格加价。 |
| | What remains | Scarcity is priced inside energy and reserve prices; since December 2025, through reserve demand curves. | 稀缺性计入电能量与备用价格；自2025年12月起改由备用需求曲线定价。 |
| | Effect today | A battery earns scarcity value only in the hours when reserves run short. | 电池只有在备用短缺的时段才能获得稀缺价值。 |
| H-ERCOT-02 · February 2021 · Winter Storm Uri | Constraint | Extreme cold cut supply as demand soared, and ERCOT ordered outages for days. | 极寒天气使供给锐减而需求激增，ERCOT连续数日下令停电。 |
| | Choice | Run the grid more cautiously, with far more reserves held ready. | 以更审慎的方式运行电网，保持多得多的备用待命。 |
| | What remains | Larger reserve purchases. | 更大规模的备用采购。 |
| | Effect today | Reserves became the first market for batteries. | 备用成为电池的第一个市场。 |
| H-ERCOT-03 · December 2021 · A lower price cap | Constraint | After the storm, the regulator found the old cap a liability for market participants and customers. | 寒潮之后，监管机构认为原有上限已成为市场参与者和用户的负担。 |
| | Choice | Lower the offer cap from ‹bound: old offer cap› to ‹bound: offer cap›, from 2022, and keep the market's design. | 将报价上限由‹bound: old offer cap›降至‹bound: offer cap›，自2022年起执行，并保留市场设计。 |
| | What remains | The lower cap. | 较低的上限。 |
| | Effect today | Scarcity hours pay less than they once could. | 稀缺时段的收益上限低于从前。 |
| H-ERCOT-04 · January 2023 to December 2024 · A reliability credit, adopted then set aside | Constraint | After the storm, pressure to pay for supply that can run on demand. | 寒潮之后，各方要求为可按需出力的电源付费。 |
| | Choice | Adopt a performance credit mechanism in January 2023 and wait for the legislature; on 19 December 2024, adopt staff's recommendation not to take it forward. | 2023年1月通过绩效信用机制并等待州议会审议；2024年12月19日采纳工作人员建议，不再推进。 |
| | What remains | No capacity payment. | 没有容量付费。 |
| | Effect today | A battery earns from energy, reserves or a private contract. | 电池的收入来自电能量、备用或私人合同。 |
| H-ERCOT-05 · 10 June 2023 · A new reserve, ECRS | Constraint | ERCOT wanted more reserve that can restore frequency within ten minutes. | ERCOT需要更多能在十分钟内恢复频率的备用。 |
| | Choice | Add the ERCOT Contingency Reserve Service, almost doubling the ten-minute reserves bought. | 新增ERCOT应急备用服务（ECRS），十分钟备用采购量几乎翻倍。 |
| | What remains | A larger reserve market. | 更大的备用市场。 |
| | Effect today | Its prices were high at first, then fell as batteries crowded in. | 其价格起初很高，随电池大量涌入而回落。 |
| H-ERCOT-06 · 5 December 2025 · Real-time co-optimisation | Constraint | Reserves were bought only a day ahead. | 备用原先只在日前市场采购。 |
| | Choice | Buy energy and reserves together every five minutes, and shorten the energy a battery must hold behind some reserves. | 每五分钟同时采购电能量与备用，并缩短部分备用要求电池预留电量的时长。 |
| | What remains | More resources can offer each reserve. | 每种备用都有更多资源可以报价。 |
| | Effect today | Better dispatch for one battery; more competition for the same reserve. | 单个电池调度更灵活，同一份备用的竞争更激烈。 |

### ercot-03 — Connect first, manage later · 先并网，后管理

| Item | Shot specification |
| --- | --- |
| Scene | Same frame; new solar and battery symbols plug in at substations; congestion drawn as a dimmer on a plant (curtailment), not as a queue. A second panel, "Elsewhere in the US", shows plants waiting behind upgrade work. Both panels schematic |
| Feedback | The toggle compares who pays for wider network upgrades and the average time to a signed interconnection agreement. Only ERCOT's figure appears (‹bound: ERCOT months to agreement›); the other panel says "longer on average", with no invented number |
| Evidence and chart | CL-ERCOT-04; SRC-ERCOT-10 slides 26–27, 44 and 47. Rule text (ERCOT Planning Guide §5; PUCT transmission rules) not opened (GAP-ERCOT-RULE) |
| Authoring check | The figure is an average from request to signed agreement for requests since 2010; it is not time to commercial operation and not a promise. Generators still pay for their own interconnection facilities and fees. "Connect and manage" means no wait for wider network upgrades, with congestion then handled by redispatch and curtailment, so a connected battery can be held back. Fast entry is the point: it lets competitors in too |
| Mobile | Two stacked panels with identical labels; text first |
| Status | `market-observation`, `sourced` (Berkeley Lab, opened); rule text `proposed` until opened; reading `proposed` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why could so many batteries connect so quickly? | 为什么这么多电池能这么快并网？ |
| Copy | ERCOT lets a new plant connect without first paying for wider network upgrades, then manages congestion by redispatching or curtailing it. Its requests reached a signed interconnection agreement in ‹bound: ERCOT months to agreement› on average, faster than comparable requests elsewhere in the US. | ERCOT允许新电源在无需先承担更大范围电网升级费用的情况下并网，之后再通过再调度或限电管理阻塞。平均而言，其并网申请在‹bound: ERCOT months to agreement›内即可签署并网协议，快于美国其他地区的同类申请。 |
| Meaning | Fast connection gets the play's battery to market sooner, and every competitor too. | 快速并网让本方案的电池更早进入市场，也让每一个竞争者同样如此。 |
| Marker | Fair evidence. What would change it: ERCOT's interconnection rules read at source, or queue data showing its timelines lengthening. | 证据尚可。会改变判断的证据：直接核读ERCOT的并网规则，或排队数据显示其并网周期变长。 |
| Controls | ERCOT · Elsewhere in the US | ERCOT · 美国其他地区 |
| Labels | Connect, then manage congestion · Upgrade first, then connect · Curtailed when congested · Schematic | 先并网，再管理阻塞 · 先升级，后并网 · 阻塞时限电 · 示意 |

### ercot-04 — After the storm, more reserves · 寒潮之后，备用加码

| Item | Shot specification |
| --- | --- |
| Scene | Same grid on a winter night for H-ERCOT-02, with outage blocks drawn schematically; then reserve blocks stack beside the grid for H-ERCOT-05, and battery symbols step in to fill them. Quantities qualitative |
| Feedback | Highlights H-ERCOT-02 and H-ERCOT-05 on the shared timeline. "Who supplied it" shows batteries and gas plants as symbols, with no shares |
| Evidence and chart | CL-ERCOT-06; SRC-ERCOT-04 p. iv (Uri); SRC-ERCOT-03 p. 1 (conservative posture since July 2021), p. 24 (reserve procurement after Uri), p. viii (ECRS almost doubled ten-minute reserves), p. ix (from 10 June 2023); SRC-ERCOT-01 p. 23 (before 2024, batteries took part mainly through reserves) |
| Authoring check | Events: the storm, the larger reserve purchases and ECRS. Reading: post-storm reserve buying created the batteries' first revenue pool; this is proposed, and the monitor supports its two halves separately. The monitor calls ERCOT's reserve volumes oversized and ECRS's first months "artificial" scarcity; attribute the word if it is ever used. No outage counts or casualty figures |
| Mobile | Vertical nodes; one diagram |
| Status | Events `sourced` (opened); reading `proposed`; G-1 pending |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Where did the first batteries earn their money? | 第一批电池靠什么赚钱？ |
| Copy | After Winter Storm Uri in 2021, ERCOT ran the grid more cautiously and bought far more reserves. A new reserve product, ECRS, began on 10 June 2023. Batteries respond almost instantly, and until 2024 they earned mainly by selling these reserves. | 2021年Uri冬季风暴之后，ERCOT以更审慎的方式运行电网，采购的备用大幅增加。新的备用品种ECRS于2023年6月10日启动。电池几乎能即时响应，在2024年之前主要靠出售这些备用赚钱。 |
| Meaning | The first batteries were paid for standing ready, and that pay depended on how few batteries there were. | 第一批电池靠“随时待命”获得报酬，而这份报酬取决于当时电池之少。 |
| Marker | Fair evidence. What would change it: ERCOT's record showing the larger reserve purchases had a cause other than the storm. | 证据尚可。会改变判断的证据：ERCOT的记录显示备用采购增加另有原因，而非寒潮所致。 |
| Controls | The storm · A new reserve · Who supplied it | 寒潮 · 新增备用 · 由谁提供 |
| Labels | Outages · Reserves bought · Batteries · Gas plants · Schematic | 停电 · 采购的备用 · 电池 · 燃气电厂 · 示意 |

## 5. Today's tensions

### ercot-05 — The batteries arrived · 电池蜂拥而至

| Item | Shot specification |
| --- | --- |
| Scene | Same grid; battery symbols multiply at substations as the year control advances, schematic and not to scale; the upper panel of Chart-ERCOT-AS (installed battery power by year) sits beside the scene |
| Feedback | The year control updates the symbols and highlights that year on the chart; values from ‹bound: battery MW by year› |
| Evidence and chart | CL-ERCOT-05; SRC-ERCOT-01 pp. ii and 21–22; SRC-ERCOT-02 p. 22; SRC-ERCOT-03 p. v; SRC-ERCOT-05 p. ii; REPO-ERCOT-LIVE (`gridScarcity` reason: no auction or cap on storage requests); Chart-ERCOT-AS upper panel; CF-ERCOT-02 |
| Authoring check | Installed power is not available reserve or stored energy; duration is its own token. One series and one definition for every year (CF-ERCOT-02). Symbols are not sites |
| Mobile | Chart full width; year buttons; readable data table |
| Status | `observed-data`, `sourced`; numeric production blocked by GAP-ERCOT-AS |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | How fast did batteries arrive? | 电池来得有多快？ |
| Copy | Battery capacity on ERCOT's grid grew from ‹bound: battery MW start› at the end of 2021 to ‹bound: battery MW latest› at the end of 2025, while average duration rose to ‹bound: fleet average duration›. Nothing in the market capped how many could enter. | ERCOT电网的电池装机，从2021年底的‹bound: battery MW start›增至2025年底的‹bound: battery MW latest›，平均时长升至‹bound: fleet average duration›。市场中没有任何机制限制进入的数量。 |
| Meaning | Every new battery competes with the play's battery for the same reserves and the same price spreads. | 每一个新电池，都在与本方案的电池争夺同样的备用和同样的价差。 |
| Marker | Strong evidence. What would change it: ERCOT's own installed-capacity series differing materially from the market monitor's year-end figures. | 证据充分。会改变判断的证据：ERCOT自身的装机序列与市场监测机构的年末数据存在实质差异。 |
| Controls | 2021 · 2022 · 2023 · 2024 · 2025 | 2021 · 2022 · 2023 · 2024 · 2025 |
| Labels | Installed battery power · MW · End of year · Schematic, not to scale | 电池装机功率 · MW · 年末 · 示意，未按比例 |

### ercot-06 — Reserve prices fell · 备用价格随之下跌 (signature chart · 核心图表)

| Item | Shot specification |
| --- | --- |
| Scene | **Signature chart Chart-ERCOT-AS**, full width: the upper panel is installed battery power by year (as in ercot-05); the lower panel is the annual average day-ahead reserve price, aligned by year, with a product selector. 2021 values are off scale and labelled. A small calm grid thumbnail |
| Feedback | Product selector; the crosshair shows year, MW and price from ‹bound: battery MW by year› and ‹bound: reserve price by year›; the caption names the source table. One line under the chart gives the monitor's revenue-per-kilowatt change; there is no second chart |
| Evidence and chart | CL-ERCOT-07, CL-ERCOT-08; SRC-ERCOT-01 p. 40 (Figure 25 and its table), pp. 22–23 (quotes and the revenue change), p. 3 (reserve cost per MWh of load); CF-ERCOT-01; contract in [§9](#signature-chart-chart-ercot-as); GAP-ERCOT-AS |
| Authoring check | Reserve prices are per MW held ready, per hour (the monitor prints "$ per MWh"); never compare them with energy spreads or draw them on an energy axis. Two panels, two axes, no lines crossing between them. Every year from one report vintage (CF-ERCOT-01). A price is not captured revenue; the revenue line uses the monitor's own normalised measure. Prices did not all fall from 2022 to 2023, when ECRS began, so the copy dates the fall from 2023. No log scale. The lower panel is a market price series and awaits the analyst's price-data rights review |
| Mobile | Panels stacked, selector above, units always visible; accessible table |
| Status | `observed-data`, `sourced` (opened); numeric production `blocked`, `rights-unresolved` until GAP-ERCOT-AS and the price-data review close; until then an unscaled Example |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What happened to reserve prices as batteries arrived? | 电池大量进入后，备用价格发生了什么？ |
| Copy | They fell steeply. From 2023 to 2025 the average price of responsive reserve fell from ‹bound: RRS price 2023› to ‹bound: RRS price 2025›, and every other reserve product fell too. ERCOT's market monitor puts it plainly: as batteries flooded these markets, prices fell. Revenue per kilowatt of battery fell by ‹bound: revenue per kW change› in 2025 alone. | 大幅下跌。2023年至2025年，响应备用的年均价格从‹bound: RRS price 2023›降至‹bound: RRS price 2025›，其他各类备用的价格也都下跌。ERCOT的市场监测机构说得很直白：电池涌入这些市场，价格随之下跌。仅2025年，每千瓦电池的收入就下降了‹bound: revenue per kW change›。 |
| Meaning | The reserve income that paid the first batteries cannot carry the play's case. | 曾为第一批电池带来收入的备用，已不能支撑本方案的投资逻辑。 |
| Marker | Strong evidence. What would change it: ERCOT buying materially more reserves, or the market monitor revising its price table. | 证据充分。会改变判断的证据：ERCOT大幅增加备用采购量，或市场监测机构修订其价格表。 |
| Controls | Responsive reserve · ECRS · Regulation up · Regulation down · Non-spinning reserve · How measured | 响应备用 · ECRS · 上调调频 · 下调调频 · 非旋转备用 · 如何计算 |
| Labels | Installed battery power · MW · Average day-ahead reserve price · $ per MW per hour · 2021 off scale: Winter Storm Uri | 电池装机功率 · MW · 日前备用年均价格 · 美元/MW/小时 · 2021年超出刻度：Uri冬季风暴 |
| Caption | Annual averages of day-ahead clearing prices. Source: Independent Market Monitor for ERCOT, 2025 State of the Market Report, Figure 25. | 日前出清价格年均值。来源：ERCOT独立市场监测机构《2025 State of the Market Report》图25。 |

### ercot-07 — Scarcity became rare · 稀缺时刻越来越少

| Item | Shot specification |
| --- | --- |
| Scene | Same grid on a summer evening; a reserves gauge sits high; scarcity flashes are rare. The "A tight year" preset adds flashes and is tagged Example, with no numbers |
| Feedback | "A recent year" shows ‹bound: ORDC hours› and ‹bound: ORDC adder› for 2025 as text cards; "A tight year" changes the drawing only |
| Evidence and chart | CL-ERCOT-09, CL-ERCOT-10; SRC-ERCOT-01 pp. ii–iii, 6–8, viii, 99–103 |
| Authoring check | The ORDC adder ended in December 2025; reserve demand curves now price scarcity, so the copy says "scarcity pricing". A tight year is possible (the monitor names 2021 and 2023), so never say scarcity is gone: the point is that it is rare and unpredictable, which is why it cannot be underwritten. Load growth is a queue, not committed demand |
| Mobile | Gauge, then two cards |
| Status | `observed-data`, `sourced` (opened); reading `proposed`, with the monitor's own reading cited |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Does this market still pay for scarcity? | 这个市场还会为稀缺付费吗？ |
| Copy | Rarely. With more batteries and solar and little extra peak demand, reserves stayed ample. In 2025 scarcity pricing was active for only ‹bound: ORDC hours› and added ‹bound: ORDC adder› to the average real-time price, the least since it began in 2014. A tight year can still bring high prices, but no one can say when. | 很少了。电池和光伏增加，而峰值负荷增长有限，备用一直充裕。2025年，稀缺定价仅在‹bound: ORDC hours›内生效，使实时均价仅增加‹bound: ORDC adder›，为2014年启用以来最低。偏紧的年份仍可能带来高价，但无人能预知何时出现。 |
| Meaning | Scarcity revenue is real but rare and unpredictable, so it cannot be underwritten; that is why the play needs a contracted fee. | 稀缺收益确实存在，但罕见且难以预测，无法作为承销依据；这正是本方案需要合同固定费用的原因。 |
| Marker | Strong evidence. What would change it: a run of tight years, from extreme weather or fast load growth, that brings scarcity pricing back. | 证据充分。会改变判断的证据：极端天气或负荷快速增长带来连续偏紧的年份，使稀缺定价重新频繁出现。 |
| Controls | A recent year · A tight year (Example) | 近期年份 · 偏紧年份（示例） |
| Labels | Reserves · Scarcity price · Example | 备用 · 稀缺电价 · 示例 |

## 6. Add a battery

### ercot-08 — What the battery can sell · 电池能卖什么

| Item | Shot specification |
| --- | --- |
| Scene | Station cutaway; an Example 100 MW battery at ‹bound: play duration› hours; a schematic day with solar at midday and morning and evening ramps. Two modes: "Move energy" and "Hold a reserve"; holding a reserve shades the energy it locks up |
| Feedback | Selecting a reserve shows how long the battery must hold energy behind its offer (‹bound: reserve duration rules›); everything tagged Example; no financial effect |
| Evidence and chart | CL-ERCOT-12; SRC-ERCOT-01 p. 21 (battery fundamentals), p. 23 (shift to arbitrage; cheap midday charging), pp. 42–43 and A-3 (duration rules). No new dispatch calculation |
| Authoring check | Duration rules only through the token; teaching values only; state of charge is qualitative; no revenue estimate. The Non-Spin rule and the new reliability reserve's statutory duration are different things. The same MW and MWh cannot be sold twice; no stacking at standalone maxima |
| Mobile | Static cutaway; mode cards below |
| Status | `sourced`, `teaching-example` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What can a ‹bound: play duration›-hour battery sell here? | ‹bound: play duration›小时电池在这里能卖什么？ |
| Copy | It can charge when solar floods the middle of the day and discharge into the morning and evening ramps, or hold its power ready as a reserve. Each upward reserve requires the battery to keep energy behind its offer: ‹bound: reserve duration rules›. The same megawatts cannot be sold twice. | 它可以在中午光伏大发时充电，在早晚负荷爬坡时放电；也可以把功率作为备用保持待命。每种上调备用都要求电池为其报价预留电量：‹bound: reserve duration rules›。同样的兆瓦不能卖两次。 |
| Meaning | The play's battery earns from moving energy and from reserves, and other batteries keep entering both. | 本方案的电池靠转移电能和提供备用赚钱，而这两个市场都在不断涌入其他电池。 |
| Marker | Fair evidence. What would change it: ERCOT changing the reserve duration rules, or tested limits for the actual battery. | 证据尚可。会改变判断的证据：ERCOT调整备用时长规则，或实际电池的测试限制。 |
| Controls | Move energy · Hold a reserve · Reset example | 转移电能 · 保持备用 · 重置示例 |
| Labels | Charge at midday · Discharge on the ramps · Energy held for the reserve · Example: 100 MW battery | 中午充电 · 爬坡时放电 · 为备用预留的电量 · 示例：100MW电池 |

### ercot-09 — Why a toll, at this duration · 为什么是租赁，为什么是这个时长

| Item | Shot specification |
| --- | --- |
| Scene | Same station; the existing design grid as a small 2D table: routes (merchant, toll) by hours (‹bound: duration grid›). The toll cell at the play's duration is highlighted as the model's best; merchant cells shown; unpriced toll cells greyed "Not priced" |
| Feedback | Tap or hover shows a cell's ‹bound: design cell value›; the Bankable case owns the detail |
| Evidence and chart | CL-ERCOT-11; REPO-ERCOT-LIVE (`HOME_BRIEFING.grids.ercot`; `src/markets/ercot/comparison.js` on why the archetype is two hours); SRC-ERCOT-01 p. 21 (fleet average duration) |
| Authoring check | The grid's best is by value, and every priced cell is below zero: say "loses the least", never "earns most". Toll cells at other durations are unpriced, not worthless. The monitor reports developers moving to longer duration; that is a trend to watch, not a model input. Never call the toll a price |
| Mobile | The table becomes stacked cards, current play first |
| Status | `model-assumption`, `sourced`; G-1 pending |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why a toll, and why ‹bound: play duration› hours? | 为什么选择租赁，为什么是‹bound: play duration›小时？ |
| Copy | In the platform's design test, a toll at ‹bound: play duration› hours loses the least value of any priced design. Selling at market prices loses more at every duration, and more the longer the battery. Tolls at other durations are not priced. ‹bound: play duration› hours is also close to what ERCOT's fleet builds. | 在本平台的设计测试中，‹bound: play duration›小时的租赁方案在所有已定价设计中价值损失最小。按市场价格运营，在每个时长下损失都更大，且时长越长损失越大。其他时长的租赁尚未定价。‹bound: play duration›小时也接近ERCOT机组的实际建设时长。 |
| Meaning | The toll is chosen because it loses the least, not because it clears the fund's target. | 选择租赁是因为它损失最小，而不是因为它达到了基金的目标回报。 |
| Marker | Fair evidence. What would change it: a lower battery cost, or a toll priced at another duration, that moves the design grid's best cell. | 证据尚可。会改变判断的证据：电池成本下降，或其他时长的租赁获得定价，使设计表的最优单元改变。 |
| Controls | Current play · Merchant at each duration · Open the design grid | 当前方案 · 各时长市场化方案 · 查看设计表 |
| Labels | Toll · Merchant · Not priced · Least value lost | 租赁 · 市场化 · 未定价 · 价值损失最小 |

## 7. Who pays

### ercot-10 — Who pays a battery here · 谁为电池付费

| Item | Shot specification |
| --- | --- |
| Scene | The scene recedes; four 2D payment paths: energy (battery to ERCOT settlement at nodal prices); reserves (ERCOT buys them, load-serving entities bear the cost); capacity (an empty path labelled "No capacity payment"); toll (a counterparty pays a fixed fee and takes the battery's market revenue) |
| Feedback | The selected path shows who pays, the unit, the obligation and its evidence status |
| Evidence and chart | CL-ERCOT-03, CL-ERCOT-11; SRC-ERCOT-01 p. 38 (reserve costs allocated to load-serving entities by metered load), p. 100 (bilateral contracts reflect expected market prices); REPO-ERCOT-LIVE (the toll route). Revenue detail stays in `#revenue` |
| Authoring check | Reserve and energy units stay apart. The toll path is the model's route: counterparty, fee and terms are unknown for any project, and a toll fee is neither a market price nor published. Never stack paths at their maxima: under a toll, the market revenue goes to the counterparty |
| Mobile | One path at a time, as stacked steps |
| Status | Market routes `sourced`, `mechanism-exists`; toll route `model-assumes-route`, `eligibility-unverified` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Who pays a battery in ERCOT, and for what? | 在ERCOT，谁为电池付费？为什么付费？ |
| Copy | ERCOT's market pays for energy delivered and for reserves held ready, and load-serving entities bear the cost of reserves. Nobody pays for capacity. A toll replaces all of this with one private contract: a counterparty pays a fixed fee and takes the battery's market revenue. | ERCOT市场为送出的电能量和保持待命的备用付费，备用成本由售电主体承担。没有人为容量付费。租赁以一份私人合同取代上述全部收入：交易对手支付固定费用，并取得电池的市场收入。 |
| Meaning | During a toll, the owner's revenue depends on the fee and the counterparty, not on market prices. | 在租赁期内，业主收入取决于租赁费和交易对手，而不是市场价格。 |
| Marker | Fair evidence. What would change it: an executed toll's terms: dispatch rights, deductions, who pays for charging, and termination. | 证据尚可。会改变判断的证据：已签租赁的条款，包括调度权、扣款、充电成本由谁承担及终止条件。 |
| Controls | Energy · Reserves · Capacity · Toll | 电能量 · 备用 · 容量 · 租赁 |
| Labels | Paid per MWh delivered · Paid per MW held ready, per hour · No capacity payment · Fixed fee from a counterparty | 按送出的MWh付费 · 按待命MW、按小时付费 · 无容量付费 · 交易对手支付的固定费用 |

### ercot-11 — Only an executed toll at a known price · 只有价格明确的已签租赁

| Item | Shot specification |
| --- | --- |
| Scene | A qualitative revenue band: during the toll term a flat band labelled "Modelled toll (assumption)" with no value; after expiry a dashed merchant band. Beside it an empty price box, "Price not disclosed", and a contract checklist |
| Feedback | "During the toll" and "After expiry" toggles; checklist items open short definitions. Tenor and expiry only from ‹bound: secured tenor› |
| Evidence and chart | CL-ERCOT-11; REPO-ERCOT-LIVE (route `toll`; secured share and tenor; card IRR and margin); [ruling 5A and gate OC-ER-TOLL](../open-calls-plan-2026-10-31.md#research-gates-and-recorded-rulings); SRC-ERCOT-01 p. 100 |
| Authoring check | The modelled toll is an assumption priced from a third-party proxy, not a disclosed ERCOT toll: never show the proxy fee, a band of fees or a "market toll price". Name the tenor and what follows. The return is the card's all-equity figure, nominal after project tax. Do not write "loses money" (CF-ERCOT-03). The test is the executed price against market evidence; the live action names "the 2025 realised index", a subscription source (CF-ERCOT-04), and the story does not repeat it |
| Mobile | Two stacked panels, then the checklist |
| Status | `model-assumes-route`; project contract `missing`, not `contract-verified` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What must be true before this play is worth buying? | 这个方案要满足什么条件，才值得买入？ |
| Copy | The model assumes a toll that fixes ‹bound: secured share› of first-year revenue for ‹bound: secured tenor› years, then market revenue. That toll is an assumption: no price for any toll in ERCOT has been made public. Even with it, the reference case returns ‹bound: hold IRR› all-equity, ‹bound: margin to target›. Only a toll already signed, at a price that can be read and tested, can make the case. | 模型假设一份租赁锁定首年收入的‹bound: secured share›，期限‹bound: secured tenor›年，此后回到市场收入。这份租赁只是假设：ERCOT市场尚无任何租赁价格公开。即便有了它，参考情景的全股权回报也只有‹bound: hold IRR›，‹bound: margin to target›。只有已经签署、价格可以读取并检验的租赁，才可能让投资成立。 |
| Meaning | The executed toll's price, not the market's growth, decides whether this play can reach the fund's target. | 决定本方案能否达到基金目标的，是已签租赁的价格，而不是市场的增长。 |
| Marker | Fair evidence. What would change it: an executed toll's price and full terms, including tenor, indexation, availability deductions and counterparty credit. | 证据尚可。会改变判断的证据：已签租赁的价格与完整条款，包括期限、指数化、可用率扣款及交易对手信用。 |
| Controls | During the toll · After expiry · Contract checks | 租赁期内 · 到期以后 · 合同核查 |
| Labels | Modelled toll (assumption) · Price not disclosed · Market revenue after expiry · Counterparty · Tenor · Indexation · Availability deductions · Dispatch rights | 模型租赁（假设） · 价格未披露 · 到期后的市场收入 · 交易对手 · 期限 · 指数化 · 可用率扣款 · 调度权 |

## 8. The investment

### ercot-12 — What could weaken it, and what to read next · 什么会削弱判断，下一步读什么

| Item | Shot specification |
| --- | --- |
| Scene | Calm overview of the grid; factor cards; future and pending items dashed (more batteries, reserve rules, the new reliability reserve, load growth); a next-event card |
| Feedback | Each factor names the line it affects and links to its section: toll price and tenor to `#bankable`; reserves and spreads to `#revenue`; ownership, supply and contract checks to `#execution`; more batteries and lower prices to `#downside`. The next-event card shows ‹bound: next event› on ‹bound: next event date› |
| Evidence and chart | CL-ERCOT-07 to CL-ERCOT-10, CL-ERCOT-13 to CL-ERCOT-15; SRC-ERCOT-01 pp. iv, viii, 37, 43, 107; SRC-ERCOT-11 (MORA cadence, search result); SRC-ERCOT-15 §113.002; SRC-ERCOT-17; REPO-ERCOT-LIVE (the trigger and its note) |
| Authoring check | Load growth is a queue, not commitments. The MORA is ERCOT's monthly adequacy outlook; the monitor finds its shortage probabilities likely overstated, and the trigger's own note says it is not toll-price evidence. The new reliability reserve is adopted, but storage's role in it is unsettled: dashed. Next year's reserve quantities await the regulator: dashed. No probabilities and no new model numbers. The ownership card states the law's test, not a finding about any investor or supplier |
| Mobile | Factor cards, each with its link; the four section links at the end; no financial dashboard |
| Status | `sourced`; pending rules `official-plan`; G-1 pending. Stop at the market page |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What would make this play less attractive, and what should I read next? | 什么会让这个方案失去吸引力？下一步该读什么？ |
| Copy | More batteries, lower reserve prices, a weaker or shorter toll, and rules that cut how much reserve ERCOT buys can all weaken it. Faster load growth, mostly data centres, is what could tighten the market again; today it is a queue, not committed demand. Next: ‹bound: next action› | 更多电池、更低的备用价格、更弱或更短的租赁，以及削减ERCOT备用采购量的规则，都可能削弱本方案。负荷加速增长（主要来自数据中心）可能使市场重新趋紧；但目前它只是排队申请，并非已确定的需求。下一步：‹bound: next action› |
| Meaning | The toll's price and term decide the case; adequacy reports describe the market behind it, not its price. | 决定方案的是租赁的价格和期限；资源充裕度报告描述的是其背后的市场，而不是租赁价格。 |
| Marker | Fair evidence. What would change it: ERCOT's next adequacy outlook, due on ‹bound: next event date›; the regulator's decision on next year's reserve quantities; or an executed toll. | 证据尚可。会改变判断的证据：预计于‹bound: next event date›发布的ERCOT下一期资源充裕度月报、监管机构对下一年度备用采购量的决定，或已签署的租赁。 |
| Controls | More batteries · Reserve rules · Toll terms · Load growth · Ownership and supply · Bankable case · Revenue · Execution · Downside | 更多电池 · 备用规则 · 租赁条款 · 负荷增长 · 所有权与供应 · 可融资方案 · 收益拆解 · 执行步骤 · 下行风险 |
| Factor cards | Affects reserve and energy income; see Downside · Affects reserve income: ERCOT sets quantities each year, and the market monitor argues they are too high; see Revenue · Affects secured revenue and its tenor; see Bankable case · Could raise prices if demand arrives; it is a queue today; see Revenue · State law bars agreements giving certain foreign-owned companies access to or control of critical infrastructure; check owners, operator and suppliers; see Execution | 影响备用和电能量收入；见下行风险 · 影响备用收入：ERCOT每年确定采购量，市场监测机构认为采购量过高；见收益拆解 · 影响锁定收入及其期限；见可融资方案 · 需求到来可能推高价格；目前仍只是排队；见收益拆解 · 州法禁止与特定外国所有公司签订使其能够访问或控制关键基础设施的协议；须核查所有者、运营方和供应商；见执行步骤 |
| Exits | Bankable case · Revenue · Execution · Downside | 可融资方案 · 收益拆解 · 执行步骤 · 下行风险 |

### Shared page vocabulary and states

These pairs cover ancillary page text; they add no second marker to a shot. Use the site's existing translations where a component already owns the label.

| EN | 简体中文 |
| --- | --- |
| ERCOT (Texas) | ERCOT（得克萨斯） |
| Infrastructure fund | 基础设施基金 |
| Grid, history and full research context | 电网、历史与完整研究背景 |
| Story · Previous · Next · Chapters · Sources | 故事 · 上一节 · 下一节 · 章节 · 来源 |
| Open evidence / Close evidence | 查看证据／关闭证据 |
| Source · Locator · Checked on ‹bound: source checked date› | 来源 · 具体位置 · 核查时间：‹bound: source checked date› |
| Event and source / Why it matters | 事件与来源／投资含义 |
| Historical event · Adopted rule · Pending rule · Example · Schematic | 历史事件 · 已通过规则 · 待定规则 · 示例 · 示意 |
| Strong evidence. / Fair evidence. / Thin evidence. | 证据充分。／证据尚可。／证据单薄。 |
| What would change it: | 会改变判断的证据： |
| Model assumption · Not a signed contract | 模型假设 · 并非已签合同 |
| Go to the investment case | 前往投资方案 |
| This story was last reviewed against the call of ‹date›. | 本故事最近一次依据‹date›的投资判断复核。 |
| Observed series awaiting publication clearance; showing an Example | 观测序列待确认发布权限；当前展示示例 |
| Loading source data… · Could not load data · Retry | 正在载入来源数据… · 数据未能载入 · 重试 |
| Current case unavailable; review the market case | 当前情景暂不可用；请查看市场方案 |
| Read the explanation; the selected state is shown without animation | 阅读文字说明；当前选择直接显示，无需动画 |

## 9. Binding, chart and traceability contract

These are authoring references for the build, not code or dataset registration. Only the existing play card renders financial card values. A missing value hides its sentence or shows the vocabulary above, never a zero.

### Evidence bindings proposed for later implementation

| Token | Source record and field | Units and limits | At check (review only) |
| --- | --- | --- | --- |
| ‹bound: history node› | H-ERCOT-01–06 dated records in §10 | Event date, distinct from publication date | Per node |
| ‹bound: DC tie capacity› | SRC-ERCOT-01 §II.H p. 36 | MW of transfer capability, combined; not flow | 1,220 MW: two SPP ties, 820 MW; two CFE ties, 400 MW |
| ‹bound: offer cap› / ‹bound: old offer cap› | SRC-ERCOT-06 p. 1 | $ per MWh | $5,000 / $9,000 |
| ‹bound: ERCOT months to agreement› | SRC-ERCOT-10 slide 47 | Average months, request to signed agreement, requests since 2010 | 24 months |
| ‹bound: battery MW start› / ‹bound: battery MW latest› / ‹bound: battery MW by year› | Chart-ERCOT-AS upper series (one definition; CF-ERCOT-02) | MW of installed power at year end | About 1,600 MW (end-2021) / more than 17,000 MW (end-2025) |
| ‹bound: fleet average duration› | SRC-ERCOT-01 p. 21 | Hours, fleet average at year end | 1.83 hours (end-2025) |
| ‹bound: RRS price 2023› / ‹bound: RRS price 2025› / ‹bound: reserve price by year› | Chart-ERCOT-AS lower series | $ per MW per hour; annual average day-ahead clearing price | $21.04 / $2.74 |
| ‹bound: revenue per kW change› | SRC-ERCOT-01 p. 22 | Percent change, 2025 against 2024, normalised by capacity | Almost 37% |
| ‹bound: ORDC hours› / ‹bound: ORDC adder› | SRC-ERCOT-01 p. 8 and p. iii | Hours active in 2025 / $ per MWh added to the annual average real-time price | 57 hours / less than $0.02 |
| ‹bound: reserve duration rules› | SRC-ERCOT-01 Table A1, p. A-3 | Duration by product under real-time co-optimisation | Regulation and Responsive Reserve 30 minutes; ECRS one hour; Non-Spin four hours |
| ‹bound: source checked date› | Each source record's check date | Locale date; not a publication date | 31 October 2026 |

### Signature chart: Chart-ERCOT-AS

| Field | Entry |
| --- | --- |
| Question | Did reserve prices fall as batteries filled ERCOT's reserve markets? It is the one picture of "competed away" |
| Panels | Upper: year-end installed battery power, MW, 2021–2025. Lower: annual average day-ahead clearing price by reserve product, $ per MW per hour, 2021–2025, with a product selector (default Responsive Reserve; ECRS from 2023). Shared year axis, independent y-axes, no overlay, no implied crossing |
| Lower-panel input | SRC-ERCOT-01, Figure 25 inset table, p. 40, as printed (one vintage; CF-ERCOT-01). At check: Responsive Reserve $300.87 (2021), $20.79, $21.04, $5.52, $2.74 (2025); Non-Spin $81.56, $23.24, $15.53, $7.13, $3.65; Regulation up $282.56, $25.62, $34.88, $7.36, $2.97; Regulation down $116.16, $9.64, $15.19, $3.90, $1.79; ECRS $73.18 (2023), $9.56, $2.65 |
| Upper-panel input | Preferred: ERCOT's monthly "Capacity Changes by Fuel Type" workbook, battery storage, December values, one definition (commercial operation approved); not opened (GAP-ERCOT-OPEN). Cross-check and fallback: the monitor's year-end statements, which mix report vintages (CF-ERCOT-02): about 1,600 MW (end-2021), 2.7 GW (2022), 4.4 GW (2023), 9,505 MW (2024), more than 17,000 MW and 31,500 MWh (2025) |
| Method | Lower: no calculation; the printed annual averages. Upper: the December value of the monthly installed series. Round only at display |
| 2021 | Winter Storm Uri values are real but off scale: a clipped marker labelled "2021 off scale: Winter Storm Uri", with the value in the accessible table. No log scale |
| Units | Reserve prices are per MW held ready, per hour (the monitor prints "$ per MWh"); never on an energy-price axis |
| Dataset registration | Neither series is registered: `src/governance/datasets.js` holds no ERCOT dataset. Gap GAP-ERCOT-AS for the build; nothing is registered now |
| Rights | The monitor's report: © Potomac Economics, no licence stated, prepared for the PUCT and public. ERCOT's website user agreement and data-portal terms were not opened (GAP-ERCOT-OPEN). **The lower panel is a market price series**, so the analyst's separate price-data rights review applies. `rights-unresolved` until ruled |
| Fallback | Until rights and registration clear: an unscaled Example (fleet rising, prices falling) with no numeric axes and no values, captioned "Example" |
| Limits | Prices are not captured revenue. Products and quantities changed (ECRS from June 2023; co-optimisation from December 2025, so 2025 has one month under it). Not a forecast. The toll is not drawn: no band, line or range (CF-ERCOT-06) |
| Alternative for G-1 | The monitor's normalised battery revenue per kW-year (SRC-ERCOT-01 Figure 17, p. 23) is closer to the thesis's revenue index, but it is published only as a chart. Values read off a figure are not reproducible, so it needs the monitor's underlying data first |

### Source-to-shot mapping

| Shot | Claims → sources and locators | Chart / binding owner | Likely misreading prevented |
| --- | --- | --- | --- |
| ercot-00 | CL-ERCOT-11 → REPO-ERCOT-LIVE | Existing story play card | The modelled toll read as a signed contract; a stale thesis figure on the page |
| ercot-01 | CL-ERCOT-02 → SRC-ERCOT-01 p. 36, SRC-ERCOT-12, SRC-ERCOT-13 | Texas outline; DC tie token | All of Texas is ERCOT; "isolated" means no links; no federal reliability rules |
| ercot-02 | CL-ERCOT-03 → SRC-ERCOT-01 pp. 2, 7–8, 48, 99–100; SRC-ERCOT-06; SRC-ERCOT-07; SRC-ERCOT-08 | Shared timeline; cap tokens | "No capacity payment" read as "no reliability policy"; the credit read as live |
| ercot-03 | CL-ERCOT-04 → SRC-ERCOT-10 slides 26–27, 44, 47 | Months-to-agreement token | Agreement time read as time to operation; connection read as free or unconstrained |
| ercot-04 | CL-ERCOT-06 → SRC-ERCOT-04 p. iv; SRC-ERCOT-03 pp. 1, 24, viii, ix; SRC-ERCOT-01 p. 23 | Shared timeline | Every reserve increase attributed to the storm; outage figures without a source |
| ercot-05 | CL-ERCOT-05 → SRC-ERCOT-01 pp. ii, 21–22; SRC-ERCOT-02 p. 22; SRC-ERCOT-03 p. v; SRC-ERCOT-05 p. ii | Chart-ERCOT-AS upper panel | Mixed definitions spliced; installed MW read as available reserve |
| ercot-06 | CL-ERCOT-07/08 → SRC-ERCOT-01 pp. 22–23, 40 | Chart-ERCOT-AS | Reserve price read as an energy spread or as captured revenue; one vintage mixed with another |
| ercot-07 | CL-ERCOT-09/10 → SRC-ERCOT-01 pp. ii–iii, 6–8, viii, 99–103 | ORDC tokens | Scarcity read as gone for good, or as underwritable |
| ercot-08 | CL-ERCOT-12 → SRC-ERCOT-01 pp. 21, 23, 42–43, A-3 | Duration-rules token; Example battery | Revenue lines stacked at their maxima; a teaching battery read as the case |
| ercot-09 | CL-ERCOT-11 → REPO-ERCOT-LIVE grid | Existing design grid | "Best" read as profitable; unpriced cells read as worthless |
| ercot-10 | CL-ERCOT-03/11 → SRC-ERCOT-01 pp. 38, 100; REPO-ERCOT-LIVE | Revenue section destination | A toll fee read as a market price; market revenue counted on top of a toll |
| ercot-11 | CL-ERCOT-11 → REPO-ERCOT-LIVE; OC-ER-TOLL; SRC-ERCOT-01 p. 100 | Card share, tenor, IRR and margin | A model assumption read as a contract; an implied toll price |
| ercot-12 | CL-ERCOT-07–10, 13–15 → SRC-ERCOT-01 pp. iv, viii, 37, 43, 107; SRC-ERCOT-11; SRC-ERCOT-15; SRC-ERCOT-17 | Existing Bankable, Revenue, Execution and Downside sections | A load queue read as demand; a MORA read as toll-price evidence |

Reverse traceability: each source in §10 names the claims it supports, and each claim names its shots, so a replaced source queues a finite set of shots, translations and labels for review.

## 10. Sources and claims

Research for this script ran on 31 October 2026, Australia/Perth, from `main` at `edcb39c`. Primary documents were opened where the network allowed. ERCOT's own website refused automated reading (bot protection); those items are recorded from search results, marked "search result, not opened", and are corroborated by the market monitor wherever possible. No licence-restricted report or subscription index is a source below.

### Repository evidence

| ID | Exact reference | Supports | Limits |
| --- | --- | --- | --- |
| REPO-ERCOT-LIVE | `main` at `edcb39c`: `view/markets/ercot.json` (thesis, grades, verdicts, trigger `ercot-january-2027-mora`, play `ercot-toll-2h`); card values computed read-only on 31 October 2026 through `opportunities('infraFund')` and `returnPct` (`src/experience/model.js`), `marginText` and `currentThesis` (`src/experience/decision.js`), and `HOME_BRIEFING.grids.ercot`; `src/markets/ercot/comparison.js` (capacity line a declared zero; toll seeded from a third-party two-hour toll value, seven years, then merchant); `src/governance/datasets.js` (no ERCOT dataset) | The call, play, card figures, next event and design grid the story binds to; the toll is the model's assumed route | Not a project document; the toll fee is a proxy, not a disclosed ERCOT toll |

### Primary sources

| ID | Source and locator | Access and dates | Supports | Limits and rights |
| --- | --- | --- | --- | --- |
| SRC-ERCOT-01 | Independent Market Monitor for ERCOT (Potomac Economics), [*2025 State of the Market Report for the ERCOT Electricity Markets*](https://www.potomaceconomics.com/wp-content/uploads/2026/06/2025-State-of-the-Market-Report-for-ERCOT.pdf), May 2026 (PDF created 31 May 2026). Executive summary pp. ii–iv, viii; p. 2 (ORDC "implemented in 2014 and discontinued in December 2025"); §II.D pp. 7–8 and Figure 5; §I.E pp. 21–23, Figures 16–17; §II.H p. 36; §III.B pp. 38–40, Figure 25 and inset table; pp. 42–43; p. 48; §V pp. 99–103; p. 107; Appendix p. A-3, Table A1 | Opened 31 Oct 2026 | Battery capacity above 17,000 MW and 31,500 MWh at end-2025, from below 300 MW before 2021; "As ESRs have flooded the AS markets, AS prices have fallen"; revenue per unit of capacity down almost 37% in 2025, reserve revenue down more than 37%, net energy revenue up 57%; reserve prices fell across all products, 2024 to 2025; ORDC active 57 hours in 2025, adding less than $0.02 per MWh, the least since 2014; surplus of reserves; DC ties; reserve costs allocated to load-serving entities; post-co-optimisation duration rules; DRRS's statutory four-hour duration; "years like 2024 and 2025 occur often"; MORA shortage probabilities likely overstated; load projections for 2030 | The monitor's analysis and recommendations, which ERCOT partly disputes (SRC-ERCOT-18). From Figure 21 on, the contents list numbers figures one higher than the text does; cite by title and page. No licence stated; cite and link; do not reproduce figures |
| SRC-ERCOT-02 | Same author, [*2024 State of the Market Report*](https://www.potomaceconomics.com/wp-content/uploads/2025/06/2024-State-of-the-Market-Report.pdf), May 2025. p. ii, p. 3, p. 22 (9,505 MW of batteries at end-2024; average duration about 1.6 hours), p. 26 (revenue trends) | Opened 31 Oct 2026 | 2024 battery capacity; reserve cost per MWh of load fell from $3.74 to $0.98; ECRS average price $76.77 to $9.62; 2024 battery revenue fell as supply grew and extreme heat days fell | Its annual price table differs from the 2025 report's (CF-ERCOT-01) |
| SRC-ERCOT-03 | Same author, [*2023 State of the Market Report*](https://www.potomaceconomics.com/wp-content/uploads/2024/05/2023-State-of-the-Market-Report_Final_060624.pdf), file dated June 2024. p. 1, p. v, p. viii, p. ix, p. xi, p. 24 | Opened 31 Oct 2026 | Batteries total 4.4 GW after 1,900 MW added in 2023; "a very conservative operational posture since July 2021"; after Uri, reserve procurement rose from roughly 4,000 to 7,000 MW; ECRS from 10 June 2023 almost doubled ten-minute reserves; reserve cost $4.21 per MWh of load in 2023 | Its 2023 reserve cost differs from the 2024 report's (CF-ERCOT-01) |
| SRC-ERCOT-04 | Same author, [*2021 State of the Market Report*](https://www.potomaceconomics.com/wp-content/uploads/2022/05/2021-State-of-the-Market-Report.pdf), May 2022. p. iv; p. x | Opened 31 Oct 2026 | Winter Storm Uri: EEA3 from early 15 February to mid-morning 19 February 2021; more than 52 GW unavailable at the height; 820 MW of batteries added in 2021 | Its 2021 battery addition differs from later reports' description (CF-ERCOT-02) |
| SRC-ERCOT-05 | Same author, [*2022 State of the Market Report*](https://www.potomaceconomics.com/wp-content/uploads/2023/05/2022-State-of-the-Market-Report_Final_060623.pdf), June 2023. p. ii; p. 28 | Opened 31 Oct 2026 | Batteries reached 2.7 GW at end-2022 after 1.7 GW added | Year-end values only |
| SRC-ERCOT-06 | PUCT, Project No. 52631, Item 47, [order adopting amendments to 16 TAC §25.505](https://interchange.puc.texas.gov/Documents/52631_47_1171647.PDF), approved at the 2 December 2021 open meeting. p. 1; pp. 4–5 | Opened 31 Oct 2026 | The offer cap lowered from $9,000 to $5,000 per MWh; "After the extreme weather events of February 2021, the price cap of $9,000 per MWh has proven to be a liability" | Effective date (1 January 2022) from ERCOT notice M-A120721-01, a search result, not opened |
| SRC-ERCOT-07 | PUCT news release, 19 January 2023, [*Public Utility Commission of Texas Unanimously Adopts Performance Credit Mechanism Reliability Service*](https://ftp.puc.texas.gov/public/puct-info/agency/resources/pubs/news/2023/PUCT_Adopts_Performance_Credit_Mechanism_Reliability_Service.pdf) | Opened 31 Oct 2026 | The credit adopted, with implementation deferred until the 88th Legislature could review it | A release, not the order |
| SRC-ERCOT-08 | PUCT, Project No. 55000, *Performance Credit Mechanism*: [Item 47, Staff Recommendation, 13 December 2024](https://interchange.puc.texas.gov/Documents/55000_47_1449541.PDF), p. 2; [Item 48, Chairman's memorandum, 18 December 2024](https://interchange.puc.texas.gov/Documents/55000_48_1450615.PDF); [open meeting minutes, 19 December 2024](https://ftp.puc.texas.gov/public/puct-info/agency/calendar/minutes/12-19-24.pdf), item 17 | Opened 31 Oct 2026 | "Staff recommends not moving forward with the PCM as currently designed"; minutes: "Adopted Staff's final recommendation on PCM"; the memo points effort to real-time co-optimisation and DRRS and leaves later reconsideration open | No filing in the project after 18 December 2024 at check |
| SRC-ERCOT-09 | PUCT news release, 18 June 2026, [*PUCT Approves New ERCOT Process to Manage Electricity Requests from Data Centers, Large Power Users*](https://ftp.puc.texas.gov/public/puct-info/agency/resources/pubs/news/2026/PUCT-Approves-New-ERCOT-Process-to-Manage-Electricity-Requests-from-Data-Centers-Large-Power-Users.pdf) | Opened 31 Oct 2026 | A record number of large users are lining up; a batch study process approved | Gives no queue size; ERCOT's queue figures are search results only |
| SRC-ERCOT-10 | Lawrence Berkeley National Laboratory, [*Queued Up: 2026 Edition*](https://eta-publications.lbl.gov/sites/default/files/2026-06/queued_up_2026_edition.pdf), June 2026, data to end-2025. Slides 26–27, 44, 47 | Opened 31 Oct 2026 | "Generators do not pay for network upgrades under ERCOT's 'connect and manage' approach"; faster request-to-agreement times than FERC-jurisdictional ISOs; ERCOT requests average 24 months to agreement, against longer comparable requests elsewhere since 2010 | A national-laboratory analysis of queue data, partly non-public; not ERCOT's rule text (GAP-ERCOT-RULE). DOE-funded; cite and link |
| SRC-ERCOT-11 | ERCOT, [resource adequacy page](https://www.ercot.com/gridinfo/resource) and MORA reports, including [MORA for December 2026](https://www.ercot.com/files/docs/2026/10/02/MORA_December2026.pdf), posted 2 October 2026 | Search result, not opened (bot protection); the page was opened by the analyst's session for ruling 5A on 31 October 2026 | MORA releases are "targeted for the first Friday of each month", for the month two months ahead, so the January 2027 report falls on 6 November 2026 | Confirm on the page before G-2 |
| SRC-ERCOT-12 | FERC, [ERCOT page](https://www.ferc.gov/industries-data/electric/electric-power-markets/ercot) | Search result, not opened (the host refused automated reading) | The ERCOT grid "is located solely within the state of Texas and is not synchronously interconnected to the rest of the United States" | Corroborated by SRC-ERCOT-01 p. 36 (links only through DC ties) |
| SRC-ERCOT-13 | Potomac Economics, [ERCOT page](https://www.potomaceconomics.com/markets-monitored/ercot/) | Opened 31 Oct 2026 | Potomac Economics is ERCOT's independent market monitor; "ERCOT is regulated by the Public Utility Commission of Texas" | A web page with no version date; site copyright Potomac Economics |
| SRC-ERCOT-14 | ERCOT market notices and releases: ECRS ([M-D050523-01](https://www.ercot.com/services/comm/mkt_notices/M-D050523-01); release of 12 June 2023) and real-time co-optimisation ([M-F110525-04](https://www.ercot.com/services/comm/mkt_notices/M-F110525-04); release of 5 December 2025); [NPRR 1282](https://www.ercot.com/mktrules/issues/NPRR1282), PUCT report of 31 July 2025 | Search results, not opened | ECRS's first operating day, 10 June 2023; transition to the co-optimised systems at midnight, 4 to 5 December 2025; ECRS duration cut from two hours to one, Regulation and Responsive Reserve to thirty minutes | Corroborated by SRC-ERCOT-03 p. ix and SRC-ERCOT-01 pp. 7, 42 and A-3 |
| SRC-ERCOT-15 | Texas Legislature, [S.B. No. 2116, 87th Legislature (2021), enrolled](https://capitol.texas.gov/tlodocs/87R/billtext/html/SB02116F.htm), the Lone Star Infrastructure Protection Act; Business & Commerce Code §113.002 | Opened 31 Oct 2026 | A business entity may not enter an agreement relating to critical infrastructure in Texas that grants direct or remote access to or control of it to a company owned or controlled by citizens or governments of China, Iran, North Korea, Russia or a designated country, or headquartered there | The enrolled 2021 text; later amendments not checked. Applies the test; finds nothing about any investor |
| SRC-ERCOT-16 | ERCOT, [website user agreement](https://www.ercot.com/help/terms) and [data portal terms](https://www.ercot.com/help/terms/data-portal) | Search results, not opened | Terms may change without notice; the API needs registration and acceptance of its terms | Reuse and redistribution terms for ERCOT data not established (GAP-ERCOT-OPEN) |
| SRC-ERCOT-17 | ERCOT, *ERCOT Monthly, June 2026* (board adoption of NPRR 1309 and NOGRR 283, the Dispatchable Reliability Reserve Service, on 2 June 2026; storage participation carried in separate revision requests) | Search result, not opened | DRRS adopted as a new standing reserve; storage's participation unsettled | Corroborated in part by SRC-ERCOT-01 p. 43 (NPRR 1309 approved by TAC; DRRS statutorily four hours) |
| SRC-ERCOT-18 | ERCOT Board, 1 June 2026, Item 9.1, *Preliminary Response to the IMM 2025 State of the Market Report* | Search result, not opened | ERCOT disagrees with parts of the monitor's report, including on net revenue and resource adequacy | The competing view; open before G-2 |
| SRC-ERCOT-19 | ERCOT, notice on the operating reserve demand curve, 30 May 2014 ("beginning June 1, 2014") | Search result, not opened | The ORDC's start month | Corroborated by SRC-ERCOT-01 p. 2 (implemented in 2014) |

### Claims, and the result for CL-ERCOT-01

`CL-ERCOT-01` is the v1.3 candidate in [the source register](source-register.md#candidate-claims-added-in-v11), which this PR does not edit. **Result, 31 October 2026:** confirmed in substance and split into the claims below. Two corrections: the "published fleet revenue index" is a subscription source and is replaced by the market monitor's measures (CF-ERCOT-04), and the ORDC adder ended in December 2025, so "scarcity pricing" now means reserve demand curves. New claims continue from `CL-ERCOT-02`.

| Claim ID | Event or observation | Interpretation, kept separate | Sources and locators | Shots | Status |
| --- | --- | --- | --- | --- | --- |
| CL-ERCOT-02 | ERCOT's grid is not synchronously connected to the rest of the US grid and links to neighbours only through DC ties: two with SPP and two with Mexico's CFE. The PUCT regulates ERCOT | A grid with its own regulator could choose its own market design | SRC-ERCOT-01 p. 36; SRC-ERCOT-12; SRC-ERCOT-13 | ercot-01 | `sourced`; interpretation `proposed` |
| CL-ERCOT-03 | ERCOT pays for energy and reserves and has no capacity payment. Scarcity was priced by the ORDC adder from 2014 to December 2025 and since then by reserve demand curves. The offer cap was lowered from $9,000 to $5,000 per MWh after Uri. The PUCT adopted a performance credit mechanism in January 2023, deferred it, and on 19 December 2024 adopted staff's recommendation not to proceed | Nothing pays a battery for being available | SRC-ERCOT-01 pp. 2, 7–8, 48, 99–100; SRC-ERCOT-06 pp. 1, 4; SRC-ERCOT-07; SRC-ERCOT-08 | ercot-02, ercot-10 | `sourced` (opened) |
| CL-ERCOT-04 | Under connect-and-manage, generators do not pay for network upgrades; ERCOT requests reached signed agreements in 24 months on average, faster than comparable requests elsewhere | Fast connection lets the play and its competitors in quickly; Berkeley Lab calls it "likely one reason" for ERCOT's higher agreement rates | SRC-ERCOT-10 slides 26–27, 44, 47 | ercot-03 | `sourced`; rule text `proposed` (GAP-ERCOT-RULE) |
| CL-ERCOT-05 | Installed battery capacity: below 300 MW before 2021; 2.7 GW (2022), 4.4 GW (2023), 9,505 MW (2024), above 17,000 MW (2025); average duration 1.83 hours at end-2025 | Nothing capped entry | SRC-ERCOT-01 pp. ii, 21–22; SRC-ERCOT-02 p. 22; SRC-ERCOT-03 p. v; SRC-ERCOT-05 p. ii; REPO-ERCOT-LIVE | ercot-05 | `sourced`; 2021 value in conflict (CF-ERCOT-02) |
| CL-ERCOT-06 | After Uri, ERCOT adopted a conservative operating posture and raised reserve procurement from roughly 4,000 to 7,000 MW; ECRS from 10 June 2023 almost doubled ten-minute reserves; before 2024 batteries took part mainly through reserves | Post-storm reserve buying created the batteries' first revenue pool | SRC-ERCOT-03 pp. 1, 24, viii, ix; SRC-ERCOT-04 p. iv; SRC-ERCOT-01 p. 23 | ercot-04 | Events `sourced`; reading `proposed` |
| CL-ERCOT-07 | Annual average day-ahead reserve prices fell across all products from 2024 to 2025, and steeply from 2023: Responsive Reserve $21.04 to $2.74, ECRS $73.18 to $2.65; reserve cost was $0.39 per MWh of load in 2025, the lowest since 2020 | The monitor: "As ESRs have flooded the AS markets, AS prices have fallen" | SRC-ERCOT-01 pp. 3, 22, 40 | ercot-06 | `sourced` (opened) |
| CL-ERCOT-08 | Revenue per unit of battery capacity fell almost 37% in 2025, reserve revenue more than 37%, while net energy revenue rose 57%; 2024 revenue also fell | The monitor expects revenue per unit to keep falling as reserves saturate and spreads tighten | SRC-ERCOT-01 pp. 22–23; SRC-ERCOT-02 p. 26 | ercot-06 | `sourced` |
| CL-ERCOT-09 | In 2025 the ORDC was active for 57 hours, under 8% of its 2021–2024 average, adding less than $0.02 per MWh, the least since 2014; summer price spikes were 40% less frequent than in 2024 as battery capacity grew | Scarcity revenue is rare and cannot be underwritten | SRC-ERCOT-01 pp. iii, 6, 8 | ercot-07 | `sourced`; reading `proposed` |
| CL-ERCOT-10 | The monitor: years like 2024 and 2025 "occur often"; tighter years such as 2021 and 2023 pay above the cost of new entry; projected 2030 load of 138 to 148 GW, up to 209 GW in a high case, which installed capacity could not serve | Merchant upside exists but arrives in unpredictable years; load growth is a queue | SRC-ERCOT-01 pp. viii, 103; SRC-ERCOT-09; SRC-ERCOT-18 for ERCOT's differing view | ercot-07, ercot-12 | `sourced`; the competing explanation |
| CL-ERCOT-11 | The play's route is a toll: 100% of first-year revenue for seven years, then merchant, in the model; the toll fee is a proxy, and this research found no ERCOT toll price in a public primary source; even with the toll the card's all-equity IRR is below target and every priced design has negative value; bilateral contracts "ultimately reflect expectations of real-time energy and ancillary service prices" | Only an executed toll at a known price can make the case | REPO-ERCOT-LIVE; SRC-ERCOT-01 p. 100; ruling 5A and gate OC-ER-TOLL | ercot-00, ercot-09–11 | Model `sourced`; toll price `missing` (GAP-ERCOT-TOLL) |
| CL-ERCOT-12 | Since 5 December 2025 energy and reserves clear together every five minutes, with a single model for batteries; duration rules: Regulation and Responsive Reserve thirty minutes, ECRS one hour, Non-Spin four hours | Better dispatch for one battery and a larger qualifying pool for each reserve | SRC-ERCOT-01 pp. ii–iii, 7, 42, A-3; SRC-ERCOT-14 | ercot-02, ercot-08 | `sourced` |
| CL-ERCOT-13 | DRRS, a new reliability reserve required by statute with a four-hour duration, was adopted by ERCOT's board in June 2026; storage's participation is in separate, unsettled revision requests | A possible future line for longer batteries; not in the case | SRC-ERCOT-01 p. 43; SRC-ERCOT-17 | ercot-12 | `official-plan`; adoption detail a search result |
| CL-ERCOT-14 | MORA is targeted for the first Friday of each month, for the month two months ahead; the January 2027 report falls on 6 November 2026 | It informs demand and saturation, not toll price; the monitor finds its shortage probabilities likely overstated | SRC-ERCOT-11; SRC-ERCOT-01 p. 107; REPO-ERCOT-LIVE trigger note | ercot-12 | Cadence from a search result and the analyst's ruling; reading `sourced` |
| CL-ERCOT-15 | Texas law bars agreements granting certain foreign-owned companies access to or control of critical infrastructure | A diligence check on owners, operator and suppliers, for the Execution section | SRC-ERCOT-15 §113.002 | ercot-12 | `sourced`; whether the card stays is a G-1 decision |

### Historical nodes — events separate from interpretation

| Node | Date | Event and source | Reading (proposed) |
| --- | --- | --- | --- |
| H-ERCOT-01 | 2014 (from 1 June, per SRC-ERCOT-19) | The ORDC price adder begins (SRC-ERCOT-01 p. 2) | Scarcity is how a market without capacity payments pays for reliability |
| H-ERCOT-02 | 15–19 February 2021 | Winter Storm Uri; EEA3 and load shed (SRC-ERCOT-04 p. iv) | The storm made ERCOT cautious and reserve-heavy |
| H-ERCOT-03 | 2 December 2021, effective from 2022 | Offer cap lowered from $9,000 to $5,000 per MWh (SRC-ERCOT-06) | Scarcity hours pay less than before |
| H-ERCOT-04 | 19 January 2023 to 19 December 2024 | Performance credit adopted and deferred, then not taken forward (SRC-ERCOT-07, SRC-ERCOT-08) | No capacity payment for the foreseeable future |
| H-ERCOT-05 | 10 June 2023 | ECRS begins; ten-minute reserves almost double (SRC-ERCOT-03 pp. viii, ix) | The reserve pool batteries filled |
| H-ERCOT-06 | 5 December 2025 | Real-time co-optimisation goes live; the ORDC adder ends (SRC-ERCOT-01 pp. 2, 7) | More competition for each reserve |

### Conflicts and dispositions

| ID | Conflict | Disposition |
| --- | --- | --- |
| CF-ERCOT-01 | The monitor's annual figures change between report vintages: ECRS 2023 is $76.77 in the 2024 report and $73.18 in the 2025 report; Responsive Reserve 2023 is $20.66 and $21.04; reserve cost per MWh of load in 2023 is $4.21 in the 2023 report and $3.74 in the 2024 report | The chart takes every year from the 2025 report's table and names it; never mix vintages |
| CF-ERCOT-02 | 2021 battery capacity: the 2021 report counts 820 MW added in 2021; the 2024 and 2025 reports say capacity rose from 300 MW to 1,600 MW in the twelve months of 2021 | Take every year of the upper panel from one dataset, preferably ERCOT's monthly installed series; label the 2021 point's source |
| CF-ERCOT-03 | The fund verdict's `because` says "the reference project loses money on the model, even with a toll", and the `assetReturn` grade reason (17 October) quotes a hold IRR of −5.9%, the design grid's basis. The card and the Overview use the investment basis (ready-to-build entry, nominal after project tax, with the platform's US tax treatment): an all-equity hold IRR of 0.5%, −9.61 pp against target. The investment NPV and every design value are negative | The story says "falls short of the fund's target", which is true on both bases. The view text is the analyst's to re-word; not edited here |
| CF-ERCOT-04 | The thesis's "about 85% in two years" and the play's `why` rest on a subscription index (`modoIndex` in `src/markets/ercot/sources.js`); the live action tests against "the 2025 realised index". The monitor's Figure 17 shows a fall of similar size from 2023 to 2025, but only as a chart; its text states the 2025 change | The story never types the percentage or names the index; it uses the monitor's stated change. Re-sourcing the view text is the analyst's decision |
| CF-ERCOT-05 | The `policyStability` grade reason says data-centre interconnections "have been paused for audit since August 2026". This research found it only in a blog post; ERCOT's site could not be read, and the PUCT's June release is silent | Not used in the story; flagged for the analyst |
| CF-ERCOT-06 | The story card in `market-narratives.md` proposes the published fleet revenue index by year against fleet size, with the undisclosed toll as a dashed band. The index is a subscription source, and a toll band would imply a price the platform has not underwritten | Replaced by Chart-ERCOT-AS, with no toll drawn. The card is not edited here; a later PR folds it |

### Gaps

| ID | Missing evidence | Affected | Temporary treatment | Next action | Gate blocked |
| --- | --- | --- | --- | --- | --- |
| GAP-ERCOT-AS | No ERCOT dataset is registered; the chart needs a reserve-price series and an installed-battery series, with rights cleared | ercot-05, ercot-06 | Unscaled Example | Analyst picks the route at G-1 (transcribe the monitor's table, or register ERCOT's day-ahead reserve prices and monthly installed storage); price-data rights review | G-2 for the numeric chart |
| GAP-ERCOT-TOLL | No executed or disclosed ERCOT toll price and terms (gate OC-ER-TOLL) | ercot-00, ercot-10–12 | The toll is shown as an assumption with no price | Underwrite an executed toll when one is offered | The investment case, not the story |
| GAP-ERCOT-OPEN | ERCOT pages refused automated reading: resource adequacy and MORA cadence, ECRS and co-optimisation notices, terms of use, reserve methodology, capacity workbooks | ercot-01–08, ercot-12 | Search results, corroborated by the monitor where possible | Open them by hand before G-2 | None for G-1 |
| GAP-ERCOT-RULE | ERCOT Planning Guide §5 and the PUCT's interconnection cost rules not opened | ercot-03 | Berkeley Lab's description | Read the rule text | None for G-1 |
| GAP-ERCOT-MAP | No ERCOT footprint boundary is available | ercot-00, ercot-01 | The existing Texas outline, with the grid drawn as a schematic inside it and labelled | Accept, or source a public boundary with its licence | None |

### Dataset and rights summary

The signature chart needs two series. Neither is registered in `src/governance/datasets.js`, which holds no ERCOT dataset at all. The reserve-price panel is a market price series, so the analyst's separate price-data rights review applies before anything numeric is published. The monitor's report states no licence (© Potomac Economics; prepared for the PUCT), and ERCOT's data terms were not opened. Nothing is registered or ingested in this task.

## 11. G-1 record and stopping point

| Analyst pass | Decision required |
| --- | --- |
| Electricity mechanics | Accept: grid apart with DC ties only; energy and reserves only, scarcity pricing under a lowered cap, the credit adopted then set aside; connect-and-manage; post-Uri reserve buying and ECRS; the battery influx; reserve prices and scarcity hours falling; duration rules under co-optimisation |
| Investment meaning | Accept: nothing pays for availability; reserve and scarcity revenue competed away; merchant upside real but unpredictable; the toll as the least-bad priced design, not a contract and not a price; only an executed toll at a known price makes the case |
| English / Chinese | Confirm equal meaning, especially: reserves held ready against energy delivered; the modelled toll as an assumption; "falls short of the fund's target"; adopted against pending rules |
| G-1 | **Pending. Analyst: sign off ercot-00 to ercot-12, or name changes.** |

Points the analyst must decide at G-1:

1. The argument in §1, including the reading that post-Uri reserve buying created the batteries' first revenue pool (CL-ERCOT-06).
2. The signature chart: accept Chart-ERCOT-AS in place of the card's index-and-toll-band chart (CF-ERCOT-06), choose its data route (GAP-ERCOT-AS), and rule on price-data rights for the reserve-price panel.
3. Whether to re-source the thesis's "about 85%" and the action's "2025 realised index", which rest on a subscription index (CF-ERCOT-04).
4. Whether to re-word the `because` line "loses money on the model, even with a toll" and the −5.9% grade reason, which use the design basis while the card shows the investment basis (CF-ERCOT-03).
5. Whether to keep, re-source or drop the data-centre "pause for audit" in the `policyStability` reason (CF-ERCOT-05).
6. The markers: Strong on ercot-01, -02, -05, -06 and -07; Fair on the rest; the opening inherits the card's Strong. Strong assumes your review of the opened primary documents.
7. The ownership-and-supply factor card in ercot-12 (CL-ERCOT-15): keep for the fund lens, or leave it to the new-entrant lens.
8. Whether to open ERCOT's own pages before G-2 (GAP-ERCOT-OPEN) or accept the monitor's corroboration.
9. The opening map without an ERCOT footprint (GAP-ERCOT-MAP).
10. The Chinese drafts.

Checks on this draft, 31 October 2026: thirteen shots, each with the six specification rows and the page-text rows (Question, Copy, Meaning except ercot-00, Marker, Controls); every marker uses the fixed wording; page copy carries no figure outside a `‹bound›` token except years and dates; figures in labels appear only on values tagged Example; English and Chinese rows use the same tokens; local links resolve. ERCOT's website could not be read by automation, and the local confidentiality scan could not run because this environment has no marker list; CI's scan is the check. No code, data, view, fixture or dataset changed.

Build boundary: stop here. Design, dataset registration, ingestion, code, build, preview and G-2 are later, separately authorised work.
