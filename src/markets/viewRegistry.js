/* ---------------------------------------------------------------------------
   Market views, joined to markets.

   The view store lives outside src/, in view/, because judgement and the
   methodology it is measured against are kept behind different walls (see
   view/schema/view.mjs). It is imported HERE, at build time, so the bytes a
   reader receives are the bytes the confidentiality scan saw and there is no
   fetch, no flash and no second copy.

   Static imports, one per market that has been graded. A market with a view
   file that holds only triggers is not listed until it has grades to show.

   NOT FOR A PAGE. This module holds every graded market whole, so a page that
   imported it would carry all of them. The home page reads the projection in
   viewBoard.js; a market's own tabs read caseRegistry.js, which that market's
   dashboard fills. What imports this file is the test suite, the scripts, and
   viewBoardData.js, which the build replaces.

   ABSENCE IS THE NORMAL CASE. Four of fifteen markets have a view. A market
   without one renders no Investment Case tab rather than an empty one.

   TRIGGERS ARE WIDER THAN GRADES. Seven more markets have a view file that
   holds only triggers, migrated out of prose before anybody graded the market.
   The home page's calendar lists those too, so every market file is imported
   here and `allTriggers` reads all of them. `allViews`, `viewFor` and `hasView`
   still mean GRADED, which is what every other caller asks.
   --------------------------------------------------------------------------- */
import wa from '../../view/markets/wa.json' with { type: 'json' };
import fi from '../../view/markets/fi.json' with { type: 'json' };
import gb from '../../view/markets/gb.json' with { type: 'json' };
import ro from '../../view/markets/ro.json' with { type: 'json' };
import de from '../../view/markets/de.json' with { type: 'json' };

import caiso from '../../view/markets/caiso.json' with { type: 'json' };
import ie from '../../view/markets/ie.json' with { type: 'json' };
import it from '../../view/markets/it.json' with { type: 'json' };
import jpTokyo from '../../view/markets/jp_tokyo.json' with { type: 'json' };
import nem from '../../view/markets/nem.json' with { type: 'json' };
import pjm from '../../view/markets/pjm.json' with { type: 'json' };

const VIEWS = [wa, fi, gb, ro, de];

/* Every market file in view/markets, graded or not. tests/view.test.js checks
   this list against the directory, so a new file cannot be left out of the
   calendar by forgetting to import it. */
const FILES = [...VIEWS, caiso, ie, it, jpTokyo, nem, pjm];

const byMarket = new Map(VIEWS.map(v => [v.marketId, v]));

export const allViews = () => [...VIEWS];

export function viewFor(marketId){
  return byMarket.get(marketId) || null;
}

export const hasView = (marketId) => byMarket.has(marketId);

export const viewMarketIds = () => VIEWS.map(v => v.marketId);

/** Every market file in the view store, graded or not. For the board projection. */
export const viewFiles = () => [...FILES];

/** Market ids with a file in the view store, graded or not. */
export const viewFileMarketIds = () => FILES.map(v => v.marketId);

/** Every trigger in the view store, from every market file. */
export const allTriggers = () => FILES.flatMap(v => v.triggers || []);
