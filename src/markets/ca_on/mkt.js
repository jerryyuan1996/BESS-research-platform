/* ---------------------------------------------------------------------------
   Ontario — engine configuration for the shared block engine.

   COD years follow the procurement: window 1's milestone is 1 May 2030 and
   window 2's draft milestone is 1 May 2032, which is the entry point.
   --------------------------------------------------------------------------- */

const MKT = {
  id: 'ca_on', ns: 'ca_on', locale: 'en-CA', cur: 'C$', curCode: 'CAD',
  tz: 'America/Toronto', tzShort: 'EST',
  tzNote: ['IESO settles in Eastern Standard Time all year', 'IESO全年按东部标准时间结算'],
  seedTag: 'CA_ON_BASE_V1',
  codYears: ['2030', '2031', '2032'], codDefault: '2032',
  pageTitle: 'Ontario Battery Investment Dashboard | 安大略储能投资看板',
};

export { MKT };
