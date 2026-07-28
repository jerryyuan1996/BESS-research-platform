/* Great Britain. Identity and freshness metadata.
   Identity from the prototype cockpit's MARKETS entry; freshness metadata from this
   market's own dataset (data.js). Dashboard migrated — see docs/architecture.md. */

export const manifest = {
  id: 'gb',
  slug: 'great-britain',
  flag: '🇬🇧',

  shortName: ['GB', '英国'],
  name: ['Great Britain', '英国'],

  currency: 'GBP',
  currencySymbol: '£',
  locale: 'en-GB',
  timezone: 'Europe/London',

  status: ['Selective', '选择性投资'],
  color: 'var(--s5)',

  asOf: '2026-07-26',
  dataDate: 'TTM Apr 2026 / DY 2029-30',
  modelVersion: 'gb-seed-1.0-cm-structure-sem-benchmark',
  lastVerified: '2026-07-26',
  sourceHealth: [
    'SEED — public sources refreshed Jul 2026, automated checks not yet running',
    '种子数据 — 公开来源已于2026年7月刷新，自动检测尚未运行',
  ],
};

export default manifest;
