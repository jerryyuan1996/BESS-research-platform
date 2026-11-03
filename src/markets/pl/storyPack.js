/* ---------------------------------------------------------------------------
   Poland: lazy market configuration (immersive-experience plan, WP-03/WP-10).

   The market page imports this through story/registry.js, so the shell, the
   kit, the records and the content load with this chunk and only when a reader
   asks for the story.

   FOUR GUARDS, each of which sends the reader back to the research dialog:
   another market, another investor's lens, a call or play that has moved since
   G-1, or a duration that disagrees with the one the script was signed at. A
   different lens, call or duration is an editorial decision (rule 11), not
   something this module may paper over.

   TWO CARDS, TWO MARKERS. The shared opening card renders base IRR and margin
   for the selected row and no financial case for the other, which is the
   ownership the decision record requires. What it cannot do is show each
   cohort's own evidence, so this pack places one marker on each card from that
   card's own row and drops the shot-level pill that would otherwise double the
   first card's.

   `released` is not set here. Publishing the story is the G-2 release PR, and
   so is `chart.quantitativeReady`.
   --------------------------------------------------------------------------- */
import '../../experience/story/kit/index.js';
import { h } from '../../utils/dom.js';
import { L } from '../../app/i18n.js';
import { app } from '../../app/state.js';
import { openStory } from '../../experience/story/shell.js';
import { story } from './story.js';
import { reviewed, cardMarkers, storySources, storyWithAvailableValues, storyWithGate, storyRows } from './storyBindings.js';
import { scenes, openingThumbnail } from './story/scenes.js';

/* The opening has no visual column in the shell; the approved thumbnail and
   the two card markers are composed here, beside the card, and survive the
   shell's language redraw. */
function compose(dialog, rows){
  const opening = dialog.querySelector('[data-shot="pl-00"]');
  if (!opening) return;
  const text = opening.querySelector('.ix-shot-text');
  if (text && !text.querySelector('.pl-opening-thumb')) text.append(h('div', { class: 'pl-opening-thumb' }, openingThumbnail()));

  const cards = [...opening.querySelectorAll('.ix-story-play')];
  const markers = cardMarkers(rows);
  if (cards.length !== markers.length) return;
  cards.forEach((card, i) => {
    if (card.querySelector('.pl-card-marker')) return;
    const head = card.querySelector('.ix-story-play-head') || card;
    head.append(h('span', { class: `ix-marker ix-marker-${markers[i].level} pl-card-marker`, 'data-play': markers[i].play || '' }, L(markers[i].label)));
  });
  /* Both cards now carry their own marker, so the shot-level pill would print
     the first card's evidence twice. */
  if (markers.length === 2) opening.querySelector('.ix-story-marker')?.remove();
}

/** Open the Poland story for a market-page row. See openStory() for ctx. */
export function open(ctx){
  const checked = reviewed({ row: ctx.row, lens: ctx.lens || app.lens || 'infraFund', ui: ctx.ui });
  if (!checked) return null;
  const { values, route } = checked;
  /* The drawer's sources are composed here: the record envelope is the single
     place a title, link, locator and check date are stored. */
  const composed = { ...story, sources: storySources() };
  const gated = storyWithGate(composed, undefined);
  const dialog = openStory({
    ...ctx,
    story: storyWithAvailableValues(gated, values),
    values,
    scenes,
  });
  if (!dialog) return null;
  const draw = () => compose(dialog, (ctx.rows && ctx.rows.length ? ctx.rows : [route.grant, route.capacity]).filter(Boolean));
  draw();
  dialog.addEventListener('click', draw);
  return dialog;
}
