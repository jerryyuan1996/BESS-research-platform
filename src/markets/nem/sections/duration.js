// ============================== STORAGE DURATION ==============================
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, M, SRC, bandFor, fmtN, fmt1, fmtC, fmtCM, fmtPct, fmtIRR, liveScore, labInputs, labModel } = api;
  const { O, kMW, regionById } = createShared(api);

  return function (){
    const dni = liveScore('durFactors'), band = bandFor(M.durBands, dni);
    const inp = labInputs();
    const r4 = labModel(Object.assign({}, inp, { hours: 4 })), r2 = labModel(Object.assign({}, inp, { hours: 2 }));
    return {
    head: ['Storage Duration — what does the fourth hour actually earn?','储能时长 — 第四小时究竟赚多少？'],
    cap: ['With no capacity mechanism paying for megawatt-hours, the fourth hour in the NEM has to earn its capex from arbitrage alone — FCAS is power-based and does not scale. This tab tests whether it does, and the answer is the clearest positive on this dashboard.',
          '由于没有容量机制为兆瓦时付费，NEM的第四小时必须仅靠套利偿付其造价 — FCAS是功率型服务，不随时长增长。本页对此进行检验，而其答案是本看板中最明确的肯定结论。'],
    blocks: [
      { t:'card', mt:false, title:['Duration answers three different questions','时长回答三个不同问题'], badges:['calc'], live:false, blocks:[
        { t:'table', head:[['Question','问题'],['Mechanism','机制'],['Answer for the NEM at 2h → 4h','NEM由2小时增至4小时的答案']], rows:[
          [{b:['How much capacity revenue?','容量收入多少？']}, ['No capacity mechanism exists','不存在容量机制'],
           ['Zero. The Nelson Review kept the energy-only model on ' + O.reviewDate + ', so this stays zero.','为零。Nelson评估于' + O.reviewDate + '保留了单一电能量模式，因此该项将持续为零。']],
          [{b:['How much ancillary revenue?','辅助服务收入多少？']}, ['FCAS enablement is priced in MW','FCAS启用量按MW定价'],
           ['Zero incremental. A four-hour asset earns exactly what a two-hour asset earns.','增量为零。四小时资产与两小时资产的收入完全相同。']],
          [{b:['How much merchant revenue?','市场化收入多少？']}, ['Deeper cycles across a solar-driven price shape','在光伏驱动的价格形态中进行更深循环'],
           ['Positive and close to linear — a four-hour unit captured ' + O.capturedByFourHourPct + '% of the A$/MWh of adjacent two-hour units, which is unusually little decay.','为正且接近线性 — 四小时机组捕获了相邻两小时机组A$/MWh的' + O.capturedByFourHourPct + '%，衰减异常之小。']],
        ] },
        { t:'wf', cfg:{ yfmt: v => fmtC(v) + 'k', h: 300, steps: M.marginalHour } },
        { t:'why', text:['The fourth hour nets about ' + kMW(M.marginalHour[M.marginalHour.length - 1].v) + '/MW/yr on this dashboard\'s own seed, and it does so with no help at all from a capacity payment or from FCAS. The whole result comes from one measurement: because a four-hour unit captures ' + O.capturedByFourHourPct + '% of a two-hour unit\'s A$/MWh, doubling the energy nearly doubles the revenue. This is the opposite of the Romanian finding, and the reason is the depth of the solar trough rather than anything about the assets.',
          '按本看板自身的种子假设，第四小时净值约' + kMW(M.marginalHour[M.marginalHour.length - 1].v) + '/MW/年，且完全没有借助容量付费或FCAS。这一结果全部来自一项实测：由于四小时机组捕获两小时机组A$/MWh的' + O.capturedByFourHourPct + '%，能量翻倍几乎使收入翻倍。这与罗马尼亚的结论相反，其原因在于光伏低谷的深度，而非资产本身的差异。'],
          sig:['Doubling the energy nearly doubles the revenue','能量翻倍几乎使收入翻倍'] },
      ] },

      { t:'card', title:['Capital cost by duration — the premium has compressed','按时长的资本成本 — 溢价已经压缩'], badges:['official'], live:true, blocks:[
        { t:'kpis', items:[
          { l:['4h installed cost','4小时安装成本'], v:fmtC(O.gencost4h) + '<small>/kWh</small>', d:['GenCost 2025-26, 15 July 2026 — ' + fmtCM(O.gencost4h * 4 * 1000) + '/MW','GenCost 2025-26，2026年7月15日 — ' + fmtCM(O.gencost4h * 4 * 1000) + '/MW'], b:['official'] },
          { l:['2h installed cost','2小时安装成本'], v:fmtC(O.gencost2h) + '<small>/kWh</small>', d:['so 4h costs ' + fmt1(O.gencost4h * 4 / (O.gencost2h * 2)) + '× the 2h build, not 2×','因此4小时的造价为2小时配置的' + fmt1(O.gencost4h * 4 / (O.gencost2h * 2)) + '倍，而非2倍'], b:['official'] },
          { l:['24h installed cost','24小时安装成本'], v:fmtC(O.gencost24h) + '<small>/kWh</small>', d:['below the 4h point — power equipment amortised over more energy','低于4小时水平 — 功率设备被摊薄到更多电量之上'], b:['official'] },
          { l:['4h premium over 2h, change in two years','4小时相对2小时溢价的两年变化'], v:'−' + O.capexPremiumFallLoPct + ' to −' + O.capexPremiumFallHiPct + '<small>%</small>', d:['the structural reason 4h became the archetype','这是4小时成为原型的结构性原因'], b:['tp'] },
        ] },
        { t:'table', head:[['Duration','时长'],['GenCost A$/kWh','GenCost A$/kWh'],['Implied A$/MW','隐含A$/MW'],['Note','说明']], num:[1,2], rows:[
          [{b:['2 hours','2小时']}, fmtC(O.gencost2h), fmtCM(O.gencost2h * 2 * 1000), ['Projected ' + fmtC(O.gencost2h2030) + '/kWh by 2030 and ' + fmtC(O.gencost2h2050) + '/kWh by 2050','预计2030年降至' + fmtC(O.gencost2h2030) + '/kWh，2050年降至' + fmtC(O.gencost2h2050) + '/kWh']],
          [{b:['4 hours','4小时']}, fmtC(O.gencost4h), fmtCM(O.gencost4h * 4 * 1000), ['The archetype; decomposes to ≈' + fmtC(O.gencostPowerKW) + '/kW power plus ≈' + fmtC(O.gencostEnergyKWh) + '/kWh energy','原型配置；可分解为约' + fmtC(O.gencostPowerKW) + '/kW功率段加约' + fmtC(O.gencostEnergyKWh) + '/kWh能量段']],
          [{b:['24 hours','24小时']}, fmtC(O.gencost24h), fmtCM(O.gencost24h * 24 * 1000), ['Cheapest per kWh, dearest per MW — a different asset class with a different buyer','单位电量最便宜、单位功率最贵 — 属另一资产类别、面向另一类买家']],
        ] },
        { t:'why', text:['The GenCost points decompose consistently on a common power-plus-energy split — about ' + fmtC(O.gencostPowerKW) + '/kW plus ' + fmtC(O.gencostEnergyKWh) + '/kWh — which is what makes four hours cost ' + fmt1(O.gencost4h * 4 / (O.gencost2h * 2)) + '× two hours rather than twice as much, and reproduces the independent finding that the four-hour premium fell ' + O.capexPremiumFallLoPct + '–' + O.capexPremiumFallHiPct + '% in two years. The same arithmetic explains the twenty-four-hour point: the power equipment is bought once whatever the duration, so longer assets keep getting cheaper per kilowatt-hour.',
          'GenCost各时长点可按统一的“功率+能量”口径一致分解 — 约' + fmtC(O.gencostPowerKW) + '/kW加' + fmtC(O.gencostEnergyKWh) + '/kWh — 这正是四小时造价为两小时' + fmt1(O.gencost4h * 4 / (O.gencost2h * 2)) + '倍而非两倍的原因，也印证了“四小时溢价两年内下降' + O.capexPremiumFallLoPct + '–' + O.capexPremiumFallHiPct + '%”这一独立结论。同一算式也解释了二十四小时的数值：无论时长如何，功率设备只需购置一次，因此更长时长的资产其单位电量成本持续下降。'],
          sig:['Power equipment is bought once','功率设备只需购置一次'] },
        { t:'src', src: SRC.gencost, use:['Installed capital cost by technology and duration, and projections to 2050','按技术与时长划分的安装资本成本及至2050年的预测'] },
      ] },

      { t:'card', title:['Realised returns by duration — and where this model differs','按时长的实际回报 — 以及本模型与之的差异'], badges:['tp','calc'], live:true, blocks:[
        { t:'kpis', items:[
          { l:['Reported project IRR, 4h','已报告项目IRR，4小时'], v:O.irr4hPct + '<small>%</small>', d:['Modo, July 2026; an earlier vintage put it at ' + O.irr4hEarlyLoPct + '–' + O.irr4hEarlyHiPct + '%','Modo，2026年7月；更早口径为' + O.irr4hEarlyLoPct + '–' + O.irr4hEarlyHiPct + '%'], b:['tp'] },
          { l:['Reported project IRR, 2h','已报告项目IRR，2小时'], v:O.irr2hPct + '<small>%</small>', d:['earlier vintage ' + O.irr2hEarlyLoPct + '–' + O.irr2hEarlyHiPct + '%','更早口径为' + O.irr2hEarlyLoPct + '–' + O.irr2hEarlyHiPct + '%'], b:['tp'] },
          { l:['This dashboard\'s seed, 4h unlevered','本看板种子假设，4小时无杠杆'], v:fmtIRR(r4.unlevIRR), d:['pure merchant, no contracted line, no grant','纯市场化，无合同收入线，无补贴'], b:['calc'] },
          { l:['This dashboard\'s seed, 2h unlevered','本看板种子假设，2小时无杠杆'], v:fmtIRR(r2.unlevIRR), d:['same assumptions, half the energy','假设相同，能量减半'], b:['calc'] },
        ] },
        { t:'note', text:['The ordering matches — four hours beats two hours on both — but the levels do not, and the gap is worth naming rather than smoothing. This dashboard\'s seed carries no contracted revenue at all, because comparison.js sets `contracted` to zero for the NEM. A reported project IRR sample will include assets carrying a CIS collar or a virtual toll. The difference between the two columns is a reasonable first estimate of what the contracted layer is worth.',
          '排序一致 — 四小时在两项口径下均优于两小时 — 但水平不一致，而这一差距值得点明而非抹平。本看板的种子假设完全不含合同化收入，因为comparison.js将NEM的contracted设为零。已报告的项目IRR样本则会包含带有CIS双向结构或虚拟租赁的资产。两列之间的差异，是对合同层价值的一个合理初步估计。'] },
        { t:'why', text:['This is the most useful number on the tab and it comes from a disagreement rather than an agreement. Reported four-hour project IRRs of ' + O.irr4hPct + '% sit well above what a pure-merchant model produces on GenCost capex and the CY2025 revenue index. Nothing about the physics differs, so the residual is contractual. Read it as: in the NEM the contracted layer is not a refinement on the return, it is a substantial part of it.',
          '这是本页最有用的数字，且它来自一处不一致而非一致。已报告的四小时项目IRR为' + O.irr4hPct + '%，明显高于以GenCost造价与2025日历年收入指数为输入的纯市场化模型所得结果。物理层面并无差异，因此残差属于合同层面。应这样解读：在NEM，合同层不是对回报的修饰，而是回报中相当大的一部分。'],
          sig:['The residual between the two is the contract','两者之间的残差就是合同'] },
      ] },

      { t:'card', title:['Duration Economics Scorecard — every component visible and editable','时长经济性评分卡 — 分项全部可见、可编辑'], badges:['calc','illus'], live:true, blocks:[
        { t:'scorecard', id:'durFactors', bands:'durBands' },
        { t:'why', text:['The index sits at ' + dni + '/100 — ' + L(band.n) + '. Two factors score 3: the solar-driven midday trough and the realised 4h-versus-2h IRR gap, and both are measurements rather than judgements. The factor holding it down is that FCAS does not pay for duration (score 1), which is a structural fact that will not change. Read together: the case for four hours is empirical, and the case for six or eight has to be made separately against incremental capex.',
          '该指数为' + dni + '/100 — ' + L(band.n) + '。有两个因子得3分：光伏驱动的午间低谷，以及实测的4小时对2小时IRR差距 — 两者均属实测而非判断。压低它的因子是“FCAS不为时长付费”（得1分），这是不会改变的结构性事实。综合解读：四小时的理由是经验性的；六小时或八小时的理由必须另行对照增量造价论证。'],
          sig:['Empirical at 4h; unproven beyond it','4小时有实证；更长则未获证实'] },
      ] },

      { t:'card', title:['Fleet duration — the competition is lengthening too','机组时长 — 竞争者也在延长'], badges:['official','forecast'], live:true, blocks:[
        { t:'kpis', items:[
          { l:['Fleet average duration, June 2026','机组平均时长，2026年6月'], v:fmt1(O.fleetHours) + '<small> h</small>', d:[fmtN(O.fleetMWh) + ' MWh over ' + fmtN(O.fleetMW) + ' MW',fmtN(O.fleetMW) + 'MW对应' + fmtN(O.fleetMWh) + 'MWh'], b:['calc'] },
          { l:['Passed 2 hours','突破2小时'], v:String(O.fleetOver2hYear), d:['for the first time at end-' + O.fleetOver2hYear,'于' + O.fleetOver2hYear + '年底首次实现'], b:['official'] },
          { l:['Projected past 3 hours','预计突破3小时'], v:String(O.fleetOver3hYear), d:['on current commissioning schedules','按当前投运进度'], b:['forecast'] },
          { l:['NSW fleet duration, Oct 25 – Mar 26','新南威尔士机组时长，2025年10月–2026年3月'], v:'≈3.2<small> h</small>', d:['nearly doubled — and NSW revenue fell least of the mainland regions','近乎翻倍 — 而新南威尔士的收入降幅为大陆各区域中最小'], b:['tp'] },
        ] },
        { t:'why', text:['Duration is an advantage only relative to the fleet you compete with, and that fleet is lengthening: NEM average duration passed two hours at end-' + O.fleetOver2hYear + ' and is projected past three in ' + O.fleetOver3hYear + '. The NSW and Queensland contrast makes the point precisely. NSW fleet duration nearly doubled to 3.2 hours and NSW revenue fell ' + fmtPct(Math.abs(regionById('NSW1').revChangePct), 0) + '%; Queensland duration moved 4% and Queensland revenue fell ' + fmtPct(Math.abs(regionById('QLD1').revChangePct), 0) + '%. Four hours is the right build today and the defensive question is what it is worth when the fleet average reaches it.',
          '时长只有相对于所竞争的机组才构成优势，而该机组正在延长：NEM平均时长于' + O.fleetOver2hYear + '年底突破两小时，预计' + O.fleetOver3hYear + '年突破三小时。新南威尔士与昆士兰的对比恰好说明了这一点。新南威尔士机组时长近乎翻倍至3.2小时，收入下降' + fmtPct(Math.abs(regionById('NSW1').revChangePct), 0) + '%；昆士兰时长仅变动4%，收入下降' + fmtPct(Math.abs(regionById('QLD1').revChangePct), 0) + '%。四小时是当下正确的配置，而防御性的问题是：当机组平均时长追平时，它还值多少。'],
          sig:['Duration is relative, and the fleet is catching up','时长是相对的，而机组正在追赶'] },
      ] },

      { t:'card', title:['Augmentation readiness — the option to add hours later','增容准备度 — 日后增加小时数的选择权'], badges:['illus'], live:false, blocks:[
        { t:'aug' },
        { t:'why', text:['In the NEM the two items most often lost are whether the connection agreement covers added MWh without a re-study, and whether the generator performance standards survive augmentation. Both are cheap to establish at the outset and effectively impossible to retrofit — a re-study puts the asset back into a queue it has already left, and renegotiated performance standards can change the commissioning hold points. A CIS or toll counterparty\'s consent is the third, and it is the one most often assumed rather than drafted.',
          '在NEM，最常被遗漏的两项是：并网协议是否在无需重新研究的情况下覆盖新增MWh，以及增容后发电机组性能标准是否仍然成立。两者在项目起始阶段建立成本低廉，事后则几乎无法补救 — 重新研究会使资产重回其已经离开的队列，而重新协商的性能标准可能改变调试节点。第三项是CIS或租赁对手方的同意，也是最常被推定而非写入文本的一项。'],
          sig:['A re-study puts you back in the queue','重新研究会让你重回队列'] },
      ] },

      /* Relocated from the Investment Lab tab, which moved to a dedicated page. The
         duration question is a market question — where the incremental MWh stops
         paying for itself — so it belongs beside the rest of this tab rather than
         inside a returns model. */
      { t:'card', title:['Duration and route — what each design is worth','时长与路径 — 各设计的价值'], badges:['calc'], live:false, blocks:[
        { t:'designFit' },
        { t:'cap', text:['Every route this market supports, at every duration it declares, priced by the comparison engine the league table uses; at the modelled duration it is the league table case itself. Value is the exit value at commercial operation, at the platform exit yields, less net capital, per MW. A design within 2% of the capital of the modelled design of the best one is in the band. A route priced at one duration is shown there only, and a duration floor must hold to the end of its term.',
          '本市场支持的每一条路径、在其声明的每一个时长下，均由排行榜所用的同一比较引擎定价；在当前模型时长下即为排行榜本身的情景。价值为投运时按平台退出收益率计算的退出价值减去净资本，按每MW计。与最佳设计相差不超过当前模型设计资本2%的设计视为位于区间之内。仅在单一时长下定价的路径只在该时长下显示，且时长下限须维持至期限结束。'] },
        { t:'why', text:['Judge a duration on what it adds to value, not on headline IRR: a longer asset can carry a lower IRR and a higher value, and the capital committed differs several-fold down this table. Read the band before the best point, because inside it the inputs cannot separate the designs.',
          '判断时长应看其对价值的贡献，而非项目整体IRR：更长的资产可能IRR更低而价值更高，且本表各行所投入的资本相差数倍。应先看区间，再看最佳点，因为在区间之内，输入数据无法区分各设计。'],
          sig:['Read the band, then the best point','先看区间，再看最佳点'] },
      ] },
    ] };
  };
}
