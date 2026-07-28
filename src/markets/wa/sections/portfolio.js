/* ---------------------------------------------------------------------------
   Portfolio / Fund View tab, verbatim from the prototype (lines 3884-4073).
   Every project-specific figure in this market lives on this tab.
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
import { SRC } from '../sources.js';
import { KEMERTON } from '../data/kemerton.js';
import { kemertonChargingCard } from '../sections/energy.js';
import { kemertonServicesCard } from '../sections/fcess.js';
import { kemertonDurationCard } from '../sections/duration.js';
import { kemertonNetworkCard, kemertonGfmCard } from '../sections/grid.js';

// ---------------- PORTFOLIO ----------------
function renderPortfolio(main){
  sectionHead(main, ['Portfolio / Fund View — applying the WA thesis to a screened opportunity', '组合与基金视图 — 将西澳逻辑应用于所筛选机会'],
    ['Every project-specific figure in this dashboard lives on this tab. Project Kemerton is one of several potential WEM opportunities screened against the market thesis in the preceding tabs; all other sections stay deliberately market-level so the same framework can be applied to the next opportunity without re-work. Prototype asset summary for institutional screening — not an IC-approved underwriting case.',
     '本看板所有项目层面的数据均集中于本页。Project Kemerton是依据前述各页市场逻辑所筛选的多个西澳潜在机会之一；其余章节刻意保持市场层面，以便同一框架可直接应用于下一个机会而无需重做。本页为机构筛选用的原型资产摘要 — 尚非投委会批准的承销案例。']);

  main.append(h('div', { class:'note' }, h('b', {}, L(['Screening context: ', '筛选背景：'])),
    L(['Screened from the WA opportunity set on four thesis criteria — long duration above the forward ESR requirement, a transmission-level connection, grid-forming capability, and an unfinanced position that allows a new capital structure. It is a candidate, not a commitment; the gates below determine whether it converts.',
      '按四项逻辑标准从西澳机会集合中筛选 — 时长高于前瞻ESR要求、输电级并网、具备构网能力、且尚未融资从而可设计新的资本结构。它是候选项而非承诺；下方门槛决定其能否转化。'])));

  const hero = card(['Project Kemerton — institutional screening snapshot', 'Kemerton项目 — 机构筛选快照'], [badge('dev'), badge('conf'), statusBadge(false)]);
  hero.append(h('div', { style:'display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 4px;' },
    chip('warn', L(['DEVELOPMENT / PRE-FID','开发中 / FID前'])),
    chip('info', L(['Target FCOD: 29 Sep 2028','目标FCOD：2028-09-29'])),
    chip('info', L(['132 kV transmission connection','132kV输电网连接']))));
  hero.append(h('div', { class:'kpis' },
    kpi(L(['Power / DSOC','功率 / DSOC']), '100<small> MW</small>', { text:L(['±100 MW at connection point','并网点±100MW']) }),
    kpi(L(['Modelled energy','模型能量']), '860<small> MWh</small>', { text:'8.6h installed duration' }),
    kpi(L(['Location','区位']), 'Wellesley', { text:L(['Kemerton industrial area, WA','西澳Kemerton工业区']) }),
    kpi(L(['Inverter architecture','逆变器架构']), '34 × SMA', { text:L(['Grid-forming; 156 MW installed rating','构网型；装机额定功率156MW']) }),
    kpi(L(['Project life','项目期限']), '25<small> years</small>', { text:L(['Model operation start: 2028','模型运营起始：2028年']) })));
  hero.append(h('div', { class:'story-band' }, h('b', {}, L(['Why this asset fits the WA thesis', '为何该资产符合西澳逻辑'])),
    h('p', {}, L(['Kemerton is a potentially differentiated long-duration, grid-forming capacity asset. Its bankability depends on proving deliverable duration, assigned NAQ, contractual charging economics and complete capex — not merely achieving a 100 MW nameplate connection. The 8.6-hour raw configuration exceeds the current seven-hour requirement, but has only 10 MWh of raw headroom under an 8.5-hour sensitivity before losses and degradation.',
      'Kemerton可能成为差异化的长时、构网型容量资产，但其可融资性取决于证明可交付时长、获配NAQ、合同化充电经济性及完整造价，而不仅是取得100MW铭牌并网。8.6小时原始配置高于当前7小时要求，但在8.5小时敏感性下仅有10MWh原始裕度，尚未扣除损耗与衰减。']))));
  hero.append(why(['Against the market thesis this asset is positioned correctly on the two attributes that matter most: hours above the forward requirement, and grid-forming capability at a transmission connection. Those are exactly the attributes the operating fleet does not have and cannot cheaply acquire. Everything that decides the investment is therefore evidentiary rather than strategic — deliverable duration, assigned NAQ, a documented charging arrangement and a complete cost base. The gates below are ordered so that each one, if failed, stops the case before capital is at risk.',
    '对照市场逻辑，本资产在两项最关键属性上定位正确：时长高于前瞻要求，以及在输电级并网点具备构网能力。这恰是在运机组所不具备、且难以低成本获得的属性。因此真正决定投资的是证据而非战略 — 可交付时长、获配NAQ、成文的充电安排以及完整成本基础。下方门槛按顺序排列，使任一门槛不成立即可在资本承担风险之前终止方案。'],
    ['Right position, unproven evidence', '定位正确，证据待补']));
  main.append(hero);

  main.append(h('div', { class:'warnbox', style:'margin-top:12px;' }, '⚠ ' + L([
    'Naming reconciliation: the WA connection queue / market pipeline register lists a separate third-party "Kemerton BESS" of 660 MW / 2,640 MWh developed by Trina Solar. This fund\'s Project Kemerton is modelled at 100 MW / 860 MWh (8.6h) — a discrete transmission-connected asset, not the Trina development. Confirm the two are distinct sites and entities before any external use of either figure.',
    '命名核对：西澳并网队列/市场管线登记表中列有另一第三方项目"Kemerton BESS" 660MW/2,640MWh，由天合光能开发。本基金的Project Kemerton按100MW/860MWh（8.6h）建模，为独立的输电网接入资产，并非天合项目。在对外使用任一数据前，须确认两者为不同场址与主体。'])));
  main.append(h('div', { class:'flow' }, h('span', { style:'font-size:11.5px;color:var(--muted);margin-right:4px;' }, L(['Configuration version history — only the active case may be used: ','配置版本历史 — 仅可使用当前有效方案：'])),
    ...KEMERTON.configHistory.map((x,i)=>h('span',{class:'fbox',style:i===3?'border-color:var(--s1);font-weight:650;':'opacity:.65;'},x))));

  const g = h('div', { class:'grid g2', style:'margin-top:14px;' });
  const tech = card(['Site, grid and technical configuration', '场址、并网及技术配置'], [badge('dev')]);
  const techRows = [
    [['Site','场址'], ['Lot 5 (#335) Wellesley Road North, Wellesley; strategic-industrial context near Kemerton Terminal and a 132 kV line.','Wellesley Road North 335号Lot 5；战略工业用地，靠近Kemerton Terminal及132kV线路。']],
    [['Connection','并网'], ['New 132/33 kV switchyard with three 40/60 MVA transformers.','新建132/33kV开关站及三台40/60MVA变压器。']],
    [['Power conversion','功率转换'], ['34 SMA SCS4600UP-S grid-forming inverters; SMA Hybrid Controller.','34台SMA SCS4600UP-S构网型逆变器；SMA Hybrid Controller。']],
    [['Grid rating','电网额定'], ['156 MW installed at 35°C; DSOC +100 MW and CMD −100 MW at connection point; ±48.4 MVAr.','35°C下装机额定156MW；并网点DSOC +100MW、CMD −100MW；无功±48.4MVAr。']],
    [['GPS stage','GPS阶段'], ['R0 initiation-stage submission; later R1 design and R2 commissioning evidence remain on the critical path.','处于R0启动阶段；后续R1设计及R2调试证明仍在关键路径上。']],
  ];
  tech.append(h('div', { class:'tbl-wrap' }, h('table', {}, h('tbody', {}, techRows.map(r=>h('tr',{},h('td',{},h('b',{},L(r[0]))),h('td',{},L(r[1]))))))));
  tech.append(why(['The configuration is deliberately over-rated on the AC side — 156 MW of installed inverter capacity behind a ±100 MW connection point — which is what makes grid-forming service and reactive support physically credible and gives headroom at temperature. The load-bearing risk in this table is the GPS stage: R0 is an initiation-stage submission, and R1 design plus R2 commissioning evidence remain on the critical path to both registration and Capacity Credit compliance. Treat R1 acceptance as a funding condition, not a construction task.',
    '该配置在交流侧刻意留有裕量 — ±100MW并网点背后装有156MW逆变器容量 — 这使构网服务与无功支撑在物理上可信，并在高温下保留裕度。本表中承载风险的关键项是GPS阶段：R0仅为启动阶段提交，R1设计与R2调试证明仍处于通往注册与容量信用合规的关键路径上。应将R1受理设为出资条件，而非施工任务。'],
    ['R1 acceptance is a funding condition', 'R1受理应设为出资条件']));
  g.append(tech);

  const fin = card(['Prototype financial model — selected outputs', '原型财务模型 — 主要输出'], [badge('conf'), badge('illus')]);
  fin.append(h('div', { class:'kpis' },
    kpi(L(['Total capex','总资本开支']), 'A$242.2<small>m</small>', { text:L(['Model also shows A$254.5m capex & ancillaries — reconcile','模型另列A$254.5m“capex & ancillaries” — 待核对']) }),
    kpi(L(['Equity amount','股权资金']), 'A$98.2<small>m</small>'),
    kpi(L(['Senior debt','高级债务']), 'A$101.8<small>m</small>', { text:'40% LTV · 10y · 6.5%' }),
    kpi(L(['Vendor finance','供应商融资']), 'A$54.5<small>m</small>', { text:'3y · 7.5%' }),
    kpi(L(['Year-1 EBITDA','首年EBITDA']), 'A$51.3<small>m</small>', { text:'Revenue A$57.7m' }),
    kpi(L(['Year-1 senior DSCR','首年高级债DSCR']), '2.93<small>×</small>'),
    kpi(L(['25y equity IRR from FID','FID起25年股权IRR']), '25.7<small>%</small>', { text:L(['Prototype base case','原型基准情景']) }),
    kpi(L(['25y equity NPV @12%','25年股权NPV@12%']), 'A$201.4<small>m</small>')));
  fin.append(h('div', { class:'proto' }, h('b', {}, L(['Prototype control note: ', '原型控制提示：'])),
    L(['These outputs are management-model results, not validated investment returns. The workbook contains different capex references and a Year-25 closing-cash audit exception (A$5m actual vs A$7m expected). Reconcile model architecture, capex, revenue assumptions, tax, financing and augmentation before IC use.',
      '上述结果来自管理层原型模型，并非经验证的投资回报。工作簿存在不同资本开支口径，且第25年期末现金审计项异常（实际A$5m，对比预期A$7m）。提交投委会前需核对模型结构、资本开支、收入假设、税务、融资及增容。'])));
  fin.append(why(['A 2.93× year-1 DSCR and a 25.7% equity IRR are strong enough that the useful question is not "is the return attractive" but "which unproven input is carrying it". Read this block against the revenue-evidence table below: the case is capacity-led, so it stands or falls on assigned Capacity Credits and NAQ, both still TBC. Before IC, re-run the model with the RCM Low scenario, merchant revenue at zero and the A$254.5m cost base — if it still services debt on that combination, the returns above are a genuine margin rather than an artefact of the assumptions.',
    '首年DSCR 2.93倍、股权IRR 25.7%已足够强，因此有价值的问题不是"回报是否有吸引力"，而是"哪一项未经证实的输入在支撑它"。应将本组数据与下方收入证据表对照：本方案为容量主导，因此成败取决于获配容量信用与NAQ，而两者仍待确认。提交投委会前，应以RCM低情景、市场化收入置零、并采用A$254.5m成本口径重算 — 若在该组合下仍能偿债，则上述回报是真实的安全边际，而非假设的产物。'],
    ['Ask which unproven input carries it', '追问由哪项未证实输入支撑']));
  g.append(fin); main.append(g);

  const durCap = card(['Capacity pathway — the gates between design and capacity revenue', '容量路径 — 设计与容量收入之间的门槛'], [badge('final'), badge('project')]);
  durCap.append(h('div',{class:'kpis'},
    kpi('CRC',L(['Aug 2026','2026年8月']),{text:L(['Peak and Flexible CRC notification','峰值及灵活CRC通知'])},[badge('draft')]),
    kpi('NAQ',L(['TBC','待确认']),{text:L(['Hard capacity-revenue gate','容量收入硬门槛'])},[badge('draft')]),
    kpi(L(['Assigned Capacity Credits','获配容量信用']),L(['TBC','待确认']),{text:'13 Oct 2026'},[badge('draft')]),
    kpi(L(['Price basis election','价格基准选择']),L(['Fixed or floating','固定或浮动']),{text:L(['nominated 7 Sep 2026','2026年9月7日提交'])},[badge('final')])));
  durCap.append(h('div',{class:'flow'},
    h('span',{class:'fbox'},L(['Installed 860 MWh','装机860MWh'])),h('span',{class:'farr'},'→'),
    h('span',{class:'fbox'},L(['Deliverable AC duration','交流侧可交付时长'])),h('span',{class:'farr'},'→'),
    h('span',{class:'fbox'},'CRC'),h('span',{class:'farr'},'→'),
    h('span',{class:'fbox',style:'border-color:var(--serious);font-weight:650;'},'NAQ'),h('span',{class:'farr'},'→'),
    h('span',{class:'fbox'},L(['Assigned credits × RCP','获配信用×RCP']))));
  durCap.append(h('div',{class:'warnbox'},L(['Potentially eligible for the 10-year fixed-price option, but not proven. Confirm usable SOC window, auxiliary load, AC losses, degradation, temperature derating, availability and Reserve Capacity testing methodology before relying on eligibility.','可能符合10年固定价资格，但尚未证明。在依赖该资格前，需确认可用SOC窗口、辅机、交流损耗、衰减、温度降额、可用率及容量测试方法。'])));
  durCap.append(why(['This card holds the two hard gates and both resolve on the same date. The 10-year fixed price is the single most valuable outcome available to this asset — it converts an annually re-determined administered price into a decade-long floor, which is what moves the asset into the discount rate long-term holders apply. NAQ is the gate that can remove the revenue that floor would protect. Sequence FID after 13 October 2026 so both are known, and price the fixed-price election as an asset in its own right rather than as an administrative choice.',
    '本卡片包含两道硬门槛，且两者在同一日期落定。10年固定价格是本资产可获得的最有价值结果 — 它将每年重新确定的行政价格转化为长达十年的收入底线，正是这一点使资产进入长期持有方所适用的折现率区间。而NAQ则是可能抹去该底线所保护收入的门槛。应将FID安排在2026年10月13日之后，以便两者均已明确；并将固定价选择本身作为一项资产定价，而非视作行政性选项。'],
    ['Both gates resolve 13 Oct 2026', '两道门槛均于2026-10-13落定']));
  durCap.append(sourceDrawer(SRC.esoo,['Duration accreditation and fixed-price eligibility context','时长认证及固定价资格背景']));

  const rev = card(['Revenue stack — evidence status', '收入结构 — 证据状态'], [badge('calc')]);
  const revRows = [
    [['Capacity revenue','容量收入'],['Capacity-led base case','容量主导基准'],['Depends on NAQ, credits and price election','取决于NAQ、信用及价格选择'],['CONDITIONAL','有条件']],
    [['Energy merchant','现货市场化'],['A$60/MWh gross spread assumption','A$60/MWh毛价差假设'],['Developer-reported; no signed PPA/toll','开发商披露；无已签PPA/代工协议'],['UNCONTRACTED','未签约']],
    [['FCESS','辅助服务'],['~A$1.75m/yr modelled','模型约A$1.75m/年'],['Compressed downside assumption; reconcile','压缩下行情景；待核对'],['MODELLED','模型']],
    [['NCESS / synthetic inertia','NCESS/合成惯量'],['Potential upside','潜在上行'],['No contract identified','未识别合同'],['UPSIDE','上行']]
  ];
  const revHead = h('thead',{},h('tr',{},
    h('th',{},L(['Channel','渠道'])),
    h('th',{},L(['Current case','当前情景'])),
    h('th',{},L(['Evidence','证据'])),
    h('th',{},L(['Status','状态']))));
  const revBody = h('tbody',{},revRows.map(r=>h('tr',{},
    h('td',{},h('b',{},L(r[0]))),
    h('td',{},L(r[1])),
    h('td',{},L(r[2])),
    h('td',{},chip(r[3][0]==='CONDITIONAL'?'warn':r[3][0]==='UNCONTRACTED'?'critical':'info',L(r[3]))))));
  rev.append(h('div',{class:'tbl-wrap'},h('table',{},revHead,revBody)));
  rev.append(h('div',{class:'reco'},h('b',{},L(['Underwriting rule: ','承销原则：'])),L(['Only contracted or independently validated revenues should support debt sizing. Developer assumptions and grid-forming upside remain separate.','只有已签约或独立验证收入可支持债务规模。开发商假设及构网型上行必须单列。'])));
  rev.append(why(['Exactly one of the four channels can support debt, and it is conditional. That is the honest summary of the case: this is a capacity asset with three option-like revenue lines attached. The structural implication is that the financing plan should size senior debt on assigned Capacity Credits at the applicable RCP only, and use the three remaining channels for equity return, cash sweep and reserve build. Any structure that lends against the A$60/MWh spread or the A$1.75m services line is lending against an assumption, not a revenue.',
    '四条渠道中恰好只有一条可支撑债务，且该条尚附条件。这就是方案的诚实概括：本资产是一项容量资产，另附三条具期权性质的收入线。结构性含义是：融资方案的高级债规模应仅按适用RCP下的获配容量信用确定，其余三条渠道用于股权回报、现金清扫与储备积累。任何以A$60/MWh价差或A$1.75m服务收入为基础的放贷，实为对假设放贷，而非对收入放贷。'],
    ['One financeable channel, three options', '一条可融资渠道，三条期权']));

  const cap = card(['Capex scope completeness — is anything missing, not is it cheap', '造价范围完整性 — 关注是否遗漏，而非是否便宜'], [badge('model'), badge('calc')]);
  cap.append(h('div',{class:'kpis'},
    kpi(L(['Initial cost base','初始成本基础']),'~A$242.2<small>m</small>',{text:L(['~A$282/kWh on initial MWh','按初始MWh约A$282/kWh'])},[badge('model')]),
    kpi(L(['Alternative model reference','模型另一口径']),'~A$254.5<small>m</small>',{text:L(['"capex & ancillaries" — reconcile to one number','“capex & ancillaries” — 需统一为单一数字'])},[badge('model')]),
    kpi(L(['Augmentation provision','增容预留']),'~A$77.2<small>m</small>',{text:L(['~A$371/kWh incl. augmentation','含增容约A$371/kWh'])},[badge('calc')]),
    kpi(L(['Scope status','范围状态']),L(['OPEN','待核对']),{text:L(['single reconciled cost base required','须形成单一已核对成本基础'])},[badge('draft')])));
  cap.append(h('div',{class:'note'},L(['Confirm every line is present and owned: battery/PCS, transformers, switchyard, Western Power works, Fixed Capital Charge, EPC margin, contingency, development, financing/IDC, Reserve Capacity Security, augmentation, LTSA, warranties, land and taxes. The A$242.2m and A$254.5m references must resolve to one number before IC.',
    '须确认每一成本项均已列示并有明确归属：电池/PCS、变压器、开关站、Western Power工程、固定资本费用、EPC利润、预备费、开发费、融资/建设期利息、容量保证金、增容、LTSA、质保、土地及税费。A$242.2m与A$254.5m两个口径须在提交投委会前统一为单一数字。'])));
  cap.append(why(['As an OEM-backed infrastructure fund the low unit cost is expected and is a structural advantage, so the diligence question is completeness rather than level. Two things matter. First, the internal inconsistency — A$242.2m versus A$254.5m — must resolve to one number, because a cost base that moves during diligence undermines every return metric derived from it. Second, the augmentation provision should be treated as a priced option with contractual OEM obligations attached, not as a contingency line: it is what preserves compliance when the ESR requirement next steps up.',
    '作为OEM背景的基础设施基金，较低的单位造价属预期之内且构成结构性优势，因此尽调问题在于完整性而非水平高低。有两点关键。其一，内部口径不一致 — A$242.2m与A$254.5m — 须统一为单一数字，因为在尽调过程中变动的成本基础会削弱由其推导的所有回报指标。其二，增容预留应作为已定价的期权处理并附带OEM合同义务，而非仅列为预备费：它正是ESR要求下一次抬升时维持合规的手段。'],
    ['Completeness, not level', '关注完整性而非水平']));

  const pg = h('div',{class:'grid g2',style:'margin-top:14px;'},durCap,rev,cap); main.append(pg);

  // ---- project-specific cards relocated here from the market tabs ----
  const pg2 = h('div',{class:'grid g2',style:'margin-top:14px;'},
    kemertonDurationCard(), kemertonNetworkCard(), kemertonChargingCard(), kemertonServicesCard());
  main.append(pg2);
  main.append(kemertonGfmCard());

  const sched = card(['Critical path and decision calendar', '关键路径及决策日历'], [badge('dev')]);
  const milestones = [
    ['May–Jul 2026', ['Western Power concept / draft access process and GPS R0 review', 'Western Power概念/接入草案流程及GPS R0审查'], ['OPEN','进行中']],
    ['7 Jul 2026', ['Final CRC application target in project schedule', '项目计划中的最终CRC申请目标'], ['MILESTONE','里程碑']],
    ['25 Aug 2026', ['Peak and Flexible CRC assignment expected', '预计分配峰值及灵活CRC'], ['PENDING','待定']],
    ['7 Sep 2026', ['Reserve Capacity Security and fixed-price nomination decision', '容量保证金及固定价格选择决策'], ['PENDING','待定']],
    ['13 Oct 2026', ['Capacity Credits assigned; NAQ notified; initial price information — principal value gate', '容量信用分配；NAQ通知；初始价格信息 — 核心价值门槛'], ['HARD GATE','硬门槛']],
    ['19 Nov 2026', ['Component-level Capacity Credits, category prices and RCR adequacy determination', '分项容量信用、分类价格及RCR充足性结论'], ['FINAL DISCLOSURE','最终披露']],
    ['Oct 2026', ['FID and financing target', 'FID及融资目标'], ['CONDITIONAL','有条件']],
    ['Nov 2026–Oct 2027', ['Detailed design and long-lead procurement', '详细设计及长周期设备采购'], ['PLANNED','计划中']],
    ['May 2027–Jun 2028', ['Facility procurement and construction', '设施采购及建设'], ['PLANNED','计划中']],
    ['Jun–Sep 2028', ['Commissioning, registration and CRC compliance testing', '调试、注册及CRC合规测试'], ['CRITICAL','关键']],
    ['29 Sep 2028', ['Forecast commercial operation date', '预计商业运营日'], ['TARGET','目标']],
  ];
  sched.append(h('div', { class:'tbl-wrap' }, h('table', {},
    h('thead',{},h('tr',{},h('th',{},L(['Timing','时间'])),h('th',{},L(['Milestone','里程碑'])),h('th',{},L(['IC relevance','投委会相关性'])))),
    h('tbody',{},milestones.map(m=>h('tr',{},h('td',{},h('b',{},m[0])),h('td',{},L(m[1])),h('td',{},L(m[2]))))))));
  sched.append(h('div', { class:'warnbox' }, L(['Schedule tension: the project targets 2028-29 Capacity Year economics but forecasts FCOD on 29 September 2028. Commissioning, R2 GPS registration and CRC compliance sit close to the operating deadline; contingency and contractual remedies need explicit underwriting.',
    '进度张力：项目拟获取2028-29容量年度收益，但预测FCOD为2028年9月29日。调试、R2 GPS注册及CRC合规测试紧邻运营截止日，需明确承销时间缓冲及合同救济。'])));
  sched.append(h('div',{class:'ic-summary'},h('b',{},L(['FID control — 13 October 2026 is the principal value gate','FID控制 — 2026年10月13日为核心价值门槛'])),h('div',{},L(['FID should be conditional on assigned NAQ, assigned Capacity Credits, selected capacity-price treatment, acceptable constraint exposure and a reconciled project size/cost case. Use post-NAQ repricing, resizing, delayed NTP or termination protection where required.','FID应以获配NAQ、获配容量信用、容量价格选择、可接受的约束风险及已核对规模/造价为条件。必要时采用NAQ后重新定价、调整规模、延迟NTP或终止保护。']))));
  sched.append(why(['The calendar contains the single most important structural fact in the whole case: the hard value gate (13 October 2026) falls before the FID target, which means it is possible to know NAQ, Capacity Credits and the price election before committing capital. Protect that sequence, because it is the difference between an infrastructure investment and a development bet. The second tension is at the other end — a 29 September 2028 FCOD against a 2028-29 Capacity Year leaves almost no commissioning float, so schedule protection and liquidated damages have to be sized against a missed Capacity Year, not merely a late COD.',
    '本日历包含整个方案中最重要的结构性事实：硬价值门槛（2026年10月13日）早于FID目标，意味着可以在投入资本之前知晓NAQ、容量信用与价格选择结果。应保护这一顺序，因为它正是"基础设施投资"与"开发押注"之间的分界。另一处张力在另一端 — 2028年9月29日的FCOD对应2028-29容量年度，几乎没有调试裕度，因此进度保护与违约赔偿的规模应按"错过整个容量年度"而非仅"投运延迟"来设定。'],
    ['Gate precedes FID — protect that order', '门槛早于FID — 须保护该顺序']));
  main.append(sched);

  const gates = card(['Investment Committee gates — what must be true before capital is released', '投委会门槛 — 资金拨付前必须成立的条件'], [badge('calc')]);
  const gateRows = [
    [['1 · Site & approvals','1 · 场址与审批'], ['Confirm land tenure, DA amendments, bushfire/environmental close-out and EPBC position.','确认土地权利、DA变更、山火/环境事项及EPBC结论。'], ['AMBER','黄色']],
    [['2 · Grid & GPS','2 · 并网与GPS'], ['Execute bankable Access Offer; fix scope, costs, liabilities and R0→R1→R2 evidence plan.','签署可融资接入报价；锁定范围、成本、责任及R0→R1→R2证明计划。'], ['AMBER','黄色']],
    [['3 · CRC / NAQ / RCP','3 · CRC / NAQ / RCP'], ['Require adequate Capacity Credits and NAQ; re-price after the published RCP and security requirement.','要求足够容量信用及NAQ；在公布RCP及保证金要求后重新定价。'], ['HARD GATE','硬门槛']],
    [['4 · Capex & contracts','4 · 造价与合同'], ['Reconcile A$242.2m vs A$254.5m cost bases; obtain fixed-price EPC/OEM wrap, LDs, warranties and augmentation obligations.','核对A$242.2m与A$254.5m成本口径；取得固定价EPC/OEM总包、违约赔偿、质保及增容义务。'], ['RED UNTIL FIXED','解决前红色']],
    [['5 · Revenue & optimizer','5 · 收入与优化商'], ['Stress RCM, net merchant and FCESS separately; secure acceptable floor/toll/optimizer terms and charging strategy.','分别压力测试RCM、净现货及FCESS；锁定可接受的保底/代工/优化商条款及充电策略。'], ['AMBER','黄色']],
    [['6 · Financing & model','6 · 融资与模型'], ['Validate debt sizing, DSCR, tax, cash waterfall and vendor-finance repayment; clear all audit exceptions.','验证债务规模、DSCR、税务、现金瀑布及供应商融资偿还；清除全部审计异常。'], ['RED UNTIL AUDITED','审计前红色']],
    [['7 · COD protection','7 · COD保护'], ['Build schedule float and liquidated damages around Sep-2028 commissioning and Capacity Year compliance.','围绕2028年9月调试及容量年度合规设置进度缓冲与违约赔偿。'], ['AMBER','黄色']],
  ];
  gates.append(h('div', {}, gateRows.map(r=>h('div',{class:'gate'},h('div',{class:'gname'},L(r[0])),h('div',{},L(r[1])),h('div',{class:'gstat'},chip((r[2][0].includes('RED')?'critical':r[2][0].includes('HARD')?'serious':'warn'),L(r[2])))))));
  gates.append(h('div', { class:'reco' }, h('b', {}, L(['Current preliminary stance: ', '当前初步立场：'])), L(['Strategically attractive, but remain pre-commitment until the 2026 CRC/NAQ/RCP cycle, access scope and cost-model reconciliation are complete. The strongest financing proposition is a long-duration, capacity-led asset with explicit downside protection — not a merchant-spread bet.',
    '战略上具吸引力，但在2026年CRC/NAQ/RCP结果、接入范围及成本模型核对完成前应保持承诺前状态。最具融资可行性的定位是具明确下行保护的长时容量型资产，而非押注现货价差。'])));
  gates.append(why(['Only one gate is a true hard gate — gate 3, CRC/NAQ/RCP — and it is the one that resolves on 13 October 2026 without any action by the sponsor. Everything else is amber or red-until-fixed, meaning it is work rather than risk. That distinction is what makes this a manageable case: the amber items are resourced tasks with owners and dates, the red items are internal reconciliation, and only gate 3 is genuinely outside the sponsor’s control. Structure the commitment so that capital release tracks these seven gates individually rather than a single ready-to-build test.',
    '七道门槛中仅有一道是真正的硬门槛 — 第3道CRC/NAQ/RCP — 且其将于2026年10月13日在发起人无需任何动作的情况下落定。其余各项均为黄色或"解决前红色"，即属于工作量而非风险。这一区分正是本方案可管理的原因：黄色项是有责任人与日期的资源化任务，红色项属内部核对，只有第3道门槛真正在发起人控制之外。承诺结构应使资金释放逐一对应这七道门槛，而非对应单一的开工准备检验。'],
    ['Only gate 3 is outside your control', '仅第3道门槛不受自身控制']));
  main.append(gates);

  const srcs = card(['Kemerton source pack used in this prototype', '本原型采用的Kemerton资料包'], [badge('conf')]);
  srcs.append(h('div', { class:'tbl-wrap' }, h('table', {}, h('tbody', {}, [
    ['20260716 Kemerton Financial Model.xlsx', ['Technical, capex, financing and return assumptions','技术、造价、融资及回报假设']],
    ['Kemerton GPS report — Draft 25.05.26.pdf', ['132 kV configuration, DSOC/CMD, inverter architecture and R0 status','132kV配置、DSOC/CMD、逆变器架构及R0状态']],
    ['3.1.07 Kemerton BESS Schedule.pdf', ['Access, RCM, procurement, construction, commissioning and FCOD milestones','接入、RCM、采购、建设、调试及FCOD里程碑']],
    ['CS040079 Steady State Report / Grid Input Package', ['Project-specific discharge, charging and thermal-constraint evidence','项目放电、充电及热稳定约束证据']],
    ['3.1.14 Charge and Discharge Approach', ['Developer charging, offtake, FCESS and portfolio strategy assumptions','开发商充电、售电、FCESS及组合策略假设']],
    ['ERA 2026 BRCP Final Determination', ['Official WA benchmark technology, cost stack and BRCP','官方西澳基准技术、成本堆栈及BRCP']],
    ['2026 WEM ESOO / CRC timetable / NAQ materials', ['Duration, capacity balance, fixed-price and decision-gate evidence','时长、容量平衡、固定价及决策门槛证据']],
    ['JDAP Written Submission / Planning Report', ['Site, zoning and locational context','场址、分区及区位背景']],
  ].map(r=>h('tr',{},h('td',{},h('b',{},r[0])),h('td',{},L(r[1]))))))));
  srcs.append(h('div', { class:'cap' }, L(['Snapshot prepared from files in the Project Kemerton Google Drive folder. Confidential commercial and technical assumptions should remain within the controlled prototype environment.',
    '本快照基于Google Drive的Project Kemerton文件夹资料。保密商业及技术假设应仅保留在受控原型环境中。'])));
  srcs.append(why(['Note what is present and what is absent. Present: technical studies, a schedule, a financial model and a developer commercial strategy. Absent: any executed access contract, any signed offtake, any assigned NAQ or Capacity Credit notification. That asymmetry is the case in one line — the technical package is well advanced and the commercial package does not yet exist. Diligence spend should therefore go to the missing documents rather than to re-reviewing the studies, and no material non-refundable payment should precede the first executed contract in the second list.',
    '请注意哪些材料已有、哪些尚缺。已有：技术研究、进度计划、财务模型及开发商商业策略。尚缺：任何已签署的接入合同、任何已签售电协议、任何获配NAQ或容量信用通知。这种不对称即为方案的一句话概括 — 技术资料包已相当完备，商业资料包尚不存在。因此尽调支出应投向缺失的文件，而非重复审阅已有研究；且在第二类清单中出现首份已签合同之前，不应支付任何重大不可退还款项。'],
    ['Technical package advanced, commercial absent', '技术完备，商业缺失']));
  main.append(srcs);
}

export { renderPortfolio };
