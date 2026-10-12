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
import TOKYO_VIEW from '../../../view/markets/jp_tokyo.json' with { type: 'json' };
import KYUSHU_VIEW from '../../../view/markets/jp_kyushu.json' with { type: 'json' };
import HOKKAIDO_VIEW from '../../../view/markets/jp_hokkaido.json' with { type: 'json' };
import { TOKYO_ENTRY_LEDGER, KYUSHU_ENTRY_LEDGER, HOKKAIDO_ENTRY_LEDGER } from './entryLedger.js';
import { registerCase } from '../caseRegistry.js';

/* Three allocation points share this dashboard; each registers its own whole
   view and ledger, which travel in this one chunk. */
registerCase('jp_tokyo', { view: TOKYO_VIEW, ledger: TOKYO_ENTRY_LEDGER });
registerCase('jp_kyushu', { view: KYUSHU_VIEW, ledger: KYUSHU_ENTRY_LEDGER });
registerCase('jp_hokkaido', { view: HOKKAIDO_VIEW, ledger: HOKKAIDO_ENTRY_LEDGER });

const engine = createMarketEngine({
  MKT, TABS, SRC, M, buildSections, regions: REGIONS,
});

export const state = engine.state;

export function dashboard(container, route){
  /* Bind the default namespace before rendering. The engine-owned scorecard and
     export blocks address M.connFactors / M.durFactors by name;
     those are getters onto whichever region this resolves to. In compare mode
     every comparison block addresses regions explicitly, so Tokyo is only a
     fallback for the JSON export. */
  const r = route.region;
  activeRegion.id = (r && r !== 'compare') ? r : 'tokyo';

  engine.dashboard(container, route, markets);
}

export default dashboard;
