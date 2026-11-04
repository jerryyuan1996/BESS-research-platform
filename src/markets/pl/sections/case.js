/* Poland — the `case` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const SEC_B = {};

SEC_B.case = () => ({ head: ['Investment Case — who should enter, and by which route', '投资判断 — 谁应该进入，走哪条路径'], blocks: [
  { t: 'p', text: ['The uncontracted reference project returns under 1% on the model, and the batteries that won long capacity contracts in earlier auctions are a different cohort.', '未签约的参考项目模型回报不足1%；在早先拍卖中取得长期容量合同的电池项目属于另一批次。'] },
  { t: 'investment-case', marketId: 'pl' },
] });

  return SEC_B.case;
}
