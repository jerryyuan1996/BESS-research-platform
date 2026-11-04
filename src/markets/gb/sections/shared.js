/* ---------------------------------------------------------------------------
   Great Britain — the constants and helpers every section reads.

   Lifted verbatim from the prelude of the single-file sections.js. BUILT FROM
   `api`, NOT IMPORTED: `O` is `M.official` and `M` is the market dataset,
   which the engine already holds. Importing data.js here would put 20+ kB into
   every section chunk, or hoist it into a chunk the landing tab also pays for.

   `SEC_B` and `SECTIONS()` are kept in the copied text because they are part
   of the prelude, but they are unused here: the facade owns the section map,
   and each section module owns its own local `SEC_B`.
   --------------------------------------------------------------------------- */
import { designLine, designBest, routeFit } from '../../_shared/designAnswer.js';

/**
 * @param {object} api  supplied by src/markets/_shared/engine.js
 * @returns {object} O, designNow
 */
export function createShared(api){
  const { h, L, MKT, M, SRC, T, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, durationAt, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;

// ---------------- section registry (parts are concatenated by build.js) ----------------
const SEC_B = {};
function SECTIONS(){
  const o = {};
  Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
  return o;
}
const O = M.official;

/* What to build, as the Brief states it (guided-experience plan, PR 7): the
   engine's best design, then the capacity route's own answer. Every GB tab
   that names a duration reads it from here. */
function designNow(){
  const best = designBest('gb'), cap = routeFit('gb', 'cap');
  if (!best) return ['Not priced', '未定价'];
  const lead = best.name[0].charAt(0).toUpperCase() + best.name[0].slice(1);
  return [lead + ' at ' + best.hours + 'h' + (cap ? '; capacity route ' + cap.span[0] : ''),
    best.name[1] + best.hours + '小时' + (cap ? '；容量路径' + cap.span[1] : '')];
}

// ============================== OVERVIEW ==============================
  return { O, designNow };
}
