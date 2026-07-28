/* ---------------------------------------------------------------------------
   WA market-local state.

   The prototype kept lang, theme, tab and every WA control on one global `state`
   object. Language and theme are now application state (src/app/state.js) — a
   market must not own them (brief section 15) — and everything genuinely local to
   WA stays here.

   `lang` and `theme` are exposed as getters delegating to app state. That is what
   lets the migrated section code read `state.lang` unmodified: the two places that
   do (the lab's snapshot writer and the JSON export) work exactly as before, while
   the value now comes from the one shared source.

   Lazily-initialised fields (lab, rcmScn, optStrat, labSource, labEvidence, cmpId,
   rcmCustom, brcpReal, brcpWfTo, aug, bridge) are left undefined here for the same
   reason the prototype did: each section owns its own defaults and installs them on
   first render, e.g. `if (!state.lab) state.lab = { ...SEED.lab }`.
   --------------------------------------------------------------------------- */
import { app, requestRender } from '../../app/state.js';
import { LS } from '../../utils/storage.js';

export const state = {
  tab: 'home',

  // Persisted with the prototype's key, so an existing visitor keeps their choice.
  codYear: LS.get('wa_cod') || '2028-29',

  get lang(){ return app.lang; },
  get theme(){ return app.theme; },
};

/* Section code calls render() after mutating state, exactly as in the prototype.
   It now re-renders the current route through the app shell. */
export const render = requestRender;

export { LS };
