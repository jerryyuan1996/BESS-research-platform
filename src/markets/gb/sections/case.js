/* Great Britain — the `case` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, T, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, durationAt, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const SEC_B = {};

  SEC_B.case = () => ({ head: ['Investment Case — who should enter, and by which route', '投资判断 — 谁应该进入，走哪条路径'], blocks: [
    { t: 'p', text: ['The lowest modelled return of the four and the strongest market for debt and exit. For an investor that needs both, that is a coherent place to be.', '四个市场中模型回报最低，却是债务融资与退出条件最好的一个。对两者都需要的投资者而言，这是说得通的选择。'] },
    { t: 'investment-case', marketId: 'gb' },
  ] });

  return SEC_B.case;
}
