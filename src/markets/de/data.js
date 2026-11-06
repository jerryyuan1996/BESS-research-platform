import {HISTORY_DATA} from './historyData.js';
/* ---------------------------------------------------------------------------
   Germany — market dataset.

   Same shape as the NEM/RO/PL datasets in this lineage: official snapshot
   values, scorecards, bands, duration curves, the project pipeline, lab defaults
   and the per-tab narrative inputs. Everything the shared engine draws comes
   from here.

   FOUR THINGS ABOUT THIS PARTICULAR DATASET.

   1. Germany HAS a capacity mechanism and this archetype cannot bid into it, so
      `deratingCurve` is ZERO below ten hours and 0.58 at ten. That is not the
      flat-1 declaration Romania and the NEM make for markets with no mechanism
      at all; it is the StromVKG eligibility floor written into the model. A user
      who moves the lab to ten hours gets a real capacity line, because at ten
      hours there really is one. At four hours there is not.

   2. The lab seed reproduces src/markets/de/comparison.js rather than restating
      it. capexKWh 117.5 + capexKW 465 is not a guess: it is the exact
      decomposition of Modo's two published points, €700,000/MW at 2h and
      €935,000/MW at 4h, solved as a simultaneous pair. opexKW 17 is
      comparison.js's €17,000/MW/yr; optFee 9 is its feePct; servicesKW 6.04 is
      its €6,038 Momentanreserve seed; grantPct 0 is its `grantPct: 0`.

   3. `durSpreadFactor[4] = 0.75` is derived, not assumed. comparison.js scales
      2h revenue to 4h by 1.50×. A four-hour asset discharges twice the energy,
      so per megawatt-hour it captures 1.50 / 2 = 0.75 of the two-hour rate. The
      two files therefore cannot disagree about what four hours earns.

   4. Where a figure is not published anywhere — toll fees, fixed opex,
      degradation, optimiser fees, 4h merchant revenue, mFRR clearing prices,
      whether the published capex includes the Baukostenzuschuss — this file does
      not invent one. Those gaps are carried explicitly in `notPublished` and
      rendered on the Data & Methodology tab.
   --------------------------------------------------------------------------- */
import { landedDcPerKWh } from '../../comparison/supplierQuote.js';

const M = {
  asOf: HISTORY_DATA.asOf,
  dataDate: HISTORY_DATA.dataDate,
  modelVersion: HISTORY_DATA.modelVersion,
  title: ['Germany Battery Investment Dashboard', '德国储能投资看板'],
  sub: ['Institutional investor storyline: market evolution, forward signals, project underwriting and portfolio application. Single bidding zone; reference archetype 100 MW / 4h.',
        '面向机构投资人的投资叙事：市场演进、前瞻信号、项目承销与组合应用。单一报价区；参考原型为100MW/4小时。'],
  nextMilestone: ['Next milestone: StromVKG 4.5 GW capacity auction — bids closed 8 September 2026, winners due by 3 November 2026; second round 29 December 2026. A four-hour battery cannot bid before the 2 GW round of May 2027.',
                  '下一里程碑：StromVKG 4.5GW容量拍卖 — 已于2026年9月8日截标，中标结果应于11月3日前公布；第二轮为2026年12月29日。四小时电池在2027年5月的2GW轮次之前不具备投标资格。'],
  footerNote: ['Public and official sources collected 1 August 2026. No German toll fee has ever been disclosed in any transaction; no German fixed opex, degradation rate, optimiser fee or mFRR clearing price is published; and it is not confirmed whether the published capex already includes the Baukostenzuschuss — a 12–24% swing. Every contracted figure in this build is a derived bracket, not a quotation.',
               '公开及官方来源于2026年8月1日采集。德国从未在任何交易中披露租赁费用；德国亦未公布固定运维成本、衰减率、优化商费率或三次调频出清价格；且尚未确认已公布造价是否已包含并网工程费分摊（BKZ） — 该项影响幅度达12–24%。本版本中所有合同类数值均为推导区间，而非报价。'],
  seedWarn: ['Every value on this page is an approved base-case snapshot or an illustrative placeholder. No figure is production-complete until its live feed, validation and source-health check are running. The StromVKG scheme\'s European Commission state-aid approval was reported on 2 September 2026; a ten-hour eligibility test excludes the archetype modelled here; a tolling announcement is never a disclosed price; and the Baukostenzuschuss is a one-off, non-refundable charge the Bundesgerichtshof has confirmed applies to storage.',
             '本页所有数值均为已批准的基准情景快照或示例占位数据。在实时数据接入、校验及来源健康检测上线前，任何指标均不可用于生产决策。StromVKG机制的欧盟委员会国家援助批准已于2026年9月2日见诸报道；十小时资格门槛将本页所建模的原型排除在外；租赁公告绝不等于已披露价格；并网工程费分摊（BKZ）为一次性、不可退还费用，德国联邦最高法院已确认其适用于储能。'],

  /* ---- official / sourced snapshot -------------------------------------
     Only values that come from a named publication sit here. Illustrative
     series live further down and are badged as such wherever they render. */
  official: {
    // ---- StromVKG capacity market ----
    capAuctionGW: HISTORY_DATA.official.capAuctionGW, capBidDeadline: '8 September 2026', capWinners: '3 November 2026',
    capYears: HISTORY_DATA.official.capYears, capCapPerMW: HISTORY_DATA.official.capCapPerMW,
    capMinHours: HISTORY_DATA.official.capMinHours, capMinRtePct: 92, capAvailPct: 100,
    derate10h: 0.58, derate20h: 0.85,
    /* The realistic entry point for shorter duration: a later generation-capacity
       auction that drops the ten-hour test. */
    gen2AuctionGW: 2, gen2Date: '18 May 2027',
    capNorthSharePct: 33, capSouthDeductPerMW: 16000,
    capStateAid: ['Approval reported 2 September 2026 — the auction had opened with the review pending',
                  '批准已于2026年9月2日见诸报道 — 拍卖启动时审查仍在进行'],
    /* ASSUMPTION, not an observation. Modo's estimate of what capacity revenue
       becomes worth once a shorter-duration segment opens. Labelled everywhere
       it renders and excluded from the lab seed. */
    capAssumeLo: 10000, capAssumeHi: 15000, capAssumeFrom: 2031,
    /* Two sourced timetables that do not agree. Recorded rather than resolved. */
    capAltDate1: '1 September 2026', capAltDate2: '8 December 2026',

    // ---- merchant ----
    modo2hNear: 240000, meBessApr26: 218000, meBessApr26Month: 'April 2026',
    lev2hLo: 115000, lev2hHi: 130000, lev2hLow: 70000, lev2030: 125000,
    apr26CutPct: 16, apr26CutFrom: 2028,
    realOct: 264955, realNov: 142727, realDec: 107556,
    cycOct: 1.58, cycNov: 1.12, cycDec: 0.93,
    momNovPct: -45, momDecPct: -25, swingX: 2.5,
    da2025: 85000, fwdTb2: 76000, fwdYears: 15, backtest2024Hi: 200000,
    // Independent bear case, carried as the bear case rather than as the seed.
    bearLo: 110000, bearHi: 115000, bearIrrLo: 5, bearIrrHi: 7,

    // ---- ancillary ----
    ancShare2026Pct: 55, tradeShare2026Pct: 45, ancShare2025AltPct: 67,
    arbShare2030Pct: 95,
    afrr2026: 15, afrrFallPct: 35, afrr2025: 23,
    afrrPqMW: 580, afrrPqSharePct: 30, afrrProcuredMW: 2000,
    fleet2026GW: 5.7, afrrQualifyPct: 35, afrrSpend2024Em: 400,
    fcrQualMW: 800, fcrProcMW: 570, fcrEuMW: 1700, fcrEuCountries: 9,
    gbFcr2022K: 150, gbFcr2023K: 50,
    // Momentanreserve — grid-forming inertia, procured jointly by all four TSOs.
    inertiaOpen: '22 January 2026', inertiaFirstDelivery: '21 January 2028',
    inertiaTenorLo: 2, inertiaTenorHi: 10,
    inertiaPremLo: 805, inertiaPremHi: 888.5, inertiaPremAvailPct: 90,
    inertiaBasicLo: 76, inertiaBasicHi: 109.5, inertiaBasicAvailPct: 30,
    inertiaBottomUp: 6038, inertiaModoLo: 8000, inertiaModoHi: 20000,

    // ---- capex and connection cost ----
    capex2h: 700000, capex4h: 935000, capex2hKWh: 350, capex4hKWh: 234,
    capexPremiumPct: 33.6,
    bkzMitnetz: 110000, bkzSwm: 165000, bkzTypicalHi: 140000,
    bkzRulingDate: '15 July 2025', bkzDeposit: 1500,
    feeExemptDate: '4 August 2029', agnesLo: 4000, agnesHi: 7000,
    agnesAvgLo: 5380, agnesAvgHi: 5650, agnesGrandfatherYears: 20,
    agnesDecision: 'late 2026', agnesIrrCostPp: 0.5,
    agnesRejectedRate: 66.5, agnesRejectedIrrPp: 4,

    // ---- tolling ----
    auroraTollLoPct: 40, auroraTollHiPct: 50,
    tollDeals2024: 3, tollDeals2025: 15, tollDealsDe2025: 6,
    fsMW: 300, fsMWh: 700, fsHours: 2.33, fsYears: 5,
    fsTolledPct: 80, fsMerchPct: 20, fsBlocks: 3, fsBlockMW: 100,
    fsStart: 'November 2026', fsFull: 2027, junizYears: 7,
    tollTenorLo: 5, tollTenorHi: 10, physTollLoPct: 70, physTollHiPct: 100,
    tollBeLo: 95000, tollBeMidLo: 100000, tollBeMidHi: 110000, tollBeHi: 115000,
    tollGearingFullPct: 85, tollIrrFullPct: 12, tollIrrPartLoPct: 9, tollIrrPartHiPct: 17,
    dsYear1: 63000, dsYear7: 52000, dsPostToll: 36000, dsDropPct: 42,
    bankMaxContractedPct: 80, deTollClusterLoPct: 80, deTollClusterHiPct: 100,

    // ---- duration ----
    newDur2025: 1.7, newDur2026: 2.3, newDurDate: '20 Jul 2026',
    fleetDurLo: 1.4, fleetDurHi: 2.0,
    irr4hPct: 13.7, irr2hPct: 12.2, irrCod: 2026,

    // ---- grid and congestion ----
    cong2025Ebn: 3.1, cong2025GrowthPct: 4,
    redispatch2025Ebn: 1.2, reservePlants2025Ebn: 1.4,
    countertrading2025Em: 102, curtailComp2025Em: 433, curtailCompChangePct: -22,
    downRedispatchTWh: 15.5, pvCurtailTWh: 2.7, pvCurtailGrowthPct: 94,
    cong2024Ebn: 2.77, vol2024GWh: 30304,
    offshore2024GWh: 4562, offshoreChangePct: -20,
    onshore2024GWh: 3384, onshoreChangePct: -15,
    solar2024GWh: 1389, solarChangePct: 97,
    bavaria2024GWh: 986, bavariaSharePct: 71,
    bzReviewDate: '28 April 2025', bzGainLoEm: 251, bzGainHiEm: 339,
    bzRejectDate: 'end-October 2025', bzConfirmDate: 'December 2025', bzSouthUplift: 8,
    flexCapLossPct: 13, flexRamp15Pct: 10, flexRamp5Pct: 5, flexRefMW: 75, flexRefHours: 2,
  },

  /* The five daily gate closures a German optimiser trades through, in order.
     Structure rather than price: no per-gate €/MW/yr decomposition is published
     for a German battery. */
  gateCloses: [
    { id: 'FCR',       n: ['Frequency Containment Reserve', '一次调频（FCR）'],
      when: ['Day-ahead, 4-hour products', '日前，4小时产品'],
      fit: ['Oversupplied — ~' + 800 + ' MW of battery qualified against ~570 MW procured', '已供过于求 — 约800MW电池取得资格，采购量约570MW'] },
    { id: 'aFRR',      n: ['Automatic Frequency Restoration Reserve', '二次调频（aFRR）'],
      when: ['Day-ahead capacity plus a continuous energy market', '日前容量市场加连续能量市场'],
      fit: ['Compressing — daily marginal price 35% below the same period of 2025', '正在压缩 — 日边际价格较2025年同期低35%'] },
    { id: 'Day-ahead', n: ['Day-ahead auction', '日前拍卖'],
      when: ['12:00 CET for the following day', '中欧时间12:00，交易次日'],
      fit: ['The reference spread — about €85,000/MW/yr for a 2h asset in 2025', '基准价差 — 2025年2小时资产约每MW每年€85,000'] },
    { id: 'Intraday',  n: ['Intraday continuous and auctions', '日内连续交易与拍卖'],
      when: ['Continuous to 5 minutes before delivery', '连续交易至交割前5分钟'],
      fit: ['Where the volatility premium is captured; no published split', '波动性溢价的捕获环节；无公开拆分数据'] },
    { id: 'Redispatch', n: ['Redispatch 2.0', '再调度2.0'],
      when: ['TSO-instructed, close to real time', '由输电运营商指令，接近实时'],
      fit: ['Whether and how storage is compensated is NOT published', '储能是否以及如何获得补偿并未公开'] },
  ],

  /* Four TSO control zones. Used as the pipeline region column and as the
     locational frame the StromVKG auction's north/south split runs on. */
  regions: [
    { id: '50Hertz',    n: ['50Hertz — north and east', '50Hertz — 北部与东部'],  note: ['Grid-technical north; at least a third of capacity awards are reserved for it', '电网技术意义上的北部；至少三分之一的容量中标须分配于此'] },
    { id: 'TenneT',     n: ['TenneT — north to south corridor', 'TenneT — 南北走廊'], note: ['Carries SuedLink and SuedOstLink; spans both sides of the auction split', '承载SuedLink与SuedOstLink；横跨拍卖分区两侧'] },
    { id: 'Amprion',    n: ['Amprion — west', 'Amprion — 西部'],                  note: ['Ultranet and A-Nord landing zone; industrial load centre', 'Ultranet与A-Nord落点区；工业负荷中心'] },
    { id: 'TransnetBW', n: ['TransnetBW — south-west', 'TransnetBW — 西南部'],     note: ['South of the auction line; bids evaluated after a €16,000/MW deduction', '位于拍卖分界线以南；投标须先扣减每MW €16,000后再评估'] },
  ],

  overall: { confidence: 61, codWindow: '2028–2030',
    rationale: ['Europe\'s most active BESS financing market and the one with the least contracted revenue available to the asset being modelled. The capacity mechanism exists and a four-hour battery is ineligible for it. The ancillary leg that pays for 55% of revenue today is forecast to fall to about 5%. What is left is a merchant position whose realised revenue moved 2.5× in one quarter, and a tolling market where no price has ever been disclosed. Commit capital against a toll, a quantified Baukostenzuschuss and a pre-2029 commissioning date — not against a spread forecast.',
                '欧洲储能融资最活跃的市场，同时也是本页所建模资产可获得的合同化收入最少的市场。容量机制确实存在，而四小时电池不具备资格。当前贡献55%收入的辅助服务收入，预计将降至约5%。剩下的是一个实际收入在单季度内波动2.5倍的市场化头寸，以及一个从未披露过价格的租赁市场。资本应基于租赁合约、已量化的并网工程费分摊与2029年前的投运日期投入，而非基于价差预测。'] },

  // ---- merchant revenue ----
  /* One optimiser's REALISED 2h book, annualised, in €/MW/yr. Three consecutive
     months, three published cycle counts. This is the single most important
     series on the dashboard: it moved 2.5× in one quarter with the same assets
     and the same operator. */
  realLabels: ['Oct-25', 'Nov-25', 'Dec-25'],
  realSeries: [264955, 142727, 107556],
  realCycles: [1.58, 1.12, 0.93],

  /* Modo's published 2h figures, €k/MW/yr, near-term against lifetime-levelised.
     The gap between the first bar and the rest is the whole argument for taking
     the levelised number into a fifteen-year model. */
  revBasisLabels: ['2026 near-term', 'Levelised low', 'Levelised central', 'Converged 2030'],
  revBasisSeriesK: [240, 70, 122.5, 125],

  /* Published spread → executable margin, €/MWh discharged, on a four-hour
     asset. The optimiser fee is deliberately NOT a step here: the model applies
     it once, as lab.optFee, and deducting it twice is the most common way this
     bridge is misread. The duration-capture step is the derived 0.75 factor. */
  spreadBridge: [
    { l: ['Day-ahead TB2 spread, 2h basis (Modo forward assumption)', '日前TB2价差，2小时口径（Modo远期假设）'], v: 95, t: 'start' },
    { l: ['Intraday continuous re-optimisation across the later gates', '在后续交易关闸前的日内连续再优化'], v: 72, t: 'd' },
    { l: ['aFRR and FCR capacity payments, blended onto discharged MWh', 'aFRR与FCR容量收入，折算至放电MWh'], v: 52, t: 'd' },
    { l: ['Round-trip efficiency loss (88%)', '往返效率损失（88%）'], v: -22, t: 'd' },
    { l: ['Availability and outages (97%)', '可用率与停机（97%）'], v: -6, t: 'd' },
    { l: ['Duration-capture decay, 2h → 4h (factor 0.75)', '时长捕获衰减，2小时→4小时（系数0.75）'], v: -43, t: 'd' },
    { l: ['Executable margin before the optimiser fee', '扣除优化商费用前的可执行价差'], v: 148, t: 'total' },
  ],

  /* Captured spread by COD year, €/MWh, four-hour basis. The central path is the
     lab seed multiplied by the dilution factor below, so the two never disagree.
     Low and high are the December 2025 and October 2025 realised months, scaled
     to four hours on the same 1.50× basis comparison.js uses. */
  codCases: { 2028: { low: 130, central: 148, high: 327 }, 2029: { low: 122, central: 139, high: 307 }, 2030: { low: 114, central: 130, high: 288 } },
  /* Modo's April 2026 update cut lifetime revenues 16% across the curve with the
     largest cuts from 2028, and has the ancillary leg falling from 55% of
     revenue to about 5% by 2030. */
  dilution: { 2028: 1.00, 2029: 0.94, 2030: 0.88 },

  // ---- ancillary ----
  /* Ancillary share of German BESS revenue. 2026 is the sourced 55%; 2030 is
     Modo's forecast that wholesale arbitrage reaches 95%, which is the same
     statement read from the other side. */
  ancShareLabels: ['2025 (independent read)', '2026', '2030 (Modo forecast)'],
  ancShareSeries: [67, 55, 5],

  evidenceLadder: [
    { n: ['1 · regelleistung.net tender results and SMARD dispatch data', '1 · regelleistung.net招标结果与SMARD调度数据'],
      d: ['FCR, aFRR and mFRR clearing volumes and day-ahead prices are published and complete. This is the only tier that is fact.', 'FCR、aFRR与mFRR的出清电量及日前价格均已公布且完整。这是唯一属于事实的层级。'] },
    { n: ['2 · The asset\'s own connection point and Baukostenzuschuss assessment', '2 · 该资产自身的并网点与并网工程费分摊评估'],
      d: ['BKZ is set by the local network operator and ranges from about €110,000/MW to €165,000/MW on reported tariffs. A national average is not a substitute for the operator\'s own quotation.', 'BKZ由当地电网运营商确定，已报告费率介于每MW约€110,000至€165,000之间。全国平均值不能替代该运营商自身的报价。'] },
    { n: ['3 · Reproducible optimiser backtest on this asset and this node', '3 · 针对该资产与该节点的可复现优化器回测'],
      d: ['Realised German books move 2.5× in a quarter. Ask for the monthly series and the cycle counts, not the annual headline.', '德国实际运营账簿单季度波动达2.5倍。应索取月度序列与循环次数，而非年度概要数字。'] },
    { n: ['4 · Prequalification status per product and per direction', '4 · 按产品与方向分别确认的预认证状态'],
      d: ['About 580 MW of battery is prequalified for aFRR — roughly 30% of the operational fleet. Prequalification for FCR is not prequalification for aFRR.', '约580MW电池已取得aFRR预认证，约占在运机组的30%。取得FCR资格并不等于取得aFRR资格。'] },
    { n: ['5 · Executed tolling agreement', '5 · 已签署的租赁协议'],
      d: ['The only tier that changes the risk profile rather than the estimate — and the only tier whose price has never been published for any German deal.', '唯一改变风险结构而非改变估算值的层级 — 也是德国任何交易均从未公布价格的层级。'] },
  ],

  // ---- capacity channel: the mechanism exists and excludes this asset ----
  /* NOT the flat-1 curve Romania and the NEM declare for markets with no
     mechanism. Germany's StromVKG publishes a de-rating factor of 0.58 at ten
     hours and 0.85 at twenty, and admits nothing shorter. Zero below ten hours
     is the eligibility floor, stated as a model input rather than as prose:
     move the lab to ten hours and the capacity line appears, because at ten
     hours it exists. */
  deratingCurve: { 1: 0, 2: 0, 4: 0, 8: 0, 10: 0.58, 20: 0.85 },
  /* No post-contract re-award price is observable — the first 15-year contracts
     will not expire until 2041. Modo's €10–15k/MW/yr from 2031 is an assumption
     about a scheme segment that does not yet exist and is carried in `official`
     as `capAssume*`, not here. */
  futureCapFactor: 0,

  // ---- duration ----
  /* Four hours across all three COD years. Modo's 13.7% four-hour IRR beats
     12.2% at two hours despite 33.6% more capex, and Fluence reports its German
     book shifting from 2h to 4h. The archetype does not move within this window;
     the ten-hour capacity floor sits far outside it. */
  durationPath: { years: ['2028', '2029', '2030'], hours: [4, 4, 4] },
  durConfigs: [2, 4, 6, 8, 10],
  /* The 2h and 4h points are derived, not assumed: comparison.js scales 2h
     revenue to 4h by 1.50×, and a four-hour asset discharges twice the energy,
     so per MWh it captures 1.50 / 2 = 0.75 of the two-hour rate. The 1h, 6h, 8h,
     10h and 20h points are illustrative extrapolations on the same curve shape.
     The 10h point matters only because the capacity market starts there. */
  durSpreadFactor: { 1: 1.15, 2: 1.00, 4: 0.75, 6: 0.62, 8: 0.55, 10: 0.48, 20: 0.30 },
  /* Usable energy as a fraction of nameplate — a state-of-charge window.
     Distinct from the ≥92% round-trip efficiency StromVKG applies as an
     eligibility test, which is a different measurement of a different thing. */
  usableFraction: 0.94,
  /* 2h → 4h, €k per nameplate MW per year, on this dashboard's own seed.
     Incremental capex is €935,000 − €700,000 = €235,000/MW, annualised over a
     20-year life at 8% (annuity factor 0.10185) ≈ €24k/MW/yr. */
  marginalHour: [
    { l: ['Incremental arbitrage — double the energy at 75% of the 2h capture rate', '增量套利 — 能量翻倍，捕获率为2小时的75%'], v: 59, t: 'd' },
    { l: ['Ancillary — power-based, does not scale with duration', '辅助服务 — 功率型，不随时长增长'], v: 0, t: 'd' },
    { l: ['Optimiser fee on the larger merchant line (9%)', '更大市场化收入对应的优化商费用（9%）'], v: -5, t: 'd' },
    { l: ['StromVKG capacity payment — nothing is paid below ten hours', 'StromVKG容量付费 — 十小时以下不予支付'], v: 0, t: 'd' },
    { l: ['Annualised incremental capex (€235k/MW, 20 yr at 8%)', '年化增量资本开支（每MW €235k，20年，8%）'], v: -24, t: 'd' },
    { l: ['Degradation and incremental opex', '衰减与增量运维'], v: -2, t: 'd' },
    { l: ['Net marginal value, hours 3–4', '第3–4小时净边际价值'], v: 28, t: 'total' },
  ],
  durFactors: [
    { n: ['Midday solar trough depth and negative-price hours', '午间光伏低谷深度与负电价小时数'], w: 16, s: 3 },
    { n: ['Evening ramp and residual load after the coal exit', '煤电退出后的晚间爬坡与净负荷'], w: 12, s: 2 },
    { n: ['Realised 4h versus 2h project IRR gap (13.7% vs 12.2%)', '4小时与2小时项目实际IRR差距（13.7%对12.2%）'], w: 14, s: 3 },
    { n: ['4h capex premium: +33.6% capex for +100% energy', '4小时造价溢价：造价+33.6%换取能量+100%'], w: 12, s: 3 },
    { n: ['StromVKG ten-hour eligibility floor', 'StromVKG十小时资格门槛'], w: 12, s: 1 },
    { n: ['Fleet duration lengthening (1.4h toward 2h+)', '机组时长延长（1.4小时趋向2小时以上）'], w: 10, s: 2 },
    { n: ['Ancillary revenue does not pay for duration', '辅助服务收入不为时长付费'], w: 10, s: 1 },
    { n: ['Spread-capture decay at longer duration', '更长时长的价差捕获衰减'], w: 8, s: 1 },
    { n: ['Flagship tolled asset already above 2h (Förderstedt, 2.33h)', '旗舰租赁项目已超过2小时（Förderstedt，2.33小时）'], w: 6, s: 2 },
  ],
  durBands: [
    { lo: 0, hi: 34, n: ['Shallow-shift market', '浅移峰市场'], c: 'info',
      d: ['1–2h suffices; MWh added beyond that is unpaid capital.', '1–2小时已足够；超出部分的MWh属无回报资本。'] },
    { lo: 35, hi: 54, n: ['2h merchant zone', '2小时市场化区间'], c: 'warn',
      d: ['Underwrite 2h; treat the third and fourth hours as option value only.', '按2小时测算；第三、第四小时仅作期权价值。'] },
    { lo: 55, hi: 69, n: ['Transition to 4h', '向4小时过渡'], c: 'serious',
      d: ['Build 4h only where the marginal-hour NPV clears without a contracted line.', '仅当边际小时NPV在无合同化收入的情况下仍为正时，才按4小时建设。'] },
    { lo: 70, hi: 100, n: ['4h+ duration-driven', '4小时以上时长驱动'], c: 'good',
      d: ['4h is the default new-build. Test 10h separately and only against the capacity auction, never against the spread.', '4小时为新建默认设计。10小时须单独检验，且只能对照容量拍卖，绝不可对照价差。'] },
  ],
  augItems: [
    ['Land reserved for additional enclosures', '预留新增电池舱用地'],
    ['DC collection and containerised expansion capacity', '直流汇集与集装箱式扩容能力'],
    ['Transformer and switchgear headroom', '变压器与开关设备裕度'],
    ['PCS and EMS compatibility with added MWh', 'PCS与EMS对新增MWh的兼容性'],
    ['Connection agreement covers the added MWh without a new Baukostenzuschuss', '并网协议覆盖新增MWh且无需重新缴纳BKZ'],
    ['Grid fee exemption or AgNes grandfathering survives the augmentation', '增容后电网费用豁免或AgNes祖父条款仍然有效'],
    ['Prequalification retained across products after the change', '变更后仍保留各产品的预认证资格'],
    ['Planning and BImSchG approval headroom', '规划与《联邦排放控制法》许可裕度'],
    ['OEM warranty continuity and local-content compliance', 'OEM质保延续与本地化成分合规'],
    ['Tolling counterparty consent to augmentation', '租赁交易对手对增容的同意'],
  ],
  augDefaults: [2, 2, 1, 2, 1, 1, 1, 1, 1, 1],

  // ---- pipeline ----
  /* The probability step that matters is `toll`. An executed tolling agreement
     is the German equivalent of a contracted route, and it is scored well below
     construction because banks will not finance beyond 80% contracted revenue —
     a toll is necessary for debt, not sufficient for it. */
  stages: [
    { id: 'op',   n: ['Operating and dispatching', '已投运并参与调度'], p: 100 },
    { id: 'comm', n: ['Commissioning / phased block energisation', '调试中/分块送电'], p: 92 },
    { id: 'con',  n: ['Under construction, financial close reached', '在建，已融资交割'], p: 88 },
    { id: 'toll', n: ['Tolling agreement executed, pre-FID', '已签租赁协议，未作最终投资决策'], p: 62 },
    { id: 'grid', n: ['Grid connection agreement signed, BKZ quantified', '已签并网协议，BKZ已量化'], p: 45 },
    { id: 'app',  n: ['Connection application lodged', '已提交并网申请'], p: 15 },
    { id: 'ann',  n: ['Announced only', '仅公告'], p: 6 },
  ],
  /* Förderstedt is a real, publicly announced project and is named. Everything
     else is a seed example and is labelled as one. No published average German
     grid-scale project size exists — see notPublished. */
  projects: [
    { n: 'Förderstedt (Next Kraftwerke / ECO STOR)', owner: 'ECO STOR', region: '50Hertz', site: 'Saxony-Anhalt', mw: 300, h: 2.33, cod: 2027, st: 'con' },
    { n: 'DE seed example A', region: '50Hertz',    mw: 100, h: 2, cod: 2027, st: 'op' },
    { n: 'DE seed example B', region: 'Amprion',    mw: 150, h: 4, cod: 2027, st: 'comm' },
    { n: 'DE seed example C', region: 'TenneT',     mw: 200, h: 4, cod: 2028, st: 'con' },
    { n: 'DE seed example D', region: '50Hertz',    mw: 250, h: 4, cod: 2028, st: 'toll' },
    { n: 'DE seed example E', region: 'Amprion',    mw: 120, h: 4, cod: 2028, st: 'toll' },
    { n: 'DE seed example F', region: 'TenneT',     mw: 300, h: 4, cod: 2029, st: 'toll' },
    { n: 'DE seed example G', region: 'TransnetBW', mw: 100, h: 4, cod: 2029, st: 'grid' },
    { n: 'DE seed example H', region: '50Hertz',    mw: 400, h: 4, cod: 2029, st: 'grid' },
    { n: 'DE seed example I', region: 'TenneT',     mw: 200, h: 10, cod: 2030, st: 'app' },
    { n: 'DE seed example J', region: 'Amprion',    mw: 350, h: 4, cod: 2030, st: 'app' },
    { n: 'DE seed example K', region: 'TransnetBW', mw: 150, h: 2, cod: 2030, st: 'ann' },
  ],


  /* ---- named transmission ------------------------------------------------
     The four HVDC corridors that carry northern wind to southern load. All four
     are reported as running late, which is why the status column says so rather
     than repeating the target year. */
  reinforcements: [
    { n: ['Ultranet', 'Ultranet'], operator: 'Amprion / TransnetBW', region: ['NRW → Baden-Württemberg', '北威州 → 巴符州'], gw: 2,
      cls: 'approved', scope: ['2 GW HVDC, Osterath to Philippsburg, fully approved 31 October 2025', '2GW高压直流，Osterath至Philippsburg，2025年10月31日全面核准'],
      year: 2026, status: ['Approved; COD end 2026, reported late', '已核准；预计2026年底投运，据报延期'], c: 'warn' },
    { n: ['SuedOstLink', 'SuedOstLink'], operator: '50Hertz / TenneT', region: ['Saxony-Anhalt → Bavaria', '萨安州 → 巴伐利亚'], gw: 2,
      cls: 'approved', scope: ['2 GW, 525 kV, Wolmirstedt to Isar; final section approved 25 July 2025', '2GW，525千伏，Wolmirstedt至Isar；最后一段于2025年7月25日核准'],
      year: 2027, status: ['Under construction, reported late', '在建，据报延期'], c: 'serious' },
    { n: ['A-Nord', 'A-Nord'], operator: 'Amprion', region: ['Lower Saxony → NRW', '下萨克森 → 北威州'], gw: 2,
      cls: 'construction', scope: ['~2 GW, Emden to Osterath', '约2GW，Emden至Osterath'],
      year: 2027, status: ['Under construction, reported late', '在建，据报延期'], c: 'serious' },
    { n: ['SuedLink', 'SuedLink'], operator: 'TenneT / TransnetBW', region: ['Schleswig-Holstein → Bavaria', '石荷州 → 巴伐利亚'], gw: 4,
      cls: 'construction', scope: ['~4 GW over ~700 km, Brunsbüttel and Wilster to Grafenrheinfeld; first underground cable section completed 2026', '约4GW、约700公里，Brunsbüttel与Wilster至Grafenrheinfeld；首段地下电缆已于2026年完成'],
      year: 2028, status: ['Under construction, COD end 2028, reported late', '在建，预计2028年底投运，据报延期'], c: 'critical' },
    { n: ['Netzentwicklungsplan / Bundesbedarfsplan', '电网发展规划 / 联邦需求规划'], operator: 'Übertragungsnetzbetreiber, confirmed by Bundesnetzagentur', region: ['Germany', '德国全境'], gw: null,
      cls: 'programme', scope: ['The statutory planning framework the four corridors sit inside, and the source of everything scheduled after them', '四条走廊所处的法定规划框架，也是其后所有工程安排的来源'],
      year: 2045, status: ['A confirmed plan, not a commissioning date — the weakest relief evidence here', '已确认的规划而非投运日期 — 本表中证据力最弱'], c: 'serious' },
  ],

  /* Germany's status vocabulary. Note how little it separates: four corridors,
     two classes, and every one of them reported late. That uniformity is the
     finding, and the card's `why` says so rather than manufacturing a spread. */
  planClasses: [
    { id: 'approved',     n: ['Fully approved', '已全面核准'], c: 'warn',
      d: ['Planning approval (Planfeststellung) complete on every section. The strongest class here — and it still has not stopped the date from slipping.', '各区段的规划核准程序均已完成。这是本表最强的类别 — 但仍未能阻止日期推迟。'] },
    { id: 'construction', n: ['In construction', '在建'], c: 'serious',
      d: ['Physically underway; approval is not stated as complete on every section. Works exist, but the corridor is not fully de-risked.', '已实际开工；但并未说明各区段核准均已完成。工程实体存在，但走廊风险尚未完全出清。'] },
    { id: 'programme',    n: ['Statutory plan', '法定规划'], c: 'serious',
      d: ['Confirmed need under the Bundesbedarfsplan and the network development plan. Establishes that a reinforcement will happen, not when.', '依《联邦需求规划》与电网发展规划确认的需求。它确立增容工程将会发生，但不确立何时发生。'] },
  ],

  /* ---- coverage gaps, rendered verbatim on the Data & Methodology tab ----
     Not a caveat list. Each row is a number this dashboard is asked for and
     cannot supply, with what it uses instead. */
  notPublished: [
    { item: ['German toll fee, any deal', '德国租赁费用，任何交易'],
      status: ['Never disclosed, in any transaction', '从未披露，任何交易均无'],
      why: ['Next Kraftwerke / ECO STOR at Förderstedt, Next Kraftwerke / ju:niz Energy, and every other German toll announced in 2025 and 2026 were published without a price. Aurora and Modo do not publish one either.',
            'Next Kraftwerke与ECO STOR的Förderstedt项目、Next Kraftwerke与ju:niz Energy的交易，以及2025与2026年公告的其他所有德国租赁交易，均未披露价格。Aurora与Modo也未公布。'],
      instead: ['A bracket derived from Modo\'s published breakeven analysis: €95k/MW/yr where merchant starts to beat tolling at the floor, and €115k scaled by the 4h capex ratio at the ceiling. Tenors are disclosed and are used directly.',
                '依据Modo公布的盈亏平衡分析推导区间：下限为市场化开始优于租赁的每MW每年€95k，上限为€115k按4小时造价比率折算。期限已披露并直接采用。'] },
    { item: ['German fixed opex, €/MW/yr', '德国固定运维成本，每MW每年'],
      status: ['No published series', '无公开序列'],
      why: ['Only percentage-of-capex rules of thumb from low-authority trade sources exist — 1.2–1.4% for top operators, 2.0–2.5% typical. No German operator publishes a euro figure.',
            '仅存在低权威度行业来源给出的“占造价百分比”经验值 — 头部运营商1.2–1.4%，行业普遍2.0–2.5%。无任何德国运营商公布欧元金额。'],
      instead: ['€17,000/MW/yr, about 1.8% of the €935k 4h capex, sitting mid-range. Grid fees are excluded because storage commissioned before 4 August 2029 is exempt.',
                '采用每MW每年€17,000，约为4小时€935k造价的1.8%，处于区间中部。不含电网费用，因为2029年8月4日前投运的储能可获豁免。'] },
    { item: ['German degradation rate, %/yr', '德国衰减率，每年%'],
      status: ['Not published', '未公布'],
      why: ['No German operator, OEM or analyst publishes a measured German degradation series.',
            '德国无任何运营商、设备商或分析机构公布实测衰减序列。'],
      instead: ['2%/yr, the platform seed held constant across every market so that cross-market comparison is not driven by an unobserved input.',
                '采用每年2%，为各市场统一的平台种子值，以避免跨市场比较被未观测输入所驱动。'] },
    { item: ['German optimiser / route-to-market fee, %', '德国优化商/售电路径服务费率，%'],
      status: ['No German disclosure', '德国无披露'],
      why: ['Germany has the deepest third-party optimisation market in Europe and not one fee percentage has been published.',
            '德国拥有欧洲最深的第三方优化服务市场，却无一项费率被公布。'],
      instead: ['9%, the midpoint of the platform\'s 8–10% cross-market seed, widened to 6–12% in the comparison bands.',
                '采用9%，为本平台跨市场种子区间8–10%的中值；对比区间中扩展为6–12%。'] },
    { item: ['4h-specific merchant revenue', '4小时资产的市场化收入'],
      status: ['Not published — 4h capex and 4h IRR are, 4h revenue is not', '未公布 — 已公布4小时造价与4小时IRR，未公布4小时收入'],
      why: ['Modo publishes 2h revenue, and separately publishes 4h capex (€935k/MW) and 4h unlevered IRR (13.7%). It does not publish the revenue figure that reconciles them.',
            'Modo公布了2小时收入，并另行公布4小时造价（每MW €935k）与4小时无杠杆IRR（13.7%）。但未公布可将两者调和的收入数值。'],
      instead: ['A 1.50× duration scalar derived from the two figures that ARE published for both durations: capex 1.336× and IRR 1.123×, whose product is 1.50. Every 4h revenue figure on this dashboard depends on it, so it is stated rather than buried.',
                '采用1.50倍时长折算系数，由两个确已就两种时长公布的数值推导：造价1.336倍与IRR 1.123倍，两者乘积为1.50。本看板所有4小时收入数值均依赖该系数，故明示而非隐含。'] },
    { item: ['Whether the published capex includes the Baukostenzuschuss', '已公布造价是否包含并网工程费分摊（BKZ）'],
      status: ['Unresolved — a 12–24% swing on capex', '未解决 — 对造价的影响幅度达12–24%'],
      why: ['Reported BKZ tariffs run from about €110,000/MW at Mitnetz Strom to about €165,000/MW at SWM Infrastruktur in Munich. Against €935k/MW at 4h that is 12%; against €700k/MW at 2h it is 24%. No source states whether it is already inside the capex.',
            '已报告的BKZ费率从Mitnetz Strom的每MW约€110,000到慕尼黑SWM Infrastruktur的每MW约€165,000不等。相对4小时每MW €935k为12%，相对2小时每MW €700k为24%。无任何来源说明其是否已包含在造价之内。'],
      instead: ['The capex seed is carried as published and the BKZ is added at the TOP of the capex band, not to the seed. Adding a cost that may already be inside it would overstate German capex by up to 18%.',
                '造价种子值按公布口径采用，BKZ加至造价区间的上限而非种子值。若重复计入已包含的成本，将使德国造价被高估最多18%。'] },
    { item: ['Momentanreserve MWs-per-MW registration factor', 'Momentanreserve每MW可注册的MWs系数'],
      status: ['Not published — the two available figures differ threefold', '未公布 — 现有两个数值相差约三倍'],
      why: ['A bottom-up derivation from the published tender price gives €6,038/MW/yr: €805/MWs/yr at 90% availability is €3,019, doubled because a battery supplies positive and negative inertia simultaneously. Modo publishes €8–20k/MW/yr for the same product. The registration factor that would reconcile them is not published.',
            '依据公开招标价格自下而上推算得每MW每年€6,038：90%可用率下每MWs每年€805对应€3,019，因电池可同时提供正负惯量而翻倍。Modo就同一产品公布每MW每年€8–20k。可调和两者的注册换算系数未予公布。'],
      instead: ['The derivable end. The seed is €6,038/MW/yr and the band carries the upside to €20,000 — see comparison.js.',
                '采用可推导的一端。种子值为每MW每年€6,038，区间上限延伸至€20,000 — 详见comparison.js。'] },
    { item: ['Whether and how BESS is compensated under Redispatch 2.0', '储能在Redispatch 2.0机制下是否及如何获得补偿'],
      status: ['Could not be verified from public sources', '无法通过公开来源核实'],
      why: ['Optimiser stacks list redispatch as one of the five daily gate closures, which implies participation. Redispatch compensation reaches the curtailed generator; the basis on which storage is paid for relieving a constraint is not published.',
            '优化商的收入堆栈将再调度列为五个每日交易关闸之一，说明储能确有参与。再调度补偿支付给被限电的发电方；储能因缓解约束而获得报酬的口径并未公布。'],
      instead: ['Nothing. No redispatch revenue line exists anywhere in this model. A congestion revenue line would be modelling a payment that has not been shown to exist.',
                '不作任何替代处理。本模型任何位置均无再调度收入项。设置拥塞收入项等于对一项尚未证实存在的付款进行建模。'] },
    { item: ['Average German grid-scale project size, MW', '德国电网级项目平均规模，MW'],
      status: ['Not published', '未公布'],
      why: ['The Marktstammdatenregister publishes installed capacity and system duration but not a grid-scale size distribution separated from residential and C&I.',
            '市场主体数据登记册公布装机容量与系统时长，但未提供将户用与工商业分离后的电网级规模分布。'],
      instead: ['100 MW as a modelling convention, stated as such. Förderstedt at 300 MW is the largest named German toll and is carried as a named project, not as an average.',
                '按建模惯例采用100MW，并明确标示。300MW的Förderstedt是已具名的最大德国租赁项目，作为具名项目而非平均值使用。'] },
    { item: ['mFRR clearing prices', '三次调频（mFRR）出清价格'],
      status: ['No clearing price data found', '未找到出清价格数据'],
      why: ['FCR and aFRR price movements are reported; no mFRR price series was located for the review period.',
            'FCR与aFRR的价格变动有公开报道；本次审阅期内未找到mFRR价格序列。'],
      instead: ['mFRR is described structurally on the services tab and carries no revenue in the model. An unpriced market is not a zero-value market, and the dashboard says so rather than implying either.',
                'mFRR在服务页仅作结构性描述，在模型中不计任何收入。无价格的市场不等于零价值市场，看板对此明确说明，而非暗示其中任一结论。'] },
  ],

  lab: {
    /* ---- capital structure. Seeded neutral: nothing here moves a published
       return until it is set. VAT is recoverable, so it costs only timing, and
       the Lab leaves the refund lag to the engine. */
    /* Baukostenzuschuss: a connection charge of up to €140,000/MW that BESS pays
       because it draws from the grid, applied inconsistently across DSOs and
       upheld by the courts. Seeded at zero because whether the €935k/MW capex
       already includes it is unresolved — gate G19 — so adding it here would
       risk counting it twice. Set it once that is settled. */
    connectionPerMW: 0,
    vatPct: 19, vatRecoverable: 1,
    devCostPct: 0, rtbPremiumPct: 0, constructionMonths: 12,
    /* 100 MW is a modelling convention — no published German average exists.
       Four hours is not a convention: it is the duration Modo's own 13.7% IRR is
       computed on.

       capexKWh 117.5 + capexKW 465 is the exact decomposition of Modo's two
       published points. Solving 2·e + p = 700 and 4·e + p = 935 gives e = 117.5
       and p = 465, so the seed reproduces BOTH published capex figures rather
       than fitting one and approximating the other.

       spread 148 €/MWh is a blended executable margin across all five daily
       gates, not a day-ahead spread. At 4h it reproduces comparison.js's
       €183,750/MW/yr merchant seed to within 0.3%. cycles 1.2 is the mean of the
       three realised monthly cycle counts (1.58, 1.12, 0.93). */
    mw: 100, hours: 4, capexKWh: 117.5, dcQuoteKWh: landedDcPerKWh('EUR'), capexKW: 465, opexKW: 17,
    rte: 88, avail: 97, degr: 2.0, cycles: 1.2, spread: 148, optFee: 9,
    /* The published StromVKG price cap, per MW of DE-RATED capacity, on 15-year
       contracts. It buys nothing at four hours because `deratingCurve` is zero
       below ten — which is the point. Move hours to 10 and the line appears. */
    capPrice: 244, capYrs: 15, servicesKW: 6.04, grantPct: 0,
    life: 20, disc: 8, debtPct: 60, rate: 5.5, tenor: 15,
  },

  glossary: [
    ['Stromversorgungssicherheits- und Kapazitätsgesetz (StromVKG)', '《电力供应安全与容量法》（StromVKG）'],
    ['Bundesnetzagentur (BNetzA) — federal network regulator', '联邦网络管理局（BNetzA） — 联邦电网监管机构'],
    ['De-rated capacity and the ten-hour eligibility floor', '折减容量与十小时资格门槛'],
    ['Grid-technical north / south evaluation deduction', '电网技术北部/南部评标扣减'],
    ['Baukostenzuschuss (BKZ) — grid connection contribution', '并网工程费分摊（BKZ）'],
    ['Realisation deposit, credited against the later BKZ', '实现保证金，可抵扣后续BKZ'],
    ['AgNes — the framework for storage grid fees from 2029', 'AgNes — 2029年起适用的储能电网费用框架'],
    ['Grid fee exemption to 4 August 2029', '至2029年8月4日的电网费用豁免'],
    ['Redispatch 2.0', '再调度2.0'],
    ['Countertrading (Countertrading / Gegengeschäfte)', '反向交易'],
    ['Reserve power plants (Reservekraftwerke)', '备用电厂'],
    ['Frequency Containment Reserve (FCR / Primärregelleistung)', '一次调频备用（FCR）'],
    ['automatic Frequency Restoration Reserve (aFRR / Sekundärregelleistung)', '二次调频备用（aFRR）'],
    ['manual Frequency Restoration Reserve (mFRR / Minutenreserve)', '三次调频备用（mFRR）'],
    ['Momentanreserve — grid-forming instantaneous reserve', 'Momentanreserve — 构网型瞬时惯量备用'],
    ['MWs — megawatt-seconds, the inertia settlement unit', 'MWs — 兆瓦秒，惯量结算单位'],
    ['Marktstammdatenregister (MaStR)', '市场主体数据登记册（MaStR）'],
    ['Single bidding zone (Einheitliche Gebotszone)', '单一报价区'],
    ['Flexible connection agreement — capacity and ramp caps', '柔性并网协议 — 容量与爬坡上限'],
    ['Physical toll / virtual (financial) toll', '实物租赁/虚拟（金融）租赁'],
    ['TB2 — two-hour day-ahead spread benchmark', 'TB2 — 两小时日前价差基准'],
    ['50Hertz / Amprion / TenneT / TransnetBW — the four TSOs', '50Hertz/Amprion/TenneT/TransnetBW — 四家输电运营商'],
  ],

  kpiExport: [
    ['StromVKG first auction volume', 4500, 'MW', 'official', 'DE_SEED_V1', 'Bundesnetzagentur'],
    ['StromVKG price cap, de-rated capacity', 244000, 'EUR/MW/yr', 'official', 'DE_SEED_V1', 'Bundesnetzagentur'],
    ['StromVKG minimum continuous discharge', 10, 'h', 'official', 'DE_SEED_V1', 'Bundesnetzagentur'],
    ['StromVKG de-rating factor at 10h', 0.58, 'x', 'official', 'DE_SEED_V1', 'Bundesnetzagentur'],
    ['StromVKG de-rating factor at 20h', 0.85, 'x', 'official', 'DE_SEED_V1', 'Bundesnetzagentur'],
    ['Capacity revenue available to a 4h battery', 0, 'EUR/MW/yr', 'official', 'DE_SEED_V1', 'ineligible — 10-hour discharge test'],
    ['Modo near-term 2h merchant revenue, 2026', 240000, 'EUR/MW/yr', 'third party', 'DE_SEED_V1', 'Modo Energy Q2 2026'],
    ['Modo lifetime-levelised 2h central, low end', 115000, 'EUR/MW/yr', 'third party', 'DE_SEED_V1', 'Modo Energy Q2 2026'],
    ['Modo lifetime-levelised 2h central, high end', 130000, 'EUR/MW/yr', 'third party', 'DE_SEED_V1', 'Modo Energy Q2 2026'],
    ['Realised 2h revenue, October 2025', 264955, 'EUR/MW/yr', 'third party', 'DE_SEED_V1', 'optimiser monthly portfolio report'],
    ['Realised 2h revenue, November 2025', 142727, 'EUR/MW/yr', 'third party', 'DE_SEED_V1', 'optimiser monthly portfolio report'],
    ['Realised 2h revenue, December 2025', 107556, 'EUR/MW/yr', 'third party', 'DE_SEED_V1', 'optimiser monthly portfolio report'],
    ['2025 day-ahead-only component, 2h', 85000, 'EUR/MW/yr', 'third party', 'DE_SEED_V1', 'Modo Energy'],
    ['Ancillary share of BESS revenue, 2026', 55, '%', 'third party', 'DE_SEED_V1', 'Modo Energy'],
    ['Wholesale arbitrage share of revenue, 2030', 95, '%', 'third party forecast', 'DE_SEED_V1', 'Modo Energy'],
    ['Positive aFRR daily marginal price, 2026 to date', 15, 'EUR/MW/h', 'official', 'DE_SEED_V1', 'regelleistung.net'],
    ['aFRR price change versus same period 2025', -35, '%', 'official', 'DE_SEED_V1', 'regelleistung.net'],
    ['Battery capacity prequalified for aFRR', 580, 'MW', 'official', 'DE_SEED_V1', 'regelleistung.net'],
    ['aFRR volume procured by the TSOs', 2000, 'MW', 'official', 'DE_SEED_V1', 'regelleistung.net'],
    ['Battery capacity qualified for FCR', 800, 'MW', 'official', 'DE_SEED_V1', 'regelleistung.net'],
    ['FCR volume procured', 570, 'MW', 'official', 'DE_SEED_V1', 'regelleistung.net'],
    ['Momentanreserve premium price at 100% availability', 888.5, 'EUR/MWs/yr', 'official', 'DE_SEED_V1', 'German TSO joint tender'],
    ['Momentanreserve revenue, bottom-up derivation', 6038, 'EUR/MW/yr', 'calculated', 'DE_SEED_V1', 'dashboard — see Data & Methodology'],
    ['4h installed capital cost', 935000, 'EUR/MW', 'third party', 'DE_SEED_V1', 'Modo Energy Q2 2026'],
    ['2h installed capital cost', 700000, 'EUR/MW', 'third party', 'DE_SEED_V1', 'Modo Energy Q2 2026'],
    ['Baukostenzuschuss, reported low', 110000, 'EUR/MW', 'public', 'DE_SEED_V1', 'Mitnetz Strom tariff'],
    ['Baukostenzuschuss, reported high', 165000, 'EUR/MW', 'public', 'DE_SEED_V1', 'SWM Infrastruktur tariff'],
    ['Whether published capex includes the BKZ', 'not confirmed', '-', 'coverage gap', 'DE_SEED_V1', '12–24% swing on capex'],
    ['AgNes capacity-only grid fee from 4 Aug 2029', 5.65, 'EUR k/MW/yr', 'official draft', 'DE_SEED_V1', 'BNetzA AgNes — rolling five-year average high end'],
    ['4h unlevered IRR at 2026 COD', 13.7, '%', 'third party', 'DE_SEED_V1', 'Modo Energy Q2 2026'],
    ['2h unlevered IRR at 2026 COD', 12.2, '%', 'third party', 'DE_SEED_V1', 'Modo Energy Q2 2026'],
    ['Newly installed system duration, H1 2026', 2.3, 'h', 'official', 'DE_SEED_V1', 'BNetzA MaStR via IWR — includes residential and C&I'],
    ['Congestion management cost, 2025', 3.1, 'EUR bn', 'official', 'DE_SEED_V1', 'Bundesnetzagentur'],
    ['Downward redispatch volume, 2025', 15.5, 'TWh', 'official', 'DE_SEED_V1', 'Bundesnetzagentur'],
    ['PV curtailment, 2025', 2.7, 'TWh', 'official', 'DE_SEED_V1', 'Bundesnetzagentur'],
    ['Bidding zone split efficiency gain, 2025 target year', 339, 'EUR m', 'official forecast', 'DE_SEED_V1', 'ENTSO-E bidding zone review — rejected by Germany'],
    ['German toll fee, any deal', 'not disclosed', '-', 'coverage gap', 'DE_SEED_V1', 'no German transaction has published a price'],
    ['mFRR clearing price', 'not found', '-', 'coverage gap', 'DE_SEED_V1', 'no series located for the review period'],
  ],
};

export { M };
