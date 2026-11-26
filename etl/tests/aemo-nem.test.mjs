import test from 'node:test';
import assert from 'node:assert/strict';
import { DATASETS } from '../../src/governance/datasets.js';
import { zipFixture } from '../../tests/helpers/eia-inventory-fixture.mjs';
import { parseDispatchArchive, REGIONS } from '../lib/aemo-nem-dispatch.mjs';
import { createRun, incompleteSourceDays } from '../sources/aemo-nem.mjs';
import { providerLimit } from '../lib/concurrency.mjs';
import { completeTariffDays, trailingBillingYear } from '../../src/derive/networkValue.js';

const sourceDay = '2026-11-24';
const now = '2026-11-26T06:17:00.000Z';
const start = '2026-11-23T14:00:00.000Z';
const datasets = DATASETS.filter(d => d.connector === 'aemo-nem');

function archive(points) {
  const name = 'PUBLIC_DISPATCHIS_202611240005_0000000000000001';
  const header = 'I,DISPATCH,PRICE,5,SETTLEMENTDATE,REGIONID,INTERVENTION,ROP,RRP,PRICE_STATUS';
  const payload = [header, ...points.map(r => 'D,DISPATCH,PRICE,5,"2026/11/24 00:05:00",' + r)].join('\r\n');
  return zipFixture([{ name:name+'.zip', bytes:zipFixture([{ name:name+'.CSV', bytes:payload }]) }]);
}

test('read adjusted market prices at interval start, preserving zero, negative and publication status', () => {
  const rows = parseDispatchArchive(archive(['NSW1,0,38,0,FIRM', 'SA1,0,7,-20,NOT FIRM', 'SA1,1,9,9,FIRM']), sourceDay);
  assert.deepEqual(rows.NSW1, [{t:start, v:0}]);
  assert.deepEqual(rows.SA1, [{t:start, v:-20, dispatchStatus:'NOT FIRM'}]);
  assert.deepEqual(rows.TAS1, []);
  assert.throws(() => parseDispatchArchive(archive(['NSW1,0,3,,FIRM']), sourceDay), /invalid/);
  assert.throws(() => parseDispatchArchive(archive(['NSW1,0,3,38,FIRM','NSW1,0,3,39,FIRM']), sourceDay), /conflicting/);
  assert.throws(() => parseDispatchArchive(archive(['NSW1,0,3,38,FIRM']), '2026-11-23'), /outside/);
});

test('a source day requires all 288 five-minute positions in NEM time', () => {
  const points = Array.from({ length:288 }, (_, i) => ({t:new Date(Date.parse(start) + i*300_000).toISOString(),v:0}));
  assert.deepEqual(incompleteSourceDays(points, now, 1), []);
  assert.deepEqual(incompleteSourceDays([...points.slice(1),points[1]],now,1),[sourceDay]);
});

test('the five regions share both archive reads and their backfill budget', async () => {
  assert.equal(datasets.length, 5);
  assert.equal(providerLimit('aemo-nem', {'aemo-nem':5}), 1);
  assert.deepEqual(datasets.filter(d=>d.bearsOn.length).map(d=>d.id), ['nem-nsw1-prices']);
  const calls = [];
  const reader = createRun({ maxDays:1, windowDays:10, readDay:async day => {
    calls.push(day);
    return Object.fromEntries(REGIONS.map(region => [region,[{t:start,v:0}]]));
  }});
  for (const dataset of datasets) {
    const {snapshot} = await reader.fetchDataset({dataset, now});
    assert.equal(snapshot.series.length, 1);
    assert.deepEqual(snapshot.units, {price:'AUD/MWh'});
    assert.equal(snapshot.coverage.resolution, 'PT5M');
    const summary = reader.summarize(snapshot);
    assert.equal(summary.dispatch.completeDays, 0);
    assert.deepEqual(summary.daily, []);
    assert.equal(summary.arbitrage, null);
  }
  assert.deepEqual(calls, [sourceDay]);
});

test('NEM archives cover a full local billing year at shifted midnights and across leap day', () => {
  for (const [date, count] of [[now, 365], ['2024-06-26T06:17:00Z', 366]]) {
    const missing = incompleteSourceDays([], date);
    const first = Date.parse(missing.at(-1) + 'T00:00:00+10:00');
    const points = Array.from({ length: missing.length * 288 }, (_, i) => ({ t: new Date(first + i * 300_000).toISOString(), v: 40 }));
    for (const zone of ['Australia/Brisbane', 'Australia/Adelaide', 'Australia/Melbourne']) {
      const days = trailingBillingYear(completeTariffDays(points, zone));
      assert.equal(days.length, count, zone + ' at ' + date);
      assert.equal((Date.parse(days.at(-1).date) - Date.parse(days[0].date)) / 86_400_000, count - 1);
    }
  }
});

test('a refused source is attempted once across regions and a previous series is preserved', async () => {
  let calls=0;
  const reader = createRun({readDay:async()=>{calls++; throw Error('download: HTTP 403');}});
  for(const dataset of datasets) {
    const result = await reader.fetchDataset({dataset,now,previous:{series:[{t:start,v:20}]}});
    assert.equal(result.skipped,true);
  }
  assert.equal(calls,1);
});
