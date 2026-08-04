/* ---------------------------------------------------------------------------
   Grid maps, with each market's congestion register attached.

   The two are declared separately — a map is geography, a register is economics
   — and joined here so that every consumer of a map gets the constraint layer
   without knowing the join exists. A market that gains a congestion register
   therefore gains the map layer, the grid-tab table and the home-page comparison
   in one edit, which is the same rule the market registry follows.
   --------------------------------------------------------------------------- */
import { WA_GRID_MAP } from './wa/gridMapData.js';
import { GB_GRID_MAP } from './gb/gridMapData.js';
import { IE_GRID_MAP } from './ie/gridMapData.js';
import { RO_GRID_MAP } from './ro/gridMapData.js';
import { PL_GRID_MAP } from './pl/gridMapData.js';
import { JP_GRID_MAPS } from './jp/gridMapData.js';
import { NEM_GRID_MAP } from './nem/gridMapData.js';
import { DE_GRID_MAP } from './de/gridMapData.js';
import { IT_GRID_MAP } from './it/gridMapData.js';
import { PJM_GRID_MAP } from './pjm/gridMapData.js';
import { ERCOT_GRID_MAP } from './ercot/gridMapData.js';
import { CAISO_GRID_MAP } from './caiso/gridMapData.js';
import { congestionFor } from './congestionRegistry.js';

/** A map plus the constraint zones of the allocation market it belongs to. */
const join = (map, marketId) => ({
  ...map,
  marketId,
  constraints: congestionFor(marketId)?.zones || [],
});

export const GRID_MAPS = [
  join(WA_GRID_MAP, 'wa'),
  join(NEM_GRID_MAP, 'nem'),
  join(GB_GRID_MAP, 'gb'),
  join(DE_GRID_MAP, 'de'),
  join(IT_GRID_MAP, 'it'),
  join(IE_GRID_MAP, 'ie'),
  join(RO_GRID_MAP, 'ro'),
  join(PL_GRID_MAP, 'pl'),
  join(JP_GRID_MAPS.tokyo, 'jp_tokyo'),
  join(JP_GRID_MAPS.kyushu, 'jp_kyushu'),
  join(JP_GRID_MAPS.hokkaido, 'jp_hokkaido'),
  join(PJM_GRID_MAP, 'pjm'),
  join(ERCOT_GRID_MAP, 'ercot'),
  join(CAISO_GRID_MAP, 'caiso'),
];

const byId = new Map(GRID_MAPS.map(map => [map.id, map]));

export function gridMapById(id){
  return byId.get(id) || null;
}

export function gridMapForMarket(marketId, region){
  if (marketId === 'jp'){
    const area = JP_GRID_MAPS[region] ? region : 'tokyo';
    return byId.get(JP_GRID_MAPS[area].id) || null;
  }
  return byId.get(`${marketId}-grid-map`) || null;
}
