/* ERCOT fixed-vintage story data. These tests transcribe the approved field
   list and gates; they do not read a workspace-only document, carry withheld
   candidate arrays or generate fixtures. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  ERCOT_STORY_META as meta,
  ERCOT_STORY_SOURCES as sources,
  ERCOT_STORY_RECORDS as records,
  ERCOT_DC_TIES as dcTies,
  ERCOT_OFFER_CAP as offerCap,
  ERCOT_CONNECTION as connection,
  ERCOT_FLEET as fleet,
  ERCOT_MONITOR_CHECKS as monitorChecks,
  ERCOT_FLEET_DURATION_2025 as fleetDuration2025,
  ERCOT_PRICES as prices,
  ERCOT_REVENUE_PER_KW_2025 as revenuePerKW2025,
  ERCOT_ORDC_2025 as ordc2025,
  ERCOT_RESERVE_RULES as reserveRules,
  ERCOT_HISTORY as history,
  eligibleErcotFleetPoints,
  eligibleErcotPricePoints,
} from '../src/markets/ercot/data/storyEvidence.js';

const SOURCE = readFileSync(new URL('../src/markets/ercot/data/storyEvidence.js', import.meta.url), 'utf8');
const YEARS = [2021, 2022, 2023, 2024, 2025];
const PRODUCTS = ['rrs', 'nonSpin', 'regUp', 'regDown', 'ecrs'];
const SOURCE_IDS = ['SRC-ERCOT-01', 'SRC-ERCOT-02', 'SRC-ERCOT-03', 'SRC-ERCOT-04', 'SRC-ERCOT-05', 'SRC-ERCOT-06', 'SRC-ERCOT-07', 'SRC-ERCOT-08', 'SRC-ERCOT-10', 'SRC-ERCOT-14', 'SRC-ERCOT-19', 'SRC-ERCOT-WB'];
const at = (root, path) => path.split('.').reduce((node, key) => node?.[key], root);

test('the record set is fixed-vintage, analyst-entered and bears on no model input', () => {
  assert.equal(records.id, 'ercot-story-evidence');
  assert.equal(records.marketId, 'ercot');
  assert.equal(records.kind, 'fixed-vintage-table');
  assert.equal(records.entry, 'analyst-entered');
  assert.equal(records.schemaVersion, 1);
  assert.equal(records.vintage, '2026-11-02');
  assert.equal(records.checkedOn, '2026-11-02');
  assert.match(records.refresh, /review/);
  assert.doesNotMatch(records.refresh, /six-hour|hourly|scheduled/);
  assert.deepEqual(records.bearsOn, []);
  assert.equal(records.sources, sources);
  assert.deepEqual(meta, {
    id: records.id, marketId: records.marketId, kind: records.kind, entry: records.entry,
    schemaVersion: records.schemaVersion, vintage: records.vintage, checkedOn: records.checkedOn,
    refresh: records.refresh, bearsOn: records.bearsOn,
  });
});

test('every source has a complete envelope and per-document reuse/check dates', () => {
  assert.deepEqual(Object.keys(sources), SOURCE_IDS);
  for (const [id, source] of Object.entries(sources)) {
    for (const key of ['publisher', 'title', 'url', 'publishedOn', 'effectiveOn', 'coverage', 'language', 'access', 'checkedOn', 'lastAttemptOn']) {
      assert.ok(key in source, `${id}: ${key}`);
    }
    for (const key of ['from', 'to']) assert.ok(key in source.coverage, `${id}: coverage.${key}`);
    for (const key of ['document', 'pdfPage', 'printedPage', 'section', 'table', 'row', 'column', 'sheet', 'cell', 'clause']) {
      assert.ok(key in source.locator, `${id}: locator.${key}`);
    }
    for (const key of ['status', 'permitsNumericPublication', 'basisUrl', 'basisLocator', 'attribution', 'constraints']) {
      assert.ok(key in source.reuse, `${id}: reuse.${key}`);
    }
    assert.equal(source.reuse.basisUrl, null, `${id}: no invented permission URL`);
    if (source.reuse.permitsNumericPublication) assert.ok(source.reuse.basisLocator, `${id}: numeric basis locator`);
    if (source.checkedOn) assert.match(source.checkedOn, /^\d{4}-\d{2}-\d{2}$/, `${id}: successful check date`);
    assert.match(source.lastAttemptOn, /^\d{4}-\d{2}-\d{2}$/, `${id}: last attempt date`);
  }
  assert.equal(sources['SRC-ERCOT-01'].publishedOn, '2026-05');
  for (const id of ['SRC-ERCOT-01', 'SRC-ERCOT-02', 'SRC-ERCOT-03', 'SRC-ERCOT-05']) assert.equal(sources[id].checkedOn, '2026-11-02', id);
  for (const id of ['SRC-ERCOT-04', 'SRC-ERCOT-06', 'SRC-ERCOT-07', 'SRC-ERCOT-08', 'SRC-ERCOT-10']) assert.equal(sources[id].checkedOn, '2026-10-31', id);
  for (const id of ['SRC-ERCOT-14', 'SRC-ERCOT-19', 'SRC-ERCOT-WB']) assert.equal(sources[id].checkedOn, null, id);
  assert.match(sources['SRC-ERCOT-06'].access, /402/);
  assert.match(sources['SRC-ERCOT-10'].access, /size limit/);
  assert.equal(sources['SRC-ERCOT-14'].lastAttemptOn, '2026-11-02');
  assert.deepEqual(sources['SRC-ERCOT-19'].coverage, { from: '2014', to: '2014' });
});

test('DC ties retain transfer capability and recompute the approved totals', () => {
  assert.equal(dcTies.spp.count, 2);
  assert.equal(dcTies.spp.transferMW, 820);
  assert.equal(dcTies.mexico.count, 2);
  assert.equal(dcTies.mexico.transferMW, 400);
  assert.equal(dcTies.totalCount, dcTies.spp.count + dcTies.mexico.count);
  assert.equal(dcTies.totalTransferMW, dcTies.spp.transferMW + dcTies.mexico.transferMW);
  assert.equal(dcTies.totalCount, 4);
  assert.equal(dcTies.totalTransferMW, 1220);
  for (const group of [dcTies.spp, dcTies.mexico]) {
    assert.match(group.qualifier, /not observed flow/);
    assert.equal(group.locator.printedPage, 36);
    assert.equal(group.locator.pdfPage, 58);
    assert.equal(group.locator.section, '§II.H');
  }
});

test('offer-cap and connection records retain approved dates, cohort and limits', () => {
  assert.equal(offerCap.currentUSDPerMWh, 5000);
  assert.equal(offerCap.priorUSDPerMWh, 9000);
  assert.equal(offerCap.adoptedOn, '2021-12-02');
  assert.equal(offerCap.effectiveOn, '2022');
  assert.equal(offerCap.datePrecision, 'adoption day; effective year');
  assert.match(offerCap.qualifier, /effective day unverified/);
  assert.equal(connection.meanRequestToAgreementMonths, 24);
  assert.equal(connection.requestCohortFromYear, 2010);
  assert.equal(connection.dataThroughYear, 2025);
  assert.match(connection.qualifier, /not COD time or a project promise/);
  assert.deepEqual(connection.locator.pdfPage, [44, 47]);
});

test('the operator fleet series is wholly null with explicit unresolved cells and definitions', () => {
  assert.equal(fleet.publicationReady, false);
  assert.deepEqual(eligibleErcotFleetPoints(), []);
  for (const year of YEARS) {
    const row = fleet[year];
    assert.equal(row.id, `fleet-${year}`);
    assert.equal(row.installedMW, null, `${year}: no candidate operator MW`);
    assert.equal(row.year, year);
    assert.equal(row.period, `December ${year}`);
    assert.equal(row.datePrecision, 'end-year');
    assert.match(row.measure, /commercial operation approved/);
    assert.match(row.definition, /commercial operation approved/);
    assert.equal(row.sourceId, 'SRC-ERCOT-WB');
    assert.equal(row.sourceVintage, null);
    assert.equal(row.locator.sheet, null);
    assert.equal(row.locator.table, null);
    assert.equal(row.locator.row, null);
    assert.equal(row.locator.column, null);
    assert.equal(row.locator.cell, null);
    assert.equal(row.differenceMW, null);
    assert.equal(row.differencePct, null);
    assert.match(row.comparisonStatus, /blocked/);
    assert.match(row.disposition, /do not substitute monitor stock/);
    assert.match(row.open.gate, /definition/);
  }
});

test('monitor checks retain each report vintage, rounded values and the 2025 bound', () => {
  assert.deepEqual(YEARS.map((year) => monitorChecks[year].mw), [1600, 2700, 4400, 9505, 17000]);
  assert.deepEqual(YEARS.map((year) => monitorChecks[year].qualifier), ['rounded', 'rounded', 'rounded', null, null]);
  assert.deepEqual(YEARS.map((year) => monitorChecks[year].sourceId), ['SRC-ERCOT-01', 'SRC-ERCOT-05', 'SRC-ERCOT-03', 'SRC-ERCOT-02', 'SRC-ERCOT-01']);
  assert.equal(monitorChecks[2025].comparator, 'gt');
  for (const year of YEARS) {
    const row = monitorChecks[year];
    assert.equal(row.datePrecision, 'end-year');
    assert.match(row.scope, /not the operator observation series/);
    assert.ok(row.sourceVintage.includes('State of the Market Report'));
    assert.equal(row.checkedOn, sources[row.sourceId].checkedOn);
    assert.equal(row.approximate, year <= 2023);
  }
  assert.equal(monitorChecks[2023].locator.pdfPage, 11);
  assert.equal(monitorChecks[2024].locator.pdfPage, 60);
  assert.match(monitorChecks[2023].calculation.formula, /do not reconstruct stock/);
});

test('fleet duration is a direct monitor record, not a derivation from fleet totals', () => {
  assert.equal(fleetDuration2025.hours, 1.83);
  assert.equal(fleetDuration2025.year, 2025);
  assert.equal(fleetDuration2025.approximate, false);
  assert.equal(fleetDuration2025.locator.printedPage, 21);
  assert.equal(fleetDuration2025.locator.pdfPage, 43);
  assert.match(fleetDuration2025.calculation.formula, /^direct 1\.83 hours/);
  assert.match(fleetDuration2025.calculation.formula, /no derivation/);
});

test('all five products and years exist with independent rights and structural nulls', () => {
  assert.equal(prices.publicationReady, false);
  assert.deepEqual(Object.keys(prices.products), PRODUCTS);
  assert.deepEqual(eligibleErcotPricePoints(), []);
  for (const product of PRODUCTS) {
    assert.deepEqual(Object.keys(prices.products[product].annual), YEARS.map(String));
    for (const year of YEARS) {
      const row = prices.products[product].annual[year];
      assert.equal(row.usdPerMWPerHour, null, `${product} ${year}`);
      assert.equal(row.productId, product);
      assert.equal(row.year, year);
      assert.equal(row.sourceId, 'SRC-ERCOT-01');
      assert.equal(row.sourceVintage, '2025 State of the Market Report, May 2026');
      assert.equal(row.sourcePrintedUnit, '$/MWh');
      assert.equal(row.unit, 'USD per MW held ready per hour');
      assert.match(row.coverageNote, /not .*captured revenue/);
      assert.equal(row.locator.printedPage, 40);
      assert.equal(row.locator.pdfPage, 62);
      assert.equal(row.locator.row, product);
      assert.equal(row.locator.column, String(year));
      assert.match(row.calculation.formula, /identity transcription only/);
      if (product === 'ecrs' && year < 2023) {
        assert.equal(row.status, 'not-yet-launched');
        assert.equal(row.open.gate, 'structural');
      } else {
        assert.equal(row.status, 'withheld');
        assert.equal(row.open.gate, 'rights + visual-table-verification');
      }
    }
  }
  assert.match(prices.products.ecrs.annual[2023].coverageNote, /June launch/);
  assert.match(prices.products.ecrs.annual[2025].coverageNote, /only one month/);
});

test('no hidden numeric candidate array ships inside the gated fleet or price records', () => {
  const numericPaths = [];
  const walk = (node, path = '') => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach((item, index) => walk(item, `${path}[${index}]`));
    for (const [key, value] of Object.entries(node)) {
      if (key === 'locator') continue;
      const child = path ? `${path}.${key}` : key;
      if (typeof value === 'number') numericPaths.push(child);
      else walk(value, child);
    }
  };
  walk({ fleet, prices });
  assert.ok(numericPaths.length > 0);
  for (const path of numericPaths) assert.match(path, /\.year$/, `${path}: gated records may carry year coordinates only`);
});

test('revenue and ORDC records retain almost and less-than semantics', () => {
  assert.equal(revenuePerKW2025.declineMagnitudePct, 37);
  assert.equal(revenuePerKW2025.qualifier, 'almost');
  assert.equal(revenuePerKW2025.approximate, true);
  assert.equal(revenuePerKW2025.comparisonYear, 2024);
  assert.equal(revenuePerKW2025.year, 2025);
  assert.equal(revenuePerKW2025.locator.printedPage, 22);
  assert.equal(revenuePerKW2025.locator.pdfPage, 44);
  assert.equal(ordc2025.activeHours, 57);
  assert.equal(ordc2025.averagePriceAdderUpperBoundUSDPerMWh, 0.02);
  assert.equal(ordc2025.comparator, 'lt');
  assert.equal(ordc2025.year, 2025);
  assert.equal(ordc2025.locator.printedPage, 8);
  assert.equal(ordc2025.locator.pdfPage, 30);
});

test('reserve durations use approved rows, gate the candidate effective day and leave Reg-Down unresolved', () => {
  assert.equal(reserveRules.regUp.durationMinutes, 30);
  assert.equal(reserveRules.rrs.durationMinutes, 30);
  assert.equal(reserveRules.ecrs.durationMinutes, 60);
  assert.equal(reserveRules.nonSpin.durationMinutes, 240);
  assert.equal(reserveRules.regDown.durationMinutes, null);
  assert.match(reserveRules.regDown.open.note, /Do not infer/);
  assert.equal(reserveRules.effectiveOn, '2025-12-05');
  assert.equal(reserveRules.open.gate, 'operator-rule-verification');
  assert.match(reserveRules.open.note, /candidate effective day remains pending/);
  for (const product of ['regUp', 'rrs', 'ecrs', 'nonSpin', 'regDown']) {
    assert.equal(reserveRules[product].locator.printedPage, 'A-3');
    assert.equal(reserveRules[product].locator.pdfPage, 161);
    assert.equal(reserveRules[product].locator.table, 'Table A1');
  }
});

test('six history nodes retain the approved event, adoption, closure and precision fields', () => {
  assert.deepEqual(Object.keys(history), ['H-ERCOT-01', 'H-ERCOT-02', 'H-ERCOT-03', 'H-ERCOT-04', 'H-ERCOT-05', 'H-ERCOT-06']);
  for (const [id, node] of Object.entries(history)) {
    assert.equal(node.id, id);
    assert.ok(Array.isArray(node.dates) && node.dates.length > 0, id);
    assert.ok(node.datePrecision, id);
    assert.ok(node.sources.length > 0, id);
    assert.ok(node.locators.length > 0, id);
    assert.ok(node.kind, id);
    for (const sourceId of node.sources) assert.ok(sources[sourceId], `${id}: ${sourceId}`);
  }
  assert.deepEqual(history['H-ERCOT-01'].dates, ['2014']);
  assert.equal(history['H-ERCOT-01'].datePrecision, 'year');
  assert.deepEqual(history['H-ERCOT-02'].dates, ['2021-02-15', '2021-02-19']);
  assert.equal(history['H-ERCOT-02'].kind, 'event-range');
  assert.equal(history['H-ERCOT-03'].adoptedOn, '2021-12-02');
  assert.equal(history['H-ERCOT-03'].effectiveOn, '2022');
  assert.equal(history['H-ERCOT-04'].adoptedOn, '2023-01-19');
  assert.equal(history['H-ERCOT-04'].closedOn, '2024-12-19');
  assert.equal(history['H-ERCOT-04'].kind, 'closed-branch');
  assert.deepEqual(history['H-ERCOT-05'].dates, ['2023-06-10']);
  assert.deepEqual(history['H-ERCOT-06'].dates, ['2025-12-05']);
});

test('the complete evidence field-list interface exists, including explicit nulls', () => {
  const paths = [
    'id', 'marketId', 'kind', 'entry', 'schemaVersion', 'vintage', 'checkedOn', 'refresh', 'bearsOn',
    'dcTies.spp.count', 'dcTies.spp.transferMW', 'dcTies.mexico.count', 'dcTies.mexico.transferMW', 'dcTies.totalCount', 'dcTies.totalTransferMW',
    'offerCap.currentUSDPerMWh', 'offerCap.priorUSDPerMWh', 'offerCap.adoptedOn', 'offerCap.effectiveOn',
    'connection.meanRequestToAgreementMonths', 'connection.requestCohortFromYear', 'connection.dataThroughYear',
    'fleet.publicationReady', 'fleetDuration2025.hours', 'fleetDuration2025.year',
    'revenuePerKW2025.declineMagnitudePct', 'revenuePerKW2025.qualifier', 'revenuePerKW2025.comparisonYear', 'revenuePerKW2025.year',
    'ordc2025.activeHours', 'ordc2025.averagePriceAdderUpperBoundUSDPerMWh', 'ordc2025.comparator', 'ordc2025.year',
    'reserveRules.regUp.durationMinutes', 'reserveRules.rrs.durationMinutes', 'reserveRules.ecrs.durationMinutes',
    'reserveRules.nonSpin.durationMinutes', 'reserveRules.regDown.durationMinutes', 'reserveRules.effectiveOn', 'prices.publicationReady',
  ];
  const datumKeys = ['id', 'sourceIds', 'datePrecision', 'measure', 'scope', 'unit', 'status', 'approximate', 'comparator', 'qualifier', 'locator', 'calculation.inputs', 'calculation.formula', 'calculation.rounding', 'calculation.reviewStatus'];
  const valueRecords = [dcTies, dcTies.spp, dcTies.mexico, offerCap, connection, fleetDuration2025, revenuePerKW2025, ordc2025, reserveRules];
  for (const year of YEARS) valueRecords.push(fleet[year], monitorChecks[year]);
  for (const product of PRODUCTS) {
    valueRecords.push(reserveRules[product]);
    for (const year of YEARS) valueRecords.push(prices.products[product].annual[year]);
  }
  valueRecords.forEach((record, index) => {
    assert.ok(record.year !== undefined || record.period !== undefined, `datum ${index}: year or period`);
    for (const key of datumKeys) assert.notEqual(at(record, key), undefined, `datum ${record.id || index}: ${key}`);
  });
  for (const year of YEARS) {
    for (const key of ['installedMW', 'year', 'period', 'definition', 'sourceId', 'comparatorSourceId', 'sourceVintage', 'differenceMW', 'differencePct', 'comparisonStatus', 'disposition']) {
      paths.push(`fleet.${year}.${key}`);
    }
    paths.push(`monitorChecks.${year}.mw`, `monitorChecks.${year}.qualifier`, `monitorChecks.${year}.sourceVintage`, `monitorChecks.${year}.checkedOn`);
    for (const product of PRODUCTS) for (const key of ['usdPerMWPerHour', 'productId', 'year', 'sourceId', 'sourceVintage', 'unit', 'sourcePrintedUnit', 'coverageNote', 'locator']) {
      paths.push(`prices.products.${product}.annual.${year}.${key}`);
    }
  }
  for (const id of SOURCE_IDS) for (const key of ['publisher', 'title', 'url', 'language', 'locator', 'publishedOn', 'effectiveOn', 'coverage.from', 'coverage.to', 'checkedOn', 'lastAttemptOn', 'access', 'reuse.status', 'reuse.basisUrl', 'reuse.basisLocator', 'reuse.attribution', 'reuse.constraints']) {
    paths.push(`sources.${id}.${key}`);
  }
  for (let i = 1; i <= 6; i += 1) for (const key of ['id', 'dates', 'datePrecision', 'sources', 'locators', 'kind']) {
    paths.push(`history.H-ERCOT-${String(i).padStart(2, '0')}.${key}`);
  }
  for (const path of paths) assert.notEqual(at(records, path), undefined, `missing field-list path: ${path}`);
});

test('every published numeric observation has a locator and a numerically cleared source', () => {
  const numeric = [];
  const walk = (node, path = '', context = {}) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach((item, index) => walk(item, `${path}[${index}]`, context));
    const next = {
      locator: node.locator || context.locator,
      sourceIds: node.sourceIds || (node.sourceId ? [node.sourceId] : context.sourceIds),
    };
    for (const [key, value] of Object.entries(node)) {
      const childPath = path ? `${path}.${key}` : key;
      if (['sources', 'locator', 'locators'].includes(key)) continue;
      if (typeof value === 'number' && !['year', 'schemaVersion'].includes(key)) numeric.push([childPath, next]);
      else walk(value, childPath, next);
    }
  };
  walk(records);
  assert.ok(numeric.length > 20);
  for (const [path, context] of numeric) {
    assert.ok(context.locator, `${path}: locator`);
    assert.ok(context.sourceIds?.length, `${path}: source`);
    assert.ok(context.sourceIds.some((id) => sources[id]?.reuse.permitsNumericPublication), `${path}: numeric reuse basis`);
  }
});

test('the chart gates and module scope stay independent', () => {
  assert.equal(fleet.publicationReady, false);
  assert.equal(prices.publicationReady, false);
  assert.notEqual(fleet.open, prices.open);
  for (const key of ['dcTies', 'offerCap', 'connection', 'fleet', 'monitorChecks', 'fleetDuration2025', 'prices', 'revenuePerKW2025', 'ordc2025', 'reserveRules', 'history']) {
    assert.ok(key in records, key);
  }
  assert.doesNotMatch(SOURCE, /ERCOT_TEACHING|powerMW|MORA|toll proxy|future trigger/);
});
