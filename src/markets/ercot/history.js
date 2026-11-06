/* Authoritative full research history. Extracted verbatim from src/markets/ercot/sections.js.
   Original facts, interpretations, scope and live data bindings are preserved.
   Public relocation is an editorial draft, not a new content approval. */
export function researchHistory(api){
  const {M,fmtCk}=api;
  const O=M.official;
  const kMW = v => fmtCk(v);
  return {head: ['ERCOT Market Story — from scarcity rents to saturation, in three years',
         'ERCOT市场演进 — 三年内由稀缺租金走向饱和'],
cap: ['Nothing about ERCOT\'s design changed to cause this. What changed is that the design worked.',
        'ERCOT的机制设计未发生任何导致这一结果的改变。真正改变的是 — 该设计奏效了。'],
  cards:[
{ t:'card', mt:false, title:['How the market got here','市场如何演变至此'], badges:['official'], blocks:[
      { t:'timeline', items:[
        { y:'2021', t:['Uri, and the case for storage','Uri风暴与储能的投资逻辑'],
          p:['Winter Storm Uri established both the scarcity value ERCOT can produce and the political limit on it. The ORDC was recalibrated and the offer cap lowered, but the energy-only design was kept.',
             'Uri冬季风暴既确立了ERCOT所能产生的稀缺价值，也确立了对该价值的政治约束。ORDC经过重新校准、报价上限下调，但纯电能量市场的设计得以保留。'],
          i:['The market that pays for scarcity also decides how much scarcity it will tolerate.','为稀缺付费的市场，同时也决定其愿意容忍多少稀缺。'] },
        { y:'2023', t:['The scarcity-rent peak','稀缺租金峰值'],
          p:['The revenue index reached ' + kMW(O.idx2023) + '/MW/yr on a fleet of just ' + O.fleet2023GW + ' GW, with ancillary services contributing ' + O.asShare2023Pct + '% of it. ECRS had launched the year before and batteries dominated it.',
             '收入指数在仅' + O.fleet2023GW + 'GW装机规模下达到每MW每年' + kMW(O.idx2023) + '，其中辅助服务贡献' + O.asShare2023Pct + '%。ECRS于前一年推出，储能在其中占据主导。'],
          i:['A small fleet against a fixed ancillary requirement. That is a scarcity rent, not a revenue level.','小规模机组面对固定的辅助服务需求。这是稀缺租金，而非收入水平。'] },
        { y:'2024–2025', t:['The fleet arrives','装机大规模到位'],
          p:['Installed capacity went from ' + O.fleet2023GW + ' GW to ' + O.fleet2026GW + ' GW. Ancillary revenue fell about ' + O.asFallSince2023Pct + '% and its share of battery income went from ' + O.asShare2023Pct + '% to ' + O.asShare2025Pct + '%. The index fell to ' + kMW(O.idx2025) + '.',
             '装机容量由' + O.fleet2023GW + 'GW增至' + O.fleet2026GW + 'GW。辅助服务收入下跌约' + O.asFallSince2023Pct + '%，其占储能收入的比重由' + O.asShare2023Pct + '%降至' + O.asShare2025Pct + '%。指数降至' + kMW(O.idx2025) + '。'],
          i:['Connect-and-manage worked exactly as designed. The margin was the cost of it working.','“接入并管理”完全按设计发挥了作用。margin的消失正是其奏效的代价。'] },
        { y:'Dec 2025', t:['RTC+B goes live','RTC+B上线'],
          p:['From ' + O.rtcbDate + ' energy and ancillary services clear together every five minutes, and the duration requirements fell: ECRS from ' + O.ecrsHoursBefore + ' hours to ' + O.ecrsHoursAfter + ', RRS and Regulation from ' + O.rrsHoursBefore + ' hour to ' + O.rrsHoursAfterMin + ' minutes. Non-Spin stayed at ' + O.nonSpinHours + ' hours.',
             '自' + O.rtcbDate + '起，电能量与辅助服务每五分钟同时出清，且时长要求下调：ECRS由' + O.ecrsHoursBefore + '小时降至' + O.ecrsHoursAfter + '小时，RRS与调频由' + O.rrsHoursBefore + '小时降至' + O.rrsHoursAfterMin + '分钟。非旋转备用维持' + O.nonSpinHours + '小时不变。'],
          i:['Better dispatch flexibility for an individual asset, and a larger qualifying pool for the same requirement.','对单个资产而言调度灵活性提升，但同一需求所对应的合格资源池也随之扩大。'] },
        { y:'2026', t:['The load arrives — maybe','负荷即将到来 — 或许'],
          p:['ERCOT\'s large-load queue reached about ' + O.largeLoadQueueGW + ' GW by August 2026, ' + O.largeLoadDataCentrePct + '% of it data centres, with ' + O.largeLoadQ1_2026GW + ' GW applying in Q1 2026 alone. On 3 August 2026 the Governor directed ERCOT and the PUCT to pause data-centre interconnections pending a project-by-project audit; ERCOT postponed its Batch Zero study and expects to file the audit by 10 December 2026.',
             '截至2026年8月，ERCOT大负荷排队量约达' + O.largeLoadQueueGW + 'GW，其中' + O.largeLoadDataCentrePct + '%为数据中心；仅2026年第一季度就有' + O.largeLoadQ1_2026GW + 'GW提交申请。2026年8月3日，州长指示ERCOT与PUCT在逐项目审计完成前暂停数据中心并网；ERCOT已推迟Batch Zero研究，预计于2026年12月10日前提交审计报告。'],
          i:['The only credible path back to 2023-style spreads, and it is a queue rather than a commitment.','这是回到2023年式价差水平的唯一可信路径，但它只是排队量而非实际承诺。'] },
      ] },
      { t:'why', text:['The ERCOT story has no villain and no policy failure in it, which is what makes it useful. Nothing in the market design changed to cause the collapse — the ORDC still prices scarcity, ancillary quantities are still set by system need, and the offer cap is where it was. What changed is that a market designed to let generation in easily let a great deal of generation in. Any investor underwriting ERCOT on 2023 revenue was underwriting the absence of competitors in a market whose defining feature is that competitors face almost no barrier to entry.',
        'ERCOT的故事中既没有反面角色，也不存在政策失误，这正是它的价值所在。市场设计中没有任何变化导致了这次下滑 — ORDC仍在为稀缺定价，辅助服务采购量仍由系统需求确定，报价上限也未变动。真正改变的是：一个旨在让电源便捷进入的市场，确实让大量电源进入了。任何以2023年收入为依据承销ERCOT的投资人，实质上是在为“竞争者缺席”这一状态承销 — 而该市场最根本的特征恰恰是竞争者几乎不面临任何进入壁垒。'],
        sig:['No villain: the design worked, and that was the cost','没有反面角色：设计奏效了，而这正是代价'] },
    ] }
  ]};
}
