import test from 'node:test';
import assert from 'node:assert/strict';
import {ELECTRICITY_OVERVIEW as data} from '../src/experience/story/public/data/electricity2024.js';
import {marketIds} from '../src/markets/registry.js';
import {publicChapters} from '../src/experience/story/public/chapters.js';
import {countryForMarket,countryIndicators} from '../src/experience/story/public/overviewModel.js';
const sum = object => Object.values(object).reduce((a,b)=>a+b,0);
const close = (a,b,tolerance=.0002) => assert.ok(Math.abs(a-b)<=tolerance,`${a} != ${b}`);

test('all eighteen markets map once to thirteen dated, sourced country contexts',()=>{
  assert.equal(data.countries.length,13);
  assert.deepEqual(data.countries.flatMap(c=>c.markets).sort(),marketIds().sort());
  for(const c of data.countries){
    assert.equal(c.name.length,2);assert.equal(c.scope.length,2);assert.ok(c.period.includes('2024'));
    assert.ok(c.sources.length);c.sources.forEach(s=>assert.ok(new URL(s.url).protocol==='https:'));
    assert.equal(c.calculation.length,2);
    for(const series of [c.generation,c.demand].filter(Boolean)){
      assert.ok(series.total>0);assert.ok(series.mixTotal>0);assert.equal(series.basis.length,2);
      Object.values(series.mix).forEach(v=>assert.ok(Number.isFinite(v)&&v>=0));
      close(sum(series.mix),series.mixTotal);
    }
  }
});

test('supply, storage and consumption use their actual denominators',()=>{
  const it=data.italy;
  close(sum(it.generationMix),it.generation);
  close(sum(it.demandMix),it.consumption);
  close(it.netGeneration-it.storageInput+it.netImports,it.demand);
  close(it.demand-it.losses,it.consumption);
  close(it.regions.reduce((n,r)=>n+r.consumption,0),it.consumption);
  close(it.regions.reduce((n,r)=>n+r.wind+r.solar,0),it.generationMix.wind+it.generationMix.solar);
  const us=data.countries.find(c=>c.id==='us');
  close(us.generation.mixTotal-us.generation.total,5.852);
  close(sum(us.demand.mix),us.demand.total);
  assert.ok(us.demand.mix.directUse>0);
  const au=data.countries.find(c=>c.id==='au');
  close(au.demand.mixTotal*3.6,885);close(au.demand.total*3.6,884.7);
  const sa=data.countries.find(c=>c.id==='sa');
  assert.equal(sa.generation,undefined,'grid-sent output cannot be relabelled gross generation');
  assert.ok(sa.gridSent.total>sa.demand.total);
  const ca=data.countries.find(c=>c.id==='ca');
  assert.ok(ca.generation.mix.combustibles>0);assert.equal(ca.generation.mix.gas,undefined,'unverified fuel split is absent, not zero');
});

test('all markets have their own sourced country overview after history, with the unified value-to-investment chapters',()=>{
  for(const id of marketIds()){
    assert.deepEqual(publicChapters(id).map(c=>c[0]),['history','overview','system','mechanism','investment','research']);
    const c=countryForMarket(id);assert.ok(c.markets.includes(id));
    const indicators=countryIndicators(id);assert.equal(indicators.length,4);
    indicators.forEach(v=>{assert.ok(Number.isFinite(v.value));assert.equal(v.label.length,2);assert.equal(v.basis.length,2);});
    close(indicators.find(v=>v.key==='demand').value,c.demand.total);
    assert.ok(!indicators.find(v=>v.key==='demand').label.some(t=>/system demand|系统总需求/i.test(t)));
  }
  for(const id of ['sa','es','ca_on'])assert.deepEqual(publicChapters(id,true).map(c=>c[0]),['history','overview','system','mechanism','investment','research']);
  assert.equal(countryForMarket('pjm'),countryForMarket('caiso'));
  assert.equal(countryForMarket('jp_tokyo'),countryForMarket('jp_kyushu'));
  assert.equal(countryForMarket('wa'),countryForMarket('nem'));
  assert.equal(countryIndicators('sa')[0].key,'grid-sent');
  assert.match(countryIndicators('jp_tokyo').find(v=>v.key==='industry').label[0],/Manufacturing/);
});
