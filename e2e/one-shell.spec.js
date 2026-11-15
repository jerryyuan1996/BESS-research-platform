import { test, expect } from '@playwright/test';

const routes = ['/', '/returns', '/markets/italy', '/data', '/changes', '/scout', '/investment-lab', '/desk', '/policy'];
const resources = new Set(['/data', '/changes', '/scout', '/investment-lab', '/desk']);

for (const lang of ['en', 'zh']) {
  test(`one shell: bilingual route titles and 375px layout (${lang})`, async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.addInitScript(language => localStorage.setItem('hub_lang', language), lang);
    const titles = [];
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.locator('#route-announcement')).toHaveText(await page.title());
      await expect(page.locator('.ix-header')).toHaveCount(1);
      await expect(page.locator('.ix-footer')).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
      await expect(page.locator('main [aria-busy="true"]')).toHaveCount(0, { timeout: 60_000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route).toBe(true);
      await page.screenshot({ path: testInfo.outputPath(`${route.replaceAll('/', '_') || 'home'}-${lang}.png`) });
      if (resources.has(route)) {
        titles.push(await page.title());
        const levels = await page.locator('main h1, main h2, main h3, main h4, main h5, main h6').evaluateAll(nodes => nodes.map(n => Number(n.tagName.slice(1))));
        expect(levels[0], route).toBe(1);
        expect(levels.filter(n => n === 1), route).toHaveLength(1);
        for (let i = 1; i < levels.length; i++) expect(levels[i], `${route}: heading ${i}`).toBeLessThanOrEqual(levels[i - 1] + 1);
      }
    }
    expect(new Set(titles).size).toBe(resources.size);
    expect(errors).toEqual([]);
  });
}

async function tabTo(page, selector, reverse = false) {
  for (let i = 0; i < 500; i++) {
    if (await page.evaluate(s => document.activeElement?.matches(s), selector)) return;
    await page.keyboard.press(reverse ? 'Shift+Tab' : 'Tab');
  }
  throw new Error(`Keyboard could not reach ${selector}`);
}

for (const language of ['en', 'zh']) {
  for (const [slug, section, kind] of [
    ['great-britain', 'revenue/capacity', 'line'],
    ['finland', 'story', 'bar'],
    ['nem', 'revenue/energy', 'band'],
  ]) {
    test(`legacy chart keyboard and exact table at 375px: ${slug} ${language}`, async ({ page }, testInfo) => {
      test.setTimeout(180_000);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.addInitScript(lang => localStorage.setItem('hub_lang', lang), language);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`/markets/${slug}/${section}`);
      const selector = `.chart[data-chart-type="${kind}"]`;
      const chart = page.locator(selector).first();
      await expect(chart).toBeVisible();
      await expect(chart.locator('svg').first()).toHaveAttribute('role', 'img');
      await expect(chart.locator('svg > title')).not.toBeEmpty();
      await expect(chart.locator('svg > desc')).toContainText('Escape');
      await expect(chart.locator('details')).not.toHaveAttribute('open', '');
      await tabTo(page, `${selector} .chart-point`);
      const label = await page.locator(':focus').getAttribute('aria-label');
      await expect(page.locator('#tip')).toBeVisible();
      expect((await page.locator('#tip').innerText()).replace(/\s+/g, ' ').trim()).toBe(label);
      await expect.poll(() => page.locator(':focus').evaluate(el => { const r = el.getBoundingClientRect(); return r.top >= -1 && r.bottom <= innerHeight + 1; })).toBe(true);
      expect(await page.locator('#tip').evaluate(el => { const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight; })).toBe(true);
      await page.screenshot({ path: testInfo.outputPath(`${slug}-${language}-focus.png`) });
      await page.keyboard.press('Escape');
      await expect(page.locator('#tip')).toBeHidden();
      await expect(chart).toBeVisible();
      await page.keyboard.press('Tab');
      await expect(page.locator('#tip')).toBeVisible();
      await tabTo(page, `${selector} .chart-table > summary`);
      await page.keyboard.press('Enter');
      await expect(chart.locator('table')).toBeVisible();
      expect(await chart.locator('tbody tr').count()).toBeGreaterThan(0);
      await page.keyboard.press('Tab');
      await expect(chart.locator('.tbl-wrap')).toBeFocused();
      await page.keyboard.press('ArrowRight');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.screenshot({ path: testInfo.outputPath(`${slug}-${language}-table.png`) });
      expect(errors).toEqual([]);
    });
  }
}

test('route changes, Back and language changes keep keyboard focus and announce the title', async ({ page }) => {
  test.setTimeout(300_000);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.locator('main h1')).toBeFocused();
  await tabTo(page, '.ix-menu-toggle', true);
  await page.keyboard.press('Enter');
  await tabTo(page, '.ix-header a[href="/returns"]', true);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/returns$/);
  await expect(page.locator('main h1')).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText(await page.title());
  await tabTo(page, '.ix-language', true);
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.locator('.ix-language')).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText(await page.title());
  await tabTo(page, 'a[href^="/markets/italy"]');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/markets\/italy(?:\?|$)/);
  await expect(page.locator('main h1')).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText(await page.title());
  for (const route of ['/data', '/changes', '/scout', '/investment-lab', '/desk', '/policy']) {
    await tabTo(page, `.ix-footer a[href="${route}"]`, true);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page.locator('main h1')).toBeFocused();
    await expect(page.locator('#route-announcement')).toHaveText(await page.title());
  }
  await tabTo(page, '.ix-language', true);
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.ix-language')).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText(await page.title());
  await page.goBack();
  await expect(page.locator('main h1')).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText(await page.title());
});
