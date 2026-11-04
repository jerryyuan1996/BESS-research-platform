/* Poland — the `portfolio` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

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

  return SEC_B.portfolio;
}
