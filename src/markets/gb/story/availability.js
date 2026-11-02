import {isStale} from '../../../experience/story/contract.js';
import {story} from '../story.js';
import {storyWithAvailableValues} from '../storyBindings.js';
export function canOpen(row,lens){
  const reviewed=story.reviewedAgainst;
  return row?.id===story.marketId&&lens===reviewed.lens&&!isStale(story,row)&&row.stage===reviewed.stage&&row.play.route===reviewed.route;
}

export function reviewedContent(values){
  const available=storyWithAvailableValues(story,values),last=available.chapters.at(-1).shots[0];
  last.extra={...last.extra,exits:['bankable','revenue','execution','downside'].map((anchor,i)=>({anchor,label:last.controls[i+4]}))};
  return available;
}
