/* Japan — the `story` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import {researchHistory} from '../history.js';
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const {
    h, L, M, SRC, T, state, GLOSS_CORE,
    fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX,
    liveScore, bandFor, durationAt, interp,
    lensRegions, isCompare, region,
  } = api;
  const { lensNote } = createShared(api);
  const SEC_B = {};

  SEC_B.story = function (){
    return {
    head: researchHistory(api).head,
    cap: researchHistory(api).cap,
    blocks: [
      lensNote(),
      researchHistory(api).cards[0],

      researchHistory(api).cards[1],

      { t: 'card', title: ['What breaks the thesis', '什么会推翻投资逻辑'], badges: ['calc'], live: false, blocks: [
        { t: 'list', items: [
          [['Capacity Market prices fall as storage enters the auction', '随储能进入拍卖，容量市场价格下跌'], ['The renewal curve in this model already assumes decline; a faster fall removes the floor.', '本模型的续约曲线已假设下降；下跌更快将移除保底。']],
          [['Grid reinforcement removes the curtailment that creates charging value', '电网强化消除了创造充电价值的弃电'], ['Kyushu\'s expanded transfer-trip system is exactly this risk, already in operation.', '九州扩容后的转移跳闸系统正是该风险，且已投运。']],
          [['Balancing markets saturate faster than volumes grow', '调整力市场饱和快于交易量增长'], ['Hokkaido is the leading indicator: >0.2 GW registering against a small requirement.', '北海道是先行指标：注册容量超0.2GW，而需求规模较小。']],
          [['Charging access is restricted where export capacity was the assumed constraint', '在以外送为假设约束之处，充电接入反受限制'], ['HEPCO\'s charging-control framework covers 27 specified systems.', '北海道电力网络的充电控制机制覆盖27个指定系统。']],
        ] },
        { t: 'why', text: ['Three of these four are already observable, not hypothetical. That is unusual: most market theses break on events that have not happened yet. Here the mechanisms that compress returns are already in operation, which makes the timing question — how fast — more important than the direction question.',
                           '四项中已有三项可观察到，而非假设。这较为罕见：多数市场逻辑的破裂源于尚未发生的事件。此处压缩回报的机制均已运行，因此“多快”的时点问题比“方向”问题更为关键。'],
          sig: ['The downside mechanisms are already running', '下行机制已在运行'] } ] },
    ] };
  };

  // ============================== CAPACITY & LTDA ==============================

  return SEC_B.story;
}
