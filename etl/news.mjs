#!/usr/bin/env node
import { httpGetText } from './lib/fetch.mjs';
import { readSnapshot, writeSnapshot } from './lib/boundary.mjs';

const OUTPUT = 'public/data/public/industry-news.json';
const SOURCES = [
  {
    name:'Modo Energy',
    feed:'https://fast.wistia.com/channels/vtx0dp52da/rss',
    homepage:'https://modoenergy.com/research',
    kind:'Public RSS',
  },
  {
    name:'Energy-Storage.news',
    feed:'https://www.energy-storage.news/feed/',
    homepage:'https://www.energy-storage.news/',
    kind:'Public RSS',
  },
  {
    name:'Utility Dive',
    feed:'https://www.utilitydive.com/feeds/news/',
    homepage:'https://www.utilitydive.com/',
    kind:'Public RSS',
  },
  {
    name:'pv magazine',
    feed:'https://www.pv-magazine.com/feed/',
    homepage:'https://www.pv-magazine.com/',
    kind:'Public RSS',
  },
];

const decode = text => String(text || '')
  .replace(/^<!\[CDATA\[|\]\]>$/g, '')
  .replace(/&nbsp;|&#160;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&quot;|&#34;/gi, '"')
  .replace(/&apos;|&#39;/gi, "'")
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/<[^>]*>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

function tag(block, names){
  for (const name of names){
    const escaped = name.replace(':', '\\:');
    const match = block.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i'));
    if (match) return decode(match[1]);
  }
  return '';
}

function link(block){
  const plain = tag(block, ['link']);
  if (plain) return plain;
  const atom = block.match(/<link[^>]+href=["']([^"']+)["']/i);
  return atom ? decode(atom[1]) : '';
}

function category(title, text){
  if (/\b(M&A|merger|acqui(?:sition|re)|funding|financ|capital|invest|sale|sell|deal|IPO|SPAC|bond|debt|equity|insolvency)\b/i.test(title)) return 'capital';
  if (/\b(policy|regulat|tariff|trade|tax|subsid|auction|tender|permit|ban|legislat|government|consultation)\b/i.test(title)) return 'policy';
  if (/\b(technology|battery cell|chemistr|sodium|lithium|flow battery|iron-air|thermal storage|LDES|manufactur)\b/i.test(title)) return 'technology';
  if (/\b(policy|regulat|tariff|trade|tax|subsid|auction|permit|legislat|government|consultation)\b/i.test(text)) return 'policy';
  if (/\b(M&A|merger|acqui(?:sition|re)|funding|financ|capital|invest|sale|deal|IPO|bond|debt|equity)\b/i.test(text)) return 'capital';
  return 'grid';
}

const CATEGORY_LABELS = {
  capital:'Capital & M&A',
  policy:'Policy & trade',
  grid:'Grid & markets',
  technology:'Technology',
};

function relevant(text){
  return /\b(batter|BESS|energy storage|grid storage|power market|electricity|renewable|solar|wind|transmission|interconnection|capacity market|ancillary|frequency response|flexibility|LDES|data cent(?:er|re))\b/i.test(text);
}

function parseFeed(xml, source){
  const records = xml.match(/<item\b[\s\S]*?<\/item>/gi)
    || xml.match(/<entry\b[\s\S]*?<\/entry>/gi)
    || [];
  return records.map(record => {
    const title = tag(record, ['title']);
    const summary = tag(record, ['description', 'summary', 'content:encoded', 'content']);
    const url = link(record);
    const rawDate = tag(record, ['pubDate', 'published', 'updated', 'dc:date']);
    const date = new Date(rawDate);
    const combined = `${title} ${summary}`;
    const itemCategory = category(title, combined);
    return {
      id:`${source.name}:${url || title}`,
      source:source.name,
      title,
      url,
      publishedAt:Number.isFinite(date.getTime()) ? date.toISOString() : null,
      category:itemCategory,
      categoryLabel:CATEGORY_LABELS[itemCategory],
      summary:summary.length > 320 ? summary.slice(0, 317).trimEnd() + '…' : summary,
    };
  }).filter(item => item.title && item.url && relevant(`${item.title} ${item.summary}`))
    .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')))
    .slice(0, 20);
}

async function main(){
  const previous = await readSnapshot(OUTPUT);
  const previousBySource = new Map(SOURCES.map(source => [
    source.name,
    (previous?.items || []).filter(item => item.source === source.name),
  ]));
  const items = [];
  const status = [];

  for (const source of SOURCES){
    try {
      const xml = await httpGetText(source.feed, {
        timeoutMs:20_000,
        retries:2,
        log:message => process.stdout.write(`${source.name}: ${message}\n`),
      });
      const parsed = parseFeed(xml, source);
      if (!parsed.length) throw new Error('feed returned no investment-relevant items');
      items.push(...parsed);
      status.push({ source:source.name, status:'ok', items:parsed.length });
    } catch (error){
      const retained = previousBySource.get(source.name) || [];
      items.push(...retained);
      status.push({
        source:source.name,
        status:retained.length ? 'retained-previous' : 'unavailable',
        items:retained.length,
        error:String(error?.message || error).slice(0, 180),
      });
    }
  }

  const deduped = [...new Map(items.map(item =>
    [`${item.source}:${item.title.toLowerCase().replace(/\s+/g, ' ').trim()}`, item])).values()]
    .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')))
    .slice(0, 60);
  if (!deduped.length){
    process.stdout.write('No news items available; previous snapshot retained.\n');
    return;
  }
  const snapshot = {
    schemaVersion:1,
    updatedAt:deduped[0].publishedAt,
    refreshHours:24,
    policy:'Public RSS metadata only: title, short publisher excerpt, publication date and source link. No full article body is republished.',
    sources:SOURCES.map(({ name, feed, homepage, kind }) => ({ name, feed, homepage, kind })),
    sourceStatus:status,
    items:deduped,
  };
  const result = await writeSnapshot(OUTPUT, snapshot);
  process.stdout.write(`Industry news: ${result.written ? 'updated' : result.reason}; ${deduped.length} items.\n`);
}

main().catch(error => {
  console.error(error?.stack || error);
  process.exit(1);
});
