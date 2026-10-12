/* ---------------------------------------------------------------------------
   ERCOT — the connection-risk table, and the index derived from it.

   Computed once here and imported by both the comparison interface and the
   dashboard, so the index cannot disagree with the lines it summarises, and
   rounded exactly as src/markets/_shared/compute.js rounds it.

     connectionRisk   Σ(w · s) / 3,   with s on 0-3   and Σw = 100

   The weighted component table and the composite that sat beside it were
   retired on 2026-10-12; the table is kept in docs/grading/seed-tables.md.
   --------------------------------------------------------------------------- */

/* Higher score = higher risk, and this is the lowest-risk connection table on
   the platform — which is the point of carrying ERCOT next to PJM. Network
   upgrade cost scores 0 because ERCOT socialises transmission investment rather
   than allocating it to the interconnecting generator, and land scores 0 because
   Texas has no equivalent of the county-level siting veto several PJM states
   have. FEOC is the heaviest line, and it is the one risk ERCOT shares with
   every other US market: it is federal, and failing it voids the credit. */
export const CONN_FACTORS = [
  { n: ['Interconnection study and energisation timeline', '并网研究与送电时间表'], w: 16, s: 1 },
  { n: ['FEOC material-assistance compliance for the tax credit', '税收抵免所需的FEOC实质协助合规'], w: 14, s: 2 },
  { n: ['Nodal basis and congestion revenue right position', '节点基差与拥塞收入权持仓'], w: 14, s: 1 },
  { n: ['West Texas congestion and curtailment exposure', '西德州拥塞与限电敞口'], w: 12, s: 1 },
  { n: ['Transformer and long-lead equipment programme', '变压器与长交期设备计划'], w: 10, s: 1 },
  { n: ['Large-load interconnection rule changes', '大负荷并网规则变动'], w: 10, s: 1 },
  { n: ['Network upgrade cost allocation', '电网升级成本分摊'], w: 8, s: 0 },
  { n: ['Property tax exposure after the Chapter 313 expiry', '第313章失效后的财产税敞口'], w: 6, s: 1 },
  { n: ['Land, permitting and county consent', '土地、许可与县级同意'], w: 6, s: 0 },
  { n: ['Evidence and governance quality', '证据与治理质量'], w: 4, s: 1 },
];

const weighted = (rows) => rows.reduce((a, r) => a + r.w * r.s, 0);

/** Σ(w · s) / 3, rounded as the dashboard rounds it. Higher is worse. */
export const CONNECTION_RISK = Math.round(weighted(CONN_FACTORS) / 3);
