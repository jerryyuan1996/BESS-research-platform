/* National Electricity Market. Identity and freshness metadata.

   The platform's second Australian market and WA's counterpart: one
   allocation point anchored on a named reference region, with the regional spread
   carried inside the dashboard rather than split across several entries.

   Added in the 2026-08 market round alongside the other two; economics,
   ranges and the congestion register live in this market's own files, so the
   registry learns of it in one line. */

export const manifest = {
  id: 'nem',
  slug: 'nem',
  flag: '🇦🇺',

  shortName: ['NEM', 'NEM'],
  name: ['Australia — National Electricity Market', '澳大利亚 — 国家电力市场'],

  currency: 'AUD',
  currencySymbol: 'A$',
  locale: 'en-AU',
  timezone: 'Australia/Sydney',

  status: ['Selective', '选择性投资'],
  color: 'var(--s11)',

  asOf: '2026-08-01',
  dataDate: '2025 annual / 2026 published auctions',
  modelVersion: 'nem-seed-1.0-cis-reference-region',
  lastVerified: '2026-08-01',
  sourceHealth: [
    'Base case — public sources collected Aug 2026, automated checks not yet running',
    '基准情景 — 公开来源于2026年8月采集，自动检测尚未运行',
  ],
};

export default manifest;
