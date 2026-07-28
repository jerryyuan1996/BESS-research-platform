/* ---------------------------------------------------------------------------
   Investment Lab tab, verbatim from the prototype (lines 3261-3437).
   Ends by delegating to the co-optimisation section.
   --------------------------------------------------------------------------- */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { card } from '../../../components/card.js';
import { badge, statusBadge } from '../../../components/badge.js';
import { chip } from '../../../components/chip.js';
import { why } from '../../../components/decisionLogic.js';
import { kpi } from '../../../components/metricCard.js';
import { sectionHead } from '../../../components/sectionHeader.js';
import { barChart } from '../../../charts/index.js';
import { state, render } from '../state.js';
import { NF1, fmtN, fmtAM, fmtPct, fmtIRR, fmtX } from '../ui.js';
import { SEED } from '../data/seed.js';
import { OPT } from '../data/optimizer.js';
import { esrAtYear } from '../lib/scores.js';
import { loadSnaps, saveSnaps } from '../lib/lab.js';
import { optimizerModel } from '../lib/optimizer.js';
import { renderOptimizer } from '../sections/optimizer.js';

function renderLab(main){
  if (!state.lab) state.lab = { ...SEED.lab };
  if (!state.rcmScn) state.rcmScn = 'BASE';
  if (!state.optStrat) state.optStrat = 'BALANCED';
  if (!state.labSource) state.labSource = 'OFFICIAL';
  const inp = state.lab, scn = state.rcmScn, strat = state.optStrat;
  const out = optimizerModel(inp, scn, strat);      // co-optimised model driven by the Inputs controls below
  sectionHead(main, ['Investment Lab — market metrics to project returns', '投资测算 — 从市场指标到项目回报'],
    ['A simplified annual pre-tax model on illustrative seed assumptions. It exists to demonstrate the decision workflow (incremental NPV by duration, DSCR, quantified triggers) — it is not a substitute for a full dispatch-optimised project-finance model.',
     '基于示例种子假设的简化年度税前模型，用于演示决策流程（按时长的增量NPV、偿债覆盖率、量化触发条件）— 不能替代完整的调度优化项目融资模型。']);
  main.append(h('div', { class: 'warnbox' }, '⚠ ' + L(['All Lab outputs are illustrative (SEED_JSON_V1) and are not investment advice.', '本模块全部输出均为示例（SEED_JSON_V1），不构成投资建议。'])));

  const g = h('div', { class: 'grid g2' });
  const cI = card(['Inputs', '输入假设'], [badge('illus'), statusBadge(false)]);

  // Step 0 — cost and revenue basis
  cI.append(h('div', { style: 'font-size:11px;color:var(--muted);margin-bottom:3px;' }, L(['Step 0 · Assumption basis', '第0步 · 假设基准'])));
  cI.append(h('div', { style: 'display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;' },
    [['OFFICIAL', ['Official + calc', '官方+计算']], ['CUSTOM', ['Custom lender / IC', '自定义（贷款人/投委会）']]]
      .map(([k, lbl]) => h('button', { class: 'btn' + (state.labSource === k ? ' active' : ''), onclick: () => {
        state.labSource = k; render();
      } }, L(lbl)))));

  // Step 2 — RCM scenario + optimizer strategy (drive the Outputs directly)
  cI.append(h('div', { style: 'font-size:11px;color:var(--muted);margin-bottom:3px;' }, L(['Step 2 · RCM scenario', '第2步 · RCM情景'])));
  cI.append(h('div', { style: 'display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;' },
    ['HIGH', 'BASE', 'LOW', 'CUSTOM'].map(k => h('button', { class: 'btn' + (scn === k ? ' active' : ''), onclick: () => { state.rcmScn = k; render(); } }, L(OPT.scnLabel[k])))));
  cI.append(h('div', { style: 'font-size:11px;color:var(--muted);margin-bottom:3px;' }, L(['Step 3 · Optimizer strategy', '第3步 · 优化策略'])));
  cI.append(h('div', { style: 'display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;' },
    OPT.stratOrder.map(k => h('button', { class: 'btn' + (strat === k ? ' active' : ''), onclick: () => { state.optStrat = k; render(); } }, L(OPT.strat[k].n)))));

  const fields = [
    ['mw', ['Project MW', '项目MW']], ['hours', ['Duration (h)', '时长（小时）']],
    ['capexKWh', ['Capex (A$/kWh installed)', '造价（A$/kWh装机）']], ['opexKW', ['Fixed opex (A$/kW/yr)', '固定运维（A$/kW/年）']],
    ['rte', ['Round-trip efficiency %', '往返效率%']], ['avail', ['Availability %', '可用率%']],
    ['degr', ['Degradation %/yr', '年衰减率%']], ['ccPct', ['Capacity Credits % of MW (post-NAQ)', '容量信用占MW%（NAQ后）']],
    ['rcpPct', ['RCP as % of BRCP', 'RCP占BRCP%']], ['fcessKW', ['FCESS (A$/kW/yr)', 'FCESS（A$/kW/年）']],
    ['life', ['Project life (yr)', '项目年限（年）']], ['disc', ['Discount rate %', '折现率%']],
    ['debtPct', ['Debt %', '债务比例%']], ['rate', ['Debt interest %', '债务利率%']], ['tenor', ['Debt tenor (yr)', '债务期限（年）']],
  ];
  const frm = h('div', { class: 'frm' });
  fields.forEach(([k, lbl]) => frm.append(h('div', {}, h('label', {}, L(lbl)),
    h('input', { class: 'inp', type: 'number', step: 'any', value: inp[k],
      onchange: e => { state.lab[k] = +e.target.value || 0; render(); } }))));
  cI.append(frm);
  cI.append(h('label', { style: 'font-size:12.5px;color:var(--ink2);display:flex;gap:8px;align-items:center;margin-top:6px;' },
    (() => { const cb = h('input', { type: 'checkbox', onchange: e => { state.labEvidence = e.target.checked; render(); } });
      cb.checked = !!state.labEvidence; return cb; })(),
    L(['Connection evidence complete and independently verified (Access Offer / GPS / NAQ)', '并网证据完整且经独立核验（接入报价/GPS/NAQ）'])));
  cI.append(h('div', { class: 'cap' }, L(['Merchant revenue uses the illustrative duration curve (interpolated), scaled by availability and RTE (88% baseline). Capacity Credits are linearly derated below the ' + esrAtYear(state.codYear) + 'h ESR requirement — indicative, never an official AEMO table. Outputs, revenue mix, decision and the co-optimisation section below all react to the RCM scenario and strategy chosen here.',
    '市场化收入采用示例时长曲线（插值），按可用率及往返效率（基准88%）缩放。低于' + esrAtYear(state.codYear) + '小时ESR要求的容量信用按线性折减 — 仅为示意，非官方AEMO表格。下方输出、收入构成、决策及协同优化部分均随此处所选RCM情景与策略变化。'])));
  cI.append(why(['Only three inputs move the answer materially: hours (through the de-rating and the merchant curve), capex per kWh, and the RCP factor implied by the RCM scenario. Everything else is second order at this level of model. So use the Lab to bracket the decision rather than to produce a number — set the RCM scenario to LOW, confirm the case still clears DSCR, and only then look at the base-case IRR. The default A$520/kWh sits close to the official benchmark cost intensity, which is the right starting point for a market-level test regardless of what any individual sponsor can build for.',
    '仅有三项输入会实质改变结果：小时数（通过折减与市场化曲线）、单位kWh造价，以及RCM情景所隐含的RCP系数。在本模型精度下，其余均为次要因素。因此应以投资测算界定决策区间，而非产出单一数字 — 先将RCM情景设为"低"，确认方案仍能通过DSCR，之后再看基准情景IRR。默认A$520/kWh接近官方基准的造价强度，无论具体发起人的实际造价水平如何，这都是进行市场层面检验的正确起点。'],
    ['Bracket the decision, not a number', '界定区间而非单点数值']));
  g.append(cI);

  const cO = card(['Outputs — ' + L(OPT.scnLabel[scn]) + ' · ' + L(OPT.strat[strat].n), '输出结果 — ' + L(OPT.scnLabel[scn]) + ' · ' + L(OPT.strat[strat].n)], [badge('calc'), badge('illus')]);
  cO.append(h('div', { style: 'margin:2px 0 6px;' }, chip(scn === 'HIGH' ? 'good' : scn === 'LOW' ? 'serious' : 'info', L(OPT.scnLabel[scn])), ' ', chip('info', L(OPT.strat[strat].n))));
  cO.append(h('div', { class: 'kpis' },
    kpi(L(['Total capex', '总资本开支']), fmtAM(out.capex)),
    kpi(L(['Net RCM revenue (yr 1)', '第1年净RCM收入']), fmtAM(out.netRcm), { text: fmtN(out.ccMW) + ' MW CC × RCP; refund ' + fmtN(out.refundPct) + '%' }),
    kpi(L(['Net energy margin (yr 1)', '第1年净现货收益']), fmtAM(out.energyNet), { text: L(['after charging cost & losses', '扣除充电成本与损失后']) }),
    kpi(L(['Net FCESS revenue (yr 1)', '第1年净FCESS收入']), fmtAM(out.fcessNet)),
    kpi(L(['Total net operating revenue', '总净运营收入']), fmtAM(out.totalNet), { text: L(['P95 ', 'P95 ']) + fmtAM(out.p95Rev) }),
    kpi(L(['Unlevered IRR', '无杠杆IRR']), fmtIRR(out.unlevIRR)),
    kpi(L(['Levered equity IRR', '杠杆股权IRR']), fmtIRR(out.levIRR)),
    kpi('NPV @ ' + inp.disc + '%', fmtAM(out.npv), null, [badge('calc')]),
    kpi(L(['Min / avg DSCR', '最低/平均偿债覆盖率']), fmtX(out.minDSCR) + ' / ' + fmtX(out.avgDSCR)),
    kpi(L(['Payback (yr)', '回收期（年）']), out.payback == null ? '—' : String(out.payback))));
  // revenue composition
  const revTot = out.netRcm + out.energyNet + out.fcessNet;
  barChart(cO, {
    xs: [L(['Year-1 net revenue mix', '第1年净收入构成'])], mode: 'stack', bw: 56, yfmt: v => fmtAM(v),
    series: [
      { name: ['Net RCM', '净RCM'], color: 'var(--s1)', vals: [out.netRcm] },
      { name: ['Net energy', '净现货'], color: 'var(--s2)', vals: [out.energyNet] },
      { name: ['Net FCESS', '净FCESS'], color: 'var(--s3)', vals: [out.fcessNet] },
    ], h: 210,
  });
  cO.append(h('div', { class: 'cap' }, L(['RCM share of net revenue: ', 'RCM占净收入比例：']) + fmtPct(revTot ? out.netRcm / revTot * 100 : 0, 0) +
    L([' · switch RCM scenario or strategy in the Inputs to see every output update.', ' · 在输入区切换RCM情景或策略即可看到全部输出更新。'])));
  // decision + top factors (scenario/strategy-aware)
  const sens = [
    { n: ['RCP −10%', 'RCP下调10%'], m: optimizerModel({ ...inp, rcpAdj: 0.9 }, scn, strat) },
    { n: ['Merchant revenue −10%', '市场化收入下调10%'], m: optimizerModel({ ...inp, merchFactor: 0.9 }, scn, strat) },
    { n: ['Capex +10%', '造价上浮10%'], m: optimizerModel({ ...inp, capexKWh: inp.capexKWh * 1.1 }, scn, strat) },
    { n: ['Capacity Credits −10%', '容量信用下调10%'], m: optimizerModel({ ...inp, ccPct: inp.ccPct * 0.9 }, scn, strat) },
  ].map(s => ({ n: s.n, d: s.m.npv - out.npv })).sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
  let decision, dcls;
  if (out.minDSCR != null && (out.minDSCR < 1.05 || (out.unlevIRR || 0) < 0.06)){ decision = ['Re-price', '重新定价']; dcls = 'critical'; }
  else if (!state.labEvidence){ decision = ['Wait for RCM / NAQ / grid evidence — release consideration only against objective connection and capacity evidence', '等待RCM/NAQ/并网证据 — 仅在取得客观并网及容量证据后支付对价']; dcls = 'warn'; }
  else if (out.minDSCR >= 1.3 && (out.unlevIRR || 0) >= 0.09){ decision = ['Proceed subject to conditions', '满足条件后推进']; dcls = 'good'; }
  else { decision = ['Proceed subject to conditions — tighten price or terms', '满足条件后推进 — 收紧价格或条款']; dcls = 'warn'; }
  cO.append(h('div', { style: 'margin:10px 0 4px;' }, chip(dcls, L(decision))));
  cO.append(h('div', { class: 'cap' }, L(['Three largest NPV drivers (±10% tests): ', '对NPV影响最大的三项（±10%检验）：']) +
    sens.slice(0, 3).map(s => L(s.n) + ' (' + (s.d >= 0 ? '+' : '−') + fmtAM(Math.abs(s.d)) + ')').join(' · ')));
  cO.append(why(['Read the DSCR and the revenue mix before the IRR. RCM is ' + fmtPct(revTot ? out.netRcm / revTot * 100 : 0, 0) + ' of year-1 net revenue in this run, which is what makes the case financeable — and it is also why the ±10% sensitivity ranking is dominated by capacity variables rather than merchant ones. The decision chip is deliberately gated on evidence, not returns: a strong IRR with unconfirmed NAQ and capacity credits is not a proceed signal, because the largest single input to that IRR has not yet been established.',
    '应先看DSCR与收入构成，再看IRR。本次测算中RCM占第1年净收入的' + fmtPct(revTot ? out.netRcm / revTot * 100 : 0, 0) + '，这正是方案具备可融资性的原因 — 也是±10%敏感性排序由容量类变量而非市场化变量主导的原因。决策标签刻意以证据而非回报为门槛：在NAQ与容量信用尚未确认的情况下，高IRR不构成推进信号，因为该IRR最大的单一输入尚未确立。'],
    ['Evidence gates the decision, not IRR', '决策门槛是证据而非IRR']));
  g.append(cO);
  main.append(g);

  // duration comparison
  const durs = [4, 6, 7, 8, 10];
  const runs = durs.map(hh => ({ h: hh, m: optimizerModel({ ...inp, hours: hh }, scn, strat) }));
  const reco = runs.find((r, i) => r.m.derate >= 1 && (r.m.minDSCR || 0) >= 1.2 && (i === 0 || r.m.npv - runs[i - 1].m.npv > 0));
  const cD = card(['Duration comparison — incremental NPV of the final added hour', '时长比较 — 最后新增小时的增量NPV'], [badge('calc'), badge('illus'), statusBadge(false)]);
  cD.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Config', '配置'])), h('th', { class: 'num' }, L(['CC derate', '容量信用折减'])),
      h('th', { class: 'num' }, 'NPV'), h('th', { class: 'num' }, L(['Unlev. IRR', '无杠杆IRR'])),
      h('th', { class: 'num' }, L(['Min DSCR', '最低DSCR'])), h('th', { class: 'num' }, L(['ΔNPV vs prior', '较前一档ΔNPV'])))),
    h('tbody', {}, runs.map((r, i) => {
      const d = i === 0 ? null : r.m.npv - runs[i - 1].m.npv;
      const tr = h('tr', {},
        h('td', {}, h('b', {}, r.h + 'h' + (reco && reco.h === r.h ? ' ★' : ''))),
        h('td', { class: 'num' }, fmtPct(r.m.derate * 100, 0)),
        h('td', { class: 'num' }, fmtAM(r.m.npv)),
        h('td', { class: 'num' }, fmtIRR(r.m.unlevIRR)),
        h('td', { class: 'num' }, fmtX(r.m.minDSCR)),
        h('td', { class: 'num' }, d == null ? '—' : (d >= 0 ? '+' : '−') + fmtAM(Math.abs(d))));
      if (reco && reco.h === r.h) tr.style.background = 'var(--good-bg)';
      return tr;
    })))));
  cD.append(h('div', { class: 'cap' }, L(['★ = shortest configuration satisfying ESR eligibility, min DSCR ≥ 1.2 and positive incremental NPV (spec §9.7 logic on seed assumptions). Sub-7h configs lose Capacity Credits under the indicative linear derating.',
    '★ = 满足ESR资格、最低DSCR≥1.2且增量NPV为正的最短配置（规范§9.7逻辑，种子假设）。低于7小时的配置在示意线性折减下损失容量信用。'])));
  cD.append(h('div', { class: 'note' }, L(['Reconciliation with the 8h → 10h recommendation in the Storage Duration module: this simplified model does not price degradation of usable duration. A 7.0h nameplate design falls below the 7h ESR requirement (plus the 0.5h buffer required by the spec §5.2 trigger) within a few operating years, so the compliance-robust build is longer than the pure marginal-NPV optimum shown here. A full model must test degradation-adjusted usable AC duration at COD, year 5, year 10 and year 15.',
    '与“储能时长”模块8h→10h建议的对照：本简化模型未计入可用时长的衰减。7.0小时铭牌设计将在投运数年内跌破7小时ESR要求（及规范§5.2触发条件要求的0.5小时缓冲），因此满足合规稳健性的配置应长于此处纯边际NPV最优值。完整模型须测试投运时及第5、10、15年的衰减调整后可用交流时长。'])));
  cD.append(why(['This table is the decision the whole dashboard builds toward, and the ΔNPV column is the only honest way to make it. Note the discontinuity at the ESR requirement: configurations below it lose Capacity Credits linearly, so the jump into compliance is worth far more than any hour after it. The right answer is the shortest compliant configuration that still holds margin for degradation — which is why the ★ row and the recommended build differ, and why the choice should be made on the last hour’s incremental NPV rather than on the highest headline IRR.',
    '本表是整个看板所导向的决策，而ΔNPV列是作出该决策唯一诚实的方式。请注意ESR要求处的不连续：低于该要求的配置线性损失容量信用，因此"跨入合规"的价值远高于其后任何一小时。正确答案是仍为衰减保留余量的最短合规配置 — 这也是★行与建议配置存在差异、以及应依据最后一小时增量NPV而非最高名义IRR作出选择的原因。'],
    ['Compliance jump > any later hour', '跨入合规的价值高于后续小时']));
  cD.style.marginTop = '14px';
  main.append(cD);

  // snapshots
  const snaps = loadSnaps();
  const cS = card(['Scenario snapshots (saved locally, spec §12.5)', '情景快照（本地保存，规范§12.5）'], [statusBadge(false)]);
  const nameIn = h('input', { class: 'inp', style: 'max-width:280px;', placeholder: L(['e.g. IC Memo Base Case', '例：投委会备忘基准情景']) });
  cS.append(h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:8px 0;' }, nameIn,
    h('button', { class: 'btn', onclick: () => {
        const nm = nameIn.value.trim() || 'Scenario ' + (snaps.length + 1);
        snaps.push({ id: Date.now(), name: nm, createdAt: new Date().toISOString(), lang: state.lang,
          modelVersion: SEED.modelVersion, status: 'DRAFT', codYear: state.codYear,
          inputs: { ...inp }, outputs: { npv: out.npv, unlevIRR: out.unlevIRR, levIRR: out.levIRR, minDSCR: out.minDSCR, payback: out.payback } });
        saveSnaps(snaps); render();
      } }, L(['Save snapshot', '保存快照']))));
  if (snaps.length){
    cS.append(h('div', { class: 'tbl-wrap' }, h('table', {},
      h('thead', {}, h('tr', {}, h('th', {}, L(['Name', '名称'])), h('th', {}, L(['Created', '创建时间'])),
        h('th', { class: 'num' }, 'NPV'), h('th', { class: 'num' }, 'IRR'), h('th', {}, ''))),
      h('tbody', {}, snaps.map((s, i) => h('tr', {},
        h('td', {}, h('b', {}, s.name), ' ', h('span', { class: 'badge seed' }, s.modelVersion)),
        h('td', {}, s.createdAt.slice(0, 16).replace('T', ' ')),
        h('td', { class: 'num' }, fmtAM(s.outputs.npv)), h('td', { class: 'num' }, fmtIRR(s.outputs.unlevIRR)),
        h('td', {},
          h('button', { class: 'btn', style: 'padding:2px 8px;font-size:11.5px;', onclick: () => { state.lab = { ...s.inputs }; render(); } }, L(['Load', '载入'])),
          ' ',
          h('button', { class: 'btn', style: 'padding:2px 8px;font-size:11.5px;', onclick: () => { state.cmpId = state.cmpId === s.id ? null : s.id; render(); } }, L(['Compare', '对比'])),
          ' ',
          h('button', { class: 'btn', style: 'padding:2px 8px;font-size:11.5px;', onclick: () => { snaps.splice(i, 1); saveSnaps(snaps); render(); } }, L(['Delete', '删除'])))))))));
    const cmp = snaps.find(s => s.id === state.cmpId);
    if (cmp){
      const rows = [
        ['NPV', fmtAM(cmp.outputs.npv), fmtAM(out.npv), fmtAM(out.npv - cmp.outputs.npv)],
        [L(['Unlevered IRR', '无杠杆IRR']), fmtIRR(cmp.outputs.unlevIRR), fmtIRR(out.unlevIRR), (out.unlevIRR != null && cmp.outputs.unlevIRR != null) ? NF1.format((out.unlevIRR - cmp.outputs.unlevIRR) * 100) + 'pp' : '—'],
        [L(['Min DSCR', '最低DSCR']), fmtX(cmp.outputs.minDSCR), fmtX(out.minDSCR), (out.minDSCR != null && cmp.outputs.minDSCR != null) ? NF1.format(out.minDSCR - cmp.outputs.minDSCR) : '—'],
      ];
      cS.append(h('div', { class: 'note' }, h('b', {}, L(['Variance vs snapshot "', '与快照对比：“']) + cmp.name + L(['": ', '”：'])),
        h('div', { class: 'tbl-wrap' }, h('table', {},
          h('thead', {}, h('tr', {}, h('th', {}, L(['Metric', '指标'])), h('th', { class: 'num' }, L(['Snapshot', '快照'])), h('th', { class: 'num' }, L(['Current', '当前'])), h('th', { class: 'num' }, 'Δ'))),
          h('tbody', {}, rows.map(r => h('tr', {}, h('td', {}, r[0]), h('td', { class: 'num' }, r[1]), h('td', { class: 'num' }, r[2]), h('td', { class: 'num' }, r[3]))))))));
    }
  } else cS.append(h('div', { class: 'cap' }, L(['No snapshots yet. Save the current run to create an auditable, named record of inputs and outputs.', '暂无快照。保存当前测算即可生成可审计、可命名的输入输出记录。'])));
  cS.style.marginTop = '14px';
  main.append(cS);
  renderOptimizer(main);
}

export { renderLab };
