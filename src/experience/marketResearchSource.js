import { byId } from '../markets/registry.js';
import { REVENUE_SECTIONS } from '../markets/tabGroups.js';

const loaders = import.meta.glob(['../markets/*/dashboard.js', '!../markets/_template/**']);

/** Fetch only this allocation market's public research and bind its regional lens. */
export async function loadMarketResearch(id) {
  const market = byId(id);
  if (!market) throw new Error('Unknown market');
  const owner = market.manifest.dashboardId || id;
  const module = await (owner === 'wa' ? import('../markets/wa/researchExcerpt.js') : loaders['../markets/' + owner + '/dashboard.js']());
  return { market, module, route: { basePath: '/markets/' + market.manifest.slug, region: market.manifest.region },
    sections: kind => market.tabs.map(([section]) => section).filter(section => kind === 'grid'
      ? ['grid', 'entry'].includes(section) : REVENUE_SECTIONS.includes(section)) };
}
