/* Authoritative full research history. Extracted verbatim from src/markets/ie/sections/story.js.
   Original facts, interpretations, scope and live data bindings are preserved.
   Public relocation is an editorial draft, not a new content approval. */
export function researchHistory(api){
  const {M,SRC,fmtN,fmtC,fmtPct}=api;
  const O=M.official;
  
  return {head: ['Ireland Market Evolution — from a wind-integration problem to a capacity-priced storage market',
         '爱尔兰市场演进 — 从风电消纳问题到以容量定价的储能市场'],
cap: ['This section is the narrative bridge between the Overview and the detailed underwriting tabs. It separates historical facts, observed market outcomes and the forward investment conclusion.',
        '本节连接“总览”与后续承销分析，明确区分历史事实、已观察市场结果及前瞻投资结论。'],
  cards:[
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
    ] }
  ]};
}
