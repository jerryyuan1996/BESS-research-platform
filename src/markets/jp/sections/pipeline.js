/* Japan — the `pipeline` section.
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
  const { R, regionTable } = createShared(api);
  const SEC_B = {};

  SEC_B.pipeline = function (){
    const rs = lensRegions();
    return {
    head: ['Project Pipeline — one register, region column', '项目管线 — 单一登记表，区域分列'],
    cap: ['Only source-supported MW/MWh and stage enter the register. Where public sources do not disclose capacity precisely enough, the project is listed without invented figures.',
          '仅有来源支持的MW/MWh与阶段方可进入登记表。公开来源未充分披露容量的项目，仅列示名称而不虚构数据。'],
    blocks: [
      { t: 'card', mt: false, title: ['Pipeline by COD year', '按投运年度的管线'], badges: ['public', 'illus'], live: true, blocks: [
        { t: 'pipeChart', unit: 'MW', series: rs.map(id => ({ region: id, name: R(id).short, color: R(id).color })) },
        { t: 'cap', text: ['Probability-weighted using the common stage taxonomy below.', '采用下方通用阶段分类进行概率加权。'] },
        { t: 'stageProb' } ] },

      { t: 'card', title: ['Register — source-supported figures only', '登记表 — 仅含来源支持的数据'],
        badges: ['public'], live: true, blocks: [
        { t: 'projTable' },
        { t: 'warn', text: ['This register is deliberately thin. Several named Japanese BESS projects are public but do not disclose MW/MWh and stage precisely enough to fit the common taxonomy; they are listed below without figures rather than padded into the chart above. Treat the register as a floor, not as the market.',
                            '本登记表刻意保持精简。若干已公开的日本储能项目并未充分披露MW/MWh及阶段，无法纳入通用分类；这些项目在下方仅列名称而不填充至上方图表。请将本表视为下限而非市场全貌。'] },
        { t: 'table',
          head: [['Named project', '具名项目'], ['Region', '区域'], ['Sponsor', '发起方'], ['Capacity disclosed?', '是否披露容量']],
          rows: M.namedPipeline.map(p => [
            { b: p.n }, L(R(p.region).short), p.sponsor,
            { chip: 'warn', text: ['Not to taxonomy standard', '未达分类标准'] },
          ]) } ] },

      { t: 'card', title: ['Saturation signals — the better pipeline measure today', '饱和信号 — 当前更可靠的管线度量'],
        badges: ['official'], live: false, src: SRC.hepcoBalancing,
        srcUse: ['Hokkaido balancing registration and connection-contract queue', '北海道调整力注册与并网合同队列'], blocks: [
        regionTable(['Signal', '信号'], [
          { l: ['Pipeline / operating ratio', '管线对在运倍数'], f: id => R(id).saturation.pipelineRatio },
          { l: ['Concurrent study cap', '并发检讨上限'], f: id => String(R(id).grid.studyCap) },
          { l: ['Queue signal', '队列信号'], f: id => L(R(id).saturation.signal) },
        ]),
        { t: 'why', text: ['For Hokkaido the queue is the pipeline: roughly 2 GW of connection-contract applications against a small operating stock, and more than 0.2 GW expected to register for the balancing market in FY2026. A named-project register would understate that by an order of magnitude. Where the register is thin, use the queue.',
                           '对北海道而言，队列即管线：约2GW并网合同申请对应极小的在运容量，且预计FY2026将有超过0.2GW注册进入调整力市场。具名项目登记表会将其低估一个数量级。登记表稀疏之处，应改用队列数据。'],
          sig: ['Where the register is thin, use the queue', '登记表稀疏时改用队列'] } ] },
    ] };
  };

  // ============================== GRID ==============================

  return SEC_B.pipeline;
}
