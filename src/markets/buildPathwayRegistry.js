/* ---------------------------------------------------------------------------
   Build pathways, joined to markets.

   The same shape as congestionRegistry: markets declare, this file collects, and
   consumers ask by market id. Static rather than self-registering, because a
   pathway is small — a few kilobytes of text — and because the cross-market
   comparison the section makes its argument from needs more than one at a time.

   ABSENCE IS THE NORMAL CASE and must stay comfortable. Two of fifteen markets
   have a pathway. A market without one renders no section rather than an empty
   one, and `hasBuildPathway` is how a renderer asks.
   --------------------------------------------------------------------------- */
import { WA_BUILD_PATHWAY } from './wa/buildPathway.js';
import { FI_BUILD_PATHWAY } from './fi/buildPathway.js';

const PATHWAYS = [
  WA_BUILD_PATHWAY,
  FI_BUILD_PATHWAY,
];

const byMarket = new Map(PATHWAYS.map(p => [p.marketId, p]));

export const allBuildPathways = () => [...PATHWAYS];

export function buildPathwayFor(marketId){
  return byMarket.get(marketId) || null;
}

export const hasBuildPathway = (marketId) => byMarket.has(marketId);

/** Market ids with a pathway, for the cross-market note the section renders. */
export const pathwayMarketIds = () => PATHWAYS.map(p => p.marketId);
