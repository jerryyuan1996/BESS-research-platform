import { defineConfig } from 'vite';
import localData from './vite-plugin-local-data.js';
import viewChanges from './vite-plugin-view-changes.js';
import scout from './vite-plugin-scout.js';
import viewBoard from './vite-plugin-view-board.js';
import briefing from './vite-plugin-briefing.js';
import { execFileSync } from 'node:child_process';

// Static, public, no backend. History-API routing is handled in dev by Vite's
// SPA fallback (appType 'spa', the default) and in production by the `rewrites`
// rule in vercel.json.
export default defineConfig({
  base: '/',
  define: { __MODEL_COMMIT__: JSON.stringify(process.env.RELEASE_SHA || execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()) },
  // Confidential payloads are available to the dev server and are structurally
  // absent from any build. See vite-plugin-local-data.js and docs/data-policy.md.
  // The changelog reaches the page as its last ten lines, never whole. See
  // vite-plugin-view-changes.js. Scout cards reach the home page as their four
  // calls and the /scout page whole. See vite-plugin-scout.js. A market's view
  // and ledger reach the home page as grades, calls and amounts, and its own
  // dashboard whole. See vite-plugin-view-board.js.
  plugins: [localData(), viewChanges(), scout(), viewBoard(), briefing()],
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
          if (/[\\/]experience[\\/]pages\.js$/.test(id)) return 'assets/investor-experience-[hash].js';
          /* A market's story: its content, the story shell and the isometric
             kit, fetched when the reader opens the story (immersive-experience
             plan, WP-03). The shell takes the market page's helpers as
             arguments instead of importing them: an import from the page's
             own chunk would make Rollup export from it and drop its name. */
          const story = /[\\/]markets[\\/]([^\\/]+)[\\/]storyPack\.js$/.exec(id);
          if (story) return `assets/story-${story[1]}-[hash].js`;
          const delivery = /[\\/]markets[\\/]([^\\/]+)[\\/]buildPathway\.js$/.exec(id);
          if (delivery) return `assets/delivery-${delivery[1]}-[hash].js`;
          const m = /[\\/]markets[\\/]([^\\/]+)[\\/]dashboard\.js$/.exec(id);
          if (m) return `assets/market-${m[1]}-[hash].js`;
          /* A market that fetches its sections one at a time (P1 pilot): each
             section is a chunk of its own, and both the build summary and
             tests/bundle-budget.test.js have to be able to say which one they
             are reading. The directory is the market, the file is the section. */
          const section = /[\\/]markets[\\/]([^\\/]+)[\\/]sections[\\/]([^\\/]+)\.js$/.exec(id);
          if (section) return `assets/section-${section[1]}-${section[2]}-[hash].js`;
          /* The dossier shell's entry module is page.js, which would otherwise
             emit as `page-<hash>.js` and say nothing about what it holds. */
          if (/[\\/]projects[\\/]dossier[\\/]page\.js$/.test(id)) return 'assets/dossier-shell-[hash].js';
          /* The Investment Case and Entry sections: the method layer, the view
             store and the ledgers, fetched only when one of those tabs opens. */
          if (/[\\/]components[\\/]investmentCase\.js$/.test(id)) return 'assets/investment-case-[hash].js';
          /* A ledger that states a timing is fetched by another market's
             Entry tab, to draw the two exposure curves on shared axes, so it
             is a chunk of its own. Every one is called entryLedger.js. */
          const ledger = /[\\/]markets[\\/]([^\\/]+)[\\/]entryLedger\.js$/.exec(id);
          if (ledger) return `assets/ledger-${ledger[1]}-[hash].js`;
          /* The home page's verdict board, and the Returns page that took over
             the old home content. Each is fetched by its own route. */
          if (/[\\/]home[\\/]verdictHome\.js$/.test(id)) return 'assets/verdict-board-[hash].js';
          /* The briefing that opens the home page (guided-experience plan, PR 4),
             with the home projection of the briefing, and the analyst desk with
             the whole of it. Each is fetched by its own route; the board above is
             now fetched from the briefing's fold. */
          if (/[\\/]home[\\/]briefingHome\.js$/.test(id)) return 'assets/briefing-home-[hash].js';
          if (/[\\/]desk[\\/]deskPage\.js$/.test(id)) return 'assets/desk-[hash].js';
          if (/[\\/]home[\\/]returnsPage\.js$/.test(id)) return 'assets/returns-[hash].js';
          /* The changelog page, with every changelog line. Fetched by /changes
             and by nothing else. */
          if (/[\\/]changes[\\/]changesPage\.js$/.test(id)) return 'assets/changes-[hash].js';
          if (id.includes('virtual:bess-view-history/')) return 'assets/view-history-[name]-[hash].js';
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
          // Shared helpers can remove the facade id after a route is split.
          // Keep the home renderer identifiable so budgets count its real graph.
          if (ids.some(m => /[\\/]experience[\\/]pages\.js$/.test(m))) return 'assets/investor-experience-[hash].js';
          /* The home projection of the briefing, shared by the home page and
             every market's brief since PR 5 of the guided-experience plan. */
          if (ids.some(m => /[\\/]briefing[\\/]homeData\.js$/.test(m))) return 'assets/briefing-data-[hash].js';
          /* What to build, for the deep tabs of GB, WA and Japan (PR 7): the
             design projection of the briefing, without the rest of it. */
          if (ids.some(m => /[\\/]briefing[\\/]designData\.js$/.test(m))) return 'assets/design-answer-[hash].js';
          if (ids.some(m => /[\\/]governance[\\/]investability\.js$/.test(m))) return 'assets/investment-method-[hash].js';
          if (ids.some(m => /[\\/]charts[\\/]barChart\.js$/.test(m))) return 'assets/charts-[hash].js';
          /* The two chunks a market with lazily-loaded sections factors out and
             that have no entry module to be named by: the shared constants every
             section reads (sections/shared.js) and the grid map the story and
             grid tabs both draw. Without these they would be emitted as
             `shared-<hash>.js` and `gridMapData-<hash>.js`, which say nothing
             about which market they belong to. */
          if (ids.some(m => /[\\/]markets[\\/]nem[\\/]sections[\\/]shared\.js$/.test(m))) return 'assets/nem-sections-shared-[hash].js';
          if (ids.some(m => /[\\/]markets[\\/]nem[\\/]gridMapData\.js$/.test(m))) return 'assets/nem-grid-map-data-[hash].js';
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
