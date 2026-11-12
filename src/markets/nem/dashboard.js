/* ---------------------------------------------------------------------------
   National Electricity Market — dashboard.

   Four data modules plus this wiring. Every rendering decision lives in the
   shared block engine, which is why this file is the same length for every
   market in the lineage.

   The one thing this market does that the others do not: its sections are
   fetched per tab rather than shipped with the dashboard. `prepareSections` is
   the whole of that difference — the engine asks for the ids it is about to
   draw, this market's loader fetches them, and the engine draws afterwards. See
   src/markets/nem/sections/registry.js and docs/p1-sections-pilot.md.

   The grid map is no longer imported here. It registers itself from the two
   sections that draw it — the overview, where the page pairs the map with the
   house view, and the grid tab — so the landing tab does not carry 20 kB of
   coordinates it has no use for.
   --------------------------------------------------------------------------- */
import { createMarketEngine } from '../_shared/engine.js';
import { markets } from '../registry.js';

import { MKT } from './mkt.js';
import { TABS } from './tabs.js';
import { SRC } from './sources.js';
import { M } from './data.js';
import { buildSections, loadSections } from './sections.js';
import VIEW from '../../../view/markets/nem.json' with { type: 'json' };
import { ENTRY_LEDGER } from './entryLedger.js';
import { registerCase } from '../caseRegistry.js';

/* This market's whole view and ledger, for its Investment Case and Entry tabs.
   Registered here so the reasons, arguments and forfeiture terms travel in
   this market's own chunk; the home page carries a projection of them. */
registerCase('nem', { view: VIEW, ledger: ENTRY_LEDGER });

const engine = createMarketEngine({
  MKT, TABS, SRC, M, buildSections,
  prepareSections: (api, ids) => loadSections(api, ids),
});

/* The market page's summary — the house view and the one-minute orientation,
   lifted out of the research itself. Its two sources are sections now, so it
   fetches them first: the house view is in `home`, the orientation in `story`.
   A failure leaves the summary short rather than breaking the dialog; the
   engine falls back to the market's own rationale for the house view. */
export async function researchSummary(container, route) {
  await loadSections(engine.api, ['home', 'story']).catch(() => {});
  engine.researchSummary(container, route, markets);
}

/* Research in context: the cards a chapter of the market page asks for, lifted
   out of the research itself (see researchExcerpt in _shared/engine.js). Only
   the sections picked are fetched; a chunk that fails rejects, and the caller
   offers a retry. */
export async function researchExcerpt(route, picks) {
  await loadSections(engine.api, picks.map(pick => pick.section));
  return engine.researchExcerpt(route, markets, picks);
}

export const state = engine.state;

export function dashboard(container, route){
  return engine.dashboard(container, route, markets);
}

export default dashboard;
