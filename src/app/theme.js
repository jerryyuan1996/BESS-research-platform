/* ---------------------------------------------------------------------------
   Theme handling — auto / light / dark.

   Verbatim behaviour from the prototype's applyTheme(): 'auto' removes the
   data-theme attribute so the prefers-color-scheme media query in tokens.css
   takes over; 'light' and 'dark' pin it. Market modules must not implement their
   own theme system (brief section 15) — they inherit this one.
   --------------------------------------------------------------------------- */
import { app } from './state.js';
import { LS } from '../utils/storage.js';

export const THEMES = ['auto', 'light', 'dark'];

export const THEME_LABELS = {
  auto: ['Auto', '自动'],
  light: ['Light', '浅色'],
  dark: ['Dark', '深色'],
};

export function applyTheme(){
  const r = document.documentElement;
  if (app.theme === 'auto') r.removeAttribute('data-theme');
  else r.setAttribute('data-theme', app.theme);
}

/** Cycles auto → light → dark → auto, matching the prototype's single button. */
export function cycleTheme(){
  app.theme = app.theme === 'auto' ? 'light' : app.theme === 'light' ? 'dark' : 'auto';
  LS.set('hub_theme', app.theme);
  applyTheme();
}
