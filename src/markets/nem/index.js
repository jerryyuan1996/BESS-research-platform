/* National Electricity Market market module.

   Comparison interface + full dashboard on the shared block engine
   (src/markets/_shared/), the same lineage as GB, IE, RO and PL. */
import { manifest } from './manifest.js';
import { comparison } from './comparison.js';
import { sources } from './sources.js';
import { tabs } from './tabs.js';
import { dashboard } from './dashboard.js';

export default { manifest, comparison, sources, tabs, dashboard };
