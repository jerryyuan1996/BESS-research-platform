/* Authoritative full research history. Extracted verbatim from src/markets/nem/sections/story.js.
   Original facts, interpretations, scope and live data bindings are preserved.
   Public relocation is an editorial draft, not a new content approval. */
export function researchHistory(api){
  const {M,SRC,fmtN,fmt1}=api;
  const O=M.official;
  
  return {head: ['NEM Market Evolution — from a coal-and-interconnector system to the world\'s third-largest battery market',
           'NEM市场演进 — 从煤电与互联线系统到全球第三大储能市场'],
cap: ['This section is the narrative bridge between the Overview and the detailed underwriting tabs. It separates historical facts, observed market outcomes and the forward investment conclusion.',
          '本节连接“总览”与后续承销分析，明确区分历史事实、已观察市场结果及前瞻投资结论。'],
  cards:[
{ t:'card', title:['How the NEM storage case was built — four changes in five years','NEM储能逻辑的形成 — 五年内四次变化'], badges:['official','public'], blocks:[
        { t:'band-story', b:['Why this history is underwriting-relevant','这段历史为何与承销相关'],
          text:['The NEM did not design a storage market; it acquired one from coal retirement, rooftop solar and a Commonwealth underwriting scheme. Each of the four changes below improved the case, and only one of them created a contracted revenue line — which is being wound up in ' + O.cisWindUp + '. That is why the diligence emphasis here is contractual rather than analytical.',
                'NEM并未设计储能市场；它是煤电退役、屋顶光伏与联邦承销计划共同的产物。以下四项变化均改善了投资逻辑，其中只有一项创造了合同化收入线 — 而该机制将于' + O.cisWindUp + '年结束。这正是当地尽调侧重合同而非分析的原因。'] },
        { t:'timeline', items:[
          { y:'2017–2021', t:['Frequency services prove the technology','频率服务验证技术'],
            p:['The first large NEM batteries earned most of their revenue in FCAS, and AEMO introduced very fast raise and lower markets in 2021 as synchronous plant retired and inertia thinned.',
               'NEM首批大型电池的收入主要来自FCAS；随着同步机组退役、惯量下降，AEMO于2021年设立了极快速上调与下调市场。'],
            i:['FCAS proved batteries work and then saturated. It is now under a tenth of the stack, which is why no NEM case should be built on ancillary services.',
               'FCAS验证了电池的可行性，随后趋于饱和。目前其占收入结构不足十分之一 — 这正是任何NEM投资逻辑都不应建立在辅助服务之上的原因。'] },
          { y:'2022–2024', t:['Rooftop and utility solar create the trough','屋顶与大型光伏形成低谷'],
            p:['Negative-price intervals multiplied. In Q2 2026 they reached ' + fmt1(O.negVicQ2Pct) + '% of intervals in Victoria and ' + fmt1(O.negSaQ2Pct) + '% in South Australia — a third consecutive year of intensification, after South Australia hit ' + fmt1(O.negSaQ4Pct) + '% in Q4 2025.',
               '负电价时段成倍增加。2026年第二季度，维多利亚达到' + fmt1(O.negVicQ2Pct) + '%、南澳达到' + fmt1(O.negSaQ2Pct) + '%，为连续第三年加剧；此前南澳在2025年第四季度曾达到' + fmt1(O.negSaQ4Pct) + '%。'],
            i:['This is the arbitrage opportunity in one sentence: solar creates the trough that storage monetises, and it keeps deepening. It is also the reason charging is nearly free and discharging is increasingly crowded.',
               '这是套利机会的一句话概括：光伏创造了储能所变现的低谷，且低谷持续加深。这同时也是充电几乎无成本、而放电日益拥挤的原因。'] },
          { y:'2023–2026', t:['The Capacity Investment Scheme underwrites the build','容量投资计划为建设提供承销'],
            p:['Tender 3 in December 2024 awarded ' + fmtN(O.t3MW) + ' MW and ' + fmtN(O.t3MWh) + ' MWh across ' + O.t3Projects + ' projects, ' + O.t3FourHourProjects + ' of them four-hour, against ' + O.t3Bids + ' bids offering roughly ' + fmtN(O.t3BidMW / 1000) + ' GW. Tender 8 in June 2026 awarded ' + fmtN(O.t8MW) + ' MW and ' + fmtN(O.t8MWh) + ' MWh — the largest storage procurement in the scheme\'s history.',
               '2024年12月的第3轮招标在' + O.t3Projects + '个项目中授予' + fmtN(O.t3MW) + 'MW与' + fmtN(O.t3MWh) + 'MWh，其中' + O.t3FourHourProjects + '个为四小时项目，而投标共' + O.t3Bids + '份、合计约' + fmtN(O.t3BidMW / 1000) + 'GW。2026年6月的第8轮授予' + fmtN(O.t8MW) + 'MW与' + fmtN(O.t8MWh) + 'MWh — 为该计划历史上最大规模的储能采购。'],
            i:['The scheme is why the fleet doubled. It is also why the merchant index collapsed, and it winds up in ' + O.cisWindUp + '. A project that misses Tender 10 has no contracting route until the ESEM commences in ' + O.esemStart + '.',
               '该计划是装机翻倍的原因，也是市场化收入指数崩塌的原因，且它将于' + O.cisWindUp + '年结束。错过第10轮招标的项目，在ESEM于' + O.esemStart + '启动前将没有任何合同路径。'] },
          { y:'2025–2026', t:['The market settings review keeps energy-only','市场设计评估维持单一电能量'],
            p:['The Nelson Review\'s final report of ' + O.reviewDate + ' kept the energy-only model and proposed the Electricity Services Entry Mechanism as the CIS successor: auctions for standardised tradable derivatives — bulk clean energy, shaping, and firming.',
               O.reviewDate + '发布的Nelson评估最终报告保留了单一电能量模式，并提出以电力服务准入机制（ESEM）作为CIS的后继方案：对标准化可交易衍生品进行拍卖 — 批量清洁电力、调形与调峰。'],
            i:['The most useful line for an investor is procedural: the Review recommends the ESEM publish its clearing prices. That recommendation is the clearest confirmation that the CIS does not, and it dates the earliest point at which contracted price discovery becomes possible.',
               '对投资者最有用的一条是程序性的：评估建议ESEM公布其出清价格。该建议最清楚地印证了CIS并不公布价格，并标定了合同价格发现最早可能出现的时点。'] },
        ] },
        { t:'why', text:['Four changes, and only the third created a revenue floor — for the projects that won it, at a level nobody outside the transaction knows. The base rate to underwrite against is therefore: expect the physical case to keep improving and the merchant case to keep compressing, and treat the contracted layer as a competitive procurement with a closing window rather than as a market feature.',
          '四项变化中，只有第三项创造了收入下限 — 且仅限中标项目，其水平交易之外无人知晓。因此承销时应参照的基准判断是：预期物理层面持续改善、市场化层面持续压缩，并将合同层视为一项窗口正在关闭的竞争性采购，而非市场的固有特征。'],
          sig:['The contracted layer is a window, not a feature','合同层是窗口，不是固有特征'] },
        { t:'src', src: SRC.nelson, use:['Retention of the energy-only model and the ESEM successor design','单一电能量模式的保留及ESEM后继方案设计'] },
        { t:'src', src: SRC.cis, use:['Tender volumes, project counts and closing dates','招标容量、项目数量及截标日期'] },
      ] }
  ]};
}
