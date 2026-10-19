import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{
  // Live checks must load the production origin, while external telemetry and
  // fonts stay excluded just as they are during local preview checks.
  await page.route(/^https:\/\//,route=>new URL(route.request().url()).origin===process.env.PLATFORM_TEST_BASE_URL?route.continue():route.abort());
});

test('home keeps all market references and explains assumptions without confusing flags',async({page},testInfo)=>{
  await page.goto('/');
  await expect(page.locator('.bf-lens')).toBeVisible();
  await expect(page.locator('.bf-call-flag')).toHaveCount(0);
  const rows=page.locator('.acq-row');
  await expect(rows).toHaveCount(15);
  await expect(rows.first().getByRole('button',{name:/Target annual return/})).toBeVisible();
  await page.locator('.acq-stages').getByRole('button',{name:'Operating',exact:true}).click();
  await expect(rows).toHaveCount(15);
  await expect(rows.first().locator('.acq-price')).toContainText('–');
  await rows.first().locator('.acq-price').click();
  const popover=page.locator('.acq-popover:popover-open');
  const triggerBox=await rows.first().locator('.acq-price').boundingBox(),popoverBox=await popover.boundingBox();
  expect(popoverBox.y+popoverBox.height<=triggerBox.y || popoverBox.y>=triggerBox.y+triggerBox.height).toBe(true);
  await expect(popover).toContainText('Cautious case');
  await expect(popover).toContainText('Favourable case');
  await popover.getByText('Public sources',{exact:true}).click();
  await expect(popover.getByRole('link',{name:'Australian Taxation Office: company tax',exact:true})).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'中文',exact:true}).click();
  await expect(page.locator('.acq-home h2')).toContainText('各市场收购参照');
  await expect(rows.first().locator('.acq-context')).toContainText('已并网投运');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  await page.locator('.acq-home').screenshot({path:testInfo.outputPath('acquisition-reference-home-zh.png')});
  await expect(page.locator('main')).not.toContainText('calls run against the economics');
});

test('a real asking price works with partial inputs and updates expected returns',async({page},testInfo)=>{
  await page.goto('/investment-lab');
  await page.locator('.lab-ctl').first().getByRole('button').first().click();
  const panel=page.locator('.acq-lab');
  await panel.getByRole('combobox',{name:'Acquisition stage',exact:true}).selectOption('operating');
  await expect(panel.locator('.acq-lab-output .acq-price')).toBeVisible();
  const price=panel.getByRole('spinbutton',{name:'Seller asking price / MW (optional)',exact:true});
  await price.fill('1000000');await price.blur();
  await expect(panel.locator('.acq-at-price')).toContainText('Expected annual return at your price');
  const before=await panel.locator('.acq-at-price>p').innerText();
  await price.fill('1500000');await price.blur();
  await expect(panel.locator('.acq-at-price>p')).not.toHaveText(before);
  const tax=panel.getByRole('spinbutton',{name:'Cash tax on positive operating income (%)',exact:true});
  await tax.fill('25');await tax.blur();
  await panel.locator('.acq-price').click();
  await expect(page.locator('.acq-popover:popover-open')).toContainText('25.0%');
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'中文',exact:true}).click();
  await expect(panel.locator('.acq-at-price')).toContainText('按你的报价测算的年化回报');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  await panel.locator('.acq-lab-output').screenshot({path:testInfo.outputPath('acquisition-asking-price-zh.png')});
});

test('a completed operating case pairs price and equity target, explains debt and survives translation',async({page},testInfo)=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/investment-lab');
  await expect(page.locator('.acq-lab')).toBeVisible();
  await page.locator('.lab-ctl').first().getByRole('button').first().click();
  const panel=page.locator('.acq-lab');
  await panel.getByRole('combobox',{name:'Buyer type',exact:true}).selectOption('infraFund');
  await panel.getByRole('combobox',{name:'Acquisition stage',exact:true}).selectOption('operating');
  for(const [label,value] of [
    ['Cash tax on positive operating income (%)','25'],
    ['Decommissioning / MW, native currency','1000'],
    ['Fixed transaction fees / MW, native currency','100'],
    ['Immediate refurbishment budget / MW, native currency','0'],
    ['Net debt assumed / MW, native currency','0'],
    ['Completed operating years','3'],
  ]){const field=panel.getByRole('spinbutton',{name:label,exact:true});await field.fill(value);await field.blur();}
  await panel.getByRole('checkbox',{name:'Selected revenue contracts have been obtained and can be transferred',exact:true}).check();
  await panel.getByRole('checkbox',{name:'Entry, equipment and remaining cost conditions have been checked',exact:true}).check();
  await panel.getByRole('textbox',{name:'Source document / assumption reference',exact:true}).fill('Synthetic acceptance inputs; not market evidence');
  await panel.getByRole('textbox',{name:'Source document / assumption reference',exact:true}).blur();
  await expect(panel.locator('.acq-lab-output .acq-price')).toBeVisible();
  await panel.getByRole('checkbox',{name:'Test a new loan using the platform screening terms',exact:true}).check();
  await expect(panel.locator('.acq-lab-output .acq-basis').first()).toContainText('Equity return');
  await expect(panel.locator('.acq-lab-output .acq-basis').first()).toContainText('Long-term hold');
  await panel.getByRole('button',{name:/Target annual return/}).click();
  await expect(page.locator('.acq-popover:popover-open')).toContainText('Loan interest and principal repayments');
  await page.locator('.acq-popover:popover-open').getByRole('button',{name:'Close',exact:true}).click();
  await expect(page.locator('.acq-popover:popover-open')).toHaveCount(0);
  await panel.getByRole('button',{name:/Target annual return/}).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.acq-popover:popover-open')).toHaveCount(0);
  const downloadEvent=page.waitForEvent('download');await panel.getByRole('button',{name:'Save this calculation',exact:true}).click();
  const download=await downloadEvent;expect(download.suggestedFilename()).toContain('-operating-acquisition.json');
  await page.getByRole('button',{name:'中文',exact:true}).click();
  await expect(panel.locator('.acq-lab-output .acq-basis').first()).toContainText('股东回报');
  await expect(panel.getByRole('button',{name:/目标年化收益率/})).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  expect(overflow).toBe(false);
  await panel.locator('.acq-lab-output').screenshot({path:testInfo.outputPath('acquisition-operating-zh.png')});
  expect(errors).toEqual([]);
});

test('developers have no operating acquisition option',async({page})=>{
  await page.goto('/investment-lab');
  const panel=page.locator('.acq-lab');await expect(panel).toBeVisible();
  await panel.getByRole('combobox',{name:'Buyer type',exact:true}).selectOption('developer');
  await expect(panel.locator('option[value="operating"]')).toHaveCount(0);
});
