/* Great Britain — the `data` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, T, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, durationAt, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

SEC_B.data = function (){
  const srcs = [SRC.cmreg, SRC.derate, SRC.bmrs, SRC.eac, SRC.skip, SRC.tec, SRC.fesEs1, SRC.fesEd1, SRC.etys, SRC.beyond, SRC.repd, SRC.reform, SRC.ldes, SRC.cp2030, SRC.vendor, SRC.semo];
  return {
  head: ['Data & Methodology — source registry, formulas and quality badges','数据与方法 — 数据源登记、公式与质量标识'],
  cap: ['Every figure in this dashboard carries a quality badge and a namespace. Official values come from named regulator or system-operator publications; calculated values are derived here; illustrative values are synthetic placeholders that must be replaced by live ingestion before any investment use.',
        '本看板中每个数值均带有质量标识与命名空间。官方数值来自具名的监管机构或系统运营方出版物；计算值在本看板内推导；示例数值为合成占位数据，任何投资用途前须以实时抓取数据替换。'],
  blocks: [
    { t:'card', mt:false, title:['Source hierarchy — which source may answer which question','来源层级 — 何种来源可回答何种问题'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Question','问题'],['Only acceptable source','唯一可接受来源'],['Never acceptable','不可接受']], rows:[
        [{b:['What will capacity revenue be?','容量收入将是多少？']}, ['Auction results plus the de-rating table of that specific vintage','拍卖结果加上该拍卖年份对应的折减系数表'], ['Nameplate MW, a prior vintage table, or a peer market','铭牌MW、以往年份的表格、或同业市场']],
        [{b:['What merchant revenue is achievable?','可实现的市场化收入是多少？']}, ['Third-party realised-revenue index with vendor and vintage recorded','已记录供应商与数据版本的第三方实际收入指数'], ['A perfect-foresight backtest or a modelled optimum','完全预见回测或模型最优值']],
        [{b:['When will the project energise?','项目何时送电？']}, ['Gate 2 offer plus the TO/DNO works programme','Gate 2要约加输配电运营商工程计划'], ['The historic connection date or a queue position alone','历史并网日期或仅凭队列位置']],
        [{b:['How much competition arrives?','会有多少竞争到场？']}, ['De-duplicated TEC / ECR / REPD extract, probability-weighted by gate','去重后的TEC/ECR/REPD数据，按门槛概率加权'], ['Headline announced pipeline totals','已公告管线总量']],
        [{b:['Is an LDES floor bankable?','长时储能保底是否可融资？']}, ['A final cap-and-floor award','最终的上下限机制授予'], ['A minded-to decision or a shortlist position','倾向性决定或入围名单']],
      ] },
      { t:'why', text:['Four of the five rows describe the same error: substituting an earlier, more available proxy for the definitive evidence. In GB that error has a consistent direction — every convenient proxy is more optimistic than the real thing. Nameplate exceeds de-rated MW, theoretical exceeds realised, a queue position flatters an energisation date, and announced pipeline overstates arriving competition only in the direction that makes your own project look better.',
        '五行中有四行描述的是同一错误：以更早、更易获得的替代指标取代决定性证据。在英国，这一错误方向一致 — 每一个便利的替代指标都比真实情况更乐观。铭牌高于折减后MW，理论高于实际，队列位置美化送电日期，而已公告管线对到场竞争的高估方向，恰恰使自身项目显得更优。'],
        sig:['Every convenient proxy flatters','每个便利替代指标都在美化'] },
    ] },
    { t:'card', title:['Metric-level provenance — upgraded GB series','指标级溯源 — 已升级英国序列'], badges:['official','calc'], blocks:[
      { t:'table', head:[['Metric ID','指标ID'],['Authority','权威类别'],['Unit / basis','单位/口径'],['Vintage','版本'],['Source ID','来源ID'],['Transformation','转换规则']],
        rows:M.metricRegistry.map(metric => [
          { b:[metric.id, metric.id] },
          [metric.authority, metric.authority],
          metric.unit + ' · ' + metric.valueBasis + ' · ' + metric.yearBasis,
          metric.vintage,
          metric.sourceIds.join(', '),
          metric.transformation,
        ]) },
      { t:'note', text:['Official forecasts, derived observations and analyst scenarios are separate authority classes. A chart series cannot enter this upgraded GB slice without a registered metric ID, source relationship, unit, basis, vintage and transformation.','官方预测、观察衍生与分析师情景属于不同权威类别。任何图表序列若缺少已登记的指标ID、来源关系、单位、口径、版本及转换规则，均不得进入本次英国升级范围。'] },
    ] },
    { t:'card', title:['Source registry — verified 29 July 2026','数据源登记表 — 2026年7月29日核验'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Source','来源'],['Status','状态'],['Source date','来源日期'],['Applicable period','适用期间']],
        rows: srcs.map(s => [{ b: [s.file, s.file] }, s.status, s.date, s.cy]) },
      { t:'note', text:['The third-party revenue index requires a vendor licence; record vendor identity and data vintage in the model before any transaction use, and note that the buildout-to-spread transmission model is calibrated to the same vendor curve — the two are not independent confirmation.',
        '第三方收入指数需供应商授权；任何交易用途前须在模型中记录供应商身份与数据版本，并注意投产至价差的传导模型校准于同一供应商曲线 — 两者并非相互独立的验证。'] },
    ] },
    { t:'card', title:['Core formulas','核心公式'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Quantity','指标'],['Formula','公式']], rows:[
        [{b:['Capacity revenue','容量收入']}, 'nameplate MW × de-rating factor(duration, auction vintage) × clearing price (£/kW/yr) × 1,000'],
        [{b:['Discharged energy, year 1','第1年放电电量']}, 'MW × hours × usable fraction × cycles/day × 365 × availability'],
        [{b:['Effective spread','有效价差']}, 'executable spread × duration factor × (RTE / 88) × saturation factor(COD year)'],
        [{b:['Duration-Need Index','时长需求指数']}, 'Σ (factor weight × factor score) / 3, each factor scored 0–3'],
        [{b:['DSCR','偿债覆盖率']}, 'EBITDA(year) / annuity(debt, interest rate, tenor)'],
      ] },
    ] },
    { t:'card', title:['Data-quality badge legend & seed status','数据质量标识说明与种子状态'], badges:['calc'], live:false, blocks:[
      { t:'badges', items:['official','calc','illus','forecast','dev','public','tp','peer','final','draft','model','consult','verify',
        h('span', { class:'badge seed' }, MKT.seedTag), h('span', { class:'badge etl' }, 'LIVE_ETL_REQUIRED')] },
      { t:'cap', text:['Official values, refreshed July 2026: T-4 clearing price £' + fmt1(O.t4Price) + '/kW/yr for DY ' + O.t4DY + ' with ' + fmtN(O.t4AwardedMW) + ' MW de-rated awarded · T-1 £' + fmt1(O.t1Price) + '/kW/yr for DY ' + O.t1DY + ' with ' + fmtN(O.t1AwardedMW) + ' MW · de-rating factors 0.09 (1h) to 0.94 (12h) on the T-4 ' + O.t4DY + ' vintage · CP2030 requirement 23–27 GW batteries and 4–6 GW LDES from a ' + fmt1(O.batteryBaselineGW) + ' GW battery and ~' + fmt1(O.ldesBaselineGW) + ' GW LDES baseline · ' + O.ldesWindow1Projects + ' LDES cap-and-floor Window 1 projects at minded-to · Gate 2 offers phased through March 2027. Everything else is calculated, third-party-modelled, public-source or illustrative and is labelled accordingly. Northern Ireland (SEM) is excluded throughout.',
        '官方数值，2026年7月刷新：交付年' + O.t4DY + '的T-4出清价£' + fmt1(O.t4Price) + '/kW/年，中标折减容量' + fmtN(O.t4AwardedMW) + 'MW · 交付年' + O.t1DY + '的T-1出清价£' + fmt1(O.t1Price) + '/kW/年，' + fmtN(O.t1AwardedMW) + 'MW · T-4 ' + O.t4DY + '版本折减系数由0.09（1小时）至0.94（12小时） · CP2030要求电池23–27GW、长时储能4–6GW，基线分别为电池' + fmt1(O.batteryBaselineGW) + 'GW与长时储能约' + fmt1(O.ldesBaselineGW) + 'GW · ' + O.ldesWindow1Projects + '个长时储能上下限机制第一窗口项目处于倾向性决定阶段 · Gate 2要约分阶段发出至2027年3月。其余内容均为计算、第三方模型、公开来源或示例数据并相应标注。全篇不含北爱尔兰（SEM）。'] },
      { t:'exports' },
    ] },
    { t:'card', title:['Bilingual glossary','双语术语表'], badges:['calc'], live:false, blocks:[
      { t:'glossary' },
      { t:'why', text:['Four terms carry disproportionate decision weight and are the ones most often used loosely in GB discussions: de-rating factor (a duration-dependent multiplier that is re-cut every auction vintage), de-rated MW (the only MW that is paid), realised versus theoretical revenue (the gap is worth more than the capacity payment), and skip rate (the share of economically-merited BM instructions that never arrive). Agreeing these four definitions with a counterparty before negotiating removes most of the scope for talking past each other.',
        '有四个术语在决策中的权重不成比例，且在英国的讨论中最常被宽泛使用：折减系数（随时长变化、每个拍卖年份重新下调的乘数）、折减后MW（唯一获得付费的MW）、实际收入与理论收入之别（其差额价值高于容量付费）、以及跳过率（在经济序列内却从未下达的平衡指令占比）。在谈判前与交易对手就这四项定义达成一致，可消除大部分各说各话的空间。'],
        sig:['Agree four definitions before negotiating','谈判前先统一四项定义'] },
    ] },
  ] };
};


  /* ---- Investment Case and Entry — the investment-view revision ------------
     Both read the view store and the capital-at-risk ledger by market id; the
     section says which market and nothing else. */

  return SEC_B.data;
}
