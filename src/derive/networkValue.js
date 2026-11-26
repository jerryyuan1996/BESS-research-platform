import { AVAILABILITY, CYCLES_PER_YEAR, ROUND_TRIP_EFFICIENCY, SPREAD_REALISATION } from '../governance/derivation.js';
import { NSW_HOLIDAYS } from '../markets/nem/data/storageTariffs.js';

const STEP = 5 * 60_000;
const DAY = 24 * 60 * 60_000;
const MONTH = 12;
const formatters = new Map();
const mean = values => values.reduce((sum, n) => sum + n, 0) / values.length;
const inHours = (hour, from, to) => hour >= from && hour < to;
const summer = month => month >= 11 || month <= 3;

function clock(ms, timezone) {
  if (!formatters.has(timezone)) formatters.set(timezone, new Intl.DateTimeFormat('sv-SE', {
    timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }));
  const label = formatters.get(timezone).format(ms);
  return { date: label.slice(0, 10), hour: Number(label.slice(11, 13)), minute: Number(label.slice(14, 16)) };
}

/** Keep actual successive five-minute positions from local midnight to the next
 * midnight. This accepts 23- and 25-hour civil days and rejects a missing slot. */
export function completeTariffDays(series, timezone) {
  const days = new Map();
  for (const point of series || []) {
    const ms = Date.parse(point.t);
    if (!Number.isFinite(point.v) || !Number.isFinite(ms) || ms % STEP) continue;
    const time = clock(ms, timezone);
    if (!days.has(time.date)) days.set(time.date, []);
    days.get(time.date).push({ ms, v: point.v, hour: time.hour, minute: time.minute });
  }
  const complete = [];
  for (const [date, points] of [...days].sort((a, b) => a[0].localeCompare(b[0]))) {
    points.sort((a, b) => a.ms - b.ms);
    if (points[0].hour || points[0].minute || clock(points.at(-1).ms + STEP, timezone).date === date) continue;
    if (points.some((p, i) => i && p.ms - points[i-1].ms !== STEP)) continue;
    const weekday = new Date(date + 'T00:00:00Z').getUTCDay();
    complete.push({ date, month: Number(date.slice(5, 7)), weekday: weekday > 0 && weekday < 6, points });
  }
  return complete;
}

function billingYear(lastDate) {
  const end = Date.parse(lastDate + 'T00:00:00Z') + DAY;
  const start = new Date(end);
  start.setUTCFullYear(start.getUTCFullYear() - 1);
  return { from: start.toISOString().slice(0, 10), days: (end - start.getTime()) / DAY };
}

export function trailingBillingYear(days) {
  if (!days.length) return [];
  const { from } = billingYear(days.at(-1).date);
  return days.filter(day => day.date >= from);
}

function band(tariff, day, p, events) {
  const h = p.hour;
  switch (tariff.id) {
    case 'essential':
      if (inHours(h, 10, 15)) return 'sun';
      if (inHours(h, 17, 20)) return 'peak';
      return inHours(h, 7, 22) ? 'shoulder' : 'off';
    case 'endeavour':
      return day.weekday && !NSW_HOLIDAYS.has(day.date) && inHours(h, 16, 20) ? (summer(day.month) ? 'high' : 'low') : 'off';
    case 'powercor':
      return ([12, 1, 2, 6, 7, 8].includes(day.month) && inHours(h, 16, 21)) ? 'peak' : 'off';
    case 'energex':
      if (inHours(h, 11, 13)) return 'off';
      return day.weekday && inHours(h, 17, 20) ? 'peak' : 'shoulder';
    case 'ausgrid': return events.has(p.ms) ? 'event' : 'ordinary';
    default: return 'ordinary';
  }
}

// Maximise revenue when the best import and export windows overlap. Each
// interval takes one action. An augmenting path can move an existing action to
// another interval, so assigning a high-value export cannot strand a better
// charge. There are at most four kinds of action, including partial intervals.
function assignOverlapping(points, chargeSlots, dischargeSlots) {
  const actions = [];
  for (const [buy, slots] of [[true, chargeSlots], [false, dischargeSlots]]) {
    if (Math.floor(slots)) actions.push({ buy, fraction: 1, count: Math.floor(slots) });
    if (slots % 1 > 1e-8) actions.push({ buy, fraction: slots % 1, count: 1 });
  }
  const empty = actions.length;
  const assigned = points.map(() => empty);
  const weights = actions.map(a => points.map(p => a.fraction * (a.buy ? -p.buy : p.sell)));
  weights.push(points.map(() => 0));
  for (let type = 0; type < empty; type++) {
    for (let n = 0; n < actions[type].count; n++) {
      const edges = actions.map(() => Array(empty + 1).fill(null));
      for (let i = 0; i < points.length; i++) {
        const owner = assigned[i];
        for (let from = 0; from < empty; from++) {
          if (owner === from) continue;
          const gain = weights[from][i] - weights[owner][i];
          if (!edges[from][owner] || edges[from][owner].gain < gain) edges[from][owner] = { i, from, gain };
        }
      }
      let best = null;
      function visit(from, seen, steps, total) {
        for (let to = 0; to <= empty; to++) {
          const edge = edges[from][to];
          if (!edge || seen.has(to)) continue;
          const score = total + edge.gain;
          if (to === empty) {
            if (!best || score > best.score) best = { score, steps: [...steps, edge] };
          } else visit(to, new Set([...seen, to]), [...steps, edge], score);
        }
      }
      visit(type, new Set([type]), [], 0);
      for (const edge of best.steps) assigned[edge.i] = edge.from;
    }
  }
  return points.flatMap((p, i) => assigned[i] === empty ? [] : [{ p, ...actions[assigned[i]] }]);
}

// Rank separately by delivered charge cost and export value. One AC MW may
// only move in one direction in a five-minute interval.
function dispatch(points, durationHours) {
  const chargeSlots = durationHours * 12 / ROUND_TRIP_EFFICIENCY;
  const dischargeSlots = durationHours * 12;
  if (Math.ceil(chargeSlots) + Math.ceil(dischargeSlots) > points.length) return null;
  const buys = [...points].sort((a,b) => a.buy-b.buy || a.ms-b.ms);
  const sells = [...points].sort((a,b) => b.sell-a.sell || b.ms-a.ms);
  const cheapest = buys.slice(0, Math.ceil(chargeSlots));
  const dearest = sells.slice(0, Math.ceil(dischargeSlots));
  const chargeTimes = new Set(cheapest.map(p => p.ms));
  const trades = dearest.some(p => chargeTimes.has(p.ms))
    ? assignOverlapping(points, chargeSlots, dischargeSlots)
    : [...cheapest.map((p, i) => ({ p, buy: true, fraction: Math.min(1, chargeSlots - i) })),
       ...dearest.map((p, i) => ({ p, buy: false, fraction: Math.min(1, dischargeSlots - i) }))];
  let merchant = 0, variable = 0;
  const imports = new Map();
  for (const { p, buy, fraction } of trades) {
    const energy = fraction / 12;
    merchant += (buy ? -p.v : p.v) * energy;
    variable += (buy ? -p.importCharge : p.exportCredit) * energy;
    if (buy) imports.set(p.ms, fraction * 1000);
  }
  return { merchant, variable, imports };
}

function demandForDay(tariff, day, points, imports, cbd) {
  const maxima = { peak: 0, shoulder: 0, off: 0, anytime: 0 };
  let summerKw = 0, summerIntervals = 0;
  for (let i = 0; i < points.length; i += 6) {
    const halfHour = points.slice(i, i + 6);
    const kw = halfHour.reduce((sum, p) => sum + (imports.get(p.ms) || 0), 0) / 6;
    const { rateBand, hour } = halfHour[0];
    maxima.anytime = Math.max(maxima.anytime, kw);
    if (tariff.id === 'essential' && rateBand !== 'sun') maxima[rateBand] = Math.max(maxima[rateBand], kw);
    if (tariff.id === 'endeavour' && rateBand !== 'off') maxima.peak = Math.max(maxima.peak, kw);
    if (tariff.id === 'sapn' && summer(day.month) && (cbd ? day.weekday && inHours(hour, 11, 17) : inHours(hour, 17, 21))) {
      summerKw += kw; summerIntervals++;
    }
  }
  if (summerIntervals) maxima.peak = summerKw / summerIntervals;
  return maxima;
}

function demandBill(tariff, days) {
  if (!tariff.demand) return { annualAtUnity: 0, billing: 'none' };
  const rate = tariff.demand;
  if (rate.basis.startsWith('rolling')) {
    const year = billingYear(days.at(-1).date);
    const recent = days.filter(d => d.date >= year.from);
    if (recent.length !== year.days) return { annualAtUnity: null, billing: 'rolling-history' };
    const max = field => Math.max(...recent.map(d => d.demand[field]));
    const annualAtUnity = rate.basis === 'rollingImportKw' ? max('anytime') * rate.anytime * MONTH
      : (max('anytime') * rate.anytime + max('peak') * rate.peak) * 365;
    return { annualAtUnity, billing: 'latest-rolling-annual-rate' };
  }
  const months = new Map();
  for (const d of days) {
    const ym = d.date.slice(0, 7);
    if (!months.has(ym)) months.set(ym, []);
    months.get(ym).push(d);
  }
  const bills = [];
  for (const [ym, rows] of months) {
    const [year, month] = ym.split('-').map(Number);
    const n = new Date(Date.UTC(year, month, 0)).getUTCDate();
    if (rows.length !== n) continue;
    const max = field => Math.max(...rows.map(d => d.demand[field]));
    bills.push(rate.basis === 'monthlyBands'
      ? ['peak','shoulder','off'].reduce((sum, field) => sum + max(field) * rate[field], 0)
      : n * max('peak') * (summer(month) ? rate.high : rate.low));
  }
  return { annualAtUnity: bills.length ? mean(bills) * MONTH : null, billing: 'complete-billing-months', billingMonths: bills.length };
}

/** A tariff replay returns unit-power-factor demand costs as coefficients
 * so a reader can enter the site's power factor without downloading a raw year. */
export function deriveNetworkValue(days, tariff, { powerMW, durationHours, cbd = false, eventCalendar } = {}) {
  if (!(powerMW > 0) || !(durationHours > 0) || days.length < 28) return null;
  if (tariff.id === 'ausgrid' && (!eventCalendar?.from || !eventCalendar.to || eventCalendar.from > days[0].date || eventCalendar.to < days.at(-1).date || !Array.isArray(eventCalendar.starts))) {
    return { status: 'event-calendar', days: days.length };
  }
  const events = new Set(eventCalendar?.starts?.map(t => Date.parse(t)));
  const results = [];
  for (const day of days) {
    const priced = day.points.map(p => {
      const rateBand = band(tariff, day, p, events);
      const [charge, credit] = tariff.energy[rateBand];
      return { ...p, rateBand, importCharge: charge * 10, exportCredit: credit * 10, buy: p.v + charge * 10, sell: p.v + credit * 10 };
    });
    const result = dispatch(priced, durationHours);
    if (!result) return null;
    results.push({ date: day.date, merchant: result.merchant, variable: result.variable,
      demand: demandForDay(tariff, day, priced, result.imports, cbd) });
  }
  const annualCycles = CYCLES_PER_YEAR * AVAILABILITY;
  const bill = demandBill(tariff, results);
  return { status: 'observed-prices', days: results.length, from: results[0].date, to: results.at(-1).date,
    merchantPerMWYear: mean(results.map(d => d.merchant)) * annualCycles * SPREAD_REALISATION,
    variableNetworkPerMWYear: mean(results.map(d => d.variable)) * annualCycles,
    fixedPerMWYear: tariff.fixed * 365 / powerMW, demandPerMWYearAtUnity: bill.annualAtUnity,
    needsPowerFactor: tariff.demand?.unit.includes('kVA') ?? false, billing: bill.billing, billingMonths: bill.billingMonths ?? null };
}

export function signedNetworkPerMWYear(result, powerFactor) {
  if (result?.status !== 'observed-prices' || result.demandPerMWYearAtUnity == null) return null;
  if (result.needsPowerFactor && !(Number.isFinite(powerFactor) && powerFactor > 0 && powerFactor <= 1)) return null;
  const demand = result.demandPerMWYearAtUnity / (result.needsPowerFactor ? powerFactor : 1);
  return result.variableNetworkPerMWYear - result.fixedPerMWYear - demand;
}
