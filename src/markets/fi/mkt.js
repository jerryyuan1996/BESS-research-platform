/* ---------------------------------------------------------------------------
   Finland — engine configuration.

   Identity, locale, currency and timezone for the shared block engine
   (src/markets/_shared/). Distinct from manifest.js, which is the
   application-level identity the registry and the home page read; MKT is what
   the dashboard engine binds its formatters and storage keys to.

   COD years start at 2028 rather than 2027: new grid storage connections in
   southern Finland are restricted until 2029, and the north is where capacity is
   available today. A 2027 default would imply an entry point most of this market
   does not currently have.
   --------------------------------------------------------------------------- */

const MKT = {
  id: 'fi', ns: 'fi', locale: 'fi-FI', cur: '€', curCode: 'EUR',
  tz: 'Europe/Helsinki', tzShort: 'EET',
  tzNote: ['All timestamps EET/EEST', '所有时间为东欧时间(EET/EEST)'],
  seedTag: 'FI_BASE_V1',
  codYears: ['2028', '2029', '2030'], codDefault: '2029',
  pageTitle: 'Finland Battery Investment Dashboard | 芬兰储能投资看板',
};

export { MKT };
