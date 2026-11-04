// ============================== SPOT & CAP CONTRACTS ==============================
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, M, SRC, state, fmtN, fmt1, fmtC, fmtPct, dilutionAt } = api;
  const { O, P, kMW, regionById, regionalMWhTotal } = createShared(api);

  return function (){
    const cod = state.codYear, cc = M.codCases[cod] || M.codCases[2028];
    return {
    head: ['Spot & Cap Contracts — how much of the spread is executable?','现货与价格上限合约 — 价差中有多少可执行？'],
    cap: ['Energy arbitrage drives more than ' + O.arbitrageShareOfLifePct + '% of forecast merchant revenue over asset life, so this is not one revenue line among several — it is the business. The analysis focuses on the executable margin rather than the headline spread, and on the COD year rather than today.',
          '能量套利驱动资产全寿命预测市场化收入的' + O.arbitrageShareOfLifePct + '%以上，因此这不是若干收入项之一 — 它就是业务本身。分析聚焦于可执行价差而非表面价差，并聚焦于投运年度而非当下。'],
    blocks: [
      { t:'card', mt:false, title:['Revenue level and its direction','收入水平及其方向'], badges:['official','tp'], live:true, blocks:[
        { t:'kpis', items:[
          { l:['CY2024 index','2024日历年指数'], v:kMW(O.idx2024K) + '<small>/MW/yr</small>', d:['+' + fmtPct((O.idx2024K / O.idx2023K - 1) * 100, 0) + ' on CY2023 — the peak year','较2023日历年+' + fmtPct((O.idx2024K / O.idx2023K - 1) * 100, 0) + ' — 峰值年份'], b:['tp'] },
          { l:['CY2025 index','2025日历年指数'], v:kMW(O.idx2025K) + '<small>/MW/yr</small>', d:['the comparison-interface seed scales this to the four-hour archetype','对比接口的种子值即以此折算至四小时原型'], cls:'down', b:['tp'] },
          { l:['Oct 2025 – Mar 2026','2025年10月–2026年3月'], v:kMW(O.idxOctMarK) + '<small>/MW/yr</small>', d:[O.idxOctMarChangePct + '% year on year','同比' + O.idxOctMarChangePct + '%'], cls:'down', b:['tp'] },
          { l:['NEM-wide charge/discharge spread, Q2 2026','全NEM充放电价差，2026年第二季度'], v:fmtC(O.q2SpreadAud) + '<small>/MWh</small>', d:[O.q2SpreadFallPct + '% year on year as the fleet passed ' + fmtN(O.installedMW) + ' MW','随装机突破' + fmtN(O.installedMW) + 'MW同比下跌' + O.q2SpreadFallPct + '%'], cls:'down', b:['official'] },
        ] },
        { t:'bar', cfg:{ xs: M.idxLabels, bw: 40, rotX: true, yfmt: v => kMW(v), labels: true, h: 240,
          series:[{ name:['BESS revenue index (A$k/MW/yr)','储能收入指数（A$千/MW/年）'], color:'var(--s1)', vals: M.idxSeriesK }] } },
        { t:'note', text:['The index is a NEM-wide fleet average across a fleet whose average duration was ' + fmt1(O.fleetHours) + ' hours in June 2026 (' + fmtN(O.fleetMWh) + ' MWh over ' + fmtN(O.fleetMW) + ' MW). Scaling it to a four-hour archetype requires stripping the FCAS share and applying the measured four-hour capture penalty; that derivation lives in src/markets/nem/comparison.js and is not repeated here.',
          '该指数为全NEM机组平均值，而该机组2026年6月的平均时长为' + fmt1(O.fleetHours) + '小时（' + fmtN(O.fleetMW) + 'MW对应' + fmtN(O.fleetMWh) + 'MWh）。将其折算至四小时原型需剔除FCAS份额并应用实测的四小时捕获折减；该推导见src/markets/nem/comparison.js，此处不再重复。'] },
        { t:'why', text:['Two things matter here and they are not the same thing. The level is low and falling. But the dispersion is the real characteristic: the same index printed ' + kMW(O.monJanK) + '/MW/yr in January 2026 and ' + kMW(O.monMayK) + ' in May, and ' + kMW(O.idx2024K) + ' across 2024 against ' + kMW(O.idxOctMarK) + ' across the following winter. A model that carries one merchant number for fifteen years is not conservative or aggressive — it is the wrong shape. Carry the range, and size debt against the low end.',
          '此处有两点关键，且并非同一回事。水平低且在下降。但真正的特征是离散度：同一指数在2026年1月为' + kMW(O.monJanK) + '/MW/年、5月为' + kMW(O.monMayK) + '；2024全年为' + kMW(O.idx2024K) + '，而随后的冬季区间为' + kMW(O.idxOctMarK) + '。一个在十五年中只带一个市场化数值的模型，谈不上保守或激进 — 它的形式就是错的。应带入区间，并以其下端安排债务规模。'],
          sig:['Carry the range; size debt off the low end','带入区间；按下端安排债务'] },
        { t:'src', src: SRC.qed, use:['Quarterly prices, dispatch, battery revenue and NEM-wide spreads','季度电价、调度、储能收入及全NEM价差'] },
      ] },

      { t:'card', title:['Regional divergence — the national average describes no region','区域分化 — 全国平均值不描述任何一个区域'], badges:['tp','official'], live:true, blocks:[
        { t:'bar', cfg:{ xs: M.regions.filter(r => r.revChangePct != null).map(r => r.id), bw: 40, rotX: false, yfmt: v => fmtPct(v, 0), labels: true, h: 250,
          series:[{ name:['Battery revenue change, Oct 25 – Mar 26','储能收入变化，2025年10月–2026年3月'], color:'var(--s6)',
            vals: M.regions.filter(r => r.revChangePct != null).map(r => r.revChangePct) }] } },
        { t:'table', head:[['Region','区域'],['Installed MWh','装机MWh'],['Revenue change','收入变化'],['Reading','解读']], num:[1,2], rows:[
          [{b:['QLD1 — Queensland','QLD1 — 昆士兰']}, fmtN(regionById('QLD1').mwh), fmtPct(regionById('QLD1').revChangePct, 0),
           ['Top earner to worst in one year, while fleet duration barely moved (+4%). This was price shape, not asset design.','一年之内由收入最高变为最差，而机组时长几乎未变（+4%）。原因是价格形态，而非资产设计。']],
          [{b:['NSW1 — New South Wales','NSW1 — 新南威尔士']}, fmtN(regionById('NSW1').mwh), fmtPct(regionById('NSW1').revChangePct, 0),
           ['Cushioned by fleet duration nearly doubling to 3.2 h — the clearest available evidence that duration defends revenue.','受机组时长近乎翻倍至3.2小时的缓冲 — 这是“时长可防御收入”最清晰的现有证据。']],
          [{b:['VIC1 — Victoria','VIC1 — 维多利亚']}, fmtN(regionById('VIC1').mwh), L(['Flat','持平']),
           ['Flat in the worst half-year the index has recorded, with ' + fmt1(O.negVicQ2Pct) + '% of Q2 2026 intervals at negative prices.','在该指数记录的最差半年中保持持平，且2026年第二季度有' + fmt1(O.negVicQ2Pct) + '%的时段为负电价。']],
          [{b:['SA1 — South Australia','SA1 — 南澳大利亚']}, fmtN(regionById('SA1').mwh), '+' + fmtPct(regionById('SA1').revChangePct, 0),
           ['The only region that grew, on extreme volatility: ' + fmt1(O.negSaQ4Pct) + '% of Q4 2025 intervals at negative prices.','唯一实现增长的区域，靠的是极端波动：2025年第四季度有' + fmt1(O.negSaQ4Pct) + '%的时段为负电价。']],
          [{b:['TAS1 — Tasmania','TAS1 — 塔斯马尼亚']}, fmtN(regionById('TAS1').mwh), '—',
           ['Too small a fleet to read; hydro sets the price shape and Marinus Link Stage 1 changes it in ' + O.marinusYear + '.','机组规模过小，不足以解读；价格形态由水电决定，而Marinus Link一期将于' + O.marinusYear + '年改变这一形态。']],
        ] },
        { t:'note', text:['These five regional MWh figures sum to ' + fmtN(regionalMWhTotal) + ' MWh against a NEM fleet near ' + fmtN(O.fleetMWh) + ' MWh, so they are the reported regional subset rather than a complete decomposition. Regional A$/MW/yr revenue levels are paywalled — only NEM-wide levels and regional percentage changes are public, and no regional level is asserted anywhere on this dashboard.',
          '这五个区域的MWh合计为' + fmtN(regionalMWhTotal) + 'MWh，而全NEM机组约' + fmtN(O.fleetMWh) + 'MWh，因此它们是已报告的区域子集，而非完整分解。各区域每MW每年的收入水平需付费获取 — 仅全NEM水平与区域百分比变化为公开信息，本看板任何位置均不主张区域绝对水平。'] },
        { t:'why', text:['A spread from ' + fmtPct(regionById('QLD1').revChangePct, 0) + ' to +' + fmtPct(regionById('SA1').revChangePct, 0) + ' in one six-month window across five regions of one market is the strongest argument on this dashboard against modelling the NEM as a single market. NSW1 is the reference precisely because it is representative rather than exceptional — it sits between the two extremes. And the NSW result carries the most transferable lesson: the region whose fleet duration nearly doubled is the region whose revenue fell least.',
          '在同一市场的五个区域中，六个月窗口内的变化从' + fmtPct(regionById('QLD1').revChangePct, 0) + '到+' + fmtPct(regionById('SA1').revChangePct, 0) + '，这是本看板中反对“把NEM当作单一市场建模”的最有力论据。选择NSW1作为参考，恰恰因为它具代表性而非例外性 — 它位于两个极端之间。而新南威尔士的结果给出了最可迁移的教训：机组时长近乎翻倍的区域，正是收入下降最少的区域。'],
          sig:['Duration defended NSW; nothing defended Queensland','时长守住了新南威尔士；昆士兰无所依恃'] },
      ] },

      { t:'card', title:['Negative prices — the charging side of the same story','负电价 — 同一故事的充电侧'], badges:['official'], live:true, blocks:[
        { t:'kpis', items:[
          { l:['Victoria, Q2 2026','维多利亚，2026年第二季度'], v:fmt1(O.negVicQ2Pct) + '<small>% of intervals</small>', d:['third consecutive year of intensification','连续第三年加剧'], b:['official'] },
          { l:['South Australia, Q2 2026','南澳，2026年第二季度'], v:fmt1(O.negSaQ2Pct) + '<small>% of intervals</small>', d:['and ' + fmt1(O.negSaQ4Pct) + '% in Q4 2025','2025年第四季度则为' + fmt1(O.negSaQ4Pct) + '%'], b:['official'] },
          { l:['Utility-scale renewable curtailment, 2025','公用事业级可再生能源限电，2025年'], v:O.nemCurtailTWh + '<small>+ TWh</small>', d:['+' + O.nemCurtailGrowthPct + '% year on year, NEM-wide','全NEM同比+' + O.nemCurtailGrowthPct + '%'], b:['tp'] },
          { l:['Charging cost','充电成本'], v:L(['Near zero or negative','接近零或为负']), d:['for an asset able to absorb energy when the constraint binds','对能在约束生效时吸纳电量的资产而言'], b:['calc'] },
        ] },
        { t:'why', text:['Negative prices are usually presented as a renewable problem and a storage opportunity, and for the charging leg that is exactly right. But note what a fifth of intervals below zero implies for the discharge leg: those are hours in which no battery discharges, so the revenue has to be earned in a narrower window against more competitors. Rising negative-price frequency widens the theoretical spread and shortens the period in which it can be captured — which is why realised revenue can fall while the spread statistic looks healthy.',
          '负电价通常被表述为可再生能源的问题与储能的机会 — 就充电侧而言，这完全正确。但须注意五分之一的时段低于零对放电侧意味着什么：这些时段没有任何电池放电，因此收入必须在更窄的窗口内、面对更多竞争者赚取。负电价频率上升在扩大理论价差的同时缩短了可捕获的时段 — 这正是价差统计看似健康、实际收入却下降的原因。'],
          sig:['A wider spread in a narrower window','更宽的价差，更窄的窗口'] },
      ] },

      { t:'card', title:['Published → executable margin bridge (A$/MWh discharged)','公布至可执行价差桥（A$/MWh放电）'], badges:['calc','illus'], live:true, blocks:[
        { t:'wf', cfg:{ yfmt: v => fmtC(v), h: 300, steps: M.spreadBridge } },
        { t:'note', text:['The optimiser fee is deliberately not a step in this bridge. The model applies it once, as the ' + M.lab.optFee + '% lab input, and deducting it here as well is the most common way this waterfall is misread. No Australian optimiser fee is disclosed in any case — the ' + M.lab.optFee + '% is the midpoint of a reported generic 3–10% revenue-share band.',
          '优化商费用刻意未列为本桥的步骤。模型仅在一处应用它 — 即' + M.lab.optFee + '%的测算输入项；在此处再扣一次是误读本瀑布图最常见的方式。况且澳大利亚从未披露过任何优化商费率 — ' + M.lab.optFee + '%取自公开的通用收益分成区间3–10%的中值。'] },
        { t:'why', text:['About ' + fmtPct((1 - M.spreadBridge[M.spreadBridge.length - 1].v / M.spreadBridge[0].v) * 100, 0) + '% of the modelled spread is lost before it reaches the P&L, and the composition is what distinguishes the NEM. Round-trip efficiency and availability are ordinary. Five-minute dispatch execution is not — this is a market that settles at five-minute resolution, so a forecast error that would be absorbed in a day-ahead market is realised here. And the loss-factor line is permanent rather than episodic: it applies to every megawatt-hour for the life of the asset.',
          '模型价差中约' + fmtPct((1 - M.spreadBridge[M.spreadBridge.length - 1].v / M.spreadBridge[0].v) * 100, 0) + '%在进入损益表前即已损失，而其构成正是NEM的区别所在。往返效率与可用率属常规项。五分钟调度执行则不然 — 这是一个按五分钟颗粒度结算的市场，因此在日前市场中本可被吸收的预测误差，在此会实际发生。而损耗系数一项是永久性而非偶发性的：它适用于资产寿命期内的每一兆瓦时。'],
          sig:['Five-minute settlement prices your forecast error','五分钟结算为你的预测误差定价'] },
      ] },

      { t:'card', title:['Captured spread by COD year — the competition discount','按投运年度的捕获价差 — 竞争折扣'], badges:['forecast','illus'], live:true, blocks:[
        { t:'band', cfg:{ xs: Object.keys(M.codCases), yfmt: v => fmtC(v), h: 270,
          low: Object.values(M.codCases).map(c => c.low),
          base: Object.values(M.codCases).map(c => c.central),
          high: Object.values(M.codCases).map(c => c.high) } },
        { t:'cmp', items:[
          { h:['Captured spread at COD ' + cod,'投运年' + cod + '的捕获价差'], v:fmtC(cc.central) + '/MWh',
            s:['low ' + fmtC(cc.low) + ' · high ' + fmtC(cc.high) + ' — the case spread is the real risk','低' + fmtC(cc.low) + ' · 高' + fmtC(cc.high) + ' — 情景间差距才是真实风险'] },
          { h:['Competition dilution factor','竞争稀释系数'], v:fmtPct(dilutionAt(+cod) * 100, 0), s:['relative to a 2028 reference COD','相对于2028年基准投运年'] },
        ] },
        { t:'why', text:['The central case falls ' + fmtPct((1 - M.codCases[2030].central / M.codCases[2028].central) * 100, 0) + '% between a 2028 and a 2030 COD, and the band width is deliberately wider than any other market on this platform — the realised index moved from ' + kMW(O.idx2024K) + ' to ' + kMW(O.monMayK) + '/MW/yr in two years. That width is the finding, not a hedge. It says that COD-year timing is worth less here than a contracted floor is, because the range within any single year exceeds the drift between years.',
          '中性情景下，2028年与2030年投运之间下降' + fmtPct((1 - M.codCases[2030].central / M.codCases[2028].central) * 100, 0) + '%，且区间宽度刻意宽于本平台任何其他市场 — 实际指数在两年内由' + kMW(O.idx2024K) + '变动至' + kMW(O.monMayK) + '/MW/年。这一宽度本身就是结论，而非对冲式表述。它说明：在此地，投运年度的时点价值低于一份合同保底，因为任何单一年份内部的波动区间已超过年份之间的漂移。'],
          sig:['Within-year range exceeds between-year drift','年内波动区间超过年际漂移'] },
      ] },
    ] };
  };
}
