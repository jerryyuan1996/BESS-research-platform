/* Authoritative full research history. Extracted verbatim from src/markets/gb/sections/story.js.
   Original facts, interpretations, scope and live data bindings are preserved.
   Public relocation is an editorial draft, not a new content approval. */
export function researchHistory(api){
  const {M,SRC,fmtN,fmt1,fmtPct}=api;
  const O=M.official;
  
  return {head: ['GB Market Evolution — from energy-only trading market to a duration-and-connection-constrained storage market',
         '英国市场演进 — 从单一电能量交易市场到受时长与并网约束的储能市场'],
cap: ['This section is the narrative bridge between the Overview and the detailed underwriting tabs. It separates historical facts, observed market outcomes and the forward investment conclusion.',
        '本节连接“总览”与后续承销分析，明确区分历史事实、已观察市场结果及前瞻投资结论。'],
  cards:[
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
    ] }
  ]};
}
