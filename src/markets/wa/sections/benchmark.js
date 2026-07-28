/* ---------------------------------------------------------------------------
   WEM vs NEM tab, verbatim from the prototype (lines 3029-3209).
   NEM data is context only and is never scored into WA.
   --------------------------------------------------------------------------- */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { card } from '../../../components/card.js';
import { badge, statusBadge } from '../../../components/badge.js';
import { chip } from '../../../components/chip.js';
import { why } from '../../../components/decisionLogic.js';
import { kpi } from '../../../components/metricCard.js';
import { sectionHead } from '../../../components/sectionHeader.js';
import { sourceDrawer } from '../../../components/sourceDrawer.js';
import { barChart } from '../../../charts/index.js';
import { NF1 } from '../ui.js';
import { SRC } from '../sources.js';
import { WP_QUEUE, WA_FIN } from '../data/wem.js';
import { NEM_SC } from '../data/nemScorecard.js';

// ---------------- BENCHMARK ----------------
function renderBenchmark(main){
  const N = NEM_SC;
  sectionHead(main, ['WEM vs NEM — market design, connection reality and what transfers (context only)', 'WEM与NEM对比 — 市场设计、并网现实与可迁移结论（仅背景参考）'],
    ['The only section in this dashboard that uses NEM data. WA and the NEM reward storage through structurally different mechanisms and run structurally different connection processes; comparing them isolates what is genuinely WA-specific. All NEM figures are held in a separate namespace and are excluded from the WA composite investment score.',
     '本看板中唯一使用NEM数据的章节。西澳与NEM通过结构性不同的机制奖励储能，并采用结构性不同的并网流程；比较两者可分离出真正属于西澳特有的因素。所有NEM数值保存在独立命名空间，不计入西澳综合投资评分。']);

  main.append(h('div', { class: 'note' }, h('b', {}, L(['Scope discipline: ', '范围纪律：'])),
    L(['NEM Connection Scorecard data (AEMO, June 2026, FY2025-26) covers Queensland, NSW/ACT, Victoria, Tasmania and South Australia only. It never enters the WA capacity balance, the WA pipeline, the merchant curve or any scoring input. It is used here for one purpose: to calibrate whether a WA observation is a WA problem or an Australia-wide one.',
      'NEM并网记分卡数据（AEMO，2026年6月，FY2025-26）仅覆盖昆州、新州/首都领地、维州、塔州及南澳。其绝不进入西澳容量平衡、西澳管线、市场化曲线或任何评分输入。此处使用仅有一个目的：校准某一西澳观察结果究竟是西澳特有问题，还是全澳共性问题。'])));

  // ---- 1. market design ----
  const rows = [
    [['Market structure', '市场结构'], ['Energy + explicit, recurring Reserve Capacity Mechanism', '电能量 + 显性且周期性的备用容量机制'], ['Energy-only wholesale market; reliability procured separately', '单一电能量市场；可靠性另行采购']],
    [['Duration monetisation', '时长变现'], ['ESR Duration Requirement in Trading Intervals, Peak/Flexible Capacity Credits, BRCP set on a 6-hour battery benchmark', 'ESR时长要求以交易时段计、峰值/灵活容量信用、BRCP以6小时电池为基准'], ['CIS revenue underwriting, NSW LTESA and state procurement — contract by contract', 'CIS收入担保、新州LTESA及州级采购 — 逐个合同确定']],
    [['Who sets the revenue floor', '谁设定收入底线'], ['A market-wide rule, re-determined annually; a 10-year fixed price can be elected for long duration', '全市场规则，每年重新确定；长时储能可选择10年固定价'], ['A tender outcome, project by project; no floor without an award', '招标结果，逐项目确定；未中标即无保底']],
    [['Interconnection', '互联'], ['Islanded (SWIS) — no import to lean on, so duration substitutes for interconnection', '孤立运行（SWIS） — 无外部输入可依赖，因此以时长替代互联'], ['Multi-region interconnected — neighbouring regions absorb some shortfall', '多区域互联 — 相邻区域可吸收部分缺口']],
    [['Network access', '网络接入'], ['Network Access Quantity binds assigned Capacity Credits at the sub-boundary level', '网络接入容量在子边界层面约束获配容量信用'], ['Congestion managed through dispatch and MLF; no equivalent credit-level cap', '通过调度与MLF管理阻塞；无等效的信用层面上限']],
    [['Competitive field', '竞争格局'], ['Highly concentrated — a state utility and one global platform hold most operating MW', '高度集中 — 国有电力与一家全球平台持有多数在运MW'], ['Fragmented — many developers, platforms and merchant sponsors', '分散 — 众多开发商、平台及市场化发起人']],
    [['Dashboard use', '看板用途'], ['Core WA score and every other tab', '西澳核心评分及其他所有页面'], ['This section only — context, never scored', '仅本节 — 背景参考，不参与评分']],
  ];
  const c = card(['Market design — the same asset earns differently in each market', '市场设计 — 同一资产在两个市场的获利方式不同'], [statusBadge(false), badge('nem')]);
  c.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Feature', '特征'])), h('th', {}, 'WA WEM / SWIS'), h('th', {}, L(['NEM', 'NEM'])))),
    h('tbody', {}, rows.map(r => h('tr', {}, h('td', {}, h('b', {}, L(r[0]))), h('td', {}, L(r[1])), h('td', {}, L(r[2]))))))));
  c.append(why(['The rows that matter to a capital allocator are "who sets the revenue floor" and "network access". In the NEM a floor exists only if you win a tender, so development is a bidding strategy; in WA a floor exists as a rule every year, so development is a compliance-and-deliverability strategy. That difference explains why WA rewards duration and node quality while the NEM rewards tender positioning — and why a NEM track record does not transfer directly. It also explains the pricing asymmetry: WA capacity revenue is more predictable, but NAQ can remove it administratively in a way no NEM mechanism does.',
    '对资本配置者而言最关键的两行是"谁设定收入底线"与"网络接入"。在NEM，只有中标才存在保底，因此开发本质是投标策略；在西澳，保底以规则形式每年存在，因此开发本质是合规与可交付性策略。这一差异解释了为何西澳奖励时长与节点质量、而NEM奖励投标定位 — 也解释了为何NEM的业绩记录无法直接迁移。同时也解释了定价上的不对称：西澳容量收入可预测性更高，但NAQ可以行政方式将其削减，这在NEM并无对应机制。'],
    ['WA: compliance · NEM: bidding', '西澳看合规·NEM看投标']));
  main.append(c);

  // ---- 2. NEM delivery scale, FY2026 ----
  const cScale = card(['NEM delivery in FY2026 — the scale a WA sponsor is not competing in', 'NEM在FY2026的交付规模 — 西澳发起人并不参与的量级'], [badge('official'), badge('nem')]);
  cScale.append(h('div', { class: 'kpis' },
    kpi(L(['Full output achieved (FY26)', '达到满出力（FY26）']), N.fyOutput.fullGW + '<small> GW</small>',
      { text: N.fyOutput.fullGWh + ' GWh · ' + N.fyOutput.fullProjects + L([' projects', '个项目']) + ' · +' + N.fyOutput.fullYoYPct + '% yoy' }, [badge('official')]),
    kpi(L(['Incremental output incl. partial', '含部分出力的新增出力']), N.fyOutput.incrementalGW + '<small> GW</small>',
      { text: L(['of which partial ' + N.fyOutput.partialGW + ' GW still commissioning', '其中' + N.fyOutput.partialGW + 'GW仍在调试']) }, [badge('official')]),
    kpi(L(['Approved at Application (FY26)', '申请阶段获批（FY26）']), N.fyApproved.appGW + '<small> GW</small>',
      { text: N.fyApproved.appGWh + ' GWh · ' + N.fyApproved.appProjects + L([' projects', '个项目']) + ' · ' + N.fyTrend.appVsLastFYPct + '% yoy' }, [badge('official')]),
    kpi(L(['Approved at Registration (FY26)', '注册阶段获批（FY26）']), N.fyApproved.regGW + '<small> GW</small>',
      { text: N.fyApproved.regGWh + ' GWh · ' + N.fyApproved.regProjects + L([' projects', '个项目']) + ' · ' + N.fyTrend.regVsLastFYPct + '% yoy' }, [badge('official')]),
    kpi(L(['Projects cancelled this quarter', '本季度取消项目']), String(N.quarter.cancelled), { text: L(['of ' + N.totalProjects + ' tracked projects', '在' + N.totalProjects + '个跟踪项目中']) }, [badge('official')])));
  barChart(cScale, {
    xs: [L(['Approved at Application', '申请获批']), L(['Approved at Registration', '注册获批']), L(['Full output achieved', '达到满出力'])],
    bw: 62, yfmt: v => NF1.format(v) + ' GW', labels: true,
    series: [{ name: ['FY2026 GW', 'FY2026 GW'], color: 'var(--s6)', vals: [N.fyApproved.appGW, N.fyApproved.regGW, N.fyOutput.fullGW] }], h: 230,
  });
  cScale.append(h('div', { class: 'cap' }, L(['This quarter alone the NEM approved ' + N.quarter.appProjects + ' projects (' + N.quarter.appGW + ' GW), of which ' + N.quarter.appBatteryGW + ' GW battery and ' + N.quarter.appSolarBGW + ' GW solar-plus-battery; ' + N.quarter.fullProjects + ' projects reached full output including ' + N.quarter.fullBatteryGW + ' GW of battery.',
    '仅本季度NEM即批准' + N.quarter.appProjects + '个项目（' + N.quarter.appGW + 'GW），其中电池' + N.quarter.appBatteryGW + 'GW、光储混合' + N.quarter.appSolarBGW + 'GW；' + N.quarter.fullProjects + '个项目达到满出力，含电池' + N.quarter.fullBatteryGW + 'GW。'])));
  cScale.append(why(['Full output more than doubled year-on-year while approvals at both Application and Registration fell 10% and 18% — delivery is catching up with a pipeline approved in earlier years, not accelerating into a new one. Two things transfer to WA. First, the ' + N.fyOutput.fullGW + ' GW commissioned in a single NEM year is roughly six times WA’s entire operating fleet, which is why equipment pricing, EPC availability and OEM attention are set nationally rather than by WA demand. Second, the approval slowdown is the leading indicator: if it persists, the 2029+ competitive cohort thins nationally, which matters for WA capex and contractor pricing even though the capacity market does not connect.',
    '满出力同比增长逾一倍，而申请与注册两阶段获批量分别下降10%与18% — 交付是在追赶前几年获批的管线，而非加速进入新一轮。有两点可迁移至西澳。其一，NEM单一年度投运的' + N.fyOutput.fullGW + 'GW约为西澳全部在运机组的六倍，这正是设备价格、EPC可获得性与OEM关注度由全国而非西澳需求决定的原因。其二，获批放缓是领先指标：若持续，2029年之后的全国竞争批次将变薄，这对西澳的造价与承包商报价具有影响，尽管两地容量市场并不连通。'],
    ['National scale sets your cost base', '全国规模决定成本基础']));
  cScale.append(sourceDrawer(SRC.nemsc, ['FY2026 approvals, registrations, full output and quarterly movements','FY2026获批、注册、满出力及季度变动']));
  cScale.style.marginTop = '14px';
  main.append(cScale);

  // ---- 3. technology mix of the NEM pipeline ----
  const g = h('div', { class: 'grid g2', style: 'margin-top:14px;' });
  const cMix = card(['NEM pipeline technology mix — batteries dominate there too', 'NEM管线技术构成 — 电池同样占主导'], [badge('official'), badge('nem')]);
  cMix.append(h('div', { class: 'kpis' },
    kpi(L(['Total NEM pipeline', 'NEM管线总量']), N.pipelineGW + '<small> GW</small>', { text: L(['connection projects underway ' + N.underwayGW + ' GW', '在办并网项目' + N.underwayGW + 'GW']) }, [badge('official')]),
    kpi(L(['Standalone battery share', '独立电池占比']), N.pipelineMix[0].pct + '<small>%</small>', { text: L(['plus ' + N.pipelineMix[1].pct + '% solar-plus-battery hybrid', '另有' + N.pipelineMix[1].pct + '%光储混合']) }, [badge('official')])));
  barChart(cMix, {
    xs: N.pipelineMix.map(m => L(m.n)), bw: 52, rotX: true, yfmt: v => v + '%', labels: true,
    series: [{ name: ['Share of 75 GW pipeline', '占75GW管线比例'], color: 'var(--s6)', vals: N.pipelineMix.map(m => m.pct) }], h: 240,
  });
  cMix.append(why(['Batteries plus hybrids are 71% of a 75 GW national pipeline — so the WA observation that "everyone is building storage" is not a WA phenomenon and cannot be arbitraged by moving east. What differs is what that storage is paid for: the NEM cohort must win a tender or run merchant, while the WA cohort competes for an administered credit. The transferable conclusion is a cost one — national battery demand of this scale sets module, PCS and EPC pricing, so a WA project should assume competitive procurement but not competitive scarcity rents.',
    '电池加混合项目占75GW全国管线的71% — 因此"人人都在建储能"并非西澳独有现象，也无法通过东移来套利。差异在于该储能获得何种报酬：NEM批次须中标或纯市场化运行，而西澳批次争夺行政化信用。可迁移的结论属成本层面 — 如此规模的全国电池需求决定模块、PCS与EPC价格，因此西澳项目应假设采购具备竞争性，但不应假设存在稀缺租金。'],
    ['Storage build is national, rents are local', '建设全国化，租金地方化']));
  g.append(cMix);

  // ---- 4. stage duration: WA vs NEM ----
  const cDur = card(['Connection stage duration — WA access process vs NEM connection process', '并网阶段耗时 — 西澳接入流程与NEM并网流程'], [badge('official'), badge('nem')]);
  const nemTotal = N.stages.filter(s => s.dur).reduce((a, s) => a + s.dur, 0);
  barChart(cDur, {
    xs: [L(['NEM appl.', 'NEM申请']), L(['NEM reg.', 'NEM注册']), L(['NEM comm.', 'NEM调试']),
         L(['WA · WP', '西澳·WP']), L(['WA · cust.', '西澳·客户'])],
    bw: 46, yfmt: v => NF1.format(v), labels: true,
    series: [{ name: ['Typical months', '典型月数'], color: 'var(--s3)',
      vals: [N.stages[0].dur, N.stages[2].dur, N.stages[3].dur, WP_QUEUE.wpMonths, WP_QUEUE.custMonths] }], h: 240,
  });
  cDur.append(h('div', { class: 'cmp' },
    h('div', {}, h('div', { class:'cmp-h' }, L(['NEM — AEMO-involved stages combined', 'NEM — AEMO参与阶段合计'])),
      h('div', { class:'cmp-v' }, NF1.format(nemTotal) + L([' months', ' 个月'])),
      h('div', { class:'cmp-s' }, L(['Application ' + N.stages[0].dur + ' + Registration ' + N.stages[2].dur + ' + Commissioning ' + N.stages[3].dur + ' months (typical average, excludes proponent implementation)', '申请' + N.stages[0].dur + ' + 注册' + N.stages[2].dur + ' + 调试' + N.stages[3].dur + '个月（典型均值，不含业主实施阶段）']))),
    h('div', {}, h('div', { class:'cmp-h' }, L(['WA — Enquiry to Access Offer', '西澳 — 问询至接入报价'])),
      h('div', { class:'cmp-v' }, NF1.format(WP_QUEUE.totalMonths) + L([' months', ' 个月'])),
      h('div', { class:'cmp-s' }, L([WP_QUEUE.wpMonths + ' months Western Power + ' + WP_QUEUE.custMonths + ' months customer-led, before construction, registration or commissioning', 'Western Power ' + WP_QUEUE.wpMonths + '个月 + 客户方' + WP_QUEUE.custMonths + '个月，且尚未包含建设、注册与调试'])))));
  cDur.append(h('div', { class: 'cap' }, L(['Not a like-for-like comparison: the WA figure measures getting to a contractable Access Offer, the NEM figures measure AEMO-assessed stages within an already-contracted connection. They are shown together to compare where time is consumed, not to rank the two operators.',
    '并非同口径比较：西澳数值衡量取得可签署接入报价的耗时，NEM数值衡量在已签约并网内部由AEMO评估的各阶段耗时。并列展示的目的是比较时间消耗在何处，而非对两个运营方排序。'])));
  cDur.append(why(['The comparison is directional rather than exact, and the direction is the point: in the NEM the long pole is technical assessment (Application, 8.6 months typical, with 53% of in-progress projects sitting in that stage for more than a year); in WA the long pole is reaching a contractable access position at all. For a WA underwriting case that means schedule protection should be concentrated on the access and study phase, not on commissioning — and it means a NEM-experienced sponsor will systematically underestimate the WA front end unless the plan explicitly resources it.',
    '该比较是方向性而非精确的，而方向本身即是重点：在NEM，最长环节是技术评估（申请阶段典型8.6个月，且在办项目中53%在该阶段停留超过一年）；在西澳，最长环节是取得可签署的接入地位本身。对西澳承销方案而言，这意味着进度保护应集中于接入与研究阶段，而非调试阶段 — 同时也意味着具NEM经验的发起人若未在计划中明确配置资源，将系统性低估西澳的前端环节。'],
    ['Protect the front end in WA', '西澳应保护前端环节']));
  g.append(cDur);
  main.append(g);

  // ---- 5. funnel and attrition ----
  const cFun = card(['NEM connection funnel — conversion, attrition and where projects stall', 'NEM并网漏斗 — 转化率、流失与项目滞留环节'], [badge('official'), badge('nem')]);
  cFun.append(h('div', { class: 'kpis' },
    kpi(L(['Enquiry stage', '问询阶段']), N.enquiryGW + '<small> GW</small>',
      { text: N.enquiryProjects + L([' projects · ', '个项目 · ']) + N.enquiryConvLo + '–' + N.enquiryConvHi + L(['% convert within 3 years', '%在三年内转化']) }, [badge('official')]),
    kpi(L(['In-progress connection projects', '在办并网项目']), N.underwayGW + '<small> GW</small>', { text: L(['across ' + N.stages.reduce((a,s)=>a+s.projects,0) + ' project entries', '共' + N.stages.reduce((a,s)=>a+s.projects,0) + '个项目条目']) }, [badge('official')])));
  cFun.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Stage', '阶段'])), h('th', { class: 'num' }, L(['GW in stage', '阶段内GW'])), h('th', { class: 'num' }, L(['Share', '占比'])),
      h('th', { class: 'num' }, L(['Conversion out', '转出比例'])), h('th', { class: 'num' }, L(['Typical months', '典型月数'])), h('th', { class: 'num' }, L(['> 12 months in stage', '停留超12个月'])))),
    h('tbody', {}, N.stages.map(s => h('tr', {},
      h('td', {}, h('b', {}, L(s.n))), h('td', { class: 'num' }, s.gw + ' GW'), h('td', { class: 'num' }, NF1.format(s.pct) + '%'),
      h('td', { class: 'num' }, s.conv), h('td', { class: 'num' }, s.dur ? NF1.format(s.dur) : '—'),
      h('td', { class: 'num' }, s.over12mPct + '%')))))));
  barChart(cFun, {
    xs: N.stages.map(s => L(s.n)), bw: 52, rotX: true, yfmt: v => v + ' GW', labels: true,
    series: [{ name: ['GW in stage', '阶段内GW'], color: 'var(--s6)', vals: N.stages.map(s => s.gw) }], h: 230,
  });
  cFun.append(why(['The attrition is concentrated at the two front gates and essentially disappears afterwards: enquiries convert at only ' + N.enquiryConvLo + '–' + N.enquiryConvHi + '%, applications at about 90%, and every stage after that at 99–100%. Read across to WA and the same shape holds — 31 of 44 BESS projects in the Western Power queue sit at Enquiry or Initiation. So the single most valuable diligence question about any competing project, in either market, is which gate it has actually cleared. Past the application gate, a competitor is close to certain to arrive; before it, most will not.',
    '流失集中于前两道门槛，其后基本消失：问询阶段仅' + N.enquiryConvLo + '–' + N.enquiryConvHi + '%转化，申请阶段约90%，其后各阶段均为99–100%。对照西澳，形态一致 — Western Power队列中44个BESS有31个处于问询或启动阶段。因此在任一市场中，关于竞争项目最有价值的单一尽调问题是：它实际通过了哪一道门槛。越过申请门槛后，竞争者几乎必然投运；在此之前，多数不会。'],
    ['All attrition is at the first two gates', '流失全部集中于前两道门槛']));
  cFun.append(sourceDrawer(SRC.nemsc, ['Stage volumes, conversion rates, stage durations and time-in-stage distribution','阶段容量、转化率、阶段耗时及停留时间分布']));
  cFun.style.marginTop = '14px';
  main.append(cFun);

  // ---- 6. system strength ----
  const cSS = card(['System strength outcomes in the NEM — the cost the WA process handles differently', 'NEM系统强度结果 — 西澳流程以不同方式处理的成本项'], [badge('official'), badge('nem')]);
  cSS.append(h('div', { class: 'kpis' },
    kpi(L(['Projects in scope (12 months)', '范围内项目（12个月）']), String(N.sysStrength.inScope), { text: L(['of those achieving application approval', '在获得申请批准的项目中']) }, [badge('official')]),
    kpi(L(['No system-strength impact', '无系统强度影响']), N.sysStrength.noImpactPct + '<small>%</small>', null, [badge('official')]),
    kpi(L(['Elected to pay for services', '选择付费购买服务']), N.sysStrength.payPct + '<small>%</small>', null, [badge('official')]),
    kpi(L(['Implemented a remediation scheme', '实施补救方案']), N.sysStrength.remediatePct + '<small>%</small>', null, [badge('official')])));
  barChart(cSS, {
    xs: [L(['No impact', '无影响']), L(['Pay for services', '付费购买服务']), L(['Self-remediate', '自行补救'])],
    bw: 58, yfmt: v => v + '%', labels: true,
    series: [{ name: ['Share of in-scope projects', '范围内项目占比'], color: 'var(--s3)', vals: [N.sysStrength.noImpactPct, N.sysStrength.payPct, N.sysStrength.remediatePct] }], h: 220,
  });
  cSS.append(why(['22% of in-scope NEM projects had to either pay for system-strength services or build a remediation scheme — a real, quantified connection cost that only appears after application assessment. WA has no identical mechanism, but it has the functional equivalent in negotiated GPS standards, network works contributions and NAQ outcomes, and those are less transparently benchmarked. The transferable discipline: carry an explicit line item and contingency for post-assessment network remediation, because roughly one project in five discovers one, and grid-forming capability is what reduces the odds of being in that fifth.',
    'NEM范围内项目中有22%须付费购买系统强度服务或建设补救方案 — 这是一项真实、可量化的并网成本，且仅在申请评估后才显现。西澳并无完全相同的机制，但在协商性GPS标准、电网工程出资与NAQ结果中存在功能等价物，且其基准透明度更低。可迁移的纪律：应为评估后的电网补救单列成本项与预备费，因为约每五个项目就有一个会遇到；而构网型能力正是降低落入该五分之一概率的手段。'],
    ['Budget for post-assessment remediation', '为评估后补救预留预算']));
  cSS.style.marginTop = '14px';
  main.append(cSS);

  // ---- 7. merchant-debt precedents (relocated here: NEM evidence belongs in this section) ----
  const cMerch = card(['Merchant BESS debt — precedents exist, but only in the NEM', '市场化BESS融资 — 先例存在，但仅在NEM'], [badge('official'), badge('nem')]);
  cMerch.append(h('div', { class:'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Project','项目'])), h('th', {}, L(['Size','规模'])), h('th', {}, L(['Market','市场'])), h('th', {}, L(['Merchant treatment','市场化处理'])))),
    h('tbody', {}, WA_FIN.merchant.map(d => h('tr', {}, h('td', {}, h('b', {}, d.p)), h('td', {}, d.size), h('td', {}, d.mkt), h('td', {}, L(d.note))))))));
  cMerch.append(h('div', { class:'cmp' },
    h('div', {}, h('div', { class:'cmp-h' }, L(['NEM — merchant debt', 'NEM — 市场化融资'])),
      h('div', { class:'cmp-v' }, L(['Precedent exists', '已有先例'])),
      h('div', { class:'cmp-s' }, L(['Including near-pure-merchant structures, and partial-merchant tranches supported by a minimum-revenue guarantee', '包括接近纯市场化的结构，以及由保底收入担保支持的部分市场化份额']))),
    h('div', {}, h('div', { class:'cmp-h' }, L(['WA WEM — merchant debt', '西澳WEM — 市场化融资'])),
      h('div', { class:'cmp-v' }, L(['No precedent', '尚无先例'])),
      h('div', { class:'cmp-s' }, L(['All five financed WA projects sat inside a portfolio or platform facility with a contracted revenue anchor', '五个已融资的西澳项目全部位于组合或平台融资之内，并带有合同化收入锚'])))));
  cMerch.append(why(['This is the most directly bankable use of NEM evidence, and it cuts both ways. It proves lenders will write merchant BESS debt in Australia, so the concept is not the obstacle — but every precedent is in a deeper, interconnected, energy-only market with far more price history, and neither structure was standalone-merchant on the whole facility. Use it to open the conversation and to benchmark the merchant tranche size, not to argue that WA supports the same leverage. In WA the substitute for a merchant track record is the RCM contract structure: assigned credits, a fixed-price election or a toll.',
    '这是NEM证据在可融资性上最直接的用途，且具双面性。它证明澳洲的贷款人确实会为市场化BESS提供债务，因此概念本身并非障碍 — 但所有先例均位于更深、互联、单一电能量的市场，价格历史远为丰富，且没有一例是整笔融资全部市场化。应以其开启对话并对标市场化份额的规模，而非据以论证西澳可支撑同等杠杆。在西澳，替代市场化业绩记录的是RCM合同结构：获配信用、固定价选择权或代工协议。'],
    ['Opens the conversation, not the leverage', '可开启对话，但非提高杠杆的依据']));
  cMerch.style.marginTop = '14px';
  main.append(cMerch);

  // ---- 8. what transfers ----
  const cT = card(['What transfers from the NEM to a WA decision — and what does not', '哪些NEM结论可迁移至西澳决策 — 哪些不能'], [badge('calc'), badge('nem')]);
  const tr = [
    [['Transfers', '可迁移'], ['Equipment and EPC pricing', '设备与EPC价格'], ['A 75 GW national pipeline that is 71% battery sets module, PCS, transformer and contractor pricing for WA too.', '71%为电池的75GW全国管线，同样决定西澳的模块、PCS、变压器与承包商价格。']],
    [['Transfers', '可迁移'], ['Attrition structure', '流失结构'], ['Conversion is ' + N.enquiryConvLo + '–' + N.enquiryConvHi + '% out of enquiry and ~90% out of application in the NEM; the WA queue shows the same front-loaded shape, so probability-weight competitors by gate cleared.', 'NEM问询阶段转化' + N.enquiryConvLo + '–' + N.enquiryConvHi + '%、申请阶段约90%；西澳队列呈现同样的前端集中形态，因此应按已通过门槛对竞争者概率加权。']],
    [['Transfers', '可迁移'], ['Merchant-debt precedent', '市场化融资先例'], ['Australia’s only near-pure-merchant BESS debt precedents are eastern; they show what banks will accept in principle, and what they charge for it.', '澳洲唯一接近纯市场化的BESS融资先例均在东部；其显示银行原则上可接受的条件及相应代价。']],
    [['Does not transfer', '不可迁移'], ['Revenue structure', '收入结构'], ['NEM revenue rests on tender awards and energy-only volatility. WA revenue rests on an annually re-determined administered capacity price with a duration requirement attached.', 'NEM收入依赖招标中标与单一电能量市场波动；西澳收入依赖每年重新确定的行政容量价格及附带的时长要求。']],
    [['Does not transfer', '不可迁移'], ['Duration economics', '时长经济性'], ['In the NEM added hours are worth what a tender or the spot market pays for them. In WA they are worth avoiding a Capacity Credit de-rating — a different, larger and more durable number.', '在NEM，增加小时的价值取决于招标或现货市场支付的金额；在西澳，其价值在于避免容量信用折减 — 这是一个不同的、更大且更持久的数字。']],
    [['Does not transfer', '不可迁移'], ['Locational risk mechanics', '位置风险机制'], ['NEM congestion shows up through dispatch and MLF. WA congestion shows up as a NAQ cap on assigned credits at a sub-boundary — an administrative haircut with no NEM analogue.', 'NEM的阻塞通过调度与MLF体现；西澳的阻塞体现为子边界上对获配信用的NAQ上限 — 一种在NEM无对应物的行政性折减。']],
    [['Does not transfer', '不可迁移'], ['Competitive dynamics', '竞争格局'], ['A fragmented NEM developer field versus a WA market where a state utility and one global platform hold most operating MW.', 'NEM开发商格局分散；而西澳市场中国有电力与一家全球平台持有多数在运MW。']],
  ];
  cT.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Verdict', '结论'])), h('th', {}, L(['Dimension', '维度'])), h('th', {}, L(['Reasoning', '理由'])))),
    h('tbody', {}, tr.map(r => h('tr', {},
      h('td', {}, r[0][0] === 'Transfers' ? chip('good', L(r[0])) : chip('critical', L(r[0]))),
      h('td', {}, h('b', {}, L(r[1]))), h('td', {}, L(r[2]))))))));
  cT.append(h('div', { class: 'reco' }, h('b', {}, L(['Comparison conclusion: ', '对比结论：'])),
    L(['Use the NEM to calibrate cost, delivery capability and attrition — the supply side. Do not use it to calibrate revenue, duration value or locational risk — the demand side. A NEM comparable tells you what a project should cost and how likely a competitor is to arrive; only the WA rules tell you what it will be paid.',
      '应以NEM校准成本、交付能力与流失率 — 即供给侧。不应以其校准收入、时长价值或位置风险 — 即需求侧。NEM可比项目能说明项目应有的成本水平，以及竞争者投运的可能性；但只有西澳规则能说明它将获得多少报酬。'])));
  cT.append(why(['This split is the operative rule for the whole section, and it also defines the boundary the dashboard enforces in code: NEM figures inform supply-side assumptions in the Investment Lab (capex, contractor availability, competitor probability) and are excluded from every revenue and scoring input. Applying it the other way round is the specific error this section exists to prevent — importing eastern spread volatility or tender pricing into a WA case would misstate both the level and the shape of revenue.',
    '这一划分是本节的可执行规则，同时界定了看板在代码层面强制执行的边界：NEM数值可用于投资测算中的供给侧假设（造价、承包商可获得性、竞争者概率），并被排除于所有收入与评分输入之外。反向套用正是本节要防止的具体错误 — 将东部价差波动或招标价格引入西澳方案，会同时误判收入的水平与形态。'],
    ['Supply side yes, revenue side no', '供给侧可用，收入侧不可用']));
  cT.style.marginTop = '14px';
  main.append(cT);
}

export { renderBenchmark };
