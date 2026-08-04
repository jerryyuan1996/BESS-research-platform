/* ERCOT. Identity and freshness metadata.

   The platform's second US market and PJM's opposite on every axis that matters.
   PJM pays for capacity through a published auction and makes a project wait
   eight years to connect; ERCOT pays nothing for capacity at all and connects in
   about four. One is an energy-only market with scarcity pricing through the
   ORDC, the other has the largest capacity auction in the world. They share a
   federal tax and tariff layer and essentially nothing else, which is why they
   are separate allocation markets with separate dashboards rather than one US
   market with two lenses.

   ERCOT is also the platform's only single-state market outside Western
   Australia, and for the same reason: it is a grid that does not synchronously
   connect to its neighbours, so its price formation is its own.

   Added in the 2026-08 US round alongside PJM and CAISO. */

export const manifest = {
  id: 'ercot',
  slug: 'ercot',
  flag: '🇺🇸',

  shortName: ['ERCOT', 'ERCOT'],
  name: ['United States — ERCOT (Texas)', '美国 — ERCOT（德州）'],

  currency: 'USD',
  currencySymbol: '$',
  locale: 'en-US',
  timezone: 'America/Chicago',

  status: ['Watch', '观察'],
  color: 'var(--s13)',

  asOf: '2026-08-04',
  dataDate: 'CY2025 revenue index / Q1 2026 fleet / RTC+B live Dec 2025',
  modelVersion: 'ercot-seed-1.0-energy-only-toll-led-two-hour',
  lastVerified: '2026-08-04',
  sourceHealth: [
    'SEED — fleet and market-design inputs from ERCOT primary sources; revenue and toll legs are derived from third-party indices, automated checks not yet running',
    '种子数据 — 装机与市场机制输入取自ERCOT官方来源；收入与租赁项为依据第三方指数的推导值，自动检测尚未运行',
  ],
};

export default manifest;
