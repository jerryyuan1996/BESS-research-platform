import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { newsTextPair } from './localization.js';

const DATA_URL = '/data/public/industry-news.json';
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
}, L(newsTextPair(item))),
compact ? null : (item.summary ? h('p', { class:'news-summary' }, L(newsTextPair(item,'summary'))) : null));

async function loadNews(){
  const response = await fetch(DATA_URL, { cache:'no-cache' });
  if (!response.ok) throw new Error(`news snapshot ${response.status}`);
  return response.json();
}

/* The snapshot stores its series oldest-first, like every other dataset in the
   catalogue. Reading order is the page's concern, not the file's. */
const newestFirst = snapshot => [...(snapshot.series || [])].reverse();

function loadingState(){
  return h('div', { class:'news-empty' }, L(['Loading the latest public feeds…', '正在读取最新公开新闻源…']));
}

export function renderNewsPreview(parent){
  const card = h('section', { class:'card industry-news news-preview' });
  const body = loadingState();
  const more = h('a', {
    class:'btn news-more',
    href:'/policy?type=news',
    onclick:(event) => {
      event.preventDefault();
      navigate('/policy?type=news');
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
