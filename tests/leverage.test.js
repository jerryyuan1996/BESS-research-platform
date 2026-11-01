import test from 'node:test';
import assert from 'node:assert/strict';
import { opportunities } from '../src/experience/model.js';
import { contractedDSCR, targetTest } from '../src/acquisition/leverage.js';
import { LEVERAGE, LEVERED_PREMIUM } from '../src/acquisition/parameters.js';

const rows = opportunities('infraFund');
const row = id => rows.find(r => r.id === id).investment;

test('contracted coverage follows contract quality inside 1.20-1.40x; merchant is 2.00x', () => {
  assert.equal(contractedDSCR('capacity', 15), 1.20);
  assert.equal(contractedDSCR('award', 20), 1.20);
  assert.equal(contractedDSCR('fixed', 10), 1.30);
  assert.equal(contractedDSCR('fixed', 5), 1.40);
  assert.equal(contractedDSCR('floor', 7), 1.40);
  assert.equal(contractedDSCR('collar', 15), 1.40);
  assert.equal(contractedDSCR('merchant', 0), null);
  assert.equal(LEVERAGE.dscr.merchant, 2.00);
});

test('debt ratios match the table the analyst confirmed on 29 Oct 2026', () => {
  const confirmed = { it:.600, ie:.750, wa:.750, pl:.339, fi:.600, de:.655, ro:.376, nem:.581,
    // 1 Nov: updated PJM indicative credits lower debt capacity; sizing rules stay fixed.
    gb:.549, caiso:.499, pjm:.270, ercot:.407, ca_on:.502,
    // Japan moved off the 75% cap when it took the Bank of Japan core-CPI path (29 Oct 2026).
    jp_kyushu:.749, jp_tokyo:.745, jp_hokkaido:.733 };
  for (const [id, gearing] of Object.entries(confirmed))
    assert.ok(Math.abs(row(id).leverage.gearing - gearing) < .0015, `${id}: ${row(id).leverage.gearing}`);
});

test('every levered case covers its tests, repays 60% by maturity and stays under its cap', () => {
  for (const r of rows){
    const l = r.investment?.leverage;
    if (!l) continue;
    assert.ok(l.minCover >= Math.min(l.contractedDSCR ?? 2, 2) - 1e-6, r.id + ' cover ' + l.minCover);
    assert.ok(l.balloonShare <= 1 - LEVERAGE.minRepaid + 1e-6, r.id + ' balloon ' + l.balloonShare);
    assert.ok(l.gearing <= LEVERAGE.gearingCap.contracted + 1e-9, r.id + ' gearing');
    assert.ok(l.legalYears >= LEVERAGE.miniPermYears && l.legalYears <= LEVERAGE.maxLegalYears);
  }
});

test('two layers: all-equity against the target, levered against the target plus two points', () => {
  assert.deepEqual(targetTest(.11, .15, .10).basis, 'all-equity');
  assert.deepEqual(targetTest(.09, .125, .10).basis, 'levered');
  assert.deepEqual(targetTest(.09, .115, .10).basis, 'neither');
  assert.equal(targetTest(.09, .115, .10).leveredTarget, .10 + LEVERED_PREMIUM);
  assert.equal(row('it').test.basis, 'all-equity');
  assert.equal(row('ie').test.basis, 'levered');
  assert.equal(row('de').test.basis, 'neither');
});

test('US rows carry both supply cases', () => {
  for (const id of ['pjm', 'ercot', 'caiso']){
    assert.equal(row(id).usSupply, 'non-feoc');
    assert.equal(row(id).usAlternative.usSupply, 'chinese');
    assert.ok(row(id).usAlternative.capexPerMW < row(id).capexPerMW);
  }
  assert.equal(row('de').usAlternative, undefined);
});
