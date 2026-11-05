import { sourceDigest,digest } from '../../policy/integrity.mjs';
export const NOW='2026-11-05T06:17:00Z';
export const BODY='Synthetic test record. consultation effective adopted draft amended suspended withdrawn repealed superseded. Amount 10. Date 2025-01-01T00:00:00Z.';
export const CONTEXT={marketIds:['de','gb','nem','wa'],allowedHosts:['official.example']};
export function fixture(state='consultation',market='gb'){
  const snapshot={
    schemaVersion:1,id:'synthetic-policy',createdAt:NOW,parent:null,
    sources:[{id:'test-source',url:'https://official.example/record',publisher:'Synthetic public authority',title:'Test record',language:'en',authority:'official',locator:'section 1',contentHash:sourceDigest(BODY),issuedAt:'2025-01-01T00:00:00Z',checkedAt:NOW,rights:{metadata:true,termsURL:'https://official.example/terms',reviewed:true}}],
    instruments:[{id:'test-instrument',officialId:'TEST-1',jurisdiction:market,markets:[market],title:['Test instrument','测试文件'],state,supersedes:null}],
    events:[{id:'test-event',instrument:'test-instrument',kind:'transition',from:null,to:state,announcedAt:null,publishedAt:'2025-01-01T00:00:00Z',effectiveAt:state==='effective'?'2025-01-01T00:00:00Z':null,verifiedAt:NOW,claimIds:['test-claim'],corrects:null,summary:['Synthetic lifecycle event','模拟生命周期事件']}],
    claims:[{id:'test-claim',instrument:'test-instrument',kind:'legal_status',value:state,status:'verified',text:['Test state','测试状态'],markets:[market],mechanism:'context',evidence:[{source:'test-source',locator:'section 1',quote:state,supports:'legal_status'}],translationReviewed:true}],
    impacts:[],stories:[],links:[],reviews:[],
  };
  if(state==='effective'){
    snapshot.events[0].claimIds.push('test-effect-claim');
    snapshot.claims.push({...structuredClone(snapshot.claims[0]),id:'test-effect-claim',kind:'date',predicate:'effective_at',value:'2025-01-01T00:00:00Z',evidence:[{source:'test-source',locator:'section 1',quote:'2025-01-01T00:00:00Z',supports:'date'}]});
  }
  return snapshot;
}
export const bodies=()=>new Map([['test-source',BODY]]);
export const attestedContext=s=>({...CONTEXT,attestations:new Map(s.claims.map(c=>[c.id,{claimHash:digest(c),supported:true,translationEquivalent:true}])),sourceReviews:new Map(s.sources.map(source=>[source.id,{sourceHash:digest(source),maxQuoteChars:300}]))});
