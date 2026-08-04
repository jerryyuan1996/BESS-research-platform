/* ---------------------------------------------------------------------------
   CAISO — tab strip. Each id is a URL segment: /markets/caiso/<id>.
   First entry is the default.

   Eleven tabs, the same count and reading order as every other market in this
   lineage — tests/registry.test.js asserts it.

   `capacity` is Resource Adequacy and Slice of Day, which in CAISO is the
   majority of revenue rather than a supplement to it, and `duration` carries the
   fact that most distinguishes this market from PJM: the CPUC tests net
   qualifying capacity on four-hour sustained output and pays nothing beyond it.
   --------------------------------------------------------------------------- */

const TABS = [
  ['home',       ['Overview', '总览']],
  ['story',      ['CAISO Market Story', 'CAISO市场演进']],
  ['capacity',   ['Resource Adequacy & Slice of Day', '容量充裕度与分时段机制']],
  ['energy',     ['Nodal Energy & the Midday Trough', '节点电能量与午间低谷']],
  ['services',   ['Ancillary Services', '辅助服务']],
  ['duration',   ['Storage Duration', '储能时长']],
  ['pipeline',   ['Project Pipeline', '项目管线']],
  ['grid',       ['Interconnection & Curtailment', '并网与限电']],
  ['benchmark',  ['CAISO vs PJM vs ERCOT', 'CAISO、PJM与ERCOT对比']],
  ['portfolio',  ['Portfolio', '组合与基金视图']],
  ['data',       ['Data & Methodology', '数据与方法']],
];

export const DEFAULT_TAB = TABS[0][0];
export { TABS, TABS as tabs };
