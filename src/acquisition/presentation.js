/** Browser-safe price/target/scenario pairing. */
export function displayedCase(result){
  const cases=result.referenceCases||[];
  const base=cases.find(c=>c.key===result.baseCaseKey)||cases[0];
  return base?.status==='priced'?base:cases.filter(c=>c.status==='priced').at(-1)||base;
}
export const INVESTOR_STRATEGY={
  strategic:['Build a repeatable platform around grid access and durable income.','围绕可落实的并网资源和长期收入，寻找能形成规模的布局。'],
  infraFund:['Buy contracted operating assets or ready-to-build projects with a clear remaining budget.','优先寻找收入可锁定的运营资产，或剩余建设预算明确的可开工项目。'],
  foreignFirstTimer:['Start with an operating asset or a ready-to-build project backed by a reliable local team.','先从运营资产或有可靠本地团队的可开工项目进入。'],
  developer:['Secure project rights at a price that leaves room to build and sell at commissioning.','控制项目权利和建设投入，为投运出售留出利润空间。'],
};
export const DECISION_LABEL={priority:['Prioritize','优先跟进'],conditional:['Buy if terms work','满足条件再买'],watch:['Monitor','暂时观察']};
export const INCOME_LABEL={fixed:['Fixed toll','固定租赁收入'],floor:['Revenue floor','收入保底'],collar:['CIS income protection','CIS收入保障'],
  award:['Long-term award','长期中标合同'],capacity:['Capacity payments','容量付费'],merchant:['Market revenue','市场化收入']};
