/* Storage shim, verbatim from the prototype (lines 344-352).

   Kept even though the srcdoc iframes that motivated it are gone: browsers still
   throw on localStorage access when cookies are blocked, in private-mode variants,
   and on file:// pages with storage restricted. Preferences degrade to session-only
   rather than taking the page down. */
// Storage shim. Browsers throw on localStorage in opaque/embedded contexts (a srcdoc
// iframe, a file:// page with storage restricted). The dashboards read it at boot, so
// an unguarded call would stop the page rendering entirely. Preferences degrade to
// session-only rather than failing.
const LS = {
  get(k){ try { return localStorage.getItem(k); } catch (e){ return null; } },
  set(k, v){ try { localStorage.setItem(k, v); } catch (e){} },
  del(k){ try { localStorage.removeItem(k); } catch (e){} },
};

export { LS };
