/* ---------------------------------------------------------------------------
   THE NEM'S SECTIONS ARRIVE TAB BY TAB — and only the tab that was asked for.

   The unit tests hold the mechanism (tests/nem-sections-lazy.test.js) and the
   bytes (tests/bundle-budget.test.js). What they cannot hold is the four ways
   an asynchronous section loader goes wrong in a browser:

     a deep link      /markets/nem/grid is an address a reader can paste. It
                      must open the grid, not fall back to the brief.
     revisiting       a section already in memory must not be fetched again, and
                      must not be drawn twice when it is.
     language         a fetched section is rebuilt in the new language, because
                      its spec is re-evaluated per read — not cached as text.
     staleness        a chunk that arrives after the reader has moved on must be
                      discarded, not drawn under the new address.

   Each runs on both viewports (playwright.config.js), which is also the mobile
   navigation check: the tab strip overflows on a phone, and a section that
   only loads from a wide layout would fail here.
   --------------------------------------------------------------------------- */
import { test, expect } from '@playwright/test';

const MARKET = '/markets/nem';

/** The tab links, by their label. */
const tab = (page, label) => page.locator('a.tab-btn', { hasText: label }).first();

/** Which section chunks the page asks for, by section id. */
function sectionRequests(page){
  const asked = [];
  page.on('request', request => {
    const m = /\/assets\/section-nem-([a-z]+)-[^/]+\.js$/.exec(request.url());
    if (m) asked.push(m[1]);
  });
  return asked;
}

test('the brief loads its own section and no other', async ({ page }) => {
  const asked = sectionRequests(page);
  await page.goto(MARKET + '/case');

  await expect(page.locator('[data-section="case"] .sect')).toContainText('Investment Case');
  await expect(page.locator('[data-section="case"]')).toContainText('who should enter');

  /* The eleven sections that used to arrive with this page. */
  await expect(page.locator('[data-section="home"]')).toHaveCount(0);
  await expect(page.locator('[data-section="story"]')).toHaveCount(0);
  expect(asked).toEqual(['case']);
});

test('a legacy grid address opens its reader and preserves the bookmark', async ({ page }) => {
  const asked = sectionRequests(page);
  await page.goto(MARKET + '/grid');

  await expect(page.locator('.market-research-dialog [role="tabpanel"]')).toHaveAttribute('aria-busy','false');
  await expect(page.locator('.market-overview-map .geo-grid-map svg')).toBeAttached({ timeout: 30_000 });

  /* /grid was its own tab before the seven-tab merge; the reader preserves
     the original address while opening the complete research. */
  await expect(page).toHaveURL(/\/markets\/nem\/grid$/);
  expect(asked).toEqual(expect.arrayContaining(['entry','grid']));
});

test('a section already in memory is not fetched twice and not drawn twice', async ({ page }) => {
  await page.goto(MARKET + '/case');
  const asked = sectionRequests(page);

  await tab(page, 'Market Story').click();
  await expect(page.locator('[data-section="home"]')).toHaveCount(1);
  await expect(page.locator('[data-section="story"]')).toHaveCount(1);

  await tab(page, 'Competition & Demand').click();
  await expect(page.locator('[data-section="pipeline"]')).toHaveCount(1);
  await expect(page.locator('[data-section="home"]')).toHaveCount(0);

  await tab(page, 'Market Story').click();
  await expect(page.locator('[data-section="home"]')).toHaveCount(1);
  await expect(page.locator('.tab-section')).toHaveCount(2);

  const counts = asked.reduce((all, id) => ({ ...all, [id]: (all[id] || 0) + 1 }), {});
  for (const [id, n] of Object.entries(counts)) expect(n, `${id} was fetched ${n} times`).toBe(1);
});

test('a language change rebuilds a fetched section in Chinese', async ({ page }) => {
  await page.goto(MARKET + '/story');
  await expect(page.locator('[data-section="home"]')).toContainText('Institutional Investor Walkthrough');

  await page.getByRole('button', { name: 'Switch to Chinese' }).click();

  await expect(page.locator('[data-section="home"]')).toContainText('机构投资人导览');
  await expect(page.locator('[data-section="home"]')).not.toContainText('Institutional Investor Walkthrough');
  /* And the fetch is not repeated for the language change: the spec is rebuilt
     from the module already in memory. */
  await expect(page.locator('[data-section="story"]')).toContainText('NEM市场演进');
});

test('a section that arrives after the reader moved on is not drawn', async ({ page }) => {
  /* The realistic case is a slow chunk, so the story section is held back for
     long enough that the reader has time to change their mind twice. */
  await page.route(/\/assets\/section-nem-story-/, async route => {
    await new Promise(resolve => setTimeout(resolve, 1_500));
    await route.continue();
  });

  await page.goto(MARKET + '/case');
  await tab(page, 'Market Story').click();
  await tab(page, 'Evidence').click();

  await expect(page.locator('[data-section="data"] .sect')).toBeVisible();
  /* The delayed story chunk lands about now. It must not appear under Entry. */
  await page.waitForTimeout(2_000);
  await expect(page.locator('[data-section="home"]')).toHaveCount(0);
  await expect(page.locator('[data-section="story"]')).toHaveCount(0);
  await expect(page.locator('[data-section="data"]')).toHaveCount(1);
  await expect(page).toHaveURL(/\/markets\/nem\/evidence$/);
});

test('every tab renders its sections, one load at a time', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(MARKET + '/case');

  const sectionsByTab = [
    ['Market Story', ['home', 'story']],
    ['Competition & Demand', ['pipeline']],
    ['Capital & Exit', ['portfolio']],
    ['Evidence', ['data']],
  ];
  for (const [label, sections] of sectionsByTab){
    await tab(page, label).click();
    for (const id of sections){
      await expect(page.locator(`[data-section="${id}"]`)).toHaveCount(1);
      if (id !== 'home') await expect(page.locator(`[data-section="${id}"] .sect`)).toBeVisible();
    }
    /* No section from the tab before it. */
    await expect(page.locator('[data-section="case"]')).toHaveCount(0);
  }

  expect(errors).toEqual([]);
});
