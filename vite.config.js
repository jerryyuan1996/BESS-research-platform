import { defineConfig } from 'vite';
import localData from './vite-plugin-local-data.js';
import viewChanges from './vite-plugin-view-changes.js';
import scout from './vite-plugin-scout.js';

// Static, public, no backend. History-API routing is handled in dev by Vite's
// SPA fallback (appType 'spa', the default) and in production by the `rewrites`
// rule in vercel.json.
export default defineConfig({
  base: '/',
  // Confidential payloads are available to the dev server and are structurally
  // absent from any build. See vite-plugin-local-data.js and docs/data-policy.md.
  // The changelog reaches the page as its last ten lines, never whole. See
  // vite-plugin-view-changes.js. Scout cards reach the home page as their four
  // calls and the /scout page whole. See vite-plugin-scout.js.
  plugins: [localData(), viewChanges(), scout()],
  build: {
    outDir: 'dist',
    target: 'es2020',
    /* Sourcemaps publish readable original source, including comments.
       docs/data-policy.md flagged this as a decision; it is now decided.
       A dist/ scan found confidential names reachable through the .map long
       after the bundle itself was clean, so this is off for production. */
    sourcemap: false,
    rollupOptions: {
      output: {
        /* NAME A MARKET CHUNK AFTER ITS MARKET.
           Every lazily-loaded dashboard entry is called `dashboard.js`, so
           Rollup's default naming produced `dashboard-mhaQJ28Y.js` and
           `dashboard-C5Og3hNx.js` — two files whose names say nothing about
           which market they are. That matters in three places a build is
           actually read: the build summary, the network panel when someone is
           diagnosing a slow market page, and tests/bundle-budget.test.js, which
           attributes bytes per market and cannot do that from a hash.

           The directory above the entry is the market id, which is exactly the
           label wanted. Anything not matching that shape keeps the default. */
        chunkFileNames(chunk){
          const id = chunk.facadeModuleId || '';
          const m = /[\\/]markets[\\/]([^\\/]+)[\\/]dashboard\.js$/.exec(id);
          if (m) return `assets/market-${m[1]}-[hash].js`;
          /* The dossier shell's entry module is page.js, which would otherwise
             emit as `page-<hash>.js` and say nothing about what it holds. */
          if (/[\\/]projects[\\/]dossier[\\/]page\.js$/.test(id)) return 'assets/dossier-shell-[hash].js';
          /* The Investment Case and Entry sections: the method layer, the view
             store and the ledgers, fetched only when one of those tabs opens. */
          if (/[\\/]components[\\/]investmentCase\.js$/.test(id)) return 'assets/investment-case-[hash].js';
          /* The home page's verdict board, and the Returns page that took over
             the old home content. Each is fetched by its own route. */
          if (/[\\/]home[\\/]verdictHome\.js$/.test(id)) return 'assets/verdict-board-[hash].js';
          if (/[\\/]home[\\/]returnsPage\.js$/.test(id)) return 'assets/returns-[hash].js';
          /* The changelog page, with every changelog line. Fetched by /changes
             and by nothing else. */
          if (/[\\/]changes[\\/]changesPage\.js$/.test(id)) return 'assets/changes-[hash].js';
          /* The scouting page, with every scout card whole. Fetched by /scout
             and by nothing else. */
          if (/[\\/]scout[\\/]scoutPage\.js$/.test(id)) return 'assets/scout-page-[hash].js';
          /* Two chunks Rollup factors out with no entry module to name them by.
             The method layer — anchors, investor tables, the view store and
             the ledgers — is shared by the home page's board and the
             Investment Case tab. The chart library is shared by the Returns
             page and every market. Left alone, the second is emitted as
             `index-[hash].js`, the same shape as the entry chunk's name. */
          const ids = chunk.moduleIds || [];
          if (ids.some(m => /[\\/]governance[\\/]investability\.js$/.test(m))) return 'assets/investment-method-[hash].js';
          if (ids.some(m => /[\\/]charts[\\/]barChart\.js$/.test(m))) return 'assets/charts-[hash].js';
          return 'assets/[name]-[hash].js';
        },
      },
    },
  },
  server: {
    // Honour PORT when the environment assigns one, so several checkouts (or
    // tooling that manages its own port) can run side by side.
    port: Number(process.env.PORT) || 5173,
    open: true,
  },
});
