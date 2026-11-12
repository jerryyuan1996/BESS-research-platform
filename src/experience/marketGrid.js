import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { loadMarketResearch } from './marketResearchSource.js';

/** Same geography, periods, selection and sources as the original research map. */
export async function mountMarketGrid(host, marketId) {
  const { module, route } = await loadMarketResearch(marketId);
  if (!host.isConnected) return;
  host.replaceChildren();
  await module.renderOverviewGrid(host, route);
  if (!host.isConnected) return;
  const root = host.querySelector('.geo-grid-map');
  if (!root) throw new Error('Grid map unavailable');
  const options = h('details', { class: 'market-map-options' },
    h('summary', {}, L(['Map layers & reading notes', '图层与地图说明'])),
    h('div', { class: 'market-map-options-body' }, root.querySelector('.geo-layer-group'),
      root.querySelector('.geo-detail-toggle-host'), root.querySelector('.geo-map-context'),
      root.querySelector('.geo-map-scope')));
  root.append(options);
}
