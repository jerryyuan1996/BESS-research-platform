/* ---------------------------------------------------------------------------
   CAISO — the two weighted score tables, and the scores derived from them.

   Same arrangement as PJM and ERCOT: computed once here and imported by both the
   comparison interface and the dashboard, and rounded exactly as
   src/markets/_shared/compute.js rounds them.

     composite        Σ(w · s) / 100, with s on 0-100 and Σw = 100
     connectionRisk   Σ(w · s) / 3,   with s on 0-3   and Σw = 100
   --------------------------------------------------------------------------- */

/* Contracted revenue carries the most weight and the highest score on any US
   market here, because in CAISO it is genuinely the majority of a battery's
   income rather than a supplement to it — bilateral Resource Adequacy contracts
   averaged $8.77/kW-month in H1 2025 against merchant earnings nearer
   $2.5-3/kW-month. That is the opposite balance to ERCOT, where there is no
   capacity payment at all, and to PJM, where the auction pays well but for one
   delivery year.

   Duration scores only 48 despite a fleet that is overwhelmingly four-hour, and
   the reason is specific: the CPUC tests net qualifying capacity on four-hour
   sustained output and gives NO additional RA credit beyond it. Four hours is
   not a floor a longer asset improves on — it is a ceiling. */
export const COMPONENTS = [
  { n: ['Contracted revenue availability (bilateral RA)', '合同化收入可得性（双边容量充裕度合约）'], w: 22, s: 78 },
  { n: ['Merchant arbitrage depth and spread trajectory', '市场化套利深度与价差走势'], w: 14, s: 52 },
  { n: ['RA price durability and re-contracting risk', '容量充裕度价格持续性与再签约风险'], w: 14, s: 45 },
  { n: ['Interconnection queue and delivery timetable', '并网排队与交付时间表'], w: 14, s: 25 },
  { n: ['Storage-duration fit and capex trajectory', '储能时长匹配度与造价轨迹'], w: 10, s: 48 },
  { n: ['Financing and delivery execution', '融资与交付执行'], w: 10, s: 80 },
  { n: ['Congestion and locational price signal', '拥塞与区位价格信号'], w: 8, s: 55 },
  { n: ['Ancillary services headroom', '辅助服务市场空间'], w: 8, s: 22 },
];

/* Higher score = higher risk. The queue is the heaviest line and the worst on
   the platform after PJM's: roughly 500 GW of generation and storage sits in the
   CAISO queue, with batteries about 46% of it, and interconnection has overtaken
   technology cost as the binding constraint on deployment. Land and permitting
   score 2 rather than 1 because CEQA review is a real and contestable step that
   Texas has no equivalent of. */
export const CONN_FACTORS = [
  { n: ['Interconnection queue position and study timeline', '并网排队位置与研究周期'], w: 20, s: 3 },
  { n: ['Deliverability status — full capacity versus energy-only', '可交付性状态 — 全容量与仅电能量'], w: 14, s: 2 },
  { n: ['FEOC material-assistance compliance for the tax credit', '税收抵免所需的FEOC实质协助合规'], w: 14, s: 2 },
  { n: ['RA counterparty credit and contract tenor', '容量充裕度合约对手信用与期限'], w: 12, s: 1 },
  { n: ['Land, permitting and CEQA review', '土地、许可与CEQA环境审查'], w: 10, s: 2 },
  { n: ['Node basis and curtailment exposure', '节点基差与限电敞口'], w: 10, s: 1 },
  { n: ['Transformer and long-lead equipment programme', '变压器与长交期设备计划'], w: 8, s: 2 },
  { n: ['Local capacity area qualification', '本地容量区资格'], w: 6, s: 1 },
  { n: ['Property tax and local fees', '财产税与地方规费'], w: 3, s: 1 },
  { n: ['Evidence and governance quality', '证据与治理质量'], w: 3, s: 1 },
];

const weighted = (rows) => rows.reduce((a, r) => a + r.w * r.s, 0);

/** Σ(w · s) / 100, rounded as the dashboard rounds it. */
export const COMPOSITE = Math.round(weighted(COMPONENTS) / 100);

/** Σ(w · s) / 3, rounded as the dashboard rounds it. Higher is worse. */
export const CONNECTION_RISK = Math.round(weighted(CONN_FACTORS) / 3);
