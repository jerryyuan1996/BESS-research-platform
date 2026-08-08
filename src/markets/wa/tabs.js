/* ---------------------------------------------------------------------------
   WA tab strip, verbatim from the prototype (lines 323-336).

   Each id is also a URL segment: /markets/western-australia/<id>. The prototype
   held these tabs as DOM state only, so no tab was linkable.

   The ten-year BRCP forecast and the RCM x Energy x FCESS co-optimisation are not
   tabs: as in the prototype they render as the tail of the 'rcm' and 'lab' tabs
   respectively.
   --------------------------------------------------------------------------- */
const TABS = [
  ['home',      ['Overview', '总览']],
  ['story',     ['WA Market Story', '西澳市场演进']],
  ['rcm',       ['RCM & Capacity', '容量机制']],
  ['energy',    ['Energy Arbitrage', '现货套利']],
  ['fcess',     ['FCESS', '辅助服务']],
  ['duration',  ['Storage Duration', '储能时长']],
  ['pipeline',  ['Project Pipeline', '项目管线']],
  ['grid',      ['Grid Connection', '并网与电网约束']],
  ['portfolio', ['Portfolio', '组合与基金视图']],
  ['data',      ['Data & Methodology', '数据与方法']],
];

export const DEFAULT_TAB = TABS[0][0];
export { TABS, TABS as tabs };
