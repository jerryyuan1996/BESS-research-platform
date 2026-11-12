import { geoNaturalEarth1,geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import topology from 'world-atlas/countries-110m.json';
import { L } from '../app/i18n.js';
import { h } from '../utils/dom.js';
const CENTRES={DE:[10,51],GB:[-2,54],IT:[12,42],IE:[-8,53],FI:[26,64],PL:[20,52],RO:[25,46],ES:[-4,40],SA:[45,24],'AU-NEM':[145,-28],'AU-WA':[118,-27],EU:[7,47],US:[-99,39],JP:[138,37],CA:[-105,57],NZ:[173,-41],KZ:[67,48],NL:[5,52],SE:[16,62],CD:[23,-3],MX:[-102,24],CN:[104,35],HR:[16,45],TR:[35,39]};
const NS='http://www.w3.org/2000/svg';
export function renderPolicyMap(parent,{jurisdictions,selected,onSelect}){
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 900 470');svg.setAttribute('role','group');svg.setAttribute('aria-label',L(['Policy and news coverage map; select a pin or use the region buttons below','政策与新闻覆盖地图；可选择标记或使用下方区域按钮']));
  const projection=geoNaturalEarth1().fitExtent([[12,12],[888,450]],{type:'Sphere'});const path=geoPath(projection);
  for(const country of feature(topology,topology.objects.countries).features){const shape=document.createElementNS(NS,'path');shape.setAttribute('d',path(country));shape.setAttribute('class','policy-land');svg.append(shape);}
  for(const jurisdiction of jurisdictions){
    const centre=CENTRES[jurisdiction.id];if(!centre||(!jurisdiction.count&&selected!==jurisdiction.id))continue;const [x,y]=projection(centre);const g=document.createElementNS(NS,'g');g.setAttribute('class',`policy-pin${selected===jurisdiction.id?' is-selected':''}${jurisdiction.count?' is-covered':''}`);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('data-map-jurisdiction',jurisdiction.id);g.setAttribute('aria-pressed',String(selected===jurisdiction.id));
    const label=`${L(jurisdiction.label)}: ${jurisdiction.policyCount} ${L(['policy events','条政策'])}, ${jurisdiction.newsCount} ${L(['news items','条新闻'])}`;g.setAttribute('aria-label',label);
    const title=document.createElementNS(NS,'title');title.textContent=label;g.append(title);
    const hit=document.createElementNS(NS,'circle');hit.setAttribute('cx',x);hit.setAttribute('cy',y);hit.setAttribute('r','12');hit.setAttribute('class','intelligence-map-hit');g.append(hit);
    if(jurisdiction.newsCount){const diamond=document.createElementNS(NS,'path');diamond.setAttribute('d',`M${x},${y-10}l10,10 -10,10 -10,-10Z`);diamond.setAttribute('class','intelligence-map-news');g.append(diamond);}
    if(jurisdiction.policyCount||!jurisdiction.newsCount){const dot=document.createElementNS(NS,'circle');dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('r','4');dot.setAttribute('class',jurisdiction.policyCount?'intelligence-map-policy':'intelligence-map-empty');g.append(dot);}
    g.addEventListener('click',()=>onSelect(jurisdiction.id));g.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onSelect(jurisdiction.id);}});svg.append(g);
  }
  let zoom=1;
  const zoomIn=h('button',{type:'button','aria-label':L(['Zoom in','放大地图']),onclick:()=>drawZoom(Math.min(4,zoom*2))},'+');
  const zoomOut=h('button',{type:'button','aria-label':L(['Zoom out','缩小地图']),onclick:()=>drawZoom(Math.max(1,zoom/2))},'−');
  const focus=CENTRES[selected]?projection(CENTRES[selected]):projection([15,45]);
  function drawZoom(value){zoom=value;const width=900/zoom,height=470/zoom;svg.setAttribute('viewBox',`${Math.max(0,Math.min(900-width,focus[0]-width/2))} ${Math.max(0,Math.min(470-height,focus[1]-height/2))} ${width} ${height}`);zoomIn.disabled=zoom===4;zoomOut.disabled=zoom===1;}
  parent.replaceChildren(h('div',{class:'intelligence-map-controls'},zoomIn,zoomOut,h('button',{type:'button',onclick:()=>drawZoom(1)},L(['World view','全球视图']))),svg);drawZoom(1);
}
