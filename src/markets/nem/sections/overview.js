// ============================== OVERVIEW ==============================
import { createShared } from './shared.js';
import '../gridMapData.js';   // side effect: registers this market's grid map

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, M, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, liveScore } = api;
  const { O, P, kMW } = createShared(api);

  return function (){
    const dni = liveScore('durFactors');
    const dband = bandFor(M.durBands, dni);
    const cod = state.codYear, cc = M.codCases[cod] || M.codCases[2028];
    return {
    warn: M.seedWarn,
    blocks: [
      { t:'card', mt:false, title:['Institutional Investor Walkthrough — six questions, one decision path','机构投资人导览 — 六个问题，一条决策路径'],
        badges:['official'], live:false, blocks:[
        { t:'band-story', b:['Core storyline','核心叙事'],
          text:['The NEM is energy-only and is staying that way: the Nelson Review\'s final report of ' + O.reviewDate + ' explicitly kept the model, and every jurisdiction except Queensland had agreed the remaining recommendations by March 2026. So a battery here earns from arbitrage — more than ' + O.arbitrageShareOfLifePct + '% of forecast merchant revenue over asset life — plus a thin and saturating FCAS line, and nothing de-risks either. Certainty exists but must be bought: a Capacity Investment Scheme collar whose floor nobody publishes, or a virtual toll whose price nobody discloses. Meanwhile the merchant leg fell to ' + kMW(O.monMayK) + '/MW/yr in May 2026, the lowest month since the index launched in July 2022.',
                'NEM是单一电能量市场，且将维持这一设计：' + O.reviewDate + '发布的Nelson评估最终报告明确保留了该模式，除昆士兰外所有辖区已于2026年3月前同意其余建议。因此储能收入来自套利 — 占资产全寿命预测市场化收入的' + O.arbitrageShareOfLifePct + '%以上 — 加上一条薄且趋于饱和的FCAS收入，两者均无任何去风险机制。确定性存在，但必须购买：或是保底价从不公布的容量投资计划双向保底—分成协议，或是价格从不披露的虚拟租赁。与此同时，市场化收入于2026年5月跌至' + kMW(O.monMayK) + '/MW/年，为该指数2022年7月推出以来的最低月份。'] },
        { t:'p', text:['Target COD window: ' + M.overall.codWindow, '目标投运窗口：' + M.overall.codWindow] },
        { t:'walk', items:[
          ['01', ['Overview','总览'], ['What is the house view today?','当前总体判断是什么？'], 'home'],
          ['02', ['Market evolution','市场演进'], ['How did the NEM get to 9 GW of storage and a record-low revenue year at the same time?','NEM如何同时达到9GW储能装机与收入创新低？'], 'story'],
          ['03', ['Contracted revenue','合同化收入'], ['What does the Capacity Investment Scheme actually pay, and to whom?','容量投资计划究竟支付什么、支付给谁？'], 'capacity'],
          ['04', ['Asset design','资产设计'], ['Is 4h right, and what does the fourth hour actually earn?','4小时是否正确？第四小时究竟赚多少？'], 'duration'],
          ['05', ['Underwriting','项目承销'], ['Can the project connect, and what does the loss factor cost?','项目能否并网？损耗系数的代价是多少？'], 'grid'],
          ['06', ['Portfolio application','组合应用'], ['Which screened NEM opportunity passes the gates?','所筛选的NEM机会中哪一个能通过门槛？'], 'portfolio'],
        ] },
        { t:'why', text:['The six questions are sequenced so each one can veto the next. A market building storage faster than anywhere outside the US and China (02) is not the same as a revenue stack a lender will size against (03), a duration that pays for its own capex (04), a connection point whose loss factor and curtailment history you have actually read (05), or a specific opportunity worth committing capital to (06). In the NEM the veto usually falls at step 03 — the merchant case alone does not clear a lender\'s coverage test at current spreads, which is why the contracted layer decides the deal.',
          '六个问题按“逐级否决”排序：一个储能建设速度仅次于美国与中国的市场（02），不等于贷款人愿据以安排规模的收入结构（03），不等于能自行偿付造价的时长配置（04），不等于你确已查阅过损耗系数与限电历史的并网点（05），也不等于某个具体机会值得投入资本（06）。在NEM，否决通常发生在第03步 — 按当前价差，仅靠市场化收入无法通过贷款人的偿债覆盖检验，因此合同层决定交易成败。'],
          sig:['The veto usually falls at the contracted layer','否决通常发生在合同层'] },
      ] },

      { t:'g2', cards:[
        { title:['Card A — Contracted Revenue Signal','Card A — 合同化收入信号'], live:false, blocks:[
          { t:'chip', cls:'warn', text:['A collar, not a payment — and its level is never published','是双向保底—分成结构而非固定付费 — 且其水平从不公布'] },
          { t:'kpis', items:[
            { l:['Capacity mechanism','容量机制'], v:L(['None','无']), d:['the Nelson Review kept the energy-only model, ' + O.reviewDate,'Nelson评估于' + O.reviewDate + '保留单一电能量模式'], b:['official'] },
            { l:['CIS shortfall share below the floor','CIS保底价以下的补足比例'], v:O.cisFloorSharePct + '<small>%</small>', d:['paid by the Commonwealth; the project keeps 100% between floor and ceiling','由联邦政府支付；保底价与上限之间项目保留100%'], b:['official'] },
            { l:['CIS share taken above the ceiling','CIS上限以上的分成比例'], v:O.cisCeilingSharePct + '<small>%</small>', d:['the upside is capped as well as the downside','上行与下行同时被限制'], b:['official'] },
            { l:['Published CIS floor, ceiling or cap','已公布的CIS保底价、上限或支付上限'], v:L(['None, for any project','无，任何项目均无']), d:['all three are bidder-submitted and commercial-in-confidence','三者均由投标人提交且属商业机密'], b:['verify'] },
            { l:['NSW LTESA Round 6 average annuity cap','新南威尔士LTESA第6轮平均年金上限'], v:fmtCk(O.ltesaR6CapMW) + '<small>/MW/yr</small>', d:['down from ' + fmtCk(O.ltesaR5CapMW) + ' in Round 5 — ' + fmtPct((1 - O.ltesaR6CapMW / O.ltesaR5CapMW) * 100, 0) + ' in one round','由第5轮的' + fmtCk(O.ltesaR5CapMW) + '下降 — 单轮压缩' + fmtPct((1 - O.ltesaR6CapMW / O.ltesaR5CapMW) * 100, 0)], cls:'down', b:['official'] },
          ] },
          { t:'why', text:['This is the structural fact that separates the NEM from its own neighbour. Western Australia pays ' + fmtCk(P.rcmPricePerMW) + '/MW/yr for capacity on a ' + P.rcmElectionYears + '-year fixed-price election; the NEM pays nothing for capacity at all and will not start. What it offers instead is a competitively bid collar whose level is confidential, on a scheme that winds up in ' + O.cisWindUp + '. The practical consequence: a NEM project that misses Tender 10 has no state contracting route until the ESEM commences in ' + O.esemStart + ', and the LTESA cap compressed ' + fmtPct((1 - O.ltesaR6CapMW / O.ltesaR5CapMW) * 100, 0) + ' between the last two rounds.',
            '这是使NEM区别于其近邻的结构性事实。西澳按' + P.rcmElectionYears + '年固定价选择权为容量支付' + fmtCk(P.rcmPricePerMW) + '/MW/年；NEM则完全不为容量付费，且不会改变。它提供的替代方案是竞争性投标的双向保底—分成结构，其水平保密，而该计划将于' + O.cisWindUp + '年结束。实务后果是：错过第10轮招标的NEM项目，在ESEM于' + O.esemStart + '启动之前将没有任何州级或联邦合同路径；而LTESA上限在最近两轮之间已压缩' + fmtPct((1 - O.ltesaR6CapMW / O.ltesaR5CapMW) * 100, 0) + '。'],
            sig:['Certainty exists, but its price is confidential','确定性存在，但其价格保密'] },
        ] },
        { title:['Card B — Merchant Signal','Card B — 市场化收入信号'], live:false, blocks:[
          { t:'chip', cls:'critical', text:['Compressing fast — the weakest half-year since the index launched','快速压缩 — 指数推出以来最弱的半年'] },
          { t:'kpis', items:[
            { l:['BESS revenue index, CY2024','储能收入指数，2024日历年'], v:kMW(O.idx2024K) + '<small>/MW/yr</small>', d:['+' + fmtPct((O.idx2024K / O.idx2023K - 1) * 100, 0) + ' on CY2023','较2023日历年+' + fmtPct((O.idx2024K / O.idx2023K - 1) * 100, 0)], b:['tp'] },
            { l:['BESS revenue index, CY2025','储能收入指数，2025日历年'], v:kMW(O.idx2025K) + '<small>/MW/yr</small>', d:[fmtPct((O.idx2025K / O.idx2024K - 1) * 100, 0) + ' on CY2024','较2024日历年' + fmtPct((O.idx2025K / O.idx2024K - 1) * 100, 0)], cls:'down', b:['tp'] },
            { l:['Oct 2025 – Mar 2026','2025年10月–2026年3月'], v:kMW(O.idxOctMarK) + '<small>/MW/yr</small>', d:[O.idxOctMarChangePct + '% year on year — the weakest Oct–Mar since July 2022','同比' + O.idxOctMarChangePct + '% — 2022年7月以来最弱的10月至3月区间'], cls:'down', b:['tp'] },
            { l:['May 2026','2026年5月'], v:kMW(O.monMayK) + '<small>/MW/yr</small>', d:['the lowest month since the index launched','该指数推出以来的最低月份'], cls:'down', b:['tp'] },
            { l:['NEM-wide charge/discharge spread, Q2 2026','全NEM充放电价差，2026年第二季度'], v:fmtC(O.q2SpreadAud) + '<small>/MWh</small>', d:[O.q2SpreadFallPct + '% year on year as the fleet passed ' + fmtN(O.installedMW) + ' MW','随装机突破' + fmtN(O.installedMW) + 'MW同比下跌' + O.q2SpreadFallPct + '%'], cls:'down', b:['official'] },
            { l:['Captured spread at COD ' + cod,'投运年' + cod + '的捕获价差'], v:fmtC(cc.central) + '<small>/MWh</small>', d:['low ' + fmtC(cc.low) + ' · high ' + fmtC(cc.high),'低' + fmtC(cc.low) + ' · 高' + fmtC(cc.high)], b:['illus'] },
          ] },
          { t:'why', text:['Read the index and the fleet together and the mechanism is unambiguous: ' + fmtN(O.addedMW) + ' MW and ' + fmtN(O.addedMWh) + ' MWh began commissioning in the twelve months to Q2 2026, more than doubling installed capacity, and the NEM-wide spread fell ' + O.q2SpreadFallPct + '% in the same period. This is not a weather year or a gas-price year. It is the arrival of the competition, and the ' + fmtN(O.queueGW) + ' GW still in the connection queue says the compression is not finished.',
            '将指数与装机放在一起看，机制一目了然：截至2026年第二季度的十二个月内，' + fmtN(O.addedMW) + 'MW与' + fmtN(O.addedMWh) + 'MWh开始调试，使装机规模增加一倍以上，而同期全NEM价差下跌' + O.q2SpreadFallPct + '%。这不是天气年或燃气价格年的问题，而是竞争已经到场；仍在排队中的' + fmtN(O.queueGW) + 'GW说明压缩尚未结束。'],
            sig:['This is competition, not weather','这是竞争，不是天气'] },
        ] },
        { title:['Card C — FCAS Signal','Card C — FCAS信号'], live:false, blocks:[
          { t:'chip', cls:'serious', text:['Structurally saturated — and it does not scale with duration','结构性饱和 — 且不随时长增长'] },
          { t:'kpis', items:[
            { l:['FCAS share of battery revenue, Oct 25 – Mar 26','FCAS占储能收入比重，2025年10月–2026年3月'], v:O.fcasShareOctMarPct + '<small>%</small>', d:['described as structurally saturated','被描述为结构性饱和'], b:['tp'] },
            { l:['FCAS revenue, Q2 2026','FCAS收入，2026年第二季度'], v:fmtCM(O.fcasQ2Am * 1e6), d:[fmtPct(-O.fcasQ2FallPct, 0) + ' in one quarter, to ' + O.fcasQ2SharePct + '% of battery revenue','单季度' + fmtPct(-O.fcasQ2FallPct, 0) + '，降至储能收入的' + O.fcasQ2SharePct + '%'], cls:'down', b:['official'] },
            { l:['Net battery revenue, Q2 2026','储能净收入，2026年第二季度'], v:fmtCM(O.battRevQ2Am * 1e6), d:['all revenue streams, NEM-wide','全NEM，所有收入来源合计'], b:['official'] },
            { l:['Lower Contingency FCAS, Jul → Aug 2025','下调事故备用FCAS，2025年7月→8月'], v:kMW(O.lowerContJulK) + ' → ' + kMW(O.lowerContAugK), d:['more than doubled during South Australian islanding — an event, not a trend','南澳孤岛运行期间涨逾一倍 — 属事件而非趋势'], b:['tp'] },
          ] },
          { t:'why', text:['FCAS is now under a tenth of the stack and shrinking, and the one dramatic move — Lower Contingency more than doubling to ' + kMW(O.lowerContAugK) + '/MW/yr between July and August 2025 — was South Australia islanding, which is an event rather than a trend. Two consequences for the model. FCAS is power-based, so a four-hour asset earns no more of it than a two-hour asset does; and any case that leans on an islanding-style spike is leaning on a system emergency it cannot forecast.',
            'FCAS目前已不足收入结构的十分之一且仍在收缩，而唯一的剧烈变动 — 2025年7月至8月下调事故备用涨逾一倍至' + kMW(O.lowerContAugK) + '/MW/年 — 源于南澳孤岛运行，属事件而非趋势。对模型有两点含义：FCAS是功率型服务，四小时资产在此项上的收入并不高于两小时资产；任何依赖孤岛型价格尖峰的投资逻辑，实际上是在依赖一场无法预测的系统紧急事件。'],
            sig:['Power-based, saturating, event-driven','功率型、趋于饱和、事件驱动'] },
        ] },
        { title:['Card D — Duration Signal','Card D — 时长信号'], live:false, blocks:[
          { t:'chip', cls:'good', text:['4h is the archetype, and the fourth hour clears on its own economics','4小时为原型，且第四小时凭自身经济性即可成立'] },
          { t:'kpis', items:[
            { l:['Duration-Need Index','时长需求指数'], v:dni + '<small> / 100</small>', d:dband.n, b:['calc','illus'] },
            { l:['Realised project IRR, 4h vs 2h','实际项目IRR，4小时对2小时'], v:O.irr4hPct + '% <small>vs</small> ' + O.irr2hPct + '%', d:['Modo, July 2026 — an earlier vintage put 4h at ' + O.irr4hEarlyLoPct + '–' + O.irr4hEarlyHiPct + '% against 2h at ' + O.irr2hEarlyLoPct + '–' + O.irr2hEarlyHiPct + '%','Modo，2026年7月 — 更早口径为4小时' + O.irr4hEarlyLoPct + '–' + O.irr4hEarlyHiPct + '%、2小时' + O.irr2hEarlyLoPct + '–' + O.irr2hEarlyHiPct + '%'], b:['tp'] },
            { l:['Net marginal value, 2h → 4h','2小时→4小时净边际价值'], v:kMW(M.marginalHour[M.marginalHour.length - 1].v) + '<small>/MW/yr</small>', d:['clears comfortably — see the waterfall on the duration tab','显著为正 — 详见时长页的瀑布图'], b:['calc'] },
            { l:['Fleet average duration, Jun 2026','机组平均时长，2026年6月'], v:fmt1(O.fleetHours) + '<small> h</small>', d:[fmtN(O.fleetMWh) + ' MWh over ' + fmtN(O.fleetMW) + ' MW; projected past 3h in ' + O.fleetOver3hYear,fmtN(O.fleetMW) + 'MW对应' + fmtN(O.fleetMWh) + 'MWh；预计' + O.fleetOver3hYear + '年突破3小时'], b:['calc'] },
          ] },
          { t:'flow', items:[
            ['Deep solar-driven midday trough','光伏驱动的深度午间低谷'],
            ['4h capex premium down ' + O.capexPremiumFallLoPct + '–' + O.capexPremiumFallHiPct + '% in two years','4小时造价溢价两年下降' + O.capexPremiumFallLoPct + '–' + O.capexPremiumFallHiPct + '%'],
            ['4h captures ' + O.capturedByFourHourPct + '% of the 2h A$/MWh','4小时捕获2小时A$/MWh的' + O.capturedByFourHourPct + '%'],
            ['No capacity payment for duration','时长无容量付费'],
            ['4h is the default build','4小时为默认配置'],
          ], sep:'+' },
          { t:'why', text:['This is the one question on which the NEM answers cleanly, and it answers the opposite way to Romania. GenCost puts four hours at ' + fmtC(O.gencost4h) + '/kWh against two hours at ' + fmtC(O.gencost2h) + '/kWh, so the fourth hour is bought at roughly ' + fmt1(O.gencost4h * 4 / (O.gencost2h * 2)) + '× the cost of the two-hour build rather than double, while a four-hour unit at Melbourne Renewable Energy Hub earned ' + O.capturedByFourHourPct + '% of the A$/MWh of adjacent two-hour units. Duration is not the risk here. Revenue certainty is.',
            '这是NEM能够干净利落作答的唯一问题，且答案与罗马尼亚相反。GenCost显示四小时' + fmtC(O.gencost4h) + '/kWh、两小时' + fmtC(O.gencost2h) + '/kWh，因此第四小时的取得成本约为两小时配置的' + fmt1(O.gencost4h * 4 / (O.gencost2h * 2)) + '倍而非两倍；而墨尔本可再生能源枢纽的四小时机组捕获了相邻两小时机组A$/MWh的' + O.capturedByFourHourPct + '%。此处风险不在时长，而在收入确定性。'],
            sig:['Duration is settled; revenue is not','时长问题已定，收入问题未定'] },
        ] },
        { title:['Card E — Grid & Congestion Signal','Card E — 并网与拥塞信号'], badges:['illus'], live:false, blocks:[
          { t:'kpis', items:[
            { l:['Compensation for being constrained off','受约束停机的补偿'], v:L(['None','无']), d:['no firm transmission rights exist; the Congestion Relief Market was recommended not to proceed','不存在固定输电权；拥塞缓解市场已被建议不予推行'], b:['official'] },
            { l:['Average MLF cost to NEM batteries','NEM储能平均MLF成本'], v:fmtCk(O.mlfCostPerMW) + '<small>/MW/yr</small>', d:['some assets ' + O.mlfMultipleLo + '–' + O.mlfMultipleHi + '× higher; republished every ' + O.mlfResetDate,'部分资产高出' + O.mlfMultipleLo + '–' + O.mlfMultipleHi + '倍；每年' + O.mlfResetDate + '重新公布'], b:['tp'] },
            { l:['Network curtailment within the battery fleet','储能行业内网络限电量'], v:fmtN(O.fleetCurtailMWh) + '<small> MWh</small>', d:['2025; NEM-wide renewable curtailment passed ' + O.nemCurtailTWh + ' TWh, +' + O.nemCurtailGrowthPct + '% year on year','2025年；全NEM可再生能源限电量突破' + O.nemCurtailTWh + 'TWh，同比+' + O.nemCurtailGrowthPct + '%'], b:['tp'] },
          ] },
          { t:'note', text:['Required protection: read the connection point\'s own marginal loss factor history and curtailment record, never the regional average. Batteries site near load and fare better than solar or wind, but AEMO republishes the factors every ' + O.mlfResetDate + ' — this is a live annual variable, not a discount agreed at financial close.',
            '必要保护：应查阅并网点自身的边际损耗系数历史与限电记录，绝不使用区域平均值。储能靠近负荷选址，表现优于光伏与风电，但AEMO每年' + O.mlfResetDate + '重新公布系数 — 这是逐年变动的活变量，而非融资交割时锁定的折扣。'] },
          { t:'why', text:['The NEM connection failure mode is distinctive: it is not that you cannot connect, it is that connecting does not give you a right to export. No NEM generator or storage holds firm transmission rights, a constrained unit receives nothing, and the mechanism that would have changed that was recommended not to proceed. What does reach the asset is a permanent settlement multiplier — an MLF of 0.90 means ninety cents on the dollar for the life of the project.',
            'NEM并网的失效模式颇为特殊：问题不在于能否并网，而在于并网并不赋予送出权利。NEM中任何发电或储能均不持有固定输电权，受约束机组得不到任何补偿，而本可改变这一状况的机制已被建议不予推行。真正传导至资产的是永久性结算乘数 — 0.90的MLF意味着资产整个寿命期内每一元只能收到九角。'],
            sig:['You can connect; you cannot count on exporting','你可以并网，但不能指望送出'] },
        ] },
      ] },

      { t:'card', title:['Card F — Underwriting rules','Card F — 承保规则'], badges:['illus'], live:false, blocks:[
        { t:'list', ol:true, items:[
          [['Decide the contracted route before the site: a CIS agreement, a virtual toll, or a deliberate merchant position with the gearing that implies. There is no fourth option and no capacity market to fall back on.','在选定场址之前先确定合同路径：CIS协议、虚拟租赁，或有意为之的市场化持仓并配以相应杠杆。不存在第四种选择，也没有容量市场可作退路。'],
           ['Applies when: any base case relying on merchant revenue for debt service','适用条件：任何以市场化收入偿债的基准情景']],
          [['Bracket the CIS floor rather than assuming one. No floor, ceiling or payment cap has been published for any project, and a model that states one is stating a guess as a fact.','应对CIS保底价取区间估计而非直接假设。任何项目的保底价、上限与支付上限均未公布，凡在模型中给出确定数值者，即是把猜测当作事实陈述。'],
           ['Applies when: a single CIS floor value in the model','适用条件：模型中出现单一CIS保底数值']],
          [['Read the connection point\'s marginal loss factor history and curtailment record before pricing the site. Modo finds location alone moves IRRs by up to 1.8 percentage points.','在为场址定价之前，先查阅该并网点的边际损耗系数历史与限电记录。Modo发现仅选址一项即可使IRR相差最多1.8个百分点。'],
           ['Applies when: any site priced off a regional average','适用条件：任何以区域平均值定价的场址']],
          [['Build four hours. The capex premium over two hours has fallen ' + O.capexPremiumFallLoPct + '–' + O.capexPremiumFallHiPct + '% in two years and the realised IRR gap is ' + O.irr4hPct + '% against ' + O.irr2hPct + '%.','按四小时建设。相对两小时的造价溢价两年内已下降' + O.capexPremiumFallLoPct + '–' + O.capexPremiumFallHiPct + '%，而实际IRR为' + O.irr4hPct + '%对' + O.irr2hPct + '%。'],
           ['Applies when: a two-hour design proposed for a 2028+ COD','适用条件：为2028年及以后投运提出两小时设计']],
          [['Stress degradation at 4%/yr, not 2%. Australian warranties commonly guarantee ' + '60–70% capacity retention, and Modo finds Queensland projects lose value once degradation costs are included.','衰减率应按每年4%而非2%作压力测试。澳大利亚质保通常保证60–70%的容量保持率，且Modo发现一旦计入衰减成本，昆士兰项目将出现价值下降。'],
           ['Applies when: degradation held flat at 2%/yr through asset life','适用条件：全寿命期衰减率固定为每年2%']],
        ] },
        { t:'why', text:['Four of the five rules are about buying or pricing certainty rather than improving the estimate, the right emphasis for a market where the build is easy and the revenue is not. Three of the five conditions hold at today\'s snapshot for a typical screened project — merchant debt service, a stated CIS floor, and a regional-average site price — so these protections are mandatory. The call itself is on the Brief.',
          '五条规则中有四条关乎购买或为确定性定价，而非改进估算 — 对一个“建设容易、收入不易”的市场而言，这是正确的侧重。对典型筛选项目而言，按当前快照五项条件中已有三项成立：以市场化收入偿债、给出确定的CIS保底数值、以区域平均值为场址定价 — 因此这些保护措施为必须。结论本身见要点页。'],
          sig:['Buy certainty; do not model it','购买确定性，而非为其建模'] },
      ] },

      { t:'card', title:['Revenue Driver Bridge — how nameplate MW becomes net operating revenue','收入驱动桥 — 铭牌MW如何变为净运营收入'], badges:['calc'], live:false, blocks:[
        { t:'sub', text:['Contracted channel (CIS collar or virtual toll) — changes the risk, not the physics','合同通道（CIS双向保底—分成结构或虚拟租赁） — 改变风险，而非物理特性'] },
        { t:'flow', items:[
          ['Tender award','招标中标'], ['Executed agreement, term ' + O.cisTermMinYr + '–' + O.cisTermMaxYr + ' yr','已签协议，期限' + O.cisTermMinYr + '–' + O.cisTermMaxYr + '年'],
          ['Floor binds: ' + O.cisFloorSharePct + '% of the shortfall','触及保底：补足缺口的' + O.cisFloorSharePct + '%'], ['Ceiling binds: ' + O.cisCeilingSharePct + '% of the excess shared','触及上限：超出部分分成' + O.cisCeilingSharePct + '%'],
          ['Bankable revenue line','可融资收入线'],
        ] },
        { t:'sub', text:['Merchant channel (arbitrage plus FCAS, net)','市场化通道（套利加FCAS，净值）'] },
        { t:'flow', items:[
          ['Charge/discharge spread','充放电价差'], ['− five-minute execution','− 五分钟执行折损'],
          ['− round-trip efficiency','− 往返效率'], ['− marginal loss factor','− 边际损耗系数'],
          ['− uncompensated curtailment','− 无补偿限电'], ['− optimiser fee','− 优化商费用'], ['+ FCAS','+ FCAS'], ['Net operating revenue','净运营收入'],
        ] },
        { t:'note', text:['The two channels are not additive in the way a capacity payment and a merchant line are. A CIS collar sits on top of the merchant revenue and reshapes its distribution — while the floor binds, owner receipts are ' + fmt1(O.cisFloorSharePct / 100) + ' × floor plus ' + fmtPct(100 - O.cisFloorSharePct, 0) + ' of market revenue. That linearisation is exact only in the floor-binding regime, and at today\'s merchant levels the floor does bind.',
          '两条通道并非像容量付费与市场化收入那样简单相加。CIS的双向结构叠加于市场化收入之上，重塑其分布 — 在保底生效期间，业主收入等于' + fmt1(O.cisFloorSharePct / 100) + '×保底价加上市场化收入的' + fmtPct(100 - O.cisFloorSharePct, 0) + '。该线性化仅在保底生效区间内精确成立，而按当前市场化收入水平，保底确实生效。'] },
        { t:'why', text:['This bridge is the dashboard\'s organising idea and it makes the NEM structure explicit: there is no capacity line to add, so the contracted channel does not raise expected revenue, it narrows the distribution. That distinction matters at the credit committee. A collar does not make the asset earn more; it makes the low case survivable, which is precisely what a lender is buying. Model the two channels as one distribution, never as two revenue lines stacked.',
          '本桥是整个看板的组织主线，并使NEM的结构一目了然：不存在可供相加的容量收入线，因此合同通道并不提高预期收入，而是收窄分布。这一区别在信贷委员会层面至关重要。双向保底结构不会让资产多赚，而是让低情景可以承受 — 这正是贷款人所购买的东西。应将两条通道建模为同一分布，绝不可视为两条叠加的收入线。'],
          sig:['A collar narrows the distribution, not the mean','双向保底收窄的是分布，而非均值'] },
      ] },
    ] };
  };
}
