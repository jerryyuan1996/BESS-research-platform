/* ---------------------------------------------------------------------------
   Poland — the constants and helpers every section reads.

   Lifted verbatim from the prelude of the single-file sections.js. BUILT FROM
   `api`, NOT IMPORTED: `O` is `M.official` and `M` is the market dataset,
   which the engine already holds. Importing data.js here would put 20+ kB into
   every section chunk, or hoist it into a chunk the landing tab also pays for.

   `SEC_B` and `SECTIONS()` are kept in the copied text because they are part
   of the prelude, but they are unused here: the facade owns the section map,
   and each section module owns its own local `SEC_B`.
   --------------------------------------------------------------------------- */

/**
 * @param {object} api  supplied by src/markets/_shared/engine.js
 * @returns {object} O, capEurKW, perNameplate, plMerchantPerMW
 */
export function createShared(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;

// ---------------- section registry ----------------
const SEC_B = {};
function SECTIONS(){
  const o = {};
  Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
  return o;
}
const O = M.official;
const capEurKW = O.cmPricePln / M.fx;                                  // €/kW/yr de-rated
const perNameplate = hh => capEurKW * interp(M.deratingCurve, hh) * 1000;  // €/MW/yr
const plMerchantPerMW = hh => hh * M.usableFraction * M.lab.cycles * 365 * (M.lab.avail / 100)
  * M.lab.spread * interp(M.durSpreadFactor, hh);

// ============================== OVERVIEW ==============================
  return { O, capEurKW, perNameplate, plMerchantPerMW };
}
