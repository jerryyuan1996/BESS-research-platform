/* Great Britain — the `entry` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { GB_BUILD_PATHWAY } from '../buildPathway.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, T, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, durationAt, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const SEC_B = {};

  SEC_B.entry = () => ({ head: ['Entry — what it costs before the first dollar of revenue', '进入成本 — 第一笔收入之前要付出什么'], blocks: [
    { t: 'p', text: ['One figure is published and the rest are not, so the total is a lower bound and every investor limit below reads as not yet checked. The pathway beneath it has one stage with no duration: the next application window has no date.', '只有一项金额是公开的，其余均未公布，因此合计只是下限，下方各类投资者的上限均显示为尚未核查。其下的建设路径中有一个阶段没有耗时：下一个申请窗口尚无日期。'] },
    { t: 'entry-ledger', marketId: 'gb' },
    { t: 'pathway', pathway: GB_BUILD_PATHWAY, sourceFor: (k) => SRC[k] },
  ] });


  return SEC_B.entry;
}
