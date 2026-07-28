/* ---------------------------------------------------------------------------
   Great Britain 鈥?engine configuration.

   Identity, locale, currency, timezone and COD years for the shared block
   engine (src/markets/_shared/). Verbatim from the prototype payload
   (lines 281-288).

   This is distinct from manifest.js, which is the application-level identity the
   registry and the home page read. MKT is what the dashboard engine binds its
   formatters and storage keys to.
   --------------------------------------------------------------------------- */

const MKT = {
  id: 'gb', ns: 'gb', locale: 'en-GB', cur: '£', curCode: 'GBP',
  tz: 'Europe/London', tzShort: 'Europe/London',
  tzNote: ['All timestamps Europe/London', '所有时间为伦敦时间'],
  seedTag: 'GB_SEED_V1',
  codYears: ['2028', '2029', '2030', '2031'], codDefault: '2029',
  pageTitle: 'Great Britain Battery Investment Dashboard | 英国储能投资看板',
};

export { MKT };