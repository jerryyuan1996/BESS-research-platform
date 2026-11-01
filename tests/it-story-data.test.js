import test from 'node:test';
import assert from 'node:assert/strict';
import {IT_AUCTION_RESULTS as data,IT_STORY_DATASETS,forkPayments} from '../src/markets/it/data/auctionResults.js';

test('manual auction records retain a locator, vintage, authority and units',()=>{
  assert.equal(IT_STORY_DATASETS['it-auction-results'],data);
  assert.deepEqual(data.bearsOn,[]);
  for(const r of [...data.capacity,...data.derating,data.legacyRating,...data.macse,data.macseTotals]){
    assert.match(r.source.url,/^https:\/\//);
    assert.ok(r.source.locator.length>30);
    assert.equal(r.source.checkedOn,data.vintage);
    assert.ok(r.authority);
  }
  assert.equal(data.derating.length,32);
  assert.deepEqual(data.derating.filter(r=>r.hours===4).map(r=>r.factor),[.4,.51,.21,.21]);
  assert.equal(data.legacyRating.primaryVerified,false);
});
test('reported MACSE quantities reconcile, without changing model inputs or inferring tenor',()=>{
  assert.equal(data.macse.reduce((sum,r)=>sum+r.mwh,0),data.macseTotals.mwh);
  assert.ok(Math.abs(data.macse.reduce((sum,r)=>sum+r.mw,0)-data.macseTotals.mw)<1e-9);
  assert.equal(data.macseTotals.termYears,null);
  assert.equal(data.macse.find(r=>r.area==='south').premiumPerMWhYear,12137);
  assert.equal(data.chart.quantitativeReady,false);
  assert.match(data.chart.fallback[0],/^Example:/);
});
test('missing capacity prices stay missing and alternative payments are never summed',()=>{
  assert.equal(data.capacity.find(r=>r.deliveryYear===2028).premiumPerCreditedMWYear,null);
  assert.deepEqual(forkPayments({hours:6,capacityPremium:null,factor:.21,macsePremium:12137}),{capacity:null,macse:72822,unit:'EUR/nameplate-MW/year'});
  assert.equal('total' in forkPayments({hours:6,capacityPremium:47000,factor:.67,macsePremium:14566}),false);
  assert.equal(Object.keys(data.gaps).length,3);
});
