/* ---------------------------------------------------------------------------
   Great Britain — dashboard.

   The whole dashboard is four data modules plus this wiring. Every rendering
   decision lives in the shared block engine, which is why this file is the same
   length for all four markets in the lineage.
   --------------------------------------------------------------------------- */
import { createMarketEngine } from '../_shared/engine.js';
import { markets } from '../registry.js';

import { MKT } from './mkt.js';
import { TABS } from './tabs.js';
import { SRC } from './sources.js';
import { M } from './data.js';
import { buildSections, loadSections } from './sections.js';
import './gridMapData.js';   // side effect: registers this market's grid map
import VIEW from '../../../view/markets/gb.json' with { type: 'json' };
import { ENTRY_LEDGER } from './entryLedger.js';
import { registerCase } from '../caseRegistry.js';
import { textOverrides } from './text.js';

/* This market's whole view and ledger, for its Investment Case and Entry tabs.
   Registered here so the reasons, arguments and forfeiture terms travel in
   this market's own chunk; the home page carries a projection of them. */
registerCase('gb', { view: VIEW, ledger: ENTRY_LEDGER });

const engine = createMarketEngine({
  MKT, TABS, SRC, M, buildSections,
  textOverrides,
  prepareSections: (api, ids) => loadSections(api, ids),
});

/* The house view and the one-minute orientation are sections now, so they
   must be fetched before the summary reads them. A failure leaves the summary
   short rather than breaking the dialog. */
export async function researchSummary(container, route) {
  await loadSections(engine.api, ['home', 'story']).catch(() => {});
  engine.researchSummary(container, route, markets);
}

export const state = engine.state;

export function dashboard(container, route){
  return engine.dashboard(container, route, markets);
}

export default dashboard;
