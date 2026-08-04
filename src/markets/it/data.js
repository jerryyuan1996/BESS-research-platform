/* ---------------------------------------------------------------------------
   Italy — market dataset.

   Same shape as the DE/NEM/RO/PL datasets in this lineage: official snapshot
   values, scorecards, bands, duration curves, the project pipeline, lab defaults
   and the per-tab narrative inputs. Everything the shared engine draws comes
   from here.

   FIVE THINGS ABOUT THIS PARTICULAR DATASET.

   1. MACSE IS PRICED PER MWh-YEAR. Every other contracted mechanism on this
      platform pays per MW. Terna pays per megawatt-hour of storage, which is why
      the awarded fleet came in at 1,491 MW across 9,968 MWh — 6.68 hours average,
      against the four hours the rest of the Italian market indexes on. The
      dashboard models the four-hour archetype and carries the MACSE payment at
      its four-hour equivalent, €51,836/MW/yr. The divergence is not smoothed
      over; it is the organising finding of the duration tab.

   2. `usableFraction` IS 1.00, AND THAT IS DELIBERATE. Not because an Italian
      battery has no state-of-charge window, but because every Italian figure this
      dashboard reconciles to — the €220/kWh capex band, the €12,959/MWh MACSE
      clear, the 67% four-hour capacity de-rating — is already quoted on the same
      nameplate basis. Applying a usable fraction here would take a haircut the
      sources have already taken. Where a usable-energy assumption does bite is
      MACSE's 18% oversizing obligation, and that is carried in `degr`.

   3. `dilution` IS FLAT AT 1.00 ACROSS THE WHOLE COD WINDOW. Germany's curve
      declines because Modo cut German lifetime revenues 16%. Modo's July 2026
      Italy view is roughly FLAT in real terms to 2040, and it is the only
      published Italian forward series. Bending it would substitute a house view
      for the source. MSD saturation — the real Italian downside — is carried in
      the services band and on the services tab, not smuggled into a curve that
      would also dilute wholesale.

   4. `durSpreadFactor` IS RE-BASED TO FOUR HOURS. Germany's curve reads 1.00 at
      two hours because German sources publish two-hour revenue. Every published
      Italian revenue figure is quoted on a four-hour basis, so Italy's curve reads
      1.00 there. The numbers are the platform's shared shape divided by 0.75; the
      shape is not an Italian observation and is labelled as a convention.

   5. Where a figure is not published anywhere — the toll price, fixed opex, the
      optimiser fee, a degradation series, the MSD underwriting level, curtailment
      volumes, the full de-rating table, the power/energy split inside the capex
      band — this file does not invent one. Those gaps are carried in
      `notPublished` and rendered on the Data & Methodology tab.
   --------------------------------------------------------------------------- */

const M = {
  asOf: '2026-08-01',
  dataDate: '2025 annual / 2026 published auctions / Jul 2026 forecast',
  modelVersion: 'it-seed-1.0-macse-vs-toll',
  title: ['Italy Battery Investment Dashboard', '意大利储能投资看板'],
  sub: ['Institutional investor storyline: market evolution, forward signals, project underwriting and portfolio application. Six bidding zones; reference archetype 100 MW / 4h; four routes to market.',
        '面向机构投资人的投资叙事：市场演进、前瞻信号、项目承销与组合应用。六个报价区；参考原型为100MW/4小时；四条售电路径。'],
  nextMilestone: ['Next milestone: second MACSE auction — 24 November 2026, 16 GWh, up from 10 GWh. No reserve premium published at the time of writing.',
                  '下一里程碑：第二次MACSE拍卖 — 2026年11月24日，规模16GWh，高于此前的10GWh。截至撰写时尚未公布保留溢价。'],
  footerNote: ['Public and official sources collected 1 August 2026. No Italian toll price has been disclosed in any of the three signed deals; no Italian fixed opex, optimiser fee or degradation series is published; the ARERA reference-cost study that would settle Italian capex could not be machine-read; and the only published MSD total is a single month annualised. Every contracted figure other than the MACSE clear and the capacity premium is a derived bracket, not a quotation.',
               '公开及官方来源于2026年8月1日采集。三笔已签署的意大利租赁交易均未披露价格；意大利未公布固定运维成本、优化商费率或衰减率序列；可解决意大利造价问题的ARERA参考成本研究无法机器读取；且唯一公布的辅助服务市场总额为单月年化数据。除MACSE出清价与容量溢价外，所有合同类数值均为推导区间，而非报价。'],
  seedWarn: ['Every value on this page is an IT_SEED_V1 snapshot or an illustrative placeholder. No KPI is production-complete until its live ingestion, validation and source-health check are operational. MACSE and the capacity market are mutually exclusive and must never be added together. The capex band on this page spans a factor of 2.4 because two credible sources disagree by half. Terna has proposed cutting the four-hour capacity de-rating from 67% to 53% for DY2028. And a 2026 MACSE result does not exist — the second auction has not been held.',
             '本页所有数值均为IT_SEED_V1种子快照或示例占位数据。在实时抓取、校验及源健康检测上线前，任何KPI均不可用于生产决策。MACSE与容量市场互斥，绝不可相加。本页造价区间跨度达2.4倍，因两个可信来源相差一半。Terna已提议将2028实需年度的四小时容量折减系数由67%下调至53%。此外，2026年MACSE结果并不存在 — 第二次拍卖尚未举行。'],

  /* ---- official / sourced snapshot -------------------------------------
     Only values that come from a named publication sit here. Illustrative
     series live further down and are badged as such wherever they render. */
  official: {
    // ---- MACSE, Terna's centralised storage procurement ----
    macseAuction1Date: '30 September 2025', macseAuction1Rev: '10 October 2025',
    macseAwardedMWh: 9968, macseAwardedMW: 1491, macseProjects: 14, macseHoursAvg: 6.68,
    macseWavg: 12959, macseSud: 12146, macseSard: 15029, macseSici: 15846,
    macseCap: 37000, macseClearPctOfCap: 35,
    macseYears: 15, macseDelivery: 2028,
    macse4hEquiv: 51836, macseAtAwardedHours: 86566,
    macseAuction1GWh: 10, macseAuction2GWh: 16, macseAuction2Date: '24 November 2026',
    /* The locational decision. Zero is a requirement Terna SET, not an outcome. */
    macseNorthReqGWh: 0, macseSudCeil1: 7, macseSudCeil2: 11.5,
    macseSiciFloor1: 0.5, macseSiciFloor2: 1,
    /* Terna resells the time-shifting product; the assignee keeps MSD trading
       control but returns roughly 80% of contribution margin. Corroborated by two
       independent secondary readings, NOT verified in Terna's regulation text. */
    macseRetentionPct: 20, macseTernaSharePct: 80,
    macseOversizePct: 18, macseOversizeHours: 8,
    macseAuction2Premium: ['Not published at the time of writing', '截至撰写时尚未公布'],

    // ---- capacity market ----
    cmDY: 'DY2027', cmPremium: 47000, cmYearsNew: 15, cmYearsExisting: 1,
    cmBessSharePct: 95,
    cmDerate4h: 0.67, cmDerate8h: 0.90, cmDerate4hProposed: 0.53, cmProposedDY: 'DY2028',
    cmDerateCutPct: 21,
    /* The single most consequential structural fact about the Italian stack. */
    cmStacksWithMacse: false,

    // ---- merchant ----
    modoDate: 'July 2026', modoBasis: '4h, wholesale only, excluding MSD',
    modoNorth: 98000, modoSouth: 123000, modoFlatTo: 2040,
    timeraPeakPerKW: 200, timera2024NorthPerKW: 100, timeraPeakPeriod: 'spring 2025',
    /* Executable margin per discharged MWh at the archetype's 1.4 cycles/day.
       This is the lab seed and it reconciles to €123,000/MW/yr within 0.06%. */
    execMarginPerMWh: 62,
    zoneCount: 6, pun: ['Prezzo Unico Nazionale — a demand-side average, not a zonal settlement price',
                        '全国统一电价 — 为需求侧平均价格，而非分区结算价格'],

    // ---- MSD / ancillary ----
    msdNorthSharePct: 0, msdSouthSharePct: 10, msdSardSharePct: 20,
    msdSeed: 13667,
    /* Correctly published, and unusable as a seed: a single month annualised. */
    chNorth: 654000, chSouth: 640000, chMonth: 'May 2026', chTertiarySharePct: 80,
    chMultipleOfForward: 5, msdDurableNeeded: 530000,
    msdSiciUp: 320, msdCsudUp: 250, msdPricePeriod: 'Jan–May 2025',

    // ---- fleet and system ----
    fleet2025GW: 1.9, fleetSardMW: 800, fleet2030GWhi: 15,
    renewShare2025Pct: 41, renewShare2024Pct: 42,

    // ---- capex ----
    capexKWhLo: 180, capexKWhMid: 220, capexKWhHi: 260,
    capexItExpertUsd: 120, capexItExpertEurPerMW: 440000, capexItExpertDate: 'October 2025',
    capex4hSeed: 880000, capexSpreadX: 2.4,
    areraDoc: 'Deliberazione 168/2025, Allegato B',

    // ---- tolling ----
    tollDeals: 3, tollPricesDisclosed: 0,
    tollAxpoMW: 207, tollAxpoYears: 10, tollAxpoDate: 'July 2026', tollAxpoRegion: 'northern Italy',
    tollEnbwMW: 300, tollEnbwMWh: 1200,
    tollFloor: 51836, tollCeil: 123000, tollSeed: 87000,

    // ---- grid and relief ----
    planYears: '2025–2034', planEbn: 23, plan2428Ebn: 16.6,
    tyrrhenianMW: 1000, tyrrhenianKm: 970, tyrrhenianEbn: 3.7, tyrrhenianKV: 500,
    tyrrhenianCod: 2028, tyrrhenianStart: 'January 2025',
    adriaticMW: 1000, adriaticKm: 250, adriaticSubKm: 210, adriaticCableEm: 630,
    adriaticCod: 2029, adriaticLayEnd: 'first half of 2028',
    sacoi3MW: 400, sacoi3Cod: 2028,
    elmedMW: 600, elmedKm: 200, elmedCod: 2028,

    // ---- policy ----
    maseDecree: 'DM 53 of 27 February 2025',
    areraCurtailRes: 'Resolution 128/2025/R/EFR',
  },

  /* The daily sequence an Italian optimiser trades through, in order, plus the
     one gate that is not daily and matters most. No per-gate €/MW/yr
     decomposition is published for an Italian battery. */
  gateCloses: [
    { id: 'MGP',  n: ['Mercato del Giorno Prima — day-ahead', '日前市场（MGP）'],
      when: ['12:00 CET for the following day, cleared by zone', '中欧时间12:00，交易次日，按区域出清'],
      fit: ['The reference spread. Modo forecasts €98,000/MW/yr in the North against €123,000 in the South mainland at 4h', '基准价差。Modo预测4小时口径下北部每MW每年€98,000，南部大陆€123,000'] },
    { id: 'MI',   n: ['Mercato Infragiornaliero — MI-A auctions and MI-XBID', '日内市场 — MI-A拍卖与MI-XBID连续交易'],
      when: ['Successive auctions plus continuous cross-border trading', '连续多轮拍卖，加跨境连续交易'],
      fit: ['Where re-optimisation value is captured; no published Italian split', '再优化价值的捕获环节；意大利无公开拆分数据'] },
    { id: 'MSD',  n: ['Mercato per il Servizio di Dispacciamento — ex-ante', '调度服务市场（MSD） — 事前'],
      when: ['Pay-as-bid, scheduled by Terna ahead of real time', '按报价支付，由Terna在实时前调度'],
      fit: ['Up-regulation cleared ≈€320/MWh in Sicily against ≈€250 in Centre-South, Jan–May 2025', '2025年1–5月，西西里上调服务出清约€320/MWh，中南部约€250'] },
    { id: 'MB',   n: ['Mercato di Bilanciamento — real time', '平衡市场（MB） — 实时'],
      when: ['Terna-instructed within the delivery hour', '由Terna在交割小时内指令'],
      fit: ['≈10% of southern mainland BESS revenue, ≈20% in Sardinia, near zero in the North', '约占南部大陆储能收入10%，撒丁岛约20%，北部接近零'] },
    { id: 'MACSE', n: ['MACSE assignment — not a daily gate', 'MACSE指派 — 非每日交易关闸'],
      when: ['Terna resells the contracted time-shifting product', 'Terna转售已签约的时移产品'],
      fit: ['The owner does NOT keep dispatch optionality on contracted energy. This is the trade a MACSE bidder makes', '业主对已签约电量不保留调度选择权。这正是MACSE投标人所做的取舍'] },
  ],

  /* Six bidding zones. Used as the pipeline region column and as the locational
     frame the MACSE requirement table runs on. Zone eligibility is a hard line in
     Italy, not a gradient. */
  regions: [
    { id: 'Nord',            n: ['Nord — the industrial north', '北部 — 工业区'],
      note: ['MACSE requirement zero. Contracted options are the capacity market or a bilateral toll, nothing else', 'MACSE需求为零。合同化选项仅有容量市场或双边租赁'] },
    { id: 'Centro-Nord',     n: ['Centro-Nord', '中北部'],
      note: ['MACSE requirement zero in the first auction', '首次拍卖中MACSE需求为零'] },
    { id: 'Centro-Sud',      n: ['Centro-Sud', '中南部'],
      note: ['Inside the MACSE perimeter; MSD up-regulation ≈€250/MWh', '位于MACSE范围内；辅助服务上调价格约€250/MWh'] },
    { id: 'Sud e Calabria',  n: ['Sud e Calabria', '南部与卡拉布里亚'],
      note: ['Lowest MACSE clear at €12,146/MWh/yr; ceiling rises from 7 to 11.5 GWh in the second auction', 'MACSE出清价最低，每MWh每年€12,146；第二次拍卖上限由7GWh升至11.5GWh'] },
    { id: 'Sicilia',         n: ['Sicilia', '西西里'],
      note: ['Highest MACSE clear at €15,846/MWh/yr — a 30% premium over the southern mainland', 'MACSE出清价最高，每MWh每年€15,846 — 较南部大陆溢价30%'] },
    { id: 'Sardegna',        n: ['Sardegna', '撒丁岛'],
      note: ['≈800 MW of the national 1.9 GW fleet; balancing is ≈20% of revenue', '约占全国1.9GW装机中的800MW；平衡服务约占收入20%'] },
  ],

  overall: { statusL: ['Selective', '选择性投资'], chipCls: 'warn', confidence: 58, codWindow: '2028–2030',
    rationale: ['The only market on this platform offering all four routes to market, and the only one where the choice between them is a genuine spread rather than a formality. Terna publishes more that is directly investable than any other TSO here: MACSE zonal requirements, clearing prices by zone, and four named submarine projects with commissioning years. MACSE cleared at 35% of its own price cap and roughly half the wholesale value of the same stored energy — what it buys is a fifteen-year TSO counterparty and the gearing that follows. Against that, the capex evidence spans a factor of 2.4, no Italian toll price has ever been disclosed, and the only published MSD total is one month annualised at five times the forward view. Underwrite the contract and the zone. Do not underwrite the ancillary run-rate.',
                '本平台唯一提供全部四条售电路径的市场，也是唯一一个路径选择构成真实价差而非形式差别的市场。Terna公布的可直接用于投资判断的信息多于本平台其他任何电网运营商：MACSE分区需求、各区域出清价格，以及四项具有明确投运年份的具名海底工程。MACSE以其自身价格上限的35%出清，约为同等储存电量批发价值的一半 — 其换来的是十五年期电网运营商对手方以及随之而来的杠杆能力。与之相对，造价证据跨度达2.4倍，意大利从未披露任何租赁价格，且唯一公布的辅助服务市场总额为单月年化数据，达远期预测的五倍。承销依据应为合同与区域，而非辅助服务的运行率。'] },

  /* Weights sum to 100; the weighted composite is 63, which is the figure
     src/markets/it/comparison.js carries as `score.composite`. */
  components: [
    { n: ['Contracted revenue availability — four routes', '合同化收入可得性 — 四条路径'], w: 22, s: 92 },
    { n: ['Merchant revenue depth and forward visibility', '市场化收入深度与远期可见度'], w: 16, s: 62 },
    { n: ['Ancillary (MSD) depth and durability', '辅助服务（MSD）深度与可持续性'], w: 12, s: 45 },
    { n: ['Capacity market access and de-rating stability', '容量市场准入与折减系数稳定性'], w: 10, s: 58 },
    { n: ['Locational signal quality', '区位信号质量'], w: 10, s: 90 },
    { n: ['Capex and cost evidence quality', '造价与成本证据质量'], w: 10, s: 30 },
    { n: ['Connection, permitting and delivery', '并网、许可与交付'], w: 12, s: 40 },
    { n: ['Data transparency and source health', '数据透明度与来源健康度'], w: 8, s: 55 },
  ],

  // ---- merchant revenue ----
  /* Four published four-hour views in €k/MW/yr, side by side. This is the route
     comparison in one chart: the MACSE bar is the same asset's contracted
     alternative, converted to the same four-hour basis. */
  revBasisLabels: ['North (Modo, 4h)', 'South mainland (Modo, 4h)', 'MACSE 4h-equivalent', 'Timera spring-2025 peak'],
  revBasisSeriesK: [98, 123, 51.8, 200],

  /* Published spread → executable margin, €/MWh discharged, four-hour basis.
     Steps 2 and 5 are model conventions: no Italian source publishes a per-gate
     decomposition. MSD is settled separately and is NOT in this line — it enters
     the model as €13,667/MW/yr. The optimiser fee is deliberately not a step
     here; the model applies it once, as lab.optFee. */
  spreadBridge: [
    { l: ['MGP day-ahead zonal spread, Sud, best 4h against worst 4h', 'MGP日前分区价差，南部，最优4小时对最差4小时'], v: 73, t: 'start' },
    { l: ['MI-A auctions and MI-XBID continuous re-optimisation', 'MI-A拍卖与MI-XBID连续市场再优化'], v: 6, t: 'd' },
    { l: ['Round-trip efficiency loss (88%)', '往返效率损失（88%）'], v: -9, t: 'd' },
    { l: ['Availability and forced outages (97%)', '可用率与非计划停机（97%）'], v: -2, t: 'd' },
    { l: ['Imbalance and non-delivery exposure on the scheduled profile', '计划出力曲线的偏差与未交付敞口'], v: -6, t: 'd' },
    { l: ['Executable margin before the optimiser fee', '扣除优化商费用前的可执行价差'], v: 62, t: 'total' },
  ],

  /* Captured spread by COD year, €/MWh, four-hour basis. The central path is the
     lab seed multiplied by the dilution factor below, so the two never disagree.
     Low is Modo's northern zone and high is Timera's observed spring-2025 peak,
     both converted on the same 1,983 MWh/MW/yr discharge basis. The three years
     are identical because Modo's Italy view is flat in real terms to 2040 — that
     is the source's finding, not a missing series. */
  codCases: { 2028: { low: 49, central: 62, high: 101 }, 2029: { low: 49, central: 62, high: 101 }, 2030: { low: 49, central: 62, high: 101 } },
  dilution: { 2028: 1.00, 2029: 1.00, 2030: 1.00 },

  // ---- ancillary ----
  /* MSD share of BESS revenue BY ZONE rather than by year, because that is how
     the Italian data is published. Italy is the one market on this platform where
     the ancillary question is locational rather than chronological. */
  ancShareLabels: ['North', 'South mainland', 'Sardinia'],
  ancShareSeries: [0, 10, 20],

  evidenceLadder: [
    { n: ['1 · Terna MACSE auction results and GME zonal market data', '1 · Terna MACSE拍卖结果与GME分区市场数据'],
      d: ['Zonal requirements, clearing prices by zone, awarded MWh and MW, and day-ahead prices are published and complete. This is the only tier that is fact, and Italy has more of it than any other market here.', '分区需求、各区域出清价格、中标MWh与MW，以及日前价格均已公布且完整。这是唯一属于事实的层级，且意大利在此层级的信息多于本平台其他任何市场。'] },
    { n: ['2 · The site\'s bidding zone, checked against the MACSE requirement table', '2 · 场址所属报价区，对照MACSE需求表核查'],
      d: ['Zone eligibility is a hard line, not a gradient. Terna set the North and Centre-North requirement at zero. Confirm which side of it a site sits on before anything else in the model matters.', '区域资格是硬性界线而非渐变。Terna将北部与中北部需求设为零。在模型中其他任何事项之前，应先确认场址位于界线哪一侧。'] },
    { n: ['3 · STMG connection solution issued and accepted', '3 · 已出具并接受的最小技术方案（STMG）'],
      d: ['Terna or the distributor issues the connection solution against a specific point. A queue position is not a connection solution and a connection solution is not an energisation date.', 'Terna或配电公司针对特定接入点出具并网方案。排队位置不等于并网方案，并网方案也不等于送电日期。'] },
    { n: ['4 · Reproducible optimiser backtest on THIS zone\'s MSD', '4 · 针对本区域辅助服务市场的可复现优化器回测'],
      d: ['The published Italian MSD total is one month annualised at roughly five times the forward view. Ask for the monthly series by zone and by product, never the index headline.', '已公布的意大利辅助服务总额为单月年化数据，约为远期预测的五倍。应索取按区域与产品分列的月度序列，绝不可采用指数概要数字。'] },
    { n: ['5 · Executed offtake — a MACSE award or a signed toll', '5 · 已执行的承购安排 — MACSE中标或已签租赁'],
      d: ['The only tier that changes the risk profile rather than the estimate. A MACSE award brings the TSO as counterparty for fifteen years; a toll brings a utility for ten. Neither price is negotiable after the fact, and only the MACSE one is public.', '唯一改变风险结构而非改变估算值的层级。MACSE中标带来的是十五年期以电网运营商为对手方的合同；租赁带来的是十年期公用事业对手方。两者事后均无法重新议价，且只有MACSE的价格是公开的。'] },
  ],

  // ---- capacity channel ----
  /* Only TWO points are published: 0.67 at four hours and 0.90 at eight. The rest
     of this curve is a monotone fill so the duration sweep runs, and it is
     labelled as a fill rather than as a factor table. Terna has PROPOSED cutting
     the four-hour factor to 0.53 for DY2028 — a 21% withdrawal of what is
     currently Europe's most favourable battery de-rating, carried in `official`
     as cmDerate4hProposed rather than applied here. */
  deratingCurve: { 1: 0.25, 2: 0.42, 4: 0.67, 6: 0.81, 8: 0.90, 10: 0.95, 20: 1.00 },
  /* Post-contract capacity persistence. Matches comparison.js's `postFactor: 0.5`
     so the two models cannot disagree. No Italian source addresses re-award
     pricing — the first 15-year contracts do not expire until 2042. */
  futureCapFactor: 0.5,

  // ---- duration ----
  /* Four hours across all three COD years for the modelled archetype. The finding
     that matters sits beside it rather than inside it: MACSE pays per MWh and its
     awarded fleet averaged 6.68 hours. A MACSE-optimised Italian battery is a
     materially different machine from the one this path describes. */
  durationPath: { years: ['2028', '2029', '2030'], hours: [4, 4, 4] },
  durConfigs: [2, 4, 6, 8, 10],
  /* Re-based to four hours, because every published Italian revenue figure is
     quoted there. These are the platform's shared duration-capture shape divided
     by 0.75; the shape is a convention, not an Italian observation. */
  durSpreadFactor: { 1: 1.533, 2: 1.333, 4: 1.000, 6: 0.827, 8: 0.733, 10: 0.640, 20: 0.400 },
  /* 1.00 by design — see the header note. Every Italian figure this dashboard
     reconciles to is already quoted on a nameplate basis. */
  usableFraction: 1.0,
  /* 4h → 8h, €k per nameplate MW per year, on the MACSE route. The step is 4→8
     rather than 2→4 because those are the two durations Terna publishes a
     de-rating factor for, and because MACSE's per-MWh price makes the long end
     the interesting one.

     Incremental capex is four more hours at the €220/kWh seed — €880,000/MW,
     annualised over a 20-year life at 8% (annuity factor 0.10185) ≈ €90k/MW/yr.

     THE RESULT IS NEGATIVE AND THAT IS THE FINDING. On a flat per-kWh capex band
     the fifth-to-eighth hours do not pay, yet MACSE awarded 6.68 hours on
     average. Either the winners hold a power/energy cost decomposition the
     published band does not expose, or they are pricing the fifteen-year TSO
     contract above the marginal cost of the energy. This dashboard cannot tell
     which, and says so rather than picking. */
  marginalHour: [
    { l: ['MACSE payment doubles — the price is per MWh of storage, not per MW', 'MACSE付费翻倍 — 计价基础为每MWh储能而非每MW'], v: 52, t: 'd' },
    { l: ['Capacity market — not stackable with a MACSE award', '容量市场 — 不可与MACSE中标叠加'], v: 0, t: 'd' },
    { l: ['MSD — power-based, does not scale with duration', '辅助服务市场 — 功率型，不随时长增长'], v: 0, t: 'd' },
    { l: ['Annualised incremental capex on a flat €220/kWh band (€880k/MW, 20 yr at 8%)', '按€220/kWh平价区间计的年化增量资本开支（每MW €880k，20年，8%）'], v: -90, t: 'd' },
    { l: ['Degradation and incremental opex', '衰减与增量运维'], v: -2, t: 'd' },
    { l: ['Net marginal value, hours 5–8', '第5–8小时净边际价值'], v: -40, t: 'total' },
  ],
  durFactors: [
    { n: ['MACSE pays per MWh of storage, not per MW', 'MACSE按每MWh储能计价，而非按每MW'], w: 18, s: 3 },
    { n: ['MACSE-awarded fleet averaged 6.68h against a 4h market convention', 'MACSE中标机组平均6.68小时，而市场惯例为4小时'], w: 14, s: 3 },
    { n: ['Midday solar trough and the length of the southern surplus window', '午间光伏低谷与南部盈余窗口时长'], w: 12, s: 3 },
    { n: ['Capacity de-rating rewards duration — 67% at 4h against 90% at 8h', '容量折减系数奖励时长 — 4小时67%，8小时90%'], w: 12, s: 3 },
    { n: ['Capex is quoted per kWh, so hours price linearly with no power-block discount', '造价按每kWh报价，故时长呈线性定价，无功率段折让'], w: 10, s: 1 },
    { n: ['MSD is power-based and does not pay for duration', '辅助服务市场为功率型，不为时长付费'], w: 10, s: 1 },
    { n: ['Spread-capture decay at longer duration', '更长时长的价差捕获衰减'], w: 8, s: 1 },
    { n: ['Signed tolls index on 4h (Zelestra / EnBW, 300 MW / 1.2 GWh)', '已签租赁以4小时为基准（Zelestra与EnBW，300MW/1.2GWh）'], w: 8, s: 2 },
    { n: ['MACSE oversizing obligation — 18% at 8h across the term', 'MACSE超配义务 — 8小时系统全期18%'], w: 8, s: 3 },
  ],
  durBands: [
    { lo: 0, hi: 34, n: ['Shallow-shift market', '浅移峰市场'], c: 'info',
      d: ['1–2h suffices; MWh added beyond that is unpaid capital.', '1–2小时已足够；超出部分的MWh属无回报资本。'] },
    { lo: 35, hi: 54, n: ['2h merchant zone', '2小时市场化区间'], c: 'warn',
      d: ['Underwrite 2h; treat the third and fourth hours as option value only.', '按2小时测算；第三、第四小时仅作期权价值。'] },
    { lo: 55, hi: 69, n: ['Transition to 4h', '向4小时过渡'], c: 'serious',
      d: ['Build 4h only where the marginal-hour NPV clears without a contracted line.', '仅当边际小时NPV在无合同化收入的情况下仍为正时，才按4小时建设。'] },
    { lo: 70, hi: 100, n: ['Duration-driven — 4h is the merchant floor', '时长驱动 — 4小时为市场化路径底线'], c: 'good',
      d: ['4h is the merchant default. A MACSE bid is a different machine: price it at 6–8h, on a per-MWh payment, against a capex decomposition the public band does not give you.', '4小时为市场化路径的默认设计。MACSE投标则是另一种设备：应按6–8小时、以每MWh计价方式，并对照公开区间未提供的造价拆分进行测算。'] },
  ],
  augItems: [
    ['Land reserved for additional enclosures', '预留新增电池舱用地'],
    ['DC collection and containerised expansion capacity', '直流汇集与集装箱式扩容能力'],
    ['Transformer and switchgear headroom above the STMG rating', '变压器与开关设备容量高于STMG额定值的裕度'],
    ['PCS and EMS compatibility with added MWh', 'PCS与EMS对新增MWh的兼容性'],
    ['STMG connection solution covers the added MWh without re-issue', 'STMG并网方案覆盖新增MWh且无需重新出具'],
    ['Autorizzazione Unica / PAUR headroom for the larger footprint', '单一许可/PAUR对更大占地的许可裕度'],
    ['MACSE technical compliance retained after the change — capacity held to term', '变更后仍满足MACSE技术合规 — 全期维持已签约容量'],
    ['MSD qualification retained across products after the change', '变更后仍保留各产品的辅助服务市场资格'],
    ['Capacity market nomination unaffected by the de-rated MW change', '容量市场申报不受折减后MW变动影响'],
    ['Tolling counterparty consent to augmentation', '租赁交易对手对增容的同意'],
  ],
  augDefaults: [2, 2, 1, 2, 1, 1, 1, 1, 1, 1],

  // ---- pipeline ----
  /* Two contracted stages, not one, because Italy has two contracted routes with
     different counterparties. A MACSE award scores ABOVE a toll because the
     counterparty is the TSO on a fifteen-year term, and BELOW construction
     because the award still has to be built. */
  stages: [
    { id: 'op',    n: ['Operating and dispatching', '已投运并参与调度'], p: 100 },
    { id: 'comm',  n: ['Commissioning / phased energisation', '调试中/分阶段送电'], p: 92 },
    { id: 'con',   n: ['Under construction, financial close reached', '在建，已融资交割'], p: 88 },
    { id: 'macse', n: ['MACSE award executed, pre-FID', '已取得MACSE中标，未作最终投资决策'], p: 72 },
    { id: 'toll',  n: ['Tolling agreement executed, pre-FID', '已签租赁协议，未作最终投资决策'], p: 62 },
    { id: 'auth',  n: ['Autorizzazione Unica / PAUR granted', '已取得单一许可/PAUR'], p: 48 },
    { id: 'grid',  n: ['STMG connection solution accepted', '已接受STMG并网方案'], p: 35 },
    { id: 'app',   n: ['Connection application lodged', '已提交并网申请'], p: 14 },
    { id: 'ann',   n: ['Announced only', '仅公告'], p: 6 },
  ],
  /* Axpo / Zelestra is a real, publicly announced project with a published MW,
     tenor and region, and is named. Its DURATION is not disclosed; four hours is
     the archetype convention and is registered as a gap. Everything else is a
     seed example and is labelled as one. No published average Italian grid-scale
     project size exists. */
  projects: [
    { n: 'Axpo / Zelestra tolling agreement', owner: 'Zelestra', region: 'Nord', site: 'Northern Italy', mw: 207, h: 4, cod: 2027, st: 'toll' },
    { n: 'IT seed example A', region: 'Sardegna',       mw: 100, h: 4, cod: 2027, st: 'op' },
    { n: 'IT seed example B', region: 'Sud e Calabria', mw: 150, h: 4, cod: 2027, st: 'comm' },
    { n: 'IT seed example C', region: 'Sicilia',        mw: 120, h: 8, cod: 2028, st: 'con' },
    { n: 'IT seed example D', region: 'Sud e Calabria', mw: 250, h: 8, cod: 2028, st: 'macse' },
    { n: 'IT seed example E', region: 'Sicilia',        mw: 180, h: 6, cod: 2028, st: 'macse' },
    { n: 'IT seed example F', region: 'Sardegna',       mw: 140, h: 6, cod: 2029, st: 'macse' },
    { n: 'IT seed example G', region: 'Nord',           mw: 200, h: 4, cod: 2029, st: 'toll' },
    { n: 'IT seed example H', region: 'Centro-Sud',     mw: 160, h: 4, cod: 2029, st: 'auth' },
    { n: 'IT seed example I', region: 'Nord',           mw: 300, h: 4, cod: 2030, st: 'grid' },
    { n: 'IT seed example J', region: 'Centro-Nord',    mw: 110, h: 4, cod: 2030, st: 'app' },
    { n: 'IT seed example K', region: 'Sud e Calabria', mw: 220, h: 8, cod: 2030, st: 'ann' },
  ],

  // ---- connection ----
  /* Higher score = higher risk, as in DE, RO, PL and the NEM. Weights sum to 100
     and the weighted score is 47, which is the figure comparison.js carries as
     `score.connectionRisk`. */
  connFactors: [
    { n: ['Bidding-zone eligibility checked against the MACSE requirement table', '对照MACSE需求表核查报价区资格'], w: 9,  s: 1 },
    { n: ['STMG connection solution issued and accepted', '已出具并接受STMG并网方案'], w: 15, s: 2 },
    { n: ['Authorisation route — Autorizzazione Unica / PAUR and regional consent', '许可路径 — 单一许可/PAUR与大区同意'], w: 14, s: 2 },
    { n: ['Land control and site constraint (seismic, hydrogeological, archaeological)', '土地控制与场址约束（地震、水文地质、考古）'], w: 8,  s: 1 },
    { n: ['MACSE technical compliance and availability obligations', 'MACSE技术合规与可用性义务'], w: 9,  s: 1 },
    { n: ['Capacity de-rating stability — the DY2028 proposal', '容量折减系数稳定性 — 2028实需年度提案'], w: 12, s: 2 },
    { n: ['MSD qualification per product and per direction', '按产品与方向分别取得辅助服务市场资格'], w: 8,  s: 1 },
    { n: ['Dependency on a named submarine commissioning date', '对具名海底工程投运日期的依赖'], w: 9,  s: 1 },
    { n: ['Curtailment exposure pending ARERA Resolution 128/2025 compensation', '待ARERA第128/2025号决议补偿落地前的限电敞口'], w: 9,  s: 1 },
    { n: ['Evidence and governance quality', '证据与治理质量'], w: 7,  s: 1 },
  ],
  connBands: [
    { lo: 0, hi: 24, n: ['Connection-investable', '可投资并网状态'], c: 'good',
      d: ['Evidence is sufficient to release development consideration.', '证据充分，可支付开发对价。'] },
    { lo: 25, hi: 44, n: ['Conditional — require CPs & holdbacks', '有条件 — 需先决条件与保留款'], c: 'warn',
      d: ['Structure the risk: zone eligibility confirmed in writing, an STMG cap, and holdbacks against the de-rating review.', '以结构应对风险：书面确认区域资格、设置STMG成本上限，并针对折减系数复核保留部分价款。'] },
    { lo: 45, hi: 64, n: ['Material risk — re-price / defer', '重大风险 — 重新定价或延后'], c: 'serious',
      d: ['Re-price or defer until the STMG is issued and the DY2028 de-rating is decided.', '在STMG出具且2028实需年度折减系数确定之前，重新定价或延后。'] },
    { lo: 65, hi: 100, n: ['Not investment-ready', '不具备投资条件'], c: 'critical',
      d: ['Do not commit capital; the connection chain is unproven.', '不得投入资本；并网链条尚未证实。'] },
  ],

  /* ---- named transmission ------------------------------------------------
     Four named submarine schemes with commissioning years between 2028 and 2030,
     inside a Development Plan committing more than €23bn over ten years. This is
     the strongest relief evidence on the platform: dated projects rather than
     programme years. The plan row is carried last and deliberately marked weaker,
     because a decade of capital expenditure is not a commissioning date. */
  /* Italy's status vocabulary. The spread here is real and it is why this is the
     platform's strongest relief evidence: three schemes with steel and cable in
     place, one in delivery, and one programme row that is deliberately weakest. */
  planClasses: [
    { id: 'construction', n: ['In construction', '在建'], c: 'warn',
      d: ['Physically underway with cable supply contracted. The class where an Italian commissioning year can be underwritten.', '已实际开工且电缆供应已签约。这是意大利投运年份可供承销的类别。'] },
    { id: 'delivery',     n: ['In delivery', '交付中'], c: 'info',
      d: ['Contracted and progressing under an EU-supported programme, but not yet in main construction.', '已签约并在欧盟支持的计划下推进，但尚未进入主体施工。'] },
    { id: 'programme',    n: ['Approved programme', '已核准计划'], c: 'serious',
      d: ['An approved ten-year capital envelope covering many works. A decade of capital expenditure is not a commissioning date.', '已核准的、覆盖多项工程的十年资本额度。十年资本开支不等于投运日期。'] },
  ],

  reinforcements: [
    { n: ['Tyrrhenian Link', '第勒尼安互联'], operator: 'Terna', region: ['Sicily ↔ Campania ↔ Sardinia', '西西里 ↔ 坎帕尼亚 ↔ 撒丁'], cls: 'construction',
      scope: ['1,000 MW, 970 km, €3.7bn double 500 kV HVDC; Sicily–Campania with a western branch to Sardinia; under construction since January 2025',
              '1,000MW、970公里、37亿欧元双回500千伏高压直流；连接西西里与坎帕尼亚，西段延伸至撒丁岛；自2025年1月起施工'],
      year: 2028, status: ['Under construction; western branch cable installed', '在建；西段电缆已敷设'], c: 'warn' },
    { n: ['SA.CO.I.3', 'SA.CO.I.3'], operator: 'Terna', region: ['Sardinia ↔ Corsica ↔ Tuscany', '撒丁 ↔ 科西嘉 ↔ 托斯卡纳'], cls: 'construction',
      scope: ['400 MW renewal of the Sardinia–Corsica–Tuscany link; land-based construction started',
              '400MW，更新撒丁岛—科西嘉—托斯卡纳联络线；陆上工程已开工'],
      year: 2028, status: ['Under construction', '在建'], c: 'warn' },
    { n: ['ELMED', 'ELMED互联'], operator: 'Terna / STEG', region: ['Sicily ↔ Tunisia', '西西里 ↔ 突尼斯'], cls: 'delivery',
      scope: ['600 MW over ~200 km of HVDC submarine cable, Sicily to Tunisia; EU PCI-supported. An IMPORT corridor — it changes the Sicilian price stack without relieving the export constraint',
              '600MW、约200公里海底高压直流电缆，连接西西里与突尼斯；获欧盟共同利益项目支持。属受入通道 — 改变西西里价格结构，但不缓解送出约束'],
      year: 2028, status: ['In delivery', '交付中'], c: 'info' },
    { n: ['Adriatic Link', '亚得里亚海互联'], operator: 'Terna / Prysmian', region: ['Marche ↔ Abruzzo', '马尔凯 ↔ 阿布鲁佐'], cls: 'construction',
      scope: ['1,000 MW HVDC over 250 km, of which 210 km submarine, Fano in Marche to the Cepagatti area in Abruzzo; ≈€630m cable contract, laying concludes in the first half of 2028',
              '1,000MW高压直流，全长250公里，其中海底段210公里，自马尔凯大区法诺至阿布鲁佐大区切帕加蒂地区；电缆合同约6.3亿欧元，敷设于2028年上半年完成'],
      year: 2029, status: ['Under construction, cable contracted', '在建，电缆已签约'], c: 'warn' },
    { n: ['Development Plan 2025–2034', '2025–2034年发展规划'], operator: 'Terna', region: ['Italy', '意大利全境'], cls: 'programme',
      scope: ['More than €23bn over ten years, of which €16.6bn across 2024–2028; approved and in execution. A programme, not a commissioning date',
              '十年投资超过230亿欧元，其中2024–2028年为166亿欧元；已获批准并在执行中。属计划而非投运日期'],
      year: 2034, status: ['Approved, in execution — weakest relief evidence here', '已获批准并执行中 — 本表中证据力最弱'], c: 'serious' },
  ],

  /* ---- coverage gaps, rendered verbatim on the Data & Methodology tab ----
     Not a caveat list. Each row is a number this dashboard is asked for and
     cannot supply, with what it uses instead. */
  notPublished: [
    { item: ['Italian toll price, any deal', '意大利租赁价格，任何交易'],
      status: ['Never disclosed, in any of the three signed transactions', '从未披露，三笔已签署交易均无'],
      why: ['Zelestra / BKW, Zelestra / EnBW and Axpo / Zelestra were all announced without a price. Tenor and MW are published; the fee is not. The hypothesis that Italian tolls price above MACSE is therefore UNVERIFIED — no Italian toll price exists to verify it against.',
            'Zelestra与BKW、Zelestra与EnBW、Axpo与Zelestra三笔交易的公告均未披露价格。期限与MW已公布，费用则未公布。因此“意大利租赁定价高于MACSE”这一假设未经证实 — 不存在可供比对的意大利租赁价格。'],
      instead: ['A bracket between the two anchors a rational toll must sit inside: the MACSE four-hour equivalent of €51,836/MW/yr at the floor, below which a developer takes the TSO contract instead, and the €123,000/MW/yr four-hour wholesale spread at the ceiling, above which the offtaker loses money on the wholesale leg alone. The seed is the midpoint, €87,000.',
                '采用理性租赁定价所必然落入的两个锚点之间的区间：下限为MACSE四小时等值每MW每年€51,836，低于此水平开发商将转而选择电网运营商合同；上限为四小时批发价差每MW每年€123,000，高于此水平承购方仅在批发环节即告亏损。种子值取中值€87,000。'] },
    { item: ['Italy-specific turnkey capex, €/kWh', '意大利本地交钥匙造价，每kWh'],
      status: ['Two credible sources disagree by roughly half', '两个可信来源相差约一半'],
      why: ['The European turnkey 4h LFP band puts an Italian system at €180–260/kWh — €720k to €1.04m/MW. Expert interviews on Italian projects in October 2025 put all-in cost near $120/kWh, about €440k/MW. ARERA Deliberazione 168/2025, Allegato B is the reference-technology cost study that would settle it and it could not be machine-read.',
            '欧洲4小时磷酸铁锂交钥匙区间将意大利系统定价为€180–260/kWh — 每MW €72万至€104万。2025年10月针对意大利项目的专家访谈显示全包成本接近$120/kWh，约每MW €44万。ARERA第168/2025号决议附件B为可解决该问题的参考技术成本研究，但无法机器读取。'],
      instead: ['The €220/kWh midpoint as the seed, with a band spanning the full factor of 2.4 rather than a narrower range that would imply evidence this platform does not have. Extracting Allegato B is the highest-value single follow-up for this market — gate G22.',
                '以€220/kWh中值作为种子值，区间覆盖完整的2.4倍跨度，而非采用更窄区间以免暗示本平台并不具备的证据。提取附件B是本市场最具价值的单项后续工作 — 研究缺口G22。'] },
    { item: ['MSD revenue at an underwriting level, €/MW/yr', '可用于承销的辅助服务市场收入，每MW每年'],
      status: ['The only published total is a single month annualised', '唯一公布的总额为单月年化数据'],
      why: ['The Clean Horizon Storage Index reported Italy at €654k/MW/yr in the North and €640k in the South for May 2026, with about 80% from tertiary reserve. Those figures are correctly published and are a spot run-rate, roughly five times the forward view. Sustaining them would require about €530k/MW/yr of durable mFRR against a fleet Modo expects to grow from 1.9 GW to as much as 15 GW by 2030.',
            'Clean Horizon储能指数报告2026年5月意大利北部为每MW每年€654k、南部€640k，其中约80%来自三次备用。这些数据的公布无误，但属现货运行率，约为远期预测的五倍。若要维持该水平，需在Modo预计装机将从1.9GW增至2030年最高15GW的背景下，持续获得约每MW每年€530k的三次备用收入。'],
      instead: ['Modo\'s published revenue SPLIT rather than the index level: balancing at about 10% of southern mainland BESS revenue gives €13,667/MW/yr against the €123,000 wholesale figure. The Sardinian 20% share sets the top of the band. MSD saturation is the dominant modelling risk in Italy — gate G23.',
                '采用Modo公布的收入构成拆分而非指数水平：平衡服务约占南部大陆储能收入10%，按€123,000批发收入计得每MW每年€13,667。撒丁岛20%的占比构成区间上限。辅助服务市场饱和是意大利建模的主要风险 — 研究缺口G23。'] },
    { item: ['Italian curtailment volumes, GWh', '意大利限电量，GWh'],
      status: ['No headline volume found', '未找到总量数据'],
      why: ['ARERA Resolution 128/2025/R/EFR is the compensation instrument and Terna holds the underlying data, but no 2025 curtailment total in GWh or as a share of renewable generation was located.',
            'ARERA第128/2025/R/EFR号决议为补偿机制，Terna持有底层数据，但未找到2025年以GWh计或以占新能源发电比例计的限电总量。'],
      instead: ['Nothing. No curtailment revenue or cost line exists anywhere in this model. The congestion register uses the zonal MACSE spread as a proxy for constraint value and says explicitly that it is a proxy, not a measurement — gate G14.',
                '不作任何替代处理。本模型任何位置均无限电收入或成本项。拥塞登记表以MACSE分区价差作为约束价值的代理指标，并明确说明其为代理而非实测 — 研究缺口G14。'] },
    { item: ['Italian fixed opex, €/MW/yr', '意大利固定运维成本，每MW每年'],
      status: ['Complete gap — no Italian figure from any source', '完全缺失 — 任何来源均无意大利数据'],
      why: ['Nothing was found from Terna, ARERA, GSE, MASE or the trade press. This is a rarer gap than it looks: Italy publishes auction prices to the euro and does not publish an operating cost.',
            '未能从Terna、ARERA、GSE、MASE或行业媒体找到任何数据。这一缺口比表面看来更为罕见：意大利将拍卖价格公布至欧元级，却不公布运营成本。'],
      instead: ['€13,000/MW/yr, consistent with the general European €10–15/kW/yr convention for grid-scale LFP, carried as an explicit placeholder. It should be replaced before it drives any published output — gate G13.',
                '采用每MW每年€13,000，与欧洲电网级磷酸铁锂每kW每年€10–15的通行惯例一致，作为明确的占位值。在其影响任何已发布结果之前应予替换 — 研究缺口G13。'] },
    { item: ['Italian optimiser / route-to-market fee, %', '意大利优化商/售电路径服务费率，%'],
      status: ['No Italian disclosure', '意大利无披露'],
      why: ['Italy has an active third-party optimisation market and not one fee percentage has been published.',
            '意大利拥有活跃的第三方优化服务市场，却无一项费率被公布。'],
      instead: ['9%, the midpoint of the platform\'s 8–10% cross-market seed, widened to 6–12% in the comparison bands.',
                '采用9%，为本平台跨市场种子区间8–10%的中值；对比区间中扩展为6–12%。'] },
    { item: ['Italian degradation series, %/yr', '意大利衰减率序列，每年%'],
      status: ['Not published', '未公布'],
      why: ['No Italian operator, OEM or analyst publishes a measured Italian degradation series.',
            '意大利无任何运营商、设备商或分析机构公布实测衰减序列。'],
      instead: ['1.1%/yr, derived from what the Italian market itself prices rather than from a warranty curve: MACSE technical compliance requires an eight-hour system to be oversized 18% to hold contracted capacity across fifteen years, which implies about 1.02%/yr. This is the degradation a fifteen-year Italian obligation is actually written against.',
                '采用每年1.1%，源自意大利市场自身的定价而非质保曲线：MACSE技术合规要求八小时系统超配18%，以在十五年内维持已签约容量，据此推算约为每年1.02%。这正是意大利十五年期义务实际据以订立的衰减水平。'] },
    { item: ['MACSE assignee retention — the ~80 / 20 contribution-margin split', 'MACSE受让方留存比例 — 约80/20的贡献毛利分成'],
      status: ['Corroborated by two secondary readings, not verified in Terna\'s regulation', '经两项二手解读佐证，但未在Terna规则文本中核实'],
      why: ['Terna resells the contracted time-shifting product and the assignee keeps MSD trading control while returning most of the contribution margin. Two independent secondary sources put the owner\'s retention near 20%. The percentage was not located in the scheme regulation itself.',
            'Terna转售已签约的时移产品，受让方保留辅助服务市场交易控制权，同时将大部分贡献毛利返还。两个独立二手来源认为业主留存比例接近20%。该百分比未能在机制规则文本本身中找到。'],
      instead: ['20% as `merchantRetention` on the MACSE route, flagged as a secondary-source derivation. A reader who believes the split is different should move it in the Investment Lab — it is one of the more sensitive inputs in the Italian case.',
                '在MACSE路径中采用20%作为`merchantRetention`，并标注为二手来源推导值。若读者认为分成比例不同，可在投资测算模块中调整 — 这是意大利投资逻辑中较为敏感的输入之一。'] },
    { item: ['Terna de-rating factor table by duration', 'Terna按时长划分的折减系数表'],
      status: ['Two points obtained, the table not located', '取得两个数据点，未找到完整表格'],
      why: ['0.67 at four hours and 0.90 at eight hours were both obtained, along with the 0.53 proposal for DY2028. The full factor table across all durations was not.',
            '已取得四小时0.67与八小时0.90，以及2028实需年度0.53的提案。但未取得涵盖所有时长的完整系数表。'],
      instead: ['A monotone fill between and beyond the two published points so the duration sweep runs. The fill is labelled as a fill on the duration tab; only the 4h and 8h values should be quoted.',
                '在两个已公布数据点之间及之外进行单调填充，以支持时长敏感性测算。该填充在时长页已标注为填充值；仅4小时与8小时数值可供引用。'] },
    { item: ['Power / energy decomposition inside the €/kWh capex band', '每kWh造价区间内的功率段/能量段拆分'],
      status: ['Not published — and it is the question the MACSE result raises', '未公布 — 而这正是MACSE结果所引出的问题'],
      why: ['The Italian capex evidence is a flat €/kWh band with no power-block and energy-block split. On a flat per-kWh cost the fifth-to-eighth hours do not pay, yet MACSE awarded 6.68 hours on average. Either the winners hold a decomposition the public band does not expose, or they are pricing the fifteen-year TSO contract above the marginal cost of the energy.',
            '意大利造价证据为一个不区分功率段与能量段的平价每kWh区间。在平价每kWh成本下，第五至第八小时无法收回成本，但MACSE中标机组平均时长却达6.68小时。要么中标方掌握公开区间未披露的成本拆分，要么其对十五年期电网运营商合同的定价高于能量的边际成本。'],
      instead: ['`lab.capexKW` is set to zero and hours price linearly, which is the honest reading of the only Italian evidence available. The consequence — a negative marginal value for hours 5–8 — is shown on the duration tab rather than hidden by fitting a decomposition backwards from the auction result.',
                '将`lab.capexKW`设为零，时长呈线性定价，这是对现有唯一意大利证据的诚实解读。由此产生的结果 — 第5至第8小时边际价值为负 — 在时长页明确展示，而非通过从拍卖结果反推成本拆分予以掩盖。'] },
    { item: ['Duration of the named Italian toll deals', '已具名意大利租赁交易的时长'],
      status: ['Disclosed for one of three', '三笔中仅一笔披露'],
      why: ['Zelestra / EnBW is published as 300 MW / 1.2 GWh, which is four hours. Axpo / Zelestra is published as 207 MW with a ten-year tenor and no energy figure. Zelestra / BKW carries neither.',
            'Zelestra与EnBW的交易公布为300MW/1.2GWh，即四小时。Axpo与Zelestra公布为207MW、十年期限，未公布电量。Zelestra与BKW两者均未公布。'],
      instead: ['Four hours as the archetype convention on the named pipeline row, stated as a convention rather than as a disclosure.',
                '在具名管线行中按原型惯例采用四小时，并明确标示为惯例而非披露数据。'] },
    { item: ['A 2026 MACSE result', '2026年MACSE结果'],
      status: ['Does not exist — the second auction has not been held', '不存在 — 第二次拍卖尚未举行'],
      why: ['The first and only completed auction is 30 September 2025, revised 10 October 2025. The second is scheduled for 24 November 2026 at 16 GWh, up from 10 GWh, with no reserve premium published at the time of writing.',
            '首次也是唯一已完成的拍卖为2025年9月30日，2025年10月10日修订。第二次定于2026年11月24日举行，规模由10GWh增至16GWh，截至撰写时尚未公布保留溢价。'],
      instead: ['The 2025 clear, stated with its date. Any figure attributed to a "2026 MACSE auction" anywhere is either the 2025 result mislabelled or an invention.',
                '采用2025年出清结果，并标明其日期。任何被归为“2026年MACSE拍卖”的数值，要么是对2025年结果的错误标注，要么是虚构。'] },
  ],

  lab: {
    /* ---- capital structure. Seeded neutral: nothing here moves a published
       return until it is set. VAT is recoverable, so it costs only timing, and
       the Lab leaves the refund lag to the engine. */
    vatPct: 22, vatRecoverable: 1,
    devCostPct: 0, rtbPremiumPct: 0, constructionMonths: 12,
    /* 100 MW is a modelling convention — no published Italian average exists.
       Four hours is the basis every published Italian revenue figure is quoted
       on, and the duration of the one toll whose energy is disclosed.

       capexKWh 220 + capexKW 0 is not laziness. The only Italian capex evidence
       is a flat €/kWh band with no power/energy split, so hours price linearly.
       The consequence is visible on the duration tab and registered as a gap.

       spread 62 €/MWh is the executable margin per discharged MWh AFTER the
       four-hour duration factor of 1.000 and at 88% round-trip efficiency. At
       1.4 cycles/day and 97% availability that is 1,983 MWh/MW/yr, reproducing
       comparison.js's €123,000/MW/yr southern merchant seed to within 0.06%.

       capPrice 47 is the DY2027 capacity premium per MW of DE-RATED capacity.
       At the published four-hour factor of 0.67 it pays €31,490/MW/yr, which is
       exactly comparison.js's `contracted`. Move hours to 8 and the factor rises
       to the published 0.90 — Italy is the market where duration buys capacity
       revenue rather than forfeiting it.

       servicesKW 13.667, opexKW 13, optFee 9, grantPct 0 and degr 1.1 are
       comparison.js's values unchanged. */
    mw: 100, hours: 4, capexKWh: 220, capexKW: 0, opexKW: 13,
    rte: 88, avail: 97, degr: 1.1, cycles: 1.4, spread: 62, optFee: 9,
    capPrice: 47, capYrs: 15, servicesKW: 13.667, grantPct: 0,
    life: 20, disc: 8, debtPct: 60, rate: 5.5, tenor: 15,
  },

  glossary: [
    ['MACSE — Meccanismo di Approvvigionamento di Capacità di Stoccaggio Elettrico', 'MACSE — 电力储能容量采购机制'],
    ['Terna — the Italian transmission system operator', 'Terna — 意大利输电系统运营商'],
    ['ARERA — Autorità di Regolazione per Energia Reti e Ambiente', 'ARERA — 能源、电网与环境监管局'],
    ['GME — Gestore dei Mercati Energetici, the power exchange', 'GME — 能源市场管理机构，即电力交易所'],
    ['GSE — Gestore dei Servizi Energetici', 'GSE — 能源服务管理机构'],
    ['MASE — Ministero dell\'Ambiente e della Sicurezza Energetica', 'MASE — 环境与能源安全部'],
    ['MGP — Mercato del Giorno Prima, the day-ahead market', 'MGP — 日前市场'],
    ['MI-A / MI-XBID — Mercato Infragiornaliero, intraday auctions and continuous', 'MI-A/MI-XBID — 日内市场，含拍卖与连续交易'],
    ['MSD — Mercato per il Servizio di Dispacciamento, the ancillary services market', 'MSD — 调度服务市场，即辅助服务市场'],
    ['MB — Mercato di Bilanciamento, real-time balancing', 'MB — 平衡市场，实时平衡'],
    ['Mercato della Capacità — the Italian capacity market', 'Mercato della Capacità — 意大利容量市场'],
    ['Coefficiente di derating — the de-rating factor by duration', '折减系数 — 按时长确定'],
    ['PUN — Prezzo Unico Nazionale, a demand-side average', 'PUN — 全国统一电价，需求侧平均价'],
    ['Bidding zones: NORD, CNOR, CSUD, SUD, SICI, SARD', '报价区：北部、中北部、中南部、南部、西西里、撒丁岛'],
    ['STMG — Soluzione Tecnica Minima Generale, the connection solution', 'STMG — 最小技术方案，即并网方案'],
    ['Autorizzazione Unica / PAUR — the single authorisation route', '单一许可/PAUR — 单一授权路径'],
    ['UVAM — Unità Virtuali Abilitate Miste, mixed virtual enabled units', 'UVAM — 混合型虚拟合格单元'],
    ['Riserva terziaria — tertiary reserve, the deepest MSD product for storage', '三次备用 — 储能在辅助服务市场中最具深度的产品'],
    ['Deliberazione ARERA 168/2025, Allegato B — reference storage technology costs', 'ARERA第168/2025号决议附件B — 参考储能技术成本'],
    ['Tyrrhenian Link / Adriatic Link / SA.CO.I.3 / ELMED — the four submarine schemes', '第勒尼安互联/亚得里亚海互联/SA.CO.I.3/ELMED — 四项海底工程'],
    ['Delivery year (DY) — the capacity market obligation year', '实需年度（DY） — 容量市场义务年度'],
  ],

  kpiExport: [
    ['MACSE first auction, awarded energy', 9968, 'MWh', 'official', 'IT_SEED_V1', 'Terna, 30 Sep 2025 rev. 10 Oct 2025'],
    ['MACSE first auction, awarded power', 1491, 'MW', 'official', 'IT_SEED_V1', 'Terna, 30 Sep 2025 rev. 10 Oct 2025'],
    ['MACSE awarded fleet average duration', 6.68, 'h', 'calculated', 'IT_SEED_V1', '9,968 MWh ÷ 1,491 MW'],
    ['MACSE weighted average clearing price', 12959, 'EUR/MWh/yr', 'official', 'IT_SEED_V1', 'Terna'],
    ['MACSE clearing price, Sud e Calabria', 12146, 'EUR/MWh/yr', 'official', 'IT_SEED_V1', 'Terna'],
    ['MACSE clearing price, Sardegna', 15029, 'EUR/MWh/yr', 'official', 'IT_SEED_V1', 'Terna'],
    ['MACSE clearing price, Sicilia', 15846, 'EUR/MWh/yr', 'official', 'IT_SEED_V1', 'Terna'],
    ['MACSE price cap', 37000, 'EUR/MWh/yr', 'official', 'IT_SEED_V1', 'Terna — auction cleared at 35% of cap'],
    ['MACSE four-hour equivalent payment', 51836, 'EUR/MW/yr', 'calculated', 'IT_SEED_V1', 'weighted average x 4 hours'],
    ['MACSE payment at the awarded 6.68 hours', 86566, 'EUR/MW/yr', 'calculated', 'IT_SEED_V1', 'weighted average x 6.68 hours'],
    ['MACSE contract term', 15, 'yr', 'official', 'IT_SEED_V1', 'Terna — delivery from 2028'],
    ['MACSE requirement, North and Centre-North', 0, 'GWh', 'official', 'IT_SEED_V1', 'Terna first auction zonal requirements'],
    ['MACSE second auction volume', 16, 'GWh', 'official', 'IT_SEED_V1', 'Terna — scheduled 24 November 2026'],
    ['Capacity market premium, DY2027', 47000, 'EUR/MW/yr', 'official', 'IT_SEED_V1', 'Italian capacity market auction'],
    ['Capacity de-rating factor at 4h', 0.67, 'x', 'official', 'IT_SEED_V1', 'Terna'],
    ['Capacity de-rating factor at 8h', 0.90, 'x', 'official', 'IT_SEED_V1', 'Terna'],
    ['Capacity de-rating factor at 4h, DY2028 proposal', 0.53, 'x', 'official draft', 'IT_SEED_V1', 'Terna proposal — a 21% cut'],
    ['Capacity revenue at the 4h archetype', 31490, 'EUR/MW/yr', 'calculated', 'IT_SEED_V1', 'EUR 47,000 x 0.67'],
    ['MACSE and capacity market stackable', 'no', '-', 'official', 'IT_SEED_V1', 'mutually exclusive — never add the two'],
    ['Wholesale spread, North, 4h basis', 98000, 'EUR/MW/yr', 'third party forecast', 'IT_SEED_V1', 'Modo Energy July 2026'],
    ['Wholesale spread, South mainland, 4h basis', 123000, 'EUR/MW/yr', 'third party forecast', 'IT_SEED_V1', 'Modo Energy July 2026'],
    ['Wholesale forecast shape to 2040', 'flat in real terms', '-', 'third party forecast', 'IT_SEED_V1', 'Modo Energy July 2026'],
    ['Observed arbitrage peak, spring 2025', 200, 'EUR/kW/yr', 'third party', 'IT_SEED_V1', 'Timera Energy'],
    ['MSD share of BESS revenue, South mainland', 10, '%', 'third party forecast', 'IT_SEED_V1', 'Modo Energy'],
    ['MSD share of BESS revenue, Sardinia', 20, '%', 'third party forecast', 'IT_SEED_V1', 'Modo Energy'],
    ['MSD revenue seed', 13667, 'EUR/MW/yr', 'calculated', 'IT_SEED_V1', '10% share applied to the wholesale figure'],
    ['Storage Index, Italy North, May 2026', 654000, 'EUR/MW/yr', 'third party', 'IT_SEED_V1', 'Clean Horizon — one month annualised, NOT a seed'],
    ['MSD up-regulation price, Sicily', 320, 'EUR/MWh', 'third party', 'IT_SEED_V1', 'Jan-May 2025'],
    ['MSD up-regulation price, Centre-South', 250, 'EUR/MWh', 'third party', 'IT_SEED_V1', 'Jan-May 2025'],
    ['Operational BESS fleet', 1.9, 'GW', 'third party', 'IT_SEED_V1', 'Modo Energy Italy Buildout Report, end 2025'],
    ['Operational fleet on Sardinia', 800, 'MW', 'third party', 'IT_SEED_V1', 'Modo Energy — close to half the national total'],
    ['Fleet forecast, 2030 high case', 15, 'GW', 'third party forecast', 'IT_SEED_V1', 'Modo Energy'],
    ['Renewables share of national demand, 2025', 41, '%', 'official', 'IT_SEED_V1', 'Terna'],
    ['Turnkey capex band, 4h LFP', '180-260', 'EUR/kWh', 'third party', 'IT_SEED_V1', 'European turnkey EPC surveys 2026'],
    ['Italian expert-interview capex', 440000, 'EUR/MW', 'third party', 'IT_SEED_V1', 'October 2025 — conflicts with the European band'],
    ['Italy-specific capex, authoritative source', 'not machine-readable', '-', 'coverage gap', 'IT_SEED_V1', 'ARERA Del. 168/2025 Allegato B'],
    ['Italian toll price, any deal', 'not disclosed', '-', 'coverage gap', 'IT_SEED_V1', 'three signed deals, no price published'],
    ['Named toll tenor, Axpo / Zelestra', 10, 'yr', 'public', 'IT_SEED_V1', '207 MW, northern Italy, July 2026'],
    ['Italian fixed opex', 'not published', '-', 'coverage gap', 'IT_SEED_V1', 'placeholder on the European convention'],
    ['Italian curtailment volume, 2025', 'not found', '-', 'coverage gap', 'IT_SEED_V1', 'ARERA Res. 128/2025/R/EFR is the instrument'],
    ['Tyrrhenian Link capacity', 1000, 'MW', 'official', 'IT_SEED_V1', 'Terna — commissioning 2028'],
    ['Adriatic Link capacity', 1000, 'MW', 'official', 'IT_SEED_V1', 'Terna — commissioning 2029'],
    ['ELMED capacity', 600, 'MW', 'official', 'IT_SEED_V1', 'Terna / STEG — commissioning 2028, import corridor'],
    ['Development Plan commitment, 2025-2034', 23, 'EUR bn', 'official', 'IT_SEED_V1', 'Terna — a programme, not a commissioning date'],
  ],
};

export { M };
