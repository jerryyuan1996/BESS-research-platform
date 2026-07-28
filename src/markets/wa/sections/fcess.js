/* ---------------------------------------------------------------------------
   FCESS tab + the Kemerton services card, verbatim from the prototype
   (lines 2350-2455).
   --------------------------------------------------------------------------- */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { card } from '../../../components/card.js';
import { badge, statusBadge } from '../../../components/badge.js';
import { why } from '../../../components/decisionLogic.js';
import { kpi } from '../../../components/metricCard.js';
import { sectionHead } from '../../../components/sectionHeader.js';
import { sourceDrawer } from '../../../components/sourceDrawer.js';
import { lineChart, barChart, waterfall } from '../../../charts/index.js';
import { NF1, fmtN, fmtAM } from '../ui.js';
import { T } from '../text.js';
import { SEED } from '../data/seed.js';
import { KEMERTON } from '../data/kemerton.js';

// ---------------- FCESS ----------------
function renderFcess(main){
  sectionHead(main, ['FCESS — volume share is rising, value is falling', '辅助服务 — 成交份额上升、价值下降'],
    ['Official Q1 2026: battery FCESS revenue ~A$4.2M (from A$8.6M in Q1 2025) while total enablement cost fell ~75% to ~A$5.1M. FCESS is becoming a low-margin, highly competitive service.',
     '官方2026Q1：电池FCESS收入约A$4.2M（2025Q1为A$8.6M），成交总成本同比下降约75%至约A$5.1M。FCESS正成为低毛利、高竞争的服务。']);
  main.append(h('div', { class: 'warnbox' }, '⚠ ' + L(['Batteries are gaining volume share but losing price. Do not interpret higher enablement share as higher project revenue.',
    '电池成交份额上升，但价格与总收入下降；不得将更高的成交份额直接等同于更高项目收益。'])));
  main.append(h('div', { class: 'kpis' },
    kpi(L(['Battery FCESS revenue', '电池FCESS收入']), fmtAM(4.2e6), { text: '−51% ' + L(T.yoy), cls: 'down' }, [badge('official'), statusBadge(true)]),
    kpi(L(['Total enablement cost', '成交总成本']), fmtAM(5.1e6), { text: '−75% ' + L(T.yoy), cls: 'down' }, [badge('official')]),
    kpi(L(['Battery share of contingency + regulation volume', '电池在事故+调频成交量中的份额']), '83%', { text: L(['two more batteries accredited since Q1 2025', '自2025Q1新增两座电池获认证']) }, [badge('official')]),
    kpi(L(['FCESS saturation ratio', 'FCESS饱和比']), '~1.6×', { text: L(['accredited supply / avg requirement', '认证供给/平均需求']) }, [badge('illus')])));
  main.append(why(['The four numbers together describe a market that has already cleared: revenue down 51%, cost down 75%, battery volume share at 83%, accredited supply about 1.6× average requirement. There is no configuration of a new project that reverses this, because the requirement is set by system need rather than by demand growth — it does not scale with the number of batteries. The only defensible base-case treatment is a small, contracted-or-conservative FCESS line, and FCESS must never be the marginal justification for buying more MWh.',
    '这四个数字共同描述了一个已经出清的市场：收入下降51%、成本下降75%、电池成交量份额83%、认证供给约为平均需求的1.6倍。任何新项目的配置都无法逆转这一格局，因为需求量由系统需要而非需求增长决定 — 它不会随电池数量增加。唯一可辩护的基准情景处理是设置一条小额、已签约或保守的FCESS收入线；且FCESS绝不可成为增配MWh的边际理由。'],
    ['Requirement does not scale with entry', '需求量不随进入者增加']));

  const g = h('div', { class: 'grid g2' });
  const c1 = card(['Battery FCESS revenue vs enablement share (aligned panels)', '电池FCESS收入与成交份额（对齐面板）'], [badge('official'), badge('illus'), statusBadge(true)]);
  barChart(c1, {
    xs: SEED.quarters, yfmt: v => 'A$' + NF1.format(v) + 'M',
    series: [{ name: ['Battery FCESS revenue', '电池FCESS收入'], color: 'var(--s1)', vals: SEED.fcessBattRevSeries }], h: 185, labels: true,
  });
  lineChart(c1, {
    xs: SEED.quarters, yfmt: v => fmtN(v) + '%',
    series: [{ name: ['Battery enablement share %', '电池成交份额%'], color: 'var(--s2)', vals: SEED.fcessShareSeries, dash: true }], h: 165,
  });
  c1.append(h('div', { class: 'cap' }, L(['The diverging pair — share up, revenue down — is the early-warning signal that MW scarcity is disappearing before MWh scarcity (spec §2.6).',
    '份额上升与收入下降的背离，是MW稀缺先于MWh稀缺消失的预警信号（规范§2.6）。'])));
  c1.append(why(['These two panels are the clearest early-warning pattern in the WA market, and it generalises: whenever a storage revenue stream shows rising volume share against falling revenue, the product has saturated and the price is being set by the marginal accredited MW. FCESS reached that state first because its requirement is small. Watch for the same divergence appearing in energy arbitrage — that is the signal that MWh scarcity is also closing, and the point at which duration alone stops being a defence.',
    '这两个面板是西澳市场最清晰的预警形态，且具有普适性：只要某项储能收入呈现"成交份额上升、收入下降"，即说明该产品已饱和、价格由边际认证MW决定。FCESS最先进入该状态，因其需求量较小。应关注同样的背离是否出现在电能量套利中 — 那将是MWh稀缺同样收敛的信号，也是时长本身不再构成防御的临界点。'],
    ['Watch for the same shape in energy', '关注电能量出现同一形态']));
  g.append(c1);

  const c2 = card(['Change in battery FCESS revenue, Q1-25 → Q1-26', '电池FCESS收入变化，2025Q1→2026Q1'], [badge('calc'), badge('illus'), statusBadge(true)]);
  waterfall(c2, {
    steps: [
      { l: ['Q1 2025 revenue', '2025Q1收入'], v: 8.6, t: 'start' },
      { l: ['Price effect', '价格效应'], v: -5.6, t: 'd' },
      { l: ['Volume effect', '成交量效应'], v: 0.7, t: 'd' },
      { l: ['Share effect', '份额效应'], v: 0.5, t: 'd' },
      { l: ['Q1 2026 revenue', '2026Q1收入'], v: 4.2, t: 'total' },
    ], yfmt: v => 'A$' + NF1.format(v) + 'M', zeroBase: true, h: 260,
  });
  c2.append(h('div', { class: 'cap' }, L(['Endpoints are official AEMO-cited values; the price / volume / share attribution is an illustrative decomposition.', '首尾为官方引用数值；价格/量/份额归因为示例分解。'])));
  c2.append(why(['Decomposition matters because the fix depends on the cause. Volume and share both contributed positively — the fleet did more work and won a bigger slice — and price alone destroyed A$5.6m. A volume problem could be solved by better bidding or a better optimiser; a price problem cannot be solved by the asset at all. So the correct response is commercial rather than operational: contract the service where possible, and otherwise assume the trailing unit price with no recovery.',
    '分解之所以重要，是因为对策取决于成因。成交量与份额均为正贡献 — 机组做了更多工作、占据更大份额 — 而仅价格一项即抹去A$5.6m。成交量问题可通过更优报价或更好的优化商解决；价格问题则完全无法通过资产本身解决。因此正确应对是商务性而非运营性的：尽可能将该服务合同化，否则应按滚动单位价格假设、不计回升。'],
    ['Price effect cannot be operated away', '价格效应无法靠运营解决']));
  g.append(c2);

  const c3 = card(['Requirement vs accredited supply by product', '各产品需求与认证供给'], [badge('illus'), statusBadge(true)]);
  barChart(c3, {
    xs: ['Cont. Raise', 'Cont. Lower', 'Reg. Raise', 'Reg. Lower', 'RoCoF'],
    yfmt: fmtN,
    series: [
      { name: ['Avg requirement MW', '平均需求MW'], color: 'var(--s1)', vals: [220, 145, 105, 90, 260] },
      { name: ['Accredited supply MW', '认证供给MW'], color: 'var(--s2)', vals: [520, 310, 260, 240, 330] },
    ], h: 250,
  });
  c3.append(h('div', { class: 'cap' }, L(['Supply materially above requirement across products = saturation. Default underwriting stance: FCESS is supplementary revenue unless sustained scarcity is demonstrated (spec §5.2 Card D).',
    '各产品供给显著高于需求 = 饱和。默认测算立场：除非出现持续稀缺，FCESS仅作为补充收益（规范§5.2卡片D）。'])));
  c3.append(why(['Contingency Raise is oversupplied by more than 2× and RoCoF is the only product where supply is not far ahead of requirement — which is why grid-forming capability is the one system-service attribute still worth designing for. But note what "worth designing for" means here: it buys eligibility for a scarcer product, not revenue. Value only appears after GPS compliance, service certification, market enablement and either a contract or a demonstrably sustainable price. Treat RoCoF and synthetic inertia as upside cases with a documented path, never as base-case revenue.',
    '事故上调产品供给超需求2倍以上，RoCoF是唯一供给未大幅领先需求的产品 — 这正是构网型能力成为唯一仍值得为之设计的系统服务属性的原因。但须明确"值得设计"的含义：它换取的是进入更稀缺产品的资格，而非收入。价值只有在GPS合规、服务认证、市场启用，以及取得合同或可证明的可持续价格之后才会出现。应将RoCoF与合成惯量作为具备明确路径的上行情景，绝不作为基准情景收入。'],
    ['RoCoF is eligibility, not revenue', 'RoCoF是资格而非收入']));
  g.append(c3);
  main.append(g);
}

// Project-specific market-services bridge — Portfolio tab only.
function kemertonServicesCard(){
  const km = card(['Market-services underwriting bridge', '市场服务承销桥'], [badge('project'), badge('model')]);
  km.append(h('div',{class:'kpis'},
    kpi(L(['Modelled annual services revenue','模型年度服务收入']),fmtAM(KEMERTON.marketServices.annualRevenueAUD),{text:'CPI '+KEMERTON.marketServices.escalationPct+'%'},[badge('model')]),
    kpi(L(['Current treatment','当前处理']),L(KEMERTON.marketServices.status),{text:L(['FCESS compression reflected; NCESS upside only','已反映FCESS压缩；NCESS仅作上行'])},[badge('draft')])));
  const svc = [
    [['Regulation Raise / Lower','调频上/下调'],['Expected','预计具备'],['TBC','待确认'],['Limited','有限']],
    [['Contingency Raise / Lower','事故上/下调'],['Expected','预计具备'],['TBC','待确认'],['Limited','有限']],
    [['RoCoF / synthetic inertia','RoCoF/合成惯量'],['GFM capable','构网型具备'],['TBC','待确认'],['Upside only','仅上行']],
    [['NCESS','NCESS'],['Potential','潜在'],['No contract identified','未识别合同'],['Zero / upside','零值/上行']]
  ];
  km.append(h('div',{class:'tbl-wrap'},
    h('table',{},
      h('thead',{},h('tr',{},
        h('th',{},L(['Service','服务'])),
        h('th',{},L(['Technical capability','技术能力'])),
        h('th',{},L(['Certification / contract','认证/合同'])),
        h('th',{},L(['Base-case revenue','基准收入'])))),
      h('tbody',{},svc.map(r=>h('tr',{},
        h('td',{},h('b',{},L(r[0]))),
        h('td',{},L(r[1])),
        h('td',{},L(r[2])),
        h('td',{},L(r[3]))))))));
  km.append(h('div',{class:'status-ladder'},[
    [['Technical capability','技术能力'],['Designed / expected','已设计/预计']],
    [['Certification','认证'],['TBC','待确认']],
    [['Registration & enablement','注册与启用'],['TBC','待确认']],
    [['Contracting','合同化'],['No NCESS contract identified','未识别NCESS合同']],
    [['Revenue inclusion','收入纳入'],['Limited base / upside only','有限基准/仅上行']]
  ].map(r=>h('div',{class:'status-step'},h('b',{},L(r[0])),h('span',{},L(r[1]))))));
  km.append(h('div',{class:'note'},L(['Reconcile A$1.75m/year against ESS allocation, A$20/MWh pricing, availability, reserved headroom, energy opportunity cost and possible overlap with merchant dispatch. Technical capability is not revenue until certification, enablement and contracting are demonstrated.','需将A$1.75m/年与ESS分配、A$20/MWh价格、可用率、预留裕度、现货机会成本及潜在重复计算核对。技术能力只有在认证、启用及合同化后才能转化为收入。'])));
  km.append(why(['Every rung of the ladder below "technical capability" is TBC, and market-wide FCESS revenue halved in a year. So the A$1.75m/yr line is not conservative because it is small — it is unproven because nothing above the first rung has been evidenced. Underwriting treatment: carry it at zero in the lender case, at the modelled figure only in the sponsor case, and require the ESS allocation, availability reservation and energy opportunity cost to be reconciled so the same MW is not sold twice.',
    '阶梯中"技术能力"之上的每一级均为待确认，而全市场FCESS收入一年内减半。因此A$1.75m/年这条收入线并非因金额小而保守 — 而是因第一级之上均无证据而未被证实。承销处理：贷款人情景按零计入，仅在发起人情景采用模型值；并要求核对ESS分配、可用率预留及电能量机会成本，以避免同一MW被重复出售。'],
    ['Capability ≠ certified ≠ contracted', '能力≠认证≠合同']));
  km.append(sourceDrawer(KEMERTON.sources.trading, ['Project-specific FCESS, RoCoF, synthetic-inertia and downside revenue assumptions','项目FCESS、RoCoF、合成惯量及下行情景收入假设']));
  km.style.marginTop = '14px';
  return km;
}

export { renderFcess, kemertonServicesCard };
