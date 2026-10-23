/* ---------------------------------------------------------------------------
   docs/merchant-lines-plan-2026-10.md — the derivation, from its stated inputs.

     node scripts/derive/merchant-lines.mjs

   Read-only. Re-fits the cannibalisation curve on Bulgaria's two observed
   windows, rebuilds Romania's and Poland's paths and year-1 seeds, checks them
   against what src/markets/{ro,pl}/comparison.js carry, and prints the engine's
   returns and the merchant-line coverage for the four markets in the plan.

   The day-ahead statistics are inputs here (EUR/MW/day of a 1 MW battery, one
   cycle a day, 88% round trip, perfect foresight, hourly prices): PSE csdac-pln
   for Poland, SMARD for Germany, GME for Italy, SDAC results for Romania and
   Bulgaria (to be recomputed from ENTSO-E or OPCOM/IBEX: gate MR-4).
   --------------------------------------------------------------------------- */
import { byId } from '../../src/markets/registry.js';
import { runCase } from '../../src/comparison/engine.js';
import { fitOf } from '../../src/comparison/designFit.js';
import { merchantCoverage } from '../../src/governance/briefing.js';

const pct = (x) => (x * 100).toFixed(1) + '%';
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;

/* ---- the fit: Bulgaria against Poland, 2h value, 2026 window ÷ 2025 window ---- */
const BG_LOAD = (38876298 - 3601017) / 8760 / 1000;           // ESO 2025: gross consumption less plants' own use, GW
const PF2 = { bg: { jj: [304.6, 268.0], as: [341.5, 306.4] }, pl: { jj: [259.6, 291.1], as: [310.3, 362.7] } };
const rel = (w) => 1 - (PF2.bg[w][1] / PF2.bg[w][0]) / (PF2.pl[w][1] / PF2.pl[w][0]);
/* Monthly Bulgarian fleet, GW, interpolated between ESO's dated counts
   (end-2024 ~0.086, Aug 2025 ~0.5, end-2025 1.382, May 2026 3.432, mid-June ~4.8, mid-Aug 5.406). */
const bg25 = [0.09, 0.10, 0.12, 0.15, 0.25, 0.35, 0.45, 0.50, 0.65];
const bg26 = [1.40, 1.85, 2.30, 2.85, 3.43, 4.50, 5.00, 5.40, 5.60];
const x1 = (mean(bg26.slice(0, 7)) - mean(bg25.slice(0, 7))) / BG_LOAD;
const x2 = (mean(bg26.slice(3, 9)) - mean(bg25.slice(3, 9))) / BG_LOAD;
const c1 = rel('jj'), c2 = rel('as');
let lo = 0.05, hi = 2;
for (let i = 0; i < 100; i++){
  const k = (lo + hi) / 2;
  if ((1 - Math.exp(-x2 / k)) / (1 - Math.exp(-x1 / k)) > c2 / c1) hi = k; else lo = k;
}
const K = (lo + hi) / 2, A = c1 / (1 - Math.exp(-x1 / K));
const factor = (x) => 1 - A * (1 - Math.exp(-x / K));
console.log(`Fit: Bulgaria x ${x1.toFixed(2)} → −${pct(c1)}, x ${x2.toFixed(2)} → −${pct(c2)}; compression = −${pct(A)} × (1 − e^(−x/${K.toFixed(3)}))`);

/* ---- the paths ---- */
function path(fleet, load){
  const base = fleet[2025];
  return Object.fromEntries(Object.entries(fleet).map(([y, f]) => [y, factor((f - base) / load)]));
}
const show = (name, p) => console.log(`${name} path: ` + Object.entries(p).map(([y, f]) => `${y} ${f.toFixed(3)}`).join('  '));
const ro = path({ 2025: 0.3, 2026: 1.1, 2027: 2.75, 2028: 4.25, 2029: 5.75 }, 53.1 / 8.76);
const pl = path({ 2025: 0.3, 2026: 0.9, 2027: 1.95, 2028: 3.5, 2029: 4.75, 2030: 5.75 }, 18.075);
show('Romania', ro); show('Poland ', pl);

/* ---- the seeds against what the comparison files carry ---- */
const check = (id, l0, f, curve, label) => {
  const e = byId(id).comparison.economics;
  const derived = Math.round(l0 * f);
  console.log(`${label}: ${l0.toFixed(1)} × ${f.toFixed(3)} = ${derived}; file carries ${e.merchGross} (${pct(e.merchGross / derived - 1)} off); curve ${curve.map(v => v.toFixed(3)).join(', ')} vs file ${e.merchantCurve.join(', ')}`);
};
check('ro', 288.5 * 365, ro[2027], [1, ro[2028] / ro[2027], ro[2029] / ro[2027]], 'Romania year 1 (2027)');
check('pl', 399.1 * 365, pl[2028], [1, pl[2029] / pl[2028], pl[2030] / pl[2028]], 'Poland year 1 (2028)');

/* ---- returns and coverage ---- */
console.log('\nmarket  route  hold    exit5   best design            coverage  marker');
for (const id of ['ro', 'pl', 'de', 'it']){
  const m = byId(id), base = m.comparison.baseStrategy || (id === 'it' ? 'cap' : 'mer');
  const r = runCase(m, base, 5), fit = fitOf(m), cov = merchantCoverage(m.comparison);
  console.log(`${id.padEnd(7)} ${base.padEnd(6)} ${pct(r.irrHold).padEnd(7)} ${pct(r.irrExit).padEnd(7)} ${(fit.best.route + ' ' + fit.best.hours + 'h $' + Math.round(fit.best.value / 1000) + 'k').padEnd(22)} ${pct(cov.coverage).padEnd(9)} ${cov.marker}`);
}
