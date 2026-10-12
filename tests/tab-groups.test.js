/* ---------------------------------------------------------------------------
   SEVEN TABS, AND EVERY OLD ADDRESS STILL LANDS.

   Dashboards carried ten tabs, then twelve, each exactly one section. They now
   carry seven, and a tab is a container of sections (src/markets/tabGroups.js).
   Three things are held here:

     1. EVERY MARKET HAS THE SAME SEVEN, in the same order, and every one of
        its sections sits in exactly one of them. A section left out of every
        tab would be content nobody can reach, with nothing failing.
     2. EVERY ADDRESS A DASHBOARD EVER HAD RESOLVES. Those addresses are
        section ids. Each maps to the tab that holds the section and to a new
        address, and an unknown one falls back to the landing tab.
     3. CLAIMS ARE NOT RE-KEYED. A section claim is keyed by section id, the
        section ids did not change, and each section is still drawn with its
        own heading for the claim to sit on.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { markets } from '../src/markets/registry.js';
import { TAB_IDS, TAB_GROUPS, LANDING_TAB, REVENUE_SECTIONS, tabsFor, tabOfSection, resolveSegment } from '../src/markets/tabGroups.js';
import { parseRoute } from '../src/app/router.js';

const sectionIds = (m) => m.tabs.map(([id]) => id);

test('there are seven tabs, in the order the plan gives them', () => {
  assert.deepEqual(TAB_IDS, ['case', 'story', 'revenue', 'entry', 'competition', 'capital', 'evidence']);
  assert.equal(LANDING_TAB, 'case', 'a reader lands on the investment case');
  for (const group of TAB_GROUPS){
    assert.ok(Array.isArray(group.label) && group.label[0] && /[一-鿿]/.test(group.label[1]), `${group.id}: label in both languages`);
  }
  assert.deepEqual(TAB_GROUPS.filter(g => g.pick).map(g => g.id), ['revenue'], 'only Revenue shows one section at a time');
});

test('every market has the same seven tabs, and each of its sections is in exactly one', () => {
  for (const m of markets){
    const id = m.manifest.id;
    const tabs = tabsFor(m.tabs);
    assert.deepEqual(tabs.map(t => t.id), TAB_IDS, `${id}: the seven tabs`);
    const placed = tabs.flatMap(t => t.sections);
    assert.deepEqual([...placed].sort(), [...sectionIds(m)].sort(), `${id}: a section is in no tab, or in two`);
    assert.equal(new Set(placed).size, placed.length, `${id}: a section appears twice`);
    for (const tab of tabs) assert.ok(tab.sections.length > 0, `${id}/${tab.id}: an empty tab`);
  }
});

test('the investment case leads, then the overview; entry leads, then the grid', () => {
  for (const m of markets){
    const tabs = Object.fromEntries(tabsFor(m.tabs).map(t => [t.id, t.sections]));
    assert.deepEqual(tabs.case, ['case', 'home'], m.manifest.id);
    assert.deepEqual(tabs.entry, ['entry', 'grid'], m.manifest.id);
    assert.deepEqual(tabs.competition, ['pipeline']);
    assert.deepEqual(tabs.capital, ['portfolio']);
    assert.deepEqual(tabs.evidence, ['data']);
    /* Revenue keeps the market's own sections in the market's own order. */
    assert.deepEqual(tabs.revenue, sectionIds(m).filter(s => REVENUE_SECTIONS.includes(s)), m.manifest.id);
    assert.equal(tabs.revenue.length, 4, `${m.manifest.id}: four revenue sections`);
  }
});

test('every address a dashboard ever had lands on the tab that now holds its section', () => {
  const EXPECTED = {
    home: ['case', '/case/home'], case: ['case', ''], story: ['story', '/story'],
    capacity: ['revenue', null], rcm: ['revenue', null], energy: ['revenue', null],
    services: ['revenue', null], fcess: ['revenue', null], duration: ['revenue', null],
    grid: ['entry', '/entry/grid'], entry: ['entry', '/entry'],
    pipeline: ['competition', '/competition'], portfolio: ['capital', '/capital'], data: ['evidence', '/evidence'],
  };
  for (const m of markets){
    for (const old of sectionIds(m)){
      const where = resolveSegment(m.tabs, old);
      const [tab, path] = EXPECTED[old] ?? [];
      assert.ok(tab, `${m.manifest.id}: "${old}" is a section no alias is written for`);
      assert.equal(where.tab.id, tab, `${m.manifest.id}/${old}`);
      assert.ok(where.sections.includes(old), `${m.manifest.id}/${old}: the section is not drawn where its old address lands`);
      if (path !== null) assert.equal(where.path, path, `${m.manifest.id}/${old}`);
      else {
        /* A revenue section: shown alone, addressed under the tab. */
        assert.deepEqual(where.sections, [old]);
        const first = tabOfSection(m.tabs, old).sections[0];
        assert.equal(where.path, old === first ? '/revenue' : `/revenue/${old}`, `${m.manifest.id}/${old}`);
      }
    }
  }
});

test('the new addresses resolve to themselves, and nothing 404s', () => {
  const m = markets.find(x => x.manifest.id === 'de');
  assert.equal(resolveSegment(m.tabs, null).tab.id, 'case');
  assert.equal(resolveSegment(m.tabs, null).path, '', 'the landing tab is the market\'s own address');
  assert.equal(resolveSegment(m.tabs, 'case').path, '');
  for (const tab of TAB_IDS.filter(t => t !== 'case')) assert.equal(resolveSegment(m.tabs, tab).path, '/' + tab);
  assert.equal(resolveSegment(m.tabs, 'revenue', 'energy').path, '/revenue/energy');
  assert.deepEqual(resolveSegment(m.tabs, 'revenue', 'energy').sections, ['energy']);
  assert.deepEqual(resolveSegment(m.tabs, 'revenue').sections, ['capacity'], 'the first revenue section is the default');
  assert.equal(resolveSegment(m.tabs, 'entry', 'grid').section, 'grid', 'a named section under a stacked tab is the one to scroll to');
  assert.deepEqual(resolveSegment(m.tabs, 'entry', 'grid').sections, ['entry', 'grid'], 'and the whole tab is still drawn');
  /* Unknown segments and unknown sections fall back; they never throw. */
  assert.equal(resolveSegment(m.tabs, 'nonsense').tab.id, 'case');
  assert.equal(resolveSegment(m.tabs, 'revenue', 'nonsense').path, '/revenue');
  assert.equal(resolveSegment(m.tabs, 'entry', 'energy').path, '/entry', 'a section of another tab is not honoured under this one');
});

test('the router hands over the section under a tab', () => {
  assert.deepEqual(
    (({ name, slug, tab, sub }) => ({ name, slug, tab, sub }))(parseRoute('/markets/germany/revenue/energy')),
    { name: 'market', slug: 'germany', tab: 'revenue', sub: 'energy' });
  assert.equal(parseRoute('/markets/germany/revenue').sub, null);
  assert.equal(parseRoute('/markets/germany').tab, null);
  assert.equal(parseRoute('/markets/germany/grid').tab, 'grid', 'an old address still parses; the dashboard resolves it');
});

test('each section is drawn in its own wrapper, so a claim lands on its own section', async () => {
  /* Held against the source, as tests/section-shape.test.js does: there is no
     DOM in this suite and the rendered result is checked in a browser. */
  const draw = await readFile(new URL('../src/components/tabSections.js', import.meta.url), 'utf8');
  assert.match(draw, /'data-section': id/, 'each section\'s wrapper carries its id');
  assert.match(draw, /after\(id, wrapper\)/, 'the enhancements run once per section, on that section\'s wrapper');
  assert.match(draw, /replaceState/, 'an old address is rewritten in place, not navigated to');

  for (const file of ['../src/markets/_shared/engine.js', '../src/markets/wa/dashboard.js']){
    const src = await readFile(new URL(file, import.meta.url), 'utf8');
    assert.match(src, /resolveSegment\(TABS,/, `${file}: resolves the address through the tab groups`);
    assert.match(src, /enhanceMarketPage\(el, \{[\s\S]*?tabId: ?id/, `${file}: a claim is looked up by SECTION id, which is what it has always been keyed by`);
  }
});

test('the frozen claim document records that a section is no longer a tab, and nothing above it changed', async () => {
  const doc = await readFile(new URL('../src/governance/PILOT-FROZEN.md', import.meta.url), 'utf8');
  assert.match(doc, /Amended 2026-10: a section is no longer a tab/);
  assert.match(doc, /claims and dispositions remain keyed by section id/);
  assert.ok(doc.indexOf('Amended 2026-10') > doc.indexOf('## Scaling from here'), 'the amendment is added at the end');
  assert.match(doc, /\*\*7 supported claims out of 150\s+analytical sections\.\*\*/, 'the count the pilot froze is still stated as it was');
});
