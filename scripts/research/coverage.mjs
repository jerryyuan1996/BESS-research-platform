/* ---------------------------------------------------------------------------
   RESEARCH IN CONTEXT: what the map does with every card of the research.

       node scripts/research/coverage.mjs            the decision list
       node scripts/research/coverage.mjs --all      every card and its chapter
       node scripts/research/coverage.mjs --json     the same, for a tool

   Builds each mapped market's research sections in Node, with the market's
   real dataset and the same harness the section-parity tests use, splits them
   into cards exactly as the page does (src/markets/_shared/researchUnits.js)
   and asks the map (src/experience/researchMap.js) where each one is read.

   The decision list is the cards the map places nowhere: where each sits
   today, the suggested destination or deletion, and why. Every one of them
   stays reachable where it is until the analyst answers; this script changes
   nothing.

   Reads tracked source only. No network, no model, nothing under local-data/.
   tests/research-map.test.js runs the same collection and fails on a card the
   map does not account for.
   --------------------------------------------------------------------------- */
import { pathToFileURL } from 'node:url';
import { marketApi, buildAllMarketSections } from '../../tests/helpers/market-sections.mjs';
import { researchUnits } from '../../src/markets/_shared/researchUnits.js';
import { CHAPTERS, MARKET_MAPS, UNASSIGNED, placementsOf, names } from '../../src/experience/researchMap.js';

/**
 * The api a section reads, for one lens and one language.
 *
 * The shared harness returns a bilingual pair from L() so a fingerprint covers
 * both languages. A card is named by its title as the page builds it, and
 * Japan builds `L(area) + ' — duration need index'`, so here L() answers in
 * one language, as it does in the browser. A regional market also asks which
 * area it is drawing.
 */
const readings = new Map();
async function apiFor(owner, lens, lang){
  if (!readings.has(owner)) readings.set(owner, {});
  const reading = readings.get(owner);
  Object.assign(reading, { lens, lang });
  const api = { ...await marketApi(owner), L: (pair) => (Array.isArray(pair) ? pair[reading.lang === 'zh' ? 1 : 0] : pair) };
  if (!lens) return api;
  const data = await import(`../../src/markets/${owner}/data.js`);
  if (data.activeRegion) data.activeRegion.id = lens;
  return { ...api, region: () => reading.lens, isCompare: () => false, lensRegions: () => [reading.lens], marketEntry: () => null };
}

/**
 * Every section of every mapped market, split into cards.
 * @returns {Promise<Array<{market, lens, section, routed, units}>>}
 */
export async function readResearch({ lang = 'en' } = {}){
  const out = [];
  for (const owner of Object.keys(MARKET_MAPS)){
    const tabs = await import(`../../src/markets/${owner}/tabs.js`);
    const routed = new Set(tabs.TABS.map(([id]) => id));
    /* Hand-written WA sections are indivisible public-tab units. Their
       renderer adapter uses this same tab identity, never the private layer. */
    if (owner === 'wa'){
      for (const [section, title] of tabs.TABS){
        out.push({ market: owner, lens: null, section, routed: true,
          units: [{ key: '#tab-' + section, title, badges: [], visual: 2, blocks: [] }] });
      }
      continue;
    }
    const lenses = (tabs.REGIONS || []).map(([id]) => id);
    for (const lens of (lenses.length ? lenses : [null])){
      const sections = await buildAllMarketSections(owner, await apiFor(owner, lens, lang));
      for (const [section, spec] of Object.entries(sections)){
        out.push({ market: owner, lens, section, routed: routed.has(section), units: researchUnits(spec).units });
      }
    }
  }
  return out;
}

/** One row per card, with where the map reads it and its decision record, if any. */
export async function collect(options){
  return (await readResearch(options)).flatMap(({ market, lens, section, routed, units }) => units.map((unit, index) => ({
    market, lens, section, routed, index, key: unit.key,
    placements: placementsOf(market, section, unit.key),
    record: UNASSIGNED.find(u => u.market === market && u.section === section && names(u.card, unit.key)) || null,
  })));
}

const where = (placement) => {
  const [chapter, slot] = placement.split(':');
  return CHAPTERS[chapter].where[0] + (slot ? ' · ' + slot : '');
};

/* A regional market draws each card once per area. The areas share one
   structure, so the first area stands for the card. */
const firstLens = (rows) => rows.filter(row => row.lens === rows.find(r => r.market === row.market).lens);

function print(rows, all){
  const out = [];
  const cards = firstLens(rows);
  for (const market of Object.keys(MARKET_MAPS)){
    const mine = cards.filter(row => row.market === market);
    const open = mine.filter(row => !row.placements.length);
    out.push('', `## ${market}: ${mine.length} ${market === 'wa' ? 'whole tabs' : 'cards'}, ${mine.length - open.length} placed, ${open.length} awaiting a decision`);
    if (all){
      out.push('', '| Research tab | Card | Read under |', '| --- | --- | --- |');
      for (const row of mine.filter(r => r.placements.length)){
        out.push(`| ${row.section} | ${row.key} | ${row.placements.map(where).join('; ')} |`);
      }
    }
    out.push('', '| Now in | Card | Suggested destination or deletion | Why |', '| --- | --- | --- | --- |');
    for (const row of open){
      const now = row.routed ? `research tab \`${row.section}\`` : `section \`${row.section}\`, which no tab shows`;
      out.push(`| ${now} | ${row.key} | ${row.record?.suggest ?? 'NOT ON THE LIST'} | ${row.record?.reason ?? 'The map places this card nowhere and the decision list does not name it.'} |`);
    }
  }
  return out.join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href){
  const rows = await collect();
  if (process.argv.includes('--json')) console.log(JSON.stringify(firstLens(rows), null, 2));
  else console.log(print(rows, process.argv.includes('--all')));
}
