/* Lightweight public reading cards. No model, investor, strategy or SVG imports.
   Re-edited public interpretations are review drafts, authorised for implementation
   on 6 November 2026. The reader was integrated on 14 November; the original
   G-1/G-2 approvals and source dates retain their original scope. */
import {SOURCE_CHECK_DATES} from './sourceCheckDates.js';
export const PUBLIC_VERSION = '2026-11-14.1';
export const PUBLIC_STATUS = 'pending-public-review';
const item = (g1ApprovedOn, history, logic, condition, theme) => ({
  version: PUBLIC_VERSION, status: PUBLIC_STATUS, g1ApprovedOn, history, logic, condition, theme,
});
export const PUBLIC_CATALOG = {
  wa: item('2026-10-30',
    ['2006 · The WEM opened with energy and capacity payments on an isolated grid.', '2006年 · WEM在独立电网上引入电能量及容量付费。'],
    ['Evening reliability creates a role for storage; payment depends on certified Capacity Credits.', '晚间供电可靠性为储能创造需求；容量付费取决于经认证、获分配的容量信用。'],
    ['Check the credited duration, annual price reset and ability to deliver as cells age.', '核对计入时长、年度重定价，以及电芯衰减后的履约能力。'], 'island'),
  nem: item('2026-11-05',
    ['December 1998 · The east coast joined an energy-only wholesale market.', '1998年12月 · 东海岸组成以电能量交易为核心的批发市场。'],
    ['Storage shifts energy and supplies FCAS; a revenue-underwriting award is a separate contract.', '储能转移电量并提供FCAS；收入支持中标合同是独立的合同路径。'],
    ['Regional spreads, network access and the actual award terms determine what can be earned.', '区域价差、并网条件及实际中标条款，决定收入能否兑现。'], 'regional'),
  gb: item('2026-11-01',
    ['2001–2005 · Bilateral trading replaced the Pool and expanded across Great Britain.', '2001—2005年 · 双边交易取代电力库，并扩展至整个大不列颠。'],
    ['Response, balancing, trading and capacity payments buy different services and obligations.', '响应、平衡、交易和容量付款，对应不同服务与履约义务。'],
    ['Verify connection readiness and avoid committing the same power to competing services.', '核实并网就绪情况，避免向不同服务重复承诺同一份功率。'], 'frequency'),
  de: item('2026-10-31',
    ['1998 · Market opening established competition and energy-price signals.', '1998年 · 市场开放确立了竞争与电能量价格信号。'],
    ['Wind and solar change when power arrives; storage can trade flexibility between periods.', '风光改变电力到达市场的时段；储能可交易跨时段灵活性。'],
    ['Access, realised spreads and contract cost allocation matter more than a sunny period alone.', '并网准入、实际价差和合同成本分担，比单纯的光照条件更关键。'], 'congestion'),
  it: item('2026-11-01',
    ['2021 · A decree set the route toward centrally procured storage alongside the capacity market.', '2021年 · 法令为容量市场之外的集中采购储能建立路径。'],
    ['Zonal constraints create a shifting need; capacity and MACSE contracts exchange different rights.', '分区约束形成时移需求；容量合同与MACSE以不同权利换取付费。'],
    ['Verify the zone, contract vintage, credited capacity and who controls the stored energy.', '核对区域、合同批次、计入容量，以及储存电量的使用权归属。'], 'congestion'),
  ie: item('2026-11-01',
    ['2007 / 2018 · The all-island market formed, then introduced the redesigned I-SEM.', '2007／2018年 · 全岛市场成立，随后实施I-SEM新设计。'],
    ['Wind integration needs fast response as well as firm capacity; each route has its own award.', '接纳风电既需要快速响应，也需要可靠容量；各路径分别取得资格与中标。'],
    ['Check service procurement changes, capacity obligations and the energy needed to deliver.', '核对服务采购变化、容量义务与履约所需电量。'], 'island'),
  ro: item('2026-11-01',
    ['2005–2021 · Day-ahead auctions developed into European market coupling.', '2005—2021年 · 日前拍卖逐步接入欧洲市场耦合。'],
    ['Solar changes the daily price shape; coupled borders transmit prices until links constrain trade.', '光伏改变日内价格形态；跨境耦合传递价格，直到联络线约束交易。'],
    ['Test local captured spreads and reserve evidence; an optimiser floor needs disclosed terms.', '检验本地可捕获价差及备用证据；优化商保底需要可核对的合同条款。'], 'regional'),
  pl: item('2026-11-01',
    ['2017 · Poland created a capacity market as its coal-based fleet aged.', '2017年 · 煤电机组老化背景下，波兰建立容量市场。'],
    ['Capacity availability, construction grants and trading are distinct payment routes.', '容量可用性付费、建设补贴和电力交易，是不同的资金路径。'],
    ['Award vintage, correction factor and grant eligibility must match the asset being assessed.', '中标批次、修正系数和补贴资格，必须与所评估资产一致。'], 'capacity'),
  jp_tokyo: item('2026-11-05',
    ['2011–2020 · Supply shocks led into national coordination, retail opening and grid separation.', '2011—2020年 · 供给冲击之后，推进全国协调、售电开放与电网分离。'],
    ['Tokyo combines a major demand centre with constrained connection access; national award rules still apply.', '东京叠加大型负荷中心与受约束的并网准入；全国中标规则仍适用。'],
    ['Check the connection rights, converter limits and award performance obligations.', '核对并网权利、变频联络限制及中标合同履约义务。'], 'tokyo'),
  jp_kyushu: item('2026-11-05',
    ['2012–2018 · Renewable support preceded connection pressure and mainland curtailment.', '2012—2018年 · 可再生能源支持之后，出现并网压力及九州本土弃电。'],
    ['Storage can shift surplus energy only when charging access and the export network allow it.', '只有充电准入及外送网络允许时，储能才能转移富余电量。'],
    ['Curtailment is evidence of surplus; it does not establish free charging or an available connection.', '弃电是富余电量的证据，并不代表可以免费充电或已获得并网条件。'], 'kyushu'),
  jp_hokkaido: item('2026-11-05',
    ['2018 · The Hokkaido blackout highlighted the needs of a small, linked regional system.', '2018年 · 北海道停电凸显了小型区域互联系统的运行需求。'],
    ['Charging headroom and the Honshu link shape what a connected battery can do.', '充电裕度及本州联络线，影响已并网电池实际能做什么。'],
    ['Distinguish firm charging access from controlled charging and verify connection conditions.', '区分可靠充电准入与受控充电，并核对并网附带条件。'], 'hokkaido'),
  pjm: item('2026-11-01',
    ['1927 / 2007–2008 · A power pool developed into energy and forward capacity markets.', '1927年／2007—2008年度 · 电力联营体逐步发展出电能量及远期容量市场。'],
    ['Capacity auctions pay accepted, accredited capability for one delivery year at a time.', '容量拍卖按交付年度，为中标且经核定的能力付费。'],
    ['Recheck accreditation, emergency performance and the next auction rather than extending one year’s price.', '复核核定系数、紧急履约及下一轮拍卖，避免延长套用单年度价格。'], 'capacity'),
  ercot: item('2026-11-01',
    ['2021–2025 · After Uri, reserve procurement and later real-time co-optimisation reshaped the market.', '2021—2025年 · Uri寒潮之后，备用采购及后续实时联合优化重塑市场。'],
    ['Energy and reserve markets pay for dispatch and availability; ERCOT has no general capacity payment.', '电能量和备用市场分别为调度及待命付费；ERCOT没有普遍容量付费。'],
    ['Fast connection also admits competitors; any toll needs an executed contract and verifiable terms.', '快速并网也方便竞争者进入；租赁需要已签合同和可核对条款。'], 'scarcity'),
  caiso: item('2026-11-01',
    ['2006 · System Resource Adequacy requirements preceded the solar-driven duck curve.', '2006年 · 系统资源充足性要求实施，随后光伏增长形成鸭子曲线。'],
    ['Storage shifts daytime energy; Resource Adequacy needs deliverability and a retailer contract.', '储能转移白日电量；资源充足性付费需要可交付性资格及售电主体合同。'],
    ['Verify deliverability, recharge coverage and the obligations attached to sold RA capacity.', '核对可交付性、再充电覆盖及已出售RA容量对应的义务。'], 'solar'),
  fi: item('2026-10-31',
    ['2023 · Olkiluoto 3 entered regular production within the Nordic synchronous system.', '2023年 · Olkiluoto 3在北欧同步系统内开始常规发电。'],
    ['Different reserve products buy different response capabilities; trading earns a separate margin.', '不同备用品种采购不同响应能力；交易另赚市场价差。'],
    ['Connected capacity is not an accepted bid; check qualification, awards and usable energy.', '并网容量不等于获接受的报价；核对资格、中标及可用电量。'], 'frequency'),
};
for(const [id,summary] of Object.entries(PUBLIC_CATALOG))summary.evidenceCheckedOn=SOURCE_CHECK_DATES[id];

export const PUBLIC_MARKET_IDS = Object.freeze(Object.keys(PUBLIC_CATALOG));
export const publicSummary = id => PUBLIC_CATALOG[id] || null;
