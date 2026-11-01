import { test, expect } from '@playwright/test';

test('Poland keeps the grant and ordinary capacity calls separate in both languages', async ({ page }) => {
  await page.goto('/markets/poland');
  const choices = page.locator('.ix-play-choices');
  await expect(choices.locator('[data-play]')).toHaveCount(2);
  await expect(choices.locator('[data-play="pl-grant-4h"]')).toContainText('Situational');
  await expect(choices.locator('[data-play="pl-cap-4h"]')).toContainText('Watch');
  await expect(choices.locator('.ix-basis-note')).toContainText('Financial case below:');
  await expect(page.locator('#decision')).toHaveCount(1);
  await page.getByRole('button', { name: 'Switch to Chinese', exact: true }).click();
  await expect(page.locator('.ix-play-choices')).toContainText('两类独立投资机会');
  await expect(page.locator('[data-play="pl-grant-4h"]')).toContainText('择机投入');
  await expect(page.locator('[data-play="pl-cap-4h"]')).toContainText('保持观察');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2)).toBe(false);
});
