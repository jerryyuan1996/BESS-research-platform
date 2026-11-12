/* Japan — the `case` section.
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
  const { casePerRegion } = createShared(api);
  const SEC_B = {};

  SEC_B.case = () => ({ head: ['Investment Case — who should enter, and by which route', '投资判断 — 谁应该进入，走哪条路径'], blocks: [
    { t: 'p', text: ['A long-term auction award secures nearly all revenue for its term, for the projects that win one, and returns most earnings from other markets. The three areas share that rulebook and differ in connection access and room to repeat.', '长期拍卖中标可在合同期内锁定几乎全部收入，但仅限于中标项目，且须返还其他市场的大部分收益。三个区域适用同一套规则，差别在于并网条件与可复制的空间。'] },
    ...casePerRegion('investment-case'),
  ] });

  return SEC_B.case;
}
