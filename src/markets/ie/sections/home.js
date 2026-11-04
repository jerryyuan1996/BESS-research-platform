/* Ireland — the `home` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O, perNameplate } = createShared(api);
  const SEC_B = {};

SEC_B.home = function (){
  const dni = liveScore('durFactors');
  const dband = bandFor(M.durBands, dni);
  const cod = state.codYear, cc = M.codCases[cod] || M.codCases[2029];
  return {
  warn: M.seedWarn,
  blocks: [
    { t:'card', mt:false, title:['Institutional Investor Walkthrough — six questions, one decision path','机构投资人导览 — 六个问题，一条决策路径'],
      badges:['official'], live:false, blocks:[
      { t:'band-story', b:['Core storyline','核心叙事'],
        text:['Ireland is a small, wind-dominated, weakly interconnected island system that pays more for firm capacity than almost any market in Europe — and it is now adding interconnection and data-centre demand at the same time. Storage is structurally required to absorb dispatch-down and firm the evening peak, but the two revenue lines that built the existing fleet (DS3 system services and wide uncontested spreads) are both being repriced. The investment case now rests on de-rated capacity value, connection readiness and duration, not on legacy ancillary economics.',
              '爱尔兰是一个规模小、风电主导、互联薄弱的岛屿系统，其对可靠容量的支付水平高于欧洲几乎所有市场；同时正在增加互联能力与数据中心需求。储能在结构上是吸纳限发电量、支撑晚高峰所必需的，但支撑既有机组建设的两条收入线（DS3系统服务与宽而无竞争的价差）正同时被重新定价。当前投资逻辑立足于折减后容量价值、并网准备度与时长，而非既往的辅助服务经济性。'] },
      { t:'p', text:['Target COD window: ' + M.overall.codWindow, '目标投运窗口：' + M.overall.codWindow] },
      { t:'walk', items:[
        ['01', ['Overview','总览'], ['What is the house view today?','当前总体判断是什么？'], 'home'],
        ['02', ['Market evolution','市场演进'], ['Why did BESS become necessary — and what changed after entry?','为何储能成为必需？进入后发生了什么？'], 'story'],
        ['03', ['Revenue stack','收入结构'], ['Is capacity, wholesale and DS3/FASS durable at COD?','投运时容量、批发与DS3/FASS是否可持续？'], 'capacity'],
        ['04', ['Asset design','资产设计'], ['What duration clears the de-rating band and the LDES threshold?','什么时长能达到折减档位与长时储能门槛？'], 'duration'],
        ['05', ['Underwriting','项目承销'], ['Can the project connect, finance and withstand downside?','项目能否并网、融资并承受下行情景？'], 'grid'],
        ['06', ['Portfolio application','组合应用'], ['Which screened Irish opportunity actually passes the gates?','所筛选的爱尔兰机会中哪一个能通过门槛？'], 'portfolio'],
      ] },
      { t:'why', text:['The six questions are sequenced so each one can veto the next. A market that needs storage (02) is not the same as a revenue stack that survives FASS repricing to your COD (03), a design that clears the de-rating band (04), an asset that can actually connect with documented MEC and MIC (05), or a specific opportunity worth committing capital to (06). Any single failure ends the case, so the decision is made in this order rather than on a blended score.',
        '六个问题按“逐级否决”排序：市场需要储能（02）不等于收入结构能在FASS重新定价后延续至投运（03），不等于设计能达到折减档位（04），不等于资产能以书面MEC与MIC真正并网（05），也不等于某个具体机会值得投入资本（06）。任一环节不成立即终止，因此决策按此顺序作出，而非依赖综合评分。'],
        sig:['Sequential veto, not a scorecard','逐级否决，而非评分卡'] },
    ] },

    { t:'g2', cards:[
      { title:['Card A — Capacity Mechanism Signal','Card A — 容量机制信号'], live:false, blocks:[
        { t:'chip', cls:'good', text:['Strong — the highest de-rated capacity price in the comparison set','强劲 — 对比样本中折减容量价格最高'] },
        { t:'kpis', items:[
          { l:['T-4 clearing price (DY ' + O.crmDY + ')','T-4出清价（交付年' + O.crmDY + '）'], v:fmtC(O.crmPrice) + '<small>/kW de-rated/yr</small>',
            d:['from ~€110/kW at DY 27/28','由27/28年度约€110/kW上升'], b:['official','verify'] },
          { l:['Awarded de-rated capacity','中标折减容量'], v:fmtN(O.crmAwardedMW) + '<small> MW</small>', d:['de-rated, not nameplate','折减口径，非铭牌'], b:['official','verify'] },
          { l:['2h de-rating factor','2小时折减系数'], v:fmtPct(M.deratingCurve[2] * 100, 0), d:['4h: ' + fmtPct(M.deratingCurve[4] * 100, 0) + ' · 8h: ' + fmtPct(M.deratingCurve[8] * 100, 0),'4小时：' + fmtPct(M.deratingCurve[4] * 100, 0) + ' · 8小时：' + fmtPct(M.deratingCurve[8] * 100, 0)], b:['illus'] },
          { l:['Capacity revenue per nameplate MW (2h)','每铭牌MW容量收入（2小时）'], v:fmtCk(perNameplate(2)) + '<small>/MW/yr</small>', d:['4h: ' + fmtCk(perNameplate(4)),'4小时：' + fmtCk(perNameplate(4))], b:['calc'] },
          { l:['New-capacity agreement length','新建容量协议年限'], v:O.crmAgreementYears + '<small> yr</small>', d:['verify the unit class before modelling','建模前须核验机组类别'], b:['verify'] },
          { l:['Reliability Option obligation','可靠性期权义务'], v:L(['Difference payment above strike','高于执行价时支付差价']), d:['capacity payment is not unconditional','容量付费并非无条件'], b:['official'] },
        ] },
        { t:'why', text:['At ' + fmtC(O.crmPrice) + '/kW de-rated/yr a 4-hour battery earns roughly ' + fmtCk(perNameplate(4)) + '/MW/yr of capacity revenue before any trading — enough to be the primary revenue line, which is unusual in Europe and is the single strongest feature of the Irish case. But the payment is a Reliability Option, not an annuity: above the strike price the unit owes difference payments whether or not it can generate. That converts the capacity line from a fixed receipt into a hedged short position, and it is why duration and availability matter more here than the headline price suggests.',
          '按' + fmtC(O.crmPrice) + '/kW折减/年计，4小时电池在任何交易之前即可获得约' + fmtCk(perNameplate(4)) + '/MW/年的容量收入 — 足以成为主要收入来源，这在欧洲并不常见，也是爱尔兰投资逻辑最突出的特征。但该付费是可靠性期权而非年金：当电价高于执行价时，无论机组能否发电均须支付差价。这使容量收入项由固定收款转变为对冲后的空头头寸，也正因如此，时长与可用率在此地的重要性高于表面价格所显示的水平。'],
          sig:['A hedged short, not an annuity','是对冲后的空头，而非年金'] },
      ] },
      { title:['Card B — Wholesale & Balancing Signal','Card B — 批发与平衡市场信号'], live:false, blocks:[
        { t:'chip', cls:'warn', text:['Wide spreads, but only part is executable','价差宽，但仅部分可执行'] },
        { t:'kpis', items:[
          { l:['Average daily day-ahead spread','日均日前价差'], v:fmtC(O.daSpread) + '<small>/MWh</small>', d:['trailing twelve months','过去十二个月'], b:['tp'] },
          { l:['Executable net spread after haircuts','扣减后可执行净价差'], v:fmtC(59) + '<small>/MWh</small>', d:[fmtPct((1 - 59 / O.daSpread) * 100, 0) + ' of the published figure is not capturable','公布数值中' + fmtPct((1 - 59 / O.daSpread) * 100, 0) + '无法捕获'], cls:'down', b:['calc'] },
          { l:['Captured spread at COD ' + cod,'投运年' + cod + '的捕获价差'], v:fmtC(cc.central) + '<small>/MWh</small>', d:['low ' + fmtC(cc.low) + ' · high ' + fmtC(cc.high),'低' + fmtC(cc.low) + ' · 高' + fmtC(cc.high)], b:['illus'] },
          { l:['Negative-price hours','负电价小时数'], v:'~' + fmtN(M.negHoursSeries[2]) + '<small> h (2025)</small>', d:['from ~' + fmtN(M.negHoursSeries[0]) + ' h in 2023','由2023年约' + fmtN(M.negHoursSeries[0]) + '小时上升'], b:['illus'] },
          { l:['Scheduling integration (SDP-02)','调度整合（SDP-02）'], v:'live ' + O.sdp02Live, d:['traded volume index ' + M.sdp.before.vol + ' → ' + M.sdp.after.vol,'交易量指数由' + M.sdp.before.vol + '升至' + M.sdp.after.vol], b:['official'] },
        ] },
        { t:'why', text:['The published spread of ' + fmtC(O.daSpread) + '/MWh is the number that attracts capital to Ireland, and ' + fmtPct((1 - 59 / O.daSpread) * 100, 0) + '% of it never reaches the P&L. The largest single deduction is dispatch and constraint access, not efficiency — in a centrally scheduled market with a binding non-synchronous penetration limit, a battery is not always permitted to do the trade the price signal implies. Underwrite the executable spread, and treat any model built off the published figure as overstated by roughly a factor of two.',
          '公布的' + fmtC(O.daSpread) + '/MWh价差是吸引资本进入爱尔兰的数字，而其中' + fmtPct((1 - 59 / O.daSpread) * 100, 0) + '%从未进入损益表。最大的单项扣减是调度与网络约束准入，而非效率损失 — 在一个集中调度、且非同步渗透率存在硬性上限的市场中，电池并不总被允许执行价格信号所隐含的那笔交易。应以可执行价差测算；任何基于公布数字构建的模型，其高估幅度约为两倍。'],
          sig:['Published spread is not executable spread','公布价差不等于可执行价差'] },
      ] },
      { title:['Card C — DS3 / FASS Signal','Card C — DS3/FASS信号'], live:false, blocks:[
        { t:'chip', cls:'critical', text:['Repricing risk — the largest near-term reform exposure','重新定价风险 — 最大的近期改革敞口'] },
        { t:'kpis', items:[
          { l:['Effective DS3 revenue decline since 2022','DS3有效收入自2022年降幅'], v:'>' + O.ds3DeclinePct + '<small>%</small>', d:['company-disclosed','公司披露'], cls:'down', b:['dev'] },
          { l:['Regulated-arrangements long-stop','监管安排最终截止'], v:O.ds3LongStop, d:['or earlier DASSA go-live','或DASSA提前上线'], b:['official'] },
          { l:['DASSA target go-live','DASSA目标上线'], v:O.dassaTarget, d:['competitive day-ahead auction replaces tariffs','竞争性日前拍卖取代固定费率'], b:['consult'] },
          { l:['Modelled FASS transition haircut','模型FASS过渡折减'], v:M.fassHaircutPct + '<small>%</small>', d:['illustrative — see the FASS bridge','示例 — 详见FASS桥'], b:['illus'] },
        ] },
        { t:'why', text:['DS3 is the revenue line that built the existing Irish fleet, it has already fallen more than ' + O.ds3DeclinePct + '%, and the mechanism that replaces it is a competitive auction rather than an administered tariff. Every historical Irish battery return series is therefore contaminated by a revenue source that will not exist in the same form at a 2028–2030 COD. Treat legacy DS3 revenue as evidence of what the system needed, never as a floor — and never underwrite a 1-hour asset on it.',
          'DS3是支撑爱尔兰既有机组建设的收入来源，其已下降超过' + O.ds3DeclinePct + '%，且取代它的机制是竞争性拍卖而非行政定价。因此所有历史上的爱尔兰电池收益序列，均被一项在2028–2030年投运时不会以相同形式存在的收入所污染。应将既往DS3收入视为系统需求的证据，绝不作为下限 — 更不可据以对1小时资产进行承销。'],
          sig:['Legacy DS3 is evidence, not a floor','既往DS3是证据，而非下限'] },
      ] },
      { title:['Card D — Duration Signal','Card D — 时长信号'], live:false, blocks:[
        { t:'chip', cls:'good', text:['Strengthening — de-rating uplift is the largest single driver','走强 — 折减系数增益是最大的单一驱动'] },
        { t:'kpis', items:[
          { l:['Duration-Need Index','时长需求指数'], v:dni + '<small> / 100</small>', d:dband.n, b:['calc','illus'] },
          { l:['De-rating uplift, 2h → 4h','折减系数增益，2小时→4小时'], v:'+' + fmtPct((M.deratingCurve[4] - M.deratingCurve[2]) * 100, 0) + '<small> pts</small>',
            d:['worth ' + fmtCk(perNameplate(4) - perNameplate(2)) + '/MW/yr','价值' + fmtCk(perNameplate(4) - perNameplate(2)) + '/MW/年'], b:['calc'] },
          { l:['Wind dispatch-down (ROI, 2025)','风电限发（爱尔兰共和国，2025）'], v:fmt1(O.windDispatchDownPct) + '<small>%</small>', d:['storage absorbs what the system cannot take','储能吸纳系统无法接纳的电量'], b:['official','verify'] },
          { l:['High-price event length (P90)','高价事件时长（P90）'], v:fmt1(M.eventDist[0].p90) + '<small> h</small>', d:['dispatch-down events P90 ' + fmt1(M.eventDist[2].p90) + ' h','限发事件P90 ' + fmt1(M.eventDist[2].p90) + '小时'], b:['illus'] },
          { l:['LDES procurement concept','长时储能采购概念'], v:fmtN(O.ldesMW) + ' MW / ' + fmtN(O.ldesMWh) + '<small> MWh</small>', d:['consultation stage — not a market yet','征询阶段 — 尚未形成市场'], b:['consult'] },
        ] },
        { t:'flow', items:[
          ['High wind share & dispatch-down','高风电占比与限发'],
          ['Small, weakly interconnected system','小规模、弱互联系统'],
          ['Duration-differentiated de-rating','按时长差异化的折减系数'],
          ['Data-centre demand growth','数据中心需求增长'],
          ['4h+ investment signal','4小时以上投资信号'],
        ], sep:'+' },
        { t:'why', text:['Unlike GB, where the fourth hour is a marginal capacity decision, in Ireland it is the dominant one: the de-rating factor moves from ' + fmtPct(M.deratingCurve[2] * 100, 0) + ' to ' + fmtPct(M.deratingCurve[4] * 100, 0) + ', worth ' + fmtCk(perNameplate(4) - perNameplate(2)) + '/MW/yr at the current clearing price. That is larger than the entire system-services line for a short asset. In a market that pays this much for firm capacity, duration is not an optimisation — it is the product.',
          '与英国不同 — 在英国第4小时是边际性的容量决策 — 在爱尔兰它是主导性决策：折减系数由' + fmtPct(M.deratingCurve[2] * 100, 0) + '升至' + fmtPct(M.deratingCurve[4] * 100, 0) + '，按当前出清价值' + fmtCk(perNameplate(4) - perNameplate(2)) + '/MW/年，高于短时资产的整个系统服务收入。在一个为可靠容量支付如此之多的市场中，时长不是优化项 — 它就是产品本身。'],
          sig:['In Ireland, duration is the product','在爱尔兰，时长即产品'] },
      ] },
      { title:['Card E — Grid & Connection Signal','Card E — 并网信号'], badges:['illus'], live:false, blocks:[
        { t:'kpis', items:[
          { l:['Binding evidence','约束性证据'], v:L(['Executed connection agreement','已签并网协议']), d:['not an ECP batch position alone','而非仅有ECP批次位置'] },
          { l:['MEC / MIC documentation','MEC/MIC文件'], v:L(['Both required','两者均须具备']), d:['MEC is export; MIC is the right to charge','MEC为送出；MIC为充电权利'], b:['verify'] },
          { l:['Constraint & curtailment cost','约束与弃电成本'], v:fmtCM(O.constraintCostM * 1e6), d:['2024/25 · forecast ' + fmtCM(O.constraintForecastM * 1e6),'2024/25 · 预测' + fmtCM(O.constraintForecastM * 1e6)], b:['official','verify'] },
          { l:['SNSP limit','非同步渗透率上限'], v:O.snspNow + '<small>%</small>', d:['policy direction ' + O.snsp2030 + '% by 2030','政策方向：2030年达' + O.snsp2030 + '%'], b:['official','verify'] },
        ] },
        { t:'note', text:['Required protection: no material non-refundable payment before an executed connection agreement with documented MEC and MIC. An ECP batch position, a high-level technical assessment or a connection offer that has not been accepted are all insufficient — and MEC without MIC leaves the asset unable to charge at contracted power.',
          '必要保护：在取得已签署且载明MEC与MIC的并网协议前，不支付重大不可退还款项。ECP批次位置、高层技术评估或尚未接受的并网报价均不充分 — 且仅有MEC而无MIC，将使资产无法以合同功率充电。'] },
        { t:'why', text:['The distinctively Irish failure mode is the MEC/MIC asymmetry: a project can hold full export capacity and a lower import capacity, which silently caps cycling and therefore caps both arbitrage revenue and the ability to be full at the start of a capacity event. Check both numbers in the executed agreement, not in the offer.',
          '爱尔兰特有的失效模式是MEC/MIC不对称：项目可能拥有完整的送出容量而受入容量较低，这会在无形中限制循环次数，从而同时限制套利收入以及在容量事件开始时保持满荷电的能力。应在已签协议而非报价文件中核对这两个数字。'],
          sig:['MEC without MIC caps cycling','有MEC无MIC将限制循环'] },
      ] },
    ] },

    { t:'card', title:['Card F — Immediate Investor Actions','Card F — 可执行投资建议'], badges:['illus'], live:false, blocks:[
      { t:'list', ol:true, items:[
        [['Base capacity revenue on the auction-vintage de-rating factor and de-rated MW, never on nameplate MW.','容量收入应基于对应拍卖年份的折减系数与折减后MW，绝不使用铭牌MW。'],
         ['Trigger: capacity revenue included in the base case','触发条件：基准情景包含容量收入']],
        [['Require an executed connection agreement with documented MEC and MIC as a condition precedent — never an ECP batch position alone.','以载明MEC与MIC的已签并网协议为先决条件 — 绝不以仅有ECP批次位置为准。'],
         ['Trigger: connection evidence below executed-agreement standard','触发条件：并网证据未达已签协议标准']],
        [['Include a FASS revenue re-opener and DASSA-parameter triggers in any acquisition, toll or offtake agreement.','在任何收购、代工或售电协议中设置FASS收入重议条款及DASSA参数触发机制。'],
         ['Trigger: DS3/FASS revenue material to debt service','触发条件：DS3/FASS收入对偿债影响重大']],
        [['Protect capacity value with degradation covenants that keep usable duration above the awarded de-rating band for the agreement term.','以衰减契约保护容量价值，使可用时长在协议期内维持在中标折减档位之上。'],
         ['Trigger: modelled duration within 10% of a de-rating band boundary','触发条件：模型时长距折减档位边界不足10%']],
        [['Model the Reliability Option as a short call: stress difference payments in high-price years, not only revenue in normal ones.','将可靠性期权作为空头看涨期权建模：对高电价年份的差价支付进行压力测试，而不仅测算正常年份的收入。'],
         ['Trigger: any year with sustained prices above the strike','触发条件：任一年度电价持续高于执行价']],
      ] },
      { t:'why', text:['Each action is paired with a numeric or documentary trigger so the decision is reviewable rather than a matter of judgement recalled later. The Irish-specific ones are the second and the fifth: connection evidence is where development capital is lost, and the Reliability Option is the risk most often omitted entirely from a first-pass model because it only appears as a cost in the years that otherwise look best.',
        '每项建议均配套量化或文件化触发条件，使决策可复核，而非事后凭记忆判断。其中第二项与第五项为爱尔兰特有：并网证据是开发资本损失之处；而可靠性期权是首轮模型中最常被完全遗漏的风险，因为它只在其他方面看起来最好的年份里以成本形式出现。'],
        sig:['The option costs most in the best years','期权成本恰在最好的年份最高'] },
    ] },

    { t:'card', title:['Revenue Driver Bridge — how nameplate MW becomes net operating revenue','收入驱动桥 — 铭牌MW如何变为净运营收入'], badges:['calc'], live:false, blocks:[
      { t:'sub', text:['Capacity channel (CRM)','容量通道（容量报酬机制）'] },
      { t:'flow', items:[
        ['Nameplate MW / MWh','铭牌MW/MWh'], ['Contracted MEC','合同MEC'],
        ['× de-rating factor for duration','×按时长的折减系数'], ['Awarded de-rated MW × clearing price','中标折减MW×出清价'],
        ['− Reliability Option difference payments','− 可靠性期权差价支付'], ['Net capacity revenue','净容量收入'],
      ] },
      { t:'sub', text:['Merchant channel (net, not gross)','市场化通道（净值，非毛值）'] },
      { t:'flow', items:[
        ['Published day-ahead spread','公布日前价差'], ['− liquidity & forecast error','− 流动性与预测误差'],
        ['− RTE and cycling limits','− 效率与循环限制'], ['− dispatch, SNSP & constraint access','− 调度、SNSP与约束准入'],
        ['− optimiser fee','− 优化商费用'], ['+ DS3 / FASS system services','+ DS3/FASS系统服务'], ['Net operating revenue','净运营收入'],
      ] },
      { t:'note', text:['Two chains, two failure modes. The capacity chain fails on duration and availability — a de-rating band miss or a Reliability Option difference payment removes revenue with no physical change to the asset. The merchant chain fails on access — dispatch, SNSP and constraints remove roughly ' + fmtPct(14 / O.daSpread * 100, 0) + ' of the published spread before efficiency is even considered. Binding driver for an Irish 4h project reaching COD in ' + state.codYear + ': the de-rating band and documented MIC.',
        '两条链条，两种失效模式。容量链的失效点在时长与可用率 — 未达折减档位或触发可靠性期权差价支付，都会在资产完全不变的情况下抹去收入。市场化链的失效点在准入 — 调度、SNSP与网络约束在尚未考虑效率损失前，即已抹去公布价差的约' + fmtPct(14 / O.daSpread * 100, 0) + '。对' + state.codYear + '投运的爱尔兰4小时项目，起约束作用的驱动为：折减档位与书面MIC。'] },
      { t:'why', text:['This bridge is the dashboard’s single organising idea: every later tab is one link in it. Diligence has to price the weakest link, not the headline MW, and the two chains must be stress-tested separately because they fail for unrelated reasons — a project can hold a strong capacity award and still be unable to charge, or trade well and still owe difference payments in the year it earned most.',
        '本桥是整个看板的组织主线：后续每个页面都是其中一环。尽调应对最弱环节定价，而非铭牌MW；且两条链须分别压力测试，因其失效原因互不相关 — 项目可能持有优质容量中标却无法充电，也可能交易表现良好，却在收入最高的年份负有差价支付义务。'],
        sig:['Price the weakest link','对最弱环节定价'] },
    ] },
  ] };
};

// ============================== IRELAND MARKET STORY ==============================

  return SEC_B.home;
}
