/* CAISO. Identity and freshness metadata.

   The platform's third US market and the third distinct answer to the one
   question the comparison engine cares about most. PJM pays for capacity through
   a published auction; ERCOT does not pay for it at all; CAISO pays for it
   through bilateral Resource Adequacy contracts between load-serving entities and
   generators — a real, large, contracted revenue line whose price is set deal by
   deal rather than cleared centrally.

   That makes the three US markets a genuine set rather than a region: they share
   a federal tax and tariff layer and differ on every mechanism above it.

   Added in the 2026-08 US round alongside PJM and ERCOT. */

export const manifest = {
  id: 'caiso',
  slug: 'caiso',
  flag: '🇺🇸',

  shortName: ['CAISO', 'CAISO'],
  name: ['United States — CAISO (California)', '美国 — CAISO（加州）'],

  currency: 'USD',
  currencySymbol: '$',
  locale: 'en-US',
  timezone: 'America/Los_Angeles',

  status: ['Selective', '选择性投资'],
  color: 'var(--s12)',

  asOf: '2026-08-04',
  dataDate: 'H1 2025 RA benchmark / CY2025 merchant / Q1 2026 fleet',
  modelVersion: 'caiso-seed-1.0-bilateral-ra-four-hour-nqc-ceiling',
  lastVerified: '2026-08-04',
  sourceHealth: [
    'Base case — RA and merchant benchmarks are third-party; CPUC and CAISO framework inputs are official, automated checks not yet running',
    '基准情景 — 容量充裕度与市场化收入基准来自第三方；CPUC与CAISO制度性输入为官方来源，自动检测尚未运行',
  ],
};

export default manifest;
