/* Romania — the `portfolio` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, NF2, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

SEC_B.portfolio = function (){
  const inp = labInputs(), r = labModel(inp);
  const dn = labModel(inp, { spreadFactor: 0.75, svcFactor: 0.6, noGrant: true });
  return {
  head: ['Portfolio / Fund View — applying the Romanian thesis to a screened opportunity','组合与基金视图 — 将罗马尼亚逻辑应用于所筛选机会'],
  cap: ['A worked screening example using the Investment Lab assumptions. All project-specific content is confined to this tab and is illustrative — it demonstrates the gate sequence an investment committee should apply, not a real transaction.',
        '使用投资测算假设的筛选示例。所有项目层面内容均限于本页且为示例性质 — 用于演示投委会应遵循的门槛顺序，而非真实交易。'],
  blocks: [
    { t:'card', mt:false, title:['Screened opportunity — institutional screening snapshot','所筛选机会 — 机构筛选快照'], badges:['illus'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Configuration','配置'], v:fmtN(inp.mw) + ' MW / ' + fmtN(inp.mw * inp.hours) + '<small> MWh</small>', d:[inp.hours + '-hour core with augmentation optionality','' + inp.hours + '小时核心设计并保留增容选择权'] },
        { l:['Target COD','目标投运'], v:state.codYear, d:['dilution factor ' + fmtPct(dilutionAt(+state.codYear) * 100, 0),'稀释系数' + fmtPct(dilutionAt(+state.codYear) * 100, 0)] },
        { l:['Total capex','总资本开支'], v:fmtCM(r.capex), d:['grant ' + fmtCM(r.grant) + ' — award letter required','补贴' + fmtCM(r.grant) + ' — 须取得授予函'], b:['model'] },
        { l:['Year-1 merchant revenue','第1年市场化收入'], v:fmtCM(r.arb1), d:['plus balancing ' + fmtCM(r.svc1),'另加平衡收入' + fmtCM(r.svc1)], b:['calc'] },
        { l:['Year-1 EBITDA','第1年EBITDA'], v:fmtCM(r.ebitda1), d:['unlevered IRR ' + fmtIRR(r.unlevIRR),'无杠杆IRR ' + fmtIRR(r.unlevIRR)], b:['calc'] },
        { l:['Min DSCR — lender downside','最低偿债覆盖率 — 贷款人下行'], v:fmtX(dn.minDSCR), d:['no grant, −25% spread, −40% balancing','无补贴、价差−25%、平衡−40%'], cls: dn.minDSCR != null && dn.minDSCR < 1.3 ? 'down' : '', b:['calc'] },
      ] },
      { t:'ic', b:['Screening conclusion: ','筛选结论：'],
        text:['A Romanian screening decision turns on three documents and one negotiation: the ATR, the executed connection agreement, the grant award letter, and a bilateral floor or tolling arrangement. The financial model is comparatively straightforward; the evidence pack is not. If the first three documents are not in hand, the correct answer is to price the opportunity as development risk rather than as an asset.',
              '罗马尼亚的筛选决策取决于三份文件与一项谈判：ATR、已签并网合同、补贴授予函，以及双边保底或代工安排。财务模型相对直接，证据资料包则不然。若前三份文件尚未到手，正确做法是按开发风险而非按资产为该机会定价。'] },
    ] },
    { t:'card', title:['Revenue stack — evidence status of each line','收入结构 — 各收入项的证据状态'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Revenue line','收入项'],['Year-1 amount','第1年金额'],['Evidence status','证据状态'],['Treatment in the model','模型处理方式']], num:[1], rows:[
        [{b:['Capacity mechanism','容量机制']}, fmtC(0), {chip:'critical', text:['Does not exist in Romania','在罗马尼亚不存在']},
         ['Zero by design — the structural difference from every peer market','按设计为零 — 与所有同业市场的结构性差异']],
        [{b:['Wholesale arbitrage','批发套利']}, fmtCM(r.arb1), {chip:'warn', text:['Executable margin, competition-diluted','可执行价差，已按竞争稀释']},
         ['Primary revenue line; equity risk with no contractual support','主要收入来源；属股权风险，无合同支持']],
        [{b:['Balancing & reserves','平衡与备用']}, fmtCM(r.svc1), {chip:'serious', text:['Evidence tier 1 for most projects','多数项目仅达第1证据层级']},
         ['Underwrite only to the tier reached; exclude above tier 2 from debt sizing','只按已达层级承销；超出第2层级的部分排除于债务规模测算']],
        [{b:['Capital grant','资本补贴']}, fmtCM(r.grant), {chip:'warn', text:['Award letter required — budget is not award','须取得授予函 — 预算不等于授予']},
         ['A capex reduction, not revenue; removed entirely in the lender case','属资本开支减项而非收入；在贷款人情景中完全剔除']],
        [{b:['Fixed opex','固定运维']}, '−' + fmtCM(r.opex), {chip:'good', text:['LTSA and O&M contracted','长期服务协议与运维已签约']},
         ['Check warranty cycling limits against the ' + inp.cycles + ' cycles/day assumption','须核对质保循环限制与每日' + inp.cycles + '次循环假设是否一致']],
      ] },
      { t:'why', text:['Zero per cent of gross revenue is contracted, which is the single most important line in this table and the reason Romanian gearing is structurally lower than Polish, Irish or British gearing for an identical asset. The three available responses are lower debt, a development-bank lender that will take merchant risk, or a negotiated bilateral floor. Choose which one before building the model, because each implies a different capital structure and a different buyer at exit.',
        '毛收入中合同化部分为零 — 这是本表最重要的一行，也是同一资产在罗马尼亚的杠杆结构性低于波兰、爱尔兰或英国的原因。可选的三种应对是：降低债务、寻求愿承担市场化风险的开发性银行、或谈判取得双边保底。应在建模之前作出选择，因为每一种都意味着不同的资本结构与不同的退出买家。'],
        sig:['Zero contracted — choose the response first','合同化为零 — 应先选定应对方式'] },
    ] },
    { t:'card', title:['Investment Committee gates — what must be true before capital is released','投委会门槛 — 资金拨付前必须成立的条件'], badges:['calc'], live:false, blocks:[
      { t:'gates', items:[
        { n:['Gate 1 — ATR','门槛1 — ATR'], d:['An ATR with adequate capacity and at least twelve months of remaining validity at the modelled financial close.','在模型所设融资交割时点，持有容量充足且剩余有效期不少于十二个月的ATR。'], c:'warn', s:['Evidence required','需提供证据'] },
        { n:['Gate 2 — Connection agreement','门槛2 — 并网合同'], d:['Executed, with works scope, cost allocation and delivery responsibility defined and a long-stop tied to energisation.','已签署，且明确工程范围、费用分担与交付责任，并将最终截止日挂钩送电。'], c:'warn', s:['Executed only','仅接受已签署'] },
        { n:['Gate 3 — Grant award','门槛3 — 补贴授予'], d:['A formal award letter, or an investment case that stands without the grant. A scheme budget is never sufficient.','取得正式授予函，或投资逻辑在无补贴情况下仍然成立。计划预算永远不构成充分条件。'], c:'serious', s:['Letter or no-grant case','授予函或无补贴情景'] },
        { n:['Gate 4 — Downside coverage','门槛4 — 下行覆盖'], d:['Minimum DSCR of at least 1.30x with no grant and stressed merchant and balancing revenue.','在无补贴且市场化与平衡收入承压的情况下，最低偿债覆盖率不低于1.30x。'], c: dn.minDSCR != null && dn.minDSCR >= 1.3 ? 'good' : 'critical', s: dn.minDSCR != null && dn.minDSCR >= 1.3 ? ['Met','已满足'] : ['Not met','未满足'] },
        { n:['Gate 5 — Exit specification','门槛5 — 退出规格'], d:['A defined buyer universe: either a negotiated floor that makes the asset conventional infrastructure, or a merchant buyer that prices Romanian spread risk.','明确的买家群体：要么谈成保底使资产成为常规基础设施，要么找到愿为罗马尼亚价差风险定价的市场化买家。'], c:'serious', s:['Design for it now','须在当下即行设计'] },
      ] },
      { t:'why', text:['The gates are ordered so the cheapest test comes first, and in Romania the first three are all documentary. Gate 4 is where the absence of a capacity mechanism becomes visible: the same project that passes comfortably in Poland or Ireland can fail here on coverage alone, and no amount of modelling fixes that. Gate 5 is the one most often deferred, and deferring it is how a fund ends up owning a merchant Romanian asset it cannot sell.',
        '门槛按“最便宜的检验优先”排序，而在罗马尼亚前三关均属文件性。第4关是“没有容量机制”显现之处：在波兰或爱尔兰可以轻松通过的同一项目，在此可能仅因偿债覆盖不足而失败，且任何建模都无法弥补。第5关最常被推迟，而推迟它正是基金最终持有一项无法出售的罗马尼亚市场化资产的原因。'],
        sig:['Gate 4 exposes the missing mechanism','第4关暴露缺失的机制'] },
    ] },
  ] };
};

// ============================== DATA & METHODOLOGY ==============================

  return SEC_B.portfolio;
}
