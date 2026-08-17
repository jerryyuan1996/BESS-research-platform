/* ---------------------------------------------------------------------------
   TEMPLATE — market identity and freshness metadata.

   Copy this directory to src/markets/<id>/ and fill in every value below.
   Required fields are listed in src/markets/schema.js; tests/registry.test.js
   fails the build if one is missing.
   --------------------------------------------------------------------------- */

export const manifest = {
  // ---- identity (all required) ---------------------------------------------
  id: 'xx',                       // short stable key, lowercase. Used in results, tests, URLs of record.
  slug: 'market-name',            // URL segment → /markets/market-name
  flag: '🏳️',                     // emoji, shown in cards, nav and table headers

  shortName: ['XX', '简称'],       // [en, zh] — table headers, nav, chart axis labels
  name: ['Market Name', '市场名称'], // [en, zh] — card titles, page title

  currency: 'EUR',                // ISO 4217. MUST have an FX rate in comparison/assumptions.js,
                                  // otherwise the market cannot be normalized and validation fails.
  currencySymbol: '€',
  locale: 'en-GB',                // BCP-47 — this market's own number formatting
  timezone: 'Europe/Brussels',    // IANA zone, for any timestamped series

  status: ['Selective', '选择性投资'],  // investment stance chip on the market card
  color: 'var(--s7)',             // CSS series colour. Pick an unused --s1..--s8.

  // ---- freshness metadata (brief section 21) -------------------------------
  // Never guess these. Leave null until you have the real value.
  asOf: null,                     // 'YYYY-MM-DD' — date the seed snapshot was verified
  dataDate: null,                 // period the underlying data covers, e.g. 'Q1 2026'
  modelVersion: null,             // this market's own model version string
  lastVerified: null,             // 'YYYY-MM-DD' — public sources last re-checked
  sourceHealth: [
    'Base case — no automated ingestion yet',
    '基准情景 — 尚无自动抓取',
  ],
};

export default manifest;
