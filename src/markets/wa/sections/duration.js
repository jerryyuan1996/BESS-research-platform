/* ---------------------------------------------------------------------------
   Storage Duration tab + the Kemerton duration card, verbatim from the
   prototype (lines 2457-2632).
   --------------------------------------------------------------------------- */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { card } from '../../../components/card.js';
import { badge, statusBadge } from '../../../components/badge.js';
import { chip } from '../../../components/chip.js';
import { why } from '../../../components/decisionLogic.js';
import { kpi, bandFor } from '../../../components/metricCard.js';
import { sectionHead } from '../../../components/sectionHeader.js';
import { sourceDrawer, sourceStatusBadge } from '../../../components/sourceDrawer.js';
import { lineChart, barChart, waterfall } from '../../../charts/index.js';
import { state, render } from '../state.js';
import { NF1, fmtN } from '../ui.js';
import { T } from '../text.js';
import { SRC } from '../sources.js';
import { SEED } from '../data/seed.js';
import { KEMERTON, hasProjectData } from '../data/kemerton.js';
import { WITHHELD_NOTICE } from '../../../local/loader.js';
import { dniScore, esrAtYear, kemDurationCase } from '../lib/scores.js';
import { waDesign, waDesignText } from '../lib/design.js';

// ---------------- DURATION ----------------
function renderDuration(main){
  const dni = dniScore(), dband = bandFor(SEED.dniBands, dni);
  sectionHead(main, ['Storage Duration — what will the system require at your COD?', '储能时长 — 项目投运时系统需要多长时长？'],
    ['WA transmits duration value directly through the RCM: the ESR Duration Requirement has moved 4h → 6h → 7h for the 2028-29 Capacity Year. Duration at expected COD is a hard underwriting input, not a background policy note.',
     '西澳通过RCM直接传导时长价值：ESR时长要求已由4小时经6小时升至2028-29容量年度的7小时。预计投运时的时长要求是硬性测算输入，而非背景政策说明。']);
  main.append(h('div', { class: 'kpis' },
    kpi(L(['ESR requirement at COD (' + state.codYear + ')', '投运时ESR要求（' + state.codYear + '）']), esrAtYear(state.codYear) + '<small> h</small>', null, [badge('official'), statusBadge(true)]),
    kpi(L(['ESR Obligation Interval', 'ESR义务时段']), '17:30–21:30<small> AWST</small>', { text: L(['illustrative — verify official file', '示例 — 以官方文件为准']) }, [badge('illus')]),
    kpi(L(['Duration-Need Index', '时长需求指数']), dni + '<small> / 100</small>', { text: L(dband.n) }, [badge('calc')]),
    kpi(L(['Fleet weighted-average duration', '存量加权平均时长']), NF1.format(SEED.fleetAvgHours) + '<small> h</small>', { text: L(['gap to 7 h requirement', '与7小时要求的缺口']) }, [badge('calc')])));
  main.append(why(['Duration is the one requirement in the WA revenue stack that is set administratively, moves in steps, and cannot be retrofitted cheaply. That combination makes it the highest-leverage design decision on this dashboard: it determines the de-rating applied to Capacity Credits, eligibility for the long-dated fixed-price election, and how much of the merchant tail is contestable. Read this tab as answering one question — how many hours must be physically deliverable at COD, and what is the last hour worth on its own?',
    '时长是西澳收入结构中唯一由行政设定、以阶跃方式变动、且难以低成本事后加装的要求。这一组合使其成为本看板杠杆最高的设计决策：它决定容量信用的折减幅度、长期固定价选择权的资格，以及市场化尾部中可竞争部分的比例。本页应被读作回答一个问题 — 投运时须实际可交付多少小时，以及最后一小时自身价值多少？'],
    ['Highest-leverage design decision', '杠杆最高的设计决策']));

  const g = h('div', { class: 'grid g2' });
  durationBody(main, g);
}

// Project-specific duration / fixed-price eligibility — Portfolio tab only.
function kemertonDurationCard(){
  const kemDur = card(['Duration & 10-year fixed-price eligibility', '时长与10年固定价资格'], [sourceStatusBadge(SRC.esoo), badge('project')]);

  /* The card's whole subject is one named project's deliverable duration, so
     there is nothing public to fall back to. It states that the layer is
     withheld rather than disappearing: a reader who has seen this dashboard
     before should be able to tell "not published here" from "no longer
     analysed". The WEM thresholds themselves are public and stay on screen. */
  if (!hasProjectData){
    kemDur.append(h('div', { class:'kpis' },
      kpi(L(['Current fixed-price hurdle','当前固定价门槛']), KEMERTON.duration.fixedPriceBaseThresholdHours + '<small> h</small>', { text:L(['Base-case long-duration threshold','基准长期储能门槛']) }, [badge('final')]),
      kpi(L(['Upper sensitivity','上行情景门槛']), KEMERTON.duration.sensitivityHighHours + '<small> h</small>', { text:L(['Anticipated-project sensitivity','预期项目敏感性']) }, [badge('final')])));
    kemDur.append(h('div', { class:'note' }, L(WITHHELD_NOTICE)));
    kemDur.append(sourceDrawer(SRC.esoo, ['ESR duration requirements, long-duration threshold and sensitivities','ESR时长要求、长期储能门槛及敏感性']));
    return kemDur;
  }

  const dCases = [7,7.5,8,8.5].map(kemDurationCase);
  kemDur.append(h('div', { class:'kpis' },
    kpi(L(['Raw installed duration','原始装机时长']), KEMERTON.project.rawDurationHours + '<small> h</small>', { text:'860 MWh ÷ 100 MW' }, [badge('model')]),
    kpi(L(['Current fixed-price hurdle','当前固定价门槛']), KEMERTON.duration.fixedPriceBaseThresholdHours + '<small> h</small>', { text:L(['Base-case long-duration threshold','基准长期储能门槛']) }, [badge('final')]),
    kpi(L(['Upper sensitivity','上行情景门槛']), KEMERTON.duration.sensitivityHighHours + '<small> h</small>', { text:L(['Anticipated-project sensitivity','预期项目敏感性']) }, [badge('final')]),
    kpi(L(['Eligibility status','资格状态']), L(KEMERTON.duration.eligibilityStatus), { text:L(['Deliverable AC duration remains TBC','可交付交流侧时长待确认']) }, [badge('draft')])));
  kemDur.append(h('div', { class:'threshold' },
    h('div', { class:'threshold-track' }, h('div', { class:'threshold-fill', style:'width:86%;' }),
      ...[[7,'7.0h'],[7.5,'7.5h'],[8,'8.0h'],[8.5,'8.5h'],[8.6,'8.6h']].map((x,i)=>h('span',{class:'threshold-mark'+(i===4?' asset':''),style:`left:${x[0]*10}%;`},x[1])))));
  kemDur.append(h('div', { class:'tbl-wrap' }, h('table', {},
    h('thead',{},h('tr',{},h('th',{},L(['Requirement','要求'])),h('th',{class:'num'},L(['Required energy','所需能量'])),h('th',{class:'num'},L(['Raw headroom','原始裕度'])),h('th',{class:'num'},L(['Headroom %','裕度%'])))),
    h('tbody',{},dCases.map(d=>h('tr',{},h('td',{},d.hours+' h'),h('td',{class:'num'},fmtN(d.required)+' MWh'),h('td',{class:'num'},h('b',{},fmtN(d.headroom)+' MWh')),h('td',{class:'num'},NF1.format(d.pct)+'%')))))));
  kemDur.append(h('div', { class:'warnbox' }, L(['At 8.5 hours, raw energy headroom is only 10 MWh (~1.2%) before auxiliary load, losses, state-of-charge limits, degradation, temperature derating and availability. Do not confirm fixed-price eligibility until deliverable AC energy and sustainable Traded Peak CRC are tested.',
    '在8.5小时情景下，原始能量裕度仅10MWh（约1.2%），尚未扣除辅机、损耗、SOC限制、衰减、温度降额及可用率。在验证交流侧可交付能量及可持续峰值CRC前，不得确认固定价资格。'])));
  kemDur.append(why(['Raw installed duration of ' + KEMERTON.project.rawDurationHours + ' h clears the current ' + KEMERTON.duration.fixedPriceBaseThresholdHours + ' h fixed-price hurdle on paper, but the headroom collapses to about 1% under the 8.5 h sensitivity — before auxiliary load, AC losses, usable state-of-charge window, degradation, temperature derating and availability are deducted. Since eligibility is binary and the fixed price is a ten-year revenue floor, this is not a rounding question: it decides whether the asset is financed against a floor or against merchant risk. Require a tested deliverable-AC-energy figure and a sustainable Traded Peak CRC before treating eligibility as achieved.',
    '原始装机时长' + KEMERTON.project.rawDurationHours + '小时在纸面上满足当前' + KEMERTON.duration.fixedPriceBaseThresholdHours + '小时的固定价门槛，但在8.5小时敏感性下裕度骤降至约1% — 且尚未扣除辅机负荷、交流损耗、可用SOC窗口、衰减、温度降额及可用率。由于资格是二元的、且固定价格构成十年收入底线，这并非取整问题：它决定资产是以保底还是以市场化风险取得融资。在认定资格达成前，须取得经测试的交流侧可交付能量及可持续的峰值CRC。'],
    ['Binary gate, ~1% margin', '二元门槛，裕度约1%']));
  kemDur.append(sourceDrawer(SRC.esoo, ['ESR duration requirements, long-duration threshold and sensitivities','ESR时长要求、长期储能门槛及敏感性']));
  return kemDur;
}

function durationBody(main, g){
  const dni = dniScore(), dband = bandFor(SEED.dniBands, dni);

  const c1 = card(['ESR Duration Requirement trajectory', 'ESR时长要求轨迹'], [badge('official'), statusBadge(true)]);
  const codIdx = SEED.esrYears.indexOf(state.codYear);
  const fit = waDesign(), dText = waDesignText(), esr = esrAtYear('2028-29');
  lineChart(c1, {
    xs: SEED.esrYears, yfmt: v => v + 'h', ymin: 0,
    series: [{ name: ['ESR requirement', 'ESR时长要求'], color: 'var(--s1)', vals: SEED.esrPath, step: true }],
    ann: codIdx >= 0 ? [{ si: 0, i: codIdx, text: L(['your COD', '你的投运年度']) }] : [], h: 220,
  });
  c1.append(h('div', { class: 'cap' }, L(['The 4h → 6h → 7h path is per the specification; exact transition vintages and grandfathering must be verified against WEM ESOO / rule publications before underwriting.',
    '4h→6h→7h路径依据规范；具体过渡年度及祖父条款须在测算前以WEM ESOO及规则文件核验。'])));
  c1.append(h('div', { class: 'reco' }, h('b', {}, L(['Recommendation: ', '建议：'])),
    L(['Build ' + dText[0] + ' for projects reaching COD in 2028–29: the engine’s best capacity design, priced against the ' + esr + '-hour ESR requirement with credits de-rated linearly as the battery fades. FCESS is not the justification for incremental MWh.',
       '对于2028–29年投运的项目，建议按' + dText[1] + '建设：即引擎的最佳容量设计，按' + esr + '小时ESR要求定价，且信用随电池衰减线性折减。FCESS不构成新增MWh的理由。'])));
  c1.append(why(['The step shape is why the requirement, not dispatch, sizes the asset. Requirements have only ever ratcheted up, they apply to the cycle in which credits are allocated, and a shortfall de-rates credits linearly, so a build at exactly ' + esr + ' h loses credit as it fades. The engine prices that loss over the credit term and puts the design at ' + dText[0] + '. Hold a documented augmentation right for the next step rather than building it now.',
    '阶梯形态正是由要求而非调度决定资产规模的原因。该要求历来只上调，适用于信用获配所在周期，且时长不足会导致信用线性折减，因此恰好按' + esr + '小时建设的资产会随衰减逐步损失信用。引擎在信用期内为这一损失定价，给出的设计为' + dText[1] + '。应持有成文的增容权以应对下一阶段，而非现在就建。'],
    ['Build to the engine’s band, hold the option', '按引擎区间建设，持有增容权']));
  g.append(c1);

  // Duration-Need Index (editable)
  const c2 = card(['Duration-Need Index — every component visible and editable', '时长需求指数 — 分项全部可见、可编辑'], [badge('calc'), badge('illus'), statusBadge(true)]);
  const dniHead = h('div', { style: 'display:flex;align-items:center;gap:12px;margin:8px 0;flex-wrap:wrap;' },
    h('span', { style: 'font-size:var(--fs-2xl);font-weight:var(--fw-medium);' }, dni + ' / 100'), chip(dband.c, L(dband.n)));
  c2.append(dniHead);
  c2.append(h('div', { class: 'meter' }, h('div', { style: `width:${dni}%;background:var(--s1);` })));
  c2.append(h('div', { class: 'cap', style: 'margin-top:6px;' }, L(dband.d)));
  c2.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(T.factor)), h('th', { class: 'num' }, L(T.weight)), h('th', { class: 'num' }, L(T.score) + ' (0–3)'))),
    h('tbody', {}, SEED.dniFactors.map((f, i) => h('tr', {},
      h('td', {}, L(f.n)), h('td', { class: 'num' }, f.w + '%'),
      h('td', { class: 'num' }, (() => {
        const sel = h('select', { class: 'inp', style: 'width:64px;', onchange: e => { SEED.dniFactors[i].s = +e.target.value; render(); } },
          [0, 1, 2, 3].map(v => { const o = h('option', { value: v }, String(v)); if (v === f.s) o.selected = true; return o; }));
        return sel;
      })())))))));
  c2.append(h('div', { class: 'cap' }, L(['Screening tool only — not a substitute for dispatch and capacity-credit modelling (spec §9.5).', '仅为筛选工具 — 不能替代调度与容量信用建模（规范§9.5）。'])));
  c2.append(why(['The index is fully editable precisely so it can be argued with — the score matters less than which factors carry it. At ' + dni + '/100 the band is "' + L(dband.n) + '", and the weight sits on duration-differentiated capacity rules (15%), evening-ramp length (15%) and thermal-replacement gap (12%) rather than on price signals, which score low. That is the honest position: WA’s duration case is a rules-and-physics case, not yet a price case. Set the two lowest-scoring factors as monitored triggers — if the long-duration price signal ever strengthens, the case moves from policy-dependent to market-supported.',
    '该指数完全可编辑，正是为了便于被质疑 — 分数本身不如"由哪些因子支撑"重要。当前' + dni + '/100，区间为"' + L(dband.n) + '"，权重集中于按时长差异化的容量规则（15%）、晚高峰爬坡时长（15%）与火电替代缺口（12%），而价格信号类因子得分偏低。这是诚实的判断：西澳的时长论据目前是规则与物理论据，尚不是价格论据。应将得分最低的两个因子设为监测触发条件 — 一旦长时段价格信号转强，该论据即由依赖政策转为市场支撑。'],
    ['Rules-and-physics case, not price', '规则与物理论据，非价格']));
  g.append(c2);

  const c3 = card(['Fleet vs probability-weighted pipeline by duration — MW', '存量与概率加权管线的时长分布 — MW'], [badge('illus'), statusBadge(true)]);
  barChart(c3, {
    xs: SEED.durBuckets, yfmt: fmtN,
    series: [
      { name: ['Operating fleet MW', '已投运MW'], color: 'var(--s1)', vals: SEED.fleetByDurMW },
      { name: ['Pipeline MW (prob-wt)', '管线MW（概率加权）'], color: 'var(--s2)', vals: SEED.pipeByDurMW },
    ], h: 230,
  });
  barChart(c3, {
    xs: SEED.durBuckets, yfmt: fmtN,
    series: [
      { name: ['Operating fleet MWh', '已投运MWh'], color: 'var(--s1)', vals: SEED.fleetByDurMWh },
      { name: ['Pipeline MWh (prob-wt)', '管线MWh（概率加权）'], color: 'var(--s2)', vals: SEED.pipeByDurMWh },
    ], h: 230,
  });
  c3.append(h('div', { class: 'cap' }, L(['MW saturation and MWh scarcity are tracked separately (spec §2.3): the pipeline is shifting toward ≥6h as short-duration MW saturates.',
    'MW饱和与MWh稀缺分别跟踪（规范§2.3）：随着短时MW饱和，管线正转向6小时以上配置。'])));
  c3.append(why(['The operating fleet has essentially nothing at ≥8 h while the probability-weighted pipeline does — so the duration advantage available today is a timing advantage that closes as that pipeline delivers. Two decisions follow. First, the competitive comparison for a new long-duration asset is the pipeline, not the operating fleet, so track competitor MWh by duration bucket rather than by total MW. Second, because MW and MWh saturate at different times, a design should be judged on its MWh position in the ≥6 h buckets — that is where the remaining scarcity is.',
    '在运机组在≥8小时区间基本为零，而概率加权管线则不然 — 因此当前可获得的时长优势本质是时点优势，并随该管线投运而收窄。由此得出两项决策。第一，新建长时资产的竞争参照是管线而非在运机组，因此应按时长区间跟踪竞争者MWh，而非总MW。第二，由于MW与MWh的饱和时点不同，方案评估应看其在≥6小时区间的MWh位置 — 剩余稀缺性正集中于此。'],
    ['Compete with the pipeline, not the fleet', '竞争对象是管线而非在运机组']));
  g.append(c3);

  const c4 = card(['Marginal value of the 8th hour (7h → 8h), A$k/MW/yr', '第8小时的边际价值（7h→8h），A$k/MW/年'], [badge('illus'), statusBadge(true)]);
  waterfall(c4, { steps: SEED.marginalHour.map(s => ({ l: s.l, v: s.v, t: s.t })), yfmt: v => (v < 0 ? '−' : '') + 'A$' + Math.abs(v) + 'k', zeroBase: true, h: 270 });
  c4.append(h('div', { class: 'cap' }, L(['Under lender-downside assumptions the 10th hour turns NPV-negative in this seed case — reprice added MWh (spec §5.2 mandatory trigger). Compare designs on incremental NPV of the final added hour, never headline IRR alone.',
    '在贷款人下行情景下，本种子案例中第10小时的增量NPV转负 — 应对新增MWh重新定价（规范§5.2强制触发条件）。方案比较须基于最后新增小时的增量NPV，而非仅项目IRR。'])));
  c4.append(why(['The 8th hour is worth about +A$4k/MW/yr net, and most of the gross value (A$18k) is RCM duration compliance rather than arbitrage (A$9k) — so the incremental hour is bought from the capacity mechanism, not from the market. Two implications. The margin is thin enough that a change in either the annualised capex charge or the duration rule flips the sign, which is why this must be re-run per design rather than assumed. And because the value is compliance-driven, the hour is worth far more just below the requirement threshold than just above it — the economics are a step function, not a smooth curve.',
    '第8小时净值约为+A$4k/MW/年，其毛价值中大部分（A$18k）来自RCM时长合规，而非套利（A$9k） — 因此增量小时的价值是从容量机制、而非市场购得。由此有两点含义。其一，该边际过薄，年化资本费用或时长规则任一变动即可使正负反转，因此必须按方案逐一重算，而不能沿用假设。其二，由于价值由合规驱动，处于要求门槛之下的小时价值远高于门槛之上者 — 其经济性是阶跃函数，而非平滑曲线。'],
    ['Compliance buys the hour, not arbitrage', '购买该小时的是合规而非套利']));
  g.append(c4);

  const c5 = card(['Residual-peak feedback loop', '剩余峰值反馈回路'], []);
  c5.append(h('div', { class: 'flow' },
    h('span', { class: 'fbox' }, L(['More batteries enter', '更多电池投运'])), h('span', { class: 'farr' }, '→'),
    h('span', { class: 'fbox' }, L(['Sharp peak is reduced', '尖峰被削平'])), h('span', { class: 'farr' }, '→'),
    h('span', { class: 'fbox' }, L(['Remaining peak becomes longer and flatter', '剩余峰值更长更平'])), h('span', { class: 'farr' }, '→'),
    h('span', { class: 'fbox' }, L(['Short-duration arbitrage and FCESS compress', '短时套利与FCESS收益压缩'])), h('span', { class: 'farr' }, '→'),
    h('span', { class: 'fbox', style: 'border-color:var(--s1);font-weight:var(--fw-medium);' }, L(['Full capacity value requires longer discharge', '足额容量价值需要更长放电时长']))));
  c5.append(h('div', { class: 'note' }, L(['WA embeds duration in a recurring capacity mechanism (ESR requirement, Peak/Flexible credits, BRCP benchmark); the NEM procures duration through tenders and contracts (CIS, LTESA). The comparator is context only and never feeds WA\'s grades.',
    '西澳通过周期性容量机制内嵌时长价值（ESR要求、峰值/灵活容量信用、BRCP基准）；NEM主要通过招标与合同采购时长（CIS、LTESA）。该对比仅为背景信息，绝不计入西澳的评级。'])));
  c5.append(why(['This loop is why the duration signal is self-reinforcing and the short-duration signal is self-defeating. Every battery that enters shaves the sharp peak, which lengthens and flattens what remains, which raises the hours needed for full capacity value and compresses the narrow window short-duration assets compete in. So competitor entry damages a 2-hour asset and strengthens the case for an 8-hour one. That is the structural reason to accept a higher capex per MW in exchange for hours: the hours are the part of the design that competitor behaviour makes more valuable, not less.',
    '该回路解释了为何时长信号自我强化、而短时信号自我削弱。每一个投运的电池都削平尖峰，使剩余峰值更长更平，从而抬高取得足额容量价值所需的小时数，并压缩短时资产竞争的狭窄窗口。因此竞争者进入会损害2小时资产，却强化8小时资产的论据。这正是应接受更高单位MW造价以换取小时数的结构性原因：小时数是设计中唯一会因竞争者行为而更具价值、而非更不值钱的部分。'],
    ['Entry hurts 2h, helps 8h', '进入者损害2h、有利8h']));
  g.append(c5);

  // augmentation checklist
  if (!state.aug) state.aug = SEED.augDefaults.slice();
  const augScore = state.aug.reduce((a, b) => a + b, 0);
  const augBand = augScore <= 5 ? { n: ['Low flexibility — duration forecast error is a material risk', '灵活性低 — 时长预测误差构成重大风险'], c: 'critical' }
    : augScore <= 12 ? { n: ['Moderate flexibility — require capex & permitting plan', '中等灵活性 — 需资本开支与审批计划'], c: 'warn' }
    : { n: ['Strong real option — staged MWh investment may be preferable', '强实物期权 — 分期MWh投资可能更优'], c: 'good' };
  const c6 = card(['Augmentation-readiness score (0–2 each)', '增容准备度评分（每项0–2分）'], [badge('illus'), statusBadge(true)]);
  c6.append(h('div', { style: 'display:flex;align-items:center;gap:12px;margin:8px 0;flex-wrap:wrap;' },
    h('span', { style: 'font-size:var(--fs-2xl);font-weight:var(--fw-medium);' }, augScore + ' / 18'), chip(augBand.c, L(augBand.n))));
  c6.append(h('div', { class: 'tbl-wrap' }, h('table', {}, h('tbody', {}, SEED.augItems.map((it, i) => h('tr', {},
    h('td', {}, L(it)),
    h('td', { class: 'num' }, (() => {
      const sel = h('select', { class: 'inp', style: 'width:64px;', onchange: e => { state.aug[i] = +e.target.value; render(); } },
        [0, 1, 2].map(v => { const o = h('option', { value: v }, String(v)); if (v === state.aug[i]) o.selected = true; return o; }));
      return sel;
    })())))))));
  c6.append(h('div', { class: 'cap' }, L(['Augmentation flexibility is a financial real option: it reduces the cost of being wrong about future duration (spec §2.6.7).',
    '增容灵活性是一项金融实物期权：它降低了对未来时长判断出错的代价（规范§2.6.7）。'])));
  c6.append(why(['Score this honestly, because it is the cheapest hedge available against the one variable that has only ever moved against short assets. A high score means the duration decision can be staged — build ' + (fit ? fit.hours : '—') + ' h now, add MWh when the requirement moves — which converts a forecasting problem into a timing problem. A low score means today’s duration choice is effectively irreversible, and the case should be underwritten at the highest plausible future requirement instead. The two items that most often fail are grid-approval treatment of MWh-only augmentation and OEM augmentation rights; both must be contractual, not assumed.',
    '此项应如实评分，因为它是针对唯一始终对短时资产不利的变量所能获得的最低成本对冲。高分意味着时长决策可以分期 — 现在建' + (fit ? fit.hours : '—') + '小时，待要求上调时再加MWh — 从而将预测问题转化为时点问题。低分意味着当前时长选择实质不可逆，方案应改按可预见的最高未来要求承销。最常不达标的两项是"仅增MWh的并网审批处理"与"OEM增容权利"；两者均须以合同落实，不可假设。'],
    ['Staged build needs contractual rights', '分期建设需合同化权利']));
  g.append(c6);
  main.append(g);

  // Three distinct duration questions — the definitional discipline behind the design choice
  const cQ = card(['Duration answers three different questions', '时长回答三个不同问题'], [badge('calc'), badge('official')]);
  cQ.append(h('div', { class: 'note' }, L(['These three questions have three different answers, three different sources and three different consequences. Conflating them is the most common analytical error in WA storage: a design can be economically dispatched for fewer hours than it must physically hold to keep its Capacity Credits.',
    '这三个问题有三个不同答案、三个不同来源、三个不同后果。将其混为一谈是西澳储能分析中最常见的错误：某一方案可经济调度的小时数，可能少于其为保持容量信用而必须实际具备的小时数。'])));
  const qrows = [
    [['1 · Market-use duration', '1 · 市场可用时长'], ['How many hours can be economically dispatched', '有多少小时可经济地调度'], ['~6 h — a supplementary third-party dispatch study puts economic utilisation near 25% of DSOC, so hours beyond ~6 are lightly used on merchant grounds alone', '约6小时 — 补充性第三方调度研究显示经济利用率约为DSOC的25%，因此仅从市场化角度看，约6小时以上的部分利用率偏低'], 'supp'],
    [['2 · Capacity-accreditation duration', '2 · 容量认证时长'], ['Hours required to preserve Capacity Credits', '维持容量信用所需的小时数'], [esrAtYear(state.codYear) + ' h ESR requirement for ' + state.codYear + ', set in Trading Intervals by the applicable Reserve Capacity Cycle', state.codYear + '为' + esrAtYear(state.codYear) + '小时ESR要求，按适用容量周期以交易时段设定'], 'official'],
    [['3 · Installed / expandable duration', '3 · 装机/可扩展时长'], ['Physical design plus a contractual augmentation option', '物理设计加合同化增容选择权'], [dText[0] + ' at COD, the engine’s design — sized to question 2, not question 1', '投运时' + dText[1] + '，即引擎设计 — 依据问题2而非问题1配置'], 'calc'],
  ];
  cQ.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Question', '问题'])), h('th', {}, L(['Definition', '定义'])), h('th', {}, L(['Answer', '答案'])), h('th', {}, L(['Source', '来源'])))),
    h('tbody', {}, qrows.map(r => h('tr', {}, h('td', {}, h('b', {}, L(r[0]))), h('td', {}, L(r[1])), h('td', {}, L(r[2])), h('td', {}, badge(r[3]))))))));
  cQ.append(h('div', { class: 'flow' },
    h('span', { class: 'fbox' }, L(['Q1 · economically dispatched ~6 h', '问题1 · 经济调度约6小时'])), h('span', { class: 'farr' }, '<'),
    h('span', { class: 'fbox' }, L(['Q2 · must hold ' + esrAtYear(state.codYear) + ' h to keep credits', '问题2 · 须具备' + esrAtYear(state.codYear) + '小时以保留信用'])), h('span', { class: 'farr' }, '≤'),
    h('span', { class: 'fbox', style: 'border-color:var(--s1);font-weight:var(--fw-medium);' }, L(['Q3 · build ' + (fit ? fit.hours : '—') + ' h, the engine’s design', '问题3 · 建' + (fit ? fit.hours : '—') + '小时（引擎设计）']))));
  cQ.append(why(['The inequality is the design rule: build to the accreditation requirement, not to the economically-dispatched hours. Hours between question 1 and question 2 look idle in a dispatch model but are earning capacity revenue by keeping credits un-derated — which is why a pure dispatch optimisation will always recommend a shorter asset than the RCM rewards. When a model and the rules disagree on duration, the rules win, because they set the revenue the debt is sized against.',
    '该不等式即设计准则：应按认证要求建设，而非按经济调度小时数建设。介于问题1与问题2之间的小时在调度模型中看似闲置，实则通过避免信用折减而赚取容量收入 — 这正是纯调度优化总会建议比RCM所奖励更短的资产的原因。当模型与规则在时长上不一致时，以规则为准，因为规则决定债务规模所依据的收入。'],
    ['Rules win over dispatch models', '规则优先于调度模型']));
  cQ.style.marginTop = '14px';
  main.append(cQ);
}

export { renderDuration, kemertonDurationCard, durationBody };
