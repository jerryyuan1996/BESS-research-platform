import { drawOverviewGrid } from '../_shared/overviewGrid.js';
/* ---------------------------------------------------------------------------
   PJM — dashboard.

   Four data modules plus this wiring. Every rendering decision lives in the
   shared block engine, which is why this file is the same length for every
   market in the lineage.
   --------------------------------------------------------------------------- */
import { createMarketEngine } from '../_shared/engine.js';
import { markets } from '../registry.js';

import { MKT } from './mkt.js';
import { TABS } from './tabs.js';
import { SRC } from './sources.js';
import { M } from './data.js';
import { buildSections } from './sections.js';
import './gridMapData.js';   // side effect: registers this market's grid map
import VIEW from '../../../view/markets/pjm.json' with { type: 'json' };
import { ENTRY_LEDGER } from './entryLedger.js';
import { registerCase } from '../caseRegistry.js';
import { CLAIMS } from './claims.js';
import { registerClaims } from '../claimRegistry.js';

/* Registered from the dashboard so the claim prose travels in this market's
   own lazy chunk rather than in the bundle every reader downloads. */
registerClaims('pjm', CLAIMS);

/* This market's whole view and ledger, for its Investment Case and Entry tabs.
   Registered here so the reasons, arguments and forfeiture terms travel in
   this market's own chunk; the home page carries a projection of them. */
registerCase('pjm', { view: VIEW, ledger: ENTRY_LEDGER });

const engine = createMarketEngine({
  MKT, TABS, SRC, M, buildSections,
});

export function researchSummary(container, route) {
  engine.researchSummary(container, route, markets);
}

/* Read the same cards as the research tabs, only when a chapter asks. */
export function researchExcerpt(route, picks) {
  return engine.researchExcerpt(route, markets, picks);
}

export const state = engine.state;

export function dashboard(container, route){
  engine.dashboard(container, route, markets);
}

export default dashboard;

export function renderOverviewGrid(container, route = {}) {
  drawOverviewGrid(container, 'pjm', route.region);
}
