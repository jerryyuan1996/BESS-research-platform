import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { PUBLIC_CATALOG } from './catalog.js';

export function renderPublicOverview(id, { name, open, researchUrl }){
  const c = PUBLIC_CATALOG[id];
  if (!c) return null;
  const trigger = h('button', { type:'button', class:'ix-button public-story-trigger', onclick:()=>open(trigger) }, L(['Market background & investment logic', '市场背景与投资逻辑']), ' ↗');
  return h('section', { id:'overview', class:'public-overview', 'data-public-market':id, 'data-version':c.version, 'data-status':c.status, 'aria-labelledby':'public-overview-title' },
    h('div', { class:'public-overview-heading' },
      h('p', { class:'ix-eyebrow' }, L(['MARKET BACKGROUND · SHARED RESEARCH', '市场背景 · 公共研究'])),
      h('h2', { id:'public-overview-title' }, L(['Why storage matters here.', '储能为何在这里有价值。']))),
    h('div', { class:'public-overview-grid' },
      h('div', { class:'public-overview-copy' },
        h('p', { class:'public-history' }, L(c.history)),
        h('p', { class:'public-logic' }, L(c.logic)),
        h('p', { class:'public-condition' }, h('strong',{},L(['Key condition · ', '成立条件 · '])), L(c.condition))),
      h('aside', { class:'public-overview-reading' },
        h('p', { class:'public-scope' }, L(name), ' · ', L(['All investors', '所有投资人'])),
        trigger,
        h('p', { class:'public-reading-time' }, L(['About 5 minutes · EN / 简体中文', '约5分钟 · EN / 简体中文'])),
        h('p', { class:'public-status' }, L(['Public logic · review pending', '公共逻辑 · 待确认'])),
        h('p', { class:'public-source-date', 'data-date-kind':'g1' }, L(['Original script G-1 sign-off: ', '原脚本 G-1 签核：']), c.g1ApprovedOn),
        c.evidenceCheckedOn?h('p', { class:'public-source-date', 'data-date-kind':'source-check' }, L(['Source check recorded: ', '来源核对记录：']), c.evidenceCheckedOn):null,
        h('a',{href:researchUrl,class:'ix-text-link'},L(['Sources & full research ↗','来源与完整研究 ↗'])))));
}
