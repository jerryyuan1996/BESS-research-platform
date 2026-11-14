import {openLegacyStory} from './helpers/legacy-story.js';
/* Decision-console display corrections on the built public site. Both projects
   exercise actual 1440px desktop and 390px phone layouts, in EN and ZH. */
import { test, expect } from '@playwright/test';
import { opportunities } from '../src/experience/model.js';
import { expectCompleteHistory } from './helpers/research-history.js';

const unresolved=/\{[A-Za-z][A-Za-z0-9]*\}|\bnull\b|undefined|NaN/;
test.beforeEach(async({page,baseURL})=>{
  const siteOrigin=new URL(baseURL).origin;
  await page.route(/^https:\/\//,route=>new URL(route.request().url()).origin===siteOrigin?route.continue():route.abort());
  await page.emulateMedia({reducedMotion:'reduce'});
});
const fits=async locator=>expect(await locator.evaluate(el=>el.scrollWidth<=el.clientWidth+2)).toBe(true);

test('NEM: thirteen shots, live counterpoint, execution and dated public history stay correct in both languages',async({page},info)=>{
  test.setTimeout(120000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const counterpoint=opportunities('infraFund').find(r=>r.id==='nem').decision.counterpoint;
  await page.goto('/markets/nem');
  const trigger=page.locator('.public-story-trigger');await openLegacyStory(page);
  const dialog=page.locator('.ix-story-dialog');await expect(dialog).toBeVisible();
  for(const [index,lang]of ['en','zh'].entries()){
    if(index)await dialog.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
    await expect(dialog.locator('article.ix-shot')).toHaveCount(13);
    expect(await dialog.innerText()).not.toMatch(unresolved);
    const factors=dialog.locator('[data-shot=nem-12] .ix-story-factors');
    await expect(factors).toContainText(counterpoint[index]);
    await factors.scrollIntoViewIfNeeded();await fits(dialog);
    await factors.screenshot({path:info.outputPath('nem-factors-'+lang+'.png')});
  }
  await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);
  const execution=page.locator('#execution');
  const executionText=[];
  for(const [index,lang]of ['zh','en'].entries()){
    if(index)await page.getByRole('button',{name:'切换到英文',exact:true}).click();
    await expect(execution.locator('.ix-delivery-timelines')).toBeVisible();
    executionText.push(await execution.innerText());
    expect(executionText.at(-1)).not.toMatch(unresolved);
    await execution.scrollIntoViewIfNeeded();await fits(execution);
    await execution.screenshot({path:info.outputPath('nem-execution-'+lang+'.png')});
  }
  await page.locator('.public-story-trigger').click();
  const publicDialog=page.locator('.public-story-dialog');
  for(const [index,lang]of ['en','zh'].entries()){
    if(index)await publicDialog.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
    await expectCompleteHistory(page,'nem',lang);
    const first=publicDialog.locator('[data-history-node]').first();
    await expect(first.locator('[data-history-field=y]')).toHaveText('2017–2023');
    await expect(first.locator('[data-history-field=p]')).toContainText(index?'AEMC于2021年7月15日制定':'AEMC made the final rule');
    await expect(first.locator('[data-history-field=p]')).toContainText(index?'AEMO于2023年10月9日启动':'AEMO opened those markets on 9 October 2023');
    const sources=publicDialog.locator('.public-full-history .source-popup-trigger').first();
    await sources.click();
    const sourcePopup=publicDialog.locator('dialog.source-popup[open]');
    await expect(sourcePopup.locator('a[href$="/fast-frequency-response"]')).toBeVisible();
    await sourcePopup.locator('.source-popup-close').click();
    await expect(sourcePopup).toHaveCount(0);
    await expect(sources).toBeFocused();
    expect(await publicDialog.innerText()).not.toMatch(unresolved);await fits(publicDialog);
    await first.scrollIntoViewIfNeeded();await first.screenshot({path:info.outputPath('nem-fcas-history-'+lang+'.png')});
  }
  expect(errors).toEqual([]);
});

for(const region of ['tokyo','kyushu','hokkaido'])test(`Japan ${region}: all fourteen shots fit desktop and phone in both languages`,async({page},info)=>{
  test.setTimeout(120000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/markets/japan-'+region);await openLegacyStory(page);
  const dialog=page.locator('.ix-story-dialog');await expect(dialog).toBeVisible();
  for(const [index,lang]of ['en','zh'].entries()){
    if(index)await dialog.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
    await expect(dialog.locator('article.ix-shot')).toHaveCount(14);
    await expect(dialog.locator('.ix-marker')).toHaveCount(14);
    expect(await dialog.innerText()).not.toMatch(unresolved);await fits(dialog);
    expect(await dialog.locator('.ix-shot,.jp-scene,.jp-panel').evaluateAll(nodes=>nodes.filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>el.className))).toEqual([]);
    await dialog.locator('[data-shot=jp-08]').scrollIntoViewIfNeeded();
    await page.screenshot({path:info.outputPath('japan-'+region+'-'+lang+'.png')});
  }
  await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);
  expect(errors).toEqual([]);
});
