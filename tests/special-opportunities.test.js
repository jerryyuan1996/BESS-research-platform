import test from 'node:test';
import assert from 'node:assert/strict';
import { markets, byId } from '../src/markets/registry.js';
import { opportunities, LENSES } from '../src/experience/model.js';
import { compareOpportunity, beatsConventional } from '../src/opportunities/model.js';
import { SPECIAL_OPPORTUNITIES, opportunityById, SCOUT_OPPORTUNITIES } from '../src/opportunities/catalog.js';
import { acquisitionCashFlows, validateAcquisition } from '../src/acquisition/valuation.js';
import { nominalAnnual, taxSchedule } from '../src/acquisition/cashflows.js';
import { revenueMechanismsFor, REVENUE_MECHANISMS } from '../src/opportunities/revenue.js';
const close = (a,b,tolerance=1e-5) => assert.ok(Math.abs(a-b)<tolerance, a+' != '+b);
const pv = (flows,r) => flows.reduce((s,c)=>s+c.amount/(1+r)**c.at,0);

test('every modelled market has a sourced opportunity; scouts remain unpriced',()=>{
  assert.deepEqual(new Set(SPECIAL_OPPORTUNITIES.map(o=>o.market)),new Set(markets.map(m=>m.manifest.id)));
  assert.equal(new Set(SPECIAL_OPPORTUNITIES.map(o=>o.id)).size,SPECIAL_OPPORTUNITIES.length);
  /* Eight until Spain and Saudi Arabia were registered (2026-10-29). */
  assert.equal(SCOUT_OPPORTUNITIES.length,6);
  for(const o of SPECIAL_OPPORTUNITIES){
    assert.match(o.source,/^https:\/\//);
    for(const key of ['label','thesis','conditions','risk'])assert.equal(o[key].length,2);
    assert.ok(o.months[1]>=o.months[0]);
  }
});

test('identical timing, cost and rights produce identical cash flows and no extra rights value',()=>{
  const c=compareOpportunity(byId('fi'),opportunityById('fi-available-node'),'infraFund',null,
    {baselineMonths:18,specialMonths:18,targetPercent:5});
  assert.ok(!c.unavailable);
  assert.deepEqual(c.standard.input.annual,c.alternative.input.annual);
  close(c.standard.npv,c.alternative.npv);
  close(c.standard.atPrice.annualReturn,c.alternative.atPrice.annualReturn);
  close(c.relativeCeiling,0);
  close(c.safePremium,0);
});

test('an identical US design earns the same investment credit as the conventional one',()=>{
  // The special case is priced on an all-in budget; its credit must still use
  // the conventional pre-contingency basis, or a twin gains rights value from nothing.
  for(const id of ['pjm-surplus','caiso-deliverability']){
    const o=opportunityById(id),c=compareOpportunity(byId(o.market),o,'infraFund',null,
      {baselineMonths:18,specialMonths:18,targetPercent:5,buildPremiumPct:0});
    assert.ok(!c.unavailable,id);
    assert.ok(c.standard.assumptions.capitalSupportPerMW>0,id+' carries the credit');
    close(c.standard.assumptions.capitalSupportPerMW,c.alternative.assumptions.capitalSupportPerMW,1e-6);
    close(c.standard.atPrice.annualReturn,c.alternative.atPrice.annualReturn);
    close(c.safePremium,0,1e-3);
  }
});

test('rights budget preserves each conventional route and the target, after fees and costs',()=>{
  const market=byId('de'),o=opportunityById('de-existing-node');
  const values={baselineMonths:36,specialMonths:12,targetPercent:5,buildPremiumPct:0};
  const c=compareOpportunity(market,o,'infraFund',null,values);
  assert.ok(c.safePremium>1000);
  const residuals=[];
  for(const route of ['hold','sale']){
    const conventional=pv(acquisitionCashFlows(c.standard.input,'infraFund',route,c.commonPrice).flows,c.targetReturn);
    const special=pv(acquisitionCashFlows(c.alternative.input,'infraFund',route,c.commonPrice+c.safePremium).flows,c.targetReturn);
    assert.ok(special>=-1e-5);
    assert.ok(special>=conventional-1e-5);
    residuals.push(special-conventional);
  }
  close(Math.min(...residuals),0,1e-4);
  const tooMuch=compareOpportunity(market,o,'infraFund',null,{...values,nodePremiumPerMW:c.safePremium+100});
  assert.equal(tooMuch.comparable,false);
  close(c.safePremiumPerMWh,c.safePremium/c.alternative.input.durationHours);
});

test('qualification lag reduces income but not costs or the fixed contract expiry',()=>{
  const input={cashFlowBasis:'nominal',revenueQualificationMonths:6,annual:[
    {secured:100,renewal:20,merchant:80,opex:30,capex:4,tax:0},
    {secured:0,renewal:0,merchant:100,opex:30,capex:4,tax:0},
  ]};
  const annual=nominalAnnual(input,{codYears:1});
  close(annual[0].secured,50);close(annual[0].merchant,40);close(annual[0].renewal,10);
  close(annual[0].opex,30);close(annual[0].capex,4);
  close(annual[1].secured,0);close(annual[1].merchant,100);
  const floor={...input,revenueSupport:{type:'floor',years:1,floor:200,assumed:true},
    annual:input.annual.map(y=>({...y,supportEligibleRevenue:100}))};
  close(nominalAnnual(floor,{codYears:1})[0].secured,100);
  const m=byId('fi'),o=opportunityById('fi-available-node');
  const fast=compareOpportunity(m,o,'infraFund',null,{specialMonths:12,targetPercent:5});
  const late=compareOpportunity(m,o,'infraFund',null,{specialMonths:12,targetPercent:5,specialQualificationMonths:12});
  assert.ok(late.alternative.npv<fast.alternative.npv);
  close(late.alternative.codMonths,fast.alternative.codMonths);
  close(late.alternative.qualifiedMonths,fast.alternative.qualifiedMonths+12);
});

test('small routes have actual small MW, no automatic long-term award and explicit cost penalties',()=>{
  for(const id of ['nem-sub5','ercot-small-dg','jp-tokyo-small','ro-sub5']){
    const o=opportunityById(id),m=byId(o.market);
    const c=compareOpportunity(m,o,'strategic',null,{buildPremiumPct:15,opexPremiumPct:15});
    const neutral=compareOpportunity(m,o,'strategic',null,{buildPremiumPct:0,opexPremiumPct:0});
    assert.ok(!c.unavailable,id);
    assert.equal(c.alternative.input.powerMW,o.powerMW);
    assert.equal(c.alternative.input.strategyId,o.route);
    assert.equal(c.alternative.input.revenueSupport,null);
    assert.equal(c.alternative.assumptions.capitalSupportPerMW,0);
    close(c.alternative.assumptions.buildBudget,neutral.alternative.assumptions.buildBudget*1.15);
    close(c.alternative.input.annual[0].opex,neutral.alternative.input.annual[0].opex*1.15);
  }
});

test('all investor comparisons validate, retain currencies and preserve original play/market data',()=>{
  const before=JSON.stringify(markets.map(m=>m.comparison));
  for(const investor of Object.keys(LENSES)){
    const rows=opportunities(investor);
    for(const o of SPECIAL_OPPORTUNITIES){
      const row=rows.find(r=>r.id===o.market),playBefore=JSON.stringify(row.play);
      const c=compareOpportunity(row.market,o,investor,row.play);
      if(row.market.comparison.engineReady===false){assert.ok(c.unavailable,investor+'/'+o.id+' must stay unpriced');continue;}
      assert.ok(!c.unavailable,investor+'/'+o.id+': '+c.unavailable);
      for(const side of [c.standard,c.alternative]){
        assert.deepEqual(validateAcquisition(side.input),[]);
        assert.equal(side.input.targetReturn,c.targetReturn);
        assert.equal(side.input.annual.length,20);
        assert.equal(side.input.debt,null);
      }
      assert.equal(c.standard.input.currency,c.alternative.input.currency);
      assert.deepEqual(c.standard.input.scenarios.map(s=>s.probability),c.alternative.input.scenarios.map(s=>s.probability));
      assert.equal(JSON.stringify(row.play),playBefore);
    }
  }
  assert.equal(JSON.stringify(markets.map(m=>m.comparison)),before);
});

test('infeasible budgets, invalid inputs and ineligible entry routes do not become free connections',()=>{
  const m=byId('de'),o=opportunityById('de-existing-node');
  for(const values of [{avoidedGridPerMW:1e12},{specialMonths:NaN},{nodePremiumPerMW:-1},{lifeYears:20.5},{stage:'operating'}])
    assert.ok(compareOpportunity(m,o,'infraFund',null,values).unavailable);
  assert.ok(compareOpportunity(m,o,'foreignFirstTimer',null,{stage:'greenfield'}).unavailable);
  const c=compareOpportunity(m,o,'infraFund',null,{targetPercent:80});
  assert.equal(c.safePremium,null);assert.equal(c.comparable,false);
});

test('mechanism explanation follows the actual revenue route and distinguishes MACSE, toll and merchant',()=>{
  assert.deepEqual(revenueMechanismsFor(byId('it'),'cap'),['capacity','merchant','ancillary']);
  assert.deepEqual(revenueMechanismsFor(byId('it'),'ltda'),['macse']);
  assert.equal(revenueMechanismsFor(byId('nem'),'ltda')[0],'cis');
  assert.equal(revenueMechanismsFor(byId('jp_tokyo'),'ltda')[0],'ltda');
  assert.equal(revenueMechanismsFor(byId('ca_on'),'cap')[0],'lt2');
  assert.equal(revenueMechanismsFor(byId('de'),'toll')[0],'toll');
  assert.deepEqual(revenueMechanismsFor(byId('ercot'),'mer'),['merchant','ancillary']);
  for(const m of Object.values(REVENUE_MECHANISMS))for(const k of ['title','payer','problem','pricing','drivers','discipline'])assert.equal(m[k].length,2);
});

const nemSmall = opportunityById('nem-sub5');
const priceNem = (values = {}, card = nemSmall, investor = 'infraFund') =>
  compareOpportunity(byId('nem'),card,investor,null,values);

test('neutral distribution inputs reproduce the original special cash flows exactly',()=>{
  const {distribution,...plain} = nemSmall;
  const previous = priceNem({specialMonths:13.5},plain);
  const neutral = priceNem({specialMonths:13.5});
  assert.deepEqual(neutral.alternative.input.annual,previous.alternative.input.annual);
  assert.deepEqual(neutral.alternative.annual,previous.alternative.annual);
  assert.deepEqual(neutral.standard.input.annual,previous.standard.input.annual);
  assert.equal((100*neutral.alternative.holdReturn.annualReturn).toFixed(2),'5.75');
});

test('each signed network part is outside fees, income haircuts and operating cost uplifts and enters tax once',()=>{
  const tax = side => side.annual.reduce((sum,year)=>sum+year.tax,0);
  // Fixed access and demand charges stay flat; energy-band charges and credits
  // fall with degradation, exactly like the reserve line beside them.
  const fade = year => (1-(byId('nem').comparison.economics.degr||2)/100)**year;
  const parts = { networkFlatPerMW:() => 1, networkDispatchPerMW:fade };
  for (const inputs of [{}, {revenueHaircutPct:30,opexPremiumPct:70,routeFeePct:20}]) {
    const zero=priceNem(inputs);
    for (const [part,shape] of Object.entries(parts)) for (const network of [-20000,50000]) {
      const run=priceNem({...inputs,[part]:network});
      assert.deepEqual(run.standard.input.annual,zero.standard.input.annual);
      assert.ok((run.alternative.npv-zero.alternative.npv)*network>0,part);
      assert.ok((tax(run.alternative)-tax(zero.alternative))*network>0,part);
      run.alternative.input.annual.forEach((year,i)=>{
        const base=zero.alternative.input.annual[i];
        close(year.network,network*shape(i));
        close(year.merchant-base.merchant,year.network);
        close(year.opex,base.opex);
        close(run.alternative.annual[i].merchant-zero.alternative.annual[i].merchant,run.alternative.annual[i].network);
      });
    }
    const both=priceNem({...inputs,networkFlatPerMW:-6000,networkDispatchPerMW:-300});
    both.alternative.input.annual.forEach((year,i)=>close(year.network,-6000-300*fade(i)));
  }
  const dispatch=priceNem({networkDispatchPerMW:20000}).alternative.input.annual;
  assert.ok(dispatch.at(-1).network<dispatch[0].network,'only the dispatch part degrades');
  const flat=priceNem({networkFlatPerMW:20000}).alternative.input.annual;
  assert.ok(flat.every(year=>Math.abs(year.network-20000)<1e-6),'the flat part stays flat');
  for (const part of Object.keys(parts)) {
    const lag=priceNem({[part]:20000,specialQualificationMonths:6});
    const zero=priceNem({specialQualificationMonths:6});
    close(lag.alternative.annual[0].merchant-zero.alternative.annual[0].merchant,lag.alternative.annual[0].network);
  }
  const policy={rate:.3,depreciationYears:10,basisPerMW:0,groupRelief:true};
  const sample={cashFlowBasis:'nominal',taxPolicy:policy,annual:[{secured:0,renewal:0,merchant:120,network:20,opex:0,capex:0,tax:0}]};
  const scenario={codYears:0};
  close(taxSchedule(sample,nominalAnnual(sample,scenario),scenario,0).annual[0].tax,36);
});

test('route-specific economics affect only the small project and reject invalid inputs and an unsupported avoided-works seed',()=>{
  const base=priceNem();
  for(const values of [{lossFactor:.85},{servicesShare:0},{routeFeePct:20}]){
    const run=priceNem(values);
    assert.ok(run.alternative.npv<base.alternative.npv);
    assert.deepEqual(run.standard.input.annual,base.standard.input.annual);
  }
  for (const [field,low,high] of [['lossFactor',.79,1.11],['servicesShare',-.01,1.01],
    ['routeFeePct',-1,31],['networkFlatPerMW',-200001,200001],['networkDispatchPerMW',-200001,200001]]) {
    for (const value of [low,high,NaN]) {
      assert.match(priceNem({[field]:value}).unavailable,/Invalid comparison input/);
      assert.equal(priceNem({[field]:value}).field,field);
      const badCard={...nemSmall,distribution:{...nemSmall.distribution,[field]:value}};
      assert.match(priceNem({},badCard).unavailable,/Invalid comparison input/);
    }
  }
  // The card's own seed is credited only against an explicit conventional
  // connection cost, and NEM's conventional costs carry none.
  const seeded=priceNem({},{...nemSmall,avoidedConnectionPerMW:1});
  assert.match(seeded.unavailable,/explicit conventional connection cost/);
  assert.equal(seeded.reason.length,2);
  // Deliberate change: a reader's avoided-works value is their scenario and
  // prices against the whole build budget, as it did before the network line.
  const reader=priceNem({avoidedGridPerMW:50000});
  assert.ok(!reader.unavailable,reader.unavailable);
  close(reader.alternative.assumptions.buildBudget,base.alternative.assumptions.buildBudget-50000,1e-6);
  assert.ok(reader.alternative.npv>base.alternative.npv);
  assert.deepEqual(reader.standard.input.annual,base.standard.input.annual);
  close(reader.standard.npv,base.standard.npv);
  assert.deepEqual(reader.avoidedScenario,{perMW:50000,conventionalConnectionPerMW:0});
  assert.equal(base.avoidedScenario,undefined);
  assert.equal(priceNem({avoidedGridPerMW:0}).avoidedScenario,undefined);
  assert.match(priceNem({avoidedGridPerMW:1e11}).unavailable,/remaining construction budget/);
});

test('every reason a comparison cannot be priced is given in English and Chinese',()=>{
  const {hours,...missing}=nemSmall;
  const cases=[
    priceNem({stage:'operating'}), priceNem({},missing), priceNem({lifeYears:20.5}),
    priceNem({routeFeePct:99}), priceNem({avoidedGridPerMW:1e11}),
    priceNem({},{...nemSmall,avoidedConnectionPerMW:1}),
    compareOpportunity(byId('de'),nemSmall,'infraFund'),
  ];
  for(const c of cases){
    assert.ok(c.unavailable);
    assert.equal(c.reason.length,2);
    assert.equal(c.reason[0],c.unavailable);
    assert.ok(c.reason[1].length>0 && /[一-鿿]/.test(c.reason[1]),c.reason[1]);
  }
});

test('the Sub-5 thesis names both things the route avoids, in both languages',()=>{
  const [en,zh]=nemSmall.thesis;
  assert.match(en,/transmission connection queue and registration/);
  assert.match(zh,/输电接入排队和注册/);
  // Evidence is recorded for each network part, never shown as a gate code.
  for(const key of ['networkFlatPerMW','networkDispatchPerMW'])
    assert.equal(nemSmall.distributionEvidence[key].level,'thin');
  assert.deepEqual([nemSmall.distribution.networkFlatPerMW,nemSmall.distribution.networkDispatchPerMW],[0,0]);
});

test('small-route timing follows entry stage and each design declares a duration',()=>{
  const {hours,...missing}=nemSmall;
  assert.equal(priceNem({},missing).unavailable,'A small route must declare its own duration');
  close(priceNem().alternative.codMonths,7.5);
  close(priceNem({stage:'greenfield'},nemSmall,'developer').alternative.codMonths,19.5);
  close(priceNem({stage:'greenfield',specialMonths:16},nemSmall,'developer').alternative.codMonths,16);
  close(priceNem({specialMonths:11}).alternative.codMonths,11);
  const equal=compareOpportunity(byId('ro'),opportunityById('ro-sub5'),'infraFund',null,{baselineMonths:14});
  close(equal.alternative.codMonths,14);
});

test('four investors retain their conventional selections and the approved small-route returns',async()=>{
  const {OPPORTUNITY_SUMMARY}=await import('../src/opportunities/summaryData.js');
  const signed={
    'nem-sub5':['5.86','7.37'], 'ercot-small-dg':['-6.30','0.53'], 'ro-sub5':['7.05','11.20'],
  };
  const japan=['jp-tokyo-small','jp-kyushu-small','jp-hokkaido-small'];
  for(const investor of Object.keys(LENSES)){
    const rows=opportunities(investor);
    for(const id of [...Object.keys(signed),...japan]){
      const card=opportunityById(id),row=rows.find(r=>r.id===card.market);
      const result=compareOpportunity(row.market,card,investor,row.play);
      assert.ok(!result.unavailable,investor+' '+id);
      assert.equal(beatsConventional(result),false);
      if(signed[id]){
        const formatted=[result.alternative,result.standard].map(side=>(100*side.holdReturn.annualReturn).toFixed(2));
        assert.deepEqual(formatted,signed[id],investor+' '+id);
      } else {
        assert.equal(result.alternative.input.durationHours,4);
        assert.equal(result.alternative.holdReturn?.annualReturn ?? null,null);
      }
    }
    assert.deepEqual(OPPORTUNITY_SUMMARY[investor].picks.map(o=>o.id),
      investor==='foreignFirstTimer'?['de-existing-node']:['de-existing-node','pl-awarded']);
  }
});

test('the stored review events are idempotent and never change the model or create an Ontario view', async()=>{
  const {createViewStore}=await import('../scripts/view/writer.mjs');
  const {smallConnectionChanges}=await import('../scripts/view/content/sub5-triggers-2026-11.mjs');
  const store=createViewStore();
  const expected=[['nem','nem-exemption-guide-draft','2026-12',['revenueCertainty','policyStability']],
    ['nem','nem-storage-tariffs-fy28','2027-07',['assetReturn']],['caiso','caiso-rule21-screen-q',null,['revenueCertainty']]];
  const fresh=await smallConnectionChanges({read:async()=>({triggers:[]})});
  assert.deepEqual(fresh.map(c=>[c.market,c.to.id]),expected.map(([market,id])=>[market,id]));
  for(const [market,id,when,watches] of expected){
    const record=(await store.read(market)).triggers.find(t=>t.id===id);
    assert.equal(record.kind,'event');assert.equal(record.effect,null);assert.equal(record.expected,when);
    assert.deepEqual(record.watches,watches);assert.equal(record.label.length,2);
  }
  assert.deepEqual(await smallConnectionChanges(store),[]);
});
