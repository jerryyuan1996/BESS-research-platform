import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { app, toggleLang, requestRender } from '../app/state.js';
import { navigate } from '../app/router.js';

export function link(href, label, className = '', attrs = {}) {
  return h('a', { href, class: className, ...attrs, onclick: event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (href.startsWith('#')) return;
    event.preventDefault(); navigate(href); window.scrollTo({ top: 0, behavior: 'instant' });
  } }, L(label));
}
export function eyebrow(text) { return h('div', { class: 'ix-eyebrow' }, L(text)); }
export function sectionTitle(kicker, title, sub = null) {
  return h('div', { class: 'ix-section-heading' }, eyebrow(kicker), h('h2', {}, L(title)), sub ? h('p', {}, L(sub)) : null);
}
export function metric(label, value, note = null) {
  return h('div', { class: 'ix-metric' }, h('span', {}, L(label)), h('strong', {}, value), note ? h('small', {}, L(note)) : null);
}
export function siteHeader(active = 'home') {
  const marketPath = active === 'market' ? window.location.pathname.split('/').slice(0, 3).join('/') : '/markets/italy';
  const nav = h('nav', { class: 'ix-nav', 'aria-label': L(['Main navigation', '主导航']) },
    link('/', ['Investment brief', '投资简报'], active === 'home' ? 'is-active' : '', active === 'home' ? { 'aria-current': 'page' } : {}),
    link('/returns', ['Global markets', '全球市场'], active === 'returns' ? 'is-active' : '', active === 'returns' ? { 'aria-current': 'page' } : {}),
    link(marketPath, ['Market intelligence', '市场详情'], active === 'market' ? 'is-active' : '', active === 'market' ? { 'aria-current': 'page' } : {}),
    /* Shown in the menu only where the header button below is hidden. */
    link('/news', ['Industry news', '行业新闻'], 'ix-nav-news' + (active === 'news' ? ' is-active' : ''), active === 'news' ? { 'aria-current': 'page' } : {}));
  const toggle = h('button', { class: 'ix-menu-toggle', type: 'button', 'aria-label': L(['Toggle navigation', '展开导航']), 'aria-expanded': 'false', onclick: () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open);
  } }, '☰');
  return h('header', { class: 'ix-header' },
    link('#ix-main', ['Skip to content', '跳到正文'], 'ix-skip'),
    h('div', { class: 'ix-header-inner' }, link('/', 'GLOBAL BESS', 'ix-brand'),
      nav, h('div', { class: 'ix-header-actions' },
        h('button', { class: 'ix-language', type: 'button', 'aria-label': L(['Switch to Chinese', '切换到英文']), onclick: () => { toggleLang(); requestRender(); } }, app.lang === 'zh' ? 'EN' : '中文'),
        link('/news', ['Industry news ↗', '行业新闻 ↗'], 'ix-button ix-small' + (active === 'news' ? ' is-current' : ''), active === 'news' ? { 'aria-current': 'page' } : {}), toggle)));
}
export function siteFooter() {
  return h('footer', { class: 'ix-footer' }, h('div', { class: 'ix-container ix-footer-inner' },
    h('div', {}, link('/', 'GLOBAL BESS', 'ix-brand'), h('p', {}, L(['Intelligence for the energy transition.', '为能源转型，寻找值得投资的机会。']))),
    h('nav', { 'aria-label': L(['Research resources', '研究资源']) },
      link('/returns', ['Global comparison', '全球比较']), link('/data', ['Data & methodology', '数据与方法']), link('/news', ['Industry news', '行业新闻'])),
    h('span', { class: 'ix-mono' }, 'RESEARCH / 2026')));
}
