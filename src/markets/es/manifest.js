/* ---------------------------------------------------------------------------
   Spain — REE / OMIE. Identity and freshness metadata.

   Registered on the analyst's sign-off of 2026-10-29
   (docs/spain-registration-plan.md). The palette seats fourteen hues, so Spain
   reuses one and declares a second channel, as Finland and Ontario did.
   --------------------------------------------------------------------------- */

export const manifest = {
  id: 'es',
  slug: 'spain',
  flag: '🇪🇸',

  shortName: ['ES', '西班牙'],
  name: ['Spain — REE / OMIE', '西班牙 — REE / OMIE'],

  currency: 'EUR',
  currencySymbol: '€',
  locale: 'es-ES',
  timezone: 'Europe/Madrid',

  color: 'var(--s9)',
  pattern: 'hatch',

  asOf: '2026-10-29',
  dataDate: 'OMIE day-ahead prices 1 Jan 2023 – 29 Oct 2026; Order TED/966/2026, 15 Sep 2026',
  modelVersion: 'es-1.0-omie-merchant',
  lastVerified: '2026-10-29',
  sourceHealth: [
    'Merchant line computed from OMIE\'s public day-ahead files; the capacity market read from the BOE; fleet counts from REE; grants from MITECO. Verified 2026-10-29.',
    '市场化收入依据OMIE公开日前电价文件计算；容量市场取自BOE；储能规模取自REE；补贴取自MITECO。核验于2026年10月29日。',
  ],
};

export default manifest;
