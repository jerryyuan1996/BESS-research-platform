/* ---------------------------------------------------------------------------
   ERCOT — tab strip. Each id is a URL segment: /markets/ercot/<id>.
   First entry is the default.

   Eleven tabs, the same count and reading order as every other market in this
   lineage — tests/registry.test.js asserts it, because a dashboard that quietly
   gained or lost one would have stopped being comparable.

   Two labels do different work here. `capacity` covers a mechanism that does not
   exist: it is the tolling market, because in an energy-only market the toll IS
   the contracted route, and a tab that simply said "no capacity market" would
   waste the slot the other ten dashboards use for their contracted revenue.
   `energy` carries the ORDC, which is where ERCOT prices scarcity instead.
   --------------------------------------------------------------------------- */

const TABS = [
  ['home',       ['Overview', '总览']],
  ['case',       ['Investment Case', '投资判断']],
  ['story',      ['ERCOT Market Story', 'ERCOT市场演进']],
  ['capacity',   ['Tolling & Offtake', '租赁与承购']],
  ['energy',     ['Nodal Energy & ORDC Scarcity', '节点电能量与ORDC稀缺定价']],
  ['services',   ['Ancillary Services & RTC+B', '辅助服务与RTC+B']],
  ['duration',   ['Storage Duration', '储能时长']],
  ['pipeline',   ['Project Pipeline', '项目管线']],
  ['grid',       ['Interconnection & Congestion', '并网与拥塞']],
  ['entry',      ['Entry & Delivery', '进入与交付']],
  ['portfolio',  ['Portfolio', '组合与基金视图']],
  ['data',       ['Data & Methodology', '数据与方法']],
];

export const DEFAULT_TAB = TABS[0][0];
export { TABS, TABS as tabs };
