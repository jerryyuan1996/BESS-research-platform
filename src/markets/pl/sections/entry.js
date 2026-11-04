/* Poland — the `entry` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const SEC_B = {};

SEC_B.entry = () => ({ head: ['Entry — what it costs before the first dollar of revenue', '进入成本 — 第一笔收入之前要付出什么'], blocks: [
  { t: 'p', text: ['Three statutory payments: a fee to apply, an advance of up to PLN 6 million within fourteen days, and security after the connection agreement. They are stated in złoty, as the statute states them, and totalled at a seed rate; development spend is not sourced, so the total is a lower bound.', '三笔法定款项：申请费、申请后14日内最高600万兹罗提的预付款，以及签订并网协议后的履约担保。金额按法律原文以兹罗提列示，并按设定汇率合计；前期开发支出没有来源，因此合计为下限。'] },
  { t: 'entry-ledger', marketId: 'pl' },
] });


  return SEC_B.entry;
}
