/* Lazy, unreleased configuration; the shared story infrastructure is unchanged. */
import '../../experience/story/kit/index.js';
import './story/pjm-story.css';
import {h} from '../../utils/dom.js';
import {app} from '../../app/state.js';
import {isStale} from '../../experience/story/contract.js';
import {openStory} from '../../experience/story/shell.js';
import {story} from './story.js';
import {storyMatches,storyValues,storyWithAvailableValues} from './storyBindings.js';
import {scenes,gridThumbnail} from './story/scenes.js';
import {attachEvidence} from './story/evidence.js';

export function open(ctx){
  if(isStale(story,ctx.row)||!storyMatches(story,ctx.row,app.lens||'infraFund'))return null;
  const values=storyValues(ctx.row,ctx.ui);
  const dialog=openStory({...ctx,story:storyWithAvailableValues(story,values),values,scenes});
  if(!dialog)return null;
  attachEvidence(dialog);
  const thumbnail=()=>{
    const opening=dialog.querySelector('[data-shot="pjm-00"] .ix-shot-text');
    if(opening&&!opening.querySelector('.pjm-opening'))opening.append(h('div',{class:'pjm-opening'},gridThumbnail()));
  };
  thumbnail();dialog.addEventListener('click',thumbnail);return dialog;
}
