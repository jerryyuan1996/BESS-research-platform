/* Finland market module.

   Comparison interface, source register and a dashboard loaded on demand.

   Engine-ready since 2026-10-17, when the reserve line was set at the 2026
   annual clearing spread across the fleet (comparison.js, gate FI-1). */
import { manifest } from './manifest.js';
import { comparison } from './comparison.js';
import { sources } from './sources.js';
import { tabs } from './tabs.js';

/* Loaded on demand, like every other market. See src/markets/ro/index.js. */
export const loadDashboard = () => import('./dashboard.js').then(m => m.dashboard);

export default { manifest, comparison, sources, tabs, loadDashboard };
