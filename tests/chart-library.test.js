import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app/state.js';
import { chartMetadata, chartTableData, chartVintage, vintageLabel } from '../src/charts/accessibility.js';
import { formatNumber, formatDate } from '../src/utils/locale.js';
import { numberFormats, fmtUSDk, fmtIRR, fmtX } from '../src/utils/formatting.js';

test('chart names and descriptions use existing headings, axes and series in both languages', () => {
  const config = { title: ['Capacity', '容量'], xlabel: ['Year', '年份'], ylabel: ['Price', '价格'], series: [{ name: ['Award', '中标'] }] };
  try {
    for (const language of ['en', 'zh']){
      app.lang = language;
      const meta = chartMetadata(config, 'line');
      assert.equal(meta.title, language === 'en' ? 'Capacity' : '容量');
      for (const word of language === 'en' ? ['Year', 'Price', 'Award', 'Escape'] : ['年份', '价格', '中标', 'Escape']) assert.ok(meta.description.includes(word));
    }
    app.lang = 'en';
    assert.equal(chartMetadata({ series: config.series }, 'bar', 'Existing card').title, 'Existing card');
    assert.equal(chartMetadata({ series: config.series }, 'bar').title, 'Award');
    assert.equal(chartMetadata({}, 'waterfall').title, 'Waterfall chart');
  } finally { app.lang = 'en'; }
});

test('table data keeps plotted categories, series, precision, null gaps and bar coercion', () => {
  const cfg = { xs: ['a', 'b', 'c'], series: [{ name: ['One', '一'], vals: [1.23456789, null, -3] }, { name: ['Two', '二'], vals: [0, 5, 2] }] };
  const before = structuredClone(cfg);
  assert.deepEqual(chartTableData(cfg, 'line').rows.map(r => r[2]), [1.23456789, 0, null, 5, -3, 2]);
  assert.deepEqual(chartTableData(cfg, 'bar').rows.map(r => r[2]), [1.23456789, 0, 0, 5, -3, 2]);
  assert.deepEqual(chartTableData({ ...cfg, mode: 'stack' }, 'bar').rows, [['a', cfg.series[0].name, 1.23456789], ['b', cfg.series[1].name, 5], ['c', cfg.series[1].name, 2]]);
  assert.deepEqual(cfg, before);
  assert.deepEqual(chartTableData({ ...cfg, refs: [{ label: 'Target', y: 7.125 }] }, 'line').rows.at(-1), ['Reference', 'Target', 7.125]);
});

test('band, waterfall, scatter and exposure tables preserve the values that were plotted', () => {
  assert.deepEqual(chartTableData({ xs: ['a', 'b'], high: [8, 9], base: [5, 6], low: [2, 3], official: { i: 1, y: 7 } }, 'band').rows, [['a', 8, 5, 2, null], ['b', 9, 6, 3, 7]]);
  assert.deepEqual(chartTableData({ steps: [{ l: 'start', v: 10, t: 'start' }, { l: 'cost', v: -4, t: 'd' }, { l: 'total', v: 6, t: 'total' }] }, 'waterfall').rows, [['start', 10, 0, 10], ['cost', -4, 10, 6], ['total', 6, 0, 6]]);
  const pts = [{ label: 'a', x: 0, y: -2, tip: 'first' }, { label: 'b', x: 0, y: -2, tip: 'second' }];
  assert.equal(chartTableData({ pts }, 'scatter').rows.length, 2, 'overlapping points must not disappear from the table');
  assert.deepEqual(chartTableData({ pts }, 'scatter').rows.map(r => r.slice(0, 3)), [['a', 0, -2], ['b', 0, -2]]);
  const curve = { events: [{ label: 'Fee', month: { central: 2, fast: 1, slow: 3 }, before: 0, after: 1234.56, lowerBound: true }], firstRevenue: { central: 12, fast: 10, slow: 14 }, end: 1234.56 };
  const rows = chartTableData({ curves: [{ name: 'Market', curve }] }, 'exposure').rows;
  assert.deepEqual(rows[1], ['Market / Fee', 2, 1, 3, 0, 1234.56, true]);
  assert.equal(rows.at(-1)[5], curve.end);
  const decisionCurve = { ...curve, decision: { central: 6, fast: 4, slow: 9 } };
  assert.deepEqual(chartTableData({ curves: [{ name: 'Market', curve: decisionCurve }] }, 'exposure').rows[1], ['Market / Decision', 6, 4, 9, null, null, null]);
});

test('undated data has no stamp and dates never fall back to a clock or publication date', () => {
  for (const dataset of [undefined, {}, { vintage: '' }, { generatedAt: '2026-11-15', publishedAt: '2026-11-15' }]){
    assert.equal(chartVintage(dataset), null); assert.equal(vintageLabel(dataset), null);
  }
  assert.equal(chartVintage({ vintage: 'Hot Season 2025-26' }), 'Hot Season 2025-26');
  assert.equal(chartVintage({ asOf: 2026 }), '2026');
  assert.equal(vintageLabel({ snapshotDate: '2026-07-29' }), 'As of 29 Jul 2026');
  assert.equal(vintageLabel({ asOf: '2026-01-02' }), 'As of 2 Jan 2026');
  assert.equal(vintageLabel({ asOf: 'Jul 2026' }), 'As of Jul 2026');
  try {
    app.lang = 'zh';
    assert.equal(vintageLabel({ asOf: '2026-01-02' }), '截至 2026年1月2日');
    assert.equal(vintageLabel({ asOf: 'Jul 2026' }), '截至 2026年7月');
    assert.equal(vintageLabel({ asOf: '2026-07' }), '截至 2026年7月');
  }
  finally { app.lang = 'en'; }
});

test('English formats are byte-for-byte unchanged and existing formatter instances follow language switches', () => {
  for (const locale of ['en-US', 'en-GB', 'en-AU']){
    const { NF0, NF1, NF2, fmtN, fmtPct } = numberFormats(locale);
    for (const value of [-1234567.89, -0.5, 0, 1.005, 1234.56, 1e8]){
      assert.equal(NF0.format(value), new Intl.NumberFormat(locale).format(value));
      assert.equal(NF1.format(value), new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value));
      assert.equal(NF2.format(value), new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value));
      assert.equal(fmtN(value), new Intl.NumberFormat(locale).format(Math.round(value)));
      assert.equal(fmtPct(value), NF1.format(value) + '%');
    }
  }
  assert.equal(fmtUSDk(1234567), '$1,235k'); assert.equal(fmtIRR(.143), '14.3%'); assert.equal(fmtX(1.55), '1.55×');
  const date = new Date('2026-01-02T00:00:00Z'), options = { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' };
  for (const locale of ['en-GB', 'en-US']) assert.equal(formatDate(date, options, locale), date.toLocaleDateString(locale, options));
  const formatter = numberFormats('en-US').NF0;
  try {
    app.lang = 'zh';
    assert.equal(formatter.format(NaN), new Intl.NumberFormat('zh-CN').format(NaN));
    assert.equal(formatNumber(1234.56), new Intl.NumberFormat('zh-CN').format(1234.56));
    assert.equal(formatDate(date, options), date.toLocaleDateString('zh-CN', options));
  } finally { app.lang = 'en'; }
});
