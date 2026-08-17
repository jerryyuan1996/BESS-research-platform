/* Poland market module.

   Comparison interface + full dashboard. The dashboard is built on the shared
   block engine in src/markets/_shared/, which this market shares with the three
   others in its lineage — see docs/architecture.md. */
import { manifest } from './manifest.js';
import { comparison } from './comparison.js';
import { sources } from './sources.js';
import { tabs } from './tabs.js';

/* Loaded on demand. The home page needs every market's manifest and comparison
   interface at once; nothing outside this market's own route needs its sections,
   data or grid map. See src/markets/ro/index.js for the full reasoning and
   marketPage.js for the loading, failure and stale-navigation handling. */
export const loadDashboard = () => import('./dashboard.js').then(m => m.dashboard);

export default { manifest, comparison, sources, tabs, loadDashboard };