/* Reports only measured public-preview artifacts and real command exit codes.
   It never modifies model fixtures, snapshots, approvals or test thresholds. */
import {readFile,writeFile,mkdir,readdir,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {PUBLIC_CATALOG,PUBLIC_MARKET_IDS,PUBLIC_VERSION} from '../src/experience/story/public/catalog.js';
import {loadPublicContent} from '../src/experience/story/public/content.js';
import {approvalRecordUrl} from '../src/experience/story/public/approvalRecords.js';
import {writeApprovalDateAudit} from './report-public-approval-dates.mjs';
import {loadMarkers,scanText} from './lib/markers.mjs';
const evidence=path.resolve(process.env.PUBLIC_EVIDENCE_ROOT||'../evidence');
const root=path.resolve('docs/public-market-overviews-2026-11-06');
const markers=loadMarkers({required:true}).markers;
const json=async file=>{try{return JSON.parse((await readFile(file,'utf8')).replace(/^\uFEFF/,''));}catch{return null;}};
const measured=await json(path.join(evidence,'public','performance.json'));
if(!measured?.records?.length)throw new Error('No actual browser measurements');
const baseline=await json(path.join(evidence,'baseline','performance.json'));
const checkData=await json(path.resolve(process.env.PUBLIC_CHECKS_FILE||'../final-checks.json'));
const checks=Array.isArray(checkData)?checkData:checkData?[checkData]:[];
const e2e=await json(path.resolve(process.env.PUBLIC_E2E_FILE||path.join(evidence,'full-e2e.json')));
const names={wa:'西澳 WEM',nem:'澳洲 NEM',gb:'英国',de:'德国',it:'意大利',ie:'爱尔兰',ro:'罗马尼亚',pl:'波兰',jp_tokyo:'日本东京／关东',jp_kyushu:'日本九州',jp_hokkaido:'日本北海道',pjm:'美国 PJM',ercot:'美国 ERCOT',caiso:'美国 CAISO',fi:'芬兰'};
const devices=['desktop','ipad','phone'];
const deviceNames={desktop:'桌面 1440×900',ipad:'iPad 820×1180',phone:'手机 390×844'};
const pilots=['nem','jp_tokyo','jp_kyushu','jp_hokkaido'];
await mkdir(path.join(root,'gallery'),{recursive:true});
async function write(name,text){
  if(scanText(text,markers).length)throw new Error('Report confidentiality check failed: '+name);
  await writeFile(path.join(root,name),text.trimEnd()+'\n');
}
const matrix=new Map();
function visit(suites,ancestors=[]){for(const suite of suites||[]){const chain=[...ancestors,suite.title||''];for(const spec of suite.specs||[]){
  if(!spec.title.includes('shared content for every investor and language'))continue;
  const id=spec.title.split(' · ')[0];
  for(const result of spec.tests||[]){const ipad=chain.some(t=>t.includes('iPad touch matrix'));if(ipad&&result.projectName==='mobile')continue;
    const device=ipad?'ipad':result.projectName==='mobile'?'phone':'desktop';
    const last=result.results?.at(-1);
    matrix.set(id+'/'+device,{status:last?.status||'not-run',attempts:result.results?.length||0});
  }
}visit(suite.suites,chain);}}
visit(e2e?.suites);
const manifest=[];
for(const file of (await readdir(path.join(evidence,'public'))).filter(f=>f.endsWith('.png'))){
  const body=await readFile(path.join(evidence,'public',file));manifest.push({file,bytes:body.length,sha256:createHash('sha256').update(body).digest('hex')});
}
for(const id of pilots)for(const device of devices)for(const mode of ['overview','cutaway']){
  const name=`${id}-${device}-${mode}.png`;
  await copyFile(path.join(evidence,'public',name),path.join(root,'gallery',name));
}
await write('artifact-manifest.json',JSON.stringify({edition:PUBLIC_VERSION,recordedAt:measured.recordedAt,scope:PUBLIC_MARKET_IDS,artifacts:manifest},null,2)+'\n');
await write('browser-measurements.json',JSON.stringify(measured,null,2)+'\n');
if(baseline)await write('baseline-measurements.json',JSON.stringify(baseline,null,2)+'\n');
if(checks)await write('local-checks.json',JSON.stringify(checks,null,2)+'\n');
const accepted=measured.records.length===45&&new Set(measured.records.map(r=>r.id+'/'+r.device)).size===45
  &&PUBLIC_MARKET_IDS.every(id=>devices.every(device=>measured.records.some(r=>r.id===id&&r.device===device)))
  &&measured.records.every(r=>r.cacheDelta.length===0&&r.errors.length===0&&r.button.y+r.button.height<=r.viewport.height&&(r.device==='desktop'||r.input==='touch'));
const matrixPass=PUBLIC_MARKET_IDS.every(id=>devices.every(device=>matrix.get(id+'/'+device)?.status==='passed'));
const approval='公共编辑待 Jerry 确认；原 G-1/G-2 范围保留';
const table=['# 逐市场验收表','','范围：15 个市场；另 3 个市场明确排除。本表区分设备证据、跨投资人／双语回归与内容确认。','',
  `公共版本：${PUBLIC_VERSION}。设备记录：${measured.records.length}/45；首屏／缓存／页面错误检查：${accepted?'通过':'未完成或失败'}。`,
  `跨投资人完整矩阵：${matrixPass?'45/45 设备市场用例通过，等于 360 个投资人×语言×市场×设备组合':'完整 E2E 仍待完成；以下以实际结果为准'}。`,'',
  '| 市场 | 桌面首屏／场景／缓存 | iPad 触控 | 手机触控 | 四类投资人 × EN/ZH × 三视口 | 内容确认 |',
  '|---|---|---|---|---|---|'];
for(const id of PUBLIC_MARKET_IDS){const rows=devices.map(device=>measured.records.find(r=>r.id===id&&r.device===device));
  const status=r=>r&&r.cacheDelta.length===0&&r.errors.length===0?'通过':'待完成';
  const flow=devices.map(device=>matrix.get(id+'/'+device)?.status||'未运行');
  table.push(`| ${names[id]} (${id}) | ${status(rows[0])} | ${status(rows[1])} (${rows[1]?.input||'未记录'}) | ${status(rows[2])} (${rows[2]?.input||'未记录'}) | ${flow.every(s=>s==='passed')?'24/24 组合通过':flow.join(' / ')} | ${approval} |`);
}
table.push('','| 本轮未纳入 | 状态 |','|---|---|','| ca_on 安大略 | 原功能保留；公共 Story 内容缺口仍在 |','| sa 沙特 | 原功能保留；公共 Story 内容缺口仍在 |','| es 西班牙 | 原功能保留；公共 Story 内容缺口仍在 |','',
  '设备验证使用 Windows 上的 Chromium：iPad／手机为指定视口与触控仿真，未宣称实体设备实测。桌面完整 E2E 的默认视口为 1440×1000，另有本表 1440×900 的独立首屏截图。',
  '','全部设备记录都验证关闭后的触发焦点、重复章节加载零资源请求及无页面错误。专项另验键盘、Back/Forward、版本／语言深链接、减少动态效果、章节／场景／弹窗加载失败与重试、日本区域切换后的最终来源清单，以及手机原生横向触控手势。',
  '','## 完整命令门禁','','| 命令 | 实际退出码 | 用时（秒） |','|---|---|---|');
for(const check of checks||[])table.push(`| ${check.command} | ${check.exitCode} | ${check.seconds.toFixed(1)} |`);
table.push('',`本地浏览器验证命令：\`${checks.find(c=>c.name==='e2e')?.command||'未运行'}\`。若命令指定 public-story 文件，则是公共版专项（包括 360 个组合），不冒称完整原功能套件；补丁精确提交的完整 CI 另有其运行记录。#171 的历史 CI 不作为后续补丁 SHA 的验证。`);
table.push('','未出现在上表的门禁仍为待运行，不能视为通过。保密检查使用真实 marker set 与 fingerprint key，最终构建检查设置 REQUIRE_OUTPUT=1／REQUIRE_MARKERS=1。原本仅在本地保密叠加层存在时才有内容的条件检查，若跳过，会在完整测试日志中单列；它不替代独立的最终构建扫描。','',
  '## 样板截图','','每组均含首屏摘要与主按钮，以及精细电站剖面。其余市场的三视口首屏／机制场景也已生成，完整 102 张 PNG 的字节数和校验和见 [产物清单](artifact-manifest.json)。完整本地产物目录为执行工作区相邻的 `evidence/public/`。','');
for(const id of pilots){table.push(`### ${names[id]}`,'');for(const device of devices)table.push(`- ${deviceNames[device]}：[首屏](gallery/${id}-${device}-overview.png) · [电站剖面](gallery/${id}-${device}-cutaway.png)`);table.push('');}
await write('acceptance.md',table.join('\n')+'\n');

const perf=['# 性能前后记录','','单位：等待时间为毫秒；原始响应体字节与 gzip 产物体积分别记录。测试对象为本地固定生产构建，外部 HTTPS 请求关闭，所有数据为本机实测。','',
  '基线点击旧研究／Story 按钮，新版点击公共摘要按钮；两者分别反映原路径与新路径的阅读就绪时间。每个记录是一轮冷浏览器上下文，结果用于工程对照，不能解释为统计显著的速度承诺。首屏完成点是对应入口可用，不是全页面网络空闲。原始响应体记录按完成阶段计数，可能包括同页后台工作；gzip 表来自构建文件。','',
  '| 市场（桌面） | 原首屏入口 | 新首屏入口 | 原首次弹窗 | 新首次公共章 | 首次机制／SVG | 缓存章节 | 缓存新增资源 |',
  '|---|---:|---:|---:|---:|---:|---:|---:|'];
for(const id of ['nem','jp_tokyo','wa']){const a=baseline?.records.find(r=>r.id===id),b=measured.records.find(r=>r.id===id&&r.device==='desktop');if(b)perf.push(`| ${names[id]} | ${Math.round(a?.firstMs||0)} | ${Math.round(b.firstMs)} | ${Math.round(a?.openMs||0)} | ${Math.round(b.openMs)} | ${Math.round(b.chapterMs)} | ${Math.round(b.cachedMs)} | ${b.cacheDelta.length} |`);}
perf.push('','| 市场／设备 | 首屏已完成响应体 B | 首次章增量 B | 首次机制阶段增量 B |','|---|---:|---:|---:|');
for(const r of measured.records)perf.push(`| ${r.id} / ${r.device} | ${r.firstBytes} | ${r.openBytes} | ${r.sceneBytes} |`);
const chunks=await json(path.join(evidence,'public','chunks.json'));
perf.push('','## 按需模块体积','','| 构建文件 | 原始 B | gzip B |','|---|---:|---:|');
for(const c of chunks||[])if(/^(public-|story-geometry-)/.test(c.file))perf.push(`| ${c.file} | ${c.raw} | ${c.gzip} |`);
perf.push('','首屏只读取轻量公共摘要。完整市场包、章节渲染器和 SVG 分别按需加载；日本全国包复用，区域投影保持独立。成功模块由浏览器模块缓存和内容 promise 缓存复用。失败的内容 promise 被移除；失败模块重试重新加载同一章节地址。',
  '','缓存断言仍要求零新增资源。早期额外请求被定位为 Chromium 在 History API 变更后查找默认 `/favicon.ico`；声明内联图标后消除了该 HTTP 查找。诊断使用多重集记录重复 URL，等待初始后台工作结束，再比较完整资源列表，未通过只统计某些文件名来规避请求。',
  '','英国旧 Story 曾因共享小模块拆分超过原 40 KiB 门禁。几何模块合并为明确成员的共享 chunk，通用 URL 写入复用路由层，恢复原门禁；没有放宽任何预算。完整体积门禁以 `npm run test:budget` 实际结果为准。',
  '','完整原始记录：[新版](browser-measurements.json) · [基线](baseline-measurements.json)。');
await write('performance.md',perf.join('\n')+'\n');

const review=['# 公共内容审阅 · '+PUBLIC_VERSION,'','15 个公共版本均为待确认。旧批准只覆盖原脚本、投资人／策略／阶段；以下内容没有新的 Jerry 签核。',''];
for(const [id,c] of Object.entries(PUBLIC_CATALOG)){const d=await loadPublicContent(id);review.push('## '+names[id]+' · '+id,'','状态：**公共解读待确认**；原脚本 G-1 签核 '+c.g1ApprovedOn+'；原内容模块版本 '+d.legacyVersion+'（版本日期不是批准日期）。','',
  'G-1 依据：['+d.approvalRecords.g1Record.path+':'+d.approvalRecords.g1Record.line+']('+approvalRecordUrl(d.approvalRecords.g1Record)+')。来源核对记录：'+(d.latestCheckedOn||'未单列日期，未由其他日期推算')+'。',
  ...d.approvalRecords.supplements.map(e=>'后续原内容补充批准：'+e.on+'；'+e.scope[1]+' [依据]('+approvalRecordUrl(e.record)+')。'),'补充批准仅适用原研究范围，不是本次公共编辑的新批准。','',
  ...['history','logic','condition'].flatMap(k=>['- '+k+' EN: '+c[k][0],'- '+k+' ZH: '+c[k][1]]),'','Mechanism EN: '+d.payment[0],'','Mechanism ZH: '+d.payment[1],'',
  '原适用范围：`'+JSON.stringify(d.legacyScope)+'`。','','原脚本：['+d.script+'](../../'+d.script+')。','');
  if(d.sourceGroups)for(const g of d.sourceGroups)review.push(g.title[1]+'：'+g.ids.join(', ')+'。','');else review.push('原始证据：'+Object.keys(d.sources).join(', ')+'。','');
}
await write('content-review.md',review.join('\n')+'\n');
await writeApprovalDateAudit(write,names);
await write('release-notes.md',[
  '# 发布说明 · 公共 Market Overview '+PUBLIC_VERSION,'',
  '将 15 个已有 G-1 脚本市场接入统一公共首屏、六章弹窗和精细 SVG；ERCOT 新增公共入口。安大略、沙特、西班牙未扩写公共判断。',
  '','公共摘要先于决策、策略与财务卡；公共正文不读取投资人定价绑定。同地区跨投资人复用同版本，EN/ZH 含义对应。日本全国背景共用，东京／关东、九州、北海道有独立区域证据、标题、场景、内部研究链接和章节 URL。',
  '','新增电站剖切和三幕场景：系统约束、电站设备、收入因果。支持触控／键盘注释、充放电方向、章节深链接、Back/Forward、焦点与滚动恢复、失败重试、减少动态效果及成功资源缓存。',
  '','原 G-2 入口和适用范围校验保留；原已发布财务数据、模型基线、来源权利限制和保密边界未更改。原脚本事实可追溯，新编辑的公共投资逻辑全部显示待确认。',
  '','日期准确性补丁：十五市场原 G-1 均逐项引用原记录；后续补充内容批准、原 G-2、模块版本／绑定基线及来源核对分别命名。后来核对不推断内容变化或新批准。见 [日期审计](approval-date-audit.md)。',
  '',`设备证据：${measured.records.length}/45 条；${manifest.length} 张截图；设备检查${accepted?'通过':'待完成'}。完整矩阵${matrixPass?'360 个组合通过':'仍以验收表的实际状态为准'}。`,
  '','本地门禁结果、完整市场表、内容待确认状态及实测性能分别见 [验收表](acceptance.md)、[内容审阅](content-review.md)、[性能记录](performance.md)。',
  '','仅通过正常 PR、精确提交 SHA 的 CI 与正常 merge 发布；不独立部署、不绕过已有流水线。最终 PR、提交和 merge SHA 由交付记录与 PR 时间线提供。',
].join('\n')+'\n');
console.log(JSON.stringify({records:measured.records.length,artifacts:manifest.length,deviceChecks:accepted,matrixPass,checks:(checks||[]).map(c=>({name:c.name,exitCode:c.exitCode}))}));
