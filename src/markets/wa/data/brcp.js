/* ---------------------------------------------------------------------------
   Ten-year BRCP forecast parameters, verbatim from the prototype (lines 1276-1310).
   Validated in the prototype to reproduce the official 2028-29 BRCP
   (A$488,445 ~ A$488,500) from the official cost stack.
   --------------------------------------------------------------------------- */


// ---------------- Ten-Year BRCP forecast engine (spec addendum §6.6) ----------------
// Validated: reproduces the official 2028-29 BRCP (A$488,445 ≈ A$488,500) and every
// §6.6.11 one-factor sensitivity within rounding, from the official cost stack.
const BRCP = {
  years: ['2028-29', '2029-30', '2030-31', '2031-32', '2032-33', '2033-34', '2034-35', '2035-36', '2036-37', '2037-38'],
  benchMW: 200, benchDur: 6, expectedCC: 200, life: 15, wacc0: 0.1085, officialBrcp: 488500, genInfl: 0.025,
  // official 2028-29 capital cost stack (A$m) + fixed O&M (A$m/yr)
  stack: { modules: 246.67, pcs: 51.24, bop: 50.13, construction: 140.63, land: 4.37, connection: 53.98, indirect: 47.21, financing: 31.41 },
  fcc: 20.0, fixedOM0: 11.40,
  // scenario parameter tables — nine entries, 2029-30 .. 2037-38 (§6.6.7–6.6.9)
  dur:  { low: [7, 7, 7, 7, 7, 7, 7, 7, 7], base: [7, 7, 7.5, 7.5, 7.5, 8, 8, 8, 8], high: [7.5, 8, 8.5, 8.5, 8.5, 8.5, 9, 9, 9] },
  mod:  { low: [-10, -8, -7, -6, -5, -4, -3, -2, -1], base: [-7, -6, -5, -4, -3, -3, -2, -1, 0], high: [-3, -2, -2, -1, 0, 1, 1, 1, 1] },
  pcs:  { low: [-3, -3, -3, -3, -3, -1, -1, -1, -1], base: [-2, -2, -2, -2, 0, 0, 0, 0, 0], high: [0, 0, 0, 1, 1, 1, 1, 1, 1] },
  prod: { low: -1.0, base: -0.5, high: 0 },
  om: { low: 2.5, base: 3.0, high: 4.5 },
  waccMid: { low: 8.8, base: 9.8, high: 11.0 }, waccLR: { low: 8.5, base: 9.5, high: 10.5 },
  inflNear: { low: 2.5, base: 3.25, high: 4.5 }, inflLR: { low: 2.5, base: 2.75, high: 4.5 },
  confidence: ['OFFICIAL', 'HIGH', 'HIGH', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'VERY_LOW', 'VERY_LOW'],
  zones: [{ from: 0, to: 0, label: ['Official', '官方'] }, { from: 1, to: 2, label: ['Near-term', '近期'] }, { from: 3, to: 7, label: ['Medium-term', '中期'] }, { from: 8, to: 9, label: ['Extrapolated', '外推'] }],
  // AEMO 2026 ESOO supply-demand outlook (§6.6.6); ec = existing+committed balance, ant = incl. anticipated
  esoo: [
    { cy: '2028-29', rct: 6323, ec: 347, ant: 969 }, { cy: '2029-30', rct: 6475, ec: -166, ant: 510 },
    { cy: '2030-31', rct: 6644, ec: -207, ant: 454 }, { cy: '2031-32', rct: 6807, ec: -1081, ant: -432 },
    { cy: '2032-33', rct: 6897, ec: -1309, ant: -673 }, { cy: '2033-34', rct: 6997, ec: -1443, ant: -820 },
    { cy: '2034-35', rct: 7197, ec: -1826, ant: -1216 }, { cy: '2035-36', rct: 7454, ec: -2161, ant: -1565 },
    { cy: '2036-37', rct: 7640, ec: null, ant: null }, { cy: '2037-38', rct: 7830, ec: null, ant: null },
  ],
  tech: [
    { cy: '2028-29', t: ['200 MW / 1,200 MWh Li-ion, 6h', '200 MW / 1,200 MWh 锂电，6h'], m: ['ERA final determination', 'ERA最终决定'], off: true },
    { cy: '2029-30', t: ['7h benchmark — under review', '7小时基准 — 审查中'], m: ['2026 Benchmark Technology Review, due Oct 2026', '2026基准技术审查，2026年10月前'], off: false },
    { cy: '2031-32', t: ['7.5h (base assumption)', '7.5小时（基准假设）'], m: ['Modelled — highest median duration in 2026 ESOO', '模型 — 2026 ESOO最高中位时长'], off: false },
    { cy: '2034-35', t: ['8h (base assumption)', '8小时（基准假设）'], m: ['Modelled — prudent investor assumption', '模型 — 审慎投资假设'], off: false },
  ],
  knobs: { learnAdj: 0 },  // shifts base-case module annual decline (+ = less learning / higher cost)
};

export { BRCP };
