# View text: typed returns and weak sources — content plan, 2026-10-31

Status: **ruled 31 October 2026: A on all four questions** ("Accept all four A"). The selected package is 1A, 2A, 3A and 4A, as written below. Applying it still needs a separate request: one PR through the view writer (§6). Applying it moves no model figure, grade, call or rank; it changes published text in 12 markets.

| Item | Finding | Recommendation | Markets moved |
| --- | --- | --- | --- |
| Q1. Returns typed into analyst prose | Theses, play reasons and verdict text quote the **design-grid** hold return. Since the 29 October financing revision, the card shows the **all-equity investment** hold return. The two differ in 14 of the 15 published markets, by up to 6.4 points | **1A:** take model results out of analyst prose. Prose says what the card's own test says ("clears / falls short of the fund's target") and names the best design in words; the figures stay on the card and the design grid | CAISO, DE, ERCOT, FI, GB, IE, NEM, PJM, PL, RO, WA now; Italy after its call is re-confirmed |
| Q2. Grade reasons quote the same figures | Grade reasons are dated records of why a grade was given | **2A:** keep each figure, and add its basis and date | All 15 published markets, text only |
| Q3. View text resting on weak or stale sources | Eight items found by the story scripts (#91–#98): subscription sources, a blog-only claim, a stale queue figure, stale next actions | **3A:** the package in §4 | CAISO, ERCOT, GB, PJM, PL, RO |
| Q4. Stopping it recurring | Nothing checks view prose for model results | **4A:** a test that fails when a return figure appears in thesis, reason, `because`, `despite`, `scoreNote` or action text | None (a test only) |

Out of scope:
- Italy's call. Its trigger has resolved (CF-IT-01 in #92), and Italy's text changes wait for that ruling.
- Model inputs: Ireland's de-rating seed, PJM's accreditation path, Poland's grant share and GB's merchant benchmark. Each is a separate single-market change.
- Price-data rights, which stay parked by the analyst.

## 1. Finding: two return bases, one sentence each

The view prose was written between 12 and 23 October against the design grid (`briefing.plays[…].econ.hold`). The design grid ranks durations and routes on one basis, at the platform's valuation yields. On 29 October the analyst ruled that the card's headline is the all-equity hold return from the investment summary (`OPPORTUNITY_SUMMARY[lens].markets[id].holdIRR`), tested against the fund's target. The prose was never re-read against it.

Built briefing at `edcb39c`, infrastructure-fund lens:

| Market · play on the page | Typed in prose | Design-grid hold | Card hold (all-equity) | Card levered | Card target test |
| --- | --- | ---: | ---: | ---: | --- |
| `caiso` · `caiso-cap-4h` | 3.2% | 3.2% | 6.4% | 6.2% | misses |
| `de` · `de-toll-4h` | 11.7% (13.9% merchant) | 11.7% | 9.1% | 10.4% | misses |
| `ercot` · `ercot-toll-2h` | "loses money"; −5.9% (grade) | −5.9% | 0.5% | −2.6% | misses |
| `fi` · `fi-toll-2h` | 14.6% | 11.4% | 13.4% | 16.2% | meets (all-equity) |
| `gb` · `gb-toll-4h` | "about 5%", "a tenth" secured | 3.5% (toll); 4.5% and 11.7% secured (capacity) | 5.0% | 3.9% | misses |
| `ie` · `ie-cap-4h` | "over half" secured; 9.0% (grade) | 9.0% | 9.1% | 11.4% | meets (levered) |
| `it` · `it-cap-4h` | 14.6%; MACSE 2.5–3% | 14.6%; 2.5% | 11.6% | 15.3% | meets (all-equity) |
| `nem` · `nem-ltda-4h` | 8.2% | 8.2% | 7.4% | 7.8% | misses |
| `pjm` · `pjm-cap-4h` | 2.4% | 2.4% | 4.7% | 3.8% | misses |
| `pl` · `pl-grant-4h` | 17.1% | 17.1% | 11.5% | 12.1% | misses |
| `pl` · `pl-cap-4h` (not on the page) | 9.8%; 7.4% uncontracted | 9.8% | — | — | — |
| `ro` · `ro-mer-2h` | "about 17%" off by 2027; 13.7% (grade) | 13.7% | 11.2% | 11.4% | misses |
| `wa` · `wa-cap-8h` | "three-quarters" of revenue; 19.8% (grade) | 19.5% | 14.3% | 20.8% | meets (all-equity) |
| `jp_*` · `jp-*-ltda-6h` | 96% secured (Tokyo's `scoreNote`) | 2.5–2.9% | 3.8–4.1% | 2.8–3.3% | misses |

Arithmetic: each figure is the built field × 100, rounded to one decimal. For example, PJM's grid hold is `0.0237` → 2.4% and its card `holdIRR` is 4.7%. Finland's typed 14.6% matches neither basis: it is the 17 October engine figure, from before later Fingrid fees and connection costs.

Two consequences beyond tidiness:
- **A reader sees two numbers for one play.** The PJM card says 4.7% while the text beside it says 2.4%.
- **Some words mean a different test from the card's.** NEM's "only just clears a fund's yields" is true on the design grid (value per MW is +$34k at the platform's yields). The card's target test says NEM misses the fund's target. Under 1A the prose names which test it means.

## 2. Q1: what replaces a typed return

**1A (recommended): no model results in analyst prose.** A model result is a return, value, payback or secured share computed by the engine. Design terms (hours, contract tenor, the floor's share and term), regulatory parameters (Japan's 4.5% pre-tax bid cap) and dated external facts (queue sizes, auction prices) stay, each with its source. The sentence keeps its argument and states the result in words:
- Rankings come from the design grid, as "the best design".
- The target test comes from the card, as "clears / falls short of the fund's target".
- Value at the platform's yields comes from the grid, as "clears / loses value at the platform's yields".

The card and grid keep showing every figure, so nothing is lost to the reader. Under 1A nothing in the text can drift when the model moves, except a word whose test result flips. Q4's test catches a return typed back in.

**1B: bind tokens in view prose,** for example `{card.hold}`, resolved by the briefing at render. This keeps numbers in sentences, but it is new code in `src/briefing/` and the market page, with a budget cost on the home page, which has about 2.5 KiB of headroom. Every token also needs a Chinese counterpart.

**1C: re-sync the typed figures to the card and label the basis.** This is the smallest change today, but it drifts again at the next model change. It is the pattern that caused this.

### Proposed text under 1A

Each row changes only the result clauses; everything else is the analyst's current text. The Chinese has the same meaning.

**CAISO — thesis**
- EN: Substantially a capacity contract with a trading option: resource adequacy carries most revenue and credits exactly four hours. At build cost the reference project falls short of the fund's target, so buy operating RA-contracted assets only at a price that clears it, once the 2027 foldback cut is sized.
- 中文：本质上是附带交易选择权的容量合同：资源充裕度贡献大部分收入，且恰好按四小时计量。按建设成本测算，参考项目达不到基金目标回报，因此须待2027年出力回落下调的幅度明确后，以达到目标回报的价格收购持有资源充裕度合同的在运资产。

**CAISO — `caiso-cap-4h` why**
- EN: Resource adequacy credits exactly four hours and carries most revenue; at build cost the reference project falls short of the fund's target.
- 中文：资源充裕度恰好按四小时计量，并贡献大部分收入；按建设成本测算，参考项目达不到基金目标回报。

**Germany — thesis**
- EN: Europe's most liquid storage market, with no capacity revenue for a four-hour battery. Merchant four hours is the best design, and a toll is how a fund secures it, giving up some return for certainty; at build cost the toll case falls short of the fund's target. The open risk is the storage grid-fee framework, still a draft.
- 中文：欧洲流动性最好的储能市场，但四小时电池没有容量收入。纯市场化四小时是最佳设计；基金可通过租赁锁定收入，以部分回报换取确定性；按建设成本测算，租赁情形达不到基金目标回报。尚未落定的风险是仍为草案的储能电网费框架。

**Germany — `de-toll-4h` why**
- EN: No capacity revenue exists for a four-hour battery; a five-year toll secures it, at a lower hold return than merchant.
- 中文：四小时电池没有容量收入；五年期租赁可锁定收入，持有期回报低于纯市场化。

**ERCOT — thesis** (also Q3 item 1)
- EN: Fastest to connect, hardest to get paid: no capacity payment, and battery revenue has fallen steeply as the fleet grew, on the market monitor's figures. Even with a toll the model falls short of the fund's target, so only an executed toll at a known price makes a case.
- 中文：并网最快，回款最难：没有容量付费，且据市场监测机构数据，随着储能规模扩大，电池收入大幅下滑。即便有租赁，模型测算仍达不到基金目标回报，因此只有价格明确的已签署租赁才能成立。

**ERCOT — `ercot-toll-2h` why**
- EN: No capacity payment exists and battery revenue has fallen steeply as the fleet grew; a toll is the only secured route, and no ERCOT toll price has been disclosed.
- 中文：这里没有容量付费，且随着储能规模扩大，电池收入大幅下滑；租赁是唯一的锁定收入途径，而ERCOT的租赁价格从未公开。

**Finland — thesis**: the last sentence only
- EN: Two hours is the best design, and at build cost it clears the fund's target.
- 中文：两小时是最佳设计，按建设成本测算可达到基金目标回报。

**Finland — `fi-toll-2h` why**: the last sentence only
- EN: On the engine this is the best design here.
- 中文：在引擎测算中这是本市场的最佳设计。

**Great Britain — thesis**
- EN: Liquid, financeable and close to saturation. The reference project falls short of the fund's target, with little of its revenue secured; four hours wins de-rated capacity while two-hour assets still win connections. A fund buys operating assets that carry a toll, not new build.
- 中文：流动性好、易于融资，但已接近饱和。参考项目达不到基金目标回报，且锁定的收入很少；四小时设计赢得折减后容量，两小时资产仍能拿到并网。基金应收购附带租赁合同的在运资产，而非新建。

**Great Britain — `gb-toll-4h` why**
- EN: A toll is the only way to secure most revenue in a market where the reference case secures little.
- 中文：在参考情景锁定收入很少的市场，租赁是锁定大部分收入的唯一途径。

**Ireland — thesis**: "over half of revenue" becomes "most of its revenue"
- EN: Capacity-led: a capacity contract secures most of its revenue for ten years, and four hours is the best design on the model. Underwrite capacity and wholesale and drop the system-services line, because DS3 ends at a September 2027 long-stop with no date for its successor.
- 中文：以容量收入为主：容量合同可在十年内锁定大部分收入，按模型测算四小时是最佳设计。按容量与批发收入承保，不计系统服务收入，因为DS3将于2027年9月的最终截止日结束，而后继机制尚无日期。
- `ie-cap-4h` why: the same substitution. "De-rating rewards four hours" stays until the analyst rules on CF-IE-05 at G-1; the Ireland script found published factors that do not favour four hours.

**NEM — thesis**: the middle sentence
- EN: At build cost the reference project only just clears the platform's yields, on modelled CIS floor-and-ceiling terms no award publishes, and falls short of the fund's target.
- 中文：按建设成本测算，参考项目仅勉强达到本平台收益率要求，且依赖于平台建模、任何中标合同均未公开的CIS上下限条款，达不到基金目标回报。
- `nem-ltda-4h` why: "returns 8.2% hold and only just clears a fund's yields" becomes "only just clears the platform's yields and falls short of the fund's target".

**PJM — thesis**
- EN: The best-published capacity price on the platform, secured one year at a time, and the reference project falls short of the fund's target. Four hours is the best design as accreditation erodes. Wait for the 2029/30 auction in December 2026 before pricing anything.
- 中文：本平台公开最充分的容量价格，但只能逐年锁定，参考项目达不到基金目标回报。随着认证系数下降，四小时仍是最佳设计。在2026年12月2029/30交付年拍卖之前，不对任何资产定价。

**PJM — `pjm-cap-4h` why**
- EN: Four hours is the best capacity design as accreditation erodes; on capacity revenue secured one year at a time, the reference project falls short of the fund's target.
- 中文：随着认证系数下降，四小时仍是最佳容量设计；依靠逐年锁定的容量收入，参考项目达不到基金目标回报。

**Poland — `pl-cap-4h` why**
- EN: Four hours on an earlier seventeen-year capacity contract is the engine's best design, and it still loses value at the platform's yields; an uncontracted four-hour project does worse.
- 中文：持有早期十七年容量合同的四小时设计是引擎的最佳设计，但按本平台收益率仍损失价值；无合同的四小时项目更差。

**Poland — `pl-grant-4h` why** (also Q3 item 6)
- EN: Projects in NFOŚiGW's 2025 storage cohort receive grants covering about 38% of cost on average; with that grant, merchant four hours is the engine's best Polish design, but at build cost it falls short of the fund's target.
- 中文：国家环保基金2025年储能批次项目的补贴平均约占成本的38%；按此补贴，四小时市场化设计是引擎在波兰的最佳设计，但按建设成本测算达不到基金目标回报。
- About 38% is the play's input (`grantPct` 0.379), stated as an input.

**Romania — thesis** (also Q3 item 5)
- EN: Wide day-ahead spreads and nothing contracted, with a home fleet that doubles this year; Romania's own build is the main risk to the two-hour value. Two hours is the best design on merchant revenue alone; a fund enters only with a negotiated optimiser floor, whose terms are not yet priced here.
- 中文：日前价差宽但没有任何合同化收入，且本国储能规模今年翻倍；罗马尼亚自身的建设是两小时价值的主要风险。仅按市场化收入测算，两小时是最佳设计；基金只有在谈定优化商保底后才进入，而该保底条款尚未在此定价。

**Romania — `ro-mer-2h` why**
- EN: Two hours is the best design here on merchant revenue alone, and the figures shown price no floor; Romania's own fleet growth compresses every duration's value.
- 中文：仅按市场化收入测算，两小时是这里的最佳设计，所示数据未计入任何保底；罗马尼亚自身储能规模的增长会压缩各时长设计的价值。

**Western Australia — thesis**: one sentence
- EN: Capacity carries most of year-one revenue.
- 中文：容量收入占首年收入的大部分。

**Verdict text in every lens, `scoreNote` and action text.** About 40 fields, including Japan's `scoreNote` and the Italy trigger label held for CF-IT-01. They take the same substitution: a typed return or secured share becomes the matching words from the card or the grid. External facts and design terms stay. They are written in the apply PR, where the diff shows every sentence in both languages, and nothing merges without the analyst. The full inventory is in the appendix.

## 3. Q2: grade reasons

Grade reasons carry an `asOf` date and record why a grade was given. Rewriting their figures would rewrite the record. **2A (recommended):** keep each figure and add its basis and date, for example "a 2.4% hold return on the design grid (31 October 2026)". Where a grade's argument no longer holds on the card basis, nothing changes here; it surfaces in the next grade review. **2B:** apply 1A to grade reasons too.

## 4. Q3: weak-source and stale items

Each was found and sourced by a story script and is unverified until the analyst signs that script off. The links are the scripts' own records.

| # | Market · field | Now | Proposed | Source |
| --- | --- | --- | --- | --- |
| 1 | ERCOT · thesis, `why` and action | "Merchant index down about 85% in two years" (subscription index, `modoIndex`); the action tests a toll "against the 2025 realised index" | Thesis and `why` as in §2. Action: "…get its price and test it against the market monitor's 2025 battery revenue before any bid." The model input stays (separate) | Potomac Economics, [2025 State of the Market Report for ERCOT](https://www.potomaceconomics.com/wp-content/uploads/2026/06/2025-State-of-the-Market-Report-for-ERCOT.pdf) (SRC-ERCOT-01, #95) |
| 2 | ERCOT · `policyStability` reason | "…data-centre interconnections have been paused for audit since August 2026…" (found only in a blog post) | Drop the clause; the grade is unchanged | No primary record found (CF-ERCOT-05) |
| 3 | GB · trigger `gb-gate-2-battery-progression-limit` | Source is a subscription news article (`search-summary`) | Repoint to the DESNZ and Ofgem open letter (16 April 2026) and Ofgem's CMP470 minded-to consultation (17 September 2026; decision pending) | [Open letter](https://www.gov.uk/government/publications/connections-reform-delivery-update-and-battery-capacity/open-letter-from-desnz-and-ofgem-on-connections-reform-delivery); [CMP470 consultation](https://www.ofgem.gov.uk/sites/default/files/2026-09/CMP470-Minded-to-Consultation.pdf) (SRC-GB-24, SRC-GB-25, #93) |
| 4 | GB · `gridScarcity` reason and developer `because` | "177 GW queued against 3.6 GW built", transmission register, no date | Keep, adding the register and its date; Ofgem's 17 September figures count a different thing (CF-GB-07 note) | Existing citation; date to be added from the register |
| 5 | Romania · thesis | "Bulgaria's batteries mostly stay behind the border" and "about 17%", computed on the private-use price mirror (gate MR-4) | Dropped from the thesis (§2) until MR-4 recomputes them from ENTSO-E, OPCOM or IBEX | Gate MR-4 |
| 6 | Poland · `pl-grant-4h` why and call | "169 projects… PLN 3.735bn of grants on PLN 9.847bn of cost (37.9%)". NFOŚiGW's lists give 172 recommended on PLN 10.004bn (37.3%), and the signed list 170 grants for PLN 3.687bn | Text as in §2: no project count or totals. Whether to move `grantPct` from 0.379 to 0.373 is a separate single-market refresh | NFOŚiGW lists (CF-PL-03, #98) |
| 7 | PJM · `gridScarcity` reason | "67 GW of storage sits in the reopened interconnection queue…" | "PJM accepted 60.0 GW of storage into Cycle 1 of its reformed interconnection process (3 August 2026), against 1.9 GW of batteries awarded agreements in the first transition cycle." | [PJM release, 3 August 2026](https://www.pjm.com/-/media/DotCom/about-pjm/newsroom/2026-releases/20260803-over-700-new-generation-projects-accepted-into-first-cycle-of-reformed-interconnection-process.pdf) (SRC-PJM-25, #96) |
| 8 | PJM · action, and an optional trigger | "Read the 2029/30 capacity auction… for its price and four-hour accreditation" (the rating was published on 6–7 August) | "Read the 2029/30 capacity auction in December 2026 for its price, and the 2030/31 four-hour rating due 11 January 2027; re-price nothing before both." Optional trigger `pjm-elcc-2030-31-rating`, expected 2027-01-11 | [ELCC class ratings 2029/30](https://www.pjm.com/-/media/DotCom/planning/res-adeq/elcc/29-30-bra-elcc-class-ratings.pdf); [RPM schedule](https://www.pjm.com/-/media/DotCom/markets-ops/rpm/rpm-auction-info/rpm-auction-schedule.xlsx) (SRC-PJM-06, SRC-PJM-14) |
| 9 | CAISO · action and trigger note | "After the January 2027 foldback cut…" — its size may not be visible in January | "Once the 2027 foldback cut is sized, price operating assets with RA contracts; buy only where the price clears the hurdle." Trigger date unchanged | D.26-07-008; A.26-05-007 p. 12 (CF-CAISO-05, #97) |
| 10 | CAISO · `policyStability` reason | "…contracts already signed are bilateral and keep their terms." | Add: "but the 2027 change applies to all storage, so the capacity a signed contract can sell may fall." | D.26-07-008 (CF-CAISO-07, #97) |

The Chinese for items 1 and 7–10 follows in the apply PR, in the same form as §2.

Not in this package: CAISO's research-tab line (`src/markets/caiso/sections.js`, CF-CAISO-02) is code text, not the view store. It can ride along in the apply PR if the analyst wants it.

## 5. Q4: a guard

**4A (recommended):** add `tests/view-prose.test.js`. It reads every `view/markets/*.json` and fails when a thesis, play `why`, verdict `because` or `despite`, `scoreNote` or action text contains a percentage within six words of "return", "hold", "IRR" or "回报". Grade reasons are exempt under 2A. It runs in `npm test`. **4B:** no guard.

## 6. Applying it, after the ruling

One PR, on request:
1. A view-writer content script, `scripts/view/content/view-text-2026-11.mjs`, in the form of `open-calls-2026-10.mjs`, with `--check` and `--apply` and one changelog line per field, attributed to the analyst.
2. Under 4A, the guard test.
3. The usual checks: `npm test`, `npm run test:current`, `npm run build`, `npm run test:budget`, `npm run test:e2e`.

No figure, grade, call or rank moves, and no fixture is regenerated. Italy follows its own ruling.

## Appendix: fields with typed figures at `edcb39c`

From a scan of every `view/markets/*.json` (English side). Model results go to Q1 or Q2. External facts and design terms are listed for completeness and stay.

| Market | Fields |
| --- | --- |
| caiso | thesis; `assetReturn`, `revenueCertainty`, `capitalAtRisk` reasons; strategic `because` (two), infraFund and first-timer `because`; play `why` |
| de | thesis; `assetReturn`, `revenueCertainty`, `capitalAtRisk` reasons; `gridScarcity` trend cause and `foreignEntry` reason (external); `de-toll-4h` why |
| ercot | thesis; `assetReturn` reason; `gridScarcity` and `saturation` reasons (external); play `why` |
| fi | thesis (€15k input, floor terms, 14.6% result); `capitalAtRisk`, `foreignEntry`, `demandGrowth`, `saturation` reasons (mostly external); strategic `because` and `despite` (external); infraFund `because` (floor term); play `why` and action (floor term) |
| gb | thesis; `assetReturn`, `revenueCertainty`, `gridScarcity`, `saturation` reasons; infraFund `because` and `scoreNote`; developer `because` (external); `gb-toll-4h` why |
| ie | thesis; `assetReturn`, `revenueCertainty`, `capitalAtRisk`, `foreignEntry` reasons; `because` in four lenses; play `why` |
| it | thesis; `assetReturn`, `revenueCertainty` reasons; infraFund `because`; trigger label; both plays' `why`, action and call text — **held for CF-IT-01** |
| jp_tokyo, jp_kyushu, jp_hokkaido | 4.5% bid cap, ¥12,000 and 400 MW (regulatory, stay); `assetReturn` and `revenueCertainty` reasons (Q2); Tokyo infraFund `scoreNote` (96% secured, Q1) |
| nem | thesis (8,000 MW external; 8.2% result); `assetReturn`, `revenueCertainty` reasons; `because`/`despite` in four lenses; `scoreNote`; play `why` |
| pjm | thesis; `assetReturn`, `revenueCertainty` reasons; `gridScarcity` reason (Q3 item 7); `because` in three lenses; play `why` |
| pl | `assetReturn`, `foreignEntry` reasons; `policyStability` trend cause (auction terms, external); `because` in three lenses; both plays' `why`; `pl-grant-4h` call |
| ro | thesis; `assetReturn`, `revenueCertainty`, `capitalAtRisk` reasons; infraFund `because` (127 MW, external); play `why` |
| wa | `assetReturn`, `revenueCertainty`, `capitalAtRisk`, `foreignEntry` reasons; strategic `because`; one trigger note; thesis ("three-quarters") |

Play labels ("4h", "9h build / 6h obligation") are design terms and are not touched.
