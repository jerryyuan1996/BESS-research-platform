/* Great Britain — the `grid` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { buildGBGridSection } from '../gridSection.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, T, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, durationAt, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const SEC_B = {};

SEC_B.grid = function (){
  return {
  head: ['Grid Connection — a chain of approvals, not a binary status','并网 — 一连串审批与合同，而非二元状态'],
  cap: ['Since connections reform, queue position is the primary determinant of GB project value. A Gate 2 offer is necessary but not sufficient: the deliverable date depends on the tranche, the transmission or distribution operator works programme, and a consent that is implementable rather than merely granted.',
        '自并网改革以来，队列位置是英国项目价值的首要决定因素。Gate 2要约是必要但不充分条件：可交付日期取决于所在批次、输配电运营商的工程计划，以及一份可实施（而非仅获批准）的规划许可。'],
  blocks: [
    { t:'card', mt:false, title:['Nameplate → revenue bridge','铭牌容量至收入桥'], badges:['calc','illus'], live:true, blocks:[
      { t:'sub', text:['Capacity channel','容量通道'] },
      { t:'flow', items:[
        ['Nameplate MW','铭牌MW'], ['Transmission Entry Capacity (TEC)','输电接入容量(TEC)'],
        ['Prequalified de-rated MW','预资格折减MW'], ['Awarded capacity agreement','中标容量协议'],
        ['Satisfactory performance days','合格履约日'],
      ] },
      { t:'sub', text:['Merchant channel','市场化通道'] },
      { t:'flow', items:[
        ['Export / import limit','送出与受入限额'], ['BM visibility & parameterisation','平衡机制可见性与参数设置'],
        ['− skip rate','− 跳过率'], ['− network charges by zone','− 分区网络费用'], ['Realised net revenue','实际净收入'],
      ] },
      { t:'why', text:['Two independent chains break for unrelated reasons, and a project can fail one while passing the other. The capacity chain fails administratively — a prequalification rejection or a missed milestone removes the whole agreement. The merchant chain fails economically — a northern TNUoS zone or poor BM parameterisation quietly removes ' + fmtPct(15) + '–' + fmtPct(25) + ' of revenue with no single identifiable event. Diligence must walk both, and the connection agreement is the only document that constrains both.',
        '两条链条因互不相关的原因失效，项目可能通过其中一条而在另一条上失败。容量链是行政性失效 — 预资格被否或错过里程碑即导致整份协议丧失。市场化链是经济性失效 — 位于北部输电收费分区或平衡机制参数设置不当，会在没有任何单一可识别事件的情况下悄然抹去' + fmtPct(15) + '–' + fmtPct(25) + '的收入。尽调须同时走完两条链，而并网协议是唯一同时约束两者的文件。'],
        sig:['Two chains, two failure modes','两条链条，两种失效模式'] },
    ] },

    { t:'card', title:['Connection risk → suggested commercial protections','并网风险 → 建议商业保护条款'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Risk','风险'],['Protection','保护条款'],['Trigger to invoke','触发条件']], rows:[
        [{b:['Gate 2 tranche slips behind works programme','Gate 2批次落后于工程计划']},
         ['Long-stop date tied to energisation, not to offer acceptance; price reduction per month of delay','最终截止日与送电挂钩而非与要约接受挂钩；按延迟月数递减价款'],
         ['Any revision to the TO/DNO programme','输配电运营商工程计划的任何修订']],
        [{b:['Consent granted but not implementable','规划许可已获批但不可实施']},
         ['Completion of pre-commencement conditions as a condition precedent, with holdback','以完成开工前条件为先决条件，并设保留款'],
         ['Outstanding conditions at signing','签约时仍有未决条件']],
        [{b:['Connection cost or securities increase','并网成本或保证金上升']},
         ['Cost-sharing cap above an agreed threshold; securities released against milestones','超出约定阈值的成本分担上限；保证金按里程碑释放'],
         ['Revised connection offer or works estimate','修订后的并网要约或工程估算']],
        [{b:['Charging reform changes zonal cost','收费改革改变分区成本']},
         ['Change-in-law allocation and a repricing right on a defined index','法律变更风险分担及基于约定指数的重新定价权'],
         ['Publication of a charging-reform decision','收费改革决定发布']],
        [{b:['Prequalification failure for the capacity auction','容量拍卖预资格未通过']},
         ['Warranty on metering and technical class; indemnity for a missed auction year','对计量与技术类别提供保证；对错过拍卖年度提供赔偿'],
         ['Any change to the unit’s technical classification','机组技术类别的任何变更']],
      ] },
      { t:'why', text:['Every protection here converts a timing risk into a priced or allocated risk, which is the only thing that can be done with connection exposure — it cannot be diversified within GB and it cannot be hedged. The single most valuable clause is the first: tying the long-stop to energisation rather than to offer acceptance, because a Gate 2 offer that arrives on time with a works programme that does not is the specific way GB projects lose a COD year, and therefore a de-rating vintage and a buildout case at the same time.',
        '此处每项保护都把时点风险转化为可定价或可分配的风险，而这也是应对并网敞口的唯一手段 — 它在英国境内既无法分散也无法对冲。价值最高的是第一项条款：将最终截止日与送电而非与要约接受挂钩，因为“Gate 2要约按时到达而工程计划未能跟上”正是英国项目损失一个投运年度的具体方式，进而同时损失一个折减系数版本与一个投产情景。'],
        sig:['Tie the long-stop to energisation','最终截止日应挂钩送电'] },
      { t:'src', src: SRC.reform, use:['Gate 1 / Gate 2 sequencing and offer-tranche timetable','Gate 1/Gate 2排序及要约批次时间表'] },
    ] },
  ] };
};
// Investor-facing map and evidence journey supersedes the legacy editable scorecard.
SEC_B.grid = () => buildGBGridSection({ SRC, M });

// ============================== GB vs IRELAND (peer benchmark) ==============================
// Mirrors the WA dashboard's "WEM vs NEM" section: the only tab that uses peer-market
// data, held in a separate namespace and excluded from every GB scoring input.

  return SEC_B.grid;
}
