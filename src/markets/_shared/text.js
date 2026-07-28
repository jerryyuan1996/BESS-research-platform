/* ---------------------------------------------------------------------------
   Common UI strings for the GB/IE/RO/PL lineage, verbatim from the prototype
   (GB payload lines 637-658). Identical in all four dashboards.

   A market may extend these through its own 	extOverrides - GB is the only one
   that does today, and it re-states srcHealth with the same wording.
   --------------------------------------------------------------------------- */
const T = {
  asOf: ['Seed snapshot verified', '种子数据核验日期'],
  dataDate: ['Latest data date', '最新数据日期'],
  themeLbl: ['Theme', '主题'],
  codYearLbl: ['Forecast COD year', '预计投运容量年度'],
  disclaimer: ['This dashboard supports, but does not replace, independent investment, legal, technical and financial analysis. Composite signals, recommended durations and suggested commercial terms are generated from the stated methodology and the data sources shown; they are not investment advice and should not be relied upon as the sole basis for a transaction decision.',
               '本看板用于辅助而非替代独立的投资、法律、技术及财务分析。综合信号、建议时长及建议商业条款均基于所示方法及数据来源生成，不构成投资建议，不应作为交易决策的唯一依据。'],
  // badge vocabulary — identical wording in every dashboard
  badgeOfficial: ['Verified official (seed)', '官方已验证（种子）'],
  badgeCalc: ['Calculated from official data', '基于官方数据计算'],
  badgeIllus: ['Illustrative seed — not official', '示例种子 — 非官方'],
  badgeForecast: ['Forecast', '预测'],
  badgeDev: ['Developer-reported', '开发商披露'],
  yoy: ['year on year', '同比'],
  score: ['Score', '评分'],
  weight: ['Weight', '权重'],
  factor: ['Factor', '因子'],
  total: ['Total', '合计'],
  downloadCsv: ['Download KPI CSV', '下载KPI CSV'],
  downloadJson: ['Download seed JSON', '下载种子JSON'],
  srcHealth: ['Source health: SEED — public sources refreshed Jul 2026, automated checks not yet running', '数据源状态：种子数据 — 公开来源已于2026年7月刷新，自动检测尚未运行'],
};

export { T as BASE_TEXT };
export default T;