/* Ireland — SEM (all-island) market module.

   Comparison interface + full dashboard. The dashboard is built on the shared
   block engine in src/markets/_shared/, which this market shares with the three
   others in its lineage — see docs/architecture.md. */
import { manifest } from './manifest.js';
import { comparison } from './comparison.js';
import { sources } from './sources.js';
import { tabs } from './tabs.js';
import { dashboard } from './dashboard.js';

export default { manifest, comparison, sources, tabs, dashboard };