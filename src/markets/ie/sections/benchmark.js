/* Ireland — the `benchmark` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O, perNameplate, ieMerchantPerMW } = createShared(api);
  const SEC_B = {};

SEC_B.benchmark = function (){
  const P = M.peer, fx = P.fxEurPerGbp;
  const gbCapEurKW = P.cmPriceGbpKW * fx;                       // £/kW → €/kW
  const iePerNameplate2h = perNameplate(2);                     // €/MW/yr
  const gbPerNameplate2h = gbCapEurKW * P.derate[2] * 1000;     // €/MW/yr
  const mult = iePerNameplate2h / gbPerNameplate2h;
  const gbRealised2hEur = P.realised2hGbp * fx;
  return {
  head: ['Ireland vs Great Britain — market design, capacity economics and what transfers (context only)',
         '爱尔兰与英国对比 — 市场设计、容量经济性与可迁移结论（仅背景参考）'],
  cap: ['The only section in this dashboard that uses GB data. Ireland and GB are neighbouring, interconnected, similarly regulated markets that nevertheless reward storage through structurally different mechanisms. Comparing them isolates what is genuinely Irish. All GB figures are held in a separate namespace and excluded from Ireland\'s grades and verdicts.',
        '本看板中唯一使用英国数据的章节。爱尔兰与英国相邻、互联且监管体系相近，但两者奖励储能的机制存在结构性差异。比较两者可分离出真正属于爱尔兰特有的因素。所有英国数值保存在独立命名空间，不计入爱尔兰的评级与结论。'],
  blocks: [
    { t:'note', b:['Scope discipline: ','范围纪律：'],
      text:['GB data (Jul 2026) covers England, Scotland and Wales only. It never enters the Irish capacity balance, the Irish pipeline, the de-rating tables or any scoring input. It is used here for one purpose: to calibrate whether an Irish observation is an Irish problem or a general storage-market problem. Northern Ireland is inside SEM and is therefore treated as Ireland throughout this dashboard, not as GB.',
            '英国数据（2026年7月）仅覆盖英格兰、苏格兰与威尔士。其绝不进入爱尔兰容量平衡、爱尔兰管线、折减系数表或任何评分输入。此处使用仅有一个目的：校准某一爱尔兰观察结果究竟是爱尔兰特有问题，还是储能市场的普遍问题。北爱尔兰属于SEM，因此在本看板中全篇按爱尔兰处理，而非按英国处理。'] },

    { t:'card', mt:false, title:['Market design — the same asset earns differently in each market','市场设计 — 同一资产在两个市场的获利方式不同'], badges:['peer'], live:false, blocks:[
      { t:'table', head:[['Feature','特征'],['Ireland — SEM','爱尔兰 — SEM'],['Great Britain','英国']], rows:[
        [{b:['Market structure','市场结构']},
         ['Gross-pool all-island market with mandatory central scheduling plus a Capacity Remuneration Mechanism','全岛总电量池市场，强制集中调度，配套容量报酬机制'],
         ['Energy-only wholesale with self-dispatch, a bolt-on Capacity Market and a deep Balancing Mechanism','单一电能量批发市场，自调度，附加容量市场及深度平衡机制']],
        [{b:['Capacity payment level','容量付费水平']},
         [fmtC(O.crmPrice) + '/kW de-rated/yr (T-4 DY ' + O.crmDY + ')', fmtC(O.crmPrice) + '/kW折减/年（T-4，交付年' + O.crmDY + '）'],
         ['£' + fmt1(P.cmPriceGbpKW) + '/kW de-rated/yr ≈ ' + fmtC(gbCapEurKW) + ' (T-4 DY ' + P.cmDY + ')','£' + fmt1(P.cmPriceGbpKW) + '/kW折减/年 ≈ ' + fmtC(gbCapEurKW) + '（T-4，交付年' + P.cmDY + '）']],
        [{b:['2-hour de-rating factor','2小时折减系数']},
         [fmtPct(M.deratingCurve[2] * 100, 0) + ' — a small, tight system values short duration more', fmtPct(M.deratingCurve[2] * 100, 0) + ' — 系统小而紧，短时长价值更高'],
         [fmtPct(P.derate[2] * 100, 0) + ' — re-cut downward each auction vintage', fmtPct(P.derate[2] * 100, 0) + ' — 每个拍卖年份继续下调']],
        [{b:['Agreement length (new build)','新建协议年限']},
         [O.crmAgreementYears + ' years', O.crmAgreementYears + '年'],
         [P.cmAgreementYears + ' years, index-linked', P.cmAgreementYears + '年，与通胀挂钩']],
        [{b:['Capacity obligation','容量义务']},
         ['Reliability Option — difference payments owed above the strike price','可靠性期权 — 电价高于执行价时须支付差价'],
         ['Availability obligation with penalties during System Stress Events','系统紧张事件期间的可用性义务及相应罚则']],
        [{b:['Where merchant value comes from','市场化价值来源']},
         ['Wide day-ahead spreads (' + fmtC(O.daSpread) + '/MWh published) but only ' + fmtC(59) + ' executable','日前价差宽（公布' + fmtC(O.daSpread) + '/MWh），但仅' + fmtC(59) + '可执行'],
         ['Balancing Mechanism ' + P.bmSharePct + '% of revenue; realised 2h ≈ ' + fmtCk(gbRealised2hEur) + '/MW/yr','平衡机制占收入' + P.bmSharePct + '%；2小时实际收入约' + fmtCk(gbRealised2hEur) + '/MW/年']],
        [{b:['Binding constraint','关键约束']},
         ['Physical — SNSP limit ' + O.snspNow + '% and ' + fmt1(O.windDispatchDownPct) + '% wind dispatch-down','物理性 — 非同步渗透率上限' + O.snspNow + '%及' + fmt1(O.windDispatchDownPct) + '%风电限发'],
         ['Administrative — connection queue position and consent','行政性 — 并网队列位置与规划许可']],
        [{b:['Dashboard use','看板用途']},
         ['Core Ireland score and every other tab','爱尔兰核心评分及其他所有页面'],
         ['This section only — context, never scored','仅本节 — 背景参考，不参与评分']],
      ] },
      { t:'why', text:['The rows that matter to a capital allocator are the capacity payment and the constraint row. Ireland pays a large, auction-set capacity price into a small, physically constrained market; GB pays a small, auction-set capacity price into a large, liquid market where the constraint is administrative. That difference explains why Ireland rewards de-rated capacity and dispatchability while GB rewards trading capability and connection position — and why an Irish track record does not transfer directly to a GB case, or the reverse.',
        '对资本配置者而言最关键的两行是容量付费与约束条件。爱尔兰在一个规模小、受物理约束的市场中支付较高的、由拍卖决定的容量价格；英国则在一个规模大、流动性好、约束为行政性的市场中支付较低的容量价格。这一差异解释了为何爱尔兰奖励折减后容量与可调度性，而英国奖励交易能力与并网位置 — 也解释了为何爱尔兰的业绩记录无法直接迁移至英国方案，反之亦然。'],
        sig:['IE: capacity & dispatch · GB: trading & queue','爱尔兰看容量与调度·英国看交易与队列'] },
    ] },

    { t:'card', title:['Capacity economics compared — the single largest structural difference','容量经济性对比 — 最大的单一结构性差异'], badges:['official','peer'], blocks:[
      { t:'kpis', items:[
        { l:['Ireland capacity revenue per nameplate MW (2h)','爱尔兰每铭牌MW容量收入（2小时）'], v:fmtCk(iePerNameplate2h) + '<small>/MW/yr</small>',
          d:[fmtC(O.crmPrice) + '/kW × ' + fmtPct(M.deratingCurve[2] * 100, 0), fmtC(O.crmPrice) + '/kW × ' + fmtPct(M.deratingCurve[2] * 100, 0)], b:['official'] },
        { l:['GB capacity revenue per nameplate MW (2h)','英国每铭牌MW容量收入（2小时）'], v:'≈' + fmtCk(gbPerNameplate2h) + '<small>/MW/yr</small>',
          d:['£' + fmt1(P.cmPriceGbpKW) + '/kW × ' + fmtPct(P.derate[2] * 100, 0) + ' (peer namespace)','£' + fmt1(P.cmPriceGbpKW) + '/kW × ' + fmtPct(P.derate[2] * 100, 0) + '（同业命名空间）'], b:['peer'] },
        { l:['Ireland / GB multiple','爱尔兰对英国倍数'], v:fmt1(mult) + '<small>×</small>', d:['on identical 2-hour nameplate MW','在同样的2小时铭牌MW上'], b:['calc'] },
        { l:['Agreement length','协议年限'], v:O.crmAgreementYears + ' / ' + P.cmAgreementYears + '<small> yr</small>', d:['Ireland / GB new-build','爱尔兰/英国新建'], b:['official'] },
      ] },
      { t:'bar', cfg:{ xs:['1h','2h','4h','6h','8h'], mode:'group', bw: 22, yfmt: v => fmtCk(v), h: 250,
        series:[
          { name:['Ireland capacity revenue per nameplate MW','爱尔兰每铭牌MW容量收入'], color:'var(--s1)',
            vals:[1,2,4,6,8].map(hh => O.crmPrice * interp(M.deratingCurve, hh) * 1000) },
          { name:['GB (peer, context only)','英国（同业，仅背景）'], color:'var(--s6)',
            vals:[1,2,4,6,8].map(hh => gbCapEurKW * interp(P.derate, hh) * 1000) },
        ] } },
      { t:'cmp', items:[
        { h:['Ireland — capacity as a share of a 4h asset’s gross revenue','爱尔兰 — 容量占4小时资产毛收入比重'],
          v: fmtPct(perNameplate(4) / (perNameplate(4) + ieMerchantPerMW(4)) * 100, 0),
          s:['the capacity mechanism can be the primary revenue line — unusual in Europe','容量机制可成为主要收入来源 — 在欧洲并不常见'] },
        { h:['GB — capacity as a share of a 2h asset’s gross revenue','英国 — 容量占2小时资产毛收入比重'],
          v: fmtPct(gbPerNameplate2h / (gbPerNameplate2h + gbRealised2hEur) * 100, 0),
          s:['a debt-sizing base underneath a volatile merchant line','位于波动性市场化收入之下的债务规模基础'] },
      ] },
      { t:'why', text:['On identical 2-hour hardware, the Irish mechanism pays roughly ' + fmt1(mult) + '× what the GB mechanism pays per nameplate MW — about ' + fmt1(gbCapEurKW ? O.crmPrice / gbCapEurKW : 0) + '× from price and ' + fmt1(M.deratingCurve[2] / P.derate[2]) + '× from the de-rating factor. This is the clearest illustration in either dashboard that duration value is set by market design rather than by physics. The correct conclusion for an Irish sponsor is not that GB underpays, but that the two markets buy different products: Ireland buys firm capacity, GB buys flexibility.',
        '在完全相同的2小时硬件上，爱尔兰机制按铭牌MW支付的金额约为英国机制的' + fmt1(mult) + '倍 — 其中价格因素约贡献' + fmt1(gbCapEurKW ? O.crmPrice / gbCapEurKW : 0) + '倍，折减系数约贡献' + fmt1(M.deratingCurve[2] / P.derate[2]) + '倍。这是两个看板中最清晰的例证：时长价值由市场设计而非物理特性决定。对爱尔兰发起人而言，正确结论并非“英国给付过低”，而是两个市场购买的是不同产品：爱尔兰购买可靠容量，英国购买灵活性。'],
        sig:['Different products, not different prices','是不同产品，而非不同价格'] },
      { t:'src', src: SRC.neso, use:['GB clearing price and de-rating factors (peer namespace)','英国出清价与折减系数（同业命名空间）'] },
    ] },

    { t:'g2', cards:[
      { title:['Scale and saturation — a ratio, not a level','规模与饱和 — 是比率而非水平量'], badges:['official','peer'], blocks:[
        { t:'kpis', items:[
          { l:['Ireland operating fleet','爱尔兰在运机组'], v:fmt1(O.fleetMW / 1000) + '<small> GW</small>', d:['pipeline ' + fmt1(O.pipelineMW / 1000) + ' GW = ' + fmt1(O.pipelineMW / O.fleetMW) + '×','管线' + fmt1(O.pipelineMW / 1000) + 'GW = ' + fmt1(O.pipelineMW / O.fleetMW) + '倍'], b:['illus'] },
          { l:['GB operating fleet','英国在运机组'], v:fmt1(P.fleetGW) + '<small> GW</small>', d:['central 2030 path ' + fmt1(P.buildCentral2030GW) + ' GW = ' + fmt1(P.buildCentral2030GW / P.fleetGW) + '×','中性2030路径' + fmt1(P.buildCentral2030GW) + 'GW = ' + fmt1(P.buildCentral2030GW / P.fleetGW) + '倍'], b:['peer'] },
          { l:['Ireland fleet duration','爱尔兰在运时长'], v:'0.5–2<small> h</small>', d:['built for DS3 tariffs','为DS3费率而建'], b:['illus'] },
          { l:['GB fleet duration','英国在运时长'], v:fmt1(P.fleetAvgHours) + '<small> h</small>', d:['built for frequency response','为调频响应而建'], b:['peer'] },
        ] },
        { t:'bar', cfg:{ xs:[L(['IE operating','爱尔兰在运']), L(['IE pipeline','爱尔兰管线']), L(['GB operating','英国在运']), L(['GB 2030 central','英国2030中性'])],
          bw: 46, rotX: true, yfmt: v => fmt1(v) + ' GW', labels: true, h: 250,
          series:[{ name:['GW','GW'], color:'var(--s1)', vals:[O.fleetMW / 1000, O.pipelineMW / 1000, P.fleetGW, P.buildCentral2030GW] }] } },
        { t:'why', text:['Ireland’s pipeline is ' + fmt1(O.pipelineMW / O.fleetMW) + '× its operating fleet against GB’s ' + fmt1(P.buildCentral2030GW / P.fleetGW) + '× to 2030, so relative saturation pressure is materially higher in Ireland even though absolute volumes are six to ten times smaller. But the Irish pipeline is filtered by connection capacity rather than by capital, so the ratio overstates realistic competition. The transferable point is that saturation is a ratio and a gate-weighted one — comparing raw GW across the two markets gives exactly the wrong answer about which is more competitive.',
          '爱尔兰的管线为其在运机组的' + fmt1(O.pipelineMW / O.fleetMW) + '倍，而英国至2030年为' + fmt1(P.buildCentral2030GW / P.fleetGW) + '倍，因此尽管绝对规模小六至十倍，爱尔兰的相对饱和压力显著更高。但爱尔兰管线受并网容量而非资本筛选，故该比率高估了现实竞争。可迁移的要点是：饱和度是比率，且须按门槛加权 — 直接比较两地的原始GW数将对哪个市场竞争更激烈得出完全错误的答案。'],
          sig:['Saturation is a gate-weighted ratio','饱和度是按门槛加权的比率'] },
      ] },
      { title:['Route to market — self-dispatch versus central scheduling','售电路径 — 自调度与集中调度之别'], badges:['official','peer'], blocks:[
        { t:'table', head:[['Dimension','维度'],['Ireland','爱尔兰'],['GB','英国']], rows:[
          [{b:['Scheduling','调度']}, ['Mandatory central scheduling','强制集中调度'], ['Self-dispatch with a residual Balancing Mechanism','自调度，配套剩余性平衡机制']],
          [{b:['Value of trading skill','交易能力的价值']}, ['Moderate — parameterisation matters more than positioning','中等 — 参数设置比头寸布局更重要'], ['High — ' + fmtPct((P.realisedRatio.strong / P.realisedRatio.weak - 1) * 100, 0) + '% spread between strong and weak optimisers','高 — 优秀与落后优化商之间相差' + fmtPct((P.realisedRatio.strong / P.realisedRatio.weak - 1) * 100, 0) + '%']],
          [{b:['Main execution loss','主要执行损失']}, ['Dispatch, SNSP and constraint access','调度、SNSP与网络约束准入'], ['Forecast error and a ' + fmtPct(P.skipRate * 100, 0) + ' BM skip rate','预测误差与' + fmtPct(P.skipRate * 100, 0) + '的平衡机制跳过率']],
          [{b:['Recent structural change','近期结构性变化']}, ['SDP-02 scheduling integration, Nov 2025','SDP-02调度整合，2025年11月'], ['Platform reform improving BM access','平台改革改善平衡机制准入']],
          [{b:['What a sponsor should buy','发起人应购买什么']}, ['Connection rights and duration','并网权利与时长'], ['Queue position and trading capability','队列位置与交易能力']],
        ] },
        { t:'why', text:['Central scheduling caps the upside from trading skill but also caps the downside, which is why the Irish realised-revenue distribution is narrower than GB’s. For an investor that changes what to pay for: in GB the optimiser contract is the document that most changes the investment case; in Ireland it is the connection agreement. A sponsor porting a GB diligence checklist into Ireland will over-scrutinise the trading arrangements and under-scrutinise MEC and MIC.',
          '集中调度限制了交易能力的上行空间，但同时也限制了下行风险，这正是爱尔兰实际收入分布比英国更窄的原因。对投资人而言，这改变了应为何付费：在英国，最能改变投资结论的文件是优化商合同；在爱尔兰则是并网协议。若发起人将英国的尽调清单直接移植至爱尔兰，将过度审视交易安排，而对MEC与MIC审视不足。'],
          sig:['Different document decides the case','决定投资结论的文件不同'] },
      ] },
    ] },

    { t:'card', title:['System services in both markets — the same saturation story, four years apart','两地系统服务 — 同一饱和故事，相隔四年'], badges:['official','peer'], blocks:[
      { t:'cmp', items:[
        { h:['Ireland — DS3 / FASS','爱尔兰 — DS3/FASS'], v:'>' + O.ds3DeclinePct + '% since 2022',
          s:['Administered tariffs cut repeatedly; competitive DASSA procurement still to come','行政费率屡次下调；竞争性DASSA采购尚未落地'] },
        { h:['GB — dynamic response','英国 — 动态响应'], v: P.servicesYoyPct[0] + '% to ' + P.servicesYoyPct[1] + '% yoy',
          s:['Batteries clear 97–99% of dynamic volume; qualified supply several times requirement','电池占动态类成交量97–99%；合格供给数倍于需求'] },
      ] },
      { t:'why', text:['This is the strongest transferable finding in the section, and it works in both directions. Two neighbouring markets with different designs, different regulators and different technologies of scarcity produced the same outcome: batteries captured the ancillary market almost completely, and the revenue collapsed within three to four years of doing so. Treat that as the base rate. Any system-services line in any European storage model should be capped at trailing twelve-month unit revenue with a declining assumption, regardless of how favourable the current tariff or auction looks.',
        '这是本节最有力的可迁移结论，且双向适用。两个设计不同、监管方不同、稀缺性技术特征不同的相邻市场，产生了同一结果：电池几乎完全占据辅助服务市场，而收入在此后三至四年内崩塌。应将其视为基准频率。任何欧洲储能模型中的系统服务收入项，均应以过去12个月单位收入封顶并附加下降假设，无论当前费率或拍卖看起来多么有利。'],
        sig:['Ancillary collapse is the base rate','辅助服务收入崩塌是基准规律'] },
    ] },

    { t:'card', title:['What transfers from GB to an Irish decision — and what does not','哪些英国结论可迁移至爱尔兰决策 — 哪些不能'], badges:['calc','peer'], blocks:[
      { t:'table', head:[['Verdict','结论'],['Dimension','维度'],['Reasoning','理由']], rows:[
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Ancillary saturation dynamics','辅助服务饱和动态']},
         ['Both markets show batteries taking 90%+ of response volume and unit revenue collapsing within three to four years. Cap the services line accordingly in either market.','两个市场均显示电池占据90%以上的响应成交量，且单位收入在三至四年内崩塌。两地均应据此对服务收入封顶。']],
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Equipment and EPC pricing','设备与EPC价格']},
         ['Cells, PCS, transformers and contractors come from the same supply chain; GB volumes set the pricing that Irish projects also pay.','电芯、PCS、变压器与承包商来自同一供应链；英国的采购量决定了爱尔兰项目同样承担的价格。']],
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Contracted-structure documentation','合同结构文本']},
         ['Tolls at ≈' + fmtCk(P.tollGbpMWyr * fx) + '/MW/yr, floors at ≈' + fmtCk(P.floorGbpMWyr * fx) + ' and multi-year revenue swaps were developed in GB; the documentation and lender expectations are portable.','GB发展出约' + fmtCk(P.tollGbpMWyr * fx) + '/MW/年的租赁、约' + fmtCk(P.floorGbpMWyr * fx) + '的保底及多年期收益互换；相关文本与贷款人预期具有可移植性。']],
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Interconnector coupling effect','互联耦合效应']},
         ['Greenlink and Celtic couple the price areas more tightly, so GB spread behaviour increasingly predicts Irish spread behaviour.','Greenlink与Celtic使两个价区耦合更紧密，因此英国的价差行为日益能够预测爱尔兰的价差行为。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Capacity revenue level','容量收入水平']},
         ['Ireland pays roughly ' + fmt1(mult) + '× GB per nameplate MW at 2h. Applying GB capacity assumptions in Ireland would understate the primary revenue line several times over.','在2小时下爱尔兰按铭牌MW支付约为英国的' + fmt1(mult) + '倍。在爱尔兰套用英国容量假设，将使主要收入线被低估数倍。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Capacity obligation structure','容量义务结构']},
         ['Ireland’s Reliability Option creates difference payments in high-price years; GB’s availability obligation creates stress-event penalties. These are different risks requiring different stress cases.','爱尔兰的可靠性期权在高电价年份产生差价支付；英国的可用性义务在紧张事件中产生罚金。两者是不同风险，需要不同的压力情景。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Value of trading capability','交易能力的价值']},
         ['GB self-dispatch rewards optimiser skill by up to ' + fmtPct((P.realisedRatio.strong / P.realisedRatio.weak - 1) * 100, 0) + '%; Irish central scheduling compresses that dispersion substantially.','英国的自调度机制使优化能力价值最高可达' + fmtPct((P.realisedRatio.strong / P.realisedRatio.weak - 1) * 100, 0) + '%；爱尔兰的集中调度大幅压缩了该离散度。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Connection process and evidence','并网流程与证据']},
         ['GB runs a reformed Gate 1 / Gate 2 queue; Ireland requires an executed connection agreement with both MEC and MIC — a GB checklist omits the MIC test entirely.','英国实行改革后的Gate 1/Gate 2排队机制；爱尔兰要求同时载明MEC与MIC的已签并网协议 — 英国的清单完全遗漏了MIC检验。']],
      ] },
      { t:'reco', b:['Comparison conclusion: ','对比结论：'],
        text:['Use GB to calibrate saturation dynamics, equipment cost, contracted-structure documentation and spread behaviour — the supply side and the behavioural side. Do not use it to calibrate capacity revenue, capacity obligations, trading upside or connection evidence — the demand side and the legal side. A GB comparable tells you how a storage market behaves once batteries dominate it; only the Irish rules tell you what an Irish battery will be paid, and what it will owe.',
              '应以英国校准饱和动态、设备成本、合同结构文本与价差行为 — 即供给侧与行为侧。不应以其校准容量收入、容量义务、交易上行空间或并网证据 — 即需求侧与法律侧。英国可比市场能说明储能市场在电池占据主导后的行为方式；但只有爱尔兰规则能说明爱尔兰电池将获得多少报酬，以及将负有何种义务。'] },
      { t:'why', text:['This split is the operative rule for the whole section, and it defines the boundary the dashboard enforces in code: GB figures inform supply-side and behavioural assumptions and are excluded from every revenue and scoring input. Applying it the other way round is the specific error this section exists to prevent — importing a GB capacity assumption into an Irish case would understate the single largest and most bankable revenue line, which is exactly the line lenders size against here.',
        '这一划分是本节的可执行规则，同时界定了看板在代码层面强制执行的边界：英国数值可用于供给侧与行为侧假设，并被排除于所有收入与评分输入之外。反向套用正是本节要防止的具体错误 — 将英国的容量假设引入爱尔兰方案，会低估最大且最可融资的单一收入线，而这恰恰是当地贷款人据以安排债务规模的那一项。'],
        sig:['Supply side yes, revenue side no','供给侧可用，收入侧不可用'] },
    ] },
  ] };
};
// ============================== PORTFOLIO / FUND VIEW ==============================

  return SEC_B.benchmark;
}
