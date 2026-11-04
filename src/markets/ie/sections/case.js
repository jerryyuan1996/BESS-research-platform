/* Ireland — the `case` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const SEC_B = {};

SEC_B.case = () => ({ head: ['Investment Case — who should enter, and by which route', '投资判断 — 谁应该进入，走哪条路径'], blocks: [
  { t: 'p', text: ['A capacity contract secures over half of revenue for ten years for a project that holds one, on a small system where service income is being re-procured.', '持有容量合同的项目可在十年内锁定过半收入；但系统规模小，系统服务收入正在重新采购。'] },
  { t: 'investment-case', marketId: 'ie' },
] });

  return SEC_B.case;
}
