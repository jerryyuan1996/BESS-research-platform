/* ---------------------------------------------------------------------------
   Saudi Arabia — engine configuration for the shared block engine.

   COD years follow the procurement: Group 1 was signed in August 2026 and
   Group 2 bids close on 12 November 2026, so a new consortium's realistic
   entry is a later round reaching operation around 2029.
   --------------------------------------------------------------------------- */

const MKT = {
  id: 'sa', ns: 'sa', locale: 'en-SA', cur: 'SAR ', curCode: 'SAR',
  tz: 'Asia/Riyadh', tzShort: 'AST',
  tzNote: ['Arabia Standard Time, UTC+3, all year', '阿拉伯标准时间，全年UTC+3'],
  seedTag: 'SA_BASE_V1',
  codYears: ['2028', '2029', '2030'], codDefault: '2029',
  pageTitle: 'Saudi Arabia Battery Investment Dashboard | 沙特储能投资看板',
};

export { MKT };
