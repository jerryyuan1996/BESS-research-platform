# Japan: One Storyboard for Three Allocation Markets

Pack: BESS-IX-2026-10-30; Japan script researched 5 November 2026; shot layout v1.2
Status: **G-1 draft, not signed off.** The script covers `jp_tokyo`, `jp_kyushu` and `jp_hokkaido`. It proposes one shared story with a regional lens (§1), anchors each region to its published call (§2), and asks the analyst for a go/no-go on the shared pack (§10). Nothing is built: no data, content module, scene, wiring, registry or contract change follows from this document.
Navigation: [Master plan](README.md) | [Narrative cards](market-narratives.md#3-eighteen-market-candidate-story-cards) | [Evidence specification](evidence-and-content-specification.md) | [Poland format](poland-storyboard.md) | [Sources and claims](source-register.md#g1-jp-evidence)

## 1. Can three markets share one story?

### 1.1 Recommendation

**Yes. Write one Japan story, load it as one pack, and point all three registry entries at it.** National chapters are written once. Three regional slots carry what differs. The pack reads the region from the row the market page already passes.

The case for sharing is in the published views, not only in the plan's v1.3 note:

| Field read on 5 Nov 2026 (REPO-JP-LIVE) | `jp_tokyo` | `jp_kyushu` | `jp_hokkaido` | Same? |
| --- | --- | --- | --- | --- |
| Fund call, `verdicts.infraFund.call` | `opportunistic` | `opportunistic` | `opportunistic` | Yes |
| Route and stage | operating, `ltda` | operating, `ltda` | operating, `ltda` | Yes |
| Play label | Long-term auction award · 9h build / 6h obligation | same | same | Yes |
| Play `why` | Identical string | Identical | Identical | Yes |
| `because` / `despite` | Identical strings | Identical | Identical | Yes |
| Watched trigger, expected | Round 4 bids close, 2027-02-03 | same | same | Yes, region-keyed IDs |
| Thesis | Five identical sentences, then one regional sentence | | | Last sentence differs |
| Next action | Same template, region named | | | Region named |
| Grades that differ | Study caps, curtailment, connection terms, asset return | | | Regional evidence only |

All three calls rest on one national rule, the long-term decarbonisation auction (LTDA), which OCCTO runs for the whole country except Okinawa and remote islands (SRC-JP-01 p. 10). Writing it three times would create three copies of one rule that drift apart, which the narrative cards forbid. The regions differ in four places: the tension that makes the area distinctive, what a battery does there inside the award, its signature data, and what could weaken the call. Those become regional slots. Everything else is shared.

### 1.2 Shared and regional shots

Each region's story has fourteen shots: eleven shared and three regional. The pack composes one story per region at open time, so every story the shell sees is an ordinary single-market story.

| Chapter | Shot | Shared or regional | What varies by region |
| --- | --- | --- | --- |
| Opening | `jp-00` The call | Shared frame | Bound card values; one regional sentence from the regional string table (§5.1); the area outlined on the thumbnail |
| Origins | `jp-01` Two grids, regulated recovery | Shared | The reader's area outlined on the map (a parameter, not a variant) |
| Origins | `jp-02` 2011: the east runs short | Shared | None |
| Historical choices | `jp-03` Reform in three steps | Shared | None |
| Historical choices | `jp-04` Markets lost the long view | Shared | None |
| Historical choices | `jp-05` The award's rules | Shared | The area's price ceiling binds per region; copy is identical |
| Today's tensions | `jp-06` A smaller pool, certified cells first | Shared | None |
| Today's tensions | `jp-tokyo-07` · `jp-kyushu-07` · `jp-hokkaido-07` | **Regional** | The area's tension, history node and grid scene |
| Today's tensions | `jp-08` The price is the decision (signature chart) | Shared chart, regional data | The reader's area highlighted; the other two shown muted behind a "Compare areas" toggle |
| Add a battery | `jp-09` Why a longer build for the award's floor | Shared | None |
| Add a battery | `jp-tokyo-10` · `jp-kyushu-10` · `jp-hokkaido-10` | **Regional** | What the battery does inside the award; regional evidence panel |
| Who pays | `jp-11` Who pays, on what conditions | Shared | None |
| Who pays | `jp-12` What the holder keeps | Shared | Bound model values per region |
| The investment | `jp-tokyo-13` · `jp-kyushu-13` · `jp-hokkaido-13` | **Regional** | What could weaken the call; links to the region's own market-page sections |

Three separate thirteen-shot scripts would mean about forty shot scripts with their translations. This plan has twenty: eleven shared and nine regional. The national source records and claims are kept once.

### 1.3 How each region's anchor is checked

The pack keeps one reviewed tuple per region, recorded in §2. `open(ctx)` resolves the region from `ctx.row.id`. Any other id returns `null`, and the reader gets the research dialog. Then it applies Poland's four guards to that region alone:

1. **Market.** `ctx.row.id` must be one of the three ids.
2. **Lens.** The lens must be `infraFund`.
3. **Call and play.** `row.call` and `row.play.id` must equal that region's `reviewedAgainst.call` and `playRef` (`jp-tokyo-ltda-6h`, `jp-kyushu-ltda-6h` or `jp-hokkaido-ltda-6h`), and `isStale()` must be false.
4. **Duration.** `row.play.hours` must equal the reviewed hours.

The composed story carries `marketId` and `reviewedAgainst` for its own region only. `validateStory()` and `isStale()` then run unchanged. A re-grade in one region sends only that region's readers back to research. The other two keep their story. One extra check fits the shared design: a unit test asserts that the eleven shared shots are byte-identical across the three compositions, so a shared shot cannot drift for one region.

### 1.4 What would change in code (described, not done)

| Area | Change needed | Size |
| --- | --- | --- |
| `src/experience/story/registry.js` | Three entries, `jp_tokyo`, `jp_kyushu` and `jp_hokkaido`, sharing one loader constant (`() => import('../../markets/jp/storyPack.js')`), each with its own `released` flag. `storyFor()` is unchanged. No `region` field is needed, because the pack reads the region from the row. | Three lines and a constant |
| Story contract (`contract.js`) | **None.** One composed story per region validates as a normal story. The shot-id pattern already accepts `jp-00` and `jp-tokyo-07`. | — |
| Shell, place and router | **None.** A shared shot id resolves on every region's page. A regional id opened on another region's page falls back to its chapter's first shot through `resolvePlace()`. `?region=compare` belongs to the dashboard, and the story ignores it. | — |
| Market page | **None.** `storyRows` stays `[row]`; Japan has no play-choice fork. | — |
| Vite chunk naming | **None.** `storyPack.js` under `src/markets/jp/` is emitted as `story-jp-[hash].js`: one chunk for three ids. | — |
| `tests/bundle-budget.test.js` | Add `'story-jp': 40` to the feature caps, and one test measuring the complete extra static graph of `story-jp` plus its lazy CSS, as for GB and CAISO. The existing per-market assertion `story-${id}-` keys Japan as `jp`, the dashboard id, so it already matches the shared chunk's name. | One cap and one test |
| New tests | Wiring: three ids, one loader, one chunk, released flags. Guards: each region opens on its own row and refuses the other two rows and a stale tuple. Parity: shared shots identical across compositions. Content: twenty shot tables bilingual, token parity and the no-typed-figure rule. | Market-local |
| Data placement | National records once in `src/markets/jp/data/`; regional records keyed by region. No catalogue or feed registration (§9). | — |

### 1.5 Bundle and budget effect

- **One chunk, one cap.** The three ids share one lazy chunk under the existing story cap of about 40 KiB gzip. A reader who visits Tokyo and then Kyushu downloads the pack once; the second open is served from the module cache.
- **Copy weight.** The chunk carries twenty shot tables rather than thirteen, about one and a half times a single market's copy. Copy is a small part of a story chunk next to the shell, kit and scenes, and the scenes reuse one map and one station kit. Expect the chunk to fit the cap; the build measures it, and nothing here is a measurement.
- **Not recommended: splitting the regional content into three sub-chunks.** That saves a few KiB per reader, adds a request at open, and needs new budget machinery.
- **Pre-opening graph unchanged.** The market page imports only the registry; the story stays out of the first load, as for every released market.

### 1.6 Where sharing would fail, and the fallback

Sharing holds while all three regions argue for the **same call through the same national mechanism**. It fails if a re-grade gives one region a different call or route. Examples: Hokkaido moved to Wait on connection risk, or Tokyo given a build route. The regional slots would then have to carry a different argument, not a different lens, and the shared opening and bridge would mislead.

**Fallback: three thin regional packs over one national module.** Shared shot tables and national records move to `src/markets/jp/story/national.js`. Each of `src/markets/jp-tokyo/`, `jp-kyushu/` and `jp-hokkaido/` gets a small `storyPack.js` that imports them and adds its own opening, regional shots and bridge. That gives three chunks, `story-jp-tokyo-…` and so on, three budget entries, and the national text still kept once. The cost is about three times the wiring and tests. The trigger for switching is any re-grade under rule 11 that makes the three tuples differ beyond their play ids.

## 2. Anchors

Read on 5 November 2026 from `view/markets/jp_tokyo.json`, `jp_kyushu.json` and `jp_hokkaido.json` and from the briefing computed in memory (`HOME_BRIEFING`, `src/briefing/homeData.js`) on `main` at `e7eda6f` (REPO-JP-LIVE). No file was written.

| Anchor | `jp_tokyo` | `jp_kyushu` | `jp_hokkaido` |
| --- | --- | --- | --- |
| Lens | `infraFund` | `infraFund` | `infraFund` |
| Call, rendered | `opportunistic`, **Situational / 择机投入** | same | same |
| Play (`playRef`) | `jp-tokyo-ltda-6h` | `jp-kyushu-ltda-6h` | `jp-hokkaido-ltda-6h` |
| Route, stage | `ltda`, operating | `ltda`, operating | `ltda`, operating |
| Play hours (installed) | 9 | 9 | 9 |
| Obligation hours (`economics.ltda.minDurationHours`) | 6 | 6 | 6 |
| Award term (`economics.ltda.years`) | 20 | 20 | 20 |
| Play label | Long-term auction award · 9h build / 6h obligation | same | same |
| Play evidence (`row.evidence`) | Fair | Fair | Fair |
| Watched trigger | `jp-tokyo-ltda-round-4-bids`, expected 2027-02-03 | `jp-kyushu-ltda-round-4-bids`, same date | `jp-hokkaido-ltda-round-4-bids`, same date |
| Verdict `asOf` / `reviewBy` | 2026-10-31 / 2027-03-31 | 2026-10-16 / 2027-03-31 | 2026-10-16 / 2027-03-31 |
| Fund shortlist position at check | 12th of 17 | 11th of 17 | 13th of 17 |
| Thesis, regional sentence | Tokyo's edge is price capture and connection quality | The upside left after clawback turns on charging access in curtailed hours and interconnector capacity | Underwrite charging-side headroom and the Hokkaido–Honshu reinforcement |
| Next action (`play.action.text`) | Before Round 4 bids close, list Tokyo award holders that might sell an operating asset, and the price at which each clears the platform's secured yield | Same, Kyushu | Same, Hokkaido |
| `reviewedAgainst` proposed | `{ playRef: 'jp-tokyo-ltda-6h', hours: 9, call: 'opportunistic', lens: 'infraFund', on: '2026-11-05' }` | Kyushu equivalent | Hokkaido equivalent |

The thesis, `why`, `because` and `despite` strings carry typed figures: the 4.5% bid return and a trade-press range for award prices. The story never copies them. Every figure in it binds to a field (§8). The six-hour obligation and nine-hour build follow ruling 4A of 31 October: play ids keep the obligation, labels name both quantities, and no figure moves (REPO-JP-RULINGS).

## 3. Argument and reading route

The story explains **one call in three places**: buy an operating award holder at a price that clears the fund's target, and do not build. The argument runs in this order:

1. **Origins.** Japan's grid grew as regulated regional utilities on two frequencies. Tariffs let them recover large investments, so a big plant could count on being paid back (CL-JP-15). In March 2011 the east ran short, and Tokyo rotated outages across its districts (CL-JP-17).
2. **Choices.** Japan reformed the system in three steps: a national coordinator, OCCTO, in 2015; full retail competition in 2016; separate grid companies in 2020 (CL-JP-16). By OCCTO's own account, open markets removed the long-term cost recovery that financed large plant. Japan therefore added a capacity market, paid one year at a time, from 2020, and a long-term auction for new low-carbon capacity from 2023 (CL-JP-15).
3. **The award.** A winning battery is paid a fixed amount per kW for twenty years in principle. It must discharge for six continuous hours, and its declared capacity is deemed to carry every operating risk, fade included. It hands back about nine-tenths of its other-market profit, bids under an area ceiling, and may price only a regulated return (CL-JP-05 to CL-JP-08, CL-JP-11, CL-JP-12).
4. **The tension.** Round 4 shrinks lithium-ion to a capped pool in which certified cells clear first (CL-JP-09, CL-JP-10). At a regulated return, a new build loses value at a fund's yields. The same award, bought operating below what it cost to build, clears the fund's target: the price is the decision (CL-JP-25, CL-JP-28).
5. **The battery.** Holding a six-hour floor for twenty years takes a nine-hour build without augmentation (CALC-JP-FADE). Inside the award, the regional differences remain: Tokyo's capture and connection, Kyushu's charging in curtailed hours, and Hokkaido's charging limits and link (regional shots).
6. **Payment.** OCCTO pays monthly. The holder meets performance requirements and the clawback, so revenue is nearly fixed, and cost, performance and entry price decide the return (CL-JP-08, CL-JP-25).

**Comprehension check:** from the story alone, the reader can say why a fund buys rather than builds, why the build is longer than the award's floor, and what the region adds once the clawback has taken most trading upside.

**Competing explanation:** award holders may have built far below the engine's cost (one public disclosure suggests so; gate G44). If so, Round 4 winners can earn a fund's yield on a new build, and the call would move toward building. Separately, the clawback leaves part of trading profit with the holder. A strong area-price capture could matter more in Tokyo than the model's merchant seed allows.

**Disconfirming condition:** Round 4 results showing certified bids clearing with headroom at a cost a fund can build to; an observed sale of an operating holder above the purchase ceiling, which means sellers will not discount; a re-grade of any region; or award terms changed for holders already contracted.

| Chapter / page heading EN · 简体中文 | Shots | What the reader can explain afterwards |
| --- | --- | --- |
| Opening · 开篇 | jp-00 | The call, the play and the next action for this area |
| Origins · 系统起点 | jp-01–02 | Two frequencies, regional utilities, regulated recovery; the 2011 shortage |
| Historical choices · 历史选择 | jp-03–05 | Reform; why a long-term award was added; the award's rules |
| Today's tensions · 当下矛盾 | jp-06, jp-‹region›-07, jp-08 | A smaller pool for new awards; this area's tension; why the price paid decides the investment |
| Add a battery · 加入电池 | jp-09, jp-‹region›-10 | Why the build is longer than the floor; what the battery does here inside the award |
| Who pays · 谁来付钱 | jp-11–12 | The payer, the conditions, and what the holder keeps |
| The investment · 回到投资 | jp-‹region›-13 | What weakens the call here, and where to check it |

Fourteen shots per area, about five minutes. Fixed-view isometric SVG from the shared kit, off-white and deep green, plain HTML copy and accessible 2D equivalents. The map reuses the repository's Japanese area boundaries (`src/markets/jp/jp-zones.json`, Natural Earth admin-1, public domain; areas as prefecture groups). Plant and project sites are never drawn, and no award holder is named.

### Rules for every shot

- **Figures.** Every page-facing amount, percentage, duration, count, date and plotted label is a named `‹bound: …›` token. Financial tokens resolve to fields the market page and briefing already compute (§8). Evidence tokens resolve to the dated records in the register. Nothing from `thesis`, `why`, `because`, `despite` or the trigger label is copied.
- **Shared means identical.** A shared shot's copy never names a region except through `‹bound: area name›`. A regional shot never restates a national rule differently from the shared shot that owns it.
- **No names.** No award holder, developer, project or site is named or located. The reference supplier's certification is practitioner evidence (ruling of 23 October). The page says "a certified maker" and does not name it.
- **Controls.** Only era, area comparison, clause, teaching battery preset, evidence drawer and hotspot. Nothing changes the investment case. Back, refresh and a language switch keep the reader's place, as in `WP-04`.
- **Evidence.** One marker per shot in the site's fixed strings, Strong evidence (证据充分), Fair evidence (证据尚可) or Thin evidence (证据单薄), followed by "What would change it:" / "会改变判断的证据：". A Strong marker assumes the analyst's review at G-1. `jp-00` keeps the play's own marker.
- **Time and bases.** Observations solid, plans dashed, teaching values tagged **Example / 示例**. Award payments (JPY per kW-year) never share an unlabelled axis with energy prices. Design values (USD per MW at the platform's yields) and acquisition prices (JPY per MW) are labelled wherever they appear and never swapped.
- **Language.** All page text is drafted in English and Simplified Chinese with the same meaning. Source titles keep their original language.

## 4. Opening

### jp-00 — The call · 投资判断 (shared frame)

| Item | Shot specification |
| --- | --- |
| Scene | Small static map of Japan's areas with the reader's area outlined, beside the existing play card; no animation |
| Feedback | None; this shot is the conclusion. A text alternative carries the card's fields in order |
| Evidence and chart | REPO-JP-LIVE; CL-JP-25. The existing market-page play card for `row`. No new chart |
| Authoring check | One card only. Japan has no second cohort. The regional sentence comes from §5.1 by `row.id`. Model figures bind current results. Do not copy the thesis, which carries the regulated return and a trade-press price range |
| Mobile | Card full width, then the regional sentence, then two buttons; no scene before the conclusion |
| Status | `sourced` / `model-assumes-route` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What is the call in ‹bound: area name›, and why is it a purchase rather than a build? | ‹bound: area name›的投资判断是什么？为什么是收购，而不是新建？ |
| Copy | **‹bound: call›** · ‹bound: play name› · ‹bound: card figures› · ‹bound: next action›. Japan's long-term auction award secures nearly all of a battery's revenue for ‹bound: award term› years. But a battery bid may price only a regulated return, and the holder hands back most of what it earns elsewhere. A fund earns its yield only by buying an operating award holder below what it cost to build. ‹bound: regional sentence› | **‹bound: call›** · ‹bound: play name› · ‹bound: card figures› · ‹bound: next action›。日本长期脱碳电源拍卖的中标合同，可在‹bound: award term›年内锁定电池几乎全部收入。但电池报价只能计入受监管的回报，中标者在其他市场所得的大部分也须上缴。基金只有以低于建设成本的价格收购已投运的中标资产，才能达到其收益率。‹bound: regional sentence› |
| Marker | The play's own marker | 沿用方案自身的证据标记 |
| Controls | Start the story · [Go to the investment case](/markets/‹bound: area slug›#bankable) | 开始阅读 · [查看投资方案](/markets/‹bound: area slug›#bankable) |

## 5. Regional string table and shared timeline

### 5.1 Regional sentence for jp-00

| Region | English | 简体中文 |
| --- | --- | --- |
| `jp_tokyo` | In Tokyo, what is left after the clawback is price capture in the largest demand area and the quality of a connection others queue for. | 在东京，扣除上缴后剩下的，是全国最大负荷区的价格兑现能力，以及他人仍在排队等待的并网条件。 |
| `jp_kyushu` | In Kyushu, it is whether the battery can charge in curtailed hours and how much room remains to export. | 在九州，关键在于电池能否在弃电时段充电，以及外送还剩多少空间。 |
| `jp_hokkaido` | In Hokkaido, it is headroom to charge, limits on charging at connection, and the link to Honshu. | 在北海道，关键在于充电裕度、并网时附带的充电限制，以及与本州的联络线。 |

### 5.2 Timeline nodes (page text)

The timeline is shared. Each region's own node is highlighted, and the other regions' nodes are drawn muted. The boundary falls after H-JP-06; later items are dashed.

| Node | Field | English | 简体中文 |
| --- | --- | --- | --- |
| Before ‹bound: H-JP-01 year› · Regulated recovery | Constraint | Large plant needed decades of predictable income. | 大型电源需要数十年可预期的收入。 |
| | Choice | Regional utilities recovered approved costs through regulated tariffs. | 区域电力公司通过受监管的电价回收经核准的成本。 |
| | What remains | Areas built for themselves, joined by few links. | 各区域各自建设，彼此之间联络线很少。 |
| | Effect today | Each area is its own market for a battery. | 对电池而言，每个区域都是一个独立的市场。 |
| ‹bound: H-JP-02 date› · The east runs short | Constraint | The earthquake and tsunami took a large share of eastern supply at once. | 地震和海啸使东部供电能力一下子损失了很大一部分。 |
| | Choice | Rotate outages across Tokyo's districts. | 在东京各区轮流停电。 |
| | What remains | Adequacy became a national question. | 供电充足性成为全国性问题。 |
| | Effect today | The reform that created today's auctions. | 由此开启的改革，催生了今天的拍卖机制。 |
| ‹bound: reform step 1›–‹bound: reform step 3› · Reform | Constraint | Regional monopolies and limited links between areas. | 区域垄断，区域间联络有限。 |
| | Choice | A national coordinator, open retail, separated grid companies. | 设立全国协调机构，全面放开零售，电网公司独立。 |
| | What remains | Prices set in short-term markets. | 由短期市场决定价格。 |
| | Effect today | No guaranteed recovery for new plant. | 新建电源不再有保障的成本回收。 |
| ‹bound: capacity market year›, ‹bound: LTDA year› · Capacity, then the long-term auction | Constraint | Short-term prices could not finance large new plant. | 短期价格无法支撑大型新建电源的融资。 |
| | Choice | Pay for capacity one year at a time, then for new low-carbon capacity over many years. | 先按年度为容量付费，再为新建低碳容量提供多年期付费。 |
| | What remains | Award holders on long contracts. | 持有长期合同的中标者。 |
| | Effect today | The asset the call buys. | 本判断所要收购的资产。 |
| ‹bound: H-JP-05 date› · Supply crunch in the east | Constraint | Thermal plant was retiring. | 火电机组陆续关停。 |
| | Choice | Keep adequacy on the agenda; widen the auction. | 继续把供电充足性放在议程上，并扩大拍卖范围。 |
| | What remains | Auctions repeated each year. | 拍卖每年举行。 |
| | Effect today | New rounds keep setting the terms new awards carry. | 每一轮新拍卖都在重设新中标合同的条款。 |
| ‹bound: bid close date› · ‹bound: next round› (dashed) | Choice | A capped lithium-ion pool; certified cells clear first. | 锂离子设上限；使用认定电芯的项目优先中标。 |
| | Effect today | The event the call watches. | 本判断所关注的事件。 |
| Kyushu · ‹bound: first curtailment date› | Event | First renewable curtailment on the Kyushu mainland. | 九州本土首次对新能源实施出力控制。 |
| Hokkaido · ‹bound: blackout date› | Event | Whole-area blackout after an earthquake; a first for Japan. | 地震后全区域大停电，日本首次。 |
| Tokyo · ‹bound: study cap date› | Event | One applicant may have only a limited number of connection studies open at once. | 每个申请人可同时进行的并网研究数量受到限制。 |

## 6. Shared chapters

### Origins · 系统起点

#### jp-01 — Two grids, regulated recovery · 两个电网，受监管的成本回收

| Item | Shot specification |
| --- | --- |
| Scene | Japan's areas from `jp-zones.json`; the east shaded for one frequency and the west for the other; converter stations as a narrow gate between them; links between areas as thin lines. The reader's area is outlined. A toggle switches the scene between "Two frequencies" and "Regulated recovery": the second dims the grid and shows a tariff box that returns costs to a plant symbol |
| Feedback | Labels change with the toggle; the caption stays outside the drawing |
| Evidence and chart | CL-JP-15 (OCCTO's account of regulated recovery, SRC-JP-01 p. 4); CL-JP-02 (frequencies and converters, repository-cited, SRC-JP-14); H-JP-01 |
| Authoring check | The frequency boundary runs through a prefecture, so prefecture-group outlines are approximate: draw the boundary as a labelled band, not a line. Converter capacity is repository-cited (OCCTO reinforcement status), not reopened; keep it out of copy until reopened (GAP-JP-FC). Do not draw plant or project sites |
| Mobile | Same map, text first, two toggle buttons |
| Status | Regulated recovery `sourced` (OCCTO); frequencies and converters `repository-cited` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What kind of system is this? | 这是一个怎样的电力系统？ |
| Copy | Japan's grid grew as regional utilities, each building for its own area. The east runs at ‹bound: east frequency› hertz and the west at ‹bound: west frequency›, so power crosses between the halves only through converter stations. For decades, regulated tariffs let these utilities recover what they spent, so a large plant could count on being paid back. | 日本电网由各区域电力公司分别建成，各自为本区域建设。东部频率为‹bound: east frequency›赫兹，西部为‹bound: west frequency›赫兹，两半之间的电力只能经由变频站交换。数十年来，受监管的电价让这些公司得以回收投资，大型电源可以确定地收回成本。 |
| Meaning | Each area is its own market for a battery, but the award that pays it is national. That award exists because regulated recovery ended, as the next chapter shows. | 对电池而言，每个区域都是独立的市场，但为它付费的中标合同是全国性的。下一章将说明，这一合同之所以存在，正是因为受监管的成本回收已经结束。 |
| Marker | Fair evidence. What would change it: OCCTO's current rating of the converter stations, reopened at its source. | 证据尚可。会改变判断的证据：在原始出处重新核实的OCCTO变频站现行额定容量。 |
| Controls | Two frequencies · Regulated recovery | 两种频率 · 受监管的成本回收 |
| Labels | East (‹bound: east frequency› Hz) · West (‹bound: west frequency› Hz) · Converter stations · Links between areas · Regulated tariff · Costs recovered | 东部（‹bound: east frequency›赫兹） · 西部（‹bound: west frequency›赫兹） · 变频站 · 区域间联络线 · 受监管电价 · 成本得以回收 |
| Caption | Schematic. Area outlines follow prefecture groups; the frequency boundary is approximate. | 示意图。区域轮廓按都道府县组合绘制，频率分界为近似位置。 |

#### jp-02 — 2011: the east runs short · 2011年：东部电力短缺

| Item | Shot specification |
| --- | --- |
| Scene | The east of the map at night; a district grid over the Tokyo area in which blocks switch off in rotation (reduced-motion: a static pattern with a legend); the converter gate from jp-01 drawn narrow |
| Feedback | The era toggle moves between "Before" and "March 2011"; one layer changes |
| Evidence and chart | CL-JP-17 (SRC-JP-06); H-JP-02; CL-JP-18 (interpretation, proposed) |
| Authoring check | The Fire and Disaster Management Agency's white paper dates the rotating outages (first carried out on 14 March 2011, 17:00; again on listed days to 28 March). The loss of eastern supply and the limited help through the converters are context, not yet located at a primary source (GAP-JP-FC2011): no capacity figure, no count of plants offline. Keep the event apart from the causal reading that it started the reform (CL-JP-18) |
| Mobile | Static rotation pattern, text first |
| Status | Outages `sourced`; supply loss and converter limit `candidate`; causal reading `proposed` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What happened when the east ran short? | 东部电力短缺时发生了什么？ |
| Copy | After the earthquake and tsunami of ‹bound: H-JP-02 date›, the east lost a large share of its supply at once. From ‹bound: H-JP-02 outage date›, Tokyo's utility cut power to its districts in rotation. Help from the west could arrive only through the converter stations. | ‹bound: H-JP-02 date›地震和海啸之后，东部的供电能力一下子损失了很大一部分。自‹bound: H-JP-02 outage date›起，东京的电力公司在各区轮流停电。来自西部的支援只能经由变频站送达。 |
| Meaning | The shortage made adequacy a national problem and set off the reform that created today's auctions. The award a battery holds descends from it. | 这次短缺使供电充足性成为全国性问题，并开启了催生今天各类拍卖机制的改革。电池所持有的中标合同正源于此。 |
| Marker | Fair evidence. What would change it: OCCTO's or METI's record of the supply lost and the transfers through the converters in ‹bound: H-JP-02 month›. | 证据尚可。会改变判断的证据：OCCTO或经产省关于‹bound: H-JP-02 month›供电损失及经变频站输送电量的记录。 |
| Controls | Before · ‹bound: H-JP-02 month› | 此前 · ‹bound: H-JP-02 month› |
| Labels | Rotating outages · Converter stations · Eastern supply lost | 轮流停电 · 变频站 · 东部供电损失 |

### Historical choices · 历史选择

#### jp-03 — Reform in three steps · 分三步推进的改革

| Item | Shot specification |
| --- | --- |
| Scene | The shared timeline under the map; three steps light in turn: a national coordinator joins the areas with a network symbol; retail customers fan out to many suppliers; the grid layer lifts away from generation and retail |
| Feedback | Selecting a node changes one layer; node text is in §5.2 |
| Evidence and chart | CL-JP-16 (SRC-JP-05); H-JP-03 |
| Authoring check | OCCTO's page dates the steps: April 2015, April 2016 and April 2020. The 2013 Cabinet decision is not on that page and stays out of copy until METI's record is opened (GAP-JP-REFORM-WHY). Legal unbundling separates grid companies from generation and retail; it does not mean the grids changed owner |
| Mobile | Vertical timeline, then the three layers |
| Status | `sourced` (OCCTO, opened 5 Nov 2026) |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | How did Japan change its power system? | 日本如何改革其电力系统？ |
| Copy | Japan reformed its system in three steps. In ‹bound: reform step 1› a national body, OCCTO, began coordinating the areas. In ‹bound: reform step 2› every customer could choose a retailer. In ‹bound: reform step 3› the grid companies were separated from generation and retail. | 日本分三步改革电力系统。‹bound: reform step 1›，全国性机构OCCTO开始协调各区域；‹bound: reform step 2›，所有用户都可以自由选择售电公司；‹bound: reform step 3›，电网公司与发电和售电业务分离。 |
| Meaning | Competition replaced guaranteed cost recovery. New plant now needed another way to be paid back. | 竞争取代了有保障的成本回收，新建电源需要另一种方式收回投资。 |
| Marker | Strong evidence. What would change it: a METI record dating the reform steps differently. | 证据充分。会改变判断的证据：经产省对改革步骤给出不同日期的记录。 |
| Controls | National coordinator · Open retail · Separate grids · Select a node | 全国协调机构 · 零售全面放开 · 电网独立 · 选择节点 |
| Labels | OCCTO · Retailers · Grid companies · Generation | OCCTO · 售电公司 · 电网公司 · 发电 |

#### jp-04 — Markets lost the long view · 市场失去了长期视野

| Item | Shot specification |
| --- | --- |
| Scene | A plant symbol with a long payback bar; under short-term prices the bar breaks into short, uneven segments. Two instruments then attach: a one-year capacity payment that renews each year, and a long bar labelled for the long-term auction |
| Feedback | Toggle: "Short-term prices" · "Capacity market" · "Long-term auction"; one layer changes |
| Evidence and chart | CL-JP-15 (SRC-JP-01 pp. 4–5); H-JP-04; H-JP-05 |
| Authoring check | This is OCCTO's stated rationale in the Round 4 guidelines' introduction; attribute it to OCCTO. The guidelines date the capacity market from FY2020 and the long-term auction from FY2023, and cite the March 2022 supply tightness in eastern Japan as the reason gas-fired plant was added. Fiscal years run April to March |
| Mobile | Three stacked bars |
| Status | `sourced` (OCCTO's account) |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why does Japan pay batteries through a long-term auction? | 日本为什么通过长期拍卖为电池付费？ |
| Copy | Once prices were set in short-term markets, OCCTO explains, investors could no longer count on recovering the cost of large new plant. Japan first added a capacity market from ‹bound: capacity market year›, which pays one year at a time. From ‹bound: LTDA year› it added a long-term auction that pays new low-carbon capacity, batteries included, for many years. The supply crunch in the east in ‹bound: H-JP-05 date› kept adequacy on the agenda. | OCCTO指出，价格改由短期市场决定后，投资者无法再确定能收回大型新建电源的成本。日本先于‹bound: capacity market year›年起引入容量市场，按年度付费；又于‹bound: LTDA year›年起增设长期拍卖，为包括电池在内的新建低碳容量提供多年期付费。‹bound: H-JP-05 date›东部电力供需紧张，使供电充足性继续留在议程上。 |
| Meaning | The award exists to make large investment predictable. That is why it pays nearly all of a battery's revenue, and why it limits what the battery may keep. | 这一中标合同的目的，是让大额投资变得可预期。这正是它几乎覆盖电池全部收入、同时又限制电池可留存收益的原因。 |
| Marker | Strong evidence. What would change it: a METI policy record giving a different purpose for the auction. | 证据充分。会改变判断的证据：经产省政策文件对该拍卖给出不同的目的。 |
| Controls | Short-term prices · Capacity market · Long-term auction | 短期价格 · 容量市场 · 长期拍卖 |
| Labels | One year at a time · Many years · New low-carbon capacity | 按年度 · 多年期 · 新建低碳容量 |

#### jp-05 — The award's rules · 中标合同的规则

| Item | Shot specification |
| --- | --- |
| Scene | A contract card with four clause tabs: Term, Floor, Clawback, Ceiling. Each tab changes one element of a station cutaway: a long time bar; a discharge bar held at the floor; a revenue bar with most of the trading slice returned; a bid arrow stopping under a ceiling |
| Feedback | One clause at a time; the selected clause names its source locator in the evidence drawer |
| Evidence and chart | CL-JP-05 (term, SRC-JP-01 p. 10); CL-JP-06 (six continuous hours, p. 13); CL-JP-07 (declared capacity carries all operating risk, p. 68); CL-JP-08 (clawback, p. 46); CL-JP-11 (ceiling by area, pp. 18–19) |
| Authoring check | The term is twenty years **in principle**, from the fiscal year after supply starts. From Round 4 a battery may elect a longer period, which this story does not discuss until the analyst rules (CF-JP-02). The obligation token and the model's `minDurationHours` must agree; a build test asserts it. The clawback is "about nine-tenths" of actual other-market profit, monitored by the Electricity and Gas Market Surveillance Commission. The model's retained share is a separate token (§8). The ceiling binds the reader's area; no ceiling value is typed |
| Mobile | Four clause buttons above one cutaway |
| Status | `sourced` (OCCTO Round 4 guidelines, opened 5 Nov 2026) |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What does a battery promise when it wins the award? | 电池中标后要承担哪些义务？ |
| Copy | A winning battery is paid a fixed amount per kW each year for ‹bound: award term› years in principle. In return it must be able to discharge for ‹bound: obligation hours› hours without stopping, and its declared capacity is deemed to allow for every operating risk, fade included. It hands back about ‹bound: clawback share› of its profit from other markets, and its bid may not exceed its area's ceiling. | 中标电池按每千瓦每年获得固定付费，原则上为期‹bound: award term›年。作为交换，它必须能够连续放电‹bound: obligation hours›小时，且其申报容量被视为已考虑全部运行风险，包括容量衰减。它须上缴在其他市场所获利润的约‹bound: clawback share›，报价也不得超过所在区域的上限。 |
| Meaning | The award fixes revenue and caps the upside. What the holder still controls is cost and performance against the floor. | 中标合同锁定了收入，也封住了上行空间。持有人仍能掌控的，是成本，以及能否守住最低时长要求。 |
| Marker | Strong evidence. What would change it: a change to the terms of awards already made; each new round resets the terms of new awards only. | 证据充分。会改变判断的证据：对已授予合同条款的修改；每一轮新拍卖只重设新中标合同的条款。 |
| Controls | Term · Floor · Clawback · Ceiling | 合同期限 · 最低时长 · 收益上缴 · 报价上限 |
| Labels | Paid per kW per year · Continuous discharge · Fade allowed for · Returned · Kept · Area ceiling | 按千瓦每年付费 · 连续放电 · 已计入衰减 · 上缴 · 留存 · 区域上限 |

### Today's tensions · 当下矛盾 (shared shots)

#### jp-06 — A smaller pool, certified cells first · 名额更少，认定电芯优先

| Item | Shot specification |
| --- | --- |
| Scene | A row of battery blocks queuing for a fixed-width pool. Blocks carrying a certification mark enter first in bid order; unmarked blocks wait and enter only if room is left. The pool edge is a hard wall. A dashed date marker shows when bids close |
| Feedback | Toggle "Certified first" on and off to see the order change; the pool width never changes |
| Evidence and chart | CL-JP-09 (pool and caps, SRC-JP-01 pp. 10, 35–36); CL-JP-10 (certified-cell priority, pp. 35–36); CL-JP-14 (bid window and results timing, p. 9); CL-JP-13 (prices not published, repository-cited); CL-JP-26 (reference supplier certified, practitioner) |
| Authoring check | Certification is under the Economic Security Promotion Act, for the maker's battery supply-assurance plan. The reference supplier's certification is practitioner evidence that METI's public list did not yet show on 23 October; it stays in authoring records and out of copy. Round 3's battery volume belongs to METI's paper, which was not reopened here (HTTP 403); do not compare the pool with it on the page. Results come about three months after bids close, in the following fiscal year |
| Mobile | Queue drawn vertically; one toggle |
| Status | `sourced` (OCCTO); price confidentiality `repository-cited`; supplier certification `practitioner` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | How hard will it be to win a new award? | 新的中标合同有多难拿到？ |
| Copy | In ‹bound: next round›, lithium-ion batteries compete for a pool of ‹bound: lithium-ion pool›, and no award is made beyond it. Projects on cells from makers certified under Japan's economic-security law clear first; others win only what is left. Bids close on ‹bound: bid close date›, and winning prices are not published one by one. | 在‹bound: next round›中，锂离子电池争夺‹bound: lithium-ion pool›的名额，超出部分一律不予中标。使用经日本经济安全保障法认定的厂商所产电芯的项目优先中标，其余项目只能分享剩下的名额。投标于‹bound: bid close date›截止，各项目的中标价格不单独公布。 |
| Meaning | New awards will be few and contested, so an operating award holder is a scarce asset. This round's results are the event the call watches. | 新中标名额少、竞争激烈，因此已投运的中标资产是稀缺资产。本轮结果正是本判断所关注的事件。 |
| Marker | Strong evidence. What would change it: the round's results, showing how much certified capacity bid and where the pool cleared. | 证据充分。会改变判断的证据：本轮结果所显示的认定电芯投标规模，以及名额在哪个价位出清。 |
| Controls | Certified first · Bid order only | 认定优先 · 仅按报价排序 |
| Labels | Lithium-ion pool · Certified maker's cells · Other cells · Bids close | 锂离子名额 · 认定厂商电芯 · 其他电芯 · 投标截止 |

#### jp-08 — The price is the decision · 价格就是决策 (signature chart / 核心图表)

| Item | Shot specification |
| --- | --- |
| Scene | Chart-JP-PRICE (§9). For the reader's area: a bar for the build cost of the play's design per MW, and beside it the purchase prices per MW at which an operating award holder clears the fund's target, as three ticks (cautious, reference, favourable). A shaded band between the reference price and build cost is labelled "discount the call needs". The "Compare areas" toggle shows the other two areas muted, on the same axis |
| Feedback | Hovering or focusing a tick shows its case, its target return and its basis; the accessible table carries every value |
| Evidence and chart | CL-JP-12 (regulated bid return, repository-cited); CL-JP-25 (model facts); CL-JP-28 (interpretation, ruled 16 Oct); CALC-JP-PRICE |
| Authoring check | Every value binds: the acquisition screen's reference cases (`briefing.acquisitions.infraFund`, `referenceCases[key]`) and the build-cost field confirmed at build (BUILD-JP-02). Both are JPY per MW. The design value of a new build is USD per MW at the platform's yields and is labelled separately; it never shares the axis. No award price is plotted, because METI does not publish them (CL-JP-13). The trade-press range in the trigger label stays off the chart |
| Mobile | Horizontal bars, area selector above; comparison opens as a table |
| Status | `model-assumes-route`; chart contract proposed, not built |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | If the award secures the revenue, why not build? | 既然中标合同能锁定收入，为什么不新建？ |
| Copy | METI limits the return a battery bid may price, so the award pays back a regulated return and little more. Building the play's design at today's cost loses value at a fund's yields: ‹bound: design value› per MW. The same award, bought from an operating holder, clears the fund's target at up to ‹bound: purchase ceiling› per MW, against a build cost of ‹bound: build cost per MW›. | 经产省限制了电池报价可计入的回报，因此中标合同只能带来受监管的回报，几乎没有更多。按当前成本新建本方案的设计，按基金收益率计算会损失价值：每兆瓦‹bound: design value›。同样的中标合同，若从已投运的持有人手中收购，收购价不高于每兆瓦‹bound: purchase ceiling›时即可达到基金的目标收益；相比之下，建设成本为每兆瓦‹bound: build cost per MW›。 |
| Meaning | What a fund pays for an award holder is the investment decision. Below the ceiling the call holds; above it, it does not. | 基金为中标资产支付的价格，就是投资决策本身。低于上限，判断成立；高于上限，判断不成立。 |
| Marker | Fair evidence. What would change it: an observed sale price for an operating Japanese award holder, or published award prices. | 证据尚可。会改变判断的证据：已投运日本中标资产的实际成交价格，或公开的中标价格。 |
| Controls | This area · Compare areas | 本区域 · 比较三个区域 |
| Labels | Build cost per MW · Purchase price that clears the target · Cautious · Reference · Favourable · Discount the call needs · Value of a new build, at the platform's yields (USD per MW) | 每兆瓦建设成本 · 达到目标收益的收购价 · 审慎 · 基准 · 乐观 · 本判断所需的折价 · 新建项目按本平台收益率计算的价值（美元/兆瓦） |
| Caption | Model values; bases labelled. No award price is shown because none is published. | 模型数值，口径均已标注。由于中标价格未公开，图中不显示中标价格。 |

### Add a battery · 加入电池 (shared shot)

#### jp-09 — Why a longer build for the award's floor · 为何要以更长的配置守住最低时长

| Item | Shot specification |
| --- | --- |
| Scene | The teaching battery at the play's duration. A fade line (Example) falls year by year across the award term and stays above the floor line at the last year. A second, shorter battery starting at the floor drops below it as soon as it starts to fade. The cutaway shows the extra hours as an added block |
| Feedback | Preset toggle: "Built at the floor" · "The play's design"; nothing writes the investment case |
| Evidence and chart | CL-JP-06, CL-JP-07 (SRC-JP-01 pp. 13, 68); CALC-JP-FADE; REPO-JP-RULINGS (floor ruling 16 Oct; augmentation ruling 12 Oct) |
| Authoring check | The fade path is a teaching Example drawn from the model's fade seed; tag it **Example**. The floor ruling sets the design as the smallest priced build that holds the floor in year twenty without augmentation. Warranty extension and a service agreement are paid annually, with no augmentation cost (ruling of 12 October). Do not call the extra hours spare capacity: they hold the obligation |
| Mobile | One battery at a time, preset buttons |
| Status | `sourced` rule; fade `model-assumption` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Why does the battery need more hours than the award asks for? | 为什么电池需要比中标要求更长的时长？ |
| Copy | The award asks for ‹bound: obligation hours› hours of continuous discharge in every year of its term, and the declared capacity must already allow for fade. A battery built at exactly ‹bound: obligation hours› hours falls short as soon as it starts to fade. The platform's design starts at ‹bound: play duration› hours so that it still holds the floor in year ‹bound: award term›, without adding cells later. | 中标合同要求在合同期内每年都能连续放电‹bound: obligation hours›小时，且申报容量必须已考虑衰减。恰好按‹bound: obligation hours›小时建设的电池，一开始衰减就达不到要求。本平台的设计从‹bound: play duration›小时起步，在不追加电芯的情况下，到第‹bound: award term›年仍能守住最低时长。 |
| Meaning | The extra hours are the cost of holding the floor. A buyer checks the holder's real fade and declared capacity, not the label on the asset. | 多出的时长，是守住最低时长要求的代价。买方要核查的是持有人实际的衰减情况和申报容量，而不是资产标签上的数字。 |
| Marker | Fair evidence. What would change it: the holder's warranted fade curve and the capacity it declared to OCCTO. | 证据尚可。会改变判断的证据：持有人的质保衰减曲线，以及其向OCCTO申报的容量。 |
| Controls | Built at the floor · The play's design | 按最低时长建设 · 本方案设计 |
| Labels | Floor · Fade (Example) · Final year · Added hours | 最低时长 · 衰减（示例） · 最后一年 · 追加时长 |

### Who pays · 谁来付钱

#### jp-11 — Who pays, and on what conditions · 谁来付钱，附带什么条件

| Item | Shot specification |
| --- | --- |
| Scene | Payment chain: electricity users → retailers → the capacity market → OCCTO → the award holder, with a monthly payment arrow. Two return arrows leave the holder: penalties for shortfall, and the clawback of other-market profit, with a surveillance badge on the clawback |
| Feedback | Selecting an arrow names its condition; the funding leg is drawn dashed until located |
| Evidence and chart | CL-JP-08 (clawback and surveillance, SRC-JP-01 p. 46); CL-JP-05 (annual amount per contracted kW, p. 41; monthly payment, contents §5); CL-JP-27 (funding chain, candidate) |
| Authoring check | OCCTO's guidelines establish the payer, the monthly payment, the requirements, assessments and penalties, and the clawback. They do not say who funds the payments; the users-and-retailers leg is a candidate until OCCTO's capacity-contribution rules are opened (GAP-JP-FUNDING). Do not call the award a subsidy |
| Mobile | Chain drawn vertically |
| Status | Payer and conditions `sourced`; funding leg `candidate` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | Who pays the award, and what can reduce it? | 中标合同由谁付钱？什么会减少这笔收入？ |
| Copy | OCCTO pays the award each month, an annual amount set per contracted kW. The holder must meet its performance requirements, with penalties for shortfalls, and must hand back about ‹bound: clawback share› of its profit from other markets. The Electricity and Gas Market Surveillance Commission checks those returns. The cost reaches electricity users through the capacity market. | OCCTO按月支付中标合同款项，年度金额按合同容量每千瓦计算。持有人必须满足履约要求，未达标将被处罚，并须上缴在其他市场所获利润的约‹bound: clawback share›。电力燃气交易监视等委员会负责核查上缴情况。这笔成本通过容量市场最终由电力用户承担。 |
| Meaning | The payer is a national institution, and the conditions are performance and the clawback. Lenders can rely on that. | 付款方是全国性机构，附带条件是履约和收益上缴，贷款方可以依赖这一点。 |
| Marker | Fair evidence. What would change it: OCCTO's capacity-contribution rules, showing who funds the award. | 证据尚可。会改变判断的证据：OCCTO关于容量市场分摊费用（容量拠出金）的规则，表明由谁为中标合同出资。 |
| Controls | Payment · Penalties · Clawback · Who funds it | 付款 · 处罚 · 收益上缴 · 资金来源 |
| Labels | Monthly payment · Per contracted kW · Penalty · Returned profit · Surveillance | 按月付款 · 按合同千瓦计 · 处罚 · 上缴利润 · 监视 |

#### jp-12 — What the holder keeps · 持有人能留下什么

| Item | Shot specification |
| --- | --- |
| Scene | One year's revenue bar for the reader's area: the award segment fills nearly all of it; a thin trading segment is split into returned and kept. Beside it, cost and entry price are the levers the holder controls |
| Feedback | "This area" · "Compare areas" shows the three bars side by side, muted except the reader's |
| Evidence and chart | CL-JP-25 (model facts, REPO-JP-LIVE); CL-JP-08 |
| Authoring check | Secured share and secured years come from the play's design economics (`econ.secured`, `econ.securedYears`). The kept share is the model's `JP_LTDA_MERCHANT_RETENTION`, a model input, not the rule; it binds as its own token beside the rule's clawback share. The merchant line is a seed for Japan (regions.js), so no regional trading figure is shown |
| Mobile | One bar, then a comparison table |
| Status | `model-assumes-route` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | After the award and the clawback, what decides the return? | 扣除中标合同收入和收益上缴之后，回报由什么决定？ |
| Copy | On the platform's model, the award covers ‹bound: secured share› of first-year revenue across the ‹bound: secured years›-year window, and the holder keeps ‹bound: retained share› of its trading profit. The rest of the return comes from what was paid for the asset and what it costs to run. | 按本平台模型，在‹bound: secured years›年的测算期内，中标合同覆盖首年收入的‹bound: secured share›，持有人保留交易利润的‹bound: retained share›。其余回报取决于资产的收购价格和运营成本。 |
| Meaning | Revenue is nearly fixed, so cost, performance and entry price decide the return. The regional differences matter, but they work through a small share. | 收入几乎是固定的，因此回报取决于成本、履约和收购价格。区域差异固然重要，但只通过很小的份额起作用。 |
| Marker | Fair evidence. What would change it: an operating holder's audited award payments and clawback statements. | 证据尚可。会改变判断的证据：已投运持有人经审计的中标合同收款和上缴记录。 |
| Controls | This area · Compare areas | 本区域 · 比较三个区域 |
| Labels | Award · Trading, returned · Trading, kept · Entry price · Running cost | 中标合同收入 · 交易利润（上缴） · 交易利润（留存） · 收购价格 · 运营成本 |

## 7. Regional shots

### 7.1 Today's tensions: this area · 当下矛盾：本区域

#### jp-tokyo-07 — The load centre behind a narrow gate · 窄门之后的负荷中心

| Item | Shot specification |
| --- | --- |
| Scene | The Tokyo area outlined; dense load symbols; the converter gate to the west drawn with its current rating solid and its planned expansion dashed; a connection queue of battery blocks at a network gate, with only a fixed number admitted to study at once |
| Feedback | Toggle "Today" · "After the converter expansion" (dashed); the queue toggle shows the per-applicant study limit |
| Evidence and chart | CL-JP-29 (largest demand area, OCCTO capacity results, repository-cited); CL-JP-02 (converters, repository-cited); CL-JP-24 (study cap, repository-cited); H-JP-02, H-JP-05 highlighted; Tokyo verified output control (SRC-JP-12) |
| Authoring check | "Largest demand area" rests on contracted capacity in OCCTO's delivery-year 2029 results (repository-anchored), not on a demand series. The study limit restricts throughput per applicant; it is not a measure of available capacity (grade reason). Tokyo's output-control days come from a different window from Kyushu's and Hokkaido's; never rank the three on them (CF-JP-04) |
| Mobile | Map, then queue |
| Status | `repository-cited`; reopen locators before G-2 |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What makes Tokyo different? | 东京有什么不同？ |
| Copy | Tokyo is Japan's largest demand area, on the eastern frequency, joined to the west through converters that are being expanded by ‹bound: converter year›. The supply crunches of ‹bound: H-JP-02 year› and ‹bound: H-JP-05 year› both hit this area. Getting a new battery connected is the bottleneck: since ‹bound: study cap date›, one applicant may have only ‹bound: study cap› connection studies open at a time. | 东京是日本最大的负荷区，位于东部频率区，经由变频站与西部相连，变频站正在扩容，预计于‹bound: converter year›完成。‹bound: H-JP-02 year›年和‹bound: H-JP-05 year›年的两次供电紧张都冲击了这一区域。新电池并网是瓶颈：自‹bound: study cap date›起，每个申请人同时只能进行‹bound: study cap›项并网研究。 |
| Meaning | An operating Tokyo battery already holds a connection that new entrants queue for. Its edge after the clawback is where it sits, not a larger award. | 已投运的东京电池已经拥有新进入者仍在排队等待的并网条件。扣除上缴后，它的优势在于所处的位置，而不是更高的中标价格。 |
| Marker | Fair evidence. What would change it: a Tokyo area-price capture backtest, and OCCTO's current converter rating reopened at its source. | 证据尚可。会改变判断的证据：东京区域价格兑现的回测，以及在原始出处重新核实的OCCTO变频站现行额定容量。 |
| Controls | Today · After the converter expansion · Connection queue | 当前 · 变频站扩容后 · 并网排队 |
| Labels | Tokyo area · Converters to the west · Planned (dashed) · Connection studies per applicant | 东京区域 · 通往西部的变频站 · 规划中（虚线） · 每个申请人的并网研究数 |

#### jp-kyushu-07 — A solar surplus with one exit · 光伏过剩，出口只有一条

| Item | Shot specification |
| --- | --- |
| Scene | The Kyushu area at noon: solar arrays across the island, a surplus arrow pressing against a single interconnection to Honshu; curtailed arrays greyed. Toggle "Since the transfer-trip system" widens the export arrow (no value drawn) |
| Feedback | Era toggle through the regional node; one layer changes |
| Evidence and chart | CL-JP-19 (FIT, suspension, first curtailment, SRC-JP-08); CL-JP-20 (transfer-trip system, SRC-JP-10); H-JP-KY-01, H-JP-KY-02; Kyushu verified output control (SRC-JP-12) |
| Authoring check | Kyushu Electric Power's own history page dates the FIT start, the suspension of replies to connection applications on the Kyushu mainland, and the first mainland curtailment. The network company's notice says the transfer-trip system raises renewable transfer over Kanmon and is expected to cut curtailment further; it gives no MW figure. "First on the Kyushu mainland" is the source's wording; do not say "first in Japan" (CF-JP-03). Curtailment is a sign of surplus, not free energy |
| Mobile | Map, then three dated steps |
| Status | `sourced` (Kyushu Electric Power and its network company, opened 5 Nov 2026) |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What makes Kyushu different? | 九州有什么不同？ |
| Copy | Solar spread fast across Kyushu after the feed-in tariff began in ‹bound: FIT date›. By ‹bound: suspension date› the utility had paused its replies to new connection applications on the mainland, and on ‹bound: first curtailment date› it curtailed renewable output there for the first time. Surplus leaves for Honshu through one interconnection; a transfer-trip system in service since ‹bound: transfer-trip date› lets more of it out. | ‹bound: FIT date›固定电价制度实施后，光伏在九州迅速普及。到‹bound: suspension date›，电力公司已暂停答复本土新的并网申请；‹bound: first curtailment date›，九州本土首次对新能源实施出力控制。富余电力只能经由一条联络线送往本州；自‹bound: transfer-trip date›起投运的转送遮断系统，让更多电力得以送出。 |
| Meaning | Curtailment shows the system has power to spare at noon. It is not free energy for a battery, and every gain in export shrinks it. | 弃电说明系统在中午有富余电力。但这并不是电池的免费能量，外送能力每提高一分，弃电就减少一分。 |
| Marker | Strong evidence. What would change it: OCCTO's record of curtailment after the transfer-trip system, compared with the years before it. | 证据充分。会改变判断的证据：转送遮断系统投运后OCCTO的弃电记录，与此前年份的对比。 |
| Controls | Feed-in tariff · Applications paused · First curtailment · Since the transfer-trip system | 固定电价制度 · 暂停受理答复 · 首次弃电 · 转送遮断系统投运后 |
| Labels | Solar surplus · Curtailed · Interconnection to Honshu · Transfer-trip system | 光伏富余 · 被弃电 · 通往本州的联络线 · 转送遮断系统 |

#### jp-hokkaido-07 — A windy island on a thin link · 风资源丰富、联络线薄弱的岛屿

| Item | Shot specification |
| --- | --- |
| Scene | Hokkaido with wind symbols over a small load; direct-current links under the strait to Honshu, the existing links solid and the addition dashed; a blackout layer for the 2018 node; network systems marked "charging-control connection" as hatched areas (no site positions) |
| Feedback | Era toggle: "September 2018" · "After the new link" · "Charging-control connections"; one layer changes |
| Evidence and chart | CL-JP-23 (blackout and new link, SRC-JP-07); CL-JP-21 (charging-control connection, SRC-JP-11); CL-JP-22 (link reinforcement, repository-cited); H-JP-HK-01, H-JP-HK-02; Hokkaido verified output control (SRC-JP-12) |
| Authoring check | OCCTO's committee report finds the area went dark at 03:25 on 6 September 2018, the first blackout of its kind in Japan, and expected the new Hokkaido–Honshu link to start in February–March 2019. HEPCO Network lists the systems where early connection needs a charging-control device; the list grew to twenty-seven on 10 April 2026, with reinforcement dates per system. The attachment with charging limits was not opened (GAP-JP-CHARGECTRL). Hatched areas are schematic; do not imply which system a holder sits on. The repository's zone note calls Hokkaido "the highest curtailment"; do not repeat that (CF-JP-04) |
| Mobile | Map, then three dated layers |
| Status | Blackout and list `sourced`; link capacity `repository-cited` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What makes Hokkaido different? | 北海道有什么不同？ |
| Copy | Hokkaido is a small system with strong wind, joined to Honshu by direct-current links under the strait. On ‹bound: blackout date› an earthquake set off a blackout of the whole area, a first for Japan. A new link followed in ‹bound: New Kitahon year›, and more capacity is being added by ‹bound: link year›. A battery that wants to connect early must accept a device that limits its charging, on ‹bound: charging-control systems› listed parts of the network. | 北海道是一个风资源丰富的小型电力系统，通过海峡下的直流联络线与本州相连。‹bound: blackout date›，一场地震引发全区域大停电，在日本尚属首次。此后于‹bound: New Kitahon year›年新增一条联络线，‹bound: link year›前还将继续扩容。希望提前并网的电池，在‹bound: charging-control systems›个指定电网系统中必须接受限制其充电的装置。 |
| Meaning | Room to charge and to export is the scarce input here. A holder whose connection limits charging may struggle to hold the award's floor. | 在这里，充电和外送的空间是稀缺资源。并网条件限制充电的持有人，可能难以守住中标合同的最低时长。 |
| Marker | Fair evidence. What would change it: HEPCO Network's charging-control terms, and the commissioning of the link expansion. | 证据尚可。会改变判断的证据：北海道电力网络的充电控制条款，以及联络线扩容的投运情况。 |
| Controls | ‹bound: blackout month› · After the new link · Charging-control connections | ‹bound: blackout month› · 新联络线投运后 · 充电控制并网 |
| Labels | Links to Honshu · Planned (dashed) · Charging-control connection (schematic) · Whole-area blackout | 通往本州的联络线 · 规划中（虚线） · 充电控制并网（示意） · 全区域停电 |

### 7.2 Add a battery: what it does here · 加入电池：它在这里做什么

#### jp-tokyo-10 — Trading inside the award · 在中标合同之内交易

| Item | Shot specification |
| --- | --- |
| Scene | Station cutaway at the play's duration over a Tokyo day (Example): charge in low-price hours, discharge into the evening peak, a balancing-service band; the revenue panel beside it splits the trading margin into returned and kept |
| Feedback | Day toggle "Weekday" · "Holiday" (Example shapes only); no value changes the case |
| Evidence and chart | CL-JP-08; CL-JP-24 (deposit and contribution terms, repository-cited, `tepcoDeposit`); CL-JP-25 |
| Authoring check | The day shape is an unscaled Example: Japan's merchant line is a seed pending the ETL (regions.js), so no observed Tokyo price curve is drawn. Balancing revenue is under gate G47 and stays qualitative. TEPCO Power Grid publishes the deposit and contribution terms; a buyer checks what the holder has paid and still owes |
| Mobile | Cutaway, then revenue panel |
| Status | Mechanism `sourced`; day shape `teaching-example` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What does a Tokyo battery do inside the award? | 东京电池在中标合同之内做什么？ |
| Copy | Inside the award, a Tokyo battery still trades. It charges when the area price is low, discharges into the evening peak, and can offer balancing services. It keeps only a small share of that margin. Tokyo's network company publishes its connection deposit and payment terms for batteries, so a buyer can check what the holder has paid and still owes. | 在中标合同之内，东京电池仍可交易：在区域电价低时充电，在晚高峰放电，并可提供调节服务。但它只能留下这部分利润中很小的一份。东京的电网公司公开了电池并网的保证金和付款条款，买方可以核查持有人已付和尚欠的款项。 |
| Meaning | Better price capture moves the return only a little after the clawback. Connection terms already settled are part of what a buyer pays for. | 扣除上缴后，更好的价格兑现对回报的影响很小。已经落定的并网条件，是买方所付价格的一部分。 |
| Marker | Fair evidence. What would change it: a Tokyo area-price capture backtest and the holder's connection contract. | 证据尚可。会改变判断的证据：东京区域价格兑现的回测，以及持有人的并网合同。 |
| Controls | Weekday (Example) · Holiday (Example) | 工作日（示例） · 节假日（示例） |
| Labels | Charge · Discharge · Balancing · Returned · Kept · Connection terms settled | 充电 · 放电 · 调节服务 · 上缴 · 留存 · 并网条款已落定 |

#### jp-kyushu-10 — Charging in curtailed hours · 在弃电时段充电

| Item | Shot specification |
| --- | --- |
| Scene | Two panels kept apart. **Physical:** a noon surplus with curtailed solar and the battery charging; the evening, discharging. **Revenue:** the award segment, then the trading margin split into returned and kept. A regional evidence panel below shows OCCTO's verified output-control days by month for the window on record (solid, observed) |
| Feedback | "Charging allowed" · "Charging restricted" toggles the physical panel only; the revenue panel changes only the kept slice's label |
| Evidence and chart | CL-JP-19, CL-JP-20; CL-JP-08; Kyushu verified output control (SRC-JP-12, repository-anchored days); Kyushu T&D output-control results (SRC-JP-09, not opened) |
| Authoring check | The physical and revenue panels must not merge: curtailment is not revenue. The month panel uses only the repository's anchored days and their window; no hours, no MW, and no comparison with other areas. A daily series from Kyushu T&D's workbook needs its own rights check, because the page states no terms (GAP-JP-CURTAIL). Whether a holder may charge in curtailed intervals depends on its connection terms; state it as a condition |
| Mobile | Physical panel, revenue panel, then month table |
| Status | Mechanism `sourced`; month panel `observed-data` (repository-anchored) |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What does a Kyushu battery do inside the award? | 九州电池在中标合同之内做什么？ |
| Copy | A Kyushu battery can charge while solar is being curtailed, if its connection lets it draw power then, and sell when the evening price returns. The award takes back most of that margin, so cheap charging adds little to the holder's return. What matters more is that the battery can always charge enough to hold the floor. | 九州电池可以在光伏被弃电时充电，前提是其并网条件允许在这些时段取电，然后在晚间电价回升时售电。中标合同会收回这部分利润的大半，因此廉价充电对持有人回报的提升有限。更重要的是，电池始终能充入足够的电量以守住最低时长。 |
| Meaning | Charging access in surplus hours protects performance under the award. It is not a source of large extra profit. | 在富余时段的充电权利，保障的是中标合同下的履约，而不是大额额外利润的来源。 |
| Marker | Fair evidence. What would change it: Kyushu's daily curtailment record matched to charging windows, and the holder's charging terms. | 证据尚可。会改变判断的证据：与充电时段匹配的九州每日弃电记录，以及持有人的充电条款。 |
| Controls | Charging allowed · Charging restricted | 允许充电 · 充电受限 |
| Labels | Curtailed solar · Charging · Evening discharge · Returned · Kept · Output-control days by month (observed) | 被弃电的光伏 · 充电 · 晚间放电 · 上缴 · 留存 · 按月出力控制天数（实测） |

#### jp-hokkaido-10 — Charging under control · 受控的充电

| Item | Shot specification |
| --- | --- |
| Scene | A year strip of the teaching battery's charging hours (Example): firm hours solid, hours the network may restrict hatched; the floor line from jp-09 overlaid; the link reinforcement as a dashed date on the strip |
| Feedback | Toggle "Firm connection" · "Charging-control connection"; the hatched hours appear only in the second |
| Evidence and chart | CL-JP-07 (declared capacity must allow for charging restrictions from early-connection measures, SRC-JP-01 p. 68); CL-JP-21; CL-JP-22 |
| Authoring check | OCCTO's form lists charging limits from early-connection measures, together with degradation, among the operating risks the declared capacity is deemed to carry. That is the hinge of this shot. The restricted hours are an unscaled Example until HEPCO Network's conditions are opened (GAP-JP-CHARGECTRL). Never imply that a specific holder is restricted |
| Mobile | Strip, then toggle |
| Status | Rule `sourced`; hours `teaching-example` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What does a Hokkaido battery do inside the award? | 北海道电池在中标合同之内做什么？ |
| Copy | A Hokkaido battery connected early may have its charging limited by the network until reinforcement is built. OCCTO treats such limits, like fade, as risks the declared capacity must already allow for, so a holder that declared too much faces penalties every year. The link to Honshu is being expanded, which eases export over time. | 提前并网的北海道电池，在电网加固完成之前，其充电可能受到电网限制。OCCTO将这类限制与衰减一样，视为申报容量必须事先考虑的风险，因此申报过高的持有人每年都会面临处罚。通往本州的联络线正在扩容，外送压力会随时间缓解。 |
| Meaning | Before buying a Hokkaido holder, check its charging limits against the hours the award requires. This is the highest connection risk of the three areas. | 收购北海道的中标资产之前，先核对其充电限制与中标合同要求的时长。这是三个区域中并网风险最高的。 |
| Marker | Fair evidence. What would change it: HEPCO Network's charging-control conditions and the holder's declared capacity. | 证据尚可。会改变判断的证据：北海道电力网络的充电控制条件，以及持有人的申报容量。 |
| Controls | Firm connection · Charging-control connection | 常规并网 · 充电控制并网 |
| Labels | Firm charging hours · Hours the network may restrict (Example) · Floor · Link expansion (dashed) | 可确定的充电时段 · 电网可能限制的时段（示例） · 最低时长 · 联络线扩容（虚线） |

### 7.3 The investment: what could weaken it · 回到投资：什么会削弱它

Each regional bridge shares one structure: the shared risks first, then the area's own, then links to the region's market-page sections (`#bankable`, `#revenue`, `#execution`, `#downside` under `/markets/‹bound: area slug›`). No probability is implied.

#### jp-tokyo-13 — What could weaken the Tokyo call · 什么会削弱东京的判断

| Item | Shot specification |
| --- | --- |
| Scene | A short checklist beside the map; each item links to its market-page section |
| Feedback | Selecting an item opens its section |
| Evidence and chart | CL-JP-09, CL-JP-14, CL-JP-25; CL-JP-02, CL-JP-24 |
| Authoring check | The story does not rebuild the market page's financial sections. The seller's price is the first risk because it decides the call. Converter expansion is an official plan, dashed |
| Mobile | Checklist |
| Status | `sourced` / `model-assumes-route` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What could weaken the Tokyo call, and where do I check it? | 什么会削弱东京的判断？在哪里核查？ |
| Copy | A seller asking more than the purchase ceiling. ‹bound: next round› results that let new builds clear at a fund's yields. Fade faster than the holder declared. More converter and interconnector capacity narrowing Tokyo's price premium. Connection terms still owed that the price did not allow for. | 卖方要价高于收购上限；‹bound: next round›结果显示新建项目可按基金收益率出清；衰减快于持有人的申报；变频站和联络线扩容收窄东京的价格溢价；收购价格未考虑到的尚欠并网款项。 |
| Meaning | Each item is checked on the market page: price in the Bankable case, trading in Revenue, connection in Execution, and the rest in Downside. | 每一项都可在市场页面核查：价格见“可融资方案”，交易见“收益拆解”，并网见“执行步骤”，其余见“下行风险”。 |
| Marker | Fair evidence. What would change it: the ‹bound: next round› results and an observed sale of a Tokyo award holder. | 证据尚可。会改变判断的证据：‹bound: next round›结果，以及东京中标资产的实际成交。 |
| Controls | [Bankable case](/markets/japan-tokyo#bankable) · [Revenue](/markets/japan-tokyo#revenue) · [Execution](/markets/japan-tokyo#execution) · [Downside](/markets/japan-tokyo#downside) | [可融资方案](/markets/japan-tokyo#bankable) · [收益拆解](/markets/japan-tokyo#revenue) · [执行步骤](/markets/japan-tokyo#execution) · [下行风险](/markets/japan-tokyo#downside) |

#### jp-kyushu-13 — What could weaken the Kyushu call · 什么会削弱九州的判断

| Item | Shot specification |
| --- | --- |
| Scene | As jp-tokyo-13, with the Kyushu map |
| Feedback | As jp-tokyo-13 |
| Evidence and chart | CL-JP-09, CL-JP-14, CL-JP-25; CL-JP-19, CL-JP-20 |
| Authoring check | Less curtailment is a downside for trading, not for the award. Say so plainly, as the dashboard does |
| Mobile | Checklist |
| Status | `sourced` / `model-assumes-route` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What could weaken the Kyushu call, and where do I check it? | 什么会削弱九州的判断？在哪里核查？ |
| Copy | A seller asking more than the purchase ceiling. ‹bound: next round› results that let new builds clear at a fund's yields. Fade faster than the holder declared. More export capacity and more batteries chasing the same noon hours, so curtailment shrinks. Charging terms that do not allow the battery to draw power when surplus occurs. | 卖方要价高于收购上限；‹bound: next round›结果显示新建项目可按基金收益率出清；衰减快于持有人的申报；外送能力提高、争抢同一午间时段的电池增多，弃电随之减少；充电条款不允许电池在富余时段取电。 |
| Meaning | Each item is checked on the market page: price in the Bankable case, trading in Revenue, connection in Execution, and the rest in Downside. | 每一项都可在市场页面核查：价格见“可融资方案”，交易见“收益拆解”，并网见“执行步骤”，其余见“下行风险”。 |
| Marker | Fair evidence. What would change it: the ‹bound: next round› results and an observed sale of a Kyushu award holder. | 证据尚可。会改变判断的证据：‹bound: next round›结果，以及九州中标资产的实际成交。 |
| Controls | [Bankable case](/markets/japan-kyushu#bankable) · [Revenue](/markets/japan-kyushu#revenue) · [Execution](/markets/japan-kyushu#execution) · [Downside](/markets/japan-kyushu#downside) | [可融资方案](/markets/japan-kyushu#bankable) · [收益拆解](/markets/japan-kyushu#revenue) · [执行步骤](/markets/japan-kyushu#execution) · [下行风险](/markets/japan-kyushu#downside) |

#### jp-hokkaido-13 — What could weaken the Hokkaido call · 什么会削弱北海道的判断

| Item | Shot specification |
| --- | --- |
| Scene | As jp-tokyo-13, with the Hokkaido map |
| Feedback | As jp-tokyo-13 |
| Evidence and chart | CL-JP-09, CL-JP-14, CL-JP-25; CL-JP-07, CL-JP-21, CL-JP-22 |
| Authoring check | Charging limits come first among the regional risks because they bear directly on the floor (CL-JP-07). Reinforcement dates are official plans, dashed |
| Mobile | Checklist |
| Status | `sourced` / `model-assumes-route` |

| Page text | English | 简体中文 |
| --- | --- | --- |
| Question | What could weaken the Hokkaido call, and where do I check it? | 什么会削弱北海道的判断？在哪里核查？ |
| Copy | A seller asking more than the purchase ceiling. ‹bound: next round› results that let new builds clear at a fund's yields. Fade faster than the holder declared. Charging limits that outlast commissioning and cut into the hours the award requires. A delay to the reinforcement, or a second project competing for the same headroom. | 卖方要价高于收购上限；‹bound: next round›结果显示新建项目可按基金收益率出清；衰减快于持有人的申报；充电限制在投运后仍然存在，并侵蚀中标合同要求的时长；电网加固推迟，或另一个项目争夺同一份裕度。 |
| Meaning | Each item is checked on the market page: price in the Bankable case, trading in Revenue, connection in Execution, and the rest in Downside. | 每一项都可在市场页面核查：价格见“可融资方案”，交易见“收益拆解”，并网见“执行步骤”，其余见“下行风险”。 |
| Marker | Fair evidence. What would change it: HEPCO Network's charging-control conditions and an observed sale of a Hokkaido award holder. | 证据尚可。会改变判断的证据：北海道电力网络的充电控制条件，以及北海道中标资产的实际成交。 |
| Controls | [Bankable case](/markets/japan-hokkaido#bankable) · [Revenue](/markets/japan-hokkaido#revenue) · [Execution](/markets/japan-hokkaido#execution) · [Downside](/markets/japan-hokkaido#downside) | [可融资方案](/markets/japan-hokkaido#bankable) · [收益拆解](/markets/japan-hokkaido#revenue) · [执行步骤](/markets/japan-hokkaido#execution) · [下行风险](/markets/japan-hokkaido#downside) |

## 8. Copy, evidence and binding registers

### Financial bindings that already exist

Authoring references, not a new adapter. `row` is the Japanese row the market page passes for the infrastructure-fund lens. `m` is `row.market`. `b` is `HOME_BRIEFING`. The at-check column lets the analyst review the script against the live case; it never becomes page copy.

| Token | Existing owner and field | At check, 5 Nov 2026, Tokyo / Kyushu / Hokkaido (reviewer reference only) | Uses |
| --- | --- | --- | --- |
| ‹bound: call› | `CALLS[row.call]` | Situational / 择机投入, all three | jp-00 |
| ‹bound: play name› | `playTitle(row.play, row.stage)` | Long-term auction award · 9h build / 6h obligation · operating | jp-00 |
| ‹bound: card figures› | The decision panel's metrics for `row` | Read at build | jp-00 |
| ‹bound: next action› | `row.play.action.text` | Region-named Round 4 action | jp-00 |
| ‹bound: play evidence› | `row.evidence` | Fair, all three | jp-00 |
| ‹bound: area name› · ‹bound: area slug› | `m.manifest.name`, `m.manifest.slug` | Japan — Tokyo Area, `japan-tokyo`; Kyushu; Hokkaido | jp-00, jp-13s |
| ‹bound: regional sentence› | The regional string table (§5.1), keyed by `row.id`; content, not a model field | Three drafted pairs | jp-00 |
| ‹bound: play duration› | `row.play.hours` | 9 | jp-09 |
| ‹bound: obligation hours› | `m.comparison.economics.ltda.minDurationHours`; must equal the SRC-JP-01 p. 13 record | 6 | jp-05, jp-09 |
| ‹bound: award term› | `m.comparison.economics.ltda.years` | 20 | jp-00, jp-05, jp-09 |
| ‹bound: retained share› | `JP_LTDA_MERCHANT_RETENTION`, as a percentage | 10% | jp-12 |
| ‹bound: secured share› · ‹bound: secured years› | `b.plays[row.id + '/' + row.play.id].econ.secured`, `.securedYears` | Read at build | jp-12 |
| ‹bound: design value› | `b.plays[…].econ.value`, USD per MW at the platform's yields | −$386,324 / −$376,386 / −$413,666 | jp-08 |
| ‹bound: purchase ceiling› | `b.acquisitions.infraFund[market].referenceCases[key='base'].pricePerMW`, JPY per MW | ¥247.2m / ¥249.1m / ¥242.0m | jp-08 |
| Cautious and favourable ticks | Same row, `key='cautious'` and `key='favourable'` | ¥140.5m–¥254.9m / ¥141.7m–¥259.3m / ¥137.0m–¥249.4m | jp-08 chart |
| ‹bound: purchase target› | Same row, `targetReturn` | Read at build | jp-08 tooltip |
| ‹bound: build cost per MW› | Build cost of the play's design per MW, JPY; field confirmed at build (BUILD-JP-02) | Read at build | jp-08 |
| ‹bound: trigger date› | `b.triggers[row.next].expected` | 2027-02-03 | jp-06 (as ‹bound: bid close date›) |

A missing value hides its sentence and shows the missing-state copy; it never prints zero.

### Evidence bindings proposed for later implementation

References to the dated records in the register, **not runtime fields**. The build creates and validates them.

| Token | Record and field | Units / limit |
| --- | --- | --- |
| ‹bound: east frequency› · ‹bound: west frequency› | CL-JP-02 record | Hertz |
| ‹bound: converter year› | CL-JP-02, planned completion of the converter expansion | Fiscal year-end |
| ‹bound: H-JP-01 year› | H-JP-01, full retail liberalisation (SRC-JP-05) | Year |
| ‹bound: H-JP-02 date› · ‹bound: H-JP-02 outage date› · ‹bound: H-JP-02 month› · ‹bound: H-JP-02 year› | H-JP-02 (SRC-JP-06) | Earthquake date; first rotating outage; month; year |
| ‹bound: reform step 1› · ‹bound: reform step 2› · ‹bound: reform step 3› | H-JP-03 (SRC-JP-05) | Month and year |
| ‹bound: capacity market year› · ‹bound: LTDA year› | H-JP-04 (SRC-JP-01 p. 4) | Fiscal year |
| ‹bound: H-JP-05 date› · ‹bound: H-JP-05 year› | H-JP-05 (SRC-JP-01 p. 4) | Month and year |
| ‹bound: clawback share› | CL-JP-08 (SRC-JP-01 p. 46) | "about nine-tenths", as a word pair, not a model value |
| ‹bound: next round› · ‹bound: lithium-ion pool› · ‹bound: bid close date› | CL-JP-09, CL-JP-14 (SRC-JP-01 pp. 9–10) | Round name; MW; date |
| ‹bound: study cap› · ‹bound: study cap date› | CL-JP-24, per region (SRC-JP-13) | Count; effective date |
| ‹bound: FIT date› · ‹bound: suspension date› · ‹bound: first curtailment date› | CL-JP-19 (SRC-JP-08) | Month and year; dates |
| ‹bound: transfer-trip date› | CL-JP-20 (SRC-JP-10) | Date |
| ‹bound: blackout date› · ‹bound: blackout month› · ‹bound: New Kitahon year› | CL-JP-23 (SRC-JP-07) | Date; month; year |
| ‹bound: link year› | CL-JP-22 (SRC-JP-15) | Fiscal year-end |
| ‹bound: charging-control systems› | CL-JP-21 (SRC-JP-11) | Count at the notice date |
| Output-control days by month | SRC-JP-12, per region, with its window | Days; no cross-region ranking |
| ‹bound: research check date› · ‹bound: source checked date› | Register check dates | Locale date |

### Remaining visible text EN / 简体中文

| Context | English | 简体中文 |
| --- | --- | --- |
| Story button and navigation | Story · Previous · Next · Chapters · Sources | 故事 · 上一节 · 下一节 · 章节 · 来源 |
| Area switch note | This story is told for ‹bound: area name›. The other areas have their own. | 本故事针对‹bound: area name›讲述，其他区域各有其故事。 |
| Evidence drawer | Source · Locator · Checked on ‹bound: source checked date› · Definition | 来源 · 具体位置 · 核查时间：‹bound: source checked date› · 统计口径 |
| Marker strings | Strong evidence. · Fair evidence. · Thin evidence. · What would change it: | 证据充分。 · 证据尚可。 · 证据单薄。 · 会改变判断的证据： |
| Legend | Schematic · Observed · Official plan · Example · Model value | 示意 · 实测 · 官方规划 · 示例 · 模型数值 |
| Map | Japan · East · West · Converter stations · ‹bound: area name› | 日本 · 东部 · 西部 · 变频站 · ‹bound: area name› |
| Chart accessible summary | For ‹bound: area name›: build cost of the play's design per MW, and the purchase prices per MW at which an operating award holder clears the fund's target, in three cases. Values are model results in JPY per MW | ‹bound: area name›：本方案设计的每兆瓦建设成本，以及在三种情景下已投运中标资产达到基金目标收益的每兆瓦收购价。数值为模型结果，单位为日元/兆瓦 |
| Exits | Go to the investment case · Back to the play | 前往投资方案 · 返回方案卡 |
| Stale call | This story was last reviewed against the call of ‹bound: research check date›. | 本故事最近一次依据‹bound: research check date›的投资判断复核。 |
| Loading / retry | Loading source data… · Could not load data · Retry | 正在载入来源数据… · 数据未能载入 · 重试 |
| Missing financial binding | Current case unavailable; review the market case | 当前情景暂不可用；请查看市场方案 |
| Missing evidence binding | Figure withheld until its source is checked | 来源核实前暂不显示该数值 |
| Reduced motion | Read the explanation; the selected state is shown without animation | 阅读文字说明；当前选择直接显示，无需动画 |

## 9. Signature chart and calculations

**One parameterised chart, Chart-JP-PRICE**, is proposed as the signature for all three areas, instead of the three different charts sketched in the v1.3 cards. The reason is the call: in every area it is the same purchase-price decision, so the picture that explains it is the price. The cards' regional chart ideas move into the regional battery shots as evidence panels: Kyushu's output-control months in jp-kyushu-10, and Hokkaido's firm against controlled charging hours in jp-hokkaido-10. Tokyo has no regional chart, because its edge is location and connection, which a map shows better. The analyst decides at G-1 (§10, item 2).

| Field | Chart-JP-PRICE |
| --- | --- |
| Question | At what price does an operating award holder clear the fund's target, and how far is that below the cost of building one? |
| Inputs | The acquisition screen's three reference cases per area (`pricePerMW`, `targetReturn`); the build cost of the play's design per MW (BUILD-JP-02); the design value of a new build, as a label only |
| Method | No new calculation. The story plots values the acquisition screen and design grid already compute (CALC-JP-PRICE). Discount the call needs = build cost − reference price, computed at render from bound fields and labelled as a difference, not a return |
| Units | JPY per MW on one axis; the design value in USD per MW as a separate label |
| Limits | No award price; no observed transaction; no regional trading figure. The three areas share an axis only behind the comparison toggle |
| Accessibility | A table with area, case, price, target return and build cost |

**CALC-JP-FADE**, the reviewer reference for jp-09, follows the repository's `termCheck` (`src/comparison/designFit.js`): year-twenty capacity = installed hours × (1 − fade)^(term − 1). With the live inputs, 9 × 0.98¹⁹ ≈ 6.13 hours against the 6-hour floor, and 6 ÷ 0.98¹⁹ ≈ 8.81 hours at commissioning would just hold it (floor plan of 16 October). Page copy binds the inputs and never prints these results.

**CALC-JP-PRICE** is recorded in [the register](source-register.md#g1-jp-evidence).

### Source-to-shot mapping

| Shot | Claims → sources | Chart / binding owner | Likely misreading prevented |
| --- | --- | --- | --- |
| jp-00 | CL-JP-25 → REPO-JP-LIVE | Existing play card | A build call; the thesis's typed figures shown as current |
| jp-01 | CL-JP-15 → SRC-JP-01; CL-JP-02 → SRC-JP-14 | Map | One national market for a battery; plant locations implied |
| jp-02 | CL-JP-17 → SRC-JP-06; CL-JP-18 proposed | Era layer | The outage alone created the reform; a supply figure implied |
| jp-03 | CL-JP-16 → SRC-JP-05 | Timeline | Unbundling read as a change of owner |
| jp-04 | CL-JP-15 → SRC-JP-01 | Bars | The award read as a subsidy for batteries alone |
| jp-05 | CL-JP-05/06/07/08/11 → SRC-JP-01 | Clause records | The floor read as nameplate; the clawback read as optional |
| jp-06 | CL-JP-09/10/13/14/26 → SRC-JP-01, SRC-JP-03/04, SRC-JP-16 | Round records | Certification read as a guaranteed award; prices assumed public |
| jp-tokyo-07 | CL-JP-29/02/24 → SRC-JP-13/14/17 | Regional records | The study cap read as a capacity measure |
| jp-kyushu-07 | CL-JP-19/20 → SRC-JP-08/10 | Regional records | Curtailment read as free energy; "first in Japan" |
| jp-hokkaido-07 | CL-JP-21/22/23 → SRC-JP-07/11/15 | Regional records | A named holder implied to be restricted |
| jp-08 | CL-JP-12/25/28 → SRC-JP-03, REPO-JP-LIVE | Chart-JP-PRICE | USD design value read as a JPY price; a ceiling read as an offer |
| jp-09 | CL-JP-06/07 → SRC-JP-01; CALC-JP-FADE | Play duration, term | Extra hours read as spare capacity |
| jp-tokyo-10 | CL-JP-08/24/25 | Example day | An observed Tokyo price curve implied |
| jp-kyushu-10 | CL-JP-19/20/08 → SRC-JP-12 | Month panel | Physical surplus read as revenue |
| jp-hokkaido-10 | CL-JP-07/21/22 → SRC-JP-01 p. 68, SRC-JP-11 | Example strip | Charging limits read as a small trading cost rather than a floor risk |
| jp-11 | CL-JP-05/08/27 → SRC-JP-01; funding candidate | Chain | The award read as a subsidy; the funder assumed |
| jp-12 | CL-JP-25/08 → REPO-JP-LIVE | Revenue bar | Model retention read as the rule |
| jp-*-13 | Shared and regional claims | Existing Bankable case, Revenue, Execution, Downside | A second financial view; a probability implied |

## 10. G-1 record and open questions

| Analyst pass | Decision required |
| --- | --- |
| Electricity mechanics | Accept the reading of the award: twenty years in principle, the six-hour continuous test, declared capacity carrying fade and charging limits, the clawback, area ceilings, the Round 4 pool and certified-cell order. Accept the regional readings: Tokyo's position and connection queue, Kyushu's surplus and single exit, Hokkaido's thin link and charging-control connections |
| Investment meaning | Accept one call in three places, a purchase at a price below build cost, with the regions differing only in what is left after the clawback |
| English / Chinese | Confirm equal meaning for award, clawback, floor, declared capacity, curtailment (弃电 / 出力控制), charging control, certified cells and purchase ceiling |
| Script decision | **Sign off the shared pack and shots jp-00 to jp-12 with the nine regional shots, or name the changes.** No build, dataset, view edit or model change follows from this script |

Open questions for the analyst:

1. **Go/no-go on the shared pack.** (a) Recommended: one pack, `src/markets/jp/storyPack.js`, three registry entries, one composed story per region, guards per region (§1.3–1.5). (b) The fallback: three thin packs over one national module (§1.6). (c) One story for Tokyo only, with Kyushu and Hokkaido keeping the research dialog.
2. **Signature chart.** (a) Recommended: one parameterised Chart-JP-PRICE, with the Kyushu and Hokkaido panels as evidence in their battery shots. (b) Three regional charts as the v1.3 cards proposed: Tokyo's purchase-price chart, Kyushu's curtailment against charging window, and Hokkaido's firm against non-firm charging hours.
3. **Release.** Release the three areas together under one G-2, or each on its own G-2 through its `released` flag.
4. **Round 4's longer term (CF-JP-02).** The Round 4 guidelines let a battery elect an application period of twenty to forty years (pp. 10, 68). The plays and the floor ruling assume twenty years, and the story says "twenty years in principle". Should a later model or view change consider longer terms for new awards? The call buys operating holders, whose terms were set by their own rounds (GAP-JP-TERM).
5. **Shot ids.** Accept region-prefixed ids for regional shots (`jp-tokyo-07`) and the place fallback when a regional id is opened on another area's page.
6. **Supplier on the page.** Keep the certified reference supplier out of page copy ("a certified maker") until METI's public list shows the certification (recommended), or name it with a practitioner label.
7. **Kyushu month panel.** Use the repository's anchored output-control days only (recommended), or approve a rights review of Kyushu T&D's daily workbook (GAP-JP-CURTAIL).
8. **Causal readings.** CL-JP-18 (the 2011 shortage set off the reform) and CL-JP-28 (a fund earns its yield only by buying below build cost) as interpretations.
9. **Markers.** Strong on jp-03, jp-04, jp-05, jp-06 and jp-kyushu-07 (opened official records, assuming your review); Fair elsewhere; jp-00 keeps the play's marker.
10. **The Chinese drafts.**

Checks run on 5 November 2026: all twenty shot tables carry the six specification rows and the page-text rows in both languages. A scan found no digit in any page-text cell outside a `‹bound›` token or a year. English and Chinese use the same tokens in every row; every token has a register entry; local links and anchors resolve. The staged-file confidentiality scan ran against the marker list and was clean. No company, developer, project or award holder is named; the register names public institutions and network companies, and refers to the reference supplier only by its existing repository record. `npm test` passed 1,339 of 1,377 tests, with 38 skipped and none failing. `npm run test:current` passed 84 of 84, with no fixture regenerated. Build, budget and browser checks were not run, because only Markdown changed.

## 11. Sources and claims

Canonical [sources, claims, history, calculations, conflicts and gaps](source-register.md#g1-jp-evidence). IDs in the shots resolve there. The script owns scene and bilingual page copy; the register owns the evidence records.
