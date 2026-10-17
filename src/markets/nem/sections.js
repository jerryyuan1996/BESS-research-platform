import { gridMapById } from '../gridMapRegistry.js';
import { congestionFor } from '../congestionRegistry.js';

/* ---------------------------------------------------------------------------
   National Electricity Market — declarative section specs.

   One SEC_B entry per tab id in tabs.js, each returning a block spec that the
   shared engine draws. SECTIONS() wraps them in lazy getters so every string
   re-evaluates when the language changes.

   The engine hands in everything these specs use through `api`; the only direct
   imports are the grid map and the congestion register, which are joined to the
   market by id rather than by this file — the same arrangement ie/sections.js
   uses. There is no `lab` tab and no `debt` tab: the Investment Lab and project
   debt live on the home page now, and the duration comparison that used to sit
   inside the lab is on the duration tab instead.
   --------------------------------------------------------------------------- */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function buildSections(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, dilutionAt, labInputs, labModel, pipelineByYear } = api;

// ---------------- section registry ----------------
const SEC_B = {};
function SECTIONS(){
  const o = {};
  Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
  return o;
}
const O = M.official;
const P = M.peer;
/* The revenue index is published in A$ thousands per MW per year and is carried
   in the dataset in the same unit, so it gets its own formatter rather than
   being multiplied up and back down at every call site. */
const kMW = v => fmtC(v) + 'k';
const regionById = id => M.regions.find(r => r.id === id);
const regionalMWhTotal = M.regions.reduce((a, r) => a + r.mwh, 0);

// ============================== OVERVIEW ==============================
SEC_B.home = function (){
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

// ============================== NEM MARKET STORY ==============================
SEC_B.story = function (){
  return {
  head: ['NEM Market Evolution — from a coal-and-interconnector system to the world\'s third-largest battery market',
         'NEM市场演进 — 从煤电与互联线系统到全球第三大储能市场'],
  cap: ['This section is the narrative bridge between the Overview and the detailed underwriting tabs. It separates historical facts, observed market outcomes and the forward investment conclusion.',
        '本节连接“总览”与后续承销分析，明确区分历史事实、已观察市场结果及前瞻投资结论。'],
  blocks: [
    { t:'card', mt:false, title:['One-minute orientation for a new institutional investor','机构投资人的一分钟市场定位'], badges:['official','public'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Market design','市场设计'], v:L(['Energy-only','单一电能量']), d:['no capacity mechanism; five regions, five-minute dispatch and settlement','无容量机制；五个区域，五分钟调度与结算'], b:['official'] },
        { l:['Reference region','参考区域'], v:'NSW1', d:['largest fleet — ' + fmtN(regionById('NSW1').mwh) + ' MWh of a NEM total near ' + fmtN(O.fleetMWh) + ' MWh','装机最大 — 在全NEM约' + fmtN(O.fleetMWh) + 'MWh中占' + fmtN(regionById('NSW1').mwh) + 'MWh'], b:['official'] },
        { l:['Installed battery power','储能装机功率'], v:fmtN(O.installedMW) + '<small> MW</small>', d:['passed 9 GW in Q2 2026; ' + fmtN(O.addedMW) + ' MW began commissioning in twelve months','2026年第二季度突破9GW；十二个月内' + fmtN(O.addedMW) + 'MW开始调试'], b:['official'] },
        { l:['Connection pipeline','并网管线'], v:fmtN(O.queueGW) + '<small> GW</small>', d:['up from ' + fmtN(O.queue2022GW) + ' GW in September 2022','由2022年9月的' + fmtN(O.queue2022GW) + 'GW增长而来'], b:['official'] },
        { l:['2025 financial close','2025年融资交割'], v:fmt1(O.fc2025GW) + '<small> GW</small>', d:[fmtCM(O.fc2025Abn * 1e9) + ', up ' + O.fc2025GrowthPct + '% on 2024',fmtCM(O.fc2025Abn * 1e9) + '，较2024年增长' + O.fc2025GrowthPct + '%'], b:['public'] },
        { l:['Cumulative investment 2017–2025','2017–2025年累计投资'], v:fmtCM(O.cumInvestAbn * 1e9), d:['across ' + fmt1(O.cumInvestGW) + ' GW — third-largest utility-scale battery market after the US and China','覆盖' + fmt1(O.cumInvestGW) + 'GW — 仅次于美国与中国的全球第三大公用事业级储能市场'], b:['public'] },
      ] },
      { t:'reco', b:['Institutional conclusion: ','机构投资结论：'],
        text:['The NEM offers the deepest delivery capability in the comparison set and the thinnest contracted revenue. Everything about building here works — supply chains, contractors, financing, grid-forming inverters on ' + O.gridFormingPct + '% of the pipeline. What does not work is being paid for it on a merchant basis at current spreads. The winning project is the one that secures a CIS agreement or a virtual toll and a connection point with a defensible loss factor, not the one with the best price forecast.',
              'NEM在本对比样本中拥有最强的交付能力与最薄的合同化收入。这里与“建设”相关的一切都运转良好 — 供应链、承包商、融资，管线中' + O.gridFormingPct + '%配置构网型逆变器。运转不良的是：按当前价差、以市场化方式获得报酬。优质项目是那些取得CIS协议或虚拟租赁、并拥有损耗系数可辩护的并网点的项目，而非价格预测最好的项目。'] },
      { t:'why', text:['Two facts do the work. The connection pipeline has gone from ' + fmtN(O.queue2022GW) + ' GW in September 2022 to ' + fmtN(O.queueGW) + ' GW, which already exceeds the ' + fmtN(O.ispStorage2030GW) + ' GW of grid-scale storage AEMO\'s 2026 ISP requires by 2030. And the NEM-wide charge/discharge spread fell ' + O.q2SpreadFallPct + '% year on year in Q2 2026 to ' + fmtC(O.q2SpreadAud) + '/MWh. Those two facts are the same fact: the pipeline that proves the market works is the pipeline that is competing away the reason to build.',
        '此处两项事实最为关键。并网管线已由2022年9月的' + fmtN(O.queue2022GW) + 'GW增至' + fmtN(O.queueGW) + 'GW，超过AEMO 2026年ISP要求的2030年前' + fmtN(O.ispStorage2030GW) + 'GW电网级储能。同时，2026年第二季度全NEM充放电价差同比下跌' + O.q2SpreadFallPct + '%至' + fmtC(O.q2SpreadAud) + '/MWh。这两项事实其实是同一项：证明市场有效的管线，正是竞争消解建设理由的那条管线。'],
        sig:['The pipeline that proves the market erodes it','证明市场的管线正在侵蚀市场'] },
    ] },

    { t:'card', title:['How the NEM storage case was built — four changes in five years','NEM储能逻辑的形成 — 五年内四次变化'], badges:['official','public'], blocks:[
      { t:'band-story', b:['Why this history is underwriting-relevant','这段历史为何与承销相关'],
        text:['The NEM did not design a storage market; it acquired one from coal retirement, rooftop solar and a Commonwealth underwriting scheme. Each of the four changes below improved the case, and only one of them created a contracted revenue line — which is being wound up in ' + O.cisWindUp + '. That is why the diligence emphasis here is contractual rather than analytical.',
              'NEM并未设计储能市场；它是煤电退役、屋顶光伏与联邦承销计划共同的产物。以下四项变化均改善了投资逻辑，其中只有一项创造了合同化收入线 — 而该机制将于' + O.cisWindUp + '年结束。这正是当地尽调侧重合同而非分析的原因。'] },
      { t:'timeline', items:[
        { y:'2017–2021', t:['Frequency services prove the technology','频率服务验证技术'],
          p:['The first large NEM batteries earned most of their revenue in FCAS, and AEMO introduced very fast raise and lower markets in 2021 as synchronous plant retired and inertia thinned.',
             'NEM首批大型电池的收入主要来自FCAS；随着同步机组退役、惯量下降，AEMO于2021年设立了极快速上调与下调市场。'],
          i:['FCAS proved batteries work and then saturated. It is now under a tenth of the stack, which is why no NEM case should be built on ancillary services.',
             'FCAS验证了电池的可行性，随后趋于饱和。目前其占收入结构不足十分之一 — 这正是任何NEM投资逻辑都不应建立在辅助服务之上的原因。'] },
        { y:'2022–2024', t:['Rooftop and utility solar create the trough','屋顶与大型光伏形成低谷'],
          p:['Negative-price intervals multiplied. In Q2 2026 they reached ' + fmt1(O.negVicQ2Pct) + '% of intervals in Victoria and ' + fmt1(O.negSaQ2Pct) + '% in South Australia — a third consecutive year of intensification, after South Australia hit ' + fmt1(O.negSaQ4Pct) + '% in Q4 2025.',
             '负电价时段成倍增加。2026年第二季度，维多利亚达到' + fmt1(O.negVicQ2Pct) + '%、南澳达到' + fmt1(O.negSaQ2Pct) + '%，为连续第三年加剧；此前南澳在2025年第四季度曾达到' + fmt1(O.negSaQ4Pct) + '%。'],
          i:['This is the arbitrage opportunity in one sentence: solar creates the trough that storage monetises, and it keeps deepening. It is also the reason charging is nearly free and discharging is increasingly crowded.',
             '这是套利机会的一句话概括：光伏创造了储能所变现的低谷，且低谷持续加深。这同时也是充电几乎无成本、而放电日益拥挤的原因。'] },
        { y:'2023–2026', t:['The Capacity Investment Scheme underwrites the build','容量投资计划为建设提供承销'],
          p:['Tender 3 in December 2024 awarded ' + fmtN(O.t3MW) + ' MW and ' + fmtN(O.t3MWh) + ' MWh across ' + O.t3Projects + ' projects, ' + O.t3FourHourProjects + ' of them four-hour, against ' + O.t3Bids + ' bids offering roughly ' + fmtN(O.t3BidMW / 1000) + ' GW. Tender 8 in June 2026 awarded ' + fmtN(O.t8MW) + ' MW and ' + fmtN(O.t8MWh) + ' MWh — the largest storage procurement in the scheme\'s history.',
             '2024年12月的第3轮招标在' + O.t3Projects + '个项目中授予' + fmtN(O.t3MW) + 'MW与' + fmtN(O.t3MWh) + 'MWh，其中' + O.t3FourHourProjects + '个为四小时项目，而投标共' + O.t3Bids + '份、合计约' + fmtN(O.t3BidMW / 1000) + 'GW。2026年6月的第8轮授予' + fmtN(O.t8MW) + 'MW与' + fmtN(O.t8MWh) + 'MWh — 为该计划历史上最大规模的储能采购。'],
          i:['The scheme is why the fleet doubled. It is also why the merchant index collapsed, and it winds up in ' + O.cisWindUp + '. A project that misses Tender 10 has no contracting route until the ESEM commences in ' + O.esemStart + '.',
             '该计划是装机翻倍的原因，也是市场化收入指数崩塌的原因，且它将于' + O.cisWindUp + '年结束。错过第10轮招标的项目，在ESEM于' + O.esemStart + '启动前将没有任何合同路径。'] },
        { y:'2025–2026', t:['The market settings review keeps energy-only','市场设计评估维持单一电能量'],
          p:['The Nelson Review\'s final report of ' + O.reviewDate + ' kept the energy-only model and proposed the Electricity Services Entry Mechanism as the CIS successor: auctions for standardised tradable derivatives — bulk clean energy, shaping, and firming.',
             O.reviewDate + '发布的Nelson评估最终报告保留了单一电能量模式，并提出以电力服务准入机制（ESEM）作为CIS的后继方案：对标准化可交易衍生品进行拍卖 — 批量清洁电力、调形与调峰。'],
          i:['The most useful line for an investor is procedural: the Review recommends the ESEM publish its clearing prices. That recommendation is the clearest confirmation that the CIS does not, and it dates the earliest point at which contracted price discovery becomes possible.',
             '对投资者最有用的一条是程序性的：评估建议ESEM公布其出清价格。该建议最清楚地印证了CIS并不公布价格，并标定了合同价格发现最早可能出现的时点。'] },
      ] },
      { t:'why', text:['Four changes, and only the third created a revenue floor — for the projects that won it, at a level nobody outside the transaction knows. The base rate to underwrite against is therefore: expect the physical case to keep improving and the merchant case to keep compressing, and treat the contracted layer as a competitive procurement with a closing window rather than as a market feature.',
        '四项变化中，只有第三项创造了收入下限 — 且仅限中标项目，其水平交易之外无人知晓。因此承销时应参照的基准判断是：预期物理层面持续改善、市场化层面持续压缩，并将合同层视为一项窗口正在关闭的竞争性采购，而非市场的固有特征。'],
        sig:['The contracted layer is a window, not a feature','合同层是窗口，不是固有特征'] },
      { t:'src', src: SRC.nelson, use:['Retention of the energy-only model and the ESEM successor design','单一电能量模式的保留及ESEM后继方案设计'] },
      { t:'src', src: SRC.cis, use:['Tender volumes, project counts and closing dates','招标容量、项目数量及截标日期'] },
    ] },

    { t:'g2', cards:[
      { title:['Fleet growth and revenue collapse, side by side','装机增长与收入崩塌的并列对照'], badges:['official','tp'], blocks:[
        { t:'bar', cfg:{ xs: M.idxLabels, bw: 40, rotX: true, yfmt: v => kMW(v), labels: true, h: 250,
          series:[{ name:['BESS revenue index (A$k/MW/yr)','储能收入指数（A$千/MW/年）'], color:'var(--s1)', vals: M.idxSeriesK }] } },
        { t:'why', text:['The index rose ' + fmtPct((O.idx2024K / O.idx2023K - 1) * 100, 0) + '% into 2024 and has fallen every period since, to ' + kMW(O.idxOctMarK) + '/MW/yr over October 2025 to March 2026 — the weakest such window since the index launched in July 2022. The four bars are a complete argument on their own: nothing about the technology, the sites or the operators changed. The fleet doubled.',
          '该指数在2024年上升' + fmtPct((O.idx2024K / O.idx2023K - 1) * 100, 0) + '%，此后每个区间均下降，至2025年10月—2026年3月的' + kMW(O.idxOctMarK) + '/MW/年 — 为该指数2022年7月推出以来最弱的同期区间。这四根柱子本身即构成完整论证：技术、场址与运营方均未改变，改变的是装机翻倍。'],
          sig:['Nothing changed except the number of competitors','除竞争者数量外一切未变'] },
      ] },
      { title:['Monthly path through 2026','2026年月度轨迹'], badges:['tp','illus'], blocks:[
        { t:'line', cfg:{ xs: M.monLabels, yfmt: v => kMW(v), h: 250, ymin: 0,
          series:[{ name:['BESS revenue index (A$k/MW/yr)','储能收入指数（A$千/MW/年）'], color:'var(--s6)', vals: M.monSeriesK }] } },
        { t:'note', text:['January, February, May and June are published points. March was reported as a record low at the time and April is an interpolation between its sourced neighbours; both are illustrative and should not be quoted.',
          '1月、2月、5月与6月为已公布数据点。3月在当时被报告为历史新低，4月为其两侧已知数据点之间的插值；两者均属示例值，不应引用。'] },
        { t:'why', text:['January reached ' + kMW(O.monJanK) + '/MW/yr on a heatwave and February fell to ' + kMW(O.monFebK) + ' — a ' + fmtPct((1 - O.monFebK / O.monJanK) * 100, 0) + '% fall in one month with the same fleet and the same assets. May then set a record low of ' + kMW(O.monMayK) + '. That volatility is the honest characterisation of NEM merchant revenue: not a level with noise around it, but a distribution whose realised annual outcome has moved five-fold in two years. A single-point merchant assumption is the wrong shape of assumption for this market.',
          '1月因热浪达到' + kMW(O.monJanK) + '/MW/年，2月降至' + kMW(O.monFebK) + ' — 在装机与资产完全相同的情况下，单月下跌' + fmtPct((1 - O.monFebK / O.monJanK) * 100, 0) + '%。随后5月创下' + kMW(O.monMayK) + '的历史新低。这种波动才是对NEM市场化收入的诚实刻画：它不是一个带噪声的水平值，而是一个实际年度结果在两年内变动达五倍的分布。对这个市场而言，单点市场化假设在形式上就是错误的。'],
          sig:['A distribution, not a level','这是分布，不是水平值'] },
      ] },
    ] },

    { t:'card', title:['Who is building NEM storage — four strategies, one binding question','谁在建设NEM储能 — 四类策略，一个关键问题'], badges:['public','illus'], live:false, blocks:[
      { t:'players', items:[
        { type:['Gentailer / incumbent','综合发售电企业与在位者'], n:['Vertically integrated generator-retailers','纵向一体化的发电兼售电企业'], met:'internal hedge',
          p:['A battery is a hedge against their own retail book, so it is valued against the cost of buying caps rather than against merchant revenue. That is a genuinely different and usually higher valuation.',
             '电池是对其自身零售头寸的对冲，因此其估值参照购买价格上限合约的成本，而非市场化收入。这确实是另一套估值口径，且通常更高。'] },
        { type:['Pure-play developer with a toll','签订租赁的纯开发商'], n:['Developers who sell the optionality to an offtaker','将调度选择权出售给承购方的开发商'], met:'15-yr precedent',
          p:['Snowy Hydro and Akaysha contracted 15 years over 220 MW of the 311 MW Elaine BESS in September 2025, the largest four-hour virtual toll in the market. The tenor is disclosed; the price never is.',
             'Snowy Hydro与Akaysha于2025年9月就311MW的Elaine储能中的220MW签订15年合约，为市场上最大的四小时虚拟租赁。期限已披露，价格从未披露。'] },
        { type:['CIS-underwritten platform','由CIS承销的平台'], n:['Winners of Commonwealth tender rounds','联邦招标轮次的中标方'], met:'collar',
          p:['A CIS agreement converts the distribution rather than the mean. It is the only route to conventional project debt for a merchant NEM asset — and only ' + O.preT3FidPct + '% of battery capacity awarded before Tender 3 had reached FID at that time.',
             'CIS协议改变的是分布而非均值。它是市场化NEM资产取得常规项目融资的唯一途径 — 而在第3轮之前中标的储能容量中，当时仅有' + O.preT3FidPct + '%达到最终投资决策。'] },
        { type:['International infrastructure capital','国际基础设施资本'], n:['Funds entering through platform acquisition','通过收购平台进入的基金'], met:'A$' + fmt1(O.cumInvestAbn) + 'bn since 2017',
          p:['They buy delivery capability and a queue position rather than a price view. The scarce input is a connection point with a defensible loss factor, not capital — capital is abundant here.',
             '他们购买的是交付能力与排队位置，而非价格判断。稀缺要素是损耗系数可辩护的并网点，而非资本 — 此地资本充裕。'] },
      ] },
      { t:'note', text:['Concentration read: the NEM is fragmented on ownership and concentrated on offtake. The buyers capable of writing a fifteen-year virtual toll are a short list of gentailers and one state-owned generator, which is why toll pricing is a negotiation with very few counterparties rather than a market.',
        '集中度解读：NEM在所有权上分散，在购电上集中。有能力签署十五年虚拟租赁的买方仅限少数综合发售电企业与一家国有发电企业，这正是租赁定价属于对手方极少的谈判、而非市场行为的原因。'] },
      { t:'why', text:['For a new entrant this determines strategy before it determines price. A merchant NEM asset can be built by anyone and sold to almost nobody at an infrastructure multiple; a tolled or CIS-backed asset has a conventional buyer universe. Decide which one you are building on the day you decide to build, because the toll counterparty list is short and the CIS window closes in ' + O.cisWindUp + '.',
        '对新进入者而言，这一点在决定价格之前先决定策略。市场化的NEM资产人人可建，却几乎无人愿按基础设施估值倍数购买；而有租赁或CIS支持的资产则拥有常规买家群体。应在决定建设的当天即决定建哪一种 — 因为租赁对手方名单很短，而CIS窗口将于' + O.cisWindUp + '年关闭。'],
        sig:['Decide the offtake before the site','先定购电，再定场址'] },
    ] },

    { t:'g2', cards:[
      { title:['Near-term outlook — 2026 to 2029: the contracting window closes','近期展望 — 2026至2029：合同窗口关闭'], badges:['official','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2026','2026'], h:['The last dispatchable tender','最后一轮可调度电源招标'], p:['Tender 10 seeks ' + fmtN(O.t10MW / 1000) + ' GW and ' + fmtN(O.t10MWh / 1000) + ' GWh with bids closing ' + O.t10Close + ', reported to be the final dispatchable round before the scheme winds up.','第10轮招标寻求' + fmtN(O.t10MW / 1000) + 'GW与' + fmtN(O.t10MWh / 1000) + 'GWh，' + O.t10Close + '截标，据报为该计划结束前最后一轮可调度电源招标。'] },
          { yr:['2027','2027'], h:['CIS winds up, ESEM commences','CIS结束，ESEM启动'], p:['The ESEM draft legislation was released on ' + O.esemDraftDate + ' and its first procurement round is indicatively ' + O.esemStart + ', auctioning standardised derivatives — bulk clean energy, shaping and firming — with clearing prices recommended for publication.','ESEM立法草案已于2026年9月14日发布，首轮采购暂定于2027年底，拍卖标准化衍生品 — 批量清洁电力、调形与调峰 — 并被建议公布出清价格。'] },
          { yr:['2028–2029','2028–2029'], h:['Delivery and compression together','交付与压缩同时发生'], p:['The CIS cohort connects into the spread it was underwritten against. The central captured spread falls from ' + fmtC(M.codCases[2028].central) + ' to ' + fmtC(M.codCases[2030].central) + '/MWh across the COD window.','CIS批次的项目将并入其当初据以承销的价差之中。在整个投运窗口内，中性情景捕获价差由' + fmtC(M.codCases[2028].central) + '降至' + fmtC(M.codCases[2030].central) + '/MWh。'] },
        ] },
        { t:'why', text:['The central case loses ' + fmtPct((1 - M.codCases[2030].central / M.codCases[2028].central) * 100, 0) + '% of captured spread between a 2028 and a 2030 COD, and unlike Romania the cause is not speculative — the megawatts that will compress it have already been awarded and named. What a sponsor controls is not the timing of the compression but whether a contract sits underneath it, and the last competitive opportunity to secure one closes ' + O.t10Close + '.',
          '中性情景下，2028年与2030年投运之间捕获价差损失' + fmtPct((1 - M.codCases[2030].central / M.codCases[2028].central) * 100, 0) + '%；与罗马尼亚不同，此处成因并非推测 — 将造成压缩的兆瓦已经中标并具名。发起人能控制的不是压缩的时点，而是其下方是否有一份合同；而争取合同的最后一次竞争性机会将于' + O.t10Close + '关闭。'],
          sig:['The compressing megawatts are already named','造成压缩的兆瓦已经具名'] },
      ] },
      { title:['Long-term outlook — 2030 to 2035: coal exit and the second window','长期展望 — 2030至2035：煤电退出与第二个窗口'], badges:['official','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2030','2030'], h:['ISP requirement met early','ISP需求提前达成'], p:['AEMO\'s 2026 ISP requires ' + fmtN(O.ispStorage2030GW) + ' GW of grid-scale storage by 2030. The connection queue already holds ' + fmtN(O.queueGW) + ' GW, which is why spreads are compressing before the requirement date.','AEMO 2026年ISP要求2030年前建成' + fmtN(O.ispStorage2030GW) + 'GW电网级储能。并网排队量已达' + fmtN(O.queueGW) + 'GW — 这正是价差在需求时点之前即已压缩的原因。'] },
          { yr:['2030–2033','2030–2033'], h:['Coal retirement steepens the ramp','煤电退役抬升爬坡陡度'], p:['Removing large synchronous units removes the flexibility that currently caps evening prices, re-widening the spread that new storage compressed.','大型同步机组退出，移除了当前压制晚间电价的灵活性，使新增储能所压缩的价差重新扩大。'] },
          { yr:['2033–2035','2033–2035'], h:['Long duration and augmentation','长时储能与增容'], p:['The ISP\'s ' + fmtN(O.ispStorage2050GW) + ' GW by 2050 splits roughly ' + fmtN(O.ispShortMedGW) + ' GW short and medium duration against ' + fmtN(O.ispLongGW) + ' GW long duration, and GenCost puts 24-hour storage at ' + fmtC(O.gencost24h) + '/kWh — below the four-hour point.','ISP要求2050年建成' + fmtN(O.ispStorage2050GW) + 'GW，大致划分为' + fmtN(O.ispShortMedGW) + 'GW中短时与' + fmtN(O.ispLongGW) + 'GW长时；GenCost显示24小时储能成本为' + fmtC(O.gencost24h) + '/kWh，低于四小时的单位成本。'] },
        ] },
        { t:'why', text:['The long-run case is a second window rather than a trend, and the GenCost cost curve is the part most often missed: at ' + fmtC(O.gencost24h) + '/kWh, twenty-four-hour storage is cheaper per kilowatt-hour than four-hour storage, because the power equipment is amortised over far more energy. A four-hour asset built for the first window competes in the second against a technology whose unit economics improve with the very duration the market will then be short of.',
          '长期逻辑是第二个窗口而非趋势，而GenCost的成本曲线是最常被忽略的部分：按' + fmtC(O.gencost24h) + '/kWh计，二十四小时储能的单位电量成本低于四小时储能，因为功率设备被摊薄到远多的电量之上。为第一个窗口建设的四小时资产，在第二个窗口中所面对的竞争技术，其单位经济性恰恰随市场届时最短缺的那种时长而改善。'],
          sig:['Long duration gets cheaper per kWh, not dearer','长时储能的单位电量成本更低，而非更高'] },
      ] },
    ] },

    { t:'card', title:['What breaks this storyline — three monitored uncertainties','哪些因素会打破该叙事 — 三项须持续监测的不确定性'], badges:['public','calc'], blocks:[
      { t:'table', head:[['Uncertainty','不确定性'],['Why it matters','影响机理'],['Monitoring trigger','监测触发条件']], rows:[
        [{b:['ESEM design and whether it prices firming for storage','ESEM设计及其是否为储能的调峰能力定价']},
         ['The CIS winds up in ' + O.cisWindUp + '. If the ESEM\'s firming product does not suit a four-hour battery, the NEM has no contracting route for new storage at all.','CIS将于' + O.cisWindUp + '年结束。若ESEM的调峰产品不适配四小时电池，NEM将完全没有新增储能的合同路径。'],
         ['Publication of ESEM product specifications and the pilot auction result','ESEM产品规格的发布及试点拍卖结果']],
        [{b:['Pace of connection of the awarded pipeline','已中标管线的并网节奏']},
         ['Only ' + O.preT3FidPct + '% of pre-Tender-3 CISA battery capacity had reached FID at that time. Slower delivery extends the spread window; faster delivery closes it.','第3轮之前取得CIS协议的储能容量中，当时仅有' + O.preT3FidPct + '%达到最终投资决策。交付更慢则延长价差窗口，更快则关闭窗口。'],
         ['Quarterly MW and MWh entering commissioning in AEMO\'s quarterly','AEMO季度报告中进入调试的季度MW与MWh']],
        [{b:['Marginal loss factors at the connection point','并网点的边际损耗系数']},
         ['Republished every ' + O.mlfResetDate + '. A permanent multiplier on every megawatt-hour, averaging ' + fmtCk(O.mlfCostPerMW) + '/MW/yr but ' + O.mlfMultipleLo + '–' + O.mlfMultipleHi + '× that for some assets.','每年' + O.mlfResetDate + '重新公布。它是作用于每一兆瓦时的永久性乘数，平均约' + fmtCk(O.mlfCostPerMW) + '/MW/年，但部分资产为该水平的' + O.mlfMultipleLo + '–' + O.mlfMultipleHi + '倍。'],
         ['AEMO\'s annual loss-factor publication and its draft for the coming year','AEMO年度损耗系数公布及下一年度初稿']],
      ] },
      { t:'why', text:['Only the third is diversifiable, and only by site selection. The first two are single points of failure for the whole market: if the ESEM does not price storage firming well, every NEM battery reaching COD after ' + O.cisWindUp + ' is a merchant asset by default, in a market whose merchant index has fallen every period since 2024. That is the argument for securing a contract now rather than waiting for a better one.',
        '三者中只有第三项可分散，且只能通过选址分散。前两项是整个市场的单点失效来源：若ESEM未能妥善为储能调峰定价，则所有在' + O.cisWindUp + '年后投运的NEM电池将默认成为市场化资产 — 而该市场的市场化收入指数自2024年起每个区间均在下降。这正是“现在就锁定合同、而非等待更好合同”的理由。'],
        sig:['Two of the three are market-wide, not project-specific','三者中有两项属全市场而非项目层面'] },
    ] },

    { t:'card', title:['Bridge to the detailed dashboard — the investor\'s question map','进入详细看板 — 投资人的问题地图'], badges:['calc'], blocks:[
      { t:'walk', items:[
        ['03', ['Capacity Investment Scheme','容量投资计划'], ['What does the Commonwealth actually underwrite?','联邦政府究竟承销什么？'], 'capacity'],
        ['04', ['Spot & Cap Contracts','现货与价格上限合约'], ['How much of the spread is executable?','价差中有多少可执行？'], 'energy'],
        ['05', ['FCAS','频率控制辅助服务'], ['Is there anything left in ancillary services?','辅助服务还剩下什么？'], 'services'],
        ['06', ['Storage Duration','储能时长'], ['What does the fourth hour actually earn?','第四小时究竟赚多少？'], 'duration'],
        ['07', ['Project Pipeline','项目管线'], ['Who else arrives in my COD year?','投运年度还有谁会到场？'], 'pipeline'],
        ['08', ['Grid, MLF & Congestion','并网、边际损耗与拥塞'], ['What does this connection point cost me every year?','这个并网点每年让我损失多少？'], 'grid'],
      ] },
    ] },
  ] };
};

// ============================== CAPACITY INVESTMENT SCHEME ==============================
SEC_B.capacity = function (){
  return {
  head: ['Capacity Investment Scheme — a collar, not a capacity payment','容量投资计划 — 双向保底—分成结构，而非容量付费'],
  cap: ['The NEM has no capacity mechanism and the Nelson Review kept it that way. This tab therefore analyses the Commonwealth underwriting scheme that stands in its place — what it pays, what it takes back, what it never publishes, and what happens when it winds up in ' + O.cisWindUp + '.',
        'NEM没有容量机制，Nelson评估亦维持这一设计。因此本页分析取而代之的联邦承销计划 — 它支付什么、收回什么、从不公布什么，以及它在' + O.cisWindUp + '年结束后会发生什么。'],
  blocks: [
    { t:'card', mt:false, title:['The support stack — and what each layer does not do','支持体系 — 以及各层次的作用边界'], badges:['official','policy'], live:false, blocks:[
      { t:'table', head:[['Layer','层次'],['What it provides','提供什么'],['What it does NOT provide','不提供什么']], rows:[
        [{b:['Capacity mechanism','容量机制']},
         ['—','—'],
         ['Does not exist in the NEM, and the Nelson Review kept the energy-only model on ' + O.reviewDate,'NEM中不存在；Nelson评估于' + O.reviewDate + '保留了单一电能量模式']],
        [{b:['Capacity Investment Scheme','容量投资计划']},
         ['A two-sided collar: ' + O.cisFloorSharePct + '% of the shortfall below an agreed annual revenue floor, over a ' + O.cisTermMinYr + '–' + O.cisTermMaxYr + ' year term','双向结构：补足低于约定年度收入下限部分的' + O.cisFloorSharePct + '%，期限' + O.cisTermMinYr + '–' + O.cisTermMaxYr + '年'],
         ['No published price, no availability payment, and no capital grant — the scheme displaced grants rather than joining them','无公布价格、无可用性付费、无资本补贴 — 该计划取代而非叠加于补贴之上']],
        [{b:['NSW LTESA','新南威尔士LTESA']},
         ['An option to draw an annuity, exercisable annually with ' + O.ltesaNoticeMonthsMin + '–' + O.ltesaNoticeMonthsMax + ' months\' notice, up to ' + O.ltesaMaxYears + ' years for batteries','按年行使的年金提取选择权，须提前' + O.ltesaNoticeMonthsMin + '–' + O.ltesaNoticeMonthsMax + '个月通知，储能最长' + O.ltesaMaxYears + '年'],
         ['Not a contract for difference and not a toll. It does not oblige the developer to draw, and it does not oblige the state to top up beyond the cap','并非差价合约，也非租赁。它既不强制开发商提取，也不要求州政府在上限之外补足']],
        [{b:['Virtual toll','虚拟租赁']},
         ['A bilateral transfer of dispatch rights and market risk to an offtaker, 12–15 years of observed precedent','将调度权与市场风险双边转移给承购方，已观察到的先例期限为12–15年'],
         ['No price has ever been disclosed for any Australian BESS toll, so there is no benchmark to negotiate against','澳大利亚从未披露过任何储能租赁价格，因此不存在可供谈判参照的基准']],
        [{b:['Electricity Services Entry Mechanism','电力服务准入机制']},
         ['Auctions for standardised tradable derivatives — bulk clean energy, shaping and firming. Draft legislation ' + O.esemDraftDate + '; first round indicatively ' + O.esemStart,'对标准化可交易衍生品进行拍卖 — 批量清洁电力、调形与调峰。立法草案于2026年9月14日发布；首轮采购暂定于2027年底'],
         ['Does not exist yet. Its product specifications are not published, so no NEM battery can currently be underwritten against it','尚不存在。其产品规格未公布，因此目前没有任何NEM电池可据以承销']],
      ] },
      { t:'why', text:['Read down the right-hand column and the NEM underwriting frame is complete: there is exactly one operating route to a contracted revenue line, it is competitively bid, its price is confidential, and it closes in ' + O.cisWindUp + '. Everything else is either bilateral with a handful of counterparties or does not exist yet. That is why the first question on a NEM project is which route it is on, and the second is what happens if that route fails.',
        '通读右栏，NEM的承销框架即告完整：通往合同化收入线的在运路径恰好只有一条，它需竞争性投标、价格保密，且将于' + O.cisWindUp + '年关闭。其余选项要么是仅有少数对手方的双边安排，要么尚不存在。这正是NEM项目的第一个问题是“走哪条路径”、第二个问题是“若该路径失败会怎样”的原因。'],
        sig:['One operating route, and it closes in ' + O.cisWindUp,'仅一条在运路径，且' + O.cisWindUp + '年关闭'] },
    ] },

    { t:'card', title:['How a CIS agreement actually pays','CIS协议的实际支付机制'], badges:['official'], live:true, blocks:[
      { t:'flow', items:[
        ['Revenue below the floor','收入低于保底价'], ['Commonwealth pays ' + O.cisFloorSharePct + '% of the shortfall','联邦政府补足缺口的' + O.cisFloorSharePct + '%'],
        ['Between floor and ceiling','介于保底价与上限之间'], ['Project keeps 100%','项目保留100%'],
        ['Above the ceiling','高于上限'], ['Commonwealth takes ' + O.cisCeilingSharePct + '%','联邦政府分成' + O.cisCeilingSharePct + '%'],
      ], sep:'→' },
      { t:'kpis', items:[
        { l:['Shortfall share paid below the floor','保底价以下的补足比例'], v:O.cisFloorSharePct + '<small>%</small>', d:['owner receipts while the floor binds are ' + fmt1(O.cisFloorSharePct / 100) + ' × floor + ' + fmtPct(100 - O.cisFloorSharePct, 0) + ' of market revenue','保底生效期间业主收入为' + fmt1(O.cisFloorSharePct / 100) + '×保底价 + 市场化收入的' + fmtPct(100 - O.cisFloorSharePct, 0)], b:['official'] },
        { l:['Revenue share taken above the ceiling','上限以上的分成比例'], v:O.cisCeilingSharePct + '<small>%</small>', d:['the upside is capped, which is what makes it a collar','上行同样被限制 — 这正是其成为双向结构的原因'], b:['official'] },
        { l:['Agreement term','协议期限'], v:O.cisTermMinYr + '–' + O.cisTermMaxYr + '<small> yr</small>', d:['biddable, so the awarded term is not published either','属可投标变量，因此实际授予期限亦不公开'], b:['official'] },
        { l:['Published floor, ceiling or annual payment cap','已公布的保底价、上限或年度支付上限'], v:L(['None','无']), d:['bidder-submitted and commercial-in-confidence for every project','由投标人提交，各项目均属商业机密'], b:['verify'] },
      ] },
      { t:'warn', text:['A CIS agreement is not a fixed payment and modelling it as one needs saying out loud. The linearisation this platform uses — a fixed payment plus a ' + fmtPct(100 - O.cisFloorSharePct, 0) + ' retention of market revenue — is exact only while the floor binds. If merchant revenue recovers past the floor, retention steps to 100% and the fixed component disappears. At today\'s merchant levels the floor does bind, which is precisely why the approximation is currently safe and will not stay that way.',
        'CIS协议并非固定付费，将其按固定付费建模这一点必须明说。本平台采用的线性化处理 — 固定付费加上市场化收入的' + fmtPct(100 - O.cisFloorSharePct, 0) + '留存 — 仅在保底生效期间精确成立。若市场化收入回升至保底价之上，留存比例将跃升至100%，固定部分随之消失。按当前市场化收入水平保底确实生效，这正是该近似目前安全、但不会一直安全的原因。'] },
      { t:'why', text:['The collar shape matters more than the level for a credit committee. A floor protects debt service in the years that would otherwise break it; a ceiling gives away exactly the years that would have repaid equity early. So a CIS agreement moves the asset from an equity story to a debt story, and a sponsor who wanted the upside has bought the wrong instrument. Decide which side of that trade you are on before bidding the floor, because the floor is what you bid and the ceiling is what you accept.',
        '对信贷委员会而言，结构形态比水平更重要。保底保护的是本来会击穿偿债的年份；上限让渡的恰恰是本可提前偿还股权的年份。因此CIS协议把资产从股权故事转变为债权故事 — 想要上行空间的发起人买错了工具。应在投标保底价之前确定自己处于这笔交易的哪一侧，因为保底价是你投的，上限是你接受的。'],
        sig:['A collar turns equity upside into debt capacity','双向结构把股权上行换成债务容量'] },
      { t:'src', src: SRC.cis, use:['Scheme mechanics, tender volumes and closing dates','计划机制、招标容量及截标日期'] },
    ] },

    { t:'card', title:['Tender record — volumes are published, prices are not','招标记录 — 容量公布，价格不公布'], badges:['official'], live:true, blocks:[
      { t:'table', head:[['Round','轮次'],['Awarded MW','中标MW'],['Awarded MWh','中标MWh'],['Projects','项目数'],['Price','价格']], num:[1,2,3], rows:[
        [{b:['Tender 3 — December 2024','第3轮 — 2024年12月']}, fmtN(O.t3MW), fmtN(O.t3MWh), String(O.t3Projects) + ' (' + O.t3FourHourProjects + ' four-hour)',
         {chip:'critical', text:['Not published','未公布']}],
        [{b:['Tender 8 — 24 June 2026','第8轮 — 2026年6月24日']}, fmtN(O.t8MW), fmtN(O.t8MWh), String(O.t8Projects) + ' standalone lithium-ion',
         {chip:'critical', text:['Not published','未公布']}],
        [{b:['Tender 10 — bids close ' + O.t10Close,'第10轮 — ' + O.t10Close + '截标']}, fmtN(O.t10MW), fmtN(O.t10MWh), L(['reported final dispatchable round','据报为最后一轮可调度电源招标']),
         {chip:'critical', text:['Will not be published','将不会公布']}],
      ] },
      { t:'kpis', items:[
        { l:['Tender 3 bids received','第3轮收到的投标'], v:fmtN(O.t3Bids), d:['offering roughly ' + fmtN(O.t3BidMW / 1000) + ' GW and ' + fmtN(O.t3BidMWh / 1000) + ' GWh against a ' + fmtN(O.t3TargetMW / 1000) + ' GW target','合计约' + fmtN(O.t3BidMW / 1000) + 'GW与' + fmtN(O.t3BidMWh / 1000) + 'GWh，而目标为' + fmtN(O.t3TargetMW / 1000) + 'GW'], b:['official'] },
        { l:['Tender 3 oversubscription','第3轮超额认购倍数'], v:fmt1(O.t3BidMW / O.t3TargetMW) + '<small>×</small>', d:['on power — competition sets the floor, and competition is intense','按功率计 — 竞争决定保底水平，而竞争十分激烈'], b:['calc'] },
        { l:['Tender 8 average project size','第8轮平均项目规模'], v:fmtN(O.t8MW / O.t8Projects) + '<small> MW</small>', d:[fmt1(O.t8MWh / O.t8MW) + ' h average duration across ' + O.t8Projects + ' projects','' + O.t8Projects + '个项目的平均时长为' + fmt1(O.t8MWh / O.t8MW) + '小时'], b:['calc'] },
        { l:['Awarded capacity at FID before Tender 3','第3轮之前中标容量的最终投资决策比例'], v:O.preT3FidPct + '<small>%</small>', d:['an award is not a project — this is the delivery discount','中标不等于项目 — 这是交付折减'], cls:'down', b:['official'] },
      ] },
      { t:'why', text:['Two readings, and they point in opposite directions. Tender 3 was oversubscribed roughly ' + fmt1(O.t3BidMW / O.t3TargetMW) + '× on power, which tells you the awarded floors were bid down hard and are lower than a developer would like — competition, not generosity, sets this price. But only ' + O.preT3FidPct + '% of battery capacity awarded before Tender 3 had reached FID at that time, which tells you an award is a licence to try. Both readings belong in the same model: a low floor you might not reach.',
        '有两种解读，且方向相反。第3轮按功率计超额认购约' + fmt1(O.t3BidMW / O.t3TargetMW) + '倍，说明中标保底价被激烈压低，低于开发商所期望的水平 — 决定这一价格的是竞争而非慷慨。但第3轮之前中标的储能容量中，当时仅' + O.preT3FidPct + '%达到最终投资决策，说明中标只是获得尝试的许可。两种解读应同时进入模型：一个你未必能兑现的、较低的保底价。'],
        sig:['A hard-bid floor you may never reach','一个被激烈压低、且你未必能兑现的保底价'] },
    ] },

    { t:'card', title:['The NSW alternative — an LTESA is an option, not a contract for difference','新南威尔士的替代方案 — LTESA是选择权，而非差价合约'], badges:['official','policy'], live:true, blocks:[
      { t:'table', head:[['Feature','特征'],['CIS agreement','CIS协议'],['NSW LTESA','新南威尔士LTESA']], rows:[
        [{b:['Instrument','工具类型']},
         ['A two-sided collar on annual revenue','对年度收入的双向保底—分成结构'],
         ['An option to draw an annuity, exercised annually','按年行使的年金提取选择权']],
        [{b:['Who decides each year','每年由谁决定']},
         ['Nobody — the collar applies automatically','无人决定 — 双向结构自动适用'],
         ['The developer, with ' + O.ltesaNoticeMonthsMin + '–' + O.ltesaNoticeMonthsMax + ' months\' notice, so it can opt out of high-merchant years','开发商决定，须提前' + O.ltesaNoticeMonthsMin + '–' + O.ltesaNoticeMonthsMax + '个月通知，因而可在市场化收入高的年份放弃行使']],
        [{b:['Payment formula','支付公式']},
         [O.cisFloorSharePct + '% of the shortfall below the floor', '补足低于保底价部分的' + O.cisFloorSharePct + '%'],
         ['The lesser of the bid annuity cap, or the cap minus ' + O.ltesaClawbackPct + '% of revenue above a net revenue threshold','取以下两者较低者：投标年金上限，或年金上限减去超出净收入门槛部分的' + O.ltesaClawbackPct + '%']],
        [{b:['Maximum term','最长期限']},
         [O.cisTermMinYr + '–' + O.cisTermMaxYr + ' years, biddable', O.cisTermMinYr + '–' + O.cisTermMaxYr + '年，可投标'],
         ['Up to ' + O.ltesaMaxYears + ' years for batteries','储能最长' + O.ltesaMaxYears + '年']],
        [{b:['Geography','适用范围']},
         ['NEM-wide, Commonwealth','全NEM，联邦层级'],
         ['New South Wales only','仅新南威尔士']],
        [{b:['Price disclosure','价格披露']},
         [L(['None','无']), L(['None','无'])],
         ['Average annuity caps are published by round: ' + fmtCk(O.ltesaR5CapMW) + ' in Round 5, ' + fmtCk(O.ltesaR6CapMW) + ' in Round 6','按轮次公布平均年金上限：第5轮' + fmtCk(O.ltesaR5CapMW) + '，第6轮' + fmtCk(O.ltesaR6CapMW)]],
      ] },
      { t:'kpis', items:[
        { l:['LTESA Round 5 average annuity cap','LTESA第5轮平均年金上限'], v:'≈' + fmtCk(O.ltesaR5CapMW) + '<small>/MW/yr</small>', d:['the highest published Australian long-term storage price of any kind','这是澳大利亚已公布的任何类型长期储能价格中的最高值'], b:['official'] },
        { l:['LTESA Round 6 average annuity cap','LTESA第6轮平均年金上限'], v:'≈' + fmtCk(O.ltesaR6CapMW) + '<small>/MW/yr</small>', d:[fmtPct((O.ltesaR6CapMW / O.ltesaR5CapMW - 1) * 100, 0) + ' in a single round','单轮变动' + fmtPct((O.ltesaR6CapMW / O.ltesaR5CapMW - 1) * 100, 0)], cls:'down', b:['official'] },
        { l:['Clawback above the net revenue threshold','超出净收入门槛部分的回收比例'], v:O.ltesaClawbackPct + '<small>%</small>', d:['which is why the annuity cap is a ceiling, not an expectation','这正是年金上限属天花板而非预期值的原因'], b:['official'] },
        { l:['Optionality value','选择权价值'], v:L(['Materially positive','显著为正']), d:['the developer opts out of high-merchant years; a CIS ceiling cannot','开发商可在市场化收入高的年份放弃行使；CIS的上限则无法回避'], b:['calc'] },
      ] },
      { t:'why', text:['The LTESA is the more valuable instrument per dollar of stated cap, and the reason is structural: the developer chooses each year whether to exercise, so it keeps the upside a CIS ceiling gives away. The offsetting fact is the price. The Round 6 average cap of ' + fmtCk(O.ltesaR6CapMW) + '/MW/yr is ' + fmtPct((O.ltesaR6CapMW / O.ltesaR5CapMW - 1) * 100, 0) + ' on Round 5 in one round — the state is buying the same product much more cheaply because more bidders need it. Use the Round 6 cap as the ceiling on any toll negotiation in the same region: a private counterparty cannot rationally pay above what the state clears at.',
        '按每一元标称上限计，LTESA是更有价值的工具，原因是结构性的：开发商每年自行选择是否行使，因而保留了CIS上限所让渡的上行空间。与之相抵的是价格。第6轮平均上限' + fmtCk(O.ltesaR6CapMW) + '/MW/年较第5轮单轮变动' + fmtPct((O.ltesaR6CapMW / O.ltesaR5CapMW - 1) * 100, 0) + ' — 州政府以低得多的价格买到同样的产品，因为需要它的投标人更多了。应将第6轮上限作为同一区域内任何租赁谈判的天花板：私营对手方不可能理性地支付高于州政府出清水平的价格。'],
        sig:['The state\'s cap is the ceiling on any private toll','州政府的上限即任何私营租赁的天花板'] },
      { t:'src', src: SRC.ltesa, use:['LTESA structure, battery terms and published round annuity caps','LTESA结构、储能条款及各轮公布的年金上限'] },
    ] },

    { t:'card', title:['What is not published, and what this dashboard does instead','哪些未公布，以及本看板如何处理'], badges:['verify'], live:false, blocks:[
      { t:'ladder', items:[
        { n:['1 · Scheme exists','1 · 计划存在'], d:['A budget and a tender calendar exist. This tells you the Commonwealth intends to underwrite storage; it tells you nothing about your project.','预算与招标日程已存在。这说明联邦政府有意为储能承销，但与你的项目无关。'] },
        { n:['2 · Tender opened','2 · 招标开放'], d:['Volumes, eligibility and closing dates are published. Model against these, not against the announcement.','容量、资格与截标日期已公布。应据此建模，而非依据公告。'] },
        { n:['3 · Bid submitted','3 · 已投标'], d:['Still not evidence. Tender 3 drew ' + O.t3Bids + ' bids offering roughly ' + fmt1(O.t3BidMW / O.t3TargetMW) + '× the target.','仍不构成证据。第3轮收到' + O.t3Bids + '份投标，合计约为目标的' + fmt1(O.t3BidMW / O.t3TargetMW) + '倍。'] },
        { n:['4 · Award announced','4 · 中标公告'], d:['Project, MW, MWh and state are published. Floor, ceiling, payment cap and term are not — and never will be for this scheme.','项目、MW、MWh与所在州已公布。保底价、上限、支付上限与期限则不公布 — 且本计划永远不会公布。'] },
        { n:['5 · Agreement executed and FID taken','5 · 协议签署并作出最终投资决策'], d:['The only tier at which a contracted revenue line may enter a base case. Only ' + O.preT3FidPct + '% of pre-Tender-3 awarded battery capacity had reached this tier at that time.','这是合同化收入唯一可进入基准情景的层级。第3轮之前中标的储能容量中，当时仅有' + O.preT3FidPct + '%达到该层级。'] },
      ] },
      { t:'note', text:['Because tier 4 publishes volumes but not prices, this dashboard brackets the floor rather than asserting one: a debt-service-and-opex build-up at the low end, and the NSW LTESA Round 6 annuity cap as a same-region, same-asset-class proxy at the high end. The derivation is in src/markets/nem/comparison.js and the resulting range is what the dedicated Investment Lab page varies over.',
        '由于第4层级公布容量但不公布价格，本看板对保底价采取区间估计而非直接主张：下限为偿债与运维成本推算，上限为新南威尔士LTESA第6轮年金上限（同区域、同资产类别的代理指标）。推导过程见src/markets/nem/comparison.js，所得区间即独立投资测算页面的变动范围。'] },
      { t:'why', text:['This is the honest position and it is worth stating plainly: this dashboard does not know what a CIS agreement pays, and neither does anyone outside the transaction. What it can do is bound the answer from two independent directions and refuse to present the midpoint as a fact. The Nelson Review recommending that the successor mechanism publish its clearing prices is the strongest available evidence that this gap is real, acknowledged, and scheduled to close no earlier than ' + O.esemStart + '.',
        '这是诚实的立场，值得明说：本看板不知道CIS协议的支付水平，交易之外亦无人知晓。它能做的是从两个独立方向框定答案，并拒绝把中值当作事实呈现。Nelson评估建议后继机制公布出清价格，是关于“该缺口真实存在、已被承认、且最早在' + O.esemStart + '才可能弥合”的最有力证据。'],
        sig:['Bound the answer; do not assert the midpoint','框定答案，不主张中值'] },
      { t:'src', src: SRC.contractPriceGap, use:['Coverage assessment for CIS prices and Australian toll prices','CIS价格与澳大利亚租赁价格的覆盖情况评估'] },
    ] },
  ] };
};

// ============================== SPOT & CAP CONTRACTS ==============================
SEC_B.energy = function (){
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

// ============================== FCAS ==============================
SEC_B.services = function (){
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

// ============================== STORAGE DURATION ==============================
SEC_B.duration = function (){
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
        [{b:['4 hours','4小时']}, fmtC(O.gencost4h), fmtCM(O.gencost4h * 4 * 1000), ['The archetype; decomposes to ≈' + fmtC(M.lab.capexKW) + '/kW power plus ≈' + fmtC(M.lab.capexKWh) + '/kWh energy','原型配置；可分解为约' + fmtC(M.lab.capexKW) + '/kW功率段加约' + fmtC(M.lab.capexKWh) + '/kWh能量段']],
        [{b:['24 hours','24小时']}, fmtC(O.gencost24h), fmtCM(O.gencost24h * 24 * 1000), ['Cheapest per kWh, dearest per MW — a different asset class with a different buyer','单位电量最便宜、单位功率最贵 — 属另一资产类别、面向另一类买家']],
      ] },
      { t:'why', text:['The GenCost points decompose consistently on a common power-plus-energy split — about ' + fmtC(M.lab.capexKW) + '/kW plus ' + fmtC(M.lab.capexKWh) + '/kWh — which is what makes four hours cost ' + fmt1(O.gencost4h * 4 / (O.gencost2h * 2)) + '× two hours rather than twice as much, and reproduces the independent finding that the four-hour premium fell ' + O.capexPremiumFallLoPct + '–' + O.capexPremiumFallHiPct + '% in two years. The same arithmetic explains the twenty-four-hour point: the power equipment is bought once whatever the duration, so longer assets keep getting cheaper per kilowatt-hour.',
        'GenCost各时长点可按统一的“功率+能量”口径一致分解 — 约' + fmtC(M.lab.capexKW) + '/kW加' + fmtC(M.lab.capexKWh) + '/kWh — 这正是四小时造价为两小时' + fmt1(O.gencost4h * 4 / (O.gencost2h * 2)) + '倍而非两倍的原因，也印证了“四小时溢价两年内下降' + O.capexPremiumFallLoPct + '–' + O.capexPremiumFallHiPct + '%”这一独立结论。同一算式也解释了二十四小时的数值：无论时长如何，功率设备只需购置一次，因此更长时长的资产其单位电量成本持续下降。'],
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

// ============================== PROJECT PIPELINE ==============================
SEC_B.pipeline = function (){
  const mw = pipelineByYear('MW');
  const totRaw = mw.raw.reduce((a, b) => a + b, 0), totPw = mw.pw.reduce((a, b) => a + b, 0);
  return {
  head: ['Project Pipeline — probability-weighted, against a requirement that is already met','项目管线 — 概率加权，且对照的需求已经达成'],
  cap: ['A pipeline is a distribution, not a number. In the NEM the distinctive fact is that the announced pipeline already exceeds what the system operator says the system needs by 2030, which is why spread compression arrived before the requirement date.',
        '管线是一个分布而非一个数字。NEM的特殊之处在于：已公告管线已经超过系统运营方所称的2030年系统需求 — 这正是价差压缩早于需求时点到来的原因。'],
  blocks: [
    { t:'card', mt:false, title:['Delivered, awarded, queued and required — four different numbers','已交付、已中标、已排队与所需 — 四个不同的数字'], badges:['official'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['Installed and dispatching','已投运并参与调度'], v:fmtN(O.installedMW) + '<small> MW</small>', d:['passed 9 GW in Q2 2026','2026年第二季度突破9GW'], b:['official'] },
        { l:['Began commissioning in twelve months','十二个月内开始调试'], v:fmtN(O.addedMW) + '<small> MW</small>', d:[fmtN(O.addedMWh) + ' MWh to end-Q2 2026 — more than doubling capacity','截至2026年第二季度末' + fmtN(O.addedMWh) + 'MWh — 装机增加一倍以上'], b:['official'] },
        { l:['Q2 2026 alone','仅2026年第二季度'], v:fmtN(O.q2AddedMW) + '<small> MW</small>', d:[fmtN(O.q2AddedMWh) + ' MWh in one quarter','单季度' + fmtN(O.q2AddedMWh) + 'MWh'], b:['official'] },
        { l:['Announced battery pipeline','已公告储能管线'], v:fmt1(O.pipelineGW) + '<small> GW</small>', d:[O.gridFormingPct + '% featuring grid-forming inverters','其中' + O.gridFormingPct + '%配置构网型逆变器'], b:['public'] },
        { l:['AEMO connection pipeline','AEMO并网管线'], v:fmtN(O.queueGW) + '<small> GW</small>', d:['up from ' + fmtN(O.queue2022GW) + ' GW in September 2022','由2022年9月的' + fmtN(O.queue2022GW) + 'GW增长而来'], b:['official'] },
        { l:['ISP requirement by 2030','ISP要求的2030年规模'], v:fmtN(O.ispStorage2030GW) + '<small> GW</small>', d:['and ≈' + fmtN(O.ispStorage2050GW) + ' GW by 2050 — ' + fmtN(O.ispShortMedGW) + ' GW short/medium plus ' + fmtN(O.ispLongGW) + ' GW long duration','2050年约' + fmtN(O.ispStorage2050GW) + 'GW — 其中中短时' + fmtN(O.ispShortMedGW) + 'GW，长时' + fmtN(O.ispLongGW) + 'GW'], b:['official'] },
      ] },
      { t:'flow', items:[
        ['ISP requires ' + fmtN(O.ispStorage2030GW) + ' GW by 2030','ISP要求2030年前' + fmtN(O.ispStorage2030GW) + 'GW'],
        ['Queue already holds ' + fmtN(O.queueGW) + ' GW','排队已达' + fmtN(O.queueGW) + 'GW'],
        ['Fleet passed ' + fmtN(O.installedMW / 1000) + ' GW','装机突破' + fmtN(O.installedMW / 1000) + 'GW'],
        ['Spreads fell ' + O.q2SpreadFallPct + '% year on year','价差同比下跌' + O.q2SpreadFallPct + '%'],
      ] },
      { t:'why', text:['The ' + fmtN(O.queueGW) + ' GW connection pipeline already exceeds the ' + fmtN(O.ispStorage2030GW) + ' GW the 2026 ISP requires by 2030, and that single comparison explains the entire merchant collapse without reference to weather, gas prices or policy. It also sets the forward expectation: the queue does not have to convert fully to keep spreads compressed, it only has to keep converting at the rate it has been. ' + fmtN(O.addedMW) + ' MW entering commissioning in twelve months is that rate.',
        fmtN(O.queueGW) + 'GW的并网管线已超过2026年ISP要求的2030年' + fmtN(O.ispStorage2030GW) + 'GW，仅此一项对比即可解释整个市场化收入的崩塌，无需援引天气、燃气价格或政策。它同时设定了前瞻预期：该排队量无需完全转化即可维持价差受压，只需保持既有转化速率即可。十二个月内' + fmtN(O.addedMW) + 'MW进入调试，就是这一速率。'],
        sig:['The queue already exceeds the requirement','排队量已超过需求'] },
      { t:'src', src: SRC.isp, use:['Storage requirement to 2030 and 2050, and the optimal development path','至2030年与2050年的储能需求及最优发展路径'] },
    ] },

    { t:'card', title:['Stage probabilities — the CIS award is the step that misleads','阶段概率 — CIS中标是最易误导的一步'], badges:['calc'], live:false, blocks:[
      { t:'stageProb' },
      { t:'why', text:['The probability step that matters is CIS agreement executed at ' + M.stages.find(s => s.id === 'cis').p + '% against under construction at ' + M.stages.find(s => s.id === 'con').p + '%. Only ' + O.preT3FidPct + '% of battery capacity awarded a CIS agreement before Tender 3 had reached a financial-investment decision at that time. Tender 8\'s ' + fmtN(O.t8MW) + ' MW therefore represents roughly ' + fmtN(O.t8MW * M.stages.find(s => s.id === 'cis').p / 100) + ' MW on a probability-weighted basis — real, and materially less than the headline.',
        '真正关键的概率跃迁是“已签CIS协议”的' + M.stages.find(s => s.id === 'cis').p + '%与“在建”的' + M.stages.find(s => s.id === 'con').p + '%之间的差距。第3轮之前取得CIS协议的储能容量中，当时仅有' + O.preT3FidPct + '%达到最终投资决策。因此第8轮的' + fmtN(O.t8MW) + 'MW按概率加权约相当于' + fmtN(O.t8MW * M.stages.find(s => s.id === 'cis').p / 100) + 'MW — 真实存在，但显著低于表面数字。'],
        sig:['An award is a licence to try','中标只是获得尝试的许可'] },
    ] },

    { t:'g2', cards:[
      { title:['COD pipeline by year — MW','按投运年度的管线 — MW'], badges:['illus'], live:true, blocks:[
        { t:'pipeChart', unit:'MW' },
        { t:'why', text:['Probability weighting removes ' + fmtPct((1 - totPw / totRaw) * 100, 0) + '% of announced MW across the seed register. In a market with no capacity payment, that discount matters more than elsewhere: competing MW arrives directly against your spread with nothing to cushion it, and the CIS cohort arrives with a floor you may not have.',
          '在种子登记表中，概率加权剔除了已公告MW的' + fmtPct((1 - totPw / totRaw) * 100, 0) + '%。在没有容量付费的市场中，这一折减比其他市场更重要：竞争性MW直接冲击你的价差且无任何缓冲，而CIS批次带着你可能并不具备的保底价到场。'],
          sig:['Competing MW hits the spread directly','竞争性MW直接冲击价差'] },
      ] },
      { title:['COD pipeline by year — MWh','按投运年度的管线 — MWh'], badges:['illus'], live:true, blocks:[
        { t:'pipeChart', unit:'MWh' },
        { t:'why', text:['MWh is the series that predicts spread compression, and in the NEM it is the only saturation series that matters — there is no capacity auction for MW to saturate. Track MWh entering commissioning quarterly in AEMO\'s quarterly; it is the leading indicator for the captured-spread decline from ' + fmtC(M.codCases[2028].central) + ' to ' + fmtC(M.codCases[2030].central) + '/MWh.',
          'MWh序列预测价差压缩，而在NEM它是唯一重要的饱和序列 — 因为不存在可供MW饱和的容量拍卖。应在AEMO季度报告中按季跟踪进入调试的MWh；它是捕获价差由' + fmtC(M.codCases[2028].central) + '降至' + fmtC(M.codCases[2030].central) + '/MWh的领先指标。'],
          sig:['Track MWh entering commissioning, quarterly','按季度跟踪进入调试的MWh'] },
      ] },
    ] },

    { t:'card', title:['Regional pipeline — where the competing energy lands','区域管线 — 竞争性电量落在何处'], badges:['illus'], live:true, blocks:[
      { t:'pipeChart', unit:'MWh', series:[
        { region:'NSW1', name:['NSW1','NSW1'], color:'var(--s1)' },
        { region:'QLD1', name:['QLD1','QLD1'], color:'var(--s3)' },
        { region:'VIC1', name:['VIC1','VIC1'], color:'var(--s6)' },
        { region:'SA1',  name:['SA1','SA1'],  color:'var(--s11)' },
      ] },
      { t:'note', text:['Probability-weighted MWh from the illustrative seed register, split by NEM region. Regional concentration is the point of this chart — not the absolute values, which are placeholders.',
        '来自示例种子登记表的概率加权MWh，按NEM区域拆分。本图的用意在于区域集中度，而非绝对数值 — 后者为占位数据。'] },
      { t:'why', text:['A NEM pipeline chart has to be regional because the price it competes into is regional. Queensland lost ' + fmtPct(Math.abs(regionById('QLD1').revChangePct), 0) + '% of battery revenue in one six-month window while South Australia gained ' + fmtPct(regionById('SA1').revChangePct, 0) + '%; a national MWh total would have shown neither. Read this chart against the COD year you are underwriting and against the region you are connecting in, never against the NEM aggregate.',
        'NEM的管线图必须按区域绘制，因为它所竞争的价格是区域性的。在同一个六个月窗口内，昆士兰的储能收入下降' + fmtPct(Math.abs(regionById('QLD1').revChangePct), 0) + '%，而南澳增长' + fmtPct(regionById('SA1').revChangePct, 0) + '%；全国MWh合计值两者都不会显示。应将本图对照你所承销的投运年度与你所并网的区域来解读，绝不可对照全NEM合计值。'],
        sig:['Regional prices need regional pipelines','区域电价需要区域管线'] },
    ] },

    { t:'card', title:['Project register — illustrative placeholders, not real facilities','项目登记表 — 示例占位，非真实项目'], badges:['illus'], live:true, blocks:[
      { t:'projTable' },
      { t:'note', text:['All projects shown are illustrative placeholders, tagged by NEM region so locational concentration can be checked. Replace with a register built from AEMO connection data and published CIS tender results before any transaction use, and de-duplicate — an announced project, a queued connection application and a CIS award are frequently the same asset counted three times.',
        '所示项目均为示例占位，并按NEM区域标注以便检查区位集中度。任何交易用途前，须以基于AEMO并网数据与已公布CIS招标结果构建的登记数据替换，并进行去重 — 一个已公告项目、一份排队中的并网申请与一项CIS中标，往往是同一资产被重复计算三次。'] },
    ] },
  ] };
};

// ============================== GRID, MLF & CONGESTION ==============================
/* The map and the congestion register are joined to the market in
   gridMapRegistry.js and congestionRegistry.js, so they cannot disagree. They
   are declared inline here rather than in a separate gridSection.js file — the
   arrangement ie/sections.js uses. */
SEC_B.grid = function (){
  return {
  head: ['Grid, MLF & Congestion — connecting is not the same as being allowed to export','并网、边际损耗与拥塞 — 并网不等于获准送出'],
  cap: ['NEM generators and storage hold no firm transmission rights. A constrained unit receives nothing, and the Congestion Relief Market that would have changed that was recommended not to proceed. What does reach the battery is a marginal loss factor — a permanent settlement multiplier, republished every ' + O.mlfResetDate + '.',
        'NEM的发电与储能不持有固定输电权。受约束机组得不到任何补偿，而本可改变这一状况的拥塞缓解市场已被建议不予推行。真正传导至储能的是边际损耗系数 — 一项每年' + O.mlfResetDate + '重新公布的永久性结算乘数。'],
  blocks: [
    { t:'card', mt:false, title:['Interactive NEM grid — past, current and planned','NEM电网交互地图 — 过去、当前与规划'], badges:['official','public'], blocks:[
      { t:'geo-grid-map', data:gridMapById('nem-grid-map') },
      { t:'why', text:['The map is an orientation and evidence tool, not a headroom heatmap. Its most important contrast is between where generation now sits — inland renewable energy zones — and where load has always sat, on the coast. The wires in between were built to serve local demand rather than to export at scale, which is why utility-scale renewable curtailment passed ' + O.nemCurtailTWh + ' TWh in 2025, up more than ' + O.nemCurtailGrowthPct + '% year on year.',
        '该地图是方位与证据工具，而非可用容量热力图。其最重要的对比在于：发电如今位于何处 — 内陆可再生能源区 — 与负荷始终位于何处 — 沿海。中间的电网原本是为服务本地负荷而非大规模外送而建，这正是2025年公用事业级可再生能源限电量突破' + O.nemCurtailTWh + 'TWh、同比增长逾' + O.nemCurtailGrowthPct + '%的原因。'],
        sig:['Generation moved inland; the wires did not','发电移向内陆，电网没有'] },
      { t:'src', src: SRC.isp, use:['Transmission nodes, corridors and the 2026 optimal development path','输电节点、走廊及2026年最优发展路径'] },
      { t:'src', src: SRC.giscoBoundary, use:['Published country boundary used by the map','地图采用的公开国家边界'] },
    ] },

    { t:'congestion', data:congestionFor('nem') },

    { t:'card', title:['No firm access — the structural fact behind every constraint row','无固定接入权 — 每一条约束背后的结构性事实'], badges:['official'], live:false, blocks:[
      { t:'table', head:[['Question','问题'],['NEM answer','NEM的答案'],['Consequence for the model','对模型的影响']], rows:[
        [{b:['Does a connection grant a right to export?','并网是否赋予送出权利？']},
         ['No. Access can change whenever new generation, storage or network conditions do.','否。每当新增发电、储能或网络条件变化，接入条件即可能改变。'],
         ['Export volume is an assumption, not a contractual quantity. Model it with a range.','送出电量是假设而非合同数量。应以区间建模。']],
        [{b:['Is a constrained-off unit compensated?','受约束停机的机组是否获得补偿？']},
         ['No. Compensation exists only where AEMO directs a unit, for instance to hold a state of charge for system security.','否。仅在AEMO直接调度机组时才有补偿，例如要求为系统安全维持特定荷电状态。'],
         ['Curtailment is a revenue loss with no offsetting receipt. It belongs in the revenue haircut, not in an events table.','限电是没有任何抵偿收入的损失。它属于收入折减项，而非事件表。']],
        [{b:['Will that change?','这会改变吗？']},
         ['The AEMC\'s Congestion Relief Market was recommended not to proceed, and ministers noted that at the December 2025 ECMC.','AEMC提出的拥塞缓解市场已被建议不予推行，能源部长会议于2025年12月予以采纳。'],
         ['Do not carry an option on future congestion compensation. The reform was considered and declined.','不应持有未来拥塞补偿的期权。该改革已被审议并否决。']],
        [{b:['What does reach the asset?','真正传导至资产的是什么？']},
         ['A marginal loss factor: a settlement multiplier on every megawatt-hour at the connection point, republished every ' + O.mlfResetDate + '.','边际损耗系数：作用于并网点每一兆瓦时的结算乘数，每年' + O.mlfResetDate + '重新公布。'],
         ['A live annual variable on the revenue line, not a fixed discount agreed at financial close.','这是收入线上逐年变动的活变量，而非融资交割时锁定的固定折扣。']],
      ] },
      { t:'kpis', items:[
        { l:['Average MLF cost to NEM batteries','NEM储能平均MLF成本'], v:fmtCk(O.mlfCostPerMW) + '<small>/MW/yr</small>', d:['2024; some assets ' + O.mlfMultipleLo + '–' + O.mlfMultipleHi + '× higher','2024年；部分资产为该水平的' + O.mlfMultipleLo + '–' + O.mlfMultipleHi + '倍'], b:['tp'] },
        { l:['Network curtailment within the battery fleet','储能行业内网络限电量'], v:fmtN(O.fleetCurtailMWh) + '<small> MWh</small>', d:['2025, across the whole NEM battery fleet','2025年，覆盖全NEM储能机组'], b:['tp'] },
        { l:['NEM-wide renewable curtailment','全NEM可再生能源限电'], v:O.nemCurtailTWh + '<small>+ TWh</small>', d:['2025, up more than ' + O.nemCurtailGrowthPct + '% year on year','2025年，同比增长逾' + O.nemCurtailGrowthPct + '%'], b:['tp'] },
        { l:['Combined haircut in the comparison interface','对比接口中的合计折减'], v:fmtPct((1 - 0.95) * 100, 0), d:['loss factors plus curtailment, both on market revenue','损耗系数加限电，两者均作用于市场化收入'], b:['calc'] },
      ] },
      { t:'why', text:['This is the row that surprises investors from capacity-market jurisdictions. In GB, Ireland or Poland a network constraint is an event with a settlement consequence; in the NEM it is simply an absence of revenue. The AEMC has itself found that a battery relieving a constraint may be under-compensated for the role it plays, by being settled at the regional reference price. That finding was made, the remedy was designed, and it was recommended not to proceed. Underwrite accordingly.',
        '这是最令来自容量市场辖区的投资者意外的一行。在英国、爱尔兰或波兰，网络约束是一个带有结算后果的事件；在NEM，它只是收入的缺失。AEMC自身已认定：缓解约束的电池因按区域参考电价结算，可能就其所发挥的作用而获得不足的补偿。该认定已作出、补救方案已设计，但被建议不予推行。承销时应据此处理。'],
        sig:['The remedy was designed and declined','补救方案已设计，但被否决'] },
      { t:'src', src: SRC.aemc, use:['Congestion Relief Market recommendation and the ministerial response','拥塞缓解市场建议及部长级回应'] },
      { t:'src', src: SRC.mlf, use:['Connection-point loss factors, republished annually effective 1 July','并网点损耗系数，每年重新公布并于7月1日生效'] },
    ] },

    { t:'card', title:['The 2026 ISP optimal development path — planning scale','2026年ISP最优发展路径 — 规划规模'], badges:['official','forecast'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['New transmission by 2050','2050年前新增输电线路'], v:fmtN(O.ispKm2050) + '<small> km</small>', d:['a ' + O.ispExtensionPct + '% extension of the existing ' + fmtN(O.ispExistingKm) + ' km network; ' + fmtN(O.ispKmPrev) + ' km in the 2024 ISP','在现有' + fmtN(O.ispExistingKm) + '公里电网基础上扩展' + O.ispExtensionPct + '%；2024年ISP为' + fmtN(O.ispKmPrev) + '公里'], b:['official'] },
        { l:['Upfront transmission capital','输电前期资本开支'], v:'A$' + O.ispTxCapexAbn + '<small>bn</small>', d:['of which A$' + O.ispTxCapexTo2050Abn + 'bn is recognised to 2050; saves consumers A$' + O.ispConsumerSavingAbn + 'bn against a no-transmission path','其中A$' + O.ispTxCapexTo2050Abn + '0亿计入2050年前；相较无输电投资路径为消费者节省A$' + O.ispConsumerSavingAbn + '0亿'], b:['official'] },
        { l:['Grid-scale storage needed by 2030','2030年前所需公用事业级储能'], v:O.ispStorage2030GW + '<small> GW</small>', d:[fmtN(O.queueGW) + ' GW already sits in the connections pipeline','并网队列中已有' + fmtN(O.queueGW) + 'GW'], b:['official'] },
        { l:['Storage in the 2050 path','2050年路径中的储能'], v:O.ispStorage2050GW + '<small> GW</small>', d:[O.ispShortMedGW + ' GW shallow and medium duration plus ' + O.ispLongGW + ' GW of deep storage','浅层与中时长' + O.ispShortMedGW + 'GW，另有深度储能' + O.ispLongGW + 'GW'], b:['official'] },
        { l:['NEM consumption, now → 2050','NEM用电量，当前→2050'], v:fmtN(O.ispConsumptionNowTWh) + ' → ' + fmtN(O.ispConsumption2050TWh) + '<small> TWh</small>', d:['capacity roughly triples, ' + O.ispCapacityNowGW + ' GW to ' + O.ispCapacity2050GW + ' GW','装机容量约增至三倍，由' + O.ispCapacityNowGW + 'GW增至' + O.ispCapacity2050GW + 'GW'], b:['official'] },
      ] },
      { t:'bar', cfg:{
        xs: M.ispClasses.filter(k => ['committed','anticipated','actionable','future'].includes(k.id)).map(k => L(k.n)),
        bw: 58, yfmt: v => fmtN(v) + ' km', labels: true,
        series: [{ name: ['Step Change route km by ISP status class','按ISP状态分类的阶跃变革情景线路公里数'], color: 'var(--s6)',
          vals: [O.ispKmCommitted, O.ispKmAnticipated, O.ispKmActionable, O.ispKmFuture] }], h: 230 } },
      { t:'cap', text:['More than half the ' + fmtN(O.ispKm2050) + ' km is already committed or anticipated. Actionable build fell from 3,675 km in the 2024 ISP to ' + fmtN(O.ispKmActionable) + ' km and future build from 1,712 km to ' + O.ispKmFuture + ' km — mostly because projects graduated into the committed and anticipated classes, not because less network is needed. A further ' + fmtN(O.ispConnectionAssetKm) + ' km of generator connection assets sits outside this total.',
        '' + fmtN(O.ispKm2050) + '公里中已有过半属于已承诺或预期项目。可行动项目建设量由2024年ISP的3,675公里降至' + fmtN(O.ispKmActionable) + '公里，未来项目由1,712公里降至' + O.ispKmFuture + '公里 — 主要原因是项目升级进入已承诺与预期类别，而非所需电网减少。此外还有' + fmtN(O.ispConnectionAssetKm) + '公里的发电侧并网资产不计入该总量。'] },
      { t:'why', text:['Read the shape of this chart before any single project. The ' + O.ispKmActionable + ' km of actionable build is what the 2026 ISP is asking proponents to start now, and it is less than half the 2024 figure — so the volume of *newly instructed* transmission has fallen sharply even though the 2050 requirement barely moved. For a battery that cuts both ways. Less new instruction means fewer construction-cost shocks and less competition for contractors; it also means the relief a congested node is waiting for is more likely to already be in a class where the date is real, or in a future class where it is a decade away. The ' + O.ispStorage2030GW + ' GW-by-2030 storage requirement against ' + fmtN(O.queueGW) + ' GW already queued is the same message from the generation side: the system-level need is met on paper, so nothing about being in the pipeline is scarce.',
        '在看任何单个项目之前，先看这张图的形态。' + O.ispKmActionable + '公里的可行动建设量是2026年ISP要求发起人立即启动的部分，不到2024年数字的一半 — 因此尽管2050年需求几乎未变，*新下达指令*的输电量已大幅下降。对储能而言，这有两面性。新指令减少意味着施工成本冲击更少、承包商竞争更弱；同时也意味着拥塞节点所等待的缓解措施，要么已进入日期可信的类别，要么处于十年之后的未来类别。2030年前需要' + O.ispStorage2030GW + 'GW储能而队列中已有' + fmtN(O.queueGW) + 'GW，这从电源侧传递了同样的信息：系统层面的需求在纸面上已被满足，因此"身处管线之中"本身并不稀缺。'],
        sig:['Instruction volume halved; the 2050 need did not','指令量减半，2050年需求未减'] },
      { t:'src', src: SRC.isp, use:['Optimal development path, planning scale and horizon figures','最优发展路径、规划规模及展望期数值'] },
      { t:'src', src: SRC.ispA5, use:['Step Change route kilometres by status class and the change against the 2024 ISP','按状态分类的阶跃变革情景线路公里数及相对2024年ISP的变化'] },
    ] },

    { t:'card', title:['The ISP register, project by project — what each status class actually commits','ISP项目登记表 — 各状态类别究竟承诺了什么'], badges:['official','forecast'], live:false, blocks:[
      { t:'table', head:[['Project','工程'],['Region','区域'],['Delivery body','交付主体'],['ISP class','ISP类别'],['Scope','范围'],['MW','MW'],['A$m','A$百万'],['Year','年份'],['Status','状态']], num:[5,6,7], rows:
        M.ispProjects.map(x => {
          const k = M.ispClasses.find(c => c.id === x.cls);
          return [{ b:x.n }, [x.region, x.region], [x.operator, x.operator], { chip:k.c, text:k.n }, x.scope,
                  x.mw == null ? null : fmtN(x.mw), x.capexAM == null ? null : fmtN(x.capexAM),
                  x.earliest ? String(x.year) + ' (≥' + x.earliest + ')' : String(x.year), x.status];
        }) },
      { t:'cap', text:['Every network investment on the optimal development path, in AEMO\'s own status classes: ' + O.ispCommittedAnticipatedCount + ' committed or anticipated, ' + O.ispActionableCount + ' actionable, ' + O.ispFutureCount + ' future and 2 distribution. That is ' + M.ispProjects.length + ' rows for ' + (M.ispProjects.length - 1) + ' projects, because VNI West is one project whose two components were split in this ISP: the South West NSW REZ scope proceeds under NSW legislation and the interconnector scope under the National Electricity Rules. Cost is the A5 reported estimate in A$ million ($2025) and is blank for committed and anticipated projects, which sit outside the ISP cost-benefit analysis. "≥" marks an earliest in-service date published separately from the proponent-advised year.',
        '最优发展路径上的每一项网络投资，按AEMO自身的状态分类：已承诺或预期' + O.ispCommittedAnticipatedCount + '项、可行动' + O.ispActionableCount + '项、未来' + O.ispFutureCount + '项、配电2项。' + (M.ispProjects.length - 1) + '个项目对应' + M.ispProjects.length + '行，因为VNI West虽为单一项目，但其两个组成部分在本次ISP中被拆分：新州西南REZ部分依新州立法推进，互联线部分依《国家电力规则》推进。成本为附录A5报告的估算值（A$百万，2025年价），已承诺与预期项目不填列，因其不纳入ISP成本效益分析。"≥"表示与发起人建议年份分开公布的最早投运日期。'] },
      { t:'table', head:[['ISP status class','ISP状态类别'],['What AEMO means by it','AEMO的定义']], rows:
        M.ispClasses.map(k => [{ chip:k.c, text:k.n }, k.d]) },
      { t:'warn', text:['"Actionable" is the class most often misread in a teaser. It is an instruction to a network business to begin a regulatory investment test — not a funded project, not a construction start and not a date. Seven of the ' + O.ispActionableCount + ' are newly actionable in this ISP and must begin that test now; only the other five are already being assessed or have been.',
        '"可行动"是推介材料中最常被误读的类别。它是要求电网企业启动输电监管投资测试的指令 — 既非已获资金的项目，也非开工，更非确定日期。' + O.ispActionableCount + '项中有7项是本次ISP新增的可行动项目，须立即启动该测试；仅其余5项正在评估或已完成评估。'] },
      { t:'why', text:['Three rows carry most of the underwriting information. Project EnergyConnect is the market\'s reminder that a delivered project can still be a late one: Stage 1 energised in ' + O.pecStage1Done + ' at ' + O.pecStage1MW + ' MW, but the full ' + O.pecMW + ' MW does not arrive until ' + O.pecStage2Year + ', roughly a year later than first planned. VNI West moved from ' + O.vniWestWasYear + ' to ' + O.vniWestYear + ' on a ' + fmtCM(O.vniWestAbn * 1e9) + ' project, and in this ISP its two halves were split apart into different regulatory regimes. And QNI Connect went the other way entirely — an actionable project in the 2024 ISP whose identified need was deferred almost a decade to the mid-2040s, because AEMO reduced assumed coal flexibility and counted newly committed batteries. Nothing physical failed; the need was recalculated. That is the rule the register teaches: believe a date once construction has started and the delivery partners are contracted, and treat every earlier class as an option that AEMO can reprice at the next ISP.',
        '三行承载了大部分承销信息。Project EnergyConnect提醒市场：已交付的项目仍可能是延期项目 — 一期于' + O.pecStage1Done + '以' + O.pecStage1MW + 'MW送电，但完整的' + O.pecMW + 'MW要到' + O.pecStage2Year + '才到位，比最初计划晚约一年。VNI West这一' + fmtCM(O.vniWestAbn * 1e9) + '的工程由' + O.vniWestWasYear + '年推迟至' + O.vniWestYear + '年，且在本次ISP中其两个部分被拆分至不同监管制度之下。QNI Connect则完全相反 — 它在2024年ISP中属可行动项目，而其识别需求被推迟近十年至2040年代中期，原因是AEMO下调了燃煤机组的假定灵活性并计入了新承诺的电池。没有任何实体环节失败；只是需求被重新计算。这正是本登记表所揭示的规则：当工程已开工且交付合作方已签约时采信其日期，并将此前的每一个类别都视为AEMO可在下一次ISP中重新定价的期权。'],
        sig:['A need can be recalculated away','需求可能被重新计算掉'] },
      { t:'src', src: SRC.ispA5, use:['Project scope, status class, reported cost and proponent-advised timing for every project','各项目的范围、状态类别、报告成本及发起人建议时点'] },
      { t:'src', src: SRC.pec, use:['SA–NSW interconnector scope and staged energisation','南澳—新南威尔士互联线范围及分期送电情况'] },
      { t:'src', src: SRC.humelink, use:['500 kV route, length and completion','500千伏路径、长度及完工时间'] },
      { t:'src', src: SRC.cwo, use:['REZ network capacity and commissioning year','可再生能源区网络容量及投运年份'] },
      { t:'src', src: SRC.aer, use:['Approved transmission capex, including Marinus Link Stage 1','已核准输电资本开支，含Marinus Link一期'] },
    ] },

    { t:'card', title:['Connection risk → suggested commercial protections','并网风险 → 建议商业保护条款'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Risk','风险'],['Protection','保护条款'],['Trigger to invoke','触发条件']], rows:[
        [{b:['Marginal loss factor declines after financial close','融资交割后边际损耗系数下降']},
         ['Price adjustment tied to the published loss factor at the connection point, with a floor below which the seller carries the difference','以并网点公布的损耗系数为准设置价款调整，并设下限，低于下限部分由卖方承担'],
         ['Any acquisition priced off a regional average rather than the node','任何以区域平均值而非节点数据定价的收购']],
        [{b:['Uncompensated curtailment above the modelled level','无补偿限电超出模型水平']},
         ['Earn-out or deferred consideration linked to a measured first-year export volume','与实测第一年送出电量挂钩的对赌或递延对价'],
         ['A site in western NSW or north-west Victoria, where curtailment concentrates','位于新南威尔士西部或维多利亚西北部等限电集中地区的场址']],
        [{b:['Commissioning hold points delay full output','调试节点延迟满出力'],},
         ['Long-stop tied to unrestricted operation, not to mechanical completion, with per-day liquidated damages','将最终截止日挂钩无限制运行而非机械完工，并设按日违约金'],
         ['Any model that starts revenue at practical completion','任何以实质完工作为收入起点的模型']],
        [{b:['Generator performance standards renegotiated','发电机组性能标准被重新协商']},
         ['Condition precedent on accepted standards, with a price adjustment if the accepted envelope is narrower than assumed','以性能标准获接受为先决条件，若接受的范围窄于假设则调整价款'],
         ['Standards still in negotiation at signing','签约时性能标准仍在协商中']],
        [{b:['Relief arrives and the congestion thesis expires','缓解到位，拥塞投资逻辑失效']},
         ['Do not underwrite a congestion-driven charging advantage beyond the named relief date','不得将拥塞带来的低价充电优势承销至具名缓解日期之后'],
         ['A case relying on constraint-driven cheap charging','任何依赖约束所造成低价充电的投资逻辑']],
      ] },
      { t:'why', text:['Four of the five protections price a variable rather than allocate a permit risk, which is the correct emphasis for a market whose connection process works. The fifth is the one most often missed and it runs the other way: South Australia\'s congestion thesis is not permanent, but neither has it expired. Project EnergyConnect Stage 1 delivered only ' + O.pecStage1MW + ' MW of the eventual ' + O.pecMW + ' MW, and Stage 2 is not in service until ' + O.pecStage2Year + '. So the underwritable date is Stage 2, not the headline that the interconnector "is built" — and a case that assumes relief has already arrived is as wrong as one that assumes it never will.',
        '五项保护中有四项是为变量定价而非分配许可风险 — 对一个并网流程运作良好的市场而言，这是正确的侧重。第五项最常被遗漏，且方向相反：南澳的拥塞投资逻辑并非永久成立，但也尚未失效。Project EnergyConnect一期仅交付了最终' + O.pecMW + 'MW中的' + O.pecStage1MW + 'MW，二期要到' + O.pecStage2Year + '才投运。因此可承销的日期是二期，而非"互联线已建成"这一标题 — 假定缓解已经到位的方案，与假定其永不到来的方案同样错误。'],
        sig:['The underwritable date is Stage 2','可承销的日期是二期'] },
    ] },
  ] };
};

// ============================== NEM vs WEM (peer benchmark) ==============================
// The only tab that uses peer-market data. It is held in a separate namespace and
// excluded from every NEM scoring input, exactly as Romania holds Poland.
SEC_B.benchmark = function (){
  const inp = labInputs();
  /* WEM capacity revenue per nameplate MW, and the NEM merchant line on this
     dashboard's own seed, so the two bars are on the same basis. */
  const nemMerchPerMW = inp.hours * M.usableFraction * inp.cycles * 365 * (inp.avail / 100)
    * inp.spread * M.durSpreadFactor[4];
  const waContractedShare = P.rcmPricePerMW / (P.rcmPricePerMW + P.merchGross + P.services);
  return {
  head: ['NEM vs WEM — two Australian markets, opposite answers on capacity (context only)',
         'NEM与WEM对比 — 两个澳大利亚市场，对容量给出相反答案（仅背景参考）'],
  cap: ['The only section in this dashboard that uses Western Australian data. Both markets sit in one country under one federal energy policy, use the same equipment and the same contractors, and have made opposite choices on whether to pay for capacity. Comparing them isolates what is genuinely a NEM problem. All WEM figures are held in a separate namespace and excluded from the NEM\'s grades and verdicts.',
        '本看板中唯一使用西澳数据的章节。两个市场同处一国、同受一套联邦能源政策管辖、使用相同设备与承包商，却在“是否为容量付费”上作出了相反选择。比较两者可分离出真正属于NEM特有的问题。所有WEM数值保存在独立命名空间，不计入NEM的评级与结论。'],
  blocks: [
    { t:'note', b:['Scope discipline: ','范围纪律：'],
      text:['WEM data never enters the NEM price series, pipeline, FCAS analysis or any scoring input. It is used here for one purpose: to price what a capacity mechanism is worth, using the cleanest natural experiment available anywhere on this platform — the same technology, the same country, the same supply chain, and one market design difference.',
            'WEM数据绝不进入NEM的价格序列、管线、FCAS分析或任何评分输入。此处使用仅有一个目的：借助本平台所能提供的最干净的自然实验 — 相同技术、相同国家、相同供应链，仅市场设计一项不同 — 为“容量机制值多少”定价。'] },

    { t:'card', mt:false, title:['Market design — the same asset earns differently on each side of the country','市场设计 — 同一资产在国境两侧的获利方式不同'], badges:['peer'], live:false, blocks:[
      { t:'table', head:[['Feature','特征'],['NEM','NEM'],['WEM (peer namespace)','WEM（同业命名空间）']], rows:[
        [{b:['Market structure','市场结构']},
         ['Energy-only, five regions, five-minute dispatch and settlement','单一电能量，五个区域，五分钟调度与结算'],
         ['Energy market plus a Reserve Capacity Mechanism','电能量市场加备用容量机制']],
        [{b:['Capacity payment','容量付费']},
         [L(['None — and the Nelson Review kept it that way on ' + O.reviewDate,'无 — Nelson评估于' + O.reviewDate + '维持这一设计']), L(['None','无'])],
         ['≈' + fmtCk(P.rcmPricePerMW) + '/MW/yr on a ' + P.rcmElectionYears + '-year fixed-price election','约' + fmtCk(P.rcmPricePerMW) + '/MW/年，按' + P.rcmElectionYears + '年固定价选择权']],
        [{b:['Who sets the revenue floor','谁设定收入底线']},
         ['Nobody by default. A CIS collar or a virtual toll, both confidentially priced, if you win one.','默认无人设定。若能取得，则由CIS双向结构或虚拟租赁设定，而两者定价均保密。'],
         ['The Reserve Capacity Mechanism, administered and published, for every accredited facility','由备用容量机制设定，管理并公布，适用于所有获认定设施']],
        [{b:['How congestion is settled','拥塞如何结算']},
         ['In marginal loss factors and uncompensated curtailment — a charge on market revenue','以边际损耗系数与无补偿限电结算 — 属市场化收入上的费用'],
         [P.congestionInstrument[0], P.congestionInstrument[1]]],
        [{b:['Capital cost','资本成本']},
         [fmtC(O.gencost4h) + '/kWh at four hours (GenCost 2025-26)', fmtC(O.gencost4h) + '/kWh（四小时，GenCost 2025-26）'],
         ['≈' + fmtC(P.capexPerKWh) + '/kWh; capital cost runs about ' + P.capexPremiumPerKWPct + '% higher per kW than the NEM','约' + fmtC(P.capexPerKWh) + '/kWh；按每kW计，资本成本约比NEM高' + P.capexPremiumPerKWPct + '%']],
        [{b:['Archetype','原型配置']},
         [fmtN(inp.mw) + ' MW · ' + inp.hours + 'h, from CIS Tender 8', fmtN(inp.mw) + 'MW · ' + inp.hours + '小时，取自CIS第8轮'],
         [fmtN(P.archetypeMW) + ' MW · ' + P.archetypeHours + 'h, set by the capacity accreditation rules', fmtN(P.archetypeMW) + 'MW · ' + P.archetypeHours + '小时，由容量认定规则决定']],
        [{b:['Dashboard use','看板用途']},
         ['Core NEM score and every other tab','NEM核心评分及其他所有页面'],
         ['This section only — context, never scored','仅本节 — 背景参考，不参与评分']],
      ] },
      { t:'why', text:['The decisive row is capacity payment. Western Australia contracts ' + fmtCk(P.rcmPricePerMW) + '/MW/yr for ' + P.rcmElectionYears + ' years on published, administered terms; the NEM pays nothing for capacity and, after a full market settings review concluded on ' + O.reviewDate + ', will not start. Everything else in this table follows from that one difference — including the archetype, because a market that pays for capacity accredits duration and a market that does not lets arbitrage choose it.',
        '决定性的一行是容量付费。西澳按公开、受管制的条款签订' + P.rcmElectionYears + '年、' + fmtCk(P.rcmPricePerMW) + '/MW/年的容量合同；NEM完全不为容量付费，且在' + O.reviewDate + '完成的一次完整市场设计评估之后也不会开始。本表其余各行皆源自这一项差异 — 包括原型配置，因为为容量付费的市场会对时长进行认定，不付费的市场则任由套利来决定时长。'],
        sig:['One design difference explains the whole table','一项设计差异解释了整张表'] },
    ] },

    { t:'card', title:['Revenue certainty compared — what a capacity mechanism is worth','收入确定性对比 — 容量机制值多少'], badges:['illus','peer'], blocks:[
      { t:'kpis', items:[
        { l:['NEM — contracted revenue per nameplate MW','NEM — 每铭牌MW合同化收入'], v:fmtC(0) + '<small>/MW/yr</small>', d:['no capacity mechanism exists; comparison.js sets `contracted` to zero','不存在容量机制；comparison.js将contracted设为零'], b:['official'] },
        { l:['WEM — capacity revenue per nameplate MW','WEM — 每铭牌MW容量收入'], v:'≈' + fmtCk(P.rcmPricePerMW) + '<small>/MW/yr</small>', d:['on a ' + P.rcmElectionYears + '-year fixed-price election (peer namespace)','按' + P.rcmElectionYears + '年固定价选择权（同业命名空间）'], b:['peer'] },
        { l:['NEM — merchant revenue per nameplate MW','NEM — 每铭牌MW市场化收入'], v:'≈' + fmtCk(nemMerchPerMW) + '<small>/MW/yr</small>', d:['gross at ' + inp.hours + 'h, before optimiser fee, loss factors and opex','' + inp.hours + '小时口径毛值，未扣除优化商费用、损耗系数与运维'], b:['calc'] },
        { l:['WEM contracted share of the stack','WEM收入结构中的合同化占比'], v:'≈' + fmtPct(waContractedShare * 100, 0), d:['capacity as a share of capacity + merchant + services (peer namespace)','容量收入占“容量+市场化+服务”的比重（同业命名空间）'], b:['peer'] },
      ] },
      { t:'bar', cfg:{ xs:[L(['NEM — contracted','NEM — 合同化']), L(['NEM — merchant','NEM — 市场化']), L(['WEM — capacity','WEM — 容量']), L(['WEM — merchant','WEM — 市场化'])],
        bw: 44, rotX: true, yfmt: v => fmtCk(v), labels: false, h: 270,
        series:[{ name:['A$/MW/yr','A$/MW/年'], color:'var(--s1)', vals:[0, nemMerchPerMW, P.rcmPricePerMW, P.merchGross] }] } },
      { t:'cmp', items:[
        { h:['NEM — what a lender can size against by default','NEM — 默认情况下贷款人可据以安排规模的部分'], v:'0%', s:['gearing is constrained by the absence of any contracted line unless a CIS collar or a toll is secured','除非取得CIS双向结构或租赁，否则杠杆受限于不存在任何合同化收入线'] },
        { h:['WEM — what a lender can size against','WEM — 贷款人可据以安排规模的部分'], v:'≈' + fmtPct(waContractedShare * 100, 0), s:['an administered, published capacity price converts the same asset into conventional project finance','受管制且公开的容量价格使同一资产成为常规项目融资标的'] },
      ] },
      { t:'why', text:['This is the most decision-relevant comparison on the platform because it holds nearly everything constant. Same country, same currency, same equipment, same contractors, same federal climate policy. One market pays ' + fmtCk(P.rcmPricePerMW) + '/MW/yr for capacity on published terms and the other pays nothing. The consequence is not that NEM returns are lower — they can be higher — but that the NEM asset needs a confidentially priced private contract to reach the same buyer universe the WEM asset reaches by default.',
        '这是本平台最具决策相关性的对比，因为它几乎控制了所有其他变量。同一国家、同一货币、同一设备、同一批承包商、同一套联邦气候政策。一个市场按公开条款为容量支付' + fmtCk(P.rcmPricePerMW) + '/MW/年，另一个分文不付。其后果并非NEM回报更低 — 它可能更高 — 而是NEM资产需要一份定价保密的私人合同，才能触及WEM资产默认即可触及的买家群体。'],
        sig:['Same country, opposite financing structures','同一国家，相反的融资结构'] },
    ] },

    { t:'g2', cards:[
      { title:['Cost and scale — the NEM is cheaper and much larger','成本与规模 — NEM更便宜且大得多'], badges:['illus','peer'], blocks:[
        { t:'kpis', items:[
          { l:['NEM installed fleet','NEM在运机组'], v:fmtN(O.installedMW) + '<small> MW</small>', d:[fmtN(O.fleetMWh) + ' MWh at ' + fmt1(O.fleetHours) + ' h average','' + fmtN(O.fleetMWh) + 'MWh，平均' + fmt1(O.fleetHours) + '小时'], b:['official'] },
          { l:['NEM capital cost, 4h','NEM资本成本，4小时'], v:fmtC(O.gencost4h) + '<small>/kWh</small>', d:[fmtCM(O.gencost4h * 4 * 1000) + '/MW installed','安装成本' + fmtCM(O.gencost4h * 4 * 1000) + '/MW'], b:['official'] },
          { l:['WEM capital cost','WEM资本成本'], v:'≈' + fmtC(P.capexPerKWh) + '<small>/kWh</small>', d:[fmtCM(P.capexPerMW) + '/MW at ' + P.archetypeHours + ' h (peer namespace)','' + P.archetypeHours + '小时口径' + fmtCM(P.capexPerMW) + '/MW（同业命名空间）'], b:['peer'] },
          { l:['WEM capex premium per kW','WEM每kW造价溢价'], v:'≈' + P.capexPremiumPerKWPct + '<small>%</small>', d:['on a per-kW basis; the two dashboards\' own per-kWh figures give ' + fmtPct((P.capexPerKWh / O.gencost4h - 1) * 100, 0) + '%','按每kW口径；两个看板各自的每kWh数据则给出' + fmtPct((P.capexPerKWh / O.gencost4h - 1) * 100, 0) + '%'], b:['peer','verify'] },
        ] },
        { t:'note', text:['The two capex comparisons use different bases and both are shown rather than reconciled. The sourced statement is that WEM capital cost runs about ' + P.capexPremiumPerKWPct + '% higher per kW. This platform\'s own figures are ' + fmtC(P.capexPerKWh) + '/kWh for the WEM against ' + fmtC(O.gencost4h) + '/kWh for the NEM, which is ' + fmtPct((P.capexPerKWh / O.gencost4h - 1) * 100, 0) + '% on an energy basis. A per-kW comparison across a ' + P.archetypeHours + '-hour and a ' + M.lab.hours + '-hour archetype is not the same measurement as a per-kWh one, and neither figure is adjusted to match the other.',
          '两项造价对比使用不同口径，此处并列呈现而不作调和。有来源的表述是：按每kW计，WEM的资本成本约高出' + P.capexPremiumPerKWPct + '%。本平台自身的数据则为WEM ' + fmtC(P.capexPerKWh) + '/kWh对NEM ' + fmtC(O.gencost4h) + '/kWh，按能量口径为' + fmtPct((P.capexPerKWh / O.gencost4h - 1) * 100, 0) + '%。在' + P.archetypeHours + '小时与' + M.lab.hours + '小时两种原型之间作每kW对比，与作每kWh对比并非同一度量，且两个数字均未作相互调整。'] },
        { t:'why', text:['Scale and cost run the same way and reinforce each other. The NEM is the larger market by an order of magnitude and buys equipment more cheaply per kilowatt-hour, which is a genuine competitive advantage for a NEM project against a WEM one on the capital side. It does not survive contact with the revenue side: the WEM asset has a published capacity price and the NEM asset does not.',
          '规模与成本方向一致且相互强化。NEM是规模大一个数量级的市场，且每千瓦时的设备采购更便宜 — 在资本侧，这是NEM项目相对WEM项目的真实竞争优势。但它在收入侧无法存续：WEM资产拥有公开的容量价格，NEM资产没有。'],
          sig:['Cheaper capital, unpriced revenue','资本更便宜，收入无定价'] },
      ] },
      { title:['Where the constraint sits in each market','各市场的约束所在'], badges:['illus','peer'], blocks:[
        { t:'table', head:[['Dimension','维度'],['NEM','NEM'],['WEM','WEM']], rows:[
          [{b:['Primary constraint','首要约束']}, ['Merchant spread compression as the fleet grows','装机增长带来的市场化价差压缩'], ['Network Access Quantity headroom — foundation generators hold priority','网络接入量裕度 — 基础发电机组享有优先权']],
          [{b:['How congestion reaches the P&L','拥塞如何进入损益表']}, ['A loss-factor multiplier plus uncompensated curtailment on market revenue','损耗系数乘数加市场化收入上的无补偿限电'], ['Fewer Capacity Credits — the loss appears in the capacity payment, not the energy market','容量信用减少 — 损失体现在容量付费而非电能量市场']],
          [{b:['Is anyone compensated?','是否有人获得补偿？']}, ['No. No firm rights, and the Congestion Relief Market was recommended not to proceed.','否。不存在固定权利，且拥塞缓解市场已被建议不予推行。'], ['Not compensated either, but the loss is measured and administered rather than merely realised','同样无补偿，但损失是被计量与管理的，而非仅仅被动发生']],
          [{b:['What rations development','什么在配给开发']}, ['Offtake. Anyone can build; few can contract.','购电。人人可建，能签约者寥寥。'], ['Accreditation. Capacity Credits are the scarce asset.','认定。容量信用是稀缺资产。']],
          [{b:['Named relief','具名缓解工程']}, ['Project EnergyConnect full ' + O.pecMW + ' MW at ' + O.pecStage2Year + '; HumeLink ' + O.humelinkYear + '; VNI West slipped to ' + O.vniWestYear,'Project EnergyConnect完整' + O.pecMW + 'MW于' + O.pecStage2Year + '到位；HumeLink为' + O.humelinkYear + '年；VNI West推迟至' + O.vniWestYear + '年'], ['Clean Energy Link — East expected operational by end-2029','清洁能源联络线—东段预计2029年底投运']],
        ] },
        { t:'why', text:['Both markets ration, but they ration different things. The WEM rations accreditation, so a WEM developer\'s scarce asset is Capacity Credits and the diligence question is how many the facility will be assigned. The NEM rations offtake, so a NEM developer\'s scarce asset is a counterparty and the diligence question is who will write the contract. Neither is harder; they require different skills and different people, and a team that succeeded in one should not assume it can execute in the other.',
          '两个市场都在配给，但配给的对象不同。WEM配给的是认定，因此WEM开发商的稀缺资产是容量信用，尽调问题是该设施将获分配多少。NEM配给的是购电，因此NEM开发商的稀缺资产是交易对手，尽调问题是谁会签下这份合同。两者难度不分高下，但所需技能与人员不同 — 在一个市场成功的团队不应假设自己能在另一个市场执行。'],
          sig:['WEM rations accreditation; the NEM rations offtake','WEM配给认定，NEM配给购电'] },
      ] },
    ] },

    { t:'card', title:['What transfers from the WEM to a NEM decision — and what does not','哪些WEM结论可迁移至NEM决策 — 哪些不能'], badges:['calc','peer'], blocks:[
      { t:'table', head:[['Verdict','结论'],['Dimension','维度'],['Reasoning','理由']], rows:[
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Equipment, EPC and grid-code capability','设备、EPC与电网规范能力']},
         ['One national supply chain, one contractor pool and one set of Australian standards serve both markets.','同一条全国供应链、同一批承包商与同一套澳大利亚标准同时服务两个市场。']],
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Warranty envelopes and degradation experience','质保范围与衰减经验']},
         ['Australian warranties commonly guarantee 60–70% capacity retention, and the same OEMs supply both coasts.','澳大利亚质保通常保证60–70%的容量保持率，且同一批OEM供应东西两岸。']],
        [{chip:'good', text:['Transfers','可迁移']}, {b:['AEMO as operator and publisher','AEMO作为运营方与发布方']},
         ['AEMO runs both markets and publishes to a comparable standard, so data availability expectations carry across.','AEMO同时运营两个市场并以可比标准公布数据，因此对数据可得性的预期可以互通。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Revenue certainty and gearing','收入确定性与杠杆']},
         ['A published capacity price underpins WEM project debt. The NEM has no equivalent, so the same asset supports materially less leverage without a private contract.','公开的容量价格支撑WEM的项目融资。NEM没有对应机制，因此在没有私人合同的情况下，同一资产可支撑的杠杆显著更低。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Duration economics','时长经济性']},
         ['WEM accreditation rules push the archetype to ' + P.archetypeHours + ' hours. In the NEM duration is chosen by arbitrage, and the answer is ' + M.lab.hours + ' hours.','WEM的认定规则将原型推向' + P.archetypeHours + '小时。在NEM，时长由套利决定，答案是' + M.lab.hours + '小时。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['How congestion is priced','拥塞如何定价']},
         ['The WEM settles it in capacity accreditation; the NEM settles it in loss factors and uncompensated curtailment. The same physical constraint hits a different line of the model.','WEM以容量认定结算，NEM以损耗系数与无补偿限电结算。同一物理约束落在模型的不同行上。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Development skill set','开发所需能力']},
         ['WEM development is an accreditation exercise; NEM development is an offtake negotiation with a short counterparty list.','WEM开发是一项认定工作；NEM开发是与少数对手方进行的购电谈判。']],
      ] },
      { t:'reco', b:['Comparison conclusion: ','对比结论：'],
        text:['Use the WEM to calibrate cost, delivery capability, warranty terms and operator behaviour — the supply side and the physical side. Do not use it to calibrate revenue certainty, gearing, duration economics or how congestion reaches the P&L — the design side. A WEM comparable tells you what an Australian battery should cost and who can build it; only the NEM structure tells you how much of that revenue anyone will lend against.',
              '应以WEM校准成本、交付能力、质保条款与运营方行为 — 即供给侧与物理侧。不应以其校准收入确定性、杠杆、时长经济性或拥塞如何进入损益表 — 即设计侧。WEM可比市场能说明澳大利亚电池应有的成本水平以及谁能建造它；但只有NEM自身的结构能说明这些收入中有多少可供任何人放贷。'] },
      { t:'why', text:['This split is the operative rule for the whole section and it defines the boundary the dashboard enforces in code: WEM figures inform supply-side and physical assumptions and are excluded from every revenue and scoring input. The specific error this section exists to prevent is importing a WEM gearing assumption into a NEM case — same country, same equipment, same operator, and an entirely different financeable revenue.',
        '这一划分是本节的可执行规则，同时界定了看板在代码层面强制执行的边界：WEM数值可用于供给侧与物理侧假设，并被排除于所有收入与评分输入之外。本节要防止的具体错误是将WEM的杠杆假设引入NEM方案 — 同一国家、同一设备、同一运营方，而可融资收入完全不同。'],
        sig:['Supply side yes, design side no','供给侧可用，设计侧不可用'] },
    ] },
  ] };
};

// ============================== PORTFOLIO / FUND VIEW ==============================
SEC_B.portfolio = function (){
  const inp = labInputs(), r = labModel(inp);
  const cis = M.official.cis;
  return {
  head: ['Portfolio / Fund View — applying the NEM thesis to a screened opportunity',
         '组合与基金视图 — 将NEM逻辑应用于所筛选机会'],
  cap: ['A worked screening example on this dashboard\'s own assumptions. All project-specific content is confined to this tab and is illustrative — it demonstrates the gate sequence an investment committee should apply in an energy-only market, not a real transaction.',
        '基于本看板自身假设的筛选示例。所有项目层面内容均限于本页且为示例性质 — 用于演示投委会在单一电能量市场中应遵循的门槛顺序，而非真实交易。'],
  blocks: [
    { t:'card', mt:false, title:['Screened opportunity — institutional screening snapshot','所筛选机会 — 机构筛选快照'], badges:['illus'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Configuration','配置'], v:fmtN(inp.mw) + ' MW / ' + fmtN(inp.mw * inp.hours) + '<small> MWh</small>',
          d:[inp.hours + '-hour design, the NEM reference archetype', inp.hours + '小时设计，NEM参考原型'] },
        { l:['Target COD','目标投运'], v:state.codYear,
          d:['CIS Tender 8 storage must be operational by 31 Dec 2029','CIS第8轮招标储能须于2029年12月31日前投运'] },
        { l:['Total capex','总资本开支'], v:fmtCM(r.capex),
          d:[fmtC(inp.capexKWh) + '/kWh installed (GenCost 4h)', fmtC(inp.capexKWh) + '/kWh装机（GenCost 4小时）'], b:['model'] },
        { l:['Year-1 EBITDA','第1年EBITDA'], v:fmtCM(r.ebitda1),
          d:['unlevered IRR ' + fmtIRR(r.unlevIRR), '无杠杆IRR ' + fmtIRR(r.unlevIRR)], b:['calc'] },
        { l:['Min DSCR','最低偿债覆盖率'], v:fmtX(r.minDSCR),
          d:['lender floor typically 1.30x','贷款人下限通常1.30倍'],
          cls: r.minDSCR != null && r.minDSCR < 1.3 ? 'down' : '', b:['calc'] },
        { l:['Simple payback','简单回收期'], v: r.payback ? r.payback + L([' yr',' 年']) : '—', b:['calc'] },
      ] },
      { t:'ic', b:['Screening conclusion: ','筛选结论：'],
        text:['In an energy-only market the screening question is not whether the returns clear a hurdle — it is which of the three routes the returns are being measured on, because they are not the same asset. A merchant case is a view on spreads that fell 85% year on year in Q2 2026. A CIS case is a view on a floor nobody publishes. A toll case is a view on a price nobody discloses. State which one before the model, not after.',
              '在单一电能量市场中，筛选问题不在于回报是否跨过门槛，而在于回报是按三条路径中的哪一条衡量的 — 因为它们并非同一资产。市场化方案是对2026年第二季度同比下跌85%的价差的判断；CIS方案是对无人公布的保底价的判断；租赁方案是对无人披露的价格的判断。应在建模之前而非之后明确选择哪一条。'] },
    ] },

    { t:'card', title:['Route selection — the same asset under three contracts','路径选择 — 同一资产的三种合同形态'], badges:['calc','illus'], live:false, blocks:[
      { t:'table', head:[['Route','路径'],['What it fixes','锁定的内容'],['What it leaves open','未锁定的内容'],['Evidence status','证据状态']], rows:[
        [{b:['Merchant','纯市场化']},
         ['Nothing. Full exposure to spot and FCAS.','不锁定任何内容。完全暴露于现货与FCAS。'],
         ['Everything. Energy arbitrage drives more than 95% of forecast merchant revenue over asset life.','全部。电量套利占全寿命期预测市场化收入的95%以上。'],
         {chip:'good', text:['Index published monthly','指数按月公布']}],
        [{b:['CIS long-term award','CIS长期中标']},
         ['A revenue floor, at 90% of the shortfall, for 10–15 years.','以补足缺口90%的方式锁定收入下限，期限10–15年。'],
         ['The floor level itself, plus 50% of everything above the ceiling.','下限水平本身，以及超出上限部分的50%。'],
         {chip:'serious', text:['Floor never published','保底价从未公布']}],
        [{b:['Virtual toll','虚拟租赁']},
         ['A fixed fee for 12–15 years; the offtaker takes dispatch and market risk.','12–15年固定费用；承购方承担调度与市场风险。'],
         ['Whether the fee clears above your merchant expectation. Six announced deals, zero disclosed prices.','该费用是否高于你的市场化预期。已公告六笔交易，零价格披露。'],
         {chip:'serious', text:['Tenor disclosed, price not','期限已披露，价格未披露']}],
      ] },
      { t:'why', text:['Two of the three routes cannot be priced from public information, which is unusual for a market this large and this well instrumented — AEMO publishes quarterly dispatch, annual loss factors and a biennial system plan, and none of it reaches contract prices. The practical consequence for a fund is that route selection in the NEM cannot be desk-researched. It requires being in the tender or in the negotiation, and a screening model should carry the merchant case as the only one it can independently verify.',
        '三条路径中有两条无法依据公开信息定价，这对一个规模如此之大、数据如此完备的市场而言并不寻常 — AEMO公布季度调度数据、年度损耗系数及两年一度的系统规划，却没有一项触及合同价格。对基金而言的现实结果是：NEM的路径选择无法通过案头研究完成，必须进入招标或谈判之中；筛选模型应将市场化方案作为唯一可独立验证的情形。'],
        sig:['Only the merchant route can be desk-verified','仅市场化路径可通过案头验证'] },
    ] },

    { t:'card', title:['Investment Committee gates — what must be true before capital is released','投委会门槛 — 资金拨付前必须成立的条件'], badges:['calc'], live:false, blocks:[
      { t:'gates', items:[
        { n:['Gate 1 — Connection point and loss factor','门槛1 — 并网点与损耗系数'],
          d:['A named connection point with its marginal loss factor history, modelled as a variable. AEMO republishes factors every 1 April, so this is a live revenue risk rather than a discount fixed at financial close.',
             '具名并网点及其边际损耗系数历史数据，并按变量建模。AEMO每年4月1日重新公布系数，因此这属于动态收入风险，而非融资交割时锁定的折扣。'],
          c:'warn', s:['Evidence required','需提供证据'] },
        { n:['Gate 2 — Route to market declared','门槛2 — 售电路径已确定'],
          d:['Merchant, CIS or toll, chosen and evidenced before the model is built. Only 28% of battery capacity awarded a CISA before Tender 3 had reached FID at that round — a contract is not a project.',
             '在建模之前确定并证明采用市场化、CIS或租赁路径。第3轮招标之前获得CIS协议的储能容量中，当时仅28%达成最终投资决定 — 合同不等于项目。'],
          c:'serious', s:['Decides the asset','决定资产性质'] },
        { n:['Gate 3 — Duration','门槛3 — 时长'],
          d:['Four hours or the case does not clear. Modo puts 4h at 9.4% IRR against 5.5% for 2h, and the 4h capex premium has fallen to about 1.5× two hours.',
             '须为四小时，否则方案无法成立。Modo测算4小时IRR为9.4%，2小时为5.5%，且4小时相对2小时的造价溢价已降至约1.5倍。'],
          c:'good', s:['Settled by the archetype','已由原型确定'] },
        { n:['Gate 4 — Congestion is not compensated','门槛4 — 拥塞无补偿'],
          d:['Confirm the case does not assume any payment for being constrained off. There is none in the NEM, and the Congestion Relief Market that would have created one was recommended not to proceed.',
             '确认方案未假设因受约束停机可获得任何补偿。NEM不存在此类补偿，而本可创设该机制的拥塞缓解市场已被建议不予推行。'],
          c:'critical', s:['Model it as zero','应按零建模'] },
        { n:['Gate 5 — Saturation','门槛5 — 饱和度'],
          d:['The connections pipeline holds around 45 GW of batteries against an ISP requirement of 33 GW by 2030. Test the case at the compressed spread, not the historical one.',
             '并网排队中约有45GW储能，而ISP要求2030年前建成33GW。应按压缩后的价差而非历史价差检验方案。'],
          c:'critical', s:['Pipeline exceeds the target','管线已超出目标'] },
      ] },
      { t:'why', text:['Gate 5 is the one that has changed most since 2024 and it is ordered last only because it is the most expensive to answer properly. Queensland is the worked example: it went from the NEM\'s highest-earning battery region to its worst in a single year, on saturation rather than on any change to the network or the rules. A pipeline that already exceeds the 2030 requirement is not a growth signal for an incumbent — it is the mechanism that removes the spread the incumbent was underwritten on.',
        '第5道门槛是自2024年以来变化最大的一项，将其排在最后仅因其正确回答的成本最高。昆士兰即为实证案例：它在一年之内从NEM储能收益最高的区域跌至最低，原因是饱和，而非电网或规则的任何变化。已超出2030年需求的管线对既有资产而言并非增长信号 — 而是移除其承销所依赖价差的机制。'],
        sig:['Saturation, not policy, is the NEM risk','NEM的风险是饱和而非政策'] },
    ] },
  ] };
};

// ============================== DATA & METHODOLOGY ==============================
SEC_B.data = function (){
  return {
  head: ['Data & Methodology — what is published, what is not, and what this dashboard does about it',
         '数据与方法 — 哪些已公开、哪些未公开，以及本看板如何处理'],
  cap: ['The NEM is one of the best-instrumented electricity markets in the world and one of the least transparent on contract prices. Both halves of that sentence shape every number on this dashboard, so both are set out here.',
        'NEM是全球数据最完备的电力市场之一，同时也是合同价格最不透明的市场之一。这句话的两个部分共同决定了本看板上的每一个数字，因此在此一并说明。'],
  blocks: [
    { t:'card', mt:false, title:['What is not published — and what this dashboard uses instead','未公开的内容 — 以及本看板的替代做法'], badges:['official'], blocks:[
      { t:'table', head:[['Item','项目'],['Publication status','公开状态'],['Why','原因'],['What is used instead','替代做法']],
        rows: M.notPublished.map(x => [{b:x.item}, {chip:'serious', text:x.status}, x.why, x.instead]) },
      { t:'why', text:['This table is the most important one on the dashboard and it is deliberately first. Two of the NEM\'s three routes to market cannot be priced from public information at all, so any figure this platform publishes for a CIS floor or a toll fee is a bracket between two anchors rather than an observation. The Nelson Review\'s recommendation that the successor ESEM should publish its auction clearing prices is worth watching for exactly this reason: it would convert the largest assumption in this market into a number.',
        '本表是看板上最重要的一张，且刻意置于首位。NEM三条售电路径中有两条完全无法依据公开信息定价，因此本平台就CIS保底价或租赁费用发布的任何数字，都是两个锚点之间的区间估计，而非实测观察值。Nelson评估建议后继的ESEM应公布其拍卖出清价格 — 正因如此，这一点值得密切关注：它将把本市场中最大的假设转化为一个数字。'],
        sig:['Two of three routes are unpriceable from public data','三条路径中有两条无法依据公开数据定价'] },
      { t:'src', src:SRC.contractPriceGap, use:['The coverage gap this table describes','本表所述的数据覆盖缺口'] },
    ] },

    { t:'card', title:['Source register','来源登记册'], badges:['official'], blocks:[
      { t:'table', head:[['Source','来源'],['Status','状态'],['Vintage','数据时点'],['Coverage','覆盖范围']], rows:[
        [{b:['AEMO — Quarterly Energy Dynamics','AEMO — 季度市场动态']}, {chip:'good', text:SRC.qed.status}, SRC.qed.date, SRC.qed.cy],
        [{b:['AEMO — 2026 Integrated System Plan','AEMO — 2026年综合系统规划']}, {chip:'good', text:SRC.isp.status}, SRC.isp.date, SRC.isp.cy],
        [{b:['AEMO — Marginal Loss Factors','AEMO — 边际损耗系数']}, {chip:'good', text:SRC.mlf.status}, SRC.mlf.date, SRC.mlf.cy],
        [{b:['DCCEEW — Capacity Investment Scheme','DCCEEW — 容量投资计划']}, {chip:'good', text:SRC.cis.status}, SRC.cis.date, SRC.cis.cy],
        [{b:['CSIRO — GenCost 2025-26','CSIRO — GenCost 2025-26']}, {chip:'good', text:SRC.gencost.status}, SRC.gencost.date, SRC.gencost.cy],
        [{b:['AEMC — Transmission access reform','AEMC — 输电接入改革']}, {chip:'good', text:SRC.aemc.status}, SRC.aemc.date, SRC.aemc.cy],
        [{b:['Nelson Review — final report','Nelson评估 — 最终报告']}, {chip:'good', text:SRC.nelson.status}, SRC.nelson.date, SRC.nelson.cy],
        [{b:['NSW Roadmap — LTESA tenders','新南威尔士路线图 — LTESA招标']}, {chip:'good', text:SRC.ltesa.status}, SRC.ltesa.date, SRC.ltesa.cy],
      ] },
      { t:'src', src:SRC.isp, use:['Named transmission projects, capacities and commissioning years used by the map and the congestion register','地图与拥塞登记表所采用的具名输电工程、容量及投运年份'] },
      { t:'src', src:SRC.mlf, use:['The loss-factor haircut carried on market revenue','作用于市场化收入的损耗系数折扣'] },
      { t:'src', src:SRC.gencost, use:['Capital cost by duration','按时长划分的资本成本'] },
    ] },

    { t:'card', title:['Methodology — how this market is normalised','方法论 — 本市场的归一化方式'], badges:['calc'], blocks:[
      { t:'table', head:[['Decision','决策'],['What this dashboard does','本看板的处理'],['Why','原因']], rows:[
        [{b:['Reference region','参考区域']},
         ['NSW1, with regional spread shown rather than averaged.','采用NSW1，并展示区域差异而非取平均。'],
         ['The NEM is five regions with genuinely different prices. A national average produces a market that does not exist; NSW is the largest fleet and sits between Queensland\'s collapse and South Australia\'s growth.','NEM由五个价格差异显著的区域组成。全国平均会产生一个并不存在的市场；新南威尔士装机规模最大，且介于昆士兰的下滑与南澳的增长之间。']],
        [{b:['No capacity route','无容量路径']},
         ['`capacityMarket` is declared false and the capacity-backed route returns "not applicable" rather than zero.','`capacityMarket`声明为false，容量支撑路径返回"不适用"而非零值。'],
         ['The NEM is energy-only and the Nelson Review kept it that way in December 2025. A zero would imply a mechanism that pays nothing; "not applicable" states that no mechanism exists.','NEM为单一电能量市场，Nelson评估于2025年12月维持了这一设计。取零意味着存在但不付费的机制；"不适用"则表明该机制根本不存在。']],
        [{b:['CIS as a long-term award','将CIS建模为长期中标']},
         ['Modelled as a fixed payment of 90% of an estimated floor, plus 10% retention of market revenue.','按估算保底价90%的固定支付，加上市场化收入10%的留存比例建模。'],
         ['While the floor binds, owner receipts are R + 0.9(floor − R), which is exactly a fixed payment plus a 10% retention. The linearisation is exact only in the floor-binding regime, which is where today\'s merchant levels sit.','当保底条款生效时，业主所得为R + 0.9(保底 − R)，恰好等于固定支付加10%留存。该线性化仅在保底生效区间内精确成立，而当前市场化收入水平正处于该区间。']],
        [{b:['Congestion','拥塞']},
         ['Carried in the congestion register and in `naqFactor`, never as a revenue line.','计入拥塞登记表及`naqFactor`，绝不作为收入项。'],
         ['NEM generators and storage hold no firm transmission rights and receive no compensation for being constrained off. A congestion revenue line would be modelling a payment that does not exist.','NEM的发电与储能不持有固定输电权，受约束停机亦无补偿。设置拥塞收入项等于对一项并不存在的付款进行建模。']],
        [{b:['FCAS and duration','FCAS与时长']},
         ['FCAS is not scaled when the archetype duration changes.','原型时长变化时，FCAS不作缩放。'],
         ['FCAS is a power-based service. Scaling it with energy capacity would overstate a four-hour asset against a two-hour one on a line where duration is irrelevant.','FCAS属功率型服务。若随能量容量缩放，会在一个与时长无关的收入项上高估四小时资产相对于两小时资产的表现。']],
      ] },
      { t:'note', b:['Currency: ','货币：'],
        text:['All figures on this dashboard are in Australian dollars. The cross-market comparison converts at the platform\'s seeded AUD rate; see the home page FX row for the rate and its date.',
              '本看板所有数字均以澳元计。跨市场对比按本平台设定的澳元汇率换算；汇率及其日期见首页汇率栏。'] },
    ] },

    { t:'card', title:['Glossary','术语表'], badges:['official'], blocks:[
      { t:'glossary' },
    ] },

    { t:'card', title:['Export','数据导出'], badges:['calc'], blocks:[
      { t:'cap', text:['Exports the KPI set carried by this dashboard, with its seed tag and vintage. Contract prices are absent because they are not published — see the first card on this tab.',
                       '导出本看板所载KPI集合及其种子标签与数据时点。合同价格因未公开而缺失 — 详见本页首张卡片。'] },
      { t:'exports' },
    ] },
  ] };
};

/* Investment Case and Entry: the investment-view revision. The content is the
   shared component, which reads this market's view and ledger as its dashboard
   registered them. There is no build pathway for this market yet, so Entry is
   the ledger. */
SEC_B.case = () => ({ head: ['Investment Case — who should enter, and by which route', '投资判断 — 谁应该进入，走哪条路径'], blocks: [
  { t: 'p', text: ['A deep financing and resale market and a fifteen-year tender contract for the projects that win one, around a reference project whose modelled return is 3.1%.', '融资与转售市场成熟，中标项目可获得十五年期招标合同；但参考项目的模型回报仅为3.1%。'] },
  { t: 'investment-case', marketId: 'nem' },
] });
SEC_B.entry = () => ({ head: ['Entry — what it costs before the first dollar of revenue', '进入成本 — 第一笔收入之前要付出什么'], blocks: [
  { t: 'p', text: ['Connection charges and tender security are known to exist and none is sourced, so nothing here is totalled.', '已知存在并网费用与招标担保，但均无来源，因此此处不作合计。'] },
  { t: 'entry-ledger', marketId: 'nem' },
] });

  return SECTIONS;
}
