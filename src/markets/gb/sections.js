/* ---------------------------------------------------------------------------
   Great Britain 鈥?declarative section specs, verbatim from the prototype
   (lines 1633-2729).

   One SEC_B entry per tab, each returning a block spec that the shared engine
   draws. SECTIONS() wraps them in lazy getters so every string re-evaluates when
   the language changes.

   The engine hands in everything these specs use; nothing is imported directly,
   which is what keeps the four markets in this lineage interchangeable.
   --------------------------------------------------------------------------- */

import { buildGBGridSection } from './gridSection.js';
import { gbEconomicsP0Blocks } from './economicsP0Section.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function buildSections(api){
  const { h, L, MKT, M, SRC, T, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, compositeScore, liveScore, durationAt, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;

// ---------------- section registry (parts are concatenated by build.js) ----------------
const SEC_B = {};
function SECTIONS(){
  const o = {};
  Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
  return o;
}
const O = M.official;

// ============================== OVERVIEW ==============================
SEC_B.home = function (){
  const comp = compositeScore(), dni = liveScore('durFactors'), cs = liveScore('connFactors');
  const dband = bandFor(M.durBands, dni), cband = bandFor(M.connBands, cs);
  const dur = durationAt(state.codYear);
  const derate2 = M.deratingCurve[2], derate4 = M.deratingCurve[4];
  const cmPerNameplate2h = O.t4Price * derate2 * 1000;   // £/MW/yr at 2h
  return {
  warn: M.seedWarn,
  blocks: [
    { t:'card', mt:false, title:['Institutional Investor Walkthrough — six questions, one decision path','机构投资人导览 — 六个问题，一条决策路径'],
      badges:['official'], live:false, blocks:[
      { t:'band-story', b:['Core storyline','核心叙事'],
        text:['GB moved from a thermal-backed, energy-only system with a bolt-on Capacity Market to a renewables-led system where batteries are structurally required — but the fleet was built short, the services markets it was built for are saturated, and the capacity price has fallen by more than half. The investment case now depends on connection certainty, realised dispatch, duration and contracted revenue rather than on a generic "battery scarcity" thesis.',
              '英国已从以火电支撑、单一电能量并附加容量市场的系统，转向以新能源为主导、储能成为结构性必需的系统；但存量机组以短时为主，其所服务的辅助服务市场已经饱和，容量价格亦下跌逾半。当前投资逻辑取决于并网确定性、实际调度表现、时长与合同化收入，而非笼统的“电池稀缺”。'] },
      { t:'walk', items:[
        ['01', ['Overview','总览'], ['What is the house view today?','当前总体判断是什么？'], 'home'],
        ['02', ['Market evolution','市场演进'], ['Why did BESS become necessary — and what changed after entry?','为何储能成为必需？进入后发生了什么？'], 'story'],
        ['03', ['Revenue stack','收入结构'], ['Are CM, wholesale/BM and services durable at COD?','投运时容量、批发/平衡与系统服务是否可持续？'], 'capacity'],
        ['04', ['Asset design','资产设计'], ['What duration survives the next de-rating vintage?','什么时长能跨越下一折减系数版本？'], 'duration'],
        ['05', ['Underwriting','项目承销'], ['Can the project connect, finance and withstand downside?','项目能否并网、融资并承受下行情景？'], 'grid'],
        ['06', ['Portfolio application','组合应用'], ['Which screened GB opportunity actually passes the gates?','所筛选的英国机会中哪一个能通过门槛？'], 'portfolio'],
      ] },
      { t:'note', text:['Recommended presentation order: Overview → GB Market Story → Capacity Market → Wholesale & BM → System Services → Duration → Pipeline → Grid Connection → Investment Lab → Portfolio. GB vs Ireland and Data & Methodology are reference appendices unless a question requires them.',
        '建议讲解顺序：总览 → 英国市场演进 → 容量市场 → 批发与平衡 → 系统服务 → 时长 → 管线 → 并网 → 投资测算 → 组合。英爱对比与数据方法作为问答附录。'] },
      { t:'why', text:['The six questions are sequenced so each one can veto the next. A market that needs storage (02) is not the same as a revenue stack that survives to your COD (03), a design that stays economic under the next de-rating table (04), an asset that can actually connect and fund (05), or a specific opportunity worth committing capital to (06). Any single failure ends the case, so the decision is made in this order rather than on a blended score.',
        '六个问题按“逐级否决”排序：市场需要储能（02）不等于收入结构能延续至投运（03），不等于设计在下一版折减系数下仍然经济（04），不等于资产能真正并网并融资（05），也不等于某个具体机会值得投入资本（06）。任一环节不成立即终止，因此决策按此顺序作出，而非依赖综合评分。'],
        sig:['Sequential veto, not a scorecard','逐级否决，而非评分卡'] },
    ] },

    { t:'g2', cards:[
      // ---- Card A ----
      { title:['Card A — Overall GB Storage Signal','Card A — 英国储能综合信号'], badges:['illus'], live:false, blocks:[
        { t:'chip', cls:M.overall.chipCls, text:M.overall.statusL },
        { t:'p', text:[
          'Composite score: ' + comp + ' / 100 · Confidence: ' + M.overall.confidence + '% · Target COD window: ' + M.overall.codWindow,
          '综合评分：' + comp + ' / 100 · 置信度：' + M.overall.confidence + '% · 目标投运窗口：' + M.overall.codWindow] },
        { t:'meter', pct: comp, color:'warn' },
        { t:'p', text:M.overall.rationale },
        { t:'sub', text:['Component scores (weights never hidden behind the composite):','分项评分（权重不隐藏于综合分之后）：'] },
        { t:'scores', items:M.components, max:100 },
        { t:'why', text:['The composite is deliberately not a go/no-go number. The two heaviest weights — wholesale/BM outlook (20%) and connection & planning risk (20%) — are the only components a sponsor can contract or de-risk before FID; the weak components (system services 34, pipeline saturation 48, Capacity Market 50) are market-wide and cannot be fixed by a better project. A score of ' + comp + ' with that split means "invest selectively where the contractable 40% is strong", not "invest because the market scores mid-60s".',
          '综合分刻意不作为一票通过的指标。权重最高的两项 — 批发/平衡前景（20%）与并网及规划风险（20%） — 是发起人在FID前唯一可通过合同锁定或去风险的分项；弱分项（系统服务34、管线饱和48、容量市场50）属全市场性质，无法靠更好的项目改善。综合' + comp + '分在此结构下的含义是“在可合同化的40%权重表现强劲处选择性投资”，而非“因市场评分中高位而投资”。'],
          sig:['Weight sits on what you can contract','权重集中于可合同化部分'] },
      ] },
      // ---- Card B ----
      { title:['Card B — Capacity Market Signal','Card B — 容量市场信号'], live:false, blocks:[
        { t:'chip', cls:'serious', text:['Weakening — clearing price down 58% from the 27/28 peak','走弱 — 出清价较27/28峰值下跌58%'] },
        { t:'kpis', items:[
          { l:['T-4 clearing price (DY ' + O.t4DY + ')','T-4出清价（交付年' + O.t4DY + '）'], v:'£' + fmt1(O.t4Price) + '<small>/kW/yr</small>',
            d:['from £65.00 at DY 27/28 — down 58%','由27/28年度£65.00下跌58%'], cls:'down', b:['official'] },
          { l:['T-4 awarded de-rated capacity','T-4中标折减容量'], v:fmtN(O.t4AwardedMW) + '<small> MW</small>', d:['de-rated, not nameplate','折减口径，非铭牌'], b:['official'] },
          { l:['T-1 clearing price (DY ' + O.t1DY + ')','T-1出清价（交付年' + O.t1DY + '）'], v:'£' + fmt1(O.t1Price) + '<small>/kW/yr</small>',
            d:['from £75.00 at DY 22/23','由22/23年度£75.00下跌'], cls:'down', b:['official'] },
          { l:['2h de-rating factor (T-4 ' + O.t4DY + ')','2小时折减系数（T-4 ' + O.t4DY + '）'], v:fmtPct(derate2 * 100), d:['4h: ' + fmtPct(derate4 * 100),'4小时：' + fmtPct(derate4 * 100)], b:['official'] },
          { l:['CM revenue per nameplate MW at 2h','2小时下每铭牌MW的容量收入'], v:fmtC(cmPerNameplate2h) + '<small>/MW/yr</small>', d:['nameplate × de-rating × price','铭牌×折减×价格'], b:['calc'] },
          { l:['New-build agreement length','新建容量协议年限'], v:O.cmAgreementYears + '<small> yr</small>', d:['index-linked, but price is auction-set','与通胀挂钩，但价格由拍卖决定'], b:['official'] },
        ] },
        { t:'why', text:['At a 2h de-rating factor of ' + fmtPct(derate2 * 100) + ', a 100 MW nameplate battery earns capacity revenue on just ' + fmtN(100 * derate2) + ' MW. Multiply by £' + fmt1(O.t4Price) + '/kW/yr and the Capacity Market contributes roughly ' + fmtCk(cmPerNameplate2h) + '/MW/yr — meaningful for debt sizing, nowhere near sufficient alone. Two underwriting rules follow: (a) never model CM on nameplate MW; (b) model the de-rating table of the auction you will actually enter, because the factor fell from 0.25 to 0.22 for 2h in a single vintage and moves against short assets every year.',
          '在2小时折减系数' + fmtPct(derate2 * 100) + '下，100MW铭牌电池仅就' + fmtN(100 * derate2) + 'MW获得容量收入。乘以£' + fmt1(O.t4Price) + '/kW/年，容量市场约贡献' + fmtCk(cmPerNameplate2h) + '/MW/年 — 对债务规模有意义，但远不足以独立支撑。由此得出两条承销原则：（a）绝不以铭牌MW测算容量收入；（b）须采用实际将参与拍卖年份的折减表，因为2小时系数在一个年份内即由0.25降至0.22，且每年对短时资产更不利。'],
          sig:['De-rated MW, never nameplate','折减MW，绝非铭牌'] },
      ] },
      // ---- Card C ----
      { title:['Card C — Wholesale & Balancing Signal','Card C — 批发与平衡机制信号'], live:false, blocks:[
        { t:'chip', cls:'warn', text:['Largest revenue line, but execution-dependent and saturating','最大收入项，但取决于执行且正在饱和'] },
        { t:'kpis', items:[
          { l:['Realised revenue, 2h (TTM Apr 2026)','实际收入，2小时（截至2026年4月12个月）'], v:fmtCk(M.bmRevenueByDur[2]) + '<small>/MW/yr</small>', d:['1h: ' + fmtCk(M.bmRevenueByDur[1]),'1小时：' + fmtCk(M.bmRevenueByDur[1])], b:['tp'] },
          { l:['Realised revenue, 4h / 8h','实际收入，4小时/8小时'], v:fmtCk(M.bmRevenueByDur[4]) + ' / ' + fmtCk(M.bmRevenueByDur[8]) + '<small>/MW/yr</small>',
            d:['+18% for 2× the MWh — sub-linear','MWh翻倍仅+18% — 次线性'], b:['tp'] },
          { l:['Balancing Mechanism share of revenue','平衡机制占收入比重'], v:'39<small>%</small>', d:['day-ahead 38% · intraday 14% · imbalance 9%','日前38% · 日内14% · 不平衡9%'], b:['tp'] },
          { l:['Realised-to-theoretical (fleet median)','实际与理论收入比（存量中位）'], v:fmtPct(M.realisedRatio.fleetMedian * 100, 0),
            d:['strong ' + fmtPct(M.realisedRatio.strong * 100, 0) + ' · weak ' + fmtPct(M.realisedRatio.weak * 100, 0),'优秀' + fmtPct(M.realisedRatio.strong * 100, 0) + ' · 落后' + fmtPct(M.realisedRatio.weak * 100, 0)], b:['tp'] },
          { l:['Battery BM skip rate','电池平衡机制跳过率'], v:fmtPct(M.skipRate * 100, 0), d:['instructions bypassed despite being in merit','虽在经济序列内仍被跳过'], b:['official'] },
        ] },
        { t:'why', text:['Two numbers decide whether this line is bankable. The 27-point gap between a strong optimiser (' + fmtPct(M.realisedRatio.strong * 100, 0) + ') and a weak one (' + fmtPct(M.realisedRatio.weak * 100, 0) + ') is worth about ' + fmtCk(M.bmRevenueByDur[2] * (M.realisedRatio.strong - M.realisedRatio.weak)) + '/MW/yr on a 2h asset — larger than the entire Capacity Market contribution. And the ' + fmtPct(M.skipRate * 100, 0) + ' skip rate means a third of economically-merited BM instructions never arrive, so theoretical dispatch models systematically overstate revenue. Underwrite on realised third-party benchmarks with step-down or termination rights, not on a modelled optimum.',
          '有两个数字决定这条收入线是否可融资。优秀优化商（' + fmtPct(M.realisedRatio.strong * 100, 0) + '）与落后者（' + fmtPct(M.realisedRatio.weak * 100, 0) + '）之间27个百分点的差距，在2小时资产上约值' + fmtCk(M.bmRevenueByDur[2] * (M.realisedRatio.strong - M.realisedRatio.weak)) + '/MW/年 — 高于整个容量市场的贡献。而' + fmtPct(M.skipRate * 100, 0) + '的跳过率意味着三分之一在经济序列内的平衡指令从未下达，因此理论调度模型系统性高估收入。应以第三方实际业绩基准测算，并设置降费或终止权，而非依赖模型最优值。'],
          sig:['Optimiser choice > capacity revenue','优化商选择重于容量收入'] },
      ] },
      // ---- Card D ----
      { title:['Card D — System Services Signal','Card D — 系统服务信号'], live:false, blocks:[
        { t:'chip', cls:'critical', text:['Supplementary revenue only — do not underwrite as core','仅作补充收益 — 不得作为核心测算基础'] },
        { t:'kpis', items:[
          { l:['Dynamic Containment clearing price','动态遏制出清价'], v:'£' + fmt1(2.90) + '<small>/MW/h</small>', d:['−25% ' + L(T.yoy),'同比−25%'], cls:'down', b:['official'] },
          { l:['Battery share of DC volume','电池在动态遏制成交量中占比'], v:'97<small>%</small>', d:['DM 99% · DR 98%','动态调节99% · 动态调整98%'], b:['official'] },
          { l:['Qualified supply vs requirement (DC)','合格供给对需求（动态遏制）'], v:'4.5<small>×</small>', d:['5,400 MW qualified vs 1,200 MW required','合格5,400MW对需求1,200MW'], b:['calc'] },
          { l:['Total frequency-response revenue pool','调频响应总收入池'], v:'↓ ~27%<small> ' + L(T.yoy) + '</small>', d:['weighted across DC/DM/DR','按DC/DM/DR加权'], b:['calc'] },
        ] },
        { t:'why', text:['Batteries now clear 97–99% of the dynamic response products while unit prices fall 25–30% a year. Winning the market and earning from it have separated: qualified supply is 4.5× the requirement in Dynamic Containment alone, so the price is set by the marginal accredited MW, of which there is a large surplus. The only services line with any pricing power left is the reserve family (BR/QR/SR, −8% to −12%), because it requires sustained energy rather than instantaneous power. Underwrite services at no more than the trailing twelve-month unit revenue and never as a reason to add MW.',
          '电池已占动态响应类产品成交量的97–99%，而单位价格每年下跌25–30%。“赢得市场”与“从市场获利”已经分离：仅动态遏制一项，合格供给即为需求的4.5倍，价格由边际认证MW决定，而后者严重过剩。唯一仍有定价能力的是备用类产品（BR/QR/SR，同比−8%至−12%），因其要求持续能量而非瞬时功率。系统服务测算不得高于过去12个月单位收入，且绝不作为增配MW的理由。'],
          sig:['Volume share ≠ revenue','成交份额≠收入'] },
      ] },
      // ---- Card E ----
      { title:['Card E — Duration Signal','Card E — 时长信号'], live:false, blocks:[
        { t:'chip', cls:'good', text:['Strengthening — but the reward is de-rating, not spread','走强 — 但回报来自折减系数而非价差'] },
        { t:'kpis', items:[
          { l:['Duration-Need Index','时长需求指数'], v:dni + '<small> / 100</small>', d:dband.n, b:['calc','illus'] },
          { l:['Fleet weighted-average duration','存量加权平均时长'], v:fmt1(O.fleetAvgHours) + '<small> h</small>', d:['pipeline average ' + fmt1(O.pipelineAvgHours) + ' h','管线平均' + fmt1(O.pipelineAvgHours) + '小时'], b:['calc'] },
          { l:['De-rating uplift, 2h → 4h','折减系数增益，2小时→4小时'], v:'+' + fmtPct((derate4 - derate2) * 100) + '<small> pts</small>', d:['capacity revenue roughly doubles','容量收入约翻倍'], b:['official'] },
          { l:['High-price event length (P90)','高价事件时长（P90）'], v:fmt1(M.events.highPrice.p90) + '<small> h</small>', d:['P50 ' + fmt1(M.events.highPrice.p50) + ' h · P99 ' + fmt1(M.events.highPrice.p99) + ' h','P50 ' + fmt1(M.events.highPrice.p50) + '小时 · P99 ' + fmt1(M.events.highPrice.p99) + '小时'], b:['calc'] },
          { l:['CP2030 battery vs LDES ranges','CP2030电池与长时储能区间'], v:'23–27 / 4–6<small> GW</small>', d:['from a ' + fmt1(O.batteryBaselineGW) + ' GW plan baseline','自' + fmt1(O.batteryBaselineGW) + 'GW计划基线'], b:['official'] },
        ] },
        { t:'flow', items:[
          ['Falling minimum net demand','最小净负荷持续下降'],
          ['Thermal & nuclear retirement gap','火电与核电退役缺口'],
          ['Short-duration MW saturation','短时MW饱和'],
          ['Duration-differentiated de-rating','按时长差异化的折减系数'],
          ['Longer-duration investment signal','更长时长投资信号'],
        ], sep:'+' },
        { t:'why', text:['This is the only strengthening signal, and in GB it is paid for through the de-rating table rather than through wider spreads. Moving 2h → 4h roughly doubles de-rated capacity (' + fmtPct(derate2 * 100) + ' → ' + fmtPct(derate4 * 100) + ') while realised merchant revenue rises only ' + fmtPct((M.bmRevenueByDur[4] / M.bmRevenueByDur[2] - 1) * 100, 0) + '. So the fourth hour is a capacity-market and resilience decision, not an arbitrage one. With the fleet averaging ' + fmt1(O.fleetAvgHours) + ' h against a P90 event length of ' + fmt1(M.events.highPrice.p90) + ' h, the incumbent short fleet cannot follow — which is precisely where new-build advantage sits.',
          '这是唯一走强的信号，且在英国是通过折减系数表而非更宽价差来支付的。由2小时增至4小时，折减后容量约翻倍（' + fmtPct(derate2 * 100) + '→' + fmtPct(derate4 * 100) + '），而实际市场化收入仅上升' + fmtPct((M.bmRevenueByDur[4] / M.bmRevenueByDur[2] - 1) * 100, 0) + '。因此第4小时是容量市场与韧性决策，而非套利决策。存量平均' + fmt1(O.fleetAvgHours) + '小时，对应P90事件时长' + fmt1(M.events.highPrice.p90) + '小时，短时存量机组无法跟随 — 这正是新建项目的优势所在。'],
          sig:['Hours are paid by de-rating, not spread','小时数由折减系数付费，而非价差'] },
      ] },
      // ---- Card F ----
      { title:['Card F — Grid Connection Signal','Card F — 并网风险信号'], badges:['illus'], live:false, blocks:[
        { t:'chip', cls:cband.c, text:cband.n },
        { t:'kpis', items:[
          { l:['Connection risk score','并网风险评分'], v:cs + '<small> / 100</small>', d:cband.n, b:['calc'] },
          { l:['Gate status','Gate状态'], v:'Gate 2', d:['offers phased through March 2027','要约分阶段发出至2027年3月'], b:['official'] },
          { l:['Binding evidence','约束性证据'], v:L(['Tranche + TO/DNO programme','批次+输配电运营商工程计划']), d:['not the historic connection date','而非历史并网日期'] },
          { l:['Consent status required','所需规划许可状态'], v:L(['Implementable','可实施']), d:['no outstanding pre-commencement conditions','无未决的开工前条件'] },
          { l:['Charging-reform exposure','网络收费改革敞口'], v:L(['Open','未定']), d:['TNUoS / DUoS / BSUoS in flight','TNUoS/DUoS/BSUoS改革推进中'], b:['verify'] },
        ] },
        { t:'note', text:['Required protection: no material non-refundable payment before a countersigned Gate 2 offer, an implementable consent and a TO/DNO works programme consistent with the modelled COD. A Gate 2 position alone does not prove an energisation date — see the nameplate → revenue bridge in the Grid Connection tab.',
          '必要保护：在取得已会签的Gate 2要约、可实施的规划许可，以及与模型投运日一致的输配电运营商工程计划之前，不支付重大不可退还款项。仅有Gate 2地位并不证明送电日期 — 详见“并网”页的铭牌容量至收入桥。'] },
        { t:'why', text:['Connection is scored ' + cs + '/100 (higher = riskier) because Gate status, connection date and consent are evidenced but not yet immovable, not because the site is bad. That distinction drives deal structure rather than pricing: an amber connection score converts into conditions precedent, holdbacks and long-stop dates. In GB the specific failure mode is a Gate 2 offer whose delivery date slips behind the TO/DNO works programme — which changes the COD year, which changes the de-rating vintage and the buildout case, which changes revenue twice over.',
          '并网评分' + cs + '/100（分值越高风险越大），原因是Gate状态、并网日期与规划许可虽有证据但尚未不可变更，而非场址本身不佳。这一区分影响交易结构而非定价：黄色并网评分应转化为先决条件、保留款与最终截止日。在英国，具体的失效模式是Gate 2要约的交付日期落后于输配电运营商工程计划 — 这会改变投运年度，进而改变折减系数版本与投产情景，从两个方向同时改变收入。'],
          sig:['Structure risk, don’t re-price it','以结构而非定价应对'] },
      ] },
    ] },

    // ---- Card G ----
    { t:'card', title:['Card G — Immediate Investor Actions','Card G — 可执行投资建议'], badges:['illus'], live:false, blocks:[
      { t:'list', ol:true, items:[
        [['Base Capacity Market revenue on the auction-specific de-rated MW, never on nameplate MW.','容量市场收入应基于对应拍卖的折减后MW，绝不使用铭牌MW。'],
         ['Trigger: CM revenue included in the base case','触发条件：基准情景包含容量市场收入']],
        [['Release development consideration only against a countersigned Gate 2 offer, implementable consent and a consistent TO/DNO works programme.','仅在取得已会签Gate 2要约、可实施规划许可及一致的输配电工程计划后，方可支付开发对价。'],
         ['Trigger: Gate 2 or consent evidence incomplete','触发条件：Gate 2或规划许可证据不完整']],
        [['Stress merchant revenue under the HIGH buildout path for the project’s COD year, not the central case.','按项目投运年度的高投产情景（而非中性情景）对市场化收入进行压力测试。'],
         ['Trigger: merchant / BM revenue is material to debt service','触发条件：市场化/平衡收入对偿债影响重大']],
        [['Benchmark optimiser performance on realised rather than theoretical revenue; require step-down or termination rights below a defined threshold.','以实际而非理论收入评估优化商表现；低于约定阈值时应有降费或终止权。'],
         ['Trigger: realised-to-theoretical below the peer median of ' + fmtPct(M.realisedRatio.fleetMedian * 100, 0),'触发条件：实际与理论收入比低于同业中位' + fmtPct(M.realisedRatio.fleetMedian * 100, 0)]],
        [['Treat 8h+ LDES as a separate contracted asset class; do not capitalise a cap-and-floor before final award.','将8小时以上长时储能作为独立的合同化资产类别；最终授予前不得将上下限机制资本化。'],
         ['Trigger: duration ≥ 8 hours or a cap-and-floor is assumed','触发条件：时长≥8小时或假设适用上下限机制']],
      ] },
      { t:'why', text:['Each action is paired with a numeric trigger so the decision is reviewable rather than a matter of judgement recalled later. Four of the five triggers are already met at today’s snapshot (CM in the base case, HIGH-case saturation material by 2030, services unit revenue down more than 20%, Gate 2 tranche timetable unresolved), which is exactly why the house view is Selective rather than Invest: the market is not closed, but the protections listed here are now mandatory rather than optional.',
        '每项建议均配套量化触发条件，使决策可复核，而非事后凭记忆判断。按当前快照，五项触发条件中已有四项成立（基准情景含容量收入、2030年前高投产情景饱和显著、服务单位收入同比降幅超20%、Gate 2批次时间表未定），这正是总体判断为“选择性投资”而非“投资”的原因：市场并未关闭，但上列保护措施已由可选变为必须。'],
        sig:['4 of 5 triggers already live','5项触发条件已有4项成立'] },
    ] },

    // ---- Revenue Driver Bridge ----
    { t:'card', title:['Revenue Driver Bridge — how nameplate MW becomes net operating revenue','收入驱动桥 — 铭牌MW如何变为净运营收入'], badges:['calc'], live:false, blocks:[
      { t:'sub', text:['Capacity channel (Capacity Market)','容量通道（容量市场）'] },
      { t:'flow', items:[
        ['Nameplate MW / MWh','铭牌MW/MWh'], ['Connection capacity (TEC / MIC)','并网容量（TEC/MIC）'],
        ['× de-rating factor for duration','×按时长的折减系数'], ['Prequalified & awarded MW','预资格与中标MW'],
        ['De-rated MW × clearing price','折减MW×出清价'],
      ] },
      { t:'sub', text:['Merchant channel (net, not gross)','市场化通道（净值，非毛值）'] },
      { t:'flow', items:[
        ['Theoretical spread value','理论价差价值'], ['− forecast error & skip rate','− 预测误差与跳过率'],
        ['− RTE, availability & cycling limits','− 效率、可用率与循环限制'], ['− TNUoS / DUoS / BSUoS','− 网络使用费'],
        ['− optimiser fee','− 优化商费用'], ['+ system services','+ 系统服务'], ['Net operating revenue','净运营收入'],
      ] },
      { t:'note', text:['Two separate multipliers, and they fail for unrelated reasons. Capacity revenue is cut administratively (a lower de-rating factor removes revenue with no physical change to the asset); merchant revenue is cut economically (execution, charges and saturation routinely consume 40%+ of theoretical value). Binding driver for a GB 2h project reaching COD in ' + state.codYear + ': the ' + fmtPct(M.deratingCurve[dur] * 100) + ' de-rating factor at ' + dur + 'h and realised — not theoretical — dispatch.',
        '两个相互独立的乘数，且失效原因互不相关。容量收入被行政性削减（折减系数下调可在资产完全不变的情况下抹去收入）；市场化收入被经济性削减（执行、网络费与饱和通常吞噬理论价值的40%以上）。对' + state.codYear + '投运的英国2小时项目，起约束作用的驱动为：' + dur + '小时下' + fmtPct(M.deratingCurve[dur] * 100) + '的折减系数，以及实际（而非理论）调度表现。'] },
      { t:'why', text:['This bridge is the dashboard’s single organising idea: every later tab is one link in it. Diligence has to price the weakest link, not the headline MW, and the two chains must be stress-tested separately — a project can hold a strong Gate 2 position and still fail on realised dispatch, or trade brilliantly and still lose a third of its capacity revenue to a de-rating revision it cannot influence.',
        '本桥是整个看板的组织主线：后续每个页面都是其中一环。尽调应对最弱环节定价，而非铭牌MW；且两条链须分别压力测试 — 项目可能拥有稳固的Gate 2地位却在实际调度上失败，也可能交易表现优异却因无法影响的折减系数修订而损失三分之一容量收入。'],
        sig:['Price the weakest link','对最弱环节定价'] },
    ] },
  ] };
};

// ============================== GB MARKET STORY ==============================
SEC_B.story = function (){
  const S = M.systemEvolution;
  return {
  head: ['GB Market Evolution — from energy-only trading market to a duration-and-connection-constrained storage market',
         '英国市场演进 — 从单一电能量交易市场到受时长与并网约束的储能市场'],
  cap: ['This section is the narrative bridge between the Overview and the detailed underwriting tabs. It separates historical facts, observed market outcomes and the forward investment conclusion.',
        '本节连接“总览”与后续承销分析，明确区分历史事实、已观察市场结果及前瞻投资结论。'],
  blocks: [
    ...gbEconomicsP0Blocks(SRC),
    { t:'card', mt:false, title:['One-minute orientation for a new institutional investor','机构投资人的一分钟市场定位'], badges:['official','public'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Wholesale market design','批发市场设计'], v:'2001 / 2005', d:['NETA then BETTA — energy-only, national pricing retained under RNP','NETA继而BETTA — 单一电能量，改革后维持全国统一定价'], b:['official'] },
        { l:['Capacity Market introduced','容量市场引入'], v:'2014', d:['first T-4 auction; storage de-rated by duration from 2017','首次T-4拍卖；2017年起储能按时长折减'], b:['official'] },
        { l:['Operating battery fleet','在运储能规模'], v:fmt1(O.fleetGW) + '<small> GW</small>', d:['weighted-average duration ' + fmt1(O.fleetAvgHours) + ' h','加权平均时长' + fmt1(O.fleetAvgHours) + '小时'], b:['calc'] },
        { l:['CP2030 battery requirement','CP2030电池需求'], v:'23–27<small> GW</small>', d:['against a ' + fmt1(O.batteryBaselineGW) + ' GW plan baseline — a 5–6× build','对应' + fmt1(O.batteryBaselineGW) + 'GW计划基线 — 需扩张5–6倍'], b:['official'] },
        { l:['T-4 clearing price trajectory','T-4出清价轨迹'], v:'£65 → £' + fmt1(O.t4Price), d:['DY 27/28 peak to DY ' + O.t4DY + ' — down 58%','由27/28峰值降至' + O.t4DY + ' — 下跌58%'], cls:'down', b:['official'] },
        { l:['Central buildout by 2030','中性情景2030装机'], v:'16.0<small> GW</small>', d:['low 12.5 GW · high 20.0 GW','低情景12.5GW · 高情景20.0GW'], b:['forecast'] },
      ] },
      { t:'reco', b:['Institutional conclusion: ','机构投资结论：'],
        text:['GB is not a simple merchant-arbitrage market and it is no longer a frequency-response market. It is a deep, liquid, interconnected energy-only system with a de-rating-driven capacity overlay, in which the binding constraints are connection timing and duration, not demand for storage. Policy demands a 5–6× build; the market prices the marginal MW as if that build has already happened. The winning project must bridge those two facts.',
              '英国既非单纯的现货套利市场，也不再是调频响应市场。它是一个深度、流动、互联的单一电能量系统，叠加以折减系数驱动的容量机制；其约束条件在于并网时点与时长，而非对储能的需求。政策要求扩张5–6倍，而市场对边际MW的定价却仿佛该扩张已经完成。优质项目必须跨越这两个事实。'] },
      { t:'why', text:['Two facts here do the work. Policy requires roughly ' + fmt1(23 - O.batteryBaselineGW) + '–' + fmt1(27 - O.batteryBaselineGW) + ' GW of new batteries by 2030 — so system need is stated, not inferred. But the T-4 price halved and the central buildout path already reaches 16 GW by 2030, so the marginal project is being priced into a market that assumes the requirement is met. The GB investment problem is therefore position, not thesis: an asset must be early enough in the connection queue and long enough in duration to be on the scarce side of a build-out that policy guarantees will happen.',
        '此处两项事实最为关键。政策要求2030年前新增约' + fmt1(23 - O.batteryBaselineGW) + '–' + fmt1(27 - O.batteryBaselineGW) + 'GW电池 — 系统需求是明示的，而非推断的。但T-4价格已腰斩，且中性投产路径到2030年已达16GW，因此边际项目正被以“需求已被满足”的假设定价。英国的投资难题在于位置而非逻辑：资产须在并网队列中足够靠前、时长足够长，才能站在这场由政策保证会发生的扩张中稀缺的一侧。'],
        sig:['Position risk, not thesis risk','位置风险而非逻辑风险'] },
    ] },

    { t:'card', title:['Official system evolution — FES 2025 Ten Year Forecast','官方系统演进 — FES 2025十年预测'], badges:['official','forecast'], blocks:[
      { t:'kpis', items:[
        { l:['Annual system demand','年度系统需求'], v:fmt1(S.demand.totalGWh.values[2] / 1000) + '<small> TWh</small>', d:['2035 vs ' + fmt1(S.demand.totalGWh.values[0] / 1000) + ' TWh in 2024','2035年；2024年为' + fmt1(S.demand.totalGWh.values[0] / 1000) + 'TWh'], b:['official','forecast'] },
        { l:['Peak customer demand','客户峰值需求'], v:fmt1(S.demand.peakGW.values[2]) + '<small> GW</small>', d:['2035 vs ' + fmt1(S.demand.peakGW.values[0]) + ' GW in 2024','2035年；2024年为' + fmt1(S.demand.peakGW.values[0]) + 'GW'], b:['official','forecast'] },
        { l:['Data-centre demand','数据中心需求'], v:fmt1(S.demand.dataCentreGWh.values[2] / 1000) + '<small> TWh</small>', d:['2035; ' + fmt1(S.demand.dataCentreGWh.values[2] / S.demand.dataCentreGWh.values[0]) + '× 2024','2035年；为2024年的' + fmt1(S.demand.dataCentreGWh.values[2] / S.demand.dataCentreGWh.values[0]) + '倍'], b:['official','forecast'] },
        { l:['Network-connected batteries','联网电池'], v:fmt1(S.capacity.batteryGW.values[1]) + '<small> GW</small>', d:['2030; excludes Distributed-Micro','2030年；不含分布式微型储能'], b:['official','forecast'] },
        { l:['Long-duration storage','长时储能'], v:fmt1(S.capacity.ldesGW.values[2]) + '<small> GW</small>', d:['2035 vs ' + fmt1(S.capacity.ldesGW.values[1]) + ' GW in 2030','2035年；2030年为' + fmt1(S.capacity.ldesGW.values[1]) + 'GW'], b:['official','forecast'] },
      ] },
      { t:'g2', cards:[
        { title:['Variable renewables and storage capacity','可变可再生能源与储能容量'], badges:['official','forecast'], blocks:[
          { t:'line', cfg:{ xs:S.years.map(String), yfmt:v => fmt1(v) + ' GW', ymin:0, h:230,
            series:[
              { name:['Wind','风电'], color:'var(--s2)', vals:S.capacity.windGW.values },
              { name:['Solar PV','光伏'], color:'var(--s3)', vals:S.capacity.solarGW.values },
              { name:['Network batteries','联网电池'], color:'var(--s1)', vals:S.capacity.batteryGW.values },
              { name:['LDES','长时储能'], color:'var(--s6)', vals:S.capacity.ldesGW.values },
            ] } },
        ] },
        { title:['Peak demand, firm capacity and interconnection','峰值需求、稳固容量与互联'], badges:['official','forecast'], blocks:[
          { t:'line', cfg:{ xs:S.years.map(String), yfmt:v => fmt1(v) + ' GW', ymin:0, h:230,
            series:[
              { name:['Peak customer demand','客户峰值需求'], color:'var(--ink)', vals:S.demand.peakGW.values },
              { name:['Gas','燃气'], color:'var(--s6)', vals:S.capacity.gasGW.values },
              { name:['Nuclear','核电'], color:'var(--s5)', vals:S.capacity.nuclearGW.values },
              { name:['Interconnectors','互联线路'], color:'var(--s4)', vals:S.capacity.interconnectorGW.values },
            ] } },
        ] },
      ] },
      { t:'note', text:['These are points from one named official pathway, not observed outturns and not the dashboard’s analyst low/central/high merchant scenarios. Original years and FES 2025 vintage are preserved; no hidden interpolation is used.',
        '这些数值来自一个具名官方路径，并非实际结果，也非看板的分析师低/中/高市场化情景。原始年份与FES 2025版本均被保留，未使用任何隐藏插值。'] },
      { t:'why', text:['The physical storage case is visible in the joint movement: annual demand rises about 37%, data-centre demand more than quadruples, wind adds nearly 69 GW, and nuclear falls before partially recovering. FES places network-connected batteries at ' + fmt1(S.capacity.batteryGW.values[1]) + ' GW in 2030. The investment case is invalidated, however, if connection delivery and revenue capture do not keep pace — official system need is not evidence that any individual queue project will earn its cost of capital.',
        '储能的物理需求体现在联动变化中：年度需求增长约37%，数据中心需求增长超过四倍，风电增加近69GW，而核电先下降后部分恢复。FES预计2030年联网电池达到' + fmt1(S.capacity.batteryGW.values[1]) + 'GW。但若并网交付与收入捕获未能同步，投资逻辑仍会失效 — 官方系统需求并不能证明任何单个排队项目能够赚取其资本成本。'],
        sig:['System need ≠ project return','系统需求≠项目回报'] },
      { t:'src', src:SRC.fesEd1, use:['Annual and peak demand, including data-centre demand; FES 2025 Ten Year Forecast','年度与峰值需求（含数据中心需求）；FES 2025十年预测'] },
      { t:'src', src:SRC.fesEs1, use:['Technology capacity by connection class; FES 2025 Ten Year Forecast','按接入类别划分的技术容量；FES 2025十年预测'] },
    ] },
    { t:'card', title:['How GB storage revenue was re-pointed — three times in ten years','英国储能收入的三次重新定向 — 十年间'], badges:['official','public'], blocks:[
      { t:'band-story', b:['Why this history is underwriting-relevant','这段历史为何与承销相关'],
        text:['GB has never paid storage through a single durable mechanism. Revenue moved from frequency response, to the Capacity Market and wholesale spreads, to the Balancing Mechanism — and each move stranded the design that was optimal for the previous era. A 1-hour asset built for Enhanced Frequency Response and a 2-hour asset built for Dynamic Containment are both still operating and both structurally disadvantaged today.',
              '英国从未通过单一持久机制为储能付费。收入先后由调频响应转向容量市场与批发价差，再转向平衡机制；每次转移都令上一时代的最优设计被搁浅。为增强型调频响应建设的1小时资产与为动态遏制建设的2小时资产至今仍在运行，且如今均处于结构性劣势。'] },
      { t:'timeline', items:[
        { y:'2001–2005', t:['Energy-only market established','单一电能量市场确立'],
          p:['NETA and then BETTA created a bilateral, self-dispatch trading market with a Balancing Mechanism as the residual tool. There was no capacity payment and no storage class — storage was simply a generator that could also consume.',
             'NETA继而BETTA建立了双边、自调度的交易市场，平衡机制作为剩余工具。当时既无容量付费，也无储能类别 — 储能只是一台同时可用电的发电机组。'],
          i:['The founding design still governs: GB pays for energy and for balancing actions, and everything else is an overlay bolted on later. That is why GB revenue is more volatile and more execution-dependent than an administered capacity market.',
             '这一初始设计至今仍在支配市场：英国为电能量与平衡动作付费，其余均为后加的叠加机制。这正是英国收入较行政化容量市场更波动、更依赖执行的原因。'] },
        { y:'2014', t:['Capacity Market introduced','引入容量市场'],
          p:['The first T-4 auction procured capacity for 2018/19. Storage initially bid close to nameplate, then from 2017 was assigned duration-differentiated de-rating factors that cut short-duration capacity value sharply.',
             '首次T-4拍卖为2018/19年度采购容量。储能初期以接近铭牌容量投标，自2017年起被赋予按时长差异化的折减系数，短时储能的容量价值因而大幅削减。'],
          i:['This is the origin of the single most important GB number for a battery investor: the de-rating factor. It converts an engineering choice (hours) into a revenue multiplier set by the regulator, not by the market.',
             '这正是对电池投资人而言最重要的英国数字的来源：折减系数。它把工程选择（小时数）转化为由监管方而非市场设定的收入乘数。'] },
        { y:'2016–2019', t:['The frequency-response era — and its end','调频响应时代及其终结'],
          p:['Enhanced Frequency Response and Firm Frequency Response made 30-minute and 1-hour batteries highly profitable. The fleet was built to that specification. Saturation, product redesign and the arrival of a much larger qualified supply then collapsed unit prices.',
             '增强型调频响应与固定调频响应使30分钟与1小时电池高度盈利，存量机组即按此规格建设。随后市场饱和、产品重构以及合格供给大幅增加，导致单位价格崩塌。'],
          i:['First re-pointing. The lesson generalises: in GB, any product that batteries can supply better than anything else will be over-supplied by batteries within roughly three years of becoming profitable.',
             '第一次重新定向。其教训具有普适性：在英国，任何电池比其他技术更擅长提供的产品，都会在其变得有利可图后约三年内被电池过度供给。'] },
        { y:'2020–2023', t:['Dynamic products launch, then saturate','动态类产品上线继而饱和'],
          p:['Dynamic Containment went live in late 2020, followed by Dynamic Moderation and Dynamic Regulation, and later the reserve family under the Enduring Auction Capability platform. Batteries now clear 97–99% of dynamic volume while clearing prices fall 25–30% a year.',
             '动态遏制于2020年末上线，随后是动态调节与动态调整，其后在常态化拍卖平台下推出备用类产品。电池目前占动态类成交量的97–99%，而出清价每年下跌25–30%。'],
          i:['Second re-pointing, and the same pattern at higher speed. Any services line in a GB base case must be capped at trailing twelve-month unit revenue with no growth assumption.',
             '第二次重新定向，模式相同但速度更快。英国基准情景中的任何服务收入项，均须以过去12个月单位收入封顶，且不得假设增长。'] },
        { y:'2022–2025', t:['Wholesale volatility and BM access become the core','批发波动与平衡机制准入成为核心'],
          p:['Gas-driven price volatility widened spreads, while platform reform improved battery access to the Balancing Mechanism. The BM is now the single largest revenue component at 39%, ahead of day-ahead at 38%.',
             '燃气驱动的价格波动扩大了价差，同时平台改革改善了电池进入平衡机制的条件。平衡机制目前是最大的单一收入项，占39%，高于日前市场的38%。'],
          i:['Third re-pointing — and this one rewards trading capability rather than asset specification. The same physical battery now earns ' + fmtPct((M.realisedRatio.strong / M.realisedRatio.weak - 1) * 100, 0) + ' more under a strong optimiser than a weak one.',
             '第三次重新定向 — 这一次奖励的是交易能力而非资产规格。同一台物理电池在优秀优化商手中的收入，比在落后者手中高' + fmtPct((M.realisedRatio.strong / M.realisedRatio.weak - 1) * 100, 0) + '。'] },
        { y:'2024–2025', t:['Clean Power 2030 and connections reform','2030清洁电力与并网改革'],
          p:['The CP2030 Action Plan set a 23–27 GW battery and 4–6 GW LDES requirement. In parallel, connections reform replaced the first-come-first-served queue with Gate 1 / Gate 2, re-ordering a multi-hundred-GW queue against strategic need and project readiness.',
             '《2030清洁电力行动计划》确定23–27GW电池与4–6GW长时储能需求。与此同时，并网改革以Gate 1/Gate 2取代先到先得排队机制，依据战略需求与项目成熟度对数百GW的队列重新排序。'],
          i:['Connection position stopped being an administrative formality and became the principal determinant of project value. Two otherwise identical projects now differ in worth mainly by tranche.',
             '并网地位不再是行政手续，而成为项目价值的首要决定因素。两个其他方面完全相同的项目，其价值差异如今主要来自所处批次。'] },
        { y:'2026', t:['Capacity price halves; LDES gets its own regime','容量价格腰斩；长时储能获得独立机制'],
          p:['The T-4 auction for DY ' + O.t4DY + ' cleared at £' + fmt1(O.t4Price) + '/kW/yr against £65 for DY 27/28, procuring ' + fmtN(O.t4AwardedMW) + ' MW de-rated. Separately, Ofgem reached minded-to decisions on ' + O.ldesWindow1Projects + ' LDES cap-and-floor Window 1 projects.',
             'DY ' + O.t4DY + '的T-4拍卖以£' + fmt1(O.t4Price) + '/kW/年出清，对比27/28年度的£65，采购折减容量' + fmtN(O.t4AwardedMW) + 'MW。另一方面，Ofgem对' + O.ldesWindow1Projects + '个长时储能上下限机制第一窗口项目作出倾向性决定。'],
          i:['The market split in two. Short-duration storage is now a merchant trading asset with a modest capacity top-up; 8h+ LDES is becoming a regulated, contracted asset class. These require different underwriting frameworks and different investors.',
             '市场就此一分为二。短时储能如今是带有少量容量补充的市场化交易资产；8小时以上长时储能正成为受监管、合同化的资产类别。两者需要不同的承销框架与不同的投资人。'] },
      ] },
      { t:'why', text:['Three re-pointings in ten years, each roughly three to four years apart, and each favouring a design that did not exist in the previous era. That is the base rate to underwrite against. Two practical conclusions: record the de-rating vintage and services-price vintage used in every model, and treat the next auction parameter review and the next connections-reform tranche as scheduled events with a P&L consequence, not as policy background.',
        '十年内三次重新定向，间隔约三至四年，且每次都有利于上一时代尚不存在的设计。这就是承销时应参照的基准频率。两项实务结论：在每个模型中记录所用的折减系数版本与服务价格版本；并将下一次拍卖参数审查与下一批并网改革批次视为具有损益后果的既定事件，而非政策背景。'],
        sig:['Re-pointed roughly every three years','大致每三年重新定向一次'] },
      { t:'g2', cards:[
        { title:['Capacity Market clearing prices — the mechanism is not a stable annuity','容量市场出清价 — 该机制并非稳定年金'], badges:['official'], blocks:[
          { t:'line', cfg:{ xs: M.cmYears, yfmt: v => '£' + fmt1(v), h: 200,
            series: [{ name:['T-4 clearing price (£/kW/yr)','T-4出清价（£/kW/年）'], color:'var(--s1)', vals: M.t4Series }] } },
          { t:'why', text:['The T-4 price has ranged from £18 to £65 and back to £' + fmt1(O.t4Price) + ' in six delivery years — a 3.6× peak-to-trough swing driven by how much capacity turns up, not by how much is needed. A 15-year agreement fixes the price you won, so the auction you enter is a one-shot event that determines a sixth of lifetime revenue. Model the range, not the last print.',
            'T-4价格在六个交付年度内由£18升至£65又回落至£' + fmt1(O.t4Price) + ' — 峰谷相差3.6倍，其驱动因素是有多少容量参与投标，而非需要多少容量。15年协议锁定的是你中标时的价格，因此你参与的那一次拍卖是决定终身收入六分之一的一次性事件。应对区间建模，而非对最近一次出清价建模。'],
            sig:['One auction, fifteen years','一次拍卖，十五年'] },
        ] },
        { title:['De-rating factors by duration — the regulator’s duration signal','按时长的折减系数 — 监管方的时长信号'], badges:['official'], blocks:[
          { t:'line', cfg:{ xs: M.derateHours.map(x => x + 'h'), yfmt: v => fmtPct(v * 100, 0), ymin: 0, h: 200,
            series: [
              { name:['T-4 2028/29 vintage','T-4 2028/29版本'], color:'var(--s3)', vals: M.derateVintages['T-4 2028/29'], dash: true },
              { name:['T-4 2029/30 vintage','T-4 2029/30版本'], color:'var(--s1)', vals: M.derateVintages['T-4 2029/30'] },
            ] } },
          { t:'why', text:['Every point on the curve fell between the two vintages, and it fell hardest at the short end: 2h lost 3 points (0.25 → 0.22, −12% of its capacity revenue) while 12h lost 1 point. The regulator is not neutral on duration — it re-prices short assets downward every year as more of them qualify. A 2h project underwritten on the 2028/29 table is already 12% overstated on capacity revenue.',
            '两个版本之间曲线上每一点都下降，且短时端跌幅最大：2小时下降3个百分点（0.25→0.22，容量收入减少12%），而12小时仅下降1个百分点。监管方在时长上并非中性 — 随着更多短时资产取得资格，它每年都将其重新下调定价。以2028/29年度表格测算的2小时项目，其容量收入已被高估12%。'],
            sig:['Short assets are re-priced annually','短时资产每年被重新定价'] },
        ] },
      ] },
      { t:'src', src: SRC.derate, use:['Duration-differentiated de-rating factors by auction vintage','按拍卖年份的时长差异化折减系数'] },
    ] },

    { t:'card', title:['Before and after the battery build — what changed in the investable market','储能扩张前后 — 可投资市场发生的变化'], badges:['calc'], blocks:[
      { t:'table', head:[['Dimension','维度'],['Before (2016–2020)','此前（2016–2020）'],['Now (2026)','当前（2026）']], rows:[
        [{b:['Primary revenue line','主要收入来源']}, ['Frequency response (EFR / FFR)','调频响应（EFR/FFR）'], ['Balancing Mechanism 39% + day-ahead 38%','平衡机制39% + 日前38%']],
        [{b:['Optimal design','最优设计']}, ['0.5–1h, power-dense','0.5–1小时，功率密集'], ['2h today, 4h for the next de-rating vintage','当前2小时，下一折减版本为4小时']],
        [{b:['Who wins','谁获胜']}, ['Whoever qualifies first','最先取得资格者'], ['Whoever trades best and connects earliest','交易最优且并网最早者']],
        [{b:['Barrier to entry','进入壁垒']}, ['Technical qualification','技术资格认证'], ['Connection queue position and consent','并网队列位置与规划许可']],
        [{b:['Revenue predictability','收入可预测性']}, ['High while scarce, then collapsed','稀缺期高，随后崩塌'], ['Moderate — contracted structures now available','中等 — 已有合同化结构可用']],
        [{b:['Lender posture','贷款人态度']}, ['Corporate / balance-sheet only','仅企业或表内融资'], ['Project debt available against tolls, floors and swaps','以租赁、保底与互换为基础可获项目融资']],
      ] },
      { t:'why', text:['The single most investable change is the last row. Between 2024 and 2026 GB developed a genuine contracted-revenue market — tolls at around ' + fmtCk(M.contracted[0].v) + '/MW/yr, portfolio floors around ' + fmtCk(M.contracted[1].v) + ', and the first publicly reported multi-year revenue swaps at about ' + fmtCk(M.contracted[2].v) + '. That is what makes non-recourse debt possible and what defines the exit specification. A merchant-only GB thesis is now a choice, not a necessity — and it should be priced as the riskier of two available structures.',
        '最具投资意义的变化是最后一行。2024至2026年间，英国形成了真实的合同化收入市场 — 容量租赁约' + fmtCk(M.contracted[0].v) + '/MW/年，组合层面保底约' + fmtCk(M.contracted[1].v) + '，首批公开披露的多年期收益互换约' + fmtCk(M.contracted[2].v) + '。这正是无追索权债务得以实现的基础，也界定了退出规格。纯市场化的英国投资逻辑如今是一种选择而非必然 — 且应被定价为两种可选结构中风险更高的一种。'],
        sig:['Contracted revenue is now a real option','合同化收入已成为真实选项'] },
    ] },

    { t:'card', title:['Who owns GB storage — five strategies competing for the same MW','谁持有英国储能 — 五类策略争夺同一批MW'], badges:['public','illus'], live:false, blocks:[
      { t:'players', items:[
        { type:['Listed storage fund','上市储能基金'], n:['Dedicated GB storage investment trusts','专注英国储能的上市投资信托'], met:'~0.5–1.5 GW each',
          p:['Own operating assets and outsource trading. Publicly reported revenue per MW makes them the market’s de-facto benchmark — and their discounts to NAV are the clearest signal of how merchant risk is being priced.',
             '持有运营资产并将交易外包。其每MW收入公开披露，成为市场事实上的基准；其相对净值的折价则最清晰地反映市场如何为市场化风险定价。'] },
        { type:['Utility / IPP','公用事业与独立发电商'], n:['Vertically integrated generators and suppliers','纵向一体化的发电与供电企业'], met:'balance-sheet funded',
          p:['Build and hold alongside a supply book, so the battery hedges an existing portfolio rather than standing alone. They can accept lower standalone returns because the asset has internal value.',
             '在自有售电业务旁建设并持有，使电池成为既有组合的对冲而非独立资产。因资产具备内部价值，其可接受更低的独立收益率。'] },
        { type:['Global infra platform','全球基础设施平台'], n:['Pension- and insurance-backed infrastructure managers','养老金与保险支持的基础设施管理人'], met:'multi-GW mandates',
          p:['Acquire operating or near-operating portfolios with contracted revenue. They set the exit specification: contracted or floor-supported cash flow, delivered capacity, operating track record.',
             '收购具备合同化收入的已运营或接近运营的组合。他们设定了退出规格：合同化或保底支撑的现金流、可交付容量、运营业绩记录。'] },
        { type:['Optimiser-developer','优化商兼开发商'], n:['Trading-led developers retaining route-to-market','以交易为核心并保留售电路径的开发商'], met:'fee + upside share',
          p:['The scarce capability in GB is dispatch execution, not construction. Firms that own the trading stack capture the ' + fmtPct((M.realisedRatio.strong - M.realisedRatio.fleetMedian) * 100, 0) + '-point premium over median realised revenue.',
             '英国稀缺的能力是调度执行而非建设。掌握交易能力的机构可获取相对中位实际收入' + fmtPct((M.realisedRatio.strong - M.realisedRatio.fleetMedian) * 100, 0) + '个百分点的溢价。'] },
        { type:['OEM / integrator','设备商与集成商'], n:['Chinese and Western cell and system suppliers','中西方电芯与系统供应商'], met:'equipment + LTSA',
          p:['Embedded as equipment and long-term service providers rather than asset owners. Their pricing sets GB capex, and their warranty terms set the practical cycling limit in every model.',
             '主要作为设备与长期服务提供方嵌入，而非资产持有方。其定价决定英国的资本开支，其质保条款决定各模型中实际可行的循环上限。'] },
      ] },
      { t:'note', text:['Concentration read: GB is fragmented on ownership but concentrated on capability. Many parties can own a battery; comparatively few can trade one at the top of the realised-revenue distribution, and that is where the return dispersion sits.',
        '集中度解读：英国在所有权上分散，在能力上集中。能持有电池的主体众多，但能将其交易表现维持在实际收入分布顶部的机构相对稀少，而收益离散正源于此。'] },
      { t:'why', text:['For a new entrant this determines structure before it determines price. You are not competing for scarce assets — you are competing for scarce execution and scarce connection dates. The practical implication is that the optimiser contract, not the EPC contract, is the document that most changes the investment case, and it should carry benchmarked performance tests, step-downs and termination rights from day one.',
        '对新进入者而言，这一点在决定价格之前先决定结构。竞争对象并非稀缺资产，而是稀缺的执行能力与稀缺的并网日期。实务含义是：最能改变投资结论的文件是优化商合同而非EPC合同，且自第一天起就应包含基准化的业绩测试、降费机制与终止权。'],
        sig:['Compete for execution, not assets','争夺执行能力而非资产'] },
    ] },

    { t:'card', title:['Exit channels — how capital actually recycles out of GB storage','退出渠道 — 资本如何真实从英国储能中回收'], badges:['public'], live:false, blocks:[
      { t:'exits', items:[
        { n:['1 · Develop and sell down','1 · 开发后出售'], w:['Most common route','最常见路径'],
          d:['De-risk to a defined point — Gate 2 secured, consent implementable, connection date firm — then sell to a long-term holder. Price is the DCF of contracted and benchmarked merchant revenue plus a development premium.',
             '将项目去风险至明确节点 — 取得Gate 2、规划许可可实施、并网日期确定 — 再出售给长期持有方。价格为合同化及基准化市场化收入的折现值加开发溢价。'],
          c:['Value inflects at Gate 2 countersignature and again at implementable consent, not at planning submission.','价值在Gate 2会签及规划许可可实施两个节点跃升，而非在提交规划申请时。'] },
        { n:['2 · Platform build and stake sale','2 · 平台化建设与股权引入'], w:['Manager-led','管理人主导'],
          d:['Aggregate operating assets into a branded platform, then sell a strategic stake or raise institutional capital against it. Recycles capital while retaining management economics and the trading stack.',
             '将运营资产聚合为品牌化平台，再出售战略股权或以其为载体募集机构资金。在保留管理收益与交易能力的同时回收资本。'],
          c:['Requires a credible route-to-market story, because the buyer is underwriting execution as much as assets.','需要可信的售电路径叙事，因为买方承销的既是资产也是执行能力。'] },
        { n:['3 · Corporate M&A','3 · 公司层面并购'], w:['Founder / PE exit','创始人/PE退出'],
          d:['Sell the whole developer, pricing operating assets, the queue position portfolio and the optimiser capability together. Buyers are global infrastructure and pension managers seeking a platform rather than single assets.',
             '整体出售开发商，将运营资产、并网队列位置组合与优化能力一并定价。买方为寻求平台而非单一资产的全球基础设施与养老金管理人。'],
          c:['Queue position portfolios have become a distinct valuation line since connections reform.','自并网改革以来，并网队列位置组合已成为独立的估值项。'] },
        { n:['4 · Refinancing','4 · 再融资'], w:['Post-COD','投运后'],
          d:['Once operating and contracted, replace development equity with long-tenor non-recourse debt, releasing capital without selling the asset. GB lenders will size against a toll or a floor far more readily than against merchant revenue.',
             '投运并签约后，以长期无追索权债务置换开发期股权，在不出售资产的前提下释放资本。相较市场化收入，英国贷款人更愿以租赁或保底安排债务规模。'],
          c:['A toll at ' + fmtCk(M.contracted[0].v) + '/MW/yr supports materially more leverage than a merchant case at the same expected value.','在期望值相同的情况下，' + fmtCk(M.contracted[0].v) + '/MW/年的租赁结构可支撑显著高于市场化情景的杠杆。'] },
      ] },
      { t:'why', text:['All four routes price the same two things: contracted cash flow and delivery certainty. Pension capital is the terminal buyer, but it buys through infrastructure platforms and it buys operating or near-operating, contracted risk. That sets the exit specification for anyone developing in GB today — a floor-supported or tolled revenue line, a firm connection, and a demonstrated realised-to-theoretical ratio — not a merchant thesis.',
        '四条路径定价的是同样两件事：合同化现金流与交付确定性。养老金资本是最终买家，但其通过基础设施平台买入，且只买已运营或接近运营、已签约的风险。这为今天在英国开发的任何主体设定了退出规格：保底或租赁支撑的收入、确定的并网、以及可验证的实际与理论收入比 — 而非市场化押注。'],
        sig:['Build to the exit specification','按退出规格建设'] },
    ] },

    { t:'g2', cards:[
      { title:['Near-term outlook — 2026 to 2029: execution decides returns','近期展望 — 2026至2029：执行决定收益'], badges:['official','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2026–2027','2026–2027'], h:['Connection re-ordering','并网重新排序'], p:['Gate 2 offers phased through March 2027 determine which projects have a 2029–2030 COD at all. Queue position becomes the primary valuation variable.','Gate 2要约分阶段发出至2027年3月，决定哪些项目能实现2029–2030年投运。队列位置成为首要估值变量。'] },
          { yr:['2027–2028','2027–2028'], h:['Services floor, wholesale carries','服务见底，批发承载'], p:['Frequency-response revenue approaches a floor set by opex-plus-margin bidding. Wholesale and BM carry the case, so optimiser selection dominates asset selection.','调频响应收入接近由“运维加边际”报价决定的底部。批发与平衡机制承载投资逻辑，因此优化商选择的重要性超过资产选择。'] },
          { yr:['2028–2029','2028–2029'], h:['De-rating squeeze on short assets','折减系数挤压短时资产'], p:['Successive de-rating vintages cut 1–2h capacity value further while 4h holds. New build converges on 2h+ with an augmentation path.','连续的折减系数版本进一步削减1–2小时资产的容量价值，而4小时基本维持。新建项目向“2小时以上并保留增容路径”收敛。'] },
        ] },
        { t:'why', text:['In this window nothing about the market changes in your favour. Spread compression under the central buildout path reaches ' + fmtPct((1 - M.compression2h.CENTRAL[4]) * 100, 0) + ' by 2029 for a 2h asset, and services keep falling. The only levers a sponsor controls are connection date, duration and optimiser. Underwrite as if all three must be top-quartile, because the market will not compensate for any of them being average.',
          '在这一窗口内，市场不会有任何变化对你有利。在中性投产路径下，2小时资产的价差压缩至2029年达到' + fmtPct((1 - M.compression2h.CENTRAL[4]) * 100, 0) + '，且服务收入持续下滑。发起人可控的杠杆只有并网日期、时长与优化商三项。应按三项均须处于前四分之一来测算，因为市场不会为其中任何一项的平庸表现给予补偿。'],
          sig:['Three controllable levers only','仅三项可控杠杆'] },
      ] },
      { title:['Long-term outlook — 2030 to 2035: policy demand meets delivery reality','长期展望 — 2030至2035：政策需求遭遇交付现实'], badges:['official','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2030','2030'], h:['CP2030 target year','CP2030目标年'], p:['Policy requires 23–27 GW of batteries. The central buildout path reaches 16 GW and the high path 20 GW — so on current trajectory the target is missed on the central case.','政策要求23–27GW电池。中性投产路径达到16GW，高情景达20GW — 因此按当前轨迹，中性情景下目标无法达成。'] },
          { yr:['2031–2033','2031–2033'], h:['LDES becomes a separate class','长时储能成为独立类别'], p:['Cap-and-floor awards convert 8h+ projects into regulated, contracted assets with a different cost of capital and different buyers from 2h merchant storage.','上下限机制授予将8小时以上项目转化为受监管、合同化的资产，其资本成本与买家群体均不同于2小时市场化储能。'] },
          { yr:['2033–2035','2033–2035'], h:['Replacement and augmentation cycle','置换与增容周期'], p:['The 2016–2020 short-duration fleet reaches end of warranted life with de-rating factors that no longer support it. Augmentation-ready sites hold value; fixed 1h sites do not.','2016–2020年建设的短时机组达到质保寿命终点，而折减系数已不再支持其经济性。具备增容条件的场址保值，固定1小时场址则不然。'] },
        ] },
        { t:'why', text:['The long-run case rests on a gap the market is not currently pricing: policy needs 23–27 GW, the central delivery path gives 16 GW, and the difference is constrained by connections and consent rather than by capital. If that gap persists, the assets that are already connected in 2030 are on the scarce side. If connections reform succeeds faster than expected, the high buildout path applies and 2h merchant economics compress ' + fmtPct((1 - M.compression2h.HIGH[5]) * 100, 0) + ' by 2030. Both branches point to the same protection: secure the connection date and the duration, and contract enough revenue to survive the high case.',
          '长期逻辑基于一个市场当前尚未定价的缺口：政策需要23–27GW，中性交付路径仅提供16GW，而差额的约束来自并网与规划许可而非资本。若该缺口持续，2030年前已并网的资产将处于稀缺一侧。若并网改革推进快于预期，则适用高投产路径，2小时市场化经济性到2030年压缩' + fmtPct((1 - M.compression2h.HIGH[5]) * 100, 0) + '。两条分支指向同一项保护：锁定并网日期与时长，并签约足够收入以承受高情景。'],
          sig:['Same protection in both branches','两条分支下保护措施相同'] },
      ] },
    ] },

    { t:'card', title:['What breaks this storyline — three monitored uncertainties','哪些因素会打破该叙事 — 三项须持续监测的不确定性'], badges:['public','calc'], blocks:[
      { t:'table', head:[['Uncertainty','不确定性'],['Why it matters','影响机理'],['Monitoring trigger','监测触发条件']], rows:[
        [{b:['Connection oversubscription & commitment fees','并网超额认购与承诺费']},
         ['A fee or milestone test that thins the queue moves the buildout path toward LOW, which raises merchant revenue for those who survive it. It is the single largest two-sided risk in the model.','若收费或里程碑考核压缩队列，投产路径将移向低情景，从而提高存活项目的市场化收入。这是模型中最大的双向风险。'],
         ['Any Ofgem/NESO decision on oversubscription charging','Ofgem或NESO关于超额认购收费的任何决定']],
        [{b:['Charging reform (TNUoS / DUoS / BSUoS)','网络收费改革']},
         ['Network charges are a direct deduction from the merchant line and are locationally differentiated. A reform that raises storage charges in the north changes regional site selection outright.','网络费用是市场化收入的直接扣减项，且按区位差异化。若改革提高北部储能收费，将直接改变区域选址策略。'],
         ['Publication of a charging-reform decision or transitional arrangement','收费改革决定或过渡安排的发布']],
        [{b:['Support-scheme gating of connections','并网与收入支持机制挂钩']},
         ['If future connection windows are gated on holding a support contract, pure-merchant storage is structurally disadvantaged and the contracted-revenue market re-prices upward.','若未来并网窗口以持有支持性合同为前提，纯市场化储能将处于结构性劣势，合同化收入市场则重新上调定价。'],
         ['Any consultation linking connection eligibility to a revenue-support scheme','任何将并网资格与收入支持机制挂钩的征询文件']],
      ] },
      { t:'why', text:['All three are policy variables, all three are two-sided, and none of them is diversifiable within GB. That is the argument for structuring rather than forecasting: a change-in-law allocation, a repricing right on network charges, and a contracted floor together convert three unforecastable policy risks into three negotiated positions. A model that simply picks a central case for all three is not conservative — it is silent on the largest source of variance.',
        '三者均为政策变量、均为双向、且在英国境内均不可分散。这正是“以结构应对而非以预测应对”的理由：法律变更风险分担、网络费用重新定价权、以及合同化保底三者结合，可将三项无法预测的政策风险转化为三项经过谈判的立场。若模型仅对三者取中性情景，那不是审慎，而是对最大方差来源保持沉默。'],
        sig:['Structure it, don’t forecast it','以结构应对，而非预测'] },
    ] },

    { t:'card', title:['Bridge to the detailed dashboard — the investor’s question map','进入详细看板 — 投资人的问题地图'], badges:['calc'], blocks:[
      { t:'walk', items:[
        ['03', ['Capacity Market','容量市场'], ['How much de-rated MW will actually be paid?','实际获得付费的折减MW有多少？'], 'capacity'],
        ['04', ['Wholesale & BM','批发与平衡'], ['What spread will actually be realised, not modelled?','实际可实现的价差是多少，而非模型值？'], 'energy'],
        ['05', ['System Services','系统服务'], ['How far can this line still fall?','这项收入还能下跌多少？'], 'services'],
        ['06', ['Duration & LDES','时长与长时储能'], ['Is the fourth hour worth its capex?','第4小时是否值其造价？'], 'duration'],
        ['07', ['Pipeline','项目管线'], ['Who else arrives in my COD year?','投运年度还有谁会到场？'], 'pipeline'],
        ['08', ['Grid Connection','并网'], ['Can this project actually energise on time?','项目能否按时送电？'], 'grid'],
      ] },
    ] },
  ] };
};

// ============================== CAPACITY MARKET ==============================
SEC_B.capacity = function (){
  const d2 = M.deratingCurve[2], d4 = M.deratingCurve[4], d8 = M.deratingCurve[8];
  const perNameplate = hh => O.t4Price * M.deratingCurve[hh] * 1000;
  return {
  head: ['Capacity Market — how much de-rated MW will actually be paid, and at what price?','容量市场 — 实际获得付费的折减MW有多少？价格几何？'],
  cap: ['The GB capacity payment is the product of three numbers a sponsor only partly controls: the de-rating factor for the chosen duration, the auction clearing price in the year entered, and the de-rated MW actually prequalified. This tab isolates each.',
        '英国容量付费是三个数字的乘积，而发起人仅能部分控制：所选时长对应的折减系数、参与年度的拍卖出清价、以及实际通过预资格的折减MW。本页逐项拆解。'],
  blocks: [
    { t:'card', mt:false, title:['Clearing prices by delivery year — T-4 and T-1','各交付年度出清价 — T-4与T-1'], badges:['official'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['T-4 · DY ' + O.t4DY,'T-4 · 交付年' + O.t4DY], v:'£' + fmt1(O.t4Price) + '<small>/kW/yr</small>', d:['awarded ' + fmtN(O.t4AwardedMW) + ' MW de-rated','中标折减容量' + fmtN(O.t4AwardedMW) + 'MW'], b:['official'] },
        { l:['T-1 · DY ' + O.t1DY,'T-1 · 交付年' + O.t1DY], v:'£' + fmt1(O.t1Price) + '<small>/kW/yr</small>', d:['awarded ' + fmtN(O.t1AwardedMW) + ' MW de-rated','中标折减容量' + fmtN(O.t1AwardedMW) + 'MW'], b:['official'] },
        { l:['T-4 six-year range','T-4六年区间'], v:'£18 – £65', d:['3.6× peak-to-trough','峰谷相差3.6倍'], b:['calc'] },
        { l:['New-build agreement length','新建协议年限'], v:O.cmAgreementYears + '<small> yr</small>', d:['index-linked to inflation, price fixed at award','与通胀挂钩，价格于中标时固定'], b:['official'] },
      ] },
      { t:'line', cfg:{ xs: M.cmYears, yfmt: v => '£' + fmt1(v), h: 240, ymin: 0,
        series: [{ name:['T-4 clearing price','T-4出清价'], color:'var(--s1)', vals: M.t4Series }],
        ann: [{ si: 0, i: 5, text: '£' + fmt1(O.t4Price) }] } },
      { t:'cap', text:['T-1 auctions for the same delivery years cleared at £75, £60, £35.79, £20 and £' + fmt1(O.t1Price) + ' — a monotonic decline as the T-4 procurement met the requirement four years earlier.',
        '同期交付年度的T-1拍卖分别以£75、£60、£35.79、£20及£' + fmt1(O.t1Price) + '出清 — 呈单调下降，因需求已在四年前的T-4采购中被满足。'] },
      { t:'why', text:['The T-4 price is set by how much capacity turns up, not by how much the system needs — which is why it fell 58% in two auctions without any change in the reliability standard. For underwriting, three rules follow: model a range rather than the last print; treat the auction you enter as a one-shot event that fixes ' + O.cmAgreementYears + ' years of price; and never rely on the T-1 as a fallback, because it has cleared below £21/kW/yr in each of the last two delivery years and exists to top up, not to reprice.',
        'T-4价格由参与投标的容量规模决定，而非由系统需求决定 — 这正是它在可靠性标准未变的情况下、两次拍卖内下跌58%的原因。承销上有三条原则：对区间建模而非对最近一次出清价建模；将参与的那次拍卖视为锁定' + O.cmAgreementYears + '年价格的一次性事件；绝不将T-1作为退路，因其在最近两个交付年度均低于£21/kW/年，其功能是补充而非重新定价。'],
        sig:['Price is supply-set, not need-set','价格由供给决定，而非需求'] },
      { t:'src', src: SRC.cmreg, use:['Clearing prices, awarded de-rated capacity and agreement terms','出清价、中标折减容量与协议条款'] },
    ] },

    { t:'card', title:['De-rating factors — the regulator’s duration price','折减系数 — 监管方对时长的定价'], badges:['official'], live:true, blocks:[
      { t:'table', head:[['Duration','时长'],['T-4 2028/29','T-4 2028/29'],['T-4 ' + O.t4DY, 'T-4 ' + O.t4DY],['Change','变化'],['CM revenue per nameplate MW','每铭牌MW容量收入']],
        num:[1,2,3,4],
        rows: M.derateHours.map((hh, i) => {
          const a = M.derateVintages['T-4 2028/29'][i], b = M.derateVintages['T-4 ' + O.t4DY][i];
          return [{ b: [hh + 'h', hh + '小时'] }, fmtPct(a * 100, 0), fmtPct(b * 100, 0),
            fmtPct((b - a) * 100) + ' pts', fmtC(O.t4Price * b * 1000)];
        }) },
      { t:'bar', cfg:{ xs: M.derateHours.map(x => x + 'h'), mode:'group', bw: 22, yfmt: v => fmtPct(v * 100, 0), h: 240,
        series: [
          { name:['T-4 2028/29 vintage','T-4 2028/29版本'], color:'var(--s3)', vals: M.derateVintages['T-4 2028/29'] },
          { name:['T-4 ' + O.t4DY + ' vintage','T-4 ' + O.t4DY + '版本'], color:'var(--s1)', vals: M.derateVintages['T-4 ' + O.t4DY] },
        ] } },
      { t:'note', b:['Vintage discipline: ','版本纪律：'],
        text:['These are indicative seed values pending replacement with the published auction-specific table for the exact auction the project will enter. A factor from the wrong vintage overstates or understates capacity revenue by 5–15% at the short end.',
              '此为示意性种子数值，须以项目实际参与拍卖所对应的官方公布表格替换。使用错误版本的系数会在短时端高估或低估容量收入5–15%。'] },
      { t:'why', text:['The curve is the regulator telling you the price of an hour. Going 2h → 4h raises de-rated capacity from ' + fmtPct(d2 * 100, 0) + ' to ' + fmtPct(d4 * 100, 0) + ' — capacity revenue per nameplate MW rises from ' + fmtC(perNameplate(2)) + ' to ' + fmtC(perNameplate(4)) + ', an uplift of ' + fmtC(perNameplate(4) - perNameplate(2)) + '/MW/yr for one extra MWh per MW. Going 4h → 8h adds only ' + fmtC(perNameplate(8) - perNameplate(4)) + ' for double the energy. The capacity mechanism therefore pays generously for the third and fourth hour and poorly beyond it — which is exactly why 8h+ needed a separate cap-and-floor regime to exist at all.',
        '这条曲线是监管方对“一小时”的定价。由2小时增至4小时，折减后容量由' + fmtPct(d2 * 100, 0) + '升至' + fmtPct(d4 * 100, 0) + ' — 每铭牌MW容量收入由' + fmtC(perNameplate(2)) + '升至' + fmtC(perNameplate(4)) + '，即每MW增加1MWh可换取' + fmtC(perNameplate(4) - perNameplate(2)) + '/MW/年。由4小时增至8小时，能量翻倍却仅增加' + fmtC(perNameplate(8) - perNameplate(4)) + '。因此容量机制对第三、第四小时给付慷慨，对其后则给付微薄 — 这正是8小时以上必须依靠独立的上下限机制才能成立的原因。'],
        sig:['Hours 3–4 are the paid ones','获付费的是第3–4小时'] },
      { t:'src', src: SRC.derate, use:['Duration-differentiated de-rating factors by auction vintage','按拍卖年份的时长差异化折减系数'] },
    ] },

    { t:'card', title:['Nameplate → paid capacity bridge (100 MW example)','铭牌至获付容量桥（100MW示例）'], badges:['calc','illus'], live:true, blocks:[
      { t:'wf', cfg:{ yfmt: v => fmtN(v) + ' MW', h: 270, zeroBase: true, steps: [
        { l:['Nameplate MW','铭牌MW'], v: 100, t:'start' },
        { l:['− connection capacity limit (TEC)','− 并网容量限制(TEC)'], v: -2, t:'d' },
        { l:['− auxiliary load & availability','− 站用电与可用率'], v: -3, t:'d' },
        { l:['× de-rating factor at 2h','×2小时折减系数'], v: -74, t:'d' },
        { l:['Paid de-rated MW','获付费折减MW'], v: 21, t:'total' },
      ] } },
      { t:'why', text:['On a 2-hour design, 100 MW of steel earns capacity revenue on about 21 MW. That is not a leakage to be fixed — it is the mechanism working as intended, and it means the Capacity Market cannot be the primary revenue line for short-duration GB storage. Its correct role in a model is a fixed, ' + O.cmAgreementYears + '-year, inflation-linked base that lenders will size against, sitting underneath a volatile merchant line that they will not.',
        '在2小时设计下，100MW的物理容量仅就约21MW获得容量收入。这并非需要修正的漏损，而是机制的设计意图；这也意味着容量市场无法成为英国短时储能的主要收入来源。其在模型中的正确角色是：一条固定的、' + O.cmAgreementYears + '年期、与通胀挂钩的基础收入，可供贷款人据以安排债务规模，并位于其不予认可的波动性市场化收入之下。'],
        sig:['Small, but it is the bankable part','占比虽小，却是可融资部分'] },
    ] },

    { t:'card', title:['Capacity revenue by COD year and duration','按投运年度与时长的容量收入'], badges:['calc','illus'], live:true, blocks:[
      { t:'bar', cfg:{ xs: M.durConfigs.map(x => x + 'h'), mode:'group', bw: 26, yfmt: v => fmtCk(v), labels: false, h: 240,
        series: [
          { name:['At £' + fmt1(O.t4Price) + '/kW/yr (last T-4)','按£' + fmt1(O.t4Price) + '/kW/年（最近T-4）'], color:'var(--s1)', vals: M.durConfigs.map(hh => O.t4Price * interp(M.deratingCurve, hh) * 1000) },
          { name:['At £45/kW/yr (mid-cycle)','按£45/kW/年（周期中值）'], color:'var(--s3)', vals: M.durConfigs.map(hh => 45 * interp(M.deratingCurve, hh) * 1000) },
        ] } },
      { t:'why', text:['The two bars bracket the underwriting question. At the last clearing price a 4h asset earns ' + fmtCk(perNameplate(4)) + '/MW/yr from capacity; at a mid-cycle £45/kW/yr it earns ' + fmtCk(45 * d4 * 1000) + '. The spread between those is larger than the entire system-services line, so capacity price risk — not services risk — is the second-order variable worth hedging after merchant. In practice that means entering the auction with a bid strategy, not simply prequalifying and accepting the clear.',
        '两组柱状图界定了承销问题的边界。按最近出清价，4小时资产的容量收入为' + fmtCk(perNameplate(4)) + '/MW/年；按周期中值£45/kW/年则为' + fmtCk(45 * d4 * 1000) + '。两者差额大于整个系统服务收入项，因此值得在市场化风险之后对冲的次级变量是容量价格风险，而非服务风险。实务上意味着应带着投标策略参与拍卖，而非仅通过预资格并被动接受出清结果。'],
        sig:['Bid strategy, not just prequalification','需投标策略，而不仅是预资格'] },
    ] },

    { t:'card', title:['What can go wrong between award and payment','中标至收款之间可能出错的环节'], badges:['calc'], live:false, blocks:[
      { t:'ladder', items:[
        { n:['1 · Prequalification','1 · 预资格'], d:['Metering, connection evidence and technical class must all be accepted; a rejected component removes the whole unit from the auction.','计量、并网证据与技术类别须全部获接受；任一环节被否即整台机组退出拍卖。'] },
        { n:['2 · Auction outcome','2 · 拍卖结果'], d:['A price-taker bid clears or does not. There is no partial award and no second attempt in the same delivery year.','价格接受型报价要么出清要么落空。同一交付年度内没有部分中标，也没有第二次机会。'] },
        { n:['3 · Milestone delivery','3 · 里程碑交付'], d:['Financial commitment and substantial completion milestones carry termination fees and credit-cover calls if missed.','若未达成财务承诺与实质完工里程碑，将面临终止费用及信用保证金追缴。'] },
        { n:['4 · Satisfactory performance days','4 · 合格履约日'], d:['Payment depends on demonstrated availability during system stress events, not on being connected.','付款取决于系统紧张事件期间实证的可用性，而非仅取决于已并网。'] },
        { n:['5 · Penalty exposure','5 · 罚则敞口'], d:['Non-delivery during a System Stress Event is penalised and capped, but the cap is a multiple of annual revenue.','系统紧张事件期间未交付将被处罚，罚金虽有上限，但该上限为年度收入的数倍。'] },
      ] },
      { t:'warn', text:['A Capacity Market agreement is an availability obligation, not an annuity. Model the penalty regime explicitly for any asset whose duration sits near the bottom of its de-rating band, because those are the units most likely to be energy-limited during a long stress event.',
        '容量市场协议是可用性义务，而非年金。对时长处于其折减档位下沿的资产，须显式建模罚则机制，因为这类机组在长时间紧张事件中最可能出现能量受限。'] },
      { t:'why', text:['The failure mode that actually bites is step 4, and it is duration-related: a 1–2h unit can be fully available and still run out of energy in a multi-hour stress event, incurring penalties in precisely the year the capacity payment mattered most. This is the second, less visible reason the fourth hour is worth paying for — it converts a capacity payment from a conditional receipt into a reliable one.',
        '真正造成损失的失效环节是第4步，且与时长相关：1–2小时机组可能可用率完全达标，却在多小时紧张事件中耗尽能量，恰恰在容量付费最关键的年份产生罚金。这是第4小时值得付费的第二个、也较不显见的理由 — 它把容量付费由或有收款转变为可靠收款。'],
        sig:['Availability ≠ energy adequacy','可用率≠能量充裕度'] },
    ] },
  ] };
};

// ============================== WHOLESALE & BM ==============================
SEC_B.energy = function (){
  const cod = +state.codYear, ci = M.buildYears.indexOf(String(cod));
  const compC = M.compression2h.CENTRAL[ci >= 0 ? ci : 4], compH = M.compression2h.HIGH[ci >= 0 ? ci : 4], compL = M.compression2h.LOW[ci >= 0 ? ci : 4];
  return {
  head: ['Wholesale & Balancing Mechanism — what spread is actually realised, not modelled?','批发与平衡机制 — 实际可实现的价差是多少，而非模型值？'],
  cap: ['This is the largest revenue line and the least contractible. Two independent haircuts apply: the gap between theoretical and realised revenue (execution), and the gap between today and your COD year (saturation).',
        '这是最大且最难合同化的收入项。存在两道相互独立的折减：理论收入与实际收入之间的差距（执行），以及当前与投运年度之间的差距（饱和）。'],
  blocks: [
    { t:'card', mt:false, title:['Realised revenue by duration — trailing twelve months','按时长的实际收入 — 过去十二个月'], badges:['tp'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['1h realised','1小时实际'], v:fmtCk(M.bmRevenueByDur[1]) + '<small>/MW/yr</small>', b:['tp'] },
        { l:['2h realised','2小时实际'], v:fmtCk(M.bmRevenueByDur[2]) + '<small>/MW/yr</small>', d:['+' + fmtPct((M.bmRevenueByDur[2] / M.bmRevenueByDur[1] - 1) * 100, 0) + ' vs 1h','较1小时+' + fmtPct((M.bmRevenueByDur[2] / M.bmRevenueByDur[1] - 1) * 100, 0)], b:['tp'] },
        { l:['4h realised','4小时实际'], v:fmtCk(M.bmRevenueByDur[4]) + '<small>/MW/yr</small>', d:['+' + fmtPct((M.bmRevenueByDur[4] / M.bmRevenueByDur[2] - 1) * 100, 0) + ' vs 2h','较2小时+' + fmtPct((M.bmRevenueByDur[4] / M.bmRevenueByDur[2] - 1) * 100, 0)], b:['tp'] },
        { l:['8h realised','8小时实际'], v:fmtCk(M.bmRevenueByDur[8]) + '<small>/MW/yr</small>', d:['+' + fmtPct((M.bmRevenueByDur[8] / M.bmRevenueByDur[4] - 1) * 100, 0) + ' vs 4h','较4小时+' + fmtPct((M.bmRevenueByDur[8] / M.bmRevenueByDur[4] - 1) * 100, 0)], b:['tp'] },
      ] },
      { t:'line', cfg:{ xs:['1h','2h','4h','6h','8h'], yfmt: v => fmtCk(v), ymin: 0, h: 230,
        series:[{ name:['Realised revenue by duration','按时长的实际收入'], color:'var(--s1)', vals:[M.bmRevenueByDur[1], M.bmRevenueByDur[2], M.bmRevenueByDur[4], M.bmRevenueByDur[6], M.bmRevenueByDur[8]] }] } },
      { t:'why', text:['Merchant revenue is strongly concave in duration. Doubling from 2h to 4h costs roughly double the energy capex but adds only ' + fmtPct((M.bmRevenueByDur[4] / M.bmRevenueByDur[2] - 1) * 100, 0) + ' of merchant revenue; 4h to 8h adds ' + fmtPct((M.bmRevenueByDur[8] / M.bmRevenueByDur[4] - 1) * 100, 0) + '. On merchant grounds alone GB storage should be short. The reason to build longer is entirely on the capacity and resilience side — which is why the duration decision must be made on combined incremental NPV and never on the trading case alone.',
        '市场化收入对时长呈显著凹性。由2小时增至4小时，能量段造价约翻倍，但市场化收入仅增加' + fmtPct((M.bmRevenueByDur[4] / M.bmRevenueByDur[2] - 1) * 100, 0) + '；由4小时增至8小时仅增加' + fmtPct((M.bmRevenueByDur[8] / M.bmRevenueByDur[4] - 1) * 100, 0) + '。仅从市场化角度看，英国储能应当做短。做长的理由完全来自容量与韧性一侧 — 因此时长决策必须基于合并的增量NPV，绝不可仅凭交易逻辑。'],
        sig:['Merchant says short; capacity says long','市场化指向短时；容量指向长时'] },
      { t:'src', src: SRC.vendor, use:['Realised revenue per MW by duration; vendor and vintage must be recorded before transaction use','按时长的每MW实际收入；交易使用前须记录供应商与数据版本'] },
    ] },

    { t:'card', title:['Revenue composition — where the money is actually earned','收入构成 — 收益的实际来源'], badges:['tp'], live:true, blocks:[
      { t:'bar', cfg:{ xs: M.revShare.map(s => L(s.n)), bw: 56, rotX: true, yfmt: v => v + '%', labels: true, h: 240,
        series:[{ name:['Share of merchant revenue','占市场化收入比重'], color:'var(--s1)', vals: M.revShare.map(s => s.pct) }] } },
      { t:'why', text:['The Balancing Mechanism is now the largest single component at 39%, ahead of day-ahead at 38%. That matters because BM revenue is not a price you can hedge — it is a dispatch outcome you have to earn, instruction by instruction, against a ' + fmtPct(M.skipRate * 100, 0) + ' skip rate. A GB battery is therefore only partly a trading asset; roughly two-fifths of its income depends on being visible, flexible and correctly parameterised inside the system operator’s despatch stack.',
        '平衡机制目前是最大的单一收入项，占39%，高于日前市场的38%。其意义在于：平衡机制收入不是可对冲的价格，而是须逐条指令去争取的调度结果，且面对' + fmtPct(M.skipRate * 100, 0) + '的跳过率。因此英国电池只是部分意义上的交易资产；约五分之二的收入取决于其在系统运营方调度体系中是否可见、灵活且参数设置正确。'],
        sig:['Two-fifths is dispatch, not trading','五分之二靠调度而非交易'] },
    ] },

    { t:'card', title:['Theoretical → realised bridge (2h asset, £/MWh of spread value)','理论至实际桥（2小时资产，价差价值£/MWh）'], badges:['calc','illus'], live:true, blocks:[
      { t:'wf', cfg:{ yfmt: v => '£' + fmtN(v), h: 280, steps: M.spreadBridge } },
      { t:'why', text:['Roughly ' + fmtPct((1 - 65 / 112) * 100, 0) + ' of theoretical spread value never reaches the P&L, and the three largest deductions — forecast error, skip rate and network charges — are not efficiency losses that better equipment fixes. Two are execution and one is policy. This is why a GB base case built from a perfect-foresight backtest is not conservative but simply wrong, and why the optimiser contract deserves more diligence than the battery supply agreement.',
        '理论价差价值中约' + fmtPct((1 - 65 / 112) * 100, 0) + '从未进入损益表，且三项最大扣减 — 预测误差、跳过率与网络费用 — 均非更好的设备所能解决的效率损失。其中两项属执行，一项属政策。这正是为何以完全预见回测构建的英国基准情景不是审慎而是根本错误，也是为何优化商合同比电池供货协议更值得尽调。'],
        sig:['Backtests are not base cases','回测不等于基准情景'] },
    ] },

    { t:'card', title:['Buildout paths and spread compression to your COD year','投产路径与至投运年度的价差压缩'], badges:['forecast','illus'], live:true, blocks:[
      { t:'line', cfg:{ xs: M.buildYears, yfmt: v => fmt1(v) + ' GW', ymin: 0, h: 250,
        series:[
          { name:['Low buildout (revenue upside)','低投产（收益上行）'], color:'var(--s2)', vals: M.buildLow },
          { name:['Central buildout','中性投产'], color:'var(--s1)', vals: M.buildCentral },
          { name:['High buildout (revenue downside)','高投产（收益下行）'], color:'var(--s6)', vals: M.buildHigh },
        ] } },
      { t:'line', cfg:{ xs: M.buildYears, yfmt: v => fmtPct(v * 100, 0), h: 230,
        series:[
          { name:['2h revenue index — low buildout','2小时收入指数 — 低投产'], color:'var(--s2)', vals: M.compression2h.LOW },
          { name:['2h revenue index — central','2小时收入指数 — 中性'], color:'var(--s1)', vals: M.compression2h.CENTRAL },
          { name:['2h revenue index — high buildout','2小时收入指数 — 高投产'], color:'var(--s6)', vals: M.compression2h.HIGH },
        ] } },
      { t:'cmp', items:[
        { h:['At COD ' + state.codYear + ' — central case','投运年' + state.codYear + ' — 中性情景'], v: fmtPct(compC * 100, 0),
          s:['of today’s per-MW merchant revenue for a 2h asset','相当于当前2小时资产每MW市场化收入的比例'] },
        { h:['At COD ' + state.codYear + ' — high buildout','投运年' + state.codYear + ' — 高投产'], v: fmtPct(compH * 100, 0),
          s:['low-buildout case ' + fmtPct(compL * 100, 0) + ' — the spread between cases is the real risk','低投产情景' + fmtPct(compL * 100, 0) + ' — 情景间差距才是真实风险'] },
      ] },
      { t:'note', text:['The pipeline-to-spread transmission model and the fundamental price curve are calibrated to the same third-party source. They are not independent confirmation of each other, and a base case should not treat agreement between them as corroboration.',
        '管线至价差的传导模型与基本面价格曲线校准于同一第三方来源。两者并非相互独立的验证，基准情景不应将其一致性视为佐证。'] },
      { t:'why', text:['For a ' + state.codYear + ' COD the central case already removes ' + fmtPct((1 - compC) * 100, 0) + ' of today’s per-MW merchant revenue, and the high case removes ' + fmtPct((1 - compH) * 100, 0) + '. The gap between the two — ' + fmtPct((compC - compH) * 100, 0) + ' points — is what a sponsor is actually taking a view on, and it is decided by other people’s connection dates. That is the argument for contracting a floor: not because the central case fails, but because the sponsor has no influence over which case occurs.',
        '对' + state.codYear + '投运的项目，中性情景已抹去当前每MW市场化收入的' + fmtPct((1 - compC) * 100, 0) + '，高投产情景则抹去' + fmtPct((1 - compH) * 100, 0) + '。两者之间' + fmtPct((compC - compH) * 100, 0) + '个百分点的差距，才是发起人真正在下注的对象，而它由他人的并网日期决定。这正是签订保底安排的理由 — 并非因为中性情景不成立，而是因为发起人无法影响哪一种情景会发生。'],
        sig:['You are betting on other people’s CODs','你押注的是他人的投运时点'] },
      { t:'src', src: SRC.tec, use:['Probability-weighted TEC / ECR / REPD pipeline underlying the buildout cases','支撑投产情景的概率加权TEC/ECR/REPD管线'] },
    ] },
  ] };
};

// ============================== SYSTEM SERVICES ==============================
SEC_B.services = function (){
  const dc = M.services[0];
  return {
  head: ['System Services — volume share is at its ceiling, value is not','系统服务 — 成交份额已达上限，价值尚未见底'],
  cap: ['Batteries clear almost all dynamic response volume in GB. That is a saturation signal, not a competitive advantage: the price is set by the marginal accredited MW, and accredited supply exceeds requirement several times over in every dynamic product.',
        '在英国，电池已占动态响应类成交量的绝大部分。这是饱和信号而非竞争优势：价格由边际认证MW决定，而各动态类产品的认证供给均数倍于需求。'],
  blocks: [
    { t:'card', mt:false, title:['Auctioned service suite — requirement, supply and price','拍卖服务组合 — 需求、供给与价格'], badges:['official'], live:true, blocks:[
      { t:'table',
        head:[['Service','服务'],['Requirement (MW)','需求(MW)'],['Procured (MW)','成交(MW)'],['Qualified supply (MW)','合格供给(MW)'],['Supply / requirement','供给需求比'],['Clearing (£/MW/h)','出清价(£/MW/h)'],['Battery share','电池份额'],['Unit revenue yoy','单位收入同比']],
        num:[1,2,3,4,5,6,7],
        rows: M.services.map(s => [
          { b: [s.code + ' — ' + s.n[0], s.code + ' — ' + s.n[1]] },
          fmtN(s.reqMW), fmtN(s.procMW), fmtN(s.qualMW),
          fmt1(s.qualMW / s.reqMW) + '×', '£' + fmt1(s.price),
          s.share + '%', s.yoy == null ? '—' : s.yoy + '%',
        ]) },
      { t:'bar', cfg:{ xs: M.services.map(s => s.code), mode:'group', bw: 20, yfmt: v => fmtN(v) + ' MW', h: 250,
        series:[
          { name:['Requirement','需求'], color:'var(--s1)', vals: M.services.map(s => s.reqMW) },
          { name:['Qualified supply','合格供给'], color:'var(--s6)', vals: M.services.map(s => s.qualMW) },
        ] } },
      { t:'why', text:['Qualified supply exceeds requirement in every product, by ' + fmt1(dc.qualMW / dc.reqMW) + '× in Dynamic Containment alone. Where supply is deepest the price falls fastest (DC/DM/DR at −25% to −30% year on year); where supply is thinnest it holds (SR at 1.4× and QR at 1.9×). The forward-looking read is that any product batteries can dominate will be over-supplied within about three years of becoming profitable, so the reserve family is where the remaining value sits — and it is the family that rewards energy, not power.',
        '各产品的合格供给均超过需求，仅动态遏制一项即达' + fmt1(dc.qualMW / dc.reqMW) + '倍。供给最深处价格下跌最快（DC/DM/DR同比−25%至−30%）；供给最薄处价格得以维持（SR为1.4倍、QR为1.9倍）。前瞻性结论是：任何电池能够主导的产品，都会在其变得有利可图后约三年内被过度供给；因此剩余价值集中于备用类产品 — 而该类产品奖励的是能量而非功率。'],
        sig:['Value migrates to energy-based products','价值向能量型产品迁移'] },
      { t:'src', src: SRC.eac, use:['Auction requirements, procured volumes and clearing prices by service','各服务的拍卖需求、成交量与出清价'] },
    ] },

    { t:'card', title:['Price trajectory by product family','各产品族价格轨迹'], badges:['official','calc'], live:true, blocks:[
      { t:'bar', cfg:{ xs: M.services.map(s => s.code), bw: 46, yfmt: v => v + '%', labels: true, h: 230,
        series:[{ name:['Unit revenue change, year on year','单位收入同比变化'], color:'var(--s6)', vals: M.services.map(s => s.yoy == null ? 0 : s.yoy) }] } },
      { t:'cmp', items:[
        { h:['Dynamic family (DC / DM / DR)','动态类（DC/DM/DR）'], v:'−25% to −30%', s:['Power-based, instantaneous response; battery share 97–99%; deepest over-supply','功率型瞬时响应；电池份额97–99%；供给过剩最严重'] },
        { h:['Reserve family (BR / QR / SR)','备用类（BR/QR/SR）'], v:'−8% to −12%', s:['Energy-based sustained response; battery share 55–88%; competition from other technologies','能量型持续响应；电池份额55–88%；面临其他技术竞争'] },
      ] },
      { t:'why', text:['The split between the two families is the most useful forward signal in this tab. Dynamic products are falling roughly three times faster than reserve products, and the difference is entirely structural: instantaneous power is abundant once batteries are built, sustained energy is not. A 1h asset is exposed almost entirely to the falling family; a 4h asset can access both. Underwrite the dynamic line at trailing twelve-month unit revenue with a further decline assumption, and the reserve line flat at best.',
        '两个产品族之间的分化是本页最有价值的前瞻信号。动态类产品的下跌速度约为备用类的三倍，其差异完全是结构性的：电池建成后瞬时功率变得充裕，而持续能量并不会。1小时资产几乎完全暴露于下跌的产品族；4小时资产则可同时进入两类。动态类收入应按过去12个月单位收入并附加进一步下降假设测算，备用类最多按持平测算。'],
        sig:['Power is abundant, energy is not','功率充裕，能量不然'] },
    ] },

    { t:'card', title:['Underwriting rule for the services line','系统服务收入的承销规则'], badges:['calc'], live:false, blocks:[
      { t:'ladder', items:[
        { n:['Cap at trailing twelve months','以过去十二个月封顶'], d:['Never model a services growth rate. The observed base rate is −8% to −30% a year across the suite.','绝不设定服务收入增长率。全套产品的观察基准为每年−8%至−30%。'] },
        { n:['No MWh justified by services','不得以服务收入论证增配MWh'], d:['Dynamic products pay for MW, not MWh. Additional energy is justified by capacity de-rating and arbitrage, not by response.','动态类产品为MW付费而非MWh。增配能量的依据是容量折减系数与套利，而非响应服务。'] },
        { n:['Exclude from debt sizing','排除于债务规模测算之外'], d:['Treat services as equity upside. Lenders in GB size against the capacity agreement and any contracted floor.','将服务收入视为股权上行。英国贷款人以容量协议及任何合同保底安排债务规模。'] },
        { n:['Re-test each auction reform','每次拍卖机制改革后重新检验'], d:['Product definitions and procurement volumes have changed repeatedly; a product can be redesigned out of existence.','产品定义与采购量已多次变更；某项产品可能因重新设计而不复存在。'] },
      ] },
      { t:'why', text:['At ' + fmtCk(M.lab.servicesKW * 1000) + '/MW/yr the services line is roughly ' + fmtPct(M.lab.servicesKW * 1000 / M.bmRevenueByDur[2] * 100, 0) + ' of a 2h asset’s merchant revenue — small enough that removing it entirely should not break the investment case. If it does, the case was never a storage case; it was a bet on an ancillary market that has already been competed away once and is being competed away again.',
        '按' + fmtCk(M.lab.servicesKW * 1000) + '/MW/年计，服务收入约为2小时资产市场化收入的' + fmtPct(M.lab.servicesKW * 1000 / M.bmRevenueByDur[2] * 100, 0) + ' — 其规模小到即使完全剔除也不应影响投资结论。若剔除后投资逻辑不成立，那么它从来就不是储能投资逻辑，而是对一个已被竞争消化过一次、正在被再次消化的辅助服务市场的押注。'],
        sig:['Remove it; if the case breaks, it was never a case','剔除后若逻辑崩塌，说明本无逻辑'] },
    ] },
  ] };
};

// ============================== DURATION & LDES ==============================
SEC_B.duration = function (){
  const dni = liveScore('durFactors'), band = bandFor(M.durBands, dni);
  const d2 = M.deratingCurve[2], d4 = M.deratingCurve[4];
  const capUplift = O.t4Price * (d4 - d2) * 1000;
  const merchUplift = M.bmRevenueByDur[4] - M.bmRevenueByDur[2];
  const addCapexPerMW = 2 * M.lab.capexKWh * 1000;       // 2 extra MWh per MW
  const annualised = addCapexPerMW * 0.09;                // ~9% capital charge, indicative
  return {
  head: ['Storage Duration & LDES — is the fourth hour worth its capex?','储能时长与长时储能 — 第4小时是否值其造价？'],
  cap: ['GB pays for duration through the de-rating table and through resilience during stress events, not through wider spreads. This tab separates the three questions duration answers — capacity value, merchant value and policy eligibility — because they have different answers.',
        '英国通过折减系数表及紧张事件下的韧性为时长付费，而非通过更宽的价差。本页拆分时长所回答的三个问题 — 容量价值、市场化价值与政策资格 — 因为三者答案不同。'],
  blocks: [
    { t:'card', mt:false, title:['Duration answers three different questions','时长回答三个不同问题'], badges:['calc','official'], live:false, blocks:[
      { t:'table', head:[['Question','问题'],['Mechanism','机制'],['Answer for GB at 2h → 4h','英国由2小时增至4小时的答案']], rows:[
        [{b:['How much capacity revenue?','容量收入多少？']}, ['Capacity Market de-rating factor','容量市场折减系数'],
         [fmtPct(d2 * 100, 0) + ' → ' + fmtPct(d4 * 100, 0) + ' of nameplate; +' + fmtCk(capUplift) + '/MW/yr at the last clearing price',
          '折减系数由' + fmtPct(d2 * 100, 0) + '升至' + fmtPct(d4 * 100, 0) + '；按最近出清价每MW/年增加' + fmtCk(capUplift)]],
        [{b:['How much merchant revenue?','市场化收入多少？']}, ['Realised spread capture across more hours','在更多小时内实现价差捕获'],
         ['+' + fmtCk(merchUplift) + '/MW/yr — sub-linear, because deeper cycles capture thinner spreads',
          '每MW/年增加' + fmtCk(merchUplift) + ' — 呈次线性，因更深循环所捕获价差更薄']],
        [{b:['Am I eligible for anything?','是否具备政策资格？']}, ['LDES cap-and-floor threshold (8h+ in practice)','长时储能上下限机制门槛（实务上8小时以上）'],
         ['No. 4h is below the LDES regime and above the short-duration merchant sweet spot — a deliberate middle.',
          '否。4小时低于长时储能机制门槛，又高于短时市场化的最优区间 — 是一个刻意的中间选择。']],
      ] },
      { t:'wf', cfg:{ yfmt: v => fmtCk(v), h: 270, steps: [
        { l:['Capacity de-rating uplift','容量折减系数增益'], v: capUplift, t:'d' },
        { l:['Incremental merchant revenue','增量市场化收入'], v: merchUplift, t:'d' },
        { l:['Reserve-product access (energy-based)','备用类产品准入（能量型）'], v: 2500, t:'d' },
        { l:['Stress-event penalty avoidance','规避紧张事件罚则'], v: 1500, t:'d' },
        { l:['Annualised incremental capex','年化增量资本开支'], v: -annualised, t:'d' },
        { l:['Degradation & opex','衰减与运维'], v: -2000, t:'d' },
        { l:['Net marginal value, hours 3–4','第3–4小时净边际价值'], v: capUplift + merchUplift + 2500 + 1500 - annualised - 2000, t:'total' },
      ] } },
      { t:'why', text:['The fourth hour is paid for mostly by the capacity mechanism (' + fmtCk(capUplift) + ') and only secondarily by trading (' + fmtCk(merchUplift) + '), against roughly ' + fmtCk(annualised) + '/MW/yr of annualised incremental capex at ' + fmtC(M.lab.capexKWh) + '/kWh. That makes the decision acutely sensitive to two things a sponsor does not control: the de-rating vintage at the auction entered, and the cell price at procurement. Falling cell prices and a rising duration signal both push the same way, so the practical answer is to build 2h with a documented, consented path to 4h rather than to commit the MWh now.',
        '第4小时主要由容量机制付费（' + fmtCk(capUplift) + '），交易仅为次要来源（' + fmtCk(merchUplift) + '），而按' + fmtC(M.lab.capexKWh) + '/kWh计的年化增量资本开支约为' + fmtCk(annualised) + '/MW/年。这使决策对两个发起人无法控制的因素高度敏感：参与拍卖时的折减系数版本，以及采购时的电芯价格。电芯价格下行与时长信号上行的作用方向一致，因此实务答案是按2小时建设并保留有据可查、已获许可的4小时路径，而非现在就投入MWh。'],
        sig:['Build 2h, consent for 4h','按2小时建设，按4小时报批'] },
    ] },

    { t:'card', title:['Duration-Need Index — every component visible and editable','时长需求指数 — 分项全部可见、可编辑'], badges:['calc','illus'], live:true, blocks:[
      { t:'scorecard', id:'durFactors', bands:'durBands' },
      { t:'why', text:['The index sits at ' + dni + '/100 — ' + L(band.n) + '. The two factors holding it down are the longer-duration merchant signal (score 1: GB spreads do not widen enough to pay for hours) and interconnector contribution (score 1: 8+ GW of interconnection substitutes for domestic duration in most conditions). The two pulling it up are the de-rating uplift and the LDES policy signal — both administrative. Read together: GB duration is a policy-paid attribute, so it should be underwritten against policy documents and auction tables, not against price forecasts.',
        '该指数为' + dni + '/100 — ' + L(band.n) + '。压低它的两个因子是更长时长的市场化信号（评分1：英国价差扩大不足以支付更多小时）与互联线路贡献（评分1：8GW以上互联在多数工况下替代了本土时长需求）。推高它的两个因子是折减系数增益与长时储能政策信号 — 二者均属行政性。综合解读：英国的时长是由政策付费的属性，因此应以政策文件与拍卖表格而非价格预测进行承销。'],
        sig:['Duration is policy-paid in GB','英国的时长由政策付费'] },
    ] },

    { t:'card', title:['Event-duration evidence — how long does the system actually need?','事件时长证据 — 系统实际需要多久？'], badges:['calc','illus'], live:true, blocks:[
      { t:'bar', cfg:{ xs:['P50','P90','P99'], mode:'group', bw: 30, yfmt: v => fmt1(v) + ' h', labels: true, h: 240,
        series:[
          { name:['High-price event length','高价事件时长'], color:'var(--s1)', vals:[M.events.highPrice.p50, M.events.highPrice.p90, M.events.highPrice.p99] },
          { name:['Wind-drought length','低风事件时长'], color:'var(--s6)', vals:[M.events.windDrought.p50, M.events.windDrought.p90, M.events.windDrought.p99] },
        ] } },
      { t:'note', text:['Two different phenomena with two different answers. Price events are hours long and are addressed by 2–4h batteries. Wind droughts are days long and cannot be addressed by lithium at any commercially plausible duration — they are the case for LDES, interconnection and dispatchable low-carbon generation.',
        '这是两种不同现象，对应两种不同答案。价格事件持续数小时，2–4小时电池即可应对。低风事件持续数日，在任何商业上可行的时长下锂电池均无法应对 — 这正是长时储能、互联线路与可调度低碳电源的用武之地。'] },
      { t:'why', text:['The P90 high-price event runs ' + fmt1(M.events.highPrice.p90) + ' hours against a fleet average of ' + fmt1(O.fleetAvgHours) + ' hours, so the existing fleet is energy-limited in exactly the periods that matter most for both price capture and capacity-market performance. That gap is the new-build advantage, and it is worth more than the headline spread comparison suggests because it appears in the highest-priced hours of the year. But note the P99 at ' + fmt1(M.events.highPrice.p99) + ' hours: even 8h does not fully cover the tail, which is why capacity-market penalty exposure never reaches zero.',
        'P90高价事件持续' + fmt1(M.events.highPrice.p90) + '小时，而存量平均时长为' + fmt1(O.fleetAvgHours) + '小时，因此既有机组恰恰在对价格捕获与容量市场履约最关键的时段内出现能量受限。这一缺口正是新建项目的优势，且其价值高于表面价差比较所显示的水平，因为它出现在全年电价最高的时段。但须注意P99为' + fmt1(M.events.highPrice.p99) + '小时：即便8小时也无法完全覆盖尾部，这正是容量市场罚则敞口永远无法归零的原因。'],
        sig:['Fleet is short exactly when it matters','存量机组恰在关键时刻时长不足'] },
    ] },

    { t:'card', title:['Fleet versus pipeline duration — where the market is heading','存量与管线时长对比 — 市场走向'], badges:['calc','illus'], live:true, blocks:[
      { t:'line', cfg:{ xs: M.buildYears, yfmt: v => fmt1(v) + ' h', ymin: 0, h: 220,
        series:[{ name:['Fleet weighted-average duration','存量加权平均时长'], color:'var(--s1)', vals: M.avgDurByYear }],
        refs:[{ y: 4, label:['4h — de-rating inflection','4小时 — 折减系数拐点'], color:'var(--s3)' }] } },
      { t:'why', text:['The fleet drifts from ' + fmt1(M.avgDurByYear[0]) + ' h to ' + fmt1(M.avgDurByYear[M.avgDurByYear.length - 1]) + ' h over eight years — it never reaches the 4h de-rating inflection on this path. That is the structural read: GB is building a long tail of short assets that will compete hard for the same narrowing spreads and receive a shrinking share of capacity revenue. A 4h build is not following the market; it is deliberately leaving it.',
        '八年间存量加权平均时长由' + fmt1(M.avgDurByYear[0]) + '小时漂移至' + fmt1(M.avgDurByYear[M.avgDurByYear.length - 1]) + '小时 — 在该路径上从未达到4小时的折减系数拐点。结构性解读是：英国正在建设一条由短时资产构成的长尾，这些资产将激烈争夺同一批不断收窄的价差，并获得日益缩减的容量收入份额。建设4小时并非跟随市场，而是有意离开市场。'],
        sig:['4h is a deliberate divergence','4小时是有意的分化'] },
    ] },

    { t:'card', title:['LDES cap-and-floor — a separate asset class, not a longer battery','长时储能上下限机制 — 独立资产类别，而非更长的电池'], badges:['draft','illus'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['CP2030 LDES requirement','CP2030长时储能需求'], v:'4–6<small> GW</small>', d:['from a ' + fmt1(O.ldesBaselineGW) + ' GW baseline, mainly pumped storage','基线' + fmt1(O.ldesBaselineGW) + 'GW，以抽水蓄能为主'], b:['official'] },
        { l:['Window 1 minded-to projects','第一窗口倾向性入选项目'], v:String(O.ldesWindow1Projects), d:['minded-to is not a final financeable award','倾向性决定并非最终可融资授予'], b:['draft'] },
        { l:['Practical duration threshold','实务时长门槛'], v:'8<small> h+</small>', d:['below this the CM de-rating route applies instead','低于此门槛则适用容量市场折减路径'], b:['calc'] },
      ] },
      { t:'gates', items:[
        { n:['Regime','机制'], d:['Regulated cap-and-floor: a revenue floor with an upside cap, administered rather than traded.','受监管的上下限机制：设定收入下限并对上行设上限，属行政管理而非市场交易。'], c:'good', s:['Different risk class','不同风险类别'] },
        { n:['Cost of capital','资本成本'], d:['Floor-supported cash flow supports materially higher leverage and a lower equity return requirement.','保底支撑的现金流可支撑显著更高的杠杆及更低的股权回报要求。'], c:'good', s:['Lower','更低'] },
        { n:['Buyer universe','买家群体'], d:['Regulated-asset investors and pension capital, not merchant storage funds.','受监管资产投资人与养老金资本，而非市场化储能基金。'], c:'info', s:['Different','不同'] },
        { n:['Capitalisation rule','资本化规则'], d:['Do not capitalise a floor before final award. Minded-to status carries process, FID-reset and post-construction review risk.','最终授予前不得将保底资本化。倾向性状态仍附带流程、FID重设与建后审查风险。'], c:'critical', s:['Award only','仅以授予为准'] },
      ] },
      { t:'why', text:['Treating LDES as "a battery with more hours" is the single most common category error in GB storage underwriting. It is a regulated asset with a floor, a cap, a different lender base and a different buyer at exit — closer in character to a transmission asset than to a 2h merchant battery. The practical consequence is that an 8h project and a 2h project should not appear in the same portfolio model with the same discount rate, and a fund mandate that permits both should say which it is underwriting.',
        '把长时储能视为“小时数更多的电池”，是英国储能承销中最常见的类别错误。它是带有下限与上限、贷款人基础不同、退出时买家亦不同的受监管资产 — 其性质更接近输电资产而非2小时市场化电池。实务后果是：8小时项目与2小时项目不应以相同折现率出现在同一组合模型中；若基金授权允许两者兼投，应明确说明其承销的是哪一类。'],
        sig:['Not a longer battery — a different asset','并非更长的电池，而是不同资产'] },
      { t:'src', src: SRC.ldes, use:['Window 1 minded-to decisions and cap-and-floor regime design','第一窗口倾向性决定及上下限机制设计'] },
    ] },

    { t:'card', title:['Augmentation readiness — the option to add hours later','增容准备度 — 日后增加小时数的选择权'], badges:['illus'], live:false, blocks:[
      { t:'aug' },
      { t:'why', text:['Because the merchant case says build short and the capacity case says build long, the highest-value structure is usually neither: build 2h now and buy the right to build 4h later, when the de-rating vintage is known and cells are cheaper. That option is only real if it is documented in the planning consent, the connection agreement, the OEM warranty and the financing documents — the four places it is normally lost. A high score here is worth more than an extra hour of MWh today.',
        '由于市场化逻辑主张建短、容量逻辑主张建长，价值最高的结构通常两者皆非：现在建2小时，并买入日后在折减系数版本已知、电芯更便宜时建至4小时的权利。该选择权只有在规划许可、并网协议、OEM质保与融资文件中均有明确记载时才真实存在 — 而这四处正是它通常被丢失的地方。本项高分的价值高于今天多配一小时的MWh。'],
        sig:['The option is worth more than the hour','选择权的价值高于该小时本身'] },
    ] },
  ] };
};

// ============================== PIPELINE ==============================
SEC_B.pipeline = function (){
  const P = M.pipelineOfficial;
  const discount = (1 - P.analystWeightedForwardMW / P.forwardMW) * 100;
  return {
  head: ['Project Pipeline — official TEC evidence, analytical weighting and explicit coverage gaps','项目管线 — 官方TEC证据、分析加权与明确覆盖缺口'],
  cap: ['The official view now separates three things: the raw transmission register, an analyst-weighted delivery screen, and missing evidence. TEC supplies MW, status, Gate and effective date; it does not supply duration, financing status or an independently verified energisation date.',
        '官方视图现将三类信息分开：原始输电登记册、分析师加权交付筛选及缺失证据。TEC提供MW、状态、Gate与生效日期，但不提供时长、融资状态或经独立核实的送电日期。'],
  blocks: [
    { t:'card', mt:false, title:['Coverage first — what the register can and cannot support','覆盖优先 — 登记册能与不能支持什么'], badges:['official','calc'], blocks:[
      { t:'kpis', items:[
        { l:['Unique exact-ESS projects','纯储能唯一项目'], v:fmtN(P.uniqueProjects), d:[fmtN(P.sourceRecords) + ' total TEC records screened','已筛选TEC总记录' + fmtN(P.sourceRecords) + '条'], b:['calc'] },
        { l:['Forward nameplate capacity','前瞻铭牌容量'], v:fmt1(P.forwardMW / 1000) + '<small> GW</small>', d:['raw connection-register total — not expected delivery','原始并网登记总量 — 非预期交付量'], b:['calc'] },
        { l:['Gate 2 forward capacity','Gate 2前瞻容量'], v:fmt1(P.gate2ForwardMW / 1000) + '<small> GW</small>', d:['Gate field populated as 2','Gate字段填报为2'], b:['calc'] },
        { l:['Analyst-weighted forward capacity','分析师加权前瞻容量'], v:fmt1(P.analystWeightedForwardMW / 1000) + '<small> GW</small>', d:['screening output, not an NESO forecast','筛选输出，非NESO预测'], b:['calc'] },
        { l:['Exact-ESS built capacity in TEC','TEC纯储能已建容量'], v:fmt1(P.builtMW / 1000) + '<small> GW</small>', d:['transmission-register coverage only','仅输电登记覆盖范围'], b:['calc'] },
        { l:['Duration / MWh coverage','时长/MWh覆盖率'], v:'0<small>%</small>', d:['TEC has no duration field','TEC无时长字段'], cls:'down', b:['official'] },
      ] },
      { t:'warn', text:['The 177.2 GW headline is a queue measure, not a build forecast. It excludes hybrid Plant Type rows, DNO-only projects and REPD-only projects, while the source itself warns that capacities across stages and technologies can be aggregated or duplicated. The dashboard therefore never feeds raw TEC MW into the merchant forecast or investment score.',
        '177.2GW这一标题数字是队列指标，并非投产预测。它排除了混合技术类型行、仅DNO项目及仅REPD项目，同时来源自身警告不同阶段和技术容量可能聚合或重复。因此看板绝不将原始TEC MW直接输入市场化预测或投资评分。'] },
      { t:'src', src:SRC.tec, use:['Project status, Gate, cumulative MW and effective-date evidence; exact-ESS filtering and deterministic Project ID deduplication','项目状态、Gate、累计MW与生效日期证据；纯储能筛选及按Project ID确定性去重'] },
    ] },
    { t:'card', title:['Analyst delivery weights — explicit and separate from NESO fields','分析师交付权重 — 与NESO字段明确分离'], badges:['calc'], blocks:[
      { t:'stageProb' },
      { t:'why', text:['Applying the disclosed screening weights removes ' + fmtPct(discount, 0) + ' of raw forward MW. This does not turn a queue into a forecast: the weights are an analyst scenario, and Gate-not-populated remains its own category rather than being silently treated as Gate 1.',
        '应用已披露筛选权重后，原始前瞻MW减少' + fmtPct(discount, 0) + '。这并不会把队列变成预测：权重属于分析师情景，Gate未填报仍作为独立类别，绝不暗中视为Gate 1。'],
        sig:['Official fields, analyst weights','官方字段，分析师权重'] },
    ] },
    { t:'g2', cards:[
      { title:['Effective-year capacity — raw versus analyst-weighted','按生效年份容量 — 原始与分析加权'], badges:['official','calc'], blocks:[
        { t:'bar', cfg:{ xs:P.years.map(String), mode:'group', yfmt:v => fmt1(v / 1000) + ' GW', h:260,
          series:[
            { name:['TEC raw nameplate MW','TEC原始铭牌MW'], color:'var(--s3)', vals:P.rawMW },
            { name:['Analyst-weighted MW','分析师加权MW'], color:'var(--s1)', vals:P.analystWeightedMW },
          ] } },
        { t:'note', text:['“MW Effective From” is the contract field in the TEC Register. It is not independently verified COD and may be stale for individual projects.','“MW Effective From”是TEC登记册中的合同字段，并非经独立核实的投运日期，个别项目可能已过期。'] },
      ] },
      { title:['Gate composition — evidence quality changes sharply after 2029','Gate构成 — 2029年后证据质量显著变化'], badges:['official','calc'], blocks:[
        { t:'bar', cfg:{ xs:P.years.map(String), mode:'group', yfmt:v => fmt1(v / 1000) + ' GW', h:260,
          series:[
            { name:['Gate 2','Gate 2'], color:'var(--s2)', vals:P.gate2MW },
            { name:['Gate 1','Gate 1'], color:'var(--s6)', vals:P.gate1MW },
            { name:['Gate not populated','Gate未填报'], color:'var(--muted)', vals:P.gateUnpopulatedMW },
          ] } },
        { t:'why', text:['Every exact-ESS Gate 2 MW in this snapshot has an effective year no later than 2029. Capacity shown after that is Gate 1 or Gate-not-populated, so a late-2030s queue total cannot be read as equivalent competitive pressure.',
          '本快照中所有纯储能Gate 2容量的生效年份均不晚于2029年。此后显示的容量均为Gate 1或Gate未填报，因此2030年代后期的队列总量不能被视为等同的竞争压力。'] },
      ] },
    ] },
    { t:'card', title:['MWh competition — unavailable from TEC','MWh竞争 — TEC无法提供'], badges:['official','verify'], blocks:[
      { t:'warn', text:['No duration or MWh estimate is shown. Adding an assumed duration would convert a documented source gap into false precision. The MWh competition view remains unavailable until duration is joined from an official or project-level evidence source with a stable project match.',
        '此处不显示任何时长或MWh估算。加入假定时长会把有记录的来源缺口变成虚假精度。在通过稳定项目匹配从官方或项目级证据来源接入时长之前，MWh竞争视图保持不可用。'] },
      { t:'src', src:SRC.repd, use:['Planning-stage cross-check is registered but not yet included; REPD does not by itself close the duration gap','规划阶段交叉核对来源已登记但尚未纳入；REPD本身也无法弥补时长缺口'] },
    ] },
    { t:'card', title:['Official project evidence — selected high-evidence TEC rows','官方项目证据 — 精选高证据TEC记录'], badges:['official'], blocks:[
      { t:'projTable' },
      { t:'note', text:['The table is a display sample: all exact-ESS rows marked Under Construction/Commissioning plus the largest Gate 2 rows marked Consents Approved. Headline totals use the complete 714-project normalized population, not this sample. NESO states that project status is supplied on a best-knowledge basis and is not planning-authority verification.',
        '本表仅为展示样本：包括所有标记为在建/调试的纯储能记录，以及规模最大的Gate 2且许可获批记录。标题总量采用完整的714个标准化项目总体，而非本样本。NESO说明项目状态基于其最佳认知，并非规划主管机关核验。'] },
      { t:'src', src:SRC.tec, use:['Named project, customer, connection site, MW, effective date, status and Gate','项目名称、客户、接入点、MW、生效日期、状态与Gate'] },
    ] },
    { t:'card', title:['Contracted-revenue benchmarks — what the market will pay to take your risk','合同化收入基准 — 市场为承接你的风险愿付多少'], badges:['dev','public'], live:false, blocks:[
      { t:'table', head:[['Structure','结构'],['Reference','参考交易'],['Implied £/MW/yr','隐含£/MW/年'],['Comment','说明']], num:[2],
        rows: M.contracted.map(c => [{ b: c.s }, c.r, c.v == null ? '—' : fmtCk(c.v), c.n]) },
      { t:'cmp', items:[
        { h:['Toll vs realised 2h merchant','租赁对2小时实际市场化收入'], v: fmtPct(M.contracted[0].v / M.bmRevenueByDur[2] * 100, 0),
          s:['the market pays about four-fifths of trailing merchant revenue to take all of the risk','市场以约相当于过去市场化收入的五分之四的价格承接全部风险'] },
        { h:['Floor vs realised 2h merchant','保底对2小时实际市场化收入'], v: fmtPct(M.contracted[1].v / M.bmRevenueByDur[2] * 100, 0),
          s:['a floor costs more upside than a toll but retains it above the floor','保底让渡的上行多于租赁，但保留下限以上的收益'] },
      ] },
      { t:'why', text:['These three prices are the market’s own view of forward merchant revenue, and they sit ' + fmtPct((1 - M.contracted[0].v / M.bmRevenueByDur[2]) * 100, 0) + '–' + fmtPct((1 - M.contracted[1].v / M.bmRevenueByDur[2]) * 100, 0) + ' below trailing realised revenue. If a sponsor’s merchant base case is above the tolling level, the model is more optimistic than the counterparties who trade this risk daily. That is a legitimate position, but it should be stated as a view, sized as equity, and never used to support senior debt.',
        '这三个价格是市场自身对远期市场化收入的判断，较过去实际收入低' + fmtPct((1 - M.contracted[0].v / M.bmRevenueByDur[2]) * 100, 0) + '–' + fmtPct((1 - M.contracted[1].v / M.bmRevenueByDur[2]) * 100, 0) + '。若发起人的市场化基准情景高于租赁水平，则该模型比每天交易这一风险的交易对手更为乐观。这是一个合理立场，但应作为观点明确陈述、以股权规模承担，且绝不可据以支撑优先级债务。'],
        sig:['The toll price is the market’s forecast','租赁价格即市场的预测'] },
    ] },
  ] };
};

// ============================== GRID CONNECTION ==============================
SEC_B.grid = function (){
  const cs = liveScore('connFactors'), band = bandFor(M.connBands, cs);
  return {
  head: ['Grid Connection — a chain of approvals, not a binary status','并网 — 一连串审批与合同，而非二元状态'],
  cap: ['Since connections reform, queue position is the primary determinant of GB project value. A Gate 2 offer is necessary but not sufficient: the deliverable date depends on the tranche, the transmission or distribution operator works programme, and a consent that is implementable rather than merely granted.',
        '自并网改革以来，队列位置是英国项目价值的首要决定因素。Gate 2要约是必要但不充分条件：可交付日期取决于所在批次、输配电运营商的工程计划，以及一份可实施（而非仅获批准）的规划许可。'],
  blocks: [
    { t:'card', mt:false, title:['Nameplate → revenue bridge','铭牌容量至收入桥'], badges:['calc','illus'], live:true, blocks:[
      { t:'sub', text:['Capacity channel','容量通道'] },
      { t:'flow', items:[
        ['Nameplate MW','铭牌MW'], ['Transmission Entry Capacity (TEC)','输电接入容量(TEC)'],
        ['Prequalified de-rated MW','预资格折减MW'], ['Awarded capacity agreement','中标容量协议'],
        ['Satisfactory performance days','合格履约日'],
      ] },
      { t:'sub', text:['Merchant channel','市场化通道'] },
      { t:'flow', items:[
        ['Export / import limit','送出与受入限额'], ['BM visibility & parameterisation','平衡机制可见性与参数设置'],
        ['− skip rate','− 跳过率'], ['− network charges by zone','− 分区网络费用'], ['Realised net revenue','实际净收入'],
      ] },
      { t:'why', text:['Two independent chains break for unrelated reasons, and a project can fail one while passing the other. The capacity chain fails administratively — a prequalification rejection or a missed milestone removes the whole agreement. The merchant chain fails economically — a northern TNUoS zone or poor BM parameterisation quietly removes ' + fmtPct(15) + '–' + fmtPct(25) + ' of revenue with no single identifiable event. Diligence must walk both, and the connection agreement is the only document that constrains both.',
        '两条链条因互不相关的原因失效，项目可能通过其中一条而在另一条上失败。容量链是行政性失效 — 预资格被否或错过里程碑即导致整份协议丧失。市场化链是经济性失效 — 位于北部输电收费分区或平衡机制参数设置不当，会在没有任何单一可识别事件的情况下悄然抹去' + fmtPct(15) + '–' + fmtPct(25) + '的收入。尽调须同时走完两条链，而并网协议是唯一同时约束两者的文件。'],
        sig:['Two chains, two failure modes','两条链条，两种失效模式'] },
    ] },

    { t:'card', title:['Connection Risk Score — weighted factors, editable','并网风险评分 — 加权因子，可编辑'], badges:['calc','illus'], live:true, blocks:[
      { t:'scorecard', id:'connFactors', bands:'connBands' },
      { t:'why', text:['The score is ' + cs + '/100 (higher = riskier), placing the reference project in the "' + L(band.n) + '" band. Note that the heaviest factor — Gate status and strategic alignment at 15% — is also the one a sponsor can least influence after the fact. That asymmetry is the argument for buying at Gate 2 rather than developing to it, unless the sponsor has a genuine informational edge on tranche sequencing.',
        '评分为' + cs + '/100（分值越高风险越大），使参考项目落入“' + L(band.n) + '”区间。须注意权重最高的因子 — Gate状态与战略匹配，占15% — 也是发起人事后最难影响的因子。这一不对称正是“在Gate 2买入而非自行开发至Gate 2”的理由，除非发起人在批次排序上确有信息优势。'],
        sig:['Buy at Gate 2 unless you have an edge','除非有信息优势，否则在Gate 2买入'] },
    ] },

    { t:'card', title:['Connection risk → suggested commercial protections','并网风险 → 建议商业保护条款'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Risk','风险'],['Protection','保护条款'],['Trigger to invoke','触发条件']], rows:[
        [{b:['Gate 2 tranche slips behind works programme','Gate 2批次落后于工程计划']},
         ['Long-stop date tied to energisation, not to offer acceptance; price reduction per month of delay','最终截止日与送电挂钩而非与要约接受挂钩；按延迟月数递减价款'],
         ['Any revision to the TO/DNO programme','输配电运营商工程计划的任何修订']],
        [{b:['Consent granted but not implementable','规划许可已获批但不可实施']},
         ['Completion of pre-commencement conditions as a condition precedent, with holdback','以完成开工前条件为先决条件，并设保留款'],
         ['Outstanding conditions at signing','签约时仍有未决条件']],
        [{b:['Connection cost or securities increase','并网成本或保证金上升']},
         ['Cost-sharing cap above an agreed threshold; securities released against milestones','超出约定阈值的成本分担上限；保证金按里程碑释放'],
         ['Revised connection offer or works estimate','修订后的并网要约或工程估算']],
        [{b:['Charging reform changes zonal cost','收费改革改变分区成本']},
         ['Change-in-law allocation and a repricing right on a defined index','法律变更风险分担及基于约定指数的重新定价权'],
         ['Publication of a charging-reform decision','收费改革决定发布']],
        [{b:['Prequalification failure for the capacity auction','容量拍卖预资格未通过']},
         ['Warranty on metering and technical class; indemnity for a missed auction year','对计量与技术类别提供保证；对错过拍卖年度提供赔偿'],
         ['Any change to the unit’s technical classification','机组技术类别的任何变更']],
      ] },
      { t:'why', text:['Every protection here converts a timing risk into a priced or allocated risk, which is the only thing that can be done with connection exposure — it cannot be diversified within GB and it cannot be hedged. The single most valuable clause is the first: tying the long-stop to energisation rather than to offer acceptance, because a Gate 2 offer that arrives on time with a works programme that does not is the specific way GB projects lose a COD year, and therefore a de-rating vintage and a buildout case at the same time.',
        '此处每项保护都把时点风险转化为可定价或可分配的风险，而这也是应对并网敞口的唯一手段 — 它在英国境内既无法分散也无法对冲。价值最高的是第一项条款：将最终截止日与送电而非与要约接受挂钩，因为“Gate 2要约按时到达而工程计划未能跟上”正是英国项目损失一个投运年度的具体方式，进而同时损失一个折减系数版本与一个投产情景。'],
        sig:['Tie the long-stop to energisation','最终截止日应挂钩送电'] },
      { t:'src', src: SRC.reform, use:['Gate 1 / Gate 2 sequencing and offer-tranche timetable','Gate 1/Gate 2排序及要约批次时间表'] },
    ] },
  ] };
};
// Investor-facing map and evidence journey supersedes the legacy editable scorecard.
SEC_B.grid = () => buildGBGridSection({ SRC });

// ============================== GB vs IRELAND (peer benchmark) ==============================
// Mirrors the WA dashboard's "WEM vs NEM" section: the only tab that uses peer-market
// data, held in a separate namespace and excluded from every GB scoring input.
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
  cap: ['The only section in this dashboard that uses Irish data. GB and the all-island SEM are neighbouring, interconnected, similarly regulated markets that nevertheless reward storage through structurally different mechanisms. Comparing them isolates what is genuinely GB-specific. All SEM figures are held in a separate namespace and excluded from the GB composite investment score.',
        '本看板中唯一使用爱尔兰数据的章节。英国与全岛单一电力市场相邻、互联且监管体系相近，但两者奖励储能的机制存在结构性差异。比较两者可分离出真正属于英国特有的因素。所有SEM数值保存在独立命名空间，不计入英国综合投资评分。'],
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

// ============================== INVESTMENT LAB ==============================
SEC_B.lab = function (){
  return {
  head: ['Investment Lab — market metrics to project returns','投资测算 — 从市场指标到项目回报'],
  cap: ['A simplified annual pre-tax model on the seed assumptions above. It demonstrates the decision workflow — capacity de-rating, realised merchant spread, services, saturation by COD year — and is not a substitute for a dispatch-optimised project-finance model.',
        '基于上述种子假设的简化年度税前模型，用于演示决策流程 — 容量折减、实际市场化价差、系统服务、按投运年度的饱和 — 不能替代调度优化的完整项目融资模型。'],
  blocks: [
    { t:'card', mt:false, title:['Inputs','输入假设'], badges:['illus'], live:false, blocks:[
      { t:'labInputs' },
      { t:'note', text:['Merchant revenue is scaled by the saturation factor for the selected COD year (' + state.codYear + ': ' + fmtPct(dilutionAt(+state.codYear) * 100, 0) + ' of today) and by the duration factor, because deeper cycles capture thinner spreads. Capacity revenue uses the de-rating curve, not nameplate MW.',
        '市场化收入按所选投运年度的饱和系数（' + state.codYear + '：为当前的' + fmtPct(dilutionAt(+state.codYear) * 100, 0) + '）及时长系数缩放，因为更深的循环所捕获的价差更薄。容量收入采用折减系数曲线，而非铭牌MW。'] },
    ] },
    { t:'card', title:['Outputs — base case and lender downside','输出结果 — 基准情景与贷款人下行情景'], badges:['calc','illus'], live:false, blocks:[
      { t:'labOut' },
      { t:'why', text:['The gap between the two cases is the whole investment question. The base case is a view on other people’s connection dates; the downside case is what a lender will actually size against. If minimum DSCR in the downside case is below 1.30x, the capital structure — not the project — is what needs changing: less debt, a contracted floor, or a shorter tenor.',
        '两种情景之间的差距即是全部投资问题。基准情景是对他人并网时点的判断；下行情景才是贷款人实际据以安排债务规模的依据。若下行情景下最低偿债覆盖率低于1.30x，需要改变的是资本结构而非项目本身：降低债务比例、引入合同保底、或缩短债务期限。'],
        sig:['Fix the structure, not the forecast','应调整结构，而非调整预测'] },
    ] },
    { t:'card', title:['Duration comparison — incremental NPV of the final added hour','时长比较 — 最后新增小时的增量NPV'], badges:['calc','illus'], live:false, blocks:[
      { t:'labDur' },
      { t:'why', text:['Judge duration on the NPV of the last hour added, never on headline project IRR — a longer asset can have a lower IRR and a higher NPV, and the capital committed differs by a factor of four across this table. Where the incremental column turns negative is the point at which the de-rating uplift stops covering the MWh capex, and that crossover moves every time either cell prices or the de-rating table changes.',
        '判断时长应依据最后新增小时的NPV，绝不可仅看项目整体IRR — 更长的资产可能IRR更低而NPV更高，且本表各行所投入的资本相差达四倍。增量列转负之处，即是折减系数增益不再覆盖MWh造价的临界点；每当电芯价格或折减系数表变化，该临界点即随之移动。'],
        sig:['Judge the last hour, not the project','判断最后一小时，而非整个项目'] },
    ] },
    { t:'card', title:['Scenario snapshots (saved locally)','情景快照（本地保存）'], badges:['calc'], live:false, blocks:[
      { t:'labSnaps' },
    ] },
  ] };
};

// ============================== PORTFOLIO / FUND VIEW ==============================
SEC_B.portfolio = function (){
  const inp = labInputs(), r = labModel(inp);
  const dn = labModel(inp, { spreadFactor: 0.75, svcFactor: 0.7, capFactor: 0.85, noGrant: true });
  return {
  head: ['Portfolio / Fund View — applying the GB thesis to a screened opportunity','组合与基金视图 — 将英国逻辑应用于所筛选机会'],
  cap: ['A worked screening example using the Investment Lab assumptions. All project-specific content is confined to this tab and is illustrative — it demonstrates the gate sequence an investment committee should apply, not a real transaction.',
        '使用投资测算假设的筛选示例。所有项目层面内容均限于本页且为示例性质 — 用于演示投委会应遵循的门槛顺序，而非真实交易。'],
  blocks: [
    { t:'card', mt:false, title:['Screened opportunity — institutional screening snapshot','所筛选机会 — 机构筛选快照'], badges:['illus'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Configuration','配置'], v:fmtN(inp.mw) + ' MW / ' + fmtN(inp.mw * inp.hours) + '<small> MWh</small>', d:[inp.hours + '-hour design','' + inp.hours + '小时设计'] },
        { l:['Target COD','目标投运'], v:state.codYear, d:['de-rating vintage and buildout case both follow from this','折减系数版本与投产情景均由此决定'] },
        { l:['Total capex','总资本开支'], v:fmtCM(r.capex), d:[fmtC(inp.capexKWh) + '/kWh + ' + fmtC(inp.capexKW) + '/kW', fmtC(inp.capexKWh) + '/kWh + ' + fmtC(inp.capexKW) + '/kW'], b:['model'] },
        { l:['Paid de-rated capacity','获付费折减容量'], v:fmtN(r.capMW) + '<small> MW</small>', d:[fmtPct(r.derate * 100) + ' of nameplate', '相当于铭牌的' + fmtPct(r.derate * 100)], b:['calc'] },
        { l:['Year-1 EBITDA','第1年EBITDA'], v:fmtCM(r.ebitda1), d:['unlevered IRR ' + fmtIRR(r.unlevIRR),'无杠杆IRR ' + fmtIRR(r.unlevIRR)], b:['calc'] },
        { l:['Min DSCR — lender downside','最低偿债覆盖率 — 贷款人下行'], v:fmtX(dn.minDSCR), d:['base case ' + fmtX(r.minDSCR),'基准情景 ' + fmtX(r.minDSCR)], cls: dn.minDSCR != null && dn.minDSCR < 1.3 ? 'down' : '', b:['calc'] },
      ] },
      { t:'ic', b:['Screening conclusion: ','筛选结论：'],
        text:['The project passes on returns in the base case and fails or is marginal on lender-downside coverage, which is the normal GB outcome for a merchant-weighted 2h asset. The response is structural rather than a re-forecast: reduce gearing, contract a floor or toll for part of the capacity, or move the COD earlier so the asset sits ahead of the saturation curve.',
              '该项目在基准情景下收益达标，在贷款人下行情景下偿债覆盖不足或勉强 — 这是市场化占比较高的2小时英国资产的常见结果。应对方式是结构性的而非重新预测：降低杠杆、就部分容量签订保底或租赁协议、或提前投运使资产处于饱和曲线之前。'] },
    ] },
    { t:'card', title:['Revenue stack — evidence status of each line','收入结构 — 各收入项的证据状态'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Revenue line','收入项'],['Year-1 amount','第1年金额'],['Evidence status','证据状态'],['Treatment in the model','模型处理方式']], num:[1], rows:[
        [{b:['Capacity Market','容量市场']}, fmtCM(r.capRev), {chip:'good', text:['Auction-cleared price, published de-rating','拍卖出清价、公布的折减系数']},
         ['Contracted for ' + inp.capYrs + ' years once awarded; supports debt sizing','中标后锁定' + inp.capYrs + '年；可支撑债务规模']],
        [{b:['Wholesale & Balancing Mechanism','批发与平衡机制']}, fmtCM(r.arb1), {chip:'warn', text:['Third-party realised index, not contracted','第三方实际收入指数，非合同']},
         ['Benchmarked to realised, not theoretical; equity risk','以实际而非理论收入为基准；属股权风险']],
        [{b:['System services','系统服务']}, fmtCM(r.svc1), {chip:'serious', text:['Auction-cleared but falling 25–30% yoy','拍卖出清但同比下降25–30%']},
         ['Capped at trailing twelve months; excluded from debt sizing','以过去12个月封顶；排除于债务规模测算']],
        [{b:['Optimiser fee','优化商费用']}, '−' + fmtCM(r.fee1), {chip:'warn', text:['Contracted, but performance is not','费用已合同化，但业绩未合同化']},
         ['Require benchmarked performance tests and step-down rights','须设置基准化业绩测试与降费权']],
        [{b:['Fixed opex','固定运维']}, '−' + fmtCM(r.opex), {chip:'good', text:['LTSA and O&M contracted','长期服务协议与运维已签约']},
         ['Check cycling limits in the warranty against the modelled cycles','须核对质保循环限制与模型循环次数是否一致']],
      ] },
      { t:'why', text:['Only the first line is contracted, and it is ' + fmtPct(r.capRev / (r.capRev + r.arb1 + r.svc1) * 100, 0) + ' of gross revenue. That single ratio is the GB investment case in one number: a lender sizing purely on contracted cash flow can support only a fraction of this capital structure, which is why every serious GB storage financing either adds a toll or a floor, or accepts materially lower gearing. Decide which of those three it is before the model, not after.',
        '只有第一项是合同化的，且仅占毛收入的' + fmtPct(r.capRev / (r.capRev + r.arb1 + r.svc1) * 100, 0) + '。这一个比率就是英国投资逻辑的浓缩：若贷款人纯粹依据合同化现金流安排规模，仅能支撑本资本结构的一小部分 — 这正是每一笔严肃的英国储能融资要么加入租赁或保底、要么接受显著更低杠杆的原因。这三者中选哪一条，应在建模之前决定，而非之后。'],
        sig:['One contracted line, three possible structures','一条合同化收入，三种可行结构'] },
    ] },
    { t:'card', title:['Investment Committee gates — what must be true before capital is released','投委会门槛 — 资金拨付前必须成立的条件'], badges:['calc'], live:false, blocks:[
      { t:'gates', items:[
        { n:['Gate 1 — Connection','门槛1 — 并网'], d:['Countersigned Gate 2 offer, implementable consent, and a TO/DNO works programme consistent with the modelled COD year.','已会签的Gate 2要约、可实施的规划许可，以及与模型投运年度一致的输配电运营商工程计划。'], c:'warn', s:['Evidence required','需提供证据'] },
        { n:['Gate 2 — Capacity','门槛2 — 容量'], d:['Prequalification pathway confirmed for the intended auction, with the de-rating table of that specific vintage applied in the model.','已确认目标拍卖的预资格路径，且模型采用该拍卖年份对应的折减系数表。'], c:'warn', s:['Vintage-specific','须与拍卖年份一致'] },
        { n:['Gate 3 — Route to market','门槛3 — 售电路径'], d:['Optimiser appointed with benchmarked realised-revenue tests, step-down rights and termination below a defined threshold.','已委任优化商，并设定基准化实际收入测试、降费权及低于约定阈值的终止权。'], c:'serious', s:['Contract terms','取决于合同条款'] },
        { n:['Gate 4 — Downside coverage','门槛4 — 下行覆盖'], d:['Minimum DSCR of at least 1.30x in the lender downside case, achieved through structure rather than through a more optimistic forecast.','贷款人下行情景下最低偿债覆盖率不低于1.30x，且须通过结构而非更乐观的预测实现。'], c: dn.minDSCR != null && dn.minDSCR >= 1.3 ? 'good' : 'critical', s: dn.minDSCR != null && dn.minDSCR >= 1.3 ? ['Met','已满足'] : ['Not met','未满足'] },
        { n:['Gate 5 — Exit specification','门槛5 — 退出规格'], d:['A defined buyer universe at exit: contracted or floor-supported revenue, firm connection, demonstrated realised-to-theoretical performance.','退出时具备明确的买家群体：合同化或保底支撑的收入、确定的并网、以及已验证的实际与理论收入表现。'], c:'warn', s:['Design for it now','须在当下即行设计'] },
      ] },
      { t:'why', text:['The gates are ordered so the cheapest test comes first. Connection evidence costs nothing to check and eliminates most opportunities; downside coverage is the expensive test and should only be run on projects that have cleared the first three. Running them in the reverse order — modelling returns first and checking connection last — is how development capital is lost in GB, because the model is always fixable and the connection date never is.',
        '门槛按“最便宜的检验优先”排序。核查并网证据几乎零成本，却能淘汰大部分机会；下行覆盖测试成本高昂，仅应对已通过前三关的项目执行。若顺序颠倒 — 先测算收益、最后核查并网 — 正是英国开发资本损失的典型方式，因为模型总是可以调整，而并网日期永远不能。'],
        sig:['Cheapest test first','最便宜的检验优先'] },
    ] },
  ] };
};

// ============================== DATA & METHODOLOGY ==============================
SEC_B.data = function (){
  const srcs = [SRC.cmreg, SRC.derate, SRC.bmrs, SRC.eac, SRC.skip, SRC.tec, SRC.fesEs1, SRC.fesEd1, SRC.etys, SRC.beyond, SRC.repd, SRC.reform, SRC.ldes, SRC.cp2030, SRC.vendor, SRC.semo];
  return {
  head: ['Data & Methodology — source registry, formulas and quality badges','数据与方法 — 数据源登记、公式与质量标识'],
  cap: ['Every figure in this dashboard carries a quality badge and a namespace. Official values come from named regulator or system-operator publications; calculated values are derived here; illustrative values are synthetic placeholders that must be replaced by live ingestion before any investment use.',
        '本看板中每个数值均带有质量标识与命名空间。官方数值来自具名的监管机构或系统运营方出版物；计算值在本看板内推导；示例数值为合成占位数据，任何投资用途前须以实时抓取数据替换。'],
  blocks: [
    { t:'card', mt:false, title:['Source hierarchy — which source may answer which question','来源层级 — 何种来源可回答何种问题'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Question','问题'],['Only acceptable source','唯一可接受来源'],['Never acceptable','不可接受']], rows:[
        [{b:['What will capacity revenue be?','容量收入将是多少？']}, ['Auction results plus the de-rating table of that specific vintage','拍卖结果加上该拍卖年份对应的折减系数表'], ['Nameplate MW, a prior vintage table, or a peer market','铭牌MW、以往年份的表格、或同业市场']],
        [{b:['What merchant revenue is achievable?','可实现的市场化收入是多少？']}, ['Third-party realised-revenue index with vendor and vintage recorded','已记录供应商与数据版本的第三方实际收入指数'], ['A perfect-foresight backtest or a modelled optimum','完全预见回测或模型最优值']],
        [{b:['When will the project energise?','项目何时送电？']}, ['Gate 2 offer plus the TO/DNO works programme','Gate 2要约加输配电运营商工程计划'], ['The historic connection date or a queue position alone','历史并网日期或仅凭队列位置']],
        [{b:['How much competition arrives?','会有多少竞争到场？']}, ['De-duplicated TEC / ECR / REPD extract, probability-weighted by gate','去重后的TEC/ECR/REPD数据，按门槛概率加权'], ['Headline announced pipeline totals','已公告管线总量']],
        [{b:['Is an LDES floor bankable?','长时储能保底是否可融资？']}, ['A final cap-and-floor award','最终的上下限机制授予'], ['A minded-to decision or a shortlist position','倾向性决定或入围名单']],
      ] },
      { t:'why', text:['Four of the five rows describe the same error: substituting an earlier, more available proxy for the definitive evidence. In GB that error has a consistent direction — every convenient proxy is more optimistic than the real thing. Nameplate exceeds de-rated MW, theoretical exceeds realised, a queue position flatters an energisation date, and announced pipeline overstates arriving competition only in the direction that makes your own project look better.',
        '五行中有四行描述的是同一错误：以更早、更易获得的替代指标取代决定性证据。在英国，这一错误方向一致 — 每一个便利的替代指标都比真实情况更乐观。铭牌高于折减后MW，理论高于实际，队列位置美化送电日期，而已公告管线对到场竞争的高估方向，恰恰使自身项目显得更优。'],
        sig:['Every convenient proxy flatters','每个便利替代指标都在美化'] },
    ] },
    { t:'card', title:['Metric-level provenance — upgraded GB series','指标级溯源 — 已升级英国序列'], badges:['official','calc'], blocks:[
      { t:'table', head:[['Metric ID','指标ID'],['Authority','权威类别'],['Unit / basis','单位/口径'],['Vintage','版本'],['Source ID','来源ID'],['Transformation','转换规则']],
        rows:M.metricRegistry.map(metric => [
          { b:[metric.id, metric.id] },
          [metric.authority, metric.authority],
          metric.unit + ' · ' + metric.valueBasis + ' · ' + metric.yearBasis,
          metric.vintage,
          metric.sourceIds.join(', '),
          metric.transformation,
        ]) },
      { t:'note', text:['Official forecasts, derived observations and analyst scenarios are separate authority classes. A chart series cannot enter this upgraded GB slice without a registered metric ID, source relationship, unit, basis, vintage and transformation.','官方预测、观察衍生与分析师情景属于不同权威类别。任何图表序列若缺少已登记的指标ID、来源关系、单位、口径、版本及转换规则，均不得进入本次英国升级范围。'] },
    ] },
    { t:'card', title:['Source registry — verified 29 July 2026','数据源登记表 — 2026年7月29日核验'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Source','来源'],['Status','状态'],['Source date','来源日期'],['Applicable period','适用期间']],
        rows: srcs.map(s => [{ b: [s.file, s.file] }, s.status, s.date, s.cy]) },
      { t:'note', text:['The third-party revenue index requires a vendor licence; record vendor identity and data vintage in the model before any transaction use, and note that the buildout-to-spread transmission model is calibrated to the same vendor curve — the two are not independent confirmation.',
        '第三方收入指数需供应商授权；任何交易用途前须在模型中记录供应商身份与数据版本，并注意投产至价差的传导模型校准于同一供应商曲线 — 两者并非相互独立的验证。'] },
    ] },
    { t:'card', title:['Core formulas','核心公式'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Quantity','指标'],['Formula','公式']], rows:[
        [{b:['Capacity revenue','容量收入']}, 'nameplate MW × de-rating factor(duration, auction vintage) × clearing price (£/kW/yr) × 1,000'],
        [{b:['Discharged energy, year 1','第1年放电电量']}, 'MW × hours × usable fraction × cycles/day × 365 × availability'],
        [{b:['Effective spread','有效价差']}, 'executable spread × duration factor × (RTE / 88) × saturation factor(COD year)'],
        [{b:['Composite score','综合评分']}, 'Σ (component weight × component score) / 100'],
        [{b:['Duration-Need Index / Connection Risk Score','时长需求指数/并网风险评分']}, 'Σ (factor weight × factor score) / 3, each factor scored 0–3'],
        [{b:['DSCR','偿债覆盖率']}, 'EBITDA(year) / annuity(debt, interest rate, tenor)'],
      ] },
    ] },
    { t:'card', title:['Data-quality badge legend & seed status','数据质量标识说明与种子状态'], badges:['calc'], live:false, blocks:[
      { t:'badges', items:['official','calc','illus','forecast','dev','public','tp','peer','final','draft','model','consult','verify',
        h('span', { class:'badge seed' }, MKT.seedTag), h('span', { class:'badge etl' }, 'LIVE_ETL_REQUIRED')] },
      { t:'cap', text:['Official values, refreshed July 2026: T-4 clearing price £' + fmt1(O.t4Price) + '/kW/yr for DY ' + O.t4DY + ' with ' + fmtN(O.t4AwardedMW) + ' MW de-rated awarded · T-1 £' + fmt1(O.t1Price) + '/kW/yr for DY ' + O.t1DY + ' with ' + fmtN(O.t1AwardedMW) + ' MW · de-rating factors 0.09 (1h) to 0.94 (12h) on the T-4 ' + O.t4DY + ' vintage · CP2030 requirement 23–27 GW batteries and 4–6 GW LDES from a ' + fmt1(O.batteryBaselineGW) + ' GW battery and ~' + fmt1(O.ldesBaselineGW) + ' GW LDES baseline · ' + O.ldesWindow1Projects + ' LDES cap-and-floor Window 1 projects at minded-to · Gate 2 offers phased through March 2027. Everything else is calculated, third-party-modelled, public-source or illustrative and is labelled accordingly. Northern Ireland (SEM) is excluded throughout.',
        '官方数值，2026年7月刷新：交付年' + O.t4DY + '的T-4出清价£' + fmt1(O.t4Price) + '/kW/年，中标折减容量' + fmtN(O.t4AwardedMW) + 'MW · 交付年' + O.t1DY + '的T-1出清价£' + fmt1(O.t1Price) + '/kW/年，' + fmtN(O.t1AwardedMW) + 'MW · T-4 ' + O.t4DY + '版本折减系数由0.09（1小时）至0.94（12小时） · CP2030要求电池23–27GW、长时储能4–6GW，基线分别为电池' + fmt1(O.batteryBaselineGW) + 'GW与长时储能约' + fmt1(O.ldesBaselineGW) + 'GW · ' + O.ldesWindow1Projects + '个长时储能上下限机制第一窗口项目处于倾向性决定阶段 · Gate 2要约分阶段发出至2027年3月。其余内容均为计算、第三方模型、公开来源或示例数据并相应标注。全篇不含北爱尔兰（SEM）。'] },
      { t:'exports' },
    ] },
    { t:'card', title:['Bilingual glossary','双语术语表'], badges:['calc'], live:false, blocks:[
      { t:'glossary' },
      { t:'why', text:['Four terms carry disproportionate decision weight and are the ones most often used loosely in GB discussions: de-rating factor (a duration-dependent multiplier that is re-cut every auction vintage), de-rated MW (the only MW that is paid), realised versus theoretical revenue (the gap is worth more than the capacity payment), and skip rate (the share of economically-merited BM instructions that never arrive). Agreeing these four definitions with a counterparty before negotiating removes most of the scope for talking past each other.',
        '有四个术语在决策中的权重不成比例，且在英国的讨论中最常被宽泛使用：折减系数（随时长变化、每个拍卖年份重新下调的乘数）、折减后MW（唯一获得付费的MW）、实际收入与理论收入之别（其差额价值高于容量付费）、以及跳过率（在经济序列内却从未下达的平衡指令占比）。在谈判前与交易对手就这四项定义达成一致，可消除大部分各说各话的空间。'],
        sig:['Agree four definitions before negotiating','谈判前先统一四项定义'] },
    ] },
  ] };
};


  return SECTIONS;
}