/* Reports actual source mappings and final command/browser evidence. No model
   fixture, ETL snapshot, approval record or budget is generated or changed. */
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
import {marketIds} from '../src/markets/registry.js';
import {PUBLIC_VERSION} from '../src/experience/story/public/catalog.js';
import {loadMarkers,scanText} from './lib/markers.mjs';
import {writeApprovalDateAudit} from './report-public-approval-dates.mjs';
// Keep this topic's evidence under its existing record. Archives remain outside
// git: the confidentiality guard deliberately refuses opaque document ZIPs.
const root=path.resolve('docs/public-market-overviews-2026-11-06/history'),evidence=path.resolve(process.env.HISTORY_EVIDENCE_DIR||'../evidence/history');
const contract=JSON.parse(await readFile('tests/contracts/research-history-source.json','utf8'));
const sourceOnly=process.argv.includes('--source-only'),markers=loadMarkers({required:true}).markers;
const readJson=async file=>JSON.parse((await readFile(file,'utf8')).replace(/^\uFEFF/,''));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
await mkdir(root,{recursive:true});
async function write(name,value){const text=typeof value==='string'?value:JSON.stringify(value,null,2);assert.equal(scanText(text,markers).length,0,'Report confidentiality: '+name);await writeFile(path.join(root,name),text.trimEnd()+'\n');}
const names={wa:'西澳 WEM',nem:'澳洲 NEM',gb:'英国',de:'德国',it:'意大利',ie:'爱尔兰',ro:'罗马尼亚',pl:'波兰',jp_tokyo:'日本东京／关东',jp_kyushu:'日本九州',jp_hokkaido:'日本北海道',pjm:'美国 PJM',ercot:'美国 ERCOT',caiso:'美国 CAISO',fi:'芬兰',ca_on:'安大略',sa:'沙特',es:'西班牙'};
const ids=marketIds(),owners={};
for(const [owner,c]of Object.entries(contract.owners)){
  const {readHistory}=await import(`../src/markets/${owner}/historyEntry.js`),history=readHistory();
  const nodes=history.cards.flatMap(card=>card.blocks.filter(b=>b.t==='timeline').flatMap(b=>b.items));
  assert.equal(nodes.length,c.nodes.length,owner+' complete nodes');
  const contexts={intro:0,why:0,sources:0,supportingSeries:0,regionalPaths:0};
  function count(b){if(b.t==='band-story')contexts.intro++;if(b.t==='why')contexts.why++;if(b.t==='src')contexts.sources++;if(['line','bar'].includes(b.t))contexts.supportingSeries++;if(b.t==='flow')contexts.regionalPaths++;(b.blocks||b.cards||[]).forEach(count);}
  history.cards.forEach(count);
  owners[owner]={...c,contexts,head:history.head,cap:history.cap||null,dataDate:history.dataDate||null,dataVersion:history.dataVersion||null,
    nodes:c.nodes.map((record,i)=>({...record,title:nodes[i].t,fields:['y','t','p','i'],locales:['en','zh'],newLocation:c.dataTimeline&&record.axis===0?(c.dataTimeline.target||c.dataTimeline.path):c.target}))};
}
assert.equal(Object.keys(owners).length,16);assert.equal(Object.values(owners).reduce((n,o)=>n+o.nodes.length,0),90);
const originalUrl=file=>`https://github.com/jerryyuan1996/BESS-research-platform/blob/${contract.sourceCommit}/${file}`;
const rows=ids.map(id=>{const owner=id.startsWith('jp_')?'jp':id,o=owners[owner];assert.ok(o,id+' source owner');return {id,name:names[id],owner,nodes:o.nodes.length,scope:['ca_on','sa','es'].includes(id)?'history-only':'full-public-story',...o.contexts};});
await write('source-mapping.json',{sourceCommit:contract.sourceCommit,publicVersion:PUBLIC_VERSION,markets:rows,owners,uniqueNodes:90,renderedNodeInstances:104});
await write('coverage.md',`# 完整研究历程迁移 · 来源覆盖\n\n公共版本 ${PUBLIC_VERSION}。18 个注册市场、16 个研究所有者、90 个独立原始节点；日本全国 7 节点在三区共享，共 104 个路由展示实例。\n\n本表是来源与迁移完整性记录，不能替代浏览器验收或公共内容签核。原事实、原资本视角、计划／预测措辞和数值单位保留；公共迁移与此前公共改写仍待确认。\n\n|市场|所有者／节点|原来源|开篇／解释／来源块／支撑序列|入口边界|\n|---|---|---|---|---|\n${rows.map(r=>`|${r.name} \`${r.id}\`|${r.owner} · ${r.nodes}|[原研究](${originalUrl(owners[r.owner].original)}#L${owners[r.owner].originalLine})|${r.intro}／${r.why}／${r.sources}／${r.supportingSeries}|${r.scope==='history-only'?'仅既有历史与来源，无新增投资逻辑或G-1':'保留原六章公共叙事及SVG'}|`).join('\n')}\n\n西澳两条轴共15节点，重复年份的不同事件未合并；另保留基准技术、ESR及储能进入前后解释。日本全国节点、三条地区路径及其尾解全部保留，当前地区独立标注，2018年事件仍为九州。未来节点不改为已观察事实。\n\n完整逐节点时期、双语标题、原行号、四字段哈希、数据／格式输入和新位置见 [机器可读映射](source-mapping.json)。原先没有逐事件引用的卡片保留原来源登记，不伪造新核验。当前注册表18市场均有现成历程，没有用新写的历史补造来源缺口。\n\n运行时读取同一套 \`researchHistory()\`、\`historyData.js\` 与时间轴渲染。\`M/O/CIS/SEED\` 仍由原表达式求值；完整数据集回读相同权威字段。未重新生成模型fixture、修改折现率、策略或投资数字。\n`);
await writeApprovalDateAudit(write,names);
if(sourceOnly){console.log('Source-only reports written; no browser or final-QA claim.');process.exit(0);}
const measured=await readJson(path.join(evidence,'performance.json'));
assert.equal(measured.version,PUBLIC_VERSION);assert.equal(measured.records.length,72,'18 markets × four emulated viewports');
for(const record of measured.records){assert.equal(record.cacheDelta,0);assert.deepEqual(record.errors,[]);assert.deepEqual(record.locales,['en','zh']);}
for(const asset of measured.assets){const bytes=await readFile('dist/assets/'+asset.name);assert.equal(bytes.length,asset.raw);assert.equal(sha(bytes),asset.sha256,'evidence must match the final compiled asset '+asset.name);}
const checks=await readJson(process.env.HISTORY_CHECKS_FILE||'../history-final-checks.json');
for(const command of ['npm test','npm run test:current','npm run build','npm run test:budget','npm run test:bundle','npm run etl:verify','npm run test:e2e'])assert.ok(checks.some(c=>c.command===command&&c.exitCode===0),command+' final result missing');
const e2e=await readJson(process.env.HISTORY_E2E_FILE||'../evidence/history-full-e2e.json');
assert.equal(e2e.stats.unexpected,0);assert.equal(e2e.stats.flaky,0);assert.ok(e2e.stats.expected>350,'complete suite, not a targeted pilot');
const baselines=await readJson('../evidence/public/performance.json'),oldMap=new Map(baselines.records.map(r=>[r.id+'/'+r.device,r]));
const round=n=>Math.round(n),kib=n=>(n/1024).toFixed(2);
await write('performance.md',`# 构建后预览性能\n\n${measured.measuredAt}，原授权 Windows 执行端，Chromium 无头仿真；桌面1440×900、iPad820×1180、横屏iPad1024×768、手机390×844。不是实体设备测试。\n\n首屏保留轻量摘要；全文仅按市场／章节请求。表中前值来自 #171 的15市场公共版实测，后值来自本次完整历程实测；没有旧公共入口或横屏基线的项以“—”表示。等待时间受同机负载影响，不能单独归因于代码。解码字节来自所有资源的 Performance API 记录（不含导航HTML）；gzip为同构建文件压缩估计，未伪装为本地HTTP实际压缩传输量。未映射到assets目录的资源也保留在 JSON 的 \`unmapped\` 和全部请求／解码字节统计中。\n\n|市场／视口|首屏ms 前→后|首开ms 前→后|首开解码KiB 前→后|首开assets gzip KiB|章节ms|缓存新增请求|\n|---|---|---|---|---|---|---|\n${measured.records.map(r=>{const old=oldMap.get(r.id+'/'+r.device);return `|${r.id}／${r.device}|${old?round(old.firstMs):'—'}→${round(r.overviewMs)}|${old?round(old.openMs):'—'}→${round(r.firstOpenMs)}|${old?kib(old.openBytes):'—'}→${kib(r.modal.decodedBytes)}|${kib(r.modal.gzip)}|${round(r.chapterMs)}|${r.cacheDelta}|`;}).join('\n')}\n\n全部72次检查均核对所有历史字段与中英文；首次打开不取其他市场的历史输入，切章与返回历史不增加任何资源请求。15市场原SVG按需加载，新增3市场仅历史，不冒充机制或SVG全套接入。完整资产SHA、请求、触控及滚动尺寸见 [实测JSON](performance.json)。预算上限未增加。所属输入与完整历史计入原市场／章节，额外检查实际完整闭包与错误跨市场依赖；“GB→engine→Japan数据”的负例必须被拒绝。\n`);
await write('performance.json',measured);
await write('validation.json',{checks,e2e:e2e.stats,sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),publicVersion:PUBLIC_VERSION});
await mkdir(path.join(root,'gallery'),{recursive:true});
const selected=[];
for(const r of measured.records){
  const picks=r.id==='gb'?r.screenshots:['nem','wa','jp_tokyo','jp_kyushu','jp_hokkaido'].includes(r.id)?r.screenshots.filter(f=>f.endsWith('-history.png')):r.device==='phone'&&['ca_on','sa','es'].includes(r.id)?r.screenshots.filter(f=>f.endsWith('-history.png')):[];
  for(const file of picks){assert.equal(path.basename(file),file);await copyFile(path.join(evidence,file),path.join(root,'gallery',file));selected.push(file);}
}
await write('gallery.md',`# 干净应用截图\n\n均来自本次扫描构建的本地preview和Chromium仿真，未使用用户原始截图。英国包含首屏、完整历史开篇、末节点和中文；NEM、西澳及日本三区包含四种视口，另附三个历史专用入口。这里链接实际提交的代表截图；全部18市场的逐项检查见性能JSON。\n\n${selected.map(file=>`- [${file}](gallery/${file})`).join('\n')}\n`);
const files=[...new Set(measured.records.flatMap(r=>r.screenshots))];files.forEach(file=>assert.equal(path.basename(file),file));
const zip=path.join(evidence,'all-market-history-screenshots.zip');
execFileSync('python',['-c',"import sys,json,zipfile,pathlib\nr=json.load(sys.stdin)\nwith zipfile.ZipFile(r['zip'],'w',zipfile.ZIP_DEFLATED) as z:\n for name in r['files']: z.write(pathlib.Path(r['root'])/name,name)\n"],{input:JSON.stringify({zip,root:evidence,files}),encoding:'utf8'});
await write('acceptance.md',`# 完整历程与日期语义 · 验收记录\n\n公共版本 ${PUBLIC_VERSION}。本次迁移18市场已有研究；软件验收不构成新的 Jerry 内容签核。\n\n- 来源完整性：16所有者、90独立节点、104路由展示实例；完整双语y/t/p/i、开篇、why、来源、支撑序列及WA／日本上下文由原表达式契约保护。\n- 跨投资人：18市场四类入口×EN/ZH×桌面／手机／纵向iPad的实际渲染；横屏iPad对18市场核对完整双语长内容。\n- 交互：长内容滚动、来源开合、触控、键盘、关闭焦点／页面位置、语言阅读锚点、重开、章节深链接、Back/Forward、日本切区、失败重试和reduced motion均在完整E2E与实测中检查。GB／WA锚点保留严格偏移回归。\n- 72条设备×市场诊断：零页面错误，缓存切章新增资源均为0，全部资源计数未过滤。\n- 15原公共市场SVG保留；ca_on/sa/es仅迁移历史，不补造投资逻辑、模型或Story批准。\n\n|最终本地命令|退出码|日志|\n|---|---|---|\n${checks.map(c=>`|\`${c.command}\`|${c.exitCode}|${c.log||'见验证JSON'}|`).join('\n')}\n\n完整Playwright：${e2e.stats.expected}通过、${e2e.stats.unexpected}失败、${e2e.stats.flaky}不稳定、${e2e.stats.skipped}跳过。原有iPad双项目重复项保持原跳过策略；不以专项代替全量。详见[验证记录](validation.json)。精确head CI、merge和正常发布结果由PR与Actions记录提供，不能将#171的检查当成本候选检查。\n\n[来源覆盖](coverage.md) · [逐节点映射](source-mapping.json) · [批准日期审计](approval-date-audit.md) · [性能对照](performance.md) · [截图目录](gallery.md)\n`);
console.log('Final history reports:',root,'screenshots',files.length,'gallery',selected.length,'ZIP bytes',(await readFile(zip)).length);
