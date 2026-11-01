import { test, expect } from '@playwright/test';

test('home defers the market detail renderer until a market is opened', async ({page}) => {
  const detail=[];
  page.on('request',request=>{if(request.url().includes('/marketPage-'))detail.push(request.url());});
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  expect(detail).toHaveLength(0);
  await page.goto('/markets/ireland');
  await expect(page.locator('#bankable')).toBeVisible();
  expect(detail.length).toBeGreaterThan(0);
  await expect(page.locator('#revenue')).toBeVisible();
});
