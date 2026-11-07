import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('history loads visible pages, preserves older records and filters in both languages', async ({page}) => {
  const pages = [];
  page.on('request', request => { if(request.url().includes('/view-history-')) pages.push(request.url()); });
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  expect(pages).toHaveLength(0);
  await page.goto('/changes');
  await expect(page.locator('.cl-entry')).toHaveCount(40);
  expect(new Set(pages).size).toBe(3);
  await page.getByRole('button',{name:'Show more',exact:true}).click();
  await expect(page.locator('.cl-entry')).toHaveCount(80);
  const lines=(await readFile(new URL('../view/changelog.jsonl',import.meta.url),'utf8')).trim().split('\n').map(JSON.parse);
  const count=lines.filter(e=>e.market==='ie').length;
  await page.getByRole('combobox',{name:'Market',exact:true}).selectOption('ie');
  await expect(page).toHaveURL(/market=ie/);
  await expect(page.locator('.cl-entry')).toHaveCount(Math.min(40,count));
  await expect(page.locator('.cl-list')).toHaveAttribute('aria-busy','false');
  await page.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
  await expect(page.getByRole('combobox',{name:'市场',exact:true})).toHaveValue('ie');
  await expect(page.locator('.cl-entry')).toHaveCount(Math.min(40,count));
  await page.reload();
  await expect(page.locator('.cl-entry')).toHaveCount(Math.min(40,count));
});
