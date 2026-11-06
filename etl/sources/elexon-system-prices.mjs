/* Elexon DISEBSP: indicative cash-out prices and signed system NIV.
   Independent observations, never day-ahead prices or battery revenue.
   One anonymous day request serves all three metrics in the existing ETL run. */
import { httpGetJson } from '../lib/fetch.mjs';
import { buildSnapshot, sha256 } from '../lib/envelope.mjs';
import { coverageOf, mergeSeries, WINDOW_DAYS } from '../lib/series.mjs';

const ROOT = 'https://data.elexon.co.uk/bmrs/api/v1/balancing/settlement/system-prices';
const HALF_HOUR = 1_800_000;
const DAY = 86_400_000;
export const MAX_BACKFILL_DAYS = 4;
export const MAX_REQUESTS_PER_RUN = 2 + MAX_BACKFILL_DAYS;
export const SERIES = {
  'gb-imbalance-buy': { field: 'systemBuyPrice', quantity: 'price', unit: 'GBP/MWh' },
  'gb-imbalance-sell': { field: 'systemSellPrice', quantity: 'price', unit: 'GBP/MWh' },
  'gb-net-imbalance-volume': { field: 'netImbalanceVolume', quantity: 'energy', unit: 'MWh' },
};
const londonDay = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit',
});
const offset = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London', timeZoneName: 'shortOffset',
});
const localDay = value => londonDay.format(new Date(value));
const shiftDay = (day, n) => new Date(Date.parse(day + 'T00:00:00Z') + n * DAY).toISOString().slice(0, 10);

/** UK midnight is unambiguous even on the clock-change dates. */
function midnight(day){
  const utc = Date.parse(day + 'T00:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isFinite(utc)
      || new Date(utc).toISOString().slice(0, 10) !== day) throw new Error('Elexon: invalid settlement date');
  const zone = offset.formatToParts(new Date(utc)).find(p => p.type === 'timeZoneName')?.value;
  // ICU versions render zero as either GMT or GMT+0, and may pad offsets.
  const match = zone?.match(/^GMT(?:([+-])(\d{1,2})(?::(\d{2}))?)?$/);
  const minutes = match ? (match[1] === '-' ? -1 : 1) * (Number(match[2] || 0) * 60 + Number(match[3] || 0)) : NaN;
  if (![0, 60].includes(minutes)) throw new Error('Elexon: unexpected London UTC offset');
  return utc - minutes * 60_000;
}

export function settlementBounds(day){
  const from = midnight(day), to = midnight(shiftDay(day, 1));
  return { from, to, periods: (to - from) / HALF_HOUR };
}

const explicitInstant = value => typeof value === 'string'
  && /(?:Z|[+-]\d{2}:\d{2})$/i.test(value) && Number.isFinite(Date.parse(value));

/** Fail a whole day on malformed/partial data; null is never coerced to zero.
    Restatements use the newest source creation time, not response order. */
export function parseDay(payload, day, metric){
  if (!metric || !Object.values(SERIES).includes(metric)) throw new Error('Elexon: unknown metric');
  if (!Array.isArray(payload?.data)) throw new Error('Elexon: missing data array');
  if (!payload.metadata?.datasets?.includes('DISEBSP')) throw new Error('Elexon: unexpected dataset identity');
  const { from, to, periods } = settlementBounds(day);
  const byTime = new Map();
  for (const row of payload.data){
    const period = row?.settlementPeriod;
    if (row?.settlementDate !== day || !Number.isInteger(period) || period < 1 || period > periods
        || !explicitInstant(row.startTime) || Date.parse(row.startTime) !== from + (period - 1) * HALF_HOUR
        || Date.parse(row.startTime) >= to || !explicitInstant(row.createdDateTime)
        || typeof row.bsadDefaulted !== 'boolean' || typeof row.priceDerivationCode !== 'string'
        || !row.priceDerivationCode.trim()) throw new Error(`Elexon: invalid settlement interval for ${day}`);
    const v = row[metric.field];
    // NIV is signed energy per interval, not MW. These are source-specific
    // guards; no existing price validator or unit bound is weakened.
    const upper = metric.quantity === 'price' ? 1_000_000 : 100_000;
    if (typeof v !== 'number' || !Number.isFinite(v) || v < -100_000 || v > upper){
      throw new Error(`Elexon: invalid ${metric.field} (${metric.unit}) for ${day}`);
    }
    const point = {
      t: new Date(row.startTime).toISOString(), v,
      settlementDate: day, settlementPeriod: period,
      publishedAt: new Date(row.createdDateTime).toISOString(),
      bsadDefaulted: row.bsadDefaulted, priceDerivationCode: row.priceDerivationCode,
    };
    const previous = byTime.get(point.t);
    if (previous?.publishedAt === point.publishedAt && JSON.stringify(previous) !== JSON.stringify(point)){
      throw new Error(`Elexon: conflicting same-version interval for ${day}`);
    }
    if (!previous || previous.publishedAt < point.publishedAt) byTime.set(point.t, point);
  }
  if (byTime.size !== periods) throw new Error(`Elexon: incomplete ${day}: ${byTime.size}/${periods} intervals`);
  return [...byTime.values()].sort((a, b) => a.t.localeCompare(b.t));
}

/** Recent completed days overlap D+1 revisions. The remaining budget repairs
    missing intervals as well as entirely absent days, newest first. */
export function requestDays(previous, now){
  const today = localDay(now);
  const have = new Map();
  for (const p of previous?.series ?? []){
    if (!explicitInstant(p.t) || !Number.isFinite(p.v)) continue;
    const day = localDay(p.t);
    if (!have.has(day)) have.set(day, new Set());
    have.get(day).add(Date.parse(p.t));
  }
  const recent = [shiftDay(today, -1), shiftDay(today, -2)];
  const wanted = [...recent];
  for (let i = 3; i <= WINDOW_DAYS && wanted.length < recent.length + MAX_BACKFILL_DAYS; i++){
    const day = shiftDay(today, -i);
    const { from, periods } = settlementBounds(day);
    const points = have.get(day);
    if (!points || Array.from({ length: periods }, (_, n) => from + n * HALF_HOUR).some(t => !points.has(t))){
      wanted.push(day);
    }
  }
  return wanted;
}

export function createConnector({ request = httpGetJson, requestTimeoutMs = 20_000 } = {}){
  if (!Number.isInteger(requestTimeoutMs) || requestTimeoutMs < 1 || requestTimeoutMs > 20_000){
    throw new Error('Elexon: invalid request timeout');
  }
  let run = null;
  async function fetchDataset({ dataset, previous, now = new Date().toISOString(), log = () => {} }){
    const metric = SERIES[dataset.id];
    if (!metric) throw new Error(`Elexon: unsupported dataset ${dataset.id}`);
    if (run?.now !== now) run = { now, days: new Map(), blocked: null };
    const current = run;
    const incoming = [];
    for (const day of requestDays(previous, now)){
      try {
        if (!current.days.has(day)){
          if (current.blocked) throw current.blocked;
          if (current.days.size >= MAX_REQUESTS_PER_RUN) throw new Error('shared run request budget exhausted; defer to a later run');
          // Keep failed requests cached for this logical run too. A 429 or
          // access denial stops new requests; it is not bypassed by another metric.
          const promise = (async () => {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), requestTimeoutMs);
            try {
              return await request(`${ROOT}/${day}?format=json`, {
                log, retries: 1, timeoutMs: requestTimeoutMs, signal: controller.signal,
              });
            } finally { clearTimeout(timer); }
          })()
            .catch(err => {
              if ([401, 403, 429].includes(err.status)) current.blocked = err;
              throw err;
            });
          current.days.set(day, promise);
        }
        incoming.push(...parseDay(await current.days.get(day), day, metric));
      } catch (err){
        log(`Elexon: ${day} retained/missing (${err.message})`);
      }
    }
    if (!incoming.length) throw new Error('Elexon: no complete days fetched; keep last-good snapshot');
    // An older upstream version may not replace a newer stored revision.
    const byTime = new Map((previous?.series ?? []).map(p => [p.t, p]));
    const accepted = incoming.filter(p => !byTime.get(p.t)?.publishedAt || byTime.get(p.t).publishedAt <= p.publishedAt);
    const series = mergeSeries(previous?.series, accepted, { windowDays: WINDOW_DAYS, now });
    return { snapshot: buildSnapshot({
      dataset, series, coverage: coverageOf(series, 'PT30M'),
      units: { [metric.quantity]: metric.unit }, fetchedAt: now,
      notes: [
        'Elexon DISEBSP indicative system prices/NIV; D+1 revisions remain possible. Not final settlement data.',
        'Europe/London settlement days have 46, 48 or 50 half-hours; timestamps are UTC interval starts.',
        metric.quantity === 'price'
          ? `${metric.field}, GBP/MWh. Cash-out price, not day-ahead price or achieved battery revenue.`
          : 'netImbalanceVolume, signed MWh per half-hour: positive = system short, negative = system long. Not MW or battery dispatch.',
        'Rolling 365-day window, at most two revision days plus four backfill days per run. Partial/failed days retain prior points; coverage is not a claim of a complete year.',
      ],
    }) };
  }
  return { fetchDataset, summarize };
}

const round = n => Math.round(n * 10_000) / 10_000;
/** An explicit metric summary avoids the generic energy-spread/arbitrage path. */
export function summarize(snapshot){
  const metric = SERIES[snapshot.datasetId];
  if (!metric || JSON.stringify(snapshot.units) !== JSON.stringify({ [metric.quantity]: metric.unit })){
    throw new Error('Elexon: summary metric/unit mismatch');
  }
  const groups = new Map();
  for (const p of snapshot.series){
    const day = localDay(p.t);
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day).push(p.v);
  }
  const daily = [...groups].sort(([a], [b]) => a.localeCompare(b)).map(([d, values]) => ({
    d, n: values.length, expected: settlementBounds(d).periods,
    mean: round(values.reduce((a, b) => a + b, 0) / values.length),
    min: Math.min(...values), max: Math.max(...values),
    ...(metric.quantity === 'energy' ? { netMWh: round(values.reduce((a, b) => a + b, 0)) } : {}),
  }));
  const { series, contentChecksum, envelopeChecksum, ...envelope } = snapshot;
  const summary = { ...envelope, summarySchemaVersion: 1, derived: null, arbitrage: null,
    metric: { schemaVersion: 1, field: metric.field, quantity: metric.quantity, unit: metric.unit,
      intervalMinutes: 30, settlementStatus: 'indicative' },
    dailyTimezone: 'Europe/London', daily,
    sourceSnapshot: { file: snapshot.datasetId + '.json', contentChecksum, points: series.length },
  };
  summary.contentChecksum = sha256({ sourceSnapshot: summary.sourceSnapshot, metric: summary.metric, daily, units: summary.units });
  summary.summaryChecksum = sha256(summary);
  return summary;
}

export const { fetchDataset } = createConnector();
