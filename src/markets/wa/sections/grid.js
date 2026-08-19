/* ---------------------------------------------------------------------------
   Grid Connection tab + the Kemerton network and GFM cards, verbatim from the
   prototype (lines 2769-3027).
   --------------------------------------------------------------------------- */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { card } from '../../../components/card.js';
import { badge, statusBadge } from '../../../components/badge.js';
import { chip } from '../../../components/chip.js';
import { why } from '../../../components/decisionLogic.js';
import { renderGeographicGridMap } from '../../../components/geographicGridMap.js';
import { buildPathwayPanel } from '../../../components/buildPathwayPanel.js';
import { buildPathwayFor } from '../../buildPathwayRegistry.js';
import { kpi } from '../../../components/metricCard.js';
import { sectionHead } from '../../../components/sectionHeader.js';
import { sourceDrawer, sourceStatusBadge } from '../../../components/sourceDrawer.js';
import { barChart, waterfall } from '../../../charts/index.js';
import { state, render } from '../state.js';
import { NF1, fmtN, fmtAk, fmtAM, fmtPct } from '../ui.js';
import { SEED } from '../data/seed.js';
import { WP_QUEUE } from '../data/wem.js';
import { KEMERTON, hasProjectData } from '../data/kemerton.js';
import { MJA2026, hasMjaData } from '../data/optimizer.js';
import { withheldCard } from '../../../components/withheld.js';
import { WA_TSP } from '../data/swisPlan.js';
import { SRC } from '../sources.js';
import { gridMapById } from '../../gridMapRegistry.js';
import { congestionFor } from '../../congestionRegistry.js';
import { renderCongestionRegister } from '../../../components/congestionPanel.js';

// ---------------- GRID CONNECTION ----------------
function renderGrid(main){
  sectionHead(main, ['Grid Connection — a chain of approvals, not a binary status', '并网 — 一连串审批与合同，而非二元状态'],
    ['Physical connection readiness, contractual access, market registration and capacity monetisation are four separate states. An Access Offer alone does not prove full Capacity Credit value.',
     '物理并网、合同接入、市场注册与容量变现是四个相互独立的状态。仅有接入报价并不代表足额容量信用价值。']);

  renderGeographicGridMap(main, gridMapById('wa-grid-map'));
  renderCongestionRegister(main, congestionFor('wa'));

  /* How a project is actually built, placed under the section that already
     promises "a chain of approvals, not a binary status" — this is that chain,
     with the instrument governing each link and who holds it. */
  const pathway = buildPathwayFor('wa');
  if (pathway){
    const panel = buildPathwayPanel(pathway, { sourceFor: (k) => SRC[k] });
    panel.style.marginTop = '14px';
    main.append(panel);
  }

  if (!state.bridge) state.bridge = { np: 200, ex: 200, crc: 196, naq: 190, rcpPct: 100 };
  const b = state.bridge, cc = Math.min(b.crc, b.naq, b.ex, b.np);
  const rcp = SEED.brcp2829 * b.rcpPct / 100;
  const g = h('div', { class: 'grid g2' });

  const c1 = card(['Nameplate → revenue bridge', '铭牌容量至收入桥'], [badge('calc'), badge('illus'), statusBadge(true)]);
  const frm = h('div', { class: 'frm' });
  const bridgeInput = (key, label) => frm.append(h('div', {}, h('label', {}, L(label)),
    h('input', { class: 'inp', type: 'number', value: b[key], onchange: e => { state.bridge[key] = Math.max(0, +e.target.value || 0); render(); } })));
  bridgeInput('np', ['Nameplate MW', '铭牌MW']);
  bridgeInput('ex', ['Export limit MW', '出口限额MW']);
  bridgeInput('crc', ['CRC MW', '认证备用容量MW']);
  bridgeInput('naq', ['NAQ MW', '网络接入容量MW']);
  bridgeInput('rcpPct', ['RCP as % of BRCP', 'RCP占BRCP百分比']);
  c1.append(frm);
  waterfall(c1, {
    steps: [
      { l: ['Nameplate MW', '铭牌MW'], v: b.np, t: 'start' },
      { l: ['Export limit', '出口限额'], v: Math.min(b.ex, b.np) - b.np, t: 'd' },
      { l: ['CRC haircut', 'CRC折减'], v: Math.min(b.crc, b.ex, b.np) - Math.min(b.ex, b.np), t: 'd' },
      { l: ['NAQ cap', 'NAQ上限'], v: cc - Math.min(b.crc, b.ex, b.np), t: 'd' },
      { l: ['Assigned Capacity Credits', '获配容量信用'], v: cc, t: 'total' },
    ], yfmt: fmtN, zeroBase: true, h: 260,
  });
  c1.append(h('div', { class: 'kpis' },
    kpi(L(['Financeable RCM revenue', '可融资RCM收入']), fmtAM(cc * rcp), { text: fmtN(cc) + ' MW × ' + fmtAk(rcp) + '/MW/yr' }, [badge('calc')]),
    kpi(L(['Annual revenue at risk vs nameplate', '相对铭牌的年收入风险敞口']), fmtAM((b.np - cc) * rcp),
      { text: L(['NAQ / nameplate = ', 'NAQ/铭牌 = ']) + fmtPct(b.np ? cc / b.np * 100 : 0, 1), cls: (b.np && cc / b.np < 0.9) ? 'down' : '' }, [badge('calc')])));
  if (b.np && cc / b.np < 0.9) c1.append(h('div', { class: 'warnbox' },
    L(['Expected Capacity Credits are below 90% of project MW — wait or re-price unless the purchase price already reflects the haircut (spec §5.2 trigger).',
       '预期容量信用低于项目MW的90% — 除非交易价格已反映该折减，否则应等待或重新定价（规范§5.2触发条件）。'])));
  c1.append(why(['This is the calculator that turns a technical status into a price. Change any input and the financeable RCM revenue moves immediately — which is the discipline the tab exists to enforce: nameplate MW is a marketing number, assigned Capacity Credits are the revenue number, and the difference is set by export limit, CRC de-rating and NAQ in that order. Run it before signing anything, and use the "revenue at risk vs nameplate" figure as the maximum development consideration you would release before NAQ is confirmed.',
    '这是将技术状态转化为价格的计算器。任一输入变动，可融资RCM收入立即变化 — 这正是本页要强制建立的纪律：铭牌MW是营销数字，获配容量信用才是收入数字，而两者之差由出口限额、CRC折减与NAQ依次决定。签署任何文件前应先运行该计算，并以"相对铭牌的年收入风险敞口"作为NAQ确认前可释放的开发对价上限。'],
    ['Nameplate is marketing; credits are revenue', '铭牌是营销，信用是收入']));
  g.append(c1);

  const c2 = card(['How a WA connection becomes investable', '西澳并网如何达到可投资状态'], [badge('official'), badge('verify')]);
  c2.append(h('div', { class:'flow' },
    h('span', { class:'fbox' }, L(['Application & access enquiry','申请及接入咨询'])), h('span', { class:'farr' }, '→'),
    h('span', { class:'fbox' }, L(['Western Power studies & offer','Western Power研究及报价'])), h('span', { class:'farr' }, '→'),
    h('span', { class:'fbox' }, L(['GPS / technical compliance','GPS / 技术合规'])), h('span', { class:'farr' }, '→'),
    h('span', { class:'fbox' }, L(['Construction & commissioning','施工及调试'])), h('span', { class:'farr' }, '→'),
    h('span', { class:'fbox' }, L(['AEMO registration, CRC & NAQ','AEMO注册、CRC及NAQ'])), h('span', { class:'farr' }, '→'),
    h('span', { class:'fbox' }, L(['Assigned Capacity Credits','获配容量信用']))));
  c2.append(h('div', { class:'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Who / reform','机构 / 改革'])), h('th', {}, L(['Investor evidence','投资者证据'])))),
    h('tbody', {},
      h('tr', {}, h('td', {}, h('b', {}, 'Western Power')), h('td', {}, L(['Executed access agreement, exact node, export/import limits, enabling works and dates','已签接入协议、具体节点、送出/受入限制、配套工程及日期']))),
      h('tr', {}, h('td', {}, h('b', {}, 'AEMO / WEM')), h('td', {}, L(['Registration, facility status, CRC, final NAQ and assigned Capacity Credits are separate evidence gates','注册、设施状态、CRC、最终NAQ及获配容量信用是不同证据关口']))),
      h('tr', {}, h('td', {}, h('b', {}, L(['Network planning','网络规划']))), h('td', {}, L(['Clean Energy Link and the 7.2 GW demand case are programme/scenario evidence—not reserved project headroom','Clean Energy Link及7.2GW负荷情景属于项目群/情景证据，并非项目预留空间']))),
      h('tr', {}, h('td', {}, h('b', {}, L(['Grid-forming reform','构网型改革']))), h('td', {}, L(['2025–26 security review proposes new >10 MVA inverter requirements; capability still needs GPS approval, service qualification and a contract','2025–26安全评估提出大于10MVA逆变器新要求；相关能力仍需GPS批准、服务资格及合同'])))))));
  c2.append(h('div', { class:'warnbox' }, L(['Delay case study: Clean Energy Link North is expected to enable up to 1,000 MW of new generation, but an offered project date remains dependent on the named tranche, construction, outage sequencing and energisation. Prevent value leakage by making each milestone a condition precedent with a long-stop date and per-MW price adjustment for NAQ shortfall.',
    '延误案例：Clean Energy Link North预计可支持最多1,000MW新增发电，但项目报价日期仍依赖具名批次、施工、停电顺序及送电。应将各里程碑设为带最终期限的先决条件，并对NAQ缺口设置按MW调价，以防价值流失。'])));
  c2.append(why(['Grid-forming technology improves voltage, frequency and system-strength performance; it does not create network capacity. Underwrite the connection right first, then carry grid-forming service value only where certification, market enablement and payment evidence exist.',
    '构网型技术可改善电压、频率及系统强度表现，但不会创造网络容量。应先承销并网权，再仅在认证、市场启用及付费证据存在时计入构网服务价值。'],
    ['Milestones and documents, not a subjective score','以里程碑及文件为准，而非主观评分']));
  g.append(c2);
  main.append(g);
  gridBody(main);
}

// Project-specific network deliverability / NAQ evidence — Portfolio tab only.
function kemertonNetworkCard(){
  // Reachable only from the gated Portfolio tab; guarded because it is exported.
  if (!hasProjectData) return withheldCard(['Network deliverability & NAQ evidence', '网络可交付性与NAQ证据']);
  const kd = card(['Network deliverability & NAQ evidence', '网络可交付性与NAQ证据'], [sourceStatusBadge(KEMERTON.sources.steady), badge('project')]);
  kd.append(h('div',{class:'warnbox'},h('b',{},L(['Hard underwriting point: ','硬性承销要点：'])),L(['CRC is not equivalent to Capacity Credits. Final NAQ and operational constraint exposure can reduce accredited revenue below nameplate or CRC.','CRC不等于容量信用。最终NAQ及运营约束可能使认证收入低于铭牌或CRC。'])));
  const kdTableHead = h('thead',{},h('tr',{},
    h('th',{},L(['Evidence','证据'])),
    h('th',{},L(['Potential consequence','潜在影响'])),
    h('th',{},L(['Status','状态']))));
  const kdTableBody = h('tbody',{},KEMERTON.grid.findings.map(r=>h('tr',{},
    h('td',{},h('b',{},L(r.e))),
    h('td',{},L(r.i)),
    h('td',{},chip(r.s[0]==='OPEN'?'serious':r.s[0]==='MONITOR'?'warn':'info',L(r.s))))));
  kd.append(h('div',{class:'tbl-wrap'},h('table',{},kdTableHead,kdTableBody)));
  kd.append(h('div',{class:'flow'},
    h('span',{class:'fbox'},L(['Connection application','并网申请'])),h('span',{class:'farr'},'→'),
    h('span',{class:'fbox'},L(['GPS / compliance','GPS/合规'])),h('span',{class:'farr'},'→'),
    h('span',{class:'fbox'},'CRC'),h('span',{class:'farr'},'→'),
    h('span',{class:'fbox',style:'border-color:var(--serious);font-weight:var(--fw-medium);'},'NAQ'),h('span',{class:'farr'},'→'),
    h('span',{class:'fbox'},L(['Assigned Capacity Credits','获配容量信用'])),h('span',{class:'farr'},'→'),
    h('span',{class:'fbox'},L(['Capacity revenue','容量收入']))));
  kd.append(h('div',{class:'note'},L(['Project studies identify potential overloads on KEM–PNJ/BSN 81 and PIC–MRR 81 under relevant contingencies, plus charging constraints during some planned-outage conditions. Western Power planning also identifies KEM–MRR constraints. These findings must feed the project NAQ, dispatch and recharge cases.','项目研究在相关事故场景下识别KEM–PNJ/BSN 81及PIC–MRR 81潜在过载，并在部分计划停运条件下识别充电约束。Western Power规划亦识别KEM–MRR约束。这些结果必须进入项目NAQ、调度及补能情景。'])));
  kd.append(why(['Two open findings sit directly on the revenue line: a discharge overload under relevant contingencies threatens NAQ and invites SCED curtailment, and a charging constraint during planned outages threatens the ability to be full before the obligation window. The second is often underestimated — capacity revenue is paid for availability at peak, so a recharge constraint is a capacity-revenue risk, not just an arbitrage inconvenience. Both must be resolved or priced before financial close, and the resolution needs to appear in the NAQ, dispatch and recharge cases, not only in a study appendix.',
    '两项未解决的结论直接落在收入线上：相关事故场景下的放电过载威胁NAQ并可能引发SCED限发；计划停运期间的充电约束则威胁在义务窗口前充满的能力。后者常被低估 — 容量收入按峰时可用率支付，因此补能约束是容量收入风险，而非仅是套利上的不便。两项均须在融资交割前解决或定价，且解决方案须体现于NAQ、调度与补能情景之中，而非仅存在于研究附录。'],
    ['Recharge limits are capacity risk', '补能约束属容量风险']));
  kd.append(sourceDrawer(KEMERTON.sources.steady, ['Project-specific thermal constraints, charging/discharging limits and NAQ relevance','项目热稳定约束、充放电限制及NAQ相关性']));
  kd.style.marginTop = '14px';
  return kd;
}

// Project-specific grid-forming value ladder — Portfolio tab only.
function kemertonGfmCard(){
  if (!hasProjectData) return withheldCard(['Grid-forming strategic-value ladder', '构网型战略价值阶梯']);
  const gfm = card(['Grid-forming strategic-value ladder', '构网型战略价值阶梯'], [sourceStatusBadge(KEMERTON.sources.gps)]);
  gfm.append(h('div',{class:'kpis'},
    kpi(L(['Grid-forming inverters','构网型逆变器']),KEMERTON.project.inverterCount+' × '+KEMERTON.project.inverterVendor,{text:KEMERTON.project.inverterModel},[badge('project')]),
    kpi(L(['Installed inverter rating','逆变器装机额定']),KEMERTON.project.installedInverterMW+'<small> MW</small>',{text:'at 35°C'},[badge('project')]),
    kpi(L(['Import / export','进/出口']),'±'+KEMERTON.project.powerMW+'<small> MW</small>',null,[badge('project')]),
    kpi(L(['Reactive capability','无功能力']),'±'+KEMERTON.project.reactiveMvar+'<small> MVAr</small>',null,[badge('project')])));
  gfm.append(h('div',{class:'status-ladder'},[
    [['Technical capability','技术能力'],['Designed / expected','已设计/预计']],
    [['GPS compliance','GPS合规'],['R0; final approval outstanding','R0；最终批准待定']],
    [['Service certification','服务认证'],['TBC','待确认']],
    [['Market enablement','市场启用'],['TBC','待确认']],
    [['Contracted value','合同价值'],['Not identified','未识别']],
    [['Base-case monetisation','基准变现'],['Limited / upside only','有限/仅上行']]
  ].map(r=>h('div',{class:'status-step'},h('b',{},L(r[0])),h('span',{},L(r[1]))))));
  gfm.append(h('div',{class:'warnbox'},L(['Do not monetise grid-forming capability automatically. Value requires GPS compliance, service certification, market enablement, operating headroom and a contract or sustainable market price.','不得自动将构网能力货币化。价值实现需GPS合规、服务认证、市场启用、运营裕度以及合同或可持续市场价格。'])));
  gfm.append(why(['Grid-forming inverters plus 156 MW of installed rating behind a 100 MW connection point is a genuine technical differentiator, and it is the right design for an islanded grid — but the ladder shows value is only realised at the top rung. Everything from certification upward is TBC, and the market-wide picture is that RoCoF is the one system-service product not yet oversupplied. So carry grid-forming as an upside case with a documented certification path and an explicit owner of the cost of getting there; do not let it justify a higher entry price today.',
    '构网型逆变器加上100MW并网点背后的156MW装机额定，是真实的技术差异化，也是孤立电网的正确设计 — 但阶梯显示价值仅在最高一级才实现。自认证起的各级均为待确认，而全市场情况是RoCoF为唯一尚未供给过剩的系统服务产品。因此应将构网能力作为具备成文认证路径、且明确指定实现成本承担方的上行情景；不应据此支撑当下更高的进入价格。'],
    ['Value only at the top rung', '价值仅在最高一级实现']));
  gfm.append(sourceDrawer(KEMERTON.sources.gps, ['Grid-forming design, DSOC/CMD, reactive capability and GPS maturity','构网型设计、DSOC/CMD、无功能力及GPS成熟度']));
  gfm.style.marginTop = '14px';
  return gfm;
}

/* The SWIS Transmission Plan register — WA's counterpart to the NEM's ISP
   appendix table, and the reason the two are worth reading side by side: the
   NEM classifies by regulatory test, WA by statutory priority declaration. */
function swisPlanCard(main){
  const T = WA_TSP;
  const c = card(['SWIS Transmission Plan — the named build behind the queue', 'SWIS输电规划 — 队列背后的具名建设'], [badge('official'), statusBadge(true)]);

  c.append(h('div', { class:'kpis' },
    kpi(L(['Phase One capacity unlocked', '第一阶段释放容量']), NF1.format(T.phaseOneGW) + '<small> GW</small>',
      { text: L([T.northGW + ' GW north + ' + T.eastGW + ' GW east', '北部' + T.northGW + 'GW + 东部' + T.eastGW + 'GW']) }, [badge('official')]),
    kpi(L(['State coal retiring by ' + T.coalRetireBy, T.coalRetireBy + '年前退役的国有煤电']), NF1.format(T.coalRetireGW) + '<small> GW</small>',
      { text: L(['what the plan is being built against', '规划所要对冲的对象']), cls: 'down' }, [badge('official')]),
    kpi(L(['Clean Energy Link North + East', 'Clean Energy Link北部+东部']), T.celCombinedGW + '<small> GW</small>',
      { text: L(['about ' + T.celJobs + ' construction jobs', '约' + T.celJobs + '个施工岗位']) }, [badge('official')]),
    kpi(L(['Clean Energy Fund', '清洁能源基金']), 'A$' + NF1.format(T.fundAbn) + '<small>bn</small>',
      { text: L(['committed ' + T.fundAnnounced, T.fundAnnounced + '承诺']) }, [badge('official')])));

  const rows = T.projects.map(p => {
    const k = T.classes.find(x => x.id === p.cls);
    return h('tr', {},
      h('td', {}, h('b', {}, L(p.n))),
      h('td', {}, L(p.corridor)),
      h('td', {}, p.operator),
      h('td', {}, chip(k.c, L(k.n))),
      h('td', {}, L(p.scope)),
      h('td', { class:'num' }, p.mw == null ? '—' : fmtN(p.mw)),
      h('td', { class:'num' }, p.year == null ? '—' : String(p.year)),
      h('td', {}, L(p.status)));
  });
  c.append(h('div', { class:'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Project', '工程'])), h('th', {}, L(['Corridor', '走廊'])), h('th', {}, L(['Delivery body', '交付主体'])),
      h('th', {}, L(['Status class', '状态类别'])), h('th', {}, L(['Scope', '范围'])),
      h('th', { class:'num' }, L(['MW enabled', '释放MW'])), h('th', { class:'num' }, L(['Target', '目标年份'])),
      h('th', {}, L(['Status', '状态'])))),
    h('tbody', {}, rows))));
  c.append(h('div', { class:'cap' }, L(['Every named element of the plan, in WA\'s own status vocabulary. "MW enabled" is programme capability — generation the corridor can carry — not Capacity Credits and not connection headroom at any node. A dash means the plan names the item without publishing a figure or a date.',
    '规划中每一具名要素，采用西澳自身的状态用语。"释放MW"是项目群能力 — 即该走廊可承载的发电量 — 既非容量信用，也非任一节点的并网可用空间。破折号表示规划已列出该项，但未公布数值或日期。'])));

  c.append(h('div', { class:'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Status class', '状态类别'])), h('th', {}, L(['What it does and does not confer', '其赋予与不赋予的内容'])))),
    h('tbody', {}, T.classes.map(k => h('tr', {}, h('td', {}, chip(k.c, L(k.n))), h('td', {}, L(k.d))))))));

  c.append(h('div', { class:'warnbox' }, L(['One project on this table is under construction. Everything else is an approvals status, an area with a capacity figure, or money. Read the class column before the MW column.',
    '本表中仅有一个项目在建。其余各项或为审批状态、或为附带容量数字的区域、或为资金。应先看状态类别列，再看MW列。'])));

  c.append(why(['Set this against the ' + fmtN(WP_QUEUE.bessTotal.dsoc) + ' MW of BESS DSOC already in the Western Power queue and the mismatch is the whole WA network story. The plan unlocks ' + NF1.format(T.phaseOneGW) + ' GW across Phase One, against roughly ' + NF1.format(WP_QUEUE.bessTotal.dsoc / 1000) + ' GW of batteries queuing and ' + NF1.format(T.coalRetireGW) + ' GW of state coal leaving by ' + T.coalRetireBy + '. The queue cannot clear on this network, which is why node selection beats scale. Two specific cautions. First, the ' + T.northEnableMW + ' MW that Clean Energy Link North enables is corridor capability, and WA converts corridor capability into revenue only through DSOC → CRC → NAQ → assigned Capacity Credits, with NAQ binding at sub-boundary level — so a project on the CEL North corridor can still be de-rated to nothing. Second, note what the status classes do here: a priority-project declaration under the State Development Act streamlines approvals but funds nothing and builds nothing, and it is the rung Clean Energy Link East sits on for a 2029 date. Only CEL North has contracts, works and a date all at once.',
    '将本表与Western Power队列中已有的' + fmtN(WP_QUEUE.bessTotal.dsoc) + 'MW储能DSOC并置，其错配即是西澳电网的全部故事。规划在第一阶段释放' + NF1.format(T.phaseOneGW) + 'GW，而排队储能约' + NF1.format(WP_QUEUE.bessTotal.dsoc / 1000) + 'GW，且' + T.coalRetireBy + '年前还有' + NF1.format(T.coalRetireGW) + 'GW国有煤电退出。队列无法在该电网上出清，这正是节点选择优于规模的原因。有两点具体警示。其一，Clean Energy Link北部所释放的' + T.northEnableMW + 'MW属走廊能力，而西澳将走廊能力转化为收入只能通过DSOC→CRC→NAQ→获配容量信用，且NAQ在子边界层面起约束作用 — 因此位于CEL北部走廊上的项目仍可能被折减至零。其二，请注意此处状态类别的作用：依《州发展法》作出的优先项目宣布可简化审批，但既不提供资金也不进行建设，而Clean Energy Link东部正是凭该等级对应2029年的日期。只有CEL北部同时具备合同、工程与日期。'],
    ['Corridor capability is not a Capacity Credit', '走廊能力不等于容量信用']));

  c.append(sourceDrawer(SRC.swisPlan, ['Phased capacity ambition, area coverage and plan structure', '分阶段容量目标、覆盖区域及规划结构']));
  c.append(sourceDrawer(SRC.celProgram, ['Clean Energy Link project scope, contracts and construction status', 'Clean Energy Link项目范围、合同及施工状态']));
  c.append(sourceDrawer(SRC.cef, ['State funding envelope and its stated purpose', '州资金额度及其既定用途']));
  c.style.marginTop = '14px';
  main.append(c);
}

function gridBody(main){
  // --- Western Power connection queue — official quarterly reality (Major Customer Connections Insights, Jun 2026) ---
  const gq = h('div', { class:'grid g2', style:'margin-top:14px;' });

  const cq1 = card(['Access Offer duration — Western Power vs customer-led (avg months)', '接入报价耗时 — Western Power与客户方（平均月数）'], [badge('official'), statusBadge(true)]);
  cq1.append(h('div', { class:'kpis' },
    kpi(L(['Western Power time','Western Power耗时']), WP_QUEUE.wpMonths + '<small> mo</small>', { text: L(['Enquiry → Planning','问询→规划']) }, [badge('official')]),
    kpi(L(['Customer-led delay','客户方延迟']), WP_QUEUE.custMonths + '<small> mo</small>', null, [badge('official')]),
    kpi(L(['Total to Access Offer','至接入报价合计']), WP_QUEUE.totalMonths + '<small> mo</small>', { text: '≈ ' + NF1.format(WP_QUEUE.totalMonths/12) + L([' yrs',' 年']) }, [badge('official')])));
  barChart(cq1, { xs: WP_QUEUE.aoDuration.map(s=>L(s.l)), mode:'stack', bw: 46, yfmt: v => NF1.format(v),
    series: [
      { name: ['Western Power time', 'WP耗时'], color: 'var(--s8)', vals: WP_QUEUE.aoDuration.map(s=>s.wp) },
      { name: ['Customer-led delay', '客户方延迟'], color: 'var(--muted)', vals: WP_QUEUE.aoDuration.map(s=>s.cust) },
    ], h: 220 });
  cq1.append(h('div', { class:'cap' }, L(['Initiation is the single largest Western Power step (7.9 months). These are historical averages under the pre-July-2024 process and exclude queue time before Enquiry — treat 27.4 months as an optimistic floor, not a schedule (spec §11.2).','启动阶段是Western Power耗时最长的单一环节（7.9个月）。此为2024年7月前流程的历史均值，且不含问询前的排队时间 — 应将27.4个月视为乐观下限而非进度承诺（规范§11.2）。'])));
  cq1.append(why(['Nine of the 27.4 months are customer-led, which is the actionable third of the timeline: model quality, response speed and data completeness are inside a sponsor’s control, and delay there compounds because each resubmission re-enters a queue. Two consequences for the COD case. Budget the full 27.4 months as a floor and add explicit queue time before Enquiry, because a 2028-29 Capacity Year target dated from today has very little slack. And write the customer-led portion into the development plan as resourced milestones with evidence dates rather than treating connection as something the network operator does to you.',
    '27.4个月中有9个月由客户方造成，这是时间线中可操作的三分之一：模型质量、响应速度与资料完整性均在发起人可控范围内，且此处的延误具有复利效应，因为每次重新提交都要重新排队。对投运方案有两点影响。其一，应将27.4个月整体视为下限，并额外计入问询前的排队时间，因为自今日起算的2028-29容量年度目标裕度极小。其二，应将客户方部分写入开发计划，作为配备资源与证据日期的里程碑，而非将并网视为电网运营商单方面施加于你的事项。'],
    ['A third of the delay is yours to fix', '三分之一延误由自身可控']));
  gq.append(cq1);

  const cq2 = card(['BESS in the Western Power queue — 44 projects, ~6.0 GW DSOC', '西澳并网队列中的BESS — 44个项目、约6.0GW DSOC'], [badge('official'), statusBadge(true)]);
  cq2.append(h('div', { class:'kpis' },
    kpi(L(['BESS projects in queue','队列中BESS项目']), fmtN(WP_QUEUE.bessTotal.n), { text: fmtN(WP_QUEUE.bessTotal.dsoc) + ' MW DSOC' }, [badge('official')]),
    kpi(L(['+ Generator & BESS','+ 发电与BESS组合']), fmtN(WP_QUEUE.genBessTotal.n), { text: fmtN(WP_QUEUE.genBessTotal.dsoc) + ' MW DSOC' }, [badge('official')]),
    kpi(L(['Total connection queue','并网队列总计']), fmtN(WP_QUEUE.queueTotal.n), { text: fmtN(WP_QUEUE.queueTotal.dsoc) + ' MW DSOC' }, [badge('official')])));
  barChart(cq2, { xs: WP_QUEUE.bessByStage.map(s=>L(s.l)), rotX:true, yfmt: fmtN, labels:true,
    series: [{ name: ['BESS projects','BESS项目数'], color: 'var(--s1)', vals: WP_QUEUE.bessByStage.map(s=>s.n) }], h: 210 });
  cq2.append(h('div', { class:'cap' }, L(['31 of 44 BESS projects (~3.9 GW) are still in Enquiry/Initiation — a large but immature and heavily oversubscribed queue relative to the ~1.4 GW operating. Only Capacity Credits, not queue MW, monetise.','44个BESS中有31个（约3.9GW）仍处于问询/启动阶段 — 队列庞大但不成熟、且相对约1.4GW在运严重超额认购。真正变现的是容量信用，而非队列MW。'])));
  cq2.append(why(['~6.0 GW of BESS DSOC in the queue against ~1.4 GW operating and a capacity market already in surplus means the queue cannot clear on economics — most of it will not be built. The useful inference is about congestion rather than competition: a queue this oversubscribed lengthens study timelines and raises the chance that network capacity at a given node is allocated before you reach Access Offer. That makes node selection and queue position a schedule risk with a revenue consequence, and it is why being early at a low-constraint node beats being large at a congested one.',
    '队列中约6.0GW的BESS DSOC，对应约1.4GW在运且容量市场已处盈余，说明该队列无法在经济性上出清 — 其中大部分不会建成。有用的推论关乎拥堵而非竞争：如此超额认购的队列会拉长研究周期，并提高在你取得接入报价前特定节点网络容量已被分配的概率。因此节点选择与排队位置构成具有收入后果的进度风险，也是"在低约束节点先行"优于"在拥堵节点做大"的原因。'],
    ['Early at a good node beats large', '好节点先行优于规模']));
  gq.append(cq2);
  main.append(gq);

  const cq3 = card(['Transmission enquiries over time — a step-change since FY22', '输电并网问询趋势 — 自FY22起阶跃上升'], [badge('official'), statusBadge(true)]);
  barChart(cq3, { xs: WP_QUEUE.enqYears, yfmt: fmtN, labels:true,
    series: [{ name: ['New enquiries (count)','新问询数量'], color: 'var(--s3)', vals: WP_QUEUE.enqCounts }], h: 220 });
  cq3.append(h('div', { class:'cap' }, L(['Enquiries jumped from ~15/yr historically to 45–68/yr since FY2022 (FY24 peak 68). This quarter alone: ' + WP_QUEUE.quarter.newEnq + ' new enquiries, ' + WP_QUEUE.quarter.newApps + ' new applications, ' + WP_QUEUE.quarter.accessOffers + ' access offers issued. Regional split of the queue: Metro 72 · North 67 · South 65 · East 40. Congestion — not demand — is now the binding constraint on connection timing.','问询量由历史约15个/年跃升至FY2022以来的45–68个/年（FY24峰值68）。仅本季度：新问询' + WP_QUEUE.quarter.newEnq + '个、新申请' + WP_QUEUE.quarter.newApps + '个、发出接入报价' + WP_QUEUE.quarter.accessOffers + '个。队列区域分布：都会72 · 北部67 · 南部65 · 东部40。当前并网时点的约束是拥堵而非需求。'])));
  cq3.append(why(['A step change from ~15 to 45–68 enquiries a year is a structural shift in the connection market, not a cycle. It means the binding constraint on a WA project’s COD has moved from finding demand to obtaining network access, and that constraint is administrative rather than economic — it does not clear when prices fall. Two responses: treat the Critical Projects Framework and connection-readiness evidence as a competitive asset worth investing in early, and price schedule risk explicitly through long-stop dates rather than assuming published averages will hold.',
    '年度问询量由约15个阶跃至45–68个，是并网市场的结构性转变而非周期波动。这意味着西澳项目投运的约束已由寻找需求转为取得网络接入，且该约束属行政性而非经济性 — 不会因价格下跌而缓解。两项应对：将关键项目框架与并网就绪证据视为值得尽早投入的竞争性资产；并通过最终截止日对进度风险明确定价，而非假设公布均值成立。'],
    ['Access, not demand, is the constraint', '约束在接入而非需求']));
  cq3.style.marginTop = '14px';
  main.append(cq3);

  swisPlanCard(main);

  // swimlane
  const lanes = [
    [['0. Sponsor readiness', '0. 业主准备'], ['Site, land rights, enquiry preparation', '场址、土地权利、问询准备'], ['Rule Participant strategy', '规则参与者策略'], ['Land / easements, concept SLD, schedule', '土地/地役权、概念单线图、进度表'], ['Entering the process before data is mature', '资料尚未成熟即进入流程']],
    [['1. Enquiry', '1. 问询'], ['Western Power identifies a feasible option', 'Western Power提出可行接入方案'], ['—', '—'], ['Enquiry response, candidate PoC', '问询回复、候选并网点'], ['Feasible option may need costly augmentation', '可行方案或依赖昂贵网络增强']],
    [['2. Initiation & studies', '2. 启动与研究'], ['Application, studies, models, Grid Input Package', '申请、潮流研究、模型、电网输入资料包'], ['GPS engagement commences', 'GPS工作启动'], ['Accepted application, study reports, issue register', '受理申请、研究报告、问题清单'], ['Poor models cause iterative delay', '模型质量差导致反复延误']],
    [['3. GPS R0 / negotiated', '3. GPS R0/协商标准'], ['WP & AEMO assess GPS and dynamic model', 'WP与AEMO评审GPS及动态模型'], ['Tripartite GPS process', '三方GPS流程'], ['R0 validation, negotiated-standard register', 'R0验证、协商标准清单'], ['Unresolved FRT / harmonics / control interaction', '故障穿越/谐波/控制交互未决']],
    [['4. Scoping & planning', '4. 方案与规划'], ['Final solution, Access Offer & contracts', '最终技术方案、接入报价及合同'], ['Candidate Facility data', '候选设施数据'], ['Access Offer, estimate basis, IWC, ETAC', '接入报价、估价基础、IWC、ETAC'], ['Cost, queue time and change orders uncertain', '造价、排队时间与变更不确定']],
    [['5. Contracts & network works', '5. 合同与电网工程'], ['Execute IWC / ETAC; design & construction', '签署IWC/ETAC；设计与施工'], ['Provisional registration, commissioning docs', '预注册、调试文件'], ['Executed contracts, approved budget, programme', '已签合同、批准预算、进度计划'], ['Network works and EPC schedules interdependent', '电网工程与EPC进度相互依赖']],
    [['6. Registration & commissioning', '6. 注册与调试'], ['Energisation and access under ETAC', '依ETAC送电与接入'], ['SCADA / metering, market testing, CTP, dispatch commissioning', 'SCADA/计量、市场测试、CTP、调度调试'], ['Registration & CTP approvals, test evidence', '注册与CTP批准、测试证据'], ['Compliance testing can delay commercial operation', '合规测试可能推迟商业运行']],
    [['7. RCM monetisation', '7. RCM变现'], ['Network Limit Advice informs NAQ', '网络限额意见输入NAQ'], ['CRC, RCS, NAQ, Capacity Credit assignment', 'CRC、RCS、NAQ、容量信用分配'], ['Published CRC, NAQ and Capacity Credits', '公布的CRC、NAQ及容量信用'], ['Connected MW may not equal financeable MW', '并网MW不等于可融资MW']],
  ];
  const c3 = card(['End-to-end authority swimlane (Western Power / AEMO)', '端到端主体泳道（Western Power / AEMO）'], [statusBadge(false)]);
  c3.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Stage', '阶段'])), h('th', {}, 'Western Power'), h('th', {}, 'AEMO'),
      h('th', {}, L(['Investor evidence', '投资者证据'])), h('th', {}, L(['Principal risk', '主要风险'])))),
    h('tbody', {}, lanes.map(r => h('tr', {}, r.map((cell, ci) => h('td', {}, ci === 0 ? h('b', {}, L(cell)) : L(cell)))))))));
  c3.append(h('div', { class: 'note' }, L(['Never convert published Western Power activity durations into a guaranteed end-to-end schedule: they generally exclude queue time, applicant response time and model resubmission (spec §11.2).',
    '不得将Western Power公布的活动工期换算为端到端保证进度：其通常不含排队时间、申请人响应时间及模型重新提交（规范§11.2）。'])));
  c3.append(why(['The swimlane exists so that payments can be tied to the right stage. Note that AEMO has no role until GPS engagement, and capacity monetisation (stage 7) sits after registration — meaning connected MW and financeable MW are separated by two more gates. Structure milestone payments against the "investor evidence" column rather than against elapsed time or developer reporting: each row names the artefact that proves the risk is actually gone, and the last row is the only one that proves revenue.',
    '泳道图的作用在于使付款与正确阶段挂钩。请注意AEMO在GPS环节之前并不介入，而容量变现（阶段7）位于注册之后 — 意味着已并网MW与可融资MW之间还相隔两道门槛。里程碑付款应对照"投资者证据"列设置，而非对照已耗时间或开发商汇报：每一行都指明了证明风险确已消除的具体文件，而只有最后一行能证明收入。'],
    ['Tie payments to evidence, not time', '付款挂钩证据而非时间']));
  c3.style.marginTop = '14px';
  main.append(c3);

  // commercial terms
  const terms = [
    [['No executed Access Offer / ETAC / IWC', '未签署接入报价/ETAC/IWC'], ['No material non-refundable development payment; exclusivity and capped reimbursable diligence only.', '不支付重大不可退还开发款；仅限排他期及有上限的可报销尽调费用。']],
    [['GPS pathway incomplete', 'GPS路径未完成'], ['Condition payment on accepted model / R0 evidence; require OEM cooperation and model warranties.', '付款以模型受理/R0证据为条件；要求OEM配合及模型保证。']],
    [['Network capex uncertain', '电网造价不确定'], ['Cap contribution, open-book evidence, contingency sharing, approval for variations above threshold.', '设定出资上限、开放账簿、分担应急费用、超阈值变更需批准。']],
    [['Queue or programme uncertainty', '排队或进度不确定'], ['Long-stop date; extension only with objective progress; monthly evidence; no automatic milestone release.', '设最终截止日；仅凭客观进展延期；按月提供证据；里程碑款不自动释放。']],
    [['Reliance on future network upgrade', '依赖未来电网升级'], ['Make the upgrade a CP; repricing / termination if timing or capacity changes.', '将升级列为先决条件；时点或容量变化时可重新定价或终止。']],
    [['NAQ below nameplate', 'NAQ低于铭牌容量'], ['Price and debt sizing on NAQ-adjusted credits; earn-out only if additional NAQ is secured.', '按NAQ调整后的容量信用定价与安排债务；额外NAQ落实后方可支付业绩对价。']],
    [['Registration / commissioning incomplete', '注册/调试未完成'], ['Retain completion holdback until SCADA, metering, CTP and Facility Registration are complete.', '在SCADA、计量、CTP及设施注册完成前保留完工保留款。']],
    [['Milestone evidence controlled by developer', '里程碑证据由开发商控制'], ['Direct investor access to Western Power, AEMO and consultants; no reliance on management summaries.', '投资者直接对接Western Power、AEMO及顾问；不依赖管理层摘要。']],
    [['Third-party network works', '第三方交付电网工程'], ['Interface matrix, schedule coordination, delay attribution, step-in and assignment rights.', '接口矩阵、进度协调、延误归责、介入权与转让权。']],
    [['Regulatory or procedure change', '监管或程序变更'], ['Change-in-law allocation; re-opener for material NAQ / GPS effects.', '法律变更风险分配；NAQ/GPS重大影响可重新议定。']],
  ];
  const c4 = card(['Connection risk → suggested commercial protections', '并网风险 → 建议商业保护条款'], [statusBadge(false)]);
  c4.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Risk', '风险'])), h('th', {}, L(['Suggested commercial response', '建议商业应对'])))),
    h('tbody', {}, terms.map(([r, resp]) => h('tr', {}, h('td', {}, h('b', {}, L(r))), h('td', {}, L(resp))))))));
  c4.append(why(['This is the tab’s operative output: connection risk in WA is not priced, it is structured. Almost none of these ten risks can be resolved by paying less — they are resolved by conditions precedent, caps, holdbacks, long-stop dates, step-in rights and direct access to Western Power and AEMO. The single most valuable line is the last one: if all milestone evidence flows through the developer, the investor has no independent way to know whether a risk has actually been removed before releasing money.',
    '这是本页的可执行输出：西澳的并网风险不是靠定价解决，而是靠结构解决。这十项风险中几乎没有一项可通过压价解决 — 应通过先决条件、费用上限、保留款、最终截止日、介入权，以及直接对接Western Power与AEMO来解决。其中价值最高的是最后一条：若全部里程碑证据均经开发商传递，投资人在付款前将无法独立判断风险是否确已消除。'],
    ['Structure the risk, don’t discount it', '以结构应对，而非压价']));
  c4.style.marginTop = '14px';
  main.append(c4);

  // cases
  const cases = [
    [['Case A — milestone sequencing discipline', '案例A — 里程碑排序纪律'],
     ['A non-binding commercial framework should sequence SPA/JVA, GPS pathway, Access Offer, RCM allocation, NAQ confirmation, financial close, R1 GPS and COD as separate gates. Lesson: never compress connection and capacity monetisation into a single ready-to-build milestone; test whether payments release before the associated risk is actually removed.',
      '非约束性商业框架应将SPA/JVA、GPS路径、接入报价、RCM分配、NAQ确认、融资交割、R1 GPS及投运设为相互独立的门槛。启示：不得将并网与容量变现压缩为单一开工准备(RTB)里程碑；须检验付款是否早于相应风险的实际消除。']],
    [['Case B — NAQ methodology change risk', '案例B — NAQ方法变更风险'],
     ['In June 2026 AEMO opened a procedure change addressing an edge case that could reduce a Facility’s NAQ even when it was not contributing to congestion. Lesson: algorithm and procedure changes affect revenue and must be monitored like a commercial contract; record the rule vintage used in underwriting.',
      '2026年6月，AEMO启动程序变更，处理一个可能在设施并未造成阻塞时仍降低其NAQ的边缘情形。启示：算法与程序变更影响收入，应像商业合同一样加以监测；须记录测算所依据的规则版本。']],
    [['Case C — Critical Projects Framework', '案例C — 关键项目框架'],
     ['Western Power’s CPF (2024) prioritises projects assessed as critical and connection-ready. Lesson: queue progress depends on customer readiness and evidence quality, not only application chronology; model the downside schedule if priority is not granted or maintained.',
      'Western Power的关键项目框架（2024年）优先处理被评估为关键且并网就绪的项目。启示：排队进度取决于客户准备度与证据质量，而非仅申请先后；须测算未获得或未维持优先地位时的下行进度。']],
    [['Case D — Clean Energy Link', '案例D — 清洁能源链路'],
     ['The North programme is expected to make ~400 MW of existing wind and ~1 GW of new renewable capacity available; East and Kwinana works expand other regions. Lesson: project value can depend on external transmission approvals and construction — make funded commitment a CP where COD depends on it.',
      '北部计划预计释放约400 MW存量风电及约1 GW新增可再生接入容量；东部及Kwinana工程扩展其他区域。启示：项目价值可能依赖外部输电审批与施工 — 当投运依赖升级时，应将其资金落实列为先决条件。']],
    [['Case E — Collie BESS execution interface', '案例E — Collie储能施工接口'],
     ['Public construction updates describe transmission-line stringing across an environmentally sensitive area and multi-party coordination. Lesson: environmental approvals, outages and construction interfaces can affect schedule even after commercial terms are agreed.',
      '公开施工通报描述了穿越环境敏感区的输电线路架设及多方协调。启示：环境审批、停电窗口与施工接口即使在商业条款敲定后仍可能影响进度。']],
  ];
  const c5 = card(['Connection casebook', '并网案例库'], [statusBadge(false)]);
  cases.forEach(([t, p]) => c5.append(h('div', { class: 'case' }, h('h4', {}, L(t)), h('p', {}, L(p)))));
  c5.append(why(['Read the five cases as five distinct failure modes, each of which has removed value from a real WA or NEM project: bad payment sequencing, a procedure change that reduced NAQ without any physical cause, loss of queue priority, dependence on an external transmission upgrade, and construction-interface risk after commercial close. None is a pricing question. Each maps to a specific protection in the table above, which is the intended use of this casebook — convert each case into a clause, then check the clause is actually in the document.',
    '这五个案例应读作五种不同的失效模式，每一种都曾在真实的西澳或NEM项目中造成价值损失：付款排序不当、程序变更在无物理原因下降低NAQ、丧失排队优先地位、依赖外部输电升级、以及商务交割后的施工接口风险。均非定价问题。每一种都对应上表中的某项具体保护，这也是本案例库的用途 — 将每个案例转化为条款，再核查该条款是否确实写入文件。'],
    ['Convert each case into a clause', '将每个案例转化为条款']));
  c5.style.marginTop = '14px';
  main.append(c5);

  /* Supplementary locational case study — fills the gap official sources leave on
     project-level NAQ outcomes (AEMO publishes assigned NAQ, not the sub-boundary
     logic).

     Every named site, DSOC figure and NAQ outcome comes from the confidential
     study, so the card is data-driven and omitted entirely when that layer is
     absent. It previously had the three project names written into this file,
     which meant a gate on the data alone still published them — the table shipped
     in the bundle whether or not it rendered. */
  if (!hasMjaData) return;
  const LC = MJA2026?.locationalCases;
  if (!LC) return;

  const cLoc = card(['Locational deliverability — why a headline transmission project is not proof of NAQ', '位置可交付性 — 标志性输电项目为何不能证明NAQ'], [badge('supp'), badge('conf'), badge('recon')]);
  cLoc.append(h('div', { class: 'note' }, L(['A headline transmission project is not proof of project-level capacity deliverability. Capacity revenue follows DSOC → CRC → NAQ → Capacity Credits; merchant revenue follows MLF + curtailment + import/export limits. These are separate locational multipliers.',
    '一个标志性输电项目并不证明项目层面的容量可交付性。容量收入沿 DSOC→CRC→NAQ→容量信用；市场化收入沿 MLF+限电+进出口限额。二者是相互独立的位置乘数。'])));
  cLoc.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Project', '项目'])), h('th', {}, L(['Region / boundary', '区域/边界'])), h('th', { class: 'num' }, L(['DSOC', 'DSOC'])), h('th', {}, L(['Network finding', '网络结论'])), h('th', {}, L(['NAQ outcome', 'NAQ结果'])))),
    h('tbody', {}, LC.rows.map(r => h('tr', {},
      h('td', {}, h('b', {}, r.project)),
      h('td', {}, L(r.boundary)),
      h('td', { class: 'num' }, r.dsoc),
      h('td', {}, L(r.finding)),
      h('td', {}, chip(r.outcomeTone, L(r.outcome)))))))));
  cLoc.append(h('div', { class: 'cap' }, L(LC.caption)));
  cLoc.append(why(LC.why, LC.whyTag));
  cLoc.style.marginTop = '14px';
  main.append(cLoc);
}

export { renderGrid, kemertonNetworkCard, kemertonGfmCard, gridBody };
