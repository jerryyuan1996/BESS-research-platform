/* Great Britain — the `benchmark` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, T, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, durationAt, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

SEC_B.benchmark = function (){
  const P = M.peer, fx = P.fxEurPerGbp;
  const gbCapGbpKW = O.t4Price;                       // £/kW/yr de-rated
  const ieCapGbpKW = P.crmPriceEurKW / fx;            // €/kW/yr → £/kW/yr
  const gbPerNameplate2h = gbCapGbpKW * M.deratingCurve[2] * 1000;   // £/MW/yr
  const iePerNameplate2h = ieCapGbpKW * P.derate[2] * 1000;          // £/MW/yr
  const mult = iePerNameplate2h / gbPerNameplate2h;
  return {
  head: ['GB vs Ireland (SEM) — market design, capacity economics and what transfers (context only)',
         '英国与爱尔兰（SEM）对比 — 市场设计、容量经济性与可迁移结论（仅背景参考）'],
  cap: ['The only section in this dashboard that uses Irish data. GB and the all-island SEM are neighbouring, interconnected, similarly regulated markets that nevertheless reward storage through structurally different mechanisms. Comparing them isolates what is genuinely GB-specific. All SEM figures are held in a separate namespace and excluded from GB\'s grades and verdicts.',
        '本看板中唯一使用爱尔兰数据的章节。英国与全岛单一电力市场相邻、互联且监管体系相近，但两者奖励储能的机制存在结构性差异。比较两者可分离出真正属于英国特有的因素。所有SEM数值保存在独立命名空间，不计入英国的评级与结论。'],
  blocks: [
    { t:'note', b:['Scope discipline: ','范围纪律：'],
      text:['SEM data (Jul 2026) covers the Republic of Ireland and Northern Ireland as a single all-island market. It never enters the GB buildout paths, the GB pipeline, the de-rating tables or any scoring input. It is used here for one purpose: to calibrate whether a GB observation is a GB problem or a general storage-market problem. Northern Ireland is inside SEM and therefore outside this dashboard.',
            'SEM数据（2026年7月）覆盖爱尔兰共和国与北爱尔兰，构成单一全岛市场。其绝不进入英国投产路径、英国管线、折减系数表或任何评分输入。此处使用仅有一个目的：校准某一英国观察结果究竟是英国特有问题，还是储能市场的普遍问题。北爱尔兰属于SEM，因此不在本看板范围内。'] },

    // ---- 1. market design ----
    { t:'card', mt:false, title:['Market design — the same asset earns differently in each market','市场设计 — 同一资产在两个市场的获利方式不同'], badges:['peer'], live:false, blocks:[
      { t:'table', head:[['Feature','特征'],['Great Britain','英国'],['Ireland — SEM','爱尔兰 — SEM']], rows:[
        [{b:['Market structure','市场结构']},
         ['Energy-only wholesale with a bolt-on Capacity Market and a deep Balancing Mechanism','单一电能量批发市场，附加容量市场及深度平衡机制'],
         ['Gross-pool market with mandatory central scheduling plus a Capacity Remuneration Mechanism','总电量池市场，强制集中调度，配套容量报酬机制']],
        [{b:['Capacity payment level','容量付费水平']},
         ['£' + fmt1(gbCapGbpKW) + '/kW de-rated/yr (T-4 DY ' + O.t4DY + ')','£' + fmt1(gbCapGbpKW) + '/kW折减/年（T-4，交付年' + O.t4DY + '）'],
         ['€' + fmtN(P.crmPriceEurKW) + '/kW de-rated/yr ≈ £' + fmtN(ieCapGbpKW) + ' (T-4 DY ' + P.crmDY + ')','€' + fmtN(P.crmPriceEurKW) + '/kW折减/年 ≈ £' + fmtN(ieCapGbpKW) + '（T-4，交付年' + P.crmDY + '）']],
        [{b:['2-hour de-rating factor','2小时折减系数']},
         [fmtPct(M.deratingCurve[2] * 100, 0) + ' — re-cut downward each vintage', fmtPct(M.deratingCurve[2] * 100, 0) + ' — 每一版本继续下调'],
         [fmtPct(P.derate[2] * 100, 0) + ' — a smaller, tighter system values short duration more', fmtPct(P.derate[2] * 100, 0) + ' — 系统更小更紧，短时长价值更高']],
        [{b:['Agreement length (new build)','新建协议年限']},
         [O.cmAgreementYears + ' years, index-linked', O.cmAgreementYears + '年，与通胀挂钩'],
         [P.crmAgreementYears + ' years', P.crmAgreementYears + '年']],
        [{b:['Where merchant value comes from','市场化价值来源']},
         ['Deep, liquid day-ahead plus a Balancing Mechanism worth 39% of revenue','深度、流动的日前市场，加上占收入39%的平衡机制'],
         ['Wide day-ahead spreads (≈€' + P.daSpreadEur + '/MWh) driven by wind variability on a small system','小系统上风电波动驱动的宽日前价差（约€' + P.daSpreadEur + '/MWh）']],
        [{b:['Ancillary / system services','辅助与系统服务']},
         ['Saturated: batteries clear 97–99% of dynamic volume, prices −25% to −30% yoy','已饱和：电池占动态类成交量97–99%，价格同比−25%至−30%'],
         ['DS3 revenue already down >' + P.ds3DeclinePct + '% since 2022; competitive DASSA procurement pending','DS3收入自2022年已下降超过' + P.ds3DeclinePct + '%；竞争性DASSA采购待实施']],
        [{b:['Binding physical constraint','关键物理约束']},
         ['Connection queue and consent — not system limits','并网队列与规划许可 — 而非系统限制'],
         ['System non-synchronous penetration limit (' + P.snspNow + '% today, ' + P.snsp2030 + '% direction) and ' + fmt1(P.windDispatchDownPct) + '% wind dispatch-down','非同步电源渗透率上限（当前' + P.snspNow + '%，目标' + P.snsp2030 + '%）及' + fmt1(P.windDispatchDownPct) + '%的风电限发']],
        [{b:['Dashboard use','看板用途']},
         ['Core GB score and every other tab','英国核心评分及其他所有页面'],
         ['This section only — context, never scored','仅本节 — 背景参考，不参与评分']],
      ] },
      { t:'why', text:['The rows that matter to a capital allocator are the capacity payment and the constraint row. GB pays a small, auction-set capacity price into a large, liquid market where the binding constraint is administrative (the queue). Ireland pays a large, auction-set capacity price into a small, constrained market where the binding constraint is physical (SNSP and dispatch-down). That difference explains why GB rewards trading capability and connection position, while Ireland rewards de-rated capacity and dispatchability — and why a GB track record does not transfer directly.',
        '对资本配置者而言最关键的两行是容量付费与约束条件。英国在一个规模大、流动性好的市场中支付较低的、由拍卖决定的容量价格，其约束是行政性的（并网队列）。爱尔兰在一个规模小、受约束的市场中支付较高的、由拍卖决定的容量价格，其约束是物理性的（非同步渗透率与限发）。这一差异解释了为何英国奖励交易能力与并网位置，而爱尔兰奖励折减后容量与可调度性 — 也解释了为何英国的业绩记录无法直接迁移。'],
        sig:['GB: trading & queue · IE: capacity & dispatch','英国看交易与队列·爱尔兰看容量与调度'] },
    ] },

    // ---- 2. capacity economics, side by side ----
    { t:'card', title:['Capacity economics compared — the single largest structural difference','容量经济性对比 — 最大的单一结构性差异'], badges:['official','peer'], blocks:[
      { t:'kpis', items:[
        { l:['GB capacity revenue per nameplate MW (2h)','英国每铭牌MW容量收入（2小时）'], v:fmtCk(gbPerNameplate2h) + '<small>/MW/yr</small>',
          d:['£' + fmt1(gbCapGbpKW) + '/kW × ' + fmtPct(M.deratingCurve[2] * 100, 0),'£' + fmt1(gbCapGbpKW) + '/kW × ' + fmtPct(M.deratingCurve[2] * 100, 0)], b:['official'] },
        { l:['Ireland capacity revenue per nameplate MW (2h)','爱尔兰每铭牌MW容量收入（2小时）'], v:'≈' + fmtCk(iePerNameplate2h) + '<small>/MW/yr</small>',
          d:['€' + fmtN(P.crmPriceEurKW) + '/kW × ' + fmtPct(P.derate[2] * 100, 0) + ' (peer namespace)','€' + fmtN(P.crmPriceEurKW) + '/kW × ' + fmtPct(P.derate[2] * 100, 0) + '（同业命名空间）'], b:['peer'] },
        { l:['Ireland / GB multiple','爱尔兰对英国倍数'], v:fmt1(mult) + '<small>×</small>', d:['on identical 2-hour nameplate MW','在同样的2小时铭牌MW上'], b:['calc'] },
        { l:['Agreement length','协议年限'], v:O.cmAgreementYears + ' / ' + P.crmAgreementYears + '<small> yr</small>', d:['GB / Ireland new-build','英国/爱尔兰新建'], b:['official'] },
      ] },
      { t:'bar', cfg:{ xs:['1h','2h','4h','6h','8h'], mode:'group', bw: 22, yfmt: v => fmtCk(v), h: 250,
        series:[
          { name:['GB capacity revenue per nameplate MW','英国每铭牌MW容量收入'], color:'var(--s1)',
            vals:[1,2,4,6,8].map(hh => gbCapGbpKW * interp(M.deratingCurve, hh) * 1000) },
          { name:['Ireland (peer, context only)','爱尔兰（同业，仅背景）'], color:'var(--s6)',
            vals:[1,2,4,6,8].map(hh => ieCapGbpKW * interp(P.derate, hh) * 1000) },
        ] } },
      { t:'cmp', items:[
        { h:['GB — what capacity revenue is for','英国 — 容量收入的作用'], v:fmtPct(gbPerNameplate2h / (gbPerNameplate2h + M.bmRevenueByDur[2]) * 100, 0),
          s:['of a 2h asset’s total revenue: a debt-sizing base underneath a volatile merchant line','占2小时资产总收入的比例：位于波动性市场化收入之下的债务规模基础'] },
        { h:['Ireland — what capacity revenue is for','爱尔兰 — 容量收入的作用'], v:'majority',
          s:['the capacity payment can be the primary revenue line, which changes the whole underwriting frame','容量付费可能成为主要收入来源，这改变了整个承销框架'] },
      ] },
      { t:'why', text:['On identical 2-hour hardware, the Irish capacity mechanism pays roughly ' + fmt1(mult) + '× what the GB mechanism pays per nameplate MW — driven about ' + fmt1(ieCapGbpKW / gbCapGbpKW) + '× by price and ' + fmt1(P.derate[2] / M.deratingCurve[2]) + '× by the de-rating factor. This is the clearest illustration in either dashboard that duration value is set by market design rather than by physics. It also sets the correct expectation for a GB sponsor: do not import Irish capacity assumptions, and do not conclude that GB storage is underpaid — conclude that GB storage is paid through trading and Ireland through capacity, and underwrite the corresponding capability.',
        '在完全相同的2小时硬件上，爱尔兰容量机制按铭牌MW支付的金额约为英国机制的' + fmt1(mult) + '倍 — 其中价格因素约贡献' + fmt1(ieCapGbpKW / gbCapGbpKW) + '倍，折减系数约贡献' + fmt1(P.derate[2] / M.deratingCurve[2]) + '倍。这是两个看板中最清晰的例证：时长价值由市场设计而非物理特性决定。它同时为英国发起人设定了正确预期：不要移植爱尔兰的容量假设，也不要据此断言英国储能报酬过低 — 而应认识到英国通过交易付费、爱尔兰通过容量付费，并据此承销相应的能力。'],
        sig:['Design sets duration value, not physics','时长价值由设计决定，而非物理'] },
      { t:'src', src: SRC.semo, use:['Irish CRM clearing price, awarded capacity and de-rating bands (peer namespace)','爱尔兰容量机制出清价、中标容量与折减档位（同业命名空间）'] },
    ] },

    { t:'g2', cards:[
      // ---- 3. scale ----
      { title:['Scale — the GB sponsor is not competing in the same market size','规模 — 英国发起人并非在同一市场量级中竞争'], badges:['official','peer'], blocks:[
        { t:'kpis', items:[
          { l:['GB operating fleet','英国在运机组'], v:fmt1(O.fleetGW) + '<small> GW</small>', d:['average ' + fmt1(O.fleetAvgHours) + ' h','平均' + fmt1(O.fleetAvgHours) + '小时'], b:['calc'] },
          { l:['Ireland operating fleet','爱尔兰在运机组'], v:fmt1(P.fleetMW / 1000) + '<small> GW</small>', d:['mostly 0.5–2h (peer namespace)','以0.5–2小时为主（同业命名空间）'], b:['peer'] },
          { l:['GB pipeline to 2032 (central)','英国管线至2032（中性）'], v:fmt1(M.buildCentral[7]) + '<small> GW</small>', d:['high case ' + fmt1(M.buildHigh[7]) + ' GW','高情景' + fmt1(M.buildHigh[7]) + 'GW'], b:['forecast'] },
          { l:['Ireland pipeline','爱尔兰管线'], v:fmt1(P.pipelineMW / 1000) + '<small> GW</small>', d:[fmt1(P.pipelineMWh / 1000) + ' GWh across ' + P.pipelineProjects + ' projects','共' + P.pipelineProjects + '个项目，' + fmt1(P.pipelineMWh / 1000) + 'GWh'], b:['peer'] },
        ] },
        { t:'bar', cfg:{ xs:[L(['GB operating','英国在运']), L(['IE operating','爱尔兰在运']), L(['GB 2032 central','英国2032中性']), L(['IE pipeline','爱尔兰管线'])],
          bw: 46, rotX: true, yfmt: v => fmt1(v) + ' GW', labels: true, h: 250,
          series:[{ name:['GW','GW'], color:'var(--s1)', vals:[O.fleetGW, P.fleetMW / 1000, M.buildCentral[7], P.pipelineMW / 1000] }] } },
        { t:'why', text:['Ireland’s ' + fmt1(P.pipelineMW / 1000) + ' GW pipeline sits on a ' + fmt1(P.fleetMW / 1000) + ' GW operating base — a ' + fmt1(P.pipelineMW / P.fleetMW) + '× multiple, against GB’s ' + fmt1(M.buildCentral[7] / O.fleetGW) + '× to 2032. Relative saturation pressure is therefore materially higher in Ireland even though absolute volumes are far smaller. The transferable point is that saturation is a ratio, not a level: a GB sponsor comparing "GW being built" across the two markets will draw exactly the wrong conclusion about which is more competitive.',
          '爱尔兰' + fmt1(P.pipelineMW / 1000) + 'GW的管线建立在' + fmt1(P.fleetMW / 1000) + 'GW的在运基础之上 — 倍数为' + fmt1(P.pipelineMW / P.fleetMW) + '倍，而英国至2032年为' + fmt1(M.buildCentral[7] / O.fleetGW) + '倍。因此尽管绝对规模远小，爱尔兰的相对饱和压力显著更高。可迁移的要点是：饱和度是比率而非水平量；若英国发起人以两地“在建GW数”作比较，将对哪个市场竞争更激烈得出完全相反的结论。'],
          sig:['Saturation is a ratio, not a level','饱和度是比率，而非水平量'] },
      ] },
      // ---- 4. what constrains delivery ----
      { title:['What actually constrains delivery in each market','各市场对交付的真实约束'], badges:['official','peer'], blocks:[
        { t:'table', head:[['Constraint','约束'],['GB','英国'],['Ireland','爱尔兰']], rows:[
          [{b:['Primary','首要约束']}, ['Connection queue position and consent','并网队列位置与规划许可'], ['System non-synchronous penetration and network capacity','非同步电源渗透率与网络容量']],
          [{b:['Measured by','衡量指标']}, ['Gate 2 tranche and TO/DNO works programme','Gate 2批次与输配电运营商工程计划'], ['SNSP limit ' + P.snspNow + '% and ' + fmt1(P.windDispatchDownPct) + '% wind dispatch-down','非同步渗透率上限' + P.snspNow + '%及' + fmt1(P.windDispatchDownPct) + '%风电限发']],
          [{b:['Annual cost of the constraint','约束的年度成本']}, ['Borne as project delay and stranded development cost','以项目延迟及沉没开发成本形式承担'], ['≈€' + fmtN(P.constraintCostEurM) + 'm constraint & curtailment, forecast €' + fmtN(P.constraintForecastEurM) + 'm','约束与弃电成本约€' + fmtN(P.constraintCostEurM) + 'm，预测€' + fmtN(P.constraintForecastEurM) + 'm']],
          [{b:['Storage’s role','储能的角色']}, ['Arbitrage and balancing services in a liquid market','在流动市场中进行套利与提供平衡服务'], ['Enabling higher renewable penetration by absorbing dispatch-down','通过吸纳限发电量支撑更高的新能源渗透']],
          [{b:['Direction of travel','演变方向']}, ['Reform is re-ordering the queue; total capacity is not the binding limit','改革正在重排队列；总容量并非约束上限'], ['Interconnection is growing (' + P.interconnectors.map(x => x[0].split(' ')[0]).join(' + ') + '), which eases constraints and compresses spreads','互联持续增加（' + P.interconnectors.map(x => x[0].split(' ')[0]).join(' + ') + '），缓解约束的同时压缩价差']],
        ] },
        { t:'why', text:['Ireland spends about €' + fmtN(P.constraintCostEurM) + 'm a year on constraint and curtailment — a quantified, published number that storage can directly address, which is why Irish policy supports storage explicitly and pays for it through capacity. GB has no equivalent published prize; its constraint cost is borne as development delay, which nobody invoices and no mechanism reimburses. The transferable discipline: in GB, do not expect a policy payment to appear for solving a congestion problem, because the problem is not priced as one.',
          '爱尔兰每年在网络约束与弃电上支出约€' + fmtN(P.constraintCostEurM) + 'm — 这是一个可量化、已公布、储能可直接应对的数字，因此爱尔兰政策明确支持储能并通过容量机制为其付费。英国没有对应的公开“奖金池”；其约束成本以开发延迟的形式承担，无人开具账单，也没有机制予以补偿。可迁移的纪律是：在英国不应指望因解决拥塞问题而出现政策付费，因为该问题并未被如此定价。'],
          sig:['Only priced problems attract payment','只有被定价的问题才会获得付费'] },
      ] },
    ] },

    // ---- 5. services: the same story twice ----
    { t:'card', title:['System services in both markets — the same saturation story, four years apart','两地系统服务 — 同一饱和故事，相隔四年'], badges:['official','peer'], blocks:[
      { t:'cmp', items:[
        { h:['GB — dynamic response','英国 — 动态响应'], v:'−25% to −30% yoy',
          s:['Batteries clear 97–99% of volume; qualified supply is ' + fmt1(M.services[0].qualMW / M.services[0].reqMW) + '× requirement in Dynamic Containment','电池占成交量97–99%；动态遏制的合格供给为需求的' + fmt1(M.services[0].qualMW / M.services[0].reqMW) + '倍'] },
        { h:['Ireland — DS3 / FASS','爱尔兰 — DS3/FASS'], v:'>' + P.ds3DeclinePct + '% since 2022',
          s:['Effective DS3 revenue already down more than ' + P.ds3DeclinePct + '%; competitive DASSA procurement expected to compress further','有效DS3收入已下降超过' + P.ds3DeclinePct + '%；竞争性DASSA采购预计将进一步压缩'] },
      ] },
      { t:'why', text:['This is the strongest transferable finding in the section, and it works in both directions. Two neighbouring markets with different designs, different regulators and different technologies of scarcity produced the same outcome: batteries captured the ancillary market almost completely, and the revenue collapsed within three to four years of doing so. Treat that as the base rate. Any ancillary-services line in any European storage model should be capped at trailing twelve-month unit revenue with a declining assumption, regardless of how favourable the current auction looks.',
        '这是本节最有力的可迁移结论，且双向适用。两个设计不同、监管方不同、稀缺性技术特征不同的相邻市场，产生了同一结果：电池几乎完全占据辅助服务市场，而收入在此后三至四年内崩塌。应将其视为基准频率。任何欧洲储能模型中的辅助服务收入项，均应以过去12个月单位收入封顶并附加下降假设，无论当前拍卖看起来多么有利。'],
        sig:['Ancillary collapse is the base rate','辅助服务收入崩塌是基准规律'] },
    ] },

    // ---- 6. what transfers ----
    { t:'card', title:['What transfers from Ireland to a GB decision — and what does not','哪些爱尔兰结论可迁移至英国决策 — 哪些不能'], badges:['calc','peer'], blocks:[
      { t:'table', head:[['Verdict','结论'],['Dimension','维度'],['Reasoning','理由']], rows:[
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Ancillary saturation dynamics','辅助服务饱和动态']},
         ['Both markets show batteries taking 90%+ of response volume and unit revenue collapsing within three to four years. Cap the services line accordingly in either market.','两个市场均显示电池占据90%以上的响应成交量，且单位收入在三至四年内崩塌。两地均应据此对服务收入封顶。']],
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Equipment and EPC pricing','设备与EPC价格']},
         ['Cells, PCS, transformers and contractors are procured from the same European and Asian supply chain; Irish and GB capex per kWh move together.','电芯、PCS、变压器与承包商采购自同一欧亚供应链；爱尔兰与英国的每kWh造价同向变动。']],
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Contracted-structure precedent','合同结构先例']},
         ['Tolls, floors and revenue swaps developed in GB are being applied to Irish assets; the documentation and lender expectations are portable.','在英国发展成型的租赁、保底与收益互换正被应用于爱尔兰资产；相关文本与贷款人预期具有可移植性。']],
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Interconnector effect on spreads','互联对价差的影响']},
         ['Greenlink and Celtic will couple the two price areas more tightly, so Irish spread compression is partly a GB-driven phenomenon and vice versa.','Greenlink与Celtic将使两个价区耦合更紧密，因此爱尔兰的价差压缩部分由英国驱动，反之亦然。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Capacity revenue level','容量收入水平']},
         ['Ireland pays roughly ' + fmt1(mult) + '× GB per nameplate MW at 2h. Importing that assumption would overstate GB capacity revenue several times over.','在2小时下爱尔兰按铭牌MW支付约为英国的' + fmt1(mult) + '倍。移植该假设将使英国容量收入被高估数倍。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['De-rating methodology','折减系数方法']},
         ['GB de-rates 2h at ' + fmtPct(M.deratingCurve[2] * 100, 0) + ' and re-cuts it annually; Ireland de-rates the same duration at ' + fmtPct(P.derate[2] * 100, 0) + ' on a smaller, tighter system.','英国对2小时按' + fmtPct(M.deratingCurve[2] * 100, 0) + '折减且逐年下调；爱尔兰在更小更紧的系统上对同一时长按' + fmtPct(P.derate[2] * 100, 0) + '折减。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Route to market','售电路径']},
         ['GB is self-dispatch with a Balancing Mechanism worth 39% of revenue; SEM is centrally scheduled. Trading capability is worth far more in GB.','英国为自调度，平衡机制占收入39%；SEM为集中调度。交易能力在英国的价值远高于爱尔兰。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Connection process','并网流程']},
         ['GB runs a reformed Gate 1 / Gate 2 queue; Ireland runs batch-based connection processes with different evidence and different timing risk.','英国实行改革后的Gate 1/Gate 2排队机制；爱尔兰采用批次制并网流程，其证据要求与时点风险均不相同。']],
      ] },
      { t:'reco', b:['Comparison conclusion: ','对比结论：'],
        text:['Use Ireland to calibrate saturation dynamics, equipment cost and contracted-structure precedent — the supply side and the behavioural side. Do not use it to calibrate capacity revenue, de-rating or route to market — the demand side. An Irish comparable tells you how a storage market behaves once batteries dominate it; only the GB rules tell you what a GB battery will be paid.',
              '应以爱尔兰校准饱和动态、设备成本与合同结构先例 — 即供给侧与行为侧。不应以其校准容量收入、折减系数或售电路径 — 即需求侧。爱尔兰可比市场能说明储能市场在电池占据主导后的行为方式；但只有英国规则能说明英国电池将获得多少报酬。'] },
      { t:'why', text:['This split is the operative rule for the whole section, and it defines the boundary the dashboard enforces in code: SEM figures inform supply-side and behavioural assumptions (capex, saturation pace, contract design) and are excluded from every revenue and scoring input. Applying it the other way round is the specific error this section exists to prevent — importing an Irish capacity price into a GB case would overstate the bankable revenue line by a multiple, which is precisely the line lenders size against.',
        '这一划分是本节的可执行规则，同时界定了看板在代码层面强制执行的边界：SEM数值可用于供给侧与行为侧假设（造价、饱和速度、合同设计），并被排除于所有收入与评分输入之外。反向套用正是本节要防止的具体错误 — 将爱尔兰容量价格引入英国方案，会使可融资收入项被高估数倍，而这恰恰是贷款人据以安排债务规模的那一项。'],
        sig:['Supply side yes, revenue side no','供给侧可用，收入侧不可用'] },
    ] },
  ] };
};
// ============================== PORTFOLIO / FUND VIEW ==============================

  return SEC_B.benchmark;
}
