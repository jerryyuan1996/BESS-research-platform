/* ---------------------------------------------------------------------------
   ACCEPTED CLAIMS, REGISTERED BY THE MARKET THAT OWNS THEM.

   Registration rather than a static import map, and for a measured reason: an
   import map put every market's claim prose into the shared bundle, and the
   bundle-budget test caught it 60 bytes over. Two markets' claims did that.
   Fifteen markets of bilingual argument would have quietly become something
   every reader downloads to render one page.

   So a market's claims travel inside its own lazily-loaded dashboard chunk,
   which calls registerClaims() when that chunk loads. The dashboard renders
   before the page enhancements run, so the claims are always present by the
   time anything asks for one.

   Same shape as gridMapRegistry, for the same reason it was built that way.
   --------------------------------------------------------------------------- */

const BY_MARKET = new Map();

/**
 * Register one market's accepted claims. Called from that market's dashboard.
 *
 * @param {string} marketId
 * @param {object} claims  section id -> claim
 */
export function registerClaims(marketId, claims){
  if (!marketId || !claims) return;
  BY_MARKET.set(marketId, claims);
}

/** The claim for one section, or null. Null is the answer for most sections. */
export function claimFor(marketId, sectionId){
  return BY_MARKET.get(marketId)?.[sectionId] ?? null;
}

/** Markets that have registered reviewed claims. Empty until a dashboard loads. */
export const marketsWithClaims = () => [...BY_MARKET.keys()];

/** Test seam. Never called by the application. */
export function __resetClaims(){ BY_MARKET.clear(); }
