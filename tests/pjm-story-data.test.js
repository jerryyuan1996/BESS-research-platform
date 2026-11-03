import test from 'node:test';
import assert from 'node:assert/strict';
import { PJM_STORY_EVIDENCE as E } from '../src/markets/pjm/data/storyEvidence.js';

test('PJM manual evidence preserves BRA vintages and every indicative annual shape', () => {
  assert.equal(Object.keys(E.years).length, 18);
  assert.deepEqual(Object.values(E.years).slice(0,5).map(y=>y.auctionRatingByHours[4]),[.59,.50,.58,.59,.57]);
  assert.equal(E.years['2037-38'].indicativeRatingByHours[6],.32);
  assert.equal(E.years['2036-37'].indicativeRatingByHours[6],.31);
  for(const [y,row] of Object.entries(E.years)) for(const h of [4,6,8,10]) {
    assert.equal(row.auctionRatingByHours[h] === null, Number(y.slice(0,4))>2029);
    assert.equal(row.indicativeRatingByHours[h] === null, Number(y.slice(0,4))<=2029);
  }
});

test('PJM price payload and unmatched procurement bars remain withheld', () => {
  assert.equal(E.pricePublication.status,'rights-unresolved');
  assert.equal(E.pricePublication.clearanceRef,null);
  assert.equal(E.pricePublication.mode,'example');
  for(const row of Object.values(E.years)) for(const field of ['clearingPriceUSDPerUCAPMWDay','collarCapUSDPerUCAPMWDay','collarFloorUSDPerUCAPMWDay','uncappedSimulationRTOUSDPerUCAPMWDay','comparisonRequirementUCAPMW','comparisonClearedUCAPMW','comparisonBasis']) assert.equal(row[field],null);
  assert.equal(E.years['2027-28'].shortfallUCAPMW,6516.6);
});

test('PJM evidence fields have individual locators, units, arithmetic and source identities', () => {
  for(const section of ['years','queue','attribution','backstop','history','footprint','teaching','auctionTerm']) {
    const visit=(v,path)=>{
      if(v && typeof v==='object' && !Array.isArray(v)) for(const [key,value] of Object.entries(v)) visit(value,`${path}.${key}`);
      else {
        const p=E.provenance[path]; assert.ok(p,path);
        assert.ok(E.sources[p.sourceRef],path); for(const key of ['locator','unit','arithmetic','kind','rights']) assert.ok(p[key],`${path}.${key}`);
      }
    }; visit(E[section],section);
  }
  assert.match(E.provenance['years.2029-30.auctionWindowOpens'].locator,/D59.*F59/);
  assert.equal(E.years['2029-30'].ratingPostedDate,'2026-08-07');
  assert.equal(E.years['2030-31'].ratingPostedDate,'2027-01-11');
  assert.equal(E.sources['SRC-PJM-14'].checkedOn,'2026-11-03');
  assert.equal(E.sources['SRC-PJM-09'].checkedOn,'2026-11-03');
  assert.equal(E.queue.storageNameplateMW,60000);
  assert.equal(E.attribution.monitorReportedShare,.382);
});
