import {test,expect} from '@playwright/test';
import {historySlugs} from './helpers/research-history.js';
import {INTEGRATED_CHAPTER} from '../src/experience/story/public/integrationModel.js';
test.beforeEach(async({page})=>{await page.route(/^https:\/\//,r=>r.abort());});
for(const [id,slug] of Object.entries(historySlugs))test(id+' retains the full previous reading in one entrance',async({page},info)=>{
 test.setTimeout(150000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.evaluate(()=>localStorage.setItem('hub_lang','zh'));await page.goto('/markets/'+slug);
 await expect(page.locator('.ix-full-research')).toHaveCount(0);const trigger=page.locator('.public-story-trigger');await expect(trigger).toContainText('市场背景与投资逻辑');
 await trigger.click();const dialog=page.locator('.public-story-dialog');
 const hasStory=!['es','sa','ca_on'].includes(id),seen=[];
 if(hasStory){
  const owner=id.startsWith('jp_')?'jp':id,module=await import('../src/markets/'+owner+'/story.js');const story=module.story||module.composeStory(id);
  for(const chapter of ['history','overview','system','mechanism','investment']){
   await dialog.locator(`.public-story-nav [data-chapter=${chapter}]`).click();
   const material=dialog.locator('.unified-material');await expect(material).toBeVisible();
   if(!await material.evaluate(n=>n.open))await material.locator(':scope > summary').click();
   await expect(material.locator('.unified-material-body')).toHaveAttribute('aria-busy','false');
   await expect(material.getByRole('button',{name:'重试详细解释'})).toHaveCount(0);
   const expected=[story.opening,...story.chapters.flatMap(c=>c.shots)].filter(s=>INTEGRATED_CHAPTER[s.chapter]===chapter).map(s=>s.id);
   const actual=await material.locator('[data-integrated-shot]').evaluateAll(nodes=>nodes.map(n=>n.dataset.integratedShot));expect(actual).toEqual(expected);seen.push(...actual);
   for(const detail of await material.locator('.unified-detail').all()){
    if(!await detail.evaluate(n=>n.open))await detail.locator(':scope > summary').click();
    await expect(detail.locator('.ix-shot-copy')).not.toBeEmpty();
    await expect(detail.locator('.ix-shot-copy')).not.toHaveText(/^(?:Value unavailable|数值暂缺)/);
    expect(await detail.innerText()).not.toMatch(/\{\{[^}]+\}\}|undefined|NaN/);
    if(await detail.locator('.ix-shot-visual').count())await expect(detail.locator('.ix-shot-visual')).toBeVisible();
    expect(await dialog.locator('.public-story-body').evaluate(el=>el.scrollWidth<=el.clientWidth+2)).toBe(true);
   }
   if(id==='it'&&chapter==='investment')await page.screenshot({path:info.outputPath('unified-italy-investment.png')});
  }
  expect(new Set(seen).size).toBe([story.opening,...story.chapters.flatMap(c=>c.shots)].length);
 }else{
  await dialog.locator('.public-story-nav [data-chapter=investment]').click();await expect(dialog.locator('.unified-current-case')).toBeVisible();
 }
 await dialog.locator('.public-research-button').click();await expect(dialog.locator('.ix-research-summary')).toHaveAttribute('aria-busy','false');
 await expect(dialog.locator('.ix-research-summary')).not.toBeEmpty();await expect(page.locator('.ix-research-dialog')).toHaveCount(0);
 await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(trigger).toBeFocused();expect(errors).toEqual([]);
});

test('integrated references stay scoped when the reader selects another investor',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('hub_lens','developer'));await page.goto('/markets/nem');await page.locator('.public-story-trigger').click();
 await page.locator('.public-story-nav [data-chapter=investment]').click();
 await expect(page.locator('.unified-current-case')).toBeVisible();await expect(page.locator('.unified-material-body')).toHaveAttribute('aria-busy','false');
 await expect(page.locator('.unified-case-scope')).toContainText('infrastructure-fund perspective');await expect(page.locator('[data-integrated-shot=nem-00]')).toBeVisible();
 const detail=page.locator('.unified-detail').last();const shot=await detail.getAttribute('data-integrated-shot');
 if(!await detail.evaluate(n=>n.open))await detail.locator(':scope > summary').click();
 await page.locator('.public-story-dialog').getByRole('button',{name:'Switch to Chinese'}).click();await expect(page.locator('.unified-material-body')).toHaveAttribute('aria-busy','false');
 await expect(page.locator('.unified-case-scope')).toContainText('基础设施基金视角');
 await expect.poll(()=>page.locator(`[data-integrated-shot="${shot}"]`).evaluate(n=>n.open)).toBe(true);
});
