import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { playTitle } from '../governance/playTitle.js';
export { storyRowsFor,investmentRowsFor } from './storyRows.js';

/** Loaded only by a market with multiple distinct opportunities. */
export function renderPlayChoices(rows, selected, tag, onSelect = null) {
  if (onSelect) return h('section', {id:'investment-options',class:'ix-panel ic-play-selector',
    'aria-label':L(['Choose an investment case','选择投资方案'])},
    h('div',{class:'ic-play-heading'},h('h2',{},L(['Independent investment opportunities','独立投资机会'])),
      h('p',{},L(['Select a case to update returns and financing below.','点击方案，下方回报与融资同步切换。']))),
    h('div',{class:'ic-play-grid',role:'group','aria-label':L(['Investment case','投资方案'])},rows.map(row=>{
      const active=row.play.id===selected.play.id&&(!row.supplyCase||row.supplyCase===selected.investment?.usSupply);
      return h('button',{type:'button',class:'ic-play-option','data-play':row.play.id,...(row.supplyCase?{'data-supply':row.supplyCase}:{}),'aria-pressed':String(active),onclick:()=>onSelect(row)},
        h('span',{class:'ic-play-top'},tag(row),h('span',{class:'ic-play-state'},L(active?['✓ Selected','✓ 当前方案']:['Select →','选择 →']))),
        h('strong',{},L(playTitle(row.play,row.stage))),
        row.caseLabel?h('span',{class:'ic-play-supply'},L(row.caseLabel)):null,
        row.play.why?h('span',{class:'ic-play-description'},L(row.play.why)):null);
    })));
  return h('section', { class: 'ix-panel ix-play-choices', 'aria-label': L(['Two separate opportunities', '两类独立投资机会']) },
    h('h2', {}, L(['Two separate opportunities', '两类独立投资机会'])),
    h('div', { class: 'ix-dialog-grid', style: '--compare-count:2' }, rows.map(row => h('article', { class: 'ix-story-play', 'data-play': row.play.id },
      tag(row), h('h3', {}, L(playTitle(row.play, row.stage))),
      row.play.why ? h('p', {}, L(row.play.why)) : null,
      row.play.action?.text ? h('p', {}, L(row.play.action.text)) : null))),
    h('p', { class: 'ix-basis-note' }, L(['Financial case below: ', '下方财务测算对应：']), L(playTitle(selected.play, selected.stage))));
}
