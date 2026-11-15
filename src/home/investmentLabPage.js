import { resourcePage } from '../experience/chrome.js';
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { comparableMarkets } from '../markets/registry.js';
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
  const main = resourcePage(app, {
    page: 'investmentLab', className: 'investment-lab-page',
    title: T.title, sub: T.sub, kicker: ['Scenario workspace', '情景工作区'],
  });
  main.append(backButton());
  renderInvestmentLab(main, list, homeState.exitYear);
  main.append(h('p', { class: 'cap ix-resource-note' }, L(T.footer)));
}
