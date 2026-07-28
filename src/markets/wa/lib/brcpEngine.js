/* ---------------------------------------------------------------------------
   Ten-year BRCP forecast engine, verbatim from the prototype (lines 1311-1367).
   No formula changed. The module-level ratio pins (BRCP._indRatio, BRCP._finK)
   are computed on first import, exactly as they were at script-evaluation time.
   --------------------------------------------------------------------------- */
import { BRCP } from '../data/brcp.js';
import { shadowRcpFactor } from '../lib/scores.js';

function brcpCRF(w){ return w * Math.pow(1 + w, BRCP.life) / (Math.pow(1 + w, BRCP.life) - 1); }
function brcpCum(annualPcts){ const o = [1]; let v = 1; for (const p of annualPcts){ v *= (1 + p / 100); o.push(v); } return o; }
function brcpWaccPath(mid, lr){
  const w0 = BRCP.wacc0 * 100, w = [w0];
  for (let i = 1; i <= 3; i++) w.push(w0 + (mid - w0) * i / 3);       // glide to 2031-32 value
  for (let i = 1; i <= 4; i++) w.push(mid + (lr - mid) * i / 4);      // glide to long-run by 2035-36
  w.push(lr, lr);                                                     // flat 2036-38
  return w.map(x => x / 100);
}
function brcpDirectBase(){ const s = BRCP.stack; return s.modules + s.pcs + s.bop + s.construction + s.land + s.connection; }
// indirect- and financing-to-direct ratios are pinned to the official stack so a cost-component
// shock (which mutates the stack) still scales indirect and capitalised financing proportionally.
BRCP._directBase0 = brcpDirectBase();
BRCP._indRatio = BRCP.stack.indirect / BRCP._directBase0;
BRCP._finK = BRCP.stack.financing / (BRCP._directBase0 * BRCP.wacc0);
function brcpStackYear(d, m, c, pcsI, prodI, omI, w){
  const s = BRCP.stack, dr = d / BRCP.benchDur;
  const indRatio = BRCP._indRatio, finK = BRCP._finK;
  const modules = s.modules * dr * m, pcs = s.pcs * pcsI, bop = s.bop * (0.45 + 0.55 * dr) * c,
    construction = s.construction * (0.55 + 0.45 * dr) * c, land = s.land * c, connection = BRCP.fcc + (s.connection - BRCP.fcc) * c;
  const direct = modules + pcs + bop + construction + land + connection;
  const indirect = direct * indRatio * prodI, financing = direct * w * finK, capital = direct + indirect + financing;
  const om = BRCP.fixedOM0 * (0.60 + 0.40 * dr) * omI;
  const brcp = (capital * brcpCRF(w) + om) / BRCP.expectedCC * 1e6;
  return { brcp, comp: { modules, pcs, bop, construction, land, connection, indirect, financing, om }, capital, wacc: w, dur: d };
}
function brcpScenario(scn){
  const dur = [BRCP.benchDur].concat(BRCP.dur[scn]);
  const modArr = scn === 'base' ? BRCP.mod.base.map(x => x + BRCP.knobs.learnAdj) : BRCP.mod[scn];
  const mIdx = brcpCum(modArr), pcsIdx = brcpCum(BRCP.pcs[scn]);
  const inflArr = []; for (let i = 0; i < 9; i++) inflArr.push(i < 5 ? BRCP.inflNear[scn] : BRCP.inflLR[scn]);
  const cIdx = brcpCum(inflArr), prodIdx = brcpCum(Array(9).fill(BRCP.prod[scn])), omIdx = brcpCum(Array(9).fill(BRCP.om[scn]));
  const wacc = brcpWaccPath(BRCP.waccMid[scn], BRCP.waccLR[scn]);
  return BRCP.years.map((cy, i) => ({ cy, i, ...brcpStackYear(dur[i], mIdx[i], cIdx[i], pcsIdx[i], prodIdx[i], omIdx[i], wacc[i]) }));
}
function brcpForecast(){
  const low = brcpScenario('low'), base = brcpScenario('base'), high = brcpScenario('high');
  return BRCP.years.map((cy, i) => ({
    cy, i, low: low[i].brcp, base: base[i].brcp, high: high[i].brcp,
    real: base[i].brcp / Math.pow(1 + BRCP.genInfl, i), dur: base[i].dur, comp: base[i].comp, conf: BRCP.confidence[i],
  }));
}
function brcpSensitivities(){
  const b = brcpStackYear(6, 1, 1, 1, 1, 1, BRCP.wacc0).brcp;
  return [
    { n: ['Add one hour of benchmark duration', '增加一小时基准时长'], v: brcpStackYear(7, 1, 1, 1, 1, 1, BRCP.wacc0).brcp - b },
    { n: ['Reduce battery-module cost by 10%', '电池模块成本下降10%'], v: brcpStackYear(6, 0.9, 1, 1, 1, 1, BRCP.wacc0).brcp - b },
    { n: ['Increase nominal pre-tax WACC by 100 bp', '税前名义WACC上升100基点'], v: brcpStackYear(6, 1, 1, 1, 1, 1, BRCP.wacc0 + 0.01).brcp - b },
    { n: ['Increase BOP / construction / land by 10%', 'BOP/建设/土地成本上升10%'], v: (() => { const s = BRCP.stack, sv = { bop: s.bop, construction: s.construction, land: s.land }; s.bop *= 1.1; s.construction *= 1.1; s.land *= 1.1; const r = brcpStackYear(6, 1, 1, 1, 1, 1, BRCP.wacc0).brcp - b; Object.assign(s, sv); return r; })() },
    { n: ['Add A$50,000/MW of connection capex', '并网资本开支增加A$50,000/MW'], v: (() => { const s = BRCP.stack, sv = s.connection; s.connection += 0.05 * BRCP.benchMW; const r = brcpStackYear(6, 1, 1, 1, 1, 1, BRCP.wacc0).brcp - b; s.connection = sv; return r; })() },
    { n: ['Increase fixed O&M by 10%', '固定运维上升10%'], v: brcpStackYear(6, 1, 1, 1, 1, 1.1, BRCP.wacc0).brcp - b },
  ];
}
function brcpExpectedRcp(baseArr){
  // stylised expected RCP = base BRCP × supply/demand factor from ESOO balance incl anticipated (spec §6.6.6)
  return BRCP.esoo.map((e, i) => e.ant == null ? null : baseArr[i] * shadowRcpFactor(1 + e.ant / e.rct));
}

export { brcpCRF, brcpCum, brcpWaccPath, brcpDirectBase, brcpStackYear, brcpScenario, brcpForecast, brcpSensitivities, brcpExpectedRcp };
