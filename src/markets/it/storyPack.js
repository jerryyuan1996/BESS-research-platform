/* G-2 preview only. All application-wide story behaviour stays on the kit. */
import '../../experience/story/kit/index.js';
import './story/story.css';
import {h} from '../../utils/dom.js';
import {L} from '../../app/i18n.js';
import {openStory} from '../../experience/story/shell.js';
import {renderPlayChoices} from '../../experience/playChoices.js';
import {story} from './story.js';
import {storyValues,storyWithAvailableValues,reviewedRowsMatch} from './storyBindings.js';
import {scenes,italyMap} from './story/scenes.js';

export function open(ctx){
  if((ctx.rows||[]).length!==2)return null;
  if(!reviewedRowsMatch(story,ctx.row,ctx.rows||[ctx.row],ctx.lens))return null;
  const values=storyValues(ctx.row,ctx.ui);
  const dialog=openStory({...ctx,story:storyWithAvailableValues(story,values),values,scenes});
  if(!dialog)return null;
  const enhance=()=>{
    const opening=dialog.querySelector('[data-shot="it-00"] .ix-shot-text');
    if(!opening||opening.querySelector('.it-opening-choices'))return;
    const cards=[...opening.children].filter(n=>n.classList.contains('ix-story-play'));
    const choices=renderPlayChoices(ctx.rows,ctx.row,row=>h('span',{class:'ix-tag '+row.call},L(ctx.ui.CALLS[row.call])));
    choices.classList.add('it-opening-choices');
    if(cards[0])cards[0].before(choices);else opening.append(choices);
    cards.forEach(n=>n.remove());
    opening.append(h('div',{class:'it-opening-thumb','aria-hidden':'true'},italyMap(story.opening,values)));
  };
  enhance();dialog.addEventListener('click',enhance);
  return dialog;
}
