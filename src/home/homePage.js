/* ---------------------------------------------------------------------------
   Home page — the briefing.

   The page opened on a league table of returns, then on a board of sixty
   verdicts. Since the guided-experience plan (2026-10-16) it opens on a
   briefing: the call across the platform for one investor, what changed since
   the reader's last visit, what is coming, the shortlist of plays, what to
   build and the next actions. The board is folded underneath it, and the
   returns are one click away at /returns.

   THIS FILE IS THE SHELL AND NOTHING ELSE. It is in the entry chunk, which
   every reader downloads, so it holds the header, the navigation and a place
   for the briefing. The briefing and the method layer it labels with are
   fetched on demand from briefingHome.js. tests/bundle-budget.test.js holds
   both halves to that.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { renderHeader } from '../components/header.js';
import { marketNav } from '../components/navigation.js';
import { markets } from '../markets/registry.js';

const T = {
  title: ['BESS investment briefing', '储能投资简报'],
  sub: (n) => ([
    `What to do across ${n} markets, for the investor you choose: the call, what changed, what is coming, where to focus, what to build and the next step.`,
    `针对您选择的投资者，覆盖${n}个市场：结论、变化、即将发生的事件、重点方向、应建什么以及下一步。`,
  ]),
  failed: [
    'The briefing could not be loaded. The most likely cause is that the site was updated while this page was open. Reloading fixes that.',
    '简报未能加载。最可能的原因是本页打开期间站点已更新。刷新即可解决。',
  ],
};

function linkButton(href, label, cls = ''){
  return h('a', {
    class: 'btn' + cls,
    href,
    onclick: (event) => {
      event.preventDefault();
      navigate(href);
      window.scrollTo(0, 0);
    },
  }, L(label));
}

function footerLinks(){
  const link = (href, label) => h('a', { href, onclick: (e) => { e.preventDefault(); navigate(href); window.scrollTo(0, 0); } }, L(label));
  return h('div', { class: 'footer' },
    link('/data', ['Data status', '数据状态']), ' · ',
    link('/news', ['Headlines', '新闻']), ' · ',
    link('/investment-lab', ['Investment Lab', '投资测算']), ' · ',
    link('/returns', ['Returns across markets', '跨市场回报对比']));
}

/* The briefing's module, once fetched. Kept so that a re-render — a language or
   lens change — draws at once instead of flashing a skeleton. */
let briefing = null;

export function renderHome(app){
  app.append(renderHeader({
    hero: true,
    kicker: L(['Briefing', '简报']),
    title: T.title,
    sub: T.sub(markets.length),
    controls: [
      linkButton('/returns', ['Returns ↗', '回报对比 ↗']),
      linkButton('/investment-lab', ['Investment Lab ↗', '投资测算 ↗'], ' lab-access-btn'),
    ],
  }));
  app.append(marketNav(markets, 'home'));

  const main = h('main', { class: 'verdict-home briefing' });
  app.append(main);
  app.append(footerLinks());

  if (briefing) return void briefing.renderBriefingHome(main);

  main.append(h('div', { class: 'dash-skeleton', 'aria-busy': 'true', 'aria-label': L(['Loading', '加载中']) },
    h('div', { class: 'sk-bar' }), h('div', { class: 'sk-bar' }), h('div', { class: 'sk-bar' })));
  import('./briefingHome.js').then(m => {
    briefing = m;
    /* The reader may have gone elsewhere while the chunk was in flight; the
       shell they left is detached, and drawing into it would be wasted. */
    if (!main.isConnected) return;
    main.innerHTML = '';
    m.renderBriefingHome(main);
  }).catch(err => {
    console.error('[home] briefing failed to load:', err);
    if (!main.isConnected) return;
    main.innerHTML = '';
    main.append(h('div', { class: 'warnbox' }, L(T.failed)),
      h('div', {}, h('button', { class: 'btn', onclick: () => window.location.reload() },
        L(['Reload the page', '刷新页面']))));
  });
}
