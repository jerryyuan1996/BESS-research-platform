/* Ireland — the `story` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { ieOfficialPlanningBlocks, ieQueueCoverageBlock } from '../officialPlanningSection.js';
import { ieEconomicsP0Blocks } from '../economicsP0Section.js';
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

SEC_B.story = function (){
  return {
  head: ['Ireland Market Evolution — from a wind-integration problem to a capacity-priced storage market',
         '爱尔兰市场演进 — 从风电消纳问题到以容量定价的储能市场'],
  cap: ['This section is the narrative bridge between the Overview and the detailed underwriting tabs. It separates historical facts, observed market outcomes and the forward investment conclusion.',
        '本节连接“总览”与后续承销分析，明确区分历史事实、已观察市场结果及前瞻投资结论。'],
  blocks: [
    ...ieEconomicsP0Blocks(SRC),
    ...ieOfficialPlanningBlocks(),
    { t:'card', mt:false, title:['One-minute orientation for a new institutional investor','机构投资人的一分钟市场定位'], badges:['official','public'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Market design','市场设计'], v:'I-SEM', d:['all-island gross pool with central scheduling and a capacity mechanism','全岛总电量池，集中调度并配套容量机制'], b:['official'] },
        { l:['Operating storage fleet','在运储能规模'], v:fmt1(O.fleetMW / 1000) + '<small> GW</small>', d:['mostly 0.5–2h, built for DS3','以0.5–2小时为主，为DS3而建'], b:['illus'] },
        { l:['Storage pipeline','储能管线'], v:fmt1(O.pipelineMW / 1000) + '<small> GW</small>', d:[fmt1(O.pipelineMWh / 1000) + ' GWh across ~' + O.pipelineProjects + ' projects','约' + O.pipelineProjects + '个项目，' + fmt1(O.pipelineMWh / 1000) + 'GWh'], b:['illus'] },
        { l:['Data-centre share of metered demand','数据中心占计量用电比重'], v:O.dcSharePct + '<small>%</small>', d:[fmtN(O.dcGWh2025) + ' GWh in 2025 and rising','2025年' + fmtN(O.dcGWh2025) + 'GWh且持续上升'], b:['official'] },
        { l:['Wind dispatch-down (ROI)','风电限发（爱尔兰共和国）'], v:fmt1(O.windDispatchDownPct) + '<small>%</small>', d:['constraint & curtailment cost ' + fmtCM(O.constraintCostM * 1e6),'约束与弃电成本' + fmtCM(O.constraintCostM * 1e6)], b:['official','verify'] },
        { l:['Interconnection added','新增互联能力'], v:fmtN(O.greenlinkMW + O.celticMW) + '<small> MW</small>', d:['Greenlink ' + fmtN(O.greenlinkMW) + ' MW (2025) + Celtic ' + fmtN(O.celticMW) + ' MW (2028e)','Greenlink ' + fmtN(O.greenlinkMW) + 'MW（2025）+ Celtic ' + fmtN(O.celticMW) + 'MW（2028预计）'], b:['official'] },
      ] },
      { t:'reco', b:['Institutional conclusion: ','机构投资结论：'],
        text:['Ireland is not a merchant-arbitrage market with a capacity bonus — it is a capacity market with a merchant overlay. The system pays exceptionally well for firm, de-rated capacity because it is small, wind-dominated and weakly interconnected; it pays comparatively poorly for trading because central scheduling and system limits cap what a battery is allowed to do. Storage economics therefore follow the de-rating table and the connection agreement far more closely than they follow the price curve.',
              '爱尔兰并非“带容量奖金的现货套利市场”，而是“带市场化叠加的容量市场”。由于系统规模小、风电主导且互联薄弱，它对可靠的折减后容量给付极为优厚；而由于集中调度与系统限制约束了电池被允许的操作，它对交易的给付相对微薄。因此储能经济性对折减系数表与并网协议的依赖，远高于对价格曲线的依赖。'] },
      { t:'why', text:['Two facts do the work. Dispatch-down of ' + fmt1(O.windDispatchDownPct) + '% and a constraint bill of ' + fmtCM(O.constraintCostM * 1e6) + ' a year quantify a problem storage can solve — so system need is priced, not merely stated. But ' + fmtN(O.greenlinkMW + O.celticMW) + ' MW of new interconnection arriving into a system of this size will ease exactly the scarcity that creates the spreads. The Irish investment problem is therefore sequencing: capture the capacity value, which is contracted and rising, while assuming the merchant value narrows as the island couples more tightly to Britain and France.',
        '此处两项事实最为关键。' + fmt1(O.windDispatchDownPct) + '%的限发比例与每年' + fmtCM(O.constraintCostM * 1e6) + '的约束账单，量化了一个储能能够解决的问题 — 因此系统需求是被定价的，而非仅被陈述。但在如此规模的系统中新增' + fmtN(O.greenlinkMW + O.celticMW) + 'MW互联能力，恰恰会缓解形成价差的那种稀缺。因此爱尔兰的投资难题在于时序：捕获已合同化且上升的容量价值，同时假设随着本岛与英国、法国耦合加深，市场化价值将收窄。'],
        sig:['Capacity is contracted; spreads are borrowed','容量是合同化的，价差是借来的'] },
    ] },

    { t:'card', title:['How Irish storage revenue was re-pointed — three times in a decade','爱尔兰储能收入的三次重新定向 — 十年间'], badges:['official','public'], blocks:[
      { t:'band-story', b:['Why this history is underwriting-relevant','这段历史为何与承销相关'],
        text:['Ireland built a storage fleet to solve a frequency and inertia problem, then changed the market twice underneath it. The 0.5–1h assets built for DS3 are still operating, still qualified, and structurally unable to earn from the capacity mechanism that now dominates the revenue stack. Rule vintage, not asset age, is what depreciated.',
              '爱尔兰为解决频率与惯量问题建设了储能机组，随后又两次改变了其下的市场规则。为DS3建设的0.5–1小时资产至今仍在运行、仍具资格，却在结构上无法从如今主导收入结构的容量机制中获利。真正折旧的是规则版本，而非资产年限。'] },
      { t:'timeline', items:[
        { y:'2007–2018', t:['The all-island market and the wind problem','全岛市场与风电难题'],
          p:['The Single Electricity Market unified the island under a gross-pool design with central scheduling. Rapid onshore wind growth then created a system-stability constraint rather than an energy constraint: the island could generate more renewable power than it could safely absorb.',
             '单一电力市场以总电量池设计与集中调度统一了全岛。随后陆上风电快速增长带来的是系统稳定性约束而非电量约束：本岛可发出的可再生电力超过其能安全消纳的水平。'],
          i:['The founding constraint is physical, not commercial. That is why Irish storage policy has always paid for system capability first and energy arbitrage second.',
             '本市场的初始约束是物理性的而非商业性的。这正是爱尔兰储能政策始终优先为系统能力付费、其次才为电能量套利付费的原因。'] },
        { y:'2016–2022', t:['DS3 creates a storage industry','DS3催生储能产业'],
          p:['The DS3 programme procured fourteen system services with volume and scalar payments, and made 0.5–1 hour batteries highly profitable. Essentially the whole existing Irish fleet was specified against DS3 tariffs.',
             'DS3计划采购十四项系统服务并采用容量与系数支付，使0.5–1小时电池高度盈利。爱尔兰现有机组几乎全部是按DS3费率规格建设的。'],
          i:['First re-pointing, and the origin of today’s stranded-design problem. A fleet optimised for a tariff cannot pivot when the tariff is replaced by an auction.',
             '第一次重新定向，也是今天“设计搁浅”问题的起源。为固定费率优化的机组，在费率被拍卖取代时无法转向。'] },
        { y:'2022–2026', t:['DS3 revenue falls more than 40%','DS3收入下降逾40%'],
          p:['Tariff and scalar reductions, plus a large increase in qualified supply, cut effective DS3 revenue by more than ' + O.ds3DeclinePct + '% from its peak. The regulated arrangements now run to a long-stop of ' + O.ds3LongStop + '.',
             '费率与系数下调，加上合格供给大幅增加，使DS3有效收入较峰值下降超过' + O.ds3DeclinePct + '%。现行监管安排的最终截止日为' + O.ds3LongStop + '。'],
          i:['Second re-pointing. The pattern matches every other European market: batteries capture the ancillary market almost completely, then the revenue collapses within three to four years.',
             '第二次重新定向。其模式与其他所有欧洲市场一致：电池几乎完全占据辅助服务市场，随后收入在三至四年内崩塌。'] },
        { y:'2024–2026', t:['Capacity becomes the primary revenue line','容量成为主要收入来源'],
          p:['Successive T-4 auctions cleared at rising prices, reaching ' + fmtC(O.crmPrice) + '/kW de-rated/yr for DY ' + O.crmDY + ' with ' + fmtN(O.crmAwardedMW) + ' MW de-rated procured — a level at which capacity can be the dominant revenue line for a 4-hour asset.',
             '连续几轮T-4拍卖出清价持续上升，至交付年' + O.crmDY + '达到' + fmtC(O.crmPrice) + '/kW折减/年，采购折减容量' + fmtN(O.crmAwardedMW) + 'MW — 在该水平下，容量可成为4小时资产的主导收入来源。'],
          i:['Third re-pointing, and this one rewards duration and firmness rather than response speed. The de-rating table replaced the DS3 tariff table as the document that determines asset design.',
             '第三次重新定向，这一次奖励的是时长与可靠性而非响应速度。决定资产设计的文件已由DS3费率表变为折减系数表。'] },
        { y:'Nov 2025', t:['Batteries are properly scheduled','电池获得正式调度地位'],
          p:['The SDP-02 scheduling and dispatch integration went live on ' + O.sdp02Live + ', allowing batteries to charge, trade and be dispatched far more actively within the central scheduling framework.',
             'SDP-02调度与派遣整合于' + O.sdp02Live + '生效，使电池得以在集中调度框架内更主动地充电、交易并接受调度。'],
          i:['This is what made merchant revenue real in Ireland rather than theoretical. It also means pre-2026 Irish trading history understates what a modern asset can do — the one case where legacy data is too pessimistic.',
             '这使爱尔兰的市场化收入由理论转为现实。同时也意味着2026年之前的爱尔兰交易历史低估了现代资产的能力 — 这是既往数据过于悲观的唯一情形。'] },
        { y:'2026–2028', t:['FASS, DASSA and interconnection all land together','FASS、DASSA与互联同期落地'],
          p:['Competitive day-ahead procurement of system services is due to replace administered DS3 tariffs, while the Celtic Interconnector (' + fmtN(O.celticMW) + ' MW to France) is expected in 2028 alongside Greenlink (' + fmtN(O.greenlinkMW) + ' MW to Wales, operational 2025).',
             '系统服务的竞争性日前采购将取代行政化的DS3费率；同时Celtic互联（至法国' + fmtN(O.celticMW) + 'MW）预计于2028年投运，Greenlink（至威尔士' + fmtN(O.greenlinkMW) + 'MW）已于2025年运行。'],
          i:['Two independent compressions arriving in the same window: services repriced by auction, and spreads narrowed by coupling. A 2028–2030 COD faces both, which is precisely why capacity value has to carry the case.',
             '两种相互独立的压缩在同一窗口内到来：服务被拍卖重新定价，价差因耦合而收窄。2028–2030年投运的项目同时面对两者，这正是必须由容量价值支撑投资逻辑的原因。'] },
      ] },
      { t:'why', text:['Three re-pointings in a decade, each roughly four years apart, and each stranding the design that was optimal for the previous era. That is the base rate to underwrite against. Two practical conclusions: record the de-rating vintage and the services regime used in every model, and treat the DASSA go-live and the next capacity auction as scheduled events with a P&L consequence rather than as policy background.',
        '十年内三次重新定向，间隔约四年，且每次都令上一时代的最优设计搁浅。这就是承销时应参照的基准频率。两项实务结论：在每个模型中记录所用的折减系数版本与服务机制；并将DASSA上线与下一次容量拍卖视为具有损益后果的既定事件，而非政策背景。'],
        sig:['Re-pointed roughly every four years','大致每四年重新定向一次'] },
      { t:'g2', cards:[
        { title:['Capacity clearing prices by delivery year','各交付年度容量出清价'], badges:['official','verify'], blocks:[
          { t:'line', cfg:{ xs: M.crmYears, yfmt: v => fmtC(v), h: 200, ymin: 0,
            series:[{ name:['T-4 clearing price (€/kW de-rated/yr)','T-4出清价（€/kW折减/年）'], color:'var(--s1)', vals: M.crmPriceSeries }] } },
          { t:'why', text:['The price has risen every year in this series, tripling across five delivery years. That is the mirror image of GB, where the same instrument halved — and the reason is structural rather than cyclical: a small island system with retiring thermal plant, rising data-centre demand and limited interconnection has to pay whatever it takes to procure firm capacity. Do not extrapolate the trend, but do underwrite the mechanism as the primary revenue line rather than a top-up.',
            '在该序列中价格逐年上升，五个交付年度内涨至三倍。这与英国恰好相反 — 同一工具在英国腰斩 — 其原因是结构性而非周期性的：一个火电退役、数据中心需求上升且互联有限的小岛系统，必须付出任何必要的代价来采购可靠容量。不应外推该趋势，但应将该机制作为主要收入来源而非补充项进行承销。'],
            sig:['Structural, not cyclical, price direction','价格方向是结构性的，而非周期性'] },
        ] },
        { title:['De-rating factors by duration class','按时长档位的折减系数'], badges:['illus','verify'], blocks:[
          { t:'line', cfg:{ xs: M.derateHours.map(x => x + 'h'), yfmt: v => fmtPct(v * 100, 0), ymin: 0, h: 200,
            series:[{ name:['De-rating factor','折减系数'], color:'var(--s1)', vals: M.derateHours.map(hh => M.deratingCurve[hh]) }] } },
          { t:'why', text:['The curve is far flatter at the short end than GB’s — ' + fmtPct(M.deratingCurve[2] * 100, 0) + ' at 2h against GB’s ' + fmtPct(0.22 * 100, 0) + ' — because a smaller, tighter system values a short burst of firm power more highly. Combined with a clearing price several times GB’s, this is why the same physical battery is a capacity asset in Ireland and a trading asset in Britain. Verify the factor against the specific auction vintage before it enters a model; these are indicative seed values.',
            '该曲线在短时端远比英国平缓 — 2小时为' + fmtPct(M.deratingCurve[2] * 100, 0) + '，而英国为' + fmtPct(0.22 * 100, 0) + ' — 因为规模更小、更紧张的系统对短时可靠功率的估值更高。再叠加数倍于英国的出清价，这正是同一台物理电池在爱尔兰是容量资产、在英国是交易资产的原因。此为示意性种子数值，进入模型前须以具体拍卖年份核验。'],
            sig:['Flatter curve, higher price, different asset','曲线更平、价格更高、资产性质不同'] },
        ] },
      ] },
      { t:'src', src: SRC.semo, use:['Capacity auction clearing prices, awarded capacity and de-rating bands','容量拍卖出清价、中标容量与折减档位'] },
    ] },

    { t:'card', title:['Demand growth — the reason the capacity price keeps clearing high','需求增长 — 容量价格持续高位出清的原因'], badges:['official','forecast'], blocks:[
      { t:'bar', cfg:{ xs: M.demandYears, mode:'stack', bw: 44, yfmt: v => fmt1(v) + ' TWh', h: 260,
        series:[
          { name:['Data centres','数据中心'], color:'var(--s6)', vals: M.demandDC },
          { name:['All other demand','其他需求'], color:'var(--s1)', vals: M.demandOther },
        ] } },
      { t:'kpis', items:[
        { l:['Data-centre share, 2025','数据中心占比，2025'], v:O.dcSharePct + '<small>%</small>', d:[fmtN(O.dcGWh2025) + ' GWh of metered electricity','计量用电' + fmtN(O.dcGWh2025) + 'GWh'], b:['official'] },
        { l:['Data-centre demand growth to 2030','至2030年数据中心需求增长'], v:'+' + fmtPct((M.demandDC[4] / M.demandDC[2] - 1) * 100, 0), d:['illustrative projection','示例预测'], b:['forecast'] },
        { l:['All-other demand growth to 2030','至2030年其他需求增长'], v:'+' + fmtPct((M.demandOther[4] / M.demandOther[2] - 1) * 100, 0), d:['data centres are the marginal load','数据中心是边际负荷'], b:['forecast'] },
      ] },
      { t:'why', text:['Data centres are ' + O.dcSharePct + '% of metered electricity and account for most of the forecast growth, which is why the capacity mechanism keeps clearing higher: the system operator must procure firm capacity for a load that is large, growing and largely inflexible. For a storage investor this is the demand-side underpinning of the whole case — but it is also a concentration risk, because a policy change on data-centre connections would remove the growth without removing the pipeline.',
        '数据中心占计量用电的' + O.dcSharePct + '%，并贡献了预测增长的大部分，这正是容量机制持续走高出清的原因：系统运营方必须为一个规模大、增长快且基本缺乏灵活性的负荷采购可靠容量。对储能投资人而言，这是整个投资逻辑的需求侧支撑 — 但同时也是集中度风险，因为针对数据中心并网的政策变动会移除增长，却不会移除管线。'],
        sig:['One load class underpins the case','单一负荷类别支撑全部逻辑'] },
      { t:'src', src: SRC.cso, use:['Data-centre metered electricity consumption and share of total','数据中心计量用电量及其占比'] },
    ] },

    { t:'card', title:['Who owns Irish storage — five strategies competing for the same de-rated MW','谁持有爱尔兰储能 — 五类策略争夺同一批折减MW'], badges:['public','illus'], live:false, blocks:[
      { t:'players', items:[
        { type:['Utility / vertically integrated','公用事业与纵向一体化'], n:['State and incumbent suppliers with generation books','拥有发电组合的国有及在位供电商'], met:'balance-sheet funded',
          p:['Build and hold alongside a supply business, so storage hedges an existing portfolio. They can bid capacity aggressively because the asset has internal value beyond its standalone return.',
             '在自有售电业务旁建设并持有，使储能对冲既有组合。因资产具备超出独立收益的内部价值，其可在容量拍卖中激进报价。'] },
        { type:['Global infra platform','全球基础设施平台'], n:['Pension- and insurance-backed infrastructure managers','养老金与保险支持的基础设施管理人'], met:'multi-project mandates',
          p:['Acquire projects with a capacity award in hand. The award is what makes an Irish asset financeable, so platform buyers concentrate on the post-auction cohort rather than on development risk.',
             '收购已取得容量中标的项目。中标是爱尔兰资产可融资的前提，因此平台型买家集中于拍卖之后的批次，而非承担开发风险。'] },
        { type:['Specialist storage developer','专业储能开发商'], n:['Developers holding connection queue positions','持有并网队列位置的开发商'], met:'connection-led',
          p:['The scarce asset in Ireland is an executed connection agreement with adequate MEC and MIC. Developers who secured early batch positions monetise that scarcity rather than construction capability.',
             '爱尔兰稀缺的资产是一份MEC与MIC均充足的已签并网协议。取得早期批次位置的开发商变现的是这一稀缺性，而非建设能力。'] },
        { type:['Co-located renewable owner','共址新能源业主'], n:['Wind and solar owners adding storage behind the same connection','在同一并网点后加建储能的风光业主'], met:'shared MEC',
          p:['Reuse an existing connection to avoid the queue entirely and to monetise dispatch-down that the renewable asset would otherwise lose. The strongest structural position in the market.',
             '复用既有并网点以完全绕开排队，并将新能源资产原本损失的限发电量变现。这是市场中最强的结构性地位。'] },
        { type:['Optimiser / route-to-market','优化商与售电路径'], n:['Trading firms supplying scheduling and market access','提供调度与市场准入的交易机构'], met:'fee + share',
          p:['Central scheduling makes market access a specialist function. Since SDP-02 the gap between a well-parameterised unit and a poorly-parameterised one has widened materially.',
             '集中调度使市场准入成为专业职能。自SDP-02以来，参数设置良好与设置不当的机组之间差距已显著扩大。'] },
      ] },
      { t:'note', text:['Concentration read: Ireland is concentrated on connection rights rather than on capital or capability. The binding scarcity is an executed connection agreement with adequate MEC and MIC — which is why co-location behind an existing renewable connection is structurally advantaged and why queue positions trade at a premium.',
        '集中度解读：爱尔兰的集中体现在并网权利，而非资本或能力。关键稀缺是一份MEC与MIC均充足的已签并网协议 — 这正是在既有新能源并网点后共址具备结构性优势的原因，也是队列位置存在溢价的原因。'] },
      { t:'why', text:['For a new entrant this determines strategy before it determines price. Buying a project with an executed connection agreement and a capacity award costs more per MW but removes the two risks that actually kill Irish projects. Developing from a batch position is cheaper and is a genuine business, but it is a connection business rather than an energy business, and it should be underwritten with development-stage return requirements.',
        '对新进入者而言，这一点在决定价格之前先决定策略。收购已具备已签并网协议与容量中标的项目，每MW成本更高，但消除了真正会导致爱尔兰项目失败的两项风险。从批次位置自行开发成本更低且是真实业务，但那是并网业务而非能源业务，应按开发阶段的收益要求进行承销。'],
        sig:['Buy the connection, not the megawatts','买的是并网，而非兆瓦'] },
    ] },

    { t:'card', title:['Exit channels — how capital recycles out of Irish storage','退出渠道 — 资本如何从爱尔兰储能中回收'], badges:['public'], live:false, blocks:[
      { t:'exits', items:[
        { n:['1 · Sell at capacity award','1 · 取得容量中标后出售'], w:['The dominant value inflection','主要价值跃升点'],
          d:['A capacity award converts a development asset into a contracted one with ' + O.crmAgreementYears + ' years of visible revenue. Most Irish transactions cluster immediately after an auction result.',
             '容量中标使开发资产转变为拥有' + O.crmAgreementYears + '年可见收入的合同化资产。爱尔兰的多数交易都集中在拍卖结果公布之后。'],
          c:['Value inflects at award, not at connection offer and not at planning consent.','价值在中标时跃升，而非在并网报价或规划许可时。'] },
        { n:['2 · Co-location sell-down','2 · 共址项目股权出售'], w:['Renewable owner-led','新能源业主主导'],
          d:['A wind or solar owner adds storage behind an existing connection, then sells a stake in the combined asset. The buyer is acquiring dispatch-down capture plus capacity revenue without queue risk.',
             '风光业主在既有并网点后加建储能，再出售合并资产的股权。买方获得的是限发电量捕获与容量收入，且不承担排队风险。'],
          c:['The scarcest structure in the market, because it bypasses the binding constraint.','市场中最稀缺的结构，因为它绕过了关键约束。'] },
        { n:['3 · Platform aggregation','3 · 平台化聚合'], w:['Manager-led','管理人主导'],
          d:['Aggregate several awarded projects into an all-island platform, then sell a stake or raise institutional capital. Scale matters here because the market is small and diligence cost per asset is high.',
             '将多个已中标项目聚合为全岛平台，再出售股权或募集机构资金。由于市场规模小、单资产尽调成本高，规模在此至关重要。'],
          c:['Cross-jurisdiction complexity: ROI and NI have different regulators and different connection processes.','跨辖区复杂性：爱尔兰共和国与北爱尔兰监管方不同，并网流程亦不同。'] },
        { n:['4 · Refinancing','4 · 再融资'], w:['Post-COD','投运后'],
          d:['With a capacity agreement in place, lenders will size against contracted revenue and refinance development equity at materially lower cost.',
             '在容量协议到位后，贷款人可依据合同化收入安排规模，并以显著更低的成本置换开发期股权。'],
          c:['The capacity agreement is the credit; the merchant line is the equity return.','容量协议构成信用基础；市场化收入构成股权回报。'] },
      ] },
      { t:'why', text:['Every route prices the same thing: a capacity award. That is unusually clean compared with GB, where value is spread across queue position, consent, trading capability and contracted structures. The practical implication is that Irish development is a binary business — the auction result decides most of the value — so development capital should be sized to survive one failed auction cycle, and acquisition capital should not pay development pricing for a pre-auction asset.',
        '每条路径定价的都是同一件事：容量中标。与英国相比这异常清晰 — 在英国价值分散于队列位置、规划许可、交易能力与合同结构之中。实务含义是：爱尔兰的开发是二元业务 — 拍卖结果决定大部分价值 — 因此开发资本的规模应能承受一个失败的拍卖周期，而收购资本不应为拍卖前的资产支付开发期定价。'],
        sig:['The auction result is the exit','拍卖结果即是退出'] },
    ] },

    { t:'g2', cards:[
      { title:['Near-term outlook — 2026 to 2029: two compressions, one support','近期展望 — 2026至2029：两项压缩，一项支撑'], badges:['official','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2026–2027','2026–2027'], h:['FASS transition','FASS过渡'], p:['Administered DS3 tariffs give way to competitive procurement with a long-stop of ' + O.ds3LongStop + '. Legacy short-duration assets lose their primary revenue line.','行政化DS3费率让位于竞争性采购，最终截止日为' + O.ds3LongStop + '。既往短时资产失去其主要收入来源。'] },
          { yr:['2027–2028','2027–2028'], h:['Celtic Interconnector','Celtic互联'], p:[fmtN(O.celticMW) + ' MW of coupling to France reduces both dispatch-down and spread width. Adequacy improves; merchant scarcity narrows.','与法国' + fmtN(O.celticMW) + 'MW的耦合同时降低限发与价差宽度。充裕度改善，市场化稀缺收窄。'] },
          { yr:['2028–2029','2028–2029'], h:['Capacity carries the case','容量承载投资逻辑'], p:['With services repriced and spreads narrower, the de-rated capacity payment becomes the dominant and most bankable revenue line for a 4-hour asset.','在服务被重新定价、价差收窄的情况下，折减后容量付费成为4小时资产最主要且最可融资的收入来源。'] },
        ] },
        { t:'why', text:['Two independent compressions and one support arrive in the same window, and the sponsor controls none of them. That asymmetry is the argument for building to the capacity mechanism: it is the only line that is contracted, rising and directly influenced by asset design. Anything that depends on spread width or services tariffs should be sized as equity upside.',
          '两项相互独立的压缩与一项支撑在同一窗口内到来，而发起人对三者均无控制力。这一不对称正是“按容量机制建设”的理由：它是唯一已合同化、持续上升且直接受资产设计影响的收入线。任何依赖价差宽度或服务费率的收入，均应按股权上行的规模承担。'],
          sig:['Build to the only contracted line','按唯一合同化收入线建设'] },
      ] },
      { title:['Long-term outlook — 2030 to 2035: adequacy, ambition and augmentation','长期展望 — 2030至2035：充裕度、政策目标与增容'], badges:['official','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2030','2030'], h:['Storage ambition year','储能目标年'], p:['Policy points to at least ' + fmt1(O.storageAmbitionMW / 1000) + ' GW of storage and an SNSP direction of ' + O.snsp2030 + '%, against roughly ' + fmt1(O.fleetMW / 1000) + ' GW operating today.','政策指向至少' + fmt1(O.storageAmbitionMW / 1000) + 'GW储能及' + O.snsp2030 + '%的非同步渗透率方向，而当前在运约' + fmt1(O.fleetMW / 1000) + 'GW。'] },
          { yr:['2031–2033','2031–2033'], h:['LDES procurement','长时储能采购'], p:['A distinct long-duration procurement concept of around ' + fmtN(O.ldesMW) + ' MW / ' + fmtN(O.ldesMWh) + ' MWh remains at consultation stage; an award would create a separate contracted asset class.','约' + fmtN(O.ldesMW) + 'MW/' + fmtN(O.ldesMWh) + 'MWh的独立长时采购概念仍处征询阶段；一旦授予将形成独立的合同化资产类别。'] },
          { yr:['2033–2035','2033–2035'], h:['Fleet replacement and augmentation','机组置换与增容'], p:['The DS3-era 0.5–1h fleet reaches end of warranted life with de-rating factors that no longer support it. Sites with MEC, MIC and planning headroom capture the replacement cycle.','DS3时代的0.5–1小时机组达到质保寿命终点，而折减系数已不再支持其经济性。具备MEC、MIC与规划裕度的场址将获得置换周期的机会。'] },
        ] },
        { t:'why', text:['The long-run case rests on a gap that is stated in policy rather than inferred: roughly ' + fmt1((O.storageAmbitionMW - O.fleetMW) / 1000) + ' GW of additional storage against a pipeline that is nominally ' + fmt1(O.pipelineMW / 1000) + ' GW but constrained by connection capacity rather than by capital. Whether the gap closes depends on the connection process, not on the investment case — which is the single most important thing to understand before deploying development capital in Ireland.',
          '长期逻辑基于一个由政策明示而非推断得出的缺口：需新增约' + fmt1((O.storageAmbitionMW - O.fleetMW) / 1000) + 'GW储能，而管线名义上有' + fmt1(O.pipelineMW / 1000) + 'GW，其约束在于并网容量而非资本。缺口能否弥合取决于并网流程而非投资逻辑 — 这是在爱尔兰投入开发资本前必须理解的最重要一点。'],
          sig:['Connections, not capital, close the gap','弥合缺口的是并网而非资本'] },
      ] },
    ] },

    { t:'card', title:['What breaks this storyline — three monitored uncertainties','哪些因素会打破该叙事 — 三项须持续监测的不确定性'], badges:['public','calc'], blocks:[
      { t:'table', head:[['Uncertainty','不确定性'],['Why it matters','影响机理'],['Monitoring trigger','监测触发条件']], rows:[
        [{b:['DASSA design and parameters','DASSA设计与参数']},
         ['A competitive day-ahead auction replaces administered tariffs. The clearing outcome determines whether the services line survives at any level for short-duration assets.','竞争性日前拍卖取代行政费率。出清结果决定短时资产的服务收入能否在任何水平上存续。'],
         ['Publication of DASSA parameters or a go-live date change','DASSA参数发布或上线日期变更']],
        [{b:['Capacity auction supply','容量拍卖供给']},
         ['The clearing price has tripled because supply was tight. A single large entry cohort, or a data-centre connection policy change, would reverse that quickly.','出清价上涨至三倍是因为供给偏紧。一批大规模新进入者，或数据中心并网政策的变动，都会迅速逆转这一态势。'],
         ['Qualification volumes for the next T-4 auction','下一次T-4拍卖的资格认证容量']],
        [{b:['Interconnection and coupling','互联与耦合']},
         ['Celtic and Greenlink improve adequacy — which reduces the capacity requirement — while simultaneously narrowing spreads. Both effects reduce Irish storage revenue.','Celtic与Greenlink改善充裕度 — 从而降低容量需求 — 同时收窄价差。两种效应均会降低爱尔兰储能收入。'],
         ['Any change to the Celtic commissioning date','Celtic投运日期的任何变动']],
      ] },
      { t:'why', text:['All three are two-sided and none is diversifiable within Ireland; two of them push the same way. That is the argument for structuring rather than forecasting: a FASS re-opener, a degradation covenant protecting the de-rating band, and an explicit Reliability Option stress case together convert three unforecastable variables into three negotiated positions. A model that picks a central case for all three is silent on the largest source of variance.',
        '三者均为双向风险，且在爱尔兰境内均不可分散；其中两项作用方向相同。这正是“以结构应对而非以预测应对”的理由：FASS重议条款、保护折减档位的衰减契约，以及显式的可靠性期权压力情景，三者结合可将三个无法预测的变量转化为三项经过谈判的立场。若模型对三者均取中性情景，即是对最大方差来源保持沉默。'],
        sig:['Structure it, don’t forecast it','以结构应对，而非预测'] },
    ] },

    { t:'card', title:['Bridge to the detailed dashboard — the investor’s question map','进入详细看板 — 投资人的问题地图'], badges:['calc'], blocks:[
      { t:'walk', items:[
        ['03', ['Capacity Mechanism','容量机制'], ['How much de-rated MW will actually be paid?','实际获得付费的折减MW有多少？'], 'capacity'],
        ['04', ['Wholesale & Balancing','批发与平衡'], ['How much of the published spread is executable?','公布价差中有多少可执行？'], 'energy'],
        ['05', ['DS3, FASS & DASSA','DS3、FASS与DASSA'], ['How far can this line still fall?','这项收入还能下跌多少？'], 'services'],
        ['06', ['Duration & LDES','时长与长时储能'], ['Is the fourth hour worth its capex?','第4小时是否值其造价？'], 'duration'],
        ['07', ['Pipeline','项目管线'], ['Who else arrives in my COD year?','投运年度还有谁会到场？'], 'pipeline'],
        ['08', ['Grid & Connection','并网'], ['Does the project have MEC and MIC in an executed agreement?','项目是否在已签协议中载明MEC与MIC？'], 'grid'],
      ] },
    ] },
  ] };
};

// ============================== CAPACITY MECHANISM ==============================

  return SEC_B.story;
}
