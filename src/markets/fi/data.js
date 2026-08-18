/* ---------------------------------------------------------------------------
   Finland — market dataset.

   EVERY NUMBER HERE IS TRACEABLE TO sources.js, and the ones that are not
   present are not present on purpose. This dataset is smaller than the other
   markets' because it carries what was verified on 2026-08-18 and nothing more:
   Fingrid's reserve obligations and forecast, the FCR yearly-market clearing for
   2026, the adequacy position, the connection restriction, and the fleet the
   saturation gate measures.

   There is no revenue scorecard and no duration curve, because the reserve
   revenue level is withheld (gate FI-1) and a duration curve computed from a
   withheld level would be a chart of an assumption.
   --------------------------------------------------------------------------- */

const M = {
  asOf: '2026-08-18',
  dataDate: '2026 obligation period; FCR yearly market for delivery year 2026',
  modelVersion: 'fi-1.0-reserve-led-services-withheld',
  title: ['Finland Battery Investment Dashboard', '芬兰储能投资看板'],
  sub: ['Reserve-led market research: what the system pays for, what it has stopped paying for, and why the largest revenue line on this page is deliberately blank.',
        '备用主导型市场研究：系统为何付费、已停止为何付费，以及本页最大收入项为何刻意留白。'],
  nextMilestone: ['Next milestone: the Fingrid open-data licence (gate FI-2), which unlocks the eligible-versus-procured reserve measure the revenue line waits on',
                  '下一里程碑：明确Fingrid开放数据许可条款（研究缺口FI-2），据此建立收入项所依赖的合格容量与采购容量对比指标'],
  footerNote: ['Public sources verified 18 August 2026. This market is registered with engineReady:false and is excluded from the league table, the $1M engine and the certainty frontier by design.',
               '公开来源已于2026年8月18日核验。本市场以engineReady:false注册，按设计不计入同口径对比表、百万美元引擎及确定性前沿。'],
  seedWarn: ['Every value on this page is an approved base-case snapshot or a published official figure. The reserve revenue line is WITHHELD rather than estimated — see the Reserve Markets tab. A reserve obligation is never a captured price; an announced project is never a financed one; an available connection in the north is never a connection in the south.',
             '本页所有数值均为已批准的基准情景快照或已公布的官方数据。备用收入项为暂缓发布而非估算 — 详见"备用市场"页。备用需求不等于捕获价格；已公布项目不等于已融资项目；北部的可用并网容量不等于南部的并网容量。'],

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
      { name: ['Nivala', 'Nivala'], mw: 70, mwh: 140,
        status: ['Reported for 2026', '据报道于2026年投运'],
        src: 'tradePress' },
      { name: ['Uusikaupunki', 'Uusikaupunki'], mw: 50, mwh: 100,
        status: ['Reported for summer 2026', '据报道于2026年夏季投运'],
        src: 'tradePress' },
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
};

export { M };
export default M;
