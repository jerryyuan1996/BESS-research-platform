/* ---------------------------------------------------------------------------
   Poland 鈥?engine configuration.

   Identity, locale, currency, timezone and COD years for the shared block
   engine (src/markets/_shared/). Verbatim from the prototype payload
   (lines 288-295).

   This is distinct from manifest.js, which is the application-level identity the
   registry and the home page read. MKT is what the dashboard engine binds its
   formatters and storage keys to.
   --------------------------------------------------------------------------- */

const MKT = {
  id: 'pl', ns: 'pl', locale: 'en-GB', cur: '€', curCode: 'EUR',
  tz: 'Europe/Warsaw', tzShort: 'CET',
  tzNote: ['All timestamps CET', '所有时间为中欧时间(CET)'],
  seedTag: 'PL_SEED_V1',
  codYears: ['2028', '2029', '2030'], codDefault: '2029',
  pageTitle: 'Poland Battery Investment Dashboard | 波兰储能投资看板',
};

export { MKT };