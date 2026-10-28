import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { link, sectionTitle, eyebrow, metric } from '../experience/chrome.js';
import { money, pct } from '../experience/model.js';
import { OPPORTUNITY_SUMMARY } from './summaryData.js';
export function specialRecommendations(rows, investor) {
  const projection=OPPORTUNITY_SUMMARY[investor];
  const section=h('section',{class:'ix-section',id:'special-opportunities'},
    sectionTitle(['SPECIAL INVESTMENT STRATEGIES','特殊机会投资策略'],['Where to act. What to buy.','投哪里，买什么，怎么做。']));
  const cards=h('div',{class:'ix-special-picks'});
  for(const o of projection.picks){
    const row=rows.find(r=>r.id===o.market),c=o.economics,reuse=o.kind==='reuse';
    const develop=['developer','strategic'].includes(investor);
    const title=reuse?['Germany: buy a usable grid position','德国：收购可用并网点']:
      o.market==='nem'?['NEM Sub-5: build a repeatable portfolio','NEM Sub-5：做可复制的小型组合']:['ERCOT: secure small distribution sites','ERCOT：布局小型配网项目'];
    const strategy=reuse?
      ['Prioritise existing two-way connections. Keep the rights price and complete remaining build within the budgets below.','优先收购已有双向容量的并网点，并网权对价与含改造的剩余建设投入均控制在下方预算内。']:
      o.market==='nem'?
      develop?['Start with 2–3 independent 4.5 MW sites in one utility area. Secure charging/export rights and an aggregator, then replicate delivery.','先在同一配网辖区落地2–3个独立4.5MW项目，锁定双向容量和聚合商，再复制交付流程。']:
        ['Acquire a 2–3-site portfolio of permitted 4.5 MW projects with connection agreements. Use a local developer to deliver and operate the portfolio.','优先收购2–3个已落实许可与并网协议的4.5MW项目，由本地开发商完成交付和运营。']:
      develop?['Target 9 MW distribution projects with modest network works. Complete QSE and product access alongside construction; operate or sell the commissioned portfolio.','优先开发无需重大电网改造的9MW配网项目，并行落实QSE与收入产品资格，投运后运营或组合出售。']:
        ['Buy mature 9 MW distribution projects with two-way connection rights and a local delivery partner. Complete QSE and revenue qualification alongside construction.','优先收购已落实双向接入和本地交付伙伴的成熟9MW配网项目，并行完成QSE与收入资格。'];
    cards.append(h('article',{class:'ix-special-pick'},
      eyebrow(reuse?['BUY WITH PRICE DISCIPLINE','按价格纪律收购']:['PRIORITISE LOCAL DEVELOPMENT','优先布局本地开发']),
      h('h3',{},L(title)),h('p',{},L(strategy)),
      reuse?metric(['Maximum extra connection-rights price','额外并网权收购上限'],
        c.safePremium==null?L(['Acquire without a queue premium','不支付排队溢价']):money(Math.floor(c.safePremium/1000)*1000,c.currency)+'/MW'):
        metric(['Target delivery window','目标交付窗口'],o.months.join('–')+L([' months','个月'])),
      h('p',{},L(reuse?
        ['Target '+c.specialMonths+' months to COD against '+c.baselineMonths+' months for the conventional route. Buy both time and a lower total delivery cost.',
         '目标'+c.specialMonths+'个月投运，常规路径按'+c.baselineMonths+'个月；同时买到时间和更低的交付总成本。']:
        ['Bring cash generation forward and limit capital tied up per site. Pay development consideration at connection, commissioning and revenue-access milestones.',
         '提前形成现金回流，控制单项目资金占用；开发对价按并网协议、投运及收入资格里程碑支付。'])),
      reuse?h('p',{},L(['Remaining build and grid budget: ','剩余建设及并网预算：']),h('strong',{},money(Math.floor(c.buildBudget/1000)*1000,c.currency)+'/MW')):null,
      h('details',{class:'ix-details'},h('summary',{},L(['Basis for the recommendation','建议依据'])),
        h('p',{},L(reuse?
          ['Uses the '+c.playHours+'h play, '+pct(c.target)+' target and a '+Math.abs(c.buildChange)+'% lower total build budget including retrofit. This is the required investment budget; confirm it with priced works before bidding.',
           '采用'+c.playHours+'小时play、'+pct(c.target)+'目标回报，以及比常规低'+Math.abs(c.buildChange)+'%的含改造总建设预算。这是投资报价纪律，须由工程报价落实。']:
          ['Timing follows the simple-node research case. The paired model includes higher unit costs and the eligible income route.','时间采用简单节点研究情景；配对模型计入更高单位成本和可参与的收入路径。']))),
      link('/markets/'+row.market.manifest.slug+'?opportunity='+o.id+'#opportunity-comparison',['Open the strategy and valuation ↗','查看策略与投资测算 ↗'],'ix-text-link')));
  }
  section.append(cards,h('details',{class:'ix-details ix-opportunity-directory'},
    h('summary',{},L(['More market strategies','更多市场策略'])),
    h('div',{class:'ix-opportunity-links'},projection.other.map(o=>{
      const row=rows.find(r=>r.id===o.market);
      return link('/markets/'+row.market.manifest.slug+'?opportunity='+o.id+'#opportunity-comparison',
        [row.market.manifest.name[0]+' · '+o.label[0],row.market.manifest.name[1]+' · '+o.label[1]]);
    })),h('div',{class:'ix-opportunity-links'},projection.scouts.map(([id,label])=>link('/scout#'+id,label)))));
  return section;
}
