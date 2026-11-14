import {ELECTRICITY_OVERVIEW} from './story/public/data/electricity2024.js';
import {BATTERY_CAPACITY} from './story/public/data/batteryCapacity.js';

// Each country appears once; regional investment cases keep their national context.
export function atlasCountries(marketIds){
 const selected=new Set(marketIds);
 return ELECTRICITY_OVERVIEW.countries.filter(c=>c.id!=='sa'&&c.markets.some(id=>selected.has(id)));
}
export function installedBatteries(country,unit='gw'){
 return BATTERY_CAPACITY.rows.filter(r=>r.country===country&&r.current?.kind==='observed'&&Number.isFinite(r.current[unit]));
}
export function mixEntries(series){
 return Object.entries(series?.mix||{}).filter(([,value])=>value>0).map(([key,value])=>({key,value,share:value/series.mixTotal}));
}
export {ELECTRICITY_OVERVIEW};
