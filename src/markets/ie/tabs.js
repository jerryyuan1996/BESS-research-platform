/* ---------------------------------------------------------------------------
   Ireland (SEM, all-island) 鈥?tab strip, verbatim from the prototype (lines 1325-1338).
   Each id is a URL segment: /markets/<slug>/<id>. First entry is the default.
   --------------------------------------------------------------------------- */

const TABS = [
  ['home',      ['Overview', '总览']],
  ['story',     ['Ireland Market Story', '爱尔兰市场演进']],
  ['capacity',  ['Capacity Mechanism', '容量机制']],
  ['energy',    ['Wholesale & Balancing', '批发与平衡市场']],
  ['services',  ['DS3, FASS & DASSA', 'DS3、FASS与DASSA']],
  ['duration',  ['Duration & LDES', '储能时长与长时储能']],
  ['pipeline',  ['Project Pipeline', '项目管线']],
  ['grid',      ['Grid & Connection', '并网与接入']],
  ['benchmark', ['Ireland vs GB', '爱尔兰与英国对比']],
  ['portfolio', ['Portfolio', '组合与基金视图']],
  ['data',      ['Data & Methodology', '数据与方法']],
];

export const DEFAULT_TAB = TABS[0][0];
export { TABS, TABS as tabs };