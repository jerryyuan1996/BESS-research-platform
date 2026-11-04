/* Poland — the `grid` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { buildPLGridSection } from '../gridSection.js';
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

SEC_B.grid = function (){
  return {
  head: ['Grid & Connection — the gate that decides both revenue lines','并网 — 决定两条收入线的门槛'],
  cap: ['Connection is the binding constraint on Polish storage, and it is unusual because it gates the capacity auction as well as the physical build. A connection failure removes the contracted and the merchant revenue lines simultaneously.',
        '并网是波兰储能的关键约束，且其特殊之处在于：它不仅决定实体建设，也决定能否参与容量拍卖。并网失败将同时移除合同化与市场化两条收入线。'],
  blocks: [
    { t:'card', mt:false, title:['Nameplate → revenue bridge','铭牌容量至收入桥'], badges:['calc','illus'], live:true, blocks:[
      { t:'flow', items:[
        ['Connection application','并网申请'], ['Connection conditions issued','已签发并网条件'],
        ['Executed connection agreement','已签并网协议'], ['Certification for the capacity auction','容量拍卖认证'],
        ['Capacity contract awarded','取得容量合同'], ['Energisation & market registration','送电与市场注册'],
      ] },
      { t:'ladder', items:[
        { n:['Connection application','并网申请'], d:['Not evidence. Applications substantially exceed available capacity and refusals are common.','不构成证据。申请量大幅超过可用容量，拒批常见。'] },
        { n:['Connection conditions','并网条件'], d:['The first tier that is evidence, with a defined capacity and validity period. This is also what enables certification.','第一个构成证据的层级，载明容量与有效期。它同时也是通过认证的前提。'] },
        { n:['Executed connection agreement','已签并网协议'], d:['Works scope, cost allocation and delivery schedule become binding.','工程范围、费用分担与交付进度在此具备约束力。'] },
        { n:['Certification','认证'], d:['Technical parameters and duration are declared to the auction. A declaration that cannot be met later becomes a penalty.','向拍卖申报技术参数与时长。日后无法满足的申报将转化为罚金。'] },
        { n:['Capacity contract','容量合同'], d:['The revenue line and the obligation begin here. Everything before it is development risk.','收入线与义务自此开始。此前的一切均属开发风险。'] },
      ] },
      { t:'why', text:['Five tiers with a compounding failure mode. In an energy-only market a connection delay costs a year of spread; in Poland it can cost the auction, and with it the ' + O.cmAgreementYears + '-year contract that makes the project financeable at all. That asymmetry is why Polish diligence should be front-loaded onto the connection and certification chain, and why a long-stop tied to energisation is worth more here than in any other market in this set.',
        '五个层级，且存在叠加失效模式。在单一电能量市场中，并网延迟的代价是一年的价差；在波兰，其代价可能是错过拍卖，进而失去使项目得以融资的' + O.cmAgreementYears + '年合同。这一不对称正是波兰的尽调应前置于并网与认证链条的原因，也是将最终截止日挂钩送电在本样本中于此地价值最高的原因。'],
        sig:['A connection delay can cost the contract','并网延迟可能导致失去合同'] },
    ] },

    { t:'card', title:['Why connection is rationed — and what that means for competition','并网为何受配给 — 及其对竞争的含义'], badges:['verify'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['Connection pipeline (seed)','并网管线（种子）'], v:fmt1(O.pipelineGW) + '<small> GW</small>', d:['against ' + fmtN(O.fleetMW) + ' MW operating','对比在运' + fmtN(O.fleetMW) + 'MW'], b:['illus'] },
        { l:['Contracted storage (seed)','已签约储能（种子）'], v:fmt1(O.cmAwardedBessGW) + '<small> GW</small>', d:['the subset with a contractual obligation to connect','其中负有合同并网义务的部分'], b:['verify'] },
        { l:['Pipeline / operating multiple','管线对在运倍数'], v:fmt1(O.pipelineGW * 1000 / O.fleetMW) + '<small>×</small>', d:['most of it will not obtain connection conditions','其中大部分无法取得并网条件'], b:['calc'] },
        { l:['Primary rationing mechanism','主要配给机制'], v:L(['Connection refusals','并网拒批']), d:['not capital, permitting or policy','并非资本、许可或政策'], b:['verify'] },
      ] },
      { t:'why', text:['A pipeline of ' + fmt1(O.pipelineGW) + ' GW against ' + fmtN(O.fleetMW) + ' MW operating would be alarming if it could all connect. It cannot — connection capacity is the rationing mechanism, and refusals are the normal outcome rather than the exception. The practical consequence for competitive analysis is that the only competitor worth counting is one that already holds connection conditions and a capacity contract; ' + fmt1(O.cmAwardedBessGW) + ' GW meets that test and the rest should be weighted at a fraction of face value.',
        '若' + fmt1(O.pipelineGW) + 'GW的管线能全部并网，相对于在运的' + fmtN(O.fleetMW) + 'MW将令人警惕。但它不能 — 并网容量是配给机制，拒批是常态而非例外。对竞争分析的实务含义是：唯一值得计入的竞争者是已同时持有并网条件与容量合同者；符合该标准的为' + fmt1(O.cmAwardedBessGW) + 'GW，其余应按面值的一小部分加权。'],
        sig:['Count only contracted competitors','只计入已签约的竞争者'] },
      { t:'src', src: SRC.conn, use:['Connection conditions issuance and refusal statistics','并网条件签发与拒批统计'] },
    ] },

    { t:'card', title:['Connection risk → suggested commercial protections','并网风险 → 建议商业保护条款'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Risk','风险'],['Protection','保护条款'],['Trigger to invoke','触发条件']], rows:[
        [{b:['Connection conditions expire or capacity reduced','并网条件失效或容量被削减']},
         ['Validity-period covenant with an extension obligation and a price adjustment per MW of shortfall','有效期契约，附延期义务及按缺口MW调整价款'],
         ['Less than twelve months of validity remaining at signing','签约时剩余有效期不足十二个月']],
        [{b:['Works programme slips past the auction certification window','工程计划落后于拍卖认证窗口']},
         ['Long-stop tied to energisation, not to agreement execution; damages for a missed auction year','最终截止日挂钩送电而非协议签署；对错过拍卖年度约定赔偿'],
         ['Any revision to the network works schedule','网络工程进度的任何修订']],
        [{b:['Declared duration cannot be met over the contract term','申报时长在合同期内无法维持']},
         ['Degradation covenant keeping usable duration above the declared value, plus a documented augmentation path','衰减契约以维持可用时长高于申报值，并附有据可查的增容路径'],
         ['Modelled year-' + O.cmAgreementYears + ' duration within 10% of the declared value','模型第' + O.cmAgreementYears + '年时长距申报值不足10%']],
        [{b:['Correction factor revised downward before award','中标前折减系数被下调']},
         ['Sensitivity in the model and a price adjustment mechanism between signing and auction','模型中设置敏感性分析，并在签约至拍卖之间设定价款调整机制'],
         ['Publication of a revised correction-factor table','修订后折减系数表的发布']],
        [{b:['Reinforcement cost reallocated to the project','网络加强费用被重新分配给项目']},
         ['Cost-sharing cap above an agreed threshold with clear delivery responsibility','超出约定阈值的成本分担上限及明确的交付责任划分'],
         ['Any revision to the works scope or cost estimate','工程范围或费用估算的任何修订']],
      ] },
      { t:'why', text:['Every protection here converts a timing or regulatory risk into a priced or allocated one. The two that are distinctively Polish are the long-stop tied to energisation with damages for a missed auction year, and the degradation covenant tied to the declared duration — the first because missing the auction costs the contract rather than a year, and the second because the obligation runs for ' + O.cmAgreementYears + ' years while the asset degrades throughout.',
        '此处每项保护都把时点或监管风险转化为可定价或可分配的风险。真正属波兰特有的是两项：将最终截止日挂钩送电并对错过拍卖年度约定赔偿，以及与申报时长挂钩的衰减契约 — 前者因为错过拍卖损失的是合同而非一年，后者因为义务持续' + O.cmAgreementYears + '年而资产在此期间持续衰减。'],
        sig:['Missing the auction costs the contract','错过拍卖即失去合同'] },
    ] },
  ] };
};

// ============================== POLAND vs ROMANIA (peer benchmark) ==============================
// Mirrors the WA dashboard's "WEM vs NEM" section: the only tab that uses peer-market
// data, held in a separate namespace and excluded from every Poland scoring input.
  SEC_B.grid = () => buildPLGridSection({ SRC, M });

/* Investment Case and Entry: the investment-view revision. The content is the
   shared component, which reads this market's view and ledger as its dashboard
   registered them. There is no build pathway for this market yet, so Entry is
   the ledger. */

  return SEC_B.grid;
}
