/* ---------------------------------------------------------------------------
   Lightweight History-API router.

   Routes
     /                          home: verdicts by investor
     /returns                   the cross-market returns view (the old home page)
     /changes                   every change to the view, by market and author
     /investment-lab             dedicated cross-market underwriting workspace
     /projects/:slug            a project dossier, absent from every build
     /projects/:slug/:tab       a dossier, deep-linked tab
     /markets/:slug             a market dashboard, default tab
     /markets/:slug/:tab        a market dashboard, deep-linked tab

   The :tab segment is an addition, not a requirement of the brief. It costs one
   line of matching and gives every market tab a shareable URL, which the
   prototype's overlay could not do. A market that does not recognise the tab id
   falls back to its default tab rather than 404ing.

   Future routes named in the brief (/compare, /methodology) are not built.
   Adding one is a single entry in the table below.

   Deployment: History-API routing needs a server-side rewrite so a direct visit
   to /markets/wa returns index.html. The `rewrites` rule in vercel.json does
   this in production; Vite's dev server does it natively.

   That rule is a catch-all, and it is safe only because Vercel checks the
   filesystem BEFORE applying rewrites — /assets/index-abc.js and
   /data/public/fx-ecb.json are real files and are served as themselves. If a
   future change moves the rewrite ahead of the filesystem, every asset on the
   site starts returning the HTML shell with a 200, which looks like a blank
   page rather than an error.
   --------------------------------------------------------------------------- */

const listeners = new Set();

/**
 * Parses a pathname into a route descriptor. Never throws; unknown → notFound.
 *
 * `search` carries view state that is not part of the resource being addressed.
 * Today that is `?region=` on a multi-region market: /markets/japan-tokyo names
 * the allocation point, and ?region=compare says to show all three side by side
 * rather than that one. Keeping it in the query rather than the path means the
 * comparison view is still linkable without inventing a market that does not
 * exist as an allocation point.
 */
export function parseRoute(pathname, search = ''){
  const parts = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  const params = new URLSearchParams(search);
  const view = { region: params.get('region') };

  if (parts.length === 0) return { name: 'home', ...view };

  /* /data — the public data-status page. Added with the live-data layer: a site
     that fetches automatically owes its reader a page saying what it fetched,
     how stale it is, and what the automation was allowed to touch. */
  if (parts[0] === 'data' && parts.length === 1) return { name: 'data', ...view };
  if (parts[0] === 'investment-lab' && parts.length === 1) return { name: 'investmentLab', ...view };
  /* /returns — the league table, revenue stack, $1M engine, waterfall and
     certainty frontier. This was the home page until verdicts took its place. */
  if (parts[0] === 'returns' && parts.length === 1) return { name: 'returns', ...view };
  /* /changes — the whole changelog. The two filters are view state, so they
     ride in the query: /changes?market=wa&author=rule is a link to "every
     change a rule has made in Western Australia". */
  if (parts[0] === 'changes' && parts.length === 1){
    return { name: 'changes', market: params.get('market'), author: params.get('author'), ...view };
  }

  /* /projects/:slug — a project dossier. Confidential in its entirety, so in a
     production build every slug resolves to nothing and the page renders a 404.
     That is deliberate: a "withheld" page appearing only for real slugs would
     confirm which deal codenames exist. See projects/dossier/page.js. */
  if (parts[0] === 'projects' && parts.length >= 2){
    return {
      name: 'dossier',
      slug: decodeURIComponent(parts[1]),
      tab: parts[2] ? decodeURIComponent(parts[2]) : null,
      ...view,
    };
  }
  if (parts[0] === 'news' && parts.length === 1) return { name: 'news', ...view };


  if (parts[0] === 'markets'){
    if (parts.length === 1) return { name: 'home', ...view };   // /markets → home
    return {
      name: 'market',
      slug: decodeURIComponent(parts[1]),
      tab: parts[2] ? decodeURIComponent(parts[2]) : null,
      ...view,
    };
  }

  return { name: 'notFound', path: pathname, ...view };
}

export function currentRoute(){
  return parseRoute(window.location.pathname, window.location.search);
}

/** Pushes a new URL and notifies subscribers. No-op if the URL is unchanged. */
export function navigate(href, { replace = false } = {}){
  const url = new URL(href, window.location.origin);
  if (url.pathname === window.location.pathname && url.search === window.location.search){
    notify();
    return;
  }
  if (replace) window.history.replaceState({}, '', url);
  else window.history.pushState({}, '', url);
  notify();
}

export function onRouteChange(fn){
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify(){
  const r = currentRoute();
  for (const fn of listeners) fn(r);
}

/** Wires popstate. Call once, from app.js. */
export function startRouter(){
  window.addEventListener('popstate', notify);
  notify();
}
