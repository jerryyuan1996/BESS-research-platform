import {test,expect} from '@playwright/test';

test('NESO reserve catalogue keeps capacity price, cleared MW, attribution and both languages distinct',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/data');
  for(const lang of ['en','zh']){
    await page.evaluate(value=>localStorage.setItem('hub_lang',value),lang);
    const responseReady=page.waitForResponse(r=>r.url().split('?')[0].endsWith('/data/public/gb-eac-reserve.summary.json')&&r.request().method()==='GET');
    await page.reload();
    const row=page.locator('tr').filter({has:page.locator('.obs-tag').filter({hasText:/^gb-eac-reserve$/})});
    await expect(row).toHaveCount(1);await expect(row).not.toHaveClass(/absent/);
    await expect(row).toContainText('Supported by National Energy SO Open Data');
    await expect(row.locator('b')).toHaveText(lang==='en'?'GB EAC reserve auction prices and cleared capacity':'英国 EAC 备用服务拍卖价格与成交容量');
    const response=await responseReady;expect(response.ok()).toBe(true);const data=await response.json();
    await expect(row.locator('td').nth(4)).toHaveText(data.coverage.points.toLocaleString('en-US'));
    await expect(row.locator('td').nth(3)).toContainText(data.coverage.from.slice(0,10));
    await expect(row.locator('td').nth(3)).toContainText(data.coverage.to.slice(0,10));
    expect(data.units).toEqual({price:'GBP/MW/h',power:'MW'});
    expect(data.source.attribution).toBe('Supported by National Energy SO Open Data');
    expect(data.derived).toBeNull();expect(data.arbitrage).toBeNull();expect(data.daily).toEqual([]);
    expect(new Set(data.latest.map(p=>p.service)).size).toBe(6);
    expect(errors).toEqual([]);
  }
});
