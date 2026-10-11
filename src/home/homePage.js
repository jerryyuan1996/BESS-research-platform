/* ---------------------------------------------------------------------------
   Home page — where should this investor enter?

   The page used to open on a league table of returns. It now opens on
   verdicts: for each kind of investor, which markets to enter, what shuts it
   out of the others and what would change the call (plan section 6.1). The
   returns it used to show are one click away, at /returns, unchanged.

   THIS FILE IS THE SHELL AND NOTHING ELSE. It is in the entry chunk, which
   every reader downloads, so it holds the header, the navigation and a place
   for the board. The board itself needs the whole method layer — the anchors,
   the four investors' tables, the view store and the ledgers — and that is
   fetched on demand from verdictHome.js, the way the Investment Case tab
   fetches it. tests/bundle-budget.test.js holds both halves to that.

   "Screening only" is said once, here in the header, and not on every row.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { renderHeader } from '../components/header.js';
import { marketNav } from '../components/navigation.js';
import { renderFooter } from '../components/footer.js';
import { chip } from '../components/chip.js';
import { markets } from '../markets/registry.js';

const T = {
  title: ['Global BESS Investment Cockpit', '全球储能投资总看板'],
  sub: (n) => ([
    'Where should each kind of investor enter? A verdict for every graded market, the barrier that shuts an investor out, and the event that would change the call, across ' + n + ' allocation markets.',
    '各类投资者该进入哪个市场？对每个已评级市场给出结论，并说明把投资者挡在门外的门槛，以及会改变结论的事件；覆盖' + n + '个配置市场。',
  ]),
  footer: [
    'A verdict is the analyst\'s own call for one kind of investor. The score beside it only checks the call and never sets it. Verdicts support, and do not replace, independent investment, legal, technical and financial analysis.',
    '每个结论都是分析师针对某一类投资者作出的判断。旁边的评分只用于校验，从不决定结论。这些结论用于辅助而非替代独立的投资、法律、技术及财务分析。',
  ],
  failed: [
    'The verdict board could not be loaded. The most likely cause is that the site was updated while this page was open. Reloading fixes that.',
    '投资结论看板未能加载。最可能的原因是本页打开期间站点已更新。刷新即可解决。',
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

/* The board's module, once fetched. Kept so that a re-render — a language or
   lens change — draws at once instead of flashing a skeleton. */
let board = null;

export function renderHome(app){
  app.append(renderHeader({
    hero: true,
    kicker: L(['Verdicts by investor', '按投资者类型给出的结论']),
    title: T.title,
    sub: T.sub(markets.length),
    meta: [
      chip('serious', ['Release Gate: screening only — not approved for underwriting',
                       '发布门槛：仅供筛选 — 未获承销批准']),
    ],
    controls: [
      linkButton('/returns', ['Returns ↗', '回报对比 ↗']),
      linkButton('/investment-lab', ['Investment Lab ↗', '投资测算 ↗'], ' lab-access-btn'),
    ],
  }));
  app.append(marketNav(markets, 'home'));

  const main = h('main', { class: 'verdict-home' });
  app.append(main);
  app.append(renderFooter([T.footer]));

  if (board) return void board.renderVerdictHome(main);

  main.append(h('div', { class: 'dash-skeleton', 'aria-busy': 'true', 'aria-label': L(['Loading', '加载中']) },
    h('div', { class: 'sk-bar' }), h('div', { class: 'sk-bar' }), h('div', { class: 'sk-bar' })));
  import('./verdictHome.js').then(m => {
    board = m;
    /* The reader may have gone elsewhere while the chunk was in flight; the
       shell they left is detached, and drawing into it would be wasted. */
    if (!main.isConnected) return;
    main.innerHTML = '';
    m.renderVerdictHome(main);
  }).catch(err => {
    console.error('[home] verdict board failed to load:', err);
    if (!main.isConnected) return;
    main.innerHTML = '';
    main.append(h('div', { class: 'warnbox' }, L(T.failed)),
      h('div', {}, h('button', { class: 'btn', onclick: () => window.location.reload() },
        L(['Reload the page', '刷新页面']))));
  });
}
