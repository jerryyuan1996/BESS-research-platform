/* Romania — the `pipeline` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, NF2, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

SEC_B.pipeline = function (){
  const mw = pipelineByYear('MW');
  const totRaw = mw.raw.reduce((a, b) => a + b, 0), totPw = mw.pw.reduce((a, b) => a + b, 0);
  return {
  head: ['Project Pipeline — probability-weighted, with MW and MWh separated','项目管线 — 概率加权，MW与MWh分列'],
  cap: ['A pipeline is a distribution, not a number. In Romania the gate that matters is the ATR plus an executed connection agreement, and the announced pipeline sits mostly below it.',
        '管线是一个分布而非一个数字。在罗马尼亚，关键门槛是ATR加已签并网合同，而已公告管线大部分尚未跨过该门槛。'],
  blocks: [
    { t:'card', mt:false, title:['Stage probabilities — the gate is the discount','阶段概率 — 门槛即折减'], badges:['calc'], live:false, blocks:[
      { t:'stageProb' },
      { t:'why', text:['The probability step that matters is establishment authorisation (25%) to ATR obtained (45%) to ready-to-build (70%). ' + fmtN(O.authFeb2026MW) + ' MW of authorisations approved in a single regulatory meeting therefore represents roughly ' + fmtN(O.authFeb2026MW * 0.25) + ' MW on a probability-weighted basis — real, but a quarter of the headline. Announcements and authorisations are the two numbers most often quoted and the two least informative.',
        '真正关键的概率跃迁是由设立许可（25%）到取得ATR（45%）再到具备开工条件（70%）。因此单次监管会议核准的' + fmtN(O.authFeb2026MW) + 'MW许可，按概率加权约相当于' + fmtN(O.authFeb2026MW * 0.25) + 'MW — 真实存在，但仅为表面数字的四分之一。公告与许可是最常被引用、也最缺乏信息量的两个数字。'],
        sig:['Authorisations are worth a quarter of headline','许可的实际价值约为表面数字的四分之一'] },
    ] },
    { t:'g2', cards:[
      { title:['COD pipeline by year — MW','按投运年度的管线 — MW'], badges:['illus'], live:true, blocks:[
        { t:'pipeChart', unit:'MW' },
        { t:'why', text:['Probability weighting removes ' + fmtPct((1 - totPw / totRaw) * 100, 0) + '% of announced MW across the seed register. In a market with no capacity payment, that discount matters more than elsewhere: competing MW arrives directly against your spread with nothing to cushion it.',
          '在种子登记表中，概率加权剔除了已公告MW的' + fmtPct((1 - totPw / totRaw) * 100, 0) + '%。在没有容量付费的市场中，这一折减比其他市场更重要：竞争性MW直接冲击你的价差，且没有任何缓冲。'],
          sig:['Competing MW hits the spread directly','竞争性MW直接冲击价差'] },
      ] },
      { title:['COD pipeline by year — MWh','按投运年度的管线 — MWh'], badges:['illus'], live:true, blocks:[
        { t:'pipeChart', unit:'MWh' },
        { t:'why', text:['MWh is the series that predicts spread compression, and in Romania it is the only saturation series that matters — there is no capacity auction for MW to saturate. Track MWh reaching energisation quarterly; it is the leading indicator for the captured-spread decline from ' + fmtC(M.codCases[2027].central) + ' to ' + fmtC(M.codCases[2029].central) + '/MWh.',
          'MWh序列预测价差压缩，而在罗马尼亚它是唯一重要的饱和序列 — 因为不存在可供MW饱和的容量拍卖。应按季度跟踪达到送电的MWh；它是捕获价差由' + fmtC(M.codCases[2027].central) + '降至' + fmtC(M.codCases[2029].central) + '/MWh的领先指标。'],
          sig:['Track MWh energised, quarterly','按季度跟踪已送电MWh'] },
      ] },
    ] },
    { t:'card', title:['Project register — illustrative placeholders, not real facilities','项目登记表 — 示例占位，非真实项目'], badges:['illus'], live:true, blocks:[
      { t:'projTable' },
      { t:'note', text:['All projects shown are illustrative placeholders, tagged by county so locational concentration can be checked. Replace with a register built from ATR issuance and establishment authorisations before any transaction use, and de-duplicate against the indicative capacity map, which is a screening tool only.',
        '所示项目均为示例占位，并按县标注以便检查区位集中度。任何交易用途前，须以基于ATR签发与设立许可构建的登记数据替换，并与示意性容量地图去重 — 后者仅为筛选工具。'] },
    ] },
  ] };
};

// ============================== GRID & PERMITTING ==============================

  return SEC_B.pipeline;
}
