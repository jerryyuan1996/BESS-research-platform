import {openLegacyStory} from './helpers/legacy-story.js';
import {test,expect} from '@playwright/test';
import {story} from '../src/markets/gb/story.js';
import {opportunities} from '../src/experience/model.js';
import {operatingPrice} from '../src/experience/projectFacts.js';
const GB='/markets/great-britain',PREVIEW=GB+'?story=preview';
const expectedOperating=operatingPrice(opportunities('infraFund').find(r=>r.id==='gb').investment);
test.beforeEach(async({page})=>{
  await page.route(/^https:\/\//,route=>new URL(route.request().url()).origin===process.env.PLATFORM_TEST_BASE_URL?route.continue():route.abort());
});
async function open(page,url=PREVIEW){
  await page.goto(url);const trigger=page.locator('.public-story-trigger');await trigger.scrollIntoViewIfNeeded();await openLegacyStory(page);
  const dialog=page.locator('.ix-story-dialog');await expect(dialog).toBeVisible();return {trigger,dialog};
}

test('GB reads all thirteen approved shots in both languages with the operating-price basis',async({page},info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(PREVIEW);
  const trigger=page.locator('.public-story-trigger');await openLegacyStory(page);const dialog=page.locator('.ix-story-dialog');
  await expect(dialog).toBeVisible();await expect(dialog.locator('article.ix-shot')).toHaveCount(13);await expect(dialog.locator('.ix-marker')).toHaveCount(13);
  await expect(dialog.locator('.k-scene')).toHaveCount(12);await expect(dialog.locator('.gb-opening-thumb')).toHaveCount(1);
  await expect(dialog.locator('.ix-story-play-title')).toContainText(story.reviewedAgainst.hours+'h');
  await expect(dialog.locator('.gb-opening-basis')).toContainText('building it new');await expect(dialog.locator('.gb-opening-price')).toContainText(expectedOperating[0]);
  await expect(dialog.locator('[data-shot=gb-06] .ix-marker')).toHaveClass(/ix-marker-thin/);
  await dialog.getByRole('button',{name:'Start the story',exact:true}).click();await expect(dialog.locator('#ix-shot-gb-01')).toBeFocused();
  await dialog.getByRole('button',{name:/Today's tensions/}).click();
  await expect(dialog.locator('[data-chart=Chart-GB-FILL]')).toHaveAttribute('data-mode','observed',{timeout:30000});
  await dialog.locator('[data-shot=gb-05]').screenshot({path:info.outputPath('gb-chart-en.png')});
  await dialog.getByRole('button',{name:'Switch to Chinese'}).click();
  await expect(dialog.locator('[data-shot=gb-01] h4')).toHaveText(story.chapters[0].shots[0].question[1]);
  await expect(dialog.locator('[data-shot=gb-06] .ix-marker')).toHaveText(/证据单薄/);
  await expect(dialog.locator('.gb-opening-basis')).toHaveText('所示回报为新建项目情景');
  await expect(dialog.locator('[data-chart=Chart-GB-FILL]')).toHaveAttribute('data-mode','observed');
  await dialog.locator('[data-shot=gb-05]').screenshot({path:info.outputPath('gb-chart-zh.png')});
  await page.keyboard.press('Escape');await expect(trigger).toBeFocused();expect(errors).toEqual([]);
});

test('GB keyboard teaching controls preserve the case, URL and translated local state',async({page})=>{
  await page.goto(PREVIEW+'&view=story&chapter=battery&shot=gb-08');const dialog=page.locator('.ix-story-dialog');
  await expect(dialog.locator('#ix-shot-gb-08')).toBeFocused();const before=await page.locator('#bankable').innerText();
  const shot=dialog.locator('[data-shot=gb-08]'),longer=shot.getByRole('button',{name:'Longer battery (Example)',exact:true});
  await longer.focus();const url=page.url(),history=await page.evaluate(()=>window.history.length);await page.keyboard.press('Enter');
  await expect(shot.locator('[data-teaching-hours]')).not.toHaveAttribute('data-teaching-hours',String(story.reviewedAgainst.hours));
  await expect(longer).toHaveAttribute('aria-pressed','true');expect(page.url()).toBe(url);expect(await page.evaluate(()=>window.history.length)).toBe(history);
  await dialog.getByRole('button',{name:'Switch to Chinese'}).click();await expect(shot.getByRole('button',{name:'较长时长（示例）',exact:true})).toHaveAttribute('aria-pressed','true');
  await dialog.getByRole('button',{name:'切换到英文'}).click();await page.keyboard.press('Escape');
  expect(await page.locator('#bankable').innerText()).toBe(before);
});

test('GB numeric prices, battery MW and the monthly table retain their method and units',async({page})=>{
  const {dialog}=await open(page),shot=dialog.locator('[data-shot=gb-05]');
  await expect(shot.locator('[data-chart=Chart-GB-FILL]')).toHaveAttribute('data-mode','observed',{timeout:30000});
  await shot.getByRole('button',{name:'Dynamic Regulation',exact:true}).click();
  expect(Number(await shot.locator('svg').getAttribute('data-price-min'))).toBeLessThan(0);
  await expect(shot.locator('[data-service=DRH][data-field=price]')).not.toHaveCount(0);await expect(shot.locator('[data-field=batteryMW]')).not.toHaveCount(0);
  await expect(shot.locator('[data-service=DCL]')).toHaveCount(0);await expect(shot).toContainText('Supported by National Energy SO Open Data');
  await expect(shot.locator('.gb-data-status')).toContainText('Coverage (UTC)');await expect(shot.locator('.gb-data-status')).toContainText('Edge months may be partial');
  await shot.locator('.gb-method > summary').click();await expect(shot.locator('.gb-method')).toContainText('weighted by cleared MW');
  await shot.locator('.gb-monthly > summary').click();await expect(shot.locator('table')).toBeVisible();await expect(shot.locator('table')).toContainText('£/MW/h');await expect(shot.locator('table')).toContainText('Other or unlabelled');
  const prices=await shot.locator('tbody tr td:nth-child(3)').allTextContents();expect(prices.some(p=>p.trim().startsWith('-'))).toBeTruthy();
  await expect(shot.locator('svg')).not.toContainText('£/MWh');await expect(shot.locator('[data-event=OBP]')).toHaveCount(1);
});

test('GB unavailable data shows an unscaled Example and a retry, with one evidence marker',async({page})=>{
  await page.route('**/data/public/gb-*.summary.json',route=>route.abort());
  const {dialog}=await open(page),shot=dialog.locator('[data-shot=gb-05]');
  await expect(shot.getByRole('button',{name:'Could not load data; retry',exact:true})).toBeVisible();
  await expect(shot.locator('[data-chart=Chart-GB-FILL]')).toHaveAttribute('data-mode','example');await expect(shot.locator('svg')).toContainText('Example');
  await expect(shot.locator('.gb-tick')).toHaveCount(0);await expect(shot.locator('.gb-observed-line')).toHaveCount(0);await expect(shot.locator('.ix-marker')).toHaveCount(1);
});

test('GB stays lazy until its existing market research button opens the story',async({page})=>{
  const requests=[];page.on('request',r=>requests.push(r.url()));
  const storyRequests=()=>requests.filter(u=>/\/story-gb-|\/gb-(dynamic|eac)-response\.summary\.json/.test(u));
  await page.goto('/');await expect(page.locator('main')).toBeVisible();expect(storyRequests()).toEqual([]);
  await page.goto(GB);const trigger=page.locator('.public-story-trigger');await expect(trigger).toBeVisible();expect(storyRequests()).toEqual([]);
  await openLegacyStory(page);await expect(page.locator('.ix-story-dialog')).toBeVisible();await expect(page.locator('.ix-research-dialog')).toHaveCount(0);
  await expect(page.locator('[data-chart=Chart-GB-FILL]')).toHaveAttribute('data-mode','observed',{timeout:30000});
  expect(storyRequests().some(u=>u.includes('/story-gb-'))).toBeTruthy();expect(storyRequests().filter(u=>u.includes('.summary.json')).length).toBe(2);
});

test('GB shared URLs restore chapter and shot through refresh, Back and language changes',async({page})=>{
  await page.goto(PREVIEW+'&view=story&chapter=tensions&shot=gb-05');let dialog=page.locator('.ix-story-dialog');
  await expect(dialog.locator('#ix-shot-gb-05')).toBeFocused();await page.reload();await expect(dialog.locator('#ix-shot-gb-05')).toBeFocused();
  await dialog.getByRole('button',{name:'Next →',exact:true}).click();await expect(dialog.locator('#ix-shot-gb-06')).toBeFocused();expect(page.url()).toContain('shot=gb-06');
  await page.goBack();await expect(dialog.locator('#ix-shot-gb-05')).toBeFocused();await dialog.getByRole('button',{name:'Switch to Chinese'}).click();expect(page.url()).toContain('shot=gb-05');
  await page.goto(PREVIEW+'&view=story&chapter=payment&shot=invalid');dialog=page.locator('.ix-story-dialog');await expect(dialog.locator('#ix-shot-gb-10')).toBeFocused();
});

test('GB research access and all four handoffs use the existing market sections',async({page})=>{
  let {dialog}=await open(page);await dialog.getByRole('button',{name:'Full research ↗',exact:true}).click();await expect(page.locator('.ix-research-dialog')).toBeVisible();
  await page.keyboard.press('Escape');await page.keyboard.press('Escape');await expect(page.locator('.public-story-trigger')).toBeFocused();
  for(const anchor of ['bankable','revenue','execution','downside']){
    ({dialog}=await open(page));await dialog.locator('.ix-story-exits a[href="#'+anchor+'"]').click();await expect(page.locator('.ix-story-dialog')).toHaveCount(0);await expect(page.locator('#'+anchor)).toBeFocused();
  }
  await page.goto(PREVIEW);await page.getByRole('combobox',{name:'Investor profile',exact:true}).selectOption('developer');await openLegacyStory(page);
  await expect(page.locator('.ix-research-dialog')).toBeVisible();await expect(page.locator('.ix-story-dialog')).toHaveCount(0);
});

test('GB fits phone, tablet and desktop in both languages and keeps keyboard controls visible',async({page},info)=>{
  const {dialog}=await open(page);await expect(dialog.locator('[data-chart=Chart-GB-FILL]')).toHaveAttribute('data-mode','observed',{timeout:30000});
  for(const lang of ['en','zh']){
    if(lang==='zh')await dialog.getByRole('button',{name:'Switch to Chinese'}).click();
    for(const width of [390,768,1440,1920]){
      await page.setViewportSize({width,height:960});
      const overflow=await dialog.evaluate(d=>Array.from(d.querySelectorAll('.ix-shot,.gb-scene')).filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className));expect(overflow).toEqual([]);
    }
    await page.setViewportSize({width:info.project.name==='mobile'?390:1440,height:960});
    await dialog.locator('[data-shot=gb-08] .k-toggle').last().focus();await page.keyboard.press('Enter');await expect(dialog.locator('[data-shot=gb-08] .k-toggle').last()).toBeFocused();
    await dialog.locator('[data-shot=gb-08]').screenshot({path:info.outputPath('gb-battery-'+lang+'.png')});
  }
});
