/* Western Australia (WEM) — the reference market module.

   This is the market that proves the module architecture: it exposes the full
   five-key surface, and every piece of shared UI, chart and formatting code it
   uses is imported from src/ rather than duplicated here. */
import { manifest } from './manifest.js';
import { comparison } from './comparison.js';
import { sources } from './sources.js';
import { tabs } from './tabs.js';
import { dashboard } from './dashboard.js';

export default { manifest, comparison, sources, tabs, dashboard };
