/* Ireland's lazy story configuration (WP-07 wiring).

   The shell, navigator, marker, kit and contract are unchanged: this module
   supplies the content, the scenes, the reviewed tuple and the opening
   drawing, and nothing else. `released` stays false — the G-2 release PR sets
   it — so the market page keeps the research dialog until then. */
import '../../experience/story/kit/index.js';
import './story/ie-story.css';
import { h } from '../../utils/dom.js';
import { app } from '../../app/state.js';
import { isStale } from '../../experience/story/contract.js';
import { openStory } from '../../experience/story/shell.js';
import { story } from './story.js';
import { storyValues, storyWithAvailableValues, storyMatches } from './storyBindings.js';
import { scenes, islandThumbnail } from './story/scenes.js';

/**
 * Opens the story, or returns null so the caller opens the research dialog.
 *
 * Rule 11 at the build head: a changed call, play or duration, or a reader
 * looking at another investor's lens, returns to research. The shared
 * isStale() covers the first three; the lens is this pack's own check,
 * because the market page resolves an unset lens to the infrastructure fund.
 */
export function open(ctx) {
  const lens = app.lens || 'infraFund';
  if (isStale(story, ctx.row) || !storyMatches(story, ctx.row, lens)) return null;
  const values = storyValues(ctx.row, ctx.ui);
  const dialog = openStory({ ...ctx, story: storyWithAvailableValues(story, values), values, scenes });
  if (!dialog) return null;

  /* The opening has no visual of its own in the shell; the approved thumbnail
     is appended here and survives the shell's language redraw. */
  const thumbnail = () => {
    const opening = dialog.querySelector('[data-shot="ie-00"] .ix-shot-text');
    if (!opening || opening.querySelector('.ie-opening')) return;
    opening.append(h('div', { class: 'ie-opening' }, islandThumbnail()));
  };
  thumbnail();
  dialog.addEventListener('click', thumbnail);
  return dialog;
}
