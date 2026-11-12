/* ---------------------------------------------------------------------------
   A step-through explanation: the sequence player.

   A sequence is an ordered list of steps. Each step declares the state of a
   drawing and carries a caption, and each answers one of six questions:

       what is happening in the system?        what service or value follows?
       what constraint creates the problem?    who pays, under which mechanism?
       how does the battery respond?           what limits the value captured?

   The player owns the position and the controls. The caller owns the drawing
   and redraws it when `onStep` is called, so one player serves any scene.

   WHAT IT DOES NOT DO. It never starts by itself: Play advances one step at a
   time on a timer and stops at the last step. There is no animation loop;
   anything that moves is a one-off CSS transition on the drawing's own
   elements, and under reduced motion the steps simply change. It stops when
   the scene scrolls out of view, when the tab is hidden and when the player
   leaves the page. Every step is a complete picture with its caption beside
   it, so a paused scene still explains itself.

   Keys, with focus anywhere in the player: Left and Right step, Home and End
   jump to the first and last step.

   Labels are [en, zh] pairs rendered with L(), as everywhere in the kit.
   --------------------------------------------------------------------------- */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';

/** The question a step answers. A step's `asks` is one of these keys. */
export const QUESTIONS = {
  system:     ['What is happening in the system?', '系统里正在发生什么？'],
  constraint: ['What constraint creates the problem?', '是什么约束造成了问题？'],
  response:   ['How does the battery respond?', '电池如何响应？'],
  value:      ['What service or value does that create?', '这创造了什么服务或价值？'],
  payer:      ['Who pays, and under which mechanism?', '谁付钱，按什么机制付？'],
  limit:      ['What limits the value captured?', '是什么限制了可获得的价值？'],
};

const TEXT = {
  group:    ['Step-through explanation', '分步讲解'],
  previous: ['Previous step', '上一步'],
  next:     ['Next step', '下一步'],
  play:     ['Play', '播放'],
  pause:    ['Pause', '暂停'],
  replay:   ['Replay', '重播'],
  steps:    ['Steps', '步骤'],
  count:    (i, n) => [`Step ${i} of ${n}`, `第${i}步 / 共${n}步`],
};

/** How long Play rests on a step, in milliseconds: long enough to read a caption. */
export const DWELL = 6000;

/**
 * @param {object} options
 * @param {Array<{id:string, asks:string, title:string[], text:string[]}>} options.steps
 * @param {Node}     options.stage    where the caller draws; placed above the controls
 * @param {Function} options.onStep   (step, index) => void, called for every step shown
 * @param {Function} [options.caption] (step) => Node[] extra caption content, after the text
 * @param {number}   [options.start]  the step to open on
 * @param {number}   [options.dwell]  Play's rest on each step, ms
 * @returns {{ node: HTMLElement, show: Function, index: Function, stop: Function }}
 */
export function sequencePlayer({ steps, stage, onStep, caption, start = 0, dwell = DWELL }){
  let index = Math.min(Math.max(start, 0), steps.length - 1);
  let playing = false, timer = null, observer = null;

  const button = (key, onclick) => h('button', { type: 'button', class: 'k-seq-btn', 'data-seq': key, onclick }, L(TEXT[key]));
  const previous = button('previous', () => { stop(); show(index - 1); });
  const next = button('next', () => { stop(); show(index + 1); });
  const play = h('button', { type: 'button', class: 'k-seq-btn k-seq-play', 'data-seq': 'play', 'aria-pressed': 'false', onclick: () => {
    if (playing){ stop(); return; }
    /* From the last step, Play starts again from the first. */
    if (index >= steps.length - 1) show(0);
    playing = true; paint(); wait();
  } });
  const markers = h('ol', { class: 'k-seq-steps', 'aria-label': L(TEXT.steps) }, steps.map((step, i) => h('li', {},
    h('button', { type: 'button', 'data-step': step.id, 'aria-label': L(TEXT.count(i + 1, steps.length)) + ' · ' + L(step.title),
      onclick: () => { stop(); show(i); } }, String(i + 1)))));
  const count = h('span', { class: 'k-seq-count' });
  const words = h('div', { class: 'k-seq-caption', 'aria-live': 'polite' });
  const node = h('div', { class: 'k-seq', role: 'group', 'aria-label': L(TEXT.group) },
    stage,
    h('div', { class: 'k-seq-bar' }, previous, play, next, markers, count),
    words);

  function paint(){
    previous.disabled = index === 0;
    next.disabled = index === steps.length - 1;
    const atEnd = index === steps.length - 1;
    play.textContent = L(playing ? TEXT.pause : atEnd ? TEXT.replay : TEXT.play);
    play.setAttribute('aria-pressed', String(playing));
    node.dataset.playing = String(playing);
    markers.querySelectorAll('button').forEach((b, i) => {
      if (i === index) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.classList.toggle('is-done', i < index);
    });
    count.textContent = L(TEXT.count(index + 1, steps.length));
  }

  function show(i){
    index = Math.min(Math.max(i, 0), steps.length - 1);
    const step = steps[index];
    node.dataset.step = step.id;
    words.replaceChildren(
      h('p', { class: 'k-seq-asks' }, L(QUESTIONS[step.asks] || QUESTIONS.system)),
      h('h5', { class: 'k-seq-title' }, L(step.title)),
      h('p', { class: 'k-seq-text' }, L(step.text)),
      ...(caption ? [].concat(caption(step) || []) : []));
    paint();
    onStep(step, index);
  }

  function wait(){
    clearTimeout(timer);
    timer = setTimeout(() => {
      /* A player whose chapter was replaced lets go of everything it holds. */
      if (!node.isConnected){ stop(); return; }
      if (!playing) return;
      if (index >= steps.length - 1){ stop(); return; }
      show(index + 1);
      if (index >= steps.length - 1) stop(); else wait();
    }, dwell);
  }

  function stop(){
    const was = playing;
    playing = false;
    clearTimeout(timer); timer = null;
    if (was) paint();
  }

  /* Out of sight means stopped: no timer runs for a scene nobody is looking at. */
  const hidden = () => { if (typeof document !== 'undefined' && document.hidden) stop(); if (!node.isConnected) release(); };
  function release(){
    stop();
    if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', hidden);
    observer?.disconnect(); observer = null;
  }
  if (typeof document !== 'undefined' && document.addEventListener) document.addEventListener('visibilitychange', hidden);
  if (typeof IntersectionObserver === 'function'){
    observer = new IntersectionObserver(entries => { if (entries.some(e => !e.isIntersecting)) stop(); });
    observer.observe(node);
  }

  node.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(event.target?.tagName || '')) return;
    const to = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: steps.length - 1 }[event.key];
    if (to === undefined) return;
    event.preventDefault();
    stop(); show(to);
    /* Keep focus on the step now shown, so the keys keep working and a screen
       reader hears where it is. */
    if (node.contains(document.activeElement)) markers.querySelectorAll('button')[index]?.focus({ preventScroll: true });
  });

  show(index);
  return { node, show: (i) => { stop(); show(i); }, index: () => index, stop: release, playing: () => playing };
}
