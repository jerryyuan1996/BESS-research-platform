import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  MARKET_FORECAST_COVERAGE, forecastCoverageForMarket, validateForecastCoverage,
} from '../src/forecast/marketCoverage.js';
import {
  SOURCE_REGISTRY, sourceById, sourcesForMarket, validateSourceRegistry,
} from '../src/governance/sourceRegistry.js';
import {
  metricsForMarket, validateMetricRegistry,
} from '../src/governance/metrics.js';
import { JP_NATIONAL } from '../src/markets/jp/national.js';

test('every research dashboard has a governed forecast release contract', () => {
  assert.deepEqual(validateForecastCoverage(), []);
  assert.deepEqual(Object.keys(MARKET_FORECAST_COVERAGE), ['wa', 'gb', 'ie', 'ro', 'pl', 'jp']);
  assert.equal(forecastCoverageForMarket('jp_tokyo'), MARKET_FORECAST_COVERAGE.jp);
  assert.equal(forecastCoverageForMarket('jp_kyushu'), MARKET_FORECAST_COVERAGE.jp);
  assert.equal(forecastCoverageForMarket('jp_hokkaido'), MARKET_FORECAST_COVERAGE.jp);
  assert.deepEqual(MARKET_FORECAST_COVERAGE.jp.displayYears, [2025, 2030, 2034]);
  assert.deepEqual(MARKET_FORECAST_COVERAGE.pl.contextYears, [2040]);
});

test('the public source contract covers every market and remains internally valid', () => {
  assert.deepEqual(validateSourceRegistry(), []);
  for (const id of ['wa', 'gb', 'ie', 'ro', 'pl', 'jp']){
    assert.ok(sourcesForMarket(id).length >= 3, `${id}: insufficient governed sources`);
  }
  assert.ok(SOURCE_REGISTRY.every(source => source.canonicalUrl.startsWith('https://')));
});

test('Japan official planning metrics preserve FY2025, FY2030 and FY2034', () => {
  assert.deepEqual(validateMetricRegistry(), []);
  const metrics = metricsForMarket('jp');
  assert.equal(metrics.length, 6);
  assert.ok(metrics.every(metric => metric.authority === 'official-forecast'));
  assert.ok(metrics.every(metric => metric.values.map(point => point.year).join(',') === '2025,2030,2034'));
  assert.ok(metrics.every(metric => metric.sourceIds.every(sourceById)));
});

test('the repository exposes a read-only governed-source reachability checker', () => {
  const scriptPath = path.resolve('etl/verify-public-sources.mjs');
  const source = fs.readFileSync(scriptPath, 'utf8');
  const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));
  assert.match(source, /SOURCE_REGISTRY/);
  assert.match(source, /method,\s*redirect/);
  assert.doesNotMatch(source, /writeFile|appendFile|rmSync|unlinkSync/);
  assert.equal(pkg.scripts['etl:verify:public-sources'], 'node etl/verify-public-sources.mjs');
});

test('Japan balancing-product matrix matches the current EPRX requirement vintage', () => {
  const products = Object.fromEntries(JP_NATIONAL.balancingProducts.map(product => [product.jp, product]));
  assert.equal(products['一次調整力'].resp[0], '≤10 s online / ≤30 s offline');
  assert.equal(products['一次調整力'].dur[0], '≥5 min online');
  assert.equal(products['二次調整力①'].dur[0], '≥30 min');
  assert.equal(products['二次調整力②'].dur[0], '≥30 min');
  assert.equal(products['三次調整力①'].dur[0], '≥30 min');
  assert.equal(products['三次調整力②'].resp[0], '≤60 min');
  assert.equal(products['三次調整力②'].dur[0], '≥30 min');
});
