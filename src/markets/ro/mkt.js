/* ---------------------------------------------------------------------------
   Romania 鈥?engine configuration.

   Identity, locale, currency, timezone and COD years for the shared block
   engine (src/markets/_shared/). Verbatim from the prototype payload
   (lines 281-288).

   This is distinct from manifest.js, which is the application-level identity the
   registry and the home page read. MKT is what the dashboard engine binds its
   formatters and storage keys to.
   --------------------------------------------------------------------------- */

const MKT = {
  id: 'ro', ns: 'ro', locale: 'en-GB', cur: '€', curCode: 'EUR',
  tz: 'Europe/Bucharest', tzShort: 'EET',
  tzNote: ['All timestamps EET', '所有时间为东欧时间(EET)'],
  seedTag: 'RO_SEED_V1',
  codYears: ['2027', '2028', '2029'], codDefault: '2028',
  pageTitle: 'Romania Battery Investment Dashboard | 罗马尼亚储能投资看板',
};

export { MKT };