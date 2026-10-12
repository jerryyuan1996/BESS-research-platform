/* ---------------------------------------------------------------------------
   WA weighted-score and helper computations, verbatim from the prototype
   (lines 1236-1254).
   --------------------------------------------------------------------------- */
import { SEED } from '../data/seed.js';
import { KEMERTON } from '../data/kemerton.js';

// ---------------- shared computations ----------------
function dniScore(){ return Math.round(SEED.dniFactors.reduce((a, f) => a + f.w * f.s, 0) / 3); }
function esrAtYear(cy){ const i = SEED.esrYears.indexOf(cy); return i >= 0 ? SEED.esrPath[i] : SEED.esrPath[SEED.esrPath.length - 1]; }
function shadowRcpFactor(r){
  if (r < 0.90) return 1.3;
  if (r < 0.95) return 1.3 - (r - 0.90) * (0.3 / 0.05);
  if (r <= 1.05) return 1.0;
  if (r <= 1.15) return 1.0 - (r - 1.05) * (0.5 / 0.10);
  return 0.5;
}
function stageProb(id){ const s = SEED.stages.find(x => x.id === id); return s ? s.p / 100 : 0; }

/**
 * Duration headroom for the confidential project case.
 *
 * Returns null when the project layer is absent, which is always in production.
 * Deliberately not defaulted to zero: `powerMW * hours` on a missing value would
 * produce a plausible-looking 0 MWh requirement and 100% headroom, which is a
 * wrong answer rather than a missing one. Callers branch on null.
 */
function kemDurationCase(hours){
  const p = KEMERTON.project;
  if (!p) return null;
  const required = p.powerMW * hours;
  const headroom = p.energyMWh - required;
  return { hours, required, headroom, pct: headroom / p.energyMWh * 100 };
}

export { dniScore, esrAtYear, shadowRcpFactor, stageProb, kemDurationCase };
