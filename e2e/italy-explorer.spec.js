import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test.beforeEach(async ({ page }) => {
  await page.route(/^https:\/\//, route => route.abort());
  await page.addInitScript(() => localStorage.setItem('hub_lang', 'zh'));
});

async function visit(page) {
  await page.goto('/markets/italy');
  await expect(page.locator('.market-overview-map')).toHaveAttribute('aria-busy', 'false');
  await expect(page.locator('.market-overview-map .geo-map-pane svg')).toBeVisible();
  await expect(page.locator('.market-overview-context')).toHaveAttribute('aria-busy', 'false');
}

async function capture(locator, name, testInfo) {
  await mkdir('.tmp/it-demo', { recursive: true });
  await locator.screenshot({ path: `.tmp/it-demo/${testInfo.project.name}-${name}.png` });
}

test('Italy overview fronts all six zones, keeps map controls and a single reading entrance', async ({ page }, testInfo) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await visit(page);
  const overview = page.locator('.market-overview');
  await expect(overview.locator('.public-overview-art')).toHaveCount(0);
  await expect(overview.locator('.public-chapter-steps,.public-source-date')).toHaveCount(0);
  const context = overview.locator('.market-overview-context');
  await expect(context.locator('h3')).toContainText('六个报价区');
  await expect(context.locator('tbody tr')).toHaveCount(6);
  await context.locator('summary').click();
  await expect(context.locator('.why')).toBeVisible();
  await expect(context.locator('.why')).toContainText('不同区域意味着不同的路径集合');
  await context.locator('summary').click();
  const map = overview.locator('.geo-grid-map');
  const initialChoice = await map.locator('select').inputValue();
  await map.locator('[data-period="past"]').click();
  await expect(map.locator('[data-period="past"]')).toHaveAttribute('aria-pressed', 'true');
  await map.locator('[data-period="future"]').click();
  await expect(map.locator('[data-period="future"]')).toHaveAttribute('aria-pressed', 'true');
  await map.locator('[data-period="current"]').click();
  const select = map.locator('select');
  const original = await select.inputValue();
  await select.selectOption({ index: 2 });
  expect(await select.inputValue()).not.toBe(original);
  await expect(map.locator('.geo-map-detail h4')).not.toBeEmpty();
  await map.locator('.geo-zoom-btn').nth(1).click();
  await expect(map.locator('svg')).not.toHaveAttribute('data-zoom', '1.00');
  await map.locator('.geo-zoom-btn').nth(2).click();
  await expect(map.locator('svg')).toHaveAttribute('data-zoom', '1.00');
  await map.locator('.market-map-options > summary').click();
  const layer = map.locator('.geo-layer-toggle.node input');
  await layer.uncheck(); await expect(layer).not.toBeChecked(); await layer.check();
  await map.locator('.market-map-options > summary').click();
  await select.selectOption(initialChoice);
  const legendBox = await map.locator('.geo-map-legend').boundingBox();
  const paneBox = await map.locator('.geo-map-pane').boundingBox();
  const detailBox = await map.locator('.geo-map-detail').boundingBox();
  expect(legendBox.y + legendBox.height).toBeLessThanOrEqual(paneBox.y + paneBox.height);
  expect(detailBox.y).toBeGreaterThanOrEqual(paneBox.y + paneBox.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await capture(overview, 'overview', testInfo);
  await overview.locator('.public-story-trigger').click();
  await expect(page.locator('.public-story-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(overview.locator('.public-story-trigger')).toBeFocused();
  expect(errors).toEqual([]);
});

test('grid reader includes congestion, relief, permitting and delivery with language and focus recovery', async ({ page }, testInfo) => {
  await visit(page);
  const trigger = page.locator('[data-market-research="grid"]');
  await trigger.click();
  const dialog = page.locator('.market-research-dialog');
  await expect(dialog.locator('[role="tabpanel"]')).toHaveAttribute('aria-busy', 'false');
  await expect(dialog.getByRole('tab')).toHaveCount(4);
  await expect(dialog).toContainText('拥塞登记表');
  await capture(dialog, 'grid', testInfo);
  await dialog.getByRole('tab', { name: /具名输电缓解工程/ }).click();
  await expect(dialog.locator('table')).toHaveCount(2);
  await dialog.getByRole('tab', { name: /具名输电缓解工程/ }).press('ArrowDown');
  await expect(dialog.getByRole('tab', { name: /并网与许可/ })).toBeFocused();
  await dialog.getByRole('tab', { name: /并网与许可/ }).click();
  await expect(dialog).toContainText('STMG');
  await dialog.getByRole('tab', { name: /进入与交付/ }).click();
  await expect(dialog.locator('.ix-research-card-body')).not.toBeEmpty();
  await expect(dialog.locator('table').first()).toBeVisible();
  await dialog.locator('.market-reader-language').click();
  await expect(dialog).toHaveAttribute('lang', 'en');
  await expect(dialog.locator('[aria-selected="true"]')).toContainText('Entry & Delivery');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('[data-market-research="grid"]')).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('revenue reader exposes all four original sections and opens the evidence library', async ({ page }, testInfo) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await visit(page);
  await capture(page.locator('#revenue-drivers'), 'revenue-entrance', testInfo);
  const chapters = page.locator('#revenue-drivers > details');
  await expect(chapters).toHaveCount(4);
  for (const chapter of await chapters.all()) {
    await chapter.locator(':scope > summary').click();
    const body = chapter.locator('.market-revenue-body');
    await expect(body).toHaveAttribute('aria-busy','false');
    await expect(body.locator('.market-revenue-decision .why')).toBeVisible();
    expect(await body.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
    await chapter.locator(':scope > summary').click();
  }
  await chapters.first().locator(':scope > summary').click();
  await chapters.first().locator('.market-revenue-body > .ix-text-link').click();
  await expect(page.locator('.market-research-dialog')).toHaveCount(0);
  await expect(page).toHaveURL(/\/markets\/italy\/evidence/);
  expect(errors).toEqual([]);
});
