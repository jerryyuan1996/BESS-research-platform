import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { money, pct } from './model.js';
import { referenceInvestment } from '../opportunities/investment.js';
import { opportunitiesFor } from '../opportunities/catalog.js';
import { PRICE_HISTORY, historicalPressure, stressConditions } from './downsideHistory.js';
const snapshots=new Map();
function history(id){
  if(!snapshots.has(id))snapshots.set(id,fetch('/data/public/'+id+'.summary.json').then(r=>{
    if(!r.ok)throw Error('History unavailable');return r.json();
  }).then(s=>{if(s.datasetId!==id)throw Error('History mismatch');return s;}).catch(e=>{snapshots.delete(id);throw e;}));
  return snapshots.get(id);
}
function conditionText(c){
  const a=money(c.base,c.currency),b=money(c.stress,c.currency);
  const texts={
    delay:['Grid works, equipment or acceptance run late: COD moves from '+c.base+' to '+c.stress+' months after closing.',
      '电网工程、设备到货或验收拖延：投运从交割后'+c.base+'个月延至'+c.stress+'个月，收入要更晚才能开始。'],
    build:['Equipment, EPC or grid costs rise: model build budget increases from '+a+' to '+b+'/MW.',
      '设备、施工或并网报价上涨：模型建设预算从'+a+'升至'+b+'/MW，需要追加投入。'],
    fixed:['Before contracting, the achievable first-year fixed payment falls from '+a+' to '+b+'/MW.',
      '签约前只能谈到较低的固定价：模型首年固定收入从'+a+'降至'+b+'/MW；已签合同仍须按具体条款核验。'],
    term:['The fixed-price period shortens from '+c.base+' to '+c.stress+' years, exposing more of the life to renewal or market prices.',
      '可锁定固定价的期限从'+c.base+'年缩至'+c.stress+'年，之后更早面对续约价格和市场收入波动。'],
    trading:['More competing batteries or narrower price spreads: first-year trading/services input falls '+pct(1-c.stress/c.base)+'.',
      '更多电池参与竞争，或高低电价差收窄：模型首年交易及辅助服务相关收入下降'+pct(1-c.stress/c.base)+'。'],
    opex:['Maintenance, insurance and other recurring costs rise from '+a+' to '+b+'/MW/year.',
      '运维、保险等持续支出上升：模型首年成本从'+a+'升至'+b+'/MW/年。'],
  };
  return L(texts[c.kind]);
}
export function downsideNarrative(row,investor,overrides){
  const options=opportunitiesFor(row.id)[0]?.screeningByInvestor?.[investor]||{},
    base=referenceInvestment(row.market,investor,row.play,options)?.result,
    stress=referenceInvestment(row.market,investor,row.play,{...options,economicOverrides:overrides})?.result,
    conditions=stressConditions(base,stress);
  const host=h('div',{},h('h3',{},L(['What would make this downside happen?','什么情况下会走到这个下行？'])),
    h('p',{},L(['The table combines the following adverse assumptions. A small fall in year-one cash can coexist with a large IRR fall when spending rises, COD is delayed or fixed income expires earlier.',
      '上表把以下不利条件放在一起测试。即使首年现金流只小幅下降，追加投入、投运推迟或固定收入提前到期，也可能让全生命周期IRR大幅下降。'])),
    h('ul',{class:'ix-downside-conditions'},conditions.map(c=>h('li',{},conditionText(c)))),
    h('p',{class:'ix-caption'},L(['Revenue and operating-cost figures here are model input amounts before inflation; the headline returns remain nominal and after tax. Full stress inputs appear below.',
      '这里的收入与运营成本为模型通胀前输入；上方回报仍为税后名义口径。完整压力输入可在下方展开查看。'])));
  const probability=h('div',{class:'ix-history-pressure','data-history-status':'loading'},h('h3',{},L(['How often has similar pressure appeared?','历史上类似压力出现过多少次？'])));
  const unavailable=()=>probability.replaceChildren(h('h3',{},L(['Historical probability: not yet estimable','历史概率：暂不能可靠估计'])),
    h('p',{},L(['This market has no sufficient comparable price sample for this threshold on the site. The combined downside also needs joint evidence on costs, delivery and contracting. No numerical probability has been assigned.',
      '本站暂无足够的可比价格样本来统计这一压力幅度。整个组合下行还需要造价、工期与签约的联合历史记录，目前没有可据以给出的数值概率。'])));
  const trading=conditions.find(c=>c.kind==='trading'),id=PRICE_HISTORY[row.id];
  if(!id||!trading){unavailable();probability.dataset.historyStatus='unavailable';}
  else history(id).then(summary=>{
    if(!host.isConnected)return;
    const result=historicalPressure(summary,1-trading.stress/trading.base);
    if(!result){unavailable();probability.dataset.historyStatus='unavailable';return;}
    probability.dataset.historyStatus='ready';
    probability.replaceChildren(h('h3',{},L(['Historical price-pressure frequency','历史类似价格压力频率'])),
      h('p',{class:'ix-history-stat'},h('strong',{},result.count+' / '+result.total+' · '+pct(result.frequency)),
        L([' comparable month-to-month observations',' 次可比月度环比'])),
      h('p',{},L(['From '+result.from+' to '+result.to+', monthly average daily price spreads fell at least '+pct(result.threshold)+
        ' in '+result.count+' of '+result.total+' consecutive-month comparisons. The threshold uses the model’s first-year trading/services decline; the spread is a price proxy, not realised battery revenue.',
        result.from+'至'+result.to+'，月均日价差环比下降至少'+pct(result.threshold)+'，在'+result.total+'次连续月份比较中出现'+result.count+'次。阈值取自本模型首年交易相关收入降幅；价差仅是价格压力代理，并非电池实际收益。'])),
      h('p',{class:'ix-caption'},L(['Only completed calendar months with at least 90% valid days count. Spread duration: '+result.durationHours+'h. The short sample, changing market rules and dependence between months prevent treating this frequency as a future probability. It does not estimate the chance of construction delays, cost overruns or the entire combined downside.',
        '仅统计有效日数达到90%的完整自然月；价差代理时长'+result.durationHours+'小时。样本较短，市场规则会变化、月份之间也可能相关，因此该频率不能直接当作未来概率，更不能代表延期、超支及整个组合下行的概率。'])),
      h('a',{href:result.source.url,target:'_blank',rel:'noopener noreferrer',class:'ix-text-link'},result.source.name+' ↗'),
      h('small',{},L(['Snapshot ','数据快照 ']),result.fetchedAt.slice(0,10)));
  }).catch(()=>{if(host.isConnected){unavailable();probability.dataset.historyStatus='unavailable';}});
  host.append(probability);return host;
}
