/* Lazy ERCOT story pack, built for G-2 and unreleased: the registry opens it
   only behind ?story=preview. The shared story infrastructure is unchanged.
   Both Chart-ERCOT-AS gates are closed, so ercot-05 and ercot-06 draw the
   approved unscaled Example (story/chart.js). */
import '../../experience/story/kit/index.js';
import './story/ercot-story.css';
import { app } from '../../app/state.js';
import { isStale } from '../../experience/story/contract.js';
import { openStory } from '../../experience/story/shell.js';
import { story } from './story.js';
import { storyMatches, storyValues, storyWithAvailableValues } from './storyBindings.js';
import { scenes, openingThumbnail } from './story/scenes.js';
import { ERCOT_STORY_RECORDS } from './data/storyEvidence.js';

/* Per-value locators load only after the reader opens a source disclosure. */
let locators;
function attachEvidence(dialog) {
  for (const details of dialog.querySelectorAll('[data-shot] .ix-story-sources')) {
    if (details.dataset.locators) continue;
    details.dataset.locators = 'pending';
    details.addEventListener('toggle', async () => {
      if (!details.open || details.querySelector('.ercot-provenance')) return;
      locators ||= import('./story/evidence.js');
      const block = (await locators).locatorBlock(details.closest('[data-shot]')?.getAttribute('data-shot'), ERCOT_STORY_RECORDS);
      if (block && details.isConnected && !details.querySelector('.ercot-provenance')) details.append(block);
    });
  }
}

export function open(ctx) {
  /* The fund lens, the reviewed call, play and duration; anything else keeps
     the research dialog (ercot-build-evidence.md §6). */
  const lens = ctx.lens ?? app.lens ?? 'infraFund';
  if (isStale(story, ctx.row) || !storyMatches(story, ctx.row, lens)) return null;
  const values = storyValues(ctx.row, ctx.ui);
  const dialog = openStory({ ...ctx, rows: [ctx.row], story: storyWithAvailableValues(story, values), values, scenes });
  if (!dialog) return null;
  const decorate = () => {
    const opening = dialog.querySelector('[data-shot="ercot-00"] .ix-shot-text');
    if (opening && !opening.querySelector('.ercot-opening')) opening.querySelector('.ix-story-play')?.after(openingThumbnail());
    attachEvidence(dialog);
  };
  decorate();
  /* A language switch rebuilds the dialog's contents in place. */
  const rebuilt = new MutationObserver(decorate);
  rebuilt.observe(dialog, { childList: true });
  dialog.addEventListener('close', () => rebuilt.disconnect(), { once: true });
  return dialog;
}
