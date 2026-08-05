/* ---------------------------------------------------------------------------
   Japan — dataset assembled for the shared block engine.

   National facts come from national.js, regional facts from regions.js. This
   file only assembles them into the shape the engine expects, and adds the
   pipeline register, the lab defaults and the export rows.

   Late-bound region: the engine's scorecard, augmentation and export blocks
   address `M.components` / `M.connFactors` / `M.durFactors` by name. Those are
   getters onto whichever region is currently in view, so the engine-owned blocks
   keep working without knowing Japan has three lenses. Region-explicit blocks
   address a region directly by path, e.g. 'regions.kyushu.connFactors'.
   --------------------------------------------------------------------------- */
import { JP_NATIONAL } from './national.js';
import {
  JP_REGIONS, REGION_IDS, JP_REFERENCE, JP_COMMON_COST,
  JP_EXPECTED_CAPACITY_FACTOR, CONN_BANDS, DUR_BANDS,
} from './regions.js';
import { SRC } from './sources.js';
import { metricValues } from '../../governance/metrics.js';

/* Updated by dashboard.js before each render. In compare mode the engine-owned
   default namespace resolves to Tokyo; every comparison block addresses regions
   explicitly, so the default is only a fallback for exports. */
const JP_SYSTEM_EVOLUTION = {
  years: [2025, 2030, 2034],
  vintage: 'OCCTO Aggregation of Electricity Supply Plans FY2025',
  regions: {
    tokyo: {
      peakDemandGW: metricValues('jp-tokyo-peak-demand'),
      supplyCapacityGW: metricValues('jp-tokyo-supply-capacity'),
    },
    kyushu: {
      peakDemandGW: metricValues('jp-kyushu-peak-demand'),
      supplyCapacityGW: metricValues('jp-kyushu-supply-capacity'),
    },
    hokkaido: {
      peakDemandGW: metricValues('jp-hokkaido-winter-peak-demand'),
      supplyCapacityGW: metricValues('jp-hokkaido-winter-supply-capacity'),
    },
  },
};

export const activeRegion = { id: 'tokyo' };
const R = () => JP_REGIONS[activeRegion.id] || JP_REGIONS.tokyo;

const O = {
  cmDeliveryYear: JP_NATIONAL.capacity2029.deliveryYear,
  cmTokyoJPYkW: 15111,
  cmKyushuJPYkW: 15112,
  cmHokkaidoJPYkW: 14972,
  cmTokyoKW: 52376601,
  cmKyushuKW: 18363521,
  cmHokkaidoKW: 5461594,
  studyCapTokyo: 11,
  studyCapKyushu: 8,
  studyCapHokkaido: 5,
  curtailTokyoDays: 20,
  curtailKyushuDays: 50,
  curtailHokkaidoDays: 36,
  hokkaidoHonshuNowMW: 900,
  hokkaidoHonshuPlanMW: 1200,
  hokkaidoBalancingGW: 0.2,
  hokkaidoQueueGW: 2.0,
  hepcoChargeCtrlSystems: 27,
  expectedCapacityFactor: JP_EXPECTED_CAPACITY_FACTOR,
};

/* Pipeline register — ONE registry with a region column.

   Deliberately thin. The methodology admits MW/MWh and a stage only where a
   cited public source supports them; several named Japanese projects are public
   but their capacity or stage is not disclosed precisely enough to fit the
   common taxonomy, so they appear in `namedPipeline` without invented figures
   rather than being padded into the chart. For Hokkaido the honest pipeline
   measure today is the queue signal (~2 GW of connection-contract applications),
   not a project list. */
const PROJECTS = [
  { n: 'Tsumagoi BESS', region: 'tokyo', owner: 'Gunma', mw: 2, h: 4.65, cod: 2025, st: 'operating' },
  { n: 'Naganohara BESS', region: 'tokyo', owner: 'Gunma / Eku Energy', mw: 30, h: 4, cod: 2028, st: 'applied' },
];

const NAMED_PIPELINE = [
  { n: 'Hirohara BESS', region: 'kyushu', sponsor: 'Eku Energy', src: 'ekuHirohara' },
  { n: 'Kami-Tonno BESS', region: 'kyushu', sponsor: 'Eku Energy', src: 'ekuKamiTonno' },
  { n: 'Chikuzen-machi BESS', region: 'kyushu', sponsor: 'ITOCHU / Mitsubishi Estate / Tokyo Century', src: 'itochuChikuzen' },
  { n: 'TEPCO HD × TODA alliance', region: 'tokyo', sponsor: 'TEPCO Holdings / TODA', src: null },
];

export const M = {
  asOf: '2026-08-04',
  dataDate: 'JEPX TTM Jul 2026 / CM delivery year 2029',
  modelVersion: 'jp-seed-1.0-three-region-capacity-renewal',

  title: ['Japan BESS Investment Dashboard', '日本储能投资看板'],
  sub: ['One national market architecture, three regional investment lenses: Tokyo, Kyushu and Hokkaido.',
        '同一全国市场架构，三个区域投资视角：东京、九州与北海道。'],
  nextMilestone: ['Next milestone: implement the final Round 3 LTDA duration-credit and sourcing-cap rules in project bids and delivery planning',
                  '下一里程碑：在项目投标与交付规划中落实LTDA第三轮最终时长信用及采购来源上限规则'],
  footerNote: ['Capacity Market, curtailment, connection-study caps and interconnector figures are verified against the cited official sources; all economics are illustrative seed pending the ETL listed in Data & Methodology.',
               '容量市场、弃电、并网检讨上限及联络线数据均已对照所引官方来源核验；所有经济性数值均为示例种子，待“数据与方法”页所列ETL完成后替换。'],
  seedWarn: ['Structural content is source-anchored. Every economic value — capex, merchant margin, incremental balancing value, expected-capacity factor and the auction-renewal curve — is an illustrative seed and must be replaced by the ETL in Data & Methodology before any investment use.',
             '结构性内容已锚定来源。所有经济性数值 — 造价、市场化收益、调整力增量价值、期待容量系数及拍卖续约曲线 — 均为示例种子，任何投资用途前须以“数据与方法”页所列ETL替换。'],

  official: O,
  national: JP_NATIONAL,
  regions: JP_REGIONS,
  regionIds: REGION_IDS,
  reference: JP_REFERENCE,
  cost: JP_COMMON_COST,
  namedPipeline: NAMED_PIPELINE,

  /* ---- named transmission, from the OCCTO wide-area master plan and its
     grid-development planning process ---------------------------------------
     National rather than regional on purpose: every one of these is an
     interconnector between two of the nine areas, so a Tokyo, Kyushu or
     Hokkaido battery is affected by whichever intertie its area sits behind.
     The register is deliberately short — OCCTO's master plan is a long-term
     scenario document, and only a handful of reinforcements have reached a
     planning process with a published in-service target. `cls` matches
     `planClasses`. */
  reinforcements: [
    { n: ['Hokkaido–Honshu interconnection uprate', '北海道—本州联络设备扩容'], operator: 'HEPCO Network / TEPCO Power Grid',
      region: ['Hokkaido ↔ Tohoku', '北海道 ↔ 东北'], areas: ['hokkaido'],
      cls: 'approved', scope: ['Existing intertie from 0.9 GW to 1.2 GW; the constraint behind Hokkaido curtailment and charging control', '既有联络线由0.9GW扩容至1.2GW；北海道弃电与充电控制背后的约束'],
      year: 2027, status: ['Approved; delivery by end of FY2027', '已批准；2027财年末前交付'], c: 'warn' },
    { n: ['Tokyo–Chubu frequency converter expansion', '东京—中部间连系设备（FC）扩容'], operator: 'TEPCO Power Grid / Chubu Electric Power Grid',
      region: ['Tokyo ↔ Chubu', '东京 ↔ 中部'], areas: ['tokyo'],
      cls: 'approved', scope: ['Frequency-conversion capacity from 2.1 GW to 3.0 GW, the only path between the 50 Hz and 60 Hz halves of the country', '变频容量由2.1GW提升至3.0GW，是全国50赫兹与60赫兹两半之间的唯一通道'],
      year: 2027, status: ['Approved plan; completion targeted end of FY2027', '规划已批准；目标2027财年末完工'], c: 'warn' },
    { n: ['Hokkaido–Honshu HVDC, Japan Sea route', '北海道—本州高压直流（日本海路线）'], operator: 'To be appointed by OCCTO tender',
      region: ['Hokkaido ↔ Honshu', '北海道 ↔ 本州'], areas: ['hokkaido'],
      cls: 'process', scope: ['A new ~2 GW subsea HVDC link, separate from and far larger than the uprate above', '全新约2GW海底高压直流线路，与上述扩容工程相互独立且规模远大于后者'],
      year: 2030, status: ['Operator selection was targeted for March 2026; completion indicated for the early 2030s', '业主选定原定于2026年3月；完工时点指示为2030年代前期'], c: 'critical' },
    { n: ['Kanmon (Chugoku–Kyushu) interconnection reinforcement', '关门（中国—九州）联络线增强'], operator: 'To be appointed by OCCTO tender',
      region: ['Chugoku ↔ Kyushu', '中国 ↔ 九州'], areas: ['kyushu'],
      cls: 'process', scope: ['About 1 GW of additional capacity, taking the intertie to roughly 3.0–3.5 GW; this is the constraint Kyushu curtailment sits behind', '新增约1GW容量，使联络线达到约3.0–3.5GW；这正是九州弃电所对应的约束'],
      year: 2038, status: ['In the planning process; operation planned for end of FY2038, with an acceleration target of FY2036', '处于计划制定流程；计划2038财年末投运，加速目标为2036财年'], c: 'critical' },
    { n: ['OCCTO wide-area master plan', 'OCCTO广域连系系统总体规划'], operator: 'OCCTO',
      region: ['Japan', '日本全国'], areas: ['tokyo', 'kyushu', 'hokkaido'],
      cls: 'masterplan', scope: ['The long-term scenario framework the reinforcements above are drawn from, covering the nine areas to the 2040s', '上述增容工程所源自的长期情景框架，覆盖九个区域并展望至2040年代'],
      year: 2040, status: ['A scenario document — reinforcements only acquire dates once they enter a planning process', '属情景文件 — 增容工程仅在进入计划制定流程后才获得日期'], c: 'serious' },
  ],

  /* Japan's status vocabulary. The gap between `masterplan` and `process` is
     the one that matters: appearing in the master plan gives a reinforcement no
     date at all, and the two projects that would most change Kyushu and
     Hokkaido economics are still on the far side of it. */
  planClasses: [
    { id: 'approved',   n: ['Approved, dated', '已批准且有日期'], c: 'warn',
      d: ['A grid-development plan is approved and a delivery year is published. The strongest class Japan offers on an intertie.', '电网整备计划已获批准并公布交付年份。这是日本在联络线方面提供的最强类别。'] },
    { id: 'process',    n: ['In planning process', '计划制定流程中'], c: 'critical',
      d: ['Inside OCCTO\'s formal planning process with an indicated target, but the delivery entity or the works are not yet fixed. Targets at this stage have moved by years.', '已进入OCCTO正式计划制定流程并有指示性目标，但交付主体或工程范围尚未确定。该阶段的目标曾发生数年变动。'] },
    { id: 'masterplan', n: ['Master plan only', '仅列入总体规划'], c: 'serious',
      d: ['Identified in the long-term wide-area scenario. No delivery entity, no works, no date — it is a statement of where capacity would be worth building, not when.', '仅在长期广域情景中被识别。无交付主体、无工程范围、无日期 — 它说明容量在何处值得建设，而非何时建成。'] },
  ],

  // ---- engine-owned default namespace, bound to the region in view ----
  get components(){ return R().components; },
  get connFactors(){ return R().connFactors; },
  get durFactors(){ return R().durFactors; },
  connBands: CONN_BANDS,
  durBands: DUR_BANDS,

  // ---- shared physical / market curves (national formula, area application) ----
  deratingCurve: { 1: 0.30, 2: 0.50, 4: 0.70, 6: 0.85, 8: 0.95 },
  durSpreadFactor: { 1: 1.25, 2: 1.15, 4: 1.00, 6: 0.85, 8: 0.72 },
  durConfigs: [1, 2, 4, 6, 8],      // durations swept by the Investment Lab
  usableFraction: 0.95,
  futureCapFactor: 0.75,
  durationPath: {
    years: ['2027', '2028', '2029', '2030', '2031'],
    hours: [4, 4, 4, 4.5, 4.5],
  },
  systemEvolution: JP_SYSTEM_EVOLUTION,
  forecastGovernance: {
    confidenceScore: 8,
    confidenceBand: ['High', '高'],
    confidenceBasis: [
      'Strong official FY2025–2034 planning, price, capacity and regional-grid evidence; no complete public BESS queue.',
      'FY2025–2034官方规划、价格、容量与区域电网证据较强；但不存在完整公开的储能队列。',
    ],
    queueCoverage: [
      'Official awards and TSO disclosures are subsets, not a complete application/connection funnel.',
      '官方中标与输电运营商披露仅为子集，并非完整申请/并网管线。',
    ],
    invalidation: [
      'Regional price capture, balancing qualification, connection delivery or saturation moves outside the approved scenario.',
      '区域价格捕获、调整力准入、并网交付或饱和度超出已批准情景。',
    ],
  },

  // ---- pipeline ----
  stages: [
    { id: 'operating',    n: ['Operating', '在运'], p: 100 },
    { id: 'uc',           n: ['Under construction + financial close', '在建且已融资交割'], p: 90 },
    { id: 'contracted',   n: ['Contracted / LTDA awarded', '已签约/长期脱碳拍卖中标'], p: 75 },
    { id: 'gridcontract', n: ['Grid contract executed', '并网合同已签'], p: 65 },
    { id: 'study',        n: ['Connection study complete', '接续检讨完成'], p: 50 },
    { id: 'applied',      n: ['Land + application submitted', '土地落实且已申请'], p: 30 },
    { id: 'announced',    n: ['Announced only', '仅公告'], p: 10 },
  ],
  projects: PROJECTS,

  // ---- augmentation readiness ----
  augItems: [
    ['Spare pad / civil footprint reserved', '预留场地与土建空间'],
    ['Transformer and PCS headroom for added MWh', '变压器与PCS具备增容裕度'],
    ['Grid contract permits energy increase without re-study', '并网合同允许增容而无需重新检讨'],
    ['Permit allows added cells / enclosures', '许可允许增加电芯与舱体'],
    ['Cell supply agreement covers augmentation vintages', '电芯供货协议覆盖增容批次'],
    ['O&M contract prices augmentation works', '运维合同已就增容工程定价'],
  ],
  augDefaults: [1, 1, 1, 1, 0, 1],

  // ---- Investment Lab defaults (JPY) ----
  lab: {
    /* ---- capital structure. Seeded neutral: nothing here moves a published
       return until it is set. VAT is recoverable, so it costs only timing, and
       the Lab leaves the refund lag to the engine. */
    vatPct: 10, vatRecoverable: 1,
    devCostPct: 0, rtbPremiumPct: 0, constructionMonths: 12,
    mw: 50, hours: 4,
    capexKWh: JP_COMMON_COST.capexPerKWh, capexKW: 0,
    opexKW: 1800,
    rte: JP_REFERENCE.rtePct, avail: JP_REFERENCE.availPct,
    degr: JP_REFERENCE.degrPct, cycles: JP_REFERENCE.cyclesPerDay,
    spread: 9000,                      // ¥/MWh executable, Tokyo reference
    optFee: JP_COMMON_COST.optimiserFeePct,
    capPrice: Math.round(O.cmTokyoJPYkW * JP_EXPECTED_CAPACITY_FACTOR),
    capYrs: 1,                         // main auction secures one delivery year
    servicesKW: 2400,
    grantPct: 0,
    life: JP_REFERENCE.lifeYears, disc: 6,
    debtPct: 60, rate: 2.0, tenor: 12,
  },

  // ---- exports ----
  kpiExport: [
    ['cm_area_price_tokyo_2029', O.cmTokyoJPYkW, 'JPY/kW/yr', 'official', 'FINAL', 'OCCTO 2029 main auction'],
    ['cm_area_price_kyushu_2029', O.cmKyushuJPYkW, 'JPY/kW/yr', 'official', 'FINAL', 'OCCTO 2029 main auction'],
    ['cm_area_price_hokkaido_2029', O.cmHokkaidoJPYkW, 'JPY/kW/yr', 'official', 'FINAL', 'OCCTO 2029 main auction'],
    ['cm_contracted_tokyo_2029', O.cmTokyoKW, 'kW', 'official', 'FINAL', 'OCCTO 2029 main auction'],
    ['cm_contracted_kyushu_2029', O.cmKyushuKW, 'kW', 'official', 'FINAL', 'OCCTO 2029 main auction'],
    ['cm_contracted_hokkaido_2029', O.cmHokkaidoKW, 'kW', 'official', 'FINAL', 'OCCTO 2029 main auction'],
    ['study_cap_tokyo', O.studyCapTokyo, 'concurrent studies', 'official', 'FINAL', 'TEPCO PG 24 Jul 2026'],
    ['study_cap_kyushu', O.studyCapKyushu, 'concurrent studies', 'official', 'FINAL', 'Kyushu T&D'],
    ['study_cap_hokkaido', O.studyCapHokkaido, 'concurrent studies', 'official', 'FINAL', 'HEPCO Network 24 Jul 2026'],
    ['curtail_days_tokyo_mar_may_2026', O.curtailTokyoDays, 'days', 'official', 'FINAL', 'OCCTO verified'],
    ['curtail_days_kyushu_jan_mar_2026', O.curtailKyushuDays, 'days', 'official', 'FINAL', 'OCCTO verified'],
    ['curtail_days_hokkaido_mar_may_2026', O.curtailHokkaidoDays, 'days', 'official', 'FINAL', 'OCCTO verified'],
    ['hokkaido_honshu_now_mw', O.hokkaidoHonshuNowMW, 'MW', 'official', 'FINAL', 'OCCTO wide-area plan'],
    ['hokkaido_honshu_plan_mw', O.hokkaidoHonshuPlanMW, 'MW', 'official', 'FINAL', 'approved to FY2027-end'],
    ['hokkaido_balancing_registered_gw', O.hokkaidoBalancingGW, 'GW', 'official', 'FINAL', 'HEPCO Network 30 Mar 2026'],
    ['hokkaido_connection_applications_gw', O.hokkaidoQueueGW, 'GW', 'official', 'FINAL', 'HEPCO Network 30 Mar 2026'],
    ['expected_capacity_factor_4h', O.expectedCapacityFactor, 'fraction', 'illus', 'SEED', 'illustrative — ETL gate'],
    ['capex_per_kwh', JP_COMMON_COST.capexPerKWh, 'JPY/kWh', 'illus', 'SEED', 'illustrative — ETL gate'],
  ],

  glossary: [
    ['Area Price / エリアプライス', '区域价格'],
    ['System Price / システムプライス', '系统价格'],
    ['Market splitting / 市場分断', '市场分割'],
    ['Output control / 出力制御', '出力抑制（弃电）'],
    ['Expected Capacity / 期待容量', '期待容量'],
    ['Capacity Securing Contract / 容量確保契約', '容量确保合同'],
    ['Capacity Market Main Auction / メインオークション', '容量市场主拍卖'],
    ['Long-Term Decarbonization Power Source Auction / 長期脱炭素電源オークション', '长期脱碳电源拍卖'],
    ['Other-market revenue / 他市場収益', '其他市场收入'],
    ['Utility-scale BESS / 系統用蓄電池', '电网侧大型储能'],
    ['Grid connection study / 接続検討', '并网接续检讨'],
    ['Contract application / 契約申込み', '并网合同申请'],
    ['Construction-cost contribution / 工事費負担金', '电网工程费负担金'],
    ['Transfer-trip / 転送遮断', '转移跳闸'],
    ['Import capability', '充电侧接入能力'],
    ['Export capability', '放电侧接入能力'],
    ['Secured revenue', '已锁定收入'],
    ['Auction-renewal revenue', '拍卖续约收入'],
    ['Incremental balancing value', '调整力增量价值'],
  ],
};

export { SRC };
export default M;
