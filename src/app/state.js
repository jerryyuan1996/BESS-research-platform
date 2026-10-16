/* ---------------------------------------------------------------------------
   Shared application state.

   Owns only what is genuinely global: language, theme, the investor lens, and
   the re-render hook.
   Everything else is page-local (home cockpit) or market-local (each market
   module keeps its own state object) so that adding a market never widens this
   file.

   In the prototype each of the six programs kept its own `state` object and its
   own localStorage keys (hub_lang/hub_theme, wa_lang/wa_theme, ...). Because the
   dashboards ran in isolated srcdoc iframes, switching language on the cockpit
   did not switch it inside a dashboard. There is one language and one theme now.
   The hub_* keys are retained so an existing visitor keeps their preference.
   --------------------------------------------------------------------------- */
import { LS } from '../utils/storage.js';

/** The investor a first visit reads as. The briefing's own default, repeated here to keep the method layer out of the first load. */
export const DEFAULT_LENS = 'infraFund';

export const app = {
  lang: LS.get('hub_lang') === 'zh' ? 'zh' : 'en',   // 'en' | 'zh'
  theme: ['auto', 'light', 'dark'].includes(LS.get('hub_theme')) ? LS.get('hub_theme') : 'auto',
  /* The investor whose verdicts the home page leads with, or null for all
     four. Kept as the stored string: the archetype ids live in the method
     layer, which this file must not pull into the first load, so the board
     resolves it and treats anything it does not recognise as null.

     A first visit reads as the infrastructure fund (guided-experience plan,
     decision 1). "All four" is a choice, so it is stored as one: 'all'. */
  lens: storedLens(LS.get('hub_lens')),
};

function storedLens(value){
  if (value === 'all') return null;
  return value || DEFAULT_LENS;
}

/* The active renderer, installed by app.js on boot. Components call
   requestRender() after mutating state; they never reach for the router or the
   page function themselves. */
let renderer = () => {};

export function setRenderer(fn){ renderer = fn; }

/* Re-render the current page in place.

   Deliberately does NOT touch scroll position. The prototype's call sites differ:
   language and theme toggles re-render and let the browser keep scrollY, tab
   switches follow with scrollTo(0, 0), and the exit-year / waterfall selectors
   capture and restore scrollY explicitly. Each call site keeps its own behaviour. */
export function requestRender(){ renderer(); }

export function setLang(lang){
  app.lang = lang === 'zh' ? 'zh' : 'en';
  LS.set('hub_lang', app.lang);
}

/** Sets the investor lens; null shows all four investors, and is remembered as a choice. */
export function setLens(lens){
  app.lens = lens || null;
  LS.set('hub_lens', app.lens || 'all');
}

/* "Since your last visit": two marks in this browser (briefing/since.js says
   what they mean). Raw numbers here; the briefing works out the rest. */
export function readSeen(){
  return {
    at: Number(LS.get('hub_seen_at')) || null,
    prev: Number(LS.get('hub_seen_prev')) || null,
    first: LS.get('hub_seen_first') === '1',
  };
}

export function writeSeen({ at, prev, firstVisit }){
  if (at) LS.set('hub_seen_at', String(at));
  if (prev) LS.set('hub_seen_prev', String(prev)); else LS.del('hub_seen_prev');
  if (firstVisit) LS.set('hub_seen_first', '1'); else LS.del('hub_seen_first');
}

export function toggleLang(){
  setLang(app.lang === 'en' ? 'zh' : 'en');
}
