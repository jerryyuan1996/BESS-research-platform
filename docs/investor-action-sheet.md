# Investor action sheet

Implemented 23 October 2026, on main after PR53 and PR54.

The homepage groups all four investor types on one page. Each group shows two
leading opportunities; the remaining opportunities and watchlist are folded.
Investor and currency filters are presentation choices. Comparing up to three
opportunities is local to the page and uploads no project information.

## A recommendation is a specific play

The analyst's shortlist supplies route, storage duration, entry stage, its own
call and any grant cohort. `acquisition/opportunities.js` values that exact
design through the existing acquisition cash-flow evaluator. It does not rank
countries by their dollar ceiling or high return hurdle, change any analyst
call, or replace a merchant play with an invented toll. Source view records and
the comparison engine's published baseline are unchanged.

Strategic investors may use greenfield, RTB or operating. Infrastructure funds
and first-time foreign investors use RTB or operating. Developers use greenfield
or RTB and sell at commissioning. Known closed routes are excluded. A market
without an analyst view can retain a clearly conditional reference, such as
Ontario; absence of a view is not an assumption that the country is inaccessible.

Co-investment is an ownership structure, not an asset milestone. The WA
eight-hour co-investment uses the RTB project reference, explicitly conditional
on a local sponsor and the play's capacity-credit requirements. Its price is
for 100% of the project, not a quoted minority stake. No minority discount or
shareholder-agreement premium is invented.

The Poland grant-funded merchant play retains its 37.9% awarded-cohort support
and merchant income. Its grant is paid as conditional capital support in the
acquisition schedule, with matching tax basis treatment. The ordinary
unsubsidised case does not acquire that grant. Operating acquisitions do not
receive construction subsidies again. WA uses the play's annual capacity
derating in the operating cash flows, including its remaining-life extension.

## Conditions shown next to IRR

Each scenario contains `assumptions.terms`, built from its exact valuation input:

- Months from closing to operation, separately identifying the market model's
  construction period where available. Default commissioning cannot precede
  that construction period; supplied project timing can replace the reference.
- The actual play's income mechanism, amount, remaining tenor and coverage
  denominator. Fixed toll/floor reference plays assume whole-project coverage,
  explicitly as a scenario, rather than claiming a signed project agreement.
- Remaining construction, grid and contingency budget in current prices, with
  development spending separate and recoverable VAT excluded from this quote.
- The first full operating year's nominal operating cost, including the model's
  recurring service schedule. Separately modelled tax, lifecycle work and
  retirement remain in valuation, rather than being relabelled annual opex.
- Operating acquisitions show immediate equipment works, completed age,
  remaining life and remaining contracts. Original construction is not charged
  again.

Displayed price, return, time, income and costs all use one displayed scenario.
If only improved conditions support a positive price, its inputs are shown and
the price is marked conditional. The lower hold/sale ceiling and its own target
still govern unbuilt projects. Operating assets use hold only, with optional
debt. At a ceiling the target is a buying requirement, not an actual seller
quote, guaranteed yield or annual distribution.

## Contract and visual denominators

Fixed toll payments, floor protection, capacity income, awards, CIS collars and
market income have distinct labels and sentences. Capacity coverage is not
revenue coverage. The first-year contracted-income proportion is explicitly
labelled as a model revenue share, not MW under contract. CIS shows the capped
shortfall-support percentage, not a fictitious fixed-revenue percentage.
Floors are settled once; they are not added to a full merchant stream.

The timeline has one common scale across all references on the page. Contract
coverage uses 0–100% with a clearly stated denominator. Costs are aligned in
per-project-MW units, retaining storage hours. Construction and annual opex
never share a numerical axis. Dollar translation aids comparison but does not
change the local-currency IRR or imply FX hedging.

Hover/focus/tap explanations show the cautious/base/improved ranges, sources,
remaining life and cost inclusions. These are coherent screening scenarios,
not statistical intervals. Key contract and support conditions stay visible.
Known project inputs take precedence; selecting a homepage opportunity also
carries its play and stage into the acquisition calculator.

## Validation

Financial regression tests reconcile displayed costs, contracts, income shares
and remaining lives to the same dated cash flows. Dedicated checks cover scope,
the grant cohort, eight-hour WA derating, distinct fixed/floor/CIS terms and
scenario pairing. Browser checks cover all four groups, expanded markets,
desktop/mobile comparison, currency/language changes, popovers and calculator
handoff. No confidential inputs or source materials enter the public bundle.

The homepage first-load budget rises from 230 to 234 KiB for the conditions and
comparison UI (first measurement 231.02 KiB). The unrelated full-history budget
is reconciled from 88 to 90 KiB: main's PR54 history already measures 89.04 KiB.

## Investment evidence decision log / 投资证据决策记录

### Review on 10 November 2026 / 2026年11月10日复核

**Evidence prepared; analyst decisions remain open.** This review covers the six investment evidence items in the console. No stored grade, call, historical record, model input, methodology or screening rule is changed. Retain the console's **NPV 2%** screening preference. The returns below are audit measures, not a new IRR screen. The [31 October ruling](view-text-plan-2026-10-31.md#3-q2-grade-reasons) preserves dated grade rationales.

**证据已整理；分析师决策仍待处理。** 本复核覆盖控制台六项投资证据待办，不修改评级、判断、历史记录、模型输入、方法或筛选规则。保留控制台的 **NPV 2%** 筛选偏好，下列回报只作审计对照，不构成新增IRR筛选。按10月31日裁定保留带日期的历史评级依据。

Source-verification limit: fresh official page/PDF observations below use web-extracted/indexed text. Raw original files were not independently downloaded and no new content-hash receipts were created; “opened” identifies the primary URL inspected, not a fresh raw-byte archival record.

来源核验限制：下列新核对的官方页面/PDF观察使用网页提取/索引文本，未独立下载原始文件，也未生成新的内容哈希凭证；“已打开”指核对了一手URL，不代表建立了新的原始字节存档。

#### Reproducible result bases / 可复算结果口径

Run `node scripts/view/review-investment-evidence.mjs 2026-11-10T09:17:39Z`. This read-only audit calls the current comparison engine, each duration's own design sweep and the same infrastructure-fund investment-summary API as the homepage. The timestamp fixes this review's data-currentness context, not a market observation date. The following table is generated from current result fields, with percentages rounded to four decimal places; it does not seed any model.

运行上述只读命令，可从当前比较引擎、各时长自己的设计扫描及首页基础设施基金投资摘要API复算。时间戳固定本轮数据时效上下文，并非市场观测日期。下表直接从当前结果字段生成，百分比保留四位小数，不作为模型输入。

| Market / 市场 | Historical / 历史 | Current operating model / 当前运营模型 | Investment card / 投资卡片 |
|---|---|---|---|
| NEM | 87% secured, 15y; 2026-10-12 / 锁定87%，15年 | 4h hold 8.1468%; secured 64.3369% / 15y / 持有期；锁定比例/期限 | 4h: all-equity hold 7.3715%; levered 7.7957% / 全股权持有；杠杆后 |
| PJM | 2.4% design hold; 2026-10-23 / 设计持有期 | 4h hold -0.3145%; secured 46.7191% / 1y / 持有期；锁定比例/期限 | 4h: all-equity hold 2.7027%; levered 1.5485% / 全股权持有；杠杆后 |
| WA | 19.8% design hold; 2026-10-23 / 设计持有期 | Base 7h 21.5485%; fade-aware 7h 19.9854%, 8h 19.4965% / 基础及退化合规设计 | 8h: all-equity hold 14.3473%; levered 20.8117% / 全股权持有；杠杆后 |


The comparison/design case has 15 operating years and the existing stream valuation yields, before the card's separate tax/financing treatment. The investment card uses the exact selected play, 20 operating years, RTB timing and existing tax/debt conventions. Even for WA's co-investment play, it is a 100%-project reference, not a quoted minority-stake return. Current base-case asset-return ranks are NEM 6/17 (grade 4), PJM 16/17 (grade 1), WA 1/17 (grade 5), under the existing fifth rule. Never substitute a card return for a design-grading measure.

比较/设计情景采用15个运营年及既定分项估值收益率，尚未套用卡片另有的税务/融资处理。投资卡片采用选定策略、20个运营年、RTB时间及既定税务/债务惯例。西澳参股策略也是100%项目参考，不是少数股权的报价回报。当前基础情景资产回报排名为NEM第6/17（4级）、PJM第16/17（1级）、西澳第1/17（5级），仍按原五分位规则。不得用卡片回报替代设计评级指标。

#### NEM revenue-certainty rationale / NEM收入确定性依据

**Evidence ready within model scope; no grade decision.** The 87% record belongs to 12 October. The [23 October calibration](acquisition-calibration-2026-10-23.md#method-and-review-boundaries) records the intentional CIS collar correction. Current `cisRevenue` settles capped shortfall support, retains the middle band and shares above-ceiling revenue; it does not stack a fixed payment on mechanically reduced trading income. The [underwriting log](acquisition-underwriting.md) preserves the house floor, ceiling and caps as assumptions. Current secured share uses first-year secured plus trading revenue as its denominator, not MW or the shortfall-support rate.

**模型范围内证据就绪；未作评级决定。** 87%属于10月12日记录。10月23日校准已记录CIS上下限结算修正。当前函数按上限内缺口支持结算、保留上下限之间收入并分享超上限收入，不再把固定付款叠加于机械折减的交易收入。承保记录中的保底、上限及付款上限仍是平台假设。当前锁定比例的分母是首年锁定加交易收入，不是MW或缺口支持率。

The historical arithmetic can be reconciled without changing a model: the 12 October source vintage has eligible trading revenue `(186,000 × 0.95 + 9,000) × 0.95 = AUD176,415/MW-year`, an assumed award of AUD121,500 and 10% merchant retention, giving `121,500 / (121,500 + 0.1 × 176,415) = 87.3212%` (the historical whole-percent 87%). The approved [17 October award re-derivation](supplier-quote-2026-10-plan.md#award-revenue-derived-from-capex) lowered the assumed award to AUD113,500; on the old linearisation alone that would be 86.5477%. The 23 October full collar instead keeps the current middle-band trading revenue in full: `113,500 / 176,415 = 64.3369%`. Here the assumed floor is AUD113,500 / 0.9 and ceiling AUD200,000; the model's secured measure counts the capped guarantee level, not the actual top-up received that year. This is an accounting/assumption reconciliation, not evidence that an actual contract's cash payment fell.

历史算术可以在不修改模型的情况下对齐：10月12日源版本的合资格交易收入为`(186,000 × 0.95 + 9,000) × 0.95 = 每MW年176,415澳元`，假设中标付款121,500澳元并保留10%市场收入，对应`121,500 / (121,500 + 0.1 × 176,415) = 87.3212%`，即历史整百分比87%。10月17日已批准的重新推导把假设付款降至113,500澳元，若仍按旧线性结构，仅会变为86.5477%。10月23日完整上下限结算则保留当前中间区间的全部交易收入，故`113,500 / 176,415 = 64.3369%`。这里假设保底为113,500/0.9、上限200,000澳元；模型锁定指标按有上限的保障水平计入，并不是当年实际补差。此为模型口径/假设的对齐，不证明真实合同付款发生下降。

Primary evidence opened 10 November: [CIS Tender 10 guidelines, June 2026](https://asl.org.au/-/media/services/files/cis/cis-t10-nem/260623-cis-tender-10-nem-dispatchable-capacity-tender-guidelines.pdf?rev=9a4dbc9fb60c4f7e9bef2f03f11c515c&sc_lang=en), Table 5, printed p.13 (PDF p.13): 90% floor support, 50% ceiling sharing, maximum 15 years; floor, ceiling and payment cap are bid variables. This supports the mechanism, not the platform's assumed terms or an executed project CISA.

11月10日打开的一手依据：2026年6月CIS第10轮指南表5（印刷第13页、PDF第13页），列明90%缺口支持、50%超上限分享、最长15年；保底、上限及付款上限为投标变量。这证明机制，不证明平台假设条款或项目已签CISA。

**Analyst options:** A. Keep revenue-certainty grade 5 and append a dated rationale conditional on the modelled award. Its existing anchor is at least half of revenue for ten years or longer, still met numerically by this reference. B. Preserve the old record and defer a new rationale until an actual CISA, eligible-revenue definition and remaining tenor are checked. C. Reopen floor/cap inputs only through a separately sourced, approved model proposal. Nothing is applied; asset-return grade 4 already matches the engine.

**分析师选项：** A. 维持收入确定性5级，新增明确以模型中标情景为条件的带日期依据；现有锚点为一半及以上收入锁定至少十年，参考情景仍达到数值锚点。B. 保留旧记录，待核对实际CISA、合资格收入定义及剩余期限后再新增依据。C. 另提有来源且需批准的保底/上限输入修订。本轮均未执行；资产回报4级已与引擎一致。

#### PJM dated return rationale / PJM带日期回报依据

**Model evidence ready; historical grade 1 and Wait retained.** The [1 November decision](g1-model-change-plan-2026-11-01.md#pjm-published-indicative-credit-existing-price-scenario) approved duration-specific renewal ELCC curves and retained the existing forward-price scenario. This explains the historical/current design-return difference. Post-2029/30 class factors are indicative, not awarded project rights. The card is a separate tax/financing basis, not evidence that the historical design figure was wrong when written.

**模型证据就绪；保留历史1级及Wait。** 11月1日决策批准各时长续期ELCC曲线并保留远期价格情景，解释历史与当前设计回报差异。2029/30之后分类系数仍为指示值，不是项目授予权利。卡片另有税务/融资口径，不能据此否定旧日期的设计数字。

**Options:** A. Append a dated grade-1 rationale naming the updated ELCC path, retaining Wait. B. Defer a new record until the December 2026 delivery-2029/30 auction price and next scheduled ELCC posting on 11 January 2027 can both be checked. Neither changes forward-price inputs. The [official ELCC source](https://www.pjm.com/-/media/DotCom/committees-groups/cifp-rbp/postings/preliminary-elcc-class-ratings-for-period-dy28-dy42.pdf), reopened 10 November, confirms the four-hour row and distinguishes BRA values for 2028/29–2029/30 from non-binding later indications. The [schedule](https://www.pjm.com/-/media/DotCom/markets-ops/rpm/rpm-auction-info/rpm-auction-schedule.xlsx) could not be parsed by the web reader (unsupported XLSX content type); the exact dates remain dated-plan expectations, not independently re-certified current schedule.

**选项：** A. 在原1级下新增带日期依据，说明更新后的ELCC路径，保留Wait。B. 待2026年12月2029/30交付年拍卖价格和计划2027年1月11日的下一次ELCC均可核验后再新增记录。两者均不改远期价格输入。11月10日重新打开官方ELCC，核实四小时系数，并区分2028/29–2029/30的BRA值与后续不具约束力的指示值。官方排期为XLSX，网页读取器不支持，未解析；精确日期仍为已批准计划中的预期，不是本轮重新认证的当前排期。

#### WA benchmark technology review / 西澳基准技术审查

**Partial evidence; final outcome unresolved.** The [official 2026 review collection](https://www.wa.gov.au/government/document-collections/2026-benchmark-technology-review), opened 10 November, lists the 9 September draft and submissions; consultation closed at 17:00 AWST on 7 October. It informs ERA methodology and 2029/30 BRCP pricing. The [draft](https://www.wa.gov.au/system/files/2026-10/2026_benchmark_technology_review_-_draft_determination_for_consultation.pdf), printed pp.2–3 (PDF pp.7–8), proposes E-Class simple-cycle gas turbines for both benchmark technologies and continued gross CONE. No final determination was retrieved in this review; that is an evidence gap, not a finding that none was published.

**部分证据；最终结论未解决。** 11月10日打开的官方审查集合列有9月9日草案及意见，征询于10月7日西澳时间17:00结束，供ERA调整方法并制定2029/30基准价。草案印刷第2–3页（PDF第7–8页）提议两项基准均采用E级简单循环燃气轮机并继续采用总新进入成本。本轮未取得最终裁定，这是证据缺口，不是“官方未发布”的结论。

The separate [ERA final price determination of 13 March 2026](https://www.erawa.com.au/sites/default/files/2026-benchmark-reserve-capacity-prices-2028-29-capacity-year-final-determination.PDF), printed p.3 (PDF p.5), sets both BRCPs at A$488,500/MW-year for **2028/29**, using 200 MW/1,200 MWh batteries. That older price decision is not the later technology-review outcome. The Coordinator leads technology selection; ERA sets subsequent price/methodology. The draft gas benchmark must not silently replace the battery forecast in `brcp.js`.

另一个ERA于2026年3月13日作出的正式价格裁定，印刷第3页（PDF第5页），基于200MW/1,200MWh电池，将**2028/29**两项基准价定为每MW年488,500澳元。旧价格裁定不是后续技术审查结果。能源协调官负责技术选择，ERA制定后续价格/方法，不得将燃气草案直接替换电池预测。

**Next evidence and options:** retrieve the signed final technology decision, publication/effective dates, capacity-year coverage and ensuing ERA methodology/price decision. A. Retain the existing forecast explicitly as an unrevised house scenario pending evidence. B. After retrieval, propose a separately approved sensitivity or model revision. No outcome completion or strategy approval is recorded.

**下一证据及选项：** 取得最终签署技术裁定、发布/生效日、适用容量年及后续ERA方法/价格决定。A. 原文核验前明确保留未修订的平台预测情景。B. 原文取得后另提需批准的敏感性或模型修订。当前不记录审查结案或策略批准。

#### WA allocation versus project qualification / 西澳全市场分配与项目资格

**Market evidence verified; project conditions remain open.** [AEMO's Reserve Capacity Price page](https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wa-reserve-capacity-mechanism/reserve-capacity-price), opened 10 November, reports 2028/29 peak requirement 6,323 MW and assigned credits 6,715.022 MW. The approximately 6.2% surplus gives peak RCP A$459,191.55/MW-year. Flexible RCP is A$244,250; no flexible top-up is payable because it is below peak RCP. This corroborates the model's existing post-allocation price, not a new input.

**全市场证据已核验；项目条件仍待确认。** 11月10日打开的AEMO价格页报告2028/29峰值需求6,323MW、已分配容量信用6,715.022MW；约6.2%盈余对应每MW年459,191.55澳元峰值RCP。灵活RCP为244,250澳元，低于峰值价，不支付补差。这核实模型现有分配后价格，并非新增输入。

[AEMO's certification page](https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wa-reserve-capacity-mechanism/certification-of-reserve-capacity), current-process paragraphs before the facility register, separates CRC from Capacity Credits and payments: bilateral declarations, any required security and the NAQ process remain necessary; credits cannot exceed NAQ. The 16 September facility CRC list alone is not a final credit award. Check the target facility ID, capacity year, awarded credits, price class, NAQ/access/connection rights and conditions, completion/security obligations, duration/fade capability and separate FCESS accreditation. No target project or award documents were supplied; project qualification is unverified.

AEMO认证页在设施登记之前的现行流程中区分CRC与容量信用/付款：仍需双边申报、适用保证金及NAQ流程，容量信用不能超过NAQ。9月16日设施CRC表本身并非最终容量授予。须核对目标设施ID、容量年度、授予额度、价格类别、NAQ/接入/并网权利及条件、完工/保证金义务、时长/退化能力与独立FCESS认证。本轮无目标项目或授予文件，项目资格未核验。

**Options:** A. Mark market allocation verified while retaining project-award conditions. B. Review a target project's award/access pack separately. Any later public action wording should refer to “that project's credits and access conditions”, not imply market-wide allocation satisfies the investment condition. No commitment or view wording is changed here.

**选项：** A. 记录全市场分配已核验，但保留项目授予条件。B. 取得目标项目容量/接入文件后单独核验。以后若修改行动文字，应指“该项目容量信用及接入条件”，不能把全市场分配等同投资条件满足。本轮未出资、未修改观点文字。

#### WA return-rationale options / 西澳回报依据选项

**Evidence ready; grade 5 retained.** Base seven-hour, fade-aware seven/eight-hour design, and tax/financing card results stay separate. The highest-value duration need not have the highest IRR: the existing sweep still selects eight hours by value per connection MW. The historical 19.8% record remains dated 23 October and is not overwritten.

**证据就绪；保留5级。** 基础七小时、退化合规七/八小时设计及税务/融资卡片保持分开。每接入MW价值最高未必IRR最高，现有扫描仍按价值选择八小时。19.8%仍为10月23日历史记录，不被覆盖。

**Options:** A. Append a dated grade-5 rationale using the current comparison basis and linking the selected eight-hour design, keeping history. B. Keep the existing rationale pending benchmark-review and project-award evidence. A card number is not a substitute for design grading, and neither option authorises a benchmark forecast change.

**选项：** A. 新增带日期5级依据，使用当前比较口径并链接所选八小时设计，保留历史。B. 待取得基准审查及项目授予证据后再增补。卡片数字不能替代设计评级，两者均不授权修订基准预测。

#### Romania grant deadline and outcome / 罗马尼亚补贴期限及结果

**Primary text unavailable; no grant or deadline adopted.** On 10 November the [ministry launch page](https://energie.gov.ro/lansare-apel-sprijinirea-investitiilor-in-dezvoltarea-instalatiilor-autonome-stand-alone-de-stocare-in-baterii-a-energiei-electrice-cu-finantare-din-fondul-pentru-modernizare-p/) and linked [extension document](https://energie.gov.ro/wp-content/uploads/2026/10/Anunt-prelungire-apel-proiecte-STOCARE-STAND-ALONE.docx) timed out. The document URL was located through a secondary page; official bytes were not obtained. The reported 15 November 23:59 extension stays unverified. Original 30 October and internal 2 November review dates remain historical expectations, not asserted current official deadlines. No official ranking, award or signed-contract outcome was retrieved; this does not prove none was published. Separate public-entity/self-consumption calls must not be substituted.

**一手原文未取得；未采纳补贴或期限。** 11月10日能源部申报页及延期文件均超时。文件URL从二手页面定位，未取得官方内容，报道的11月15日23:59延期仍未核验。10月30日原预期及11月2日内部复核保留为历史预期，不是已确认的当前官方期限。未取得官方排名、中标或签约结果，不等于官方没有发布；不得用其他公共机构/自用批次替代。

**Next evidence and options:** retrieve the ministry's dated extension notice/current call documents, then provisional/final rankings and project-specific signed grant, eligible costs, disbursement and durability conditions. A. Keep the no-grant reference and unresolved review until primary text is obtained. B. Once verified, propose a separately reviewed awarded-cohort case, never a grant for all new entrants. Advancing an internal review date or accepting a secondary report does not close the evidence gap.

**下一证据及选项：** 取得能源部带日期延期通知/现行申报文件，再核对临时/最终排名及项目签署补贴、合资格成本、付款和持续义务。A. 原文取得前维持无补贴参考及未解决复核。B. 核验后另提中标批次情景，不向所有新进入者默认授予补贴。顺延内部复核日或采纳二手报道不能结案。

#### ERCOT carry-forward / ERCOT沿用状态

The repository's January event already has an outcome dated **6 November 2026**, with PR #178 the existing closeout reference; do not reopen it just because this review is new. The [January PDF](https://www.ercot.com/files/docs/2026/11/06/MORA_January_2027.pdf) returned HTTP 403 in this pass; its numbers were not independently re-read. February remains a **watch expected on 4 December 2026**, with no outcome. That date is inferred from the recorded first-Friday convention, not a completed publication. Neither event supplies a toll price or changes the call.

仓库1月事件已有**2026年11月6日**结果，PR #178为既有结案引用，不能因新复核重新打开。原PDF本轮返回HTTP 403，未独立重读数字。2月仍为**预计2026年12月4日的跟踪事项**，没有结果；该日期按记录的首个星期五惯例推算，不是已完成发布。两期均不提供租赁报价或改变投资判断。

Validation: `node --test tests/investment-review-evidence.test.mjs tests/current-model.test.js tests/baseline.test.js` passed **88/88**. The new audit checks result pairing, unchanged history/inputs, historical/current distinction and ERCOT closed/future status. No legacy fixture was regenerated. Aggregate release checks remain the integrator's responsibility.

验证：上述命令**88/88通过**；新增审计检查同口径字段、历史/输入未改、旧依据与当前证据区分及ERCOT已结案/未来状态，未重建旧基线。整体验收与发布检查仍由分支整合执行。

### 10 November 2026 follow-through: dated rationales and public evidence / 2026年11月10日推进：注明日期的依据与公开证据

**Current decision, superseding the pending options above:** the analyst approved keeping the NEM revenue-certainty, PJM asset-return and WA asset-return grades and adding dated, model-scoped reasons. The view writer updates only those current reasons and their dates, appending the complete before/after records to `view/changelog.jsonl`. Earlier records, calls, model inputs, comparison rules and NPV 2% screening are unchanged. Current financial values remain in the existing model-result displays and the read-only audit command above; the new prose contains no typed current model figures.

**当前决定，取代上文待选方案：** 分析师已批准维持NEM收入确定性、PJM资产回报和西澳资产回报评级，并增加有日期、明确模型口径的依据。观点写入器仅更新这三条当前理由及日期，并在变更历史中追加完整前后记录。旧记录、投资判断、模型输入、比较规则及NPV 2%筛选均不变。当前财务数值仍由既有模型结果展示及上方只读审计命令提供，新文字不写死当前模型数字。

- **NEM:** the current modelled award meets the existing secured-share/tenor anchor under the approved CIS collar settlement. Assumed floor, ceiling and caps are not an executed CISA or cash received. Recheck actual award terms, eligible revenue and remaining term when a specific project is under review.
- **PJM:** retain the existing hold-return fifth rule and Wait call. The approved duration-specific renewal ELCC path explains the difference from the old design return; the card's tax/financing basis is separate. Recheck published auction prices and updated accreditation before revisiting the view.
- **WA:** keep base operating ranking, degradation-aware design sweep and investment-card results separate. The selected design maximises value per connection MW, not hold IRR. Recheck final benchmark decisions and actual project capacity/access eligibility before revisiting the view.

- **NEM：** 按已批准的CIS上下限结算，当前模型中标情景仍满足既定锁定占比及期限锚点。假设保底、上限和付款限额不是已签CISA或实收现金；进入具体项目评估时再核实实际中标条款、合资格收入及剩余期限。
- **PJM：** 保留既定持有回报五分位规则及Wait判断。已批准的分时长续期ELCC路径解释旧设计回报与当前结果的差异，投资卡片的税务/融资口径另列；取得已公布拍卖价格及更新认证后复核。
- **西澳：** 基础运营排序、考虑衰减的设计扫描及投资卡片结果分开。所选设计以每接入MW价值最高为准，并非持有IRR最高；最终基准决定和实际项目容量/接入资格可核验后复核。

#### Public-source follow-up and research coverage / 公开来源跟进与研究覆盖

These are research-platform coverage limits, not a request to collect every market's private project files. Market-level public evidence can advance independently. Only a concrete project investment review needs that project's contract, award and access evidence; absence of such a review does not block market research. No new investment decision is requested by these three follow-ups.

这些是研究平台当前覆盖边界，不要求收齐所有市场的私有项目文件。市场层面公开证据可独立推进；仅在评估具体项目投资时才需要该项目合同、授予及接入证据，没有具体项目材料并不阻碍市场研究。这三项跟进目前不需要新增投资决定。

- **ERCOT February MORA, watch:** on 10 November the [official resource-adequacy page](https://www.ercot.com/gridinfo/resource), MORA section, explicitly states first-Friday publication two months before the reporting month. Its latest listed report is January 2027; no February 2027 entry was found. Thus 4 December 2026 is an expected release inferred from that rule, not a verified publication. Read the report once available and compare system adequacy and battery availability; do not infer project toll prices. The January PDF returned HTTP 403 again and was not retried through another route.
- **WA benchmark review, public evidence gap:** the [official review collection](https://www.wa.gov.au/government/document-collections/2026-benchmark-technology-review), last updated 19 October, and its linked [draft determination](https://www.wa.gov.au/system/files/2026-10/2026_benchmark_technology_review_-_draft_determination_for_consultation.pdf) were opened. The collection lists the draft, configuration workbook and consultation submissions; this pass did not retrieve a final determination. This is not proof that no final document exists. Keep the proposal separate from adopted technology and from the earlier ERA price decision for a different capacity year; retain existing model assumptions pending verified final text.
- **Romania grant, public evidence gap:** the ministry launch page timed out; the extension DOCX was not accessible through the reader. Following a secondary article's link also reached the [official opportunities-portal extension notice](https://oportunitati-ue.gov.ro/en/fondul-pentru-modernizare-a-fost-modificat-apelul-sprijinirea-investitiilor-in-dezvoltarea-instalatiilor-autonome-standalone-de-stocare-in-baterii-a-energiei-electrice-cu-finantare-din/), but it timed out. The reported 15 November deadline therefore remains unverified primary evidence, and no ranking or award was adopted. Preserve the no-grant reference; retry public official evidence when available, rather than requiring all private project packs.

- **ERCOT二月MORA，继续跟踪：** 11月10日已打开官方资源充裕度页面，其MORA栏目明确按每月首个周五、提前两个月发布。当前列出的最新报告为2027年1月，未找到2月条目。因此2026年12月4日是由发布规则推导的预期日期，不是已发布事实。报告可取得后比较系统充裕度及电池可用性，不由此推导项目租赁价格。1月PDF再次返回HTTP 403，未换路径重试。
- **西澳基准技术，公开证据缺口：** 已打开官方审查集合（页面更新于10月19日）及所链接草案。集合列有草案、配置工作簿及咨询意见，本轮未取得最终裁定，不等于证明官方未发布。草案、已采纳技术和另一个容量年度的既有ERA价格裁定保持区分；最终原文核验前保留模型假设。
- **罗马尼亚补贴，公开证据缺口：** 能源部申报页超时，延期DOCX无法由读取工具访问；沿二手文章链接找到官方机会门户延期公告，但同样超时。因此报道的11月15日期限仍未由一手原文核实，未采纳任何排名或中标结果。保留无补贴参考情景，待官方公开资料可取得时再核验，而非要求收齐私有项目资料。

Verification scope: observations above are official web-page/PDF extraction, not newly archived original bytes or content hashes. Focused view/history and investment-evidence tests passed 30/30 with no skips. The test now verifies that the old rationale survives in the append-only history, that only reason/date changed, and that the new bilingual reasons do not type model figures. Aggregate checks are recorded by the integrating release, not implied by this focused result.

核验范围：上述观察来自官方网页/PDF提取，并非新存档的原始字节或内容哈希。观点/历史及投资证据定向测试30/30通过，无跳过；测试核实旧依据仍在追加式历史中、仅理由/日期变动，以及中英新文字未写死模型数字。完整检查由集成发布记录，不能由本次定向通过推定。

#### WA project-capacity scope: public sources exist, but no target facility is selected / 西澳项目容量范围：有公开来源，但未指定目标设施

**Scope clarification:** the three additional investment-evidence items are WA project capacity/access eligibility, WA benchmark technology, and Romania grants. ERCOT February MORA is an additional calendar watch, not a substitute for the WA project-capacity item.

**范围澄清：** 三项额外投资证据是西澳项目容量/接入资格、西澳基准技术及罗马尼亚补贴。ERCOT二月MORA另作日历跟踪，不替代西澳项目容量事项。

**No project-specific decision is needed now.** The public WA comparison interface defines an archetype by power and duration, and the public view selects a capacity design and entry route; neither identifies a target facility ID. The investment-card path builds a generic reference from these model inputs. This is a market-screening reference, not a named project's awarded capacity or permission to earn FCESS revenue. No private project files were consulted to infer a target.

**目前无需项目级决定。** 公开西澳比较接口以功率及储能时长定义原型，公开观点选择容量设计及进入路径，二者均未指定目标设施ID。投资卡片从这些模型输入建立通用参考情景。这是市场筛选参考，不代表某个具名项目已获容量授予或FCESS收入资格。本轮未查询私有项目文件来推定目标。

Public primary evidence inspected on 10 November:

- [AEMO Reserve Capacity Price](https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wa-reserve-capacity-mechanism/reserve-capacity-price), “Outcome for 2028-29 Capacity Year”, confirms market-wide assigned credits and the price calculation. These aggregate observations support the market context, not the qualification of the model's reference asset.
- [AEMO Certification of Reserve Capacity](https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wa-reserve-capacity-mechanism/certification-of-reserve-capacity), current CRC explanation, explicitly distinguishes certification from Capacity Credits/payment entitlement. Bilateral declarations, applicable security and the NAQ process remain relevant; assigned credits cannot exceed NAQ.
- [AEMO registered facilities](https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/participate-in-the-market/information-for-current-participants/rule-participants-and-registered-facilities-in-the-wem) links a daily-updated public facility register. [AEMO current FCESS accreditation](https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/system-operations/essential-system-services/summary-of-frequency-co-optimised-essential-system-services/current-fcess-and-roco) separately links its accredited-facilities list, labelled 12 June 2026. Registration, capacity awards and service-specific accreditation are distinct evidence sets. Their landing pages were opened; the underlying facility tables were not parsed or matched to any project in this pass.

11月10日核对的一手公开证据：

- AEMO容量价格页面的2028/29容量年结果确认全市场容量信用分配及价格计算。这些汇总观察支持市场背景，不能证明模型参考资产的资格。
- AEMO容量认证页面现行说明明确区分认证与容量信用/付款权利；仍涉及双边申报、适用保证金及NAQ流程，容量信用不得超过NAQ。
- AEMO注册设施页面链接每日更新的公开设施名录；FCESS认证页面另列已获认证设施清单，页面标注2026年6月12日。注册、容量授予和分服务认证是不同证据。本轮已打开这些入口页，未解析底层设施表，也未将其与任何项目匹配。

**Platform treatment:** mark the market-level evidence and public lookup routes as verified within that limited scope; mark project matching as “not applicable until a target is selected”, not “all private contracts missing”. Keep the generic model conditional and unchanged. Do not invent an ID, infer entitlement from market totals, or ask the analyst for any private contract now. If a real project is later selected, match its public facility identity, capacity year and service-specific accreditation first; request only the remaining material evidence necessary for that concrete decision, if any. This follow-up made no access to WA.gov.au and no change to models, grades or public event outcomes.

**平台处理：** 将市场层面证据及公开查询入口记为限定范围内已核验；项目匹配标注为“指定目标后才适用”，而非“缺少所有私有合同”。通用模型继续保留条件且不变。现在不虚构ID、不从全市场总量推定项目权利，也不向分析师索取任何私有合同。未来选定实际项目时，先匹配公开设施身份、容量年度及分服务认证，再视具体决定需要仅补尚缺的关键证据。本次补查未访问WA.gov.au，未改变模型、评级或公开事件结果。
