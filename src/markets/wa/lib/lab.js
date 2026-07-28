/* ---------------------------------------------------------------------------
   Investment-lab annual model, verbatim from the prototype
   (lines 3211-3220, 3230-3257).

   The prototype declared npvOf / irrOf / annuity here as well (lines 3221-3229),
   byte-identical to the cockpit copies. They are imported from utils/finance.js
   instead of duplicated.
   --------------------------------------------------------------------------- */
import { npvOf, irrOf, annuity } from '../../../utils/finance.js';
import { state } from '../state.js';
import { SEED } from '../data/seed.js';
import { esrAtYear } from '../lib/scores.js';

function merchantPerMW(hours){
  const ks = Object.keys(SEED.merchantCurve).map(Number).sort((a, b) => a - b);
  if (hours <= ks[0]) return SEED.merchantCurve[ks[0]];
  if (hours >= ks[ks.length - 1]) return SEED.merchantCurve[ks[ks.length - 1]];
  for (let i = 0; i < ks.length - 1; i++) if (hours >= ks[i] && hours <= ks[i + 1]){
    const f = (hours - ks[i]) / (ks[i + 1] - ks[i]);
    return SEED.merchantCurve[ks[i]] * (1 - f) + SEED.merchantCurve[ks[i + 1]] * f;
  }
  return SEED.merchantCurve[ks[0]];
}
function labModel(inp){
  const esr = esrAtYear(state.codYear);
  const capex = inp.mw * 1000 * inp.hours * inp.capexKWh;
  const derate = Math.min(1, inp.hours / esr);              // indicative linear derating below the ESR requirement
  const ccMW = inp.mw * (inp.ccPct / 100) * derate;
  const rcm = ccMW * SEED.brcp2829 * (inp.rcpPct / 100);
  const merch1 = inp.mw * merchantPerMW(inp.hours) * (inp.avail / 100) * (inp.rte / 88) * (inp.merchFactor || 1);
  const fcess = inp.mw * 1000 * inp.fcessKW;
  const opex = inp.mw * 1000 * inp.opexKW;
  const ebitda = [], cfs = [-capex];
  for (let y = 1; y <= inp.life; y++){
    const e = rcm + merch1 * Math.pow(1 - inp.degr / 100, y - 1) + fcess - opex;
    ebitda.push(e); cfs.push(e);
  }
  const debt = capex * inp.debtPct / 100;
  const ds = annuity(debt, inp.rate / 100, inp.tenor);
  const dscrs = ebitda.slice(0, inp.tenor).map(e => e / ds);
  const lev = [-(capex - debt)];
  for (let y = 1; y <= inp.life; y++) lev.push(ebitda[y - 1] - (y <= inp.tenor ? ds : 0));
  let cum = -capex, payback = null;
  for (let y = 1; y <= inp.life; y++){ cum += ebitda[y - 1]; if (cum >= 0 && payback == null) payback = y; }
  return { capex, ccMW, rcm, merch1, fcess, opex, ebitda1: ebitda[0], derate,
    unlevIRR: irrOf(cfs), levIRR: irrOf(lev), npv: npvOf(inp.disc / 100, cfs),
    minDSCR: dscrs.length ? Math.min(...dscrs) : null,
    avgDSCR: dscrs.length ? dscrs.reduce((a, b) => a + b, 0) / dscrs.length : null, payback };
}
function loadSnaps(){ try { return JSON.parse(localStorage.getItem('wa_snaps') || '[]'); } catch (e){ return []; } }
function saveSnaps(s){ localStorage.setItem('wa_snaps', JSON.stringify(s)); }

export { merchantPerMW, labModel, loadSnaps, saveSnaps };
