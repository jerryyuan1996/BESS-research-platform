import {test,expect} from '@playwright/test';
import {servePolicy} from '../tests/helpers/policy-ui-fixture.mjs';

const series=[
  {id:'one',source:'Synthetic feed',title:'Great Britain battery auction',summary:'Original publisher excerpt.',url:'https://example.org/gb',t:'2026-11-12T01:00:00Z',category:'policy'},
  {id:'two',source:'Synthetic feed',title:'Western Australia energy storage',summary:'Regional electricity news.',url:'https://example.org/wa',t:'2026-11-11T01:00:00Z',category:'grid'},
  {id:'three',source:'Synthetic feed',title:'Japan battery investment',summary:'National storage news.',url:'https://example.org/jp',t:'2026-11-10T01:00:00Z',category:'capital'},
  {id:'four',source:'Synthetic feed',title:'Global storage technology',summary:'<img src=x onerror=alert(1)>',url:'https://example.org/global',t:'2026-11-09T01:00:00Z',category:'technology'},
];
test.beforeEach(async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('hub_lang','en'));
  await servePolicy(page);
  await page.route('**/data/public/industry-news.json',r=>r.fulfill({json:{series,fetchedAt:'2026-11-12T02:00:00Z',derived:{sourceStatus:[{source:'Synthetic feed',status:'ok'}]}}}));
});
test('one radar combines policy and news with separate map counts and URL filters',async({page},info)=>{
  await page.goto('/policy');
  await expect(page.getByRole('heading',{name:'Global intelligence radar',exact:true})).toBeVisible();
  await expect(page.locator('.policy-event')).toHaveCount(8);await expect(page.locator('[data-news-item]')).toHaveCount(4);
  await expect(page.locator('.ix-header a[href="/news"]')).toHaveCount(0);
  await expect(page.locator('[data-jurisdiction=GB]')).toContainText('Policy 2 · News 1');
  await expect(page.locator('[data-jurisdiction=JP]')).toContainText('News 1');
  await expect(page.locator('[data-map-jurisdiction=GB] .intelligence-map-news')).toHaveCount(1);
  if(info.project.name==='mobile')await page.getByRole('button',{name:'Coverage map',exact:true}).click();
  await page.locator('[data-map-jurisdiction=GB]').focus();await page.keyboard.press('Enter');
  await expect(page.getByLabel('Jurisdiction',{exact:true})).toHaveValue('GB');
  await expect(page.locator('[data-news-item]')).toHaveCount(1);
  await expect(page.locator('.policy-event')).toHaveCount(2);
  if(info.project.name==='mobile')await page.getByRole('button',{name:'Event feed',exact:true}).click();
  await page.getByRole('button',{name:'Great Britain battery auction',exact:true}).click();
  await expect(page.getByRole('region',{name:'News preview'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Read the original article ↗'})).toHaveAttribute('href','https://example.org/gb');
  await page.keyboard.press('Escape');await expect(page.getByRole('region',{name:'News preview'})).toHaveCount(0);
  await page.getByRole('button',{name:'Switch to Chinese'}).click();
  await expect(page.getByRole('heading',{name:'全球情报雷达'})).toBeVisible();await expect(page.getByLabel('司法辖区',{exact:true})).toHaveValue('GB');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test('old news URL opens the same reader; news filters, safe preview and calendar still work',async({page})=>{
  await page.goto('/news');await expect(page).toHaveURL(/\/policy\?type=news$/);
  await expect(page.locator('.policy-event')).toHaveCount(0);await expect(page.locator('[data-news-item]')).toHaveCount(4);
  await page.getByLabel('Jurisdiction',{exact:true}).selectOption('unmapped');
  await expect(page.locator('[data-news-item]')).toHaveCount(1);
  await page.getByRole('button',{name:'Global storage technology'}).click();
  await expect(page.getByRole('region',{name:'News preview'})).toContainText('<img src=x onerror=alert(1)>');
  await expect(page.locator('.policy-page img')).toHaveCount(0);
  await page.getByRole('button',{name:'Close preview',exact:true}).click();
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();
  await page.locator('.intelligence-advanced>summary').click();
  await page.getByLabel('News topic',{exact:true}).selectOption('capital');
  await expect(page.locator('[data-news-item]')).toHaveCount(1);await expect(page.locator('.policy-event')).toHaveCount(0);
  await page.reload();await expect(page.getByLabel('News topic',{exact:true})).toHaveValue('capital');
  await page.locator('#event-watch>summary').click();
  await expect(page.locator('#calendar .nw-cal-month').first()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test('each source can fail independently without hiding the other stream',async({page})=>{
  await page.route('**/data/public/industry-news.json',r=>r.fulfill({status:503,body:''}));
  await page.goto('/policy');await expect(page.locator('.policy-event')).toHaveCount(8);
  await expect(page.getByText('News could not be loaded.',{exact:false})).toBeVisible();
  await page.unroute('**/data/public/industry-news.json');
  await page.route('**/data/public/industry-news.json',r=>r.fulfill({json:{series}}));
  await page.route('**/data/public/policy/index.json',r=>r.fulfill({status:503,body:''}));
  await page.reload();await expect(page.locator('[data-news-item]')).toHaveCount(4);
  await expect(page.locator('.policy-event')).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Verified policy evidence is unavailable'})).toBeVisible();
});
test('market scope keeps WA news out of NEM and includes Japan regional news correctly',async({page})=>{
  await page.goto('/markets/nem/policy');await expect(page.locator('.policy-event')).toHaveCount(2);await expect(page.locator('[data-news-item]')).toHaveCount(0);
  await page.goto('/markets/western-australia/policy');await expect(page.locator('.policy-event')).toHaveCount(2);await expect(page.locator('[data-news-item]')).toHaveCount(1);
  await page.goto('/markets/japan-kyushu/policy');await expect(page.locator('[data-news-item]')).toHaveCount(1);await expect(page.locator('.policy-event')).toHaveCount(0);
});
