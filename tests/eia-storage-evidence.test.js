import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeEia} from '../etl/sources/eia-860m.mjs';
import {buildStorageIndex,attachStorageEvidence} from '../etl/sources/eia-storage-evidence.mjs';
import {buildPlantIndex,enrichProjects} from '../etl/sources/eia-860-enrichment.mjs';
import {energyMWh} from '../src/projects/schema.js';

const context={marketId:'pjm',evidenceDate:'2026-11-07',publishedAt:'2026-10-23',reportingPeriod:'2026-09',includeObservations:true};
const monthly={plant_id:'001',generator_id:'01',plant_name:'Synthetic battery',entity_name:'Synthetic operator',plant_state:'PA',status:'(OP) Operating',prime_mover_code:'BA',balancing_authority_code:'PJM',nameplate_capacity:100,nameplate_energy_capacity:320,operating_year:2024,operating_month:3,latitude:40,longitude:-77};
const annual={plant_code:'001',generator_id:'01',plant_name:'Synthetic battery',state:'PA',status:'OP',prime_mover:'BA',technology:'Batteries',nameplate_capacity:100,nameplate_energy_capacity:320,maximum_charge_rate:75,maximum_discharge_rate:80,operating_year:2024,operating_month:3};
const plant={plant_code:'001',plant_name:'Synthetic battery',state:'PA',balancing_authority_code:'PJM',latitude:40,longitude:-77};
const join=(rows=[annual],plants=[plant],year=2025,record=monthly,period='2026-09')=>attachStorageEvidence(normalizeEia([record],context),buildStorageIndex(rows,plants,year),period)[0];

test('exact compound identity preserves both zero prefixes and both power denominators',()=>{
  const p=join();assert.equal(p.id,'pjm-eia-001-01');assert.equal(p.storageEvidence.match,'exact-plant-generator');assert.equal(p.storageEvidence.sourceRecordId,'001:01');
  assert.equal(p.capacityMW,100);assert.equal(p.storageEvidence.maximumChargeMW,75);assert.equal(p.storageEvidence.maximumDischargeMW,80);assert.equal(p.storageEvidence.durationHours,4);assert.equal(p.durationHours,null);assert.equal(energyMWh(p),320);
});
test('leading zeroes are not erased to manufacture a match',()=>{
  for(const changed of [{...annual,plant_code:'1'},{...annual,generator_id:'1'}])assert.equal(join([changed]).storageEvidence.energyMWh,null);
});
test('duplicate identities, including identical duplicate rows, stay unresolved',()=>{
  const index=buildStorageIndex([annual,{...annual}], [plant],2025);assert.equal(index.audit.duplicateKeys,1);
  const p=attachStorageEvidence(normalizeEia([monthly],context),index,'2026-09')[0];assert.equal(p.storageEvidence.reason,'ambiguous-annual-key');assert.equal(p.storageEvidence.energyMWh,null);
});
test('missing identities are counted and do not become plant-level energy claims',()=>{
  const index=buildStorageIndex([{...annual,generator_id:null}], [plant],2025);assert.equal(index.audit.missingIds,1);
  assert.equal(join([{...annual,generator_id:null}]).storageEvidence.reason,'annual-key-absent');
  assert.equal(normalizeEia([{...monthly,generator_id:null}],context).length,0);
});
for(const [name,changed,reason] of [['technology',{prime_mover:'PS'},'annual-technology-mismatch'],['status',{status:'SB'},'annual-status-mismatch'],['state',{state:'TX'},'annual-state-mismatch'],['operating year',{operating_year:2026},'annual-operating-year-invalid'],['operating identity date',{operating_year:2023},'operating-date-mismatch']]){
  test(name+' contradiction leaves every annual quantity null',()=>{
    const p=join([{...annual,...changed}]);assert.equal(p.storageEvidence.reason,reason);
    for(const field of ['energyMWh','annualNameplateMW','maximumChargeMW','maximumDischargeMW','durationHours'])assert.equal(p.storageEvidence[field],null);
    assert.equal(energyMWh(p),320,'the independent monthly observation survives');
  });
}
test('ambiguous/different annual plant authority cannot confer an energy identity',()=>{
  assert.equal(join([annual],[plant,{...plant}]).storageEvidence.reason,'annual-plant-authority-ambiguous');
  assert.equal(join([annual],[{...plant,balancing_authority_code:'ERCO'}]).storageEvidence.reason,'annual-authority-mismatch');
});
test('future and overly old annual vintages retain explicit gaps',()=>{
  assert.equal(join([annual],[plant],2026).storageEvidence.reason,'annual-vintage-incompatible');
  assert.equal(join([annual],[plant],2023).storageEvidence.reason,'annual-vintage-too-old');
});
test('missing discharge power never produces a duration or a zero MWh',()=>{
  const p=join([{...annual,maximum_discharge_rate:null}]);assert.equal(p.storageEvidence.energyMWh,320);assert.equal(p.storageEvidence.durationHours,null);
  assert.equal(join([{...annual,nameplate_energy_capacity:0}]).storageEvidence.energyMWh,null);
});
test('a name/state coordinate fallback never lends its different Plant ID to MWh',()=>{
  const other={...plant,plant_code:'999'};
  const coordinates=buildPlantIndex([other],{plantId:'plant_code',plantName:'plant_name',state:'state',lat:'latitude',lon:'longitude',balancingAuthority:'balancing_authority_code'});
  const p=enrichProjects(normalizeEia([monthly],context),coordinates)[0];assert.equal(p.enrichment.confidence,'name-state');assert.equal(p.enrichment.matchedPlantId,'999');
  const supplemented=attachStorageEvidence([p],buildStorageIndex([{...annual,plant_code:'999'}],[other],2025),'2026-09')[0];
  assert.equal(supplemented.storageEvidence.energyMWh,null);assert.equal(supplemented.sourceRef.plantId,'001');
});
