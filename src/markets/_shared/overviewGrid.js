import { gridMapForMarket } from '../gridMapRegistry.js';
import { renderGeographicGridMap } from '../../components/geographicGridMap.js';

/** Map data remains in its market payload; rendered ids never collide with research. */
export function drawOverviewGrid(container, owner, region) {
  const map = gridMapForMarket(owner, region);
  if (!map) throw new Error('Grid map unavailable');
  renderGeographicGridMap(container, { ...map, id: map.id + '-overview' });
}
