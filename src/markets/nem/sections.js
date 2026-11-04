/* ---------------------------------------------------------------------------
   National Electricity Market — the section contract the engine reads.

   The content lives in src/markets/nem/sections/, one module per domain:
   overview, story, capacity, energy, services, duration, pipeline, grid,
   benchmark, portfolio, methodology, case, entry. This file is what the shared
   engine sees, and it is deliberately small.

   IT IS STILL SYNCHRONOUS. `buildSections(api)` returns `SECTIONS()`, and every
   entry in the map is a getter that re-evaluates the spec, so every string
   re-evaluates when the language changes. What changed is the set of entries:
   the map holds the sections that have been loaded for the route being drawn,
   not all thirteen. The engine asks the loader for the ids it is about to draw
   and only then reads the map; a section the route does not draw is absent
   rather than a lie.

   THE ASYNC HALF IS ELSEWHERE. `loadSections(api, ids)` is what fetches a
   section module, and the engine calls it through the `prepareSections` hook —
   see the async boundary in markets/_shared/engine.js. Nothing in this file is
   asynchronous, which is why a synchronous caller (a test, the Investment
   Case's research summary) still gets an object it can read.

   WHY THE MARKET NEEDED THIS AT ALL: the single file this replaces was 199 kB
   of source and 73 kB of gzipped JavaScript, all of it downloaded and evaluated
   before the brief — one section of thirteen — could be read. See
   docs/p1-sections-pilot.md for the measurements and for whether the pattern
   is worth carrying to the other large markets.

   There is no `lab` tab and no `debt` tab: the Investment Lab and project debt
   live on the home page, and the duration comparison that used to sit inside
   the lab is on the duration tab instead.
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
