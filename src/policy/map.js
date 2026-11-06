import { geoNaturalEarth1,geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import topology from 'world-atlas/countries-110m.json';
import { L } from '../app/i18n.js';
const CENTRES={DE:[10,51],GB:[-2,54],'AU-NEM':[145,-28],'AU-WA':[118,-27],EU:[18,50],US:[-99,39],JP:[138,37],CA:[-105,57],NZ:[173,-41]};
const NS='http://www.w3.org/2000/svg';
export function renderPolicyMap(parent,{jurisdictions,selected,onSelect}){
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 900 470');svg.setAttribute('role','img');svg.setAttribute('aria-label',L(['Policy coverage map; use the jurisdiction buttons below for keyboard navigation','政策覆盖地图；可使用下方辖区按钮进行键盘操作']));
  const projection=geoNaturalEarth1().fitExtent([[12,12],[888,450]],{type:'Sphere'});const path=geoPath(projection);
  for(const country of feature(topology,topology.objects.countries).features){const shape=document.createElementNS(NS,'path');shape.setAttribute('d',path(country));shape.setAttribute('class','policy-land');svg.append(shape);}
  for(const jurisdiction of jurisdictions){
    const centre=CENTRES[jurisdiction.id];if(!centre)continue;const [x,y]=projection(centre);const g=document.createElementNS(NS,'g');g.setAttribute('class',`policy-pin${selected===jurisdiction.id?' is-selected':''}${jurisdiction.count?' is-covered':''}`);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',`${L(jurisdiction.label)}: ${jurisdiction.count} ${L(['verified events','已核实事件'])}`);
    const dot=document.createElementNS(NS,'circle');dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('r',selected===jurisdiction.id?9:6);g.append(dot);
    g.addEventListener('click',()=>onSelect(jurisdiction.id));g.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onSelect(jurisdiction.id);}});svg.append(g);
  }
  parent.replaceChildren(svg);
}
