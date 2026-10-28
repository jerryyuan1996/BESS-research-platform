/* ---------------------------------------------------------------------------
   Finland — dashboard.

   Wiring only. Every rendering decision lives in the shared block engine, which
   is why this file is the same length here as it is for the other markets in the
   lineage.
   --------------------------------------------------------------------------- */
import { createMarketEngine } from '../_shared/engine.js';
import { markets } from '../registry.js';

import { MKT } from './mkt.js';
import { TABS } from './tabs.js';
import { SRC } from './sources.js';
import { M } from './data.js';
import { buildSections } from './sections.js';
import './gridMapData.js';   // side effect: registers this market's grid map
import VIEW from '../../../view/markets/fi.json' with { type: 'json' };
import { ENTRY_LEDGER } from './entryLedger.js';
import { registerCase } from '../caseRegistry.js';
import { CLAIMS } from './claims.js';
import { registerClaims } from '../claimRegistry.js';

/* Registered from the dashboard so the claim prose travels in this market's
   own lazy chunk rather than in the bundle every reader downloads.

   Seven of the eight dispositions here publish nothing. They register anyway,
   because the renderer gates on readiness and the record of WHY a section does
   not argue is worth keeping next to the one that does — the same shape WA
   uses for its five incomplete sections. */
registerClaims('fi', CLAIMS);

/* This market's whole view and ledger, for its Investment Case and Entry tabs.
   Registered here so the reasons, arguments and forfeiture terms travel in
   this market's own chunk; the home page carries a projection of them. */
registerCase('fi', { view: VIEW, ledger: ENTRY_LEDGER });

const engine = createMarketEngine({
  MKT, TABS, SRC, M, buildSections,
});

export function researchSummary(container, route) {
  engine.researchSummary(container, route, markets);
}

export const state = engine.state;

export function dashboard(container, route){
  engine.dashboard(container, route, markets);
}

export default dashboard;
