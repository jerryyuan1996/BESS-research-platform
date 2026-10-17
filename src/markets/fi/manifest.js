/* ---------------------------------------------------------------------------
   Finland — Fingrid bidding zone. Identity and freshness metadata.

   THE FIFTEENTH MARKET, and the first one the categorical palette cannot seat.
   docs/adding-a-market.md puts the practical ceiling at fourteen hues and says a
   fifteenth should reach for a second visual channel rather than a fifteenth
   colour — so Finland reuses --s2 and carries `pattern: 'hatch'`, which the
   grouped charts and the allocation matrix render as a diagonal overlay. Two
   markets may now share a hue as long as they do not share a pattern.

   That is a smaller change than a fifteenth hue and a better one: it still works
   at market twenty, and it gives the charts a discriminator that survives being
   printed in greyscale or read by someone who cannot separate --s2 from --s4.

   Freshness fields are populated where they are known and left null where they
   are not — a guess here is worse than a gap, because it reads as verification
   that did not happen.
   --------------------------------------------------------------------------- */

export const manifest = {
  id: 'fi',
  slug: 'finland',
  flag: '🇫🇮',

  shortName: ['FI', '芬兰'],
  name: ['Finland — Fingrid', '芬兰 — Fingrid'],

  currency: 'EUR',
  currencySymbol: '€',
  locale: 'fi-FI',
  timezone: 'Europe/Helsinki',

  /* Priced in the engine since 2026-10-17: reserves at the 2026 annual
     clearing spread across the fleet, and the negotiated floor as a floor. */

  color: 'var(--s2)',
  /* The second visual channel. See the header, and src/home/seriesStyle.js for
     what consumes it. */
  pattern: 'hatch',

  asOf: '2026-08-18',
  dataDate: '2026 obligation period; FCR yearly market for delivery year 2026',
  /* Names what the model IS. 1.0 withheld the reserve line; 2.0 prices it at
     the 2026 annual clearing and models the negotiated floor. */
  modelVersion: 'fi-2.0-reserve-floor-priced',
  lastVerified: '2026-08-18',
  sourceHealth: [
    'Structure verified against Fingrid and the Energy Authority on 2026-08-18; priced in the engine since 2026-10-17, with reserves at the 2026 annual clearing and the hourly markets outstanding (gate FI-2).',
    '市场结构已于2026年8月18日依据Fingrid及能源局资料核验；自2026年10月17日起纳入引擎计价，备用收入取2026年度出清，小时级市场数据待补（研究缺口FI-2）。',
  ],
};

export default manifest;
