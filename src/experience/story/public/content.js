import { PUBLIC_CATALOG, PUBLIC_VERSION } from './catalog.js';
import {SCRIPT_APPROVAL_RECORDS} from './approvalRecords.js';
import {PUBLIC_READING_CATALOG} from './historyCatalog.js';
const loaders = {
  wa:()=>import('./content/wa.js'), nem:()=>import('./content/nem.js'),
  gb:()=>import('./content/gb.js'), de:()=>import('./content/de.js'),
  it:()=>import('./content/it.js'), ie:()=>import('./content/ie.js'),
  ro:()=>import('./content/ro.js'), pl:()=>import('./content/pl.js'),
  pjm:()=>import('./content/pjm.js'), ercot:()=>import('./content/ercot.js'),
  caiso:()=>import('./content/caiso.js'), fi:()=>import('./content/fi.js'),
  jp:()=>import('./content/jp.js'),
};
const cache = new Map();
export function publicEvidenceState(g1ApprovedOn,sources){
  const dates=Object.values(sources).map(s=>s.checkedOn).filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d||''));
  const latestCheckedOn=dates.sort().at(-1)||null;
  return {latestCheckedOn,checkedAfterG1:Boolean(latestCheckedOn&&latestCheckedOn>g1ApprovedOn)};
}
/** Shared Japan module is fetched once; immutable region objects keep evidence local. */
export async function loadPublicContent(id){
  const summary=PUBLIC_READING_CATALOG[id];
  if(!summary)throw new Error('Public edition unavailable');
  if(summary.historyOnly)return {marketId:id,summary,version:PUBLIC_VERSION,extracts:{history:[],system:[],mechanism:[]},sources:{},internalReferences:{}};
  const group=id.startsWith('jp_')?'jp':id;
  if(!cache.has(group))cache.set(group,loaders[group]().then(m=>m.default).catch(e=>{cache.delete(group);throw e;}));
  const data=await cache.get(group);
  const region=data.regions?.[id];
  const national=(data.nationalSourceIds||[]).filter(key=>data.sources[key]);
  const regional=(data.regionalEvidence?.[id]||[]).filter(key=>data.sources[key]&&!national.includes(key));
  const regionalNames={jp_tokyo:['Tokyo / Kanto','东京／关东'],jp_kyushu:['Kyushu','九州'],jp_hokkaido:['Hokkaido','北海道']};
  const sourceGroups=group==='jp'?[
    {id:'national',title:['Japan · national framework','日本 · 全国制度'],ids:national},
    {id:'regional',title:regionalNames[id].map((name,i)=>(i?'当前地区 · ':'Current region · ')+name),ids:regional},
  ]:null;
  const sources=sourceGroups?Object.fromEntries([...national,...regional].map(key=>[key,data.sources[key]])):data.sources;
  return {...data,...region,marketId:id,summary:PUBLIC_CATALOG[id],version:PUBLIC_VERSION,
    sources,sourceGroups,approvalRecords:SCRIPT_APPROVAL_RECORDS[id],...publicEvidenceState(PUBLIC_CATALOG[id].g1ApprovedOn,sources),
    internalReferences:data.internalReferencesByRegion?.[id]||{},
    regionalSourceIds:data.regionalEvidence?.[id]||[],extracts:data.extracts||{history:[],system:[],mechanism:[]}};
}

export {CHAPTERS} from './chapters.js';
import {CHAPTERS} from './chapters.js';
// Locale and version ride in the existing whitelisted shot id. Market and region
// are the route itself. Legacy shot ids and all original URLs remain untouched.
export const publicPlace = (chapter,locale='en',version=PUBLIC_VERSION) => ({
  chapter,shot:`public-${locale}-${version.replace('.','-')}-${chapter}`,
});
export function readPublicPlace(place){
  const m=/^public-(en|zh)-(\d{4}-\d{2}-\d{2}-\d+)-([a-z]+)$/.exec(place?.shot||'');
  return {locale:m?.[1]||null,version:m?.[2]?.replace(/-(\d+)$/,'.$1')||null,
    chapter:CHAPTERS.some(([id])=>id===(m?.[3]||place?.chapter))?(m?.[3]||place.chapter):'history'};
}
