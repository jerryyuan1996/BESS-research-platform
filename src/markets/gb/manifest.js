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

  color: 'var(--s5)',

  asOf: '2026-07-29',
  dataDate: 'FES 2025 / TEC 29 Jul 2026 / TTM Apr 2026 / DY 2029-30',
  modelVersion: 'gb-governed-2.0-fes-tec',
  lastVerified: '2026-07-29',
  sourceHealth: [
    'MIXED — governed FES/TEC snapshots; legacy revenue and finance series remain seed/modelled',
    '混合 — FES/TEC为受治理快照；既有收入与财务序列仍为种子/模型数据',
  ],
};

export default manifest;
