/* ---------------------------------------------------------------------------
   A MARKET'S WHOLE VIEW AND LEDGER, REGISTERED BY THE MARKET THAT OWNS THEM.

   The Investment Case and Entry tabs print everything: each grade's reason,
   each verdict's arguments, each ledger item's terms. That is a market's own
   content, so it travels in that market's lazily-loaded dashboard chunk, which
   calls registerCase() when the chunk loads.

   The same shape as claimRegistry.js, for the reason it gives: a static map of
   every market's prose ends up in a chunk every reader downloads. The home
   page reads a projection instead, from markets/viewBoard.js.

   A market that has not been graded registers nothing and has no such tabs.
   --------------------------------------------------------------------------- */

const BY_MARKET = new Map();

/**
 * Register one market's view and ledger. Called from that market's dashboard.
 *
 * @param {string} marketId
 * @param {{ view: object, ledger: object|null }} record
 */
export function registerCase(marketId, { view, ledger = null }){
  if (!marketId || !view) return;
  BY_MARKET.set(marketId, { view, ledger });
}

/** The whole view of a market whose dashboard has loaded, or null. */
export const caseViewFor = (marketId) => BY_MARKET.get(marketId)?.view ?? null;

/** Its capital-at-risk ledger, or null when it has none. */
export const caseLedgerFor = (marketId) => BY_MARKET.get(marketId)?.ledger ?? null;

/** Markets that have registered. Empty until a dashboard loads. */
export const marketsWithCase = () => [...BY_MARKET.keys()];

/** Test seam. Never called by the application. */
export function __resetCases(){ BY_MARKET.clear(); }
