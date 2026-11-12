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
import { navigate } from '../../app/router.js';

/* A research control repaints its excerpts, not the market page around them.
   Connected nodes alone are insufficient during navigation: the current URL
   must still be their market page, never a full research-tab route. */
const excerpts = new Map();
let tab = 'home', pendingTab = null;
function liveExcerpts(){
  const path = typeof window === 'undefined' ? '' : window.location.pathname.replace(/\/$/, '');
  for (const [el, entry] of excerpts) {
    if (!el.isConnected || path !== entry.basePath) excerpts.delete(el);
  }
  return [...excerpts.values()];
}

export function registerResearchExcerpt(el, paint, basePath){
  excerpts.set(el, { paint, basePath });
  // The caller assembles cards off-DOM and connects them in the same turn.
  // Prune after that assembly, not while its siblings are still being built.
  queueMicrotask(liveExcerpts);
}

export const state = {
  get tab(){ return tab; },
  set tab(value){
    tab = value;
    pendingTab = liveExcerpts().length ? value : null;
  },

  // Persisted with the prototype's key, so an existing visitor keeps their choice.
  codYear: LS.get('wa_cod') || '2028-29',

  get lang(){ return app.lang; },
  get theme(){ return app.theme; },
};

/* Existing dashboard controls retain their app-shell render. A story bridge
   inside an excerpt instead opens the real, deep-linkable research tab. */
export function render(){
  const live = liveExcerpts();
  const nextTab = pendingTab;
  pendingTab = null;
  if (live.length){
    if (nextTab != null){ navigate(live[0].basePath + '/' + nextTab); return; }
    for (const entry of live) entry.paint();
    return;
  }
  requestRender();
}

export { LS };
