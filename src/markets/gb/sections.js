/* ---------------------------------------------------------------------------
   Great Britain — the section contract the engine reads.

   The content lives in src/markets/gb/sections/, one module per domain.
   This file is what the shared engine sees, and it is deliberately small.

   IT IS STILL SYNCHRONOUS. `buildSections(api)` returns `SECTIONS()`, whose
   entries are getters that re-evaluate the spec, so every string re-evaluates
   when the language changes. What changed is the set of entries: the map holds
   only the sections loaded for the route being drawn.

   THE ASYNC HALF IS ELSEWHERE. `loadSections(api, ids)` fetches a section, and
   the engine calls it through `prepareSections` — the async boundary in
   markets/_shared/engine.js. A synchronous caller (a test, the Investment
   Case's research summary) still gets an object it can read.

   See docs/p1-sections-rollout.md for the contract and the measurements.
   --------------------------------------------------------------------------- */
import {
  SECTION_IDS, loadSections, loadAllSections, isLoaded, sectionSpec,
} from './sections/registry.js';

/**
 * @param {object} _api  accepted for the shared engine's signature and not
 *   used here: each section module is handed the api by `loadSections`.
 * @returns {() => object} SECTIONS(), the map the engine draws from
 */
export function buildSections(_api){
  return function SECTIONS(){
    const o = {};
    for (const id of SECTION_IDS){
      if (!isLoaded(id)) continue;
      Object.defineProperty(o, id, { get: () => sectionSpec(id), enumerable: true });
    }
    return o;
  };
}

export { SECTION_IDS, loadSections, loadAllSections };
