/* Lazy market configuration. Shared shell, navigator and marker stay unchanged. */
import '../../experience/story/kit/index.js';
import {h} from '../../utils/dom.js';
import {s} from '../../experience/story/kit/svg.js';
import {isStale} from '../../experience/story/contract.js';
import {openStory} from '../../experience/story/shell.js';
import {story} from './story.js';
import {storyValues,storyWithAvailableValues} from './storyBindings.js';
import {scenes} from './story/scenes.js';
import {FI_NORDIC_MAP} from './story/geo.js';

export function open(ctx){
  if(isStale(story,ctx.row))return null;
  const values=storyValues(ctx.row,ctx.ui);
  if(Number(values.playDuration)!==story.reviewedAgainst.hours)return null;
  const dialog=openStory({...ctx,story:storyWithAvailableValues(story,values),values,scenes});
  if(!dialog)return null;
  // The approved opening asks for a small, decorative Nordic thumbnail.
  // Add it locally after the shell's language redraw, as in the German pack.
  const thumbnail=()=>{
    const opening=dialog.querySelector('[data-shot="fi-00"] .ix-shot-text');
    if(!opening||opening.querySelector('.fi-opening-thumb'))return;
    const map=s('svg',{viewBox:'0 0 '+FI_NORDIC_MAP.viewBox.join(' '),'aria-hidden':'true',style:'width:200px;max-width:100%;'},
      FI_NORDIC_MAP.countries.map(c=>s('polygon',{points:c.polygon,fill:c.key==='finland'?'#b8cda4':'#e6e9dc',stroke:'#224e40'})),
      FI_NORDIC_MAP.ac.map(([a,b])=>s('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:'#224e40'})));
    opening.append(h('div',{class:'fi-opening-thumb'},map));
  };
  thumbnail();dialog.addEventListener('click',thumbnail);
  return dialog;
}
