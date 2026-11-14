import {test,expect} from '@playwright/test';
import {SYSTEMS,ROUTES} from '../src/experience/story/public/marketLogicContent.js';
import {SYSTEM_STEPS,REVENUE_ROUTES} from '../src/experience/story/public/italyLogicContent.js';
import {historySlugs} from './helpers/research-history.js';

test.beforeEach(async({page})=>{await page.route(/^https:\/\//,r=>r.abort());});
for(const [id,slug] of Object.entries(historySlugs))for(const lang of ['en','zh']){
 test(`${id}: value, payment rights and constraints (${lang})`,async({page},info)=>{
  test.setTimeout(120000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');await page.evaluate(lang=>localStorage.setItem('hub_lang',lang),lang);await page.goto('/markets/'+slug);
  const before=await page.locator('#decision').innerText();await expect(page.locator('.ix-full-research')).toHaveCount(0);
  await page.locator('.public-story-trigger').click();const dialog=page.locator('.public-story-dialog'),i=lang==='zh'?1:0;
  await expect(dialog.locator('.public-story-nav button')).toHaveCount(6);
  await dialog.locator('.public-story-nav [data-chapter=system]').click();const logic=dialog.locator('.market-logic');
  const system=id==='it'?{steps:SYSTEM_STEPS}:SYSTEMS[id];
  for(let n=0;n<3;n++){
   await logic.locator(`[data-logic-step="${n}"]`).click();
   await expect(logic.locator('.il-copy h4')).toHaveText(system.steps[n].title[i]);
   await expect(logic.locator('.il-copy')).toContainText(system.steps[n].body[i]);
   await expect(logic.locator('svg desc')).toContainText(system.steps[n].body[i]);
  }
  await logic.locator('.il-condition').click();await expect(logic.locator('.il-illustration')).toHaveAttribute('data-flow','constrained');
  await expect(logic.locator('.il-blocked')).toHaveCount(1);await expect(logic.locator('.il-discharge.il-flow')).toHaveCount(0);
  await expect(logic.locator('.il-alert')).toBeVisible();
  await logic.locator('.il-next-read .source-popup-trigger').click();await expect(page.locator('.source-popup a').first()).toHaveAttribute('href',/^https:/);await page.keyboard.press('Escape');
  await dialog.locator('.public-story-nav [data-chapter=mechanism]').click();
  const routes=id==='it'?REVENUE_ROUTES:ROUTES[id];
  for(const [key,r] of Object.entries(routes)){
   await logic.locator(`[data-revenue-route="${key}"]`).click();
   for(let n=0;n<3;n++){
    await logic.locator(`[data-logic-step="${n}"]`).click();
    await expect(logic.locator('.il-copy h4')).toHaveText((n===0?r.promise:n===1?r.right:r.pay)[i]);
   }
   await expect(logic.locator('.il-copy')).toContainText(r.net[i]);
   if(id==='sa')await expect(logic.locator('.il-payment.il-flow')).toHaveCount(0);
   else {await logic.locator('.il-condition').click();await expect(logic.locator('.il-payment.il-flow')).toHaveCount(0);await expect(logic.locator('.il-alert')).toBeVisible();}
   expect(await dialog.locator('.public-story-body').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
   expect(await logic.locator('.il-steps button,.il-routes button,.il-play,.il-condition,.il-next-read button').evaluateAll(nodes=>nodes.every(n=>n.getBoundingClientRect().height>=40))).toBe(true);
  }
  expect(await logic.innerText()).not.toMatch(/undefined|NaN|\bnull\b/);
  if(['fi','jp_hokkaido','it','sa'].includes(id))await page.screenshot({path:info.outputPath(id+'-'+lang+'.png')});
  await page.keyboard.press('Escape');expect(await page.locator('#decision').innerText()).toBe(before);expect(errors).toEqual([]);
 });
}
