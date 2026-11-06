/* Chapter-only data. No dashboard, section engine, lab or finance renderer. */
const readers=import.meta.glob('../../../markets/*/historyEntry.js');
const cache=new Map();
export const historyOwner=id=>id.startsWith('jp_')?'jp':id;
export async function loadResearchHistory(id){
  const owner=historyOwner(id),base='../../../markets/'+owner+'/';
  if(!readers[base+'historyEntry.js'])throw new Error('Existing research history unavailable');
  if(!cache.has(owner))cache.set(owner,readers[base+'historyEntry.js']().then(module=>module.readHistory()).catch(error=>{cache.delete(owner);throw error;}));
  return {...await cache.get(owner),owner,marketId:id};
}
