/* ---------------------------------------------------------------------------
   TEMPLATE — market module entry point.

   This is the whole public surface of a market. The application sees only these
   five keys; everything else in this directory is private to the market.

     manifest    required — identity + metadata
     comparison  required for home-page participation
     sources     optional — source register
     tabs        optional — tab strip definition
     dashboard   optional — renderer; without it the route shows "pending migration"

   To register: add two lines to src/markets/registry.js. That is the only file
   outside this directory that changes.
   --------------------------------------------------------------------------- */
import { manifest } from './manifest.js';
import { comparison } from './comparison.js';
import { sources } from './sources.js';
import { tabs } from './tabs.js';
import { dashboard } from './dashboard.js';

export default { manifest, comparison, sources, tabs, dashboard };
