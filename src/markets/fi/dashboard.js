/* ---------------------------------------------------------------------------
   Finland — dashboard.

   Wiring only. Every rendering decision lives in the shared block engine, which
   is why this file is the same length here as it is for the other markets in the
   lineage — including the one whose largest revenue line is deliberately blank.
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

export const state = engine.state;

export function dashboard(container, route){
  engine.dashboard(container, route, markets);
}

export default dashboard;
