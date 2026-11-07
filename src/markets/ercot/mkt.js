import {HISTORY_FORMAT} from './historyData.js';
/* ---------------------------------------------------------------------------
   ERCOT — engine configuration.

   Identity, locale, currency, timezone and COD years for the shared block
   engine (src/markets/_shared/). Distinct from manifest.js, which is the
   application-level identity the registry and the home page read.

   The COD window opens at 2028 rather than PJM's 2029: ERCOT interconnection
   runs about 4.2 years against PJM's eight-plus, so a project being underwritten
   now reaches commercial operation materially sooner here. That difference is
   not a presentational choice — it is the single biggest structural advantage
   this market has, and it belongs in the dates as well as in the prose.
   --------------------------------------------------------------------------- */

const MKT = {
  id: 'ercot', ns: 'ercot', locale: HISTORY_FORMAT.locale, cur: HISTORY_FORMAT.cur, curCode: 'USD',
  tz: 'America/Chicago', tzShort: 'CPT',
  tzNote: ['All timestamps Central Prevailing Time, which ERCOT settles on',
           '所有时间为美中现行时间（CPT），ERCOT按此结算'],
  seedTag: 'ERCOT_SEED_V1',
  codYears: ['2028', '2029', '2030'], codDefault: '2028',
  pageTitle: 'ERCOT Battery Investment Dashboard | ERCOT储能投资看板',
};

export { MKT };
