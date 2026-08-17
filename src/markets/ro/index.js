/* Romania market module.

   Comparison interface eagerly; dashboard on demand.

   WHAT IS EAGER AND WHY. The home page needs `manifest` and `comparison` for
   every market at once — the cards, the league table, the $1M engine and the
   certainty frontier all iterate the whole registry. Neither pulls in a data
   module: `comparison.js` imports only shared helpers from src/comparison/.
   Together they are a few kilobytes.

   `dashboard.js` is the other 200 KB — sections, data and the grid map — and
   nothing outside /markets/romania can reach it. So it loads when someone asks
   for it, and not before.

   `tabs` and `sources` stay eager deliberately. They are under 8 KB together,
   the registry validation reads `tabs`, and they are imported by the dashboard
   anyway — so making them lazy would buy almost nothing and cost the validation
   a surface it currently checks at startup.

   See docs/architecture.md and src/markets/registry.js. */
import { manifest } from './manifest.js';
import { comparison } from './comparison.js';
import { sources } from './sources.js';
import { tabs } from './tabs.js';

/**
 * Resolves to this market's dashboard renderer.
 *
 * Deliberately NOT named `dashboard` and deliberately not a getter: a property
 * that returns a promise while looking like the synchronous function it replaced
 * is the kind of thing that reads fine and fails at the call site. The async
 * boundary is in the name. See marketPage.js for the loading, failure and
 * stale-navigation handling this implies.
 */
export const loadDashboard = () => import('./dashboard.js').then(m => m.dashboard);

export default { manifest, comparison, sources, tabs, loadDashboard };
