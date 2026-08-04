/* ---------------------------------------------------------------------------
   CAISO — engine configuration.

   Identity, locale, currency, timezone and COD years for the shared block
   engine (src/markets/_shared/). Distinct from manifest.js, which is the
   application-level identity the registry and the home page read.

   The COD window opens at 2030, the latest on the platform, and that is the
   market speaking rather than a presentational choice: interconnection has
   overtaken technology cost as the binding constraint on CAISO deployment, with
   roughly 500 GW in the queue.
   --------------------------------------------------------------------------- */

const MKT = {
  id: 'caiso', ns: 'caiso', locale: 'en-US', cur: '$', curCode: 'USD',
  tz: 'America/Los_Angeles', tzShort: 'PPT',
  tzNote: ['All timestamps Pacific Prevailing Time, which CAISO settles on',
           '所有时间为美太平洋现行时间（PPT），CAISO按此结算'],
  seedTag: 'CAISO_SEED_V1',
  codYears: ['2030', '2031', '2032'], codDefault: '2030',
  pageTitle: 'CAISO Battery Investment Dashboard | CAISO储能投资看板',
};

export { MKT };
