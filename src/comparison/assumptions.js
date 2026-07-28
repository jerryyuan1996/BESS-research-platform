/* ---------------------------------------------------------------------------
   Global normalization assumptions.

   These are the only assumptions the cockpit adds on top of what each market
   dashboard already publishes. Everything else comes from a market's own
   comparison interface. Verbatim from the prototype (lines 683-687).

   Do not change these values. They are frozen for this phase (brief section 11)
   and tests/baseline.test.js asserts outputs against them.
   --------------------------------------------------------------------------- */

/** USD per unit of local currency — illustrative mid-rates. */
export const FX = {
  AUD: 0.66,
  GBP: 1.27,
  EUR: 1.08,
  // Added for the Japan markets. Illustrative mid-rate on the seed date below;
  // it is NOT retrieved live and must not be labelled as such.
  JPY: 0.0064,
};

/** Date the FX seeds above were set. Shown next to the rates on the home page. */
export const FX_SEED_DATE = '2026-07-28';

/** Uniform comparison window, years. Every market is modelled over the same life. */
export const LIFE = 15;

/* Exit pricing: remaining cash flows are discounted at stream-specific yields.

   Three risk classes, not two. A capacity payment secured by an executed contract
   for the modelled year is not the same asset as an assumption that the same
   auction will clear again in year 8 — pricing both at the contracted yield
   overstates any market whose capacity revenue is re-auctioned annually. Japan's
   Capacity Market main auction is exactly that case. */
export const EXIT_Y_CONTRACTED = 0.075;   // secured / contracted cash flow
export const EXIT_Y_MERCHANT   = 0.115;   // merchant + services cash flow
export const EXIT_Y_OPEX       = 0.08;    // opex obligation assumed by the buyer

/* Auction-renewal cash flow — future auction clearings assumed but not secured.
   Set equal to the merchant yield: it is market risk, and adopting a distinct
   number would introduce an assumption no source supports. Kept as its own
   constant so the treatment is explicit and can be separated later without
   hunting for the call site. */
export const EXIT_Y_AUCTION = EXIT_Y_MERCHANT;

/** Exit years offered by the home page's selector. */
export const EXIT_YEARS = [5, 7, 10];

/* The comparison is deliberately unlevered. Debt capacity differs by market for
   exactly the reasons this page measures, so it is expressed through the exit
   yields above rather than assumed as a capital structure. */
export const UNLEVERED = true;

/** Rendered on the home page next to the FX row. */
export const FX_NOTE = [
  'Illustrative mid-rates — replace with live rates before any transaction use',
  '示意中间价 — 任何交易用途前须以实时汇率替换',
];
