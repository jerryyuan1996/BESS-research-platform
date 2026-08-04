/* ---------------------------------------------------------------------------
   Investment Lab - one model, four markets. Verbatim from the prototype
   (GB payload lines 1001-1172).

   IMPORTANT: this lineage's irrOf() brackets [-0.9, 1.5], while the home cockpit
   and WA bracket [-0.9, 2.0]. That is a real divergence in the source, not a
   transcription slip, so it is preserved here rather than replaced with the
   shared utils/finance.js implementation. npvOf and annuity are identical to the
   shared ones but are kept alongside irrOf so the three stay together as the
   prototype had them.
   --------------------------------------------------------------------------- */
import { h } from '../../utils/dom.js';
import { L } from '../../app/i18n.js';
import { kpi } from '../../components/metricCard.js';
import { lineChart, waterfall } from '../../charts/index.js';

/** @param {object} ctx  { MKT, M, state, render, LS, fmt, compute } */
export function createLab(ctx){
  const { MKT, M, state, render, LS } = ctx;
  const { fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX } = ctx.fmt;
  const { interp, dilutionAt } = ctx.compute;const LAB_FIELDS = [
  ['mw', ['Project MW', '项目MW']], ['hours', ['Duration (h)', '时长（小时）']],
  ['capexKWh', [MKT.cur + '/kWh energy capex', MKT.cur + '/kWh 能量段造价']],
  ['capexKW', [MKT.cur + '/kW power capex', MKT.cur + '/kW 功率段造价']],
  ['opexKW', [MKT.cur + '/kW/yr opex', MKT.cur + '/kW/年运维']],
  ['rte', ['Round-trip efficiency %', '往返效率 %']], ['avail', ['Availability %', '可用率 %']],
  ['degr', ['Degradation %/yr', '年衰减率 %']], ['cycles', ['Cycles/day', '日循环次数']],
  ['spread', [MKT.cur + '/MWh executable spread', MKT.cur + '/MWh 可执行价差']],
  ['optFee', ['Optimiser fee %', '优化商费用 %']],
  ['capPrice', [MKT.cur + '/kW/yr capacity price', MKT.cur + '/kW/年容量价格']],
  ['capYrs', ['Capacity agreement (yr)', '容量协议年限']],
  ['servicesKW', [MKT.cur + '/kW/yr system services', MKT.cur + '/kW/年系统服务']],
  ['grantPct', ['Capital grant % of capex', '资本补贴占造价 %']],
  /* Capital-structure inputs. Each is optional: `blkLabInputs` skips a field the
     market has not seeded, so a market that declares no connection charge shows
     no connection row rather than a misleading zero. */
  ['connectionPerMW', [MKT.cur + '/MW connection charge', MKT.cur + '/MW 并网费用']],
  ['vatPct', ['VAT / sales tax %', '增值税 %']],
  ['vatRecoverable', ['VAT recoverable (1 = yes)', '增值税可抵扣（1=是）']],
  ['devCostPct', ['Development cost % of capex', '开发成本占造价 %']],
  ['rtbPremiumPct', ['RTB premium % of dev cost', 'RTB溢价占开发成本 %']],
  ['constructionMonths', ['Construction (months)', '建设周期（月）']],
  ['life', ['Asset life (yr)', '资产寿命（年）']], ['disc', ['Discount rate %', '折现率 %']],
  ['debtPct', ['Debt %', '债务比例 %']], ['rate', ['Debt interest %', '债务利率 %']],
  ['tenor', ['Debt tenor (yr)', '债务期限（年）']],
];
function labInputs(){
  if (!state.lab) state.lab = Object.assign({}, M.lab);
  return state.lab;
}
function npvOf(rate, cfs){ return cfs.reduce((a, c, i) => a + c / Math.pow(1 + rate, i), 0); }
function irrOf(cfs){
  let lo = -0.9, hi = 1.5;
  const f = r => npvOf(r, cfs);
  if (f(lo) * f(hi) > 0) return null;
  for (let k = 0; k < 80; k++){ const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; }
  return (lo + hi) / 2;
}
function annuity(P, r, n){ return r === 0 ? P / n : P * r / (1 - Math.pow(1 + r, -n)); }
function labModel(inp, opts){
  opts = opts || {};
  const dil = dilutionAt(+state.codYear) * (opts.dil || 1);
  const build = inp.mw * 1000 * (inp.hours * inp.capexKWh + inp.capexKW);
  /* Connection charge is per MW and sits outside the per-kW build cost because
     it is the line that differs most between markets and least between projects
     of different duration — Germany's Baukostenzuschuss runs to €140k/MW and is
     charged on connection capacity, not on stored energy. */
  const connection = inp.mw * (inp.connectionPerMW || 0);
  const capexPreTax = build + connection;

  /* Ready-to-build entry price. Development cost is a percentage of the build;
     the premium on top is the developer's margin, which nothing publishes, so it
     is an input and the per-MW result is an output the user reads back. */
  const devCost = capexPreTax * (inp.devCostPct || 0) / 100;
  const rtbPrice = devCost * (1 + (inp.rtbPremiumPct || 0) / 100);
  const rtbPerMW = inp.mw ? rtbPrice / inp.mw : 0;

  /* Non-recoverable VAT capitalises. Recoverable VAT is a timing cost and the
     Lab does not model the refund lag — the engine does — so here it is simply
     excluded rather than approximated. */
  const vat = (inp.vatRecoverable === 0 || inp.vatRecoverable === false)
    ? capexPreTax * (inp.vatPct || 0) / 100 : 0;

  const capex = capexPreTax + rtbPrice + vat;
  const grant = build * (opts.noGrant ? 0 : (inp.grantPct || 0)) / 100;
  const net = capex - grant;
  // capacity channel: de-rated MW × administered / auction-cleared price
  const derate = interp(M.deratingCurve, inp.hours);
  const capMW = inp.mw * derate * (M.usableFraction || 1);
  const capRev = capMW * 1000 * inp.capPrice * (opts.capFactor == null ? 1 : opts.capFactor);
  // merchant channel: executable spread × discharged MWh, thinner at longer duration
  const mwh1 = inp.mw * inp.hours * (M.usableFraction || 1) * inp.cycles * 365 * (inp.avail / 100);
  const spreadEff = inp.spread * interp(M.durSpreadFactor, inp.hours) * (inp.rte / 88) * (opts.spreadFactor || 1);
  const arb1 = mwh1 * spreadEff * dil;
  const svc1 = inp.mw * 1000 * inp.servicesKW * dil * (opts.svcFactor || 1);
  const gross1 = arb1 + svc1;
  const fee1 = gross1 * inp.optFee / 100;
  const opex = inp.mw * 1000 * inp.opexKW;
  /* Construction spend. Up to twelve months is one outflow at t=0, which is the
     shape the Lab has always used; beyond that the spend splits across an
     S-curve and first revenue moves out by the extra years. An HV connection
     waiting on a transformer is the usual reason a build crosses that line. */
  const buildYears = Math.max(1, Math.ceil((inp.constructionMonths || 12) / 12));
  const curve = buildYears === 1 ? [1] : buildYears === 2 ? [0.4, 0.6]
    : buildYears === 3 ? [0.2, 0.6, 0.2]
    : Array.from({ length: buildYears }, (_, i) => 1 - Math.cos(2 * Math.PI * (i + 0.5) / buildYears));
  const cSum = curve.reduce((a, b) => a + b, 0);

  const ebitda = [], cfs = curve.map(w => -net * w / cSum);
  for (let y = 1; y <= inp.life; y++){
    const capY = y <= inp.capYrs ? capRev : capRev * (M.futureCapFactor == null ? 0.6 : M.futureCapFactor);
    const e = capY + (gross1 - fee1) * Math.pow(1 - inp.degr / 100, y - 1) - opex;
    ebitda.push(e); cfs.push(e);
  }
  const debt = net * inp.debtPct / 100;
  const ds = annuity(debt, inp.rate / 100, inp.tenor);
  const dscrs = ebitda.slice(0, inp.tenor).map(e => e / ds);
  const lev = curve.map(w => -(net - debt) * w / cSum);
  for (let y = 1; y <= inp.life; y++) lev.push(ebitda[y - 1] - (y <= inp.tenor ? ds : 0));
  let cum = -net, payback = null;
  for (let y = 1; y <= inp.life; y++){ cum += ebitda[y - 1]; if (cum >= 0 && payback == null) payback = y; }
  return { capex, grant, net, derate, capMW, capRev, arb1, svc1, opex, fee1,
    build, connection, devCost, rtbPrice, rtbPerMW, vat, buildYears,
    ebitda1: ebitda[0], unlevIRR: irrOf(cfs), levIRR: irrOf(lev), npv: npvOf(inp.disc / 100, cfs),
    minDSCR: dscrs.length ? Math.min(...dscrs) : null,
    avgDSCR: dscrs.length ? dscrs.reduce((a, b) => a + b, 0) / dscrs.length : null, payback };
}
function blkLabInputs(parent){
  const inp = labInputs();
  const frm = h('div', { class: 'frm' });
  LAB_FIELDS.forEach(([k, lbl]) => {
    if (inp[k] == null) return;
    frm.append(h('div', {},
      h('label', {}, L(lbl)),
      h('input', { class: 'inp', type: 'number', value: inp[k], step: 'any',
        onchange: e => { state.lab[k] = +e.target.value; render(); } })));
  });
  parent.append(frm);
  parent.append(h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;' },
    h('button', { class: 'btn', onclick: () => { state.lab = Object.assign({}, M.lab); render(); } },
      L(['Reset to seed defaults', '恢复种子默认值']))));
}
function blkLabOutputs(parent){
  const inp = labInputs(), r = labModel(inp);
  const dn = labModel(inp, { spreadFactor: 0.75, svcFactor: 0.7, capFactor: 0.85, noGrant: true });
  parent.append(h('div', { class: 'kpis' },
    kpi(L(['Total capex', '总资本开支']), fmtCM(r.capex), { text: L(['grant ', '补贴 ']) + fmtCM(r.grant) }, ['calc']),
    /* The number an RTB acquisition is actually negotiated on. Shown whenever a
       development cost is set, because a premium on nothing is nothing. */
    ...(r.devCost > 0 ? [kpi(L(['RTB acquisition price', 'RTB收购价格']), fmtCk(r.rtbPerMW) + '<small>/MW</small>',
      { text: L(['dev cost ', '开发成本 ']) + fmtCM(r.devCost) + L([' + premium', ' + 溢价']) }, ['calc', 'illus'])] : []),
    ...(r.buildYears > 1 ? [kpi(L(['Construction period', '建设周期']), r.buildYears + L([' yr', ' 年']),
      { text: L(['spend spread; first revenue delayed', '支出分摊；首年收入推迟']), cls: 'down' }, ['calc'])] : []),
    kpi(L(['Capacity de-rating factor', '容量折减系数']), fmtPct(r.derate * 100),
      { text: L(['de-rated ', '折减后 ']) + fmtN(r.capMW) + ' MW' }, ['calc']),
    kpi(L(['Year-1 capacity revenue', '第1年容量收入']), fmtCM(r.capRev), null, ['calc']),
    kpi(L(['Year-1 merchant (gross)', '第1年市场化收入（毛）']), fmtCM(r.arb1), null, ['calc']),
    kpi(L(['Year-1 system services', '第1年系统服务收入']), fmtCM(r.svc1), null, ['calc']),
    kpi(L(['Year-1 EBITDA', '第1年EBITDA']), fmtCM(r.ebitda1), null, ['calc']),
    kpi(L(['Unlevered IRR', '无杠杆IRR']), fmtIRR(r.unlevIRR), null, ['calc']),
    kpi(L(['Levered IRR', '含杠杆IRR']), fmtIRR(r.levIRR), null, ['calc']),
    kpi(L(['Min / avg DSCR', '最低/平均偿债覆盖率']), fmtX(r.minDSCR) + ' / ' + fmtX(r.avgDSCR),
      { text: L(['lender floor typically 1.30x', '贷款人下限通常1.30x']), cls: r.minDSCR != null && r.minDSCR < 1.3 ? 'down' : '' }, ['calc']),
    kpi(L(['NPV @ discount rate', '按折现率NPV']), fmtCM(r.npv), null, ['calc']),
    kpi(L(['Simple payback', '简单回收期']), r.payback ? r.payback + L([' yr', ' 年']) : '—', null, ['calc'])));
  parent.append(h('div', { class: 'cmp' },
    h('div', {}, h('div', { class: 'cmp-h' }, L(['Base case', '基准情景'])),
      h('div', { class: 'cmp-v' }, fmtIRR(r.unlevIRR)),
      h('div', { class: 'cmp-s' }, L(['unlevered · min DSCR ', '无杠杆 · 最低DSCR ']) + fmtX(r.minDSCR))),
    h('div', {}, h('div', { class: 'cmp-h' }, L(['Lender downside — no grant, −25% spread, −30% services, −15% capacity', '贷款人下行 — 无补贴、价差−25%、服务−30%、容量−15%'])),
      h('div', { class: 'cmp-v' }, fmtIRR(dn.unlevIRR)),
      h('div', { class: 'cmp-s' }, L(['unlevered · min DSCR ', '无杠杆 · 最低DSCR ']) + fmtX(dn.minDSCR)))));
  waterfall(parent, {
    yfmt: v => fmtCk(v), h: 260,
    steps: [
      { l: ['Capacity revenue', '容量收入'], v: r.capRev / inp.mw, t: 'start' },
      { l: ['+ merchant (gross)', '+ 市场化（毛）'], v: r.arb1 / inp.mw, t: 'd' },
      { l: ['+ system services', '+ 系统服务'], v: r.svc1 / inp.mw, t: 'd' },
      { l: ['− optimiser fee', '− 优化商费用'], v: -r.fee1 / inp.mw, t: 'd' },
      { l: ['− fixed opex', '− 固定运维'], v: -r.opex / inp.mw, t: 'd' },
      { l: ['Year-1 EBITDA per MW', '第1年每MW EBITDA'], v: r.ebitda1 / inp.mw, t: 'total' },
    ],
  });
}
function blkLabDuration(parent){
  const inp = labInputs();
  const rows = M.durConfigs.map(hh => {
    const r = labModel(Object.assign({}, inp, { hours: hh }));
    return { hh, r };
  });
  const tbl = rows.map((x, i) => {
    const prev = i ? rows[i - 1] : null;
    const incr = prev ? (x.r.npv - prev.r.npv) / (x.hh - prev.hh) : null;
    return h('tr', {},
      h('td', {}, h('b', {}, x.hh + 'h')),
      h('td', { class: 'num' }, fmtPct(x.r.derate * 100)),
      h('td', { class: 'num' }, fmtCM(x.r.capex)),
      h('td', { class: 'num' }, fmtCM(x.r.ebitda1)),
      h('td', { class: 'num' }, fmtIRR(x.r.unlevIRR)),
      h('td', { class: 'num' }, fmtCM(x.r.npv)),
      h('td', { class: 'num' }, incr == null ? '—' : fmtCM(incr)));
  });
  parent.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Duration', '时长'])),
      h('th', { class: 'num' }, L(['De-rating', '折减系数'])), h('th', { class: 'num' }, L(['Capex', '资本开支'])),
      h('th', { class: 'num' }, L(['Yr-1 EBITDA', '第1年EBITDA'])), h('th', { class: 'num' }, L(['Unlev. IRR', '无杠杆IRR'])),
      h('th', { class: 'num' }, 'NPV'), h('th', { class: 'num' }, L(['NPV per added hour', '每新增小时NPV'])))),
    h('tbody', {}, tbl))));
  lineChart(parent, {
    xs: M.durConfigs.map(x => x + 'h'), yfmt: v => fmtCM(v), h: 220,
    series: [{ name: ['NPV by duration', '按时长的NPV'], color: 'var(--s1)', vals: rows.map(x => x.r.npv) }],
  });
}
function blkLabSnaps(parent){
  const key = MKT.ns + '_snaps';
  const load = () => { try { return JSON.parse(LS.get(key) || '[]'); } catch (e){ return []; } };
  const snaps = load();
  const inp = labInputs();
  parent.append(h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;margin:8px 0;' },
    h('button', { class: 'btn', onclick: () => {
      const s = load();
      const r = labModel(inp);
      s.push({ n: new Date().toISOString().slice(0, 16).replace('T', ' '), cod: state.codYear,
        inp: Object.assign({}, inp), irr: r.unlevIRR, npv: r.npv, dscr: r.minDSCR });
      LS.set(key, JSON.stringify(s)); render();
    } }, L(['Save current scenario', '保存当前情景'])),
    h('button', { class: 'btn', onclick: () => { LS.del(key); render(); } },
      L(['Clear all', '清空']))));
  if (!snaps.length){ parent.append(h('div', { class: 'cap' }, L(['No saved scenarios yet.', '尚无已保存情景。']))); return; }
  parent.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Saved', '保存时间'])), h('th', {}, 'COD'),
      h('th', { class: 'num' }, 'MW'), h('th', { class: 'num' }, L(['Hours', '小时'])),
      h('th', { class: 'num' }, L(['Unlev. IRR', '无杠杆IRR'])), h('th', { class: 'num' }, 'NPV'),
      h('th', { class: 'num' }, L(['Min DSCR', '最低DSCR'])))),
    h('tbody', {}, snaps.map(s => h('tr', {}, h('td', {}, s.n), h('td', {}, s.cod),
      h('td', { class: 'num' }, s.inp.mw), h('td', { class: 'num' }, s.inp.hours),
      h('td', { class: 'num' }, fmtIRR(s.irr)), h('td', { class: 'num' }, fmtCM(s.npv)),
      h('td', { class: 'num' }, fmtX(s.dscr))))))));
}
  return { LAB_FIELDS, labInputs, npvOf, irrOf, annuity, labModel,
           blkLabInputs, blkLabOutputs, blkLabDuration, blkLabSnaps };
}