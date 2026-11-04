/* Lazy configuration only. G-2, in a separate PR, owns release approval. */
import '../../experience/story/kit/index.js';
import './story/style.css';
import {openStory} from '../../experience/story/shell.js';
import {app} from '../../app/state.js';
import {story} from './story.js';
import {storyValues} from './storyBindings.js';
import {storyMatches} from './story/guard.js';
import {CAISO_TEACHING} from './story/teaching.js';
import {scenes} from './story/scenes.js';

const exits=[
  {anchor:'bankable',label:['Bankable case','可融资方案']},
  {anchor:'revenue',label:['Revenue','收益拆解']},
  {anchor:'execution',label:['Execution','执行步骤']},
  {anchor:'downside',label:['Downside','下行情景']},
];
const composed={...story,chapters:story.chapters.map(chapter=>({...chapter,shots:chapter.shots.map(shot=>shot.id==='caiso-13'?{...shot,extra:{...shot.extra,exits}}:shot)}))};

export function open(ctx){
  if(!storyMatches(ctx?.row,app.lens))return null;
  const values=storyValues(ctx.row,ctx.ui,CAISO_TEACHING(ctx.row));
  if(story.tokens.some(token=>values[token]==null||values[token]===''))return null;
  /* One selected market-page row; the opening map is omitted by the analyst's
     explicit approval. All other visuals use the existing shell API. */
  return openStory({...ctx,rows:[ctx.row],story:composed,values,scenes});
}
