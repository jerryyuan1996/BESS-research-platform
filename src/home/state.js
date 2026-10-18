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

/* Nothing here may call into the registry at module scope. The market modules
   import the navigation component, which imports this file to preselect a market
   in the Lab — so a registry lookup during evaluation closes the cycle and throws
   before the app starts. Both accessors below resolve lazily instead, which they
   had to do anyway to self-heal when a market is deregistered. */
export const homeState = {
  exitYear: 5,                       // 5 | 7 | 10
  wfMarket: PREFERRED_WATERFALL_MARKET,

  /* ---- Investment Lab ----------------------------------------------------
     Overrides are kept PER MARKET, keyed by market id, so switching markets
     does not silently carry a Polish capex assumption into Japan. Each entry is
     { [dotted economics path]: number }; an absent key means "use the seed",
     which is why nothing is pre-populated here. */
  labMarket: null,                   // null → the market the page defaults to
  labStrategy: null,                 // null → that market's base strategy
  labLevered: false,                 // capital structure: unlevered | project debt
  labInputs: {},                     // { [marketId]: { [path]: number } }
  labHurdle: null,                   // user-set unlevered hurdle; no fund hurdle assumed
  labProjectEvidence: {},            // project document references, per market, local session only
  labDebt: {},                       // { [priced convention]: number }
  labOpenBasis: null,                // which field's evidence drawer is expanded
  fxAsOf: null,                      // active governed translation snapshot
};

/** Resolves the waterfall market, self-healing if the id is no longer registered. */
export function waterfallMarket(){
  return byId(homeState.wfMarket) || markets[0] || null;
}

/** Resolves the Lab market, self-healing if the id is no longer registered. */
export function labMarket(list){
  const pool = (list && list.length) ? list : markets;
  return pool.find(m => m.manifest.id === homeState.labMarket) || pool[0] || null;
}

/** This market's overrides, created on first write rather than up front. */
export function labOverrides(marketId){
  if (!homeState.labInputs[marketId]) homeState.labInputs[marketId] = {};
  return homeState.labInputs[marketId];
}
