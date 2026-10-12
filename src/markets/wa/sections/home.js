/* ---------------------------------------------------------------------------
   WA Overview tab, verbatim from the prototype (lines 1425-1622).
   --------------------------------------------------------------------------- */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { card } from '../../../components/card.js';
import { badge, statusBadge } from '../../../components/badge.js';
import { chip } from '../../../components/chip.js';
import { why } from '../../../components/decisionLogic.js';
import { kpi, bandFor } from '../../../components/metricCard.js';
import { state, render } from '../state.js';
import { NF1, fmtN, fmtA, fmtAk, fmtAM, fmtPct } from '../ui.js';
import { T } from '../text.js';
import { SEED } from '../data/seed.js';
import { dniScore, connScore, esrAtYear, shadowRcpFactor } from '../lib/scores.js';

// ---------------- HOME ----------------
function renderHome(main){
  main.append(h('div', { class: 'warnbox' }, '⚠ ' + L(T.seedWarn)));

  const intro = card(['Institutional Investor Walkthrough — six questions, one decision path', '机构投资人导览 — 六个问题，一条决策路径'], [badge('official'), statusBadge(false)]);
  intro.append(h('div', { class: 'story-band' },
    h('b', {}, L(['Core storyline', '核心叙事'])),
    h('p', {}, L(['WA moved from a thermal-centred, capacity-backed isolated market to a renewable-heavy system where batteries are essential — but rapid entry has already compressed short-duration merchant and FCESS rents. The investment case now depends on capacity deliverability, duration, location, execution and revenue protection rather than on a generic “battery scarcity” thesis.',
      '西澳已从以火电为中心、由容量机制支撑的孤立电网，转向可再生能源占比快速提升且储能不可或缺的系统；但电池集中投运已压缩短时现货与FCESS租金。当前投资逻辑不再是笼统的“电池稀缺”，而取决于容量可交付性、时长、区位、执行能力及收入保护。']))));
  const steps = [
    ['01', ['Overview', '总览'], ['What is the house view today?', '当前总体判断是什么？'], 'home'],
    ['02', ['Market evolution', '市场演进'], ['Why did BESS become necessary — and what changed after entry?', '为何储能成为必需？进入后发生了什么？'], 'story'],
    ['03', ['Revenue stack', '收入结构'], ['Are RCM, Energy and FCESS durable at COD?', '投运时RCM、现货与FCESS是否可持续？'], 'rcm'],
    ['04', ['Asset design', '资产设计'], ['What duration and location survive the next rule vintage?', '什么时长与区位能跨越下一规则版本？'], 'duration'],
    ['05', ['Underwriting', '项目承销'], ['Can the project connect, finance and withstand downside?', '项目能否并网、融资并承受下行情景？'], 'grid'],
    ['06', ['Portfolio application', '组合应用'], ['Which screened WEM opportunity actually passes the gates?', '所筛选的西澳机会中哪一个能通过门槛？'], 'portfolio'],
  ];
  intro.append(h('div', { class: 'walk' }, steps.map(x => h('button', { class: 'walk-step', onclick: () => { state.tab=x[3]; render(); window.scrollTo(0,0); } },
    h('span', { class: 'n' }, x[0] + ' · ' + L(x[1])), h('b', {}, L(x[2]))))));
  intro.append(h('div', { class: 'note' }, L(['Recommended presentation order: Overview → WA Market Story → RCM → Energy → FCESS → Duration → Pipeline → Grid → Portfolio → Data & Methodology.',
    '建议讲解顺序：总览 → 西澳市场演进 → RCM → 现货 → FCESS → 时长 → 管线 → 并网 → 组合 → 数据与方法。'])));
  intro.append(why(['The six questions are sequenced so each one can veto the next. A market that needs storage (02) is not the same as a revenue stack that survives to your COD (03), a design that stays compliant (04), an asset that can actually connect and fund (05), or a specific opportunity worth committing capital to (06). Any single failure ends the case, so the decision is made in this order rather than on a blended score.',
    '六个问题按“逐级否决”排序：市场需要储能（02）不等于收入结构能延续至投运（03），不等于设计能持续合规（04），不等于资产能真正并网并融资（05），也不等于某个具体机会值得投入资本（06）。任一环节不成立即终止，因此决策按此顺序作出，而非依赖综合评分。'],
    ['Sequential veto, not a scorecard', '逐级否决，而非评分卡']));
  main.append(intro);

  const grid = h('div', { class: 'grid g2' });

  // Card A — overall signal
  const cA = card(['Card A — Overall WA Storage Signal', 'Card A — 西澳储能综合信号'], [statusBadge(false), badge('illus')]);
  cA.append(h('div', { style: 'font-size:var(--fs-sm);color:var(--ink2);margin:10px 0;' },
    L(['Target COD window', '目标投运窗口']) + ': ' + SEED.overall.codWindow,
    ' · ' + L(['Evidence confidence', '证据置信度']) + ': ' + SEED.overall.confidence + '%'));
  cA.append(h('div', { style: 'font-size:var(--fs-xs);color:var(--ink2);margin:8px 0;' }, L(SEED.overall.rationale)));
  grid.append(cA);

  // Card B — RCM signal
  const ratio = SEED.supplyRatio, shadow = shadowRcpFactor(ratio) * SEED.brcp2829;
  const cB = card(['Card B — RCM Signal', 'Card B — RCM信号'], [statusBadge(false)]);
  cB.append(h('div', { style: 'margin:8px 0;' }, chip('serious',
    L(['Caution — supply just above the +5% deadband edge', '警示 — 供给略高于+5%价格区间上沿']))));
  cB.append(h('div', { class: 'kpis' },
    kpi('2028-29 BRCP', fmtA(SEED.brcp2829) + '<small>/MW/yr</small>', null, [badge('official')]),
    kpi(L(['2027-28 published Peak RCP', '2027-28已公布峰值RCP']), fmtA(SEED.rcp2728) + '<small>/MW/yr</small>', null, [badge('official')]),
    kpi(L(['2028-29 Peak RCR', '2028-29峰值RCR']), fmtN(SEED.peakRcr2829) + '<small> MW</small>', null, [badge('official')]),
    kpi(L(['Expected Capacity Credits (E&C)', '预期容量信用（现有+已承诺）']), fmtN(SEED.expectedCC) + '<small> MW</small>',
      { text: L(['RCR + 347 MW official position', '官方口径：高于RCR约347 MW']) }, [badge('calc')]),
    kpi(L(['Capacity supply ratio', '容量供给比']), fmtPct(ratio * 100),
      { text: L(['deadband ±5%: 95%–105%', '价格不调整区间±5%：95%–105%']) }, [badge('calc')]),
    kpi(L(['Upper deadband headroom', '上沿区间裕度']), fmtN(SEED.upperDeadbandHeadroom) + '<small> MW</small>',
      { text: L(['negative = above the +5% edge', '负值 = 已越过+5%上沿']), cls: 'down' }, [badge('calc')]),
    kpi(L(['Shadow RCP (stylised curve)', '影子RCP（简化曲线）']), fmtAk(shadow) + '<small>/MW/yr</small>',
      { text: L(['≈ ' + fmtPct(shadowRcpFactor(ratio) * 100, 0) + ' of BRCP — validate vs exact ESM Rules', '≈BRCP的' + fmtPct(shadowRcpFactor(ratio) * 100, 0) + ' — 须以ESM规则精确公式验证']) }, [badge('illus')]),
    kpi(L(['P(RCP below / at / above BRCP)', 'RCP低于/等于/高于BRCP概率']), '55 / 25 / 20<small> %</small>', null, [badge('illus')])));
  cB.append(h('div', { class: 'note', style: 'margin-top:8px;' }, h('b', {}, L(['10-yr BRCP outlook: ', '十年BRCP展望：'])),
    L(['official A$488.5k (2028-29) → base ~A$520k (2029-30, if a 7h benchmark) → broadly A$500–550k nominal through 2037-38; real cost declines as battery learning outweighs longer duration. BRCP is a cost anchor, not RCP — see the RCM tab §6.6.',
       '官方A$488.5k（2028-29）→ 基准约A$520k（2029-30，若7h基准）→ 至2037-38名义约A$500–550k；随电池学习超过时长延长，实际成本下降。BRCP是成本锚，非RCP — 详见容量机制页§6.6。'])));
  cB.append(why(['Supply sits at ' + fmtPct(ratio * 100) + ' of the Peak RCR, i.e. ' + Math.abs(SEED.upperDeadbandHeadroom) + ' MW past the +5% deadband edge, so the administered price is already on its declining slope rather than at benchmark. Two consequences for underwriting: (a) model RCP at 90–100% of BRCP, never at BRCP; (b) because the gap to the edge is only tens of MW, a single delayed competitor flips the price band — so RCM revenue is more sensitive to other people’s schedules than to your own capex.',
    '供给处于峰值RCR的' + fmtPct(ratio * 100) + '，即已越过+5%上沿约' + Math.abs(SEED.upperDeadbandHeadroom) + 'MW，因此行政价格已进入下行段而非停留在基准。承销上有两点结论：（a）RCP应按BRCP的90–100%建模，绝不按BRCP；（b）由于距上沿仅数十MW，任一竞争项目延期即可改变价格区间 — RCM收入对他人进度的敏感度高于对自身造价的敏感度。'],
    ['Price is on the slope, not at benchmark', '价格已在下行段']));
  grid.append(cB);

  // Card C — merchant signal
  const cC = card(['Card C — Merchant Revenue Signal', 'Card C — 现货收入信号'], [statusBadge(false)]);
  cC.append(h('div', { style: 'margin:8px 0;' }, chip('critical', L(['Weakening — rapid cannibalisation', '走弱 — 收益侵蚀显著']))));
  cC.append(h('div', { class: 'kpis' },
    kpi(L(['Q1 2026 energy price spread', '2026年一季度现货价差']), 'A$' + SEED.spreadNow + '<small>/MWh</small>',
      { text: L(['from A$51/MWh — down ~75% ', '由A$51/MWh下降约75% ']) + L(T.yoy), cls: 'down' }, [badge('official')]),
    kpi(L(['Trailing optimised revenue (2h / 4h)', '滚动优化收入（2h/4h）']), 'A$36k / 64k<small>/MW/yr</small>', null, [badge('illus')]),
    kpi(L(['Trailing optimised revenue (8h / 10h)', '滚动优化收入（8h/10h）']), 'A$101k / 112k<small>/MW/yr</small>',
      { text: L(['longer windows hold value better', '长时段价值保持更好']) }, [badge('illus')]),
    kpi(L(['Negative-price hours (Q1 2026)', '负电价小时数（2026Q1）']), '~350<small> h</small>', null, [badge('illus')]),
    kpi(L(['Battery fleet entering market', '电池装机进入市场']), fmtN(SEED.fleetMW) + '<small> MW</small> / ' + fmtN(SEED.fleetMWh) + '<small> MWh</small>',
      { text: 'Q1 2026 (AEMO)' }, [badge('official')])));
  cC.append(why(['Spread fell ~75% in the same year the fleet grew ~410% in MWh — that is the cannibalisation elasticity, and it is the reason merchant revenue cannot carry a WA underwriting case. The 2h/4h versus 8h/10h split matters more than the absolute level: short duration lost roughly two-thirds of its trailing revenue while long duration held most of it. Practical rule: size debt on capacity revenue, treat merchant as equity upside, and re-run the case after every ≥100 MW COD.',
    '价差在装机MWh增长约410%的同一年内下降约75% — 这就是收益侵蚀弹性，也是市场化收入无法支撑西澳承销的原因。2h/4h与8h/10h的分化比绝对水平更重要：短时资产损失约三分之二的滚动收入，长时资产则大部保留。实务原则：以容量收入安排债务规模，将市场化收入视为股权上行，并在每个≥100MW项目投运后重算。'],
    ['Merchant = equity upside only', '市场化仅作股权上行']));
  grid.append(cC);

  // Card D — FCESS signal
  const cD = card(['Card D — FCESS Signal', 'Card D — FCESS信号'], [statusBadge(false)]);
  cD.append(h('div', { style: 'margin:8px 0;' }, chip('warn', L(['Supplementary revenue only — do not underwrite as core', '仅作补充收益 — 不得作为核心测算基础']))));
  cD.append(h('div', { class: 'kpis' },
    kpi(L(['Battery FCESS revenue (Q1 2026)', '电池FCESS收入（2026Q1）']), fmtAM(SEED.fcessBattRevNow * 1e6),
      { text: L(['from A$8.6M ', '由A$8.6M ']) + L(T.vsPrior) + ' (−51%)', cls: 'down' }, [badge('official')]),
    kpi(L(['FCESS enablement cost (Q1 2026)', 'FCESS成交成本（2026Q1）']), fmtAM(SEED.fcessCostNow * 1e6),
      { text: '−75% ' + L(T.yoy), cls: 'down' }, [badge('official')]),
    kpi(L(['Battery share of contingency + regulation volume', '电池在事故+调频成交量中的份额']), '83%',
      { text: L(['rising while revenue falls (Q1 2026)', '份额上升而收入下降（2026Q1）']) }, [badge('official')]),
    kpi(L(['Unit revenue per enabled MW-hour', '单位成交MW·h收入']), '↓ ~60% ' + L(T.yoy), null, [badge('illus')])));
  cD.append(why(['Batteries now clear 83% of contingency and regulation volume while battery FCESS revenue halved and total enablement cost fell 75%. Winning the market and earning from it have separated: the product is competitively supplied and the price is set by the marginal accredited MW, of which there is a surplus. Underwrite FCESS at no more than the trailing twelve-month unit revenue, never as a growth line, and never as justification for additional MWh.',
    '电池已占事故与调频成交量的83%，但电池FCESS收入减半、成交总成本下降75%。"赢得市场"与"从市场获利"已经分离：该产品供给充分竞争，价格由边际认证MW决定，而后者处于盈余。FCESS测算不得高于过去12个月单位收入，不得作为增长项，也不得作为增配MWh的理由。'],
    ['Volume share ≠ revenue', '成交份额≠收入']));
  grid.append(cD);

  // Card E — duration signal
  const dni = dniScore(), dband = bandFor(SEED.dniBands, dni);
  const cE = card(['Card E — Duration Signal', 'Card E — 时长信号'], [statusBadge(false)]);
  cE.append(h('div', { style: 'margin:8px 0;' }, chip('good', L(['Strengthening — duration-driven market', '走强 — 时长驱动市场']))));
  cE.append(h('div', { class: 'kpis' },
    kpi(L(['ESR Duration Requirement at COD (' + state.codYear + ')', '投运时ESR时长要求（' + state.codYear + '）']),
      esrAtYear(state.codYear) + '<small> h</small>', null, [badge('official')]),
    kpi(L(['Duration-Need Index', '时长需求指数']), dni + '<small> / 100</small>',
      { text: L(dband.n) }, [badge('calc'), badge('illus')]),
    kpi(L(['Fleet weighted-average duration', '存量加权平均时长']), NF1.format(SEED.fleetAvgHours) + '<small> h</small>',
      { text: L(['vs 7 h requirement', '对比7小时要求']) }, [badge('calc')]),
    kpi(L(['P90 net-load gap duration', 'P90净负荷缺口时长']), '~6.5<small> h</small>', null, [badge('illus')]),
    kpi(L(['Recommended build', '建议配置']),
      SEED.durationSig.recoInitial + 'h → ' + SEED.durationSig.recoExpand + 'h',
      { text: L(['initial build → expansion path', '初始配置 → 增容路径']) }, [badge('illus')])));
  cE.append(h('div', { class: 'flow' },
    h('span', { class: 'fbox' }, L(['Falling minimum net demand', '最小净负荷持续下降'])), h('span', { class: 'farr' }, '+'),
    h('span', { class: 'fbox' }, L(['Thermal retirement gap', '火电退出缺口'])), h('span', { class: 'farr' }, '+'),
    h('span', { class: 'fbox' }, L(['Short-duration MW saturation', '短时MW饱和'])), h('span', { class: 'farr' }, '+'),
    h('span', { class: 'fbox' }, L(['Duration-differentiated capacity rules', '按时长差异化的容量规则'])), h('span', { class: 'farr' }, '='),
    h('span', { class: 'fbox', style: 'border-color:var(--good);font-weight:var(--fw-medium);' }, L(['Longer-duration investment signal', '更长时长投资信号']))));
  cE.append(why(['This is the only signal strengthening, and it is the one WA pays for through a recurring rule rather than a one-off tender. The fleet averages ' + NF1.format(SEED.fleetAvgHours) + ' h against a ' + esrAtYear(state.codYear) + ' h requirement, so most existing MW is de-rated and the incumbent fleet cannot simply extend. Build to ' + SEED.durationSig.recoInitial + ' h with a documented path to ' + SEED.durationSig.recoExpand + ' h, and judge the last hour on its own incremental NPV — hours are the asset’s scarcest and most policy-exposed attribute.',
    '这是唯一走强的信号，且西澳通过周期性规则而非一次性招标为其付费。存量加权平均' + NF1.format(SEED.fleetAvgHours) + '小时，对应' + esrAtYear(state.codYear) + '小时要求，因此多数既有MW已被折减且难以简单延长。建议按' + SEED.durationSig.recoInitial + '小时建设并保留明确的' + SEED.durationSig.recoExpand + '小时增容路径，且以最后一小时自身的增量NPV作判断 — 时长是资产最稀缺、最受政策影响的属性。'],
    ['Incumbent fleet cannot follow', '存量机组难以跟随']));
  grid.append(cE);

  // Card F — grid connection signal
  const cs = connScore(), cband = bandFor(SEED.connBands, cs);
  const cF = card(['Card F — Grid Connection Signal', 'Card F — 并网风险信号'], [statusBadge(false), badge('illus')]);
  cF.append(h('div', { style: 'margin:8px 0;' }, chip(cband.c, L(SEED.connection.status))));
  cF.append(h('div', { class: 'kpis' },
    kpi(L(['Connection risk score', '并网风险评分']), cs + '<small> / 100</small>', { text: L(cband.n) }, [badge('calc')]),
    kpi(L(['Western Power stage', 'Western Power阶段']), L(SEED.connection.wpStage), null),
    kpi(L(['GPS stage', 'GPS阶段']), SEED.connection.gpsStage,
      { text: L(['Access Offer: ', '接入报价：']) + L(SEED.connection.aoStatus) }),
    kpi(L(['NAQ / nameplate', 'NAQ/铭牌容量比']), fmtPct(SEED.connection.naqToNameplate * 100, 0),
      { text: L(['<90% triggers wait / re-price', '低于90%应等待或重新定价']) }),
    kpi(L(['Critical-path float', '关键路径裕度']), SEED.connection.floatMonths + '<small> ' + L(['months', '个月']) + '</small>',
      { text: L(['<6 months triggers schedule protection', '低于6个月须要求进度保护']) })));
  cF.append(h('div', { class: 'note' },
    L(['Required protection: no material non-refundable payment before executed access contracts and verifiable NAQ evidence. An Access Offer alone does not prove full Capacity Credit value — see the nameplate → revenue bridge in the Grid Connection tab.',
       '必要保护：在接入合同签署及NAQ证据可验证前，不支付重大不可退还款项。仅有接入报价并不代表足额容量信用价值 — 详见“并网”页的铭牌容量至收入桥。'])));
  cF.append(why(['Connection is scored ' + cs + '/100 (higher = riskier) because study maturity, GPS status and network-capex certainty are all unproven, not because the site is bad. That distinction drives deal structure rather than pricing: an amber connection score converts into conditions precedent, holdbacks and long-stop dates. NAQ at ' + fmtPct(SEED.connection.naqToNameplate * 100, 0) + ' of nameplate and ' + SEED.connection.floatMonths + ' months of float are the two numbers to re-test monthly — both can move without any change in the market.',
    '并网评分' + cs + '/100（分值越高风险越大），原因是研究成熟度、GPS状态与电网造价确定性均未证实，而非场址本身不佳。这一区分影响交易结构而非定价：黄色并网评分应转化为先决条件、保留款与最终截止日。NAQ为铭牌的' + fmtPct(SEED.connection.naqToNameplate * 100, 0) + '、关键路径裕度' + SEED.connection.floatMonths + '个月，是需每月复核的两个数字 — 两者均可在市场不变的情况下变动。'],
    ['Structure risk, don’t re-price it', '以结构而非定价应对']));
  grid.append(cF);
  main.append(grid);

  // Card G — actions (full width)
  const actions = [
    [['Underwrite FCESS at no more than the trailing 12-month unit-revenue level unless contracted.', '除非已签合同，FCESS测算不得高于过去12个月单位收入水平。'],
     ['Trigger: FCESS unit revenue down >20% year on year', '触发条件：FCESS单位收入同比下降超过20%']],
    [['Use 90%–100% of BRCP as the base RCM range only while probability-weighted supply remains within the deadband.', '仅当概率加权供给仍处于价格区间内时，方可以BRCP的90%–100%作为RCM基准区间。'],
     ['Trigger: supply ratio 105.5% — currently just above the +5% edge', '触发条件：供给比105.5% — 目前略高于+5%上沿']],
    [['Require full NAQ, Access Offer and GPS evidence before releasing material development consideration.', '在取得完整NAQ、接入报价及GPS证据前，不支付重大开发对价。'],
     ['Trigger: Access Offer / GPS / NAQ evidence incomplete or not independently verifiable', '触发条件：接入报价/GPS/NAQ证据不完整或无法独立核验']],
    [['Compare 7h, 8h and 10h designs using incremental NPV of the final added hour, not headline project IRR alone.', '以最后新增小时的增量NPV而非仅项目IRR比较7h、8h与10h方案。'],
     ['Trigger: Duration-Need Index ≥ 55 and ESR requirement rising', '触发条件：时长需求指数≥55且ESR要求上升']],
    [['Re-run merchant economics after every major battery COD.', '每个大型电池项目投运后重新测算现货经济性。'],
     ['Trigger: new operating battery capacity >100 MW in a quarter', '触发条件：单季度新增投运电池容量超过100 MW']],
  ];
  const cG = card(['Card G — Immediate Investor Actions', 'Card G — 可执行投资建议'], [statusBadge(false), badge('illus')]);
  cG.append(h('ol', { class: 'actions' }, actions.map(([a, t]) =>
    h('li', {}, L(a), h('span', { class: 'trig' }, L(t))))));
  cG.append(why(['Each action is paired with a numeric trigger so the decision is reviewable rather than a matter of judgement recalled later. Three of the five triggers are already met at today’s snapshot (supply ratio above the deadband, FCESS unit revenue down more than 20%, Duration-Need Index above 55), which is exactly why the house view is Selective rather than Invest: the market is not closed, but the specific protections listed here are now mandatory rather than optional.',
    '每项建议均配套量化触发条件，使决策可复核，而非事后凭记忆判断。按当前快照，五项触发条件中已有三项成立（供给比越过价格区间上沿、FCESS单位收入同比下降超20%、时长需求指数高于55），这正是总体判断为"选择性投资"而非"投资"的原因：市场并未关闭，但上列具体保护措施已由可选变为必须。'],
    ['3 of 5 triggers already live', '5项触发条件已有3项成立']));
  cG.style.marginTop = '14px';
  main.append(cG);

  // Revenue Driver Bridge — nameplate → capacity + net merchant + FCESS = net operating revenue
  const cRD = card(['Revenue Driver Bridge — how nameplate MW becomes net operating revenue', '收入驱动桥 — 铭牌MW如何变为净运营收入'], [badge('calc'), statusBadge(false)]);
  const fbox = (t, strong) => h('span', { class: 'fbox', style: strong ? 'border-color:var(--s1);font-weight:var(--fw-medium);' : '' }, L(t));
  const arr = () => h('span', { class: 'farr' }, '→');
  cRD.append(h('div', { style: 'font-size:var(--fs-2xs);color:var(--muted);margin-bottom:4px;' }, L(['Capacity channel (RCM)', '容量通道（RCM）'])));
  cRD.append(h('div', { class: 'flow' },
    fbox(['Nameplate MW / MWh', '铭牌MW/MWh']), arr(), fbox(['DSOC / CMD', 'DSOC/CMD']), arr(),
    fbox(['CRC × duration de-rating', 'CRC×时长折减']), arr(), fbox(['NAQ', 'NAQ']), arr(),
    fbox(['Capacity Credits × RCP', '容量信用×RCP'], true)));
  cRD.append(h('div', { style: 'font-size:var(--fs-2xs);color:var(--muted);margin:8px 0 4px;' }, L(['Merchant channel (net, not gross)', '市场化通道（净值，非毛值）'])));
  cRD.append(h('div', { class: 'flow' },
    fbox(['Gross discharge sales', '毛放电销售额']), arr(), fbox(['− charging cost', '− 充电成本']), arr(),
    fbox(['− loss / MLF / curtailment', '− 损失/MLF/限电']), arr(), fbox(['− degradation & fees', '− 衰减与费用']), arr(),
    fbox(['+ FCESS / RoCoF net value', '+ FCESS/RoCoF净值']), arr(), fbox(['Net operating revenue', '净运营收入'], true)));
  cRD.append(h('div', { class: 'note' }, L(['Two separate locational multipliers: capacity revenue follows DSOC→CRC→NAQ→Credits×RCP; merchant revenue follows MLF + curtailment + import/export limits. A project can have a supportive BRCP yet weak capacity revenue via NAQ, a duration shortfall or oversupply — BRCP alone is not a revenue forecast. Binding driver for a WA 8h project reaching COD in ' + state.codYear + ': capacity deliverability (NAQ) and the ' + esrAtYear(state.codYear) + 'h duration requirement; merchant margin is net after charging cost, never gross discharge sales.',
    '两个相互独立的位置乘数：容量收入沿 DSOC→CRC→NAQ→信用×RCP；市场化收入沿 MLF+限电+进出口限额。项目可能有支撑性的BRCP，却因NAQ、时长不足或供给过剩而容量收入偏弱 — BRCP本身不是收入预测。对' + state.codYear + '投运的西澳8小时项目，起约束作用的驱动为：容量可交付性（NAQ）与' + esrAtYear(state.codYear) + '小时时长要求；市场化收益为扣除充电成本后的净值，绝非毛放电销售额。'])));
  cRD.append(why(['This bridge is the dashboard’s single organising idea: every later tab is one link in it. The capacity chain is where value is lost administratively (a de-rating or an NAQ cut removes revenue with no physical change to the asset); the merchant chain is where value is lost economically (charging cost and losses routinely consume two-thirds of gross discharge sales). Diligence therefore has to price the weakest link, not the headline MW — and the two chains must be stress-tested separately because they fail for unrelated reasons.',
    '本桥是整个看板的组织主线：后续每个页面都是其中一环。容量链是价值被行政性削减之处（折减或NAQ下调可在资产完全不变的情况下抹去收入）；市场化链是价值被经济性削减之处（充电成本与损耗通常吞噬毛放电销售额的三分之二）。因此尽调应对最弱环节定价，而非铭牌MW；且两条链须分别压力测试，因其失效原因互不相关。'],
    ['Price the weakest link', '对最弱环节定价']));
  cRD.style.marginTop = '14px';
  main.append(cRD);
}

export { renderHome };
