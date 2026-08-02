/* Germany. Identity and freshness metadata.

   Europe's most active BESS financing market, and the one with the least
   contracted revenue to finance against — the two facts are the same fact.

   Added in the 2026-08 market round alongside the other two; economics,
   ranges and the congestion register live in this market's own files, so the
   registry learns of it in one line. */

export const manifest = {
  id: 'de',
  slug: 'germany',
  flag: '🇩🇪',

  shortName: ['DE', '德国'],
  name: ['Germany', '德国'],

  currency: 'EUR',
  currencySymbol: '€',
  locale: 'de-DE',
  timezone: 'Europe/Berlin',

  status: ['Selective', '选择性投资'],
  color: 'var(--s9)',

  asOf: '2026-08-01',
  dataDate: '2025 annual / 2026 published auctions',
  modelVersion: 'de-seed-1.0-merchant-and-toll',
  lastVerified: '2026-08-01',
  sourceHealth: [
    'SEED — public sources collected Aug 2026, automated checks not yet running',
    '种子数据 — 公开来源于2026年8月采集，自动检测尚未运行',
  ],
};

export default manifest;
