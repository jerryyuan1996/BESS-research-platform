/* ---------------------------------------------------------------------------
   WHICH MARKETS HAVE ACCEPTED CLAIMS.

   Registration, like every other market capability here — a market appears when
   it registers, and a market with no reviewed claims simply is not in this map.
   That is the normal state: fourteen of fifteen are absent today.

   Kept out of the market modules so that adding claims to a market is one edit
   in one place and cannot half-happen.
   --------------------------------------------------------------------------- */
import { CLAIMS as WA_CLAIMS } from './wa/claims.js';
import { CLAIMS as PJM_CLAIMS } from './pjm/claims.js';

const BY_MARKET = { wa: WA_CLAIMS, pjm: PJM_CLAIMS };

/** The claim for one section, or null. Null is the answer for most sections. */
export function claimFor(marketId, sectionId){
  return BY_MARKET[marketId]?.[sectionId] ?? null;
}

/** Markets carrying reviewed claims. */
export const marketsWithClaims = () => Object.keys(BY_MARKET);
