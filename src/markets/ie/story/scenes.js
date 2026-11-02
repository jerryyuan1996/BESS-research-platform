/* Ireland — market-local composition over the shared kit (WP-07).

   Every scene reads its words from the signed script and its figures from
   storyBindings. Controls change local teaching state only: no control writes
   the row, the URL, a case input or an investment result. Observed things are
   solid, plans and scenarios dashed, teaching figures carry the Example tag. */
import { h, L, s } from './ui.js';
import { fill, note, readout, exampleTag, diagram, stateFor, parts, vocab } from './ui.js';
import { isoStage } from '../../../experience/story/kit/symbols.js';
import { toggleGroup } from '../../../experience/story/kit/controls.js';
import { fillPair } from '../../../experience/story/contract.js';
import { story } from '../story.js';
import { ISLAND } from './geo.js';
import { crmChart } from './chart.js';

const W = (pair, values) => L(fillPair(pair, values));
const scene = (...kids) => h('div', { class: 'k-scene ie-scene' }, ...kids);
const controls = (shot, values, indexes, onChange, value = 0) => toggleGroup({
  label: fillPair(shot.question, values),
  value,
  options: indexes.map((i, index) => ({ value: index, label: fillPair(shot.controls[i], values) })),
  onChange,
});

/** A disclosure listing the sources behind a shot's claims. */
const sources = (shot) => {
  const ids = [...new Set((shot.claims || []).flatMap((c) => story.claims[c]?.sources || []))];
  if (!ids.length) return null;
  return h('details', { class: 'ie-evidence' },
    h('summary', {}, L(parts('Common navigation')[3])),
    h('ul', {}, ids.map((id) => {
      const source = story.sources[id];
      return h('li', {}, h('a', { href: source.url, target: '_blank', rel: 'noopener noreferrer' }, source.title),
        h('p', { class: 'ie-locator' }, source.locator));
    })));
};

/* ---- the schematic island ------------------------------------------------ */

/* The place names live on ie-01; every map reuses them rather than retyping. */
const placeLabels = () => [story.opening, ...story.chapters.flatMap((c) => c.shots)].find((s) => s.id === 'ie-01').labels;

function islandMap(shot, values, { system = true, planned = true, focus = 'system' } = {}) {
  const id = `ie-map-${shot.id}`;
  const names = shot.labels?.ireland ? shot.labels : placeLabels();
  const label = (key, [x, y]) => s('text', { class: 'ie-map-label', x, y, 'text-anchor': 'middle' }, W(names[key], values));
  return s('svg', { class: 'ie-map', viewBox: '0 0 600 420', role: 'img', 'aria-labelledby': id, 'data-focus': focus },
    s('title', { id }, W(shot.question, values)),
    s('path', { class: 'ie-land', d: ISLAND.ireland }),
    s('path', { class: 'ie-land', d: ISLAND.northernIreland }),
    s('path', { class: 'ie-land ie-land-far', d: ISLAND.britain }),
    s('path', { class: 'ie-land ie-land-far', d: ISLAND.france }),
    system ? s('rect', { class: 'ie-boundary', x: 168, y: 132, width: 186, height: 232, rx: 26 }) : null,
    ...ISLAND.dc.map(([a, b]) => s('line', { class: 'ie-dc', x1: a[0], y1: a[1], x2: b[0], y2: b[1] })),
    planned ? s('line', { class: 'ie-dc ie-planned', x1: ISLAND.celtic[0][0], y1: ISLAND.celtic[0][1], x2: ISLAND.celtic[1][0], y2: ISLAND.celtic[1][1] }) : null,
    label('ireland', ISLAND.labels.ireland),
    label('northernIreland', ISLAND.labels.northernIreland),
    label('greatBritain', ISLAND.labels.greatBritain),
    label('france', ISLAND.labels.france));
}

/** A small version of the same drawing for the opening and the close. */
export function islandThumbnail() {
  const id = `ie-thumb-${Math.random().toString(36).slice(2, 8)}`;
  return s('svg', { class: 'ie-thumb', viewBox: '150 120 300 260', role: 'img', 'aria-labelledby': id },
    s('title', { id }, L(['Schematic all-island system', '全岛系统示意'])),
    s('path', { class: 'ie-land', d: ISLAND.ireland }),
    s('path', { class: 'ie-land', d: ISLAND.northernIreland }),
    s('rect', { class: 'ie-boundary', x: 168, y: 132, width: 186, height: 232, rx: 26 }),
    ...ISLAND.dc.map(([a, b]) => s('line', { class: 'ie-dc', x1: a[0], y1: a[1], x2: b[0], y2: b[1] })),
    s('line', { class: 'ie-dc ie-planned', x1: ISLAND.celtic[0][0], y1: ISLAND.celtic[0][1], x2: ISLAND.celtic[1][0], y2: ISLAND.celtic[1][1] }));
}

/* ---- ie-01 --------------------------------------------------------------- */

function island(shot, { values }) {
  const { state, save } = stateFor(shot.id, { view: 'system' });
  const holder = h('div');
  const draw = () => {
    fill(holder, islandMap(shot, values, { system: state.view === 'system', planned: true, focus: state.view }));
    holder.setAttribute('data-view', state.view);
  };
  draw();
  return scene(controls(shot, values, [0, 1], (i) => { state.view = i ? 'links' : 'system'; save(); draw(); }),
    holder,
    h('ul', { class: 'k-key' },
      h('li', {}, W(shot.labels.system, values)),
      h('li', {}, W(shot.labels.dc, values)),
      h('li', {}, W(shot.labels.planned, values))),
    sources(shot));
}

/* ---- ie-02 --------------------------------------------------------------- */

function history(shot, { values }) {
  const { state, save } = stateFor(shot.id, { node: 0 });
  const nodes = values.historyNodes.filter((n) => n.id === 'H-IE-01' || n.id === 'H-IE-03');
  const panel = h('div');
  const draw = () => {
    const node = nodes[state.node];
    fill(panel,
      islandMap(shot, values, { system: true, planned: false, focus: state.node ? 'capacity' : 'wholesale' }),
      h('ol', { class: 'ix-story-timeline ie-history' }, nodes.map((n) => h('li', { class: 'ix-node ix-node-event', 'data-current': String(n.id === node.id) },
        h('p', { class: 'ix-node-title' }, h('span', { class: 'ix-node-when' }, W(n.date, values)), ' ', W(n.label, values))))),
      state.node ? readout(W(shot.labels.ahead, values)) : null,
      h('details', { class: 'ie-evidence' },
        h('summary', {}, W(shot.controls[2], values)),
        h('ul', {}, node.sources.map((id) => h('li', {},
          h('a', { href: story.sources[id].url, target: '_blank', rel: 'noopener noreferrer' }, story.sources[id].title),
          h('p', { class: 'ie-locator' }, story.sources[id].locator))))));
    panel.setAttribute('data-node', node.id);
  };
  draw();
  return scene(controls(shot, values, [0, 1], (i) => { state.node = i; save(); draw(); }), panel);
}

/* ---- ie-03 --------------------------------------------------------------- */

function snsp(shot, { values }) {
  const { state, save } = stateFor(shot.id, { step: 2, view: 'limit' });
  const holder = h('div');
  const steps = values.snspSteps;
  const draw = () => {
    fill(holder, diagram(W(shot.question, values), 600, 210,
      ...steps.map((step, i) => s('g', { 'data-step': i, opacity: i <= state.step ? 1 : 0.45 },
        s('rect', { class: 'ie-step', x: 60 + i * 170, y: 176 - (i + 1) * 44, width: 130, height: (i + 1) * 44 }),
        s('text', { class: 'ie-step-label', x: 125 + i * 170, y: 164 - (i + 1) * 44 }, step.limit),
        s('text', { class: 'ie-step-date', x: 125 + i * 170, y: 194 }, W(step.date, values)))),
      s('line', { class: 'ie-axis', x1: 40, x2: 570, y1: 176, y2: 176 }),
      state.view === 'needs' ? s('text', { class: 'ie-note-text', x: 60, y: 30 }, W(shot.labels.fastReserve, values) + ' · ' + W(shot.labels.inertia, values)) : null));
    holder.setAttribute('data-view', state.view);
    holder.setAttribute('data-step', String(state.step));
  };
  draw();
  return scene(controls(shot, values, [0, 1], (i) => {
    if (i === 0) state.step = state.step + 1 < steps.length ? state.step + 1 : 0;
    else state.view = state.view === 'limit' ? 'needs' : 'limit';
    save(); draw();
  }), holder,
  h('ul', { class: 'k-key' }, [shot.labels.limit, shot.labels.fastReserve, shot.labels.inertia].map((p) => h('li', {}, W(p, values)))),
  sources(shot));
}

/* ---- ie-04 --------------------------------------------------------------- */

function services(shot, { values }) {
  const { state, save } = stateFor(shot.id, { item: 0 });
  const purposes = parts('Service purposes');
  const panel = h('div');
  const draw = () => {
    const ladder = diagram(W(shot.question, values), 600, 220,
      values.serviceCodes.map((code, i) => s('g', { 'data-service': code, opacity: state.item === i ? 1 : 0.55 },
        s('rect', { class: 'ie-rung', x: 40, y: 18 + i * 34, width: 520 - i * 64, height: 22, rx: 4 }),
        s('text', { class: 'ie-rung-label', x: 52, y: 34 + i * 34 }, code))),
      s('text', { class: 'ie-note-text', x: 40, y: 208 }, W(shot.labels.tariff, values)));
    fill(panel, ladder,
      state.item < 5 ? h('p', { class: 'ie-purpose' }, W(purposes[Math.min(3, state.item)], values)) : null,
      h('div', { class: 'ie-contract-cards' },
        h('p', { class: 'ie-card', 'data-current': String(state.item === 5) }, W(shot.labels.contract, values)),
        h('p', { class: 'ie-card', 'data-current': String(state.item === 6) }, W(shot.labels.tariff, values))));
    panel.setAttribute('data-item', String(state.item));
  };
  draw();
  return scene(controls(shot, values, [0, 1, 2, 3, 4, 5, 6], (i) => { state.item = i; save(); draw(); }), panel, sources(shot));
}

/* ---- ie-05 --------------------------------------------------------------- */

function longstop(shot, { values }) {
  const { state, save } = stateFor(shot.id, { view: 'tariffs' });
  const holder = h('div');
  const draw = () => {
    const tariff = state.view !== 'auction';
    fill(holder, diagram(W(shot.question, values), 600, 230,
      s('line', { class: 'ie-axis', x1: 40, x2: 570, y1: 150, y2: 150 }),
      s('line', { class: 'ie-tariff', x1: 60, x2: 360, y1: 150, y2: 150, opacity: tariff ? 1 : 0.35 }),
      s('line', { class: 'ie-marker', x1: 360, x2: 360, y1: 116, y2: 186 }),
      s('text', { class: 'ie-marker-label', x: 366, y: 112 }, W(values.longStop, values)),
      s('rect', { class: 'ie-band ie-planned-band', x: 300, y: 186, width: 200, height: 26, rx: 4 }),
      s('text', { class: 'ie-note-text', x: 306, y: 204 }, W(shot.labels.newAuction, values)),
      s('text', { class: 'ie-note-text', x: 430, y: 138 }, W(shot.labels.backstop, values))),
      h('p', { class: 'ie-note' }, W(shot.labels.ends, values)),
      h('p', { class: 'ie-note' }, W(shot.labels.noExtension, values)),
      sources(shot));
    holder.setAttribute('data-view', state.view);
  };
  draw();
  return scene(controls(shot, values, [0, 1, 2], (i) => { state.view = ['tariffs', 'auction', 'after'][i]; save(); draw(); }), holder);
}

/* ---- ie-06 --------------------------------------------------------------- */

function crm(shot, { values }) {
  const { state, save } = stateFor(shot.id, { mode: 'price' });
  const holder = h('div');
  const draw = () => {
    fill(holder, crmChart(shot, { values, mode: state.mode }));
    holder.setAttribute('data-mode', state.mode);
  };
  draw();
  return scene(controls(shot, values, [0, 1, 2], (i) => { state.mode = ['price', 'credit', 'awarded'][i]; save(); draw(); }), holder);
}

/* ---- ie-07 --------------------------------------------------------------- */

function seconds(shot, { values }) {
  const { state, save } = stateFor(shot.id, { preset: 'fast' });
  const holder = h('div');
  const hours = Number(values.playDuration) || 0;
  const draw = () => {
    const fast = state.preset === 'fast';
    fill(holder, isoStage({
      title: fillPair(shot.question, values), sky: false, viewBox: [600, 250], origin: [200, 70],
      items: [
        { symbol: 'ground', at: [0, 0], opts: { w: 16, d: 11 } },
        { symbol: 'battery', at: [4, 4], opts: { count: 3 } },
        { symbol: 'pcs', at: [8, 4] }, { symbol: 'transformer', at: [10, 6] },
        { symbol: 'city', at: [12, 9] },
      ],
      wires: [{ from: [7.4, 5], to: [10, 6] }],
    }),
    diagram(W(shot.question, values), 600, 120,
      s('rect', { class: 'ie-soc', x: 30, y: 28, width: 540 * (fast ? 0.92 : 0.35), height: 24, rx: 4 }),
      s('rect', { class: 'ie-power', x: 30, y: 70, width: fast ? 90 : 320, height: 16, rx: 4 }),
      s('text', { class: 'ie-note-text', x: 30, y: 108 }, W(shot.labels[fast ? 'fast' : 'evening'], values)),
      s('text', { class: 'ie-note-text', x: 330, y: 108 }, W(shot.labels.once, values))),
    readout(exampleTag(), ' · ', String(hours), ' h'));
    holder.setAttribute('data-preset', state.preset);
  };
  draw();
  return scene(controls(shot, values, [0, 1, 2], (i) => { state.preset = i === 1 ? 'evening' : 'fast'; save(); draw(); }), holder, sources(shot));
}

/* ---- ie-08 --------------------------------------------------------------- */

function duration(shot, { values, row }) {
  const { state, save } = stateFor(shot.id, { size: 'play' });
  const response = row?.market?.comparison?.durationResponse || {};
  const bandHours = response.hours || [];
  const factors = response.capacityDerating || [];
  const presets = values.teachingHours.filter((hh) => [4, 6, 8].includes(hh));
  const current = Number(values.playDuration);
  const alternatives = presets.filter((hh) => hh !== current);
  const holder = h('div');
  const draw = () => {
    const hours = state.size === 'play' || !alternatives.length
      ? current
      : alternatives[state.size === 'shorter' ? 0 : alternatives.length - 1];
    const index = bandHours.indexOf(hours);
    const factor = index < 0 ? null : factors[index];
    const power = Number(values.powerMW) || 0;
    const credited = factor === null ? null : power * factor;
    const max = Math.max(power, credited || 0) || 1;
    fill(holder,
      diagram(W(shot.question, values), 600, 210,
        s('text', { class: 'ie-note-text', x: 30, y: 22 }, W(shot.labels.built, values)),
        s('rect', { class: 'ie-built', x: 30, y: 32, width: 520 * power / max, height: 24, rx: 4 }),
        s('text', { class: 'ie-note-text', x: 30, y: 94 }, W(shot.labels.credited, values)),
        credited === null ? null : s('rect', { class: 'ie-credited', x: 30, y: 104, width: 520 * credited / max, height: 24, rx: 4 }),
        s('text', { class: 'ie-note-text', x: 30, y: 166 }, W(shot.labels.capital, values)),
        s('rect', { class: 'ie-capital', x: 30, y: 176, width: 520 * Math.min(1, hours / 8), height: 16, rx: 4 })),
      readout(exampleTag(), ' · ', values.powerMW, ' MW · ', credited === null ? '—' : credited.toFixed(1), ' MW · ', String(hours), ' h'),
      h('dl', { class: 'ie-measures' },
        h('dt', {}, W(vocab('Investment IRR basis'), values)), h('dd', {}, values.holdIrr || '—'),
        h('dt', {}, W(vocab('Capital basis'), values)), h('dd', {}, values.capitalRequired || '—'),
        h('dt', {}, W(vocab('Value basis'), values)), h('dd', {}, W(values.valuePerMW || ['—', '—'], values))));
    holder.setAttribute('data-hours', String(hours));
  };
  draw();
  return scene(controls(shot, values, [0, 1, 2], (i) => { state.size = ['play', 'shorter', 'longer'][i]; save(); draw(); }), holder, sources(shot));
}

/* ---- ie-09 --------------------------------------------------------------- */

function contract(shot, { values }) {
  const { state, save } = stateFor(shot.id, { period: 'during' });
  const holder = h('div');
  const tenor = Number(values.securedTenor) || 0;
  const width = Math.min(400, 40 * Math.max(1, tenor));
  const draw = () => {
    const during = state.period !== 'after';
    fill(holder, diagram(W(shot.question, values), 600, 220,
      s('rect', { class: 'ie-floor', x: 40, y: 120, width, height: 34, rx: 4, opacity: during ? 1 : 0.35 }),
      s('line', { class: 'ie-strike', x1: 40, x2: 560, y1: 78, y2: 78 }),
      state.period === 'scarcity' ? s('path', { class: 'ie-spike', d: `M${40 + width * 0.6},120 L${40 + width * 0.6},36 L${40 + width * 0.72},120` }) : null,
      s('rect', { class: 'ie-merchant', x: 40 + width, y: 120, width: Math.max(40, 520 - width), height: 34, rx: 4 }),
      s('text', { class: 'ie-note-text', x: 40, y: 174 }, W(shot.labels.capacity, values)),
      s('text', { class: 'ie-note-text', x: 40, y: 62 }, W(shot.labels.strike, values)),
      s('text', { class: 'ie-note-text', x: 40 + width + 8, y: 174 }, W(shot.labels.merchant, values)),
      state.period === 'scarcity' ? s('text', { class: 'ie-note-text', x: 40, y: 204 }, W(shot.labels.payback, values)) : null),
      readout(W(shot.labels.unverified, values)));
    holder.setAttribute('data-period', state.period);
  };
  draw();
  return scene(controls(shot, values, [0, 1, 2], (i) => { state.period = ['during', 'scarcity', 'after'][i]; save(); draw(); }), holder, sources(shot));
}

/* ---- ie-10 --------------------------------------------------------------- */

function payers(shot, { values }) {
  const { state, save } = stateFor(shot.id, { path: 'capacity' });
  const holder = h('div');
  const paths = [
    { key: 'capacity', heading: shot.labels.capacity, unit: shot.labels.capacityUnit, className: 'ie-path ie-path-capacity' },
    { key: 'energy', heading: shot.labels.energy, unit: shot.labels.energyUnit, className: 'ie-path ie-path-energy' },
    { key: 'services', heading: shot.labels.services, unit: null, className: 'ie-path ie-path-services ie-assumed' },
  ];
  const draw = () => {
    fill(holder, ...paths.map((p) => h('section', { class: p.className, 'data-path': p.key, ...(p.key === state.path ? {} : { hidden: '' }) },
      h('h5', {}, W(p.heading, values)),
      p.unit ? h('p', {}, W(p.unit, values)) : null)));
    holder.setAttribute('data-path', state.path);
  };
  draw();
  return scene(controls(shot, values, [0, 1, 2], (i) => { state.path = ['capacity', 'energy', 'services'][i]; save(); draw(); }), holder, sources(shot));
}

/* ---- ie-11 --------------------------------------------------------------- */

function followExit(shot, anchor) {
  document.querySelector(`[data-shot="${shot.id}"] .ix-story-exits a[href="#${anchor}"]`)?.click();
}

function factors(shot, { values }) {
  const { state, save } = stateFor(shot.id, { factor: 0 });
  const destinations = ['bankable', 'bankable', 'revenue', 'execution'];
  const bodies = ['Redesign factor', 'De-rating factor', 'Competition factor', 'Delivery factor'];
  const panel = h('div');
  const draw = () => {
    fill(panel, h('div', { class: 'ie-factors' }, shot.controls.map((_, i) => h('article', { class: 'ie-factor', 'data-current': String(i === state.factor) },
      h('h5', {}, W(shot.controls[i], values)),
      h('p', {}, W(vocab(bodies[i]), values)),
      i === 0 ? h('p', { class: 'ie-tag-line' }, W(shot.labels.proposed, values)) : null,
      h('a', { href: `#${destinations[i]}`, onclick: (event) => { event.preventDefault(); followExit(shot, destinations[i]); } },
        W(shot.controls[i], values))))));
    panel.setAttribute('data-factor', String(state.factor));
  };
  draw();
  return scene(toggleGroup({
    label: fillPair(shot.question, values),
    value: state.factor,
    options: shot.controls.map((pair, i) => ({ value: i, label: fillPair(pair, values) })),
    onChange: (i) => { state.factor = i; save(); draw(); },
  }), panel, sources(shot));
}

/* ---- ie-12 and the opening ----------------------------------------------- */

function overview(shot, { values }) {
  return scene(h('div', { class: 'ie-overview' }, islandThumbnail()), note(shot.meaning, values));
}

function thumbnail(shot, { values }) {
  return scene(h('div', { class: 'ie-opening' }, islandThumbnail(),
    h('p', { class: 'ie-note' }, W(story.text['All-island system'], values))));
}

export const scenes = {
  'ie-thumbnail': thumbnail,
  'ie-island': island,
  'ie-history': history,
  'ie-snsp': snsp,
  'ie-services': services,
  'ie-longstop': longstop,
  'ie-crm-chart': crm,
  'ie-seconds': seconds,
  'ie-duration': duration,
  'ie-contract': contract,
  'ie-payers': payers,
  'ie-factors': factors,
  'ie-overview': overview,
};
