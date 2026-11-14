import {h} from '../utils/dom.js';
import {L} from '../app/i18n.js';
import {sourceButton} from '../components/sourcePopup.js';
import {atlasCountries,installedBatteries,mixEntries,ELECTRICITY_OVERVIEW} from './marketAtlasModel.js';
import {GEN,USE} from './story/public/electricityPalette.js';
import './marketAtlas.css';

const num=v=>new Intl.NumberFormat('en-GB',{maximumFractionDigits:v<1?3:1}).format(v);
const pc=v=>(v*100).toFixed(1)+'%';
const text=value=>h('p',{},L(value));
function mix(series,palette,labels={}){
 const entries=mixEntries(series);
 return h('div',{class:'atlas-mix',role:'img','aria-label':entries.map(e=>`${L(labels[e.key]||palette[e.key].label)} ${pc(e.share)}`).join(' · ')},
  entries.map(e=>h('span',{style:`--mix:${palette[e.key].color};width:${e.share*100}%`,title:`${L(labels[e.key]||palette[e.key].label)} · ${num(e.value)} TWh · ${pc(e.share)}`})));
}
function sources(country,unit){
 const battery=installedBatteries(country.id,unit);
 return h('div',{},h('h4',{},L(country.name),' · ',country.period),text(country.scope),
  ...[['generation',GEN],['demand',USE]].map(([key,palette])=>h('section',{},h('h4',{},L(key==='generation'?['Generation','发电']:['Final use','终端用电']),' · ',num(country[key].total),' TWh'),text(country[key].basis),
   h('ul',{},mixEntries(country[key]).map(e=>h('li',{},L(country[key].sectorLabels?.[e.key]||palette[e.key].label),' · ',num(e.value),' TWh · ',pc(e.share)))))),
  text(country.calculation),h('ul',{},country.sources.map(s=>h('li',{},h('a',{href:s.url,target:'_blank',rel:'noopener noreferrer'},s.name+' · '+s.title),s.locator?text(s.locator):null))),
  ...battery.map(r=>h('section',{},h('h4',{},L(r.name),' · ',num(r.current[unit]),' ',(unit==='gw'?'GW':'GWh')),text([r.scope[0]+' · '+L(r.current.date),r.scope[1]+' · '+L(r.current.date)]),text(r.note||r.caption||['','']),h('ul',{},r.sources.map(s=>h('li',{},h('a',{href:s.url,target:'_blank',rel:'noopener noreferrer'},s.title),s.locator?text(s.locator):null))))),
  text(['Source review: '+ELECTRICITY_OVERVIEW.checkedOn,'来源核对：'+ELECTRICITY_OVERVIEW.checkedOn]));
}
export function renderMarketAtlas(rows,{selected,onSelect,unit='gw',onUnit}={}){
 const countries=atlasCountries(rows.map(r=>r.id)),active=countries.find(c=>c.markets.includes(selected))||countries[0];
 const root=h('div',{class:'market-atlas','data-unit':unit});
 const maxPower=Math.max(1,...countries.flatMap(c=>installedBatteries(c.id,unit).map(r=>r.current[unit])));
 const maxScale=Math.max(1,...countries.flatMap(c=>[c.generation.total,c.demand.total]));
 const detail=h('aside',{class:'atlas-insight','aria-live':'polite'});
 const select=country=>{
  const row=rows.find(r=>r.id===selected&&country.markets.includes(r.id))||rows.find(r=>country.markets.includes(r.id));
  selected=row.id;onSelect?.(row);
  root.querySelectorAll('[data-atlas-country]').forEach(el=>{const chosen=el.dataset.atlasCountry===country.id;el.classList.toggle('is-active',chosen);el.querySelector('.atlas-country-select')?.setAttribute('aria-pressed',String(chosen));});
  const gen=mixEntries(country.generation).sort((a,b)=>b.share-a.share)[0],use=mixEntries(country.demand).sort((a,b)=>b.share-a.share)[0];
  detail.replaceChildren(h('div',{},h('span',{class:'atlas-eyebrow'},L(['READ THE SYSTEM','读懂系统'])),h('h3',{},L(country.name)),text(country.scope)),
   h('div',{},h('strong',{},pc(gen.share)),text([GEN[gen.key].label[0]+' · largest generation source',GEN[gen.key].label[1]+' · 最大发电来源'])),
   h('div',{},h('strong',{},pc(use.share)),text([(country.demand.sectorLabels?.[use.key]||USE[use.key].label)[0]+' · largest demand sector',(country.demand.sectorLabels?.[use.key]||USE[use.key].label)[1]+' · 最大用电部门'])),
   h('div',{class:'atlas-case-links'},...rows.filter(r=>country.markets.includes(r.id)).map(r=>h('a',{class:'ix-text-link',href:'/markets/'+r.market.manifest.slug},L(r.market.manifest.shortName),' ↗'))));
 };
 const legend=(palette,kind)=>h('div',{class:'atlas-legend'},h('strong',{},L(kind)),Object.values(palette).map(p=>h('span',{},h('i',{style:`--mix:${p.color}`}),L(p.label))));
 root.append(h('div',{class:'atlas-intro'},h('div',{},h('p',{class:'atlas-eyebrow'},L([`${countries.length} COUNTRIES / ${rows.length} MARKETS`,`${countries.length} 个国家 / ${rows.length} 个市场`])),h('p',{},L(['Read across: energy mix → electricity scale → installed batteries.','横向读一行：电从哪里来、谁在用电、系统有多大、已装多少电池。']))),
  h('div',{class:'ix-segments atlas-unit',role:'group','aria-label':L(['Battery comparison unit','电池对比单位'])},[['gw','GW'],['gwh','GWh']].map(([key,label])=>h('button',{type:'button','aria-pressed':String(unit===key),onclick:()=>onUnit?.(key)},label)))),
  h('div',{class:'atlas-legends'},legend(GEN,['GENERATION','发电结构']),legend(USE,['FINAL USE','用电结构'])));
 const table=h('table',{class:'atlas-table'},h('caption',{class:'ix-sr'},L(['Country electricity and installed battery comparison','各国电力与已投运电池对比'])),
  h('thead',{},h('tr',{},[['Country / year','国家／年份'],['Generation mix · %','发电结构 · %'],['Final-use mix · %','用电结构 · %'],['Electricity · TWh','电力规模 · TWh'],['Installed batteries · '+(unit==='gw'?'GW':'GWh'),'已投运电池 · '+(unit==='gw'?'GW':'GWh')]].map(label=>h('th',{scope:'col'},L(label))))),
  h('tbody',{},countries.map(c=>{
   const storage=installedBatteries(c.id,unit),source=sourceButton(()=>sources(c,unit),['Data & scope','数据口径']);
   return h('tr',{'data-atlas-country':c.id},
    h('th',{scope:'row'},h('button',{type:'button',class:'atlas-country-select','aria-pressed':'false',onclick:()=>select(c)},L(c.name)),h('div',{class:'atlas-country-meta'},h('small',{},c.period),source)),
    h('td',{},mix(c.generation,GEN),h('small',{},L(c.generation.kind==='net'?['Net generation','净发电']:['Gross generation','毛发电']))),
    h('td',{},mix(c.demand,USE,c.demand.sectorLabels),h('small',{},L(c.id==='jp'?['Industry = manufacturing','工业项＝制造业']:['Final electricity use','终端用电']))),
    h('td',{class:'atlas-scale'},...[[c.generation.total,'supply',['Generation','发电']],[c.demand.total,'use',['Final use','终端用电']]].map(([v,key,label])=>h('div',{class:key,title:L(label)+' · '+num(v)+' TWh'},h('span',{style:`width:${v/maxScale*100}%`}),h('b',{},num(v)))),h('small',{},L(['Generation / final use','发电／终端用电']))),
    h('td',{class:'atlas-storage'},storage.length?storage.map(r=>h('div',{'data-battery-id':r.id},h('div',{class:'atlas-storage-value'},h('strong',{},r.current.approximate?'≈ ':'',num(r.current[unit])),h('small',{},L(r.current.date))),h('div',{class:'atlas-storage-track'},h('span',{style:`width:${r.current[unit]/maxPower*100}%`})),h('small',{},L(r.scope)))):h('span',{class:'atlas-missing'},'— ',L(['No verified value','暂无核验值']))));
  })));
 root.append(h('div',{class:'atlas-scroll',tabindex:0,role:'region','aria-label':L(['Country matrix. Scroll horizontally on small screens.','国家矩阵，小屏可横向滚动。'])},table),
  h('p',{class:'atlas-method'},L(['Mix bars each total 100%. Electricity bars share a linear TWh scale; battery bars share a separate '+(unit==='gw'?'GW':'GWh')+' scale. National electricity context is counted once. Battery scope and dates remain per series; Australia’s NEM and WEM are separate, and UK electricity includes Northern Ireland while GB batteries do not. A dash means unavailable, never zero.',
   '结构条均合计为 100%；电量条共用线性 TWh 尺度，电池条另用 '+(unit==='gw'?'GW':'GWh')+' 尺度。全国电力背景仅计一次；电池按各自日期及范围列示，澳洲 NEM 与 WEM 分列，英国电力含北爱而 GB 电池不含。横线表示缺少核验值，不代表零装机。'])),detail);
 if(active)select(active);return root;
}
