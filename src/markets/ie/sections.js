/* ---------------------------------------------------------------------------
   Ireland (SEM, all-island) 鈥?declarative section specs, verbatim from the prototype
   (lines 1645-2677).

   One SEC_B entry per tab, each returning a block spec that the shared engine
   draws. SECTIONS() wraps them in lazy getters so every string re-evaluates when
   the language changes.

   The engine hands in everything these specs use; nothing is imported directly,
   which is what keeps the four markets in this lineage interchangeable.
   --------------------------------------------------------------------------- */

import { gridMapById } from '../gridMapRegistry.js';
import { congestionFor } from '../congestionRegistry.js';
import { ieOfficialPlanningBlocks, ieQueueCoverageBlock } from './officialPlanningSection.js';
import { ieEconomicsP0Blocks } from './economicsP0Section.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function buildSections(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, compositeScore, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;

// ---------------- section registry ----------------
const SEC_B = {};
function SECTIONS(){
  const o = {};
  Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
  return o;
}
const O = M.official;
const perNameplate = hh => O.crmPrice * interp(M.deratingCurve, hh) * 1000;   // €/MW/yr
// gross merchant revenue per nameplate MW/yr at a given duration, on the lab assumptions
const ieMerchantPerMW = hh => hh * M.usableFraction * M.lab.cycles * 365 * (M.lab.avail / 100)
  * M.lab.spread * interp(M.durSpreadFactor, hh);

// ============================== OVERVIEW ==============================
SEC_B.home = function (){
  const comp = compositeScore(), dni = liveScore('durFactors'), cs = liveScore('connFactors');
  const dband = bandFor(M.durBands, dni), cband = bandFor(M.connBands, cs);
  const cod = state.codYear, cc = M.codCases[cod] || M.codCases[2029];
  return {
  warn: M.seedWarn,
  blocks: [
    { t:'card', mt:false, title:['Institutional Investor Walkthrough — six questions, one decision path','机构投资人导览 — 六个问题，一条决策路径'],
      badges:['official'], live:false, blocks:[
      { t:'band-story', b:['Core storyline','核心叙事'],
        text:['Ireland is a small, wind-dominated, weakly interconnected island system that pays more for firm capacity than almost any market in Europe — and it is now adding interconnection and data-centre demand at the same time. Storage is structurally required to absorb dispatch-down and firm the evening peak, but the two revenue lines that built the existing fleet (DS3 system services and wide uncontested spreads) are both being repriced. The investment case now rests on de-rated capacity value, connection readiness and duration, not on legacy ancillary economics.',
              '爱尔兰是一个规模小、风电主导、互联薄弱的岛屿系统，其对可靠容量的支付水平高于欧洲几乎所有市场；同时正在增加互联能力与数据中心需求。储能在结构上是吸纳限发电量、支撑晚高峰所必需的，但支撑既有机组建设的两条收入线（DS3系统服务与宽而无竞争的价差）正同时被重新定价。当前投资逻辑立足于折减后容量价值、并网准备度与时长，而非既往的辅助服务经济性。'] },
      { t:'walk', items:[
        ['01', ['Overview','总览'], ['What is the house view today?','当前总体判断是什么？'], 'home'],
        ['02', ['Market evolution','市场演进'], ['Why did BESS become necessary — and what changed after entry?','为何储能成为必需？进入后发生了什么？'], 'story'],
        ['03', ['Revenue stack','收入结构'], ['Is capacity, wholesale and DS3/FASS durable at COD?','投运时容量、批发与DS3/FASS是否可持续？'], 'capacity'],
        ['04', ['Asset design','资产设计'], ['What duration clears the de-rating band and the LDES threshold?','什么时长能达到折减档位与长时储能门槛？'], 'duration'],
        ['05', ['Underwriting','项目承销'], ['Can the project connect, finance and withstand downside?','项目能否并网、融资并承受下行情景？'], 'grid'],
        ['06', ['Portfolio application','组合应用'], ['Which screened Irish opportunity actually passes the gates?','所筛选的爱尔兰机会中哪一个能通过门槛？'], 'portfolio'],
      ] },
      { t:'note', text:['Recommended presentation order: Overview → Ireland Market Story → Capacity Mechanism → Wholesale & Balancing → DS3/FASS → Duration → Pipeline → Grid & Connection → Investment Lab → Portfolio. Ireland vs GB and Data & Methodology are reference appendices unless a question requires them.',
        '建议讲解顺序：总览 → 爱尔兰市场演进 → 容量机制 → 批发与平衡 → DS3/FASS → 时长 → 管线 → 并网 → 投资测算 → 组合。爱英对比与数据方法作为问答附录。'] },
      { t:'why', text:['The six questions are sequenced so each one can veto the next. A market that needs storage (02) is not the same as a revenue stack that survives FASS repricing to your COD (03), a design that clears the de-rating band (04), an asset that can actually connect with documented MEC and MIC (05), or a specific opportunity worth committing capital to (06). Any single failure ends the case, so the decision is made in this order rather than on a blended score.',
        '六个问题按“逐级否决”排序：市场需要储能（02）不等于收入结构能在FASS重新定价后延续至投运（03），不等于设计能达到折减档位（04），不等于资产能以书面MEC与MIC真正并网（05），也不等于某个具体机会值得投入资本（06）。任一环节不成立即终止，因此决策按此顺序作出，而非依赖综合评分。'],
        sig:['Sequential veto, not a scorecard','逐级否决，而非评分卡'] },
    ] },

    { t:'g2', cards:[
      { title:['Card A — Overall Ireland Storage Signal','Card A — 爱尔兰储能综合信号'], badges:['illus'], live:false, blocks:[
        { t:'chip', cls:M.overall.chipCls, text:M.overall.statusL },
        { t:'p', text:['Composite score: ' + comp + ' / 100 · Confidence: ' + M.overall.confidence + '% · Target COD window: ' + M.overall.codWindow,
          '综合评分：' + comp + ' / 100 · 置信度：' + M.overall.confidence + '% · 目标投运窗口：' + M.overall.codWindow] },
        { t:'meter', pct: comp, color:'warn' },
        { t:'p', text:M.overall.rationale },
        { t:'sub', text:['Component scores (weights never hidden behind the composite):','分项评分（权重不隐藏于综合分之后）：'] },
        { t:'scores', items:M.components, max:100 },
        { t:'why', text:['The composite is deliberately not a go/no-go number. The strongest components — capacity value (76) and wholesale outlook (72) — are market-wide and available to every competitor; the weakest — connection value (48) and DS3/FASS (40) — are the ones that actually differentiate projects and destroy value. A score of ' + comp + ' with that split means "the market is attractive and the specific project is where the risk lives", which is the opposite of the usual reading.',
          '综合分刻意不作为一票通过的指标。最强的分项 — 容量价值（76）与批发前景（72） — 属全市场性质，每个竞争者均可获得；最弱的分项 — 并网价值（48）与DS3/FASS（40） — 才是真正区分项目并可能摧毁价值的因素。综合' + comp + '分在此结构下的含义是“市场具吸引力，而风险存在于具体项目”，这与通常的解读恰好相反。'],
          sig:['Market is strong; the project is the risk','市场强劲，风险在项目'] },
      ] },
      { title:['Card B — Capacity Mechanism Signal','Card B — 容量机制信号'], live:false, blocks:[
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
      { title:['Card C — Wholesale & Balancing Signal','Card C — 批发与平衡市场信号'], live:false, blocks:[
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
      { title:['Card D — DS3 / FASS Signal','Card D — DS3/FASS信号'], live:false, blocks:[
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
      { title:['Card E — Duration Signal','Card E — 时长信号'], live:false, blocks:[
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
      { title:['Card F — Grid & Connection Signal','Card F — 并网信号'], badges:['illus'], live:false, blocks:[
        { t:'chip', cls:cband.c, text:cband.n },
        { t:'kpis', items:[
          { l:['Connection risk score','并网风险评分'], v:cs + '<small> / 100</small>', d:cband.n, b:['calc'] },
          { l:['Binding evidence','约束性证据'], v:L(['Executed connection agreement','已签并网协议']), d:['not an ECP batch position alone','而非仅有ECP批次位置'] },
          { l:['MEC / MIC documentation','MEC/MIC文件'], v:L(['Both required','两者均须具备']), d:['MEC is export; MIC is the right to charge','MEC为送出；MIC为充电权利'], b:['verify'] },
          { l:['Constraint & curtailment cost','约束与弃电成本'], v:fmtCM(O.constraintCostM * 1e6), d:['2024/25 · forecast ' + fmtCM(O.constraintForecastM * 1e6),'2024/25 · 预测' + fmtCM(O.constraintForecastM * 1e6)], b:['official','verify'] },
          { l:['SNSP limit','非同步渗透率上限'], v:O.snspNow + '<small>%</small>', d:['policy direction ' + O.snsp2030 + '% by 2030','政策方向：2030年达' + O.snsp2030 + '%'], b:['official','verify'] },
        ] },
        { t:'note', text:['Required protection: no material non-refundable payment before an executed connection agreement with documented MEC and MIC. An ECP batch position, a high-level technical assessment or a connection offer that has not been accepted are all insufficient — and MEC without MIC leaves the asset unable to charge at contracted power.',
          '必要保护：在取得已签署且载明MEC与MIC的并网协议前，不支付重大不可退还款项。ECP批次位置、高层技术评估或尚未接受的并网报价均不充分 — 且仅有MEC而无MIC，将使资产无法以合同功率充电。'] },
        { t:'why', text:['Connection is scored ' + cs + '/100 (higher = riskier), and the heaviest weight sits on connection stage and executed agreement at 20%. The distinctively Irish failure mode is the MEC/MIC asymmetry: a project can hold full export capacity and a lower import capacity, which silently caps cycling and therefore caps both arbitrage revenue and the ability to be full at the start of a capacity event. Check both numbers in the executed agreement, not in the offer.',
          '并网评分' + cs + '/100（分值越高风险越大），权重最高的是并网阶段与已签协议，占20%。爱尔兰特有的失效模式是MEC/MIC不对称：项目可能拥有完整的送出容量而受入容量较低，这会在无形中限制循环次数，从而同时限制套利收入以及在容量事件开始时保持满荷电的能力。应在已签协议而非报价文件中核对这两个数字。'],
          sig:['MEC without MIC caps cycling','有MEC无MIC将限制循环'] },
      ] },
    ] },

    { t:'card', title:['Card G — Immediate Investor Actions','Card G — 可执行投资建议'], badges:['illus'], live:false, blocks:[
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
SEC_B.story = function (){
  return {
  head: ['Ireland Market Evolution — from a wind-integration problem to a capacity-priced storage market',
         '爱尔兰市场演进 — 从风电消纳问题到以容量定价的储能市场'],
  cap: ['This section is the narrative bridge between the Overview and the detailed underwriting tabs. It separates historical facts, observed market outcomes and the forward investment conclusion.',
        '本节连接“总览”与后续承销分析，明确区分历史事实、已观察市场结果及前瞻投资结论。'],
  blocks: [
    ...ieEconomicsP0Blocks(SRC),
    ...ieOfficialPlanningBlocks(),
    { t:'card', mt:false, title:['One-minute orientation for a new institutional investor','机构投资人的一分钟市场定位'], badges:['official','public'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Market design','市场设计'], v:'I-SEM', d:['all-island gross pool with central scheduling and a capacity mechanism','全岛总电量池，集中调度并配套容量机制'], b:['official'] },
        { l:['Operating storage fleet','在运储能规模'], v:fmt1(O.fleetMW / 1000) + '<small> GW</small>', d:['mostly 0.5–2h, built for DS3','以0.5–2小时为主，为DS3而建'], b:['illus'] },
        { l:['Storage pipeline','储能管线'], v:fmt1(O.pipelineMW / 1000) + '<small> GW</small>', d:[fmt1(O.pipelineMWh / 1000) + ' GWh across ~' + O.pipelineProjects + ' projects','约' + O.pipelineProjects + '个项目，' + fmt1(O.pipelineMWh / 1000) + 'GWh'], b:['illus'] },
        { l:['Data-centre share of metered demand','数据中心占计量用电比重'], v:O.dcSharePct + '<small>%</small>', d:[fmtN(O.dcGWh2025) + ' GWh in 2025 and rising','2025年' + fmtN(O.dcGWh2025) + 'GWh且持续上升'], b:['official'] },
        { l:['Wind dispatch-down (ROI)','风电限发（爱尔兰共和国）'], v:fmt1(O.windDispatchDownPct) + '<small>%</small>', d:['constraint & curtailment cost ' + fmtCM(O.constraintCostM * 1e6),'约束与弃电成本' + fmtCM(O.constraintCostM * 1e6)], b:['official','verify'] },
        { l:['Interconnection added','新增互联能力'], v:fmtN(O.greenlinkMW + O.celticMW) + '<small> MW</small>', d:['Greenlink ' + fmtN(O.greenlinkMW) + ' MW (2025) + Celtic ' + fmtN(O.celticMW) + ' MW (2028e)','Greenlink ' + fmtN(O.greenlinkMW) + 'MW（2025）+ Celtic ' + fmtN(O.celticMW) + 'MW（2028预计）'], b:['official'] },
      ] },
      { t:'reco', b:['Institutional conclusion: ','机构投资结论：'],
        text:['Ireland is not a merchant-arbitrage market with a capacity bonus — it is a capacity market with a merchant overlay. The system pays exceptionally well for firm, de-rated capacity because it is small, wind-dominated and weakly interconnected; it pays comparatively poorly for trading because central scheduling and system limits cap what a battery is allowed to do. Storage economics therefore follow the de-rating table and the connection agreement far more closely than they follow the price curve.',
              '爱尔兰并非“带容量奖金的现货套利市场”，而是“带市场化叠加的容量市场”。由于系统规模小、风电主导且互联薄弱，它对可靠的折减后容量给付极为优厚；而由于集中调度与系统限制约束了电池被允许的操作，它对交易的给付相对微薄。因此储能经济性对折减系数表与并网协议的依赖，远高于对价格曲线的依赖。'] },
      { t:'why', text:['Two facts do the work. Dispatch-down of ' + fmt1(O.windDispatchDownPct) + '% and a constraint bill of ' + fmtCM(O.constraintCostM * 1e6) + ' a year quantify a problem storage can solve — so system need is priced, not merely stated. But ' + fmtN(O.greenlinkMW + O.celticMW) + ' MW of new interconnection arriving into a system of this size will ease exactly the scarcity that creates the spreads. The Irish investment problem is therefore sequencing: capture the capacity value, which is contracted and rising, while assuming the merchant value narrows as the island couples more tightly to Britain and France.',
        '此处两项事实最为关键。' + fmt1(O.windDispatchDownPct) + '%的限发比例与每年' + fmtCM(O.constraintCostM * 1e6) + '的约束账单，量化了一个储能能够解决的问题 — 因此系统需求是被定价的，而非仅被陈述。但在如此规模的系统中新增' + fmtN(O.greenlinkMW + O.celticMW) + 'MW互联能力，恰恰会缓解形成价差的那种稀缺。因此爱尔兰的投资难题在于时序：捕获已合同化且上升的容量价值，同时假设随着本岛与英国、法国耦合加深，市场化价值将收窄。'],
        sig:['Capacity is contracted; spreads are borrowed','容量是合同化的，价差是借来的'] },
    ] },

    { t:'card', title:['How Irish storage revenue was re-pointed — three times in a decade','爱尔兰储能收入的三次重新定向 — 十年间'], badges:['official','public'], blocks:[
      { t:'band-story', b:['Why this history is underwriting-relevant','这段历史为何与承销相关'],
        text:['Ireland built a storage fleet to solve a frequency and inertia problem, then changed the market twice underneath it. The 0.5–1h assets built for DS3 are still operating, still qualified, and structurally unable to earn from the capacity mechanism that now dominates the revenue stack. Rule vintage, not asset age, is what depreciated.',
              '爱尔兰为解决频率与惯量问题建设了储能机组，随后又两次改变了其下的市场规则。为DS3建设的0.5–1小时资产至今仍在运行、仍具资格，却在结构上无法从如今主导收入结构的容量机制中获利。真正折旧的是规则版本，而非资产年限。'] },
      { t:'timeline', items:[
        { y:'2007–2018', t:['The all-island market and the wind problem','全岛市场与风电难题'],
          p:['The Single Electricity Market unified the island under a gross-pool design with central scheduling. Rapid onshore wind growth then created a system-stability constraint rather than an energy constraint: the island could generate more renewable power than it could safely absorb.',
             '单一电力市场以总电量池设计与集中调度统一了全岛。随后陆上风电快速增长带来的是系统稳定性约束而非电量约束：本岛可发出的可再生电力超过其能安全消纳的水平。'],
          i:['The founding constraint is physical, not commercial. That is why Irish storage policy has always paid for system capability first and energy arbitrage second.',
             '本市场的初始约束是物理性的而非商业性的。这正是爱尔兰储能政策始终优先为系统能力付费、其次才为电能量套利付费的原因。'] },
        { y:'2016–2022', t:['DS3 creates a storage industry','DS3催生储能产业'],
          p:['The DS3 programme procured fourteen system services with volume and scalar payments, and made 0.5–1 hour batteries highly profitable. Essentially the whole existing Irish fleet was specified against DS3 tariffs.',
             'DS3计划采购十四项系统服务并采用容量与系数支付，使0.5–1小时电池高度盈利。爱尔兰现有机组几乎全部是按DS3费率规格建设的。'],
          i:['First re-pointing, and the origin of today’s stranded-design problem. A fleet optimised for a tariff cannot pivot when the tariff is replaced by an auction.',
             '第一次重新定向，也是今天“设计搁浅”问题的起源。为固定费率优化的机组，在费率被拍卖取代时无法转向。'] },
        { y:'2022–2026', t:['DS3 revenue falls more than 40%','DS3收入下降逾40%'],
          p:['Tariff and scalar reductions, plus a large increase in qualified supply, cut effective DS3 revenue by more than ' + O.ds3DeclinePct + '% from its peak. The regulated arrangements now run to a long-stop of ' + O.ds3LongStop + '.',
             '费率与系数下调，加上合格供给大幅增加，使DS3有效收入较峰值下降超过' + O.ds3DeclinePct + '%。现行监管安排的最终截止日为' + O.ds3LongStop + '。'],
          i:['Second re-pointing. The pattern matches every other European market: batteries capture the ancillary market almost completely, then the revenue collapses within three to four years.',
             '第二次重新定向。其模式与其他所有欧洲市场一致：电池几乎完全占据辅助服务市场，随后收入在三至四年内崩塌。'] },
        { y:'2024–2026', t:['Capacity becomes the primary revenue line','容量成为主要收入来源'],
          p:['Successive T-4 auctions cleared at rising prices, reaching ' + fmtC(O.crmPrice) + '/kW de-rated/yr for DY ' + O.crmDY + ' with ' + fmtN(O.crmAwardedMW) + ' MW de-rated procured — a level at which capacity can be the dominant revenue line for a 4-hour asset.',
             '连续几轮T-4拍卖出清价持续上升，至交付年' + O.crmDY + '达到' + fmtC(O.crmPrice) + '/kW折减/年，采购折减容量' + fmtN(O.crmAwardedMW) + 'MW — 在该水平下，容量可成为4小时资产的主导收入来源。'],
          i:['Third re-pointing, and this one rewards duration and firmness rather than response speed. The de-rating table replaced the DS3 tariff table as the document that determines asset design.',
             '第三次重新定向，这一次奖励的是时长与可靠性而非响应速度。决定资产设计的文件已由DS3费率表变为折减系数表。'] },
        { y:'Nov 2025', t:['Batteries are properly scheduled','电池获得正式调度地位'],
          p:['The SDP-02 scheduling and dispatch integration went live on ' + O.sdp02Live + ', allowing batteries to charge, trade and be dispatched far more actively within the central scheduling framework.',
             'SDP-02调度与派遣整合于' + O.sdp02Live + '生效，使电池得以在集中调度框架内更主动地充电、交易并接受调度。'],
          i:['This is what made merchant revenue real in Ireland rather than theoretical. It also means pre-2026 Irish trading history understates what a modern asset can do — the one case where legacy data is too pessimistic.',
             '这使爱尔兰的市场化收入由理论转为现实。同时也意味着2026年之前的爱尔兰交易历史低估了现代资产的能力 — 这是既往数据过于悲观的唯一情形。'] },
        { y:'2026–2028', t:['FASS, DASSA and interconnection all land together','FASS、DASSA与互联同期落地'],
          p:['Competitive day-ahead procurement of system services is due to replace administered DS3 tariffs, while the Celtic Interconnector (' + fmtN(O.celticMW) + ' MW to France) is expected in 2028 alongside Greenlink (' + fmtN(O.greenlinkMW) + ' MW to Wales, operational 2025).',
             '系统服务的竞争性日前采购将取代行政化的DS3费率；同时Celtic互联（至法国' + fmtN(O.celticMW) + 'MW）预计于2028年投运，Greenlink（至威尔士' + fmtN(O.greenlinkMW) + 'MW）已于2025年运行。'],
          i:['Two independent compressions arriving in the same window: services repriced by auction, and spreads narrowed by coupling. A 2028–2030 COD faces both, which is precisely why capacity value has to carry the case.',
             '两种相互独立的压缩在同一窗口内到来：服务被拍卖重新定价，价差因耦合而收窄。2028–2030年投运的项目同时面对两者，这正是必须由容量价值支撑投资逻辑的原因。'] },
      ] },
      { t:'why', text:['Three re-pointings in a decade, each roughly four years apart, and each stranding the design that was optimal for the previous era. That is the base rate to underwrite against. Two practical conclusions: record the de-rating vintage and the services regime used in every model, and treat the DASSA go-live and the next capacity auction as scheduled events with a P&L consequence rather than as policy background.',
        '十年内三次重新定向，间隔约四年，且每次都令上一时代的最优设计搁浅。这就是承销时应参照的基准频率。两项实务结论：在每个模型中记录所用的折减系数版本与服务机制；并将DASSA上线与下一次容量拍卖视为具有损益后果的既定事件，而非政策背景。'],
        sig:['Re-pointed roughly every four years','大致每四年重新定向一次'] },
      { t:'g2', cards:[
        { title:['Capacity clearing prices by delivery year','各交付年度容量出清价'], badges:['official','verify'], blocks:[
          { t:'line', cfg:{ xs: M.crmYears, yfmt: v => fmtC(v), h: 200, ymin: 0,
            series:[{ name:['T-4 clearing price (€/kW de-rated/yr)','T-4出清价（€/kW折减/年）'], color:'var(--s1)', vals: M.crmPriceSeries }] } },
          { t:'why', text:['The price has risen every year in this series, tripling across five delivery years. That is the mirror image of GB, where the same instrument halved — and the reason is structural rather than cyclical: a small island system with retiring thermal plant, rising data-centre demand and limited interconnection has to pay whatever it takes to procure firm capacity. Do not extrapolate the trend, but do underwrite the mechanism as the primary revenue line rather than a top-up.',
            '在该序列中价格逐年上升，五个交付年度内涨至三倍。这与英国恰好相反 — 同一工具在英国腰斩 — 其原因是结构性而非周期性的：一个火电退役、数据中心需求上升且互联有限的小岛系统，必须付出任何必要的代价来采购可靠容量。不应外推该趋势，但应将该机制作为主要收入来源而非补充项进行承销。'],
            sig:['Structural, not cyclical, price direction','价格方向是结构性的，而非周期性'] },
        ] },
        { title:['De-rating factors by duration class','按时长档位的折减系数'], badges:['illus','verify'], blocks:[
          { t:'line', cfg:{ xs: M.derateHours.map(x => x + 'h'), yfmt: v => fmtPct(v * 100, 0), ymin: 0, h: 200,
            series:[{ name:['De-rating factor','折减系数'], color:'var(--s1)', vals: M.derateHours.map(hh => M.deratingCurve[hh]) }] } },
          { t:'why', text:['The curve is far flatter at the short end than GB’s — ' + fmtPct(M.deratingCurve[2] * 100, 0) + ' at 2h against GB’s ' + fmtPct(0.22 * 100, 0) + ' — because a smaller, tighter system values a short burst of firm power more highly. Combined with a clearing price several times GB’s, this is why the same physical battery is a capacity asset in Ireland and a trading asset in Britain. Verify the factor against the specific auction vintage before it enters a model; these are indicative seed values.',
            '该曲线在短时端远比英国平缓 — 2小时为' + fmtPct(M.deratingCurve[2] * 100, 0) + '，而英国为' + fmtPct(0.22 * 100, 0) + ' — 因为规模更小、更紧张的系统对短时可靠功率的估值更高。再叠加数倍于英国的出清价，这正是同一台物理电池在爱尔兰是容量资产、在英国是交易资产的原因。此为示意性种子数值，进入模型前须以具体拍卖年份核验。'],
            sig:['Flatter curve, higher price, different asset','曲线更平、价格更高、资产性质不同'] },
        ] },
      ] },
      { t:'src', src: SRC.semo, use:['Capacity auction clearing prices, awarded capacity and de-rating bands','容量拍卖出清价、中标容量与折减档位'] },
    ] },

    { t:'card', title:['Demand growth — the reason the capacity price keeps clearing high','需求增长 — 容量价格持续高位出清的原因'], badges:['official','forecast'], blocks:[
      { t:'bar', cfg:{ xs: M.demandYears, mode:'stack', bw: 44, yfmt: v => fmt1(v) + ' TWh', h: 260,
        series:[
          { name:['Data centres','数据中心'], color:'var(--s6)', vals: M.demandDC },
          { name:['All other demand','其他需求'], color:'var(--s1)', vals: M.demandOther },
        ] } },
      { t:'kpis', items:[
        { l:['Data-centre share, 2025','数据中心占比，2025'], v:O.dcSharePct + '<small>%</small>', d:[fmtN(O.dcGWh2025) + ' GWh of metered electricity','计量用电' + fmtN(O.dcGWh2025) + 'GWh'], b:['official'] },
        { l:['Data-centre demand growth to 2030','至2030年数据中心需求增长'], v:'+' + fmtPct((M.demandDC[4] / M.demandDC[2] - 1) * 100, 0), d:['illustrative projection','示例预测'], b:['forecast'] },
        { l:['All-other demand growth to 2030','至2030年其他需求增长'], v:'+' + fmtPct((M.demandOther[4] / M.demandOther[2] - 1) * 100, 0), d:['data centres are the marginal load','数据中心是边际负荷'], b:['forecast'] },
      ] },
      { t:'why', text:['Data centres are ' + O.dcSharePct + '% of metered electricity and account for most of the forecast growth, which is why the capacity mechanism keeps clearing higher: the system operator must procure firm capacity for a load that is large, growing and largely inflexible. For a storage investor this is the demand-side underpinning of the whole case — but it is also a concentration risk, because a policy change on data-centre connections would remove the growth without removing the pipeline.',
        '数据中心占计量用电的' + O.dcSharePct + '%，并贡献了预测增长的大部分，这正是容量机制持续走高出清的原因：系统运营方必须为一个规模大、增长快且基本缺乏灵活性的负荷采购可靠容量。对储能投资人而言，这是整个投资逻辑的需求侧支撑 — 但同时也是集中度风险，因为针对数据中心并网的政策变动会移除增长，却不会移除管线。'],
        sig:['One load class underpins the case','单一负荷类别支撑全部逻辑'] },
      { t:'src', src: SRC.cso, use:['Data-centre metered electricity consumption and share of total','数据中心计量用电量及其占比'] },
    ] },

    { t:'card', title:['Who owns Irish storage — five strategies competing for the same de-rated MW','谁持有爱尔兰储能 — 五类策略争夺同一批折减MW'], badges:['public','illus'], live:false, blocks:[
      { t:'players', items:[
        { type:['Utility / vertically integrated','公用事业与纵向一体化'], n:['State and incumbent suppliers with generation books','拥有发电组合的国有及在位供电商'], met:'balance-sheet funded',
          p:['Build and hold alongside a supply business, so storage hedges an existing portfolio. They can bid capacity aggressively because the asset has internal value beyond its standalone return.',
             '在自有售电业务旁建设并持有，使储能对冲既有组合。因资产具备超出独立收益的内部价值，其可在容量拍卖中激进报价。'] },
        { type:['Global infra platform','全球基础设施平台'], n:['Pension- and insurance-backed infrastructure managers','养老金与保险支持的基础设施管理人'], met:'multi-project mandates',
          p:['Acquire projects with a capacity award in hand. The award is what makes an Irish asset financeable, so platform buyers concentrate on the post-auction cohort rather than on development risk.',
             '收购已取得容量中标的项目。中标是爱尔兰资产可融资的前提，因此平台型买家集中于拍卖之后的批次，而非承担开发风险。'] },
        { type:['Specialist storage developer','专业储能开发商'], n:['Developers holding connection queue positions','持有并网队列位置的开发商'], met:'connection-led',
          p:['The scarce asset in Ireland is an executed connection agreement with adequate MEC and MIC. Developers who secured early batch positions monetise that scarcity rather than construction capability.',
             '爱尔兰稀缺的资产是一份MEC与MIC均充足的已签并网协议。取得早期批次位置的开发商变现的是这一稀缺性，而非建设能力。'] },
        { type:['Co-located renewable owner','共址新能源业主'], n:['Wind and solar owners adding storage behind the same connection','在同一并网点后加建储能的风光业主'], met:'shared MEC',
          p:['Reuse an existing connection to avoid the queue entirely and to monetise dispatch-down that the renewable asset would otherwise lose. The strongest structural position in the market.',
             '复用既有并网点以完全绕开排队，并将新能源资产原本损失的限发电量变现。这是市场中最强的结构性地位。'] },
        { type:['Optimiser / route-to-market','优化商与售电路径'], n:['Trading firms supplying scheduling and market access','提供调度与市场准入的交易机构'], met:'fee + share',
          p:['Central scheduling makes market access a specialist function. Since SDP-02 the gap between a well-parameterised unit and a poorly-parameterised one has widened materially.',
             '集中调度使市场准入成为专业职能。自SDP-02以来，参数设置良好与设置不当的机组之间差距已显著扩大。'] },
      ] },
      { t:'note', text:['Concentration read: Ireland is concentrated on connection rights rather than on capital or capability. The binding scarcity is an executed connection agreement with adequate MEC and MIC — which is why co-location behind an existing renewable connection is structurally advantaged and why queue positions trade at a premium.',
        '集中度解读：爱尔兰的集中体现在并网权利，而非资本或能力。关键稀缺是一份MEC与MIC均充足的已签并网协议 — 这正是在既有新能源并网点后共址具备结构性优势的原因，也是队列位置存在溢价的原因。'] },
      { t:'why', text:['For a new entrant this determines strategy before it determines price. Buying a project with an executed connection agreement and a capacity award costs more per MW but removes the two risks that actually kill Irish projects. Developing from a batch position is cheaper and is a genuine business, but it is a connection business rather than an energy business, and it should be underwritten with development-stage return requirements.',
        '对新进入者而言，这一点在决定价格之前先决定策略。收购已具备已签并网协议与容量中标的项目，每MW成本更高，但消除了真正会导致爱尔兰项目失败的两项风险。从批次位置自行开发成本更低且是真实业务，但那是并网业务而非能源业务，应按开发阶段的收益要求进行承销。'],
        sig:['Buy the connection, not the megawatts','买的是并网，而非兆瓦'] },
    ] },

    { t:'card', title:['Exit channels — how capital recycles out of Irish storage','退出渠道 — 资本如何从爱尔兰储能中回收'], badges:['public'], live:false, blocks:[
      { t:'exits', items:[
        { n:['1 · Sell at capacity award','1 · 取得容量中标后出售'], w:['The dominant value inflection','主要价值跃升点'],
          d:['A capacity award converts a development asset into a contracted one with ' + O.crmAgreementYears + ' years of visible revenue. Most Irish transactions cluster immediately after an auction result.',
             '容量中标使开发资产转变为拥有' + O.crmAgreementYears + '年可见收入的合同化资产。爱尔兰的多数交易都集中在拍卖结果公布之后。'],
          c:['Value inflects at award, not at connection offer and not at planning consent.','价值在中标时跃升，而非在并网报价或规划许可时。'] },
        { n:['2 · Co-location sell-down','2 · 共址项目股权出售'], w:['Renewable owner-led','新能源业主主导'],
          d:['A wind or solar owner adds storage behind an existing connection, then sells a stake in the combined asset. The buyer is acquiring dispatch-down capture plus capacity revenue without queue risk.',
             '风光业主在既有并网点后加建储能，再出售合并资产的股权。买方获得的是限发电量捕获与容量收入，且不承担排队风险。'],
          c:['The scarcest structure in the market, because it bypasses the binding constraint.','市场中最稀缺的结构，因为它绕过了关键约束。'] },
        { n:['3 · Platform aggregation','3 · 平台化聚合'], w:['Manager-led','管理人主导'],
          d:['Aggregate several awarded projects into an all-island platform, then sell a stake or raise institutional capital. Scale matters here because the market is small and diligence cost per asset is high.',
             '将多个已中标项目聚合为全岛平台，再出售股权或募集机构资金。由于市场规模小、单资产尽调成本高，规模在此至关重要。'],
          c:['Cross-jurisdiction complexity: ROI and NI have different regulators and different connection processes.','跨辖区复杂性：爱尔兰共和国与北爱尔兰监管方不同，并网流程亦不同。'] },
        { n:['4 · Refinancing','4 · 再融资'], w:['Post-COD','投运后'],
          d:['With a capacity agreement in place, lenders will size against contracted revenue and refinance development equity at materially lower cost.',
             '在容量协议到位后，贷款人可依据合同化收入安排规模，并以显著更低的成本置换开发期股权。'],
          c:['The capacity agreement is the credit; the merchant line is the equity return.','容量协议构成信用基础；市场化收入构成股权回报。'] },
      ] },
      { t:'why', text:['Every route prices the same thing: a capacity award. That is unusually clean compared with GB, where value is spread across queue position, consent, trading capability and contracted structures. The practical implication is that Irish development is a binary business — the auction result decides most of the value — so development capital should be sized to survive one failed auction cycle, and acquisition capital should not pay development pricing for a pre-auction asset.',
        '每条路径定价的都是同一件事：容量中标。与英国相比这异常清晰 — 在英国价值分散于队列位置、规划许可、交易能力与合同结构之中。实务含义是：爱尔兰的开发是二元业务 — 拍卖结果决定大部分价值 — 因此开发资本的规模应能承受一个失败的拍卖周期，而收购资本不应为拍卖前的资产支付开发期定价。'],
        sig:['The auction result is the exit','拍卖结果即是退出'] },
    ] },

    { t:'g2', cards:[
      { title:['Near-term outlook — 2026 to 2029: two compressions, one support','近期展望 — 2026至2029：两项压缩，一项支撑'], badges:['official','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2026–2027','2026–2027'], h:['FASS transition','FASS过渡'], p:['Administered DS3 tariffs give way to competitive procurement with a long-stop of ' + O.ds3LongStop + '. Legacy short-duration assets lose their primary revenue line.','行政化DS3费率让位于竞争性采购，最终截止日为' + O.ds3LongStop + '。既往短时资产失去其主要收入来源。'] },
          { yr:['2027–2028','2027–2028'], h:['Celtic Interconnector','Celtic互联'], p:[fmtN(O.celticMW) + ' MW of coupling to France reduces both dispatch-down and spread width. Adequacy improves; merchant scarcity narrows.','与法国' + fmtN(O.celticMW) + 'MW的耦合同时降低限发与价差宽度。充裕度改善，市场化稀缺收窄。'] },
          { yr:['2028–2029','2028–2029'], h:['Capacity carries the case','容量承载投资逻辑'], p:['With services repriced and spreads narrower, the de-rated capacity payment becomes the dominant and most bankable revenue line for a 4-hour asset.','在服务被重新定价、价差收窄的情况下，折减后容量付费成为4小时资产最主要且最可融资的收入来源。'] },
        ] },
        { t:'why', text:['Two independent compressions and one support arrive in the same window, and the sponsor controls none of them. That asymmetry is the argument for building to the capacity mechanism: it is the only line that is contracted, rising and directly influenced by asset design. Anything that depends on spread width or services tariffs should be sized as equity upside.',
          '两项相互独立的压缩与一项支撑在同一窗口内到来，而发起人对三者均无控制力。这一不对称正是“按容量机制建设”的理由：它是唯一已合同化、持续上升且直接受资产设计影响的收入线。任何依赖价差宽度或服务费率的收入，均应按股权上行的规模承担。'],
          sig:['Build to the only contracted line','按唯一合同化收入线建设'] },
      ] },
      { title:['Long-term outlook — 2030 to 2035: adequacy, ambition and augmentation','长期展望 — 2030至2035：充裕度、政策目标与增容'], badges:['official','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2030','2030'], h:['Storage ambition year','储能目标年'], p:['Policy points to at least ' + fmt1(O.storageAmbitionMW / 1000) + ' GW of storage and an SNSP direction of ' + O.snsp2030 + '%, against roughly ' + fmt1(O.fleetMW / 1000) + ' GW operating today.','政策指向至少' + fmt1(O.storageAmbitionMW / 1000) + 'GW储能及' + O.snsp2030 + '%的非同步渗透率方向，而当前在运约' + fmt1(O.fleetMW / 1000) + 'GW。'] },
          { yr:['2031–2033','2031–2033'], h:['LDES procurement','长时储能采购'], p:['A distinct long-duration procurement concept of around ' + fmtN(O.ldesMW) + ' MW / ' + fmtN(O.ldesMWh) + ' MWh remains at consultation stage; an award would create a separate contracted asset class.','约' + fmtN(O.ldesMW) + 'MW/' + fmtN(O.ldesMWh) + 'MWh的独立长时采购概念仍处征询阶段；一旦授予将形成独立的合同化资产类别。'] },
          { yr:['2033–2035','2033–2035'], h:['Fleet replacement and augmentation','机组置换与增容'], p:['The DS3-era 0.5–1h fleet reaches end of warranted life with de-rating factors that no longer support it. Sites with MEC, MIC and planning headroom capture the replacement cycle.','DS3时代的0.5–1小时机组达到质保寿命终点，而折减系数已不再支持其经济性。具备MEC、MIC与规划裕度的场址将获得置换周期的机会。'] },
        ] },
        { t:'why', text:['The long-run case rests on a gap that is stated in policy rather than inferred: roughly ' + fmt1((O.storageAmbitionMW - O.fleetMW) / 1000) + ' GW of additional storage against a pipeline that is nominally ' + fmt1(O.pipelineMW / 1000) + ' GW but constrained by connection capacity rather than by capital. Whether the gap closes depends on the connection process, not on the investment case — which is the single most important thing to understand before deploying development capital in Ireland.',
          '长期逻辑基于一个由政策明示而非推断得出的缺口：需新增约' + fmt1((O.storageAmbitionMW - O.fleetMW) / 1000) + 'GW储能，而管线名义上有' + fmt1(O.pipelineMW / 1000) + 'GW，其约束在于并网容量而非资本。缺口能否弥合取决于并网流程而非投资逻辑 — 这是在爱尔兰投入开发资本前必须理解的最重要一点。'],
          sig:['Connections, not capital, close the gap','弥合缺口的是并网而非资本'] },
      ] },
    ] },

    { t:'card', title:['What breaks this storyline — three monitored uncertainties','哪些因素会打破该叙事 — 三项须持续监测的不确定性'], badges:['public','calc'], blocks:[
      { t:'table', head:[['Uncertainty','不确定性'],['Why it matters','影响机理'],['Monitoring trigger','监测触发条件']], rows:[
        [{b:['DASSA design and parameters','DASSA设计与参数']},
         ['A competitive day-ahead auction replaces administered tariffs. The clearing outcome determines whether the services line survives at any level for short-duration assets.','竞争性日前拍卖取代行政费率。出清结果决定短时资产的服务收入能否在任何水平上存续。'],
         ['Publication of DASSA parameters or a go-live date change','DASSA参数发布或上线日期变更']],
        [{b:['Capacity auction supply','容量拍卖供给']},
         ['The clearing price has tripled because supply was tight. A single large entry cohort, or a data-centre connection policy change, would reverse that quickly.','出清价上涨至三倍是因为供给偏紧。一批大规模新进入者，或数据中心并网政策的变动，都会迅速逆转这一态势。'],
         ['Qualification volumes for the next T-4 auction','下一次T-4拍卖的资格认证容量']],
        [{b:['Interconnection and coupling','互联与耦合']},
         ['Celtic and Greenlink improve adequacy — which reduces the capacity requirement — while simultaneously narrowing spreads. Both effects reduce Irish storage revenue.','Celtic与Greenlink改善充裕度 — 从而降低容量需求 — 同时收窄价差。两种效应均会降低爱尔兰储能收入。'],
         ['Any change to the Celtic commissioning date','Celtic投运日期的任何变动']],
      ] },
      { t:'why', text:['All three are two-sided and none is diversifiable within Ireland; two of them push the same way. That is the argument for structuring rather than forecasting: a FASS re-opener, a degradation covenant protecting the de-rating band, and an explicit Reliability Option stress case together convert three unforecastable variables into three negotiated positions. A model that picks a central case for all three is silent on the largest source of variance.',
        '三者均为双向风险，且在爱尔兰境内均不可分散；其中两项作用方向相同。这正是“以结构应对而非以预测应对”的理由：FASS重议条款、保护折减档位的衰减契约，以及显式的可靠性期权压力情景，三者结合可将三个无法预测的变量转化为三项经过谈判的立场。若模型对三者均取中性情景，即是对最大方差来源保持沉默。'],
        sig:['Structure it, don’t forecast it','以结构应对，而非预测'] },
    ] },

    { t:'card', title:['Bridge to the detailed dashboard — the investor’s question map','进入详细看板 — 投资人的问题地图'], badges:['calc'], blocks:[
      { t:'walk', items:[
        ['03', ['Capacity Mechanism','容量机制'], ['How much de-rated MW will actually be paid?','实际获得付费的折减MW有多少？'], 'capacity'],
        ['04', ['Wholesale & Balancing','批发与平衡'], ['How much of the published spread is executable?','公布价差中有多少可执行？'], 'energy'],
        ['05', ['DS3, FASS & DASSA','DS3、FASS与DASSA'], ['How far can this line still fall?','这项收入还能下跌多少？'], 'services'],
        ['06', ['Duration & LDES','时长与长时储能'], ['Is the fourth hour worth its capex?','第4小时是否值其造价？'], 'duration'],
        ['07', ['Pipeline','项目管线'], ['Who else arrives in my COD year?','投运年度还有谁会到场？'], 'pipeline'],
        ['08', ['Grid & Connection','并网'], ['Does the project have MEC and MIC in an executed agreement?','项目是否在已签协议中载明MEC与MIC？'], 'grid'],
      ] },
    ] },
  ] };
};

// ============================== CAPACITY MECHANISM ==============================
SEC_B.capacity = function (){
  return {
  head: ['Capacity Mechanism — how much de-rated MW will actually be paid, and on what terms?','容量机制 — 实际获得付费的折减MW有多少？条件为何？'],
  cap: ['The Irish capacity payment is large enough to be the primary revenue line, which changes the underwriting frame entirely. But it is a Reliability Option, not an annuity: the unit receives a fixed payment and owes difference payments when the market price exceeds the strike.',
        '爱尔兰的容量付费规模足以成为主要收入来源，这完全改变了承销框架。但它是可靠性期权而非年金：机组获得固定付费，并在市场价格高于执行价时负有差价支付义务。'],
  blocks: [
    { t:'card', mt:false, title:['Clearing price and awarded capacity','出清价与中标容量'], badges:['official','verify'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['T-4 clearing price (DY ' + O.crmDY + ')','T-4出清价（交付年' + O.crmDY + '）'], v:fmtC(O.crmPrice) + '<small>/kW de-rated/yr</small>', b:['official','verify'] },
        { l:['Awarded de-rated capacity','中标折减容量'], v:fmtN(O.crmAwardedMW) + '<small> MW</small>', d:['across all technologies','涵盖全部技术类型'], b:['official','verify'] },
        { l:['Five-year price trajectory','五年价格轨迹'], v:fmtC(M.crmPriceSeries[0]) + ' → ' + fmtC(O.crmPrice), d:['+' + fmtPct((O.crmPrice / M.crmPriceSeries[0] - 1) * 100, 0) + ' across five delivery years','五个交付年度内上升' + fmtPct((O.crmPrice / M.crmPriceSeries[0] - 1) * 100, 0)], b:['calc'] },
        { l:['New-capacity agreement length','新建容量协议年限'], v:O.crmAgreementYears + '<small> yr</small>', d:['verify the unit class before modelling','建模前须核验机组类别'], b:['verify'] },
      ] },
      { t:'line', cfg:{ xs: M.crmYears, yfmt: v => fmtC(v), h: 240, ymin: 0,
        series:[{ name:['T-4 clearing price (€/kW de-rated/yr)','T-4出清价（€/kW折减/年）'], color:'var(--s1)', vals: M.crmPriceSeries }],
        ann:[{ si: 0, i: 4, text: fmtC(O.crmPrice) }] } },
      { t:'why', text:['The price has risen in every delivery year in this series, which is the opposite of the GB pattern and reflects a structurally tight island system rather than a bidding cycle. Two underwriting rules follow: do not extrapolate the trend upward, because a single large entry cohort can reverse it; and do underwrite the mechanism as the primary revenue line, because at ' + fmtC(O.crmPrice) + '/kW de-rated/yr no other line in the Irish stack is comparable in size or certainty.',
        '在该序列中每个交付年度价格均上升，与英国模式相反，反映的是结构性偏紧的岛屿系统而非投标周期。由此得出两条承销原则：不应向上外推该趋势，因为一批大规模新进入者即可将其逆转；但应将该机制作为主要收入来源承销，因为在' + fmtC(O.crmPrice) + '/kW折减/年的水平上，爱尔兰收入结构中没有任何其他收入线在规模或确定性上可与之相比。'],
        sig:['Primary line, but do not extrapolate','主要收入线，但不可外推'] },
      { t:'src', src: SRC.semo, use:['Capacity auction clearing prices and awarded de-rated capacity','容量拍卖出清价与中标折减容量'] },
    ] },

    { t:'card', title:['De-rating by duration — capacity revenue per nameplate MW','按时长的折减 — 每铭牌MW容量收入'], badges:['illus','verify'], live:true, blocks:[
      { t:'table', head:[['Duration','时长'],['De-rating factor','折减系数'],['Capacity revenue per nameplate MW','每铭牌MW容量收入'],['Uplift vs previous class','较上一档位增益']], num:[1,2,3],
        rows: M.derateHours.map((hh, i) => {
          const prev = i ? M.derateHours[i - 1] : null;
          return [{ b: [hh + 'h', hh + '小时'] }, fmtPct(M.deratingCurve[hh] * 100, 0), fmtCk(perNameplate(hh)),
            prev == null ? '—' : '+' + fmtCk(perNameplate(hh) - perNameplate(prev))];
        }) },
      { t:'bar', cfg:{ xs: M.derateHours.map(x => x + 'h'), bw: 34, yfmt: v => fmtCk(v), labels: false, h: 250,
        series:[{ name:['Capacity revenue per nameplate MW','每铭牌MW容量收入'], color:'var(--s1)', vals: M.derateHours.map(hh => perNameplate(hh)) }] } },
      { t:'note', b:['Vintage discipline: ','版本纪律：'],
        text:['These are indicative seed values pending replacement with the published de-rating table for the exact auction the project will enter. A factor from the wrong vintage misstates the single largest revenue line in the Irish stack.',
              '此为示意性种子数值，须以项目实际参与拍卖所对应的官方公布折减表替换。使用错误版本的系数将误判爱尔兰收入结构中最大的单一收入线。'] },
      { t:'why', text:['The uplift column is the duration decision in one place. Moving 2h → 4h adds ' + fmtCk(perNameplate(4) - perNameplate(2)) + '/MW/yr of capacity revenue; 4h → 6h adds only ' + fmtCk(perNameplate(6) - perNameplate(4)) + ' and 6h → 8h just ' + fmtCk(perNameplate(8) - perNameplate(6)) + '. The mechanism pays generously up to four hours and flattens sharply after, which is why the Irish new-build archetype is a 4-hour asset and why anything longer needs a separate LDES justification rather than a capacity one.',
        '增益列把时长决策集中于一处。由2小时增至4小时可增加' + fmtCk(perNameplate(4) - perNameplate(2)) + '/MW/年的容量收入；由4小时增至6小时仅增加' + fmtCk(perNameplate(6) - perNameplate(4)) + '，由6小时增至8小时仅' + fmtCk(perNameplate(8) - perNameplate(6)) + '。该机制在四小时以内给付慷慨，其后迅速趋平 — 这正是爱尔兰新建原型为4小时资产的原因，也是更长时长必须依靠独立的长时储能理由而非容量理由的原因。'],
        sig:['The mechanism pays up to four hours','该机制付费至四小时为止'] },
    ] },

    { t:'card', title:['Reliability Option — the capacity payment is a hedged short position','可靠性期权 — 容量付费是对冲后的空头头寸'], badges:['official','calc'], live:false, blocks:[
      { t:'ladder', items:[
        { n:['1 · Fixed payment received','1 · 收取固定付费'], d:['The unit receives the clearing price on its awarded de-rated MW for the agreement term, regardless of dispatch.','机组在协议期内按中标折减MW收取出清价，与是否被调度无关。'] },
        { n:['2 · Strike price defined','2 · 设定执行价'], d:['A reference market price above which the obligation activates. It is set administratively, not negotiated.','设定一个参考市场价格，超过该价格即触发义务。该价格由行政确定，不可协商。'] },
        { n:['3 · Difference payment owed','3 · 负有差价支付义务'], d:['When the market price exceeds the strike, the unit pays the difference on its awarded capacity — whether or not it is generating.','当市场价格高于执行价时，机组须就其中标容量支付差价 — 无论其是否在发电。'] },
        { n:['4 · Physical hedge required','4 · 需要物理对冲'], d:['The only protection is to be generating when the price is high, which requires energy in the battery — a duration and state-of-charge problem.','唯一的保护是在高电价时段发电，这需要电池中有电量 — 属时长与荷电状态问题。'] },
        { n:['5 · Stop-loss applies','5 · 适用止损上限'], d:['Exposure is capped over defined periods, but the cap is a multiple of annual capacity revenue.','敞口在约定期间内设有上限，但该上限为年度容量收入的数倍。'] },
      ] },
      { t:'warn', text:['A short-duration unit that is empty during a sustained high-price event receives the fixed payment and owes the difference payment simultaneously. Model this explicitly for any asset whose duration sits near the bottom of its de-rating band — it is the mechanism by which an Irish capacity award turns from an asset into a liability.',
        '短时机组若在持续高电价事件中处于放空状态，将同时收取固定付费并负有差价支付义务。对时长处于其折减档位下沿的资产，须显式建模 — 这正是爱尔兰容量中标由资产转变为负债的机制。'] },
      { t:'why', text:['This is the most important structural feature of the Irish market and the one most often omitted from a first-pass model, because the obligation only bites in the years that otherwise look best. The correct treatment is to model the capacity line net of a stressed difference-payment scenario, and to treat duration and state-of-charge management as risk controls rather than revenue optimisation. It is also the second, quantified reason the fourth hour is worth paying for.',
        '这是爱尔兰市场最重要的结构性特征，也是首轮模型中最常被遗漏的一项 — 因为该义务只在其他方面看起来最好的年份里产生影响。正确处理方式是：按压力情景下的差价支付净额建模容量收入，并将时长与荷电状态管理视为风险控制而非收入优化。这同时也是第4小时值得付费的第二个、可量化的理由。'],
        sig:['Empty at peak = pay twice','高峰放空 = 双重损失'] },
    ] },

    { t:'card', title:['Nameplate → paid capacity bridge (100 MW / 4h example)','铭牌至获付容量桥（100MW/4小时示例）'], badges:['calc','illus'], live:true, blocks:[
      { t:'wf', cfg:{ yfmt: v => fmtN(v) + ' MW', h: 270, zeroBase: true, steps: [
        { l:['Nameplate MW','铭牌MW'], v: 100, t:'start' },
        { l:['− contracted MEC limit','− 合同MEC限制'], v: -0, t:'d' },
        { l:['− usable AC fraction & auxiliaries','− 可用交流侧比例与站用电'], v: -8, t:'d' },
        { l:['× de-rating factor at 4h','×4小时折减系数'], v: -31, t:'d' },
        { l:['Paid de-rated MW','获付费折减MW'], v: 61, t:'total' },
      ] } },
      { t:'why', text:['On a 4-hour design, 100 MW of nameplate earns capacity revenue on about 61 MW — a far higher conversion than GB’s 21 MW at 2 hours, and the reason the Irish stack can be capacity-led. The step that a sponsor controls is the middle one: usable AC fraction and auxiliary load. It looks small at 8 MW but at ' + fmtC(O.crmPrice) + '/kW/yr it is worth roughly ' + fmtCM(8 * 1000 * O.crmPrice) + ' a year, which is why AC-side design deserves the same scrutiny as cell selection.',
        '在4小时设计下，100MW铭牌容量可就约61MW获得容量收入 — 转化率远高于英国2小时下的21MW，这也是爱尔兰收入结构可由容量主导的原因。发起人可控制的是中间一步：可用交流侧比例与站用电。8MW看似不多，但按' + fmtC(O.crmPrice) + '/kW/年计，每年约值' + fmtCM(8 * 1000 * O.crmPrice) + '，这正是交流侧设计应与电芯选型受到同等审视的原因。'],
        sig:['AC-side losses are capacity revenue','交流侧损耗即容量收入'] },
    ] },
  ] };
};

// ============================== WHOLESALE & BALANCING ==============================
SEC_B.energy = function (){
  const cod = state.codYear, cc = M.codCases[cod] || M.codCases[2029];
  return {
  head: ['Wholesale & Balancing — how much of the published spread is executable?','批发与平衡市场 — 公布价差中有多少可执行？'],
  cap: ['Ireland shows wide day-ahead spreads because wind variability on a small system produces large price swings. But central scheduling, the non-synchronous penetration limit and network constraints all sit between the price signal and the trade, so the executable spread is roughly half the published one.',
        '爱尔兰的日前价差较宽，因为小系统上的风电波动会造成大幅价格摆动。但集中调度、非同步渗透率上限与网络约束均横亘在价格信号与实际交易之间，因此可执行价差约为公布价差的一半。'],
  blocks: [
    { t:'card', mt:false, title:['Day-ahead spread — level and trend','日前价差 — 水平与趋势'], badges:['tp'], live:true, blocks:[
      { t:'line', cfg:{ xs: M.spreadLabels, yfmt: v => fmtC(v), h: 230, ymin: 0,
        series:[{ name:['Average daily day-ahead spread (€/MWh)','日均日前价差（€/MWh）'], color:'var(--s1)', vals: M.spreadSeries }],
        refs:[{ y: 59, label:['executable net spread','可执行净价差'], color:'var(--s6)' }] } },
      { t:'why', text:['The published series sits around ' + fmtC(O.daSpread) + '/MWh and the executable line sits at ' + fmtC(59) + ' — the gap is not noise, it is the structural cost of operating inside a centrally scheduled, constrained system. Any Irish model that starts from the published spread and applies only an efficiency haircut will be roughly ' + fmt1(O.daSpread / 59) + '× too optimistic on the merchant line.',
        '公布序列约在' + fmtC(O.daSpread) + '/MWh，而可执行线为' + fmtC(59) + ' — 两者差距并非噪音，而是在集中调度、受约束系统中运行的结构性成本。任何以公布价差为起点、仅施加效率折减的爱尔兰模型，在市场化收入项上将过于乐观约' + fmt1(O.daSpread / 59) + '倍。'],
        sig:['Roughly half the headline is real','表面数字约有一半是真实的'] },
    ] },

    { t:'card', title:['Published → executable spread bridge (€/MWh discharged)','公布至可执行价差桥（€/MWh放电）'], badges:['calc','illus'], live:true, blocks:[
      { t:'wf', cfg:{ yfmt: v => fmtC(v), h: 290, steps: M.spreadBridge } },
      { t:'why', text:['The largest single deduction is dispatch, SNSP and constraint access at €14/MWh — larger than round-trip efficiency and larger than the optimiser fee. This is the distinctively Irish haircut: in a centrally scheduled market with a binding non-synchronous limit, the battery is not always permitted to make the trade the price implies. It is also the deduction that interconnection will reduce, which is one of the few places where Celtic and Greenlink help rather than hurt storage revenue.',
        '最大的单项扣减是调度、SNSP与网络约束准入，达€14/MWh — 高于往返效率损失，也高于优化商费用。这是爱尔兰特有的折减：在集中调度且非同步渗透率存在硬性上限的市场中，电池并不总被允许执行价格所隐含的交易。这也是互联建设将会减少的扣减项，是Celtic与Greenlink对储能收入有助而非有害的少数环节之一。'],
        sig:['Access, not efficiency, is the big loss','最大损失来自准入而非效率'] },
    ] },

    { t:'card', title:['SDP-02 — what proper scheduling integration changed','SDP-02 — 正式调度整合带来的变化'], badges:['official','illus'], live:true, blocks:[
      { t:'bar', cfg:{ xs:[L(['Traded volume index','交易量指数']), L(['Cycles per day','日循环次数']), L(['Round-trip utilisation %','往返利用率%'])],
        mode:'group', bw: 30, yfmt: v => fmt1(v), labels: true, h: 240,
        series:[
          { name:['Before SDP-02','SDP-02之前'], color:'var(--muted)', vals:[M.sdp.before.vol, M.sdp.before.cycles, M.sdp.before.rtt] },
          { name:['After SDP-02','SDP-02之后'], color:'var(--s1)', vals:[M.sdp.after.vol, M.sdp.after.cycles, M.sdp.after.rtt] },
        ] } },
      { t:'why', text:['This is the one place in either dashboard where historical data is too pessimistic rather than too optimistic. Before ' + O.sdp02Live + ' Irish batteries were structurally under-scheduled; after it, traded volume roughly doubled and cycling rose from ' + fmt1(M.sdp.before.cycles) + ' to ' + fmt1(M.sdp.after.cycles) + ' cycles a day. Any backtest that spans the change must be split at that date, and any pre-2026 Irish revenue benchmark understates what a modern asset can achieve.',
        '这是两个看板中唯一一处历史数据过于悲观而非过于乐观的地方。在' + O.sdp02Live + '之前，爱尔兰电池在结构上被调度不足；此后交易量约翻倍，循环次数由每日' + fmt1(M.sdp.before.cycles) + '次升至' + fmt1(M.sdp.after.cycles) + '次。任何跨越该变更的回测都必须在该日期分段，而任何2026年之前的爱尔兰收入基准都低估了现代资产的实际能力。'],
        sig:['Split every backtest at Nov 2025','所有回测须以2025年11月分段'] },
    ] },

    { t:'card', title:['Captured spread by COD year — saturation and coupling','按投运年度的捕获价差 — 饱和与耦合'], badges:['forecast','illus'], live:true, blocks:[
      { t:'band', cfg:{ xs: Object.keys(M.codCases), yfmt: v => fmtC(v), h: 260,
        low: Object.values(M.codCases).map(c => c.low),
        base: Object.values(M.codCases).map(c => c.central),
        high: Object.values(M.codCases).map(c => c.high),
        zones:[{ from: 0, to: 1, label:['Pre-Celtic','Celtic之前'] }, { from: 2, to: 3, label:['Post-Celtic coupling','Celtic耦合之后'] }] } },
      { t:'cmp', items:[
        { h:['Captured spread at COD ' + cod,'投运年' + cod + '的捕获价差'], v:fmtC(cc.central) + '/MWh', s:['low ' + fmtC(cc.low) + ' · high ' + fmtC(cc.high) + ' — the case spread is the real risk','低' + fmtC(cc.low) + ' · 高' + fmtC(cc.high) + ' — 情景间差距才是真实风险'] },
        { h:['Buildout dilution factor','投产稀释系数'], v:fmtPct(dilutionAt(+cod) * 100, 0), s:['relative to a 2028 reference COD','相对于2028年基准投运年'] },
      ] },
      { t:'line', cfg:{ xs: M.fanYears, yfmt: v => fmtN(v), h: 230,
        series:[
          { name:['Merchant revenue index — low buildout','市场化收入指数 — 低投产'], color:'var(--s2)', vals: M.fanLow },
          { name:['Merchant revenue index — central','市场化收入指数 — 中性'], color:'var(--s1)', vals: M.fanCentral },
          { name:['Merchant revenue index — high buildout','市场化收入指数 — 高投产'], color:'var(--s6)', vals: M.fanHigh },
        ] } },
      { t:'why', text:['Two forces compress the merchant line simultaneously and they are not independent: more storage narrows the spread it trades against, and more interconnection narrows the spread for everyone. For a ' + cod + ' COD the central case is ' + fmtC(cc.central) + '/MWh against ' + fmtC(cc.high) + ' in the low-buildout case — a ' + fmtPct((1 - cc.central / cc.high) * 100, 0) + ' difference decided by other people’s connection dates and by a subsea cable commissioning schedule. Size the merchant line as equity, and let capacity carry the debt.',
        '两股力量同时压缩市场化收入线，且二者并非独立：更多储能会收窄其所交易的价差，更多互联则为所有参与者收窄价差。对' + cod + '投运的项目，中性情景为' + fmtC(cc.central) + '/MWh，而低投产情景为' + fmtC(cc.high) + ' — ' + fmtPct((1 - cc.central / cc.high) * 100, 0) + '的差距由他人的并网时点及一条海底电缆的投运进度决定。市场化收入应按股权规模承担，由容量收入支撑债务。'],
        sig:['Merchant is equity; capacity is debt','市场化对应股权，容量对应债务'] },
      { t:'src', src: SRC.celtic, use:['Celtic Interconnector capacity and expected commissioning date','Celtic互联容量与预计投运日期'] },
    ] },
  ] };
};

// ============================== DS3 / FASS / DASSA ==============================
SEC_B.services = function (){
  const tot = M.services.reduce((a, s) => a + s.reqMW, 0), qual = M.services.reduce((a, s) => a + s.qualMW, 0);
  return {
  head: ['DS3, FASS & DASSA — the revenue line that built the fleet is being replaced','DS3、FASS与DASSA — 支撑机组建设的收入线正被取代'],
  cap: ['DS3 made 0.5–1 hour batteries highly profitable and specified essentially the whole existing Irish fleet. Effective revenue has already fallen more than ' + O.ds3DeclinePct + '%, and competitive day-ahead procurement is due to replace administered tariffs. This is the largest near-term reform exposure in the Irish stack.',
        'DS3使0.5–1小时电池高度盈利，并基本决定了爱尔兰现有机组的规格。其有效收入已下降超过' + O.ds3DeclinePct + '%，且竞争性日前采购将取代行政费率。这是爱尔兰收入结构中最大的近期改革敞口。'],
  blocks: [
    { t:'card', mt:false, title:['Service suite — requirement, qualified supply and tariff','服务组合 — 需求、合格供给与费率'], badges:['illus','verify'], live:true, blocks:[
      { t:'table', head:[['Service','服务'],['Response window','响应窗口'],['Requirement (MW)','需求(MW)'],['Qualified supply (MW)','合格供给(MW)'],['Supply / requirement','供给需求比'],['Tariff (€/MW/h)','费率(€/MW/h)']], num:[2,3,4,5],
        rows: M.services.map(s => [{ b: [s.id + ' — ' + s.n[0], s.id + ' — ' + s.n[1]] }, s.resp,
          fmtN(s.reqMW), fmtN(s.qualMW), fmt1(s.qualMW / s.reqMW) + '×', fmtC(s.tariff)]) },
      { t:'bar', cfg:{ xs: M.services.map(s => s.id), mode:'group', bw: 20, yfmt: v => fmtN(v) + ' MW', h: 250,
        series:[
          { name:['Requirement','需求'], color:'var(--s1)', vals: M.services.map(s => s.reqMW) },
          { name:['Qualified supply','合格供给'], color:'var(--s6)', vals: M.services.map(s => s.qualMW) },
        ] } },
      { t:'why', text:['Qualified supply is ' + fmt1(qual / tot) + '× the total requirement, and the imbalance is worst in the fast products where batteries dominate — ' + fmt1(M.services[1].qualMW / M.services[1].reqMW) + '× in Primary Operating Reserve. Under administered tariffs this surplus produced scalar and tariff reductions; under a competitive auction it will produce clearing prices set by the marginal accredited MW. The direction is not in doubt, only the magnitude and the date.',
        '合格供给为总需求的' + fmt1(qual / tot) + '倍，且在电池主导的快速响应产品中失衡最严重 — 一次运行备用达' + fmt1(M.services[1].qualMW / M.services[1].reqMW) + '倍。在行政费率下，这种盈余导致系数与费率下调；在竞争性拍卖下，它将导致出清价由边际认证MW决定。方向毫无疑问，不确定的只是幅度与时点。'],
        sig:['Surplus decides the price either way','无论何种机制，盈余决定价格'] },
      { t:'src', src: SRC.fass, use:['FASS design, DASSA parameters and transition timetable','FASS设计、DASSA参数与过渡时间表'] },
    ] },

    { t:'card', title:['FASS transition bridge — a legacy 1-hour unit (€k/MW/yr)','FASS过渡桥 — 既有1小时机组（€k/MW/年）'], badges:['illus'], live:true, blocks:[
      { t:'wf', cfg:{ yfmt: v => fmtC(v) + 'k', h: 280, steps: M.fassBridge } },
      { t:'kpis', items:[
        { l:['Modelled transition haircut','模型过渡折减'], v:M.fassHaircutPct + '<small>%</small>', d:['illustrative — verify against DASSA parameters','示例 — 须以DASSA参数核验'], b:['illus'] },
        { l:['Regulated-arrangements long-stop','监管安排最终截止'], v:O.ds3LongStop, d:['or earlier DASSA go-live','或DASSA提前上线'], b:['official'] },
        { l:['Disclosed decline since 2022','自2022年披露降幅'], v:'>' + O.ds3DeclinePct + '<small>%</small>', d:['before the auction transition','尚在拍卖过渡之前'], cls:'down', b:['dev'] },
      ] },
      { t:'why', text:['A legacy short-duration unit that earned around €55k/MW/yr from DS3 is modelled at roughly €30k after the transition — and that is before the competitive auction has actually cleared. The point is not the precise number, which is illustrative, but the direction and its consequence: a 1-hour Irish asset loses its primary revenue line and has almost no capacity revenue to fall back on at a ' + fmtPct(M.deratingCurve[1] * 100, 0) + ' de-rating factor. Short-duration Ireland is not an investable archetype at a 2028–2030 COD.',
        '一台在DS3下年收入约€55k/MW的既有短时机组，过渡后模型值约为€30k — 且这尚在竞争性拍卖实际出清之前。要点不在于该具体数值（其为示例），而在于方向及其后果：1小时的爱尔兰资产将失去主要收入来源，而在' + fmtPct(M.deratingCurve[1] * 100, 0) + '的折减系数下几乎没有容量收入可作依托。对2028–2030年投运而言，爱尔兰短时资产不是可投资的原型。'],
        sig:['1-hour Ireland is not investable','爱尔兰1小时资产不具投资性'] },
    ] },

    { t:'card', title:['Underwriting rule for the system-services line','系统服务收入的承销规则'], badges:['calc'], live:false, blocks:[
      { t:'ladder', items:[
        { n:['Never a long-run floor','绝非长期下限'], d:['Legacy DS3 revenue is evidence of what the system needed, not of what a 2029 asset will earn.','既往DS3收入是系统需求的证据，而非2029年投运资产将获收入的依据。'] },
        { n:['Model the auction, not the tariff','按拍卖而非费率建模'], d:['DASSA clearing will be set by the marginal accredited MW, and qualified supply already exceeds requirement several times over.','DASSA出清价将由边际认证MW决定，而合格供给已数倍于需求。'] },
        { n:['Re-opener in every contract','每份合同均设重议条款'], d:['Any acquisition, toll or offtake should carry a FASS revenue re-opener and DASSA-parameter triggers.','任何收购、代工或售电协议均应包含FASS收入重议条款及DASSA参数触发机制。'] },
        { n:['Exclude from debt sizing','排除于债务规模测算之外'], d:['Lenders should size against the capacity agreement. Services are equity upside in Ireland as elsewhere.','贷款人应以容量协议安排规模。与其他市场一样，服务收入在爱尔兰属股权上行。'] },
      ] },
      { t:'why', text:['At the modelled post-transition level, the services line is roughly ' + fmtPct(M.lab.servicesKW * 1000 / (perNameplate(4) + M.lab.servicesKW * 1000) * 100, 0) + '% of a 4-hour asset’s contracted-plus-services revenue — small enough that removing it entirely should not break the investment case. If it does, the case is a DS3 case rather than a storage case, and DS3 in its original form no longer exists.',
        '按过渡后的模型水平，服务收入约占4小时资产“合同化加服务”收入的' + fmtPct(M.lab.servicesKW * 1000 / (perNameplate(4) + M.lab.servicesKW * 1000) * 100, 0) + ' — 其规模小到即使完全剔除也不应影响投资结论。若剔除后逻辑崩塌，那么它是DS3投资逻辑而非储能投资逻辑，而原形态的DS3已不复存在。'],
        sig:['Remove it; if the case breaks, it was a DS3 case','剔除后若逻辑崩塌，说明那是DS3逻辑'] },
    ] },
  ] };
};

// ============================== DURATION & LDES ==============================
SEC_B.duration = function (){
  const dni = liveScore('durFactors'), band = bandFor(M.durBands, dni);
  return {
  head: ['Storage Duration & LDES — is the fourth hour worth its capex?','储能时长与长时储能 — 第4小时是否值其造价？'],
  cap: ['In Ireland duration is paid for primarily through the capacity de-rating factor and secondarily through dispatch-down capture. This tab separates the three questions duration answers — capacity value, merchant value and policy eligibility — because they have different answers.',
        '在爱尔兰，时长主要通过容量折减系数付费，其次通过限发电量捕获付费。本页拆分时长所回答的三个问题 — 容量价值、市场化价值与政策资格 — 因为三者答案不同。'],
  blocks: [
    { t:'card', mt:false, title:['Duration answers three different questions','时长回答三个不同问题'], badges:['calc','official'], live:false, blocks:[
      { t:'table', head:[['Question','问题'],['Mechanism','机制'],['Answer for Ireland at 2h → 4h','爱尔兰由2小时增至4小时的答案']], rows:[
        [{b:['How much capacity revenue?','容量收入多少？']}, ['Capacity de-rating factor','容量折减系数'],
         [fmtPct(M.deratingCurve[2] * 100, 0) + ' → ' + fmtPct(M.deratingCurve[4] * 100, 0) + ' of nameplate; +' + fmtCk(perNameplate(4) - perNameplate(2)) + '/MW/yr — the dominant driver',
          '折减系数由' + fmtPct(M.deratingCurve[2] * 100, 0) + '升至' + fmtPct(M.deratingCurve[4] * 100, 0) + '；每MW/年增加' + fmtCk(perNameplate(4) - perNameplate(2)) + ' — 主导驱动因素']],
        [{b:['How much merchant revenue?','市场化收入多少？']}, ['Deeper cycles across a wind-driven price shape','在风电驱动的价格形态中进行更深循环'],
         ['Positive but sub-linear — deeper cycles capture thinner spreads (' + fmtPct(M.durSpreadFactor[4] * 100, 0) + ' of the 2h capture rate)',
          '为正但呈次线性 — 更深循环捕获更薄价差（为2小时捕获率的' + fmtPct(M.durSpreadFactor[4] * 100, 0) + '）']],
        [{b:['Am I eligible for anything?','是否具备政策资格？']}, ['LDES procurement concept, 4h+ threshold','长时储能采购概念，4小时以上门槛'],
         ['Potentially — but the concept is at consultation stage and an award is required before any floor is capitalised',
          '可能符合 — 但该概念仍处征询阶段，任何保底资本化前须取得授标']],
      ] },
      { t:'wf', cfg:{ yfmt: v => fmtC(v) + 'k', h: 280, steps: M.marginalHour } },
      { t:'why', text:['The capacity de-rating uplift alone is €30k/MW/yr against roughly €42k of annualised incremental capex, and only the combination of capacity, arbitrage and curtailment capture makes the fourth hour positive. That is a thin margin, and it is entirely dependent on two things a sponsor does not control: the de-rating table at the auction entered, and the cell price at procurement. Build 4h where the capacity award is the base case; build 2h with a documented augmentation path where it is not.',
        '仅容量折减增益即为€30k/MW/年，而年化增量资本开支约为€42k；只有容量、套利与弃电捕获三者合计，第4小时才转为正值。这一margin相当薄，且完全取决于发起人无法控制的两项因素：参与拍卖时的折减系数表，以及采购时的电芯价格。若容量中标为基准情景则建设4小时；若非如此，则建设2小时并保留有据可查的增容路径。'],
        sig:['Thin margin, two uncontrollable inputs','margin微薄，两项不可控输入'] },
    ] },

    { t:'card', title:['Duration-Need Index — every component visible and editable','时长需求指数 — 分项全部可见、可编辑'], badges:['calc','illus'], live:true, blocks:[
      { t:'scorecard', id:'durFactors', bands:'durBands' },
      { t:'why', text:['The index sits at ' + dni + '/100 — ' + L(band.n) + '. The factor doing most of the work is the capacity de-rating uplift (score 3, weight 15%), which is administrative rather than physical. The two holding it down are LDES policy confidence (score 1: consultation stage, no award) and interconnector mitigation (score 1: ' + fmtN(O.greenlinkMW + O.celticMW) + ' MW of new coupling reduces the need for domestic duration). Read together: Irish duration value is real but administratively determined and partially offset by subsea cable, so underwrite it against the de-rating table rather than against a price forecast.',
        '该指数为' + dni + '/100 — ' + L(band.n) + '。贡献最大的因子是容量折减增益（评分3，权重15%），其性质属行政而非物理。压低它的两个因子是长时储能政策确定性（评分1：仍处征询阶段、尚无授标）与互联缓解（评分1：新增' + fmtN(O.greenlinkMW + O.celticMW) + 'MW耦合降低了对本土时长的需求）。综合解读：爱尔兰的时长价值真实存在，但由行政决定，且部分被海底电缆抵消，因此应以折减系数表而非价格预测进行承销。'],
        sig:['Administratively set, cable-offset','由行政设定，被电缆抵消'] },
    ] },

    { t:'card', title:['Event-duration evidence — how long does the system actually need?','事件时长证据 — 系统实际需要多久？'], badges:['illus'], live:true, blocks:[
      { t:'bar', cfg:{ xs:['P50','P90','P99'], mode:'group', bw: 26, yfmt: v => fmt1(v) + ' h', labels: true, h: 250,
        series: M.eventDist.map((e, i) => ({ name: e.n, color: ['var(--s1)','var(--s3)','var(--s6)'][i], vals:[e.p50, e.p90, e.p99] })) } },
      { t:'note', text:['Three different phenomena with three different design implications. High-price events (P90 ' + fmt1(M.eventDist[0].p90) + ' h) set the arbitrage and Reliability Option requirement. Negative-price events (P90 ' + fmt1(M.eventDist[1].p90) + ' h) set the charging opportunity. Dispatch-down events (P90 ' + fmt1(M.eventDist[2].p90) + ' h) set the co-location case, because that is energy the renewable asset loses entirely without storage.',
        '三种不同现象，对应三种不同的设计含义。高价事件（P90 ' + fmt1(M.eventDist[0].p90) + '小时）决定套利与可靠性期权需求。负电价事件（P90 ' + fmt1(M.eventDist[1].p90) + '小时）决定充电机会。限发事件（P90 ' + fmt1(M.eventDist[2].p90) + '小时）决定共址逻辑，因为若无储能，新能源资产将完全损失该部分电量。'] },
      { t:'why', text:['The dispatch-down distribution is the strongest duration argument in Ireland and the one most specific to this market: a P90 event of ' + fmt1(M.eventDist[2].p90) + ' hours means a co-located 4-hour battery captures most of a typical curtailment episode, while a 1-hour battery captures a fraction of it. Combined with ' + fmt1(O.windDispatchDownPct) + '% dispatch-down and a ' + fmtCM(O.constraintCostM * 1e6) + ' annual constraint bill, this is the case for co-location that no other market in this comparison set can make as clearly.',
        '限发事件的分布是爱尔兰最有力的时长论据，也是最具本地特性的论据：P90事件长达' + fmt1(M.eventDist[2].p90) + '小时，意味着共址的4小时电池可捕获典型弃电事件的大部分，而1小时电池仅能捕获其中一小部分。再叠加' + fmt1(O.windDispatchDownPct) + '%的限发比例与每年' + fmtCM(O.constraintCostM * 1e6) + '的约束账单，这构成了本对比样本中其他市场都无法如此清晰提出的共址论据。'],
        sig:['Co-location is an Ireland-specific edge','共址是爱尔兰特有优势'] },
    ] },

    { t:'card', title:['LDES procurement — a separate asset class, not a longer battery','长时储能采购 — 独立资产类别，而非更长的电池'], badges:['consult','illus'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Procurement concept','采购概念'], v:fmtN(O.ldesMW) + ' MW / ' + fmtN(O.ldesMWh) + '<small> MWh</small>', d:['4-hour equivalent at concept stage','概念阶段等效4小时'], b:['consult'] },
        { l:['Policy ambition pathway','政策目标路径'], v:fmtN(O.ldesAmbitionMW) + '<small> MW</small>', d:['ambition, not a procurement volume','为目标，非采购量'], b:['policy'] },
        { l:['Overall storage ambition by 2030','2030年整体储能目标'], v:fmt1(O.storageAmbitionMW / 1000) + '<small> GW</small>', d:['against ~' + fmt1(O.fleetMW / 1000) + ' GW operating','对比在运约' + fmt1(O.fleetMW / 1000) + 'GW'], b:['policy'] },
      ] },
      { t:'gates', items: M.ldesScore.map(x => ({ n: x.n, d: x.s, c: x.c, s: x.s })) },
      { t:'why', text:['The LDES concept is at consultation stage, which in this dashboard’s badge vocabulary means it is not settled policy and cannot support a base case. The specific error to avoid is capitalising a revenue floor before a final award: a minded-to position, a shortlist or a design consultation all carry process risk, funding-decision risk and post-construction review risk. Model the project without the floor; treat the floor as an option whose value is realised only on award.',
        '长时储能概念仍处征询阶段 — 按本看板的标识词汇，这意味着它不是既定政策，不能支撑基准情景。须避免的具体错误是在最终授标前将收入下限资本化：倾向性立场、入围名单或设计征询，均附带流程风险、资金决策风险与建后审查风险。应在不含保底的前提下建模项目；将保底视为仅在授标时才实现价值的期权。'],
        sig:['No floor before final award','未获最终授标前不得计入保底'] },
    ] },

    { t:'card', title:['Augmentation readiness — the option to add hours later','增容准备度 — 日后增加小时数的选择权'], badges:['illus'], live:false, blocks:[
      { t:'aug' },
      { t:'why', text:['In Ireland the augmentation option is worth more than elsewhere because the payoff is administrative and step-shaped: crossing into a higher de-rating band is worth a discrete jump in capacity revenue, not a marginal improvement in trading. The two items that most often void the option are the planning envelope and MEC/MIC headroom in the connection agreement — both are cheap to secure at the outset and effectively impossible to retrofit.',
        '在爱尔兰，增容选择权的价值高于其他市场，因为其回报是行政性的、呈阶跃状：跨入更高折减档位意味着容量收入的离散跃升，而非交易收入的边际改善。最常导致该选择权失效的两个事项是规划许可范围与并网协议中的MEC/MIC裕度 — 两者在项目起始阶段获取成本低廉，事后则几乎无法补救。'],
        sig:['Secure the envelope and the MIC first','优先锁定规划范围与MIC'] },
    ] },
    
    /* Relocated from the Investment Lab tab, which moved to the home page. The
       duration question is a market question — where the de-rating uplift stops
       covering the MWh capex — so it belongs beside the rest of this tab rather
       than inside a returns model. */
    { t:'card', title:['Duration comparison — incremental NPV of the final added hour','时长比较 — 最后新增小时的增量NPV'], badges:['calc','illus'], live:false, blocks:[
      { t:'labDur' },
      { t:'cap', text:['Run on the seed assumptions this market publishes. To retype them and price a capital structure, use the Investment Lab on the home page.',
        '基于本市场种子假设运行。如需重新输入假设并测算资本结构，请使用首页的投资测算模块。'] },
      { t:'why', text:['Judge duration on the NPV of the last hour added, never on headline project IRR — a longer asset can have a lower IRR and a higher NPV, and the capital committed differs by a factor of four across this table. Where the incremental column turns negative is the point at which the de-rating uplift stops covering the MWh capex, and that crossover moves every time either cell prices or the de-rating table changes.',
        '判断时长应依据最后新增小时的NPV，绝不可仅看项目整体IRR — 更长的资产可能IRR更低而NPV更高，且本表各行所投入的资本相差达四倍。增量列转负之处，即是折减系数增益不再覆盖MWh造价的临界点；每当电芯价格或折减系数表变化，该临界点即随之移动。'],
        sig:['Judge the last hour, not the project','判断最后一小时，而非整个项目'] },
    ] },
  ] };
};

// ============================== PIPELINE ==============================
SEC_B.pipeline = function (){
  const mw = pipelineByYear('MW');
  const totRaw = mw.raw.reduce((a, b) => a + b, 0), totPw = mw.pw.reduce((a, b) => a + b, 0);
  return {
  head: ['Project Pipeline — probability-weighted, with MW and MWh separated','项目管线 — 概率加权，MW与MWh分列'],
  cap: ['A pipeline is a distribution, not a number. In Ireland the gate that matters is the executed connection agreement, and the nominal ' + fmt1(O.pipelineMW / 1000) + ' GW pipeline sits mostly below it.',
        '管线是一个分布而非一个数字。在爱尔兰，关键门槛是已签并网协议，而名义上' + fmt1(O.pipelineMW / 1000) + 'GW的管线大部分尚未跨过该门槛。'],
  blocks: [
    { t:'card', mt:false, title:['Pipeline scale — the ratio that matters','管线规模 — 关键比率'], badges:['illus'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['Operating fleet','在运机组'], v:fmt1(O.fleetMW / 1000) + '<small> GW</small>', d:['mostly 0.5–2h','以0.5–2小时为主'], b:['illus'] },
        { l:['Nominal pipeline','名义管线'], v:fmt1(O.pipelineMW / 1000) + '<small> GW</small>', d:[fmt1(O.pipelineMWh / 1000) + ' GWh across ~' + O.pipelineProjects + ' projects','约' + O.pipelineProjects + '个项目，' + fmt1(O.pipelineMWh / 1000) + 'GWh'], b:['illus'] },
        { l:['Pipeline / operating multiple','管线对在运倍数'], v:fmt1(O.pipelineMW / O.fleetMW) + '<small>×</small>', d:['saturation pressure is a ratio, not a level','饱和压力是比率而非水平量'], b:['calc'] },
        { l:['Average pipeline duration','管线平均时长'], v:fmt1(O.pipelineMWh / O.pipelineMW) + '<small> h</small>', d:['versus a much shorter operating fleet','对比时长短得多的在运机组'], b:['calc'] },
      ] },
      { t:'why', text:['A ' + fmt1(O.pipelineMW / O.fleetMW) + '× pipeline-to-operating ratio would be alarming if the pipeline could actually connect. It largely cannot — connection capacity, not capital or planning, is the binding constraint. That is why the correct Irish analysis discounts by connection stage rather than by construction readiness, and why the same nominal GW figure means something entirely different here than it would in a market with an open queue.',
        '若该管线真能全部并网，' + fmt1(O.pipelineMW / O.fleetMW) + '倍的管线对在运比率将令人警惕。但它在很大程度上无法实现 — 约束条件是并网容量，而非资本或规划许可。这正是爱尔兰的正确分析应按并网阶段而非建设准备度折减的原因，也是同样的名义GW数字在此地与在开放排队市场中含义完全不同的原因。'],
        sig:['Connection capacity is the real filter','并网容量才是真正的筛选器'] },
    ] },
    { t:'card', title:['Stage probabilities — the gate is the discount','阶段概率 — 门槛即折减'], badges:['calc'], live:false, blocks:[
      { t:'stageProb' },
      { t:'why', text:['The probability step that matters is connection offer (55%) to executed connection agreement plus planning consent (70%). Below the executed agreement, a project is a connection application rather than a project. Probability-weight by the gate actually cleared, and never treat an ECP batch position or a high-level technical assessment as evidence of delivery.',
        '真正关键的概率跃迁是由已获并网报价（55%）到已签并网协议加规划许可（70%）。在取得已签协议之前，项目只是一份并网申请而非项目。应按实际通过的门槛进行概率加权，且绝不可将ECP批次位置或高层技术评估视为交付证据。'],
        sig:['Below executed agreement, it is an application','未签协议前，它只是一份申请'] },
    ] },
    { t:'g2', cards:[
      { title:['COD pipeline by year — MW','按投运年度的管线 — MW'], badges:['illus'], live:true, blocks:[
        { t:'pipeChart', unit:'MW' },
        { t:'why', text:['Probability weighting removes ' + fmtPct((1 - totPw / totRaw) * 100, 0) + '% of announced MW across the seed register. That discount is the whole analytical content of a pipeline view — an unweighted pipeline systematically overstates future competition and therefore understates future revenue.',
          '在种子登记表中，概率加权剔除了已公告MW的' + fmtPct((1 - totPw / totRaw) * 100, 0) + '%。这一折减正是管线分析的全部价值 — 未加权的管线会系统性高估未来竞争、进而低估未来收入。'],
          sig:['Unweighted pipelines mislead twice','未加权管线会两次误导'] },
      ] },
      { title:['COD pipeline by year — MWh','按投运年度的管线 — MWh'], badges:['illus'], live:true, blocks:[
        { t:'pipeChart', unit:'MWh' },
        { t:'why', text:['MWh predicts spread compression; MW predicts capacity-auction competition and system-services saturation. In Ireland they diverge sharply because the operating fleet is short and the pipeline is long — so the capacity auction gets more competitive faster than the spread narrows.',
          'MWh预测价差压缩；MW预测容量拍卖竞争与系统服务饱和。在爱尔兰两者显著分化，因为在运机组时长短而管线时长长 — 因此容量拍卖竞争加剧的速度快于价差收窄的速度。'],
          sig:['Capacity competition tightens first','容量竞争率先加剧'] },
      ] },
    ] },
    { t:'card', title:['Project register — illustrative placeholders, not real facilities','项目登记表 — 示例占位，非真实项目'], badges:['illus'], live:true, blocks:[
      { t:'projTable' },
      { t:'note', text:['All projects shown are illustrative placeholders, tagged by jurisdiction so ROI and NI concentration can be checked separately. Replace with a de-duplicated register of connection applications, offers and executed agreements before any transaction use; ROI and NI run different connection processes under different regulators.',
        '所示项目均为示例占位，并按辖区标注，以便分别检查爱尔兰共和国与北爱尔兰的集中度。任何交易用途前，须以去重后的并网申请、报价与已签协议登记数据替换；两地在不同监管方下运行不同的并网流程。'] },
    ] },
  ] };
};

// The public project sources do not resolve into one complete all-island
// delivery funnel. Keep the seed register out of decision outputs until a
// governed, de-duplicated official register is available.
SEC_B.pipeline = function (){
  return {
    head:['Project Pipeline — official coverage gap', '项目管线 — 官方覆盖缺口'],
    cap:['Official aggregate connection, auction and adequacy evidence remains usable within its stated scope. Complete project-level MW, MWh, delivery stage and probability-weighted COD are N/A.', '官方汇总并网、拍卖及充足性证据可在其明确范围内使用。完整的项目级MW、MWh、交付阶段及概率加权投运日期均为N/A。'],
    blocks:[ieQueueCoverageBlock()],
  };
};

// ============================== GRID & CONNECTION ==============================
SEC_B.grid = function (){
  const mec = M.mecBridge;
  return {
  head: ['Grid & Connection — a chain of approvals, not a binary status','并网 — 一连串审批与合同，而非二元状态'],
  cap: ['Connection is the binding constraint on Irish storage and the place where development capital is lost. The distinctively Irish requirement is that both MEC (export) and MIC (import) must be documented in an executed agreement — an asset with export rights but insufficient import rights cannot charge at contracted power.',
        '并网是爱尔兰储能的关键约束，也是开发资本损失之处。爱尔兰特有的要求是：MEC（送出）与MIC（受入）必须在已签协议中同时载明 — 拥有送出权利但受入权利不足的资产，无法以合同功率充电。'],
  blocks: [
    { t:'geo-grid-map', data:gridMapById('ie-grid-map') },
    { t:'congestion', data:congestionFor('ie') },
    { t:'card', mt:false, title:['Nameplate → revenue bridge','铭牌容量至收入桥'], badges:['calc','illus'], live:true, blocks:[
      { t:'sub', text:['Capacity channel','容量通道'] },
      { t:'flow', items:[
        ['Nameplate MW','铭牌MW'], ['Contracted MEC','合同MEC'], ['× de-rating factor','×折减系数'],
        ['Awarded de-rated MW','中标折减MW'], ['− Reliability Option difference payments','− 可靠性期权差价支付'],
      ] },
      { t:'sub', text:['Merchant channel','市场化通道'] },
      { t:'flow', items:[
        ['Contracted MIC (charging right)','合同MIC（充电权利）'], ['Central scheduling & SNSP headroom','集中调度与SNSP裕度'],
        ['− constraint & dispatch-down','− 网络约束与限发'], ['− optimiser fee','− 优化商费用'], ['Realised net revenue','实际净收入'],
      ] },
      { t:'why', text:['The two chains start from different numbers, and that is the Irish trap. Capacity revenue is limited by MEC; merchant revenue is limited by MIC. A project with 50 MW MEC and 30 MW MIC has full capacity revenue and two-thirds of its cycling capability, which shows up as a revenue shortfall with no identifiable event. Read both numbers from the executed connection agreement, not from the offer and not from the application.',
        '两条链条的起点数字不同 — 这正是爱尔兰的陷阱。容量收入受MEC限制；市场化收入受MIC限制。一个MEC为50MW、MIC为30MW的项目拥有完整的容量收入，却只有三分之二的循环能力，其表现是没有可识别事件的收入缺口。应从已签并网协议中读取两个数字，而非从报价文件或申请文件中读取。'],
        sig:['MEC pays capacity; MIC enables cycling','MEC决定容量收入，MIC决定循环能力'] },
    ] },

    { t:'card', title:['MEC bridge — requested to monetisable (MW)','MEC桥 — 从申请到可变现（MW）'], badges:['illus'], live:true, blocks:[
      { t:'bar', cfg:{ xs: mec.map(x => L(x.l)), bw: 40, rotX: true, yfmt: v => fmtN(v) + ' MW', labels: true, h: 270,
        series:[{ name:['MW at each stage','各阶段MW'], color:'var(--s1)', vals: mec.map(x => x.v) }] } },
      { t:'why', text:['Requested ' + mec[0].v + ' MW becomes ' + mec[mec.length - 1].v + ' MW monetisable — a ' + fmtPct((1 - mec[mec.length - 1].v / mec[0].v) * 100, 0) + ' reduction, most of it occurring before an offer is even issued. Two implications: size the project against the assessed and offered capacity rather than the requested capacity, and treat any financial model built on requested MEC as overstated from the first line down.',
        '申请' + mec[0].v + 'MW最终变为可变现' + mec[mec.length - 1].v + 'MW — 减少' + fmtPct((1 - mec[mec.length - 1].v / mec[0].v) * 100, 0) + '，且大部分发生在报价文件出具之前。两点含义：应按评估后与报价容量而非申请容量确定项目规模；任何以申请MEC构建的财务模型，从第一行起即被高估。'],
        sig:['Size on offered, not requested','按报价容量而非申请容量定规模'] },
    ] },

    { t:'card', title:['Connection pathway, regulators and reform','并网流程、监管机构及改革'], badges:['official','verify'], live:false, blocks:[
      { t:'flow', items:[
        ['Route to the correct operator','选择正确运营商'], ['Application and studies','申请及研究'], ['Offer: exact MIC + MEC','报价：明确MIC及MEC'],
        ['Planning / land / consents','规划 / 土地 / 许可'], ['Executed agreement','已签协议'], ['Build, test and energise','施工、测试及送电'],
        ['Market registration and qualification','市场注册及资格'],
      ] },
      { t:'table', head:[['Jurisdiction / reform','司法辖区 / 改革'],['Who decides or delivers','决策或交付机构'],['Evidence an investor should demand','投资者应取得的证据']], rows:[
        [{b:['Republic of Ireland generation','爱尔兰共和国发电']},
          ['CRU regulates; EirGrid handles transmission applications above 40 MW and ESB Networks handles smaller distribution applications','CRU监管；40MW以上输电申请由EirGrid处理，较小的配电申请由ESB Networks处理'],
          ['Batch / process status, assessed capacity, exact node, executed agreement, MIC, MEC, enabling works and long-stop dates','批次/流程状态、评估容量、具体节点、已签协议、MIC、MEC、配套工程及最终期限']],
        [{b:['Northern Ireland connection','北爱尔兰并网']},
          ['Utility Regulator regulates; SONI handles transmission connections at 110 kV and above, NIE Networks the distribution system','Utility Regulator监管；110kV及以上输电并网由SONI处理，配电由NIE Networks处理'],
          ['Signed offer, contestable/non-contestable works, reinforcement scope, cost allocation, programme and energisation evidence','已签报价、可竞争/不可竞争工程、增容范围、成本分配、计划及送电证据']],
        [{b:['ROI data-centre reform','爱尔兰共和国数据中心改革']},
          ['CRU’s new policy tests location, system security and matching local generation/storage','CRU新政策测试区位、系统安全及配套本地发电/储能'],
          ['Do not infer approval from corporate announcement or land; require the system-operator decision and matching-resource evidence','不可根据企业公告或土地推断获批；须取得系统运营商决定及配套资源证据']],
        [{b:['NI connection-cost reform','北爱并网成本改革']},
          ['Reinforcement costs are moving toward socialisation while customers retain direct-asset costs and published caps','增容成本正转向社会化，客户仍承担直接资产成本及公布上限'],
          ['Verify the implementation date, qualifying voltage, offer version and residual direct works—policy direction is not a final invoice','核实实施日期、适用电压、报价版本及剩余直接工程；政策方向不是最终账单']],
      ] },
      { t:'why', text:['Delay case study: the existing cross-border path is constrained at roughly 300 MW, while the planned North–South Interconnector is designed for up to 1,500 MW. It is fully consented and in the construction step, but that future capability is not usable until build, testing and energisation finish. Prevent the same valuation error in a BESS deal by tying each dependency to a condition precedent, named document, long-stop date and per-MW price adjustment. Grid-forming capability can improve stability and service eligibility, but it does not create MIC, MEC or network headroom.',
        '延误案例：现有跨境路径受限于约300MW，而规划南北互联线设计能力最高1,500MW。该项目已全部获批并进入施工步骤，但在完成建设、测试及送电前，未来能力不可使用。BESS交易应将每项依赖绑定至先决条件、具名文件、最终期限及按MW调价，以避免同类估值错误。构网型能力可改善稳定性及服务资格，但不会创造MIC、MEC或网络空间。'],
        sig:['Consent is not energisation; capability is not a connection right','许可不等于送电；技术能力不等于并网权'] },
    ] },

    { t:'card', title:['Constraint and dispatch-down — the system problem storage is paid to solve','网络约束与限发 — 储能获付费所要解决的系统问题'], badges:['official','verify'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['Wind dispatch-down (ROI, 2025)','风电限发（爱尔兰共和国，2025）'], v:fmt1(O.windDispatchDownPct) + '<small>%</small>', d:['curtailment plus constraint','弃电加网络约束'], b:['official','verify'] },
        { l:['Constraint & curtailment cost','约束与弃电成本'], v:fmtCM(O.constraintCostM * 1e6), d:['2024/25 · forecast ' + fmtCM(O.constraintForecastM * 1e6),'2024/25 · 预测' + fmtCM(O.constraintForecastM * 1e6)], b:['official','verify'] },
        { l:['SNSP limit today','当前非同步渗透率上限'], v:O.snspNow + '<small>%</small>', d:['policy direction ' + O.snsp2030 + '% by 2030','政策方向：2030年' + O.snsp2030 + '%'], b:['official','verify'] },
        { l:['Interconnection added by 2028','至2028年新增互联'], v:fmtN(O.greenlinkMW + O.celticMW) + '<small> MW</small>', d:['reduces constraints and spreads together','同时减少约束与价差'], b:['official'] },
      ] },
      { t:'why', text:['A ' + fmtCM(O.constraintCostM * 1e6) + ' annual constraint bill rising toward ' + fmtCM(O.constraintForecastM * 1e6) + ' is a quantified, published prize — the clearest statement in any market in this comparison set that the system will pay to fix a problem storage can address. But note the direction of the interconnector row: ' + fmtN(O.greenlinkMW + O.celticMW) + ' MW of coupling reduces exactly this bill. The window in which constraint capture is worth most is therefore before Celtic, not after.',
        '每年' + fmtCM(O.constraintCostM * 1e6) + '并向' + fmtCM(O.constraintForecastM * 1e6) + '上升的约束账单，是一个可量化、已公布的“奖金池” — 这是本对比样本中任何市场都无法比拟的明确表态：系统愿意为解决储能可应对的问题付费。但须注意互联一行的方向：' + fmtN(O.greenlinkMW + O.celticMW) + 'MW的耦合恰恰会减少这笔账单。因此约束捕获价值最高的窗口在Celtic投运之前，而非之后。'],
        sig:['The prize shrinks when the cable lands','电缆投运后奖金池缩小'] },
      { t:'src', src: SRC.eirgrid, use:['Dispatch-down, constraint and curtailment cost, SNSP limit','限发、约束与弃电成本、非同步渗透率上限'] },
    ] },

    { t:'card', title:['The network build behind the offers — named projects and their delivery step','要约背后的电网建设 — 具名项目及其交付阶段'], badges:['official','forecast'], live:false, blocks:[
      { t:'table',
        head:[['Project','工程'],['Route','路径'],['Delivery body','交付主体'],['Position','进展状态'],['Scope','范围'],['Target','目标年份'],['Status','状态']], num:[5],
        rows: M.reinforcements.map(x => {
          const k = M.planClasses.find(c => c.id === x.cls);
          return [{ b:x.n }, x.region, [x.operator, x.operator], { chip:k.c, text:k.n }, x.scope, String(x.year), x.status];
        }) },
      { t:'cap', text:['The all-island transmission projects an Irish connection date depends on, ordered by target year. Ireland publishes no ISP-style status classification, so the position column maps EirGrid\'s own project lifecycle onto whether consent and construction actually exist.',
        '爱尔兰并网日期所依赖的全岛输电工程，按目标年份排列。爱尔兰不发布ISP式的状态分类，因此进展状态列将EirGrid自身的项目生命周期映射为“许可与施工是否确实存在”。'] },
      { t:'table', head:[['Position','进展状态'],['What it does and does not confer','其赋予与不赋予的内容']],
        rows: M.planClasses.map(k => [{ chip:k.c, text:k.n }, k.d]) },
      { t:'why', text:['One row on this table should reset how an Irish network date is read. The North-South Interconnector has held full planning approval on both sides of the border since 2018 and is only now expected to start construction, for completion in 2031 — thirteen years in the consented class. That is the single largest all-island transfer constraint, and it is the constraint behind much of the dispatch-down bill in the card above. Two consequences. A consented Irish project is not a near-term project, so a case that assumes the constraint prize shrinks on the consent date is wrong by years. And Celtic shows the converse risk — it slipped from 2027 to Q4 2028 while already under construction — so even the strongest class here carries schedule risk. Underwrite the constraint capture against the build dates in this table, not against the policy dates.',
        '本表中有一行应当改变对爱尔兰电网日期的解读方式。南北互联线自2018年起即在边界两侧取得完整规划批准，直到现在才预计开工，2031年完工 — 在"已获许可"类别中停留了十三年。它是全岛最大的单一输送约束，也是上方卡片中大部分限发账单背后的成因。由此有两点推论。爱尔兰已获许可的项目并非近期项目，因此假定约束"奖金池"会在许可日期缩小的方案，会误判数年之久。而Celtic则显示了相反的风险 — 它在已经施工的情况下仍由2027年推迟至2028年第四季度 — 因此即便是本表中最强的类别也带有进度风险。约束捕获应以本表中的建设日期承销，而非以政策日期承销。'],
        sig:['Consented has meant thirteen years here','在此“已获许可”曾意味着十三年'] },
      { t:'src', src: SRC.tdp, use:['Named project scope, lifecycle step and target completion years','具名项目范围、生命周期阶段及目标完工年份'] },
      { t:'src', src: SRC.celtic, use:['Celtic Interconnector scope and revised commissioning date','Celtic互联线范围及修订后的投运日期'] },
      { t:'src', src: SRC.pr6, use:['Approved 2026–2030 capital envelope and priority project counts','已核准的2026–2030年资本额度及优先项目数量'] },
    ] },

    { t:'card', title:['Connection risk → suggested commercial protections','并网风险 → 建议商业保护条款'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Risk','风险'],['Protection','保护条款'],['Trigger to invoke','触发条件']], rows:[
        [{b:['MEC reduced between offer and executed agreement','报价至签约期间MEC被削减']},
         ['Price adjustment per MW of shortfall; walk-away right below a defined floor','按缺口MW调整价款；低于约定下限时享有退出权'],
         ['Any revision to the offered capacity','报价容量的任何修订']],
        [{b:['MIC insufficient for modelled cycling','MIC不足以支撑模型循环次数']},
         ['MIC ≥ MEC as a condition precedent; otherwise re-model cycles and re-price','以MIC不低于MEC为先决条件；否则重算循环次数并重新定价'],
         ['MIC below MEC in the executed agreement','已签协议中MIC低于MEC']],
        [{b:['ECP batch position treated as delivery evidence','将ECP批次位置视为交付证据']},
         ['Executed connection agreement as a hard condition precedent, with no substitutes accepted','以已签并网协议为硬性先决条件，不接受任何替代'],
         ['Any evidence weaker than an executed agreement','任何弱于已签协议的证据']],
        [{b:['FASS/DASSA repricing of the services line','FASS/DASSA对服务收入重新定价']},
         ['Revenue re-opener with DASSA-parameter triggers in the acquisition or toll agreement','在收购或代工协议中设置收入重议条款及DASSA参数触发机制'],
         ['Publication of DASSA parameters or a go-live date','DASSA参数或上线日期发布']],
        [{b:['Reliability Option difference payments in a high-price year','高电价年度的可靠性期权差价支付']},
         ['Degradation covenant keeping usable duration above the awarded band; state-of-charge operating protocol','以衰减契约维持可用时长高于中标档位；制定荷电状态操作规程'],
         ['Modelled duration within 10% of a band boundary','模型时长距档位边界不足10%']],
      ] },
      { t:'why', text:['Every protection here converts a documentary risk into a priced or allocated one. The two that are genuinely Ireland-specific are the MIC condition and the Reliability Option covenant — neither appears in a GB template, and both are routinely omitted when a GB-experienced sponsor moves west. Adding them costs nothing at term-sheet stage and is effectively impossible to negotiate after signing.',
        '此处每项保护都把文件风险转化为可定价或可分配的风险。真正属爱尔兰特有的是MIC条件与可靠性期权契约 — 两者均不出现在英国模板中，且当具英国经验的发起人西进时常被遗漏。在条款清单阶段加入这两项成本为零，签约后则几乎无法再谈判。'],
        sig:['Two clauses a GB template omits','两项英国模板遗漏的条款'] },
      { t:'src', src: SRC.cru, use:['Connection policy, network charges and storage treatment','并网政策、网络费用与储能待遇'] },
    ] },
  ] };
};

// ============================== IRELAND vs GB (peer benchmark) ==============================
// Mirrors the WA dashboard's "WEM vs NEM" section: the only tab that uses peer-market
// data, held in a separate namespace and excluded from every Ireland scoring input.
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
  cap: ['The only section in this dashboard that uses GB data. Ireland and GB are neighbouring, interconnected, similarly regulated markets that nevertheless reward storage through structurally different mechanisms. Comparing them isolates what is genuinely Irish. All GB figures are held in a separate namespace and excluded from the Ireland composite investment score.',
        '本看板中唯一使用英国数据的章节。爱尔兰与英国相邻、互联且监管体系相近，但两者奖励储能的机制存在结构性差异。比较两者可分离出真正属于爱尔兰特有的因素。所有英国数值保存在独立命名空间，不计入爱尔兰综合投资评分。'],
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
SEC_B.portfolio = function (){
  const inp = labInputs(), r = labModel(inp);
  const dn = labModel(inp, { spreadFactor: 0.75, svcFactor: 0.55, capFactor: 0.85, noGrant: true });
  return {
  head: ['Portfolio / Fund View — applying the Irish thesis to a screened opportunity','组合与基金视图 — 将爱尔兰逻辑应用于所筛选机会'],
  cap: ['A worked screening example using the Investment Lab assumptions. All project-specific content is confined to this tab and is illustrative — it demonstrates the gate sequence an investment committee should apply, not a real transaction.',
        '使用投资测算假设的筛选示例。所有项目层面内容均限于本页且为示例性质 — 用于演示投委会应遵循的门槛顺序，而非真实交易。'],
  blocks: [
    { t:'card', mt:false, title:['Screened opportunity — institutional screening snapshot','所筛选机会 — 机构筛选快照'], badges:['illus'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Configuration','配置'], v:fmtN(inp.mw) + ' MW / ' + fmtN(inp.mw * inp.hours) + '<small> MWh</small>', d:[inp.hours + '-hour design','' + inp.hours + '小时设计'] },
        { l:['Target COD','目标投运'], v:state.codYear, d:['de-rating vintage and saturation case both follow from this','折减系数版本与饱和情景均由此决定'] },
        { l:['Total capex','总资本开支'], v:fmtCM(r.capex), d:[fmtC(inp.capexKWh) + '/kWh + ' + fmtC(inp.capexKW) + '/kW', fmtC(inp.capexKWh) + '/kWh + ' + fmtC(inp.capexKW) + '/kW'], b:['model'] },
        { l:['Paid de-rated capacity','获付费折减容量'], v:fmtN(r.capMW) + '<small> MW</small>', d:[fmtPct(r.derate * 100) + ' of nameplate','相当于铭牌的' + fmtPct(r.derate * 100)], b:['calc'] },
        { l:['Year-1 EBITDA','第1年EBITDA'], v:fmtCM(r.ebitda1), d:['unlevered IRR ' + fmtIRR(r.unlevIRR),'无杠杆IRR ' + fmtIRR(r.unlevIRR)], b:['calc'] },
        { l:['Min DSCR — lender downside','最低偿债覆盖率 — 贷款人下行'], v:fmtX(dn.minDSCR), d:['base case ' + fmtX(r.minDSCR),'基准情景 ' + fmtX(r.minDSCR)], cls: dn.minDSCR != null && dn.minDSCR < 1.3 ? 'down' : '', b:['calc'] },
      ] },
      { t:'ic', b:['Screening conclusion: ','筛选结论：'],
        text:['Because the capacity line is the largest single revenue source, an Irish 4-hour asset with a capacity award is materially more financeable than an equivalent GB asset — but it is also more exposed to a single administrative decision. The screening question is therefore not "will the market hold up" but "is the award secured, and does the de-rating band have headroom for degradation over the agreement term".',
              '由于容量收入是最大的单一收入来源，已取得容量中标的爱尔兰4小时资产，其可融资性显著高于同等条件的英国资产 — 但它同时也更暴露于单一行政决定。因此筛选问题不是“市场能否维持”，而是“中标是否已锁定，且折减档位在协议期内是否为衰减预留了裕度”。'] },
    ] },
    { t:'card', title:['Revenue stack — evidence status of each line','收入结构 — 各收入项的证据状态'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Revenue line','收入项'],['Year-1 amount','第1年金额'],['Evidence status','证据状态'],['Treatment in the model','模型处理方式']], num:[1], rows:[
        [{b:['Capacity mechanism','容量机制']}, fmtCM(r.capRev), {chip:'good', text:['Auction-cleared price and awarded de-rated MW','拍卖出清价与中标折减MW']},
         ['Contracted for ' + inp.capYrs + ' years once awarded; supports debt sizing, net of Reliability Option stress','中标后锁定' + inp.capYrs + '年；扣除可靠性期权压力后支撑债务规模']],
        [{b:['Wholesale & balancing','批发与平衡']}, fmtCM(r.arb1), {chip:'warn', text:['Executable spread, not published spread','可执行价差，非公布价差']},
         ['Post-SDP-02 basis only; equity risk','仅采用SDP-02之后的口径；属股权风险']],
        [{b:['DS3 / FASS system services','DS3/FASS系统服务']}, fmtCM(r.svc1), {chip:'critical', text:['Being replaced by competitive procurement','正被竞争性采购取代']},
         ['Capped at post-transition level; excluded from debt sizing','以过渡后水平封顶；排除于债务规模测算']],
        [{b:['Optimiser fee','优化商费用']}, '−' + fmtCM(r.fee1), {chip:'warn', text:['Contracted; central scheduling limits dispersion','已合同化；集中调度限制业绩离散']},
         ['Lower value-add than GB, but parameterisation still matters','增值低于英国，但参数设置仍然重要']],
        [{b:['Fixed opex','固定运维']}, '−' + fmtCM(r.opex), {chip:'good', text:['LTSA and O&M contracted','长期服务协议与运维已签约']},
         ['Check warranty cycling limits against modelled cycles','须核对质保循环限制与模型循环次数是否一致']],
      ] },
      { t:'why', text:['The contracted share here is ' + fmtPct(r.capRev / (r.capRev + r.arb1 + r.svc1) * 100, 0) + '% of gross revenue — far higher than a comparable GB asset, and the reason Irish storage can support project debt on a capacity award alone. The corollary is concentration: a single auction outcome, a single de-rating table and a single Reliability Option strike determine most of the value. Diversify across auction vintages rather than across counties.',
        '此处合同化收入占毛收入的' + fmtPct(r.capRev / (r.capRev + r.arb1 + r.svc1) * 100, 0) + ' — 远高于同等条件的英国资产，这也是爱尔兰储能能够仅凭容量中标支撑项目债务的原因。其推论是集中度问题：单一拍卖结果、单一折减系数表与单一可靠性期权执行价决定了大部分价值。应跨拍卖年份分散，而非跨郡县分散。'],
        sig:['Diversify by auction vintage, not geography','按拍卖年份分散，而非按地理'] },
    ] },
    { t:'card', title:['Investment Committee gates — what must be true before capital is released','投委会门槛 — 资金拨付前必须成立的条件'], badges:['calc'], live:false, blocks:[
      { t:'gates', items:[
        { n:['Gate 1 — Connection','门槛1 — 并网'], d:['Executed connection agreement with documented MEC and MIC, and MIC sufficient for the modelled cycling regime.','已签并网协议并载明MEC与MIC，且MIC足以支撑模型所设循环制度。'], c:'warn', s:['Evidence required','需提供证据'] },
        { n:['Gate 2 — Capacity','门槛2 — 容量'], d:['Qualification pathway confirmed for the intended auction, with the de-rating table of that specific vintage applied in the model.','已确认目标拍卖的资格路径，且模型采用该拍卖年份对应的折减系数表。'], c:'warn', s:['Vintage-specific','须与拍卖年份一致'] },
        { n:['Gate 3 — Reliability Option','门槛3 — 可靠性期权'], d:['Stressed difference-payment scenario modelled, with a degradation covenant keeping usable duration above the awarded band.','已建模压力情景下的差价支付，并以衰减契约维持可用时长高于中标档位。'], c:'serious', s:['Stress case required','须做压力测试'] },
        { n:['Gate 4 — Downside coverage','门槛4 — 下行覆盖'], d:['Minimum DSCR of at least 1.30x in the lender downside case, achieved through structure rather than a more optimistic forecast.','贷款人下行情景下最低偿债覆盖率不低于1.30x，且须通过结构而非更乐观的预测实现。'], c: dn.minDSCR != null && dn.minDSCR >= 1.3 ? 'good' : 'critical', s: dn.minDSCR != null && dn.minDSCR >= 1.3 ? ['Met','已满足'] : ['Not met','未满足'] },
        { n:['Gate 5 — Exit specification','门槛5 — 退出规格'], d:['A defined buyer universe at exit: capacity award in hand, executed connection, and an operating track record on the post-SDP-02 basis.','退出时具备明确的买家群体：已获容量中标、已签并网协议、且具备SDP-02之后口径的运营业绩。'], c:'warn', s:['Design for it now','须在当下即行设计'] },
      ] },
      { t:'why', text:['The gates are ordered so the cheapest test comes first. In Ireland Gate 1 eliminates most opportunities on documentary grounds alone, and Gate 3 is the one most often skipped — the Reliability Option is invisible in a normal-year model and expensive in exactly the years the rest of the model looks strongest. Running the gates in reverse, modelling returns first and checking connection last, is how development capital is lost here.',
        '门槛按“最便宜的检验优先”排序。在爱尔兰，门槛1仅凭文件依据即可淘汰大部分机会；而门槛3最常被跳过 — 可靠性期权在正常年度的模型中不可见，却恰在模型其余部分表现最好的年份代价高昂。若顺序颠倒 — 先测算收益、最后核查并网 — 正是当地开发资本损失的方式。'],
        sig:['Gate 3 is the one that gets skipped','门槛3是最常被跳过的一关'] },
    ] },
  ] };
};

// ============================== DATA & METHODOLOGY ==============================
SEC_B.data = function (){
  const srcs = [SRC.semo, SRC.semc, SRC.eirgrid, SRC.fass, SRC.soni, SRC.cru, SRC.urni, SRC.cso, SRC.celtic, SRC.neso];
  return {
  head: ['Data & Methodology — source registry, formulas and quality badges','数据与方法 — 数据源登记、公式与质量标识'],
  cap: ['Every figure in this dashboard carries a quality badge and a namespace. Official values come from named regulator or system-operator publications; calculated values are derived here; illustrative values are synthetic placeholders that must be replaced by live ingestion before any investment use.',
        '本看板中每个数值均带有质量标识与命名空间。官方数值来自具名的监管机构或系统运营方出版物；计算值在本看板内推导；示例数值为合成占位数据，任何投资用途前须以实时抓取数据替换。'],
  blocks: [
    { t:'card', mt:false, title:['Source hierarchy — which source may answer which question','来源层级 — 何种来源可回答何种问题'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Question','问题'],['Only acceptable source','唯一可接受来源'],['Never acceptable','不可接受']], rows:[
        [{b:['What will capacity revenue be?','容量收入将是多少？']}, ['Auction results plus the de-rating table of that specific vintage','拍卖结果加上该拍卖年份对应的折减系数表'], ['Nameplate MW, a prior vintage table, or a peer market','铭牌MW、以往年份的表格、或同业市场']],
        [{b:['What merchant revenue is achievable?','可实现的市场化收入是多少？']}, ['Executable spread on a post-SDP-02 basis','SDP-02之后口径的可执行价差'], ['The published day-ahead spread, or a pre-2026 backtest','公布的日前价差，或2026年之前的回测']],
        [{b:['Can the project connect and cycle?','项目能否并网并循环？']}, ['Executed connection agreement showing both MEC and MIC','同时载明MEC与MIC的已签并网协议'], ['An ECP batch position, a technical assessment or an unaccepted offer','ECP批次位置、技术评估或未接受的报价']],
        [{b:['Will DS3/FASS revenue persist?','DS3/FASS收入能否持续？']}, ['Published DASSA parameters once available','DASSA参数正式发布后的文件'], ['Trailing DS3 revenue as a forward floor','以既往DS3收入作为远期下限']],
        [{b:['Is an LDES floor bankable?','长时储能保底是否可融资？']}, ['A final procurement award','最终采购授标'], ['A consultation, concept volume or ambition figure','征询文件、概念容量或政策目标数字']],
      ] },
      { t:'why', text:['Four of the five rows describe the same error: substituting an earlier, more available proxy for the definitive evidence. In Ireland that error has a consistent direction on the revenue side and a mixed one on the merchant side — nameplate exceeds de-rated MW and DS3 history exceeds forward services revenue, but pre-SDP-02 trading history understates what a modern asset can achieve. Getting the direction right for each line matters more than getting any single number right.',
        '五行中有四行描述的是同一错误：以更早、更易获得的替代指标取代决定性证据。在爱尔兰，该错误在收入侧方向一致，在市场化侧则方向不一 — 铭牌高于折减后MW、DS3历史高于远期服务收入，但SDP-02之前的交易历史却低估了现代资产的实际能力。为每条收入线判断正确的方向，比精确得到任何单一数字更重要。'],
        sig:['Direction per line beats precision','逐项判断方向优于追求精度'] },
    ] },
    { t:'card', title:['Source registry — verified 26 July 2026','数据源登记表 — 2026年7月26日核验'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Source','来源'],['Status','状态'],['Source date','来源日期'],['Applicable period','适用期间']],
        rows: srcs.map(s => [{ b: [s.file, s.file] }, s.status, s.date, s.cy]) },
      { t:'note', text:['Jurisdiction discipline: ROI and NI sit in one market (SEM) but under two regulators, two transmission system operators and two connection processes. Keep ROI and NI evidence separate in diligence even though revenue is settled on an all-island basis.',
        '辖区纪律：爱尔兰共和国与北爱尔兰同属一个市场（SEM），但受两个监管方、两个输电系统运营方及两套并网流程管辖。尽管收入按全岛口径结算，尽调中仍须将两地证据分开保存。'] },
    ] },
    { t:'card', title:['Core formulas','核心公式'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Quantity','指标'],['Formula','公式']], rows:[
        [{b:['Capacity revenue','容量收入']}, 'nameplate MW × de-rating factor(duration, auction vintage) × clearing price (€/kW/yr) × 1,000'],
        [{b:['Discharged energy, year 1','第1年放电电量']}, 'MW × hours × usable fraction × cycles/day × 365 × availability'],
        [{b:['Executable spread','可执行价差']}, 'published spread − liquidity − RTE − dispatch/SNSP/constraint − availability − optimiser fee'],
        [{b:['Effective spread by duration','按时长的有效价差']}, 'executable spread × duration factor × (RTE / 88) × saturation factor(COD year)'],
        [{b:['Composite score','综合评分']}, 'Σ (component weight × component score) / 100'],
        [{b:['Duration-Need Index / Connection Risk Score','时长需求指数/并网风险评分']}, 'Σ (factor weight × factor score) / 3, each factor scored 0–3'],
        [{b:['DSCR','偿债覆盖率']}, 'EBITDA(year) / annuity(debt, interest rate, tenor)'],
      ] },
    ] },
    { t:'card', title:['Data-quality badge legend & seed status','数据质量标识说明与种子状态'], badges:['calc'], live:false, blocks:[
      { t:'badges', items:['official','calc','illus','forecast','dev','public','tp','peer','final','draft','model','consult','verify','policy',
        h('span', { class:'badge seed' }, MKT.seedTag), h('span', { class:'badge etl' }, 'LIVE_ETL_REQUIRED')] },
      { t:'cap', text:['Official values, refreshed July 2026: T-4 capacity clearing price ' + fmtC(O.crmPrice) + '/kW de-rated/yr for DY ' + O.crmDY + ' with ' + fmtN(O.crmAwardedMW) + ' MW de-rated awarded (verify against the current auction notice) · data centres ' + O.dcSharePct + '% of metered electricity and ' + fmtN(O.dcGWh2025) + ' GWh in 2025 · ROI wind dispatch-down ' + fmt1(O.windDispatchDownPct) + '% · constraint and curtailment cost ' + fmtCM(O.constraintCostM * 1e6) + ' for 2024/25, forecast ' + fmtCM(O.constraintForecastM * 1e6) + ' · SNSP limit ' + O.snspNow + '% with a ' + O.snsp2030 + '% policy direction · Greenlink ' + fmtN(O.greenlinkMW) + ' MW operational 2025 and Celtic ' + fmtN(O.celticMW) + ' MW expected 2028 · SDP-02 live ' + O.sdp02Live + ' · DS3 regulated-arrangements long-stop ' + O.ds3LongStop + '. De-rating factors, service tariffs and all series are illustrative seeds pending live ingestion. Northern Ireland is inside SEM and is covered here, not in the GB dashboard.',
        '官方数值，2026年7月刷新：交付年' + O.crmDY + '的T-4容量出清价' + fmtC(O.crmPrice) + '/kW折减/年，中标折减容量' + fmtN(O.crmAwardedMW) + 'MW（须以现行拍卖公告核验） · 2025年数据中心占计量用电' + O.dcSharePct + '%、' + fmtN(O.dcGWh2025) + 'GWh · 爱尔兰共和国风电限发' + fmt1(O.windDispatchDownPct) + '% · 2024/25约束与弃电成本' + fmtCM(O.constraintCostM * 1e6) + '，预测' + fmtCM(O.constraintForecastM * 1e6) + ' · 非同步渗透率上限' + O.snspNow + '%，政策方向' + O.snsp2030 + '% · Greenlink ' + fmtN(O.greenlinkMW) + 'MW于2025年运行，Celtic ' + fmtN(O.celticMW) + 'MW预计2028年 · SDP-02于' + O.sdp02Live + '生效 · DS3监管安排最终截止' + O.ds3LongStop + '。折减系数、服务费率及全部序列均为示例种子，待实时抓取替换。北爱尔兰属于SEM，由本看板覆盖，不在英国看板范围内。'] },
      { t:'exports' },
    ] },
    { t:'card', title:['Bilingual glossary','双语术语表'], badges:['calc'], live:false, blocks:[
      { t:'glossary' },
      { t:'why', text:['Four terms carry disproportionate decision weight and are the ones most often used loosely in Irish discussions: MEC versus MIC (export capacity pays capacity revenue, import capacity enables cycling — they are frequently different numbers), Reliability Option (the capacity payment carries a difference-payment obligation above a strike), de-rating factor (a duration-dependent multiplier set per auction vintage), and dispatch-down (curtailment plus constraint, the system problem storage is paid to solve). Agreeing these four definitions with a counterparty before negotiating removes most of the scope for talking past each other.',
        '有四个术语在决策中的权重不成比例，且在爱尔兰的讨论中最常被宽泛使用：MEC与MIC之别（送出容量决定容量收入，受入容量决定循环能力 — 两者常为不同数字）、可靠性期权（容量付费附带高于执行价时的差价支付义务）、折减系数（按拍卖年份设定、随时长变化的乘数）、以及限发（弃电加网络约束，即储能获付费所要解决的系统问题）。在谈判前与交易对手就这四项定义达成一致，可消除大部分各说各话的空间。'],
        sig:['Agree four definitions before negotiating','谈判前先统一四项定义'] },
    ] },
  ] };
};


  return SECTIONS;
}