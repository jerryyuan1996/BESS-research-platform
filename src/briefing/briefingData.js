/* ---------------------------------------------------------------------------
   The briefing, as data. WHAT PLAIN NODE SEES.

   On the dev server and in a build this module is replaced by
   vite-plugin-briefing.js with the briefing written out as a literal, so the
   engine, the registry and the file reads below never reach a page: a page
   receives the result and nothing that computed it.

   Here, for scripts and tests, the briefing is built from the real files
   through the same function the plugin calls (briefing/disk.js), on the clock
   of the moment it is imported.
   --------------------------------------------------------------------------- */
import { briefingFromDisk } from './disk.js';

export const BRIEFING = await briefingFromDisk();
