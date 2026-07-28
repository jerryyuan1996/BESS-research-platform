/* ---------------------------------------------------------------------------
   WA weighted-score and helper computations, verbatim from the prototype
   (lines 1236-1254).
   --------------------------------------------------------------------------- */
import { SEED } from '../data/seed.js';
import { KEMERTON } from '../data/kemerton.js';

// ---------------- shared computations ----------------
function dniScore(){ return Math.round(SEED.dniFactors.reduce((a, f) => a + f.w * f.s, 0) / 3); }
function connScore(){ return Math.round(SEED.connFactors.reduce((a, f) => a + f.w * f.s, 0) / 3); }
function compositeScore(){ return Math.round(SEED.components.reduce((a, c) => a + c.w * c.s, 0) / 100); }
function esrAtYear(cy){ const i = SEED.esrYears.indexOf(cy); return i >= 0 ? SEED.esrPath[i] : SEED.esrPath[SEED.esrPath.length - 1]; }
function shadowRcpFactor(r){
  if (r < 0.90) return 1.3;
  if (r < 0.95) return 1.3 - (r - 0.90) * (0.3 / 0.05);
  if (r <= 1.05) return 1.0;
  if (r <= 1.15) return 1.0 - (r - 1.05) * (0.5 / 0.10);
  return 0.5;
}
function stageProb(id){ const s = SEED.stages.find(x => x.id === id); return s ? s.p / 100 : 0; }

function kemDurationCase(hours){
  const required = KEMERTON.project.powerMW * hours;
  const headroom = KEMERTON.project.energyMWh - required;
  return { hours, required, headroom, pct: headroom / KEMERTON.project.energyMWh * 100 };
}

export { dniScore, connScore, compositeScore, esrAtYear, shadowRcpFactor, stageProb, kemDurationCase };
