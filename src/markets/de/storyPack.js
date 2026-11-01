/* Germany's lazy story pack: the existing shell, kit and navigation unchanged. */
import '../../experience/story/kit/index.js';
import './story/story.css';
import { h } from '../../utils/dom.js';
import { isStale } from '../../experience/story/contract.js';
import { openStory } from '../../experience/story/shell.js';
import { story } from './story.js';
import { storyBindings } from './storyBindings.js';
import { scenes } from './story/scenes.js';

export function open(ctx) {
  if (isStale(story, ctx.row)) return null;
  const bindings = storyBindings(ctx.row, { ...ctx.ui, result: ctx.result });
  if (bindings.duration.preferred !== story.reviewedAgainst.hours) return null;
  const drawing = Object.fromEntries(Object.entries(scenes).map(([id, make]) => [id, (shot, base) => make(shot, { ...base, ...bindings })]));
  const dialog = openStory({ ...ctx, story, values: bindings.values, scenes: drawing });
  if (!dialog) return null;
  // The shared shell leaves the conclusion visual empty. Add this script's
  // decorative thumbnail locally, including after its language redraw.
  const thumbnail = () => {
    const opening = dialog.querySelector('[data-shot=de-00] .ix-shot-text');
    if (!opening || opening.querySelector('.de-opening-thumb')) return;
    const svg = scenes.thumbnail(story.opening, bindings);
    svg.setAttribute('aria-hidden', 'true');
    opening.append(h('div', { class: 'de-opening-thumb' }, svg));
  };
  thumbnail();
  dialog.addEventListener('click', thumbnail);
  return dialog;
}
