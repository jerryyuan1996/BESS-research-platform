import { defineConfig } from 'vite';

// Static, public, no backend. History-API routing is handled in dev by Vite's
// SPA fallback (appType 'spa', the default) and in production by public/_redirects.
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    target: 'es2020',
    sourcemap: true,
  },
  server: {
    port: 5173,
    open: true,
  },
});
