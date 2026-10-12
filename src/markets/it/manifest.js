/* Italy. Identity and freshness metadata.

   The dashboard's organising question is the spread between MACSE and a
   toll, which is why both routes are declared rather than one.

   Added in the 2026-08 market round alongside the other two; economics,
   ranges and the congestion register live in this market's own files, so the
   registry learns of it in one line. */

export const manifest = {
  id: 'it',
  slug: 'italy',
  flag: '🇮🇹',

  shortName: ['IT', '意大利'],
  name: ['Italy', '意大利'],

  currency: 'EUR',
  currencySymbol: '€',
  locale: 'it-IT',
  timezone: 'Europe/Rome',

  color: 'var(--s10)',

  asOf: '2026-08-01',
  dataDate: '2025 annual / 2026 published auctions',
  modelVersion: 'it-seed-1.0-macse-vs-toll',
  lastVerified: '2026-08-01',
  sourceHealth: [
    'Base case — public sources collected Aug 2026, automated checks not yet running',
    '基准情景 — 公开来源于2026年8月采集，自动检测尚未运行',
  ],
};

export default manifest;
