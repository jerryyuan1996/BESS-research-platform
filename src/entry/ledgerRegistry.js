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
import { ENTRY_LEDGER as DE } from '../markets/de/entryLedger.js';
import { ENTRY_LEDGER as IT } from '../markets/it/entryLedger.js';
import { ENTRY_LEDGER as PL } from '../markets/pl/entryLedger.js';
import { ENTRY_LEDGER as IE } from '../markets/ie/entryLedger.js';
import { ENTRY_LEDGER as NEM } from '../markets/nem/entryLedger.js';
import { ENTRY_LEDGER as PJM } from '../markets/pjm/entryLedger.js';
import { ENTRY_LEDGER as ERCOT } from '../markets/ercot/entryLedger.js';
import { ENTRY_LEDGER as CAISO } from '../markets/caiso/entryLedger.js';
import { ENTRY_LEDGER as CA_ON } from '../markets/ca_on/entryLedger.js';
import { ENTRY_LEDGER as SA } from '../markets/sa/entryLedger.js';
import { ENTRY_LEDGER as ES } from '../markets/es/entryLedger.js';
/* Japan's three allocation points share one dashboard and one module. */
import { TOKYO_ENTRY_LEDGER, KYUSHU_ENTRY_LEDGER, HOKKAIDO_ENTRY_LEDGER } from '../markets/jp/entryLedger.js';

const LEDGERS = [WA, FI, GB, RO, DE, IT, PL, IE, NEM, PJM, ERCOT, CAISO, TOKYO_ENTRY_LEDGER, KYUSHU_ENTRY_LEDGER, HOKKAIDO_ENTRY_LEDGER, CA_ON, SA, ES];

const byMarket = new Map(LEDGERS.map(l => [l.marketId, l]));

export const allLedgers = () => [...LEDGERS];

export function ledgerFor(marketId){
  return byMarket.get(marketId) || null;
}

export const hasLedger = (marketId) => byMarket.has(marketId);

export const ledgerMarketIds = () => LEDGERS.map(l => l.marketId);
