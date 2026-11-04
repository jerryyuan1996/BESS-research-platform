/* Romania — the `entry` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { RO_BUILD_PATHWAY } from '../buildPathway.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, NF2, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const SEC_B = {};

  SEC_B.entry = () => ({ head: ['Entry — what it costs before the first dollar of revenue', '进入成本 — 第一笔收入之前要付出什么'], blocks: [
    { t: 'p', text: ['Three guarantees and the price of the auctioned capacity fall due before financial close. Three of the five items have no published amount, so every total is a lower bound. The pathway beneath shows where the annual auction sits.', '融资交割前须提交三项保函，并支付拍得容量的价款。五项中有三项没有公开金额，因此所有合计均为下限。其下的建设路径显示了年度拍卖所处的位置。'] },
    { t: 'entry-ledger', marketId: 'ro' },
    { t: 'pathway', pathway: RO_BUILD_PATHWAY, sourceFor: (k) => SRC[k] },
  ] });


  return SEC_B.entry;
}
