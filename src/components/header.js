/* ---------------------------------------------------------------------------
   Application header.

   The prototype had two headers with the same markup but different metadata and
   a different third control (cockpit: exit year; WA: forecast COD year). This is
   one header that takes its content as data, plus the two shared controls.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { app, requestRender, toggleLang } from '../app/state.js';
import { cycleTheme, THEME_LABELS } from '../app/theme.js';

/** Language toggle. Shows the language you would switch *to*, as the prototype did. */
export function langButton(){
  return h('button', { class: 'btn', onclick: () => { toggleLang(); requestRender(); } },
    app.lang === 'en' ? '中文' : 'English');
}

/** Theme cycler: Auto → Light → Dark. */
export function themeButton(){
  return h('button', { class: 'btn', onclick: () => { cycleTheme(); requestRender(); } },
    L(['Theme', '主题']) + ': ' + L(THEME_LABELS[app.theme]));
}

/**
 * @param {object} cfg
 * @param {string}   [cfg.kicker]    small uppercase line above the title
 * @param {*}        cfg.title
 * @param {*}        [cfg.sub]
 * @param {Node[]}   [cfg.meta]      metadata row children
 * @param {Node[]}   [cfg.controls]  page-specific controls, after lang + theme
 * @param {boolean}  [cfg.hero]      cockpit spacing variant
 */
export function renderHeader(cfg){
  const left = h('div', {});
  if (cfg.kicker) left.append(h('div', { class: 'kicker' }, cfg.kicker));
  left.append(h('h1', {}, L(cfg.title)));
  if (cfg.sub) left.append(h('div', { class: 'sub' }, L(cfg.sub)));
  if (cfg.meta && cfg.meta.length) left.append(h('div', { class: 'hdr-meta' }, cfg.meta));

  const ctrls = h('div', { class: 'ctrls' }, langButton(), themeButton(), ...(cfg.controls || []));
  return h('div', { class: 'hdr' + (cfg.hero ? ' hero' : '') }, left, ctrls);
}

