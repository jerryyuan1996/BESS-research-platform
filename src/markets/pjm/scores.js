/* ---------------------------------------------------------------------------
   PJM — the connection-risk table, and the index derived from it.

   Computed once here and imported by both the comparison interface and the
   dashboard, so the index cannot disagree with the lines it summarises, and
   rounded exactly as src/markets/_shared/compute.js rounds it.

     connectionRisk   Σ(w · s) / 3,   with s on 0-3   and Σw = 100

   The weighted component table and the composite that sat beside it were
   retired on 2026-10-12; the table is kept in docs/grading/seed-tables.md.
   --------------------------------------------------------------------------- */

/* Higher score = higher risk. The queue is the worst single line on this table
   and the worst on the platform: 67 GW of storage sits in the reopened queue
   against ~400 MW operating. FEOC scores 2 rather than 1 because failing the
   Material Assistance Cost Ratio does not reduce the tax credit, it voids it —
   a cliff, not a slope. */
export const CONN_FACTORS = [
  { n: ['Interconnection queue position and cycle status', '并网排队位置与周期状态'], w: 18, s: 3 },
  { n: ['Network upgrade cost allocation exposure', '电网升级成本分摊敞口'], w: 14, s: 2 },
  { n: ['Capacity Interconnection Rights secured for the RPM offer', '为参与RPM报价所需的容量并网权'], w: 12, s: 2 },
  { n: ['FEOC material-assistance compliance for the tax credit', '税收抵免所需的FEOC实质协助合规'], w: 12, s: 2 },
  { n: ['Deliverability within the Locational Deliverability Area', '在区位可交付区（LDA）内的可交付性'], w: 10, s: 2 },
  { n: ['Transformer and long-lead equipment programme', '变压器与长交期设备计划'], w: 8, s: 2 },
  { n: ['Site nodal basis and TB4 spread history', '场址节点基差与TB4价差历史'], w: 10, s: 1 },
  { n: ['Land, permitting and county-level siting consent', '土地、许可与县级选址同意'], w: 8, s: 1 },
  { n: ['Regulation prequalification and telemetry after the redesign', '调频市场重构后的预认证与遥测'], w: 4, s: 1 },
  { n: ['Evidence and governance quality', '证据与治理质量'], w: 4, s: 1 },
];

const weighted = (rows) => rows.reduce((a, r) => a + r.w * r.s, 0);


/** Σ(w · s) / 3 — the connection-risk index, higher being worse. */
export const CONNECTION_RISK = Math.round(weighted(CONN_FACTORS) / 3);
