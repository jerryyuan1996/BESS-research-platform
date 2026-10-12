/* ---------------------------------------------------------------------------
   What the home page asks of the view store and the ledgers.

   The same questions viewRegistry.js and ledgerRegistry.js answer, answered
   from the board projection: grades as numbers, calls, amounts. A page that
   needs a reason, an argument or a forfeiture term is a market's own page and
   reads markets/caseRegistry.js.
   --------------------------------------------------------------------------- */
import { BOARD } from './viewBoardData.js';

/** The projected view of a graded market, or null. */
export const boardViewFor = (marketId) => BOARD.views[marketId] || null;

/** The projected ledger of a market, or null when it has none. */
export const boardLedgerFor = (marketId) => BOARD.ledgers[marketId] || null;

/** Market ids that have been graded. */
export const boardMarketIds = () => Object.keys(BOARD.views);

/** Every trigger in the view store, from every market file, graded or not. */
export const boardTriggers = () => BOARD.triggers;
