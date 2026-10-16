/* ---------------------------------------------------------------------------
   WA UI strings, verbatim from the prototype (lines 292-321). Bilingual pairs.
   --------------------------------------------------------------------------- */


// ---------------- common UI strings ----------------
const T = {
  title: ['Western Australia Battery Investment Dashboard', '西澳储能投资看板'],
  sub: ['Institutional investor storyline: market evolution, forward signals, project underwriting and portfolio application.',
        '面向机构投资人的投资叙事：市场演进、前瞻信号、项目承销与组合应用。'],
  asOf: ['Verified', '核验日期'],
  dataDate: ['Latest data date', '最新数据日期'],
  tz: ['All timestamps AWST', '所有时间为西澳标准时间(AWST)'],
  srcHealth: ['Source health: base case — public sources refreshed Jul 2026, automated checks not yet running', '数据源状态：基准情景 — 公开来源已于2026年7月刷新，自动检测尚未运行'],
  nextMilestone: ['Next RCM milestone: verify against the AEMO Reserve Capacity Timetable', '下一RCM里程碑：请以AEMO备用容量周期时间表为准'],
  seedWarn: ['Every value on this page is an approved base-case snapshot or an illustrative placeholder. No figure is production-complete until its live feed, validation and source-health check are running (spec §22.0).',
             '本页所有数值均为已批准的基准情景快照或示例占位数据。在实时数据接入、校验及来源健康检测上线前，任何指标均不可用于生产决策（规范§22.0）。'],
  codYearLbl: ['Forecast COD year', '预计投运容量年度'],
  themeLbl: ['Theme', '主题'],
  badgeOfficial: ['Verified official (seed)', '官方已验证（种子）'],
  badgeCalc: ['Calculated from official data', '基于官方数据计算'],
  badgeIllus: ['Seed estimate', '种子估算'],
  badgeForecast: ['Forecast', '预测'],
  badgeDev: ['Developer-reported', '开发商披露'],
  yoy: ['year on year', '同比'],
  vsPrior: ['vs Q1 2025', '对比2025年一季度'],
  score: ['Score', '评分'],
  weight: ['Weight', '权重'],
  factor: ['Factor', '因子'],
  total: ['Total', '合计'],
  downloadCsv: ['Download KPI CSV', '下载KPI CSV'],
  downloadJson: ['Download seed JSON', '下载种子JSON'],
};

export { T };
