// ============================== NEM MARKET STORY ==============================
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, M, SRC, state, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct } = api;
  const { O, kMW, regionById } = createShared(api);

  return function (){
    return {
    head: ['NEM Market Evolution — from a coal-and-interconnector system to the world\'s third-largest battery market',
           'NEM市场演进 — 从煤电与互联线系统到全球第三大储能市场'],
    cap: ['This section is the narrative bridge between the Overview and the detailed underwriting tabs. It separates historical facts, observed market outcomes and the forward investment conclusion.',
          '本节连接“总览”与后续承销分析，明确区分历史事实、已观察市场结果及前瞻投资结论。'],
    blocks: [
      { t:'card', mt:false, title:['One-minute orientation for a new institutional investor','机构投资人的一分钟市场定位'], badges:['official','public'], live:false, blocks:[
        { t:'kpis', items:[
          { l:['Market design','市场设计'], v:L(['Energy-only','单一电能量']), d:['no capacity mechanism; five regions, five-minute dispatch and settlement','无容量机制；五个区域，五分钟调度与结算'], b:['official'] },
          { l:['Reference region','参考区域'], v:'NSW1', d:['largest fleet — ' + fmtN(regionById('NSW1').mwh) + ' MWh of a NEM total near ' + fmtN(O.fleetMWh) + ' MWh','装机最大 — 在全NEM约' + fmtN(O.fleetMWh) + 'MWh中占' + fmtN(regionById('NSW1').mwh) + 'MWh'], b:['official'] },
          { l:['Installed battery power','储能装机功率'], v:fmtN(O.installedMW) + '<small> MW</small>', d:['passed 9 GW in Q2 2026; ' + fmtN(O.addedMW) + ' MW began commissioning in twelve months','2026年第二季度突破9GW；十二个月内' + fmtN(O.addedMW) + 'MW开始调试'], b:['official'] },
          { l:['Connection pipeline','并网管线'], v:fmtN(O.queueGW) + '<small> GW</small>', d:['up from ' + fmtN(O.queue2022GW) + ' GW in September 2022','由2022年9月的' + fmtN(O.queue2022GW) + 'GW增长而来'], b:['official'] },
          { l:['2025 financial close','2025年融资交割'], v:fmt1(O.fc2025GW) + '<small> GW</small>', d:[fmtCM(O.fc2025Abn * 1e9) + ', up ' + O.fc2025GrowthPct + '% on 2024',fmtCM(O.fc2025Abn * 1e9) + '，较2024年增长' + O.fc2025GrowthPct + '%'], b:['public'] },
          { l:['Cumulative investment 2017–2025','2017–2025年累计投资'], v:fmtCM(O.cumInvestAbn * 1e9), d:['across ' + fmt1(O.cumInvestGW) + ' GW — third-largest utility-scale battery market after the US and China','覆盖' + fmt1(O.cumInvestGW) + 'GW — 仅次于美国与中国的全球第三大公用事业级储能市场'], b:['public'] },
        ] },
        { t:'reco', b:['Institutional conclusion: ','机构投资结论：'],
          text:['The NEM offers the deepest delivery capability in the comparison set and the thinnest contracted revenue. Everything about building here works — supply chains, contractors, financing, grid-forming inverters on ' + O.gridFormingPct + '% of the pipeline. What does not work is being paid for it on a merchant basis at current spreads. The winning project is the one that secures a CIS agreement or a virtual toll and a connection point with a defensible loss factor, not the one with the best price forecast.',
                'NEM在本对比样本中拥有最强的交付能力与最薄的合同化收入。这里与“建设”相关的一切都运转良好 — 供应链、承包商、融资，管线中' + O.gridFormingPct + '%配置构网型逆变器。运转不良的是：按当前价差、以市场化方式获得报酬。优质项目是那些取得CIS协议或虚拟租赁、并拥有损耗系数可辩护的并网点的项目，而非价格预测最好的项目。'] },
        { t:'why', text:['Two facts do the work. The connection pipeline has gone from ' + fmtN(O.queue2022GW) + ' GW in September 2022 to ' + fmtN(O.queueGW) + ' GW, which already exceeds the ' + fmtN(O.ispStorage2030GW) + ' GW of grid-scale storage AEMO\'s 2026 ISP requires by 2030. And the NEM-wide charge/discharge spread fell ' + O.q2SpreadFallPct + '% year on year in Q2 2026 to ' + fmtC(O.q2SpreadAud) + '/MWh. Those two facts are the same fact: the pipeline that proves the market works is the pipeline that is competing away the reason to build.',
          '此处两项事实最为关键。并网管线已由2022年9月的' + fmtN(O.queue2022GW) + 'GW增至' + fmtN(O.queueGW) + 'GW，超过AEMO 2026年ISP要求的2030年前' + fmtN(O.ispStorage2030GW) + 'GW电网级储能。同时，2026年第二季度全NEM充放电价差同比下跌' + O.q2SpreadFallPct + '%至' + fmtC(O.q2SpreadAud) + '/MWh。这两项事实其实是同一项：证明市场有效的管线，正是竞争消解建设理由的那条管线。'],
          sig:['The pipeline that proves the market erodes it','证明市场的管线正在侵蚀市场'] },
      ] },

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
      ] },

      { t:'g2', cards:[
        { title:['Fleet growth and revenue collapse, side by side','装机增长与收入崩塌的并列对照'], badges:['official','tp'], blocks:[
          { t:'bar', cfg:{ xs: M.idxLabels, bw: 40, rotX: true, yfmt: v => kMW(v), labels: true, h: 250,
            series:[{ name:['BESS revenue index (A$k/MW/yr)','储能收入指数（A$千/MW/年）'], color:'var(--s1)', vals: M.idxSeriesK }] } },
          { t:'why', text:['The index rose ' + fmtPct((O.idx2024K / O.idx2023K - 1) * 100, 0) + '% into 2024 and has fallen every period since, to ' + kMW(O.idxOctMarK) + '/MW/yr over October 2025 to March 2026 — the weakest such window since the index launched in July 2022. The four bars are a complete argument on their own: nothing about the technology, the sites or the operators changed. The fleet doubled.',
            '该指数在2024年上升' + fmtPct((O.idx2024K / O.idx2023K - 1) * 100, 0) + '%，此后每个区间均下降，至2025年10月—2026年3月的' + kMW(O.idxOctMarK) + '/MW/年 — 为该指数2022年7月推出以来最弱的同期区间。这四根柱子本身即构成完整论证：技术、场址与运营方均未改变，改变的是装机翻倍。'],
            sig:['Nothing changed except the number of competitors','除竞争者数量外一切未变'] },
        ] },
        { title:['Monthly path through 2026','2026年月度轨迹'], badges:['tp','illus'], blocks:[
          { t:'line', cfg:{ xs: M.monLabels, yfmt: v => kMW(v), h: 250, ymin: 0,
            series:[{ name:['BESS revenue index (A$k/MW/yr)','储能收入指数（A$千/MW/年）'], color:'var(--s6)', vals: M.monSeriesK }] } },
          { t:'note', text:['January, February, May and June are published points. March was reported as a record low at the time and April is an interpolation between its sourced neighbours; both are illustrative and should not be quoted.',
            '1月、2月、5月与6月为已公布数据点。3月在当时被报告为历史新低，4月为其两侧已知数据点之间的插值；两者均属示例值，不应引用。'] },
          { t:'why', text:['January reached ' + kMW(O.monJanK) + '/MW/yr on a heatwave and February fell to ' + kMW(O.monFebK) + ' — a ' + fmtPct((1 - O.monFebK / O.monJanK) * 100, 0) + '% fall in one month with the same fleet and the same assets. May then set a record low of ' + kMW(O.monMayK) + '. That volatility is the honest characterisation of NEM merchant revenue: not a level with noise around it, but a distribution whose realised annual outcome has moved five-fold in two years. A single-point merchant assumption is the wrong shape of assumption for this market.',
            '1月因热浪达到' + kMW(O.monJanK) + '/MW/年，2月降至' + kMW(O.monFebK) + ' — 在装机与资产完全相同的情况下，单月下跌' + fmtPct((1 - O.monFebK / O.monJanK) * 100, 0) + '%。随后5月创下' + kMW(O.monMayK) + '的历史新低。这种波动才是对NEM市场化收入的诚实刻画：它不是一个带噪声的水平值，而是一个实际年度结果在两年内变动达五倍的分布。对这个市场而言，单点市场化假设在形式上就是错误的。'],
            sig:['A distribution, not a level','这是分布，不是水平值'] },
        ] },
      ] },

      { t:'card', title:['Who is building NEM storage — four strategies, one binding question','谁在建设NEM储能 — 四类策略，一个关键问题'], badges:['public','illus'], live:false, blocks:[
        { t:'players', items:[
          { type:['Gentailer / incumbent','综合发售电企业与在位者'], n:['Vertically integrated generator-retailers','纵向一体化的发电兼售电企业'], met:'internal hedge',
            p:['A battery is a hedge against their own retail book, so it is valued against the cost of buying caps rather than against merchant revenue. That is a genuinely different and usually higher valuation.',
               '电池是对其自身零售头寸的对冲，因此其估值参照购买价格上限合约的成本，而非市场化收入。这确实是另一套估值口径，且通常更高。'] },
          { type:['Pure-play developer with a toll','签订租赁的纯开发商'], n:['Developers who sell the optionality to an offtaker','将调度选择权出售给承购方的开发商'], met:'15-yr precedent',
            p:['Snowy Hydro and Akaysha contracted 15 years over 220 MW of the 311 MW Elaine BESS in September 2025, the largest four-hour virtual toll in the market. The tenor is disclosed; the price never is.',
               'Snowy Hydro与Akaysha于2025年9月就311MW的Elaine储能中的220MW签订15年合约，为市场上最大的四小时虚拟租赁。期限已披露，价格从未披露。'] },
          { type:['CIS-underwritten platform','由CIS承销的平台'], n:['Winners of Commonwealth tender rounds','联邦招标轮次的中标方'], met:'collar',
            p:['A CIS agreement converts the distribution rather than the mean. It is the only route to conventional project debt for a merchant NEM asset — and only ' + O.preT3FidPct + '% of battery capacity awarded before Tender 3 had reached FID at that time.',
               'CIS协议改变的是分布而非均值。它是市场化NEM资产取得常规项目融资的唯一途径 — 而在第3轮之前中标的储能容量中，当时仅有' + O.preT3FidPct + '%达到最终投资决策。'] },
          { type:['International infrastructure capital','国际基础设施资本'], n:['Funds entering through platform acquisition','通过收购平台进入的基金'], met:'A$' + fmt1(O.cumInvestAbn) + 'bn since 2017',
            p:['They buy delivery capability and a queue position rather than a price view. The scarce input is a connection point with a defensible loss factor, not capital — capital is abundant here.',
               '他们购买的是交付能力与排队位置，而非价格判断。稀缺要素是损耗系数可辩护的并网点，而非资本 — 此地资本充裕。'] },
        ] },
        { t:'note', text:['Concentration read: the NEM is fragmented on ownership and concentrated on offtake. The buyers capable of writing a fifteen-year virtual toll are a short list of gentailers and one state-owned generator, which is why toll pricing is a negotiation with very few counterparties rather than a market.',
          '集中度解读：NEM在所有权上分散，在购电上集中。有能力签署十五年虚拟租赁的买方仅限少数综合发售电企业与一家国有发电企业，这正是租赁定价属于对手方极少的谈判、而非市场行为的原因。'] },
        { t:'why', text:['For a new entrant this determines strategy before it determines price. A merchant NEM asset can be built by anyone and sold to almost nobody at an infrastructure multiple; a tolled or CIS-backed asset has a conventional buyer universe. Decide which one you are building on the day you decide to build, because the toll counterparty list is short and the CIS window closes in ' + O.cisWindUp + '.',
          '对新进入者而言，这一点在决定价格之前先决定策略。市场化的NEM资产人人可建，却几乎无人愿按基础设施估值倍数购买；而有租赁或CIS支持的资产则拥有常规买家群体。应在决定建设的当天即决定建哪一种 — 因为租赁对手方名单很短，而CIS窗口将于' + O.cisWindUp + '年关闭。'],
          sig:['Decide the offtake before the site','先定购电，再定场址'] },
      ] },

      { t:'g2', cards:[
        { title:['Near-term outlook — 2026 to 2029: the contracting window closes','近期展望 — 2026至2029：合同窗口关闭'], badges:['official','forecast'], blocks:[
          { t:'phases', items:[
            { yr:['2026','2026'], h:['The last dispatchable tender','最后一轮可调度电源招标'], p:['Tender 10 seeks ' + fmtN(O.t10MW / 1000) + ' GW and ' + fmtN(O.t10MWh / 1000) + ' GWh with bids closing ' + O.t10Close + ', reported to be the final dispatchable round before the scheme winds up.','第10轮招标寻求' + fmtN(O.t10MW / 1000) + 'GW与' + fmtN(O.t10MWh / 1000) + 'GWh，' + O.t10Close + '截标，据报为该计划结束前最后一轮可调度电源招标。'] },
            { yr:['2027','2027'], h:['CIS winds up, ESEM commences','CIS结束，ESEM启动'], p:['The ESEM draft legislation was released on ' + O.esemDraftDate + ' and its first procurement round is indicatively ' + O.esemStart + ', auctioning standardised derivatives — bulk clean energy, shaping and firming — with clearing prices recommended for publication.','ESEM立法草案已于2026年9月14日发布，首轮采购暂定于2027年底，拍卖标准化衍生品 — 批量清洁电力、调形与调峰 — 并被建议公布出清价格。'] },
            { yr:['2028–2029','2028–2029'], h:['Delivery and compression together','交付与压缩同时发生'], p:['The CIS cohort connects into the spread it was underwritten against. The central captured spread falls from ' + fmtC(M.codCases[2028].central) + ' to ' + fmtC(M.codCases[2030].central) + '/MWh across the COD window.','CIS批次的项目将并入其当初据以承销的价差之中。在整个投运窗口内，中性情景捕获价差由' + fmtC(M.codCases[2028].central) + '降至' + fmtC(M.codCases[2030].central) + '/MWh。'] },
          ] },
          { t:'why', text:['The central case loses ' + fmtPct((1 - M.codCases[2030].central / M.codCases[2028].central) * 100, 0) + '% of captured spread between a 2028 and a 2030 COD, and unlike Romania the cause is not speculative — the megawatts that will compress it have already been awarded and named. What a sponsor controls is not the timing of the compression but whether a contract sits underneath it, and the last competitive opportunity to secure one closes ' + O.t10Close + '.',
            '中性情景下，2028年与2030年投运之间捕获价差损失' + fmtPct((1 - M.codCases[2030].central / M.codCases[2028].central) * 100, 0) + '%；与罗马尼亚不同，此处成因并非推测 — 将造成压缩的兆瓦已经中标并具名。发起人能控制的不是压缩的时点，而是其下方是否有一份合同；而争取合同的最后一次竞争性机会将于' + O.t10Close + '关闭。'],
            sig:['The compressing megawatts are already named','造成压缩的兆瓦已经具名'] },
        ] },
        { title:['Long-term outlook — 2030 to 2035: coal exit and the second window','长期展望 — 2030至2035：煤电退出与第二个窗口'], badges:['official','forecast'], blocks:[
          { t:'phases', items:[
            { yr:['2030','2030'], h:['ISP requirement met early','ISP需求提前达成'], p:['AEMO\'s 2026 ISP requires ' + fmtN(O.ispStorage2030GW) + ' GW of grid-scale storage by 2030. The connection queue already holds ' + fmtN(O.queueGW) + ' GW, which is why spreads are compressing before the requirement date.','AEMO 2026年ISP要求2030年前建成' + fmtN(O.ispStorage2030GW) + 'GW电网级储能。并网排队量已达' + fmtN(O.queueGW) + 'GW — 这正是价差在需求时点之前即已压缩的原因。'] },
            { yr:['2030–2033','2030–2033'], h:['Coal retirement steepens the ramp','煤电退役抬升爬坡陡度'], p:['Removing large synchronous units removes the flexibility that currently caps evening prices, re-widening the spread that new storage compressed.','大型同步机组退出，移除了当前压制晚间电价的灵活性，使新增储能所压缩的价差重新扩大。'] },
            { yr:['2033–2035','2033–2035'], h:['Long duration and augmentation','长时储能与增容'], p:['The ISP\'s ' + fmtN(O.ispStorage2050GW) + ' GW by 2050 splits roughly ' + fmtN(O.ispShortMedGW) + ' GW short and medium duration against ' + fmtN(O.ispLongGW) + ' GW long duration, and GenCost puts 24-hour storage at ' + fmtC(O.gencost24h) + '/kWh — below the four-hour point.','ISP要求2050年建成' + fmtN(O.ispStorage2050GW) + 'GW，大致划分为' + fmtN(O.ispShortMedGW) + 'GW中短时与' + fmtN(O.ispLongGW) + 'GW长时；GenCost显示24小时储能成本为' + fmtC(O.gencost24h) + '/kWh，低于四小时的单位成本。'] },
          ] },
          { t:'why', text:['The long-run case is a second window rather than a trend, and the GenCost cost curve is the part most often missed: at ' + fmtC(O.gencost24h) + '/kWh, twenty-four-hour storage is cheaper per kilowatt-hour than four-hour storage, because the power equipment is amortised over far more energy. A four-hour asset built for the first window competes in the second against a technology whose unit economics improve with the very duration the market will then be short of.',
            '长期逻辑是第二个窗口而非趋势，而GenCost的成本曲线是最常被忽略的部分：按' + fmtC(O.gencost24h) + '/kWh计，二十四小时储能的单位电量成本低于四小时储能，因为功率设备被摊薄到远多的电量之上。为第一个窗口建设的四小时资产，在第二个窗口中所面对的竞争技术，其单位经济性恰恰随市场届时最短缺的那种时长而改善。'],
            sig:['Long duration gets cheaper per kWh, not dearer','长时储能的单位电量成本更低，而非更高'] },
        ] },
      ] },

      { t:'card', title:['What breaks this storyline — three monitored uncertainties','哪些因素会打破该叙事 — 三项须持续监测的不确定性'], badges:['public','calc'], blocks:[
        { t:'table', head:[['Uncertainty','不确定性'],['Why it matters','影响机理'],['Monitoring trigger','监测触发条件']], rows:[
          [{b:['ESEM design and whether it prices firming for storage','ESEM设计及其是否为储能的调峰能力定价']},
           ['The CIS winds up in ' + O.cisWindUp + '. If the ESEM\'s firming product does not suit a four-hour battery, the NEM has no contracting route for new storage at all.','CIS将于' + O.cisWindUp + '年结束。若ESEM的调峰产品不适配四小时电池，NEM将完全没有新增储能的合同路径。'],
           ['Publication of ESEM product specifications and the pilot auction result','ESEM产品规格的发布及试点拍卖结果']],
          [{b:['Pace of connection of the awarded pipeline','已中标管线的并网节奏']},
           ['Only ' + O.preT3FidPct + '% of pre-Tender-3 CISA battery capacity had reached FID at that time. Slower delivery extends the spread window; faster delivery closes it.','第3轮之前取得CIS协议的储能容量中，当时仅有' + O.preT3FidPct + '%达到最终投资决策。交付更慢则延长价差窗口，更快则关闭窗口。'],
           ['Quarterly MW and MWh entering commissioning in AEMO\'s quarterly','AEMO季度报告中进入调试的季度MW与MWh']],
          [{b:['Marginal loss factors at the connection point','并网点的边际损耗系数']},
           ['Republished every ' + O.mlfResetDate + '. A permanent multiplier on every megawatt-hour, averaging ' + fmtCk(O.mlfCostPerMW) + '/MW/yr but ' + O.mlfMultipleLo + '–' + O.mlfMultipleHi + '× that for some assets.','每年' + O.mlfResetDate + '重新公布。它是作用于每一兆瓦时的永久性乘数，平均约' + fmtCk(O.mlfCostPerMW) + '/MW/年，但部分资产为该水平的' + O.mlfMultipleLo + '–' + O.mlfMultipleHi + '倍。'],
           ['AEMO\'s annual loss-factor publication and its draft for the coming year','AEMO年度损耗系数公布及下一年度初稿']],
        ] },
        { t:'why', text:['Only the third is diversifiable, and only by site selection. The first two are single points of failure for the whole market: if the ESEM does not price storage firming well, every NEM battery reaching COD after ' + O.cisWindUp + ' is a merchant asset by default, in a market whose merchant index has fallen every period since 2024. That is the argument for securing a contract now rather than waiting for a better one.',
          '三者中只有第三项可分散，且只能通过选址分散。前两项是整个市场的单点失效来源：若ESEM未能妥善为储能调峰定价，则所有在' + O.cisWindUp + '年后投运的NEM电池将默认成为市场化资产 — 而该市场的市场化收入指数自2024年起每个区间均在下降。这正是“现在就锁定合同、而非等待更好合同”的理由。'],
          sig:['Two of the three are market-wide, not project-specific','三者中有两项属全市场而非项目层面'] },
      ] },

      { t:'card', title:['Bridge to the detailed dashboard — the investor\'s question map','进入详细看板 — 投资人的问题地图'], badges:['calc'], blocks:[
        { t:'walk', items:[
          ['03', ['Capacity Investment Scheme','容量投资计划'], ['What does the Commonwealth actually underwrite?','联邦政府究竟承销什么？'], 'capacity'],
          ['04', ['Spot & Cap Contracts','现货与价格上限合约'], ['How much of the spread is executable?','价差中有多少可执行？'], 'energy'],
          ['05', ['FCAS','频率控制辅助服务'], ['Is there anything left in ancillary services?','辅助服务还剩下什么？'], 'services'],
          ['06', ['Storage Duration','储能时长'], ['What does the fourth hour actually earn?','第四小时究竟赚多少？'], 'duration'],
          ['07', ['Project Pipeline','项目管线'], ['Who else arrives in my COD year?','投运年度还有谁会到场？'], 'pipeline'],
          ['08', ['Grid, MLF & Congestion','并网、边际损耗与拥塞'], ['What does this connection point cost me every year?','这个并网点每年让我损失多少？'], 'grid'],
        ] },
      ] },
    ] };
  };
}
