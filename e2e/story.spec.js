/* The market story shell (immersive-experience plan, WP-03), on the built site.
   Until its release PR the WA story opens only with ?story=preview. */
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // committed assets only, as in platform.spec.js
  await page.route(/^https:\/\//, route => new URL(route.request().url()).origin === process.env.PLATFORM_TEST_BASE_URL ? route.continue() : route.abort());
});

const open = async (page) => {
  await page.goto('/markets/western-australia?story=preview');
  const trigger = page.locator('.ix-full-research');
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.locator('.ix-story-dialog');
  await expect(dialog).toBeVisible();
  return { trigger, dialog };
};

test('the WA story reads end to end, in both languages, and gives focus back', async ({ page }, info) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  const { trigger, dialog } = await open(page);
  await expect(dialog.getByRole('button', { name: 'Close the story' })).toBeFocused();
  await expect(dialog.locator('article.ix-shot')).toHaveCount(13);
  await expect(dialog.locator('.ix-marker')).toHaveCount(13);

  // figures are read from the model's fields, not typed
  await expect(dialog.locator('[data-shot="wa-08"] .ix-shot-copy')).toContainText('builds 8 hours');
  await expect(dialog.locator('[data-shot="wa-06"] .ix-shot-copy')).toContainText('7 hours for batteries first credited');
  await expect(dialog.locator('[data-shot="wa-03"] .ix-node').first()).toContainText('2006');

  // shot and chapter navigation move focus to the heading they reach
  await dialog.getByRole('button', { name: 'Next →' }).click();
  await expect(dialog.locator('#ix-shot-wa-01')).toBeFocused();
  await dialog.getByRole('button', { name: /Today's tensions/ }).click();
  await expect(dialog.locator('#ix-shot-wa-05')).toBeFocused();
  await expect(dialog.getByRole('button', { name: /Today's tensions/ })).toHaveAttribute('aria-current', 'true');
  await dialog.screenshot({ path: info.outputPath('story-en.png') });

  // Chinese at the same place, then back
  await dialog.getByRole('button', { name: 'Switch to Chinese' }).click();
  await expect(dialog.locator('[data-shot="wa-05"] h4')).toHaveText('晴天的中午会发生什么？');
  await expect(dialog.locator('[data-shot="wa-08"] .ix-shot-copy')).toContainText('建设8小时');
  await expect(dialog.locator('.ix-marker-strong').first()).toHaveText('证据充分');
  await expect(dialog.locator('#ix-story-title')).toContainText('故事');
  await expect(dialog.locator('#ix-story-title')).not.toContainText('Western Australia');
  await dialog.screenshot({ path: info.outputPath('story-zh.png') });
  await dialog.getByRole('button', { name: '切换到英文' }).click();
  await expect(dialog.locator('[data-shot="wa-05"] h4')).toHaveText('What happens on a sunny midday?');

  // the full research sits one layer deeper and returns to the story
  await dialog.getByRole('button', { name: 'Full research ↗' }).click();
  const research = page.locator('.ix-research-dialog');
  await expect(research).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(research).toHaveCount(0);
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test('the story hands the reader to the investment case', async ({ page }) => {
  const { dialog } = await open(page);
  await dialog.getByRole('link', { name: 'Go to the investment case' }).first().click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('#bankable')).toBeFocused();
});

test('every exit in the last chapter reaches its market-page section', async ({ page }) => {
  for (const [label, anchor] of [['Revenue', 'revenue'], ['Execution', 'execution'], ['Downside', 'downside']]){
    const { dialog } = await open(page);
    await dialog.locator('.ix-story-exits').getByRole('link', { name: label, exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator(`#${anchor}`)).toBeFocused();
  }
});

test('without the preview flag the market page keeps the research dialog', async ({ page }) => {
  await page.goto('/markets/western-australia');
  await page.locator('.ix-full-research').click();
  await expect(page.locator('.ix-research-dialog')).toBeVisible();
  await expect(page.locator('.ix-story-dialog')).toHaveCount(0);
});
