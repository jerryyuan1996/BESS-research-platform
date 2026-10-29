/* ---------------------------------------------------------------------------
   Spain — sections. The standard set; src/markets/tabGroups.js arranges them
   into the seven tabs. Ten sections and no Investment Case or Entry, because
   Spain is not yet graded; `capacity` sets out a market with no auction yet.
   --------------------------------------------------------------------------- */

const TABS = [
  ['home',      ['Overview', '总览']],
  ['story',     ['Spain Market Story', '西班牙市场演进']],
  ['energy',    ['Day-Ahead Trading', '日前交易']],
  ['capacity',  ['Capacity Market', '容量市场']],
  ['services',  ['Balancing', '平衡服务']],
  ['duration',  ['Duration', '储能时长']],
  ['pipeline',  ['Project Pipeline', '项目管线']],
  ['grid',      ['Grid Connection', '并网']],
  ['portfolio', ['Portfolio', '组合与基金视图']],
  ['data',      ['Data & Methodology', '数据与方法']],
];

export const DEFAULT_TAB = TABS[0][0];
export { TABS, TABS as tabs };
export default TABS;
