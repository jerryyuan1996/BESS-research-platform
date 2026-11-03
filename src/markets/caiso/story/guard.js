import {isStale} from '../../../experience/story/contract.js';
import {story} from '../story.js';
/** An editorial identity change opens research; teaching state is irrelevant. */
export function storyMatches(row,lens){
  return row?.id==='caiso'&&lens===story.reviewedAgainst.lens&&!isStale(story,row);
}
