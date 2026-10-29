/* ---------------------------------------------------------------------------
   Saudi Arabia — sections. The standard set; src/markets/tabGroups.js arranges
   them into the seven tabs. Ten sections and no Investment Case or Entry,
   because Saudi Arabia is not yet graded; `energy` and `services` say why no
   market line exists.
   --------------------------------------------------------------------------- */

const TABS = [
  ['home',      ['Overview', '总览']],
  ['story',     ['Saudi Market Story', '沙特市场演进']],
  ['capacity',  ['Storage Services Agreement', '储能服务协议']],
  ['energy',    ['No Wholesale Market', '无批发市场']],
  ['services',  ['Ancillary Services', '辅助服务']],
  ['duration',  ['Duration', '储能时长']],
  ['pipeline',  ['Project Pipeline', '项目管线']],
  ['grid',      ['Grid Connection', '并网']],
  ['portfolio', ['Portfolio', '组合与基金视图']],
  ['data',      ['Data & Methodology', '数据与方法']],
];

export const DEFAULT_TAB = TABS[0][0];
export { TABS, TABS as tabs };
export default TABS;
