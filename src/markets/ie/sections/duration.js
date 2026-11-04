/* Ireland — the `duration` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O, perNameplate } = createShared(api);
  const SEC_B = {};

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
    
    /* Relocated from the Investment Lab tab, which moved to a dedicated page. The
       duration question is a market question — where the de-rating uplift stops
       covering the MWh capex — so it belongs beside the rest of this tab rather
       than inside a returns model. */
    { t:'card', title:['Duration and route — what each design is worth','时长与路径 — 各设计的价值'], badges:['calc'], live:false, blocks:[
      { t:'designFit' },
      { t:'cap', text:['Every route this market supports, at every duration it declares, priced by the comparison engine the league table uses; at the modelled duration it is the league table case itself. Value is the exit value at commercial operation, at the platform exit yields, less net capital, per MW. A design within 2% of the capital of the modelled design of the best one is in the band. A route priced at one duration is shown there only, and a duration floor must hold to the end of its term.',
        '本市场支持的每一条路径、在其声明的每一个时长下，均由排行榜所用的同一比较引擎定价；在当前模型时长下即为排行榜本身的情景。价值为投运时按平台退出收益率计算的退出价值减去净资本，按每MW计。与最佳设计相差不超过当前模型设计资本2%的设计视为位于区间之内。仅在单一时长下定价的路径只在该时长下显示，且时长下限须维持至期限结束。'] },
      { t:'why', text:['Judge a duration on what it adds to value, not on headline IRR: a longer asset can carry a lower IRR and a higher value, and the capital committed differs several-fold down this table. Read the band before the best point, because inside it the inputs cannot separate the designs.',
        '判断时长应看其对价值的贡献，而非项目整体IRR：更长的资产可能IRR更低而价值更高，且本表各行所投入的资本相差数倍。应先看区间，再看最佳点，因为在区间之内，输入数据无法区分各设计。'],
        sig:['Read the band, then the best point','先看区间，再看最佳点'] },
    ] },
  ] };
};

// ============================== PIPELINE ==============================

  return SEC_B.duration;
}
