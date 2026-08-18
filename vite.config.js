import { defineConfig } from 'vite';
import localData from './vite-plugin-local-data.js';

// Static, public, no backend. History-API routing is handled in dev by Vite's
// SPA fallback (appType 'spa', the default) and in production by the `rewrites`
// rule in vercel.json.
export default defineConfig({
  base: '/',
  // Confidential payloads are available to the dev server and are structurally
  // absent from any build. See vite-plugin-local-data.js and docs/data-policy.md.
  plugins: [localData()],
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
