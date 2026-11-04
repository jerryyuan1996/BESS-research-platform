/* Great Britain — the `pipeline` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, T, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, durationAt, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const SEC_B = {};

SEC_B.pipeline = function (){
  const P = M.pipelineOfficial;
  const discount = (1 - P.analystWeightedForwardMW / P.forwardMW) * 100;
  return {
  head: ['Project Pipeline — official TEC evidence, analytical weighting and explicit coverage gaps','项目管线 — 官方TEC证据、分析加权与明确覆盖缺口'],
  cap: ['The official view now separates three things: the raw transmission register, an analyst-weighted delivery screen, and missing evidence. TEC supplies MW, status, Gate and effective date; it does not supply duration, financing status or an independently verified energisation date.',
        '官方视图现将三类信息分开：原始输电登记册、分析师加权交付筛选及缺失证据。TEC提供MW、状态、Gate与生效日期，但不提供时长、融资状态或经独立核实的送电日期。'],
  blocks: [
    { t:'card', mt:false, title:['Coverage first — what the register can and cannot support','覆盖优先 — 登记册能与不能支持什么'], badges:['official','calc'], blocks:[
      { t:'kpis', items:[
        { l:['Unique exact-ESS projects','纯储能唯一项目'], v:fmtN(P.uniqueProjects), d:[fmtN(P.sourceRecords) + ' total TEC records screened','已筛选TEC总记录' + fmtN(P.sourceRecords) + '条'], b:['calc'] },
        { l:['Forward nameplate capacity','前瞻铭牌容量'], v:fmt1(P.forwardMW / 1000) + '<small> GW</small>', d:['raw connection-register total — not expected delivery','原始并网登记总量 — 非预期交付量'], b:['calc'] },
        { l:['Gate 2 forward capacity','Gate 2前瞻容量'], v:fmt1(P.gate2ForwardMW / 1000) + '<small> GW</small>', d:['Gate field populated as 2','Gate字段填报为2'], b:['calc'] },
        { l:['Analyst-weighted forward capacity','分析师加权前瞻容量'], v:fmt1(P.analystWeightedForwardMW / 1000) + '<small> GW</small>', d:['screening output, not an NESO forecast','筛选输出，非NESO预测'], b:['calc'] },
        { l:['Exact-ESS built capacity in TEC','TEC纯储能已建容量'], v:fmt1(P.builtMW / 1000) + '<small> GW</small>', d:['transmission-register coverage only','仅输电登记覆盖范围'], b:['calc'] },
        { l:['Duration / MWh coverage','时长/MWh覆盖率'], v:'0<small>%</small>', d:['TEC has no duration field','TEC无时长字段'], cls:'down', b:['official'] },
      ] },
      { t:'warn', text:['The 177.2 GW headline is a queue measure, not a build forecast. It excludes hybrid Plant Type rows, DNO-only projects and REPD-only projects, while the source itself warns that capacities across stages and technologies can be aggregated or duplicated. The dashboard therefore never feeds raw TEC MW into the merchant forecast or investment score.',
        '177.2GW这一标题数字是队列指标，并非投产预测。它排除了混合技术类型行、仅DNO项目及仅REPD项目，同时来源自身警告不同阶段和技术容量可能聚合或重复。因此看板绝不将原始TEC MW直接输入市场化预测或投资评分。'] },
      { t:'src', src:SRC.tec, use:['Project status, Gate, cumulative MW and effective-date evidence; exact-ESS filtering and deterministic Project ID deduplication','项目状态、Gate、累计MW与生效日期证据；纯储能筛选及按Project ID确定性去重'] },
    ] },
    { t:'card', title:['Analyst delivery weights — explicit and separate from NESO fields','分析师交付权重 — 与NESO字段明确分离'], badges:['calc'], blocks:[
      { t:'stageProb' },
      { t:'why', text:['Applying the disclosed screening weights removes ' + fmtPct(discount, 0) + ' of raw forward MW. This does not turn a queue into a forecast: the weights are an analyst scenario, and Gate-not-populated remains its own category rather than being silently treated as Gate 1.',
        '应用已披露筛选权重后，原始前瞻MW减少' + fmtPct(discount, 0) + '。这并不会把队列变成预测：权重属于分析师情景，Gate未填报仍作为独立类别，绝不暗中视为Gate 1。'],
        sig:['Official fields, analyst weights','官方字段，分析师权重'] },
    ] },
    { t:'g2', cards:[
      { title:['Effective-year capacity — raw versus analyst-weighted','按生效年份容量 — 原始与分析加权'], badges:['official','calc'], blocks:[
        { t:'bar', cfg:{ xs:P.years.map(String), mode:'group', yfmt:v => fmt1(v / 1000) + ' GW', h:260,
          series:[
            { name:['TEC raw nameplate MW','TEC原始铭牌MW'], color:'var(--s3)', vals:P.rawMW },
            { name:['Analyst-weighted MW','分析师加权MW'], color:'var(--s1)', vals:P.analystWeightedMW },
          ] } },
        { t:'note', text:['“MW Effective From” is the contract field in the TEC Register. It is not independently verified COD and may be stale for individual projects.','“MW Effective From”是TEC登记册中的合同字段，并非经独立核实的投运日期，个别项目可能已过期。'] },
      ] },
      { title:['Gate composition — evidence quality changes sharply after 2029','Gate构成 — 2029年后证据质量显著变化'], badges:['official','calc'], blocks:[
        { t:'bar', cfg:{ xs:P.years.map(String), mode:'group', yfmt:v => fmt1(v / 1000) + ' GW', h:260,
          series:[
            { name:['Gate 2','Gate 2'], color:'var(--s2)', vals:P.gate2MW },
            { name:['Gate 1','Gate 1'], color:'var(--s6)', vals:P.gate1MW },
            { name:['Gate not populated','Gate未填报'], color:'var(--muted)', vals:P.gateUnpopulatedMW },
          ] } },
        { t:'why', text:['Every exact-ESS Gate 2 MW in this snapshot has an effective year no later than 2029. Capacity shown after that is Gate 1 or Gate-not-populated, so a late-2030s queue total cannot be read as equivalent competitive pressure.',
          '本快照中所有纯储能Gate 2容量的生效年份均不晚于2029年。此后显示的容量均为Gate 1或Gate未填报，因此2030年代后期的队列总量不能被视为等同的竞争压力。'] },
      ] },
    ] },
    { t:'card', title:['MWh competition — unavailable from TEC','MWh竞争 — TEC无法提供'], badges:['official','verify'], blocks:[
      { t:'warn', text:['No duration or MWh estimate is shown. Adding an assumed duration would convert a documented source gap into false precision. The MWh competition view remains unavailable until duration is joined from an official or project-level evidence source with a stable project match.',
        '此处不显示任何时长或MWh估算。加入假定时长会把有记录的来源缺口变成虚假精度。在通过稳定项目匹配从官方或项目级证据来源接入时长之前，MWh竞争视图保持不可用。'] },
      { t:'src', src:SRC.repd, use:['Planning-stage cross-check is registered but not yet included; REPD does not by itself close the duration gap','规划阶段交叉核对来源已登记但尚未纳入；REPD本身也无法弥补时长缺口'] },
    ] },
    { t:'card', title:['Official project evidence — selected high-evidence TEC rows','官方项目证据 — 精选高证据TEC记录'], badges:['official'], blocks:[
      { t:'projTable' },
      { t:'note', text:['The table is a display sample: all exact-ESS rows marked Under Construction/Commissioning plus the largest Gate 2 rows marked Consents Approved. Headline totals use the complete 714-project normalized population, not this sample. NESO states that project status is supplied on a best-knowledge basis and is not planning-authority verification.',
        '本表仅为展示样本：包括所有标记为在建/调试的纯储能记录，以及规模最大的Gate 2且许可获批记录。标题总量采用完整的714个标准化项目总体，而非本样本。NESO说明项目状态基于其最佳认知，并非规划主管机关核验。'] },
      { t:'src', src:SRC.tec, use:['Named project, customer, connection site, MW, effective date, status and Gate','项目名称、客户、接入点、MW、生效日期、状态与Gate'] },
    ] },
    { t:'card', title:['Contracted-revenue benchmarks — what the market will pay to take your risk','合同化收入基准 — 市场为承接你的风险愿付多少'], badges:['dev','public'], live:false, blocks:[
      { t:'table', head:[['Structure','结构'],['Reference','参考交易'],['Implied £/MW/yr','隐含£/MW/年'],['Comment','说明']], num:[2],
        rows: M.contracted.map(c => [{ b: c.s }, c.r, c.v == null ? '—' : fmtCk(c.v), c.n]) },
      { t:'cmp', items:[
        { h:['Toll vs realised 2h merchant','租赁对2小时实际市场化收入'], v: fmtPct(M.contracted[0].v / M.bmRevenueByDur[2] * 100, 0),
          s:['the market pays about four-fifths of trailing merchant revenue to take all of the risk','市场以约相当于过去市场化收入的五分之四的价格承接全部风险'] },
        { h:['Floor vs realised 2h merchant','保底对2小时实际市场化收入'], v: fmtPct(M.contracted[1].v / M.bmRevenueByDur[2] * 100, 0),
          s:['a floor costs more upside than a toll but retains it above the floor','保底让渡的上行多于租赁，但保留下限以上的收益'] },
      ] },
      { t:'why', text:['These three prices are the market’s own view of forward merchant revenue, and they sit ' + fmtPct((1 - M.contracted[0].v / M.bmRevenueByDur[2]) * 100, 0) + '–' + fmtPct((1 - M.contracted[1].v / M.bmRevenueByDur[2]) * 100, 0) + ' below trailing realised revenue. If a sponsor’s merchant base case is above the tolling level, the model is more optimistic than the counterparties who trade this risk daily. That is a legitimate position, but it should be stated as a view, sized as equity, and never used to support senior debt.',
        '这三个价格是市场自身对远期市场化收入的判断，较过去实际收入低' + fmtPct((1 - M.contracted[0].v / M.bmRevenueByDur[2]) * 100, 0) + '–' + fmtPct((1 - M.contracted[1].v / M.bmRevenueByDur[2]) * 100, 0) + '。若发起人的市场化基准情景高于租赁水平，则该模型比每天交易这一风险的交易对手更为乐观。这是一个合理立场，但应作为观点明确陈述、以股权规模承担，且绝不可据以支撑优先级债务。'],
        sig:['The toll price is the market’s forecast','租赁价格即市场的预测'] },
    ] },
  ] };
};

// ============================== GRID CONNECTION ==============================

  return SEC_B.pipeline;
}
