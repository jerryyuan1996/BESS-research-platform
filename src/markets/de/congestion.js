/* ---------------------------------------------------------------------------
   Germany — congestion register.

   Germany spends more on congestion than any market on this platform and gives a
   battery the least direct way to reach it.

   THE BILL. Congestion management cost about €3.1bn in 2025, up 4% on 2024:
   conventional redispatch above €1.2bn, reserve power plants €1.4bn,
   countertrading €102m and renewable curtailment compensation €433m. Downward
   redispatch ran 15.5 TWh, and PV curtailment nearly doubled to 2.7 TWh.

   THE CATCH, AND IT IS A DECISION RATHER THAN A CONSTRAINT. ENTSO-E's April 2025
   bidding zone review found that every German split configuration would raise
   economic efficiency — by €251m to €339m for the 2025 target year, with a
   five-zone split performing best. Germany formally rejected the split in
   October 2025 and confirmed it that December, publishing a grid action plan
   instead. So Germany remains ONE bidding zone. Its €3.1bn of congestion is
   socialised through redispatch and never appears as a locational price a
   battery could trade against.

   That puts Germany alongside Great Britain — deep congestion, no zonal signal —
   with one difference that matters. GB congestion is reachable through the
   Balancing Mechanism. In Germany, redispatch compensation reaches the curtailed
   GENERATOR; whether and on what basis storage is compensated for relieving a
   constraint could not be verified from public sources, which is why the capture
   text below says so rather than assuming it.

   WHAT DOES REACH THE BATTERY is the grid fee exemption to 4 August 2029 — an
   avoided cost rather than a payment — and the cheap charging that curtailment
   creates. Both are already inside the merchant seed.
   --------------------------------------------------------------------------- */
import { CAPTURE, RELIEF_STATUS } from '../../governance/congestion.js';

const URL = {
  bnetza: 'https://www.bundesnetzagentur.de/EN/Areas/Energy/Companies/GridDevelopment/start.html',
  suedlink: 'https://www.tennet.eu/de/projekte/suedlink',
  suedostlink: 'https://www.bundesnetzagentur.de/SharedDocs/Pressemitteilungen/EN/2025/20250725_SOL.html',
  ultranet: 'https://www.bundesnetzagentur.de/SharedDocs/Pressemitteilungen/EN/2025/20251031_Ultranet.html',
  biddingZone: 'https://www.entsoe.eu/news/2025/04/28/bidding-zone-study-released/',
};

export const DE_CONGESTION = {
  marketId: 'de',
  summary: [
    'The largest congestion bill on the platform — about €3.1bn in 2025 — inside a single bidding zone Germany chose to keep. ENTSO-E found every split configuration more efficient, worth €251–339m; Germany rejected it in December 2025. So the congestion is socialised through redispatch and never becomes a locational price a battery can trade.',
    '本平台最高的拥塞成本 — 2025年约31亿欧元 — 且处于德国主动保留的单一报价区之内。ENTSO-E研究显示任何拆分方案都更具经济效率，价值达2.51–3.39亿欧元；德国已于2025年12月否决。因此拥塞成本通过再调度社会化分摊，从未转化为电池可交易的区位价格。',
  ],
  gateNote: [
    'The Bundesnetzagentur publishes congestion volumes and costs; it does not publish what storage earns from relieving them. Whether BESS is compensated under Redispatch 2.0, and on what basis, could not be verified from public sources — gate G14.',
    '联邦网络管理局公布拥塞电量与成本，但不公布储能因缓解拥塞所获收入。储能是否以及以何种口径在Redispatch 2.0机制下获得补偿，无法通过公开来源核实 — 研究缺口G14。',
  ],

  zones: [
    {
      id: 'de-north-south',
      bearsOn: 'merchGross',
      name: ['North–south transfer constraint', '南北输电约束'],
      shape: 'interface',
      coords: [[9.13, 53.90], [10.50, 52.50], [10.19, 49.98]],
      direction: 'export',
      intensity: 1.0,
      metrics: [
        { label: ['Congestion management cost', '拥塞管理成本'],
          value: ['≈€3.1bn, +4% year on year', '约31亿欧元，同比增长4%'], period: ['2025', '2025年'] },
        { label: ['Downward redispatch volume', '下调再调度电量'],
          value: ['15.5 TWh', '15.5太瓦时'], period: ['2025', '2025年'] },
      ],
      capture: {
        mechanism: CAPTURE.REGULATED_COMPENSATION,
        text: [
          'Redispatch 2.0 compensates the curtailed generator, and German optimiser stacks list redispatch as the fifth daily gate closure — but whether storage is compensated for relieving a constraint, and on what basis, is not published. Treat the payment as unverified and the charging opportunity as the part that is real.',
          'Redispatch 2.0机制向被限电的发电方提供补偿，德国优化商的交易序列也将再调度列为每日第五个关闸时点 — 但储能因缓解约束是否获得补偿、以何种口径补偿，均未公开。应将补偿视为未经核实，而将充电机会视为真实可得的部分。',
        ],
      },
      relief: {
        project: ['SuedLink', 'SuedLink输电工程'],
        operator: 'TenneT / TransnetBW',
        scope: ['About 4 GW over roughly 700 km of HVDC, Brunsbüttel and Wilster to Grafenrheinfeld; first underground cable section completed 2026',
                '约4GW、约700公里高压直流线路，自Brunsbüttel与Wilster至Grafenrheinfeld；首段地下电缆已于2026年完工'],
        expected: 2028,
        status: RELIEF_STATUS.UNDER_CONSTRUCTION,
      },
      investor: [
        'Four HVDC corridors carrying roughly 10 GW land between end-2026 and end-2028: Ultranet 2 GW, A-Nord about 2 GW, SuedOstLink 2 GW and SuedLink about 4 GW. All four are reported as running late, which is the only reason a German congestion thesis has a runway at all. Underwrite the named corridor your constraint depends on, not the programme — and note that a delay which extends the opportunity is the same delay that raises the consumer bill, so it is not a risk anyone is working to preserve.',
        '四条合计约10GW的高压直流走廊将于2026年底至2028年底之间投运：Ultranet 2GW、A-Nord约2GW、SuedOstLink 2GW、SuedLink约4GW。四者均有延期报道，这也是德国拥塞投资逻辑尚有窗口期的唯一原因。承销依据应为约束所对应的具名走廊而非整体计划 — 并须注意，延长机会窗口的延期同时也在推高消费者账单，因此无人有动力维持这一风险。',
      ],
      source: 'Bundesnetzagentur congestion management reporting 2025; TenneT SuedLink',
      sourceUrl: URL.suedlink,
    },

    {
      id: 'de-bavaria-pv',
      bearsOn: 'merchGross',
      name: ['Bavarian solar curtailment', '巴伐利亚光伏限电'],
      shape: 'zone',
      coord: [11.50, 48.80],
      direction: 'export',
      intensity: 0.85,
      metrics: [
        { label: ['National PV curtailment concentrated in Bavaria', '全国光伏限电集中于巴伐利亚'],
          value: ['986 GWh of 1,389 GWh — 71%', '1,389GWh中的986GWh — 占71%'], period: ['2024', '2024年'] },
        { label: ['PV curtailment growth', '光伏限电增长'],
          value: ['2.7 TWh, +94% year on year', '2.7太瓦时，同比增长94%'], period: ['2025', '2025年'] },
      ],
      capture: {
        mechanism: CAPTURE.REGULATED_COMPENSATION,
        text: [
          'Curtailment compensation ran €433m in 2025 and is paid to the curtailed generator, not to a battery that absorbs the surplus. What a battery gets is the depressed midday price the curtailment implies — a daily, seasonal and highly predictable charging window, and the shape a four-hour asset is built for.',
          '2025年限电补偿达4.33亿欧元，支付对象为被限电的发电方，而非吸纳过剩电量的储能。储能获得的是限电所隐含的午间低价 — 一个每日、季节性且高度可预测的充电窗口，正契合四小时资产的设计场景。',
        ],
      },
      relief: {
        project: ['SuedOstLink', 'SuedOstLink输电工程'],
        operator: '50Hertz / TenneT',
        scope: ['2 GW, 525 kV HVDC, Wolmirstedt to Isar; final section approved by the Bundesnetzagentur on 25 July 2025',
                '2GW、525千伏高压直流，自Wolmirstedt至Isar；最后一段已于2025年7月25日获联邦网络管理局批准'],
        expected: 2027,
        status: RELIEF_STATUS.APPROVED,
      },
      investor: [
        'The most locational fact in the German register, and it points south. Bavaria carried 71% of national PV curtailment on 1,389 GWh in 2024, and the capacity auction prices the same geography explicitly — at least a third of awards must go to the grid-technical north, and southern bids are evaluated only after a €16,000/MW deduction. A southern battery is therefore sited into the cheap charging and out of the capacity route at the same time.',
        '这是德国登记表中区位属性最强的事实，且指向南部。2024年巴伐利亚承担了全国1,389GWh光伏限电中的71%，而容量拍卖对同一地理区域给出明确定价 — 至少三分之一的中标须分配给电网意义上的北部地区，南部报价须先扣减每MW €16,000后方予评估。因此南部储能在获得低价充电机会的同时，也被排除在容量路径之外。',
      ],
      source: 'Bundesnetzagentur / pv magazine curtailment reporting; Bundesnetzagentur SuedOstLink approval',
      sourceUrl: URL.suedostlink,
    },

    {
      id: 'de-single-bidding-zone',
      bearsOn: 'merchGross',
      name: ['Single bidding zone', '单一报价区'],
      shape: 'zone',
      coord: [10.00, 51.20],
      direction: 'both',
      intensity: 0.7,
      metrics: [
        { label: ['Efficiency gain ENTSO-E found from splitting', 'ENTSO-E测算的拆分效率收益'],
          value: ['€251m–339m, five-zone split performing best', '2.51–3.39亿欧元，五区拆分方案最优'],
          period: ['2025 target year', '2025目标年度'] },
        { label: ['Decision', '决定'],
          value: ['Rejected; single zone retained', '已否决；维持单一报价区'],
          period: ['confirmed December 2025', '2025年12月确认'] },
      ],
      capture: {
        mechanism: CAPTURE.UNCOMPENSATED,
        text: [
          'Not a constraint but the rule that governs all of them, and the German equivalent of Britain\'s zonal-pricing rejection. One price nationwide means siting next to congestion changes nothing about the price a battery trades at. A split would have raised southern prices by roughly €8/MWh — the locational signal that does not exist.',
          '这并非某项约束，而是支配所有约束的规则，相当于德国版的英国分区电价否决。全国单一价格意味着邻近拥塞选址并不改变电池的成交价格。拆分本可使南部价格上升约€8/MWh — 而这一区位信号并不存在。',
        ],
      },
      relief: {
        project: ['None — the split was rejected', '无 — 拆分方案已被否决'],
        operator: 'Federal government / European Commission',
        scope: ['Germany notified its rejection by end-October 2025 and confirmed it in December, publishing a grid action plan instead; the ministry argued the gains were smaller than the reconfiguration costs',
                '德国于2025年10月底通知否决，并于12月予以确认，转而发布电网行动计划；经济部认为收益小于重构成本'],
        expected: null,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'Read this before any German congestion case, because it caps what one can be worth. Germany and Great Britain arrived at the same place from opposite directions — GB rejected zonal pricing in July 2025, Germany in December — and the consequence is identical: congestion value cannot be captured through where you build. The German difference is that there is no Balancing Mechanism equivalent to reach it through either, so the value shows up as cheap charging and an avoided grid fee rather than as a payment.',
        '在评估任何德国拥塞投资逻辑之前应先读此条，因为它限定了该逻辑的价值上限。德国与英国从相反方向走到了同一位置 — 英国于2025年7月否决分区电价，德国于12月否决 — 结果完全相同：拥塞价值无法通过选址捕获。德国的不同之处在于，也不存在可供触达该价值的平衡机制等价物，因此价值体现为低价充电与节省的电网费用，而非一笔收入。',
      ],
      source: 'ENTSO-E Bidding Zone Review of the 2025 Target Year, 28 April 2025; German government rejection, December 2025',
      sourceUrl: URL.biddingZone,
    },
  ],
};

export default DE_CONGESTION;
