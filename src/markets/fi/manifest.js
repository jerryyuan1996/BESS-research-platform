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

  /* Not "Selective" and not "Invest". The structure is understood and the
     per-MW economics are not yet, which is a different state from either, and
     `engineReady: false` is the machine-readable half of the same statement. */

  color: 'var(--s2)',
  /* The second visual channel. See the header, and src/home/seriesStyle.js for
     what consumes it. */
  pattern: 'hatch',

  asOf: '2026-08-18',
  dataDate: '2026 obligation period; FCR yearly market for delivery year 2026',
  /* Names what the model IS, including the part it declines to model. A version
     string is an identifier for a set of choices, and "services withheld" is one
     of the choices — a later version that publishes a reserve level must not be
     mistakable for this one. */
  modelVersion: 'fi-1.0-reserve-led-services-withheld',
  lastVerified: '2026-08-18',
  sourceHealth: [
    'Structure verified against Fingrid and the Energy Authority on 2026-08-18. Per-MW economics are not yet complete — the market is deliberately excluded from the allocation engine.',
    '市场结构已于2026年8月18日依据Fingrid及能源局资料核验。每MW经济性尚未完成 — 该市场已有意排除在配置引擎之外。',
  ],
};

export default manifest;
