import {h} from '../utils/dom.js';
import {L} from '../app/i18n.js';
import {policySceneProblems} from '../../policy/scene-contract.mjs';
export const sceneProblems=policySceneProblems;
const NS='http://www.w3.org/2000/svg';
const TITLES={timeline:['Policy chronology','政策时间线'],lifecycle:['Instrument lifecycle','文件生命周期'],status_transition:['Legal status transitions','法律状态变化'],before_after:['Before and after','前后变化'],causal:['Cited causal interpretation','有据的因果解释'],stakeholder:['Attributed positions and tensions','有出处的立场与分歧'],sourced_range:['Sourced values on the same basis','相同口径的来源数值'],impact_waterfall:['Transparent scenario breakdown','透明情景分解'],market_matrix:['Policy scope by market','各市场政策范围']};
function node(tag,attrs={},text=null){const element=document.createElementNS(NS,tag);for(const [key,value]of Object.entries(attrs))element.setAttribute(key,String(value));if(text!==null)element.textContent=String(text);return element;}
const short=(text,max=76)=>text.length>max?text.slice(0,max-1)+'…':text;
const basis=i=>`${i.currency||''} / ${i.denominator||''} · ${i.period||''} · ${i.asOf||''}`;
const claimDate=(claim,snapshot)=>claim.kind==='date'?claim.value:snapshot.events.find(e=>e.claimIds.includes(claim.id))?.publishedAt||'';
const text=(svg,x,y,label,attrs={})=>svg.append(node('text',{x,y,...attrs},label));
function sequence(svg,claims,snapshot,template){
  const pair=template==='before_after';
  claims.forEach((claim,i)=>{
    const x=pair?24+i*350:24,y=pair?40:35+i*70;
    if(!pair&&i<claims.length-1)svg.append(node('line',{x1:x+6,x2:x+6,y1:y+8,y2:y+62,class:'policy-scene-line'}));
    svg.append(node('circle',{cx:x+6,cy:y,r:5,class:'policy-scene-dot'}));
    text(svg,x+22,y,claimDate(claim,snapshot),{class:'policy-scene-date'});
    text(svg,x+22,y+23,short(L(claim.text),pair?35:76));
  });
}
function relationships(svg,claims,relations){
  const positions=new Map(claims.map((claim,i)=>[claim.id,{x:20+(i%2)*360,y:20+Math.floor(i/2)*90}]));
  for(const relation of relations){
    const a=positions.get(relation.from),b=positions.get(relation.to),dx=b.x-a.x,dy=b.y-a.y;
    const boundary=Math.min(dx===0?Infinity:155/Math.abs(dx),dy===0?Infinity:30/Math.abs(dy));
    const x1=a.x+155+dx*boundary,y1=a.y+30+dy*boundary,x2=b.x+155-dx*boundary,y2=b.y+30-dy*boundary;
    svg.append(node('line',{x1,y1,x2,y2,class:'policy-scene-line','data-policy-relation':relation.evidenceClaim}));
    const angle=Math.atan2(dy,dx),endX=x2-2*Math.cos(angle),endY=y2-2*Math.sin(angle);
    svg.append(node('polygon',{points:`${endX},${endY} ${endX-9*Math.cos(angle-.5)},${endY-9*Math.sin(angle-.5)} ${endX-9*Math.cos(angle+.5)},${endY-9*Math.sin(angle+.5)}`,class:'policy-scene-dot'}));
  }
  for(const claim of claims){const {x,y}=positions.get(claim.id);svg.append(node('rect',{x,y,width:310,height:60,rx:6,class:'policy-scene-card'}));text(svg,x+10,y+23,short(L(claim.text),36));text(svg,x+10,y+44,claim.id,{class:'policy-scene-date'});}
}
function waterfall(svg,impact,snapshot){
  const inputs=impact.inputs.map(id=>snapshot.claims.find(c=>c.id===id));let cumulative=0;
  const rows=inputs.map((claim,i)=>{const start=cumulative;cumulative+=impact.formula==='difference'&&i===1?-claim.value:claim.value;return {claim,start,end:cumulative};});
  const all=[0,impact.value,...rows.flatMap(row=>[row.start,row.end])],min=Math.min(...all),max=Math.max(...all),scale=v=>250+(v-min)/(max-min||1)*380;
  rows.forEach((row,i)=>{const y=35+i*52;text(svg,18,y+5,short(L(row.claim.text),29));svg.append(node('rect',{x:Math.min(scale(row.start),scale(row.end)),y:y-12,width:Math.max(1,Math.abs(scale(row.end)-scale(row.start))),height:20,class:'policy-scene-bar','data-policy-component':row.claim.id}));text(svg,690,y+5,String(row.end-row.start),{'text-anchor':'end'});});
  const y=35+rows.length*52;svg.append(node('line',{x1:scale(0),x2:scale(0),y1:12,y2:y+18,class:'policy-scene-line'}));
  text(svg,18,y+5,L(['Scenario total','情景合计']));svg.append(node('rect',{x:Math.min(scale(0),scale(impact.value)),y:y-12,width:Math.max(1,Math.abs(scale(impact.value)-scale(0))),height:20,class:'policy-scene-bar','data-policy-total':impact.id}));text(svg,690,y+5,String(impact.value),{'text-anchor':'end'});
}
function sourcedValues(svg,impacts){
  const values=impacts.map(i=>i.value),min=Math.min(0,...values),max=Math.max(...values),scale=v=>210+(v-min)/(max-min||1)*420;
  impacts.forEach((impact,i)=>{const y=35+i*50;text(svg,15,y+5,impact.id);svg.append(node('line',{x1:210,x2:630,y1:y,y2:y,class:'policy-scene-line'}),node('circle',{cx:scale(impact.value),cy:y,r:6,class:'policy-scene-dot'}));text(svg,690,y+5,String(impact.value),{'text-anchor':'end'});});
}
function matrix(svg,claims){
  const markets=[...new Set(claims.flatMap(c=>c.markets))];markets.forEach((market,i)=>text(svg,360+i*75,24,market));
  claims.forEach((claim,i)=>{const y=60+i*45;text(svg,15,y,short(L(claim.text),39));markets.forEach((market,j)=>{if(claim.markets.includes(market))svg.append(node('circle',{cx:370+j*75,cy:y-4,r:5,class:'policy-scene-dot'}));});});
}
export function renderPolicyScene(spec,snapshot){
  const wrap=h('figure',{class:'policy-scene'});
  if(sceneProblems(spec,snapshot).length){wrap.append(h('p',{class:'policy-empty'},L(['This scene failed its evidence or safety check.','此场景未通过证据或安全检查。'])));return wrap;}
  const claims=spec.claimIds.map(id=>snapshot.claims.find(c=>c.id===id)),impacts=spec.impactIds.map(id=>snapshot.impacts.find(i=>i.id===id));
  const rows=[...claims.map(c=>({id:c.id,text:L(c.text),value:claimDate(c,snapshot),lane:c.kind})),...impacts.map(i=>({id:i.id,text:basis(i),value:i.lane==='not_quantifiable'?null:i.value,lane:i.lane}))];
  if(spec.template==='impact_waterfall')for(const id of impacts[0].inputs){const claim=snapshot.claims.find(c=>c.id===id);rows.push({id,text:L(claim.text),value:claim.value,lane:claim.kind});}
  const length=spec.template==='impact_waterfall'?impacts[0].inputs.length+1:Math.max(1,claims.length,impacts.length);
  const height=['causal','stakeholder'].includes(spec.template)?Math.max(110,Math.ceil(claims.length/2)*90):spec.template==='before_after'?110:Math.max(100,length*70+35);
  const svg=node('svg',{viewBox:`0 0 720 ${height}`,role:'img','data-policy-template':spec.template,'aria-label':L(TITLES[spec.template])});svg.append(node('title',{},L(TITLES[spec.template])));
  if(['timeline','lifecycle','status_transition','before_after'].includes(spec.template))sequence(svg,claims,snapshot,spec.template);
  else if(['causal','stakeholder'].includes(spec.template))relationships(svg,claims,spec.relations);
  else if(spec.template==='impact_waterfall')waterfall(svg,impacts[0],snapshot);
  else if(spec.template==='sourced_range')sourcedValues(svg,impacts);
  else matrix(svg,claims);
  wrap.append(svg,h('figcaption',{},L(TITLES[spec.template]),impacts.length?' · '+basis(impacts[0]):'',h('p',{},L(['Marks and relationships use the cited claims below; interpretation does not revise the approved investment view.','图形与关系对应下方引用论断；政策解释不会改写已批准的投资观点。']))),h('details',{},h('summary',{},L(['Accessible evidence table','无障碍证据表'])),h('table',{},h('thead',{},h('tr',{},...[[ 'Reference','引用'],['Evidence / basis','证据／口径'],['Date / value','日期／数值'],['Type','类别']].map(label=>h('th',{scope:'col'},L(label))))),h('tbody',{},rows.map(r=>h('tr',{},h('th',{scope:'row'},r.id),h('td',{},r.text),h('td',{},r.value===null?L(['Not yet quantifiable','尚无法量化']):String(r.value)),h('td',{},r.lane)))))));
  return wrap;
}
