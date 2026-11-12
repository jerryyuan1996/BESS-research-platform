/* Japan — the `benchmark` section.
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
  const { RG } = createShared(api);
  const SEC_B = {};

  SEC_B.benchmark = function (){
    return {
    head: ['Regional Benchmark — the controlled experiment', '区域对比 — 受控实验'],
    cap: ['If I had the same 50 MW / 4h battery and the same capex today, what changes when I place it in Tokyo, Kyushu or Hokkaido? Only regional items move.',
          '若今天以相同造价配置同一台50MW/4小时储能，置于东京、九州或北海道会有何不同？仅区域项目发生变化。'],
    blocks: [
      { t: 'card', mt: false, title: ['One-page comparison matrix', '一页对比矩阵'], badges: ['calc'], live: true, blocks: [
        { t: 'table',
          head: [['Dimension', '维度'], ['Tokyo', '东京'], ['Kyushu', '九州'], ['Hokkaido', '北海道'], ['Interpretation', '解读']],
          rows: [
            [{ b: ['Primary thesis', '核心逻辑'] }, RG.tokyo.thesis, RG.kyushu.thesis, RG.hokkaido.thesis,
             ['Three different merchant/grid drivers', '三种不同的市场化/电网驱动']],
            [{ b: ['Capacity Market', '容量市场'] }, ['Same national mechanism', '同一全国机制'], ['Same', '同上'], ['Same', '同上'],
             ['Do not duplicate rule analysis', '不重复规则分析']],
            [{ b: ['2029 CM area price', '2029容量市场区域价格'] }, '¥15,111/kW', '¥15,112/kW', '¥14,972/kW',
             ['Modest spread; not the differentiator', '价差有限；非差异来源']],
            [{ b: ['JEPX', 'JEPX'] }, ['Tokyo Area Price', '东京区域价格'], ['Kyushu Area Price', '九州区域价格'], ['Hokkaido Area Price', '北海道区域价格'],
             ['Model each area separately', '各区域分别建模']],
            [{ b: ['Verified curtailment', '已核验弃电'] }, '20 d (Mar–May)', '50 d (Jan–Mar)', '36 d (Mar–May)',
             ['Need ≠ revenue', '需求≠收入']],
            [{ b: ['Study cap', '检讨上限'] }, '11', '8', '5',
             ['Hokkaido most restrictive', '北海道最严']],
            [{ b: ['Interconnector emphasis', '联络线重点'] }, ['System basis', '系统价差'], ['Kanmon export', '关门外送'], ['0.9 → 1.2 GW by FY2027-end', '至2027财年末0.9→1.2GW'],
             ['Hokkaido most export-sensitive', '北海道对外送最敏感']],
            [{ b: ['Saturation signal', '饱和信号'] }, ['Queue-specific', '按队列'], ['Queue-specific', '按队列'], ['>0.2 GW balancing; ~2 GW queue', '调整力>0.2GW；队列约2GW'],
             ['Hokkaido needs explicit cannibalisation tracking', '北海道须显式跟踪收益蚕食']],
            [{ b: ['Main downside', '主要下行'] }, ['Connection + basis normalisation', '并网与价差正常化'], ['Curtailment reduction + cannibalisation', '弃电减少与收益蚕食'], ['Interconnector + charging limits + saturation', '联络线、充电限制与饱和'],
             ['Distinct stress cases', '压力情景各异']],
          ] },
        { t: 'why', text: ['Read the last row first. The three regions fail in three unrelated ways, which is the actual argument for holding more than one of them. If they failed the same way, three Japanese allocations would be one position held three times.',
                           '请先读最后一行。三个区域以三种互不相关的方式失败 — 这才是同时持有多个区域的真正理由。若失败方式相同，三笔日本配置不过是同一头寸持有三次。'],
          sig: ['Three unrelated failure modes', '三种互不相关的失败模式'] } ] },
    ] };
  };

  // ============================== LAB ==============================

  // ============================== PORTFOLIO ==============================

  return SEC_B.benchmark;
}
