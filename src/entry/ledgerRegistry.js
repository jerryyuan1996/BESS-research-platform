/* ---------------------------------------------------------------------------
   Capital-at-risk ledgers, joined to markets.

   The same shape as buildPathwayRegistry: markets declare, this file collects,
   and consumers ask by market id.

   NOT FOR A PAGE, for the reason viewRegistry.js gives: every ledger whole is
   more than any one page should carry. The home page reads the projection in
   markets/viewBoard.js and a market's own tabs read markets/caseRegistry.js.

   ABSENCE AND EMPTINESS ARE DIFFERENT. A market with no ledger has not been
   looked at. A market with an empty ledger has been looked at and nothing was
   sourced — Great Britain is that case, and its `limit` says what was sought.
   --------------------------------------------------------------------------- */
import { ENTRY_LEDGER as WA } from '../markets/wa/entryLedger.js';
import { ENTRY_LEDGER as FI } from '../markets/fi/entryLedger.js';
import { ENTRY_LEDGER as GB } from '../markets/gb/entryLedger.js';
import { ENTRY_LEDGER as RO } from '../markets/ro/entryLedger.js';

const LEDGERS = [WA, FI, GB, RO];

const byMarket = new Map(LEDGERS.map(l => [l.marketId, l]));

export const allLedgers = () => [...LEDGERS];

export function ledgerFor(marketId){
  return byMarket.get(marketId) || null;
}

export const hasLedger = (marketId) => byMarket.has(marketId);

export const ledgerMarketIds = () => LEDGERS.map(l => l.marketId);
