import {HISTORY_FORMAT} from './historyData.js';
/* ---------------------------------------------------------------------------
   Germany — engine configuration.

   Identity, locale, currency, timezone and COD years for the shared block
   engine (src/markets/_shared/). Distinct from manifest.js, which is the
   application-level identity the registry and the home page read.
   --------------------------------------------------------------------------- */

const MKT = {
  id: 'de', ns: 'de', locale: HISTORY_FORMAT.locale, cur: HISTORY_FORMAT.cur, curCode: 'EUR',
  tz: 'Europe/Berlin', tzShort: 'CET',
  tzNote: ['All timestamps CET', '所有时间为中欧时间（CET/CEST）'],
  seedTag: 'DE_SEED_V1',
  codYears: ['2028', '2029', '2030'], codDefault: '2028',
  pageTitle: 'Germany Battery Investment Dashboard | 德国储能投资看板',
};

export { MKT };
