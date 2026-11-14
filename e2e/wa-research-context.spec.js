import { test, expect } from '@playwright/test';

const context = (page, chapter, slot) => page.locator(`.ix-research-context[data-research-chapter="${chapter}"]${slot ? `[data-research-slot="${slot}"]` : ':not([data-research-slot])'}`);
async function open(node){
  await node.evaluate(el => {
    for (let p = el.parentElement; p; p = p.parentElement) if (p.tagName === 'DETAILS') p.open = true;
    el.open = true;
  });
  await expect(node.locator('.ix-research-context-body')).toHaveAttribute('aria-busy', 'false');
}
async function visit(page){
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('hub_lang', 'en'));
  await page.goto('/markets/western-australia');
  await expect(page.locator('#sources')).toBeVisible();
}
const tab = (scope, id) => scope.locator(`[data-research-section="${id}"] .ix-research-card-body`);

test.beforeEach(async({page}) => { await page.route(/^https:\/\//, r => r.abort()); });

test('WA controls repaint connected excerpts without closing disclosures or changing the decision', async({page}) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await visit(page);
  const bankable = context(page, 'bankable');
  const revenue = context(page, 'revenue');
  const downside = context(page, 'downside');
  const decision = await page.locator('#bankable').evaluate(el => {
    const clone = el.cloneNode(true); clone.querySelectorAll('.ix-research-context').forEach(n => n.remove()); return clone.textContent;
  });
  await open(bankable); await open(revenue); await open(downside);
  const rcm = tab(bankable, 'rcm');
  await rcm.getByRole('button', { name: 'Real (2028 A$)', exact: true }).click();
  await expect(rcm.getByRole('button', { name: 'Real (2028 A$)', exact: true })).toHaveClass(/active/);
  const duration = tab(revenue, 'duration');
  await expect(duration.locator('select.inp')).toHaveCount(0);
  await expect(duration).toContainText('ESR Duration Requirement trajectory');
  const pipeline = tab(downside, 'pipeline');
  const probability = pipeline.locator('input[type="number"]').first();
  await probability.fill('50'); await probability.press('Tab');
  await expect(pipeline.locator('input[type="number"]').first()).toHaveValue('50');
  for (const node of [bankable, revenue, downside]) await expect(node).toHaveAttribute('open', '');
  await expect(page).toHaveURL(/\/markets\/western-australia$/);
  expect(await page.locator('#bankable').evaluate(el => {
    const clone = el.cloneNode(true); clone.querySelectorAll('.ix-research-context').forEach(n => n.remove()); return clone.textContent;
  })).toBe(decision);
  expect(errors).toEqual([]);
});

test('WA reader controls stay in sync with connected research and survive evidence navigation', async({page}) => {
  await visit(page);
  const bankable = context(page, 'bankable');
  await open(bankable);
  await tab(bankable, 'rcm').getByRole('button', { name: 'Real (2028 A$)', exact: true }).first().click();
  await page.locator('#revenue-rcm > summary').click();
  const reader = page.locator('#revenue-rcm .market-revenue-body');
  await expect(reader).toHaveAttribute('aria-busy','false');
  await expect(reader.getByRole('button', {name:'Real (2028 A$)', exact:true})).toHaveClass(/active/);
  await reader.getByRole('button', {name:'Nominal A$', exact:true}).click();
  await expect(tab(bankable,'rcm').getByRole('button',{name:'Nominal A$', exact:true})).toHaveClass(/active/);
  await reader.locator(':scope > .ix-text-link').click();
  await expect(page).toHaveURL(/\/markets\/western-australia\/evidence$/);
  await expect(reader).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/\/markets\/western-australia$/);
  await open(context(page,'bankable'));
  await expect(tab(context(page,'bankable'),'rcm').getByRole('button',{name:'Nominal A$',exact:true})).toHaveClass(/active/);
});

test('WA unified reading reaches the research bridge and Back restores its chapter', async({page}) => {
  await visit(page);
  await page.locator('.public-story-trigger').click();
  const dialog = page.locator('.public-story-dialog');
  await dialog.locator('.public-story-nav button[data-chapter="research"]').click();
  await expect(dialog.locator('.ix-research-summary')).toHaveAttribute('aria-busy', 'false');
  await dialog.getByRole('button', {name: 'Open full research', exact: true}).click();
  await expect(page).toHaveURL(/\/markets\/western-australia\/(?:home|story)$/);
  await expect(dialog).toHaveCount(0);
  await page.locator('.walk-step').filter({hasText: 'Storage Duration'}).click();
  await expect(page).toHaveURL(/\/markets\/western-australia\/duration$/);
  await expect(page.locator('.public-story-dialog')).toHaveCount(0);
  await expect(page.locator('#revenue-duration')).toHaveAttribute('open','');
  await expect(page.locator('#revenue-duration .market-revenue-body')).toHaveAttribute('aria-busy','false');
  await expect(page.locator('#revenue-duration select.inp')).toHaveCount(0);
  await expect(page.locator('#revenue-duration')).toContainText('ESR Duration Requirement trajectory');
  await page.goBack();
  await expect(page).toHaveURL(/\/markets\/western-australia\/story$/);
  await expect(page.locator('.walk-step').filter({hasText: 'Storage Duration'})).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/markets\/western-australia(?:\?|$)/);
  await expect(page.locator('.public-story-dialog')).toBeVisible();
  await expect(page.locator('.public-story-nav [data-chapter="research"]')).toHaveAttribute('aria-current', 'step');
});
