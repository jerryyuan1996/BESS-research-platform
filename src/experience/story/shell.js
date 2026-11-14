/* ---------------------------------------------------------------------------
   The market-story shell (immersive-experience plan, WP-03).

   Supplies bound material to the unified market reader. Saved original links
   still open a full-height dialog: the play card first, then six chapters of
   shots in ordinary scrolling order. Each shot shows its question, a
   conclusion-first answer, one evidence marker with what would change it,
   its investment meaning, its sources and its visual. The full research
   dialog sits one click deeper; every exit leads to the market page's own
   sections, so the story never shows a financial figure of its own.

   Lifecycle (engineering plan §4): the dialog lives on <body>, holds one
   IntersectionObserver and no timers, and releases both when it closes. The
   reader's place survives a language switch, which redraws in place.

   The address carries the place (WP-04, place.js): opening the story and
   moving to a chapter or shot add history entries, scrolling updates the
   current one, and Back and Forward move the reader without re-rendering the
   page behind. A link with ?view=story opens the story at its place.

   The market page hands over the helpers it formats its own figures with
   (ctx.ui) rather than this module importing them: an import from the page's
   chunk would make Rollup export from it, and the play card must read the
   page's figures exactly as the page does.
   --------------------------------------------------------------------------- */
import { h } from '../../utils/dom.js';
import { L } from '../../app/i18n.js';
import { app, toggleLang, requestRender } from '../../app/state.js';
import { MARKERS, fillPair, isStale, validateStory } from './contract.js';
import { shotsOf, chapterOf, resolvePlace, placeOf, recordPlace, onPlaceChange } from './place.js';

const T = {
  eyebrow: ['MARKET STORY', '市场故事'],
  story: ['Story', '故事'],
  close: ['Close ×', '关闭 ×'],
  closeLabel: ['Close the story', '关闭故事'],
  research: ['Full research ↗', '完整研究 ↗'],
  langLabel: ['Switch to Chinese', '切换到英文'],
  chapters: ['Story chapters', '故事章节'],
  opening: ['Opening', '开篇'],
  previous: ['← Previous', '← 上一节'],
  next: ['Next →', '下一节 →'],
  invest: ['Go to the investment case', '前往投资方案'],
  meaning: ['Investment meaning', '投资含义'],
  change: ['What would change it:', '会改变判断的证据：'],
  sources: ['Sources', '来源'],
  nextAction: ['Next investment action', '下一项投资行动'],
  baseIrr: ['Base all-equity IRR', '基准全股权IRR'],
  pending: ['Drawing in preparation', '示意图制作中'],
  stale: ['This story was last reviewed against the call of ', '本故事最近一次依据以下日期的投资判断复核：'],
  timeline: ['Five moments that shaped the market', '塑造这一市场的五个节点'],
  fields: { constraint: ['Constraint', '约束'], choice: ['Choice', '选择'], remains: ['What remains', '遗留'], effect: ['Effect today', '今日影响'] },
  outlook: ['Outlook', '展望'],
  parts: ['What the asset is made of', '资产的构成'],
  factors: ['What could weaken it', '可能削弱方案的因素'],
  exits: ['Where the numbers live', '数字在哪里'],
};

const pairOf = (pair, values) => L(fillPair(pair, values));
const no = (i) => String(i).padStart(2, '0');

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** A timeline date in both languages: 2006, 2022-06, 2023-10-01 or 2025/2026. */
export function whenLabel(when){
  if (when === 'outlook') return T.outlook;
  let m = /^(\d{4})\/(\d{4})$/.exec(when);
  if (m) return [`${m[1]}–${m[2]}`, `${m[1]}—${m[2]}年`];
  m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(when);
  if (!m) return [when, when];
  const [, y, mo, d] = m;
  if (!mo) return [y, `${y}年`];
  const month = MONTHS[Number(mo) - 1];
  return d ? [`${Number(d)} ${month} ${y}`, `${y}年${Number(mo)}月${Number(d)}日`] : [`${month} ${y}`, `${y}年${Number(mo)}月`];
}

/**
 * ctx: { story, values, row, name, trigger, openResearch, scenes, ui, place }
 *   name          the market's name, an [en, zh] pair or a string
 *   values        token values (the market's storyBindings)
 *   row           the market page's row (call, play, econ, investment, evidence)
 *   trigger       the button that opened the story; focus returns to it
 *   openResearch  (button) => opens the full research dialog
 *   scenes        { [sceneId]: (shot, ctx) => Node } drawn by the market (WP-07)
 *   ui            the market page's own helpers: { CALLS, returnPct,
 *                 marginText, metric, playTitle }
 *   place         { chapter, shot } from the address, when the story was
 *                 opened by a link or by Back; absent when the reader opened it
 * Returns the dialog, or null when the story is invalid (the caller then
 * opens the research dialog instead).
 */
export function openStory(ctx){
  const { story, values, row, trigger } = ctx;
  const check = validateStory(story);
  if (!check.ok){
    // The caller falls back to the research dialog; say why, for whoever looks.
    console.warn(`Story ${story?.marketId} not shown: ${check.problems.slice(0, 3).join('; ')}`);
    return null;
  }

  const shots = shotsOf(story);
  let current = resolvePlace(story, ctx.place);
  let observer = null;

  const dialog = h('dialog', { class: 'ix-dialog ix-story-dialog', 'aria-labelledby': 'ix-story-title' });
  const previousOverflow = document.body.style.overflow;

  /* ---- pieces --------------------------------------------------------- */
  const marker = (shot) => {
    const level = shot.marker.level === 'play' ? row.evidence : shot.marker.level;
    if (!MARKERS[level]) return null;
    return h('p', { class: 'ix-story-marker' },
      h('span', { class: `ix-marker ix-marker-${level}` }, L(MARKERS[level])),
      shot.marker.level === 'play' ? null : [' ', h('span', { class: 'ix-marker-change' }, L(T.change), ' ', pairOf(shot.marker.change, values))]);
  };

  const sourcesOf = (shot) => {
    const ids = [...new Set((shot.claims || []).flatMap(c => story.claims[c]?.sources || []))];
    if (!ids.length) return null;
    return h('details', { class: 'ix-story-sources' },
      h('summary', {}, L(T.sources)),
      h('ul', {}, ids.map(id => h('li', {}, h('a', { href: story.sources[id].url, target: '_blank', rel: 'noopener noreferrer' }, story.sources[id].title)))));
  };

  const goToSection = (anchor) => {
    if(ctx.embed){ctx.onInvest?.(anchor);return;}
    close();
    const target = document.getElementById(anchor);
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.scrollIntoView({ block: 'start' });
    target.focus({ preventScroll: true });
  };

  const playCard = (playRow) => {
    const { CALLS, returnPct, marginText, metric, playTitle } = ctx.ui;
    const i = playRow.investment;
    return h('div', { class: 'ix-story-play' },
      h('div', { class: 'ix-story-play-head' },
        h('span', { class: `ix-tag ${playRow.call}` }, L(CALLS[playRow.call] || CALLS.research)),
        playRow.play ? h('p', { class: 'ix-story-play-title' }, L(playTitle(playRow.play, playRow.stage))) : null),
      i ? metric(T.baseIrr, returnPct(i.holdIRR), marginText(playRow)) : null,
      playRow.play?.action?.text ? h('p', { class: 'ix-story-next' }, h('strong', {}, L(T.nextAction)), ' ', L(playRow.play.action.text)) : null);
  };

  const extras = (shot) => {
    const x = shot.extra || {};
    const out = [];
    if (x.timeline) out.push(h('section', { class: 'ix-story-timeline', 'aria-label': L(T.timeline) },
      h('ol', {}, x.timeline.map(node => h('li', { class: `ix-node ix-node-${node.style}` },
        h('p', { class: 'ix-node-title' }, h('span', { class: 'ix-node-when' }, L(whenLabel(node.when))), ' ', pairOf(node.title, values)),
        h('dl', {}, ['constraint', 'choice', 'remains', 'effect'].filter(k => node[k]).flatMap(k => [h('dt', {}, L(T.fields[k])), h('dd', {}, pairOf(node[k], values))])))))));
    if (x.hotspots) out.push(h('section', { class: 'ix-story-parts', 'aria-label': L(T.parts) },
      h('ul', {}, x.hotspots.map(p => h('li', {}, h('strong', {}, L(p.name)), ' ', L(p.role))))));
    if (x.factors) out.push(h('section', { class: 'ix-story-factors', 'aria-label': L(T.factors) },
      h('ul', {}, x.factors.map((f, i) => h('li', {}, h('strong', {}, L(shot.controls?.[i] || ['', ''])), ' ', pairOf(f.affects, values))))));
    if (x.exits) out.push(h('nav', { class: 'ix-story-exits', 'aria-label': L(T.exits) },
      x.exits.map(e => h('a', { href: `#${e.anchor}`, class: 'ix-button ix-outline', onclick: (ev) => { ev.preventDefault(); goToSection(e.anchor); } }, L(e.label)))));
    return out;
  };

  const visual = (shot) => {
    const make = ctx.scenes?.[shot.scene];
    const node = make ? make(shot, { values, row }) : h('div', { class: 'ix-shot-placeholder', 'data-scene': shot.scene }, L(T.pending));
    return h('figure', { class: 'ix-shot-visual' }, node,
      shot.caption ? h('figcaption', {}, pairOf(shot.caption, values)) : null);
  };

  const shotNode = (shot) => {
    const headingId = `ix-shot-${shot.id}`;
    const opening = shot.id === story.opening.id;
    return h('article', { class: `ix-shot${opening ? ' ix-shot-opening' : ''}`, id: `story-${shot.id}`, 'data-shot': shot.id, 'data-original-chapter':shot.chapter, 'aria-labelledby': headingId },
      h('div', { class: 'ix-shot-text' },
        h('h4', { id: headingId, tabindex: '-1' }, pairOf(shot.question, values)),
        opening ? (ctx.rows || [row]).map(playCard) : null,
        h('p', { class: 'ix-shot-copy' }, pairOf(shot.copy, values)),
        shot.meaning ? h('p', { class: 'ix-shot-meaning' }, h('strong', {}, L(T.meaning)), ' ', pairOf(shot.meaning, values)) : null,
        marker(shot),
        opening ? h('div', { class: 'ix-actions' },
          h('button', { type: 'button', class: 'ix-button', onclick: () => ctx.embed?ctx.onChapter?.('system'):goTo(shots[1].id, true) }, L(ctx.embed?['Review the value chain','回看价值链']:story.opening.controls[0])),
          h('a', { href: '#bankable', class: 'ix-button ix-outline', onclick: (ev) => { ev.preventDefault(); goToSection('bankable'); } }, L(story.opening.controls[1]))) : null,
        extras(shot),
        sourcesOf(shot)),
      opening ? null : visual(shot));
  };

  // The unified reader uses these same bound words, charts, controls and sources
  // in their corresponding chapter. No second dialog or history observer opens.
  if(ctx.embed)return h('div',{class:'unified-story-material','data-material-market':story.marketId},shots.map(shotNode));

  /* ---- navigation ------------------------------------------------------ */
  let body, nav, prevBtn, nextBtn;
  const indexOf = (id) => shots.findIndex(s => s.id === id);

  function mark(id){
    current = id;
    const chapter = chapterOf(shots[indexOf(id)]);
    nav.querySelectorAll('button[data-chapter]').forEach(b => {
      if (b.dataset.chapter === chapter) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    const i = indexOf(id);
    prevBtn.disabled = i <= 0;
    nextBtn.disabled = i >= shots.length - 1;
  }

  /* record: 'push' for the reader's own moves, 'replace' to correct the
     address, 'none' when Back or Forward brought the reader here. */
  function goTo(id, focus, { record = 'push', instant = false } = {}){
    const el = dialog.querySelector(`[data-shot="${id}"]`);
    if (!el) return;
    heading = id;
    const smooth = !instant && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' });
    mark(id);
    if (record !== 'none') recordPlace(placeOf(story, id), record);
    if (focus) el.querySelector('h4')?.focus({ preventScroll: true });
  }

  /* The current shot is the first one, in reading order, that has any part in
     the top 45% of the scroll area. Each callback reports only the shots that
     changed, so every shot's latest state is kept and the choice is made over
     all of them. */
  /* A jump by Previous, Next or a chapter holds the highlight on its target
     until the scroll arrives there, so it does not flicker through the shots
     it passes; any scrolling by the reader releases the hold. */
  let heading = null;
  const release = () => { heading = null; };

  function watch(){
    observer?.disconnect();
    if (typeof IntersectionObserver !== 'function') return;
    const inView = new Set();
    observer = new IntersectionObserver(entries => {
      for (const e of entries){
        // a shot whose edge only touches the area is not in it
        if (e.isIntersecting && e.intersectionRect.height > 0) inView.add(e.target.dataset.shot);
        else inView.delete(e.target.dataset.shot);
      }
      const first = shots.find(s => inView.has(s.id));
      if (!first) return;
      if (heading){ if (first.id === heading) heading = null; else return; }
      mark(first.id);
      recordPlace(placeOf(story, first.id), 'replace');
    }, { root: body, rootMargin: '0px 0px -55% 0px', threshold: [0, 0.01] });
    body.querySelectorAll('[data-shot]').forEach(el => observer.observe(el));
    for (const type of ['wheel', 'touchstart', 'keydown']) body.addEventListener(type, release, { passive: true });
  }

  /* ---- building and rebuilding --------------------------------------- */
  function build(){
    const stale = isStale(story, row);
    const langBtn = h('button', { class: 'ix-language', type: 'button', 'aria-label': L(T.langLabel), onclick: switchLanguage }, app.lang === 'zh' ? 'EN' : '中文');
    const researchBtn = h('button', { type: 'button', class: 'ix-button ix-outline ix-small', onclick: () => ctx.openResearch?.(researchBtn) }, L(T.research));
    const closeBtn = h('button', { type: 'button', class: 'ix-button ix-outline ix-small ix-story-close', 'aria-label': L(T.closeLabel), onclick: () => close() }, L(T.close));
    const head = h('header', { class: 'ix-story-head' },
      h('div', {},
        h('p', { class: 'ix-eyebrow' }, L(T.eyebrow)),
        h('h2', { id: 'ix-story-title' }, `${L(ctx.name)} · ${L(T.story)}`),
        h('p', { class: 'ix-story-boundary' }, L(story.systemBoundary)),
        stale ? h('p', { class: 'ix-story-stale', role: 'status' }, L(T.stale), story.reviewedAgainst.on) : null),
      h('div', { class: 'ix-story-tools' }, langBtn, researchBtn, closeBtn));

    nav = h('nav', { class: 'ix-story-nav', 'aria-label': L(T.chapters) },
      h('ol', {}, [['opening', T.opening], ...story.chapters.map(c => [c.id, c.title])].map(([id, title], i) =>
        h('li', {}, h('button', { type: 'button', 'data-chapter': id, onclick: () => {
          const first = id === 'opening' ? story.opening : story.chapters.find(c => c.id === id).shots[0];
          goTo(first.id, true);
        } }, h('span', { class: 'ix-story-no' }, no(i)), ' ', L(title))))));

    body = h('div', { class: 'ix-story-body', tabindex: '-1' },
      h('section', { class: 'ix-story-chapter', 'data-chapter': 'opening' }, shotNode(story.opening)),
      story.chapters.map((c, i) => h('section', { class: 'ix-story-chapter', 'data-chapter': c.id, 'aria-labelledby': `ix-chapter-${c.id}` },
        h('h3', { id: `ix-chapter-${c.id}`, class: 'ix-story-chapter-title' }, h('span', { class: 'ix-story-no' }, no(i + 1)), ' ', L(c.title)),
        c.shots.map(shotNode))));

    prevBtn = h('button', { type: 'button', class: 'ix-button ix-outline ix-small', onclick: () => goTo(shots[Math.max(0, indexOf(current) - 1)].id, true) }, L(T.previous));
    nextBtn = h('button', { type: 'button', class: 'ix-button ix-small', onclick: () => goTo(shots[Math.min(shots.length - 1, indexOf(current) + 1)].id, true) }, L(T.next));
    const foot = h('footer', { class: 'ix-story-foot' },
      h('div', { class: 'ix-story-step' }, prevBtn, nextBtn),
      h('a', { href: '#bankable', class: 'ix-text-link', onclick: (ev) => { ev.preventDefault(); goToSection('bankable'); } }, L(T.invest)));

    dialog.replaceChildren(head, nav, body, foot);
    mark(current);
    watch();
    return { langBtn, closeBtn };
  }

  function switchLanguage(){
    const keep = current;
    toggleLang();
    requestRender();                  // the page behind follows the language
    const { langBtn } = build();
    dialog.querySelector(`[data-shot="${keep}"]`)?.scrollIntoView({ block: 'start' });
    mark(keep);
    langBtn.focus();
  }

  /* ---- open and close ------------------------------------------------- */
  let closed = false;
  let stopListening = null;
  /* fromHistory: Back or Forward left the story, so the address already says
     so; otherwise closing adds an entry without the story, and Back reopens it
     where the reader was. */
  function close({ fromHistory = false } = {}){
    if (closed) return;
    closed = true;
    stopListening?.();
    observer?.disconnect();
    observer = null;
    if (!fromHistory) recordPlace(null, 'push');
    if (dialog.open) dialog.close();
    dialog.remove();
    document.body.style.overflow = previousOverflow;
    // the page may have re-rendered behind the story (language switch)
    const back = trigger?.isConnected ? trigger : document.querySelector('.public-story-trigger');
    back?.focus({ preventScroll: true });
  }
  dialog.addEventListener('close', () => close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close();
  });

  const { closeBtn } = build();
  document.body.append(dialog);
  document.body.style.overflow = 'hidden';
  dialog.showModal();
  if (ctx.place && current !== shots[0].id) goTo(current, true, { record: 'replace', instant: true });
  else {
    recordPlace(placeOf(story, current), ctx.place ? 'replace' : 'push');
    closeBtn.focus();
  }
  stopListening = onPlaceChange((route, { samePage }) => {
    if (!samePage || !route.story) return close({ fromHistory: true });
    const id = resolvePlace(story, route.story);
    goTo(id, true, { record: 'replace', instant: true });
  });
  return dialog;
}
