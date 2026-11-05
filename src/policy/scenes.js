import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
const TEMPLATES=new Set(['timeline','lifecycle','status_transition','before_after','causal','stakeholder','sourced_range','impact_waterfall','market_matrix']);
const NS='http://www.w3.org/2000/svg';
function node(tag,attrs={},text=null){const element=document.createElementNS(NS,tag);for(const [key,value]of Object.entries(attrs))element.setAttribute(key,String(value));if(text!==null)element.textContent=String(text);return element;}
export function sceneProblems(spec,snapshot){
  if(!spec||Object.keys(spec).some(k=>!['template','claimIds','impactIds','relations'].includes(k))||!TEMPLATES.has(spec.template))return ['Unreviewed scene shape'];
  if(!Array.isArray(spec.claimIds)||!Array.isArray(spec.impactIds)||spec.claimIds.length+spec.impactIds.length>24)return ['Scene reference budget exceeded'];
  if(spec.claimIds.some(id=>!snapshot.claims.some(c=>c.id===id))||spec.impactIds.some(id=>!snapshot.impacts.some(i=>i.id===id)))return ['Scene evidence reference missing'];
  if(spec.relations!==undefined&&(!Array.isArray(spec.relations)||spec.relations.length>24||spec.relations.some(r=>Object.keys(r).some(k=>!['from','to','evidenceClaim'].includes(k))||!spec.claimIds.includes(r.from)||!spec.claimIds.includes(r.to)||!snapshot.claims.some(c=>c.id===r.evidenceClaim))))return ['Invalid sourced relation'];
  const exhibits=spec.impactIds.map(id=>snapshot.impacts.find(i=>i.id===id));
  if(exhibits.some(i=>['currency','denominator','period','technology','location','lane'].some(key=>i[key]!==exhibits[0][key])))return ['Incompatible quantitative scene basis'];
  return [];
}
export function renderPolicyScene(spec,snapshot){
  const wrap=h('figure',{class:'policy-scene'});
  if(sceneProblems(spec,snapshot).length){wrap.append(h('p',{class:'policy-empty'},L(['This scene failed its evidence or safety check.','此场景未通过证据或安全检查。'])));return wrap;}
  const claims=spec.claimIds.map(id=>snapshot.claims.find(c=>c.id===id));const impacts=spec.impactIds.map(id=>snapshot.impacts.find(i=>i.id===id));
  const rows=[...claims.map(c=>({id:c.id,text:L(c.text),value:null,lane:c.kind})),...impacts.map(i=>({id:i.id,text:`${i.currency||''} / ${i.denominator||''} · ${i.period||''}`,value:i.lane==='not_quantifiable'?null:i.value,lane:i.lane}))];
  const height=Math.max(100,rows.length*54+30);const svg=node('svg',{viewBox:`0 0 720 ${height}`,role:'img','data-policy-template':spec.template,'aria-label':L(['Policy evidence scene','政策证据场景'])});svg.append(node('title',{},L(['Evidence-linked policy scene','关联证据的政策场景'])));
  const values=rows.map(r=>r.value).filter(Number.isFinite);const scale=Math.max(1,...values.map(Math.abs));
  rows.forEach((row,index)=>{
    const y=30+index*54;svg.append(node('circle',{cx:18,cy:y,r:5,class:'policy-scene-dot'}));
    if(index<rows.length-1&&['timeline','lifecycle','status_transition','before_after'].includes(spec.template))svg.append(node('line',{x1:18,x2:18,y1:y+7,y2:y+47,class:'policy-scene-line'}));
    svg.append(node('text',{x:36,y:y+5,class:'policy-scene-label'},row.text.length>80?row.text.slice(0,77)+'…':row.text));
    if(Number.isFinite(row.value)){svg.append(node('rect',{x:36,y:y+13,width:Math.max(1,Math.abs(row.value)/scale*620),height:9,class:'policy-scene-bar'}));svg.append(node('text',{x:680,y:y+5,'text-anchor':'end'},row.value));}
  });
  for(const relation of spec.relations||[]){const from=rows.findIndex(r=>r.id===relation.from),to=rows.findIndex(r=>r.id===relation.to);svg.append(node('line',{x1:10,x2:10,y1:30+from*54,y2:30+to*54,class:'policy-scene-line'}));}
  wrap.append(svg,h('figcaption',{},L(['Each mark resolves to the same claim or typed impact used below.','每个标记均对应下方相同的论断或已分类影响。'])),h('details',{},h('summary',{},L(['Accessible evidence table','无障碍证据表'])),h('table',{},h('tbody',{},rows.map(r=>h('tr',{},h('th',{scope:'row'},r.id),h('td',{},r.text),h('td',{},r.value===null?L(['Not yet quantifiable','尚无法量化']):String(r.value)),h('td',{},r.lane)))))));
  return wrap;
}
