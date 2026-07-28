/* Poland. Identity and freshness metadata.
   Identity from the prototype cockpit's MARKETS entry; freshness metadata from this
   market's own dataset (data.js). Dashboard migrated — see docs/architecture.md. */

export const manifest = {
  id: 'pl',
  slug: 'poland',
  flag: '🇵🇱',

  shortName: ['PL', '波兰'],
  name: ['Poland', '波兰'],

  currency: 'EUR',
  currencySymbol: '€',
  locale: 'pl-PL',
  timezone: 'Europe/Warsaw',

  status: ['Selective', '选择性投资'],
  color: 'var(--s6)',

  asOf: '2026-07-26',
  dataDate: '2025 annual / DY 2030',
  modelVersion: 'pl-seed-1.0-capacity-structure-ro-benchmark',
  lastVerified: '2026-07-26',
  sourceHealth: [
    'SEED — public sources refreshed Jul 2026, automated checks not yet running',
    '种子数据 — 公开来源已于2026年7月刷新，自动检测尚未运行',
  ],
};

export default manifest;
