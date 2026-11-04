/* Ireland — the `pipeline` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { gridMapById } from '../../gridMapRegistry.js';
import { ieOfficialPlanningBlocks, ieQueueCoverageBlock } from '../officialPlanningSection.js';
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

SEC_B.pipeline = function (){
  const mw = pipelineByYear('MW');
  const totRaw = mw.raw.reduce((a, b) => a + b, 0), totPw = mw.pw.reduce((a, b) => a + b, 0);
  return {
  head: ['Project Pipeline — probability-weighted, with MW and MWh separated','项目管线 — 概率加权，MW与MWh分列'],
  cap: ['A pipeline is a distribution, not a number. In Ireland the gate that matters is the executed connection agreement, and the nominal ' + fmt1(O.pipelineMW / 1000) + ' GW pipeline sits mostly below it.',
        '管线是一个分布而非一个数字。在爱尔兰，关键门槛是已签并网协议，而名义上' + fmt1(O.pipelineMW / 1000) + 'GW的管线大部分尚未跨过该门槛。'],
  blocks: [
    { t:'card', mt:false, title:['Pipeline scale — the ratio that matters','管线规模 — 关键比率'], badges:['illus'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['Operating fleet','在运机组'], v:fmt1(O.fleetMW / 1000) + '<small> GW</small>', d:['mostly 0.5–2h','以0.5–2小时为主'], b:['illus'] },
        { l:['Nominal pipeline','名义管线'], v:fmt1(O.pipelineMW / 1000) + '<small> GW</small>', d:[fmt1(O.pipelineMWh / 1000) + ' GWh across ~' + O.pipelineProjects + ' projects','约' + O.pipelineProjects + '个项目，' + fmt1(O.pipelineMWh / 1000) + 'GWh'], b:['illus'] },
        { l:['Pipeline / operating multiple','管线对在运倍数'], v:fmt1(O.pipelineMW / O.fleetMW) + '<small>×</small>', d:['saturation pressure is a ratio, not a level','饱和压力是比率而非水平量'], b:['calc'] },
        { l:['Average pipeline duration','管线平均时长'], v:fmt1(O.pipelineMWh / O.pipelineMW) + '<small> h</small>', d:['versus a much shorter operating fleet','对比时长短得多的在运机组'], b:['calc'] },
      ] },
      { t:'why', text:['A ' + fmt1(O.pipelineMW / O.fleetMW) + '× pipeline-to-operating ratio would be alarming if the pipeline could actually connect. It largely cannot — connection capacity, not capital or planning, is the binding constraint. That is why the correct Irish analysis discounts by connection stage rather than by construction readiness, and why the same nominal GW figure means something entirely different here than it would in a market with an open queue.',
        '若该管线真能全部并网，' + fmt1(O.pipelineMW / O.fleetMW) + '倍的管线对在运比率将令人警惕。但它在很大程度上无法实现 — 约束条件是并网容量，而非资本或规划许可。这正是爱尔兰的正确分析应按并网阶段而非建设准备度折减的原因，也是同样的名义GW数字在此地与在开放排队市场中含义完全不同的原因。'],
        sig:['Connection capacity is the real filter','并网容量才是真正的筛选器'] },
    ] },
    { t:'card', title:['Stage probabilities — the gate is the discount','阶段概率 — 门槛即折减'], badges:['calc'], live:false, blocks:[
      { t:'stageProb' },
      { t:'why', text:['The probability step that matters is connection offer (55%) to executed connection agreement plus planning consent (70%). Below the executed agreement, a project is a connection application rather than a project. Probability-weight by the gate actually cleared, and never treat an ECP batch position or a high-level technical assessment as evidence of delivery.',
        '真正关键的概率跃迁是由已获并网报价（55%）到已签并网协议加规划许可（70%）。在取得已签协议之前，项目只是一份并网申请而非项目。应按实际通过的门槛进行概率加权，且绝不可将ECP批次位置或高层技术评估视为交付证据。'],
        sig:['Below executed agreement, it is an application','未签协议前，它只是一份申请'] },
    ] },
    { t:'g2', cards:[
      { title:['COD pipeline by year — MW','按投运年度的管线 — MW'], badges:['illus'], live:true, blocks:[
        { t:'pipeChart', unit:'MW' },
        { t:'why', text:['Probability weighting removes ' + fmtPct((1 - totPw / totRaw) * 100, 0) + '% of announced MW across the seed register. That discount is the whole analytical content of a pipeline view — an unweighted pipeline systematically overstates future competition and therefore understates future revenue.',
          '在种子登记表中，概率加权剔除了已公告MW的' + fmtPct((1 - totPw / totRaw) * 100, 0) + '%。这一折减正是管线分析的全部价值 — 未加权的管线会系统性高估未来竞争、进而低估未来收入。'],
          sig:['Unweighted pipelines mislead twice','未加权管线会两次误导'] },
      ] },
      { title:['COD pipeline by year — MWh','按投运年度的管线 — MWh'], badges:['illus'], live:true, blocks:[
        { t:'pipeChart', unit:'MWh' },
        { t:'why', text:['MWh predicts spread compression; MW predicts capacity-auction competition and system-services saturation. In Ireland they diverge sharply because the operating fleet is short and the pipeline is long — so the capacity auction gets more competitive faster than the spread narrows.',
          'MWh预测价差压缩；MW预测容量拍卖竞争与系统服务饱和。在爱尔兰两者显著分化，因为在运机组时长短而管线时长长 — 因此容量拍卖竞争加剧的速度快于价差收窄的速度。'],
          sig:['Capacity competition tightens first','容量竞争率先加剧'] },
      ] },
    ] },
    { t:'card', title:['Project register — illustrative placeholders, not real facilities','项目登记表 — 示例占位，非真实项目'], badges:['illus'], live:true, blocks:[
      { t:'projTable' },
      { t:'note', text:['All projects shown are illustrative placeholders, tagged by jurisdiction so ROI and NI concentration can be checked separately. Replace with a de-duplicated register of connection applications, offers and executed agreements before any transaction use; ROI and NI run different connection processes under different regulators.',
        '所示项目均为示例占位，并按辖区标注，以便分别检查爱尔兰共和国与北爱尔兰的集中度。任何交易用途前，须以去重后的并网申请、报价与已签协议登记数据替换；两地在不同监管方下运行不同的并网流程。'] },
    ] },
  ] };
};

// The public project sources do not resolve into one complete all-island
// delivery funnel. Keep the seed register out of decision outputs until a
// governed, de-duplicated official register is available.
SEC_B.pipeline = function (){
  return {
    head:['Project Pipeline — official coverage gap', '项目管线 — 官方覆盖缺口'],
    cap:['Official aggregate connection, auction and adequacy evidence remains usable within its stated scope. Complete project-level MW, MWh, delivery stage and probability-weighted COD are N/A.', '官方汇总并网、拍卖及充足性证据可在其明确范围内使用。完整的项目级MW、MWh、交付阶段及概率加权投运日期均为N/A。'],
    blocks:[
      ieQueueCoverageBlock(),
      /* The one market on this platform whose built fleet is carried on
         OpenStreetMap. EirGrid's own connected and contracted lists are PDFs
         with no storage flag and no coordinates; OSM coverage was measured at
         1,039 MW against the roughly 1 GW ESB Networks reports as available, so
         it is the better source here despite being a volunteer one. It closes
         the operating half of the gap above and none of the pipeline half —
         OSM records no commissioning date. */
      { t:'card', title:['Operating and under-construction fleet — OpenStreetMap','在运及在建机组 — OpenStreetMap'],
        badges:['illus'], blocks:[
          { t:'project-pipeline',
            projects:gridMapById('ie-grid-map').projects,
            licence:gridMapById('ie-grid-map').storageLicence,
            sourceNote:[
              'OpenStreetMap, clipped to the island of Ireland and measured on 2026-08-09 at 1,039 MW against the roughly 1 GW ESB Networks reports as available. Volunteer-maintained, so completeness is a measurement rather than a guarantee, and no commissioning dates are published — the COD column is empty by source, not by omission.',
              '取自OpenStreetMap，按爱尔兰岛边界裁剪，2026年8月9日实测1,039MW，而ESB Networks报告电网可用储能约1GW。该数据由志愿者维护，其完整性系实测结果而非保证；且不含投运日期 — COD列为空系数据源所致，而非遗漏。',
            ] },
        ] },
    ],
  };
};

// ============================== GRID & CONNECTION ==============================

  return SEC_B.pipeline;
}
