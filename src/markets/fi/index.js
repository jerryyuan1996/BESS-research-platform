/* Finland market module.

   Comparison interface, source register and a dashboard loaded on demand.

   `engineReady: false` in comparison.js keeps Finland out of the league table,
   the $1M engine and the certainty frontier until its revenue line is
   evidenced. It still appears on the cards and in the nav, because "we are
   researching this market and here is what we have" is a statement worth
   publishing — and the source register is the substance of it. */
import { manifest } from './manifest.js';
import { comparison } from './comparison.js';
import { sources } from './sources.js';
import { tabs } from './tabs.js';

/* Loaded on demand, like every other market. See src/markets/ro/index.js. */
export const loadDashboard = () => import('./dashboard.js').then(m => m.dashboard);

export default { manifest, comparison, sources, tabs, loadDashboard };
