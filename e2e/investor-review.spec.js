import { test,expect } from '@playwright/test';

test('current Italy and Finland narratives reconcile to the main metrics',async({page})=>{
  await page.goto('/markets/italy');
  const irr=await page.locator('#bankable .ix-kpis strong').first().innerText();
  await expect(page.locator('.ix-thesis')).toContainText(irr);
  await expect(page.locator('.ix-thesis')).not.toContainText('14.6%');
  await expect(page.locator('#decision')).toContainText('project-rights price');
  await page.goto('/markets/finland');
  await expect(page.locator('#revenue .ix-assumptions')).toContainText('40%');
  await expect(page.locator('#revenue .ix-assumptions')).not.toContainText('50%');
});
test('Saudi has an evidence gap rather than a negative-return label or a stranded loading message',async({page},info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/markets/saudi-arabia');
  await expect(page.locator('#decision')).toContainText('payment is unpublished');
  await expect(page.locator('#execution')).toContainText('No priced model');
  await expect(page.getByRole('button',{name:'Model this market ↗',exact:true})).toHaveCount(0);
  await page.screenshot({path:info.outputPath('saudi-withheld.png'),fullPage:true});
  expect(errors).toEqual([]);
});
test('the new Spain case states its execution assumptions and retains a downside',async({page})=>{
  await page.goto('/markets/spain');
  await expect(page.locator('#decision')).toContainText('perfect-foresight');
  await expect(page.locator('#decision')).toContainText('Capacity and balancing receipts are excluded');
  await expect(page.locator('#downside .ix-downside-table')).not.toContainText('N/M');
});
test('a month-only event keeps its uncertainty in both languages',async({page})=>{
  await page.goto('/news');
  await page.locator('#event-watch>summary').click();
  await expect(page.getByText('Expected month; exact date unconfirmed').first()).toBeVisible();
  await expect(page.getByText('Due by tomorrow',{exact:true})).toHaveCount(0);
  await expect(page.getByText('OTHER NEWS FROM THIS MARKET').first()).toBeVisible();
  await page.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
  await expect(page.getByText('预计月份，具体日期待确认').first()).toBeVisible();
});
test('risk analysis keeps baseline debt and exposes the twenty-year contract tail',async({page},info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/markets/germany');
  await page.locator('.ix-risk-analysis-host>summary').click();
  await expect(page.locator('.ix-life-year')).toHaveCount(20);
  await expect(page.locator('.ix-risk-analysis')).toContainText('No debt is resized');
  await page.locator('#downside').screenshot({path:info.outputPath('risk-analysis.png')});
  expect(errors).toEqual([]);
});
test('route links highlight the affected play without silently changing the main investment case',async({page})=>{
  await page.goto('/markets/italy?play=it-ltda-6h#route-options');
  await expect(page.locator('#route-options .is-requested')).toContainText('MACSE');
  await expect(page.locator('#route-options')).toContainText('headline remains');
  await expect(page.locator('#bankable')).toContainText('11.6%');
});
test('responsive decision cards, shared navigation and comparison margins remain usable',async({page},info)=>{
  await page.goto('/returns');
  await expect(page.locator('.ix-opportunity-set tbody tr')).toHaveCount(18);
  await expect(page.locator('.ix-matrix-svg')).toContainText('All-equity IRR (%)');
  await expect(page.locator('.ix-matrix-svg')).not.toContainText('minus target');
  await expect(page.locator('.ix-unpriced-markets')).toContainText('evidence gap');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2)).toBe(false);
  await page.screenshot({path:info.outputPath('comparison-margin.png'),fullPage:true});
  await page.goto('/data');
  await expect(page.locator('.ix-header')).toHaveCount(1);
  await expect(page.getByText('Investment conventions',{exact:true})).toBeVisible();
  await page.goto('/');
  await page.locator('.ix-home-hero').screenshot({path:info.outputPath('home-investor-review.png')});
});


test('special value separates design, timing, costs and price and only the active investor data loads',async({page})=>{
  const loaded=[];page.on('request',r=>{if(/\/(infraFund|strategic|foreignFirstTimer|developer)-[^/]+\.js/.test(r.url()))loaded.push(r.url());});
  await page.goto('/');
  await expect(page.locator('.ix-featured')).toBeVisible();
  expect(new Set(loaded).size).toBe(1);
  await page.goto('/markets/germany');
  await page.getByText('What creates the extra value?',{exact:true}).click();
  await expect(page.locator('.ix-opportunity-output')).toContainText('Sequential NPV bridge');
  await expect(page.locator('.ix-opportunity-output')).toContainText('Extra acquisition price');
});
