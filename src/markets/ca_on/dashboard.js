/* ---------------------------------------------------------------------------
   Ontario — dashboard. Wiring only; the shared block engine draws everything.

   Ontario is registered but not yet graded, so it registers no case: an
   ungraded market carries no Investment Case or Entry section. Its
   capital-at-risk ledger is written (entryLedger.js) and waits for grading.
   --------------------------------------------------------------------------- */
import { createMarketEngine } from '../_shared/engine.js';
import { markets } from '../registry.js';

import { MKT } from './mkt.js';
import { TABS } from './tabs.js';
import { SRC } from './sources.js';
import { M } from './data.js';
import { buildSections } from './sections.js';
import './gridMapData.js';   // side effect: registers this market's grid map

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
