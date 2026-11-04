/* ---------------------------------------------------------------------------
   PRODUCTION SMOKE RUN.

   Deliberately a separate config from playwright.config.js, not a tag on the
   existing suite. The two answer different questions and must not be able to
   drift into each other:

     playwright.config.js   does the whole site still behave? 168 assertions,
                            every market, both languages, six minutes.

     this file              is production serving the artefact we published?
                            six routes, structural assertions, under a minute.

   `npm run test:e2e` still runs the first one, before every deploy. This runs
   only after a publish, against the live URL, and reads its base URL from the
   environment so the same file works locally against `vite preview`.

   Assertions are structural on purpose — a landmark, a section id, a section
   that must have rows. No prices, no headline text, no counts that move with
   the data: a smoke test that fails because a market cleared at a different
   number teaches the operator to ignore it.
   --------------------------------------------------------------------------- */
import { defineConfig } from '@playwright/test';

const PORT = 4177;
const baseURL = process.env.PLATFORM_TEST_BASE_URL || `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './e2e-smoke',
  timeout: 45_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  /* Three workers for twelve short tests. These are network-bound navigations,
     not the render-heavy story suite, so there is little to gain above this and
     a live deployment should not be hit by eight browsers at once. */
  workers: Number(process.env.E2E_WORKERS) || 3,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  outputDir: 'test-results/smoke',
  use: {
    baseURL,
    channel: 'chromium',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 } } },
  ],
  /* Against production there is nothing to start. Locally the smoke run uses
     the built site, like the full suite — never the dev server. */
  webServer: process.env.PLATFORM_TEST_BASE_URL ? undefined : {
    command: `npm run preview -- --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: `http://127.0.0.1:${PORT}`,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
