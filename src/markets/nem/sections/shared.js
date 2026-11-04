/* ---------------------------------------------------------------------------
   What every National Electricity Market section reads before it says anything.

   Five constants that used to sit at the top of one 1,173-line file: the
   official register, the peer benchmark, the A$k/MW index formatter and two
   region helpers. They moved here when that file was split by section.

   BUILT FROM `api`, NOT IMPORTED. `O` is `M.official` and `M` is the market
   dataset, which the engine already holds and hands to every section. Importing
   src/markets/nem/data.js from here instead would make every section chunk
   depend on the dataset, and Rollup would then either duplicate it into each
   one or hoist it into a shared chunk that the landing tab also pays for. The
   dataset is 22 kB gzipped and it is already in the market chunk.
   --------------------------------------------------------------------------- */

/**
 * @param {object} api  supplied by src/markets/_shared/engine.js
 * @returns {{O:object, P:object, kMW:Function, regionById:Function, regionalMWhTotal:number}}
 */
export function createShared(api){
  const { M, fmtC } = api;

  const O = M.official;
  const P = M.peer;
  /* The revenue index is published in A$ thousands per MW per year and is
     carried in the dataset in the same unit, so it gets its own formatter
     rather than being multiplied up and back down at every call site. */
  const kMW = v => fmtC(v) + 'k';
  const regionById = id => M.regions.find(r => r.id === id);
  const regionalMWhTotal = M.regions.reduce((a, r) => a + r.mwh, 0);

  return { O, P, kMW, regionById, regionalMWhTotal };
}
