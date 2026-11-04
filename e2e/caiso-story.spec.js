import {test,expect} from '@playwright/test';
import {story} from '../src/markets/caiso/story.js';
const MARKET='/markets/caiso',PREVIEW=MARKET+'?story=preview';
async function open(page,url=MARKET){await page.goto(url);const trigger=page.locator('.ix-full-research');await trigger.scrollIntoViewIfNeeded();await trigger.click();const dialog=page.locator('.ix-story-dialog');await expect(dialog).toBeVisible();return {trigger,dialog};}

test('CAISO opens ordinarily after G-2 and loads no story code before the research button opens it',async({page})=>{
 const loaded=[];page.on('request',r=>{if(/story-caiso-/.test(r.url()))loaded.push(r.url());});
 await page.goto(MARKET);await expect(page.locator('.ix-full-research')).toBeVisible();expect(loaded).toEqual([]);
 await page.locator('.ix-full-research').click();await expect(page.locator('.ix-story-dialog')).toBeVisible();expect(loaded.length).toBeGreaterThan(0);
});

test('CAISO shows all fourteen shots and fixed markers in both languages with the approved fallbacks',async({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const {trigger,dialog}=await open(page);
 await expect(dialog.locator('article.ix-shot')).toHaveCount(14);await expect(dialog.locator('.ix-marker')).toHaveCount(14);await expect(dialog.locator('.caiso-scene')).toHaveCount(13);
 await expect(dialog.locator('[data-shot=caiso-00] svg')).toHaveCount(0);
 await expect(dialog.locator('[data-chart=Chart-CAISO-EVENING]')).toHaveAttribute('data-publication-status','blocked');
 await expect(dialog.locator('[data-shot=caiso-05]')).toContainText('Observed series awaiting registration; showing an Example');
 await expect(dialog.locator('[data-shot=caiso-05]')).not.toContainText('midday trough has deepened');
 await expect(dialog.locator('[data-shot=caiso-03]')).toContainText('effective for the 2015 RA year');
 await expect(dialog.locator('[data-shot=caiso-01] [data-ba-overlay]')).toHaveAttribute('data-ba-overlay','approximate');
 await dialog.locator('[data-shot=caiso-05]').screenshot({path:info.outputPath('caiso-evening-en.png')});
 await dialog.getByRole('button',{name:'Switch to Chinese'}).click();await expect(dialog.locator('[data-shot=caiso-01] h4')).toHaveText(story.chapters[0].shots[0].question[1]);
 await expect(dialog.locator('.ix-marker')).toHaveCount(14);await expect(dialog.locator('[data-shot=caiso-05]')).toContainText('观察序列尚待登记；当前展示示例');
 await dialog.locator('[data-shot=caiso-05]').screenshot({path:info.outputPath('caiso-evening-zh.png')});
 await page.keyboard.press('Escape');await expect(trigger).toBeFocused();expect(errors).toEqual([]);
});

test('CAISO teaching controls preserve the investment case, story URL and translated local state',async({page})=>{
 await page.goto(PREVIEW+'&view=story&chapter=battery&shot=caiso-08');const dialog=page.locator('.ix-story-dialog');await expect(dialog.locator('#ix-shot-caiso-08')).toBeFocused();
 const before=await page.locator('#bankable').innerText(),url=page.url(),shot=dialog.locator('[data-shot=caiso-08]');
 await shot.getByRole('button',{name:'2 hours (Example)',exact:true}).click();await expect(shot).toContainText('200 MWh');
 await shot.getByRole('button',{name:'After foldback (Example)',exact:true}).click();await expect(shot).toContainText('After foldback: not yet known');
 expect(page.url()).toBe(url);expect(await page.locator('#bankable').innerText()).toBe(before);
 await dialog.getByRole('button',{name:'Switch to Chinese'}).click();await expect(shot).toContainText('出力回落后：尚不可知');await expect(shot).toContainText('200 MWh');
});

test('CAISO restores shared story URLs and hands off through the existing investment sections',async({page})=>{
 await page.goto(PREVIEW+'&view=story&chapter=investment&shot=caiso-13');let dialog=page.locator('.ix-story-dialog');await expect(dialog.locator('#ix-shot-caiso-13')).toBeFocused();
 await page.reload();await expect(dialog.locator('#ix-shot-caiso-13')).toBeFocused();
 for(const anchor of ['bankable','revenue','execution','downside']){
  if(anchor!=='bankable'){await page.goto(PREVIEW+'&view=story&chapter=investment&shot=caiso-13');dialog=page.locator('.ix-story-dialog');await expect(dialog.locator('#ix-shot-caiso-13')).toBeFocused();}
  await dialog.locator('.ix-story-exits a[href="#'+anchor+'"]').click();await expect(dialog).toHaveCount(0);await expect(page.locator('#'+anchor)).toBeFocused();
 }
});

test('CAISO keeps research for another lens',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('hub_lens','developer'));await page.goto(PREVIEW);await page.locator('.ix-full-research').click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.locator('.ix-story-dialog')).toHaveCount(0);
});

test('CAISO fits four widths in both languages',async({page})=>{
 const {dialog}=await open(page);
 for(const lang of ['en','zh']){
  if(lang==='zh')await dialog.getByRole('button',{name:'Switch to Chinese'}).click();
  for(const width of [390,768,1024,1440]){
   await page.setViewportSize({width,height:900});
   expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+2)).toBe(true);
   expect(await dialog.locator('.caiso-scene svg').evaluateAll(nodes=>nodes.every(node=>node.getBoundingClientRect().width<=node.closest('.ix-story-dialog').clientWidth+2))).toBe(true);
  }
 }
});
