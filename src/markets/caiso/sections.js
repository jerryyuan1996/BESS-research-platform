/* ---------------------------------------------------------------------------
   CAISO — section specs for the shared block engine.

   One organising argument runs through every tab: CAISO is the only US market
   where the contracted line is most of the revenue, and the only market on this
   platform where four hours is a ceiling rather than a floor. Resource Adequacy
   averaged $8.77/kW-month against merchant nearer $2.5-3, and the CPUC tests net
   qualifying capacity on four-hour sustained output and pays nothing beyond it.

   The consequence runs backwards through the whole dashboard. If the contract is
   most of the revenue then the counterparty, the tenor and the deliverability
   status are the underwriting — not the spread. And if RA stops paying at four
   hours then duration is a solved question rather than an open one, which is the
   opposite of PJM's answer to the same question.

   Content is deliberately tighter than GB's. Every tab is complete and sourced;
   none is padded. The `data` tab lists all six coverage gaps.
   --------------------------------------------------------------------------- */
import { gridMapById } from '../gridMapRegistry.js';
import { congestionFor } from '../congestionRegistry.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function buildSections(api){
  const { h, L, MKT, M, SRC, state, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct,
          compositeScore, liveScore, dilutionAt } = api;

const SEC_B = {};
function SECTIONS(){
  const o = {};
  Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
  return o;
}
const O = M.official;
const kMW = v => fmtCk(v);
const perKW = v => fmtC(v) + '/kW-mo';

// ============================== OVERVIEW ==============================
SEC_B.home = function (){
  return {
  head: ['CAISO — a capacity contract with a trading option attached',
         'CAISO — 一份附带交易期权的容量合约'],
  cap: ['The only US market where the contracted line is most of the revenue, and the only market here where four hours is a ceiling rather than a floor.',
        '这是美国唯一一个合同化收入构成收入主体的市场，也是本平台唯一一个四小时构成上限而非下限的市场。'],
  blocks: [
    { t:'warn', text:M.seedWarn },
    { t:'card', mt:false, title:['Position at a glance','总体判断'], badges:['calc','illus'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Investment stance','投资立场'], v:L(M.overall.statusL),
          d:['COD window ' + M.overall.codWindow, '投运窗口 ' + M.overall.codWindow] },
        { l:['Composite score','综合评分'], v:String(compositeScore()) + '<small>/100</small>',
          d:['confidence ' + M.overall.confidence + '%', '置信度 ' + M.overall.confidence + '%'], b:['calc'] },
        { l:['Resource Adequacy benchmark','容量充裕度基准'], v:perKW(O.raPerKWMonth),
          d:['H1 2025, up more than ' + O.raYoYPct + '% year on year', '2025年上半年，同比上涨逾' + O.raYoYPct + '%'], b:['tp'] },
        { l:['Merchant, same period','同期市场化收入'], v:perKW(O.merchPerKWMonth2025),
          d:['energy and ancillary combined — a third of the RA line','电能量与辅助服务合计 — 约为容量充裕度收入的三分之一'], b:['tp'] },
        { l:['RA credit above four hours','四小时以上的容量充裕度信用'], v:'$0',
          d:['NQC is tested on four-hour sustained output and pays nothing beyond it','净合格容量按四小时持续出力测定，超出部分不予支付'], b:['official'] },
        { l:['Interconnection queue','并网排队'], v:O.queueTotalGW + '<small> GW</small>',
          d:['batteries about ' + O.queueBatterySharePct + '% of it, against a fleet near ' + O.fleet2026GW + ' GW',
             '其中储能约占' + O.queueBatterySharePct + '%，而在运机组规模接近' + O.fleet2026GW + 'GW'], cls:'down', b:['tp'] },
      ] },
      { t:'ic', b:['House view: ','本方观点：'], text:M.overall.rationale },
    ] },

    { t:'card', title:['Where the revenue actually comes from','收入的真实来源'], badges:['tp'], blocks:[
      { t:'bar', cfg:{ xs:M.stackLabels, bw:72, yfmt:v => '$' + v, labels:true, h:230,
        series:[{ name:['$/kW-month','$/kW-月'], color:'var(--s12)', vals:M.stackSeries }] } },
      { t:'cap', text:['Resource Adequacy against merchant, on the same axis. This is the chart that separates CAISO from both its US neighbours: in PJM the capacity payment is large but lasts one delivery year, in ERCOT there is none at all, and here it is most of the income and runs for the length of a negotiated contract.',
                       '容量充裕度与市场化收入置于同一坐标轴对比。正是本图将CAISO与其两个美国邻近市场区分开来：在PJM，容量收入虽高但仅持续一个实需年度；在ERCOT完全没有容量收入；而在此处，它构成收入的主体，并按协商合约的期限持续。'] },
      { t:'why', text:['Read this alongside the composite score and the ranking makes sense. CAISO does not score highest on this platform, and the reason is not the revenue — it is that ' + O.queueTotalGW + ' GW sits in the interconnection queue with batteries about ' + O.queueBatterySharePct + '% of it, and interconnection has overtaken technology cost as the binding constraint on getting anything built. A market can have the best contracted revenue in its country and still be hard to enter, and this one does.',
        '将本图与综合评分对照，排名的合理性便清晰可见。CAISO在本平台并非评分最高，其原因不在收入 — 而在于并网排队量达' + O.queueTotalGW + 'GW、其中储能约占' + O.queueBatterySharePct + '%，且并网已取代技术成本成为项目能否建成的约束性瓶颈。一个市场可以拥有全国最优的合同化收入，同时仍然难以进入，而此处正是如此。'],
        sig:['Best contracted revenue in the country, hardest queue to clear','全国最优的合同化收入，最难通过的排队'] },
      { t:'src', src:SRC.raBench, use:['The RA price benchmark','容量充裕度价格基准'] },
      { t:'src', src:SRC.merchBench, use:['The merchant benchmark it sits above','其上方对应的市场化收入基准'] },
    ] },

    { t:'card', title:['The four facts that decide a CAISO case','决定CAISO投资逻辑的四个事实'], badges:['official'], blocks:[
      { t:'table', head:[['Fact','事实'],['Evidence','证据'],['What it does to the case','对投资逻辑的影响']], rows:[
        [{b:['The contract is most of the revenue','合同化收入构成收入主体']},
         [perKW(O.raPerKWMonth) + ' RA against ' + perKW(O.merchPerKWMonth2025) + ' merchant, H1 2025',
          '2025年上半年，容量充裕度' + perKW(O.raPerKWMonth) + '，市场化收入' + perKW(O.merchPerKWMonth2025)],
         ['Underwrite the counterparty and the tenor. The spread is the small part.','应承销交易对手与合约期限。价差只是较小的部分。']],
        [{b:['There is no clearing price','不存在出清价格']},
         ['RA is negotiated bilaterally; reported range ' + perKW(O.raRangeLo) + ' to ' + perKW(O.raRangeHi) + ' in unconstrained areas',
          '容量充裕度采取双边协商；非受限区域已报告区间为' + perKW(O.raRangeLo) + '至' + perKW(O.raRangeHi)],
         ['The widest contracted band on this platform, and structurally so.','本平台最宽的合同化区间，且属结构性原因。']],
        [{b:['Four hours is a ceiling','四小时构成上限']},
         ['NQC is determined from tested sustained output over ' + O.nqcTestHours + ' hours, with no additional credit beyond it',
          '净合格容量依据' + O.nqcTestHours + '小时持续出力测试结果确定，超出部分不予额外计入'],
         ['The fifth hour earns spread only. The marginal-hour waterfall does not clear.','第五小时仅能获得价差收入。边际小时瀑布图无法实现盈亏平衡。']],
        [{b:['Deliverability is binary','可交付性是非此即彼的']},
         ['An energy-only interconnection cannot sell Resource Adequacy at all',
          '仅电能量并网的项目完全无法出售容量充裕度'],
         ['Losing it removes most of the revenue rather than reducing it.','丧失该资格将移除大部分收入，而非仅使其减少。']],
      ] },
      { t:'why', text:['The second and fourth rows are the ones that separate a CAISO underwriting from a PJM one. In PJM both halves of the capacity payment are published, every project in the RTO receives the same price, and the only question is whether the asset holds Capacity Interconnection Rights. Here the price is negotiated, the dispersion is threefold between the reported ends, and full-capacity deliverability is the gate. Two markets that both pay well for capacity, and almost nothing about the diligence transfers between them.',
        '第二行与第四行正是CAISO与PJM承销工作的分野所在。在PJM，容量收入的两个组成部分均已公布，RTO内每个项目获得相同价格，唯一的问题是资产是否持有容量并网权。而在此处，价格由协商确定，已报告区间两端相差三倍，且全容量可交付性是准入门槛。两个市场都为容量支付可观对价，但尽职调查的方法几乎无法互通。'],
        sig:['Both pay for capacity; almost no diligence transfers','两者都为容量付费，但尽调方法几乎无法互通'] },
    ] },
  ] };
};

// ============================== MARKET STORY ==============================
SEC_B.story = function (){
  return {
  head: ['CAISO Market Story — the duck curve became a business model',
         'CAISO市场演进 — 鸭形曲线成为一门生意'],
  cap: ['California built the deepest midday trough in the developed world and then built the fleet to trade it. What is scarce now is not the opportunity but the connection.',
        '加州创造了发达世界最深的午间低谷，随后建成了交易该低谷的机组群。如今稀缺的不是机会，而是并网。'],
  blocks: [
    { t:'card', mt:false, title:['How the market got here','市场如何演变至此'], badges:['official'], blocks:[
      { t:'timeline', items:[
        { y:'2010s', t:['The duck curve','鸭形曲线'],
          p:['Utility-scale and behind-the-meter solar drove midday prices toward and through zero while the evening ramp steepened. The shape that made storage necessary was created by policy rather than by weather.',
             '公用事业级与用户侧光伏使午间价格趋近并跌破零，同时晚间爬坡愈发陡峭。使储能成为必需的这一形态，源于政策而非天气。'],
          i:['The arbitrage opportunity was manufactured, and it is durable because the solar is not going away.','套利机会是被创造出来的，且具有持续性 — 因为光伏不会消失。'] },
        { y:'2020–2024', t:['The fleet arrives','机组大规模到位'],
          p:['Battery capacity reached ' + O.fleet2024GW + ' GW in 2024 after growing ' + O.fleet2024GrowthPct + '% in a single year, and approached ' + O.fleet2026GW + ' GW by early 2026 — one of the two largest fleets in the United States alongside ERCOT.',
             '储能装机在单年增长' + O.fleet2024GrowthPct + '%后于2024年达到' + O.fleet2024GW + 'GW，并于2026年初接近' + O.fleet2026GW + 'GW — 与ERCOT并列为美国两大机组群之一。'],
          i:['Merchant spreads compressed as the fleet grew, exactly as they did in Texas.','随着机组规模扩大，市场化价差被压缩 — 与德州的情形完全一致。'] },
        { y:'2025', t:['Slice of Day','分时段机制'],
          p:['The CPUC redefined Resource Adequacy obligations across ' + O.sodSlices + ' hourly slices, with a storage excess-capacity test ensuring batteries can actually be charged over the critical net-peak hours.',
             'CPUC将容量充裕度义务按' + O.sodSlices + '个小时时段重新定义，并设有储能富余容量测试，以确保电池在关键净峰时段确实能够完成充电。'],
          i:['A framework that credits storage for when it can deliver, not merely for existing.','该框架按储能实际可供电的时段给予信用，而非仅因其存在即予计入。'] },
        { y:'2026', t:['The constraint moves to the queue','约束转移至排队环节'],
          p:['Roughly ' + O.queueTotalGW + ' GW of generation and storage sits in the interconnection queue, batteries about ' + O.queueBatterySharePct + '% of it. Interconnection has overtaken technology cost as the binding constraint on deployment.',
             '并网排队中的发电与储能项目约' + O.queueTotalGW + 'GW，其中储能约占' + O.queueBatterySharePct + '%。并网已取代技术成本成为建设的约束性瓶颈。'],
          i:['The revenue question is largely settled here. The access question is not.','此处的收入问题大体已定，而准入问题尚未解决。'] },
      ] },
      { t:'why', text:['CAISO and ERCOT ran the same experiment from opposite ends and it is worth seeing them together. Both built large battery fleets — 16.7 GW in CAISO and about 15 GW in ERCOT. Texas did it by making connection almost free and fast, and lost the merchant margin as a result. California did it against a queue that has become the binding constraint, and kept a contracted revenue line worth several times the Texan merchant one. Neither outcome is an accident of policy — each is the direct consequence of what its market chose to make scarce.',
        'CAISO与ERCOT从相反的两端进行了同一场实验，值得对照观察。CAISO已建成16.7GW储能，ERCOT约15GW。德州的做法是使并网几乎免费且迅速，其结果是失去了市场化margin。加州则是在排队已成为约束性瓶颈的情况下完成建设，并保有了价值数倍于德州市场化收入的合同化收入。两种结果都非政策的偶然产物 — 而是各自市场选择使何种要素稀缺所带来的直接后果。'],
        sig:['Large fleets, opposite scarcity, opposite outcome','大规模机组，相反的稀缺性，相反的结果'] },
      { t:'src', src:SRC.fleet, use:['Fleet growth and the queue composition','机组增长与排队构成'] },
    ] },
    { t:'card', title:['What changes next, and when','下一步变化及其时点'], badges:['official','forecast'], blocks:[
      { t:'ladder', items:[
        { n:['2027 — the next RA compliance year under Slice of Day','2027年 — 分时段机制下的下一个容量充裕度合规年度'],
          d:['Whether RA prices hold as the fleet passes ' + O.fleet2026GW + ' GW is the single most important question for this market, and the answer will be a set of bilateral contracts rather than a published number.',
             '在机组规模突破' + O.fleet2026GW + 'GW后容量充裕度价格能否维持，是本市场最重要的问题；而答案将体现为一系列双边合约，而非某个公开数字。'] },
        { n:['2030–2032 — the COD window on this dashboard','2030–2032年 — 本看板的投运窗口'],
          d:['The latest window on the platform, and the queue is why. A project entering the CAISO queue now is underwriting a market it will reach at the end of the decade.',
             '这是本平台最晚的投运窗口，而排队正是其成因。现在进入CAISO排队的项目，所承销的是其将在本十年末才能进入的市场。'] },
        { n:['Ongoing — interconnection reform','持续进行 — 并网改革'],
          d:['No completion date. This is the only relief item on this market\'s register with no year attached, and it is the binding one.',
             '没有完成日期。这是本市场登记表中唯一没有年份的缓解事项，同时也是起约束作用的那一项。'] },
      ] },
      { t:'why', text:['Note what is NOT on this ladder: a change to the four-hour NQC test. Nothing published proposes moving it, which means the ceiling on duration credit is the most stable input in this market and can be underwritten as such. That is unusual — on most dashboards here the contracted mechanism is the thing most likely to change. In CAISO it is the queue.',
        '请注意本时间序列中没有的内容：四小时净合格容量测试的变更。没有任何公开信息提议调整该标准，这意味着时长信用的上限是本市场最稳定的输入，可据此进行承销。这颇为反常 — 在本平台多数看板中，合同化机制才是最可能发生变化的部分。而在CAISO，最可能变化的是排队。'],
        sig:['The mechanism is stable; the access is not','机制稳定，准入则不然'] },
    ] },
  ] };
};

// ============================== RESOURCE ADEQUACY ==============================
SEC_B.capacity = function (){
  return {
  head: ['Resource Adequacy & Slice of Day — most of the revenue, none of it cleared',
         '容量充裕度与分时段机制 — 收入的主体，却无任何集中出清'],
  cap: ['CAISO publishes the framework in full and the price not at all, because Resource Adequacy is negotiated between a generator and a load-serving entity rather than cleared in an auction.',
        'CAISO完整公布制度框架，却完全不公布价格 — 因为容量充裕度由发电方与负荷服务实体协商确定，而非通过拍卖集中出清。'],
  blocks: [
    { t:'card', mt:false, title:['The contracted line','合同化收入项'], badges:['tp','official'], blocks:[
      { t:'kpis', items:[
        { l:['RA benchmark, ' + O.raPeriod, '容量充裕度基准，' + O.raPeriod], v:perKW(O.raPerKWMonth),
          d:['up more than ' + O.raYoYPct + '% year on year; ' + kMW(O.raPerMWYr) + '/MW/yr annualised',
             '同比上涨逾' + O.raYoYPct + '%；年化每MW每年' + kMW(O.raPerMWYr)], b:['tp'] },
        { l:['Reported range, unconstrained areas','非受限区域已报告区间'], v:perKW(O.raRangeLo) + '–' + perKW(O.raRangeHi),
          d:['the model band; top earners have reached ' + perKW(O.raTopEarner),'即模型区间；高者曾达' + perKW(O.raTopEarner)], b:['tp'] },
        { l:['Contract tenor, seed','合约期限，种子值'], v:O.raTenorSeed + '<small> yr</small>',
          d:['band ' + O.raTenorLo + '–' + O.raTenorHi + '; longest publicly named is ' + O.ormatTenor + ' years',
             '区间' + O.raTenorLo + '–' + O.raTenorHi + '年；已具名公开的最长期限为' + O.ormatTenor + '年'], b:['tp'] },
        { l:['NQC test duration','净合格容量测试时长'], v:O.nqcTestHours + '<small> h</small>',
          d:['sustained output; no additional credit beyond it','持续出力；超出部分不予额外计入'], b:['official'] },
        { l:['Published clearing price','已公布的出清价格'], v:L(['None — RA is bilateral','无 — 容量充裕度为双边协商']),
          d:['no auction exists to clear one','不存在可供出清的拍卖机制'], b:['verify'] },
        { l:['CPUC observations above ' + perKW(100), 'CPUC记录的高于' + perKW(100) + '的情形'], v:String(O.raAbove100Count),
          d:['between ' + O.raAbove100Period + '; excluded from the band as unrepresentative',
             '发生于' + O.raAbove100Period + '；因不具代表性而排除于区间之外'], b:['tp'] },
      ] },
      { t:'bar', cfg:{ xs:M.raLabels, bw:56, yfmt:v => '$' + v, labels:true, h:230,
        series:[{ name:['RA price, $/kW-month','容量充裕度价格，$/kW-月'], color:'var(--s12)', vals:M.raSeries }] } },
      { t:'cap', text:['The dispersion is the finding. A benchmark of ' + perKW(O.raPerKWMonth) + ' sits inside a reported range that runs from ' + perKW(O.raRangeLo) + ' to ' + perKW(O.raRangeHi) + ', with top earners at ' + perKW(O.raTopEarner) + ' — a threefold spread between the ordinary ends and more than sevenfold to the top.',
                       '离散度本身即是结论。' + perKW(O.raPerKWMonth) + '的基准值处于' + perKW(O.raRangeLo) + '至' + perKW(O.raRangeHi) + '的已报告区间之内，而高者达' + perKW(O.raTopEarner) + ' — 常规两端相差三倍，至最高值相差逾七倍。'] },
      { t:'why', text:['This is the widest contracted band on the platform and it is wide for a structural reason rather than a lack of evidence. Every other capacity mechanism here clears centrally: PJM posts one price for the whole RTO, Poland runs an auction, Italy runs an auction. CAISO does not clear at all — a project negotiates with a load-serving entity, and what it achieves depends on its local capacity area, its deliverability status and its counterparty\'s position. So the number a reader should take from this page is not the benchmark. It is the range, and the knowledge that where a specific project lands inside it is a commercial outcome rather than a market observation.',
        '这是本平台最宽的合同化区间，其宽度源于结构性原因而非证据不足。此处其他每一种容量机制都采用集中出清：PJM为整个RTO公布单一价格，波兰采用拍卖，意大利采用拍卖。而CAISO完全不作出清 — 项目须与负荷服务实体协商，其所能达成的水平取决于所在本地容量区、可交付性状态及交易对手的处境。因此读者应从本页取用的并非基准值，而是该区间 — 以及这样一个认识：特定项目最终落在区间何处，是商业谈判的结果而非市场观测值。'],
        sig:['The number to take is the range, not the benchmark','应取用的是区间，而非基准值'] },
      { t:'src', src:SRC.raBench, use:['The benchmark and its year-on-year move','基准值及其同比变动'] },
      { t:'src', src:SRC.raRange, use:['The reported dispersion','已报告的离散区间'] },
      { t:'src', src:SRC.raPriceGap, use:['Why no project-specific price exists','为何不存在项目专属价格'] },
    ] },

    { t:'card', title:['Slice of Day, and the four-hour test','分时段机制与四小时测试'], badges:['official'], blocks:[
      { t:'table', head:[['Rule','规则'],['What it does','其作用'],['What it means for this asset','对该资产的含义']], rows:[
        [{b:['Slice of Day','分时段机制']},
         ['RA obligations redefined across ' + O.sodSlices + ' hourly slices from ' + O.sodFromYear, '自' + O.sodFromYear + '年起，容量充裕度义务按' + O.sodSlices + '个小时时段重新定义'],
         ['Credit follows when the asset can actually deliver, not merely that it exists.','信用按资产实际可供电的时段计入，而非仅因其存在即予计入。']],
        [{b:['Storage excess-capacity test','储能富余容量测试']},
         ['Portfolios must hold surplus energy to charge storage over the critical net-peak hours, allowing for efficiency losses','投资组合须持有富余电量，以在关键净峰时段为储能充电，并计入效率损失'],
         ['A battery cannot be counted on unless the system can also fill it.','若系统无法为其充电，该储能即不可计入。']],
        [{b:['Four-hour NQC test','四小时净合格容量测试']},
         ['NQC determined from tested sustained output over ' + O.nqcTestHours + ' hours, with no additional credit beyond','净合格容量依据' + O.nqcTestHours + '小时持续出力测试结果确定，超出部分不予额外计入'],
         ['Four hours captures the full contracted line. The fifth hour earns spread only.','四小时即可获得全部合同化收入。第五小时仅能获得价差收入。']],
      ] },
      { t:'why', text:['Set the last row against PJM and the two markets give opposite instructions to the same developer. PJM\'s ELCC ladder pays nine points to move from four hours to six and nineteen to reach ten, so duration is a live commercial question there. CAISO stops at four and pays nothing after it, so duration is settled. A developer building in both markets is building two different machines, and the reason is not the physics of the battery or the shape of the load — it is two regulators making different choices about how to accredit the same asset.',
        '将最后一行与PJM对照，两个市场对同一开发商给出了完全相反的指引。PJM的ELCC阶梯在四小时至六小时之间给予九个百分点、至十小时给予十九个百分点，因此在该市场时长是一个现实的商业问题。CAISO在四小时处终止、其后不再支付，因此时长问题已成定局。在两个市场同时建设的开发商，实际上是在建造两种不同的机器 — 其原因既非电池的物理特性，也非负荷形态，而是两家监管机构对同一资产的核证方式作出了不同选择。'],
        sig:['Two regulators, one asset, opposite duration answers','两家监管机构，同一资产，相反的时长结论'] },
      { t:'src', src:SRC.sod, use:['The Slice of Day framework and the excess-capacity test','分时段框架与富余容量测试'] },
      { t:'src', src:SRC.nqc, use:['The NQC values and the four-hour basis','净合格容量数值与四小时基准'] },
    ] },
  ] };
};

// ============================== NODAL ENERGY ==============================
SEC_B.energy = function (){
  return {
  head: ['Nodal Energy & the Midday Trough — the smaller half, and the durable one',
         '节点电能量与午间低谷 — 较小的一半，也是更持久的一半'],
  cap: ['California manufactured the deepest midday trough in the developed world. It is a policy artefact rather than a weather one, which is why it does not go away.',
        '加州创造了发达世界最深的午间低谷。它是政策的产物而非天气的产物，因此不会消失。'],
  blocks: [
    { t:'card', mt:false, title:['The merchant benchmark, month by month','市场化收入基准，逐月数据'], badges:['tp'], blocks:[
      { t:'bar', cfg:{ xs:M.merchLabels, bw:56, yfmt:v => '$' + v, labels:true, h:220,
        series:[{ name:['Merchant revenue, $/kW-month','市场化收入，$/kW-月'], color:'var(--s12)', vals:M.merchSeries }] } },
      { t:'cap', text:['Energy arbitrage and ancillary services combined — the benchmark is published as one figure and no decomposition was located. December 2025 was a record low; June 2026 at ' + perKW(O.merchJun26) + ' was ' + O.merchJun26YoYPct + '% below the same month a year earlier.',
                       '电能量套利与辅助服务合计 — 该基准以单一数值公布，未找到相应拆解。2025年12月创历史新低；2026年6月为' + perKW(O.merchJun26) + '，较上年同月低' + O.merchJun26YoYPct + '%。'] },
      { t:'why', text:['Compare the vertical scale here with the Resource Adequacy chart on the overview tab and the CAISO case states itself. The whole merchant band on this page — from ' + perKW(O.merchJan26) + ' to ' + perKW(O.merchOct25) + ' — is smaller than the gap between the low and high ends of the reported RA range. An investor who spends their diligence on the spread and takes the RA benchmark as given has allocated their attention exactly backwards.',
        '将本页的纵轴刻度与总览页的容量充裕度图表对照，CAISO的投资逻辑便不言自明。本页整个市场化收入区间 — 自' + perKW(O.merchJan26) + '至' + perKW(O.merchOct25) + ' — 都小于已报告容量充裕度区间高低两端之间的差距。若投资人将尽职调查的精力用于价差、而将容量充裕度基准视为既定，那么其注意力分配恰恰是反的。'],
        sig:['The whole merchant band is smaller than the RA uncertainty','整个市场化收入区间小于容量充裕度的不确定性'] },
      { t:'src', src:SRC.merchBench, use:['The monthly merchant benchmark','逐月市场化收入基准'] },
      { t:'src', src:SRC.splitGap, use:['Why the energy/ancillary split is estimated','电能量与辅助服务拆分为何属估算'] },
    ] },

    { t:'card', title:['The residual nobody explains','无人解释的残差'], badges:['verify'], blocks:[
      { t:'kpis', items:[
        { l:['Published full stack with RA, 2025','2025年含容量充裕度的全口径收入'], v:perKW(O.fullStackPerKWMonth),
          d:['reported for a battery with an RA contract in place','针对已签有容量充裕度合约的储能所报告'], b:['tp'] },
        { l:['RA benchmark','容量充裕度基准'], v:perKW(O.raPerKWMonth), d:['H1 2025','2025年上半年'], b:['tp'] },
        { l:['Observed merchant','已观测市场化收入'], v:perKW(O.merchPerKWMonth2025), d:['CY2025','2025日历年'], b:['tp'] },
        { l:['Unexplained residual','无法解释的残差'], v:'≈' + perKW(O.fullStackResidual),
          d:['not allocated to either leg in this model','本模型未将其分摊至任一收入项'], cls:'down', b:['verify'] },
      ] },
      { t:'why', text:['Three published figures that do not add up, from the same publisher and the same period. This dashboard records the gap rather than closing it, because there are at least three explanations — a higher RA level inside the full-stack sample, a revenue stream neither benchmark captures, or a different fleet basis between the two series — and nothing found distinguishes them. Assigning roughly ' + perKW(O.fullStackResidual) + ' to either leg would move the modelled return by more than most of the assumptions on this page, on no evidence at all.',
        '来自同一发布方、同一时期的三个公开数字无法相互调和。本看板记录该缺口而不予弥合，因为至少存在三种解释 — 全口径样本中容量充裕度水平更高、存在两项基准均未涵盖的收入来源，或两组序列的机组口径不同 — 且所找到的资料无法在其间作出区分。若将约' + perKW(O.fullStackResidual) + '归入任一收入项，其对建模回报的影响将超过本页多数假设，而这毫无证据支撑。'],
        sig:['Three published figures that do not add up','三个无法相互调和的公开数字'] },
      { t:'src', src:SRC.stackGap, use:['The unresolved reconciliation','未解决的调和问题'] },
    ] },
  ] };
};

// ============================== ANCILLARY SERVICES ==============================
SEC_B.services = function (){
  return {
  head: ['Ancillary Services — the smallest leg, and it does not pay for duration',
         '辅助服务 — 最小的收入项，且不为时长付费'],
  cap: ['About a fifth of an already-small merchant line, saturating against a 16.7 GW fleet.',
        '约占本已较小的市场化收入的五分之一，且正在16.7GW的机组规模面前趋于饱和。'],
  blocks: [
    { t:'card', mt:false, title:['Where the ancillary seed comes from','辅助服务种子值的来源'], badges:['calc','verify'], blocks:[
      { t:'kpis', items:[
        { l:['Merchant benchmark, CY2025','市场化收入基准，2025日历年'], v:perKW(O.merchPerKWMonth2025),
          d:['energy and ancillary combined, as published','按公布口径为电能量与辅助服务合计'], b:['tp'] },
        { l:['Estimated ancillary share','估算的辅助服务占比'], v:O.asShareEstimatedPct + '<small>%</small>',
          d:['no published decomposition exists','不存在已公布的拆解数据'], b:['verify'] },
        { l:['Ancillary seed, year 1','辅助服务种子值，第1年'], v:kMW(6240) + '<small>/MW/yr</small>',
          d:['saturation after year 1 is carried by the services curve','第1年之后的饱和由服务曲线承载'], b:['calc'] },
      ] },
      { t:'warn', text:['The ' + O.energyShareEstimatedPct + '/' + O.asShareEstimatedPct + ' split is ESTIMATED. The CAISO merchant benchmark is published as a single combined figure and no decomposition was located. The split is applied identically to all three forward cases, so it moves the two legs together and does not distort the comparison between them — but a reader who believes ancillary is a larger share should move both.',
                        O.energyShareEstimatedPct + '/' + O.asShareEstimatedPct + '的拆分属估算值。CAISO市场化收入基准以单一合并数值公布，未找到相应拆解。该拆分对三种前瞻情形一致适用，因此两个收入项同步变动、不会扭曲彼此之间的比较 — 但若读者认为辅助服务占比更高，则应同时调整两者。'] },
      { t:'why', text:['Ancillary services are procured in megawatts, so a longer battery earns no more of them per MW than a shorter one. Combined with the four-hour NQC ceiling on the contracted line, that means TWO of the three revenue legs in CAISO are indifferent to duration above four hours — only arbitrage responds, and the marginal-hour waterfall shows it does not respond enough. That is the cleanest duration answer on this platform, and it is negative.',
        '辅助服务按兆瓦采购，因此更长时长的储能每MW所获收入并不高于较短时长者。结合合同化收入端四小时的净合格容量上限，这意味着在CAISO三项收入中有两项对四小时以上的时长无差别 — 仅套利收入有所响应，而边际小时瀑布图显示其响应幅度不足。这是本平台最清晰的时长结论，且为否定性结论。'],
        sig:['Two of three legs are indifferent to duration','三项收入中有两项对时长无差别'] },
      { t:'src', src:SRC.splitGap, use:['The missing decomposition','缺失的拆解数据'] },
    ] },
  ] };
};

// ============================== DURATION ==============================
SEC_B.duration = function (){
  return {
  head: ['Storage Duration — the one market here where four hours is a ceiling',
         '储能时长 — 本平台唯一一个四小时构成上限的市场'],
  cap: ['The CPUC tests net qualifying capacity on four-hour sustained output and pays nothing beyond it. Duration in CAISO is a solved question, and the answer is exactly four.',
        'CPUC按四小时持续出力测定净合格容量，超出部分不予支付。CAISO的时长问题已有定论，答案恰好是四小时。'],
  blocks: [
    { t:'card', mt:false, title:['Why the archetype is four hours','为何原型采用四小时'], badges:['official'], blocks:[
      { t:'table', head:[['Evidence','证据'],['Points to','指向']], rows:[
        [['NQC is determined from tested sustained output over four hours','净合格容量依据四小时持续出力测试结果确定'], ['exactly 4h','恰好4小时']],
        [['A battery with longer discharge receives no additional RA credit','放电时长更长的储能不获额外容量充裕度信用'], ['not more than 4h','不超过4小时']],
        [['Ancillary services are procured in MW and do not scale with duration','辅助服务按MW采购，不随时长增长'], ['neutral','中性']],
        [['The midday trough is deep enough to fill four hours reliably','午间低谷足够深，可可靠地填满四小时'], ['not less than 4h','不少于4小时']],
        [['Degradation threatens the four-hour test itself, not just revenue','衰减威胁的是四小时测试本身，而不仅是收入'], ['4h plus augmentation headroom','4小时并预留增容裕度']],
      ] },
      { t:'why', text:['The last row is the CAISO-specific one and it changes what augmentation is for. In most markets on this platform augmentation is about adding hours to chase more revenue. Here it is about keeping the four-hour NQC test passable as the battery fades — because failing it does not reduce the contracted revenue proportionally, it reduces the accredited capacity the whole RA contract is written against. Augmentation in California is a defensive expenditure, and the augmentation scorecard on this tab is weighted accordingly.',
        '最后一行是CAISO特有的，它改变了增容的目的。在本平台多数市场中，增容是为增加时长以获取更多收入。而在此处，增容是为在电池衰减后仍能通过四小时净合格容量测试 — 因为未通过该测试并不会按比例减少合同化收入，而是会减少整份容量充裕度合约所依据的核证容量。在加州，增容是一项防御性支出，本页的增容记分卡也据此加权。'],
        sig:['Augmentation here is defensive, not expansionary','此处的增容是防御性而非扩张性的'] },
      { t:'src', src:SRC.nqc, use:['The four-hour NQC basis','四小时净合格容量基准'] },
    ] },
    { t:'card', title:['Duration-Need Index','时长需求指数'], badges:['calc','illus'], live:true, blocks:[
      { t:'scorecard', id:'durFactors', bands:'durBands' },
    ] },
    { t:'card', title:['Marginal value of the fifth and sixth hour','第五、六小时的边际价值'], badges:['calc','illus'], blocks:[
      { t:'wf', cfg:{ steps:M.marginalHour, yfmt:v => fmtC(v) + 'k', h:250 } },
      { t:'cap', text:['Incremental value of moving from four hours to six, per MW per year, in $ thousands. The Resource Adequacy line is ZERO — not small, zero — because net qualifying capacity is tested on four hours and pays nothing beyond it. In PJM the same step is worth nine ELCC points.',
                       '由四小时提升至六小时的增量价值，单位为每MW每年千美元。容量充裕度一项为零 — 不是较小，而是零 — 因为净合格容量按四小时测定，超出部分不予支付。在PJM，同样的一步价值九个ELCC百分点。'] },
      { t:'why', text:['This is the largest negative marginal hour on the platform, at about ' + kMW(40000) + '/MW/yr, and it is the most confidently negative because the zero on the RA line is a published rule rather than an estimate. Everywhere else the duration question turns on a spread forecast or an accreditation projection. Here it turns on a CPUC test that is written down.',
        '这是本平台最大的负边际小时值，约为每MW每年' + kMW(40000) + '，同时也是最具确定性的负值 — 因为容量充裕度一项的零值是已公布的规则而非估算。在其他各处，时长问题取决于价差预测或核证系数预测。而在此处，它取决于一项白纸黑字的CPUC测试标准。'],
        sig:['The zero is a published rule, not an estimate','该零值是已公布的规则，而非估算'] },
    ] },
    { t:'card', title:['Augmentation readiness','扩容准备度'], badges:['illus'], live:true, blocks:[
      { t:'aug' },
      { t:'cap', text:['Note the fifth row, which scores high by default: in CAISO augmentation is about restoring the four-hour NQC test as the asset degrades, not about adding hours. That is a different purpose from every other market on this platform.',
                       '请注意第五行，其默认评分较高：在CAISO，增容的目的是在资产衰减后恢复四小时净合格容量测试结果，而非增加时长。这与本平台其他任何市场的目的都不同。'] },
    ] },
  ] };
};

// ============================== PIPELINE ==============================
SEC_B.pipeline = function (){
  return {
  head: ['Project Pipeline — 500 GW queued, and that is the constraint',
         '项目管线 — 500GW排队，而这正是约束所在'],
  cap: ['Interconnection has overtaken technology cost as the binding constraint on CAISO deployment. The pipeline is not an opportunity here, it is the obstacle.',
        '并网已取代技术成本，成为CAISO建设的约束性瓶颈。此处的管线并非机会，而是障碍。'],
  blocks: [
    { t:'card', mt:false, title:['Development stage probabilities','开发阶段概率'], badges:['illus'], blocks:[
      { t:'stageProb' },
      { t:'cap', text:['Illustrative weighting. The step that matters most is full-capacity deliverability: an energy-only interconnection cannot sell Resource Adequacy at all, which removes most of the revenue on this dashboard rather than reducing it. It is scored below the executed RA agreement because the contract is what converts deliverability into cash.',
                       '示意性权重。最关键的步骤是全容量可交付性：仅电能量并网的项目完全无法出售容量充裕度，这将移除本看板大部分收入而非仅使其减少。其评分低于已签署的容量充裕度协议，因为正是该合约将可交付性转化为现金流。'] },
    ] },
    { t:'card', title:['Announced versus probability-weighted','已公布容量与概率加权容量'], badges:['calc','illus'], blocks:[
      { t:'pipeChart', unit:'MW' },
      { t:'why', text:['The gap between the two lines means something different here than in Texas. In ERCOT a fast pipeline destroys the revenue, because connection is easy and the margin is what is scarce. In CAISO the pipeline is largely stuck — ' + O.queueTotalGW + ' GW queued against a fleet near ' + O.fleet2026GW + ' GW — and that congestion in the queue is part of what protects the Resource Adequacy price. A CAISO investor holding a queue position is holding the scarce thing.',
        '两条曲线之间的差距在此处的含义不同于德州。在ERCOT，管线推进过快会摧毁收入，因为并网容易、稀缺的是margin。而在CAISO，管线大体处于停滞状态 — ' + O.queueTotalGW + 'GW排队对应接近' + O.fleet2026GW + 'GW的在运机组 — 且排队环节的拥堵正是保护容量充裕度价格的因素之一。在CAISO持有排队位置的投资人，所持有的正是稀缺资源本身。'],
        sig:['Here the queue position IS the scarce asset','在此处，排队位置本身就是稀缺资产'] },
    ] },
    { t:'card', title:['Seed project register','种子项目登记表'], badges:['illus'], blocks:[
      { t:'table', head:[['Project','项目'],['Region','区域'],['MW','MW'],['Hours','时长'],['COD','投运'],['Stage','阶段']],
        num:[2,3],
        rows: M.projects.map(p => [{b:[p.n, p.n]}, [p.region, p.region],
          String(p.mw), String(p.h), p.cod, {chip:'info', text:[p.st, p.st]}]) },
      { t:'cap', text:['Every row is a seed example. CAISO publishes net qualifying capacity by resource but not a project-level development pipeline with owners and dates — the same position PJM is in, and the opposite of ERCOT where tolled assets are publicly announced with named counterparties.',
                       '每一行均为种子示例。CAISO按资源公布净合格容量，但不公布含所有方与日期的项目级开发管线 — 与PJM情形相同，而与ERCOT相反（后者的租赁资产会具名公布交易对手）。'] },
      { t:'src', src:SRC.nqc, use:['NQC values by resource','按资源列示的净合格容量'] },
    ] },
  ] };
};

// ============================== GRID ==============================
SEC_B.grid = function (){
  return {
  head: ['Interconnection & Curtailment — the binding constraint, with no completion date',
         '并网与限电 — 没有完成日期的约束性瓶颈'],
  cap: ['Roughly 500 GW in the queue, batteries about 46% of it. This is the only relief item on this market\'s register with no year attached.',
        '排队量约500GW，其中储能约占46%。这是本市场登记表中唯一没有年份的缓解事项。'],
  blocks: [
    { t:'card', mt:false, title:['Interactive CAISO grid — past, current and planned','CAISO电网交互地图 — 过去、当前与规划'], badges:['official','public'], blocks:[
      { t:'geo-grid-map', data:gridMapById('caiso-grid-map') },
      { t:'why', text:['The map shows a system whose constraint is not geographic in the way Germany\'s or the NEM\'s is. Solar in the Central Valley and the desert south, load in the coastal metros, and a midday trough deep enough that curtailment and negative prices are routine — but the thing stopping a battery being built is not a missing wire. It is a queue.',
        '地图所呈现的系统，其约束并不像德国或NEM那样具有地理属性。光伏位于中央谷地与南部沙漠，负荷集中于沿海都会区，午间低谷之深使限电与负电价成为常态 — 但阻碍储能建成的并非某条缺失的输电线，而是排队。'],
        sig:['The constraint is procedural, not geographic','该约束属程序性而非地理性'] },
      { t:'src', src:SRC.fleet, use:['Queue size and composition','排队规模与构成'] },
    ] },

    { t:'congestion', data:congestionFor('caiso') },

    { t:'card', title:['Connection risk scorecard','并网风险记分卡'], badges:['calc','illus'], live:true, blocks:[
      { t:'scorecard', id:'connFactors', bands:'connBands' },
      { t:'cap', text:['Higher is worse. The queue is the heaviest line and deliverability the second, and together they are why this market scores close to PJM on connection risk despite having the best contracted revenue in the country. Land and permitting score above ERCOT\'s because CEQA review is a real and contestable step that Texas has no equivalent of.',
                       '分值越高风险越大。排队权重最高，可交付性次之；二者共同解释了为何本市场尽管拥有全国最优的合同化收入，其并网风险评分仍接近PJM。土地与许可评分高于ERCOT，因为CEQA审查是德州所没有的、真实且可被挑战的环节。'] },
    ] },
  ] };
};

// ============================== BENCHMARK ==============================
SEC_B.benchmark = function (){
  return {
  head: ['CAISO vs PJM vs ERCOT — three answers to one question',
         'CAISO、PJM与ERCOT对比 — 对同一问题的三种答案'],
  cap: ['Three US markets under one federal tax regime, differing on whether capacity should be centrally cleared, bilaterally negotiated, or not paid for at all.',
        '三个美国市场适用同一联邦税制，其差异在于容量应当集中出清、双边协商，还是完全不予支付。'],
  blocks: [
    { t:'card', mt:false, title:['The three bargains','三种取舍'], badges:['calc'], blocks:[
      { t:'table', head:[['Question','问题'],['CAISO','CAISO'],['PJM','PJM'],['ERCOT','ERCOT']], rows:[
        [{b:['How is capacity paid for?','容量如何获得支付？']},
         ['Bilateral RA contract','双边容量充裕度合约'], ['Central auction','集中拍卖'], ['Not at all','完全不支付']],
        [{b:['Is the price observable?','价格是否可观测？']},
         ['No — benchmarks and ranges only','否 — 仅有基准与区间'], ['Completely','完全可观测'], ['No — and no price exists','否 — 且不存在价格']],
        [{b:['How long is it secured for?','锁定期限多长？']},
         ['5–15 years, negotiated','5–15年，协商确定'], ['1 delivery year','1个实需年度'], ['7 years, by private toll','7年，通过私下租赁']],
        [{b:['Does duration above 4h pay?','4小时以上的时长是否有回报？']},
         ['No — NQC caps at four hours','否 — 净合格容量以四小时封顶'], ['Yes — nine ELCC points to six hours','是 — 至六小时可获九个ELCC百分点'], ['Only through the toll, unquantified','仅通过租赁，且无法量化']],
        [{b:['What is scarce?','稀缺的是什么？']},
         ['Interconnection','并网'], ['Interconnection','并网'], ['Margin','margin']],
        [{b:['Contracted share of revenue','合同化收入占比']},
         ['Most of it','大部分'], ['About half','约一半'], ['All or none, depending on the toll','取决于租赁，要么全部要么没有']],
      ] },
      { t:'why', text:['The last two rows are the ones that matter for an allocation. CAISO and PJM both make interconnection the scarce thing and both keep a contracted revenue line worth having; ERCOT makes entry easy and lets the margin be competed away instead. So CAISO and PJM are closer to each other than either is to ERCOT — which is worth knowing before treating "US storage" as one exposure. A portfolio holding CAISO and PJM is holding one bet on queue scarcity twice; a portfolio holding either alongside ERCOT is holding genuinely different risks.',
        '最后两行对配置决策最为重要。CAISO与PJM都使并网成为稀缺要素，且都保有值得持有的合同化收入；而ERCOT使准入变得容易，转而任由margin被竞争消解。因此CAISO与PJM之间的相似度，高于二者中任一方与ERCOT的相似度 — 在将“美国储能”视为单一敞口之前，这一点值得了解。同时持有CAISO与PJM的组合，实际上是对排队稀缺性下了两次同样的注；而将其中任一与ERCOT同时持有的组合，所承担的才是真正不同的风险。'],
        sig:['CAISO and PJM are the same bet twice','CAISO与PJM是同一注下了两次'] },
    ] },
    { t:'card', title:['What the federal layer does not differentiate','联邦层面不产生区分的部分'], badges:['official'], blocks:[
      { t:'note', text:['The §48E investment tax credit is 30% of eligible basis in all three markets, is voided by the same Material Assistance Cost Ratio in all three, and is seeded at zero in all three. NREL\'s $334/kWh four-hour capex benchmark is the same source for CAISO and PJM, and is decomposed and re-assembled at two hours for ERCOT. So a reader turning the ITC on in the Investment Lab moves all three US markets by the same proportion and changes nothing about which ranks higher.',
                        '§48E投资税收抵免在三个市场均为合格投资基础的30%，均因同一实质协助成本比率而失效，且在三者中种子值均为零。NREL每kWh $334的四小时造价基准对CAISO与PJM为同一来源，对ERCOT则经拆解后在两小时口径下重组。因此，读者在投资测算模块中启用ITC，将使三个美国市场按相同比例变动，完全不改变其排序。'] },
      { t:'why', text:['That is the point of carrying three US markets rather than one. Everything federal is held constant by construction — tax, tariffs, the capex benchmark, the opex convention — so every difference the league table shows between CAISO, PJM and ERCOT is a difference in market design and nothing else. It is the cleanest controlled comparison on this platform.',
        '这正是纳入三个美国市场而非一个的意义所在。所有联邦层面因素在建模上均保持恒定 — 税收、关税、造价基准、运维成本惯例 — 因此排行榜中CAISO、PJM与ERCOT之间显示的每一处差异，都仅仅是市场机制的差异。这是本平台最纯粹的受控比较。'],
        sig:['Federal held constant, so every difference is market design','联邦层面保持恒定，故所有差异均源于市场机制'] },
    ] },
  ] };
};

// ============================== PORTFOLIO ==============================
SEC_B.portfolio = function (){
  return {
  head: ['Portfolio / Fund View — screening a CAISO opportunity','组合与基金视图 — CAISO机会筛选'],
  cap: ['A worked screening example on this dashboard\'s own assumptions. Illustrative — it demonstrates the gate sequence, not a transaction.',
        '基于本看板自身假设的筛选示例。仅作示意，用于演示门槛顺序，而非真实交易。'],
  blocks: [
    { t:'card', mt:false, title:['Investment Committee gates','投委会门槛'], badges:['calc'], blocks:[
      { t:'gates', items:[
        { n:['Gate 1 — Full-capacity deliverability, not just an interconnection','门槛1 — 全容量可交付性，而非仅有并网'],
          d:['An energy-only interconnection cannot sell Resource Adequacy at all. Losing this removes most of the revenue on this dashboard rather than reducing it.',
             '仅电能量并网的项目完全无法出售容量充裕度。丧失该资格将移除本看板大部分收入，而非仅使其减少。'],
          c:'critical', s:['Binary — no deliverability, no RA revenue','非此即彼 — 无可交付性即无容量充裕度收入'] },
        { n:['Gate 2 — The RA price, the counterparty and the tenor','门槛2 — 容量充裕度价格、交易对手与合约期限'],
          d:['There is no clearing price. Reported RA runs ' + perKW(O.raRangeLo) + ' to ' + perKW(O.raRangeHi) + ' in unconstrained areas, a threefold spread, and where a project lands is a commercial outcome. Tenors run ' + O.raTenorLo + '–' + O.raTenorHi + ' years and mostly are not published.',
             '不存在出清价格。非受限区域已报告的容量充裕度价格自' + perKW(O.raRangeLo) + '至' + perKW(O.raRangeHi) + '，相差三倍，项目最终落点属商业谈判结果。合约期限为' + O.raTenorLo + '–' + O.raTenorHi + '年，且多数未公开。'],
          c:'critical', s:['The widest contracted band on the platform','本平台最宽的合同化区间'] },
        { n:['Gate 3 — Four hours, and the augmentation plan behind it','门槛3 — 四小时，及其背后的增容计划'],
          d:['NQC is tested on four-hour sustained output. Build to four and plan the augmentation that keeps the test passable as the asset degrades — failing it reduces accredited capacity, not just revenue.',
             '净合格容量按四小时持续出力测定。应按四小时建设，并规划增容以确保资产衰减后仍能通过该测试 — 未通过将减少核证容量，而不仅是收入。'],
          c:'serious', s:['Augmentation is defensive here','此处的增容属防御性'] },
        { n:['Gate 4 — Queue position and study timeline','门槛4 — 排队位置与研究周期'],
          d:['Roughly ' + O.queueTotalGW + ' GW queued with batteries about ' + O.queueBatterySharePct + '% of it. Interconnection has overtaken technology cost as the binding constraint, and the reform has no completion date.',
             '排队量约' + O.queueTotalGW + 'GW，其中储能约占' + O.queueBatterySharePct + '%。并网已取代技术成本成为约束性瓶颈，且相关改革没有完成日期。'],
          c:'critical', s:['The scarce asset in this market','本市场的稀缺资产'] },
        { n:['Gate 5 — FEOC material-assistance documentation','门槛5 — FEOC实质协助合规文件'],
          d:['Failing the Material Assistance Cost Ratio voids the §48E credit entirely. Federal, and identical to PJM and ERCOT.',
             '未通过实质协助成本比率将使§48E抵免完全失效。该项属联邦层面，与PJM及ERCOT完全一致。'],
          c:'critical', s:['A cliff, not a slope','断崖式，而非递减式'] },
      ] },
      { t:'ic', b:['Screening conclusion: ','筛选结论：'],
        text:['CAISO rewards diligence on the contract and punishes diligence on the spread, which is the opposite of where most storage underwriting effort goes. The merchant band on this dashboard — the whole of it — is smaller than the gap between the reported high and low ends of Resource Adequacy, so an hour spent on the RA counterparty is worth more than a week spent on the arbitrage forecast. And none of it matters without full-capacity deliverability, which is binary and sits behind a queue with no completion date. A CAISO case that arrives at investment committee with a detailed spread model, a benchmark RA price taken as given and deliverability described as "expected" has done the easy work and skipped all three hard parts.',
              'CAISO奖励对合约的尽职调查，惩罚对价差的尽职调查 — 而这与多数储能承销工作投入精力的方向恰恰相反。本看板的市场化收入区间 — 其全部范围 — 都小于容量充裕度已报告高低两端之间的差距，因此在容量充裕度交易对手上花费一小时，其价值高于在套利预测上花费一周。而若没有全容量可交付性，上述一切都无意义 — 该资格非此即彼，且其背后是一个没有完成日期的排队队列。若一份CAISO方案在提交投委会时附有详尽的价差模型、将基准容量充裕度价格视为既定、并将可交付性描述为“预期可获得”，那么它完成的是容易的工作，而跳过了全部三个困难环节。'] },
    ] },
  ] };
};

// ============================== DATA & METHODOLOGY ==============================
SEC_B.data = function (){
  return {
  head: ['Data & Methodology — a fully published framework and no published price',
         '数据与方法 — 完整公开的制度框架，与完全不公开的价格'],
  cap: ['CAISO documents the rules by which a project qualifies for Resource Adequacy in detail, and leaves what it will be paid to bilateral negotiation.',
        'CAISO详尽记录了项目取得容量充裕度资格所依据的规则，而将其所获报酬留给双边协商决定。'],
  blocks: [
    { t:'card', mt:false, title:['What is not published — and what this dashboard uses instead','未公开的内容 — 以及本看板的替代做法'], badges:['official'], blocks:[
      { t:'table', head:[['Item','项目'],['Publication status','公开状态'],['Why','原因'],['What is used instead','替代做法']],
        rows: M.notPublished.map(x => [{b:x.item}, {chip:'serious', text:x.status}, x.why, x.instead]) },
      { t:'why', text:['The first two entries decide more of the CAISO answer than the rest of the dashboard combined, and they pull in opposite directions. There is no clearing price for the revenue line that is most of the income, so the contracted band is the widest on this platform. And the one published full-stack figure does not reconcile to the benchmarks that should compose it, leaving roughly ' + perKW(O.fullStackResidual) + ' unexplained. Neither gap is closeable by better analysis.',
        '前两项对CAISO结论的影响超过看板其余部分的总和，且二者作用方向相反。构成收入主体的那条收入线不存在出清价格，因此其合同化区间为本平台最宽。而唯一公开的全口径收入数字，又无法与本应构成它的各项基准相调和，留下约' + perKW(O.fullStackResidual) + '无法解释。这两项缺口均无法通过更深入的分析弥补。'],
        sig:['No clearing price, and a stack that does not reconcile','没有出清价格，且收入结构无法调和'] },
      { t:'src', src:SRC.raPriceGap, use:['Why no project-specific RA price exists','为何不存在项目专属的容量充裕度价格'] },
      { t:'src', src:SRC.stackGap, use:['The unresolved full-stack residual','未解决的全口径收入残差'] },
      { t:'src', src:SRC.splitGap, use:['The estimated energy / ancillary split','估算的电能量与辅助服务拆分'] },
      { t:'src', src:SRC.tenorGap, use:['The missing tenor distribution','缺失的期限分布数据'] },
    ] },

    { t:'card', title:['Evidence ladder — what would upgrade each number','证据阶梯 — 各数值的升级路径'], badges:['calc'], blocks:[
      { t:'table', head:[['Source that would settle it','可确证的来源'],['What it settles','可确证的内容']],
        rows: M.evidenceLadder.map(e => [{b:e.n}, e.d]) },
    ] },

    { t:'card', title:['Methodology — how this market is normalised','方法论 — 本市场的归一化方式'], badges:['calc'], blocks:[
      { t:'table', head:[['Decision','决策'],['What this dashboard does','本看板的处理'],['Why','原因']], rows:[
        [{b:['Capacity risk class','容量收入风险类别']},
         ['Standard contracted fields, not the auction-renewal class.','采用标准合同化字段，而非拍卖续期类别。'],
         ['A CAISO project signs a multi-year bilateral contract. PJM needs auction-renewal because a BRA procures one delivery year; RA does not work that way.','CAISO项目签订的是多年期双边合约。PJM之所以需要拍卖续期类别，是因为其基准剩余容量拍卖仅采购一个实需年度；容量充裕度并非如此运作。']],
        [{b:['Merchant vintage','市场化收入口径年度']},
         ['Year 1, both legs, from the same published benchmark.','第1年，两个收入项均取自同一已公布基准。'],
         ['RA is additive to merchant — the owner sells capacity and still trades energy — so merchant is exposed from commercial operation. See src/comparison/vintage.js.','容量充裕度与市场化收入并存 — 业主出售容量的同时仍进行电能量交易 — 因此市场化收入自商业运行起即处于敞口状态。详见src/comparison/vintage.js。']],
        [{b:['Ancillary saturation','辅助服务饱和']},
         ['Carried by `servicesCurve`, not folded into the seed.','由`servicesCurve`承载，而非并入种子值。'],
         ['A seed is a level at a stated year and a curve is what happens after it. The same treatment PJM, Ireland and Romania use.','种子值是特定年度的水平，曲线是其后的演变路径。与PJM、爱尔兰及罗马尼亚采用相同处理方式。']],
        [{b:['Duration derating','时长折减']},
         ['Flat at and above four hours.','四小时及以上保持不变。'],
         ['The CPUC tests NQC on four-hour sustained output and gives no additional credit beyond it. This is a published rule, not an estimate.','CPUC按四小时持续出力测定净合格容量，超出部分不予额外计入。这是已公布的规则而非估算。']],
        [{b:['The full-stack residual','全口径收入残差']},
         ['Recorded, not allocated.','予以记录，不作分摊。'],
         ['Assigning roughly ' + perKW(O.fullStackResidual) + ' to either leg on no evidence would move the modelled return by more than most assumptions on this page.','在毫无证据的情况下将约' + perKW(O.fullStackResidual) + '归入任一收入项，其对建模回报的影响将超过本页多数假设。']],
        [{b:['The §48E tax credit','§48E税收抵免']},
         ['Seeded at zero, editable in the dedicated Investment Lab page.','种子值为零，可在独立投资测算页面中调整。'],
         ['Identical to PJM and ERCOT. Federal, so it moves all three US markets by the same proportion.','与PJM及ERCOT完全一致。该项属联邦层面，故对三个美国市场的影响比例相同。']],
      ] },
      { t:'note', b:['Currency: ','货币：'],
        text:['All figures are in US dollars, which is also the platform\'s comparison currency. CAISO, PJM and ERCOT are the only markets on this platform whose published economics carry no FX assumption at all.',
              '所有数字均以美元计，而美元同时也是本平台的对比货币。CAISO、PJM与ERCOT是本平台仅有的三个已发布经济性数据完全不含汇率假设的市场。'] },
    ] },

    { t:'card', title:['Source register','来源登记册'], badges:['official'], blocks:[
      { t:'table', head:[['Source','来源'],['Status','状态'],['Vintage','数据时点'],['Coverage','覆盖范围']], rows:[
        [{b:['CAISO — 2026 NQC values','CAISO — 2026年净合格容量数值']}, {chip:'good', text:SRC.nqc.status}, SRC.nqc.date, SRC.nqc.cy],
        [{b:['CPUC — Slice of Day guide','CPUC — 分时段机制指引']}, {chip:'good', text:SRC.sod.status}, SRC.sod.date, SRC.sod.cy],
        [{b:['CAISO — Special Report on Battery Storage','CAISO — 储能专题报告']}, {chip:'good', text:SRC.caisoStorage.status}, SRC.caisoStorage.date, SRC.caisoStorage.cy],
        [{b:['Modo Energy — RA benchmark','Modo Energy — 容量充裕度基准']}, {chip:'warn', text:SRC.raBench.status}, SRC.raBench.date, SRC.raBench.cy],
        [{b:['Modo Energy — merchant benchmark','Modo Energy — 市场化收入基准']}, {chip:'warn', text:SRC.merchBench.status}, SRC.merchBench.date, SRC.merchBench.cy],
        [{b:['Reported RA contract range','已报告的容量充裕度合约区间']}, {chip:'warn', text:SRC.raRange.status}, SRC.raRange.date, SRC.raRange.cy],
        [{b:['NREL — utility-scale storage cost','NREL — 公用事业级储能成本']}, {chip:'good', text:SRC.nrel.status}, SRC.nrel.date, SRC.nrel.cy],
        [{b:['IRC §48E and the OBBBA','美国税法典§48E与OBBBA法案']}, {chip:'good', text:SRC.itc.status}, SRC.itc.date, SRC.itc.cy],
      ] },
      { t:'src', src:SRC.nqc, use:['The NQC values and the four-hour basis','净合格容量数值与四小时基准'] },
      { t:'src', src:SRC.itc, use:['The tax credit and the rules that gate it','税收抵免及作为其前置条件的规则'] },
    ] },

    { t:'card', title:['Glossary','术语表'], badges:['official'], blocks:[ { t:'glossary' } ] },

    { t:'card', title:['Export','数据导出'], badges:['calc'], blocks:[
      { t:'cap', text:['Exports this dashboard\'s KPI set with its seed tag and vintage. The framework inputs are primary-source; every price is a third-party benchmark or a derived figure and is labelled as such.',
                       '导出本看板KPI集合及其种子标签与数据时点。制度框架类输入来自原始出处；所有价格均为第三方基准或推导值，并已如此标注。'] },
      { t:'exports' },
    ] },
  ] };
};

/* Investment Case and Entry: the investment-view revision. The content is the
   shared component, which reads this market's view and ledger as its dashboard
   registered them. There is no build pathway for this market yet, so Entry is
   the ledger. */
SEC_B.case = () => ({ head: ['Investment Case — who should enter, and by which route', '投资判断 — 谁应该进入，走哪条路径'], blocks: [
  { t: 'p', text: ['Long resource adequacy contracts and the longest-established financing market here, around a reference project that returns 3.2% on the model.', '资源充裕度合同期限长，融资市场历史最久；但参考项目的模型回报仅为3.2%。'] },
  { t: 'investment-case', marketId: 'caiso' },
] });
SEC_B.entry = () => ({ head: ['Entry — what it costs before the first dollar of revenue', '进入成本 — 第一笔收入之前要付出什么'], blocks: [
  { t: 'p', text: ['An interconnection request carries a fee, a study deposit and a readiness deposit, about USD 455,000 on the reference project, and the readiness deposit is then topped up against the assigned upgrade cost.', '提交并网申请须缴纳申请费、研究押金与商业成熟度保证金，以参考项目计约45.5万美元；其后还须按所分摊的升级费用补足商业成熟度保证金。'] },
  { t: 'entry-ledger', marketId: 'caiso' },
] });

  return SECTIONS;
}
