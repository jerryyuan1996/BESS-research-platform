/* ---------------------------------------------------------------------------
   Spain — engine configuration for the shared block engine.

   COD years follow the build: standalone four-hour projects reach
   ready-to-build in 2026–27 and PINALM's must be built by the end of 2029, so
   2028 is the entry point.
   --------------------------------------------------------------------------- */

const MKT = {
  id: 'es', ns: 'es', locale: 'es-ES', cur: '€', curCode: 'EUR',
  tz: 'Europe/Madrid', tzShort: 'CET',
  tzNote: ['OMIE prices are published in Spanish local time', 'OMIE电价按西班牙当地时间公布'],
  seedTag: 'ES_BASE_V1',
  codYears: ['2027', '2028', '2029'], codDefault: '2028',
  pageTitle: 'Spain Battery Investment Dashboard | 西班牙储能投资看板',
};

export { MKT };
