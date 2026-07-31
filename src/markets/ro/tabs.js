/* ---------------------------------------------------------------------------
   Romania 鈥?tab strip, verbatim from the prototype (lines 1324-1337).
   Each id is a URL segment: /markets/<slug>/<id>. First entry is the default.
   --------------------------------------------------------------------------- */

const TABS = [
  ['home',      ['Overview', '总览']],
  ['story',     ['Romania Market Story', '罗马尼亚市场演进']],
  ['capacity',  ['Support & Adequacy', '支持机制与充裕度']],
  ['energy',    ['Wholesale & Intraday', '批发与日内市场']],
  ['services',  ['Balancing & Reserves', '平衡与备用']],
  ['duration',  ['Storage Duration', '储能时长']],
  ['pipeline',  ['Project Pipeline', '项目管线']],
  ['grid',      ['Grid & Permitting', '并网与许可']],
  ['benchmark', ['Romania vs Poland', '罗马尼亚与波兰对比']],
  ['portfolio', ['Portfolio', '组合与基金视图']],
  ['data',      ['Data & Methodology', '数据与方法']],
];

export const DEFAULT_TAB = TABS[0][0];
export { TABS, TABS as tabs };