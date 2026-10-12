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

  color: 'var(--s6)',

  asOf: '2026-07-26',
  dataDate: '2025 annual / DY 2030',
  modelVersion: 'pl-seed-1.0-capacity-structure-ro-benchmark',
  lastVerified: '2026-07-26',
  sourceHealth: [
    'Base case — public sources refreshed Jul 2026, automated checks not yet running',
    '基准情景 — 公开来源已于2026年7月刷新，自动检测尚未运行',
  ],
};

export default manifest;
