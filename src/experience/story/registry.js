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
export const STORIES = {
  wa: { released: true, load: () => import('../../markets/wa/storyPack.js') },
  fi: { released: true, load: () => import('../../markets/fi/storyPack.js') },
  de: { released: true, load: () => import('../../markets/de/storyPack.js') },
  gb: { released: false, load: () => import('../../markets/gb/storyPack.js') },
};

/** The story entry for a market, or null when it has none or it is unreleased. */
export function storyFor(marketId, search = globalThis.location?.search ?? ''){
  const entry = STORIES[marketId];
  if (!entry) return null;
  if (entry.released) return entry;
  return new URLSearchParams(search).get('story') === 'preview' ? entry : null;
}
