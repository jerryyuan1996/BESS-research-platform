import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('NEM small distribution inputs, evidence and effective cash flows are available from the lab',async({page})=>{
  await page.goto('/investment-lab');
  await page.locator('.lab-ctl').first().getByRole('button',{name:/NEM/}).click();
  await page.locator('.acq-special-workbench > summary').click();
  const comparison=page.locator('#opportunity-comparison');
  await expect(comparison).toContainText('18–21 months from site control');
  await comparison.locator('.ix-unpriced-details > summary').click();
  await expect(comparison.getByRole('row',{name:/Power \/ duration/})).toContainText('4.5 MW / 4h');
  await expect(comparison.getByRole('row',{name:/physical COD/})).toContainText('7.5 months');
  await expect(comparison.getByRole('row',{name:/Network charge or credit/})).toContainText('Thin evidence');
  await expect(comparison.getByRole('row',{name:/Loss factor/})).toContainText('0.95');
  await comparison.locator('.ix-opportunity-inputs > summary').click();
  const network=comparison.getByRole('spinbutton',{name:/Annual network charge/});
  await network.fill('-20000');
  await network.blur();
  const pending=page.waitForEvent('download');
  await comparison.getByRole('button',{name:'Download assumptions & cash flows'}).click();
  const download=await pending;
  const file=JSON.parse(await readFile(await download.path(),'utf8'));
  expect(file.asOf).toBe('2026-11-26');
  expect(file.distribution.networkPerMW).toBe(-20000);
  expect(file.alternative.input.annual[0].network).toBeCloseTo(-20000,5);
  expect(file.opportunity.distribution.networkPerMW).toBe(0);
  await page.goto('/markets/nem');
  await expect(page.locator('#overview')).toBeVisible();
  await expect(page.locator('#opportunity-comparison')).toHaveCount(0);
});

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
  await page.locator('.public-story-trigger').click();
  await page.locator('.ix-story-dialog').getByRole('button',{name:'Full research ↗',exact:true}).click();
  await expect(page.locator('.public-chapter[data-chapter=research]')).toBeVisible();
  await expect(page.locator('.ix-research-summary')).toHaveAttribute('aria-busy','false');
  await expect(page.locator('.ix-research-summary')).toContainText('House view');
  await expect(page.locator('.ix-research-summary')).toContainText('One-minute market orientation');
  await page.locator('.public-story-dialog').getByRole('button',{name:'Close market background',exact:true}).click();
  await expect(page.getByText('Cash generation & debt payments',{exact:true})).toHaveCount(0);
  await page.locator('#revenue-drivers details > summary').first().click();
  await expect(page.locator('#revenue-drivers details').first()).toHaveAttribute('open','');
  await expect(page.locator('#revenue-capacity .market-revenue-body')).toHaveAttribute('aria-busy','false');
  await expect(page.locator('#revenue-capacity')).toContainText('MACSE');
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
