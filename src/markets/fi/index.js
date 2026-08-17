/* Finland market module.

   Comparison interface and source register only — no dashboard yet, which is a
   supported state: /markets/finland renders the documented pending page and
   every other surface works. See docs/adding-a-market.md.

   `engineReady: false` in comparison.js keeps Finland out of the league table,
   the $1M engine and the certainty frontier until its revenue line is
   evidenced. It still appears on the cards and in the nav, because "we are
   researching this market and here is what we have" is a statement worth
   publishing — and the source register is the substance of it. */
import { manifest } from './manifest.js';
import { comparison } from './comparison.js';
import { sources } from './sources.js';
import { tabs } from './tabs.js';

export default { manifest, comparison, sources, tabs };
