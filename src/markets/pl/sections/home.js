/* Poland — the `home` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O, capEurKW, perNameplate, plMerchantPerMW } = createShared(api);
  const SEC_B = {};

SEC_B.home = function (){
  const dni = liveScore('durFactors');
  const dband = bandFor(M.durBands, dni);
  const cod = state.codYear, cc = M.codCases[cod] || M.codCases[2029];
  return {
  warn: M.seedWarn,
  blocks: [
    { t:'card', mt:false, title:['Institutional Investor Walkthrough — six questions, one decision path','机构投资人导览 — 六个问题，一条决策路径'],
      badges:['verify'], live:false, blocks:[
      { t:'band-story', b:['Core storyline','核心叙事'],
        text:['Poland is retiring the most coal-heavy generation stack in the European Union into the fastest solar build in the region, and it has chosen to procure the resulting flexibility through a capacity market with long new-build contracts. That makes Polish storage conventionally financeable — a rarity in Central and Eastern Europe. The binding constraints are upstream of revenue: whether the project can obtain connection conditions at all, and what correction factor the auction assigns to its duration.',
              '波兰正将欧盟中煤电占比最高的电源结构，退役进入本区域增长最快的光伏体系，并选择通过设有长期新建合同的容量市场采购由此产生的灵活性。这使波兰储能具备常规可融资性 — 在中东欧实属罕见。关键约束位于收入之上游：项目能否取得并网条件，以及拍卖为其时长指定何种折减系数。'] },
      { t:'p', text:['Target COD window: ' + M.overall.codWindow, '目标投运窗口：' + M.overall.codWindow] },
      { t:'walk', items:[
        ['01', ['Overview','总览'], ['What is the house view today?','当前总体判断是什么？'], 'home'],
        ['02', ['Market evolution','市场演进'], ['Why did BESS become necessary — and what changed after entry?','为何储能成为必需？进入后发生了什么？'], 'story'],
        ['03', ['Revenue stack','收入结构'], ['How much of the asset does the capacity contract actually pay for?','容量合同实际为资产的多少部分付费？'], 'capacity'],
        ['04', ['Asset design','资产设计'], ['What duration does the correction factor reward?','折减系数奖励何种时长？'], 'duration'],
        ['05', ['Underwriting','项目承销'], ['Can the project connect, certify and finance?','项目能否并网、通过认证并融资？'], 'grid'],
        ['06', ['Portfolio application','组合应用'], ['Which screened Polish opportunity passes the gates?','所筛选的波兰机会中哪一个能通过门槛？'], 'portfolio'],
      ] },
      { t:'proto', text:['Data status: the capacity-auction prices, correction factors and contracted volumes shown in this build are seed values badged "verify against current documents". They set the structure of the analysis correctly but must be replaced with the published results for the specific delivery year before any transaction use.',
        '数据状态：本版本所示容量拍卖价格、折减系数与签约容量均为标注“须以现行文件核验”的种子数值。其正确反映了分析结构，但任何交易用途前须以对应交付年度的官方公布结果替换。'] },
      { t:'why', text:['The six questions are sequenced so each one can veto the next. A market that needs storage (02) is not the same as a capacity contract that pays for enough of the asset (03), a duration the correction factor rewards (04), a project that can actually obtain connection conditions and certify (05), or a specific opportunity worth committing capital to (06). In Poland the veto usually falls at step 05, because connection refusals — not capital or policy — are what ration the market.',
        '六个问题按“逐级否决”排序：市场需要储能（02）不等于容量合同为资产足够部分付费（03），不等于折减系数所奖励的时长（04），不等于项目能真正取得并网条件并通过认证（05），也不等于某个具体机会值得投入资本（06）。在波兰，否决通常发生在第05步 — 因为配给市场的是并网拒批，而非资本或政策。'],
        sig:['The veto usually falls at connection','否决通常发生在并网环节'] },
    ] },

    { t:'g2', cards:[
      { title:['Card A — Capacity Market Signal','Card A — 容量市场信号'], badges:['verify'], live:false, blocks:[
        { t:'chip', cls:'good', text:['The strongest feature — a long contract that makes the asset financeable','最突出的特征 — 使资产具备可融资性的长期合同'] },
        { t:'kpis', items:[
          { l:['Capacity clearing price (seed)','容量出清价（种子）'], v:fmtN(O.cmPricePln) + '<small> PLN/kW/yr</small>', d:['≈ ' + fmtC(capEurKW) + '/kW de-rated/yr','≈ ' + fmtC(capEurKW) + '/kW折减/年'], b:['verify'] },
          { l:['New-build agreement length','新建协议年限'], v:O.cmAgreementYears + '<small> yr</small>', d:['the longest contract in this comparison set','本对比样本中期限最长的合同'], b:['verify'] },
          { l:['4h correction factor','4小时折减系数'], v:fmtPct(M.deratingCurve[4] * 100, 0), d:['2h: ' + fmtPct(M.deratingCurve[2] * 100, 0) + ' · 8h: ' + fmtPct(M.deratingCurve[8] * 100, 0),'2小时：' + fmtPct(M.deratingCurve[2] * 100, 0) + ' · 8小时：' + fmtPct(M.deratingCurve[8] * 100, 0)], b:['verify'] },
          { l:['Capacity revenue per nameplate MW (4h)','每铭牌MW容量收入（4小时）'], v:fmtCk(perNameplate(4)) + '<small>/MW/yr</small>', d:['2h: ' + fmtCk(perNameplate(2)),'2小时：' + fmtCk(perNameplate(2))], b:['calc'] },
          { l:['BESS capacity contracted to date (seed)','迄今签约储能容量（种子）'], v:fmt1(O.cmAwardedBessGW) + '<small> GW</small>', d:['storage has become the dominant new-entry technology','储能已成为主导性的新进入技术'], b:['verify'] },
          { l:['Contracted share of a 4h revenue stack','4小时资产收入结构中的合同化占比'], v:fmtPct(perNameplate(4) / (perNameplate(4) + plMerchantPerMW(4)) * 100, 0), d:['a contracted floor, not the whole case','合同化保底，而非全部投资逻辑'], b:['calc'] },
        ] },
        { t:'why', text:['A ' + O.cmAgreementYears + '-year contract paying roughly ' + fmtCk(perNameplate(4)) + '/MW/yr on a 4-hour design still separates Poland from the energy-only markets in the region. But since the December 2025 auction cut the correction factor for storage to 13.39%, it is a contracted floor under a merchant asset rather than the asset itself. The two things to test are whether this project will clear the auction and how much of its energy certifies, because certified capacity must be deliverable for four uninterrupted hours. Both are decided before construction and neither can be fixed afterwards.',
          '在4小时设计下，一份支付约' + fmtCk(perNameplate(4)) + '/MW/年、期限' + O.cmAgreementYears + '年的合同，仍使波兰有别于本区域的单一电能量市场。但自2025年12月拍卖将储能折减系数降至13.39%以来，它是市场化资产之下的合同化保底，而非资产本身。需要检验的两件事是：该项目能否在拍卖中出清，以及其能量中有多少可获认证 — 因为认证容量必须能够连续四小时交付。两者均在建设前决定，且事后均无法修正。'],
          sig:['Will it clear, and at what factor?','能否出清？适用何种系数？'] },
      ] },
      { title:['Card B — Wholesale & Intraday Signal','Card B — 批发与日内市场信号'], live:false, blocks:[
        { t:'chip', cls:'good', text:['Volatility is high and rising — coal exit meets solar growth','波动性高且上升 — 煤电退出遭遇光伏增长'] },
        { t:'kpis', items:[
          { l:['Average daily four-hour spread','日均四小时价差'], v:fmtC(M.spreadSeries[5]) + '<small>/MWh</small>', d:['Q2 2026, PSE day-ahead prices','2026年第二季度，PSE日前价格'], b:['official'] },
          { l:['Executable net margin','可执行净价差'], v:fmtC(60) + '<small>/MWh</small>', d:[fmtPct((1 - 60 / 88) * 100, 0) + ' of the published spread is not capturable','公布价差中' + fmtPct((1 - 60 / 88) * 100, 0) + '无法捕获'], cls:'down', b:['calc'] },
          { l:['Captured spread at COD ' + cod,'投运年' + cod + '的捕获价差'], v:fmtC(cc.central) + '<small>/MWh</small>', d:['low ' + fmtC(cc.low) + ' · high ' + fmtC(cc.high),'低' + fmtC(cc.low) + ' · 高' + fmtC(cc.high)], b:['illus'] },
          { l:['Negative-price hours (2025, seed)','负电价小时数（2025，种子）'], v:'~' + fmtN(O.negHours) + '<small> h</small>', d:['from ~' + fmtN(M.negHoursSeriesY[0]) + ' h in 2023','由2023年约' + fmtN(M.negHoursSeriesY[0]) + '小时上升'], b:['illus'] },
          { l:['Coal share of generation (seed)','煤电占发电量比重（种子）'], v:'~' + O.coalSharePct + '<small>%</small>', d:['retirement is what creates the flexibility need','退役正是灵活性需求的来源'], b:['illus'] },
        ] },
        { t:'why', text:['Poland has the sharpest price-shape transition in this comparison set: a coal-heavy stack that sets high evening prices, colliding with solar that drives the midday price to zero and below for roughly ' + fmtN(O.negHours) + ' hours a year. That produces a wide, reliable, daily spread — the classic storage opportunity. But the same solar growth that widens the trough today will be joined by ' + fmt1(O.cmAwardedBessGW) + ' GW of contracted storage, which is why the captured spread falls from ' + fmtC(M.codCases[2028].central) + ' to ' + fmtC(M.codCases[2030].central) + '/MWh across three COD years.',
          '波兰在本对比样本中拥有最剧烈的价格形态转变：高煤电占比的电源结构推高晚间电价，而光伏则将午间电价压至零及以下，每年约' + fmtN(O.negHours) + '小时。这形成了宽而稳定的日内价差 — 典型的储能机会。但如今加深低谷的同一批光伏，将与' + fmt1(O.cmAwardedBessGW) + 'GW已签约储能同时存在，这正是捕获价差在三个投运年度间由' + fmtC(M.codCases[2028].central) + '降至' + fmtC(M.codCases[2030].central) + '/MWh的原因。'],
          sig:['Wide today, contracted competition tomorrow','当下价差宽，未来竞争已签约'] },
      ] },
      { title:['Card C — Balancing & Reserves Signal','Card C — 平衡与备用信号'], live:false, blocks:[
        { t:'chip', cls:'warn', text:['Supplementary — and use post-reform data only','补充性收入 — 且只采用改革后数据'] },
        { t:'kpis', items:[
          { l:['aFRR capacity requirement (seed)','aFRR容量需求（种子）'], v:fmtN(M.balProducts[1].reqMW) + '<small> MW</small>', d:['capacity price ' + fmtC(M.balProducts[1].capEurMWh) + '/MW/h','容量价格' + fmtC(M.balProducts[1].capEurMWh) + '/MW/h'], b:['illus'] },
          { l:['mFRR capacity requirement (seed)','mFRR容量需求（种子）'], v:fmtN(M.balProducts[2].reqMW) + '<small> MW</small>', d:['deep volume, low unit price','量大价低'], b:['illus'] },
          { l:['aFRR capacity price trend','aFRR容量价格趋势'], v:fmtC(M.afrrCapSeries[0]) + ' → ' + fmtC(M.afrrCapSeries[5]), d:[fmtPct((M.afrrCapSeries[5] / M.afrrCapSeries[0] - 1) * 100, 0) + ' over six quarters','六个季度内' + fmtPct((M.afrrCapSeries[5] / M.afrrCapSeries[0] - 1) * 100, 0)], cls:'down', b:['illus'] },
          { l:['Balancing market reform','平衡市场改革'], v:String(O.balancingReformYear), d:['15-minute settlement — pre-reform history is a different market','15分钟结算 — 改革前的历史属于另一个市场'], b:['official'] },
        ] },
        { t:'why', text:['Balancing is a supplementary line in Poland rather than a core one, because the capacity contract already provides the floor that balancing revenue would otherwise have to substitute for. The specific Polish discipline is temporal: the ' + O.balancingReformYear + ' reform changed settlement and dispatch, so any backtest spanning it is measuring two different markets. Use post-reform data only, cap the line at trailing twelve months, and exclude it from debt sizing — the capacity contract is what lenders will size against.',
          '在波兰，平衡收入属补充性而非核心性，因为容量合同已提供了本来需由平衡收入替代的保底。波兰特有的纪律是时间性的：' + O.balancingReformYear + '年改革改变了结算与调度机制，因此任何跨越该时点的回测实际上在衡量两个不同的市场。应仅采用改革后数据、以过去12个月封顶、并排除于债务规模测算之外 — 贷款人据以安排规模的是容量合同。'],
          sig:['Split every backtest at the 2024 reform','所有回测须以2024年改革分段'] },
      ] },
      { title:['Card D — Duration Signal','Card D — 时长信号'], live:false, blocks:[
        { t:'chip', cls:'warn', text:['Capped — the correction factor pays for hours only up to four','受限 — 折减系数仅为四小时以内的小时数付费'] },
        { t:'kpis', items:[
          { l:['Duration-Need Index','时长需求指数'], v:dni + '<small> / 100</small>', d:dband.n, b:['calc','illus'] },
          { l:['Correction-factor uplift, 2h → 4h','折减系数增益，2小时→4小时'], v:'+' + fmtPct((M.deratingCurve[4] - M.deratingCurve[2]) * 100, 0) + '<small> pts</small>',
            d:['worth ' + fmtCk(perNameplate(4) - perNameplate(2)) + '/MW/yr','价值' + fmtCk(perNameplate(4) - perNameplate(2)) + '/MW/年'], b:['calc'] },
          { l:['Net marginal value, hours 3–4','第3–4小时净边际价值'], v:fmtC(M.marginalHour[M.marginalHour.length - 1].v) + 'k<small>/MW/yr</small>', d:['the correction factor now adds little','折减系数的贡献已很小'], b:['illus'] },
          { l:['Spread capture at 4h vs 2h','4小时对2小时的价差捕获率'], v:fmtPct(M.durSpreadFactor[4] * 100, 0), d:['deeper cycles capture thinner spreads','更深循环捕获更薄价差'], b:['illus'] },
        ] },
        { t:'flow', items:[
          ['Coal retirement lengthens the evening ramp','煤电退役拉长晚间爬坡'],
          ['Solar deepens the midday trough','光伏加深午间低谷'],
          ['Correction factor rewards duration','折减系数奖励时长'],
          ['Capacity obligation during stress events','紧张事件期间的容量义务'],
          ['4h is the new-build default','4小时成为新建默认配置'],
        ], sep:'+' },
        { t:'why', text:['Poland is the clearest duration case in this comparison set because two forces point the same way: the correction factor pays a discrete ' + fmtCk(perNameplate(4) - perNameplate(2)) + '/MW/yr step for moving 2h → 4h, and the capacity obligation itself requires energy during a multi-hour stress event. A 2-hour asset can be fully available and still run out of energy in exactly the hours the contract is being tested. That makes 4h the sensible new-build default rather than an optimisation.',
          '波兰是本对比样本中时长论证最清晰的市场，因为两股力量方向一致：折减系数为2小时增至4小时支付一次性的' + fmtCk(perNameplate(4) - perNameplate(2)) + '/MW/年阶跃，而容量义务本身在多小时紧张事件中要求提供能量。2小时资产可能可用率完全达标，却恰恰在合同受检验的那些小时内耗尽能量。因此4小时是合理的新建默认配置，而非优化选项。'],
          sig:['Correction factor and obligation agree','折减系数与容量义务方向一致'] },
      ] },
      { title:['Card E — Grid & Connection Signal','Card E — 并网信号'], badges:['illus'], live:false, blocks:[
        { t:'kpis', items:[
          { l:['Binding evidence','约束性证据'], v:L(['Connection conditions + executed agreement','并网条件+已签协议']), d:['a connection application is not evidence','并网申请不构成证据'], b:['verify'] },
          { l:['Connection pipeline (seed)','并网管线（种子）'], v:fmt1(O.pipelineGW) + '<small> GW</small>', d:['against ' + fmtN(O.fleetMW) + ' MW operating','对比在运' + fmtN(O.fleetMW) + 'MW'], b:['illus'] },
          { l:['Primary rationing mechanism','主要配给机制'], v:L(['Connection refusals','并网拒批']), d:['not capital, not permitting, not policy','并非资本、许可或政策'], b:['verify'] },
          { l:['Certification pathway','认证路径'], v:L(['Required to bid','投标前提']), d:['no certification means no capacity contract','未通过认证即无容量合同'], b:['verify'] },
        ] },
        { t:'note', text:['Required protection: no material non-refundable payment before connection conditions with adequate capacity and an executed connection agreement. In Poland the connection stage also gates the capacity auction, so a connection failure removes both revenue lines at once rather than delaying one of them.',
          '必要保护：在取得容量充足的并网条件及已签并网协议前，不支付重大不可退还款项。在波兰，并网阶段同时决定能否参与容量拍卖，因此并网失败会一次性移除两条收入线，而非仅延迟其中一条。'] },
        { t:'why', text:['Connection is weak here for a structural reason: connection conditions are rationed, and they gate the capacity auction as well as the physical build. That compounding is the distinctively Polish risk — in an energy-only market a connection delay costs you a year of spread, but here it can cost you the auction, and with it the ' + O.cmAgreementYears + '-year contract that makes the project financeable at all.',
          '并网在此偏弱，原因是结构性的：并网条件受到配给，且其不仅决定实体建设，也决定能否参与容量拍卖。这种叠加效应正是波兰特有的风险 — 在单一电能量市场中，并网延迟的代价是一年的价差；而在此地，其代价可能是错过拍卖，进而失去使项目得以融资的' + O.cmAgreementYears + '年合同。'],
          sig:['A connection delay can cost the auction','并网延迟可能导致错过拍卖'] },
      ] },
    ] },

    { t:'card', title:['Card F — Immediate Investor Actions','Card F — 可执行投资建议'], badges:['illus'], live:false, blocks:[
      { t:'list', ol:true, items:[
        [['Base capacity revenue on the correction factor for the specific auction and duration, never on nameplate MW.','容量收入应基于具体拍卖与时长对应的折减系数，绝不使用铭牌MW。'],
         ['Trigger: capacity revenue included in the base case','触发条件：基准情景包含容量收入']],
        [['Require connection conditions with adequate capacity and an executed connection agreement as conditions precedent.','以容量充足的并网条件及已签并网协议为先决条件。'],
         ['Trigger: connection evidence below executed-agreement standard','触发条件：并网证据未达已签协议标准']],
        [['Model the capacity obligation as a physical requirement: stress a multi-hour system event against the modelled state of charge.','将容量义务作为物理要求建模：以多小时系统事件对模型荷电状态进行压力测试。'],
         ['Trigger: duration below 4 hours with a capacity contract assumed','触发条件：假设取得容量合同但时长低于4小时']],
        [['Use post-2024 balancing data only, and exclude balancing revenue from debt sizing.','仅采用2024年之后的平衡市场数据，并将平衡收入排除于债务规模测算之外。'],
         ['Trigger: any backtest spanning the balancing reform','触发条件：任何跨越平衡市场改革的回测']],
        [['Stress the captured spread under the high-buildout path for the project’s COD year, given ' + fmt1(O.cmAwardedBessGW) + ' GW already contracted.','鉴于已签约' + fmt1(O.cmAwardedBessGW) + 'GW，须按项目投运年度的高投产情景对捕获价差进行压力测试。'],
         ['Trigger: merchant revenue material to equity returns','触发条件：市场化收入对股权回报影响重大']],
      ] },
      { t:'why', text:['Each action is paired with a numeric or documentary trigger so the decision is reviewable rather than a matter of judgement recalled later. The distinctively Polish one is the third: a capacity contract is an obligation as well as a payment, and a 2-hour asset holding a capacity contract is short exactly when the contract is tested. That is a design decision, not a modelling assumption, and it cannot be corrected after the auction.',
        '每项建议均配套量化或文件化触发条件，使决策可复核，而非事后凭记忆判断。其中第三项为波兰特有：容量合同既是付费也是义务，而持有容量合同的2小时资产，恰恰在合同受检验时时长不足。这是设计决策而非建模假设，且在拍卖之后无法修正。'],
        sig:['A capacity contract is also an obligation','容量合同同时也是一项义务'] },
    ] },

    { t:'card', title:['Revenue Driver Bridge — how nameplate MW becomes net operating revenue','收入驱动桥 — 铭牌MW如何变为净运营收入'], badges:['calc'], live:false, blocks:[
      { t:'sub', text:['Capacity channel (rynek mocy)','容量通道（容量市场）'] },
      { t:'flow', items:[
        ['Nameplate MW / MWh','铭牌MW/MWh'], ['Connection conditions & agreement','并网条件与协议'],
        ['Certification for the auction','拍卖认证'], ['× correction factor for duration','×按时长的折减系数'],
        ['Awarded capacity obligation × price','中标容量义务×价格'], ['− non-delivery penalties','− 未交付罚金'],
      ] },
      { t:'sub', text:['Merchant channel (net, not gross)','市场化通道（净值，非毛值）'] },
      { t:'flow', items:[
        ['Published day-ahead spread','公布日前价差'], ['− liquidity & gate-closure','− 流动性与闭市'],
        ['− RTE, availability & cycling limits','− 效率、可用率与循环限制'], ['− network charges & fees','− 网络费用与其他费用'],
        ['− optimiser fee','− 优化商费用'], ['+ balancing (post-reform basis)','+ 平衡（改革后口径）'], ['Net operating revenue','净运营收入'],
      ] },
      { t:'note', text:['The two chains share a single upstream gate. Connection conditions determine whether the asset exists at all and whether it can certify for the auction, so a failure there removes both chains simultaneously. Downstream, the capacity chain fails on energy adequacy during stress events and the merchant chain fails on execution and saturation.',
        '两条链条共享同一上游门槛。并网条件既决定资产能否存在，也决定其能否通过拍卖认证，因此该环节失败将同时移除两条链条。在下游，容量链的失效点是紧张事件期间的能量充裕度，市场化链的失效点是执行与饱和。'] },
      { t:'why', text:['This bridge is the dashboard’s single organising idea, and in Poland it has an unusual shape: one shared upstream gate and two independent downstream failure modes. Diligence should therefore be front-loaded — the connection and certification questions are worth more analytical effort than the price forecast, because they determine whether either revenue line exists. Once past that gate, Poland is the most conventionally financeable storage market in Central and Eastern Europe.',
        '本桥是整个看板的组织主线，而在波兰它呈现出不同寻常的形态：一个共享的上游门槛，加两个相互独立的下游失效模式。因此尽调应前置 — 并网与认证问题比价格预测更值得投入分析精力，因为它们决定两条收入线是否存在。一旦跨过该门槛，波兰即是中东欧最具常规可融资性的储能市场。'],
        sig:['One shared gate, two failure modes','一个共享门槛，两种失效模式'] },
    ] },
  ] };
};

// ============================== POLAND MARKET STORY ==============================

  return SEC_B.home;
}
