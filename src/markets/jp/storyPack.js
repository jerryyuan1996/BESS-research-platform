/* One lazy, unreleased pack for three independently reviewed allocation rows.
   G-1: japan-storyboard.md §12, signed 5 November 2026. */
import '../../experience/story/kit/index.js';
import './story/jp-story.css';
import {app} from '../../app/state.js';
import {openStory} from '../../experience/story/shell.js';
import {REGION_IDS} from './story.js';
import {reviewed,storySources,storyWithAvailableValues} from './storyBindings.js';
import {scenes,openingThumbnail} from './story/scenes.js';
import {attachEvidence} from './story/ui.js';

export function open(ctx){
  if(!REGION_IDS[ctx.row?.id])return null;
  const checked=reviewed({row:ctx.row,lens:ctx.lens||app.lens||'infraFund',ui:ctx.ui});
  if(!checked)return null;
  const {values}=checked;
  const story=storyWithAvailableValues({...checked.story,sources:storySources(ctx.row)},values);
  const dialog=openStory({...ctx,rows:[ctx.row],story,values,scenes});
  if(!dialog)return null;
  dialog.classList.add('jp-story');
  attachEvidence(dialog,story,ctx.row);
  const compose=()=>{
    const opening=dialog.querySelector('[data-shot="jp-00"] .ix-shot-text');
    if(!opening||opening.querySelector('.jp-opening'))return;
    opening.classList.add('jp-opening-grid');
    opening.append(openingThumbnail({row:ctx.row,values}));
  };
  compose();dialog.addEventListener('click',compose);
  return dialog;
}
