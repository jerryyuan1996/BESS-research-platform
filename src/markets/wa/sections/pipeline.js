/* ---------------------------------------------------------------------------
   Project Pipeline tab, verbatim from the prototype (lines 2633-2767).
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
import { render } from '../state.js';
import { fmtN } from '../ui.js';
import { SRC } from '../sources.js';
import { SEED } from '../data/seed.js';
import { WA_FLEET, WA_PIPELINE, WA_FIN } from '../data/wem.js';
import { WEM_MARKET } from '../data/wemMarket.js';
import { stageProb } from '../lib/scores.js';
import { renderWaQueueCoverage } from '../officialPlanningSection.js';

// ---------------- PIPELINE ----------------
function renderPipeline(main){
  sectionHead(main, ['Project Pipeline — real WA register, probability-weighted (MW and MWh separated)', '项目管线 — 西澳真实项目登记，概率加权（MW与MWh分列）'],
    ['Populated with the real WA BESS universe (operating fleet + committed + development-stage) and its financing status. Stage probabilities are the spec §10.2 defaults and editable below; the probability-weighted chart recomputes immediately. Source: Infra fund WA BESS pack, 2026-07.',
     '现已载入西澳真实BESS项目集（在运+已承诺+开发阶段）及其融资状态。阶段概率为规范§10.2默认值、可在下方编辑；概率加权图表即时重算。来源：基础设施基金西澳资料，2026-07。']);

  renderWaQueueCoverage(main);

  const mwTxt = v => v==null ? 'n.d.' : (Number.isInteger(v) ? fmtN(v) : String(v));
  const CIS = WEM_MARKET.cis;

  // --- Operating fleet summary (deck slide 3) ---
  const synMW = 100+225+500, neoMW = 219+341;
  const cf = card(['Operating fleet — ~1.4 GW installed, ownership concentrated in Synergy & Neoen', '在运机组 — 约1.4GW，所有权集中于Synergy与Neoen'], [badge('official'), statusBadge(true)]);
  cf.append(h('div', { class:'kpis' },
    kpi(L(['Operating power','在运功率']), fmtN(WA_FLEET.totalMW) + '<small> MW</small>', { text: L(['5 large BESS as at 2026','2026年5座大型BESS']) }, [badge('official')]),
    kpi(L(['Operating energy','在运能量']), fmtN(WA_FLEET.totalMWh) + '<small> MWh</small>', null, [badge('official')]),
    kpi(L(['Synergy (State) share','Synergy占比']), '~' + Math.round(synMW/WA_FLEET.totalMW*100) + '%', { text: 'Kwinana 1/2 + Collie' }, [badge('calc')]),
    kpi(L(['Neoen share','Neoen占比']), '~' + Math.round(neoMW/WA_FLEET.totalMW*100) + '%', { text: 'Collie St.1 + St.2' }, [badge('calc')])));
  cf.append(h('div', { class:'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Asset','资产'])), h('th', {}, L(['Owner','业主'])), h('th', { class:'num' }, 'MW'), h('th', { class:'num' }, 'MWh'), h('th', { class:'num' }, L(['Duration','时长'])), h('th', { class:'num' }, L(['COD','投运'])))),
    h('tbody', {}, WA_FLEET.rows.map(r => h('tr', {}, h('td', {}, h('b', {}, r.n)), h('td', {}, r.owner), h('td', { class:'num' }, fmtN(r.mw)), h('td', { class:'num' }, fmtN(r.mwh)), h('td', { class:'num' }, r.h + 'h'), h('td', { class:'num' }, r.cod)))))));
  cf.append(h('div', { class:'cap' }, L(['Ownership is highly concentrated: state-owned Synergy plus Neoen (Brookfield) hold the great majority of operating MW. A new entrant competes against balance-sheet and state incumbents, not a fragmented merchant field. (Deck slide 3; Kwinana 2 shown at its 225 MW / 900 MWh commissioning spec — the financing register lists a later 245 MW / 980 MWh figure.)','所有权高度集中：州属Synergy与Neoen（Brookfield）持有绝大多数在运MW。新进入者面对的是表内与国有存量玩家，而非分散的市场化竞争。（幻灯片3；Kwinana 2按225MW/900MWh投运口径列示 — 融资登记表另列245MW/980MWh。）'])));
  cf.append(why(['Every operating asset in this table is 2–4.8 h, and all of it sits with a state utility or a global platform. That is the competitive set a new project is measured against, and it has two features worth exploiting: none of it is long-duration, and none of it needs a market return to justify staying in the credit queue. So do not plan to out-compete it on price or on short-duration merchant capability. Plan to hold hours it does not have, at a node it does not occupy, with a contract structure it does not need.',
    '本表中所有在运资产均为2–4.8小时，且全部归属国有电力或全球平台。这就是新项目所面对的竞争集合，其中有两项特征值得利用：其中没有长时资产，且其留在信用队列中并不需要市场化回报作为理由。因此不应计划在价格或短时市场化能力上取胜，而应计划持有其不具备的小时数、占据其未占据的节点、并采用其无需的合同结构。'],
    ['Nothing operating is long-duration', '在运资产中无长时项目']));
  main.append(cf);

  // --- COD pipeline charts (real projects) ---
  const years = [2026, 2027, 2028, 2029];
  const inY = y => WA_PIPELINE.filter(p => p.cod === y);
  const npMW  = years.map(y => inY(y).reduce((a,p)=>a + (p.mw||0), 0));
  const pwMW  = years.map(y => inY(y).reduce((a,p)=>a + (p.mw||0) * stageProb(p.st), 0));
  const npMWh = years.map(y => inY(y).reduce((a,p)=>a + (p.mwh||0), 0));
  const pwMWh = years.map(y => inY(y).reduce((a,p)=>a + (p.mwh||0) * stageProb(p.st), 0));

  const g = h('div', { class: 'grid g2', style:'margin-top:14px;' });
  const c1 = card(['COD pipeline by year — MW', '按投运年度的管线 — MW'], [badge('illus'), statusBadge(true)]);
  barChart(c1, { xs: years.map(String), yfmt: fmtN, series: [
      { name: ['Nameplate MW', '铭牌MW'], color: 'var(--s1)', vals: npMW },
      { name: ['Probability-weighted MW', '概率加权MW'], color: 'var(--s2)', vals: pwMW.map(v => Math.round(v)) },
    ], h: 250 });
  c1.append(why(['Only the probability-weighted bars belong in a capacity balance; the nameplate bars are the announcement. The gap between them is the market’s delivery discount, and it is widest in the years dominated by development-stage projects. For a project targeting a 2028-29 Capacity Year, the relevant number is how much weighted MW lands in the same cycle — because that, not the announced total, is what competes for the same credits and sets the supply ratio that prices them.',
    '只有概率加权的柱状值才应进入容量平衡；铭牌柱状值只是公告。两者之差即市场的交付折扣，且在开发阶段项目主导的年份差距最大。对以2028-29容量年度为目标的项目而言，相关数字是同一周期内落地的加权MW — 因为竞争同一批信用、并决定为其定价的供给比的，是这一数值而非公告总量。'],
    ['Weighted MW competes, nameplate does not', '竞争者是加权MW而非铭牌值']));
  g.append(c1);
  const c2 = card(['COD pipeline by year — MWh', '按投运年度的管线 — MWh'], [badge('illus'), statusBadge(true)]);
  barChart(c2, { xs: years.map(String), yfmt: fmtN, series: [
      { name: ['Nameplate MWh', '铭牌MWh'], color: 'var(--s1)', vals: npMWh },
      { name: ['Probability-weighted MWh', '概率加权MWh'], color: 'var(--s2)', vals: pwMWh.map(v => Math.round(v)) },
    ], h: 250 });
  c2.append(h('div', { class: 'cap' }, L(['Development-stage MWh dominates 2028 — the market is voting for MWh. Watch dilution of FCESS and merchant spreads as each cohort arrives (spec §10.3).',
    '开发阶段MWh主导2028年 — 市场正在投票选择MWh。关注每批项目投运对FCESS及现货价差的稀释（规范§10.3）。'])));
  c2.append(why(['Compare the two charts rather than reading either alone. Nameplate-to-probability-weighted is the gap between what is announced and what a lender would count, and it is widest in 2028–29 — precisely the COD window. Meanwhile MWh grows faster than MW, so the incoming cohort is longer-duration than the operating fleet: the duration advantage is real but time-limited. Use the probability-weighted MWh line, not nameplate, when setting the merchant assumption, and treat the 2028 MWh spike as the year your own spread assumption is most likely to be wrong.',
    '应对比两张图表，而非单看其一。铭牌与概率加权之间的差距即"已公布"与"贷款人会认可"之间的差额，且在2028–29年最大 — 恰为投运窗口期。同时MWh增速快于MW，说明新进入批次的时长长于在运机组：时长优势真实存在但存在时间窗口。设定市场化假设时应使用概率加权MWh线而非铭牌值，并将2028年MWh高峰视为自身价差假设最可能失准的年份。'],
    ['MWh grows faster than MW', 'MWh增速快于MW']));
  g.append(c2);
  main.append(g);

  // --- stage probabilities + financing-status split ---
  const g2 = h('div', { class:'grid g2', style:'margin-top:14px;' });
  const c3 = card(['Stage probabilities (editable defaults, spec §10.2)', '阶段概率（可编辑默认值，规范§10.2）'], [statusBadge(false)]);
  c3.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Stage', '阶段'])), h('th', { class: 'num' }, L(['On-time probability %', '按时概率%'])))),
    h('tbody', {}, SEED.stages.map((s, i) => h('tr', {},
      h('td', {}, L(s.n)),
      h('td', { class: 'num' }, h('input', { class: 'inp', style: 'width:72px;text-align:right;', type: 'number', min: 0, max: 100, value: s.p,
        onchange: e => { SEED.stages[i].p = Math.max(0, Math.min(100, +e.target.value || 0)); render(); } }))))))));
  c3.append(h('div', { class: 'note' }, L(['Avoid double-counting alternative configurations of the same project (spec §10.2). Kondinin & Killawarra battery MW are undisclosed and estimated.', '须避免对同一项目的不同备选配置重复计数（规范§10.2）。Kondinin与Killawarra电池MW未披露、为估算。'])));
  c3.append(why(['These probabilities are the single most contestable input on the tab, which is why they are exposed as editable fields rather than buried. Move them and watch the probability-weighted charts above respond — that sensitivity is the deliverable, not the default values. The defensible discipline is to set them from observed WA conversion behaviour (financial close and CIS award history) and then apply them consistently to your own project as well as to competitors: a probability set that flatters your COD while discounting everyone else’s produces a capacity balance that cannot be defended in credit.',
    '这些概率是本页最具争议的输入，因此以可编辑字段呈现而非隐藏于内部。调整后可观察上方概率加权图表的响应 — 该敏感性本身才是交付成果，而非默认值。可辩护的做法是依据西澳已观察的转化行为（融资交割与CIS中标历史）设定，并对自身项目与竞争者一致适用：若一组概率对自身投运宽松、对他人严格，所得容量平衡在信贷环节无法辩护。'],
    ['Apply the same probabilities to yourself', '同一概率须适用于自身']));
  g2.append(c3);

  const catMW = { A:0, B:0, C:0 }; WA_PIPELINE.forEach(p => { catMW[p.cat] += (p.mw||0); });
  const cS = card(['Pipeline by financing status — MW', '按融资状态的管线 — MW'], [badge('official'), statusBadge(true)]);
  barChart(cS, { xs: [L(['A · Financed','A · 已融资']), L(['B · Balance-sheet / govt','B · 表内/政府']), L(['C · Unfinanced','C · 未融资'])], bw: 60, yfmt: fmtN, labels: true,
    series: [{ name: ['MW','MW'], color: 'var(--s1)', vals: [catMW.A, catMW.B, catMW.C] }], h: 250 });
  cS.append(h('div', { class:'cap' }, L(['Category C (unfinanced) is the addressable universe for new capital — but it is also where MW/MWh and offtake are least certain. A = financed / debt approved; B = balance-sheet or government funded.','C类（未融资）是新资本可切入的范围 — 但也是MW/MWh与offtake最不确定之处。A=已融资/已批债；B=表内或政府出资。'])));
  cS.append(why(['This chart is the market map for deployable capital: categories A and B are already spoken for, so category C is both the opportunity set and the competitor set. Two readings follow. Because unfinanced MW is large, capacity credits in the COD window will be contested by projects that may never fund — so probability-weight competitors by financing status, not by announcement. And because every financed WA project to date carried a contracted anchor, a category-C project without one is unlikely to convert: financing status is the most reliable single predictor of which announced MW actually arrives.',
    '本图是可部署资本的市场地图：A类与B类已有归属，因此C类既是机会集合，也是竞争集合。由此得出两点解读。其一，未融资MW规模较大，投运窗口内的容量信用将被可能永远无法融资的项目争夺 — 因此竞争者应按融资状态而非公布状态进行概率加权。其二，迄今所有获得融资的西澳项目均带合同化收入锚，因此不具备该锚的C类项目难以转化：融资状态是判断哪些已公布MW真正会投运的最可靠单一指标。'],
    ['Weight competitors by financing status', '按融资状态加权竞争者']));
  g2.append(cS);
  main.append(g2);

  // --- Real project register ---
  const catChip = c => c==='A'?chip('good','A'):c==='B'?chip('info','B'):chip('warn','C');
  const c4 = card(['WA BESS project register — real projects with financing lens', '西澳BESS项目登记表 — 真实项目与融资视角'], [badge('official'), badge('illus'), statusBadge(true)]);
  c4.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Project', '项目'])), h('th', {}, L(['Owner / developer','业主/开发商'])), h('th', { class: 'num' }, 'MW'), h('th', { class: 'num' }, 'MWh'),
      h('th', { class:'num' }, L(['COD','投运'])), h('th', {}, L(['Stage', '阶段'])), h('th', { class:'num' }, L(['Prob.','概率'])),
      h('th', {}, L(['Financing status','融资状态'])), h('th', {}, L(['Revenue lock / offtake','收入锁定'])))),
    h('tbody', {}, WA_PIPELINE.map(p => { const st = SEED.stages.find(s=>s.id===p.st);
      return h('tr', {}, h('td', {}, catChip(p.cat), ' ', h('b', {}, p.n)), h('td', {}, p.owner),
        h('td', { class:'num' }, mwTxt(p.mw) + (p.est?'*':'')), h('td', { class:'num' }, mwTxt(p.mwh) + (p.est?'*':'')),
        h('td', { class:'num' }, String(p.cod)), h('td', {}, L(st.n)), h('td', { class:'num' }, st.p+'%'),
        h('td', {}, L(p.fin)), h('td', {}, L(p.rev))); })))));
  c4.append(h('div', { class:'cap' }, L(['A = financed / debt approved · B = balance-sheet or government funded · C = unfinanced. * MW/MWh undisclosed, estimated. Third-party developments are listed by developer; naming similarities between separate projects are not evidence of a shared site or entity. Source: Infra fund WA financing review 2026-07.','A=已融资/已批债 · B=表内或政府出资 · C=未融资。*MW/MWh未披露、为估算。第三方项目按开发商列示；不同项目名称相近并不表示同一场址或主体。来源：基础设施基金西澳融资评审 2026-07。'])));
  c4.append(why(['Read the register by the two right-hand columns. "Financing status" plus "revenue lock" together predict delivery better than stage or size: every project with bank debt also has a contracted revenue anchor, and every project with neither is a development option rather than committed capacity. Use this to build the competitor set for the capacity balance — count A and B at high probability, discount C heavily, and re-check after each financial close announcement rather than each project announcement.',
    '登记表应按右侧两列解读。"融资状态"加"收入锁定"共同对交付的预测力强于阶段或规模：所有取得银行债务的项目均具备合同化收入锚，而两者皆无的项目实为开发期权而非已承诺容量。可据此构建容量平衡的竞争者集合 — A、B类按高概率计入，C类大幅折减，并在每次融资交割公告（而非项目公告）后复核。'],
    ['Financing + offtake predicts delivery', '融资加售电预测交付']));
  main.append(c4);

  // --- Financing casebook ---
  const cFin = card(['WA BESS financing casebook — how deals actually closed', '西澳BESS融资案例库 — 交易如何落地'], [badge('official'), statusBadge(true)]);
  cFin.append(h('div', { class:'cap' }, L(['Category A: five WA projects with bank debt approved or closed. Almost all sit inside portfolio / platform facilities, not standalone project finance — and every one carries a contracted revenue anchor (NCESS, CIS or RCM).','A类：五个已获批或已关闭银行债务的西澳项目。几乎全部位于组合/平台融资之内，而非独立项目融资 — 且每个都带有合同化收入锚（NCESS、CIS或RCM）。'])));
  cFin.append(h('div', { class:'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Project','项目'])), h('th', {}, L(['Size / developer','规模/开发商'])), h('th', {}, L(['Structure & timing','结构与时间'])), h('th', {}, L(['Banks','银行'])), h('th', {}, L(['Revenue lock','收入锁定'])))),
    h('tbody', {}, WA_FIN.financed.map(d => h('tr', {},
      h('td', {}, h('b', {}, d.p)), h('td', {}, d.size + ' · ' + d.dev),
      h('td', {}, L(d.struct), h('div', { class:'cap', style:'margin:3px 0 0;' }, d.when)),
      h('td', { style:'font-size:11px;line-height:1.4;' }, d.banks), h('td', {}, L(d.rev))))))));
  cFin.append(h('div', { class:'reco' }, h('b', {}, L(['Bankability takeaway: ','可融资性结论：'])),
    L(['Every WA project that reached bank debt did so inside a portfolio or platform facility and with a contracted revenue anchor (an AEMO capacity contract, CIS or RCM credits). No WA precedent exists for standalone, fully merchant BESS debt. For a first-time mid-cap sponsor, banks will likely require higher equity, completion support, cost-overrun cover, a debt-service reserve (DSRA) and a cash sweep. Merchant-debt precedents do exist in Australia, but only in the eastern NEM.',
      '所有取得银行债务的西澳项目，均在组合或平台融资之内、且带有合同化收入锚（AEMO容量合约、CIS或RCM信用）。西澳尚无独立、完全市场化的BESS融资先例。对首次进入的中型发起人，银行更可能要求较高股权比例、完工担保、成本超支兜底、还贷备用金(DSRA)与现金清扫。澳洲确实存在市场化融资先例，但仅见于东部NEM。'])));
  cFin.append(why(['Five for five: every WA project that reached bank debt sits inside a portfolio or platform facility and carries a contracted revenue anchor. Neither condition is available to a first-time single-asset sponsor, so the realistic financing plan is not "match these terms" — it is "substitute for what the portfolio provides". In practice that means more equity, completion support, cost-overrun cover, a debt-service reserve and a cash sweep, plus a contracted floor to stand in for the portfolio diversification the incumbents rely on. Budget for those terms at the outset rather than discovering them in credit.',
    '五个案例无一例外：所有取得银行债务的西澳项目均位于组合或平台融资之内，且带有合同化收入锚。首次进入的单资产发起人不具备这两项条件，因此现实的融资计划不是"对标这些条款"，而是"替代组合所提供的功能"。实践上意味着更高股权比例、完工担保、成本超支兜底、还贷备用金与现金清扫，并以合同保底替代存量玩家所依赖的组合分散化。应在起步阶段即预留这些条款，而非在信贷环节才发现。'],
    ['Substitute for portfolio diversification', '需替代组合分散化功能']));
  cFin.style.marginTop = '14px';
  main.append(cFin);

  // CIS award context — the contracted-anchor route into the WA pipeline
  const cCis = card(['Capacity Investment Scheme — the contracted route into the WA pipeline', '容量投资计划 — 进入西澳管线的合同化路径'], [badge('official'), badge('public')]);
  cCis.append(h('div', { class:'kpis' },
    kpi(L(['Tender 2 storage awarded (WA)','第2轮西澳储能中标']), fmtN(CIS.tender2MW) + '<small> MW</small>', { text: fmtN(CIS.tender2MWh) + ' MWh · ' + CIS.tender2When }, [badge('official')]),
    kpi(L(['Tenders 5 & 6 projects (WA)','第5、6轮西澳项目数']), fmtN(CIS.t56Projects), { text: CIS.t56When }, [badge('official')]),
    kpi(L(['Tenders 5 & 6 generation','第5、6轮发电']), CIS.t56GenGW + '<small> GW</small>', null, [badge('official')]),
    kpi(L(['Tenders 5 & 6 standalone storage','第5、6轮独立储能']), CIS.t56StorageGWh + '<small> GWh</small>', { text: fmtN(CIS.t6BessMW) + ' MW / ' + fmtN(CIS.t6BessMWh) + ' MWh' }, [badge('official')]),
    kpi(L(['Investment supported','带动投资']), '~A$' + CIS.t56InvestAbn + '<small>bn</small>', { text: '~' + fmtN(CIS.t56Jobs) + L([' construction jobs',' 个建设岗位']) }, [badge('official')])));
  cCis.append(why(['CIS is the mechanism that converts a category-C project into a category-A one, which makes the award calendar a competitive-intelligence calendar. Two decision uses. Each award adds committed MWh to your COD window, so an award round is a trigger to re-run the capacity balance and the merchant assumption. And because the awarded projects average well above four hours, CIS is actively financing the long-duration cohort you will compete with — the duration advantage is being contracted away round by round, which argues for entering the current cycle rather than the next.',
    'CIS是将C类项目转化为A类项目的机制，因此中标日历实质是竞争情报日历。两项决策用途：其一，每一批中标都会向你的投运窗口新增已承诺MWh，因此中标公布是重算容量平衡与市场化假设的触发条件。其二，由于中标项目平均时长远超四小时，CIS正在为你未来的长时竞争者提供融资 — 时长优势正被逐轮以合同方式消耗，这构成进入当前周期而非下一周期的理由。'],
    ['Award rounds contract away your edge', '中标轮次消耗你的优势']));
  cCis.append(sourceDrawer(SRC.cis, ['WA tender outcomes, awarded capacity and contracted revenue floors','西澳招标结果、中标容量及合同化收入底线']));
  cCis.style.marginTop = '14px';
  main.append(cCis);
}

export { renderPipeline };
