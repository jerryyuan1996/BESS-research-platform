import { drawOverviewGrid } from '../_shared/overviewGrid.js';
/* ---------------------------------------------------------------------------
   Saudi Arabia — dashboard. Wiring only; the shared block engine draws everything.

   Saudi Arabia is registered, engine-withheld and not yet graded, so it registers no case: an
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
  drawOverviewGrid(container, 'sa', route.region);
}
