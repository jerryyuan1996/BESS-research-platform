/* Romania. Identity and freshness metadata.
   Identity from the prototype cockpit's MARKETS entry; freshness metadata from this
   market's own dataset (data.js). Dashboard migrated — see docs/architecture.md. */

export const manifest = {
  id: 'ro',
  slug: 'romania',
  flag: '🇷🇴',

  shortName: ['RO', '罗马尼亚'],
  name: ['Romania', '罗马尼亚'],

  currency: 'EUR',
  currencySymbol: '€',
  locale: 'ro-RO',
  timezone: 'Europe/Bucharest',

  color: 'var(--s3)',

  asOf: '2026-07-26',
  dataDate: '2025 annual / Jun 2026 monthly',
  modelVersion: 'ro-seed-1.0-support-structure-pl-benchmark',
  lastVerified: '2026-07-26',
  sourceHealth: [
    'Base case — public sources refreshed Jul 2026, automated checks not yet running',
    '基准情景 — 公开来源已于2026年7月刷新，自动检测尚未运行',
  ],
};

export default manifest;
