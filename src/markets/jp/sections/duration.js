/* Japan — the `duration` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { designLine } from '../../_shared/designAnswer.js';
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const {
    h, L, M, SRC, T, state, GLOSS_CORE,
    fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX,
    liveScore, bandFor, durationAt, interp,
    lensRegions, isCompare, region,
  } = api;
  const { R, path, perRegion, regionBadge, lensNote } = createShared(api);
  const SEC_B = {};

  SEC_B.duration = function (){
    const cy = state.codYear;
    /* The Brief's design line for each area in view (guided-experience plan, PR 7). */
    const lines = lensRegions().map(id => designLine('jp_' + id)).filter(Boolean);
    return {
    head: ['Storage Duration — one methodology, three regional scorecards', '储能时长 — 一套方法，三份区域评分'],
    cap: ['Frequent curtailment does not automatically justify longer duration. Each incremental MWh must have identifiable repeatable value or contract value.',
          '频繁弃电并不自动构成延长时长的理由。每一增量MWh都必须具备可识别、可重复的价值或合同价值。'],
    blocks: [
      lensNote(),
      { t: 'card', mt: false, title: ['Reference duration path', '参考时长路径'], badges: ['calc'], live: false, blocks: [
        { t: 'kpis', items: [
          { l: ['Reference duration at COD ' + cy, cy + '投运参考时长'], v: fmt1(durationAt(cy)) + ' h' },
          { l: ['Expected-capacity factor at that duration', '该时长下的期待容量系数'], v: fmtPct(interp(M.deratingCurve, durationAt(cy)) * 100, 0), b: ['illus'] },
          { l: ['Merchant spread factor at that duration', '该时长下的价差系数'], v: fmt1(interp(M.durSpreadFactor, durationAt(cy))) + '×', b: ['illus'] },
        ] },
        { t: 'why', text: ['The two curves pull in opposite directions: longer duration raises the capacity payment through expected capacity and lowers the merchant margin per MWh because the spread thins. A long-term auction award settles the question differently, because its floor has to hold for the whole term, so the build is sized to the floor rather than to where the curves cross. The engine’s answer: ' + lines.map(l => l[0]).join(' '),
                           '两条曲线方向相反：延长时长通过期待容量提高容量付费，同时因价差变薄而降低每MWh的市场化收益。长期拍卖中标合同的解法不同：其下限须在整个合同期内维持，因此装机规模由下限而非两条曲线的交点决定。引擎的结论：' + lines.map(l => l[1]).join('')],
          sig: ['The award floor sizes the build', '中标合同下限决定装机规模'] } ] },

      perRegion(id => ({
        title: [L(R(id).short) + ' — duration need index', L(R(id).short) + ' — 时长需求指数'],
        badges: [regionBadge(id), 'calc'], live: true, blocks: [
          { t: 'scorecard', id: path(id, 'durFactors'), bands: 'durBands' },
        ],
      })),
      { t: 'why', text: ['Kyushu and Hokkaido score higher on duration need than Tokyo, driven by the charging-window and curtailment factors. But the scorecard measures need, not payment: neither market has a mechanism that pays for hours the way a long-duration contract would. Where need is high and payment is not, the correct response is to build to the merchant-optimal duration and keep augmentation optionality, not to build long.',
                         '九州与北海道的时长需求评分高于东京，主要由充电窗口与弃电因子驱动。但评分衡量的是需求而非付费：两地均无类似长时合同那样为小时数付费的机制。在需求高而付费缺失之处，正确做法是按市场化最优时长建设并保留增容选择权，而非直接建长时。'],
        sig: ['High need, no mechanism that pays for hours', '需求高，但无为小时付费的机制'] },

      { t: 'card', title: ['Augmentation readiness', '增容准备度'], badges: ['illus'], live: true, blocks: [
        { t: 'aug' },
        { t: 'why', text: ['Augmentation optionality is worth more in Japan than in most markets on this platform, because the duration answer is genuinely uncertain: the expected-capacity treatment can be revised between auction vintages, and the merchant-optimal duration moves with how much storage enters. Optionality is the correct response to a moving target.',
                           '在本平台各市场中，增容选择权在日本的价值更高，因为时长的答案确实不确定：期待容量的处理方式可能在不同拍卖年份间修订，而市场化最优时长也随储能进入规模变化。面对移动的目标，选择权是正确的应对。'],
          sig: ['Optionality beats a duration bet', '选择权优于时长押注'] } ] },

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
