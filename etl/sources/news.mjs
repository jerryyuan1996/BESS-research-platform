/* ---------------------------------------------------------------------------
   INDUSTRY NEWS — publisher RSS, as a first-class dataset.

   This was `etl/news.mjs`: a standalone script that wrote its own bespoke JSON
   into public/data/public/ without an envelope, without a checksum, and without
   a catalogue entry. `npm run etl:verify` reported it as an orphaned snapshot on
   every run, and because that failure was permanent it stopped being read — the
   verifier's whole job is to surface a file nobody can account for, and this one
   trained people to ignore it.

   It is now a connector like any other. Same `fetchDataset` contract, same
   envelope, same checksum, same validation, driven by the same `npm run etl`.
   What is different is only the payload shape, which the catalogue declares as
   `kind: 'feed'` so the validator knows not to look for prices.

   WHAT IS REPUBLISHED, and why that is defensible: headline, publisher name,
   publication timestamp, canonical link, and the excerpt the publisher already
   syndicates in the feed, truncated. No article body. A reader who wants the
   piece follows the link to the publisher, which is what an RSS feed is for.

   AVAILABILITY: a failing source keeps its previous items rather than dropping
   them, per-source, so one publisher's outage does not empty the page. The
   per-source outcome is published in `derived.sourceStatus` so a reader can see
   which of the four are actually reporting.
   --------------------------------------------------------------------------- */
import { httpGetText } from '../lib/fetch.mjs';
import { buildSnapshot } from '../lib/envelope.mjs';

const SOURCES = [
  {
    name: 'Modo Energy',
    feed: 'https://fast.wistia.com/channels/vtx0dp52da/rss',
    homepage: 'https://modoenergy.com/research',
    kind: 'Public RSS',
  },
  {
    name: 'Energy-Storage.news',
    feed: 'https://www.energy-storage.news/feed/',
    homepage: 'https://www.energy-storage.news/',
    kind: 'Public RSS',
  },
  {
    name: 'Utility Dive',
    feed: 'https://www.utilitydive.com/feeds/news/',
    homepage: 'https://www.utilitydive.com/',
    kind: 'Public RSS',
  },
  {
    name: 'pv magazine',
    feed: 'https://www.pv-magazine.com/feed/',
    homepage: 'https://www.pv-magazine.com/',
    kind: 'Public RSS',
  },
];

/** Items carried in one snapshot, newest first before storage order is applied. */
const MAX_ITEMS = 60;
/** Items taken from any single publisher, so one prolific feed cannot crowd out the rest. */
const MAX_PER_SOURCE = 20;
/** Publisher excerpts are truncated to this before storage. */
const MAX_SUMMARY = 320;

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

export const CATEGORY_LABELS = {
  capital: 'Capital & M&A',
  policy: 'Policy & trade',
  grid: 'Grid & markets',
  technology: 'Technology',
};

function relevant(text){
  return /\b(batter|BESS|energy storage|grid storage|power market|electricity|renewable|solar|wind|transmission|interconnection|capacity market|ancillary|frequency response|flexibility|LDES|data cent(?:er|re))\b/i.test(text);
}

/**
 * One feed's XML into canonical items.
 *
 * `t` rather than `publishedAt` is deliberate: it is the envelope's time key on
 * every dataset, and using it here means the ordering and coverage checks are
 * the same code for a feed as for a price series.
 */
function parseFeed(xml, source){
  const records = xml.match(/<item\b[\s\S]*?<\/item>/gi)
    || xml.match(/<entry\b[\s\S]*?<\/entry>/gi)
    || [];

  return records.map(record => {
    const title = tag(record, ['title']);
    const summary = tag(record, ['description', 'summary', 'content:encoded', 'content']);
    const url = link(record);
    const date = new Date(tag(record, ['pubDate', 'published', 'updated', 'dc:date']));
    const itemCategory = category(title, `${title} ${summary}`);
    return {
      t: Number.isFinite(date.getTime()) ? date.toISOString() : null,
      id: `${source.name}:${url || title}`,
      source: source.name,
      title,
      url,
      category: itemCategory,
      categoryLabel: CATEGORY_LABELS[itemCategory],
      summary: summary.length > MAX_SUMMARY ? summary.slice(0, MAX_SUMMARY - 3).trimEnd() + '…' : summary,
    };
  })
    // An undated item cannot be ordered, and an ordered series is what the
    // validator and every consumer assume. Drop rather than date it now.
    .filter(item => item.t && item.title && item.url && relevant(`${item.title} ${item.summary}`))
    .sort((a, b) => b.t.localeCompare(a.t))
    .slice(0, MAX_PER_SOURCE);
}

/**
 * Items from the snapshot currently on disk, for a single publisher.
 *
 * Reads `series` and falls back to `items` — the pre-envelope shape this
 * connector replaced. Without the fallback the first run after the migration
 * would find nothing to retain and, with every feed unreachable, publish an
 * empty series and fail validation instead of holding the line.
 */
function previousFrom(previous, sourceName){
  const rows = previous?.series ?? previous?.items ?? [];
  return rows
    .filter(item => item?.source === sourceName)
    .map(item => ({ ...item, t: item.t ?? item.publishedAt }))
    .filter(item => item.t && item.id && item.title && item.url);
}

export async function fetchDataset({ dataset, previous, log, now }){
  const items = [];
  const sourceStatus = [];

  for (const source of SOURCES){
    try {
      const xml = await httpGetText(source.feed, {
        timeoutMs: 20_000,
        retries: 2,
        log: message => log(`  ${source.name}: ${message}`),
      });
      const parsed = parseFeed(xml, source);
      if (!parsed.length) throw new Error('feed returned no investment-relevant items');
      items.push(...parsed);
      sourceStatus.push({ source: source.name, homepage: source.homepage, status: 'ok', items: parsed.length });
    } catch (error){
      const retained = previousFrom(previous, source.name);
      items.push(...retained);
      sourceStatus.push({
        source: source.name,
        homepage: source.homepage,
        status: retained.length ? 'retained-previous' : 'unavailable',
        items: retained.length,
        error: String(error?.message || error).slice(0, 180),
      });
    }
  }

  /* Dedup on publisher + normalised title, not on id: the same story reissued
     with a tracking parameter on the URL changes the id and would otherwise
     appear twice. */
  const deduped = [...new Map(items.map(item =>
    [`${item.source}:${item.title.toLowerCase().replace(/\s+/g, ' ').trim()}`, item])).values()]
    .sort((a, b) => String(b.t).localeCompare(String(a.t)))
    .slice(0, MAX_ITEMS)
    // Stored oldest-first, like every other series in this catalogue. The page
    // reverses it for display; the file stays consistent with its siblings.
    .reverse();

  if (!deduped.length){
    return { skipped: true, reason: 'every feed failed and nothing was retained' };
  }

  const byCategory = {};
  for (const item of deduped) byCategory[item.category] = (byCategory[item.category] || 0) + 1;

  const snapshot = buildSnapshot({
    dataset,
    coverage: {
      from: deduped[0].t,
      to: deduped[deduped.length - 1].t,
      resolution: 'event',
      points: deduped.length,
    },
    units: { record: 'published article metadata' },
    series: deduped,
    derived: {
      authority: 'derived',
      items: deduped.length,
      sources: sourceStatus.length,
      sourcesReporting: sourceStatus.filter(s => s.status === 'ok').length,
      byCategory,
      sourceStatus,
    },
    notes: [
      'Public RSS metadata only: title, publisher excerpt, publication date and source link. No article body is republished.',
    ],
    fetchedAt: now,
  });

  return { snapshot, observations: deduped.length };
}
