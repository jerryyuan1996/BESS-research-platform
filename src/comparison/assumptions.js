/* ---------------------------------------------------------------------------
   Global normalization assumptions.

   These are the only assumptions the cockpit adds on top of what each market
   dashboard already publishes. Everything else comes from a market's own
   comparison interface. Verbatim from the prototype (lines 683-687).

   The live model may revise these values; legacy parity tests pass their original
   yields explicitly so a current underwriting change does not erase that proof.
   --------------------------------------------------------------------------- */

/** USD per unit of local currency — illustrative mid-rates. */
export const FX = {
  AUD: 0.66,
  GBP: 1.27,
  EUR: 1.08,
  // Added for the Japan markets. Illustrative mid-rate on the seed date below;
  // it is NOT retrieved live and must not be labelled as such.
  JPY: 0.0064,
  /* The comparison currency itself. Added for the US markets, and exactly 1 by
     construction rather than by observation — USD is the numeraire every other
     rate above converts into, so this entry carries no FX assumption at all and
     no seed date applies to it. A US market is therefore the only one on the
     platform whose published economics are unaffected by the FX row. */
  USD: 1,
  /* Added on the analyst's instruction of 2026-10-12, so that Poland's
     capital-at-risk ledger, whose amounts the statute states in złoty, can be
     totalled. NOT a market currency: no market is priced in it and the engine
     never reads it. The ECB reference rate on the seed date below was 4.3265
     złoty to the euro; taken through the euro seed above, 1.08 / 4.3265 =
     0.2496, rounded as the other seeds are. The live ECB feed does not carry
     the złoty, so this one never follows an observed rate. */
  PLN: 0.25,
};

/** Date the FX seeds above were set. Shown next to the rates on the home page. */
export const FX_SEED_DATE = '2026-07-28';

/** Uniform comparison window, years. Every market is modelled over the same life. */
export const LIFE = 15;

/* The long-life view (src/longlife/longLife.js) sits BESIDE the engine and
   never inside it: LIFE above stays the comparison window and nothing in the
   engine reads the two constants below.

   LONG_LIFE_YEARS is the analyst's decision of 2026-10-12: twenty-five years,
   with twenty shown beside it, so the reader sees how much of the answer is
   the choice of window.

   MAINTAINED_FOM_SHARE is the yearly fixed operating cost, as a share of gross
   capex, at which a battery is taken to hold its rated capacity for life. It
   is NREL's figure, read on 2026-10-12: "The FOM value selected is 4% of the
   $/kW capacity cost for a 4-hour battery", chosen from the high end "such
   that the system will be able to perform at rated capacity throughout its
   lifetime" (Cost Projections for Utility-Scale Battery Storage: 2025 Update,
   NREL/TP-6A40-93281, page 11). NREL pairs it with a fifteen-year life and
   about one cycle a day, so using it beyond fifteen years, or outside the
   United States, is an extension the source does not make.

   It is a COMPARISON and not the default. The analyst's ruling of 2026-10-12
   is that a project carries warranty extension and a service agreement, paid
   yearly, and pays nothing further for augmentation: capacity fades. */
export const LONG_LIFE_YEARS = [20, 25];
export const MAINTAINED_FOM_SHARE = 0.04;

/* Exit pricing: remaining cash flows are discounted at stream-specific yields.

   Three risk classes, not two. A capacity payment secured by an executed contract
   for the modelled year is not the same asset as an assumption that the same
   auction will clear again in year 8 — pricing both at the contracted yield
   overstates any market whose capacity revenue is re-auctioned annually. Japan's
   Capacity Market main auction is exactly that case. */
export const EXIT_Y_CONTRACTED = 0.065;   // secured / contracted cash flow
export const EXIT_Y_MERCHANT   = 0.105;   // merchant + services cash flow
export const EXIT_Y_OPEX       = 0.07;    // opex obligation assumed by the buyer

/* Auction-renewal cash flow — future auction clearings assumed but not secured.
   Set equal to the merchant yield: it is market risk, and adopting a distinct
   number would introduce an assumption no source supports. Kept as its own
   constant so the treatment is explicit and can be separated later without
   hunting for the call site. */
export const EXIT_Y_AUCTION = EXIT_Y_MERCHANT;

/** Exit years offered by the home page's selector. */
export const EXIT_YEARS = [5, 7, 10];

/* The design-fit band (src/comparison/designFit.js). A design whose value is
   within this share of the archetype's net capital of the best design is "in
   the band": the sweep cannot tell them apart honestly, so it does not pretend
   to. Stated against capital rather than against the best value, because a
   share of value has no meaning where every design destroys value — which is
   most of the sweeps the dashboards ran on 2026-10-15.

   Methodology, set by the analyst: docs/duration-and-route-fit-plan.md §2.3,
   approved 2026-10-15. */
export const DESIGN_FIT_TOLERANCE = 0.02;

/* The comparison is deliberately unlevered. Debt capacity differs by market for
   exactly the reasons this page measures, so it is expressed through the exit
   yields above rather than assumed as a capital structure. */
export const UNLEVERED = true;

/** Rendered on the home page next to the FX row. */
export const FX_NOTE = [
  'Illustrative mid-rates — replace with live rates before any transaction use',
  '示意中间价 — 任何交易用途前须以实时汇率替换',
];
