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

/* The unified reader needs a readable status when the approved Watch has
   retired the earlier investment explanation. These notices contain no old
   story content or figures; the legacy story still returns to research. */
function reviewMaterial(ctx){
  return h('div', { class: 'unified-story-material', 'data-material-market': 'pl' },
    ['opening', 'origins', 'choices', 'tensions', 'payment'].map(chapter =>
      h('article', { class: 'ix-shot ix-shot-opening', 'data-shot': `pl-review-${chapter}`, 'data-original-chapter': chapter, 'data-review-required': 'true' },
        h('h4', {}, L(['Detailed reference awaiting review', '详细参考内容待复核'])),
        h('div', { class: 'ix-shot-copy' },
          h('p', {}, L(['The earlier infrastructure-fund grant explanation needs review. Read the selected investment case or current market research.', '旧版基础设施基金补助方案的解释待复核。请查阅当前所选投资方案或完整市场研究。'])),
          h('button', { type: 'button', class: 'ix-button ix-outline', onclick: () => ctx.onChapter('research') },
            L(['Read current research', '阅读当前完整研究']))))));
}

/** Open the Poland story for a market-page row. See openStory() for ctx. */
export function open(ctx){
  const lens = ctx.lens || app.lens || 'infraFund';
  const checked = reviewed({ row: ctx.row, lens, ui: ctx.ui });
  if (!checked) {
    if (ctx.embed && ctx.row?.id === 'pl' && lens === story.reviewedAgainst.lens
        && ctx.row.call === 'wait' && ctx.row.play?.id === story.playRef
        && ctx.row.play.hours === story.reviewedAgainst.hours && typeof ctx.onChapter === 'function') {
      return reviewMaterial(ctx);
    }
    return null;
  }
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
