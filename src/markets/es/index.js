/* Spain market module. Comparison interface, source register and a dashboard
   loaded on demand. Registered 2026-10-29 on the analyst's sign-off. */
import { manifest } from './manifest.js';
import { comparison } from './comparison.js';
import { sources } from './sources.js';
import { tabs } from './tabs.js';

export const loadDashboard = () => import('./dashboard.js').then(m => m.dashboard);

export default { manifest, comparison, sources, tabs, loadDashboard };
