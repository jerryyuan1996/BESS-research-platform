/* One-time boundary refactor. Original history expressions and formatter
   constants stay verbatim; only the adapter's unused API/dependencies change. */
import fs from 'node:fs';
import {parseAst} from 'rollup/parseAst';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const path='tests/contracts/research-history-source.json',contract=JSON.parse(fs.readFileSync(path,'utf8'));
const hash=s=>createHash('sha256').update(s.replaceAll('\r\n','\n')).digest('hex');
const keys=['M','SRC','fmtN','fmt1','fmtC','fmtCk','fmtCM','fmtPct','fmtIRR','fmtX','L','state'];
function walk(n,fn,parent=null){if(!n||typeof n!=='object')return;fn(n,parent);Object.values(n).forEach(v=>Array.isArray(v)?v.forEach(x=>walk(x,fn,n)):walk(v,fn,n));}
for(const [owner,c]of Object.entries(contract.owners)){
  if(owner==='wa')continue;
  let text=fs.readFileSync(c.target,'utf8');const ast=parseAst(text),fn=ast.body.find(n=>n.type==='ExportNamedDeclaration'&&n.declaration?.id?.name==='researchHistory').declaration;
  const api=fn.body.body.find(n=>n.type==='VariableDeclaration'&&n.declarations[0].id.type==='ObjectPattern');
  const alias=fn.body.body.find(n=>n.type==='VariableDeclaration'&&n.declarations[0].id?.name==='O');
  const helper=fn.body.body.find(n=>n.type==='VariableDeclaration'&&n.declarations[0].id?.name==='kMW');
  const used=new Set();
  const collect=n=>walk(n,(n,p)=>{
    if(n.type==='Identifier'&&!(p?.type==='Property'&&p.key===n&&!p.computed)&&!(p?.type==='MemberExpression'&&p.property===n&&!p.computed))used.add(n.name);
  });
  fn.body.body.filter(n=>n!==api&&n!==alias&&n!==helper).forEach(collect);
  if(helper&&used.has('kMW'))collect(helper);
  if(used.has('O'))used.add('M');
  const edits=[];
  if(helper&&!used.has('kMW')){edits.push([helper.start,helper.end,'']);c.bindingHash=null;}
  if(api)edits.push([api.start,api.end,keys.some(k=>used.has(k))?`const {${keys.filter(k=>used.has(k)).join(',')}}=api;`:'']);
  if(alias&&!used.has('O'))edits.push([alias.start,alias.end,'']);
  edits.sort((a,b)=>b[0]-a[0]).forEach(([a,b,s])=>text=text.slice(0,a)+s+text.slice(b));fs.writeFileSync(c.target,text);
  const needsFormat=keys.some(k=>k.startsWith('fmt')&&used.has(k));
  if(!needsFormat&&c.formatBindings){
    const mktPath=c.formatBindings.original,original=execFileSync('git',['show',`${contract.sourceCommit}:${mktPath}`],{encoding:'utf8'});
    // Only undo this script's known formatter projection, never unknown edits.
    const current=fs.readFileSync(mktPath,'utf8');
    if(!current.startsWith("import {HISTORY_FORMAT} from './historyData.js';"))throw new Error('Unknown formatter source edit: '+owner);
    fs.writeFileSync(mktPath,original);
    let data=fs.readFileSync(c.dataBindings.target,'utf8'),prior;walk(parseAst(data),n=>{if(n.type==='ExportNamedDeclaration'&&n.declaration?.declarations?.[0]?.id?.name==='HISTORY_FORMAT')prior=n;});
    if(prior)fs.writeFileSync(c.dataBindings.target,data.slice(0,prior.start)+data.slice(prior.end));
    delete c.formatBindings;
  }
  if(needsFormat){
    const original=`src/markets/${owner}/mkt.js`,mkt=execFileSync('git',['show',`${contract.sourceCommit}:${original}`],{encoding:'utf8'}),mktAst=parseAst(mkt);let object;
    walk(mktAst,n=>{if(n.type==='VariableDeclarator'&&n.id?.name==='MKT')object=n.init;});
    const fields=['locale','cur'].map(key=>object.properties.find(p=>p.key.name===key));
    let changed=mkt;fields.slice().sort((a,b)=>b.start-a.start).forEach(p=>changed=changed.slice(0,p.value.start)+`HISTORY_FORMAT.${p.key.name}`+changed.slice(p.value.end));
    fs.writeFileSync(original,"import {HISTORY_FORMAT} from './historyData.js';\n"+changed);
    let data=fs.readFileSync(c.dataBindings.target,'utf8');
    let prior;walk(parseAst(data),n=>{if(n.type==='ExportNamedDeclaration'&&n.declaration?.declarations?.[0]?.id?.name==='HISTORY_FORMAT')prior=n;});
    if(prior)data=data.slice(0,prior.start)+data.slice(prior.end);
    fs.writeFileSync(c.dataBindings.target,data+`\nexport const HISTORY_FORMAT={${fields.map(p=>mkt.slice(p.start,p.end)).join(',')}};\n`);
    c.formatBindings={original,target:c.dataBindings.target,fields:fields.map(p=>({path:p.key.name,line:mkt.slice(0,p.value.start).split('\n').length,hash:hash(mkt.slice(p.value.start,p.value.end))}))};
  }
  fs.writeFileSync(`src/markets/${owner}/historyEntry.js`,
    `/* Chapter-only adapter. No dashboard, complete dataset or finance engine. */\nimport {researchHistory} from './history.js';\nimport {HISTORY_DATA as M${needsFormat?',HISTORY_FORMAT':''}} from './historyData.js';\n`+
    (used.has('SRC')?"import {SRC} from './sources.js';\n":'')+
    (needsFormat?"import {createFormat} from '../_shared/format.js';\n":'')+
    `export const readHistory=()=>({...researchHistory({M${used.has('SRC')?',SRC':''}${needsFormat?',...createFormat(HISTORY_FORMAT)':''}}),dataDate:M.dataDate||M.asOf,dataVersion:M.modelVersion});\n`);
  console.log(owner,keys.filter(k=>used.has(k)).join(','),needsFormat?'shared formatter constants':'no formatter dependency');
}
fs.writeFileSync(path,JSON.stringify(contract,null,2)+'\n');
