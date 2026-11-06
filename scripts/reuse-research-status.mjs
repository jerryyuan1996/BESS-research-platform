/* Deduplicate identical existing US research copy. No displayed text changes.
   The immutable pre-migration source supplies the equality contract. */
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {parseAst} from 'rollup/parseAst';
import {createHash} from 'node:crypto';
const path='tests/contracts/research-history-source.json',contract=JSON.parse(fs.readFileSync(path,'utf8'));
const owners=['caiso','pjm','ercot'];
const prop=(n,key)=>n.properties.find(p=>p.key.name===key).value;
function dataset(text){const ast=parseAst(text);let result;function walk(n){if(!n||typeof n!=='object')return;if(n.type==='VariableDeclarator'&&n.id?.name==='M')result=n.init;Object.values(n).forEach(v=>Array.isArray(v)?v.forEach(walk):walk(v));}walk(ast);return result;}
const literal=n=>n.type==='ArrayExpression'?n.elements.map(literal):n.type==='Literal'?n.value:(()=>{throw new Error('Expected original literal research copy');})();
const sources=owners.map(owner=>{const file=`src/markets/${owner}/data.js`,text=execFileSync('git',['show',`${contract.sourceCommit}:${file}`],{encoding:'utf8'}),object=dataset(text);return {owner,file,warn:literal(prop(object,'seedWarn')),glossary:literal(prop(object,'glossary'))};});
const prefix=sources[0].warn.map((text,lang)=>{
  let shared=text;for(const source of sources.slice(1)){while(!source.warn[lang].startsWith(shared))shared=shared.slice(0,-1);}
  const end=shared.lastIndexOf(lang?'。':'. ');return shared.slice(0,end+(lang?1:2));
});
if(prefix[0].length<150||prefix[1].length<50)throw new Error('No substantial identical status introduction');
const term=sources[0].glossary.find(row=>row[0].startsWith('§48E investment tax credit'));
if(!term||!sources.every(s=>s.glossary.some(row=>JSON.stringify(row)===JSON.stringify(term))))throw new Error('US glossary term is not identical');
fs.writeFileSync('src/markets/_shared/researchStatus.js',`/* Existing identical US research text. Regional qualifications stay local. */\nexport const SNAPSHOT_INTRO=${JSON.stringify(prefix)};\nexport const US_ITC_TERM=${JSON.stringify(term)};\n`);
for(const source of sources){
  const text=fs.readFileSync(source.file,'utf8'),object=dataset(text),warn=prop(object,'seedWarn'),glossary=prop(object,'glossary');
  if(JSON.stringify(literal(warn))!==JSON.stringify(source.warn))throw new Error('Unknown status text edit: '+source.owner);
  const target=glossary.elements.find(n=>JSON.stringify(literal(n))===JSON.stringify(term));
  const edits=[[warn.start,warn.end,'['+source.warn.map((text,i)=>`SNAPSHOT_INTRO[${i}]+${JSON.stringify(text.slice(prefix[i].length))}`).join(',')+']'],[target.start,target.end,'US_ITC_TERM']];
  let changed=text;edits.sort((a,b)=>b[0]-a[0]).forEach(([a,b,value])=>changed=changed.slice(0,a)+value+changed.slice(b));
  fs.writeFileSync(source.file,"import {SNAPSHOT_INTRO,US_ITC_TERM} from '../_shared/researchStatus.js';\n"+changed);
  const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
  contract.owners[source.owner].sharedCopyHashes={seedWarn:hash(source.warn),glossary:hash(source.glossary)};
  console.log(source.owner,'original status and glossary values unchanged');
}
fs.writeFileSync(path,JSON.stringify(contract,null,2)+'\n');
