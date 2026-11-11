import {test,expect} from '@playwright/test';
test('first visit compares four perspectives, selection persists and follows the hero',async({page})=>{
 await page.addInitScript(()=>localStorage.removeItem('hub_lens'));
 await page.goto('/');
 const panel=page.locator('.ix-perspectives');await expect(panel).toHaveClass(/is-full/);
 await expect(panel.locator('[data-perspective]')).toHaveCount(4);
 for(const id of ['strategic','foreignFirstTimer','developer','infraFund']){
  await panel.locator(`[data-perspective="${id}"]`).click();
  await expect(panel).toHaveClass(/is-compact/);
  await expect(panel.locator(`[data-perspective="${id}"]`)).toHaveAttribute('aria-pressed','true');
  await expect(panel.locator(`[data-perspective="${id}"]`)).toBeFocused();
  await expect(page.locator('select[aria-label="Investor profile"]')).toHaveValue(id);
  const lead=await panel.locator('article.is-active .ix-perspective-lead').textContent();
  expect(lead).toContain(await page.locator('.ix-feature-market h2').innerText());
  expect(await page.evaluate(()=>localStorage.getItem('hub_lens'))).toBe(id);
  await panel.locator('.ix-perspective-compare').click();await expect(panel).toHaveClass(/is-full/);
 }
 await page.locator('select[aria-label="Investor profile"]').selectOption('developer');
 await expect(panel.locator('[data-perspective="developer"]')).toHaveAttribute('aria-pressed','true');
 expect(await panel.locator('article.is-active .ix-perspective-lead').textContent()).toContain(await page.locator('.ix-feature-market h2').innerText());
});
test('saved perspective starts compact, remains keyboard accessible without overflow',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('hub_lens','developer'));
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 const panel=page.locator('.ix-perspectives');await expect(panel).toHaveClass(/is-compact/);
 await panel.locator('.ix-perspective-compare').focus();await page.keyboard.press('Enter');
 await expect(panel).toHaveClass(/is-full/);await expect(panel.locator('[data-perspective="developer"]')).toHaveAttribute('aria-pressed','true');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
