import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{
  await page.route(/^https:\/\//,route=>route.abort());
});

test('home omits unpriced purchase rows and confusing economics flags',async({page})=>{
  await page.goto('/');
  await expect(page.locator('.bf-lens')).toBeVisible();
  await expect(page.locator('.bf-call-flag')).toHaveCount(0);
  const rows=page.locator('.acq-row');
  if(await rows.count()){
    for(const row of await rows.all()){
      await expect(row.locator('.acq-price')).toBeVisible();
      await expect(row.getByRole('button',{name:/Target annual return/})).toBeVisible();
    }
  }else await expect(page.locator('.acq-home')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText('calls run against the economics');
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
  await expect(panel.locator('.acq-basis')).toContainText('Equity return');
  await expect(panel.locator('.acq-basis')).toContainText('Long-term hold');
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
  await expect(panel.locator('.acq-basis')).toContainText('股东回报');
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
