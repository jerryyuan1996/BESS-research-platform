// ============================== FCAS ==============================
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, M, SRC, state, fmt1, fmtCk, fmtCM, fmtPct } = api;
  const { O, kMW } = createShared(api);

  return function (){
    return {
    head: ['FCAS — structurally saturated, and it does not scale with duration','FCAS — 结构性饱和，且不随时长增长'],
    cap: ['Frequency control ancillary services proved batteries worked in the NEM and then stopped being the reason to build one. This tab sets out what remains, why it is power-based rather than energy-based, and the evidence tier a specific project has actually reached.',
          '频率控制辅助服务曾在NEM中证明了电池的可行性，如今已不再是建设电池的理由。本页说明其余下部分、为何它是功率型而非能量型，以及具体项目实际达到的证据层级。'],
    blocks: [
      { t:'card', mt:false, title:['Where FCAS sits in the stack now','FCAS当前在收入结构中的位置'], badges:['official','tp'], live:true, blocks:[
        { t:'kpis', items:[
          { l:['Share of battery revenue, Oct 25 – Mar 26','占储能收入比重，2025年10月–2026年3月'], v:O.fcasShareOctMarPct + '<small>%</small>', d:['described as structurally saturated','被描述为结构性饱和'], b:['tp'] },
          { l:['Share of battery revenue, Q2 2026','占储能收入比重，2026年第二季度'], v:O.fcasQ2SharePct + '<small>%</small>', d:['after a ' + O.fcasQ2FallPct + '% fall in one quarter','此前单季度下跌' + O.fcasQ2FallPct + '%'], cls:'down', b:['official'] },
          { l:['FCAS revenue, Q2 2026','FCAS收入，2026年第二季度'], v:fmtCM(O.fcasQ2Am * 1e6), d:['of ' + fmtCM(O.battRevQ2Am * 1e6) + ' total net battery revenue','在' + fmtCM(O.battRevQ2Am * 1e6) + '储能净收入总额之中'], b:['official'] },
          { l:['Modelled FCAS in the lab seed','测算种子中的FCAS'], v:fmtCk(M.lab.servicesKW * 1000) + '<small>/MW/yr</small>', d:['≈' + fmtPct(O.fcasShareOctMarPct, 0) + ' of the CY2025 index, and flat across duration','约为2025日历年指数的' + fmtPct(O.fcasShareOctMarPct, 0) + '，且不随时长变化'], b:['calc'] },
        ] },
        { t:'bar', cfg:{ xs: M.fcasShareLabels, bw: 44, rotX: false, yfmt: v => fmt1(v) + '%', labels: true, h: 220,
          series:[{ name:['FCAS share of battery revenue','FCAS占储能收入比重'], color:'var(--s3)', vals: M.fcasShareSeries }] } },
        { t:'why', text:['FCAS fell ' + O.fcasQ2FallPct + '% in a single quarter to ' + fmtCM(O.fcasQ2Am * 1e6) + ', or ' + O.fcasQ2SharePct + '% of NEM battery revenue. The mechanism is simple and irreversible: FCAS requirements are set by system need and do not grow with the fleet, so every megawatt of new battery divides the same pot. A market that was ' + fmtPct(100 - O.fcasShareOctMarPct, 0) + ' merchant six months ago is more so now. Model FCAS flat at best and never as a growth line.',
          'FCAS单季度下跌' + O.fcasQ2FallPct + '%至' + fmtCM(O.fcasQ2Am * 1e6) + '，占NEM储能收入的' + O.fcasQ2SharePct + '%。机制简单且不可逆：FCAS需求由系统需要确定，不随装机增长，因此每新增一兆瓦电池都是在分割同一块蛋糕。六个月前市场化占比已达' + fmtPct(100 - O.fcasShareOctMarPct, 0) + '的市场，如今占比更高。FCAS最多按持平建模，绝不可作为增长项。'],
          sig:['Fixed requirement, growing fleet','需求固定，装机增长'] },
        { t:'src', src: SRC.qed, use:['Quarterly FCAS revenue and its share of total battery revenue','季度FCAS收入及其占储能收入总额的比重'] },
      ] },

      { t:'card', title:['The markets, and why none of them pays for duration','各市场，以及为何没有一个为时长付费'], badges:['official','calc'], live:false, blocks:[
        { t:'table', head:[['Market family','市场类别'],['What it does','作用'],['Battery fit','电池适配度']], rows:
          M.fcasMarkets.map(p => [{ b:['' + p.id + ' — ' + p.n[0], '' + p.id + ' — ' + p.n[1]] }, p.role, p.fit]) },
        { t:'flow', items:[
          ['Enablement is in MW','启用量以MW计'], ['Response is measured in seconds','响应以秒计'],
          ['Energy delivered is small','实际交付电量很小'], ['A 4h asset earns the same as a 2h asset','4小时资产与2小时资产收入相同'],
        ] },
        { t:'why', text:['This is the single most important structural point on the tab and it is easy to state: FCAS is a power product. Enablement is priced in megawatts, response is measured in seconds, and the energy actually delivered is trivial relative to a battery\'s storage. So the FCAS line in the model is flat across every duration configuration, and any duration analysis that shows FCAS rising with hours has an error in it. The corollary is that the fourth hour must earn its capex entirely from arbitrage.',
          '这是本页最重要的结构性要点，且可以简单陈述：FCAS是功率产品。启用量按兆瓦定价，响应以秒计量，实际交付的电量相对于电池储能容量微不足道。因此模型中的FCAS收入在所有时长配置下均保持不变；任何显示FCAS随小时数上升的时长分析都存在错误。推论是：第四小时必须完全依靠套利偿付其造价。'],
          sig:['FCAS is measured in MW, not MWh','FCAS以MW计量，而非MWh'] },
      ] },

      { t:'card', title:['The South Australian spike — an event, not a trend','南澳的价格尖峰 — 事件而非趋势'], badges:['tp'], live:true, blocks:[
        { t:'kpis', items:[
          { l:['Lower Contingency FCAS, July 2025','下调事故备用FCAS，2025年7月'], v:kMW(O.lowerContJulK) + '<small>/MW/yr</small>', d:['NEM-wide','全NEM'], b:['tp'] },
          { l:['Lower Contingency FCAS, August 2025','下调事故备用FCAS，2025年8月'], v:kMW(O.lowerContAugK) + '<small>/MW/yr</small>', d:['more than doubled during South Australian islanding','南澳孤岛运行期间涨逾一倍'], b:['tp'] },
          { l:['Change','变化幅度'], v:'+' + fmtPct((O.lowerContAugK / O.lowerContJulK - 1) * 100, 0), d:['in one month, NEM-wide, from a single regional separation event','单月内、全NEM范围，源于一次区域解列事件'], b:['calc'] },
          { l:['Underwriting treatment','承销处理方式'], v:L(['Excluded from the base case','排除于基准情景之外']), d:['a system emergency is not a revenue forecast','系统紧急事件不是收入预测'], b:['calc'] },
        ] },
        { t:'why', text:['Lower Contingency FCAS more than doubled NEM-wide in one month because one region separated from the rest of the system. That is genuinely how the NEM behaves and it is genuinely where FCAS upside comes from — but it is an emergency, its frequency is unforecastable, and it is exactly the kind of observation that gets extrapolated into a base case. Carry it as an unmodelled upside and note that South Australia is also the region where relief is arriving in stages: Project EnergyConnect linked three state grids for the first time, but only at ' + O.pecStage1MW + ' MW, and the full ' + O.pecMW + ' MW does not arrive until ' + O.pecStage2Year + '.',
          '下调事故备用FCAS在全NEM范围内单月涨逾一倍，原因是一个区域与系统其余部分解列。这确实是NEM的真实运行方式，也确实是FCAS上行空间的来源 — 但它是紧急状态，其发生频率无法预测，而这恰恰是最容易被外推进基准情景的那类观测。应将其作为未建模的上行因素记录，并注意南澳也是缓解措施正在分期到位的区域：Project EnergyConnect首次实现三个州电网互联，但仅为' + O.pecStage1MW + 'MW，完整的' + O.pecMW + 'MW要到' + O.pecStage2Year + '才到位。'],
          sig:['Relief is arriving in stages, not yet in full','缓解措施分期到位，尚未完整'] },
      ] },

      { t:'card', title:['Evidence ladder — underwrite only to the tier the project has reached','证据阶梯 — 只按项目已达到的层级承销'], badges:['calc'], live:false, blocks:[
        { t:'ladder', items: M.evidenceLadder },
        { t:'warn', text:['Most NEM projects presented to investors sit at tier 1 or 2: AEMO\'s published data exists and is excellent, but the connection point\'s own loss-factor and curtailment history, a reproducible optimiser backtest on this asset, and market registration per market and direction usually are not in the pack. Revenue claimed above the tier reached is an assumption, not a forecast.',
          '向投资人展示的多数NEM项目处于第1或第2层级：AEMO公布的数据确实存在且质量优异，但并网点自身的损耗系数与限电历史、针对该资产的可复现优化器回测、以及按市场与方向分别完成的注册，通常不在资料包中。超出所达层级的收入主张是假设，而非预测。'] },
        { t:'why', text:['The NEM ladder is unusual because tier 1 is genuinely strong — AEMO publishes more than any other operator in this comparison set. That strength is the trap: abundant market-wide data makes it easy to skip the project-specific tiers. The question to ask is never "what did NEM batteries earn last year" but "what did this connection point settle at, after its loss factor, in the hours this asset would have been discharging".',
          'NEM的证据阶梯不同寻常，因为其第1层级确实强健 — AEMO的公布量超过本对比样本中任何其他运营方。而这种强健恰恰是陷阱：丰富的全市场数据使人容易跳过项目层面的层级。应问的问题从来不是“去年NEM的电池赚了多少”，而是“这个并网点在该资产本会放电的那些时段内、经损耗系数折算后的结算价是多少”。'],
          sig:['Abundant market data hides the missing project data','丰富的市场数据掩盖了缺失的项目数据'] },
      ] },
    ] };
  };
}
