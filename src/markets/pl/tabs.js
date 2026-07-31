/* ---------------------------------------------------------------------------
   Poland 鈥?tab strip, verbatim from the prototype (lines 1331-1344).
   Each id is a URL segment: /markets/<slug>/<id>. First entry is the default.
   --------------------------------------------------------------------------- */

const TABS = [
  ['home',      ['Overview', '总览']],
  ['story',     ['Poland Market Story', '波兰市场演进']],
  ['capacity',  ['Capacity Market', '容量市场']],
  ['energy',    ['Wholesale & Intraday', '批发与日内市场']],
  ['services',  ['Balancing & Reserves', '平衡与备用']],
  ['duration',  ['Storage Duration', '储能时长']],
  ['pipeline',  ['Project Pipeline', '项目管线']],
  ['grid',      ['Grid & Connection', '并网与接入']],
  ['benchmark', ['Poland vs Romania', '波兰与罗马尼亚对比']],
  ['portfolio', ['Portfolio', '组合与基金视图']],
  ['data',      ['Data & Methodology', '数据与方法']],
];

export const DEFAULT_TAB = TABS[0][0];
export { TABS, TABS as tabs };