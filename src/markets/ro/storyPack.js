/* ---------------------------------------------------------------------------
   Romania: lazy market configuration (immersive-experience plan, WP-03/WP-10).

   The market page imports this through story/registry.js, so the shell, the
   kit, the records and the content load with this chunk and only when a reader
   asks for the story.

   Three guards, each of which sends the reader to the research dialog instead:
   the row is not Romania, the story is stale against the live call/play/duration,
   or the row's duration disagrees with the one the script was signed off at. A
   different lens, call or duration is an editorial decision (rule 11), not
   something this module may paper over.

   `released` is not set here. Publishing the story is the G-2 release PR.
   --------------------------------------------------------------------------- */
import '../../experience/story/kit/index.js';
import { h } from '../../utils/dom.js';
import { s } from '../../experience/story/kit/svg.js';
import { isStale } from '../../experience/story/contract.js';
import { openStory } from '../../experience/story/shell.js';
import { app } from '../../app/state.js';
import { story } from './story.js';
import { storyValues, storyWithAvailableValues, storySources } from './storyBindings.js';
import { scenes } from './story/scenes.js';

/* The opening's thumbnail: the shell gives the opening no visual column, so the
   small schematic is added beside the card after each build, as the German and
   Finnish packs do. */
function thumbnail(dialog){
  const opening = dialog.querySelector('[data-shot="ro-00"] .ix-shot-text');
  if (!opening || opening.querySelector('.ro-opening-thumb')) return;
  const map = s('svg', { viewBox: '0 0 220 130', 'aria-hidden': 'true', style: 'width:180px;max-width:100%;' },
    s('path', { d: 'M40,26 L108,12 L164,26 L196,54 L176,86 L120,100 L64,92 L34,66 Z', fill: '#e6e9dc', stroke: '#193c32', 'stroke-width': 1.2 }),
    s('path', { d: 'M52,74 Q92,38 138,52 Q158,70 146,92', fill: 'none', stroke: '#9dae99', 'stroke-width': 1.6 }),
    s('path', { d: 'M34,66 L64,92 L120,100 L176,86', fill: 'none', stroke: '#7b8c9e', 'stroke-width': 2 }));
  opening.append(h('div', { class: 'ro-opening-thumb' }, map));
}

/** Open the Romania story for a market-page row. See openStory() for ctx. */
export function open(ctx){
  if (ctx?.row?.id !== 'ro') return null;
  if (app.lens && app.lens !== 'infraFund') return null;
  if (isStale(story, ctx.row)) return null;
  const values = storyValues(ctx.row, ctx.ui);
  if (Number(values.playDuration) !== story.reviewedAgainst.hours) return null;
  /* The drawer's sources are composed here: the record envelope is the single
     place a title, link, locator and check date are stored. */
  const composed = { ...story, sources: storySources() };
  const dialog = openStory({ ...ctx, story: storyWithAvailableValues(composed, values), values, scenes });
  if (!dialog) return null;
  thumbnail(dialog);
  dialog.addEventListener('click', () => thumbnail(dialog));
  return dialog;
}
