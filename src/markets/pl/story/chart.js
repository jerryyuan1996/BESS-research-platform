/* ---------------------------------------------------------------------------
   Chart-PL-AUCTIONS: one signature chart, two aligned panels, one delivery-year
   axis.

   Upper panel: the domestic main-auction clearing price, solid, PLN per
   credited kW per year, with that auction's battery correction factor beside
   each vintage as a LABEL rather than a second axis. Lower panel: what one
   certified kW of a battery could contract, price x factor / 100, solid, in
   PLN per certified kW per year. The catch-up auction is its own marker at the
   same delivery year and is never averaged with the main one.

   After the last scheduled main auction the axis continues to the first
   unscheduled delivery year and stops: a dashed boundary, not a forecast.

   THE GATED FORM. While chart.quantitativeReady is false the same two panels
   are drawn as dimensionless teaching shapes, with the decision record's own
   Example wording and no numeric label, tick, tooltip or table. The switch is
   one flag, and the numbers are in src/markets/pl/data/capacityAuctions.js
   either way.
   --------------------------------------------------------------------------- */
import { L } from '../../../app/i18n.js';
import { s, n2, uid } from '../../../experience/story/kit/svg.js';
import { niceTicks } from '../../../charts/chartUtils.js';
import { chartFrame } from './ui.js';

const WIDE = { W: 720, H: 396, LEFT: 66, RIGHT: 22 };
const COMPACT = { W: 400, H: 380, LEFT: 52, RIGHT: 12 };
const GREEN = 'var(--ix-green,#224e40)';
const MUTED = 'var(--ix-muted,#68766c)';
const RISK = 'var(--ix-risk,#9c5b40)';
const INK = 'var(--ix-ink,#193c32)';

const pln = (v) => Number(v).toFixed(2);
const mwText = (v) => Math.round(v).toLocaleString('en-US');

/**
 * spec: { rows, boundary, labels, compact }
 *   rows      the eleven records, in delivery order
 *   boundary  the first unscheduled delivery year
 *   labels    the shot's own label pairs
 */
export function auctionChart(spec){
  const { W, H, LEFT, RIGHT } = spec.compact ? COMPACT : WIDE;
  const labels = spec.labels;
  const rows = spec.rows || [];
  const main = rows.filter(row => row.kind === 'main');
  const catchUp = rows.find(row => row.kind === 'catch-up');
  const years = [...new Set(rows.map(row => row.deliveryYear))].sort((a, b) => a - b);
  const last = spec.boundary || years[years.length - 1] + 1;
  const plotW = W - LEFT - RIGHT;
  const x = (year) => LEFT + ((year - years[0]) / (last - years[0])) * plotW;

  const priceTicks = niceTicks(0, Math.max(1, ...main.map(row => row.pricePLNPerKWYear)), 4);
  const priceTop = priceTicks[priceTicks.length - 1];
  const contractTicks = niceTicks(0, Math.max(1, ...rows.map(row => row.contractPLNPerCertifiedKWYear)), 4);
  const contractTop = contractTicks[contractTicks.length - 1];

  const topA = 34, highA = spec.compact ? 112 : 126;
  const topB = topA + highA + 58, highB = spec.compact ? 84 : 96;
  const axisY = topB + highB + 28;
  const yA = (v) => topA + highA - (v / priceTop) * highA;
  const yB = (v) => topB + highB - (v / contractTop) * highB;
  const slot = Math.min(34, plotW / (years.length + 1));
  const nodes = [];

  /* ---- upper panel: solid bars, factor labels, catch-up apart ------------ */
  nodes.push(...priceTicks.map(v => s('g', { class: 'k-tick' },
    s('line', { class: 'k-grid', x1: LEFT, x2: W - RIGHT, y1: n2(yA(v)), y2: n2(yA(v)) }),
    s('text', { x: LEFT - 6, y: n2(yA(v) + 4), 'text-anchor': 'end' }, pln(v)))));

  for (const row of main){
    const cx = x(row.deliveryYear);
    nodes.push(s('g', { 'data-series': 'price', 'data-auction': row.id },
      s('rect', { x: n2(cx - slot / 2), y: n2(yA(row.pricePLNPerKWYear)), width: n2(slot), height: n2(topA + highA - yA(row.pricePLNPerKWYear)), rx: 1.5, fill: GREEN, 'fill-opacity': 0.78 }),
      /* the factor is a decided rule printed as a label, never a second axis */
      s('text', { class: 'k-label', x: n2(cx), y: n2(yA(row.pricePLNPerKWYear) - 6), 'text-anchor': 'middle' }, `${row.batteryFactorPct.toFixed(2)}%`),
      s('text', { class: 'k-value', x: n2(cx), y: n2(yA(row.pricePLNPerKWYear) - 18), 'text-anchor': 'middle' }, pln(row.pricePLNPerKWYear))));
    if (row.technologyStatus === 'reported'){
      nodes.push(s('g', { 'data-series': 'obligation', 'data-auction': row.id },
        s('circle', { cx: n2(cx), cy: n2(topA - 6), r: 3.4, fill: RISK }),
        s('text', { class: 'k-label', x: n2(cx), y: n2(topA - 12), 'text-anchor': 'middle' }, `${mwText(row.batteryObligationMW)} MW`)));
    }
  }
  if (catchUp){
    const cx = x(catchUp.deliveryYear) + slot / 2 + 3;
    nodes.push(s('g', { 'data-series': 'catch-up', 'data-auction': catchUp.id },
      s('rect', { x: n2(cx), y: n2(yA(catchUp.pricePLNPerKWYear)), width: 9, height: n2(topA + highA - yA(catchUp.pricePLNPerKWYear)), fill: '#fffefa', stroke: RISK, 'stroke-width': 1.6 }),
      s('text', { class: 'k-label', x: n2(cx + 4), y: n2(yA(catchUp.pricePLNPerKWYear) - 6), 'text-anchor': 'middle' }, L(labels.l07))));
  }

  /* ---- lower panel: what one kW contracts -------------------------------- */
  nodes.push(...contractTicks.map(v => s('g', { class: 'k-tick' },
    s('line', { class: 'k-grid', x1: LEFT, x2: W - RIGHT, y1: n2(yB(v)), y2: n2(yB(v)) }),
    s('text', { x: LEFT - 6, y: n2(yB(v) + 4), 'text-anchor': 'end' }, pln(v)))));
  for (const row of rows){
    const cx = x(row.deliveryYear) + (row.kind === 'catch-up' ? slot / 2 + 3 : 0);
    nodes.push(s('g', { 'data-series': 'contract', 'data-auction': row.id, 'data-kind': row.kind },
      s('line', { x1: n2(cx), x2: n2(cx), y1: n2(yB(row.contractPLNPerCertifiedKWYear)), y2: n2(topB + highB), stroke: row.kind === 'catch-up' ? RISK : GREEN, 'stroke-width': 2, 'stroke-dasharray': row.kind === 'catch-up' ? '3 2' : null }),
      s('circle', { cx: n2(cx), cy: n2(yB(row.contractPLNPerCertifiedKWYear)), r: 4.2, fill: row.kind === 'catch-up' ? '#fffefa' : GREEN, stroke: row.kind === 'catch-up' ? RISK : GREEN, 'stroke-width': 1.4 }),
      s('text', { class: 'k-value', x: n2(cx), y: n2(yB(row.contractPLNPerCertifiedKWYear) - 8), 'text-anchor': 'middle' }, pln(row.contractPLNPerCertifiedKWYear))));
  }

  /* ---- the boundary: dashed, dated, and the end of the axis -------------- */
  nodes.push(s('g', { 'data-series': 'boundary' },
    s('line', { x1: n2(x(last)), x2: n2(x(last)), y1: topA - 18, y2: axisY, stroke: INK, 'stroke-width': 1.4, 'stroke-dasharray': '6 4' }),
    s('text', { class: 'k-label', x: n2(x(last)), y: topA - 24, 'text-anchor': 'end' }, L(labels.l08))));

  /* ---- axes and panel titles -------------------------------------------- */
  nodes.push(s('line', { class: 'k-axis', x1: LEFT, x2: W - RIGHT, y1: topA + highA, y2: topA + highA }));
  nodes.push(s('line', { class: 'k-axis', x1: LEFT, x2: W - RIGHT, y1: topB + highB, y2: topB + highB }));
  for (const yearY of years) nodes.push(s('g', { class: 'k-tick' },
    s('line', { x1: n2(x(yearY)), x2: n2(x(yearY)), y1: axisY - 4, y2: axisY }),
    s('text', { x: n2(x(yearY)), y: axisY + 14, 'text-anchor': 'middle' }, String(yearY))));
  nodes.push(s('text', { class: 'k-axis-title', x: 12, y: topA + highA / 2, transform: `rotate(-90 12 ${topA + highA / 2})`, 'text-anchor': 'middle' }, L(labels.l02)));
  nodes.push(s('text', { class: 'k-axis-title', x: 12, y: topB + highB / 2, transform: `rotate(-90 12 ${topB + highB / 2})`, 'text-anchor': 'middle' }, L(labels.l04)));
  nodes.push(s('text', { class: 'k-axis-title', x: LEFT, y: axisY + 30 }, L(labels.l01)));
  nodes.push(s('text', { class: 'k-legend-label', x: LEFT, y: 14 }, L(labels.l03)));

  const svg = chartFrame(labels.l01, W, H, nodes);
  svg.setAttribute('data-chart-state', 'numeric');
  svg.setAttribute('data-delivery-years', years.join(','));
  return svg;
}

/**
 * The gated form: the same two panels, the same delivery-year slots, drawn as
 * dimensionless teaching shapes. No tick, no value, no obligation marker.
 */
export function exampleAuctionChart({ labels, compact }){
  const { W, H, LEFT, RIGHT } = compact ? COMPACT : WIDE;
  const plotW = W - LEFT - RIGHT;
  const topA = 34, highA = compact ? 112 : 126;
  const topB = topA + highA + 58, highB = compact ? 84 : 96;
  const axisY = topB + highB + 28;
  const slots = 11;
  const x = (i) => LEFT + ((i + 0.6) / slots) * plotW;
  const shape = [0.42, 0.34, 0.36, 0.5, 0.3, 0.72, 0.74, 0.44, 0.47, 0.9, 0.82];
  const nodes = [];
  shape.forEach((v, i) => {
    const hgt = v * highA;
    nodes.push(s('rect', { 'data-series': 'example-price', x: n2(x(i) - 6), y: n2(topA + highA - hgt), width: 12, height: n2(hgt), rx: 1.5, fill: GREEN, 'fill-opacity': 0.32 }));
  });
  nodes.push(s('path', {
    'data-series': 'example-contract', fill: 'none', stroke: MUTED, 'stroke-width': 2, 'stroke-dasharray': '5 4',
    d: shape.map((v, i) => `${i ? 'L' : 'M'}${n2(x(i))},${n2(topB + highB - v * highB * 0.7)}`).join(' '),
  }));
  nodes.push(s('line', { class: 'k-axis', x1: LEFT, x2: W - RIGHT, y1: topA + highA, y2: topA + highA }));
  nodes.push(s('line', { class: 'k-axis', x1: LEFT, x2: W - RIGHT, y1: topB + highB, y2: topB + highB }));
  nodes.push(s('line', { x1: LEFT, x2: W - RIGHT, y1: axisY, y2: axisY, stroke: INK, 'stroke-width': 1.2, 'stroke-dasharray': '6 4' }));
  nodes.push(s('text', { class: 'k-axis-title', x: 12, y: topA + highA / 2, transform: `rotate(-90 12 ${topA + highA / 2})`, 'text-anchor': 'middle' }, L(labels.l02)));
  nodes.push(s('text', { class: 'k-axis-title', x: 12, y: topB + highB / 2, transform: `rotate(-90 12 ${topB + highB / 2})`, 'text-anchor': 'middle' }, L(labels.l04)));
  const tag = ['Example: auction price × correction factor', '示例：拍卖价格×修正系数'];
  const svg = chartFrame(tag, W, H, nodes);
  svg.setAttribute('data-chart-state', 'example');
  return svg;
}

/** Which form the chart takes: numbers only when the gate has been accepted. */
export function signatureChart({ rows, boundary, labels, compact, ready }){
  return ready
    ? auctionChart({ rows, boundary, labels, compact })
    : exampleAuctionChart({ labels, compact });
}

/**
 * The accessible table, built from exactly the records the marks are drawn
 * from — same rows, same nulls, same order. In the gated form there is no
 * table at all, because there is no numeric layer to describe.
 */
export function auctionTable({ rows, labels, ready }){
  if (!ready) return null;
  const head = ['Delivery year', 'Auction', 'Clearing price', 'Factor', 'Contract per kW', 'Battery obligation'];
  const cells = rows.map(row => [
    String(row.deliveryYear),
    row.kind === 'catch-up' ? 'Catch-up auction' : row.noticeId,
    `${pln(row.pricePLNPerKWYear)} PLN/kW/year`,
    `${row.batteryFactorPct.toFixed(2)}%`,
    `${pln(row.contractPLNPerCertifiedKWYear)} PLN/kW/year`,
    row.batteryObligationMW == null
      ? (row.technologyStatus === 'pending' ? 'Technology split pending' : 'None reported')
      : `${mwText(row.batteryObligationMW)} MW${row.batteryUnits ? `, ${row.batteryUnits} units` : ''}`,
  ]);
  return { caption: labels.l01, head, cells };
}
