/* ---------------------------------------------------------------------------
   The home page's briefing, as data. WHAT PLAIN NODE SEES.

   Replaced on the dev server and in a build by vite-plugin-briefing.js with
   homeProjection(briefing) written out as a literal: the whole briefing less
   the analyst queue's words, which /desk fetches on its own. Here, for scripts
   and tests, it is worked out through the same two functions.
   --------------------------------------------------------------------------- */
import { briefingFromDisk } from './disk.js';
import { homeProjection } from './model.js';

export const HOME_BRIEFING = homeProjection(await briefingFromDisk());
