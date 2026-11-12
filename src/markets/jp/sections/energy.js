/* Japan — the `energy` section.
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
  const { R, regionTable, lensNote } = createShared(api);
  const SEC_B = {};

  SEC_B.energy = function (){
    const rs = lensRegions();
    return {
    head: ['JEPX Energy & Regional Basis', 'JEPX现货与区域价差'],
    cap: ['Never use the System Price as a proxy for a regional project. Every figure here is an Area Price.',
          '绝不可用系统价格替代区域项目的价格。此处所有数值均为区域价格。'],
    blocks: [
      lensNote(),
      { t: 'card', mt: false, title: ['Area price shape and optimised spread', '区域价格形态与优化价差'],
        badges: ['calc', 'illus'], live: true, src: SRC.jepx,
        srcUse: ['30-minute Area Price by area', '各区域30分钟区域价格'], blocks: [
        { t: 'bar', cfg: {
          xs: rs.map(id => L(R(id).short)),
          mode: 'group', h: 260, yfmt: v => fmt1(v) + ' ¥/kWh',
          series: [
            { name: ['P05 (charging window)', 'P05（充电窗口）'], color: 'var(--s2)', vals: rs.map(id => R(id).jepx.p05JPYkWh) },
            { name: ['Average', '均值'], color: 'var(--s1)', vals: rs.map(id => R(id).jepx.avgJPYkWh) },
            { name: ['P95 (discharge window)', 'P95（放电窗口）'], color: 'var(--s6)', vals: rs.map(id => R(id).jepx.p95JPYkWh) },
          ] } },
        { t: 'why', text: ['A battery is paid for the gap between the second and first bars, not for the height of the middle one. Kyushu has the lowest average price in the set and the widest usable gap; Tokyo has the highest average and a narrower one. Average area price is close to irrelevant as an investment signal.',
                           '储能的收益来自第二根柱与第一根柱之间的差值，而非中间柱的高度。九州平均价格为样本最低，但可用价差最宽；东京均价最高，价差却较窄。区域平均价格作为投资信号几乎不具参考意义。'],
          sig: ['Paid for the gap, not the level', '收益来自价差而非价格水平'] } ] },

      { t: 'card', title: ['Basis and market splitting', '价差与市场分割'], badges: ['calc', 'illus'], live: true, blocks: [
        regionTable(['Metric', '指标'], [
          { l: ['Basis to System Price (¥/kWh)', '相对系统价格价差（¥/kWh）'], f: id => fmt1(R(id).jepx.basisToSystemJPYkWh) },
          { l: ['Market-split hours (%)', '市场分割小时占比（%）'], f: id => fmt1(R(id).jepx.marketSplitHoursPct) + '%' },
          { l: ['Near-zero-price intervals (%)', '近零价格时段占比（%）'], f: id => fmt1(R(id).jepx.nearZeroIntervalsPct) + '%' },
        ]),
        { t: 'why', text: ['Market splitting is how an export constraint shows up in a price series. Hokkaido splits from the system price for roughly a third of hours, Kyushu for a quarter, Tokyo for an eighth. That ordering is the same as the interconnector-constraint ordering, and it is the reason a national price forecast cannot underwrite a regional battery.',
                           '市场分割是外送约束在价格序列中的表现方式。北海道约三分之一小时与系统价格分离，九州约四分之一，东京约八分之一。该排序与联络线约束程度的排序一致，也正是全国价格预测无法为区域储能提供承销依据的原因。'],
          sig: ['Splitting frequency ranks the constraint', '分割频率反映约束强度'] } ] },

      { t: 'card', title: ['Curtailment overlap with the charging window', '弃电与充电窗口的重叠'],
        badges: ['official'], live: false, blocks: [
        { t: 'bar', cfg: {
          xs: rs.map(id => L(R(id).short)),
          mode: 'group', h: 240, labels: true, yfmt: v => fmtN(v) + ' d',
          series: [{ name: ['Verified curtailment days', '已核验弃电天数'], color: 'var(--s3)', vals: rs.map(id => R(id).curtailment.totalDays) }] } },
        { t: 'cap', text: ['Tokyo and Hokkaido: Mar–May 2026. Kyushu: Jan–Mar 2026. Windows differ because that is what the cited OCCTO verifications cover — do not annualise these figures.',
                           '东京与北海道为2026年3–5月，九州为2026年1–3月。时间窗口不同是因为所引OCCTO核验数据覆盖期不同 — 不得据此年化。'] },
        { t: 'why', text: ['Curtailment is a price effect for a battery, never a payment. It matters only where the low-price hours it creates overlap hours the asset can actually import. That is a site question, not a regional one, which is why the connection tab separates import capability from export capability.',
                           '对储能而言弃电是价格效应，而非收入。只有当其造成的低价时段与资产实际可充电的时段重叠时才具意义。这是场址问题而非区域问题 — 因此并网页将充电能力与放电能力分开评估。'],
          sig: ['Overlap, not incidence', '重叠度而非发生率'] } ] },
    ] };
  };

  // ============================== BALANCING ==============================

  return SEC_B.energy;
}
