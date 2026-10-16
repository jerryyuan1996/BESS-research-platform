import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { requestRender } from '../app/state.js';
import { navigate } from '../app/router.js';
import { renderHeader } from '../components/header.js';
import { marketNav } from '../components/navigation.js';
import { renderFooter } from '../components/footer.js';
import { markets, comparableMarkets } from '../markets/registry.js';
import { EXIT_YEARS } from '../comparison/assumptions.js';
import { homeState } from './state.js';
import { renderInvestmentLab } from './investmentLab.js';

const T = {
  title:['Investment Lab & project debt', '投资测算与项目债务'],
  sub:[
    'Reprice any allocation market, test the capital structure and compare the result with the platform base case.',
    '重估任一配置市场、测试资本结构，并将结果与平台基准情景进行比较。',
  ],
  footer:[
    'All scenarios use the same comparison engine as the global cockpit, so a changed input is reflected consistently across returns, debt sizing and exit value.',
    '所有情景均使用与全球总看板相同的比较引擎，因此输入变更会一致反映在回报、债务规模及退出价值中。',
  ],
};

function exitYearSelect(){
  const select = h('select', {
    class:'btn',
    onchange:event => {
      homeState.exitYear = +event.target.value;
      requestRender();
    },
  }, EXIT_YEARS.map(year => {
    const option = h('option', { value:year }, L(['Exit year: ', '退出年份：']) + year);
    if (year === homeState.exitYear) option.selected = true;
    return option;
  }));
  return select;
}

function backButton(){
  return h('a', {
    class:'btn',
    href:'/',
    onclick:event => {
      event.preventDefault();
      navigate('/');
      window.scrollTo(0, 0);
    },
  }, L(['Back to cockpit', '返回总看板']));
}

export function renderInvestmentLabPage(app){
  const list = comparableMarkets();
  app.append(renderHeader({
    hero:true,
    kicker:L(['Scenario workspace', '情景工作区']),
    title:T.title,
    sub:T.sub,
    controls:[exitYearSelect(), backButton()],
  }));
  app.append(marketNav(markets, 'lab'));

  const main = h('main', { class:'investment-lab-page' });
  renderInvestmentLab(main, list, homeState.exitYear);
  app.append(main);
  app.append(renderFooter([T.footer]));
}
