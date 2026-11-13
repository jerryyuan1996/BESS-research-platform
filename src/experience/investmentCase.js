import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { metric } from './chrome.js';
import { money, pct, returnPct, share, multiple } from './model.js';
import {operatingPrice} from './projectFacts.js';

const finite = Number.isFinite;
const number = value => Number(value.toFixed(1));
const strategy = row => row.play?.route || row.investment?.strategyId;
export function revenueRoute(row) {
  const route=strategy(row),kind=row.investment?.contract?.kind;
  if(row.id==='sa')return ['Storage Services Agreement (SSA)','储能服务协议（SSA）'];
  if(kind==='collar')return ['CIS revenue support + trading','CIS 收入支持 + 电能交易'];
  if(kind==='floor')return ['Optimiser floor + trading and reserves','优化商保底 + 交易与备用'];
  if(route==='ltda')return row.id==='it'?['MACSE storage contract','MACSE 储能合同']:['Long-term decarbonisation auction (LTDA)','长期脱碳电源拍卖（LTDA）'];
  if(route==='cap')return ({wa:['Reserve Capacity Mechanism + trading','备用容量机制 + 电能交易'],
    caiso:['Resource Adequacy + trading','资源充裕度合同 + 电能交易'],
    ca_on:['Long-term capacity contract + trading','长期容量合同 + 电能交易'],
    pjm:['Capacity auction + trading','容量拍卖 + 电能交易']})[row.id]||['Capacity market + trading','容量市场 + 电能交易'];
  if(route==='toll')return row.id==='gb'&&row.market.comparison.economics.tollAdditiveWithCapacity?['Toll + capacity payments','租赁合同 + 容量付费']:['Tolling contract','租赁合同'];
  return route==='mer'?['Merchant trading and reserves','市场化交易与备用']:row.play?.label||row.market.comparison.narrative.archetype;
}
const routeExplanation = row => row.id==='it' && strategy(row) === 'cap'
  ? ['Assumes an earlier capacity award, plus trading and ancillary services. The IRR below prices this capacity-market case; MACSE is a separate opportunity.',
    '假设持有早先批次容量合同，叠加电能交易及辅助服务收入。下方 IRR 对应这一容量市场方案；MACSE 是另一类独立机会。']
  : row.id==='it' && strategy(row) === 'ltda'
    ? ['A MACSE award pays for contracted storage energy. Time-shifting rights are transferred; any retained trading income follows the modelled contract rules.',
      'MACSE 按签约储能电量付费，时移权利交出；可保留的交易收入按模型中的合同规则计入。']
    : row.play?.why;
function contractIncomeLabel(row) {
  const kind=row.investment?.contract?.kind,route=strategy(row);
  if(kind==='floor')return ['Optimiser floor','优化商保底收入'];
  if(kind==='collar')return ['CIS revenue support','CIS 收入支持'];
  if(route==='ltda')return row.id==='it'?['MACSE contract','MACSE 合同']:['LTDA contract','LTDA 合同'];
  if(route==='toll')return row.id==='gb'&&row.market.comparison.economics.tollAdditiveWithCapacity?['Toll + capacity receipts','租赁及容量收入']:['Tolling contract','租赁合同'];
  return ({wa:['Reserve Capacity payments','备用容量付费'],caiso:['Resource Adequacy contract','资源充裕度合同'],
    ca_on:['Long-term capacity contract','长期容量合同'],pjm:['Awarded capacity auction','已锁定容量拍卖']})[row.id]||['Capacity-market contract','容量市场合同'];
}
function facts(entries) {
  return h('dl', { class:'ic-case-facts' }, entries.filter(([,value]) => value != null && value !== '').map(([label,value]) =>
    h('div', {}, h('dt', {}, L(label)), h('dd', {}, L(value)))));
}
export function investmentCaseIdentity(row) {
  const i = row.investment;
  return h('div', { class:'ic-case-identity', 'data-revenue-route':strategy(row) || '' },
    h('div', {}, h('span', { class:'ic-case-kicker' }, L(['THE CASE BEHIND THIS RETURN','这项回报测算的是什么'])),
      h('h3', {}, L(revenueRoute(row))), h('p', {}, L(routeExplanation(row)))),
    i && finite(i.hours) && finite(i.powerMW) ? h('div', { class:'ic-case-size' },
      h('strong', {}, i.hours, h('span', {}, L([' hours',' 小时']))),
      h('span', {}, `${i.powerMW} MW / ${number(i.powerMW * i.hours)} MWh`)) : null);
}
export function investmentDecisionMetrics(row, margin) {
  const i = row.investment;
  return h('div', { class:'ic-decision-body' }, h('div', { class:'ic-decision-returns' },
    finite(i.holdIRR) ? metric(['Base all-equity IRR','基准全股权 IRR'], returnPct(i.holdIRR), margin) : null,
    finite(i.peakEquityPerMW) && finite(i.powerMW) ? metric(['Peak pre-COD equity / project','投运前峰值股权资金／项目'], money(i.peakEquityPerMW * i.powerMW, i.currency),
      ['Construction funded with equity; debt drawn at COD','建设期由股权垫资，投运时提取贷款']) : null),
    facts([
      [['Entry → operation','进入 → 投运'], finite(i.rtbMonths) ? [`RTB + ${number(i.rtbMonths)} months`,`具备开工条件 + ${number(i.rtbMonths)} 个月`] : null],
      [['Operating life / return basis','运营期／回报口径'], finite(i.lifeYears) ? [`${i.lifeYears} years · nominal, after project tax`,`${i.lifeYears} 年 · 税后名义`] : null],
      [['Model contract term','模型合同期限'], i.securedYears>0 ? [`${i.securedYears} years`,`${i.securedYears} 年`] : null],
      [['Year-one contracted / market income','首年合同／市场收入'], finite(i.secured) ? `${share(i.secured)} / ${share(1-i.secured)}` : null],
      [['Build & grid budget / project','建设及并网预算／项目'], finite(i.capexTotal) ? money(i.capexTotal, i.currency) : null],
      [['Assumed project-rights price / MW','假设项目权利收购价／MW'], finite(i.purchasePricePerMW) ? money(i.purchasePricePerMW, i.currency) : null],
    ]));
}
function debtBreakdown(row) {
  const i=row.investment,l=i?.leverage;
  if (!l?.contributions?.length) return null;
  const name = c => c.kind === 'merchant' ? ['Trading & other market cash','交易及其他市场现金流']
    : contractIncomeLabel(row);
  return h('section',{class:'ic-debt-breakdown','aria-label':L(['Debt by revenue source','按收入来源测算债务'])},
    h('div',{class:'ic-debt-heading'},h('h3',{},L(['Size each income stream, then add the debt','各收入分别测算，再加总债务'])),
      h('span',{},L(['One loan · one capex denominator','同一笔贷款 · 统一以建设及并网预算为分母']))),
    h('table',{class:'ic-debt-table'},h('thead',{},h('tr',{},
      [['Income stream','收入来源'],['Sizing DSCR','测算 DSCR'],['Debt / MW','支持贷款／MW'],['Debt / capex','债务比例贡献']].map(label=>h('th',{scope:'col'},L(label))))),
      h('tbody',{},l.contributions.map(c=>h('tr',{'data-debt-stream':c.kind==='merchant'?'merchant':strategy(row)},
        h('th',{scope:'row'},L(name(c))),h('td',{},multiple(c.dscr)),h('td',{},money(c.loanPerMW,i.currency)),h('td',{},pct(c.gearing))))),
      h('tfoot',{},h('tr',{},h('th',{scope:'row',colspan:'2'},L(['Total debt after cap','上限约束后的总债务'])),
        h('td',{},money(l.loanPerMW,i.currency)),h('td',{},pct(l.gearing))))),
    h('p',{class:'ic-case-footnote'},L([
      'Allocate each year’s project cash after costs and tax by revenue share, divide by each DSCR, then discount debt service and apply the common gearing cap. Market cash includes uncontracted renewals and post-contract income across the sizing profile; it can differ from the year-one income mix. The contributions form one loan.',
      '逐年将扣除成本和税后的现金流按收入占比分配，分别除以 DSCR，再折现并应用统一融资上限。市场现金流包括测算期内未锁定续约及合同到期后的收入，因此债务构成可与首年收入占比不同；各项共同构成一笔贷款。'])),
    finite(l.capacityPerMW)&&finite(l.capShare)?h('div',{class:'ic-debt-cap'},
      h('span',{},L(['Cash-flow-supported debt before cap','现金流支持的债务比例（上限前）']),h('strong',{},pct(l.capacityPerMW/i.capexPerMW))),
      h('span',{},L(['Gearing cap','融资比例上限']),h('strong',{},pct(l.capShare))),
      h('span',{},L(['Final gearing','最终债务比例']),h('strong',{},pct(l.gearing)))):null);
}
export function bankableInvestmentCase(row) {
  const i = row.investment, l = i?.leverage, b = i?.bridge;
  if (!i) return null;
  const localMoney = value => finite(value) && finite(i.fxToUSD) && i.fxToUSD > 0 ? money(value / i.fxToUSD, i.currency) : null;
  const path=Array.isArray(i.inflationPath)&&i.inflationPath.length?i.inflationPath:null;
  const inflation=path?[path.map(v=>(v*100).toFixed(2)+'%').join(' → ')+' thereafter',path.map(v=>(v*100).toFixed(2)+'%').join(' → ')+'，末档持续']:finite(i.inflationRate)?pct(i.inflationRate):null;
  const contractIndexation=i.revenueSupport?['Floor / cap settled at model terms','支持下限／上限按模型条款结算']:i.securedIndexation==='fixed'?['Fixed nominal','名义固定']:inflation;
  const income = [
    [['Revenue route','收入模式'], revenueRoute(row)],
    [['Model contract term','模型合同期限'], i.securedYears>0 ? [`${i.securedYears} years`,`${i.securedYears} 年`] : null],
    [['Contracted income / MW · year one','首年合同收入／MW'], localMoney(b?.fixed)],
    [['Trading & ancillary / MW · year one','首年交易及辅助服务／MW'], localMoney(b?.trading)],
    [['Uncontracted renewals / MW · year one','首年未锁定续约收入／MW'],b?.renewal>0?localMoney(b.renewal):null],
    [['Contract indexation assumption','合同指数化假设'], i.secured>0?contractIndexation:null],
    [[path?'Inflation path from closing':'Model inflation',path?'交割起通胀路径':'模型通胀'],inflation],
    [['Capital grant / MW (not operating income)','资本补助／MW（不计经营收入）'],i.capitalGrantPerMW>0?money(i.capitalGrantPerMW,i.currency):null],
    [['Tax-credit recovery / MW','税收抵免回收／MW'],i.usSupply&&finite(i.capitalSupportPerMW)?money(i.capitalSupportPerMW-(i.capitalGrantPerMW||0),i.currency):null],
    [['Annual support floor / MW','年收入支持下限／MW'],finite(i.contract?.floorPerMW)?money(i.contract.floorPerMW,i.currency):null],
    [['Annual support ceiling / MW','年收入支持上限／MW'],finite(i.contract?.ceilingPerMW)?money(i.contract.ceilingPerMW,i.currency):null],
    [['Support / upside sharing','下行支持／上行分享'],i.contract?.kind==='collar'?`${share(i.contract.topUpShare)} / ${share(i.contract.repaymentShare)}`:null],
    [['Design / obligation','设计／履约义务'],row.id.startsWith('jp_')?row.play?.label:null],
    [['Contracted cash-flow pool','合同现金流组'],strategy(row)==='toll'&&row.id==='gb'&&row.market.comparison.economics.tollAdditiveWithCapacity?['Toll and capacity receipts pooled in this model','本模型合并租赁及容量收入']:null],
    [['Supply / tax case','设备供应／税务情景'],row.caseLabel|| (i.usSupply?i.usSupply==='chinese'?['Chinese DC block · no credit','中国电池舱 · 无抵免']:['Non-FEOC DC block · model tax credit','非 FEOC 电池舱 · 模型抵免']:null)],
    [['Operating-entry reference','在运收购参考'],operatingPrice(i)],
    [['Energy-price reference','电价收入依据'],row.id==='es'?['OMIE perfect-foresight day-ahead reference · fleet-growth adjustment; execution slippage uncalibrated; capacity and balancing receipts excluded',
      'OMIE 完全预见日前参考 · 机组增长调整；执行滑点未校准；未计容量及平衡收入']:null],
  ];
  const debt = l ? [
    [['Drawdown','提款时点'], ['At commercial operation (COD)','商业投运时（COD）']],
    [['Loan / project','全项目贷款'], finite(l.loanPerMW) && finite(i.powerMW) ? money(l.loanPerMW * i.powerMW, i.currency) : null],
    [['Net debt cash released at COD / project','投运时可回收债务资金净额／项目'],finite(l.loanPerMW)&&finite(l.fee)&&finite(l.reserve)&&finite(i.powerMW)?money((l.loanPerMW-l.fee-l.reserve)*i.powerMW,i.currency):null],
    [['Debt-service reserve / project','偿债储备金／项目'],finite(l.reserve)&&finite(i.powerMW)?money(l.reserve*i.powerMW,i.currency):null],
    [['Legal / amortisation term','法定／摊还期限'], finite(l.legalYears) && finite(l.notionalYears) ? [`${l.legalYears} / ${l.notionalYears} years`,`${l.legalYears} / ${l.notionalYears} 年`] : null],
    [['Year-one all-in interest','首年综合利率'], finite(l.rate) ? pct(l.rate) : null],
    [['Equity-funded balloon','由股权偿还的到期尾款'], finite(l.balloonShare) ? share(l.balloonShare) : null],
    [['Arrangement fee / project','全项目融资手续费'], finite(l.fee) && finite(i.powerMW) ? money(l.fee * i.powerMW, i.currency) : null],
  ] : [];
  return h('div', { class:'ic-bankable-case' },
    h('div', { class:'ix-kpis ic-bankable-kpis' },
      finite(i.holdIRR) ? metric(['All-equity IRR (hold)','全股权 IRR（长持）'], returnPct(i.holdIRR)) : null,
      finite(i.leveredIRR) ? metric(['Levered equity IRR','杠杆后股权 IRR'], returnPct(i.leveredIRR)) : null,
      finite(l?.gearing) ? metric(['Debt ratio','债务比例'], pct(l.gearing), ['Of build & grid budget','占建设及并网预算']) : null,
      finite(l?.minCover) ? metric(['Minimum annual DSCR','最低年度 DSCR'], multiple(l.minCover), ['Cash available ÷ debt service; before balloon','可用现金流 ÷ 还本付息；不含到期尾款']) : null),
    debtBreakdown(row),
    h('div', { class:'ic-bankable-grid' },
      h('section', { class:'ic-assumption-card' }, h('h3', {}, L(['How the project earns','项目靠什么赚钱'])),
        finite(i.secured) ? h('div', { class:'ic-income-mix' },
          h('div', { class:'ic-income-track', role:'img', 'aria-label':L([`Contracted ${share(i.secured)}; market ${share(1-i.secured)}`,`合同 ${share(i.secured)}；市场 ${share(1-i.secured)}`]) },
            h('span', { style:`width:${Math.max(0,Math.min(100,i.secured*100))}%` })),
          h('div', { class:'ic-income-labels' }, h('span', {}, L(['Contracted','合同']), ' ', share(i.secured)), h('span', {}, L(['Market','市场']), ' ', share(1-i.secured)))) : null,
        facts(income)),
      debt.length ? h('section', { class:'ic-assumption-card' }, h('h3', {}, L(['How the debt is sized','贷款如何测算'])), facts(debt)) : null),
    h('p', { class:'ic-case-footnote' }, L(['Reference underwriting assumptions · actual contract terms determine financing. The thresholds size the loan; minimum annual DSCR is the resulting cash-flow coverage.',
      '参考承销假设 · 实际合同条款决定融资条件。DSCR 门槛用于测算贷款额；最低年度 DSCR 是该贷款方案下算出的现金流覆盖倍数。'])));
}
