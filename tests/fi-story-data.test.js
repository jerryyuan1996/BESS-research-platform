/* The signature-chart definitions are deliberately incompatible measures. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {FI_STORY_NEED,fastObligationRange,fastProcurementMW} from '../src/markets/fi/data/storyNeed.js';

test('the dated connected estimate exceeds the gross obligation band without inventing a crossing date',()=>{
  assert.deepEqual(fastObligationRange(),[735,795]);
  const {connected,crossing}=FI_STORY_NEED;
  assert.equal(connected.mw,connected.largerMW+connected.smallEstimateMW);
  assert.ok(connected.mw>fastObligationRange()[1]);
  assert.equal(connected.precision,'early-month');
  assert.equal(connected.approximate,true);
  assert.equal(crossing.kind,'left-censored');
  assert.equal(crossing.exactDate,null);
});
test('every published observation carries its source, date and measure',()=>{
  const r=FI_STORY_NEED;
  for(const row of [r.obligation,r.connected,...r.procurement]){
    assert.ok(row.source.id&&row.source.url&&row.source.locator&&row.source.checkedOn);
    assert.ok(row.source.sourceDate);
    assert.ok(row.measure);
  }
  assert.equal(r.procurement.length,7);
  assert.equal(r.procurement.at(-1).year,2025);
  assert.equal(fastProcurementMW(r.procurement.at(-1)),714);
  assert.equal(r.obligation.measure,'gross-product-commitments');
  assert.equal(r.procurement[0].measure,'annual-average-procured');
  assert.equal(r.storageSeries.noSpliceToConnected,true);
  assert.equal(r.storageSeries.datasetId,'fi-storage-capacity');
});

test('a MW summary has daily capacity statistics and no price-style spread', async()=>{
  const {buildSummary}=await import('../etl/lib/summarize.mjs');
  const series=Array.from({length:24},(_,i)=>({t:new Date(Date.UTC(2026,9,1,i)).toISOString(),v:i<12?2000:2400}));
  const common={schemaVersion:1,datasetId:'fi-storage-capacity',marketId:'fi',source:{name:'Example'},fetchedAt:'2026-10-02T00:00:00Z',coverage:{points:24},series,contentChecksum:'example'};
  const power=buildSummary({...common,units:{power:'MW'}},null,{timezone:'UTC'});
  assert.equal(power.daily[0].mean,2200);
  assert.equal(power.daily[0].spread,null);
  assert.equal(power.daily[0].charge,null);
  assert.equal(power.daily[0].discharge,null);
  assert.equal(power.arbitrage,null);
  assert.equal(power.dailyTimezone,'UTC');
  const local=buildSummary({...common,units:{power:'MW'}},null,{timezone:'Europe/Helsinki'});
  assert.equal(local.dailyTimezone,'Europe/Helsinki');
  assert.equal(local.daily[0].n,21);
  assert.equal(local.daily.reduce((n,d)=>n+d.n,0),24);
  const price=buildSummary({...common,units:{price:'EUR/MW/h'}},null,{timezone:'UTC',durationHours:2});
  assert.ok(price.daily[0].spread>0,'the existing price-summary path is unchanged');
});
