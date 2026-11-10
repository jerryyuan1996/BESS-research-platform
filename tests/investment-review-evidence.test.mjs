import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { investmentEvidence } from '../scripts/view/review-investment-evidence.mjs';
import { byId } from '../src/markets/registry.js';
import { runBaseCase } from '../src/comparison/engine.js';
import { sweepDesign } from '../src/comparison/designFit.js';
import { DIMENSIONS } from '../src/governance/investability.js';

const now = new Date('2026-11-10T09:17:39Z');
const files = ['nem', 'pjm', 'wa', 'ercot', 'ro'].map(id => new URL(`../view/markets/${id}.json`, import.meta.url));
const history = new URL('../view/changelog.jsonl', import.meta.url);
const before = await Promise.all([...files, history].map(file => readFile(file, 'utf8')));
const entries = before.at(-1).trim().split('\n').map(line => JSON.parse(line));
const rationaleUpdate = (id, dimension) => entries.findLast(e => e.market === id && e.path === `grades.${dimension}` && e.to?.asOf === '2026-11-10');
const engineBefore = Object.fromEntries(['nem', 'pjm', 'wa'].map(id => [id, runBaseCase(byId(id), 5)]));
const report = await investmentEvidence({ now });

test('investment evidence reads current result fields without rewriting history or model inputs', async () => {
  assert.deepEqual(await Promise.all([...files, history].map(file => readFile(file, 'utf8'))), before);
  for (const id of ['nem', 'pjm', 'wa']) {
    const engine = runBaseCase(byId(id), 5), row = report.markets[id];
    assert.deepEqual(engine, engineBefore[id]);
    assert.equal(row.base.holdIRR, engine.irrHold);
    assert.equal(row.base.securedShare, engine.securedShare);
    assert.equal(row.base.securedYears, engine.securedYears);
    assert.equal(row.base.lifeYears, 15);
    assert.equal(row.investmentCard.lifeYears, 20);
    assert.equal(row.storedGrades.assetReturn.grade, row.engineGrade.grade);
  }
});

test('NEM historical rationale and current conditional CIS share remain separate', () => {
  const row = report.markets.nem, engine = engineBefore.nem;
  assert.match(rationaleUpdate('nem', 'revenueCertainty').from.reason[0], /87%/);
  assert.equal(rationaleUpdate('nem', 'revenueCertainty').from.asOf, '2026-10-12');
  assert.equal(row.storedGrades.revenueCertainty.asOf, '2026-11-10');
  assert.match(row.storedGrades.revenueCertainty.reason[0], /modelled-award.*anchor/);
  assert.equal(row.base.securedShare, engine.secY[0] / (engine.capY[0] + engine.mchY[0]));
  assert.ok(row.base.securedShare >= .5 && row.base.securedShare < .87);
  assert.ok(row.base.securedYears >= 10);
  // This reads the existing anchor. It neither applies a grade nor creates one.
  assert.match(DIMENSIONS.find(d => d.id === 'revenueCertainty').anchors[5][0], /Half or more.*ten years/);
  assert.notEqual(row.base.securedShare, row.investmentCard.securedShare);
});

test('WA baseline, fade-aware designs and tax/financing card retain their own bases', () => {
  const row = report.markets.wa;
  for (const hours of [7, 8]) {
    const actual = sweepDesign(byId('wa')).points.find(p => p.route === 'cap' && p.hours === hours);
    const audited = row.designs.find(p => p.hours === hours);
    assert.equal(audited.holdIRR, actual.irrHold);
    assert.deepEqual(audited.runOptions, actual.runOptions);
    assert.equal(audited.runOptions.capacityFloor.requiredHours, 7);
  }
  assert.notEqual(row.base.holdIRR, row.designs.find(p => p.hours === 7).holdIRR);
  assert.equal(row.investmentCard.hours, 8);
  assert.notEqual(row.investmentCard.holdIRR, row.designs.find(p => p.hours === 8).holdIRR);
});

test('PJM historical rationale is retained; January ERCOT is closed and February is still a watch', () => {
  assert.match(rationaleUpdate('pjm', 'assetReturn').from.reason[0], /2.4%/);
  assert.equal(rationaleUpdate('pjm', 'assetReturn').from.asOf, '2026-10-23');
  assert.equal(report.markets.pjm.storedGrades.assetReturn.asOf, '2026-11-10');
  assert.equal(report.ercot.january.outcome.on, '2026-11-06');
  assert.equal(report.ercot.february.expected, '2026-12-04');
  assert.equal(report.ercot.february.outcome, undefined);
});


test('approved dated rationales retain grades and complete historical records without typed current model figures', () => {
  for (const [id, dimension] of [['nem', 'revenueCertainty'], ['pjm', 'assetReturn'], ['wa', 'assetReturn']]) {
    const entry = rationaleUpdate(id, dimension);
    assert.ok(entry);
    const { reason: oldReason, asOf: oldDate, ...oldFields } = entry.from;
    const { reason, asOf, ...newFields } = entry.to;
    assert.deepEqual(newFields, oldFields);
    assert.deepEqual(entry.to, report.markets[id].storedGrades[dimension]);
    assert.equal(asOf, '2026-11-10');
    assert.ok(oldDate < asOf);
    for (const text of reason) {
      assert.ok(text.startsWith(asOf));
      assert.doesNotMatch(text.slice(asOf.length), /[0-9]/);
    }
    assert.match(reason[0], /Fair evidence/);
    assert.match(reason[0], /Recheck/);
    assert.match(reason[1], /证据中等/);
    assert.match(reason[1], /复核/);
    assert.ok(entries.some(e => e.market === id && e.path === entry.path &&
      JSON.stringify(e.to?.reason) === JSON.stringify(oldReason)), `${id}: original rationale is still in history`);
  }
  assert.match(rationaleUpdate('wa', 'assetReturn').from.reason[0], /19.8%/);
  assert.match(report.markets.wa.storedGrades.assetReturn.reason[0], /not hold IRR/);
  assert.match(report.markets.pjm.storedGrades.assetReturn.reason[0], /non-binding/);
});
