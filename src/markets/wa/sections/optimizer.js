/* ---------------------------------------------------------------------------
   RCM x Energy x FCESS co-optimisation section, verbatim from the prototype
   (lines 3661-3882). Rendered as the tail of the RCM & Capacity tab — it was the
   tail of the Investment Lab tab until that tab moved to a dedicated page.
   --------------------------------------------------------------------------- */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { card } from '../../../components/card.js';
import { badge, statusBadge } from '../../../components/badge.js';
import { chip } from '../../../components/chip.js';
import { why } from '../../../components/decisionLogic.js';
import { kpi } from '../../../components/metricCard.js';
import { sectionHead } from '../../../components/sectionHeader.js';
import { waterfall } from '../../../charts/index.js';
import { state, render } from '../state.js';
import { NF1, fmtN, fmtAM, fmtPct, fmtIRR, fmtX } from '../ui.js';
import { OPT } from '../data/optimizer.js';
import { SEED } from '../data/seed.js';
import { optimizerModel, buildDispatch, optExplanation, dispatchChart } from '../lib/optimizer.js';

function renderOptimizer(main){
  /* Seeded here rather than by the Investment Lab, which used to render above
     this section and no longer exists on the dashboard at all. The reference
     configuration is WA's own seed; retyping economic assumptions is the home
     page's job now. */
  if (!state.lab) state.lab = { ...SEED.lab };
  if (!state.rcmScn) state.rcmScn = 'BASE';
  if (!state.optStrat) state.optStrat = 'BALANCED';
  const inp = state.lab, scn = state.rcmScn, strat = state.optStrat;
  const m = optimizerModel(inp, scn, strat), D = buildDispatch(inp, scn, strat, m.ccMW);

  sectionHead(main, ['RCM × Energy × FCESS Co-optimisation', 'RCM × 现货 × FCESS 协同优化'],
    ['One physical battery serves three revenue streams under shared MW, MWh, headroom and SOC limits — they are not independent or fully additive. RCM is the reliability/availability envelope; Energy and FCESS are co-optimised in real time by AEMO/WEMDE. This tool models the optimizer\'s strategy on illustrative seed data; it does not determine actual dispatch.',
     '同一物理电池在共享的MW、MWh、裕度与SOC限制下服务三条收入线 — 它们并非相互独立、也不可简单相加。RCM是可靠性/可用性边界；现货与FCESS由AEMO/WEMDE实时协同优化。本工具基于示例种子数据模拟优化商策略，并不决定实际调度。']);
  main.append(h('div', { class: 'warnbox' }, '⚠ ' + L(['Illustrative (SEED_JSON_V1). The RCM Energy Floor is an optimizer risk-control heuristic, not the legal ESM Rules calculation; settlement uses daily entity prices and the current rules. Rule vintage shown below.',
    '示例数据（SEED_JSON_V1）。RCM最低保障电量为优化商风险控制启发式，非ESM规则法定计算；结算采用每日实体价格及现行规则。规则版本见下方。'])));

  // ---- controls ----
  const scnBtns = h('div', { style: 'display:flex;gap:6px;flex-wrap:wrap;align-items:center;' },
    h('span', { style: 'font-size:12px;color:var(--muted);margin-right:2px;' }, L(['RCM scenario:', 'RCM情景：'])),
    ...['HIGH', 'BASE', 'LOW', 'CUSTOM'].map(k => h('button', { class: 'btn' + (scn === k ? ' active' : ''), onclick: () => { state.rcmScn = k; render(); } }, L(OPT.scnLabel[k]))));
  const stratBtns = h('div', { style: 'display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:8px;' },
    h('span', { style: 'font-size:12px;color:var(--muted);margin-right:2px;' }, L(['Strategy:', '策略：'])),
    ...OPT.stratOrder.map(k => h('button', { class: 'btn' + (strat === k ? ' active' : ''), onclick: () => { state.optStrat = k; render(); } }, L(OPT.strat[k].n))));
  main.append(h('div', { class: 'card' }, scnBtns, stratBtns,
    h('div', { class: 'cap', style: 'margin-top:8px;' }, L(['Rule vintage: ESM Rules (current effective) · WEM Procedures (current) · Capacity Year ' + state.codYear + ' · calculation: simplified / indicative. Project inputs are the WA reference configuration. To retype economic assumptions and price a capital structure, use the dedicated Investment Lab page.',
      '规则版本：ESM规则（现行生效）· WEM程序（现行）· 容量年度' + state.codYear + ' · 计算：简化/示意。项目输入采用西澳参考配置。如需重新输入经济性假设并测算资本结构，请使用独立投资测算页面。']))));

  // ---- row 1: RCM bridge + strategy profile ----
  const g1 = h('div', { class: 'grid g2' });
  const cScn = card(['RcmScenarioSelector — gross → net RCM bridge', 'RCM情景选择 — 毛至净RCM桥接'], [badge('calc'), badge('illus'), statusBadge(false)]);
  cScn.append(h('div', { style: 'margin:6px 0;' }, chip(scn === 'HIGH' ? 'good' : scn === 'LOW' ? 'serious' : 'info', L(OPT.scnLabel[scn]))));
  waterfall(cScn, { steps: [
    { l: ['Gross Peak RCM', '毛峰值RCM'], v: m.grossRcm / 1e6, t: 'start' },
    { l: ['− Expected refund', '− 预期退款'], v: -m.refund / 1e6, t: 'd' },
    { l: ['Net RCM revenue', '净RCM收入'], v: m.netRcm / 1e6, t: 'total' },
  ], yfmt: v => 'A$' + NF1.format(v) + 'M', zeroBase: true, h: 210 });
  const editable = scn === 'CUSTOM';
  const pRow = (lbl, key, suffix) => h('div', { class: 'score-row' }, h('div', { class: 'sr-lbl' }, L(lbl)),
    h('div', { style: 'flex:1;text-align:right;' }, editable
      ? h('input', { class: 'inp', style: 'width:90px;text-align:right;display:inline-block;', type: 'number', step: 'any', value: m.sc[key], onchange: e => { state.rcmCustom[key] = +e.target.value; render(); } })
      : h('b', {}, NF1.format(m.sc[key]) + (suffix || ''))));
  cScn.append(h('div', { style: 'margin-top:8px;' },
    pRow(['Expected RCP / BRCP factor', '预期RCP/BRCP系数'], 'rcpFactor', ''),
    pRow(['Capacity Credit retention (CRC×NAQ×assigned)', '容量信用留存(CRC×NAQ×获配)'], 'ccRet', ''),
    pRow(['Base refund %', '基础退款%'], 'refundBase', '%'),
    pRow(['Merchant freedom scale', '市场化自由度系数'], 'merchScale', '')));
  cScn.append(h('div', { class: 'kpis' },
    kpi(L(['Peak Capacity Credits', '峰值容量信用']), fmtN(m.ccMW) + '<small> MW</small>', { text: L(['after CRC / NAQ / derate', '经CRC/NAQ/折减后']) }),
    kpi(L(['Net RCM revenue', '净RCM收入']), fmtAM(m.netRcm), { text: fmtN(m.shareRcm * 100, 0) + '% ' + L(['of net revenue', '占净收入']) }),
    kpi(L(['RCM revenue per MW', '每MW RCM收入']), 'A$' + fmtN(m.netRcm / inp.mw / 1000) + 'k')));
  cScn.append(h('div', { class: 'cap' }, L(['Indicative — settlement uses daily entity Capacity Credits and RCP under the current ESM Rules. ' + (editable ? 'Custom parameters are editable above.' : 'Select Custom to edit these parameters.'),
    '示意 — 结算采用现行ESM规则下每日实体容量信用及RCP。' + (editable ? '自定义参数可在上方编辑。' : '选择“自定义”可编辑这些参数。')])));
  cScn.append(why(['Two multipliers stand between the headline capacity price and cash: the RCP factor (' + NF1.format(m.sc.rcpFactor) + '× BRCP under this scenario) and credit retention through CRC, NAQ and assignment (' + fmtPct(m.sc.ccRet * 100, 0) + '). Multiply them and the gross capacity revenue is materially below a naive MW × BRCP figure before any refund. Use this bridge as the sanity check on any capacity revenue quoted to you: ask which RCP factor and which retention assumption it embeds, because those two numbers explain most disagreements between models.',
    '名义容量价格与实际现金之间存在两个乘数：RCP系数（本情景下为BRCP的' + NF1.format(m.sc.rcpFactor) + '倍）与经CRC、NAQ及获配后的信用留存率（' + fmtPct(m.sc.ccRet * 100, 0) + '）。两者相乘后，毛容量收入在扣除任何退款之前即已显著低于简单的MW×BRCP。应以本桥作为对任何所报容量收入的检验：追问其内含的RCP系数与留存假设，因为这两个数字可解释模型之间的大部分分歧。'],
    ['Two multipliers before any refund', '退款前已有两道乘数']));
  g1.append(cScn);

  const cStrat = card(['OptimizerStrategySelector — active profile', '优化策略选择 — 当前策略画像'], [badge('illus'), statusBadge(false)]);
  const suit = { RCM_FIRST: ['High RCM · highly levered · tight DSCR · stable yield', 'RCM高情景·高杠杆·DSCR紧张·稳定收益'],
    BALANCED: ['Base case · central expected value', '基准情景·中枢期望价值'],
    FCESS_PRIORITY: ['High FCESS prices · strong response · multi-product accreditation', 'FCESS高价·响应能力强·多产品认证'],
    MERCHANT_UPSIDE: ['Low RCM · high volatility · low leverage · surplus MWh', 'RCM低情景·高波动·低杠杆·富余MWh'],
    SCARCITY_DEFENSIVE: ['Extreme heat / scarcity · reliability protection', '极端高温/紧缺·可靠性保护'] };
  const srow = (lbl, val) => h('div', { class: 'score-row' }, h('div', { class: 'sr-lbl' }, L(lbl)), h('div', { style: 'flex:1;text-align:right;' }, h('b', {}, val)));
  cStrat.append(h('div', { style: 'margin:6px 0;' }, chip('info', L(m.st.n))));
  cStrat.append(h('div', { style: 'margin-top:4px;' },
    srow(['RCM refund-risk tolerance', 'RCM退款风险容忍'], m.st.refundMult <= 0.5 ? L(['Very low', '很低']) : m.st.refundMult >= 1.5 ? L(['High', '高']) : L(['Moderate', '中等'])),
    srow(['Target SOC buffer', '目标SOC缓冲'], m.st.socBuf + '%'),
    srow(['Energy aggressiveness', '现货进取度'], NF1.format(m.st.energy) + '×'),
    srow(['FCESS headroom policy', 'FCESS裕度策略'], NF1.format(m.st.fcess) + '×'),
    srow(['Annual cycles (degradation)', '年循环次数（衰减）'], fmtN(m.st.cycles)),
    srow(['Revenue volatility', '收益波动'], NF1.format(m.vol) + '×')));
  cStrat.append(h('div', { class: 'note' }, h('b', {}, L(['Best suited to: ', '最适用于：'])), L(suit[strat] || ['—', '—'])));
  cStrat.append(why(['Strategy is a financing decision disguised as an operating one. Annual cycles of ' + fmtN(m.st.cycles) + ' and an SOC buffer of ' + m.st.socBuf + '% set degradation, warranty exposure and refund risk simultaneously — so a highly levered structure with tight DSCR cannot run a merchant-upside strategy regardless of how attractive the spread looks. Fix the capital structure first, then choose the only strategy that is compatible with it, and write the resulting cycle limit into the optimizer mandate and the LTSA.',
    '策略本质是以运营决策形式呈现的融资决策。年循环' + fmtN(m.st.cycles) + '次与' + m.st.socBuf + '%的SOC缓冲同时决定衰减、质保敞口与退款风险 — 因此DSCR紧张的高杠杆结构无法执行"现货收益优先"策略，无论价差看起来多么有吸引力。应先确定资本结构，再选择与之相容的唯一策略，并将由此确定的循环上限写入优化商授权与长期服务协议。'],
    ['Capital structure picks the strategy', '资本结构决定策略']));
  g1.append(cStrat);
  main.append(g1);

  // ---- daily dispatch ----
  const cDisp = card(['DailyDispatchAllocationChart — illustrative 24-hour co-optimisation', '每日调度分配图 — 示例24小时协同优化'], [badge('illus'), statusBadge(true)]);
  dispatchChart(cDisp, D);
  cDisp.append(h('div', { class: 'cap' }, L(['Charge (blue, below axis) fills SOC during the midday solar trough; discharge (green) targets the evening peak; FCESS enabled MW (dashed) uses shoulder headroom within the MW envelope; SOC (violet) stays above the RCM Energy Floor (red dashed), which is highest at the start of the obligation window and declines as remaining obligation hours fall. Strategy = ' + L(m.st.n) + '.',
    '充电（蓝，轴下）在午间光伏低谷补充SOC；放电（绿）瞄准傍晚高峰；FCESS成交MW（虚线）在MW包络内利用平段裕度；SOC（紫）始终高于RCM最低保障电量（红虚线）— 其在义务时段起始最高、随剩余义务小时减少而下降。策略 = ' + L(m.st.n) + '。'])));
  cDisp.append(why(['The red dashed RCM Energy Floor is the constraint that makes WA different from an energy-only market: for those hours the battery is not free to trade, because the capacity payment is conditional on being able to deliver. Everything the optimizer earns from Energy and FCESS is earned in the space above that floor and outside that window. Two consequences: MWh above the floor is the only genuinely tradeable inventory, and a recharge constraint that prevents reaching the floor is a capacity-revenue event rather than a trading loss.',
    '红色虚线所示的RCM最低保障电量，是使西澳区别于单一电能量市场的约束：在这些小时内电池并不能自由交易，因为容量收入以具备交付能力为条件。优化商从现货与FCESS取得的全部收益，均产生于该保障线之上、该义务时段之外的空间。由此有两点结论：保障线以上的MWh才是真正可交易的库存；而妨碍达到保障线的补能约束属容量收入事件，而非交易损失。'],
    ['Only MWh above the floor is tradeable', '仅保障线以上MWh可交易']));
  cDisp.style.marginTop = '14px';
  main.append(cDisp);

  // ---- row 2: revenue stack + opportunity cost ----
  const g2 = h('div', { class: 'grid g2' });
  const cRev = card(['RevenueStackWaterfall — annual net operating revenue', '收益构成瀑布图 — 年度净运营收入'], [badge('calc'), badge('illus'), statusBadge(true)]);
  waterfall(cRev, { steps: [
    { l: ['Gross Peak RCM', '毛峰值RCM'], v: m.grossRcm / 1e6, t: 'start' },
    { l: ['− Refund', '− 退款'], v: -m.refund / 1e6, t: 'd' },
    { l: ['+ Energy discharge', '+ 现货放电'], v: m.energyGross / 1e6, t: 'd' },
    { l: ['− Charging cost', '− 充电成本'], v: -m.chargingCost / 1e6, t: 'd' },
    { l: ['+ FCESS enablement', '+ FCESS成交'], v: m.fcessEnable / 1e6, t: 'd' },
    { l: ['+ FCESS activation', '+ FCESS激活'], v: m.fcessActivation / 1e6, t: 'd' },
    { l: ['− Degradation', '− 衰减'], v: -m.degrCost / 1e6, t: 'd' },
    { l: ['− Fees', '− 费用'], v: -m.fees / 1e6, t: 'd' },
    { l: ['− Fixed opex', '− 固定运维'], v: -m.opex / 1e6, t: 'd' },
    { l: ['Total net revenue', '总净收入'], v: m.totalNet / 1e6, t: 'total' },
  ], yfmt: v => 'A$' + NF1.format(v) + 'M', zeroBase: true, h: 300 });
  cRev.append(h('div', { class: 'cap' }, L(['Fully additive — no double counting: FCESS enablement is capacity (not delivered MWh); activation energy is separate from Energy; only RCP (not BRCP) enters revenue; charging cost, efficiency loss and degradation are deducted (spec §11.2).',
    '完全可加、无重复计算：FCESS成交为容量收入（非交付MWh）；激活电量与现货分列；仅RCP（非BRCP）计入收入；充电成本、效率损失与衰减均已扣除（规范§11.2）。'])));
  cRev.append(why(['This waterfall is the number to take to a lender, because it is the only view where every deduction is explicit. Note the two largest negative bars are charging cost and fixed opex, not degradation or fees — so operating discipline matters more to EBITDA than warranty terms do. Note also that the RCM refund is deducted before anything is earned: it is a compliance penalty on the capacity payment, which is why availability protection ranks above trading performance in the optimizer mandate.',
    '本瀑布图是可提交给贷款人的数字，因为它是唯一将每项扣减明确列示的视图。请注意两项最大的负向条目是充电成本与固定运维，而非衰减或费用 — 因此运营纪律对EBITDA的影响大于质保条款。另需注意RCM退款在任何收入产生之前即被扣除：它是针对容量收入的合规性惩罚，这正是优化商授权中可用率保护优先于交易表现的原因。'],
    ['Refund is deducted before revenue', '退款先于收入扣减']));
  g2.append(cRev);

  const cOpp = card(['MarginalOpportunityCostPanel — value of 1 incremental MW', '边际机会成本面板 — 1增量MW价值'], [badge('illus'), statusBadge(true)]);
  const fcp = inp.fcessKW * 1000 / 8760;    // A$/MW/h baseline FCESS enablement
  const oppRows = [
    [['Energy discharge (peak interval)', '现货放电（高峰时段）'], (Math.max(...OPT.price24) - 25) * (inp.rte / 100), ['foregone later Energy and RCM SOC', '放弃后续现货及RCM的SOC']],
    [['Regulation Raise', '调频上调'], fcp * 1.4 * m.sc.merchScale, ['activation energy and upward headroom', '激活电量与上调裕度']],
    [['Regulation Lower', '调频下调'], fcp * 0.9 * m.sc.merchScale, ['charging headroom and SOC ceiling', '充电裕度与SOC上限']],
    [['Contingency Raise', '事故上调'], fcp * 1.1 * m.sc.merchScale, ['retained SOC and discharge capability', '保留SOC与放电能力']],
    [['Contingency Lower', '事故下调'], fcp * 0.6 * m.sc.merchScale, ['import capability and empty capacity', '进口能力与空余容量']],
    [['RCM protection (shadow)', 'RCM保护（影子价值）'], m.rcmShadowPerMWh, ['avoided refund / preserved annual payment', '避免退款/保留年度容量收入']],
  ];
  cOpp.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Use of 1 incremental MW', '1增量MW的用途'])), h('th', { class: 'num' }, L(['Expected value (A$/MW/h)', '期望价值(A$/MW/h)'])), h('th', {}, L(['Key cost / constraint', '主要成本/约束'])))),
    h('tbody', {}, oppRows.map(r => h('tr', {}, h('td', {}, L(r[0])), h('td', { class: 'num' }, 'A$' + fmtN(r[1])), h('td', {}, L(r[2]))))))));
  cOpp.append(h('div', { class: 'cap' }, L(['During the obligation window the RCM protection shadow value can exceed a moderate Energy spread — the reason the optimizer holds SOC rather than trading. Values are illustrative and per-interval; AEMO/WEMDE sets the actual enablement outcome.',
    '在义务时段内，RCM保护的影子价值可能高于中等现货价差 — 这正是优化商保留SOC而非交易的原因。数值为示意、按时段计；实际成交结果由AEMO/WEMDE决定。'])));
  cOpp.append(why(['This table is the reason an optimizer mandate needs to be written, not assumed. Every row is a competing use of the same MW, and the RCM protection shadow value is the one an energy-only trader will systematically undervalue because it appears as an avoided cost rather than a receipt. Set the mandate so that the optimizer is measured on total net revenue including refunds avoided, not on trading margin — otherwise the incentive is to sell the very headroom the capacity payment is conditional on.',
    '本表说明优化商授权必须明确书面约定、而不能默认。每一行都是同一MW的竞争性用途，而RCM保护的影子价值恰是纯电能量交易者会系统性低估的一项，因为它表现为"避免的成本"而非"收到的款项"。授权应设定为以"含已避免退款的总净收入"、而非交易毛利来考核优化商 — 否则其激励将是卖出容量收入所依赖的那部分裕度。'],
    ['Measure on net revenue, not trading margin', '考核净收入而非交易毛利']));
  g2.append(cOpp);
  main.append(g2);

  // ---- row 3: compliance/refund + strategy explanation ----
  const g3 = h('div', { class: 'grid g2' });
  const cComp = card(['RcmComplianceAndRefundPanel', 'RCM合规与退款面板'], [badge('calc'), badge('illus'), statusBadge(true)]);
  cComp.append(h('div', { class: 'kpis' },
    kpi(L(['Assigned Capacity Credits', '获配容量信用']), fmtN(m.ccMW) + '<small> MW</small>'),
    kpi(L(['Remaining obligation hours', '剩余义务小时']), (OPT.oblEnd - OPT.oblStart + 1) + '<small> h/day</small>', { text: OPT.oblStart + ':30–' + OPT.oblEnd + ':30 AWST' }),
    kpi(L(['SOC coverage', 'SOC覆盖']), NF1.format(m.socCoverHours) + '<small> h</small>', { text: L(['at buffer ' + m.st.socBuf + '%', '缓冲' + m.st.socBuf + '%时']) }),
    kpi(L(['Charge-shortfall P50 / P95', '充电不足P50/P95']), m.shortP50 + ' / ' + m.shortP95 + '<small> %</small>'),
    kpi(L(['Expected Capacity Cost Refund', '预期容量成本退款']), fmtAM(m.refund), { text: fmtN(m.refundPct) + '% ' + L(['of gross RCM', '占毛RCM']), cls: 'down' }),
    kpi(L(['Refund as % of gross RCM', '退款占毛RCM%']), fmtN(m.refundPct) + '<small> %</small>')));
  cComp.append(h('div', { class: 'note' }, L(['Key refund triggers modelled: forced-outage exposure, ESR charge shortfall, Real-Time Market offer shortfall, planned-outage treatment and dispatch-performance exposure. A Low RCM scenario reduces RCM value but never permits breaching Capacity Credits already held (spec §6.3).',
    '所建模的主要退款触发因素：强迫停运敞口、储能充电不足、实时市场报价缺口、计划停运处理及调度履约敞口。RCM低情景降低RCM价值，但绝不允许违反已持有的容量信用义务（规范§6.3）。'])));
  cComp.append(why(['SOC coverage of ' + NF1.format(m.socCoverHours) + ' h against the obligation window is the operational restatement of the duration decision — the same hours that earn Capacity Credits are the hours that must be full every day. The refund at ' + fmtN(m.refundPct) + '% of gross RCM is small in a good year and is the mechanism by which a run of outages or charge shortfalls becomes a DSCR problem. Model the P95 shortfall, not the P50, and hold the debt-service reserve against that case.',
    'SOC覆盖' + NF1.format(m.socCoverHours) + '小时相对义务时段，是时长决策在运营层面的重述 — 赚取容量信用的正是那些必须每日充满的小时。退款占毛RCM的' + fmtN(m.refundPct) + '%在好年份数额很小，却是一连串停运或充电不足演变为DSCR问题的传导机制。应按P95而非P50的不足情形建模，并据此设置还贷备用金。'],
    ['Model P95 shortfall for the DSRA', '按P95不足设置备用金']));
  g3.append(cComp);

  const cExp = card(['StrategyExplanationCard', '策略解读卡'], [badge('illus'), statusBadge(false)]);
  cExp.append(h('div', { style: 'margin:4px 0 8px;' }, chip(scn === 'HIGH' ? 'good' : scn === 'LOW' ? 'serious' : 'info', L(OPT.scnLabel[scn])), ' ', chip('info', L(m.st.n))));
  optExplanation(scn, strat, m, inp).forEach(x => cExp.append(
    h('div', { style: 'margin:8px 0;' }, h('div', { style: 'font-size:12px;font-weight:650;margin-bottom:2px;' }, L(x.h)), h('div', { style: 'font-size:12.5px;color:var(--ink2);' }, L(x.b)))));
  g3.append(cExp);
  main.append(g3);

  // ---- strategy comparison (all presets at current scenario) ----
  const cCmp = card(['StrategyComparisonTable — all presets at ' + L(OPT.scnLabel[scn]), '策略对比表 — 当前情景下全部预设'], [badge('calc'), badge('illus'), statusBadge(true)]);
  cCmp.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Strategy', '策略'])), h('th', { class: 'num' }, L(['Net RCM', '净RCM'])), h('th', { class: 'num' }, L(['Energy', '现货'])), h('th', { class: 'num' }, 'FCESS'), h('th', { class: 'num' }, L(['Total net', '总净收入'])), h('th', { class: 'num' }, L(['Cycles', '循环'])), h('th', { class: 'num' }, L(['Refund %', '退款%'])), h('th', { class: 'num' }, L(['P95 rev', 'P95收入'])), h('th', { class: 'num' }, L(['Min DSCR', '最低DSCR'])), h('th', { class: 'num' }, L(['Lev IRR', '杠杆IRR'])), h('th', { class: 'num' }, L(['Payback', '回收期'])))),
    h('tbody', {}, OPT.stratOrder.map(k => {
      const mm = optimizerModel(inp, scn, k), on = k === strat;
      const tr = h('tr', {},
        h('td', {}, h('b', {}, L(OPT.strat[k].n) + (on ? ' ★' : ''))),
        h('td', { class: 'num' }, fmtAM(mm.netRcm)), h('td', { class: 'num' }, fmtAM(mm.energyNet)), h('td', { class: 'num' }, fmtAM(mm.fcessNet)),
        h('td', { class: 'num' }, fmtAM(mm.totalNet)), h('td', { class: 'num' }, fmtN(mm.cycles)), h('td', { class: 'num' }, fmtN(mm.refundPct) + '%'),
        h('td', { class: 'num' }, fmtAM(mm.p95Rev)), h('td', { class: 'num' }, fmtX(mm.minDSCR)), h('td', { class: 'num' }, fmtIRR(mm.levIRR)), h('td', { class: 'num' }, mm.payback == null ? '—' : mm.payback + 'y'));
      if (on) tr.style.background = 'var(--accent-bg)';
      return tr;
    })))));
  cCmp.append(h('div', { class: 'cap' }, L(['Strategy changes the Energy / FCESS allocation and refund exposure while the selected RCP is held constant (spec §11.4 / §15.2 test 7). ★ = active strategy.',
    '在所选RCP不变的情况下，策略改变现货/FCESS分配与退款敞口（规范§11.4/§15.2检验7）。★ = 当前策略。'])));
  cCmp.append(why(['Compare the Min DSCR and P95 revenue columns rather than the Total net column. The strategies that maximise expected revenue also raise cycles, refund exposure and volatility — so the highest-total strategy is frequently not the highest-DSCR one, and it is DSCR that determines how much debt the asset can carry and therefore the equity return. Choose the strategy that maximises debt capacity at an acceptable P95, then treat any upside above that as a genuine option rather than as budgeted revenue.',
    '应比较"最低DSCR"与"P95收入"两列，而非"总净收入"列。使期望收入最大化的策略同时提高循环次数、退款敞口与波动性 — 因此总收入最高的策略往往并非DSCR最高者，而DSCR才决定资产可承载的债务规模、进而决定股权回报。应选择在可接受P95下使债务承载能力最大化的策略，并将其之上的任何上行视为真正的期权，而非已列入预算的收入。'],
    ['Maximise debt capacity, not revenue', '最大化债务承载而非收入']));
  cCmp.style.marginTop = '14px';
  main.append(cCmp);

  // ---- RCM scenario sensitivity (Low/Base/High at current strategy) ----
  const cSen = card(['RCM scenario sensitivity — returns at ' + L(m.st.n), 'RCM情景敏感性 — 当前策略下的回报'], [badge('calc'), badge('illus'), statusBadge(true)]);
  const scns = ['LOW', 'BASE', 'HIGH'], mm = { LOW: optimizerModel(inp, 'LOW', strat), BASE: optimizerModel(inp, 'BASE', strat), HIGH: optimizerModel(inp, 'HIGH', strat) };
  const senRows = [
    [['Expected Peak RCP (% of BRCP)', '预期峰值RCP（占BRCP%）'], s => fmtN(mm[s].sc.rcpFactor * 100) + '%'],
    [['Peak Capacity Credits (MW)', '峰值容量信用(MW)'], s => fmtN(mm[s].ccMW)],
    [['Gross RCM revenue', '毛RCM收入'], s => fmtAM(mm[s].grossRcm)],
    [['Expected refund', '预期退款'], s => fmtAM(mm[s].refund)],
    [['Net RCM revenue', '净RCM收入'], s => fmtAM(mm[s].netRcm)],
    [['RCM share of total revenue', 'RCM占总收入'], s => fmtN(mm[s].shareRcm * 100, 0) + '%'],
    [['Total net revenue (EBITDA)', '总净收入(EBITDA)'], s => fmtAM(mm[s].totalNet)],
    [['Unlevered IRR', '无杠杆IRR'], s => fmtIRR(mm[s].unlevIRR)],
    [['Levered equity IRR', '杠杆股权IRR'], s => fmtIRR(mm[s].levIRR)],
    [['Minimum DSCR', '最低DSCR'], s => fmtX(mm[s].minDSCR)],
    [['Payback (yr)', '回收期（年）'], s => mm[s].payback == null ? '—' : String(mm[s].payback)],
  ];
  cSen.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Output', '输出'])), h('th', { class: 'num' }, L(['RCM Low', 'RCM低'])), h('th', { class: 'num' }, L(['RCM Base', 'RCM基准'])), h('th', { class: 'num' }, L(['RCM High', 'RCM高'])))),
    h('tbody', {}, senRows.map(r => h('tr', {}, h('td', {}, L(r[0])),
      ...scns.map(s => { const td = h('td', { class: 'num' }, r[1](s)); if (s === scn) td.style.fontWeight = '650'; return td; })))))));
  cSen.append(h('div', { class: 'cap' }, L(['Changing the RCM scenario recomputes all project returns and the strategy explanation (spec §11.3 / §15.2 test 6). The current scenario column is bold.',
    '切换RCM情景会重算全部项目回报及策略解读（规范§11.3/§15.2检验6）。当前情景列以粗体标示。'])));
  cSen.append(why(['This is the single most decision-relevant table in the Lab: the spread between the RCM Low and RCM High columns is, in effect, the value of the capacity mechanism to this project. If the Low column fails DSCR, the project is a bet on the administered price rather than an infrastructure investment — and the answer is either a fixed-price election, a contracted floor, less debt, or not proceeding. Test the Low column before quoting the Base column to anyone.',
    '这是投资测算中与决策最相关的一张表：RCM低情景与高情景两列之间的差额，实质上就是容量机制对本项目的价值。若"低"列无法通过DSCR，则该项目是对行政价格的押注而非基础设施投资 — 对策是选择固定价格、取得合同保底、降低债务比例，或不予推进。在向任何人引用"基准"列之前，应先检验"低"列。'],
    ['If Low fails DSCR, it is a bet', '若低情景不过DSCR即为押注']));
  cSen.style.marginTop = '14px';
  main.append(cSen);

  // ---- no-double-counting validation + closing message ----
  const checks = [
    ['FCESS enabled MW is not counted as delivered MWh', 'FCESS成交MW未计为交付MWh'],
    ['FCESS activation energy is separated from Energy revenue', 'FCESS激活电量与现货收入分列'],
    ['BRCP and RCP are not double counted (only RCP enters revenue)', 'BRCP与RCP未重复计算（仅RCP计入收入）'],
    ['Gross RCM shown with expected refunds deducted', '毛RCM已扣除预期退款'],
    ['Charging cost and efficiency loss deducted from Energy', '充电成本与效率损失已从现货扣除'],
    ['Energy + Raise + Lower stay within the MW envelope', '现货+上调+下调不超过MW包络'],
    ['Not all accredited FCESS MW assumed to clear every interval', '未假设全部认证FCESS MW每时段成交'],
  ];
  const cVal = card(['No-double-counting validation (spec §11.2 / §15.2)', '防重复计算校验（规范§11.2/§15.2）'], [statusBadge(false)]);
  cVal.append(h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:4px 16px;margin-top:6px;' },
    checks.map(c => h('div', { style: 'font-size:12.5px;color:var(--ink2);' }, chip('good', '✓'), ' ', L(c)))));
  cVal.append(h('div', { class: 'reco', style: 'margin-top:12px;' }, h('b', {}, L(['Investment message: ', '投资要义：'])),
    L(['In the WEM, RCM is the asset\'s reliability and availability envelope, not a separate five-minute trading product. The optimizer co-optimises Energy and FCESS within that envelope. When RCM value is high, preserving SOC and avoiding refunds can be worth more than a moderate merchant spread; when RCM value is low, surplus MWh can be used more aggressively — but Capacity Credit obligations already held remain binding. The Lab separates RCM market assumptions from daily optimizer strategy and quantifies both.',
       '在西澳WEM中，RCM是资产的可靠性与可用性边界，而非独立的五分钟交易产品。优化商在该边界内协同优化现货与FCESS。当RCM价值高时，保留SOC并避免退款的价值可能高于中等现货价差；当RCM价值低时，富余MWh可更积极使用 — 但已持有的容量信用义务仍然有效。本模块将RCM市场假设与日常优化策略分开，并分别量化两者的贡献。'])));
  cVal.style.marginTop = '14px';
  main.append(cVal);
}

export { renderOptimizer };
