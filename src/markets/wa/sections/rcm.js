/* ---------------------------------------------------------------------------
   RCM & Capacity tab, verbatim from the prototype (lines 1869-1981).
   Ends by delegating to the ten-year BRCP forecast section, then to the
   RCM × Energy × FCESS co-optimisation.

   The co-optimisation used to be the tail of the Investment Lab tab. That tab is
   gone — the Lab is now one cross-market section on the home page — but the
   co-optimiser did not go with it, and should not have: it models how ONE WEM
   battery serves three revenue streams under shared MW, MWh, headroom and SOC
   limits, which is a fact about this market's dispatch rather than an investment
   model. Its natural home was always the capacity tab, because the RCM Energy
   Floor is what couples the three.
   --------------------------------------------------------------------------- */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { card } from '../../../components/card.js';
import { badge, statusBadge } from '../../../components/badge.js';
import { chip } from '../../../components/chip.js';
import { why } from '../../../components/decisionLogic.js';
import { sectionHead } from '../../../components/sectionHeader.js';
import { sourceDrawer, sourceStatusBadge } from '../../../components/sourceDrawer.js';
import { lineChart, barChart, waterfall } from '../../../charts/index.js';
import { fmtN, fmtA, fmtAk, fmtPct } from '../ui.js';
import { SRC } from '../sources.js';
import { SEED } from '../data/seed.js';
import { ESOO_BAL } from '../data/kemerton.js';
import { shadowRcpFactor } from '../lib/scores.js';
import { renderBrcp } from '../sections/brcp.js';
import { renderOptimizer } from '../sections/optimizer.js';

// ---------------- RCM ----------------
function renderRcm(main){
  sectionHead(main, ['RCM & Capacity — is supply short, balanced or surplus at COD?', '容量机制 — 项目投运时容量供给是偏紧、均衡还是过剩？'],
    ['Official 2028-29 position: existing and committed capacity is ~347 MW above the Peak RCR — near the upper edge of the ±5% price deadband. Small delays or additions can change the price outcome.',
     '官方2028-29口径：现有加已承诺容量高于峰值RCR约347 MW — 接近±5%价格区间上沿。较小的项目延期或新增即可能改变价格结果。']);

  const g = h('div', { class: 'grid g2' });

  const c1 = card(['BRCP vs published RCP by Capacity Year', '各容量年度BRCP与已公布RCP'], [badge('official'), badge('illus'), statusBadge(true)]);
  lineChart(c1, {
    xs: SEED.capYears, yfmt: fmtAk,
    series: [
      { name: ['BRCP', '基准容量价格BRCP'], color: 'var(--s1)', vals: SEED.brcpSeries, dash: true },
      { name: ['Published RCP', '已公布RCP'], color: 'var(--s8)', vals: SEED.rcpSeries, dash: true },
    ],
    ann: [{ si: 0, i: 3, text: 'A$488.5k (official)' }, { si: 1, i: 2, text: 'A$360.7k (official)' }],
  });
  c1.append(h('div', { class: 'cap' }, L(['Only the two annotated points are official; the history shown is an illustrative seed shape.', '仅两个标注点为官方数值；历史走势为示例种子形态。'])));
  c1.append(why(['The two lines answer two different questions and must never be substituted for each other. BRCP is a cost benchmark — the annualised fixed cost of the reference 200 MW / 1,200 MWh battery — and it jumped to ' + fmtA(SEED.brcp2829) + ' mainly because the reference machine got longer, not because the market got tighter. RCP is what a facility is actually paid, and it sits below BRCP whenever supply exceeds the requirement. Model revenue off RCP; use BRCP only to sanity-check whether your own cost base can be recovered at the administered price.',
    '两条线回答两个不同问题，绝不可互相替代。BRCP是成本基准 — 参考200MW/1,200MWh电池的年化固定成本 — 其升至' + fmtA(SEED.brcp2829) + '主要因参考机组时长延长，而非市场趋紧。RCP才是设施实际获得的价格，只要供给超过需求即低于BRCP。收入应按RCP建模；BRCP仅用于检验自身成本基础能否在行政价格下回收。'],
    ['BRCP = cost anchor · RCP = revenue', 'BRCP为成本锚·RCP为收入']));
  g.append(c1);

  const bal = SEED.capBalance;
  const c2 = card(['2028-29 capacity balance vs Peak RCR', '2028-29容量平衡与峰值RCR'], [badge('calc'), badge('illus'), statusBadge(true)]);
  barChart(c2, {
    xs: ['2028-29'], mode: 'stack', bw: 56, yfmt: v => fmtN(v),
    series: [
      { name: ['Existing', '现有容量'], color: 'var(--s1)', vals: [bal.existing] },
      { name: ['Committed', '已承诺'], color: 'var(--s2)', vals: [bal.committed] },
      { name: ['Anticipated (prob-wt)', '预期（概率加权）'], color: 'var(--s3)', vals: [bal.anticipatedPwt] },
      { name: ['EOI (prob-wt)', '意向（概率加权）'], color: 'var(--s5)', vals: [bal.eoiPwt] },
    ],
    refs: [
      { y: SEED.peakRcr2829, label: ['Peak RCR 6,323 MW', '峰值RCR 6,323 MW'], color: 'var(--ink)' },
      { y: SEED.peakRcr2829 * 1.05, label: ['+5% deadband', '+5%区间上沿'], color: 'var(--critical)' },
      { y: SEED.peakRcr2829 * 0.95, label: ['−5% deadband', '−5%区间下沿'], color: 'var(--good)' },
    ], h: 290,
  });
  c2.append(h('div', { class: 'cap' }, L(['Existing + committed = 6,670 MW (official +347 MW position); anticipated / EOI splits are illustrative.', '现有+已承诺=6,670 MW（官方+347 MW口径）；预期/意向拆分为示例。'])));
  c2.append(why(['The bar already clears the Peak RCR line before any anticipated or EOI capacity is counted, and it sits above the +5% deadband. Read the two reference lines as a price switch rather than a reliability statement: below −5% the price rises toward benchmark, above +5% it is cut. Since the distance to the upper line is only tens of MW, the practical test for a new project is not "is there a gap?" but "does my capacity displace someone whose delivery is less certain than mine?" — which is why delivery evidence outranks nameplate in this tab.',
    '在计入任何预期或意向容量之前，柱状高度已超过峰值RCR线，并高于+5%上沿。应将两条参考线理解为价格开关而非可靠性结论：低于−5%价格向基准回升，高于+5%则被压减。由于距上沿仅数十MW，新项目的实际检验并非"是否存在缺口"，而是"我的容量能否替代交付确定性低于我的项目" — 这也是本页交付证据优先于铭牌容量的原因。'],
    ['Deadband is a price switch', '价格区间是开关']));
  g.append(c2);

  const ratios = []; for (let r = 0.90; r <= 1.1501; r += 0.025) ratios.push(+r.toFixed(3));
  const c3 = card(['RCP rule curve vs capacity supply ratio (stylised)', 'RCP规则曲线与容量供给比（简化）'], [badge('illus'), statusBadge(true)]);
  lineChart(c3, {
    xs: ratios.map(r => fmtPct(r * 100, 0)), yfmt: fmtAk,
    series: [{ name: ['Shadow RCP', '影子RCP'], color: 'var(--s1)', vals: ratios.map(r => shadowRcpFactor(r) * SEED.brcp2829), dash: true }],
    ann: [{ si: 0, i: ratios.findIndex(r => r >= 1.05), text: L(['current ≈105.5%', '当前≈105.5%']) }],
  });
  c3.append(h('div', { class: 'warnbox' }, L(['This curve is a stylised illustration only. Spec §6.4: use the exact formula in the current ESM Rules and validate against published RCPs — never infer coefficients from a chart.',
    '该曲线仅为简化示意。规范§6.4：须使用现行ESM规则的精确公式并对照已公布RCP验证 — 不得从图表反推系数。'])));
  c3.append(why(['The shape is the point, not the coefficients: price is flat inside the deadband and falls steeply outside it, which is the 2016 reform working as designed. Two underwriting consequences. First, RCM revenue is non-linear in market-wide build volume, so a scenario that adds 300 MW of competitor capacity is not 5% worse than base — it can be a step down. Second, this is why the Lab runs discrete HIGH/BASE/LOW RCM scenarios rather than a single point estimate, and why the base case caps RCP at 90–100% of BRCP.',
    '此处关键是曲线形状而非系数：价格在区间内平坦、区间外陡降，正是2016年改革的设计意图。承销上有两点结论。其一，RCM收入相对全市场建设量呈非线性，因此新增300MW竞争容量的情景并非仅比基准差5%，而可能是阶跃式下降。其二，这正是投资测算采用离散的高/基准/低RCM情景而非单点估计、且基准情景将RCP限于BRCP的90–100%的原因。'],
    ['Non-linear in competitor volume', '对竞争容量呈非线性']));
  g.append(c3);

  const c4 = card(['Demand decomposition — RCR growth drivers', '需求分解 — RCR增长驱动'], [badge('illus'), statusBadge(true)]);
  waterfall(c4, { steps: SEED.demandWaterfall.map(s => ({ l: s.l, v: s.v, t: s.t === 'd' ? 'd' : s.t })), yfmt: fmtN, floor: 5900, zeroBase: false, h: 280 });
  c4.append(h('div', { class: 'cap' }, L(['Bottom-up decomposition is calculated / indicative and is shown beside — never blended into — the official AEMO series (spec §6.5.1).',
    '自下而上分解为计算/示意口径，与官方AEMO序列并列展示、绝不混合（规范§6.5.1）。'])));
  c4.append(why(['Demand growth, not storage scarcity, is what eventually reopens the capacity market — so the composition of that growth is the forward signal to track. Committed industrial load and confirmed data centres are the only bars a lender will accept; the probability-weighted speculative bars are the reason the near-term case cannot be built on RCR growth. Watch this decomposition each ESOO: a large load converting from speculative to committed moves the whole capacity balance and is the single cheapest early indicator of a tightening cycle.',
    '最终重新打开容量市场的是需求增长而非储能稀缺，因此该增长的构成才是需跟踪的前瞻信号。已承诺工业负荷与已确认数据中心是贷款人唯一会接受的部分；概率加权的投机性部分正是近期方案不能建立在RCR增长之上的原因。应在每期ESOO跟踪该分解：一个大负荷由投机转为已承诺即可改变整体容量平衡，是判断周期趋紧最廉价的早期指标。'],
    ['Watch speculative → committed', '关注投机转为已承诺']));
  g.append(c4);

  const c5 = card(['SWIS large-load watchlist — hard inclusion test', 'SWIS大负荷观察清单 — 硬性纳入检验'], [badge('illus'), statusBadge(true)]);
  const sysChip = (sys) => sys === 'SWIS_CONFIRMED' ? chip('good', 'SWIS_CONFIRMED') : sys === 'NWIS' ? chip('serious', 'NWIS') : sys === 'OFF_GRID' ? chip('critical', 'OFF_GRID') : chip('warn', 'UNKNOWN');
  c5.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Load', '负荷项目'])), h('th', { class: 'num' }, 'MW'), h('th', {}, L(['Stage', '阶段'])), h('th', {}, L(['System', '所属系统'])))),
    h('tbody', {}, SEED.largeLoads.map(ld => h('tr', {},
      h('td', {}, h('b', {}, ld.n)), h('td', { class: 'num' }, fmtN(ld.mw)), h('td', {}, L(ld.stage)), h('td', {}, sysChip(ld.sys))))))));
  c5.append(h('div', { class: 'note' }, L(['Only loads with a confirmed SWIS point of connection AND stage probability above threshold enter the demand model. NWIS and off-grid loads do not increase WEM RCR (spec §6.5.4).',
    '仅当负荷确认接入SWIS且阶段概率高于阈值时才纳入需求模型。NWIS及离网负荷不会增加WEM RCR（规范§6.5.4）。'])));
  c5.append(h('div', { class: 'cap' }, L(['Gas context: WA 15% offshore LNG domestic reservation policy; Commonwealth 20% export-equivalent scheme intended from 1 July 2027 (final legislation pending — do not assume a WA exemption). Gas-peaker fuel cost is a competing firm-capacity input.',
    '天然气背景：西澳15%海上LNG本地保留政策；联邦20%出口当量机制拟自2027年7月1日实施（立法未定 — 不得假设西澳豁免）。燃气调峰燃料成本是竞争性可靠容量输入。'])));
  c5.append(why(['The inclusion test is strict for a reason: a load that is not connected to the SWIS cannot raise the WEM Reserve Capacity Requirement no matter how large it is. Pilbara mining electrification and off-grid hydrogen are real demand but they sit on NWIS or behind the meter, so counting them would overstate the capacity market a WA project actually sells into. Apply the same test to any demand-growth story presented to you — confirmed SWIS point of connection plus stage probability above threshold, or it does not enter the model.',
    '纳入检验之所以严格，原因在于：未接入SWIS的负荷无论规模多大，都无法提高WEM备用容量需求。Pilbara矿业电气化与离网氢能属真实需求，但位于NWIS或表后，若予计入将高估西澳项目实际所面对的容量市场。应对任何向你呈现的需求增长论述适用同一检验 — 须同时具备已确认的SWIS并网点与高于阈值的阶段概率，否则不得进入模型。'],
    ['No SWIS connection, no RCR impact', '未接入SWIS即不影响RCR']));
  g.append(c5);
  main.append(g);

  const cq = card(['2028–29 capacity quality — headline surplus vs underlying dependencies', '2028–29容量质量 — 表面盈余与底层依赖'], [sourceStatusBadge(SRC.esoo), badge('calc')]);
  cq.append(h('div', { class:'waterfall-list' }, [
    [['Peak Reserve Capacity Target','峰值容量目标'],fmtN(ESOO_BAL.peakRCTMW)+' MW',['Official system requirement','官方系统需求']],
    [['Existing + committed capacity','现有+已承诺容量'],fmtN(ESOO_BAL.existingCommittedMW)+' MW',['Produces the +347 MW headline surplus','形成+347MW表面盈余']],
    [['— of which battery','其中电池'],fmtN(ESOO_BAL.existingCommittedBessMW)+' MW',['Forecast operational on the SWIS by 2028-29','预计2028-29在SWIS投运']],
    [['ESR Duration Requirement Uplift','ESR时长要求抬升'],fmtN(ESOO_BAL.durationUpliftMW)+' MW',['Shorter batteries cannot fully serve the longer peak','短时电池无法完整覆盖更长峰值']],
    [['Committed delivery dependency','已承诺项目交付依赖'],fmtN(ESOO_BAL.committedDeliveryMW)+' MW',['Surplus depends on timely delivery','盈余依赖按期投运']],
    [['Additional anticipated capacity','额外预期容量'],fmtN(ESOO_BAL.anticipatedMW)+' MW',['Further competition if delivered','若投运将进一步竞争']],
    [['Additional EOI pressure','额外EOI压力'],'>'+fmtN(ESOO_BAL.eoiPressureMW)+' MW',['Immature, but material queue pressure','尚不成熟但规模重大']],
    [['VPP peak-demand reduction','VPP峰值削减'],fmtN(ESOO_BAL.vppPeakReductionMW)+' MW',['Demand-side contribution assumed','假设需求侧贡献']]
  ].map(r=>h('div',{class:'wf-row'},h('div',{},h('b',{},L(r[0]))),h('div',{class:'v'},r[1]),h('div',{},L(r[2]))))));
  cq.append(h('div',{class:'reco'},h('b',{},L(['Investor conclusion: ','投资结论：'])),L(['The WEM has a headline near-term surplus, but it is conditional on project and network delivery. The 392 MW duration uplift confirms that long-duration capacity remains system-relevant even in a nominal surplus year.','WEM近期存在表面容量盈余，但其依赖项目及电网按期交付。392MW时长抬升表明，即使名义盈余，长时容量仍具系统价值。'])));
  cq.append(why(['This list is the argument for a long-duration entry in a surplus year. The +347 MW surplus is smaller than the ' + fmtN(ESOO_BAL.durationUpliftMW) + ' MW the system needs purely because the peak got longer, and it depends on ' + fmtN(ESOO_BAL.committedDeliveryMW) + ' MW of committed projects actually arriving on time. So the headline number understates demand for compliant hours and overstates the certainty of supply. Practical use: run the capacity case twice — once on the ESOO position, once assuming a realistic share of committed capacity slips a cycle — and note that the ' + fmtN(ESOO_BAL.vppPeakReductionMW) + ' MW VPP assumption is a demand-side offset that competes with you but is not contractually committed to anyone.',
    '本列表正是在盈余年度进入长时储能的论据。+347MW的盈余小于系统仅因峰值变长而需要的' + fmtN(ESOO_BAL.durationUpliftMW) + 'MW，且该盈余依赖' + fmtN(ESOO_BAL.committedDeliveryMW) + 'MW已承诺项目如期投运。因此表面数字低估了对合规小时数的需求，同时高估了供给的确定性。实务用法：容量情景须做两遍 — 一遍按ESOO口径，一遍假设一定比例的已承诺容量延后一个周期 — 并注意' + fmtN(ESOO_BAL.vppPeakReductionMW) + 'MW的VPP假设是与你竞争的需求侧抵减，但并未对任何主体形成合同承诺。'],
    ['Surplus < duration uplift', '盈余小于时长抬升']));
  cq.append(sourceDrawer(SRC.esoo, ['Capacity balance, duration uplift, anticipated supply and demand-side assumptions','容量平衡、时长抬升、预期供给及需求侧假设']));
  cq.style.marginTop='14px'; main.append(cq);

  const cone = card(['Gross CONE treatment — capacity and merchant value remain separate', 'Gross CONE处理 — 容量与市场化价值须分开'], [badge('final')]);
  cone.append(h('div',{class:'note'},L(['The official BRCP is a gross fixed-cost recovery benchmark. It does not confirm that merchant or FCESS margins will remain attractive. Market analysis supporting the benchmark found storage competition had largely eliminated the marginal gross-versus-net CONE difference.','官方BRCP是毛固定成本回收基准，并不证明市场化或FCESS利润可持续。支撑该基准的市场分析认为，储能竞争已基本消除边际毛额CONE与净额CONE的差异。'])));
  cone.append(h('div',{class:'reco'},h('b',{},L(['Underwriting rule: ','承销原则：'])),L(['Capacity value and merchant value must be underwritten separately. BRCP is not guaranteed project revenue; use assigned Capacity Credits and the applicable RCP.','容量价值与市场化价值必须分别承销。BRCP并非项目保证收入；应使用实际分配容量信用及适用RCP。'])));
  cone.append(why(['A gross-CONE benchmark means the BRCP is set to recover the reference machine’s fixed costs assuming no help from energy or system-service margins. That is deliberately conservative for the price-setter and deliberately unhelpful for the investor: it does not certify that merchant margins exist, and it does not entitle any facility to that price. Use it as the answer to one question only — "if I were paid the administered capacity price on my assigned credits, would fixed costs be covered?" — and answer revenue questions with assigned credits × applicable RCP.',
    '毛额CONE基准意味着BRCP的设定目标是回收参考机组的固定成本，且假设不依赖电能量或系统服务的利润贡献。这对定价方是刻意保守，对投资人则刻意不提供帮助：它既不证明市场化利润存在，也不赋予任何设施获得该价格的权利。仅应将其用于回答一个问题 — "若按行政容量价格支付我的获配信用，固定成本能否覆盖？" — 收入问题须以获配信用×适用RCP回答。'],
    ['Recovery test, not a revenue right', '回收检验，非收入权利']));
  cone.append(sourceDrawer(SRC.brcp, ['Official BRCP benchmark technology, gross fixed-cost treatment and price anchor','官方BRCP基准技术、毛固定成本处理及价格锚']));
  cone.style.marginTop='14px'; main.append(cone);

  renderBrcp(main);
  renderOptimizer(main);
}

export { renderRcm };
