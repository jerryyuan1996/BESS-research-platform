import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{
 await page.route(/^https:\/\//,route=>new URL(route.request().url()).origin===process.env.PLATFORM_TEST_BASE_URL?route.continue():route.abort());
});
const open=async(page,path='/markets/italy?story=preview')=>{
 await page.goto(path);
 const trigger=page.locator('.ix-full-research');await trigger.click();
 const dialog=page.locator('.ix-story-dialog');await expect(dialog).toBeVisible();return {trigger,dialog};
};
test('Italy reads both independent plays in two languages and returns keyboard focus',async({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const {trigger,dialog}=await open(page);
 await expect(dialog.locator('article.ix-shot')).toHaveCount(12);
 await expect(dialog.locator('.ix-marker')).toHaveCount(12);
 const cards=dialog.locator('.it-opening-choices [data-play]');await expect(cards).toHaveCount(2);
 await expect(cards.nth(0)).toContainText('Advance');await expect(cards.nth(1)).toContainText('Situational');
 await expect(dialog).not.toContainText('undefined');
 await dialog.getByRole('button',{name:'Next →',exact:true}).focus();await page.keyboard.press('Enter');
 await expect(dialog.locator('#ix-shot-it-01')).toBeFocused();
 await dialog.screenshot({path:info.outputPath('italy-en.png')});
 await dialog.getByRole('button',{name:'Switch to Chinese'}).click();
 await expect(dialog.locator('#ix-shot-it-01')).toHaveText('为什么一个国家要分区定价？');
 await expect(dialog.locator('.it-opening-choices [data-play]').nth(1)).toContainText('择机投入');
 await dialog.screenshot({path:info.outputPath('italy-zh.png')});
 await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(trigger).toBeFocused();
 expect(errors).toEqual([]);
});
test('Italy teaching controls keep case, URL and history; the chart remains an Example',async({page})=>{
 await page.goto('/markets/italy?story=preview&view=story&chapter=battery&shot=it-06');
 const dialog=page.locator('.ix-story-dialog');await expect(dialog).toBeVisible();
 await expect(dialog.locator('#ix-shot-it-06')).toBeFocused();
 const before=await page.locator('#bankable').innerText(),url=page.url(),history=await page.evaluate(()=>window.history.length);
 const teaching=dialog.locator('[data-shot="it-06"]').getByRole('button',{name:'Teaching battery: two, six, eight hours',exact:true});
 await teaching.focus();await page.keyboard.press('Enter');await expect(teaching).toHaveAttribute('aria-pressed','true');
 expect(page.url()).toBe(url);expect(await page.evaluate(()=>window.history.length)).toBe(history);
 expect(await page.locator('#bankable').innerText()).toBe(before);
 const chart=dialog.locator('[data-shot="it-08"] [data-chart="Chart-IT-FORK"]');
 await expect(chart).toHaveAttribute('data-authority','example');await expect(chart).toHaveAttribute('data-scaled','false');
 await expect(dialog.locator('[data-shot="it-08"]')).toContainText('Example: two contract shapes');
 await expect(dialog.locator('[data-watch="toll"]')).toHaveCount(1);
});
test('Italy story code and stylesheet load only on opening, with no Italian price requests',async({page})=>{
 const requests=[];page.on('request',r=>requests.push(r.url()));
 await page.goto('/');await expect(page.locator('main')).toBeVisible();
 expect(requests.some(u=>/story-it-|storyPack-/.test(u))).toBe(false);
 await page.goto('/markets/italy?story=preview');await expect(page.locator('.ix-full-research')).toBeVisible();
 expect(requests.some(u=>/story-it-|storyPack-/.test(u))).toBe(false);
 await page.locator('.ix-full-research').click();await expect(page.locator('.ix-story-dialog')).toBeVisible();
 expect(requests.some(u=>/story-it-/.test(u))).toBe(true);
 expect(requests.some(u=>/it-day-ahead|mercatoelettrico|entsoe|it-auction-results\.json/.test(u))).toBe(false);
});
test('Italy preview guards the lens, while the standard button keeps research',async({page})=>{
 await page.goto('/markets/italy');await page.locator('.ix-full-research').click();await expect(page.locator('.ix-research-dialog')).toBeVisible();await page.keyboard.press('Escape');
 await page.evaluate(()=>localStorage.setItem('hub_lens','developer'));
 await page.goto('/markets/italy?story=preview');await page.locator('.ix-full-research').click();
 await expect(page.locator('.ix-research-dialog')).toBeVisible();await expect(page.locator('.ix-story-dialog')).toHaveCount(0);
});
test('Italy direct links, refresh, Back and section handoffs retain the reading place',async({page})=>{
 const {dialog}=await open(page);await dialog.getByRole('button',{name:'Next →',exact:true}).click();await expect(dialog.locator('#ix-shot-it-01')).toBeFocused();
 await dialog.getByRole('button',{name:'Next →',exact:true}).click();await expect(dialog.locator('#ix-shot-it-02')).toBeFocused();
 await page.goBack();await expect(dialog.locator('#ix-shot-it-01')).toBeFocused();
 await page.reload();await expect(page.locator('.ix-story-dialog #ix-shot-it-01')).toBeFocused();
 for(const anchor of ['bankable','revenue','execution','downside']){
  await page.goto('/markets/italy?story=preview&view=story&chapter=investment&shot=it-11');
  await page.locator('[data-shot="it-11"] .ix-story-exits a[href="#'+anchor+'"]').click();
  await expect(page.locator('.ix-story-dialog')).toHaveCount(0);await expect(page.locator('#'+anchor)).toBeFocused();
 }
});
test('Italy scenes fit phone, tablet and desktop widths in both languages',async({page},info)=>{
 const {dialog}=await open(page);
 await page.emulateMedia({reducedMotion:'reduce',colorScheme:'dark'});
 for(const width of [390,768,1440,1920])for(const lang of ['en','zh']){
  await page.setViewportSize({width,height:950});
  const switcher=dialog.locator('.ix-language');if((await switcher.innerText())===(lang==='zh'?'中文':'EN'))await switcher.click();
  const overflow=await dialog.evaluate(el=>[...el.querySelectorAll('.ix-shot,.it-scene,.it-opening-choices')].filter(n=>n.scrollWidth>n.clientWidth+3).map(n=>n.className));
  expect(overflow).toEqual([]);
 }
 await dialog.getByRole('button',{name:/Who pays|谁来付钱/}).click();
 await dialog.screenshot({path:info.outputPath('italy-chart.png')});
});
