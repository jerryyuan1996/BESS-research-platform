import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { markets } from '../markets/registry.js';
import { renderHeader } from '../components/header.js';
import { marketNav } from '../components/navigation.js';
import { renderFooter } from '../components/footer.js';

const DATA_URL = '/data/public/industry-news.json';
const CATEGORIES = [
  ['all', ['All', '全部']],
  ['capital', ['Capital & M&A', '资本与并购']],
  ['policy', ['Policy & trade', '政策与贸易']],
  ['grid', ['Grid & markets', '电网与市场']],
  ['technology', ['Technology', '储能技术']],
];
const investmentRank = item => {
  const title = item.title || '';
  let score = 0;
  if (/\b(BESS|battery|energy storage|grid-forming|capacity market|interconnection)\b/i.test(title)) score += 6;
  if (item.category === 'capital' || item.category === 'policy') score += 3;
  if (item.category === 'technology') score += 2;
  if (/\b(M&A|merger|acquisition|financing|funding|tariff|ban|auction|tender|revenue|spread)\b/i.test(title)) score += 3;
  return score;
};


const formatDate = value => {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '';
  return date.toLocaleDateString(document.documentElement.lang === 'zh' ? 'zh-CN' : 'en-GB', {
    year:'numeric',
    month:'short',
    day:'2-digit',
  });
};

const externalLink = (item, compact = false) => h('article', {
  class:'news-item' + (compact ? ' compact' : ''),
  'data-news-category':item.category || 'grid',
  'data-news-source':item.source || '',
}, h('div', { class:'news-meta' },
  h('span', { class:'news-source' }, item.source),
  h('span', { class:'news-category' }, item.categoryLabel || item.category),
  h('time', { datetime:item.t || '' }, formatDate(item.t))),
h('a', {
  class:'news-title',
  href:item.url,
  target:'_blank',
  rel:'noopener noreferrer',
}, item.title),
compact ? null : (item.summary ? h('p', { class:'news-summary' }, item.summary) : null));

async function loadNews(){
  const response = await fetch(DATA_URL, { cache:'no-cache' });
  if (!response.ok) throw new Error(`news snapshot ${response.status}`);
  return response.json();
}

/* The snapshot stores its series oldest-first, like every other dataset in the
   catalogue. Reading order is the page's concern, not the file's. */
const newestFirst = snapshot => [...(snapshot.series || [])].reverse();

/** Publishers and their reporting state, from the connector's derived block. */
const publishers = snapshot => snapshot.derived?.sourceStatus || [];

function loadingState(){
  return h('div', { class:'news-empty' }, L(['Loading the latest public feeds…', '正在读取最新公开新闻源…']));
}

export function renderNewsPreview(parent){
  const card = h('section', { class:'card industry-news news-preview' });
  const body = loadingState();
  const more = h('a', {
    class:'btn news-more',
    href:'/news',
    onclick:(event) => {
      event.preventDefault();
      navigate('/news');
      window.scrollTo(0, 0);
    },
  }, L(['More news →', '更多新闻 →']));
  card.append(h('div', { class:'news-section-head' },
    h('div', {},
      h('h3', {}, L(['Storage investment news', '储能投资新闻'])),
      h('div', { class:'cap' }, L([
        'Up to five decision-relevant headlines from public RSS feeds. Open the source for the full article.',
        '首页最多展示五条影响投资决策的公开 RSS 新闻；全文请跳转原始来源。',
      ]))),
    more), body);
  parent.append(card);

  loadNews().then(snapshot => {
    const items = newestFirst(snapshot)
      .slice(0, 30)
      .sort((a, b) => investmentRank(b) - investmentRank(a) || String(b.t).localeCompare(String(a.t)))
      .slice(0, 5);
    body.replaceWith(items.length
      ? h('div', { class:'news-list compact' }, items.map(item => externalLink(item, true)))
      : h('div', { class:'news-empty' }, L(['No current items passed the relevance filter.', '暂无通过相关性筛选的新闻。'])));
  }).catch(() => {
    body.replaceWith(h('div', { class:'news-empty' }, L([
      'The public-feed snapshot is temporarily unavailable; detailed dashboards remain available.',
      '公开新闻快照暂不可用；各市场详细看板仍可正常浏览。',
    ])));
  });
}

export function renderNewsPage(app){
  app.append(renderHeader({
    title:['Industry News', '行业新闻'],
    sub:[
      'Daily, public-feed monitoring for capital markets, M&A, grid policy, trade policy and storage technology that may affect storage-asset investment decisions.',
      '每日监测可能影响储能资产投资决策的资本市场、并购、电网政策、投资贸易政策与储能技术新闻。',
    ],
  }));
  app.append(marketNav(markets, 'news'));

  const main = h('main', { class:'news-page' });
  const controls = h('div', { class:'news-controls' });
  const list = loadingState();
  const sourceNote = h('div', { class:'news-source-note' });
  main.append(h('section', { class:'card' },
    h('div', { class:'news-section-head' },
      h('div', {},
        h('h3', {}, L(['Daily investment-news monitor', '每日投资新闻监测'])),
        h('div', { class:'cap' }, L([
          'Only titles, short publisher excerpts and links are retained. No article body is republished.',
          '仅保留标题、发布方短摘要与原文链接，不转载正文。',
        ]))),
      controls),
    list,
    sourceNote));
  app.append(main);

  loadNews().then(snapshot => {
    const items = newestFirst(snapshot);
    const sources = publishers(snapshot);
    const select = h('select', { class:'btn', 'aria-label':L(['Filter by source', '按来源筛选']) },
      h('option', { value:'all' }, L(['All sources', '全部来源'])),
      sources.map(source => h('option', { value:source.source }, source.source)));
    let activeCategory = 'all';
    let activeSource = 'all';
    const newsList = h('div', { class:'news-list' });
    const draw = () => {
      const filtered = items.filter(item =>
        (activeCategory === 'all' || item.category === activeCategory)
        && (activeSource === 'all' || item.source === activeSource));
      newsList.replaceChildren(...filtered.map(item => externalLink(item)));
      if (!filtered.length) newsList.append(h('div', { class:'news-empty' }, L([
        'No items match this filter.',
        '当前筛选条件下暂无新闻。',
      ])));
    };
    CATEGORIES.forEach(([id, label]) => controls.append(h('button', {
      class:'btn' + (id === 'all' ? ' active' : ''),
      type:'button',
      onclick:event => {
        controls.querySelectorAll('button').forEach(button => button.classList.remove('active'));
        event.currentTarget.classList.add('active');
        activeCategory = id;
        draw();
      },
    }, L(label))));
    select.addEventListener('change', event => {
      activeSource = event.target.value;
      draw();
    });
    controls.append(select);
    list.replaceWith(newsList);
    sourceNote.replaceChildren(
      h('b', {}, L(['Public feeds: ', '公开新闻源：'])),
      ...sources.flatMap((source, index) => [
        index ? document.createTextNode(' · ') : null,
        h('a', {
          href:source.homepage,
          target:'_blank',
          rel:'noopener noreferrer',
          /* A publisher that is being served from the last good snapshot is not
             the same as one that is reporting, and the reader is entitled to
             know which they are looking at. */
          class:source.status === 'ok' ? '' : 'obs-tag',
          title:source.status === 'ok' ? '' : `${source.status}: ${source.error || ''}`.trim(),
        }, source.source),
      ]).filter(Boolean),
      h('span', {}, ' · ' + L(['Latest feed item: ', '最新条目：']) + formatDate(snapshot.coverage?.to)),
    );
    draw();
  }).catch(() => {
    list.replaceWith(h('div', { class:'news-empty' }, L([
      'The daily news snapshot is unavailable. Please use the source links when the feed is restored.',
      '每日新闻快照暂不可用，请待来源恢复后重试。',
    ])));
  });

  app.append(renderFooter([[
    'Public RSS metadata only; headlines and excerpts remain the property of their publishers.',
    '仅使用公开 RSS 元数据；标题与摘要版权归原发布方所有。',
  ]]));
}
