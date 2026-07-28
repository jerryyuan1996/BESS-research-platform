/* ---------------------------------------------------------------------------
   Romania — dashboard.

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
import { buildSections } from './sections.js';

const engine = createMarketEngine({
  MKT, TABS, SRC, M, buildSections,
});

export const state = engine.state;

export function dashboard(container, route){
  engine.dashboard(container, route, markets);
}

export default dashboard;