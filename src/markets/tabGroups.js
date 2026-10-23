/* ---------------------------------------------------------------------------
   SEVEN TABS AROUND THE DECISION — and a tab is no longer a section.

   A dashboard used to carry ten tabs, then twelve, and each tab was exactly
   one section. The investment-view revision (plan section 6.2) arranges them
   around the decision instead:

       case          Brief               the market brief (since 2026-10-16)
       story         Market story        the overview, then the story
       revenue       Revenue and design  capacity, energy, services, duration
       entry         Entry and delivery  what it costs to get in, then the grid
       competition   Competition and demand
       capital       Capital and exit
       evidence      Evidence            data and methodology, and the changelog

   A TAB IS A CONTAINER OF SECTIONS. The section ids are unchanged, each market
   still declares them in its own tabs.js with its own labels, and each section
   is still drawn with its own heading. That is deliberate and it is the whole
   of the claim system's migration: section claims are keyed by section id
   (src/governance/PILOT-FROZEN.md), so nothing about a claim is re-keyed, and
   the count of analytical sections is what it was.

   TWO KINDS OF TAB. Most stack their sections on one page. Revenue shows one
   at a time under a sub-strip, addressed as /revenue/<section>: four sections
   of charts on one scrolling page is slow and long on a phone, and the strip
   already grouped them this way.

   OLD LINKS RESOLVE. Every address a dashboard has ever had is a section id:
   /markets/<slug>/grid, /capacity, /home. `resolveSegment` maps any of them to
   the tab that now holds the section, and the page rewrites the address in
   place, so a reader who copies it copies the new one. An unknown segment
   falls back to the landing tab, as it always did. Nothing 404s.

   Layering: no DOM, no import. A market's section list is handed in.
   --------------------------------------------------------------------------- */

/** Section ids that belong to the Revenue tab. A market uses the ones it has, in its own order. */
export const REVENUE_SECTIONS = ['rcm', 'capacity', 'energy', 'fcess', 'services', 'duration'];

/**
 * The seven tabs, in strip order. `sections` is the order they are drawn in;
 * `pick` means one section at a time under a sub-strip.
 */
export const TAB_GROUPS = [
  /* The landing tab is the market brief (guided-experience plan, PR 5): the
     call for the investor chosen, what to build, the economics, the risks, the
     catalysts and the next action, with the four investors' verdicts folded
     beneath. Its id stays `case`, so every address it ever had still works.
     The overview it used to carry leads the story instead. */
  { id: 'case',        label: ['Brief', '要点'],                         sections: ['case'] },
  { id: 'story',       label: ['Market Story', '市场演进'],               sections: ['home', 'story'] },
  { id: 'revenue',     label: ['Revenue & Design', '收入与设计'],         sections: REVENUE_SECTIONS, pick: true },
  { id: 'entry',       label: ['Entry & Delivery', '进入与交付'],         sections: ['entry', 'grid'] },
  { id: 'competition', label: ['Competition & Demand', '竞争与需求'],     sections: ['pipeline'] },
  { id: 'capital',     label: ['Capital & Exit', '资本与退出'],           sections: ['portfolio'] },
  { id: 'evidence',    label: ['Evidence', '证据'],                       sections: ['data'] },
];

export const TAB_IDS = TAB_GROUPS.map(g => g.id);

/** The tab a reader lands on. */
export const LANDING_TAB = TAB_GROUPS[0].id;

/**
 * The tabs of one market: each group with the sections that market actually
 * has. `sectionTabs` is the market's own list, [[sectionId, [en, zh]], …].
 *
 * A group whose sections the market has none of is dropped, so a market never
 * shows an empty tab. Revenue keeps the market's own order; the others keep
 * the group's.
 */
export function tabsFor(sectionTabs){
  const have = new Map(sectionTabs);
  /* A market not yet graded carries no Investment Case section (an empty
     verdict section is worse than none), so the landing tab shows its
     overview instead and Story keeps the story alone. Ontario is the first
     such market (2026-10-23). */
  const ungraded = !have.has('case');
  const wanted = (group) => !ungraded ? group.sections
    : group.id === 'case' ? ['home']
    : group.id === 'story' ? group.sections.filter(id => id !== 'home')
    : group.sections;
  return TAB_GROUPS.map(group => {
    const sections = group.pick
      ? sectionTabs.map(([id]) => id).filter(id => group.sections.includes(id))
      : wanted(group).filter(id => have.has(id));
    return { id: group.id, label: group.label, pick: Boolean(group.pick), sections };
  }).filter(group => group.sections.length > 0);
}

/** The tab that holds a section in this market, or null. */
export function tabOfSection(sectionTabs, sectionId){
  return tabsFor(sectionTabs).find(tab => tab.sections.includes(sectionId)) || null;
}

/**
 * Where a URL segment lands.
 *
 * @param sectionTabs  the market's own section list
 * @param segment      what follows /markets/<slug>/ — a tab id, an old section id, or null
 * @param sub          what follows that — a section id under a tab, or null
 * @returns
 *   tab        the tab to show
 *   sections   the section ids to draw, in order: one for a pick tab
 *   section    the section the address names, or null: the one to scroll to
 *   path       the address this lands on, relative to the market's base path
 */
export function resolveSegment(sectionTabs, segment, sub = null){
  const tabs = tabsFor(sectionTabs);
  const landing = tabs.find(t => t.id === LANDING_TAB) || tabs[0];

  let tab = tabs.find(t => t.id === segment) || null;
  let section = null;
  if (tab){
    if (tab.sections.includes(sub)) section = sub;
  } else {
    /* An old address: the segment is a section id. */
    tab = tabs.find(t => t.sections.includes(segment)) || null;
    if (tab) section = segment;
  }
  if (!tab) tab = landing;

  if (tab.pick){
    const shown = section || tab.sections[0];
    return { tab, sections: [shown], section: shown, path: shown === tab.sections[0] ? '/' + tab.id : '/' + tab.id + '/' + shown };
  }
  /* The first section of a stacked tab is the top of the page: naming it is
     the same address as the tab. */
  const named = section && section !== tab.sections[0] ? section : null;
  const base = tab.id === landing.id ? '' : '/' + tab.id;
  return { tab, sections: tab.sections, section: named, path: named ? (base || '/' + tab.id) + '/' + named : base };
}
