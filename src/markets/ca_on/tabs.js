/* ---------------------------------------------------------------------------
   Ontario — sections. The standard set; src/markets/tabGroups.js arranges
   them into the seven tabs. Ten sections and no Investment Case or Entry,
   because Ontario is not yet graded; `services` says why its line is zero.
   --------------------------------------------------------------------------- */

const TABS = [
  ['home',      ['Overview', '总览']],
  ['story',     ['Ontario Market Story', '安大略市场演进']],
  ['capacity',  ['LT2 Capacity Contract', 'LT2容量合同']],
  ['energy',    ['Day-Ahead Trading', '日前交易']],
  ['services',  ['Operating Reserve', '运行备用']],
  ['duration',  ['Duration', '储能时长']],
  ['pipeline',  ['Project Pipeline', '项目管线']],
  ['grid',      ['Grid Connection', '并网']],
  ['portfolio', ['Portfolio', '组合与基金视图']],
  ['data',      ['Data & Methodology', '数据与方法']],
];

export const DEFAULT_TAB = TABS[0][0];
export { TABS, TABS as tabs };
export default TABS;
