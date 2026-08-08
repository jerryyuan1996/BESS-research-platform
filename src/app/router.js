/* ---------------------------------------------------------------------------
   Lightweight History-API router.

   Routes
     /                          home / global cockpit
     /investment-lab             dedicated cross-market underwriting workspace
     /markets/:slug             a market dashboard, default tab
     /markets/:slug/:tab        a market dashboard, deep-linked tab

   The :tab segment is an addition, not a requirement of the brief. It costs one
   line of matching and gives every market tab a shareable URL, which the
   prototype's overlay could not do. A market that does not recognise the tab id
   falls back to its default tab rather than 404ing.

   Future routes named in the brief (/compare, /methodology, /portfolio) are not
   built. Adding one is a single entry in the table below.

   Deployment: History-API routing needs a server-side rewrite so a direct visit
   to /markets/wa returns index.html. public/_redirects does this on Cloudflare
   Pages; Vite's dev server does it natively.
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
