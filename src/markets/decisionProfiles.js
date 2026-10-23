/* IC refinement overlay.

   These records contain cross-market decision metadata, not detailed-dashboard
   content or model arithmetic. They are attached to each market's comparison
   interface by the registry so every home component reads the same contract.
   The market modules remain the authority for economics and detailed sources. */

import {
  REVENUE_EVIDENCE_CLASS as R,
  VALUE_EVIDENCE_CLASS as V,
  validateRevenueEvidenceSet,
} from '../governance/revenueEvidence.js';

/* Policy and consensus layer re-read against published sources on 2026-10-10.
   Confidence scores, consensus statuses and run-rate factors were NOT re-scored
   in that pass — only the statements of fact underneath them. */
const AS_OF = '2026-10-10';

const ev = (evidenceClass, valueClass, basis, sources, projectBinding = false) => ({
  evidenceClass, valueClass, projectBinding, basis, sources, asOf: AS_OF,
});

const proxy = (basis, sources) => ev(R.DERIVED_PRIVATE_PROXY, V.PROXY, basis, sources);
const clearing = (basis, sources) => ev(R.PUBLISHED_MARKET_CLEARING, V.OBSERVED_DISCLOSED, basis, sources);
const disclosed = (basis, sources) => ev(R.DISCLOSED_TRANSACTION_BENCHMARK, V.OBSERVED_DISCLOSED, basis, sources);
const derived = (basis, sources) => ev(R.DERIVED_PRIVATE_PROXY, V.DERIVED, basis, sources);
const placeholder = (basis) => ev(R.DERIVED_PRIVATE_PROXY, V.PLACEHOLDER, basis, ['Platform seed — replace before underwriting']);

const UNKNOWN_CONTRACT = Object.freeze({
  counterparty: ['Unknown at market-screen level', '市场筛选层面未知'],
  indexation: ['Unknown', '未知'],
  reset: ['Unknown', '未知'],
  upside: ['Unknown', '未知'],
  dispatch: ['Unknown', '未知'],
  penalties: ['Unknown', '未知'],
  termination: ['Unknown', '未知'],
  deliverability: ['Project evidence required', '需要项目证据'],
  refinancing: ['Not evidenced', '未有证据支持'],
});

const profile = config => Object.freeze({
  reviewDate: AS_OF,
  pipeline: {
    eligible: false,
    reason: ['No register yet satisfies the global coverage and de-duplication contract; excluded from decision metrics.',
             '尚无项目登记满足全球覆盖与去重合同；不计入决策指标。'],
  },
  contractRisk: UNKNOWN_CONTRACT,
  currentRunRateFactor: 1,
  demandShockFactor: null,
  ...config,
});

export const MARKET_DECISION_PROFILES = {
  wa: profile({
    confidenceScore: 7,
    consensus: { status:'aligned', summary:['Constructive only with confirmed Capacity Credits, NAQ/access rights and a zero-or-negative merchant downside.', '仅在容量信用、NAQ/接入权落实并采用零或负市场化下行情景时保持建设性。'], sources:['AEMO WEM ESOO 2026', 'ERA BRCP final determination 2026', 'IC consolidated review'] },
    currentUpdate: ['The 2028-29 benchmark price is A$488,500/MW (ERA final, 13 March 2026), not the A$491,700 draft. RCM scarcity is credible; merchant, FCESS, O&M and NAQ inputs remain modelled and access value depends on reinforcement timing.', '2028-29年基准价为每MW A$488,500（ERA最终裁定，2026年3月13日），而非草案的A$491,700。RCM稀缺性可信；市场化、FCESS、运维及NAQ仍属模型输入，接入价值取决于增容时点。'],
    investmentGate: ['Confirmed Capacity Credits', 'Confirmed NAQ and access rights', 'Merchant downside at zero or below'],
    revenueEvidence: {
      cap: clearing(['RCM payment is a published mechanism benchmark, not a project award.', 'RCM付费为已公布机制基准，并非项目中标。'], ['AEMO WEM ESOO 2026']),
      toll: proxy(['No disclosed WA toll price is loaded.', '未载入已披露的WA租赁价格。'], ['Private bilateral market']),
      ltda: proxy(['No long-term award route is loaded.', '未载入长期中标路径。'], ['Not applicable']),
      merchant: derived(['Merchant capture is modelled from market evidence and optimiser assumptions.', '市场化捕获由市场证据与优化假设衍生。'], ['AEMO market data', 'Platform model']),
      services: placeholder(['FCESS value remains a seed input.', 'FCESS价值仍为种子输入。']),
    },
    contractRisk: { ...UNKNOWN_CONTRACT, counterparty:['AEMO / market mechanism', 'AEMO/市场机制'], indexation:['Mechanism-vintage specific', '按机制年份'], reset:['Capacity Credits and NAQ/access conditions', '容量信用及NAQ/接入条件'], upside:['Merchant upside retained subject to access', '在接入约束下保留市场化上行'], dispatch:['Owner/optimiser, subject to RCM obligation', '业主/优化商，受RCM义务约束'], penalties:['RCM performance exposure', 'RCM履约风险'], refinancing:['Potentially supportive when credits and access are confirmed', '容量信用与接入确认后可能支持再融资'] },
  }),
  nem: profile({
    confidenceScore: 6,
    consensus: { status:'more_bullish', summary:['The dashboard remains more generous than the current merchant tape; no merchant-only approval.', '看板仍较当前市场化行情乐观；不批准纯市场化项目。'], sources:['AEMO QED Q2 2026', 'IC consolidated review'] },
    currentUpdate: ['CIS/toll terms are private; the modelled floor is a proxy and recent merchant conditions should size the downside. Tender 10 is reported as the last NEM dispatchable round, and the successor (ESEM) is at draft-legislation stage with a first round indicatively late 2027.', 'CIS/租赁条款属私有；模型保底为代理值，下行情景应以近期市场化水平定标。第10轮据报为最后一轮NEM可调度电源招标，后继机制（ESEM）尚处立法草案阶段，首轮采购暂定于2027年底。'],
    currentRunRateFactor: 0.32,
    investmentGate: ['Executed CIS or toll terms', 'Site-specific MLF', 'Curtailment evidence', 'Low-case debt sizing'],
    revenueEvidence: {
      cap: proxy(['NEM has no capacity market.', 'NEM无容量市场。'], ['Not applicable']),
      toll: proxy(['CIS floor and private BESS toll prices are undisclosed.', 'CIS保底及私有储能租赁价格未披露。'], ['CIS design documents', 'Private bilateral market']),
      ltda: proxy(['Representative CIS payment is modelled, not an observed project award.', '代表性CIS付费为模型值，并非已观测项目中标。'], ['CIS design documents']),
      merchant: derived(['Capture is derived from observed spreads and a dispatch assumption.', '捕获值由已观测价差与调度假设衍生。'], ['AEMO QED Q2 2026']),
      services: derived(['FCAS value is derived from public market outcomes.', 'FCAS价值由公开市场结果衍生。'], ['AEMO QED Q2 2026']),
    },
    contractRisk: { ...UNKNOWN_CONTRACT, counterparty:['Government scheme or private offtaker — case specific', '政府计划或私有承购方—视项目而定'], indexation:['Undisclosed in the modelled proxy', '模型代理值未披露'], reset:['Floor/ceiling and availability terms are project specific', '保底/封顶及可用性条款因项目而异'], upside:['CIS sharing terms are project specific', 'CIS上行分享条款因项目而异'], dispatch:['Project agreement dependent', '取决于项目协议'], penalties:['Project agreement dependent', '取决于项目协议'], refinancing:['Not evidenced without executed terms', '无已执行条款则未有证据支持'] },
  }),
  gb: profile({
    confidenceScore: 8,
    consensus: { status:'aligned', summary:['Location, final de-rating, TNUoS and dispatch execution determine value.', '位置、最终折减、TNUoS及调度执行决定价值。'], sources:['NESO', 'Ofgem', 'IC consolidated review'] },
    currentUpdate: ['TNUoS reform restores a cost-side locational signal by 2029; node/GSP BM capture remains the project gate.', 'TNUoS改革将在2029年前恢复成本侧位置信号；节点/GSP平衡机制捕获仍是项目门槛。'],
    currentRunRateFactor: 1,
    investmentGate: ['Node/GSP BM evidence', 'Final de-rating input', 'Dispatch-performance evidence', 'TNUoS sensitivity'],
    revenueEvidence: {
      cap: clearing(['Capacity Market clearing is published; project award remains separate.', '容量市场出清已公布；项目中标仍需另行证明。'], ['NESO Capacity Market results']),
      toll: proxy(['Toll precedents exist but transaction prices are private.', '存在租赁先例，但交易价格未公开。'], ['Public transaction announcements']),
      ltda: proxy(['No representative long-term award is loaded.', '未载入代表性长期中标。'], ['Not applicable']),
      merchant: derived(['BM/wholesale capture is a model over public benchmarks.', 'BM/批发捕获为基于公开基准的模型值。'], ['NESO/Elexon', 'Public benchmarks']),
      services: derived(['Ancillary value is derived from public outcomes.', '辅助服务价值由公开结果衍生。'], ['NESO']),
    },
    contractRisk: { ...UNKNOWN_CONTRACT, counterparty:['NESO capacity mechanism; toll counterparty case specific', 'NESO容量机制；租赁交易对手因项目而异'], indexation:['Capacity-vintage specific', '按容量市场年份'], reset:['De-rating and TNUoS change by vintage', '折减及TNUoS按年份变化'], upside:['Merchant/BM upside depends on route', '市场化/BM上行取决于路径'], dispatch:['Optimiser execution is load-bearing', '优化商执行为关键'], penalties:['Capacity and dispatch performance exposure', '容量及调度履约风险'], refinancing:['Supported only by evidenced award/toll and dispatch history', '仅由已证明中标/租赁及调度历史支持'] },
  }),
  de: profile({
    confidenceScore: 6,
    consensus: { status:'more_bullish', summary:['The merchant seed is above current consensus; underwrite a toll or the low case.', '市场化种子值高于当前共识；应按租赁或低情景承销。'], sources:['Bundesnetzagentur', 'IC consolidated review'] },
    currentUpdate: ['Storage can access the May 2027 StromVKG round without a long-duration test, and the scheme\'s EU state-aid approval was reported on 2 September 2026. The grid-fee waiver expires in August 2029; the regulator\'s final draft (6 August 2026) keeps 20-year relief for projects with FID before its decision.', '储能可参加2027年5月无长时要求的StromVKG轮次，该机制的欧盟国家援助批准已于2026年9月2日见诸报道。电网费豁免于2029年8月到期；监管机构的最终草案（2026年8月6日）为在其决定前完成投资决策的项目保留20年减免。'],
    currentRunRateFactor: 0.55,
    investmentGate: ['Strong connection', 'Executed toll or evidenced low case', '2030 saturation stress', 'Grid-fee and gas sensitivity'],
    revenueEvidence: {
      cap: proxy(['No clearing price exists yet for the May 2027 storage-accessible route.', '2027年5月储能可参与路径尚无出清价。'], ['Bundesnetzagentur StromVKG']),
      toll: proxy(['Tolling momentum is observed; prices remain undisclosed.', '租赁趋势已观测；价格仍未披露。'], ['Public transaction announcements']),
      ltda: proxy(['No representative long-term award is loaded.', '未载入代表性长期中标。'], ['Not applicable']),
      merchant: derived(['Optimised intraday capture is modelled above public market observations.', '优化后的日内捕获为基于公开市场观测的模型值。'], ['ENTSO-E', 'Public benchmarks']),
      services: derived(['Ancillary value is derived and exposed to measured saturation.', '辅助服务价值为衍生值并面临已观测饱和。'], ['German TSO results']),
    },
  }),
  it: profile({
    confidenceScore: 8,
    consensus: { status:'more_bullish', summary:['The blended 4-hour headline is richer than current 6-hour-plus MACSE commentary; compare by route and zone.', '混合的4小时标题回报高于当前6小时以上MACSE市场评论；应按路径与区域比较。'], sources:['Terna MACSE results', 'IC consolidated review'] },
    currentUpdate: ['MACSE cleared at 35% of cap with 6.6–6.7 hour winning duration; a 4-hour asset is not the representative winning product. The second auction (24 November 2026) carries a lower cap of €27,000/MWh/yr.', 'MACSE以封顶价35%出清，中标平均时长6.6–6.7小时；4小时资产并非代表性中标产品。第二次拍卖（2026年11月24日）的上限降至每MWh每年€27,000。'],
    currentRunRateFactor: 0.9,
    investmentGate: ['Executed MACSE award or separately evidenced toll', 'Zone-specific transmission stress', 'Current-vintage de-rating', 'Route-specific economics'],
    revenueEvidence: {
      cap: clearing(['Capacity clearing inputs are published by vintage.', '容量出清输入按年份公开。'], ['Terna']),
      toll: proxy(['Italian toll prices are private.', '意大利租赁价格属私有。'], ['Public transaction announcements']),
      ltda: clearing(['MACSE clearing is published, but the model is not an identified project award.', 'MACSE出清已公布，但模型并非具名项目中标。'], ['Terna MACSE results']),
      merchant: derived(['Merchant capture is derived from public benchmarks.', '市场化捕获由公开基准衍生。'], ['GME/Terna', 'Public benchmarks']),
      services: placeholder(['O&M/services separation remains partly seeded.', '运维/服务拆分仍部分为种子值。']),
    },
  }),
  ie: profile({
    confidenceScore: 7,
    consensus: { status:'stale', summary:['Transition date withdrawn: the TSOs said in June 2026 that May 2027 DASSA go-live is not feasible and have set no new date; the DS3 long-stop remains 30 September 2027.', '过渡日期已撤回：输电运营商于2026年6月表示2027年5月DASSA上线不可行，且未给出新日期；DS3最终截止日仍为2027年9月30日。'], sources:['EirGrid/SONI notices', 'IC consolidated review'] },
    currentUpdate: ['A gap between the DS3 long-stop and DASSA go-live is now possible, and the TSOs say a further DS3 gate may not be practical. The DS3 bridge changes 2026–27 cash flow; DASSA/FASS competitive procurement should not inherit legacy tariffs.', 'DS3最终截止日与DASSA上线之间现已可能出现空档，且输电运营商表示再开一轮DS3并不现实。DS3过渡影响2026–27现金流；DASSA/FASS竞争采购不应沿用历史费率。'],
    currentRunRateFactor: 1,
    investmentGate: ['Four-hour capacity-backed case', 'DASSA bridge terms', 'Policy-timeline sensitivity', 'Wholesale capture evidence'],
    revenueEvidence: {
      cap: clearing(['CRM clearing price is published by delivery year.', 'CRM出清价按实需年度公开。'], ['SEMO capacity results']),
      toll: proxy(['No representative toll is loaded.', '未载入代表性租赁。'], ['Not applicable']),
      ltda: proxy(['No representative long-term award is loaded.', '未载入代表性长期中标。'], ['Not applicable']),
      merchant: derived(['Wholesale capture is modelled from public market evidence.', '批发捕获由公开市场证据建模。'], ['SEMO']),
      services: placeholder(['DS3/FASS value and transition curve are only partly sourced.', 'DS3/FASS价值及过渡曲线仅部分有来源支持。']),
    },
  }),
  /* Finland is the lowest confidence score on the platform, and deliberately so:
     the structure is verified end to end while the largest revenue line is
     withheld. A score that rewarded the quality of the structural evidence would
     read as confidence in a number this market declines to publish. */
  /* Ontario, added 2026-10-23 with its registration. The score is Claude's
     draft for the analyst: the contract is read from the final documents
     (Strong), the trading line from 90 days and capex from one observed plant
     (Fair). */
  ca_on: profile({
    reviewDate: '2026-10-23',
    confidenceScore: 7,
    consensus: { status:'aligned', summary:['A system-operator contract for twenty years with market revenue retained; the open questions are the trading level and holding eight hours of tested capacity for the term.', '系统运营商提供二十年合同且保留市场收入；待解问题为交易收入水平及全期维持八小时测试容量。'], sources:['IESO LT2(c-1) Contract and RFP', 'IESO LT2(c-1) results', 'IESO day-ahead price reports'] },
    currentUpdate: ['Window 1 cleared three eight-hour batteries at C$527.20–614.47/MW-Business Day (weighted C$563.48). Window 2 drafts, posted 9 October 2026, keep the terms and move the milestone to 1 May 2032; target MW and dates are blank.', '窗口1以每MW工作日527.20–614.47加元（加权563.48加元）授予三个八小时储能项目。2026年10月9日发布的窗口2草案保留条款，并将里程碑推至2032年5月1日；目标容量与日程尚未确定。'],
    investmentGate: ['Window-2 award at a supported price', 'Tested capacity held above 85% for the term', 'CT-ITC eligibility confirmed', 'Trading re-read on a full year'],
    revenueEvidence: {
      cap: clearing(['LT2 window-1 prices are published per project by IESO; the seed is the weighted average × 251 Business Days.', 'IESO按项目公布LT2窗口1价格；种子值为加权平均价×251个工作日。'], ['IESO LT2(c-1) results']),
      toll: proxy(['No toll route is loaded.', '未载入租赁路径。'], ['Not applicable']),
      ltda: proxy(['LT2 is modelled as the capacity route.', 'LT2按容量路径建模。'], ['Not applicable']),
      merchant: derived(['Eight-hour spread on 90 days of IESO day-ahead prices, annualised with HOEP\'s seasonal ratio and the platform\'s PJM haircuts.', '基于90天IESO日前电价的八小时价差，以HOEP季节比率年化并按平台PJM折减。'], ['IESO day-ahead zonal price', 'IESO yearly HOEP']),
      services: proxy(['Operating reserve is not counted.', '未计入运行备用。'], ['IESO yearly HOEP OR prices']),
    },
    contractRisk: { ...UNKNOWN_CONTRACT, counterparty:['IESO', 'IESO'], indexation:['20% to Ontario CPI after COD; whole price to CPI before', '投运后20%与安大略CPI挂钩；投运前全额挂钩'], reset:['None for twenty years; re-opened only by post-bid tariffs or a storage rule change', '二十年内无重设；仅因投标后关税或储能规则变更可重新议价'], upside:['All market revenue retained by the owner', '市场收入全部归业主'], dispatch:['Owner/optimiser, subject to the day-ahead must-offer', '业主/优化商，受日前强制申报约束'], penalties:['Availability charges up to twice the monthly payment; default below 85% tested capacity', '可用性扣款最高为月付款两倍；测试容量低于85%即违约'], termination:['Default for failed capacity tests or a missed longstop', '容量测试失败或错过最终期限即违约'], deliverability:['Eight hours of contract capacity, tested up to once a season', '合同容量八小时，每季最多测试一次'], refinancing:['Supportive: a twenty-year system-operator contract', '有利：二十年系统运营商合同'] },
  }),
  fi: profile({
    confidenceScore: 3,
    consensus: { status:'stale', summary:['Structure verified against Fingrid and the Energy Authority; reserve revenue withheld pending a saturation measure. Not comparable to a market with complete economics.', '市场结构已依据Fingrid与能源局核验；备用收入在饱和度指标建立前暂缓发布。不可与经济性完整的市场直接比较。'], sources:['Fingrid power system reserves', 'Energy Authority national report'] },
    currentUpdate: ['The case needs eligible-versus-procured reserve MW by product, the Fingrid open-data licence resolved, and a captured-spread backtest on 15-minute settlement.', '该案例需要分品种的合格容量与采购容量对比、明确Fingrid开放数据许可条款，以及基于15分钟结算的捕获价差回测。'],
    currentRunRateFactor: 0.5,
    investmentGate: ['Reserve saturation measure', 'Fingrid data licence', 'Contracted connection right', '15-minute captured-spread backtest'],
    revenueEvidence: {
      cap: proxy(['The peak load capacity mechanism exists in law and procured nothing for 2025-26; there is no adequacy revenue to model.', '峰荷容量机制在法律上存在，但2025-26年度未采购任何容量；无充裕度收入可建模。'], ['Not applicable']),
      toll: proxy(['No repeatable public tolling precedent has been read.', '未获取可复制的公开租赁先例。'], ['Private bilateral market']),
      ltda: proxy(['No long-term award route exists in this market.', '本市场不存在长期中标路径。'], ['Not applicable']),
      merchant: derived(['Day-ahead capture is modelled from the published price record and the 15-minute market time unit.', '日前捕获收入依据已公布价格记录及15分钟结算周期建模。'], ['ENTSO-E Transparency Platform']),
      services: proxy(['Withheld. Connected storage passed 1,050 MW in February 2026 against fast-reserve obligations summing to about 795 MW — an acute saturation warning rather than a measured oversupply, since the obligation aggregates separately procured products — and Fingrid forecasts FCR-N declining. A level published now would be a forecast that today persists.', '暂缓发布。2026年2月已并网储能超过1,050MW，而快速备用需求合计约795MW — 鉴于需求方为多个独立采购品种的合计，这构成强烈的饱和预警而非已测得的供给过剩 — 且Fingrid预测FCR-N需求下降。此时发布任何水平值都等同于假设当前状况将长期持续。'], ['Fingrid power system reserves']),
    },
  }),
  ro: profile({
    confidenceScore: 4,
    consensus: { status:'more_bullish', summary:['High opportunity / low evidence confidence; observed prices and spreads are not captured project revenue.', '高机会/低证据置信度；已观测价格与价差并非项目捕获收入。'], sources:['OPCOM FY2025', 'IC consolidated review'] },
    currentUpdate: ['The case needs a named grant, captured-spread backtest and rapid FCR saturation downside. Operating storage roughly doubled to about 2 GWh by August 2026, and the €150m grant call closes 30 October 2026.', '该案例需要具名补贴、捕获价差回测及快速FCR饱和下行情景。至2026年8月在运储能约翻倍至2GWh左右，1.5亿欧元补贴申报于2026年10月30日截止。'],
    currentRunRateFactor: 0.7,
    investmentGate: ['Named grant award', 'Captured-spread backtest', 'Balancing prequalification', 'Rapid FCR saturation downside'],
    revenueEvidence: {
      cap: proxy(['Romania has no capacity mechanism in this case.', '本案例中罗马尼亚无容量机制。'], ['Not applicable']),
      toll: proxy(['A negotiated floor is project specific and not loaded.', '协商保底因项目而异且未载入。'], ['Private bilateral market']),
      ltda: proxy(['No representative long-term award is loaded.', '未载入代表性长期中标。'], ['Not applicable']),
      merchant: derived(['Market descriptors are converted into modelled capture.', '市场描述被转换为模型捕获。'], ['OPCOM FY2025']),
      services: proxy(['FCR curve is calibrated from another market rather than Romanian operating history.', 'FCR曲线由其他市场而非罗马尼亚运营历史标定。'], ['Platform cross-market proxy']),
    },
  }),
  pl: profile({
    confidenceScore: 7,
    consensus: { status:'stale', summary:['The December 2025 auction was the last main capacity auction and none is planned in 2026; new entry is merchant plus balancing pending a successor framework. One-year supplementary auctions cleared batteries for the first time in September 2026.', '2025年12月拍卖为最后一次主容量拍卖，2026年不再安排；在后续机制落地前，新进入者应按市场化加平衡服务评估。一年期补充拍卖于2026年9月首次有储能中标。'], sources:['URE/PSE DY2030 results', 'IC consolidated review'] },
    currentUpdate: ['The 17-year contract is a legacy-vintage screen, not a replicable default; the unnamed 10% grant is excluded from the new-entry case.', '17年合同属历史年份筛选，并非可复制默认路径；新进入案例不采用未具名的10%补贴。'],
    currentRunRateFactor: 1,
    investmentGate: ['Confirmed connection right', 'Named grant eligibility', 'Co-optimised aFRR/arbitrage case', 'Successor-framework evidence'],
    revenueEvidence: {
      cap: clearing(['The DY2030 clearing is published but is the last main-auction vintage, not a replicable new-entry route.', 'DY2030出清已公布，但属最后一次主拍卖年份，并非可复制的新进入路径。'], ['URE/PSE DY2030 results']),
      toll: proxy(['No disclosed toll is loaded.', '未载入已披露租赁。'], ['Private bilateral market']),
      ltda: proxy(['No representative long-term award is loaded.', '未载入代表性长期中标。'], ['Not applicable']),
      merchant: derived(['Merchant and balancing capture remain modelled.', '市场化及平衡捕获仍为模型值。'], ['TGE/PSE evidence']),
      services: derived(['Balancing value is modelled from market opening evidence.', '平衡服务价值由市场开放证据建模。'], ['PSE']),
    },
  }),
  jp_tokyo: profile({
    confidenceScore: 5,
    consensus: { status:'stale', summary:['LTDA Round 3 concluded on 13 May 2026. Round 4 bids run 27 January–3 February 2027: lithium-ion is capped at 400 MW, certified-cell projects are awarded first, and the battery bid ceiling falls to ¥70,675–74,417/kW/yr.', 'LTDA第三轮已于2026年5月13日结束。第四轮投标期为2027年1月27日至2月3日：锂离子上限40万kW，认定电芯项目优先中标，蓄电池投标上限降至每kW每年¥70,675–74,417。'], sources:['OCCTO LTDA Round 3', 'IC consolidated review'] },
    currentUpdate: ['The modelled LTDA payment is cost-derived, not an identified CRA price; Tokyo remains the strongest regional demand case.', '模型LTDA付费由成本衍生，并非具名CRA价格；东京仍为最强区域需求案例。'],
    currentRunRateFactor: 0.9,
    investmentGate: ['Actual CRA price', 'Connection rights', 'Sourcing compliance', 'Regional captured-price backtest'],
    revenueEvidence: {
      cap: clearing(['Annual Capacity Market area clearing is published; the model has no project award.', '年度容量市场区域出清已公布；模型无项目中标。'], ['OCCTO Capacity Market']),
      toll: proxy(['No toll route is loaded.', '未载入租赁路径。'], ['Not applicable']),
      ltda: proxy(['LTDA payment is a cost-reflective derived bid, not a published winning price.', 'LTDA付费为成本反推投标价，并非已公布中标价。'], ['OCCTO LTDA Round 3']),
      merchant: derived(['Six-hour JEPX capture is derived from observed four-hour data.', '6小时JEPX捕获由已观测4小时数据衍生。'], ['JEPX governed snapshot']),
      services: placeholder(['Incremental balancing value remains seeded.', '增量平衡服务价值仍为种子值。']),
    },
  }),
  jp_kyushu: profile({
    confidenceScore: 5,
    consensus: { status:'stale', summary:['LTDA Round 3 is final and stricter; Kyushu requires actual award and curtailment-access evidence.', 'LTDA第三轮已最终确定且更严格；九州需要实际中标及弃电接入证据。'], sources:['OCCTO LTDA Round 3', 'IC consolidated review'] },
    currentUpdate: ['Derived LTDA payment is not secured; curtailment charging access and connection quality determine the regional case.', '衍生LTDA付费并非已锁定；弃电充电接入及并网质量决定区域案例。'],
    currentRunRateFactor: 0.9,
    investmentGate: ['Actual CRA price', 'Charge/discharge rights', 'Curtailment-access evidence', 'Sourcing compliance'],
    revenueEvidence: null,
  }),
  jp_hokkaido: profile({
    confidenceScore: 4,
    consensus: { status:'stale', summary:['LTDA Round 3 is final and stricter; long interconnector runway does not replace weak project connection evidence.', 'LTDA第三轮已最终确定且更严格；长期互联通道窗口不能替代薄弱的项目并网证据。'], sources:['OCCTO LTDA Round 3', 'IC consolidated review'] },
    currentUpdate: ['Watch only unless an awarded CRA and unusually strong connection evidence remove regional risk.', '除非已获CRA且并网证据异常强，否则仅观察。'],
    currentRunRateFactor: 0.9,
    investmentGate: ['Awarded CRA', 'Strong connection evidence', 'Sourcing compliance', 'Regional captured-price backtest'],
    revenueEvidence: null,
  }),
  pjm: profile({
    confidenceScore: 7,
    consensus: { status:'aligned', summary:['Near-term scarcity is published; the annual capped clearing must not become a 15-year secured curve.', '近期稀缺性已公开；年度封顶出清不得被视为15年锁定曲线。'], sources:['PJM 2028/29 BRA', 'IC consolidated review'] },
    currentUpdate: ['The 2028/29 auction cleared at the $325/MW-day cap and was 6,831 MW short; the December 2026 auction for 2029/30 is capped at $337.83. FERC suspended the Reliability Backstop filing to 28 February 2027. Accreditation and collar expiry remain separate scenarios.', '2028/29拍卖以每MW每日325美元上限出清并短缺6,831MW；2026年12月举行的2029/30拍卖上限为337.83美元。FERC已将可靠性兜底采购申请中止至2027年2月28日。核证变化与上下限终止须分别建模。'],
    currentRunRateFactor: 0.9,
    demandShockFactor: 1.35,
    investmentGate: ['Accreditation path', 'Price-reset case', 'CIR/interconnection evidence', 'Node-level data-centre thesis'],
    revenueEvidence: {
      cap: clearing(['BRA price and accreditation are published for one delivery year.', 'BRA价格及核证针对一个实需年度公开。'], ['PJM 2028/29 BRA']),
      toll: proxy(['No toll route is loaded.', '未载入租赁路径。'], ['Not applicable']),
      ltda: proxy(['No long-term award route is loaded.', '未载入长期中标路径。'], ['Not applicable']),
      merchant: derived(['Energy capture is modelled from nodal/spread evidence.', '电能量捕获由节点/价差证据建模。'], ['PJM market data']),
      services: proxy(['Regulation tail is an analyst saturation scenario.', '调频尾部为分析师饱和情景。'], ['PJM regulation evidence']),
    },
  }),
  ercot: profile({
    confidenceScore: 5,
    consensus: { status:'aligned', summary:['The toll-versus-index disagreement remains unresolved; no merchant approval and no secured label for the toll proxy.', '租赁与指数分歧仍未解决；不批准纯市场化项目，租赁代理值不得标为已锁定。'], sources:['Modo/Enverus public analysis', 'IC consolidated review'] },
    currentUpdate: ['The $90,240/MW-year toll is a market-value proxy; the large-load queue, now about 474 GW, is an explicit upside scenario, not base revenue — and data-centre interconnections have been paused for audit since 3 August 2026. June 2026 fleet revenue was a record-low $1.11/kW-month.', '每MW年90,240美元租赁为市场价值代理；大负荷排队现约474GW，为明确上行情景，并非基准收入 — 且自2026年8月3日起数据中心并网因审计而暂停。2026年6月机组收入创每kW月1.11美元的历史新低。'],
    currentRunRateFactor: 1,
    demandShockFactor: 1.6,
    investmentGate: ['Actual toll price and tenor', 'Dispatch and basis terms', 'Node and merchant tail', 'Counterparty credit'],
    revenueEvidence: {
      cap: proxy(['ERCOT has no capacity market.', 'ERCOT无容量市场。'], ['Not applicable']),
      toll: proxy(['Toll value is derived from a market-value proxy; transaction prices are undisclosed.', '租赁价值由市场价值代理衍生；交易价格未披露。'], ['Public transaction announcements']),
      ltda: proxy(['No long-term award route is loaded.', '未载入长期中标路径。'], ['Not applicable']),
      merchant: disclosed(['Realised fleet revenue index is publicly benchmarked.', '机组已实现收入指数有公开基准。'], ['Public ERCOT revenue benchmarks']),
      services: derived(['Ancillary value is derived from observed market outcomes.', '辅助服务价值由已观测市场结果衍生。'], ['ERCOT market data']),
    },
  }),
  caiso: profile({
    confidenceScore: 6,
    consensus: { status:'stale', summary:['Fleet is 16.7 GW in the July 2026 reliability outlook; June merchant revenue is $2.55/kW-month and the modelled RA price/tenor are not an executed agreement.', '2026年7月可靠性展望显示机组规模16.7GW；6月市场化收入每kW月2.55美元，模型RA价格/期限并非已执行协议。'], sources:['California reliability outlook 2026', 'IC consolidated review'] },
    currentUpdate: ['CPUC D.26-07-008 cuts storage qualifying capacity for foldback from 2027 and moves storage to unit-specific UCAP from 2028; the model does not yet price either. RA is structurally sound but bilateral; deliverability, counterparty, termination and vintage dominate the market average.', 'CPUC D.26-07-008自2027年起因出力回落下调储能合格容量，并自2028年起对储能实行机组级UCAP；模型尚未计入二者。RA结构合理但属双边交易；可交付性、交易对手、终止条款及年份主导结果。'],
    currentRunRateFactor: 0.98,
    investmentGate: ['Executed RA agreement', 'Deliverability status', 'Counterparty and termination analysis', 'Cannibalised merchant tail'],
    revenueEvidence: {
      cap: proxy(['The $8.77/kW-month RA input is a bilateral average with a seeded tenor, not an executed agreement or clearing.', '每kW月8.77美元RA输入为双边平均值且期限为种子值，并非已执行协议或出清。'], ['H1 2025 bilateral RA benchmark']),
      toll: proxy(['No toll route is loaded.', '未载入租赁路径。'], ['Not applicable']),
      ltda: proxy(['No representative long-term award route is loaded.', '未载入代表性长期中标路径。'], ['Not applicable']),
      merchant: disclosed(['June 2026 merchant benchmark is publicly reported.', '2026年6月市场化基准已公开报告。'], ['Public CAISO revenue benchmark']),
      services: derived(['Ancillary split is derived from an unreconciled full-stack benchmark.', '辅助服务拆分由未调和全口径基准衍生。'], ['Public CAISO full-stack benchmark']),
    },
  }),
};

/* Japan shares one national rulebook and one LTDA evidence classification. */
for (const id of ['jp_kyushu', 'jp_hokkaido']){
  const base = MARKET_DECISION_PROFILES[id];
  const tokyoEvidence = MARKET_DECISION_PROFILES.jp_tokyo.revenueEvidence;
  MARKET_DECISION_PROFILES[id] = Object.freeze({ ...base, revenueEvidence: tokyoEvidence });
}
Object.freeze(MARKET_DECISION_PROFILES);

export function decisionProfileForMarket(marketId){
  return MARKET_DECISION_PROFILES[marketId] || null;
}

export function validateDecisionProfiles(marketIds){
  const problems = [];
  for (const id of marketIds || Object.keys(MARKET_DECISION_PROFILES)){
    const item = MARKET_DECISION_PROFILES[id];
    if (!item){ problems.push(id + ': profile missing'); continue; }
    if (!Number.isInteger(item.confidenceScore) || item.confidenceScore < 0 || item.confidenceScore > 10){
      problems.push(id + ': confidenceScore must be 0-10');
    }
    if (!['aligned', 'more_bullish', 'more_bearish', 'stale'].includes(item.consensus?.status)){
      problems.push(id + ': invalid consensus status');
    }
    if (!Array.isArray(item.investmentGate) || item.investmentGate.length === 0){
      problems.push(id + ': investmentGate is required');
    }
    problems.push(...validateRevenueEvidenceSet(item.revenueEvidence).map(problem => id + ': ' + problem));
  }
  return problems;
}

