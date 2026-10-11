/* ---------------------------------------------------------------------------
   The board projection, as data. WHAT PLAIN NODE SEES.

   On the dev server and in a build this module is replaced by
   vite-plugin-view-board.js with the same object written out as a literal, so
   the two imports below never reach a page: the whole views and the whole
   ledgers stay out of the home page's chunks. See markets/boardProjection.js
   for what is kept and why.

   Here, for the test suite, the projection is worked out from the real files
   through the same function the plugin calls. tests/verdict-board.test.js
   asserts the plugin's output is this object.

   NOTHING ELSE IN src/ MAY IMPORT viewRegistry.js OR ledgerRegistry.js. Those
   two hold every market whole, and an import from a page module would put all
   of it back in that page's chunk. The same test asserts it.
   --------------------------------------------------------------------------- */
import { viewFiles } from './viewRegistry.js';
import { allLedgers } from '../entry/ledgerRegistry.js';
import { boardData } from './boardProjection.js';

export const BOARD = boardData(viewFiles(), allLedgers());
