import test from 'node:test';
import assert from 'node:assert/strict';
import { CAISO_EVIDENCE as E, CAISO_RECORDS as records, CAISO_HISTORY as H, CAISO_DAY as D } from '../src/markets/caiso/data/storyEvidence.js';

test('CAISO observed and rule records retain precise primary locators and source arithmetic', () => {
  for (const record of Object.values(records).filter(r => r.value !== null)) {
    for (const field of ['sourceIds','primaryUrl','locator','unit','scope','publishedOn','asOf','checkedOn','qualifier','status','arithmetic']) assert.ok(record[field], field);
    assert.match(record.primaryUrl, /^https:\/\//);
  }
  assert.equal(E.mtrNqcMW, [2000,6000,1500,2000].reduce((a,b)=>a+b));
  assert.equal(records.fleetEnd2025LowerBoundMW.qualifier, 'over');
  assert.equal(records.fleetEnd2025LowerBoundMW.scope, 'CAISO balancing area');
});

test('CAISO unapproved quantities cannot silently become observations or zeroes', () => {
  assert.equal(D.publicationStatus, 'blocked');
  assert.equal(D.highest2025NetLoadHours, null);
  for (const p of Object.values(D.profiles)) for (const value of Object.values(p)) assert.equal(value, null);
  for (const field of ['foldbackCutMW','foldbackCutFraction','postFoldbackQualifyingMW','assetContractPricePerKWMonth','assetContractMW','assetContractYears','observedRaPricePerKWMonth','fleetAverageDurationHours']) {
    assert.equal(E[field], null);
    assert.equal(records[field].status, 'missing');
  }
});

test('CAISO historical adoption and future qualification effects stay separate', () => {
  assert.equal(Object.keys(H).length, 6);
  assert.notEqual(H['H-CAISO-02'].qcDecision.slice(0,4),H['H-CAISO-02'].qcEffectiveRaYear);
  assert.notEqual(H['H-CAISO-05'].foldbackRaYear,H['H-CAISO-05'].ucapRaYear);
  assert.equal(H['H-CAISO-05'].status,'adopted-future-effect');
  for(const node of Object.values(H)) assert.ok(node.locator && node.sourceIds.length);
});
