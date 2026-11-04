/* Ireland — the `capacity` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O, perNameplate } = createShared(api);
  const SEC_B = {};

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

  return SEC_B.capacity;
}
