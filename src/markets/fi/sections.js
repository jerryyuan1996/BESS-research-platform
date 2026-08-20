/* ---------------------------------------------------------------------------
   Finland — declarative section specs.

   One entry per tab, drawn by the shared block engine. Nothing is imported
   directly and no rendering happens here, which is what keeps this market
   interchangeable with the others in the lineage.

   THE SHAPE OF THIS DASHBOARD IS AN ARGUMENT. Most markets on this platform
   build toward a revenue number. This one builds toward the reason there is not
   one yet: the reserve tab states the obligation, the fleet against it and the
   forecast that does not rescue it, and then declines to publish a level. A
   dashboard that buried that in a footnote would be worse than one that did not
   exist.

   Tabs are the standard ten so a reader moving between markets finds the same
   structure. What differs is what fills them.
   --------------------------------------------------------------------------- */

import { buildPathwayFor } from '../buildPathwayRegistry.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function buildSections(api){
  const { L, M, SRC, fmtN } = api;

  const SEC_B = {};
  function SECTIONS(){
    const o = {};
    Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
    return o;
  }

  const fastRows = () => M.reserves.obligation2026
    .filter(r => r.fast)
    .map(r => [{ b: r.product }, r.mw, r.role]);
  const slowRows = () => M.reserves.obligation2026
    .filter(r => !r.fast)
    .map(r => [{ b: r.product }, r.mw, r.role]);

  // ---------------- Overview -----------------------------------------------
  SEC_B.home = () => ({ head: ['Finland at a glance', '芬兰概览'], blocks: [
    { t: 'card', badges: ['official'], live: false, blocks: [
      { t: 'kpis', items: [
        { l: ['Fast-reserve obligation, 2026', '2026年快速备用需求'], v: fmtN(M.reserves.fastTotalMW) + '<small> MW</small>',
          d: ['FFR, FCR-D up and down, FCR-N', 'FFR、FCR-D上调与下调、FCR-N'] },
        { l: ['Connected storage, Feb 2026', '2026年2月已并网储能'], v: fmtN(M.fleet.connectedMW) + '<small> MW</small>',
          d: ['Saturation warning — see Reserve Markets', '饱和预警 — 详见备用市场页'], cls: 'warn' },
        { l: ['Resource adequacy revenue', '容量充裕度收入'], v: '—',
          d: ['Mechanism dormant since ' + M.adequacy.dormantSince, '机制自' + M.adequacy.dormantSince + '起休眠'] },
        { l: ['Southern connections', '南部并网'], v: 'closed',
          d: ['Restricted until ' + M.connection.restrictedUntil, '受限至' + M.connection.restrictedUntil + '年'] },
      ] },
      { t: 'warn', text: M.seedWarn },
      { t: 'why', text: [
        'Finland is the clearest fast-reserve market in Europe and the clearest test of whether a reserve-led thesis survives its own buildout — and it faces an acute saturation warning. Connected storage passed 1,050 MW in February 2026 against fast-reserve obligations summing to about 795 MW. Both sides of that are approximations pointing the same way rather than a like-for-like measurement, so it warns rather than proves. The one thing working the other way is access, not demand: southern connections are closed until 2029, which caps how fast the fleet can grow from here and hands whoever already holds a connection the scarcity.',
        '芬兰是欧洲最典型的快速备用市场，也是检验"备用主导"投资逻辑能否经受自身装机扩张的最清晰样本 — 且其面临强烈的饱和预警。2026年2月已并网储能超过1,050MW，而快速备用需求合计约795MW。该比较的两端均为方向一致的近似值，而非同口径实测，故只构成预警而非证明。唯一反向作用的因素是准入而非需求：南部并网在2029年前关闭，这限制了机组的后续增长，并将稀缺性交给了已持有并网容量的一方。',
      ], sig: [
        ['Reserve depth', '备用市场深度'],
        ['Connection access', '并网准入'],
        ['Single price zone', '单一报价区'],
      ] },
      { t: 'src', src: SRC.reserveObligations, use: ['Reserve obligations and the procurement forecast', '备用需求及采购预测'] },
    ] },
  ] });

  // ---------------- Market story -------------------------------------------
  SEC_B.story = () => ({ head: ['How Finland got here', '芬兰市场的演进'], blocks: [
    { t: 'card', badges: ['official'], live: false, blocks: [
      { t: 'p', text: [
        'Three changes, in order. Olkiluoto 3 entered service and the adequacy problem went away — the strategic reserve has held nothing since July 2022. Wind became the swing producer, roughly 5,000 MW of it on the west coast, and the price record now includes −500 €/MWh. Then, on 1 October 2025, day-ahead settlement moved to a 15-minute market time unit, shortening the cycle a battery is paid for.',
        '三项变化，依次发生。Olkiluoto 3投运后充裕度问题消失 — 战略备用自2022年7月起未持有任何容量。风电成为边际调节电源，西海岸装机约5,000MW，价格记录中已出现−500欧元/MWh。随后，日前市场结算于2025年10月1日转为15分钟周期，缩短了储能的获利周期。',
      ] },
      { t: 'why', text: [
        'The order matters. Adequacy stopped being the question before volatility became one, which is why Finland has a dormant capacity mechanism and a live reserve market rather than the reverse. A market that solved adequacy with nuclear and then created volatility with wind will pay for flexibility, not for firm capacity.',
        '顺序很重要。充裕度问题的消失早于波动性问题的出现，这正是芬兰容量机制休眠而备用市场活跃（而非相反）的原因。一个以核电解决充裕度、又以风电制造波动性的市场，将为灵活性付费，而非为确定性容量付费。',
      ] },
      { t: 'src', src: SRC.adequacyStandard, use: ['Reliability standard and the adequacy position', '可靠性标准与充裕度状况'] },
    ] },
  ] });

  // ---------------- Capacity & adequacy ------------------------------------
  SEC_B.capacity = () => ({ head: ['A capacity mechanism that procures nothing', '一个未采购任何容量的容量机制'], blocks: [
    { t: 'card', badges: ['official'], live: false, blocks: [
      { t: 'kpis', items: [
        { l: ['Procured, 2025–26 period', '2025-26年度采购量'], v: '0<small> MW</small>' },
        { l: ['Dormant since', '休眠起始'], v: M.adequacy.dormantSince },
        { l: ['Reliability standard', '可靠性标准'], v: M.adequacy.loleStandardHours + '<small> h/yr LOLE</small>' },
      ] },
      { t: 'p', text: [
        'Finland has a statutory peak load capacity system under act 117/2011, administered by Finextra. The Energy Authority procured no capacity for 1 November 2025 to 31 October 2026, and nothing has been held since July 2022.',
        '芬兰依据117/2011号法案设有法定峰荷容量机制，由Finextra管理。能源局在2025年11月1日至2026年10月31日期间未采购任何容量，且自2022年7月起未持有任何容量。',
      ] },
      { t: 'why', text: [
        'This is why this platform records no resource adequacy revenue for Finland — and the reason is stronger than an absent mechanism. The mechanism exists, and it is idle because the system does not need it. It is also a strategic reserve: capacity held outside the market, not an accreditation payment a merchant battery banks. Both facts have to change before a capacity line appears here.',
        '这正是本平台未记录芬兰容量充裕度收入的原因 — 且该理由比"不存在此类机制"更有力。机制确实存在，只是因系统无需而闲置。它同时也是战略备用：容量置于市场之外持有，而非可供市场化储能获取的核定容量收入。只有这两点同时改变，本页才会出现容量收入项。',
      ], sig: [['Dormant, not absent', '休眠而非缺失'], ['Held outside the market', '置于市场之外']] },
      { t: 'src', src: SRC.peakLoadCapacity, use: ['The procurement decision for the current period', '当期采购决定'] },
    ] },
  ] });

  // ---------------- Wholesale ----------------------------------------------
  SEC_B.energy = () => ({ head: ['Wholesale and intraday', '批发与日内市场'], blocks: [
    { t: 'card', badges: ['official'], live: true, blocks: [
      { t: 'kpis', items: [
        { l: ['Bidding zone', '报价区'], v: '1', d: ['One price, whole country', '全国单一电价'] },
        { l: ['Market time unit', '结算周期'], v: M.wholesale.mtuMinutes + '<small> min</small>', d: ['From ' + M.wholesale.mtuChangedOn, '自' + M.wholesale.mtuChangedOn + '起'] },
        { l: ['Observed floor', '已观测最低价'], v: fmtN(M.wholesale.observedFloorEurMWh) + '<small> €/MWh</small>', d: [M.wholesale.observedFloorYear, M.wholesale.observedFloorYear + '年'] },
      ] },
      { t: 'why', text: [
        'One bidding zone is the single most important fact for siting: no locational basis risk, and no way to earn congestion either. The merchant case rests entirely on the time dimension, which is why the move to 15-minute settlement matters more here than it would in a zonal market.',
        '单一报价区是选址方面最重要的事实：既无地域基差风险，也无从获取拥塞收益。市场化收入逻辑完全依赖时间维度，这正是15分钟结算的转变在此比在分区市场更为重要的原因。',
      ] },
      { t: 'src', src: SRC.dayAhead, use: ['Day-ahead price series for the Finnish bidding zone', '芬兰报价区日前电价序列'] },
      { t: 'src', src: SRC.marketStructure, use: ['Market time unit and the observed price record', '结算周期与已观测价格记录'] },
    ] },
  ] });

  // ---------------- Reserve markets — the argument --------------------------
  SEC_B.services = () => ({ head: ['Reserve markets — and why the revenue line is blank', '备用市场 — 以及收入项留白的原因'], blocks: [
    { t: 'card', badges: ['official', 'verify'], live: false, blocks: [
      { t: 'table',
        head: ['Product', 'MW, 2026', 'Role'],
        num: [1],
        rows: fastRows() },
      { t: 'cap', text: ['The fast products a battery competes for — about ' + fmtN(M.reserves.fastTotalMW) + ' MW of obligation in total.',
                         '储能参与竞争的快速品种 — 需求合计约' + fmtN(M.reserves.fastTotalMW) + 'MW。'] },
      { t: 'table',
        head: ['Product', 'MW, 2026', 'Role'],
        num: [1],
        rows: slowRows() },
      { t: 'cap', text: ['The slower products, where a battery competes with demand response and thermal plant on cost.',
                         '响应较慢的品种，储能在此与需求响应及火电机组进行成本竞争。'] },
      /* CORRECTED 2026-08-19 AGAINST THE SOURCE. This note previously read "The
         forecast does not rescue it" and supported that by naming mFRR up, mFRR
         down and a declining FCR-N. The same Fingrid table also shows FCR-D up
         rising 307 → 379 MW and FCR-D down rising 296 → 366 MW — the two largest
         fast products, both growing. Naming the one fast product that falls and
         omitting the two that rise made the fast block look flat or shrinking
         when it grows about 16%. The relative point survives and is the real one;
         the absolute one was wrong. */
      { t: 'note', b: ['Both grow — the slower products grow far faster. ', '两类品种均增长 — 但较慢品种增速远高。'], text: [
        'On Fingrid\'s 2026–2036 forecast, combined FFR, FCR-N and FCR-D procurement rises from about 734 MW to about 853 MW, roughly +16%, while combined aFRR and mFRR rises from about 960 MW to about 1,850 MW, roughly +93%. Fast-product procurement therefore increases rather than declines, and the weight of the growth sits in the slower products. This is Fingrid\'s non-binding forecast of AVERAGE PROCUREMENT, updated annually; it is not the national reserve-obligation table above, and the two are different measures that must not be differenced. It establishes neither prices nor storage awards, and nothing in it can be converted into a reserve-revenue line.',
        '根据Fingrid的2026–2036年预测，FFR、FCR-N与FCR-D合计采购量由约734MW升至约853MW，增幅约16%；而aFRR与mFRR合计采购量由约960MW升至约1,850MW，增幅约93%。因此快速品种的采购量是增长而非下降，只是增量主要集中于响应较慢的品种。此为Fingrid不具约束力的平均采购量预测，每年更新；它并非上方的全国备用需求表，二者口径不同，不得相减。该预测既未确立价格，也未确立储能中标情况，其中任何数据均无法据以推算备用收入。',
      ] },
      { t: 'warn', text: M.reserves.withheldNote || [
        'This dashboard publishes NO reserve revenue level for Finland. Against about ' + fmtN(M.reserves.fastTotalMW) + ' MW of fast-reserve obligation, connected storage passed ' + fmtN(M.fleet.connectedMW) + ' MW in February 2026. That is an acute saturation warning rather than proof of oversupply: the obligation is a SUM across distinct products with their own prequalification and clearing, and the fleet figure is all storage of 1 MW and above with ' + M.fleet.distributionSharePct + '% distribution-connected, so not every megawatt is prequalified for every product. A revenue level published before eligible-versus-procured MW can be tracked per product would be a forecast that today persists. Gate FI-1.',
        '本看板不发布芬兰的备用收入水平。面对约' + fmtN(M.reserves.fastTotalMW) + 'MW的快速备用需求，已并网储能于2026年2月已超过' + fmtN(M.fleet.connectedMW) + 'MW。这构成强烈的饱和预警，而非供给过剩的证明：需求方为多个独立品种的合计，各品种有各自的预审与出清；机组方涵盖1MW及以上所有储能类型，其中' + M.fleet.distributionSharePct + '%接入配电网，并非每一MW都已通过所有品种的预审。在能够按品种跟踪合格容量与采购容量之前发布收入水平，等同于假设当前状况将长期持续。研究缺口FI-1。',
      ] },
      { t: 'src', src: SRC.fcrYearly2026, use: ['Yearly-market volumes and prices for delivery year 2026', '2026交付年度的年度市场容量与价格'] },
      { t: 'src', src: SRC.reserveForecast, use: ['The 2026–2036 requirement forecast, by product', '2026–2036年分品种需求预测'] },
    ] },
  ] });

  // ---------------- Duration ------------------------------------------------
  SEC_B.duration = () => ({ head: ['Duration', '储能时长'], blocks: [
    { t: 'card', badges: ['dev'], live: false, blocks: [
      { t: 'p', text: [
        'The announced Finnish fleet is overwhelmingly two-hour: 110 MW/220 MWh and 125 MW/250 MWh at the Statkraft/OX2 sites, 70 MW/140 MWh at Nivala, 50 MW/100 MWh at Uusikaupunki. That is what a fast-reserve and short-cycle-spread market builds.',
        '已公布的芬兰机组绝大多数为2小时时长：Statkraft/OX2两处场址分别为110MW/220MWh与125MW/250MWh，Nivala为70MW/140MWh，Uusikaupunki为50MW/100MWh。这正是快速备用与短周期价差市场所催生的配置。',
      ] },
      { t: 'why', text: [
        'No duration curve is published here, because a duration optimisation needs a revenue level to optimise against and this market\'s largest leg is withheld. What the fleet shows is that developers have already answered the question commercially, and answered it two hours.',
        '本页未发布时长曲线，因为时长优化需要有收入水平作为优化对象，而本市场最大的收入项目前暂缓发布。已建机组表明开发商已在商业层面作出选择，答案是2小时。',
      ] },
      { t: 'src', src: SRC.storageFleet, use: ['Connected storage aggregate', '已并网储能汇总'] },
      { t: 'src', src: SRC.statkraftOx2, use: ['The 235 MW under construction', '在建的235MW'] },
    ] },
  ] });

  // ---------------- Pipeline ------------------------------------------------
  SEC_B.pipeline = () => ({ head: ['Project pipeline', '项目管线'], blocks: [
    { t: 'card', badges: ['dev'], live: false, blocks: [
      { t: 'table',
        head: ['Project', 'MW', 'MWh', 'Status'],
        num: [1, 2],
        rows: M.fleet.announced.map(p => [{ b: p.name }, fmtN(p.mw), fmtN(p.mwh), p.status]) },
      { t: 'note', b: ['Announcements, not a register. ', '公告而非登记册。'], text: [
        'Fingrid publishes storage capacity as an aggregate, not a project-level register, so this table is announcements. The evidence behind each row differs: the Statkraft/OX2 sites are a named counterparty agreement, while Nivala and Uusikaupunki rest on trade press and are the weakest citations on this page. Shown because omitting known projects would understate the fleet — not because the sourcing is strong.',
        'Fingrid公布的是储能容量汇总值而非项目级登记册，故本表为公告汇总。各行的证据强度不同：Statkraft/OX2场址有具名交易对手协议支撑，而Nivala与Uusikaupunki仅依据行业媒体报道，属本页最弱的信息来源。列出这些项目是为避免低估机组规模，而非因其来源可靠。',
      ] },
      { t: 'src', src: SRC.storageFleet, use: ['Connected storage aggregate', '已并网储能汇总'] },
      { t: 'src', src: SRC.statkraftOx2, use: ['Statkraft/OX2 agreement', 'Statkraft/OX2协议'] },
      { t: 'src', src: SRC.tradePress, use: ['Nivala and Uusikaupunki — weakest citations on this page', 'Nivala与Uusikaupunki — 本页最弱来源'] },
    ] },
  ] });

  // ---------------- Grid connection — the binding constraint ----------------
  /* The grid tab renders TWO sibling blocks rather than one card: the
     constraint, then how a project is actually built against it. In Finland
     those are the same argument — where you can connect decides the project,
     and the sequence is what you do about it — so splitting them across two
     tabs would split one story across two pages. */
  SEC_B.grid = () => ({ head: ['Grid connection — the constraint that decides the project', '并网 — 决定项目成败的约束'], blocks: [
    { t: 'card', badges: ['official'], live: false, blocks: [
    { t: 'kpis', items: [
      { l: ['Storage connection requests', '储能并网申请'], v: '>' + fmtN(M.connection.requestsMW) + '<small> MW</small>' },
      { l: ['Already contracted', '已签约'], v: '~' + fmtN(M.connection.contractedMW) + '<small> MW</small>' },
      { l: ['South restricted until', '南部受限至'], v: M.connection.restrictedUntil, d: ['Was ' + M.connection.previouslyUntil, '此前为' + M.connection.previouslyUntil + '年'] },
      { l: ['Reinforcement', '加强工程'], v: '+' + fmtN(M.connection.reinforcementMW) + '<small> MW</small>', d: ['North to south', '由北向南'] },
    ] },
    { t: 'p', text: [
      'Fingrid has restricted new grid energy storage connections in southern Finland until 2029, when the Hikiä–Toivila reinforcement completes. Capacity remains available in Ostrobothnia and the north. Because Finland is a single price area, siting north costs nothing in modelled revenue.',
      'Fingrid已将芬兰南部新增电网侧储能并网限制至2029年，即Hikiä–Toivila加强工程完工之时。博滕区与北部仍有可用容量。由于芬兰为单一报价区，在北部选址不会造成模型收入损失。',
    ] },
    { t: 'why', text: [
      'The restriction previously ran to early 2027 and was extended — because connection demand grew, not because the works slipped. Treat 2029 as a forecast with a demonstrated direction of error. Meanwhile the 1,800 MW already contracted holds something the next 30,000 MW cannot buy, which is the strongest thing protecting the reserve price for an incumbent.',
      '该限制此前至2027年初，后被延长 — 原因是并网需求增长而非工程延误。应将2029年视为一个已显现偏差方向的预测。与此同时，已签约的1,800MW持有后续30,000MW申请无法购得的资源，这是保护在运方备用收入价格的最强因素。',
    ], sig: [['Extended once already', '已延期一次'], ['Scarcity favours the incumbent', '稀缺性有利于在运方']] },
    { t: 'src', src: SRC.reserveObligations, use: ['Main grid scale and the reinforcement programme', '主网规模与加强工程'] },
    ] },
    { t: 'pathway', pathway: buildPathwayFor('fi'), sourceFor: (k) => SRC[k] },
  ] });



  // ---------------- Portfolio ----------------------------------------------
  SEC_B.portfolio = () => ({ head: ['Portfolio view', '组合视图'], blocks: [
    { t: 'card', badges: ['illus'], live: false, blocks: [
      { t: 'note', text: [
        'Finland is registered with engineReady:false and is deliberately excluded from the league table, the $1M allocation engine and the certainty frontier. It appears on the market cards and in this dashboard so the research is visible; it does not appear in any cross-market ranking, because ranking it would require the revenue line this market withholds.',
        '芬兰以engineReady:false注册，按设计不计入同口径对比表、百万美元配置引擎及确定性前沿。它出现在市场卡片与本看板中，以使研究成果可见；但不出现在任何跨市场排名中，因为排名需要本市场暂缓发布的收入项。',
      ] },
      { t: 'why', text: [
        'A market can be worth researching and not yet worth ranking. Holding Finland out is the mechanism that keeps those two statements separable — and the flag is machine-readable, so no chart can quietly include it.',
        '一个市场可以值得研究，但尚不值得排名。将芬兰排除在外的机制使这两种判断得以区分 — 且该标记为机器可读，任何图表都无法悄然纳入它。',
      ] },
    ] },
  ] });

  // ---------------- Data & methodology --------------------------------------
  SEC_B.data = () => ({ head: ['Data and methodology', '数据与方法'], blocks: [
    { t: 'card', badges: ['official'], live: false, blocks: [
      { t: 'kpis', items: [
        { l: ['Sources verified', '来源核验日期'], v: M.asOf },
        { l: ['Main grid', '主网规模'], v: fmtN(M.grid.lineKm) + '<small> km</small>', d: [fmtN(M.grid.substations) + ' substations', fmtN(M.grid.substations) + '座变电站'] },
        { l: ['Ten-year investment', '十年投资'], v: '€' + M.grid.tenYearInvestmentEurBn + '<small> bn</small>' },
      ] },
      { t: 'table',
        head: ['Gate', 'What it blocks', 'What closes it'],
        rows: [
          [{ b: ['FI-1', 'FI-1'] }, ['The reserve revenue line', '备用收入项'], ['Eligible/prequalified MW against procured MW, per product', '按品种统计的合格容量与采购容量对比']],
          [{ b: ['FI-2', 'FI-2'] }, ['Ingesting the Fingrid reserve series', '接入Fingrid备用数据序列'], ['Provision an API key, accept and record the API terms, implement CC Attribution', '申请API密钥、接受并记录API条款、落实CC署名要求']],
          [{ b: ['FI-3', 'FI-3'] }, ['Finland-specific capex, opex and fees', '芬兰本地造价、运维与费率'], ['A local benchmark; platform conventions are in use meanwhile', '本地基准数据；当前采用平台惯例']],
          [{ b: ['FI-4', 'FI-4'] }, ['A sourced merchant capture rate', '有据可依的市场化捕获率'], ['A backtest on 15-minute settlement', '基于15分钟结算的回测']],
          [{ b: ['FI-5', 'FI-5'] }, ['A north/south split of the connection queue', '并网排队的南北分布'], ['Fingrid publishing requests by region', 'Fingrid按区域公布申请量']],
        ] },
      { t: 'src', src: SRC.fingridApiTerms, use: ['Dataset licence and what the API path still needs', '数据集许可条款及API接入尚需完成的事项'] },
      { t: 'src', src: SRC.reserveObligations, use: ['Reserve obligations and forecast', '备用需求与预测'] },
      { t: 'src', src: SRC.peakLoadCapacity, use: ['Adequacy and the dormant mechanism', '充裕度与休眠机制'] },
      { t: 'src', src: SRC.storageFleet, use: ['Connected storage aggregate', '已并网储能汇总'] },
    ] },
  ] });

  return SECTIONS;
}
