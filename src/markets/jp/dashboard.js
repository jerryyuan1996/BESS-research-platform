/* ---------------------------------------------------------------------------
   Japan — dashboard.

   ONE dashboard, three regional lenses. Tokyo, Kyushu and Hokkaido are three
   allocation markets in the registry and three entry points into this file; the
   national rulebook is rendered once regardless of which one you arrive from.

   The regional entry state comes from the route:
     /markets/japan-tokyo                  → Tokyo lens
     /markets/japan-kyushu/energy          → Kyushu lens, JEPX tab
     /markets/japan-tokyo?region=compare   → all three side by side
   --------------------------------------------------------------------------- */
import { createMarketEngine } from '../_shared/engine.js';
import { markets } from '../registry.js';

import { MKT } from './mkt.js';
import { TABS, REGIONS } from './tabs.js';
import { SRC } from './sources.js';
import { M, activeRegion } from './data.js';
import { buildSections } from './sections.js';
import './gridMapData.js';   // side effect: registers this market's grid map

const engine = createMarketEngine({
  MKT, TABS, SRC, M, buildSections, regions: REGIONS,
});

export const state = engine.state;

export function dashboard(container, route){
  /* Bind the default namespace before rendering. The engine-owned scorecard and
     export blocks address M.components / M.connFactors / M.durFactors by name;
     those are getters onto whichever region this resolves to. In compare mode
     every comparison block addresses regions explicitly, so Tokyo is only a
     fallback for the JSON export. */
  const r = route.region;
  activeRegion.id = (r && r !== 'compare') ? r : 'tokyo';

  engine.dashboard(container, route, markets);
}

export default dashboard;
