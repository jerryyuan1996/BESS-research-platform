/* Ireland — the `entry` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const SEC_B = {};

SEC_B.entry = () => ({ head: ['Entry — what it costs before the first dollar of revenue', '进入成本 — 第一笔收入之前要付出什么'], blocks: [
  { t: 'p', text: ['A project applies for a connection only once planning permission is granted, so what it pays the network falls after consent. Two of the three network items have no sourced amount, so the total is a lower bound.', '项目须先取得规划许可才能申请并网，因此向电网支付的款项都发生在取得许可之后。三项电网款项中有两项没有可查证的金额，因此合计为下限。'] },
  { t: 'entry-ledger', marketId: 'ie' },
] });


  return SEC_B.entry;
}
