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
import { buildSections, loadSections } from './sections.js';
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
  prepareSections: (api, ids) => loadSections(api, ids),
});

/* The house view and the one-minute orientation are sections now, so they
   must be fetched before the summary reads them. A failure leaves the summary
   short rather than breaking the dialog. */
export async function researchSummary(container, route) {
  await loadSections(engine.api, ['home', 'story']).catch(() => {});
  if (!container.isConnected) return;
  activeRegion.id = REGIONS.some(([id]) => id === route.region) ? route.region : 'tokyo';
  engine.researchSummary(container, route, markets);
}

/* Research in context: the cards a chapter of the market page asks for, lifted
   out of the research itself (see researchExcerpt in _shared/engine.js). The
   market page always names one area, so each of Tokyo, Kyushu and Hokkaido
   shows its own regional cards; the default namespace is bound first, as
   dashboard() binds it, because the scorecard reads the area through it. */
export async function researchExcerpt(route, picks, { isCurrent = () => true } = {}) {
  await loadSections(engine.api, picks.map(pick => pick.section));
  /* A removed chapter must not rebind the shared Japanese lens after a newer
     page has rendered. Check before either regional state or engine binding. */
  if (!isCurrent()) return [];
  activeRegion.id = REGIONS.some(([id]) => id === route.region) ? route.region : 'tokyo';
  return engine.researchExcerpt(route, markets, picks);
}

export const state = engine.state;

export function dashboard(container, route){
  /* Bind the default namespace before rendering. The engine-owned scorecard and
     export blocks address M.durFactors by name;
     those are getters onto whichever region this resolves to. In compare mode
     every comparison block addresses regions explicitly, so Tokyo is only a
     fallback for the JSON export. */
  const r = route.region;
  activeRegion.id = (r && r !== 'compare') ? r : 'tokyo';

  return engine.dashboard(container, route, markets);
}

export default dashboard;
