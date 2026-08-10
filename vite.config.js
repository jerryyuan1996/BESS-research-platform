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
  },
  server: {
    // Honour PORT when the environment assigns one, so several checkouts (or
    // tooling that manages its own port) can run side by side.
    port: Number(process.env.PORT) || 5173,
    open: true,
  },
});
