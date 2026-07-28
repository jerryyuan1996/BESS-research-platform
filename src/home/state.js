/* ---------------------------------------------------------------------------
   Home-page local state.

   `exitYear` and `wfMarket` were fields on the prototype's single global `state`.
   They are page-local: no market and no shared component needs them.

   wfMarket defaulted to the literal 'pl' in the prototype. That is preserved as
   the preferred default, but it now falls back to the first registered market if
   Poland is ever removed — a scalability fix, not a behaviour change, since with
   the current registry the default is still Poland.
   --------------------------------------------------------------------------- */
import { markets, byId } from '../markets/registry.js';

const PREFERRED_WATERFALL_MARKET = 'pl';

export const homeState = {
  exitYear: 5,                       // 5 | 7 | 10
  wfMarket: byId(PREFERRED_WATERFALL_MARKET) ? PREFERRED_WATERFALL_MARKET : markets[0]?.manifest.id,
};

/** Resolves the waterfall market, self-healing if the id is no longer registered. */
export function waterfallMarket(){
  return byId(homeState.wfMarket) || markets[0] || null;
}
