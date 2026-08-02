/* ---------------------------------------------------------------------------
   National Electricity Market — tab strip. Each id is a URL segment: /markets/nem/<id>.
   First entry is the default.

   Structure matches the RO/PL lineage exactly. Only the labels are
   Australian: `capacity` is the Capacity Investment Scheme rather than a
   capacity market — the NEM has none — and `grid` carries marginal loss factors,
   which are a NEM-specific haircut on every megawatt-hour exported.
   --------------------------------------------------------------------------- */

const TABS = [
  ['home',       ['Overview', '总览']],
  ['story',      ['NEM Market Story', 'NEM市场演进']],
  ['capacity',   ['Capacity Investment Scheme', '容量投资计划']],
  ['energy',     ['Spot & Cap Contracts', '现货与价格上限合约']],
  ['services',   ['FCAS', '频率控制辅助服务']],
  ['duration',   ['Storage Duration', '储能时长']],
  ['pipeline',   ['Project Pipeline', '项目管线']],
  ['grid',       ['Grid, MLF & Congestion', '并网、边际损耗与拥塞']],
  ['benchmark',  ['NEM vs WEM', 'NEM与WEM对比']],
  ['portfolio',  ['Portfolio', '组合与基金视图']],
  ['data',       ['Data & Methodology', '数据与方法']],
];

export const DEFAULT_TAB = TABS[0][0];
export { TABS, TABS as tabs };
