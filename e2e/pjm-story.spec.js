import {test,expect} from '@playwright/test';
const preview='/markets/pjm';
test.beforeEach(async({page})=>{
  await page.route(/^https:\/\//,route=>new URL(route.request().url()).origin===process.env.PLATFORM_TEST_BASE_URL?route.continue():route.abort());
});
async function open(page,url=preview){
  await page.goto(url);const trigger=page.locator('.ix-full-research');await trigger.click();
  const dialog=page.locator('.ix-story-dialog');await expect(dialog).toBeVisible();return {trigger,dialog};
}
test('PJM reads all thirteen bilingual shots with one marker each and returns focus',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const {trigger,dialog}=await open(page);
  await expect(dialog.locator('article.ix-shot')).toHaveCount(13);
  await expect(dialog.locator('.ix-marker')).toHaveCount(13);
  await expect(dialog.locator('.ix-story-play')).toContainText('2.7%');
  await dialog.getByRole('button',{name:'Start the story',exact:true}).click();
  await expect(dialog.locator('#ix-shot-pjm-01')).toBeFocused();
  await dialog.getByRole('button',{name:'Switch to Chinese'}).click();
  await expect(dialog.locator('#ix-shot-pjm-01')).toHaveText('这是哪个市场？电池在这里向谁出售服务？');
  await expect(dialog.locator('.ix-marker')).toHaveCount(13);
  await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});
test('PJM teaching duration leaves the live case, URL and history unchanged',async({page})=>{
  await page.goto(preview+'&view=story&chapter=battery&shot=pjm-08');
  const dialog=page.locator('.ix-story-dialog');await expect(dialog).toBeVisible();
  await expect(dialog.locator('#ix-shot-pjm-08')).toBeFocused();
  const before=await page.locator('#bankable').innerText(),url=page.url(),history=await page.evaluate(()=>window.history.length);
  const choice=dialog.locator('[data-shot="pjm-08"]').getByRole('button',{name:'10h',exact:true});
  await choice.click();await expect(choice).toHaveAttribute('aria-pressed','true');
  await expect(dialog.locator('[data-shot="pjm-08"] .pjm-readouts')).toContainText('1000 MWh');
  expect(await page.locator('#bankable').innerText()).toBe(before);expect(page.url()).toBe(url);
  expect(await page.evaluate(()=>window.history.length)).toBe(history);
  await expect(dialog.locator('.ix-story-play-title')).toContainText('4h');
});
test('PJM loads the pack on opening and per-value locators only on evidence expansion',async({page})=>{
  const requests=[];page.on('request',request=>requests.push(request.url()));
  await page.goto(preview);
  expect(requests.some(url=>/story-pjm-|storyEvidenceProvenance-/.test(url))).toBe(false);
  await page.locator('.ix-full-research').click();const dialog=page.locator('.ix-story-dialog');await expect(dialog).toBeVisible();
  expect(requests.some(url=>/story-pjm-/.test(url))).toBe(true);
  expect(requests.some(url=>/storyEvidenceProvenance-/.test(url))).toBe(false);
  const shot=dialog.locator('[data-shot="pjm-07"]');await shot.locator('.ix-story-sources summary').click();
  await expect(shot.locator('.pjm-provenance')).toBeVisible();
  expect(requests.some(url=>/storyEvidenceProvenance-/.test(url))).toBe(true);
});
test('PJM ordinary entry opens publicly and a different lens retains research',async({page})=>{
  await page.goto('/markets/pjm');await page.locator('.ix-full-research').click();
  await expect(page.locator('.ix-story-dialog')).toBeVisible();
  await page.goto(preview);await page.evaluate(()=>localStorage.setItem('hub_lens','strategic'));await page.reload();
  await page.locator('.ix-full-research').click();await expect(page.locator('.ix-story-dialog')).toHaveCount(0);
});
