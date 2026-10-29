import { test,expect } from '@playwright/test';
test('the first-timer focus uses Finland with map watermark, capex and RTB dates',async({page},info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await page.getByRole('combobox',{name:'Investor profile',exact:true}).selectOption('foreignFirstTimer');
  await expect(page.locator('.ix-feature-market h2')).toHaveText('Finland');
  await expect(page.locator('.ix-featured')).toHaveAttribute('data-country','finland');
  for(const card of await page.locator('.ix-featured,.ix-pick,.ix-special-pick').all()){
    await expect(card.locator('.ix-project-facts')).toContainText('Capex');
    await expect(card.locator('.ix-project-facts')).toContainText('RTB → COD');
  }
  const image=await page.locator('.ix-featured').evaluate(el=>getComputedStyle(el,'::before').backgroundImage);
  expect(image).toContain('finland.svg');
  await page.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
  await expect(page.locator('.ix-feature-market h2')).toHaveText('芬兰');
  await page.locator('.ix-home-hero').screenshot({path:info.outputPath('finland-focus-zh.png')});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2)).toBe(false);
  expect(errors).toEqual([]);
});
test('Italy headline reconciles and a special route below the conventional IRR is not shown',async({page},info)=>{
  await page.goto('/');
  const homeReturn=await page.locator('.ix-featured .ix-feature-metrics strong').first().innerText();
  expect(homeReturn).toBe('11.6%');
  await page.goto('/markets/italy');
  await expect(page.locator('#bankable .ix-kpis')).toContainText(homeReturn);
  await expect(page.locator('#execution')).toContainText('Conventional play');
  await expect(page.locator('#opportunity-comparison')).toHaveCount(0);
  await expect(page.locator('.ix-section-nav a[href="#opportunity-comparison"]')).toHaveCount(0);
  await expect(page.locator('.ix-delivery-column')).toHaveCount(1);
  await expect(page.locator('#execution')).toContainText('T+0');
  await expect(page.locator('#execution')).toContainText('Investment closing and first capital commitment');
  await expect(page.locator('#execution')).toContainText('First operating-year net cash settlement');
  await page.locator('#execution').screenshot({path:info.outputPath('execution-timeline.png')});
});
