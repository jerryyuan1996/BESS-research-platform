/* Poland — the `capacity` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O, capEurKW, perNameplate } = createShared(api);
  const SEC_B = {};

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

  return SEC_B.capacity;
}
