import {test,expect} from '@playwright/test';
import {historySlugs,historyInvestors,expectCompleteHistory} from './helpers/research-history.js';
import {PUBLIC_VERSION} from '../src/experience/story/public/catalog.js';
const historyOnly=['ca_on','sa','es'];
test.beforeEach(async({page})=>{await page.route(/^https:\/\//,route=>route.abort());});
function coverage(){for(const id of historyOnly)test(id+' · existing history for every investor and language',async({page})=>{
  test.setTimeout(180000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  for(const locale of ['en','zh'])for(const investor of historyInvestors){
    await page.evaluate(({locale,investor})=>{localStorage.setItem('hub_lang',locale);localStorage.setItem('hub_lens',investor);},{locale,investor});
    await page.goto('/markets/'+historySlugs[id]);
    const trigger=page.locator('.public-story-trigger');await expect(trigger).toBeVisible();
    const context=page.locator('.market-overview-context');
    await expect(context).toHaveAttribute('aria-busy','false');
    await expect(context.locator('.market-context-card')).toBeVisible();
    const bounds=await trigger.boundingBox(),card=await context.boundingBox();
    expect(bounds.y).toBeGreaterThanOrEqual(card.y+card.height);
    expect(bounds.y-card.y-card.height).toBeLessThanOrEqual(21);
    await expect(page.getByRole('combobox',{name:locale==='en'?'Investor profile':'投资者类型',exact:true})).toHaveValue(investor);
    await expect(page.locator('#overview [data-date-kind=g1]')).toHaveCount(0);
    await trigger.click();await expectCompleteHistory(page,id,locale);
    const dialog=page.locator('.public-story-dialog');await expect(dialog.locator('.public-story-nav button')).toHaveCount(2);
    await dialog.locator('[data-chapter=research]').click();await expect(dialog.locator('.public-history-provenance')).toBeVisible();
    await expect(dialog.locator('.public-chapter[data-chapter=research]')).toContainText(locale==='en'?'Market development history from the existing research.':'既有研究中的市场发展历程。');
    await expect(dialog.locator('.public-chapter-footer')).toContainText(locale==='en'?'Existing research history':'既有研究历程');
    expect(await dialog.locator('.public-story-nav button').evaluateAll(buttons=>buttons.map(button=>button.dataset.chapter))).toEqual(['history','research']);
    await expect(dialog.locator('.public-scene-host,.public-power-scene')).toHaveCount(0);
    await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(trigger).toBeFocused();
  }
  expect(errors).toEqual([]);
});}
test.describe('history-only desktop and phone',coverage);
test.describe('history-only portrait iPad',()=>{test.use({viewport:{width:820,height:1180},hasTouch:true});coverage();});

test.describe('landscape iPad full history',()=>{
  test.use({viewport:{width:1024,height:768},hasTouch:true});
  for(const [id,slug]of Object.entries(historySlugs))test(id+' · full landscape history in both languages',async({page})=>{
    test.setTimeout(120000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('/');
    for(const locale of ['en','zh']){
      await page.evaluate(locale=>localStorage.setItem('hub_lang',locale),locale);
      await page.goto('/markets/'+slug);const trigger=page.locator('.public-story-trigger');await expect(trigger).toBeVisible();await trigger.tap();
      await expectCompleteHistory(page,id,locale);
      const body=page.locator('.public-story-body');
      expect(await body.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
      await page.locator('.public-full-history [data-history-node]').last().scrollIntoViewIfNeeded();
      await expect(page.locator('.public-full-history [data-history-node]').last()).toBeInViewport();
      const provenance=page.locator('.public-history-provenance');await provenance.locator('summary').tap();await expect(provenance).toHaveAttribute('open','');
      await expect(provenance.locator('a').last()).toBeVisible();
      await page.locator('.public-story-head button').filter({hasText:locale==='en'?'Close':'关闭'}).click();
      await expect(page.locator('.public-story-dialog')).toHaveCount(0);await expect(trigger).toBeFocused();
    }
    expect(errors).toEqual([]);
  });
});

for(const id of ['gb','wa'])test(id+' · long history preserves reading place, sources, focus and chapter navigation',async({page})=>{
  test.setTimeout(120000);await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/markets/'+historySlugs[id]);const trigger=page.locator('.public-story-trigger');await trigger.click();
  await expectCompleteHistory(page,id,'en');const dialog=page.locator('.public-story-dialog'),body=dialog.locator('.public-story-body');
  const anchor=await dialog.locator('[data-history-node]').nth(4).getAttribute('data-history-node');
  await body.evaluate((body,anchor)=>{const node=body.querySelector(`[data-history-node="${anchor}"]`);body.scrollTop+=node.getBoundingClientRect().top-body.getBoundingClientRect().top-30;},anchor);
  await dialog.getByRole('button',{name:'Switch to Chinese'}).click();await expectCompleteHistory(page,id,'zh');
  const offset=await body.evaluate((body,anchor)=>body.querySelector(`[data-history-node="${anchor}"]`).getBoundingClientRect().top-body.getBoundingClientRect().top,anchor);
  expect(Math.abs(offset-30)).toBeLessThan(3);
  // Read the END of a capital-lens paragraph. Preserving an English event's
  // outer offset alone scrolls the shorter Chinese paragraph entirely away.
  await dialog.getByRole('button',{name:'切换到英文'}).click();await expectCompleteHistory(page,id,'en');
  const progress=await body.evaluate((body,anchor)=>{
    const field=body.querySelector(`[data-history-node="${anchor}"] [data-history-field="i"]`);
    body.scrollTop+=field.getBoundingClientRect().bottom-body.getBoundingClientRect().top-35;
    const r=field.getBoundingClientRect(),v=body.getBoundingClientRect();
    return {fraction:(v.top-r.top)/r.height,visible:Math.min(r.bottom,v.bottom)-Math.max(r.top,v.top)};
  },anchor);
  expect(progress.visible).toBeGreaterThanOrEqual(24);
  await dialog.getByRole('button',{name:'Switch to Chinese'}).click();await expectCompleteHistory(page,id,'zh');
  const translated=await body.evaluate((body,anchor)=>{
    const r=body.querySelector(`[data-history-node="${anchor}"] [data-history-field="i"]`).getBoundingClientRect(),v=body.getBoundingClientRect();
    return {top:r.top-v.top,height:r.height,visible:Math.min(r.bottom,v.bottom)-Math.max(r.top,v.top)};
  },anchor);
  expect(translated.visible).toBeGreaterThanOrEqual(Math.min(24,translated.height)-1);
  const target=-Math.min(progress.fraction*translated.height,Math.max(0,translated.height-Math.min(24,translated.height)));
  expect(Math.abs(translated.top-target)).toBeLessThan(3);
  const source=dialog.locator('.public-history-provenance');await source.locator('summary').scrollIntoViewIfNeeded();await source.locator('summary').focus();await page.keyboard.press('Enter');await expect(source).toHaveAttribute('open','');
  await expect(source.locator('a').last()).toBeVisible();
  const deep=page.url();expect(deep).toContain('public-zh-'+PUBLIC_VERSION.replace('.','-')+'-history');
  await dialog.locator('.public-story-nav button[data-chapter=system]').click();await expect(dialog.locator('.public-power-scene')).toBeVisible();
  await page.goBack();await expectCompleteHistory(page,id,'zh');
  await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(trigger).toBeFocused();
  await page.goto(deep);await expectCompleteHistory(page,id,'zh');await page.keyboard.press('Escape');
});

test('Japan history keeps national events and the current region across regional deep links',async({page})=>{
  await page.goto('/markets/japan-tokyo');await page.locator('.public-story-trigger').click();
  for(const id of ['jp_tokyo','jp_kyushu','jp_hokkaido']){
    if(id!=='jp_tokyo')await page.getByRole('combobox',{name:'Japan region'}).selectOption(id);
    await expectCompleteHistory(page,id,'en');
    const regions=page.locator('.public-history-region');await expect(regions).toHaveCount(3);
    const current=regions.filter({hasText:'Current region'});await expect(current).toHaveCount(1);
    await expect(current).toContainText({jp_tokyo:'Tokyo',jp_kyushu:'Kyushu',jp_hokkaido:'Hokkaido'}[id]);
    await expect(page.locator('.public-full-history [data-history-node]').nth(2)).toContainText('Kyushu output control begins');
    expect(page.url()).toContain(historySlugs[id]);
  }
});

test('a failed history-only data chapter retains the summary and retries the requested chapter',async({page})=>{
  let fail=true;await page.route(/\/assets\/public-history-.*\.js/,route=>fail?route.abort():route.continue());
  await page.goto('/markets/ontario');await page.locator('.public-story-trigger').click();
  const retry=page.getByRole('button',{name:'Retry chapter'});await expect(retry).toBeVisible();
  await expect(page.locator('.public-story-dialog')).toContainText('The first storage procurements');
  fail=false;await retry.click();await expectCompleteHistory(page,'ca_on','en');
});
