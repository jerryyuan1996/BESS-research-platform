import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { link, sectionTitle, eyebrow, metric } from '../experience/chrome.js';
import { money, pct } from '../experience/model.js';
import { OPPORTUNITY_SUMMARY } from './summaryData.js';
import { countryAttrs, projectFacts } from '../experience/projectFacts.js';
export function specialRecommendations(rows, investor) {
  const projection=OPPORTUNITY_SUMMARY[investor];
  const section=h('section',{class:'ix-section',id:'special-opportunities'},
    sectionTitle(['SPECIAL INVESTMENT STRATEGIES','特殊机会投资策略'],['Where to act. What to buy.','投哪里，买什么，怎么做。']));
  const cards=h('div',{class:'ix-special-picks'});
  /* Only special opportunities whose all-equity IRR beats the conventional play
     in the same market reach this list (opportunities/summary.js). */
  for(const o of projection.picks){
    const row=rows.find(r=>r.id===o.market),c=o.economics,reuse=o.kind==='reuse',de=o.id==='de-existing-node';
    const title=de?['Germany: buy a usable grid position','德国：收购可用并网点']:
      [row.market.manifest.name[0]+': '+o.label[0],row.market.manifest.name[1]+'：'+o.label[1]];
    const strategy=de?
      ['Prioritise existing two-way connections. Keep the rights price and complete remaining build within the budgets below.','优先收购已有双向容量的并网点，并网权对价与含改造的剩余建设投入均控制在下方预算内。']:o.thesis;
    const irr=o.irr;
    cards.append(h('article',{class:'ix-special-pick',...countryAttrs(o.market)},
      eyebrow(reuse?['BUY WITH PRICE DISCIPLINE','按价格纪律收购']:['ACQUIRE MATURE PROJECTS','优先收购成熟项目']),
      h('h3',{},L(title)),h('p',{},L(strategy)),
      h('div',{class:'ix-special-irr'},
        metric(['Special route IRR','特殊路径IRR'],pct(irr.special),['All-equity hold, same price','全股权长持，同一对价']),
        metric(['Conventional play IRR','常规play IRR'],pct(irr.conventional),[`+${((irr.special-irr.conventional)*100).toFixed(1)} pts for the special route`,`特殊路径高${((irr.special-irr.conventional)*100).toFixed(1)}个百分点`])),
      de?metric(['Maximum extra connection-rights price','额外并网权收购上限'],
        c.safePremium==null?L(['No premium clears the target','任何溢价均未达目标']):money(Math.floor(c.safePremium/1000)*1000,c.currency)+'/MW'):
        metric(['Target delivery window','目标交付窗口'],o.months.join('–')+L([' months','个月'])),
      de?h('p',{},L(['Target '+c.specialMonths+' months to COD against '+c.baselineMonths+' months for the conventional route. Buy both time and a lower total delivery cost.',
         '目标'+c.specialMonths+'个月投运，常规路径按'+c.baselineMonths+'个月；同时买到时间和更低的交付总成本。'])):null,
      de?h('p',{},L(['Remaining build and grid budget: ','剩余建设及并网预算：']),h('strong',{},money(Math.floor(c.buildBudget/1000)*1000,c.currency)+'/MW')):null,
      projectFacts(o.project),
      h('details',{class:'ix-details'},h('summary',{},L(['Basis for the recommendation','建议依据'])),
        h('p',{},L(de?
          ['Uses the '+c.playHours+'h play, '+pct(c.target)+' target and a '+Math.abs(c.buildChange)+'% lower total build budget including retrofit. This is the required investment budget; confirm it with priced works before bidding.',
           '采用'+c.playHours+'小时play、'+pct(c.target)+'目标回报，以及比常规低'+Math.abs(c.buildChange)+'%的含改造总建设预算。这是投资报价纪律，须由工程报价落实。']:
          ['Both IRRs come from the paired model at the same closing date and price. '+(c.safePremium==null?'No extra price for the special route also clears the '+pct(c.target)+' target, so pay none.':'The special route can carry up to '+money(Math.floor(c.safePremium/1000)*1000,c.currency)+'/MW extra and still clear the '+pct(c.target)+' target.'),
           '两项IRR均来自同一交割日、同一对价的配对模型。'+(c.safePremium==null?'特殊路径的任何额外对价都无法同时达到'+pct(c.target)+'目标，因此不应支付溢价。':'特殊路径最多可多付'+money(Math.floor(c.safePremium/1000)*1000,c.currency)+'/MW，仍达到'+pct(c.target)+'目标。')]))),
      link('/markets/'+row.market.manifest.slug+'?opportunity='+o.id+'#opportunity-comparison',['Open the strategy and valuation ↗','查看策略与投资测算 ↗'],'ix-text-link')));
  }
  section.append(cards,h('details',{class:'ix-details ix-opportunity-directory'},
    h('summary',{},L(['More market strategies','更多市场策略'])),
    h('div',{class:'ix-opportunity-links'},projection.scouts.map(([id,label])=>link('/scout#'+id,label)))));
  return section;
}
