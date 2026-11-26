import { inspectZip, extractZipMember } from './bounded-zip.mjs';

export const REGIONS = ['NSW1', 'QLD1', 'VIC1', 'SA1', 'TAS1'];
export const FIVE_MIN = 300_000;
export const DAY = 86_400_000;
export const AEST = 10 * 3_600_000;
const MiB = 1024 ** 2;
export const MAX_ARCHIVE_BYTES = 32 * MiB;
const outerLimits = { maxBytes: MAX_ARCHIVE_BYTES, maxEntries: 576, maxExpandedBytes: 64 * MiB, maxMemberBytes: MiB };
const innerLimits = { maxBytes: MiB, maxEntries: 1, maxExpandedBytes: 4 * MiB, maxMemberBytes: 4 * MiB };
const zipName = /^PUBLIC_DISPATCHIS_(\d{12})_(\d{16})\.zip$/i;
const stripQuotes = value => value?.replace(/^"(.*)"$/, '$1');

// The MMS PRICE table contains comma-separated numbers, fixed identifiers and
// quoted timestamps. Skip every other MMS table before splitting its columns.
export function parsePriceRows(csv, end, prices) {
  const headers = new Map();
  let found = false;
  for (const line of csv.split(/\r?\n/)) {
    if (!/^[ID],DISPATCH,PRICE,/.test(line)) continue;
    const cells = line.split(',').map(stripQuotes);
    if (cells[0] === 'I') {
      const fields = Object.fromEntries(cells.slice(4).map((field, i) => [field, i + 4]));
      if (!['SETTLEMENTDATE', 'REGIONID', 'INTERVENTION', 'RRP'].every(field => field in fields)) {
        throw new Error('AEMO NEM dispatch price header is missing a required field');
      }
      headers.set(cells[3], fields);
      continue;
    }
    const cols = headers.get(cells[3]);
    if (!cols) throw new Error('AEMO NEM dispatch price data has no corresponding header');
    if (cells[cols.INTERVENTION] !== '0') continue;
    const region = cells[cols.REGIONID];
    if (!REGIONS.includes(region)) continue;
    const stated = cells[cols.SETTLEMENTDATE]?.replaceAll('/', '-').replace(' ', 'T');
    const raw = cells[cols.RRP];
    const v = Number(raw);
    if (Date.parse(stated + '+10:00') !== end || !raw?.trim() || !Number.isFinite(v)) {
      throw new Error('AEMO NEM invalid interval end or regional reference price');
    }
    const status = cells[cols.PRICE_STATUS] || 'UNSPECIFIED';
    const prior = prices.get(region);
    if (prior && (prior.v !== v || (prior.dispatchStatus ?? 'FIRM') !== status)) {
      throw new Error('AEMO NEM conflicting market prices in the same interval report');
    }
    prices.set(region, { t: new Date(end - FIVE_MIN).toISOString(), v,
      ...(status === 'FIRM' ? {} : { dispatchStatus: status }) });
    found = true;
  }
  if (!found) throw new Error('AEMO NEM interval contains no regional market prices');
}

export function parseDispatchArchive(bytes, day) {
  const start = Date.parse(day + 'T00:00:00+10:00');
  if (!Number.isFinite(start)) throw new Error('AEMO NEM invalid archive date');
  const outer = inspectZip(bytes, outerLimits);
  const latest = new Map();
  for (const entry of outer.entries) {
    const match = zipName.exec(entry.name);
    if (!match) throw new Error('AEMO NEM unexpected daily archive member');
    const [y, m, d, h, min] = match[1].match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/).slice(1).map(Number);
    const end = Date.UTC(y, m - 1, d, h, min) - AEST;
    if (end <= start || end > start + DAY || end % FIVE_MIN) throw new Error('AEMO NEM interval outside its source day');
    // Fixed-width report sequence numbers order replacement publications for an interval.
    if (!latest.has(end) || match[2] > latest.get(end).sequence) latest.set(end, { name: entry.name, sequence: match[2] });
  }
  const byRegion = Object.fromEntries(REGIONS.map(region => [region, []]));
  let expanded = 0;
  for (const [end, { name }] of [...latest].sort((a, b) => a[0] - b[0])) {
    const innerBytes = extractZipMember(bytes, outer, { test: value => value === name }, innerLimits.maxBytes).bytes;
    const inner = inspectZip(innerBytes, innerLimits);
    expanded += inner.expandedBytes;
    if (expanded > 256 * MiB) throw new Error('AEMO NEM daily expanded size exceeds limit');
    const csvName = name.slice(0, -4) + '.csv';
    const csv = extractZipMember(innerBytes, inner, { test: value => value.toLowerCase() === csvName.toLowerCase() }, innerLimits.maxMemberBytes);
    const prices = new Map();
    parsePriceRows(csv.bytes.toString('utf8'), end, prices);
    for (const [region, point] of prices) byRegion[region].push(point);
  }
  return byRegion;
}
