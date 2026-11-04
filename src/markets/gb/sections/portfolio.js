/* Great Britain — the `portfolio` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { designLine, designBest, routeFit } from '../../_shared/designAnswer.js';
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, T, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, durationAt, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

SEC_B.portfolio = function (){
  const inp = labInputs(), r = labModel(inp);
  const dn = labModel(inp, { spreadFactor: 0.75, svcFactor: 0.7, capFactor: 0.85, noGrant: true });
  /* The Lab's own verdict on its own case, computed rather than asserted. */
  const clears = r.unlevIRR != null && r.unlevIRR >= inp.disc / 100;
  const covered = dn.minDSCR != null && dn.minDSCR >= 1.3;
  const line = designLine('gb');
  return {
  head: ['Portfolio / Fund View — applying the GB thesis to a screened opportunity','组合与基金视图 — 将英国逻辑应用于所筛选机会'],
  cap: ['The Investment Lab’s screening case, taken through the gate sequence an investment committee applies. It runs the Lab’s own model on the Lab’s inputs; the engine’s case is on the Brief.',
        '投资测算筛选情景，按投委会适用的门槛顺序逐项演示。该情景以投资测算自身的模型与输入运行；引擎情景见要点页。'],
  blocks: [
    { t:'card', mt:false, title:['Lab screening case — ' + fmtN(inp.mw) + ' MW · ' + inp.hours + 'h','投资测算筛选情景 — ' + fmtN(inp.mw) + 'MW · ' + inp.hours + '小时'], badges:['illus'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Configuration','配置'], v:fmtN(inp.mw) + ' MW / ' + fmtN(inp.mw * inp.hours) + '<small> MWh</small>', d:[inp.hours + '-hour Lab screening case', inp.hours + '小时投资测算筛选情景'] },
        { l:['Target COD','目标投运'], v:state.codYear, d:['de-rating vintage and buildout case both follow from this','折减系数版本与投产情景均由此决定'] },
        { l:['Total capex','总资本开支'], v:fmtCM(r.capex), d:[fmtC(inp.capexKWh) + '/kWh + ' + fmtC(inp.capexKW) + '/kW', fmtC(inp.capexKWh) + '/kWh + ' + fmtC(inp.capexKW) + '/kW'], b:['model'] },
        { l:['Paid de-rated capacity','获付费折减容量'], v:fmtN(r.capMW) + '<small> MW</small>', d:[fmtPct(r.derate * 100) + ' of nameplate', '相当于铭牌的' + fmtPct(r.derate * 100)], b:['calc'] },
        { l:['Year-1 EBITDA','第1年EBITDA'], v:fmtCM(r.ebitda1), d:['unlevered IRR ' + fmtIRR(r.unlevIRR),'无杠杆IRR ' + fmtIRR(r.unlevIRR)], b:['calc'] },
        { l:['Min DSCR — lender downside','最低偿债覆盖率 — 贷款人下行'], v:fmtX(dn.minDSCR), d:['base case ' + fmtX(r.minDSCR),'基准情景 ' + fmtX(r.minDSCR)], cls: dn.minDSCR != null && dn.minDSCR < 1.3 ? 'down' : '', b:['calc'] },
      ] },
      { t:'ic', b:['Screening conclusion: ','筛选结论：'],
        text:['On the Lab’s inputs the case returns ' + fmtIRR(r.unlevIRR) + ' unlevered, ' + (clears ? 'above' : 'below') + ' its ' + inp.disc + '% discount rate, and ' + (covered ? 'holds' : 'fails') + ' lender-downside coverage at ' + fmtX(dn.minDSCR) + ' minimum DSCR. Weak coverage is answered structurally rather than by re-forecasting: reduce gearing, contract a floor or toll for part of the capacity, or move the COD earlier so the asset sits ahead of the saturation curve.',
              '按投资测算输入，该情景无杠杆回报为' + fmtIRR(r.unlevIRR) + '，' + (clears ? '高于' : '低于') + '其' + inp.disc + '%折现率；贷款人下行情景下最低偿债覆盖率为' + fmtX(dn.minDSCR) + '，' + (covered ? '覆盖达标' : '覆盖不足') + '。覆盖不足应以结构性方式应对，而非重新预测：降低杠杆、就部分容量签订保底或租赁协议、或提前投运使资产处于饱和曲线之前。'] },
      line ? { t:'note', text:['The Brief and the shortlist use the engine, not this Lab case. ' + line[0], '要点页与候选清单采用引擎而非本测算情景。' + line[1]] } : null,
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

  return SEC_B.portfolio;
}
