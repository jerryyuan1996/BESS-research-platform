import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{
  await page.route(/^https:\/\//,route=>route.abort());
});
test('Finland shows pre-FON rules and a revenue-gap scenario reaches the real Lab',async({page},info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/markets/finland/entry');
  const panel=page.locator('#revenue-readiness');
  await expect(panel).toBeVisible();await expect(panel).toContainText('can precede FON');
  await expect(panel.locator('.readiness-sensitivity tbody tr')).toHaveCount(4);
  await panel.getByRole('button',{name:'Test 80% reserve mix (illustrative)',exact:true}).click();
  await expect(page).toHaveURL(/investment-lab/);
  await expect(page.getByRole('spinbutton',{name:'Ancillary / reserve services start (months)',exact:true})).toHaveValue('6');
  await expect(page.getByRole('spinbutton',{name:'Toll / floor / long-term award start (months)',exact:true})).toHaveValue('6');
  const kpis=page.locator('.readiness-impact strong');
  expect(await kpis.nth(0).innerText()).not.toBe(await kpis.nth(1).innerText());
  await page.getByRole('button',{name:'中文',exact:true}).click();
  await expect(page.locator('#revenue-start-inputs')).toContainText('COD到收入');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  await page.locator('#revenue-start-inputs').screenshot({path:info.outputPath('readiness-lab-zh.png')});
  expect(errors).toEqual([]);
});
test('product shares fail closed, recover, and exports preserve the timing assumptions',async({page})=>{
  await page.goto('/markets/finland/entry');
  await page.getByRole('button',{name:'Test six-month reserve and contract gap',exact:true}).click();
  await page.getByText('Revenue mix, ramp-up and permit expiry',{exact:true}).click();
  await page.getByText('Product-specific reserve starts',{exact:true}).click();
  await page.getByRole('checkbox',{name:'Use product-specific reserve dates',exact:true}).check();
  const first=page.getByRole('spinbutton',{name:'mFRR revenue share (%)',exact:true});
  await first.fill('20');await first.blur();
  await expect(page.locator('.readiness-impact')).toContainText('must sum to one');
  const fcr=page.getByRole('spinbutton',{name:'FCR-N revenue share (%)',exact:true});
  await fcr.fill('80');await fcr.blur();
  await expect(page.locator('.readiness-impact .warnbox')).toHaveCount(0);
  await expect(page.locator('.readiness-impact strong')).toHaveCount(4);
  const download=page.waitForEvent('download');
  await page.getByRole('button',{name:'Save this calculation',exact:true}).click();
  const file=await download,stream=await file.createReadStream();let text='';for await(const c of stream)text+=c.toString();
  const saved=JSON.parse(text);expect(saved.input.revenueReadiness.products[0].share).toBe(.2);
  expect(saved.input.revenueReadiness.servicesMonths).toBe(6);
});
test('all dashboard families expose the new section and keep it within the viewport',async({page},info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const slug of ['western-australia','great-britain','japan-tokyo','japan-hokkaido','ontario']){
    await page.goto('/markets/'+slug+'/entry');
    await expect(page.locator('#revenue-readiness')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  }
  await page.goto('/markets/finland/entry');
  await page.getByRole('button',{name:'中文',exact:true}).click();
  await expect(page.locator('#revenue-readiness')).toContainText('早于FON');
  await page.locator('#revenue-readiness').screenshot({path:info.outputPath('readiness-finland-zh.png')});
  expect(errors).toEqual([]);
});
