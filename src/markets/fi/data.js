/* ---------------------------------------------------------------------------
   Finland — market dataset.

   EVERY NUMBER HERE IS TRACEABLE TO sources.js, and the ones that are not
   present are not present on purpose. This dataset is smaller than the other
   markets' because it carries what was verified on 2026-08-18 and nothing more:
   Fingrid's reserve obligations and forecast, the FCR yearly-market clearing for
   2026, the adequacy position, the connection restriction, and the fleet the
   saturation gate measures.

   REVISED 2026-10-17. The reserve line is no longer withheld: it is set at
   what Fingrid's 2026 annual market paid, spread across the connected fleet
   (src/markets/fi/comparison.js, gate FI-1), so Finland is in the engine and
   this dataset now carries what the other dashboards carry — a Lab seed, the
   index history, the transactions, the wind build-out and the timeline.
   --------------------------------------------------------------------------- */
import { landedDcPerKWh } from '../../comparison/supplierQuote.js';

const M = {
  asOf: '2026-10-30',
  dataDate: '2026 obligation period; FCR yearly market for delivery year 2026',
  modelVersion: 'fi-2.1-fingrid-fees',
  title: ['Finland Battery Investment Dashboard', '芬兰储能投资看板'],
  sub: ['A saturated reserve market turning into a trading one: what the system still pays for, what a negotiated floor secures, and where a battery can still connect.',
        '一个由饱和备用市场转向交易主导的市场：系统仍为何付费、协商保底能锁定什么，以及储能还能在何处并网。'],
  nextMilestone: ['Next milestone: the hourly reserve prices through the Fingrid API (gate FI-2), which say whether the €15k/MW reserve line is too low',
                  '下一里程碑：经Fingrid API接入小时级备用价格（研究缺口FI-2），以判断每MW 1.5万欧元的备用收入是否偏低'],
  footerNote: ['Public sources verified 18 August, 17 October and 30 October 2026. Priced in the engine since 17 October 2026: reserves at the 2026 annual clearing spread across the fleet, and the negotiated floor as a floor. Fingrid’s 2026 connection charge and storage service fees since 30 October 2026.',
               '公开来源已于2026年8月18日、10月17日及10月30日核验。自2026年10月17日起纳入引擎计价：备用收入取2026年度出清按全部储能分摊，协商保底按保底建模。自2026年10月30日起计入Fingrid 2026年并网费与储能服务费。'],
  seedWarn: ['The reserve line is what the 2026 annual market paid across the fleet, €15k/MW a year; a well-optimised battery in the hourly markets may earn more or less. A reserve obligation is never a captured price; an announced project is never a financed one; an available connection in the north is never a connection in the south.',
             '备用收入为2026年度市场在全部储能间分摊的水平，每MW每年1.5万欧元；在小时级市场中优化良好的储能可能高于或低于此数。备用需求不等于捕获价格；已公布项目不等于已融资项目；北部的可用并网容量不等于南部的并网容量。'],

  /* ---- reserve obligations, Fingrid, 2026 ------------------------------- */
  reserves: {
    obligation2026: [
      { product: ['FFR', 'FFR'], mw: '0–60', role: ['Fast frequency response', '快速频率响应'], fast: true },
      { product: ['FCR-D up', 'FCR-D上调'], mw: '309', role: ['Disturbance reserve, upward', '扰动备用，上调'], fast: true },
      { product: ['FCR-D down', 'FCR-D下调'], mw: '298', role: ['Disturbance reserve, downward', '扰动备用，下调'], fast: true },
      { product: ['FCR-N', 'FCR-N'], mw: '128', role: ['Normal operation reserve', '正常运行备用'], fast: true },
      { product: ['aFRR', 'aFRR'], mw: '~50', role: ['Automatic restoration', '自动恢复'], fast: false },
      { product: ['mFRR up', 'mFRR上调'], mw: '880–1,300', role: ['Manual restoration, upward', '手动恢复，上调'], fast: false },
      { product: ['mFRR down', 'mFRR下调'], mw: '575', role: ['Manual restoration, downward', '手动恢复，下调'], fast: false },
    ],
    /* The fast products a battery actually competes for. Stated as a total
       because the ratio against the fleet is the whole argument. */
    fastTotalMW: 795,
    forecast: [
      { product: ['FCR-N', 'FCR-N'], from: 128, to: 105, by: '2035–36', direction: 'down' },
      { product: ['mFRR up', 'mFRR上调'], from: 290, to: 530, by: '2033+', direction: 'up' },
      { product: ['mFRR down', 'mFRR下调'], from: 567, to: 1100, by: '2032+', direction: 'up' },
    ],
    yearly2026: [
      { product: ['FCR-D up', 'FCR-D上调'], mw: 237.0, priceEurMWh: 3.50 },
      { product: ['FCR-D down', 'FCR-D下调'], mw: 163.0, priceEurMWh: 6.00 },
    ],
  },

  /* ---- adequacy: why capacityMarket is false ----------------------------- */
  adequacy: {
    mechanism: ['Peak load capacity, act 117/2011, administered by Finextra', '峰荷容量机制，117/2011号法案，由Finextra管理'],
    procured2025to26MW: 0,
    dormantSince: '2022-07',
    loleStandardHours: 2.1,
    loleAdoptedy: '2022-03',
    cause: ['Olkiluoto 3 entering service, after which national resource adequacy assessments showed no concern against the standard',
            'Olkiluoto 3投运后，全国充裕度评估显示对照该标准不存在充裕度问题'],
  },

  /* ---- connection: the binding constraint -------------------------------- */
  connection: {
    restrictedUntil: '2029',
    previouslyUntil: '2027',
    area: ['Southern Finland', '芬兰南部'],
    requestsMW: 30000,
    contractedMW: 1800,
    availableElsewhere: ['Ostrobothnia and northern Finland', '博滕区与芬兰北部'],
    reliefProject: ['Hikiä–Toivila main grid reinforcement', 'Hikiä–Toivila主网加强工程'],
    reinforcementMW: 1500,
  },

  /* ---- the fleet the saturation gate measures ----------------------------
     CORRECTED 2026-08-18. An earlier draft carried ~250 MW operational plus
     announcements, which was mid-2025 data and understated the position by a
     factor of four. Fingrid reported connected storage passing 1,050 MW in
     early February 2026 — and that strengthens the saturation argument rather
     than softening it: connected storage now EXCEEDS the fast-reserve
     obligation outright.

     Two qualifications travel with the number and must not be dropped. It
     counts all storage of 1 MW and above, not batteries alone; and 56% of it
     sits on the distribution grid against 44% on transmission. Distribution-
     connected storage can reach the reserve markets, but not every megawatt is
     prequalified for every product, so this is an upper bound on the competing
     fleet rather than a measured one. */
  fleet: {
    connectedMW: 1050,
    connectedAsOf: '2026-02',
    countedSystems: 261,
    countedSystemsMW: 980,
    smallBatteryEstimateMW: 70,
    distributionSharePct: 56,
    transmissionSharePct: 44,
    /* Individually cited. The aggregate above is Fingrid's; each project below
       is its own announcement and carries its own source, because "the fleet is
       1,050 MW" and "this specific project exists" are different claims with
       different evidence. */
    announced: [
      { name: ['Statkraft / OX2, two sites', 'Statkraft / OX2，两处场址'], mw: 235, mwh: 470,
        status: ['Under construction; seven-year optimisation agreement', '在建；签有七年期优化协议'],
        src: 'statkraftOx2' },
      /* UPDATED 2026-10-17. Trade press had 70 MW / 140 MWh; the project as sold is
         100 MW / 400 MWh, fully permitted, bought by Foresight's FEIP II from FRV. */
      { name: ['Nivala (Foresight, from FRV)', 'Nivala（Foresight，购自FRV）'], mw: 100, mwh: 400,
        status: ['Fully permitted; acquired by Foresight (FEIP II) in October 2026; operation expected H2 2028', '已取得全部许可；2026年10月由Foresight（FEIP II）收购；预计2028年下半年投运'],
        src: 'dealForesight' },
      /* ADDED 2026-10-30, each from its own announcement. */
      { name: ['Akkula Big Battery, Rauma (Neoen)', 'Akkula大型储能，劳马（Neoen）'], mw: 62.5, mwh: 231,
        status: ['Under construction since December 2025; fully operational in 2027; 110 kV line connection', '2025年12月起在建；2027年全面投运；接入110kV线路'],
        src: 'akkulaNeoen' },
      { name: ['Tuisku, Keminmaa (Luxcara)', 'Tuisku，凯明马（Luxcara）'], mw: 125, mwh: null,
        status: ['Bought construction-ready in February 2026; commercial operation targeted for summer 2027', '2026年2月以可开工状态收购；目标2027年夏季商业运行'],
        src: 'tuiskuLuxcara' },
      { name: ['Teuva (Prime Capital, from Usva Energia)', 'Teuva（Prime Capital，购自Usva Energia）'], mw: 100, mwh: 400,
        status: ['Ready-to-build; sold to Prime Capital in 2026', '可开工；2026年出售给Prime Capital'],
        src: 'dealTeuva' },
      { name: ['Uusikaupunki', 'Uusikaupunki'], mw: 50, mwh: 100,
        status: ['Reported for summer 2026', '据报道于2026年夏季投运'],
        src: 'tradePress' },
    ],
  },

  /* ---- the saturation comparison, kept out of pipelineRatio ---------------
     `narrative.pipelineRatio` means pipeline-to-operating everywhere on this
     platform, and an earlier draft put this ratio there. It is a different
     quantity and it needs qualifications a league-table cell cannot carry, so
     it lives here with them attached. */
  saturation: {
    connectedMW: 1050,
    fastObligationMW: 795,
    ratio: '~1.3×',
    /* Read as a WARNING, not a measurement. Both sides are approximations
       pointing the same way, and neither is the clean quantity the ratio
       implies. */
    caveats: [
      ['The obligation is a sum across distinct products — FFR, FCR-D up, FCR-D down, FCR-N — procured separately with their own prequalification and clearing. A megawatt is not fungible across them.',
       '需求为多个独立品种的合计 — FFR、FCR-D上调、FCR-D下调、FCR-N — 各自单独采购、单独预审、单独出清。同一MW并不能在各品种间通用。'],
      ['The fleet counts all storage of 1 MW and above rather than batteries alone, and 56% is distribution-connected. Not every megawatt is prequalified for every product.',
       '机组规模涵盖1MW及以上所有储能类型而非仅电池，且56%接入配电网。并非每一MW都已通过所有品种的预审。'],
    ],
  },

  /* ---- wholesale --------------------------------------------------------- */
  wholesale: {
    zone: '10YFI-1--------U',
    mtuChangedOn: '2025-10-01',
    mtuMinutes: 15,
    observedFloorEurMWh: -500,
    observedFloorYear: '2024',
  },

  /* ---- the grid, for scale ----------------------------------------------- */
  grid: {
    lineKm: 14900,
    line400kvKm: 5400,
    substations: 138,
    tenYearInvestmentEurBn: 5.2,
  },

  /* ---- added 2026-10-17: what the other dashboards carry ------------------ */

  /* The dashboard Investment Lab. Reconciles to the comparison archetype: the
     installed €440k/MW at 2h split energy 63.6% / power 36.4% on the platform
     stack — 2,000 × €140 + 1,000 × €160 = €440,000 — with the quoted HiTHIUM
     block inside the energy rate. Spread is set so the Lab's merchant line
     reproduces the €78k/MW merchant seed: 2 h × 0.91 × 1.5 cycles × 365 ×
     97% × €81 ≈ €78.3k. Reserves at the €15.08/kW-yr fleet-shared 2026 level.
     Debt tenor seven years, the floor's term.
     Since 2026-10-30 Fingrid's tariffs are in: the €40k/MW connection charge as
     its own line (a tariff, so the sponsor discount never touches it) and the
     €4.14/kW-yr storage service fees on top of the €9 operating seed. */
  lab: {
    vatPct: 25.5, vatRecoverable: 1,
    devCostPct: 0, rtbPremiumPct: 0, constructionMonths: 12,
    mw: 50, hours: 2, capexKWh: 140, dcQuoteKWh: landedDcPerKWh('EUR'), capexKW: 160, connectionPerMW: 40000, opexKW: 13.14,
    rte: 88, avail: 97, degr: 2.0, cycles: 1.5, spread: 81, optFee: 10,
    capPrice: 0, capYrs: 0, servicesKW: 15.08, grantPct: 0,
    life: 15, disc: 9, debtPct: 55, rate: 6.5, tenor: 7,
  },
  /* No capacity mechanism, so the de-rating curve is flat and unused. Spread by
     duration is the same seed curve the comparison uses (gate FI-4). */
  deratingCurve: { 1: 1, 2: 1, 4: 1, 6: 1, 8: 1 },
  futureCapFactor: 0,
  durSpreadFactor: { 1: 1.10, 2: 1.00, 4: 0.82, 6: 0.70, 8: 0.62 },
  usableFraction: 0.91,

  /* Clean Horizon's Storage Index for Finland, all markets, €/MW/yr. The peak
     and August 2026 points are as Clean Horizon's figures were reported in the
     trade press; mid-2025 is Clean Horizon's own note. */
  index: {
    peak: { when: '2023-09', h1: 645000 },
    mid2025: { when: '2025-07', h2: 400000 },
    aug2026: { when: '2026-08', h1: 50000, h2: 78000, h4: 111000 },
  },
  fcrnPrice: [
    { y: '2023', v: 47 }, { y: '2024', v: 46 }, { y: 'Jun 2025', v: 19 }, { y: '2026 annual', v: 0 },
  ],

  /* Wind, the swing producer. Renewables Finland, year-end 2025. */
  wind: { mwEnd2025: 9433, addedMW2025: 1023, turbines: 2002, ostrobothniaSharePct: 76 },

  /* Transactions that show who is buying Finnish storage, and at what stage.
     Each row cites its own source. */
  deals: [
    { when: '2024-08', buyer: ['L&G NTR Clean Power (Europe) Fund', 'L&G NTR清洁能源（欧洲）基金'], seller: 'OX2',
      asset: ['Uusnivala, 50 MW / 110 MWh, ready-to-build', 'Uusnivala，50MW/110MWh，可建设阶段'], src: 'dealNtr' },
    { when: '2025-01', buyer: ['Nala Renewables (Trafigura / IFM)', 'Nala Renewables（Trafigura/IFM）'], seller: '—',
      asset: ['Kauhava, 50 MW / 100 MWh; project finance from Société Générale', 'Kauhava，50MW/100MWh；法国兴业银行提供项目融资'], src: 'dealKauhava' },
    { when: '2026-02', buyer: ['Nala Renewables (Trafigura / IFM)', 'Nala Renewables（Trafigura/IFM）'], seller: 'Fu-Gen',
      asset: ['Vuolijoki, 125 MW, ready-to-build', 'Vuolijoki，125MW，可建设阶段'], src: 'dealVuolijoki' },
    { when: '2026-02', buyer: ['Luxcara', 'Luxcara'], seller: 'Pohjan Voima',
      asset: ['Tuisku, up to 125 MW, construction-ready', 'Tuisku，最高125MW，可开工阶段'], src: 'tuiskuLuxcara' },
    { when: '2026-03', buyer: ['Prime Capital', 'Prime Capital'], seller: '—',
      asset: ['170 MWh project, acquisition closed', '170MWh项目，收购完成'], src: 'dealPrime' },
    { when: '2026', buyer: ['Prime Capital', 'Prime Capital'], seller: 'Usva Energia',
      asset: ['Teuva, 100 MW / 400 MWh, ready-to-build', 'Teuva，100MW/400MWh，可建设阶段'], src: 'dealTeuva' },
    { when: '2026-10', buyer: ['Foresight', 'Foresight'], seller: 'FRV',
      asset: ['Nivala, 100 MW / 400 MWh, four hours', 'Nivala，100MW/400MWh，四小时'], src: 'dealForesight' },
  ],

  /* How the market got here, dated. */
  timeline: [
    { y: '2022–2023', t: ['Adequacy solved by nuclear', '核电解决充裕度'],
      p: ['Olkiluoto 3 entered service and the strategic reserve has held nothing since July 2022.', 'Olkiluoto 3投运，战略备用自2022年7月起未持有任何容量。'],
      i: ['Finland pays for flexibility, not for firm capacity.', '芬兰为灵活性付费，而非为确定性容量付费。'] },
    { y: '2023', t: ['The reserve boom', '备用收入高峰'],
      p: ['FCR-N reserved at about €47/MW,h; a one-hour battery earned about €645k/MW a year at the September 2023 peak of Clean Horizon’s index.', 'FCR-N预留价约47欧元/MW,h；Clean Horizon指数显示2023年9月高峰时1小时储能年收入约64.5万欧元/MW。'],
      i: ['The returns that drew 30,000 MW of connection requests.', '正是这一回报吸引了30,000MW的并网申请。'] },
    { y: '2024–2025', t: ['Cannibalisation', '同质化竞争'],
      p: ['FCR-N fell from €46/MW,h in 2024 to €19 by June 2025 as batteries filled it; wind passed 9,400 MW; the price record reached −500 €/MWh. The market went to fifteen minutes in stages — the aFRR energy market in June 2024, the mFRR energy market on 4 March 2025, the imbalance price on 19 March, day-ahead on 1 October — and Finland joined PICASSO, the European aFRR energy platform, on 26 March 2025.', 'FCR-N由2024年的46欧元/MW,h降至2025年6月的19欧元；风电装机超过9,400MW；价格记录触及−500欧元/MWh。市场分阶段转为15分钟 — 2024年6月aFRR能量市场、2025年3月4日mFRR能量市场、3月19日不平衡电价、10月1日日前市场 — 芬兰于2025年3月26日加入欧洲aFRR能量平台PICASSO。'],
      i: ['Revenue moves from reserves to trading.', '收入来源由备用转向交易。'] },
    { y: '2026', t: ['Saturation, and the deals continue', '饱和，但交易仍在继续'],
      p: ['FCR-N’s annual auction cleared at zero; connected storage passed 1,050 MW in February against about 795 MW of fast-reserve need; Clean Horizon’s two-hour index stood at about €78k/MW a year in August. Foresight, Nala and Prime Capital bought projects anyway.', 'FCR-N年度拍卖以零出清；2月已并网储能超过1,050MW，而快速备用需求约795MW；8月Clean Horizon两小时指数约为每MW每年7.8万欧元。Foresight、Nala与Prime Capital依然收购了项目。'],
      i: ['Buyers are pricing trading and floors, not reserves.', '买方定价依据的是交易与保底，而非备用。'] },
    /* ADDED 2026-10-30, from Fingrid's releases of 2 and 8 September 2026. */
    { y: '2027', t: ['Reserves go hourly; MARI slips', '备用转为小时级；MARI推迟'],
      p: ['Fingrid buys no FCR in a yearly market for 2027: the yearly annexes expire on 31 December 2026 and FCR is bought hour by hour, with hourly volumes expected to rise significantly. The Nordic move to MARI, the European mFRR energy platform, slipped from Q1 2027 to most likely September–October 2027.', 'Fingrid 2027年不再通过年度市场采购FCR：年度协议于2026年12月31日到期，FCR改为逐小时采购，预计小时级容量将大幅增加。北欧接入欧洲mFRR能量平台MARI的时间由2027年第一季度推迟至最可能的2027年9–10月。'],
      i: ['The one fixed-price reserve market the reserve line is read from closes before a 2028 battery runs.', '备用收入所依据的唯一固定价格备用市场，将在2028年投运的储能运行前关闭。'] },
    { y: '2029', t: ['Southern connections reopen', '南部并网重新开放'],
      p: ['Fingrid’s restriction on new storage connections in southern Finland runs until the Hikiä–Toivila reinforcement completes.', 'Fingrid对芬兰南部新增储能并网的限制持续至Hikiä–Toivila加强工程完工。'],
      i: ['Until then, a southern connection is the scarce asset.', '在此之前，南部并网容量是稀缺资产。'] },
  ],

  glossary: [
    ['FCR-N — frequency containment reserve, normal operation', 'FCR-N — 正常运行频率维持备用'],
    ['FCR-D — frequency containment reserve, disturbance (up and down)', 'FCR-D — 扰动频率维持备用（上调与下调）'],
    ['FFR — fast frequency reserve', 'FFR — 快速频率备用'],
    ['aFRR / mFRR — automatic and manual frequency restoration reserve', 'aFRR/mFRR — 自动与手动频率恢复备用'],
    ['mFRR EAM — the Nordic mFRR energy activation market', 'mFRR EAM — 北欧mFRR能量激活市场'],
    ['PICASSO — the European platform for aFRR energy, joined by Finland on 26 March 2025', 'PICASSO — 欧洲aFRR能量平台，芬兰于2025年3月26日加入'],
    ['MARI — the European platform for mFRR energy; Nordic accession expected September–October 2027', 'MARI — 欧洲mFRR能量平台；北欧预计于2027年9–10月接入'],
    ['Fingrid — the Finnish transmission system operator', 'Fingrid — 芬兰输电系统运营商'],
    ['Energy Authority — the regulator that decides peak-load capacity', '能源局 — 决定峰荷容量的监管机构'],
    ['Optimiser floor — a minimum annual payment from an optimiser or offtaker, with the upside kept by the owner', '优化商保底 — 优化商或购电方承诺的最低年付款，超额收益归业主'],
  ],
};

export { M };
export default M;
