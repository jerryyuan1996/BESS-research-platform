/* Romania — the `services` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, NF2, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { eur, fmtRON } = createShared(api);
  const SEC_B = {};

SEC_B.services = function (){
  return {
  head: ['Balancing & Reserves — real revenue, largely unevidenced','平衡与备用 — 收入真实，但大多缺乏证据'],
  cap: ['Balancing is where Romanian storage models find their upside and where they are least supported by evidence. This tab separates what is observable from what is assumed, using an explicit five-tier evidence ladder.',
        '平衡市场是罗马尼亚储能模型寻找上行空间之处，也是其证据支持最薄弱之处。本页以显式的五级证据阶梯，区分可观察事实与假设。'],
  blocks: [
    { t:'card', mt:false, title:['Reserve products — requirement, price and direction','备用产品 — 需求、价格与方向'], badges:['illus','verify'], live:true, blocks:[
      { t:'table', head:[['Product','产品'],['Direction','方向'],['Requirement (MW)','需求(MW)'],['Capacity price (€/MW/h)','容量价格(€/MW/h)'],['Battery suitability','电池适配度']], num:[2,3],
        rows:[
          [{ b:['FCR — ' + M.balProducts[0].n[0], 'FCR — ' + M.balProducts[0].n[1]] }, M.balProducts[0].dir, fmtN(M.balProducts[0].reqMW), fmtC(M.balProducts[0].capEurMWh), { chip:'good', text:['High — power, not energy','高 — 需功率而非能量'] }],
          [{ b:['aFRR — ' + M.balProducts[1].n[0], 'aFRR — ' + M.balProducts[1].n[1]] }, M.balProducts[1].dir, fmtN(M.balProducts[1].reqMW), fmtC(M.balProducts[1].capEurMWh), { chip:'good', text:['High — the main battery product','高 — 电池的主力产品'] }],
          [{ b:['mFRR — ' + M.balProducts[2].n[0], 'mFRR — ' + M.balProducts[2].n[1]] }, M.balProducts[2].dir, fmtN(M.balProducts[2].reqMW), fmtC(M.balProducts[2].capEurMWh), { chip:'warn', text:['Moderate — deep volume, low price','中等 — 量大价低'] }],
        ] },
      { t:'bar', cfg:{ xs: M.balProducts.map(p => p.id), mode:'group', bw: 26, yfmt: v => fmtN(v), h: 240,
        series:[
          { name:['Requirement (MW)','需求(MW)'], color:'var(--s1)', vals: M.balProducts.map(p => p.reqMW) },
          { name:['Capacity price (€/MW/h)','容量价格(€/MW/h)'], color:'var(--s3)', vals: M.balProducts.map(p => p.capEurMWh) },
        ] } },
      { t:'why', text:['The product structure is the familiar European one and the economics point the same way as everywhere else: the small, fast, power-based products pay the highest unit price and saturate first; the large, slow, energy-based product pays least per MW but has the deepest volume. A 2-hour Romanian battery should target aFRR as its primary balancing product and treat mFRR as volume filler, not the reverse.',
        '产品结构为欧洲通行形态，其经济性指向与其他市场一致：规模小、响应快、以功率为基础的产品单位价格最高且最先饱和；规模大、响应慢、以能量为基础的产品单位价格最低但成交量最深。罗马尼亚的2小时电池应以aFRR为主力平衡产品，并将mFRR作为成交量补充，而非相反。'],
        sig:['aFRR primary, mFRR filler','aFRR为主力，mFRR作补充'] },
      { t:'src', src: SRC.tel, use:['Reserve procurement volumes, capacity prices and activation results','备用采购量、容量价格与激活结果'] },
    ] },

    { t:'card', title:['aFRR capacity price trend — the saturation signal','aFRR容量价格趋势 — 饱和信号'], badges:['illus'], live:true, blocks:[
      { t:'line', cfg:{ xs: M.qLabels, yfmt: v => fmtC(v), h: 220, ymin: 0,
        series:[{ name:['aFRR-up capacity price (€/MW/h)','aFRR上调容量价格（€/MW/h）'], color:'var(--s6)', vals: M.afrrCapSeries }] } },
      { t:'kpis', items:[
        { l:['aFRR-up capacity price change','aFRR上调容量价格变化'], v:fmtPct((M.afrrCapSeries[5] / M.afrrCapSeries[0] - 1) * 100, 0), d:['over six quarters','六个季度内'], cls:'down', b:['illus'] },
        { l:['Average activation price, up','平均上调激活价格'], v:fmtRON(M.balActUp) + '<small>/MWh</small>', d:['≈ ' + fmtC(eur(M.balActUp)) + '/MWh','≈ ' + fmtC(eur(M.balActUp)) + '/MWh'], b:['illus'] },
        { l:['Average activation price, down','平均下调激活价格'], v:fmtRON(M.balActDn) + '<small>/MWh</small>', d:['≈ ' + fmtC(eur(M.balActDn)) + '/MWh — the charging opportunity','≈ ' + fmtC(eur(M.balActDn)) + '/MWh — 充电机会'], b:['illus'] },
      ] },
      { t:'why', text:['The aFRR capacity price is already down ' + fmtPct(Math.abs(M.afrrCapSeries[5] / M.afrrCapSeries[0] - 1) * 100, 0) + '% over six quarters as more capable capacity qualifies — the same pattern GB and Ireland went through, arriving in Romania later and from a lower base. Model balancing capacity revenue flat at best, and note that the up/down activation spread is itself a trading opportunity: being paid ' + fmtC(eur(M.balActUp)) + '/MWh to discharge and ' + fmtC(eur(M.balActDn)) + '/MWh to charge is a wider margin than the day-ahead spread, when it is available.',
        '随着更多有能力的容量取得资格，aFRR容量价格在六个季度内已下降' + fmtPct(Math.abs(M.afrrCapSeries[5] / M.afrrCapSeries[0] - 1) * 100, 0) + '% — 与英国、爱尔兰经历的模式相同，只是在罗马尼亚出现更晚、起点更低。平衡容量收入最多按持平建模；同时须注意上调/下调激活价差本身即是交易机会：以' + fmtC(eur(M.balActUp)) + '/MWh放电、以' + fmtC(eur(M.balActDn)) + '/MWh充电，在可获得时其margin宽于日前价差。'],
        sig:['Activation spread beats the day-ahead spread','激活价差优于日前价差'] },
    ] },

    { t:'card', title:['Evidence ladder — underwrite only to the tier the project has reached','证据阶梯 — 只按项目已达到的层级承销'], badges:['calc'], live:false, blocks:[
      { t:'ladder', items: M.evidenceLadder },
      { t:'warn', text:['Most Romanian projects presented to investors sit at tier 1: published market results exist, but the specific project has no prequalification, no reproducible backtest and no activation record. Balancing revenue claimed above the tier reached is an assumption, not a forecast.',
        '向投资人展示的多数罗马尼亚项目处于第1级：公开市场结果确实存在，但具体项目既无预认证、无可复现回测，也无激活记录。超出所达层级的平衡收入主张是假设，而非预测。'] },
      { t:'why', text:['This ladder is the single most useful diligence tool in the Romanian dashboard because it converts a vague question ("is the balancing revenue real?") into a documentary one ("which tier has this project reached, and what is the document?"). At ' + fmtCk(M.lab.servicesKW * 1000) + '/MW/yr the balancing line is roughly ' + fmtPct(M.lab.servicesKW * 1000 / (M.lab.servicesKW * 1000 + M.lab.spread * 2 * 0.91 * 1.4 * 365 * 0.96) * 100, 0) + '% of a 2-hour asset’s gross revenue — large enough that an unevidenced assumption here can carry an otherwise failing case over the line.',
        '这一阶梯是罗马尼亚看板中最有用的单项尽调工具，因为它把一个模糊问题（“平衡收入是否真实？”）转化为文件问题（“该项目达到哪一层级？对应文件是什么？”）。按' + fmtCk(M.lab.servicesKW * 1000) + '/MW/年计，平衡收入约占2小时资产毛收入的' + fmtPct(M.lab.servicesKW * 1000 / (M.lab.servicesKW * 1000 + M.lab.spread * 2 * 0.91 * 1.4 * 365 * 0.96) * 100, 0) + ' — 其规模足以使一个本不成立的投资案例因这一未经证实的假设而勉强通过。'],
        sig:['Which tier, and what is the document?','处于哪一层级？文件是什么？'] },
    ] },
  ] };
};

// ============================== STORAGE DURATION ==============================

  return SEC_B.services;
}
