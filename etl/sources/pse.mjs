/* ---------------------------------------------------------------------------
   PSE — Polish day-ahead prices from the transmission operator's own reporting
   API, with no key (docs/merchant-lines-plan-2026-10.md §2).

       https://api.raporty.pse.pl/api/csdac-pln
         ?$filter=business_date ge 'YYYY-MM-DD' and business_date le 'YYYY-MM-DD'

   `csdac-pln` is the SDAC clearing price for the Polish bidding zone, in PLN/MWh,
   at 15-minute resolution, from 14 June 2024. Before SDAC moved to 15-minute
   products on 1 October 2025 PSE repeats each hourly price over its four
   quarter-hours. It is NOT `rce-pln`, which PSE also publishes and which differs
   from the clearing price: checked on 1 June 2025, csdac-pln 407.17 PLN ÷ the
   coupled €95.79 = 4.251, the day's exchange rate; rce-pln gives 445.47.

   Points are hourly means of the quarter-hours, converted to EUR at the ECB
   reference rate of the trading day (delivery day − 1, or the last rate before
   it), so the series reads like the ENTSO-E one it replaces.
   --------------------------------------------------------------------------- */
import { httpGetJson, httpGetText } from '../lib/fetch.mjs';
import { buildSnapshot } from '../lib/envelope.mjs';
import { mergeSeries, coverageOf, WINDOW_DAYS, MAX_BACKFILL_PER_RUN } from '../lib/series.mjs';

const API = 'https://api.raporty.pse.pl/api/csdac-pln';
const ECB = 'https://data-api.ecb.europa.eu/service/data/EXR/D.PLN.EUR.SP00.A';
const DAY = 86_400_000;
const isoDay = (ms) => new Date(ms).toISOString().slice(0, 10);

/** ECB EUR/PLN reference rates as { 'YYYY-MM-DD': rate }. */
export function parseEcbCsv(csv){
  const lines = csv.trim().split(/\r?\n/);
  const head = lines.shift().split(',');
  const iDay = head.indexOf('TIME_PERIOD'), iRate = head.indexOf('OBS_VALUE');
  const out = {};
  for (const line of lines){
    const cells = line.split(',');
    const rate = Number(cells[iRate]);
    if (cells[iDay] && Number.isFinite(rate)) out[cells[iDay]] = rate;
  }
  return out;
}

/** The rate for a delivery day: the trading day's, or the last one before it. */
export function rateFor(rates, businessDate){
  let ms = Date.parse(`${businessDate}T00:00:00Z`) - DAY;
  for (let i = 0; i < 10; i++, ms -= DAY){
    const r = rates[isoDay(ms)];
    if (r) return r;
  }
  return null;
}

/** PSE rows → hourly EUR points ({ t, v }), t the hour's start in UTC. */
export function hourlyPoints(rows, rates){
  const byHour = new Map();
  for (const r of rows){
    if (!Number.isFinite(r.csdac_pln) || !r.dtime_utc) continue;
    const rate = rateFor(rates, r.business_date);
    if (!rate) continue;
    const end = Date.parse(`${r.dtime_utc.slice(0, 19).replace(' ', 'T')}Z`);
    const hour = Math.floor((end - 15 * 60_000) / 3_600_000) * 3_600_000;
    const acc = byHour.get(hour) || [];
    acc.push(r.csdac_pln / rate);
    byHour.set(hour, acc);
  }
  return [...byHour.entries()].sort((a, b) => a[0] - b[0])
    .map(([ms, v]) => ({ t: new Date(ms).toISOString(), v: Math.round(v.reduce((s, x) => s + x, 0) / v.length * 100) / 100 }));
}

export async function fetchDataset({ dataset, previous, log, now }){
  const end = now ? Date.parse(now) : Date.now();
  const have = new Set((previous?.series || []).map(p => p.t.slice(0, 10)));
  /* Days the snapshot lacks inside the window, newest first, capped per run so a
     cold start fills over several runs. Today and tomorrow are always asked for:
     tomorrow's prices publish around 13:00 CET. */
  const wanted = [];
  for (let d = end + DAY; d >= end - WINDOW_DAYS * DAY && wanted.length < MAX_BACKFILL_PER_RUN; d -= DAY){
    const day = isoDay(d);
    if (!have.has(day) || d >= end - DAY) wanted.push(day);
  }
  if (!wanted.length) return { snapshot: buildSnapshot({ dataset, coverage: coverageOf(previous.series, 'PT60M'), units: { price: 'EUR/MWh' }, series: previous.series, notes: previous.notes || [] }) };

  const first = wanted[wanted.length - 1], last = wanted[0];
  const ratesFrom = isoDay(Date.parse(`${first}T00:00:00Z`) - 14 * DAY);
  const rates = parseEcbCsv(await httpGetText(`${ECB}?startPeriod=${ratesFrom}&endPeriod=${last}&format=csvdata`, { log, retries: 2 }));

  const rows = [];
  let url = `${API}?${new URLSearchParams({ $filter: `business_date ge '${first}' and business_date le '${last}'`, $first: '20000' })}`;
  while (url){
    const page = await httpGetJson(url, { log, retries: 2 });
    rows.push(...(page.value || []));
    url = page.nextLink || null;
  }
  const incoming = hourlyPoints(rows, rates);
  if (!incoming.length && !previous?.series?.length) throw new Error('PSE: no points fetched and no previous snapshot to extend');

  const series = mergeSeries(previous?.series, incoming, { windowDays: WINDOW_DAYS, now: now || new Date(end).toISOString() });
  return {
    snapshot: buildSnapshot({
      dataset,
      coverage: coverageOf(series, 'PT60M'),
      units: { price: 'EUR/MWh' },
      series,
      notes: [
        'SDAC day-ahead clearing price for the Polish bidding zone (PSE csdac-pln), hourly mean of the quarter-hours.',
        'Converted from PLN at the ECB reference rate of the trading day.',
      ],
    }),
  };
}
