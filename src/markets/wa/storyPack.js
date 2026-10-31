/* ---------------------------------------------------------------------------
   The Western Australia story chunk's entry: content, bindings, the kit and
   its stylesheet, and the shell, fetched together when a reader opens the
   story from the market page (src/experience/story/registry.js).
   --------------------------------------------------------------------------- */
import '../../experience/story/kit/index.js';
import { openStory } from '../../experience/story/shell.js';
import { story } from './story.js';
import { storyValues } from './storyBindings.js';
import { scenes } from './story/scenes.js';

/** Open the WA story for a market-page row. See openStory() for ctx. */
export function open(ctx){
  return openStory({ ...ctx, story, values: storyValues(ctx.row), scenes });
}
