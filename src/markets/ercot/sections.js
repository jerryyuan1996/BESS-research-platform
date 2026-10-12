/* ---------------------------------------------------------------------------
   ERCOT — section specs for the shared block engine.

   One organising argument runs through every tab: ERCOT is the easiest market in
   the US to build in and the hardest to get paid in, and those two facts are the
   same fact. Connect-and-manage interconnection at 4.2 years and minimal cost is
   why the fleet went from 5.3 GW to 14 GW in three years; the fleet going from
   5.3 GW to 14 GW is why the revenue index fell 85% and why ancillary services
   went from 84% of battery income to 48%. A market that lets everybody in does
   not protect anybody's margin.

   The tabs are sequenced around what an ERCOT investor actually has to decide.
   The contracted tab is the TOLLING tab, because in an energy-only market the
   toll is the only contracted revenue there is — and no ERCOT toll price has
   ever been disclosed, which makes it simultaneously the most important and the
   least knowable number on this dashboard.

   Content is deliberately tighter than GB's. Every tab is complete and sourced;
   none is padded. Where a figure is not published, the tab says so — the `data`
   tab lists all eight such gaps.
   --------------------------------------------------------------------------- */
import { gridMapById } from '../gridMapRegistry.js';
import { congestionFor } from '../congestionRegistry.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function buildSections(api){
  const { h, L, MKT, M, SRC, state, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct,
          liveScore, dilutionAt } = api;

const SEC_B = {};
function SECTIONS(){
  const o = {};
  Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
  return o;
}
const O = M.official;
const kMW = v => fmtCk(v);
/* The unit every US revenue source publishes in, which is NOT the unit the model
   works in. Keeping the two visibly distinct is deliberate. */
const perKW = v => fmtC(v) + '/kW-mo';

// ============================== OVERVIEW ==============================
SEC_B.home = function (){
  return {
  head: ['ERCOT — the easiest market in the US to build in, and the hardest to get paid in',
         'ERCOT — 美国最容易建设、也最难获得回报的市场'],
  cap: ['Two facts that are really one fact: connect-and-manage let the fleet triple in three years, and the tripling is what took the revenue away.',
        '两个事实实为一体：“接入并管理”机制使装机三年内增长两倍，而正是这一增长带走了收入。'],
  blocks: [
    { t:'warn', text:M.seedWarn },
    { t:'card', mt:false, title:['Position at a glance','总体判断'], badges:['calc','illus'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Target COD window','目标投运窗口'], v:M.overall.codWindow,
          d:['evidence confidence ' + M.overall.confidence + '%', '证据置信度 ' + M.overall.confidence + '%'] },
        { l:['Capacity revenue available','可获容量收入'], v:'$0',
          d:['energy-only; scarcity is priced inside the energy price via the ORDC','纯电能量市场；稀缺性通过ORDC计入电能量价格'], b:['official'] },
        { l:['Interconnection timeline','并网周期'], v:O.interconnectYears + '<small> yr</small>',
          d:['against ' + O.pjmInterconnectYears + '+ years and ' + fmtC(O.pjmUpgradePerKW) + '/kW of upgrades in PJM',
             '相较PJM的' + O.pjmInterconnectYears + '年以上及每kW ' + fmtC(O.pjmUpgradePerKW) + '的升级费用'], b:['tp'] },
        { l:['Revenue index, CY2023 → CY2025','收入指数，2023→2025日历年'], v:kMW(O.idx2023) + ' → ' + kMW(O.idx2025),
          d:['as the fleet went from ' + O.fleet2023GW + ' GW to ' + O.fleet2026GW + ' GW',
             '同期装机由' + O.fleet2023GW + 'GW增至' + O.fleet2026GW + 'GW'], cls:'down', b:['tp'] },
        { l:['Toll value vs realised index','租赁价值对已实现指数'], v:perKW(O.tollTb2Aug25) + ' <small>vs</small> ' + perKW(2.45),
          d:['the same asset, two published numbers, roughly five times apart','同一资产，两个公开数字，相差约五倍'], b:['verify'] },
      ] },
      { t:'ic', b:['House view: ','本方观点：'], text:M.overall.rationale },
    ] },

    { t:'card', title:['The four facts that decide an ERCOT case','决定ERCOT投资逻辑的四个事实'], badges:['official'], blocks:[
      { t:'table', head:[['Fact','事实'],['Evidence','证据'],['What it does to the case','对投资逻辑的影响']], rows:[
        [{b:['There is no capacity mechanism, and there is not going to be one','不存在容量机制，未来也不会有']},
         ['Energy-only with scarcity priced through the ORDC; the Public Utility Commission has repeatedly declined to build one',
          '纯电能量市场，通过ORDC实现稀缺定价；公用事业委员会多次拒绝建立容量机制'],
         ['Contracted revenue is a private toll or nothing. Model capacity as unavailable, not small.','合同化收入要么来自私下租赁，要么完全没有。容量应按不可获得而非较小处理。']],
        [{b:['Connection is the fastest and cheapest in the US','并网为全美最快、成本最低']},
         [O.interconnectYears + '-year timelines at minimal cost; ERCOT brought ' + O.ercotAdded2021_22GW + ' GW online in 2021–22 against PJM\'s ' + O.pjmAdded2021_22GW + ' GW',
          '并网周期' + O.interconnectYears + '年且成本极低；2021–22年ERCOT新增投运' + O.ercotAdded2021_22GW + 'GW，PJM为' + O.pjmAdded2021_22GW + 'GW'],
         ['The structural advantage — and the reason the revenue fell.','这是结构性优势 — 同时也是收入下滑的原因。']],
        [{b:['The revenue index fell about 85% in two years','收入指数两年内下跌约85%']},
         [kMW(O.idx2023) + ' (2023) → ' + kMW(O.idx2024) + ' (2024) → ' + kMW(O.idx2025) + ' (2025), with ancillary share falling from ' + O.asShare2023Pct + '% to ' + O.asShare2025Pct + '%',
          kMW(O.idx2023) + '（2023）→ ' + kMW(O.idx2024) + '（2024）→ ' + kMW(O.idx2025) + '（2025），辅助服务占比由' + O.asShare2023Pct + '%降至' + O.asShare2025Pct + '%'],
         ['A single seed is indefensible. The Lab band is the honest form.','单一种子值站不住脚。测算模块的区间才是诚实的表达。']],
        [{b:['The toll market disagrees with the index by five times','租赁市场对该资产的定价为指数的五倍']},
         ['Published two-hour toll value ' + perKW(O.tollTb2Aug25) + ' against a realised index of about ' + perKW(2.45) + ' all-in',
          '已公布的两小时租赁价值为' + perKW(O.tollTb2Aug25) + '，而已实现指数全口径约为' + perKW(2.45)],
         ['One of them is wrong. The model carries both, at opposite ends of the band.','两者必有其一是错的。模型将二者分置于区间两端。']],
      ] },
      { t:'why', text:['These four are not independent, and the causal chain runs in one direction. Connect-and-manage is why ERCOT can build ' + O.ercotAdded2021_22GW + ' GW in two years while PJM builds ' + O.pjmAdded2021_22GW + '. Building that fast is why the fleet went from ' + O.fleet2023GW + ' GW to ' + O.fleet2026GW + ' GW. That fleet is why ancillary services fell from ' + O.asShare2023Pct + '% of battery revenue to ' + O.asShare2025Pct + '% and why the index fell 85%. And having no capacity mechanism is why none of that decline is cushioned by a contracted line. ERCOT is the clearest demonstration on this platform that easy entry and durable margin are the same trade-off seen from two ends.',
        '这四点并非彼此独立，其因果链条方向单一。“接入并管理”机制使ERCOT能在两年内建成' + O.ercotAdded2021_22GW + 'GW，而PJM仅为' + O.pjmAdded2021_22GW + 'GW。如此快速的建设使装机由' + O.fleet2023GW + 'GW增至' + O.fleet2026GW + 'GW。正是这一装机规模，使辅助服务占储能收入的比重由' + O.asShare2023Pct + '%降至' + O.asShare2025Pct + '%，并使指数下跌85%。而没有容量机制，意味着这一下滑完全没有合同化收入作为缓冲。ERCOT是本平台最清晰的例证：准入便利与margin可持续性，是同一权衡的两个侧面。'],
        sig:['Easy entry and durable margin are the same trade-off','准入便利与margin可持续性是同一权衡'] },
    ] },

    { t:'card', title:['The collapse, and the fleet size that explains it','收入下滑及其背后的装机规模'], badges:['tp'], blocks:[
      { t:'bar', cfg:{ xs:M.idxLabels, bw:56, yfmt:v => '$' + v + 'k', labels:true, h:230,
        series:[
          { name:['Modo ME BESS ERCOT Index, $k/MW/yr','Modo ME BESS ERCOT指数，$k/MW/年'], color:'var(--s13)', vals:M.idxSeries },
          { name:['Independent estimate, $k/MW/yr','独立机构测算，$k/MW/年'], color:'var(--s12)', vals:M.idxAltSeries },
        ] } },
      { t:'cap', text:['Fleet size beside each year: ' + O.fleet2023GW + ' GW in 2023, ' + O.fleet2024GW + ' GW in 2024, ' + O.fleet2026GW + ' GW entering 2026. The second series is Enverus, which agrees on the direction and the mechanism and disagrees on the level by 30% in 2023 and 73% in 2025.',
                       '各年度对应装机规模：2023年' + O.fleet2023GW + 'GW，2024年' + O.fleet2024GW + 'GW，2026年初' + O.fleet2026GW + 'GW。第二组数据来自Enverus，其在方向与成因上一致，但水平上2023年相差30%、2025年相差73%。'] },
      { t:'why', text:['Two things are worth reading off this chart rather than the headline. First, the gap between the two series is itself a finding: ERCOT publishes its market design in exhaustive detail and no revenue index at all, so the most basic question about this market — what does a battery earn — has two credible answers that differ by nearly two times. Second, 2025 was a documented trough rather than a new normal: the year lacked the extreme weather that produces ERCOT scarcity pricing, which is precisely the mechanism an energy-only market relies on to pay for capacity. Neither point argues the number is higher than shown. Both argue against underwriting any single value.',
        '本图有两点值得读取，而非仅看表面数字。其一，两组序列之间的差距本身即是结论：ERCOT以极其详尽的方式公布其市场机制，却完全不公布收入指数，因此关于该市场最基本的问题 — 储能究竟赚多少 — 存在两个可信答案，且相差近两倍。其二，2025年是有据可查的低谷而非新常态：该年缺乏产生ERCOT稀缺定价的极端天气，而这恰恰是纯电能量市场赖以为容量付费的机制。这两点均不表明实际数字高于图示，但都表明不应以任何单一数值进行承销。'],
        sig:['Two credible answers, two times apart','两个可信答案，相差两倍'] },
      { t:'src', src:SRC.modoIndex, use:['The revenue index and its ancillary share','收入指数及其辅助服务占比'] },
      { t:'src', src:SRC.enverus, use:['The independent estimate that disagrees with it','与之不一致的独立机构测算'] },
    ] },
  ] };
};

// ============================== MARKET STORY ==============================
SEC_B.story = function (){
  return {
  head: ['ERCOT Market Story — from scarcity rents to saturation, in three years',
         'ERCOT市场演进 — 三年内由稀缺租金走向饱和'],
  cap: ['Nothing about ERCOT\'s design changed to cause this. What changed is that the design worked.',
        'ERCOT的机制设计未发生任何导致这一结果的改变。真正改变的是 — 该设计奏效了。'],
  blocks: [
    { t:'card', mt:false, title:['How the market got here','市场如何演变至此'], badges:['official'], blocks:[
      { t:'timeline', items:[
        { y:'2021', t:['Uri, and the case for storage','Uri风暴与储能的投资逻辑'],
          p:['Winter Storm Uri established both the scarcity value ERCOT can produce and the political limit on it. The ORDC was recalibrated and the offer cap lowered, but the energy-only design was kept.',
             'Uri冬季风暴既确立了ERCOT所能产生的稀缺价值，也确立了对该价值的政治约束。ORDC经过重新校准、报价上限下调，但纯电能量市场的设计得以保留。'],
          i:['The market that pays for scarcity also decides how much scarcity it will tolerate.','为稀缺付费的市场，同时也决定其愿意容忍多少稀缺。'] },
        { y:'2023', t:['The scarcity-rent peak','稀缺租金峰值'],
          p:['The revenue index reached ' + kMW(O.idx2023) + '/MW/yr on a fleet of just ' + O.fleet2023GW + ' GW, with ancillary services contributing ' + O.asShare2023Pct + '% of it. ECRS had launched the year before and batteries dominated it.',
             '收入指数在仅' + O.fleet2023GW + 'GW装机规模下达到每MW每年' + kMW(O.idx2023) + '，其中辅助服务贡献' + O.asShare2023Pct + '%。ECRS于前一年推出，储能在其中占据主导。'],
          i:['A small fleet against a fixed ancillary requirement. That is a scarcity rent, not a revenue level.','小规模机组面对固定的辅助服务需求。这是稀缺租金，而非收入水平。'] },
        { y:'2024–2025', t:['The fleet arrives','装机大规模到位'],
          p:['Installed capacity went from ' + O.fleet2023GW + ' GW to ' + O.fleet2026GW + ' GW. Ancillary revenue fell about ' + O.asFallSince2023Pct + '% and its share of battery income went from ' + O.asShare2023Pct + '% to ' + O.asShare2025Pct + '%. The index fell to ' + kMW(O.idx2025) + '.',
             '装机容量由' + O.fleet2023GW + 'GW增至' + O.fleet2026GW + 'GW。辅助服务收入下跌约' + O.asFallSince2023Pct + '%，其占储能收入的比重由' + O.asShare2023Pct + '%降至' + O.asShare2025Pct + '%。指数降至' + kMW(O.idx2025) + '。'],
          i:['Connect-and-manage worked exactly as designed. The margin was the cost of it working.','“接入并管理”完全按设计发挥了作用。margin的消失正是其奏效的代价。'] },
        { y:'Dec 2025', t:['RTC+B goes live','RTC+B上线'],
          p:['From ' + O.rtcbDate + ' energy and ancillary services clear together every five minutes, and the duration requirements fell: ECRS from ' + O.ecrsHoursBefore + ' hours to ' + O.ecrsHoursAfter + ', RRS and Regulation from ' + O.rrsHoursBefore + ' hour to ' + O.rrsHoursAfterMin + ' minutes. Non-Spin stayed at ' + O.nonSpinHours + ' hours.',
             '自' + O.rtcbDate + '起，电能量与辅助服务每五分钟同时出清，且时长要求下调：ECRS由' + O.ecrsHoursBefore + '小时降至' + O.ecrsHoursAfter + '小时，RRS与调频由' + O.rrsHoursBefore + '小时降至' + O.rrsHoursAfterMin + '分钟。非旋转备用维持' + O.nonSpinHours + '小时不变。'],
          i:['Better dispatch flexibility for an individual asset, and a larger qualifying pool for the same requirement.','对单个资产而言调度灵活性提升，但同一需求所对应的合格资源池也随之扩大。'] },
        { y:'2026', t:['The load arrives — maybe','负荷即将到来 — 或许'],
          p:['ERCOT\'s large-load queue reached about ' + O.largeLoadQueueGW + ' GW by August 2026, ' + O.largeLoadDataCentrePct + '% of it data centres, with ' + O.largeLoadQ1_2026GW + ' GW applying in Q1 2026 alone. On 3 August 2026 the Governor directed ERCOT and the PUCT to pause data-centre interconnections pending a project-by-project audit; ERCOT postponed its Batch Zero study and expects to file the audit by 10 December 2026.',
             '截至2026年8月，ERCOT大负荷排队量约达' + O.largeLoadQueueGW + 'GW，其中' + O.largeLoadDataCentrePct + '%为数据中心；仅2026年第一季度就有' + O.largeLoadQ1_2026GW + 'GW提交申请。2026年8月3日，州长指示ERCOT与PUCT在逐项目审计完成前暂停数据中心并网；ERCOT已推迟Batch Zero研究，预计于2026年12月10日前提交审计报告。'],
          i:['The only credible path back to 2023-style spreads, and it is a queue rather than a commitment.','这是回到2023年式价差水平的唯一可信路径，但它只是排队量而非实际承诺。'] },
      ] },
      { t:'why', text:['The ERCOT story has no villain and no policy failure in it, which is what makes it useful. Nothing in the market design changed to cause the collapse — the ORDC still prices scarcity, ancillary quantities are still set by system need, and the offer cap is where it was. What changed is that a market designed to let generation in easily let a great deal of generation in. Any investor underwriting ERCOT on 2023 revenue was underwriting the absence of competitors in a market whose defining feature is that competitors face almost no barrier to entry.',
        'ERCOT的故事中既没有反面角色，也不存在政策失误，这正是它的价值所在。市场设计中没有任何变化导致了这次下滑 — ORDC仍在为稀缺定价，辅助服务采购量仍由系统需求确定，报价上限也未变动。真正改变的是：一个旨在让电源便捷进入的市场，确实让大量电源进入了。任何以2023年收入为依据承销ERCOT的投资人，实质上是在为“竞争者缺席”这一状态承销 — 而该市场最根本的特征恰恰是竞争者几乎不面临任何进入壁垒。'],
        sig:['No villain: the design worked, and that was the cost','没有反面角色：设计奏效了，而这正是代价'] },
    ] },
    { t:'card', title:['What changes next, and when','下一步变化及其时点'], badges:['official','forecast'], blocks:[
      { t:'ladder', items:[
        { n:['2026 — the first full year of RTC+B settlement','2026年 — RTC+B机制下的首个完整结算年度'],
          d:['Any optimiser backtest that predates ' + O.rtcbDate + ' describes a market that no longer exists. Energy and ancillary services now clear together, and a battery can move between them intra-hour.',
             '任何早于' + O.rtcbDate + '的优化器回测所描述的都是一个已不复存在的市场。电能量与辅助服务现已同时出清，储能可在小时内在两者间切换。'] },
        { n:['2028–2030 — the COD window on this dashboard','2028–2030年 — 本看板的投运窗口'],
          d:['A project starting now reaches commercial operation inside this window on ERCOT\'s ' + O.interconnectYears + '-year timeline — roughly half what the same project would take in PJM.',
             '按ERCOT ' + O.interconnectYears + '年的周期，当前启动的项目将在此窗口内投入商业运行 — 约为同一项目在PJM所需时间的一半。'] },
        { n:['2030 — the fleet reaches about ' + O.fleet2030GW + ' GW','2030年 — 装机达到约' + O.fleet2030GW + 'GW'],
          d:['Against ' + O.fleet2026GW + ' GW entering 2026. The ancillary seed on this dashboard is that ratio applied to what the fleet earns today.',
             '而2026年初为' + O.fleet2026GW + 'GW。本看板的辅助服务种子值即为该比率对机组当前收入的折算。'] },
        { n:[O.largeLoadAuditDue + ' — data-centre audit report','2026年12月10日 — 数据中心审计报告'],
          d:['About ' + O.largeLoadQueueGW + ' GW has applied, most of it data centres, and data-centre interconnections have been paused since ' + O.largeLoadPauseDate + ' pending a project-by-project audit. How much connects, how fast, and on what curtailment terms is the largest single uncertainty in any ERCOT price forecast.',
             '已申请约' + O.largeLoadQueueGW + 'GW，其中大部分为数据中心，且自2026年8月3日起数据中心并网已在逐项目审计期间暂停。最终有多少接入、速度如何、以及在何种限电条件下接入，是任何ERCOT价格预测中最大的单项不确定性。'] },
      ] },
      { t:'why', text:['Note the asymmetry between the two ends of this ladder. The supply side is settled and quantified: RTC+B is live, the ancillary methodology is in force, and the fleet projection to ' + O.fleet2030GW + ' GW is a published forecast. The demand side is neither — ' + O.largeLoadQueueGW + ' GW of large load has applied, which is larger than ERCOT\'s entire generation fleet, and the rules governing how it connects are still being written. An ERCOT case that assumes the load arrives is assuming the one thing on this page nobody has committed to.',
        '请注意本时间序列两端的不对称性。供给侧已经确定并可量化：RTC+B已上线，辅助服务方法已生效，至' + O.fleet2030GW + 'GW的机组预测也是已公布的预测。需求侧则两者皆非 — 已申请的大负荷达' + O.largeLoadQueueGW + 'GW，超过ERCOT全部发电机组总量，而规范其接入的规则仍在制定之中。若ERCOT投资逻辑假设这些负荷将会到来，那它假设的恰恰是本页中无人作出承诺的那一项。'],
        sig:['Supply is quantified; demand is a queue','供给已量化；需求仅是排队量'] },
      { t:'src', src:SRC.queue, use:['The large-load queue and its composition','大负荷排队量及其构成'] },
    ] },
  ] };
};

// ============================== TOLLING & OFFTAKE ==============================
SEC_B.capacity = function (){
  return {
  head: ['Tolling & Offtake — the only contracted revenue that exists here',
         '租赁与承购 — 此处唯一存在的合同化收入'],
  cap: ['ERCOT has no capacity market, so the toll is not an alternative to the contracted route. It is the contracted route, and no ERCOT toll price has ever been disclosed.',
        'ERCOT没有容量市场，因此租赁并非合同化路径的替代方案 — 它本身就是合同化路径，而ERCOT从未披露过任何租赁价格。'],
  blocks: [
    { t:'card', mt:false, title:['A real market with no published price','一个没有公开价格的真实市场'], badges:['tp'], blocks:[
      { t:'kpis', items:[
        { l:['Announced tolling agreements','已公布租赁协议'], v:String(O.tollsAnnounced),
          d:['covering about ' + O.tollsGW + ' GW, by September 2025', '截至2025年9月，覆盖约' + O.tollsGW + 'GW'], b:['tp'] },
        { l:['Known tolled batteries','已知租赁储能项目'], v:String(O.tolledKnown),
          d:[O.tolledOperating + ' operating, ' + O.tolledDue2026 + ' due online by end-2026', O.tolledOperating + '个在运，' + O.tolledDue2026 + '个将于2026年底前投运'], b:['tp'] },
        { l:['Published prices among them','其中已公布价格的数量'], v:'0',
          d:['described in the market as almost universally confidential','市场普遍将其描述为几乎完全保密'], b:['verify'] },
        { l:['Two-hour TB2 toll value, Aug 2025','两小时TB2租赁价值，2025年8月'], v:perKW(O.tollTb2Aug25),
          d:['down ' + O.tollTb2FallPct + '% from ' + perKW(O.tollTb2May25) + ' as the arbitrage window narrowed',
             '因套利窗口收窄，较' + perKW(O.tollTb2May25) + '下跌' + O.tollTb2FallPct + '%'], cls:'down', b:['tp'] },
        { l:['Toll tenor precedent','租赁期限先例'], v:O.tollTenorPrecedent + '<small> yr</small>',
          d:['Crossett 1, Jupiter Power / Equilibrium Energy — reported ERCOT terms run ' + O.tollTenorLo + '–' + O.tollTenorHi + ' years',
             'Crossett 1项目，Jupiter Power与Equilibrium Energy — 已报道的ERCOT期限为' + O.tollTenorLo + '–' + O.tollTenorHi + '年'], b:['tp'] },
        { l:['Merchant tail after a 7-yr toll','7年租赁到期后的市场化敞口'], v:'8<small> yr</small>',
          d:['against the platform\'s 15-year window, and it is unhedged','对应本平台15年建模窗口，且未经对冲'], cls:'down', b:['calc'] },
      ] },
      { t:'why', text:['The tolling market here is genuine and growing — twelve known tolled batteries with named counterparties, five already operating — which puts ERCOT ahead of Germany, where tolling is also the answer but the deal count is lower, and far ahead of PJM, where no battery tolling agreement was located at any price. What ERCOT shares with Germany is that not one of those transactions published what it paid. So the route this dashboard treats as the base case is a route whose price the platform has to derive.',
        '此处的租赁市场真实存在且在增长 — 十二个已知租赁储能项目均有具名交易对手，其中五个已投运 — 这使ERCOT领先于德国（德国的答案同样是租赁，但交易数量更少），并远超PJM（在PJM未发现任何储能租赁协议，亦无任何价格）。ERCOT与德国的共同之处在于：所有这些交易均未公布支付金额。因此，本看板作为基准情形的这条路径，其价格必须由平台自行推导。'],
        sig:['Twelve known deals, zero published prices','十二笔已知交易，零个公开价格'] },
      { t:'src', src:SRC.tolls, use:['Deal count, counterparties and asset status','交易数量、交易对手及资产状态'] },
      { t:'src', src:SRC.tb2toll, use:['The only two-hour-specific toll value located','所找到的唯一两小时口径租赁价值'] },
    ] },

    { t:'card', title:['Named tolled assets','具名租赁资产'], badges:['tp'], blocks:[
      { t:'table', head:[['Asset','资产'],['Owner / developer','所有方/开发商'],['Zone','区域'],['MW','MW'],['Hours','时长'],['Status','状态']], num:[3,4],
        rows: M.projects.filter(p => p.owner).map(p => [{b:[p.n, p.n]}, [p.owner, p.owner], [p.region, p.region],
          p.mw == null ? null : String(p.mw), p.h == null ? null : String(p.h),
          {chip:'info', text:[p.st, p.st]}]) },
      { t:'cap', text:['Publicly announced ERCOT tolled assets. Capacities appear only where a source states them — several deals were announced without one. Note the durations: the named tolled assets with published sizes are the FOUR-hour ones, against a fleet averaging ' + O.fleetHours + ' hours. CPS Energy alone holds about ' + O.cpsPortfolioMW + ' MW across several agreements.',
                       '公开宣布的ERCOT租赁资产。仅在有来源明确说明时列出容量 — 多笔交易在公布时未披露容量。请注意时长：已公布规模的具名租赁资产均为四小时项目，而机组平均时长为' + O.fleetHours + '小时。仅CPS Energy一家即在多份协议下持有约' + O.cpsPortfolioMW + 'MW。'] },
      { t:'why', text:['That last observation is the most useful thing on this tab. ERCOT builds two-hour batteries and tolls four-hour ones. The merchant fleet averages ' + O.fleetHours + ' hours because two hours is what maximises revenue per dollar of capex against a saturating ancillary stack; the assets that attract a contracted offtake are longer, because an offtaker buying a fifteen-year hedge wants the discharge window, not the cycling. A developer choosing duration in ERCOT is therefore choosing a route to market at the same time, and the duration tab shows the four-hour case does not clear on merchant.',
        '最后一点观察是本页最有价值的内容。ERCOT建设的是两小时储能，租赁的却是四小时储能。市场化机组平均' + O.fleetHours + '小时，是因为面对趋于饱和的辅助服务收入结构，两小时可实现单位造价收入最大化；而能吸引合同化承购的资产时长更长，因为购买十五年对冲的承购方看重的是放电窗口而非循环次数。因此，开发商在ERCOT选择时长的同时，也就选择了售电路径 — 而时长页显示，四小时方案在市场化口径下无法成立。'],
        sig:['ERCOT builds 2h and tolls 4h','ERCOT建设2小时项目，租赁4小时项目'] },
    ] },

    { t:'card', title:['Why there is no capacity market to compare this against','此处为何不存在可供对照的容量市场'], badges:['official'], blocks:[
      { t:'note', text:['ERCOT is energy-only. Scarcity is priced through the Operating Reserve Demand Curve, an adder applied to the real-time energy price as reserves tighten — which means it is already inside the merchant line on this dashboard and must not be added again as a separate revenue. There is no forward capacity auction, no accreditation factor and no delivery-year commitment.',
                        'ERCOT为纯电能量市场。稀缺性通过运行备用需求曲线（ORDC）定价，即在备用趋紧时对实时电能量价格施加加价 — 这意味着它已包含在本看板的市场化收入之中，不得作为独立收入重复计算。此处不存在远期容量拍卖、核证系数或实需年度承诺。'] },
      { t:'why', text:['This is the single largest structural difference between the two US markets on this platform, and it runs deeper than the presence or absence of a payment. In PJM, capacity revenue is published, accredited and settled centrally — so every project in the RTO earns the same $325.00/MW-day at the same 59% four-hour rating, and the modelled number equals the actual number. In ERCOT the equivalent revenue is a bilateral contract between two private parties, priced against a forecast neither publishes. PJM\'s contracted line needs no estimating and lasts one year; ERCOT\'s lasts seven and cannot be observed at all.',
        '这是本平台两个美国市场之间最大的结构性差异，且其影响远超“是否存在支付”本身。在PJM，容量收入由中央机构公布、核证并结算 — 因此RTO内每个项目都以相同的59%四小时核证系数获得相同的每MW每日$325.00，建模数值即等于实际数值。而在ERCOT，与之对应的收入是两个私人主体之间的双边合同，其定价所依据的预测双方均不公布。PJM的合同化收入无需估算但仅持续一年；ERCOT的持续七年，却完全无法观测。'],
        sig:['PJM: published, one year. ERCOT: unobservable, seven.','PJM：公开，一年。ERCOT：不可观测，七年。'] },
      { t:'src', src:SRC.tollPriceGap, use:['The toll price coverage gap','租赁价格数据缺口'] },
    ] },
  ] };
};

// ============================== NODAL ENERGY & ORDC ==============================
SEC_B.energy = function (){
  return {
  head: ['Nodal Energy & ORDC Scarcity — the leg that has to carry everything',
         '节点电能量与ORDC稀缺定价 — 须承担全部回报的收入项'],
  cap: ['With no capacity market and a saturating ancillary stack, the energy price is the market. It is also the number two credible sources disagree about by nearly two times.',
        '在没有容量市场且辅助服务趋于饱和的情况下，电能量价格就是这个市场的全部。它同时也是两个可信来源判断相差近两倍的那个数字。'],
  blocks: [
    { t:'card', mt:false, title:['Index to executable two-hour arbitrage','由指数折算至可执行的两小时套利收入'], badges:['tp','calc'], blocks:[
      { t:'wf', cfg:{ steps:M.spreadBridge, yfmt:v => kMW(v), h:270 } },
      { t:'cap', text:['The ancillary leg is stripped out first because it is power-based and is modelled separately on the services tab. The duration step scales from the ' + O.fleetHours + '-hour fleet the index measures to the two-hour archetype. The optimiser fee is deliberately NOT a step — the model applies it once, as lab.optFee, and deducting it twice is the most common way this bridge is misread.',
                       '首先剔除辅助服务部分，因其属功率型收入并在服务页单独建模。时长步骤将该指数所测量的' + O.fleetHours + '小时机组折算至两小时原型。优化商费用刻意不作为步骤列出 — 模型仅在lab.optFee处应用一次，重复扣除是误读该桥形图最常见的方式。'] },
      { t:'warn', text:['The duration step is a stated assumption, not an observation. The index is published as a single fleet average and no breakdown by duration band was located, so there is no way to see what a two-hour ERCOT asset specifically earned. Every ERCOT revenue figure on this dashboard depends on the (2 / ' + O.fleetHours + ') × ' + O.captureDuration + ' scalar, which is why it is stated rather than buried.',
                        '时长折算步骤是明示的假设而非观测值。该指数以单一机组均值形式公布，且未找到按时长分档的拆解，因此无法得知两小时ERCOT资产的具体收入。本看板所有ERCOT收入数值均依赖 (2 ÷ ' + O.fleetHours + ') × ' + O.captureDuration + ' 这一系数，故明示而非隐含。'] },
      { t:'src', src:SRC.fleetDurationGap, use:['The missing duration breakdown','缺失的时长拆解数据'] },
    ] },

    { t:'card', title:['The disagreement, stated as a band','以区间形式呈现的分歧'], badges:['calc','verify'], blocks:[
      { t:'kpis', items:[
        { l:['Modelled seed, 2h arbitrage','建模种子值，2小时套利'], v:kMW(18155) + '<small>/MW/yr</small>',
          d:['CY2025 index energy leg, scaled to 2h','2025日历年指数的电能量部分，折算至2小时'], b:['calc'] },
        { l:['Band floor','区间下限'], v:kMW(15288) + '<small>/MW/yr</small>',
          d:['the same figure with no duration uplift at all','完全不作时长上调的同一数值'], b:['calc'] },
        { l:['Band ceiling','区间上限'], v:kMW(90240) + '<small>/MW/yr</small>',
          d:['the published two-hour toll value, ' + perKW(O.tollTb2Aug25),'已公布的两小时租赁价值，' + perKW(O.tollTb2Aug25)], b:['tp'] },
        { l:['Ratio, ceiling to seed','上限与种子值之比'], v:'5.0<small>×</small>',
          d:['both ends are observations, not estimates','两端均为观测值而非估算值'], b:['verify'] },
      ] },
      { t:'why', text:['The toll value is in this band for a specific reason rather than as an optimistic case. A toll must clear BELOW risk-adjusted expected merchant revenue — an offtaker paying a fixed fee to capture the market upside would not pay more than it expects that upside to be worth. So the ' + perKW(O.tollTb2Aug25) + ' the market transacted at in August 2025 is a lower bound on somebody\'s expected merchant revenue for exactly this asset, at exactly this duration. Either those offtakers are wrong, or the realised 2025 index is not a fair guide to the fifteen-year expectation. This model does not know which, and the band is that admission rather than a hedge.',
        '租赁价值列入本区间有其特定理由，而非作为乐观情形。租赁价格必须低于风险调整后的预期市场化收入 — 支付固定费用以获取市场上行收益的承购方，不会支付超过其对该上行收益预期价值的金额。因此，2025年8月市场实际成交的' + perKW(O.tollTb2Aug25) + '，构成了某方对完全相同资产、完全相同时长的预期市场化收入的下限。要么这些承购方判断有误，要么2025年已实现指数并非十五年预期的合理指引。本模型无从判断，而该区间正是对此的坦承，而非一种折衷处理。'],
        sig:['A toll is a floor on somebody\'s expectation','租赁价格是某方预期水平的下限'] },
      { t:'src', src:SRC.tollVsIndexGap, use:['The unresolved contradiction','未解决的矛盾'] },
    ] },

    { t:'card', title:['ORDC — where scarcity is paid, and why it is not a separate line','ORDC — 稀缺性如何获得报酬，以及为何不单列'], badges:['official'], blocks:[
      { t:'table', head:[['Gate','交易环节'],['When','时点'],['What it means for a battery','对储能的含义']],
        rows: M.gateCloses.map(g => [{b:g.n}, g.when, g.fit]) },
      { t:'why', text:['RTC+B is the change that matters most on this tab and it is easy to under-read. Before ' + O.rtcbDate + ' a battery committed ancillary capacity day-ahead and then lived with that commitment through real time, which meant carrying state of charge it could not trade. Since then energy and ancillary services clear together every five minutes and the asset can move between them intra-hour. That is a genuine improvement in what an ERCOT battery can capture — and it arrived at the same moment the duration requirements fell, which let a much larger share of the fleet compete for the same ancillary quantity. The dispatch got better and the competition got worse, in one release.',
        'RTC+B是本页最重要的变化，且很容易被低估。在' + O.rtcbDate + '之前，储能须在日前承诺辅助服务容量，并在实时运行中受该承诺约束，这意味着必须保留无法用于交易的荷电量。此后，电能量与辅助服务每五分钟同时出清，资产可在小时内在两者间切换。这确实提升了ERCOT储能的可捕获价值 — 但它与时长要求下调同时发生，使得更大比例的机组能够竞争同一辅助服务采购量。调度变好了，竞争也变激烈了，二者在同一次改革中一并到来。'],
        sig:['Better dispatch and worse competition, in one release','同一次改革带来更优调度与更激烈竞争'] },
      { t:'src', src:SRC.rtcb, use:['Go-live date and the duration requirement changes','上线日期及时长要求变动'] },
    ] },
  ] };
};

// ============================== ANCILLARY SERVICES ==============================
SEC_B.services = function (){
  return {
  head: ['Ancillary Services & RTC+B — 84% of revenue in 2023, 48% in 2025',
         '辅助服务与RTC+B — 2023年占收入84%，2025年占48%'],
  cap: ['ERCOT is further through this decline than any market on the platform, which makes it the clearest picture of where a saturating ancillary stack ends up.',
        'ERCOT在这一下行过程中比本平台任何市场都走得更远，因而最清晰地呈现了辅助服务饱和后的最终状态。'],
  blocks: [
    { t:'card', mt:false, title:['Why the observed number is not the forecast','为何已观测数值不能作为预测值'], badges:['calc'], blocks:[
      { t:'wf', cfg:{ steps:M.asBridge, yfmt:v => kMW(v), h:250 } },
      { t:'cap', text:['Three steps from what the fleet earns to what a new entrant should underwrite. The construction is identical to the one PJM uses for Regulation: a quantity set by system need, divided by a fleet that grows regardless of it.',
                       '从机组实际收入到新进入者应据以承销的水平，共三个步骤。该推算方式与PJM用于调频收入的构造完全相同：由系统需求确定的采购量，除以不受其影响而持续增长的机组规模。'] },
      { t:'bar', cfg:{ xs:M.asShareLabels, bw:64, yfmt:v => v + '%', labels:true, h:210,
        series:[{ name:['Ancillary share of ERCOT battery revenue','辅助服务占ERCOT储能收入比重'], color:'var(--s13)', vals:M.asShareSeries }] } },
      { t:'cap', text:['Ancillary revenue itself has fallen about ' + O.asFallSince2023Pct + '% since 2023, so the share falling from ' + O.asShare2023Pct + '% to ' + O.asShare2025Pct + '% understates it — the denominator fell too.',
                       '辅助服务收入本身自2023年以来已下跌约' + O.asFallSince2023Pct + '%，因此占比由' + O.asShare2023Pct + '%降至' + O.asShare2025Pct + '%仍低估了实际降幅 — 因为分母同样在下降。'] },
      { t:'why', text:['Compare this with Germany, where ancillary services were 55% of battery revenue in 2026 and are forecast at about 5% by 2030, and the value of carrying ERCOT becomes clear: ERCOT has already made most of that journey. Germany\'s decline is a forecast; ERCOT\'s is history. An investor who doubts the German ancillary forecast can check it against a market where the same mechanism has already run — a fleet that tripled against a requirement set by system need, and a revenue line that fell ' + O.asFallSince2023Pct + '%.',
        '将本页与德国对照 — 德国2026年辅助服务占储能收入55%，预计到2030年降至约5% — 便可看出纳入ERCOT的价值：ERCOT已经走完了这一进程的大部分。德国的下降是预测，ERCOT的下降是历史。对德国辅助服务预测存疑的投资人，可对照一个同一机制已经运行完毕的市场加以检验 — 机组规模增长两倍、面对由系统需求确定的采购量，而该收入项下跌了' + O.asFallSince2023Pct + '%。'],
        sig:['Germany\'s forecast is ERCOT\'s history','德国的预测就是ERCOT的历史'] },
      { t:'src', src:SRC.modoIndex, use:['The ancillary share series','辅助服务占比序列'] },
    ] },

    { t:'card', title:['RTC+B cut the duration requirements, which enlarges the competition','RTC+B下调时长要求，从而扩大了竞争范围'], badges:['official'], blocks:[
      { t:'kpis', items:[
        { l:['ECRS duration requirement','ECRS时长要求'], v:O.ecrsHoursBefore + 'h → ' + O.ecrsHoursAfter + 'h',
          d:['a one-hour product admits far more of a ' + O.fleetHours + '-hour fleet','一小时产品可容纳更大比例的' + O.fleetHours + '小时机组'], b:['official'] },
        { l:['RRS and Regulation','RRS与调频'], v:O.rrsHoursBefore + 'h → ' + O.rrsHoursAfterMin + 'min',
          d:['a thirty-minute product admits essentially the whole fleet','三十分钟产品实际上可容纳全部机组'], b:['official'] },
        { l:['Non-Spin','非旋转备用'], v:O.nonSpinHours + '<small>h, unchanged</small>',
          d:['the only product still requiring real duration','唯一仍要求实质时长的产品'], b:['official'] },
        { l:['RRS primary frequency response minimum','RRS一次调频响应最低要求'], v:fmtN(O.rrsPfrMinMW) + '<small> MW</small>',
          d:['set by the 2026 methodology, effective ' + O.asMethodEffective,'由2026年方法确定，' + O.asMethodEffective + '生效'], b:['official'] },
      ] },
      { t:'why', text:['This is the detail that decides the ancillary seed, and it cuts against the asset rather than for it. Shortening a duration requirement does not increase the quantity ERCOT buys — that is set separately, by a system-need methodology. What it does is widen the pool of resources allowed to sell into it. Before RTC+B, a two-hour battery could meet the ECRS requirement and a one-hour battery could not; now both can, on a fleet averaging ' + O.fleetHours + ' hours where the short assets are the majority. The 14-to-40 gigawatt ratio this dashboard applies is therefore generous: the effective competing fleet grew faster than the installed fleet did.',
        '这一细节决定了辅助服务的种子值，且其作用方向不利于该资产。缩短时长要求并不会增加ERCOT的采购量 — 采购量由系统需求方法单独确定。它的作用是扩大了可参与销售的资源范围。在RTC+B之前，两小时储能可满足ECRS要求而一小时储能不能；如今两者皆可，而在平均时长' + O.fleetHours + '小时的机组中，短时长资产占多数。因此本看板所采用的14比40吉瓦比率偏于宽松：实际参与竞争的机组规模增速快于装机规模增速。'],
        sig:['The quantity did not grow; the eligible pool did','采购量并未增长，合格资源池却扩大了'] },
      { t:'src', src:SRC.rtcb, use:['The duration requirement changes','时长要求变动'] },
      { t:'src', src:SRC.asMethod, use:['How the 2026 quantities are determined','2026年采购量的确定方式'] },
    ] },

    { t:'card', title:['Ancillary services do not pay for duration','辅助服务不为时长付费'], badges:['calc'], blocks:[
      { t:'note', text:['Every ERCOT ancillary product is procured in megawatts. After RTC+B, three of the four require thirty minutes to one hour of duration, and only Non-Spin still requires four. So a longer battery earns no more ancillary revenue per MW than a shorter one — and under the new requirements it earns no more access either. `services` is therefore held constant across every duration in the Investment Lab, and the marginal-hour waterfall on the duration tab shows zero on the ancillary line.',
                        'ERCOT的每一项辅助服务产品均按兆瓦采购。RTC+B之后，四项产品中有三项仅要求三十分钟至一小时的时长，仅非旋转备用仍要求四小时。因此，更长时长的储能每MW所获辅助服务收入并不高于较短时长者 — 在新要求下，其准入机会亦无增加。故投资测算模块中`services`在各时长下保持不变，时长页的边际小时瀑布图中辅助服务一项为零。'] },
      { t:'src', src:SRC.asDash, use:['Cleared quantities and prices by product','各产品的出清电量与价格'] },
    ] },
  ] };
};

// ============================== DURATION ==============================
SEC_B.duration = function (){
  return {
  head: ['Storage Duration — the platform\'s only two-hour archetype, and why',
         '储能时长 — 本平台唯一的两小时原型，及其原因'],
  cap: ['ERCOT builds two-hour batteries and tolls four-hour ones. Both facts are true and they point in opposite directions.',
        'ERCOT建设两小时储能，租赁的却是四小时储能。两个事实同时成立，且指向相反。'],
  blocks: [
    { t:'card', mt:false, title:['Why the archetype is two hours','为何原型采用两小时'], badges:['official','tp'], blocks:[
      { t:'table', head:[['Evidence','证据'],['Points to','指向']], rows:[
        [['The ERCOT fleet averages about ' + O.fleetHours + ' hours', 'ERCOT机组平均时长约' + O.fleetHours + '小时'], ['2h or shorter','2小时或更短']],
        [['About ' + O.shortSharePct + '% of the storage in ERCOT\'s own 2026 planning scenario is 1h and 2h systems',
          'ERCOT自身2026年规划情景中约' + O.shortSharePct + '%的储能为1小时与2小时系统'], ['2h','2小时']],
        [['TB2 is the published spread benchmark, and the only published toll value is quoted on it',
          'TB2为已公布的价差基准，且唯一公开的租赁价值即以其计价'], ['2h','2小时']],
        [['Ancillary services require 30 minutes to 1 hour after RTC+B; only Non-Spin needs 4',
          'RTC+B后辅助服务仅要求30分钟至1小时；仅非旋转备用需要4小时'], ['2h is already more than enough','2小时已绰绰有余']],
        [['The named TOLLED assets with published sizes are four-hour — Ferdinand and Padua 2',
          '已公布规模的具名租赁资产均为四小时 — Ferdinand与Padua 2'], ['4h, for a contracted route','4小时，适用于合同化路径']],
      ] },
      { t:'why', text:['ERCOT is the one market on this platform where duration is a route-to-market decision rather than a sizing decision, and the evidence above splits cleanly along that line. Everything that describes the MERCHANT fleet points at two hours: the fleet average, the planning scenario, the published benchmark, and ancillary requirements that after RTC+B need thirty minutes. Everything that describes the CONTRACTED fleet points at four: both named tolled assets with published capacities are four-hour. An offtaker buying a seven-to-twenty-year hedge wants a discharge window; a merchant operator wants revenue per dollar of capex against a saturating ancillary stack. They are different assets and they are being built by the same market at the same time.',
        'ERCOT是本平台唯一一个时长属于售电路径决策而非规模决策的市场，而上述证据恰好沿这条界线清晰分开。所有描述市场化机组的证据都指向两小时：机组平均值、规划情景、公开基准，以及RTC+B之后仅需三十分钟的辅助服务要求。所有描述合同化机组的证据都指向四小时：两个已公布容量的具名租赁资产均为四小时。购买七至二十年对冲的承购方看重放电窗口；市场化运营方则看重面对饱和辅助服务收入结构时的单位造价收入。它们是不同的资产，却由同一市场在同一时间建设。'],
        sig:['Duration in ERCOT is a route choice, not a sizing choice','在ERCOT，时长是路径选择而非规模选择'] },
      { t:'src', src:SRC.buildout, use:['Fleet duration and the installed mix','机组时长与装机结构'] },
    ] },
    { t:'card', title:['Duration-Need Index','时长需求指数'], badges:['calc','illus'], live:true, blocks:[
      { t:'scorecard', id:'durFactors', bands:'durBands' },
    ] },
    { t:'card', title:['Marginal value of the third and fourth hour','第三、四小时的边际价值'], badges:['calc','illus'], blocks:[
      { t:'wf', cfg:{ steps:M.marginalHour, yfmt:v => fmtC(v) + 'k', h:250 } },
      { t:'cap', text:['Incremental value of moving from two hours to four, per MW per year, in $ thousands, ON THE MERCHANT BASIS. Ancillary is zero because it is paid on power and, after RTC+B, requires thirty minutes to one hour. Incremental capex is 2,000 kWh/MW at the $' + O.energyPerKWh + '/kWh energy-scaling component plus EPC, annualised over twenty years at 8%.',
                       '由两小时提升至四小时的增量价值，单位为每MW每年千美元，按市场化口径计算。辅助服务为零，因其按功率计费，且在RTC+B之后仅要求三十分钟至一小时。增量资本开支为每MW 2,000kWh，按每kWh $' + O.energyPerKWh + '的能量型成本分项加EPC计算，按二十年8%折现年化。'] },
      { t:'warn', text:['This waterfall answers the MERCHANT question and the ERCOT four-hour case does not live there — it lives in the toll, and no two-hour-versus-four-hour toll pair has ever been published. The broader US toll band of $' + O.tollUs4hLo + '–' + O.tollUs4hHi + '/kW-month is quoted for four-hour systems and would imply a large uplift over the two-hour value of ' + perKW(O.tollTb2Aug25) + ', but the two figures come from different series and cannot be differenced. The four-hour case in ERCOT is therefore unquantifiable on public data rather than negative.',
                        '本瀑布图回答的是市场化口径的问题，而ERCOT的四小时投资逻辑并不在此 — 它存在于租赁之中，且从未有任何两小时对四小时的租赁价格对照数据公开。更宽泛的美国租赁区间每kW每月$' + O.tollUs4hLo + '–' + O.tollUs4hHi + '系针对四小时系统的报价，相对两小时的' + perKW(O.tollTb2Aug25) + '意味着显著上调，但这两个数字来自不同序列，不可相减。因此，ERCOT的四小时投资逻辑在公开数据下属于无法量化，而非为负。'] },
    ] },
    { t:'card', title:['Augmentation readiness','扩容准备度'], badges:['illus'], live:true, blocks:[
      { t:'aug' },
      { t:'cap', text:['Two ERCOT-specific rows: whether the resource node basis supports a longer discharge window, and the property-tax assessment after the added MWh — Texas school-district value limitations under Chapter 313 lapsed on ' + O.chapter313Expiry + '.',
                       '其中两项为ERCOT特有：资源节点基差是否支持更长的放电窗口，以及新增MWh后的财产税评估 — 德州第313章下的学区估值限制已于' + O.chapter313Expiry + '失效。'] },
    ] },
  ] };
};

// ============================== PIPELINE ==============================
SEC_B.pipeline = function (){
  return {
  head: ['Project Pipeline — the fleet that competed away its own revenue',
         '项目管线 — 消解自身收入的装机群'],
  cap: ['ERCOT buildout is the direct cause of the ancillary collapse on the services tab. The pipeline and the revenue history are one series read twice.',
        'ERCOT的建设正是服务页所述辅助服务崩塌的直接成因。管线与收入历史本质上是同一序列的两种读法。'],
  blocks: [
    { t:'card', mt:false, title:['Development stage probabilities','开发阶段概率'], badges:['illus'], blocks:[
      { t:'stageProb' },
      { t:'cap', text:['Illustrative weighting used to convert an announced pipeline into a probability-weighted one. Not an official ERCOT dataset. The step that matters is `toll`, and it is scored ABOVE the interconnection agreement — the opposite of PJM. In an energy-only market the offtake is the scarce thing and the connection is not.',
                       '用于将已公布管线转换为概率加权管线的示意权重。并非ERCOT官方数据集。真正关键的步骤是`toll`（租赁），且其评分高于并网协议 — 与PJM恰好相反。在纯电能量市场中，稀缺的是承购协议而非并网条件。'] },
      { t:'note', text:['A useful counterweight to any queue-based projection: historically only about ' + O.queueSuccessPct + '% of projects in ISO interconnection queues reach commercial operation. ERCOT has received about ' + fmtN(O.queueApplications) + ' battery interconnection applications over six years, ' + fmtN(O.queueLargeGen) + ' of them large generators above 10 MW.',
                        '对任何基于排队量的预测都应加以制衡：历史上独立系统运营机构并网队列中仅约' + O.queueSuccessPct + '%的项目最终投入商业运行。六年来ERCOT共收到约' + fmtN(O.queueApplications) + '份储能并网申请，其中' + fmtN(O.queueLargeGen) + '份为10MW以上的大型发电项目。'] },
    ] },
    { t:'card', title:['Announced versus probability-weighted','已公布容量与概率加权容量'], badges:['calc','illus'], blocks:[
      { t:'pipeChart', unit:'MW' },
      { t:'why', text:['The gap between the two lines carries a different meaning in ERCOT than anywhere else on this platform, because here the pipeline has already been tested. In Germany a fast pipeline is a forecast risk to the ancillary case; in ERCOT it is a completed experiment — the fleet went from ' + O.fleet2023GW + ' GW to ' + O.fleet2026GW + ' GW, ancillary revenue fell about ' + O.asFallSince2023Pct + '%, and the index fell 85%. The projection to about ' + O.fleet2030GW + ' GW by 2030 is the same mechanism running again against a requirement that does not grow. An ERCOT investor is not rooting for a slow queue so much as needing the LOAD queue to move faster than the generation one.',
        '两条曲线之间的差距在ERCOT具有不同于本平台其他市场的含义，因为此处的管线效应已经过检验。在德国，管线推进过快是对辅助服务逻辑的预测性风险；而在ERCOT，这是一场已完成的实验 — 机组由' + O.fleet2023GW + 'GW增至' + O.fleet2026GW + 'GW，辅助服务收入下跌约' + O.asFallSince2023Pct + '%，指数下跌85%。至2030年约' + O.fleet2030GW + 'GW的预测，是同一机制在不增长的需求面前再次运行。ERCOT投资人与其说是希望发电排队进程缓慢，不如说是需要负荷排队的推进速度快于发电排队。'],
        sig:['The pipeline experiment already ran once','这场管线实验已经进行过一次'] },
    ] },
    { t:'card', title:['Project register','项目登记表'], badges:['tp','illus'], blocks:[
      { t:'table', head:[['Project','项目'],['Owner','所有方'],['Zone','区域'],['MW','MW'],['Hours','时长'],['COD','投运'],['Stage','阶段']],
        num:[3,4],
        rows: M.projects.map(p => [{b:[p.n, p.n]}, [p.owner || '—', p.owner || '—'], [p.region, p.region],
          p.mw == null ? null : String(p.mw), p.h == null ? null : String(p.h), p.cod,
          {chip:'info', text:[p.st, p.st]}]) },
      { t:'cap', text:['Rows with a named owner are publicly announced ERCOT projects — unlike PJM, where no project-level list was located. Capacities appear only where a source states them. The remaining rows are seed examples and are labelled as such; no published average ERCOT grid-scale project size exists.',
                       '列有具名所有方的行为公开宣布的ERCOT项目 — 与PJM不同，PJM未找到项目级清单。仅在有来源明确说明时列出容量。其余各行为种子示例并已如此标注；ERCOT不存在已公布的电网级项目平均规模。'] },
      { t:'src', src:SRC.tolls, use:['Named tolled assets and their counterparties','具名租赁资产及其交易对手'] },
    ] },
  ] };
};

// ============================== INTERCONNECTION & CONGESTION ==============================
SEC_B.grid = function (){
  return {
  head: ['Interconnection & Congestion — the best connection regime on the platform',
         '并网与拥塞 — 本平台最优的并网机制'],
  cap: ['Connect-and-manage at about 4.2 years and minimal cost is ERCOT\'s structural advantage. It is also the mechanism that removed the margin.',
        '“接入并管理”机制下约4.2年的周期与极低成本是ERCOT的结构性优势。它同时也是消解margin的机制。'],
  blocks: [
    { t:'card', mt:false, title:['Interactive ERCOT grid — past, current and planned','ERCOT电网交互地图 — 过去、当前与规划'], badges:['official','public'], blocks:[
      { t:'geo-grid-map', data:gridMapById('ercot-grid-map') },
      { t:'why', text:['The map shows the constraint ERCOT actually has: generation in the west and along the coast, load in the Dallas–Fort Worth and Houston triangles, and a large-load queue concentrating in the north. Unlike PJM the map has no capacity-price consequence at all — ERCOT has no capacity market — so everything the geography does, it does through the nodal energy price and through congestion revenue rights.',
        '地图呈现了ERCOT真实存在的约束：电源位于西部与沿海，负荷集中于达拉斯-沃斯堡与休斯顿两大三角区，而大负荷排队集中于北部。与PJM不同，本图对容量价格完全没有影响 — ERCOT没有容量市场 — 因此地理因素的全部作用，均通过节点电能量价格与拥塞收入权体现。'],
        sig:['Geography acts through the energy price alone','地理因素仅通过电能量价格发挥作用'] },
      { t:'src', src:SRC.queue, use:['Interconnection status and the large-load queue','并网状态与大负荷排队'] },
    ] },

    { t:'congestion', data:congestionFor('ercot') },

    { t:'card', title:['ERCOT against PJM on connection','ERCOT与PJM的并网条件对比'], badges:['tp'], blocks:[
      { t:'table', head:[['Measure','指标'],['ERCOT','ERCOT'],['PJM','PJM']], num:[1,2], rows:[
        [{b:['Interconnection timeline','并网周期']}, O.interconnectYears + ' yr', O.pjmInterconnectYears + '+ yr'],
        [{b:['Network upgrade cost to the generator','发电方承担的电网升级成本']}, ['Minimal — transmission is socialised','极低 — 输电投资由全体分摊'], fmtC(O.pjmUpgradePerKW) + '/kW'],
        [{b:['Capacity brought online, 2021–22','2021–22年新增投运容量']}, O.ercotAdded2021_22GW + ' GW', O.pjmAdded2021_22GW + ' GW'],
        [{b:['Connection risk score on this platform','本平台并网风险评分']}, String(liveScore('connFactors')) + ' / 100', '64 / 100'],
      ] },
      { t:'why', text:['This table is the reason both US markets are carried rather than one. They are the two ends of the same regulatory trade-off, and the platform can price it: ERCOT socialises network cost and connects fast, so entry is easy and margin is competed away; PJM allocates upgrade cost to the generator and connects slowly, so entry is hard and the shortage that results is what pays the capacity price of $325.00/MW-day. Neither design is better in the abstract. What matters for an allocation decision is that they fail in opposite ways, so a portfolio holding both is not holding the same risk twice.',
        '本表正是同时纳入两个美国市场而非仅取其一的原因。它们是同一监管权衡的两个极端，而本平台可以对其定价：ERCOT将电网成本社会化分摊且并网迅速，因此准入容易、margin被竞争消解；PJM将升级成本分摊给发电方且并网缓慢，因此准入困难，而由此产生的短缺正是支撑每MW每日$325.00容量价格的原因。抽象而言两种设计并无优劣之分。对配置决策真正重要的是：二者的失效方式相反，因此同时持有两者的组合并非重复持有同一风险。'],
        sig:['Two ends of one trade-off, and they fail oppositely','同一权衡的两端，且失效方式相反'] },
      { t:'src', src:SRC.queue, use:['ERCOT interconnection timelines and the large-load queue','ERCOT并网周期与大负荷排队'] },
    ] },

    { t:'card', title:['Connection risk scorecard','并网风险记分卡'], badges:['calc','illus'], live:true, blocks:[
      { t:'scorecard', id:'connFactors', bands:'connBands' },
      { t:'cap', text:['Higher is worse, and this is the lowest connection-risk score on the platform. Network upgrade cost scores zero because ERCOT socialises transmission investment; land scores zero because Texas has no equivalent of the county-level siting veto several PJM states carry. The heaviest line is FEOC, which is federal and identical in every US market.',
                       '分值越高风险越大，而这是本平台最低的并网风险评分。电网升级成本得零分，因为ERCOT将输电投资社会化分摊；土地得零分，因为德州不存在多个PJM州所具有的县级选址否决权。权重最高的是FEOC，该项属联邦层面，在所有美国市场中完全一致。'] },
    ] },
  ] };
};

// ============================== BENCHMARK ==============================
SEC_B.benchmark = function (){
  return {
  head: ['ERCOT vs PJM — the same country, opposite bargains',
         'ERCOT与PJM对比 — 同一个国家，两种相反的取舍'],
  cap: ['Both are US markets under one federal tax regime. On every question this platform\'s comparison engine asks, they answer differently.',
        '两者同属美国市场、适用同一联邦税制。但对本平台比较引擎所提出的每一个问题，它们的答案都不同。'],
  blocks: [
    { t:'card', mt:false, title:['The two bargains, side by side','两种取舍的并列对照'], badges:['calc'], blocks:[
      { t:'table', head:[['Question','问题'],['ERCOT','ERCOT'],['PJM','PJM']], rows:[
        [{b:['Is there a capacity mechanism?','是否存在容量机制？']},
         ['No, and there is not going to be one','没有，未来也不会有'],
         ['Yes — $325.00/MW-day at a 59% four-hour rating','有 — 四小时核证59%，每MW每日$325.00']],
        [{b:['How long is the contracted revenue secured for?','合同化收入锁定多久？']},
         ['7 years, by private toll','7年，通过私下租赁'],
         ['1 year, by public auction','1年，通过公开拍卖']],
        [{b:['Can you observe the contracted price?','合同价格是否可观测？']},
         ['Never — zero disclosed across ten agreements','从不 — 十份协议中零个披露'],
         ['Completely — two primary documents','完全可观测 — 两份官方原始文件']],
        [{b:['How long to connect?','并网需时多久？']},
         [O.interconnectYears + ' years at minimal cost', O.interconnectYears + '年，成本极低'],
         [O.pjmInterconnectYears + '+ years at ' + fmtC(O.pjmUpgradePerKW) + '/kW', O.pjmInterconnectYears + '年以上，每kW ' + fmtC(O.pjmUpgradePerKW)]],
        [{b:['What is the archetype duration?','原型时长为多少？']},
         ['2 hours — the fleet averages ' + O.fleetHours + 'h','2小时 — 机组平均' + O.fleetHours + '小时'],
         ['4 hours — the shortest ELCC class published','4小时 — 已公布ELCC等级中的最短时长']],
        [{b:['Does location change the contracted revenue?','区位是否影响合同化收入？']},
         ['There is none to change','不存在可受影响的合同化收入'],
         ['No — the auction clears RTO-wide','否 — 拍卖按全RTO统一出清']],
      ] },
      { t:'why', text:['Read the third and fourth rows together and the trade-off is exact. PJM makes a project wait ' + O.pjmInterconnectYears + '-plus years and pay ' + fmtC(O.pjmUpgradePerKW) + '/kW to connect, and the scarcity that creates is what pays a fully-published capacity price. ERCOT connects in ' + O.interconnectYears + ' years at almost no cost, and the abundance that creates is what removed the revenue. Neither market is giving anything away. They are charging for the same thing — scarcity — at different points in the process, and an allocator holding both is buying the same underlying risk through two mechanisms that fail at different times.',
        '将第三行与第四行对照阅读，这一权衡关系便十分精确。PJM让项目等待' + O.pjmInterconnectYears + '年以上并支付每kW ' + fmtC(O.pjmUpgradePerKW) + '才能并网，而由此产生的稀缺正是支撑完全公开的容量价格的原因。ERCOT在' + O.interconnectYears + '年内以几乎零成本完成并网，而由此产生的过剩正是收入消失的原因。两个市场都没有做出让步 — 它们只是在流程的不同环节，为同一样东西（稀缺）收费。同时配置两者的投资人，实际上是在通过两种在不同时点失效的机制，购买同一项底层风险。'],
        sig:['Both charge for scarcity, at different points','两者都在为稀缺定价，只是环节不同'] },
    ] },
    { t:'card', title:['What that means for an allocation','这对配置决策意味着什么'], badges:['calc'], blocks:[
      { t:'table', head:[['If you believe…','若你认为…'],['…then','…那么']], rows:[
        [['US load growth arrives and scarcity returns','美国负荷增长将兑现、稀缺将回归'],
         ['ERCOT has the higher beta: no contracted floor, and an energy price that goes where scarcity goes. The ' + O.largeLoadQueueGW + ' GW large-load queue is the mechanism.',
          'ERCOT的beta更高：没有合同化保底，电能量价格随稀缺程度波动。' + O.largeLoadQueueGW + 'GW的大负荷排队即为其传导机制。']],
        [['Load growth disappoints or connects slowly','负荷增长不及预期或接入缓慢'],
         ['PJM has the floor: a published capacity payment that is re-auctioned annually but does not depend on a spread. ERCOT has nothing underneath the toll.',
          'PJM具备保底：一项每年重新拍卖、但不依赖价差的公开容量收入。ERCOT在租赁之下则一无所有。']],
        [['Storage buildout continues at present rates','储能建设按当前速度持续'],
         ['Both compress, at different points. ERCOT\'s ancillary leg has already gone; PJM\'s Regulation leg and its four-hour ELCC have not.',
          '两者都会被压缩，只是环节不同。ERCOT的辅助服务收入已经消失；PJM的调频收入与四小时ELCC尚未。']],
        [['The §48E credit survives FEOC in your supply chain','§48E抵免在你的供应链下可通过FEOC审查'],
         ['Both improve by the same amount, because the credit is federal. It is the one input on this platform that does not differentiate the two markets at all.',
          '两者改善幅度相同，因为该抵免属联邦层面。这是本平台唯一完全不区分这两个市场的输入项。']],
      ] },
      { t:'why', text:['The last row is worth stating explicitly because it is easy to miss when comparing two US markets. Every other input on this platform differentiates: capacity mechanisms, connection regimes, ancillary design, currency. The investment tax credit does not. It is 30% of eligible basis in both markets, it is voided by the same Material Assistance Cost Ratio in both, and it is seeded at zero in both — so a reader turning it on in the Investment Lab moves ERCOT and PJM by the same proportion and changes nothing about which one ranks higher.',
        '最后一行值得明确指出，因为在比较两个美国市场时很容易忽略。本平台其他每一项输入都会产生区分：容量机制、并网制度、辅助服务设计、货币。而投资税收抵免不会。两个市场均为合格投资基础的30%，均因同一实质协助成本比率而失效，且在两者中种子值均为零 — 因此在投资测算模块中启用该抵免，将使ERCOT与PJM按相同比例变动，完全不改变两者的排序。'],
        sig:['The ITC moves both equally and reorders nothing','ITC对两者影响相同，不改变排序'] },
    ] },
  ] };
};

// ============================== PORTFOLIO ==============================
SEC_B.portfolio = function (){
  return {
  head: ['Portfolio / Fund View — screening an ERCOT opportunity','组合与基金视图 — ERCOT机会筛选'],
  cap: ['A worked screening example on this dashboard\'s own assumptions. Illustrative — it demonstrates the gate sequence, not a transaction.',
        '基于本看板自身假设的筛选示例。仅作示意，用于演示门槛顺序，而非真实交易。'],
  blocks: [
    { t:'card', mt:false, title:['Investment Committee gates','投委会门槛'], badges:['calc'], blocks:[
      { t:'gates', items:[
        { n:['Gate 1 — Route declared before the model','门槛1 — 建模前确定路径'],
          d:['Tolled or merchant, chosen and evidenced first. They are different assets and in ERCOT they are different DURATIONS: the merchant fleet averages ' + O.fleetHours + ' hours and the named tolled assets with published sizes are four.',
             '先确定并证明采用租赁或市场化路径。二者属不同资产，且在ERCOT属不同时长：市场化机组平均' + O.fleetHours + '小时，而已公布规模的具名租赁资产为四小时。'],
          c:'serious', s:['Decides the asset, not just the contract','决定资产本身，而不仅是合同'] },
        { n:['Gate 2 — The toll price, and the tail after it','门槛2 — 租赁价格及其到期后的敞口'],
          d:['No ERCOT toll price has ever been disclosed, so the counterparty\'s number is the only one that exists. A ' + O.tollTenorPrecedent + '-year toll against a fifteen-year window leaves eight years of unhedged merchant tail, and that tail is where this case is won or lost.',
             'ERCOT从未披露过任何租赁价格，因此交易对手报出的数字是唯一存在的数字。' + O.tollTenorPrecedent + '年租赁对应十五年建模窗口，留下八年无对冲的市场化敞口，而该敞口期决定本方案的成败。'],
          c:'critical', s:['Eight years unhedged','八年无对冲'] },
        { n:['Gate 3 — Ancillary modelled at the new-entrant level','门槛3 — 辅助服务按新进入者水平建模'],
          d:['Confirm the case does not hold the 2023 or even the 2025 ancillary share flat. It was ' + O.asShare2023Pct + '% of revenue in 2023 and ' + O.asShare2025Pct + '% in 2025, ancillary revenue is down about ' + O.asFallSince2023Pct + '%, and RTC+B shortened the duration requirements so more of the fleet competes for it.',
             '确认方案未将2023年甚至2025年的辅助服务占比保持不变。该占比2023年为收入的' + O.asShare2023Pct + '%、2025年为' + O.asShare2025Pct + '%，辅助服务收入已下跌约' + O.asFallSince2023Pct + '%，且RTC+B缩短时长要求后，更大比例的机组参与其竞争。'],
          c:'critical', s:['This decline already happened','这一下滑已经发生'] },
        { n:['Gate 4 — The resource node, read from its own basis history','门槛4 — 依据资源节点自身基差历史判断'],
          d:['ERCOT settles at the resource node and pays nothing for being constrained off. Basis is the asset\'s to manage or hedge through congestion revenue rights; a load-zone average does not describe it.',
             'ERCOT按资源节点结算，且受约束停机不获任何补偿。基差风险须由资产自行管理或通过拥塞收入权对冲；负荷区平均值无法反映其情况。'],
          c:'serious', s:['No compensation for curtailment','限电无任何补偿'] },
        { n:['Gate 5 — FEOC material-assistance documentation','门槛5 — FEOC实质协助合规文件'],
          d:['Failing the Material Assistance Cost Ratio voids the §48E credit entirely rather than reducing it. Federal, and identical to PJM — the one gate on this list that does not distinguish the two US markets.',
             '未通过实质协助成本比率将使§48E抵免完全失效而非减少。该项属联邦层面且与PJM完全一致 — 是本清单中唯一不区分两个美国市场的门槛。'],
          c:'critical', s:['A cliff, not a slope','断崖式，而非递减式'] },
      ] },
      { t:'ic', b:['Screening conclusion: ','筛选结论：'],
        text:['ERCOT punishes anyone who underwrites the index and rewards anyone who underwrites the contract — and the contract is the thing nobody publishes. The market has already run the experiment that Germany is still forecasting: a fleet tripled, the ancillary stack collapsed, and the merchant index fell 85% without a capacity mechanism to cushion any of it. What is left is a toll whose price you can only learn by being offered one, over a tenor that covers less than half the modelled life. An ERCOT case that reaches investment committee with a merchant forecast anchored on 2023, an ancillary share held flat and no view on the post-toll tail is not a case — it is a bet that the last three years do not repeat, with none of the three named.',
              'ERCOT惩罚以指数为承销依据的人，奖励以合同为承销依据的人 — 而合同恰恰是无人公布的那一项。这个市场已经完成了德国仍在预测的那场实验：机组规模增长两倍、辅助服务收入结构崩塌、市场化指数下跌85%，且没有任何容量机制加以缓冲。剩下的是一份只有在收到报价时才能得知价格的租赁合约，其期限还不到建模寿命的一半。若一份ERCOT方案在提交投委会时，其市场化预测锚定于2023年、辅助服务占比保持不变、且对租赁到期后的敞口毫无判断，那它不是一份方案 — 而是在押注过去三年不会重演，却对这三项风险只字未提。'] },
    ] },
  ] };
};

// ============================== DATA & METHODOLOGY ==============================
SEC_B.data = function (){
  return {
  head: ['Data & Methodology — what is published, what is not, and what this dashboard does about it',
         '数据与方法 — 哪些已公开、哪些未公开，以及本看板如何处理'],
  cap: ['ERCOT publishes its market design more completely than any market on this platform and its contract prices not at all.',
        'ERCOT对市场机制的公开程度高于本平台任何市场，而对合同价格则完全不公开。'],
  blocks: [
    { t:'card', mt:false, title:['What is not published — and what this dashboard uses instead','未公开的内容 — 以及本看板的替代做法'], badges:['official'], blocks:[
      { t:'table', head:[['Item','项目'],['Publication status','公开状态'],['Why','原因'],['What is used instead','替代做法']],
        rows: M.notPublished.map(x => [{b:x.item}, {chip:'serious', text:x.status}, x.why, x.instead]) },
      { t:'why', text:['Two entries decide more of the ERCOT answer than the rest of the dashboard combined, and they are the same entry read from two sides. No ERCOT toll price has ever been disclosed, so the contracted route — which this dashboard treats as the base case — is priced from a single published TB2 toll value. And that value disagrees with the realised revenue index by roughly five times. Neither gap is closeable by better analysis; both need a disclosure that has not happened.',
        '有两项对ERCOT结论的影响超过看板其余部分的总和，且二者实为同一问题的两面。ERCOT从未披露过任何租赁价格，因此本看板作为基准情形的合同化路径，其定价仅依据单一已公布的TB2租赁价值。而该价值与已实现收入指数相差约五倍。这两项缺口均无法通过更深入的分析弥补；二者都需要一项尚未发生的信息披露。'],
        sig:['One disclosure away from a defensible answer','距离可靠结论仅差一项披露'] },
      { t:'src', src:SRC.tollPriceGap, use:['The toll price coverage gap','租赁价格数据缺口'] },
      { t:'src', src:SRC.tollVsIndexGap, use:['The toll-versus-index contradiction','租赁价值与指数之间的矛盾'] },
      { t:'src', src:SRC.indexDisputeGap, use:['The two sources that disagree about CY2025','对2025日历年判断不一的两个来源'] },
      { t:'src', src:SRC.fleetDurationGap, use:['The missing duration breakdown','缺失的时长拆解数据'] },
      { t:'src', src:SRC.salesTaxGap, use:['Texas sales tax treatment of storage','德州对储能的销售税处理'] },
    ] },

    { t:'card', title:['Evidence ladder — what would upgrade each number','证据阶梯 — 各数值的升级路径'], badges:['calc'], blocks:[
      { t:'table', head:[['Source that would settle it','可确证的来源'],['What it settles','可确证的内容']],
        rows: M.evidenceLadder.map(e => [{b:e.n}, e.d]) },
    ] },

    { t:'card', title:['Methodology — how this market is normalised','方法论 — 本市场的归一化方式'], badges:['calc'], blocks:[
      { t:'table', head:[['Decision','决策'],['What this dashboard does','本看板的处理'],['Why','原因']], rows:[
        [{b:['Archetype duration','原型时长']},
         ['TWO hours, against four or more everywhere else on this platform.','采用两小时，而本平台其他市场均为四小时或以上。'],
         ['The fleet averages ' + O.fleetHours + 'h and about ' + O.shortSharePct + '% of the planning-scenario fleet is 1h or 2h. A four-hour ERCOT archetype would be a market that does not exist.','机组平均' + O.fleetHours + '小时，且规划情景中约' + O.shortSharePct + '%为1或2小时。四小时的ERCOT原型将是一个并不存在的市场。']],
        [{b:['Capacity revenue','容量收入']},
         ['Declared zero; `capacityMarket` is false and the capacity-backed route returns "not applicable".','声明为零；`capacityMarket`设为false，容量支撑路径返回"不适用"。'],
         ['ERCOT is energy-only. Scarcity is an ORDC adder inside the energy price, so it is already in the merchant line and must not be added again.','ERCOT为纯电能量市场。稀缺性是电能量价格中的ORDC加价项，已包含在市场化收入之中，不得重复计算。']],
        [{b:['Base strategy','基准路径']},
         ['`toll`, overriding the engine\'s merchant default.','设为`toll`，覆盖引擎默认的市场化路径。'],
         ['Twelve known tolled batteries, five operating. Merchant is not how an ERCOT battery reaching financial close in 2026 is contracted — the same override, for the same reason, as the NEM.','已知十二个租赁储能项目，五个在运。市场化并非2026年达成融资交割的ERCOT储能的实际签约方式 — 与NEM采用相同覆盖，理由亦相同。']],
        [{b:['Capex at two hours','两小时口径造价']},
         ['NREL\'s four-hour $' + O.nrel4hPerKWh + '/kWh decomposed on platform stack shares and re-assembled at 2h: $961,920/MW.','将NREL四小时口径的每kWh $' + O.nrel4hPerKWh + '按平台资本开支结构占比拆解后在两小时口径下重组：每MW $961,920。'],
         ['No two-hour US benchmark was located, and quoting the four-hour rate at two hours would ignore that the power half does not shrink with the energy.','未找到美国两小时基准数据，而直接以四小时费率套用于两小时将忽略功率部分不随电量缩减的事实。']],
        [{b:['Merchant revenue basis','市场化收入口径']},
         ['CY2025 index energy leg, scaled from the ' + O.fleetHours + 'h fleet to 2h at a ' + O.captureDuration + ' capture penalty.','取2025日历年指数的电能量部分，按' + O.captureDuration + '捕获折减由' + O.fleetHours + '小时机组折算至2小时。'],
         ['A full calendar year is the right basis for a fifteen-year model. 2025 was a documented trough, and the band ceiling carries the toll market\'s much higher view.','对十五年模型而言，完整日历年是正确的基准。2025年是有据可查的低谷，而区间上限承载了租赁市场高得多的判断。']],
        [{b:['Ancillary services','辅助服务']},
         ['A quantity set by system need divided by a fleet growing from ' + O.fleet2026GW + ' GW to about ' + O.fleet2030GW + ' GW.','由系统需求确定的采购量，除以由' + O.fleet2026GW + 'GW增至约' + O.fleet2030GW + 'GW的机组规模。'],
         ['Identical construction to PJM\'s Regulation seed. The observed level is the band ceiling, because it belongs to a smaller fleet than the one this asset will compete against.','与PJM调频收入种子值的构造完全相同。已观测水平作为区间上限，因其对应的机组规模小于该资产未来所面对的竞争规模。']],
        [{b:['Network access haircut','电网接入折减']},
         ['No `naqFactor` is declared.','未声明`naqFactor`。'],
         ['ERCOT settles at the resource node, so basis is already inside the index the merchant leg is derived from. A haircut on top would deduct it twice.','ERCOT按资源节点结算，因此基差已包含在市场化收入所依据的指数之中。再叠加折减将导致重复扣减。']],
        [{b:['The §48E tax credit','§48E税收抵免']},
         ['Seeded at zero, with an editable 0–37% range on the dedicated Investment Lab page.','种子值为零，并在独立投资测算页面中提供0–37%的可编辑区间。'],
         ['Identical to PJM. The credit is federal, so it moves both US markets by the same proportion and reorders nothing between them.','与PJM完全一致。该抵免属联邦层面，因此对两个美国市场的影响比例相同，不改变两者之间的排序。']],
      ] },
      { t:'note', b:['Currency: ','货币：'],
        text:['All figures are in US dollars, which is also the platform\'s comparison currency. ERCOT and PJM are therefore the only markets on this platform whose published economics carry no FX assumption at all.',
              '所有数字均以美元计，而美元同时也是本平台的对比货币。因此ERCOT与PJM是本平台唯二已发布经济性数据完全不含汇率假设的市场。'] },
    ] },

    { t:'card', title:['Source register','来源登记册'], badges:['official'], blocks:[
      { t:'table', head:[['Source','来源'],['Status','状态'],['Vintage','数据时点'],['Coverage','覆盖范围']], rows:[
        [{b:['ERCOT — RTC+B go-live','ERCOT — RTC+B上线']}, {chip:'good', text:SRC.rtcb.status}, SRC.rtcb.date, SRC.rtcb.cy],
        [{b:['ERCOT — 2026 AS Requirement Methodology','ERCOT — 2026年辅助服务需求方法']}, {chip:'good', text:SRC.asMethod.status}, SRC.asMethod.date, SRC.asMethod.cy],
        [{b:['ERCOT — interconnection and large-load queue','ERCOT — 并网与大负荷排队']}, {chip:'good', text:SRC.queue.status}, SRC.queue.date, SRC.queue.cy],
        [{b:['ERCOT — Ancillary Services Study','ERCOT — 辅助服务研究']}, {chip:'good', text:SRC.asStudy.status}, SRC.asStudy.date, SRC.asStudy.cy],
        [{b:['Modo Energy — ME BESS ERCOT Index','Modo Energy — ME BESS ERCOT指数']}, {chip:'warn', text:SRC.modoIndex.status}, SRC.modoIndex.date, SRC.modoIndex.cy],
        [{b:['Enverus — independent revenue estimate','Enverus — 独立收入测算']}, {chip:'warn', text:SRC.enverus.status}, SRC.enverus.date, SRC.enverus.cy],
        [{b:['Modo Energy — buildout report','Modo Energy — 建设进度报告']}, {chip:'warn', text:SRC.buildout.status}, SRC.buildout.date, SRC.buildout.cy],
        [{b:['Modo Energy — tolling agreements','Modo Energy — 租赁协议']}, {chip:'warn', text:SRC.tolls.status}, SRC.tolls.date, SRC.tolls.cy],
        [{b:['NREL — utility-scale storage cost','NREL — 公用事业级储能成本']}, {chip:'good', text:SRC.nrel.status}, SRC.nrel.date, SRC.nrel.cy],
        [{b:['IRC §48E and the OBBBA','美国税法典§48E与OBBBA法案']}, {chip:'good', text:SRC.itc.status}, SRC.itc.date, SRC.itc.cy],
      ] },
      { t:'src', src:SRC.nrel, use:['Installed capital cost, decomposed to the two-hour archetype','安装资本成本，拆解至两小时原型'] },
      { t:'src', src:SRC.itc, use:['The tax credit and the material-assistance rules that gate it','税收抵免及作为其前置条件的实质协助规则'] },
    ] },

    { t:'card', title:['Glossary','术语表'], badges:['official'], blocks:[ { t:'glossary' } ] },

    { t:'card', title:['Export','数据导出'], badges:['calc'], blocks:[
      { t:'cap', text:['Exports this dashboard\'s KPI set with its seed tag and vintage. The market-design inputs are primary-source; every revenue and toll figure is derived and is labelled as such in the export.',
                       '导出本看板KPI集合及其种子标签与数据时点。市场机制类输入来自原始出处；所有收入与租赁数值均为推导值，并在导出文件中如此标注。'] },
      { t:'exports' },
    ] },
  ] };
};

/* Investment Case and Entry: the investment-view revision. The content is the
   shared component, which reads this market's view and ledger as its dashboard
   registered them. There is no build pathway for this market yet, so Entry is
   the ledger. */
SEC_B.case = () => ({ head: ['Investment Case — who should enter, and by which route', '投资判断 — 谁应该进入，走哪条路径'], blocks: [
  { t: 'p', text: ['The easiest market here to connect to, and the reference project loses money on the model as fleet revenue has fallen two years running.', '这是各市场中最容易并网的一个；但随着机组收入连续两年下降，参考项目在模型中处于亏损。'] },
  { t: 'investment-case', marketId: 'ercot' },
] });
SEC_B.entry = () => ({ head: ['Entry — what it costs before the first dollar of revenue', '进入成本 — 第一笔收入之前要付出什么'], blocks: [
  { t: 'p', text: ['Two fees to the system operator and then security to the transmission provider with the notice to proceed. None has a sourced amount, so nothing here is totalled.', '须向系统运营机构缴纳两笔费用，发出开工通知时再向输电服务商提交担保。三者均没有可查证的金额，因此此处不作合计。'] },
  { t: 'entry-ledger', marketId: 'ercot' },
] });

  return SECTIONS;
}
