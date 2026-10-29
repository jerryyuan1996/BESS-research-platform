import test from 'node:test';
import assert from 'node:assert/strict';
import { valueAcquisition, publicAcquisition, debtRiskClass, returnAtAcquisitionPrice, validateAcquisition } from '../src/acquisition/valuation.js';
import { acquisitionInput, acquisitionRecommendations, referenceInputs, marketAcquisitionReference } from '../src/acquisition/reference.js';
import { markets } from '../src/markets/registry.js';
import { compactReferences, expandReferences } from '../src/acquisition/projection.js';

const annual=n=>Array.from({length:n},()=>({secured:120,merchant:0,renewal:0,opex:10,capex:5,tax:5}));
const input=(overrides={})=>({stage:'operating',currency:'EUR',fxToUSD:1.1,powerMW:100,durationHours:2,
  existingNetDebtPerMW:0,fixedFeesPerMW:0,decommissioningPerMW:10,annual:annual(15),
  scenarios:[{probability:1,codYears:0,operates:true,costs:[],recoveries:[]}],
  conditionsMet:true,sources:['Explicit synthetic test cash flows, not market data'],...overrides});
const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-6,`${actual} != ${expected}`);
const rtb=()=>input({stage:'ready-to-build',saleTax:{rate:.2,basisPerMW:100,includePurchase:true},
  scenarios:[{probability:1,codYears:1,operates:true,costs:[{at:.5,amount:150}],recoveries:[]}]});

test('operating price is PV of future after-tax cash, not construction cost or exit proceeds',()=>{
  const c=input(),r=valueAcquisition(c,'strategic');
  const target=.035+.06;
  const expected=(c.annual.reduce((total,_,i)=>total+100/(1+target)**(i+1),0)-10/(1+target)**15)/1.015;
  assert.equal(r.status,'priced');close(r.pricePerMW,expected);close(r.targetReturn,target);
  assert.equal(r.audit.length,1);assert.equal(r.route,'hold');assert.equal(r.exitYear,null);
});
test('RTB takes the lower independent ceiling and its corresponding hurdle',()=>{
  const r=valueAcquisition(rtb(),'infraFund');
  assert.equal(r.status,'priced');assert.equal(r.audit.length,2);
  close(r.pricePerMW,Math.min(...r.audit.map(route=>route.pricePerMW)));
  const binding=r.audit.find(route=>route.route===r.route);close(r.targetReturn,binding.target);
  r.audit.forEach(route=>close(route.npv,0));
  assert.equal(r.returnBasis,'all-cash');assert.equal(r.loanPerMW,0);
  assert.equal(publicAcquisition(r).audit,undefined);
});
test('developers sell at operation start; other pre-operation buyers use year five',()=>{
  const developer=valueAcquisition(rtb(),'developer'),fund=valueAcquisition(rtb(),'infraFund');
  assert.equal(developer.audit.find(r=>r.route==='sale').route,'sale');
  if(developer.route==='sale')assert.equal(developer.exitYear,0);
  if(fund.route==='sale')assert.equal(fund.exitYear,5);
  assert.equal(valueAcquisition(input(),'developer').status,'not-applicable');
});
test('failure paths charge failed development spending and include refunds at their actual time',()=>{
  const c={...rtb(),stage:'greenfield',developmentRiskConfirmed:true,scenarios:[
    {probability:.8,codYears:2,operates:true,costs:[{at:0,amount:50}],recoveries:[]},
    {probability:.2,codYears:0,operates:false,costs:[{at:0,amount:100}],recoveries:[{at:3,amount:20}]},
  ]};
  const r=valueAcquisition(c,'strategic');assert.equal(r.status,'priced');
  const hold=r.audit.find(r=>r.route==='hold'),rate=hold.target;
  const expected=(.8*(c.annual.reduce((sum,_,i)=>sum+100/(1+rate)**(3+i),0)-10/(1+rate)**17-50)+.2*(-100+20/(1+rate)**3))/1.015;
  close(hold.pricePerMW,expected);
  assert.equal(valueAcquisition({...c,developmentRiskConfirmed:false},'strategic').status,'incomplete');
});
test('missing tax and decommissioning stay missing; a negative case is not a zero-price recommendation',()=>{
  const c=input();c.annual[2].tax=null;
  assert.equal(valueAcquisition(c,'strategic').status,'incomplete');
  assert.equal(valueAcquisition(input({decommissioningPerMW:undefined}),'strategic').status,'incomplete');
  assert.equal(valueAcquisition(input({sources:[' ']}),'strategic').status,'incomplete');
  const bad=input({annual:annual(15).map(y=>({...y,opex:300}))});
  assert.equal(valueAcquisition(bad,'strategic').status,'no-positive-price');
  assert.equal(publicAcquisition(valueAcquisition(bad,'strategic')),null);
});
test('pre-operation debt is rejected, rather than used to increase the acquisition price',()=>{
  const c={...rtb(),debt:{mode:'new',riskClass:'mixed'}};
  assert.equal(valueAcquisition(c,'strategic').status,'incomplete');
});
test('operating financing respects both DSCR and LTV; new debt does not reduce the seller cheque',()=>{
  const r=valueAcquisition(input({existingNetDebtPerMW:100,debt:{mode:'new',riskClass:'mixed'}}),'infraFund');
  assert.equal(r.status,'priced');assert.equal(r.returnBasis,'equity');
  assert.ok(r.loanPerMW<=r.pricePerMW*.5+1e-6);
  assert.ok(100/r.audit[0].debt.payment>=1.6-1e-8);
  close(r.equityPaymentPerMW,r.pricePerMW-100);
  close(r.audit[0].npv,0);
});
test('unawarded renewals are merchant risk; display FX does not change the price or hurdle',()=>{
  const c=input({annual:annual(15).map(y=>({...y,secured:0,renewal:120}))});
  const a=valueAcquisition(c,'strategic'),b=valueAcquisition({...c,fxToUSD:2},'strategic');
  close(a.targetReturn,.035+.06+.03);close(a.pricePerMW,b.pricePerMW);close(a.targetReturn,b.targetReturn);
});
test('an operating asset loses elapsed years, without being charged original construction costs',()=>{
  const market=markets.find(m=>m.manifest.id==='gb');
  const c=acquisitionInput(market,'operating',{operatingAgeYears:4,cashTaxRate:.2,
    decommissioningPerMW:100,existingNetDebtPerMW:0,fixedFeesPerMW:0,initialWorksPerMW:0,conditionsMet:true,sources:['test']});
  assert.equal(c.annual.length,11);assert.deepEqual(c.scenarios[0].costs,[{at:0,amount:0}]);
  assert.ok(c.annual.every(y=>y.tax>=0));
});
test('missing project inputs become labelled references; explicit investor restrictions survive',()=>{
  const synthetic={...markets.find(m=>m.manifest.id==='gb')};
  synthetic.comparison={...synthetic.comparison,acquisition:{eligibleInvestors:{operating:['strategic']}}};
  const r=acquisitionRecommendations([synthetic]);
  assert.equal(r.strategic.filter(r=>r.stage==='operating').length,1);
  assert.equal(r.infraFund.filter(r=>r.stage==='operating').length,0);
  assert.ok(r.strategic.every(r=>r.estimated&&r.status==='reference'));
  assert.equal(acquisitionInput(synthetic,'operating').conditionsMet,false,'the original missing evidence remains missing');
});

test('all existing markets remain visible for every applicable investor and stage',()=>{
  const r=acquisitionRecommendations(markets);
  /* An engine-withheld market (Saudi Arabia, 2026-10-29) has no reference to price. */
  const priced=markets.filter(m=>m.comparison.engineReady!==false).length;
  assert.equal(r.strategic.length,priced*3);
  for(const id of ['infraFund','foreignFirstTimer'])assert.equal(r[id].length,priced*2);
  assert.equal(r.developer.length,priced*2);
  const construction=r.infraFund.filter(r=>r.stage==='ready-to-build');
  assert.ok(construction.some(r=>r.referenceCases.some(c=>c.status==='no-positive-price')));
  for(const row of r.infraFund)for(const c of row.referenceCases){
    assert.ok(Number.isFinite(c.targetReturn));
    if(c.status==='no-positive-price'){
      assert.equal(c.pricePerMW,0);assert.ok(c.costGapPVPerMW>0);
    }
  }
});

test('reference endpoints still price both routes and keep their matching targets',()=>{
  const market=markets.find(m=>m.manifest.id==='fi');
  const overrides={remainingBuildPerMW:1000,unfixedConstructionPerMW:0,monthsToOperation:6};
  const r=marketAcquisitionReference(market,'ready-to-build','infraFund',overrides);
  const inputs=referenceInputs(market,'ready-to-build',overrides);
  assert.equal(r.status,'reference');
  inputs.forEach((c,i)=>{
    const solved=valueAcquisition(c.input,'infraFund');assert.equal(solved.status,'priced');
    close(r.referenceCases[i].pricePerMW,Math.min(...solved.audit.map(a=>a.pricePerMW)));
    close(r.referenceCases[i].targetReturn,solved.targetReturn);
    assert.equal(c.input.debt,null);
  });
});

test('known project inputs replace missing assumptions, including explicit zero, without changing market evidence',()=>{
  const market=markets.find(m=>m.manifest.id==='gb'),before=JSON.stringify(market.comparison);
  const cases=referenceInputs(market,'operating',{cashTaxRate:0,decommissioningPerMW:0,fixedFeesPerMW:0,
    initialWorksPerMW:0,operatingAgeYears:5,existingNetDebtPerMW:120,contractConfirmed:true,additionalPremium:0,
    unsecuredRevenueFactor:1,operatingCostFactor:1,debt:null});
  for(const c of cases){
    assert.deepEqual(validateAcquisition(c.input),[]);assert.equal(c.input.annual.length,c.input.economicLifeYears-5);
    assert.equal(c.input.existingNetDebtPerMW,120);assert.equal(c.input.decommissioningPerMW,0);
    assert.ok(c.input.annual.every(y=>y.tax===0));assert.equal(c.input.scenarios[0].costs[0].amount,0);
    assert.equal(c.input.debt,null);assert.equal(c.input.additionalPremium,0);
  }
  assert.equal(JSON.stringify(market.comparison),before);
});

test('PL and RO references convert model amounts to local currency and use that currency hurdle',()=>{
  for(const [id,currency,ratio,base] of [['pl','PLN',4.37,.0625],['ro','RON',5.331,.0675]]){
    const m=markets.find(m=>m.manifest.id===id),r=marketAcquisitionReference(m,'operating','strategic');
    assert.equal(r.currency,currency);close(r.localUnitsPerModelUnit,ratio);close(r.baseRate,base);
    const local=referenceInputs(m,'operating',{operatingAgeYears:0,cashTaxRate:.2})[1];
    const euro=acquisitionInput(m,'operating',{cashFlowCurrency:'EUR',operatingAgeYears:0,cashTaxRate:.2});
    close(local.input.annual[0].merchant,euro.annual[0].merchant*ratio);
  }
});

test('public operating scenarios hold only, and do not charge sunk construction a second time',()=>{
  const m=markets.find(m=>m.manifest.id==='wa'),r=marketAcquisitionReference(m,'operating','infraFund');
  for(const c of r.referenceCases){assert.equal(c.route,'hold');assert.equal(c.exitYear,null);assert.equal(c.assumptions.buildBudget,0);}
  assert.equal(marketAcquisitionReference(m,'operating','developer').status,'not-applicable');
  assert.equal(marketAcquisitionReference(m,'operating','infraFund',{conditionsMet:false}).status,'incomplete');
});

test('the expected return at a quoted price reproduces the ceiling and responds to price',()=>{
  const c=input(),solved=valueAcquisition(c,'strategic');
  const atCeiling=returnAtAcquisitionPrice(c,'strategic',solved.pricePerMW);
  close(atCeiling.annualReturn,solved.targetReturn);
  assert.ok(returnAtAcquisitionPrice(c,'strategic',solved.pricePerMW*.8).annualReturn>atCeiling.annualReturn);
  assert.ok(returnAtAcquisitionPrice(c,'strategic',solved.pricePerMW*1.2).annualReturn<atCeiling.annualReturn);
  const financed=input({debt:{mode:'new',riskClass:'mixed'}}),f=valueAcquisition(financed,'infraFund');
  close(returnAtAcquisitionPrice(financed,'infraFund',f.pricePerMW).annualReturn,f.targetReturn);
  assert.equal(returnAtAcquisitionPrice(c,'strategic',-1),null);
});

test('a partial project quote yields reference returns without requiring every field',()=>{
  const m=markets.find(m=>m.manifest.id==='wa');
  const a=marketAcquisitionReference(m,'operating','infraFund',{purchasePricePerMW:1000000,cashTaxRate:.25});
  const b=marketAcquisitionReference(m,'operating','infraFund',{purchasePricePerMW:1500000,cashTaxRate:.25});
  a.referenceCases.forEach((c,i)=>{
    assert.ok(c.atPrice.annualReturn>b.referenceCases[i].atPrice.annualReturn);
    assert.equal(c.assumptions.taxRate,.25);assert.equal(c.assumptions.taxOverridden,true);
  });
});

test('home display projection retains paired cases and provenance while pooling repeated assumptions',()=>{
  const m=markets.find(m=>m.manifest.id==='wa'),original=acquisitionRecommendations([m]);
  const before=JSON.stringify(original),packed=compactReferences(original);
  const restored=expandReferences(packed.acquisitions.infraFund,packed.acquisitionReferenceData);
  assert.equal(restored.length,2);
  const operation=restored.find(r=>r.stage==='operating');
  assert.equal(operation.referenceCases[0].assumptions.age,3);
  assert.equal(operation.referenceCases.find(c=>c.key==='base').assumptions.age,1);
  assert.equal(operation.referenceCases.find(c=>c.key==='favourable').assumptions.age,0);
  assert.equal(operation.currency,'AUD');assert.ok(operation.rateSource.startsWith('https://'));
  assert.equal(operation.referenceCases[0].key,'cautious');
  assert.ok(packed.acquisitionReferenceData.assumptions.length<22);
  assert.equal(JSON.stringify(original),before);
});
test('explicit full-life evidence is accepted without hard-coding a fresh 15 years',()=>{
  const r=valueAcquisition(input({annual:annual(21)}),'strategic');
  assert.equal(r.status,'priced');assert.equal(r.remainingYears,21);
});
test('missing one applicable sale input withholds the entire pre-operation recommendation',()=>{
  const c=rtb();delete c.saleTax;
  const r=valueAcquisition(c,'strategic');assert.equal(r.status,'incomplete');assert.equal(publicAcquisition(r),null);
});
test('unawarded merchant cash cannot obtain the more generous contracted loan convention',()=>{
  const years=annual(15);
  assert.equal(debtRiskClass(years,.035),'contracted');
  assert.equal(debtRiskClass(years.map(y=>({...y,secured:0,renewal:120})),.035),'merchant');
  assert.equal(debtRiskClass(years.map(y=>({...y,secured:60,merchant:60})),.035),'mixed');
});
test('immediate operating refurbishment reduces the ceiling and is funded at closing',()=>{
  const bare=valueAcquisition(input(),'strategic');
  const c=input({scenarios:[{probability:1,codYears:0,operates:true,costs:[{at:0,amount:100}],recoveries:[]}]});
  const repaired=valueAcquisition(c,'strategic');
  close(bare.pricePerMW-repaired.pricePerMW,100/1.015);
  close(repaired.closingEquityPerMW,repaired.pricePerMW*1.015+100);
});
