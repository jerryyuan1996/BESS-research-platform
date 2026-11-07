/* ---------------------------------------------------------------------------
   Which markets have a story, and how to load one (immersive-experience plan,
   WP-03).

   The market page imports this, so it stays a few lines: the shell, the kit
   and the content load with the market's own story chunk, on demand.

   A story is released by its G-2 release PR, which sets `released`. Until
   then it opens only when the market page's address carries ?story=preview,
   so the analyst can walk through the running story on a build while readers
   keep the research dialog. WA was released at G-2 (WP-10).

   Rollback: set `released: false`, and the button opens the research dialog
   again; story links then open nothing.
   --------------------------------------------------------------------------- */
/* Japan G-1 shared-pack sign-off: 5 November 2026, japan-storyboard.md §12.
   Analyst G-2 sign-off, merge and publication authorised 6 November 2026.
   Tokyo, Kyushu and Hokkaido release together. */
const loadJapanStory = () => import('../../markets/jp/storyPack.js');
export const STORIES = {
  jp_tokyo: { released: true, load: loadJapanStory },
  jp_kyushu: { released: true, load: loadJapanStory },
  jp_hokkaido: { released: true, load: loadJapanStory },
  pjm: { released: true, load: () => import('../../markets/pjm/storyPack.js') },
  /* Analyst G-2 signed off 3 November 2026. */
  caiso: { released: true, load: () => import('../../markets/caiso/storyPack.js') },
  wa: { released: true, load: () => import('../../markets/wa/storyPack.js') },
  fi: { released: true, load: () => import('../../markets/fi/storyPack.js') },
  de: { released: true, load: () => import('../../markets/de/storyPack.js') },
  gb: { released: true, load: () => import('../../markets/gb/storyPack.js') },
  it: { released: true, load: () => import('../../markets/it/storyPack.js') },
  /* Released at G-2 on 2 November 2026. */
  ie: { released: true, load: () => import('../../markets/ie/storyPack.js') },
  /* Romania: G-2 signed off 2 November 2026. */
  ro: { released: true, load: () => import('../../markets/ro/storyPack.js') },
  /* Poland: G-2 signed off 3 November 2026, with the quantitative auction
     rendering accepted in the same review. */
  pl: { released: true, load: () => import('../../markets/pl/storyPack.js') },
  /* NEM: G-2 signed off 6 November 2026, with merge and publication authorised. */
  nem: { released: true, load: () => import('../../markets/nem/storyPack.js') },
  /* ERCOT: analyst confirmed completion and authorised merge/publication
     on 7 November 2026. Observed chart publication remains separately gated. */
  ercot: { released: true, load: () => import('../../markets/ercot/storyPack.js') },
};

/** The story entry for a market, or null when it has none or it is unreleased. */
export function storyFor(marketId, search = globalThis.location?.search ?? ''){
  const entry = STORIES[marketId];
  if (!entry) return null;
  if (entry.released) return entry;
  return new URLSearchParams(search).get('story') === 'preview' ? entry : null;
}

/* A separate public edition. G-1/G-2 flags above still govern the original,
   investor-scoped stories; they are never used as a public-content approval. */
export const PUBLIC_STORY_IDS = Object.freeze(['wa','nem','gb','de','it','ie','ro','pl','jp_tokyo','jp_kyushu','jp_hokkaido','pjm','ercot','caiso','fi']);
export function publicStoryFor(id){
  return PUBLIC_STORY_IDS.includes(id) ? {
    loadOverview: () => import('./public/overview.js'),
    load: () => import('./public/pack.js'),
  } : null;
}
/* Existing-history coverage is wider than the fifteen original Story scripts. */
export const HISTORY_ONLY_IDS=Object.freeze(['ca_on','sa','es']);
export function publicReadingFor(id){
  return publicStoryFor(id)||(HISTORY_ONLY_IDS.includes(id)?{
    loadOverview:()=>import('./public/overview.js'),
    load:()=>import('./public/pack.js'),
  }:null);
}
