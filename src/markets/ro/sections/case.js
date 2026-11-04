/* Romania — the `case` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, NF2, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const SEC_B = {};

  SEC_B.case = () => ({ head: ['Investment Case — who should enter, and by which route', '投资判断 — 谁应该进入，走哪条路径'], blocks: [
    { t: 'p', text: ['The highest return of any market here, with nothing secured and the rules still moving. The guarantees are a large share of a small project and a modest sum of money.', '回报为各市场之最，但没有任何锁定收入，规则也仍在变动。保函占小项目投资的比例很高，金额却不大。'] },
    { t: 'investment-case', marketId: 'ro' },
  ] });

  return SEC_B.case;
}
