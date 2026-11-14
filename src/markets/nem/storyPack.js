/* Lazy NEM story pack, released at G-2 (6 November 2026). The shared story infrastructure is unchanged.
   The rights switch is on (analyst, 5 November 2026): scenes draw AEMO's
   observed layers for nem-05 to nem-07 (data/storyEvidenceValues.js). */
import '../../experience/story/kit/index.js';
import './story/nem-story.css';
import { h } from '../../utils/dom.js';
import { app } from '../../app/state.js';
import { isStale } from '../../experience/story/contract.js';
import { openStory } from '../../experience/story/shell.js';
import { story } from './story.js';
import { storyMatches, storyValues, storyWithAvailableValues } from './storyBindings.js';
import { scenes, openingThumbnail } from './story/scenes.js';
import { attachEvidence } from './story/evidence.js';

/* "Compare with WA" leaves the NEM page for the side-by-side returns view;
   the shell's exits only scroll to a section of this page. */
function compareLink(dialog) {
  const link = dialog.querySelector('.ix-story-exits a[href="#compare-wa"]');
  if (!link) return;
  const label = link.textContent;
  link.replaceWith(h('a', { href: '/returns?compare=nem,wa', class: 'ix-button ix-outline' }, label));
}

export function open(ctx) {
  if (isStale(story, ctx.row) || !storyMatches(story, ctx.row, ctx.lens || app.lens || 'infraFund')) return null;
  const values = storyValues(ctx.row, ctx.ui);
  const dialog = openStory({ ...ctx, story: storyWithAvailableValues(story, values), values, scenes });
  if (!dialog) return null;
  attachEvidence(dialog);
  const decorate = () => {
    const opening = dialog.querySelector('[data-shot="nem-00"] .ix-shot-text');
    if (opening && !opening.querySelector('.nem-opening')) opening.append(openingThumbnail());
    compareLink(dialog);
  };
  decorate();
  if(ctx.embed)return dialog;
  dialog.addEventListener('click', decorate);
  /* A language switch rebuilds the dialog's contents in place. */
  const rebuilt = new MutationObserver(decorate);
  rebuilt.observe(dialog, { childList: true });
  dialog.addEventListener('close', () => rebuilt.disconnect(), { once: true });
  return dialog;
}
