import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { money } from './model.js';
const countries={wa:'australia',nem:'australia',gb:'britain',de:'germany',it:'italy',ie:'ireland',
  ro:'romania',pl:'poland',jp_tokyo:'japan',jp_kyushu:'japan',jp_hokkaido:'japan',
  pjm:'usa',ercot:'usa',caiso:'usa',fi:'finland',ca_on:'canada'};
export function countryAttrs(id){
  const country=countries[id];
  return country?{'data-country':country,style:"--ix-country-map:url('/country-maps/"+country+".svg')"}:{};
}
export function projectFacts(project){
  if(!project)return null;
  return h('dl',{class:'ix-project-facts'},
    h('div',{},h('dt',{},L(['Typical project','典型项目'])),h('dd',{},project.powerMW+' MW / '+Number((project.powerMW*project.hours).toFixed(1))+' MWh')),
    h('div',{},h('dt',{},'Capex'),h('dd',{},money(project.capexPerMW,project.currency)+'/MW'),
      h('small',{},L(['Project total ','全项目 ']),money(project.capexTotal,project.currency))),
    h('div',{},h('dt',{},'RTB → COD'),h('dd',{},Number(project.rtbMonths.toFixed(1))+L([' months','个月']))));
}
