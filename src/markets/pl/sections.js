import { buildPLGridSection } from './gridSection.js';
import { buildPLPlanningBlocks } from './planningSection.js';
import { buildPLEconomicsBlocks } from './economicsSection.js';

/* ---------------------------------------------------------------------------
   Poland 鈥?declarative section specs, verbatim from the prototype
   (lines 1590-2507).

   One SEC_B entry per tab, each returning a block spec that the shared engine
   draws. SECTIONS() wraps them in lazy getters so every string re-evaluates when
   the language changes.

   The engine hands in everything these specs use; nothing is imported directly,
   which is what keeps the four markets in this lineage interchangeable.
   --------------------------------------------------------------------------- */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function buildSections(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;

// ---------------- section registry ----------------
const SEC_B = {};
function SECTIONS(){
  const o = {};
  Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
  return o;
}
const O = M.official;
const capEurKW = O.cmPricePln / M.fx;                                  // €/kW/yr de-rated
const perNameplate = hh => capEurKW * interp(M.deratingCurve, hh) * 1000;  // €/MW/yr
const plMerchantPerMW = hh => hh * M.usableFraction * M.lab.cycles * 365 * (M.lab.avail / 100)
  * M.lab.spread * interp(M.durSpreadFactor, hh);

// ============================== OVERVIEW ==============================
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
      { title:['Card A — Overall Poland Storage Signal','Card A — 波兰储能综合信号'], badges:['illus'], live:false, blocks:[
        { t:'p', text:['Target COD window: ' + M.overall.codWindow + ' · Evidence confidence: ' + M.overall.confidence + '%',
          '目标投运窗口：' + M.overall.codWindow + ' · 证据置信度：' + M.overall.confidence + '%'] },
        { t:'p', text:M.overall.rationale },
      ] },
      { title:['Card B — Capacity Market Signal','Card B — 容量市场信号'], badges:['verify'], live:false, blocks:[
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
      { title:['Card C — Wholesale & Intraday Signal','Card C — 批发与日内市场信号'], live:false, blocks:[
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
      { title:['Card D — Balancing & Reserves Signal','Card D — 平衡与备用信号'], live:false, blocks:[
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
      { title:['Card E — Duration Signal','Card E — 时长信号'], live:false, blocks:[
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
      { title:['Card F — Grid & Connection Signal','Card F — 并网信号'], badges:['illus'], live:false, blocks:[
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

    { t:'card', title:['Card G — Immediate Investor Actions','Card G — 可执行投资建议'], badges:['illus'], live:false, blocks:[
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
SEC_B.story = function (){
  return {
  head: ['Poland Market Evolution — from a coal capacity market to a storage capacity market',
         '波兰市场演进 — 从煤电容量市场到储能容量市场'],
  cap: ['This section is the narrative bridge between the Overview and the detailed underwriting tabs. It separates historical facts, observed market outcomes and the forward investment conclusion.',
        '本节连接“总览”与后续承销分析，明确区分历史事实、已观察市场结果及前瞻投资结论。'],
  blocks: [
    { t:'card', mt:false, title:['One-minute orientation for a new institutional investor','机构投资人的一分钟市场定位'], badges:['verify','public'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Market design','市场设计'], v:L(['Energy + capacity market','电能量+容量市场']), d:['the only capacity mechanism in this CEE comparison','本中东欧对比中唯一的容量机制'], b:['official'] },
        { l:['Coal share of generation (seed)','煤电占发电量比重（种子）'], v:'~' + O.coalSharePct + '<small>%</small>', d:['retiring — which is what the capacity market pays to replace','正在退役 — 这正是容量市场付费替代的对象'], b:['illus'] },
        { l:['Negative-price hours 2025 (seed)','2025年负电价小时数（种子）'], v:'~' + fmtN(O.negHours) + '<small> h</small>', d:['from ~' + fmtN(M.negHoursSeriesY[0]) + ' h in 2023 — solar arriving fast','由2023年约' + fmtN(M.negHoursSeriesY[0]) + '小时上升 — 光伏快速到场'], b:['illus'] },
        { l:['Operating storage fleet (seed)','在运储能规模（种子）'], v:fmtN(O.fleetMW) + '<small> MW</small>', d:[fmtN(O.fleetMWh) + ' MWh','' + fmtN(O.fleetMWh) + 'MWh'], b:['illus'] },
        { l:['BESS capacity contracted (seed)','已签约储能容量（种子）'], v:fmt1(O.cmAwardedBessGW) + '<small> GW</small>', d:['storage is now the dominant new-entry technology','储能已成为主导性的新进入技术'], b:['verify'] },
        { l:['Connection pipeline (seed)','并网管线（种子）'], v:fmt1(O.pipelineGW) + '<small> GW</small>', d:['rationed by connection refusals','受并网拒批配给'], b:['illus'] },
      ] },
      { t:'reco', b:['Institutional conclusion: ','机构投资结论：'],
        text:['Poland built a capacity market to keep coal available and ended up using it to procure storage. That is the single most important fact for an investor: the mechanism was not designed for batteries, but batteries now win it, and the resulting long contract is what makes Polish storage conventionally financeable. The scarce resource is not capital or policy support — it is a connection that allows the project to certify and bid.',
              '波兰建立容量市场原本是为了保持煤电可用，最终却用它来采购储能。这是对投资人而言最重要的事实：该机制并非为电池设计，但电池如今在其中胜出，而由此产生的长期合同使波兰储能具备常规可融资性。稀缺资源既非资本也非政策支持 — 而是一份能让项目通过认证并参与投标的并网。'] },
      { t:'why', text:['Two facts do the work. Roughly ' + O.coalSharePct + '% coal in the stack is retiring, which is a quantified, contracted capacity need rather than a forecast — the auction pays for it every year. And ' + fmt1(O.cmAwardedBessGW) + ' GW of storage already contracted shows the mechanism works for batteries in practice, not just in theory. The Polish investment problem is therefore access, not thesis: the returns are available to whoever can connect and certify, and the connection queue is what decides who that is.',
        '此处两项事实最为关键。电源结构中约' + O.coalSharePct + '%的煤电正在退役，这是一项可量化、已合同化的容量需求而非预测 — 拍卖每年为其付费。而已签约' + fmt1(O.cmAwardedBessGW) + 'GW储能表明该机制对电池不仅在理论上、也在实践中有效。因此波兰的投资难题在于准入而非逻辑：收益属于能够并网并通过认证者，而并网队列决定了谁能做到。'],
        sig:['Access risk, not thesis risk','准入风险而非逻辑风险'] },
    ] },

    ...buildPLPlanningBlocks({ SRC }),

    ...buildPLEconomicsBlocks(),
    { t:'card', title:['How Poland arrived at a storage capacity market — four changes','波兰如何走向储能容量市场 — 四次变化'], badges:['verify','public'], blocks:[
      { t:'band-story', b:['Why this history is underwriting-relevant','这段历史为何与承销相关'],
        text:['The Polish capacity market was designed for thermal plant and has been progressively re-pointed toward flexibility. Each re-pointing changed which technology could win without changing the mechanism’s name — which is exactly the pattern that strands designs built for the previous vintage. Record the auction vintage and correction-factor table in every model.',
              '波兰容量市场原为火电设计，此后逐步向灵活性资源重新定向。每次重新定向都在机制名称不变的情况下改变了哪种技术能够胜出 — 这正是使按上一版本设计的资产被搁浅的模式。应在每个模型中记录拍卖年份与折减系数表。'] },
      { t:'timeline', items:[
        { y:'2018–2021', t:['A capacity market built for coal','为煤电而建的容量市场'],
          p:['The mechanism was introduced to secure adequacy in a coal-dominated system, with multi-year contracts for new build and shorter contracts for existing plant. Storage was a marginal participant.',
             '该机制的引入是为了在以煤电为主的系统中保障充裕度，对新建机组给予多年期合同、对既有机组给予较短期限。储能当时只是边缘参与者。'],
          i:['The contract length that now makes storage financeable was designed to finance thermal plant. Investors inherit a structure built for a different technology — including obligations calibrated to plant that can run for days.',
             '如今使储能可融资的合同期限，最初是为火电融资而设计的。投资人继承的是为另一种技术构建的结构 — 包括按可连续运行数日的机组标定的义务条款。'] },
        { y:'2021–2023', t:['Emissions limits push coal out of the auction','排放限值将煤电挤出拍卖'],
          p:['EU emission-performance requirements progressively excluded the highest-emitting units from new capacity contracts, opening the auction to gas, demand response and storage.',
             '欧盟排放绩效要求逐步将高排放机组排除于新增容量合同之外，使拍卖向燃气、需求响应与储能开放。'],
          i:['This is the origin of the storage opportunity. The mechanism did not choose batteries; it excluded the incumbent and batteries were the cheapest qualifying new entrant.',
             '这正是储能机会的来源。该机制并未选择电池，而是排除了在位技术，而电池是最便宜的合资格新进入者。'] },
        { y:'2023–2025', t:['Storage becomes the dominant new entrant','储能成为主导性新进入者'],
          p:['Successive auctions contracted multiple gigawatts of battery capacity, making storage the leading new-build technology by contracted volume.',
             '连续几轮拍卖签约了数吉瓦电池容量，使储能按签约量成为领先的新建技术。'],
          i:['Once storage wins an auction at scale, the correction factor becomes the most consequential regulatory number in the market — it decides how much of each battery is paid, and it is revised between vintages.',
             '一旦储能在拍卖中规模化胜出，折减系数即成为市场中最具后果的监管数字 — 它决定每台电池获付费的比例，且在不同年份之间会被修订。'] },
        { y:'2024–2026', t:['Balancing reform and the solar collision','平衡市场改革与光伏冲击'],
          p:['The balancing market moved to 15-minute settlement with a redesigned dispatch and reserve framework, while solar growth pushed negative-price hours to roughly ' + fmtN(O.negHours) + ' a year.',
             '平衡市场转向15分钟结算并重新设计了调度与备用框架，同时光伏增长将负电价小时数推高至每年约' + fmtN(O.negHours) + '小时。'],
          i:['Two things happened at once: the merchant opportunity widened and the historical dataset became unusable. Any Polish backtest spanning the reform is measuring two different markets.',
             '两件事同时发生：市场化机会扩大，而历史数据集变得不可用。任何跨越该改革的波兰回测，实际上在衡量两个不同的市场。'] },
      ] },
      { t:'why', text:['Four changes in under a decade, and the mechanism’s name never changed. That is the base rate to underwrite against: expect the correction-factor table and the auction parameters to be revised between vintages, and expect each revision to favour the technology the system currently needs rather than the one that won last time. Two practical conclusions: record the vintage in every model, and treat the next parameter review as a scheduled event with a P&L consequence.',
        '不到十年内四次变化，而机制名称从未改变。这就是承销时应参照的基准频率：应预期折减系数表与拍卖参数在不同年份之间被修订，且每次修订都会有利于系统当前所需的技术，而非上一次胜出的技术。两项实务结论：在每个模型中记录版本；并将下一次参数审查视为具有损益后果的既定事件。'],
        sig:['Same mechanism, revised every vintage','机制不变，每一版本均被修订'] },
      { t:'g2', cards:[
        { title:['Capacity clearing price path (seed)','容量出清价轨迹（种子）'], badges:['verify'], blocks:[
          { t:'line', cfg:{ xs: M.cmYears, yfmt: v => fmtN(v), h: 200, ymin: 0,
            series:[{ name:['Clearing price (PLN/kW/yr)','出清价（PLN/kW/年）'], color:'var(--s1)', vals: M.cmPriceSeries }] } },
          { t:'why', text:['The seed path declines as more storage and demand response qualify — the ordinary consequence of a mechanism that has successfully attracted new entry. Two underwriting rules follow: model a declining price path rather than the last print, and remember that a ' + O.cmAgreementYears + '-year contract locks in whichever price you won, so the auction you enter determines the majority of lifetime contracted revenue.',
            '随着更多储能与需求响应取得资格，种子路径呈下降态势 — 这是机制成功吸引新进入者的通常后果。由此得出两条承销原则：应按下降的价格路径而非最近一次出清价建模；并须记住' + O.cmAgreementYears + '年合同锁定的是你中标时的价格，因此你参与的那次拍卖决定了终身合同化收入的大部分。'],
            sig:['One auction, seventeen years','一次拍卖，十七年'] },
        ] },
        { title:['Correction factors by duration','按时长的折减系数'], badges:['official'], blocks:[
          { t:'line', cfg:{ xs: M.derateHours.map(x => x + 'h'), yfmt: v => fmtPct(v * 100, 0), ymin: 0, h: 200,
            series:[{ name:['Correction factor','折减系数'], color:'var(--s1)', vals: M.derateHours.map(hh => M.deratingCurve[hh]) }] } },
          { t:'why', text:['The curve rises to 4 hours (' + fmtPct(M.deratingCurve[2] * 100, 1) + ' → ' + fmtPct(M.deratingCurve[4] * 100, 1) + ') and is flat after it (' + fmtPct(M.deratingCurve[6] * 100, 1) + ' at 6h, ' + fmtPct(M.deratingCurve[8] * 100, 1) + ' at 8h). The factor is the same for every duration; what rises is how much of the battery certifies, because certified capacity must be deliverable for four uninterrupted hours. The mechanism is telling you what it wants, four hours of firm energy, and it pays nothing for a fifth.',
            '曲线升至4小时（' + fmtPct(M.deratingCurve[2] * 100, 1) + '→' + fmtPct(M.deratingCurve[4] * 100, 1) + '），其后持平（6小时' + fmtPct(M.deratingCurve[6] * 100, 1) + '，8小时' + fmtPct(M.deratingCurve[8] * 100, 1) + '）。各时长适用同一折减系数；上升的是电池中可获认证的部分，因为认证容量必须能够连续四小时交付。该机制在明确表达其需求：四小时的可靠能量，且对第五小时不付任何费用。'],
            sig:['The mechanism asks for four hours','该机制要求四小时'] },
        ] },
      ] },
      { t:'src', src: SRC.pse, use:['Capacity auction results, contract lengths and contracted volumes','容量拍卖结果、合同期限与签约容量'] },
    ] },

    { t:'card', title:['The price shape — coal exit meets solar growth','价格形态 — 煤电退出遭遇光伏增长'], badges:['illus'], blocks:[
      { t:'line', cfg:{ xs: M.pxLabels, yfmt: v => fmtC(v), h: 230, ymin: 0,
        series:[
          { name:['Day-ahead average (€/MWh)','日前均价（€/MWh）'], color:'var(--s1)', vals: M.damSeries },
          { name:['Average daily spread (€/MWh)','日均价差（€/MWh）'], color:'var(--s3)', vals: M.spreadSeries },
        ] } },
      { t:'bar', cfg:{ xs: M.negHoursYears, bw: 46, yfmt: v => fmtN(v) + ' h', labels: true, h: 230,
        series:[{ name:['Negative-price hours','负电价小时数'], color:'var(--s6)', vals: M.negHoursSeriesY }] } },
      { t:'why', text:['Negative-price hours have gone from roughly ' + fmtN(M.negHoursSeriesY[0]) + ' to ' + fmtN(M.negHoursSeriesY[2]) + ' in two years and are still rising. For a storage investor that is the charging opportunity growing faster than the discharging opportunity, which widens the spread now. It is also the clearest signal that the merchant case is time-limited: the same solar that creates the trough will eventually be joined by the ' + fmt1(O.cmAwardedBessGW) + ' GW of contracted storage that fills it.',
        '负电价小时数在两年内由约' + fmtN(M.negHoursSeriesY[0]) + '增至' + fmtN(M.negHoursSeriesY[2]) + '，且仍在上升。对储能投资人而言，这意味着充电机会的增长快于放电机会，当下扩大了价差。它同时也是最清晰的信号，表明市场化逻辑具有时限性：创造低谷的同一批光伏，最终将与填补该低谷的' + fmt1(O.cmAwardedBessGW) + 'GW已签约储能同时存在。'],
        sig:['Charging opportunity grows faster','充电机会增长更快'] },
      { t:'src', src: SRC.tge, use:['Day-ahead and intraday price levels, spreads and negative-price intervals','日前与日内价格水平、价差及负电价时段'] },
    ] },

    { t:'card', title:['Who is building Polish storage — four strategies, one bottleneck','谁在建设波兰储能 — 四类策略，一个瓶颈'], badges:['public','illus'], live:false, blocks:[
      { t:'players', items:[
        { type:['State-linked utility','国有关联公用事业'], n:['Incumbent generators replacing retiring coal','以储能替代退役煤电的在位发电企业'], met:'existing sites & connections',
          p:['Reuse retiring thermal sites, which already hold connection capacity and grid infrastructure. Structurally the fastest route past the binding constraint.',
             '复用退役火电场址，其已具备并网容量与电网基础设施。这是绕过关键约束在结构上最快的路径。'] },
        { type:['International IPP / infra fund','国际独立发电商与基础设施基金'], n:['Platform investors bidding into the capacity auction','参与容量拍卖投标的平台型投资人'], met:'contracted portfolios',
          p:['Acquire or develop for the auction and finance against the resulting long contract. Poland is one of the few CEE markets where this conventional model works.',
             '为拍卖而收购或开发，并以由此取得的长期合同进行融资。波兰是少数几个该常规模式行得通的中东欧市场之一。'] },
        { type:['Renewable developer co-locating','共址加建的新能源开发商'], n:['Solar and wind owners adding storage behind an existing connection','在既有并网点后加建储能的光伏与风电业主'], met:'shared connection',
          p:['Reuse an existing connection to bypass the queue and monetise the midday trough their own generation creates.',
             '复用既有并网点以绕开排队，并将自身发电所造成的午间低谷变现。'] },
        { type:['Trading house / optimiser','贸易机构与优化商'], n:['Route-to-market and balancing certification providers','售电路径与平衡市场认证提供方'], met:'fee + share',
          p:['Post-reform market access is a specialist function, and certification for reserve products is project-specific rather than automatic.',
             '改革后的市场准入属专业职能，且备用产品认证按项目取得，并非自动获得。'] },
      ] },
      { t:'note', text:['Concentration read: Poland is fragmented on ownership and concentrated on connection capacity. Whoever holds connection conditions at a location that can certify for the auction holds the scarce asset — which is why retiring thermal sites and existing renewable connections are structurally advantaged.',
        '集中度解读：波兰在所有权上分散，在并网容量上集中。谁在能够通过拍卖认证的位置持有并网条件，谁就持有稀缺资产 — 这正是退役火电场址与既有新能源并网点具备结构性优势的原因。'] },
      { t:'why', text:['For a new entrant this determines strategy before it determines price. The two structurally advantaged routes — a retiring thermal site and a co-located renewable connection — both work by reusing connection capacity that already exists. Greenfield development competes for the scarce resource directly and should be underwritten with development-stage return requirements, not infrastructure ones.',
        '对新进入者而言，这一点在决定价格之前先决定策略。两条具备结构性优势的路径 — 退役火电场址与共址新能源并网点 — 均通过复用既有并网容量实现。绿地开发则直接争夺稀缺资源，应按开发阶段而非基础设施的收益要求进行承销。'],
        sig:['Reuse a connection or price development risk','要么复用并网，要么为开发风险定价'] },
    ] },

    { t:'g2', cards:[
      { title:['Near-term outlook — 2026 to 2029: auction position decides returns','近期展望 — 2026至2029：拍卖地位决定收益'], badges:['verify','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2026–2027','2026–2027'], h:['Certification and auction cycle','认证与拍卖周期'], p:['Whether a project certifies and clears determines whether it has a ' + O.cmAgreementYears + '-year contract or a merchant asset. There is no partial outcome.','项目能否通过认证并出清，决定其拥有的是' + O.cmAgreementYears + '年合同还是市场化资产。不存在中间结果。'] },
          { yr:['2027–2028','2027–2028'], h:['Merchant spread peak','市场化价差高点'], p:['Solar saturation has widened the trough but the contracted storage cohort has not yet fully connected. Captured spread is at its highest in the model.','光伏饱和已加深低谷，而已签约储能批次尚未完全并网。模型中捕获价差处于最高水平。'] },
          { yr:['2028–2030','2028–2030'], h:['Contracted cohort arrives','已签约批次到场'], p:['The ' + fmt1(O.cmAwardedBessGW) + ' GW already contracted begins operating and captured spread falls from ' + fmtC(M.codCases[2028].central) + ' to ' + fmtC(M.codCases[2030].central) + '/MWh in the central case.','已签约的' + fmt1(O.cmAwardedBessGW) + 'GW开始运行，中性情景下捕获价差由' + fmtC(M.codCases[2028].central) + '降至' + fmtC(M.codCases[2030].central) + '/MWh。'] },
        ] },
        { t:'why', text:['In this window the merchant line falls and the contracted line does not — which is the whole argument for treating the auction as the investment decision rather than as a financing step. A project with a capacity contract has a defensible ' + O.cmAgreementYears + '-year base regardless of what the spread does; a project without one is fully exposed to a ' + fmtPct((1 - M.codCases[2030].central / M.codCases[2028].central) * 100, 0) + '% captured-spread decline it cannot influence.',
          '在这一窗口内，市场化收入下降而合同化收入不变 — 这正是应将拍卖视为投资决策而非融资步骤的全部理由。持有容量合同的项目，无论价差如何变化，都拥有可辩护的' + O.cmAgreementYears + '年基础；而没有合同的项目则完全暴露于其无法影响的' + fmtPct((1 - M.codCases[2030].central / M.codCases[2028].central) * 100, 0) + '%捕获价差下滑。'],
          sig:['The auction is the investment decision','拍卖即是投资决策'] },
      ] },
      { title:['Long-term outlook — 2030 to 2035: obligation, replacement and the second window','长期展望 — 2030至2035：义务、置换与第二个窗口'], badges:['verify','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2030','2030'], h:['Obligation years begin in earnest','义务年度正式开始'], p:['Contracted storage must actually deliver during system stress events. Assets sized for the correction factor but not for the obligation discover the difference.','已签约储能须在系统紧张事件中实际交付。按折减系数而非按义务定尺寸的资产将在此发现差异。'] },
          { yr:['2031–2033','2031–2033'], h:['Coal retirement accelerates','煤电退役加速'], p:['Removing firm capacity steepens ramps and re-widens the spread that the contracted cohort had compressed.','移除可靠容量使爬坡更陡，并重新扩大已签约批次此前压缩的价差。'] },
          { yr:['2033–2035','2033–2035'], h:['Augmentation and re-contracting','增容与重新签约'], p:['Early 2h assets face a correction-factor table that no longer supports them, while augmentation-ready 4h sites re-contract at a higher factor.','早期2小时资产面对不再支持其经济性的折减系数表，而具备增容条件的4小时场址可按更高系数重新签约。'] },
        ] },
        { t:'why', text:['The long-run risk in Poland is not price — it is the obligation. A ' + O.cmAgreementYears + '-year contract is a ' + O.cmAgreementYears + '-year commitment to deliver energy during stress events, and correction factors are revised while the obligation is not. An asset that is marginal on duration at award becomes progressively more exposed as it degrades. That is why the degradation covenant and the augmentation path are the two documents that protect long-run value here.',
          '波兰的长期风险不在价格，而在义务。' + O.cmAgreementYears + '年合同意味着' + O.cmAgreementYears + '年在紧张事件中交付能量的承诺，而折减系数会被修订、义务却不会。中标时时长处于边际的资产，将随衰减而暴露程度递增。这正是衰减契约与增容路径成为在此保护长期价值的两份关键文件的原因。'],
          sig:['Factors are revised; the obligation is not','系数会被修订，义务不会'] },
      ] },
    ] },

    { t:'card', title:['What breaks this storyline — three monitored uncertainties','哪些因素会打破该叙事 — 三项须持续监测的不确定性'], badges:['public','calc'], blocks:[
      { t:'table', head:[['Uncertainty','不确定性'],['Why it matters','影响机理'],['Monitoring trigger','监测触发条件']], rows:[
        [{b:['Correction-factor revision','折减系数修订']},
         ['The factor decides how much of the asset is paid. A downward revision at the short end cuts capacity revenue with no physical change to the project.','该系数决定资产中获付费的比例。短时端的下调会在项目完全不变的情况下削减容量收入。'],
         ['Publication of the correction-factor table for the next auction','下一次拍卖折减系数表的发布']],
        [{b:['Connection refusal policy','并网拒批政策']},
         ['Connection conditions ration the market and gate the auction. Any change to issuance practice changes both the pipeline and the competitive field.','并网条件配给市场并决定拍卖准入。签发实践的任何变化都会同时改变管线与竞争格局。'],
         ['Any change to connection-condition issuance or refusal criteria','并网条件签发或拒批标准的任何变化']],
        [{b:['Capacity auction parameters and demand curve','容量拍卖参数与需求曲线']},
         ['The demand curve and eligibility rules determine the clearing price and which technologies compete. Both are set administratively each cycle.','需求曲线与资格规则决定出清价及参与竞争的技术类型。两者每个周期均由行政确定。'],
         ['Publication of auction parameters for the next delivery year','下一交付年度拍卖参数的发布']],
      ] },
      { t:'why', text:['All three are administrative variables set between auction vintages, none is diversifiable within Poland, and all three are decided before a project can respond. That is the argument for structuring rather than forecasting: a correction-factor sensitivity in the model, a connection long-stop tied to energisation, and an augmentation path that allows re-contracting at a higher factor together convert three unforecastable regulatory variables into three managed positions.',
        '三者均为在不同拍卖年份之间由行政确定的变量，在波兰境内均不可分散，且均在项目能够作出反应之前即已决定。这正是“以结构应对而非以预测应对”的理由：在模型中设置折减系数敏感性、将并网最终截止日挂钩送电、以及保留可按更高系数重新签约的增容路径，三者结合可将三个无法预测的监管变量转化为三项可管理的立场。'],
        sig:['Structure it, don’t forecast it','以结构应对，而非预测'] },
    ] },

    { t:'card', title:['Bridge to the detailed dashboard — the investor’s question map','进入详细看板 — 投资人的问题地图'], badges:['calc'], blocks:[
      { t:'walk', items:[
        ['03', ['Capacity Market','容量市场'], ['How much of the asset does the contract pay for?','合同为资产的多少部分付费？'], 'capacity'],
        ['04', ['Wholesale & Intraday','批发与日内'], ['How much of the spread is executable?','价差中有多少可执行？'], 'energy'],
        ['05', ['Balancing & Reserves','平衡与备用'], ['Is post-reform data being used?','是否采用了改革后的数据？'], 'services'],
        ['06', ['Storage Duration','储能时长'], ['Does the design meet the obligation, not just the factor?','设计是否满足义务，而不仅是系数？'], 'duration'],
        ['07', ['Pipeline','项目管线'], ['Who else arrives in my COD year?','投运年度还有谁会到场？'], 'pipeline'],
        ['08', ['Grid & Connection','并网'], ['Can the project connect and certify at all?','项目能否并网并通过认证？'], 'grid'],
      ] },
    ] },
  ] };
};

// ============================== CAPACITY MARKET ==============================
SEC_B.capacity = function (){
  return {
  head: ['Capacity Market — how much of the asset does the contract actually pay for?','容量市场 — 合同实际为资产的多少部分付费？'],
  cap: ['The Polish capacity payment is long, contracted and large enough to carry project debt. It is also an obligation: the unit must deliver during system stress events for the full contract term, and the correction factor decides how much of the nameplate is paid in the first place.',
        '波兰的容量付费期限长、已合同化，且规模足以支撑项目债务。它同时也是一项义务：机组须在整个合同期内于系统紧张事件中交付；而折减系数首先决定了铭牌容量中有多少获得付费。'],
  blocks: [
    { t:'card', mt:false, title:['Clearing price, contract length and contracted volume','出清价、合同期限与签约容量'], badges:['verify'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['Clearing price (seed, DY ' + O.cmDY + ')','出清价（种子，交付年' + O.cmDY + '）'], v:fmtN(O.cmPricePln) + '<small> PLN/kW/yr</small>', d:['≈ ' + fmtC(capEurKW) + '/kW de-rated/yr at ' + fmt1(M.fx) + ' PLN/EUR','按' + fmt1(M.fx) + ' PLN/EUR折算约' + fmtC(capEurKW) + '/kW折减/年'], b:['verify'] },
        { l:['New-build agreement length','新建协议年限'], v:O.cmAgreementYears + '<small> yr</small>', d:['the longest contracted revenue in this comparison set','本对比样本中期限最长的合同化收入'], b:['verify'] },
        { l:['BESS capacity contracted (seed)','已签约储能容量（种子）'], v:fmt1(O.cmAwardedBessGW) + '<small> GW</small>', d:['the competitive cohort that will connect before 2030','将于2030年前并网的竞争批次'], b:['verify'] },
        { l:['Capacity revenue per nameplate MW (4h)','每铭牌MW容量收入（4小时）'], v:fmtCk(perNameplate(4)) + '<small>/MW/yr</small>', d:['2h: ' + fmtCk(perNameplate(2)) + ' · 6h: ' + fmtCk(perNameplate(6)),'2小时：' + fmtCk(perNameplate(2)) + ' · 6小时：' + fmtCk(perNameplate(6))], b:['calc'] },
      ] },
      { t:'line', cfg:{ xs: M.cmYears, yfmt: v => fmtN(v), h: 240, ymin: 0,
        series:[{ name:['Clearing price (PLN/kW/yr, seed)','出清价（PLN/kW/年，种子）'], color:'var(--s1)', vals: M.cmPriceSeries }] } },
      { t:'proto', text:['These are seed values. Replace the clearing price, contract length and contracted volume with the published results for the specific delivery year before any transaction use — the entire contracted revenue line depends on them.',
        '此为种子数值。任何交易用途前，须以对应交付年度的官方公布结果替换出清价、合同期限与签约容量 — 整条合同化收入线均取决于这些数值。'] },
      { t:'why', text:['A ' + O.cmAgreementYears + '-year contract at roughly ' + fmtC(capEurKW) + '/kW de-rated/yr is what makes Polish storage conventionally financeable, and it is a one-shot outcome: the auction you enter fixes the price for the full term. Model a declining clearing-price path rather than the last print, because each successive auction attracts more qualified storage, and size the bid strategy as carefully as the capex budget — a project that fails to clear does not get a second attempt for that delivery year.',
        '一份期限' + O.cmAgreementYears + '年、价格约' + fmtC(capEurKW) + '/kW折减/年的合同，正是波兰储能具备常规可融资性的原因，且其为一次性结果：你参与的那次拍卖锁定了整个期限的价格。应按下降的出清价路径而非最近一次出清价建模，因为每一轮拍卖都会吸引更多合格储能；同时应像编制造价预算一样审慎地设计投标策略 — 未能出清的项目在该交付年度不会有第二次机会。'],
        sig:['One auction fixes seventeen years','一次拍卖锁定十七年'] },
      { t:'src', src: SRC.pse, use:['Auction clearing prices, contract lengths and contracted volumes','拍卖出清价、合同期限与签约容量'] },
    ] },

    { t:'card', title:['Correction factors — the regulator’s duration price','折减系数 — 监管方对时长的定价'], badges:['verify'], live:true, blocks:[
      { t:'table', head:[['Duration','时长'],['Correction factor','折减系数'],['Capacity revenue per nameplate MW','每铭牌MW容量收入'],['Uplift vs previous class','较上一档位增益']], num:[1,2,3],
        rows: M.derateHours.map((hh, i) => {
          const prev = i ? M.derateHours[i - 1] : null;
          return [{ b: [hh + 'h', hh + '小时'] }, fmtPct(M.deratingCurve[hh] * 100, 0), fmtCk(perNameplate(hh)),
            prev == null ? '—' : '+' + fmtCk(perNameplate(hh) - perNameplate(prev))];
        }) },
      { t:'bar', cfg:{ xs: M.derateHours.map(x => x + 'h'), bw: 40, yfmt: v => fmtCk(v), h: 250,
        series:[{ name:['Capacity revenue per nameplate MW','每铭牌MW容量收入'], color:'var(--s1)', vals: M.derateHours.map(hh => perNameplate(hh)) }] } },
      { t:'why', text:['The uplift column is the duration decision. Moving 2h → 4h adds ' + fmtCk(perNameplate(4) - perNameplate(2)) + '/MW/yr; 4h → 6h adds ' + fmtCk(perNameplate(6) - perNameplate(4)) + ' and 6h → 8h ' + fmtCk(perNameplate(8) - perNameplate(6)) + ', because the factor is flat above four hours. The mechanism pays for hours up to four and none after, so the capacity line argues firmly against building past four but, at 13.39%, only weakly for reaching it. Note the asymmetry of risk: the factor can be revised downward between vintages, while the ' + O.cmAgreementYears + '-year obligation attached to an existing contract cannot be revised at all.',
        '增益列即是时长决策。由2小时增至4小时可增加' + fmtCk(perNameplate(4) - perNameplate(2)) + '/MW/年；由4小时增至6小时增加' + fmtCk(perNameplate(6) - perNameplate(4)) + '，由6小时增至8小时增加' + fmtCk(perNameplate(8) - perNameplate(6)) + '，因为折减系数在四小时以上持平。该机制为四小时以内的小时数付费，其后不再付费；因此容量收入线明确反对建设超过四小时，但在13.39%的系数下，对达到四小时的支持力度很弱。须注意风险的不对称性：系数可在不同年份之间被下调，而既有合同所附带的' + O.cmAgreementYears + '年义务则完全无法修订。'],
        sig:['Factors fall; obligations do not','系数会下降，义务不会'] },
      { t:'src', src: SRC.corr, use:['Correction factors by technology and duration for the applicable auction','适用拍卖中按技术与时长的折减系数'] },
    ] },

    { t:'card', title:['Nameplate → paid capacity bridge (100 MW / 4h example)','铭牌至获付容量桥（100MW/4小时示例）'], badges:['calc','illus'], live:true, blocks:[
      { t:'wf', cfg:{ yfmt: v => fmtN(v) + ' MW', h: 270, zeroBase: true, steps: [
        { l:['Nameplate MW','铭牌MW'], v: 100, t:'start' },
        { l:['− connection capacity limit','− 并网容量限制'], v: -2, t:'d' },
        { l:['− usable AC fraction & auxiliaries','− 可用交流侧比例与站用电'], v: -6, t:'d' },
        { l:['× correction factor at 4h','×4小时折减系数'], v: -(92 - Math.round(92 * M.deratingCurve[4])), t:'d' },
        { l:['Contracted capacity obligation','合同容量义务'], v: Math.round(92 * M.deratingCurve[4]), t:'total' },
      ] } },
      { t:'why', text:['On a 4-hour design, 100 MW of nameplate carries a contracted obligation on roughly ' + fmtN(Math.round(92 * M.deratingCurve[4])) + ' MW. That number is both the revenue and the liability: it is what the project is paid for and what it must deliver during a system stress event. A 2-hour design certifies only MWh ÷ 4, so it carries an obligation on about ' + fmtN(100 * M.deratingCurve[2]) + ' MW: the four-hour rule pays a shorter battery less rather than letting it run out of energy when tested.',
        '在4小时设计下，100MW铭牌容量承载约' + fmtN(Math.round(92 * M.deratingCurve[4])) + 'MW的合同义务。该数字既是收入也是负债：既是项目获付费的对象，也是其在系统紧张事件中必须交付的量。2小时设计仅能按MWh÷4获得认证，因此其义务约为' + fmtN(100 * M.deratingCurve[2]) + 'MW：四小时规则使较短的电池少获付费，而不是让它在受检验时耗尽能量。'],
        sig:['The paid MW is also the owed MW','获付费的MW同时也是须交付的MW'] },
    ] },

    { t:'card', title:['The obligation side — what the contract requires','义务侧 — 合同的要求'], badges:['calc','verify'], live:false, blocks:[
      { t:'ladder', items:[
        { n:['1 · Certification','1 · 认证'], d:['The unit must be certified for the auction, with technical parameters and duration declared. A failed certification means no bid.','机组须通过拍卖认证并申报技术参数与时长。认证未通过即无法投标。'] },
        { n:['2 · Auction outcome','2 · 拍卖结果'], d:['Clear or not clear. There is no partial award and no second attempt for that delivery year.','要么出清要么落空。该交付年度不存在部分中标，也没有第二次机会。'] },
        { n:['3 · Delivery milestones','3 · 交付里程碑'], d:['Construction and commissioning milestones carry securities and penalties if missed.','建设与调试里程碑若未达成将触发保证金与罚则。'] },
        { n:['4 · Availability during stress events','4 · 紧张事件期间的可用性'], d:['Payment depends on delivering the obligation when the system calls, not on being connected.','付款取决于系统召唤时能否交付义务量，而非仅取决于已并网。'] },
        { n:['5 · Penalty exposure','5 · 罚则敞口'], d:['Non-delivery is penalised and capped, but the cap is a multiple of annual capacity revenue.','未交付将被处罚，罚金虽有上限，但该上限为年度容量收入的数倍。'] },
      ] },
      { t:'warn', text:['A capacity contract is a ' + O.cmAgreementYears + '-year commitment to deliver energy during system stress events. Model degradation against the declared duration over the full term — an asset that meets its obligation at commissioning and not in year twelve has a liability, not an annuity.',
        '容量合同是在系统紧张事件中交付能量的' + O.cmAgreementYears + '年承诺。须按申报时长对整个期限的衰减建模 — 若资产在调试时满足义务而在第十二年不满足，则其持有的是负债而非年金。'] },
      { t:'why', text:['This is the most under-modelled feature of the Polish market. Degradation is usually treated as a revenue haircut on the merchant line, but here it is a compliance question on the contracted line: usable duration must stay above the declared value for ' + O.cmAgreementYears + ' years. That makes the degradation covenant and the augmentation path contractual protections rather than technical refinements, and it is the second, quantified reason to build 4h rather than 2h.',
        '这是波兰市场中建模最不充分的特征。衰减通常被当作市场化收入的折减处理，但在此地它是合同化收入的合规问题：可用时长须在' + O.cmAgreementYears + '年内保持高于申报值。这使衰减契约与增容路径成为合同性保护而非技术性精细化，也是建设4小时而非2小时的第二个、可量化的理由。'],
        sig:['Degradation is a compliance question here','在此地衰减是合规问题'] },
    ] },
  ] };
};

// ============================== WHOLESALE & INTRADAY ==============================
SEC_B.energy = function (){
  const cod = state.codYear, cc = M.codCases[cod] || M.codCases[2029];
  return {
  head: ['Wholesale & Intraday — how much of the spread is executable?','批发与日内市场 — 价差中有多少可执行？'],
  cap: ['Merchant revenue sits on top of the capacity contract and is what determines equity returns rather than debt capacity. Two haircuts apply: the gap between published and executable spread, and the gap between today and the arrival of the contracted storage cohort.',
        '市场化收入叠加于容量合同之上，决定的是股权回报而非债务容量。存在两道折减：公布价差与可执行价差之间的差距，以及当前与已签约储能批次到场之间的差距。'],
  blocks: [
    { t:'card', mt:false, title:['Price level, spread and negative-price intervals','价格水平、价差与负电价时段'], badges:['illus'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['Day-ahead average (Q2 2026)','日前均价（2026年第二季度）'], v:fmtC(M.damSeries[5]) + '<small>/MWh</small>', d:['2025 average ' + fmtC(O.dam2025Eur) + ', PSE','2025年均值' + fmtC(O.dam2025Eur) + '，PSE'], b:['official'] },
        { l:['Average daily four-hour spread','日均四小时价差'], v:fmtC(M.spreadSeries[5]) + '<small>/MWh</small>', d:['widening as solar deepens the trough; PSE','随光伏加深低谷而扩大；PSE'], b:['official'] },
        { l:['Executable net margin','可执行净价差'], v:fmtC(60) + '<small>/MWh</small>', d:[fmtPct((1 - 60 / 88) * 100, 0) + ' of the published spread is not capturable','公布价差中' + fmtPct((1 - 60 / 88) * 100, 0) + '无法捕获'], cls:'down', b:['calc'] },
        { l:['Negative-price hours (2025, seed)','负电价小时数（2025，种子）'], v:'~' + fmtN(O.negHours) + '<small> h</small>', d:['the charging opportunity','充电机会'], b:['illus'] },
      ] },
      { t:'line', cfg:{ xs: M.pxLabels, yfmt: v => fmtC(v), h: 240, ymin: 0,
        series:[
          { name:['Day-ahead average','日前均价'], color:'var(--s1)', vals: M.damSeries },
          { name:['Average daily spread','日均价差'], color:'var(--s3)', vals: M.spreadSeries },
        ] } },
      { t:'why', text:['Note that the two lines move in opposite directions: average price falls as solar grows, while the daily spread widens. That is the storage business model in one chart — a battery does not care about the level, it cares about the shape. It also explains why a merchant thesis built on high average prices is the wrong thesis here: the price level will fall as coal retires and solar grows, and the spread is what pays.',
        '须注意两条线方向相反：随光伏增长平均电价下降，而日内价差扩大。这一张图即是储能商业模式 — 电池关心的不是电价水平而是价格形态。它同时解释了为何以高平均电价构建的市场化逻辑在此地是错误的：随着煤电退役与光伏增长，电价水平将下降，而付费的是价差。'],
        sig:['Shape pays, not level','付费的是形态，而非水平'] },
      { t:'src', src: SRC.tge, use:['Day-ahead and intraday price levels, spreads and negative-price intervals','日前与日内价格水平、价差及负电价时段'] },
    ] },

    { t:'card', title:['Published → executable margin bridge (€/MWh discharged)','公布至可执行价差桥（€/MWh放电）'], badges:['calc','illus'], live:true, blocks:[
      { t:'wf', cfg:{ yfmt: v => fmtC(v), h: 290, steps: M.spreadBridge } },
      { t:'why', text:['About ' + fmtPct((1 - 60 / 88) * 100, 0) + '% of the published spread is lost before it reaches the P&L. The deductions are ordinary — liquidity, efficiency, availability, charges and fees — rather than structural, because Poland is a self-dispatch market with no binding system-penetration limit standing between the price signal and the trade. The 15-minute settlement introduced in the balancing reform slightly improves the intraday re-trade uplift, which is the one line that moves in the sponsor’s favour.',
        '公布价差中约' + fmtPct((1 - 60 / 88) * 100, 0) + '%在进入损益表前即已损失。扣减项属常规性 — 流动性、效率、可用率、网络费用与其他费用 — 而非结构性，因为波兰是自调度市场，价格信号与实际交易之间不存在硬性的系统渗透率上限。平衡市场改革引入的15分钟结算略微提升了日内再交易增益，这是唯一对发起人有利的一项。'],
        sig:['Ordinary haircuts, one favourable line','折减属常规，仅一项有利'] },
    ] },

    { t:'card', title:['Captured spread by COD year — the contracted cohort arrives','按投运年度的捕获价差 — 已签约批次到场'], badges:['forecast','illus'], live:true, blocks:[
      { t:'band', cfg:{ xs: Object.keys(M.codCases), yfmt: v => fmtC(v), h: 260,
        low: Object.values(M.codCases).map(c => c.low),
        base: Object.values(M.codCases).map(c => c.central),
        high: Object.values(M.codCases).map(c => c.high) } },
      { t:'cmp', items:[
        { h:['Captured spread at COD ' + cod,'投运年' + cod + '的捕获价差'], v:fmtC(cc.central) + '/MWh',
          s:['low ' + fmtC(cc.low) + ' · high ' + fmtC(cc.high) + ' — the case spread is the real risk','低' + fmtC(cc.low) + ' · 高' + fmtC(cc.high) + ' — 情景间差距才是真实风险'] },
        { h:['Contracted storage already awarded','已中标的签约储能'], v:fmt1(O.cmAwardedBessGW) + ' GW',
          s:['this cohort is contracted to connect regardless of what the spread does','无论价差如何变化，该批次均已签约并网'] },
      ] },
      { t:'why', text:['The Polish saturation risk is unusually predictable because the competing capacity is already contracted: ' + fmt1(O.cmAwardedBessGW) + ' GW of storage holds capacity agreements that oblige it to connect. Unlike a merchant pipeline that may or may not arrive, this cohort has a contractual reason to be built. Model the central-to-high range rather than the central case alone, and remember that your own capacity contract is the hedge against exactly this — which is the argument for entering the auction rather than staying merchant.',
        '波兰的饱和风险异常可预测，因为竞争性容量已经签约：' + fmt1(O.cmAwardedBessGW) + 'GW储能持有容量协议，负有并网义务。与可能到场也可能不到场的市场化管线不同，该批次有合同上的建设理由。应对中性至高情景区间建模，而非仅取中性情景；并须记住你自身的容量合同正是对此的对冲 — 这也是应参与拍卖而非停留于市场化的理由。'],
        sig:['Competitors are contracted to arrive','竞争者已签约必将到场'] },
    ] },
  ] };
};

// ============================== BALANCING & RESERVES ==============================
SEC_B.services = function (){
  return {
  head: ['Balancing & Reserves — supplementary revenue on a post-reform basis','平衡与备用 — 改革后口径下的补充性收入'],
  cap: ['Balancing is a supplementary line in Poland because the capacity contract already provides the floor. The specific discipline here is temporal: the balancing reform changed settlement and dispatch, so pre-reform history is a different market.',
        '在波兰，平衡收入属补充性，因为容量合同已提供保底。此处特有的纪律是时间性的：平衡市场改革改变了结算与调度机制，因此改革前的历史属于另一个市场。'],
  blocks: [
    { t:'card', mt:false, title:['Reserve products — requirement, price and battery suitability','备用产品 — 需求、价格与电池适配度'], badges:['illus','verify'], live:true, blocks:[
      { t:'table', head:[['Product','产品'],['Direction','方向'],['Requirement (MW)','需求(MW)'],['Capacity price (€/MW/h)','容量价格(€/MW/h)'],['Battery suitability','电池适配度']], num:[2,3],
        rows: M.balProducts.map((p, i) => [
          { b: [p.id + ' — ' + p.n[0], p.id + ' — ' + p.n[1]] }, p.dir, fmtN(p.reqMW), fmtC(p.capEurMWh),
          i === 2 ? { chip:'warn', text:['Moderate — deep volume, low price','中等 — 量大价低'] } : { chip:'good', text:['High — power, not energy','高 — 需功率而非能量'] },
        ]) },
      { t:'bar', cfg:{ xs: M.balProducts.map(p => p.id), mode:'group', bw: 26, yfmt: v => fmtN(v), h: 240,
        series:[
          { name:['Requirement (MW)','需求(MW)'], color:'var(--s1)', vals: M.balProducts.map(p => p.reqMW) },
          { name:['Capacity price (€/MW/h)','容量价格(€/MW/h)'], color:'var(--s3)', vals: M.balProducts.map(p => p.capEurMWh) },
        ] } },
      { t:'why', text:['The familiar European shape: small, fast, power-based products pay the highest unit price and saturate first; the large, slow, energy-based product pays least per MW but has the deepest volume. A 4-hour Polish battery holding a capacity contract should target aFRR as its primary balancing product, and should size mFRR participation against the state-of-charge it must preserve for the capacity obligation — the two compete for the same energy.',
        '这是欧洲通行的形态：规模小、响应快、以功率为基础的产品单位价格最高且最先饱和；规模大、响应慢、以能量为基础的产品单位价格最低但成交量最深。持有容量合同的波兰4小时电池应以aFRR为主力平衡产品，并须对照为履行容量义务而须保留的荷电状态来确定mFRR参与规模 — 两者争夺同一批能量。'],
        sig:['mFRR competes with the capacity obligation','mFRR与容量义务争夺能量'] },
      { t:'src', src: SRC.bal, use:['Reserve procurement volumes, capacity prices and the post-reform framework','备用采购量、容量价格与改革后框架'] },
    ] },

    { t:'card', title:['aFRR capacity price trend — the saturation signal','aFRR容量价格趋势 — 饱和信号'], badges:['illus'], live:true, blocks:[
      { t:'line', cfg:{ xs: M.pxLabels, yfmt: v => fmtC(v), h: 220, ymin: 0,
        series:[{ name:['aFRR capacity price (€/MW/h, seed)','aFRR容量价格（€/MW/h，种子）'], color:'var(--s6)', vals: M.afrrCapSeries }] } },
      { t:'why', text:['The aFRR capacity price is down ' + fmtPct(Math.abs(M.afrrCapSeries[5] / M.afrrCapSeries[0] - 1) * 100, 0) + '% over six quarters as more capable capacity certifies — the same pattern observed in GB, Ireland and Romania, arriving in Poland with ' + fmt1(O.cmAwardedBessGW) + ' GW of contracted storage still to connect. Model this line flat at best and exclude it from debt sizing; the capacity contract is what lenders will size against, and that is a structural advantage rather than a limitation.',
        '随着更多有能力的容量通过认证，aFRR容量价格在六个季度内下降' + fmtPct(Math.abs(M.afrrCapSeries[5] / M.afrrCapSeries[0] - 1) * 100, 0) + '% — 与英国、爱尔兰及罗马尼亚观察到的模式相同，而波兰尚有' + fmt1(O.cmAwardedBessGW) + 'GW已签约储能待并网。该收入线最多按持平建模并排除于债务规模测算之外；贷款人据以安排规模的是容量合同，而这是结构性优势而非限制。'],
        sig:['Contracted storage will compress this further','已签约储能将进一步压缩该价格'] },
    ] },

    { t:'card', title:['Evidence ladder — underwrite only to the tier the project has reached','证据阶梯 — 只按项目已达到的层级承销'], badges:['calc'], live:false, blocks:[
      { t:'ladder', items: M.evidenceLadder },
      { t:'warn', text:['Any backtest that spans the ' + O.balancingReformYear + ' balancing reform is measuring two different markets. Split the dataset at the reform date and use post-reform data only — a blended series will overstate or understate the line depending on which side dominates the sample.',
        '任何跨越' + O.balancingReformYear + '年平衡市场改革的回测，实际上在衡量两个不同的市场。应在改革日期分割数据集并仅使用改革后数据 — 混合序列会因样本中哪一侧占主导而高估或低估该收入线。'] },
      { t:'why', text:['At ' + fmtCk(M.lab.servicesKW * 1000) + '/MW/yr the balancing line is roughly ' + fmtPct(M.lab.servicesKW * 1000 / (perNameplate(4) + plMerchantPerMW(4) + M.lab.servicesKW * 1000) * 100, 0) + '% of a 4-hour asset’s gross revenue — small enough that removing it entirely should not break the investment case, and in Poland it genuinely does not, because the capacity contract carries the debt. That is the practical benefit of a capacity mechanism: it makes the least-evidenced revenue line optional rather than load-bearing.',
        '按' + fmtCk(M.lab.servicesKW * 1000) + '/MW/年计，平衡收入约占4小时资产毛收入的' + fmtPct(M.lab.servicesKW * 1000 / (perNameplate(4) + plMerchantPerMW(4) + M.lab.servicesKW * 1000) * 100, 0) + ' — 其规模小到即使完全剔除也不应影响投资结论；而在波兰它确实不会，因为容量合同承担了债务。这正是容量机制的实务益处：它使证据最薄弱的收入线成为可选项而非承重项。'],
        sig:['The capacity contract makes this optional','容量合同使该收入成为可选项'] },
    ] },
  ] };
};

// ============================== STORAGE DURATION ==============================
SEC_B.duration = function (){
  const dni = liveScore('durFactors'), band = bandFor(M.durBands, dni);
  return {
  head: ['Storage Duration — does the design meet the obligation, not just the factor?','储能时长 — 设计是否满足义务，而不仅是系数？'],
  cap: ['Poland pays for duration twice: through the correction factor at the auction, and through the capacity obligation during system stress events. The second is the one most often missed, and it is a compliance requirement rather than a revenue optimisation.',
        '波兰为时长付费两次：通过拍卖中的折减系数，以及通过系统紧张事件期间的容量义务。后者最常被忽略，且它是合规要求而非收入优化。'],
  blocks: [
    { t:'card', mt:false, title:['Duration answers three different questions','时长回答三个不同问题'], badges:['calc','verify'], live:false, blocks:[
      { t:'table', head:[['Question','问题'],['Mechanism','机制'],['Answer for Poland at 2h → 4h','波兰由2小时增至4小时的答案']], rows:[
        [{b:['How much capacity revenue?','容量收入多少？']}, ['Correction factor at the auction','拍卖中的折减系数'],
         [fmtPct(M.deratingCurve[2] * 100, 0) + ' → ' + fmtPct(M.deratingCurve[4] * 100, 0) + ' of nameplate; +' + fmtCk(perNameplate(4) - perNameplate(2)) + '/MW/yr for ' + O.cmAgreementYears + ' years',
          '折减系数由' + fmtPct(M.deratingCurve[2] * 100, 0) + '升至' + fmtPct(M.deratingCurve[4] * 100, 0) + '；每MW/年增加' + fmtCk(perNameplate(4) - perNameplate(2)) + '，持续' + O.cmAgreementYears + '年']],
        [{b:['How much merchant revenue?','市场化收入多少？']}, ['Deeper cycles across a solar-driven price shape','在光伏驱动的价格形态中进行更深循环'],
         ['Positive but sub-linear — 4h captures ' + fmtPct(M.durSpreadFactor[4] * 100, 0) + ' of the 2h spread capture rate',
          '为正但呈次线性 — 4小时的价差捕获率为2小时的' + fmtPct(M.durSpreadFactor[4] * 100, 0)]],
        [{b:['Can I meet the obligation?','能否履行义务？']}, ['Capacity obligation during multi-hour system stress events','多小时系统紧张事件期间的容量义务'],
         ['Settled by certification. Capacity counts only as MWh ÷ 4, so a certified obligation can be delivered for four hours by construction; a 2h asset is paid less, not exposed more.',
          '由认证规则解决。容量仅按MWh÷4计入，因此经认证的义务按设计即可连续交付四小时；2小时资产是少获付费，而非承担更大敞口。']],
      ] },
      { t:'wf', cfg:{ yfmt: v => fmtC(v) + 'k', h: 280, steps: M.marginalHour } },
      { t:'why', text:['The fourth hour nets about ' + fmtC(M.marginalHour[M.marginalHour.length - 1].v) + 'k/MW/yr on the arithmetic. The correction factor now adds only a few thousand for hours three and four, because the factor is 13.39% at every duration and a battery below four hours simply certifies less. The certification rule also removes the old argument for four hours: an obligation sized at MWh ÷ 4 cannot run out of energy when tested. In Poland the case for the fourth hour now rests on the merchant line and on balancing, not on the capacity contract.',
        '按算术计算，第4小时净值约' + fmtC(M.marginalHour[M.marginalHour.length - 1].v) + 'k/MW/年。折减系数对第三、第四小时的贡献已仅为数千欧元，因为各时长的系数均为13.39%，不足四小时的电池只是获认证的容量更少。认证规则也消除了支持四小时的旧论据：按MWh÷4确定的义务在受检验时不会耗尽能量。在波兰，第四小时的理由如今取决于市场化收入与平衡市场，而非容量合同。'],
        sig:['The capacity contract no longer pays for the fourth hour','容量合同已不再为第四小时付费'] },
    ] },

    { t:'card', title:['Duration-Need Index — every component visible and editable','时长需求指数 — 分项全部可见、可编辑'], badges:['calc','illus'], live:true, blocks:[
      { t:'scorecard', id:'durFactors', bands:'durBands' },
      { t:'why', text:['The index sits at ' + dni + '/100 — ' + L(band.n) + '. Three factors score 3: the correction-factor uplift, solar-driven trough depth and negative-price frequency. All three point to the same design, which is unusual — in most markets the physical and regulatory signals disagree on duration. The one factor holding the index down is cross-border coupling, because Poland is well interconnected and imports damp extreme spreads. Read together: 4h is supported by both the mechanism and the physics.',
        '该指数为' + dni + '/100 — ' + L(band.n) + '。有三个因子评分为3：折减系数增益、光伏驱动的低谷深度、以及负电价频率。三者指向同一设计，这并不常见 — 在多数市场中，物理信号与监管信号在时长上并不一致。唯一压低指数的因子是跨境耦合，因为波兰互联良好，进口平抑了极端价差。综合解读：4小时同时获得机制与物理两方面的支持。'],
        sig:['Mechanism and physics agree on 4h','机制与物理在4小时上一致'] },
    ] },

    { t:'card', title:['Augmentation readiness — protecting the obligation over 17 years','增容准备度 — 在十七年内保护容量义务'], badges:['illus'], live:false, blocks:[
      { t:'aug' },
      { t:'why', text:['In Poland augmentation is a compliance tool as much as a value tool. Usable duration must stay above the declared value for the full ' + O.cmAgreementYears + '-year obligation, so an augmentation path is what keeps a degrading asset compliant in years twelve to seventeen. The two items most often lost are the coverage of added MWh in the connection conditions and in the building permit — both are cheap at the outset and effectively impossible to retrofit.',
        '在波兰，增容既是价值工具也是合规工具。可用时长须在整个' + O.cmAgreementYears + '年义务期内保持高于申报值，因此增容路径正是使衰减中的资产在第十二至十七年仍保持合规的手段。最常被遗漏的两项是并网条件与建设许可对新增MWh的覆盖 — 两者在起始阶段成本低廉，事后则几乎无法补救。'],
        sig:['Augmentation keeps you compliant, not just richer','增容不仅带来收益，更保障合规'] },
    ] },
    
    /* Relocated from the Investment Lab tab, which moved to a dedicated page. The
       duration question is a market question — where the de-rating uplift stops
       covering the MWh capex — so it belongs beside the rest of this tab rather
       than inside a returns model. */
    { t:'card', title:['Duration and route — what each design is worth','时长与路径 — 各设计的价值'], badges:['calc'], live:false, blocks:[
      { t:'designFit' },
      { t:'cap', text:['Every route this market supports, at every duration it declares, priced by the comparison engine the league table uses; at the modelled duration it is the league table case itself. Value is the exit value at commercial operation, at the platform exit yields, less net capital, per MW. A design within 2% of the capital of the modelled design of the best one is in the band. A route priced at one duration is shown there only, and a duration floor must hold to the end of its term.',
        '本市场支持的每一条路径、在其声明的每一个时长下，均由排行榜所用的同一比较引擎定价；在当前模型时长下即为排行榜本身的情景。价值为投运时按平台退出收益率计算的退出价值减去净资本，按每MW计。与最佳设计相差不超过当前模型设计资本2%的设计视为位于区间之内。仅在单一时长下定价的路径只在该时长下显示，且时长下限须维持至期限结束。'] },
      { t:'why', text:['Judge a duration on what it adds to value, not on headline IRR: a longer asset can carry a lower IRR and a higher value, and the capital committed differs several-fold down this table. Read the band before the best point, because inside it the inputs cannot separate the designs.',
        '判断时长应看其对价值的贡献，而非项目整体IRR：更长的资产可能IRR更低而价值更高，且本表各行所投入的资本相差数倍。应先看区间，再看最佳点，因为在区间之内，输入数据无法区分各设计。'],
        sig:['Read the band, then the best point','先看区间，再看最佳点'] },
    ] },
  ] };
};

// ============================== PIPELINE ==============================
SEC_B.pipeline = function (){
  const mw = pipelineByYear('MW');
  const totRaw = mw.raw.reduce((a, b) => a + b, 0), totPw = mw.pw.reduce((a, b) => a + b, 0);
  return {
  head: ['Project Pipeline — probability-weighted, with MW and MWh separated','项目管线 — 概率加权，MW与MWh分列'],
  cap: ['A pipeline is a distribution, not a number. In Poland the decisive gate is the capacity contract: a project holding one has a contractual reason to be built, and everything below that gate is optional.',
        '管线是一个分布而非一个数字。在波兰，决定性门槛是容量合同：持有合同的项目有合同上的建设理由，而该门槛之下的一切都是可选的。'],
  blocks: [
    { t:'card', mt:false, title:['Stage probabilities — the gate is the discount','阶段概率 — 门槛即折减'], badges:['calc'], live:false, blocks:[
      { t:'stageProb' },
      { t:'why', text:['The decisive probability step is certification (55%) to a capacity contract plus connection agreement (80%). That 25-point jump is larger than in any other market in this comparison set, because a Polish capacity contract creates a legal obligation to deliver rather than merely an economic incentive. When assessing competitors, the only question that matters is whether they hold a contract — everything below that gate is genuinely optional and should be weighted accordingly.',
        '决定性的概率跃迁是由通过认证（55%）到取得容量合同加并网协议（80%）。这25个百分点的跳升大于本对比样本中的任何其他市场，因为波兰的容量合同产生的是法定交付义务，而非仅仅是经济激励。评估竞争者时，唯一重要的问题是其是否持有合同 — 该门槛之下的一切确实是可选的，应据此加权。'],
        sig:['A contract is an obligation to build','合同即是建设义务'] },
    ] },
    { t:'g2', cards:[
      { title:['COD pipeline by year — MW','按投运年度的管线 — MW'], badges:['illus'], live:true, blocks:[
        { t:'pipeChart', unit:'MW' },
        { t:'why', text:['Probability weighting removes ' + fmtPct((1 - totPw / totRaw) * 100, 0) + '% of announced MW across the seed register. In Poland the weighting is more reliable than elsewhere because the top stages are contractually obliged to deliver — which means the probability-weighted figure is closer to a forecast and further from an estimate.',
          '在种子登记表中，概率加权剔除了已公告MW的' + fmtPct((1 - totPw / totRaw) * 100, 0) + '%。在波兰，该加权比其他市场更可靠，因为顶层阶段负有合同交付义务 — 这意味着概率加权数值更接近预测，而非估算。'],
          sig:['Weighting is more reliable here','此处的加权更可靠'] },
      ] },
      { title:['COD pipeline by year — MWh','按投运年度的管线 — MWh'], badges:['illus'], live:true, blocks:[
        { t:'pipeChart', unit:'MWh' },
        { t:'why', text:['MWh predicts spread compression; MW predicts capacity-auction competition. In Poland both matter and they arrive together, because the correction factor pushes new build toward 4 hours — so each contracted MW brings more MWh than the operating fleet average, compressing the spread faster than the MW count alone implies.',
          'MWh预测价差压缩；MW预测容量拍卖竞争。在波兰两者都重要且同步到来，因为折减系数推动新建走向4小时 — 因此每一个签约MW带来的MWh高于在运机组平均水平，其对价差的压缩速度快于仅看MW数量所显示的水平。'],
          sig:['4h new build compresses spreads faster','4小时新建对价差的压缩更快'] },
      ] },
    ] },
    { t:'card', title:['Project register — illustrative placeholders, not real facilities','项目登记表 — 示例占位，非真实项目'], badges:['illus'], live:true, blocks:[
      { t:'projTable' },
      { t:'note', text:['All projects shown are illustrative placeholders, tagged by region so locational concentration can be checked. Replace with a register built from the capacity-market certification and award lists cross-referenced against issued connection conditions before any transaction use.',
        '所示项目均为示例占位，并按地区标注以便检查区位集中度。任何交易用途前，须以容量市场认证与中标名单、并与已签发的并网条件交叉核对后构建的登记数据替换。'] },
      { t:'src', src: SRC.pse, use:['Certification register and capacity-auction award lists','认证登记册与容量拍卖中标名单'] },
    ] },
  ] };
};

// ============================== GRID & CONNECTION ==============================
SEC_B.grid = function (){
  return {
  head: ['Grid & Connection — the gate that decides both revenue lines','并网 — 决定两条收入线的门槛'],
  cap: ['Connection is the binding constraint on Polish storage, and it is unusual because it gates the capacity auction as well as the physical build. A connection failure removes the contracted and the merchant revenue lines simultaneously.',
        '并网是波兰储能的关键约束，且其特殊之处在于：它不仅决定实体建设，也决定能否参与容量拍卖。并网失败将同时移除合同化与市场化两条收入线。'],
  blocks: [
    { t:'card', mt:false, title:['Nameplate → revenue bridge','铭牌容量至收入桥'], badges:['calc','illus'], live:true, blocks:[
      { t:'flow', items:[
        ['Connection application','并网申请'], ['Connection conditions issued','已签发并网条件'],
        ['Executed connection agreement','已签并网协议'], ['Certification for the capacity auction','容量拍卖认证'],
        ['Capacity contract awarded','取得容量合同'], ['Energisation & market registration','送电与市场注册'],
      ] },
      { t:'ladder', items:[
        { n:['Connection application','并网申请'], d:['Not evidence. Applications substantially exceed available capacity and refusals are common.','不构成证据。申请量大幅超过可用容量，拒批常见。'] },
        { n:['Connection conditions','并网条件'], d:['The first tier that is evidence, with a defined capacity and validity period. This is also what enables certification.','第一个构成证据的层级，载明容量与有效期。它同时也是通过认证的前提。'] },
        { n:['Executed connection agreement','已签并网协议'], d:['Works scope, cost allocation and delivery schedule become binding.','工程范围、费用分担与交付进度在此具备约束力。'] },
        { n:['Certification','认证'], d:['Technical parameters and duration are declared to the auction. A declaration that cannot be met later becomes a penalty.','向拍卖申报技术参数与时长。日后无法满足的申报将转化为罚金。'] },
        { n:['Capacity contract','容量合同'], d:['The revenue line and the obligation begin here. Everything before it is development risk.','收入线与义务自此开始。此前的一切均属开发风险。'] },
      ] },
      { t:'why', text:['Five tiers with a compounding failure mode. In an energy-only market a connection delay costs a year of spread; in Poland it can cost the auction, and with it the ' + O.cmAgreementYears + '-year contract that makes the project financeable at all. That asymmetry is why Polish diligence should be front-loaded onto the connection and certification chain, and why a long-stop tied to energisation is worth more here than in any other market in this set.',
        '五个层级，且存在叠加失效模式。在单一电能量市场中，并网延迟的代价是一年的价差；在波兰，其代价可能是错过拍卖，进而失去使项目得以融资的' + O.cmAgreementYears + '年合同。这一不对称正是波兰的尽调应前置于并网与认证链条的原因，也是将最终截止日挂钩送电在本样本中于此地价值最高的原因。'],
        sig:['A connection delay can cost the contract','并网延迟可能导致失去合同'] },
    ] },

    { t:'card', title:['Why connection is rationed — and what that means for competition','并网为何受配给 — 及其对竞争的含义'], badges:['verify'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['Connection pipeline (seed)','并网管线（种子）'], v:fmt1(O.pipelineGW) + '<small> GW</small>', d:['against ' + fmtN(O.fleetMW) + ' MW operating','对比在运' + fmtN(O.fleetMW) + 'MW'], b:['illus'] },
        { l:['Contracted storage (seed)','已签约储能（种子）'], v:fmt1(O.cmAwardedBessGW) + '<small> GW</small>', d:['the subset with a contractual obligation to connect','其中负有合同并网义务的部分'], b:['verify'] },
        { l:['Pipeline / operating multiple','管线对在运倍数'], v:fmt1(O.pipelineGW * 1000 / O.fleetMW) + '<small>×</small>', d:['most of it will not obtain connection conditions','其中大部分无法取得并网条件'], b:['calc'] },
        { l:['Primary rationing mechanism','主要配给机制'], v:L(['Connection refusals','并网拒批']), d:['not capital, permitting or policy','并非资本、许可或政策'], b:['verify'] },
      ] },
      { t:'why', text:['A pipeline of ' + fmt1(O.pipelineGW) + ' GW against ' + fmtN(O.fleetMW) + ' MW operating would be alarming if it could all connect. It cannot — connection capacity is the rationing mechanism, and refusals are the normal outcome rather than the exception. The practical consequence for competitive analysis is that the only competitor worth counting is one that already holds connection conditions and a capacity contract; ' + fmt1(O.cmAwardedBessGW) + ' GW meets that test and the rest should be weighted at a fraction of face value.',
        '若' + fmt1(O.pipelineGW) + 'GW的管线能全部并网，相对于在运的' + fmtN(O.fleetMW) + 'MW将令人警惕。但它不能 — 并网容量是配给机制，拒批是常态而非例外。对竞争分析的实务含义是：唯一值得计入的竞争者是已同时持有并网条件与容量合同者；符合该标准的为' + fmt1(O.cmAwardedBessGW) + 'GW，其余应按面值的一小部分加权。'],
        sig:['Count only contracted competitors','只计入已签约的竞争者'] },
      { t:'src', src: SRC.conn, use:['Connection conditions issuance and refusal statistics','并网条件签发与拒批统计'] },
    ] },

    { t:'card', title:['Connection risk → suggested commercial protections','并网风险 → 建议商业保护条款'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Risk','风险'],['Protection','保护条款'],['Trigger to invoke','触发条件']], rows:[
        [{b:['Connection conditions expire or capacity reduced','并网条件失效或容量被削减']},
         ['Validity-period covenant with an extension obligation and a price adjustment per MW of shortfall','有效期契约，附延期义务及按缺口MW调整价款'],
         ['Less than twelve months of validity remaining at signing','签约时剩余有效期不足十二个月']],
        [{b:['Works programme slips past the auction certification window','工程计划落后于拍卖认证窗口']},
         ['Long-stop tied to energisation, not to agreement execution; damages for a missed auction year','最终截止日挂钩送电而非协议签署；对错过拍卖年度约定赔偿'],
         ['Any revision to the network works schedule','网络工程进度的任何修订']],
        [{b:['Declared duration cannot be met over the contract term','申报时长在合同期内无法维持']},
         ['Degradation covenant keeping usable duration above the declared value, plus a documented augmentation path','衰减契约以维持可用时长高于申报值，并附有据可查的增容路径'],
         ['Modelled year-' + O.cmAgreementYears + ' duration within 10% of the declared value','模型第' + O.cmAgreementYears + '年时长距申报值不足10%']],
        [{b:['Correction factor revised downward before award','中标前折减系数被下调']},
         ['Sensitivity in the model and a price adjustment mechanism between signing and auction','模型中设置敏感性分析，并在签约至拍卖之间设定价款调整机制'],
         ['Publication of a revised correction-factor table','修订后折减系数表的发布']],
        [{b:['Reinforcement cost reallocated to the project','网络加强费用被重新分配给项目']},
         ['Cost-sharing cap above an agreed threshold with clear delivery responsibility','超出约定阈值的成本分担上限及明确的交付责任划分'],
         ['Any revision to the works scope or cost estimate','工程范围或费用估算的任何修订']],
      ] },
      { t:'why', text:['Every protection here converts a timing or regulatory risk into a priced or allocated one. The two that are distinctively Polish are the long-stop tied to energisation with damages for a missed auction year, and the degradation covenant tied to the declared duration — the first because missing the auction costs the contract rather than a year, and the second because the obligation runs for ' + O.cmAgreementYears + ' years while the asset degrades throughout.',
        '此处每项保护都把时点或监管风险转化为可定价或可分配的风险。真正属波兰特有的是两项：将最终截止日挂钩送电并对错过拍卖年度约定赔偿，以及与申报时长挂钩的衰减契约 — 前者因为错过拍卖损失的是合同而非一年，后者因为义务持续' + O.cmAgreementYears + '年而资产在此期间持续衰减。'],
        sig:['Missing the auction costs the contract','错过拍卖即失去合同'] },
    ] },
  ] };
};

// ============================== POLAND vs ROMANIA (peer benchmark) ==============================
// Mirrors the WA dashboard's "WEM vs NEM" section: the only tab that uses peer-market
// data, held in a separate namespace and excluded from every Poland scoring input.
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
SEC_B.portfolio = function (){
  const inp = labInputs(), r = labModel(inp);
  const dn = labModel(inp, { spreadFactor: 0.75, svcFactor: 0.7, capFactor: 0.9, noGrant: true });
  return {
  head: ['Portfolio / Fund View — applying the Polish thesis to a screened opportunity','组合与基金视图 — 将波兰逻辑应用于所筛选机会'],
  cap: ['A worked screening example using the Investment Lab assumptions. All project-specific content is confined to this tab and is illustrative — it demonstrates the gate sequence an investment committee should apply, not a real transaction.',
        '使用投资测算假设的筛选示例。所有项目层面内容均限于本页且为示例性质 — 用于演示投委会应遵循的门槛顺序，而非真实交易。'],
  blocks: [
    { t:'card', mt:false, title:['Screened opportunity — institutional screening snapshot','所筛选机会 — 机构筛选快照'], badges:['illus'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Configuration','配置'], v:fmtN(inp.mw) + ' MW / ' + fmtN(inp.mw * inp.hours) + '<small> MWh</small>', d:[inp.hours + '-hour design — matches the correction-factor inflection','' + inp.hours + '小时设计 — 与折减系数拐点一致'] },
        { l:['Target COD','目标投运'], v:state.codYear, d:['auction vintage and saturation case both follow from this','拍卖年份与饱和情景均由此决定'] },
        { l:['Total capex','总资本开支'], v:fmtCM(r.capex), d:[fmtC(inp.capexKWh) + '/kWh + ' + fmtC(inp.capexKW) + '/kW', fmtC(inp.capexKWh) + '/kWh + ' + fmtC(inp.capexKW) + '/kW'], b:['model'] },
        { l:['Contracted capacity obligation','合同容量义务'], v:fmtN(r.capMW) + '<small> MW</small>', d:[fmtPct(r.derate * 100) + ' of nameplate — paid and owed','相当于铭牌的' + fmtPct(r.derate * 100) + ' — 既获付费也须交付'], b:['calc'] },
        { l:['Year-1 EBITDA','第1年EBITDA'], v:fmtCM(r.ebitda1), d:['unlevered IRR ' + fmtIRR(r.unlevIRR),'无杠杆IRR ' + fmtIRR(r.unlevIRR)], b:['calc'] },
        { l:['Min DSCR — lender downside','最低偿债覆盖率 — 贷款人下行'], v:fmtX(dn.minDSCR), d:['base case ' + fmtX(r.minDSCR),'基准情景 ' + fmtX(r.minDSCR)], cls: dn.minDSCR != null && dn.minDSCR < 1.3 ? 'down' : '', b:['calc'] },
      ] },
      { t:'ic', b:['Screening conclusion: ','筛选结论：'],
        text:['A Polish screening decision turns on two questions and one document: will the project certify and clear the auction, and can it meet the declared duration for the full obligation term — evidenced by connection conditions with adequate capacity. Everything else, including the price forecast, is second-order. A project without a realistic auction pathway should be priced as development risk, not as infrastructure.',
              '波兰的筛选决策取决于两个问题与一份文件：项目能否通过认证并在拍卖中出清，以及能否在整个义务期内维持申报时长 — 其证据为容量充足的并网条件。其余一切，包括价格预测，均属次要。若项目缺乏现实的拍卖路径，应按开发风险而非按基础设施定价。'] },
    ] },
    { t:'card', title:['Revenue stack — evidence status of each line','收入结构 — 各收入项的证据状态'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Revenue line','收入项'],['Year-1 amount','第1年金额'],['Evidence status','证据状态'],['Treatment in the model','模型处理方式']], num:[1], rows:[
        [{b:['Capacity contract','容量合同']}, fmtCM(r.capRev), {chip:'good', text:['Auction-cleared price and correction factor','拍卖出清价与折减系数']},
         ['Contracted for ' + inp.capYrs + ' years; supports debt sizing — net of a stressed non-delivery case','锁定' + inp.capYrs + '年；扣除未交付压力情景后支撑债务规模']],
        [{b:['Wholesale arbitrage','批发套利']}, fmtCM(r.arb1), {chip:'warn', text:['Executable margin, saturation-diluted','可执行价差，已按饱和稀释']},
         ['Equity return driver; stressed against the contracted competitor cohort','股权回报驱动；须对照已签约竞争批次施加压力']],
        [{b:['Balancing & reserves','平衡与备用']}, fmtCM(r.svc1), {chip:'warn', text:['Post-reform data only','仅采用改革后数据']},
         ['Capped at trailing twelve months; excluded from debt sizing','以过去12个月封顶；排除于债务规模测算']],
        [{b:['Capital support','资本支持']}, fmtCM(r.grant), {chip:'warn', text:['Programme-dependent; award required','取决于具体项目；须取得授予']},
         ['A capex reduction, not revenue; removed in the lender case','属资本开支减项而非收入；在贷款人情景中剔除']],
        [{b:['Fixed opex','固定运维']}, '−' + fmtCM(r.opex), {chip:'good', text:['LTSA and O&M contracted','长期服务协议与运维已签约']},
         ['Check warranty cycling limits against the ' + inp.cycles + ' cycles/day assumption over ' + inp.capYrs + ' years','须核对质保循环限制与' + inp.capYrs + '年内每日' + inp.cycles + '次循环假设是否一致']],
      ] },
      { t:'why', text:['The contracted share is ' + fmtPct(r.capRev / (r.capRev + r.arb1 + r.svc1) * 100, 0) + '% of gross revenue — the highest in this comparison set and the reason Polish storage attracts conventional infrastructure capital. But note the last row: an LTSA cycling limit that constrains the asset in year twelve is a capacity-obligation problem, not just a warranty problem, because the obligation runs the full ' + inp.capYrs + ' years. Align the warranty term, the cycling limit and the obligation term before signing any of them.',
        '合同化收入占毛收入的' + fmtPct(r.capRev / (r.capRev + r.arb1 + r.svc1) * 100, 0) + ' — 为本对比样本中最高，也是波兰储能能够吸引常规基础设施资本的原因。但须注意最后一行：若长期服务协议的循环限制在第十二年约束资产，那是容量义务问题而非单纯的质保问题，因为义务持续整个' + inp.capYrs + '年。应在签署任一文件之前，先使质保期限、循环限制与义务期限相互对齐。'],
        sig:['Align warranty, cycling and obligation terms','使质保、循环与义务期限对齐'] },
    ] },
    { t:'card', title:['Investment Committee gates — what must be true before capital is released','投委会门槛 — 资金拨付前必须成立的条件'], badges:['calc'], live:false, blocks:[
      { t:'gates', items:[
        { n:['Gate 1 — Connection','门槛1 — 并网'], d:['Connection conditions with adequate capacity and sufficient remaining validity, plus an executed connection agreement.','容量充足且剩余有效期足够的并网条件，加已签并网协议。'], c:'warn', s:['Evidence required','需提供证据'] },
        { n:['Gate 2 — Certification','门槛2 — 认证'], d:['A realistic pathway to certify for the intended auction, with the correction-factor table of that vintage applied in the model.','具备参与目标拍卖认证的现实路径，且模型采用该年份对应的折减系数表。'], c:'warn', s:['Vintage-specific','须与拍卖年份一致'] },
        { n:['Gate 3 — Obligation','门槛3 — 容量义务'], d:['Declared duration maintained above the obligation for the full term, evidenced by a degradation model and an augmentation path.','申报时长在整个期限内维持高于义务水平，并以衰减模型与增容路径为证。'], c:'serious', s:['Full-term test','须做全期限检验'] },
        { n:['Gate 4 — Downside coverage','门槛4 — 下行覆盖'], d:['Minimum DSCR of at least 1.30x with the spread and balancing stressed and no capital support assumed.','在价差与平衡收入承压且不假设资本支持的情况下，最低偿债覆盖率不低于1.30x。'], c: dn.minDSCR != null && dn.minDSCR >= 1.3 ? 'good' : 'critical', s: dn.minDSCR != null && dn.minDSCR >= 1.3 ? ['Met','已满足'] : ['Not met','未满足'] },
        { n:['Gate 5 — Exit specification','门槛5 — 退出规格'], d:['A capacity contract in hand plus an operating record makes the asset conventional infrastructure at exit — design for that buyer from the start.','持有容量合同并具备运营记录，可使资产在退出时成为常规基础设施 — 应自始按该类买家设计。'], c:'good', s:['Achievable here','在此可实现'] },
      ] },
      { t:'why', text:['The gates are ordered so the cheapest test comes first, and Poland is the one market in this set where Gate 5 is comfortably achievable — a capacity contract plus an operating record is exactly what pension-backed infrastructure buyers want. That makes Gate 3 the one that deserves the most scrutiny: an asset that clears the auction but cannot meet its obligation in year twelve has sold a ' + inp.capYrs + '-year liability at a ' + inp.capYrs + '-year price.',
        '门槛按“最便宜的检验优先”排序，而波兰是本样本中第5关可轻松达成的唯一市场 — 持有容量合同并具备运营记录，正是养老金支持的基础设施买家所需。因此最值得审视的是第3关：若资产通过拍卖却在第十二年无法履行义务，那么它是以' + inp.capYrs + '年的价格出售了一项' + inp.capYrs + '年的负债。'],
        sig:['Gate 3 deserves the most scrutiny','第3关最值得审视'] },
    ] },
  ] };
};

// ============================== DATA & METHODOLOGY ==============================
SEC_B.data = function (){
  const srcs = [SRC.pse, SRC.corr, SRC.tge, SRC.bal, SRC.ure, SRC.conn, SRC.nfos, SRC.entsoe, SRC.opcom];
  return {
  head: ['Data & Methodology — source registry, formulas and quality badges','数据与方法 — 数据源登记、公式与质量标识'],
  cap: ['Every figure in this dashboard carries a quality badge and a namespace. This is a from-scratch draft, so the capacity-market figures in particular are seed values badged "verify against current documents" and must be replaced with published results before any investment use.',
        '本看板中每个数值均带有质量标识与命名空间。本版本为从零起草，因此容量市场数值尤属标注“须以现行文件核验”的种子数值，任何投资用途前须以官方公布结果替换。'],
  blocks: [
    { t:'card', mt:false, title:['Source hierarchy — which source may answer which question','来源层级 — 何种来源可回答何种问题'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Question','问题'],['Only acceptable source','唯一可接受来源'],['Never acceptable','不可接受']], rows:[
        [{b:['What will capacity revenue be?','容量收入将是多少？']}, ['Published auction results plus the correction-factor table for that vintage','官方公布的拍卖结果加该年份对应的折减系数表'], ['Nameplate MW, a prior vintage table, or a peer market','铭牌MW、以往年份的表格、或同业市场']],
        [{b:['Can the project connect?','项目能否并网？']}, ['Issued connection conditions plus an executed connection agreement','已签发的并网条件加已签并网协议'], ['A connection application or a queue position','并网申请或队列位置']],
        [{b:['Will it clear the auction?','能否在拍卖中出清？']}, ['Certification status plus the auction demand curve and parameters','认证状态加拍卖需求曲线与参数'], ['An assumption that last auction’s outcome repeats','假设上一次拍卖结果会重演']],
        [{b:['What merchant revenue is achievable?','可实现的市场化收入是多少？']}, ['Executable margin on post-reform data only','仅基于改革后数据的可执行价差'], ['A backtest spanning the balancing reform','跨越平衡市场改革的回测']],
        [{b:['Can the obligation be met in year 12?','第12年能否履行义务？']}, ['A degradation model against the declared duration, plus an augmentation path','对照申报时长的衰减模型，加增容路径'], ['Year-1 duration and a warranty statement','第1年时长与质保声明']],
      ] },
      { t:'why', text:['All five rows describe the same error: substituting an earlier, more available proxy for definitive evidence. The Polish twist is the last row — the only market in this comparison set where the diligence question extends to year twelve, because the obligation does. A model that stops testing duration after year one has not tested the contract at all.',
        '五行描述的是同一错误：以更早、更易获得的替代指标取代决定性证据。波兰的特殊之处在最后一行 — 它是本对比样本中唯一尽调问题需延伸至第十二年的市场，因为义务本身如此。若模型在第一年之后即停止检验时长，那么它根本未检验合同。'],
        sig:['Diligence must reach year twelve','尽调须延伸至第十二年'] },
    ] },
    { t:'card', title:['Source registry — verified 26 July 2026','数据源登记表 — 2026年7月26日核验'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Source','来源'],['Status','状态'],['Source date','来源日期'],['Applicable period','适用期间']],
        rows: srcs.map(s => [{ b: [s.file, s.file] }, s.status, s.date, s.cy]) },
      { t:'proto', text:['Draft status: this is a from-scratch first build. The capacity-auction clearing prices, correction factors, contracted volumes, fleet and pipeline figures are seed values that set the analytical structure correctly but are not verified against published documents. Replace them before any investment use, and record the auction vintage in the model when you do.',
        '草案状态：本版本为从零起草的首个版本。容量拍卖出清价、折减系数、签约容量、在运机组与管线数值均为种子数值 — 它们正确设定了分析结构，但未与官方文件核验。任何投资用途前须予以替换，并在替换时于模型中记录拍卖年份。'] },
      { t:'note', text:['Currency discipline: the PLN/EUR rate used throughout is an illustrative mid-rate of ' + fmt1(M.fx) + '. Capacity revenue is set in zloty and most equity is measured in euro, so the exchange-rate path is a material risk over a ' + O.cmAgreementYears + '-year contract and should be modelled explicitly rather than held flat.',
        '汇率纪律：全篇所用PLN/EUR汇率为示意中间价' + fmt1(M.fx) + '。容量收入以兹罗提计价，而多数股权以欧元衡量，因此在' + O.cmAgreementYears + '年合同期内汇率路径是实质风险，应显式建模而非保持不变。'] },
    ] },
    { t:'card', title:['Core formulas','核心公式'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Quantity','指标'],['Formula','公式']], rows:[
        [{b:['Capacity revenue','容量收入']}, 'nameplate MW × correction factor(duration, auction vintage) × clearing price (' + MKT.cur + '/kW/yr) × 1,000'],
        [{b:['Discharged energy, year 1','第1年放电电量']}, 'MW × hours × usable fraction × cycles/day × 365 × availability'],
        [{b:['Executable margin','可执行价差']}, 'published spread + intraday uplift − liquidity − RTE − availability − charges − optimiser fee'],
        [{b:['Effective spread by duration','按时长的有效价差']}, 'executable margin × duration factor × (RTE / 88) × saturation factor(COD year)'],
        [{b:['Post-contract capacity revenue','合同期后容量收入']}, 'capacity revenue × re-contracting factor after year ' + O.cmAgreementYears],
        [{b:['Duration scorecard','时长评分卡']}, 'Σ (factor weight × factor score) / 3, each factor scored 0–3'],
        [{b:['DSCR','偿债覆盖率']}, 'EBITDA(year) / annuity(debt, interest rate, tenor)'],
      ] },
    ] },
    { t:'card', title:['Data-quality badge legend & seed status','数据质量标识说明与种子状态'], badges:['calc'], live:false, blocks:[
      { t:'badges', items:['official','calc','illus','forecast','dev','public','tp','peer','final','draft','model','consult','verify','policy',
        h('span', { class:'badge seed' }, MKT.seedTag), h('span', { class:'badge etl' }, 'LIVE_ETL_REQUIRED')] },
      { t:'cap', text:['Seed values used in this build, all requiring verification: capacity clearing price ' + fmtN(O.cmPricePln) + ' PLN/kW/yr for delivery year ' + O.cmDY + ' (≈' + fmtC(capEurKW) + '/kW at ' + fmt1(M.fx) + ' PLN/EUR) · new-build agreement length ' + O.cmAgreementYears + ' years · correction factors ' + fmtPct(M.deratingCurve[1] * 100, 0) + ' (1h) to ' + fmtPct(M.deratingCurve[8] * 100, 0) + ' (8h) · BESS capacity contracted ' + fmt1(O.cmAwardedBessGW) + ' GW · operating fleet ' + fmtN(O.fleetMW) + ' MW / ' + fmtN(O.fleetMWh) + ' MWh · connection pipeline ' + fmt1(O.pipelineGW) + ' GW · average daily day-ahead spread ' + fmtC(M.spreadSeries[5]) + '/MWh · negative-price hours ~' + fmtN(O.negHours) + ' in 2025 · coal share of generation ~' + O.coalSharePct + '% · balancing market reformed in ' + O.balancingReformYear + ' with 15-minute settlement. Romanian figures are peer-namespace context and never enter Polish scoring.',
        '本版本所用种子数值，均须核验：交付年' + O.cmDY + '的容量出清价' + fmtN(O.cmPricePln) + ' PLN/kW/年（按' + fmt1(M.fx) + ' PLN/EUR约合' + fmtC(capEurKW) + '/kW） · 新建协议年限' + O.cmAgreementYears + '年 · 折减系数由' + fmtPct(M.deratingCurve[1] * 100, 0) + '（1小时）至' + fmtPct(M.deratingCurve[8] * 100, 0) + '（8小时） · 已签约储能容量' + fmt1(O.cmAwardedBessGW) + 'GW · 在运机组' + fmtN(O.fleetMW) + 'MW/' + fmtN(O.fleetMWh) + 'MWh · 并网管线' + fmt1(O.pipelineGW) + 'GW · 日均日前价差' + fmtC(M.spreadSeries[5]) + '/MWh · 2025年负电价约' + fmtN(O.negHours) + '小时 · 煤电占发电量约' + O.coalSharePct + '% · 平衡市场于' + O.balancingReformYear + '年改革并采用15分钟结算。罗马尼亚数值属同业命名空间背景资料，绝不进入波兰评分。'] },
      { t:'exports' },
    ] },
    { t:'card', title:['Bilingual glossary','双语术语表'], badges:['calc'], live:false, blocks:[
      { t:'glossary' },
      { t:'why', text:['Four terms carry disproportionate decision weight and are the ones most often used loosely in Polish discussions: correction factor (the duration-dependent multiplier that decides how much of the nameplate is paid), capacity obligation (the delivery duty that accompanies the payment for the full contract term), connection conditions (the first tier of connection evidence, which also gates certification), and certification (declaring technical parameters and duration to the auction, where a declaration that cannot later be met becomes a penalty). Agreeing these four definitions with a counterparty before negotiating removes most of the scope for talking past each other.',
        '有四个术语在决策中的权重不成比例，且在波兰的讨论中最常被宽泛使用：折减系数（决定铭牌容量中多少获付费、随时长变化的乘数）、容量义务（伴随付费、贯穿整个合同期的交付责任）、并网条件（并网证据的第一层级，同时决定能否通过认证）、以及认证（向拍卖申报技术参数与时长，日后无法满足的申报将转化为罚金）。在谈判前与交易对手就这四项定义达成一致，可消除大部分各说各话的空间。'],
        sig:['Agree four definitions before negotiating','谈判前先统一四项定义'] },
    ] },
  ] };
};


  SEC_B.grid = () => buildPLGridSection({ SRC, M });

/* Investment Case and Entry: the investment-view revision. The content is the
   shared component, which reads this market's view and ledger as its dashboard
   registered them. There is no build pathway for this market yet, so Entry is
   the ledger. */
SEC_B.case = () => ({ head: ['Investment Case — who should enter, and by which route', '投资判断 — 谁应该进入，走哪条路径'], blocks: [
  { t: 'p', text: ['The uncontracted reference project returns under 1% on the model, and the batteries that won long capacity contracts in earlier auctions are a different cohort.', '未签约的参考项目模型回报不足1%；在早先拍卖中取得长期容量合同的电池项目属于另一批次。'] },
  { t: 'investment-case', marketId: 'pl' },
] });
SEC_B.entry = () => ({ head: ['Entry — what it costs before the first dollar of revenue', '进入成本 — 第一笔收入之前要付出什么'], blocks: [
  { t: 'p', text: ['Three statutory payments: a fee to apply, an advance of up to PLN 6 million within fourteen days, and security after the connection agreement. They are stated in złoty, as the statute states them, and totalled at a seed rate; development spend is not sourced, so the total is a lower bound.', '三笔法定款项：申请费、申请后14日内最高600万兹罗提的预付款，以及签订并网协议后的履约担保。金额按法律原文以兹罗提列示，并按设定汇率合计；前期开发支出没有来源，因此合计为下限。'] },
  { t: 'entry-ledger', marketId: 'pl' },
] });

  return SECTIONS;
}