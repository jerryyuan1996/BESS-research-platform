import { summarize } from './aemo-nem-summary.mjs';
import { boundedDownload } from '../lib/bounded-download.mjs';
import { buildSnapshot } from '../lib/envelope.mjs';
import { mergeSeries, coverageOf, WINDOW_DAYS, MAX_BACKFILL_PER_RUN } from '../lib/series.mjs';
import { parseDispatchArchive, REGIONS, FIVE_MIN, DAY, AEST, MAX_ARCHIVE_BYTES } from '../lib/aemo-nem-dispatch.mjs';

const root = 'https://www.nemweb.com.au/Reports/ARCHIVE/DispatchIS_Reports/';
const dayLabel = ms => new Date(ms + AEST).toISOString().slice(0, 10);
const archiveWindowEnd = now => Date.parse(dayLabel(Date.parse(now)) + 'T00:00:00+10:00') - DAY;

// NEMWEB's date denotes the calendar day of interval starts on the NEM clock.
// A UTC date with one point, a 04:00 trading day, and a distributor billing day
// each have different boundaries. Check all 288 distinct source-day slots.
export function incompleteSourceDays(series, now, windowDays = WINDOW_DAYS) {
  const slots = new Map();
  for (const p of series || []) {
    const t = Date.parse(p.t);
    if (!Number.isFinite(p.v) || !Number.isFinite(t) || t % FIVE_MIN !== 0) continue;
    const day = dayLabel(t);
    if (!slots.has(day)) slots.set(day, new Set());
    slots.get(day).add((t + AEST) % DAY);
  }
  const end = archiveWindowEnd(now);
  const missing = [];
  // The archived day file is published early on D+2. Never request a known
  // incomplete current day; a delayed archive remains eligible on the next run.
  for (let i = 1; i <= windowDays; i++) {
    const day = dayLabel(end - i * DAY);
    if (slots.get(day)?.size !== 288) missing.push(day);
  }
  return missing;
}

async function downloadDay(day) {
  const url = root + 'PUBLIC_DISPATCHIS_' + day.replaceAll('-', '') + '.zip';
  const result = await boundedDownload(url, { maxBytes: MAX_ARCHIVE_BYTES, timeoutMs: 30_000 });
  return parseDispatchArchive(result.bytes, day);
}

// The orchestrator creates one instance per run. All regional readers share
// both successes and failures and one 45-date allowance. Only points are kept.
export function createRun({ readDay = downloadDay, maxDays = MAX_BACKFILL_PER_RUN, windowDays = WINDOW_DAYS } = {}) {
  const archive = new Map();
  let sourceUnavailable = false;
  async function fetchDataset({ dataset, previous, now = new Date().toISOString(), log = () => {} }) {
    const region = dataset.id.split('-')[1]?.toUpperCase();
    if (!REGIONS.includes(region)) throw new Error('Unknown NEM price region');
    const incoming = [];
    const missing = incompleteSourceDays(previous?.series, now, windowDays);
    for (const day of missing) {
      if (!archive.has(day)) {
        if (archive.size >= maxDays || sourceUnavailable) continue;
        archive.set(day, (async () => {
          try { return await readDay(day); }
          catch (error) {
            log('AEMO NEM ' + day + ': ' + error.message);
            // An absent or malformed file is local to that day. Do not make 45
            // requests against a provider that refused or timed out on the first.
            if (!/HTTP 404|^AEMO NEM|^zip:/.test(error.message)) sourceUnavailable = true;
            return null;
          }
        })());
      }
      const dayData = await archive.get(day);
      if (dayData?.[region]?.length) incoming.push(...dayData[region]);
    }
    if (!incoming.length) {
      if (missing.length && !previous?.series?.length) throw new Error('No available AEMO NEM interval data for ' + region);
      return { skipped: true, reason: missing.length ? 'No regional update from available archives' : 'All archived source days are complete' };
    }
    const series = mergeSeries(previous?.series, incoming, { windowDays, now: new Date(archiveWindowEnd(now)).toISOString() });
    return { snapshot: buildSnapshot({ dataset, fetchedAt: now, coverage: coverageOf(series, 'PT5M'),
      units: { price: 'AUD/MWh' }, series, notes: [
        'AEMO NEMWEB DISPATCH/PRICE RRP, non-intervention market pricing run. UTC timestamps mark interval starts. NEM time is UTC+10.',
        'Prices are dispatch observations. A dispatchStatus field records intervals not marked FIRM at issue. Subsequent AEMO settlement revisions are a separate dataset.',
      ] }) };
  }
  return { fetchDataset, summarize };
}
