# Western Australia: Six-Chapter Storyboard

Pack: BESS-IX-2026-10-30, version 1.2  
Status: script signed off by the user at `G-1` on 30 October 2026; build in progress (`WP-02` onwards)  
Navigation: [Master plan](README.md) | [Narrative method](market-narratives.md) | [Evidence specification](evidence-and-content-specification.md) | [Page design](experience-and-page-design.md) | [Source register](source-register.md)

## 1. Scope, argument and reading route

The pilot covers **WEM/SWIS**, not every electricity system in Western Australia. The story argues for one conclusion: the platform's WA call and play as the view store publishes them (REPO-12, corrected in v1.2). At check on 30 October 2026 that is the infrastructure-fund call **Opportunistic** on **`wa-cap-8h`**: the Reserve Capacity Mechanism at eight hours, entered as a co-investment behind a strategic sponsor once Capacity Credits are assigned.

v1.1 argued for seven hours. The analyst moved the play to eight hours on 17 October, after the supplier-quote cost update (CF-WA-01), so v1.2 argues for eight. The rule and the play now explain each other:

1. The SWIS is an island, so it has to hold its own capacity (CL-WA-05, CL-WA-09).
2. When the WEM opened in 2006 it chose to pay for capacity as well as energy; the NEM pays for energy only (CL-WA-06).
3. Rooftop solar moved the system's hardest hours from midday into a long evening (CL-WA-02, CALC-WA-DAY).
4. AEMO credits a battery only for the power it can hold across the whole evening window. For batteries first credited in the cycle this play enters, that window is seven hours; it stays fixed for ten years, and the battery is measured again every year as it fades (CL-WA-07, CL-WA-10).
5. So the play builds eight hours: seven to earn full credits, one to keep them as the battery ages. On the supplier-quoted battery cost, the platform's design test finds eight hours gives the most value per MW, while seven gives the higher return on less capital (the play's own "why").
6. Capacity is most of the modelled revenue, at a price reset every year (CL-WA-11). A fund cannot carry the project alone, so it takes a minority stake behind a sponsor once credits are assigned. What weakens the play is price and fade, not the rule.

Comprehension check: from the story alone, the user can say why the play is an eight-hour capacity battery, seven hours for the rule and one for the fade, bought behind a sponsor once credits are assigned.

Scenes are fixed-view isometric SVG from the shared symbol kit. They show a real system context with simplified topology, not a load-flow model, an engineering layout or project advice. Thirteen active shots (`wa-00` to `wa-14`, with `wa-12` and `wa-13` retired) make about five minutes of reading. Chapter links and ordinary scrolling work throughout, and nothing waits for an animation.

| Chapter | 章节 | Shots | What the reader can explain afterwards |
| --- | --- | --- | --- |
| Opening | 开篇 | wa-00 | The call and the play, in one line |
| Origins | 起源 | wa-01, wa-02 | Why an island grid must build its own backup, and how rooftop solar changed the pattern |
| Historical choices | 历史选择 | wa-03, wa-04 | Why WA pays for capacity when the NEM does not, and why owning a battery is not the same as being paid |
| Today's tensions | 当下的矛盾 | wa-05, wa-06, wa-07 | The midday surplus, the long evening window, and why fast response is a separate, smaller line |
| Add a battery | 加入电池 | wa-08, wa-09 | Why eight hours: the rule plus the fade; and what the investor owns |
| Who pays | 谁来付费 | wa-10, wa-11 | Capacity first, at a price reset every year, and why one battery cannot promise everything |
| The investment | 投资 | wa-14, then links | What could weaken the value, and where the numbers live (Bankable case, Revenue, Execution, Downside) |

### Bound fields

Every figure on the page comes through one of these tokens. The values are given only so the analyst can review the script against the live case; they are never typed into copy. If the play changes, the play card updates itself and `reviewedAgainst` flags this script for review.

| Token | Field the market page or market research already reads | At check, 30 Oct 2026 |
| --- | --- | --- |
| ‹bound: call› | `row.call`, shown by the call tag in `src/experience/pages.js` | Opportunistic |
| ‹bound: play› | `playTitle(row.play, row.stage)` (`routeName` in `pages.js`) | Reserve Capacity Mechanism · 8h, co-investment |
| ‹bound: play duration› | `row.play.hours` (also the market intro's "· 8H") | 8 |
| ‹bound: why› | `row.play.why` | Eight hours has the highest value per MW at the supplier-quoted DC block cost; seven hours the higher hold IRR |
| ‹bound: next action› | `row.play.action.text` (the Overview's next action) | Line up a minority stake behind a strategic sponsor now; commit once Capacity Credits for 2028-29 are assigned |
| ‹bound: secured share› | `row.econ.secured` ("Modelled fixed revenue") | 79.3% after PR #78 (77.9% at sign-off) |
| ‹bound: secured tenor› | `row.econ.securedYears` ("Fixed revenue tenor") | 10 years |
| ‹bound: duration requirement› | `floorOf(market, 'cap').hours` in `src/comparison/designFit.js`, which the design grid uses | 7 |
| ‹bound: requirement term› | `floorOf(market, 'cap').termYears` | 10 |
| ‹bound: requirement path› | `RCM_HISTORY.esr[].h` in `src/markets/wa/data/rcmHistory.js`, read by the WA research story tab | 4, 6, 7 |
| ‹bound: entry route› | `row.play.stage`, as `playTitle` names it | co-investment |

The teaching battery is 100 MW, tagged "Example", and its presets are teaching values; they never change the case (evidence specification §4).

### Rules for every shot

- **Figures.** Calls, durations and revenue shares in page copy come through the bound fields above. Dates are sourced historical facts, not figures to bind.
- **Controls.** Teaching controls change only teaching state: era, time of day, battery preset, hotspot or service. The story has no underwriting controls. "Go to the investment case" links to the market page, which already hands the case to the Investment Lab.
- **Navigation.** Chapter and shot changes are history entries. Back, refresh, a language switch and opening or closing evidence keep the reader's place (`WP-04`).
- **Evidence.** Each shot shows one marker and one "What would change it" line, using the site's existing labels: Strong evidence (证据充分), Fair evidence (证据尚可), Thin evidence (证据单薄). A Strong marker in this script assumes the user's review at `G-1`. The Authoring check row is for writers and reviewers and never appears on the page. Scenarios and future assets are dashed; teaching values are tagged "Example" (示例).
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

## 2. Opening

### wa-00 — The call

| Item | Shot specification |
| --- | --- |
| Scene | Small isometric SWIS thumbnail; no animation |
| Feedback | None; this shot is the conclusion |
| Evidence and chart | Play card fields from the view store through the briefing model (REPO-12); CL-WA-06 for the 2006 line |
| Authoring check | Never restate the call or a figure in prose; a changed call or play updates the card by itself and flags the story |
| Mobile | Play card full width; two buttons |
| Status | Revised in v1.2: the 2006 line is sourced, and the card now carries `wa-cap-8h` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What is the call here, and why should I read on? | 这里的投资判断是什么？为什么值得读下去？ |
| Copy | The existing play card: ‹bound: call›, ‹bound: play›, the figures the card already shows, ‹bound: next action›. Beneath it: "Why: an island grid, a choice made in 2006, and a long evening." | 沿用现有投资方案卡：‹bound: call›、‹bound: play›、卡片已显示的各项数据、‹bound: next action›。卡片下方一行：“原因在于：一张孤岛电网、2006年的一次制度选择，以及漫长的傍晚。” |
| Marker | The play's own marker, already on the card | 沿用方案卡上该方案自身的证据标记 |
| Controls | Start the story · Go to the investment case | 开始阅读 · 前往投资方案 |

## 3. Origins

### wa-01 — An island grid

| Item | Shot specification |
| --- | --- |
| Scene | Australia from Natural Earth's coastline (SRC-NE-01): WA, the Northern Territory in neither system, and the NEM's states with Tasmania. The SWIS area is highlighted as the coast from Kalbarri to Albany closed through Kalgoorlie (SRC-WA-16), labelled approximate (ASSET-SWIS-BOUNDARY); a broken line from Perth eastward marks "No link"; fixed view |
| Feedback | Boundary and legend change together; the caption sits outside the drawing |
| Evidence and chart | CL-WA-01 (SRC-WA-01; SRC-WA-16; map SRC-NE-01); CL-WA-05 (SRC-NEM-01; SRC-WA-10, p. 15; SRC-WA-12) |
| Authoring check | Do not colour the whole state as WEM; the outline joins three named places, so label it approximate; dots are not investment sites |
| Mobile | Same map; two large buttons |
| Status | Revised in v1.2: CL-WA-05 sourced. Map built in `WP-07` from SRC-NE-01 and SRC-WA-16 (v1.2.1) |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Which system is this, and what is unusual about it? | 这是哪个电力系统？它有什么特别之处？ |
| Copy | Perth's grid is an island. The South West Interconnected System has no link to any other grid, so all of its backup has to be built inside it. | 珀斯所在的电网是一座孤岛。西南互联系统（SWIS）与任何其他电网都没有联络，所有备用容量都只能在系统内部自建。 |
| Meaning | An island must hold its own reserve; that is why reliability is paid for separately. | 孤岛电网必须自备备用容量，因此可靠性需要单独付费。 |
| Marker | Strong evidence. What would change it: a committed link between the SWIS and another grid. | 证据充分。会改变判断的证据：西南互联系统与其他电网之间出现已承诺建设的联络线。 |
| Controls | Story system · Whole state | 故事涉及的系统 · 西澳全州 |
| Labels | SWIS area (approximate) · Rest of Western Australia · National Electricity Market (east coast) · Northern Territory, in neither system · Perth · No link | 西南互联系统覆盖范围（近似） · 西澳其他地区 · 全国电力市场（东海岸） · 北领地，不属于任一系统 · 珀斯 · 无联络 |
| Caption | Approximate. Coast: Natural Earth. SWIS extent: Kalbarri, Albany and Kalgoorlie, as Energy Policy WA describes it. | 近似范围。海岸线：Natural Earth。西南互联系统范围：按西澳能源政策局所述的卡尔巴里、奥尔巴尼和卡尔古利。 |

### wa-02 — Built for one-way supply

| Item | Shot specification |
| --- | --- |
| Scene | Generator, transmission line, substation, homes and industry; the toggle adds rooftops in the same frame |
| Feedback | Rooftops appear; one direction marker reverses on the distribution side |
| Evidence and chart | CL-WA-02 (SRC-WA-02, p. 1); CL-WA-08 for the retiring coal fleet; WA-specific asset history pending |
| Authoring check | Arrows are schematic, not measured flows; no generation shares without data |
| Mobile | Two aligned panels with the same labels |
| Status | Kept; Chinese drafted in v1.2 |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What was the network built to do? | 这张电网当初是为什么而建的？ |
| Copy | The grid was built for big plants sending power one way. Rooftop solar now pushes power back from the edges of the network. | 这张电网原本为大型电厂单向送电而建。如今，屋顶光伏从电网末端反向送电。 |
| Meaning | The old fleet still runs, but the system now needs flexibility it did not need before. | 原有机组仍在运行，但系统如今需要过去并不需要的灵活性。 |
| Marker | Fair evidence. What would change it: a dated history of the SWIS generation fleet from a primary source. | 证据尚可。会改变判断的证据：来自一手来源、注明日期的西南互联系统电源发展史。 |
| Controls | Earlier pattern · With rooftop solar | 早期模式 · 加入屋顶光伏 |

## 4. Historical choices

### wa-03 — The choice that shapes the market

| Item | Shot specification |
| --- | --- |
| Scene | Same grid frame with a five-node timeline; selecting a node changes one layer |
| Feedback | Only the selected layer changes; the outlook node is dashed |
| Evidence and chart | Event: CL-WA-06 (SRC-WA-11; SRC-WA-10, §2.5 pp. 26–27; SRC-NEM-02). Interpretation: CL-WA-09 (SRC-WA-10, §2.2 p. 15; SRC-WA-12). Nodes: CL-WA-06, CL-WA-08, CL-WA-03, CL-WA-07 and the ESOO outlook (CL-WA-04, scenario) |
| Authoring check | Keep the event (the 2006 start with a capacity mechanism) and the interpretation (an island buys reliability ahead) as separate claims. SRC-WA-10 argued against the RCM in 2014, so cite it for facts, not merits. No invented dates; planned retirements never drawn as complete |
| Mobile | Vertical node list; one diagram |
| Status | Revised in v1.2: the hinge is sourced, the interpretation is ready for the user's review |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why does WA pay batteries for capacity when the NEM does not? | 为什么西澳为电池的容量付费，而全国电力市场不付？ |
| Copy | When the WEM opened in 2006, Western Australia chose to pay for capacity as well as energy. An island cannot import in a shortage, so it buys its reliability years ahead. The NEM chose an energy-only market, with no payment for capacity. | 2006年西澳电力批发市场（WEM）开市时，西澳选择在电能量之外同时为容量付费。孤岛电网缺电时无法从外部输入，只能提前数年买下可靠性。全国电力市场则选择了单一电能量市场，不为容量付费。 |
| Meaning | The capacity mechanism is why capacity is most of this play's modelled revenue (‹bound: secured share›). | 正因为有容量机制，容量收入才占本方案模型收入的大头（‹bound: secured share›）。 |
| Marker | Strong evidence. What would change it: the original market design papers giving a different main reason for the capacity mechanism. | 证据充分。会改变判断的证据：最初的市场设计文件给出了采用容量机制的不同主要理由。 |
| Controls | Select a node · Constraint · Choice · What remains · Effect today | 选择节点 · 约束 · 选择 · 遗留 · 今日影响 |

Timeline nodes (page text):

| Node | Field | English | 简体中文 |
| --- | --- | --- | --- |
| 2006 · The market opens with a capacity mechanism | Constraint | A small, isolated system with fast-growing demand had to hold its own reserve. | 一个规模不大、与外界隔绝且需求快速增长的系统，必须自备备用容量。 |
| | Choice | Pay for capacity as well as energy. | 在电能量之外，同时为容量付费。 |
| | What remains | The Reserve Capacity Mechanism, run every year. | 每年运行的备用容量机制。 |
| | Effect today | Capacity is the main income of a WA battery. | 容量收入是西澳电池的主要收入。 |
| June 2022 · Coal to retire by 2030 | Constraint | Rooftop solar left the State's generator selling daytime power at a loss. | 屋顶光伏使州属发电企业在白天亏本售电。 |
| | Choice | Retire the State's coal power stations by 2030 and build wind and storage. | 到2030年退役州属燃煤电站，转而建设风电和储能。 |
| | What remains | Closures still to come are plans, drawn dashed. | 尚未发生的关停仍属计划，以虚线表示。 |
| | Effect today | Storage and other capacity must take over the evening from coal. | 傍晚的供电需要由储能和其他容量接替燃煤机组。 |
| 1 October 2023 · New market rules | Constraint | Rules written for a few large plants. | 规则原本为少数大型电厂而写。 |
| | Choice | New market arrangements, including rules for storage in the capacity mechanism. | 新的市场安排，其中包括储能参与容量机制的规则。 |
| | What remains | The rules a battery is certified under today. | 电池如今据以认证的规则。 |
| | Effect today | A battery is credited for the power it can hold, not for its nameplate. | 电池按其能够持续输出的功率获得信用，而不是按铭牌功率。 |
| 2025 and 2026 · Longer windows for new storage | Constraint | Each battery added flattens the evening peak and stretches it. | 每增加一台电池，傍晚峰值就被削平、拉长。 |
| | Choice | AEMO lengthens the window for each new cycle: ‹bound: requirement path› hours. | AEMO为每个新周期延长时段：‹bound: requirement path›小时。 |
| | What remains | Earlier batteries keep their shorter window. | 较早的电池保留原来较短的时段。 |
| | Effect today | This play is sized to the ‹bound: duration requirement›-hour rule of its cycle. | 本方案按其所在周期‹bound: duration requirement›小时的规则确定规模。 |
| Outlook (dashed) · Longer still for later entrants | Constraint | More storage is planned. | 更多储能正在规划中。 |
| | Choice | None yet: an outlook, not a decision. | 尚无决定：这是展望，而非决策。 |
| | Effect today | Later, longer batteries will compete for the same evening. | 未来更长时的电池将争夺同一个傍晚。 |

### wa-04 — Owning a battery is not being paid

| Item | Shot specification |
| --- | --- |
| Scene | Physical layer fixed; a rule overlay shows certification, then credits, then obligations |
| Feedback | Assets stay put while the overlay changes; the reform date and the date the rules were checked appear separately |
| Evidence and chart | CL-WA-03 (SRC-WA-03); SRC-WA-05 (certification is a separate process); SRC-WA-09, clause 4.11.3; SRC-WA-14 (credits for 2028-29 assigned on 20 October 2026) |
| Authoring check | The 2023 start does not certify a 2028 project; capability, certification and credits are different things |
| Mobile | Two layers plus a three-step checklist |
| Status | Revised in v1.2 |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | If I own a capable battery, am I paid for capacity? | 拥有一台性能达标的电池，就能拿到容量收入吗？ |
| Copy | Not yet. Capacity is paid only after AEMO certifies the battery and assigns it Capacity Credits for a capacity year, under the market rules that began on 1 October 2023. | 还不能。只有在AEMO完成认证、并为某一容量年度分配容量信用之后，电池才能获得容量收入；适用的是2023年10月1日起实施的市场规则。 |
| Meaning | This is why the fund commits only once credits are assigned: ‹bound: next action› | 这正是基金要等容量信用分配后才出资的原因：‹bound: next action› |
| Marker | Fair evidence. What would change it: AEMO's credit-assignment steps read against the cycle's timetable. | 证据尚可。会改变判断的证据：对照该周期时间表，核读AEMO分配容量信用的各个步骤。 |
| Controls | Physical system · Market rules | 物理系统 · 市场规则 |
| Labels | Certified · Credited · Obligated | 已认证 · 已获信用 · 承担义务 |

## 5. Today's tensions

### wa-05 — Midday: more rooftop solar than grid

| Item | Shot specification |
| --- | --- |
| Scene | Daylight; rooftops lit; grid plants dimmed; Chart-WA-DAY splits grid demand, rooftop solar and their sum |
| Feedback | Chart and scene change together |
| Evidence and chart | CL-WA-02 (SRC-WA-02); Chart-WA-DAY from CALC-WA-DAY (SRC-WA-13): median business day of the 2025-26 Hot Season, AWST |
| Authoring check | Grid demand here is unscheduled operational demand, which leaves out large-scale battery charging; it is not total consumption. A median day, labelled as such. Low demand is not free energy |
| Mobile | Three labelled bands and a midday button |
| Status | Revised in v1.2: quantitative once CALC-WA-DAY is signed off |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What happens on a sunny midday? | 晴天的中午会发生什么？ |
| Copy | At midday on a typical summer weekday, rooftops supply more power than the grid does. That is when a battery charges, and when keeping the system stable is hardest. | 在典型的夏季工作日中午，屋顶光伏供应的电力比电网还多。这正是电池充电的时段，也是维持系统稳定最吃力的时段。 |
| Meaning | Midday is charging time; its cost and access depend on prices and the connection. | 中午是充电时段；充电成本和能否充电，取决于电价和并网条件。 |
| Marker | Strong evidence. What would change it: AEMO revising the rooftop solar estimates behind the median day. | 证据充分。会改变判断的证据：AEMO修订作为中位日依据的屋顶光伏估算值。 |
| Controls | Midday | 中午 |
| Labels | Grid demand (excluding battery charging) · Rooftop solar (estimated) · Grid demand plus rooftop solar · MW · AWST | 电网需求（不含储能充电） · 屋顶光伏（估算） · 电网需求加屋顶光伏 · MW · 西澳标准时间 |
| Caption | Median business day, Hot Season 2025-26. Source: AEMO WEM data. | 2025-26年夏季工作日中位日。来源：AEMO西澳电力市场数据。 |

### wa-06 — The long evening (signature chart)

| Item | Shot specification |
| --- | --- |
| Scene | Same grid at dusk with the evening window shaded |
| Feedback | Signature chart Chart-WA-EVENING: the median-day evening trace; AEMO's 2028-29 window for storage first credited in the 2026 cycle, summer business days, drawn as printed (intervals starting 15:30 to 22:00); a 100 MW Example battery at ‹bound: duration requirement› hours filling the window at full power; a four-hour Example battery whose energy is spread across the window at the lower power it is credited for |
| Evidence and chart | CL-WA-07 (SRC-WA-08, p. 78 and Table 28); CL-WA-10 (SRC-WA-09, clause 4.11.3 and the Peak ESROD definition); CALC-WA-DAY (SRC-WA-13). On the median day the 14 highest intervals run 16:00 to 22:30, within one interval of the printed window (CF-WA-02) |
| Authoring check | No guaranteed evening premium; the window is AEMO's, the trace a median day; the battery blocks are Example values computed from bound fields; the window does not cover the whole night |
| Mobile | Chart full width; midday and evening buttons |
| Status | Rewritten in v1.2; unblocked (GAP-WA-RCM closed for 2028-29) |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why does WA pay for long batteries? | 为什么西澳要为长时储能付费？ |
| Copy | Because the evening lasts. Demand stays high for hours after sunset, and AEMO credits a battery only for the power it can hold across the whole window: ‹bound: duration requirement› hours for batteries first credited in the cycle this play enters. A shorter battery is credited as a smaller one. | 因为傍晚很长。日落后数小时内需求居高不下，而AEMO只按电池能在整个时段内持续输出的功率给予信用：对本方案所进入周期首次获得信用的电池，这一时段为‹bound: duration requirement›小时。时长较短的电池，只能按一台更小的电池计入信用。 |
| Meaning | The rule, not engineering preference, sets the minimum duration; below it, every missing hour costs credit. | 最低时长由规则而非工程偏好决定；低于这一时长，每少一小时都要损失信用。 |
| Marker | Strong evidence. What would change it: a new ESOO or rule change that alters the requirement for the cycle this play enters. | 证据充分。会改变判断的证据：新一期电力机会陈述（ESOO）或规则修订，改变本方案所进入周期的时长要求。 |
| Controls | Midday · Evening · Show the window AEMO counts | 中午 · 傍晚 · 显示AEMO计入的时段 |
| Labels | Grid demand, median summer business day · Obligation window (AEMO) · Example: 100 MW battery · Credited power · MW · AWST | 电网需求（夏季工作日中位值） · 义务时段（AEMO） · 示例：100MW电池 · 计入信用的功率 · MW · 西澳标准时间 |
| Caption | Grid demand: AEMO WEM data, median business day of the 2025-26 Hot Season. Window: AEMO, 2026 WEM Electricity Statement of Opportunities, Table 28, summer business days, storage first credited in the 2026 cycle; AEMO sets the exact intervals each day. | 电网需求：AEMO西澳电力市场数据，2025-26年夏季工作日中位日。时段：AEMO《2026 WEM Electricity Statement of Opportunities》表28，夏季工作日、2026周期首次获信用的储能；具体时段由AEMO逐日确定。 |

### wa-07 — Fast response is a different job

| Item | Shot specification |
| --- | --- |
| Scene | Day and night paused; a response ladder (seconds, minutes, hours) beside the battery and other resources |
| Feedback | Timescale and required capability change together |
| Evidence and chart | SRC-WA-06/07 (essential system services and accreditation); the WA model's services line is small beside capacity (`src/markets/wa/comparison.js`); product terms pending |
| Authoring check | No precise frequency curve without an event source; not every inverter provides every service |
| Mobile | Static ladder with expandable service cards |
| Status | Kept; Chinese drafted in v1.2 |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Is moving energy the same as responding to a fault? | 转移电能与应对故障是一回事吗？ |
| Copy | No. Responding to a disturbance is a separate service, paid for being ready rather than for hours. In this play it is a top-up, not the case. | 不是。应对扰动是另一项服务，付费依据是随时待命，而非持续时长。在本方案中它只是补充收入，而非投资逻辑的核心。 |
| Meaning | Services use headroom and add revenue only where they fit around capacity obligations. | 系统服务占用的是余量，只有在不妨碍容量义务时才能增加收入。 |
| Marker | Fair evidence. What would change it: the product terms for each essential system service. | 证据尚可。会改变判断的证据：逐项基本系统服务的产品条款。 |
| Controls | Energy over hours · Response in seconds | 数小时的电能 · 数秒内的响应 |

## 6. Add a battery

### wa-08 — Eight hours: the rule plus the fade

| Item | Shot specification |
| --- | --- |
| Scene | Stored energy, in hours at full power, drawn against the hours AEMO counts; the credited power reads out in HTML below the drawing |
| Feedback | Energy bands and the credited power change with the preset; "After fade" shrinks each battery's energy by an Example amount, so the ‹bound: duration requirement›-hour preset drops below full credit while the play's preset keeps it |
| Evidence and chart | CL-WA-07, CL-WA-10; the play's design result from the design-fit sweep (REPO-12; ‹bound: why›); the window from wa-06. Teaching unit: 100 MW, tagged Example |
| Authoring check | The fade step is a teaching value, not the model's degradation curve; the teaching node is not a site recommendation; no drag-to-improve-IRR control. Never say the extra hour is unpaid: it is paid through the credit it protects |
| Mobile | The same toggles, wrapped; credited MW in the readout |
| Status | Rewritten in v1.2 for `wa-cap-8h`. In `WP-07` (v1.2.1) the charge, discharge and empty controls were dropped: state of charge does not answer why the play has its duration |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why this duration? | 为什么是这个时长？ |
| Copy | A battery that can hold full power for ‹bound: duration requirement› hours earns full credits in its first year. Batteries fade and AEMO measures them again every year, so the play builds ‹bound: play duration› hours to hold the credit as the battery ages. On the platform's design test, at the quoted battery price, that gives the most value per MW; the shorter build earns a higher return on less capital. | 能以满功率持续‹bound: duration requirement›小时的电池，第一年即可拿到全额信用。但电池会衰减，AEMO每年都会重新核定，因此本方案建设‹bound: play duration›小时，让电池老化后仍能守住信用。按本平台的设计测试，以供应商报价的电池价格计，这一时长的每MW价值最高；较短的方案则以更少的资本换来更高的回报率。 |
| Meaning | Duration is a capital decision: the extra storage insures the credit, and the design grid on the market page prices it. | 时长是资本决策：多建的储能是为信用买的保险，市场页面的设计表给出了它的价格。 |
| Marker | Fair evidence. What would change it: a battery price or fade assumption that moves the design grid's best duration. | 证据尚可。会改变判断的证据：电池价格或衰减假设发生变化，使设计表中的最优时长改变。 |
| Controls | 4 hours (Example) · ‹bound: duration requirement› hours · ‹bound: play duration› hours · New · After fade (Example) | 4小时（示例） · ‹bound: duration requirement›小时 · ‹bound: play duration›小时 · 新电池 · 衰减后（示例） |
| Labels | Stored energy, in hours at full power · Hours AEMO counts · Credited power · Full credit · Below full credit · Example: 100 MW battery | 储存电能（满功率小时数） · AEMO计入的小时数 · 计入信用的功率 · 全额信用 · 低于全额信用 · 示例：100MW电池 |

### wa-09 — What the investor owns

| Item | Shot specification |
| --- | --- |
| Scene | Exploded isometric cutaway as SVG layers, with fixed hotspots: battery, PCS, transformer, connection, controls and safety, site works |
| Feedback | The selected part is highlighted with its function, cost category where the model exposes one, operating limit and evidence status |
| Evidence and chart | Equipment and function table; cost categories only where the model exposes them, otherwise "Breakdown not available" |
| Authoring check | Generic geometry is not a site drawing, fire design or equipment list; no confidential project detail in drawings or labels |
| Mobile | Static cutaway with a vertical hotspot list |
| Status | Kept; Chinese drafted in v1.2 |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What sits behind the word "battery"? | “电池”二字背后是什么？ |
| Copy | Battery modules, power conversion, transformers, controls, safety systems and the grid connection make one asset. In WA the valuable rights are the connection and the certified capacity. | 电池模组、功率变换系统、变压器、控制系统、安全系统和并网连接，共同构成一项资产。在西澳，真正有价值的权利是并网连接和经认证的容量。 |
| Meaning | Development rights, ready-to-build projects, operating assets and contracted assets are different things to buy; this play enters as a ‹bound: entry route›. | 开发权、可开工项目、运营资产和已签约资产是不同的投资标的；本方案的进入方式是‹bound: entry route›。 |
| Marker | Fair evidence. What would change it: the published supplier quotation's equipment list mapped to each part. | 证据尚可。会改变判断的证据：将已公开的供应商报价中的设备清单逐项对应到各部件。 |
| Controls | Equipment · Rights and obligations | 设备 · 权利与义务 |
| Hotspots | Battery modules: store energy as DC · Power conversion: turns DC into grid AC and back, and sets the MW · Transformer: steps the voltage up to the network · Grid connection: the right to export and import at this point · Controls and safety: dispatch, protection and fire safety · Site works: civil works, cabling and fencing · Breakdown not available | 电池模组：以直流形式储存电能 · 功率变换系统：在直流与电网交流之间转换，决定MW规模 · 变压器：把电压升至电网电压 · 并网连接：在该接入点送电和受电的权利 · 控制与安全：调度、保护和消防 · 场地工程：土建、电缆和围栏 · 暂无分项数据 |

## 7. Who pays

### wa-10 — Capacity first

| Item | Shot specification |
| --- | --- |
| Scene | The scene recedes; 2D payment paths for capacity (certification, Capacity Credits, availability across the window, settlement), energy (market, dispatch, settlement) and services (accreditation, enablement, settlement) |
| Feedback | The selected route's steps, then how it is paid, its obligation and its evidence status |
| Evidence and chart | Capacity route: CL-WA-10, CL-WA-11 (SRC-WA-09, clauses 4.11.3 and 4.29.1(b)(i); SRC-WA-14). Energy and services routes: SRC-WA-06/07, settlement clauses pending. Shares from the market page (REPO-05, REPO-13) |
| Authoring check | A credit is not a contract: the price is administered and reset each year. Capacity payments are not unlimited and do not guarantee debt service; modelled revenue is not a signed contract. Name the secured tenor and what follows it |
| Mobile | One route at a time as stacked steps |
| Status | Rewritten in v1.2: tenor and yearly price added. In `WP-07` (v1.2.1) payer and period gave way to how each route is paid, and the route steps were written out |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Who pays this battery, and for what? | 谁为这台电池付费？为什么付费？ |
| Copy | Capacity first. A credited battery is paid for being available across the evening window, which is ‹bound: secured share› of this play's modelled revenue, counted as secured for ‹bound: secured tenor› years and unsecured after. The price is reset every year and falls when capacity is in surplus. Energy trading and system services make up the rest. | 容量收入优先。获得信用的电池，因在整个傍晚时段保持可用而获得付费，这部分占本方案模型收入的‹bound: secured share›，前‹bound: secured tenor›年计为锁定收入，此后计为非锁定收入。容量价格每年重新确定，容量过剩时会下降。其余收入来自电能量交易和系统服务。 |
| Meaning | The capacity line carries this play; merchant spreads do not. A credit is not a contract, and its price moves every year. | 支撑本方案的是容量收入，而非现货价差。容量信用不是合同，其价格每年都会变化。 |
| Marker | Fair evidence. What would change it: the settlement clauses for the energy and services routes; the capacity route is already sourced. | 证据尚可。会改变判断的证据：电能量和系统服务两条路径的结算条款；容量路径已有出处。 |
| Controls | Capacity · Energy · System services | 容量 · 电能量 · 系统服务 |
| Labels | Paid · Obligation · Evidence | 计价 · 义务 · 证据 |
| Capacity route | Certified → Capacity Credits → Available across the window → Paid per credit. Paid: per MW of credit, per year, at a price set each year. Obligation: available across the evening window. Evidence: Strong: the rules are sourced | 获得认证 → 容量信用 → 在整个时段保持可用 → 按信用付费。计价：按每MW信用、每年计，价格每年确定。义务：在整个傍晚时段保持可用。证据：证据充分：规则已有出处 |
| Energy route | Offered → Dispatched → Paid per MWh. Paid: per MWh at the energy price. Obligation: deliver what is dispatched. Evidence: Fair: settlement clauses pending | 报价 → 获得调度 → 按MWh付费。计价：按电能量价格、每MWh计。义务：按调度指令出力。证据：证据尚可：结算条款待核 |
| Services route | Accredited → Enabled → Paid for readiness. Paid: per MW kept ready. Obligation: respond when called. Evidence: Fair: product terms pending | 获得资质 → 被启用 → 按待命付费。计价：按每MW待命计。义务：接到指令即响应。证据：证据尚可：产品条款待核 |

### wa-11 — One battery cannot promise everything

| Item | Shot specification |
| --- | --- |
| Scene | A 2D allocation board linked to the station, with time across and power and energy up |
| Feedback | The teaching board shows the conflict; project feasibility shows "unknown" unless constraints exist |
| Evidence and chart | REPO-06 stack feasibility; teaching values need a calculation record |
| Authoring check | Never add standalone maxima; in the experience model, `svcY` is a service cost, not ancillary revenue |
| Mobile | Commitment cards and a short conflict explanation |
| Status | Kept; Chinese drafted in v1.2 |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Can the battery collect every line at once? | 一台电池能同时拿到所有收入吗？ |
| Copy | No. The same megawatts and stored energy cannot be promised twice. In this example, evening capacity obligations come first, and services and trading use what is left. | 不能。同样的兆瓦和储存的电能，不能重复承诺。在这个示例中，傍晚的容量义务优先，系统服务和交易只能使用剩余部分。 |
| Meaning | Only compatible revenue belongs in the cash flow, which is how the model treats it. | 只有彼此兼容的收入才能计入现金流，模型正是这样处理的。 |
| Marker | Fair evidence. What would change it: a calculation record behind the teaching board's values. | 证据尚可。会改变判断的证据：教学示意板数值的计算记录。 |
| Controls | Evening capacity · Frequency services · Daytime trading | 傍晚容量 · 调频服务 · 日间交易 |
| Labels | Headroom left · Conflict · Project constraints: unknown | 剩余余量 · 冲突 · 项目约束：未知 |

## 8. The investment

### wa-12 and wa-13 — retired in v1.1

v1.0's delivery-to-receipt timeline (`wa-12`) and revenue-to-equity view (`wa-13`) duplicated the market page's Execution, Bankable case and Revenue sections. The story links to those sections from `wa-14` and from every chapter's "Go to the investment case" link. The IDs are not reused. The v1.0 requirements (commercial operation is not first settlement; dated payments preserved; all-equity and levered returns labelled) remain the job of the existing sections, and the v1.0 text is in commit `db158b9`.

### wa-14 — What could weaken it

| Item | Shot specification |
| --- | --- |
| Scene | Calm overview; competing storage drawn dashed in the evening window |
| Feedback | Each factor names the line it affects and links to the matching Downside input: capacity price to the fixed-payment input, late start to the delay input, costs to the build and opex inputs. Fade has no matching input and says so |
| Evidence and chart | CL-WA-10 (the window length is fixed for the term; fade is measured each year); CL-WA-11 (the price curve; the 2028-29 price below the benchmark); Downside definitions (REPO-05, `src/experience/downsideNarrative.js`) |
| Authoring check | A need for storage does not guarantee this project; a downside case is not a probability. Do not quote the 2028-29 price on the page: the market page has not yet taken it in (CF-WA-03) |
| Mobile | Four factor cards, then the links |
| Status | Rewritten in v1.2: v1.1's "if the mechanism pays for fewer hours" was the wrong way round, because the window length is fixed for this battery and the requirement for later entrants is rising |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What would make this play less attractive? | 什么会削弱这个方案？ |
| Copy | Price and fade, more than the rule. Once credited, this battery's window length is fixed for ‹bound: requirement term› years. What can weaken the play is a capacity price that falls as storage fills the evening, fade faster than planned, a late start that misses a capacity year, and costs. Next: ‹bound: next action› | 风险主要在价格和衰减，而不在规则。电池一旦获得信用，其时段长度在‹bound: requirement term›年内固定不变。可能削弱本方案的，是储能填满傍晚后下降的容量价格、快于预期的衰减、因延误错过一个容量年度，以及成本上升。下一步：‹bound: next action› |
| Meaning | Watch the capacity price and the fade, not the weather. | 要盯住的是容量价格和电池衰减，而不是天气。 |
| Marker | Strong evidence. What would change it: a rule change that removes the window-length protection or alters the price curve. | 证据充分。会改变判断的证据：取消时段长度保护或修改价格曲线的规则变更。 |
| Controls | Capacity price · Fade · Late start · Costs | 容量价格 · 衰减 · 延误 · 成本 |
| Factor cards | Affects capacity income; see the fixed-payment input · Affects credited MW; no matching downside input yet · Affects first revenue; see the delay input · Affects capital and running costs; see the build and opex inputs | 影响容量收入；见固定收入输入项 · 影响计入信用的MW；下行测试暂无对应输入项 · 影响首笔收入；见投运延误输入项 · 影响资本和运营成本；见建设与运维输入项 |
| Exits | Bankable case · Revenue · Execution · Downside · Compare with the NEM | 可融资方案 · 收益拆解 · 执行步骤 · 下行风险 · 对比全国电力市场 |

## 9. Readiness and sign-off

The hinge items of v1.1, in order, and where they stand:

| Item | v1.2 state |
| --- | --- |
| CL-WA-06, the 2006 start with a capacity mechanism (wa-00, wa-03) | Sourced: AEMO, ERA and Energy Policy WA pages and the 2014 Electricity Market Review options paper; NEM energy-only from the AEMC |
| GAP-WA-RCM and CL-WA-07, the obligation duration (wa-06, wa-08, wa-14) | Closed for 2028-29: 14 intervals, seven hours, held for ten years and re-measured yearly; window from Table 28, with one printed-interval conflict recorded (CF-WA-02) |
| GAP-WA-DAY, a representative day trace (wa-05, wa-06) | Method proposed: CALC-WA-DAY |
| CL-WA-05, the no-link claim (wa-01) | Sourced: AEMC; the 2014 options paper; AEMO's fact sheet |

Found on the way, and for the analyst rather than the story:

- **CF-WA-01.** The published play is `wa-cap-8h`, not `wa-cap-7h`; this script argues for it.
- **CF-WA-03.** AEMO assigned the 2028-29 Capacity Credits and set the 2028-29 price on 20 October 2026, the event the play's next action waits for.

At `G-1` the user is asked to confirm, in both languages:

1. The argument in §1, including the eight-hour reading of the rule and the fade.
2. The causal reading in wa-03 (CL-WA-09), the one interpretation the story rests on.
3. CALC-WA-DAY as the day trace for wa-05 and wa-06, and drawing the window as AEMO printed it.
4. Each shot's marker and "What would change it" line.
5. The Chinese drafts.

Production notes such as layout anchors and symbol IDs can be added later without changing a shot's question or meaning.
