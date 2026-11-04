/* Poland — the `services` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O, perNameplate, plMerchantPerMW } = createShared(api);
  const SEC_B = {};

SEC_B.services = function (){
  return {
  head: ['Balancing & Reserves — supplementary revenue on a post-reform basis','平衡与备用 — 改革后口径下的补充性收入'],
  cap: ['Balancing is a supplementary line in Poland because the capacity contract already provides the floor. The specific discipline here is temporal: the balancing reform changed settlement and dispatch, so pre-reform history is a different market.',
        '在波兰，平衡收入属补充性，因为容量合同已提供保底。此处特有的纪律是时间性的：平衡市场改革改变了结算与调度机制，因此改革前的历史属于另一个市场。'],
  blocks: [
    { t:'card', mt:false, title:['Reserve products — requirement, price and battery suitability','备用产品 — 需求、价格与电池适配度'], badges:['illus','verify'], live:true, blocks:[
      { t:'table', head:[['Product','产品'],['Direction','方向'],['Requirement (MW)','需求(MW)'],['Capacity price (€/MW/h)','容量价格(€/MW/h)'],['Battery suitability','电池适配度']], num:[2,3],
        rows: M.balProducts.map((p, i) => [
          { b: [p.id + ' — ' + p.n[0], p.id + ' — ' + p.n[1]] }, p.dir, fmtN(p.reqMW), fmtC(p.capEurMWh),
          i === 2 ? { chip:'warn', text:['Moderate — deep volume, low price','中等 — 量大价低'] } : { chip:'good', text:['High — power, not energy','高 — 需功率而非能量'] },
        ]) },
      { t:'bar', cfg:{ xs: M.balProducts.map(p => p.id), mode:'group', bw: 26, yfmt: v => fmtN(v), h: 240,
        series:[
          { name:['Requirement (MW)','需求(MW)'], color:'var(--s1)', vals: M.balProducts.map(p => p.reqMW) },
          { name:['Capacity price (€/MW/h)','容量价格(€/MW/h)'], color:'var(--s3)', vals: M.balProducts.map(p => p.capEurMWh) },
        ] } },
      { t:'why', text:['The familiar European shape: small, fast, power-based products pay the highest unit price and saturate first; the large, slow, energy-based product pays least per MW but has the deepest volume. A 4-hour Polish battery holding a capacity contract should target aFRR as its primary balancing product, and should size mFRR participation against the state-of-charge it must preserve for the capacity obligation — the two compete for the same energy.',
        '这是欧洲通行的形态：规模小、响应快、以功率为基础的产品单位价格最高且最先饱和；规模大、响应慢、以能量为基础的产品单位价格最低但成交量最深。持有容量合同的波兰4小时电池应以aFRR为主力平衡产品，并须对照为履行容量义务而须保留的荷电状态来确定mFRR参与规模 — 两者争夺同一批能量。'],
        sig:['mFRR competes with the capacity obligation','mFRR与容量义务争夺能量'] },
      { t:'src', src: SRC.bal, use:['Reserve procurement volumes, capacity prices and the post-reform framework','备用采购量、容量价格与改革后框架'] },
    ] },

    { t:'card', title:['aFRR capacity price trend — the saturation signal','aFRR容量价格趋势 — 饱和信号'], badges:['illus'], live:true, blocks:[
      { t:'line', cfg:{ xs: M.pxLabels, yfmt: v => fmtC(v), h: 220, ymin: 0,
        series:[{ name:['aFRR capacity price (€/MW/h, seed)','aFRR容量价格（€/MW/h，种子）'], color:'var(--s6)', vals: M.afrrCapSeries }] } },
      { t:'why', text:['The aFRR capacity price is down ' + fmtPct(Math.abs(M.afrrCapSeries[5] / M.afrrCapSeries[0] - 1) * 100, 0) + '% over six quarters as more capable capacity certifies — the same pattern observed in GB, Ireland and Romania, arriving in Poland with ' + fmt1(O.cmAwardedBessGW) + ' GW of contracted storage still to connect. Model this line flat at best and exclude it from debt sizing; the capacity contract is what lenders will size against, and that is a structural advantage rather than a limitation.',
        '随着更多有能力的容量通过认证，aFRR容量价格在六个季度内下降' + fmtPct(Math.abs(M.afrrCapSeries[5] / M.afrrCapSeries[0] - 1) * 100, 0) + '% — 与英国、爱尔兰及罗马尼亚观察到的模式相同，而波兰尚有' + fmt1(O.cmAwardedBessGW) + 'GW已签约储能待并网。该收入线最多按持平建模并排除于债务规模测算之外；贷款人据以安排规模的是容量合同，而这是结构性优势而非限制。'],
        sig:['Contracted storage will compress this further','已签约储能将进一步压缩该价格'] },
    ] },

    { t:'card', title:['Evidence ladder — underwrite only to the tier the project has reached','证据阶梯 — 只按项目已达到的层级承销'], badges:['calc'], live:false, blocks:[
      { t:'ladder', items: M.evidenceLadder },
      { t:'warn', text:['Any backtest that spans the ' + O.balancingReformYear + ' balancing reform is measuring two different markets. Split the dataset at the reform date and use post-reform data only — a blended series will overstate or understate the line depending on which side dominates the sample.',
        '任何跨越' + O.balancingReformYear + '年平衡市场改革的回测，实际上在衡量两个不同的市场。应在改革日期分割数据集并仅使用改革后数据 — 混合序列会因样本中哪一侧占主导而高估或低估该收入线。'] },
      { t:'why', text:['At ' + fmtCk(M.lab.servicesKW * 1000) + '/MW/yr the balancing line is roughly ' + fmtPct(M.lab.servicesKW * 1000 / (perNameplate(4) + plMerchantPerMW(4) + M.lab.servicesKW * 1000) * 100, 0) + '% of a 4-hour asset’s gross revenue — small enough that removing it entirely should not break the investment case, and in Poland it genuinely does not, because the capacity contract carries the debt. That is the practical benefit of a capacity mechanism: it makes the least-evidenced revenue line optional rather than load-bearing.',
        '按' + fmtCk(M.lab.servicesKW * 1000) + '/MW/年计，平衡收入约占4小时资产毛收入的' + fmtPct(M.lab.servicesKW * 1000 / (perNameplate(4) + plMerchantPerMW(4) + M.lab.servicesKW * 1000) * 100, 0) + ' — 其规模小到即使完全剔除也不应影响投资结论；而在波兰它确实不会，因为容量合同承担了债务。这正是容量机制的实务益处：它使证据最薄弱的收入线成为可选项而非承重项。'],
        sig:['The capacity contract makes this optional','容量合同使该收入成为可选项'] },
    ] },
  ] };
};

// ============================== STORAGE DURATION ==============================

  return SEC_B.services;
}
