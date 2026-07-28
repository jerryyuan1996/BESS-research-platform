/* ---------------------------------------------------------------------------
   TEMPLATE — market-local state.

   Anything that is only meaningful inside this market's dashboard lives here:
   selected scenario, selected year, lab inputs, and so on. Language and theme do
   NOT belong here — they are application state (src/app/state.js) and a market
   must not implement its own (brief section 15).

   `lang` and `theme` are exposed as read-only getters so market code can read
   them without importing app state directly.
   --------------------------------------------------------------------------- */
import { app } from '../../app/state.js';
import { LS } from '../../utils/storage.js';

export const state = {
  tab: 'home',

  // Example of a persisted market-local preference:
  // scenarioYear: LS.get('xx_year') || '2028-29',

  get lang(){ return app.lang; },
  get theme(){ return app.theme; },
};

export { LS };
