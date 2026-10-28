import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';

test.beforeEach(async({page})=>{
  // Live checks must load the production origin, while external telemetry and
  // fonts stay excluded just as they are during local preview checks.
  await page.route(/^https:\/\//,route=>new URL(route.request().url()).origin===process.env.PLATFORM_TEST_BASE_URL?route.continue():route.abort());
});

test('home leads with a concise investment view for four investor profiles',async({page},testInfo)=>{
  await page.goto('/');
  const profile=page.getByRole('combobox',{name:'Investor profile',exact:true});
  await expect(profile.locator('option')).toHaveCount(4);
  await expect(page.locator('.ix-featured .ix-metric')).toHaveCount(2);
  await expect(page.locator('.ix-picks article')).toHaveCount(3);
  await expect(page.locator('.ix-lead').first()).toContainText('Prioritise Italy');
  await expect(page.locator('.acq-popover')).toHaveCount(0);
  await profile.selectOption('developer');
  await expect(profile).toHaveValue('developer');
  await page.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
  await expect(page.getByRole('combobox',{name:'投资者类型',exact:true})).toHaveValue('developer');
  await expect(page.locator('main')).toContainText('重点关注');
  await expect(page.locator('main')).not.toContainText('what-if');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  await page.screenshot({path:testInfo.outputPath('investment-brief-zh.png')});
});

test('investors filter, sort and compare consistent market cases in both languages',async({page},testInfo)=>{
  await page.goto('/returns');
  await page.getByRole('checkbox',{name:'Compare Italy',exact:true}).check();
  await page.getByRole('checkbox',{name:'Compare Finland',exact:true}).check();
  await page.getByRole('combobox',{name:'Sort markets',exact:true}).selectOption('return');
  await page.reload();
  await expect(page.getByRole('combobox',{name:'Sort markets',exact:true})).toHaveValue('return');
  await expect(page.getByRole('checkbox',{name:'Compare Italy',exact:true})).toBeChecked();
  await page.getByRole('button',{name:'Compare side by side ↗',exact:true}).click();
  await expect(page.locator('.ix-comparison-card')).toHaveCount(2);
  await expect(page.getByRole('dialog')).toContainText('Modelled fixed income');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:'Compare side by side ↗',exact:true})).toBeFocused();
  await page.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
  await page.getByRole('button',{name:'并排比较 ↗',exact:true}).click();
  await expect(page.getByRole('dialog')).toContainText('意大利');
  await expect(page.getByRole('dialog')).toContainText('芬兰');
  await expect(page.getByRole('dialog')).toContainText('14.4%');
  await page.screenshot({path:testInfo.outputPath('market-comparison-zh.png')});
  await page.keyboard.press('Escape');
  await page.getByRole('searchbox',{name:'搜索市场',exact:true}).fill('Finland');
  await expect(page.locator('.ix-results tbody tr')).toHaveCount(1);
  await page.getByRole('searchbox',{name:'搜索市场',exact:true}).fill('no-such-market');
  await expect(page.getByRole('button',{name:'重置筛选',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'重置筛选',exact:true}).click();
  await expect(page.locator('.ix-results tbody tr')).toHaveCount(16);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
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
  const tax=panel.getByRole('spinbutton',{name:'Corporate income tax (%)',exact:true});
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
    ['Corporate income tax (%)','25'],
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

test('a recommended play keeps its duration and awarded support when opened as a real project',async({page})=>{
  await page.goto('/markets/western-australia');
  await page.getByRole('button',{name:'Model this market ↗',exact:true}).click();
  let panel=page.locator('.acq-lab');
  await expect(panel.locator('.acq-selected-play')).toContainText('8h');
  await expect(panel.getByRole('combobox',{name:'Acquisition stage',exact:true})).toHaveValue('ready-to-build');
  await expect(panel.locator('option[value="greenfield"]')).toHaveCount(0);
  let event=page.waitForEvent('download');await panel.getByRole('button',{name:'Save this calculation',exact:true}).click();
  let downloaded=await event;
  let saved=JSON.parse(await readFile(await downloaded.path(),'utf8'));
  expect(saved.input.durationHours).toBe(8);expect(saved.input.stage).toBe('ready-to-build');
  await page.goto('/markets/poland');
  await page.getByRole('button',{name:'Model this market ↗',exact:true}).click();
  panel=page.locator('.acq-lab');
  await expect(panel.locator('.acq-selected-play')).toContainText('4h');
  await expect(panel.getByRole('combobox',{name:'Income arrangement',exact:true})).toHaveValue('mer');
  event=page.waitForEvent('download');await panel.getByRole('button',{name:'Save this calculation',exact:true}).click();
  downloaded=await event;saved=JSON.parse(await readFile(await downloaded.path(),'utf8'));
  expect(saved.input.scenarios.some(s=>s.recoveries.some(r=>r.kind==='capital-grant'&&r.amount>0))).toBe(true);
});

test('income, lifetime and return inputs expose workable contract and connection terms',async({page},testInfo)=>{
  await page.goto('/markets/finland');
  await page.getByRole('button',{name:'Model this market ↗',exact:true}).click();
  const panel=page.locator('.acq-lab');await expect(panel).toBeVisible();
  await panel.getByRole('combobox',{name:'Income arrangement',exact:true}).selectOption('conditional-toll');
  for(const [label,value] of [
    ['Seller asking price / MW (optional)','50000'],['Your target annual return (%)','10'],
    ['Total operating life from commissioning (years)','20'],['Fixed annual contract income / MW','60000'],
    ['Contract term from commissioning (years)','10'],['Remaining construction and grid budget / MW','200000'],
    ['Of that: construction not under fixed-price contracts / MW','0'],['Months from closing to operation','12'],
  ]){const field=panel.getByRole('spinbutton',{name:label,exact:true});await field.fill(value);await field.blur();}
  await panel.locator('.acq-workable>summary').click();
  const terms=panel.locator('.acq-workable-content');
  await expect(terms).toContainText('10.0%');await expect(terms).toContainText('Minimum annual fixed income');
  await expect(terms).toContainText('delayed 6 months');await expect(terms).toContainText('delayed 12 months');
  await expect(terms.locator('tbody tr')).toHaveCount(4);
  await panel.getByRole('combobox',{name:'Return ownership route',exact:true}).selectOption('hold');
  const before=await panel.locator('.acq-at-price>p').innerText();
  await panel.getByRole('combobox',{name:'Return ownership route',exact:true}).selectOption('sale');
  await expect(panel.locator('.acq-at-price>p')).not.toHaveText(before);
  await page.getByRole('button',{name:'中文',exact:true}).click();
  await panel.locator('.acq-workable>summary').click();
  await expect(panel.locator('.acq-workable-content')).toContainText('固定收入合同');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  await panel.locator('.acq-lab-output').screenshot({path:testInfo.outputPath('acquisition-workable-terms-zh.png')});
});

