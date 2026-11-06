/* Authoritative full research history. Extracted verbatim from src/markets/pl/sections/story.js.
   Original facts, interpretations, scope and live data bindings are preserved.
   Public relocation is an editorial draft, not a new content approval. */
export function researchHistory(api){
  const {M,SRC,fmtN,fmtPct}=api;
  const O=M.official;
  
  return {head: ['Poland Market Evolution — from a coal capacity market to a storage capacity market',
         '波兰市场演进 — 从煤电容量市场到储能容量市场'],
cap: ['This section is the narrative bridge between the Overview and the detailed underwriting tabs. It separates historical facts, observed market outcomes and the forward investment conclusion.',
        '本节连接“总览”与后续承销分析，明确区分历史事实、已观察市场结果及前瞻投资结论。'],
  cards:[
{ t:'card', title:['How Poland arrived at a storage capacity market — four changes','波兰如何走向储能容量市场 — 四次变化'], badges:['verify','public'], blocks:[
      { t:'band-story', b:['Why this history is underwriting-relevant','这段历史为何与承销相关'],
        text:['The Polish capacity market was designed for thermal plant and has been progressively re-pointed toward flexibility. Each re-pointing changed which technology could win without changing the mechanism’s name — which is exactly the pattern that strands designs built for the previous vintage. Record the auction vintage and correction-factor table in every model.',
              '波兰容量市场原为火电设计，此后逐步向灵活性资源重新定向。每次重新定向都在机制名称不变的情况下改变了哪种技术能够胜出 — 这正是使按上一版本设计的资产被搁浅的模式。应在每个模型中记录拍卖年份与折减系数表。'] },
      { t:'timeline', items:[
        { y:'2018–2021', t:['A capacity market built for coal','为煤电而建的容量市场'],
          p:['The mechanism was introduced to secure adequacy in a coal-dominated system, with multi-year contracts for new build and shorter contracts for existing plant. Storage was a marginal participant.',
             '该机制的引入是为了在以煤电为主的系统中保障充裕度，对新建机组给予多年期合同、对既有机组给予较短期限。储能当时只是边缘参与者。'],
          i:['The contract length that now makes storage financeable was designed to finance thermal plant. Investors inherit a structure built for a different technology — including obligations calibrated to plant that can run for days.',
             '如今使储能可融资的合同期限，最初是为火电融资而设计的。投资人继承的是为另一种技术构建的结构 — 包括按可连续运行数日的机组标定的义务条款。'] },
        { y:'2021–2023', t:['Emissions limits push coal out of the auction','排放限值将煤电挤出拍卖'],
          p:['EU emission-performance requirements progressively excluded the highest-emitting units from new capacity contracts, opening the auction to gas, demand response and storage.',
             '欧盟排放绩效要求逐步将高排放机组排除于新增容量合同之外，使拍卖向燃气、需求响应与储能开放。'],
          i:['This is the origin of the storage opportunity. The mechanism did not choose batteries; it excluded the incumbent and batteries were the cheapest qualifying new entrant.',
             '这正是储能机会的来源。该机制并未选择电池，而是排除了在位技术，而电池是最便宜的合资格新进入者。'] },
        { y:'2023–2025', t:['Storage becomes the dominant new entrant','储能成为主导性新进入者'],
          p:['Successive auctions contracted multiple gigawatts of battery capacity, making storage the leading new-build technology by contracted volume.',
             '连续几轮拍卖签约了数吉瓦电池容量，使储能按签约量成为领先的新建技术。'],
          i:['Once storage wins an auction at scale, the correction factor becomes the most consequential regulatory number in the market — it decides how much of each battery is paid, and it is revised between vintages.',
             '一旦储能在拍卖中规模化胜出，折减系数即成为市场中最具后果的监管数字 — 它决定每台电池获付费的比例，且在不同年份之间会被修订。'] },
        { y:'2024–2026', t:['Balancing reform and the solar collision','平衡市场改革与光伏冲击'],
          p:['The balancing market moved to 15-minute settlement with a redesigned dispatch and reserve framework, while solar growth pushed negative-price hours to roughly ' + fmtN(O.negHours) + ' a year.',
             '平衡市场转向15分钟结算并重新设计了调度与备用框架，同时光伏增长将负电价小时数推高至每年约' + fmtN(O.negHours) + '小时。'],
          i:['Two things happened at once: the merchant opportunity widened and the historical dataset became unusable. Any Polish backtest spanning the reform is measuring two different markets.',
             '两件事同时发生：市场化机会扩大，而历史数据集变得不可用。任何跨越该改革的波兰回测，实际上在衡量两个不同的市场。'] },
      ] },
      { t:'why', text:['Four changes in under a decade, and the mechanism’s name never changed. That is the base rate to underwrite against: expect the correction-factor table and the auction parameters to be revised between vintages, and expect each revision to favour the technology the system currently needs rather than the one that won last time. Two practical conclusions: record the vintage in every model, and treat the next parameter review as a scheduled event with a P&L consequence.',
        '不到十年内四次变化，而机制名称从未改变。这就是承销时应参照的基准频率：应预期折减系数表与拍卖参数在不同年份之间被修订，且每次修订都会有利于系统当前所需的技术，而非上一次胜出的技术。两项实务结论：在每个模型中记录版本；并将下一次参数审查视为具有损益后果的既定事件。'],
        sig:['Same mechanism, revised every vintage','机制不变，每一版本均被修订'] },
      { t:'g2', cards:[
        { title:['Capacity clearing price path (seed)','容量出清价轨迹（种子）'], badges:['verify'], blocks:[
          { t:'line', cfg:{ xs: M.cmYears, yfmt: v => fmtN(v), h: 200, ymin: 0,
            series:[{ name:['Clearing price (PLN/kW/yr)','出清价（PLN/kW/年）'], color:'var(--s1)', vals: M.cmPriceSeries }] } },
          { t:'why', text:['The seed path declines as more storage and demand response qualify — the ordinary consequence of a mechanism that has successfully attracted new entry. Two underwriting rules follow: model a declining price path rather than the last print, and remember that a ' + O.cmAgreementYears + '-year contract locks in whichever price you won, so the auction you enter determines the majority of lifetime contracted revenue.',
            '随着更多储能与需求响应取得资格，种子路径呈下降态势 — 这是机制成功吸引新进入者的通常后果。由此得出两条承销原则：应按下降的价格路径而非最近一次出清价建模；并须记住' + O.cmAgreementYears + '年合同锁定的是你中标时的价格，因此你参与的那次拍卖决定了终身合同化收入的大部分。'],
            sig:['One auction, seventeen years','一次拍卖，十七年'] },
        ] },
        { title:['Correction factors by duration','按时长的折减系数'], badges:['official'], blocks:[
          { t:'line', cfg:{ xs: M.derateHours.map(x => x + 'h'), yfmt: v => fmtPct(v * 100, 0), ymin: 0, h: 200,
            series:[{ name:['Correction factor','折减系数'], color:'var(--s1)', vals: M.derateHours.map(hh => M.deratingCurve[hh]) }] } },
          { t:'why', text:['The curve rises to 4 hours (' + fmtPct(M.deratingCurve[2] * 100, 1) + ' → ' + fmtPct(M.deratingCurve[4] * 100, 1) + ') and is flat after it (' + fmtPct(M.deratingCurve[6] * 100, 1) + ' at 6h, ' + fmtPct(M.deratingCurve[8] * 100, 1) + ' at 8h). The factor is the same for every duration; what rises is how much of the battery certifies, because certified capacity must be deliverable for four uninterrupted hours. The mechanism is telling you what it wants, four hours of firm energy, and it pays nothing for a fifth.',
            '曲线升至4小时（' + fmtPct(M.deratingCurve[2] * 100, 1) + '→' + fmtPct(M.deratingCurve[4] * 100, 1) + '），其后持平（6小时' + fmtPct(M.deratingCurve[6] * 100, 1) + '，8小时' + fmtPct(M.deratingCurve[8] * 100, 1) + '）。各时长适用同一折减系数；上升的是电池中可获认证的部分，因为认证容量必须能够连续四小时交付。该机制在明确表达其需求：四小时的可靠能量，且对第五小时不付任何费用。'],
            sig:['The mechanism asks for four hours','该机制要求四小时'] },
        ] },
      ] },
      { t:'src', src: SRC.pse, use:['Capacity auction results, contract lengths and contracted volumes','容量拍卖结果、合同期限与签约容量'] },
    ] }
  ]};
}
