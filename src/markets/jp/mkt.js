/* ---------------------------------------------------------------------------
   Japan — engine configuration.

   `id: 'jp'` is the DASHBOARD id, not an allocation-market id. Three allocation
   markets (jp_tokyo, jp_kyushu, jp_hokkaido) point their manifest.dashboardId at
   it. Storage keys are namespaced 'jp' so the three regional lenses share one
   set of lab inputs and scorecard overrides — which is correct: it is one
   research dashboard.
   --------------------------------------------------------------------------- */

export const MKT = {
  id: 'jp', ns: 'jp', locale: 'ja-JP', cur: '¥', curCode: 'JPY',
  tz: 'Asia/Tokyo', tzShort: 'JST',
  tzNote: ['All timestamps JST (UTC+9)', '所有时间为日本标准时间(JST, UTC+9)'],
  seedTag: 'JP_SEED_V1',
  codYears: ['2027', '2028', '2029', '2030', '2031'], codDefault: '2029',
  pageTitle: 'Japan BESS Investment Dashboard | 日本储能投资看板',
};

export default MKT;
