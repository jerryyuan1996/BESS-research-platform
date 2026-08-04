/* ---------------------------------------------------------------------------
   ERCOT — the two weighted score tables, and the scores derived from them.

   Same arrangement as PJM: computed once here and imported by both the
   comparison interface and the dashboard, so the composite cannot disagree with
   the components it is a summary of.

     composite        Σ(w · s) / 100, with s on 0-100 and Σw = 100
     connectionRisk   Σ(w · s) / 3,   with s on 0-3   and Σw = 100

   Both are ROUNDED here, exactly as src/markets/_shared/compute.js rounds them
   when it draws the same tables. Without that the comparison interface would
   carry 32.67 while the dashboard rendered 33, and a reader comparing the two
   pages would be right to distrust both.
   --------------------------------------------------------------------------- */

/* The two extremes on this table are the ERCOT investment case in one line.

   Interconnection scores 92, the highest single component on the platform:
   ERCOT connects generation in about 4.2 years at minimal cost against PJM's
   eight-plus years and $240/kW of network upgrades. Ancillary services score 12,
   the lowest: AS revenue has fallen about 90% since 2023 and its share of
   battery income went from 84% to 48% over the same period, and RTC+B has just
   cut the duration requirements so that MORE of the fleet can compete for it.

   Capacity scores zero and it is a true zero rather than a low number. ERCOT is
   energy-only with scarcity pricing through the ORDC, there is no mechanism, and
   the Public Utility Commission has repeatedly declined to build one. */
export const COMPONENTS = [
  { n: ['Contracted revenue availability (tolling only)', '合同化收入可得性（仅租赁）'], w: 20, s: 58 },
  { n: ['Merchant arbitrage depth and spread trajectory', '市场化套利深度与价差走势'], w: 16, s: 45 },
  { n: ['Interconnection speed and cost', '并网速度与成本'], w: 16, s: 92 },
  { n: ['Capacity market access for the archetype', '原型资产的容量市场准入'], w: 10, s: 0 },
  { n: ['Ancillary services headroom', '辅助服务市场空间'], w: 10, s: 12 },
  { n: ['Storage-duration fit and capex trajectory', '储能时长匹配度与造价轨迹'], w: 10, s: 40 },
  { n: ['Financing and delivery execution', '融资与交付执行'], w: 10, s: 76 },
  { n: ['Congestion and locational price signal', '拥塞与区位价格信号'], w: 8, s: 71 },
];

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

/** Σ(w · s) / 100, rounded as the dashboard rounds it. */
export const COMPOSITE = Math.round(weighted(COMPONENTS) / 100);

/** Σ(w · s) / 3, rounded as the dashboard rounds it. Higher is worse. */
export const CONNECTION_RISK = Math.round(weighted(CONN_FACTORS) / 3);
