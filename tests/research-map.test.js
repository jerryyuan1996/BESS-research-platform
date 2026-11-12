/* ---------------------------------------------------------------------------
   RESEARCH IN CONTEXT: THE MAP ACCOUNTS FOR EVERY CARD.

   src/experience/researchMap.js says under which chapter of the market page
   each card of a market's research is read. A map like that decays quietly: a
   card is renamed and its line names nothing, a card is added and no chapter
   shows it, a phrase starts to match two cards and the wrong one is drawn.
   None of those breaks the page. So the map is held to the research here.

   The research is built in Node from each market's real dataset, through each
   regional lens and in both languages, and split into cards exactly as the
   page splits it (src/markets/_shared/researchUnits.js).

   What must hold:
     - every card of a routed section is read under a chapter, or is on the
       decision list with where it sits, a suggestion and a reason;
     - every phrase in the map names exactly one card, in every lens and both
       languages, and no card is named twice;
     - what the map says the page already shows, the page does show;
     - a chapter's disclosure is never empty;
     - the picks a chapter sends to the engine select exactly the cards the
       map places there.
   --------------------------------------------------------------------------- */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readResearch, collect } from '../scripts/research/coverage.mjs';
import { researchUnits, unitsMatching, pickUnits } from '../src/markets/_shared/researchUnits.js';
import {
  CHAPTERS, SLOTS, DEFAULT_MAP, MARKET_MAPS, SECTION_ORDER, UNASSIGNED,
  placementsOf, picksFor, names, mappedOwners,
} from '../src/experience/researchMap.js';
import { REVENUE_MECHANISMS, MECHANISM_RESEARCH } from '../src/opportunities/revenue.js';

const research = { en: await readResearch({ lang: 'en' }), zh: await readResearch({ lang: 'zh' }) };
const rows = await collect({ lang: 'en' });
const at = (row) => `${row.market}${row.lens ? '/' + row.lens : ''} ${row.section} "${row.key}"`;

test('a section is split into cards, with what follows a card travelling with it', () => {
  const { lead, units } = researchUnits({ blocks: [
    { t: 'sub', text: ['Lens', '视角'] },
    { t: 'card', title: ['Alpha — first', '甲'], badges: ['official'], blocks: [{ t: 'bar', cfg: {} }] },
    { t: 'congestion', data: {} },
    null,
    { t: 'g2', cards: [{ title: ['Beta', '乙'], blocks: [{ t: 'p', text: ['x', 'y'] }] }, { title: ['Gamma', '丙'] }] },
    { t: 'why', text: ['after gamma', '丙之后'] },
  ] });
  assert.deepEqual(lead.map(b => b.t), ['sub'], 'text before the first card is the lead');
  assert.deepEqual(units.map(u => u.key), ['Alpha — first', 'Beta', 'Gamma']);
  assert.deepEqual(units[0].blocks.map(b => b.t), ['card', 'congestion'], 'the register trails its map card');
  assert.deepEqual(units[2].blocks.map(b => b.t), ['card', 'why']);
  assert.deepEqual(units.map(u => u.visual), [2, 0, 0], 'a chart ranks the card as a picture');
  assert.equal(researchUnits({ blocks: [{ t: 'card', title: ['F', 'F'], blocks: [{ t: 'kpis', items: [] }, { t: 'flow', items: [] }] }] }).units[0].visual, 1, 'a flow is a diagram, ranked below a chart');
  assert.deepEqual(units[0].badges, ['official']);

  /* A section that is one component has no card around it. */
  const ledger = researchUnits({ blocks: [{ t: 'p', text: ['lead', '导语'] }, { t: 'entry-ledger', marketId: 'x' }] });
  assert.deepEqual(ledger.lead.map(b => b.t), ['p']);
  assert.deepEqual(ledger.units.map(u => u.key), ['#entry-ledger']);

  assert.deepEqual(unitsMatching(units, 'Alpha').map(u => u.key), ['Alpha — first']);
  assert.deepEqual(unitsMatching(ledger.units, '#entry-ledger').length, 1);
  assert.deepEqual(unitsMatching(units, '#card'), [], 'a #type phrase never names a titled card');
  assert.equal(researchUnits(undefined).units.length, 0);
});

test('a pick takes the cards named, the rest of the section when asked, in reading order', () => {
  const { units } = researchUnits({ blocks: ['A', 'B', 'C', 'D'].map(k => ({ t: 'card', title: [k + ' card', k] })) });
  const keys = (pick) => pickUnits(units, pick).map(u => u.key[0]).join('');
  assert.equal(keys({}), 'ABCD', 'neither cards nor rest: the whole section');
  assert.equal(keys({ cards: ['C card', 'A card'] }), 'AC', 'reading order, not the order asked');
  assert.equal(keys({ cards: [], rest: true, except: ['B card'] }), 'ACD');
  assert.equal(keys({ cards: ['B card'], rest: true, except: ['B card', 'D card'] }), 'ABC', 'a named card wins over except');
  assert.equal(keys({ cards: [] }), '', 'an empty list of cards is nothing');
});

test('the map is well formed', () => {
  assert.deepEqual([...mappedOwners()].sort(), ['wa', 'nem', 'jp', 'gb', 'de', 'it', 'ie', 'ro', 'pl', 'pjm', 'ercot', 'caiso', 'fi', 'ca_on', 'sa', 'es'].sort(), 'all sixteen dashboards are placed');
  for (const [section, target] of Object.entries(DEFAULT_MAP)) assert.ok(SECTION_ORDER.includes(section) && valid(target), section);
  for (const [owner, sections] of Object.entries(MARKET_MAPS)){
    for (const [section, cards] of Object.entries(sections)){
      assert.ok(SECTION_ORDER.includes(section), `${owner}: ${section} has a place in the reading order`);
      for (const [phrase, to] of Object.entries(cards)){
        assert.ok(Array.isArray(to), `${owner} ${section} "${phrase}"`);
        assert.equal(new Set(to).size, to.length, `${owner} ${section} "${phrase}" names a chapter once`);
        for (const target of to) assert.ok(valid(target), `${owner} ${section} "${phrase}" → ${target}`);
        for (const target of to) assert.ok(!CHAPTERS[target.split(':')[0]].wired, `${owner} ${section} "${phrase}": a wired chapter is a default, never a card's placement`);
      }
    }
  }
  /* Each mechanism card the page can draw fills a slot the map knows. A toll
     is a private contract: no research section explains one. */
  assert.deepEqual(Object.keys(REVENUE_MECHANISMS).filter(id => !MECHANISM_RESEARCH[id]), ['toll']);
  for (const [id, slot] of Object.entries(MECHANISM_RESEARCH)){
    assert.ok(REVENUE_MECHANISMS[id], id + ' is a mechanism card');
    assert.ok(SLOTS.includes(slot), id);
  }
});
function valid(target){
  const [chapter, slot, more] = target.split(':');
  if (more !== undefined || !CHAPTERS[chapter]) return false;
  return slot === undefined || (chapter === 'revenue-drivers' && SLOTS.includes(slot));
}

test('every card of a routed section is read under a chapter or is on the decision list', () => {
  assert.ok(rows.length > 100, 'the research was built');
  for (const row of rows){
    if (row.placements.length){
      assert.equal(row.record, null, at(row) + ' is placed and also on the decision list');
      continue;
    }
    assert.ok(row.record, at(row) + ' is read nowhere and is not on the decision list');
    assert.equal(row.record.routed, row.routed, at(row) + ': the list says whether a tab shows it today');
  }
  /* An unrouted section has no reader today, so it is never placed by default. */
  for (const row of rows.filter(r => !r.routed)) assert.equal(row.placements.length, 0, at(row) + ' would be newly published');
});

test('the decision list and the map name the same cards, each with a suggestion and a reason', () => {
  const unplaced = Object.entries(MARKET_MAPS).flatMap(([market, sections]) => Object.entries(sections)
    .flatMap(([section, cards]) => Object.entries(cards).filter(([, to]) => !to.length).map(([card]) => `${market}/${section}/${card}`)));
  assert.deepEqual(UNASSIGNED.map(u => `${u.market}/${u.section}/${u.card}`).sort(), unplaced.sort());
  for (const record of UNASSIGNED){
    assert.ok(record.suggest.length > 10 && record.reason.length > 40, record.card);
    assert.equal(typeof record.routed, 'boolean');
  }
});

test('every phrase names exactly one card, in every lens and both languages', () => {
  for (const lang of ['en', 'zh']){
    for (const { market, lens, section, units } of research[lang]){
      const phrases = Object.keys(MARKET_MAPS[market][section] || {});
      const taken = new Map();
      for (const phrase of phrases){
        const hit = unitsMatching(units, phrase);
        assert.equal(hit.length, 1, `${market}${lens ? '/' + lens : ''} ${section} "${phrase}" (${lang}) names ${hit.length} cards`);
        assert.ok(names(phrase, hit[0].key), 'the map and the engine read a phrase the same way');
        assert.ok(!taken.has(hit[0]), `${market} ${section}: "${phrase}" and "${taken.get(hit[0])}" name one card`);
        taken.set(hit[0], phrase);
      }
      assert.equal(new Set(units.map(u => u.key)).size, units.length, `${market} ${section}: card titles are distinct`);
    }
    /* A phrase for a section the market does not have names nothing. */
    for (const [market, sections] of Object.entries(MARKET_MAPS)){
      const have = new Set(research[lang].filter(s => s.market === market).map(s => s.section));
      for (const section of Object.keys(sections)) assert.ok(have.has(section), `${market} has no ${section} section`);
    }
  }
});

test('what the map calls already shown, the page shows', async () => {
  for (const owner of mappedOwners()){
    /* Historical background reads these cards through the market's history adapter. */
    const { researchHistory } = await import(`../src/markets/${owner}/history.js`);
    const source = await readFile(new URL(`../src/markets/${owner}/history.js`, import.meta.url), 'utf8');
    const wired = rows.filter(r => r.market === owner && r.placements.includes('history'));
    if (owner !== 'wa') assert.ok(wired.length, owner + ' history');
    else assert.equal(wired.length, 0, 'WA embeds its story tab whole; the history adapter remains independent');
    for (const row of wired){
      assert.equal(row.section, 'story', at(row));
      assert.ok(source.includes(row.key.replace(/'/g, "\\'")) || source.includes(row.key), at(row) + ' is in the history the reading draws');
    }
    assert.equal(typeof researchHistory, 'function');
    /* The decision panel is the investment case; nothing else claims it. */
    const decided = rows.filter(r => r.market === owner && r.placements.includes('decision'));
    assert.deepEqual([...new Set(decided.map(r => r.section + '/' + r.key))],
      ['ca_on', 'sa', 'es'].includes(owner) ? [] : owner === 'wa' ? ['case/#tab-case'] : ['case/#investment-case']);
  }
});

test('no chapter opens on an empty disclosure, and no card is left out of its chapter', () => {
  const targets = ['system', 'mechanism', 'revenue', 'bankable', 'execution', 'downside', 'sources',
    ...SLOTS.map(slot => 'revenue-drivers:' + slot)];
  for (const lang of ['en', 'zh']){
    const groups = new Map();
    for (const s of research[lang]){
      const id = s.market + '|' + (s.lens || '');
      if (!groups.has(id)) groups.set(id, []);
      groups.get(id).push(s);
    }
    for (const [id, sections] of groups){
      const market = id.split('|')[0];
      const expected = new Map();
      for (const s of sections) for (const unit of s.units) for (const target of placementsOf(market, s.section, unit.key)){
        if (!expected.has(target)) expected.set(target, []);
        expected.get(target).push(s.section + '/' + unit.key);
      }
      for (const target of [...targets, 'revenue-drivers']){
        const [chapter, slot] = target.split(':');
        const picked = picksFor(market, chapter, slot || null).flatMap(pick => {
          const section = sections.find(s => s.section === pick.section);
          return section ? pickUnits(section.units, pick).map(unit => pick.section + '/' + unit.key) : [];
        });
        assert.deepEqual([...picked].sort(), [...(expected.get(target) || [])].sort(), `${id} ${target} (${lang})`);
        const absent = (['ca_on', 'sa', 'es'].includes(market) && ['system','mechanism'].includes(target))
          || (market === 'sa' && ['revenue','downside'].includes(target));
        if (targets.includes(target) && !absent)
          assert.ok(picked.length, `${id}: ${target} has research behind it`);
        if (absent) assert.equal(picked.length, 0, `${id}: ${target} remains outside its reading scope`);
      }
    }
  }
  assert.deepEqual(picksFor('unknown', 'revenue'), [], 'a market the map does not know has no picks');
});

test('the page fetches the map only when a disclosure opens, and never ships the decision list', async () => {
  const read = (file) => readFile(new URL('../src/' + file, import.meta.url), 'utf8');
  const map = await read('experience/researchMap.js');
  assert.doesNotMatch(map, /^import /m, 'the map imports nothing');
  for (const file of ['experience/researchContext.js', 'experience/marketPage.js']){
    assert.doesNotMatch(await read(file), /UNASSIGNED/, file + ' leaves the decision list to the script');
  }
  /* The page and the two modules it always loads reach the map and the
     panel only through one dynamic import, made when a disclosure opens. */
  const page = await read('experience/marketPage.js');
  assert.match(page, /import\('\.\/researchContext\.js'\)/);
  for (const file of ['experience/marketPage.js', 'opportunities/ui.js', 'experience/story/public/chapter.js', 'experience/story/public/pack.js']){
    assert.doesNotMatch(await read(file), /from ['"][^'"]*research(Map|Context)\.js['"]/, file + ' does not import the map or the panel statically');
  }
  /* What the page knows before that is which markets are placed, and it
     agrees with the map. */
  const { RESEARCH_IN_CONTEXT } = await import('../src/experience/researchPlaced.js');
  assert.deepEqual(Object.keys(RESEARCH_IN_CONTEXT), mappedOwners());
  for (const owner of mappedOwners()){
    assert.equal(RESEARCH_IN_CONTEXT[owner].across, picksFor(owner, 'revenue-drivers').length > 0, owner + ': research across the mechanisms');
  }
});


test('availability matches cards, and the history-only reading stays history only', async () => {
  const { RESEARCH_IN_CONTEXT, researchPlaced } = await import('../src/experience/researchPlaced.js');
  for (const owner of mappedOwners()){
    const market = {manifest: {id: owner}};
    const entry = researchPlaced(market);
    const actual = rows.filter(r => r.market === owner).flatMap(r => r.placements);
    for (const chapter of Object.keys(CHAPTERS).filter(c => !CHAPTERS[c].wired)){
      const intended = ['ca_on','sa','es'].includes(owner) && ['system','mechanism'].includes(chapter)
        ? false : actual.some(t => t.split(':')[0] === chapter);
      assert.equal(Boolean(researchPlaced(market, chapter)), intended, owner + ' ' + chapter);
    }
    assert.deepEqual([...entry.slots].sort(), [...new Set(actual.filter(t => t.startsWith('revenue-drivers:')).map(t => t.split(':')[1]))].sort());
    assert.equal(researchPlaced(market, 'revenue-drivers', 'unknown'), null);
  }
  assert.equal(researchPlaced({manifest:{id:'unknown'}}), null);
});

test('WA context uses a strict public renderer list and never imports its portfolio', async () => {
  const adapter = await readFile(new URL('../src/markets/wa/researchExcerpt.js', import.meta.url), 'utf8');
  assert.doesNotMatch(adapter, /import\s*(?:\([^)]*|[^;]*from\s*)['"][^'"]*(?:portfolio|local-data|local\/)/);
  assert.doesNotMatch(adapter, /dashboard\.js/);
  for (const row of rows.filter(r => r.market === 'wa' && r.placements.some(p => !CHAPTERS[p.split(':')[0]].wired))){
    assert.match(adapter, new RegExp('\\b' + row.section + ': \\(\\) => import'));
  }
  for (const chapter of Object.keys(CHAPTERS).filter(c => !CHAPTERS[c].wired)){
    for (const slot of [null, ...SLOTS]) for (const pick of picksFor('wa', chapter, slot)){
      assert.ok(!['home', 'portfolio'].includes(pick.section), 'unassigned whole tabs must not become empty default picks');
      assert.match(adapter, new RegExp('\\b' + pick.section + ': \\(\\) => import'));
    }
  }
  const source = await readFile(new URL('../src/experience/researchContext.js', import.meta.url), 'utf8');
  assert.match(source, /owner === 'wa' \? \(\) => import\('..\/markets\/wa\/researchExcerpt.js'\)/);
});

test('the unpriced Saudi case places every unit in an existing reading, not a missing model chapter', async () => {
  const visible = new Set(['history', 'revenue-drivers:award', 'revenue-drivers:merchant',
    'revenue-drivers:ancillary', 'bankable', 'execution', 'sources']);
  const sa = rows.filter(row => row.market === 'sa');
  assert.equal(sa.length, 15);
  for(const row of sa) assert.ok(row.placements.some(target => visible.has(target)), at(row));
  assert.deepEqual(placementsOf('sa', 'duration', '#card'), ['execution']);
  const { researchPlaced } = await import('../src/experience/researchPlaced.js');
  const market = { manifest: { id: 'sa' } };
  for(const chapter of ['system', 'mechanism', 'revenue', 'downside'])
    assert.equal(researchPlaced(market, chapter), null, chapter + ' is not a Saudi investment-model chapter');
  assert.ok(researchPlaced(market, 'bankable'), 'existing research remains available beside the unpriced-case notice');
});
