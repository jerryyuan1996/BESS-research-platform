import test from 'node:test';
import assert from 'node:assert/strict';
import {atlasCountries,installedBatteries,mixEntries} from '../src/experience/marketAtlasModel.js';
import {marketIds} from '../src/markets/registry.js';
import {publicChapters,resolvePublicChapter} from '../src/experience/story/public/chapters.js';
import {deliveryState,REVENUE_ROUTES} from '../src/experience/story/public/italyLogicContent.js';
import italy from '../src/experience/story/public/content/it.js';

test('atlas counts each country once and excludes Saudi even through an old filter',()=>{
 const countries=atlasCountries(marketIds());
 assert.equal(countries.length,12);assert.ok(!countries.some(c=>c.id==='sa'));
 assert.deepEqual(atlasCountries(['pjm','ercot','caiso']).map(c=>c.id),['us']);
 assert.deepEqual(atlasCountries(['sa']),[]);
 // The published country tables round totals and sectors independently.
 for(const c of countries)for(const key of ['generation','demand'])assert.ok(Math.abs(mixEntries(c[key]).reduce((a,b)=>a+b.share,0)-1)<1e-7);
});
test('battery comparisons preserve missing units, observations and separate geographic scopes',()=>{
 assert.equal(installedBatteries('it','gw')[0].current.gw,1.0555);
 assert.deepEqual(installedBatteries('it','gwh'),[]);
 assert.deepEqual(installedBatteries('fi','gw'),[]);
 assert.deepEqual(installedBatteries('au','gw').map(r=>r.id),['au-nem','au-wem']);
 assert.deepEqual(installedBatteries('us','gw').map(r=>r.id),['us']);
 assert.deepEqual(installedBatteries('us','gwh').map(r=>r.id),['us-energy']);
 assert.deepEqual(installedBatteries('ca','gw').map(r=>r.id),['ca']);
});
test('Italy collapses the redundant equipment chapter and resolves old storage links locally',()=>{
 assert.equal(publicChapters('it').length,6);assert.equal(resolvePublicChapter('it','storage'),'system');
 for(const id of marketIds().filter(id=>id!=='it')){assert.equal(publicChapters(id).length,6);assert.equal(resolvePublicChapter(id,'storage'),'system');}
 assert.equal(deliveryState(2,true),'constrained');assert.equal(deliveryState(2,false),'discharging');
 assert.equal(deliveryState(1,true),'charging');
 for(const route of Object.values(REVENUE_ROUTES))for(const key of route.sources)assert.ok(italy.sources[key]?.url);
});
