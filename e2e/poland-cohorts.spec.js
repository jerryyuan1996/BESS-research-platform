import { test, expect } from '@playwright/test';

test('Poland keeps the grant and ordinary capacity calls separate in both languages', async ({ page }) => {
  await page.goto('/markets/poland');
  const choices = page.locator('.ic-play-selector');
  await expect(choices.locator('[data-play]')).toHaveCount(2);
  await expect(choices.locator('[data-play="pl-grant-4h"]')).toContainText('Situational');
  await expect(choices.locator('[data-play="pl-cap-4h"]')).toContainText('Watch');
  await expect(choices).toContainText('Select a case to update returns and financing below.');
  await expect(choices.locator('[data-play="pl-grant-4h"]')).toHaveAttribute('aria-pressed', 'true');
  const grantReturn = await page.locator('#decision .ix-metric strong').first().innerText();
  await choices.locator('[data-play="pl-cap-4h"]').click();
  await expect(choices.locator('[data-play="pl-cap-4h"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#decision .ix-metric strong').first()).not.toHaveText(grantReturn);
  await expect(page.locator('#decision')).toHaveCount(1);
  await page.getByRole('button', { name: 'Switch to Chinese', exact: true }).click();
  await expect(choices).toContainText('独立投资机会');
  await expect(choices.locator('[data-play="pl-grant-4h"]')).toContainText('择机投入');
  await expect(choices.locator('[data-play="pl-cap-4h"]')).toContainText('保持观察');
  await expect(choices.locator('[data-play="pl-cap-4h"]')).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2)).toBe(false);
});
