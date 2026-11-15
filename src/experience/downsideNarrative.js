import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { money, pct } from './model.js';
import { referenceInvestment,selectedSupplyOptions } from '../opportunities/investment.js';
import { opportunitiesFor } from '../opportunities/catalog.js';
import { stressConditions } from './downsideHistory.js';
function conditionText(c){
  const a=money(c.base,c.currency),b=money(c.stress,c.currency);
  const texts={
    delay:['Grid works, equipment or acceptance run late: COD moves from '+c.base+' to '+c.stress+' months after closing.',
      '电网工程、设备到货或验收拖延：投运从交割后'+c.base+'个月延至'+c.stress+'个月，收入要更晚才能开始。'],
    build:['Equipment, EPC or grid costs rise: model build budget increases from '+a+' to '+b+'/MW.',
      '设备、施工或并网报价上涨：模型建设预算从'+a+'升至'+b+'/MW，需要追加投入。'],
    fixed:['Before contracting, the fixed-income input falls from '+a+' to '+b+'/MW. Basis: closing-price input, before COD indexation.',
      '签约前只能谈到较低的固定价：固定收入输入从'+a+'降至'+b+'/MW。口径：交割价格输入，尚未计入投运时指数化。'],
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
  const options={...opportunitiesFor(row.id)[0]?.screeningByInvestor?.[investor],...selectedSupplyOptions(row)},
    base=referenceInvestment(row.market,investor,row.play,options)?.result,
    stress=referenceInvestment(row.market,investor,row.play,{...options,economicOverrides:overrides})?.result,
    conditions=stressConditions(base,stress);
  const host=h('div',{},h('h3',{},L(['What would make this downside happen?','什么情况下会走到这个下行？'])),
    h('p',{},L(['The table combines the following adverse assumptions. A small fall in year-one cash can coexist with a large IRR fall when spending rises, COD is delayed or fixed income expires earlier.',
      '上表把以下不利条件放在一起测试。即使首年现金流只小幅下降，追加投入、投运推迟或固定收入提前到期，也可能让全生命周期IRR大幅下降。'])),
    h('ul',{class:'ix-downside-conditions'},conditions.map(c=>h('li',{},conditionText(c)))),
    h('p',{class:'ix-caption'},L(['Revenue and operating-cost figures here are model input amounts before inflation; the headline returns remain nominal and after tax. Full stress inputs appear below.',
      '这里的收入与运营成本为模型通胀前输入；上方回报仍为税后名义口径。完整压力输入可在下方展开查看。'])));
  return host;
}
