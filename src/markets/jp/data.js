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

/* Updated by dashboard.js before each render. In compare mode the engine-owned
   default namespace resolves to Tokyo; every comparison block addresses regions
   explicitly, so the default is only a fallback for exports. */
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
  asOf: '2026-07-28',
  dataDate: 'JEPX TTM Jul 2026 / CM delivery year 2029',
  modelVersion: 'jp-seed-1.0-three-region-capacity-renewal',

  title: ['Japan BESS Investment Dashboard', '日本储能投资看板'],
  sub: ['One national market architecture, three regional investment lenses: Tokyo, Kyushu and Hokkaido.',
        '同一全国市场架构，三个区域投资视角：东京、九州与北海道。'],
  nextMilestone: ['Next milestone: FY2026 LTDA solicitation closes consultation 3 Aug 2026',
                  '下一里程碑：FY2026长期脱碳电源拍卖募集文件征询于2026年8月3日结束'],
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
