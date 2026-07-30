import { WA_GRID_MAP } from './wa/gridMapData.js';
import { GB_GRID_MAP } from './gb/gridMapData.js';
import { IE_GRID_MAP } from './ie/gridMapData.js';
import { RO_GRID_MAP } from './ro/gridMapData.js';
import { PL_GRID_MAP } from './pl/gridMapData.js';
import { JP_GRID_MAPS } from './jp/gridMapData.js';

export const GRID_MAPS = [
  WA_GRID_MAP,
  GB_GRID_MAP,
  IE_GRID_MAP,
  RO_GRID_MAP,
  PL_GRID_MAP,
  JP_GRID_MAPS.tokyo,
  JP_GRID_MAPS.kyushu,
  JP_GRID_MAPS.hokkaido,
];

const byId = new Map(GRID_MAPS.map(map => [map.id, map]));

export function gridMapById(id){
  return byId.get(id) || null;
}

export function gridMapForMarket(marketId, region){
  if (marketId === 'jp') return JP_GRID_MAPS[region] || JP_GRID_MAPS.tokyo;
  return byId.get(`${marketId}-grid-map`) || null;
}
