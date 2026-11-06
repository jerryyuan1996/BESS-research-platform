import {test,expect} from '@playwright/test';
import {IESO_NOTICE} from '../src/governance/dataNotices.js';

test('Ontario feed loads its governed points and complete reproduction notice in both languages',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/data');
  for(const lang of ['en','zh']){
    await page.evaluate(value=>localStorage.setItem('hub_lang',value),lang);
    await page.reload();
    const row=page.locator('tr').filter({has:page.locator('.obs-tag').filter({hasText:/^ca-on-da-zonal$/})});
    await expect(row).toHaveCount(1);
    await expect(row).not.toHaveClass(/absent/);
    await expect(row).toContainText(IESO_NOTICE);
    await expect(row.locator('b')).toHaveText(lang==='en'?'Ontario day-ahead zonal prices and version archive':'安大略日前区域价格与版本归档');
    const response=await page.request.get('/data/public/ca-on-da-zonal.summary.json');
    expect(response.ok()).toBe(true);const data=await response.json();
    await expect(row.locator('td').nth(4)).toHaveText(data.coverage.points.toLocaleString('en-US'));
    await expect(row.locator('td').nth(3)).toContainText(lang==='en'
      ? data.zonal.coverageAudit.completeRollingDays+' complete days; '+data.zonal.coverageAudit.pendingReportFiles.length+' reports pending'
      : data.zonal.coverageAudit.completeRollingDays+' 个完整日；'+data.zonal.coverageAudit.pendingReportFiles.length+' 份报表待归档');
    expect(data.source.notice).toBe(IESO_NOTICE);expect(data.arbitrage).toBeNull();
    expect(errors).toEqual([]);
  }
});
