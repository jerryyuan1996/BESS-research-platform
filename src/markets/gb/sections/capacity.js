/* Great Britain — the `capacity` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, T, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, durationAt, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

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
        text:['These are NESO\'s published factors for the two vintages shown, from its Electricity Capacity Report and the Capacity Auction Guidelines. Use the table for the exact auction the project will enter: a factor from the wrong vintage moves capacity revenue by about 5% at the short end.',
              '此为NESO就所示两个版本公布的系数，出自其《电力容量报告》与《容量拍卖指南》。应采用项目实际参与之拍卖所对应的表格：使用错误版本的系数会使短时端容量收入偏差约5%。'] },
      { t:'why', text:['The curve is the regulator telling you the price of an hour. Going 2h → 4h raises de-rated capacity from ' + fmtPct(d2 * 100, 0) + ' to ' + fmtPct(d4 * 100, 0) + ' — capacity revenue per nameplate MW rises from ' + fmtC(perNameplate(2)) + ' to ' + fmtC(perNameplate(4)) + ', an uplift of ' + fmtC(perNameplate(4) - perNameplate(2)) + '/MW/yr for two more hours. Going 4h → 8h adds ' + fmtC(perNameplate(8) - perNameplate(4)) + ' for four more, which is about the same per hour. Up to the duration-limited threshold the mechanism pays nearly the same for every hour, so the case for stopping at four has to come from capex and the merchant line rather than from the de-rating curve. Beyond the threshold, 8h and longer is the territory of the separate cap-and-floor regime.',
        '这条曲线是监管方对“一小时”的定价。由2小时增至4小时，折减后容量由' + fmtPct(d2 * 100, 0) + '升至' + fmtPct(d4 * 100, 0) + ' — 每铭牌MW容量收入由' + fmtC(perNameplate(2)) + '升至' + fmtC(perNameplate(4)) + '，即增加两小时可换取' + fmtC(perNameplate(4) - perNameplate(2)) + '/MW/年。由4小时增至8小时，增加四小时可换取' + fmtC(perNameplate(8) - perNameplate(4)) + '，每小时大致相同。在时长受限门槛以内，该机制对每一小时的给付几乎相同，因此止步于四小时的理由必须来自造价与市场化收入，而非折减曲线。超过该门槛后，8小时及以上属于独立的上下限机制的范畴。'],
        sig:['Every hour to the threshold is paid about the same','门槛以内每小时获付大致相同'] },
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

  return SEC_B.capacity;
}
