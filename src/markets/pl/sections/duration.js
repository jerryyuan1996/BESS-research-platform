/* Poland — the `duration` section.
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
  head: ['Storage Duration — does the design meet the obligation, not just the factor?','储能时长 — 设计是否满足义务，而不仅是系数？'],
  cap: ['Poland pays for duration twice: through the correction factor at the auction, and through the capacity obligation during system stress events. The second is the one most often missed, and it is a compliance requirement rather than a revenue optimisation.',
        '波兰为时长付费两次：通过拍卖中的折减系数，以及通过系统紧张事件期间的容量义务。后者最常被忽略，且它是合规要求而非收入优化。'],
  blocks: [
    { t:'card', mt:false, title:['Duration answers three different questions','时长回答三个不同问题'], badges:['calc','verify'], live:false, blocks:[
      { t:'table', head:[['Question','问题'],['Mechanism','机制'],['Answer for Poland at 2h → 4h','波兰由2小时增至4小时的答案']], rows:[
        [{b:['How much capacity revenue?','容量收入多少？']}, ['Correction factor at the auction','拍卖中的折减系数'],
         [fmtPct(M.deratingCurve[2] * 100, 0) + ' → ' + fmtPct(M.deratingCurve[4] * 100, 0) + ' of nameplate; +' + fmtCk(perNameplate(4) - perNameplate(2)) + '/MW/yr for ' + O.cmAgreementYears + ' years',
          '折减系数由' + fmtPct(M.deratingCurve[2] * 100, 0) + '升至' + fmtPct(M.deratingCurve[4] * 100, 0) + '；每MW/年增加' + fmtCk(perNameplate(4) - perNameplate(2)) + '，持续' + O.cmAgreementYears + '年']],
        [{b:['How much merchant revenue?','市场化收入多少？']}, ['Deeper cycles across a solar-driven price shape','在光伏驱动的价格形态中进行更深循环'],
         ['Positive but sub-linear — 4h captures ' + fmtPct(M.durSpreadFactor[4] * 100, 0) + ' of the 2h spread capture rate',
          '为正但呈次线性 — 4小时的价差捕获率为2小时的' + fmtPct(M.durSpreadFactor[4] * 100, 0)]],
        [{b:['Can I meet the obligation?','能否履行义务？']}, ['Capacity obligation during multi-hour system stress events','多小时系统紧张事件期间的容量义务'],
         ['Settled by certification. Capacity counts only as MWh ÷ 4, so a certified obligation can be delivered for four hours by construction; a 2h asset is paid less, not exposed more.',
          '由认证规则解决。容量仅按MWh÷4计入，因此经认证的义务按设计即可连续交付四小时；2小时资产是少获付费，而非承担更大敞口。']],
      ] },
      { t:'wf', cfg:{ yfmt: v => fmtC(v) + 'k', h: 280, steps: M.marginalHour } },
      { t:'why', text:['The fourth hour nets about ' + fmtC(M.marginalHour[M.marginalHour.length - 1].v) + 'k/MW/yr on the arithmetic. The correction factor now adds only a few thousand for hours three and four, because the factor is 13.39% at every duration and a battery below four hours simply certifies less. The certification rule also removes the old argument for four hours: an obligation sized at MWh ÷ 4 cannot run out of energy when tested. In Poland the case for the fourth hour now rests on the merchant line and on balancing, not on the capacity contract.',
        '按算术计算，第4小时净值约' + fmtC(M.marginalHour[M.marginalHour.length - 1].v) + 'k/MW/年。折减系数对第三、第四小时的贡献已仅为数千欧元，因为各时长的系数均为13.39%，不足四小时的电池只是获认证的容量更少。认证规则也消除了支持四小时的旧论据：按MWh÷4确定的义务在受检验时不会耗尽能量。在波兰，第四小时的理由如今取决于市场化收入与平衡市场，而非容量合同。'],
        sig:['The capacity contract no longer pays for the fourth hour','容量合同已不再为第四小时付费'] },
    ] },

    { t:'card', title:['Duration-Need Index — every component visible and editable','时长需求指数 — 分项全部可见、可编辑'], badges:['calc','illus'], live:true, blocks:[
      { t:'scorecard', id:'durFactors', bands:'durBands' },
      { t:'why', text:['The index sits at ' + dni + '/100 — ' + L(band.n) + '. Three factors score 3: the correction-factor uplift, solar-driven trough depth and negative-price frequency. All three point to the same design, which is unusual — in most markets the physical and regulatory signals disagree on duration. The one factor holding the index down is cross-border coupling, because Poland is well interconnected and imports damp extreme spreads. Read together: 4h is supported by both the mechanism and the physics.',
        '该指数为' + dni + '/100 — ' + L(band.n) + '。有三个因子评分为3：折减系数增益、光伏驱动的低谷深度、以及负电价频率。三者指向同一设计，这并不常见 — 在多数市场中，物理信号与监管信号在时长上并不一致。唯一压低指数的因子是跨境耦合，因为波兰互联良好，进口平抑了极端价差。综合解读：4小时同时获得机制与物理两方面的支持。'],
        sig:['Mechanism and physics agree on 4h','机制与物理在4小时上一致'] },
    ] },

    { t:'card', title:['Augmentation readiness — protecting the obligation over 17 years','增容准备度 — 在十七年内保护容量义务'], badges:['illus'], live:false, blocks:[
      { t:'aug' },
      { t:'why', text:['In Poland augmentation is a compliance tool as much as a value tool. Usable duration must stay above the declared value for the full ' + O.cmAgreementYears + '-year obligation, so an augmentation path is what keeps a degrading asset compliant in years twelve to seventeen. The two items most often lost are the coverage of added MWh in the connection conditions and in the building permit — both are cheap at the outset and effectively impossible to retrofit.',
        '在波兰，增容既是价值工具也是合规工具。可用时长须在整个' + O.cmAgreementYears + '年义务期内保持高于申报值，因此增容路径正是使衰减中的资产在第十二至十七年仍保持合规的手段。最常被遗漏的两项是并网条件与建设许可对新增MWh的覆盖 — 两者在起始阶段成本低廉，事后则几乎无法补救。'],
        sig:['Augmentation keeps you compliant, not just richer','增容不仅带来收益，更保障合规'] },
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
