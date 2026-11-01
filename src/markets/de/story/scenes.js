/* Germany — configuration over the shared isometric kit.
 * All words are signed-off content; controls change local teaching state only.
 * The grid is a connection/cost layer, never a merchant income arrow. */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { fillPair } from '../../../experience/story/contract.js';
import { isoStage } from '../../../experience/story/kit/symbols.js';
import { toggleGroup } from '../../../experience/story/kit/controls.js';
import { s } from '../../../experience/story/kit/svg.js';
import { story } from '../story.js';
import { eventDetails } from '../sections/story.js';
import { GRID, HISTORY_SHOTS, HISTORY_IDS } from './geo.js';
import { spreadTollChart } from './chart.js';

const allShots = [story.opening, ...story.chapters.flatMap(c => c.shots)];
const byId = id => allShots.find(s => s.id === id);
const vocab = start => story.vocabulary.find(p => p[0].startsWith(start)) || ['', ''];
const words = (pair, values) => L(fillPair(pair, values));
const scene = (...nodes) => h('div', { class: 'k-scene de-scene' }, ...nodes);
const replace = (host, node) => host.replaceChildren(node);
const labelBlock = (shot, values) => shot.labels.all ? h('p', { class: 'de-scene-labels' }, words(shot.labels.all, values)) : null;
const controlGroup = (shot, values, indices, onChange, value = 0) => toggleGroup({ label: fillPair(shot.question, values), value,
  options: indices.map((i, value) => ({ value, label: fillPair(shot.controls[i], values) })), onChange });

function grid(shot, values, { renewable = true, battery = true, plant = true, booster = false, futureLink = false, batteryFuture = false, cost = false, cutaway = false, time = 'day', highlight = false, energy = false } = {}) {
  const items = [GRID.ground,
    ...(plant ? [{ symbol: 'plant', at: GRID.plant }] : []),
    ...GRID.pylons.map(at => ({ symbol: 'pylon', at })),
    { symbol: 'substation', at: GRID.substation }, { symbol: 'city', at: GRID.city },
    ...GRID.homes.map(at => ({ symbol: renewable ? 'homeSolar' : 'home', at })),
    ...(renewable ? [...GRID.wind.map(at => ({ symbol: 'wind', at })), { symbol: 'solarFarm', at: GRID.solar, opts: { rows: 2 } }] : []),
    ...(battery ? [{ symbol: 'battery', at: GRID.battery, opts: { count: energy ? 4 : 3, highlight, future: batteryFuture }, lift: cutaway ? 2 : 0 },
      { symbol: 'pcs', at: [12, 10], lift: cutaway ? 3.5 : 0 }, { symbol: 'transformer', at: [14, 11], lift: cutaway ? 3.5 : 0 },
      ...(cutaway ? [{ symbol: 'controls', at: [8, 10], lift: 5 }] : [])] : []),
    ...(booster ? [{ symbol: 'battery', at: GRID.booster, opts: { count: 2 } }] : [])];
  const stage = isoStage({ ...GRID.view, title: fillPair(shot.question, values), items, time,
    wires: [...GRID.wires, ...(futureLink ? [{ from: [4, 5], to: [12, 7], cls: 'k-link-missing' }] : [])] });
  if (cost) stage.append(s('path', { class: 'de-cost', d: 'M310,130 L470,130 L470,215 L310,215 Z' }));
  if (energy) stage.append(s('path', { class: 'k-link-missing', d: 'M310,205 L410,205 L410,268 L310,268 Z' }));
  return stage;
}

function simple(shot, { values }) {
  const holder = h('div');
  const redraw = state => { replace(holder, grid(shot, values, { highlight: state === 1 })); holder.setAttribute('data-focus', String(state)); };
  redraw(0);
  return scene(controlGroup(shot, values, [0, 1], redraw), holder, labelBlock(shot, values));
}

function historical(shot, { values }) {
  let current = shot.id, preset = 0;
  const holder = h('div'), evidence = h('div', { class: 'de-history-current' }), details = h('div'), controls = h('div');
  const draw = () => {
    const selected = byId(current), node = HISTORY_SHOTS.indexOf(current);
    const options = { battery: node >= 3, renewable: node >= 3 || (node === 1 && preset === 1),
      plant: !(node === 2 && preset === 1), booster: node === 3, futureLink: node === 3, cost: node === 3 || node === 5, batteryFuture: node === 4 && preset === 1,
      time: node === 3 ? 'dusk' : 'day', highlight: preset === 1 };
    replace(holder, grid(selected, values, options));
    holder.setAttribute('data-history', HISTORY_IDS[node]);
    if (node === 3 || node === 5) holder.setAttribute('data-grid-layer', 'cost');
    if (node === 4 && preset === 1) holder.setAttribute('class', 'de-scenario'); else holder.setAttribute('class', '');
    evidence.replaceChildren(...[h('p', {}, words(selected.copy, values)), labelBlock(selected, values)].filter(Boolean));
    replace(controls, controlGroup(selected, values, [0, 1], v => { preset = v; draw(); }, preset));
    replace(details, eventDetails(selected, values, { event: ['Event and source', '事件与来源'], meaning: ['Why it matters', '投资含义'] }));
  };
  const nav = toggleGroup({ label: fillPair(shot.question, values), value: current,
    options: HISTORY_SHOTS.map(id => ({ value: id, label: byId(id).title })),
    onChange: id => { current = id; preset = 0; draw(); } });
  nav.setAttribute('class', 'de-history-nav');
  draw();
  return scene(nav, controls, holder, evidence, details);
}

function tradingWindow(shot, { values }) {
  const holder = h('div');
  const draw = k => { replace(holder, grid(shot, values, { time: ['day', 'dusk', 'night'][k], highlight: true })); holder.setAttribute('data-preset', String(k)); };
  draw(0);
  return scene(controlGroup(shot, values, [0, 1, 2], draw), holder, labelBlock(shot, values));
}

function duration(shot, { values, duration: design }) {
  const holder = h('div'), readout = h('p', { class: 'k-readout', 'aria-live': 'polite' });
  const draw = k => {
    const hours = k ? design.longer : design.preferred;
    replace(holder, grid(shot, values, { cutaway: true, highlight: !k, energy: Boolean(k), renewable: false }));
    holder.setAttribute('data-hours', String(hours));
    const selected = design.cells?.find(c => c.hours === hours);
    const local = { ...values, merchantValue: selected?.label ?? values.merchantValue };
    readout.replaceChildren(words(shot.labels.all, local));
  };
  draw(0);
  return scene(controlGroup(shot, values, [0, 1], draw), holder, readout);
}

function spread(shot, { values, chart }) {
  let focus = 'merchant';
  const holder = h('div');
  const draw = () => replace(holder, spreadTollChart(shot, { values, model: chart, chartShot: byId('de-09'), vocab, focus }));
  const controls = controlGroup(shot, values, [0, 1], k => { focus = k ? 'toll' : 'merchant'; draw(); });
  draw();
  return scene(controls, holder, h('p', { class: 'k-readout' }, words(shot.extra.controlText, values)),
    h('details', {}, h('summary', {}, words(shot.controls[2], values)),
      h('p', {}, L(vocab('Hindsight price opportunity, before costs'))),
      h('p', {}, L(vocab('Annual model fee; separate scale'))),
      h('p', {}, L(vocab('Local delivery date')))));
}

function term(shot, { values, chart }) {
  let tail = false;
  const holder = h('div'), contract = h('div');
  const draw = () => { replace(holder, spreadTollChart(shot, { values, model: chart, chartShot: byId('de-09'), vocab, focus: 'toll', tail })); contract.setAttribute('data-term', tail ? 'after' : 'during'); };
  const controls = controlGroup(shot, values, [0, 1], k => { tail = Boolean(k); draw(); });
  contract.append(grid(shot, values, { cutaway: true, renewable: false }));
  draw();
  return scene(controls, holder, contract, h('details', {}, h('summary', {}, words(shot.controls[2], values)), labelBlock(shot, values)));
}

function handoff(shot, { values }) {
  const root = scene(grid(shot, values, { time: 'dusk', highlight: true }));
  const en = shot.labels.all[0].split(' · '), zh = shot.labels.all[1].split(' · ');
  const risks = toggleGroup({ label: fillPair(shot.question, values), value: 0,
    options: en.map((text, i) => ({ value: i, label: [text, zh[i]] })),
    onChange: i => {
      const destinations = ['execution downside', 'revenue downside', 'bankable revenue'][i].split(' ');
      root.setAttribute('data-destination', destinations.join(' '));
      root.closest?.('article')?.querySelectorAll('.ix-story-exits a').forEach(a =>
        a.classList.toggle('de-exit-focus', destinations.includes(a.getAttribute('href').slice(1))));
    } });
  risks.setAttribute('class', 'k-controls de-risk-cards');
  root.append(risks);
  root.append(h('button', { type: 'button', class: 'ix-button ix-outline', onclick: ev => ev.target.closest?.('dialog')?.querySelector('button[data-chapter=opening]')?.click() }, words(shot.controls[4], values)));
  return root;
}

export const scenes = {
  thumbnail: (shot, { values }) => grid(shot, values, { highlight: true, renewable: false }),
  'liquid-market': simple,
  'market-history': historical, 'renewable-history': historical, 'fleet-history': historical,
  'congestion-cost': historical, 'trading-window': tradingWindow, 'capacity-route': historical,
  duration, 'spread-toll': spread, 'toll-term': term, 'network-fees': historical, handoff,
};
