/* ---------------------------------------------------------------------------
   Ontario — IESO. Identity and freshness metadata.

   THE SIXTEENTH MARKET, registered on the analyst's sign-off of 2026-10-23
   (docs/ontario-registration-plan.md). The palette seats fourteen hues, so
   Ontario reuses one and declares a second channel, as Finland did; note that
   no chart reads `pattern` yet, so the two pairs are told apart by label.
   --------------------------------------------------------------------------- */

export const manifest = {
  id: 'ca_on',
  slug: 'ontario',
  flag: '🇨🇦',

  shortName: ['ON', '安大略'],
  name: ['Ontario — IESO', '安大略 — IESO'],

  currency: 'CAD',
  currencySymbol: 'C$',
  locale: 'en-CA',
  timezone: 'America/Toronto',

  color: 'var(--s6)',
  pattern: 'dots',

  asOf: '2026-10-23',
  dataDate: 'LT2(c-1) final results, 13 Jul 2026; day-ahead prices 24 Jul – 23 Oct 2026',
  modelVersion: 'ca_on-1.0-lt2-contract',
  lastVerified: '2026-10-23',
  sourceHealth: [
    'Contract terms read from IESO\'s final LT2(c-1) contract and RFP; prices from IESO\'s public reports; capex from Oneida\'s published final cost. Verified 2026-10-23.',
    '合同条款取自IESO最终版LT2(c-1)合同及招标文件；电价取自IESO公开报告；造价取自Oneida公布的最终成本。核验于2026年10月23日。',
  ],
};

export default manifest;
