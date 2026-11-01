/* Germany's native evidence expansions. The existing deep research tab stays
 * on its shared block engine; these belong only to the lazy market story. */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { story } from '../story.js';
import { fillPair } from '../../../experience/story/contract.js';

export function eventDetails(shot, values, titles) {
  return h('div', { class: 'de-event-details' },
    h('details', {}, h('summary', {}, L(titles.event)), h('p', {}, L(fillPair(shot.copy, values))),
      h('ul', {}, [...new Set(shot.claims.flatMap(id => story.claims[id].sources))].map(id => h('li', {}, h('a', { href: story.sources[id].url, target: '_blank', rel: 'noopener noreferrer' }, story.sources[id].title))))),
    h('details', {}, h('summary', {}, L(titles.meaning)), h('p', {}, L(fillPair(shot.meaning, values)))));
}
