/* Source-preserving projection of ONLY the fields the original history reads.
   The original dataset reads these same fields back from the shared owner.
   This never evaluates/fixes numbers, generates model fixtures or runs ETL. */
import fs from 'node:fs';
import {parseAst} from 'rollup/parseAst';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const contract=JSON.parse(fs.readFileSync('tests/contracts/research-history-source.json','utf8'));
const original=path=>execFileSync('git',['show',`${contract.sourceCommit}:${path}`],{encoding:'utf8',maxBuffer:4e6});
const hash=text=>createHash('sha256').update(text.replaceAll('\r\n','\n')).digest('hex');
const prop=(n,k)=>n?.properties?.find(p=>(p.key?.name||p.key?.value)===k);
function walk(n,fn,parent=null){if(!n||typeof n!=='object')return;fn(n,parent);for(const v of Object.values(n))Array.isArray(v)?v.forEach(x=>walk(x,fn,n)):walk(v,fn,n);}
for(const [owner,record]of Object.entries(contract.owners)){
  if(owner==='wa')continue;
  const path=`src/markets/${owner}/data.js`,text=original(path),ast=parseAst(text),history=fs.readFileSync(record.target,'utf8'),historyAst=parseAst(history);
  let dataset;walk(ast,n=>{if(n.type==='VariableDeclarator'&&n.id?.name==='M')dataset=n.init;});
  if(dataset?.type!=='ObjectExpression')throw new Error(owner+' dataset not a literal owner');
  const rootKeys=new Set(['asOf','dataDate','modelVersion']),officialKeys=new Set();
  walk(historyAst,n=>{if(n.type==='MemberExpression'&&!n.computed){if(n.object?.name==='M')rootKeys.add(n.property.name);if(n.object?.name==='O')officialKeys.add(n.property.name);}});
  rootKeys.delete('official'); // the factory's O alias alone reads no fields
  const selected=[],replacements=[],origins=[];
  for(const key of rootKeys){
    const field=prop(dataset,key);if(!field)continue;
    selected.push([key,field.value]);replacements.push([field.value.start,field.value.end,`HISTORY_DATA.${key}`]);
    origins.push({path:key,line:text.slice(0,field.value.start).split('\n').length,hash:hash(text.slice(field.value.start,field.value.end))});
  }
  let official=prop(dataset,'official')?.value;
  if(official?.type==='Identifier'){
    const name=official.name;walk(ast,n=>{if(n.type==='VariableDeclarator'&&n.id?.name===name)official=n.init;});
  }
  const officialProps=[];
  for(const key of officialKeys){
    const field=prop(official,key);if(!field)throw new Error(owner+' missing official.'+key);
    officialProps.push(field);replacements.push([field.value.start,field.value.end,`HISTORY_DATA.official.${key}`]);
    origins.push({path:'official.'+key,line:text.slice(0,field.value.start).split('\n').length,hash:hash(text.slice(field.value.start,field.value.end))});
  }
  const expressions=[...selected.map(([,n])=>n),...officialProps.map(n=>n.value)];
  const refs=new Set();
  expressions.forEach(n=>walk(n,(n,p)=>{if(n.type==='Identifier'&&!(p?.type==='Property'&&p.key===n&&!p.computed)&&!(p?.type==='MemberExpression'&&p.property===n&&!p.computed))refs.add(n.name);}));
  const imports=ast.body.filter(n=>n.type==='ImportDeclaration'&&n.specifiers.some(s=>refs.has(s.local.name)));
  const locals=ast.body.filter(n=>n.type==='VariableDeclaration'&&n.declarations.some(d=>refs.has(d.id?.name)&&d.id.name!=='M'));
  if(locals.length)throw new Error(owner+' history fields require manual local dependency review: '+locals.map(n=>n.declarations.map(d=>d.id.name)));
  if(refs.has('M'))throw new Error(owner+' projected field reads M during initialisation');
  const writes=[];walk(ast,n=>{if(n.type==='AssignmentExpression'&&text.slice(n.left.start,n.left.end).startsWith('M.'))writes.push(text.slice(n.start,n.end).slice(0,100));});
  console.log(owner,JSON.stringify({fields:origins.map(o=>o.path),imports:imports.map(n=>n.source.value),writes}));
  if(!process.argv.includes('--write'))continue;
  let changed=text;replacements.sort((a,b)=>b[0]-a[0]).forEach(([a,b,value])=>changed=changed.slice(0,a)+value+changed.slice(b));
  fs.writeFileSync(path,"import {HISTORY_DATA} from './historyData.js';\n"+changed);
  const fields=selected.map(([key,n])=>key+':'+text.slice(n.start,n.end));
  if(officialKeys.size)fields.push('official:{'+officialProps.map(n=>text.slice(n.start,n.end)).join(',\n')+'}');
  const target=`src/markets/${owner}/historyData.js`;
  fs.writeFileSync(target,`/* Original research values, shared with data.js. No evaluated copy.\n   Extracted verbatim from ${contract.sourceCommit}:${path}. */\n${imports.map(n=>text.slice(n.start,n.end)).join('\n')}\nexport const HISTORY_DATA={${fields.join(',\n')}};\n`);
  const entry=`src/markets/${owner}/historyEntry.js`;
  fs.writeFileSync(entry,fs.readFileSync(entry,'utf8').replace("import {M} from './data.js';","import {HISTORY_DATA as M} from './historyData.js';"));
  record.dataBindings={original:path,target,fields:origins};
  if(record.dataTimeline)record.dataTimeline.target=target;
}
{
  const record=contract.owners.wa,seedPath='src/markets/wa/data/seed.js',wemPath='src/markets/wa/data/wemMarket.js';
  const seedText=original(seedPath),wemText=original(wemPath),seedAst=parseAst(seedText),wemAst=parseAst(wemText);
  let seed,wem;walk(seedAst,n=>{if(n.type==='VariableDeclarator'&&n.id?.name==='SEED')seed=n.init;});walk(wemAst,n=>{if(n.type==='VariableDeclarator'&&n.id?.name==='WEM_MARKET')wem=n.init;});
  const keys=['asOf','modelVersion','brcp2829','rcp2728','fleetMWh','fleetMW','fleetAvgHours','esrYears','esrPath'];
  const fields=keys.map(key=>prop(seed,key)),cis=prop(wem,'cis');
  if(fields.some(f=>!f)||!cis)throw new Error('WA source fields unavailable');
  const origins=fields.map(f=>({path:f.key.name,line:seedText.slice(0,f.start).split('\n').length,hash:hash(seedText.slice(f.start,f.end))}));
  origins.push({path:'cis',line:wemText.slice(0,cis.start).split('\n').length,hash:hash(wemText.slice(cis.start,cis.end))});
  console.log('wa',JSON.stringify({fields:origins.map(o=>o.path),imports:[],writes:[]}));
  if(process.argv.includes('--write')){
    const target='src/markets/wa/historyData.js';
    fs.writeFileSync(target,`/* Shared original WA history inputs; values and the getter body are verbatim. */\nexport const HISTORY_SEED={${fields.map(f=>seedText.slice(f.start,f.end)).join(',\n')}};\nexport const HISTORY_WEM={${wemText.slice(cis.start,cis.end)}};\n`);
    let changed=seedText;
    fields.slice().sort((a,b)=>b.start-a.start).forEach(f=>{
      const key=f.key.name;
      if(f.kind==='get')changed=changed.slice(0,f.start)+'get fleetAvgHours(){ return historicalAverage.call(this); }'+changed.slice(f.end);
      else changed=changed.slice(0,f.value.start)+`HISTORY_SEED.${key}`+changed.slice(f.value.end);
    });
    fs.writeFileSync(seedPath,"import {HISTORY_SEED} from '../historyData.js';\nconst historicalAverage=Object.getOwnPropertyDescriptor(HISTORY_SEED,'fleetAvgHours').get;\n"+changed);
    fs.writeFileSync(wemPath,"import {HISTORY_WEM} from '../historyData.js';\n"+wemText.slice(0,cis.value.start)+'HISTORY_WEM.cis'+wemText.slice(cis.value.end));
    fs.writeFileSync(record.target,fs.readFileSync(record.target,'utf8').replace("import {WEM_MARKET} from './data/wemMarket.js';","import {HISTORY_WEM as WEM_MARKET} from './historyData.js';").replace("import {SEED} from './data/seed.js';","import {HISTORY_SEED as SEED} from './historyData.js';"));
    const entry='src/markets/wa/historyEntry.js';fs.writeFileSync(entry,fs.readFileSync(entry,'utf8').replace("export const readHistory=()=>researchHistory({fmtN,fmtA,NF1});","import {HISTORY_SEED} from './historyData.js';\nexport const readHistory=()=>({...researchHistory({fmtN,fmtA,NF1}),dataDate:HISTORY_SEED.asOf,dataVersion:HISTORY_SEED.modelVersion});"));
    record.dataBindings={original:[seedPath,wemPath],target,fields:origins};
  }
}
if(process.argv.includes('--write'))fs.writeFileSync('tests/contracts/research-history-source.json',JSON.stringify(contract,null,2)+'\n');
