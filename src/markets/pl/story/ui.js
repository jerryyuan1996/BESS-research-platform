/* Poland's scene composition helpers. The shell, the kit, the navigator and the
   marker belong to the shared layer; this file only composes them, and no
   control here can reach the market row or the investment case. */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { fillPair, MARKERS } from '../../../experience/story/contract.js';
import { toggleGroup } from '../../../experience/story/kit/controls.js';
import { s, uid } from '../../../experience/story/kit/svg.js';
import { story } from '../story.js';
import { storySources, sourceValues } from '../storyBindings.js';

export { h, L, s, toggleGroup };
export const text = (pair, values = {}) => L(fillPair(pair, values));
export const fill = (node, ...kids) => node.replaceChildren(...kids.flat(Infinity).filter(k => k !== null && k !== undefined && k !== false));
export const scene = (...kids) => h('div', { class: 'k-scene' }, ...kids);
export const note = (pair, values = {}) => h('p', { class: 'k-readout' }, text(pair, values));
export const readout = (...kids) => h('div', { class: 'k-readout', 'aria-live': 'polite' }, ...kids);
export const caption = (pair, values = {}) => h('p', { class: 'k-readout' }, text(pair, values));
export const shared = (key) => story.text[key];

/** A bilingual catalogue of legend items, split into aligned parts. */
export function parts(key){
  const entry = shared(key);
  const en = entry[0].split(' · '), zh = entry[1].split(' · ');
  if (en.length !== zh.length) throw Error('Bilingual catalogue mismatch: ' + key);
  return en.map((line, i) => [line, zh[i]]);
}

export const tags = () => parts('Tags');
export const exampleTag = () => h('span', { class: 'k-tag' }, L(tags()[0]));

/** A titled 2D drawing. `label` is the accessible name, in both languages. */
export function diagram(label, width = 600, height = 280, ...kids){
  const id = uid('pl-drawing');
  return s('svg', { class: 'k-stage k-diagram', viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-labelledby': id }, s('title', { id }, L(label)), ...kids);
}

/** The chart frame: same primitives, its own accessible name. */
export function chartFrame(label, width, height, ...kids){
  const id = uid('pl-chart');
  return s('svg', { class: 'k-chart', viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-labelledby': id, 'data-auction-chart': 'true' }, s('title', { id }, L(label)), ...kids);
}

const memory = new Map();
const KEY = 'pl-story-ui-2026-11-01';
/** Local teaching state only: remembered per shot, never written to the case. */
export function stateFor(id, defaults){
  let saved = memory.get(id);
  if (!saved) try { saved = JSON.parse(globalThis.sessionStorage?.getItem(KEY) || '{}')[id]; } catch { /* private mode */ }
  const state = { ...defaults };
  for (const key of Object.keys(defaults)) if (typeof saved?.[key] === typeof defaults[key]) state[key] = saved[key];
  const save = () => {
    memory.set(id, { ...state });
    try {
      const all = JSON.parse(globalThis.sessionStorage?.getItem(KEY) || '{}');
      all[id] = state;
      globalThis.sessionStorage?.setItem(KEY, JSON.stringify(all));
    } catch { /* private mode */ }
  };
  return { state, save };
}

export function updateMarker(root, marker){
  const pill = root.closest?.('article')?.querySelector('.ix-story-marker .ix-marker');
  if (pill && MARKERS[marker.level]){
    pill.className = 'ix-marker ix-marker-' + marker.level;
    pill.textContent = L(MARKERS[marker.level]);
  }
}

/* The shared source drawer: one select, the record's own locator, its own
   check date and the definition the shot gives it. */
export function evidence(shot, values, { definition, ids } = {}){
  const labels = parts('Evidence drawer');
  const sources = storySources();
  const choices = [...new Set(ids || (shot.claims || []).flatMap(c => story.claims[c]?.sources || []))]
    .map(id => ({ id, ...sources[id] }))
    .filter(source => source.url);
  if (!choices.length) return null;
  const select = h('select', { 'aria-label': L(labels[0]), style: 'width:100%;max-width:100%;' }, choices.map(source => h('option', { value: source.id }, source.title)));
  const panel = h('div');
  const draw = () => {
    const source = choices.find(c => c.id === select.value) || choices[0];
    const local = { ...values, ...sourceValues(source) };
    fill(panel, h('dl', { class: 'k-lane-terms', style: 'overflow-wrap:anywhere;' },
      h('dt', {}, L(labels[0])), h('dd', {}, h('a', { href: source.url, target: '_blank', rel: 'noopener noreferrer' }, source.title)),
      h('dt', {}, L(labels[1])), h('dd', {}, source.locator || source.id),
      h('dt', {}, text(labels[2], local)), h('dd', {}, ''),
      h('dt', {}, L(labels[3])), h('dd', {}, text(definition || shot.copy, local))));
    panel.setAttribute('data-source', source.id);
  };
  const { state, save } = stateFor('evidence-' + shot.id + '-' + choices.map(c => c.id).join('-'), { source: choices[0].id, open: false });
  select.value = choices.some(c => c.id === state.source) ? state.source : choices[0].id;
  select.onchange = () => { state.source = select.value; save(); draw(); };
  draw();
  const details = h('details', { class: 'ix-story-sources', ...(state.open ? { open: '' } : {}) },
    h('summary', {}, L(['Sources', '来源'])), select, panel);
  details.addEventListener('toggle', () => { state.open = details.open; save(); });
  return details;
}

/* ---- small drawing parts ------------------------------------------------ */

/** A labelled horizontal bar: the drawing's unit bar, never an axis. */
export function bar({ x, y, w, hgt, tone = 'solid', label, value, values }){
  return s('g', { 'data-tone': tone },
    s('rect', { x, y, width: w, height: hgt, rx: 2, fill: tone === 'muted' ? '#d9ded2' : 'var(--ix-green,#224e40)', 'fill-opacity': tone === 'muted' ? 1 : 0.82 }),
    label ? s('text', { class: 'k-label', x: x + 8, y: y + hgt / 2 + 4 }, text(label, values)) : null,
    value ? s('text', { class: 'k-label', x: x + w - 6, y: y + hgt / 2 + 4, 'text-anchor': 'end' }, value) : null);
}

/** A keyed legend list under a drawing. */
export const keyList = (keys, shot, values) => h('ul', { class: 'k-key' },
  keys.map(key => h('li', {}, text(shot.labels?.[key] || ['', ''], values))));

/** A figure readout with its label, in the shell's own type. */
export const figureLine = (pair, value) => h('p', { class: 'k-readout' }, text(pair), value ? ' ' + value : '');
