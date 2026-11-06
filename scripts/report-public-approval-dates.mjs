import {PUBLIC_MARKET_IDS,PUBLIC_VERSION} from '../src/experience/story/public/catalog.js';
import {loadPublicContent} from '../src/experience/story/public/content.js';
import {approvalRecordUrl,APPROVAL_RECORD_COMMIT} from '../src/experience/story/public/approvalRecords.js';

export async function writeApprovalDateAudit(write,names){
  const rows=[];
  for(const id of PUBLIC_MARKET_IDS){
    const d=await loadPublicContent(id),r=d.approvalRecords;
    rows.push({marketId:id,g1ApprovedOn:d.summary.g1ApprovedOn,g1Record:r.g1Record,g1RecordUrl:approvalRecordUrl(r.g1Record),previousUnifiedDateLabel:r.previousDisplayOn,
      originalContentModuleVersion:d.legacyVersion,originalBindingAnchorOn:d.legacyScope.on||null,supplementaryContentApprovals:r.supplements,originalScopedG2:r.originalG2,
      latestExplicitSourceCheckOn:d.latestCheckedOn,sourceIdsForLatestCheck:d.latestCheckedOn?Object.entries(d.sources).filter(([,s])=>s.checkedOn===d.latestCheckedOn).map(([key])=>key):[],
      checkedAfterG1:d.checkedAfterG1,publicEditorialStatus:d.summary.status});
  }
  await write('approval-date-audit.json',JSON.stringify({sourceSnapshot:APPROVAL_RECORD_COMMIT,edition:PUBLIC_VERSION,rows},null,2)+'\n');
  const md=['# 十五市场批准事件与来源日期核对','','逐项核对原始 G-1 记录。统一的“来源脚本复核”日期被拆分；模块版本、运行时绑定对照、G-2 放行及来源核对均不冒充 G-1 签核。新的公共编辑仍全部待确认。','',
    `核对快照：\`${APPROVAL_RECORD_COMMIT}\`（#171 已上线版本）；补丁公共版本：\`${PUBLIC_VERSION}\`。原批准记录、财务和来源事实未改。`,'',
    '| 市场 | 原统一标签（.1） | 原脚本 G-1 签核 | 原始签核记录 |','|---|---|---|---|'];
  for(const r of rows)md.push(`| ${names[r.marketId]} (${r.marketId}) | ${r.previousUnifiedDateLabel} | ${r.g1ApprovedOn} | [${r.g1Record.path.split('/').at(-1)}:${r.g1Record.line}](${r.g1RecordUrl}) |`);
  md.push('','## 其他事件分别记录','','| 市场 | 原内容模块版本（非批准） | 原绑定对照 on（非 G-1） | 明确的补充内容批准 | 原 G-2 / 入口状态 | 最近明确来源核对 |','|---|---|---|---|---|---|');
  for(const r of rows){
    const extra=r.supplementaryContentApprovals.map(e=>`${e.on}：${e.scope[1]} [记录](${approvalRecordUrl(e.record)})`).join('；')||'未另推断补充批准日期';
    const g2=r.originalScopedG2;
    const state=g2.on?`${g2.on} 原范围 G-2 签核 [记录](${approvalRecordUrl(g2.record)})`:g2.configured?`原 released 入口；未另提取 G-2 日期 [注册表](${approvalRecordUrl(g2.record)})`:'G-1 only；无原 released 入口';
    md.push(`| ${r.marketId} | ${r.originalContentModuleVersion} | ${r.originalBindingAnchorOn||'未单列'} | ${extra} | ${state} | ${r.latestExplicitSourceCheckOn||'未单列'} |`);
  }
  md.push('','- 芬兰 11 月 1 日的 fi-03 补充解释批准保留，原 G-1 为 10 月 31 日。CAISO 11 月 3 日时间修订与其 G-2 放行分别记录。',
    '- IE/RO 的 11 月 2 日、PJM 的 11 月 3 日是原内容模块/构建版本日期，不据此推断新的脚本批准。PJM 原绑定基线为 10 月 31 日，G-1 为 11 月 1 日，明确 G-2 放行为 11 月 4 日。',
    '- NEM、日本 G-1 为 11 月 5 日，明确 G-2 放行为 11 月 6 日。原范围、权利限制、开放缺口仍由原入口校验管理。',
    '- checkedOn 只记录来源的核对/读取时间。晚于 G-1 不表示正文、事实或结论变化，不表示新增批准，也不因此要求重新签核。',
    '- 无明确 checkedOn 时保留空值，不以 G-1、事件日期、模块版本或绑定基线回填。标题中的非独立日期保留原文，不自动解析成日期字段。',
    '- ERCOT 原 G-1 为 11 月 1 日，来源核对为 11 月 2 日，原 G-2 入口仍未放行。',
    '- 本表只审计这十五个原 Story 市场，不为其他市场或新的公共投资逻辑创建批准。',
    '','结构化字段与最近核对对应的 source IDs 见 [核对数据](approval-date-audit.json)。');
  await write('approval-date-audit.md',md.join('\n')+'\n');
}
