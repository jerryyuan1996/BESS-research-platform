/** Synthetic browser fixtures only. Never imported by src/ or public/. */
import { digest,sourceDigest } from '../../policy/integrity.mjs';
const pilots=[['de','DE','Germany','德国','EUR'],['gb','GB','Great Britain','英国','GBP'],['nem','AU-NEM','NEM','NEM','AUD'],['wa','AU-WA','WEM','WEM','AUD']];
export function policyUIFixture(){
  const initial={schemaVersion:1,id:'synthetic-policy-v1',createdAt:'2025-01-01T00:00:00Z',parent:null,sources:[],instruments:[],events:[],claims:[],impacts:[],stories:[],links:[],reviews:[]};
  for(const [market,jurisdiction,en,zh]of pilots){
    const instrument=`${market}-test-instrument`,source=`${market}-source-old`,claim=`${market}-consultation`;
    initial.sources.push({id:source,url:`https://official.example/${market}/old`,publisher:'Synthetic public authority',title:'Synthetic consultation fixture',language:market==='de'?'de':'en',authority:'official',locator:'section 1',contentHash:sourceDigest('Synthetic consultation record.'),issuedAt:'2021-01-01T00:00:00Z',checkedAt:initial.createdAt,rights:{metadata:true,termsURL:'https://official.example/terms',reviewed:true}});
    initial.instruments.push({id:instrument,officialId:`SYN-${market}`,jurisdiction,markets:[market],title:[`Synthetic ${en} storage policy`,`模拟${zh}储能政策`],state:'consultation',supersedes:null});
    initial.claims.push({id:claim,instrument,kind:'legal_status',value:'consultation',status:'verified',text:['Synthetic consultation is open.','模拟征询意见已启动。'],markets:[market],mechanism:'context',evidence:[{source,locator:'section 1',quote:'consultation',supports:'legal_status'}],translationReviewed:true});
    initial.events.push({id:`${market}-event-old`,instrument,kind:'transition',from:null,to:'consultation',announcedAt:null,publishedAt:'2021-01-01T00:00:00Z',effectiveAt:null,verifiedAt:initial.createdAt,claimIds:[claim],corrects:null,summary:['Synthetic initial consultation.','模拟初始征询意见。']});
  }
  const oldHash=digest(initial);const snapshot=structuredClone(initial);snapshot.id='synthetic-policy-v2';snapshot.parent=oldHash;snapshot.createdAt='2026-11-05T06:17:00Z';
  for(const [market,jurisdiction,en,zh,currency]of pilots){
    const instrument=`${market}-test-instrument`,source=`${market}-source-new`,claim=`${market}-adopted`,effect=`${market}-effect-date`,number=`${market}-test-number`;
    snapshot.instruments.find(i=>i.id===instrument).state='adopted';
    snapshot.sources.push({id:source,url:`https://official.example/${market}/new`,publisher:'Synthetic public authority',title:'Synthetic adoption fixture',language:market==='de'?'de':'en',authority:'official',locator:'section 2',contentHash:sourceDigest('Synthetic adopted record; effect 2027-01-01T00:00:00Z; amount 10.'),issuedAt:'2025-01-01T00:00:00Z',checkedAt:snapshot.createdAt,rights:{metadata:true,termsURL:'https://official.example/terms',reviewed:true}});
    const common={instrument,status:'verified',markets:[market],mechanism:'grid_access',translationReviewed:true};
    snapshot.claims.push({...common,id:claim,kind:'legal_status',value:'adopted',text:['Synthetic rule is adopted; investment eligibility needs separate review.','模拟规则已通过；投资资格需单独复核。'],evidence:[{source,locator:'section 2',quote:'adopted',supports:'legal_status'}]},
      {...common,id:effect,kind:'date',predicate:'effective_at',value:'2027-01-01T00:00:00Z',text:['Announced effect: 2027.','公布的生效时间：2027。'],evidence:[{source,locator:'section 2',quote:'2027-01-01T00:00:00Z',supports:'date'}]},
      {...common,id:number,kind:'number',value:10,text:['Synthetic unit amount 10.','模拟单位金额10。'],evidence:[{source,locator:'section 2',quote:'10',supports:'number'}]});
    snapshot.events.push({id:`${market}-event-new`,instrument,kind:'transition',from:'consultation',to:'adopted',announcedAt:null,publishedAt:'2025-01-01T00:00:00Z',effectiveAt:'2027-01-01T00:00:00Z',verifiedAt:snapshot.createdAt,claimIds:[claim,effect],corrects:null,summary:['Synthetic adoption with future effect; prior investment call unchanged.','模拟规则通过、未来生效；原投资结论保持不变。']});
    snapshot.impacts.push({id:`${market}-scenario`,claim:number,lane:'scenario',value:20,currency,denominator:'MW',period:'annual',technology:'BESS',location:jurisdiction,formula:'sum',inputs:[number,number],asOf:'2025-01-01',contract:'synthetic',taxTreatment:'before tax',marketDefinition:'synthetic-policy-cost'});
    snapshot.stories.push({id:`${market}-test-story`,title:[`Synthetic ${en} policy story`,`模拟${zh}政策叙事`],answer:['Connection reform changes eligibility, not the approved investment call.','并网改革改变资格条件，并不自动改变已批准投资结论。'],instrumentIds:[instrument],claimIds:[`${market}-consultation`,claim,effect,number],changesIf:['New original evidence changes the scope or legal effect.','新的原始证据改变适用范围或法律效力。'],chapters:[
      {id:'problem',title:['The system problem','系统问题'],text:['Synthetic evidence separates connection access from investment returns.','模拟证据区分并网准入与投资回报。'],claimIds:[claim],scene:{template:'lifecycle',claimIds:[`${market}-consultation`,claim],impactIds:[]}},
      {id:'history',title:['From consultation to adoption','从征询到通过'],text:['The 2021 consultation and 2025 adoption are distinct events; the announced 2027 effect is later.','2021年征询与2025年通过是不同事件，公布的2027年生效时间更晚。'],claimIds:[`${market}-consultation`,claim,effect],scene:{template:'timeline',claimIds:[`${market}-consultation`,claim,effect],impactIds:[]}},
      {id:'impact',title:['A transparent scenario','透明情景'],text:['A synthetic scenario adds two cited amounts; it is not an observed investment return.','模拟情景将两项引用金额相加，并非已观察到的投资回报。'],claimIds:[number],scene:{template:'impact_waterfall',claimIds:[],impactIds:[`${market}-scenario`]}}
    ]});
    snapshot.links.push({id:`${market}-test-link`,claim,market,target:`view/markets/${market}.json#thesis`,kind:'challenges',mechanism:'grid_access',source,relevance:['Synthetic connection eligibility link.','模拟并网资格关联。'],approvedAt:'2025-01-01T00:00:00Z',state:'pending_reassessment'});
    snapshot.reviews.push({id:`${market}-test-review`,claim,linkIds:[`${market}-test-link`],status:'pending_reassessment',reason:['Synthetic eligibility review.','模拟资格复核。'],action:['Review the investment implication separately.','单独复核投资影响。']});
  }
  const head=digest(snapshot);
  return {snapshot,index:{schemaVersion:1,head,versions:[oldHash,head],publishedAt:snapshot.createdAt,pendingReviews:pilots.map(([market])=>({id:`${market}-test-review`,market,instrument:`${market}-test-instrument`,claim:`${market}-adopted`}))},versions:new Map([[oldHash,initial],[head,snapshot]])};
}
export async function servePolicy(page,data=policyUIFixture()){
  await page.route('**/data/public/policy/**',route=>{
    const pathname=new URL(route.request().url()).pathname;
    const value=pathname.endsWith('/index.json')?data.index:data.versions.get(pathname.split('/').at(-1).replace(/\.json$/,''));
    return value?route.fulfill({json:value}):route.fulfill({status:404,body:'Not found'});
  });
  return data;
}
