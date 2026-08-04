/* PJM Interconnection market module.

   Comparison interface + full dashboard on the shared block engine
   (src/markets/_shared/), the same lineage as GB, IE, RO, PL, DE, IT and the
   NEM. */
import { manifest } from './manifest.js';
import { comparison } from './comparison.js';
import { sources } from './sources.js';
import { tabs } from './tabs.js';
import { dashboard } from './dashboard.js';

export default { manifest, comparison, sources, tabs, dashboard };
