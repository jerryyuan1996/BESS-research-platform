/* ---------------------------------------------------------------------------
   Ten-Year BRCP Forecast, verbatim from the prototype (lines 1983-2170).
   Rendered as the tail of the RCM tab, as in the prototype.
   --------------------------------------------------------------------------- */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { card } from '../../../components/card.js';
import { badge, statusBadge } from '../../../components/badge.js';
import { chip } from '../../../components/chip.js';
import { why } from '../../../components/decisionLogic.js';
import { sectionHead } from '../../../components/sectionHeader.js';
import { barChart, waterfall, bandChart } from '../../../charts/index.js';
import { state, render } from '../state.js';
import { fmtN } from '../ui.js';
import { T } from '../text.js';
import { BRCP } from '../data/brcp.js';
import { brcpCRF, brcpScenario, brcpForecast, brcpSensitivities, brcpExpectedRcp } from '../lib/brcpEngine.js';

// ---------------- §6.6 Ten-Year BRCP Forecast ----------------
function knobField(label, val, setter){
  return h('div', {}, h('label', {}, L(label)),
    h('input', { class: 'inp', type: 'number', step: 'any', value: val, onchange: e => { setter(+e.target.value); render(); } }));
}
function renderBrcp(main){
  const F = brcpForecast();
  const yf = v => 'A$' + fmtN(v / 1000) + 'k';
  const real = !!state.brcpReal;
  const disp = arr => real ? arr.map((v, i) => v / Math.pow(1 + BRCP.genInfl, i)) : arr;
  const lowA = F.map(f => f.low), baseA = F.map(f => f.base), highA = F.map(f => f.high);

  sectionHead(main, ['§6.6 Ten-Year BRCP Forecast — capacity-price anchor from project COD', '§6.6 十年BRCP预测 — 从项目投运推算容量价格锚'],
    ['Only the 2028-29 BRCP (A$488,500/MW/yr) is an official ERA determination. All later years are calculated / indicative from a transparent cost-stack model that reproduces the official 2028-29 value within rounding. This is a model output, not an ERA or AEMO forecast.',
     '仅2028-29 BRCP（A$488,500/MW/年）为ERA官方决定。其后各年均为基于透明成本堆栈模型的计算/示意值，该模型可在取整误差内复现官方2028-29数值。此为模型输出，并非ERA或AEMO预测。']);

  main.append(h('div', { class: 'warnbox' }, h('b', {}, L(['BRCP is not RCP. ', 'BRCP不等于RCP。'])),
    L(['BRCP is a cost-of-new-entry benchmark — the annualised fixed cost of the benchmark technology. Expected RCP is what Capacity Credit holders are actually paid: BRCP adjusted for supply/demand under the ESM Rules ±5% deadband. Supply-demand tightness does not mechanically change BRCP each year; it changes RCP directly and BRCP only indirectly, through future ESR duration, benchmark-technology reviews and connection cost.',
       'BRCP是新进入者成本基准 — 即基准技术的年化固定成本。预期RCP是容量信用持有人实际获得的价格：在ESM规则±5%不调整区间下按供需调整后的BRCP。供需松紧不会逐年机械地改变BRCP；它直接改变RCP，仅通过未来ESR时长、基准技术审查及并网成本间接影响BRCP。'])));

  const g = h('div', { class: 'grid g2' });

  // 1) fan chart
  const c1 = card(['BRCPForecastFanChart — low / base / high', 'BRCP预测扇形图 — 低/基准/高'], [badge('official'), badge('calc'), statusBadge(true)]);
  c1.append(h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:8px 0 4px;' },
    h('button', { class: 'btn' + (!real ? ' active' : ''), onclick: () => { state.brcpReal = false; render(); } }, L(['Nominal A$', '名义A$'])),
    h('button', { class: 'btn' + (real ? ' active' : ''), onclick: () => { state.brcpReal = true; render(); } }, L(['Real (2028 A$)', '实际（2028年A$）']))));
  bandChart(c1, { xs: BRCP.years, yfmt: yf, low: disp(lowA), base: disp(baseA), high: disp(highA),
    official: { i: 0, y: BRCP.officialBrcp }, zones: BRCP.zones, h: 300 });
  c1.append(h('div', { class: 'legend' },
    h('span', { class: 'li' }, h('span', { class: 'lg-line', style: 'border-top-color:var(--s1)' }), L(['Base', '基准'])),
    h('span', { class: 'li' }, h('span', { class: 'lg-line dash', style: 'border-top-color:var(--s1)' }), L(['Low / High band', '低/高区间'])),
    h('span', { class: 'li' }, h('span', { class: 'lg-swatch', style: 'background:var(--ink)' }), L(['Official 2028-29', '官方2028-29']))));
  c1.append(h('div', { class: 'cap' }, L(['Confidence widens with horizon: official (2028-29) · near-term high (2029-31) · medium (2031-36) · extrapolated (2036-38; official AEMO demand ends 2035-36).',
    '置信度随时间递减：官方（2028-29）· 近期高置信（2029-31）· 中期（2031-36）· 外推（2036-38；官方AEMO需求止于2035-36）。'])));
  c1.append(why(['Switch to real dollars and the fan turns down — that is the whole investment message. In nominal terms the capacity-price anchor holds or drifts up, so a nominal-revenue model looks safe; in constant dollars it erodes as battery learning outpaces the duration ratchet. Underwrite the real path, because your capex is spent once at today’s prices while the revenue anchor is re-determined annually against a machine that keeps getting cheaper. Practical use: judge terminal value and any refinancing assumption off the real base, not the nominal line.',
    '切换为实际价格后扇形转为下行 — 这就是全部投资含义。以名义价计，容量价格锚持平或略升，因此名义收入模型看似安全；以不变价计则因电池学习快于时长抬升而侵蚀。应按实际路径承销，因为资本开支按今天价格一次性支出，而收入锚每年对照一台持续变便宜的参考机组重新确定。实务用法：终值与任何再融资假设应以实际基准而非名义线判断。'],
    ['Underwrite the real path', '按实际价格路径承销']));
  g.append(c1);

  // 2) forecast table
  const c2 = card(['Indicative ten-year BRCP (A$000/MW/yr)', '十年BRCP指示值（A$000/MW/年）'], [badge('calc'), badge('illus'), statusBadge(true)]);
  const confChip = c => c === 'OFFICIAL' ? chip('good', 'OFFICIAL') : c === 'HIGH' ? chip('info', L(['High', '高'])) : c === 'MEDIUM' ? chip('warn', L(['Medium', '中'])) : chip('serious', L(['Very low', '很低']));
  c2.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Cap. Year', '容量年度'])), h('th', { class: 'num' }, L(['Dur.', '时长'])), h('th', { class: 'num' }, L(['Low', '低'])), h('th', { class: 'num' }, L(['Base', '基准'])), h('th', { class: 'num' }, L(['High', '高'])), h('th', { class: 'num' }, L(['Real base', '实际基准'])), h('th', {}, L(['Confidence', '置信度'])))),
    h('tbody', {}, F.map(f => h('tr', {},
      h('td', {}, h('b', {}, f.cy)), h('td', { class: 'num' }, f.dur + 'h'),
      h('td', { class: 'num' }, fmtN(f.low / 1000)), h('td', { class: 'num' }, h('b', {}, fmtN(f.base / 1000))), h('td', { class: 'num' }, fmtN(f.high / 1000)),
      h('td', { class: 'num' }, fmtN(f.real / 1000)), h('td', {}, confChip(f.conf))))))));
  c2.append(h('div', { class: 'cap' }, L(['Nominal base rises ~A$488.5k (2028-29) → ~A$550k (2037-38), ≈1.3% CAGR; in constant 2028 dollars it declines to ~A$441k as battery learning and WACC normalisation outweigh longer duration and WA cost inflation.',
    '名义基准由约A$488.5k（2028-29）升至约A$550k（2037-38），约1.3%年化；以2028年不变价计则降至约A$441k，电池学习与WACC正常化超过时长延长与西澳成本通胀。'])));
  c2.append(why(['Only the first row is an ERA determination; every later row is this dashboard’s cost-stack model and carries a declining confidence tag. Use the table for two decisions and nothing else: whether a fixed-price election looks attractive against the modelled floating path, and whether your terminal value assumption is defensible. Never present the out-years as a price forecast to a lender — the confidence column exists precisely so a low-confidence row cannot silently become a base-case revenue input.',
    '仅首行为ERA决定；其后各行均为本看板的成本堆栈模型，并附有递减的置信度标签。该表仅应用于两项决策：固定价选择相对模型化浮动路径是否有吸引力，以及终值假设是否可辩护。切勿向贷款人将远年数值作为价格预测呈现 — 置信度列的存在，正是为了防止低置信度行悄然成为基准情景收入输入。'],
    ['One official row, nine modelled', '一行官方，九行模型']));
  g.append(c2);

  // 3) cost-stack calibration base
  const c3 = card(['2028-29 cost-stack calibration base (A$m)', '2028-29成本堆栈校准基准（A$m）'], [badge('official'), statusBadge(false)]);
  const stackRows = [[['Modules', '电池模块'], BRCP.stack.modules], [['PCS', 'PCS'], BRCP.stack.pcs], [['BOP', '其他设备'], BRCP.stack.bop],
    [['Construction', '建设'], BRCP.stack.construction], [['Land', '土地'], BRCP.stack.land], [['Connection', '并网'], BRCP.stack.connection],
    [['Indirect', '间接'], BRCP.stack.indirect], [['Cap. WACC', '资本化WACC'], BRCP.stack.financing]];
  barChart(c3, { xs: stackRows.map(r => L(r[0])), yfmt: v => 'A$' + fmtN(v) + 'm', rotX: true,
    series: [{ name: ['Capital cost', '资本成本'], color: 'var(--s1)', vals: stackRows.map(r => r[1]) }], h: 250 });
  c3.append(h('div', { class: 'cap' }, L(['Total capital A$625.64m + fixed O&M A$11.40m/yr, annualised over 15 years at 10.85% WACC ÷ 200 MW = A$488,445/MW/yr — reproducing the official A$488,500 within rounding. Battery modules (35%) are the largest single component and the main lever for learning-driven cost decline.',
    '资本合计A$625.64m + 固定运维A$11.40m/年，按15年、10.85% WACC年化 ÷ 200 MW = A$488,445/MW/年 — 在取整误差内复现官方A$488,500。电池模块（35%）为最大单项，也是学习驱动降本的主要杠杆。'])));
  c3.append(why(['Reproducing the official number from a transparent stack is what makes the forward years usable: the same stack can be re-run when any one input moves, so a BRCP change becomes explainable rather than an announcement to react to. Note the 10.85% WACC and 15-year annualisation — the benchmark is a high-return, medium-life reference machine, which is why the capacity price is generous relative to a pure cost-of-debt view and why WACC is the second-largest lever after modules.',
    '以透明堆栈复现官方数值，正是远年数值可用的前提：任一输入变动即可重算同一堆栈，使BRCP变化变得可解释，而非只能被动应对的公告。请注意10.85% WACC与15年年化 — 该基准是高回报、中等寿命的参考机组，这既解释了容量价格相对纯债务成本视角为何偏高，也说明WACC是模块之后的第二大杠杆。'],
    ['Stack is auditable, so forecast is usable', '堆栈可审计，预测才可用']));
  g.append(c3);

  // 4) driver waterfall (year-selectable)
  if (!state.brcpWfTo) state.brcpWfTo = 1;
  const ti = Math.min(Math.max(1, state.brcpWfTo), 9), fa = brcpScenario('base'), yA = fa[ti - 1], yB = fa[ti];
  const crfA = brcpCRF(yA.wacc), crfB = brcpCRF(yB.wacc), CC = BRCP.expectedCC;
  const keys = [['modules', ['Battery modules', '电池模块']], ['pcs', ['PCS', 'PCS']], ['bop', ['Balance of plant', '其他设备']],
    ['construction', ['Construction', '建设']], ['land', ['Land', '土地']], ['connection', ['Connection', '并网']], ['indirect', ['Indirect', '间接']]];
  const wfSteps = [{ l: [yA.cy + ' base', yA.cy + ' 基准'], v: yA.brcp / 1000, t: 'start' }];
  for (const [k, lab] of keys) wfSteps.push({ l: lab, v: (yB.comp[k] - yA.comp[k]) * crfA / CC * 1e3, t: 'd' });
  wfSteps.push({ l: ['WACC / financing', 'WACC/融资'], v: ((yB.comp.financing - yA.comp.financing) * crfA + yB.capital * (crfB - crfA)) / CC * 1e3, t: 'd' });
  wfSteps.push({ l: ['Fixed O&M', '固定运维'], v: (yB.comp.om - yA.comp.om) / CC * 1e3, t: 'd' });
  wfSteps.push({ l: [yB.cy + ' base', yB.cy + ' 基准'], v: yB.brcp / 1000, t: 'total' });
  const c4 = card(['BRCPDriverWaterfall (base case, A$000/MW/yr)', 'BRCP驱动因素瀑布图（基准，A$000/MW/年）'], [badge('calc'), badge('illus'), statusBadge(true)]);
  c4.append(h('div', { style: 'margin:6px 0;' }, h('label', { style: 'font-size:11px;color:var(--muted);margin-right:6px;' }, L(['Year transition', '年度过渡'])),
    (() => { const sel = h('select', { class: 'inp', style: 'width:auto;display:inline-block;', onchange: e => { state.brcpWfTo = +e.target.value; render(); } },
      BRCP.years.slice(1).map((cy, idx) => { const o = h('option', { value: idx + 1 }, BRCP.years[idx] + ' → ' + cy); if (idx + 1 === ti) o.selected = true; return o; })); return sel; })()));
  waterfall(c4, { steps: wfSteps, yfmt: v => (v < 0 ? '−' : '') + 'A$' + fmtN(Math.abs(v)) + 'k', floor: Math.min(yA.brcp, yB.brcp) / 1000 - 35, h: 280 });
  c4.append(h('div', { class: 'cap' }, L(['Additive cost-component attribution. Duration step-ups flow through modules, BOP, construction and O&M; the WACC bucket combines the financing-component change and the annualisation (CRF) change.',
    '按成本分项的可加归因。时长阶跃通过模块、其他设备、建设及运维体现；WACC项合并了融资分项变化与年化系数(CRF)变化。'])));
  c4.append(why(['Step through the year transitions and the pattern is consistent: duration step-ups push BRCP up in discrete jumps, module learning pushes it down smoothly. That asymmetry is the actionable insight — the upward moves are policy events with announcement dates you can monitor (benchmark technology reviews, ESR determinations), while the downward drift is continuous. So a fixed-price election is most valuable immediately after a duration step-up and least valuable just before one.',
    '逐年查看过渡即可看出一致规律：时长抬升以离散跳跃推高BRCP，模块学习则平滑压低。这种不对称性是可操作的洞见 — 上行由具备公告日期、可监测的政策事件驱动（基准技术审查、ESR决定），下行则是连续的。因此固定价选择在时长抬升刚发生后价值最高，在其即将发生前价值最低。'],
    ['Up in steps, down in drift', '上行阶跃、下行渐进']));
  g.append(c4);
  main.append(g);

  // 5) BRCP vs expected RCP + supply/demand overlay
  const rcp = brcpExpectedRcp(baseA);
  const c5 = card(['BRCPvsRCPBridge — supply/demand overlay (2026 ESOO)', 'BRCP与预期RCP桥接 — 供需叠加（2026 ESOO）'], [badge('official'), badge('illus'), statusBadge(true)]);
  c5.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Cap. Year', '容量年度'])), h('th', { class: 'num' }, L(['Peak RCT', '峰值RCT'])), h('th', { class: 'num' }, L(['E+C balance', '现有+已承诺'])), h('th', { class: 'num' }, L(['Incl. anticipated', '含预期'])), h('th', { class: 'num' }, L(['Base BRCP', '基准BRCP'])), h('th', { class: 'num' }, L(['Expected RCP', '预期RCP'])), h('th', {}, ''))),
    h('tbody', {}, BRCP.esoo.map((e, i) => h('tr', {},
      h('td', {}, h('b', {}, e.cy)), h('td', { class: 'num' }, fmtN(e.rct)),
      h('td', { class: 'num' }, e.ec == null ? '—' : (e.ec > 0 ? '+' : '') + fmtN(e.ec)), h('td', { class: 'num' }, e.ant == null ? '—' : (e.ant > 0 ? '+' : '') + fmtN(e.ant)),
      h('td', { class: 'num' }, yf(baseA[i])), h('td', { class: 'num' }, rcp[i] == null ? '—' : yf(rcp[i])),
      h('td', {}, e.ec == null ? chip('warn', L(['extrapolated', '外推'])) : (e.ant < 0 ? chip('serious', L(['short', '偏紧'])) : chip('good', L(['surplus', '过剩']))))))))));
  c5.append(h('div', { class: 'note' }, L(['Near-term surplus (2028-31) can depress RCP relative to BRCP if committed projects arrive on time; the medium-term shortfall (2031-36) supports RCP at or above the deadband-neutral level and can raise future ESR duration — an indirect upward channel on BRCP. Expected RCP here is a stylised BRCP × supply/demand factor, not a rules-exact RCP forecast (spec §6.6.6 / Appendix B).',
    '近期过剩（2028-31）若已承诺项目按时投运，可能压低RCP相对BRCP；中期缺口（2031-36）支撑RCP处于或高于中性水平，并可能抬高未来ESR时长 — 对BRCP形成间接上行通道。此处预期RCP为BRCP×供需因子的简化示意，并非精确规则RCP预测（规范§6.6.6/附录B）。'])));
  c5.append(why(['This table is the timing decision in one view: surplus rows compress RCP in the early years of a 2028-29 COD, shortfall rows support it from the early 2030s. A project entering at the start of the surplus therefore takes the price compression first and the recovery later — which is exactly the shape a 10-year fixed-price election is designed to smooth. Test both: floating captures the 2030s recovery, fixed protects the surplus years, and the choice turns on whether debt service is tightest early or late.',
    '本表将时点决策浓缩为一张视图：盈余年份压低2028-29投运项目早期的RCP，缺口年份自2030年代初起给予支撑。因此在盈余期初进入的项目先承受价格压缩、后享受回升 — 这正是10年固定价选择所要平滑的形态。两者均须测试：浮动可捕捉2030年代回升，固定可保护盈余年份，取舍取决于偿债压力集中于前期还是后期。'],
    ['Fixed vs floating is a timing call', '固定与浮动是时点选择']));
  c5.style.marginTop = '14px';
  main.append(c5);

  // 6) sensitivities + benchmark timeline
  const g2 = h('div', { class: 'grid g2' });
  const c6 = card(['One-factor sensitivities around the 2028-29 benchmark', '2028-29基准的单因素敏感性'], [badge('calc'), statusBadge(false)]);
  c6.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Change in input', '输入变化'])), h('th', { class: 'num' }, L(['Approx. BRCP impact', '约BRCP影响'])))),
    h('tbody', {}, brcpSensitivities().map(r => h('tr', {}, h('td', {}, L(r.n)), h('td', { class: 'num' }, (r.v >= 0 ? '+' : '−') + 'A$' + fmtN(Math.abs(r.v)) + '/MW/yr')))))));
  c6.append(h('div', { class: 'cap' }, L(['Computed dynamically from the active cost stack (spec §6.6.11) — duration is the largest single step-change risk. Adding one hour ≈ +A$48k/MW/yr; a 100 bp WACC move ≈ +A$26k; a 10% module-cost fall ≈ −A$19k.',
    '由当前成本堆栈动态计算（规范§6.6.11） — 时长是最大的单一阶跃风险。增加一小时≈+A$48k/MW/年；WACC上升100基点≈+A$26k；模块成本下降10%≈−A$19k。'])));
  c6.append(why(['One extra benchmark hour is worth roughly twice a 100 bp WACC move and about 2.5× a 10% module-price fall. Duration is therefore the dominant BRCP variable, and it is set by policy rather than markets — so the highest-value monitoring effort is the benchmark technology review and ESR determination calendar, not cost indices. It also means a project whose own duration sits at or above the forward benchmark is structurally hedged against the largest single driver of the price it will be paid.',
    '增加一小时基准时长的影响约为WACC变动100基点的两倍、模块价格下降10%的约2.5倍。因此时长是BRCP的主导变量，且由政策而非市场决定 — 监测价值最高的对象是基准技术审查与ESR决定的时间表，而非成本指数。这也意味着自身时长达到或高于前瞻基准的项目，对其所获价格的最大单一驱动因素形成了结构性对冲。'],
    ['Duration dominates; policy sets it', '时长主导，且由政策决定']));
  g2.append(c6);

  const c7 = card(['BenchmarkTechnologyTimeline', '基准技术时间轴'], [badge('official'), badge('illus'), statusBadge(true)]);
  c7.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Cap. Year', '容量年度'])), h('th', {}, L(['Benchmark technology', '基准技术'])), h('th', {}, L(['Basis', '依据'])), h('th', {}, L(['Status', '状态'])))),
    h('tbody', {}, BRCP.tech.map(t => h('tr', {},
      h('td', {}, h('b', {}, t.cy)), h('td', {}, L(t.t)), h('td', {}, L(t.m)), h('td', {}, t.off ? badge('official') : badge('illus'))))))));
  c7.append(h('div', { class: 'cap' }, L(['The 2029-30 benchmark technology was not determined at the 19 July 2026 verification date. The 2026 Benchmark Technology Review must consider the new 7-hour ESR requirement and is scheduled to conclude by October 2026 for the 2029-30 BRCP process.',
    '截至2026年7月19日核验日，2029-30基准技术尚未确定。2026基准技术审查须考虑新的7小时ESR要求，预计于2026年10月前为2029-30 BRCP流程完成。'])));
  c7.append(why(['The benchmark has already moved from a gas peaker to a 4-hour battery to a 6-hour battery, and the next review must contend with a 7-hour requirement. Treat this row of dates as a live diligence item with a decision consequence: if the 2029-30 benchmark lengthens again, BRCP rises and every sub-benchmark asset is de-rated further, which raises the value of the hours you build now and of any augmentation right you hold. Confirm the review outcome before electing fixed or floating pricing.',
    '基准已由燃气调峰机组转为4小时电池、再转为6小时电池，下一轮审查还须应对7小时要求。应将这组日期视为具有决策后果的动态尽调事项：若2029-30基准再次延长，BRCP上升、所有低于基准的资产被进一步折减，从而提高当下所建小时数及所持增容权的价值。在选择固定或浮动价格前，须先确认审查结果。'],
    ['Confirm before electing price basis', '定价选择前先确认审查']));
  g2.append(c7);
  main.append(g2);

  // 7) editable base-case assumption matrix
  const c8 = card(['BRCPAssumptionMatrix — base case (editable)', 'BRCP假设矩阵 — 基准情景（可编辑）'], [badge('illus'), statusBadge(false)]);
  c8.append(h('div', { class: 'frm' },
    knobField(['WACC by 2031-32 %', '2031-32 WACC %'], BRCP.waccMid.base, v => { BRCP.waccMid.base = v; }),
    knobField(['Long-run WACC %', '长期WACC %'], BRCP.waccLR.base, v => { BRCP.waccLR.base = v; }),
    knobField(['WA construction inflation %', '西澳建设通胀 %'], BRCP.inflNear.base, v => { BRCP.inflNear.base = v; }),
    knobField(['Fixed O&M escalation %', '固定运维递增 %'], BRCP.om.base, v => { BRCP.om.base = v; }),
    knobField(['Module learning adj (pts, + = less)', '模块学习调整（点，+ = 更少）'], BRCP.knobs.learnAdj, v => { BRCP.knobs.learnAdj = v; })));
  const asmRows = [
    [['Benchmark duration path', '基准时长路径'], '6h → 7h → 7.5h → 8h', ['2026 ESOO / analyst', '2026 ESOO/分析'], 'warn'],
    [['Battery-module learning (base)', '电池模块学习（基准）'], '−7% → 0% p.a.', ['BNEF / GenCost, WA-adjusted', 'BNEF/GenCost，西澳调整'], 'warn'],
    [['Long-run nominal pre-tax WACC', '长期名义税前WACC'], BRCP.waccLR.base + '%', ['ERA methodology', 'ERA方法'], 'warn'],
    [['WA construction inflation', '西澳建设通胀'], BRCP.inflNear.base + '% → ' + BRCP.inflLR.base + '%', ['WA project evidence', '西澳项目证据'], 'serious'],
    [['Fixed O&M escalation', '固定运维递增'], BRCP.om.base + '% p.a.', ['ERA determination', 'ERA决定'], 'warn'],
    [['Expected Capacity Credits', '预期容量信用'], '200 MW', ['ERA benchmark', 'ERA基准'], 'info'],
    [['WA localisation premium', '西澳本地化溢价'], ['retained (~26% > GenCost)', '保留（约高于GenCost 26%）'], ['ERA finding', 'ERA结论'], 'info'],
  ];
  c8.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Assumption', '假设'])), h('th', {}, L(['Base value', '基准值'])), h('th', {}, L(['Source', '来源'])), h('th', {}, L(['Confidence', '置信度'])))),
    h('tbody', {}, asmRows.map(r => h('tr', {}, h('td', {}, L(r[0])), h('td', {}, Array.isArray(r[1]) ? L(r[1]) : r[1]), h('td', {}, L(r[2])),
      h('td', {}, chip(r[3], r[3] === 'info' ? L(['High', '高']) : r[3] === 'warn' ? L(['Medium', '中']) : L(['Low', '低'])))))))));
  c8.append(why(['The confidence column is the useful part. The two lowest-confidence assumptions — WA construction inflation and the benchmark duration path — are also two of the three largest drivers of the forecast, so the honest reading is that the out-years are a range rather than a line. Use the knobs to test the combination that hurts you: highest duration path with lowest module learning if you are buying capacity revenue, and the reverse if you are selling it. If the decision flips between those two corners, the decision is not yet supportable on BRCP alone.',
    '置信度列是本表最有价值的部分。置信度最低的两项假设 — 西澳建设通胀与基准时长路径 — 同时也是预测三大驱动中的两项，因此诚实的解读是：远年数值是一个区间而非一条线。应使用参数旋钮测试对自身不利的组合：若在买入容量收入，则取最高时长路径配最低模块学习率；若在卖出，则反之。若结论在这两个极端之间发生反转，则该决策尚不能仅凭BRCP支撑。'],
    ['Test the corner that hurts you', '测试对自身不利的极端组合']));
  c8.style.marginTop = '14px';
  main.append(c8);

  // 8) limitations, source hierarchy & triggers
  const c9 = card(['Limitations, source hierarchy & revision triggers', '局限性、来源层级与修订触发条件'], [statusBadge(false)]);
  c9.append(h('details', {}, h('summary', {}, L(['Key limitations (Appendix B)', '关键局限性（附录B）'])),
    h('ul', { class: 'actions' }, [
      ['The 2029-30 benchmark technology, duration, location and CONE treatment were undetermined at 19 Jul 2026.', '截至2026-07-19，2029-30基准技术、时长、地点及CONE处理均未确定。'],
      ['ERA uses current WA market evidence and does not mechanically apply long-run learning rates; learning rates appear here only to forecast determinations that do not yet exist.', 'ERA采用当前西澳市场证据，不机械套用长期学习率；此处学习率仅用于预测尚不存在的决定。'],
      ['Global battery-cost decline does not imply an equal decline in WA total project cost.', '全球电池成本下降不代表西澳项目总成本等比例下降。'],
      ['Anticipated / EOI capacity is not fully delivered; weather-year duration tails are not the annual benchmark duration.', '预期/意向容量并非已全部交付；气象年时长尾部不等于年度基准时长。'],
      ['For investment analysis only — not an official price determination or investment advice.', '仅供投资分析 — 非官方价格决定或投资建议。'],
    ].map(p => h('li', {}, L(p))))));
  c9.append(h('details', {}, h('summary', {}, L(['Re-run triggers (spec §6.6.16)', '重算触发条件（规范§6.6.16）'])),
    h('ul', { class: 'actions' }, [
      ['ERA publishes a draft or final BRCP determination.', 'ERA发布BRCP草案或最终决定。'],
      ['The Coordinator changes the Benchmark Technology, or AEMO changes the ESR Duration Requirement.', '协调者变更基准技术，或AEMO变更ESR时长要求。'],
      ['WACC moves >50 bp, or WA project-cost / battery-module price changes >10%.', 'WACC变动超过50基点，或西澳项目成本/电池模块价格变动超过10%。'],
      ['Committed/anticipated capacity changes >200 MW, or the supply ratio crosses the ±5% RCP deadband.', '已承诺/预期容量变动超过200 MW，或供给比越过±5% RCP不调整区间。'],
    ].map(p => h('li', {}, L(p))))));
  c9.append(h('div', { class: 'reco' }, h('b', {}, L(['Ten-year BRCP outlook: ', '十年BRCP展望：'])),
    L(['The official 2028-29 BRCP is A$488,500/MW/yr. Base case steps up to ~A$520,000/MW/yr in 2029-30 if the benchmark moves to a seven-hour battery, then a broadly A$500,000–A$550,000/MW/yr nominal range through 2037-38. Battery learning reduces real cost, but longer duration, WA construction, connection and financing costs prevent a simple downward curve. BRCP is a cost benchmark; actual capacity revenue must use expected RCP and assigned Capacity Credits.',
       '官方2028-29 BRCP为A$488,500/MW/年。若基准转为七小时电池，基准情景在2029-30升至约A$520,000/MW/年，其后至2037-38大致在A$500,000–A$550,000/MW/年名义区间。电池学习降低实际成本，但更长时长、西澳建设、并网及融资成本使价格无法单向下行。BRCP是成本基准；实际容量收入须使用预期RCP及获配容量信用。'])));
  c9.style.marginTop = '14px';
  main.append(c9);
}

export { renderBrcp, knobField };
