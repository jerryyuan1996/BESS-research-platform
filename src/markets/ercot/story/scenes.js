/* ERCOT story scenes: market-local compositions over the unchanged story kit.
   Teaching state is local to each scene; no control reaches the case. Every
   figure drawn here reads a fixed-vintage record, a live case field or the
   local teaching configuration, which is always tagged Example. No toll
   price, fee band, range or proxy is drawn anywhere. */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { fillPair } from '../../../experience/story/contract.js';
import { isoStage } from '../../../experience/story/kit/symbols.js';
import { toggleGroup } from '../../../experience/story/kit/controls.js';
import { s } from '../../../experience/story/kit/svg.js';
import { ERCOT_STORY_RECORDS as R } from '../data/storyEvidence.js';
import { designCells, historyWhen } from '../storyBindings.js';
import { ERCOT_TEACHING } from './teaching.js';
import { TX } from './geo.js';
import { reserveChart } from './chart.js';
import { story } from '../story.js';

/* ercot-01's approved labels, reused by the opening thumbnail and ercot-12. */
const MAP_LABELS = story.chapters[0].shots[0].labels;
/* The six history nodes live once, on ercot-02; ercot-04 shows two of them. */
const NODES = story.chapters[1].shots[0].extra.historyNodes;

/* replaceChildren prints null as text; skip empty slots. */
const fill = (el, ...kids) => el.replaceChildren(...kids.flat(Infinity).filter(k => k != null && k !== false));
const T = {
  example: ['Example', '示例'],
  schematic: ['Schematic', '示意'],
  transfer: ['Transfer capability, not flow', '为输送能力，而非实际潮流'],
  ties: n => [`${n} ties`, `${n}条`],
  total: ['All ties', '全部联络线'],
  regulates: ['Regulates ERCOT and its wholesale market', '监管ERCOT及其批发市场'],
  noFootprint: ['Texas outline; ERCOT serves most, not all, of it', '得州轮廓；ERCOT覆盖其大部分地区，而非全部'],
  agreement: ['Request to signed agreement, average', '从申请到签署协议的平均时长'],
  cohort: y => [`ERCOT requests since ${y}; not time to operation`, `${y}年以来的ERCOT申请；并非投运所需时间`],
  longer: ['Longer on average', '平均更长'],
  waiting: ['Waiting behind upgrade work', '排队等待电网升级'],
  winter: ['A winter night, February 2021', '2021年2月的冬夜'],
  closedNode: ['Closed branch', '已关闭的分支'],
  noStatement: ['No statement for this field', '此项无内容'],
  recent: ['Scarcity pricing active, 2025', '2025年稀缺定价生效时长'],
  added: ['Added to the average real-time price, 2025', '2025年对实时均价的加价'],
  rare: ['Scarcity flashes: rare', '稀缺时刻：罕见'],
  more: ['Scarcity flashes: more often', '稀缺时刻：更频繁'],
  gaugeHigh: ['Reserves gauge: high', '备用水平：充裕'],
  gaugeLow: ['Reserves gauge: lower', '备用水平：偏低'],
  energy: ['Battery energy', '电池电量'],
  beyond: ['Beyond this battery at full power', '超出本电池满功率可提供的范围'],
  rule: ['Duration rule', '时长要求'],
  morning: ['Morning ramp', '早间爬坡'],
  evening: ['Evening ramp', '晚间爬坡'],
  solar: ['Solar at midday', '中午光伏'],
  noOverlap: ['The same MW cannot be sold twice', '同样的兆瓦不能卖两次'],
  battery: ['Battery', '电池'],
  settlement: ['ERCOT settlement', 'ERCOT结算'],
  ercot: ['ERCOT', 'ERCOT'],
  loads: ['Load-serving entities', '售电主体'],
  counterparty: ['Counterparty', '交易对手'],
  owner: ['Owner', '业主'],
  marketRevenue: ['Market revenue', '市场收入'],
  modelRoute: ["The model's assumed route, not a signed contract", '模型假设的路径，并非已签合同'],
  years: n => [`${n} years`, `${n}年`],
  expiry: ['Expiry', '到期'],
  unscaled: ['Unscaled: no revenue level is shown', '不设刻度：不显示任何收入水平'],
  hours: n => [`${n}h`, `${n}小时`],
  current: ['Current play', '当前方案'],
  bankable: ['The Bankable case owns the detail', '详细数据见可融资方案'],
};
const W = (pair, values) => L(fillPair(pair, values || {}));
const note = (pair, values) => h('p', { class: 'ercot-note' }, W(pair, values));
const readouts = entries => h('dl', { class: 'ercot-readouts' }, entries.flatMap(([name, value]) => [h('dt', {}, L(name)), h('dd', {}, Array.isArray(value) ? L(value) : String(value ?? '—'))]));
const options = (pairs, values) => pairs.map((p, value) => ({ value, label: fillPair(p, values || {}) }));
const label = (x, y, text, attrs = {}) => s('text', { x, y, class: 'ercot-label', ...attrs }, text);

function interactive(shot, values, draw, { controls = shot.controls, initial = 0, cls = '' } = {}) {
  let mode = initial;
  const host = h('div', { class: `k-scene ercot-scene${cls ? ` ${cls}` : ''}` }), body = h('div', {});
  const paint = () => { host.setAttribute('data-state', String(mode)); fill(body, draw(mode)); };
  host.append(toggleGroup({ label: fillPair(shot.question, values), value: mode, options: options(controls, values), onChange: v => { mode = v; paint(); } }), body);
  paint();
  return host;
}

/* A small station on the shared kit; `future` batteries are dashed. */
function station({ title, time = 'day', batteries = 1, future = 0, solar = true, plant = false, homes = 0, labels = [], dark = false } = {}) {
  const stage = isoStage({ title, desc: T.schematic, time, sky: false, viewBox: [640, 300], origin: [300, 60], items: [
    { symbol: 'ground', at: [0, 0] },
    ...(solar ? [{ symbol: 'solarFarm', at: [1, 2] }] : []),
    ...(plant ? [{ symbol: 'plant', at: [1, 8] }] : []),
    { symbol: 'substation', at: [8, 3] },
    ...Array.from({ length: homes }, (_, i) => ({ symbol: 'home', at: [4 + (i % 3) * 2.2, 9 + Math.floor(i / 3) * 2.2] })),
    ...Array.from({ length: batteries }, (_, i) => ({ symbol: 'battery', at: [12 + (i % 3) * 2.6, 2 + Math.floor(i / 3) * 2.6] })),
    ...Array.from({ length: future }, (_, i) => ({ symbol: 'battery', at: [12 + (i % 3) * 2.6, 8 + Math.floor(i / 3) * 2.6], opts: { future: true } })),
  ], wires: [[[4, 4], [8.6, 4]], [[9.6, 4], [12.6, 3.4]]], labels });
  /* An outage: the homes stay unlit (the kit lights windows at night). */
  if (dark) stage.querySelector('.k-lights')?.replaceChildren();
  return stage;
}

/* ---- the Texas schematic: ercot-00, ercot-01, ercot-12 -------------------- */
function texasMap(values, { view = 'grid', small = false, title } = {}) {
  const N = TX.nodes, lb = MAP_LABELS, [w, hgt] = TX.viewBox;
  const svg = s('svg', { viewBox: `0 0 ${w} ${hgt}`, role: 'img', 'aria-label': title || W(lb.grid, values), class: `ercot-map${small ? ' ercot-map-small' : ''}`, 'data-view': view },
    s('path', { d: TX.outline, class: 'ercot-tx', 'data-kind': 'texas-outline' }),
    ...TX.links.map(([a, b]) => s('line', { x1: N[a][0], y1: N[a][1], x2: N[b][0], y2: N[b][1], class: 'ercot-net', 'data-kind': 'schematic' })),
    ...TX.ties.map(t => s('line', { x1: N[t.hub][0], y1: N[t.hub][1], x2: t.at[0], y2: t.at[1], class: 'ercot-net', 'data-kind': 'schematic' })),
    ...Object.values(N).map(([x, y]) => s('circle', { cx: x, cy: y, r: small ? 6 : 4, class: 'ercot-hub' })),
    ...TX.ties.map(t => s('g', { class: `ercot-tie${view === 'ties' ? ' ercot-on' : ''}`, 'data-kind': 'dc-tie', 'data-group': t.group },
      s('line', { x1: t.at[0], y1: t.at[1], x2: t.out[0], y2: t.out[1] }),
      s('rect', { x: t.at[0] - 5, y: t.at[1] - 5, width: 10, height: 10 }))));
  if (small) return svg;
  const P = TX.labels;
  svg.append(
    label(P.texas[0], P.texas[1], W(lb.texas, values), { class: 'ercot-label ercot-strong' }),
    label(P.spp[0], P.spp[1], W(lb.spp, values), { class: 'ercot-label ercot-neighbour', 'text-anchor': 'middle' }),
    label(P.mexico[0], P.mexico[1], W(lb.mexico, values), { class: 'ercot-label ercot-neighbour', 'text-anchor': 'middle' }),
    label(P.grid[0], P.grid[1], W(lb.grid, values), { class: 'ercot-label', 'text-anchor': 'middle' }));
  if (view === 'rules') svg.append(s('g', { class: 'ercot-rules', 'data-kind': 'regulator' },
    s('rect', { x: P.puct[0] - 170, y: P.puct[1] - 18, width: 340, height: 26, rx: 3 }),
    label(P.puct[0], P.puct[1], W(lb.puct, values), { 'text-anchor': 'middle' })));
  return svg;
}

const legend = values => h('p', { class: 'ercot-legend' },
  h('span', { class: 'ercot-key ercot-key-net' }), W(MAP_LABELS.grid, values), ' ',
  h('span', { class: 'ercot-key ercot-key-tie' }), W(MAP_LABELS.tie, values));

/* ---- ercot-00 ------------------------------------------------------------- */
export function openingThumbnail() {
  return h('div', { class: 'ercot-opening' }, texasMap({}, { small: true, title: L(['Schematic: the ERCOT grid as an island inside the Texas outline, with short direct-current ties', '示意：得州轮廓内自成一体的ERCOT电网，以及几条短直流联络线']) }));
}

/* ---- ercot-01 ------------------------------------------------------------- */
function grid(shot, { values }) {
  const d = R.dcTies, mw = v => `${v.toLocaleString('en-US')} MW`;
  return interactive(shot, values, mode => h('div', {},
    texasMap(values, { view: ['grid', 'ties', 'rules'][mode] }),
    legend(values),
    mode === 0 ? note(T.noFootprint) : null,
    mode === 1 ? readouts([
      [shot.labels.spp, [`${T.ties(d.spp.count)[0]} · ${mw(d.spp.transferMW)}`, `${T.ties(d.spp.count)[1]} · ${mw(d.spp.transferMW)}`]],
      [shot.labels.mexico, [`${T.ties(d.mexico.count)[0]} · ${mw(d.mexico.transferMW)}`, `${T.ties(d.mexico.count)[1]} · ${mw(d.mexico.transferMW)}`]],
      [T.total, [`${T.ties(d.totalCount)[0]} · ${values.dcTieCapacity}`, `${T.ties(d.totalCount)[1]} · ${values.dcTieCapacity}`]],
    ]) : null,
    mode === 1 ? note(T.transfer) : null,
    mode === 2 ? note([`${shot.labels.puct[0]}: ${T.regulates[0]}`, `${shot.labels.puct[1]}：${T.regulates[1]}`]) : null));
}

/* ---- the shared timeline: ercot-02 and ercot-04 ---------------------------- */
function strip(values, shown, current) {
  const svg = s('svg', { viewBox: '0 0 640 74', role: 'img', 'aria-label': L(['Six moments, 2014 to 2025', '六个节点（2014—2025年）']), class: 'ercot-strip' },
    s('line', { x1: 30, x2: 610, y1: 28, y2: 28, class: 'ercot-axis' }));
  NODES.forEach((n, i) => {
    const x = 55 + i * 106, on = shown.includes(n.id), cur = n.id === current;
    svg.append(s('circle', { cx: x, cy: 28, r: cur ? 10 : on ? 7 : 4, class: `ercot-node${on ? '' : ' ercot-dim'}${n.style === 'closed' ? ' ercot-closed' : ''}`, 'data-node': n.id }),
      label(x, 62, (historyWhen(n.id)?.[0].match(/\d{4}/) || [''])[0], { 'text-anchor': 'middle', class: `ercot-label ercot-tick${on ? '' : ' ercot-dim'}` }));
  });
  return svg;
}
function nodeDetail(n, field, values) {
  const fields = ['constraint', 'choice', 'remains', 'effect'];
  return h('div', { class: `ercot-detail${n.style === 'closed' ? ' ercot-closed-card' : ''}`, 'data-node': n.id },
    h('h5', {}, L(historyWhen(n.id) || ['', '']), ' · ', W(n.title, values)),
    n.style === 'closed' ? h('p', { class: 'ercot-tag' }, L(T.closedNode)) : null,
    h('p', {}, n[fields[field]] ? W(n[fields[field]], values) : L(T.noStatement)));
}

/* The price lid and the scarcity curve; selecting a node changes one layer. */
function lid(shot, values, nodeId) {
  const lb = shot.labels;
  const svg = s('svg', { viewBox: '0 0 640 210', role: 'img', 'aria-label': W(lb.curve, values), class: 'ercot-lid', 'data-node': nodeId },
    s('line', { x1: 50, x2: 610, y1: 186, y2: 186, class: 'ercot-axis' }),
    label(50, 204, W(lb.short, values)), label(610, 204, W(lb.ample, values), { 'text-anchor': 'end' }),
    s('line', { x1: 50, x2: 610, y1: 56, y2: 56, class: 'ercot-cap', 'data-kind': 'offer-cap' }),
    label(610, 48, W(lb.cap, values), { 'text-anchor': 'end' }),
    s('path', { d: 'M60,56 C120,58 170,150 330,172 C430,182 520,184 600,184', class: 'ercot-curve', 'data-kind': 'schematic' }),
    label(20, 18, L(T.schematic), { class: 'ercot-label ercot-tagline' }));
  if (nodeId === 'H-ERCOT-03') svg.append(s('line', { x1: 50, x2: 610, y1: 26, y2: 26, class: 'ercot-cap ercot-old', 'data-kind': 'old-cap' }), label(610, 20, W(lb.oldCap, values), { 'text-anchor': 'end' }));
  if (nodeId === 'H-ERCOT-04') svg.append(s('g', { class: 'ercot-branch', 'data-kind': 'closed-branch' },
    s('rect', { x: 200, y: 84, width: 430, height: 32, rx: 3 }), s('path', { d: 'M208,93 l14,14 M222,93 l-14,14' }), label(232, 106, W(lb.closed, values))));
  svg.append(label(600, 150, W(nodeId === 'H-ERCOT-06' ? lb.curves : lb.curve, values), { 'text-anchor': 'end' }));
  return svg;
}

function history(shot, { values }) {
  const shown = ['H-ERCOT-01', 'H-ERCOT-03', 'H-ERCOT-04', 'H-ERCOT-06'];
  let node = 0, field = 0;
  const host = h('div', { class: 'k-scene ercot-scene ercot-history' }), body = h('div', {});
  const paint = () => {
    const n = NODES.find(x => x.id === shown[node]);
    host.setAttribute('data-node', n.id);
    fill(body, strip(values, shown, n.id), lid(shot, values, n.id), nodeDetail(n, field, values));
  };
  host.append(
    toggleGroup({ label: shot.controls[0], value: node, options: shown.map((id, value) => { const n = NODES.find(x => x.id === id), when = historyWhen(id); return { value, label: [`${when[0]} · ${n.title[0]}`, `${when[1]} · ${n.title[1]}`] }; }), onChange: v => { node = v; paint(); } }),
    toggleGroup({ label: fillPair(shot.question, values), value: field, options: options(shot.controls.slice(1, 5), values), onChange: v => { field = v; paint(); } }),
    body);
  paint();
  return host;
}

/* ---- ercot-03 ------------------------------------------------------------- */
function connection(shot, { values }) {
  const lb = shot.labels, c = R.connection;
  return interactive(shot, values, mode => mode === 0
    ? h('div', { 'data-panel': 'ercot' },
      station({ title: W(lb.connect, values), batteries: 3, labels: [{ at: [12, 1, 3], text: lb.connect, anchor: 'end', dx: -6 }, { at: [2, 3, 2], text: lb.curtailed }] }),
      readouts([[T.agreement, values.monthsToAgreement]]),
      note(T.cohort(c.requestCohortFromYear)), note(lb.schematic, values))
    : h('div', { 'data-panel': 'elsewhere' },
      station({ title: W(lb.upgrade, values), batteries: 0, future: 3, labels: [{ at: [12, 1, 3], text: lb.upgrade, anchor: 'end', dx: -6 }, { at: [12, 11, 0], text: T.waiting, future: true, anchor: 'end', dx: -6 }] }),
      readouts([[T.agreement, T.longer]]),
      note(lb.schematic, values)));
}

/* ---- ercot-04 ------------------------------------------------------------- */
function reserves(shot, { values }) {
  const lb = shot.labels, ids = ['H-ERCOT-02', 'H-ERCOT-05'];
  return interactive(shot, values, mode => {
    const n = NODES.find(x => x.id === ids[Math.min(mode, 1)]);
    const scene = mode === 0
      ? station({ title: W(lb.outages, values), time: 'night', batteries: 0, solar: false, plant: true, homes: 6, dark: true, labels: [{ at: [6, 10, 2], text: lb.outages }] })
      : mode === 1
        ? station({ title: W(lb.reserves, values), batteries: 3, future: 3, labels: [{ at: [13, 8, 3], text: lb.reserves }, { at: [13, 3, 3], text: lb.batteries }] })
        : station({ title: W(lb.reserves, values), batteries: 3, plant: true, labels: [{ at: [13, 3, 3], text: lb.batteries }, { at: [2, 9, 4], text: lb.gas }] });
    return h('div', {}, strip(values, ids, n.id), scene,
      mode === 0 ? note(T.winter) : null,
      mode < 2 ? nodeDetail(n, 3, values) : note(lb.schematic, values));
  });
}

/* ---- ercot-05: the fleet grows, not to scale ------------------------------ */
const SYMBOLS_BY_YEAR = [1, 2, 3, 5, 8];
function fleet(shot, { values }) {
  const lb = shot.labels;
  return interactive(shot, values, mode => h('div', {},
    station({ title: W(lb.installed, values), batteries: SYMBOLS_BY_YEAR[mode], labels: [{ at: [12, 1, 3], anchor: 'end', dx: -6, text: [`${lb.installed[0]} · ${shot.controls[mode][0]}`, `${lb.installed[1]} · ${shot.controls[mode][1]}年`] }] }),
    note([`${lb.schematic[0]} · ${lb.yearEnd[0]} ${shot.controls[mode][0]}`, `${lb.schematic[1]} · ${shot.controls[mode][1]}年${lb.yearEnd[1]}`]),
    reserveChart(shot, { values }, { panels: ['fleet'], records: R })), { initial: 4 });
}

/* ---- ercot-07: scarcity became rare --------------------------------------- */
function scarcity(shot, { values }) {
  const lb = shot.labels;
  return interactive(shot, values, mode => {
    const flashes = mode === 0 ? [0.62, 0.71] : [0.12, 0.3, 0.44, 0.52, 0.6, 0.66, 0.71, 0.78, 0.9];
    const svg = s('svg', { viewBox: '0 0 640 150', role: 'img', 'aria-label': L(mode === 0 ? T.rare : T.more), class: 'ercot-flashes', 'data-mode': mode === 0 ? 'recent' : 'example' },
      s('rect', { x: 40, y: 20, width: 24, height: 110, class: 'ercot-gauge' }),
      s('rect', { x: 40, y: mode === 0 ? 30 : 70, width: 24, height: mode === 0 ? 100 : 60, class: 'ercot-gauge-fill' }),
      label(52, 145, W(lb.reserves, values), { 'text-anchor': 'middle' }),
      s('line', { x1: 100, x2: 620, y1: 120, y2: 120, class: 'ercot-axis' }),
      ...flashes.map(f => s('path', { d: `M${100 + f * 520},120 l6,-70 l6,70`, class: mode === 0 ? 'ercot-flash' : 'ercot-flash ercot-example', 'data-kind': mode === 0 ? 'schematic' : 'example' })),
      label(100, 34, W(lb.scarcity, values)),
      mode === 1 ? label(620, 34, W(lb.example, values), { 'text-anchor': 'end', class: 'ercot-label ercot-tagline' }) : null);
    return h('div', {},
      station({ title: L(mode === 0 ? T.gaugeHigh : T.gaugeLow), time: 'dusk', batteries: 3 }),
      svg,
      mode === 0 ? readouts([[T.recent, values.ordcHours], [T.added, values.ordcAdder]]) : note(lb.example, values));
  });
}

/* ---- ercot-08: what the battery can sell ---------------------------------- */
function sell(shot, { values }) {
  const lb = shot.labels, hours = Number(values.playDuration), power = ERCOT_TEACHING.powerMW;
  const products = ['regUp', 'rrs', 'ecrs', 'nonSpin'];
  let mode = 0, product = 1;
  const host = h('div', { class: 'k-scene ercot-scene', 'data-example': 'true' }), body = h('div', {});
  const day = () => s('svg', { viewBox: '0 0 640 170', role: 'img', 'aria-label': `${W(lb.charge, values)} · ${W(lb.discharge, values)}`, class: 'ercot-day', 'data-kind': 'example' },
    s('line', { x1: 40, x2: 620, y1: 140, y2: 140, class: 'ercot-axis' }),
    s('path', { d: 'M40,140 C200,140 240,40 330,40 C420,40 460,140 620,140', class: 'ercot-solar', 'data-kind': 'example' }),
    s('rect', { x: 230, y: 100, width: 200, height: 30, class: 'ercot-charge' }), label(330, 120, W(lb.charge, values), { 'text-anchor': 'middle' }),
    s('rect', { x: 70, y: 100, width: 90, height: 30, class: 'ercot-discharge' }), label(115, 92, L(T.morning), { 'text-anchor': 'middle' }),
    s('rect', { x: 480, y: 100, width: 110, height: 30, class: 'ercot-discharge' }), label(535, 92, L(T.evening), { 'text-anchor': 'middle' }),
    label(330, 30, L(T.solar), { 'text-anchor': 'middle' }), label(620, 162, W(lb.discharge, values), { 'text-anchor': 'end' }),
    label(40, 162, L(T.example), { class: 'ercot-label ercot-tagline' }));
  const held = () => {
    const rule = R.reserveRules[products[product]]?.durationMinutes;
    const share = rule / (hours * 60), W0 = 420, x0 = 80;
    return s('svg', { viewBox: '0 0 640 140', role: 'img', 'aria-label': W(lb.held, values), class: 'ercot-held', 'data-product': products[product] },
      s('rect', { x: x0, y: 30, width: W0, height: 40, class: 'ercot-energy' }),
      label(x0, 22, `${L(T.energy)} · ${L(T.hours(hours))}`),
      s('rect', { x: x0, y: 82, width: Math.min(1, share) * W0, height: 30, class: 'ercot-held-bar', 'data-kind': 'reserve-energy' }),
      share > 1 ? s('rect', { x: x0 + W0, y: 82, width: Math.min(0.6, share - 1) * W0, height: 30, class: 'ercot-held-bar ercot-beyond', 'data-kind': 'beyond' }) : null,
      label(x0, 106, `${L(T.rule)}: ${L(rule < 60 ? [`${rule} min`, `${rule}分钟`] : T.hours(rule / 60))}`, { class: 'ercot-label ercot-on-bar' }),
      label(x0, 132, W(lb.held, values)),
      null);
  };
  const paint = () => {
    host.setAttribute('data-state', String(mode));
    fill(body,
      station({ title: W(lb.battery, values), batteries: 2, labels: [{ at: [12, 1, 3], text: fillPair(lb.battery, values), anchor: 'end', dx: -6 }] }),
      readouts([[T.example, `${power} MW · ${L(T.hours(hours))}`]]),
      mode === 0 ? day() : [
        toggleGroup({ label: lb.held, value: product, options: shot.extra.products.map((p, value) => ({ value, label: p })), onChange: v => { product = v; paint(); } }),
        held(), R.reserveRules[products[product]]?.durationMinutes > hours * 60 ? note(T.beyond) : null, note(T.noOverlap)]);
  };
  const modes = toggleGroup({ label: fillPair(shot.question, values), value: mode, options: options(shot.controls.slice(0, 2), values), onChange: v => { mode = v; paint(); } });
  const reset = h('button', { type: 'button', class: 'k-toggle ercot-reset', onclick: () => {
    mode = 0; product = 1;
    modes.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', String(i === 0)));
    paint();
  } }, W(shot.controls[2], values));
  host.append(h('div', { class: 'ercot-row' }, modes, reset), body);
  paint();
  return host;
}

/* ---- ercot-09: the design grid, displayed --------------------------------- */
function design(shot, { values }) {
  const lb = shot.labels, cells = designCells(), hours = [...new Set(cells.map(c => c.hours))];
  const play = Number(values.playDuration);
  const routes = [['toll', lb.toll], ['mer', lb.merchant]];
  return interactive(shot, values, mode => h('div', {},
    h('div', { class: 'ercot-grid', 'data-view': ['play', 'merchant', 'grid'][mode] }, routes.map(([route, name]) => {
      const hidden = (mode === 0 && route !== 'toll') || (mode === 1 && route !== 'mer');
      return h('div', { class: 'ercot-grid-row', 'data-route': route, 'data-focus': String(!hidden) },
        h('h5', {}, W(name, values)),
        h('ul', {}, hours.map(hr => {
          const c = cells.find(x => x.route === route && x.hours === hr);
          const focus = mode === 0 ? route === 'toll' && hr === play : mode === 1 ? route === 'mer' : true;
          return h('li', { class: `ercot-cell${c?.best ? ' ercot-best' : ''}${c?.priced ? '' : ' ercot-unpriced'}${focus ? '' : ' ercot-dim'}`, 'data-hours': String(hr), 'data-priced': String(Boolean(c?.priced)) },
            h('strong', {}, L(T.hours(hr))), ' ',
            c?.priced && c.valueText ? L(c.valueText) : W(lb.notPriced, values),
            c?.best ? h('span', { class: 'ercot-best-tag' }, W(lb.least, values)) : null,
            route === 'toll' && hr === play ? h('span', { class: 'ercot-tag' }, L(T.current)) : null);
        })));
    })),
    note(shot.extra.fleet, values),
    note(T.bankable)));
}

/* ---- ercot-10: who pays ---------------------------------------------------- */
function payment(shot, { values }) {
  const lb = shot.labels;
  const ends = [[T.battery, T.settlement, lb.energy], [T.battery, T.ercot, lb.reserves], [T.battery, null, lb.capacity], [T.counterparty, T.owner, lb.toll]];
  return interactive(shot, values, mode => {
    const [a, b, unit] = ends[mode], empty = !b, model = mode === 3;
    const svg = s('svg', { viewBox: '0 0 640 130', role: 'img', 'aria-label': W(unit, values), class: `ercot-path${model ? ' ercot-model' : ''}`, 'data-route': ['energy', 'reserves', 'capacity', 'toll'][mode] },
      s('rect', { x: 5, y: 30, width: 230, height: 50, rx: 4, class: 'ercot-box' }), label(120, 62, L(a), { 'text-anchor': 'middle' }),
      empty ? s('line', { x1: 245, x2: 395, y1: 55, y2: 55, class: 'ercot-empty', 'data-kind': 'no-payment' })
        : [s('line', { x1: 395, x2: 245, y1: 55, y2: 55, class: 'ercot-arrow' }), s('path', { d: 'M245,55 l12,-7 l0,14 Z', class: 'ercot-head' }),
          s('rect', { x: 405, y: 30, width: 230, height: 50, rx: 4, class: `ercot-box${model ? ' ercot-dashed' : ''}` }), label(520, 62, L(b), { 'text-anchor': 'middle' })],
      label(320, 22, W(unit, values), { 'text-anchor': 'middle' }),
      mode === 1 ? label(630, 112, L(T.loads), { 'text-anchor': 'end' }) : null,
      model ? label(320, 112, L(T.marketRevenue) + ' → ' + L(T.counterparty), { 'text-anchor': 'middle' }) : null);
    return h('div', {}, svg, h('p', { class: `ercot-flow${model ? ' ercot-dashed' : ''}` }, W(shot.extra.routes[mode], values)), model ? note(T.modelRoute) : null);
  });
}

/* ---- ercot-11: only an executed toll at a known price --------------------- */
function toll(shot, { values }) {
  const lb = shot.labels, tenor = Number(values.securedTenor);
  return interactive(shot, values, mode => {
    if (mode === 2) return h('ul', { class: 'ercot-checks' }, ['counterparty', 'tenor', 'indexation', 'deductions', 'dispatch'].map((k, i) =>
      h('li', {}, h('details', {}, h('summary', {}, W(lb[k], values)), h('p', {}, W(shot.extra.checks[i], values))))));
    const split = 360;
    const svg = s('svg', { viewBox: '0 0 640 232', role: 'img', 'aria-label': `${W(lb.toll, values)} · ${W(lb.after, values)}`, class: 'ercot-term', 'data-mode': mode === 0 ? 'toll' : 'after' },
      s('rect', { x: 30, y: 60, width: split - 30, height: 60, class: `ercot-toll${mode === 0 ? ' ercot-on' : ''}`, 'data-kind': 'model-assumption' }),
      label(40, 95, W(lb.toll, values)),
      s('path', { d: `M${split},70 C${split + 60},40 ${split + 100},120 ${split + 150},80 S${split + 240},110 610,76 L610,120 L${split},120 Z`, class: `ercot-tail${mode === 1 ? ' ercot-on' : ''}`, 'data-kind': 'merchant-tail' }),
      label(620, 140, W(lb.after, values), { 'text-anchor': 'end' }),
      s('line', { x1: split, x2: split, y1: 56, y2: 150, class: 'ercot-expiry' }),
      label(split, 50, L(T.expiry), { 'text-anchor': 'middle' }),
      s('path', { d: `M30,130 v6 h${split - 30} v-6`, class: 'ercot-axis' }), label((30 + split) / 2, 152, L(Number.isFinite(tenor) ? T.years(tenor) : ['', '']), { 'text-anchor': 'middle' }),
      s('g', { class: 'ercot-pricebox', 'data-kind': 'price-unverified' }, s('rect', { x: 300, y: 166, width: 320, height: 30, rx: 3 }), label(460, 188, W(lb.price, values), { 'text-anchor': 'middle' })),
      label(30, 224, L(T.unscaled), { class: 'ercot-label ercot-tagline' }));
    return h('div', {}, svg, note(mode === 0 ? T.modelRoute : lb.after, values));
  });
}

/* ---- ercot-12: what could weaken it, and what to read next ---------------- */
function closing(shot, { values }) {
  const lb = shot.labels;
  return h('div', { class: 'k-scene ercot-scene' },
    station({ title: W(shot.question, values), time: 'dusk', batteries: 2, future: 3 }),
    h('ul', { class: 'ercot-cards' },
      [lb.more, lb.quantities, lb.drrs, lb.queue].map(p => h('li', { class: 'ercot-card ercot-future' }, h('small', {}, W(lb.pending, values)), h('br', {}), W(p, values))),
      lb.event ? h('li', { class: 'ercot-card ercot-next', 'data-step': 'trigger' }, h('small', {}, W(lb.next, values)), h('br', {}), W(lb.event, values)) : null));
}

export const scenes = {
  'ercot-00': () => openingThumbnail(), 'ercot-01': grid, 'ercot-02': history, 'ercot-03': connection,
  'ercot-04': reserves, 'ercot-05': fleet, 'ercot-06': (shot, ctx) => reserveChart(shot, ctx, { panels: ['fleet', 'price'], records: R }),
  'ercot-07': scarcity, 'ercot-08': sell, 'ercot-09': design, 'ercot-10': payment, 'ercot-11': toll, 'ercot-12': closing,
};
