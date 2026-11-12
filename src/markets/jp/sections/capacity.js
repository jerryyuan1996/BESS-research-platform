/* Japan — the `capacity` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const {
    h, L, M, SRC, T, state, GLOSS_CORE,
    fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX,
    liveScore, bandFor, durationAt, interp,
    lensRegions, isCompare, region,
  } = api;
  const { O, N } = createShared(api);
  const SEC_B = {};

  SEC_B.capacity = function (){
    return {
    head: ['Capacity Market & LTDA — two mechanisms, one national framework',
           '容量市场与长期脱碳拍卖 — 两个机制，同一全国框架'],
    cap: ['Both are national. Only the Capacity Market clears by area, and only for one delivery year at a time — which is why this platform classifies its payment as secured for one year and everything after as auction-renewal.',
          '二者均为全国机制。仅容量市场按区域出清，且每次仅覆盖一个实需年度 — 因此本平台将其付费归类为“锁定一年”，其后年份归类为“拍卖续约”。'],
    blocks: [
      { t: 'card', mt: false, title: ['Capacity Market architecture', '容量市场架构'], badges: ['official'], live: false,
        src: SRC.occtoCm2029, srcUse: ['Delivery-year 2029 main auction result', '2029实需年度主拍卖结果'], blocks: [
        { t: 'flow', items: [['Main auction', '主拍卖'], ['Capacity Securing Contract', '容量确保合同'], ['Delivery year', '实需年度'], ['Availability obligation', '可用性义务'], ['Payment / penalty', '付费/罚则']] },
        { t: 'table',
          head: [['Area', '区域'], ['2029 area price (¥/kW/yr)', '2029区域价格（¥/kW/年）'], ['Contracted (kW)', '已签约（kW）'], ['Share of set', '占样本比重']],
          num: [1, 2, 3],
          rows: N.capacity2029.areas.map(a => {
            const tot = N.capacity2029.areas.reduce((s, x) => s + x.contractedKW, 0);
            return [{ b: a.n }, fmtN(a.priceJPYkW), fmtN(a.contractedKW), fmtPct(a.contractedKW / tot * 100, 0)];
          }) },
        { t: 'why', text: ['Tokyo contracts nearly ten times Hokkaido\'s capacity at a price 0.9% higher. Area price is set by area requirement against area supply, and in a well-supplied national system that converges. The revenue difference between Japanese regions therefore has to be earned in the energy and balancing markets, not collected from the capacity auction.',
                           '东京签约容量接近北海道的十倍，价格却仅高出0.9%。区域价格由区域需求与区域供给决定，在全国供应充足的系统中二者趋于收敛。因此日本各区域间的收入差异必须在电能量与调整力市场中赚取，而非从容量拍卖中获得。'],
          sig: ['Converged price, divergent requirement', '价格收敛，需求分化'] } ] },

      { t: 'card', title: ['Revenue classification — the distinction that changes the valuation',
                           '收入分类 — 决定估值的关键区分'],
        badges: ['calc'], live: false, blocks: [
        { t: 'table',
          head: [['Class', '类别'], ['Definition', '定义']],
          rows: N.revenueClasses.map(c => [{ b: c.n }, c.d]) },
        { t: 'kpis', items: [
          { l: ['Secured tenor, Capacity Market main auction', '容量市场主拍卖锁定年限'], v: '1 ' + L(['yr', '年']) },
          { l: ['Expected-capacity factor applied, 4h', '4小时期待容量系数'], v: fmtPct(O.expectedCapacityFactor * 100, 0), b: ['illus'] },
          { l: ['Renewal assumption, yr 2 → yr 15', '续约假设，第2年→第15年'], v: '90% → 60%', b: ['illus'] },
        ] },
        { t: 'why', text: ['This is the most important modelling decision in the Japan build. A one-year capacity award discounted at the contracted exit yield would value Japan like Poland\'s 17-year contract. Splitting the stream means the secured year is priced as contracted cash flow and years 2 to 15 are priced as market risk — which is what they are.',
                           '这是日本建模中最重要的决策。若将一年期容量中标按合同折现率贴现，日本的估值将等同于波兰的17年合同。将收入流拆分后，锁定年份按合同现金流定价，第2至15年按市场风险定价 — 这才符合其本质。'],
          sig: ['One-year award ≠ long-term contract', '一年中标≠长期合同'] } ] },

      { t: 'card', title: ['LTDA — long-term decarbonization auction', '长期脱碳电源拍卖'],
        badges: ['official'], live: false, src: SRC.occtoLtda2026,
        srcUse: ['Round 3 final results and reviewed rules, 13 May 2026', '第三轮最终结果及已审定规则，2026年5月13日'], blocks: [
        { t: 'note', b: ['Status: ', '状态：'], text: N.policy.ltdaRound3 },
        { t: 'list', items: [
          [['Fixed long-term capacity payment', '固定长期容量付费'], ['The only genuinely long contract available to a Japanese battery.', '日本储能可获得的唯一真正长期合同。']],
          [['Other-market revenue sharing applies', '适用其他市场收入分享'], ['Headline award cannot be added to full JEPX and balancing revenue — a share is returned.', '中标金额不可与完整的JEPX及调整力收入直接相加 — 部分须返还。']],
          [['Project-specific, not a market benchmark', '属项目层面，非市场基准'], ['An award is won by a project, so it does not describe the market a new entrant faces.', '中标由具体项目取得，因而不能描述新进入者所面对的市场。']],
        ] },
        { t: 'warn', text: ['LTDA is deliberately excluded from this platform\'s base case for all three Japan regions. Adding a headline award to full merchant revenue would double count, and assuming every project wins one would misdescribe the market. The route is declared in the comparison engine and stays "N/A" until a representative scenario is loaded.',
                            '本平台三个日本区域的基准情景均刻意不含长期脱碳电源拍卖。将中标金额与完整市场化收入相加会造成重复计算，而假设所有项目均能中标则会错误描述市场。该路径已在对比引擎中声明，在载入代表性情景前始终显示“N/A”。'] },
        { t: 'why', text: ['The temptation with LTDA is obvious: it is the one Japanese mechanism that produces a bankable long-dated cash flow, and including it would lift every Japanese IRR on this platform. That is exactly why it is excluded from the benchmark. A market comparison has to describe what a new entrant faces, not what a winner received.',
                           '长期脱碳电源拍卖的诱惑显而易见：它是日本唯一能产生可融资长期现金流的机制，纳入后将抬升本平台所有日本市场的IRR。这恰是将其排除在基准之外的理由。市场对比必须描述新进入者所面对的情形，而非中标者所获得的结果。'],
          sig: ['Exclude the winner\'s contract from the market case', '中标者的合同不应计入市场基准'] } ] },
    ] };
  };

  // ============================== JEPX ENERGY ==============================

  return SEC_B.capacity;
}
