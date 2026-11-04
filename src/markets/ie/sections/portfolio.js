/* Ireland — the `portfolio` section.
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

  return SEC_B.portfolio;
}
