import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {newsTextPair,hasNewsTranslation} from '../src/news/localization.js';
import {NEWS_ZH} from '../src/news/translations.zh.js';
const snapshot=JSON.parse(readFileSync(new URL('../public/data/public/industry-news.json',import.meta.url)));
test.beforeEach(async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('hub_lang','zh'));
  await page.route('**/data/public/industry-news.json',r=>r.fulfill({json:snapshot}));
});
test('all feed pages use matching Chinese translations and preserve unmatched source text',async({page},info)=>{
  await page.goto('/policy?type=news');
  const observed=new Set();
  for(let p=0;p<10;p++){
    await expect(page.locator('[data-news-item]').first()).toBeVisible();
    const cards=await page.locator('[data-news-item]').evaluateAll(nodes=>nodes.map(node=>({id:node.dataset.newsItem,title:node.querySelector('button').textContent,summary:node.querySelector('p')?.textContent||''})));
    for(const card of cards){
      const item=snapshot.series.find(n=>'news:'+n.url===card.id);expect(item).toBeTruthy();observed.add(item.url);
      expect(card.title).toBe(newsTextPair(item)[1]);expect(card.summary).toBe(newsTextPair(item,'summary')[1].replace(/\s*The post[\s\S]*$/,''));
      if(hasNewsTranslation(item))expect(card.title).toMatch(/[\u3400-\u9fff]/);
    }
    const next=page.getByRole('button',{name:'下一页事件',exact:true});
    if(!await next.isVisible())break;
    await next.click();
  }
  expect(observed.size).toBe(snapshot.series.length);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.goto('/policy');
  await expect(page.locator('[data-news-item]').first()).toBeVisible();
  await expect(page.locator('[data-map-jurisdiction=DE]')).toBeAttached();
  await page.screenshot({path:`.tmp/intelligence-localized-${info.project.name}.png`,fullPage:info.project.name==='mobile'});
});
test('Chinese search and preview share translations; English restores original source text',async({page})=>{
  const [url,translation]=Object.entries(NEWS_ZH).find(([,r])=>r.title[0].includes('Wagerup'));
  const item={url,title:translation.title[0],summary:translation.summary[0],source:'Energy-Storage.news',t:'2026-11-12T00:00:00Z',category:'grid'};
  await page.route('**/data/public/industry-news.json',r=>r.fulfill({json:{...snapshot,series:[item]}}));
  await page.goto('/policy?type=news&q='+encodeURIComponent('西澳 Wagerup'));
  await expect(page.locator('[data-news-item]')).toHaveCount(1);
  await page.getByRole('button',{name:newsTextPair(item)[1],exact:true}).click();
  const preview=page.getByRole('region',{name:'新闻预览'});
  await expect(preview).toContainText(newsTextPair(item,'summary')[1]);
  await expect(preview.getByRole('link',{name:'阅读原始报道 ↗'})).toHaveAttribute('href',item.url);
  await page.getByRole('button',{name:'切换到英文',exact:true}).click();
  await expect(page.getByRole('region',{name:'News preview'})).toContainText(item.title);
  await expect(page.getByRole('region',{name:'News preview'})).toContainText(item.summary);
});
test('source completion receipt distinguishes official collectors from web checks',async({page})=>{
  await page.goto('/policy?market=wa');await page.locator('.intelligence-sources>summary').click();
  await expect(page.locator('[data-policy-source-check=wa]')).toHaveCount(2);
  await expect(page.locator('.intelligence-sources')).toContainText('直接采集成功');
  await expect(page.locator('.intelligence-sources')).toContainText('已通过网页阅读核对；直接采集受限');
  await expect(page.locator('.intelligence-sources')).toContainText('2026-11-12');
  await expect(page.locator('[data-policy-source-check=de]')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
