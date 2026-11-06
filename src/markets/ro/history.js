/* Authoritative full research history. Extracted verbatim from src/markets/ro/sections/story.js.
   Original facts, interpretations, scope and live data bindings are preserved.
   Public relocation is an editorial draft, not a new content approval. */
export function researchHistory(api){
  const {M,SRC,fmtN,fmtCM,fmtPct}=api;
  const O=M.official;
  
  return {head: ['Romania Market Evolution — from a coal-and-hydro system to a solar-driven arbitrage market',
         '罗马尼亚市场演进 — 从煤电与水电系统到光伏驱动的套利市场'],
cap: ['This section is the narrative bridge between the Overview and the detailed underwriting tabs. It separates historical facts, observed market outcomes and the forward investment conclusion.',
        '本节连接“总览”与后续承销分析，明确区分历史事实、已观察市场结果及前瞻投资结论。'],
  cards:[
{ t:'card', title:['How the Romanian storage case was built — four changes in five years','罗马尼亚储能逻辑的形成 — 五年内四次变化'], badges:['official','public'], blocks:[
      { t:'band-story', b:['Why this history is underwriting-relevant','这段历史为何与承销相关'],
        text:['Romania did not design a storage market; it acquired one as a by-product of solar growth, EU market coupling and state-aid availability. Each of the four changes below improved the case, and none of them created a contracted revenue line. That is why the diligence emphasis here is documentary rather than analytical.',
              '罗马尼亚并未设计储能市场；它是光伏增长、欧盟市场耦合与国家援助可得性的副产品。以下四项变化均改善了投资逻辑，但没有一项创造出合同化收入线。这正是当地尽调侧重文件而非分析的原因。'] },
      { t:'timeline', items:[
        { y:'2019–2022', t:['Market coupling and price convergence','市场耦合与价格趋同'],
          p:['Romania coupled to the wider European day-ahead market, which imported both liquidity and volatility. Prices became a European rather than a domestic variable.',
             '罗马尼亚与更广泛的欧洲日前市场耦合，同时引入了流动性与波动性。电价由本国变量变为欧洲变量。'],
          i:['Any Romanian price forecast is now partly a forecast of continental gas and coupling flows, which is why a domestic fundamentals model alone is insufficient.',
             '如今任何罗马尼亚价格预测都部分是对欧陆燃气与耦合潮流的预测，这正是仅靠本国基本面模型不足以支撑判断的原因。'] },
        { y:'2022–2024', t:['Solar build-out creates the midday trough','光伏扩张形成午间低谷'],
          p:['Rapid utility and rooftop solar deployment deepened the midday price trough and steepened the evening ramp. Negative-price intervals appeared and then multiplied.',
             '大型与屋顶光伏快速部署加深了午间价格低谷、抬升了晚间爬坡陡度。负电价时段开始出现并迅速增加。'],
          i:['This is the arbitrage opportunity in one sentence: solar creates the spread that storage monetises, and continued solar growth both widens it and eventually competes it away.',
             '这是套利机会的一句话概括：光伏创造了储能所变现的价差，而光伏的持续增长既扩大该价差，最终也会将其竞争消解。'] },
        { y:'2024–2025', t:['Tariff treatment of stored energy is corrected','储能电量的电价待遇获得纠正'],
          p:['The regulator moved to remove the double-charging of network tariffs on energy that is stored and returned to the grid — a structural cost that had made standalone storage uneconomic on paper.',
             '监管机构着手取消对“储存后再送回电网”电量的网络费双重计费 — 这项结构性成本曾使独立储能在纸面上不具经济性。'],
          i:['A cost removal, not a revenue addition. It is nonetheless the single change that made standalone Romanian storage modellable at all, and it should be verified as implemented in tariff practice rather than assumed from the announcement.',
             '这是成本的移除而非收入的增加。但它仍是使罗马尼亚独立储能首次具备可建模性的关键变化，且应核验其在电价实践中的落地情况，而非仅凭公告推定。'] },
        { y:'2026', t:['State aid and the first financings','国家援助与首批融资'],
          p:['A ' + fmtCM(O.schemeBudgetEurM * 1e6) + ' state-aid scheme for standalone storage was approved, alongside development-bank-supported project financings that established a bankability precedent.',
             '一项' + fmtCM(O.schemeBudgetEurM * 1e6) + '的独立储能国家援助计划获批，同时开发性银行支持的项目融资确立了可融资性先例。'],
          i:['The scheme reduces capital at risk and the financings prove lenders will lend. Neither creates a contracted revenue line, so gearing remains lower than in a capacity-market jurisdiction for the same asset.',
             '该计划降低风险资本，融资案例证明贷款人愿意放贷。但两者均未创造合同化收入线，因此对同一资产而言，杠杆水平仍低于设有容量市场的司法辖区。'] },
      ] },
      { t:'why', text:['Four changes, all favourable, none of them contractual. Romania has removed cost barriers and added capital support without ever creating a revenue floor — which is a coherent policy choice for an energy-only market but leaves the entire revenue risk with the investor. The base rate to underwrite against is therefore: expect the policy environment to keep improving on cost and capital, and do not expect it to improve on revenue certainty.',
        '四项变化均属有利，但没有一项属于合同性质。罗马尼亚移除了成本障碍并增加了资本支持，却始终未创造收入下限 — 对单一电能量市场而言这是自洽的政策选择，但全部收入风险留给了投资人。因此承销时应参照的基准判断是：预期政策环境在成本与资本层面持续改善，但不应预期其在收入确定性上有所改善。'],
        sig:['Cost and capital improve; revenue risk does not','成本与资本改善，收入风险不变'] },
      { t:'g2', cards:[
        { title:['Day-ahead and intraday price path','日前与日内价格轨迹'], badges:['official','illus'], blocks:[
          { t:'line', cfg:{ xs: M.pxLabels, yfmt: v => fmtN(v), h: 220, ymin: 0,
            series:[
              { name:['DAM (RON/MWh)','日前市场（RON/MWh）'], color:'var(--s1)', vals: M.damSeries },
              { name:['IDM (RON/MWh)','日内市场（RON/MWh）'], color:'var(--s3)', vals: M.idmSeries, dash: true },
            ] } },
          { t:'why', text:['Only the 2025 annual weighted averages and the June 2026 monthly figure are official anchors; the intra-year shape is an illustrative seed. What is real is the persistent discount of intraday to day-ahead, which is roughly ' + fmtPct((1 - O.idm2025Wap / O.dam2025Wap) * 100, 0) + '% on the 2025 averages — that discount is the cost of correcting a position late, and it belongs in the executable-spread bridge rather than in an upside case.',
            '只有2025年年度加权均价与2026年6月的月度数值是官方锚点；年内形态为示例种子。真实存在的是日内相对日前的持续折价，按2025年均值约为' + fmtPct((1 - O.idm2025Wap / O.dam2025Wap) * 100, 0) + ' — 该折价是事后修正头寸的成本，应计入可执行价差桥，而非计入上行情景。'],
            sig:['Intraday discount is a cost, not an upside','日内折价是成本，而非上行'] },
        ] },
        { title:['Negative-price and high-price intervals','负电价与高电价时段'], badges:['illus'], blocks:[
          { t:'bar', cfg:{ xs: M.qLabels, mode:'group', bw: 20, yfmt: v => fmtN(v) + ' h', h: 220,
            series:[
              { name:['Negative-price intervals','负电价时段'], color:'var(--s6)', vals: M.negHoursSeries },
              { name:['Intervals above 1,000 RON/MWh','高于1,000 RON/MWh的时段'], color:'var(--s3)', vals: M.highHoursSeries },
            ] } },
          { t:'why', text:['The two series are the storage business model drawn as a chart: negative intervals are when the asset is paid to charge, high intervals are when it is paid to discharge. Both are growing, which widens the spread today. But negative intervals are growing faster, and that asymmetry is the signal that solar saturation is arriving ahead of storage — good for a 2027 COD, progressively less good after.',
            '这两条序列就是储能商业模式的图形表达：负电价时段是资产因充电而获付费之时，高电价时段是其因放电而获付费之时。两者均在增长，当下扩大了价差。但负电价时段增长更快，这一不对称正是光伏饱和先于储能到来的信号 — 对2027年投运有利，其后逐步减弱。'],
            sig:['Negative hours are growing faster','负电价小时数增长更快'] },
        ] },
      ] },
      { t:'src', src: SRC.opcom, use:['Annual and monthly weighted-average prices and traded volumes','年度与月度加权均价及成交量'] },
    ] }
  ]};
}
