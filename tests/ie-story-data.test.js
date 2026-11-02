/* Ireland: the fixed-vintage records behind the story (ie-build-evidence §3).
   These assertions are about provenance and the rights gate, not about whether
   the numbers look right: a value that is not cleared must not be here at all. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { IE_CRM_AUCTIONS as crm, IE_CRM_DATASETS } from '../src/markets/ie/data/crmAuctions.js';
import { IE_STORY_EVIDENCE as ev, IE_STORY_DATASETS, IE_SOURCES, percent } from '../src/markets/ie/data/storyEvidence.js';

const ROOT = new URL('../src/markets/ie/data/', import.meta.url);
const text = (name) => readFileSync(new URL(name, ROOT), 'utf8');

/** Every object in a tree that carries a `source`, with its path. */
function observations(node, path = '', out = []) {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) { node.forEach((n, i) => observations(n, `${path}[${i}]`, out)); return out; }
  if (node.source) out.push([path, node]);
  for (const [k, v] of Object.entries(node)) if (k !== 'source') observations(v, path ? `${path}.${k}` : k, out);
  return out;
}

test('both records are fixed-vintage, analyst-entered and bound to no financial input', () => {
  for (const record of [crm, ev]) {
    assert.equal(record.kind, 'fixed-vintage-table');
    assert.equal(record.entry, 'analyst-entered');
    assert.match(record.refresh, /review/);
    assert.deepEqual(record.bearsOn, []);
    assert.match(record.vintage, /^\d{4}-\d{2}-\d{2}$/);
    assert.doesNotMatch(record.refresh, /six-hour|hourly|scheduled/);
  }
  assert.equal(IE_CRM_DATASETS[crm.id], crm);
  assert.equal(IE_STORY_DATASETS[ev.id], ev);
  assert.equal(crm.vintage, '2026-11-02');
});

test('every observation carries a primary locator, a unit and a check date', () => {
  for (const [path, field] of observations(ev)) {
    assert.ok(field.source.url.startsWith('https://') || field.source.url.startsWith('/'), `${path} url`);
    assert.ok(field.source.locator.length > 25, `${path} locator`);
    assert.match(field.source.checkedOn, /^\d{4}-\d{2}-\d{2}$/, `${path} checkedOn`);
    assert.ok(field.unit, `${path} unit`);
    assert.ok(field.authority, `${path} authority`);
  }
  for (const row of crm.rows) {
    for (const key of ['auctionDate', 'price', 'credit2h', 'credit4h', 'batteryNewMW', 'batteryExistingMW', 'batteryTotalMW']) {
      const field = row[key];
      assert.ok(field.source.locator.length > 10, `${row.deliveryYear} ${key} locator`);
      assert.ok(field.unit, `${row.deliveryYear} ${key} unit`);
    }
  }
  for (const [path, field] of observations(crm, 'crm')) {
    assert.ok(field.source.locator.length > 10, `${path} locator`);
    assert.match(field.source.checkedOn, /^\d{4}-\d{2}-\d{2}$/, `${path} checkedOn`);
  }
});

test('the rights gate holds: no CRM price, credit, award or participation value ships', () => {
  assert.equal(crm.valuesWithheld, true);
  assert.equal(crm.rights.status, 'unresolved');
  assert.equal(crm.rights.basisUrl, null);
  assert.equal(crm.rights.checkedOn, null);
  assert.equal(crm.chart.quantitativeReady, false);
  assert.equal(crm.chart.mode, 'example');
  assert.match(crm.chart.fallback[0], /^Example: price and storage credit$/);
  assert.match(crm.chart.fallback[1], /^示例：价格与储能计入比例$/);

  const numeric = [];
  const walk = (node, path = '') => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach((n, i) => walk(n, `${path}[${i}]`));
    if ('value' in node && typeof node.value === 'number') numeric.push(path);
    for (const [k, v] of Object.entries(node)) if (k !== 'source') walk(v, path ? `${path}.${k}` : k);
  };
  walk(crm);
  /* Three numbers, all chart scope rather than observation: the fixed context
     duration and the two band limits. Anything else would be a published value. */
  assert.deepEqual(numeric.sort(), ['contextHours', 'initialCapacityBand.lowerExclusiveMW', 'initialCapacityBand.upperInclusiveMW']);

  for (const row of crm.rows) for (const key of ['price', 'credit2h', 'credit4h', 'batteryNewMW', 'batteryExistingMW', 'batteryTotalMW']) {
    assert.equal(row[key].value, null, `${row.deliveryYear} ${key}`);
  }
  for (const key of ['qualifiedNewMW', 'offeredNewMW', 'offeredNewShare', 'qualifiedProjects', 'offeredProjects', 'successfulProjects']) {
    assert.equal(crm.participation[key].value, null, key);
  }
});

test('the restricted series is absent from the module text, not merely unrendered', () => {
  const source = text('crmAuctions.js');
  for (const withheld of ['135499', '135,499', '149960', '149,960', '106666', '106,667', '83050', '83,050', '46,150', '46150', '210.663', '42.514', '25.594', '132.462', '105.245', '18.553', '38.752', '.277', '0.277', '0.151', '0.291', '0.585', '0.721']) {
    assert.ok(!source.includes(withheld), `${withheld} belongs to the withheld layer`);
  }
});

test('the nulls keep their separate reasons instead of collapsing to zero', () => {
  const last = crm.rows.at(-1);
  assert.equal(last.deliveryYear, '2030/31');
  assert.equal(last.status, 'initial-pack');
  assert.equal(last.price.value, null);
  assert.match(last.price.reason, /Auction not held/);
  assert.equal(last.batteryNewMW.value, null);
  assert.deepEqual(crm.rows.filter(r => r.gapIds.includes('GAP-IE-CRM')).map(r => r.deliveryYear),
    ['2022/23', '2023/24', '2024/25', '2025/26']);
  assert.equal(ev.ds3.successorStartDate.value, null);
  assert.equal(ev.map.interconnectorMW, null);
  assert.equal(ev.map.interconnectorCount, null);
  assert.equal(ev.map.celticExpectedYear, null);
  assert.equal(ev.excluded.responseTimes, null);
  assert.equal(ev.excluded.serviceTariffs, null);
  assert.equal(ev.excluded.firstCapacityAuctionDate, null);
  assert.equal(ev.dataCentres.year.value, 2025);
});

test('the evidence values are the ones the script binds, with their arithmetic', () => {
  assert.deepEqual(Object.keys(ev.history), ['H-IE-01', 'H-IE-02', 'H-IE-03', 'H-IE-04', 'H-IE-05', 'H-IE-06']);
  assert.deepEqual(ev.history['H-IE-01'].eventDate.value, '2007-11-01');
  assert.deepEqual(ev.history['H-IE-02'].eventDate.value, '2011');
  assert.deepEqual(ev.history['H-IE-03'].eventDate.value, '2018-10-01');
  assert.deepEqual(ev.history['H-IE-04'].eventDate.value, '2019');
  assert.deepEqual(ev.history['H-IE-05'].eventDate.value, '2022-03');
  assert.deepEqual(ev.history['H-IE-06'].eventDate.value, '2025-06-23');
  assert.deepEqual(ev.snsp.steps.map(s => s.limitShare.value), [.65, .7, .75]);
  assert.deepEqual(ev.snsp.steps.map(s => s.date), ['2018', '2021', '2022-03']);
  assert.equal(ev.vc.awardedMW.value, 110);
  assert.equal(ev.vc.winnerCount.value, 3);
  assert.equal(ev.vc.serviceCodes.length, ev.vc.serviceCount.value);
  assert.deepEqual(ev.vc.serviceCodes, ['FFR', 'POR', 'SOR', 'TOR1', 'TOR2']);
  assert.equal(ev.ds3.longStopDate.value, '2027-09-30');
  assert.equal(ev.ro.maxYears.value, 10);
  assert.match(ev.ro.maxYears.conditional, /approval/);
  assert.equal(ev.dataCentres.share.value, .23);
  assert.equal(ev.crmRedesign.mainLeadYears.value, 5);
  assert.equal(ev.crmRedesign.topUpLeadYears.value, 1);
  assert.equal(ev.crmRedesign.status, 'proposal');
  assert.equal(percent(ev.dataCentres.share.value), '23%');
  assert.equal(percent(null), null);
});

test('the three open gaps and the chart gate stay recorded', () => {
  assert.deepEqual(Object.keys(ev.gaps).sort(), ['GAP-IE-CRM', 'GAP-IE-DS3-TERMS', 'GAP-IE-LINKS']);
  for (const gap of Object.values(ev.gaps)) {
    assert.equal(gap.status, 'open');
    assert.ok(gap.fallback.length > 20);
    assert.ok(gap.closes.length > 20);
  }
  assert.equal(crm.gaps['GAP-IE-CRM'].status, 'open');
  assert.match(crm.gaps['GAP-IE-CRM'].fallback, /2026\/27–2029\/30/);
});

test('the source register resolves every citation and adds no participant identity', () => {
  for (const [id, source] of Object.entries(IE_SOURCES)) {
    assert.equal(source.title.length > 3, true, id);
    assert.ok(source.url, id);
    assert.match(source.checkedOn, /^\d{4}-\d{2}-\d{2}$/, id);
  }
  const cited = new Set([...observations(ev)].map(([, f]) => f.source.id));
  for (const id of cited) assert.ok(IE_SOURCES[id], `${id} has no source record`);
  assert.equal(ev.vc.winnerCount.authority, 'observed');
});
