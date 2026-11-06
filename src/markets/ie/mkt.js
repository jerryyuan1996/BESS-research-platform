import {HISTORY_FORMAT} from './historyData.js';
/* ---------------------------------------------------------------------------
   Ireland (SEM, all-island) 鈥?engine configuration.

   Identity, locale, currency, timezone and COD years for the shared block
   engine (src/markets/_shared/). Verbatim from the prototype payload
   (lines 282-289).

   This is distinct from manifest.js, which is the application-level identity the
   registry and the home page read. MKT is what the dashboard engine binds its
   formatters and storage keys to.
   --------------------------------------------------------------------------- */

const MKT = {
  id: 'ie', ns: 'ie', locale: HISTORY_FORMAT.locale, cur: HISTORY_FORMAT.cur, curCode: 'EUR',
  tz: 'Europe/Dublin', tzShort: 'Europe/Dublin',
  tzNote: ['All timestamps Europe/Dublin', '所有时间为都柏林时间'],
  seedTag: 'IE_SEED_V1',
  codYears: ['2027', '2028', '2029', '2030'], codDefault: '2029',
  pageTitle: 'Ireland Battery Investment Dashboard | 爱尔兰储能投资看板',
};

export { MKT };