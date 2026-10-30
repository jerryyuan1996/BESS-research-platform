import { test, expect } from '@playwright/test';

test('special opportunities link to a working bilingual paired valuation',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');
  /* Only special routes whose IRR beats the conventional play are listed. */
  await expect(page.locator('#special-opportunities')).toContainText('Germany');
  await expect(page.locator('#special-opportunities')).not.toContainText('Sub-5');
  await expect(page.locator('#special-opportunities .ix-special-irr').first()).toContainText('Conventional play IRR');
  await page.locator('#special-opportunities a[href*="de-existing-node"]').click();
  const comparison=page.locator('#opportunity-comparison');
  await expect(comparison).toContainText('100 MW');
  await comparison.locator('.ix-opportunity-inputs > summary').click();
  const base=await comparison.locator('tbody tr').filter({hasText:'Return at the input price'}).textContent();
  await page.getByLabel('Extra price for the special route / MW',{exact:true}).fill('50000');
  await page.getByLabel('Extra price for the special route / MW',{exact:true}).blur();
  await expect(comparison).toContainText('EUR 50.0k');
  expect(await comparison.locator('tbody tr').filter({hasText:'Return at the input price'}).textContent()).not.toBe(base);
  const downloaded=page.waitForEvent('download');
  await page.getByRole('button',{name:'Download assumptions & cash flows',exact:true}).click();
  expect((await downloaded).suggestedFilename()).toBe('de-existing-node-comparison.json');
  await page.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
  await expect(comparison).toContainText('同口径投资测算');
  await expect(page.getByLabel('特殊路径额外收购对价／MW',{exact:true})).toHaveValue('50000');
  expect(errors).toEqual([]);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
  expect(overflow).toBe(false);
  await page.screenshot({path:'test-results/opportunities-'+test.info().project.name+'-zh.png',fullPage:true});
});

test('overview reuses the full research and explains the mechanism without the deleted chart',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/markets/italy');
  await page.locator('.ix-full-research').click();
  await expect(page.locator('.ix-research-dialog')).toBeVisible();
  await expect(page.locator('.ix-research-summary')).toHaveAttribute('aria-busy','false');
  await expect(page.locator('.ix-research-summary')).toContainText('House view');
  await expect(page.locator('.ix-research-summary')).toContainText('One-minute market orientation');
  await page.getByRole('button',{name:'Close research details',exact:true}).click();
  await expect(page.locator('.ix-research-dialog')).toHaveCount(0);
  await expect(page.locator('#revenue-drivers')).toContainText('MACSE');
  await expect(page.getByText('Cash generation & debt payments',{exact:true})).toHaveCount(0);
  await page.locator('#revenue-drivers details > summary').first().click();
  await expect(page.locator('#revenue-drivers details').first()).toHaveAttribute('open','');
  expect(errors).toEqual([]);
  await page.screenshot({path:'test-results/overview-'+test.info().project.name+'-en.png',fullPage:true});
});

test('a connection premium ceiling changes with the actual timing and price',async({page})=>{
  await page.goto('/markets/germany?opportunity=de-existing-node#opportunity-comparison');
  await page.locator('.ix-opportunity-inputs > summary').click();
  await page.getByLabel('Common target return (%)',{exact:true}).fill('5');
  await page.getByLabel('Common target return (%)',{exact:true}).blur();
  await page.getByLabel('Conventional: closing to COD (months)',{exact:true}).fill('36');
  await page.getByLabel('Conventional: closing to COD (months)',{exact:true}).blur();
  await page.getByLabel('Special: closing to COD (months)',{exact:true}).fill('12');
  await page.getByLabel('Special: closing to COD (months)',{exact:true}).blur();
  await expect(page.locator('.ix-premium-result')).toHaveClass(/is-supported/);
  await page.getByLabel('Extra price for the special route / MW',{exact:true}).fill('10000000');
  await page.getByLabel('Extra price for the special route / MW',{exact:true}).blur();
  await expect(page.locator('.ix-premium-result')).toHaveClass(/is-conditional/);
});
