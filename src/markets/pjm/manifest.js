/* PJM Interconnection. Identity and freshness metadata.

   The platform's first US market. PJM is a regional transmission organisation
   covering all or part of thirteen states and the District of Columbia — 67
   million people, 88,417 miles of transmission — and it is one allocation point
   rather than three: the Base Residual Auction has cleared RTO-wide for the last
   three delivery years, so there is no locational capacity price to split on.
   Where PJM does differentiate is nodally, in the energy market, and that is
   carried inside the dashboard and the congestion register.

   Added in the 2026-08 US round alongside CAISO and ERCOT. The three are separate
   allocation markets with separate dashboards, not one country with three lenses:
   they share a federal tax and tariff layer and almost nothing else. PJM pays for
   capacity through an auction, CAISO through bilateral Resource Adequacy, and
   ERCOT does not pay for capacity at all. */

export const manifest = {
  id: 'pjm',
  slug: 'pjm',
  flag: '🇺🇸',

  shortName: ['PJM', 'PJM'],
  name: ['United States — PJM Interconnection', '美国 — PJM互联电网'],

  currency: 'USD',
  currencySymbol: '$',
  locale: 'en-US',
  /* The RTO spans Eastern and Central time. PJM settles and publishes on Eastern
     Prevailing Time throughout, including for the western LDAs, so that is the
     zone the dashboard timestamps in. */
  timezone: 'America/New_York',

  color: 'var(--s14)',

  asOf: '2026-08-03',
  dataDate: '2028/29 BRA (Jul 2026) / CY2025 spreads / Regulation to Apr 2026',
  modelVersion: 'pjm-seed-1.0-rpm-auction-renewal-two-leg-merchant',
  lastVerified: '2026-08-03',
  sourceHealth: [
    'Base case — capacity inputs taken from PJM primary documents; merchant and Regulation legs are derived, automated checks not yet running',
    '基准情景 — 容量输入取自PJM官方原始文件；市场化与调频收入项为推导值，自动检测尚未运行',
  ],
};

export default manifest;
