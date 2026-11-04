/* ---------------------------------------------------------------------------
   WHAT PRODUCTION HAS TO PROVE.

   The full suite already ran against this build before it was uploaded, and the
   exact `.vercel/output` bytes were scanned before the upload. Repeating 168
   assertions against the live domain proved the same thing a second time and
   cost 8.4 minutes of a 9.7-minute publish job (P0-1 baseline).

   What the live step uniquely proves is narrower, and this file asserts exactly
   that:

     · the domain serves the site at all;
     · a direct visit to a deep link works — the History-API rewrite, which no
       local test can prove because Vite handles it in development;
     · the market chunk for a representative dashboard is served, so a deploy
       that dropped an asset fails here rather than on a reader's screen;
     · no uncaught error reaches the console on the routes that matter.

   Five tests across both viewports. 1.2–1.8 minutes locally against a preview
   server, and every assertion is one that would mean "the publish is broken",
   not "a number moved".
   --------------------------------------------------------------------------- */
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLATFORM_TEST_BASE_URL || 'http://127.0.0.1:4177';
const ORIGIN = new URL(BASE_URL).origin;

/* Committed assets and data only. The site loads no analytics beyond Vercel's
   own beacon and no web fonts, and a production run should not wait on either. */
test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\//, route => {
    const url = new URL(route.request().url());
    return url.origin === ORIGIN ? route.continue() : route.abort();
  });
});

/**
 * Everything that would make this route broken rather than different.
 *
 * A 404 on a chunk or a data file is a failure; a 404 on `/release.json` is not,
 * because a local preview has no release stamp. Uncaught exceptions are always
 * failures. Console errors are not collected: the page logs recoverable warnings
 * and this suite is not the place to adjudicate them.
 */
function watchForBreakage(page){
  const problems = [];

  page.on('pageerror', error => problems.push(`uncaught: ${error.message}`));

  const isEssential = (raw) => {
    try {
      const url = new URL(raw);
      if (url.origin !== ORIGIN) return false;
      return url.pathname.startsWith('/assets/') || url.pathname.startsWith('/data/');
    } catch {
      return false;
    }
  };

  page.on('response', response => {
    if (response.status() < 400) return;
    if (isEssential(response.url()) || response.status() >= 500){
      problems.push(`HTTP ${response.status()} ${response.url()}`);
    }
  });

  page.on('requestfailed', request => {
    const reason = request.failure()?.errorText ?? '';
    if (reason.includes('ERR_ABORTED')) return;
    if (isEssential(request.url())) problems.push(`request failed (${reason}) ${request.url()}`);
  });

  return problems;
}

/** Routes chosen because each one exercises a different part of the shell. */
const ROUTES = {
  home: { path: '/', ready: '#app select[aria-label="Investor profile"]' },
  gb: { path: '/markets/great-britain', ready: '#bankable' },
  wa: { path: '/markets/western-australia', ready: '#bankable' },
  news: { path: '/news', ready: '#headlines' },
  returns: { path: '/returns', ready: '.ix-results tbody tr' },
};

test('the home page renders', async ({ page }) => {
  const problems = watchForBreakage(page);

  await page.goto(ROUTES.home.path);
  await expect(page.locator(ROUTES.home.ready)).toBeVisible();
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('h1')).not.toBeEmpty();

  expect(problems, problems.join('\n')).toEqual([]);
});

test('both representative market dashboards render, chunk and all', async ({ page }) => {
  const problems = watchForBreakage(page);
  const chunks = [];
  page.on('response', response => {
    const { pathname } = new URL(response.url());
    if (/^\/assets\/marketPage-[^/]*\.js$/.test(pathname)) chunks.push(`${response.status()} ${pathname}`);
  });

  for (const route of [ROUTES.gb, ROUTES.wa]){
    await page.goto(route.path);
    await expect(page.locator(route.ready), `${route.path} did not render ${route.ready}`).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  }

  /* The detail renderer is the chunk a deploy would most plausibly drop: the
     home page defers it (e2e/market-loading.spec.js asserts that), so if the
     market route renders without it, production is serving a stale or partial
     artefact. Assert the chunk was requested and answered, not its hash. */
  assertChunksServed(chunks);
  expect(problems, problems.join('\n')).toEqual([]);
});

/**
 * At least one `marketPage-*` chunk must have been served with a 200.
 *
 * A separate helper so the assertion reads as what it means. 304 is not a
 * failure — a repeat visit revalidates — so the check accepts any success code
 * and only rejects "nothing was fetched at all".
 */
function assertChunksServed(chunks){
  const served = chunks.filter(c => /^2\d\d /.test(c));
  expect(served.length, `the market renderer chunk was not served (${chunks.join(', ') || 'no request'})`)
    .toBeGreaterThan(0);
}

test('the news page and the cross-market investment view open', async ({ page }) => {
  const problems = watchForBreakage(page);

  await page.goto(ROUTES.news.path);
  await expect(page.locator(ROUTES.news.ready)).toBeAttached();
  await expect(page.locator('#bell .nw-bell, #bell .nw-quiet').first()).toBeVisible();

  await page.goto(ROUTES.returns.path);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.ix-results tbody tr').first()).toBeVisible();

  expect(problems, problems.join('\n')).toEqual([]);
});

test('a deep link is served directly rather than falling back to the home page', async ({ page }) => {
  const problems = watchForBreakage(page);

  /* A market section, not a market root: this is the path that only works when
     the production rewrite and the client router both behave. The router
     canonicalises a section to its containing tab, so the address bar may end up
     as /markets/great-britain/entry/grid — what matters is the market and the
     section, not the exact segment count. */
  await page.goto('/markets/great-britain/grid');
  await expect(page.locator('.geo-grid-map svg')).toBeVisible();
  await expect(page.locator('h1')).toContainText('Great Britain');
  expect(new URL(page.url()).pathname).toContain('/markets/great-britain');

  expect(problems, problems.join('\n')).toEqual([]);
});

test('the layout does not overflow this viewport', async ({ page }) => {
  const problems = watchForBreakage(page);

  for (const route of [ROUTES.home, ROUTES.wa]){
    await page.goto(route.path);
    await expect(page.locator(route.ready)).toBeVisible();
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    expect(overflows, `${route.path} overflows horizontally at ${test.info().project.name} width`).toBe(false);
  }

  expect(problems, problems.join('\n')).toEqual([]);
});
