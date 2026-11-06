import path from 'node:path';
import {parseAst} from 'rollup/parseAst';

export const NEM_SECTION_HELPER_IMPORTS=new Set([
  './shared.js','../gridMapData.js','../../gridMapRegistry.js','../../congestionRegistry.js',
]);
const MAP_MODULES=new Set(['src/markets/nem/gridMapData.js','src/markets/gridMapRegistry.js','src/markets/congestionRegistry.js','src/governance/congestion.js',
  ...['wa','nem','gb','de','it','ie','ro','pl','jp','pjm','ercot','caiso','fi','ca_on','sa','es'].map(id=>'src/markets/'+id+'/congestion.js')]);
const MAP_JSON=new Set(['src/markets/nem/au-boundary.json','src/markets/nem/nem-zones.json']);

function walk(node,visit){
  if(!node||typeof node!=='object')return;
  if(node.type)visit(node);
  for(const value of Object.values(node))if(Array.isArray(value))value.forEach(child=>walk(child,visit));
  else if(value&&typeof value==='object')walk(value,visit);
}

/** Includes re-exports and nested dynamic imports: a facade cannot hide a dependency. */
export function moduleDependencies(source){
  const dependencies=[];
  walk(parseAst(source),node=>{
    if(['ImportDeclaration','ExportNamedDeclaration','ExportAllDeclaration'].includes(node.type)&&node.source)
      dependencies.push(node.source.value);
    if(node.type==='ImportExpression'){
      if(node.source.type!=='Literal'||typeof node.source.value!=='string')throw new Error('opaque dynamic import');
      dependencies.push(node.source.value);
    }
  });
  return [...new Set(dependencies)];
}

function resolve(from,spec,{jsonLeaves=new Set()}={}){
  if(!spec.startsWith('.'))throw new Error('helper imports must be relative JavaScript modules: '+spec);
  const target=path.posix.normalize(path.posix.join(path.posix.dirname(from),spec));
  if(!target.startsWith('src/')||(!target.endsWith('.js')&&!jsonLeaves.has(target)))throw new Error('helper escapes the source JavaScript graph: '+target);
  return target;
}

/** Pure, API-fed factories may be shared by two lazy readers. Every reachable
 * module is checked, including re-exports and dynamic edges, before permitting
 * that boundary. Market datasets, registers, sections and dashboard/engine code
 * remain forbidden regardless of the name of an intermediate facade. */
export async function assertApiHelperGraph(entry,readSource,{pureEntries=new Set(),metadataModules=new Set(),jsonLeaves=new Set()}={}){
  const visited=new Set();
  async function inspect(id){
    if(visited.has(id))return;
    visited.add(id);
    if(jsonLeaves.has(id)){JSON.parse(await readSource(id));return;}
    if(!pureEntries.has(id)&&!metadataModules.has(id)&&/\/(?:sections|data)\/|\/(?:[^/]*Data|data|sources|[^/]*[Rr]egistry|dashboard|engine|mkt|tabs)\.js$/.test(id))
      throw new Error('forbidden helper dependency: '+id);
    const source=await readSource(id),ast=parseAst(source);
    function declaration(node){
      if(node.type==='FunctionDeclaration')return;
      if(node.type==='VariableDeclaration'&&node.kind==='const'&&node.declarations.every(d=>
        d.id.type==='Identifier'&&['ArrowFunctionExpression','FunctionExpression'].includes(d.init?.type)))return;
      throw new Error('helper must export API-fed functions, without module data or evaluation: '+id);
    }
    for(const node of metadataModules.has(id)?[]:ast.body){
      if(node.type==='ImportDeclaration'){
        if(!node.specifiers.length)throw new Error('side-effect helper import: '+id);
      }else if(node.type==='ExportAllDeclaration'){
        // Its target is inspected below, not trusted because this file is empty.
      }else if(node.type==='ExportNamedDeclaration'){
        if(node.declaration)declaration(node.declaration);
      }else if(node.type==='ExportDefaultDeclaration')declaration(node.declaration);
      else declaration(node);
    }
    walk(ast,node=>{
      if(node.type==='MetaProperty')throw new Error('helper has an opaque bundler dependency: '+id);
      if(node.type==='Identifier'&&/^(?:require|fetch|XMLHttpRequest|WebSocket|window|document|globalThis|process|localStorage|sessionStorage|eval|Function)$/.test(node.name))
        throw new Error('helper reaches ambient runtime state: '+id+'/'+node.name);
      if((node.type==='AssignmentExpression'||node.type==='UpdateExpression')&&
        (node.left||node.argument)?.type==='MemberExpression')throw new Error('helper mutates external state: '+id);
    });
    for(const spec of moduleDependencies(source))await inspect(resolve(id,spec,{jsonLeaves}));
  }
  await inspect(entry);
  return visited;
}

export async function assertSectionHelperImports({source,moduleId,allowed,readSource}){
  for(const spec of moduleDependencies(source)){
    const entry=resolve(moduleId,spec);
    // Existing map metadata has a different role from a pure API factory. Its
    // exact existing modules/JSON may contain data, but ALL JavaScript edges
    // are still traversed; no allowed entry can conceal a dashboard/dataset.
    const map=allowed.has(spec)&&MAP_MODULES.has(entry);
    await assertApiHelperGraph(entry,readSource,{pureEntries:new Set(allowed.has(spec)&&entry.endsWith('/sections/shared.js')?[entry]:[]),
      metadataModules:map?MAP_MODULES:new Set(),jsonLeaves:map?MAP_JSON:new Set()});
  }
}
