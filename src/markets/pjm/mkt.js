import {HISTORY_FORMAT} from './historyData.js';
/* ---------------------------------------------------------------------------
   PJM — engine configuration.

   Identity, locale, currency, timezone and COD years for the shared block engine
   (src/markets/_shared/). Distinct from manifest.js, which is the
   application-level identity the registry and the home page read.

   The COD window opens at 2029 rather than 2028 because PJM's is the one set on
   this platform that a queue, not a construction programme, decides: the 2028/29
   Base Residual Auction has already cleared, so an asset being underwritten now
   is bidding into 2029/30 at the earliest.
   --------------------------------------------------------------------------- */

const MKT = {
  id: 'pjm', ns: 'pjm', locale: HISTORY_FORMAT.locale, cur: HISTORY_FORMAT.cur, curCode: 'USD',
  tz: 'America/New_York', tzShort: 'EPT',
  tzNote: ['All timestamps Eastern Prevailing Time, which PJM settles on across the whole RTO',
           '所有时间为美东现行时间（EPT），PJM全RTO范围均按此结算'],
  seedTag: 'PJM_SEED_V1',
  codYears: ['2029', '2030', '2031'], codDefault: '2029',
  pageTitle: 'PJM Battery Investment Dashboard | PJM储能投资看板',
};

export { MKT };
