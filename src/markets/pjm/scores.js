/* ---------------------------------------------------------------------------
   PJM — the two weighted score tables, and the scores derived from them.

   Both the comparison interface and the dashboard need these numbers, and the
   other markets in this lineage solve that by writing the table in data.js and
   the resulting score in comparison.js with a comment asserting the two agree.
   That works until somebody edits one weight.

   Here they are computed once and imported by both, so the composite cannot
   disagree with the components it is a summary of. Same arithmetic as everywhere
   else on the platform:

     composite        Σ(w · s) / 100, with s on 0-100 and Σw = 100
     connectionRisk   Σ(w · s) / 3,   with s on 0-3   and Σw = 100

   The connection table scores RISK, so higher is worse — the same direction RO,
   PL, DE and the NEM use.
   --------------------------------------------------------------------------- */

/* Why these eight, and why the weights sit where they do:

   Capacity carries the most weight because PJM is the only market on this
   platform where a public auction pays a four-hour battery a large, published,
   fully-accredited number — $325.00/MW-day at a 59% ELCC class rating — and
   because that is simultaneously the thing that expires soonest. It is the best
   contracted line in the set and it lasts one year.

   Regulation scores lowest, at 18, and it is the highest-revenue line in the
   observed data. That inversion is the whole PJM argument: the fleet earning
   those numbers is ~400 MW against a ~750 MW requirement, and the queue behind
   it is 67 GW. A score that rewarded observed Regulation revenue would be
   scoring a position that closes before this asset commissions. */
export const COMPONENTS = [
  { n: ['Capacity market depth and accreditation for the archetype', '容量市场深度与原型资产的核证水平'], w: 20, s: 72 },
  { n: ['Contracted revenue beyond the secured delivery year', '已锁定实需年度之外的合同化收入'], w: 15, s: 30 },
  { n: ['Merchant arbitrage depth and spread trajectory', '市场化套利深度与价差走势'], w: 15, s: 74 },
  { n: ['Regulation headroom against the system requirement', '相对系统需求的调频市场空间'], w: 10, s: 18 },
  { n: ['Interconnection queue and delivery timetable', '并网排队与交付时间表'], w: 15, s: 35 },
  { n: ['Congestion and locational price signal', '拥塞与区位价格信号'], w: 8, s: 62 },
  { n: ['Storage-duration fit and capex trajectory', '储能时长匹配度与造价轨迹'], w: 8, s: 70 },
  { n: ['Financing, tax equity and delivery execution', '融资、税务股权与交付执行'], w: 9, s: 71 },
];

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

/* Both are ROUNDED, exactly as src/markets/_shared/compute.js rounds them when
   it draws the same tables. PJM's happen to land on integers anyway, so this
   moves nothing here — but without it a market whose weights do not divide
   cleanly would carry one number in its comparison interface and render another
   on its dashboard, and a reader comparing the two would be right to distrust
   both. ERCOT is exactly that case. */

/** Σ(w · s) / 100 — the same composite every other market publishes. */
export const COMPOSITE = Math.round(weighted(COMPONENTS) / 100);

/** Σ(w · s) / 3 — the connection-risk index, higher being worse. */
export const CONNECTION_RISK = Math.round(weighted(CONN_FACTORS) / 3);
