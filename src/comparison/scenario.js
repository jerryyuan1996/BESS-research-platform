/* ---------------------------------------------------------------------------
   SCENARIO — a market as it would be under someone else's assumptions.

   The Investment Lab does not have a model of its own. It re-runs the comparison
   engine, which is the point: a number a reader produces by moving an input has
   to be the same KIND of number as the one in the league table above it, or the
   two pages are quietly arguing.

   So a scenario is not a second engine. It is a shallow copy of a registry entry
   whose `comparison.economics` carries the reader's overrides, handed to the
   unmodified runCase(). Nothing in engine.js knows this file exists.

       market + overrides  ──►  withOverrides()  ──►  runCase()  ──►  sizeProjectDebt()

   Two consequences worth stating. The original market object is never mutated,
   so a scenario cannot leak into the cards, the league table or another tab. And
   an override of a field the engine ignores for the selected route simply has no
   effect — there is no code here deciding which inputs matter, because the engine
   already decides that.
   --------------------------------------------------------------------------- */
import { DEBT_CONVENTIONS } from '../economics/projectDebt.js';
import { DEBT_RANGES, clampToRange } from './ranges.js';

/** Immutable deep-set for the dotted paths the field catalogue uses. */
function setPath(obj, path, value){
  const keys = path.split('.');
  const head = keys[0];
  if (keys.length === 1) return { ...obj, [head]: value };
  return { ...obj, [head]: setPath(obj[head] || {}, keys.slice(1).join('.'), value) };
}

/**
 * A registry entry as it would be under `overrides`.
 *
 * @param {object} market      registry entry ({ manifest, comparison, … })
 * @param {object} overrides   { [dotted economics path]: number }
 * @returns {object} a new entry; `market` is untouched
 */
export function withOverrides(market, overrides){
  if (!market || !market.comparison) return market;
  const keys = Object.keys(overrides || {});
  if (!keys.length) return market;

  let economics = market.comparison.economics;
  for (const key of keys){
    const v = overrides[key];
    if(key==='revenueReadiness' && v && typeof v==='object' && !Array.isArray(v)){
      economics={...economics,revenueReadiness:JSON.parse(JSON.stringify(v))};
      continue;
    }
    if (Number.isFinite(v)) economics = setPath(economics, key, v);
  }

  return { ...market, comparison: { ...market.comparison, economics } };
}

/**
 * Financing conventions under the reader's priced overrides.
 *
 * Only the four priced fields can move, and only inside their governed band.
 * Coverage tests, the tranche split, tenor caps and the rollover allowance are
 * methodology and are not reachable from here at all — see DEBT_RANGES.
 */
export function conventionsWith(overrides){
  const out = { ...DEBT_CONVENTIONS };
  for (const [key, range] of Object.entries(DEBT_RANGES)){
    const v = overrides?.[key];
    if (Number.isFinite(v)) out[key] = clampToRange(v, range);
  }
  return out;
}

/** The overrides that actually differ from the market's seeds, for display. */
export function movedFields(market, overrides){
  const econ = market?.comparison?.economics || {};
  return Object.keys(overrides || {}).filter(key => {
    if(key==='revenueReadiness')return JSON.stringify(overrides[key])!==JSON.stringify(econ[key]||{});
    const seed = key.split('.').reduce((o, k) => (o == null ? o : o[k]), econ);
    return Number.isFinite(overrides[key]) && Number.isFinite(seed)
      && Math.abs(overrides[key] - seed) / (Math.abs(seed) || 1) > 1e-9;
  });
}
