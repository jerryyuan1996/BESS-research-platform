import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { money, pct } from './model.js';
const countries={wa:'australia',nem:'australia',gb:'britain',de:'germany',it:'italy',ie:'ireland',
  ro:'romania',pl:'poland',jp_tokyo:'japan',jp_kyushu:'japan',jp_hokkaido:'japan',
  pjm:'usa',ercot:'usa',caiso:'usa',fi:'finland',ca_on:'canada'};
export function countryAttrs(id){
  const country=countries[id];
  return country?{'data-country':country,style:"--ix-country-map:url('/country-maps/"+country+".svg')"}:{};
}
/** The most this investor can pay for an operating asset and still meet its
 * target. Shown only where its call is to buy one; the headline return is the
 * shared new-build case. */
export function operatingPrice(project){
  const o=project?.operatingPurchase;
  if(!o)return null;
  return o.maxPricePerMW>0
    ?[`${money(o.maxPricePerMW,project.currency)}/MW for an operating asset at ${pct(o.targetReturn)}`,
      `按${pct(o.targetReturn)}目标，在运资产最高 ${money(o.maxPricePerMW,project.currency)}/MW`]
    :[`No price for an operating asset meets ${pct(o.targetReturn)}`,`在运资产无任何价格可达${pct(o.targetReturn)}目标`];
}
export function projectFacts(project){
  if(!project)return null;
  const operating=operatingPrice(project);
  return h('dl',{class:'ix-project-facts'},
    h('div',{},h('dt',{},L(['Typical project','典型项目'])),h('dd',{},project.powerMW+' MW / '+Number((project.powerMW*project.hours).toFixed(1))+' MWh')),
    h('div',{},h('dt',{},'Capex'),h('dd',{},money(project.capexPerMW,project.currency)+'/MW'),
      h('small',{},L(['Project total ','全项目 ']),money(project.capexTotal,project.currency))),
    h('div',{},h('dt',{},'RTB → COD'),h('dd',{},Number(project.rtbMonths.toFixed(1))+L([' months','个月']))),
    operating?h('div',{class:'ix-operating-price'},h('dt',{},L(['Buying operating','收购在运资产'])),
      h('dd',{},L(operating)),
      h('small',{},L(['The return shown is for building it new','所示回报为新建项目情景']))):null);
}
