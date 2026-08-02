/* ---------------------------------------------------------------------------
   Italy — engine configuration.

   Identity, locale, currency, timezone and COD years for the shared block
   engine (src/markets/_shared/). Distinct from manifest.js, which is the
   application-level identity the registry and the home page read.
   --------------------------------------------------------------------------- */

const MKT = {
  id: 'it', ns: 'it', locale: 'en-GB', cur: '€', curCode: 'EUR',
  tz: 'Europe/Rome', tzShort: 'CET',
  tzNote: ['All timestamps CET/CEST', '所有时间为中欧时间（CET/CEST）'],
  seedTag: 'IT_SEED_V1',
  codYears: ['2028', '2029', '2030'], codDefault: '2028',
  pageTitle: 'Italy Battery Investment Dashboard | 意大利储能投资看板',
};

export { MKT };
