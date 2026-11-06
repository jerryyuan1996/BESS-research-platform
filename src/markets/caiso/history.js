/* Authoritative full research history. Extracted verbatim from src/markets/caiso/sections.js.
   Original facts, interpretations, scope and live data bindings are preserved.
   Public relocation is an editorial draft, not a new content approval. */
export function researchHistory(api){
  const {M,SRC}=api;
  const O=M.official;
  
  return {head: ['CAISO Market Story — the duck curve became a business model',
         'CAISO市场演进 — 鸭形曲线成为一门生意'],
cap: ['California built the deepest midday trough in the developed world and then built the fleet to trade it. What is scarce now is not the opportunity but the connection.',
        '加州创造了发达世界最深的午间低谷，随后建成了交易该低谷的机组群。如今稀缺的不是机会，而是并网。'],
  cards:[
{ t:'card', mt:false, title:['How the market got here','市场如何演变至此'], badges:['official'], blocks:[
      { t:'timeline', items:[
        { y:'2010s', t:['The duck curve','鸭形曲线'],
          p:['Utility-scale and behind-the-meter solar drove midday prices toward and through zero while the evening ramp steepened. The shape that made storage necessary was created by policy rather than by weather.',
             '公用事业级与用户侧光伏使午间价格趋近并跌破零，同时晚间爬坡愈发陡峭。使储能成为必需的这一形态，源于政策而非天气。'],
          i:['The arbitrage opportunity was manufactured, and it is durable because the solar is not going away.','套利机会是被创造出来的，且具有持续性 — 因为光伏不会消失。'] },
        { y:'2020–2024', t:['The fleet arrives','机组大规模到位'],
          p:['Battery capacity reached ' + O.fleet2024GW + ' GW in 2024 after growing ' + O.fleet2024GrowthPct + '% in a single year, and approached ' + O.fleet2026GW + ' GW by early 2026 — one of the two largest fleets in the United States alongside ERCOT.',
             '储能装机在单年增长' + O.fleet2024GrowthPct + '%后于2024年达到' + O.fleet2024GW + 'GW，并于2026年初接近' + O.fleet2026GW + 'GW — 与ERCOT并列为美国两大机组群之一。'],
          i:['Merchant spreads compressed as the fleet grew, exactly as they did in Texas.','随着机组规模扩大，市场化价差被压缩 — 与德州的情形完全一致。'] },
        { y:'2025', t:['Slice of Day','分时段机制'],
          p:['The CPUC redefined Resource Adequacy obligations across ' + O.sodSlices + ' hourly slices, with a storage excess-capacity test ensuring batteries can actually be charged over the critical net-peak hours.',
             'CPUC将容量充裕度义务按' + O.sodSlices + '个小时时段重新定义，并设有储能富余容量测试，以确保电池在关键净峰时段确实能够完成充电。'],
          i:['A framework that credits storage for when it can deliver, not merely for existing.','该框架按储能实际可供电的时段给予信用，而非仅因其存在即予计入。'] },
        { y:'2026', t:['The constraint moves to the queue','约束转移至排队环节'],
          p:['Roughly ' + O.queueTotalGW + ' GW of generation and storage sits in the interconnection queue, batteries about ' + O.queueBatterySharePct + '% of it. Interconnection has overtaken technology cost as the binding constraint on deployment.',
             '并网排队中的发电与储能项目约' + O.queueTotalGW + 'GW，其中储能约占' + O.queueBatterySharePct + '%。并网已取代技术成本成为建设的约束性瓶颈。'],
          i:['The revenue question is largely settled here. The access question is not.','此处的收入问题大体已定，而准入问题尚未解决。'] },
      ] },
      { t:'why', text:['CAISO and ERCOT ran the same experiment from opposite ends and it is worth seeing them together. Both built large battery fleets — 16.7 GW in CAISO and about 15 GW in ERCOT. Texas did it by making connection almost free and fast, and lost the merchant margin as a result. California did it against a queue that has become the binding constraint, and kept a contracted revenue line worth several times the Texan merchant one. Neither outcome is an accident of policy — each is the direct consequence of what its market chose to make scarce.',
        'CAISO与ERCOT从相反的两端进行了同一场实验，值得对照观察。CAISO已建成16.7GW储能，ERCOT约15GW。德州的做法是使并网几乎免费且迅速，其结果是失去了市场化margin。加州则是在排队已成为约束性瓶颈的情况下完成建设，并保有了价值数倍于德州市场化收入的合同化收入。两种结果都非政策的偶然产物 — 而是各自市场选择使何种要素稀缺所带来的直接后果。'],
        sig:['Large fleets, opposite scarcity, opposite outcome','大规模机组，相反的稀缺性，相反的结果'] },
      { t:'src', src:SRC.fleet, use:['Fleet growth and the queue composition','机组增长与排队构成'] },
    ] }
  ]};
}
