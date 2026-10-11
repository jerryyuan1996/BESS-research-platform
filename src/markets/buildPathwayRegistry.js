/* ---------------------------------------------------------------------------
   Build pathways, joined to markets.

   The same shape as congestionRegistry: markets declare, this file collects, and
   consumers ask by market id. Static rather than self-registering, because a
   pathway is small — a few kilobytes of text — and because the cross-market
   comparison the section makes its argument from needs more than one at a time.

   NOT FOR A MARKET'S OWN SECTION. A dashboard imports its own pathway from its
   own folder, so the text ships in the chunk of the one market that shows it.
   This registry is for the tests, and for any consumer that needs more than
   one market at once.

   ABSENCE IS THE NORMAL CASE and must stay comfortable. Four of fifteen markets
   have a pathway. A market without one renders no section rather than an empty
   one, and `hasBuildPathway` is how a renderer asks.
   --------------------------------------------------------------------------- */
import { WA_BUILD_PATHWAY } from './wa/buildPathway.js';
import { FI_BUILD_PATHWAY } from './fi/buildPathway.js';
import { GB_BUILD_PATHWAY } from './gb/buildPathway.js';
import { RO_BUILD_PATHWAY } from './ro/buildPathway.js';

const PATHWAYS = [
  WA_BUILD_PATHWAY,
  FI_BUILD_PATHWAY,
  GB_BUILD_PATHWAY,
  RO_BUILD_PATHWAY,
];

const byMarket = new Map(PATHWAYS.map(p => [p.marketId, p]));

export const allBuildPathways = () => [...PATHWAYS];

export function buildPathwayFor(marketId){
  return byMarket.get(marketId) || null;
}

export const hasBuildPathway = (marketId) => byMarket.has(marketId);

/** Market ids with a pathway, for the cross-market note the section renders. */
export const pathwayMarketIds = () => PATHWAYS.map(p => p.marketId);
