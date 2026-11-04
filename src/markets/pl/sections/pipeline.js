/* Poland — the `pipeline` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const SEC_B = {};

SEC_B.pipeline = function (){
  const mw = pipelineByYear('MW');
  const totRaw = mw.raw.reduce((a, b) => a + b, 0), totPw = mw.pw.reduce((a, b) => a + b, 0);
  return {
  head: ['Project Pipeline — probability-weighted, with MW and MWh separated','项目管线 — 概率加权，MW与MWh分列'],
  cap: ['A pipeline is a distribution, not a number. In Poland the decisive gate is the capacity contract: a project holding one has a contractual reason to be built, and everything below that gate is optional.',
        '管线是一个分布而非一个数字。在波兰，决定性门槛是容量合同：持有合同的项目有合同上的建设理由，而该门槛之下的一切都是可选的。'],
  blocks: [
    { t:'card', mt:false, title:['Stage probabilities — the gate is the discount','阶段概率 — 门槛即折减'], badges:['calc'], live:false, blocks:[
      { t:'stageProb' },
      { t:'why', text:['The decisive probability step is certification (55%) to a capacity contract plus connection agreement (80%). That 25-point jump is larger than in any other market in this comparison set, because a Polish capacity contract creates a legal obligation to deliver rather than merely an economic incentive. When assessing competitors, the only question that matters is whether they hold a contract — everything below that gate is genuinely optional and should be weighted accordingly.',
        '决定性的概率跃迁是由通过认证（55%）到取得容量合同加并网协议（80%）。这25个百分点的跳升大于本对比样本中的任何其他市场，因为波兰的容量合同产生的是法定交付义务，而非仅仅是经济激励。评估竞争者时，唯一重要的问题是其是否持有合同 — 该门槛之下的一切确实是可选的，应据此加权。'],
        sig:['A contract is an obligation to build','合同即是建设义务'] },
    ] },
    { t:'g2', cards:[
      { title:['COD pipeline by year — MW','按投运年度的管线 — MW'], badges:['illus'], live:true, blocks:[
        { t:'pipeChart', unit:'MW' },
        { t:'why', text:['Probability weighting removes ' + fmtPct((1 - totPw / totRaw) * 100, 0) + '% of announced MW across the seed register. In Poland the weighting is more reliable than elsewhere because the top stages are contractually obliged to deliver — which means the probability-weighted figure is closer to a forecast and further from an estimate.',
          '在种子登记表中，概率加权剔除了已公告MW的' + fmtPct((1 - totPw / totRaw) * 100, 0) + '%。在波兰，该加权比其他市场更可靠，因为顶层阶段负有合同交付义务 — 这意味着概率加权数值更接近预测，而非估算。'],
          sig:['Weighting is more reliable here','此处的加权更可靠'] },
      ] },
      { title:['COD pipeline by year — MWh','按投运年度的管线 — MWh'], badges:['illus'], live:true, blocks:[
        { t:'pipeChart', unit:'MWh' },
        { t:'why', text:['MWh predicts spread compression; MW predicts capacity-auction competition. In Poland both matter and they arrive together, because the correction factor pushes new build toward 4 hours — so each contracted MW brings more MWh than the operating fleet average, compressing the spread faster than the MW count alone implies.',
          'MWh预测价差压缩；MW预测容量拍卖竞争。在波兰两者都重要且同步到来，因为折减系数推动新建走向4小时 — 因此每一个签约MW带来的MWh高于在运机组平均水平，其对价差的压缩速度快于仅看MW数量所显示的水平。'],
          sig:['4h new build compresses spreads faster','4小时新建对价差的压缩更快'] },
      ] },
    ] },
    { t:'card', title:['Project register — illustrative placeholders, not real facilities','项目登记表 — 示例占位，非真实项目'], badges:['illus'], live:true, blocks:[
      { t:'projTable' },
      { t:'note', text:['All projects shown are illustrative placeholders, tagged by region so locational concentration can be checked. Replace with a register built from the capacity-market certification and award lists cross-referenced against issued connection conditions before any transaction use.',
        '所示项目均为示例占位，并按地区标注以便检查区位集中度。任何交易用途前，须以容量市场认证与中标名单、并与已签发的并网条件交叉核对后构建的登记数据替换。'] },
      { t:'src', src: SRC.pse, use:['Certification register and capacity-auction award lists','认证登记册与容量拍卖中标名单'] },
    ] },
  ] };
};

// ============================== GRID & CONNECTION ==============================

  return SEC_B.pipeline;
}
