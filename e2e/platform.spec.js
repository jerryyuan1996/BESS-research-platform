import { test,expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.beforeEach(async({page})=>{
  // The acceptance case uses committed assets and data, without font or
  // telemetry services holding screenshots open on a restricted network.
  await page.route(/^https:\/\//,route=>new URL(route.request().url()).origin===process.env.PLATFORM_TEST_BASE_URL?route.continue():route.abort());
});

test('market brief discloses actual rates in English and Chinese',async({page},testInfo)=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/markets/western-australia');
  await expect(page.locator('.bf-asof')).toContainText('6.5%');
  await expect(page.locator('.bf-asof')).toContainText('10.5%');
  await page.getByRole('button',{name:'中文',exact:true}).click();
  await expect(page.locator('.bf-asof')).toContainText('锁定收入6.5%');
  await expect(page.locator('.bf-asof')).toContainText('投运后第5年');
  await page.screenshot({path:testInfo.outputPath('market-brief-zh.png'),timeout:15000});
  expect(errors).toEqual([]);
});

test('Investment Lab saves the displayed scenario, pricing hurdle and project evidence',async({page},testInfo)=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/investment-lab');
  await page.locator('.lab-legacy > summary').click();
  await expect(page.getByRole('button',{name:'Save investment case',exact:true})).toBeVisible();
  const hurdle=page.getByRole('spinbutton',{name:'Your unlevered return hurdle (%)',exact:true});
  await expect(hurdle).toHaveValue('');
  await hurdle.fill('12');await hurdle.blur();
  await expect(page.getByText(/At a 12.0% unlevered hurdle/)).toBeVisible();
  await page.getByRole('button',{name:'Project debt',exact:true}).click();
  await page.getByText('Project evidence · 10 unresolved',{exact:true}).click();
  const gate=page.getByRole('combobox',{name:'Connection rights, capacity and timing',exact:true});
  await expect(gate).toHaveValue('unresolved');
  await gate.selectOption('provided');
  await expect(page.getByText('Project evidence · 10 unresolved',{exact:true})).toBeVisible();
  const reference=page.getByRole('textbox',{name:'Connection rights, capacity and timing reference or reason',exact:true});
  await reference.fill('Test evidence reference');await reference.blur();
  await expect(page.getByText('Project evidence · 9 unresolved',{exact:true})).toBeVisible();
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Save investment case',exact:true}).click();
  const download=await downloadPromise;
  const record=JSON.parse(await readFile(await download.path(),'utf8'));
  if(process.env.PLATFORM_TEST_BASE_URL){
    const response=await page.request.get('/release.json');const stamp=await response.json();
    expect(stamp.commit).toBe(process.env.RELEASE_SHA);expect(record.modelCommit).toBe(stamp.commit);
    expect(Object.keys(record.dataVintages)).not.toHaveLength(0);
  }
  expect(record.exitClock).toBe('operating-years');
  expect(record.result.valuationRates.secured).toBe(0.065);
  expect(record.entryPrice.hurdle).toBe(0.12);
  expect(record.projectEvidence.find(g=>g.id==='connection').status).toBe('provided');
  expect(record.result.capitalFlows.length).toBeGreaterThan(0);
  expect(record.result.secY.length).toBe(15);
  expect(record.debt.maturityPolicy).toBe('equity-repayment');
  await page.getByRole('button',{name:'中文',exact:true}).click();
  await expect(page.getByRole('button',{name:'保存投资情景',exact:true})).toBeVisible();
  await page.screenshot({path:testInfo.outputPath('investment-lab-zh.png')});
  expect(errors).toEqual([]);
});

test('long-life expiry cases and home briefing load without browser errors',async({page},testInfo)=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/returns');
  await expect(page.getByRole('heading',{name:'Without assumed contract renewals',exact:true})).toBeVisible();
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'BESS investment briefing',exact:true})).toBeVisible();
  await expect(page.locator('.bf-lens')).toBeVisible();
  await expect(page.locator('.bf-call-flag')).toHaveCount(0);
  await page.screenshot({path:testInfo.outputPath('home-en.png')});
  expect(errors).toEqual([]);
});
