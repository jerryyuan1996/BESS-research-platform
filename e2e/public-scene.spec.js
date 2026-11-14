import {test,expect} from '@playwright/test';
import {PUBLIC_VERSION} from '../src/experience/story/public/catalog.js';
const shot=chapter=>`public-en-${PUBLIC_VERSION.replace('.','-')}-${chapter}`;
async function open(page,slug='nem',chapter='system'){
 await page.goto(`/markets/${slug}?view=story&chapter=${chapter}&shot=${shot(chapter)}`);
 await expect(page.locator('.market-logic')).toBeVisible();return page.locator('.public-story-dialog');
}
test.beforeEach(async({page})=>{await page.route(/^https:\/\//,r=>r.abort());});
test('keyboard steps, manual selection and pause keep one coherent state',async({page})=>{
 const dialog=await open(page),logic=dialog.locator('.market-logic');
 await expect(logic).toHaveAttribute('data-playing','false');
 await logic.locator('[data-logic-step="0"]').focus();await page.keyboard.press('ArrowRight');await expect(logic).toHaveAttribute('data-step','1');
 await expect(logic.locator('[data-logic-step="1"]')).toBeFocused();await page.keyboard.press('End');await expect(logic).toHaveAttribute('data-step','2');
 await page.keyboard.press('Home');await expect(logic).toHaveAttribute('data-step','0');
 await logic.locator('.il-play').click();await expect(logic).toHaveAttribute('data-step','1',{timeout:7000});await logic.locator('.il-play').click();
 await expect(logic).toHaveAttribute('data-playing','false');await page.waitForTimeout(3000);await expect(logic).toHaveAttribute('data-step','1');
 await logic.locator('.il-play').click();await logic.locator('[data-logic-step="2"]').click();await expect(logic).toHaveAttribute('data-playing','false');
});
test('reduced motion leaves every physical family static',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const slug of ['nem','finland','pjm','japan-hokkaido']){
  const dialog=await open(page,slug);await dialog.locator('[data-logic-step="2"]').click();
  expect(await dialog.locator('svg.il-diagram').evaluate(svg=>[...svg.querySelectorAll('*')].every(n=>getComputedStyle(n).animationName==='none'))).toBe(true);
 }
});
test('the route changes dispatch control, capital support and cash sharing in the drawing',async({page})=>{
 const dialog=await open(page,'germany','mechanism');await dialog.locator('[data-revenue-route=toll]').click();await dialog.locator('[data-logic-step="1"]').click();
 await expect(dialog.locator('.il-control.il-flow')).toHaveCount(1);
 await open(page,'poland','mechanism');await page.locator('[data-revenue-route=grant]').click();await page.locator('[data-logic-step="2"]').click();await expect(page.locator('.il-state-label')).toContainText('capital reimbursement');
 await open(page,'japan-tokyo','mechanism');await page.locator('[data-logic-step="2"]').click();await expect(page.locator('.il-return')).toHaveCount(1);
});
test('old storage links resolve to the value chapter and Japan keeps its regional constraint',async({page})=>{
 await open(page,'nem','storage');await expect(page.locator('.public-chapter')).toHaveAttribute('data-chapter','system');
 const dialog=await open(page,'japan-kyushu');await expect(dialog.locator('.il-copy')).toContainText('Kanmon');
 await dialog.locator('.public-story-tools select').selectOption('jp_hokkaido');await expect(dialog.locator('.il-illustration')).toHaveAttribute('data-physical-kind','connection');
 await dialog.locator('[data-logic-step="1"]').click();await expect(dialog.locator('.il-copy')).toContainText('charging-control');
});
test('small-phone value and cash diagrams stay within the reader',async({page})=>{
 await page.setViewportSize({width:320,height:800});
 for(const slug of ['finland','japan-hokkaido','nem','poland'])for(const chapter of ['system','mechanism']){
  const dialog=await open(page,slug,chapter);await dialog.locator('[data-logic-step="2"]').click();
  expect(await dialog.locator('.public-story-body').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
 }
});
