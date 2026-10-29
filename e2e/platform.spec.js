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
  await page.locator('.ix-valuation-basis > summary').click();
  await expect(page.locator('.ix-valuation-basis')).toContainText('6.5%');
  await expect(page.locator('.ix-valuation-basis')).toContainText('10.5%');
  await expect(page.locator('#bankable .ix-kpis')).toContainText('13.4%');
  await page.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
  await page.locator('.ix-valuation-basis > summary').click();
  await expect(page.locator('.ix-valuation-basis')).toContainText('锁定收入6.5%');
  await expect(page.locator('.ix-valuation-basis')).toContainText('交易收入10.5%');
  await expect(page.locator('#downside')).toContainText('统一现金流口径');
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

test('the global matrix and investment brief load without browser errors',async({page},testInfo)=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/returns');
  await expect(page.getByRole('heading',{name:'Income quality meets return.',exact:true})).toBeVisible();
  await expect(page.locator('.ix-results tbody tr')).toHaveCount(16);
  const plotted=await page.locator('.ix-matrix-svg [role="button"]').count();
  const unpriced=await page.locator('.ix-unpriced-market').count();
  expect(plotted+unpriced).toBe(16);
  expect(plotted).toBeGreaterThan(0);
  if(unpriced)await expect(page.locator('.ix-unpriced-market').first()).toContainText('N/M');
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Find conviction. Invest in storage.',exact:true})).toBeVisible();
  await expect(page.getByRole('combobox',{name:'Investor profile',exact:true})).toBeVisible();
  await expect(page.locator('.bf-call-flag')).toHaveCount(0);
  await page.screenshot({path:testInfo.outputPath('home-en.png')});
  expect(errors).toEqual([]);
});


test('the matrix panel fits every market and industry news rings its upcoming events',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/returns');
  for(const point of await page.locator('.ix-matrix-svg [role="button"], .ix-unpriced-market').all()){
    await point.dispatchEvent('click');
    const overflow=await page.locator('.ix-matrix-detail').evaluate(panel=>{
      const edge=panel.getBoundingClientRect().right;
      return [...panel.querySelectorAll('*')].some(node=>node.getBoundingClientRect().right>edge+1);
    });
    expect(overflow).toBe(false);
  }
  await expect(page.locator('.ix-header a[href="/news"]').first()).toBeAttached();
  await page.goto('/news');
  await expect(page.getByRole('heading',{name:'Policy moves first. Capital follows.',exact:true})).toBeVisible();
  await expect(page.locator('#bell .nw-bell, #bell .nw-quiet').first()).toBeVisible();
  await expect(page.locator('#calendar .nw-cal-month').first()).toBeVisible();
  await page.getByRole('button',{name:'All',exact:true}).click();
  await expect(page.locator('#headlines .nw-item').first()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
