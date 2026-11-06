/** Inspect every static edge, including transitive shared dependencies. Owner
    labels are derived by Vite from source paths, not assigned by this checker. */
export function researchOwner(name){return /^research-(?:data|history|owner|entry)-(.+?)-[A-Za-z0-9_-]{8}\.js$/.exec(name)?.[1]||null;}
export function assertOwnerIsolation(root,owner,byName){
  const seen=new Set();
  function visit(chunk,path){
    if(!chunk||seen.has(chunk))return;seen.add(chunk);
    const actual=researchOwner(chunk.name);
    if(actual&&actual!==owner)throw new Error(`${owner} imports foreign owner ${actual}: ${[...path,chunk.name].join(' -> ')}`);
    for(const name of chunk.imports)visit(byName.get(name),[...path,chunk.name]);
  }
  visit(root,[]);return seen;
}
