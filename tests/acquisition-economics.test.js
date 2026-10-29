import test from 'node:test';
import assert from 'node:assert/strict';
import { cisRevenue } from '../src/economics/revenueSupport.js';
import { nominalAnnual, nominalRate, realRate, taxSchedule, priceIndex } from '../src/acquisition/cashflows.js';
import { acquisitionCashFlows, acquisitionHeadroom, valueAcquisition, returnAtAcquisitionPrice } from '../src/acquisition/valuation.js';
import { referenceInputs, marketAcquisitionReference } from '../src/acquisition/reference.js';
import { constructionCeiling, atConstructionBudget } from '../src/acquisition/construction.js';
import { workableTerms } from '../src/acquisition/workableTerms.js';
import { incomeOptions } from '../src/acquisition/scenarios.js';
import { operatingReference } from '../src/acquisition/operating.js';
import { markets } from '../src/markets/registry.js';
import { runCase } from '../src/comparison/engine.js';
import { ITC_TRANSFER_PRICE } from '../src/acquisition/parameters.js';
import { NON_FEOC_PREMIUM_USD_PER_KWH, OVERSIZE, landedDcPerKWh, DC_BLOCK_EUR_PER_KWH, COMMISSIONING_EUR_PER_KWH, FREIGHT_EUR_PER_KWH } from '../src/comparison/supplierQuote.js';

const m=id=>markets.find(m=>m.manifest.id===id),near=(a,b,t=1e-6)=>assert.ok(Math.abs(a-b)<=t,`${a} != ${b}`);
const annual=()=>Array.from({length:15},()=>({secured:0,merchant:100,renewal:0,opex:10,capex:0,tax:5}));
const synthetic=()=>({stage:'operating',currency:'EUR',powerMW:1,durationHours:2,existingNetDebtPerMW:0,fixedFeesPerMW:0,
  annual:annual(),decommissioningPerMW:10,conditionsMet:true,sources:['Synthetic hand-check'],targetReturn:.1,
  scenarios:[{probability:1,codYears:0,operates:true,costs:[],recoveries:[]}]});

test('CIS pays only the shortfall, leaves the middle band and caps repayments independently',()=>{
  const p={floor:100,ceiling:200,paymentCap:90,repaymentCap:25};
  near(cisRevenue(0,p).total,90);near(cisRevenue(50,p).total,95);
  near(cisRevenue(150,p).total,150);near(cisRevenue(300,p).total,275);
  near(cisRevenue(0,{...p,paymentCap:20}).total,20);
  assert.throws(()=>cisRevenue(100,{floor:200,ceiling:100}),RangeError);
});
test('the NEM comparison reconciles to the collar instead of fixed fee plus 10% trading',()=>{
  const market=m('nem'),r=runCase(market,'ltda',0),merchant=runCase(market,'mer',0);
  const gross=merchant.mchY[0]/r.fxRate;
  const terms=market.comparison.economics.ltda.cis;
  assert.ok(gross>terms.floor&&gross<terms.ceiling);
  near(r.secY[0]+r.mchY[0],merchant.mchY[0]);
});
test('real and nominal descriptions of the same cash flows have identical acquisition values',()=>{
  const real={...synthetic(),cashFlowBasis:'real',inflationRate:.02};
  const nominal={...synthetic(),cashFlowBasis:'nominal',annual:real.annual.map((y,i)=>Object.fromEntries(Object.entries(y).map(([k,v])=>[k,v*1.02**(i+1)]))),decommissioningPerMW:10*1.02**15};
  const a=valueAcquisition(real,'infraFund'),b=valueAcquisition(nominal,'infraFund');
  near(a.pricePerMW,b.pricePerMW);near(returnAtAcquisitionPrice(real,'infraFund',a.pricePerMW).annualReturn,.1);
  near(realRate(nominalRate(.08,.02),.02),.08);
  const fixed={...real,securedIndexation:'fixed',annual:[{secured:100,renewal:0,merchant:0,opex:10,capex:0,tax:0}]};
  near(nominalAnnual(fixed,{codYears:4})[0].secured,100);near(nominalAnnual(fixed,{codYears:4})[0].opex,10*1.02**5);
});
test('VAT recovery returns the principal actually funded, without inflation gains during the refund lag',()=>{
  const c={...synthetic(),cashFlowBasis:'real',inflationRate:.02,
    scenarios:[{probability:1,codYears:0,operates:true,costs:[{at:1,amount:20}],recoveries:[{at:2,priceAt:1,amount:20}]}]};
  const flows=acquisitionCashFlows(c,'infraFund','hold',100).flows;
  near(flows.find(f=>f.at===1&&f.amount<0).amount,-20.4);
  near(flows.find(f=>f.at===2&&f.amount===20.4).amount,20.4);
});
test('depreciation, losses and interest use a tax account, and principal is not deducted',()=>{
  const c={...synthetic(),taxPolicy:{rate:.2,depreciationYears:10,depreciableShare:1,transactionType:'asset',interestLimitShare:.3}};
  const y={secured:80,merchant:0,renewal:0,opex:20,capex:0,tax:0};
  const t=taxSchedule(c,[y,y],{codYears:0},100,[10,10]);
  near(t.annual[0].tax,8);near(t.remainingBasis,80);
  const loss=taxSchedule(c,[{...y,secured:0},y,y],{codYears:0},100);
  near(loss.annual[0].tax,0);near(loss.annual[1].tax,4);near(loss.annual[2].tax,10);
  const limited=taxSchedule(c,[y],{codYears:0},100,[100]);near(limited.annual[0].tax,6.4);
});
test('asset and share purchases keep distinct depreciation bases',()=>{
  const c={...synthetic(),operatingAgeYears:5,taxPolicy:{rate:.2,depreciationYears:10,depreciableShare:.85,transactionType:'share',inheritedBasisPerMW:50}};
  const a=taxSchedule(c,annual(),{codYears:0},100),b=taxSchedule(c,annual(),{codYears:0},200);
  near(a.annual[0].tax,b.annual[0].tax);near(a.initialBasis,50);
  const asset=taxSchedule({...c,taxPolicy:{...c.taxPolicy,transactionType:'asset'}},annual(),{codYears:0},200);
  near(asset.initialBasis,170);
});
test('asset-sale gains deduct the remaining tax basis after depreciation',()=>{
  const c={...synthetic(),stage:'ready-to-build',annual:Array.from({length:15},()=>({secured:150,merchant:0,renewal:0,opex:0,capex:0,tax:0})),
    buyerDiscountRate:.1,decommissioningPerMW:0,taxPolicy:{rate:.2,depreciationYears:10,basisPerMW:500},
    saleTax:{rate:.2,basisPerMW:500,includePurchase:true,transactionType:'asset'},
    scenarios:[{probability:1,codYears:1,operates:true,costs:[],recoveries:[]}]};
  const taxed=taxSchedule(c,c.annual,c.scenarios[0],0),tail=taxed.annual.slice(5);
  const terminal=tail.reduce((s,y,i)=>s+(150-y.tax)/1.1**(i+1),0);
  const expected=terminal*.985-Math.max(0,terminal*.985-250)*.2;
  const flows=acquisitionCashFlows(c,'infraFund','sale',0).flows;near(flows.at(-1).amount,expected);
});
test('long-life references expire the actual fixed contract and continue fade and service payments',()=>{
  const market=m('gb'),r=operatingReference(market,'toll',25);
  assert.equal(r.annual.length,25);assert.equal(r.annual[15].secured,0);
  assert.ok(r.annual[16].merchant<r.annual[15].merchant);
  assert.ok(r.annual[20].opex>0);
  const jp=operatingReference(m('jp_tokyo'),'ltda',25);
  assert.ok(jp.annual[19].secured>0);assert.equal(jp.annual[20].secured,0);
});
test('assumed contract economics do not change merely because a document is verified',()=>{
  const assumed=referenceInputs(m('fi'),'ready-to-build',{remainingBuildPerMW:10000});
  const verified=referenceInputs(m('fi'),'ready-to-build',{remainingBuildPerMW:10000,contractConfirmed:true});
  assumed.forEach((a,i)=>near(valueAcquisition(a.input,'infraFund').pricePerMW,valueAcquisition(verified[i].input,'infraFund').pricePerMW));
  assert.deepEqual(assumed.map(c=>c.input.annual.length),[15,20,25]);
  for(const market of markets)assert.ok(incomeOptions(market).length>=3);
});
test('CIS and floors are settled after nominalisation, so fixed floors do not erase merchant upside',()=>{
  const {input}=referenceInputs(m('nem'),'ready-to-build').find(c=>c.key==='base');
  const n=nominalAnnual(input,input.scenarios[0]);
  const year=n[0],r=input.annual[0].supportEligibleRevenue*(1+input.inflationRate)**(input.scenarios[0].codYears+1);
  const expected=cisRevenue(r,input.revenueSupport);near(year.secured+year.renewal+year.merchant,expected.total);
  assert.equal(marketAcquisitionReference(m('nem'),'ready-to-build','infraFund',{cisFloorPerMW:1000000,cisCeilingPerMW:100}).status,'incomplete');
});
test('reverse construction ceiling meets the target and is not a present-value gap mislabelled as a quote',()=>{
  const c=referenceInputs(m('gb'),'ready-to-build').find(c=>c.key==='base');
  const ceiling=constructionCeiling(c.input,'infraFund',c.assumptions.buildBudget);
  assert.ok(ceiling>0&&ceiling<c.assumptions.buildBudget);
  near(acquisitionHeadroom(atConstructionBudget(c.input,c.assumptions.buildBudget,ceiling),'infraFund',0),0,.001);
  assert.ok(acquisitionHeadroom(atConstructionBudget(c.input,c.assumptions.buildBudget,ceiling*1.1),'infraFund',0)<0);
});
test('workable fixed-income terms meet the same target without stacking the merchant line',()=>{
  const opts={remainingBuildPerMW:200000,unfixedConstructionPerMW:0,monthsToOperation:12,purchasePricePerMW:50000,targetReturn:.1};
  const t=workableTerms(m('fi'),'ready-to-build','infraFund',opts);assert.ok(t.minimumContractIncome>0);
  const c=referenceInputs(m('fi'),'ready-to-build',{...opts,strategyId:'conditional-toll',contractIncomePerMW:t.minimumContractIncome,contractTenorYears:10}).find(c=>c.key==='base');
  near(acquisitionHeadroom(c.input,'infraFund',50000),0,.02);assert.equal(c.input.annual[0].merchant,0);
  assert.equal(t.delays.length,2);assert.equal(t.priceSensitivity.length,4);
});
test('investment credits are conditional, paid after operation, and reduce tax basis',()=>{
  // Same capex, credit on and off, so only the credit moves the tax basis.
  const none=referenceInputs(m('caiso'),'ready-to-build',{usSupply:'as-entered'}).find(c=>c.key==='base');
  const credit=referenceInputs(m('caiso'),'ready-to-build',{usSupply:'as-entered',supportCase:'us-itc30'}).find(c=>c.key==='base');
  const recovery=credit.input.scenarios[0].recoveries.find(r=>r.kind==='investment-credit');
  assert.ok(recovery.at>credit.input.scenarios[0].codYears);
  assert.ok(recovery.amount>0);near(none.input.taxPolicy.basisPerMW-credit.input.taxPolicy.basisPerMW,recovery.amount/ITC_TRANSFER_PRICE*.5);
  const operating=referenceInputs(m('caiso'),'operating',{supportCase:'us-itc30'});assert.ok(operating.every(c=>c.assumptions.capitalSupportPerMW===0));
  const eu=referenceInputs(m('gb'),'ready-to-build',{supportCase:'us-itc30'});assert.ok(eu.every(c=>c.assumptions.capitalSupportPerMW===0));
});

test('US new builds price a non-FEOC block with the credit, or a Chinese block without it',()=>{
  const base=c=>c.find(x=>x.key==='base');
  const feoc=base(referenceInputs(m('pjm'),'ready-to-build')),cn=base(referenceInputs(m('pjm'),'ready-to-build',{usSupply:'chinese'}));
  assert.equal(feoc.assumptions.usSupply,'non-feoc');assert.equal(feoc.assumptions.supportCase,'us-itc30');
  assert.equal(cn.assumptions.supportCase,'none');assert.equal(cn.assumptions.capitalSupportPerMW,0);
  assert.ok(feoc.assumptions.capitalSupportPerMW>0);
  // The two differ only by the DC block: $50/kWh nameplate × oversize × 4,000 kWh, plus contingency and grid allowance.
  near(feoc.assumptions.buildBudget-cn.assumptions.buildBudget,NON_FEOC_PREMIUM_USD_PER_KWH*OVERSIZE*4000*1.125,1);
  near(landedDcPerKWh('USD'),(DC_BLOCK_EUR_PER_KWH*1.409+COMMISSIONING_EUR_PER_KWH+FREIGHT_EUR_PER_KWH)*OVERSIZE*1.1208,1e-6);
});
test('US and GB write the basis off in year one and the owner group uses the losses',()=>{
  for(const id of ['pjm','ercot','caiso','gb']){
    const {input}=referenceInputs(m(id),'ready-to-build').find(c=>c.key==='base');
    assert.equal(input.taxPolicy.depreciationYears,1);assert.equal(input.taxPolicy.groupRelief,true);
    const s=input.scenarios[0],t=taxSchedule(input,nominalAnnual(input,s),s,0).annual;
    assert.ok(t[0].tax<0,id+': the year-one write-off is a group tax saving');
  }
  const {input}=referenceInputs(m('de'),'ready-to-build').find(c=>c.key==='base');
  assert.ok(input.taxPolicy.depreciationYears>1&&!input.taxPolicy.groupRelief);
});
test('revenue and every secured contract escalate at 2.5%',()=>{
  for(const id of ['it','gb','de']){
    const {input}=referenceInputs(m(id),'ready-to-build').find(c=>c.key==='base');
    assert.equal(input.inflationRate,.025);assert.equal(input.securedIndexation,'indexed');assert.equal(input.inflationPath,null);
  }
});
test('Japan follows the Bank of Japan core-CPI path its LTDA payment is corrected by',()=>{
  for(const id of ['jp_tokyo','jp_kyushu','jp_hokkaido']){
    const {input}=referenceInputs(m(id),'ready-to-build').find(c=>c.key==='base');
    assert.deepEqual(input.inflationPath,[.0245,.022,.02]);assert.equal(input.securedIndexation,'indexed');
    near(priceIndex(input,1.5),1.0245*1.022**.5);near(priceIndex(input,10),1.0245*1.022*1.02**8);
  }
  const entered=referenceInputs(m('jp_tokyo'),'ready-to-build',{inflationRate:.03}).find(c=>c.key==='base');
  assert.equal(entered.input.inflationPath,null);near(priceIndex(entered.input,2),1.03**2);
});

test('post-sale support transfers into proceeds and is not a second seller cash receipt',()=>{
  const c={...synthetic(),stage:'ready-to-build',decommissioningPerMW:0,buyerDiscountRate:.1,
    saleTax:{rate:.2,basisPerMW:490,includePurchase:true},taxCreditBasisReduction:10,
    scenarios:[{probability:1,codYears:0,operates:true,costs:[],recoveries:[{at:1,amount:40,kind:'investment-credit'}]}]};
  const flows=acquisitionCashFlows(c,'developer','sale',0).flows;
  assert.equal(flows.length,2);assert.ok(flows.every(f=>f.at===0));
  const terminal=c.annual.reduce((s,y,i)=>s+(y.merchant-y.opex-y.tax)/1.1**(i+1),0)+40/1.1;
  // Seller did not claim a credit: the transferred buyer benefit does not also
  // reduce the seller's original 500 basis by 10.
  near(flows.at(-1).amount,terminal*.985-Math.max(0,terminal*.985-500)*.2);
});
