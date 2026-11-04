import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** A market's section source. Since P1-C a market may keep its sections in
 *  sections/*.js rather than one sections.js; the integration being asserted
 *  lives in whichever of them carries the story. */
function marketSections(market){
  const base = `src/markets/${market}`;
  const parts = [readFileSync(path.join(ROOT, base, 'sections.js'), 'utf8')];
  const dir = path.join(ROOT, base, 'sections');
  if (existsSync(dir))
    for (const name of readdirSync(dir).filter(n => n.endsWith('.js')))
      parts.push(readFileSync(path.join(dir, name), 'utf8'));
  return parts.join('\n');
}

import { WA_ECONOMICS_P0 } from '../src/markets/wa/economicsP0.js';
import { GB_ECONOMICS_P0 } from '../src/markets/gb/economicsP0.js';
import { IE_ECONOMICS_P0 } from '../src/markets/ie/economicsP0.js';

const contracts = [WA_ECONOMICS_P0, GB_ECONOMICS_P0, IE_ECONOMICS_P0];

const assertEconomicsContract = contract => {
  assert.match(contract.marketId, /^(wa|gb|ie)$/);
  assert.equal(contract.asOf, '2026-07-29');
  assert.ok(contract.dna.type[0]);
  assert.ok(contract.dna.chain.length >= 5);

  const qualities = new Set(contract.metrics.map(metric => metric.quality));
  assert.deepEqual([...qualities].sort(), ['DERIVED', 'PROXY', 'VERIFIED']);
  for (const metric of contract.metrics) {
    assert.ok(metric.id);
    assert.ok(metric.label[0]);
    assert.ok(metric.display);
    assert.ok(metric.formula);
    assert.ok(metric.limitation);
    assert.ok(metric.source);
    assert.match(metric.sourceUrl, /^https:\/\//);
  }

  assert.ok(contract.capacityLogic.formula);
  assert.ok(contract.capacityLogic.limitation);
  assert.ok(contract.capacityLogic.chain.length >= 4);

  assert.equal(contract.competition.status, 'INCOMPLETE');
  assert.ok(contract.competition.rows.length >= 3);
  assert.ok(contract.competition.boundary);
  assert.match(contract.competition.sourceUrl, /^https:\/\//);
  const competitionLabels = contract.competition.rows.map(row => row.label[0]).join(' ');
  assert.match(competitionLabels, /Operating/i);
  assert.match(competitionLabels, /committed/i);

  assert.ok(contract.conclusion.headline[0]);
  assert.deepEqual(contract.scenarios.map(scenario => scenario.name), ['Bear', 'Base', 'Bull']);
  for (const scenario of contract.scenarios) {
    assert.ok(scenario.owner[0]);
    assert.ok(scenario.system[0]);
    assert.ok(scenario.drivers.length >= 4);
  }

  assert.deepEqual(contract.executionGates.map(gate => gate.hours), [2, 4, 8]);
  assert.ok(contract.executionGates.every(gate => gate.status === 'TO_BUILD'));
  assert.ok(contract.executionGates.every(gate => gate.requirement && gate.currentEvidence));
};

test('WA, GB and Ireland expose complete market-local P0 economics contracts', () => {
  contracts.forEach(assertEconomicsContract);
});

test('capacity and competition arithmetic is reproducible', () => {
  assert.equal(
    WA_ECONOMICS_P0.metrics.find(metric => metric.id === 'wa-average-duration').value,
    5140 / 1275,
  );
  assert.equal(
    WA_ECONOMICS_P0.competition.rows.find(row => row.quality === 'DERIVED').value,
    '391 MW',
  );
  assert.equal(
    WA_ECONOMICS_P0.metrics.find(metric => metric.id === 'wa-operating-bess-peak-rct-penetration').value,
    1275 / 5720 * 100,
  );
  assert.equal(
    WA_ECONOMICS_P0.metrics.find(metric => metric.id === 'wa-committed-bess-peak-rct-penetration').value,
    1666 / 6323 * 100,
  );
  assert.equal(
    WA_ECONOMICS_P0.metrics.find(metric => metric.id === 'wa-underlying-consumption-cagr').value,
    (32.1 / 20.4) ** (1 / 10) - 1,
  );
  assert.equal(
    WA_ECONOMICS_P0.metrics.find(metric => metric.id === 'wa-peak-rct-cagr').value,
    (7454 / 5720) ** (1 / 9) - 1,
  );

  const gb4h = GB_ECONOMICS_P0.capacityLogic.examples.find(example => example.hours === 4);
  assert.equal(gb4h.valuePerMw, Math.round(27.10 * 1000 * 0.4396));   // published T-4 2029/30 factor, gate G1
  assert.equal(gb4h.value100Mw, gb4h.valuePerMw * 100);
  assert.equal(
    GB_ECONOMICS_P0.metrics.find(metric => metric.id === 'gb-thermal-constraint-share').value,
    1.7 / 2.7 * 100,
  );

  const ie4h = IE_ECONOMICS_P0.capacityLogic.proxyExamples.find(example => example.hours === 4);
  assert.equal(ie4h.value100Mw, 100 * 0.66 * 149960);
  assert.equal(
    IE_ECONOMICS_P0.metrics.find(metric => metric.id === 'ie-battery-qualified-new-share').value,
    612.272 / (612.272 + 14.53) * 100,
  );
  assert.equal(
    IE_ECONOMICS_P0.metrics.find(metric => metric.id === 'ie-storage-duration-2026').value,
    2860 / 1340,
  );
  assert.equal(
    IE_ECONOMICS_P0.metrics.find(metric => metric.id === 'ie-storage-duration-2030').value,
    3420 / 1500,
  );
  assert.equal(
    IE_ECONOMICS_P0.metrics.find(metric => metric.id === 'ie-storage-power-growth-2026-30').value,
    (1500 / 1340 - 1) * 100,
  );
  assert.equal(
    IE_ECONOMICS_P0.metrics.find(metric => metric.id === 'ie-storage-energy-growth-2026-30').value,
    (3420 / 2860 - 1) * 100,
  );
  assert.equal(
    IE_ECONOMICS_P0.metrics.find(metric => metric.id === 'ie-storage-duration-growth-2026-30').value,
    ((3420 / 1500) / (2860 / 1340) - 1) * 100,
  );
  assert.deepEqual(
    [2026, 2030, 2034].map(year =>
      IE_ECONOMICS_P0.metrics.find(metric => metric.id === `ie-secure-lole-${year}`).value),
    [88.5, 3.1, 7.1],
  );
});

test('each market story visibly integrates its P0 economics section', () => {
  const waStory = readFileSync(new URL('../src/markets/wa/sections/story.js', import.meta.url), 'utf8');
  const gbSections = marketSections('gb');
  const ieSections = marketSections('ie');

  assert.match(waStory, /renderWaEconomicsP0\(main\)/);
  assert.match(gbSections, /\.\.\.gbEconomicsP0Blocks\(SRC\)/);
  assert.match(ieSections, /\.\.\.ieEconomicsP0Blocks\(SRC\)/);
});
