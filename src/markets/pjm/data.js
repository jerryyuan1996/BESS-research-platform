import {SNAPSHOT_INTRO,US_ITC_TERM} from '../_shared/researchStatus.js';
import {HISTORY_DATA} from './historyData.js';
/* ---------------------------------------------------------------------------
   PJM — market dataset.

   Same shape as the NEM/DE/RO/PL datasets in this lineage: official snapshot
   values, scorecards, bands, duration curves, the project pipeline, lab defaults
   and the per-tab narrative inputs. Everything the shared engine draws comes
   from here.

   FIVE THINGS ABOUT THIS PARTICULAR DATASET.

   1. `deratingCurve` IS PJM's published ELCC class table, unmodified: 4-hr 59%,
      6-hr 68%, 8-hr 71%, 10-hr 78% for the 2028/2029 Base Residual Auction. No
      other market on this platform can populate this field from a primary source
      at every point. `durConfigs` therefore stops at four hours rather than two:
      the 2028/2029 class table publishes no rating below four, and `interp()`
      clamps, so offering a two-hour option would silently hand it the four-hour
      rating. A shorter PJM asset gets a resource-specific ELCC analysis, which
      is not a class rating and is not modellable here.

   2. The lab seed reproduces src/markets/pjm/comparison.js rather than restating
      it. capexKWh 187.04 + capexKW 587.84 is the NREL $334/kWh split on the
      platform's own capex-stack shares — 56% energy-scaling, 44% power-scaling —
      and reconciles to $1,336,000/MW exactly. capPrice 118.625 is $325.00/MW-day
      × 365 in $k. servicesKW 19.2 is comparison.js's $19,200 Regulation seed.
      spread 38 at one cycle a day reproduces its $50,336 arbitrage seed to
      within 0.5%.

   3. `futureCapFactor` 0.8149 is not a convention. It is the mean of the
      fourteen declared renewal years divided by the secured year — $57,035 over
      $69,989 — so the lab's post-secured capacity line and the comparison
      engine's renewal curve cannot disagree about what re-auctioned capacity is
      worth on average.

   4. The marginal-hour waterfall is NEGATIVE, and that is the finding rather
      than a data error. PJM pays more for duration than any market on this
      platform — nine ELCC points between four and six hours — and at US
      installed cost it still does not cover the incremental capex.

   5. Where a figure is not published anywhere — a PJM toll price, US fixed opex,
      the per-unit Regulation/arbitrage split, forward Regulation clearing prices,
      state equipment tax — this file does not invent one. Those gaps are carried
      explicitly in `notPublished` and rendered on the Data & Methodology tab.
   --------------------------------------------------------------------------- */

const M = {
  asOf: HISTORY_DATA.asOf,
  dataDate: HISTORY_DATA.dataDate,
  modelVersion: HISTORY_DATA.modelVersion,
  title: ['PJM Battery Investment Dashboard', 'PJM储能投资看板'],
  sub: ['Institutional investor storyline: market evolution, forward signals, project underwriting and portfolio application. RTO-wide capacity clearing; reference archetype 90 MW / 4h.',
        '面向机构投资人的投资叙事：市场演进、前瞻信号、项目承销与组合应用。容量按全RTO统一出清；参考原型为90MW/4小时。'],
  nextMilestone: ['Next milestone: the 2029/2030 Base Residual Auction in December 2026 — the last auction under the price collar, capped at $337.83/MW-day. After it the cap reverts to a Net CONE-based figure PJM estimates near $550/MW-day.',
                  '下一里程碑：2029/2030年度基准剩余容量拍卖，2026年12月举行 — 这是价格上下限机制下的最后一次拍卖，上限为每MW每日$337.83。此后价格上限将回归至PJM估算约每MW每日$550的净新增成本基准。'],
  footerNote: ['Public and official sources collected 3 August 2026. The capacity line is taken from two PJM primary documents and is not an estimate. The merchant line is: no PJM battery revenue index is published, no PJM toll price has ever been disclosed, no US fixed opex series exists, and the Regulation/arbitrage split is estimated from FERC filings by nineteen units. Every merchant figure in this build is derived, not quoted.',
               '公开及官方来源于2026年8月3日采集。容量收入项取自两份PJM官方原始文件，非估算值。市场化收入项则为估算：PJM未发布储能收入指数，从未披露任何PJM租赁价格，不存在美国固定运维成本序列，且调频与套利的拆分系依据十九台机组的FERC申报推算。本版本所有市场化数值均为推导值而非报价。'],
  seedWarn: [SNAPSHOT_INTRO[0]+"Three specific warnings: a Base Residual Auction secures ONE delivery year and everything after it on this page is an analyst scenario; the observed Regulation revenue of the current ~400 MW fleet is not available to a new entrant and is carried as a band ceiling, not a base case; and the §48E investment tax credit is seeded at zero here and is editable in the dedicated Investment Lab page, so returns on this page exclude it.",SNAPSHOT_INTRO[1]+"三点具体警示：基准剩余容量拍卖仅锁定一个实需年度，本页其后所有年份均属分析师情景假设；当前约400MW机组所观测到的调频收入对新进入者并不可得，故仅作为区间上限而非基准情形；§48E投资税收抵免在本页种子值为零、可在首页投资实验室中调整，因此本页收益率不含该抵免。"],

  /* ---- official / sourced snapshot -------------------------------------
     Only values that come from a named publication sit here. Illustrative
     series live further down and are badged as such wherever they render. */
  official: {
    // ---- RPM capacity market ----
    braPrice: HISTORY_DATA.official.braPrice, braDeliveryYear: HISTORY_DATA.official.braDeliveryYear, braDate: '14 July 2026',
    braUcapMW: 138318, braFrrMW: 10864, braTotalUcapMW: 149182,
    braShortMW: HISTORY_DATA.official.braShortMW, braValueBn: 16.4, braReserveMarginPct: 14.7,
    braNewMW: 525, braOfferedMW: 139595, braPrevClearedMW: 134585,
    braChangePct: -2.5, braSupplyTotalMW: 202288, braSupplyPrevMW: 200994,
    prevBraPrice: HISTORY_DATA.official.prevBraPrice, prevBraDeliveryYear: HISTORY_DATA.official.prevBraDeliveryYear, prevBraShortMW: HISTORY_DATA.official.prevBraShortMW,
    /* What the same auction would have cleared at with no collar. This is PJM's
       own published simulation and it is the single most important forward number
       on this tab. */
    uncappedSimRto: 529.80, uncappedSimDom: 542.83,
    collarAuctions: HISTORY_DATA.official.collarAuctions, collarLastDeliveryYear: HISTORY_DATA.official.collarLastDeliveryYear,
    nextBraDate: 'December 2026', nextBraDeliveryYear: '2029/2030',
    /* PJM planning parameters for the 2029/2030 BRA, posted 31 August 2026. The
       collar is re-derived per auction: the Reference Resource UCAP factor fell
       from 79% to 76%, which lifts the UCAP-denominated cap and floor. */
    nextBraCap: 337.83, nextBraFloor: 181.91,
    netConeEstimate: 550,
    backstopMonth: 'September', backstopSuspendedTo: '28 February 2027', bilateralServiceDate: '9 June 2026',
    // Footprint.
    states: 13, peopleM: 67, txMiles: 88417,
    // Supply mix, UCAP, 2028/2029 cleared plus FRR.
    mixGasPct: 46, mixNuclearPct: 20, mixCoalPct: 18, mixDrPct: 5,
    mixHydroPct: 4, mixWindPct: 2, mixOilPct: 2, mixSolarPct: 1,
    gasChangeMW: 5639, coalChangeMW: HISTORY_DATA.official.coalChangeMW, solarChangeMW: 651,

    // ---- ELCC accreditation ----
    elcc4h: 59, elcc6h: 68, elcc8h: 71, elcc10h: 78,
    elcc4hPrev: 58, elcc6hPrev: 67, elcc8hPrev: 70, elcc10hPrev: 78,
    elccOnshoreWind: 34, elccOffshoreWind: 60, elccFixedSolar: 7, elccTrackingSolar: 10,
    elccNuclear: 96, elccCoal: 85, elccCcgt: 78, elccCt: 67, elccDr: 91,

    // ---- Regulation ----
    regRedesignDate: '1 October 2025', regPhase2Date: 'October 2026',
    regMarketBeforeMW: HISTORY_DATA.official.regMarketBeforeMW, regMarketAfterMW: HISTORY_DATA.official.regMarketAfterMW,
    regPriceOct25: 129, regPriceSep25: 56, regPriceJun25: 55,
    regPricePeakLo: 66, regPricePeakHi: 83,
    regSpike5minAm: 750, regSpike5minPm: 1800,
    regPerKWMonthOct25: 48, regPerKWMonthJun25: 20, regHoursPerDay: 12,
    regPriceFeb26: 194, regPriceFeb26MultipleYoY: 5,

    // ---- observed fleet revenue ----
    idxPerKWMonthToSep25: 24, idxPerKWYrToSep25: 288,
    stackApr26Total: 72, stackApr26Reg: 56, stackApr26Arb: 11, stackApr26Cap: 5,
    peakPerKWMonthFeb26: 104.5,
    postRedesignAvgPerKWMonth: 62, preRedesignBaselinePerKWMonth: 20,
    eqrPerMWDay: 832, eqrPerKWYr: 304, eqrRegSharePct: 86, eqrUnits: 19,
    eqrQuarter: 'Q1 2025', eqrColdSnapPerMWDay: 3000,

    // ---- energy arbitrage ----
    tb4_2024: 46699, tb4_2025: 69375, tb4ChangePct: 49,
    tb4TopNodesVaMd: 16, tb4BottomNodesNj: 16, tb4NodeSample: 20,
    /* The capture stack applied to TB4 in comparison.js. */
    captureRtePct: 88, captureAvailPct: 97, captureForesightPct: 85,

    // ---- fleet and queue ----
    fleetMW: 400, distributedFleetMW: 198, distributedSites: 28,
    queueStorageGW: 67, queueSolarGW: 14, queueReopened: 'April 2026',
    tc1Projects: 21, tc1GW: 1.9,
    expected2030MW: 5000, ceiling2030GW: 7, expansionX: 17,

    // ---- capex and tax ----
    nrelPerKWh: 334, usEpcLoPerKWh: 230, usEpcHiPerKWh: 320,
    chinaLoPerKWh: 90, chinaHiPerKWh: 130,
    itcPct: 30, itcThroughYear: 2033, itcTransferCents: 93,
    itcDomesticAdderPct: 10, itcEnergyCommunityAdderPct: 10,
    itcEffectivePct: 27.9, itcCeilingPct: 37,
    feocFromYear: 2026, feocNotice: 'IRS Notice 2026-15',
  },

  /* The daily gate closures a PJM optimiser trades through, in order. Structure
     rather than price: no per-gate $/MW/yr decomposition is published for a PJM
     battery, which is exactly the gap `regShareGap` records. */
  gateCloses: [
    { id: 'RPM',        n: ['Reliability Pricing Model capacity commitment', 'RPM容量承诺'],
      when: ['Committed years ahead at the Base Residual Auction', '在基准剩余容量拍卖中提前数年承诺'],
      fit: ['The only line that is contracted, and it covers one delivery year', '唯一属于合同化的收入项，且仅覆盖一个实需年度'] },
    { id: 'Day-ahead',  n: ['Day-ahead energy and reserves', '日前电能量与备用'],
      when: ['Bids close 10:30 EPT for the following operating day', '美东时间10:30截标，交易次一运行日'],
      fit: ['Where the TB4 spread is set — about $69,375/MW/yr fleet-average in 2025', 'TB4价差在此形成 — 2025年机组平均约每MW每年$69,375'] },
    { id: 'Regulation', n: ['Regulation, single bidirectional signal', '调频，单一双向信号'],
      when: ['Hourly, cleared alongside energy', '按小时与电能量同时出清'],
      fit: ['The largest observed line and the one that closes: ~750 MW of requirement against a queue of 67 GW', '已观测收入中最大、也是将会关闭的一项：约750MW需求对应67GW排队量'] },
    { id: 'Real-time',  n: ['Real-time balancing energy', '实时平衡电能量'],
      when: ['Five-minute dispatch at the nodal LMP', '按节点边际电价五分钟调度'],
      fit: ['Modo put real-time arbitrage at $11/kW-month in April 2026', 'Modo数据显示2026年4月实时套利为每kW每月$11'] },
    { id: 'Reserves',   n: ['Synchronized and primary reserves', '同步备用与一次备用'],
      when: ['Cleared with energy', '与电能量同时出清'],
      fit: ['Consistently cleared BELOW Regulation over three years; no separate revenue line is modelled', '三年来出清价格持续低于调频；模型中不单列该收入'] },
  ],

  /* Locational Deliverability Areas, grouped. Used as the pipeline region column
     and as the frame for the nodal energy story. Note what these are NOT: the
     last three Base Residual Auctions cleared at ONE price for the entire RTO,
     so these areas do not differentiate capacity revenue at all. They
     differentiate the energy leg, and they differentiate it enormously. */
  regions: [
    { id: 'DOM',     n: ['Dominion — northern and central Virginia', 'Dominion — 弗吉尼亚北部与中部'],
      note: ['The data-centre load centre, and where the highest TB4 spreads sit. The uncapped 2027/2028 simulation cleared this zone above the RTO at $542.83/MW-day.', '数据中心负荷中心，TB4价差最高之处。2027/2028年度无上限模拟中，该区出清价$542.83/MW-日，高于全RTO水平。'] },
    { id: 'SWMAAC',  n: ['SWMAAC — BGE and Pepco, eastern Maryland and DC', 'SWMAAC — BGE与Pepco，马里兰东部及华盛顿特区'],
      note: ['With DOM, holds most of the twenty highest-spread nodes in the RTO.', '与DOM共同占据全RTO价差最高的二十个节点中的大部分。'] },
    { id: 'EMAAC',   n: ['EMAAC — PSEG, PECO, AECO and DPL, New Jersey and eastern Pennsylvania', 'EMAAC — PSEG、PECO、AECO与DPL，新泽西与宾州东部'],
      note: ['Holds most of the twenty LOWEST-spread nodes. A load pocket historically, and the clearest example of why a PJM site is underwritten nodally.', '占据价差最低二十个节点中的大部分。历史上属负荷孤岛，也是PJM项目须按节点承销的最清晰例证。'] },
    { id: 'ComEd',   n: ['ComEd — northern Illinois', 'ComEd — 伊利诺伊州北部'],
      note: ['Nuclear-heavy and separately constrained from the eastern RTO.', '核电占比高，与RTO东部之间存在独立约束。'] },
    { id: 'ATSI/AEP', n: ['ATSI and AEP — Ohio, Indiana and western Pennsylvania', 'ATSI与AEP — 俄亥俄、印第安纳与宾州西部'],
      note: ['Where the coal retirements that drove the capacity shortfall concentrate — coal fell 2,941 MW UCAP into the 2028/2029 auction.', '推动容量缺口的燃煤退役集中于此 — 2028/2029年度拍卖中燃煤UCAP减少2,941MW。'] },
    { id: 'APS',     n: ['APS — Allegheny, western Maryland and West Virginia', 'APS — 阿勒格尼、马里兰西部与西弗吉尼亚'],
      note: ['Generation-heavy and export-constrained toward the eastern load pockets.', '发电富余，向东部负荷孤岛送出受限。'] },
  ],

  overall: { confidence: 66, codWindow: '2029–2031',
    rationale: ['The best-published contracted revenue on this platform, attached to the worst-published merchant revenue, in a market whose queue is thirteen times its expected 2030 fleet. PJM prints both halves of the capacity payment — $325.00/MW-day and a 59% four-hour accreditation — so year one requires no estimate at all. Years two to fifteen require nothing but estimates, and two of them point in opposite directions: the price collar ends after 2029/2030 with the cap reverting toward $550/MW-day, while four-hour ELCC erodes as 67 GW of storage arrives. The merchant leg is where capital is lost, not made: the operating fleet earns Regulation revenue roughly thirteen times what this model publishes, because 400 MW is competing for a 750 MW requirement. Underwrite the capacity line, the node and the queue position. Do not underwrite the Regulation stack.',
                '本平台披露最完整的合同化收入，与披露最不充分的市场化收入并存，且该市场的排队量达其2030年预期装机的十三倍。PJM同时公布了容量收入的两个组成部分 — 每MW每日$325.00与四小时59%的核证系数 — 因此第一年完全无需估算。第二至十五年则全靠估算，且其中两项方向相反：价格上下限机制在2029/2030年度后结束、上限将回升至约$550/MW-日，而四小时ELCC则随67GW储能到位而下降。资本的亏损点在市场化收入端而非盈利点：在运机组的调频收入约为本模型所发布数值的十三倍，因为当前仅400MW在争夺750MW的系统需求。应基于容量收入、节点位置与排队位次承销，切勿基于调频收入结构承销。'] },


  // ---- capacity channel: fully published, and it expires ----
  /* PJM's ELCC class ratings for the 2028/2029 Base Residual Auction, verbatim.
     This is the only deratingCurve on the platform where every point is a primary
     source. It starts at four hours because the class table does — see the header
     note on why `durConfigs` starts there too. */
  deratingCurve: { 4: 0.59, 6: 0.68, 8: 0.71, 10: 0.78 },
  /* Mean of the fourteen declared renewal years over the secured year:
     $57,035 / $69,989. Derived, not chosen — see comparison.js. */
  futureCapFactor: 0.8149,

  /* The renewal path, split into the two things it is a claim about, so the
     capacity tab can plot them separately. Mirrors the RENEWAL table in
     comparison.js; that file is the source of truth for the payments. */
  renewalYears: ['2029/30', '2030/31', '2031/32', '2032/33', '2033/34', '2034/35', '2035/36',
                 '2036/37', '2037/38', '2038/39', '2039/40', '2040/41', '2041/42', '2042/43'],
  renewalPrice: [337.83, 500, 520, 470, 430, 400, 380, 380, 380, 380, 380, 380, 380, 380],
  renewalElcc: [57, 54, 50, 46, 42, 39, 36, 34, 32, 30, 29, 28, 27, 26],

  // ---- merchant: two legs that behave differently ----
  /* The observed fleet index, and the reason this dashboard does not publish it
     as a forecast. Three points, all sourced, all on the same $/kW-month basis. */
  obsLabels: ['To Sep 2025', 'Post-redesign avg', 'Feb 2026 peak'],
  obsSeries: [24, 62, 104.5],

  /* The April 2026 fleet stack, $/kW-month. The one published decomposition of a
     PJM battery's revenue into its three parts. Note that capacity at $5/kW-month
     annualises to $60,000/MW/yr against this model's $69,989 BRA derivation — an
     independent cross-check that lands within 15%. */
  stackLabels: ['Regulation', 'Real-time arbitrage', 'Capacity'],
  stackSeries: [56, 11, 5],

  /* TB4 spread → executable arbitrage margin, $/MW/yr, four-hour basis. The
     optimiser fee is deliberately NOT a step here: the model applies it once, as
     lab.optFee, and deducting it twice is the most common way this bridge is
     misread. */
  spreadBridge: [
    { l: ['TB4 spread, fleet average 2025 (perfect foresight)', 'TB4价差，2025年机组平均（完美预见性）'], v: 69375, t: 'start' },
    { l: ['Round-trip efficiency (88%)', '往返效率（88%）'], v: -8325, t: 'd' },
    { l: ['Availability and outages (97%)', '可用率与停机（97%）'], v: -1832, t: 'd' },
    { l: ['Imperfect foresight — TB4 is computed after the fact (85%)', '非完美预见性 — TB4为事后计算（85%）'], v: -8883, t: 'd' },
    { l: ['Executable arbitrage before the optimiser fee', '扣除优化商费用前的可执行套利收入'], v: 50336, t: 'total' },
  ],

  /* Regulation, forward. The five steps between what the fleet earns today and
     what a new entrant should underwrite. Every step is a published number. */
  regBridge: [
    { l: ['Observed fleet Regulation revenue (86% of the $288k index, estimated split)', '已观测机组调频收入（$288k指数的86%，拆分为估算值）'], v: 247680, t: 'start' },
    { l: ['Re-price from Oct 2025 scarcity ($129/MW/h) to pre-spike ($55/MW/h)', '价格由2025年10月稀缺水平（$129/MW·h）回归至飙升前（$55/MW·h）'], v: -7680, t: 'd' },
    { l: ['Requirement is fixed at ~750 MW; Phase 2 splits the signal, it does not grow it', '需求固定在约750MW；第二阶段仅拆分信号，并未扩大规模'], v: 0, t: 'd' },
    { l: ['Competing battery fleet 400 MW today → 5,000 MW by 2030', '竞争性储能机组由当前400MW增至2030年5,000MW'], v: -220800, t: 'd' },
    { l: ['Regulation available to a new entrant', '新进入者可获得的调频收入'], v: 19200, t: 'total' },
  ],

  /* Captured spread by COD year, $/MWh, four-hour basis. The central path is the
     lab seed multiplied by the dilution factor below, so the two never disagree.
     Low and high are the 2024 TB4 year and the April 2026 arbitrage month, scaled
     onto the same capture basis. */
  codCases: { 2029: { low: 26, central: 38, high: 99 }, 2030: { low: 25, central: 36, high: 94 }, 2031: { low: 23, central: 34, high: 89 } },
  /* Storage arriving into a fixed requirement compresses the spread it trades.
     Illustrative, and the one place on this tab where no PJM-specific published
     forecast exists to anchor the shape. */
  dilution: { 2029: 1.00, 2030: 0.95, 2031: 0.89 },

  evidenceLadder: [
    { n: ['1 · The PJM auction result and the ELCC class rating for the delivery year', '1 · 实需年度的PJM拍卖结果与ELCC等级评定'],
      d: ['Two public PDFs whose product is the capacity payment. This is the only tier on this ladder that is fact, and it is unusually strong — most markets on this platform cannot populate it at all.', '两份公开PDF文件，其乘积即为容量收入。这是本梯级中唯一属于事实的层级，且异常可靠 — 本平台多数市场根本无法填充该层级。'] },
    { n: ['2 · The asset\'s queue position, cycle status and Capacity Interconnection Rights', '2 · 资产的排队位置、周期状态与容量并网权'],
      d: ['Without CIRs the asset cannot offer into RPM at all, and the capacity line above is unavailable to it. A queue position is not an interconnection agreement; 67 GW of storage is in the queue and Transition Cycle 1 issued agreements to 21 projects.', '若无容量并网权，资产根本无法参与RPM报价，上述容量收入对其不可得。排队位置不等于并网协议；排队储能达67GW，而过渡周期一仅向21个项目签发协议。'] },
    { n: ['3 · Node-level TB4 history for this specific point of interconnection', '3 · 该具体并网点的节点级TB4价差历史'],
      d: ['16 of the 20 highest-spread nodes are in northern Virginia and eastern Maryland; 16 of the 20 lowest are in New Jersey. An RTO average is not a substitute for the node.', '价差最高的20个节点中有16个位于弗吉尼亚北部与马里兰东部；最低的20个中有16个位于新泽西。全RTO平均值不能替代具体节点数据。'] },
    { n: ['4 · Network upgrade cost allocation from the completed system impact study', '4 · 已完成系统影响研究所确定的电网升级成本分摊'],
      d: ['The single largest project-specific number in a PJM underwriting, and it is not knowable from any public series — only from the study for this project at this point.', '这是PJM项目承销中最大的单项项目专属数字，无法从任何公开序列得知，只能来自该项目在该节点的专项研究。'] },
    { n: ['5 · FEOC material-assistance documentation for the tax credit', '5 · 用于税收抵免的FEOC实质协助合规文件'],
      d: ['The only tier that is binary. Failing the Material Assistance Cost Ratio does not reduce the credit, it voids it — and IRS Notice 2026-15 left both the prohibited-entity definition and the ratio calculation to proposed regulations that had not issued at the seed date.', '唯一非此即彼的层级。未通过实质协助成本比率不会减少抵免额，而是使其完全失效 — 且美国国税局2026-15号公告将受禁实体定义与比率计算方式均留待拟议法规解决，而截至种子日期该法规尚未发布。'] },
  ],

  // ---- duration ----
  /* Four hours across all three COD years. PJM's ELCC table pays real money for
     longer duration — nine points between four and six hours — and the
     marginal-hour waterfall below shows it still does not clear at US installed
     cost. The archetype does not move within this window. */
  durationPath: { years: ['2029', '2030', '2031'], hours: [4, 4, 4] },
  /* Only the durations PJM publishes a class rating for. See the header note. */
  durConfigs: [4, 6, 8, 10],
  /* Per-MWh capture relative to the four-hour archetype, which is the basis TB4
     itself is computed on. Adding hours reaches further into a shallower part of
     the price stack. ILLUSTRATIVE — no PJM TB6/TB8/TB10 series was located, and
     unlike the ELCC points above these are not primary-source values. */
  durSpreadFactor: { 4: 1.00, 6: 0.82, 8: 0.70, 10: 0.61 },
  /* Usable energy as a fraction of nameplate — a state-of-charge window. Held
     equal to Germany's because it is an equipment property, not a market one. */
  usableFraction: 0.94,
  /* 4h → 6h, $k per nameplate MW per year, on this dashboard's own seed.
     Incremental capex is 2,000 kWh/MW at the $187.04/kWh energy-scaling component
     plus EPC at 13.64% = $425,000/MW, annualised over 20 years at 8% (annuity
     factor 0.101852) ≈ $43k/MW/yr. */
  marginalHour: [
    { l: ['Incremental arbitrage — 1.5× the energy at 82% of the 4h capture rate', '增量套利 — 能量为1.5倍，捕获率为4小时的82%'], v: 12, t: 'd' },
    { l: ['ELCC uplift, 59% → 68%, at $325.00/MW-day', 'ELCC由59%升至68%，按每MW每日$325.00计'], v: 11, t: 'd' },
    { l: ['Regulation — power-based, does not scale with duration', '调频 — 功率型，不随时长增长'], v: 0, t: 'd' },
    { l: ['Optimiser fee on the larger merchant line (5%)', '更大市场化收入对应的优化商费用（5%）'], v: -1, t: 'd' },
    { l: ['Annualised incremental capex ($425k/MW, 20 yr at 8%)', '年化增量资本开支（每MW $425k，20年，8%）'], v: -43, t: 'd' },
    { l: ['Degradation and incremental opex', '衰减与增量运维'], v: -2, t: 'd' },
    { l: ['Net marginal value, hours 5–6', '第5–6小时净边际价值'], v: -23, t: 'total' },
  ],
  durFactors: [
    { n: ['ELCC uplift the capacity market actually pays for duration', '容量市场为时长实际支付的ELCC增益'], w: 18, s: 3 },
    { n: ['US installed cost after tariffs and domestic-content premium', '计入关税与本土含量溢价后的美国安装成本'], w: 16, s: 1 },
    { n: ['Evening ramp depth after the coal retirements', '燃煤退役后的晚间爬坡深度'], w: 12, s: 3 },
    { n: ['Data-centre load growth and its flat, non-peaky profile', '数据中心负荷增长及其平坦、非尖峰的特性'], w: 12, s: 2 },
    { n: ['TB4 spread trajectory (+49% in one year)', 'TB4价差走势（一年上涨49%）'], w: 12, s: 3 },
    { n: ['Regulation does not pay for duration at all', '调频市场完全不为时长付费'], w: 10, s: 0 },
    { n: ['Solar penetration and midday trough depth', '光伏渗透率与午间低谷深度'], w: 10, s: 1 },
    { n: ['Spread-capture decay at longer duration', '更长时长的价差捕获衰减'], w: 10, s: 1 },
  ],
  durBands: [
    { lo: 0, hi: 34, n: ['Shallow-shift market', '浅移峰市场'], c: 'info',
      d: ['1–2h suffices; MWh added beyond that is unpaid capital.', '1–2小时已足够；超出部分的MWh属无回报资本。'] },
    { lo: 35, hi: 54, n: ['4h merchant zone', '4小时市场化区间'], c: 'warn',
      d: ['Underwrite 4h. It is the shortest duration PJM publishes a class rating for and the basis TB4 is computed on.', '按4小时测算。这是PJM公布等级评定的最短时长，也是TB4的计算基准。'] },
    { lo: 55, hi: 69, n: ['Transition to 6h', '向6小时过渡'], c: 'serious',
      d: ['Build 6h only where the marginal-hour NPV clears — on this dashboard\'s own seed it does not, by about $23k/MW/yr.', '仅当边际小时NPV为正时才按6小时建设 — 按本看板种子值计算，其为负值，约为每MW每年-$23k。'] },
    { lo: 70, hi: 100, n: ['6h+ duration-driven', '6小时以上时长驱动'], c: 'good',
      d: ['The ELCC ladder rewards it: 68% at six hours, 78% at ten. Test against the auction, never against the spread alone.', 'ELCC阶梯对此给予回报：6小时68%，10小时78%。须对照拍卖检验，绝不可仅对照价差。'] },
  ],
  augItems: [
    ['Land reserved for additional enclosures', '预留新增电池舱用地'],
    ['DC collection and containerised expansion capacity', '直流汇集与集装箱式扩容能力'],
    ['Transformer and switchgear headroom', '变压器与开关设备裕度'],
    ['PCS and EMS compatibility with added MWh', 'PCS与EMS对新增MWh的兼容性'],
    ['Capacity Interconnection Rights cover the added MWh without a new study', '容量并网权覆盖新增MWh且无需重新研究'],
    ['Interconnection agreement permits the change without re-entering the queue', '并网协议允许该变更且无需重新排队'],
    ['ELCC class moves up a bracket at the new duration', '新时长下ELCC等级可提升一档'],
    ['FEOC material-assistance ratio survives the added equipment', '新增设备后仍满足FEOC实质协助比率'],
    ['County-level siting consent covers the expanded footprint', '县级选址同意覆盖扩建后的占地范围'],
    ['OEM warranty continuity across the augmentation', 'OEM质保在增容后延续'],
  ],
  augDefaults: [2, 2, 1, 2, 1, 1, 2, 1, 1, 1],

  // ---- pipeline ----
  /* The probability step that matters is `isa`. In PJM an executed
     interconnection agreement carrying Capacity Interconnection Rights is what
     converts a project from a queue position into a resource that can offer into
     RPM — which is the entire contracted revenue line. It is scored far above a
     queue position and only just below construction. */
  stages: [
    { id: 'op',   n: ['Operating and dispatching', '已投运并参与调度'], p: 100 },
    { id: 'comm', n: ['Commissioning / phased energisation', '调试中/分阶段送电'], p: 93 },
    { id: 'con',  n: ['Under construction, financial close reached', '在建，已融资交割'], p: 88 },
    { id: 'isa',  n: ['Interconnection agreement executed with CIRs', '已签并网协议并取得容量并网权'], p: 66 },
    { id: 'clr',  n: ['Cleared a Base Residual Auction', '已在基准剩余容量拍卖中中标'], p: 58 },
    { id: 'sis',  n: ['System impact study complete, upgrade cost quantified', '系统影响研究完成，升级成本已量化'], p: 34 },
    { id: 'que',  n: ['In the interconnection queue', '在并网排队中'], p: 9 },
    { id: 'ann',  n: ['Announced only', '仅公告'], p: 4 },
  ],
  /* No named PJM battery project is carried here. Unlike Germany, where
     Förderstedt is a publicly announced project with a named owner, no
     project-level list was located for PJM: the reformed queue publishes cycle
     status rather than a named operating fleet. Every row below is a seed example
     and is labelled as one. The 90 MW modal size is the Transition Cycle 1
     average — 1.9 GW across 21 projects. */
  projects: [
    { n: 'PJM seed example A', region: 'DOM',      mw: 90,  h: 4, cod: 2029, st: 'op' },
    { n: 'PJM seed example B', region: 'SWMAAC',   mw: 120, h: 4, cod: 2029, st: 'comm' },
    { n: 'PJM seed example C', region: 'DOM',      mw: 200, h: 4, cod: 2029, st: 'con' },
    { n: 'PJM seed example D', region: 'ATSI/AEP', mw: 100, h: 4, cod: 2030, st: 'isa' },
    { n: 'PJM seed example E', region: 'ComEd',    mw: 150, h: 4, cod: 2030, st: 'isa' },
    { n: 'PJM seed example F', region: 'SWMAAC',   mw: 80,  h: 6, cod: 2030, st: 'clr' },
    { n: 'PJM seed example G', region: 'DOM',      mw: 250, h: 4, cod: 2030, st: 'clr' },
    { n: 'PJM seed example H', region: 'EMAAC',    mw: 90,  h: 4, cod: 2031, st: 'sis' },
    { n: 'PJM seed example I', region: 'APS',      mw: 175, h: 4, cod: 2031, st: 'sis' },
    { n: 'PJM seed example J', region: 'ATSI/AEP', mw: 300, h: 4, cod: 2031, st: 'que' },
    { n: 'PJM seed example K', region: 'ComEd',    mw: 120, h: 8, cod: 2031, st: 'que' },
    { n: 'PJM seed example L', region: 'EMAAC',    mw: 60,  h: 4, cod: 2031, st: 'ann' },
  ],


  /* ---- named transmission and market reform ------------------------------
     PJM's relief is not primarily a wire. The shortfall is a supply-and-demand
     problem the RTO is attacking through process, so this register carries the
     reforms alongside the physical projects — and says which is which. */
  reinforcements: [
    { n: ['Reliability Backstop Procurement', '可靠性兜底采购'], operator: 'PJM, subject to FERC approval', region: ['RTO-wide', '全RTO'], gw: null,
      cls: 'process', scope: ['A special procurement to address the near-term shortfall, with costs allocated consistently with state preferences. PJM filed it; on 29 September 2026 FERC suspended the filing to 28 February 2027 and opened a paper hearing, and PJM did not open the bid window.', '针对近期缺口的特别采购，成本按各州意愿分摊。PJM已提交申请；2026年9月29日FERC将该申请中止至2027年2月28日并启动书面听证，PJM未开启投标窗口。'],
      year: 2027, status: ['Filed; suspended by FERC to 28 February 2027', '已提交；被FERC中止至2027年2月28日'], c: 'serious' },
    { n: ['Reformed interconnection cycle', '改革后的并网周期流程'], operator: 'PJM', region: ['RTO-wide', '全RTO'], gw: 1.9,
      cls: 'process', scope: ['Transition Cycle 1 issued interconnection agreements to 21 battery projects totalling 1.9 GW; the reopened queue holds 67 GW of storage and 14 GW of solar.', '过渡周期一向21个储能项目签发并网协议，合计1.9GW；重开的排队队列中有67GW储能与14GW光伏。'],
      year: 2026, status: ['Operating; first cycle complete, queue reopened April 2026', '运行中；首个周期已完成，队列于2026年4月重开'], c: 'warn' },
    { n: ['Expedited Interconnection Track', '快速并网通道'], operator: 'PJM, FERC-approved', region: ['State-sponsored projects', '各州支持的项目'], gw: null,
      cls: 'process', scope: ['A temporary track for up to 10 state-sponsored, shovel-ready, high-capacity projects that could come online quickly.', '为最多10个由州政府支持、可立即开工的高容量项目设立的临时通道，以便快速投运。'],
      year: 2026, status: ['Approved and temporary — explicitly not a standing route', '已批准且属临时性 — 明确并非常设通道'], c: 'warn' },
    { n: ['Connect and Manage for large loads', '大负荷“接入并管理”框架'], operator: 'PJM', region: ['Data-centre load centres', '数据中心负荷中心'], gw: null,
      cls: 'process', scope: ['Allows large new loads such as data centres to connect but operate flexibly when needed. Attacks the demand side of the same shortfall.', '允许数据中心等大型新增负荷接入，但在必要时须灵活运行。从需求侧应对同一缺口。'],
      year: 2026, status: ['In development; FERC filing expected', '开发中；预计将提交FERC'], c: 'serious' },
    { n: ['Bilateral long-term large-load matching', '双边长期大负荷撮合服务'], operator: 'PJM', region: ['RTO-wide', '全RTO'], gw: null,
      cls: 'process', scope: ['From 9 June 2026 PJM facilitates bilateral agreements — often 10 years or more — between large load customers and generation, storage or demand-side resources. This is the closest thing PJM has to a long-term contracting route, and it is a matchmaking process rather than a product with a price.', '自2026年6月9日起，PJM为大用户与发电、储能或需求侧资源之间的双边协议提供撮合服务，期限常为10年以上。这是PJM最接近长期签约路径的机制，但属撮合流程而非有价格的产品。'],
      year: 2026, status: ['Live; no clearing price exists and none is published', '已上线；不存在出清价格，亦无任何公布'], c: 'serious' },
  ],

  planClasses: [
    { id: 'process', n: ['Market or process reform', '市场或流程改革'], c: 'warn',
      d: ['Not a wire. PJM\'s shortfall is a supply-and-demand imbalance rather than a single constrained corridor, and every relief item on this register is a change to how supply is procured, studied or connected. That is a weaker form of evidence than a funded transmission project with a commissioning date, and this register says so rather than borrowing the confidence of one.', '并非实体线路。PJM的缺口是供需失衡问题，而非单一受限走廊，因此本登记表中每一项缓解措施都是对供应采购、研究或接入方式的改变。相较于已获资金且有投运日期的输电工程，这是一种较弱的证据形式，本登记表对此明确说明，而非借用后者的确定性。'] },
  ],

  /* ---- coverage gaps, rendered verbatim on the Data & Methodology tab ----
     Not a caveat list. Each row is a number this dashboard is asked for and
     cannot supply, with what it uses instead. */
  notPublished: [
    { item: ['PJM battery tolling or offtake price', 'PJM储能租赁或承购价格'],
      status: ['No PJM tolling agreement located, at any price', '未发现任何PJM租赁协议，亦无任何价格'],
      why: ['ERCOT has ten publicly announced tolling agreements covering 1.6 GW; PJM has no public equivalent. PJM\'s own long-term contracting answer is the bilateral large-load matching service opened on 9 June 2026, which is a matchmaking process rather than a priced product.',
            'ERCOT有十份公开宣布的租赁协议，覆盖1.6GW；PJM没有对应的公开市场。PJM自身的长期签约方案是2026年6月9日启动的双边大负荷撮合服务，属撮合流程而非有价格的产品。'],
      instead: ['Nothing. `capabilities.tolling` is declared false, so the tolled route returns "no market precedent" rather than a zero. An unpriced route is not a zero-value route and the model does not imply either.',
                '不作任何替代处理。`capabilities.tolling`声明为false，因此租赁路径返回“无市场先例”而非零值。无价格的路径不等于零价值路径，模型对此不作任何暗示。'] },
    { item: ['Per-unit Regulation / arbitrage revenue split', '单机组调频与套利收入拆分'],
      status: ['Estimated — two sources, neither granular', '估算值 — 有两个来源，但均不够细化'],
      why: ['FERC\'s Electric Quarterly Reports give 86% of revenue from Regulation for Q1 2025 across 19 reporting batteries. Modo\'s April 2026 fleet stack decomposes independently to about 78% Regulation, 15% arbitrage and 7% capacity. Neither is a per-unit split and no source publishes one.',
            'FERC电力季度报告显示，2025年第一季度19台申报储能中，86%的收入来自调频。Modo 2026年4月的机组收入结构则独立拆解为约78%调频、15%套利与7%容量。二者均非单机组拆分，且无任何来源公布此类数据。'],
      instead: ['The 86/14 split, labelled estimated everywhere it appears, and used ONLY to read the historical index apart. Neither forward leg is derived from it: arbitrage comes from the published TB4 spread and Regulation from the requirement divided by the competing fleet.',
                '采用86/14拆分，在所有出现之处均标注为估算值，且仅用于拆解历史指数。两条前瞻性收入项均不由其推导：套利收入来自公布的TB4价差，调频收入来自系统需求除以竞争机组规模。'] },
    { item: ['Forward Regulation clearing price and battery share of the requirement', '前瞻性调频出清价格与储能在系统需求中的份额'],
      status: ['Not published', '未公布'],
      why: ['The requirement is published (~750 MW after the October 2025 redesign) and the current price series is published. What share of that requirement a battery wins once 5 GW of battery is competing for it, and at what price batteries bid it down to, is not.',
            '系统需求已公布（2025年10月重构后约750MW），当前价格序列亦已公布。但当5GW储能同台竞争时，单个储能能获得该需求的多少份额、以及储能会将价格压低至何种水平，均未公布。'],
      instead: ['A stated construction rather than a forecast: a fixed pot divided by a growing fleet, at the pre-spike June 2025 price. $240,000/MW/yr at full assignment × (400 ÷ 5,000). The observed level is carried as the band CEILING so a reader can see the whole distance rather than only the seed.',
                '采用明示的构造式推算而非预测：固定收入池除以不断增长的机组规模，价格取2025年6月飙升前水平。满额中标每MW每年$240,000×（400÷5,000）。已观测水平作为区间上限保留，使读者能看到完整跨度而非仅看到种子值。'] },
    { item: ['US fixed opex, $/MW/yr', '美国固定运维成本，每MW每年'],
      status: ['No published series', '无公开序列'],
      why: ['No US operator or ISO publishes a fixed opex figure for grid-scale storage. One national-laboratory figure exists: NREL selects 4% of capital cost a year for a four-hour battery, from the high end of published values, because it includes the capacity additions that hold a system at its rating (Cost Projections for Utility-Scale Battery Storage: 2025 Update, page 11). The seed here is the maintenance-only end and is paired with a market line that degrades, so the two are not the same measure. Property tax is a material US-specific component and is set county by county across thirteen states.',
            '美国没有运营商或独立系统运营机构公布电网级储能的固定运维成本。国家实验室的数字只有一个：NREL针对四小时电池取每年为投资成本的4%，该值取自公开数值的高端，因为它包含了使系统维持额定容量的容量增补（《公用事业级电池储能成本预测：2025年更新》第11页）。此处的种子值属于仅含日常维护的低端，并与逐年衰减的市场化收入配套使用，两者并非同一口径。财产税是美国特有的重要成本项，且在十三个州内按县分别确定。'],
      instead: ['$20,000/MW/yr, about 1.5% of the $1.336m installed cost, held equal to the NEM so that cross-market comparison is not driven by an unobserved input.',
                '采用每MW每年$20,000，约为$133.6万安装成本的1.5%，并与NEM保持一致，以避免跨市场比较被未观测输入所驱动。'] },
    { item: ['State and local sales tax on storage equipment', '储能设备的州及地方销售税'],
      status: ['Not modelled — no footprint-wide rate exists', '未建模 — 不存在覆盖全区域的统一税率'],
      why: ['PJM spans thirteen states and the District of Columbia with different rates and different generation-equipment exemptions. A single RTO-wide rate would be a fabrication rather than an approximation.',
            'PJM横跨十三个州及华盛顿特区，各地税率不同、发电设备免税规定亦不同。设定单一的全RTO税率将是凭空编造而非近似估算。'],
      instead: ['`vatPct: 0`, meaning not modelled rather than absent. Set it per project once the state is known — the field is the same one European VAT uses and behaves as a non-recoverable cost when `vatRecoverable` is false.',
                '设`vatPct: 0`，含义为未建模而非不存在。确定所在州后可按项目单独设定 — 该字段与欧洲增值税所用字段相同，当`vatRecoverable`为false时按不可退还成本处理。'] },
    { item: ['ELCC class rating below four hours', '四小时以下的ELCC等级评定'],
      status: ['No class published in the 2028/2029 table', '2028/2029年度评定表中未公布该等级'],
      why: ['The 2028/2029 class ratings list 4-hr, 6-hr, 8-hr and 10-hr storage. Shorter resources receive a resource-specific ELCC analysis rather than a class rating.',
            '2028/2029年度等级评定列出4小时、6小时、8小时与10小时储能。更短时长的资源将接受资源专项ELCC分析，而非适用等级评定。'],
      instead: ['`durConfigs` starts at four hours. The alternative would be worse than a gap: `interp()` clamps at the lowest declared point, so offering a two-hour option would silently award it the four-hour 59% rating.',
                '`durConfigs`自四小时起算。替代做法比留下缺口更糟：`interp()`会在最低已声明点处截断，因此若提供两小时选项，将无声地赋予其四小时的59%评级。'] },
    { item: ['PJM TB6 / TB8 / TB10 spread series', 'PJM的TB6/TB8/TB10价差序列'],
      status: ['Not located', '未找到'],
      why: ['TB4 is published as a fleet average and by proxy node. No longer-duration equivalent was found for PJM.',
            'TB4以机组平均值及代理节点形式公布。未找到PJM更长时长的对应数据。'],
      instead: ['`durSpreadFactor` beyond four hours is an illustrative curve shape and is badged as such — unlike `deratingCurve`, where every point is a PJM primary source. The marginal-hour waterfall depends on it and says so.',
                '四小时以上的`durSpreadFactor`为示意性曲线形态并已如此标注 — 与`deratingCurve`不同，后者每个点均来自PJM原始出处。边际小时瀑布图依赖该曲线，并已明确说明。'] },
    { item: ['Named PJM operating battery projects', '具名的PJM在运储能项目'],
      status: ['No project-level list located', '未找到项目级清单'],
      why: ['The reformed queue publishes cycle status rather than a named operating fleet, and the ~400 MW operating fleet is not broken out by project in a public series.',
            '改革后的排队队列公布的是周期状态而非具名在运机组清单，且约400MW的在运机组在公开序列中未按项目拆分。'],
      instead: ['Twelve seed examples, labelled as such. The 90 MW modal size is the Transition Cycle 1 average — 1.9 GW across 21 projects — and is the archetype in comparison.js, so it is a derived figure rather than a convention.',
                '采用十二个种子示例并如此标注。90MW的众数规模取自过渡周期一的平均值 — 21个项目合计1.9GW — 同时也是comparison.js中的原型规模，故属推导值而非惯例设定。'] },
  ],

  lab: {
    /* ---- capital structure. Seeded neutral: nothing here moves a published
       return until it is set. */
    /* PJM network upgrade cost is the largest project-specific number in an
       underwriting and there is no public series for it — it comes from the
       system impact study for this project at this point. Seeded at zero because
       a footprint-wide average would be an invention, not an estimate. */
    connectionPerMW: 0,
    /* No US VAT. State equipment tax varies across thirteen states — see
       notPublished. */
    vatPct: 0, vatRecoverable: 1,
    devCostPct: 0, rtbPremiumPct: 0, constructionMonths: 12,

    /* 90 MW is the Transition Cycle 1 average, not a convention: 1.9 GW across
       21 projects. Four hours is the shortest duration PJM publishes an ELCC
       class rating for and the basis TB4 is computed on.

       capexKWh 187.04 + capexKW 587.84 is NREL's $334/kWh split on the platform's
       own capex-stack shares — 56% energy-scaling, 44% power-scaling — and
       reconciles to $1,336,000/MW exactly.

       spread 38 $/MWh at 1.0 cycles/day reproduces comparison.js's $50,336
       arbitrage seed to within 0.5%: 4h × 0.94 usable × 1.0 × 365 × 0.97 avail =
       1,331 MWh/MW/yr, × $38 = $50,587. It is an executable arbitrage margin
       after the TB4 capture stack, NOT a raw day-ahead spread. */
    mw: 90, hours: 4, capexKWh: 187.04, capexKW: 587.84, opexKW: 20,
    rte: 88, avail: 97, degr: 2.0, cycles: 1.0, spread: 38, optFee: 5,

    /* $325.00/MW-day × 365 = $118,625/MW/yr of UCAP, in $k. capYrs is 1 because
       a Base Residual Auction procures one delivery year — the single most
       important structural fact on this page. Years beyond it fall to
       futureCapFactor, which is the mean of the declared renewal path. */
    capPrice: 118.625, capYrs: 1,

    /* Regulation, from comparison.js: $19,200/MW/yr = $19.2/kW/yr. NOT the
       observed fleet level. */
    servicesKW: 19.2,

    /* The §48E ITC, seeded at zero here as it is in comparison.js. The editable
       range 0–37% lives on the dedicated Investment Lab page, where the FEOC cliff and
       the transfer discount are stated. */
    grantPct: 0,

    /* SOFR 3.65% at the end of July 2026 plus a 225bp senior margin. */
    life: 20, disc: 8, debtPct: 60, rate: 5.9, tenor: 15,
  },

  glossary: [
    ['Reliability Pricing Model (RPM) — PJM\'s capacity market', '可靠性定价模型（RPM） — PJM的容量市场'],
    ['Base Residual Auction (BRA) — procures one delivery year', '基准剩余容量拍卖（BRA） — 采购一个实需年度'],
    ['Delivery Year — 1 June to 31 May, the year capacity is committed for', '实需年度 — 6月1日至次年5月31日，容量承诺所覆盖的年度'],
    ['UCAP / ICAP — accredited versus nameplate capacity', 'UCAP/ICAP — 核证容量与铭牌容量'],
    ['Effective Load Carrying Capability (ELCC) class rating', '有效负荷承载能力（ELCC）等级评定'],
    ['Capacity Interconnection Rights (CIRs) — required to offer into RPM', '容量并网权（CIRs） — 参与RPM报价的必要条件'],
    ['Locational Deliverability Area (LDA)', '区位可交付区（LDA）'],
    ['Fixed Resource Requirement (FRR) — the alternative to RPM participation', '固定资源要求（FRR） — 参与RPM之外的替代方案'],
    ['Net Cost of New Entry (Net CONE) — what the cap reverts to', '净新增进入成本（Net CONE） — 价格上限将回归的基准'],
    ['Price collar — the FERC-approved cap and floor across four auctions', '价格上下限机制 — 经FERC批准、覆盖四次拍卖的上限与下限'],
    ['Three-Pivotal Supplier Test — market power mitigation', '三关键供应商检验 — 市场力缓解机制'],
    ['Regulation — one bidirectional signal since 1 October 2025', '调频 — 自2025年10月1日起为单一双向信号'],
    ['RegA / RegD — the two signals consolidated by the redesign', 'RegA/RegD — 已被市场重构合并的两种信号'],
    ['RegUp / RegDown — the Phase 2 directional split, October 2026', 'RegUp/RegDown — 2026年10月第二阶段的方向性拆分'],
    ['Locational Marginal Price (LMP) — settlement at the node', '节点边际电价（LMP） — 按节点结算'],
    ['TB4 spread — four highest hourly prices less the four lowest', 'TB4价差 — 最高四个小时电价减去最低四个小时'],
    ['System impact study — where network upgrade cost is quantified', '系统影响研究 — 量化电网升级成本的环节'],
    ['Interconnection Service Agreement (ISA)', '并网服务协议（ISA）'],
    US_ITC_TERM,
    ['FEOC / Material Assistance Cost Ratio (MACR) — pass or lose the credit', 'FEOC/实质协助成本比率（MACR） — 通过方可保留抵免，否则全额丧失'],
    ['Transfer market — how a sponsor monetises the credit, at ~93 cents', '转让市场 — 投资人变现抵免的途径，约93美分'],
    ['Electric Quarterly Report (EQR) — FERC revenue filings', '电力季度报告（EQR） — 提交至FERC的收入申报'],
  ],

  kpiExport: [
    ['2028/2029 BRA clearing price', 325.00, 'USD/MW-day UCAP', 'official', 'PJM_SEED_V1', 'PJM — cleared at the FERC-approved cap, RTO-wide'],
    ['2027/2028 BRA clearing price', 333.44, 'USD/MW-day UCAP', 'official', 'PJM_SEED_V1', 'PJM'],
    ['2028/2029 BRA capacity procured', 138318, 'MW UCAP', 'official', 'PJM_SEED_V1', 'PJM'],
    ['2028/2029 BRA shortfall against the reliability requirement', 6831, 'MW', 'official', 'PJM_SEED_V1', 'PJM'],
    ['2028/2029 reserve margin', 14.7, '%', 'official', 'PJM_SEED_V1', 'PJM'],
    ['Uncapped 2027/2028 simulation, RTO', 529.80, 'USD/MW-day', 'official', 'PJM_SEED_V1', 'PJM — what the collar suppressed'],
    ['Net CONE estimate the cap reverts to', 550, 'USD/MW-day', 'official forecast', 'PJM_SEED_V1', 'PJM estimate, after the 2029/2030 auction'],
    ['4-hr storage ELCC class rating, 2028/2029', 59, '%', 'official', 'PJM_SEED_V1', 'PJM ELCC class ratings'],
    ['4-hr storage ELCC class rating, 2027/2028', 58, '%', 'official', 'PJM_SEED_V1', 'PJM ELCC class ratings'],
    ['6-hr storage ELCC class rating, 2028/2029', 68, '%', 'official', 'PJM_SEED_V1', 'PJM ELCC class ratings'],
    ['10-hr storage ELCC class rating, 2028/2029', 78, '%', 'official', 'PJM_SEED_V1', 'PJM ELCC class ratings'],
    ['Capacity revenue to a 4h battery, secured delivery year', 69989, 'USD/MW/yr', 'calculated', 'PJM_SEED_V1', '325.00 × 365 × 0.59'],
    ['Regulation market size after the Phase 1 redesign', 750, 'MW', 'official', 'PJM_SEED_V1', 'PJM Regulation Redesign Phase 1, 1 Oct 2025'],
    ['Regulation market size before the redesign', 320, 'MW', 'official', 'PJM_SEED_V1', 'PJM'],
    ['Regulation clearing price, October 2025', 129, 'USD/MW/h', 'third party', 'PJM_SEED_V1', 'Modo Energy'],
    ['Regulation clearing price, June 2025 (pre-spike)', 55, 'USD/MW/h', 'third party', 'PJM_SEED_V1', 'Modo Energy — the basis for the forward Regulation seed'],
    ['Observed fleet revenue index through September 2025', 24, 'USD/kW-month', 'third party', 'PJM_SEED_V1', 'Modo Energy'],
    ['Observed fleet revenue, February 2026 peak', 104.5, 'USD/kW-month', 'third party', 'PJM_SEED_V1', 'Modo Energy'],
    ['Regulation share of battery revenue, Q1 2025', 86, '%', 'official', 'PJM_SEED_V1', 'FERC EQR, 19 units — estimated split, not per-unit'],
    ['Regulation available to a new entrant', 19200, 'USD/MW/yr', 'calculated', 'PJM_SEED_V1', 'dashboard — 240,000 × (400 ÷ 5,000)'],
    ['Regulation earned by the current fleet', 247680, 'USD/MW/yr', 'calculated', 'PJM_SEED_V1', 'dashboard — 0.86 × 288,000, the band ceiling'],
    ['TB4 spread, fleet average 2025', 69375, 'USD/MW/yr', 'third party', 'PJM_SEED_V1', 'Modo Energy'],
    ['TB4 spread, fleet average 2024', 46699, 'USD/MW/yr', 'third party', 'PJM_SEED_V1', 'Modo Energy'],
    ['Executable arbitrage after the capture stack', 50336, 'USD/MW/yr', 'calculated', 'PJM_SEED_V1', 'dashboard — 69,375 × 0.88 × 0.97 × 0.85'],
    ['Operating PJM battery fleet', 400, 'MW', 'third party', 'PJM_SEED_V1', 'Modo Energy'],
    ['Storage in the reopened interconnection queue', 67, 'GW', 'official', 'PJM_SEED_V1', 'PJM, April 2026'],
    ['Transition Cycle 1 battery interconnection agreements', 1.9, 'GW', 'official', 'PJM_SEED_V1', 'PJM — 21 projects, a 90 MW average'],
    ['Expected operating battery fleet by 2030', 5000, 'MW', 'third party forecast', 'PJM_SEED_V1', 'Modo Energy — ceiling 7 GW'],
    ['4h installed capital cost', 1336000, 'USD/MW', 'official', 'PJM_SEED_V1', 'NREL 2025 update — $334/kWh × 4,000'],
    ['§48E ITC for standalone storage', 30, '%', 'official', 'PJM_SEED_V1', 'IRC §48E — seeded at 0 in the model, editable in the Lab'],
    ['PJM toll price, any deal', 'not disclosed', '-', 'coverage gap', 'PJM_SEED_V1', 'no PJM tolling agreement located at any price'],
    ['US fixed opex series', 'not published', '-', 'coverage gap', 'PJM_SEED_V1', 'no US operator, ISO or laboratory publishes one'],
    ['ELCC class rating below four hours', 'not published', '-', 'coverage gap', 'PJM_SEED_V1', 'resource-specific analysis instead of a class rating'],
  ],
};

export { M };
