/* ---------------------------------------------------------------------------
   Grid maps, with each market's congestion register attached.

   The two are declared separately — a map is geography, a register is economics
   — and joined here so that every consumer of a map gets the constraint layer
   without knowing the join exists. A market that gains a congestion register
   therefore gains the map layer, the grid-tab table and the home-page comparison
   in one edit, which is the same rule the market registry follows.

   WHY THIS REGISTERS RATHER THAN IMPORTS. It used to statically import all
   twelve gridMapData modules and build the array at module load. That is about
   460 KB of coordinates, and because the shared block engine imports this file,
   every one of those maps reached every visitor — including someone who opened
   the home page and left.

   No home-page component reads a grid map. The only consumers are market
   `sections.js` files, and each asks for its own market's map and no other. So
   the maps belong in the market chunks, and this file is now a place they
   register themselves as those chunks load — the same shape `projects/registry.js`
   already uses for project datasets, for the same reason.

   REGISTRATION HAPPENS AT MODULE LOAD of each market's gridMapData.js, and the
   market's dashboard.js imports that module for the side effect. So the rule is:
   a map is available once its market's dashboard chunk has loaded, which is
   exactly when something is in a position to ask for it.

   ABSENCE IS A REAL ANSWER. `gridMapById` returns null for a market whose chunk
   has not loaded, exactly as it always did for a market with no map at all.
   Callers already handle null because Romania had no map for a while.
   --------------------------------------------------------------------------- */
import { congestionFor } from './congestionRegistry.js';

/* id → joined map. Insertion order is registration order, which is load order
   rather than the fixed display order the old array carried. Nothing renders
   this collection as a list — the two consumers look maps up by id — so the
   ordering is not load-bearing. tests/grid-maps.test.js sorts before comparing
   for exactly that reason. */
const REGISTRY = new Map();

/** A map plus the constraint zones of the allocation market it belongs to. */
const join = (map, marketId) => ({
  ...map,
  marketId,
  constraints: congestionFor(marketId)?.zones || [],
});

/**
 * Register one market's grid map.
 *
 * Called at module load from the market's own gridMapData.js. Idempotent: a
 * second registration of the same id replaces the first rather than duplicating
 * it, so a module evaluated twice (dev HMR, a test importing both the market and
 * the aggregator) is harmless.
 *
 * @param {object} map       the raw map, carrying its own `id`
 * @param {string} marketId  the ALLOCATION market it belongs to. Japan registers
 *                           three maps against three different market ids from
 *                           one module, which is why this is a parameter rather
 *                           than something read off the map.
 */
export function registerGridMap(map, marketId){
  if (!map || !map.id || !marketId) return;
  REGISTRY.set(map.id, join(map, marketId));
}

/** Every registered map. A function, not a const — the set grows as chunks load. */
export const allGridMaps = () => [...REGISTRY.values()];

export function gridMapById(id){
  return REGISTRY.get(id) || null;
}

export function gridMapForMarket(marketId, region){
  /* Japan's three areas share one dashboard and one gridMapData module, so the
     region selects among three registered maps rather than naming a market. An
     unknown region falls back to Tokyo, which is the lens the dashboard opens
     in by default. */
  if (marketId === 'jp'){
    const area = ['tokyo', 'kyushu', 'hokkaido'].includes(region) ? region : 'tokyo';
    return REGISTRY.get(`jp-${area}-grid-map`) || null;
  }
  return REGISTRY.get(`${marketId}-grid-map`) || null;
}

/** Test seam. Never called by the application. */
export function __resetGridMaps(){
  REGISTRY.clear();
}
