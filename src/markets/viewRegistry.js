/* ---------------------------------------------------------------------------
   Market views, joined to markets.

   The view store lives outside src/, in view/, because judgement and the
   methodology it is measured against are kept behind different walls (see
   view/schema/view.mjs). It is imported HERE, at build time, so the bytes a
   reader receives are the bytes the confidentiality scan saw and there is no
   fetch, no flash and no second copy.

   Static imports, one per market that has been graded. A market with a view
   file that holds only triggers is not listed until it has grades to show.

   ABSENCE IS THE NORMAL CASE. Four of fifteen markets have a view. A market
   without one renders no Investment Case tab rather than an empty one.
   --------------------------------------------------------------------------- */
import wa from '../../view/markets/wa.json' with { type: 'json' };
import fi from '../../view/markets/fi.json' with { type: 'json' };
import gb from '../../view/markets/gb.json' with { type: 'json' };
import ro from '../../view/markets/ro.json' with { type: 'json' };

const VIEWS = [wa, fi, gb, ro];

const byMarket = new Map(VIEWS.map(v => [v.marketId, v]));

export const allViews = () => [...VIEWS];

export function viewFor(marketId){
  return byMarket.get(marketId) || null;
}

export const hasView = (marketId) => byMarket.has(marketId);

export const viewMarketIds = () => VIEWS.map(v => v.marketId);
