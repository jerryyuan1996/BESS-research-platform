/* Great Britain — the `story` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { gbEconomicsP0Blocks } from '../economicsP0Section.js';
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, T, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, durationAt, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O, designNow } = createShared(api);
  const SEC_B = {};

SEC_B.story = function (){
  const S = M.systemEvolution;
  return {
  head: ['GB Market Evolution — from energy-only trading market to a duration-and-connection-constrained storage market',
         '英国市场演进 — 从单一电能量交易市场到受时长与并网约束的储能市场'],
  cap: ['This section is the narrative bridge between the Overview and the detailed underwriting tabs. It separates historical facts, observed market outcomes and the forward investment conclusion.',
        '本节连接“总览”与后续承销分析，明确区分历史事实、已观察市场结果及前瞻投资结论。'],
  blocks: [
    ...gbEconomicsP0Blocks(SRC),
    { t:'card', mt:false, title:['One-minute orientation for a new institutional investor','机构投资人的一分钟市场定位'], badges:['official','public'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Wholesale market design','批发市场设计'], v:'2001 / 2005', d:['NETA then BETTA — energy-only, national pricing retained under RNP','NETA继而BETTA — 单一电能量，改革后维持全国统一定价'], b:['official'] },
        { l:['Capacity Market introduced','容量市场引入'], v:'2014', d:['first T-4 auction; storage de-rated by duration from 2017','首次T-4拍卖；2017年起储能按时长折减'], b:['official'] },
        { l:['Operating battery fleet','在运储能规模'], v:fmt1(O.fleetGW) + '<small> GW</small>', d:['weighted-average duration ' + fmt1(O.fleetAvgHours) + ' h','加权平均时长' + fmt1(O.fleetAvgHours) + '小时'], b:['calc'] },
        { l:['CP2030 battery requirement','CP2030电池需求'], v:'23–27<small> GW</small>', d:['against a ' + fmt1(O.batteryBaselineGW) + ' GW plan baseline — a 5–6× build','对应' + fmt1(O.batteryBaselineGW) + 'GW计划基线 — 需扩张5–6倍'], b:['official'] },
        { l:['T-4 clearing price trajectory','T-4出清价轨迹'], v:'£65 → £' + fmt1(O.t4Price), d:['DY 27/28 peak to DY ' + O.t4DY + ' — down 58%','由27/28峰值降至' + O.t4DY + ' — 下跌58%'], cls:'down', b:['official'] },
        { l:['Central buildout by 2030','中性情景2030装机'], v:'16.0<small> GW</small>', d:['low 12.5 GW · high 20.0 GW','低情景12.5GW · 高情景20.0GW'], b:['forecast'] },
      ] },
      { t:'reco', b:['Institutional conclusion: ','机构投资结论：'],
        text:['GB is not a simple merchant-arbitrage market and it is no longer a frequency-response market. It is a deep, liquid, interconnected energy-only system with a de-rating-driven capacity overlay, in which the binding constraints are connection timing and duration, not demand for storage. Policy demands a 5–6× build; the market prices the marginal MW as if that build has already happened. The winning project must bridge those two facts.',
              '英国既非单纯的现货套利市场，也不再是调频响应市场。它是一个深度、流动、互联的单一电能量系统，叠加以折减系数驱动的容量机制；其约束条件在于并网时点与时长，而非对储能的需求。政策要求扩张5–6倍，而市场对边际MW的定价却仿佛该扩张已经完成。优质项目必须跨越这两个事实。'] },
      { t:'why', text:['Two facts here do the work. Policy requires roughly ' + fmt1(23 - O.batteryBaselineGW) + '–' + fmt1(27 - O.batteryBaselineGW) + ' GW of new batteries by 2030 — so system need is stated, not inferred. But the T-4 price halved and the central buildout path already reaches 16 GW by 2030, so the marginal project is being priced into a market that assumes the requirement is met. The GB investment problem is therefore position, not thesis: an asset must be early enough in the connection queue and long enough in duration to be on the scarce side of a build-out that policy guarantees will happen.',
        '此处两项事实最为关键。政策要求2030年前新增约' + fmt1(23 - O.batteryBaselineGW) + '–' + fmt1(27 - O.batteryBaselineGW) + 'GW电池 — 系统需求是明示的，而非推断的。但T-4价格已腰斩，且中性投产路径到2030年已达16GW，因此边际项目正被以“需求已被满足”的假设定价。英国的投资难题在于位置而非逻辑：资产须在并网队列中足够靠前、时长足够长，才能站在这场由政策保证会发生的扩张中稀缺的一侧。'],
        sig:['Position risk, not thesis risk','位置风险而非逻辑风险'] },
    ] },

    { t:'card', title:['Official system evolution — FES 2025 Ten Year Forecast','官方系统演进 — FES 2025十年预测'], badges:['official','forecast'], blocks:[
      { t:'kpis', items:[
        { l:['Annual system demand','年度系统需求'], v:fmt1(S.demand.totalGWh.values[2] / 1000) + '<small> TWh</small>', d:['2035 vs ' + fmt1(S.demand.totalGWh.values[0] / 1000) + ' TWh in 2024','2035年；2024年为' + fmt1(S.demand.totalGWh.values[0] / 1000) + 'TWh'], b:['official','forecast'] },
        { l:['Peak customer demand','客户峰值需求'], v:fmt1(S.demand.peakGW.values[2]) + '<small> GW</small>', d:['2035 vs ' + fmt1(S.demand.peakGW.values[0]) + ' GW in 2024','2035年；2024年为' + fmt1(S.demand.peakGW.values[0]) + 'GW'], b:['official','forecast'] },
        { l:['Data-centre demand','数据中心需求'], v:fmt1(S.demand.dataCentreGWh.values[2] / 1000) + '<small> TWh</small>', d:['2035; ' + fmt1(S.demand.dataCentreGWh.values[2] / S.demand.dataCentreGWh.values[0]) + '× 2024','2035年；为2024年的' + fmt1(S.demand.dataCentreGWh.values[2] / S.demand.dataCentreGWh.values[0]) + '倍'], b:['official','forecast'] },
        { l:['Network-connected batteries','联网电池'], v:fmt1(S.capacity.batteryGW.values[1]) + '<small> GW</small>', d:['2030; excludes Distributed-Micro','2030年；不含分布式微型储能'], b:['official','forecast'] },
        { l:['Long-duration storage','长时储能'], v:fmt1(S.capacity.ldesGW.values[2]) + '<small> GW</small>', d:['2035 vs ' + fmt1(S.capacity.ldesGW.values[1]) + ' GW in 2030','2035年；2030年为' + fmt1(S.capacity.ldesGW.values[1]) + 'GW'], b:['official','forecast'] },
      ] },
      { t:'g2', cards:[
        { title:['Variable renewables and storage capacity','可变可再生能源与储能容量'], badges:['official','forecast'], blocks:[
          { t:'line', cfg:{ xs:S.years.map(String), yfmt:v => fmt1(v) + ' GW', ymin:0, h:230,
            series:[
              { name:['Wind','风电'], color:'var(--s2)', vals:S.capacity.windGW.values },
              { name:['Solar PV','光伏'], color:'var(--s3)', vals:S.capacity.solarGW.values },
              { name:['Network batteries','联网电池'], color:'var(--s1)', vals:S.capacity.batteryGW.values },
              { name:['LDES','长时储能'], color:'var(--s6)', vals:S.capacity.ldesGW.values },
            ] } },
        ] },
        { title:['Peak demand, firm capacity and interconnection','峰值需求、稳固容量与互联'], badges:['official','forecast'], blocks:[
          { t:'line', cfg:{ xs:S.years.map(String), yfmt:v => fmt1(v) + ' GW', ymin:0, h:230,
            series:[
              { name:['Peak customer demand','客户峰值需求'], color:'var(--ink)', vals:S.demand.peakGW.values },
              { name:['Gas','燃气'], color:'var(--s6)', vals:S.capacity.gasGW.values },
              { name:['Nuclear','核电'], color:'var(--s5)', vals:S.capacity.nuclearGW.values },
              { name:['Interconnectors','互联线路'], color:'var(--s4)', vals:S.capacity.interconnectorGW.values },
            ] } },
        ] },
      ] },
      { t:'note', text:['These are points from one named official pathway, not observed outturns and not the dashboard’s analyst low/central/high merchant scenarios. Original years and FES 2025 vintage are preserved; no hidden interpolation is used.',
        '这些数值来自一个具名官方路径，并非实际结果，也非看板的分析师低/中/高市场化情景。原始年份与FES 2025版本均被保留，未使用任何隐藏插值。'] },
      { t:'why', text:['The physical storage case is visible in the joint movement: annual demand rises about 37%, data-centre demand more than quadruples, wind adds nearly 69 GW, and nuclear falls before partially recovering. FES places network-connected batteries at ' + fmt1(S.capacity.batteryGW.values[1]) + ' GW in 2030. The investment case is invalidated, however, if connection delivery and revenue capture do not keep pace — official system need is not evidence that any individual queue project will earn its cost of capital.',
        '储能的物理需求体现在联动变化中：年度需求增长约37%，数据中心需求增长超过四倍，风电增加近69GW，而核电先下降后部分恢复。FES预计2030年联网电池达到' + fmt1(S.capacity.batteryGW.values[1]) + 'GW。但若并网交付与收入捕获未能同步，投资逻辑仍会失效 — 官方系统需求并不能证明任何单个排队项目能够赚取其资本成本。'],
        sig:['System need ≠ project return','系统需求≠项目回报'] },
      { t:'src', src:SRC.fesEd1, use:['Annual and peak demand, including data-centre demand; FES 2025 Ten Year Forecast','年度与峰值需求（含数据中心需求）；FES 2025十年预测'] },
      { t:'src', src:SRC.fesEs1, use:['Technology capacity by connection class; FES 2025 Ten Year Forecast','按接入类别划分的技术容量；FES 2025十年预测'] },
    ] },
    { t:'card', title:['How GB storage revenue was re-pointed — three times in ten years','英国储能收入的三次重新定向 — 十年间'], badges:['official','public'], blocks:[
      { t:'band-story', b:['Why this history is underwriting-relevant','这段历史为何与承销相关'],
        text:['GB has never paid storage through a single durable mechanism. Revenue moved from frequency response, to the Capacity Market and wholesale spreads, to the Balancing Mechanism — and each move stranded the design that was optimal for the previous era. A 1-hour asset built for Enhanced Frequency Response and a 2-hour asset built for Dynamic Containment are both still operating and both structurally disadvantaged today.',
              '英国从未通过单一持久机制为储能付费。收入先后由调频响应转向容量市场与批发价差，再转向平衡机制；每次转移都令上一时代的最优设计被搁浅。为增强型调频响应建设的1小时资产与为动态遏制建设的2小时资产至今仍在运行，且如今均处于结构性劣势。'] },
      { t:'timeline', items:[
        { y:'2001–2005', t:['Energy-only market established','单一电能量市场确立'],
          p:['NETA and then BETTA created a bilateral, self-dispatch trading market with a Balancing Mechanism as the residual tool. There was no capacity payment and no storage class — storage was simply a generator that could also consume.',
             'NETA继而BETTA建立了双边、自调度的交易市场，平衡机制作为剩余工具。当时既无容量付费，也无储能类别 — 储能只是一台同时可用电的发电机组。'],
          i:['The founding design still governs: GB pays for energy and for balancing actions, and everything else is an overlay bolted on later. That is why GB revenue is more volatile and more execution-dependent than an administered capacity market.',
             '这一初始设计至今仍在支配市场：英国为电能量与平衡动作付费，其余均为后加的叠加机制。这正是英国收入较行政化容量市场更波动、更依赖执行的原因。'] },
        { y:'2014', t:['Capacity Market introduced','引入容量市场'],
          p:['The first T-4 auction procured capacity for 2018/19. Storage initially bid close to nameplate, then from 2017 was assigned duration-differentiated de-rating factors that cut short-duration capacity value sharply.',
             '首次T-4拍卖为2018/19年度采购容量。储能初期以接近铭牌容量投标，自2017年起被赋予按时长差异化的折减系数，短时储能的容量价值因而大幅削减。'],
          i:['This is the origin of the single most important GB number for a battery investor: the de-rating factor. It converts an engineering choice (hours) into a revenue multiplier set by the regulator, not by the market.',
             '这正是对电池投资人而言最重要的英国数字的来源：折减系数。它把工程选择（小时数）转化为由监管方而非市场设定的收入乘数。'] },
        { y:'2016–2019', t:['The frequency-response era — and its end','调频响应时代及其终结'],
          p:['Enhanced Frequency Response and Firm Frequency Response made 30-minute and 1-hour batteries highly profitable. The fleet was built to that specification. Saturation, product redesign and the arrival of a much larger qualified supply then collapsed unit prices.',
             '增强型调频响应与固定调频响应使30分钟与1小时电池高度盈利，存量机组即按此规格建设。随后市场饱和、产品重构以及合格供给大幅增加，导致单位价格崩塌。'],
          i:['First re-pointing. The lesson generalises: in GB, any product that batteries can supply better than anything else will be over-supplied by batteries within roughly three years of becoming profitable.',
             '第一次重新定向。其教训具有普适性：在英国，任何电池比其他技术更擅长提供的产品，都会在其变得有利可图后约三年内被电池过度供给。'] },
        { y:'2020–2023', t:['Dynamic products launch, then saturate','动态类产品上线继而饱和'],
          p:['Dynamic Containment went live in late 2020, followed by Dynamic Moderation and Dynamic Regulation, and later the reserve family under the Enduring Auction Capability platform. Batteries now clear 97–99% of dynamic volume while clearing prices fall 25–30% a year.',
             '动态遏制于2020年末上线，随后是动态调节与动态调整，其后在常态化拍卖平台下推出备用类产品。电池目前占动态类成交量的97–99%，而出清价每年下跌25–30%。'],
          i:['Second re-pointing, and the same pattern at higher speed. Any services line in a GB base case must be capped at trailing twelve-month unit revenue with no growth assumption.',
             '第二次重新定向，模式相同但速度更快。英国基准情景中的任何服务收入项，均须以过去12个月单位收入封顶，且不得假设增长。'] },
        { y:'2022–2025', t:['Wholesale volatility and BM access become the core','批发波动与平衡机制准入成为核心'],
          p:['Gas-driven price volatility widened spreads, while platform reform improved battery access to the Balancing Mechanism. The BM is now the single largest revenue component at 39%, ahead of day-ahead at 38%.',
             '燃气驱动的价格波动扩大了价差，同时平台改革改善了电池进入平衡机制的条件。平衡机制目前是最大的单一收入项，占39%，高于日前市场的38%。'],
          i:['Third re-pointing — and this one rewards trading capability rather than asset specification. The same physical battery now earns ' + fmtPct((M.realisedRatio.strong / M.realisedRatio.weak - 1) * 100, 0) + ' more under a strong optimiser than a weak one.',
             '第三次重新定向 — 这一次奖励的是交易能力而非资产规格。同一台物理电池在优秀优化商手中的收入，比在落后者手中高' + fmtPct((M.realisedRatio.strong / M.realisedRatio.weak - 1) * 100, 0) + '。'] },
        { y:'2024–2025', t:['Clean Power 2030 and connections reform','2030清洁电力与并网改革'],
          p:['The CP2030 Action Plan set a 23–27 GW battery and 4–6 GW LDES requirement. In parallel, connections reform replaced the first-come-first-served queue with Gate 1 / Gate 2, re-ordering a multi-hundred-GW queue against strategic need and project readiness.',
             '《2030清洁电力行动计划》确定23–27GW电池与4–6GW长时储能需求。与此同时，并网改革以Gate 1/Gate 2取代先到先得排队机制，依据战略需求与项目成熟度对数百GW的队列重新排序。'],
          i:['Connection position stopped being an administrative formality and became the principal determinant of project value. Two otherwise identical projects now differ in worth mainly by tranche.',
             '并网地位不再是行政手续，而成为项目价值的首要决定因素。两个其他方面完全相同的项目，其价值差异如今主要来自所处批次。'] },
        { y:'2026', t:['Capacity price halves; LDES gets its own regime','容量价格腰斩；长时储能获得独立机制'],
          p:['The T-4 auction for DY ' + O.t4DY + ' cleared at £' + fmt1(O.t4Price) + '/kW/yr against £65 for DY 27/28, procuring ' + fmtN(O.t4AwardedMW) + ' MW de-rated. Separately, Ofgem reached minded-to decisions on ' + O.ldesWindow1Projects + ' LDES cap-and-floor Window 1 projects.',
             'DY ' + O.t4DY + '的T-4拍卖以£' + fmt1(O.t4Price) + '/kW/年出清，对比27/28年度的£65，采购折减容量' + fmtN(O.t4AwardedMW) + 'MW。另一方面，Ofgem对' + O.ldesWindow1Projects + '个长时储能上下限机制第一窗口项目作出倾向性决定。'],
          i:['The market split in two. Short-duration storage is now a merchant trading asset with a modest capacity top-up; 8h+ LDES is becoming a regulated, contracted asset class. These require different underwriting frameworks and different investors.',
             '市场就此一分为二。短时储能如今是带有少量容量补充的市场化交易资产；8小时以上长时储能正成为受监管、合同化的资产类别。两者需要不同的承销框架与不同的投资人。'] },
      ] },
      { t:'why', text:['Three re-pointings in ten years, each roughly three to four years apart, and each favouring a design that did not exist in the previous era. That is the base rate to underwrite against. Two practical conclusions: record the de-rating vintage and services-price vintage used in every model, and treat the next auction parameter review and the next connections-reform tranche as scheduled events with a P&L consequence, not as policy background.',
        '十年内三次重新定向，间隔约三至四年，且每次都有利于上一时代尚不存在的设计。这就是承销时应参照的基准频率。两项实务结论：在每个模型中记录所用的折减系数版本与服务价格版本；并将下一次拍卖参数审查与下一批并网改革批次视为具有损益后果的既定事件，而非政策背景。'],
        sig:['Re-pointed roughly every three years','大致每三年重新定向一次'] },
      { t:'g2', cards:[
        { title:['Capacity Market clearing prices — the mechanism is not a stable annuity','容量市场出清价 — 该机制并非稳定年金'], badges:['official'], blocks:[
          { t:'line', cfg:{ xs: M.cmYears, yfmt: v => '£' + fmt1(v), h: 200,
            series: [{ name:['T-4 clearing price (£/kW/yr)','T-4出清价（£/kW/年）'], color:'var(--s1)', vals: M.t4Series }] } },
          { t:'why', text:['The T-4 price has ranged from £18 to £65 and back to £' + fmt1(O.t4Price) + ' in six delivery years — a 3.6× peak-to-trough swing driven by how much capacity turns up, not by how much is needed. A 15-year agreement fixes the price you won, so the auction you enter is a one-shot event that determines a sixth of lifetime revenue. Model the range, not the last print.',
            'T-4价格在六个交付年度内由£18升至£65又回落至£' + fmt1(O.t4Price) + ' — 峰谷相差3.6倍，其驱动因素是有多少容量参与投标，而非需要多少容量。15年协议锁定的是你中标时的价格，因此你参与的那一次拍卖是决定终身收入六分之一的一次性事件。应对区间建模，而非对最近一次出清价建模。'],
            sig:['One auction, fifteen years','一次拍卖，十五年'] },
        ] },
        { title:['De-rating factors by duration — the regulator’s duration signal','按时长的折减系数 — 监管方的时长信号'], badges:['official'], blocks:[
          { t:'line', cfg:{ xs: M.derateHours.map(x => x + 'h'), yfmt: v => fmtPct(v * 100, 0), ymin: 0, h: 200,
            series: [
              { name:['T-4 2028/29 vintage','T-4 2028/29版本'], color:'var(--s3)', vals: M.derateVintages['T-4 2028/29'], dash: true },
              { name:['T-4 2029/30 vintage','T-4 2029/30版本'], color:'var(--s1)', vals: M.derateVintages['T-4 2029/30'] },
            ] } },
          { t:'why', text:['Up to eight hours every point rose between the two vintages: 2h from ' + fmtPct(M.derateVintages['T-4 2028/29'][1] * 100) + ' to ' + fmtPct(M.derateVintages['T-4 2029/30'][1] * 100) + ', 4h from ' + fmtPct(M.derateVintages['T-4 2028/29'][2] * 100) + ' to ' + fmtPct(M.derateVintages['T-4 2029/30'][2] * 100) + ', 8h from ' + fmtPct(M.derateVintages['T-4 2028/29'][4] * 100) + ' to ' + fmtPct(M.derateVintages['T-4 2029/30'][4] * 100) + '. Only the longest class slipped. NESO\'s factors climb about eleven points an hour up to the duration-limited threshold, so the curve pays for every hour to about eight, not just the first two. What the regulator does do is re-price by vintage, so record the vintage in every model: a factor from the wrong auction moves short-duration capacity revenue by around 5%.',
            '在八小时以内，两个版本之间曲线上每一点都上升：2小时由' + fmtPct(M.derateVintages['T-4 2028/29'][1] * 100) + '升至' + fmtPct(M.derateVintages['T-4 2029/30'][1] * 100) + '，4小时由' + fmtPct(M.derateVintages['T-4 2028/29'][2] * 100) + '升至' + fmtPct(M.derateVintages['T-4 2029/30'][2] * 100) + '，8小时由' + fmtPct(M.derateVintages['T-4 2028/29'][4] * 100) + '升至' + fmtPct(M.derateVintages['T-4 2029/30'][4] * 100) + '。仅最长时长档位略有下降。NESO的系数在时长受限门槛以内每小时约提高十一个百分点，因此该曲线为直至约八小时的每一小时付费，而不只是前两小时。监管方确实会按版本重新定价，因此每个模型都应记录所用版本：使用错误拍卖的系数会使短时容量收入偏差约5%。'],
            sig:['Every hour to eight is paid','八小时以内每小时均获付费'] },
        ] },
      ] },
      { t:'src', src: SRC.derate, use:['Duration-differentiated de-rating factors by auction vintage','按拍卖年份的时长差异化折减系数'] },
    ] },

    { t:'card', title:['Before and after the battery build — what changed in the investable market','储能扩张前后 — 可投资市场发生的变化'], badges:['calc'], blocks:[
      { t:'table', head:[['Dimension','维度'],['Before (2016–2020)','此前（2016–2020）'],['Now (2026)','当前（2026）']], rows:[
        [{b:['Primary revenue line','主要收入来源']}, ['Frequency response (EFR / FFR)','调频响应（EFR/FFR）'], ['Balancing Mechanism 39% + day-ahead 38%','平衡机制39% + 日前38%']],
        [{b:['Optimal design','最优设计']}, ['0.5–1h, power-dense','0.5–1小时，功率密集'], designNow()],
        [{b:['Who wins','谁获胜']}, ['Whoever qualifies first','最先取得资格者'], ['Whoever trades best and connects earliest','交易最优且并网最早者']],
        [{b:['Barrier to entry','进入壁垒']}, ['Technical qualification','技术资格认证'], ['Connection queue position and consent','并网队列位置与规划许可']],
        [{b:['Revenue predictability','收入可预测性']}, ['High while scarce, then collapsed','稀缺期高，随后崩塌'], ['Moderate — contracted structures now available','中等 — 已有合同化结构可用']],
        [{b:['Lender posture','贷款人态度']}, ['Corporate / balance-sheet only','仅企业或表内融资'], ['Project debt available against tolls, floors and swaps','以租赁、保底与互换为基础可获项目融资']],
      ] },
      { t:'why', text:['The single most investable change is the last row. Between 2024 and 2026 GB developed a genuine contracted-revenue market — tolls at around ' + fmtCk(M.contracted[0].v) + '/MW/yr, portfolio floors around ' + fmtCk(M.contracted[1].v) + ', and the first publicly reported multi-year revenue swaps at about ' + fmtCk(M.contracted[2].v) + '. That is what makes non-recourse debt possible and what defines the exit specification. A merchant-only GB thesis is now a choice, not a necessity — and it should be priced as the riskier of two available structures.',
        '最具投资意义的变化是最后一行。2024至2026年间，英国形成了真实的合同化收入市场 — 容量租赁约' + fmtCk(M.contracted[0].v) + '/MW/年，组合层面保底约' + fmtCk(M.contracted[1].v) + '，首批公开披露的多年期收益互换约' + fmtCk(M.contracted[2].v) + '。这正是无追索权债务得以实现的基础，也界定了退出规格。纯市场化的英国投资逻辑如今是一种选择而非必然 — 且应被定价为两种可选结构中风险更高的一种。'],
        sig:['Contracted revenue is now a real option','合同化收入已成为真实选项'] },
    ] },

    { t:'card', title:['Who owns GB storage — five strategies competing for the same MW','谁持有英国储能 — 五类策略争夺同一批MW'], badges:['public','illus'], live:false, blocks:[
      { t:'players', items:[
        { type:['Listed storage fund','上市储能基金'], n:['Dedicated GB storage investment trusts','专注英国储能的上市投资信托'], met:'~0.5–1.5 GW each',
          p:['Own operating assets and outsource trading. Publicly reported revenue per MW makes them the market’s de-facto benchmark — and their discounts to NAV are the clearest signal of how merchant risk is being priced.',
             '持有运营资产并将交易外包。其每MW收入公开披露，成为市场事实上的基准；其相对净值的折价则最清晰地反映市场如何为市场化风险定价。'] },
        { type:['Utility / IPP','公用事业与独立发电商'], n:['Vertically integrated generators and suppliers','纵向一体化的发电与供电企业'], met:'balance-sheet funded',
          p:['Build and hold alongside a supply book, so the battery hedges an existing portfolio rather than standing alone. They can accept lower standalone returns because the asset has internal value.',
             '在自有售电业务旁建设并持有，使电池成为既有组合的对冲而非独立资产。因资产具备内部价值，其可接受更低的独立收益率。'] },
        { type:['Global infra platform','全球基础设施平台'], n:['Pension- and insurance-backed infrastructure managers','养老金与保险支持的基础设施管理人'], met:'multi-GW mandates',
          p:['Acquire operating or near-operating portfolios with contracted revenue. They set the exit specification: contracted or floor-supported cash flow, delivered capacity, operating track record.',
             '收购具备合同化收入的已运营或接近运营的组合。他们设定了退出规格：合同化或保底支撑的现金流、可交付容量、运营业绩记录。'] },
        { type:['Optimiser-developer','优化商兼开发商'], n:['Trading-led developers retaining route-to-market','以交易为核心并保留售电路径的开发商'], met:'fee + upside share',
          p:['The scarce capability in GB is dispatch execution, not construction. Firms that own the trading stack capture the ' + fmtPct((M.realisedRatio.strong - M.realisedRatio.fleetMedian) * 100, 0) + '-point premium over median realised revenue.',
             '英国稀缺的能力是调度执行而非建设。掌握交易能力的机构可获取相对中位实际收入' + fmtPct((M.realisedRatio.strong - M.realisedRatio.fleetMedian) * 100, 0) + '个百分点的溢价。'] },
        { type:['OEM / integrator','设备商与集成商'], n:['Chinese and Western cell and system suppliers','中西方电芯与系统供应商'], met:'equipment + LTSA',
          p:['Embedded as equipment and long-term service providers rather than asset owners. Their pricing sets GB capex, and their warranty terms set the practical cycling limit in every model.',
             '主要作为设备与长期服务提供方嵌入，而非资产持有方。其定价决定英国的资本开支，其质保条款决定各模型中实际可行的循环上限。'] },
      ] },
      { t:'note', text:['Concentration read: GB is fragmented on ownership but concentrated on capability. Many parties can own a battery; comparatively few can trade one at the top of the realised-revenue distribution, and that is where the return dispersion sits.',
        '集中度解读：英国在所有权上分散，在能力上集中。能持有电池的主体众多，但能将其交易表现维持在实际收入分布顶部的机构相对稀少，而收益离散正源于此。'] },
      { t:'why', text:['For a new entrant this determines structure before it determines price. You are not competing for scarce assets — you are competing for scarce execution and scarce connection dates. The practical implication is that the optimiser contract, not the EPC contract, is the document that most changes the investment case, and it should carry benchmarked performance tests, step-downs and termination rights from day one.',
        '对新进入者而言，这一点在决定价格之前先决定结构。竞争对象并非稀缺资产，而是稀缺的执行能力与稀缺的并网日期。实务含义是：最能改变投资结论的文件是优化商合同而非EPC合同，且自第一天起就应包含基准化的业绩测试、降费机制与终止权。'],
        sig:['Compete for execution, not assets','争夺执行能力而非资产'] },
    ] },

    { t:'card', title:['Exit channels — how capital actually recycles out of GB storage','退出渠道 — 资本如何真实从英国储能中回收'], badges:['public'], live:false, blocks:[
      { t:'exits', items:[
        { n:['1 · Develop and sell down','1 · 开发后出售'], w:['Most common route','最常见路径'],
          d:['De-risk to a defined point — Gate 2 secured, consent implementable, connection date firm — then sell to a long-term holder. Price is the DCF of contracted and benchmarked merchant revenue plus a development premium.',
             '将项目去风险至明确节点 — 取得Gate 2、规划许可可实施、并网日期确定 — 再出售给长期持有方。价格为合同化及基准化市场化收入的折现值加开发溢价。'],
          c:['Value inflects at Gate 2 countersignature and again at implementable consent, not at planning submission.','价值在Gate 2会签及规划许可可实施两个节点跃升，而非在提交规划申请时。'] },
        { n:['2 · Platform build and stake sale','2 · 平台化建设与股权引入'], w:['Manager-led','管理人主导'],
          d:['Aggregate operating assets into a branded platform, then sell a strategic stake or raise institutional capital against it. Recycles capital while retaining management economics and the trading stack.',
             '将运营资产聚合为品牌化平台，再出售战略股权或以其为载体募集机构资金。在保留管理收益与交易能力的同时回收资本。'],
          c:['Requires a credible route-to-market story, because the buyer is underwriting execution as much as assets.','需要可信的售电路径叙事，因为买方承销的既是资产也是执行能力。'] },
        { n:['3 · Corporate M&A','3 · 公司层面并购'], w:['Founder / PE exit','创始人/PE退出'],
          d:['Sell the whole developer, pricing operating assets, the queue position portfolio and the optimiser capability together. Buyers are global infrastructure and pension managers seeking a platform rather than single assets.',
             '整体出售开发商，将运营资产、并网队列位置组合与优化能力一并定价。买方为寻求平台而非单一资产的全球基础设施与养老金管理人。'],
          c:['Queue position portfolios have become a distinct valuation line since connections reform.','自并网改革以来，并网队列位置组合已成为独立的估值项。'] },
        { n:['4 · Refinancing','4 · 再融资'], w:['Post-COD','投运后'],
          d:['Once operating and contracted, replace development equity with long-tenor non-recourse debt, releasing capital without selling the asset. GB lenders will size against a toll or a floor far more readily than against merchant revenue.',
             '投运并签约后，以长期无追索权债务置换开发期股权，在不出售资产的前提下释放资本。相较市场化收入，英国贷款人更愿以租赁或保底安排债务规模。'],
          c:['A toll at ' + fmtCk(M.contracted[0].v) + '/MW/yr supports materially more leverage than a merchant case at the same expected value.','在期望值相同的情况下，' + fmtCk(M.contracted[0].v) + '/MW/年的租赁结构可支撑显著高于市场化情景的杠杆。'] },
      ] },
      { t:'why', text:['All four routes price the same two things: contracted cash flow and delivery certainty. Pension capital is the terminal buyer, but it buys through infrastructure platforms and it buys operating or near-operating, contracted risk. That sets the exit specification for anyone developing in GB today — a floor-supported or tolled revenue line, a firm connection, and a demonstrated realised-to-theoretical ratio — not a merchant thesis.',
        '四条路径定价的是同样两件事：合同化现金流与交付确定性。养老金资本是最终买家，但其通过基础设施平台买入，且只买已运营或接近运营、已签约的风险。这为今天在英国开发的任何主体设定了退出规格：保底或租赁支撑的收入、确定的并网、以及可验证的实际与理论收入比 — 而非市场化押注。'],
        sig:['Build to the exit specification','按退出规格建设'] },
    ] },

    { t:'g2', cards:[
      { title:['Near-term outlook — 2026 to 2029: execution decides returns','近期展望 — 2026至2029：执行决定收益'], badges:['official','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2026–2027','2026–2027'], h:['Connection re-ordering','并网重新排序'], p:['Gate 2 offers phased through March 2027 determine which projects have a 2029–2030 COD at all. Queue position becomes the primary valuation variable.','Gate 2要约分阶段发出至2027年3月，决定哪些项目能实现2029–2030年投运。队列位置成为首要估值变量。'] },
          { yr:['2027–2028','2027–2028'], h:['Services floor, wholesale carries','服务见底，批发承载'], p:['Frequency-response revenue approaches a floor set by opex-plus-margin bidding. Wholesale and BM carry the case, so optimiser selection dominates asset selection.','调频响应收入接近由“运维加边际”报价决定的底部。批发与平衡机制承载投资逻辑，因此优化商选择的重要性超过资产选择。'] },
          { yr:['2028–2029','2028–2029'], h:['De-rating squeeze on short assets','折减系数挤压短时资产'], p:['Successive de-rating vintages cut 1–2h capacity value further while 4h holds.','连续的折减系数版本进一步削减1–2小时资产的容量价值，而4小时基本维持。'] },
        ] },
        { t:'why', text:['In this window nothing about the market changes in your favour. Spread compression under the central buildout path reaches ' + fmtPct((1 - M.compression2h.CENTRAL[4]) * 100, 0) + ' by 2029 for a 2h asset, and services keep falling. The only levers a sponsor controls are connection date, duration and optimiser. Underwrite as if all three must be top-quartile, because the market will not compensate for any of them being average.',
          '在这一窗口内，市场不会有任何变化对你有利。在中性投产路径下，2小时资产的价差压缩至2029年达到' + fmtPct((1 - M.compression2h.CENTRAL[4]) * 100, 0) + '，且服务收入持续下滑。发起人可控的杠杆只有并网日期、时长与优化商三项。应按三项均须处于前四分之一来测算，因为市场不会为其中任何一项的平庸表现给予补偿。'],
          sig:['Three controllable levers only','仅三项可控杠杆'] },
      ] },
      { title:['Long-term outlook — 2030 to 2035: policy demand meets delivery reality','长期展望 — 2030至2035：政策需求遭遇交付现实'], badges:['official','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2030','2030'], h:['CP2030 target year','CP2030目标年'], p:['Policy requires 23–27 GW of batteries. The central buildout path reaches 16 GW and the high path 20 GW — so on current trajectory the target is missed on the central case.','政策要求23–27GW电池。中性投产路径达到16GW，高情景达20GW — 因此按当前轨迹，中性情景下目标无法达成。'] },
          { yr:['2031–2033','2031–2033'], h:['LDES becomes a separate class','长时储能成为独立类别'], p:['Cap-and-floor awards convert 8h+ projects into regulated, contracted assets with a different cost of capital and different buyers from 2h merchant storage.','上下限机制授予将8小时以上项目转化为受监管、合同化的资产，其资本成本与买家群体均不同于2小时市场化储能。'] },
          { yr:['2033–2035','2033–2035'], h:['Replacement and augmentation cycle','置换与增容周期'], p:['The 2016–2020 short-duration fleet reaches end of warranted life with de-rating factors that no longer support it. Augmentation-ready sites hold value; fixed 1h sites do not.','2016–2020年建设的短时机组达到质保寿命终点，而折减系数已不再支持其经济性。具备增容条件的场址保值，固定1小时场址则不然。'] },
        ] },
        { t:'why', text:['The long-run case rests on a gap the market is not currently pricing: policy needs 23–27 GW, the central delivery path gives 16 GW, and the difference is constrained by connections and consent rather than by capital. If that gap persists, the assets that are already connected in 2030 are on the scarce side. If connections reform succeeds faster than expected, the high buildout path applies and 2h merchant economics compress ' + fmtPct((1 - M.compression2h.HIGH[5]) * 100, 0) + ' by 2030. Both branches point to the same protection: secure the connection date and the duration, and contract enough revenue to survive the high case.',
          '长期逻辑基于一个市场当前尚未定价的缺口：政策需要23–27GW，中性交付路径仅提供16GW，而差额的约束来自并网与规划许可而非资本。若该缺口持续，2030年前已并网的资产将处于稀缺一侧。若并网改革推进快于预期，则适用高投产路径，2小时市场化经济性到2030年压缩' + fmtPct((1 - M.compression2h.HIGH[5]) * 100, 0) + '。两条分支指向同一项保护：锁定并网日期与时长，并签约足够收入以承受高情景。'],
          sig:['Same protection in both branches','两条分支下保护措施相同'] },
      ] },
    ] },

    { t:'card', title:['What breaks this storyline — three monitored uncertainties','哪些因素会打破该叙事 — 三项须持续监测的不确定性'], badges:['public','calc'], blocks:[
      { t:'table', head:[['Uncertainty','不确定性'],['Why it matters','影响机理'],['Monitoring trigger','监测触发条件']], rows:[
        [{b:['Connection oversubscription & commitment fees','并网超额认购与承诺费']},
         ['A fee or milestone test that thins the queue moves the buildout path toward LOW, which raises merchant revenue for those who survive it. It is the single largest two-sided risk in the model.','若收费或里程碑考核压缩队列，投产路径将移向低情景，从而提高存活项目的市场化收入。这是模型中最大的双向风险。'],
         ['Any Ofgem/NESO decision on oversubscription charging','Ofgem或NESO关于超额认购收费的任何决定']],
        [{b:['Charging reform (TNUoS / DUoS / BSUoS)','网络收费改革']},
         ['Network charges are a direct deduction from the merchant line and are locationally differentiated. A reform that raises storage charges in the north changes regional site selection outright.','网络费用是市场化收入的直接扣减项，且按区位差异化。若改革提高北部储能收费，将直接改变区域选址策略。'],
         ['Publication of a charging-reform decision or transitional arrangement','收费改革决定或过渡安排的发布']],
        [{b:['Support-scheme gating of connections','并网与收入支持机制挂钩']},
         ['If future connection windows are gated on holding a support contract, pure-merchant storage is structurally disadvantaged and the contracted-revenue market re-prices upward.','若未来并网窗口以持有支持性合同为前提，纯市场化储能将处于结构性劣势，合同化收入市场则重新上调定价。'],
         ['Any consultation linking connection eligibility to a revenue-support scheme','任何将并网资格与收入支持机制挂钩的征询文件']],
      ] },
      { t:'why', text:['All three are policy variables, all three are two-sided, and none of them is diversifiable within GB. That is the argument for structuring rather than forecasting: a change-in-law allocation, a repricing right on network charges, and a contracted floor together convert three unforecastable policy risks into three negotiated positions. A model that simply picks a central case for all three is not conservative — it is silent on the largest source of variance.',
        '三者均为政策变量、均为双向、且在英国境内均不可分散。这正是“以结构应对而非以预测应对”的理由：法律变更风险分担、网络费用重新定价权、以及合同化保底三者结合，可将三项无法预测的政策风险转化为三项经过谈判的立场。若模型仅对三者取中性情景，那不是审慎，而是对最大方差来源保持沉默。'],
        sig:['Structure it, don’t forecast it','以结构应对，而非预测'] },
    ] },

    { t:'card', title:['Bridge to the detailed dashboard — the investor’s question map','进入详细看板 — 投资人的问题地图'], badges:['calc'], blocks:[
      { t:'walk', items:[
        ['03', ['Capacity Market','容量市场'], ['How much de-rated MW will actually be paid?','实际获得付费的折减MW有多少？'], 'capacity'],
        ['04', ['Wholesale & BM','批发与平衡'], ['What spread will actually be realised, not modelled?','实际可实现的价差是多少，而非模型值？'], 'energy'],
        ['05', ['System Services','系统服务'], ['How far can this line still fall?','这项收入还能下跌多少？'], 'services'],
        ['06', ['Duration & LDES','时长与长时储能'], ['Is the fourth hour worth its capex?','第4小时是否值其造价？'], 'duration'],
        ['07', ['Pipeline','项目管线'], ['Who else arrives in my COD year?','投运年度还有谁会到场？'], 'pipeline'],
        ['08', ['Grid Connection','并网'], ['Can this project actually energise on time?','项目能否按时送电？'], 'grid'],
      ] },
    ] },
  ] };
};

// ============================== CAPACITY MARKET ==============================

  return SEC_B.story;
}
