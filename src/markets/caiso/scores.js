/* ---------------------------------------------------------------------------
   CAISO — the connection-risk table, and the index derived from it.

   Computed once here and imported by both the comparison interface and the
   dashboard, so the index cannot disagree with the lines it summarises, and
   rounded exactly as src/markets/_shared/compute.js rounds it.

     connectionRisk   Σ(w · s) / 3,   with s on 0-3   and Σw = 100

   The weighted component table and the composite that sat beside it were
   retired on 2026-10-12; the table is kept in docs/grading/seed-tables.md.
   --------------------------------------------------------------------------- */

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

/** Σ(w · s) / 3, rounded as the dashboard rounds it. Higher is worse. */
export const CONNECTION_RISK = Math.round(weighted(CONN_FACTORS) / 3);
