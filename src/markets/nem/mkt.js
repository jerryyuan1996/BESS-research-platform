import {HISTORY_FORMAT} from './historyData.js';
/* ---------------------------------------------------------------------------
   National Electricity Market — engine configuration.

   Identity, locale, currency, timezone and COD years for the shared block
   engine (src/markets/_shared/). Distinct from manifest.js, which is the
   application-level identity the registry and the home page read.
   --------------------------------------------------------------------------- */

const MKT = {
  id: 'nem', ns: 'nem', locale: HISTORY_FORMAT.locale, cur: HISTORY_FORMAT.cur, curCode: 'AUD',
  tz: 'Australia/Sydney', tzShort: 'AEST',
  tzNote: ['All timestamps AEST', '所有时间为澳大利亚东部时间（AEST/AEDT）'],
  seedTag: 'NEM_SEED_V1',
  codYears: ['2028', '2029', '2030'], codDefault: '2028',
  pageTitle: 'National Electricity Market Battery Investment Dashboard | 澳大利亚国家电力市场储能投资看板',
};

export { MKT };
