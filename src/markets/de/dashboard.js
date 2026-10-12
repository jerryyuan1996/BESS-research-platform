/* ---------------------------------------------------------------------------
   Germany — dashboard.

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
import VIEW from '../../../view/markets/de.json' with { type: 'json' };
import { ENTRY_LEDGER } from './entryLedger.js';
import { registerCase } from '../caseRegistry.js';

/* This market's whole view and ledger, for its Investment Case and Entry tabs.
   Registered here so the reasons, arguments and forfeiture terms travel in
   this market's own chunk; the home page carries a projection of them. */
registerCase('de', { view: VIEW, ledger: ENTRY_LEDGER });

const engine = createMarketEngine({
  MKT, TABS, SRC, M, buildSections,
});

export const state = engine.state;

export function dashboard(container, route){
  engine.dashboard(container, route, markets);
}

export default dashboard;
