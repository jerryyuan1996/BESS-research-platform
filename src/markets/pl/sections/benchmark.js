/* Poland — the `benchmark` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O, capEurKW, perNameplate, plMerchantPerMW } = createShared(api);
  const SEC_B = {};

SEC_B.benchmark = function (){
  const P = M.peer;
  const roDamEur = P.dam2025Ron / P.fxRonPerEur;
  const roMerch2h = P.executableSpreadEur * 2 * 0.91 * 1.4 * 365 * 0.96;   // €/MW/yr on Romanian lab assumptions
  const plContracted4h = perNameplate(4);
  return {
  head: ['Poland vs Romania — market design, revenue certainty and what transfers (context only)',
         '波兰与罗马尼亚对比 — 市场设计、收入确定性与可迁移结论（仅背景参考）'],
  cap: ['The only section in this dashboard that uses Romanian data. Poland and Romania are neighbouring CEE markets with similar fundamentals — coal exit, rapid solar growth, rising volatility — that have made opposite choices on revenue certainty. Comparing them isolates what is genuinely Polish. All Romanian figures are held in a separate namespace and excluded from Poland\'s grades and verdicts.',
        '本看板中唯一使用罗马尼亚数据的章节。波兰与罗马尼亚是基本面相近的中东欧邻国 — 煤电退出、光伏快速增长、波动性上升 — 却在收入确定性上作出了相反选择。比较两者可分离出真正属于波兰特有的因素。所有罗马尼亚数值保存在独立命名空间，不计入波兰的评级与结论。'],
  blocks: [
    { t:'note', b:['Scope discipline: ','范围纪律：'],
      text:['Romanian data (Jul 2026) never enters the Polish capacity analysis, price series, pipeline or any scoring input. It is used here for one purpose: to calibrate whether a Polish observation is a Polish phenomenon or a general CEE one — and, specifically, to show what the capacity mechanism is worth by looking at a comparable market that does not have one.',
            '罗马尼亚数据（2026年7月）绝不进入波兰的容量分析、价格序列、管线或任何评分输入。此处使用仅有一个目的：校准某一波兰观察结果究竟是波兰特有现象还是中东欧共性现象 — 并具体地通过观察一个没有容量机制的可比市场，来说明容量机制的价值。'] },

    { t:'card', mt:false, title:['Market design — the same asset earns differently in each market','市场设计 — 同一资产在两个市场的获利方式不同'], badges:['peer'], live:false, blocks:[
      { t:'table', head:[['Feature','特征'],['Poland','波兰'],['Romania','罗马尼亚']], rows:[
        [{b:['Market structure','市场结构']},
         ['Energy market plus a capacity market with long new-build contracts','电能量市场加上设有长期新建合同的容量市场'],
         ['Energy-only, EU-coupled day-ahead and intraday markets','单一电能量，与欧盟耦合的日前及日内市场']],
        [{b:['Capacity payment','容量付费']},
         ['≈' + fmtC(capEurKW) + '/kW de-rated/yr for ' + O.cmAgreementYears + ' years (seed)','约' + fmtC(capEurKW) + '/kW折减/年，期限' + O.cmAgreementYears + '年（种子）'],
         [L(['None — no capacity mechanism exists','无 — 不存在容量机制']), L(['None','无'])]],
        [{b:['Who sets the revenue floor','谁设定收入底线']},
         ['A capacity auction, per project, for ' + O.cmAgreementYears + ' years','由容量拍卖逐项目设定，期限' + O.cmAgreementYears + '年'],
         ['Nobody. Every euro is merchant or balancing.','无人设定。每一欧元均来自市场化或平衡市场。']],
        [{b:['State support','国家支持']},
         ['Capital support alongside capacity contracts — both channels','资本支持与容量合同并行 — 两条通道'],
         ['≈' + fmtCM(P.schemeBudgetEurM * 1e6) + ' capital-grant scheme only — reduces capital at risk','仅约' + fmtCM(P.schemeBudgetEurM * 1e6) + '资本补贴计划 — 降低风险资本']],
        [{b:['Merchant driver','市场化驱动']},
         ['Coal-heavy stack (~' + O.coalSharePct + '%) retiring into rapid solar growth; ' + fmtN(O.negHours) + ' negative-price hours','高煤电占比（约' + O.coalSharePct + '%）退役并遭遇光伏快速增长；负电价' + fmtN(O.negHours) + '小时'],
         ['Solar-driven midday trough and steep evening ramp; day-ahead ≈' + fmtC(roDamEur) + '/MWh','光伏驱动的午间低谷与陡峭晚间爬坡；日前均价约' + fmtC(roDamEur) + '/MWh']],
        [{b:['Executable spread','可执行价差']},
         [fmtC(60) + '/MWh from an ' + fmtC(88) + ' published spread', fmtC(60) + '/MWh，公布价差' + fmtC(88)],
         [fmtC(P.executableSpreadEur) + '/MWh — comparable, despite the different market design', fmtC(P.executableSpreadEur) + '/MWh — 尽管市场设计不同，水平相当']],
        [{b:['Binding constraint','关键约束']},
         ['Connection conditions, which also gate the capacity auction','并网条件，其同时决定能否参与容量拍卖'],
         ['ATR and executed connection agreement','ATR与已签并网合同']],
        [{b:['Lender posture','贷款人态度']},
         ['Capacity contract supports conventional project debt','容量合同可支撑常规项目融资'],
         ['Development-bank-led; gearing constrained by the absence of a floor','以开发性银行为主；因缺乏保底，杠杆受限']],
        [{b:['Dashboard use','看板用途']},
         ['Core Poland score and every other tab','波兰核心评分及其他所有页面'],
         ['This section only — context, never scored','仅本节 — 背景参考，不参与评分']],
      ] },
      { t:'why', text:['The decisive row is "who sets the revenue floor", and the executable-spread row is what makes the comparison so useful: the two markets earn almost the same merchant margin (' + fmtC(60) + ' against ' + fmtC(P.executableSpreadEur) + '/MWh), so the entire difference in financeability comes from the capacity mechanism rather than from the underlying opportunity. That is the cleanest available measurement of what a capacity market is worth to a storage investor.',
        '决定性的一行是“谁设定收入底线”，而可执行价差一行使该对比格外有价值：两个市场获得的市场化margin几乎相同（' + fmtC(60) + '对' + fmtC(P.executableSpreadEur) + '/MWh），因此可融资性上的全部差异来自容量机制，而非来自底层机会本身。这是关于“容量市场对储能投资人价值几何”所能得到的最干净的度量。'],
        sig:['Same margin, different financeability','margin相同，可融资性不同'] },
    ] },

    { t:'card', title:['Revenue certainty compared — what the capacity mechanism is worth','收入确定性对比 — 容量机制值多少'], badges:['verify','peer'], blocks:[
      { t:'kpis', items:[
        { l:['Poland — contracted revenue per nameplate MW (4h)','波兰 — 每铭牌MW合同化收入（4小时）'], v:fmtCk(plContracted4h) + '<small>/MW/yr</small>', d:['for ' + O.cmAgreementYears + ' years','持续' + O.cmAgreementYears + '年'], b:['verify'] },
        { l:['Romania — contracted revenue per nameplate MW','罗马尼亚 — 每铭牌MW合同化收入'], v:fmtC(0) + '<small>/MW/yr</small>', d:['no capacity mechanism exists (peer namespace)','不存在容量机制（同业命名空间）'], b:['peer'] },
        { l:['Poland — merchant revenue per nameplate MW (4h)','波兰 — 每铭牌MW市场化收入（4小时）'], v:'≈' + fmtCk(plMerchantPerMW(4)) + '<small>/MW/yr</small>', d:['gross, before optimiser fee and opex','毛值，未扣除优化商费用与运维'], b:['calc'] },
        { l:['Romania — merchant revenue per nameplate MW (2h)','罗马尼亚 — 每铭牌MW市场化收入（2小时）'], v:'≈' + fmtCk(roMerch2h) + '<small>/MW/yr</small>', d:['comparable executable spread, shorter duration','可执行价差相当，时长更短'], b:['peer'] },
      ] },
      { t:'bar', cfg:{ xs:[L(['PL — contracted','波兰 — 合同化']), L(['PL — merchant','波兰 — 市场化']), L(['RO — contracted','罗马尼亚 — 合同化']), L(['RO — merchant','罗马尼亚 — 市场化'])],
        bw: 44, rotX: true, yfmt: v => fmtCk(v), h: 260,
        series:[{ name:['€/MW/yr','€/MW/年'], color:'var(--s1)', vals:[plContracted4h, plMerchantPerMW(4), 0, roMerch2h] }] } },
      { t:'cmp', items:[
        { h:['Poland — contracted share of gross revenue','波兰 — 合同化收入占毛收入比重'], v:fmtPct(plContracted4h / (plContracted4h + plMerchantPerMW(4)) * 100, 0),
          s:['enough to support conventional project debt and pension-backed buyers at exit','足以支撑常规项目融资，并在退出时对接养老金支持的买家'] },
        { h:['Romania — contracted share of gross revenue','罗马尼亚 — 合同化收入占毛收入比重'], v:'0%',
          s:['gearing is constrained by structure, not by asset quality','杠杆受限于结构而非资产质量'] },
      ] },
      { t:'why', text:['This is the most decision-relevant comparison in either CEE dashboard. The same battery, in two neighbouring markets with comparable executable spreads, is a contracted infrastructure asset on one side of the border and a merchant asset on the other. The consequence is not that Polish returns are higher — Romanian equity returns can exceed Polish ones — but that the Polish asset has a wider buyer universe and a lower cost of debt. For a Polish sponsor the practical reading is that the auction, not the site, is where value is created.',
        '这是两个中东欧看板中最具决策相关性的对比。同一台电池，在可执行价差相当的两个相邻市场中，边境这一侧是合同化基础设施资产，另一侧则是市场化资产。其后果并非波兰收益更高 — 罗马尼亚的股权回报可能超过波兰 — 而是波兰资产拥有更广的买家群体与更低的债务成本。对波兰发起人而言，实务解读是：价值创造发生在拍卖，而非场址。'],
        sig:['Value is created at the auction','价值创造发生在拍卖'] },
      { t:'src', src: SRC.opcom, use:['Romanian market design, price levels and support scheme (peer namespace)','罗马尼亚市场设计、价格水平与支持机制（同业命名空间）'] },
    ] },

    { t:'g2', cards:[
      { title:['Scale and fundamentals — same problem, different size','规模与基本面 — 问题相同，量级不同'], badges:['illus','peer'], blocks:[
        { t:'kpis', items:[
          { l:['Poland operating fleet (seed)','波兰在运机组（种子）'], v:fmtN(O.fleetMW) + '<small> MW</small>', d:[fmtN(O.fleetMWh) + ' MWh','' + fmtN(O.fleetMWh) + 'MWh'], b:['illus'] },
          { l:['Romania operating fleet','罗马尼亚在运机组'], v:fmtN(P.fleetMW) + '<small> MW</small>', d:[fmtN(P.fleetMWh) + ' MWh (peer namespace)','' + fmtN(P.fleetMWh) + 'MWh（同业命名空间）'], b:['peer'] },
          { l:['Poland contracted storage','波兰已签约储能'], v:fmt1(O.cmAwardedBessGW) + '<small> GW</small>', d:['obliged to connect','负有并网义务'], b:['verify'] },
          { l:['Romania authorisations, one meeting','罗马尼亚单次会议许可'], v:fmtN(P.authFeb2026MW) + '<small> MW</small>', d:['permits, not obligations','是许可，而非义务'], b:['peer'] },
        ] },
        { t:'why', text:['The two pipeline figures look similar in spirit and are completely different in kind. Poland’s ' + fmt1(O.cmAwardedBessGW) + ' GW carries a contractual obligation to deliver; Romania’s ' + fmtN(P.authFeb2026MW) + ' MW of authorisations carries permission to develop. When comparing competitive pressure across the two markets, weight by obligation rather than by announcement — otherwise the market with weaker commitments will look more crowded than the one where competitors are legally bound to arrive.',
          '两个管线数字在表面上相似，本质上却完全不同。波兰的' + fmt1(O.cmAwardedBessGW) + 'GW带有合同交付义务；罗马尼亚的' + fmtN(P.authFeb2026MW) + 'MW许可带有的是开发许可。跨市场比较竞争压力时，应按义务而非按公告加权 — 否则承诺较弱的市场反而会显得比竞争者有法律义务到场的市场更拥挤。'],
          sig:['Weight by obligation, not announcement','按义务加权，而非按公告'] },
      ] },
      { title:['Where value is created in each market','各市场的价值创造环节'], badges:['calc','peer'], blocks:[
        { t:'table', head:[['Stage','阶段'],['Poland','波兰'],['Romania','罗马尼亚']], rows:[
          [{b:['Connection','并网']}, ['Necessary, and gates the auction','必要条件，且决定拍卖准入'], ['Necessary, and is the whole asset','必要条件，且即是全部资产']],
          [{b:['Auction / award','拍卖或授予']}, ['Where value is created — clear or not clear','价值创造环节 — 出清与否'], ['No equivalent stage exists','不存在对应阶段']],
          [{b:['Grant / capital support','补贴或资本支持']}, ['Improves returns; not the core of the case','改善收益；非投资逻辑核心'], ['Improves returns; the only state support available','改善收益；唯一可得的国家支持']],
          [{b:['Duration decision','时长决策']}, ['Driven by the correction factor and the obligation','由折减系数与容量义务驱动'], ['Driven by arbitrage and grant eligibility alone','仅由套利与补贴资格驱动']],
          [{b:['Exit buyer','退出买家']}, ['Conventional infrastructure and pension capital','常规基础设施与养老金资本'], ['Merchant buyers, until a bilateral floor is negotiated','市场化买家，直至谈成双边保底']],
        ] },
        { t:'why', text:['Read down the table and the strategic conclusion is clear: in Poland a sponsor should organise the whole development programme around the auction calendar, because that is the single event that converts a development asset into an infrastructure asset. In Romania there is no such event, so the equivalent step must be manufactured through a bilateral floor or tolling arrangement. A Polish sponsor moving into Romania will systematically underestimate how much work that manufacturing takes.',
          '通读该表，战略结论清晰可见：在波兰，发起人应围绕拍卖日历组织整个开发计划，因为那是把开发资产转化为基础设施资产的唯一事件。在罗马尼亚不存在这样的事件，因此必须通过双边保底或代工安排人为构造出等效步骤。由波兰进入罗马尼亚的发起人，会系统性低估构造该步骤所需的工作量。'],
          sig:['Organise development around the auction','围绕拍卖组织开发工作'] },
      ] },
    ] },

    { t:'card', title:['What transfers from Romania to a Polish decision — and what does not','哪些罗马尼亚结论可迁移至波兰决策 — 哪些不能'], badges:['calc','peer'], blocks:[
      { t:'table', head:[['Verdict','结论'],['Dimension','维度'],['Reasoning','理由']], rows:[
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Executable-spread methodology','可执行价差方法']},
         ['Both markets lose roughly a third of the published spread to liquidity, efficiency, availability and fees. The bridge structure is identical and the result is comparable (' + fmtC(60) + ' vs ' + fmtC(P.executableSpreadEur) + '/MWh).','两个市场均因流动性、效率、可用率与费用损失约三分之一的公布价差。桥接结构完全相同，结果亦相当（' + fmtC(60) + '对' + fmtC(P.executableSpreadEur) + '/MWh）。']],
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Solar saturation trajectory','光伏饱和轨迹']},
         ['Both systems are adding solar into a retiring thermal stack, producing the same midday trough and evening ramp shape on different timetables.','两个系统均在退役火电结构中加入光伏，形成相同的午间低谷与晚间爬坡形态，只是时间表不同。']],
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Balancing saturation pattern','平衡市场饱和模式']},
         ['aFRR capacity prices decline as qualified supply grows in both markets — the same pattern as GB and Ireland, arriving later in CEE.','两个市场的aFRR容量价格均随合格供给增加而下降 — 与英国、爱尔兰模式相同，只是在中东欧出现较晚。']],
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Documentary diligence discipline','文件尽调纪律']},
         ['Both markets fail on evidence rather than on analysis: a map, an authorisation or an application is never a project in either jurisdiction.','两个市场的失败均源于证据而非分析：在任一辖区，地图、许可或申请都不构成项目。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Revenue certainty and gearing','收入确定性与杠杆']},
         ['A ' + O.cmAgreementYears + '-year capacity contract underpins Polish project debt. Romania has no equivalent, so Romanian gearing assumptions understate what a Polish asset supports.','' + O.cmAgreementYears + '年容量合同支撑波兰的项目融资。罗马尼亚没有对应机制，因此罗马尼亚的杠杆假设会低估波兰资产的支撑能力。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Duration economics','时长经济性']},
         ['Polish correction factors pay a discrete step for the third and fourth hours; in Romania duration must earn its capex from arbitrage and grant eligibility alone.','波兰的折减系数为第三、第四小时支付离散阶跃；在罗马尼亚，时长必须仅靠套利与补贴资格偿付造价。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['The obligation risk','义务风险']},
         ['A Polish capacity contract is a ' + O.cmAgreementYears + '-year delivery obligation with penalties. Romania has no analogous liability, so a Romanian model contains no equivalent stress case.','波兰的容量合同是附带罚则的' + O.cmAgreementYears + '年交付义务。罗马尼亚没有类似负债，因此罗马尼亚模型中不含对应的压力情景。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Competitive weighting','竞争加权']},
         ['Polish competitors hold contracts obliging them to connect; Romanian competitors hold permits that mostly will not convert. Weighting them the same way misstates both markets.','波兰的竞争者持有负有并网义务的合同；罗马尼亚的竞争者持有大多不会转化的许可。以同样方式加权将同时误判两个市场。']],
      ] },
      { t:'reco', b:['Comparison conclusion: ','对比结论：'],
        text:['Use Romania to calibrate executable-spread methodology, solar-saturation trajectory, balancing behaviour and documentary diligence discipline — the analytical and physical side. Do not use it to calibrate revenue certainty, gearing, duration economics or competitive weighting — the contractual side. A Romanian comparable tells you how a CEE storage market behaves physically; only the Polish capacity mechanism tells you how much of that behaviour anyone will lend against.',
              '应以罗马尼亚校准可执行价差方法、光伏饱和轨迹、平衡市场行为与文件尽调纪律 — 即分析侧与物理侧。不应以其校准收入确定性、杠杆、时长经济性或竞争加权 — 即合同侧。罗马尼亚可比市场能说明中东欧储能市场的物理行为方式；但只有波兰的容量机制能说明这些行为中有多少可供任何人放贷。'] },
      { t:'why', text:['This split is the operative rule for the whole section and it defines the boundary the dashboard enforces in code: Romanian figures inform analytical and physical assumptions and are excluded from every revenue and scoring input. The specific error this section exists to prevent runs in both directions — importing Romanian gearing into a Polish case wastes the capacity contract, and exporting Polish gearing into a Romanian case produces a structure that cannot be financed.',
        '这一划分是本节的可执行规则，同时界定了看板在代码层面强制执行的边界：罗马尼亚数值可用于分析侧与物理侧假设，并被排除于所有收入与评分输入之外。本节要防止的具体错误是双向的 — 将罗马尼亚的杠杆引入波兰方案会浪费容量合同，而将波兰的杠杆输出至罗马尼亚方案则会产生无法融资的结构。'],
        sig:['Analytical side yes, contractual side no','分析侧可用，合同侧不可用'] },
    ] },
  ] };
};
// ============================== PORTFOLIO / FUND VIEW ==============================

  return SEC_B.benchmark;
}
