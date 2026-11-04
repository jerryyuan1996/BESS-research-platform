/* Great Britain — the `home` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { designLine, designBest, routeFit } from '../../_shared/designAnswer.js';
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, T, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, durationAt, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

SEC_B.home = function (){
  const dni = liveScore('durFactors');
  const dband = bandFor(M.durBands, dni);
  /* The capacity route's best duration on the engine's sweep. */
  const capFit = routeFit('gb', 'cap');
  const dur = capFit ? capFit.hours : durationAt(state.codYear);
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
      { t:'p', text:['Target COD window: ' + M.overall.codWindow, '目标投运窗口：' + M.overall.codWindow] },
      { t:'walk', items:[
        ['01', ['Overview','总览'], ['What is the house view today?','当前总体判断是什么？'], 'home'],
        ['02', ['Market evolution','市场演进'], ['Why did BESS become necessary — and what changed after entry?','为何储能成为必需？进入后发生了什么？'], 'story'],
        ['03', ['Revenue stack','收入结构'], ['Are CM, wholesale/BM and services durable at COD?','投运时容量、批发/平衡与系统服务是否可持续？'], 'capacity'],
        ['04', ['Asset design','资产设计'], ['What duration survives the next de-rating vintage?','什么时长能跨越下一折减系数版本？'], 'duration'],
        ['05', ['Underwriting','项目承销'], ['Can the project connect, finance and withstand downside?','项目能否并网、融资并承受下行情景？'], 'grid'],
        ['06', ['Portfolio application','组合应用'], ['Which screened GB opportunity actually passes the gates?','所筛选的英国机会中哪一个能通过门槛？'], 'portfolio'],
      ] },
      { t:'why', text:['The six questions are sequenced so each one can veto the next. A market that needs storage (02) is not the same as a revenue stack that survives to your COD (03), a design that stays economic under the next de-rating table (04), an asset that can actually connect and fund (05), or a specific opportunity worth committing capital to (06). Any single failure ends the case, so the decision is made in this order rather than on a blended score.',
        '六个问题按“逐级否决”排序：市场需要储能（02）不等于收入结构能延续至投运（03），不等于设计在下一版折减系数下仍然经济（04），不等于资产能真正并网并融资（05），也不等于某个具体机会值得投入资本（06）。任一环节不成立即终止，因此决策按此顺序作出，而非依赖综合评分。'],
        sig:['Sequential veto, not a scorecard','逐级否决，而非评分卡'] },
    ] },

    { t:'g2', cards:[
      // ---- Card A ----
      { title:['Card A — Capacity Market Signal','Card A — 容量市场信号'], live:false, blocks:[
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
      // ---- Card B ----
      { title:['Card B — Wholesale & Balancing Signal','Card B — 批发与平衡机制信号'], live:false, blocks:[
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
      // ---- Card C ----
      { title:['Card C — System Services Signal','Card C — 系统服务信号'], live:false, blocks:[
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
      // ---- Card D ----
      { title:['Card D — Duration Signal','Card D — 时长信号'], live:false, blocks:[
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
      // ---- Card E ----
      { title:['Card E — Grid Connection Signal','Card E — 并网风险信号'], badges:['illus'], live:false, blocks:[
        { t:'kpis', items:[
          { l:['Gate status','Gate状态'], v:'Gate 2', d:['offers phased through March 2027','要约分阶段发出至2027年3月'], b:['official'] },
          { l:['Binding evidence','约束性证据'], v:L(['Tranche + TO/DNO programme','批次+输配电运营商工程计划']), d:['not the historic connection date','而非历史并网日期'] },
          { l:['Consent status required','所需规划许可状态'], v:L(['Implementable','可实施']), d:['no outstanding pre-commencement conditions','无未决的开工前条件'] },
          { l:['Charging-reform exposure','网络收费改革敞口'], v:L(['Open','未定']), d:['TNUoS / DUoS / BSUoS in flight','TNUoS/DUoS/BSUoS改革推进中'], b:['verify'] },
        ] },
        { t:'note', text:['Required protection: no material non-refundable payment before a countersigned Gate 2 offer, an implementable consent and a TO/DNO works programme consistent with the modelled COD. A Gate 2 position alone does not prove an energisation date — see the nameplate → revenue bridge in the Grid Connection tab.',
          '必要保护：在取得已会签的Gate 2要约、可实施的规划许可，以及与模型投运日一致的输配电运营商工程计划之前，不支付重大不可退还款项。仅有Gate 2地位并不证明送电日期 — 详见“并网”页的铭牌容量至收入桥。'] },
        { t:'why', text:['Connection is the open risk because Gate status, connection date and consent are evidenced but not yet immovable, not because the site is bad. That distinction drives deal structure rather than pricing: an unsettled connection converts into conditions precedent, holdbacks and long-stop dates. In GB the specific failure mode is a Gate 2 offer whose delivery date slips behind the TO/DNO works programme — which changes the COD year, which changes the de-rating vintage and the buildout case, which changes revenue twice over.',
          '并网之所以仍是未决风险，原因是Gate状态、并网日期与规划许可虽有证据但尚未不可变更，而非场址本身不佳。这一区分影响交易结构而非定价：尚未落定的并网应转化为先决条件、保留款与最终截止日。在英国，具体的失效模式是Gate 2要约的交付日期落后于输配电运营商工程计划 — 这会改变投运年度，进而改变折减系数版本与投产情景，从两个方向同时改变收入。'],
          sig:['Structure risk, don’t re-price it','以结构而非定价应对'] },
      ] },
    ] },

    // ---- Card F ----
    { t:'card', title:['Card F — Underwriting rules','Card F — 承保规则'], badges:['illus'], live:false, blocks:[
      { t:'list', ol:true, items:[
        [['Base Capacity Market revenue on the auction-specific de-rated MW, never on nameplate MW.','容量市场收入应基于对应拍卖的折减后MW，绝不使用铭牌MW。'],
         ['Applies when: CM revenue included in the base case','适用条件：基准情景包含容量市场收入']],
        [['Release development consideration only against a countersigned Gate 2 offer, implementable consent and a consistent TO/DNO works programme.','仅在取得已会签Gate 2要约、可实施规划许可及一致的输配电工程计划后，方可支付开发对价。'],
         ['Applies when: Gate 2 or consent evidence incomplete','适用条件：Gate 2或规划许可证据不完整']],
        [['Stress merchant revenue under the HIGH buildout path for the project’s COD year, not the central case.','按项目投运年度的高投产情景（而非中性情景）对市场化收入进行压力测试。'],
         ['Applies when: merchant / BM revenue is material to debt service','适用条件：市场化/平衡收入对偿债影响重大']],
        [['Benchmark optimiser performance on realised rather than theoretical revenue; require step-down or termination rights below a defined threshold.','以实际而非理论收入评估优化商表现；低于约定阈值时应有降费或终止权。'],
         ['Applies when: realised-to-theoretical below the peer median of ' + fmtPct(M.realisedRatio.fleetMedian * 100, 0),'适用条件：实际与理论收入比低于同业中位' + fmtPct(M.realisedRatio.fleetMedian * 100, 0)]],
        [['Treat 8h+ LDES as a separate contracted asset class; do not capitalise a cap-and-floor before final award.','将8小时以上长时储能作为独立的合同化资产类别；最终授予前不得将上下限机制资本化。'],
         ['Applies when: duration ≥ 8 hours or a cap-and-floor is assumed','适用条件：时长≥8小时或假设适用上下限机制']],
      ] },
      { t:'why', text:['Each rule pairs an underwriting step with the condition that brings it into force, so the decision is reviewable rather than recalled. Four of the five conditions hold at today’s snapshot (CM in the base case, HIGH-case saturation material by 2030, services unit revenue down more than 20%, Gate 2 tranche timetable unresolved), so the protections listed here are mandatory, not optional. The call itself is on the Brief.',
        '每条规则都将一项承保步骤与使其生效的条件配对，使决策可复核而非凭记忆判断。按当前快照，五项条件中已有四项成立（基准情景含容量收入、2030年前高投产情景饱和显著、服务单位收入同比降幅超20%、Gate 2批次时间表未定），因此上列保护措施为必须而非可选。结论本身见要点页。'],
        sig:['4 of 5 conditions hold','5项条件已有4项成立'] },
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
      { t:'note', text:['Two separate multipliers, and they fail for unrelated reasons. Capacity revenue is cut administratively (a lower de-rating factor removes revenue with no physical change to the asset); merchant revenue is cut economically (execution, charges and saturation routinely consume 40%+ of theoretical value). Binding driver for a GB capacity-route project at ' + dur + 'h, the engine’s best on that route, reaching COD in ' + state.codYear + ': the ' + fmtPct(M.deratingCurve[dur] * 100) + ' de-rating factor at ' + dur + 'h and realised — not theoretical — dispatch.',
        '两个相互独立的乘数，且失效原因互不相关。容量收入被行政性削减（折减系数下调可在资产完全不变的情况下抹去收入）；市场化收入被经济性削减（执行、网络费与饱和通常吞噬理论价值的40%以上）。对' + state.codYear + '投运、按引擎在容量路径上的最佳时长' + dur + '小时建设的英国项目，起约束作用的驱动为：' + dur + '小时下' + fmtPct(M.deratingCurve[dur] * 100) + '的折减系数，以及实际（而非理论）调度表现。'] },
      { t:'why', text:['This bridge is the dashboard’s single organising idea: every later tab is one link in it. Diligence has to price the weakest link, not the headline MW, and the two chains must be stress-tested separately — a project can hold a strong Gate 2 position and still fail on realised dispatch, or trade brilliantly and still lose a third of its capacity revenue to a de-rating revision it cannot influence.',
        '本桥是整个看板的组织主线：后续每个页面都是其中一环。尽调应对最弱环节定价，而非铭牌MW；且两条链须分别压力测试 — 项目可能拥有稳固的Gate 2地位却在实际调度上失败，也可能交易表现优异却因无法影响的折减系数修订而损失三分之一容量收入。'],
        sig:['Price the weakest link','对最弱环节定价'] },
    ] },
  ] };
};

// ============================== GB MARKET STORY ==============================

  return SEC_B.home;
}
