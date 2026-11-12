/* Japan — the `entry` section.
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

  SEC_B.entry = () => ({ head: ['Entry — what it costs before the first dollar of revenue', '进入成本 — 第一笔收入之前要付出什么'], blocks: [
    { t: 'p', text: ['What each network company asks is a schedule against a connection charge that is set per project and not published, so no item here has an amount.', '各电网公司的要求都是针对并网费用的付款安排，而并网费用按项目核定且不公开，因此此处各项均没有金额。'] },
    ...casePerRegion('entry-ledger'),
  ] });


  return SEC_B.entry;
}
