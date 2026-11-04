/* ---------------------------------------------------------------------------
   THE ROLLOUT'S SECTIONS ARRIVE TAB BY TAB, ON EVERY MARKET AND VIEWPORT.

   Unit tests hold the mechanism (tests/market-sections-lazy.test.js), the
   content (tests/market-sections-parity.test.js) and the bytes
   (tests/bundle-budget.test.js). What they cannot hold is how an asynchronous
   section loader behaves in a browser:

     a deep link      /markets/<slug>/grid is an address a reader can paste
     revisiting       a section in memory is not fetched again, nor drawn twice
     language         a fetched section is rebuilt in the new language
     staleness        a chunk arriving after the reader moved on is discarded
     the page itself  the SVG grid map and the source drawers still render

   Both viewports come from playwright.config.js. The tab strip overflows on a
   phone, so a section that only loaded from a wide layout would fail here.
   See docs/p1-sections-rollout.md.
   --------------------------------------------------------------------------- */
import { test, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import path from 'node:path';

const MARKETS = [
  { id:'gb', slug:'great-britain' },
  { id:'ie', slug:'ireland'       },
  { id:'pl', slug:'poland'        },
  { id:'ro', slug:'romania'       },
];

/** The tab links, by their label. */
const tab = (page, label) => page.locator('a.tab-btn', { hasText: label }).first();

/** Which section chunks a page asks for, by section id. */
function sectionRequests(page, marketId){
  const asked = [];
  page.on('request', request => {
    const m = new RegExp(`\\/assets\\/section-${marketId}-([a-z]+)-[^/]+\\.js$`).exec(request.url());
    if (m) asked.push(m[1]);
  });
  return asked;
}

/* The rollout lands market by market, so an intermediate commit must not fail
   its browser suite for a market that is still one file. A split market has a
   sections/registry.js; the rest are skipped until their commit lands. */
const isSplit = (id) => existsSync(path.join(process.cwd(), 'src/markets', id, 'sections/registry.js'));

for (const { id, slug } of MARKETS){
  const MARKET = `/markets/${slug}`;

  test.describe(`${id} sections`, () => {
    test.skip(!isSplit(id), `${id} has not been migrated yet`);

    test('the brief loads its own section and no other', async ({ page }) => {
      const asked = sectionRequests(page, id);
      await page.goto(MARKET + '/case');

      await expect(page.locator('[data-section="case"] .sect')).toBeVisible();
      await expect(page.locator('[data-section="case"]')).toContainText('Investment Case');
      /* The sections that used to arrive with this page. */
      await expect(page.locator('[data-section="home"]')).toHaveCount(0);
      await expect(page.locator('[data-section="story"]')).toHaveCount(0);
      await expect(page.locator('[data-section="grid"]')).toHaveCount(0);
      expect(asked).toEqual(['case']);
    });

    test('a pasted deep link opens its section and rewrites the old address', async ({ page }) => {
      const asked = sectionRequests(page, id);
      await page.goto(MARKET + '/grid');

      await expect(page.locator('[data-section="grid"] .sect')).toBeVisible();
      /* /grid was its own tab before the seven-tab merge; the page rewrites
         the address in place to the tab that now holds it. */
      await expect(page).toHaveURL(new RegExp(`/markets/${slug}/entry/grid$`));
      expect([...new Set(asked)].sort()).toEqual(['entry', 'grid']);
    });

    test('every tab renders its sections, one load at a time', async ({ page }) => {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(MARKET + '/case');
      const asked = sectionRequests(page, id);

      const sectionsByTab = [
        ['Market Story', ['home', 'story']],
        ['Revenue & Design', ['capacity']],
        ['Entry & Delivery', ['entry', 'grid']],
        ['Competition & Demand', ['pipeline']],
        ['Capital & Exit', ['portfolio']],
        ['Evidence', ['data']],
      ];
      for (const [label, sections] of sectionsByTab){
        await tab(page, label).click();
        for (const sectionId of sections){
          await expect(page.locator(`[data-section="${sectionId}"]`)).toHaveCount(1);
          if (sectionId !== 'home') await expect(page.locator(`[data-section="${sectionId}"] .sect`)).toBeVisible();
        }
        /* No section from the tab before it. */
        await expect(page.locator('[data-section="case"]')).toHaveCount(0);
      }

      /* Back to a tab already in memory: no second fetch, no second draw. */
      await tab(page, 'Market Story').click();
      await expect(page.locator('[data-section="home"]')).toHaveCount(1);
      await expect(page.locator('.tab-section')).toHaveCount(2);
      const counts = asked.reduce((all, sectionId) => ({ ...all, [sectionId]: (all[sectionId] || 0) + 1 }), {});
      for (const [sectionId, n] of Object.entries(counts))
        expect(n, `${sectionId} was fetched ${n} times`).toBe(1);

      expect(errors).toEqual([]);
    });

    test('a language change rebuilds a fetched section', async ({ page }) => {
      await page.goto(MARKET + '/story');
      const home = page.locator('[data-section="home"]');
      await expect(home).toBeVisible();
      await page.getByRole('button', { name: 'Switch to Chinese' }).click();
      await expect(home).toContainText(/[\u4e00-\u9fff]{4,}/);
      /* The fetch is not repeated: the spec is rebuilt from the module already
         in memory, so the story section is still there too. */
      await expect(page.locator('[data-section="story"]')).toHaveCount(1);
    });

    test('a section arriving after the reader moved on is not drawn', async ({ page }) => {
      /* A slow chunk is the realistic case; hold the story section back long
         enough for the reader to change their mind twice. */
      await page.route(new RegExp(`/assets/section-${id}-story-`), async route => {
        await new Promise(resolve => setTimeout(resolve, 1_500));
        await route.continue();
      });

      await page.goto(MARKET + '/case');
      await tab(page, 'Market Story').click();
      await tab(page, 'Entry & Delivery').click();

      await expect(page.locator('[data-section="grid"] .sect')).toBeVisible();
      await page.waitForTimeout(2_000);
      await expect(page.locator('[data-section="home"]')).toHaveCount(0);
      await expect(page.locator('[data-section="story"]')).toHaveCount(0);
      await expect(page.locator('[data-section="grid"]')).toHaveCount(1);
      await expect(page).toHaveURL(new RegExp(`/markets/${slug}/entry$`));
    });

    test('the SVG grid map and the source drawers still render', async ({ page }) => {
      await page.goto(MARKET + '/entry/grid');
      await expect(page.locator('[data-section="grid"] .geo-grid-map svg')).toBeVisible({ timeout: 30_000 });

      /* A source drawer is attached to a CARD that carries a `src` binding, so
         it lives on the grid and story tabs — not on the evidence tab, whose
         sources are a registry TABLE. All four markets have them here; looking
         for them under [data-section="data"] would assert against an empty
         set and prove nothing. */
      const drawer = page.locator('.source-drawer').first();
      await expect(drawer).toBeVisible();
      await expect(drawer).toHaveJSProperty('open', false);
      await drawer.locator('summary').click();
      await expect(drawer).toHaveJSProperty('open', true);

      /* The evidence section's own source binding: a registry table, in both
         languages. `.first()` because the section holds several tables and a
         locator matching five of them is a strict-mode violation, not a pass. */
      await page.goto(MARKET + '/data');
      await expect(page.locator('[data-section="data"] .sect')).toBeVisible();
      await expect(page.locator('[data-section="data"] table').first()).toBeVisible();
      await expect(page.locator('[data-section="data"]')).toContainText('Source registry');
    });
  });
}
