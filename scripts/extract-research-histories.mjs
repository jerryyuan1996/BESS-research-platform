/* One-time source-preserving history refactor. Not an ETL or fixture writer. */
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {parseAst} from 'rollup/parseAst';
const owners=['nem','gb','de','it','ie','ro','pl','jp','pjm','ercot','caiso','fi','ca_on','sa','es'];
const split=new Set(['nem','gb','ie','ro','pl']);
const sourceCommit='247ce950c5c0db42fbe6125c7adb44eef6c8f552';
const original=path=>execFileSync('git',['show',`${sourceCommit}:${path}`],{encoding:'utf8',maxBuffer:4e6});
const prop=(n,k)=>n?.properties?.find(p=>(p.key?.name||p.key?.value)===k)?.value;
const value=(n,k)=>prop(n,k)?.value;
function walk(n,fn,parent=null){if(!n||typeof n!=='object')return;fn(n,parent);for(const [k,v]of Object.entries(n)){if(k==='parent')continue;if(Array.isArray(v))v.forEach(x=>walk(x,fn,n));else if(v&&typeof v==='object')walk(v,fn,n);}}
export function analyse(){return owners.map(owner=>{
  const file=`src/markets/${owner}/${split.has(owner)?'sections/story.js':'sections.js'}`;
  const text=original(file),ast=parseAst(text),cards=[];
  walk(ast,n=>{if(n.type==='ObjectExpression'&&value(n,'t')==='card'&&prop(n,'blocks')?.elements?.some(b=>value(b,'t')==='timeline'))cards.push(n);});
  if(owner==='jp'){let regional;walk(ast,n=>{if(n.type==='ObjectExpression'&&value(n,'t')==='card'&&prop(n,'title')?.elements?.[0]?.value?.startsWith('Regional divergence'))regional=n;});if(regional)cards.push(regional);}
  let section;walk(ast,n=>{if(n.type==='ObjectExpression'&&prop(n,'head')&&prop(n,'blocks')?.elements?.some(x=>x===cards[0]))section=n;});
  return {owner,file,text,cards,section};
});}
const rows=analyse();
if(!process.argv.includes('--write'))for(const r of rows){
  console.log(r.owner,JSON.stringify(r.cards.map(c=>({line:r.text.slice(0,c.start).split('\n').length,title:prop(c,'title')?.elements?.[0]?.value,blocks:prop(c,'blocks').elements.map(b=>value(b,'t')),ids:[...new Set((r.text.slice(c.start,c.end).match(/\b(?:M|O|SRC|fmt\w+|CIS|N|RG|state|region|comparison)\b/g)||[]))]}))));
}
if(process.argv.includes('--write')){
  const digest=s=>crypto.createHash('sha256').update(s.replaceAll('\r\n','\n')).digest('hex');
  const contract={sourceCommit:'247ce950c5c0db42fbe6125c7adb44eef6c8f552',owners:{}};
  for(const r of rows){
    if(!r.cards.length||!r.section)throw new Error(`Missing original history ${r.owner}`);
    const texts=r.cards.map(c=>r.text.slice(c.start,c.end));
    const fields=['head','cap'].filter(key=>prop(r.section,key)).map(key=>`${key}: ${r.text.slice(prop(r.section,key).start,prop(r.section,key).end)}`).join(',\n');
    const target=`src/markets/${r.owner}/history.js`;
    let bindings='';walk(parseAst(r.text),(n,parent)=>{if(n.type==='VariableDeclarator'&&n.id?.name==='kMW')bindings=r.text.slice(parent.start,parent.end);});
    fs.writeFileSync(target,`/* Authoritative full research history. Extracted verbatim from ${r.file}.\n   Original facts, interpretations, scope and live data bindings are preserved.\n   Public relocation is an editorial draft, not a new content approval. */\nexport function researchHistory(api){\n  const {M,SRC,fmtN,fmt1,fmtC,fmtCk,fmtCM,fmtPct,fmtIRR,fmtX,L,state}=api;\n  const O=M.official;\n  ${bindings}\n  return {${fields},\n  cards:[\n${texts.join(',\n')}\n  ]};\n}\n`,'utf8');
    let changed=r.text;
    const replacements=r.cards.map((c,i)=>[c.start,c.end,`researchHistory(api).cards[${i}]`]);
    for(const key of ['head','cap']){const n=prop(r.section,key);if(n)replacements.push([n.start,n.end,`researchHistory(api).${key}`]);}
    replacements.sort((a,b)=>b[0]-a[0]).forEach(([a,b,s])=>changed=changed.slice(0,a)+s+changed.slice(b));
    const prefix=split.has(r.owner)?'../':'./';
    fs.writeFileSync(r.file,`import {researchHistory} from '${prefix}history.js';\n`+changed,'utf8');
    const nodes=[];
    r.cards.forEach((card,axis)=>walk(card,n=>{if(n.type==='ObjectExpression'&&prop(n,'y')&&prop(n,'p')&&prop(n,'i'))nodes.push({axis,period:prop(n,'y').value,hash:digest(r.text.slice(n.start,n.end)),line:r.text.slice(0,n.start).split('\n').length});}));
    let dataTimeline=null;
    if(['fi','ca_on','sa','es'].includes(r.owner)){
      const path=`src/markets/${r.owner}/data.js`,source=fs.readFileSync(path,'utf8');
      walk(parseAst(source),n=>{if(n.type==='Property'&&n.key?.name==='timeline'){dataTimeline={path,hash:digest(source.slice(n.value.start,n.value.end))};n.value.elements.forEach(item=>nodes.push({axis:0,period:prop(item,'y').value,hash:digest(source.slice(item.start,item.end)),line:source.slice(0,item.start).split('\n').length}));}});
    }
    contract.owners[r.owner]={original:r.file,target,originalLine:r.text.slice(0,r.cards[0].start).split('\n').length,headHash:digest(r.text.slice(prop(r.section,'head').start,prop(r.section,'head').end)),capHash:prop(r.section,'cap')?digest(r.text.slice(prop(r.section,'cap').start,prop(r.section,'cap').end)):null,cardHashes:texts.map(digest),bindingHash:bindings?digest(bindings):null,dataTimeline,nodes};
    fs.writeFileSync(`src/markets/${r.owner}/historyEntry.js`,"/* Chapter-only adapter; the dashboard and finance engine are not imported. */\nimport {researchHistory} from './history.js';\nimport {M} from './data.js';\nimport {MKT} from './mkt.js';\nimport {SRC} from './sources.js';\nimport {createFormat} from '../_shared/format.js';\nexport const readHistory=()=>({...researchHistory({M,SRC,...createFormat(MKT)}),dataDate:M.dataDate||M.asOf,dataVersion:M.modelVersion});\n",'utf8');
  }
  {
    const file='src/markets/wa/sections/story.js',text=original(file),ast=parseAst(text),vars={},whys={},edits=[];
    const src=n=>text.slice(n.start,n.end);
    const add=(n,replacement)=>edits.push([n.start,n.end,replacement]);
    let band,heading;
    walk(ast,n=>{
      if(n.type==='VariableDeclarator'&&['events','ba','rh','rhT','rhE','tl','beforeAfter'].includes(n.id?.name))vars[n.id.name]=n.init;
      if(n.type==='CallExpression'&&n.callee?.name==='sectionHead'&&!heading)heading=n;
      if(n.type==='CallExpression'&&n.callee?.type==='MemberExpression'&&n.callee.property?.name==='append'){
        const owner=n.callee.object?.name,arg=n.arguments[0];
        if(['rh','rhT','rhE','tl','beforeAfter'].includes(owner)&&arg?.callee?.name==='why')whys[owner]=arg;
        if(owner==='rh'&&arg?.callee?.name==='h'&&src(arg).includes("class:'story-band'"))band=arg;
      }
    });
    const labels=[];walk(band,n=>{if(n.type==='CallExpression'&&n.callee?.name==='L'&&n.arguments[0]?.type==='ArrayExpression')labels.push(n.arguments[0]);});
    const title=key=>src(vars[key].arguments[0]);
    const why=key=>`{t:'why',text:${src(whys[key].arguments[0])},sig:${src(whys[key].arguments[1])}}`;
    const cards=[
      `{t:'card',title:${title('rh')},badges:['official','public'],blocks:[\n{t:'band-story',b:${src(labels[0])},text:${src(labels[1])}},\n{t:'timeline',items:RCM_HISTORY.milestones},\n${why('rh')},\n{t:'g2',cards:[\n{title:${title('rhT')},badges:['final'],blocks:[\n{t:'table',head:[['Capacity years','容量年度'],['Benchmark technology','基准技术'],['Class','类别']],rows:RCM_HISTORY.benchTech.map(r=>[r.p,r.t,r.v])},\n{t:'flow',items:[['160 MW OCGT + 14 h fuel','160MW OCGT+14小时燃料'],'200 MW / 800 MWh · 4h','200 MW / 1,200 MWh · 6h · 330 kV']},\n${why('rhT')}]},\n{title:${title('rhE')},badges:['final'],blocks:[\n{t:'table',head:[['Reserve Capacity Cycle','容量周期'],['Trading intervals','交易时段'],['Hours','小时'],['Effect','影响']],rows:RCM_HISTORY.esr.map(r=>[r.cyc,r.ti,r.h+'h',r.note])},\n{t:'line',cfg:{xs:SEED.esrYears,yfmt:v=>v+'h',series:[{name:['ESR duration requirement','ESR时长要求'],vals:SEED.esrPath}]}},\n${why('rhE')}]}]},\n{t:'src',src:SRC.rules,use:['RCM reform, ESR framework, Peak/Flexible split and the fixed-price election','RCM改革、ESR框架、峰值/灵活拆分及固定价选择权']}\n]}`,
      `{t:'card',title:${title('tl')},badges:['official'],blocks:[{t:'timeline',items:${src(vars.events)}},${why('tl')}]}`,
      `{t:'card',title:${title('beforeAfter')},badges:['calc'],blocks:[{t:'table',head:[['Dimension','维度'],['Before scaled BESS','规模化储能前'],['After scaled BESS','规模化储能后']],rows:${src(vars.ba)}},${why('beforeAfter')}]}`,
    ];
    fs.writeFileSync('src/markets/wa/history.js',`/* Authoritative WA histories: both original axes and their full context.\n   Values remain bound to the original RCM, WEM and SEED data owners. */\nimport {RCM_HISTORY} from './data/rcmHistory.js';\nimport {WEM_MARKET} from './data/wemMarket.js';\nimport {SEED} from './data/seed.js';\nimport {SRC} from './sources.js';\nexport function researchHistory({fmtN,fmtA,NF1}){\nconst CIS=WEM_MARKET.cis;\nreturn {head:${src(heading.arguments[1])},cap:${src(heading.arguments[2])},cards:[${cards.join(',\n')}]};\n}\n`,'utf8');
    add(heading.arguments[1],'fullHistory.head');add(heading.arguments[2],'fullHistory.cap');
    add(vars.events,'fullHistory.cards[1].blocks[0].items');add(vars.ba,'fullHistory.cards[2].blocks[0].rows');
    for(const [key,ref]of Object.entries({rh:'0',tl:'1',beforeAfter:'2',rhT:'0].blocks[3].cards[0',rhE:'0].blocks[3].cards[1'}))add(vars[key].arguments[0],`fullHistory.cards[${ref}].title`);
    labels.forEach((n,i)=>add(n,`fullHistory.cards[0].blocks[0].${i?'text':'b'}`));
    for(const [key,ref]of Object.entries({rh:'0].blocks[2',rhT:'0].blocks[3].cards[0].blocks[2',rhE:'0].blocks[3].cards[1].blocks[2',tl:'1].blocks[1',beforeAfter:'2].blocks[1'})){
      add(whys[key].arguments[0],`fullHistory.cards[${ref}].text`);add(whys[key].arguments[1],`fullHistory.cards[${ref}].sig`);
    }
    walk(ast,n=>{if(n.type==='CallExpression'&&n.callee?.name==='h'&&src(n).startsWith("h('div', { class: 'timeline' }")){
      const first=src(n).includes('RCM_HISTORY.milestones');
      add(n,`researchHistoryTimeline(${first?'RCM_HISTORY.milestones':'events'},{owner:'wa',axis:'${first?'rcm':'market'}'})`);
    }});
    let changed=text;edits.sort((a,b)=>b[0]-a[0]).forEach(([a,b,s])=>changed=changed.slice(0,a)+s+changed.slice(b));
    changed=changed.replace('function renderStory(main, { summaryOnly = false } = {}){','function renderStory(main, { summaryOnly = false } = {}){\n  const fullHistory=researchHistory({fmtN,fmtA,NF1});');
    fs.writeFileSync(file,"import {researchHistory} from '../history.js';\nimport {researchHistoryTimeline} from '../../../components/researchHistoryTimeline.js';\n"+changed,'utf8');
    const path='src/markets/wa/data/rcmHistory.js',data=original(path);let milestones;walk(parseAst(data),n=>{if(n.type==='Property'&&n.key?.name==='milestones')milestones=n.value;});
    const nodes=[];
    for(const [axis,n,source]of [[0,milestones,data],[1,vars.events,text]])n.elements.forEach(item=>nodes.push({axis,period:prop(item,'y').value,hash:digest(source.slice(item.start,item.end)),line:source.slice(0,item.start).split('\n').length}));
    const textPairs=[];walk(ast,n=>{if(n.start>=vars.rh.start&&n.end<=whys.beforeAfter.end&&n.type==='CallExpression'&&n.callee?.name==='L'){
      const pair=n.arguments[0];if(pair?.type==='ArrayExpression'&&pair.elements.length===2&&pair.elements.every(n=>n.type==='Literal'&&typeof n.value==='string')&&!['Capital lens: ','How the market developed'].includes(pair.elements[0].value))textPairs.push(pair.elements.map(n=>n.value));
    }});
    contract.owners.wa={original:file,target:'src/markets/wa/history.js',originalLine:51,cardHashes:[],headHash:digest(src(heading.arguments[1])),capHash:digest(src(heading.arguments[2])),textPairs,dataTimeline:{path,key:'milestones',hash:digest(data.slice(milestones.start,milestones.end))},nodes,
      contextHashes:[...labels,...Object.values(whys).flatMap(n=>n.arguments),vars.ba].map(n=>digest(src(n)))};
    fs.writeFileSync('src/markets/wa/historyEntry.js',"/* Both WA research axes, without the dashboard or financial model. */\nimport {researchHistory} from './history.js';\nimport {fmtN,fmtA,NF1} from './ui.js';\nexport const readHistory=()=>researchHistory({fmtN,fmtA,NF1});\n",'utf8');
  }
  fs.mkdirSync('tests/contracts',{recursive:true});
  fs.writeFileSync('tests/contracts/research-history-source.json',JSON.stringify(contract,null,2)+'\n');
  console.log('Extracted original history cards for',rows.length,'owners. WA is a separate imperative source refactor.');
}
