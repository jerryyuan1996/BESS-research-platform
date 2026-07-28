/* ---------------------------------------------------------------------------
   Japan — the three regional lenses.

   Same national rulebook, three different storage problems:

     Tokyo     load depth / scarcity / flexibility
     Kyushu    solar surplus / curtailment / export constraint
     Hokkaido  renewable export / weak grid / interconnector constraint

   Only genuinely regional facts belong here. Anything true of every Japanese
   BESS lives in national.js.

   DATA PROVENANCE — read before using any number below.
   Two classes of value are mixed here and are badged differently throughout:

     ANCHORED   verified against the cited public source. Capacity Market area
                prices and contracted capacity, connection-study caps, verified
                curtailment days, Hokkaido–Honshu capacity, HEPCO charging-control
                system count, Hokkaido balancing/queue signals.

     SEED       illustrative, pending the ETL described in
                docs/japan-etl-gates.md. Every economics field: capex, opex,
                merchant margin, incremental balancing value, expected-capacity
                factor, renewal curve, and all three scorecards.

   The seed values are internally consistent and derived by a stated rule, but
   they are NOT a substitute for the 12-month area-price backtest the methodology
   requires. The dashboard says so on every affected card.
   --------------------------------------------------------------------------- */

/* Reference asset — identical in all three regions on purpose. The controlled
   experiment the Regional Benchmark tab asks: same 50 MW / 4h battery, same
   capex, what changes when you move it? */
export const JP_REFERENCE = {
  powerMW: 50,
  durationHours: 4,
  usableFraction: 0.95,
  rtePct: 88,
  availPct: 92,
  cyclesPerDay: 1,
  lifeYears: 15,
  degrPct: 2,
};

/* Common cost basis, JPY. SEED — reconcile against a real Japanese 4h build
   before any transaction use. ¥45,000/kWh × 4 h × 1,000 kWh/MWh = ¥180m/MW. */
export const JP_COMMON_COST = {
  capexPerKWh: 45000,
  capexPerMW: 180000000,
  opexPerMW: 1800000,
  optimiserFeePct: 10,
};

/* Expected Capacity factor applied to the Capacity Market area price for a 4h
   battery. The formula is national, so the same factor is used in all three
   areas and capacity revenue differs only by area price — which is the point.
   SEED, and the single highest-leverage open input in the whole Japan build. */
export const JP_EXPECTED_CAPACITY_FACTOR = 0.70;

/* Auction-renewal path. The Capacity Market main auction secures one delivery
   year; years 2-15 are assumed, not won. Rule: linear decline from 90% of the
   secured payment in year 2 to 60% in year 15, reflecting storage entering the
   auction. SEED — replace with a scenario from the Capacity & LTDA tab. */
function renewalCurve(securedJPYperMW){
  const n = 14, from = 0.90, to = 0.60;
  return Array.from({ length: n }, (_, i) =>
    Math.round(securedJPYperMW * (from + (to - from) * (i / (n - 1)))));
}

const cmPrice = { tokyo: 15111, kyushu: 15112, hokkaido: 14972 };
const secured = (area) => Math.round(cmPrice[area] * 1000 * JP_EXPECTED_CAPACITY_FACTOR);

export const JP_REGIONS = {
  // =========================================================================
  tokyo: {
    id: 'jp_tokyo',
    short: ['Tokyo', '东京'],
    name: ['Japan — Tokyo Area', '日本 — 东京区域'],
    area: ['Tokyo Area', '东京区域'],
    tso: ['TEPCO Power Grid', '东京电力电网'],
    color: 'var(--s7)',
    thesis: ['Load depth / scarcity / flexibility', '负荷深度 / 稀缺性 / 灵活性'],
    thesisLong: [
      'The large-load, scarcity and flexibility benchmark. Underwrite Tokyo-area price capture and connection quality, not demand size — being inside TEPCO territory is not itself an underwriting argument.',
      '大负荷、稀缺性与灵活性基准市场。应以东京区域价格兑现与并网质量为承销依据，而非负荷规模 — 身处东京电力辖区本身并不构成投资理由。',
    ],
    conclusion: [
      'Prefer projects with strong import/export evidence and demonstrated Tokyo-area price capture; do not pay a development premium merely for being in TEPCO territory.',
      '优先选择具备充分充放电接入证据、且已验证东京区域价格兑现能力的项目；不应仅因位于东京电力辖区而支付开发溢价。',
    ],

    // ---- JEPX (SEED) ----
    jepx: {
      avgJPYkWh: 13.8, p95JPYkWh: 31.5, p05JPYkWh: 5.9,
      optimised4hSpreadJPYkWh: 9.0,
      nearZeroIntervalsPct: 3.1,
      basisToSystemJPYkWh: 0.6,
      marketSplitHoursPct: 12.4,
    },

    // ---- curtailment (ANCHORED: OCCTO verified days) ----
    curtailment: {
      verified: [
        { m: ['Mar 2026', '2026年3月'], days: 5 },
        { m: ['Apr 2026', '2026年4月'], days: 6 },
        { m: ['May 2026', '2026年5月'], days: 9 },
      ],
      totalDays: 20,
      window: ['Mar–May 2026', '2026年3–5月'],
      note: ['Tokyo can no longer be treated as structurally curtailment-free.',
             '东京已不能再被视为结构性无弃电区域。'],
    },

    // ---- grid (ANCHORED: study cap, deposit rule) ----
    grid: {
      studyCap: 11,
      studyCapFrom: ['1 Aug 2026', '2026年8月1日'],
      depositPct: 10,
      firstContributionPct: 50,
      contributionFrom: ['1 Apr 2026', '2026年4月1日'],
      constraint: ['Load-centre congestion, network headroom, emerging output control',
                   '负荷中心拥塞、网络裕度、新出现的出力抑制'],
    },
    interties: {
      headline: ['Tokyo interfaces and system basis', '东京联络线与系统价差'],
      note: ['Tokyo is a 50 Hz importing area; the relevant exposure is inter-area basis rather than a single binding export link.',
             '东京为50Hz受电区域；相关敞口是跨区价差，而非单一约束性外送通道。'],
    },

    saturation: {
      signal: ['Project- and queue-specific', '按项目与队列而定'],
      pipelineRatio: '~4.5×',
    },

    // ---- scorecards (SEED) ----
    // composite: w sums to 100, s is 0-100
    components: [
      { n: ['JEPX arbitrage / scarcity', 'JEPX套利/稀缺性'], w: 20, s: 68 },
      { n: ['Balancing-market outlook', '调整力市场前景'], w: 15, s: 62 },
      { n: ['Grid + import/export deliverability', '并网与充放电可交付性'], w: 20, s: 55 },
      { n: ['Capacity / LTDA optionality', '容量/长期脱碳拍卖选择权'], w: 15, s: 64 },
      { n: ['Pipeline saturation', '管线饱和度'], w: 10, s: 48 },
      { n: ['Financing / offtake bankability', '融资/购电可融资性'], w: 10, s: 60 },
      { n: ['Duration fit', '时长匹配度'], w: 5, s: 62 },
      { n: ['Curtailment / congestion value', '弃电/拥塞价值'], w: 5, s: 38 },
    ],
    // connection risk: w sums to 100, s is 0-3, HIGHER IS WORSE
    connFactors: [
      { n: ['Export connection evidence', '放电侧并网证据'], w: 15, s: 1 },
      { n: ['Import / charging evidence', '充电侧接入证据'], w: 15, s: 2 },
      { n: ['Study maturity', '接续检讨成熟度'], w: 15, s: 1 },
      { n: ['Network works capex certainty', '电网工程造价确定性'], w: 10, s: 2 },
      { n: ['Schedule / queue', '进度/队列'], w: 10, s: 1 },
      { n: ['Curtailment / non-firm exposure', '弃电/非固定容量敞口'], w: 10, s: 1 },
      { n: ['Telemetry / market qualification', '遥测/市场准入资格'], w: 8, s: 1 },
      { n: ['Land / permitting', '土地/许可'], w: 7, s: 2 },
      { n: ['Deposit / funding readiness', '保证金/资金准备'], w: 5, s: 2 },
      { n: ['Evidence governance', '证据治理'], w: 5, s: 1 },
    ],
    // duration-need index: w sums to 100, s is 0-3, higher = longer duration needed
    durFactors: [
      { n: ['High-price event duration', '高价事件时长'], w: 12, s: 2 },
      { n: ['Low-price charging-window duration', '低价充电窗口时长'], w: 12, s: 1 },
      { n: ['Net-load ramp duration', '净负荷爬坡时长'], w: 10, s: 2 },
      { n: ['Balancing energy requirement', '调整力电量需求'], w: 10, s: 2 },
      { n: ['Capacity expected-capacity treatment', '容量市场期待容量处理'], w: 12, s: 2 },
      { n: ['LTDA duration / eligibility', '长期脱碳拍卖时长/资格'], w: 14, s: 2 },
      { n: ['Curtailment intensity', '弃电强度'], w: 10, s: 1 },
      { n: ['Import / export constraints', '充放电约束'], w: 8, s: 2 },
      { n: ['Degradation headroom', '衰减裕度'], w: 5, s: 1 },
      { n: ['Augmentation flexibility', '增容灵活性'], w: 7, s: 2 },
    ],

    // ---- normalized economics for the global engine (SEED) ----
    econ: {
      merchGrossJPYMWYr: 11500000,
      balancingIncrementalJPYMWYr: 2400000,
      securedContractedJPYMWYr: secured('tokyo'),
      capacityAreaPriceJPYkWYr: cmPrice.tokyo,
      renewal: renewalCurve(secured('tokyo')),
    },
  },

  // =========================================================================
  kyushu: {
    id: 'jp_kyushu',
    short: ['Kyushu', '九州'],
    name: ['Japan — Kyushu Area', '日本 — 九州区域'],
    area: ['Kyushu Area', '九州区域'],
    tso: ['Kyushu Electric Power Transmission and Distribution', '九州电力输配电'],
    color: 'var(--s8)',
    thesis: ['Renewable surplus / curtailment / export constraint', '新能源过剩 / 弃电 / 外送约束'],
    thesisLong: [
      'The renewable-surplus and curtailment benchmark. Value depends on charging access during low-price windows, regional price capture and how far network reinforcement compresses the scarcity rent that curtailment creates.',
      '新能源过剩与弃电基准市场。价值取决于低价窗口的充电接入、区域价格捕获，以及电网强化在多大程度上压缩弃电所产生的稀缺租金。',
    ],
    conclusion: [
      'Curtailment creates system need, not automatic project revenue. Invest only where the site can import during low-price periods, export when value returns, and survive the downside of lower curtailment after grid reinforcement.',
      '弃电创造的是系统需求，而非项目收入。仅在场址能于低价时段充电、在价值回归时放电，并能承受电网强化后弃电减少的下行情景时方可投资。',
    ],

    jepx: {
      avgJPYkWh: 11.9, p95JPYkWh: 29.8, p05JPYkWh: 1.4,
      optimised4hSpreadJPYkWh: 10.5,
      nearZeroIntervalsPct: 14.6,
      basisToSystemJPYkWh: -1.3,
      marketSplitHoursPct: 26.8,
    },

    // ANCHORED: OCCTO verified 50 days Jan–Mar 2026
    curtailment: {
      verified: [
        { m: ['Jan 2026', '2026年1月'], days: 12 },
        { m: ['Feb 2026', '2026年2月'], days: 14 },
        { m: ['Mar 2026', '2026年3月'], days: 24 },
      ],
      totalDays: 50,
      window: ['Jan–Mar 2026', '2026年1–3月'],
      note: ['Chronic solar surplus; the deepest low-price charging windows in the set.',
             '长期光伏过剩；样本中最深的低价充电窗口。'],
    },

    grid: {
      studyCap: 8,
      studyCapFrom: ['1 Aug 2026', '2026年8月1日'],
      depositPct: null,
      firstContributionPct: 50,
      contributionFrom: ['2026', '2026年'],
      constraint: ['Solar surplus, local congestion, Kanmon export headroom',
                   '光伏过剩、局部拥塞、关门联络线外送裕度'],
    },
    interties: {
      headline: ['Kanmon interface to western Honshu', '关门联络线（至本州西部）'],
      transferTripFrom: ['1 Apr 2026', '2026年4月1日'],
      note: ['The expanded transfer-trip system in operation from 1 Apr 2026 raises renewable export over Kanmon and is expected to reduce curtailment — which is a downside for a merchant battery, not an upside.',
             '自2026年4月1日投运的扩容转移跳闸系统提升了关门断面的新能源外送能力并有望减少弃电 — 对市场化储能而言这是下行因素而非利好。'],
    },

    saturation: {
      signal: ['Project- and queue-specific', '按项目与队列而定'],
      pipelineRatio: '~6.2×',
    },

    components: [
      { n: ['JEPX arbitrage / solar-surplus charging', 'JEPX套利/光伏过剩充电'], w: 20, s: 74 },
      { n: ['Curtailment + congestion value', '弃电与拥塞价值'], w: 15, s: 66 },
      { n: ['Grid + import/export deliverability', '并网与充放电可交付性'], w: 20, s: 50 },
      { n: ['Balancing-market outlook', '调整力市场前景'], w: 10, s: 55 },
      { n: ['Capacity / LTDA optionality', '容量/长期脱碳拍卖选择权'], w: 15, s: 64 },
      { n: ['Pipeline saturation', '管线饱和度'], w: 10, s: 40 },
      { n: ['Financing / offtake bankability', '融资/购电可融资性'], w: 5, s: 56 },
      { n: ['Duration fit', '时长匹配度'], w: 5, s: 68 },
    ],
    connFactors: [
      { n: ['Export connection evidence', '放电侧并网证据'], w: 15, s: 2 },
      { n: ['Import / charging evidence', '充电侧接入证据'], w: 15, s: 2 },
      { n: ['Study maturity', '接续检讨成熟度'], w: 15, s: 1 },
      { n: ['Network works capex certainty', '电网工程造价确定性'], w: 10, s: 2 },
      { n: ['Schedule / queue', '进度/队列'], w: 10, s: 2 },
      { n: ['Curtailment / non-firm exposure', '弃电/非固定容量敞口'], w: 10, s: 2 },
      { n: ['Telemetry / market qualification', '遥测/市场准入资格'], w: 8, s: 1 },
      { n: ['Land / permitting', '土地/许可'], w: 7, s: 1 },
      { n: ['Deposit / funding readiness', '保证金/资金准备'], w: 5, s: 2 },
      { n: ['Evidence governance', '证据治理'], w: 5, s: 1 },
    ],
    durFactors: [
      { n: ['High-price event duration', '高价事件时长'], w: 12, s: 2 },
      { n: ['Low-price charging-window duration', '低价充电窗口时长'], w: 12, s: 3 },
      { n: ['Net-load ramp duration', '净负荷爬坡时长'], w: 10, s: 3 },
      { n: ['Balancing energy requirement', '调整力电量需求'], w: 10, s: 2 },
      { n: ['Capacity expected-capacity treatment', '容量市场期待容量处理'], w: 12, s: 2 },
      { n: ['LTDA duration / eligibility', '长期脱碳拍卖时长/资格'], w: 14, s: 2 },
      { n: ['Curtailment intensity', '弃电强度'], w: 10, s: 3 },
      { n: ['Import / export constraints', '充放电约束'], w: 8, s: 2 },
      { n: ['Degradation headroom', '衰减裕度'], w: 5, s: 1 },
      { n: ['Augmentation flexibility', '增容灵活性'], w: 7, s: 2 },
    ],

    econ: {
      merchGrossJPYMWYr: 13400000,
      balancingIncrementalJPYMWYr: 2000000,
      securedContractedJPYMWYr: secured('kyushu'),
      capacityAreaPriceJPYkWYr: cmPrice.kyushu,
      renewal: renewalCurve(secured('kyushu')),
    },
  },

  // =========================================================================
  hokkaido: {
    id: 'jp_hokkaido',
    short: ['Hokkaido', '北海道'],
    name: ['Japan — Hokkaido Area', '日本 — 北海道区域'],
    area: ['Hokkaido Area', '北海道区域'],
    tso: ['Hokkaido Electric Power Network', '北海道电力网络'],
    color: 'var(--s4)',
    thesis: ['Renewable export / weak grid / interconnector constraint', '新能源外送 / 弱网 / 跨区互联约束'],
    thesisLong: [
      'The renewable-export and interconnector-constrained benchmark. A small local demand pool, Hokkaido Area Price separation, limited Hokkaido–Honshu transfer, charging-side network headroom, and the fastest balancing-market saturation in the set.',
      '新能源外送与跨区互联受限的基准市场。本地需求池小、北海道区域电价分离、北海道—本州输电能力有限、充电侧网络裕度不足，且调整力市场饱和速度为样本之最。',
    ],
    conclusion: [
      'Do not equate high renewable potential with high battery returns. Hokkaido projects must prove both charging access and export value, and the model must stress interconnector expansion plus rapid balancing-market saturation.',
      '不可将高新能源潜力等同于高储能回报。北海道项目须同时证明充电接入与外送价值，模型亦须对跨区互联扩容及调整力市场快速饱和进行压力测试。',
    ],

    jepx: {
      avgJPYkWh: 12.6, p95JPYkWh: 30.4, p05JPYkWh: 2.2,
      optimised4hSpreadJPYkWh: 9.5,
      nearZeroIntervalsPct: 9.8,
      basisToSystemJPYkWh: -0.7,
      marketSplitHoursPct: 31.5,
    },

    // ANCHORED: OCCTO verified 36 days Mar–May 2026
    curtailment: {
      verified: [
        { m: ['Mar 2026', '2026年3月'], days: 7 },
        { m: ['Apr 2026', '2026年4月'], days: 11 },
        { m: ['May 2026', '2026年5月'], days: 18 },
      ],
      totalDays: 36,
      window: ['Mar–May 2026', '2026年3–5月'],
      note: ['Rising month on month through spring, driven by wind and solar against a small local load.',
             '春季逐月上升，源于风光出力与本地小负荷之间的失配。'],
    },

    // ANCHORED: 5-study cap, 27 charging-control systems
    grid: {
      studyCap: 5,
      studyCapFrom: ['1 Aug 2026', '2026年8月1日'],
      depositPct: null,
      firstContributionPct: null,
      contributionFrom: ['Verify current HEPCO terms', '须核验北海道电力网络现行条款'],
      chargingControlSystems: 27,
      chargingControlAsOf: ['10 Apr 2026', '2026年4月10日'],
      constraint: ['Renewable export, charging-side forward-flow headroom, Hokkaido–Honshu transfer, local congestion',
                   '新能源外送、充电侧正向潮流裕度、北海道—本州输电能力、局部拥塞'],
    },
    // ANCHORED: 0.9 GW → 1.2 GW by FY2027-end
    interties: {
      headline: ['Hokkaido–Honshu interconnection', '北海道—本州联络线'],
      currentMW: 900,
      plannedMW: 1200,
      plannedBy: ['End FY2027', '2027财年末'],
      note: ['A larger Sea-of-Japan route remains a forward reinforcement theme and must be treated as a scenario, not as current capacity.',
             '更大规模的日本海通道仍属远期强化议题，只能作为情景处理，不得计入当前容量。'],
    },

    // ANCHORED: >0.2 GW balancing registration FY2026; ~2 GW connection applications
    saturation: {
      balancingRegisteredGW: 0.2,
      balancingRegisteredBasis: ['Expected FY2026', '预计FY2026'],
      connectionApplicationsGW: 2.0,
      signal: ['>0.2 GW balancing registration expected FY2026; ~2 GW connection-contract applications',
               '预计FY2026调整力注册容量超0.2GW；并网合同申请约2GW'],
      pipelineRatio: '~18×',
      note: ['Track separately from operating capacity. This is the clearest cannibalisation signal in the Japan set.',
             '须与在运容量分开跟踪。这是日本样本中最明确的收益蚕食信号。'],
    },

    components: [
      { n: ['Grid + import/export deliverability', '并网与充放电可交付性'], w: 20, s: 40 },
      { n: ['JEPX arbitrage / regional basis', 'JEPX套利/区域价差'], w: 15, s: 66 },
      { n: ['Balancing-market outlook / saturation', '调整力市场前景/饱和'], w: 15, s: 38 },
      { n: ['Curtailment + renewable-integration value', '弃电与新能源消纳价值'], w: 15, s: 62 },
      { n: ['Interconnector / export evolution', '跨区互联/外送演进'], w: 10, s: 42 },
      { n: ['Capacity / LTDA optionality', '容量/长期脱碳拍卖选择权'], w: 10, s: 62 },
      { n: ['Pipeline saturation', '管线饱和度'], w: 10, s: 28 },
      { n: ['Financing / offtake bankability', '融资/购电可融资性'], w: 5, s: 48 },
    ],
    connFactors: [
      { n: ['Export connection evidence', '放电侧并网证据'], w: 15, s: 2 },
      { n: ['Import / charging evidence', '充电侧接入证据'], w: 15, s: 3 },
      { n: ['Study maturity', '接续检讨成熟度'], w: 15, s: 2 },
      { n: ['Network works capex certainty', '电网工程造价确定性'], w: 10, s: 2 },
      { n: ['Schedule / queue', '进度/队列'], w: 10, s: 3 },
      { n: ['Curtailment / non-firm exposure', '弃电/非固定容量敞口'], w: 10, s: 2 },
      { n: ['Telemetry / market qualification', '遥测/市场准入资格'], w: 8, s: 1 },
      { n: ['Land / permitting', '土地/许可'], w: 7, s: 1 },
      { n: ['Deposit / funding readiness', '保证金/资金准备'], w: 5, s: 2 },
      { n: ['Evidence governance', '证据治理'], w: 5, s: 2 },
    ],
    durFactors: [
      { n: ['High-price event duration', '高价事件时长'], w: 12, s: 2 },
      { n: ['Low-price charging-window duration', '低价充电窗口时长'], w: 12, s: 3 },
      { n: ['Net-load ramp duration', '净负荷爬坡时长'], w: 10, s: 3 },
      { n: ['Balancing energy requirement', '调整力电量需求'], w: 10, s: 2 },
      { n: ['Capacity expected-capacity treatment', '容量市场期待容量处理'], w: 12, s: 2 },
      { n: ['LTDA duration / eligibility', '长期脱碳拍卖时长/资格'], w: 14, s: 2 },
      { n: ['Curtailment intensity', '弃电强度'], w: 10, s: 3 },
      { n: ['Import / export constraints', '充放电约束'], w: 8, s: 3 },
      { n: ['Degradation headroom', '衰减裕度'], w: 5, s: 1 },
      { n: ['Augmentation flexibility', '增容灵活性'], w: 7, s: 2 },
    ],

    econ: {
      merchGrossJPYMWYr: 12100000,
      balancingIncrementalJPYMWYr: 1500000,
      securedContractedJPYMWYr: secured('hokkaido'),
      capacityAreaPriceJPYkWYr: cmPrice.hokkaido,
      renewal: renewalCurve(secured('hokkaido')),
    },
  },
};

export const REGION_IDS = ['tokyo', 'kyushu', 'hokkaido'];

/** Shared risk bands. Identical in all three regions so comparison means something. */
export const CONN_BANDS = [
  { lo: 0,  hi: 24,  c: 'good',     n: ['Connection-investable', '可投资并网状态'],
    d: ['Import and export evidence complete; proceed on normal terms.', '充放电证据完整；可按常规条款推进。'] },
  { lo: 25, hi: 44,  c: 'warn',     n: ['Conditional — CPs & holdbacks', '有条件 — 需先决条件与保留款'],
    d: ['Investable against conditions precedent and price holdbacks.', '须以先决条件与价格保留款为前提方可投资。'] },
  { lo: 45, hi: 64,  c: 'serious',  n: ['Material risk — re-price / defer', '重大风险 — 重定价或延后'],
    d: ['Connection outcome could move MW, cost or COD materially.', '并网结果可能显著改变MW、造价或投运时点。'] },
  { lo: 65, hi: 100, c: 'critical', n: ['Not investment-ready', '不具备投资条件'],
    d: ['Do not release consideration.', '不应支付对价。'] },
];

export const DUR_BANDS = [
  { lo: 0,  hi: 39,  c: 'info',     n: ['Short duration adequate', '短时长即可'],
    d: ['2h configurations capture most of the available value.', '2小时配置即可捕获大部分可得价值。'] },
  { lo: 40, hi: 59,  c: 'good',     n: ['4h is the reference', '4小时为参考配置'],
    d: ['Matches the reference archetype used across this platform.', '与本平台通用参考原型一致。'] },
  { lo: 60, hi: 79,  c: 'warn',     n: ['Longer duration favoured', '倾向更长时长'],
    d: ['6h+ may earn its capital if the charging window supports it.', '若充电窗口支持，6小时以上可能收回其资本投入。'] },
  { lo: 80, hi: 100, c: 'serious',  n: ['Long duration required', '需长时储能'],
    d: ['Each incremental MWh still needs identifiable repeatable value.', '每增量MWh仍须具备可识别、可重复的价值。'] },
];

export default JP_REGIONS;
