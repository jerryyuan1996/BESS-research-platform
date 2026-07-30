/* ---------------------------------------------------------------------------
   RCM x Energy x FCESS co-optimisation model and its dispatch chart.
   Verbatim from the prototype (lines 3486-3660).

   dispatchChart is a WA-specific composite chart and legitimately lives here: it
   is not a reusable primitive, and it is built from the shared primitives
   (S, axisText, niceTicks, tipShow) rather than reimplementing them.
   --------------------------------------------------------------------------- */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { npvOf, irrOf, annuity } from '../../../utils/finance.js';
import { tipShow, tipHide } from '../../../components/tooltip.js';
import { S, axisText } from '../../../charts/index.js';
import { state } from '../state.js';
import { fmtN, fmtAM, fmtIRR, fmtX } from '../ui.js';
import { T } from '../text.js';
import { SEED } from '../data/seed.js';
import { OPT, MJA2026 } from '../data/optimizer.js';
import { esrAtYear } from '../lib/scores.js';
import { merchantPerMW } from '../lib/lab.js';

/**
 * Gross→net reconciliation for a confidential reconciliation point.
 * Returns null when the point is absent, which is always in production.
 */
function mjaReconcile(r){
  if (!r) return null;
  const dischargedMWh = r.dsocMW * 8760 * r.cfPct / 100;
  const grossSales = dischargedMWh * r.dwp;
  const chargeCost = dischargedMWh / (r.rte / 100) * r.lwp;
  const spreadMargin = dischargedMWh * r.spread;
  const netMargin = grossSales - chargeCost;
  return { dischargedMWh, grossSales, chargeCost, spreadMargin, netMargin };
}

/* ---- MJA annual forecast arrays (BESS 1, 30-year) -------------------------
   Every parameter this reconstruction is anchored to now lives in
   local-data/wa-mja2026.json under `reconstruction`.

   They were previously hardcoded here as literals — the capacity price, the
   discharge-weighted price path, the duration-protection schedule and the
   refurbishment year. That made this function a reconstruction of confidential
   third-party figures sitting in the public bundle, which is exactly what the
   data module next door was flagged for. Moving the constants was the point; the
   arithmetic is unchanged.

   Returns null when the confidential layer is absent. Display-only and
   gross-basis either way — never fed into EBITDA/IRR/DSCR. */
let _mjaSeriesCache = null;
function mjaSeries(){
  if (_mjaSeriesCache) return _mjaSeriesCache;
  const R = MJA2026?.reconstruction;
  if (!R) return null;

  const reqAct = (fy) => {
    for (const [untilFy, hours] of R.requirementHoursByFY){
      if (fy <= untilFy) return hours;
    }
    return R.requirementHoursBeyond;
  };

  const years = [], dwp = [], lwp = [], spread = [], cf = [], capRev = [], energyGross = [], netEnergy = [], essRocof = [], total = [], derate = [];
  for (let i = 0; i < R.years; i++){
    const fy = R.startFY + i, ysr = i < R.refurbYear ? i : i - R.refurbYear;
    const c = R.cfStart - R.cfDeclinePerYear * ysr;
    const d = R.dwpStart + R.dwpSlope * i;
    const l = R.lwpStart + R.lwpSlope * i;
    const usable = R.usableHoursAtRefCf * (c / R.cfStart);
    const effReq = i < R.protectYears ? 6 : reqAct(fy);
    const der = Math.min(usable / effReq, 1);
    const dischMWh = R.dsocMW * 8760 * c;
    const eg = dischMWh * d, cc = dischMWh / R.rte * l;
    const cap = R.dsocMW * der * R.peakRcp;
    const ess = Math.max(R.essFloorAM, R.essStartAM - R.essSlopeAM * i) * 1e6;
    years.push(fy); dwp.push(d); lwp.push(+l.toFixed(1)); spread.push(+(d - l).toFixed(1)); cf.push(+(c * 100).toFixed(1));
    energyGross.push(eg); netEnergy.push(eg - cc); capRev.push(cap); essRocof.push(ess); total.push(cap + eg + ess); derate.push(der);
  }
  _mjaSeriesCache = { years, dwp, lwp, spread, cf, capRev, energyGross, netEnergy, essRocof, total, derate, peakRcp: R.peakRcp, refurbFY: R.startFY + R.refurbYear };
  return _mjaSeriesCache;
}
function rcmScnParams(scn){ if (scn === 'CUSTOM'){ if (!state.rcmCustom) state.rcmCustom = { ...OPT.scnParams.BASE }; return state.rcmCustom; } return OPT.scnParams[scn]; }
function stratParams(strat){ return OPT.strat[strat] || OPT.strat.BALANCED; }
function optimizerModel(inp, scn, strat){
  const sc = rcmScnParams(scn), st = stratParams(strat);
  const esr = esrAtYear(state.codYear);   // current official rule vintage for the selected COD year
  const usableMWh = inp.mw * inp.hours * (inp.rte / 100);
  const derate = Math.min(1, inp.hours / esr);
  const ccMW = inp.mw * (inp.ccPct / 100) * sc.ccRet * derate;                 // Capacity Credits after CRC/NAQ/assigned + derate
  const grossRcm = ccMW * SEED.brcp2829 * sc.rcpFactor * (inp.rcpAdj || 1);    // = CC × BRCP × expected RCP/BRCP factor
  const refundPct = sc.refundBase * st.refundMult;
  const refund = grossRcm * refundPct / 100;
  const netRcm = grossRcm - refund;
  const energyNet = inp.mw * merchantPerMW(inp.hours) * (inp.avail / 100) * st.energy * sc.merchScale * (inp.merchFactor || 1);
  const chargeRatio = 0.40;                                                    // charging cost as share of gross Energy (illustrative)
  const energyGross = energyNet / (1 - chargeRatio), chargingCost = energyGross - energyNet;
  const fcessEnable = inp.mw * 1000 * inp.fcessKW * st.fcess;                  // enablement (capacity) revenue — NOT delivered MWh
  const fcessActivation = fcessEnable * 0.05;                                  // small net activation settlement (illustrative)
  const fcessNet = fcessEnable + fcessActivation;
  const degrCost = st.cycles * usableMWh * 4;                                  // A$4/MWh throughput (illustrative)
  const fees = (energyGross + fcessEnable) * 0.02;                            // optimizer + market fees
  const opex = inp.mw * 1000 * inp.opexKW;
  const merchNet = energyNet + fcessNet - degrCost - fees;
  const ebitda1 = netRcm + merchNet - opex;
  const capex = inp.mw * 1000 * inp.hours * inp.capexKWh;
  const cfs = [-capex], ebitda = [];
  for (let y = 1; y <= inp.life; y++){ const e = netRcm + merchNet * Math.pow(1 - inp.degr / 100, y - 1) - opex; ebitda.push(e); cfs.push(e); }
  const debt = capex * inp.debtPct / 100, ds = annuity(debt, inp.rate / 100, inp.tenor);
  const dscrs = ebitda.slice(0, inp.tenor).map(e => e / ds);
  const lev = [-(capex - debt)]; for (let y = 1; y <= inp.life; y++) lev.push(ebitda[y - 1] - (y <= inp.tenor ? ds : 0));
  let cum = -capex, payback = null; for (let y = 1; y <= inp.life; y++){ cum += ebitda[y - 1]; if (cum >= 0 && payback == null) payback = y; }
  const total = netRcm + energyNet + fcessNet, vol = sc.vol * st.vol;
  const oblHoursYr = (OPT.oblEnd - OPT.oblStart + 1) * 365;
  return {
    scn, strat, sc, st, ccMW, derate, grossRcm, refundPct, refund, netRcm,
    energyGross, chargingCost, energyNet, fcessEnable, fcessActivation, fcessNet, degrCost, fees, opex,
    totalNet: ebitda1, shareRcm: netRcm / total, shareEnergy: energyNet / total, shareFcess: fcessNet / total,
    capex, ebitda1, cycles: st.cycles, esr,
    unlevIRR: irrOf(cfs), levIRR: irrOf(lev), npv: npvOf(inp.disc / 100, cfs),
    minDSCR: dscrs.length ? Math.min(...dscrs) : null,
    avgDSCR: dscrs.length ? dscrs.reduce((a, b) => a + b, 0) / dscrs.length : null,
    p95Rev: ebitda1 * (1 - vol), vol,
    socCoverHours: inp.hours * (st.socBuf / 100),
    shortP50: +(refundPct * 0.5).toFixed(1), shortP95: +(refundPct * 1.5).toFixed(1),
    rcmShadowPerMWh: netRcm / oblHoursYr / inp.mw * sc.shadow, payback,
  };
}
function buildDispatch(inp, scn, strat, ccMW){
  const st = stratParams(strat), price = OPT.price24, mw = inp.mw, cap = inp.mw * inp.hours;
  const ce = Math.sqrt(inp.rte / 100), de = Math.sqrt(inp.rte / 100), ccFrac = Math.min(1, ccMW / mw);
  // RCM Energy Floor only binds in a lead-up to, and during, the obligation window; every strategy
  // must charge at least to the window-start floor (an aggressive merchant strategy holds the minimum).
  const wsFloor = Math.min(0.95, (OPT.oblEnd - OPT.oblStart + 1) * ccFrac / inp.hours);
  const leadUp = 3, target = Math.max(st.socBuf / 100, wsFloor + 0.02);
  const charge = [], discharge = [], fcess = [], soc = [], floor = [];
  let s = 0.25;
  for (let hh = 0; hh < 24; hh++){
    const inObl = hh >= OPT.oblStart && hh <= OPT.oblEnd;
    let remH; if (inObl) remH = OPT.oblEnd - hh + 1; else if (hh >= OPT.oblStart - leadUp && hh < OPT.oblStart) remH = OPT.oblEnd - OPT.oblStart + 1; else remH = 0;
    const fl = Math.min(0.95, remH * ccFrac / inp.hours);
    let ch = 0, dis = 0;
    if (price[hh] < 25 && s < target){ ch = Math.min(mw, (target - s) * cap / ce); s = Math.min(1, s + ch * ce / cap); }
    else if (price[hh] > 90){ const headroom = Math.max(0, (s - fl) * cap * de); const aggr = 0.45 + 0.4 * Math.min(1.6, st.energy); dis = Math.min(mw * aggr, headroom); s = Math.max(fl, s - dis / de / cap); }
    let fc = (inObl ? 0.10 : 0.28) * mw * Math.min(1.6, st.fcess);
    fc = Math.max(0, Math.min(fc, mw - dis));                                   // stays within the MW envelope (no double count with discharge)
    charge.push(ch); discharge.push(dis); fcess.push(fc); soc.push(s * 100); floor.push(fl * 100);
  }
  return { price, charge, discharge, fcess, soc, floor, obl: [OPT.oblStart, OPT.oblEnd], mwMax: mw };
}
function optExplanation(scn, strat, m, inp){
  const dom = m.shareRcm >= Math.max(m.shareEnergy, m.shareFcess) ? ['RCM capacity revenue', 'RCM容量收入'] : m.shareEnergy >= m.shareFcess ? ['Energy arbitrage', '现货套利'] : ['FCESS', 'FCESS'];
  const prefEF = m.st.energy >= m.st.fcess ? ['Energy is preferred over FCESS: the expected merchant spread exceeds FCESS enablement value plus SOC-drift and degradation cost in most intervals.', '现货优先于FCESS：多数时段的预期现货价差高于FCESS成交价值加上SOC漂移与衰减成本。']
    : ['FCESS is preferred where enablement value exceeds the foregone Energy margin and sufficient Raise/Lower headroom and SOC remain.', '在成交价值高于放弃的现货边际收益、且仍有足够上/下调裕度与SOC时，FCESS优先。'];
  return [
    { h: ['1 · RCM position', '1 · RCM持仓'], b: [
      'Expected Peak RCP is ' + fmtN(m.sc.rcpFactor * 100) + '% of BRCP; ' + fmtN(m.ccMW) + ' MW of Capacity Credits generate ' + fmtAM(m.grossRcm) + ' gross and ' + fmtAM(m.netRcm) + ' net RCM revenue after refunds.',
      '预期峰值RCP为BRCP的' + fmtN(m.sc.rcpFactor * 100) + '%；' + fmtN(m.ccMW) + ' MW容量信用产生毛RCM收入' + fmtAM(m.grossRcm) + '，扣除退款后净RCM收入' + fmtAM(m.netRcm) + '。'] },
    { h: ['2 · Operating constraint', '2 · 运行约束'], b: [
      'During the Peak ESR obligation window (' + OPT.oblStart + ':30–' + OPT.oblEnd + ':30 AWST) the optimizer holds an SOC buffer around ' + fmtN(m.st.socBuf) + '% and keeps SOC above the RCM Energy Floor.',
      '在Peak ESR义务时段（' + OPT.oblStart + ':30–' + OPT.oblEnd + ':30 AWST）内，优化商保持约' + fmtN(m.st.socBuf) + '%的SOC缓冲，并使SOC高于RCM最低保障电量。'] },
    { h: ['3 · Merchant allocation', '3 · 市场化分配'], b: prefEF },
    { h: ['4 · Risk', '4 · 风险'], b: [
      'Expected Capacity Cost Refund is ' + fmtN(m.refundPct) + '% of gross RCM (' + fmtAM(m.refund) + '); charge-shortfall probability P50/P95 ≈ ' + m.shortP50 + '% / ' + m.shortP95 + '%. Revenue volatility class: ' + (m.vol >= 1.3 ? 'high' : m.vol >= 0.9 ? 'medium' : 'low') + '.',
      '预期容量成本退款为毛RCM的' + fmtN(m.refundPct) + '%（' + fmtAM(m.refund) + '）；充电不足概率P50/P95≈' + m.shortP50 + '% / ' + m.shortP95 + '%。收益波动等级：' + (m.vol >= 1.3 ? '高' : m.vol >= 0.9 ? '中' : '低') + '。'] },
    { h: ['5 · Investment impact', '5 · 投资影响'], b: [
      'Total net operating revenue ' + fmtAM(m.totalNet) + '/yr; levered IRR ' + fmtIRR(m.levIRR) + ', min DSCR ' + fmtX(m.minDSCR) + ', payback ' + (m.payback == null ? '—' : m.payback + ' yr') + '. Dominant value source: ' + L(dom) + '.',
      '总净运营收入约' + fmtAM(m.totalNet) + '/年；杠杆IRR ' + fmtIRR(m.levIRR) + '，最低DSCR ' + fmtX(m.minDSCR) + '，回收期' + (m.payback == null ? '—' : m.payback + '年') + '。主导价值来源：' + L(dom) + '。'] },
  ];
}
// Daily dispatch chart — three aligned single-axis panels (MW · SOC% · price) sharing a 24-hour x-axis
function dispatchChart(parent, D){
  const W = 760, H = 380, padL = 54, padR = 54, padT = 18, gap = 14, xlab = 22, n = 24;
  const bandH = (H - padT - xlab - 2 * gap) / 3, plotL = padL, plotR = W - padR;
  const xAt = i => plotL + i * (plotR - plotL) / (n - 1), bw = (plotR - plotL) / n * 0.46;
  const svg = S('svg', { viewBox: `0 0 ${W} ${H}` });
  const ox1 = xAt(Math.max(0, D.obl[0] - 0.5)), ox2 = xAt(Math.min(n - 1, D.obl[1] + 0.5));
  svg.append(S('rect', { x: ox1, y: padT, width: ox2 - ox1, height: 3 * bandH + 2 * gap, fill: 'var(--s3)', opacity: 0.10 }));
  svg.append(axisText((ox1 + ox2) / 2, padT + 9, L(['Peak ESR obligation window', 'Peak ESR义务时段']), 'middle', 9.5));
  // Panel A — power MW (bidirectional)
  const aTop = padT, aMid = aTop + bandH / 2, mwMax = D.mwMax * 1.05, mwY = v => aMid - v / mwMax * (bandH / 2 - 4);
  svg.append(S('line', { x1: plotL, x2: plotR, y1: aMid, y2: aMid, stroke: 'var(--baseline)', 'stroke-width': 1 }));
  svg.append(axisText(plotL - 6, aTop + 9, '+' + fmtN(D.mwMax), 'end', 9));
  svg.append(axisText(plotL - 6, aTop + bandH - 1, '−' + fmtN(D.mwMax), 'end', 9));
  svg.append(axisText(plotL, aTop - 3, L(['Power: discharge ▲ / charge ▼ · FCESS enabled (- -)', '功率：放电▲/充电▼ · FCESS成交(- -)']), 'start', 9.5));
  for (let i = 0; i < n; i++){
    if (D.discharge[i] > 0.5) svg.append(S('rect', { x: xAt(i) - bw / 2, y: mwY(D.discharge[i]), width: bw, height: aMid - mwY(D.discharge[i]), fill: 'var(--s2)', rx: 2 }));
    if (D.charge[i] > 0.5) svg.append(S('rect', { x: xAt(i) - bw / 2, y: aMid, width: bw, height: mwY(-D.charge[i]) - aMid, fill: 'var(--s1)', rx: 2 }));
  }
  let fp = ''; for (let i = 0; i < n; i++) fp += (i ? 'L' : 'M') + xAt(i) + ',' + mwY(D.fcess[i]);
  svg.append(S('path', { d: fp, fill: 'none', stroke: 'var(--s3)', 'stroke-width': 1.5, 'stroke-dasharray': '3 3' }));
  // Panel B — SOC% + RCM floor
  const bTop = aTop + bandH + gap, bBot = bTop + bandH, socY = v => bBot - v / 100 * (bandH - 6);
  [0, 50, 100].forEach(t => { svg.append(S('line', { x1: plotL, x2: plotR, y1: socY(t), y2: socY(t), stroke: 'var(--grid)', 'stroke-width': 1 })); svg.append(axisText(plotL - 6, socY(t) + 3, t + '%', 'end', 9)); });
  svg.append(axisText(plotL, bTop - 3, L(['State of charge (—) vs RCM Energy Floor (- -)', '荷电状态(—)与RCM最低保障电量(- -)']), 'start', 9.5));
  let sp = '', flp = ''; for (let i = 0; i < n; i++){ sp += (i ? 'L' : 'M') + xAt(i) + ',' + socY(D.soc[i]); flp += (i ? 'L' : 'M') + xAt(i) + ',' + socY(D.floor[i]); }
  svg.append(S('path', { d: flp, fill: 'none', stroke: 'var(--s6)', 'stroke-width': 1.5, 'stroke-dasharray': '5 3' }));
  svg.append(S('path', { d: sp, fill: 'none', stroke: 'var(--s5)', 'stroke-width': 2, 'stroke-linejoin': 'round' }));
  // Panel C — price
  const cTop = bTop + bandH + gap, cBot = cTop + bandH, pr = D.price, pmin = Math.min(...pr), pmax = Math.max(...pr), prY = v => cBot - (v - pmin) / (pmax - pmin) * (bandH - 6);
  svg.append(S('line', { x1: plotL, x2: plotR, y1: prY(0), y2: prY(0), stroke: 'var(--baseline)', 'stroke-width': 1 }));
  svg.append(axisText(plotL - 6, prY(pmax) + 3, 'A$' + fmtN(pmax), 'end', 9));
  svg.append(axisText(plotL - 6, prY(pmin) + 3, 'A$' + fmtN(pmin), 'end', 9));
  svg.append(axisText(plotL, cTop - 3, L(['Energy price A$/MWh', '现货价格 A$/MWh']), 'start', 9.5));
  let pp = ''; for (let i = 0; i < n; i++) pp += (i ? 'L' : 'M') + xAt(i) + ',' + prY(pr[i]);
  svg.append(S('path', { d: pp, fill: 'none', stroke: 'var(--s8)', 'stroke-width': 2, 'stroke-linejoin': 'round' }));
  for (let i = 0; i < n; i += 3) svg.append(axisText(xAt(i), H - 6, (i < 10 ? '0' + i : i) + ':00', 'middle', 9));
  const cross = S('line', { y1: padT, y2: padT + 3 * bandH + 2 * gap, stroke: 'var(--baseline)', 'stroke-width': 1, visibility: 'hidden' }); svg.append(cross);
  const ov = S('rect', { x: plotL, y: padT, width: plotR - plotL, height: 3 * bandH + 2 * gap, fill: 'transparent' });
  ov.addEventListener('mousemove', ev => {
    const r = svg.getBoundingClientRect(), sx = W / r.width, mx = (ev.clientX - r.left) * sx;
    let bi = 0, bd = 1e9; for (let i = 0; i < n; i++){ const dd = Math.abs(xAt(i) - mx); if (dd < bd){ bd = dd; bi = i; } }
    cross.setAttribute('x1', xAt(bi)); cross.setAttribute('x2', xAt(bi)); cross.setAttribute('visibility', 'visible');
    const hr = (bi < 10 ? '0' + bi : bi) + ':00';
    let html = `<b>${hr} AWST</b>`;
    html += `<div class="tr"><span>${L(['Price', '价格'])}</span><b>A$${fmtN(D.price[bi])}</b></div>`;
    html += `<div class="tr"><span>${L(['Discharge', '放电'])}</span><b>${fmtN(D.discharge[bi])} MW</b></div>`;
    html += `<div class="tr"><span>${L(['Charge', '充电'])}</span><b>${fmtN(D.charge[bi])} MW</b></div>`;
    html += `<div class="tr"><span>FCESS</span><b>${fmtN(D.fcess[bi])} MW</b></div>`;
    html += `<div class="tr"><span>SOC</span><b>${fmtN(D.soc[bi])}%</b></div>`;
    html += `<div class="tr"><span>${L(['RCM floor', 'RCM最低保障电量'])}</span><b>${fmtN(D.floor[bi])}%</b></div>`;
    tipShow(html, ev);
  });
  ov.addEventListener('mouseleave', () => { cross.setAttribute('visibility', 'hidden'); tipHide(); });
  svg.append(ov);
  const wrap = h('div', { class: 'chart' }); wrap.append(svg); parent.append(wrap); return wrap;
}

export { mjaReconcile, mjaSeries, rcmScnParams, stratParams, optimizerModel, buildDispatch, optExplanation, dispatchChart };
