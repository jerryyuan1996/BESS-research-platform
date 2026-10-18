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
  title:['Acquisition price and return target', '收购价格与目标回报'],
  sub:[
    'Estimate what you can pay for a project at the return required by your investor type.',
    '按投资者类型和项目阶段，测算达到目标回报时的收购价格上限。',
  ],
  footer:[
    'The acquisition ceiling and its return target use the same project inputs. Operating acquisitions are valued for long-term ownership.',
    '收购上限及对应目标回报使用同一组项目资料；运营资产按长期持有测算。',
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
    controls:[backButton()],
  }));
  app.append(marketNav(markets, 'lab'));

  const main = h('main', { class:'investment-lab-page' });
  renderInvestmentLab(main, list, homeState.exitYear);
  app.append(main);
  app.append(renderFooter([T.footer]));
}
