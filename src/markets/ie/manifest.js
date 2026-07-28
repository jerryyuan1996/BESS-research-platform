/* Ireland — SEM (all-island). Identity and freshness metadata.
   Values from the prototype cockpit's MARKETS entry.
   Dashboard migration pending — see docs/migration-notes.md section 10. */

export const manifest = {
  id: 'ie',
  slug: 'ireland',
  flag: '🇮🇪',

  shortName: ['IE', '爱尔兰'],
  name: ['Ireland — SEM (all-island)', '爱尔兰 — SEM（全岛）'],

  currency: 'EUR',
  currencySymbol: '€',
  locale: 'en-IE',
  timezone: 'Europe/Dublin',

  status: ['Selective', '选择性投资'],
  color: 'var(--s2)',

  asOf: '2026-07-26',
  dataDate: '2025 outturn / CY 2028-29',
  modelVersion: 'ie-seed-1.0-crm-structure-gb-benchmark',
  lastVerified: '2026-07-26',
  sourceHealth: [
    'SEED — public sources refreshed Jul 2026, automated checks not yet running',
    '种子数据 — 公开来源已于2026年7月刷新，自动检测尚未运行',
  ],
};

export default manifest;
