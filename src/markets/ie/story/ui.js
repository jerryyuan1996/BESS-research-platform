/* Ireland's scene composition helpers. The shared shell, marker, kit and
   contract stay untouched; only local drawing state lives here. */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { fillPair } from '../../../experience/story/contract.js';
import { s, uid } from '../../../experience/story/kit/svg.js';
import { story } from '../story.js';

export { h, L, s };
export const fill = (node, ...kids) => node.replaceChildren(...kids.flat(Infinity).filter((k) => k !== null && k !== undefined && k !== false));
export const text = (pair, values = {}) => L(fillPair(pair, values));
export const words = (shot, values) => ({
  title: fillPair(shot.question, values),
  copy: fillPair(shot.copy, values),
  label: (key) => fillPair(shot.labels?.[key] || ['', ''], values),
  control: (i) => fillPair(shot.controls?.[i] || ['', ''], values),
});
export const vocab = (key) => story.text[key];
export const scene = (...kids) => h('div', { class: 'k-scene ie-scene' }, ...kids);
export const note = (pair, values = {}) => h('p', { class: 'ie-note' }, text(pair, values));
export const readout = (...kids) => h('p', { class: 'k-readout', 'aria-live': 'polite' }, ...kids);

/** Split a signed catalogue entry into [en, zh] pairs on its own separator. */
export function parts(key) {
  const pair = vocab(key);
  const en = pair[0].split('; ');
  const zh = pair[1].split('；');
  if (en.length !== zh.length) throw new Error(`Bilingual catalogue mismatch: ${key}`);
  return en.map((part, i) => [part, zh[i]]);
}

export const exampleTag = () => h('span', { class: 'k-tag' }, L(parts('Diagram / history legend')[4]));

export function diagram(title, width = 600, height = 280, ...kids) {
  const id = uid('ie-drawing');
  return s('svg', { class: 'k-stage k-diagram', viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-labelledby': id },
    s('title', { id }, L(title)), ...kids);
}

/* Teaching state is local: it never reaches the row, the URL or the model. */
const memory = new Map();
const KEY = 'ie-story-ui-2026-11-02';
export function stateFor(id, defaults) {
  let saved = memory.get(id);
  if (!saved) { try { saved = JSON.parse(globalThis.sessionStorage?.getItem(KEY) || '{}')[id]; } catch { /* first visit */ } }
  const state = { ...defaults };
  for (const k of Object.keys(defaults)) if (typeof saved?.[k] === typeof defaults[k]) state[k] = saved[k];
  const save = () => {
    memory.set(id, { ...state });
    try {
      const all = JSON.parse(globalThis.sessionStorage?.getItem(KEY) || '{}');
      all[id] = state;
      globalThis.sessionStorage?.setItem(KEY, JSON.stringify(all));
    } catch { /* storage unavailable */ }
  };
  return { state, save };
}

/** A text alternative beside every drawing: the same facts, not a second claim. */
export const textAlternative = (pair, values) => h('p', { class: 'ie-alt' }, text(pair, values));
