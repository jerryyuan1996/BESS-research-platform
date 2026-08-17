/* Western Australia — WEM. Identity and freshness metadata.
   Values from the prototype cockpit's MARKETS entry and WA's own SEED block. */

export const manifest = {
  id: 'wa',
  slug: 'western-australia',
  flag: '🇦🇺',

  shortName: ['WA', '西澳'],
  name: ['Western Australia — WEM', '西澳 — WEM'],

  currency: 'AUD',
  currencySymbol: 'A$',
  locale: 'en-AU',
  timezone: 'Australia/Perth',

  status: ['Selective', '选择性投资'],
  color: 'var(--s1)',

  // ---- freshness metadata (brief section 21) — dates unchanged from the prototype
  asOf: '2026-07-26',
  dataDate: 'Q1 2026 / CY 2028-29',
  modelVersion: 'seed-1.3-wem-structure-nem-benchmark',
  lastVerified: '2026-07-26',
  sourceHealth: [
    'Base case — public sources refreshed Jul 2026, automated checks not yet running',
    '基准情景 — 公开来源已于2026年7月刷新，自动检测尚未运行',
  ],
};

export default manifest;
