import {ELECTRICITY_OVERVIEW as DATA} from './data/electricity2024.js';

/** The researched dataset owns the national context for each allocation market. */
export const countryForMarket = id => DATA.countries.find(c=>c.markets.includes(id)) || null;
export function countryIndicators(id) {
  const c=countryForMarket(id);
  if(!c)return [];
  const result=[c.generation?{key:'generation',label:['Total generation','总发电量'],value:c.generation.total,unit:'TWh',basis:c.generation.basis}
    :{key:'grid-sent',label:['Grid-sent electricity','入网电量'],value:c.gridSent.total,unit:'TWh',basis:c.gridSent.basis},
    {key:'demand',label:c.id==='sa'?['Final electricity sales','终端售电量']:['Final electricity use','终端用电量'],value:c.demand.total,unit:'TWh',basis:c.demand.basis}];
  const mix=c.generation?.mix;
  if(mix&&(Number.isFinite(mix.wind)||Number.isFinite(mix.solar)))result.push({key:'wind-solar',label:['Wind + solar generation','风光发电占比'],
    value:((mix.wind||0)+(mix.solar||0))/c.generation.mixTotal*100,unit:'%',basis:['Share of the stated generation mix','按该发电结构合计计算']});
  if(Number.isFinite(c.demand.mix.industry))result.push({key:'industry',label:c.id==='jp'?['Manufacturing electricity share','制造业用电占比']:['Industry electricity share','工业用电占比'],
    value:c.demand.mix.industry/c.demand.mixTotal*100,unit:'%',basis:['Share of the stated sector total','按该行业用电合计计算']});
  if(result.length<4&&Number.isFinite(c.demand.mix.households))result.push({key:'households',label:['Household electricity share','居民用电占比'],
    value:c.demand.mix.households/c.demand.mixTotal*100,unit:'%',basis:['Share of the stated sector total','按该行业用电合计计算']});
  return result;
}
