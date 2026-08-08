/* ---------------------------------------------------------------------------
   Great Britain 鈥?tab strip, verbatim from the prototype (lines 1329-1342).
   Each id is a URL segment: /markets/<slug>/<id>. First entry is the default.
   --------------------------------------------------------------------------- */

const TABS = [
  ['home',      ['Overview', '总览']],
  ['story',     ['GB Market Story', '英国市场演进']],
  ['capacity',  ['Capacity Market', '容量市场']],
  ['energy',    ['Wholesale & BM', '批发与平衡机制']],
  ['services',  ['System Services', '系统服务']],
  ['duration',  ['Duration & LDES', '储能时长与长时储能']],
  ['pipeline',  ['Project Pipeline', '项目管线']],
  ['grid',      ['Grid Connection', '并网与连接改革']],
  ['portfolio', ['Portfolio', '组合与基金视图']],
  ['data',      ['Data & Methodology', '数据与方法']],
];

export const DEFAULT_TAB = TABS[0][0];
export { TABS, TABS as tabs };