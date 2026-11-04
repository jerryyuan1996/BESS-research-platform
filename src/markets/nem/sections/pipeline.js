// ============================== PROJECT PIPELINE ==============================
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { M, SRC, fmtN, fmt1, fmtC, fmtPct, pipelineByYear } = api;
  const { O, regionById } = createShared(api);

  return function (){
    const mw = pipelineByYear('MW');
    const totRaw = mw.raw.reduce((a, b) => a + b, 0), totPw = mw.pw.reduce((a, b) => a + b, 0);
    return {
    head: ['Project Pipeline — probability-weighted, against a requirement that is already met','项目管线 — 概率加权，且对照的需求已经达成'],
    cap: ['A pipeline is a distribution, not a number. In the NEM the distinctive fact is that the announced pipeline already exceeds what the system operator says the system needs by 2030, which is why spread compression arrived before the requirement date.',
          '管线是一个分布而非一个数字。NEM的特殊之处在于：已公告管线已经超过系统运营方所称的2030年系统需求 — 这正是价差压缩早于需求时点到来的原因。'],
    blocks: [
      { t:'card', mt:false, title:['Delivered, awarded, queued and required — four different numbers','已交付、已中标、已排队与所需 — 四个不同的数字'], badges:['official'], live:true, blocks:[
        { t:'kpis', items:[
          { l:['Installed and dispatching','已投运并参与调度'], v:fmtN(O.installedMW) + '<small> MW</small>', d:['passed 9 GW in Q2 2026','2026年第二季度突破9GW'], b:['official'] },
          { l:['Began commissioning in twelve months','十二个月内开始调试'], v:fmtN(O.addedMW) + '<small> MW</small>', d:[fmtN(O.addedMWh) + ' MWh to end-Q2 2026 — more than doubling capacity','截至2026年第二季度末' + fmtN(O.addedMWh) + 'MWh — 装机增加一倍以上'], b:['official'] },
          { l:['Q2 2026 alone','仅2026年第二季度'], v:fmtN(O.q2AddedMW) + '<small> MW</small>', d:[fmtN(O.q2AddedMWh) + ' MWh in one quarter','单季度' + fmtN(O.q2AddedMWh) + 'MWh'], b:['official'] },
          { l:['Announced battery pipeline','已公告储能管线'], v:fmt1(O.pipelineGW) + '<small> GW</small>', d:[O.gridFormingPct + '% featuring grid-forming inverters','其中' + O.gridFormingPct + '%配置构网型逆变器'], b:['public'] },
          { l:['AEMO connection pipeline','AEMO并网管线'], v:fmtN(O.queueGW) + '<small> GW</small>', d:['up from ' + fmtN(O.queue2022GW) + ' GW in September 2022','由2022年9月的' + fmtN(O.queue2022GW) + 'GW增长而来'], b:['official'] },
          { l:['ISP requirement by 2030','ISP要求的2030年规模'], v:fmtN(O.ispStorage2030GW) + '<small> GW</small>', d:['and ≈' + fmtN(O.ispStorage2050GW) + ' GW by 2050 — ' + fmtN(O.ispShortMedGW) + ' GW short/medium plus ' + fmtN(O.ispLongGW) + ' GW long duration','2050年约' + fmtN(O.ispStorage2050GW) + 'GW — 其中中短时' + fmtN(O.ispShortMedGW) + 'GW，长时' + fmtN(O.ispLongGW) + 'GW'], b:['official'] },
        ] },
        { t:'flow', items:[
          ['ISP requires ' + fmtN(O.ispStorage2030GW) + ' GW by 2030','ISP要求2030年前' + fmtN(O.ispStorage2030GW) + 'GW'],
          ['Queue already holds ' + fmtN(O.queueGW) + ' GW','排队已达' + fmtN(O.queueGW) + 'GW'],
          ['Fleet passed ' + fmtN(O.installedMW / 1000) + ' GW','装机突破' + fmtN(O.installedMW / 1000) + 'GW'],
          ['Spreads fell ' + O.q2SpreadFallPct + '% year on year','价差同比下跌' + O.q2SpreadFallPct + '%'],
        ] },
        { t:'why', text:['The ' + fmtN(O.queueGW) + ' GW connection pipeline already exceeds the ' + fmtN(O.ispStorage2030GW) + ' GW the 2026 ISP requires by 2030, and that single comparison explains the entire merchant collapse without reference to weather, gas prices or policy. It also sets the forward expectation: the queue does not have to convert fully to keep spreads compressed, it only has to keep converting at the rate it has been. ' + fmtN(O.addedMW) + ' MW entering commissioning in twelve months is that rate.',
          fmtN(O.queueGW) + 'GW的并网管线已超过2026年ISP要求的2030年' + fmtN(O.ispStorage2030GW) + 'GW，仅此一项对比即可解释整个市场化收入的崩塌，无需援引天气、燃气价格或政策。它同时设定了前瞻预期：该排队量无需完全转化即可维持价差受压，只需保持既有转化速率即可。十二个月内' + fmtN(O.addedMW) + 'MW进入调试，就是这一速率。'],
          sig:['The queue already exceeds the requirement','排队量已超过需求'] },
        { t:'src', src: SRC.isp, use:['Storage requirement to 2030 and 2050, and the optimal development path','至2030年与2050年的储能需求及最优发展路径'] },
      ] },

      { t:'card', title:['Stage probabilities — the CIS award is the step that misleads','阶段概率 — CIS中标是最易误导的一步'], badges:['calc'], live:false, blocks:[
        { t:'stageProb' },
        { t:'why', text:['The probability step that matters is CIS agreement executed at ' + M.stages.find(s => s.id === 'cis').p + '% against under construction at ' + M.stages.find(s => s.id === 'con').p + '%. Only ' + O.preT3FidPct + '% of battery capacity awarded a CIS agreement before Tender 3 had reached a financial-investment decision at that time. Tender 8\'s ' + fmtN(O.t8MW) + ' MW therefore represents roughly ' + fmtN(O.t8MW * M.stages.find(s => s.id === 'cis').p / 100) + ' MW on a probability-weighted basis — real, and materially less than the headline.',
          '真正关键的概率跃迁是“已签CIS协议”的' + M.stages.find(s => s.id === 'cis').p + '%与“在建”的' + M.stages.find(s => s.id === 'con').p + '%之间的差距。第3轮之前取得CIS协议的储能容量中，当时仅有' + O.preT3FidPct + '%达到最终投资决策。因此第8轮的' + fmtN(O.t8MW) + 'MW按概率加权约相当于' + fmtN(O.t8MW * M.stages.find(s => s.id === 'cis').p / 100) + 'MW — 真实存在，但显著低于表面数字。'],
          sig:['An award is a licence to try','中标只是获得尝试的许可'] },
      ] },

      { t:'g2', cards:[
        { title:['COD pipeline by year — MW','按投运年度的管线 — MW'], badges:['illus'], live:true, blocks:[
          { t:'pipeChart', unit:'MW' },
          { t:'why', text:['Probability weighting removes ' + fmtPct((1 - totPw / totRaw) * 100, 0) + '% of announced MW across the seed register. In a market with no capacity payment, that discount matters more than elsewhere: competing MW arrives directly against your spread with nothing to cushion it, and the CIS cohort arrives with a floor you may not have.',
            '在种子登记表中，概率加权剔除了已公告MW的' + fmtPct((1 - totPw / totRaw) * 100, 0) + '%。在没有容量付费的市场中，这一折减比其他市场更重要：竞争性MW直接冲击你的价差且无任何缓冲，而CIS批次带着你可能并不具备的保底价到场。'],
            sig:['Competing MW hits the spread directly','竞争性MW直接冲击价差'] },
        ] },
        { title:['COD pipeline by year — MWh','按投运年度的管线 — MWh'], badges:['illus'], live:true, blocks:[
          { t:'pipeChart', unit:'MWh' },
          { t:'why', text:['MWh is the series that predicts spread compression, and in the NEM it is the only saturation series that matters — there is no capacity auction for MW to saturate. Track MWh entering commissioning quarterly in AEMO\'s quarterly; it is the leading indicator for the captured-spread decline from ' + fmtC(M.codCases[2028].central) + ' to ' + fmtC(M.codCases[2030].central) + '/MWh.',
            'MWh序列预测价差压缩，而在NEM它是唯一重要的饱和序列 — 因为不存在可供MW饱和的容量拍卖。应在AEMO季度报告中按季跟踪进入调试的MWh；它是捕获价差由' + fmtC(M.codCases[2028].central) + '降至' + fmtC(M.codCases[2030].central) + '/MWh的领先指标。'],
            sig:['Track MWh entering commissioning, quarterly','按季度跟踪进入调试的MWh'] },
        ] },
      ] },

      { t:'card', title:['Regional pipeline — where the competing energy lands','区域管线 — 竞争性电量落在何处'], badges:['illus'], live:true, blocks:[
        { t:'pipeChart', unit:'MWh', series:[
          { region:'NSW1', name:['NSW1','NSW1'], color:'var(--s1)' },
          { region:'QLD1', name:['QLD1','QLD1'], color:'var(--s3)' },
          { region:'VIC1', name:['VIC1','VIC1'], color:'var(--s6)' },
          { region:'SA1',  name:['SA1','SA1'],  color:'var(--s11)' },
        ] },
        { t:'note', text:['Probability-weighted MWh from the illustrative seed register, split by NEM region. Regional concentration is the point of this chart — not the absolute values, which are placeholders.',
          '来自示例种子登记表的概率加权MWh，按NEM区域拆分。本图的用意在于区域集中度，而非绝对数值 — 后者为占位数据。'] },
        { t:'why', text:['A NEM pipeline chart has to be regional because the price it competes into is regional. Queensland lost ' + fmtPct(Math.abs(regionById('QLD1').revChangePct), 0) + '% of battery revenue in one six-month window while South Australia gained ' + fmtPct(regionById('SA1').revChangePct, 0) + '%; a national MWh total would have shown neither. Read this chart against the COD year you are underwriting and against the region you are connecting in, never against the NEM aggregate.',
          'NEM的管线图必须按区域绘制，因为它所竞争的价格是区域性的。在同一个六个月窗口内，昆士兰的储能收入下降' + fmtPct(Math.abs(regionById('QLD1').revChangePct), 0) + '%，而南澳增长' + fmtPct(regionById('SA1').revChangePct, 0) + '%；全国MWh合计值两者都不会显示。应将本图对照你所承销的投运年度与你所并网的区域来解读，绝不可对照全NEM合计值。'],
          sig:['Regional prices need regional pipelines','区域电价需要区域管线'] },
      ] },

      { t:'card', title:['Project register — illustrative placeholders, not real facilities','项目登记表 — 示例占位，非真实项目'], badges:['illus'], live:true, blocks:[
        { t:'projTable' },
        { t:'note', text:['All projects shown are illustrative placeholders, tagged by NEM region so locational concentration can be checked. Replace with a register built from AEMO connection data and published CIS tender results before any transaction use, and de-duplicate — an announced project, a queued connection application and a CIS award are frequently the same asset counted three times.',
          '所示项目均为示例占位，并按NEM区域标注以便检查区位集中度。任何交易用途前，须以基于AEMO并网数据与已公布CIS招标结果构建的登记数据替换，并进行去重 — 一个已公告项目、一份排队中的并网申请与一项CIS中标，往往是同一资产被重复计算三次。'] },
      ] },
    ] };
  };
}
