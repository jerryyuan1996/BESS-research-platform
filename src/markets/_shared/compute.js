/* ---------------------------------------------------------------------------
   Shared computations, verbatim from the prototype (GB payload lines 751-774).

   All of these read the market's own M dataset and the market-local state, so
   they are bound per market by this factory rather than imported as free
   functions.
   --------------------------------------------------------------------------- */

/** @param {{M:object, state:object}} ctx */
export function createCompute(ctx){
  const { M, state } = ctx;

  /* Resolve a dotted path into M, so a block can address a region-specific
     scorecard as 'regions.tokyo.connFactors'. A plain key such as 'connFactors'
     resolves exactly as before, so every existing market is unaffected. */
  const at = (path) => String(path).split('.').reduce((o, k) => (o == null ? o : o[k]), M);

function weightedScore(items){ return Math.round(items.reduce((a, f) => a + f.w * f.s, 0) / 3); }
function compositeScore(id){
  // A multi-region market passes the path to that region's component weights.
  const comps = id ? at(id) : M.components;
  return Math.round(comps.reduce((a, c) => a + c.w * c.s, 0) / 100);
}
// live (editable) copies of the scorecards
function liveFactors(id){
  const src = at(id);
  if (!state.scores[id]) state.scores[id] = src.map(f => f.s);
  return src.map((f, i) => ({ n: f.n, w: f.w, s: state.scores[id][i] }));
}
function liveScore(id){ return weightedScore(liveFactors(id)); }
function durationAt(cy){
  const i = M.durationPath.years.indexOf(cy);
  return i >= 0 ? M.durationPath.hours[i] : M.durationPath.hours[M.durationPath.hours.length - 1];
}
function interp(curve, x){
  const ks = Object.keys(curve).map(Number).sort((a, b) => a - b);
  if (x <= ks[0]) return curve[ks[0]];
  if (x >= ks[ks.length - 1]) return curve[ks[ks.length - 1]];
  for (let i = 0; i < ks.length - 1; i++) if (x >= ks[i] && x <= ks[i + 1]){
    const f = (x - ks[i]) / (ks[i + 1] - ks[i]);
    return curve[ks[i]] * (1 - f) + curve[ks[i + 1]] * f;
  }
  return curve[ks[0]];
}
function stageProb(id){ const s = M.stages.find(x => x.id === id); return s ? s.p / 100 : 0; }
function dilutionAt(y){ return M.dilution && M.dilution[y] != null ? M.dilution[y] : 1; }
  return { at, weightedScore, compositeScore, liveFactors, liveScore, durationAt, interp, stageProb, dilutionAt };
}